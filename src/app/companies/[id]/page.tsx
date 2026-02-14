import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { AddRiderDialog } from '../add-rider-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ExternalLink, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { deleteRider } from '../actions'

// Need to define params type for Next.js 15
interface PageProps {
    params: Promise<{ id: string }>
}

export default async function CompanyDetailPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()

    const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single()

    if (companyError || !company) {
        notFound()
    }

    const { data: riders } = await supabase
        .from('riders')
        .select('*')
        .eq('company_id', id)
        .order('created_at', { ascending: false })

    return (
        <div className="container mx-auto py-10 px-4">
            <Link href="/companies" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Companies
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                    {company.logo_url && (
                        <img src={company.logo_url} alt={company.name} className="h-16 w-16 object-contain bg-white rounded-lg p-2 shadow-sm" />
                    )}
                    <div>
                        <h1 className="text-3xl font-bold">{company.name}</h1>
                        {company.homepage_url && (
                            <a href={company.homepage_url} target="_blank" className="text-blue-500 hover:underline flex items-center gap-1 text-sm mt-1">
                                Official Website <ExternalLink className="h-3 w-3" />
                            </a>
                        )}
                    </div>
                </div>
                <AddRiderDialog companyId={company.id} />
            </div>

            <div className="grid gap-6">
                {riders?.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
                        <p className="text-gray-500">No riders added yet.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-100/50">
                                    <TableHead className="w-[150px]">Category</TableHead>
                                    <TableHead className="w-[200px]">Rider Name</TableHead>
                                    <TableHead>Summary</TableHead>
                                    <TableHead>Notes</TableHead>
                                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {riders?.map((rider) => (
                                    <TableRow key={rider.id}>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">{rider.category}</Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {rider.name}
                                            {rider.source_url && (
                                                <a href={rider.source_url} target="_blank" className="ml-2 inline-block text-blue-500 hover:text-blue-700">
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-600 font-light text-sm">{rider.summary}</TableCell>
                                        <TableCell className="text-gray-500 text-xs">{rider.notes}</TableCell>
                                        <TableCell className="text-right">
                                            <form action={deleteRider.bind(null, rider.id, company.id)}>
                                                <Button variant="ghost" size="icon-sm" className="text-gray-400 hover:text-red-500 bg-transparent hover:bg-transparent p-0 h-auto">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    )
}
