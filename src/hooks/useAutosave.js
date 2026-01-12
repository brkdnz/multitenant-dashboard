import { useEffect, useRef, useCallback } from 'react'
import { useTenantContext } from '@/tenancy/TenantContext'
import { debounce } from '@/lib/utils'

/**
 * Autosave Hook
 * Automatically saves configuration changes after a delay
 * 
 * @param {object} config - Current configuration to watch
 * @param {number} delay - Delay in ms before saving (default: 2000)
 * @param {boolean} enabled - Whether autosave is enabled
 */
export function useAutosave(config, delay = 2000, enabled = true) {
    const { saveChanges } = useTenantContext()
    const previousConfig = useRef(null)
    const isSaving = useRef(false)

    // Debounced save function
    const debouncedSave = useCallback(
        debounce(async () => {
            if (isSaving.current) return

            isSaving.current = true
            try {
                await saveChanges()
                console.log('[Autosave] Configuration saved')
            } catch (error) {
                console.error('[Autosave] Failed to save:', error)
            }
            isSaving.current = false
        }, delay),
        [saveChanges, delay]
    )

    useEffect(() => {
        if (!enabled || !config) return

        // Skip initial render
        if (previousConfig.current === null) {
            previousConfig.current = JSON.stringify(config)
            return
        }

        const currentConfig = JSON.stringify(config)

        // Check if config has changed
        if (currentConfig !== previousConfig.current) {
            previousConfig.current = currentConfig
            debouncedSave()
        }
    }, [config, enabled, debouncedSave])

    return {
        isSaving: isSaving.current,
    }
}

/**
 * Autosave indicator component props
 */
export function getAutosaveStatus(lastSaved) {
    if (!lastSaved) {
        return { text: 'Not saved', status: 'idle' }
    }

    const now = new Date()
    const saved = new Date(lastSaved)
    const diffMs = now - saved
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)

    if (diffSec < 5) {
        return { text: 'Just saved', status: 'saved' }
    } else if (diffSec < 60) {
        return { text: `Saved ${diffSec}s ago`, status: 'saved' }
    } else if (diffMin < 60) {
        return { text: `Saved ${diffMin}m ago`, status: 'saved' }
    } else {
        return { text: 'Saved', status: 'saved' }
    }
}
