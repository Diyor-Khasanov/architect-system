import { redirect } from 'next/navigation'
import AppShell from '../../components/AppShell'
import { fetchCurrentUser } from '../../lib/auth'
import { fetchProject, type Project } from '../../lib/projects'
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

  if (!['admin', 'manager', 'worker'].includes(currentUser.role)) {
    redirect('/dashboard')
  }

  let project: Project | null = null
  try {
    project = await fetchProject(id)
  } catch {
    // Error handled by null check below
  }

  if (
    project &&
    currentUser.role === 'worker' &&
    !project.members?.some((member) => member.user_id === currentUser.id)
  ) {
    return (
      <AppShell currentUser={currentUser}>
        <div className='rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-700'>
          <h2 className='text-lg font-semibold'>Access Denied</h2>
          <p className='mt-2'>You do not have permission to view this project.</p>
        </div>
      </AppShell>
    )
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
        <ProjectDetailClient project={project} currentUser={currentUser} id={id} />

        <div className='grid gap-6 lg:grid-cols-3'>
          <article className='lg:col-span-2 space-y-6'>
            <div className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'>
              <h2 className='text-lg font-semibold tracking-tight'>Project Progress</h2>
              <div className='mt-4'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm font-medium text-zinc-700'>{project.progress ?? 0}% Complete</span>
                </div>
                <div className='w-full bg-zinc-100 rounded-full h-2.5'>
                  <div
                    className='bg-zinc-900 h-2.5 rounded-full transition-all duration-500'
                    style={{ width: `${project.progress ?? 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

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
