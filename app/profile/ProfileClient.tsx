'use client'

import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { updateMyProfileAction } from '../actions/users'
import type { User } from '../lib/users'
import { Mail, Phone, Calendar, Shield, User as UserIcon, HardHat, Pencil, Check, X } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type='submit'
      disabled={pending}
      className='flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60'
    >
      {pending ? (
        'Saving...'
      ) : (
        <>
          <Check className='h-4 w-4' />
          Save Changes
        </>
      )}
    </button>
  )
}

const initialState: { success?: boolean; error?: string } = {}

export default function ProfileClient({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false)
  const [state, formAction] = useActionState(updateMyProfileAction, initialState)
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

  return (
    <section className='space-y-6'>
      <header className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>My Profile</h1>
          <p className='text-sm text-zinc-500'>Manage your personal information and account settings.</p>
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
            <form action={formAction} className='animate-in fade-in slide-in-from-top-4 duration-300 space-y-6'>
              <div className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'>
                <h3 className='text-lg font-semibold mb-4'>Edit Information</h3>
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

                  <label className='space-y-1 text-sm text-zinc-600 md:col-span-2'>
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
                    New Password (optional)
                    <input
                      name='password'
                      type='password'
                      className='w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900'
                      placeholder='••••••••'
                    />
                  </label>

                  <label className='space-y-1 text-sm text-zinc-600'>
                    Confirm New Password
                    <input
                      name='confirm_password'
                      type='password'
                      className='w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900'
                      placeholder='••••••••'
                    />
                  </label>
                </div>

                <div className='mt-6 flex items-center justify-between border-t border-zinc-100 pt-6'>
                  <button
                    type='button'
                    onClick={() => setIsEditing(false)}
                    className='flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900'
                  >
                    <X className='h-4 w-4' />
                    Cancel
                  </button>
                  <div className='flex items-center gap-4'>
                    {state?.error ? <p className='text-sm text-red-600'>{state.error}</p> : null}
                    <SubmitButton />
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <>
              <article className='rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm'>
                <div className='flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-6'>
                  <div className='flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-400'>
                    <UserIcon className='h-12 w-12' />
                  </div>
                  <div className='flex-1 space-y-1'>
                    <h2 className='text-3xl font-bold tracking-tight text-zinc-900'>
                      {user.profile?.full_name || user.username}
                    </h2>
                    <div className='flex flex-wrap items-center justify-center md:justify-start gap-2'>
                      <span className='inline-flex items-center gap-1 rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white capitalize'>
                        {user.role === 'admin' ? (
                          <Shield className='h-3 w-3' />
                        ) : user.role === 'manager' ? (
                          <UserIcon className='h-3 w-3' />
                        ) : (
                          <HardHat className='h-3 w-3' />
                        )}
                        {user.role}
                      </span>
                      <span className='inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-100'>
                        Active Account
                      </span>
                    </div>
                    <p className='pt-2 text-zinc-600'>{user.email}</p>
                  </div>
                </div>
              </article>

              <article className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'>
                <h3 className='text-lg font-semibold mb-4'>Account Details</h3>
                <div className='grid gap-6 md:grid-cols-2'>
                  <div className='flex items-start gap-3'>
                    <div className='mt-1 rounded-lg bg-zinc-100 p-2 text-zinc-600'>
                      <Mail className='h-4 w-4' />
                    </div>
                    <div>
                      <p className='text-xs font-medium uppercase tracking-wider text-zinc-400'>Email Address</p>
                      <p className='text-sm text-zinc-900 font-medium'>{user.email}</p>
                    </div>
                  </div>
                  <div className='flex items-start gap-3'>
                    <div className='mt-1 rounded-lg bg-zinc-100 p-2 text-zinc-600'>
                      <Phone className='h-4 w-4' />
                    </div>
                    <div>
                      <p className='text-xs font-medium uppercase tracking-wider text-zinc-400'>Phone Number</p>
                      <p className='text-sm text-zinc-900 font-medium'>{user.profile?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className='flex items-start gap-3'>
                    <div className='mt-1 rounded-lg bg-zinc-100 p-2 text-zinc-600'>
                      <Calendar className='h-4 w-4' />
                    </div>
                    <div>
                      <p className='text-xs font-medium uppercase tracking-wider text-zinc-400'>Member Since</p>
                      <p className='text-sm text-zinc-900 font-medium'>
                        {new Date(user.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-3'>
                    <div className='mt-1 rounded-lg bg-zinc-100 p-2 text-zinc-600'>
                      <Shield className='h-4 w-4' />
                    </div>
                    <div>
                      <p className='text-xs font-medium uppercase tracking-wider text-zinc-400'>Account ID</p>
                      <p className='text-sm text-zinc-900 font-medium'>#{user.id}</p>
                    </div>
                  </div>
                </div>
              </article>
            </>
          )}
        </div>

        <aside className='space-y-6'>
          <div className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'>
            <h3 className='text-lg font-semibold mb-4'>Profile Summary</h3>
            <div className='space-y-4'>
              <div>
                <p className='text-xs font-medium uppercase tracking-wider text-zinc-400'>Username</p>
                <p className='text-sm font-medium text-zinc-900'>{user.username}</p>
              </div>
              <hr className='border-zinc-100' />
              <div>
                <p className='text-xs font-medium uppercase tracking-wider text-zinc-400'>Role Permissions</p>
                <p className='text-sm font-medium text-zinc-900 capitalize'>{user.role} Access</p>
              </div>
              <hr className='border-zinc-100' />
              <div>
                <p className='text-xs font-medium uppercase tracking-wider text-zinc-400'>Account Status</p>
                <p className='text-sm font-medium text-zinc-900'>Verified</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
