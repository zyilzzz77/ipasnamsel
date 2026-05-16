import type { Metadata } from 'next'
import QuizBuilderClient from './QuizBuilderClient'

export const metadata: Metadata = {
  title: 'Quiz Interaktif | IPAS Ekonomi',
  description: 'Buat quiz baru dari materi IPAS Ekonomi dan bagikan link live ke peserta.',
}

export default function QuizPage() {
  return <QuizBuilderClient />
}

