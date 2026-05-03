'use client'

import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { uploadAvatarAction } from '../actions/users'
import { Upload, Loader2 } from 'lucide-react'

function UploadButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type='submit'
      disabled={pending}
      className='flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60'
    >
      {pending ? (
        <>
          <Loader2 className='h-4 w-4 animate-spin' />
          Uploading...
        </>
      ) : (
        <>
          <Upload className='h-4 w-4' />
          Upload Avatar
        </>
      )}
    </button>
  )
}

const initialState: { success?: boolean; error?: string; data?: unknown } = {}

export default function AvatarUploadForm({ onUploadSuccess }: { onUploadSuccess?: (data: unknown) => void }) {
  const [state, formAction] = useActionState(uploadAvatarAction, initialState)

  useEffect(() => {
    if (state.success && onUploadSuccess) {
      onUploadSuccess(state.data)
    }
  }, [state.success, state.data, onUploadSuccess])

  return (
    <form action={formAction} className='space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm'>
      <h3 className='text-lg font-semibold tracking-tight'>Update Avatar</h3>
      <p className='text-sm text-zinc-500'>Choose a file to upload as your profile picture.</p>

      <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
        <input
          name='file'
          type='file'
          accept='image/*'
          required
          className='flex-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-1 file:text-sm file:font-medium hover:file:bg-zinc-200'
        />
        <UploadButton />
      </div>

      {state?.error && <p className='text-sm text-red-600'>{state.error}</p>}
      {state?.success && <p className='text-sm text-emerald-600'>Avatar uploaded successfully!</p>}
    </form>
  )
}
