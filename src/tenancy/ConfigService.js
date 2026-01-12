import { localStorageAdapter } from '@/config/adapters/LocalStorageAdapter'
import { supabaseAdapter } from '@/config/adapters/SupabaseAdapter'
import { isSupabaseConfigured } from '@/lib/supabase'
import { validateTenantConfig, parseTenantConfig } from '@/config/schema'
import { getDefaultTenantConfig, DEFAULT_LAYOUTS } from '@/config/defaults'
import { tenantAConfig } from '@/config/tenants/tenantA'
import { tenantBConfig } from '@/config/tenants/tenantB'

/**
 * ConfigService - Single entry point for all tenant configuration operations
 * Handles CRUD operations with validation and storage adapter abstraction
 */
class ConfigService {
    constructor() {
        // Auto-select adapter based on environment
        this.adapter = isSupabaseConfigured ? supabaseAdapter : localStorageAdapter
        console.log(`ConfigService initialized with ${isSupabaseConfigured ? 'Supabase' : 'LocalStorage'} adapter`)

        this.cache = new Map()
        this.initialized = false
    }

    /**
     * Initialize the service with mock data if needed
     */
    async initialize() {
        // Always check if we have any tenants stored (even if previously initialized)
        // This handles the case where localStorage is cleared
        const keys = await this.adapter.keys('tenant:')

        if (keys.length === 0) {
            // Clear cache and load mock tenants
            this.cache.clear()

            const resultA = await this.saveTenantConfig(tenantAConfig)
            console.log('Tenant A save result:', resultA)

            const resultB = await this.saveTenantConfig(tenantBConfig)
            console.log('Tenant B save result:', resultB)

            console.log('Mock tenants initialized')
        }

        this.initialized = true
    }

    /**
     * Get tenant configuration by ID
     * @param {string} tenantId - Tenant ID
     * @returns {Promise<object|null>} Tenant configuration or null
     */
    async getTenantConfig(tenantId) {
        // Check cache first
        if (this.cache.has(tenantId)) {
            return this.cache.get(tenantId)
        }

        const config = await this.adapter.get(`tenant:${tenantId}`)

        if (config) {
            // Validate and parse with defaults
            try {
                const parsed = parseTenantConfig(config)
                this.cache.set(tenantId, parsed)
                return parsed
            } catch (error) {
                console.error(`Invalid config for tenant ${tenantId}:`, error)
                return null
            }
        }

        return null
    }

    /**
     * Save tenant configuration
     * @param {object} config - Tenant configuration
     * @returns {Promise<{ success: boolean, error?: string }>}
     */
    async saveTenantConfig(config) {
        // Validate configuration
        const validation = validateTenantConfig(config)

        if (!validation.success) {
            return { success: false, error: validation.error }
        }

        // Add/update timestamps
        const configWithMeta = {
            ...validation.data,
            updatedAt: new Date().toISOString(),
            createdAt: config.createdAt || new Date().toISOString(),
        }

        // Save to storage
        await this.adapter.set(`tenant:${config.id}`, configWithMeta)

        // Update cache
        this.cache.set(config.id, configWithMeta)

        return { success: true }
    }

    /**
     * Update partial tenant configuration
     * @param {string} tenantId - Tenant ID
     * @param {object} updates - Partial updates
     * @returns {Promise<{ success: boolean, config?: object, error?: string }>}
     */
    async updateTenantConfig(tenantId, updates) {
        const existing = await this.getTenantConfig(tenantId)

        if (!existing) {
            return { success: false, error: `Tenant ${tenantId} not found` }
        }

        // Deep merge updates
        const merged = this._deepMerge(existing, updates)
        merged.updatedAt = new Date().toISOString()

        // Validate merged config
        const result = await this.saveTenantConfig(merged)

        if (result.success) {
            return { success: true, config: merged }
        }

        return result
    }

    /**
     * Delete tenant configuration
     * @param {string} tenantId - Tenant ID
     * @returns {Promise<void>}
     */
    async deleteTenantConfig(tenantId) {
        await this.adapter.delete(`tenant:${tenantId}`)
        this.cache.delete(tenantId)
    }

    /**
     * Get all tenant IDs
     * @returns {Promise<string[]>}
     */
    async getAllTenantIds() {
        const keys = await this.adapter.keys('tenant:')
        return keys.map((key) => key.replace('tenant:', ''))
    }

    /**
     * Get all tenant configurations
     * @returns {Promise<object[]>}
     */
    async getAllTenants() {
        const ids = await this.getAllTenantIds()
        const tenants = await Promise.all(ids.map((id) => this.getTenantConfig(id)))
        return tenants.filter(Boolean)
    }

    /**
     * Create a new tenant with default configuration
     * @param {string} tenantId - Tenant ID
     * @param {string} name - Tenant name
     * @param {object} overrides - Optional configuration overrides
     * @returns {Promise<{ success: boolean, config?: object, error?: string }>}
     */
    async createTenant(tenantId, name, overrides = {}) {
        const existing = await this.getTenantConfig(tenantId)

        if (existing) {
            return { success: false, error: `Tenant ${tenantId} already exists` }
        }

        const config = this._deepMerge(getDefaultTenantConfig(tenantId, name), overrides)
        const result = await this.saveTenantConfig(config)

        if (result.success) {
            return { success: true, config }
        }

        return result
    }

    /**
     * Reset tenant to default layout
     * @param {string} tenantId - Tenant ID
     * @param {string} pageId - Page ID (or 'all' for all pages)
     * @returns {Promise<{ success: boolean, error?: string }>}
     */
    async resetLayout(tenantId, pageId = 'all') {
        const existing = await this.getTenantConfig(tenantId)

        if (!existing) {
            return { success: false, error: `Tenant ${tenantId} not found` }
        }

        let newLayouts
        if (pageId === 'all') {
            newLayouts = { ...DEFAULT_LAYOUTS }
        } else {
            newLayouts = {
                ...existing.layouts,
                [pageId]: DEFAULT_LAYOUTS[pageId] || [],
            }
        }

        return this.updateTenantConfig(tenantId, { layouts: newLayouts })
    }

    /**
     * Update page layout
     * @param {string} tenantId - Tenant ID
     * @param {string} pageId - Page ID
     * @param {Array} widgets - Widget instances
     * @returns {Promise<{ success: boolean, error?: string }>}
     */
    async updatePageLayout(tenantId, pageId, widgets) {
        return this.updateTenantConfig(tenantId, {
            layouts: {
                [pageId]: widgets,
            },
        })
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear()
    }

    /**
     * Deep merge helper
     * @private
     */
    _deepMerge(target, source) {
        const output = { ...target }

        if (this._isObject(target) && this._isObject(source)) {
            Object.keys(source).forEach((key) => {
                if (this._isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, { [key]: source[key] })
                    } else {
                        output[key] = this._deepMerge(target[key], source[key])
                    }
                } else {
                    Object.assign(output, { [key]: source[key] })
                }
            })
        }

        return output
    }

    /**
     * Check if value is object
     * @private
     */
    _isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item)
    }
}

// Export singleton instance
export const configService = new ConfigService()

