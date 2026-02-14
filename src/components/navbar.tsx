import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { signout } from '@/app/login/actions'
import { ShieldCheck } from 'lucide-react'

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <nav className="flex items-center justify-between border-b px-6 py-4 bg-white">
            <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
                    <ShieldCheck className="h-6 w-6" />
                    <span>HK InsuPlan</span>
                </Link>
                {user && (
                    <div className="hidden md:flex gap-6 ml-8 text-sm font-medium text-gray-600">
                        <Link href="/companies" className="hover:text-blue-600">Companies</Link>
                        <Link href="/feed" className="hover:text-blue-600">Comparison Feed</Link>
                        <Link href="/plans" className="hover:text-blue-600">My Plans</Link>
                    </div>
                )}
            </div>
            <div>
                {user ? (
                    <form action={signout}>
                        <Button variant="ghost">Sign Out</Button>
                    </form>
                ) : (
                    <Button asChild>
                        <Link href="/login">Sign In</Link>
                    </Button>
                )}
            </div>
        </nav>
    )
}
