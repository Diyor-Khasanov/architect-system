import { fetchCurrentUser, type UserRole } from '../lib/auth'

const roleContent: Record<
  UserRole,
  {
    headline: string
    description: string
    stats: { title: string; value: string; hint: string }[]
  }
> = {
  admin: {
    headline: 'Platform Control Center',
    description: 'Manage users, monitor activity, and keep operations healthy across all projects.',
    stats: [
      { title: 'Total Users', value: '142', hint: '+12 this month' },
      { title: 'Open Projects', value: '19', hint: '4 need approval' },
      { title: 'System Health', value: '99.9%', hint: 'No incident today' },
    ],
  },
  manager: {
    headline: 'Project Delivery Dashboard',
    description: 'Track project status and assign priorities efficiently.',
    stats: [
      { title: 'Managed Projects', value: '8', hint: '2 due this week' },
      { title: 'Pending Reviews', value: '11', hint: '5 high priority' },
    ],
  },
  worker: {
    headline: 'My Work Dashboard',
    description: 'Focus on assigned tasks, upcoming deadlines, and progress on your deliverables.',
    stats: [
      { title: 'Assigned Tasks', value: '14', hint: '4 due today' },
      { title: 'In Progress', value: '6', hint: '2 blocked' },
      { title: 'Completed', value: '37', hint: 'This quarter' },
    ],
  },
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const currentUser = await fetchCurrentUser()

  if (!currentUser) {
    return null
  }

  const activeRoleContent = roleContent[currentUser.role]

  return (
    <section className='space-y-6'>
      <header className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
        <p className='text-sm text-zinc-500 dark:text-zinc-400'>Welcome back</p>
        <h1 className='mt-1 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>
          {currentUser.profile?.full_name ?? currentUser.username}
        </h1>
        <p className='mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400'>{activeRoleContent.description}</p>
      </header>

      <div className='grid gap-4 md:grid-cols-3'>
        {activeRoleContent.stats.map((stat) => (
          <article
            key={stat.title}
            className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'
          >
            <p className='text-sm text-zinc-500 dark:text-zinc-400'>{stat.title}</p>
            <p className='mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>{stat.value}</p>
            <p className='mt-1 text-xs text-zinc-400 dark:text-zinc-500'>{stat.hint}</p>
          </article>
        ))}
      </div>

      <article className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
        <h2 className='text-lg font-semibold text-zinc-900 dark:text-zinc-100'>{activeRoleContent.headline}</h2>
        <p className='mt-2 text-sm text-zinc-600 dark:text-zinc-400'>
          This view is automatically tailored using <code className='text-zinc-900 dark:text-zinc-100'>role = {currentUser.role}</code> from{' '}
          <code className='text-zinc-900 dark:text-zinc-100'>/api/v1/auth/me</code>. Plug real backend metrics into these cards next.
        </p>
      </article>
    </section>
  )
}
