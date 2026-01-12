/**
 * Tenant B Configuration
 * English language, dark purple theme, unique layout
 */
export const tenantBConfig = {
    id: 'tenant-b',
    name: 'Startup Pro',

    theme: {
        mode: 'dark',
        colors: {
            primary: '160 84% 39%',        // Emerald green
            secondary: '160 10% 15%',
            accent: '160 84% 39%',
            background: '220 20% 8%',
            foreground: '0 0% 98%',
            muted: '220 15% 15%',
            mutedForeground: '220 10% 55%',
            border: '220 15% 18%',
            destructive: '0 62% 50%',
        },
        radius: 'lg',
    },

    branding: {
        logoUrl: '/logo.svg',
        appName: 'Startup Pro',
    },

    sidebar: {
        mode: 'icon-only',
        position: 'left',
        width: 72,
        items: [],
    },

    i18n: {
        enabled: true,
        defaultLanguage: 'en',
        supportedLanguages: ['tr', 'en'],
        overrides: {
            tr: {},
            en: {
                'home.title': 'Analytics Hub',
                'home.welcome': 'Welcome back',
                'sidebar.home': 'Analytics',
                'sidebar.widgets': 'Insights',
                'sidebar.admin': 'Settings',
                'sidebar.suggestions': 'AI Tips',
            },
        },
    },

    drag: {
        globalEnabled: true,
        pageOverrides: {},
        widgetOverrides: {},
    },

    layouts: {
        home: [
            {
                id: 'stat-1',
                widgetId: 'stat-card',
                position: { row: 0, col: 0, width: 4, height: 1 },
                props: { title: 'Monthly Revenue', value: '$128,456', icon: 'dollar', trend: { value: '+18%', positive: true } },
            },
            {
                id: 'stat-2',
                widgetId: 'stat-card',
                position: { row: 0, col: 4, width: 4, height: 1 },
                props: { title: 'Active Users', value: '12,847', icon: 'users', trend: { value: '+24%', positive: true } },
            },
            {
                id: 'stat-3',
                widgetId: 'stat-card',
                position: { row: 0, col: 8, width: 4, height: 1 },
                props: { title: 'Conversion Rate', value: '4.8%', icon: 'trending', trend: { value: '+0.6%', positive: true } },
            },
            {
                id: 'chart-1',
                widgetId: 'mini-chart',
                position: { row: 1, col: 0, width: 8, height: 2 },
                props: { title: 'Weekly Growth', data: [65, 78, 52, 91, 84, 110, 95] },
            },
            {
                id: 'table-1',
                widgetId: 'simple-table',
                position: { row: 1, col: 8, width: 4, height: 2 },
                props: {
                    title: 'Top Customers',
                    columns: [
                        { key: 'name', label: 'Customer' },
                        { key: 'status', label: 'Plan' },
                        { key: 'amount', label: 'MRR' },
                    ],
                    data: [
                        { id: 1, name: 'Acme Corp', status: 'active', amount: '$2,400' },
                        { id: 2, name: 'TechFlow', status: 'active', amount: '$1,850' },
                        { id: 3, name: 'DataSync', status: 'pending', amount: '$1,200' },
                    ]
                },
            },
        ],
    },

    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
}
