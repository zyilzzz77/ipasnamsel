import { redirect, notFound } from 'next/navigation'
import { getMaterial } from '@/lib/store'
import { isMaterialId } from '@/lib/catalog'

export const dynamic = 'force-dynamic'

interface MateriPageProps {
  params: Promise<{ materiId: string }>
}

export default async function MateriRedirectPage({ params }: MateriPageProps) {
  const { materiId } = await params

  if (!isMaterialId(materiId)) {
    notFound()
  }

  const material = await getMaterial(materiId)
  const firstSubmateri = material?.submateri[0]

  if (!material || !firstSubmateri) {
    notFound()
  }

  redirect(`/materi/${material.id}/${firstSubmateri.id}`)
}
