import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Plus, Grid, Layers, Search, ChevronDown } from 'lucide-react'
import { useTenant, useTenantContext } from '@/tenancy/TenantContext'
import { getAllWidgets, widgetCategories, getWidget } from '@/widgets/registry'
import { WidgetRenderer } from '@/widgets/WidgetRenderer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/Toast'
import { useMultiPageDashboard } from '@/hooks/useAdvancedFeatures'

/**
 * Widget Gallery Page
 * Browse all available widgets with live previews
 */
export default function WidgetGallery() {
    const { t } = useTranslation()
    const { tenantId } = useParams()
    const tenant = useTenant()
    const { updateConfig } = useTenantContext()
    const { showToast } = useToast()

    // Get pages from multi-page dashboard
    const pages = useMultiPageDashboard(tenantId)

    const [selectedCategory, setSelectedCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [addingWidget, setAddingWidget] = useState(null)
    const [targetPage, setTargetPage] = useState(pages.activePage)

    const allWidgets = getAllWidgets()

    // Filter widgets
    const filteredWidgets = allWidgets.filter(widget => {
        const matchesCategory = selectedCategory === 'all' || widget.category === selectedCategory
        const matchesSearch = widget.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            widget.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    // Add widget to selected page
    const handleAddWidget = useCallback(async (widget) => {
        setAddingWidget(widget.id)

        const pageWidgets = tenant?.layouts?.[targetPage] || []
        const newWidget = {
            id: `${widget.id}-${Date.now()}`,
            widgetId: widget.id,
            position: { row: 0, col: 0, width: 6, height: 1 },
            props: { ...widget.defaultProps },
        }

        await updateConfig({
            layouts: {
                ...tenant.layouts,
                [targetPage]: [...pageWidgets, newWidget],
            }
        })

        const pageName = pages.pages.find(p => p.id === targetPage)?.name || targetPage
        showToast(`Widget added to "${pageName}"`, 'success')
        setAddingWidget(null)
    }, [tenant, updateConfig, targetPage, pages.pages, showToast])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                        {t('widgets.title', 'Widget Gallery')}
                    </h1>
                    <p className="text-[hsl(var(--muted-foreground))]">
                        Browse and add widgets to your dashboard
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Target Page Selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-[hsl(var(--muted-foreground))]">Add to:</span>
                        <select
                            value={targetPage}
                            onChange={(e) => setTargetPage(e.target.value)}
                            className="px-3 py-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm font-medium"
                        >
                            {pages.pages.map(page => (
                                <option key={page.id} value={page.id}>
                                    {page.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Layers className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                        <span className="text-sm text-[hsl(var(--muted-foreground))]">
                            {allWidgets.length} widgets available
                        </span>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                    <Input
                        placeholder="Search widgets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={selectedCategory === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory('all')}
                    >
                        All
                    </Button>
                    {widgetCategories.map((category) => (
                        <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory(category.id)}
                        >
                            {category.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Widgets Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredWidgets.map((widget) => {
                    const isAdding = addingWidget === widget.id

                    return (
                        <Card key={widget.id} className="overflow-hidden group">
                            {/* Preview */}
                            <div className="h-48 p-3 bg-[hsl(var(--muted)/0.3)]">
                                <div className="h-full w-full overflow-hidden rounded-[var(--radius)] border border-[hsl(var(--border))]">
                                    <WidgetRenderer
                                        widgetId={widget.id}
                                        widgetProps={widget.defaultProps}
                                    />
                                </div>
                            </div>

                            {/* Info */}
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-[hsl(var(--foreground))] truncate">
                                            {widget.title}
                                        </h3>
                                        <p className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-2">
                                            {widget.description}
                                        </p>
                                        <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                                            {widgetCategories.find(c => c.id === widget.category)?.label || widget.category}
                                        </span>
                                    </div>

                                    <Button
                                        size="sm"
                                        onClick={() => handleAddWidget(widget)}
                                        disabled={isAdding}
                                        className="shrink-0"
                                    >
                                        {isAdding ? (
                                            'Adding...'
                                        ) : (
                                            <>
                                                <Plus className="h-4 w-4 mr-1" />
                                                Add
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Empty State */}
            {filteredWidgets.length === 0 && (
                <div className="flex h-64 items-center justify-center rounded-[var(--radius)] border-2 border-dashed border-[hsl(var(--border))]">
                    <div className="text-center">
                        <Grid className="h-12 w-12 mx-auto mb-4 text-[hsl(var(--muted-foreground))]" />
                        <p className="text-lg font-medium text-[hsl(var(--muted-foreground))]">
                            No widgets found
                        </p>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                            Try adjusting your search or filters
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
