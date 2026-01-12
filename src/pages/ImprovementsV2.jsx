import { useState } from 'react'
import {
    AlertTriangle,
    CheckCircle2,
    Circle,
    Zap,
    Code,
    Palette,
    Shield,
    Gauge,
    Users,
    Globe,
    Smartphone,
    Database,
    TestTube,
    FileCode,
    Lightbulb,
    TrendingUp,
    Star,
    MessageSquare,
    Building,
    Eye,
    Wrench,
    Clock,
    Target,
    CheckSquare,
    Square
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * GÜNCEL İYİLEŞTİRME ÖNERİLERİ - Ocak 2026
 * Proje kapsamlı inceleme sonucu tespit edilen alanlar
 */
const improvements = {
    security: {
        title: 'Güvenlik & Kimlik Doğrulama',
        icon: Shield,
        color: 'red',
        items: [
            { id: 'sec-1', text: 'RLS (Row Level Security) politikalarını production-ready hale getir', priority: 'critical', effort: 'medium', done: false },
            { id: 'sec-2', text: 'Supabase Auth entegrasyonunu tamamla (şu an bypass ediliyor)', priority: 'critical', effort: 'medium', done: false },
            { id: 'sec-3', text: 'API rate limiting ekle', priority: 'high', effort: 'medium', done: false },
            { id: 'sec-4', text: 'Widget props için XSS sanitization', priority: 'high', effort: 'low', done: false },
            { id: 'sec-5', text: 'Audit log verilerini Supabase\'e persist et', priority: 'medium', effort: 'low', done: true },
            { id: 'sec-6', text: 'CORS policy\'yi production için yapılandır', priority: 'medium', effort: 'low', done: false },
        ]
    },
    performance: {
        title: 'Performans Optimizasyonu',
        icon: Gauge,
        color: 'orange',
        items: [
            { id: 'perf-1', text: 'Bundle size analizi yap (vite-plugin-analyzer)', priority: 'high', effort: 'low', done: false },
            { id: 'perf-2', text: 'Widget componentlerini dynamic import ile lazy load et', priority: 'high', effort: 'medium', done: true },
            { id: 'perf-3', text: 'React.memo ile gereksiz re-render\'ları önle', priority: 'medium', effort: 'medium', done: false },
            { id: 'perf-4', text: 'Supabase query\'lerini optimize et (select only needed columns)', priority: 'medium', effort: 'low', done: false },
            { id: 'perf-5', text: 'Service Worker ile offline caching', priority: 'low', effort: 'high', done: false },
            { id: 'perf-6', text: 'Widget gallery için virtualization (react-window)', priority: 'low', effort: 'medium', done: false },
        ]
    },
    testing: {
        title: 'Test & Kalite Güvence',
        icon: TestTube,
        color: 'purple',
        items: [
            { id: 'test-1', text: 'Vitest kurulumu ve unit test altyapısı', priority: 'critical', effort: 'medium', done: false },
            { id: 'test-2', text: 'ConfigService için unit testler', priority: 'high', effort: 'medium', done: false },
            { id: 'test-3', text: 'Widget registry için unit testler', priority: 'high', effort: 'low', done: false },
            { id: 'test-4', text: 'Playwright E2E test kurulumu', priority: 'medium', effort: 'high', done: false },
            { id: 'test-5', text: 'Ana akışlar için E2E testler (login, widget add, theme)', priority: 'medium', effort: 'high', done: false },
            { id: 'test-6', text: 'Storybook ile widget showcase', priority: 'low', effort: 'medium', done: false },
        ]
    },
    ux: {
        title: 'Kullanıcı Deneyimi',
        icon: Palette,
        color: 'blue',
        items: [
            { id: 'ux-1', text: 'Mobile responsive iyileştirmeleri', priority: 'high', effort: 'medium', done: true },
            { id: 'ux-2', text: 'Global arama (Cmd+K) Command Palette', priority: 'high', effort: 'medium', done: true },
            { id: 'ux-3', text: 'Onboarding wizard yeni kullanıcılar için', priority: 'medium', effort: 'medium', done: true },
            { id: 'ux-4', text: 'Empty state tasarımları', priority: 'medium', effort: 'low', done: true },
            { id: 'ux-5', text: 'Toast bildirim sistemi', priority: 'medium', effort: 'low', done: true },
            { id: 'ux-6', text: 'Keyboard shortcuts (Ctrl+Z, Ctrl+S, etc.)', priority: 'medium', effort: 'medium', done: true },
            { id: 'ux-7', text: 'Breadcrumb navigasyonu', priority: 'low', effort: 'low', done: false },
            { id: 'ux-8', text: 'Widget drag feedback animasyonları', priority: 'low', effort: 'low', done: false },
        ]
    },
    codeQuality: {
        title: 'Kod Kalitesi & Mimari',
        icon: Code,
        color: 'indigo',
        items: [
            { id: 'code-1', text: 'TypeScript migration (kademeli)', priority: 'high', effort: 'high', done: false },
            { id: 'code-2', text: 'Error Boundary\'leri widget seviyesine indir', priority: 'high', effort: 'low', done: false },
            { id: 'code-3', text: 'Prettier + ESLint strict config', priority: 'medium', effort: 'low', done: false },
            { id: 'code-4', text: 'JSDoc yorumlarını tamamla', priority: 'low', effort: 'medium', done: false },
            { id: 'code-5', text: 'Husky pre-commit hooks', priority: 'medium', effort: 'low', done: false },
            { id: 'code-6', text: 'Monorepo yapısına geçiş (widgets ayrı paket)', priority: 'low', effort: 'high', done: false },
        ]
    },
    features: {
        title: 'Eksik Özellikler',
        icon: Zap,
        color: 'yellow',
        items: [
            { id: 'feat-1', text: 'Multi-page dashboard desteği', priority: 'high', effort: 'medium', done: true },
            { id: 'feat-2', text: 'Widget kopyala/yapıştır', priority: 'medium', effort: 'low', done: true },
            { id: 'feat-3', text: 'Dashboard paylaşım linki', priority: 'medium', effort: 'medium', done: true },
            { id: 'feat-4', text: 'PDF/Image export', priority: 'medium', effort: 'medium', done: false },
            { id: 'feat-5', text: 'Widget auto-refresh interval', priority: 'medium', effort: 'low', done: true },
            { id: 'feat-6', text: 'Gerçek API veri kaynakları', priority: 'high', effort: 'high', done: false },
            { id: 'feat-7', text: 'Webhook entegrasyonu', priority: 'low', effort: 'high', done: false },
            { id: 'feat-8', text: 'Email bildirim sistemi', priority: 'low', effort: 'high', done: false },
        ]
    },
    devops: {
        title: 'DevOps & CI/CD',
        icon: Wrench,
        color: 'gray',
        items: [
            { id: 'devops-1', text: 'GitHub Actions CI pipeline', priority: 'high', effort: 'medium', done: false },
            { id: 'devops-2', text: 'Automatic deployment to Vercel/Netlify', priority: 'high', effort: 'low', done: true },
            { id: 'devops-3', text: 'Environment-specific configs', priority: 'medium', effort: 'low', done: true },
            { id: 'devops-4', text: 'Docker containerization', priority: 'low', effort: 'medium', done: false },
            { id: 'devops-5', text: 'Staging environment setup', priority: 'medium', effort: 'medium', done: false },
            { id: 'devops-6', text: 'Semantic versioning + CHANGELOG', priority: 'low', effort: 'low', done: false },
        ]
    },
    documentation: {
        title: 'Dokümantasyon',
        icon: FileCode,
        color: 'cyan',
        items: [
            { id: 'doc-1', text: 'Widget oluşturma rehberi', priority: 'high', effort: 'medium', done: false },
            { id: 'doc-2', text: 'API documentation (JSDoc → TypeDoc)', priority: 'medium', effort: 'medium', done: false },
            { id: 'doc-3', text: 'CONTRIBUTING.md', priority: 'medium', effort: 'low', done: false },
            { id: 'doc-4', text: 'Architecture decision records (ADR)', priority: 'low', effort: 'medium', done: false },
            { id: 'doc-5', text: 'Video tutorial serisi', priority: 'low', effort: 'high', done: false },
        ]
    },
}

/**
 * PAYDAŞ PERSPEKTİFLERİ
 */
const stakeholderPerspectives = {
    productManager: {
        role: 'Ürün Yöneticisi',
        icon: Target,
        color: 'blue',
        perspective: [
            '✅ 40+ widget ile zengin kütüphane - müşteri demoları için yeterli',
            '✅ Multi-tenant mimari SaaS modeli için uygun',
            '⚠️ Gerçek müşteri verisi entegrasyonu olmadan satışa çıkmak zor',
            '⚠️ Mobil uygulama veya PWA olarak sunulmadan B2C pazarı eksik',
            '🎯 Öncelik: API entegrasyonu + müşteri pilot programı',
        ],
        recommendation: 'Beta müşteri bulmadan önce en az 3 gerçek veri kaynağı entegrasyonu şart.',
    },
    techLead: {
        role: 'Teknik Lider',
        icon: Code,
        color: 'purple',
        perspective: [
            '✅ Modern stack: React 19, Vite 7, Zustand, Tailwind 4',
            '✅ Lazy loading ve code splitting implementasyonu iyi',
            '⚠️ Test coverage %0 - production için kabul edilemez',
            '⚠️ TypeScript olmadan refactoring riskli',
            '🔒 Güvenlik: RLS politikaları production-ready değil',
            '🎯 Öncelik: Test altyapısı + TypeScript migration',
        ],
        recommendation: 'Her PR için minimum %80 coverage hedefi konulmalı.',
    },
    uiuxDesigner: {
        role: 'UI/UX Tasarımcı',
        icon: Palette,
        color: 'pink',
        perspective: [
            '✅ Tema sistemi esnek ve özelleştirilebilir',
            '✅ Dark/Light mode + preset temalar iyi',
            '✅ Responsive tasarım implementasyonu yapıldı',
            '⚠️ Bazı widget\'larda tutarsız spacing/padding',
            '⚠️ Loading ve error state\'leri standardize edilmeli',
            '🎯 Öncelik: Design system dokümantasyonu',
        ],
        recommendation: 'Figma design tokens ile kod sync\'i sağlanmalı.',
    },
    backendDeveloper: {
        role: 'Backend Developer',
        icon: Database,
        color: 'green',
        perspective: [
            '✅ Supabase entegrasyonu hazır, schema tanımlı',
            '✅ Storage adapter pattern backend değişikliğini kolaylaştırır',
            '⚠️ RLS politikaları test edilmedi',
            '⚠️ Rate limiting ve abuse prevention yok',
            '⚠️ Backup ve disaster recovery planı yok',
            '🎯 Öncelik: Security audit + rate limiting',
        ],
        recommendation: 'Production öncesi penetration testi yaptırılmalı.',
    },
    qaEngineer: {
        role: 'QA Mühendisi',
        icon: TestTube,
        color: 'orange',
        perspective: [
            '❌ Unit test yok - regresyon riski yüksek',
            '❌ E2E test yok - manuel test yükü ağır',
            '❌ Test environment yok - production veri riski',
            '⚠️ Error handling bazı yerlerde eksik',
            '🎯 Öncelik: Test piramidi oluşturulmalı',
        ],
        recommendation: 'Her sprint başına unit test oranı takip edilmeli.',
    },
    devOpsEngineer: {
        role: 'DevOps Mühendisi',
        icon: Wrench,
        color: 'gray',
        perspective: [
            '✅ Vercel/Netlify auto-deploy çalışıyor',
            '✅ Environment variables düzgün yönetiliyor',
            '⚠️ CI pipeline yok - broken build production\'a gidebilir',
            '⚠️ Monitoring ve alerting yok',
            '⚠️ Log aggregation yok',
            '🎯 Öncelik: GitHub Actions + Sentry integration',
        ],
        recommendation: 'Her deployment öncesi otomatik smoke test çalışmalı.',
    },
    securityAnalyst: {
        role: 'Güvenlik Analisti',
        icon: Shield,
        color: 'red',
        perspective: [
            '⚠️ Supabase anon key client\'ta exposed (beklenen ama RLS zorunlu)',
            '⚠️ Input validation bazı form\'larda eksik',
            '⚠️ CORS policy tanımlı değil',
            '❌ Security headers eksik (CSP, HSTS)',
            '❌ Dependency vulnerability scan yok',
            '🎯 Öncelik: npm audit + Snyk integration',
        ],
        recommendation: 'OWASP Top 10 checklist\'i ile audit yapılmalı.',
    },
}

const priorityLabels = {
    critical: { label: 'Kritik', color: 'bg-red-600', textColor: 'text-white' },
    high: { label: 'Yüksek', color: 'bg-orange-500', textColor: 'text-white' },
    medium: { label: 'Orta', color: 'bg-yellow-500', textColor: 'text-black' },
    low: { label: 'Düşük', color: 'bg-green-500', textColor: 'text-white' },
}

const effortLabels = {
    low: '1-2 gün',
    medium: '3-5 gün',
    high: '1+ hafta',
}

const categoryColors = {
    red: 'from-red-500 to-red-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    indigo: 'from-indigo-500 to-indigo-600',
    yellow: 'from-yellow-500 to-yellow-600',
    gray: 'from-gray-500 to-gray-600',
    cyan: 'from-cyan-500 to-cyan-600',
    green: 'from-green-500 to-green-600',
    pink: 'from-pink-500 to-pink-600',
}

export default function ImprovementsV2() {
    const [filter, setFilter] = useState('all') // all, pending, done

    // Stats calculation
    const allItems = Object.values(improvements).flatMap(cat => cat.items)
    const doneCount = allItems.filter(i => i.done).length
    const criticalCount = allItems.filter(i => i.priority === 'critical' && !i.done).length
    const highCount = allItems.filter(i => i.priority === 'high' && !i.done).length

    const progressPercent = Math.round((doneCount / allItems.length) * 100)

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                    📋 İyileştirmeler Güncel
                </h1>
                <p className="text-[hsl(var(--muted-foreground))]">
                    Ocak 2026 - Proje kapsamlı analiz ve paydaş perspektifleri
                </p>
            </div>

            {/* Progress Stats */}
            <div className="grid gap-4 sm:grid-cols-5">
                <Card>
                    <CardContent className="pt-4 text-center">
                        <div className="text-3xl font-bold text-[hsl(var(--primary))]">{allItems.length}</div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))]">Toplam</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4 text-center">
                        <div className="text-3xl font-bold text-green-500">{doneCount}</div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))]">Tamamlandı</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4 text-center">
                        <div className="text-3xl font-bold text-red-500">{criticalCount}</div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))]">Kritik</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4 text-center">
                        <div className="text-3xl font-bold text-orange-500">{highCount}</div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))]">Yüksek</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4 text-center">
                        <div className="text-3xl font-bold text-[hsl(var(--foreground))]">{progressPercent}%</div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))]">İlerleme</div>
                    </CardContent>
                </Card>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 rounded-full bg-[hsl(var(--muted))]">
                <div
                    className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Stakeholder Perspectives */}
            <Card className="border-2 border-[hsl(var(--primary)/0.2)]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Paydaş Perspektifleri
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(stakeholderPerspectives).map(([key, stakeholder]) => {
                            const Icon = stakeholder.icon
                            return (
                                <div key={key} className="rounded-lg border border-[hsl(var(--border))] p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            'flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br text-white',
                                            categoryColors[stakeholder.color]
                                        )}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <h3 className="font-semibold text-[hsl(var(--foreground))]">{stakeholder.role}</h3>
                                    </div>
                                    <ul className="space-y-1 text-xs">
                                        {stakeholder.perspective.map((item, i) => (
                                            <li key={i} className="text-[hsl(var(--muted-foreground))]">{item}</li>
                                        ))}
                                    </ul>
                                    <div className="pt-2 border-t border-[hsl(var(--border))]">
                                        <p className="text-xs font-medium text-[hsl(var(--primary))]">
                                            💡 {stakeholder.recommendation}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Filter Buttons */}
            <div className="flex gap-2">
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                >
                    Tümü
                </Button>
                <Button
                    variant={filter === 'pending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('pending')}
                >
                    Bekleyen
                </Button>
                <Button
                    variant={filter === 'done' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('done')}
                >
                    Tamamlanan
                </Button>
            </div>

            {/* Todo Categories */}
            <div className="space-y-6">
                {Object.entries(improvements).map(([key, category]) => {
                    const Icon = category.icon
                    const filteredItems = category.items.filter(item =>
                        filter === 'all' ? true :
                            filter === 'done' ? item.done :
                                !item.done
                    )

                    if (filteredItems.length === 0) return null

                    const categoryDone = category.items.filter(i => i.done).length

                    return (
                        <Card key={key}>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-3">
                                    <div className={cn(
                                        'flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br text-white',
                                        categoryColors[category.color]
                                    )}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    {category.title}
                                    <span className="ml-auto text-sm font-normal text-[hsl(var(--muted-foreground))]">
                                        {categoryDone}/{category.items.length} tamamlandı
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {filteredItems.map((item) => (
                                        <li key={item.id} className={cn(
                                            'flex items-start gap-3 p-2 rounded-lg transition-colors',
                                            item.done ? 'bg-green-50 dark:bg-green-900/10' : 'hover:bg-[hsl(var(--muted)/0.3)]'
                                        )}>
                                            {item.done ? (
                                                <CheckSquare className="h-5 w-5 mt-0.5 text-green-500 shrink-0" />
                                            ) : (
                                                <Square className="h-5 w-5 mt-0.5 text-[hsl(var(--muted-foreground))] shrink-0" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className={cn(
                                                    'text-sm',
                                                    item.done ? 'text-[hsl(var(--muted-foreground))] line-through' : 'text-[hsl(var(--foreground))]'
                                                )}>{item.text}</p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className={cn(
                                                    'text-xs px-2 py-0.5 rounded-full',
                                                    priorityLabels[item.priority].color,
                                                    priorityLabels[item.priority].textColor
                                                )}>
                                                    {priorityLabels[item.priority].label}
                                                </span>
                                                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                                                    {effortLabels[item.effort]}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Legend */}
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
                <h3 className="font-semibold text-[hsl(var(--foreground))] mb-3">Açıklama</h3>
                <div className="flex flex-wrap gap-4 text-sm">
                    {Object.entries(priorityLabels).map(([key, val]) => (
                        <div key={key} className="flex items-center gap-2">
                            <span className={cn('px-2 py-0.5 rounded-full text-xs', val.color, val.textColor)}>
                                {val.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
