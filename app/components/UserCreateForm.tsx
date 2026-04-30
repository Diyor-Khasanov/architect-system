'use client'

import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { createUserAction } from '../actions/users'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type='submit'
      disabled={pending}
      className='rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60'
    >
      {pending ? 'Creating...' : 'Create User'}
    </button>
  )
}

const initialState: { success?: boolean; error?: string } = {}

export default function UserCreateForm({ onSuccess }: { onSuccess?: () => void }) {
  const [state, formAction] = useActionState(createUserAction, initialState)

  useEffect(() => {
    if (state.success && onSuccess) {
      onSuccess()
    }
  }, [state.success, onSuccess])

  return (
    <form action={formAction} className='grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm'>
      <h2 className='text-lg font-semibold tracking-tight'>Create New User</h2>

      <div className='grid gap-4 md:grid-cols-2'>
        <label className='space-y-1 text-sm text-zinc-600'>
          Username
          <input
            name='username'
            required
            className='w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900'
            placeholder='johndoe'
          />
        </label>

        <label className='space-y-1 text-sm text-zinc-600'>
          Full Name
          <input
            name='full_name'
            required
            className='w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900'
            placeholder='John Doe'
          />
        </label>

        <label className='space-y-1 text-sm text-zinc-600'>
          Email
          <input
            name='email'
            type='email'
            required
            className='w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900'
            placeholder='john@example.com'
          />
        </label>

        <label className='space-y-1 text-sm text-zinc-600'>
          Password
          <input
            name='password'
            type='password'
            required
            className='w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900'
            placeholder='••••••••'
          />
        </label>

        <label className='space-y-1 text-sm text-zinc-600'>
          Role
          <select
            name='role'
            required
            className='w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900'
          >
            <option value='worker'>Worker</option>
            <option value='manager'>Manager</option>
            <option value='admin'>Admin</option>
          </select>
        </label>
      </div>

      <div className='flex items-center justify-between pt-2'>
        <div>
          {state?.error ? <p className='text-sm text-red-600'>{state.error}</p> : null}
          {state?.success ? <p className='text-sm text-emerald-600'>User created successfully.</p> : null}
        </div>
        <SubmitButton />
      </div>
    </form>
  )
}
