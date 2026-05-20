import type { Metadata } from 'next'
import Image from 'next/image'
import { BookOpen, Layers } from 'lucide-react'
import { DEFAULT_SUBMATERI, MATERIALS } from '@/lib/catalog'



const TOKOH_IMAGES: { name: string; src: string }[] = [
  { name: 'Adam Smith', src: '/images/teori/tokoh-adam-smith.jpeg' },
  { name: 'John Maynard Keynes', src: '/images/teori/tokoh-john-maynard-keynes.jpeg' },
  { name: 'Alfred Marshall', src: '/images/teori/tokoh-alfred-marshall.jpeg' },
  { name: 'Milton Friedman', src: '/images/teori/tokoh-milton-friedman.jpeg' },
]

export const metadata: Metadata = { title: 'Teori Ekonomi | IPAS Ekonomi' }

const teoriMaterial = MATERIALS.find((material) => material.id === 'teori')!
const teoriSections = DEFAULT_SUBMATERI.teori

export default function TeoriPage() {
  return (
    <div>
      <div className="hero teori-hero-header">
        <div className="hero-gif-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/header-utama/GIF by MINI Italia.gif" alt="Header teori ekonomi" />
        </div>
        <div className="hero-gif-overlay" />
        <div className="teori-hero-content">
          <div className="hero-eyebrow"><BookOpen size={12} /> {teoriMaterial.eyebrow}</div>
          <h1>Teori <span>Ekonomi</span></h1>
          <div className="divider" />
          <p>{teoriMaterial.summary}</p>
        </div>
      </div>

      <div className="sec-header">
        <h2 className="sec-title">Pokok Bahasan Teori Ekonomi</h2>
        <p className="sec-sub">Ringkasan inti dari materi teori ekonomi</p>
      </div>

      {teoriSections.map((section, index) => {
        const isTokoh = section.slug === 'tokoh-penting-teori-ekonomi'
        return (
          <div key={section.slug} className="card">
            <div className="card-num">{String(index + 1).padStart(2, '0')}</div>
            <div className="card-label blue"><Layers size={11} /> Submateri</div>
            <h3 className="teori-title"><strong>{section.title}</strong></h3>
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
                <p><strong>{section.body}</strong></p>
                {!isTokoh && (
                  <ul className="card-points">
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {isTokoh && (
              <div className="tokoh-grid">
                {TOKOH_IMAGES.map((tokoh, i) => {
                  const point = section.points[i] ?? ''
                  const colonIdx = point.indexOf(':')
                  const desc = colonIdx >= 0 ? point.slice(colonIdx + 1).trim() : point
                  return (
                    <div key={tokoh.name} className="tokoh-item">
                      <div className="tokoh-image-wrap">
                        <Image
                          src={tokoh.src}
                          alt={`Foto ${tokoh.name}`}
                          width={120}
                          height={120}
                          className="tokoh-image"
                        />
                      </div>
                      <div className="tokoh-copy">
                        <h4><strong>{tokoh.name}</strong></h4>
                        <p><strong>{desc}</strong></p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      <div className="info-box">
        <BookOpen size={16} />
        <span><strong>Ringkas:</strong> Teori ekonomi membantu menjelaskan bagaimana keputusan ekonomi dibuat, baik pada tingkat individu maupun perekonomian secara keseluruhan.</span>
      </div>
    </div>
  )
}
