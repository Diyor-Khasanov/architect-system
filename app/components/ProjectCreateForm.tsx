'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createProjectAction } from '../actions/projects'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type='submit'
      disabled={pending}
      className='rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60'
    >
      {pending ? 'Creating...' : 'Create project'}
    </button>
  )
}

const initialState: { success?: boolean; error?: string } = {}

export default function ProjectCreateForm({ onSuccess }: { onSuccess?: () => void }) {
  const [state, formAction] = useActionState(async (prev: typeof initialState, formData: FormData) => {
    const res = await createProjectAction(prev, formData)
    if (res.success && onSuccess) onSuccess()
    return res
  }, initialState)

  return (
    <form action={formAction} className='grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm'>
      <h2 className='text-lg font-semibold tracking-tight'>Create project</h2>

      <div className='grid gap-4 md:grid-cols-2'>
        <label className='space-y-1 text-sm text-zinc-600'>
          Name
          <input
            name='name'
            required
            className='w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900'
            placeholder='Head Office Remodel'
          />
        </label>

        <label className='space-y-1 text-sm text-zinc-600'>
          Manager ID
          <input
            name='manager_id'
            type='number'
            min={1}
            required
            className='w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900'
            placeholder='12'
          />
        </label>
      </div>

      <label className='space-y-1 text-sm text-zinc-600'>
        Description
        <textarea
          name='description'
          required
          rows={3}
          className='w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900'
          placeholder='Project scope and objectives...'
        />
      </label>

      <label className='space-y-1 text-sm text-zinc-600'>
        Deadline
        <input
          name='deadline'
          type='date'
          required
          className='w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 md:max-w-[220px]'
        />
      </label>

      <div className='flex items-center justify-between'>
        {state?.error ? <p className='text-sm text-red-600'>{state.error}</p> : null}
        {state?.success ? <p className='text-sm text-emerald-600'>Project created.</p> : null}
        <SubmitButton />
      </div>
    </form>
  )
}
