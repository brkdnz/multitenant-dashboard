import { lazy } from 'react'
import { Calendar, Rocket, Target, Zap, CheckCircle2, Circle, Clock, ArrowRight, Flag, Milestone, Star } from 'lucide-react'

// Statistics widgets
const StatCard = lazy(() => import('./components/StatCard'))
const ProgressCard = lazy(() => import('./components/ProgressCard'))
const ComparisonCard = lazy(() => import('./components/ComparisonCard'))
const GoalTracker = lazy(() => import('./components/GoalTracker'))
const SparklineCard = lazy(() => import('./components/SparklineCard'))
const MetricGrid = lazy(() => import('./components/MetricGrid'))
const GaugeWidget = lazy(() => import('./components/GaugeWidget'))

// Data display widgets
const SimpleTable = lazy(() => import('./components/SimpleTable'))
const ActivityFeed = lazy(() => import('./components/ActivityFeed'))
const NotificationList = lazy(() => import('./components/NotificationList'))
const TeamMemberCard = lazy(() => import('./components/TeamMemberCard'))
const Leaderboard = lazy(() => import('./components/Leaderboard'))
const NewsFeed = lazy(() => import('./components/NewsFeed'))
const TodoList = lazy(() => import('./components/TodoList'))
const FileList = lazy(() => import('./components/FileList'))
const TransactionList = lazy(() => import('./components/TransactionList'))
const TimelineWidget = lazy(() => import('./components/TimelineWidget'))

// Chart widgets
const MiniChart = lazy(() => import('./components/MiniChart'))
const DonutChart = lazy(() => import('./components/DonutChart'))
const HorizontalBarChart = lazy(() => import('./components/HorizontalBarChart'))

// Utility widgets
const WorldClock = lazy(() => import('./components/WorldClock'))
const CalendarWidget = lazy(() => import('./components/CalendarWidget'))
const WeatherCard = lazy(() => import('./components/WeatherCard'))
const CountdownWidget = lazy(() => import('./components/CountdownWidget'))
const QuoteCard = lazy(() => import('./components/QuoteCard'))
const QuickLinks = lazy(() => import('./components/QuickLinks'))
const StatusIndicator = lazy(() => import('./components/StatusIndicator'))
const TagCloud = lazy(() => import('./components/TagCloud'))

// Media widgets
const ImageCard = lazy(() => import('./components/ImageCard'))
const VideoPlayer = lazy(() => import('./components/VideoPlayer'))
const MapWidget = lazy(() => import('./components/MapWidget'))
const CodeSnippet = lazy(() => import('./components/CodeSnippet'))

// Social/Finance widgets
const SocialPost = lazy(() => import('./components/SocialPost'))
const RatingWidget = lazy(() => import('./components/RatingWidget'))
const StockTicker = lazy(() => import('./components/StockTicker'))

// NEW: Advanced visualization widgets
const HeatmapCalendar = lazy(() => import('./components/HeatmapCalendar'))
const FunnelChart = lazy(() => import('./components/FunnelChart'))
const AvatarGroup = lazy(() => import('./components/AvatarGroup'))
const CurrencyExchange = lazy(() => import('./components/CurrencyExchange'))
const ServerMonitor = lazy(() => import('./components/ServerMonitor'))
const PollWidget = lazy(() => import('./components/PollWidget'))

const widgets = new Map()

export function registerWidget(widget) {
    if (!widget.id) throw new Error('Widget must have an id')
    widgets.set(widget.id, { ...widget, permissions: widget.permissions || [] })
}

export function getWidget(id) { return widgets.get(id) || null }
export function getAllWidgets() { return Array.from(widgets.values()) }
export function getWidgetsByCategory(category) { return getAllWidgets().filter((w) => w.category === category) }
export function hasWidget(id) { return widgets.has(id) }

/**
 * Widget Registry - Comprehensive Widget Library
 * 35+ widgets across 6 categories
 */

