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
    MessageSquare
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/**
 * Improvement items categorized by area
 */
const improvements = {
    ux: {
        title: 'UX / Kullanıcı Deneyimi',
        icon: Palette,
        color: 'purple',
        items: [
            { id: 'onboarding', text: 'Yeni kullanıcılar için onboarding wizard ekle', priority: 'high', effort: 'medium' },
            { id: 'empty-states', text: 'Tüm boş durumlar için anlamlı empty states tasarla', priority: 'medium', effort: 'low' },
            { id: 'loading-states', text: 'Skeleton loading ekle (şu an spinner yok)', priority: 'high', effort: 'low' },
            { id: 'toast-notifications', text: 'İşlem sonuçları için toast notifications ekle', priority: 'high', effort: 'low' },
            { id: 'responsive-sidebar', text: 'Mobilde sidebar drawer olarak açılmalı', priority: 'medium', effort: 'medium' },
            { id: 'widget-preview-modal', text: 'Widget eklemeden önce tam sayfa preview modal', priority: 'low', effort: 'medium' },
            { id: 'search-global', text: 'Global arama (Cmd+K) ekle', priority: 'medium', effort: 'medium' },
            { id: 'breadcrumbs', text: 'Navigasyon için breadcrumb ekle', priority: 'low', effort: 'low' },
        ]
    },
    performance: {
        title: 'Performans',
        icon: Gauge,
        color: 'orange',
        items: [
            { id: 'code-splitting', text: 'Route-based code splitting (chunk 785KB çok büyük)', priority: 'high', effort: 'medium' },
            { id: 'lazy-widgets', text: 'Widget componentlerini lazy load et', priority: 'high', effort: 'medium' },
            { id: 'memoization', text: 'Kritik componentlerde React.memo kullan', priority: 'medium', effort: 'low' },
            { id: 'virtual-list', text: 'Widget gallery için virtualization (35+ widget)', priority: 'low', effort: 'medium' },
            { id: 'image-optimization', text: 'Image lazy loading ve WebP format', priority: 'low', effort: 'low' },
            { id: 'bundle-analyzer', text: 'Bundle analyzer kurarak gereksiz dependency tespiti', priority: 'medium', effort: 'low' },
        ]
    },
    codeQuality: {
        title: 'Kod Kalitesi',
        icon: Code,
        color: 'blue',
        items: [
            { id: 'typescript', text: 'TypeScript\'e migrate et (type safety)', priority: 'high', effort: 'high' },
            { id: 'error-boundaries', text: 'Widget\'lar için Error Boundary ekle', priority: 'high', effort: 'low' },
            { id: 'unit-tests', text: 'Kritik fonksiyonlar için unit test yaz', priority: 'high', effort: 'high' },
            { id: 'e2e-tests', text: 'Ana akışlar için E2E test (Playwright)', priority: 'medium', effort: 'high' },
            { id: 'storybook', text: 'Widget showcase için Storybook entegrasyonu', priority: 'low', effort: 'medium' },
            { id: 'jsdoc', text: 'Eksik JSDoc yorumlarını tamamla', priority: 'low', effort: 'low' },
            { id: 'eslint-rules', text: 'ESLint kurallarını sıkılaştır', priority: 'medium', effort: 'low' },
            { id: 'prettier', text: 'Prettier config ekle (code formatting)', priority: 'low', effort: 'low' },
        ]
    },
    security: {
        title: 'Güvenlik',
        icon: Shield,
        color: 'red',
        items: [
            { id: 'auth-integration', text: 'Gerçek authentication entegrasyonu', priority: 'high', effort: 'high' },
            { id: 'api-validation', text: 'API response validation (Zod already in use)', priority: 'medium', effort: 'medium' },
            { id: 'xss-protection', text: 'Widget props için XSS koruması', priority: 'high', effort: 'medium' },
            { id: 'csrf-protection', text: 'Form submission için CSRF token', priority: 'medium', effort: 'medium' },
            { id: 'audit-log-backend', text: 'Audit log backend\'e persist et (şu an localStorage)', priority: 'medium', effort: 'medium' },
        ]
    },
    features: {
        title: 'Eksik Özellikler',
        icon: Zap,
        color: 'yellow',
        items: [
            { id: 'real-backend', text: 'Gerçek backend API entegrasyonu (şu an mock)', priority: 'high', effort: 'high' },
            { id: 'real-data-widgets', text: 'Widget\'lara gerçek data bağlama (API endpoints)', priority: 'high', effort: 'high' },
            { id: 'multi-page-dashboard', text: 'Birden fazla dashboard sayfası desteği', priority: 'medium', effort: 'medium' },
            { id: 'widget-copy-paste', text: 'Widget kopyala/yapıştır özelliği', priority: 'low', effort: 'low' },
            { id: 'widget-lock', text: 'Widget kilitleme (düzenleme engelle)', priority: 'low', effort: 'low' },
            { id: 'dashboard-share', text: 'Dashboard paylaşma linki oluşturma', priority: 'medium', effort: 'medium' },
            { id: 'pdf-export', text: 'Dashboard PDF olarak export', priority: 'low', effort: 'medium' },
            { id: 'scheduled-refresh', text: 'Widget otomatik yenileme interval', priority: 'medium', effort: 'low' },
        ]
    },
    accessibility: {
        title: 'Erişilebilirlik (A11y)',
        icon: Users,
        color: 'green',
        items: [
            { id: 'keyboard-nav', text: 'Tam keyboard navigation desteği', priority: 'high', effort: 'medium' },
            { id: 'aria-labels', text: 'Eksik ARIA label\'ları tamamla', priority: 'high', effort: 'low' },
            { id: 'focus-management', text: 'Modal/dialog focus management', priority: 'medium', effort: 'low' },
            { id: 'color-contrast', text: 'WCAG 2.1 renk kontrastı kontrolü', priority: 'medium', effort: 'low' },
            { id: 'screen-reader', text: 'Screen reader testi ve iyileştirmeler', priority: 'medium', effort: 'medium' },
        ]
    },
    i18n: {
        title: 'Uluslararasılaştırma',
        icon: Globe,
        color: 'cyan',
        items: [
            { id: 'more-languages', text: 'Almanca, Fransızca, Arapça dil desteği', priority: 'low', effort: 'medium' },
            { id: 'rtl-support', text: 'Sağdan sola (RTL) layout desteği', priority: 'low', effort: 'high' },
            { id: 'missing-translations', text: 'Eksik çeviri key\'lerini tamamla', priority: 'medium', effort: 'low' },
            { id: 'date-formatting', text: 'Locale-aware tarih/saat format', priority: 'medium', effort: 'low' },
            { id: 'number-formatting', text: 'Locale-aware sayı/para format', priority: 'medium', effort: 'low' },
        ]
    },
    devExperience: {
        title: 'Developer Experience',
        icon: FileCode,
        color: 'indigo',
        items: [
            { id: 'docker', text: 'Docker compose setup', priority: 'medium', effort: 'low' },
            { id: 'ci-cd', text: 'GitHub Actions CI/CD pipeline', priority: 'medium', effort: 'medium' },
            { id: 'env-config', text: 'Environment-based configuration (.env)', priority: 'high', effort: 'low' },
            { id: 'api-docs', text: 'API documentation (Swagger/OpenAPI)', priority: 'medium', effort: 'medium' },
            { id: 'contributing-guide', text: 'CONTRIBUTING.md oluştur', priority: 'low', effort: 'low' },
            { id: 'changelog', text: 'CHANGELOG.md ve semantic versioning', priority: 'low', effort: 'low' },
        ]
    },
}

