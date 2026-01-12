import {
    Shield,
    History,
    Download,
    Upload,
    FileText,
    Flag,
    FlaskConical,
    Lock,
    Store,
    Undo,
    Grid,
    Save,
    Palette,
    Keyboard,
    Sliders,
    Check,
    Maximize2,
    Settings,
    ArrowRight,
    Zap,
    Globe,
    Smartphone,
    Bot,
    BarChart3,
    MessageSquare,
    Share2,
    Layers,
    GitBranch,
    Webhook,
    Database,
    CloudUpload,
    Sparkles,
    Timer,
    Eye
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/**
 * Feature suggestions for the dashboard builder
 */
const suggestions = [
    // ========== IMPLEMENTED ==========
    {
        id: 'role-based-widgets',
        icon: Shield,
        title: 'Role-Based Widget Visibility',
        description: 'Control which widgets are visible based on user roles and permissions.',
        priority: 'high',
        implemented: true,
        howToUse: 'Admin Panel → Access sekmesinde rolleri ayarlayın.',
    },
    {
        id: 'versioning',
        icon: History,
        title: 'Configuration Versioning',
        description: 'Track changes to tenant configurations with version history.',
        priority: 'high',
        implemented: true,
        howToUse: 'Admin Panel → History sekmesinde tüm değişiklikleri görün.',
    },
    {
        id: 'export-import',
        icon: Download,
        title: 'Layout Export/Import',
        description: 'Export dashboard layouts as JSON files and import them.',
        priority: 'medium',
        implemented: true,
        howToUse: 'Admin Panel → Export sekmesinden config indirin/yükleyin.',
    },
    {
        id: 'audit-log',
        icon: FileText,
        title: 'Audit Log',
        description: 'Track all configuration changes with timestamps.',
        priority: 'high',
        implemented: true,
        howToUse: 'Admin Panel → History sekmesinde Audit Log bölümünü görün.',
    },
    {
        id: 'feature-flags',
        icon: Flag,
        title: 'Feature Flags',
        description: 'Toggle features on/off per tenant without code changes.',
        priority: 'medium',
        implemented: true,
        howToUse: 'Admin Panel → Flags sekmesinden özellikleri açıp kapatın.',
    },
    {
        id: 'widget-permissions',
        icon: Lock,
        title: 'Widget-Level Permissions',
        description: 'Fine-grained access control for individual widgets.',
        priority: 'medium',
        implemented: true,
        howToUse: 'Admin Panel → Widgets sekmesinden widget izinlerini ayarlayın.',
    },
    {
        id: 'template-marketplace',
        icon: Store,
        title: 'Template Marketplace',
        description: 'Pre-built dashboard templates ready to use.',
        priority: 'low',
        implemented: true,
        howToUse: 'Admin Panel → Templates sekmesinden şablon seçin.',
    },
    {
        id: 'undo-redo',
        icon: Undo,
        title: 'Undo/Redo',
        description: 'Undo and redo configuration changes with keyboard shortcuts.',
        priority: 'high',
        implemented: true,
        howToUse: 'Ctrl+Z geri al, Ctrl+Y yinele. Admin Panel\'de butonlar mevcut.',
    },
    {
        id: 'snap-grid',
        icon: Grid,
        title: 'Snap-to-Grid',
        description: 'Precise widget placement with visual grid guides.',
        priority: 'medium',
        implemented: true,
        howToUse: 'Widget sürüklerken 12 kolonlu grid otomatik görünür.',
    },
    {
        id: 'autosave',
        icon: Save,
        title: 'Autosave',
        description: 'Automatically save changes as you work.',
        priority: 'high',
        implemented: true,
        howToUse: 'Admin Panel\'de Autosave aktifken değişiklikler otomatik kaydedilir.',
    },
    {
        id: 'preset-themes',
        icon: Palette,
        title: 'Preset Themes',
        description: 'Library of professionally designed themes.',
        priority: 'medium',
        implemented: true,
        howToUse: 'Admin Panel → Presets sekmesinden tema seçin.',
    },
    {
        id: 'widget-props-editor',
        icon: Sliders,
        title: 'Visual Widget Props Editor',
        description: 'Edit widget properties through a visual interface.',
        priority: 'high',
        implemented: true,
        howToUse: 'Widget üzerine gelin → Settings ikonuna tıklayın.',
    },
    {
        id: 'keyboard-shortcuts',
        icon: Keyboard,
        title: 'Keyboard Shortcuts',
        description: 'Power user keyboard shortcuts for common actions.',
        priority: 'medium',
        implemented: true,
        howToUse: 'Admin Panel → Shortcuts sekmesinde tüm kısayolları görün.',
    },
    {
        id: 'widget-resize',
        icon: Maximize2,
        title: 'Widget Resize',
        description: 'Resize widgets by adjusting column width and height.',
        priority: 'medium',
        implemented: true,
        howToUse: 'Widget üzerine gelin → Resize ikonuna tıklayın.',
    },

    // ========== FUTURE FEATURES ==========
    {
        id: 'ab-testing',
        icon: FlaskConical,
        title: 'A/B Testing',
        description: 'Test different layouts with different user segments. Track engagement metrics.',
        priority: 'low',
        implemented: false,
        howToUse: null,
    },
    {
        id: 'real-time-collaboration',
        icon: MessageSquare,
        title: 'Real-Time Collaboration',
        description: 'Multiple users editing the same dashboard simultaneously with live cursors.',
        priority: 'medium',
        implemented: false,
        howToUse: null,
    },
    {
        id: 'widget-api',
        icon: Webhook,
        title: 'Widget API',
        description: 'Build custom widgets with our widget SDK. Extend functionality with plugins.',
        priority: 'high',
        implemented: false,
        howToUse: null,
    },
    {
        id: 'mobile-app',
        icon: Smartphone,
        title: 'Mobile App',
        description: 'Native mobile app for viewing dashboards on the go.',
        priority: 'medium',
        implemented: false,
        howToUse: null,
    },
    {
        id: 'ai-suggestions',
        icon: Bot,
        title: 'AI Widget Suggestions',
        description: 'AI-powered recommendations for widget placement and data visualization.',
        priority: 'low',
        implemented: false,
        howToUse: null,
    },
    {
        id: 'advanced-analytics',
        icon: BarChart3,
        title: 'Advanced Analytics',
        description: 'Deep insights into dashboard usage, popular widgets, and user behavior.',
        priority: 'medium',
        implemented: false,
        howToUse: null,
    },
    {
        id: 'multi-dashboard',
        icon: Layers,
        title: 'Multi-Page Dashboards',
        description: 'Create multiple dashboard pages per tenant with custom navigation.',
        priority: 'high',
        implemented: false,
        howToUse: null,
    },
    {
        id: 'data-sources',
        icon: Database,
        title: 'External Data Sources',
        description: 'Connect widgets to external APIs, databases, and third-party services.',
        priority: 'high',
        implemented: false,
        howToUse: null,
    },
    {
        id: 'scheduled-reports',
        icon: Timer,
        title: 'Scheduled Reports',
        description: 'Automatically generate and email dashboard reports on schedule.',
        priority: 'medium',
        implemented: false,
        howToUse: null,
    },
    {
        id: 'embeddable-dashboards',
        icon: Share2,
        title: 'Embeddable Dashboards',
        description: 'Embed dashboards in external websites and applications with iframe.',
        priority: 'medium',
        implemented: false,
        howToUse: null,
    },
    {
        id: 'dashboard-versioning',
        icon: GitBranch,
        title: 'Dashboard Branching',
        description: 'Create branches to test changes before publishing to production.',
        priority: 'low',
        implemented: false,
        howToUse: null,
    },
    {
        id: 'white-labeling',
        icon: Sparkles,
        title: 'White Labeling',
        description: 'Complete branding customization including favicon, domain, and email templates.',
        priority: 'medium',
        implemented: false,
        howToUse: null,
    },
    {
        id: 'public-dashboards',
        icon: Eye,
        title: 'Public Dashboards',
        description: 'Share dashboards publicly with anyone via a unique URL.',
        priority: 'low',
        implemented: false,
        howToUse: null,
    },
    {
        id: 'cloud-sync',
        icon: CloudUpload,
        title: 'Cloud Backup & Sync',
        description: 'Automatic cloud backup and sync across devices.',
        priority: 'low',
        implemented: false,
        howToUse: null,
    },
]

const priorityColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
}

