import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Sun, Moon } from 'lucide-react'
import { useTenant, useTenantContext } from '@/tenancy/TenantContext'
import { useStore } from '@/app/store'
import { logAction, AuditActions } from '@/lib/auditLog'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

/**
 * Color input component for HSL values
 */
function ColorInput({ label, value, onChange }) {
    const hslToHex = (hsl) => {
        const match = hsl.match(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/)
        if (!match) return '#000000'
        const h = parseFloat(match[1])
        const s = parseFloat(match[2]) / 100
        const l = parseFloat(match[3]) / 100
        const a = s * Math.min(l, 1 - l)
        const f = (n) => {
            const k = (n + h / 30) % 12
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
            return Math.round(255 * color).toString(16).padStart(2, '0')
        }
        return `#${f(0)}${f(8)}${f(4)}`
    }

    const hexToHsl = (hex) => {
        let r = parseInt(hex.slice(1, 3), 16) / 255
        let g = parseInt(hex.slice(3, 5), 16) / 255
        let b = parseInt(hex.slice(5, 7), 16) / 255
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        let h, s
        const l = (max + min) / 2
        if (max === min) {
            h = s = 0
        } else {
            const d = max - min
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break
                case g: h = ((b - r) / d + 2) * 60; break
                case b: h = ((r - g) / d + 4) * 60; break
            }
        }
        return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
    }

    return (
        <div className="flex items-center gap-3">
            <Label className="w-24 text-sm">{label}</Label>
            <input
                type="color"
                value={hslToHex(value)}
                onChange={(e) => onChange(hexToHsl(e.target.value))}
                className="h-9 w-14 cursor-pointer rounded-[var(--radius)] border border-[hsl(var(--border))]"
            />
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 font-mono text-xs"
                placeholder="H S% L%"
            />
        </div>
    )
}

/**
 * Theme Editor Component
 * Allows customization of theme colors, mode, and radius
 */
export default function ThemeEditor() {
    const { t } = useTranslation()
    const tenant = useTenant()
    const { updateConfig } = useTenantContext()
    const applyTheme = useStore((state) => state.applyTheme)

    const { theme } = tenant

    const handleThemeChange = useCallback(
        async (updates, propertyName, propertyLabel) => {
            const newTheme = { ...theme, ...updates }

            // Log the change with property details
            const changedKey = Object.keys(updates)[0]
            logAction(
                changedKey === 'mode' ? AuditActions.THEME_MODE_CHANGE :
                    changedKey === 'radius' ? AuditActions.THEME_RADIUS_CHANGE :
                        AuditActions.THEME_COLOR_CHANGE,
                {
                    property: propertyName || changedKey,
                    propertyLabel: propertyLabel || changedKey,
                    previousValue: theme[changedKey],
                    newValue: updates[changedKey],
                    section: 'Theme',
                },
                tenant?.id
            )

            // Apply theme immediately for preview
            applyTheme(newTheme)

            // Update config
            await updateConfig({ theme: newTheme })
        },
        [theme, applyTheme, updateConfig, tenant]
    )

    const handleColorChange = useCallback(
        (colorKey, value, colorLabel) => {
            const previousValue = theme.colors?.[colorKey]

            // Log color change with specific property
            logAction(AuditActions.THEME_COLOR_CHANGE, {
                property: `theme.colors.${colorKey}`,
                propertyLabel: `${colorLabel} Color`,
                previousValue,
                newValue: value,
                section: 'Theme Colors',
            }, tenant?.id)

            handleThemeChange({
                colors: {
                    ...theme.colors,
                    [colorKey]: value,
                },
            })
        },
        [theme, handleThemeChange, tenant]
    )

    return (
        <div className="space-y-6">
            {/* Mode Selection */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('admin.theme.mode')}</CardTitle>
                    <CardDescription>
                        Choose between light and dark mode
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Button
                            variant={theme.mode === 'light' ? 'default' : 'outline'}
                            onClick={() => handleThemeChange({ mode: 'light' }, 'theme.mode', 'Theme Mode')}
                            className="flex-1"
                        >
                            <Sun className="mr-2 h-4 w-4" />
                            {t('admin.theme.light')}
                        </Button>
                        <Button
                            variant={theme.mode === 'dark' ? 'default' : 'outline'}
                            onClick={() => handleThemeChange({ mode: 'dark' }, 'theme.mode', 'Theme Mode')}
                            className="flex-1"
                        >
                            <Moon className="mr-2 h-4 w-4" />
                            {t('admin.theme.dark')}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Colors */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('admin.theme.colors')}</CardTitle>
                    <CardDescription>
                        Customize the color palette (HSL format)
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ColorInput
                        label={t('admin.theme.primary')}
                        value={theme.colors?.primary || '240 5.9% 10%'}
                        onChange={(v) => handleColorChange('primary', v, 'Primary')}
                    />
                    <ColorInput
                        label={t('admin.theme.secondary')}
                        value={theme.colors?.secondary || '240 4.8% 95.9%'}
                        onChange={(v) => handleColorChange('secondary', v, 'Secondary')}
                    />
                    <ColorInput
                        label={t('admin.theme.accent')}
                        value={theme.colors?.accent || '240 4.8% 95.9%'}
                        onChange={(v) => handleColorChange('accent', v, 'Accent')}
                    />
                    <ColorInput
                        label={t('admin.theme.background')}
                        value={theme.colors?.background || '0 0% 100%'}
                        onChange={(v) => handleColorChange('background', v, 'Background')}
                    />
                    <ColorInput
                        label={t('admin.theme.foreground')}
                        value={theme.colors?.foreground || '240 10% 3.9%'}
                        onChange={(v) => handleColorChange('foreground', v, 'Foreground')}
                    />
                </CardContent>
            </Card>

            {/* Border Radius */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('admin.theme.radius')}</CardTitle>
                    <CardDescription>
                        Control the border radius of UI elements
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Select
                        value={theme.radius || 'md'}
                        onValueChange={(value) => handleThemeChange({ radius: value }, 'theme.radius', 'Border Radius')}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">{t('admin.theme.none')}</SelectItem>
                            <SelectItem value="sm">{t('admin.theme.small')}</SelectItem>
                            <SelectItem value="md">{t('admin.theme.medium')}</SelectItem>
                            <SelectItem value="lg">{t('admin.theme.large')}</SelectItem>
                            <SelectItem value="full">{t('admin.theme.full')}</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Preview */}
                    <div className="mt-4 flex gap-4">
                        {['none', 'sm', 'md', 'lg', 'full'].map((r) => {
                            const radiusMap = { none: '0', sm: '0.25rem', md: '0.5rem', lg: '0.75rem', full: '9999px' }
                            return (
                                <div
                                    key={r}
                                    className={cn(
                                        'h-12 w-12 border-2 border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.2)]',
                                        theme.radius === r && 'ring-2 ring-[hsl(var(--ring))] ring-offset-2'
                                    )}
                                    style={{ borderRadius: radiusMap[r] }}
                                    onClick={() => handleThemeChange({ radius: r }, 'theme.radius', 'Border Radius')}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Set radius to ${r}`}
                                />
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
