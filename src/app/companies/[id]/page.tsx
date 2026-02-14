import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { AddRiderDialog } from '../add-rider-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ExternalLink, Trash2 } from 'lucide-react'
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {riders?.map((rider) => (
                            <Card key={rider.id}>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Badge variant="secondary" className="mb-2 capitalize">{rider.category}</Badge>
                                            <CardTitle className="text-lg">{rider.name}</CardTitle>
                                        </div>
                                        <form action={deleteRider.bind(null, rider.id, company.id)}>
                                            <Button variant="ghost" size="icon-xs" className="text-gray-400 hover:text-red-500">
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </form>
                                    </div>
                                </CardHeader>
                                <CardContent className="text-sm space-y-2">
                                    {rider.summary && (
                                        <p className="text-gray-700"><strong>Summary:</strong> {rider.summary}</p>
                                    )}
                                    {rider.notes && (
                                        <p className="text-gray-500"><strong>Notes:</strong> {rider.notes}</p>
                                    )}
                                    {rider.source_url && (
                                        <a href={rider.source_url} target="_blank" className="text-blue-500 hover:underline text-xs flex items-center gap-1 mt-2">
                                            Source <ExternalLink className="h-3 w-3" />
                                        </a>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
