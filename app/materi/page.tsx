import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BookOpen, Globe, Lightbulb, Scale, Sparkles } from 'lucide-react'
import { type LucideIcon } from 'lucide-react'
import { getMaterials } from '@/lib/store'
import { type MaterialId } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'Materi & Submateri | IPAS Ekonomi',
  description: 'Daftar materi dan submateri IPAS Ekonomi yang bisa dibuka langsung dari satu halaman.',
}

export const dynamic = 'force-dynamic'

const MATERIAL_ICONS: Record<MaterialId, LucideIcon> = {
  teori: BookOpen,
  motif: Lightbulb,
  prinsip: Scale,
  contoh: Globe,
}

export default async function MateriIndexPage() {
  const materials = await getMaterials()

  return (
    <div>
      <div className="hero materi-hero-header">
        <Image
          src="/images/header-utama/ekonomi.jpeg"
          alt="Header materi"
          fill
          priority
          className="materi-hero-image"
        />
        <div className="materi-hero-overlay" />
        <div className="materi-hero-content">
          <div className="hero-eyebrow">
            <Sparkles size={12} />
            /materi
          </div>
          <h1>Semua materi dan <span>submateri</span> di satu tempat</h1>
          <div className="divider" />
          <p>Pilih materi utama lalu buka submateri yang ingin dipelajari. Dashboard konten di halaman /admin bisa dipakai langsung untuk menambah submateri dan hasilnya langsung muncul di sini.</p>
        </div>
      </div>

      <div className="info-box">
        <BookOpen size={16} />
        <span>Setiap kartu materi menampilkan semua submateri aktif. Klik salah satu submateri untuk membuka halaman detailnya.</span>
      </div>

      <div className="materi-grid">
        {materials.map((material) => {
          const Icon = MATERIAL_ICONS[material.id]

          return (
            <section key={material.id} className="materi-card">
              <div className="materi-card-head">
                <div className={`materi-icon ${material.accent}`}>
                  <Icon size={20} strokeWidth={2} />
                </div>
                <div>
                  <div className="card-label blue">{material.eyebrow}</div>
                  <h3>{material.title}</h3>
                  <p>{material.summary}</p>
                </div>
              </div>

              <div className="materi-meta">
                <span>{material.submateri.length} submateri aktif</span>
                <Link href={`/materi/${material.id}`} prefetch={false} className="materi-open-link">
                  Buka materi
                  <ArrowRight size={15} />
                </Link>
              </div>

              <div className="submateri-list">
                {material.submateri.map((submateri) => (
                  <Link key={submateri.id} href={`/materi/${material.id}/${submateri.id}`} prefetch={false} className="submateri-item">
                    <div>
                      <strong>{submateri.title}</strong>
                      <span>{submateri.summary}</span>
                    </div>
                    <ArrowRight size={16} />
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
