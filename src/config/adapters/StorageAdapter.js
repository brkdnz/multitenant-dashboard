/**
 * Storage Adapter Interface
 * Base class that defines the contract for all storage adapters
 * Enables easy switching between LocalStorage, API, IndexedDB, etc.
 */
export class StorageAdapter {
    /**
     * Get a value by key
     * @param {string} key - Storage key
     * @returns {Promise<any>} Stored value or null
     */
    async get(key) {
        throw new Error('Method not implemented')
    }

    /**
     * Set a value by key
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     * @returns {Promise<void>}
     */
    async set(key, value) {
        throw new Error('Method not implemented')
    }

    /**
     * Delete a value by key
     * @param {string} key - Storage key
     * @returns {Promise<void>}
     */
    async delete(key) {
        throw new Error('Method not implemented')
    }

    /**
     * Get all keys matching a pattern
     * @param {string} prefix - Key prefix to match
     * @returns {Promise<string[]>} Matching keys
     */
    async keys(prefix = '') {
        throw new Error('Method not implemented')
    }

    /**
     * Clear all storage
     * @returns {Promise<void>}
     */
    async clear() {
        throw new Error('Method not implemented')
    }
}
