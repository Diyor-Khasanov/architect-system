'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createDailyReportAction } from '../actions/reports'
import { useToast } from '../context/ToastContext'
import { Project } from '../lib/projects'
import { Task } from '../lib/tasks'
import { Loader2, Send } from 'lucide-react'

interface DailyReportCreateFormProps {
  projects: Project[]
  tasks: Task[]
}

export default function DailyReportCreateForm({ projects, tasks }: DailyReportCreateFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [selectedProjectId, setSelectedProjectId] = useState<number | ''>('')

  const filteredTasks = tasks.filter(task =>
    selectedProjectId === '' || task.project_id === Number(selectedProjectId)
  )

  const [state, action, isPending] = useActionState(createDailyReportAction, null)

  useEffect(() => {
    if (state?.success) {
      toast('Daily report created successfully', 'success')
      router.push(`/daily-reports/${state.reportId}`)
    } else if (state?.error) {
      toast(state.error, 'error')
    }
  }, [state, toast, router])

  return (
    <form action={action} className='space-y-6'>
      <div className='grid gap-6 md:grid-cols-2'>
        <div className='space-y-2'>
          <label htmlFor='project_id' className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
            Project
          </label>
          <select
            id='project_id'
            name='project_id'
            required
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value ? Number(e.target.value) : '')}
            className='w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-100'
          >
            <option value=''>Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className='space-y-2'>
          <label htmlFor='task_id' className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
            Task
          </label>
          <select
            id='task_id'
            name='task_id'
            required
            className='w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-100'
          >
            <option value=''>Select a task</option>
            {filteredTasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='space-y-2'>
        <label htmlFor='text' className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
          Report Content
        </label>
        <textarea
          id='text'
          name='text'
          required
          rows={8}
          placeholder='What did you work on today?'
          className='w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-100'
        />
      </div>

      <div className='flex justify-end'>
        <button
          type='submit'
          disabled={isPending}
          className='flex items-center gap-2 rounded-xl bg-zinc-900 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
        >
          {isPending ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <Send className='h-4 w-4' />
          )}
          Submit Daily Report
        </button>
      </div>
    </form>
  )
}
