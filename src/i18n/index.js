import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import trTranslations from './resources/tr.json'
import enTranslations from './resources/en.json'

/**
 * i18next configuration
 * Supports Turkish and English with tenant-specific overrides
 */

const resources = {
    tr: {
        translation: trTranslations,
    },
    en: {
        translation: enTranslations,
    },
}

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'tr', // Default language
        fallbackLng: 'tr',

        interpolation: {
            escapeValue: false, // React already does escaping
        },

        // Enable debug in development
        debug: import.meta.env.DEV,

        // React options
        react: {
            useSuspense: false,
        },
    })

/**
 * Apply tenant-specific translation overrides
 * @param {string} language - Language code (tr/en)
 * @param {object} overrides - Key-value pairs of translation overrides
 */
export function applyTranslationOverrides(language, overrides) {
    if (!overrides || Object.keys(overrides).length === 0) return

    Object.entries(overrides).forEach(([key, value]) => {
        i18n.addResource(language, 'translation', key, value)
    })
}

/**
 * Change language with optional overrides
 * @param {string} language - Language code (tr/en)
 * @param {object} overrides - Optional translation overrides
 */
export function changeLanguage(language, overrides = {}) {
    i18n.changeLanguage(language)

    if (overrides && Object.keys(overrides).length > 0) {
        applyTranslationOverrides(language, overrides)
    }
}

/**
 * Get supported languages
 * @returns {string[]}
 */
export function getSupportedLanguages() {
    return Object.keys(resources)
}

/**
 * Check if language is supported
 * @param {string} lang - Language code
 * @returns {boolean}
 */
export function isLanguageSupported(lang) {
    return Object.keys(resources).includes(lang)
}

export default i18n
