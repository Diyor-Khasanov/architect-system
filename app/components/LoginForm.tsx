'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, Fingerprint, Loader2, Lock, ShieldCheck, UserRound } from 'lucide-react'
import { loginAction, type LoginActionState } from '../actions/login'
import { cn } from '../lib/utils'

const initialState: LoginActionState = {
  status: 'idle',
  message: '',
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [state, formAction, isPending] = useActionState(loginAction, initialState)
  const router = useRouter()

  useEffect(() => {
    if (state.status !== 'success') return

    const timeoutId = window.setTimeout(() => {
      router.replace('/dashboard')
      router.refresh()
    }, 450)

    return () => window.clearTimeout(timeoutId)
  }, [router, state.status])

  return (
    <section className='relative w-full max-w-[440px] overflow-hidden rounded-[2rem] border border-white/50 bg-white/75 p-1 shadow-[0_30px_90px_rgba(15,23,42,0.20)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/65 dark:shadow-black/50'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.18),transparent_32%)]' />
      <div className='relative rounded-[1.75rem] border border-white/45 bg-white/80 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/70 sm:p-8'>
        <div className='mb-8 space-y-4 text-center'>
          <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-white/70 bg-gradient-to-br from-zinc-950 via-zinc-800 to-indigo-950 text-white shadow-2xl shadow-indigo-500/20 dark:border-white/10 dark:from-white dark:via-zinc-100 dark:to-sky-100 dark:text-zinc-950'>
            <Fingerprint className='h-8 w-8' />
          </div>
          <div className='space-y-2'>
            <p className='text-xs font-semibold uppercase tracking-[0.32em] text-indigo-600 dark:text-indigo-300'>Secure access</p>
            <h1 className='text-3xl font-semibold tracking-[-0.04em] text-zinc-950 dark:text-white'>Welcome back</h1>
            <p className='mx-auto max-w-xs text-sm leading-6 text-zinc-600 dark:text-zinc-300'>Sign in to your production workspace. Successful authentication opens the dashboard automatically.</p>
          </div>
        </div>

        <form action={formAction} className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400' htmlFor='username'>
              Username / Email
            </label>
            <div
              className={cn(
                'group relative rounded-2xl border bg-white/70 shadow-inner shadow-zinc-950/[0.03] transition focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 dark:bg-white/5 dark:shadow-black/20 dark:focus-within:border-indigo-300 dark:focus-within:bg-white/10',
                state.fieldErrors?.username ? 'border-red-300 dark:border-red-400/60' : 'border-zinc-200/80 dark:border-white/10'
              )}
            >
              <UserRound className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 transition group-focus-within:text-indigo-500' />
              <input
                id='username'
                name='username'
                type='text'
                autoComplete='username'
                required
                disabled={isPending || state.status === 'success'}
                className='h-14 w-full bg-transparent pl-12 pr-4 text-base font-medium text-zinc-950 outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-70 dark:text-white'
                placeholder='admin or name@company.com'
              />
            </div>
            {state.fieldErrors?.username ? <p className='text-xs font-medium text-red-600 dark:text-red-300'>{state.fieldErrors.username}</p> : null}
          </div>

          <div className='space-y-2'>
            <label className='text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400' htmlFor='password'>
              Password
            </label>
            <div
              className={cn(
                'group relative rounded-2xl border bg-white/70 shadow-inner shadow-zinc-950/[0.03] transition focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 dark:bg-white/5 dark:shadow-black/20 dark:focus-within:border-indigo-300 dark:focus-within:bg-white/10',
                state.fieldErrors?.password ? 'border-red-300 dark:border-red-400/60' : 'border-zinc-200/80 dark:border-white/10'
              )}
            >
              <Lock className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 transition group-focus-within:text-indigo-500' />
              <input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                autoComplete='current-password'
                required
                disabled={isPending || state.status === 'success'}
                className='h-14 w-full bg-transparent pl-12 pr-14 text-base font-medium text-zinc-950 outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-70 dark:text-white'
                placeholder='••••••••'
              />
              <button
                type='button'
                onClick={() => setShowPassword((value) => !value)}
                disabled={isPending || state.status === 'success'}
                className='absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-white/10 dark:hover:text-white'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
              </button>
            </div>
            {state.fieldErrors?.password ? <p className='text-xs font-medium text-red-600 dark:text-red-300'>{state.fieldErrors.password}</p> : null}
          </div>

          {state.status === 'error' ? (
            <div className='flex gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700 shadow-sm dark:border-red-400/20 dark:bg-red-950/30 dark:text-red-200'>
              <AlertCircle className='mt-0.5 h-5 w-5 shrink-0' />
              <div>
                <p className='font-semibold'>Authentication failed</p>
                <p className='mt-1 leading-5'>{state.message}</p>
              </div>
            </div>
          ) : null}

          {state.status === 'success' ? (
            <div className='flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-sm text-emerald-700 shadow-sm dark:border-emerald-400/20 dark:bg-emerald-950/30 dark:text-emerald-200'>
              <CheckCircle2 className='mt-0.5 h-5 w-5 shrink-0' />
              <div>
                <p className='font-semibold'>Authenticated</p>
                <p className='mt-1 leading-5'>{state.message}</p>
              </div>
            </div>
          ) : null}

          <button
            type='submit'
            disabled={isPending || state.status === 'success'}
            className='group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-5 text-base font-semibold text-white shadow-2xl shadow-zinc-950/20 transition hover:-translate-y-0.5 hover:bg-zinc-800 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-zinc-950 dark:shadow-white/10 dark:hover:bg-zinc-100'
          >
            {isPending ? <Loader2 className='h-5 w-5 animate-spin' /> : state.status === 'success' ? <CheckCircle2 className='h-5 w-5' /> : <ShieldCheck className='h-5 w-5' />}
            {isPending ? 'Verifying access...' : state.status === 'success' ? 'Opening dashboard...' : 'Sign in securely'}
            {!isPending && state.status !== 'success' ? <ArrowRight className='h-5 w-5 transition group-hover:translate-x-1' /> : null}
          </button>
        </form>
      </div>
    </section>
  )
}
