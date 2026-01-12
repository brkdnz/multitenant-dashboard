/**
 * External Data Source Configuration
 * Enables widgets to fetch data from external APIs
 */

/**
 * Built-in data source templates
 */
export const dataSourceTemplates = [
    {
        id: 'rest-api',
        name: 'REST API',
        description: 'Fetch data from any REST endpoint',
        icon: 'globe',
        fields: [
            { key: 'url', label: 'API URL', type: 'url', required: true },
            { key: 'method', label: 'HTTP Method', type: 'select', options: ['GET', 'POST', 'PUT'], default: 'GET' },
            { key: 'headers', label: 'Headers', type: 'json', default: {} },
            { key: 'body', label: 'Request Body', type: 'json', showIf: (config) => config.method !== 'GET' },
            { key: 'auth', label: 'Authentication', type: 'select', options: ['none', 'api-key', 'bearer', 'basic'] },
            { key: 'apiKey', label: 'API Key', type: 'password', showIf: (config) => config.auth === 'api-key' },
            { key: 'bearerToken', label: 'Bearer Token', type: 'password', showIf: (config) => config.auth === 'bearer' },
        ]
    },
    {
        id: 'graphql',
        name: 'GraphQL',
        description: 'Query GraphQL endpoints',
        icon: 'code',
        fields: [
            { key: 'url', label: 'Endpoint URL', type: 'url', required: true },
            { key: 'query', label: 'GraphQL Query', type: 'textarea', required: true },
            { key: 'variables', label: 'Variables', type: 'json', default: {} },
            { key: 'headers', label: 'Headers', type: 'json', default: {} },
        ]
    },
    {
        id: 'supabase',
        name: 'Supabase Table',
        description: 'Query Supabase tables directly',
        icon: 'database',
        fields: [
            { key: 'table', label: 'Table Name', type: 'text', required: true },
            { key: 'select', label: 'Columns', type: 'text', default: '*' },
            { key: 'filters', label: 'Filters', type: 'json', default: [] },
            { key: 'orderBy', label: 'Order By', type: 'text' },
            { key: 'limit', label: 'Limit', type: 'number', default: 100 },
        ]
    },
    {
        id: 'mock',
        name: 'Mock Data',
        description: 'Generate sample data for testing',
        icon: 'beaker',
        fields: [
            { key: 'type', label: 'Data Type', type: 'select', options: ['users', 'products', 'orders', 'metrics', 'custom'] },
            { key: 'count', label: 'Record Count', type: 'number', default: 10 },
            { key: 'customData', label: 'Custom JSON', type: 'json', showIf: (config) => config.type === 'custom' },
        ]
    }
]

/**
 * Data Source Manager
 * Handles fetching and transforming data from external sources
 */
export class DataSourceManager {
    constructor(supabaseClient = null) {
        this.supabase = supabaseClient
        this.cache = new Map()
        this.cacheTimeout = 60000 // 1 minute default
    }

    /**
     * Fetch data from a configured data source
     */
    async fetch(config) {
        const cacheKey = JSON.stringify(config)

        // Check cache
        const cached = this.cache.get(cacheKey)
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data
        }

        let data
        switch (config.type) {
            case 'rest-api':
                data = await this.fetchRest(config)
                break
            case 'graphql':
                data = await this.fetchGraphQL(config)
                break
            case 'supabase':
                data = await this.fetchSupabase(config)
                break
            case 'mock':
                data = this.generateMockData(config)
                break
            default:
                throw new Error(`Unknown data source type: ${config.type}`)
        }

        // Apply transformations
        if (config.transform) {
            data = this.applyTransform(data, config.transform)
        }

        // Cache result
        this.cache.set(cacheKey, { data, timestamp: Date.now() })

