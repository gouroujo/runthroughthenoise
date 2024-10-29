import { absoluteUrl } from '@/lib/utils'
import { Metadata } from 'next'
import '../styles/index.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://runthroughthenoise.com'),
  title: {
    default: 'Run Through The Noise',
    template: '%s | Run Through The Noise'
  },
  description: 'A journey around the world too bring hope through sport.',
  openGraph: {
    title: 'Run Through The Noise - Juju & Jojo',
    description: 'Juju & Jojo around the world.',
    url: absoluteUrl('/'),
    siteName: 'RTTN',
    images: [
      {
        url: absoluteUrl('/images/og-image.png'),
        width: 1800,
        height: 1600
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  icons: {
    icon: [{ url: '/favicon/favicon-32x32.png' }],
    apple: [{ url: '/favicon/apple-touch-icon.png' }]
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
