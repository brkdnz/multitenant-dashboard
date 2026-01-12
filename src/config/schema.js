import { z } from 'zod'

/**
 * Color value schema - HSL format without hsl() wrapper
 * Example: "240 5.9% 10%"
 */
const ColorSchema = z.string().regex(/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/, {
    message: 'Color must be in HSL format: "H S% L%"',
})

/**
 * Theme configuration schema
 */
export const ThemeSchema = z.object({
    mode: z.enum(['light', 'dark']).default('light'),
    colors: z.object({
        primary: ColorSchema.default('240 5.9% 10%'),
        secondary: ColorSchema.default('240 4.8% 95.9%'),
        accent: ColorSchema.default('240 4.8% 95.9%'),
        background: ColorSchema.default('0 0% 100%'),
        foreground: ColorSchema.default('240 10% 3.9%'),
        muted: ColorSchema.default('240 4.8% 95.9%'),
        mutedForeground: ColorSchema.default('240 3.8% 46.1%'),
        border: ColorSchema.default('240 5.9% 90%'),
        destructive: ColorSchema.default('0 84.2% 60.2%'),
    }).default({}),
    radius: z.enum(['none', 'sm', 'md', 'lg', 'full']).default('md'),
    fontFamily: z.string().optional(),
})

/**
 * Branding configuration schema
 */
export const BrandingSchema = z.object({
    logoUrl: z.string().url().or(z.string().startsWith('/')).or(z.literal('')).default('/logo.svg'),
    appName: z.string().min(1).default('Dashboard'),
    favicon: z.string().optional(),
})

/**
 * Sidebar menu item schema
 */
const SidebarItemSchema = z.object({
    id: z.string(),
    visible: z.boolean().default(true),
    order: z.number().default(0),
})

/**
 * Sidebar configuration schema
 */
export const SidebarSchema = z.object({
    mode: z.enum(['icon-only', 'icon-text', 'collapsed']).default('icon-text'),
    position: z.enum(['left', 'right']).default('left'),
    width: z.number().min(64).max(400).default(280),
    items: z.array(SidebarItemSchema).default([]),
})

/**
 * i18n configuration schema
 */
export const I18nSchema = z.object({
    enabled: z.boolean().default(true),
    defaultLanguage: z.enum(['tr', 'en']).default('en'),
    supportedLanguages: z.array(z.enum(['tr', 'en'])).default(['tr', 'en']),
    overrides: z.record(z.string(), z.record(z.string(), z.string())).default({}),
})

/**
 * Drag and drop configuration schema
 */
export const DragSchema = z.object({
    globalEnabled: z.boolean().default(true),
    pageOverrides: z.record(z.string(), z.boolean()).default({}),
    widgetOverrides: z.record(z.string(), z.boolean()).default({}),
})

/**
 * Widget position schema
 */
const WidgetPositionSchema = z.object({
    row: z.number().default(0),
    col: z.number().default(0),
    width: z.number().min(1).max(12).default(6),
    height: z.number().min(1).default(2),
})

/**
 * Widget instance schema
 */
const WidgetInstanceSchema = z.object({
    id: z.string(),
    widgetId: z.string(),
    position: WidgetPositionSchema,
    props: z.record(z.string(), z.any()).default({}),
})

/**
 * Layout configuration schema (widgets per page)
 */
export const LayoutSchema = z.record(z.string(), z.array(WidgetInstanceSchema)).default({})

/**
 * Complete tenant configuration schema
 */
export const TenantConfigSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    theme: ThemeSchema.default({}),
    branding: BrandingSchema.default({}),
    sidebar: SidebarSchema.default({}),
    i18n: I18nSchema.default({}),
    drag: DragSchema.default({}),
    layouts: LayoutSchema.default({}),
    featureFlags: z.record(z.string(), z.boolean()).default({}),
    widgetPermissions: z.record(z.string(), z.array(z.string())).default({}),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
})

/**
 * Validate tenant configuration
 * @param {object} config - Configuration to validate
 * @returns {{ success: boolean, data?: object, error?: string }}
 */
export function validateTenantConfig(config) {
    try {
        const data = TenantConfigSchema.parse(config)
        return { success: true, data }
    } catch (error) {
        return {
            success: false,
            error: error.errors?.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') || error.message
        }
    }
}

/**
 * Safely parse tenant configuration with defaults
 * @param {object} config - Partial configuration
 * @returns {object} Complete configuration with defaults
 */
export function parseTenantConfig(config) {
    return TenantConfigSchema.parse(config)
}
