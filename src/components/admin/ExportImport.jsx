import { useState, useRef } from 'react'
import { Download, Upload, FileJson } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useTenant, useTenantContext } from '@/tenancy/TenantContext'
import { useToast } from '@/components/Toast'
import { exportConfig, exportLayouts, importConfig, importLayouts } from '@/lib/exportImport'
import { cn } from '@/lib/utils'

/**
 * ExportImport Component
 * Handles exporting and importing tenant configurations
 */
export function ExportImport() {
    const tenant = useTenant()
    const { updateConfig } = useTenantContext()
    const toast = useToast()
    const fileInputRef = useRef(null)
    const layoutInputRef = useRef(null)

    const [importing, setImporting] = useState(false)

    const handleExportConfig = () => {
        try {
            exportConfig(tenant)
            toast.success('Export Complete', 'Configuration exported successfully!')
        } catch (error) {
            toast.error('Export Failed', error.message)
        }
    }

    const handleExportLayouts = () => {
        try {
            exportLayouts(tenant.layouts, tenant.id)
            toast.success('Export Complete', 'Layouts exported successfully!')
        } catch (error) {
            toast.error('Export Failed', error.message)
        }
    }

    const handleImportConfig = async (event) => {
        const file = event.target.files?.[0]
        if (!file) return

        setImporting(true)
        try {
            const result = await importConfig(file)

            if (result.success) {
                // Apply imported config (keep original ID)
                const importedData = {
                    ...result.data,
                    id: tenant.id, // Keep current tenant ID
                }
                await updateConfig(importedData)
                toast.success('Import Successful', 'Configuration updated. Refreshing...')
                setTimeout(() => window.location.reload(), 1500)
            } else {
                toast.error('Import Failed', result.error)
            }
        } catch (error) {
            toast.error('Import Error', error.message)
        }

        setImporting(false)
        event.target.value = ''
    }

    const handleImportLayouts = async (event) => {
        const file = event.target.files?.[0]
        if (!file) return

        setImporting(true)
        try {
            const result = await importLayouts(file)

            if (result.success) {
                await updateConfig({ layouts: result.layouts })
                toast.success('Import Successful', 'Layouts updated successfully!')
            } else {
                toast.error('Import Failed', result.error)
            }
        } catch (error) {
            toast.error('Import Error', error.message)
        }

        setImporting(false)
        event.target.value = ''
    }

    return (
        <div className="space-y-6">
            {/* Export Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Download className="h-5 w-5" />
                        Export
                    </CardTitle>
                    <CardDescription>
                        Download your configuration as JSON files
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Button
                            variant="outline"
                            className="h-auto flex-col gap-2 p-4"
                            onClick={handleExportConfig}
                        >
                            <FileJson className="h-8 w-8 text-[hsl(var(--primary))]" />
                            <div className="text-center">
                                <div className="font-semibold">Full Configuration</div>
                                <div className="text-xs text-[hsl(var(--muted-foreground))]">
                                    Theme, branding, layouts, etc.
                                </div>
                            </div>
                        </Button>

                        <Button
                            variant="outline"
                            className="h-auto flex-col gap-2 p-4"
                            onClick={handleExportLayouts}
                        >
                            <FileJson className="h-8 w-8 text-[hsl(var(--primary))]" />
                            <div className="text-center">
                                <div className="font-semibold">Layouts Only</div>
                                <div className="text-xs text-[hsl(var(--muted-foreground))]">
                                    Widget positions and props
                                </div>
                            </div>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Import Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Import
                    </CardTitle>
                    <CardDescription>
                        Upload a previously exported JSON file
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json"
                                onChange={handleImportConfig}
                                className="hidden"
                            />
                            <Button
                                variant="outline"
                                className="w-full h-auto flex-col gap-2 p-4"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={importing}
                            >
                                <Upload className="h-8 w-8 text-[hsl(var(--primary))]" />
                                <div className="text-center">
                                    <div className="font-semibold">Import Configuration</div>
                                    <div className="text-xs text-[hsl(var(--muted-foreground))]">
                                        Replace all settings
                                    </div>
                                </div>
                            </Button>
                        </div>

                        <div>
                            <input
                                ref={layoutInputRef}
                                type="file"
                                accept=".json"
                                onChange={handleImportLayouts}
                                className="hidden"
                            />
                            <Button
                                variant="outline"
                                className="w-full h-auto flex-col gap-2 p-4"
                                onClick={() => layoutInputRef.current?.click()}
                                disabled={importing}
                            >
                                <Upload className="h-8 w-8 text-[hsl(var(--primary))]" />
                                <div className="text-center">
                                    <div className="font-semibold">Import Layouts</div>
                                    <div className="text-xs text-[hsl(var(--muted-foreground))]">
                                        Only widget layouts
                                    </div>
                                </div>
                            </Button>
                        </div>
                    </div>

                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        ⚠️ Importing will overwrite existing configuration. Make sure to export a backup first.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
