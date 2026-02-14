'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { addRiderToPlan } from '../actions'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

export function AddRiderToPlanDialog({ planId }: { planId: string }) {
    const [open, setOpen] = useState(false)
    const [riders, setRiders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        if (open) {
            const fetchRiders = async () => {
                const { data } = await supabase.from('riders').select('*, companies(name)').order('name')
                setRiders(data || [])
                setLoading(false)
            }
            fetchRiders()
        }
    }, [open])

    const handleAdd = async (riderId: string) => {
        await addRiderToPlan(planId, riderId)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Add Rider
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] h-[400px] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Select Rider to Add</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto py-2">
                    {loading ? <p>Loading...</p> : (
                        <div className="space-y-2">
                            {riders.map(rider => (
                                <div key={rider.id} className="flex justify-between items-center p-2 border rounded hover:bg-gray-50 cursor-pointer" onClick={() => handleAdd(rider.id)}>
                                    <div>
                                        <div className="font-medium">{rider.name}</div>
                                        <div className="text-sm text-gray-500">{rider.companies?.name}</div>
                                    </div>
                                    <Button size="sm" variant="ghost">Add</Button>
                                </div>
                            ))}
                            {riders.length === 0 && <p>No riders available.</p>}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
