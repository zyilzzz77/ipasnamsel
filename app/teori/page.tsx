import type { Metadata } from 'next'
import { BookOpen, Layers } from 'lucide-react'
import { DEFAULT_SUBMATERI, MATERIALS } from '@/lib/catalog'

export const metadata: Metadata = { title: 'Teori Ekonomi | IPAS Ekonomi' }

const teoriMaterial = MATERIALS.find((material) => material.id === 'teori')!
const teoriSections = DEFAULT_SUBMATERI.teori

export default function TeoriPage() {
  return (
    <div>
      <div className="hero">
        <div className="hero-eyebrow"><BookOpen size={12} /> {teoriMaterial.eyebrow}</div>
        <h1>Teori <span>Ekonomi</span></h1>
        <div className="divider" />
        <p>{teoriMaterial.summary}</p>
      </div>

      <div className="sec-header">
        <h2 className="sec-title">Pokok Bahasan Teori Ekonomi</h2>
        <p className="sec-sub">Ringkasan inti dari materi teori ekonomi</p>
      </div>

      {teoriSections.map((section, index) => (
        <div key={section.slug} className="card">
          <div className="card-num">{String(index + 1).padStart(2, '0')}</div>
          <div className="card-label blue"><Layers size={11} /> Submateri</div>
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
        <BookOpen size={16} />
        <span><strong>Ringkas:</strong> Teori ekonomi membantu menjelaskan bagaimana keputusan ekonomi dibuat, baik pada tingkat individu maupun perekonomian secara keseluruhan.</span>
      </div>
    </div>
  )
}
