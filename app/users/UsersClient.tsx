'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import UserCreateForm from '../components/UserCreateForm'
import { type User } from '../lib/users'
import { type UserRole } from '../lib/auth'
import { UserPlus, Shield, User as UserIcon, HardHat } from 'lucide-react'

export default function UsersClient({
  initialUsers,
  currentUserRole,
}: {
  initialUsers: User[]
  currentUserRole: UserRole
}) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const router = useRouter()

  const handleActionSuccess = () => {
    router.refresh()
    setShowCreateForm(false)
  }

  return (
    <section className='space-y-6'>
      <header className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'>
        <div>
          <h1 className='text-2xl md:text-3xl font-semibold tracking-tight'>User Management</h1>
          <p className='mt-2 text-sm text-zinc-600'>
            View and manage system users (workers, managers, and admins).
          </p>
        </div>
        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm)
          }}
          className='flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90'
        >
          <UserPlus className='h-4 w-4' />
          {showCreateForm ? 'Close Form' : 'Add User'}
        </button>
      </header>

      {showCreateForm && (
        <div className='animate-in fade-in slide-in-from-top-4 duration-300'>
          <UserCreateForm onSuccess={handleActionSuccess} currentUserRole={currentUserRole} />
        </div>
      )}

      <article className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm'>
        <h2 className='text-lg font-semibold tracking-tight'>System Users</h2>

        {initialUsers.length === 0 ? (
          <p className='mt-3 text-sm text-zinc-500'>No users found.</p>
        ) : (
          <div className='mt-4 overflow-x-auto -mx-5 px-5'>
            <table className='w-full min-w-[800px] text-left text-sm'>
              <thead className='border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500'>
                <tr>
                  <th className='px-2 py-3'>ID</th>
                  <th className='px-2 py-3'>User</th>
                  <th className='px-2 py-3'>Role</th>
                  <th className='px-2 py-3'>Status</th>
                  <th className='px-2 py-3'>Created</th>
                </tr>
              </thead>
              <tbody>
                {initialUsers.map((user) => (
                  <tr key={user.id} className='border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors'>
                    <td className='px-2 py-4 text-zinc-500'>{user.id}</td>
                    <td className='px-2 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600'>
                          <UserIcon className='h-5 w-5' />
                        </div>
                        <div>
                          <Link
                            href={`/users/${user.id}`}
                            className='font-medium text-zinc-900 hover:text-zinc-600 hover:underline transition-colors'
                          >
                            {user.profile?.full_name || user.username}
                          </Link>
                          <p className='text-xs text-zinc-500'>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className='px-2 py-4'>
                      <div className='flex items-center gap-1.5'>
                        {user.role === 'admin' ? (
                          <Shield className='h-3.5 w-3.5 text-zinc-900' />
                        ) : user.role === 'manager' ? (
                          <UserIcon className='h-3.5 w-3.5 text-zinc-600' />
                        ) : (
                          <HardHat className='h-3.5 w-3.5 text-zinc-400' />
                        )}
                        <span className='capitalize'>{user.role}</span>
                      </div>
                    </td>
                    <td className='px-2 py-4'>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.is_active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                        }`}
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className='px-2 py-4 text-zinc-500'>
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  )
}
