import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { AddRiderToPlanDialog } from './add-rider-dialog'
import { LimitEdit } from './limit-edit'
import { ShareButton } from '@/components/share-button'
import { removeRiderFromPlan } from '../actions'
import { Button } from '@/components/ui/button'
import { Trash2, ArrowLeft } from 'lucide-react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'

export default async function PlanDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { id } = await params

    const { data: plan } = await supabase.from('plans').select('*').eq('id', id).single()

    if (!plan) notFound()

    // Fetch Items with Rider info + User Limits
    // Joining rider_limits is fetching ALL rider_limits, but RLS restricts it to current user.
    const { data: items } = await supabase
        .from('plan_items')
        .select('*, riders(*, companies(name, logo_url), rider_limits(*))')
        .eq('plan_id', id)
        .order('sort_order')

    return (
        <div className="container mx-auto py-10 px-4">
            <Link href="/plans" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Plans
            </Link>

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{plan.name}</h1>
                    <p className="text-gray-500">{plan.description}</p>
                </div>
                <div className="flex gap-2">
                    <ShareButton type="plan" targetId={plan.id} />
                    <AddRiderToPlanDialog planId={plan.id} />
                </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-100/50">
                            <TableHead>Company</TableHead>
                            <TableHead>Rider</TableHead>
                            <TableHead className="w-[120px]">Max Amount</TableHead>
                            <TableHead className="w-[100px]">Age Range</TableHead>
                            <TableHead className="w-[120px]">Term</TableHead>
                            <TableHead className="w-[120px]">Waiting Period</TableHead>
                            <TableHead className="w-[150px]">Exclusions</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                                    No riders in this plan. Add one to start.
                                </TableCell>
                            </TableRow>
                        ) : (
                            items?.map((item: any) => {
                                const rider = item.riders
                                const limit = rider?.rider_limits?.[0] || {}
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {rider?.companies?.logo_url ? <img src={rider.companies.logo_url} className="h-6 w-auto" /> : null}
                                                <span className="text-sm font-medium">{rider?.companies?.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {rider?.name}
                                            {rider?.category && <div className="text-xs text-gray-400 capitalize">{rider.category}</div>}
                                        </TableCell>
                                        <TableCell>
                                            <LimitEdit riderId={rider.id} field="max_amount" defaultValue={limit.max_amount} placeholder="Limit" />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <LimitEdit riderId={rider.id} field="age_min" defaultValue={limit.age_min} placeholder="Min" />
                                                <span className="text-gray-400">-</span>
                                                <LimitEdit riderId={rider.id} field="age_max" defaultValue={limit.age_max} placeholder="Max" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <LimitEdit riderId={rider.id} field="term_options" defaultValue={limit.term_options} placeholder="20y/100y" />
                                        </TableCell>
                                        <TableCell>
                                            <LimitEdit riderId={rider.id} field="waiting_period" defaultValue={limit.waiting_period} placeholder="90d 50%" />
                                        </TableCell>
                                        <TableCell>
                                            <LimitEdit riderId={rider.id} field="exclusions" defaultValue={limit.exclusions} placeholder="Exclusions" />
                                        </TableCell>
                                        <TableCell>
                                            <form action={removeRiderFromPlan.bind(null, item.id, plan.id)}>
                                                <Button variant="ghost" size="icon-xs" className="text-gray-400 hover:text-red-500">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
