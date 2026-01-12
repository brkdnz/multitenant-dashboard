/**
 * Feature Flags System
 * Manage feature toggles per tenant
 * 
 * All flags listed here are implemented and functional.
 */

/**
 * Default feature flags
 */
export const DEFAULT_FEATURE_FLAGS = {
    // Dashboard features
    widgetDrag: true,           // Widget drag & drop on home page
    widgetResize: true,         // Widget resize functionality
    widgetCustomProps: true,    // Widget custom props editing
    widgetPermissions: true,    // Per-widget role-based visibility
    snapToGrid: true,           // Visual grid guides when dragging

    // Admin features
    themeEditor: true,          // Theme tab in admin panel
    languageEditor: true,       // Language tab in admin panel
    sidebarSettings: true,      // Sidebar tab in admin panel
    dragSettings: true,         // Drag tab in admin panel

    // Advanced features
    exportImport: true,         // Export/Import tab in admin panel
    versionHistory: true,       // History tab in admin panel
    auditLog: true,             // Audit logging (background)
    rbacSettings: true,         // Access Control tab in admin panel
}

/**
 * Feature flag definitions with metadata
 */
export const FEATURE_FLAG_DEFINITIONS = {
    widgetDrag: {
        name: 'Widget Drag & Drop',
        description: 'Allow users to drag and reorder widgets on the home page',
        category: 'dashboard',
    },
    widgetResize: {
        name: 'Widget Resize',
        description: 'Allow users to resize widgets by dragging edges',
        category: 'dashboard',
    },
    widgetCustomProps: {
        name: 'Widget Custom Props',
        description: 'Allow users to edit widget properties through settings button',
        category: 'dashboard',
    },
    widgetPermissions: {
        name: 'Widget Permissions',
        description: 'Control widget visibility based on user roles',
        category: 'dashboard',
    },
    snapToGrid: {
        name: 'Snap-to-Grid',
        description: 'Show visual grid guides when dragging widgets',
        category: 'dashboard',
    },
    themeEditor: {
        name: 'Theme Editor',
        description: 'Show Theme and Presets tabs in admin panel',
        category: 'admin',
    },
    languageEditor: {
        name: 'Language Editor',
        description: 'Show Language tab in admin panel',
        category: 'admin',
    },
    sidebarSettings: {
        name: 'Sidebar Settings',
        description: 'Show Sidebar tab in admin panel',
        category: 'admin',
    },
    dragSettings: {
        name: 'Drag Settings',
        description: 'Show Drag tab in admin panel',
        category: 'admin',
    },
    exportImport: {
        name: 'Export/Import',
        description: 'Show Export tab in admin panel',
        category: 'advanced',
    },
    versionHistory: {
        name: 'Version History',
        description: 'Show History tab and enable version tracking',
        category: 'advanced',
    },
    auditLog: {
        name: 'Audit Log',
        description: 'Enable audit logging for config changes',
        category: 'advanced',
    },
    rbacSettings: {
        name: 'Access Control',
        description: 'Show Access tab in admin panel',
        category: 'advanced',
    },
}

/**
 * Get feature flag value
 * @param {object} tenantFlags - Tenant's feature flags
 * @param {string} flagName - Flag name
 * @returns {boolean}
 */
export function isFeatureEnabled(tenantFlags, flagName) {
    // Check tenant override first
    if (tenantFlags && typeof tenantFlags[flagName] === 'boolean') {
        return tenantFlags[flagName]
    }
    // Fall back to default
    return DEFAULT_FEATURE_FLAGS[flagName] ?? true
}

/**
 * Get all feature flags with values
 * @param {object} tenantFlags - Tenant's feature flags
 * @returns {object}
 */
export function getAllFeatureFlags(tenantFlags = {}) {
    const result = {}

    for (const [key, defaultValue] of Object.entries(DEFAULT_FEATURE_FLAGS)) {
        result[key] = {
            ...FEATURE_FLAG_DEFINITIONS[key],
            enabled: tenantFlags[key] ?? defaultValue,
            isOverridden: tenantFlags[key] !== undefined,
        }
    }

    return result
}

/**
 * Get flags grouped by category
 * @param {object} tenantFlags - Tenant's feature flags
 * @returns {object}
 */
export function getFeatureFlagsByCategory(tenantFlags = {}) {
    const all = getAllFeatureFlags(tenantFlags)
    const categories = {
        dashboard: [],
        admin: [],
        advanced: [],
    }

    for (const [key, flag] of Object.entries(all)) {
        const category = flag.category || 'dashboard'
        if (categories[category]) {
            categories[category].push({ key, ...flag })
        }
    }

    return categories
}
