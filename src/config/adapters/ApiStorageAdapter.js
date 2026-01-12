import { StorageAdapter } from './StorageAdapter'

/**
 * API Storage Adapter
 * Implements storage interface using a REST API backend
 * Ready for production use - configure with your API endpoint
 * 
 * @example
 * const adapter = new ApiStorageAdapter('https://api.example.com/config')
 */
export class ApiStorageAdapter extends StorageAdapter {
    /**
     * @param {string} baseUrl - API base URL
     * @param {object} options - Additional options
     * @param {object} options.headers - Custom headers
     * @param {Function} options.getAuthToken - Function to get auth token
     */
    constructor(baseUrl, options = {}) {
        super()
        this.baseUrl = baseUrl
        this.headers = options.headers || {}
        this.getAuthToken = options.getAuthToken || (() => null)
    }

    /**
     * Build headers for request
     * @returns {object} Headers object
     */
    async _buildHeaders() {
        const headers = {
            'Content-Type': 'application/json',
            ...this.headers,
        }

        const token = await this.getAuthToken()
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        return headers
    }

    /**
     * Make API request
     * @param {string} path - Request path
     * @param {object} options - Fetch options
     * @returns {Promise<any>}
     */
    async _request(path, options = {}) {
        const headers = await this._buildHeaders()

        const response = await fetch(`${this.baseUrl}${path}`, {
            ...options,
            headers: { ...headers, ...options.headers },
        })

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`)
        }

        const text = await response.text()
        return text ? JSON.parse(text) : null
    }

    /**
     * Get a value by key
     * @param {string} key - Storage key
     * @returns {Promise<any>} Stored value or null
     */
    async get(key) {
        try {
            return await this._request(`/${encodeURIComponent(key)}`, {
                method: 'GET',
            })
        } catch (error) {
            console.error(`ApiStorageAdapter.get error for key "${key}":`, error)
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
        await this._request(`/${encodeURIComponent(key)}`, {
            method: 'PUT',
            body: JSON.stringify(value),
        })
    }

    /**
     * Delete a value by key
     * @param {string} key - Storage key
     * @returns {Promise<void>}
     */
    async delete(key) {
        await this._request(`/${encodeURIComponent(key)}`, {
            method: 'DELETE',
        })
    }

    /**
     * Get all keys matching a prefix
     * @param {string} prefix - Key prefix to match
     * @returns {Promise<string[]>} Matching keys
     */
    async keys(prefix = '') {
        const query = prefix ? `?prefix=${encodeURIComponent(prefix)}` : ''
        return await this._request(`/keys${query}`, {
            method: 'GET',
        })
    }

    /**
     * Clear all storage (requires admin permissions)
     * @returns {Promise<void>}
     */
    async clear() {
        await this._request('/clear', {
            method: 'POST',
        })
    }
}
