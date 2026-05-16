'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Menu, X, BookOpen, Home, Lightbulb, Scale, Globe, Target, Library, ShieldCheck,
} from 'lucide-react'

const NAV = [
  { href: '/', icon: Home, label: 'Beranda' },
  { href: '/materi', icon: Library, label: 'Materi & Submateri' },
  { href: '/teori', icon: BookOpen, label: 'Teori Ekonomi' },
  { href: '/motif', icon: Lightbulb, label: 'Motif Ekonomi' },
  { href: '/prinsip', icon: Scale, label: 'Prinsip Ekonomi' },
  { href: '/contoh', icon: Globe, label: 'Contoh Nyata' },
  { href: '/quiz', icon: Target, label: 'Kuis Interaktif' },
  { href: '/admin', icon: ShieldCheck, label: 'Dashboard Konten' },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      <button
        type="button"
        className="hamburger-btn"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? 'Tutup menu' : 'Buka menu'}
        aria-expanded={open}
        aria-controls="sidebar-navigation"
      >
        <Menu size={20} strokeWidth={2.2} />
      </button>

      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}

      <aside id="sidebar-navigation" className={`sidebar${open ? ' open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <BookOpen size={18} strokeWidth={2.2} />
            <span>IPAS Ekonomi</span>
          </div>
          <button type="button" className="sidebar-close" onClick={() => setOpen(false)} aria-label="Tutup menu">
            <X size={16} strokeWidth={2.2} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-section-label">Navigasi Materi</p>
          {NAV.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              prefetch={false}
              className={`sidebar-link${isActive(href) ? ' active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <Icon size={17} strokeWidth={2} className="link-icon" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p style={{ fontWeight: 600, color: 'var(--gray-500)', marginBottom: 2 }}>Welcome to Materi IPAS</p>
          <p>Kelola materi, submateri, dan kuis live dari satu tempat.</p>
        </div>
      </aside>
    </>
  )
}
