import { useEffect, useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useToast } from '@/components/Toast'
import { TenantProvider } from './TenantContext'
import { configService } from './ConfigService'

/**
 * TenantResolver Component
 * Resolves tenant from URL parameter and provides TenantProvider
 * 
 * URL Structure: /t/:tenantId/...
 */
export function TenantResolver({ children }) {
    const { tenantId } = useParams()
    const navigate = useNavigate()
    const [isValidating, setIsValidating] = useState(true)
    const [isValid, setIsValid] = useState(false)

    useEffect(() => {
        async function validateTenant() {
            if (!tenantId) {
                setIsValidating(false)
                setIsValid(false)
                return
            }

            try {
                await configService.initialize()
                const config = await configService.getTenantConfig(tenantId)
                setIsValid(!!config)
            } catch (error) {
                console.error('Tenant validation failed:', error)
                setIsValid(false)
            }

            setIsValidating(false)
        }

        validateTenant()
    }, [tenantId])

    // Show loading while validating
    if (isValidating) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[hsl(var(--background))]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[hsl(var(--primary))] border-t-transparent" />
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">Loading tenant...</p>
                </div>
            </div>
        )
    }

    // Redirect to tenant selector if no tenant or invalid
    if (!tenantId || !isValid) {
        return <Navigate to="/select-tenant" replace />
    }

    return (
        <TenantProvider tenantId={tenantId}>
            {children}
        </TenantProvider>
    )
}

/**
 * TenantSelector Component
 * Shows list of available tenants to select
 */
export function TenantSelector() {
    const navigate = useNavigate()
    const toast = useToast()
    const [tenants, setTenants] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadTenants() {
            try {
                await configService.initialize()
                const allTenants = await configService.getAllTenants()
                setTenants(allTenants)
            } catch (error) {
                console.error('Failed to load tenants:', error)
            }
            setIsLoading(false)
        }

        loadTenants()
    }, [])

    const handleSelectTenant = (tenantId) => {
        navigate(`/t/${tenantId}`)
    }

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[hsl(var(--background))]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[hsl(var(--primary))] border-t-transparent" />
            </div>
        )
    }

    const testConnection = async () => {
        try {
            console.log('Testing Supabase connection...')
            const { supabase } = await import('@/lib/supabase')
            if (!supabase) {
                toast.error('Configuration Error', 'Supabase client not initialized! Check .env variables.')
                return
            }

            const { data, error } = await supabase.from('tenants').select('*')
            if (error) {
                console.error('Connection test error:', error)
                toast.error('Connection Failed', `Supabase Error: ${error.message}`)
            } else {
                console.log('Connection success:', data)
                toast.success('Connection Successful', `Found ${data.length} tenants. Reloading...`)

                if (data.length > 0) {
                    setTimeout(() => window.location.reload(), 1500)
                }
            }
        } catch (err) {
            console.error('Test failed:', err)
            toast.error('Test Failed', err.message)
        }
    }

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-gradient-to-br from-[hsl(var(--background))] to-[hsl(var(--muted))] p-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-[hsl(var(--foreground))]">
                    Multi-Tenant Dashboard
                </h1>
                <p className="mt-2 text-[hsl(var(--muted-foreground))]">
                    Select a tenant to continue
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tenants.map((tenant) => (
                    <button
                        key={tenant.id}
                        onClick={() => handleSelectTenant(tenant.id)}
                        className="group relative overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-left shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[hsl(var(--primary)/0.1)] opacity-0 transition-opacity group-hover:opacity-100" />

                        <div className="relative">
                            <div className="mb-2 text-xl font-semibold text-[hsl(var(--foreground))]">
                                {tenant.name}
                            </div>
                            <div className="text-sm text-[hsl(var(--muted-foreground))]">
                                {tenant.branding?.appName || tenant.id}
                            </div>
                            <div className="mt-4 flex gap-2">
                                <span className="rounded-full bg-[hsl(var(--secondary))] px-2 py-1 text-xs text-[hsl(var(--secondary-foreground))]">
                                    {tenant.i18n?.defaultLanguage?.toUpperCase() || 'EN'}
                                </span>
                                <span className="rounded-full bg-[hsl(var(--secondary))] px-2 py-1 text-xs text-[hsl(var(--secondary-foreground))]">
                                    {tenant.theme?.mode || 'light'}
                                </span>
                                <span className="rounded-full bg-[hsl(var(--secondary))] px-2 py-1 text-xs text-[hsl(var(--secondary-foreground))]">
                                    {tenant.sidebar?.mode || 'icon-text'}
                                </span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {tenants.length === 0 && (
                <div className="text-center max-w-md mx-auto p-6 bg-card rounded-xl border border-border shadow-sm">
                    {/* Check if we are running with Supabase */}
                    {configService.adapter.constructor.name === 'SupabaseAdapter' || Boolean(import.meta.env.VITE_SUPABASE_URL) ? (
                        <div className="space-y-4">
                            <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                                <span className="text-2xl">⚠️</span>
                            </div>
                            <h3 className="text-lg font-semibold">Veritabanı Kurulumu Gerekli</h3>
                            <p className="text-sm text-muted-foreground">
                                Supabase bağlantısı aktif ancak henüz veri bulunamadı.
                                Lütfen aşağıdaki adımları takip edin:
                            </p>
                            <div className="text-left text-xs bg-muted p-3 rounded-md font-mono overflow-x-auto space-y-2">
                                <p>1. Supabase Dashboard &gt; SQL Editor'ü açın</p>
                                <p>2. `supabase_schema.sql` dosyasının içeriğini yapıştırın</p>
                                <p>3. "RUN" butonuna basarak tabloları oluşturun</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                                >
                                    Yenile
                                </button>
                                <button
                                    onClick={testConnection}
                                    className="px-4 py-2 rounded-lg border border-primary text-primary font-medium hover:bg-primary/10 transition-colors"
                                >
                                    Bağlantıyı Test Et
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="text-[hsl(var(--muted-foreground))] mb-4">
                                No tenants found.
                            </p>
                            <button
                                onClick={async () => {
                                    // Force clear cache and reinitialize
                                    configService.cache.clear()
                                    configService.initialized = false
                                    await configService.initialize()
                                    const allTenants = await configService.getAllTenants()
                                    setTenants(allTenants)
                                }}
                                className="px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium hover:opacity-90 transition-opacity"
                            >
                                Initialize Mock Data
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
