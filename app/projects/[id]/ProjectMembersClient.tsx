'use client'

import { useActionState, useTransition } from 'react'
import { addProjectMemberAction, removeProjectMemberAction } from '../../actions/projects'
import type { ProjectMember } from '../../lib/projects'
import type { User } from '../../lib/users'
import { UserPlus, UserMinus, Loader2 } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

interface ProjectMembersClientProps {
  projectId: string
  members: ProjectMember[]
  availableWorkers: User[]
  canManage: boolean
}

export default function ProjectMembersClient({
  projectId,
  members,
  availableWorkers,
  canManage,
}: ProjectMembersClientProps) {
  const { toast, confirm } = useToast()
  const [isPending, startTransition] = useTransition()

  const addMemberWithId = addProjectMemberAction.bind(null, projectId)
  const [addState, addFormAction] = useActionState(addMemberWithId, {})

  const handleRemoveMember = async (userId: number, fullName: string) => {
    const confirmed = await confirm(
      `Are you sure you want to remove ${fullName} from this project?`,
      'Remove Member'
    )
    if (!confirmed) return

    startTransition(async () => {
      const result = await removeProjectMemberAction(projectId, userId)
      if (result.success) {
        toast('Member removed successfully', 'success')
      } else if (result.error) {
        toast(result.error, 'error')
      }
    })
  }

  // Filter out workers who are already members
  const memberIds = new Set(members.map((m) => m.user_id))
  const selectableWorkers = availableWorkers.filter((w) => !memberIds.has(w.id))

  return (
    <div className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
      <div className='flex items-center justify-between gap-4 flex-wrap'>
        <h2 className='text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100'>Team Members</h2>

        {canManage && selectableWorkers.length > 0 && (
          <form action={addFormAction} className='flex items-center gap-2'>
            <select
              name='user_id'
              required
              className='rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100'
            >
              <option value=''>Select a worker...</option>
              {selectableWorkers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.profile?.full_name || worker.username}
                </option>
              ))}
            </select>
            <button
              type='submit'
              disabled={isPending}
              className='inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
            >
              {isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : <UserPlus className='h-4 w-4' />}
              Add
            </button>
          </form>
        )}
      </div>

      {addState?.error && (
        <p className='mt-2 text-sm text-red-600'>{addState.error}</p>
      )}

      <div className='mt-6 overflow-x-auto'>
        <table className='w-full text-left text-sm'>
          <thead className='border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400'>
            <tr>
              <th className='px-2 py-3'>Worker Id</th>
              <th className='px-2 py-3'>Role</th>
              {canManage && <th className='px-2 py-3 text-right'>Actions</th>}
            </tr>
          </thead>
          <tbody className='divide-y divide-zinc-100 dark:divide-zinc-800'>
            {members && members.length > 0 ? (
              members.map((member) => (
                <tr key={member.user_id} className='group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50'>
                  <td className='px-2 py-3 font-medium text-zinc-900 dark:text-zinc-100'>
                    #{member.user_id}
                  </td>
                  <td className='px-2 py-3 text-zinc-600 capitalize dark:text-zinc-400'>
                    {member.role}
                  </td>
                  {canManage && (
                    <td className='px-2 py-3 text-right'>
                      <button
                        onClick={() => handleRemoveMember(member.user_id, member.full_name)}
                        disabled={isPending}
                        className='inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/30'
                        title='Remove from project'
                      >
                        <UserMinus className='h-3.5 w-3.5' />
                        Remove
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={canManage ? 3 : 2} className='px-2 py-8 text-center text-zinc-500 dark:text-zinc-400'>
                  No members assigned to this project yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
