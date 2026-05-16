import type { Metadata } from 'next'
import Image from 'next/image'
import { Globe } from 'lucide-react'
import { DEFAULT_SUBMATERI, MATERIALS } from '@/lib/catalog'

export const metadata: Metadata = { title: 'Contoh Nyata | IPAS Ekonomi' }

const contohMaterial = MATERIALS.find((material) => material.id === 'contoh')!
const contohSections = DEFAULT_SUBMATERI.contoh

export default function ContohPage() {
  return (
    <div>
      <div className="hero">
        <div className="hero-eyebrow"><Globe size={12} /> {contohMaterial.eyebrow}</div>
        <h1>Contoh dalam <span>Kehidupan</span></h1>
        <div className="divider" />
        <p>{contohMaterial.summary}</p>
      </div>

      {contohSections.map((section) => (
        <div key={section.slug} className="contoh-card">
          <div className="contoh-scenario">
            {section.imageSrc && (
              <div className="contoh-image-wrap">
                <Image
                  src={section.imageSrc}
                  alt={section.imageAlt ?? section.title}
                  width={240}
                  height={180}
                  className="contoh-image"
                />
              </div>
            )}
            <div className="contoh-copy">
              <h4>{section.title}</h4>
              <p>{section.body}</p>
            </div>
          </div>
          <div className="contoh-insight">{section.summary}</div>
        </div>
      ))}
    </div>
  )
}
