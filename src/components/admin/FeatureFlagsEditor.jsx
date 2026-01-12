import { useState } from 'react'
import { Flag, Settings2, Sparkles } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useTenant, useTenantContext } from '@/tenancy/TenantContext'
import {
    getFeatureFlagsByCategory,
    DEFAULT_FEATURE_FLAGS
} from '@/lib/featureFlags'
import { cn } from '@/lib/utils'

const categoryIcons = {
    dashboard: Sparkles,
    admin: Settings2,
    advanced: Flag,
}

const categoryLabels = {
    dashboard: 'Dashboard Features',
    admin: 'Admin Panel Features',
    advanced: 'Advanced Features',
}

const categoryDescriptions = {
    dashboard: 'Core dashboard functionality',
    admin: 'Admin panel tabs and settings',
    advanced: 'Power user features',
}

/**
 * FeatureFlagsEditor Component
 * Manage feature flags per tenant
 */
export function FeatureFlagsEditor() {
    const tenant = useTenant()
    const { updateConfig } = useTenantContext()

    const tenantFlags = tenant.featureFlags || {}
    const flagsByCategory = getFeatureFlagsByCategory(tenantFlags)

    const handleToggle = async (flagKey, enabled) => {
        const newFlags = {
            ...tenantFlags,
            [flagKey]: enabled,
        }

        await updateConfig({ featureFlags: newFlags })
    }

    const handleResetAll = async () => {
        await updateConfig({ featureFlags: {} })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                        Feature Flags
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Enable or disable features for this tenant. Changes take effect immediately.
                    </p>
                </div>
                <button
                    onClick={handleResetAll}
                    className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                >
                    Reset to defaults
                </button>
            </div>

            {/* Categories */}
            {Object.entries(flagsByCategory).map(([category, flags]) => {
                if (flags.length === 0) return null

                const Icon = categoryIcons[category] || Flag

                return (
                    <Card key={category}>
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--primary)/0.1)]">
                                    <Icon className="h-5 w-5 text-[hsl(var(--primary))]" />
                                </div>
                                <div>
                                    <CardTitle className="text-base">
                                        {categoryLabels[category]}
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        {categoryDescriptions[category]}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {flags.map((flag) => (
                                    <div
                                        key={flag.key}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="space-y-0.5">
                                            <Label className="text-sm font-medium flex items-center gap-2">
                                                {flag.name}
                                                {flag.isOverridden && (
                                                    <span className="text-xs px-1.5 py-0.5 rounded bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]">
                                                        Custom
                                                    </span>
                                                )}
                                            </Label>
                                            <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                                {flag.description}
                                            </p>
                                        </div>
                                        <Switch
                                            checked={flag.enabled}
                                            onCheckedChange={(checked) => handleToggle(flag.key, checked)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}

            {/* Info */}
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)] p-4">
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    ℹ️ All features listed here are fully implemented. Disabling a feature will hide it from the UI immediately.
                </p>
            </div>
        </div>
    )
}
