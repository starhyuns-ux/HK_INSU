import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, Trash2 } from 'lucide-react'
import { deleteComparison } from './actions'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createComparison } from './actions'

export default async function FeedPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: comparisons } = await supabase
        .from('comparisons')
        .select('*, comparison_items(count)')
        .order('created_at', { ascending: false })

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Comparison Feed</h1>
                    <p className="text-gray-500">Compare riders across different companies.</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <PlusCircle className="h-4 w-4" />
                            New Comparison
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create Comparison</DialogTitle>
                            <DialogDescription>Start a new comparison board.</DialogDescription>
                        </DialogHeader>
                        <form action={createComparison} className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">Title</Label>
                                <Input id="title" name="title" className="col-span-3" required placeholder="e.g. Cancer Rider Comparison" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">Category</Label>
                                <div className="col-span-3">
                                    <Select name="category" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cancer">Cancer</SelectItem>
                                            <SelectItem value="brain_heart">Brain/Heart</SelectItem>
                                            <SelectItem value="surgery">Surgery</SelectItem>
                                            <SelectItem value="hospitalization">Hospitalization</SelectItem>
                                            <SelectItem value="accident">Accident/Injury</SelectItem>
                                            <SelectItem value="dental">Dental</SelectItem>
                                            <SelectItem value="dementia">Dementia/Nursing</SelectItem>
                                            <SelectItem value="driver">Driver/Cost</SelectItem>
                                            <SelectItem value="child">Child/Prenatal</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Create</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comparisons?.map((comp) => (
                    <Card key={comp.id} className="group relative">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <Badge variant="outline" className="mb-2 capitalize">{comp.category}</Badge>
                                {user && user.id === comp.created_by && (
                                    <form action={deleteComparison.bind(null, comp.id)}>
                                        <Button variant="ghost" size="icon-xs" className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </form>
                                )}
                            </div>
                            <CardTitle className="text-xl">
                                <Link href={`/feed/${comp.id}`} className="hover:underline hover:text-blue-600">
                                    {comp.title}
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500">
                                {/* Accessing aggregate count from join is weird in Supabase typed client, assume raw returns it */}
                                {(comp as any).comparison_items?.[0]?.count ?? 0} items compared
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/feed/${comp.id}`} className="w-full">
                                <Button variant="secondary" className="w-full">View Comparison</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
                {(!comparisons || comparisons.length === 0) && (
                    <div className="col-span-full text-center py-12 text-gray-500 border border-dashed rounded-lg">
                        No comparisons yet. Create one to start comparing riders.
                    </div>
                )}
            </div>
        </div>
    )
}
