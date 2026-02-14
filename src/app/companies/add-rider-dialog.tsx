'use client'

import { useState } from 'react'
import { createRider } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AddRiderDialog({ companyId }: { companyId: string }) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Rider</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add New Rider</DialogTitle>
                    <DialogDescription>
                        Add a specific rider/contract to this company.
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={async (formData) => {
                        await createRider(companyId, formData)
                        setOpen(false)
                    }}
                    className="grid gap-4 py-4"
                >
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" name="name" className="col-span-3" required placeholder="e.g. Cancer Care 100" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Category</Label>
                        <div className="col-span-3">
                            <Select name="category" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cancer">Cancer</SelectItem>
                                    <SelectItem value="brain_heart">Brain/Heart</SelectItem>
                                    <SelectItem value="surgery">Surgery</SelectItem>
                                    <SelectItem value="hospitalization">Hospitalization</SelectItem>
                                    <SelectItem value="accident">Accident/Injury</SelectItem>
                                    <SelectItem value="dental">Dental</SelectItem>
                                    <SelectItem value="dementia">Dementia/Nursing</SelectItem>
                                    <SelectItem value="driver">Driver/Cost</SelectItem>
                                    <SelectItem value="child">Child/Prenatal</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="summary" className="text-right">Summary</Label>
                        <Textarea id="summary" name="summary" className="col-span-3" placeholder="Brief coverage summary..." />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">Notes/Exclusions</Label>
                        <Textarea id="notes" name="notes" className="col-span-3" placeholder="Exclusions, reduction periods..." />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="source_url" className="text-right">Source URL</Label>
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