/**
 * Suggestions Page
 */
export default function Suggestions() {
    const { t } = useTranslation()

    const implementedCount = suggestions.filter(s => s.implemented).length
    const totalCount = suggestions.length

    // Group by status
    const implemented = suggestions.filter(s => s.implemented)
    const upcoming = suggestions.filter(s => !s.implemented)

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                    {t('suggestions.title')}
                </h1>
                <p className="text-[hsl(var(--muted-foreground))]">
                    {t('suggestions.description')}
                </p>
            </div>

            {/* Progress */}
            <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                        Implementation Progress
                    </span>
                    <span className="text-sm text-[hsl(var(--muted-foreground))]">
                        {implementedCount} / {totalCount} features
                    </span>
                </div>
                <div className="h-3 w-full rounded-full bg-[hsl(var(--muted))]">
                    <div
                        className="h-3 rounded-full bg-emerald-500 transition-all"
                        style={{ width: `${(implementedCount / totalCount) * 100}%` }}
                    />
                </div>
            </div>

            {/* Implemented Features */}
            <div>
                <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4 flex items-center gap-2">
                    <Check className="h-5 w-5 text-emerald-500" />
                    Implemented Features ({implemented.length})
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {implemented.map((suggestion) => {
                        const Icon = suggestion.icon
                        return (
                            <Card key={suggestion.id} className="group ring-2 ring-emerald-500/20">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-emerald-100 dark:bg-emerald-900/30">
                                            <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                <Check className="h-3 w-3" />
                                                Done
                                            </span>
                                        </div>
                                    </div>
                                    <CardTitle className="text-base">{suggestion.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <CardDescription className="text-sm">{suggestion.description}</CardDescription>
                                    {suggestion.howToUse && (
                                        <div className="rounded-lg bg-[hsl(var(--muted)/0.5)] p-3">
                                            <div className="flex items-center gap-2 text-xs font-medium text-[hsl(var(--foreground))] mb-1">
                                                <ArrowRight className="h-3 w-3" />
                                                Nasıl Kullanılır?
                                            </div>
                                            <p className="text-xs text-[hsl(var(--muted-foreground))]">{suggestion.howToUse}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>

            {/* Upcoming Features */}
            <div>
                <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Upcoming Features ({upcoming.length})
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {upcoming.map((suggestion) => {
                        const Icon = suggestion.icon
                        return (
                            <Card key={suggestion.id} className="group hover:shadow-lg transition-all">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-[hsl(var(--primary)/0.1)]">
                                            <Icon className="h-5 w-5 text-[hsl(var(--primary))]" />
                                        </div>
                                        <span className={cn('rounded-full px-2 py-1 text-xs font-medium', priorityColors[suggestion.priority])}>
                                            {suggestion.priority}
                                        </span>
                                    </div>
                                    <CardTitle className="text-base">{suggestion.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-sm">{suggestion.description}</CardDescription>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>

            {/* Summary */}
            <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
                <h2 className="mb-4 text-lg font-semibold text-[hsl(var(--foreground))]">Summary</h2>
                <div className="grid gap-4 sm:grid-cols-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{implementedCount}</div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))]">Implemented</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{upcoming.length}</div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))]">Upcoming</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-red-600 dark:text-red-400">{suggestions.filter(s => s.priority === 'high').length}</div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))]">High Priority</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-[hsl(var(--primary))]">{totalCount}</div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))]">Total Features</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
