'use client'

import { useState, useActionState } from 'react'
import { Task, TaskStatus } from '../../lib/tasks'
import { Calendar, Tag, User, Folder, Clock, Edit2, CheckCircle2, Play, Search, StopCircle, Ban, AlertTriangle, ArrowRight, UserPlus, UserMinus } from 'lucide-react'
import Link from 'next/link'
import { updateTaskAction, updateTaskStatusAction, assignTaskWorkerAction, unassignTaskWorkerAction } from '../../actions/tasks'
import { useToast } from '../../context/ToastContext'
import { ProjectMember } from '../../lib/projects'

const STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  TODO: ['IN_PROGRESS', 'CANCELED'],
  IN_PROGRESS: ['REVIEW', 'BLOCKED', 'CANCELED'],
  REVIEW: ['DONE', 'IN_PROGRESS'],
  BLOCKED: ['IN_PROGRESS', 'CANCELED'],
  DONE: [],
  CANCELED: [],
}

const STATUS_COLORS: Record<TaskStatus, string> = {
  TODO: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  IN_PROGRESS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  REVIEW: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  DONE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  CANCELED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  BLOCKED: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
}

const STATUS_ICONS: Record<TaskStatus, any> = {
  TODO: Clock,
  IN_PROGRESS: Play,
  REVIEW: Search,
  DONE: CheckCircle2,
  CANCELED: Ban,
  BLOCKED: AlertTriangle,
}

