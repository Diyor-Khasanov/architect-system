import LoginForm from '../components/LoginForm'

export default function LoginPage() {
  return (
    <main className='min-h-screen w-full flex flex-col items-center justify-center bg-[#fafafa] dark:bg-black p-4'>
      <div className='mb-8 flex items-center gap-2'>
        <div className='w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center'>
          <div className='w-3 h-3 bg-white dark:bg-black rotate-45' />
        </div>
        <span className='text-xl font-bold tracking-tighter dark:text-white'>ADMIN PANEL</span>
      </div>

      <LoginForm />
    </main>
  )
}
