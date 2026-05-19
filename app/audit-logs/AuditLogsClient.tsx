'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Eye, Calendar, Activity } from 'lucide-react'
import type { AuditLog } from '../lib/audit-logs'

interface AuditLogsClientProps {
  logs: AuditLog[]
}

export default function AuditLogsClient({ logs }: AuditLogsClientProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredLogs = logs.filter((log) => {
    const searchString = `${log.action} ${log.resource} ${log.user_id}`.toLowerCase()
    return searchString.includes(searchTerm.toLowerCase())
  })

  return (
    <div className='space-y-6'>
      <header className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-zinc-900 dark:text-zinc-100'>Audit Logs</h1>
          <p className='text-sm text-zinc-500 dark:text-zinc-400'>Monitor system activity and user actions.</p>
        </div>
      </header>

      <div className='rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
        <div className='relative max-w-md'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400' />
          <input
            type='text'
            placeholder='Search logs...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full rounded-lg border border-zinc-200 bg-transparent py-2 pl-10 pr-4 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-700'
          />
        </div>
      </div>

      <div className='overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
            <thead className='border-b border-zinc-200 bg-zinc-50/50 text-xs uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400'>
              <tr>
                <th className='px-6 py-4 font-medium'>Action</th>
                <th className='px-6 py-4 font-medium'>Resource</th>
                <th className='px-6 py-4 font-medium'>Timestamp</th>
                <th className='px-6 py-4 font-medium'>Details</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-zinc-200 dark:divide-zinc-800'>
              {filteredLogs.map((log) => (
                <tr key={log.id} className='transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50'>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-2'>
                      <Activity className='h-4 w-4 text-zinc-400' />
                      <span className='font-medium text-zinc-900 dark:text-zinc-100'>{log.action}</span>
                    </div>
                  </td>
                  <td className='px-6 py-4 text-zinc-600 dark:text-zinc-400'>
                    {log.resource} {log.resource_id && `(#${log.resource_id})`}
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-2 text-zinc-600 dark:text-zinc-400'>
                      <Calendar className='h-3.5 w-3.5' />
                      <span>{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <Link
                      href={`/audit-logs/${log.id}`}
                      className='inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                    >
                      <Eye className='h-4 w-4' />
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className='px-6 py-10 text-center text-zinc-500 dark:text-zinc-400'>
                    No audit logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
