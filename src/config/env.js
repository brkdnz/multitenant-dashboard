/**
 * Environment Configuration
 * Centralized access to environment variables with defaults
 */

export const env = {
    // API
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),

    // Supabase
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,

    // Feature flags
    enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
    enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA !== 'false',

    // Environment checks
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    mode: import.meta.env.MODE,
}

/**
 * Log environment info (only in development)
 */
export function logEnvInfo() {
    if (env.isDevelopment && env.enableDebug) {
        console.groupCollapsed('🔧 Environment Configuration')
        console.log('Mode:', env.mode)
        console.log('API URL:', env.apiUrl)
        console.log('Supabase:', env.supabaseUrl ? 'Configured' : 'Missing')
        console.log('Mock Data:', env.enableMockData)
        console.log('Debug:', env.enableDebug)
        console.groupEnd()
    }
}

export default env
