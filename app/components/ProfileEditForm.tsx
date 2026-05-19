'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { updateMyProfileDetailsAction } from '../actions/users'
import type { UserProfile } from '../lib/users'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type='submit'
      disabled={pending}
      className='rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900'
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
  forcedAvatarFileId,
}: {
  profile: UserProfile
  onCancel: () => void
  onSuccess?: () => void
  forcedAvatarFileId?: number
}) {
  const [state, formAction] = useActionState(updateMyProfileDetailsAction, initialState)
  const [avatarFileId, setAvatarFileId] = useState<number | string>(profile.avatar_file_id ?? '')
  const [prevForcedId, setPrevForcedId] = useState<number | undefined>(forcedAvatarFileId)

  if (forcedAvatarFileId !== prevForcedId) {
    setPrevForcedId(forcedAvatarFileId)
    if (forcedAvatarFileId !== undefined) {
      setAvatarFileId(forcedAvatarFileId)
    }
  }

  useEffect(() => {
    if (state.success && onSuccess) {
      onSuccess()
    }
  }, [state.success, onSuccess])

  return (
    <form
      action={formAction}
      className='grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'
    >
      <h2 className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>Edit Profile Details</h2>

      <div className='grid gap-4 md:grid-cols-2'>
        <label className='space-y-1 text-sm text-zinc-600 dark:text-zinc-400'>
          Full Name
          <input
            name='full_name'
            defaultValue={profile.full_name}
            required
            className='w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-700'
          />
        </label>

        <label className='space-y-1 text-sm text-zinc-600 dark:text-zinc-400'>
          Phone Number
          <input
            name='phone'
            defaultValue={profile.phone}
            className='w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-700'
          />
        </label>

      </div>

      <input
        name='avatar_file_id'
        type='hidden'
        value={avatarFileId}
      />

      <div className='flex items-center justify-between pt-2'>
        <button
          type='button'
          onClick={onCancel}
          className='text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
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
