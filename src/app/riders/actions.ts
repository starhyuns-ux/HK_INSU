'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateRiderLimit(riderId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const updates: any = {}
    if (formData.has('max_amount')) updates.max_amount = formData.get('max_amount')
    if (formData.has('age_min')) updates.age_min = formData.get('age_min')
    if (formData.has('age_max')) updates.age_max = formData.get('age_max')
    if (formData.has('term_options')) updates.term_options = formData.get('term_options')
    if (formData.has('waiting_period')) updates.waiting_period = formData.get('waiting_period')
    if (formData.has('exclusions')) updates.exclusions = formData.get('exclusions')
    if (formData.has('reference_url')) updates.reference_url = formData.get('reference_url')

    // Check if limit exists
    const { data: existing } = await supabase.from('rider_limits').select('id').eq('rider_id', riderId).eq('created_by', user.id).single()

    if (existing) {
        const { error } = await supabase.from('rider_limits').update(updates).eq('id', existing.id)
        if (error) return { error: 'Failed to update limit' }
    } else {
        const { error } = await supabase.from('rider_limits').insert({
            rider_id: riderId,
            created_by: user.id,
            ...updates
        })
        if (error) return { error: 'Failed to create limit' }
    }

    revalidatePath('/plans') // Revalidate plans to show new limits
}
