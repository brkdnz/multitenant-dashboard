import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { SidebarIcon, PanelLeft, PanelLeftClose } from 'lucide-react'
import { useTenant, useTenantContext } from '@/tenancy/TenantContext'
import { logAction, AuditActions } from '@/lib/auditLog'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

/**
 * Sidebar Settings Component
 * Configure sidebar mode, logo, and app name
 */
export default function SidebarSettings() {
    const { t } = useTranslation()
    const tenant = useTenant()
    const { updateConfig } = useTenantContext()

    const { sidebar, branding } = tenant

    const handleSidebarChange = useCallback(
        async (updates, propertyName, propertyLabel) => {
            const changedKey = Object.keys(updates)[0]
            const previousValue = sidebar[changedKey]

            // Log the change
            logAction(AuditActions.SIDEBAR_MODE_CHANGE, {
                property: propertyName || `sidebar.${changedKey}`,
                propertyLabel: propertyLabel || changedKey,
                previousValue,
                newValue: updates[changedKey],
                section: 'Sidebar Settings',
            }, tenant?.id)

            await updateConfig({ sidebar: { ...sidebar, ...updates } })
        },
        [sidebar, updateConfig, tenant]
    )

    const handleBrandingChange = useCallback(
        async (updates, propertyName, propertyLabel) => {
            const changedKey = Object.keys(updates)[0]
            const previousValue = branding[changedKey]

            // Log the change
            logAction(AuditActions.SIDEBAR_BRANDING_CHANGE, {
                property: propertyName || `branding.${changedKey}`,
                propertyLabel: propertyLabel || changedKey,
                previousValue,
                newValue: updates[changedKey],
                section: 'Branding',
            }, tenant?.id)

            await updateConfig({ branding: { ...branding, ...updates } })
        },
        [branding, updateConfig, tenant]
    )

    const sidebarModes = [
        {
            id: 'icon-text',
            label: t('admin.sidebar.iconText'),
            icon: PanelLeft,
            preview: 'w-[140px]',
        },
        {
            id: 'icon-only',
            label: t('admin.sidebar.iconOnly'),
            icon: SidebarIcon,
            preview: 'w-[48px]',
        },
        {
            id: 'collapsed',
            label: t('admin.sidebar.collapsed'),
            icon: PanelLeftClose,
            preview: 'w-0',
        },
    ]

    return (
        <div className="space-y-6">
            {/* Sidebar Mode */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('admin.sidebar.mode')}</CardTitle>
                    <CardDescription>
                        Choose how the sidebar is displayed
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                        {sidebarModes.map((mode) => {
                            const Icon = mode.icon
                            return (
                                <button
                                    key={mode.id}
                                    onClick={() => handleSidebarChange(
                                        { mode: mode.id },
                                        'sidebar.mode',
                                        'Sidebar Display Mode'
                                    )}
                                    className={cn(
                                        'flex flex-col items-center gap-3 rounded-[var(--radius)] border-2 p-4 transition-all hover:bg-[hsl(var(--accent))]',
                                        sidebar.mode === mode.id
                                            ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]'
                                            : 'border-[hsl(var(--border))]'
                                    )}
                                >
                                    <div className="flex h-16 w-full items-stretch gap-1 rounded bg-[hsl(var(--muted))] p-1">
                                        <div
                                            className={cn(
                                                'rounded bg-[hsl(var(--primary)/0.5)] transition-all',
                                                mode.preview
                                            )}
                                        />
                                        <div className="flex-1 rounded bg-[hsl(var(--background))]" />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4" />
                                        <span className="text-sm font-medium">{mode.label}</span>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Branding */}
            <Card>
                <CardHeader>
                    <CardTitle>Branding</CardTitle>
                    <CardDescription>
                        Customize the logo and application name
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Logo URL */}
                    <div className="space-y-2">
                        <Label htmlFor="logo-url">{t('admin.sidebar.logo')}</Label>
                        <div className="flex gap-4">
                            <Input
                                id="logo-url"
                                value={branding.logoUrl || ''}
                                onChange={(e) => handleBrandingChange(
                                    { logoUrl: e.target.value },
                                    'branding.logoUrl',
                                    'Logo URL'
                                )}
                                placeholder="/logo.svg or https://..."
                                className="flex-1"
                            />
                            {branding.logoUrl && (
                                <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
                                    <img
                                        src={branding.logoUrl}
                                        alt="Logo preview"
                                        className="h-6 w-6 object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none'
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* App Name */}
                    <div className="space-y-2">
                        <Label htmlFor="app-name">{t('admin.sidebar.appName')}</Label>
                        <Input
                            id="app-name"
                            value={branding.appName || ''}
                            onChange={(e) => handleBrandingChange(
                                { appName: e.target.value },
                                'branding.appName',
                                'Application Name'
                            )}
                            placeholder="Dashboard"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Sidebar Width */}
            {sidebar.mode === 'icon-text' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Sidebar Width</CardTitle>
                        <CardDescription>
                            Adjust the width of the sidebar (200-400px)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <Input
                                type="range"
                                min="200"
                                max="400"
                                value={sidebar.width || 280}
                                onChange={(e) => handleSidebarChange(
                                    { width: parseInt(e.target.value) },
                                    'sidebar.width',
                                    'Sidebar Width'
                                )}
                                className="flex-1"
                            />
                            <span className="w-16 text-sm font-medium">
                                {sidebar.width || 280}px
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
