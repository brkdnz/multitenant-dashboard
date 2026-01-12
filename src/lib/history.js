import { create } from 'zustand'

/**
 * Undo/Redo History Store
 * Provides command history functionality for configuration changes
 * 
 * Uses Command Pattern for undo/redo support
 */

const MAX_HISTORY_SIZE = 50

export const useHistoryStore = create((set, get) => ({
    // Past states (for undo)
    past: [],

    // Future states (for redo)
    future: [],

    // Current state snapshot
    present: null,

    /**
     * Initialize with current state
     */
    initialize: (state) => {
        set({ present: state, past: [], future: [] })
    },

    /**
     * Push a new state (called on every change)
     */
    pushState: (newState) => {
        const { present, past } = get()

        if (present === null) {
            set({ present: newState })
            return
        }

        // Don't push if state hasn't changed
        if (JSON.stringify(present) === JSON.stringify(newState)) {
            return
        }

        const newPast = [...past, present]

        // Trim history if too large
        if (newPast.length > MAX_HISTORY_SIZE) {
            newPast.shift()
        }

        set({
            past: newPast,
            present: newState,
            future: [], // Clear future on new action
        })
    },

    /**
     * Undo last action
     * @returns {object|null} Previous state or null if nothing to undo
     */
    undo: () => {
        const { past, present, future } = get()

        if (past.length === 0) {
            return null
        }

        const previous = past[past.length - 1]
        const newPast = past.slice(0, -1)

        set({
            past: newPast,
            present: previous,
            future: [present, ...future],
        })

        return previous
    },

    /**
     * Redo last undone action
     * @returns {object|null} Next state or null if nothing to redo
     */
    redo: () => {
        const { past, present, future } = get()

        if (future.length === 0) {
            return null
        }

        const next = future[0]
        const newFuture = future.slice(1)

        set({
            past: [...past, present],
            present: next,
            future: newFuture,
        })

        return next
    },

    /**
     * Check if undo is available
     */
    canUndo: () => get().past.length > 0,

    /**
     * Check if redo is available
     */
    canRedo: () => get().future.length > 0,

    /**
     * Clear all history
     */
    clearHistory: () => {
        set({ past: [], future: [] })
    },

    /**
     * Get history info
     */
    getHistoryInfo: () => {
        const { past, future } = get()
        return {
            undoCount: past.length,
            redoCount: future.length,
        }
    },
}))

/**
 * Hook for keyboard shortcuts
 */
export function useUndoRedoShortcuts(onUndo, onRedo) {
    if (typeof window !== 'undefined') {
        const handleKeyDown = (e) => {
            // Ctrl/Cmd + Z = Undo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault()
                onUndo?.()
            }

            // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y = Redo
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault()
                onRedo?.()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }
}
