import { useTranslation } from 'react-i18next'
import { Moon, Sun, Globe, User, LogOut, Menu, Search, Command } from 'lucide-react'
import { useTenant, useTenantContext } from '@/tenancy/TenantContext'
import { useStore } from '@/app/store'
import { changeLanguage } from '@/i18n'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export function Header() {
    const { t, i18n } = useTranslation()
    const tenant = useTenant()
    const { updateConfig } = useTenantContext()
    const applyTheme = useStore((state) => state.applyTheme)
    const toggleSidebar = useStore((state) => state.toggleSidebar)

    if (!tenant) return null

    const { theme, i18n: i18nConfig, branding } = tenant

    const handleThemeToggle = async () => {
        const newMode = theme.mode === 'dark' ? 'light' : 'dark'

        // Update tenant config
        await updateConfig({
            theme: {
                ...theme,
                mode: newMode,
            },
        })

        // Apply theme immediately
        applyTheme({ ...theme, mode: newMode })
    }

    const handleLanguageChange = async (language) => {
        // Update tenant config
        await updateConfig({
            i18n: {
                ...i18nConfig,
                defaultLanguage: language,
            },
        })

        // Apply language change with overrides
        const overrides = i18nConfig.overrides?.[language] || {}
        changeLanguage(language, overrides)
    }

    // Open command palette (trigger the keyboard shortcut programmatically)
    const openSearch = () => {
        const event = new KeyboardEvent('keydown', {
            key: 'k',
            ctrlKey: true,
            bubbles: true
        })
        window.dispatchEvent(event)
    }

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--background))/95] px-4 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--background))/60]">
            {/* Left side - Mobile menu + Title */}
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="lg:hidden"
                    aria-label="Toggle menu"
                >
                    <Menu className="h-5 w-5" />
                </Button>

                <div className="hidden sm:block">
                    <h1 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                        {branding.appName}
                    </h1>
                </div>
            </div>

            {/* Center - Search Button */}
            <button
                onClick={openSearch}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)] hover:bg-[hsl(var(--muted))] transition-colors text-sm text-[hsl(var(--muted-foreground))]"
                aria-label="Open search"
            >
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline">Search...</span>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-xs font-mono">
                    <Command className="h-3 w-3" />K
                </kbd>
            </button>

            {/* Right side - Controls */}
            <div className="flex items-center gap-2">
                {/* Language Selector - only show if i18n is enabled */}
                {i18nConfig.enabled && (
                    <div className="hidden sm:block">
                        <Select
                            value={i18n.language}
                            onValueChange={handleLanguageChange}
                        >
                            <SelectTrigger className="w-[120px]" aria-label="Select language">
                                <Globe className="mr-2 h-4 w-4" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {i18nConfig.supportedLanguages.map((lang) => (
                                    <SelectItem key={lang} value={lang}>
                                        {lang === 'tr' ? 'Türkçe' : 'English'}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleThemeToggle}
                    aria-label={`Switch to ${theme.mode === 'dark' ? 'light' : 'dark'} theme`}
                >
                    {theme.mode === 'dark' ? (
                        <Sun className="h-5 w-5" />
                    ) : (
                        <Moon className="h-5 w-5" />
                    )}
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="User menu">
                            <User className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>{t('header.profile')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            {t('header.settings')}
                        </DropdownMenuItem>

                        {/* Mobile language selector */}
                        {i18nConfig.enabled && (
                            <DropdownMenuItem
                                className="sm:hidden"
                                onClick={() => {
                                    const newLang = i18n.language === 'tr' ? 'en' : 'tr'
                                    handleLanguageChange(newLang)
                                }}
                            >
                                <Globe className="mr-2 h-4 w-4" />
                                {i18n.language === 'tr' ? 'English' : 'Türkçe'}
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-[hsl(var(--destructive))]">
                            <LogOut className="mr-2 h-4 w-4" />
                            {t('header.logout')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
