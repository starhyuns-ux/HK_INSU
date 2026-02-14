import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { createPlan } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { PlusCircle } from 'lucide-react'
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

export default async function PlansPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return <div>Please login to view plans</div>

    const { data: plans } = await supabase
        .from('plans')
        .select('*, plan_items(count)')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Plans</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><PlusCircle className="h-4 w-4" /> New Plan</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Create New Plan</DialogTitle></DialogHeader>
                        <form action={createPlan} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Plan Name</Label>
                                <Input id="name" name="name" required placeholder="e.g. Comprehensive Family Plan" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Input id="description" name="description" placeholder="Notes about this plan..." />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Create Plan</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans?.map((plan) => (
                    <Card key={plan.id}>
                        <CardHeader>
                            <CardTitle className="text-xl">
                                <Link href={`/plans/${plan.id}`} className="hover:underline">{plan.name}</Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500 text-sm">{plan.description || 'No description'}</p>
                            <p className="text-xs text-gray-400 mt-2">
                                {(plan as any).plan_items?.[0]?.count ?? 0} riders included
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild variant="secondary" className="w-full">
                                <Link href={`/plans/${plan.id}`}>View & Edit</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
                {(!plans || plans.length === 0) && (
                    <div className="col-span-full text-center py-12 text-gray-500 border border-dashed rounded-lg">
                        No plans created yet. Start by creating a plan.
                    </div>
                )}
            </div>
        </div>
    )
}
