import { randomUUID } from 'crypto'
import { mkdirSync, promises as fs } from 'fs'
import { DatabaseSync } from 'node:sqlite'
import path from 'path'
import {
  ALL_QUIZ_MATERIAL,
  DEFAULT_SUBMATERI,
  DEFAULT_QUIZ_DURATION_MINUTES,
  getRecommendedQuizDurationMinutes,
  MATERIALS,
  QUESTION_DURATION_SECONDS,
  QUIZ_BANK,
  type MaterialId,
  type QuizQuestion,
  type QuizMaterialId,
  type SubmateriSeed,
} from './catalog'
import { sortLeaderboard } from './quiz-ranking'

export interface StoredSubmateri extends SubmateriSeed {
  id: string
}

export interface StoredMaterial {
  id: MaterialId
  title: string
  eyebrow: string
  summary: string
  accent: string
  submateri: StoredSubmateri[]
}

export interface QuizParticipant {
  id: string
  name: string
  joinedAt: string
  score: number
  answeredCount: number
  answers: QuizParticipantAnswer[]
  lastAnsweredAt?: string
  finishedAt?: string
}

export interface QuizParticipantAnswer {
  questionIndex: number
  choiceIndex: number | null
  isCorrect: boolean
  answeredAt: string
}

export interface QuizSession {
  id: string
  title: string
  materialId: QuizMaterialId
  materialTitle: string
  status: 'waiting' | 'countdown' | 'live' | 'finished'
  questionCount: number
  questions: QuizQuestion[]
  participants: QuizParticipant[]
  createdAt: string
  updatedAt: string
  durationMinutes: number
  questionDurationSeconds: number
  countdownUntil?: number
  liveAt?: number
  endsAt?: number
  finishedAt?: string
}

export interface StoreData {
  materials: StoredMaterial[]
  quizzes: QuizSession[]
}

export interface AddSubmateriInput {
  materialId: MaterialId
  title: string
  summary: string
  body: string
  points: string[]
}

export interface CreateQuizInput {
  materialId: QuizMaterialId
  title?: string
  questionCount?: number
  durationMinutes?: number
}

export interface JoinQuizInput {
  name: string
  participantId?: string
}

export const STORE_PATH = path.join(process.cwd(), 'data', 'ipas-ekonomi-store.json')
export const DATABASE_PATH = path.join(process.cwd(), 'data', 'ipas-ekonomi-store.sqlite')

const STORE_KEY = 'app-store'

let database: DatabaseSync | null = null

function cloneDefaultStore(): StoreData {
  return {
    materials: MATERIALS.map((material) => ({
      ...material,
      submateri: DEFAULT_SUBMATERI[material.id].map((submateri) => ({
        ...submateri,
        id: submateri.slug,
      })),
    })),
    quizzes: [],
  }
}

