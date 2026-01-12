import { createContext, useContext, useCallback, useState } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable'
import { useStore } from '@/app/store'
import { useTenantContext } from '@/tenancy/TenantContext'

/**
 * Drag Context for sharing drag state
 */
const DragStateContext = createContext(null)

export function useDragState() {
    return useContext(DragStateContext)
}

/**
 * DragProvider Component
 * Provides dnd-kit context with sensors and event handling
 * 
 * @param {object} props
 * @param {string} props.pageId - Current page ID
 * @param {Array} props.items - Current widget items
 * @param {function} props.onReorder - Callback when items are reordered
 * @param {function} props.onDragStart - Callback when drag starts (for snap-to-grid)
 * @param {function} props.onDragEnd - Callback when drag ends
 * @param {React.ReactNode} props.children
 */
export function DragProvider({
    pageId,
    items = [],
    onReorder,
    onDragStart: onDragStartCallback,
    onDragEnd: onDragEndCallback,
    children
}) {
    const [activeId, setActiveId] = useState(null)
    const isDragEnabled = useStore((state) => state.isDragEnabled)

    // Check if drag is globally enabled
    const canDrag = isDragEnabled(pageId)

    // Configure sensors for mouse/touch and keyboard
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px movement before drag starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragStart = useCallback((event) => {
        setActiveId(event.active.id)
        onDragStartCallback?.()
    }, [onDragStartCallback])

    const handleDragEnd = useCallback(
        (event) => {
            const { active, over } = event

            setActiveId(null)
            onDragEndCallback?.()

            if (!over || active.id === over.id) {
                return
            }

            const oldIndex = items.findIndex((item) => item.id === active.id)
            const newIndex = items.findIndex((item) => item.id === over.id)

            if (oldIndex !== -1 && newIndex !== -1) {
                const newItems = arrayMove(items, oldIndex, newIndex)
                onReorder?.(newItems)
            }
        },
        [items, onReorder, onDragEndCallback]
    )

    const handleDragCancel = useCallback(() => {
        setActiveId(null)
        onDragEndCallback?.()
    }, [onDragEndCallback])

    // Get active item for overlay
    const activeItem = activeId ? items.find((item) => item.id === activeId) : null

    const contextValue = {
        activeId,
        activeItem,
        canDrag,
        pageId,
    }

    if (!canDrag) {
        // If drag is disabled, just render children without DnD context
        return (
            <DragStateContext.Provider value={contextValue}>
                {children}
            </DragStateContext.Provider>
        )
    }

    return (
        <DragStateContext.Provider value={contextValue}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <SortableContext
                    items={items.map((item) => item.id)}
                    strategy={rectSortingStrategy}
                >
                    {children}
                </SortableContext>
            </DndContext>
        </DragStateContext.Provider>
    )
}

/**
 * DroppableArea Component
 * Container for droppable widget area with grid layout
 */
export function DroppableArea({ children, className }) {
    const { canDrag } = useDragState() || {}

    return (
        <div
            className={className}
            data-droppable={canDrag ? 'true' : 'false'}
        >
            {children}
        </div>
    )
}
