import { getAuthHeaderFromCookies, type UserRole } from './auth'

export interface UserProfile {
  id: number
  user_id: number
  full_name: string
  phone?: string
  avatar_file_id?: number
}

export interface User {
  id: number
  username: string
  email: string
  role: UserRole
  is_active: boolean
  created_at: string
  profile?: UserProfile
}

export interface CreateUserPayload {
  username: string
  email: string
  password?: string
  role: UserRole
  is_active?: boolean
  full_name?: string
}

const API_BASE_URL = 'http://13.50.4.92/api/v1'

function normalizeUsersResponse(payload: unknown): User[] {
  if (Array.isArray(payload)) {
    return payload as User[]
  }

  if (payload && typeof payload === 'object') {
    const candidate = payload as { items?: unknown; data?: unknown; results?: unknown; users?: unknown }

    if (Array.isArray(candidate.items)) return candidate.items as User[]
    if (Array.isArray(candidate.data)) return candidate.data as User[]
    if (Array.isArray(candidate.results)) return candidate.results as User[]
    if (Array.isArray(candidate.users)) return candidate.users as User[]
  }

  return []
}

export async function fetchUsers() {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/users/`, {
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }

  const payload = (await response.json()) as unknown
  return normalizeUsersResponse(payload)
}

export async function createUser(payload: CreateUserPayload) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/users/`, {
    method: 'POST',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || 'Failed to create user')
  }

  return (await response.json()) as User
}

export async function updateUser(id: number, payload: Partial<CreateUserPayload>) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || 'Failed to update user')
  }

  return (await response.json()) as User
}

export async function deleteUser(id: number) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to delete user')
  }

  return true
}
