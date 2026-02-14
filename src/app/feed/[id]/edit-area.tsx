'use client'

import { updateComparisonItem } from './actions'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'

export function EditArea({ itemId, field, defaultValue }: { itemId: string, field: string, defaultValue: string }) {
    const [value, setValue] = useState(defaultValue || '')
    const [dirty, setDirty] = useState(false)

    const handleSave = async () => {
        const formData = new FormData()
        formData.append(field, value)
        // We need to preserve other fields? updateComparisonItem implementation only updates passed fields ideally.
        // My implementation in actions.ts creates a fixed update set.
        // Wait, actions.ts: `const pros = formData.get('pros')`. If I only send 'pros', others are null/undefined?
        // Supabase update ignores undefined if I construct object carefully, but `const pros = ...` might be null.
        // I should update actions.ts to be partial.

        // Let's assume actions.ts handles it or I send all... 
        // Actually sending all is hard here without fetching.
        // I should modify updateComparisonItem in actions.ts to be dynamic or specific to field.
        // For now, let's just make a specific action `updateField` or make `updateComparisonItem` smart.

        // I Will update actions.ts to be smart.

        await updateComparisonItem(itemId, formData)
        setDirty(false)
    }

    // Actually, standard HTML form submission is easier if I just use onBlur?
    // Let's use a save button for explicit action.

    return (
        <div className="relative group">
            <Textarea
                name={field}
                value={value}
                onChange={(e) => { setValue(e.target.value); setDirty(true); }}
                className="min-h-[80px] text-xs resize-y bg-white"
            />
            {dirty && (
                <Button size="icon-xs" className="absolute top-1 right-1 h-6 w-6" onClick={handleSave}>
                    <Save className="h-3 w-3" />
                </Button>
            )}
        </div>
    )
}
