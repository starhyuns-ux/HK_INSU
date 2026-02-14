import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ComparisonEditPage({ params }: { params: { id: string } }) {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold">Edit Comparison {params.id}</h1>
            <p>Here you will be able to add riders and compare them.</p>
            <Link href="/feed">
                <Button variant="outline" className="mt-4">Back to Feed</Button>
            </Link>
        </div>
    )
}
