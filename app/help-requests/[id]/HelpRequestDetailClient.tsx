'use client'

import { HelpRequest } from '../../lib/help-requests'
import { Calendar, User, HelpCircle, ArrowLeft, Clock } from 'lucide-react'
import Link from 'next/link'

export default function HelpRequestDetailClient({
  helpRequest,
}: {
  helpRequest: HelpRequest
}) {
  return (
    <div className='max-w-4xl space-y-6'>
      <header className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400'>
            <Link href='/help-requests' className='hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1'>
              <ArrowLeft className='h-4 w-4' />
              Back to Requests
            </Link>
            <span>/</span>
            <span className='text-zinc-900 dark:text-zinc-100'>Request #{helpRequest.id}</span>
          </div>
        </div>

        <div className='flex items-start justify-between gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>
              {helpRequest.title}
            </h1>
            <div className='mt-3 flex items-center gap-2'>
              <span className='inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 uppercase'>
                <HelpCircle className='h-3.5 w-3.5' />
                {helpRequest.status}
              </span>
              <span className='rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 uppercase'>
                {helpRequest.priority} Priority
              </span>
            </div>
          </div>
        </div>

        <p className='mt-6 text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap'>
          {helpRequest.description}
        </p>
      </header>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <aside className='md:col-span-1 space-y-6'>
          <section className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
            <h2 className='text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4'>
              Metadata
            </h2>
            <div className='space-y-4'>
              <div className='flex items-center gap-3 text-sm'>
                <Calendar className='h-4 w-4 text-zinc-400' />
                <span className='text-zinc-500 dark:text-zinc-400 w-20'>Created:</span>
                <span className='font-medium text-zinc-900 dark:text-zinc-100'>
                  {new Date(helpRequest.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </span>
              </div>
              <div className='flex items-center gap-3 text-sm'>
                <Clock className='h-4 w-4 text-zinc-400' />
                <span className='text-zinc-500 dark:text-zinc-400 w-20'>Updated:</span>
                <span className='font-medium text-zinc-900 dark:text-zinc-100'>
                  {new Date(helpRequest.updated_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </span>
              </div>
            </div>
          </section>

          <section className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
            <h2 className='text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4'>
              Requester
            </h2>
            <div className='space-y-4'>
              <div className='flex items-center gap-3 text-sm'>
                <User className='h-4 w-4 text-zinc-400' />
                <span className='text-zinc-500 dark:text-zinc-400 w-20'>User ID:</span>
                <span className='font-medium text-zinc-900 dark:text-zinc-100'>#{helpRequest.user_id}</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
