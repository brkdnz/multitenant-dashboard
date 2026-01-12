import { supabase } from '@/lib/supabase'

/**
 * Supabase Storage Adapter
 * Implements the storage adapter interface using Supabase tables
 * Maps 'tenant:ID' keys to the 'tenants' table and layouts to 'layouts' table
 */
export const supabaseAdapter = {
    /**
     * Get value by key
     * @param {string} key - Storage key (e.g., 'tenant:tenant-a')
     */
    async get(key) {
        if (!supabase) return null

        try {
            // Handle tenant configs
            if (key.startsWith('tenant:')) {
                const id = key.replace('tenant:', '')

                // Fetch tenant config
                const { data: tenantData, error: tenantError } = await supabase
                    .from('tenants')
                    .select('id, name, config')
                    .eq('id', id)
                    .single()

                if (tenantError || !tenantData) return null

                // Fetch layouts for this tenant
                const { data: layoutData } = await supabase
                    .from('layouts')
                    .select('page_id, widgets')
                    .eq('tenant_id', id)

                // Merge layouts into config object
                let layouts = {}
                if (layoutData) {
                    layoutData.forEach(l => {
                        layouts[l.page_id] = l.widgets
                    })
                }

                // If no DB layouts found, keep existing config.layouts or empty
                if (Object.keys(layouts).length === 0 && tenantData.config.layouts) {
                    layouts = tenantData.config.layouts
                }

                // Merge table columns with JSON config
                const finalConfig = {
                    id: tenantData.id,
                    name: tenantData.name,
                    ...tenantData.config,
                    layouts: {
                        ...(tenantData.config.layouts || {}),
                        ...layouts
                    }
                }

                return finalConfig
            }

            return null
        } catch (error) {
            console.error('SupabaseAdapter.get error:', error)
            return null
        }
    },

    /**
     * Set value by key
     * @param {string} key - Storage key
     * @param {object} value - Value to store
     */
    async set(key, value) {
        if (!supabase) return

        try {
            // Handle tenant configs
            if (key.startsWith('tenant:')) {
                const id = key.replace('tenant:', '')

                // Separate layouts from main config
                const { layouts, ...restConfig } = value

                // 1. Update Tenant Config (excluding layouts to keep JSON clean)
                const { error: tenantError } = await supabase
                    .from('tenants')
                    .upsert({
                        id,
                        name: value.name || id,
                        config: restConfig, // Store config without layouts
                        updated_at: new Date().toISOString()
                    })

                if (tenantError) throw tenantError

                // 2. Update Layouts Table
                if (layouts && Object.keys(layouts).length > 0) {
                    const layoutUpdates = Object.entries(layouts).map(([pageId, widgets]) => ({
                        tenant_id: id,
                        page_id: pageId,
                        widgets: widgets,
                        updated_at: new Date().toISOString()
                    }))

                    const { error: layoutError } = await supabase
                        .from('layouts')
                        .upsert(layoutUpdates, { onConflict: 'tenant_id, page_id' })

                    if (layoutError) throw layoutError
                }
            }
        } catch (error) {
            console.error('SupabaseAdapter.set error:', error)
            throw error
        }
    },

    /**
     * Delete value by key
     * @param {string} key - Storage key
     */
    async delete(key) {
        if (!supabase) return

        try {
            if (key.startsWith('tenant:')) {
                const id = key.replace('tenant:', '')

                // Cascade delete should handle layouts, but let's be safe
                const { error } = await supabase
                    .from('tenants')
                    .delete()
                    .eq('id', id)

                if (error) throw error
            }
        } catch (error) {
            console.error('SupabaseAdapter.delete error:', error)
            throw error
        }
    },

    /**
     * Get keys matching pattern
     * @param {string} pattern - Key pattern (only prefix supported for now)
     */
    async keys(pattern) {
        if (!supabase) return []

        try {
            if (pattern.startsWith('tenant:')) {
                const { data, error } = await supabase
                    .from('tenants')
                    .select('id')

                if (error) throw error
                return data.map(row => `tenant:${row.id}`)
            }
            return []
        } catch (error) {
            console.error('SupabaseAdapter.keys error:', error)
            return []
        }
    }
}
