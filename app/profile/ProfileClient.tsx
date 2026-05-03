'use client'

import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { UserProfile } from '../lib/users'
import type { MeResponse } from '../lib/auth'
import { updateMyProfileDetailsAction } from '../actions/users'
import { User as UserIcon, Phone, Fingerprint, Hash, Image as ImageIcon, Mail, Shield, HardHat, Pencil, X, Check, Loader2 } from 'lucide-react'

const initialState: { success?: boolean; error?: string } = {}

export default function ProfileClient({ user, profile }: { user: MeResponse, profile: UserProfile }) {
  const [isEditing, setIsEditing] = useState(false)
  const [state, formAction, isPending] = useActionState(updateMyProfileDetailsAction, initialState)
  const router = useRouter()

  const [lastSuccess, setLastSuccess] = useState(false)

  if (state.success && !lastSuccess) {
    setLastSuccess(true)
    setIsEditing(false)
    router.refresh()
  }

  if (!state.success && lastSuccess) {
    setLastSuccess(false)
  }

  const displayValue = (value: string | number | undefined | null) => {
    if (value === undefined || value === null || value === '') return 'N/A'
    return value
  }

  return (
    <section className='space-y-6'>
      <header className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>My Profile</h1>
          <p className='text-sm text-zinc-500'>Your personal profile information.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className='flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900'
          >
            <Pencil className='h-4 w-4' />
            Edit Profile
          </button>
        )}
      </header>

      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2 space-y-6'>
          {isEditing ? (
            <form action={formAction} className='animate-in fade-in slide-in-from-top-4 duration-300'>
              <article className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'>
                <h3 className='text-lg font-semibold mb-4'>Edit Profile Details</h3>
                <div className='grid gap-4 md:grid-cols-2'>
                  <label className='space-y-1 text-sm text-zinc-600'>
                    Full Name
                    <input
                      name='full_name'
                      defaultValue={profile.full_name}
                      required
                      disabled={isPending}
                      className='w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 disabled:opacity-50'
                    />
                  </label>

                  <label className='space-y-1 text-sm text-zinc-600'>
                    Phone
                    <input
                      name='phone'
                      defaultValue={profile.phone}
                      disabled={isPending}
                      className='w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 disabled:opacity-50'
                    />
                  </label>

                  <label className='space-y-1 text-sm text-zinc-600'>
                    Avatar File ID
                    <input
                      name='avatar_file_id'
                      type='number'
                      defaultValue={profile.avatar_file_id}
                      disabled={isPending}
                      className='w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 disabled:opacity-50'
                    />
                  </label>
                </div>

                {state.error && <p className='mt-4 text-sm text-red-600'>{state.error}</p>}

                <div className='mt-6 flex items-center justify-end gap-3 border-t border-zinc-100 pt-6'>
                  <button
                    type='button'
                    onClick={() => setIsEditing(false)}
                    disabled={isPending}
                    className='flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-50'
                  >
                    <X className='h-4 w-4' />
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={isPending}
                    className='flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-60'
                  >
                    {isPending ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <Check className='h-4 w-4' />
                    )}
                    {isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </article>
            </form>
          ) : (
            <article className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'>
              <div className='flex items-center gap-4 mb-6'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-400'>
                  <UserIcon className='h-8 w-8' />
                </div>
                <div>
                  <h2 className='text-xl font-bold text-zinc-900'>{displayValue(profile.full_name)}</h2>
                  <div className='flex items-center gap-2 mt-1'>
                    <span className='inline-flex items-center gap-1 rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs font-medium text-white capitalize'>
                      {user.role === 'admin' ? (
                        <Shield className='h-3 w-3' />
                      ) : user.role === 'manager' ? (
                        <UserIcon className='h-3 w-3' />
                      ) : (
                        <HardHat className='h-3 w-3' />
                      )}
                      {user.role}
                    </span>
                    <span className='text-xs text-zinc-500'>ID: {profile.id}</span>
                  </div>
                </div>
              </div>

              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between py-2 border-b border-zinc-50'>
                    <div className='flex items-center gap-3 text-zinc-600'>
                      <Hash className='h-4 w-4' />
                      <span className='text-sm font-medium'>Profile ID</span>
                    </div>
                    <span className='text-sm font-semibold text-zinc-900'>{displayValue(profile.id)}</span>
                  </div>

                  <div className='flex items-center justify-between py-2 border-b border-zinc-50'>
                    <div className='flex items-center gap-3 text-zinc-600'>
                      <Fingerprint className='h-4 w-4' />
                      <span className='text-sm font-medium'>User ID</span>
                    </div>
                    <span className='text-sm font-semibold text-zinc-900'>{displayValue(profile.user_id)}</span>
                  </div>

                  <div className='flex items-center justify-between py-2 border-b border-zinc-50'>
                    <div className='flex items-center gap-3 text-zinc-600'>
                      <UserIcon className='h-4 w-4' />
                      <span className='text-sm font-medium'>Full Name</span>
                    </div>
                    <span className='text-sm font-semibold text-zinc-900'>{displayValue(profile.full_name)}</span>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='flex items-center justify-between py-2 border-b border-zinc-50'>
                    <div className='flex items-center gap-3 text-zinc-600'>
                      <Phone className='h-4 w-4' />
                      <span className='text-sm font-medium'>Phone</span>
                    </div>
                    <span className='text-sm font-semibold text-zinc-900'>{displayValue(profile.phone)}</span>
                  </div>

                  <div className='flex items-center justify-between py-2 border-b border-zinc-50'>
                    <div className='flex items-center gap-3 text-zinc-600'>
                      <ImageIcon className='h-4 w-4' />
                      <span className='text-sm font-medium'>Avatar File ID</span>
                    </div>
                    <span className='text-sm font-semibold text-zinc-900'>{displayValue(profile.avatar_file_id)}</span>
                  </div>
                </div>
              </div>
            </article>
          )}
        </div>

        <aside className='space-y-6'>
          <article className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'>
            <h3 className='text-lg font-semibold mb-4'>Account Details</h3>
            <div className='space-y-4'>
              <div className='flex items-start gap-3'>
                <div className='mt-1 rounded-lg bg-zinc-100 p-2 text-zinc-600'>
                  <Mail className='h-4 w-4' />
                </div>
                <div>
                  <p className='text-xs font-medium uppercase tracking-wider text-zinc-400'>Email</p>
                  <p className='text-sm text-zinc-900 font-medium'>{user.email}</p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <div className='mt-1 rounded-lg bg-zinc-100 p-2 text-zinc-600'>
                  <UserIcon className='h-4 w-4' />
                </div>
                <div>
                  <p className='text-xs font-medium uppercase tracking-wider text-zinc-400'>Username</p>
                  <p className='text-sm text-zinc-900 font-medium'>{user.username}</p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <div className='mt-1 rounded-lg bg-zinc-100 p-2 text-zinc-600'>
                  <Shield className='h-4 w-4' />
                </div>
                <div>
                  <p className='text-xs font-medium uppercase tracking-wider text-zinc-400'>Role</p>
                  <p className='text-sm text-zinc-900 font-medium capitalize'>{user.role}</p>
                </div>
              </div>
            </div>
          </article>
        </aside>
      </div>
    </section>
  )
}
