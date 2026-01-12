import { useState } from 'react'
import { Palette, Check, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useTenant, useTenantContext } from '@/tenancy/TenantContext'
import { PRESET_THEMES, applyPresetTheme } from '@/lib/presetThemes'
import { cn } from '@/lib/utils'

/**
 * PresetThemeSelector Component
 * Select from preset themes
 */
export function PresetThemeSelector() {
    const tenant = useTenant()
    const { updateConfig } = useTenantContext()
    const [selectedId, setSelectedId] = useState(null)
    const [filter, setFilter] = useState('all') // 'all', 'light', 'dark'

    const filteredThemes = filter === 'all'
        ? PRESET_THEMES
        : PRESET_THEMES.filter(t => t.mode === filter)

    const handleSelectTheme = async (theme) => {
        setSelectedId(theme.id)
        const themeConfig = applyPresetTheme(theme)
        await updateConfig({ theme: themeConfig })
    }

    const isCurrentTheme = (theme) => {
        // Check if current tenant theme matches this preset
        return tenant.theme?.mode === theme.mode &&
            tenant.theme?.colors?.primary === theme.colors.primary
    }

    return (
        <div className="space-y-4">
            {/* Filter */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[hsl(var(--foreground))]">Filter:</span>
                <div className="flex gap-1">
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('all')}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === 'light' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('light')}
                    >
                        <Sun className="h-4 w-4 mr-1" />
                        Light
                    </Button>
                    <Button
                        variant={filter === 'dark' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('dark')}
                    >
                        <Moon className="h-4 w-4 mr-1" />
                        Dark
                    </Button>
                </div>
            </div>

            {/* Theme Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredThemes.map((theme) => {
                    const isCurrent = isCurrentTheme(theme)
                    const isSelected = selectedId === theme.id

                    return (
                        <Card
                            key={theme.id}
                            className={cn(
                                'cursor-pointer overflow-hidden transition-all hover:shadow-lg',
                                (isCurrent || isSelected) && 'ring-2 ring-[hsl(var(--primary))]'
                            )}
                            onClick={() => handleSelectTheme(theme)}
                        >
                            {/* Theme Preview */}
                            <div
                                className="relative h-24"
                                style={{
                                    backgroundColor: `hsl(${theme.colors.background})`,
                                }}
                            >
                                {/* Simulated UI elements */}
                                <div
                                    className="absolute left-3 top-3 h-4 w-12 rounded"
                                    style={{
                                        backgroundColor: `hsl(${theme.colors.primary})`,
                                    }}
                                />
                                <div
                                    className="absolute left-3 bottom-3 right-12 h-3 rounded"
                                    style={{
                                        backgroundColor: `hsl(${theme.colors.muted})`,
                                    }}
                                />
                                <div
                                    className="absolute right-3 top-3 h-8 w-8 rounded"
                                    style={{
                                        backgroundColor: `hsl(${theme.colors.secondary})`,
                                        borderWidth: '1px',
                                        borderColor: `hsl(${theme.colors.border})`,
                                    }}
                                />

                                {/* Current/Selected badge */}
                                {isCurrent && (
                                    <div className="absolute right-2 bottom-2 flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(var(--primary))]">
                                        <Check className="h-4 w-4 text-[hsl(var(--primary-foreground))]" />
                                    </div>
                                )}

                                {/* Mode badge */}
                                <div className="absolute left-2 bottom-2 flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-xs text-white">
                                    {theme.mode === 'light' ? (
                                        <Sun className="h-3 w-3" />
                                    ) : (
                                        <Moon className="h-3 w-3" />
                                    )}
                                    {theme.mode}
                                </div>
                            </div>

                            <CardContent className="p-3">
                                <div className="font-semibold text-sm text-[hsl(var(--foreground))]">
                                    {theme.name}
                                </div>
                                <div className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                                    {theme.description}
                                </div>

                                {/* Color swatches */}
                                <div className="flex gap-1 mt-2">
                                    <div
                                        className="h-4 w-4 rounded-full border border-[hsl(var(--border))]"
                                        style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                                        title="Primary"
                                    />
                                    <div
                                        className="h-4 w-4 rounded-full border border-[hsl(var(--border))]"
                                        style={{ backgroundColor: `hsl(${theme.colors.secondary})` }}
                                        title="Secondary"
                                    />
                                    <div
                                        className="h-4 w-4 rounded-full border border-[hsl(var(--border))]"
                                        style={{ backgroundColor: `hsl(${theme.colors.background})` }}
                                        title="Background"
                                    />
                                    <div
                                        className="h-4 w-4 rounded-full border border-[hsl(var(--border))]"
                                        style={{ backgroundColor: `hsl(${theme.colors.foreground})` }}
                                        title="Foreground"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