        return data
    }

    /**
     * Fetch from REST API
     */
    async fetchRest(config) {
        const { url, method = 'GET', headers = {}, body, auth, apiKey, bearerToken } = config

        const fetchHeaders = { ...headers }

        // Apply authentication
        if (auth === 'api-key' && apiKey) {
            fetchHeaders['X-API-Key'] = apiKey
        } else if (auth === 'bearer' && bearerToken) {
            fetchHeaders['Authorization'] = `Bearer ${bearerToken}`
        }

        const fetchOptions = {
            method,
            headers: fetchHeaders,
        }

        if (body && method !== 'GET') {
            fetchOptions.body = JSON.stringify(body)
            fetchHeaders['Content-Type'] = 'application/json'
        }

        const response = await fetch(url, fetchOptions)

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Fetch from GraphQL endpoint
     */
    async fetchGraphQL(config) {
        const { url, query, variables = {}, headers = {} } = config

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify({ query, variables })
        })

        if (!response.ok) {
            throw new Error(`GraphQL request failed: ${response.status}`)
        }

        const result = await response.json()

        if (result.errors) {
            throw new Error(result.errors[0].message)
        }

        return result.data
    }

    /**
     * Fetch from Supabase table
     */
    async fetchSupabase(config) {
        if (!this.supabase) {
            throw new Error('Supabase client not configured')
        }

        const { table, select = '*', filters = [], orderBy, limit = 100 } = config

        let query = this.supabase.from(table).select(select)

        // Apply filters
        for (const filter of filters) {
            if (filter.operator === 'eq') {
                query = query.eq(filter.column, filter.value)
            } else if (filter.operator === 'gt') {
                query = query.gt(filter.column, filter.value)
            } else if (filter.operator === 'lt') {
                query = query.lt(filter.column, filter.value)
            } else if (filter.operator === 'like') {
                query = query.like(filter.column, filter.value)
            }
        }

        if (orderBy) {
            const [column, direction] = orderBy.split(':')
            query = query.order(column, { ascending: direction !== 'desc' })
        }

        if (limit) {
            query = query.limit(limit)
        }

        const { data, error } = await query

        if (error) throw error
        return data
    }

    /**
     * Generate mock data
     */
    generateMockData(config) {
        const { type, count = 10, customData } = config

        if (type === 'custom' && customData) {
            return customData
        }

        const generators = {
            users: () => Array.from({ length: count }, (_, i) => ({
                id: i + 1,
                name: `User ${i + 1}`,
                email: `user${i + 1}@example.com`,
                status: ['active', 'inactive', 'pending'][i % 3],
                createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
            })),
            products: () => Array.from({ length: count }, (_, i) => ({
                id: i + 1,
                name: `Product ${i + 1}`,
                price: Math.round(Math.random() * 1000) / 10,
                stock: Math.floor(Math.random() * 100),
                category: ['Electronics', 'Clothing', 'Food', 'Books'][i % 4]
            })),
            orders: () => Array.from({ length: count }, (_, i) => ({
                id: `ORD-${1000 + i}`,
                customer: `Customer ${i + 1}`,
                total: Math.round(Math.random() * 5000) / 10,
                status: ['pending', 'processing', 'shipped', 'delivered'][i % 4],
                date: new Date(Date.now() - Math.random() * 10000000000).toISOString()
            })),
            metrics: () => Array.from({ length: count }, (_, i) => ({
                date: new Date(Date.now() - (count - i) * 86400000).toISOString().split('T')[0],
                value: Math.floor(Math.random() * 1000),
                change: Math.round((Math.random() - 0.5) * 20 * 10) / 10
            }))
        }

        return generators[type]?.() || []
    }

    /**
     * Apply data transformation
     */
    applyTransform(data, transform) {
        if (typeof transform === 'function') {
            return transform(data)
        }

        // Handle string-based transforms
        if (typeof transform === 'string') {
            try {
                // Simple JSONPath-like extraction
                const parts = transform.split('.')
                let result = data
                for (const part of parts) {
                    result = result?.[part]
                }
                return result
            } catch (e) {
                console.warn('Transform failed:', e)
                return data
            }
        }

        return data
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear()
    }
}

// Export default instance
export const dataSourceManager = new DataSourceManager()
