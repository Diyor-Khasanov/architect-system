'use server'

import {
  fetchUnreadCount as fetchUnreadCountLib,
  markNotificationAsRead as markAsReadLib,
  markAllNotificationsAsRead as markAllAsReadLib
} from '../lib/notifications'

export async function getUnreadCountAction() {
  return await fetchUnreadCountLib()
}

export async function markAsReadAction(id: number) {
  return await markAsReadLib(id)
}

export async function markAllAsReadAction() {
  return await markAllAsReadLib()
}
