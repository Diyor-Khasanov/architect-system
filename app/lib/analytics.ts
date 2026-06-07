import { getAuthHeaderFromCookies } from './auth'
import { API_BASE_URL } from './config'

export interface DeadlineAnalytics {
  upcoming_deadlines: Array<{
    id: number
    name: string
    deadline: string
    status: string
    days_left: number
  }>
  overdue_tasks: Array<{
    id: number
    name: string
    deadline: string
    status: string
    days_overdue: number
  }>
  summary: {
    total_active_tasks: number
    approaching_deadlines_count: number
    overdue_count: number
  }
}

export async function fetchDeadlineAnalytics() {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    return null
  }

  try {
    const response = await fetch(`${API_BASE_URL}/analytics/deadlines`, {
      method: 'GET',
      headers: {
        Authorization: authorization,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to fetch deadline analytics:', error)
    return null
  }
}

export async function fetchProjectProgressAnalytics() {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    return null
  }

  try {
    const response = await fetch(`${API_BASE_URL}/analytics/project-progress`, {
      method: 'GET',
      headers: {
        Authorization: authorization,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to fetch project progress analytics:', error)
    return null
  }
}

export async function fetchReportsAnalytics() {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    return null
  }

  try {
    const response = await fetch(`${API_BASE_URL}/analytics/reports`, {
      method: 'GET',
      headers: {
        Authorization: authorization,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to fetch reports analytics:', error)
    return null
  }
}

export async function fetchWorkloadAnalytics() {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    return null
  }

  try {
    const response = await fetch(`${API_BASE_URL}/analytics/workload`, {
      method: 'GET',
      headers: {
        Authorization: authorization,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to fetch workload analytics:', error)
    return null
  }
}
