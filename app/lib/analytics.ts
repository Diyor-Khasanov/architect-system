import { getAuthHeaderFromCookies } from './auth'

const API_BASE_URL = 'http://13.50.4.92/api/v1'

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
    console.error('Failed to fetch analytics:', error)
    return null
  }
}
