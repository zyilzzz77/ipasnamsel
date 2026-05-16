import { isMaterialId } from '@/lib/catalog'
import { addSubmateri, getMaterials, type AddSubmateriInput } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const materials = await getMaterials()
  return Response.json({ materials })
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Omit<AddSubmateriInput, 'points'>> & {
      materialId?: string
      points?: string[] | string
    }

    if (!body.materialId || !isMaterialId(body.materialId)) {
      return Response.json({ error: 'Materi tidak valid.' }, { status: 400 })
    }

    const pointsInput = body.points
    let points: string[] = []

    if (Array.isArray(pointsInput)) {
      points = pointsInput
    } else if (typeof pointsInput === 'string') {
      points = pointsInput.split(/\r?\n/)
    }

    const material = await addSubmateri({
      materialId: body.materialId,
      title: body.title ?? '',
      summary: body.summary ?? '',
      body: body.body ?? '',
      points,
    })

    return Response.json({ material }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal menambah submateri.'
    return Response.json({ error: message }, { status: 400 })
  }
}
