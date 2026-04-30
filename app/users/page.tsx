import { redirect } from 'next/navigation'
import AppShell from '../components/AppShell'
import { fetchCurrentUser } from '../lib/auth'
import { fetchUsers, type User } from '../lib/users'
import UsersClient from './UsersClient'

export default async function UsersPage() {
  const currentUser = await fetchCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  if (!['admin', 'manager'].includes(currentUser.role)) {
    redirect('/dashboard')
  }

  let users: User[] = []
  try {
    users = await fetchUsers()
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }

  return (
    <AppShell currentUser={currentUser}>
      <UsersClient initialUsers={users} currentUserRole={currentUser.role} />
    </AppShell>
  )
}
