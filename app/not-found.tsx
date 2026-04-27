import Link from 'next/link'
import { ChevronLeft, Home, AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black text-black dark:text-white p-4'>
      <div className='space-y-6 text-center max-w-md'>
        {/* Geist uslubidagi minimal 404 belgisi */}
        <div className='flex justify-center'>
          <div className='w-16 h-16 bg-[#fafafa] dark:bg-[#111] border border-[#eaeaea] dark:border-[#333] rounded-2xl flex items-center justify-center shadow-sm'>
            <AlertCircle className='h-8 w-8 text-[#666]' />
          </div>
        </div>

        <div className='space-y-2'>
          <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl'>404</h1>
          <h2 className='text-xl font-semibold tracking-tight'>Sahifa topilmadi</h2>
          <p className='text-[#666] dark:text-[#888] text-sm leading-relaxed'>
            Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki boshqa manzilga ko'chirilgan
            bo'lishi mumkin.
          </p>
        </div>

        <div className='flex flex-col sm:flex-row items-center justify-center gap-3 pt-4'>
          <Link
            href='/dashboard'
            className='w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-md text-sm font-medium hover:opacity-90 transition-opacity'
          >
            <Home className='h-4 w-4' />
            Dashboardga qaytish
          </Link>
        </div>
      </div>

      {/* Geist dizaynidagi pastki dekorativ chiziq */}
      <div className='fixed bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#eaeaea] dark:via-[#333] to-transparent opacity-50' />
    </div>
  )
}
