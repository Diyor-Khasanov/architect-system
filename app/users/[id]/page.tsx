import { redirect } from 'next/navigation'
import Link from 'next/link'
import AppShell from '../../components/AppShell'
import { fetchCurrentUser } from '../../lib/auth'
import { fetchUserById, fetchUserProjects, fetchUserReports, fetchUserTasks } from '../../lib/users'
import UserDetailClient from './UserDetailClient'

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
        <div className='rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400'>
          <h2 className='text-lg font-semibold'>Error</h2>
          <p className='mt-2'>User not found or you don&apos;t have permission to view this profile.</p>
          <Link href='/users' className='mt-4 inline-block text-sm font-medium underline dark:text-red-300'>
            Back to users
          </Link>
        </div>
      </AppShell>
    )
  }

  // Managers can only see data for workers
  const hasAccessToData = currentUser.role === 'admin' || (currentUser.role === 'manager' && user.role === 'worker')

  let projects: { id: number; name: string; status: string }[] = []
  let tasks: { id: number; name: string; status: string; deadline: string; days_overdue: number }[] = []
  let reports: Record<string, unknown> | null = null

  if (hasAccessToData) {
    try {
      const [projectsRes, tasksRes, reportsRes] = await Promise.all([
        fetchUserProjects(user.id) as Promise<{ id: number; name: string; status: string }[]>,
        fetchUserTasks(user.id) as Promise<{ id: number; name: string; status: string; deadline: string; days_overdue: number }[]>,
        fetchUserReports(user.id),
      ])
      projects = projectsRes
      tasks = tasksRes
      reports = reportsRes
    } catch (error) {
      console.error('Failed to fetch additional user data:', error)
    }
  }

  return (
    <AppShell currentUser={currentUser}>
      <UserDetailClient
        user={user}
        currentUserRole={currentUser.role}
        projects={projects}
        tasks={tasks}
        reports={reports}
      />
    </AppShell>
  )
}
