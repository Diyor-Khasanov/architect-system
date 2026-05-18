import { redirect } from 'next/navigation'
import AppShell from '../../components/AppShell'
import { fetchCurrentUser } from '../../lib/auth'
import { fetchProject, fetchProjectMembers, type Project, type ProjectMember } from '../../lib/projects'
import { fetchUsers, type User } from '../../lib/users'
import ProjectDetailClient from './ProjectDetailClient'
import ProjectMembersClient from './ProjectMembersClient'
import ProjectDailyReportsClient from './ProjectDailyReportsClient'
import { fetchDailyReports, type DailyReport } from '../../lib/reports'
import { fetchTasks } from '../../lib/tasks'

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params
  const currentUser = await fetchCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  if (!['admin', 'manager'].includes(currentUser.role)) {
    redirect('/dashboard')
  }

  let project: Project | null = null
  let members: ProjectMember[] = []
  let managers: { id: number; username: string; full_name: string }[] = []
  let availableWorkers: User[] = []
  let dailyReports: DailyReport[] = []
  let taskNameMap: Record<number, string> = {}
  let userNameMap: Record<number, string> = {}

  try {
    project = await fetchProject(id)
    const [fetchedMembers, allDailyReports, allTasks, allUsers] = await Promise.all([
      fetchProjectMembers(id).catch(() => []),
      fetchDailyReports().catch(() => []),
      fetchTasks().catch(() => []),
      fetchUsers().catch(() => [])
    ])

    members = fetchedMembers
    dailyReports = (allDailyReports as DailyReport[]).filter(
      (dr) => dr.project_id === Number(id)
    )
    taskNameMap = Object.fromEntries((allTasks as { id: number; title: string }[]).map((t) => [t.id, t.title]))
    userNameMap = Object.fromEntries(
      (allUsers as User[]).map((u) => [
        u.id,
        u.profile?.full_name || u.username,
      ])
    )

    if (['admin', 'manager'].includes(currentUser.role)) {
      managers = (allUsers as User[])
        .filter((u) => u.role === 'manager')
        .map((u) => ({
          id: u.id,
          username: u.username,
          full_name: u.profile?.full_name || u.username,
        }))

      availableWorkers = (allUsers as User[]).filter((u) => u.role === 'worker')
    }
  } catch {
    // Error handled by null check below
  }


  if (!project) {
    return (
      <AppShell currentUser={currentUser}>
        <div className='rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400'>
          <h2 className='text-lg font-semibold'>Error</h2>
          <p className='mt-2'>Failed to load project details. It might not exist or you don&apos;t have permission.</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell currentUser={currentUser}>
      <section className='space-y-6'>
        <ProjectDetailClient
          project={project}
          currentUser={currentUser}
          id={id}
          availableManagers={managers}
          members={members}
        />

        <div className='grid gap-6 lg:grid-cols-3'>
          <article className='lg:col-span-2 space-y-6'>
            <ProjectDailyReportsClient
              reports={dailyReports}
              userNameMap={userNameMap}
              taskNameMap={taskNameMap}
            />

            <ProjectMembersClient
              projectId={id}
              members={members}
              availableWorkers={availableWorkers}
              canManage={['admin', 'manager'].includes(currentUser.role)}
            />
          </article>

          <aside className='space-y-6'>
            <div className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
              <h2 className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>Details</h2>
              <dl className='mt-4 space-y-4 text-sm'>
                <div>
                  <dt className='text-zinc-500 dark:text-zinc-400'>Project ID</dt>
                  <dd className='font-medium text-zinc-900 dark:text-zinc-100'>{project.id}</dd>
                </div>
                <div>
                  <dt className='text-zinc-500 dark:text-zinc-400'>Manager</dt>
                  <dd className='font-medium text-zinc-900 dark:text-zinc-100'>
                    {managers.find((m) => m.id === project?.manager_id)?.full_name ||
                      `#${project.manager_id}`}
                  </dd>
                </div>
                <div>
                  <dt className='text-zinc-500 dark:text-zinc-400'>Deadline</dt>
                  <dd className='font-medium text-zinc-900 dark:text-zinc-100'>
                    {new Date(project.deadline).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </dd>
                </div>
                <div>
                  <dt className='text-zinc-500 dark:text-zinc-400'>Created At</dt>
                  <dd className='font-medium text-zinc-900 dark:text-zinc-100'>
                    {new Date(project.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  )
}
