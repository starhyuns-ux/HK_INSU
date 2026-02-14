'use client'

import { useState } from 'react'
import { createCompany } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

export function AddCompanyDialog() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Company</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Insurance Company</DialogTitle>
                    <DialogDescription>
                        Add a new insurance company to the system.
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={async (formData) => {
                        await createCompany(formData)
                        setOpen(false)
                    }}
                    className="grid gap-4 py-4"
                >
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" name="name" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="homepage_url" className="text-right">
                            Website
                        </Label>
                        <Input id="homepage_url" name="homepage_url" className="col-span-3" placeholder="https://..." />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="logo_url" className="text-right">
                            Logo URL
                        </Label>
                        <Input id="logo_url" name="logo_url" className="col-span-3" placeholder="https://..." />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
