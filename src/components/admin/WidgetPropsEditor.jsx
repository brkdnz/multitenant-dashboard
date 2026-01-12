import { useState, useCallback } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

/**
 * Widget Props Editor Component
 * Visual interface for editing widget properties
 * 
 * @param {object} props
 * @param {object} props.widget - Widget instance with props
 * @param {object} props.widgetDef - Widget definition from registry
 * @param {function} props.onSave - Callback when props are saved
 * @param {function} props.onClose - Callback to close editor
 */
export default function WidgetPropsEditor({ widget, widgetDef, onSave, onClose }) {
    const [editedProps, setEditedProps] = useState({ ...widget.props })

    const handleChange = useCallback((key, value) => {
        setEditedProps((prev) => ({
            ...prev,
            [key]: value,
        }))
    }, [])

    const handleSave = useCallback(() => {
        onSave?.(editedProps)
    }, [editedProps, onSave])

    const handleReset = useCallback(() => {
        setEditedProps({ ...widgetDef?.defaultProps })
    }, [widgetDef])

    // Infer field type from value
    const getFieldType = (value) => {
        if (typeof value === 'boolean') return 'boolean'
        if (typeof value === 'number') return 'number'
        if (Array.isArray(value)) return 'array'
        if (typeof value === 'object') return 'object'
        return 'string'
    }

    // Render field based on type
    const renderField = (key, value) => {
        const fieldType = getFieldType(widgetDef?.defaultProps?.[key] ?? value)

        switch (fieldType) {
            case 'boolean':
                return (
                    <Select
                        value={value ? 'true' : 'false'}
                        onValueChange={(v) => handleChange(key, v === 'true')}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">True</SelectItem>
                            <SelectItem value="false">False</SelectItem>
                        </SelectContent>
                    </Select>
                )

            case 'number':
                return (
                    <Input
                        type="number"
                        value={value ?? ''}
                        onChange={(e) => handleChange(key, parseFloat(e.target.value) || 0)}
                    />
                )

            case 'array':
            case 'object':
                return (
                    <textarea
                        className="min-h-[80px] w-full rounded-[var(--radius)] border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-sm font-mono"
                        value={JSON.stringify(value, null, 2)}
                        onChange={(e) => {
                            try {
                                handleChange(key, JSON.parse(e.target.value))
                            } catch {
                                // Invalid JSON, ignore
                            }
                        }}
                    />
                )

            default:
                return (
                    <Input
                        type="text"
                        value={value ?? ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                    />
                )
        }
    }

    const propKeys = Object.keys(widgetDef?.defaultProps || editedProps || {})

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Edit Widget Properties</CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {widgetDef?.title || widget.widgetId}
                </p>
            </CardHeader>

            <CardContent className="space-y-4">
                {propKeys.map((key) => (
                    <div key={key} className="space-y-2">
                        <Label className="text-sm font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        {renderField(key, editedProps[key])}
                    </div>
                ))}

                {propKeys.length === 0 && (
                    <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
                        No editable properties
                    </p>
                )}
            </CardContent>

            <CardFooter className="flex gap-2">
                <Button variant="outline" onClick={handleReset} className="flex-1">
                    Reset
                </Button>
                <Button onClick={handleSave} className="flex-1">
                    Save Changes
                </Button>
            </CardFooter>
        </Card>
    )
}
