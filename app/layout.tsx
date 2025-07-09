import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Outcast Weather App',
  description: 'Outcast Weather App',
  generator: 'Outcast Weather App',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
