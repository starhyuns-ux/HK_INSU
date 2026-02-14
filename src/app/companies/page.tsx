import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { AddCompanyDialog } from './add-company-dialog'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Trash2 } from 'lucide-react'
import { deleteCompany } from './actions'

export default async function CompaniesPage() {
    const supabase = await createClient()
    const { data: companies } = await supabase.from('companies').select('*').order('name')

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Insurance Companies</h1>
                <AddCompanyDialog />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies?.map((company) => (
                    <Card key={company.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-bold">
                                <Link href={`/companies/${company.id}`} className="hover:underline">
                                    {company.name}
                                </Link>
                            </CardTitle>
                            {company.logo_url && (
                                <img src={company.logo_url} alt={company.name} className="h-8 w-auto object-contain" />
                            )}
                        </CardHeader>
                        <CardContent>
                            {company.homepage_url && (
                                <a
                                    href={company.homepage_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                                >
                                    Visit Website <ExternalLink className="h-3 w-3" />
                                </a>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Link href={`/companies/${company.id}`}>
                                <Button variant="outline" size="sm">View Riders</Button>
                            </Link>
                            <form action={deleteCompany.bind(null, company.id)}>
                                <Button variant="ghost" size="icon-sm" className="text-red-500 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardFooter>
                    </Card>
                ))}
                {(!companies || companies.length === 0) && (
                    <div className="col-span-full text-center text-gray-500 py-10">
                        No companies found. Add one to get started.
                    </div>
                )}
            </div>
        </div>
    )
}