function normalizeStoredSubmateri(materialId: MaterialId, submateri: StoredSubmateri): StoredSubmateri {
  let imageSrc = submateri.imageSrc

  if (imageSrc) {
    const legacyMap: Record<string, string | undefined> = {
      '/images/contoh/harga-turun-pembeli-naik.svg': '/images/contoh/harga-turun-pembeli-naik.jpg',
      '/images/contoh/buka-toko-untuk-laba.svg': '/images/contoh/buka-toko-untuk-laba.jpg',
      '/images/contoh/donasi-untuk-sesama.svg': '/images/contoh/donasi-untuk-sesama.jpg',
      '/images/contoh/barang-mewah-dan-status.svg': '/images/contoh/barang-mewah-status.jpg',
      '/images/contoh/menabung-untuk-masa-depan.svg': '/images/contoh/menabung-untuk-masa-depan.jpg',
      '/images/contoh/bandingkan-harga-belanja.svg': '/images/contoh/bandingkan-harga-belanja.jpg',
      '/images/contoh/subsidi-tepat-sasaran.svg': '/images/contoh/subsidi-tepat-sasaran.jpg',
      '/images/teori/pengertian-teori-ekonomi.svg': '/images/teori/pengertian-teori-ekonomi.jpeg',
      '/images/teori/ekonomi-mikro.svg': '/images/teori/ekonomi-mikro.jpeg',
      '/images/teori/ekonomi-makro.svg': '/images/teori/ekonomi-makro.jpeg',
      '/images/teori/masalah-pokok.svg': '/images/teori/masalah-pokok.jpeg',
      '/images/motif/pengertian-motif.svg': '/images/motif/pengertian-motif.jpeg',
      '/images/motif/pemenuhan-kebutuhan.svg': '/images/motif/pemenuhan-kebutuhan.jpeg',
      '/images/motif/memperoleh-keuntungan.svg': '/images/motif/memperoleh-keuntungan.jpeg',
      '/images/motif/motif-sosial.svg': '/images/motif/motif-sosial.jpeg',
      '/images/motif/prestise-kekuasaan.svg': '/images/motif/prestise-kekuasaan.jpeg',
      '/images/motif/keamanan-masa-depan.svg': '/images/motif/keamanan-masa-depan.jpeg',
      '/images/motif/motif-pelaku.svg': '/images/motif/motif-pelaku.gif',
      '/images/prinsip/pengertian-prinsip.svg': '/images/prinsip/prinsip-ekonomi.jpeg',
      '/images/prinsip/rumusan-prinsip.svg': '/images/prinsip/rumusan-prinsip.jpeg',
      '/images/prinsip/ciri-penerapan.svg': '/images/prinsip/ciri-penerapan.jpeg',
      '/images/prinsip/penerapan-prinsip.svg': '/images/prinsip/penerepan-prinsip.jpeg',
      '/images/prinsip/manfaat-prinsip.svg': '/images/prinsip/manfaat-prinsip.jpeg',
    }

    imageSrc = legacyMap[imageSrc] ?? imageSrc
  }

  return {
    ...submateri,
    imageSrc,
  }
}

function normalizeStoredMaterial(material: StoredMaterial): StoredMaterial {
  return {
    ...material,
    submateri: material.submateri.map((submateri) => normalizeStoredSubmateri(material.id, submateri)),
  }
}

function mergeWithCatalogDefaults(storedMaterials: StoredMaterial[]): StoredMaterial[] {
  return storedMaterials.map((storedMaterial) => {
    const catalogDefaults = DEFAULT_SUBMATERI[storedMaterial.id] ?? []
    const mergedSubmateri = storedMaterial.submateri.map((storedSub) => {
      const catalogSub = catalogDefaults.find((c) => c.slug === storedSub.slug)
      if (!catalogSub) return storedSub
      return {
        ...storedSub,
        imageSrc: catalogSub.imageSrc ?? storedSub.imageSrc,
        imageAlt: catalogSub.imageAlt ?? storedSub.imageAlt,
      }
    })
    return { ...storedMaterial, submateri: mergedSubmateri }
  })
}

function normalizeStoreData(store?: Partial<StoreData>): StoreData {
  const defaultStore = cloneDefaultStore()
  const rawMaterials = store?.materials ?? defaultStore.materials
  const mergedMaterials = mergeWithCatalogDefaults(rawMaterials)

  return {
    materials: mergedMaterials.map(normalizeStoredMaterial),
    quizzes: store?.quizzes ?? [],
  }
}

function getDatabase(): DatabaseSync {
  if (database) {
    return database
  }

  mkdirSync(path.dirname(DATABASE_PATH), { recursive: true })
  database = new DatabaseSync(DATABASE_PATH)
  database.exec(`
    CREATE TABLE IF NOT EXISTS app_store (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `)

  return database
}

async function readLegacyStoreFile(): Promise<StoreData | null> {
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf8')
    return normalizeStoreData(JSON.parse(raw) as StoreData)
  } catch {
    return null
  }
}

function readStoreFromDatabase(): StoreData | null {
  const row = getDatabase()
    .prepare('SELECT value FROM app_store WHERE key = ?')
    .get(STORE_KEY) as { value?: string } | undefined

  if (!row?.value) {
    return null
  }

  try {
    return normalizeStoreData(JSON.parse(row.value) as StoreData)
  } catch {
    return null
  }
}

