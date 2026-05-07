'use client'

import { useState, useTransition } from 'react'
import { HelpRequest } from '../../lib/help-requests'
import { Calendar, User, HelpCircle, ArrowLeft, Clock, CheckCircle2, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { MeResponse } from '../../lib/auth'
import { assignHelpRequestAction, resolveHelpRequestAction } from '../../actions/help-requests'

export default function HelpRequestDetailClient({
  helpRequest,
  currentUser,
}: {
  helpRequest: HelpRequest
  currentUser: MeResponse
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const isManagerOrAdmin = currentUser.role === 'manager' || currentUser.role === 'admin'
  const isResolvable = helpRequest.status.toLowerCase() !== 'resolved' && helpRequest.status.toLowerCase() !== 'completed'

  const handleAssign = () => {
    setError(null)
    startTransition(async () => {
      const result = await assignHelpRequestAction(helpRequest.id)
      if (result.error) {
        setError(result.error)
      }
    })
  }

  const handleResolve = () => {
    setError(null)
    startTransition(async () => {
      const result = await resolveHelpRequestAction(helpRequest.id)
      if (result.error) {
        setError(result.error)
      }
    })
  }

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

        <div className='flex flex-col md:flex-row md:items-start justify-between gap-4'>
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

          {isManagerOrAdmin && isResolvable && (
            <div className='flex items-center gap-3'>
              <button
                onClick={handleAssign}
                disabled={isPending}
                className='flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-all hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800'
              >
                <UserPlus className='h-4 w-4' />
                Assign to Me
              </button>
              <button
                onClick={handleResolve}
                disabled={isPending}
                className='flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
              >
                <CheckCircle2 className='h-4 w-4' />
                Resolve
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className='mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400'>
            {error}
          </div>
        )}

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
