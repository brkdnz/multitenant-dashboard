import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/components/Toast'

import { Save, Undo, Redo } from 'lucide-react'
import { useTenant, useTenantContext } from '@/tenancy/TenantContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import ThemeEditor from '@/components/admin/ThemeEditor'
import LanguageEditor from '@/components/admin/LanguageEditor'
import SidebarSettings from '@/components/admin/SidebarSettings'
import DragSettings from '@/components/admin/DragSettings'
import VersionHistory from '@/components/admin/VersionHistory'
import RBACSettings from '@/components/admin/RBACSettings'
import { ExportImport } from '@/components/admin/ExportImport'
import { FeatureFlagsEditor } from '@/components/admin/FeatureFlagsEditor'
import { PresetThemeSelector } from '@/components/admin/PresetThemeSelector'
import { KeyboardShortcutsHelp } from '@/components/admin/KeyboardShortcutsHelp'
import { WidgetPermissionsEditor } from '@/components/admin/WidgetPermissionsEditor'
import { TemplateMarketplace } from '@/components/admin/TemplateMarketplace'
import { useHistoryStore, useUndoRedoShortcuts } from '@/lib/history'
import { saveConfigVersion } from '@/lib/versioning'
import { logAction, AuditActions } from '@/lib/auditLog'
import { useAutosave } from '@/hooks/useAutosave'
import { useFeatureFlags } from '@/hooks/useFeatureFlag'

/**
 * Admin Panel Page
 * Central configuration hub for tenant customization
 */
