'use server'

import { revalidatePath } from 'next/cache'
import { createHelpRequest } from '../lib/help-requests'

export async function createHelpRequestAction(prevState: any, formData: FormData) {
  const taskId = formData.get('task_id') ? Number(formData.get('task_id')) : null

  if (taskId === null || isNaN(taskId)) {
    return { error: 'Task is required.' }
  }

  try {
    await createHelpRequest(taskId)
    revalidatePath('/help-requests')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to create help request.' }
  }
}
