/**
 * Tenant A Configuration
 * Turkish language, icon+text sidebar, drag enabled
 */
export const tenantAConfig = {
    id: 'tenant-a',
    name: 'Tenant A',

    theme: {
        mode: 'light',
        colors: {
            primary: '220 90% 56%',
            secondary: '220 14% 96%',
            accent: '220 90% 56%',
            background: '220 14% 98%',
            foreground: '220 14% 10%',
            muted: '220 14% 96%',
            mutedForeground: '220 10% 46%',
            border: '220 14% 90%',
            destructive: '0 84% 60%',
        },
        radius: 'lg',
    },

    branding: {
        logoUrl: '/logo.svg',
        appName: 'Dashboard A',
    },

    sidebar: {
        mode: 'icon-text',
        position: 'left',
        width: 260,
        items: [],
    },

    i18n: {
        enabled: true,
        defaultLanguage: 'tr',
        supportedLanguages: ['tr', 'en'],
        overrides: {
            tr: {
                'sidebar.home': 'Anasayfa',
                'sidebar.widgets': 'Widget Galerisi',
                'sidebar.admin': 'Yönetim Paneli',
                'sidebar.suggestions': 'Öneriler',
            },
            en: {},
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
                position: { row: 0, col: 0, width: 6, height: 1 },
                props: { title: 'Toplam Kullanıcı', value: '1,234', icon: 'users', trend: { value: '+12%', positive: true } },
            },
            {
                id: 'stat-2',
                widgetId: 'stat-card',
                position: { row: 0, col: 6, width: 6, height: 1 },
                props: { title: 'Gelir', value: '₺45,678', icon: 'dollar', trend: { value: '+8%', positive: true } },
            },
            {
                id: 'stat-3',
                widgetId: 'stat-card',
                position: { row: 1, col: 0, width: 6, height: 1 },
                props: { title: 'Siparişler', value: '456', icon: 'package', trend: { value: '-3%', positive: false } },
            },
            {
                id: 'stat-4',
                widgetId: 'stat-card',
                position: { row: 1, col: 6, width: 6, height: 1 },
                props: { title: 'Dönüşüm Oranı', value: '%12.5', icon: 'trending', trend: { value: '+2.1%', positive: true } },
            },
            {
                id: 'chart-1',
                widgetId: 'mini-chart',
                position: { row: 2, col: 0, width: 8, height: 2 },
                props: { title: 'Haftalık Satışlar', data: [45, 72, 38, 85, 62, 95, 78] },
            },
            {
                id: 'table-1',
                widgetId: 'simple-table',
                position: { row: 2, col: 8, width: 4, height: 2 },
                props: {
                    title: 'Son Siparişler',
                    columns: [
                        { key: 'name', label: 'Müşteri' },
                        { key: 'status', label: 'Durum' },
                        { key: 'amount', label: 'Tutar' },
                    ],
                    data: [
                        { id: 1, name: 'Ahmet Y.', status: 'active', amount: '₺1,250' },
                        { id: 2, name: 'Mehmet K.', status: 'pending', amount: '₺890' },
                        { id: 3, name: 'Ayşe D.', status: 'completed', amount: '₺2,100' },
                    ]
                },
            },
        ],
    },

    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
}
