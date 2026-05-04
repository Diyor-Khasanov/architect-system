import { getAuthHeaderFromCookies } from './auth'

const API_BASE_URL = 'http://13.50.4.92/api/v1'

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
