import { useState, useCallback, useEffect, useRef } from 'react'

/**
 * Widget Clipboard Hook
 * Enables copy/paste functionality for widgets
 */
export function useWidgetClipboard() {
    const [clipboard, setClipboard] = useState(null)
    const [copied, setCopied] = useState(false)

    // Copy widget to clipboard
    const copyWidget = useCallback((widget) => {
        // Deep clone the widget, remove instance-specific IDs
        const clonedWidget = {
            ...JSON.parse(JSON.stringify(widget)),
            id: undefined, // Will be regenerated on paste
            copiedAt: Date.now()
        }

        setClipboard(clonedWidget)
        setCopied(true)

        // Also copy to system clipboard as JSON
        try {
            navigator.clipboard.writeText(JSON.stringify(clonedWidget, null, 2))
        } catch (e) {
            console.warn('Could not copy to system clipboard:', e)
        }

        // Reset copied indicator after 2 seconds
        setTimeout(() => setCopied(false), 2000)

        return clonedWidget
    }, [])

    // Paste widget from clipboard
    const pasteWidget = useCallback((generateId = () => `widget-${Date.now()}`) => {
        if (!clipboard) return null

        const newWidget = {
            ...clipboard,
            id: generateId(),
            pastedAt: Date.now()
        }

        return newWidget
    }, [clipboard])

    // Clear clipboard
    const clearClipboard = useCallback(() => {
        setClipboard(null)
        setCopied(false)
    }, [])

    // Check if clipboard has content
    const hasContent = clipboard !== null

    return {
        clipboard,
        copied,
        hasContent,
        copyWidget,
        pasteWidget,
        clearClipboard
    }
}

/**
 * Auto-Refresh Hook for Widget Data
 * Automatically refreshes data at configurable intervals
 */
