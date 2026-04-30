'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import UserCreateForm from '../components/UserCreateForm'
import UserEditForm from '../components/UserEditForm'
import { type User } from '../lib/users'
import { deleteUserAction } from '../actions/users'
import { Pencil, Trash2, UserPlus, Shield, User as UserIcon, HardHat } from 'lucide-react'
import type { UserRole } from '../lib/auth'

export default function UsersClient({
  initialUsers,
  currentUserRole,
}: {
  initialUsers: User[]
  currentUserRole: UserRole
}) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setUsers(initialUsers)
  }, [initialUsers])

  const handleActionSuccess = () => {
    router.refresh()
    setShowCreateForm(false)
    setEditingUser(null)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const result = await deleteUserAction(id)
      if (result.error) {
        alert(result.error)
      } else {
        setUsers(users.filter((u) => u.id !== id))
      }
    } catch {
      alert('Failed to delete user.')
    }
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
            setEditingUser(null)
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

      {editingUser && (
        <div className='animate-in fade-in slide-in-from-top-4 duration-300'>
          <UserEditForm
            user={editingUser}
            onCancel={() => setEditingUser(null)}
            onSuccess={handleActionSuccess}
          />
        </div>
      )}

      <article className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm'>
        <h2 className='text-lg font-semibold tracking-tight'>System Users</h2>

        {users.length === 0 ? (
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
                  <th className='px-2 py-3 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className='border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors'>
                    <td className='px-2 py-4 text-zinc-500'>{user.id}</td>
                    <td className='px-2 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600'>
                          <UserIcon className='h-5 w-5' />
                        </div>
                        <div>
                          <p className='font-medium text-zinc-900'>{user.profile?.full_name || user.username}</p>
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
                    <td className='px-2 py-4 text-right'>
                      <div className='flex justify-end gap-2'>
                        <button
                          onClick={() => {
                            setEditingUser(user)
                            setShowCreateForm(false)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                          className='rounded-md p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                          title='Edit User'
                        >
                          < Pencil className='h-4 w-4' />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className='rounded-md p-2 text-red-600 hover:bg-red-50'
                          title='Delete User'
                        >
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </div>
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
