import { getAuthHeaderFromCookies } from './auth'

export interface Project {
  id: number
  name: string
  description: string
  manager_id: number
  status: 'draft' | 'active' | 'completed' | string
  deadline: string
  created_at: string
}

interface CreateProjectPayload {
  name: string
  description: string
  deadline: string
  manager_id: number
}

const API_BASE_URL = 'http://13.50.4.92/api/v1'

export async function fetchProjects() {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'GET',
    headers: {
      Authorization: authorization,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch projects')
  }

  return (await response.json()) as Project[]
}

export async function createProject(payload: CreateProjectPayload) {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to create project')
  }

  return (await response.json()) as Project
}
