import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className='flex h-[80vh] w-full flex-col items-center justify-center space-y-4'>
      <div className='relative flex items-center justify-center'>
        <div className='h-12 w-12 rounded-full border-2 border-[#eaeaea] dark:border-[#333]' />

        <div className='absolute inset-0 flex items-center justify-center'>
          <Loader2 className='h-6 w-6 animate-spin text-black dark:text-white stroke-[1.5px]' />
        </div>
      </div>

      <div className='flex flex-col items-center space-y-1'>
        <p className='text-sm font-medium tracking-tight text-black dark:text-white'>
          Yuklanmoqda...
        </p>
        <p className='text-xs text-[#666] dark:text-[#888] animate-pulse'>Iltimos, kuting</p>
      </div>

      <div className='absolute inset-0 -z-10 flex flex-col p-10 opacity-[0.03] dark:opacity-[0.07] pointer-events-none'>
        <div className='h-8 w-48 bg-black dark:bg-white rounded-md mb-8' />
        <div className='grid grid-cols-3 gap-6 mb-10'>
          <div className='h-32 bg-black dark:bg-white rounded-xl' />
          <div className='h-32 bg-black dark:bg-white rounded-xl' />
          <div className='h-32 bg-black dark:bg-white rounded-xl' />
        </div>
        <div className='h-64 w-full bg-black dark:bg-white rounded-xl' />
      </div>
    </div>
  )
}
