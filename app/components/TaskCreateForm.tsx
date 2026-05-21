'use client'

import { useActionState } from 'react'
import { createTaskAction } from '../actions/tasks'
import { useToast } from '../context/ToastContext'
import { useEffect } from 'react'
import type { ProjectMember } from '../lib/projects'
import Combobox from './Combobox'

export default function TaskCreateForm({
  projectId,
  members = [],
  onSuccess
}: {
  projectId: string | number,
  members?: ProjectMember[],
  onSuccess: () => void
}) {
  const { toast } = useToast()
  const [state, formAction, isPending] = useActionState(
    (prevState: unknown, formData: FormData) => createTaskAction(projectId, prevState, formData),
    null
  )

  useEffect(() => {
    if (state?.success) {
      toast('Task created successfully!', 'success')
      onSuccess()
    } else if (state?.error) {
      toast(state.error, 'error')
    }
  }, [state, toast, onSuccess])

  return (
    <form action={formAction} className='space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50'>
      <h3 className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>
        Create New Task
      </h3>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <label htmlFor='title' className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>
            Title
          </label>
          <input
            id='title'
            name='title'
            type='text'
            required
            className='w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:ring-zinc-100'
            placeholder='Task title'
          />
        </div>

        <div className='space-y-2'>
          <label htmlFor='deadline' className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>
            Deadline
          </label>
          <input
            id='deadline'
            name='deadline'
            type='datetime-local'
            required
            className='w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:ring-zinc-100'
          />
        </div>

        <div className='space-y-2 md:col-span-2'>
          <label htmlFor='assignee_id' className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>
            Assignee
          </label>
          <Combobox
            id='assignee_id'
            name='assignee_id'
            required
            placeholder='Select a worker...'
            options={members.map((member) => ({
              id: member.user_id,
              label: member.full_name,
            }))}
          />
        </div>
      </div>

      <div className='space-y-2'>
        <label htmlFor='description' className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>
          Description
        </label>
        <textarea
          id='description'
          name='description'
          required
          rows={3}
          className='w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:ring-zinc-100'
          placeholder='Detailed task description...'
        />
      </div>

      <div className='flex justify-end'>
        <button
          type='submit'
          disabled={isPending}
          className='rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900'
        >
          {isPending ? 'Creating...' : 'Create Task'}
        </button>
      </div>
    </form>
  )
}
