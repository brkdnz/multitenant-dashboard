import { cn } from '@/lib/utils'
import { FileText, Download, Eye, MoreVertical } from 'lucide-react'

/**
 * FileList Widget - Recent files/documents list
 */
export default function FileList({
    title = 'Recent Files',
    files = []
}) {
    const defaultFiles = [
        { name: 'Q4_Report.pdf', size: '2.4 MB', type: 'pdf', date: 'Today' },
        { name: 'Dashboard_Design.fig', size: '8.1 MB', type: 'figma', date: 'Yesterday' },
        { name: 'Data_Export.xlsx', size: '1.2 MB', type: 'excel', date: '2 days ago' },
        { name: 'Presentation.pptx', size: '5.6 MB', type: 'ppt', date: '3 days ago' },
    ]

    const items = files.length > 0 ? files : defaultFiles

    const typeIcons = {
        pdf: '📄',
        figma: '🎨',
        excel: '📊',
        ppt: '📽️',
        doc: '📝',
        image: '🖼️',
        default: '📁'
    }

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <h3 className="font-semibold text-[hsl(var(--foreground))]">{title}</h3>
            </div>

            <div className="flex-1 space-y-2">
                {items.map((file, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-[hsl(var(--muted)/0.5)] transition-colors group"
                    >
                        <span className="text-xl">{typeIcons[file.type] || typeIcons.default}</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate">
                                {file.name}
                            </p>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                {file.size} • {file.date}
                            </p>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[hsl(var(--muted))] rounded">
                            <Download className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
