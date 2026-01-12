/**
 * Preset Themes Library
 * Collection of professionally designed themes
 */

export const PRESET_THEMES = [
    {
        id: 'default-light',
        name: 'Default Light',
        description: 'Clean and professional light theme',
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
    },
    {
        id: 'default-dark',
        name: 'Default Dark',
        description: 'Sleek dark theme for reduced eye strain',
        mode: 'dark',
        colors: {
            primary: '0 0% 98%',
            secondary: '240 3.7% 15.9%',
            accent: '240 3.7% 15.9%',
            background: '240 10% 3.9%',
            foreground: '0 0% 98%',
            muted: '240 3.7% 15.9%',
            mutedForeground: '240 5% 64.9%',
            border: '240 3.7% 15.9%',
            destructive: '0 62.8% 30.6%',
        },
        radius: 'md',
    },
    {
        id: 'ocean-blue',
        name: 'Ocean Blue',
        description: 'Calm and trustworthy blue tones',
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
    {
        id: 'forest-green',
        name: 'Forest Green',
        description: 'Natural and refreshing green palette',
        mode: 'light',
        colors: {
            primary: '160 84% 39%',
            secondary: '160 14% 96%',
            accent: '160 84% 39%',
            background: '160 14% 98%',
            foreground: '160 14% 10%',
            muted: '160 14% 96%',
            mutedForeground: '160 10% 46%',
            border: '160 14% 90%',
            destructive: '0 84% 60%',
        },
        radius: 'lg',
    },
    {
        id: 'sunset-orange',
        name: 'Sunset Orange',
        description: 'Warm and energetic orange theme',
        mode: 'light',
        colors: {
            primary: '25 95% 53%',
            secondary: '25 14% 96%',
            accent: '25 95% 53%',
            background: '25 14% 98%',
            foreground: '25 14% 10%',
            muted: '25 14% 96%',
            mutedForeground: '25 10% 46%',
            border: '25 14% 90%',
            destructive: '0 84% 60%',
        },
        radius: 'md',
    },
    {
        id: 'purple-haze',
        name: 'Purple Haze',
        description: 'Creative and modern purple theme',
        mode: 'dark',
        colors: {
            primary: '280 80% 60%',
            secondary: '280 10% 15%',
            accent: '280 80% 60%',
            background: '280 10% 8%',
            foreground: '0 0% 98%',
            muted: '280 10% 15%',
            mutedForeground: '280 10% 55%',
            border: '280 10% 20%',
            destructive: '0 62% 50%',
        },
        radius: 'lg',
    },
    {
        id: 'emerald-dark',
        name: 'Emerald Dark',
        description: 'Sophisticated dark green theme',
        mode: 'dark',
        colors: {
            primary: '160 84% 39%',
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
    {
        id: 'rose-gold',
        name: 'Rose Gold',
        description: 'Elegant and luxurious rose theme',
        mode: 'light',
        colors: {
            primary: '350 80% 60%',
            secondary: '350 14% 96%',
            accent: '350 80% 60%',
            background: '350 14% 98%',
            foreground: '350 14% 10%',
            muted: '350 14% 96%',
            mutedForeground: '350 10% 46%',
            border: '350 14% 90%',
            destructive: '0 84% 60%',
        },
        radius: 'full',
    },
    {
        id: 'midnight-blue',
        name: 'Midnight Blue',
        description: 'Deep and professional dark blue',
        mode: 'dark',
        colors: {
            primary: '220 90% 56%',
            secondary: '220 10% 15%',
            accent: '220 90% 56%',
            background: '220 20% 8%',
            foreground: '0 0% 98%',
            muted: '220 15% 15%',
            mutedForeground: '220 10% 55%',
            border: '220 15% 18%',
            destructive: '0 62% 50%',
        },
        radius: 'md',
    },
    {
        id: 'minimalist',
        name: 'Minimalist',
        description: 'Clean monochrome design',
        mode: 'light',
        colors: {
            primary: '0 0% 9%',
            secondary: '0 0% 96%',
            accent: '0 0% 9%',
            background: '0 0% 100%',
            foreground: '0 0% 9%',
            muted: '0 0% 96%',
            mutedForeground: '0 0% 45%',
            border: '0 0% 90%',
            destructive: '0 84% 60%',
        },
        radius: 'none',
    },
]

/**
 * Get theme by ID
 * @param {string} themeId - Theme ID
 * @returns {object|null}
 */
export function getThemeById(themeId) {
    return PRESET_THEMES.find((t) => t.id === themeId) || null
}

/**
 * Get themes by mode
 * @param {string} mode - 'light' or 'dark'
 * @returns {object[]}
 */
export function getThemesByMode(mode) {
    return PRESET_THEMES.filter((t) => t.mode === mode)
}

/**
 * Apply preset theme to tenant config
 * @param {object} preset - Preset theme
 * @returns {object} - Theme object ready for tenant config
 */
export function applyPresetTheme(preset) {
    return {
        mode: preset.mode,
        colors: { ...preset.colors },
        radius: preset.radius,
    }
}
