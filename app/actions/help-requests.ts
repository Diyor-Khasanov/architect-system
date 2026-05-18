'use server'

import { revalidatePath } from 'next/cache'
import { createHelpRequest, assignHelpRequest, resolveHelpRequest } from '../lib/help-requests'

export async function createHelpRequestAction(prevState: unknown, formData: FormData) {
  const taskId = formData.get('task_id') ? Number(formData.get('task_id')) : null
  const title = formData.get('title') as string
  const description = formData.get('description') as string

  if (taskId === null || isNaN(taskId)) {
    return { error: 'Task is required.' }
  }

  if (!title || !description) {
    return { error: 'Title and description are required.' }
  }

  try {
    await createHelpRequest(taskId, title, description)
    revalidatePath('/help-requests')
    revalidatePath(`/tasks/${taskId}`)
    return { success: true }
  } catch (error: unknown) {
    return { error: (error as Error).message || 'Failed to create help request.' }
  }
}

export async function assignHelpRequestAction(id: string | number) {
  try {
    await assignHelpRequest(id)
    revalidatePath(`/help-requests/${id}`)
    revalidatePath('/help-requests')
    return { success: true }
  } catch (error: unknown) {
    return { error: (error as Error).message || 'Failed to assign help request.' }
  }
}

export async function resolveHelpRequestAction(id: string | number) {
  try {
    await resolveHelpRequest(id)
    revalidatePath(`/help-requests/${id}`)
    revalidatePath('/help-requests')
    return { success: true }
  } catch (error: unknown) {
    return { error: (error as Error).message || 'Failed to resolve help request.' }
  }
}
