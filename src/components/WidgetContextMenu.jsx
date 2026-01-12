import { useState, useRef, useEffect } from 'react'
import {
    Copy,
    ClipboardPaste,
    Trash2,
    Edit2,
    MoreVertical,
    Move,
    Eye,
    EyeOff,
    Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Widget Context Menu Component
 * Right-click menu for widgets with copy/paste and other actions
 */
export default function WidgetContextMenu({
    position,
    isOpen,
    onClose,
    widget,
    canPaste,
    onCopy,
    onPaste,
    onDelete,
    onEdit,
    onDuplicate,
    onToggleVisibility
}) {
    const menuRef = useRef(null)

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose])

    // Close on escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            return () => document.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const menuItems = [
        { id: 'copy', label: 'Copy', icon: Copy, onClick: onCopy, shortcut: 'Ctrl+C' },
        { id: 'paste', label: 'Paste', icon: ClipboardPaste, onClick: onPaste, disabled: !canPaste, shortcut: 'Ctrl+V' },
        { id: 'duplicate', label: 'Duplicate', icon: Copy, onClick: onDuplicate },
        { type: 'separator' },
        { id: 'edit', label: 'Edit Properties', icon: Edit2, onClick: onEdit },
        { id: 'visibility', label: widget?.hidden ? 'Show' : 'Hide', icon: widget?.hidden ? Eye : EyeOff, onClick: onToggleVisibility },
        { type: 'separator' },
        { id: 'delete', label: 'Delete', icon: Trash2, onClick: onDelete, danger: true, shortcut: 'Del' },
    ]

    return (
        <div
            ref={menuRef}
            style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                zIndex: 1000
            }}
            className="min-w-[180px] py-1 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--popover))] shadow-xl animate-in zoom-in-95 fade-in duration-100"
        >
            {menuItems.map((item, idx) => {
                if (item.type === 'separator') {
                    return (
                        <div
                            key={`sep-${idx}`}
                            className="my-1 h-px bg-[hsl(var(--border))]"
                        />
                    )
                }

                const Icon = item.icon

                return (
                    <button
                        key={item.id}
                        onClick={() => {
                            item.onClick?.()
                            onClose()
                        }}
                        disabled={item.disabled}
                        className={cn(
                            'w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors',
                            item.disabled
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-[hsl(var(--accent))]',
                            item.danger && 'text-red-500 hover:bg-red-500/10'
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.shortcut && (
                            <span className="text-xs text-[hsl(var(--muted-foreground))]">
                                {item.shortcut}
                            </span>
                        )}
                    </button>
                )
            })}
        </div>
    )
}

/**
 * Hook to manage context menu state
 */
export function useContextMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [targetWidget, setTargetWidget] = useState(null)

    const openMenu = (e, widget) => {
        e.preventDefault()

        // Calculate position to keep menu in viewport
        const x = Math.min(e.clientX, window.innerWidth - 200)
        const y = Math.min(e.clientY, window.innerHeight - 300)

        setPosition({ x, y })
        setTargetWidget(widget)
        setIsOpen(true)
    }

    const closeMenu = () => {
        setIsOpen(false)
        setTargetWidget(null)
    }

    return {
        isOpen,
        position,
        targetWidget,
        openMenu,
        closeMenu
    }
}
