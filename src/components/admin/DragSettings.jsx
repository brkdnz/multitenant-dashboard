import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { GripVertical, Lock, Unlock } from 'lucide-react'
import { useTenant, useTenantContext } from '@/tenancy/TenantContext'
import { logAction, AuditActions } from '@/lib/auditLog'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

/**
 * Drag Settings Component
 * Configure global, page-level, and widget-level drag permissions
 */
export default function DragSettings() {
    const { t } = useTranslation()
    const tenant = useTenant()
    const { updateConfig } = useTenantContext()

    const { drag, layouts } = tenant

    const handleDragChange = useCallback(
        async (updates, propertyName, propertyLabel) => {
            const changedKey = Object.keys(updates)[0]
            const previousValue = drag[changedKey]

            // Log the change
            logAction(AuditActions.DRAG_GLOBAL_TOGGLE, {
                property: propertyName || `drag.${changedKey}`,
                propertyLabel: propertyLabel || changedKey,
                previousValue,
                newValue: updates[changedKey],
                section: 'Drag & Drop Settings',
            }, tenant?.id)

            await updateConfig({ drag: { ...drag, ...updates } })
        },
        [drag, updateConfig, tenant]
    )

    const handlePageOverride = useCallback(
        async (pageId, enabled) => {
            const previousValue = drag.pageOverrides?.[pageId]
            const newOverrides = { ...drag.pageOverrides }

            if (enabled === undefined) {
                delete newOverrides[pageId]
            } else {
                newOverrides[pageId] = enabled
            }

            // Log the change
            logAction(AuditActions.DRAG_PAGE_OVERRIDE, {
                property: `drag.pageOverrides.${pageId}`,
                propertyLabel: `Page Override: ${pageId}`,
                previousValue: previousValue !== undefined ? previousValue : 'inherited',
                newValue: enabled !== undefined ? enabled : 'inherited',
                pageId,
                section: 'Page Drag Overrides',
            }, tenant?.id)

            await handleDragChange({ pageOverrides: newOverrides })
        },
        [drag, handleDragChange, tenant]
    )

    const handleWidgetOverride = useCallback(
        async (widgetId, enabled) => {
            const previousValue = drag.widgetOverrides?.[widgetId]
            const newOverrides = { ...drag.widgetOverrides }

            if (enabled === undefined) {
                delete newOverrides[widgetId]
            } else {
                newOverrides[widgetId] = enabled
            }

            // Log the change
            logAction(AuditActions.DRAG_WIDGET_OVERRIDE, {
                property: `drag.widgetOverrides.${widgetId}`,
                propertyLabel: `Widget Override: ${widgetId}`,
                previousValue: previousValue !== undefined ? previousValue : 'inherited',
                newValue: enabled !== undefined ? enabled : 'inherited',
                widgetId,
                section: 'Widget Drag Overrides',
            }, tenant?.id)

            await handleDragChange({ widgetOverrides: newOverrides })
        },
        [drag, handleDragChange, tenant]
    )

    const pages = Object.keys(layouts || {})
    const allWidgets = pages.flatMap((pageId) =>
        (layouts[pageId] || []).map((w) => ({ ...w, pageId }))
    )

    return (
        <div className="space-y-6">
            {/* Global Drag Setting */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('admin.drag.global')}</CardTitle>
                    <CardDescription>
                        Master switch for drag and drop functionality
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="global-drag" className="flex items-center gap-3">
                            {drag.globalEnabled ? (
                                <Unlock className="h-5 w-5 text-green-600" />
                            ) : (
                                <Lock className="h-5 w-5 text-red-600" />
                            )}
                            <span className="flex flex-col">
                                <span>{t('admin.drag.globalEnabled')}</span>
                                <span className="text-sm font-normal text-[hsl(var(--muted-foreground))]">
                                    {drag.globalEnabled
                                        ? 'Widgets can be rearranged by dragging'
                                        : 'All drag functionality is disabled'}
                                </span>
                            </span>
                        </Label>
                        <Switch
                            id="global-drag"
                            checked={drag.globalEnabled}
                            onCheckedChange={(checked) => handleDragChange(
                                { globalEnabled: checked },
                                'drag.globalEnabled',
                                'Global Drag Enabled'
                            )}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Page Overrides */}
            {drag.globalEnabled && (
                <Card>
                    <CardHeader>
                        <CardTitle>{t('admin.drag.pageOverrides')}</CardTitle>
                        <CardDescription>
                            Override drag settings for specific pages
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {pages.length === 0 ? (
                            <p className="text-center text-sm text-[hsl(var(--muted-foreground))] py-4">
                                No pages with widgets
                            </p>
                        ) : (
                            pages.map((pageId) => {
                                const override = drag.pageOverrides?.[pageId]
                                const isOverridden = override !== undefined
                                const isEnabled = override ?? true

                                return (
                                    <div
                                        key={pageId}
                                        className="flex items-center justify-between rounded-[var(--radius)] border border-[hsl(var(--border))] p-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <GripVertical className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                                            <span className="font-medium capitalize">{pageId}</span>
                                            {isOverridden && (
                                                <span className="rounded-full bg-[hsl(var(--secondary))] px-2 py-0.5 text-xs">
                                                    Override
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {isOverridden && (
                                                <button
                                                    onClick={() => handlePageOverride(pageId, undefined)}
                                                    className="text-xs text-[hsl(var(--muted-foreground))] underline hover:text-[hsl(var(--foreground))]"
                                                >
                                                    Reset
                                                </button>
                                            )}
                                            <Switch
                                                checked={isEnabled}
                                                onCheckedChange={(checked) => handlePageOverride(pageId, checked)}
                                            />
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Widget Overrides */}
            {drag.globalEnabled && (
                <Card>
                    <CardHeader>
                        <CardTitle>{t('admin.drag.widgetOverrides')}</CardTitle>
                        <CardDescription>
                            Override drag settings for individual widgets
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {allWidgets.length === 0 ? (
                            <p className="text-center text-sm text-[hsl(var(--muted-foreground))] py-4">
                                No widgets available
                            </p>
                        ) : (
                            <div className="max-h-64 space-y-2 overflow-y-auto">
                                {allWidgets.map((widget) => {
                                    const override = drag.widgetOverrides?.[widget.id]
                                    const isOverridden = override !== undefined
                                    const isEnabled = override ?? true

                                    return (
                                        <div
                                            key={widget.id}
                                            className="flex items-center justify-between rounded-[var(--radius)] border border-[hsl(var(--border))] p-3"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">
                                                    {widget.props?.title || widget.widgetId}
                                                </span>
                                                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                                                    {widget.pageId} / {widget.id}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {isOverridden && (
                                                    <button
                                                        onClick={() => handleWidgetOverride(widget.id, undefined)}
                                                        className="text-xs text-[hsl(var(--muted-foreground))] underline hover:text-[hsl(var(--foreground))]"
                                                    >
                                                        Reset
                                                    </button>
                                                )}
                                                <Switch
                                                    checked={isEnabled}
                                                    onCheckedChange={(checked) => handleWidgetOverride(widget.id, checked)}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {!drag.globalEnabled && (
                <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-4">
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Enable global drag to configure page and widget-level overrides.
                    </p>
                </div>
            )}
        </div>
    )
}
