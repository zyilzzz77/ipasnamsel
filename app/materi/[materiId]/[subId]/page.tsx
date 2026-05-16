import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpen, Library } from 'lucide-react'
import { isMaterialId } from '@/lib/catalog'
import { getMaterial, getSubmateri } from '@/lib/store'

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
        <div className={`detail-card-head${submateri.imageSrc ? ' with-media' : ''}`}>
          {submateri.imageSrc && (
            <div className="detail-media-wrap">
              <Image
                src={submateri.imageSrc}
                alt={submateri.imageAlt ?? submateri.title}
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
            <h2>{submateri.title}</h2>
            <p>{submateri.body}</p>
          </div>
        </div>

        {submateri.points.length > 0 && (
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
