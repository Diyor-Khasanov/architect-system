'use server'

import { fetchUnreadCount as fetchUnreadCountLib } from '../lib/notifications'

export async function getUnreadCountAction() {
  return await fetchUnreadCountLib()
}
