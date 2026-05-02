import { redirect } from 'next/navigation'
import Link from 'next/link'
import AppShell from '../../components/AppShell'
import { fetchCurrentUser } from '../../lib/auth'
import { fetchUserById } from '../../lib/users'
import UserProfileClient from './UserProfileClient'

interface UserProfilePageProps {
  params: Promise<{ id: string }>
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = await params
  const currentUser = await fetchCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  // Only admins and managers can access this page
  if (!['admin', 'manager'].includes(currentUser.role)) {
    redirect('/dashboard')
  }

  let user = null
  try {
    user = await fetchUserById(Number(id))
  } catch (error) {
    console.error('Failed to fetch user:', error)
  }

  if (!user) {
    return (
      <AppShell currentUser={currentUser}>
        <div className='rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700'>
          <h2 className='text-lg font-semibold'>Error</h2>
          <p className='mt-2'>User not found or you don&apos;t have permission to view this profile.</p>
          <Link href='/users' className='mt-4 inline-block text-sm font-medium underline'>
            Back to users
          </Link>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell currentUser={currentUser}>
      <UserProfileClient user={user} currentUserRole={currentUser.role} />
    </AppShell>
  )
}
