import { useState } from 'react'
import {
    Play,
    Monitor,
    Palette,
    LayoutGrid,
    Settings,
    Globe,
    Sparkles,
    ChevronRight,
    MousePointer,
    Zap,
    BookOpen
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GuidedTourProvider, useTour } from '@/components/GuidedTour'
import { cn } from '@/lib/utils'

/**
 * Demo tour steps
 */
const tourSteps = [
    {
        target: '[data-tour="sidebar"]',
        title: '📍 Sidebar Navigasyonu',
        content: 'Sol menüden uygulamanın farklı bölümlerine erişebilirsiniz. Ana sayfa, widget galerisi, yönetim paneli ve daha fazlası burada.',
        placement: 'right',
    },
    {
        target: '[data-tour="header"]',
        title: '🎨 Tema & Dil Ayarları',
        content: 'Sağ üstten dark/light mod arasında geçiş yapabilir, dili değiştirebilir ve global aramayı (Cmd+K) kullanabilirsiniz.',
        placement: 'bottom',
    },
    {
        target: '[data-tour="widgets"]',
        title: '📦 Widget Sistemi',
        content: 'Dashboard\'unuza 40+ farklı widget ekleyebilirsiniz. Grafikler, tablolar, KPI kartları, takvimler ve daha fazlası!',
        placement: 'bottom',
    },
    {
        target: '[data-tour="drag-zone"]',
        title: '✋ Sürükle & Bırak',
        content: 'Widget\'ları sürükleyerek istediğiniz yere konumlandırabilirsiniz. Düzenleme anında kaydedilir.',
        placement: 'top',
    },
    {
        target: '[data-tour="admin"]',
        title: '⚙️ Yönetim Paneli',
        content: 'Tema renkleri, sidebar ayarları, dil tercihleri ve özellik bayrakları buradan yönetilir.',
        placement: 'right',
    },
    {
        target: '[data-tour="tenant-switch"]',
        title: '🏢 Tenant Değiştirme',
        content: 'Farklı tenant\'lar arasında geçiş yapabilirsiniz. Her tenant kendi tema, layout ve ayarlarına sahiptir.',
        placement: 'top',
    },
]

/**
 * Feature Card Component
 */
function FeatureCard({ icon: Icon, title, description, color, demoId }) {
    return (
        <Card
            className="group hover:shadow-lg transition-all cursor-pointer"
            data-tour={demoId}
        >
            <CardContent className="pt-6">
                <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                    'bg-gradient-to-br text-white',
                    color
                )}>
                    <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-[hsl(var(--foreground))] mb-2 group-hover:text-[hsl(var(--primary))] transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {description}
                </p>
            </CardContent>
        </Card>
    )
}

/**
 * Demo Section with simulated UI
 */
function DemoSection() {
    return (
        <div className="border-2 border-dashed border-[hsl(var(--border))] rounded-xl p-6 bg-[hsl(var(--muted)/0.3)]">
            <div className="flex gap-4">
                {/* Simulated Sidebar */}
                <div
                    className="w-16 bg-[hsl(var(--card))] rounded-lg p-2 space-y-2"
                    data-tour="sidebar"
                >
                    {[1, 2, 3, 4, 5].map(i => (
                        <div
                            key={i}
                            className={cn(
                                'w-full h-10 rounded-lg',
                                i === 1 ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))]'
                            )}
                        />
                    ))}
                    <div className="pt-4 border-t border-[hsl(var(--border))]">
                        <div
                            className="w-full h-10 bg-[hsl(var(--accent))] rounded-lg"
                            data-tour="tenant-switch"
                        />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div
                        className="bg-[hsl(var(--card))] rounded-lg p-3 flex items-center justify-between"
                        data-tour="header"
                    >
                        <div className="w-32 h-6 bg-[hsl(var(--muted))] rounded" />
                        <div className="flex gap-2">
                            <div className="w-8 h-8 bg-[hsl(var(--muted))] rounded-lg" />
                            <div className="w-8 h-8 bg-[hsl(var(--muted))] rounded-lg" />
                            <div className="w-8 h-8 bg-[hsl(var(--primary))] rounded-lg" />
                        </div>
                    </div>

                    {/* Widget Grid */}
                    <div
                        className="grid grid-cols-3 gap-3"
                        data-tour="drag-zone"
                    >
                        <div
                            className="bg-[hsl(var(--card))] rounded-lg p-3 h-24"
                            data-tour="widgets"
                        >
                            <div className="w-16 h-3 bg-[hsl(var(--muted))] rounded mb-2" />
                            <div className="text-2xl font-bold text-[hsl(var(--primary))]">1,234</div>
                        </div>
                        <div className="bg-[hsl(var(--card))] rounded-lg p-3 h-24">
                            <div className="w-full h-full bg-gradient-to-t from-[hsl(var(--primary)/0.3)] to-transparent rounded" />
                        </div>
                        <div
                            className="bg-[hsl(var(--card))] rounded-lg p-3 h-24"
                            data-tour="admin"
                        >
                            <Settings className="h-8 w-8 text-[hsl(var(--muted-foreground))] mx-auto" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * Tour Starter Component
 */
