import { buildShareLinks, getQuizSession } from '@/lib/store'

export const dynamic = 'force-dynamic'

interface QuizParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: QuizParams) {
  const { id } = await params
  const quiz = await getQuizSession(id)

  if (!quiz) {
    return Response.json({ error: 'Kuis tidak ditemukan.' }, { status: 404 })
  }

  return Response.json({
    quiz,
    links: buildShareLinks(quiz.id),
  })
}
