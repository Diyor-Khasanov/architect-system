import { getAuthHeaderFromCookies } from './auth'
import { API_BASE_URL } from './config'

export async function fetchDashboardData(role: 'admin' | 'manager' | 'worker') {
  const authorization = await getAuthHeaderFromCookies()

  if (!authorization) {
    return null
  }

  const response = await fetch(`${API_BASE_URL}/dashboard/${role}`, {
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
}
