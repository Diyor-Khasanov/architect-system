import { fetchCurrentUser } from '../../lib/auth'
import { fetchProjects } from '../../lib/projects'
import { fetchMyTasks } from '../../lib/tasks'
import DailyReportCreateForm from '../../components/DailyReportCreateForm'
import { redirect, notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import AppShell from '../../components/AppShell'

export default async function CreateDailyReportPage({
  searchParams,
}: {
  searchParams: Promise<{ project_id?: string; task_id?: string }>
}) {
  const currentUser = await fetchCurrentUser()
  if (!currentUser) {
    redirect('/login')
  }

  if (currentUser.role !== 'worker') {
    notFound()
  }

  const projects = await fetchProjects()
  const tasks = await fetchMyTasks()
  const { project_id, task_id } = await searchParams

  return (
    <AppShell currentUser={currentUser}>
      <div className='mx-auto max-w-4xl'>
        <div className='mb-8'>
          <Link
            href='/daily-reports'
            className='mb-4 flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to Reports
          </Link>
          <h1 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100'>Submit Daily Report</h1>
          <p className='text-zinc-500 dark:text-zinc-400'>Record your work for today&apos;s assigned tasks.</p>
        </div>

        <div className='rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
          <DailyReportCreateForm
            projects={projects}
            tasks={tasks}
            defaultProjectId={project_id ? Number(project_id) : undefined}
            defaultTaskId={task_id ? Number(task_id) : undefined}
          />
        </div>
      </div>
    </AppShell>
  )
}
