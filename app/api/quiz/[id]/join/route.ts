import { joinQuizSession } from '@/lib/store'

export const dynamic = 'force-dynamic'

interface QuizParams {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, { params }: QuizParams) {
  try {
    const { id } = await params
    const body = await request.json() as { name?: string; participantId?: string }

    const quiz = await joinQuizSession(id, {
      name: body.name ?? '',
      participantId: body.participantId,
    })

    const participant = body.participantId
      ? quiz.participants.find((item) => item.id === body.participantId)
      : quiz.participants[quiz.participants.length - 1]

    return Response.json({ quiz, participant })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal join kuis.'
    return Response.json({ error: message }, { status: 400 })
  }
}
