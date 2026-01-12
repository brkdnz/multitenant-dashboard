import { createClient } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Supabase Client
 * Singleton instance for the application
 */
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export const isSupabaseConfigured = !!supabase

/**
 * Helper to check connection
 */
export async function checkSupabaseConnection() {
    if (!supabase) return false

    try {
        const { data, error } = await supabase.from('tenants').select('count', { count: 'exact', head: true })
        if (error) throw error
        return true
    } catch (err) {
        console.error('Supabase connection check failed:', err)
        return false
    }
}
