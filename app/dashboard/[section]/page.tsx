import Link from 'next/link'

const sectionNames: Record<string, string> = {
  users: 'Users',
  projects: 'Projects',
  analytics: 'Analytics',
  team: 'Team',
  reports: 'Reports',
  tasks: 'Tasks',
}

export default async function DashboardSectionPage({
  params,
}: {
  params: Promise<{ section: string }>
}) {
  const { section } = await params
  const title = sectionNames[section] ?? 'Section'

  return (
    <section className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
      <h1 className='text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>{title}</h1>
      <p className='mt-3 text-sm text-zinc-600 dark:text-zinc-400'>
        This {title.toLowerCase()} module is ready for backend integration.
      </p>
      <Link
        href='/dashboard'
        className='mt-6 inline-block text-sm font-medium text-zinc-900 underline dark:text-zinc-100'
      >
        Back to dashboard
      </Link>
    </section>
  )
}
