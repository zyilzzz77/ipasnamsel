import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BookOpen, Globe, Library, LayoutDashboard, Sparkles, Target } from 'lucide-react'
import { DEFAULT_SUBMATERI, MATERIALS, QUIZ_BANK } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'Welcome to Materi IPAS | IPAS Ekonomi',
}

const TOTAL_SUBMATERI = Object.values(DEFAULT_SUBMATERI).reduce((count, items) => count + items.length, 0)
const TOTAL_SOAL = Object.values(QUIZ_BANK).reduce((count, items) => count + items.length, 0)

const ACTIONS = [
  {
    href: '/materi',
    icon: Library,
    title: 'Buka Materi',
    desc: 'Masuk ke halaman materi untuk membaca submateri yang sudah tersusun rapi.',
  },
  {
    href: '/quiz',
    icon: Target,
    title: 'Buat Kuis',
    desc: 'Pilih materi, buat kuis baru, lalu bagikan link ke peserta.',
  },
  {
    href: '/admin',
    icon: LayoutDashboard,
    title: 'Dashboard Konten',
    desc: 'Kelola submateri dan pantau perkembangan kuis dari satu dashboard.',
  },
  {
    href: '/contoh',
    icon: Globe,
    title: 'Lihat Contoh',
    desc: 'Baca contoh penerapan ekonomi di kehidupan sehari-hari.',
  },
]

export default function BerandaPage() {
  return (
    <div>
      <div className="hero home-hero-header">
        <div className="hero-gif-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/header-utama/GIF by MINI Italia.gif" alt="Header IPAS Ekonomi" />
        </div>
        <div className="hero-gif-overlay" />
        <div className="home-hero-content">
          <div className="hero-eyebrow">
            <Sparkles size={12} />
            Welcome to Materi IPAS
          </div>
          <h1>Materi IPAS Teori, Motif dan <span>Prinsip Ekonomi</span></h1>
          <div className="divider" />
          <p>Mulai dari halaman ini untuk membaca materi, membuka submateri, menambah konten lewat admin, lalu menjalankan kuis yang dibagikan lewat link khusus.</p>
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-val">{MATERIALS.length}</div>
          <div className="stat-lbl">Materi Utama</div>
        </div>
        <div className="stat-item">
          <div className="stat-val">{TOTAL_SUBMATERI}</div>
          <div className="stat-lbl">Submateri</div>
        </div>
        <div className="stat-item">
          <div className="stat-val">{TOTAL_SOAL}</div>
          <div className="stat-lbl">Bank Soal</div>
        </div>
      </div>

      <div className="info-box">
        <BookOpen size={16} />
        <span>Buka menu <strong>tiga garis</strong> di pojok kiri atas untuk masuk ke halaman <strong>/materi</strong>, lalu lanjutkan ke <strong>/admin</strong> atau <strong>/quiz</strong> sesuai kebutuhan.</span>
      </div>

      <div className="home-grid">
        {ACTIONS.map(({ href, icon: Icon, title, desc }) => (
          <Link key={href} href={href} prefetch={false} className="home-card">
            <div className="home-card-icon">
              <Icon size={20} strokeWidth={2} />
            </div>
            <h4>{title}</h4>
            <p>{desc}</p>
            <span className="home-card-link">
              Buka halaman
              <ArrowRight size={15} />
            </span>
          </Link>
        ))}
      </div>

      <div className="hero hero-bottom">
        <div className="hero-eyebrow">
          <BookOpen size={12} />
          Materi unggulan
        </div>
        <div className="hero-bottom-row">
          <div className="hero-bottom-text">
            <h1>Tersusun dalam empat jalur belajar yang saling terhubung</h1>
            <div className="divider" />
            <p>Teori, motif, prinsip, dan contoh nyata semuanya bisa dibuka dari menu yang sama. Dashboard konten bisa dipakai langsung untuk menambah submateri tanpa langkah login tambahan.</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/snoopy.jpeg" alt="Snoopy" className="snoopy-sticker" />
        </div>
      </div>
    </div>
  )
}
