import { isMaterialId } from '@/lib/catalog'
import { getMaterial } from '@/lib/store'

export const dynamic = 'force-dynamic'

interface MateriParams {
  params: Promise<{ materiId: string }>
}

export async function GET(_request: Request, { params }: MateriParams) {
  const { materiId } = await params

  if (!isMaterialId(materiId)) {
    return Response.json({ error: 'Materi tidak ditemukan.' }, { status: 404 })
  }

  const material = await getMaterial(materiId)
  if (!material) {
    return Response.json({ error: 'Materi tidak ditemukan.' }, { status: 404 })
  }

  return Response.json({ material })
}