function normalizeLines(lines: string[] | string | undefined): string[] {
  if (!lines) {
    return []
  }

  if (Array.isArray(lines)) {
    return lines.map((line) => line.trim()).filter(Boolean)
  }

  return lines
    .split(/\r?\n/)
    .map((line) => line.replace(/^[\-*•\s]+/, '').trim())
    .filter(Boolean)
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function createId(prefix: string): string {
  return `${prefix}-${randomUUID().slice(0, 8)}`
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)))
}

function shuffleValues<T>(values: T[]): T[] {
  const shuffled = [...values]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const temporary = shuffled[index]
    shuffled[index] = shuffled[swapIndex]
    shuffled[swapIndex] = temporary
  }

  return shuffled
}

function buildQuestionOptions(correct: string, distractors: string[], fallbackOptions: string[]): string[] {
  const pool = uniqueStrings([...distractors, ...fallbackOptions].filter((item) => item !== correct))
  const shuffled = shuffleValues(pool).slice(0, 3)
  const options = shuffleValues([correct, ...shuffled])

  while (options.length < 4) {
    options.push(`Opsi ${options.length + 1}`)
  }

  return options
}

function dedupeQuestions(questions: QuizQuestion[]): QuizQuestion[] {
  const seen = new Set<string>()

  return questions.filter((question) => {
    const key = question.question.trim().toLowerCase()
    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

function buildMaterialQuizQuestions(material: StoredMaterial): QuizQuestion[] {
  if (material.submateri.length === 0) {
    return []
  }

  const summaries = material.submateri.map((submateri) => submateri.summary)
  const fallbackOptions = [
    material.summary,
    `Ringkasan umum ${material.title}`,
    'Konsep utama materi',
    'Hubungan antar gagasan',
    ...material.submateri.map((submateri) => submateri.title),
  ]

  return material.submateri.map((submateri) => {
    const options = buildQuestionOptions(
      submateri.summary,
      summaries.filter((summary) => summary !== submateri.summary),
      fallbackOptions,
    )

    return {
      question: `Pernyataan yang paling sesuai dengan submateri "${submateri.title}" adalah ...`,
      options,
      answer: options.indexOf(submateri.summary),
      explanation: submateri.summary,
    }
  })
}

function cloneQuestion(question: QuizQuestion): QuizQuestion {
  const shuffledOptions = shuffleValues([...question.options])
  return {
    ...question,
    options: shuffledOptions,
    answer: shuffledOptions.indexOf(question.options[question.answer]),
  }
}

function buildQuizQuestions(material: StoredMaterial): QuizQuestion[] {
  return dedupeQuestions([
    ...buildMaterialQuizQuestions(material),
    ...QUIZ_BANK[material.id].map(cloneQuestion),
  ])
}

function buildCombinedQuizQuestions(materials: StoredMaterial[]): QuizQuestion[] {
  return dedupeQuestions(materials.flatMap((material) => buildQuizQuestions(material)))
}

function resolveQuizSource(materialId: QuizMaterialId, materials: StoredMaterial[]) {
  if (materialId === ALL_QUIZ_MATERIAL.id) {
    return {
      materialId,
      materialTitle: ALL_QUIZ_MATERIAL.title,
      questions: buildCombinedQuizQuestions(materials),
    }
  }

  const material = materials.find((item) => item.id === materialId)
  if (!material) {
    throw new Error('Materi untuk kuis tidak ditemukan.')
  }

  return {
    materialId: material.id,
    materialTitle: material.title,
    questions: buildQuizQuestions(material),
  }
}

function normalizeParticipantRecord(participant: Partial<QuizParticipant>): QuizParticipant {
  return {
    id: participant.id ?? createId('participant'),
    name: participant.name ?? 'Peserta',
    joinedAt: participant.joinedAt ?? new Date().toISOString(),
    score: participant.score ?? 0,
    answeredCount: participant.answeredCount ?? participant.answers?.length ?? 0,
    answers: participant.answers ?? [],
    lastAnsweredAt: participant.lastAnsweredAt,
    finishedAt: participant.finishedAt,
  }
}

function normalizeParticipants(session: QuizSession): boolean {
  let changed = false

  session.participants = session.participants.map((participant) => {
    const normalized = normalizeParticipantRecord(participant)
    if (
      normalized.id !== participant.id
      || normalized.name !== participant.name
      || normalized.joinedAt !== participant.joinedAt
      || normalized.score !== participant.score
      || normalized.answeredCount !== participant.answeredCount
      || normalized.answers.length !== (participant.answers?.length ?? 0)
      || normalized.lastAnsweredAt !== participant.lastAnsweredAt
      || normalized.finishedAt !== participant.finishedAt
    ) {
      changed = true
    }

    return normalized
  })

  return changed
}

async function readStoreFile(): Promise<StoreData> {
  const databaseStore = readStoreFromDatabase()
  if (databaseStore) {
    return databaseStore
  }

  const legacyStore = await readLegacyStoreFile()
  const nextStore = legacyStore ?? cloneDefaultStore()

  await writeStoreFile(nextStore)

  return nextStore
}

async function writeStoreFile(store: StoreData): Promise<void> {
  const normalizedStore = normalizeStoreData(store)
  const payload = JSON.stringify(normalizedStore)

  getDatabase()
    .prepare(`
      INSERT INTO app_store (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `)
    .run(STORE_KEY, payload)

  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true })
  await fs.writeFile(STORE_PATH, JSON.stringify(normalizedStore, null, 2), 'utf8')
}

function uniqueSlug(existingSlugs: string[], value: string): string {
  const baseSlug = slugify(value) || createId('sub')
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug
  }

  let counter = 2
  while (existingSlugs.includes(`${baseSlug}-${counter}`)) {
    counter += 1
  }

  return `${baseSlug}-${counter}`
}

