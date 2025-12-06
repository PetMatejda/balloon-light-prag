import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Balloon Light Praha',
  description: 'Professional helium balloons for film lighting',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
