'use client'

import type { UserProfile } from '../lib/users'
import type { MeResponse } from '../lib/auth'
import { User as UserIcon, Phone, Fingerprint, Hash, Image as ImageIcon, Mail, Shield, HardHat } from 'lucide-react'

export default function ProfileClient({ user, profile }: { user: MeResponse, profile: UserProfile }) {
  const displayValue = (value: string | number | undefined | null) => {
    if (value === undefined || value === null || value === '') return 'N/A'
    return value
  }

  const displayValue = (value: string | number | undefined | null) => {
    if (value === undefined || value === null || value === '') return 'N/A'
    return value
  }

  const displayValue = (value: string | number | undefined | null) => {
    if (value === undefined || value === null || value === '') return 'N/A'
    return value
  }

  return (
    <section className='space-y-6'>
      <header>
        <h1 className='text-2xl font-semibold tracking-tight'>My Profile</h1>
        <p className='text-sm text-zinc-500'>Your personal profile information.</p>
      </header>

      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2 space-y-6'>
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
