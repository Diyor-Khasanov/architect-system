import { getAuthHeaderFromCookies } from './auth'

const API_BASE_URL = 'http://13.50.4.92/api/v1'

export interface Notification {
  id: number
  message: string
  is_read: boolean
  created_at: string
  link?: string
}

export interface UnreadCountResponse {
  unread_count: number
}

export async function fetchUnreadCount(): Promise<number> {
  const authorization = await getAuthHeaderFromCookies()
  if (!authorization) return 0

  try {
    const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
      method: 'GET',
      headers: { Authorization: authorization },
      cache: 'no-store',
    })

    if (!response.ok) return 0
    const data = await response.json() as UnreadCountResponse
    return data.unread_count
  } catch (error) {
    console.error('Failed to fetch unread count:', error)
    return 0
  }
}

export async function fetchNotifications(): Promise<Notification[]> {
  const authorization = await getAuthHeaderFromCookies()
  if (!authorization) return []

  try {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'GET',
      headers: { Authorization: authorization },
      cache: 'no-store',
    })

    if (!response.ok) return []
    const data = await response.json()

    if (Array.isArray(data)) return data as Notification[]
    if (data && typeof data === 'object' && Array.isArray((data as any).items)) return (data as any).items as Notification[]
    if (data && typeof data === 'object' && Array.isArray((data as any).data)) return (data as any).data as Notification[]

    return []
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    return []
  }
}

export async function markNotificationAsRead(id: number): Promise<boolean> {
  const authorization = await getAuthHeaderFromCookies()
  if (!authorization) return false

  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: authorization },
      cache: 'no-store',
    })

    return response.ok
  } catch (error) {
    console.error(`Failed to mark notification ${id} as read:`, error)
    return false
  }
}

export async function markAllNotificationsAsRead(): Promise<boolean> {
  const authorization = await getAuthHeaderFromCookies()
  if (!authorization) return false

  try {
    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: { Authorization: authorization },
      cache: 'no-store',
    })

    return response.ok
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error)
    return false
  }
}
