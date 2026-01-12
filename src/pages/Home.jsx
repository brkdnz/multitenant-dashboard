import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Share2, FileDown, Plus, RefreshCw, MoreHorizontal, X, Edit2, Check } from 'lucide-react'
import { useTenant, useTenantContext } from '@/tenancy/TenantContext'
import { DragProvider, DroppableArea } from '@/components/dnd/DragContext'
import { WidgetShell } from '@/widgets/WidgetShell'
import { WidgetRenderer } from '@/widgets/WidgetRenderer'
import { cn } from '@/lib/utils'
import { useFeatureFlag } from '@/hooks/useFeatureFlag'
import { filterWidgetsByRole } from '@/lib/rbac'
import { useStore } from '@/app/store'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/Toast'
import EmptyState, { EmptyWidgets } from '@/components/EmptyState'

// Phase 6 Features
import {
    useWidgetClipboard,
    useDashboardShare,
    useMultiPageDashboard,
    exportDashboardToPdf
} from '@/hooks/useAdvancedFeatures'
import WidgetContextMenu, { useContextMenu } from '@/components/WidgetContextMenu'
import DashboardShareModal from '@/components/admin/DashboardShareModal'

/**
 * Home Dashboard Page
 * Displays the main dashboard with draggable widgets and Phase 6 features
 */
