'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createProjectAction } from '../actions/projects'
import Combobox from './Combobox'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type='submit'
      disabled={pending}
      className='rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900'
    >
      {pending ? 'Creating...' : 'Create project'}
    </button>
  )
}

const initialState: { success?: boolean; error?: string } = {}

export default function ProjectCreateForm({
  onSuccess,
  availableManagers = [],
}: {
  onSuccess?: () => void
  availableManagers?: { id: number; username: string; full_name: string }[]
}) {
  const [state, formAction] = useActionState(async (prev: typeof initialState, formData: FormData) => {
    const res = await createProjectAction(prev, formData)
    if (res.success && onSuccess) onSuccess()
    return res
  }, initialState)

  return (
    <form
      action={formAction}
      className='grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'
    >
      <h2 className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>Create project</h2>

      <div className='grid gap-4 md:grid-cols-2'>
        <label className='space-y-1 text-sm text-zinc-600 dark:text-zinc-400'>
          Name
          <input
            name='name'
            required
            className='w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-700'
            placeholder='Head Office Remodel'
          />
        </label>

        <div className='space-y-1 text-sm text-zinc-600 dark:text-zinc-400'>
          <span>Manager</span>
          <Combobox
            name='manager_id'
            required
            placeholder='Select a manager'
            options={availableManagers.map((m) => ({
              id: m.id,
              label: `${m.full_name} (${m.username})`,
            }))}
          />
        </div>
      </div>

      <label className='space-y-1 text-sm text-zinc-600 dark:text-zinc-400'>
        Description
        <textarea
          name='description'
          required
          rows={3}
          className='w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-700'
          placeholder='Project scope and objectives...'
        />
      </label>

      <label className='space-y-1 text-sm text-zinc-600 dark:text-zinc-400'>
        Deadline
        <input
          name='deadline'
          type='date'
          required
          className='w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900 md:max-w-[220px] dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-700'
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
