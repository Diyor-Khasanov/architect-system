import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ToastProvider } from './context/ToastContext'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

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
    <html lang='en' className={`h-full antialiased ${geistSans.variable} ${geistMono.variable}`}>
      <body className='min-h-full font-sans'>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
