import { fetchCurrentUser, type UserRole } from '../lib/auth'
import { fetchDashboardData } from '../lib/dashboard'

function formatStats(role: UserRole, data: Record<string, number> | null) {
  if (!data) return []

  switch (role) {
    case 'admin':
      return [
        { title: 'Total Users', value: data.total_users?.toString() || '0' },
        { title: 'Active Users', value: data.active_users?.toString() || '0' },
        { title: 'Total Projects', value: data.total_projects?.toString() || '0' },
        { title: 'Active Projects', value: data.active_projects?.toString() || '0' },
        { title: 'Total Tasks', value: data.total_tasks?.toString() || '0' },
        { title: 'Completed Tasks', value: data.completed_tasks?.toString() || '0' },
        { title: 'Pending Help Requests', value: data.pending_help_requests?.toString() || '0' },
      ]
    case 'manager':
      return [
        { title: 'Total Projects', value: data.total_projects?.toString() || '0' },
        { title: 'Active Projects', value: data.active_projects?.toString() || '0' },
        { title: 'Total Workers', value: data.total_workers?.toString() || '0' },
        { title: 'Total Tasks', value: data.total_tasks?.toString() || '0' },
        { title: 'Completed Tasks', value: data.completed_tasks?.toString() || '0' },
        { title: 'Pending Help Requests', value: data.pending_help_requests?.toString() || '0' },
      ]
    case 'worker':
      return [
        { title: 'Total Assigned Tasks', value: data.total_assigned_tasks?.toString() || '0' },
        { title: 'Active Tasks', value: data.active_tasks?.toString() || '0' },
        { title: 'Completed Tasks', value: data.completed_tasks?.toString() || '0' },
        { title: 'Blocked Tasks', value: data.blocked_tasks?.toString() || '0' },
        { title: 'Overdue Tasks', value: data.overdue_tasks?.toString() || '0' },
        { title: 'Pending Help Requests', value: data.pending_help_requests?.toString() || '0' },
      ]
    default:
      return []
  }
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const currentUser = await fetchCurrentUser()

  if (!currentUser) {
    return null
  }

  const dashboardData = await fetchDashboardData(currentUser.role)
  const stats = formatStats(currentUser.role, dashboardData)

  return (
    <section className='space-y-6'>
      <header className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
        <p className='text-sm text-zinc-500 dark:text-zinc-400'>Welcome back</p>
        <h1 className='mt-1 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>
          {currentUser.profile?.full_name ?? currentUser.username}
        </h1>
      </header>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {stats.map((stat) => (
          <article
            key={stat.title}
            className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'
          >
            <p className='text-sm text-zinc-500 dark:text-zinc-400'>{stat.title}</p>
            <p className='mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>{stat.value}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
