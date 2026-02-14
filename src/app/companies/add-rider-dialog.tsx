'use client'

import { useState } from 'react'
import { createRider } from './actions'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlusCircle } from 'lucide-react'

const CATEGORIES = [
    { value: 'cancer', label: 'Cancer' },
    { value: 'brain_heart', label: 'Brain/Heart' },
    { value: 'injury', label: 'Injury' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'hospitalization', label: 'Hospitalization' },
    { value: 'driver', label: 'Driver' },
    { value: 'dementia', label: 'Dementia' },
    { value: 'other', label: 'Other' },
]

export function AddRiderDialog({ companyId }: { companyId: string }) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2"><PlusCircle className="h-4 w-4" /> Add Rider</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Rider</DialogTitle>
                </DialogHeader>
                <form action={async (formData) => {
                    await createRider(companyId, formData)
                    setOpen(false)
                }} className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" name="name" className="col-span-3" required placeholder="e.g. Cancer Care 100" />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Category</Label>
                        <div className="col-span-3">
                            <Select name="category" defaultValue="other">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="summary" className="text-right">Summary</Label>
                        <Textarea id="summary" name="summary" className="col-span-3" placeholder="Brief description of coverage..." />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">Notes</Label>
                        <Textarea id="notes" name="notes" className="col-span-3" placeholder="Exclusions, waiting periods, etc." />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="source_url" className="text-right">URL</Label>
                        <Input id="source_url" name="source_url" className="col-span-3" placeholder="https://..." />
                    </div>

                    <DialogFooter>
                        <Button type="submit">Save Rider</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
