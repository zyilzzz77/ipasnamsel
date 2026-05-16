import { isQuizMaterialId } from '@/lib/catalog'
import { buildShareLinks, createQuizSession, getQuizSummaryList } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const quizzes = await getQuizSummaryList()
  return Response.json({ quizzes })
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      materialId?: string
      title?: string
      questionCount?: number
      durationMinutes?: number
    }

    if (!body.materialId || !isQuizMaterialId(body.materialId)) {
      return Response.json({ error: 'Materi quiz tidak valid.' }, { status: 400 })
    }

    const quiz = await createQuizSession({
      materialId: body.materialId,
      title: body.title,
      questionCount: body.questionCount,
      durationMinutes: body.durationMinutes,
    })

    return Response.json({
      quiz,
      links: buildShareLinks(quiz.id),
    }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal membuat kuis.'
    return Response.json({ error: message }, { status: 400 })
  }
}