function normalizeQuizSession(session: QuizSession, now = Date.now()): boolean {
  let changed = normalizeParticipants(session)

  if (!session.durationMinutes) {
    session.durationMinutes = DEFAULT_QUIZ_DURATION_MINUTES
    changed = true
  }

  if (!session.questionDurationSeconds) {
    session.questionDurationSeconds = QUESTION_DURATION_SECONDS
    changed = true
  }

  if (!session.questionCount || session.questionCount !== session.questions.length) {
    session.questionCount = session.questions.length
    changed = true
  }

  if (!session.endsAt && session.status !== 'waiting') {
    const anchorTime = session.liveAt ?? session.countdownUntil ?? now
    session.endsAt = anchorTime + (session.durationMinutes * 60_000)
    changed = true
  }

  if (session.status === 'countdown' && session.countdownUntil && now >= session.countdownUntil) {
    session.status = 'live'
    session.liveAt = session.countdownUntil
    delete session.countdownUntil
    changed = true
  }

  if (session.status === 'live' && session.endsAt && now >= session.endsAt) {
    session.status = 'finished'
    session.finishedAt = session.endsAt ? new Date(session.endsAt).toISOString() : new Date(now).toISOString()
    changed = true
  }

  if (session.status === 'countdown' && session.endsAt && now >= session.endsAt) {
    session.status = 'finished'
    session.finishedAt = session.endsAt ? new Date(session.endsAt).toISOString() : new Date(now).toISOString()
    delete session.countdownUntil
    changed = true
  }

  return changed
}

export async function getStore(): Promise<StoreData> {
  return readStoreFile()
}

export async function getMaterials(): Promise<StoredMaterial[]> {
  const store = await readStoreFile()
  return store.materials
}

export async function getMaterial(materialId: MaterialId): Promise<StoredMaterial | undefined> {
  const store = await readStoreFile()
  return store.materials.find((material) => material.id === materialId)
}

export async function getSubmateri(materialId: MaterialId, subId: string): Promise<StoredSubmateri | undefined> {
  const material = await getMaterial(materialId)
  return material?.submateri.find((submateri) => submateri.id === subId)
}