// ============= STATISTICS (7 widgets) =============
registerWidget({ id: 'stat-card', title: 'Stat Card', description: 'Key metric with trend', icon: 'bar-chart-2', component: StatCard, category: 'statistics', defaultProps: { title: 'Revenue', value: '$12,450', icon: 'dollar', trend: { value: '+12%', positive: true } } })
registerWidget({ id: 'progress-card', title: 'Progress Card', description: 'Progress bar to goal', icon: 'activity', component: ProgressCard, category: 'statistics', defaultProps: { title: 'Goal', current: 75, target: 100 } })
registerWidget({ id: 'comparison-card', title: 'Comparison', description: 'Side-by-side metrics', icon: 'git-compare', component: ComparisonCard, category: 'statistics', defaultProps: { title: 'Comparison', leftLabel: 'This', leftValue: '24,500', rightLabel: 'Last', rightValue: '18,200' } })
registerWidget({ id: 'goal-tracker', title: 'Goal Tracker', description: 'Multiple goals', icon: 'target', component: GoalTracker, category: 'statistics', defaultProps: { title: 'Goals' } })
registerWidget({ id: 'sparkline-card', title: 'Sparkline', description: 'Metric with mini chart', icon: 'trending-up', component: SparklineCard, category: 'statistics', defaultProps: { title: 'Users', value: '8,420', color: 'success' } })
registerWidget({ id: 'metric-grid', title: 'Metric Grid', description: '4 metrics in grid', icon: 'layout-grid', component: MetricGrid, category: 'statistics', defaultProps: { title: 'Metrics' } })
registerWidget({ id: 'gauge-widget', title: 'Gauge', description: 'Speedometer style', icon: 'gauge', component: GaugeWidget, category: 'statistics', defaultProps: { title: 'Performance', value: 75 } })

// ============= DATA DISPLAY (10 widgets) =============
registerWidget({ id: 'simple-table', title: 'Data Table', description: 'Tabular data', icon: 'table', component: SimpleTable, category: 'data', defaultProps: { title: 'Orders', columns: [{ key: 'name', label: 'Customer' }, { key: 'status', label: 'Status' }], data: [{ id: 1, name: 'John', status: 'completed' }] } })
registerWidget({ id: 'activity-feed', title: 'Activity Feed', description: 'User activities', icon: 'activity', component: ActivityFeed, category: 'data', defaultProps: { title: 'Activity' } })
registerWidget({ id: 'notification-list', title: 'Notifications', description: 'Alert list', icon: 'bell', component: NotificationList, category: 'data', defaultProps: { title: 'Alerts' } })
registerWidget({ id: 'team-member', title: 'Team Member', description: 'User card', icon: 'user', component: TeamMemberCard, category: 'data', defaultProps: { name: 'John Doe', role: 'Developer', status: 'online' } })
registerWidget({ id: 'leaderboard', title: 'Leaderboard', description: 'Ranked list', icon: 'trophy', component: Leaderboard, category: 'data', defaultProps: { title: 'Top Performers' } })
registerWidget({ id: 'news-feed', title: 'News Feed', description: 'Latest news', icon: 'newspaper', component: NewsFeed, category: 'data', defaultProps: { title: 'News' } })
registerWidget({ id: 'todo-list', title: 'Todo List', description: 'Task checklist', icon: 'check-square', component: TodoList, category: 'data', defaultProps: { title: 'Tasks' } })
registerWidget({ id: 'file-list', title: 'File List', description: 'Recent files', icon: 'folder', component: FileList, category: 'data', defaultProps: { title: 'Files' } })
registerWidget({ id: 'transaction-list', title: 'Transactions', description: 'Financial list', icon: 'credit-card', component: TransactionList, category: 'data', defaultProps: { title: 'Transactions' } })
registerWidget({ id: 'timeline', title: 'Timeline', description: 'Event timeline', icon: 'git-branch', component: TimelineWidget, category: 'data', defaultProps: { title: 'Timeline' } })

// ============= CHARTS (3 widgets) =============
registerWidget({ id: 'mini-chart', title: 'Bar Chart', description: 'Compact bar chart', icon: 'bar-chart', component: MiniChart, category: 'charts', defaultProps: { title: 'Sales', data: [45, 52, 38, 65, 48, 72, 58] } })
registerWidget({ id: 'donut-chart', title: 'Donut Chart', description: 'Pie chart', icon: 'pie-chart', component: DonutChart, category: 'charts', defaultProps: { title: 'Distribution' } })
registerWidget({ id: 'horizontal-bar', title: 'Horizontal Bar', description: 'Category bars', icon: 'bar-chart-horizontal', component: HorizontalBarChart, category: 'charts', defaultProps: { title: 'Categories' } })

