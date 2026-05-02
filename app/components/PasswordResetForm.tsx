'use client'

import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { resetPasswordAction } from '../actions/users'
import { KeyRound } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type='submit'
      disabled={pending}
      className='rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60'
    >
      {pending ? 'Resetting...' : 'Reset Password'}
    </button>
  )
}

const initialState: { success?: boolean; error?: string } = {}

export default function PasswordResetForm({
  userId,
  username,
  onCancel,
  onSuccess,
}: {
  userId: number
  username: string
  onCancel: () => void
  onSuccess?: () => void
}) {
  const [state, formAction] = useActionState(resetPasswordAction.bind(null, userId), initialState)

  useEffect(() => {
    if (state.success && onSuccess) {
      const timer = setTimeout(() => {
        onSuccess()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [state.success, onSuccess])

  return (
    <form action={formAction} className='grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm'>
      <div className='flex items-center gap-2'>
        <KeyRound className='h-5 w-5 text-zinc-900' />
        <h2 className='text-lg font-semibold tracking-tight'>Reset Password for {username}</h2>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <label className='space-y-1 text-sm text-zinc-600'>
          Old Password
          <input
            name='old_password'
            type='password'
            className='w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900'
            placeholder='••••••••'
          />
        </label>

        <label className='space-y-1 text-sm text-zinc-600'>
          New Password
          <input
            name='new_password'
            type='password'
            required
            className='w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900'
            placeholder='••••••••'
          />
        </label>

        <label className='space-y-1 text-sm text-zinc-600'>
          Confirm New Password
          <input
            name='confirm_password'
            type='password'
            required
            className='w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900'
            placeholder='••••••••'
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
          {state?.success ? <p className='text-sm text-emerald-600'>Password reset successfully.</p> : null}
          <SubmitButton />
        </div>
      </div>
    </form>
  )
}
