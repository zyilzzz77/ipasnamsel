import type { Metadata } from 'next'
import Image from 'next/image'
import { Layers, Scale, Sparkles } from 'lucide-react'
import { DEFAULT_SUBMATERI, MATERIALS } from '@/lib/catalog'

export const metadata: Metadata = { title: 'Prinsip Ekonomi | IPAS Ekonomi' }

const prinsipMaterial = MATERIALS.find((material) => material.id === 'prinsip')!
const prinsipSections = DEFAULT_SUBMATERI.prinsip

export default function PrinsipPage() {
  return (
    <div>
      <div className="hero prinsip-hero-header">
        <Image
          src="/images/header-utama/prinsip-ekonomi.jpeg"
          alt="Header prinsip ekonomi"
          fill
          priority
          className="prinsip-hero-image"
        />
        <div className="prinsip-hero-overlay" />
        <div className="prinsip-hero-content">
          <div className="hero-eyebrow"><Scale size={12} /> {prinsipMaterial.eyebrow}</div>
          <h1>Prinsip <span>Ekonomi</span></h1>
          <div className="divider" />
          <p>{prinsipMaterial.summary}</p>
        </div>
        <div className="hero-gif-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/header-utama/GIF by MINI Italia.gif" alt="Mini animation" />
        </div>
      </div>

      <div className="sec-header">
        <h2 className="sec-title">Pokok Bahasan Prinsip Ekonomi</h2>
        <p className="sec-sub">Efisiensi dalam mengambil keputusan ekonomi</p>
      </div>

      {prinsipSections.map((section, index) => (
        <div key={section.slug} className="card">
          <div className="card-num">{String(index + 1).padStart(2, '0')}</div>
          <div className="card-label amber"><Layers size={11} /> Submateri</div>
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
        <Sparkles size={16} />
        <span><strong>Ringkas:</strong> Prinsip ekonomi menolong kita memilih cara yang paling efisien agar kebutuhan terpenuhi tanpa pemborosan.</span>
      </div>
    </div>
  )
}
