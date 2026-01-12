import { useState } from 'react'
import { Store, LayoutGrid, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useTenant, useTenantContext } from '@/tenancy/TenantContext'
import { DASHBOARD_TEMPLATES, getTemplatesByCategory, getTemplateCategories } from '@/lib/templates'
import { cn } from '@/lib/utils'

/**
 * TemplateMarketplace Component
 * Browse and apply pre-built dashboard templates
 */
export function TemplateMarketplace() {
    const tenant = useTenant()
    const { updateConfig } = useTenantContext()
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [applying, setApplying] = useState(null)
    const [applied, setApplied] = useState(null)

    const categories = getTemplateCategories()
    const templates = getTemplatesByCategory(selectedCategory)

    const handleApplyTemplate = async (template) => {
        setApplying(template.id)

        // Apply template layouts
        await updateConfig({
            layouts: template.layouts
        })

        setApplying(null)
        setApplied(template.id)

        // Reset applied status after 3 seconds
        setTimeout(() => setApplied(null), 3000)
    }

    const categoryLabels = {
        all: 'All Templates',
        business: 'Business',
        analytics: 'Analytics',
        productivity: 'Productivity',
        marketing: 'Marketing',
        general: 'General',
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                    <Store className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">
                        Template Marketplace
                    </h2>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Pre-built dashboard layouts ready to use
                    </p>
                </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                    >
                        {categoryLabels[category] || category}
                    </Button>
                ))}
            </div>

            {/* Templates Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => {
                    const isApplying = applying === template.id
                    const isApplied = applied === template.id

                    return (
                        <Card
                            key={template.id}
                            className={cn(
                                'group overflow-hidden transition-all hover:shadow-lg',
                                isApplied && 'ring-2 ring-emerald-500'
                            )}
                        >
                            {/* Preview Header */}
                            <div className="relative h-32 bg-gradient-to-br from-[hsl(var(--muted))] to-[hsl(var(--muted)/0.5)] flex items-center justify-center">
                                <span className="text-5xl">{template.thumbnail}</span>

                                {/* Category Badge */}
                                <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-[hsl(var(--background)/0.9)] text-[hsl(var(--foreground))]">
                                    {categoryLabels[template.category] || template.category}
                                </span>

                                {/* Applied Badge */}
                                {isApplied && (
                                    <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                                        <div className="flex items-center gap-2 bg-emerald-500 text-white px-3 py-1.5 rounded-full">
                                            <CheckCircle2 className="h-4 w-4" />
                                            <span className="text-sm font-medium">Applied!</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    {template.name}
                                    {template.id === 'minimal-dashboard' && (
                                        <Sparkles className="h-4 w-4 text-yellow-500" />
                                    )}
                                </CardTitle>
                                <CardDescription className="text-sm">
                                    {template.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                {/* Widget Count */}
                                <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                                    <LayoutGrid className="h-3 w-3" />
                                    <span>{template.layouts.home.length} widgets</span>
                                </div>

                                {/* Apply Button */}
                                <Button
                                    className="w-full"
                                    onClick={() => handleApplyTemplate(template)}
                                    disabled={isApplying}
                                >
                                    {isApplying ? (
                                        'Applying...'
                                    ) : isApplied ? (
                                        <>
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            Applied
                                        </>
                                    ) : (
                                        <>
                                            Use Template
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Info */}
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)] p-4">
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    💡 Applying a template will replace your current dashboard layout. You can always customize widgets after applying.
                </p>
            </div>
        </div>
    )
}
