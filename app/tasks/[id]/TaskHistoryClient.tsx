'use client'

import { TaskHistoryEntry } from '../../lib/tasks'
import { History, User, Clock, Tag, AlertCircle } from 'lucide-react'

export default function TaskHistoryClient({ history }: { history: TaskHistoryEntry[] }) {
  if (!history || history.length === 0) {
    return (
      <section className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
        <h2 className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4'>
          Task History
        </h2>
        <p className='text-sm text-zinc-500 dark:text-zinc-400'>No history events found for this task.</p>
      </section>
    )
  }

  return (
    <section className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
      <h2 className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2'>
        <History className='h-5 w-5 text-zinc-400' />
        Task History
      </h2>
      <div className='space-y-6 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-zinc-200 dark:before:bg-zinc-800'>
        {history.map((entry) => (
          <div key={entry.id} className='relative pl-10'>
            <div className='absolute left-0 top-1.5 h-5 w-5 rounded-full border-2 border-zinc-200 bg-white flex items-center justify-center dark:border-zinc-800 dark:bg-zinc-900'>
               <div className='h-1.5 w-1.5 rounded-full bg-zinc-400' />
            </div>
            <div className='flex flex-col gap-1'>
              <div className='flex items-center justify-between gap-4'>
                 <p className='text-sm font-medium text-zinc-900 dark:text-zinc-100 capitalize'>
                  {entry.action.replace(/_/g, ' ')}
                </p>
                <time className='text-xs text-zinc-500 dark:text-zinc-400'>
                  {new Date(entry.created_at).toLocaleString()}
                </time>
              </div>
              <div className='flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400'>
                <User className='h-3 w-3' />
                <span>User #{entry.user_id}</span>
              </div>

              {entry.changes && Object.keys(entry.changes).length > 0 && (
                <div className='mt-2 rounded-lg bg-zinc-50 p-2.5 dark:bg-zinc-800/50'>
                  <ul className='space-y-1'>
                    {Object.entries(entry.changes).map(([key, value]) => (
                      <li key={key} className='text-xs flex items-start gap-2'>
                        <Tag className='h-3 w-3 mt-0.5 text-zinc-400' />
                        <span className='font-medium text-zinc-600 dark:text-zinc-300 capitalize'>{key.replace(/_/g, ' ')}:</span>
                        <span className='text-zinc-500 dark:text-zinc-400 break-all'>
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
