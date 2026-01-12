import { useState } from 'react'
import { Plus, X, Edit2, Check, FileText, Home, LayoutGrid, Settings, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

/**
 * Page Manager Component
 * UI for managing multiple dashboard pages
 */
export default function PageManager({
    pages,
    activePage,
    onPageSelect,
    onPageAdd,
    onPageRemove,
    onPageRename
}) {
    const [isEditing, setIsEditing] = useState(null)
    const [editName, setEditName] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    const [newPageName, setNewPageName] = useState('')

    const handleStartEdit = (page) => {
        setIsEditing(page.id)
        setEditName(page.name)
    }

    const handleSaveEdit = (pageId) => {
        if (editName.trim()) {
            onPageRename?.(pageId, editName.trim())
        }
        setIsEditing(null)
        setEditName('')
    }

    const handleAddPage = () => {
        if (newPageName.trim()) {
            onPageAdd?.({ name: newPageName.trim() })
            setNewPageName('')
            setIsAdding(false)
        }
    }

    const getPageIcon = (page) => {
        if (page.isDefault) return Home
        switch (page.icon) {
            case 'grid': return LayoutGrid
            case 'settings': return Settings
            default: return FileText
        }
    }

    return (
        <div className="space-y-2">
            {/* Page List */}
            <div className="space-y-1">
                {pages.map((page) => {
                    const Icon = getPageIcon(page)
                    const isActive = page.id === activePage
                    const isEditingThis = isEditing === page.id

                    return (
                        <div
                            key={page.id}
                            className={cn(
                                'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors group',
                                isActive
                                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                                    : 'hover:bg-[hsl(var(--muted))]'
                            )}
                        >
                            <Icon className="h-4 w-4 shrink-0" />

                            {isEditingThis ? (
                                <div className="flex-1 flex items-center gap-1">
                                    <Input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSaveEdit(page.id)
                                            if (e.key === 'Escape') setIsEditing(null)
                                        }}
                                        className="h-6 text-sm"
                                        autoFocus
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6"
                                        onClick={() => handleSaveEdit(page.id)}
                                    >
                                        <Check className="h-3 w-3" />
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <button
                                        className="flex-1 text-left text-sm font-medium truncate"
                                        onClick={() => onPageSelect?.(page.id)}
                                    >
                                        {page.name}
                                    </button>

                                    {/* Actions */}
                                    <div className={cn(
                                        'flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
                                        isActive && 'opacity-100'
                                    )}>
                                        <button
                                            onClick={() => handleStartEdit(page)}
                                            className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
                                            title="Rename"
                                        >
                                            <Edit2 className="h-3 w-3" />
                                        </button>
                                        {!page.isDefault && (
                                            <button
                                                onClick={() => onPageRemove?.(page.id)}
                                                className="p-1 rounded hover:bg-red-500/20 text-red-500"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Add Page */}
            {isAdding ? (
                <div className="flex items-center gap-2 px-3 py-2">
                    <FileText className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                    <Input
                        value={newPageName}
                        onChange={(e) => setNewPageName(e.target.value)}
                        placeholder="Page name..."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddPage()
                            if (e.key === 'Escape') setIsAdding(false)
                        }}
                        className="h-7 text-sm"
                        autoFocus
                    />
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleAddPage}>
                        <Check className="h-3 w-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setIsAdding(false)}>
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            ) : (
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-[hsl(var(--muted-foreground))]"
                    onClick={() => setIsAdding(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Page
                </Button>
            )}
        </div>
    )
}