export default function TaskDetailClient({
  task,
  currentUserId,
  currentUserRole,
  projectMembers = [],
}: {
  task: Task
  currentUserId: number
  currentUserRole: string
  projectMembers?: ProjectMember[]
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [assigningWorkerId, setAssigningWorkerId] = useState('')
  const [roleOnTask, setRoleOnTask] = useState('')
  const [isAssigning, setIsAssigning] = useState(false)
  const { toast } = useToast()
  const [updateState, updateAction, isPending] = useActionState(updateTaskAction.bind(null, task.id), null)

  const isManagerOrAdmin = currentUserRole === 'admin' || currentUserRole === 'manager'
  const isManager = currentUserRole === 'manager'
  const isAssignee = task.assignee_id === currentUserId
  const canUpdateStatus = isAssignee || isManagerOrAdmin
  const canEditTask = isManagerOrAdmin
  const canManageWorkers = isManager // Specific requirement: "for manager role only"

  // Handle case-insensitivity for status lookup
  const normalizedStatus = (task.status?.toUpperCase() || 'TODO') as TaskStatus
  const statusColor = STATUS_COLORS[normalizedStatus] || STATUS_COLORS.TODO
  const StatusIcon = STATUS_ICONS[normalizedStatus] || STATUS_ICONS.TODO

  async function handleStatusTransition(newStatus: TaskStatus) {
    const res = await updateTaskStatusAction(task.id, newStatus)
    if (res.error) {
      toast(res.error, 'error')
    } else {
      toast(`Task status updated to ${newStatus}`, 'success')
    }
  }

  async function handleAssignWorker() {
    if (!assigningWorkerId) return
    setIsAssigning(true)
    const res = await assignTaskWorkerAction(task.id, parseInt(assigningWorkerId), roleOnTask)
    setIsAssigning(false)
    if (res.error) {
      toast(res.error, 'error')
    } else {
      toast('Worker assigned successfully', 'success')
      setAssigningWorkerId('')
      setRoleOnTask('')
    }
  }

  async function handleUnassignWorker(userId: number) {
    const res = await unassignTaskWorkerAction(task.id, userId)
    if (res.error) {
      toast(res.error, 'error')
    } else {
      toast('Worker unassigned successfully', 'success')
    }
  }

  const allowedTransitions = STATUS_TRANSITIONS[normalizedStatus] || []

  if (isEditing) {
    return (
      <div className='max-w-4xl space-y-6'>
        <header className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
           <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400'>
              <Link href='/tasks' className='hover:text-zinc-900 dark:hover:text-zinc-100'>Tasks</Link>
              <span>/</span>
              <span className='text-zinc-900 dark:text-zinc-100'>Edit Task #{task.id}</span>
            </div>
            <button
              onClick={() => setIsEditing(false)}
              className='text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
            >
              Cancel
            </button>
          </div>

          <form action={async (formData) => {
            await updateAction(formData)
            setIsEditing(false)
            toast('Task updated successfully', 'success')
          }} className='space-y-4'>
            <div>
              <label htmlFor='title' className='block text-sm font-medium text-zinc-700 dark:text-zinc-300'>Title</label>
              <input
                type='text'
                name='title'
                id='title'
                defaultValue={task.title}
                required
                className='mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100'
              />
            </div>
            <div>
              <label htmlFor='description' className='block text-sm font-medium text-zinc-700 dark:text-zinc-300'>Description</label>
              <textarea
                name='description'
                id='description'
                rows={4}
                defaultValue={task.description}
                required
                className='mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100'
              />
            </div>
            <div>
              <label htmlFor='deadline' className='block text-sm font-medium text-zinc-700 dark:text-zinc-300'>Deadline</label>
              <input
                type='date'
                name='deadline'
                id='deadline'
                defaultValue={task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : ''}
                required
                className='mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100'
              />
            </div>
            <div className='pt-2'>
              <button
                type='submit'
                disabled={isPending}
                className='inline-flex justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </header>
      </div>
    )
  }

  return (
    <div className='max-w-4xl space-y-6'>
      <header className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400'>
            <Link href='/tasks' className='hover:text-zinc-900 dark:hover:text-zinc-100'>Tasks</Link>
            <span>/</span>
            <span className='text-zinc-900 dark:text-zinc-100'>Task #{task.id}</span>
          </div>
          {canEditTask && (
            <button
              onClick={() => setIsEditing(true)}
              className='flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
            >
              <Edit2 className='h-4 w-4' />
              Edit Task
            </button>
          )}
        </div>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>
              {task.title}
            </h1>
            <div className='mt-3 flex items-center gap-2'>
               <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}>
                <StatusIcon className='h-3.5 w-3.5' />
                <span className='uppercase'>{task.status.replace('_', ' ')}</span>
              </span>
              <span className='rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 uppercase'>
                {task.priority} Priority
              </span>
            </div>
          </div>
        </div>
        <p className='mt-6 text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap'>
          {task.description}
        </p>
      </header>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <aside className='md:col-span-1 space-y-6'>
          {canUpdateStatus && allowedTransitions.length > 0 && (
            <section className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
              <h2 className='text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4'>
                Update Status
              </h2>
              <div className='flex flex-col gap-2'>
                {allowedTransitions.map((status) => {
                  const Icon = STATUS_ICONS[status]
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusTransition(status)}
                      className='flex items-center justify-between rounded-lg border border-zinc-200 p-2.5 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800'
                    >
                      <span className='flex items-center gap-2 text-zinc-700 dark:text-zinc-300'>
                        <Icon className='h-4 w-4' />
                        {status.replace('_', ' ')}
                      </span>
                      <ArrowRight className='h-4 w-4 text-zinc-400' />
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          <section className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
            <h2 className='text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4'>
              Metadata
            </h2>
            <div className='space-y-4'>
              <div className='flex items-center gap-3 text-sm'>
                <Calendar className='h-4 w-4 text-zinc-400' />
                <span className='text-zinc-500 dark:text-zinc-400 w-20'>Deadline:</span>
                <span className='font-medium text-zinc-900 dark:text-zinc-100'>
                  {new Date(task.deadline).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </span>
              </div>
               <div className='flex items-center gap-3 text-sm'>
                <Folder className='h-4 w-4 text-zinc-400' />
                <span className='text-zinc-500 dark:text-zinc-400 w-20'>Project:</span>
                <Link href={`/projects/${task.project_id}`} className='font-medium text-zinc-900 hover:underline dark:text-zinc-100'>
                  Project #{task.project_id}
                </Link>
              </div>
            </div>
          </section>

          <section className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
            <h2 className='text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4'>
              Stakeholders
            </h2>
            <div className='space-y-4'>
              <div className='flex items-center gap-3 text-sm'>
                <User className='h-4 w-4 text-zinc-400' />
                <span className='text-zinc-500 dark:text-zinc-400 w-20'>Creator:</span>
                <span className='font-medium text-zinc-900 dark:text-zinc-100'>User #{task.creator_id}</span>
              </div>
              {task.assignee_id ? (
                <div className='flex items-center gap-3 text-sm'>
                  <User className='h-4 w-4 text-zinc-400' />
                  <span className='text-zinc-500 dark:text-zinc-400 w-20'>Assignee:</span>
                  <span className='font-medium text-zinc-900 dark:text-zinc-100'>User #{task.assignee_id}</span>
                </div>
              ) : (
                <div className='flex items-center gap-3 text-sm'>
                  <User className='h-4 w-4 text-zinc-400' />
                  <span className='text-zinc-500 dark:text-zinc-400 w-20'>Assignee:</span>
                  <span className='italic text-zinc-400'>Unassigned</span>
                </div>
              )}
            </div>
          </section>
        </aside>

        <main className='md:col-span-2 space-y-6'>
          {canManageWorkers && (
            <section className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
              <h2 className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4'>
                Worker Management
              </h2>
              <div className='space-y-6'>
                <div className='flex flex-col gap-4 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800'>
                  <h3 className='text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2'>
                    <UserPlus className='h-4 w-4 text-zinc-400' />
                    Assign New Worker
                  </h3>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-xs text-zinc-500 mb-1'>Worker</label>
                      <select
                        value={assigningWorkerId}
                        onChange={(e) => setAssigningWorkerId(e.target.value)}
                        className='w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100'
                      >
                        <option value=''>Select a worker...</option>
                        {projectMembers
                          .filter((m) => m.user_id !== task.assignee_id)
                          .map((member) => (
                            <option key={member.user_id} value={member.user_id}>
                              {member.full_name || `User #${member.user_id}`}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label className='block text-xs text-zinc-500 mb-1'>Role on task</label>
                      <input
                        type='text'
                        value={roleOnTask}
                        onChange={(e) => setRoleOnTask(e.target.value)}
                        placeholder='e.g. Developer, QA'
                        className='w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100'
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAssignWorker}
                    disabled={!assigningWorkerId || isAssigning}
                    className='w-full sm:w-auto inline-flex justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
                  >
                    {isAssigning ? 'Assigning...' : 'Assign Worker'}
                  </button>
                </div>

                {task.assignee_id && (
                  <div className='space-y-3'>
                    <h3 className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>Current Assignee</h3>
                    <div className='flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800'>
                      <div className='flex items-center gap-3'>
                        <div className='h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center'>
                          <User className='h-4 w-4 text-zinc-500' />
                        </div>
                        <div>
                          <p className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
                            {projectMembers.find((m) => m.user_id === task.assignee_id)?.full_name || `User #${task.assignee_id}`}
                          </p>
                          <p className='text-xs text-zinc-500'>Assigned Worker</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUnassignWorker(task.assignee_id!)}
                        className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:text-red-400 dark:hover:bg-red-950/30'
                        title='Unassign Worker'
                      >
                        <UserMinus className='h-5 w-5' />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

           <section className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
            <h2 className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4'>
              Timeline
            </h2>
            <div className='space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-zinc-200 dark:before:bg-zinc-800'>
               <div className='relative pl-8'>
                <div className='absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900' />
                <p className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>Task updated</p>
                <p className='text-xs text-zinc-500 dark:text-zinc-400'>{new Date(task.updated_at).toLocaleString()}</p>
              </div>
              <div className='relative pl-8'>
                <div className='absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900' />
                <p className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>Task created</p>
                <p className='text-xs text-zinc-500 dark:text-zinc-400'>{new Date(task.created_at).toLocaleString()}</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
