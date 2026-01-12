import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
    Search,
    Command,
    Home,
    Settings,
    LayoutGrid,
    Lightbulb,
    Map,
    FileText,
    Palette,
    Languages,
    Shield,
    Flag,
    Download,
    Clock,
    Keyboard,
    X,
    ArrowRight,
    CornerDownLeft,
    Wrench
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAllWidgets, widgetCategories } from '@/widgets/registry'

/**
 * Command categories
 */
const commandCategories = {
    pages: { label: 'Pages', icon: FileText },
    admin: { label: 'Settings', icon: Settings },
    widgets: { label: 'Widgets', icon: LayoutGrid },
    actions: { label: 'Quick Actions', icon: Command },
}

/**
 * Static commands (pages, settings) - paths are RELATIVE (will be prefixed with /t/:tenantId)
 */
const staticCommands = [
    // Pages
    { id: 'nav-home', category: 'pages', title: 'Home', subtitle: 'Go to dashboard', icon: Home, path: '' },
    { id: 'nav-widgets', category: 'pages', title: 'Widget Gallery', subtitle: 'Browse all widgets', icon: LayoutGrid, path: 'widgets' },
    { id: 'nav-admin', category: 'pages', title: 'Admin Panel', subtitle: 'Tenant settings', icon: Settings, path: 'admin' },
    { id: 'nav-suggestions', category: 'pages', title: 'Suggestions', subtitle: 'Feature requests', icon: Lightbulb, path: 'suggestions' },
    { id: 'nav-improvements', category: 'pages', title: 'Improvements', subtitle: 'İyileştirmeler', icon: Wrench, path: 'improvements' },
    { id: 'nav-roadmap', category: 'pages', title: 'Roadmap', subtitle: 'Development plan', icon: Map, path: 'roadmap' },

    // Admin tabs
    { id: 'admin-theme', category: 'admin', title: 'Theme Editor', subtitle: 'Customize colors', icon: Palette, path: 'admin', query: 'tab=theme' },
    { id: 'admin-language', category: 'admin', title: 'Language Settings', subtitle: 'i18n configuration', icon: Languages, path: 'admin', query: 'tab=language' },
    { id: 'admin-rbac', category: 'admin', title: 'Access Control', subtitle: 'Roles & permissions', icon: Shield, path: 'admin', query: 'tab=rbac' },
    { id: 'admin-flags', category: 'admin', title: 'Feature Flags', subtitle: 'Toggle features', icon: Flag, path: 'admin', query: 'tab=flags' },
    { id: 'admin-export', category: 'admin', title: 'Export/Import', subtitle: 'Backup configuration', icon: Download, path: 'admin', query: 'tab=export' },
    { id: 'admin-history', category: 'admin', title: 'Version History', subtitle: 'Restore versions', icon: Clock, path: 'admin', query: 'tab=history' },
    { id: 'admin-shortcuts', category: 'admin', title: 'Keyboard Shortcuts', subtitle: 'View all shortcuts', icon: Keyboard, path: 'admin', query: 'tab=shortcuts' },

    // Quick Actions (no navigation)
    { id: 'action-dark', category: 'actions', title: 'Toggle Dark Mode', subtitle: 'Switch theme', icon: Palette, isAction: true, handler: 'toggleDarkMode' },
]

/**
 * Command Palette Component
 */
