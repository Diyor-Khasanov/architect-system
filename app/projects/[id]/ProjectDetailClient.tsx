'use client'

import { useActionState, useState, useTransition, useCallback } from 'react'
import {
  updateProjectAction,
  assignProjectManagerAction,
  acceptProjectAction,
} from '../../actions/projects'
import { cn } from '../../lib/utils'
import { Edit, Play, Pause, CheckCircle2, Trash2, UserPlus, Plus } from 'lucide-react'
import type { Project } from '../../lib/projects'
import type { MeResponse } from '../../lib/auth'
import { useToast } from '../../context/ToastContext'
import TaskCreateForm from '../../components/TaskCreateForm'

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
  assigned: <UserPlus className='h-4 w-4' />,
  active: <Play className='h-4 w-4' />,
  completed: <CheckCircle2 className='h-4 w-4' />,
  on_hold: <Pause className='h-4 w-4' />,
  archived: <Trash2 className='h-4 w-4' />,
  accept: <CheckCircle2 className='h-4 w-4' />,
}

interface ProjectDetailClientProps {
  project: Project
  currentUser: MeResponse
  id: string
  availableManagers: { id: number; username: string; full_name: string }[]
  progress?: number | null
}

export default function ProjectDetailClient({
  project,
  currentUser,
  id,
  availableManagers,
  progress,
}: ProjectDetailClientProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { confirm, toast } = useToast()

  const updateProjectWithId = updateProjectAction.bind(null, id)
  const [updateState, updateFormAction] = useActionState(updateProjectWithId, {})

  const assignManagerWithId = assignProjectManagerAction.bind(null, id)
  const [assignState] = useActionState(assignManagerWithId, {})

  const acceptProjectWithId = acceptProjectAction.bind(null, id)
  const [acceptState] = useActionState(acceptProjectWithId, {})

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

  const handleAcceptProject = async () => {
    startTransition(async () => {
      const result = await acceptProjectWithId({})
      if (result.success) {
        toast('Project accepted successfully', 'success')
      } else if (result.error) {
        toast(result.error, 'error')
      }
    })
  }

  const handleTaskSuccess = useCallback(() => {
    setShowTaskForm(false)
  }, [])

  const currentStatus = project.status.toLowerCase()
  const transitions = STATUS_TRANSITIONS[currentStatus] || []

  return (
    <div className='space-y-6'>
      <header className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
        <div className='flex flex-col md:flex-row md:items-start justify-between gap-4'>
          <div className='flex-1'>
            {isEditing ? (
              <form
                action={updateFormAction}
                className='space-y-4'
                onSubmit={() => setIsEditing(false)}
              >
                <input
                  name='name'
                  defaultValue={project.name}
                  className='block w-full text-2xl md:text-3xl font-semibold tracking-tight border-b border-zinc-300 bg-transparent text-zinc-900 focus:outline-none focus:border-zinc-900 dark:border-zinc-700 dark:text-zinc-100 dark:focus:border-zinc-500'
                />
                <textarea
                  name='description'
                  defaultValue={project.description}
                  className='mt-2 block w-full text-sm text-zinc-600 border border-zinc-200 rounded-md p-2 focus:outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:focus:border-zinc-700'
                  rows={3}
                />
                <div>
                  <label className='block text-xs font-medium text-zinc-500 uppercase mb-1 dark:text-zinc-400'>
                    Manager
                  </label>
                  <select
                    name='manager_id'
                    defaultValue={project.manager_id}
                    className='block w-full text-sm border border-zinc-200 rounded-md p-2 focus:outline-none focus:border-zinc-900 bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-700'
                  >
                    {availableManagers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.full_name} ({m.username})
                      </option>
                    ))}
                  </select>
                </div>

                <div className='flex gap-2'>
                  <button
                    type='submit'
                    className='rounded-md bg-zinc-900 px-3 py-1 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900'
                  >
                    Save
                  </button>
                  <button
                    type='button'
                    onClick={() => setIsEditing(false)}
                    className='rounded-md border border-zinc-200 px-3 py-1 text-xs font-medium dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className='flex items-center gap-4'>
                  <h1 className='text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>
                    {project.name}
                  </h1>
                  {progress !== null && progress !== undefined && (
                    <div className='flex flex-col'>
                      <span className='text-xs font-medium text-zinc-500 uppercase dark:text-zinc-400'>
                        Progress
                      </span>
                      <div className='flex items-center gap-2'>
                        <div className='h-2 w-24 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden'>
                          <div
                            className='h-full bg-emerald-500 transition-all duration-500'
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className='text-sm font-semibold text-emerald-600 dark:text-emerald-400'>
                          {progress}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <p className='mt-2 text-sm text-zinc-600 dark:text-zinc-400'>{project.description}</p>
              </>
            )}
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium border ${
                project.status === 'active'
                  ? 'bg-emerald-100 text-emerald-700'
                  : project.status === 'completed'
                    ? 'bg-purple-100 text-purple-700'
                    : project.status === 'on_hold'
                      ? 'bg-amber-100 text-amber-700'
                      : project.status === 'assigned'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-zinc-100 text-zinc-700'
              }`}
            >
              {STATUS_LABELS[project.status.toLowerCase()] || project.status}
            </span>

            {!isEditing && (
              <div className='flex flex-wrap gap-2'>
                {isManager &&
                  currentStatus === 'assigned' &&
                  project.manager_id === currentUser.id && (
                    <button
                      disabled={isPending}
                      onClick={handleAcceptProject}
                      className='flex items-center gap-1 rounded-md border border-emerald-200 bg-white px-3 py-1 text-sm font-medium text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900 dark:bg-zinc-900 dark:text-emerald-400 dark:hover:bg-emerald-950/30 disabled:opacity-50'
                    >
                      {STATUS_ICONS.accept}
                      Accept Project
                    </button>
                  )}

                {canUpdateStatus &&
                  transitions.map((status) => (
                    <button
                      key={status}
                      disabled={isPending}
                      onClick={() => handleStatusUpdate(status)}
                      className={cn(
                        'flex items-center gap-1 rounded-md border px-3 py-1 text-sm font-medium transition-colors disabled:opacity-50',
                        status === 'archived'
                          ? 'border-red-200 bg-white text-red-600 hover:bg-red-50 dark:border-red-900 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950/30'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                      )}
                    >
                      {STATUS_ICONS[status]}
                      {BUTTON_LABELS[status] || status}
                    </button>
                  ))}

                {isAdmin && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className='flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                  >
                    <Edit className='h-4 w-4' /> Edit
                  </button>
                )}

                {isManager && (
                  <button
                    onClick={() => setShowTaskForm(!showTaskForm)}
                    className='flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                  >
                    <Plus className='h-4 w-4' /> {showTaskForm ? 'Cancel' : 'Create Task'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        {(updateState?.error || assignState?.error || acceptState?.error) && (
          <p className='mt-4 text-sm text-red-600'>
            {updateState?.error || assignState?.error || acceptState?.error}
          </p>
        )}
      </header>

      {showTaskForm && isManager && (
        <div className='animate-in fade-in slide-in-from-top-4 duration-300'>
          <TaskCreateForm
            projectId={id}
            onSuccess={handleTaskSuccess}
          />
        </div>
      )}
    </div>
  )
}
