import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin', 'latin-ext'] })

export const metadata: Metadata = {
  title: 'regional.fit - System briefowania',
  description: 'regional.fit - System briefowania dla klubów fitness',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body className={plusJakartaSans.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
