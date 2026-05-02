'use client'

import { useActionState, useState } from 'react'
import { updateProjectAction } from '../../actions/projects'
import { cn } from '../../lib/utils'
import { Edit } from 'lucide-react'
import type { Project } from '../../lib/projects'
import type { MeResponse } from '../../lib/auth'

interface ProjectDetailClientProps {
  project: Project
  currentUser: MeResponse
  id: string
}

export default function ProjectDetailClient({ project, currentUser, id }: ProjectDetailClientProps) {
  const [isEditing, setIsEditing] = useState(false)

  const updateProjectWithId = updateProjectAction.bind(null, id)
  const [updateState, updateFormAction] = useActionState(updateProjectWithId, {})

  const isAdmin = currentUser.role === 'admin'

  return (
    <header className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'>
      <div className='flex flex-col md:flex-row md:items-start justify-between gap-4'>
        <div className='flex-1'>
          {isEditing ? (
            <form action={updateFormAction} className='space-y-4' onSubmit={() => setIsEditing(false)}>
              <input
                name='name'
                defaultValue={project.name}
                className='block w-full text-2xl md:text-3xl font-semibold tracking-tight border-b border-zinc-300 focus:outline-none focus:border-zinc-900'
              />
              <textarea
                name='description'
                defaultValue={project.description}
                className='mt-2 block w-full text-sm text-zinc-600 border border-zinc-200 rounded-md p-2 focus:outline-none focus:border-zinc-900'
                rows={3}
              />
              <div className='flex gap-2'>
                <button
                  type='submit'
                  className='rounded-md bg-zinc-900 px-3 py-1 text-xs font-medium text-white'
                >
                  Save
                </button>
                <button
                  type='button'
                  onClick={() => setIsEditing(false)}
                  className='rounded-md border border-zinc-200 px-3 py-1 text-xs font-medium'
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h1 className='text-2xl md:text-3xl font-semibold tracking-tight'>{project.name}</h1>
              <p className='mt-2 text-sm text-zinc-600'>{project.description}</p>
            </>
          )}
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <span
            className={cn(
              'inline-flex rounded-full px-3 py-1 text-sm font-medium capitalize',
              project.status === 'active' || project.status === 'doing'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : project.status === 'completed' || project.status === 'done'
                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
            )}
          >
            {project.status}
          </span>

          {isAdmin && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className='flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm font-medium hover:bg-zinc-50'
            >
              <Edit className='h-4 w-4' /> Edit
            </button>
          )}
        </div>
      </div>
      {updateState?.error && <p className='mt-4 text-sm text-red-600'>{updateState.error}</p>}
    </header>
  )
}
