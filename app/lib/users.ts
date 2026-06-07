import { getAuthHeaderFromCookies, type UserRole } from './auth'
import { API_BASE_URL } from './config'

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
  confirm_password?: string
  role: UserRole
  is_active?: boolean
  full_name?: string
}

export interface UpdateUserProfilePayload {
  full_name: string
  phone: string
  avatar_file_id: number
}



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
  const allUsers = normalizeUsersResponse(payload)
  return allUsers.filter((user) => user.is_active)
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
    const detail = errorData.detail
    let errorMessage = 'Failed to create user'

    if (Array.isArray(detail)) {
      errorMessage = detail.map((err: { loc: string[]; msg: string }) => `${err.loc.join('.')}: ${err.msg}`).join(', ')
    } else if (typeof detail === 'string') {
      errorMessage = detail
    }

    throw new Error(errorMessage)
  }

  return (await response.json()) as User
}

function normalizeGenericResponse<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[]
  }

  if (payload && typeof payload === 'object') {
    const candidate = payload as { items?: unknown; data?: unknown; results?: unknown }

    if (Array.isArray(candidate.items)) return candidate.items as T[]
    if (Array.isArray(candidate.data)) return candidate.data as T[]
    if (Array.isArray(candidate.results)) return candidate.results as T[]
  }

  return []
}

export async function fetchUserProjects(id: number) {
  const authorization = await getAuthHeaderFromCookies()
  if (!authorization) throw new Error('Unauthorized')

  const response = await fetch(`${API_BASE_URL}/users/${id}/projects`, {
    method: 'GET',
    headers: { Authorization: authorization },
    cache: 'no-store',
  })

  if (!response.ok) throw new Error('Failed to fetch user projects')
  const payload = await response.json()
  return normalizeGenericResponse<unknown>(payload)
}

export async function fetchUserTasks(id: number) {
  const authorization = await getAuthHeaderFromCookies()
  if (!authorization) throw new Error('Unauthorized')

  const response = await fetch(`${API_BASE_URL}/users/${id}/tasks`, {
    method: 'GET',
    headers: { Authorization: authorization },
    cache: 'no-store',
  })

  if (!response.ok) throw new Error('Failed to fetch user tasks')
  const payload = await response.json()
  return normalizeGenericResponse<unknown>(payload)
}

export async function fetchUserReports(id: number) {
  const authorization = await getAuthHeaderFromCookies()
  if (!authorization) throw new Error('Unauthorized')

  const response = await fetch(`${API_BASE_URL}/users/${id}/reports`, {
    method: 'GET',
    headers: { Authorization: authorization },
    cache: 'no-store',
  })

  if (!response.ok) throw new Error('Failed to fetch user reports')
  return await response.json()
}

export async function updateUserProfileDetails(payload: UpdateUserProfilePayload) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/profile/me`, {
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
    throw new Error(errorData.detail || 'Failed to update profile details')
  }

  return (await response.json()) as UserProfile
}

export async function uploadAvatar(formData: FormData) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/profile/avatar`, {
    method: 'POST',
    headers: {
      Authorization: authorization,
    },
    body: formData,
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || 'Failed to upload avatar')
  }

  return await response.json()
}

export async function fetchMyProfile() {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/profile/me`, {
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch my profile')
  }

  return (await response.json()) as UserProfile
}

export async function updateMyProfile(payload: Partial<CreateUserPayload>) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/profile/me`, {
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
    throw new Error(errorData.detail || 'Failed to update profile')
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

export async function resetUserPassword(id: number, payload: { old_password?: string; new_password: string }) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/users/${id}/reset-password`, {
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
    throw new Error(errorData.detail || 'Failed to reset password')
  }

  return true
}

export async function deleteUser(id: number) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/users/${id}/deactivate`, {
    method: 'PATCH',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to deactivate user')
  }

  return true
}

export async function fetchUserById(id: number) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }

  return (await response.json()) as User
}