export default function Home() {
    const { t } = useTranslation()
    const { tenantId } = useParams()
    const tenant = useTenant()
    const { updateConfig } = useTenantContext()
    const toast = useToast()
    const [showGrid, setShowGrid] = useState(false)

    // Page rename state
    const [editingPageId, setEditingPageId] = useState(null)
    const [editingPageName, setEditingPageName] = useState('')

    // Get current user role from store (default to 'user' for demo)
    const currentUserRole = useStore((state) => state.currentUserRole) || 'admin'

    // Feature flags
    const widgetPermissionsEnabled = useFeatureFlag('widgetPermissions')
    const snapToGridEnabled = useFeatureFlag('snapToGrid')

    // Phase 6: Multi-page dashboard
    const pages = useMultiPageDashboard(tenantId)
    const pageId = pages.activePage || 'home'

    // Phase 6: Widget clipboard
    const clipboard = useWidgetClipboard()

    // Phase 6: Dashboard sharing
    const share = useDashboardShare(tenantId, pageId)
    const [shareModalOpen, setShareModalOpen] = useState(false)

    // Phase 6: Context menu
    const contextMenu = useContextMenu()

    const allWidgets = tenant?.layouts?.[pageId] || []

    // Filter widgets based on user role if widget permissions are enabled
    const widgets = widgetPermissionsEnabled
        ? filterWidgetsByRole(allWidgets, tenant?.widgetPermissions, currentUserRole)
        : allWidgets

    /**
     * Handle widget reorder
     */
    const handleReorder = useCallback(
        async (newWidgets) => {
            await updateConfig({
                layouts: {
                    ...tenant.layouts,
                    [pageId]: newWidgets,
                },
            })
        },
        [tenant, updateConfig, pageId]
    )

    /**
     * Handle widget removal
     */
    const handleRemoveWidget = useCallback(
        async (widgetId) => {
            const newWidgets = allWidgets.filter((w) => w.id !== widgetId)
            await handleReorder(newWidgets)
            toast.success('Widget removed')
        },
        [allWidgets, handleReorder, toast]
    )

    /**
     * Handle widget update (props or position)
     */
    const handleUpdateWidget = useCallback(
        async (widgetId, updates) => {
            const newWidgets = allWidgets.map((w) => {
                if (w.id !== widgetId) return w

                return {
                    ...w,
                    ...(updates.position && { position: { ...w.position, ...updates.position } }),
                    ...(updates.props && { props: { ...w.props, ...updates.props } }),
                }
            })
            await handleReorder(newWidgets)
        },
        [allWidgets, handleReorder]
    )

    /**
     * Handle widget copy
     */
    const handleCopyWidget = useCallback((widget) => {
        clipboard.copyWidget(widget)
        toast.success('Widget copied to clipboard')
    }, [clipboard, toast])

    /**
     * Handle widget paste
     */
    const handlePasteWidget = useCallback(async () => {
        const pastedWidget = clipboard.pasteWidget(() => `widget - ${Date.now()} `)
        if (pastedWidget) {
            const newWidgets = [...allWidgets, pastedWidget]
            await handleReorder(newWidgets)
            toast.success('Widget pasted')
        }
    }, [clipboard, allWidgets, handleReorder, toast])

    /**
     * Handle widget duplicate
     */
    const handleDuplicateWidget = useCallback(async (widget) => {
        const duplicated = {
            ...JSON.parse(JSON.stringify(widget)),
            id: `widget - ${Date.now()} `
        }
        const newWidgets = [...allWidgets, duplicated]
        await handleReorder(newWidgets)
        toast.success('Widget duplicated')
    }, [allWidgets, handleReorder, toast])

    /**
     * Handle PDF export
     */
    const handleExportPdf = async () => {
        toast.info('Exporting dashboard...')
        const result = await exportDashboardToPdf('dashboard-content', `dashboard-${pageId}.pdf`)
        if (result.success) {
            toast.success('Dashboard exported to PDF!')
        } else {
            toast.error(`Export failed: ${result.error}`)
        }
    }

    /**
     * Handle drag events for snap-to-grid visual
     */
    const handleDragStart = useCallback(() => {
        setShowGrid(true)
    }, [])

    const handleDragEnd = useCallback(() => {
        setShowGrid(false)
    }, [])

    if (!tenant) {
        return null
    }

    return (
        <div className="space-y-4">
            {/* Dashboard Header with Actions */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                        {pages.currentPage?.name || t('home.title')}
                    </h1>
                    <p className="text-[hsl(var(--muted-foreground))]">
                        {t('home.welcome')}, {tenant.name}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    {clipboard.hasContent && (
                        <Button variant="outline" size="sm" onClick={handlePasteWidget}>
                            Paste Widget
                        </Button>
                    )}
                    <Button variant="outline" size="icon" onClick={handleExportPdf} title="Export to PDF">
                        <FileDown className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setShareModalOpen(true)} title="Share Dashboard">
                        <Share2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Page Tabs - Always show to allow adding pages */}
            <div className="flex items-center gap-1 border-b border-[hsl(var(--border))] pb-2">
                {pages.pages.map(page => (
                    <div
                        key={page.id}
                        className={cn(
                            'flex items-center gap-1 px-3 py-1.5 rounded-t-lg text-sm font-medium transition-colors group',
                            page.id === pages.activePage
                                ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                                : 'hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'
                        )}
                    >
                        {editingPageId === page.id ? (
                            /* Inline Edit Mode */
                            <div className="flex items-center gap-1">
                                <input
                                    type="text"
                                    value={editingPageName}
                                    onChange={(e) => setEditingPageName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            pages.renamePage(page.id, editingPageName)
                                            setEditingPageId(null)
                                            toast.success('Page renamed')
                                        }
                                        if (e.key === 'Escape') {
                                            setEditingPageId(null)
                                        }
                                    }}
                                    onBlur={() => {
                                        if (editingPageName.trim()) {
                                            pages.renamePage(page.id, editingPageName)
                                        }
                                        setEditingPageId(null)
                                    }}
                                    className="w-24 px-1 py-0.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded border"
                                    autoFocus
                                />
                                <button
                                    onClick={() => {
                                        pages.renamePage(page.id, editingPageName)
                                        setEditingPageId(null)
                                        toast.success('Page renamed')
                                    }}
                                    className="p-0.5 rounded hover:bg-white/20"
                                >
                                    <Check className="h-3 w-3" />
                                </button>
                            </div>
                        ) : (
                            /* Normal Display Mode */
                            <>
                                <button
                                    onClick={() => pages.setActivePage(page.id)}
                                    onDoubleClick={() => {
                                        if (!page.isDefault) {
                                            setEditingPageId(page.id)
                                            setEditingPageName(page.name)
                                        }
                                    }}
                                    className="truncate max-w-[120px]"
                                    title={page.isDefault ? page.name : 'Double-click to rename'}
                                >
                                    {page.name}
                                </button>
                                {/* Edit & Delete buttons - only for non-default pages */}
                                {!page.isDefault && (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setEditingPageId(page.id)
                                                setEditingPageName(page.name)
                                            }}
                                            className={cn(
                                                'p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity',
                                                page.id === pages.activePage ? 'hover:bg-white/20' : 'hover:bg-gray-500/20'
                                            )}
                                            title="Rename page"
                                        >
                                            <Edit2 className="h-3 w-3" />
                                        </button>
                                        {pages.pages.length > 1 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (confirm(`Delete "${page.name}"?`)) {
                                                        pages.removePage(page.id)
                                                        toast.success(`Page "${page.name}" deleted`)
                                                    }
                                                }}
                                                className={cn(
                                                    'p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity',
                                                    page.id === pages.activePage
                                                        ? 'hover:bg-white/20'
                                                        : 'hover:bg-red-500/20 hover:text-red-500'
                                                )}
                                                title="Delete page"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                ))}
                <button
                    onClick={() => {
                        const newPage = pages.addPage({ name: `Page ${pages.pages.length + 1}` })
                        pages.setActivePage(newPage.id)
                        setEditingPageId(newPage.id)
                        setEditingPageName(newPage.name)
                    }}
                    className="px-2 py-1.5 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                    title="Add Page"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>

            {/* Widget Grid with Snap-to-Grid overlay */}
            <div id="dashboard-content" className="relative">
                {/* Snap-to-Grid Visual Guide */}
                {showGrid && snapToGridEnabled && (
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <div className="grid grid-cols-12 gap-4 h-full">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-[hsl(var(--primary)/0.1)] border border-dashed border-[hsl(var(--primary)/0.3)] rounded-lg flex items-center justify-center"
                                >
                                    <span className="text-xs text-[hsl(var(--primary)/0.5)] font-mono">
                                        {i + 1}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Widget Grid */}
                <DragProvider
                    pageId={pageId}
                    items={widgets}
                    onReorder={handleReorder}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <DroppableArea
                        className="grid grid-cols-12 gap-4 relative z-10"
                    >
                        {widgets.map((widget) => {
                            // Calculate grid span based on widget position
                            const { position } = widget
                            const colSpan = position?.width || 6
                            const rowSpan = position?.height || 1

                            return (
                                <div
                                    key={widget.id}
                                    onContextMenu={(e) => contextMenu.openMenu(e, widget)}
                                    className={cn(
                                        'min-h-[120px]',
                                        `col - span - 12 md: col - span - ${Math.min(colSpan, 12)} `,
                                        rowSpan > 1 && `row - span - ${rowSpan} `
                                    )}
                                    style={{
                                        gridColumn: `span ${Math.min(colSpan, 12)} / span ${Math.min(colSpan, 12)}`,
                                        gridRow: rowSpan > 1 ? `span ${rowSpan} / span ${rowSpan}` : undefined,
                                        minHeight: rowSpan > 1 ? `${120 * rowSpan + (rowSpan - 1) * 16}px` : '120px',
                                    }}
                                >
                                    <WidgetShell
                                        id={widget.id}
                                        pageId={pageId}
                                        widgetId={widget.widgetId}
                                        position={widget.position}
                                        widgetProps={widget.props || {}}
                                        onRemove={() => handleRemoveWidget(widget.id)}
                                        onUpdate={(updates) => handleUpdateWidget(widget.id, updates)}
                                    >
                                        <WidgetRenderer
                                            widgetId={widget.widgetId}
                                            widgetProps={widget.props}
                                        />
                                    </WidgetShell>
                                </div >
                            )
                        })}
                    </DroppableArea >
                </DragProvider >
            </div >

            {/* Empty State */}
            {
                widgets.length === 0 && (
                    <EmptyWidgets onAdd={() => window.location.href = `/t/${tenantId}/widgets`} />
                )
            }

            {/* Context Menu */}
            <WidgetContextMenu
                position={contextMenu.position}
                isOpen={contextMenu.isOpen}
                onClose={contextMenu.closeMenu}
                widget={contextMenu.targetWidget}
                canPaste={clipboard.hasContent}
                onCopy={() => handleCopyWidget(contextMenu.targetWidget)}
                onPaste={handlePasteWidget}
                onDelete={() => handleRemoveWidget(contextMenu.targetWidget?.id)}
                onDuplicate={() => handleDuplicateWidget(contextMenu.targetWidget)}
            />

            {/* Share Modal */}
            <DashboardShareModal
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                shareToken={share.shareToken}
                isGenerating={share.isGenerating}
                onGenerateLink={share.generateShareLink}
                onRevokeLink={share.revokeShare}
            />
        </div >
    )
}