export default function CommandPalette({ isOpen, onClose }) {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { tenantId } = useParams()
    const inputRef = useRef(null)
    const listRef = useRef(null)

    const [query, setQuery] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)

    // Build tenant-prefixed path
    const buildPath = useCallback((path, queryStr) => {
        const base = `/t/${tenantId}/${path}`
        return queryStr ? `${base}?${queryStr}` : base
    }, [tenantId])

    // Get all widgets as commands
    const widgetCommands = useMemo(() => {
        return getAllWidgets().map(widget => ({
            id: `widget-${widget.id}`,
            category: 'widgets',
            title: widget.title || widget.id,
            subtitle: widget.category,
            icon: LayoutGrid,
            path: 'widgets',
            query: `highlight=${widget.id}`
        }))
    }, [])

    // All commands
    const allCommands = useMemo(() => [...staticCommands, ...widgetCommands], [widgetCommands])

    // Filter commands by query
    const filteredCommands = useMemo(() => {
        if (!query.trim()) {
            // Show pages and admin when no query
            return allCommands.filter(cmd => cmd.category === 'pages' || cmd.category === 'admin').slice(0, 10)
        }

        const lowerQuery = query.toLowerCase()
        return allCommands
            .filter(cmd =>
                cmd.title.toLowerCase().includes(lowerQuery) ||
                cmd.subtitle?.toLowerCase().includes(lowerQuery) ||
                cmd.category.toLowerCase().includes(lowerQuery)
            )
            .slice(0, 15)
    }, [query, allCommands])

    // Group by category
    const groupedCommands = useMemo(() => {
        const groups = {}
        filteredCommands.forEach(cmd => {
            if (!groups[cmd.category]) {
                groups[cmd.category] = []
            }
            groups[cmd.category].push(cmd)
        })
        return groups
    }, [filteredCommands])

    // Execute command
    const executeCommand = useCallback((command) => {
        onClose()
        setQuery('')
        setSelectedIndex(0)

        if (command.isAction) {
            // Handle actions
            if (command.handler === 'toggleDarkMode') {
                document.documentElement.classList.toggle('dark')
            }
        } else {
            // Navigate
            const fullPath = buildPath(command.path, command.query)
            navigate(fullPath)
        }
    }, [navigate, onClose, buildPath])

    // Keyboard navigation
    const handleKeyDown = useCallback((e) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
                break
            case 'ArrowUp':
                e.preventDefault()
                setSelectedIndex(prev => Math.max(prev - 1, 0))
                break
            case 'Enter':
                e.preventDefault()
                if (filteredCommands[selectedIndex]) {
                    executeCommand(filteredCommands[selectedIndex])
                }
                break
            case 'Escape':
                e.preventDefault()
                onClose()
                break
        }
    }, [filteredCommands, selectedIndex, executeCommand, onClose])

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50)
            setQuery('')
            setSelectedIndex(0)
        }
    }, [isOpen])

    // Scroll selected item into view
    useEffect(() => {
        if (listRef.current && selectedIndex >= 0) {
            const items = listRef.current.querySelectorAll('[data-command-item]')
            items[selectedIndex]?.scrollIntoView({ block: 'nearest' })
        }
    }, [selectedIndex])

    // Reset selection on query change
    useEffect(() => {
        setSelectedIndex(0)
    }, [query])

    if (!isOpen) return null

    return createPortal(
        <div className="fixed inset-0 z-[100]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Palette */}
            <div className="absolute left-1/2 top-[20%] -translate-x-1/2 w-full max-w-xl animate-in slide-in-from-top-4 fade-in duration-200">
                <div className="mx-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] shadow-2xl overflow-hidden">
                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-[hsl(var(--border))]">
                        <Search className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search pages, widgets, settings..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] outline-none text-base"
                        />
                        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] text-xs font-mono">
                            ESC
                        </kbd>
                    </div>

                    {/* Results */}
                    <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2">
                        {filteredCommands.length === 0 ? (
                            <div className="py-8 text-center text-[hsl(var(--muted-foreground))]">
                                No results found for "{query}"
                            </div>
                        ) : (
                            Object.entries(groupedCommands).map(([category, commands]) => (
                                <div key={category} className="mb-2">
                                    <div className="px-2 py-1.5 text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
                                        {commandCategories[category]?.label || category}
                                    </div>
                                    {commands.map((cmd, idx) => {
                                        const globalIdx = filteredCommands.indexOf(cmd)
                                        const isSelected = globalIdx === selectedIndex
                                        const Icon = cmd.icon

                                        return (
                                            <button
                                                key={cmd.id}
                                                data-command-item
                                                onClick={() => executeCommand(cmd)}
                                                className={cn(
                                                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                                                    isSelected
                                                        ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                                                        : 'hover:bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]'
                                                )}
                                            >
                                                <Icon className={cn('h-4 w-4 shrink-0', isSelected ? '' : 'text-[hsl(var(--muted-foreground))]')} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium truncate">{cmd.title}</div>
                                                    {cmd.subtitle && (
                                                        <div className={cn('text-xs truncate', isSelected ? 'text-[hsl(var(--primary-foreground)/0.7)]' : 'text-[hsl(var(--muted-foreground))]')}>
                                                            {cmd.subtitle}
                                                        </div>
                                                    )}
                                                </div>
                                                {isSelected && (
                                                    <CornerDownLeft className="h-4 w-4 shrink-0 opacity-50" />
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-4 py-2 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)]">
                        <div className="flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))]">
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-[hsl(var(--muted))] font-mono">↑↓</kbd>
                                Navigate
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded bg-[hsl(var(--muted))] font-mono">↵</kbd>
                                Select
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                            <Command className="h-3 w-3" />
                            <span>K to open</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}

/**
 * Hook to manage command palette state
 */
export function useCommandPalette() {
    const [isOpen, setIsOpen] = useState(false)

    const open = useCallback(() => setIsOpen(true), [])
    const close = useCallback(() => setIsOpen(false), [])
    const toggle = useCallback(() => setIsOpen(prev => !prev), [])

    // Global keyboard shortcut (Cmd+K / Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                toggle()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [toggle])

    return { isOpen, open, close, toggle }
}
