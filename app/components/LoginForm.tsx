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
    } else {
      router.push('/dashboard') // Muvaffaqiyatli kirgandan keyingi yo'nalish
    }
  }

  return (
    <div className='w-full max-w-[400px] space-y-6 p-8 bg-white dark:bg-black border border-[#eaeaea] dark:border-[#333] rounded-xl shadow-sm'>
      <div className='space-y-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight text-black dark:text-white'>
          Xush kelibsiz
        </h1>
        <p className='text-sm text-[#666] dark:text-[#888]'>
          Tizimga kirish uchun ma'lumotlarni kiriting
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Username Field */}
        <div className='space-y-2'>
          <label
            className='text-xs font-medium uppercase tracking-wider text-[#666]'
            htmlFor='username'
          >
            Foydalanuvchi nomi
          </label>
          <div className='relative'>
            <User className='absolute left-3 top-1/2 -translate-y-1/2 text-[#999] h-4 w-4' />
            <input
              id='username'
              name='username'
              type='text'
              required
              className='w-full pl-10 pr-4 py-2 bg-transparent border border-[#eaeaea] dark:border-[#333] rounded-md outline-none focus:border-black dark:focus:border-white dark:text-white transition-colors text-sm'
              placeholder='username'
            />
          </div>
        </div>

        {/* Password Field */}
        <div className='space-y-2'>
          <label
            className='text-xs font-medium uppercase tracking-wider text-[#666]'
            htmlFor='password'
          >
            Parol
          </label>
          <div className='relative'>
            <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-[#999] h-4 w-4' />
            <input
              id='password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              required
              className='w-full pl-10 pr-10 py-2 bg-transparent border border-[#eaeaea] dark:border-[#333] rounded-md outline-none focus:border-black dark:focus:border-white dark:text-white transition-colors text-sm'
              placeholder='••••••••'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-black dark:hover:text-white'
            >
              {showPassword ? <EyeOff h-4 w-4 /> : <Eye h-4 w-4 />}
            </button>
          </div>
        </div>

        {error && (
          <p className='text-red-500 text-xs font-medium animate-in fade-in zoom-in duration-300'>
            {error}
          </p>
        )}

        <button
          type='submit'
          disabled={loading}
          className='w-full flex items-center justify-center gap-2 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50'
        >
          {loading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Kirish'}
        </button>
      </form>
    </div>
  )
}