function TourStarter() {
    const tour = useTour()

    return (
        <div className="text-center py-8">
            <Button
                size="lg"
                onClick={tour?.startTour}
                className="gap-2"
            >
                <Play className="h-5 w-5" />
                İnteraktif Demo'yu Başlat
            </Button>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">
                6 adımlık tur ile uygulamayı keşfedin
            </p>
        </div>
    )
}

/**
 * Quick Start Steps
 */
const quickStartSteps = [
    { icon: Monitor, text: 'Sidebar\'dan bir sayfaya gidin', color: 'from-blue-500 to-blue-600' },
    { icon: LayoutGrid, text: 'Widget Galerisi\'nden widget ekleyin', color: 'from-purple-500 to-purple-600' },
    { icon: MousePointer, text: 'Widget\'ları sürükleyerek düzenleyin', color: 'from-orange-500 to-orange-600' },
    { icon: Palette, text: 'Yönetim Paneli\'nden temayı özelleştirin', color: 'from-pink-500 to-pink-600' },
    { icon: Globe, text: 'Dil ayarlarını değiştirin (TR/EN)', color: 'from-green-500 to-green-600' },
    { icon: Sparkles, text: 'Dashboard\'unuzu kaydedin ve paylaşın', color: 'from-yellow-500 to-yellow-600' },
]

/**
 * Interactive Demo Page
 */
function InteractiveDemoContent() {
    const tour = useTour()
    const [completed, setCompleted] = useState(false)

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-2">
                    🎮 İnteraktif Demo
                </h1>
                <p className="text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
                    Multi-Tenant Dashboard Builder'ın özelliklerini adım adım keşfedin.
                    Demo turu ile uygulamanın tüm fonksiyonlarını öğrenin.
                </p>
            </div>

            {/* Completion Message */}
            {completed && (
                <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-900/20">
                    <CardContent className="py-4 text-center">
                        <p className="text-green-700 dark:text-green-400 font-medium">
                            🎉 Tebrikler! Demo turu tamamlandı. Artık uygulamayı kullanmaya hazırsınız!
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Demo Area */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Monitor className="h-5 w-5" />
                        Demo Alanı
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DemoSection />
                    <TourStarter />
                </CardContent>
            </Card>

            {/* Quick Start Guide */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Hızlı Başlangıç
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {quickStartSteps.map((step, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--muted)/0.3)] hover:bg-[hsl(var(--muted)/0.5)] transition-colors"
                            >
                                <div className={cn(
                                    'w-8 h-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-br',
                                    step.color
                                )}>
                                    <step.icon className="h-4 w-4" />
                                </div>
                                <span className="text-sm text-[hsl(var(--foreground))]">
                                    {step.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Feature Highlights */}
            <div>
                <h2 className="text-xl font-bold text-[hsl(var(--foreground))] mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Özellik Rehberi
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <FeatureCard
                        icon={LayoutGrid}
                        title="40+ Widget"
                        description="Grafikler, tablolar, KPI kartları, haritalar ve daha fazlası. İhtiyacınıza göre seçin."
                        color="from-blue-500 to-cyan-500"
                        demoId="widgets"
                    />
                    <FeatureCard
                        icon={Palette}
                        title="Tam Özelleştirme"
                        description="Temalar, renkler, fontlar ve layout ayarları. Markanıza uygun dashboard."
                        color="from-purple-500 to-pink-500"
                        demoId="admin"
                    />
                    <FeatureCard
                        icon={MousePointer}
                        title="Sürükle & Bırak"
                        description="Widget'ları kolayca sürükleyin, boyutlandırın ve düzenleyin."
                        color="from-orange-500 to-red-500"
                        demoId="drag-zone"
                    />
                    <FeatureCard
                        icon={Globe}
                        title="Çoklu Dil"
                        description="Türkçe ve İngilizce dahil, farklı dillerde kullanım."
                        color="from-green-500 to-emerald-500"
                    />
                    <FeatureCard
                        icon={Sparkles}
                        title="Multi-Tenant"
                        description="Her müşteri için ayrı konfigürasyon. SaaS hazır mimari."
                        color="from-yellow-500 to-orange-500"
                    />
                    <FeatureCard
                        icon={Settings}
                        title="Feature Flags"
                        description="Özellikleri tenant bazında açıp kapatın. A/B testing desteği."
                        color="from-gray-500 to-gray-600"
                    />
                </div>
            </div>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.8)] text-white">
                <CardContent className="py-8 text-center">
                    <h3 className="text-2xl font-bold mb-2">Hazır mısınız?</h3>
                    <p className="opacity-90 mb-4">
                        Dashboard'unuzu oluşturmaya hemen başlayın!
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button
                            variant="secondary"
                            onClick={tour?.startTour}
                        >
                            <Play className="h-4 w-4 mr-2" />
                            Demo'yu Tekrarla
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-white/10 border-white/30 hover:bg-white/20"
                            onClick={() => window.location.href = '/t/tenant-a'}
                        >
                            Dashboard'a Git
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

/**
 * Interactive Demo Page with Tour Provider
 */
export default function InteractiveDemo() {
    const [tourCompleted, setTourCompleted] = useState(false)

    return (
        <GuidedTourProvider
            steps={tourSteps}
            onComplete={() => setTourCompleted(true)}
        >
            <InteractiveDemoContent />
        </GuidedTourProvider>
    )
}
