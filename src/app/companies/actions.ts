'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCompany(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const homepage_url = formData.get('homepage_url') as string
    const logo_url = formData.get('logo_url') as string

    const { error } = await supabase.from('companies').insert({
        name,
        homepage_url,
        logo_url
    })

    if (error) {
        console.error('Error creating company:', error)
        // In a real app we'd return errors to the form
        return { error: 'Failed to create company' }
    }

    revalidatePath('/companies')
}

export async function createRider(companyId: string, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const summary = formData.get('summary') as string
    const notes = formData.get('notes') as string
    const source_url = formData.get('source_url') as string

    const { error } = await supabase.from('riders').insert({
        company_id: companyId,
        name,
        category,
        summary,
        notes,
        source_url
    })

    if (error) {
        console.error('Error creating rider:', error)
        return { error: 'Failed to create rider' }
    }

    revalidatePath(`/companies/${companyId}`)
}

export async function deleteCompany(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('companies').delete().eq('id', id)
    if (error) throw new Error('Failed to delete company')
    revalidatePath('/companies')
}

export async function deleteRider(id: string, companyId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('riders').delete().eq('id', id)
    if (error) throw new Error('Failed to delete rider')
    revalidatePath(`/companies/${companyId}`)
}
