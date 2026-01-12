import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, RotateCcw, Search } from 'lucide-react'
import { useTenant, useTenantContext } from '@/tenancy/TenantContext'
import { changeLanguage } from '@/i18n'
import { logAction, AuditActions } from '@/lib/auditLog'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

/**
 * Language Editor Component
 * Manage i18n settings and translation overrides
 */
export default function LanguageEditor() {
    const { t, i18n } = useTranslation()
    const tenant = useTenant()
    const { updateConfig } = useTenantContext()

    const [searchTerm, setSearchTerm] = useState('')
    const [newKey, setNewKey] = useState('')
    const [newValue, setNewValue] = useState('')

    const { i18n: i18nConfig } = tenant
    const currentLang = i18n.language
    const overrides = i18nConfig.overrides?.[currentLang] || {}

    const handleI18nChange = useCallback(
        async (updates, propertyName, propertyLabel) => {
            const changedKey = Object.keys(updates)[0]
            const previousValue = i18nConfig[changedKey]

            // Log the change
            logAction(
                changedKey === 'enabled' ? AuditActions.I18N_TOGGLE : AuditActions.I18N_LANGUAGE_CHANGE,
                {
                    property: propertyName || `i18n.${changedKey}`,
                    propertyLabel: propertyLabel || changedKey,
                    previousValue,
                    newValue: updates[changedKey],
                    section: 'Language Settings',
                },
                tenant?.id
            )

            const newConfig = { ...i18nConfig, ...updates }
            await updateConfig({ i18n: newConfig })
        },
        [i18nConfig, updateConfig, tenant]
    )

    const handleLanguageChange = useCallback(
        async (language) => {
            const previousLanguage = i18nConfig.defaultLanguage

            // Log the change
            logAction(AuditActions.I18N_LANGUAGE_CHANGE, {
                property: 'i18n.defaultLanguage',
                propertyLabel: 'Default Language',
                previousValue: previousLanguage,
                newValue: language,
                section: 'Language Settings',
            }, tenant?.id)

            await handleI18nChange({ defaultLanguage: language })
            const overrides = i18nConfig.overrides?.[language] || {}
            changeLanguage(language, overrides)
        },
        [handleI18nChange, i18nConfig, tenant]
    )

    const handleAddOverride = useCallback(async () => {
        if (!newKey.trim() || !newValue.trim()) return

        // Log the change
        logAction(AuditActions.I18N_OVERRIDE_ADD, {
            property: `i18n.overrides.${currentLang}.${newKey.trim()}`,
            propertyLabel: `Translation Override: ${newKey.trim()}`,
            previousValue: null,
            newValue: newValue.trim(),
            language: currentLang,
            key: newKey.trim(),
            section: 'Translation Overrides',
        }, tenant?.id)

        const newOverrides = {
            ...i18nConfig.overrides,
            [currentLang]: {
                ...overrides,
                [newKey.trim()]: newValue.trim(),
            },
        }

        await handleI18nChange({ overrides: newOverrides })
        changeLanguage(currentLang, newOverrides[currentLang])

        setNewKey('')
        setNewValue('')
    }, [newKey, newValue, currentLang, overrides, i18nConfig, handleI18nChange, tenant])

    const handleRemoveOverride = useCallback(
        async (key) => {
            const removedValue = overrides[key]

            // Log the change
            logAction(AuditActions.I18N_OVERRIDE_REMOVE, {
                property: `i18n.overrides.${currentLang}.${key}`,
                propertyLabel: `Translation Override: ${key}`,
                previousValue: removedValue,
                newValue: null,
                language: currentLang,
                key,
                section: 'Translation Overrides',
            }, tenant?.id)

            const { [key]: removed, ...rest } = overrides

            const newOverrides = {
                ...i18nConfig.overrides,
                [currentLang]: rest,
            }

            await handleI18nChange({ overrides: newOverrides })
            changeLanguage(currentLang, newOverrides[currentLang])
        },
        [currentLang, overrides, i18nConfig, handleI18nChange, tenant]
    )

    const handleResetOverrides = useCallback(async () => {
        const previousOverrides = overrides

        // Log the change
        logAction(AuditActions.I18N_OVERRIDE_REMOVE, {
            property: `i18n.overrides.${currentLang}`,
            propertyLabel: 'All Translation Overrides',
            previousValue: previousOverrides,
            newValue: {},
            language: currentLang,
            section: 'Translation Overrides',
            reason: 'Reset all overrides',
        }, tenant?.id)

        const newOverrides = {
            ...i18nConfig.overrides,
            [currentLang]: {},
        }

        await handleI18nChange({ overrides: newOverrides })
        changeLanguage(currentLang, {})
    }, [currentLang, i18nConfig, handleI18nChange, overrides, tenant])

    const filteredOverrides = Object.entries(overrides).filter(
        ([key, value]) =>
            key.toLowerCase().includes(searchTerm.toLowerCase()) ||
            value.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Enable/Disable i18n */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('admin.language.title')}</CardTitle>
                    <CardDescription>
                        Enable multi-language support and configure translations
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="i18n-enabled" className="flex flex-col">
                            <span>{t('admin.language.enabled')}</span>
                            <span className="text-sm font-normal text-[hsl(var(--muted-foreground))]">
                                Show language selector in the header
                            </span>
                        </Label>
                        <Switch
                            id="i18n-enabled"
                            checked={i18nConfig.enabled}
                            onCheckedChange={(checked) => handleI18nChange(
                                { enabled: checked },
                                'i18n.enabled',
                                'Language Support Enabled'
                            )}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Default Language */}
            {i18nConfig.enabled && (
                <Card>
                    <CardHeader>
                        <CardTitle>{t('admin.language.default')}</CardTitle>
                        <CardDescription>
                            Choose the default language for this tenant
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Select
                            value={i18nConfig.defaultLanguage}
                            onValueChange={handleLanguageChange}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tr">{t('admin.language.turkish')} (Türkçe)</SelectItem>
                                <SelectItem value="en">{t('admin.language.english')} (English)</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
            )}

            {/* Translation Overrides */}
            {i18nConfig.enabled && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>{t('admin.language.overrides')}</CardTitle>
                                <CardDescription>
                                    Override default translations with custom text
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleResetOverrides}
                                disabled={Object.keys(overrides).length === 0}
                            >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                {t('admin.language.resetDefaults')}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                            <Input
                                placeholder={t('common.search')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Add New Override */}
                        <div className="flex gap-2">
                            <Input
                                placeholder={t('admin.language.key')}
                                value={newKey}
                                onChange={(e) => setNewKey(e.target.value)}
                                className="flex-1 font-mono text-sm"
                            />
                            <Input
                                placeholder={t('admin.language.value')}
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                className="flex-1"
                            />
                            <Button onClick={handleAddOverride} disabled={!newKey || !newValue}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Override List */}
                        <div className="max-h-64 space-y-2 overflow-y-auto">
                            {filteredOverrides.length === 0 ? (
                                <p className="py-4 text-center text-sm text-[hsl(var(--muted-foreground))]">
                                    No overrides defined
                                </p>
                            ) : (
                                filteredOverrides.map(([key, value]) => (
                                    <div
                                        key={key}
                                        className="flex items-center gap-2 rounded-[var(--radius)] border border-[hsl(var(--border))] p-2"
                                    >
                                        <code className="flex-1 text-xs text-[hsl(var(--muted-foreground))]">
                                            {key}
                                        </code>
                                        <span className="flex-1 text-sm">{value}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveOverride(key)}
                                            className="h-8 w-8"
                                        >
                                            <Trash2 className="h-4 w-4 text-[hsl(var(--destructive))]" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
