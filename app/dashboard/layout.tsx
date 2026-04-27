import Sidebar from '../components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen bg-[#fafafa] dark:bg-black text-black dark:text-white'>
      {/* Sidebar - Desktop uchun doimiy ko'rinadi */}
      <Sidebar />

      {/* Asosiy kontent maydoni */}
      <main className='flex-1 lg:pl-64'>
        <div className='h-full px-4 py-8 lg:px-10'>{children}</div>
      </main>
    </div>
  )
}
