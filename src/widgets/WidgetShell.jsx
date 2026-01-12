import { forwardRef, useState, useCallback } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X, Settings, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/app/store'
import { useFeatureFlags } from '@/hooks/useFeatureFlag'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/**
 * WidgetShell Component
 * Wrapper for widgets that provides drag handles, resize, and controls
 */
const WidgetShell = forwardRef(function WidgetShell(
    {
        id,
        pageId,
        widgetId,
        isDraggable = true,
        position = {},
        widgetProps = {},
        onRemove,
        onUpdate,
        children,
        className,
        ...props
    },
    ref
) {
    const isDragEnabled = useStore((state) => state.isDragEnabled)
    const flags = useFeatureFlags(['widgetDrag', 'widgetResize', 'widgetCustomProps'])

    const canDrag = isDraggable && flags.widgetDrag && isDragEnabled(pageId, id)
    const canResize = flags.widgetResize
    const canEditProps = flags.widgetCustomProps

    const [showPropsEditor, setShowPropsEditor] = useState(false)
    const [showResizeDialog, setShowResizeDialog] = useState(false)
    const [editedProps, setEditedProps] = useState(widgetProps)
    const [editedSize, setEditedSize] = useState({
        width: position.width || 6,
        height: position.height || 1,
    })

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id,
        disabled: !canDrag,
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const handleSaveProps = useCallback(() => {
        if (onUpdate) {
            onUpdate({ props: editedProps })
        }
        setShowPropsEditor(false)
    }, [editedProps, onUpdate])

    const handleSaveSize = useCallback(() => {
        if (onUpdate) {
            onUpdate({
                position: {
                    ...position,
                    width: Math.min(12, Math.max(1, editedSize.width)),
                    height: Math.max(1, editedSize.height),
                }
            })
        }
        setShowResizeDialog(false)
    }, [editedSize, position, onUpdate])

    // Show controls only when dragging is enabled or other features are available
    const showControls = canDrag || canResize || canEditProps || onRemove

    return (
        <>
            <div
                ref={(node) => {
                    setNodeRef(node)
                    if (typeof ref === 'function') {
                        ref(node)
                    } else if (ref) {
                        ref.current = node
                    }
                }}
                style={style}
                className={cn(
                    'group relative h-full rounded-[var(--radius)] transition-shadow',
                    isDragging && 'z-50 shadow-2xl opacity-90',
                    className
                )}
                {...props}
            >
                {/* Control Bar */}
                {showControls && (
                    <div
                        className={cn(
                            'absolute -top-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-2 py-1 opacity-0 shadow-sm transition-opacity group-hover:opacity-100',
                            isDragging && 'opacity-100'
                        )}
                    >
                        {/* Drag Handle */}
                        {canDrag && (
                            <button
                                {...attributes}
                                {...listeners}
                                className="cursor-grab touch-none rounded p-1 hover:bg-[hsl(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] active:cursor-grabbing"
                                aria-label="Drag to reorder"
                            >
                                <GripVertical className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                            </button>
                        )}

                        {/* Resize Button */}
                        {canResize && onUpdate && (
                            <button
                                onClick={() => setShowResizeDialog(true)}
                                className="rounded p-1 hover:bg-[hsl(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                                aria-label="Resize widget"
                            >
                                <Maximize2 className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                            </button>
                        )}

                        {/* Settings Button */}
                        {canEditProps && onUpdate && (
                            <button
                                onClick={() => {
                                    setEditedProps(widgetProps)
                                    setShowPropsEditor(true)
                                }}
                                className="rounded p-1 hover:bg-[hsl(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                                aria-label="Widget settings"
                            >
                                <Settings className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                            </button>
                        )}

                        {/* Remove Button */}
                        {onRemove && (
                            <button
                                onClick={onRemove}
                                className="rounded p-1 hover:bg-[hsl(var(--destructive)/0.1)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                                aria-label="Remove widget"
                            >
                                <X className="h-4 w-4 text-[hsl(var(--destructive))]" />
                            </button>
                        )}
                    </div>
                )}

                {/* Widget Content */}
                <div className="h-full">{children}</div>
            </div>

            {/* Props Editor Dialog */}
            <Dialog open={showPropsEditor} onOpenChange={setShowPropsEditor}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Widget Properties</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {Object.entries(editedProps).map(([key, value]) => (
                            <div key={key} className="space-y-2">
                                <Label htmlFor={key}>{key}</Label>
                                {typeof value === 'object' ? (
                                    <textarea
                                        id={key}
                                        value={JSON.stringify(value, null, 2)}
                                        onChange={(e) => {
                                            try {
                                                const parsed = JSON.parse(e.target.value)
                                                setEditedProps(prev => ({ ...prev, [key]: parsed }))
                                            } catch {
                                                // Invalid JSON, ignore
                                            }
                                        }}
                                        className="w-full h-24 p-2 border rounded-md text-sm font-mono bg-[hsl(var(--muted))]"
                                    />
                                ) : (
                                    <Input
                                        id={key}
                                        value={value}
                                        onChange={(e) => setEditedProps(prev => ({ ...prev, [key]: e.target.value }))}
                                    />
                                )}
                            </div>
                        ))}
                        {Object.keys(editedProps).length === 0 && (
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                No editable properties for this widget.
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowPropsEditor(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveProps}>
                            Save
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Resize Dialog */}
            <Dialog open={showResizeDialog} onOpenChange={setShowResizeDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Resize Widget</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="width">Width (1-12 columns)</Label>
                            <Input
                                id="width"
                                type="number"
                                min={1}
                                max={12}
                                value={editedSize.width}
                                onChange={(e) => setEditedSize(prev => ({ ...prev, width: parseInt(e.target.value) || 1 }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="height">Height (rows)</Label>
                            <Input
                                id="height"
                                type="number"
                                min={1}
                                max={6}
                                value={editedSize.height}
                                onChange={(e) => setEditedSize(prev => ({ ...prev, height: parseInt(e.target.value) || 1 }))}
                            />
                        </div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))]">
                            Preview: {editedSize.width}/12 columns × {editedSize.height} row(s)
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowResizeDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveSize}>
                            Apply
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
})

export { WidgetShell }
