'use client'

import { useActionState, useTransition } from 'react'
import { assignTaskWorkerAction, unassignTaskWorkerAction } from '../../actions/tasks'
import type { TaskAssignment } from '../../lib/tasks'
import type { ProjectMember } from '../../lib/projects'
import { UserPlus, UserMinus, Loader2 } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import Combobox from '../../components/Combobox'

interface TaskAssignmentsClientProps {
  taskId: number | string
  assignments: TaskAssignment[]
  projectMembers: ProjectMember[]
  canManage: boolean
}

export default function TaskAssignmentsClient({
  taskId,
  assignments,
  projectMembers,
  canManage,
}: TaskAssignmentsClientProps) {
  const { toast, confirm } = useToast()
  const [isUnassigning, startTransition] = useTransition()

  const assignWorkerWithId = assignTaskWorkerAction.bind(null, taskId)
  const [assignState, assignFormAction, isAssigning] = useActionState(assignWorkerWithId, null)

  const isPending = isAssigning || isUnassigning

  const handleUnassignWorker = async (userId: number, fullName: string) => {
    const confirmed = await confirm(
      `Are you sure you want to unassign ${fullName} from this task?`,
      'Unassign Worker'
    )
    if (!confirmed) return

    startTransition(async () => {
      const result = await unassignTaskWorkerAction(taskId, userId)
      if (result.success) {
        toast('Worker unassigned successfully', 'success')
      } else if (result.error) {
        toast(result.error, 'error')
      }
    })
  }

  // Filter project members who are not already assigned to the task
  const assignedUserIds = new Set(assignments.map((a) => a.user_id))
  const selectableWorkers = projectMembers.filter((m) => !assignedUserIds.has(m.user_id))

  return (
    <div className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
      <div className='flex items-center justify-between gap-4 flex-wrap'>
        <h2 className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>Task Assignments</h2>

        {canManage && selectableWorkers.length > 0 && (
          <form action={assignFormAction} className='flex items-center gap-2 flex-wrap'>
            <Combobox
              name='user_id'
              required
              placeholder='Select a worker...'
              className='min-w-[200px]'
              options={selectableWorkers.map((member) => ({
                id: member.user_id,
                label: member.full_name,
              }))}
            />
            <input
              name='role_on_task'
              type='text'
              placeholder='Role (e.g. Developer)'
              required
              className='rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100'
            />
            <button
              type='submit'
              disabled={isPending}
              className='inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
            >
              {isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : <UserPlus className='h-4 w-4' />}
              Assign
            </button>
          </form>
        )}
      </div>

      {assignState?.error && (
        <p className='mt-2 text-sm text-red-600'>{assignState.error}</p>
      )}

      {assignState?.success && (
         <p className='mt-2 text-sm text-emerald-600 font-medium'>Worker assigned successfully!</p>
      )}

      <div className='mt-6 overflow-x-auto'>
        <table className='w-full text-left text-sm'>
          <thead className='border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400'>
            <tr>
              <th className='px-2 py-3'>Role on Task</th>
              {canManage && <th className='px-2 py-3 text-right'>Actions</th>}
            </tr>
          </thead>
          <tbody className='divide-y divide-zinc-100 dark:divide-zinc-800'>
            {assignments && assignments.length > 0 ? (
              assignments.map((assignment) => (
                <tr key={assignment.user_id} className='group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50'>
                  <td className='px-2 py-3 text-zinc-600 dark:text-zinc-400'>
                    {assignment.role_on_task}
                  </td>
                  {canManage && (
                    <td className='px-2 py-3 text-right'>
                      <button
                        onClick={() => handleUnassignWorker(assignment.user_id, assignment.full_name)}
                        disabled={isPending}
                        className='inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/30'
                        title='Unassign from task'
                      >
                        <UserMinus className='h-3.5 w-3.5' />
                        Unassign
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={canManage ? 2 : 1} className='px-2 py-8 text-center text-zinc-500 dark:text-zinc-400'>
                  No workers assigned to this task yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
