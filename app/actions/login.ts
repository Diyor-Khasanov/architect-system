'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const API_BASE_URL = 'http://13.50.4.92/api/v1'

function resolveToken(payload: unknown) {
  if (!payload || typeof payload !== 'object') return null

  const candidate = payload as Record<string, unknown>

  return (
    candidate.access_token ??
    candidate.token ??
    (candidate.data as Record<string, unknown> | undefined)?.access_token ??
    (candidate.data as Record<string, unknown> | undefined)?.token ??
    null
  )
}

export async function loginAction(formData: FormData) {
  const username = formData.get('username')
  const password = formData.get('password')

  if (!username || !password) {
    return { error: 'Username va parol majburiy.' }
  }

  const basicCredential = btoa(`${username}:${password}`)

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicCredential}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return { error: 'Login yoki parol xato!' }
    }

    const payload = await response.json().catch(() => null)
    const token = resolveToken(payload)
    const cookieStore = await cookies()

    if (typeof token === 'string' && token.length > 0) {
      cookieStore.set('auth_mode', 'bearer', { path: '/', httpOnly: true, sameSite: 'lax' })
      cookieStore.set('auth_value', token, { path: '/', httpOnly: true, sameSite: 'lax' })
    } else {
      cookieStore.set('auth_mode', 'basic', { path: '/', httpOnly: true, sameSite: 'lax' })
      cookieStore.set('auth_value', basicCredential, { path: '/', httpOnly: true, sameSite: 'lax' })
    }

    return { success: true }
  } catch {
    return { error: 'Tarmoq ulanishida xatolik yuz berdi.' }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_mode')
  cookieStore.delete('auth_value')
  redirect('/login')
}
