import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, FileText, Scale, ArrowRight, Shield } from 'lucide-react'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let recentPlans = []
  let recentComparisons = []

  if (user) {
    const { data: plans } = await supabase
      .from('plans')
      .select('*')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false })
      .limit(3)
    recentPlans = plans || []

    const { data: comps } = await supabase
      .from('comparisons')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3)
    recentComparisons = comps || []
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-blue-900">
          Insurance Planning Simplified
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Manage company riders, compare contracts, and build personalized insurance plans for your clients.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" /> Companies
            </CardTitle>
            <CardDescription>Manage insurance companies and riders</CardDescription>
          </CardHeader>
          <CardContent>
            Access the database of insurance companies and their specific contract details.
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/companies">View Companies</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-green-600" /> Comparison Feed
            </CardTitle>
            <CardDescription>Compare riders side-by-side</CardDescription>
          </CardHeader>
          <CardContent>
            View and create comparison boards to analyze pros and cons of different riders.
          </CardContent>
          <CardFooter>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/feed">Go to Feed</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" /> My Plans
            </CardTitle>
            <CardDescription>Build and mix custom plans</CardDescription>
          </CardHeader>
          <CardContent>
            Create comprehensive insurance plans by combining riders from multiple companies.
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/plans">Manage Plans</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {user ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6" /> Recent Plans
            </h2>
            <div className="space-y-4">
              {recentPlans.length > 0 ? recentPlans.map((plan: any) => (
                <div key={plan.id} className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
                  <div>
                    <div className="font-medium">{plan.name}</div>
                    <div className="text-sm text-gray-500">{new Date(plan.created_at).toLocaleDateString()}</div>
                  </div>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/plans/${plan.id}`}>Edit <ArrowRight className="ml-1 h-3 w-3" /></Link>
                  </Button>
                </div>
              )) : (
                <p className="text-gray-500 italic">No plans created yet.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Scale className="h-6 w-6" /> Recent Comparisons
            </h2>
            <div className="space-y-4">
              {recentComparisons.length > 0 ? recentComparisons.map((comp: any) => (
                <div key={comp.id} className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
                  <div>
                    <div className="font-medium">{comp.title}</div>
                    <div className="text-sm text-gray-500 capitalize">{comp.category}</div>
                  </div>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/feed/${comp.id}`}>View <ArrowRight className="ml-1 h-3 w-3" /></Link>
                  </Button>
                </div>
              )) : (
                <p className="text-gray-500 italic">No comparisons available.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Sign in to manage your work</h2>
          <p className="text-gray-600 mb-6">Create an account or login to save your plans and comparisons.</p>
          <Button asChild size="lg">
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
