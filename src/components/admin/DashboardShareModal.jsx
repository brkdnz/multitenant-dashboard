import { useState } from 'react'
import { Share2, Copy, Check, ExternalLink, Clock, Shield, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/**
 * Dashboard Share Modal Component
 * Generate and manage shareable links
 */
export default function DashboardShareModal({
    isOpen,
    onClose,
    shareToken,
    isGenerating,
    onGenerateLink,
    onRevokeLink
}) {
    const [copied, setCopied] = useState(false)
    const [options, setOptions] = useState({
        readOnly: true,
        expiresIn: null // null = never
    })

    const handleCopy = async () => {
        if (!shareToken?.url) return

        try {
            await navigator.clipboard.writeText(shareToken.url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (e) {
            console.error('Failed to copy:', e)
        }
    }

    const handleGenerate = () => {
        onGenerateLink?.(options)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <Card className="relative z-10 w-full max-w-md animate-in zoom-in-95 fade-in duration-200">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[hsl(var(--primary)/0.1)]">
                                <Share2 className="h-5 w-5 text-[hsl(var(--primary))]" />
                            </div>
                            <div>
                                <CardTitle>Share Dashboard</CardTitle>
                                <CardDescription>Create a shareable link</CardDescription>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {shareToken ? (
                        <>
                            {/* Share Link */}
                            <div className="space-y-2">
                                <Label>Share Link</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={shareToken.url}
                                        readOnly
                                        className="font-mono text-sm"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleCopy}
                                    >
                                        {copied ? (
                                            <Check className="h-4 w-4 text-emerald-500" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => window.open(shareToken.url, '_blank')}
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Link Info */}
                            <div className="p-3 rounded-lg bg-[hsl(var(--muted))] space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
                                    <Clock className="h-4 w-4" />
                                    <span>Created {new Date(shareToken.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
                                    <Shield className="h-4 w-4" />
                                    <span>Read-only access</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Options */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Read-only Access</Label>
                                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                            Viewers cannot edit the dashboard
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={options.readOnly}
                                        onChange={(e) => setOptions(prev => ({ ...prev, readOnly: e.target.checked }))}
                                        className="h-5 w-5 rounded"
                                    />
                                </div>

                                <div>
                                    <Label>Expiration</Label>
                                    <select
                                        value={options.expiresIn || ''}
                                        onChange={(e) => setOptions(prev => ({
                                            ...prev,
                                            expiresIn: e.target.value ? parseInt(e.target.value) : null
                                        }))}
                                        className="w-full mt-1 px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))]"
                                    >
                                        <option value="">Never expires</option>
                                        <option value="3600000">1 hour</option>
                                        <option value="86400000">24 hours</option>
                                        <option value="604800000">7 days</option>
                                        <option value="2592000000">30 days</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between border-t pt-4">
                    {shareToken ? (
                        <>
                            <Button variant="destructive" onClick={onRevokeLink}>
                                Revoke Link
                            </Button>
                            <Button onClick={onClose}>
                                Done
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button onClick={handleGenerate} disabled={isGenerating}>
                                <Share2 className="h-4 w-4 mr-2" />
                                {isGenerating ? 'Generating...' : 'Generate Link'}
                            </Button>
                        </>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