export function useAutoRefresh(fetchFn, intervalMs = 30000, enabled = true) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [lastRefresh, setLastRefresh] = useState(null)
    const intervalRef = useRef(null)
    const isMounted = useRef(true)

    // Fetch data
    const refresh = useCallback(async () => {
        if (!fetchFn) return

        setLoading(true)
        setError(null)

        try {
            const result = await fetchFn()
            if (isMounted.current) {
                setData(result)
                setLastRefresh(new Date())
            }
        } catch (err) {
            if (isMounted.current) {
                setError(err.message || 'Failed to fetch data')
            }
        } finally {
            if (isMounted.current) {
                setLoading(false)
            }
        }
    }, [fetchFn])

    // Setup interval
    useEffect(() => {
        isMounted.current = true

        if (enabled && intervalMs > 0) {
            // Initial fetch
            refresh()

            // Setup interval
            intervalRef.current = setInterval(refresh, intervalMs)
        }

        return () => {
            isMounted.current = false
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [enabled, intervalMs, refresh])

    // Manual refresh
    const manualRefresh = useCallback(() => {
        refresh()
    }, [refresh])

    return {
        data,
        loading,
        error,
        lastRefresh,
        refresh: manualRefresh
    }
}

/**
 * Dashboard Sharing Hook
 * Generates shareable links for dashboards
 */
export function useDashboardShare(tenantId, pageId = 'default') {
    const [shareToken, setShareToken] = useState(null)
    const [isGenerating, setIsGenerating] = useState(false)

    // Generate a share token
    const generateShareLink = useCallback(async (options = {}) => {
        setIsGenerating(true)

        try {
            // Generate a unique token
            const token = btoa(JSON.stringify({
                tenant: tenantId,
                page: pageId,
                created: Date.now(),
                expires: options.expiresIn ? Date.now() + options.expiresIn : null,
                readOnly: options.readOnly !== false
            }))

            // Store token (in a real app, this would be saved to backend)
            const shareData = {
                token,
                url: `${window.location.origin}/share/${token}`,
                tenantId,
                pageId,
                createdAt: new Date().toISOString()
            }

            setShareToken(shareData)

            // Copy to clipboard
            try {
                await navigator.clipboard.writeText(shareData.url)
            } catch (e) {
                console.warn('Could not copy to clipboard')
            }

            return shareData
        } catch (error) {
            console.error('Failed to generate share link:', error)
            throw error
        } finally {
            setIsGenerating(false)
        }
    }, [tenantId, pageId])

    // Revoke share token
    const revokeShare = useCallback(() => {
        setShareToken(null)
        // In a real app, delete from backend
    }, [])

    return {
        shareToken,
        isGenerating,
        generateShareLink,
        revokeShare
    }
}

/**
 * Multi-Page Dashboard Hook
 * Manages multiple dashboard pages
 */
export function useMultiPageDashboard(tenantId, initialPages = []) {
    const [pages, setPages] = useState(() => {
        // Try to load from localStorage
        const stored = localStorage.getItem(`dashboard_pages_${tenantId}`)
        if (stored) {
            try {
                return JSON.parse(stored)
            } catch (e) {
                console.warn('Failed to parse stored pages')
            }
        }
        return initialPages.length > 0 ? initialPages : [
            { id: 'home', name: 'Main Dashboard', icon: 'home', isDefault: true }
        ]
    })

    const [activePage, setActivePage] = useState(() => {
        // Default to 'home' to match tenant layouts
        return pages[0]?.id || 'home'
    })

    // Persist pages to localStorage
    useEffect(() => {
        localStorage.setItem(`dashboard_pages_${tenantId}`, JSON.stringify(pages))
    }, [pages, tenantId])

    // Add new page
    const addPage = useCallback((page) => {
        const newPage = {
            id: `page-${Date.now()}`,
            name: page.name || 'New Page',
            icon: page.icon || 'file',
            ...page
        }
        setPages(prev => [...prev, newPage])
        return newPage
    }, [])

    // Remove page
    const removePage = useCallback((pageId) => {
        setPages(prev => {
            const filtered = prev.filter(p => p.id !== pageId)
            // Don't remove the last page
            if (filtered.length === 0) return prev
            return filtered
        })

        // If removing active page, switch to first page
        if (activePage === pageId) {
            setActivePage(pages[0]?.id || 'default')
        }
    }, [activePage, pages])

    // Rename page
    const renamePage = useCallback((pageId, newName) => {
        setPages(prev => prev.map(p =>
            p.id === pageId ? { ...p, name: newName } : p
        ))
    }, [])

    // Reorder pages
    const reorderPages = useCallback((newOrder) => {
        setPages(newOrder)
    }, [])

    // Get current page
    const currentPage = pages.find(p => p.id === activePage) || pages[0]

    return {
        pages,
        activePage,
        currentPage,
        setActivePage,
        addPage,
        removePage,
        renamePage,
        reorderPages
    }
}

/**
 * PDF Export Utility
 * Exports dashboard to PDF (requires html2canvas and jspdf)
 */
export async function exportDashboardToPdf(elementId, filename = 'dashboard.pdf') {
    // Detect dark mode
    const isDark = document.documentElement.classList.contains('dark')

    // Create override style to replace oklch colors BEFORE html2canvas runs
    const overrideStyle = document.createElement('style')
    overrideStyle.id = 'pdf-export-override'
    overrideStyle.textContent = `
        :root, .dark, .light, [data-theme], * {
            --background: ${isDark ? '#0f172a' : '#ffffff'} !important;
            --foreground: ${isDark ? '#f8fafc' : '#0f172a'} !important;
            --card: ${isDark ? '#1e293b' : '#ffffff'} !important;
            --card-foreground: ${isDark ? '#f8fafc' : '#0f172a'} !important;
            --primary: ${isDark ? '#3b82f6' : '#2563eb'} !important;
            --primary-foreground: #ffffff !important;
            --secondary: ${isDark ? '#334155' : '#f1f5f9'} !important;
            --muted: ${isDark ? '#334155' : '#f1f5f9'} !important;
            --muted-foreground: ${isDark ? '#94a3b8' : '#64748b'} !important;
            --accent: ${isDark ? '#334155' : '#f1f5f9'} !important;
            --border: ${isDark ? '#334155' : '#e2e8f0'} !important;
        }
    `
    document.head.appendChild(overrideStyle)

    try {
        // Wait for styles to apply
        await new Promise(r => setTimeout(r, 50))

        // Dynamically import libraries
        const html2canvas = (await import('html2canvas')).default
        const { jsPDF } = await import('jspdf')

        const element = document.getElementById(elementId)
        if (!element) throw new Error('Element not found')

        // Capture with simple options
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: isDark ? '#0f172a' : '#ffffff'
        })

        // Generate PDF
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
            orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        })

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
        pdf.save(filename)

        return { success: true, filename }
    } catch (error) {
        console.error('PDF export failed:', error)
        return { success: false, error: error.message }
    } finally {
        // Always cleanup
        overrideStyle.remove()
    }
}

