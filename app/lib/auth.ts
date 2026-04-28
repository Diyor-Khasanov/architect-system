import { cookies } from 'next/headers'

export type UserRole = 'admin' | 'manager' | 'worker'

export interface MeResponse {
  id: number
  username: string
  email: string
  profile?: {
    id: number
    user_id: number
    full_name: string
    phone: string
    avatar_file_id: number
  }
  managed_projects: unknown[]
  task_assignments: unknown[]
  assigned_tasks: unknown[]
  role: UserRole
  is_active: boolean
  created_at: string
}

const API_BASE_URL = 'http://13.50.4.92/api/v1'

export async function getAuthHeaderFromCookies() {
  const cookieStore = await cookies()
  const authMode = cookieStore.get('auth_mode')?.value
  const authValue = cookieStore.get('auth_value')?.value

  if (!authMode || !authValue) {
    return null
  }

  if (authMode === 'bearer') {
    return `Bearer ${authValue}`
  }

  return `Basic ${authValue}`
}

export async function fetchCurrentUser() {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    return null
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    return null
  }

  return (await response.json()) as MeResponse
}
