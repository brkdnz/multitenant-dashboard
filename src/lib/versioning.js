/**
 * Configuration Versioning Service
 * Tracks version history of tenant configurations for rollback capability
 */

const VERSION_PREFIX = 'config-version:'
const MAX_VERSIONS = 10

/**
 * Save a new version of tenant configuration
 * @param {string} tenantId - Tenant ID
 * @param {object} config - Configuration to save
 * @param {string} description - Version description
 * @returns {object} Version metadata
 */
export function saveConfigVersion(tenantId, config, description = 'Manual save') {
    const versions = getConfigVersions(tenantId)

    const version = {
        id: `v-${Date.now()}`,
        tenantId,
        timestamp: new Date().toISOString(),
        description,
        config: JSON.parse(JSON.stringify(config)), // Deep clone
    }

    // Add to beginning
    versions.unshift(version)

    // Trim to max versions
    if (versions.length > MAX_VERSIONS) {
        versions.length = MAX_VERSIONS
    }

    localStorage.setItem(`${VERSION_PREFIX}${tenantId}`, JSON.stringify(versions))

    return version
}

/**
 * Get all config versions for a tenant
 * @param {string} tenantId - Tenant ID
 * @returns {Array} Version history
 */
export function getConfigVersions(tenantId) {
    try {
        const data = localStorage.getItem(`${VERSION_PREFIX}${tenantId}`)
        return data ? JSON.parse(data) : []
    } catch (error) {
        console.error('Failed to get config versions:', error)
        return []
    }
}

/**
 * Get a specific config version
 * @param {string} tenantId - Tenant ID
 * @param {string} versionId - Version ID
 * @returns {object|null} Version data
 */
export function getConfigVersion(tenantId, versionId) {
    const versions = getConfigVersions(tenantId)
    return versions.find((v) => v.id === versionId) || null
}

/**
 * Rollback to a specific version
 * @param {string} tenantId - Tenant ID
 * @param {string} versionId - Version ID to rollback to
 * @returns {object|null} The config from that version
 */
export function rollbackToVersion(tenantId, versionId) {
    const version = getConfigVersion(tenantId, versionId)

    if (!version) {
        console.error(`Version ${versionId} not found for tenant ${tenantId}`)
        return null
    }

    return version.config
}

/**
 * Delete all versions for a tenant
 * @param {string} tenantId - Tenant ID
 */
export function clearVersionHistory(tenantId) {
    localStorage.removeItem(`${VERSION_PREFIX}${tenantId}`)
}

/**
 * Get the latest version for a tenant
 * @param {string} tenantId - Tenant ID
 * @returns {object|null} Latest version
 */
export function getLatestVersion(tenantId) {
    const versions = getConfigVersions(tenantId)
    return versions.length > 0 ? versions[0] : null
}

/**
 * Compare two versions
 * @param {object} version1 - First version config
 * @param {object} version2 - Second version config
 * @returns {Array} List of differences
 */
export function compareVersions(version1, version2) {
    const differences = []

    const compare = (obj1, obj2, path = '') => {
        const keys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})])

        keys.forEach((key) => {
            const newPath = path ? `${path}.${key}` : key
            const val1 = obj1?.[key]
            const val2 = obj2?.[key]

            if (typeof val1 === 'object' && typeof val2 === 'object' && !Array.isArray(val1)) {
                compare(val1, val2, newPath)
            } else if (JSON.stringify(val1) !== JSON.stringify(val2)) {
                differences.push({
                    path: newPath,
                    before: val1,
                    after: val2,
                })
            }
        })
    }

    compare(version1, version2)
    return differences
}
