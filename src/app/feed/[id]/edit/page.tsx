import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import ComparisonTable from '../comparison-table'
import { AddRiderToComparisonDialog } from '../add-rider-dialog'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Share2 } from 'lucide-react'
import { ShareButton } from '@/components/share-button'

export default async function ComparisonEditPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: comp } = await supabase.from('comparisons').select('*').eq('id', id).single()

    if (!comp) notFound()

    return (
        <div className="container mx-auto py-10 px-4">
            <Link href={`/feed/${id}`} className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to View
            </Link>

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Edit Comparison</h1>
                    <p className="text-gray-500">{comp.title}</p>
                </div>
                <div className="flex gap-2">
                    <ShareButton type="comparison" targetId={comp.id} />
                    <AddRiderToComparisonDialog comparisonId={id} />
                </div>
            </div>

            <ComparisonTable comparisonId={id} editMode={true} />
        </div>
    )
}
