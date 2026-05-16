import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import QuizJoinLiveClient from './QuizJoinLiveClient'
import { decodeCookieValue, participantCookieName, type ParticipantSessionCookie } from '@/lib/session-cookie'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Join Quiz ${id} | IPAS Ekonomi`,
  }
}

export default async function QuizJoinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const rawParticipant = cookieStore.get(participantCookieName(id))?.value
  const initialParticipant = decodeCookieValue<ParticipantSessionCookie>(rawParticipant)

  return <QuizJoinLiveClient quizId={id} initialParticipant={initialParticipant} />
}
