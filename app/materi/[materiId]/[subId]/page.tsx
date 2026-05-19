import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpen, Library } from 'lucide-react'
import { isMaterialId } from '@/lib/catalog'
import { getMaterial, getSubmateri } from '@/lib/store'

const TEORI_IMAGE_OVERRIDES: Record<string, { src: string; alt: string }> = {
  'ekonomi-mikro': { src: '/images/teori/ekonomi-mikro.jpeg', alt: 'Ilustrasi ekonomi mikro' },
  'ekonomi-makro': { src: '/images/teori/ekonomi-makro.jpeg', alt: 'Ilustrasi ekonomi makro' },
}

const TOKOH_IMAGES: { name: string; src: string }[] = [
  { name: 'Adam Smith', src: '/images/teori/tokoh-adam-smith.jpeg' },
  { name: 'John Maynard Keynes', src: '/images/teori/tokoh-john-maynard-keynes.jpeg' },
  { name: 'Alfred Marshall', src: '/images/teori/tokoh-alfred-marshall.jpeg' },
  { name: 'Milton Friedman', src: '/images/teori/tokoh-milton-friedman.jpeg' },
]

export const dynamic = 'force-dynamic'

interface MateriDetailProps {
  params: Promise<{ materiId: string; subId: string }>
}

export async function generateMetadata({ params }: MateriDetailProps): Promise<Metadata> {
  const { materiId, subId } = await params
  const material = isMaterialId(materiId) ? await getMaterial(materiId) : undefined
  const submateri = isMaterialId(materiId) ? await getSubmateri(materiId, subId) : undefined

  return {
    title: submateri ? `${submateri.title} | ${material?.title ?? 'Materi'}` : 'Materi IPAS',
  }
}

export default async function MateriDetailPage({ params }: MateriDetailProps) {
  const { materiId, subId } = await params

  if (!isMaterialId(materiId)) {
    notFound()
  }

  const material = await getMaterial(materiId)
  const submateri = await getSubmateri(materiId, subId)

  if (!material || !submateri) {
    notFound()
  }

  const index = material.submateri.findIndex((item) => item.id === subId)
  const previous = index > 0 ? material.submateri[index - 1] : undefined
  const next = index >= 0 && index < material.submateri.length - 1 ? material.submateri[index + 1] : undefined

  const teoriOverride = materiId === 'teori' ? TEORI_IMAGE_OVERRIDES[submateri.slug] : undefined
  const imageSrc = teoriOverride?.src ?? submateri.imageSrc
  const imageAlt = teoriOverride?.alt ?? submateri.imageAlt ?? submateri.title
  const isTokoh = materiId === 'teori' && submateri.slug === 'tokoh-penting-teori-ekonomi'

  return (
    <div>
      <div className="hero">
        <div className="hero-eyebrow">
          <Library size={12} />
          {material.eyebrow}
        </div>
        <h1>{material.title}</h1>
        <div className="divider" />
        <p>{submateri.summary}</p>
      </div>

      <div className="breadcrumb-row">
        <Link href="/materi" prefetch={false} className="breadcrumb-link">
          <ArrowLeft size={14} />
          Kembali ke daftar materi
        </Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{submateri.title}</span>
      </div>

      <article className="detail-card">
        <div className={`detail-card-head${imageSrc ? ' with-media' : ''}`}>
          {imageSrc && (
            <div className="detail-media-wrap">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={360}
                height={260}
                className="detail-media"
              />
            </div>
          )}

          <div className="detail-copy">
            <div className="detail-badge">
              <BadgeCheck size={15} />
              Submateri aktif
            </div>
            <h2><strong>{submateri.title}</strong></h2>
            <p><strong>{submateri.body}</strong></p>
          </div>
        </div>

        {isTokoh ? (
          <div className="detail-points">
            <h3>
              <BookOpen size={16} />
              Tokoh penting
            </h3>
            <div className="tokoh-grid">
              {TOKOH_IMAGES.map((tokoh, i) => {
                const point = submateri.points[i] ?? ''
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
          </div>
        ) : (
          submateri.points.length > 0 && (
            <div className="detail-points">
              <h3>
                <BookOpen size={16} />
                Poin penting
              </h3>
              <ul>
                {submateri.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          )
        )}

        <div className="detail-nav">
          {previous ? (
            <Link href={`/materi/${material.id}/${previous.id}`} prefetch={false} className="detail-nav-link">
              <ArrowLeft size={16} />
              <span>
                <strong>Submateri sebelumnya</strong>
                {previous.title}
              </span>
            </Link>
          ) : (
            <div className="detail-nav-empty">Ini adalah submateri pertama pada materi ini.</div>
          )}

          {next ? (
            <Link href={`/materi/${material.id}/${next.id}`} prefetch={false} className="detail-nav-link next">
              <span>
                <strong>Submateri berikutnya</strong>
                {next.title}
              </span>
              <ArrowRight size={16} />
            </Link>
          ) : (
            <div className="detail-nav-empty">Semua submateri untuk materi ini sudah terbuka.</div>
          )}
        </div>
      </article>
    </div>
  )
}
