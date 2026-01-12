/**
 * Role-Based Access Control (RBAC) for Widgets
 * Controls widget visibility based on user roles
 */

import { supabase } from '@/lib/supabase'

/**
 * Default roles
 */
export const Roles = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    USER: 'user',
    GUEST: 'guest',
}

/**
 * Fetch user role for a specific tenant from database
 * @param {string} userId 
 * @param {string} tenantId 
 * @returns {Promise<string>} Role name (defaults to GUEST)
 */
export async function getUserRole(userId, tenantId) {
    if (!userId || !tenantId || !supabase) return Roles.GUEST

    try {
        const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .eq('tenant_id', tenantId)
            .single()

        if (error) {
            if (error.code !== 'PGRST116') { // PGRST116 = no rows returned
                console.warn('Error fetching user role:', error)
            }
            return Roles.GUEST
        }

        return data?.role || Roles.GUEST
    } catch (err) {
        console.warn('Failed to fetch role:', err)
        return Roles.GUEST
    }
}

/**
 * Assign or update a user's role for a tenant
 * @param {string} userId 
 * @param {string} tenantId 
 * @param {string} role 
 */
export async function assignUserRole(userId, tenantId, role) {
    if (!userId || !tenantId || !supabase) throw new Error('Invalid arguments')

    const { error } = await supabase
        .from('user_roles')
        .upsert({
            user_id: userId,
            tenant_id: tenantId,
            role: role
        }, { onConflict: 'user_id, tenant_id' })

    if (error) throw error
    return true
}

/**
 * Role hierarchy (higher index = more permissions)
 */
const roleHierarchy = [Roles.GUEST, Roles.USER, Roles.MANAGER, Roles.ADMIN]

/**
 * Check if a role has access to another role's permissions
 * @param {string} userRole - Current user's role
 * @param {string} requiredRole - Required role for access
 * @returns {boolean}
 */
export function hasRoleAccess(userRole, requiredRole) {
    const userIndex = roleHierarchy.indexOf(userRole)
    const requiredIndex = roleHierarchy.indexOf(requiredRole)

    if (userIndex === -1 || requiredIndex === -1) {
        return false
    }

    return userIndex >= requiredIndex
}

/**
 * Check if user can view a widget based on widget type permissions
 * @param {object} widget - Widget definition with permissions
 * @param {string} userRole - Current user's role
 * @returns {boolean}
 */
export function canViewWidget(widget, userRole) {
    // If no permissions defined, widget is public
    if (!widget.permissions || widget.permissions.length === 0) {
        return true
    }

    // Check if user's role is in allowed permissions
    return widget.permissions.some((permission) => {
        if (typeof permission === 'string') {
            return hasRoleAccess(userRole, permission)
        }
        return false
    })
}

/**
 * Check if user can view a widget INSTANCE based on instance-level permissions
 * @param {object} widgetInstance - Widget instance with optional permissions array
 * @param {object} widgetPermissions - Tenant's widget permissions config
 * @param {string} userRole - Current user's role
 * @returns {boolean}
 */
export function canViewWidgetInstance(widgetInstance, widgetPermissions, userRole) {
    // Admin can see everything
    if (userRole === Roles.ADMIN) return true

    // Check instance-level permissions first
    const instanceId = widgetInstance.id
    const instancePermissions = widgetPermissions?.[instanceId]

    if (instancePermissions) {
        // If permissions array is empty, it means hidden from everyone except admin
        if (instancePermissions.length === 0) return false

        // Check if user's role is in allowed roles
        return instancePermissions.some(role => hasRoleAccess(userRole, role))
    }

    // No instance-level override, widget is public
    return true
}

/**
 * Filter widgets based on user role (includes instance-level permissions)
 * @param {Array} widgets - Widget instances
 * @param {object} widgetPermissions - Tenant's widget permissions config
 * @param {string} userRole - Current user's role
 * @returns {Array} Filtered widgets
 */
export function filterWidgetsByRole(widgets, widgetPermissions, userRole) {
    return widgets.filter((widgetInstance) => {
        return canViewWidgetInstance(widgetInstance, widgetPermissions, userRole)
    })
}

/**
 * Get all roles as array
 * @returns {Array} Array of role objects
 */
export function getAllRoles() {
    return [
        { id: Roles.ADMIN, name: 'Administrator', description: 'Full access to everything' },
        { id: Roles.MANAGER, name: 'Manager', description: 'Can manage content and users' },
        { id: Roles.USER, name: 'User', description: 'Standard user access' },
        { id: Roles.GUEST, name: 'Guest', description: 'Limited read-only access' },
    ]
}

/**
 * Default widget permissions configuration
 */
export const defaultWidgetPermissions = {
    'stat-card': [], // Public
    'simple-table': [], // Public
    'mini-chart': [], // Public
    'admin-widget': [Roles.ADMIN], // Admin only
    'manager-widget': [Roles.MANAGER], // Manager and above
}

/**
 * RBAC Context value structure
 */
export const createRBACContext = (userRole = Roles.USER) => ({
    userRole,
    isAdmin: userRole === Roles.ADMIN,
    isManager: hasRoleAccess(userRole, Roles.MANAGER),
    canView: (widget) => canViewWidget(widget, userRole),
    canEdit: () => hasRoleAccess(userRole, Roles.MANAGER),
    canDelete: () => hasRoleAccess(userRole, Roles.ADMIN),
})
