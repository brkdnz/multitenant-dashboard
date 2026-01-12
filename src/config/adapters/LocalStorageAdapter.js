import { StorageAdapter } from './StorageAdapter'

/**
 * LocalStorage Adapter
 * Implements storage interface using browser localStorage
 * For development/demo purposes - replace with ApiStorageAdapter for production
 */
export class LocalStorageAdapter extends StorageAdapter {
    constructor(namespace = 'dashboard') {
        super()
        this.namespace = namespace
    }

    /**
     * Generate namespaced key
     * @param {string} key - Original key
     * @returns {string} Namespaced key
     */
    _getKey(key) {
        return `${this.namespace}:${key}`
    }

    /**
     * Get a value by key
     * @param {string} key - Storage key
     * @returns {Promise<any>} Stored value or null
     */
    async get(key) {
        try {
            const item = localStorage.getItem(this._getKey(key))
            return item ? JSON.parse(item) : null
        } catch (error) {
            console.error(`LocalStorageAdapter.get error for key "${key}":`, error)
            return null
        }
    }

    /**
     * Set a value by key
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     * @returns {Promise<void>}
     */
    async set(key, value) {
        try {
            localStorage.setItem(this._getKey(key), JSON.stringify(value))
        } catch (error) {
            console.error(`LocalStorageAdapter.set error for key "${key}":`, error)
            throw error
        }
    }

    /**
     * Delete a value by key
     * @param {string} key - Storage key
     * @returns {Promise<void>}
     */
    async delete(key) {
        try {
            localStorage.removeItem(this._getKey(key))
        } catch (error) {
            console.error(`LocalStorageAdapter.delete error for key "${key}":`, error)
        }
    }

    /**
     * Get all keys matching a prefix
     * @param {string} prefix - Key prefix to match
     * @returns {Promise<string[]>} Matching keys (without namespace)
     */
    async keys(prefix = '') {
        const allKeys = []
        const fullPrefix = this._getKey(prefix)

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && key.startsWith(fullPrefix)) {
                // Remove namespace prefix
                allKeys.push(key.replace(`${this.namespace}:`, ''))
            }
        }

        return allKeys
    }

    /**
     * Clear all namespaced storage
     * @returns {Promise<void>}
     */
    async clear() {
        const keysToRemove = []

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && key.startsWith(`${this.namespace}:`)) {
                keysToRemove.push(key)
            }
        }

        keysToRemove.forEach((key) => localStorage.removeItem(key))
    }
}

// Export singleton instance
export const localStorageAdapter = new LocalStorageAdapter('multitenant-dashboard')
