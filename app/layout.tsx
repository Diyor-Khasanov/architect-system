import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from './context/ToastContext'
import { ThemeProvider } from './components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Architect System',
  description: 'Multi-role architecture management dashboard',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className='h-full antialiased' suppressHydrationWarning>
      <body className='min-h-full font-sans'>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
