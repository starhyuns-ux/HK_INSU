import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage({
    searchParams,
}: {
    searchParams: { message: string }
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">Sign in or Create an account</CardTitle>
                    <CardDescription>
                        Enter your email and password below to sign in to your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <form className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button formAction={login} className="w-full">Sign In</Button>
                            <Button formAction={signup} variant="outline" className="w-full">Sign Up</Button>
                        </div>
                    </form>
                    {searchParams?.message && (
                        <p className="mt-4 text-center text-sm text-red-500 bg-red-50 p-2 rounded">
                            {searchParams.message}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
