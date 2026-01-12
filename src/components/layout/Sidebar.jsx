import { useState, useEffect } from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
    Home,
    LayoutGrid,
    Settings,
    Lightbulb,
    ChevronLeft,
    ChevronRight,
    Menu,
    Sparkles,
    ChevronDown,
    Building2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTenant } from '@/tenancy/TenantContext'
import { configService } from '@/tenancy/ConfigService'
import { useStore } from '@/app/store'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Wrench, Map, Play } from 'lucide-react'
import { ClipboardList } from 'lucide-react'

const navigationItems = [
    { id: 'home', path: '', icon: Home, labelKey: 'sidebar.home' },
    { id: 'widgets', path: 'widgets', icon: LayoutGrid, labelKey: 'sidebar.widgets' },
    { id: 'admin', path: 'admin', icon: Settings, labelKey: 'sidebar.admin' },
    { id: 'demo', path: 'demo', icon: Play, labelKey: 'sidebar.demo' },
    { id: 'suggestions', path: 'suggestions', icon: Lightbulb, labelKey: 'sidebar.suggestions' },
    { id: 'improvements', path: 'improvements', icon: Wrench, labelKey: 'sidebar.improvements' },
    { id: 'improvements-v2', path: 'improvements-v2', icon: ClipboardList, labelKey: 'sidebar.improvementsV2' },
    { id: 'roadmap', path: 'roadmap', icon: Map, labelKey: 'sidebar.roadmap' },
]

