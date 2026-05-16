import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import { getSiteUrl } from '@/lib/site-url'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: 'IPAS Ekonomi | Welcome to Materi IPAS',
  description: 'Media digital pembelajaran IPAS ekonomi dengan materi, submateri, dashboard konten, dan kuis live berbasis materi.',
  keywords: 'IPAS, ekonomi, materi, submateri, kuis live, dashboard konten, pendidikan',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'IPAS Ekonomi | Welcome to Materi IPAS',
    description: 'Media digital pembelajaran IPAS ekonomi dengan materi, submateri, dashboard konten, dan kuis live berbasis materi.',
    url: siteUrl,
    siteName: 'IPAS Ekonomi',
    locale: 'id_ID',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <Sidebar />
        <main className="page-shell">
          {children}
        </main>
        <footer className="site-credit">
          Dibuat oleh Kelompok 9: Zili, Mutty, Alysa.
        </footer>
      </body>
    </html>
  )
}
