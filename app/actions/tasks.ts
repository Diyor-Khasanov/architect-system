'use server'

import { revalidatePath } from 'next/cache'
import { createTask } from '../lib/tasks'

export async function createTaskAction(projectId: string | number, prevState: any, formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const deadline = formData.get('deadline') as string

  if (!title || !description || !deadline) {
    return { error: 'All fields are required.' }
  }

  try {
    await createTask(projectId, { title, description, deadline })
    revalidatePath(`/projects/${projectId}`)
    revalidatePath('/tasks')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to create task.' }
  }
}
