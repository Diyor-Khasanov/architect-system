'use client'

import { useActionState, useState, useTransition } from 'react'
import { updateProjectAction } from '../../actions/projects'
import { cn } from '../../lib/utils'
import { Edit, Play, Pause, CheckCircle2, Trash2, UserPlus } from 'lucide-react'
import type { Project } from '../../lib/projects'
import type { MeResponse } from '../../lib/auth'
import { useToast } from '../../context/ToastContext'

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  assigned: 'Assigned',
  active: 'Active',
  completed: 'Success',
  on_hold: 'Paused',
  archived: 'Deleted',
}

const BUTTON_LABELS: Record<string, string> = {
  assigned: 'Assign',
  active: 'Activate',
  completed: 'Success',
  on_hold: 'Pause',
  archived: 'Delete',
}

const STATUS_TRANSITIONS: Record<string, string[]> = {
  draft: ['assigned', 'archived'],
  assigned: ['active', 'on_hold', 'archived'],
  active: ['completed', 'on_hold', 'archived'],
  on_hold: ['active', 'archived'],
  completed: ['archived'],
  archived: [],
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  assigned: <UserPlus className="h-4 w-4" />,
  active: <Play className="h-4 w-4" />,
  completed: <CheckCircle2 className="h-4 w-4" />,
  on_hold: <Pause className="h-4 w-4" />,
  archived: <Trash2 className="h-4 w-4" />,
}

interface ProjectDetailClientProps {
  project: Project
  currentUser: MeResponse
  id: string
}

export default function ProjectDetailClient({ project, currentUser, id }: ProjectDetailClientProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { confirm, toast } = useToast()

  const updateProjectWithId = updateProjectAction.bind(null, id)
  const [updateState, updateFormAction] = useActionState(updateProjectWithId, {})

  const isAdmin = currentUser.role === 'admin'
  const isManager = currentUser.role === 'manager'
  const canUpdateStatus = isAdmin || isManager

  const handleStatusUpdate = async (newStatus: string) => {
    if (newStatus === 'archived') {
      const confirmed = await confirm(
        'Are you sure you want to delete this project? This action acts as a soft delete (archived).',
        'Confirm Deletion'
      )
      if (!confirmed) return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append('status', newStatus)
      const result = await updateProjectWithId({}, formData)
      if (result.success) {
        toast(`Project status updated to ${STATUS_LABELS[newStatus] || newStatus}`, 'success')
      } else if (result.error) {
        toast(result.error, 'error')
      }
    })
  }

  const currentStatus = project.status.toLowerCase()
  const transitions = STATUS_TRANSITIONS[currentStatus] || []

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
              'inline-flex rounded-full px-3 py-1 text-sm font-medium border',
              currentStatus === 'active' || currentStatus === 'doing'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                : currentStatus === 'completed' || currentStatus === 'done'
                ? 'bg-blue-50 text-blue-700 border-blue-100'
                : currentStatus === 'on_hold'
                ? 'bg-amber-50 text-amber-700 border-amber-100'
                : currentStatus === 'archived'
                ? 'bg-red-50 text-red-700 border-red-100'
                : 'bg-zinc-100 text-zinc-700 border-zinc-200'
            )}
          >
            {STATUS_LABELS[currentStatus] || project.status}
          </span>

          {!isEditing && (
            <div className='flex flex-wrap gap-2'>
              {canUpdateStatus &&
                transitions.map((status) => (
                  <button
                    key={status}
                    disabled={isPending}
                    onClick={() => handleStatusUpdate(status)}
                    className={cn(
                      'flex items-center gap-1 rounded-md border px-3 py-1 text-sm font-medium transition-colors disabled:opacity-50',
                      status === 'archived'
                        ? 'border-red-200 bg-white text-red-600 hover:bg-red-50'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                    )}
                  >
                    {STATUS_ICONS[status]}
                    {BUTTON_LABELS[status] || status}
                  </button>
                ))}

              {isAdmin && (
                <button
                  onClick={() => setIsEditing(true)}
                  className='flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm font-medium hover:bg-zinc-50'
                >
                  <Edit className='h-4 w-4' /> Edit
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {updateState?.error && <p className='mt-4 text-sm text-red-600'>{updateState.error}</p>}
    </header>
  )
}
