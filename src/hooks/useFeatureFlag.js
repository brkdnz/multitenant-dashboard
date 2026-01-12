import { useTenant } from '@/tenancy/TenantContext'
import { isFeatureEnabled } from '@/lib/featureFlags'

/**
 * Hook to check if a feature is enabled for current tenant
 * @param {string} flagName - Feature flag name
 * @returns {boolean}
 */
export function useFeatureFlag(flagName) {
    const tenant = useTenant()

    if (!tenant) return false

    return isFeatureEnabled(tenant.featureFlags, flagName)
}

/**
 * Hook to get multiple feature flags at once
 * @param {string[]} flagNames - Array of feature flag names
 * @returns {object} - Object with flag names as keys and boolean values
 */
export function useFeatureFlags(flagNames) {
    const tenant = useTenant()

    if (!tenant) {
        return flagNames.reduce((acc, name) => ({ ...acc, [name]: false }), {})
    }

    return flagNames.reduce((acc, name) => ({
        ...acc,
        [name]: isFeatureEnabled(tenant.featureFlags, name)
    }), {})
}

/**
 * Component that conditionally renders children based on feature flag
 */
export function FeatureGate({ flag, children, fallback = null }) {
    const enabled = useFeatureFlag(flag)

    if (!enabled) return fallback

    return children
}