export default function AdminPanel() {
    const { t } = useTranslation()
    const tenant = useTenant()
    const { saveChanges, updateConfig } = useTenantContext()
    const [isSaving, setIsSaving] = useState(false)
    const [autosaveEnabled, setAutosaveEnabled] = useState(true)

    // Feature flags - check which features are enabled
    const flags = useFeatureFlags([
        'themeEditor',
        'languageEditor',
        'sidebarSettings',
        'dragSettings',
        'rbacSettings',
        'versionHistory',
        'exportImport',
        'auditLog',
        'widgetPermissions'
    ])

    // History store for undo/redo
    const { pushState, undo, redo, canUndo, canRedo, initialize, getHistoryInfo } = useHistoryStore()

    // Initialize history with current tenant config
    useEffect(() => {
        if (tenant) {
            initialize(tenant)
        }
    }, [tenant?.id])

    // Track config changes for history
    useEffect(() => {
        if (tenant) {
            pushState(tenant)
        }
    }, [tenant])

    // Autosave hook
    useAutosave(tenant, 3000, autosaveEnabled)

    // Handle undo
    const handleUndo = useCallback(async () => {
        const previousState = undo()
        if (previousState) {
            await updateConfig(previousState)
            setSaveMessage({ type: 'success', text: 'Undone' })
            setTimeout(() => setSaveMessage(null), 2000)
        }
    }, [undo, updateConfig])

    // Handle redo
    const handleRedo = useCallback(async () => {
        const nextState = redo()
        if (nextState) {
            await updateConfig(nextState)
            setSaveMessage({ type: 'success', text: 'Redone' })
            setTimeout(() => setSaveMessage(null), 2000)
        }
    }, [redo, updateConfig])

    // Register keyboard shortcuts
    useEffect(() => {
        const cleanup = useUndoRedoShortcuts(handleUndo, handleRedo)
        return cleanup
    }, [handleUndo, handleRedo])

    // Toast hook
    const toast = useToast()

    const handleSave = useCallback(async () => {
        setIsSaving(true)

        try {
            const result = await saveChanges()

            // Validate result
            if (!result) {
                throw new Error('No response from save operation')
            }

            if (result.success) {
                // Save version
                if (flags.versionHistory) {
                    saveConfigVersion(tenant.id, tenant, 'Manual save')
                }

                // Log action
                if (flags.auditLog) {
                    logAction(AuditActions.CONFIG_SAVE, {
                        tenantId: tenant.id,
                        tenantName: tenant.name,
                        savedAt: new Date().toISOString(),
                    }, tenant.id)
                }

                toast.success(t('common.success') || 'Saved', 'Changes synced to database')
            } else {
                console.error('Save failed result:', result)
                toast.error(t('common.error') || 'Error', result.error || 'Failed to save configuration')
            }
        } catch (error) {
            console.error('Save exception:', error)
            toast.error('Save Failed', error.message || 'An unexpected error occurred')
        }

        setIsSaving(false)
    }, [saveChanges, tenant, t, flags, toast])

    if (!tenant) {
        return null
    }

    // Build tabs list based on enabled features
    const tabs = [
        { id: 'theme', label: t('admin.theme.title'), enabled: flags.themeEditor },
        { id: 'presets', label: 'Presets', enabled: flags.themeEditor },
        { id: 'templates', label: 'Templates', enabled: true }, // Always show
        { id: 'language', label: t('admin.language.title'), enabled: flags.languageEditor },
        { id: 'sidebar', label: t('admin.sidebar.title'), enabled: flags.sidebarSettings },
        { id: 'drag', label: t('admin.drag.title'), enabled: flags.dragSettings },
        { id: 'rbac', label: 'Access', enabled: flags.rbacSettings },
        { id: 'widgets', label: 'Widgets', enabled: flags.widgetPermissions },
        { id: 'flags', label: 'Flags', enabled: true }, // Always show flags tab
        { id: 'export', label: 'Export', enabled: flags.exportImport },
        { id: 'shortcuts', label: 'Shortcuts', enabled: true }, // Always show
        { id: 'history', label: 'History', enabled: flags.versionHistory },
    ]

    const enabledTabs = tabs.filter(tab => tab.enabled)
    const defaultTab = enabledTabs[0]?.id || 'flags'

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                        {t('admin.title')}
                    </h1>
                    <p className="text-[hsl(var(--muted-foreground))]">
                        Configure {tenant.name} settings
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Undo/Redo Buttons */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleUndo}
                        disabled={!canUndo()}
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleRedo}
                        disabled={!canRedo()}
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo className="h-4 w-4" />
                    </Button>

                    <Separator orientation="vertical" className="h-6" />

                    {/* Autosave indicator */}
                    <label className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                        <input
                            type="checkbox"
                            checked={autosaveEnabled}
                            onChange={(e) => setAutosaveEnabled(e.target.checked)}
                            className="rounded"
                        />
                        Autosave
                    </label>

                    {/* Save Button */}
                    <Button onClick={handleSave} disabled={isSaving}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? 'Saving...' : t('common.save')}
                    </Button>
                </div>
            </div>

            {/* Settings Tabs */}
            <Tabs defaultValue={defaultTab} className="space-y-6">
                <ScrollArea className="w-full">
                    <TabsList className="inline-flex w-max">
                        {enabledTabs.map(tab => (
                            <TabsTrigger key={tab.id} value={tab.id}>
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {flags.themeEditor && (
                    <>
                        <TabsContent value="theme">
                            <ThemeEditor />
                        </TabsContent>
                        <TabsContent value="presets">
                            <PresetThemeSelector />
                        </TabsContent>
                    </>
                )}

                <TabsContent value="templates">
                    <TemplateMarketplace />
                </TabsContent>

                {flags.languageEditor && (
                    <TabsContent value="language">
                        <LanguageEditor />
                    </TabsContent>
                )}

                {flags.sidebarSettings && (
                    <TabsContent value="sidebar">
                        <SidebarSettings />
                    </TabsContent>
                )}

                {flags.dragSettings && (
                    <TabsContent value="drag">
                        <DragSettings />
                    </TabsContent>
                )}

                {flags.rbacSettings && (
                    <TabsContent value="rbac">
                        <RBACSettings />
                    </TabsContent>
                )}

                {flags.widgetPermissions && (
                    <TabsContent value="widgets">
                        <WidgetPermissionsEditor />
                    </TabsContent>
                )}

                <TabsContent value="flags">
                    <FeatureFlagsEditor />
                </TabsContent>

                {flags.exportImport && (
                    <TabsContent value="export">
                        <ExportImport />
                    </TabsContent>
                )}

                <TabsContent value="shortcuts">
                    <KeyboardShortcutsHelp />
                </TabsContent>

                {flags.versionHistory && (
                    <TabsContent value="history">
                        <VersionHistory />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}
