'use client'

import { useState } from 'react'
import { HelpRequest } from '../../lib/help-requests'
import { HelpCircle, Plus, X, ArrowRight } from 'lucide-react'
import HelpRequestCreateForm from '../../components/HelpRequestCreateForm'
import Link from 'next/link'

export default function TaskHelpRequestsClient({
  taskId,
  helpRequests,
  canCreate,
}: {
  taskId: number
  helpRequests: HelpRequest[]
  canCreate: boolean
}) {
  const [isCreating, setIsCreating] = useState(false)

  return (
    <section className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>
          Help Requests
        </h2>
        {canCreate && (
          <button
            onClick={() => setIsCreating(!isCreating)}
            className='flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900'
          >
            {isCreating ? (
              <>
                <X className='h-3.5 w-3.5' />
                Cancel
              </>
            ) : (
              <>
                <Plus className='h-3.5 w-3.5' />
                Request Help
              </>
            )}
          </button>
        )}
      </div>

      {isCreating && (
        <div className='mb-6'>
          <HelpRequestCreateForm
            tasks={[]}
            taskId={taskId}
            onSuccess={() => setIsCreating(false)}
          />
        </div>
      )}

      {helpRequests.length === 0 ? (
        <p className='text-sm text-zinc-500 dark:text-zinc-400'>No help requests for this task.</p>
      ) : (
        <div className='overflow-x-auto -mx-5 px-5'>
          <table className='w-full text-left text-sm'>
            <thead className='border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400'>
              <tr>
                <th className='px-2 py-3'>ID</th>
                <th className='px-2 py-3'>Title</th>
                <th className='px-2 py-3'>Status</th>
                <th className='px-2 py-3'>Created</th>
                <th className='px-2 py-3 text-right'>Action</th>
              </tr>
            </thead>
            <tbody>
              {helpRequests.map((request) => (
                <tr
                  key={request.id}
                  className='border-b border-zinc-100 transition-colors hover:bg-zinc-50/50 dark:border-zinc-800 dark:hover:bg-zinc-800/50'
                >
                  <td className='px-2 py-3 text-zinc-500 dark:text-zinc-400'>{request.id}</td>
                  <td className='px-2 py-3'>
                    <div className='flex items-center gap-2'>
                      <HelpCircle className='h-4 w-4 text-zinc-400' />
                      <span className='font-medium text-zinc-900 dark:text-zinc-100'>{request.title}</span>
                    </div>
                  </td>
                  <td className='px-2 py-3'>
                    <span className='rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 uppercase font-medium'>
                      {request.status}
                    </span>
                  </td>
                  <td className='px-2 py-3 text-zinc-500 dark:text-zinc-400'>
                    {new Date(request.created_at).toLocaleDateString()}
                  </td>
                  <td className='px-2 py-3 text-right'>
                    <Link
                      href={`/help-requests/${request.id}`}
                      className='inline-flex items-center gap-1 text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-100'
                    >
                      View
                      <ArrowRight className='h-4 w-4' />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