// ============= UTILITIES (8 widgets) =============
registerWidget({ id: 'world-clock', title: 'World Clock', description: 'Multiple timezones', icon: 'clock', component: WorldClock, category: 'utilities', defaultProps: { title: 'Time Zones' } })
registerWidget({ id: 'calendar-widget', title: 'Calendar', description: 'Mini calendar', icon: 'calendar', component: CalendarWidget, category: 'utilities', defaultProps: { title: 'Calendar' } })
registerWidget({ id: 'weather-card', title: 'Weather', description: '5-day forecast', icon: 'cloud', component: WeatherCard, category: 'utilities', defaultProps: { city: 'Istanbul', temperature: 22, condition: 'sunny' } })
registerWidget({ id: 'countdown', title: 'Countdown', description: 'Event timer', icon: 'timer', component: CountdownWidget, category: 'utilities', defaultProps: { title: 'Launch' } })
registerWidget({ id: 'quote-card', title: 'Quote Card', description: 'Inspirational quote', icon: 'quote', component: QuoteCard, category: 'utilities', defaultProps: { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" } })
registerWidget({ id: 'quick-links', title: 'Quick Links', description: 'Navigation links', icon: 'link', component: QuickLinks, category: 'utilities', defaultProps: { title: 'Links' } })
registerWidget({ id: 'status-indicator', title: 'Status', description: 'Service health', icon: 'server', component: StatusIndicator, category: 'utilities', defaultProps: { title: 'Status' } })
registerWidget({ id: 'tag-cloud', title: 'Tag Cloud', description: 'Popular tags', icon: 'tag', component: TagCloud, category: 'utilities', defaultProps: { title: 'Tags' } })

// ============= MEDIA (4 widgets) =============
registerWidget({ id: 'image-card', title: 'Image Card', description: 'Featured image', icon: 'image', component: ImageCard, category: 'media', defaultProps: { title: 'Image' } })
registerWidget({ id: 'video-player', title: 'Video Player', description: 'Video embed', icon: 'play', component: VideoPlayer, category: 'media', defaultProps: { title: 'Video' } })
registerWidget({ id: 'map-widget', title: 'Map', description: 'Location map', icon: 'map-pin', component: MapWidget, category: 'media', defaultProps: { title: 'Location', location: 'Istanbul' } })
registerWidget({ id: 'code-snippet', title: 'Code Snippet', description: 'Code display', icon: 'code', component: CodeSnippet, category: 'media', defaultProps: { title: 'Code', language: 'javascript' } })

// ============= SOCIAL & FINANCE (3 widgets) =============
registerWidget({ id: 'social-post', title: 'Social Post', description: 'Social media style', icon: 'message-circle', component: SocialPost, category: 'social', defaultProps: { author: 'John Doe', content: 'Just launched our new dashboard! 🚀' } })
registerWidget({ id: 'rating-widget', title: 'Rating', description: 'Star rating', icon: 'star', component: RatingWidget, category: 'social', defaultProps: { title: 'Rating', rating: 4.5 } })
registerWidget({ id: 'stock-ticker', title: 'Stock Ticker', description: 'Market data', icon: 'trending-up', component: StockTicker, category: 'social', defaultProps: { title: 'Markets' } })

// ============= NEW ADVANCED WIDGETS (6 widgets) =============
registerWidget({ id: 'heatmap-calendar', title: 'Heatmap Calendar', description: 'GitHub-style activity', icon: 'calendar', component: HeatmapCalendar, category: 'charts', defaultProps: { title: 'Activity', colorScheme: 'green' } })
registerWidget({ id: 'funnel-chart', title: 'Funnel Chart', description: 'Conversion funnel', icon: 'filter', component: FunnelChart, category: 'charts', defaultProps: { title: 'Conversion Funnel' } })
registerWidget({ id: 'avatar-group', title: 'Team Avatars', description: 'Team member group', icon: 'users', component: AvatarGroup, category: 'data', defaultProps: { title: 'Team', maxVisible: 5 } })
registerWidget({ id: 'currency-exchange', title: 'Currency Rates', description: 'Live exchange rates', icon: 'dollar-sign', component: CurrencyExchange, category: 'utilities', defaultProps: { title: 'Exchange Rates', baseCurrency: 'USD' } })
registerWidget({ id: 'server-monitor', title: 'Server Monitor', description: 'Infrastructure health', icon: 'server', component: ServerMonitor, category: 'utilities', defaultProps: { title: 'Server Status' } })
registerWidget({ id: 'poll-widget', title: 'Poll / Survey', description: 'Interactive voting', icon: 'vote', component: PollWidget, category: 'social', defaultProps: { title: 'Quick Poll', question: 'What feature would you like next?' } })

// Export categories
export const widgetCategories = [
    { id: 'statistics', label: 'Statistics', icon: 'bar-chart-2', description: 'Metrics & KPIs', count: 7 },
    { id: 'data', label: 'Data Display', icon: 'table', description: 'Tables & Lists', count: 11 },
    { id: 'charts', label: 'Charts', icon: 'pie-chart', description: 'Visualizations', count: 5 },
    { id: 'utilities', label: 'Utilities', icon: 'grid', description: 'Tools & Info', count: 10 },
    { id: 'media', label: 'Media', icon: 'image', description: 'Images & Video', count: 4 },
    { id: 'social', label: 'Social', icon: 'users', description: 'Social & Finance', count: 4 },
]

