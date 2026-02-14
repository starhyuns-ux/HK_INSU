'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createShareLink(type: 'plan' | 'comparison', targetId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Check if link exists
    const { data: existing } = await supabase
        .from('share_links')
        .select('token')
        .eq('created_by', user.id)
        .eq('type', type)
        .eq('target_id', targetId)
        .single()

    if (existing) {
        return { token: existing.token }
    }

    // Generate new token (simple random string)
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    const { error } = await supabase.from('share_links').insert({
        created_by: user.id,
        type,
        target_id: targetId,
        token
    })

    if (error) return { error: 'Failed to create share link' }

    return { token }
}
