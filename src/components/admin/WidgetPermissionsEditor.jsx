import { useState } from 'react'
import { Shield, Lock, Users, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useTenant, useTenantContext } from '@/tenancy/TenantContext'
import { getAllRoles, Roles } from '@/lib/rbac'
import { cn } from '@/lib/utils'

/**
 * WidgetPermissionsEditor Component
 * Manage per-widget-instance role-based visibility
 */
export function WidgetPermissionsEditor() {
    const tenant = useTenant()
    const { updateConfig } = useTenantContext()

    const widgets = tenant?.layouts?.home || []
    const widgetPermissions = tenant?.widgetPermissions || {}
    const roles = getAllRoles()

    const handleToggleRole = async (widgetId, roleId, enabled) => {
        const currentPermissions = widgetPermissions[widgetId] || null

        let newPermissions
        if (currentPermissions === null) {
            // First restriction - start with this role only
            newPermissions = enabled ? [roleId] : []
        } else {
            if (enabled) {
                // Add role
                newPermissions = [...currentPermissions, roleId]
            } else {
                // Remove role
                newPermissions = currentPermissions.filter(r => r !== roleId)
            }
        }

        await updateConfig({
            widgetPermissions: {
                ...widgetPermissions,
                [widgetId]: newPermissions,
            }
        })
    }

    const handleResetWidget = async (widgetId) => {
        const { [widgetId]: _, ...rest } = widgetPermissions
        await updateConfig({ widgetPermissions: rest })
    }

    const handleResetAll = async () => {
        await updateConfig({ widgetPermissions: {} })
    }

    const getWidgetName = (widget) => {
        return widget.props?.title || widget.widgetId || widget.id
    }

    const isRoleEnabled = (widgetId, roleId) => {
        const perms = widgetPermissions[widgetId]
        if (perms === undefined || perms === null) return true // Public by default
        return perms.includes(roleId)
    }

    const hasRestrictions = (widgetId) => {
        return widgetPermissions[widgetId] !== undefined
    }

    if (widgets.length === 0) {
        return (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-[hsl(var(--border))]">
                <p className="text-[hsl(var(--muted-foreground))]">
                    No widgets on home page
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                        Widget Permissions
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Control which roles can see each widget
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleResetAll}>
                    Reset All
                </Button>
            </div>

            {/* Widgets */}
            <div className="space-y-4">
                {widgets.map((widget) => (
                    <Card key={widget.id}>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        'flex h-10 w-10 items-center justify-center rounded-lg',
                                        hasRestrictions(widget.id)
                                            ? 'bg-yellow-100 dark:bg-yellow-900/30'
                                            : 'bg-[hsl(var(--primary)/0.1)]'
                                    )}>
                                        {hasRestrictions(widget.id) ? (
                                            <Lock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-[hsl(var(--primary))]" />
                                        )}
                                    </div>
                                    <div>
                                        <CardTitle className="text-sm font-medium">
                                            {getWidgetName(widget)}
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            {widget.widgetId} • {widget.id}
                                        </CardDescription>
                                    </div>
                                </div>
                                {hasRestrictions(widget.id) && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleResetWidget(widget.id)}
                                    >
                                        Make Public
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                {roles.map((role) => {
                                    const enabled = isRoleEnabled(widget.id, role.id)
                                    const isAdmin = role.id === Roles.ADMIN

                                    return (
                                        <div
                                            key={role.id}
                                            className={cn(
                                                'flex items-center justify-between rounded-lg border p-3',
                                                enabled
                                                    ? 'border-[hsl(var(--primary)/0.3)] bg-[hsl(var(--primary)/0.05)]'
                                                    : 'border-[hsl(var(--border))]'
                                            )}
                                        >
                                            <div className="space-y-0.5">
                                                <Label className="text-sm font-medium">
                                                    {role.name}
                                                </Label>
                                                {enabled ? (
                                                    <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                                                        <Eye className="h-3 w-3" />
                                                        <span>Can view</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                                                        <EyeOff className="h-3 w-3" />
                                                        <span>Hidden</span>
                                                    </div>
                                                )}
                                            </div>
                                            <Switch
                                                checked={enabled}
                                                onCheckedChange={(checked) => handleToggleRole(widget.id, role.id, checked)}
                                                disabled={isAdmin} // Admin always has access
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Info */}
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)] p-4 space-y-2">
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    <strong>Public:</strong> All roles can see the widget
                </p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    <strong>Restricted:</strong> Only selected roles can see the widget
                </p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    <strong>Note:</strong> Administrators always have full access
                </p>
            </div>
        </div>
    )
}
