import { useEffect, useCallback } from 'react'
import { useStore } from '@/app/store'

/**
 * Keyboard shortcut definitions
 */
export const KEYBOARD_SHORTCUTS = {
    // Navigation
    'g h': { action: 'navigate:home', description: 'Go to Home' },
    'g w': { action: 'navigate:widgets', description: 'Go to Widgets' },
    'g a': { action: 'navigate:admin', description: 'Go to Admin' },
    'g s': { action: 'navigate:suggestions', description: 'Go to Suggestions' },

    // Actions
    'ctrl+s': { action: 'save', description: 'Save changes' },
    'ctrl+z': { action: 'undo', description: 'Undo' },
    'ctrl+y': { action: 'redo', description: 'Redo' },
    'ctrl+shift+z': { action: 'redo', description: 'Redo (alt)' },

    // UI
    'ctrl+b': { action: 'toggle:sidebar', description: 'Toggle sidebar' },
    'ctrl+d': { action: 'toggle:darkmode', description: 'Toggle dark mode' },
    'escape': { action: 'close:modal', description: 'Close modal/dialog' },

    // Help
    '?': { action: 'show:shortcuts', description: 'Show keyboard shortcuts' },
}

/**
 * Parse keyboard event to shortcut string
 * @param {KeyboardEvent} event
 * @returns {string}
 */
function eventToShortcut(event) {
    const parts = []

    if (event.ctrlKey || event.metaKey) parts.push('ctrl')
    if (event.shiftKey) parts.push('shift')
    if (event.altKey) parts.push('alt')

    const key = event.key.toLowerCase()
    if (!['control', 'shift', 'alt', 'meta'].includes(key)) {
        parts.push(key)
    }

    return parts.join('+')
}

/**
 * Keyboard shortcuts hook
 * @param {object} handlers - Map of action to handler function
 * @param {object} options - Options
 */
export function useKeyboardShortcuts(handlers = {}, options = {}) {
    const { enabled = true } = options
    const toggleSidebar = useStore((state) => state.toggleSidebar)

    const handleKeyDown = useCallback((event) => {
        if (!enabled) return

        // Ignore if typing in input/textarea
        const target = event.target
        if (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable
        ) {
            // Allow certain shortcuts even in inputs
            if (!['ctrl+s', 'escape'].includes(eventToShortcut(event))) {
                return
            }
        }

        const shortcut = eventToShortcut(event)
        const definition = KEYBOARD_SHORTCUTS[shortcut]

        if (!definition) return

        const { action } = definition

        // Check for custom handler
        if (handlers[action]) {
            event.preventDefault()
            handlers[action](event)
            return
        }

        // Default handlers
        switch (action) {
            case 'toggle:sidebar':
                event.preventDefault()
                toggleSidebar()
                break

            case 'toggle:darkmode':
                event.preventDefault()
                // Toggle dark mode
                document.documentElement.classList.toggle('dark')
                break

            case 'close:modal':
                // Will be handled by modal components
                break

            case 'show:shortcuts':
                event.preventDefault()
                handlers['show:shortcuts']?.()
                break

            default:
                // Navigation shortcuts
                if (action.startsWith('navigate:')) {
                    const path = action.replace('navigate:', '')
                    handlers['navigate']?.(path)
                }
        }
    }, [enabled, handlers, toggleSidebar])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])
}

/**
 * Get all shortcuts grouped by category
 * @returns {object}
 */
export function getShortcutsByCategory() {
    const categories = {
        navigation: [],
        actions: [],
        ui: [],
        help: [],
    }

    for (const [shortcut, def] of Object.entries(KEYBOARD_SHORTCUTS)) {
        const entry = { shortcut, ...def }

        if (def.action.startsWith('navigate:')) {
            categories.navigation.push(entry)
        } else if (['save', 'undo', 'redo'].includes(def.action)) {
            categories.actions.push(entry)
        } else if (def.action.startsWith('toggle:') || def.action.startsWith('close:')) {
            categories.ui.push(entry)
        } else {
            categories.help.push(entry)
        }
    }

    return categories
}
