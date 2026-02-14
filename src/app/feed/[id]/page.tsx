import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import ComparisonTable from './comparison-table'
import { ShareButton } from '@/components/share-button'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default async function ComparisonViewPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: comp } = await supabase.from('comparisons').select('*').eq('id', id).single()

    if (!comp) notFound()

    return (
        <div className="container mx-auto py-10 px-4">
            <Link href="/feed" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Feed
            </Link>

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{comp.title}</h1>
                    <p className="text-gray-500 capitalize">Category: {comp.category}</p>
                </div>
                <div className="flex gap-2">
                    <ShareButton type="comparison" targetId={comp.id} />
                    <Link href={`/feed/${id}/edit`}>
                        <Button>Edit Comparison</Button>
                    </Link>
                </div>
            </div>

            <ComparisonTable comparisonId={id} editMode={false} />
        </div>
    )
}
