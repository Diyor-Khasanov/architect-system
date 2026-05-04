import { redirect } from 'next/navigation'
import AppShell from '../../components/AppShell'
import { fetchCurrentUser } from '../../lib/auth'
import { fetchProject, type Project } from '../../lib/projects'
import { fetchUsers } from '../../lib/users'
import ProjectDetailClient from './ProjectDetailClient'

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
  let managers: { id: number; username: string; full_name: string }[] = []
  try {
    project = await fetchProject(id)
    if (currentUser.role === 'admin') {
      const allUsers = await fetchUsers()
      managers = allUsers
        .filter((u) => u.role === 'manager')
        .map((u) => ({
          id: u.id,
          username: u.username,
          full_name: u.profile?.full_name || u.username,
        }))
    }
  } catch {
    // Error handled by null check below
  }


  if (!project) {
    return (
      <AppShell currentUser={currentUser}>
        <div className='rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700'>
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
        />

        <div className='grid gap-6 lg:grid-cols-3'>
          <article className='lg:col-span-2 space-y-6'>
            <div className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'>
              <h2 className='text-lg font-semibold tracking-tight'>Team Members</h2>
              <div className='mt-4 overflow-x-auto'>
                <table className='w-full text-left text-sm'>
                  <thead className='border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500'>
                    <tr>
                      <th className='px-2 py-3'>Name</th>
                      <th className='px-2 py-3'>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.members && project.members.length > 0 ? (
                      project.members.map((member) => (
                        <tr key={member.user_id} className='border-b border-zinc-100'>
                          <td className='px-2 py-3 font-medium text-zinc-900'>{member.full_name}</td>
                          <td className='px-2 py-3 text-zinc-600 capitalize'>{member.role}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className='px-2 py-4 text-center text-zinc-500'>
                          No members assigned to this project yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </article>

          <aside className='space-y-6'>
            <div className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'>
              <h2 className='text-lg font-semibold tracking-tight'>Details</h2>
              <dl className='mt-4 space-y-4 text-sm'>
                <div>
                  <dt className='text-zinc-500'>Project ID</dt>
                  <dd className='font-medium text-zinc-900'>{project.id}</dd>
                </div>
                <div>
                  <dt className='text-zinc-500'>Manager ID</dt>
                  <dd className='font-medium text-zinc-900'>{project.manager_id}</dd>
                </div>
                <div>
                  <dt className='text-zinc-500'>Deadline</dt>
                  <dd className='font-medium text-zinc-900'>
                    {new Date(project.deadline).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </dd>
                </div>
                <div>
                  <dt className='text-zinc-500'>Created At</dt>
                  <dd className='font-medium text-zinc-900'>
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
