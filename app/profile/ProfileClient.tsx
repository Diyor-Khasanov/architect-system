'use client'

import type { User } from '../lib/users'
import { Shield, Fingerprint, User as UserIcon, Phone, Image as ImageIcon } from 'lucide-react'

export default function ProfileClient({ user }: { user: User }) {
  const formatValue = (value: string | number | null | undefined) =>
    value === null || value === undefined || value === '' ? 'N/A' : value

  const profile = user.profile

  return (
    <section className='space-y-6'>
      <header>
        <h1 className='text-2xl font-semibold tracking-tight'>My Profile</h1>
        <p className='text-sm text-zinc-500'>Profile information from API.</p>
      </header>

      <div className='max-w-2xl'>
        <article className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'>
          <div className='grid gap-6 sm:grid-cols-2'>
            <div className='flex items-start gap-3'>
              <div className='mt-1 rounded-lg bg-zinc-100 p-2 text-zinc-600'>
                <Shield className='h-4 w-4' />
              </div>
              <div>
                <p className='text-xs font-medium uppercase tracking-wider text-zinc-400'>ID</p>
                <p className='text-sm text-zinc-900 font-medium'>{formatValue(profile?.id)}</p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <div className='mt-1 rounded-lg bg-zinc-100 p-2 text-zinc-600'>
                <Fingerprint className='h-4 w-4' />
              </div>
              <div>
                <p className='text-xs font-medium uppercase tracking-wider text-zinc-400'>User ID</p>
                <p className='text-sm text-zinc-900 font-medium'>{formatValue(profile?.user_id)}</p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <div className='mt-1 rounded-lg bg-zinc-100 p-2 text-zinc-600'>
                <UserIcon className='h-4 w-4' />
              </div>
              <div>
                <p className='text-xs font-medium uppercase tracking-wider text-zinc-400'>Full Name</p>
                <p className='text-sm text-zinc-900 font-medium'>{formatValue(profile?.full_name)}</p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <div className='mt-1 rounded-lg bg-zinc-100 p-2 text-zinc-600'>
                <Phone className='h-4 w-4' />
              </div>
              <div>
                <p className='text-xs font-medium uppercase tracking-wider text-zinc-400'>Phone</p>
                <p className='text-sm text-zinc-900 font-medium'>{formatValue(profile?.phone)}</p>
              </div>
            </div>

            <div className='flex items-start gap-3 sm:col-span-2'>
              <div className='mt-1 rounded-lg bg-zinc-100 p-2 text-zinc-600'>
                <ImageIcon className='h-4 w-4' />
              </div>
              <div>
                <p className='text-xs font-medium uppercase tracking-wider text-zinc-400'>Avatar File ID</p>
                <p className='text-sm text-zinc-900 font-medium'>{formatValue(profile?.avatar_file_id)}</p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
