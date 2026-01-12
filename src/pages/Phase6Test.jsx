import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    Copy,
    ClipboardPaste,
    Share2,
    FileDown,
    RefreshCw,
    Database,
    FileText,
    Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/Toast'

// Import all the new features
import {
    useWidgetClipboard,
    useAutoRefresh,
    useDashboardShare,
    useMultiPageDashboard,
    exportDashboardToPdf
} from '@/hooks/useAdvancedFeatures'
import { dataSourceManager } from '@/lib/dataSources'
import PageManager from '@/components/admin/PageManager'
import DashboardShareModal from '@/components/admin/DashboardShareModal'
import WidgetContextMenu, { useContextMenu } from '@/components/WidgetContextMenu'

/**
 * Phase 6 Feature Test Page
 * Interactive demo of all advanced features
 */
export default function Phase6TestPage() {
    const { tenantId } = useParams()
    const { showToast } = useToast()

    // Feature hooks
    const clipboard = useWidgetClipboard()
    const share = useDashboardShare(tenantId, 'test-page')
    const pages = useMultiPageDashboard(tenantId)
    const contextMenu = useContextMenu()

    // Auto-refresh demo
    const autoRefresh = useAutoRefresh(
        async () => {
            // Simulate API call
            await new Promise(r => setTimeout(r, 5000))
            return {
                timestamp: new Date().toISOString(),
                value: Math.floor(Math.random() * 100)
            }
        },
        5000, // Refresh every 5 seconds
        true // Enabled
    )

    // Share modal state
    const [shareModalOpen, setShareModalOpen] = useState(false)

    // Test data for clipboard
    const testWidget = {
        id: 'test-widget-1',
        type: 'stats',
        title: 'Test Widget',
        props: { value: 42, label: 'Test Value' }
    }

    // Test external data source
    const [dataSourceResult, setDataSourceResult] = useState(null)
    const [dataSourceLoading, setDataSourceLoading] = useState(false)

    const testDataSource = async () => {
        setDataSourceLoading(true)
        try {
            const data = await dataSourceManager.fetch({
                type: 'mock',
                dataType: 'metrics',
                count: 5
            })
            setDataSourceResult(data)
            showToast('Data fetched successfully!', 'success')
        } catch (error) {
            showToast('Failed to fetch data', 'error')
        } finally {
            setDataSourceLoading(false)
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold mb-2">Phase 6 Feature Tests</h1>
                <p className="text-[hsl(var(--muted-foreground))]">
                    Interactive demo of all advanced features
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Widget Clipboard Test */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Copy className="h-5 w-5" />
                            Widget Copy/Paste
                        </CardTitle>
                        <CardDescription>Test clipboard functionality</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Button
                                onClick={() => {
                                    clipboard.copyWidget(testWidget)
                                    showToast('Widget copied!', 'success')
                                }}
                            >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Test Widget
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    const pasted = clipboard.pasteWidget()
                                    if (pasted) {
                                        showToast(`Pasted: ${pasted.id}`, 'success')
                                    } else {
                                        showToast('Nothing to paste', 'warning')
                                    }
                                }}
                                disabled={!clipboard.hasContent}
                            >
                                <ClipboardPaste className="h-4 w-4 mr-2" />
                                Paste
                            </Button>
                        </div>
                        {clipboard.copied && (
                            <div className="flex items-center gap-2 text-emerald-500 text-sm">
                                <Check className="h-4 w-4" />
                                Copied to clipboard!
                            </div>
                        )}
                        {clipboard.clipboard && (
                            <pre className="p-3 rounded bg-[hsl(var(--muted))] text-xs overflow-auto">
                                {JSON.stringify(clipboard.clipboard, null, 2)}
                            </pre>
                        )}
                    </CardContent>
                </Card>

                {/* Auto Refresh Test */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <RefreshCw className="h-5 w-5" />
                            Real-time Refresh
                        </CardTitle>
                        <CardDescription>Auto-updates every 5 seconds</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-lg bg-[hsl(var(--muted))]">
                            {autoRefresh.loading ? (
                                <div className="flex items-center gap-2">
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    Loading...
                                </div>
                            ) : autoRefresh.data ? (
                                <div>
                                    <div className="text-2xl font-bold">{autoRefresh.data.value}</div>
                                    <div className="text-xs text-[hsl(var(--muted-foreground))]">
                                        Last update: {new Date(autoRefresh.data.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            ) : (
                                <div>No data yet</div>
                            )}
                        </div>
                        <Button variant="outline" onClick={autoRefresh.refresh}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Manual Refresh
                        </Button>
                    </CardContent>
                </Card>

                {/* Dashboard Share Test */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Share2 className="h-5 w-5" />
                            Dashboard Sharing
                        </CardTitle>
                        <CardDescription>Generate shareable links</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={() => setShareModalOpen(true)}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Open Share Modal
                        </Button>
                        {share.shareToken && (
                            <div className="p-3 rounded bg-[hsl(var(--muted))] text-xs break-all">
                                {share.shareToken.url}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Multi-Page Dashboard Test */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Multi-Page Dashboard
                        </CardTitle>
                        <CardDescription>Manage dashboard pages</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PageManager
                            pages={pages.pages}
                            activePage={pages.activePage}
                            onPageSelect={pages.setActivePage}
                            onPageAdd={pages.addPage}
                            onPageRemove={pages.removePage}
                            onPageRename={pages.renamePage}
                        />
                        <div className="mt-4 p-3 rounded bg-[hsl(var(--muted))] text-sm">
                            Active Page: <strong>{pages.currentPage?.name}</strong>
                        </div>
                    </CardContent>
                </Card>

                {/* PDF Export Test */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileDown className="h-5 w-5" />
                            PDF Export
                        </CardTitle>
                        <CardDescription>Export dashboard to PDF</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div
                            id="pdf-export-test"
                            className="p-4 rounded-lg border border-[hsl(var(--border))] bg-white dark:bg-gray-900"
                        >
                            <h3 className="font-bold mb-2">Sample Content for PDF</h3>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                This content will be exported to PDF
                            </p>
                            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                                <div className="p-2 rounded bg-blue-100 dark:bg-blue-900">42</div>
                                <div className="p-2 rounded bg-green-100 dark:bg-green-900">87</div>
                                <div className="p-2 rounded bg-purple-100 dark:bg-purple-900">156</div>
                            </div>
                        </div>
                        <Button
                            onClick={async () => {
                                showToast('PDF export requires html2canvas and jspdf packages', 'info')
                                // Uncomment after installing: npm install html2canvas jspdf
                                // const result = await exportDashboardToPdf('pdf-export-test', 'dashboard.pdf')
                                // if (result.success) showToast('PDF exported!', 'success')
                            }}
                        >
                            <FileDown className="h-4 w-4 mr-2" />
                            Export to PDF
                        </Button>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">
                            Note: Requires <code>npm install html2canvas jspdf</code>
                        </p>
                    </CardContent>
                </Card>

                {/* External Data Source Test */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            External Data Sources
                        </CardTitle>
                        <CardDescription>Fetch data from APIs</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            onClick={testDataSource}
                            disabled={dataSourceLoading}
                        >
                            <Database className="h-4 w-4 mr-2" />
                            {dataSourceLoading ? 'Fetching...' : 'Fetch Mock Data'}
                        </Button>
                        {dataSourceResult && (
                            <pre className="p-3 rounded bg-[hsl(var(--muted))] text-xs overflow-auto max-h-40">
                                {JSON.stringify(dataSourceResult, null, 2)}
                            </pre>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Context Menu Test Area */}
            <Card>
                <CardHeader>
                    <CardTitle>Right-Click Test Area</CardTitle>
                    <CardDescription>Right-click on the boxes below to see context menu</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        {[1, 2, 3].map(i => (
                            <div
                                key={i}
                                onContextMenu={(e) => contextMenu.openMenu(e, { id: `widget-${i}`, title: `Widget ${i}` })}
                                className="w-32 h-24 rounded-lg border-2 border-dashed border-[hsl(var(--border))] flex items-center justify-center cursor-context-menu hover:border-[hsl(var(--primary))] transition-colors"
                            >
                                Widget {i}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Share Modal */}
            <DashboardShareModal
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                shareToken={share.shareToken}
                isGenerating={share.isGenerating}
                onGenerateLink={share.generateShareLink}
                onRevokeLink={share.revokeShare}
            />

            {/* Context Menu */}
            <WidgetContextMenu
                position={contextMenu.position}
                isOpen={contextMenu.isOpen}
                onClose={contextMenu.closeMenu}
                widget={contextMenu.targetWidget}
                canPaste={clipboard.hasContent}
                onCopy={() => {
                    clipboard.copyWidget(contextMenu.targetWidget)
                    showToast('Widget copied!', 'success')
                }}
                onPaste={() => {
                    const pasted = clipboard.pasteWidget()
                    showToast(`Pasted widget: ${pasted?.id}`, 'success')
                }}
                onDelete={() => showToast('Delete clicked', 'info')}
                onEdit={() => showToast('Edit clicked', 'info')}
                onDuplicate={() => showToast('Duplicate clicked', 'info')}
            />
        </div>
    )
}