/**
 * Product Manager perspective comments
 */
const pmPerspective = {
    strengths: [
        'Modüler widget mimarisi çok iyi - yeni widget eklemek kolay',
        'Multi-tenant yapısı güçlü, Zod validation ile sağlam',
        'Feature flag sistemi A/B testing için hazır altyapı',
        'Template marketplace ile hızlı onboarding mümkün',
        '35 widget ile kapsamlı bir kütüphane oluşmuş',
    ],
    concerns: [
        'Gerçek backend olmadan production-ready değil',
        'Authentication/authorization demo seviyesinde',
        'Widget\'lar statik veri gösteriyor, gerçek API entegrasyonu şart',
        'Mobil deneyim yetersiz, responsive iyileştirmeler gerek',
        'Testler yok, refactoring riskli',
    ],
    priorities: [
        { priority: 1, item: 'Backend API entegrasyonu + Authentication', reason: 'Production için zorunlu' },
        { priority: 2, item: 'Code splitting + Lazy loading', reason: 'Performans kritik, 785KB tek chunk' },
        { priority: 3, item: 'Error boundaries + Toast notifications', reason: 'UX temel beklenti' },
        { priority: 4, item: 'TypeScript migration', reason: 'Uzun vadeli maintainability' },
        { priority: 5, item: 'Unit + E2E testler', reason: 'CI/CD ve güvenli deployment için' },
    ],
    mvpReady: {
        score: 65,
        verdict: 'Demo/POC için hazır, Production için 35% daha iş var',
        blockers: ['Backend API', 'Authentication', 'Error handling'],
    }
}

const priorityColors = {
    high: 'text-red-600 dark:text-red-400',
    medium: 'text-yellow-600 dark:text-yellow-400',
    low: 'text-green-600 dark:text-green-400',
}

const effortLabels = {
    low: 'Kolay (1-2 gün)',
    medium: 'Orta (3-5 gün)',
    high: 'Zor (1+ hafta)',
}