export function Sidebar({ isMobile = false, mobileMenuOpen = false, onMobileClose }) {
    const { t } = useTranslation()
    const { tenantId } = useParams()
    const navigate = useNavigate()
    const tenant = useTenant()
    const sidebarCollapsed = useStore((state) => state.sidebarCollapsed)
    const toggleSidebar = useStore((state) => state.toggleSidebar)

    const [allTenants, setAllTenants] = useState([])

    // Load all tenants for switcher
    useEffect(() => {
        async function loadTenants() {
            await configService.initialize()
            const tenants = await configService.getAllTenants()
            setAllTenants(tenants)
        }
        loadTenants()
    }, [])

    if (!tenant) return null

    const { sidebar, branding } = tenant

    // Determine sidebar state
    const isIconOnly = !isMobile && (sidebar.mode === 'icon-only' || (sidebar.mode === 'icon-text' && sidebarCollapsed))

    // Calculate width
    const sidebarWidth = isMobile ? 280 : (isIconOnly ? 72 : (sidebar.width || 260))

    const handleTenantSwitch = (newTenantId) => {
        navigate(`/t/${newTenantId}`)
        window.location.reload() // Force reload to apply new tenant config
    }

    // Handle navigation click on mobile
    const handleNavClick = () => {
        if (isMobile && onMobileClose) {
            onMobileClose()
        }
    }

    // Don't render if mobile and menu is closed
    if (isMobile && !mobileMenuOpen) return null

    // Don't render collapsed sidebar on desktop (not icon-only)
    if (!isMobile && sidebarCollapsed && sidebar.mode !== 'icon-only') {
        return (
            <TooltipProvider delayDuration={0}>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleSidebar}
                    className="fixed left-4 top-4 z-50 shadow-lg bg-[hsl(var(--card))] border-[hsl(var(--border))]"
                    aria-label="Open sidebar"
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </TooltipProvider>
        )
    }

    return (
        <TooltipProvider delayDuration={0}>
            {/* Main sidebar */}
            <aside
                style={{ width: sidebarWidth }}
                className={cn(
                    'fixed left-0 top-0 z-40 flex h-screen flex-col',
                    'bg-[hsl(var(--card))]',
                    'border-r border-[hsl(var(--border))]',
                    'sidebar-transition',
                    !isMobile && sidebar.position === 'right' && 'left-auto right-0 border-l border-r-0',
                    isMobile && 'shadow-xl'
                )}
                role="navigation"
                aria-label="Main navigation"
            >
                {/* Header / Logo */}
                <div className={cn(
                    'flex h-14 md:h-16 items-center border-b border-[hsl(var(--border))]',
                    isIconOnly ? 'justify-center px-3' : 'justify-between px-4'
                )}>
                    {!isIconOnly && (
                        <div className="flex items-center gap-3 min-w-0">
                            {branding.logoUrl ? (
                                <img
                                    src={branding.logoUrl}
                                    alt={`${branding.appName} logo`}
                                    className="h-8 w-8 md:h-9 md:w-9 rounded-lg object-contain flex-shrink-0"
                                    onError={(e) => {
                                        e.target.style.display = 'none'
                                    }}
                                />
                            ) : (
                                <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-lg bg-[hsl(var(--primary))] flex-shrink-0 shadow-sm">
                                    <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-[hsl(var(--primary-foreground))]" />
                                </div>
                            )}
                            <span className="font-bold text-[hsl(var(--foreground))] truncate text-base md:text-lg">
                                {branding.appName || 'Dashboard'}
                            </span>
                        </div>
                    )}

                    {isIconOnly && (
                        branding.logoUrl ? (
                            <img
                                src={branding.logoUrl}
                                alt={`${branding.appName} logo`}
                                className="h-9 w-9 rounded-lg object-contain"
                                onError={(e) => {
                                    e.target.style.display = 'none'
                                }}
                            />
                        ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--primary))] shadow-sm">
                                <Sparkles className="h-5 w-5 text-[hsl(var(--primary-foreground))]" />
                            </div>
                        )
                    )}

                    {/* Close button for mobile OR toggle for desktop icon-text mode */}
                    {isMobile ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onMobileClose}
                            className="h-8 w-8 flex-shrink-0"
                            aria-label="Close menu"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    ) : sidebar.mode === 'icon-text' && !isIconOnly && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSidebar}
                            className="h-8 w-8 flex-shrink-0"
                            aria-label="Collapse sidebar"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Navigation */}
                <ScrollArea className="flex-1 py-3">
                    <nav className={cn(
                        'flex flex-col gap-1',
                        isIconOnly ? 'px-3 items-center' : 'px-3'
                    )}>
                        {navigationItems.map((item) => {
                            const Icon = item.icon
                            const label = t(item.labelKey)
                            const to = `/t/${tenantId}${item.path ? `/${item.path}` : ''}`

                            if (isIconOnly) {
                                return (
                                    <Tooltip key={item.id}>
                                        <TooltipTrigger asChild>
                                            <NavLink
                                                to={to}
                                                end={item.path === ''}
                                                className={({ isActive }) =>
                                                    cn(
                                                        'flex h-11 w-11 items-center justify-center rounded-xl',
                                                        'text-[hsl(var(--muted-foreground))] transition-all duration-200',
                                                        'hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]',
                                                        isActive && [
                                                            'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]',
                                                            'hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]',
                                                            'shadow-sm'
                                                        ]
                                                    )
                                                }
                                                aria-label={label}
                                            >
                                                <Icon className="h-5 w-5" />
                                            </NavLink>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" sideOffset={10}>
                                            {label}
                                        </TooltipContent>
                                    </Tooltip>
                                )
                            }

                            return (
                                <NavLink
                                    key={item.id}
                                    to={to}
                                    end={item.path === ''}
                                    onClick={handleNavClick}
                                    className={({ isActive }) =>
                                        cn(
                                            'flex items-center gap-3 rounded-xl px-3 py-2.5',
                                            'text-sm text-[hsl(var(--muted-foreground))]',
                                            'transition-all duration-200',
                                            'hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]',
                                            isActive && [
                                                'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]',
                                                'hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]',
                                                'font-semibold shadow-sm'
                                            ]
                                        )
                                    }
                                >
                                    <Icon className="h-5 w-5 shrink-0" />
                                    <span className="truncate">{label}</span>
                                </NavLink>
                            )
                        })}
                    </nav>
                </ScrollArea>

                {/* Footer - Tenant Switcher */}
                <div className={cn(
                    'border-t border-[hsl(var(--border))] p-3',
                    isIconOnly && 'flex justify-center'
                )}>
                    {!isIconOnly ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[hsl(var(--accent))] transition-colors">
                                    <div className="h-9 w-9 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center">
                                        <span className="text-sm font-bold text-[hsl(var(--primary-foreground))]">
                                            {tenant.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1 text-left">
                                        <p className="text-sm font-semibold text-[hsl(var(--foreground))] truncate">
                                            {tenant.name}
                                        </p>
                                        <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                            Switch tenant
                                        </p>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                                {allTenants.map((t) => (
                                    <DropdownMenuItem
                                        key={t.id}
                                        onClick={() => handleTenantSwitch(t.id)}
                                        className={cn(
                                            'flex items-center gap-3 cursor-pointer',
                                            t.id === tenantId && 'bg-[hsl(var(--accent))]'
                                        )}
                                    >
                                        <div className={cn(
                                            'h-8 w-8 rounded-full flex items-center justify-center',
                                            t.id === tenantId ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))]'
                                        )}>
                                            <span className={cn(
                                                'text-xs font-bold',
                                                t.id === tenantId ? 'text-[hsl(var(--primary-foreground))]' : 'text-[hsl(var(--muted-foreground))]'
                                            )}>
                                                {t.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{t.name}</p>
                                            <p className="text-xs text-[hsl(var(--muted-foreground))]">{t.id}</p>
                                        </div>
                                        {t.id === tenantId && (
                                            <div className="h-2 w-2 rounded-full bg-[hsl(var(--primary))]" />
                                        )}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="h-11 w-11 rounded-xl bg-[hsl(var(--primary))] flex items-center justify-center hover:opacity-90 transition-opacity">
                                    <Building2 className="h-5 w-5 text-[hsl(var(--primary-foreground))]" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" align="end" className="w-56">
                                {allTenants.map((t) => (
                                    <DropdownMenuItem
                                        key={t.id}
                                        onClick={() => handleTenantSwitch(t.id)}
                                        className={cn(
                                            'flex items-center gap-3 cursor-pointer',
                                            t.id === tenantId && 'bg-[hsl(var(--accent))]'
                                        )}
                                    >
                                        <div className={cn(
                                            'h-8 w-8 rounded-full flex items-center justify-center',
                                            t.id === tenantId ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))]'
                                        )}>
                                            <span className={cn(
                                                'text-xs font-bold',
                                                t.id === tenantId ? 'text-[hsl(var(--primary-foreground))]' : 'text-[hsl(var(--muted-foreground))]'
                                            )}>
                                                {t.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{t.name}</p>
                                        </div>
                                        {t.id === tenantId && (
                                            <div className="h-2 w-2 rounded-full bg-[hsl(var(--primary))]" />
                                        )}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </aside>
        </TooltipProvider>
    )
}

