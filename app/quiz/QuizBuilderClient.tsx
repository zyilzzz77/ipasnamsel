'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Clock3, History, Play, Sparkles, Target, Trophy } from 'lucide-react'
import {
  ALL_QUIZ_MATERIAL,
  DEFAULT_QUIZ_DURATION_MINUTES,
  DEFAULT_SUBMATERI,
  getRecommendedQuizDurationMinutes,
  MATERIALS,
  QUIZ_BANK,
  type MaterialId,
} from '@/lib/catalog'
import Link from 'next/link'

function formatQuizTimestamp(value?: string | number) {
  if (!value) {
    return '-'
  }

  return new Date(value).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface QuizSummary {
  id: string
  title: string
  materialTitle: string
  status: 'waiting' | 'countdown' | 'live' | 'finished'
  questionCount: number
  participantCount: number
  durationMinutes: number
  questionDurationSeconds: number
  liveAt?: number
  endsAt?: number
  finishedAt?: string
  createdAt: string
  updatedAt: string
  topParticipant: { name: string; score: number } | null
}

type Tab = 'create' | 'history'

export default function QuizBuilderClient() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('create')
  const [durationMinutes, setDurationMinutes] = useState(DEFAULT_QUIZ_DURATION_MINUTES)
  const [recentQuizzes, setRecentQuizzes] = useState<QuizSummary[]>([])
  const [materialCounts, setMaterialCounts] = useState<Record<MaterialId, number>>(
    MATERIALS.reduce((counts, material) => {
      counts[material.id] = DEFAULT_SUBMATERI[material.id].length
      return counts
    }, {} as Record<MaterialId, number>),
  )
  const [durationTouched, setDurationTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingRecent, setLoadingRecent] = useState(true)
  const [notice, setNotice] = useState('')
  const [questionCount, setQuestionCount] = useState(0)
  const [questionCountText, setQuestionCountText] = useState<string | null>(null)
  const [durationText, setDurationText] = useState<string | null>(null)

  const totalSubmateri = useMemo(
    () => Object.values(materialCounts).reduce((count, value) => count + value, 0),
    [materialCounts],
  )
  const totalQuizBank = useMemo(
    () => Object.values(QUIZ_BANK).reduce((count, questions) => count + questions.length, 0),
    [],
  )
  const totalQuestions = totalSubmateri + totalQuizBank
  const selectedQuestionCount = questionCount > 0 ? Math.min(questionCount, totalQuestions) : totalQuestions
  const recommendedDuration = useMemo(
    () => getRecommendedQuizDurationMinutes(selectedQuestionCount || totalQuestions),
    [selectedQuestionCount, totalQuestions],
  )
  const effectiveDuration = durationTouched ? durationMinutes : recommendedDuration

  useEffect(() => {
    let cancelled = false

    async function loadRecent() {
      setLoadingRecent(true)
      try {
        const [materialsResponse, quizzesResponse] = await Promise.all([
          fetch('/api/materi', { cache: 'no-store' }),
          fetch('/api/quiz', { cache: 'no-store' }),
        ])
        const materialsPayload = await materialsResponse.json() as {
          materials?: Array<{ id: MaterialId; submateri?: Array<unknown> }>
          error?: string
        }
        const payload = await quizzesResponse.json() as { quizzes?: QuizSummary[]; error?: string }

        if (!materialsResponse.ok) {
          throw new Error(materialsPayload.error ?? 'Gagal memuat materi quiz.')
        }

        if (!quizzesResponse.ok) {
          throw new Error(payload.error ?? 'Gagal memuat daftar quiz.')
        }

        if (!cancelled) {
          const nextCounts = materialsPayload.materials?.reduce((counts, material) => {
            counts[material.id] = material.submateri?.length ?? 0
            return counts
          }, {} as Record<MaterialId, number>)

          if (nextCounts) {
            setMaterialCounts((current) => ({ ...current, ...nextCounts }))
          }
        }

        if (!cancelled) {
          setRecentQuizzes(payload.quizzes ?? [])
        }
      } catch (error) {
        if (!cancelled) {
          setNotice(error instanceof Error ? error.message : 'Gagal memuat daftar quiz.')
        }
      } finally {
        if (!cancelled) {
          setLoadingRecent(false)
        }
      }
    }

    void loadRecent()

    const interval = window.setInterval(() => {
      void loadRecent()
    }, 3000)

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [])

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setNotice('')

    try {
      const createResponse = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialId: ALL_QUIZ_MATERIAL.id,
          title: `Kuis ${ALL_QUIZ_MATERIAL.title}`,
          questionCount: selectedQuestionCount,
          durationMinutes: effectiveDuration,
        }),
      })

      const createPayload = await createResponse.json() as { error?: string; quiz?: { id: string } }

      if (!createResponse.ok || !createPayload.quiz) {
        throw new Error(createPayload.error ?? 'Gagal membuat kuis.')
      }

      const quizId = createPayload.quiz.id

      await fetch(`/api/quiz/${quizId}/start`, { method: 'POST' })

      router.push(`/quiz/start/${quizId}`)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Gagal membuat kuis.')
    } finally {
      setLoading(false)
    }
  }

  const allQuizzes = recentQuizzes
  const finishedQuizzes = useMemo(() => recentQuizzes.filter((q) => q.status === 'finished'), [recentQuizzes])
  const activeQuizzes = useMemo(() => recentQuizzes.filter((q) => q.status !== 'finished'), [recentQuizzes])

  return (
    <div>
      <div className="hero quiz-hero">
        <div>
          <div className="hero-eyebrow">
            <Target size={12} />
            Quiz IPAS Ekonomi
          </div>
          <h1>Quiz <span>Interaktif</span></h1>
          <div className="divider" />
          <p>Buat quiz baru atau lihat riwayat quiz sebelumnya.</p>
        </div>
        <div className="hero-gif-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/header-utama/GIF by MINI Italia.gif" alt="Mini animation" />
        </div>
      </div>

      <div className="quiz-tabs">
        <button type="button" className={`quiz-tab${tab === 'create' ? ' active' : ''}`} onClick={() => setTab('create')}>
          <Play size={15} />
          Buat Quiz
        </button>
        <button type="button" className={`quiz-tab${tab === 'history' ? ' active' : ''}`} onClick={() => setTab('history')}>
          <History size={15} />
          Riwayat Quiz
          {allQuizzes.length > 0 && <span className="quiz-tab-badge">{allQuizzes.length}</span>}
        </button>
      </div>

      {tab === 'create' && (
        <div className="quiz-create-section">
          <form className="panel-card quiz-form-card" onSubmit={handleCreate}>
            <div className="panel-head">
              <div>
                <div className="panel-kicker">Quiz Builder</div>
                <h2>Rancang kuis baru</h2>
              </div>
              <Sparkles size={18} />
            </div>

            <div className="field-block">
              <span>Materi</span>
              <div className="material-select-card active material-select-static">
                <strong>{ALL_QUIZ_MATERIAL.title}</strong>
                <span>{MATERIALS.length} materi · {totalQuestions} soal tersedia</span>
              </div>
            </div>

            <label className="field-block">
              <span>Jumlah soal</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={questionCountText ?? String(selectedQuestionCount)}
                onFocus={(event) => event.target.select()}
                onChange={(event) => {
                  const raw = event.target.value.replace(/[^0-9]/g, '')
                  setQuestionCountText(raw)
                  const num = parseInt(raw, 10)
                  if (!isNaN(num) && num >= 1) {
                    setQuestionCount(Math.min(num, totalQuestions))
                  } else {
                    setQuestionCount(0)
                  }
                }}
              />
              <small className="field-hint">Maksimal {totalQuestions} soal</small>
            </label>

            <label className="field-block">
              <span>Durasi (menit)</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={durationText ?? String(effectiveDuration)}
                onFocus={(event) => event.target.select()}
                onChange={(event) => {
                  const raw = event.target.value.replace(/[^0-9]/g, '')
                  setDurationText(raw)
                  setDurationTouched(true)
                  const num = parseInt(raw, 10)
                  if (!isNaN(num) && num >= 1) {
                    setDurationMinutes(Math.min(num, 180))
                  } else {
                    setDurationMinutes(recommendedDuration)
                  }
                }}
              />
              <small className="field-hint">Rekomendasi: {recommendedDuration} menit</small>
            </label>

            <div className="info-box">
              <Sparkles size={16} />
              <span><strong>{selectedQuestionCount} soal</strong> · <strong>{effectiveDuration} menit</strong> · otomatis dimulai setelah dibuat</span>
            </div>

            {notice && <div className="form-alert error">{notice}</div>}

            <button className="primary-btn" type="submit" disabled={loading}>
              <ArrowRight size={16} />
              {loading ? 'Membuat & memulai...' : 'Buat & Mulai Quiz'}
            </button>
          </form>
        </div>
      )}

      {tab === 'history' && (
        <div className="quiz-history-section">
          {loadingRecent && allQuizzes.length === 0 && (
            <div className="loading-state">Memuat riwayat quiz...</div>
          )}

          {!loadingRecent && allQuizzes.length === 0 && (
            <div className="empty-state">Belum ada quiz. Buat quiz pertamamu!</div>
          )}

          {activeQuizzes.length > 0 && (
            <div className="quiz-history-group">
              <h3 className="quiz-history-group-title">
                <Clock3 size={15} />
                Sedang Berlangsung
              </h3>
              <div className="quiz-history-list">
                {activeQuizzes.map((quiz) => (
                  <article key={quiz.id} className="quiz-history-card">
                    <div className="quiz-history-head">
                      <div>
                        <strong>{quiz.title}</strong>
                        <span>{quiz.questionCount} soal · {quiz.participantCount} peserta</span>
                      </div>
                      <span className={`status-pill ${quiz.status}`}>{quiz.status}</span>
                    </div>
                    <div className="quiz-history-foot">
                      <span>{quiz.topParticipant ? `Top: ${quiz.topParticipant.name} (${quiz.topParticipant.score})` : `${quiz.durationMinutes} menit`}</span>
                      <div className="history-actions">
                        <Link href={`/quiz/start/${quiz.id}`} prefetch={false} className="ghost-btn">Host</Link>
                        <Link href={`/quiz/${quiz.id}`} prefetch={false} className="ghost-btn">Join</Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {finishedQuizzes.length > 0 && (
            <div className="quiz-history-group">
              <h3 className="quiz-history-group-title">
                <Trophy size={15} />
                Selesai
              </h3>
              <div className="quiz-history-list">
                {finishedQuizzes.map((quiz) => (
                  <article key={quiz.id} className="quiz-history-card finished">
                    <div className="quiz-history-head">
                      <div>
                        <strong>{quiz.title}</strong>
                        <span>{quiz.questionCount} soal · {quiz.participantCount} peserta</span>
                      </div>
                      <span className={`status-pill ${quiz.status}`}>selesai</span>
                    </div>
                    <div className="quiz-history-foot">
                      <span>{quiz.topParticipant ? `Juara: ${quiz.topParticipant.name} (${quiz.topParticipant.score} poin)` : formatQuizTimestamp(quiz.finishedAt ?? quiz.updatedAt)}</span>
                      <div className="history-actions">
                        <Link href={`/quiz/start/${quiz.id}`} prefetch={false} className="ghost-btn">Detail</Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
