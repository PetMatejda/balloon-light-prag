import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Balloon Light Prag - Precision Film Lighting',
  description: 'High-end balloon lighting solutions for professional film production. Precision lighting for DoPs and Gaffers.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