export async function addSubmateri(input: AddSubmateriInput): Promise<StoredMaterial> {
  const store = await readStoreFile()
  const material = store.materials.find((item) => item.id === input.materialId)

  if (!material) {
    throw new Error('Materi tidak ditemukan.')
  }

  const existingSlugs = material.submateri.map((submateri) => submateri.id)
  const title = input.title.trim()
  const summary = input.summary.trim()
  const body = input.body.trim()
  const points = normalizeLines(input.points)

  if (!title || !summary || !body) {
    throw new Error('Judul, ringkasan, dan isi submateri wajib diisi.')
  }

  const slug = uniqueSlug(existingSlugs, title)
  const submateri = {
    id: slug,
    slug,
    title,
    summary,
    body,
    points,
  }

  material.submateri.push(submateri)
  await writeStoreFile(store)

  return material
}

export async function listQuizzes(): Promise<QuizSession[]> {
  const store = await readStoreFile()
  let changed = false

  store.quizzes.forEach((session) => {
    changed = normalizeQuizSession(session) || changed
  })

  if (changed) {
    await writeStoreFile(store)
  }

  return store.quizzes
}

export async function getQuizSession(quizId: string): Promise<QuizSession | undefined> {
  const store = await readStoreFile()
  const session = store.quizzes.find((quiz) => quiz.id === quizId)

  if (!session) {
    return undefined
  }

  const changed = normalizeQuizSession(session)
  if (changed) {
    await writeStoreFile(store)
  }

  return session
}

export async function createQuizSession(input: CreateQuizInput): Promise<QuizSession> {
  const store = await readStoreFile()
  const source = resolveQuizSource(input.materialId, store.materials)
  const questions = source.questions
  const limit = Math.max(1, Math.min(input.questionCount ?? questions.length, questions.length))
  const durationMinutes = Math.max(1, Math.round(input.durationMinutes ?? getRecommendedQuizDurationMinutes(limit)))
  const now = new Date().toISOString()
  const session: QuizSession = {
    id: createId('quiz'),
    title: input.title?.trim() || `Kuis ${source.materialTitle}`,
    materialId: source.materialId,
    materialTitle: source.materialTitle,
    status: 'waiting',
    questionCount: limit,
    questions: questions.slice(0, limit),
    participants: [],
    createdAt: now,
    updatedAt: now,
    durationMinutes,
    questionDurationSeconds: QUESTION_DURATION_SECONDS,
  }

  store.quizzes.unshift(session)
  await writeStoreFile(store)

  return session
}

export async function joinQuizSession(quizId: string, input: JoinQuizInput): Promise<QuizSession> {
  const store = await readStoreFile()
  const session = store.quizzes.find((quiz) => quiz.id === quizId)

  if (!session) {
    throw new Error('Kuis tidak ditemukan.')
  }

  const rawName = input.name.trim()
  if (!rawName) {
    throw new Error('Nama peserta wajib diisi.')
  }

  const participantId = input.participantId?.trim()
  if (normalizeQuizSession(session)) {
    // Persisted below if the session is still joinable.
  }

  const existingParticipant = participantId
    ? session.participants.find((participant) => participant.id === participantId)
    : undefined

  if (existingParticipant) {
    const normalizedParticipant = normalizeParticipantRecord(existingParticipant)
    Object.assign(existingParticipant, normalizedParticipant)
    existingParticipant.name = rawName
    session.updatedAt = new Date().toISOString()
    await writeStoreFile(store)
    return session
  }

  if (session.status === 'finished' && !participantId) {
    throw new Error('Kuis sudah selesai, peserta baru tidak dapat join.')
  }

  const lowerNames = session.participants.map((participant) => participant.name.toLowerCase())
  let finalName = rawName
  let suffix = 2
  while (lowerNames.includes(finalName.toLowerCase())) {
    finalName = `${rawName} ${suffix}`
    suffix += 1
  }

  session.participants.push({
    id: participantId || createId('participant'),
    name: finalName,
    joinedAt: new Date().toISOString(),
    score: 0,
    answeredCount: 0,
    answers: [],
  })
  session.updatedAt = new Date().toISOString()

  await writeStoreFile(store)

  return session
}

