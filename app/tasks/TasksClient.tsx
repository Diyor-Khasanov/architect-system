'use client'

import { Task, TaskStatus } from '../lib/tasks'
import Link from 'next/link'
import { CheckCircle2, Circle, Clock, AlertCircle, Play, Search, Ban, AlertTriangle, LucideIcon } from 'lucide-react'

const STATUS_ICONS: Record<TaskStatus, LucideIcon> = {
  TODO: Clock,
  IN_PROGRESS: Play,
  REVIEW: Search,
  DONE: CheckCircle2,
  CANCELED: Ban,
  BLOCKED: AlertTriangle,
}

const STATUS_COLORS: Record<TaskStatus, string> = {
  TODO: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  IN_PROGRESS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  REVIEW: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  DONE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  CANCELED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  BLOCKED: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
}

export default function TasksClient({
  tasks,
  fetchError,
  title = 'Tasks',
  subtitle = 'Overview of all tasks across projects.',
}: {
  tasks: Task[]
  fetchError?: string
  title?: string
  subtitle?: string
}) {
  return (
    <section className='space-y-6'>
      <header className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
        <div>
          <h1 className='text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>
            {title}
          </h1>
          <p className='mt-2 text-sm text-zinc-600 dark:text-zinc-400'>
            {subtitle}
          </p>
        </div>
      </header>

      <article className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
        <h2 className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>
          Task list
        </h2>

        {fetchError ? (
          <p className='mt-3 text-sm text-red-600 dark:text-red-400'>{fetchError}</p>
        ) : null}

        {!fetchError && tasks.length === 0 ? (
          <p className='mt-3 text-sm text-zinc-500 dark:text-zinc-400'>No tasks found.</p>
        ) : null}

        {!fetchError && tasks.length > 0 ? (
          <div className='mt-4 overflow-x-auto -mx-5 px-5'>
            <table className='w-full min-w-[600px] text-left text-sm'>
              <thead className='border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400'>
                <tr>
                  <th className='px-2 py-3'>ID</th>
                  <th className='px-2 py-3'>Title</th>
                  <th className='px-2 py-3'>Status</th>
                  <th className='px-2 py-3'>Priority</th>
                  <th className='px-2 py-3'>Deadline</th>
                  <th className='px-2 py-3'>Project ID</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const normalizedStatus = (task.status?.toUpperCase() || 'TODO') as TaskStatus
                  const Icon = STATUS_ICONS[normalizedStatus] || Clock
                  const statusColor = STATUS_COLORS[normalizedStatus] || STATUS_COLORS.TODO

                  return (
                    <tr
                      key={task.id}
                      className='border-b border-zinc-100 transition-colors hover:bg-zinc-50/50 dark:border-zinc-800 dark:hover:bg-zinc-800/50'
                    >
                      <td className='px-2 py-3 text-zinc-500 dark:text-zinc-400'>{task.id}</td>
                      <td className='px-2 py-3'>
                        <Link
                          href={`/tasks/${task.id}`}
                          className='font-medium text-zinc-900 hover:underline dark:text-zinc-100 dark:hover:text-zinc-300'
                        >
                          {task.title}
                        </Link>
                        <p className='text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[200px]'>
                          {task.description}
                        </p>
                      </td>
                      <td className='px-2 py-3'>
                        <div className='flex items-center gap-1.5'>
                           <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${statusColor}`}>
                            <Icon className='h-3 w-3' />
                            <span className='uppercase'>{task.status.replace('_', ' ')}</span>
                          </span>
                        </div>
                      </td>
                      <td className='px-2 py-3'>
                        <span className={`rounded-full px-2 py-0.5 text-xs ${
                          task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          task.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className='px-2 py-3 text-zinc-600 dark:text-zinc-300'>
                        {new Date(task.deadline).toLocaleDateString()}
                      </td>
                      <td className='px-2 py-3 text-zinc-600 dark:text-zinc-300'>
                        <Link href={`/projects/${task.project_id}`} className='hover:underline'>
                          #{task.project_id}
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </article>
    </section>
  )
}
