import { cn } from '@/lib/utils'

/**
 * SimpleTable Widget
 * Displays data in a clean table format with status indicators
 * 
 * @param {object} props
 * @param {string} props.title - Table title
 * @param {Array} props.columns - Column definitions [{ key, label }]
 * @param {Array} props.data - Row data
 */
export default function SimpleTable({ title, columns = [], data = [] }) {
    const defaultColumns = [
        { key: 'name', label: 'Name' },
        { key: 'status', label: 'Status' },
        { key: 'amount', label: 'Amount' },
    ]

    const defaultData = [
        { id: 1, name: 'Project Alpha', status: 'active', amount: '$4,200' },
        { id: 2, name: 'Project Beta', status: 'pending', amount: '$2,800' },
        { id: 3, name: 'Project Gamma', status: 'completed', amount: '$5,600' },
    ]

    const cols = columns.length > 0 ? columns : defaultColumns
    const rows = data.length > 0 ? data : defaultData

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
            case 'success':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
            case 'pending':
            case 'warning':
                return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
            case 'completed':
            case 'done':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
            case 'error':
            case 'failed':
                return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
            default:
                return 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'
        }
    }

    return (
        <div className="h-full flex flex-col p-4">
            {/* Header */}
            {title && (
                <h3 className="text-base font-semibold text-[hsl(var(--foreground))] mb-4">
                    {title}
                </h3>
            )}

            {/* Table */}
            <div className="flex-1 overflow-auto rounded-lg border border-[hsl(var(--border))]">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)]">
                            {cols.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-4 py-3 text-left font-semibold text-[hsl(var(--foreground))]"
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr
                                key={row.id || rowIndex}
                                className={cn(
                                    'border-b border-[hsl(var(--border))] last:border-0',
                                    'transition-colors hover:bg-[hsl(var(--muted)/0.3)]'
                                )}
                            >
                                {cols.map((col) => (
                                    <td
                                        key={col.key}
                                        className="px-4 py-3 text-[hsl(var(--foreground))]"
                                    >
                                        {col.key === 'status' ? (
                                            <span
                                                className={cn(
                                                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize',
                                                    getStatusStyle(row[col.key])
                                                )}
                                            >
                                                {row[col.key]}
                                            </span>
                                        ) : (
                                            <span className="truncate">{row[col.key]}</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {rows.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-[hsl(var(--muted-foreground))]">
                    No data available
                </div>
            )}
        </div>
    )
}
