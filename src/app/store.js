import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getDefaultTenantConfig, DARK_THEME_COLORS, DEFAULT_THEME } from '@/config/defaults'
import { deepMerge } from '@/lib/utils'

/**
 * Main application store using Zustand
 * 
 * Why Zustand over Redux Toolkit:
 * 1. 70% less boilerplate - no action creators, reducers, or slices
 * 2. Built-in persist middleware for localStorage
 * 3. Simpler API without TypeScript still provides great DX
 * 4. React DevTools integration available
 * 5. Modular slices pattern still achievable
 */

// ============= TENANT SLICE =============
const createTenantSlice = (set, get) => ({
    // Current tenant ID
    currentTenantId: null,

    // All tenant configurations
    tenants: {},

    // Loading state
    isLoading: false,

    // Error state
    error: null,

    /**
     * Set current tenant by ID
     */
    setCurrentTenant: (tenantId) => {
        set({ currentTenantId: tenantId })
        // Apply tenant's theme when switching
        const tenant = get().tenants[tenantId]
        if (tenant) {
            get().applyTheme(tenant.theme)
        }
    },

    /**
     * Get current tenant config
     */
    getCurrentTenant: () => {
        const { currentTenantId, tenants } = get()
        return tenants[currentTenantId] || null
    },

    /**
     * Load tenant configuration
     */
    loadTenant: (tenantId, config) => {
        set((state) => ({
            tenants: {
                ...state.tenants,
                [tenantId]: config,
            },
        }))
    },

    /**
     * Update tenant configuration
     */
    updateTenantConfig: (tenantId, updates) => {
        set((state) => {
            const existing = state.tenants[tenantId]
            if (!existing) return state

            const updated = deepMerge(existing, {
                ...updates,
                updatedAt: new Date().toISOString(),
            })

            return {
                tenants: {
                    ...state.tenants,
                    [tenantId]: updated,
                },
            }
        })

        // Re-apply theme if it was updated
        if (updates.theme && tenantId === get().currentTenantId) {
            const tenant = get().tenants[tenantId]
            get().applyTheme(tenant.theme)
        }
    },

    /**
     * Get all tenant IDs
     */
    getTenantIds: () => Object.keys(get().tenants),
})

// ============= THEME SLICE =============
const createThemeSlice = (set, get) => ({
    /**
     * Apply theme to document
     */
    applyTheme: (theme) => {
        const root = document.documentElement

        // Apply dark/light mode
        if (theme.mode === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }

        // Get colors based on mode
        const colors = theme.mode === 'dark'
            ? { ...theme.colors, ...DARK_THEME_COLORS }
            : theme.colors

        // Apply color variables
        Object.entries(colors).forEach(([key, value]) => {
            const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase()
            root.style.setProperty(`--${cssVar}`, value)
        })

        // Apply radius
        const radiusMap = {
            none: '0',
            sm: '0.25rem',
            md: '0.5rem',
            lg: '0.75rem',
            full: '9999px',
        }
        root.style.setProperty('--radius', radiusMap[theme.radius] || radiusMap.md)
    },
})

// ============= UI SLICE =============
const createUISlice = (set, get) => ({
    // Sidebar collapsed state (for mobile/responsive)
    sidebarCollapsed: false,

    // Preview mode for admin panel
    isPreviewMode: false,

    // Pending changes (unsaved)
    pendingChanges: null,

    /**
     * Toggle sidebar collapsed state
     */
    toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }))
    },

    /**
     * Set sidebar collapsed state
     */
    setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed })
    },

    /**
     * Set preview mode
     */
    setPreviewMode: (enabled) => {
        set({ isPreviewMode: enabled })
    },

    /**
     * Set pending changes for preview
     */
    setPendingChanges: (changes) => {
        set({ pendingChanges: changes })
    },

    /**
     * Clear pending changes
     */
    clearPendingChanges: () => {
        set({ pendingChanges: null })
    },
})

// ============= DRAG SLICE =============
const createDragSlice = (set, get) => ({
    // Currently dragging widget
    activeWidget: null,

    // Drag over target
    overTarget: null,

    /**
     * Check if drag is enabled for a specific context
     * @param {string} pageId - Current page ID
     * @param {string} widgetInstanceId - Widget instance ID (optional)
     */
    isDragEnabled: (pageId, widgetInstanceId = null) => {
        const tenant = get().getCurrentTenant()
        if (!tenant) return false

        const { drag, featureFlags } = tenant

        // Check widgetDrag feature flag first
        if (featureFlags?.widgetDrag === false) return false

        // Check global setting
        if (!drag.globalEnabled) return false

        // Check page override
        if (pageId && drag.pageOverrides[pageId] === false) return false

        // Check widget override
        if (widgetInstanceId && drag.widgetOverrides[widgetInstanceId] === false) return false

        return true
    },

    /**
     * Set active dragging widget
     */
    setActiveWidget: (widget) => {
        set({ activeWidget: widget })
    },

    /**
     * Set over target
     */
    setOverTarget: (target) => {
        set({ overTarget: target })
    },
})

// ============= COMBINED STORE =============
export const useStore = create(
    persist(
        (set, get) => ({
            ...createTenantSlice(set, get),
            ...createThemeSlice(set, get),
            ...createUISlice(set, get),
            ...createDragSlice(set, get),
        }),
        {
            name: 'multitenant-dashboard-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                // Only persist tenant configurations
                tenants: state.tenants,
                currentTenantId: state.currentTenantId,
            }),
        }
    )
)

// ============= SELECTOR HOOKS =============
export const useCurrentTenant = () => useStore((state) => state.getCurrentTenant())
export const useTenantId = () => useStore((state) => state.currentTenantId)
export const useSidebarCollapsed = () => useStore((state) => state.sidebarCollapsed)
export const useIsPreviewMode = () => useStore((state) => state.isPreviewMode)
export const usePendingChanges = () => useStore((state) => state.pendingChanges)
export const useIsDragEnabled = () => useStore((state) => state.isDragEnabled)
