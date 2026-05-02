'use server'

import { revalidatePath } from 'next/cache'
import { fetchCurrentUser, type UserRole } from '../lib/auth'
import { createUser, updateUser, deleteUser, type CreateUserPayload, fetchUserById } from '../lib/users'

interface ActionState {
  success?: boolean
  error?: string
}

async function checkPermission() {
  const currentUser = await fetchCurrentUser()
  if (!currentUser || !['admin', 'manager'].includes(currentUser.role)) {
    throw new Error('Unauthorized to perform this action.')
  }
  return currentUser
}

export async function createUserAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const currentUser = await checkPermission()

    const username = String(formData.get('username') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')
    const confirmPassword = String(formData.get('confirm_password') ?? '')
    const role = String(formData.get('role') ?? 'worker') as UserRole
    const fullName = String(formData.get('full_name') ?? '').trim()

    if (currentUser.role === 'manager' && role !== 'worker') {
      return { error: "Managers can only create users with the 'worker' role." }
    }

    if (!username || !email || !password || !confirmPassword || !fullName) {
      return { error: 'All fields are required.' }
    }

    if (password !== confirmPassword) {
      return { error: 'Passwords do not match.' }
    }

    await createUser({
      username,
      email,
      password,
      confirm_password: confirmPassword,
      role,
      full_name: fullName,
      is_active: true,
    })

    revalidatePath('/users')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Could not create user.' }
  }
}

export async function updateUserAction(
  id: number,
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const currentUser = await checkPermission()

    if (currentUser.role === 'manager') {
      const targetUser = await fetchUserById(id)
      if (targetUser.role !== 'worker') {
        return { error: 'Managers can only update users with the "worker" role.' }
      }
    }

    const payload: Partial<CreateUserPayload> = {}

    if (formData.has('username')) payload.username = String(formData.get('username'))
    if (formData.has('email')) payload.email = String(formData.get('email'))

    if (formData.has('role')) {
      const role = String(formData.get('role')) as UserRole
      if (currentUser.role === 'manager' && role !== 'worker') {
        return { error: "Managers can only set users to the 'worker' role." }
      }
      payload.role = role
    }

    if (formData.has('full_name')) payload.full_name = String(formData.get('full_name'))

    // Handle checkbox: if it's not in formData, it means it's unchecked (false)
    payload.is_active = formData.get('is_active') === 'true'

    await updateUser(id, payload)

    revalidatePath('/users')
    revalidatePath(`/users/${id}`)
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Could not update user.' }
  }
}

export async function deleteUserAction(id: number): Promise<ActionState> {
  try {
    const currentUser = await checkPermission()

    if (currentUser.role === 'manager') {
      const targetUser = await fetchUserById(id)
      if (targetUser.role !== 'worker') {
        return { error: 'Managers can only delete users with the "worker" role.' }
      }
    }

    await deleteUser(id)
    revalidatePath('/users')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Could not delete user.' }
  }
}
