/**
 * Audit Log Service
 * Tracks all configuration changes with timestamps, user info, and detailed action data
 */

const AUDIT_LOG_KEY = 'audit-log'
const MAX_LOG_ENTRIES = 500

/**
 * Audit log entry structure with detailed information
 */
const createLogEntry = (action, details, tenantId = null, metadata = {}) => ({
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    action,
    tenantId,
    userId: metadata.userId || 'system',
    userName: metadata.userName || 'System',
    userRole: metadata.userRole || 'admin',
    ipAddress: metadata.ipAddress || 'localhost',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    details: {
        ...details,
        // Add before/after values for tracking changes
        previousValue: details.previousValue || null,
        newValue: details.newValue || null,
        affectedItems: details.affectedItems || [],
        reason: details.reason || null,
    },
    category: getActionCategory(action),
    severity: getActionSeverity(action),
})

/**
 * Get category for an action
 */
function getActionCategory(action) {
    if (action.startsWith('theme.')) return 'Theme'
    if (action.startsWith('sidebar.')) return 'Sidebar'
    if (action.startsWith('i18n.')) return 'Language'
    if (action.startsWith('drag.')) return 'Drag & Drop'
    if (action.startsWith('widget.')) return 'Widget'
    if (action.startsWith('layout.')) return 'Layout'
    if (action.startsWith('config.')) return 'Configuration'
    if (action.startsWith('rbac.')) return 'Access Control'
    return 'General'
}

/**
 * Get severity for an action
 */
function getActionSeverity(action) {
    const criticalActions = ['config.rollback', 'layout.reset', 'rbac.role.delete']
    const warningActions = ['widget.remove', 'i18n.override.remove', 'drag.global.toggle']

    if (criticalActions.includes(action)) return 'critical'
    if (warningActions.includes(action)) return 'warning'
    return 'info'
}

/**
 * Get all audit log entries
 * @returns {Array} Log entries
 */
export function getAuditLog() {
    try {
        const logs = localStorage.getItem(AUDIT_LOG_KEY)
        return logs ? JSON.parse(logs) : []
    } catch (error) {
        console.error('Failed to get audit log:', error)
        return []
    }
}

/**
 * Add entry to audit log with detailed information
 * @param {string} action - Action type
 * @param {object} details - Action details with before/after values
 * @param {string} tenantId - Tenant ID
 * @param {object} metadata - User and session metadata
 */
export function logAction(action, details, tenantId = null, metadata = {}) {
    try {
        // Local Storage logging (Sync)
        const logs = getAuditLog()
        const entry = createLogEntry(action, details, tenantId, metadata)

        // Add to beginning of array
        logs.unshift(entry)

        // Trim to max entries
        if (logs.length > MAX_LOG_ENTRIES) {
            logs.length = MAX_LOG_ENTRIES
        }

        localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs))

        // Console log
        console.log(`[Audit] ${action}`, { tenantId, details, severity: entry.severity })

        // Supabase logging (Async - Fire and forget)
        import('@/lib/supabase').then(({ supabase }) => {
            if (supabase) {
                supabase.from('audit_logs').insert({
                    tenant_id: tenantId || 'system', // 'system' or valid tenant id
                    // If tenantId is null/system, RLS might block if not handled. 
                    // Our RLS allows authenticated insert. 
                    user_id: metadata.userId === 'system' ? null : metadata.userId,
                    action: action,
                    details: entry
                }).then(({ error }) => {
                    if (error) console.error('Supabase audit log error:', error)
                })
            }
        })

        return entry
    } catch (error) {
        console.error('Failed to log action:', error)
        return null
    }
}

/**
 * Log with before/after values helper
 */
export function logChange(action, field, previousValue, newValue, tenantId, metadata = {}) {
    return logAction(action, {
        field,
        previousValue,
        newValue,
        changedAt: new Date().toISOString(),
    }, tenantId, metadata)
}

/**
 * Get audit log entries for a specific tenant
 * @param {string} tenantId - Tenant ID
 * @returns {Array} Filtered log entries
 */
export function getTenantAuditLog(tenantId) {
    return getAuditLog().filter((entry) => entry.tenantId === tenantId)
}

/**
 * Get audit log by category
 * @param {string} category - Category name
 * @returns {Array} Filtered log entries
 */
export function getAuditLogByCategory(category) {
    return getAuditLog().filter((entry) => entry.category === category)
}