export async function startQuizSession(quizId: string): Promise<QuizSession> {
  const store = await readStoreFile()
  const session = store.quizzes.find((quiz) => quiz.id === quizId)

  if (!session) {
    throw new Error('Kuis tidak ditemukan.')
  }

  if (normalizeQuizSession(session)) {
    await writeStoreFile(store)
    return session
  }

  if (session.status !== 'waiting') {
    return session
  }

  if (session.participants.length === 0) {
    throw new Error('Belum ada peserta. Minimal 1 peserta harus bergabung sebelum quiz dimulai.')
  }

  session.status = 'countdown'
  session.countdownUntil = Date.now() + 3000
  session.endsAt = Date.now() + 3000 + (session.durationMinutes * 60_000)
  session.updatedAt = new Date().toISOString()

  await writeStoreFile(store)

  return session
}

export async function recordQuizAnswer(
  quizId: string,
  input: { participantId: string; questionIndex: number; choiceIndex: number | null },
): Promise<QuizSession> {
  const store = await readStoreFile()
  const session = store.quizzes.find((quiz) => quiz.id === quizId)

  if (!session) {
    throw new Error('Kuis tidak ditemukan.')
  }

  normalizeQuizSession(session)

  if (session.status === 'finished') {
    throw new Error('Kuis sudah berakhir.')
  }

  if (session.status !== 'live') {
    throw new Error('Kuis belum dimulai.')
  }

  const participant = session.participants.find((item) => item.id === input.participantId.trim())

  if (!participant) {
    throw new Error('Peserta tidak ditemukan.')
  }

  const question = session.questions[input.questionIndex]
  if (!question) {
    throw new Error('Soal tidak ditemukan.')
  }

  const now = new Date().toISOString()
  const existingAnswer = participant.answers.find((answer) => answer.questionIndex === input.questionIndex)
  const isCorrect = input.choiceIndex === question.answer

  if (existingAnswer) {
    if (existingAnswer.choiceIndex === input.choiceIndex) {
      return session
    }

    if (existingAnswer.isCorrect) {
      participant.score = Math.max(0, participant.score - 1)
    }

    existingAnswer.choiceIndex = input.choiceIndex
    existingAnswer.isCorrect = isCorrect
    existingAnswer.answeredAt = now

    if (isCorrect) {
      participant.score += 1
    }
  } else {
    participant.answers.push({
      questionIndex: input.questionIndex,
      choiceIndex: input.choiceIndex,
      isCorrect,
      answeredAt: now,
    })

    participant.answeredCount += 1

    if (isCorrect) {
      participant.score += 1
    }
  }

  participant.lastAnsweredAt = now

  if (participant.answers.length >= session.questions.length) {
    participant.finishedAt = now
  }

  session.updatedAt = now

  await writeStoreFile(store)

  return session
}

export async function getQuizSummaryList() {
  const quizzes = await listQuizzes()

  return quizzes.map((quiz) => {
    const topParticipant = sortLeaderboard(quiz.participants)[0]

    return {
      id: quiz.id,
      title: quiz.title,
      materialId: quiz.materialId,
      materialTitle: quiz.materialTitle,
      status: quiz.status,
      questionCount: quiz.questionCount,
      participantCount: quiz.participants.length,
      durationMinutes: quiz.durationMinutes,
      questionDurationSeconds: quiz.questionDurationSeconds,
      liveAt: quiz.liveAt,
      endsAt: quiz.endsAt,
      finishedAt: quiz.finishedAt,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
      topParticipant: topParticipant
        ? {
            name: topParticipant.name,
            score: topParticipant.score,
          }
        : null,
    }
  })
}

export function buildShareLinks(quizId: string) {
  return {
    joinPath: `/quiz/${quizId}`,
    hostPath: `/quiz/start/${quizId}`,
  }
}
