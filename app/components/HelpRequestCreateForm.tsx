'use client'

import { useActionState } from 'react'
import { createHelpRequestAction } from '../actions/help-requests'
import { useToast } from '../context/ToastContext'
import { useEffect } from 'react'
import { Task } from '../lib/tasks'
import Combobox from './Combobox'

export default function HelpRequestCreateForm({
  tasks,
  onSuccess,
  taskId
}: {
  tasks: Task[],
  onSuccess: () => void,
  taskId?: number
}) {
  const { toast } = useToast()
  const [state, formAction, isPending] = useActionState(
    (prevState: unknown, formData: FormData) => createHelpRequestAction(prevState, formData),
    null
  )

  useEffect(() => {
    if (state?.success) {
      toast('Help request created successfully!', 'success')
      onSuccess()
    } else if (state?.error) {
      toast(state.error, 'error')
    }
  }, [state, toast, onSuccess])

  return (
    <form action={formAction} className='space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50'>
      <h3 className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>
        {taskId ? `Request Help for Task #${taskId}` : 'Create New Help Request'}
      </h3>

      {taskId ? (
        <input type="hidden" name="task_id" value={taskId} />
      ) : (
        <div className='space-y-2'>
          <label htmlFor='task_id' className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>
            Related Task
          </label>
          <Combobox
            name='task_id'
            required
            placeholder='Select a task...'
            options={[
              ...tasks.map((task) => ({
                id: task.id,
                label: `#${task.id} - ${task.title}`,
              })),
              { id: 0, label: 'General / No specific task' }
            ]}
          />
        </div>
      )}

      <div className='flex justify-end'>
        <button
          type='submit'
          disabled={isPending}
          className='rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900'
        >
          {isPending ? 'Creating...' : 'Submit Help Request'}
        </button>
      </div>
    </form>
  )
}
