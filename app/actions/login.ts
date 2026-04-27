'use server'

export async function loginAction(formData: FormData) {
  const username = formData.get('username')
  const password = formData.get('password')

  const authHeader = btoa(`${username}:${password}`)

  try {
    const response = await fetch('http://13.50.4.92/api/v1/auth/login', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return { error: 'Login yoki parol xato!' }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return { error: 'Tarmoq ulanishida xatolik yuz berdi.' }
  }
}
