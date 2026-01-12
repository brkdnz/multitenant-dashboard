/**
 * Dashboard Templates Library
 * Pre-built dashboard configurations with comprehensive widget variety
 */

export const DASHBOARD_TEMPLATES = [
    {
        id: 'sales-dashboard',
        name: 'Sales Dashboard',
        description: 'Track revenue, orders, and customer metrics',
        category: 'business',
        thumbnail: '📊',
        layouts: {
            home: [
                { id: 'revenue', widgetId: 'stat-card', position: { width: 3 }, props: { title: 'Revenue', value: '$124,500', icon: 'dollar', trend: { value: '+12%', positive: true } } },
                { id: 'orders', widgetId: 'stat-card', position: { width: 3 }, props: { title: 'Orders', value: '1,234', icon: 'shopping-cart', trend: { value: '+8%', positive: true } } },
                { id: 'customers', widgetId: 'stat-card', position: { width: 3 }, props: { title: 'Customers', value: '892', icon: 'users', trend: { value: '+15%', positive: true } } },
                { id: 'conversion', widgetId: 'sparkline-card', position: { width: 3 }, props: { title: 'Conversion', value: '3.2%', color: 'success' } },
                { id: 'goals', widgetId: 'goal-tracker', position: { width: 4 }, props: { title: 'Sales Goals' } },
                { id: 'chart', widgetId: 'mini-chart', position: { width: 4 }, props: { title: 'Sales Trend', data: [65, 78, 52, 91, 84, 110, 95] } },
                { id: 'donut', widgetId: 'donut-chart', position: { width: 4 }, props: { title: 'Traffic Sources' } },
                { id: 'table', widgetId: 'simple-table', position: { width: 6 }, props: { title: 'Recent Orders' } },
                { id: 'leaderboard', widgetId: 'leaderboard', position: { width: 6 }, props: { title: 'Top Sales Reps' } },
            ],
        },
    },
    {
        id: 'analytics-dashboard',
        name: 'Analytics Dashboard',
        description: 'Website traffic, user behavior, and engagement',
        category: 'analytics',
        thumbnail: '📈',
        layouts: {
            home: [
                { id: 'visitors', widgetId: 'sparkline-card', position: { width: 3 }, props: { title: 'Visitors', value: '45.8K', color: 'primary' } },
                { id: 'pageviews', widgetId: 'sparkline-card', position: { width: 3 }, props: { title: 'Page Views', value: '182K', color: 'success' } },
                { id: 'bounce', widgetId: 'sparkline-card', position: { width: 3 }, props: { title: 'Bounce', value: '32%', color: 'warning' } },
                { id: 'session', widgetId: 'sparkline-card', position: { width: 3 }, props: { title: 'Avg Session', value: '4:32', color: 'primary' } },
                { id: 'metric-grid', widgetId: 'metric-grid', position: { width: 6 }, props: { title: 'Key Metrics' } },
                { id: 'sources', widgetId: 'donut-chart', position: { width: 6 }, props: { title: 'Traffic Sources' } },
                { id: 'activity', widgetId: 'activity-feed', position: { width: 4 }, props: { title: 'User Activity' } },
                { id: 'goals', widgetId: 'goal-tracker', position: { width: 4 }, props: { title: 'Conversion Goals' } },
                { id: 'world-clock', widgetId: 'world-clock', position: { width: 4 }, props: { title: 'Global Visitors' } },
            ],
        },
    },
    {
        id: 'project-dashboard',
        name: 'Project Management',
        description: 'Track tasks, team progress, and milestones',
        category: 'productivity',
        thumbnail: '📋',
        layouts: {
            home: [
                { id: 'tasks', widgetId: 'stat-card', position: { width: 3 }, props: { title: 'Total Tasks', value: '156', icon: 'list' } },
                { id: 'completed', widgetId: 'stat-card', position: { width: 3 }, props: { title: 'Completed', value: '98', icon: 'check', trend: { value: '+8', positive: true } } },
                { id: 'progress', widgetId: 'progress-card', position: { width: 3 }, props: { title: 'Sprint', current: 78, target: 100 } },
                { id: 'team-count', widgetId: 'stat-card', position: { width: 3 }, props: { title: 'Team', value: '12', icon: 'users' } },
                { id: 'timeline', widgetId: 'timeline', position: { width: 6 }, props: { title: 'Sprint Timeline' } },
                { id: 'gauge', widgetId: 'gauge-widget', position: { width: 6 }, props: { title: 'Sprint Progress', value: 78 } },
                { id: 'team-1', widgetId: 'team-member', position: { width: 3 }, props: { name: 'Alice Johnson', role: 'Lead Dev', status: 'online' } },
                { id: 'team-2', widgetId: 'team-member', position: { width: 3 }, props: { name: 'Bob Smith', role: 'Designer', status: 'away' } },
                { id: 'team-3', widgetId: 'team-member', position: { width: 3 }, props: { name: 'Carol White', role: 'QA', status: 'online' } },
                { id: 'team-4', widgetId: 'team-member', position: { width: 3 }, props: { name: 'David Brown', role: 'Backend', status: 'busy' } },
                { id: 'countdown', widgetId: 'countdown', position: { width: 4 }, props: { title: 'Sprint Deadline', theme: 'warning' } },
                { id: 'calendar', widgetId: 'calendar-widget', position: { width: 4 }, props: { title: 'Sprint Calendar' } },
                { id: 'todo', widgetId: 'todo-list', position: { width: 4 }, props: { title: 'My Tasks' } },
            ],
        },
    },
    {
        id: 'marketing-dashboard',
        name: 'Marketing Dashboard',
        description: 'Campaign performance, leads, and ROI',
        category: 'marketing',
        thumbnail: '🎯',
        layouts: {
            home: [
                { id: 'leads', widgetId: 'stat-card', position: { width: 4 }, props: { title: 'New Leads', value: '2,456', icon: 'users', trend: { value: '+32%', positive: true } } },
                { id: 'campaigns', widgetId: 'stat-card', position: { width: 4 }, props: { title: 'Campaigns', value: '8', icon: 'flag' } },
                { id: 'roi', widgetId: 'stat-card', position: { width: 4 }, props: { title: 'ROI', value: '245%', icon: 'trending', trend: { value: '+18%', positive: true } } },
                { id: 'comparison', widgetId: 'comparison-card', position: { width: 6 }, props: { title: 'MoM Growth', leftLabel: 'This Month', leftValue: '15,200', rightLabel: 'Last Month', rightValue: '11,800' } },
                { id: 'goals', widgetId: 'goal-tracker', position: { width: 6 }, props: { title: 'Campaign Goals' } },
                { id: 'horizontal-bar', widgetId: 'horizontal-bar', position: { width: 6 }, props: { title: 'Channel Performance' } },
                { id: 'tag-cloud', widgetId: 'tag-cloud', position: { width: 6 }, props: { title: 'Trending Keywords' } },
                { id: 'leaderboard', widgetId: 'leaderboard', position: { width: 6 }, props: { title: 'Top Campaigns' } },
                { id: 'news', widgetId: 'news-feed', position: { width: 6 }, props: { title: 'Marketing Updates' } },
            ],
        },
    },
    {
        id: 'executive-dashboard',
        name: 'Executive Dashboard',
        description: 'High-level KPIs for leadership',
        category: 'business',
        thumbnail: '👔',
        layouts: {
            home: [
                { id: 'revenue', widgetId: 'stat-card', position: { width: 4 }, props: { title: 'Annual Revenue', value: '$4.2M', icon: 'dollar', trend: { value: '+22%', positive: true } } },
                { id: 'customers', widgetId: 'stat-card', position: { width: 4 }, props: { title: 'Customers', value: '12,456', icon: 'users' } },
                { id: 'nps', widgetId: 'stat-card', position: { width: 4 }, props: { title: 'NPS Score', value: '72', icon: 'star', trend: { value: '+8', positive: true } } },
                { id: 'metric-grid', widgetId: 'metric-grid', position: { width: 6 }, props: { title: 'Key Performance' } },
                { id: 'comparison', widgetId: 'comparison-card', position: { width: 6 }, props: { title: 'YoY Growth', leftLabel: '2024', leftValue: '4.2M', rightLabel: '2023', rightValue: '3.4M' } },
                { id: 'donut', widgetId: 'donut-chart', position: { width: 4 }, props: { title: 'Revenue by Product' } },
                { id: 'chart', widgetId: 'mini-chart', position: { width: 4 }, props: { title: 'Quarterly Trend', data: [850, 920, 1100, 1330] } },
                { id: 'world-clock', widgetId: 'world-clock', position: { width: 4 }, props: { title: 'Office Locations' } },
            ],
        },
    },
    {
        id: 'personal-dashboard',
        name: 'Personal Dashboard',
        description: 'Daily essentials and productivity tools',
        category: 'general',
        thumbnail: '✨',
        layouts: {
            home: [
                { id: 'weather', widgetId: 'weather-card', position: { width: 4 }, props: { city: 'Istanbul', temperature: 22, condition: 'sunny' } },
                { id: 'clock', widgetId: 'world-clock', position: { width: 4 }, props: { title: 'Time Zones' } },
                { id: 'calendar', widgetId: 'calendar-widget', position: { width: 4 }, props: { title: 'Calendar' } },
                { id: 'todo', widgetId: 'todo-list', position: { width: 6 }, props: { title: 'My Tasks' } },
                { id: 'quick-links', widgetId: 'quick-links', position: { width: 6 }, props: { title: 'Bookmarks' } },
                { id: 'quote', widgetId: 'quote-card', position: { width: 6 }, props: { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" } },
                { id: 'news', widgetId: 'news-feed', position: { width: 6 }, props: { title: 'Daily News' } },
            ],
        },
    },
    {
        id: 'devops-dashboard',
        name: 'DevOps Dashboard',
        description: 'Monitor deployments, services, and infrastructure',
        category: 'technical',
        thumbnail: '🔧',
        layouts: {
            home: [
                { id: 'status', widgetId: 'status-indicator', position: { width: 6 }, props: { title: 'System Health' } },
                { id: 'metric-grid', widgetId: 'metric-grid', position: { width: 6 }, props: { title: 'Infrastructure Metrics' } },
                { id: 'deploys', widgetId: 'sparkline-card', position: { width: 3 }, props: { title: 'Deployments', value: '47', color: 'success' } },
                { id: 'uptime', widgetId: 'gauge-widget', position: { width: 3 }, props: { title: 'Uptime', value: 99.9 } },
                { id: 'errors', widgetId: 'sparkline-card', position: { width: 3 }, props: { title: 'Error Rate', value: '0.1%', color: 'danger' } },
                { id: 'latency', widgetId: 'sparkline-card', position: { width: 3 }, props: { title: 'Avg Latency', value: '45ms', color: 'warning' } },
                { id: 'timeline', widgetId: 'timeline', position: { width: 6 }, props: { title: 'Deployment History' } },
                { id: 'code', widgetId: 'code-snippet', position: { width: 6 }, props: { title: 'Last Error', language: 'python' } },
                { id: 'activity', widgetId: 'activity-feed', position: { width: 6 }, props: { title: 'Deployment Activity' } },
                { id: 'notifications', widgetId: 'notification-list', position: { width: 6 }, props: { title: 'Alerts' } },
            ],
        },
    },
    {
        id: 'hr-dashboard',
        name: 'HR Dashboard',
        description: 'Employee management and team insights',
        category: 'business',
        thumbnail: '👥',
        layouts: {
            home: [
                { id: 'employees', widgetId: 'stat-card', position: { width: 3 }, props: { title: 'Employees', value: '245', icon: 'users' } },
                { id: 'new-hires', widgetId: 'stat-card', position: { width: 3 }, props: { title: 'New Hires', value: '12', icon: 'user-plus', trend: { value: '+3', positive: true } } },
                { id: 'open-positions', widgetId: 'stat-card', position: { width: 3 }, props: { title: 'Open Roles', value: '8', icon: 'briefcase' } },
                { id: 'satisfaction', widgetId: 'gauge-widget', position: { width: 3 }, props: { title: 'Satisfaction', value: 85 } },
                { id: 'team-1', widgetId: 'team-member', position: { width: 3 }, props: { name: 'Sarah Chen', role: 'HR Manager', status: 'online' } },
                { id: 'team-2', widgetId: 'team-member', position: { width: 3 }, props: { name: 'Mike Wilson', role: 'Recruiter', status: 'online' } },
                { id: 'team-3', widgetId: 'team-member', position: { width: 3 }, props: { name: 'Lisa Park', role: 'Coordinator', status: 'away' } },
                { id: 'leaderboard', widgetId: 'leaderboard', position: { width: 3 }, props: { title: 'Top Performers' } },
                { id: 'calendar', widgetId: 'calendar-widget', position: { width: 6 }, props: { title: 'HR Calendar' } },
                { id: 'news', widgetId: 'news-feed', position: { width: 6 }, props: { title: 'Company Updates' } },
            ],
        },
    },
    // ============= NEW TEMPLATES =============
    {
        id: 'finance-dashboard',
        name: 'Finance Dashboard',
        description: 'Track investments, transactions, and markets',
        category: 'finance',
        thumbnail: '💰',
        layouts: {
            home: [
                { id: 'portfolio', widgetId: 'stat-card', position: { width: 4 }, props: { title: 'Portfolio Value', value: '$847,250', icon: 'wallet', trend: { value: '+5.2%', positive: true } } },
                { id: 'profit', widgetId: 'stat-card', position: { width: 4 }, props: { title: 'Today\'s P/L', value: '+$12,450', icon: 'trending-up', trend: { value: '+1.5%', positive: true } } },
                { id: 'transactions', widgetId: 'stat-card', position: { width: 4 }, props: { title: 'Transactions', value: '156', icon: 'credit-card' } },
                { id: 'stock-ticker', widgetId: 'stock-ticker', position: { width: 12 }, props: { title: 'Market Watch' } },
                { id: 'donut', widgetId: 'donut-chart', position: { width: 4 }, props: { title: 'Asset Allocation' } },
                { id: 'chart', widgetId: 'mini-chart', position: { width: 4 }, props: { title: 'Portfolio Performance', data: [78, 82, 75, 88, 92, 85, 95] } },
                { id: 'gauge', widgetId: 'gauge-widget', position: { width: 4 }, props: { title: 'Risk Score', value: 65 } },
                { id: 'transaction-list', widgetId: 'transaction-list', position: { width: 6 }, props: { title: 'Recent Transactions' } },
                { id: 'comparison', widgetId: 'comparison-card', position: { width: 6 }, props: { title: 'vs Last Month', leftLabel: 'This Month', leftValue: '$847K', rightLabel: 'Last Month', rightValue: '$792K' } },
            ],
        },
    },
    {
        id: 'social-dashboard',
        name: 'Social Media Dashboard',
        description: 'Monitor engagement, followers, and content performance',
        category: 'marketing',
        thumbnail: '📱',
        layouts: {
            home: [
                { id: 'followers', widgetId: 'stat-card', position: { width: 3 }, props: { title: 'Followers', value: '125.4K', icon: 'users', trend: { value: '+2.1K', positive: true } } },
                { id: 'engagement', widgetId: 'stat-card', position: { width: 3 }, props: { title: 'Engagement', value: '4.8%', icon: 'heart', trend: { value: '+0.3%', positive: true } } },
                { id: 'reach', widgetId: 'sparkline-card', position: { width: 3 }, props: { title: 'Reach', value: '458K', color: 'primary' } },
                { id: 'posts', widgetId: 'stat-card', position: { width: 3 }, props: { title: 'Posts', value: '24', icon: 'file-text' } },
                { id: 'rating', widgetId: 'rating-widget', position: { width: 4 }, props: { title: 'Average Rating', rating: 4.7 } },
                { id: 'horizontal-bar', widgetId: 'horizontal-bar', position: { width: 4 }, props: { title: 'Platform Breakdown' } },
                { id: 'goals', widgetId: 'goal-tracker', position: { width: 4 }, props: { title: 'Growth Goals' } },
                { id: 'social-post', widgetId: 'social-post', position: { width: 4 }, props: { author: 'Brand Account', content: '🚀 Excited to announce our new feature launch! Check it out and let us know what you think. #Innovation #Tech' } },
                { id: 'activity', widgetId: 'activity-feed', position: { width: 4 }, props: { title: 'Recent Mentions' } },
                { id: 'tag-cloud', widgetId: 'tag-cloud', position: { width: 4 }, props: { title: 'Trending Hashtags' } },
            ],
        },
    },
    {
        id: 'support-dashboard',
        name: 'Customer Support',
        description: 'Track tickets, response times, and satisfaction',
        category: 'service',
        thumbnail: '🎧',
        layouts: {
            home: [
                { id: 'open-tickets', widgetId: 'stat-card', position: { width: 3 }, props: { title: 'Open Tickets', value: '47', icon: 'ticket', trend: { value: '-8', positive: true } } },
                { id: 'resolved', widgetId: 'stat-card', position: { width: 3 }, props: { title: 'Resolved Today', value: '156', icon: 'check-circle' } },
                { id: 'avg-time', widgetId: 'stat-card', position: { width: 3 }, props: { title: 'Avg Response', value: '2.4h', icon: 'clock' } },
                { id: 'csat', widgetId: 'gauge-widget', position: { width: 3 }, props: { title: 'CSAT Score', value: 92 } },
                { id: 'rating', widgetId: 'rating-widget', position: { width: 4 }, props: { title: 'Customer Rating', rating: 4.6 } },
                { id: 'timeline', widgetId: 'timeline', position: { width: 4 }, props: { title: 'Ticket Timeline' } },
                { id: 'goals', widgetId: 'goal-tracker', position: { width: 4 }, props: { title: 'Support Goals' } },
                { id: 'leaderboard', widgetId: 'leaderboard', position: { width: 6 }, props: { title: 'Top Agents' } },
                { id: 'notifications', widgetId: 'notification-list', position: { width: 6 }, props: { title: 'Priority Tickets' } },
            ],
        },
    },
    {
        id: 'ecommerce-dashboard',
        name: 'E-Commerce Dashboard',
        description: 'Track sales, inventory, and customer behavior',
        category: 'business',
        thumbnail: '🛒',
        layouts: {
            home: [
                { id: 'revenue', widgetId: 'stat-card', position: { width: 3 }, props: { title: 'Today\'s Sales', value: '$24,850', icon: 'dollar', trend: { value: '+18%', positive: true } } },
                { id: 'orders', widgetId: 'stat-card', position: { width: 3 }, props: { title: 'Orders', value: '342', icon: 'shopping-bag' } },
                { id: 'cart-abandon', widgetId: 'sparkline-card', position: { width: 3 }, props: { title: 'Cart Abandon', value: '23%', color: 'warning' } },
                { id: 'aov', widgetId: 'stat-card', position: { width: 3 }, props: { title: 'Avg Order', value: '$72.50', icon: 'receipt' } },
                { id: 'chart', widgetId: 'mini-chart', position: { width: 6 }, props: { title: 'Sales Trend', data: [180, 220, 195, 280, 250, 310, 285] } },
                { id: 'donut', widgetId: 'donut-chart', position: { width: 6 }, props: { title: 'Sales by Category' } },
                { id: 'table', widgetId: 'simple-table', position: { width: 6 }, props: { title: 'Best Sellers' } },
                { id: 'transaction-list', widgetId: 'transaction-list', position: { width: 6 }, props: { title: 'Recent Orders' } },
                { id: 'rating', widgetId: 'rating-widget', position: { width: 4 }, props: { title: 'Store Rating', rating: 4.8 } },
                { id: 'file-list', widgetId: 'file-list', position: { width: 4 }, props: { title: 'Product Images' } },
                { id: 'countdown', widgetId: 'countdown', position: { width: 4 }, props: { title: 'Flash Sale Ends', theme: 'danger' } },
            ],
        },
    },
]

export function getTemplateById(templateId) {
    return DASHBOARD_TEMPLATES.find(t => t.id === templateId) || null
}

export function getTemplatesByCategory(category) {
    if (category === 'all') return DASHBOARD_TEMPLATES
    return DASHBOARD_TEMPLATES.filter(t => t.category === category)
}

export function getTemplateCategories() {
    const categories = [...new Set(DASHBOARD_TEMPLATES.map(t => t.category))]
    return ['all', ...categories]
}

