'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import UserEditForm from '../../components/UserEditForm'
import { type User } from '../../lib/users'
import { type UserRole } from '../../lib/auth'
import { ArrowLeft, Mail, Phone, Calendar, Shield, User as UserIcon, HardHat, Pencil } from 'lucide-react'

export default function UserProfileClient({
  user,
  currentUserRole,
}: {
  user: User
  currentUserRole: UserRole
}) {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const handleSuccess = () => {
    setIsEditing(false)
    router.refresh()
  }

  return (
    <section className='space-y-6'>
      <header className='flex items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <Link
            href='/users'
            className='flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50'
          >
            <ArrowLeft className='h-5 w-5' />
          </Link>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight'>User Profile</h1>
            <p className='text-sm text-zinc-500'>Detailed information about the user.</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className='flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50'
        >
          <Pencil className='h-4 w-4' />
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </header>

      {isEditing && (
        <div className='animate-in fade-in slide-in-from-top-4 duration-300'>
          <UserEditForm
            user={user}
            onCancel={() => setIsEditing(false)}
            onSuccess={handleSuccess}
            currentUserRole={currentUserRole}
          />
        </div>
      )}

      <div className='grid gap-6 lg:grid-cols-3'>
        <article className='lg:col-span-2 space-y-6'>
          <div className='rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm'>
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
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      user.is_active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                    }`}
                  >
                    {user.is_active ? 'Active Account' : 'Inactive Account'}
                  </span>
                </div>
                <p className='pt-2 text-zinc-600'>{user.email}</p>
              </div>
            </div>
          </div>

          <div className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'>
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
          </div>
        </article>

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
                <p className='text-xs font-medium uppercase tracking-wider text-zinc-400'>Public Email</p>
                <p className='text-sm font-medium text-zinc-900'>{user.email}</p>
              </div>
              <hr className='border-zinc-100' />
              <div>
                <p className='text-xs font-medium uppercase tracking-wider text-zinc-400'>Role permissions</p>
                <p className='text-sm font-medium text-zinc-900 capitalize'>{user.role} Access</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
