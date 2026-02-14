'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createComparison(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const title = formData.get('title') as string
    const category = formData.get('category') as string

    const { data, error } = await supabase.from('comparisons').insert({
        title,
        category,
        created_by: user.id
    }).select().single()

    if (error) {
        console.error('Error creating comparison:', error)
        // redirect with error query param instead of returning object
        redirect('/feed?error=Failed to create comparison')
    }

    // Success
    revalidatePath('/feed')
    redirect(`/feed/${data.id}/edit`)
}

export async function deleteComparison(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('comparisons').delete().eq('id', id)
    if (error) throw new Error('Failed to delete comparison')
    revalidatePath('/feed')
}
