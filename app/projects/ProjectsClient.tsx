'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProjectCreateForm from '../components/ProjectCreateForm'
import { type Project } from '../lib/projects'
import { type MeResponse } from '../lib/auth'
import { Plus } from 'lucide-react'

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  assigned: 'Assigned',
  on_hold: 'Paused',
  active: 'Active',
  completed: 'Success',
  archived: 'Deleted',
}

export default function ProjectsClient({
  projects,
  currentUser,
  fetchError,
  availableManagers = [],
}: {
  projects: Project[]
  currentUser: MeResponse
  fetchError?: string
  availableManagers?: { id: number; username: string; full_name: string }[]
}) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const router = useRouter()

  const handleActionSuccess = () => {
    router.refresh()
    setShowCreateForm(false)
  }

  return (
    <section className='space-y-6'>
      <header className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
        <div>
          <h1 className='text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>
            Projects
          </h1>
          <p className='mt-2 text-sm text-zinc-600 dark:text-zinc-400'>
            Project list and management workspace (create + monitor projects).
          </p>
        </div>
        {currentUser.role === 'admin' && (
          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm)
            }}
            className='flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900'
          >
            <Plus className='h-4 w-4' />
            {showCreateForm ? 'Close Form' : 'Add Project'}
          </button>
        )}
      </header>

      {showCreateForm && (
        <div className='animate-in fade-in slide-in-from-top-4 duration-300'>
          <ProjectCreateForm onSuccess={handleActionSuccess} availableManagers={availableManagers} />
        </div>
      )}

      <article className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
        <h2 className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>
          Project list
        </h2>

        {fetchError ? (
          <p className='mt-3 text-sm text-red-600 dark:text-red-400'>{fetchError}</p>
        ) : null}

        {!fetchError && projects.length === 0 ? (
          <p className='mt-3 text-sm text-zinc-500 dark:text-zinc-400'>No projects found.</p>
        ) : null}

        {!fetchError && projects.length > 0 ? (
          <div className='mt-4 overflow-x-auto -mx-5 px-5'>
            <table className='w-full min-w-[600px] text-left text-sm'>
              <thead className='border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400'>
                <tr>
                  <th className='px-2 py-3'>ID</th>
                  <th className='px-2 py-3'>Name</th>
                  <th className='px-2 py-3 text-center'>Members</th>
                  <th className='px-2 py-3'>Manager</th>
                  <th className='px-2 py-3'>Status</th>
                  <th className='px-2 py-3'>Deadline</th>
                  <th className='px-2 py-3'>Created</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className='border-b border-zinc-100 transition-colors hover:bg-zinc-50/50 dark:border-zinc-800 dark:hover:bg-zinc-800/50'
                  >
                    <td className='px-2 py-3 text-zinc-500 dark:text-zinc-400'>{project.id}</td>
                    <td className='px-2 py-3'>
                      <Link
                        href={`/projects/${project.id}`}
                        className='font-medium text-zinc-900 hover:underline dark:text-zinc-100 dark:hover:text-zinc-300'
                      >
                        {project.name}
                      </Link>
                      <p className='text-xs text-zinc-500 dark:text-zinc-400'>
                        {project.description}
                      </p>
                    </td>
                    <td className='px-2 py-3 text-center text-zinc-600 dark:text-zinc-300'>
                      {project.members?.length ?? 0}
                    </td>
                    <td className='px-2 py-3 text-zinc-600 dark:text-zinc-300'>
                      {availableManagers.find((m) => m.id === project.manager_id)?.full_name ||
                        `#${project.manager_id}`}
                    </td>
                    <td className='px-2 py-3'>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          project.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : project.status === 'completed'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                              : project.status === 'on_hold'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                : project.status === 'assigned'
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                  : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        {STATUS_LABELS[project.status.toLowerCase()] || project.status}
                      </span>
                    </td>
                    <td className='px-2 py-3 text-zinc-600 dark:text-zinc-300'>
                      {new Date(project.deadline).toLocaleDateString()}
                    </td>
                    <td className='px-2 py-3 text-zinc-500 dark:text-zinc-400'>
                      {new Date(project.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </article>
    </section>
  )
}