const categoryColors = {
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
    yellow: 'from-yellow-500 to-yellow-600',
    green: 'from-green-500 to-green-600',
    cyan: 'from-cyan-500 to-cyan-600',
    indigo: 'from-indigo-500 to-indigo-600',
}

/**
 * Improvements Page
 */
export default function Improvements() {
    const totalItems = Object.values(improvements).reduce((acc, cat) => acc + cat.items.length, 0)
    const highPriorityCount = Object.values(improvements).reduce(
        (acc, cat) => acc + cat.items.filter(i => i.priority === 'high').length, 0
    )

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                    🔧 İyileştirme Önerileri
                </h1>
                <p className="text-[hsl(var(--muted-foreground))]">
                    Proje analizi sonucu tespit edilen iyileştirme alanları ve PM perspektifi
                </p>
            </div>

            {/* Summary Stats */}
            <div className="grid gap-4 sm:grid-cols-4">
                <Card>
                    <CardContent className="pt-4 text-center">
                        <div className="text-3xl font-bold text-[hsl(var(--primary))]">{totalItems}</div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))]">Toplam Öneri</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4 text-center">
                        <div className="text-3xl font-bold text-red-500">{highPriorityCount}</div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))]">Yüksek Öncelik</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4 text-center">
                        <div className="text-3xl font-bold text-yellow-500">{Object.keys(improvements).length}</div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))]">Kategori</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4 text-center">
                        <div className="text-3xl font-bold text-[hsl(var(--foreground))]">{pmPerspective.mvpReady.score}%</div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))]">MVP Hazırlık</div>
                    </CardContent>
                </Card>
            </div>

            {/* PM Perspective */}
            <Card className="border-2 border-[hsl(var(--primary)/0.3)]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        Ürün Yöneticisi Perspektifi
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Strengths */}
                    <div>
                        <h3 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2">
                            <Star className="h-4 w-4" /> Güçlü Yönler
                        </h3>
                        <ul className="space-y-1">
                            {pmPerspective.strengths.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
                                    <span className="text-[hsl(var(--foreground))]">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Concerns */}
                    <div>
                        <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" /> Dikkat Edilmesi Gerekenler
                        </h3>
                        <ul className="space-y-1">
                            {pmPerspective.concerns.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <AlertTriangle className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                                    <span className="text-[hsl(var(--foreground))]">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Top 5 Priorities */}
                    <div>
                        <h3 className="font-semibold text-[hsl(var(--foreground))] mb-2 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" /> En Önemli 5 İyileştirme
                        </h3>
                        <div className="space-y-2">
                            {pmPerspective.priorities.map((item) => (
                                <div key={item.priority} className="flex items-start gap-3 p-2 rounded-lg bg-[hsl(var(--muted)/0.3)]">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-white text-xs font-bold">
                                        {item.priority}
                                    </span>
                                    <div className="flex-1">
                                        <p className="font-medium text-[hsl(var(--foreground))]">{item.item}</p>
                                        <p className="text-xs text-[hsl(var(--muted-foreground))]">{item.reason}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MVP Verdict */}
                    <div className="rounded-lg bg-[hsl(var(--muted)/0.5)] p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-[hsl(var(--foreground))]">MVP Değerlendirmesi</span>
                            <span className="text-lg font-bold text-[hsl(var(--primary))]">{pmPerspective.mvpReady.score}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-[hsl(var(--muted))] mb-2">
                            <div
                                className="h-2 rounded-full bg-gradient-to-r from-yellow-500 to-emerald-500"
                                style={{ width: `${pmPerspective.mvpReady.score}%` }}
                            />
                        </div>
                        <p className="text-sm text-[hsl(var(--foreground))]">{pmPerspective.mvpReady.verdict}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {pmPerspective.mvpReady.blockers.map((blocker, i) => (
                                <span key={i} className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                    ⚠️ {blocker}
                                </span>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Todo Categories */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">📋 İyileştirme Listesi</h2>

                {Object.entries(improvements).map(([key, category]) => {
                    const Icon = category.icon
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
                                        {category.items.length} öğe
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {category.items.map((item) => (
                                        <li key={item.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-[hsl(var(--muted)/0.3)] transition-colors">
                                            <Circle className="h-4 w-4 mt-0.5 text-[hsl(var(--muted-foreground))] shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-[hsl(var(--foreground))]">{item.text}</p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className={cn('text-xs font-medium', priorityColors[item.priority])}>
                                                    {item.priority === 'high' ? '🔴' : item.priority === 'medium' ? '🟡' : '🟢'}
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
                <h3 className="font-semibold text-[hsl(var(--foreground))] mb-2">Açıklama</h3>
                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span>🔴</span>
                        <span className="text-[hsl(var(--muted-foreground))]">Yüksek öncelik</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>🟡</span>
                        <span className="text-[hsl(var(--muted-foreground))]">Orta öncelik</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>🟢</span>
                        <span className="text-[hsl(var(--muted-foreground))]">Düşük öncelik</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
