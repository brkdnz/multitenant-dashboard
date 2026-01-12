import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 * @param  {...any} inputs - Class names to merge
 * @returns {string} Merged class string
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

/**
 * Generate unique ID
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} Unique ID
 */
export function generateId(prefix = 'id') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Deep merge objects
 * @param {object} target - Target object
 * @param {object} source - Source object
 * @returns {object} Merged object
 */
export function deepMerge(target, source) {
    const output = { ...target }

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach((key) => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] })
                } else {
                    output[key] = deepMerge(target[key], source[key])
                }
            } else {
                Object.assign(output, { [key]: source[key] })
            }
        })
    }

    return output
}

/**
 * Check if value is a plain object
 * @param {any} item - Value to check
 * @returns {boolean}
 */
export function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function}
 */
export function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function}
 */
export function throttle(func, limit) {
    let inThrottle
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args)
            inThrottle = true
            setTimeout(() => (inThrottle = false), limit)
        }
    }
}

/**
 * Get nested object value by path
 * @param {object} obj - Object to search
 * @param {string} path - Dot notation path
 * @param {any} defaultValue - Default value if not found
 * @returns {any}
 */
export function getNestedValue(obj, path, defaultValue = undefined) {
    const keys = path.split('.')
    let result = obj

    for (const key of keys) {
        if (result === null || result === undefined) {
            return defaultValue
        }
        result = result[key]
    }

    return result !== undefined ? result : defaultValue
}

/**
 * Set nested object value by path
 * @param {object} obj - Object to modify
 * @param {string} path - Dot notation path
 * @param {any} value - Value to set
 * @returns {object}
 */
export function setNestedValue(obj, path, value) {
    const keys = path.split('.')
    const result = { ...obj }
    let current = result

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        current[key] = { ...current[key] }
        current = current[key]
    }

    current[keys[keys.length - 1]] = value
    return result
}
