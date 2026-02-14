'use client'

import { updateRiderLimit } from '@/app/riders/actions'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function LimitEdit({ riderId, field, defaultValue, placeholder }: { riderId: string, field: string, defaultValue?: string | number, placeholder?: string }) {
    const [value, setValue] = useState(defaultValue || '')
    const [dirty, setDirty] = useState(false)

    const handleBlur = async () => {
        if (!dirty) return
        const formData = new FormData()
        formData.append(field, value.toString())
        await updateRiderLimit(riderId, formData)
        setDirty(false)
    }

    return (
        <Input
            value={value}
            onChange={e => { setValue(e.target.value); setDirty(true); }}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="h-8 text-xs min-w-[80px]"
        />
    )
}
