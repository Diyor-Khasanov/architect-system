'use server'

import { revalidatePath } from 'next/cache'
import { createProject } from '../lib/projects'

interface CreateProjectState {
  success?: boolean
  error?: string
}

export async function createProjectAction(_: CreateProjectState, formData: FormData): Promise<CreateProjectState> {
  const name = String(formData.get('name') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const deadline = String(formData.get('deadline') ?? '').trim()
  const managerId = Number(formData.get('manager_id'))

  if (!name || !description || !deadline || !managerId) {
    return { error: 'All fields are required.' }
  }

  try {
    await createProject({
      name,
      description,
      deadline,
      manager_id: managerId,
    })

    revalidatePath('/projects')
    return { success: true }
  } catch {
    return { error: 'Could not create project. Please try again.' }
  }
}
