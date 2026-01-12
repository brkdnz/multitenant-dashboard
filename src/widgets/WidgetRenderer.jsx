import { Suspense } from 'react'
import { getWidget } from './registry'
import { WidgetErrorBoundary } from '@/components/ErrorBoundary'
import { SkeletonWidget } from '@/components/ui/skeleton'

/**
 * WidgetRenderer Component
 * Dynamically renders a widget based on its ID from the registry
 * Wrapped with error boundary for crash isolation
 * Uses Suspense for lazy loading widgets
 * 
 * @param {object} props
 * @param {string} props.widgetId - Widget type ID from registry
 * @param {object} props.widgetProps - Props to pass to the widget
 */
export function WidgetRenderer({ widgetId, widgetProps = {} }) {
    const widget = getWidget(widgetId)

    if (!widget) {
        return (
            <div className="flex h-full items-center justify-center rounded-[var(--radius)] border border-dashed border-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.1)] p-4">
                <p className="text-sm text-[hsl(var(--destructive))]">
                    Widget "{widgetId}" not found
                </p>
            </div>
        )
    }

    const Component = widget.component

    if (!Component) {
        return (
            <div className="flex h-full items-center justify-center rounded-[var(--radius)] border border-dashed border-[hsl(var(--muted))] p-4">
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    No component defined for "{widgetId}"
                </p>
            </div>
        )
    }

    // Merge default props with instance props
    const mergedProps = {
        ...widget.defaultProps,
        ...widgetProps,
    }

    // Wrap with error boundary for crash isolation and Suspense for lazy loading
    return (
        <WidgetErrorBoundary widgetId={widgetId}>
            <Suspense fallback={<SkeletonWidget />}>
                <Component {...mergedProps} />
            </Suspense>
        </WidgetErrorBoundary>
    )
}
