import { recordQuizAnswer } from '@/lib/store'

export const dynamic = 'force-dynamic'

interface QuizParams {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, { params }: QuizParams) {
  try {
    const { id } = await params
    const body = await request.json() as {
      participantId?: string
      questionIndex?: number
      choiceIndex?: number | null
    }

    if (!body.participantId || body.questionIndex === undefined) {
      return Response.json({ error: 'Data jawaban tidak lengkap.' }, { status: 400 })
    }

    const quiz = await recordQuizAnswer(id, {
      participantId: body.participantId,
      questionIndex: body.questionIndex,
      choiceIndex: body.choiceIndex ?? null,
    })

    const participant = quiz.participants.find((item) => item.id === body.participantId)

    return Response.json({ quiz, participant })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal menyimpan jawaban.'
    return Response.json({ error: message }, { status: 400 })
  }
}
