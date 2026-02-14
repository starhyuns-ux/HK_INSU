'use client'

import { useState } from 'react'
import { createShareLink } from '@/app/share/actions'
import { Button } from '@/components/ui/button'
import { Share2, Copy, Check } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ShareButton({ type, targetId }: { type: 'plan' | 'comparison', targetId: string }) {
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleGenerate = async () => {
        setLoading(true)
        const res = await createShareLink(type, targetId)
        if (res.token) {
            setToken(res.token)
        }
        setLoading(false)
    }

    const shareUrl = token ? `${window.location.origin}/share/${token}` : ''

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2" onClick={() => !token && handleGenerate()}>
                    <Share2 className="h-4 w-4" /> Share
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share Public Link</DialogTitle>
                    <DialogDescription>
                        Anyone with this link can view this {type}.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 mt-4">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">Link</Label>
                        <Input id="link" value={loading ? 'Generating...' : shareUrl} readOnly />
                    </div>
                    <Button size="sm" className="px-3" onClick={handleCopy} disabled={!token || loading}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span className="sr-only">Copy</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
