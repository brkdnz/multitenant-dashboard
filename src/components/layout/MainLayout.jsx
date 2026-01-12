import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useTenant, useTenantContext } from '@/tenancy/TenantContext'
import { useStore } from '@/app/store'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { cn } from '@/lib/utils'
import CommandPalette, { useCommandPalette } from '@/components/CommandPalette'
import OnboardingWizard, { useOnboarding } from '@/components/OnboardingWizard'

/**
 * Main Layout Component
 * Provides the shell for all authenticated pages with sidebar and header
 */
export function MainLayout() {
    const tenant = useTenant()
    const { isLoading, error } = useTenantContext()
    const sidebarCollapsed = useStore((state) => state.sidebarCollapsed)
    const [isMobile, setIsMobile] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Check for mobile viewport
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
            if (window.innerWidth >= 768) {
                setMobileMenuOpen(false)
            }
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Command Palette (Cmd+K)
    const { isOpen: commandPaletteOpen, close: closeCommandPalette } = useCommandPalette()

    // Onboarding Wizard
    const { isOpen: onboardingOpen, close: closeOnboarding, checkAndShow: checkOnboarding, complete: completeOnboarding } = useOnboarding()

    // Show onboarding on first visit
    useEffect(() => {
        if (!isLoading && tenant) {
            checkOnboarding()
        }
    }, [isLoading, tenant, checkOnboarding])

    // Loading state
    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[hsl(var(--background))]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[hsl(var(--primary))] border-t-transparent" />
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[hsl(var(--background))] p-4">
                <div className="max-w-md rounded-[var(--radius)] border border-[hsl(var(--destructive))] bg-[hsl(var(--card))] p-6 text-center">
                    <h2 className="mb-2 text-lg font-semibold text-[hsl(var(--destructive))]">
                        Error Loading Dashboard
                    </h2>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{error}</p>
                </div>
            </div>
        )
    }

    // No tenant loaded
    if (!tenant) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[hsl(var(--background))]">
                <p className="text-[hsl(var(--muted-foreground))]">No tenant configuration found</p>
            </div>
        )
    }

    const { sidebar } = tenant
    const isCollapsed = sidebar.mode === 'collapsed' && !sidebarCollapsed
    const isIconOnly = sidebar.mode === 'icon-only' || sidebarCollapsed

    // Calculate left margin based on sidebar state (only for desktop)
    const marginLeft = isMobile ? 0 : (isCollapsed
        ? 0
        : isIconOnly
            ? 64
            : sidebar.width || 280)

    return (
        <div className="min-h-screen bg-[hsl(var(--background))]">
            {/* Command Palette */}
            <CommandPalette isOpen={commandPaletteOpen} onClose={closeCommandPalette} />

            {/* Onboarding Wizard */}
            <OnboardingWizard isOpen={onboardingOpen} onClose={closeOnboarding} onComplete={completeOnboarding} />

            {/* Mobile Overlay */}
            {isMobile && mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <Sidebar
                isMobile={isMobile}
                mobileMenuOpen={mobileMenuOpen}
                onMobileClose={() => setMobileMenuOpen(false)}
            />

            {/* Main Content Area */}
            <div
                style={{ marginLeft }}
                className={cn(
                    'flex min-h-screen flex-col sidebar-transition',
                    sidebar.position === 'right' && 'ml-0',
                    sidebar.position === 'right' && !isCollapsed && `mr-[${marginLeft}px]`
                )}
            >
                {/* Header */}
                <Header
                    isMobile={isMobile}
                    onMenuClick={() => setMobileMenuOpen(true)}
                />

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

