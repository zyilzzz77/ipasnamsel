import type { Metadata } from 'next'
import { headers } from 'next/headers'
import QuizHostClient from './QuizHostClient'
import { getSiteUrl } from '@/lib/site-url'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Quiz Host ${id} | IPAS Ekonomi`,
  }
}

export default async function QuizHostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const headerList = await headers()
  const fallbackUrl = new URL(getSiteUrl())
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host') ?? fallbackUrl.host
  const protocol = headerList.get('x-forwarded-proto') ?? fallbackUrl.protocol.replace(':', '')
  const baseUrl = `${protocol}://${host}`

  return <QuizHostClient quizId={id} baseUrl={baseUrl} />
}