/**
 * Get audit log by severity
 * @param {string} severity - Severity level
 * @returns {Array} Filtered log entries
 */
export function getAuditLogBySeverity(severity) {
    return getAuditLog().filter((entry) => entry.severity === severity)
}

/**
 * Get audit log by date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array} Filtered log entries
 */
export function getAuditLogByDateRange(startDate, endDate) {
    return getAuditLog().filter((entry) => {
        const entryDate = new Date(entry.timestamp)
        return entryDate >= startDate && entryDate <= endDate
    })
}

/**
 * Search audit log
 * @param {string} query - Search query
 * @returns {Array} Matching log entries
 */
export function searchAuditLog(query) {
    const lowerQuery = query.toLowerCase()
    return getAuditLog().filter((entry) =>
        entry.action.toLowerCase().includes(lowerQuery) ||
        entry.category.toLowerCase().includes(lowerQuery) ||
        JSON.stringify(entry.details).toLowerCase().includes(lowerQuery)
    )
}

/**
 * Get audit log statistics
 * @returns {object} Statistics
 */
export function getAuditLogStats() {
    const logs = getAuditLog()

    const byCategory = {}
    const bySeverity = { info: 0, warning: 0, critical: 0 }
    const byHour = {}

    logs.forEach((entry) => {
        // By category
        byCategory[entry.category] = (byCategory[entry.category] || 0) + 1

        // By severity
        bySeverity[entry.severity] = (bySeverity[entry.severity] || 0) + 1

        // By hour (last 24h)
        const hour = new Date(entry.timestamp).getHours()
        byHour[hour] = (byHour[hour] || 0) + 1
    })

    return {
        total: logs.length,
        byCategory,
        bySeverity,
        byHour,
        lastEntry: logs[0] || null,
    }
}

/**
 * Clear all audit log entries
 */
export function clearAuditLog() {
    localStorage.removeItem(AUDIT_LOG_KEY)
}

/**
 * Export audit log as JSON
 */
export function exportAuditLog() {
    const logs = getAuditLog()
    return JSON.stringify(logs, null, 2)
}

/**
 * Action type constants
 */
export const AuditActions = {
    // Theme actions
    THEME_MODE_CHANGE: 'theme.mode.change',
    THEME_COLOR_CHANGE: 'theme.color.change',
    THEME_RADIUS_CHANGE: 'theme.radius.change',

    // Sidebar actions
    SIDEBAR_MODE_CHANGE: 'sidebar.mode.change',
    SIDEBAR_BRANDING_CHANGE: 'sidebar.branding.change',
    SIDEBAR_WIDTH_CHANGE: 'sidebar.width.change',

    // i18n actions
    I18N_TOGGLE: 'i18n.toggle',
    I18N_LANGUAGE_CHANGE: 'i18n.language.change',
    I18N_OVERRIDE_ADD: 'i18n.override.add',
    I18N_OVERRIDE_REMOVE: 'i18n.override.remove',

    // Drag actions
    DRAG_GLOBAL_TOGGLE: 'drag.global.toggle',
    DRAG_PAGE_OVERRIDE: 'drag.page.override',
    DRAG_WIDGET_OVERRIDE: 'drag.widget.override',

    // Widget actions
    WIDGET_ADD: 'widget.add',
    WIDGET_REMOVE: 'widget.remove',
    WIDGET_REORDER: 'widget.reorder',
    WIDGET_PROPS_UPDATE: 'widget.props.update',
    WIDGET_PERMISSION_CHANGE: 'widget.permission.change',

    // Layout actions
    LAYOUT_RESET: 'layout.reset',
    LAYOUT_IMPORT: 'layout.import',
    LAYOUT_EXPORT: 'layout.export',

    // Config actions
    CONFIG_SAVE: 'config.save',
    CONFIG_ROLLBACK: 'config.rollback',
    CONFIG_IMPORT: 'config.import',
    CONFIG_EXPORT: 'config.export',

    // RBAC actions
    RBAC_ROLE_CHANGE: 'rbac.role.change',
    RBAC_WIDGET_PERMISSION: 'rbac.widget.permission',
    RBAC_USER_ROLE_ASSIGN: 'rbac.user.role.assign',
}

/**
 * Severity colors for UI
 */
export const SeverityColors = {
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

/**
 * Category colors for UI  
 */
export const CategoryColors = {
    Theme: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    Sidebar: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    Language: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'Drag & Drop': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    Widget: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
    Layout: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
    Configuration: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    'Access Control': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    General: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
}
