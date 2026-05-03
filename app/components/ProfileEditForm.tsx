'use client'

import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { updateMyProfileDetailsAction } from '../actions/users'
import type { UserProfile } from '../lib/users'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type='submit'
      disabled={pending}
      className='rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60'
    >
      {pending ? 'Saving...' : 'Save Changes'}
    </button>
  )
}

const initialState: { success?: boolean; error?: string } = {}

export default function ProfileEditForm({
  profile,
  onCancel,
  onSuccess,
}: {
  profile: UserProfile
  onCancel: () => void
  onSuccess?: () => void
}) {
  const [state, formAction] = useActionState(updateMyProfileDetailsAction, initialState)

  useEffect(() => {
    if (state.success && onSuccess) {
      onSuccess()
    }
  }, [state.success, onSuccess])

  return (
    <form action={formAction} className='grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm'>
      <h2 className='text-lg font-semibold tracking-tight'>Edit Profile Details</h2>

      <div className='grid gap-4 md:grid-cols-2'>
        <label className='space-y-1 text-sm text-zinc-600'>
          Full Name
          <input
            name='full_name'
            defaultValue={profile.full_name}
            required
            className='w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900'
          />
        </label>

        <label className='space-y-1 text-sm text-zinc-600'>
          Phone Number
          <input
            name='phone'
            defaultValue={profile.phone}
            className='w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900'
          />
        </label>

        <label className='space-y-1 text-sm text-zinc-600'>
          Avatar File ID
          <input
            name='avatar_file_id'
            type='number'
            defaultValue={profile.avatar_file_id}
            className='w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900'
          />
        </label>
      </div>

      <div className='flex items-center justify-between pt-2'>
        <button
          type='button'
          onClick={onCancel}
          className='text-sm font-medium text-zinc-600 hover:text-zinc-900'
        >
          Cancel
        </button>
        <div className='flex items-center gap-4'>
          {state?.error ? <p className='text-sm text-red-600'>{state.error}</p> : null}
          {state?.success ? <p className='text-sm text-emerald-600'>Profile updated.</p> : null}
          <SubmitButton />
        </div>
      </div>
    </form>
  )
}
