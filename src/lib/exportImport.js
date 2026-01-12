/**
 * Layout Export/Import Utility
 * Handles exporting and importing dashboard layouts as JSON
 */

/**
 * Export tenant configuration to JSON
 * @param {object} config - Tenant configuration
 * @param {string} filename - Optional filename
 * @returns {void}
 */
export function exportConfig(config, filename) {
    const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        tenant: {
            id: config.id,
            name: config.name,
        },
        data: config,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename || `${config.id}-config-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

/**
 * Export only layouts (widgets) to JSON
 * @param {object} layouts - Layouts object
 * @param {string} tenantId - Tenant ID
 * @returns {void}
 */
export function exportLayouts(layouts, tenantId) {
    const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        type: 'layouts',
        tenantId,
        layouts,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${tenantId}-layouts-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

/**
 * Import configuration from JSON file
 * @param {File} file - JSON file
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export async function importConfig(file) {
    return new Promise((resolve) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result)

                // Validate structure
                if (!data.version || !data.data) {
                    resolve({
                        success: false,
                        error: 'Invalid config file format',
                    })
                    return
                }

                resolve({
                    success: true,
                    data: data.data,
                    meta: {
                        version: data.version,
                        exportedAt: data.exportedAt,
                        originalTenant: data.tenant,
                    },
                })
            } catch (error) {
                resolve({
                    success: false,
                    error: `Failed to parse JSON: ${error.message}`,
                })
            }
        }

        reader.onerror = () => {
            resolve({
                success: false,
                error: 'Failed to read file',
            })
        }

        reader.readAsText(file)
    })
}

/**
 * Import layouts from JSON file
 * @param {File} file - JSON file
 * @returns {Promise<{ success: boolean, layouts?: object, error?: string }>}
 */
export async function importLayouts(file) {
    return new Promise((resolve) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result)

                // Validate structure
                if (!data.layouts) {
                    // Check if it's a full config export
                    if (data.data?.layouts) {
                        resolve({
                            success: true,
                            layouts: data.data.layouts,
                        })
                        return
                    }
                    resolve({
                        success: false,
                        error: 'No layouts found in file',
                    })
                    return
                }

                resolve({
                    success: true,
                    layouts: data.layouts,
                })
            } catch (error) {
                resolve({
                    success: false,
                    error: `Failed to parse JSON: ${error.message}`,
                })
            }
        }

        reader.onerror = () => {
            resolve({
                success: false,
                error: 'Failed to read file',
            })
        }

        reader.readAsText(file)
    })
}
