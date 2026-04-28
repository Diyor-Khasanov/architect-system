'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, User, Loader2 } from 'lucide-react'
import { loginAction } from '../actions/login'

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await loginAction(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className='w-full max-w-[420px] space-y-6 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm'>
      <div className='space-y-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight text-zinc-900'>Welcome back</h1>
        <p className='text-sm text-zinc-500'>Sign in to access your role-based workspace.</p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <label className='text-xs font-medium uppercase tracking-wider text-zinc-500' htmlFor='username'>
            Username
          </label>
          <div className='relative'>
            <User className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400' />
            <input
              id='username'
              name='username'
              type='text'
              required
              className='w-full rounded-lg border border-zinc-200 bg-transparent py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-zinc-900'
              placeholder='username'
            />
          </div>
        </div>

        <div className='space-y-2'>
          <label className='text-xs font-medium uppercase tracking-wider text-zinc-500' htmlFor='password'>
            Password
          </label>
          <div className='relative'>
            <Lock className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400' />
            <input
              id='password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              required
              className='w-full rounded-lg border border-zinc-200 bg-transparent py-2 pl-10 pr-10 text-sm outline-none transition-colors focus:border-zinc-900'
              placeholder='••••••••'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900'
            >
              {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
            </button>
          </div>
        </div>

        {error ? <p className='text-xs font-medium text-red-600'>{error}</p> : null}

        <button
          type='submit'
          disabled={loading}
          className='flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50'
        >
          {loading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
