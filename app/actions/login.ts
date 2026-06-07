'use server'

import { redirect } from 'next/navigation'
import { authenticateWithBackend, clearAuthSession, persistAuthSession } from '../lib/auth'

export interface LoginActionState {
  status: 'idle' | 'error' | 'success'
  message: string
  userDisplayName?: string
  fieldErrors?: {
    username?: string
    password?: string
  }
}

const INITIAL_LOGIN_STATE: LoginActionState = {
  status: 'idle',
  message: '',
}

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

export async function loginAction(previousState: LoginActionState = INITIAL_LOGIN_STATE, formData: FormData): Promise<LoginActionState> {
  void previousState
  const username = getRequiredString(formData, 'username')
  const password = getRequiredString(formData, 'password')
  const fieldErrors: LoginActionState['fieldErrors'] = {}

  if (!username) fieldErrors.username = 'Username yoki email majburiy.'
  if (!password) fieldErrors.password = 'Parol majburiy.'

  if (fieldErrors.username || fieldErrors.password) {
    return {
      status: 'error',
      message: 'Iltimos, barcha majburiy maydonlarni to‘ldiring.',
      fieldErrors,
    }
  }

  try {
    const result = await authenticateWithBackend({ username, password })
    await persistAuthSession(result.session)

    return {
      status: 'success',
      message: 'Kirish muvaffaqiyatli. Dashboard ochilmoqda...',
      userDisplayName: result.user?.profile?.full_name ?? result.user?.username ?? username,
    }
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Tarmoq ulanishida xatolik yuz berdi.',
    }
  }
}

export async function logoutAction() {
  await clearAuthSession()
  redirect('/login')
}
