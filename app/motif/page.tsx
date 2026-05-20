import type { Metadata } from 'next'
import Image from 'next/image'
import { Info, Layers, Lightbulb } from 'lucide-react'
import { DEFAULT_SUBMATERI, MATERIALS } from '@/lib/catalog'

export const metadata: Metadata = { title: 'Motif Ekonomi | IPAS Ekonomi' }

const motifMaterial = MATERIALS.find((material) => material.id === 'motif')!
const motifSections = DEFAULT_SUBMATERI.motif

export default function MotifPage() {
  return (
    <div>
      <div className="hero motif-hero-header">
        <Image
          src="/images/header-utama/motif-ekonomi.jpeg"
          alt="Header motif ekonomi"
          fill
          priority
          className="motif-hero-image"
        />
        <div className="motif-hero-overlay" />
        <div className="motif-hero-content">
          <div className="hero-eyebrow"><Lightbulb size={12} /> {motifMaterial.eyebrow}</div>
          <h1>Motif <span>Ekonomi</span></h1>
          <div className="divider" />
          <p>{motifMaterial.summary}</p>
        </div>
        <div className="hero-gif-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/header-utama/GIF by MINI Italia.gif" alt="Mini animation" />
        </div>
      </div>

      <div className="sec-header">
        <h2 className="sec-title">Pokok Bahasan Motif Ekonomi</h2>
        <p className="sec-sub">Dorongan yang melatarbelakangi kegiatan ekonomi</p>
      </div>

      {motifSections.map((section, index) => (
        <div key={section.slug} className="card">
          <div className="card-num">{String(index + 1).padStart(2, '0')}</div>
          <div className="card-label green"><Layers size={11} /> Submateri</div>
          <h3>{section.title}</h3>
          <div className={section.imageSrc ? 'teori-body teori-body--with-image' : 'teori-body'}>
            {section.imageSrc && (
              <div className="teori-image-wrap">
                <Image
                  src={section.imageSrc}
                  alt={section.imageAlt || section.title}
                  width={200}
                  height={200}
                  className="teori-image"
                />
              </div>
            )}
            <div className="teori-copy">
              <p>{section.body}</p>
              <ul className="card-points">
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}

      <div className="info-box">
        <Info size={16} />
        <span><strong>Ringkas:</strong> Motif ekonomi membantu menjelaskan alasan di balik tindakan konsumen, produsen, dan pemerintah.</span>
      </div>
    </div>
  )
}
