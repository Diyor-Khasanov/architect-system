import Link from 'next/link'
import { AlertCircle, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-white p-4 text-black'>
      <div className='max-w-md space-y-6 text-center'>
        <div className='flex justify-center'>
          <div className='flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 shadow-sm'>
            <AlertCircle className='h-8 w-8 text-zinc-500' />
          </div>
        </div>

        <div className='space-y-2'>
          <h1 className='text-5xl font-semibold tracking-tight'>404</h1>
          <h2 className='text-xl font-semibold tracking-tight'>Page not found</h2>
          <p className='text-sm leading-relaxed text-zinc-500'>
            The page you are looking for doesn&apos;t exist or has been moved to a different route.
          </p>
        </div>

        <div className='pt-2'>
          <Link
            href='/dashboard'
            className='inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90'
          >
            <Home className='h-4 w-4' />
            Back to dashboard
          </Link>
        </div>
      </div>

      <div className='fixed bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-zinc-300 to-transparent opacity-50' />
    </div>
  )
}
