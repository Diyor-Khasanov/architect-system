'use client'

import { HelpRequest } from '../lib/help-requests'
import { HelpCircle } from 'lucide-react'

export default function HelpRequestsClient({
  helpRequests,
  fetchError,
}: {
  helpRequests: HelpRequest[]
  fetchError?: string
}) {
  return (
    <section className='space-y-6'>
      <header className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
        <div>
          <h1 className='text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>
            Help Requests
          </h1>
          <p className='mt-2 text-sm text-zinc-600 dark:text-zinc-400'>
            View and manage help requests from across the platform.
          </p>
        </div>
      </header>

      <article className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
        <h2 className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>
          Request list
        </h2>

        {fetchError ? (
          <p className='mt-3 text-sm text-red-600 dark:text-red-400'>{fetchError}</p>
        ) : null}

        {!fetchError && helpRequests.length === 0 ? (
          <p className='mt-3 text-sm text-zinc-500 dark:text-zinc-400'>No help requests found.</p>
        ) : null}

        {!fetchError && helpRequests.length > 0 ? (
          <div className='mt-4 overflow-x-auto -mx-5 px-5'>
            <table className='w-full min-w-[600px] text-left text-sm'>
              <thead className='border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400'>
                <tr>
                  <th className='px-2 py-3'>ID</th>
                  <th className='px-2 py-3'>Title</th>
                  <th className='px-2 py-3'>Status</th>
                  <th className='px-2 py-3'>Priority</th>
                  <th className='px-2 py-3'>User ID</th>
                  <th className='px-2 py-3'>Created</th>
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
                        <div>
                          <p className='font-medium text-zinc-900 dark:text-zinc-100'>{request.title}</p>
                          <p className='text-xs text-zinc-500 dark:text-zinc-400'>{request.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className='px-2 py-3'>
                      <span className='rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'>
                        {request.status}
                      </span>
                    </td>
                    <td className='px-2 py-3'>
                      <span className='rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'>
                        {request.priority}
                      </span>
                    </td>
                    <td className='px-2 py-3 text-zinc-600 dark:text-zinc-300'>{request.user_id}</td>
                    <td className='px-2 py-3 text-zinc-500 dark:text-zinc-400'>
                      {new Date(request.created_at).toLocaleDateString()}
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
