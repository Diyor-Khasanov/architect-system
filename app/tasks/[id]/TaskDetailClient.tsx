'use client'

import { Task } from '../../lib/tasks'
import { Calendar, Tag, User, Folder, Clock } from 'lucide-react'
import Link from 'next/link'

export default function TaskDetailClient({ task }: { task: Task }) {
  return (
    <div className='max-w-4xl space-y-6'>
      <header className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
        <div className='flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-4'>
          <Link href='/tasks' className='hover:text-zinc-900 dark:hover:text-zinc-100'>Tasks</Link>
          <span>/</span>
          <span className='text-zinc-900 dark:text-zinc-100'>Task #{task.id}</span>
        </div>
        <h1 className='text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>
          {task.title}
        </h1>
        <p className='mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed'>
          {task.description}
        </p>
      </header>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <aside className='md:col-span-1 space-y-6'>
          <section className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
            <h2 className='text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4'>
              Properties
            </h2>
            <div className='space-y-4'>
              <div className='flex items-center gap-3 text-sm'>
                <Tag className='h-4 w-4 text-zinc-400' />
                <span className='text-zinc-500 dark:text-zinc-400'>Status:</span>
                <span className='font-medium capitalize text-zinc-900 dark:text-zinc-100'>{task.status}</span>
              </div>
              <div className='flex items-center gap-3 text-sm'>
                <Clock className='h-4 w-4 text-zinc-400' />
                <span className='text-zinc-500 dark:text-zinc-400'>Priority:</span>
                <span className='font-medium capitalize text-zinc-900 dark:text-zinc-100'>{task.priority}</span>
              </div>
              <div className='flex items-center gap-3 text-sm'>
                <Calendar className='h-4 w-4 text-zinc-400' />
                <span className='text-zinc-500 dark:text-zinc-400'>Deadline:</span>
                <span className='font-medium text-zinc-900 dark:text-zinc-100'>
                  {new Date(task.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
          </section>

          <section className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
            <h2 className='text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4'>
              Links
            </h2>
            <div className='space-y-4'>
              <div className='flex items-center gap-3 text-sm'>
                <Folder className='h-4 w-4 text-zinc-400' />
                <span className='text-zinc-500 dark:text-zinc-400'>Project:</span>
                <Link href={`/projects/${task.project_id}`} className='font-medium text-zinc-900 hover:underline dark:text-zinc-100'>
                  Project #{task.project_id}
                </Link>
              </div>
              <div className='flex items-center gap-3 text-sm'>
                <User className='h-4 w-4 text-zinc-400' />
                <span className='text-zinc-500 dark:text-zinc-400'>Creator:</span>
                <span className='font-medium text-zinc-900 dark:text-zinc-100'>User #{task.creator_id}</span>
              </div>
              {task.assignee_id && (
                <div className='flex items-center gap-3 text-sm'>
                  <User className='h-4 w-4 text-zinc-400' />
                  <span className='text-zinc-500 dark:text-zinc-400'>Assignee:</span>
                  <span className='font-medium text-zinc-900 dark:text-zinc-100'>User #{task.assignee_id}</span>
                </div>
              )}
            </div>
          </section>
        </aside>

        <main className='md:col-span-2 space-y-6'>
           <section className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
            <h2 className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4'>
              Activity
            </h2>
            <p className='text-sm text-zinc-500 dark:text-zinc-400 italic'>
              Task created on {new Date(task.created_at).toLocaleString()}
            </p>
          </section>
        </main>
      </div>
    </div>
  )
}
