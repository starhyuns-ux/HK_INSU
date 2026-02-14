import { createAdminClient } from '@/utils/supabase/admin'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default async function SharePage({ params }: { params: { token: string } }) {
    const supabase = createAdminClient()
    const { token } = await params

    // Verify token
    const { data: shareLink } = await supabase
        .from('share_links')
        .select('*')
        .eq('token', token)
        .eq('is_active', true)
        .single()

    if (!shareLink) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Card className="w-[400px]">
                    <CardHeader><CardTitle className="text-red-500">Invalid Link</CardTitle></CardHeader>
                    <CardContent>This shared link is invalid or has expired.</CardContent>
                </Card>
            </div>
        )
    }

    if (shareLink.type === 'comparison') {
        const { data: comp } = await supabase
            .from('comparisons')
            .select('*, comparison_items(*, riders(*, companies(*)))')
            .eq('id', shareLink.target_id)
            .single()

        if (!comp) notFound()

        const items = comp.comparison_items || []

        return (
            <div className="container mx-auto py-10 px-4">
                <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <Badge className="mb-2">Shared Comparison</Badge>
                    <h1 className="text-3xl font-bold">{comp.title}</h1>
                    <p className="text-gray-600 capitalize">Category: {comp.category}</p>
                </div>
                {/* Reusing table logic logic here, simpler version */}
                <div className="overflow-x-auto">
                    <Table className="min-w-[800px] border bg-white shadow-sm">
                        <TableHeader>
                            <TableRow className="bg-gray-100">
                                <TableHead className="w-[150px] font-bold">Feature</TableHead>
                                {items.map((item: any) => (
                                    <TableHead key={item.id} className="min-w-[250px] text-center">
                                        <div className="font-bold text-lg">{item.riders?.name}</div>
                                        <div className="text-xs text-gray-500">{item.riders?.companies?.name}</div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow><TableCell className="font-medium bg-gray-50">Summary</TableCell>{items.map((item: any) => <TableCell key={item.id}>{item.riders?.summary}</TableCell>)}</TableRow>
                            <TableRow><TableCell className="font-medium bg-gray-50">Pros</TableCell>{items.map((item: any) => <TableCell key={item.id} className="text-blue-700 whitespace-pre-wrap">{item.pros}</TableCell>)}</TableRow>
                            <TableRow><TableCell className="font-medium bg-gray-50">Cons</TableCell>{items.map((item: any) => <TableCell key={item.id} className="text-red-700 whitespace-pre-wrap">{item.cons}</TableCell>)}</TableRow>
                            <TableRow><TableCell className="font-medium bg-gray-50">Rationale</TableCell>{items.map((item: any) => <TableCell key={item.id} className="whitespace-pre-wrap">{item.rationale}</TableCell>)}</TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        )
    } else if (shareLink.type === 'plan') {
        const { data: plan } = await supabase
            .from('plans')
            .select('*, plan_items(*, riders(*, companies(*)))')
            .eq('id', shareLink.target_id)
            .single()

        if (!plan) notFound()

        // NOTE: Rider Limits are user specific. For shared plan, do we show the CREATOR's limits?
        // Yes, usually "Share my plan".
        // So we need to fetch rider_limits for the creator of the plan.
        // `plan.created_by`.

        const items = await Promise.all(plan.plan_items.map(async (item: any) => {
            const { data: limit } = await supabase
                .from('rider_limits')
                .select('*')
                .eq('rider_id', item.rider_id)
                .eq('created_by', plan.created_by)
                .single()
            return { ...item, limit }
        }))

        return (
            <div className="container mx-auto py-10 px-4">
                <div className="mb-8 p-4 bg-green-50 rounded-lg border border-green-100">
                    <Badge className="mb-2 bg-green-600">Shared Plan</Badge>
                    <h1 className="text-3xl font-bold">{plan.name}</h1>
                    <p className="text-gray-600">{plan.description}</p>
                </div>

                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-100/50">
                                <TableHead>Company</TableHead>
                                <TableHead>Rider</TableHead>
                                <TableHead>Max Amount</TableHead>
                                <TableHead>Age</TableHead>
                                <TableHead>Term</TableHead>
                                <TableHead>Exclusions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.riders?.companies?.name}</TableCell>
                                    <TableCell className="font-medium">{item.riders?.name}</TableCell>
                                    <TableCell>{item.limit?.max_amount || '-'}</TableCell>
                                    <TableCell>{item.limit?.age_min || 0} - {item.limit?.age_max || 100}</TableCell>
                                    <TableCell>{item.limit?.term_options || '-'}</TableCell>
                                    <TableCell>{item.limit?.exclusions || '-'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        )
    }

    return <div>Unknown share type</div>
}
