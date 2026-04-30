'use client'

import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { updateUserAction } from '../actions/users'
import type { User } from '../lib/users'

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

export default function UserEditForm({
  user,
  onCancel,
  onSuccess,
}: {
  user: User
  onCancel: () => void
  onSuccess?: () => void
}) {
  const [state, formAction] = useActionState(updateUserAction.bind(null, user.id), initialState)

  useEffect(() => {
    if (state.success && onSuccess) {
      onSuccess()
    }
  }, [state.success, onSuccess])

  return (
    <form action={formAction} className='grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm'>
      <h2 className='text-lg font-semibold tracking-tight'>Edit User: {user.username}</h2>

      <div className='grid gap-4 md:grid-cols-2'>
        <label className='space-y-1 text-sm text-zinc-600'>
          Username
          <input
            name='username'
            defaultValue={user.username}
            required
            className='w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900'
          />
        </label>

        <label className='space-y-1 text-sm text-zinc-600'>
          Full Name
          <input
            name='full_name'
            defaultValue={user.profile?.full_name}
            required
            className='w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900'
          />
        </label>

        <label className='space-y-1 text-sm text-zinc-600'>
          Email
          <input
            name='email'
            type='email'
            defaultValue={user.email}
            required
            className='w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900'
          />
        </label>

        <label className='space-y-1 text-sm text-zinc-600'>
          Role
          <select
            name='role'
            defaultValue={user.role}
            required
            className='w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900'
          >
            <option value='worker'>Worker</option>
            <option value='manager'>Manager</option>
            <option value='admin'>Admin</option>
          </select>
        </label>

        <label className='flex items-center gap-2 text-sm text-zinc-600'>
          <input
            name='is_active'
            type='checkbox'
            value='true'
            defaultChecked={user.is_active}
            className='h-4 w-4 rounded border-zinc-300'
          />
          Active Account
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
          {state?.success ? <p className='text-sm text-emerald-600'>User updated.</p> : null}
          <SubmitButton />
        </div>
      </div>
    </form>
  )
}
