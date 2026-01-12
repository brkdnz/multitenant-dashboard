import { cn } from '@/lib/utils'
import { Code } from 'lucide-react'

/**
 * CodeSnippet Widget - Display code with syntax
 */
export default function CodeSnippet({
    title = 'Code Example',
    language = 'javascript',
    code = ''
}) {
    const defaultCode = `function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return { success: true };
}

greet('World');`

    const displayCode = code || defaultCode

    return (
        <div className="h-full rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-[hsl(var(--muted)/0.5)] border-b border-[hsl(var(--border))]">
                <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                    <span className="text-sm font-medium text-[hsl(var(--foreground))]">{title}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                    {language}
                </span>
            </div>

            {/* Code */}
            <div className="flex-1 p-3 overflow-auto bg-gray-900">
                <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap">
                    {displayCode}
                </pre>
            </div>
        </div>
    )
}
