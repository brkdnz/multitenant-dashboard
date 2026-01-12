import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { History, RotateCcw, Trash2, Eye, ChevronDown, ChevronUp, Download, Search, Filter } from 'lucide-react'
import { useTenant, useTenantContext } from '@/tenancy/TenantContext'
import { getConfigVersions, rollbackToVersion } from '@/lib/versioning'
import {
    getAuditLog,
    getTenantAuditLog,
    clearAuditLog,
    exportAuditLog,
    getAuditLogStats,
    SeverityColors,
    CategoryColors
} from '@/lib/auditLog'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

/**
 * Version History Component
 * Shows configuration version history, audit log with filtering, and rollback capability
 */
import { useToast } from '@/components/Toast'

// ...

export default function VersionHistory() {
    const { t } = useTranslation()
    const tenant = useTenant()
    const { updateConfig } = useTenantContext()
    const toast = useToast()

    const [expandedVersion, setExpandedVersion] = useState(null)
    const [expandedLog, setExpandedLog] = useState(null)
    const [showAuditLog, setShowAuditLog] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [severityFilter, setSeverityFilter] = useState('all')

    if (!tenant) return null

    const versions = getConfigVersions(tenant.id)
    const allLogs = getTenantAuditLog(tenant.id)
    const stats = getAuditLogStats()

    // Filter logs
    const filteredLogs = allLogs.filter((entry) => {
        const matchesSearch = searchQuery === '' ||
            entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            JSON.stringify(entry.details).toLowerCase().includes(searchQuery.toLowerCase())

        const matchesCategory = categoryFilter === 'all' || entry.category === categoryFilter
        const matchesSeverity = severityFilter === 'all' || entry.severity === severityFilter

        return matchesSearch && matchesCategory && matchesSeverity
    })

    const handleRollback = async (versionId) => {
        try {
            const config = rollbackToVersion(tenant.id, versionId)
            if (config) {
                const result = await updateConfig(config)
                if (result.success) {
                    toast.success('Restored', 'Configuration rolled back successfully')
                } else {
                    toast.error('Restore Failed', result.error)
                }
            }
        } catch (error) {
            toast.error('Error', error.message)
        }
    }

    const handleExportLogs = () => {
        const json = exportAuditLog()
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `audit-log-${tenant.id}-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    const formatDate = (isoString) => {
        const date = new Date(isoString)
        return date.toLocaleString()
    }

    const formatRelativeTime = (isoString) => {
        const date = new Date(isoString)
        const now = new Date()
        const diffMs = now - date
        const diffSec = Math.floor(diffMs / 1000)
        const diffMin = Math.floor(diffSec / 60)
        const diffHour = Math.floor(diffMin / 60)
        const diffDay = Math.floor(diffHour / 24)

        if (diffSec < 60) return `${diffSec}s ago`
        if (diffMin < 60) return `${diffMin}m ago`
        if (diffHour < 24) return `${diffHour}h ago`
        return `${diffDay}d ago`
    }

    const categories = [...new Set(allLogs.map((l) => l.category))]

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">Total Entries</div>
                </Card>
                <Card className="p-4">
                    <div className="text-2xl font-bold text-blue-600">{stats.bySeverity.info}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">Info</div>
                </Card>
                <Card className="p-4">
                    <div className="text-2xl font-bold text-yellow-600">{stats.bySeverity.warning}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">Warning</div>
                </Card>
                <Card className="p-4">
                    <div className="text-2xl font-bold text-red-600">{stats.bySeverity.critical}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">Critical</div>
                </Card>
            </div>

            {/* Version History */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        <CardTitle>Version History</CardTitle>
                    </div>
                    <CardDescription>
                        View and restore previous configurations ({versions.length} versions)
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {versions.length === 0 ? (
                        <p className="text-center text-sm text-[hsl(var(--muted-foreground))] py-4">
                            No version history available. Save your configuration to create a version.
                        </p>
                    ) : (
                        versions.slice(0, 5).map((version, index) => (
                            <div
                                key={version.id}
                                className="rounded-[var(--radius)] border border-[hsl(var(--border))] p-3"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">
                                                {index === 0 ? 'Current' : `Version ${versions.length - index}`}
                                            </span>
                                            {index === 0 && (
                                                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                    Latest
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                            {formatDate(version.timestamp)} • {version.description}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setExpandedVersion(expandedVersion === version.id ? null : version.id)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        {index !== 0 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleRollback(version.id)}
                                            >
                                                <RotateCcw className="mr-1 h-4 w-4" />
                                                Restore
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {expandedVersion === version.id && (
                                    <div className="mt-3 rounded bg-[hsl(var(--muted))] p-3">
                                        <pre className="text-xs overflow-auto max-h-48">
                                            {JSON.stringify(version.config, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Audit Log */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setShowAuditLog(!showAuditLog)}
                        >
                            <History className="h-5 w-5" />
                            <CardTitle>Audit Log</CardTitle>
                            <span className="rounded-full bg-[hsl(var(--muted))] px-2 py-0.5 text-xs">
                                {filteredLogs.length}
                            </span>
                            {showAuditLog ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleExportLogs}>
                                <Download className="mr-1 h-4 w-4" />
                                Export
                            </Button>
                        </div>
                    </div>
                    <CardDescription>
                        Track all configuration changes with detailed information
                    </CardDescription>
                </CardHeader>

                {showAuditLog && (
                    <CardContent className="space-y-4">
                        {/* Filters */}
                        <div className="flex flex-wrap gap-2">
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                                    <Input
                                        placeholder="Search logs..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={severityFilter} onValueChange={setSeverityFilter}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Severity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="info">Info</SelectItem>
                                    <SelectItem value="warning">Warning</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Log Entries */}
                        {filteredLogs.length === 0 ? (
                            <p className="text-center text-sm text-[hsl(var(--muted-foreground))] py-4">
                                No log entries found
                            </p>
                        ) : (
                            <div className="max-h-[400px] space-y-2 overflow-y-auto">
                                {filteredLogs.slice(0, 50).map((entry) => (
                                    <div
                                        key={entry.id}
                                        className="rounded-[var(--radius)] border border-[hsl(var(--border))] p-3"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                {/* Property Label - Primary display */}
                                                {entry.details?.propertyLabel && (
                                                    <div className="mb-1">
                                                        <span className="font-semibold text-[hsl(var(--foreground))]">
                                                            {entry.details.propertyLabel}
                                                        </span>
                                                        {entry.details?.property && (
                                                            <span className="ml-2 font-mono text-xs text-[hsl(var(--muted-foreground))]">
                                                                ({entry.details.property})
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-mono text-xs text-[hsl(var(--muted-foreground))]">{entry.action}</span>
                                                    <span className={cn('rounded-full px-2 py-0.5 text-xs', CategoryColors[entry.category] || CategoryColors.General)}>
                                                        {entry.category}
                                                    </span>
                                                    <span className={cn('rounded-full px-2 py-0.5 text-xs', SeverityColors[entry.severity])}>
                                                        {entry.severity}
                                                    </span>
                                                </div>
                                                {/* Inline Before → After */}
                                                {(entry.details?.previousValue !== undefined || entry.details?.newValue !== undefined) && (
                                                    <div className="mt-1.5 flex items-center gap-2 text-xs flex-wrap">
                                                        {entry.details.previousValue !== undefined && entry.details.previousValue !== null && (
                                                            <span className="rounded bg-red-100 px-1.5 py-0.5 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-mono">
                                                                {typeof entry.details.previousValue === 'object'
                                                                    ? JSON.stringify(entry.details.previousValue).slice(0, 40)
                                                                    : String(entry.details.previousValue).slice(0, 40)}
                                                                {String(entry.details.previousValue).length > 40 ? '...' : ''}
                                                            </span>
                                                        )}
                                                        {entry.details.previousValue !== undefined && entry.details.newValue !== undefined && (
                                                            <span className="text-[hsl(var(--muted-foreground))] font-bold">→</span>
                                                        )}
                                                        {entry.details.newValue !== undefined && entry.details.newValue !== null && (
                                                            <span className="rounded bg-green-100 px-1.5 py-0.5 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-mono">
                                                                {typeof entry.details.newValue === 'object'
                                                                    ? JSON.stringify(entry.details.newValue).slice(0, 40)
                                                                    : String(entry.details.newValue).slice(0, 40)}
                                                                {String(entry.details.newValue).length > 40 ? '...' : ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="mt-1 flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                                                    <span>{formatRelativeTime(entry.timestamp)}</span>
                                                    <span>•</span>
                                                    <span>{entry.userName} ({entry.userRole})</span>
                                                    {entry.details?.section && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{entry.details.section}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setExpandedLog(expandedLog === entry.id ? null : entry.id)}
                                            >
                                                {expandedLog === entry.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                            </Button>
                                        </div>

                                        {/* Expanded Details */}
                                        {expandedLog === entry.id && (
                                            <div className="mt-3 space-y-2 rounded bg-[hsl(var(--muted))] p-3 text-xs">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <span className="font-medium">Timestamp:</span>
                                                        <br />{formatDate(entry.timestamp)}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">User Agent:</span>
                                                        <br /><span className="truncate block">{entry.userAgent?.slice(0, 50)}...</span>
                                                    </div>
                                                </div>

                                                {entry.details.previousValue !== null && (
                                                    <div>
                                                        <span className="font-medium">Previous Value:</span>
                                                        <pre className="mt-1 rounded bg-red-50 p-2 text-red-800 dark:bg-red-900/20 dark:text-red-400 overflow-auto max-h-20">
                                                            {JSON.stringify(entry.details.previousValue, null, 2)}
                                                        </pre>
                                                    </div>
                                                )}

                                                {entry.details.newValue !== null && (
                                                    <div>
                                                        <span className="font-medium">New Value:</span>
                                                        <pre className="mt-1 rounded bg-green-50 p-2 text-green-800 dark:bg-green-900/20 dark:text-green-400 overflow-auto max-h-20">
                                                            {JSON.stringify(entry.details.newValue, null, 2)}
                                                        </pre>
                                                    </div>
                                                )}

                                                {Object.keys(entry.details).filter(k => !['previousValue', 'newValue', 'affectedItems', 'reason'].includes(k)).length > 0 && (
                                                    <div>
                                                        <span className="font-medium">Additional Details:</span>
                                                        <pre className="mt-1 rounded bg-[hsl(var(--background))] p-2 overflow-auto max-h-20">
                                                            {JSON.stringify(
                                                                Object.fromEntries(
                                                                    Object.entries(entry.details).filter(([k]) => !['previousValue', 'newValue', 'affectedItems', 'reason'].includes(k))
                                                                ),
                                                                null, 2
                                                            )}
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Clear Button */}
                        <div className="flex justify-end pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (confirm('Are you sure you want to clear all audit logs?')) {
                                        clearAuditLog()
                                        window.location.reload()
                                    }
                                }}
                                className="text-[hsl(var(--destructive))]"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Clear All Logs
                            </Button>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    )
}
