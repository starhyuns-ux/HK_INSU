'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addRiderToComparison(comparisonId: string, riderId: string) {
    const supabase = await createClient()

    const { error } = await supabase.from('comparison_items').insert({
        comparison_id: comparisonId,
        rider_id: riderId
    })

    if (error) {
        console.error('Error adding rider to comparison:', error)
        return { error: 'Failed to add rider' }
    }

    revalidatePath(`/feed/${comparisonId}`)
    revalidatePath(`/feed/${comparisonId}/edit`)
}

export async function updateComparisonItem(itemId: string, formData: FormData) {
    const supabase = await createClient()

    const updates: Record<string, any> = {}
    if (formData.has('pros')) updates.pros = formData.get('pros')
    if (formData.has('cons')) updates.cons = formData.get('cons')
    if (formData.has('rationale')) updates.rationale = formData.get('rationale')

    if (Object.keys(updates).length === 0) return

    const { error } = await supabase.from('comparison_items').update(updates).eq('id', itemId)

    if (error) {
        console.error('Error updating comparison item:', error)
        return { error: 'Failed to update item' }
    }

    revalidatePath('/feed')
}

export async function removeComparisonItem(itemId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('comparison_items').delete().eq('id', itemId)
    if (error) throw new Error('Failed to remove item')
    revalidatePath('/feed')
}
