/**
 * Default tenant configuration values
 * Used as fallback when creating new tenants or when values are missing
 */

export const DEFAULT_THEME = {
    mode: 'light',
    colors: {
        primary: '240 5.9% 10%',
        secondary: '240 4.8% 95.9%',
        accent: '240 4.8% 95.9%',
        background: '0 0% 100%',
        foreground: '240 10% 3.9%',
        muted: '240 4.8% 95.9%',
        mutedForeground: '240 3.8% 46.1%',
        border: '240 5.9% 90%',
        destructive: '0 84.2% 60.2%',
    },
    radius: 'md',
}

export const DARK_THEME_COLORS = {
    primary: '0 0% 98%',
    secondary: '240 3.7% 15.9%',
    accent: '240 3.7% 15.9%',
    background: '240 10% 3.9%',
    foreground: '0 0% 98%',
    muted: '240 3.7% 15.9%',
    mutedForeground: '240 5% 64.9%',
    border: '240 3.7% 15.9%',
    destructive: '0 62.8% 30.6%',
}

export const DEFAULT_BRANDING = {
    logoUrl: '/logo.svg',
    appName: 'Dashboard',
    favicon: '/favicon.ico',
}

export const DEFAULT_SIDEBAR = {
    mode: 'icon-text',
    position: 'left',
    width: 280,
    items: [],
}

export const DEFAULT_I18N = {
    enabled: true,
    defaultLanguage: 'en',
    supportedLanguages: ['tr', 'en'],
    overrides: {
        tr: {},
        en: {},
    },
}

export const DEFAULT_DRAG = {
    globalEnabled: true,
    pageOverrides: {},
    widgetOverrides: {},
}

export const DEFAULT_LAYOUTS = {
    home: [
        {
            id: 'stat-1',
            widgetId: 'stat-card',
            position: { row: 0, col: 0, width: 3, height: 1 },
            props: { title: 'Total Users', value: '1,234' },
        },
        {
            id: 'stat-2',
            widgetId: 'stat-card',
            position: { row: 0, col: 3, width: 3, height: 1 },
            props: { title: 'Revenue', value: '$12,345' },
        },
        {
            id: 'stat-3',
            widgetId: 'stat-card',
            position: { row: 0, col: 6, width: 3, height: 1 },
            props: { title: 'Orders', value: '456' },
        },
        {
            id: 'stat-4',
            widgetId: 'stat-card',
            position: { row: 0, col: 9, width: 3, height: 1 },
            props: { title: 'Conversion', value: '12.5%' },
        },
        {
            id: 'chart-1',
            widgetId: 'mini-chart',
            position: { row: 1, col: 0, width: 6, height: 2 },
            props: { title: 'Sales Overview' },
        },
        {
            id: 'table-1',
            widgetId: 'simple-table',
            position: { row: 1, col: 6, width: 6, height: 2 },
            props: { title: 'Recent Orders' },
        },
    ],
}

/**
 * Get complete default configuration for a new tenant
 * @param {string} id - Tenant ID
 * @param {string} name - Tenant name
 * @returns {object} Complete default configuration
 */
export function getDefaultTenantConfig(id, name) {
    return {
        id,
        name,
        theme: { ...DEFAULT_THEME },
        branding: { ...DEFAULT_BRANDING },
        sidebar: { ...DEFAULT_SIDEBAR },
        i18n: { ...DEFAULT_I18N },
        drag: { ...DEFAULT_DRAG },
        layouts: { ...DEFAULT_LAYOUTS },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
}

/**
 * Radius token mapping
 */
export const RADIUS_VALUES = {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    full: '9999px',
}

/**
 * Sidebar width mapping based on mode
 */
export const SIDEBAR_WIDTHS = {
    'icon-only': 64,
    'icon-text': 280,
    collapsed: 0,
}
