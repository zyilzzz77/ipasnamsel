import { QUIZ_START_DELAY_MS } from '@/lib/catalog'
import { startQuizSession } from '@/lib/store'

export const dynamic = 'force-dynamic'

interface QuizParams {
  params: Promise<{ id: string }>
}

export async function POST(_request: Request, { params }: QuizParams) {
  try {
    const { id } = await params
    const quiz = await startQuizSession(id)

    return Response.json({
      quiz,
      countdownMs: QUIZ_START_DELAY_MS,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal memulai kuis.'
    return Response.json({ error: message }, { status: 400 })
  }
}
