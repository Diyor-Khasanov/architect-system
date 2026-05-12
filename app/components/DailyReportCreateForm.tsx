'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createDailyReportAction } from '../actions/reports'
import { useToast } from '../context/ToastContext'
import { Project } from '../lib/projects'
import { Task } from '../lib/tasks'
import { Loader2, Send } from 'lucide-react'
import Combobox from './Combobox'

interface DailyReportCreateFormProps {
  projects: Project[]
  tasks: Task[]
  defaultProjectId?: number
  defaultTaskId?: number
}

export default function DailyReportCreateForm({
  projects,
  tasks,
  defaultProjectId,
  defaultTaskId,
}: DailyReportCreateFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [selectedProjectId, setSelectedProjectId] = useState<number | ''>(defaultProjectId || '')
  const [selectedTaskId, setSelectedTaskId] = useState<number | ''>(defaultTaskId || '')

  const filteredTasks = tasks.filter(
    (task) => selectedProjectId === '' || task.project_id === Number(selectedProjectId)
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
          <Combobox
            name='project_id'
            options={projects.map((p) => ({ id: p.id, label: p.name }))}
            value={selectedProjectId}
            onChange={(val) => {
              setSelectedProjectId(val as number)
              setSelectedTaskId('') // Reset task when project changes
            }}
            placeholder='Select a project'
          />
        </div>

        <div className='space-y-2'>
          <label htmlFor='task_id' className='text-sm font-medium text-zinc-900 dark:text-zinc-100'>
            Task
          </label>
          <Combobox
            name='task_id'
            options={filteredTasks.map((t) => ({ id: t.id, label: t.title }))}
            value={selectedTaskId}
            onChange={(val) => setSelectedTaskId(val as number)}
            placeholder='Select a task'
          />
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
