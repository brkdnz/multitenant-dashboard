import {
    Calendar,
    Rocket,
    Target,
    Zap,
    CheckCircle2,
    Circle,
    Clock,
    ArrowRight,
    Flag,
    Milestone,
    Star
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/**
 * Roadmap phases with items
 */
const roadmap = [
    {
        id: 'phase-1',
        phase: 'Phase 1',
        title: 'Foundation & Critical Fixes',
        subtitle: 'MVP için zorunlu temel altyapı',
        duration: '2 Hafta',
        status: 'current',
        color: 'red',
        priority: 'P0 - Kritik',
        items: [
            { id: 'p1-1', text: 'Error Boundaries ekle (widget crash izolasyonu)', effort: '1 gün', done: true },
            { id: 'p1-2', text: 'Toast notification sistemi kur', effort: '1 gün', done: true },
            { id: 'p1-3', text: 'Loading states / Skeleton ekle', effort: '1 gün', done: true },
            { id: 'p1-4', text: 'Environment configuration (.env)', effort: '0.5 gün', done: true },
            { id: 'p1-5', text: 'Code splitting (React.lazy + Suspense)', effort: '2 gün', done: true },
            { id: 'p1-6', text: 'Widget lazy loading (Chunk size optimize)', effort: '1 gün', done: true },
            { id: 'p1-7', text: 'Basic error handling ve logging', effort: '1 gün', done: true },
        ],
        milestone: 'Stabil ve performanslı frontend',
        dependencies: [],
    },
    {
        id: 'phase-2',
        phase: 'Phase 2',
        title: 'Backend Integration',
        subtitle: 'Gerçek API ve authentication',
        duration: '3 Hafta',
        status: 'upcoming',
        color: 'orange',
        priority: 'P0 - Kritik',
        items: [
            { id: 'p2-1', text: 'Backend API tasarımı (Supabase Schema)', effort: '2 gün', done: true },
            { id: 'p2-2', text: 'Authentication sistemi (Supabase Auth)', effort: '3 gün', done: true },
            { id: 'p2-3', text: 'Tenant CRUD API endpoints (Supabase Adapter)', effort: '2 gün', done: true },
            { id: 'p2-4', text: 'Widget configuration API (JSONB)', effort: '2 gün', done: true },
            { id: 'p2-5', text: 'API service layer refactor (ConfigService)', effort: '2 gün', done: true },
            { id: 'p2-6', text: 'Real-time data fetching (Supabase SDK)', effort: '2 gün', done: true },
            { id: 'p2-7', text: 'Audit log backend persistence', effort: '1 gün', done: true },
        ],
        milestone: 'Production-ready backend entegrasyonu',
        dependencies: ['phase-1'],
    },
    {
        id: 'phase-3',
        phase: 'Phase 3',
        title: 'Quality & Testing',
        subtitle: 'Test coverage ve kod kalitesi',
        duration: '2 Hafta',
        status: 'upcoming',
        color: 'blue',
        priority: 'P1 - Yüksek',
        items: [
            { id: 'p3-1', text: 'Unit test setup (Vitest)', effort: '0.5 gün', done: false },
            { id: 'p3-2', text: 'Kritik fonksiyonlar için unit testler', effort: '3 gün', done: false },
            { id: 'p3-3', text: 'E2E test setup (Playwright)', effort: '1 gün', done: false },
            { id: 'p3-4', text: 'Ana user flows için E2E testler', effort: '2 gün', done: false },
            { id: 'p3-5', text: 'ESLint kuralları sıkılaştırma', effort: '0.5 gün', done: false },
            { id: 'p3-6', text: 'Prettier configuration', effort: '0.5 gün', done: false },
            { id: 'p3-7', text: 'GitHub Actions CI/CD', effort: '1 gün', done: false },
        ],
        milestone: '%60+ test coverage, otomatik CI/CD',
        dependencies: ['phase-2'],
    },
    {
        id: 'phase-4',
        phase: 'Phase 4',
        title: 'UX Improvements',
        subtitle: 'Kullanıcı deneyimi iyileştirmeleri',
        duration: '2 Hafta',
        status: 'completed',
        color: 'purple',
        priority: 'P1 - Yüksek',
        items: [
            { id: 'p4-1', text: 'Onboarding wizard', effort: '3 gün', done: true },
            { id: 'p4-2', text: 'Global search (Cmd+K)', effort: '2 gün', done: true },
            { id: 'p4-3', text: 'Mobil responsive iyileştirmeler', effort: '2 gün', done: true },
            { id: 'p4-4', text: 'Empty states tasarımı', effort: '1 gün', done: true },
            { id: 'p4-5', text: 'Keyboard navigation', effort: '1 gün', done: true },
            { id: 'p4-6', text: 'ARIA labels ve accessibility', effort: '1 gün', done: true },
        ],
        milestone: 'Premium kullanıcı deneyimi',
        dependencies: ['phase-1'],
    },
    {
        id: 'phase-5',
        phase: 'Phase 5',
        title: 'TypeScript Migration',
        subtitle: 'Type safety ve maintainability',
        duration: '3 Hafta',
        status: 'upcoming',
        color: 'cyan',
        priority: 'P2 - Orta',
        items: [
            { id: 'p5-1', text: 'TypeScript configuration', effort: '0.5 gün', done: false },
            { id: 'p5-2', text: 'lib/ klasörü migration', effort: '2 gün', done: false },
            { id: 'p5-3', text: 'hooks/ klasörü migration', effort: '1 gün', done: false },
            { id: 'p5-4', text: 'components/ klasörü migration', effort: '4 gün', done: false },
            { id: 'p5-5', text: 'widgets/ klasörü migration', effort: '3 gün', done: false },
            { id: 'p5-6', text: 'pages/ klasörü migration', effort: '2 gün', done: false },
            { id: 'p5-7', text: 'Type definitions ve interfaces', effort: '2 gün', done: false },
        ],
        milestone: 'Tamamen typed codebase',
        dependencies: ['phase-3'],
    },
    {
        id: 'phase-6',
        phase: 'Phase 6',
        title: 'Advanced Features',
        subtitle: 'Rekabet avantajı özellikleri',
        duration: '4 Hafta',
        status: 'current',
        color: 'green',
        priority: 'P2 - Orta',
        items: [
            { id: 'p6-1', text: 'Multi-page dashboard desteği', effort: '3 gün', done: true },
            { id: 'p6-2', text: 'Real-time widget data refresh', effort: '2 gün', done: true },
            { id: 'p6-3', text: 'Dashboard paylaşma linki', effort: '2 gün', done: true },
            { id: 'p6-4', text: 'Widget copy/paste', effort: '1 gün', done: true },
            { id: 'p6-5', text: 'PDF export', effort: '2 gün', done: true },
            { id: 'p6-6', text: 'External data source entegrasyonu', effort: '5 gün', done: true },
            { id: 'p6-7', text: 'Scheduled reports', effort: '3 gün', done: false },
        ],
        milestone: 'Enterprise-ready özellikler',
        dependencies: ['phase-4', 'phase-5'],
    },
    {
        id: 'phase-7',
        phase: 'Phase 7',
        title: 'Polish & Scale',
        subtitle: 'Son rötuşlar ve ölçekleme',
        duration: '2 Hafta',
        status: 'future',
        color: 'indigo',
        priority: 'P3 - Düşük',
        items: [
            { id: 'p7-1', text: 'Ek dil desteği (DE, FR, AR)', effort: '3 gün', done: false },
            { id: 'p7-2', text: 'RTL layout desteği', effort: '2 gün', done: false },
            { id: 'p7-3', text: 'Storybook widget showcase', effort: '2 gün', done: false },
            { id: 'p7-4', text: 'Docker compose setup', effort: '1 gün', done: false },
            { id: 'p7-5', text: 'Performance monitoring', effort: '1 gün', done: false },
            { id: 'p7-6', text: 'Documentation (README, API docs)', effort: '2 gün', done: false },
        ],
        milestone: 'Global-ready, fully documented',
        dependencies: ['phase-6'],
    },
]

const statusColors = {
    completed: 'bg-emerald-500',
    current: 'bg-blue-500 animate-pulse',
    upcoming: 'bg-yellow-500',
    future: 'bg-gray-400',
}

const phaseColors = {
    red: 'from-red-500 to-red-600 border-red-500',
    orange: 'from-orange-500 to-orange-600 border-orange-500',
    blue: 'from-blue-500 to-blue-600 border-blue-500',
    purple: 'from-purple-500 to-purple-600 border-purple-500',
    cyan: 'from-cyan-500 to-cyan-600 border-cyan-500',
    green: 'from-green-500 to-green-600 border-green-500',
    indigo: 'from-indigo-500 to-indigo-600 border-indigo-500',
}

/**
 * Roadmap Page
 */
export default function Roadmap() {
    const totalItems = roadmap.reduce((acc, phase) => acc + phase.items.length, 0)
    const completedItems = roadmap.reduce((acc, phase) => acc + phase.items.filter(i => i.done).length, 0)
    const totalWeeks = roadmap.reduce((acc, phase) => acc + parseInt(phase.duration), 0)

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                    🗺️ İyileştirme Roadmap'i
                </h1>
                <p className="text-[hsl(var(--muted-foreground))]">
                    52 iyileştirme önerisinin 7 fazlık uygulama planı
                </p>
            </div>

            {/* Summary */}
            <div className="grid gap-4 sm:grid-cols-4">
                <Card>
                    <CardContent className="pt-4 text-center">
                        <div className="text-3xl font-bold text-[hsl(var(--primary))]">{roadmap.length}</div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))]">Faz</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4 text-center">
                        <div className="text-3xl font-bold text-blue-500">{totalItems}</div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))]">Görev</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4 text-center">
                        <div className="text-3xl font-bold text-yellow-500">{totalWeeks}</div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))]">Hafta (Tahmini)</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4 text-center">
                        <div className="text-3xl font-bold text-emerald-500">{Math.round((completedItems / totalItems) * 100)}%</div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))]">Tamamlandı</div>
                    </CardContent>
                </Card>
            </div>

            {/* Timeline Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Zaman Çizelgesi Özeti
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {roadmap.map((phase, index) => (
                            <div key={phase.id} className="flex items-center">
                                <div className={cn(
                                    'px-3 py-1.5 rounded-lg text-white text-sm font-medium bg-gradient-to-r',
                                    phaseColors[phase.color]?.split(' ')[0],
                                    phaseColors[phase.color]?.split(' ')[1]
                                )}>
                                    {phase.phase}: {phase.duration}
                                </div>
                                {index < roadmap.length - 1 && (
                                    <ArrowRight className="h-4 w-4 mx-1 text-[hsl(var(--muted-foreground))]" />
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mt-3">
                        Toplam tahmini süre: <strong>{totalWeeks} hafta</strong> (paralel çalışma ile {Math.ceil(totalWeeks * 0.7)} haftaya düşürülebilir)
                    </p>
                </CardContent>
            </Card>

            {/* Phase Cards */}
            <div className="space-y-6">
                {roadmap.map((phase, phaseIndex) => (
                    <Card
                        key={phase.id}
                        className={cn(
                            'border-l-4',
                            phaseColors[phase.color]?.split(' ')[2]
                        )}
                    >
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={cn(
                                            'px-2 py-0.5 rounded text-xs font-medium text-white bg-gradient-to-r',
                                            phaseColors[phase.color]?.split(' ')[0],
                                            phaseColors[phase.color]?.split(' ')[1]
                                        )}>
                                            {phase.phase}
                                        </span>
                                        <span className={cn(
                                            'w-2 h-2 rounded-full',
                                            statusColors[phase.status]
                                        )} />
                                        <span className="text-xs text-[hsl(var(--muted-foreground))]">
                                            {phase.status === 'current' ? 'Şu an' : phase.status === 'upcoming' ? 'Yakında' : 'Gelecek'}
                                        </span>
                                    </div>
                                    <CardTitle className="text-lg">{phase.title}</CardTitle>
                                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{phase.subtitle}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium text-[hsl(var(--foreground))]">{phase.duration}</div>
                                    <div className="text-xs text-[hsl(var(--muted-foreground))]">{phase.priority}</div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Dependencies */}
                            {phase.dependencies.length > 0 && (
                                <div className="mb-3 text-xs text-[hsl(var(--muted-foreground))]">
                                    🔗 Bağımlılık: {phase.dependencies.map(dep => {
                                        const depPhase = roadmap.find(p => p.id === dep)
                                        return depPhase?.phase
                                    }).join(', ')}
                                </div>
                            )}

                            {/* Items */}
                            <ul className="space-y-2 mb-4">
                                {phase.items.map((item) => (
                                    <li key={item.id} className="flex items-start gap-3">
                                        {item.done ? (
                                            <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
                                        ) : (
                                            <Circle className="h-4 w-4 mt-0.5 text-[hsl(var(--muted-foreground))] shrink-0" />
                                        )}
                                        <span className={cn(
                                            'text-sm flex-1',
                                            item.done && 'line-through text-[hsl(var(--muted-foreground))]'
                                        )}>
                                            {item.text}
                                        </span>
                                        <span className="text-xs text-[hsl(var(--muted-foreground))] shrink-0">
                                            <Clock className="h-3 w-3 inline mr-1" />
                                            {item.effort}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* Milestone */}
                            <div className="flex items-center gap-2 pt-3 border-t border-[hsl(var(--border))]">
                                <Flag className="h-4 w-4 text-[hsl(var(--primary))]" />
                                <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                                    Milestone: {phase.milestone}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Start Guide */}
            <Card className="border-2 border-[hsl(var(--primary)/0.3)]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Rocket className="h-5 w-5 text-[hsl(var(--primary))]" />
                        Hemen Başla: Bu Hafta Yapılabilecekler
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                            <p className="font-medium text-emerald-800 dark:text-emerald-300 mb-1">✅ Kolay Kazanımlar (1-2 gün)</p>
                            <ul className="text-sm text-emerald-700 dark:text-emerald-400 space-y-1">
                                <li>• Error Boundaries ekle</li>
                                <li>• Toast notification kur</li>
                                <li>• .env configuration</li>
                                <li>• Prettier/ESLint sıkılaştır</li>
                            </ul>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                            <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">🎯 Bu Hafta Hedefler</p>
                            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                                <li>• Phase 1'i tamamla</li>
                                <li>• Code splitting uygula</li>
                                <li>• Chunk size'ı 500KB altına düşür</li>
                                <li>• Loading states ekle</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Legend */}
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
                <h3 className="font-semibold text-[hsl(var(--foreground))] mb-2">Öncelik Açıklaması</h3>
                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-red-500" />
                        <span className="text-[hsl(var(--muted-foreground))]">P0 - Kritik (MVP blocker)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-yellow-500" />
                        <span className="text-[hsl(var(--muted-foreground))]">P1 - Yüksek (Production için önemli)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-green-500" />
                        <span className="text-[hsl(var(--muted-foreground))]">P2/P3 - Orta/Düşük (Nice to have)</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
