import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useStore } from '@/app/store'
import { configService } from './ConfigService'
import { useAuth } from '@/auth/AuthContext'
import { getUserRole, createRBACContext } from '@/lib/rbac'

/**
 * Tenant Context
 * Provides current tenant configuration and update methods throughout the app
 */
const TenantContext = createContext(null)

/**
 * Tenant Provider Component
 * Wraps the application and provides tenant context
 */
export function TenantProvider({ children, tenantId }) {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    // RBAC
    const { user } = useAuth()
    const [userRole, setUserRole] = useState('guest')
    const [rbacContext, setRbacContext] = useState(() => createRBACContext('guest'))

    const loadTenant = useStore((state) => state.loadTenant)
    const setCurrentTenant = useStore((state) => state.setCurrentTenant)
    const getCurrentTenant = useStore((state) => state.getCurrentTenant)
    const updateTenantConfig = useStore((state) => state.updateTenantConfig)
    const applyTheme = useStore((state) => state.applyTheme)

    // Load tenant configuration on mount or tenant change
    useEffect(() => {
        async function loadTenantConfig() {
            if (!tenantId) {
                setError('No tenant ID provided')
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                setError(null)

                // Initialize config service (loads mock data if needed)
                await configService.initialize()

                // Get tenant config
                const config = await configService.getTenantConfig(tenantId)

                if (!config) {
                    setError(`Tenant "${tenantId}" not found`)
                    setIsLoading(false)
                    return
                }

                // Load into store
                loadTenant(tenantId, config)
                setCurrentTenant(tenantId)

                // Apply theme
                applyTheme(config.theme)

                setIsLoading(false)
            } catch (err) {
                console.error('Failed to load tenant:', err)
                setError(err.message || 'Failed to load tenant configuration')
                setIsLoading(false)
            }
        }

        loadTenantConfig()
    }, [tenantId, loadTenant, setCurrentTenant, applyTheme])

    // Fetch User Role
    useEffect(() => {
        async function fetchRole() {
            if (user && tenantId) {
                const role = await getUserRole(user.id, tenantId)
                setUserRole(role)
                setRbacContext(createRBACContext(role))
            } else {
                setUserRole('guest')
                setRbacContext(createRBACContext('guest'))
            }
        }
        fetchRole()
    }, [user, tenantId])

    /**
     * Update current tenant configuration
     */
    const updateConfig = useCallback(
        async (updates) => {
            if (!tenantId) return { success: false, error: 'No tenant ID' }

            try {
                // Update in store (for immediate UI update)
                updateTenantConfig(tenantId, updates)

                // Persist to storage
                const result = await configService.updateTenantConfig(tenantId, updates)

                return result
            } catch (err) {
                console.error('Failed to update tenant config:', err)
                return { success: false, error: err.message }
            }
        },
        [tenantId, updateTenantConfig]
    )

    /**
     * Save all pending changes
     */
    const saveChanges = useCallback(async () => {
        const tenant = getCurrentTenant()
        if (!tenant) return { success: false, error: 'No tenant loaded' }

        try {
            const result = await configService.saveTenantConfig(tenant)
            return result
        } catch (err) {
            console.error('Failed to save tenant config:', err)
            return { success: false, error: err.message }
        }
    }, [getCurrentTenant])

    /**
     * Reset layout to defaults
     */
    const resetLayout = useCallback(
        async (pageId = 'all') => {
            if (!tenantId) return { success: false, error: 'No tenant ID' }

            try {
                const result = await configService.resetLayout(tenantId, pageId)

                if (result.success) {
                    // Reload tenant config
                    const config = await configService.getTenantConfig(tenantId)
                    loadTenant(tenantId, config)
                }

                return result
            } catch (err) {
                console.error('Failed to reset layout:', err)
                return { success: false, error: err.message }
            }
        },
        [tenantId, loadTenant]
    )

    const value = {
        tenantId,
        isLoading,
        error,
        updateConfig,
        saveChanges,
        resetLayout,
        // RBAC
        userRole,
        rbac: rbacContext,
    }

    return (
        <TenantContext.Provider value={value}>
            {children}
        </TenantContext.Provider>
    )
}

/**
 * Hook to access tenant context
 * @returns {{ tenantId: string, isLoading: boolean, error: string|null, updateConfig: Function, saveChanges: Function, resetLayout: Function }}
 */
export function useTenantContext() {
    const context = useContext(TenantContext)

    if (!context) {
        throw new Error('useTenantContext must be used within a TenantProvider')
    }

    return context
}

/**
 * Hook to get current tenant configuration
 */
export function useTenant() {
    const store = useStore()
    return store.getCurrentTenant()
}

/**
 * Hook to get specific tenant config section
 * @param {string} section - Section name (theme, branding, sidebar, i18n, drag, layouts)
 */
export function useTenantSection(section) {
    const tenant = useTenant()
    return tenant?.[section] || null
}

export { TenantContext }
