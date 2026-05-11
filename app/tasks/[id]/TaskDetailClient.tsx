'use client'

import { useState, useActionState, useCallback } from 'react'
import { Task, TaskStatus, TaskAssignment, TaskHistoryEntry } from '../../lib/tasks'
import { Project, ProjectMember } from '../../lib/projects'
import { HelpRequest } from '../../lib/help-requests'
import { Calendar, User, Folder, Clock, Edit2, CheckCircle2, Play, Search, Ban, AlertTriangle, ArrowRight, HelpCircle, X } from 'lucide-react'
import Link from 'next/link'
import { updateTaskAction, updateTaskStatusAction } from '../../actions/tasks'
import { useToast } from '../../context/ToastContext'
import TaskAssignmentsClient from './TaskAssignmentsClient'
import TaskHistoryClient from './TaskHistoryClient'
import HelpRequestCreateForm from '../../components/HelpRequestCreateForm'
import TaskReportClient from './TaskReportClient'
import { Report } from '../../lib/reports'
import { FileResponse } from '../../lib/files'

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

import { LucideIcon } from 'lucide-react'

const STATUS_ICONS: Record<TaskStatus, LucideIcon> = {
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
  assignments,
  projectMembers,
  history,
  helpRequests,
  project,
  userNameMap,
  report,
  reportFiles,
}: {
  task: Task
  currentUserId: number
  currentUserRole: string
  assignments: TaskAssignment[]
  projectMembers: ProjectMember[]
  history: TaskHistoryEntry[]
  helpRequests: HelpRequest[]
  project?: Project
  userNameMap: Record<number, string>
  report: Report | null
  reportFiles: FileResponse[]
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [isRequestingHelp, setIsRequestingHelp] = useState(false)
  const { toast } = useToast()
  const [, updateAction, isPending] = useActionState(updateTaskAction.bind(null, task.id), null)

  const isManagerOrAdmin = currentUserRole === 'admin' || currentUserRole === 'manager'
  const isWorkerOnTask = assignments.some((a) => a.user_id === currentUserId)
  const canUpdateStatus = isWorkerOnTask || isManagerOrAdmin
  const canEditTask = isManagerOrAdmin

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

  const handleHelpSuccess = useCallback(() => {
    setIsRequestingHelp(false)
  }, [])

  const taskHelpRequests = helpRequests.filter((hr) => hr.task_id === task.id)

  const allowedTransitions = STATUS_TRANSITIONS[normalizedStatus] || []

  if (isEditing) {
    return (
      <div className='max-w-7xl space-y-6'>
        <header className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
           <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400'>
              <Link href='/tasks' className='hover:text-zinc-900 dark:hover:text-zinc-100'>Tasks</Link>
              <span>/</span>
            {project && (
               <>
                <span className='truncate max-w-[100px] md:max-w-[200px]'>{project.name}</span>
                <span>/</span>
               </>
            )}
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
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
              <div>
                <label htmlFor='priority' className='block text-sm font-medium text-zinc-700 dark:text-zinc-300'>Priority</label>
                <select
                  name='priority'
                  id='priority'
                  defaultValue={task.priority}
                  required
                  className='mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100'
                >
                  <option value='low'>Low</option>
                  <option value='medium'>Medium</option>
                  <option value='high'>High</option>
                </select>
              </div>
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
    <div className='max-w-7xl space-y-6'>
      <header className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400'>
            <Link href='/tasks' className='hover:text-zinc-900 dark:hover:text-zinc-100'>Tasks</Link>
            <span>/</span>
            {project && (
               <>
                <span className='truncate max-w-[100px] md:max-w-[200px]'>{project.name}</span>
                <span>/</span>
               </>
            )}
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
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium uppercase ${
                task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                task.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}>
                {task.priority} Priority
              </span>
            </div>
          </div>
        </div>
        <p className='mt-6 text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap'>
          {task.description}
        </p>
      </header>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        <aside className='lg:col-span-1 space-y-6'>
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
                {isManagerOrAdmin ? (
                  <Link href={`/projects/${task.project_id || 0}`} className='font-medium text-zinc-900 hover:underline dark:text-zinc-100'>
                    {project?.name || `Project #${task.project_id || 'undefined'}`}
                  </Link>
                ) : (
                  <span className='font-medium text-zinc-900 dark:text-zinc-100'>
                    {project?.name || `Project #${task.project_id || 'undefined'}`}
                  </span>
                )}
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
                <span className='font-medium text-zinc-900 dark:text-zinc-100 truncate'>
                  {userNameMap[task.creator_id] || `User #${task.creator_id || 'undefined'}`}
                </span>
              </div>
              {task.assignee_id ? (
                <div className='flex items-center gap-3 text-sm'>
                  <User className='h-4 w-4 text-zinc-400' />
                  <span className='text-zinc-500 dark:text-zinc-400 w-20'>Assignee:</span>
                  <span className='font-medium text-zinc-900 dark:text-zinc-100 truncate'>
                    {userNameMap[task.assignee_id] || `User #${task.assignee_id}`}
                  </span>
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

        <main className='lg:col-span-3 space-y-6'>
          <TaskReportClient
            taskId={task.id}
            report={report}
            files={reportFiles}
            canEdit={currentUserRole === 'worker' && isWorkerOnTask}
          />

          <TaskAssignmentsClient
            taskId={task.id}
            assignments={assignments}
            projectMembers={projectMembers}
            canManage={isManagerOrAdmin}
          />

          <section className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>
                Help Requests
              </h2>
              {currentUserRole === 'worker' && (
                <button
                  onClick={() => setIsRequestingHelp(!isRequestingHelp)}
                  className='flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
                >
                  {isRequestingHelp ? (
                    <>
                      <X className='h-4 w-4' />
                      Cancel
                    </>
                  ) : (
                    <>
                      <HelpCircle className='h-4 w-4' />
                      Need Help?
                    </>
                  )}
                </button>
              )}
            </div>

            {isRequestingHelp && (
              <div className='mb-6'>
                <HelpRequestCreateForm tasks={[]} taskId={task.id} onSuccess={handleHelpSuccess} />
              </div>
            )}

            {taskHelpRequests.length === 0 ? (
              <p className='text-sm text-zinc-500 dark:text-zinc-400 italic'>
                No help requests created for this task yet.
              </p>
            ) : (
              <div className='space-y-4'>
                {taskHelpRequests.map((request) => (
                  <div
                    key={request.id}
                    className='flex items-center justify-between rounded-xl border border-zinc-100 p-4 transition-colors hover:bg-zinc-50/50 dark:border-zinc-800 dark:hover:bg-zinc-800/50'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='rounded-full bg-zinc-100 p-2 dark:bg-zinc-800'>
                        <HelpCircle className='h-4 w-4 text-zinc-500' />
                      </div>
                      <div>
                        <div className='flex items-center gap-2'>
                          <p className='font-medium text-zinc-900 dark:text-zinc-100'>
                            {request.title || `Help Request #${request.id}`}
                          </p>
                          <span className='rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 uppercase'>
                            {request.status}
                          </span>
                        </div>
                        <p className='text-xs text-zinc-500 dark:text-zinc-400'>
                          Created on {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/help-requests/${request.id}`}
                      className='text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-100'
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>

          <TaskHistoryClient history={history} userNameMap={userNameMap} />
        </main>
      </div>
    </div>
  )
}
