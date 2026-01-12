import * as React from 'react'
import {
    defaultDropAnimation,
    defaultDropAnimationSideEffects,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    arrayMove,
    rectSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'

/**
 * Sortable Item Context
 */
const SortableItemContext = React.createContext({
    attributes: {},
    listeners: undefined,
    isDragging: false,
    disabled: false,
})

/**
 * Sortable Context for sharing state
 */
const SortableStateContext = React.createContext({
    activeId: null,
    items: [],
})

/**
 * Drop animation configuration with side effects
 */
const dropAnimationConfig = {
    ...defaultDropAnimation,
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.4',
            },
        },
    }),
}

/**
 * Sortable Component
 * Provides drag-and-drop sorting functionality for a list of items
 * 
 * @param {object} props
 * @param {Array} props.value - Array of items to sort
 * @param {function} props.onValueChange - Callback when order changes
 * @param {function} props.getItemValue - Function to get unique ID from item
 * @param {string} props.strategy - Sorting strategy: 'vertical', 'horizontal', 'grid'
 * @param {function} props.onMove - Optional custom move handler
 * @param {function} props.onDragStart - Optional drag start callback
 * @param {function} props.onDragEnd - Optional drag end callback
 */
function Sortable({
    value,
    onValueChange,
    getItemValue,
    children,
    className,
    onMove,
    strategy = 'vertical',
    onDragStart,
    onDragEnd,
    disabled = false,
}) {
    const [activeId, setActiveId] = React.useState(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    const handleDragStart = React.useCallback(
        (event) => {
            setActiveId(event.active.id)
            onDragStart?.(event)
        },
        [onDragStart],
    )

    const handleDragEnd = React.useCallback(
        (event) => {
            const { active, over } = event
            setActiveId(null)
            onDragEnd?.(event)

            if (!over) return

            const activeIndex = value.findIndex(
                (item) => getItemValue(item) === active.id,
            )
            const overIndex = value.findIndex(
                (item) => getItemValue(item) === over.id,
            )

            if (activeIndex !== overIndex && activeIndex !== -1 && overIndex !== -1) {
                if (onMove) {
                    onMove({ event, activeIndex, overIndex })
                } else {
                    const newValue = arrayMove(value, activeIndex, overIndex)
                    onValueChange(newValue)
                }
            }
        },
        [value, getItemValue, onValueChange, onMove, onDragEnd],
    )

    const handleDragCancel = React.useCallback(() => {
        setActiveId(null)
    }, [])

    const getStrategy = () => {
        switch (strategy) {
            case 'horizontal':
            case 'grid':
                return rectSortingStrategy
            case 'vertical':
            default:
                return verticalListSortingStrategy
        }
    }

    const itemIds = React.useMemo(
        () => value.map(getItemValue),
        [value, getItemValue],
    )

    const contextValue = React.useMemo(
        () => ({
            activeId,
            items: value,
            getItemValue,
        }),
        [activeId, value, getItemValue],
    )

    if (disabled) {
        return (
            <SortableStateContext.Provider value={contextValue}>
                <div data-slot="sortable" className={cn(className)}>
                    {children}
                </div>
            </SortableStateContext.Provider>
        )
    }

    return (
        <SortableStateContext.Provider value={contextValue}>
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <SortableContext items={itemIds} strategy={getStrategy()}>
                    <div
                        data-slot="sortable"
                        data-dragging={activeId !== null}
                        className={cn(className)}
                    >
                        {children}
                    </div>
                </SortableContext>
            </DndContext>
        </SortableStateContext.Provider>
    )
}

/**
 * Sortable Item Component
 * Wrapper for individual sortable items
 */
function SortableItem({
    value,
    asChild = false,
    className,
    children,
    disabled,
}) {
    const {
        setNodeRef,
        transform,
        transition,
        attributes,
        listeners,
        isDragging: isSortableDragging,
    } = useSortable({
        id: value,
        disabled,
    })

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    }

    return (
        <SortableItemContext.Provider
            value={{
                attributes,
                listeners,
                isDragging: isSortableDragging,
                disabled
            }}
        >
            <div
                data-slot="sortable-item"
                data-value={value}
                data-dragging={isSortableDragging}
                data-disabled={disabled}
                ref={setNodeRef}
                style={style}
                className={cn(
                    'transition-transform',
                    isSortableDragging && 'relative z-50 opacity-50 scale-[1.02]',
                    disabled && 'opacity-50 cursor-not-allowed',
                    className,
                )}
            >
                {children}
            </div>
        </SortableItemContext.Provider>
    )
}

/**
 * Sortable Item Handle Component
 * Provides drag handle for sortable items
 */
function SortableItemHandle({
    asChild,
    className,
    children,
    cursor = true
}) {
    const { attributes, listeners, isDragging, disabled } = React.useContext(SortableItemContext)

    return (
        <div
            data-slot="sortable-item-handle"
            data-dragging={isDragging}
            data-disabled={disabled}
            {...attributes}
            {...listeners}
            className={cn(
                'touch-none select-none',
                cursor && !disabled && (isDragging ? 'cursor-grabbing' : 'cursor-grab'),
                disabled && 'cursor-not-allowed',
                className,
            )}
        >
            {children}
        </div>
    )
}

/**
 * Sortable Overlay Component
 * Renders the dragged item overlay
 */
function SortableOverlay({ children, className }) {
    const { activeId, items, getItemValue } = React.useContext(SortableStateContext)
    const [dimensions, setDimensions] = React.useState(null)

    React.useEffect(() => {
        if (activeId) {
            const element = document.querySelector(
                `[data-slot="sortable-item"][data-value="${activeId}"]`,
            )
            if (element) {
                const rect = element.getBoundingClientRect()
                setDimensions({ width: rect.width, height: rect.height })
            }
        } else {
            setDimensions(null)
        }
    }, [activeId])

    const style = {
        width: dimensions?.width,
        height: dimensions?.height,
    }

    const content = React.useMemo(() => {
        if (!activeId) return null
        if (typeof children === 'function') {
            const activeItem = items?.find((item) => getItemValue?.(item) === activeId)
            return children({ value: activeId, item: activeItem })
        }
        return children
    }, [activeId, children, items, getItemValue])

    return (
        <DragOverlay dropAnimation={dropAnimationConfig}>
            {content && (
                <div
                    data-slot="sortable-overlay"
                    data-dragging={true}
                    style={style}
                    className={cn(
                        'pointer-events-none cursor-grabbing',
                        'rounded-[var(--radius)] shadow-2xl ring-2 ring-[hsl(var(--primary))]',
                        className,
                    )}
                >
                    {content}
                </div>
            )}
        </DragOverlay>
    )
}

/**
 * Hook to access sortable item context
 */
function useSortableItem() {
    return React.useContext(SortableItemContext)
}

/**
 * Hook to access sortable state
 */
function useSortableState() {
    return React.useContext(SortableStateContext)
}

export {
    Sortable,
    SortableItem,
    SortableItemHandle,
    SortableOverlay,
    useSortableItem,
    useSortableState,
}
