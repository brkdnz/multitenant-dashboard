import { Keyboard, Command } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { getShortcutsByCategory } from '@/hooks/useKeyboardShortcuts'

const categoryLabels = {
    navigation: 'Navigation',
    actions: 'Actions',
    ui: 'User Interface',
    help: 'Help',
}

/**
 * Format shortcut for display
 */
function formatShortcut(shortcut) {
    return shortcut
        .split('+')
        .map((key) => {
            switch (key) {
                case 'ctrl':
                    return '⌘/Ctrl'
                case 'shift':
                    return '⇧'
                case 'alt':
                    return 'Alt'
                case 'escape':
                    return 'Esc'
                default:
                    return key.toUpperCase()
            }
        })
        .join(' + ')
}

/**
 * KeyboardShortcutsHelp Component
 * Display all available keyboard shortcuts
 */
export function KeyboardShortcutsHelp() {
    const shortcuts = getShortcutsByCategory()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--primary)/0.1)]">
                    <Keyboard className="h-6 w-6 text-[hsl(var(--primary))]" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">
                        Keyboard Shortcuts
                    </h2>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Quick actions for power users
                    </p>
                </div>
            </div>

            {/* Shortcuts by category */}
            <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(shortcuts).map(([category, items]) => (
                    <Card key={category}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">
                                {categoryLabels[category]}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {items.map((item) => (
                                    <div
                                        key={item.shortcut}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <span className="text-[hsl(var(--muted-foreground))]">
                                            {item.description}
                                        </span>
                                        <kbd className="inline-flex items-center gap-1 rounded border border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-2 py-0.5 font-mono text-xs text-[hsl(var(--foreground))]">
                                            {formatShortcut(item.shortcut)}
                                        </kbd>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tip */}
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)] p-4">
                <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                    <Command className="h-4 w-4" />
                    <span>
                        Press <kbd className="mx-1 rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-1.5 py-0.5 font-mono text-xs">?</kbd>
                        anywhere to show this help
                    </span>
                </div>
            </div>
        </div>
    )
}
