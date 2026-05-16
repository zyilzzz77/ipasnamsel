import type { Metadata } from 'next'
import { Layers, Scale, Sparkles } from 'lucide-react'
import { DEFAULT_SUBMATERI, MATERIALS } from '@/lib/catalog'

export const metadata: Metadata = { title: 'Prinsip Ekonomi | IPAS Ekonomi' }

const prinsipMaterial = MATERIALS.find((material) => material.id === 'prinsip')!
const prinsipSections = DEFAULT_SUBMATERI.prinsip

export default function PrinsipPage() {
  return (
    <div>
      <div className="hero">
        <div className="hero-eyebrow"><Scale size={12} /> {prinsipMaterial.eyebrow}</div>
        <h1>Prinsip <span>Ekonomi</span></h1>
        <div className="divider" />
        <p>{prinsipMaterial.summary}</p>
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
          <p>{section.body}</p>
          <ul className="card-points">
            {section.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      ))}

      <div className="info-box">
        <Sparkles size={16} />
        <span><strong>Ringkas:</strong> Prinsip ekonomi menolong kita memilih cara yang paling efisien agar kebutuhan terpenuhi tanpa pemborosan.</span>
      </div>
    </div>
  )
}
