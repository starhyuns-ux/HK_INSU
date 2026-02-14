import { createClient } from '@/utils/supabase/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ComparisonTable({ comparisonId, editMode = false }: { comparisonId: string, editMode?: boolean }) {
    const supabase = await createClient()

    const { data: comp } = await supabase
        .from('comparisons')
        .select('*, comparison_items(*, riders(*, companies(name, logo_url)))')
        .eq('id', comparisonId)
        .single()

    if (!comp) return <div>Comparison not found</div>

    const items = comp.comparison_items || []

    if (items.length === 0) {
        return <div className="text-center py-10 text-gray-500">No riders in this comparison yet.</div>
    }

    return (
        <div className="overflow-x-auto">
            <Table className="min-w-[800px] border">
                <TableHeader>
                    <TableRow className="bg-gray-100">
                        <TableHead className="w-[150px] font-bold">Feature</TableHead>
                        {items.map((item: any) => (
                            <TableHead key={item.id} className="min-w-[250px]">
                                <div className="flex flex-col items-center py-4">
                                    {item.riders?.companies?.logo_url && (
                                        <img src={item.riders.companies.logo_url} className="h-8 w-auto mb-2" alt="logo" />
                                    )}
                                    <span className="text-xs text-gray-500">{item.riders?.companies?.name}</span>
                                    <span className="font-bold text-lg text-center leading-tight">{item.riders?.name}</span>
                                </div>
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium bg-gray-50">Summary</TableCell>
                        {items.map((item: any) => (
                            <TableCell key={item.id} className="align-top">
                                <p className="text-sm">{item.riders?.summary || '-'}</p>
                            </TableCell>
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium bg-gray-50">Pros</TableCell>
                        {items.map((item: any) => (
                            <TableCell key={item.id} className="align-top text-blue-700 bg-blue-50/30">
                                {editMode ? (
                                    <EditArea itemId={item.id} field="pros" defaultValue={item.pros} />
                                ) : (
                                    <p className="text-sm whitespace-pre-wrap">{item.pros || '-'}</p>
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium bg-gray-50">Cons</TableCell>
                        {items.map((item: any) => (
                            <TableCell key={item.id} className="align-top text-red-700 bg-red-50/30">
                                {editMode ? (
                                    <EditArea itemId={item.id} field="cons" defaultValue={item.cons} />
                                ) : (
                                    <p className="text-sm whitespace-pre-wrap">{item.cons || '-'}</p>
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium bg-gray-50">Rationale</TableCell>
                        {items.map((item: any) => (
                            <TableCell key={item.id} className="align-top">
                                {editMode ? (
                                    <EditArea itemId={item.id} field="rationale" defaultValue={item.rationale} />
                                ) : (
                                    <p className="text-sm whitespace-pre-wrap">{item.rationale || '-'}</p>
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}

// Helper client component for inline editing would be better, but for MVP let's use a server component that renders a form... 
// actually form inside table cell is tricky.
// Let's make a Client Component for the Edit Area.
import { EditArea } from '@/app/feed/[id]/edit-area'
