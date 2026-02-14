'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPlan(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const name = formData.get('name') as string
    const description = formData.get('description') as string

    const { data, error } = await supabase.from('plans').insert({
        name,
        description,
        created_by: user.id
    }).select().single()

    if (error) {
        console.error('Error creating plan:', error)
        redirect('/plans?error=Failed to create plan')
    }

    revalidatePath('/plans')
    redirect(`/plans/${data.id}`)
}

export async function deletePlan(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('plans').delete().eq('id', id)
    if (error) throw new Error('Failed to delete plan')
    revalidatePath('/plans')
}

export async function addRiderToPlan(planId: string, riderId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('plan_items').insert({
        plan_id: planId,
        rider_id: riderId
    })
    if (error) {
        console.error('Error adding rider to plan:', error)
        return { error: 'Failed to add rider' }
    }
    revalidatePath(`/plans/${planId}`)
}

export async function removeRiderFromPlan(itemId: string, planId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('plan_items').delete().eq('id', itemId)
    if (error) throw new Error('Failed to remove rider from plan')
    revalidatePath(`/plans/${planId}`)
}
