'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, History, Play, Radio, Sparkles, Target, Users } from 'lucide-react'
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

function getQuizMetaLabel(quiz: QuizSummary) {
  if (quiz.status === 'finished') {
    return `Selesai ${formatQuizTimestamp(quiz.finishedAt ?? quiz.updatedAt)}`
  }

  if (quiz.status === 'live') {
    return `Live sampai ${formatQuizTimestamp(quiz.endsAt)}`
  }

  if (quiz.status === 'countdown') {
    return `Countdown · update ${formatQuizTimestamp(quiz.updatedAt)}`
  }

  return `Dibuat ${formatQuizTimestamp(quiz.createdAt)}`
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

export default function QuizBuilderClient() {
  const router = useRouter()
  const [title, setTitle] = useState('')
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
  const activeQuizzes = useMemo(
    () => recentQuizzes.filter((quiz) => quiz.status !== 'finished'),
    [recentQuizzes],
  )
  const finishedQuizzes = useMemo(
    () => recentQuizzes.filter((quiz) => quiz.status === 'finished'),
    [recentQuizzes],
  )

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
    }, 2000)

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
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialId: ALL_QUIZ_MATERIAL.id,
          title,
          questionCount: selectedQuestionCount,
          durationMinutes: effectiveDuration,
        }),
      })

      const payload = await response.json() as { error?: string; quiz?: { id: string } }

      if (!response.ok || !payload.quiz) {
        throw new Error(payload.error ?? 'Gagal membuat kuis.')
      }

      router.push(`/quiz/start/${payload.quiz.id}`)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Gagal membuat kuis.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="hero quiz-hero">
        <div>
          <div className="hero-eyebrow">
            <Target size={12} />
            /quiz
          </div>
          <h1>Buat quiz live gabungan dari semua materi</h1>
          <div className="divider" />
          <p>Semua materi, semua submateri aktif, dan semua bank soal akan digabung jadi satu sesi. Setelah dibuat, kamu langsung masuk ke halaman host untuk membagikan link dan memulai quiz.</p>
        </div>
      </div>

      <div className="quiz-layout">
        <form className="panel-card quiz-form-card" onSubmit={handleCreate}>
          <div className="panel-head">
            <div>
              <div className="panel-kicker">Quiz Builder</div>
              <h2>Rancang kuis baru</h2>
            </div>
            <Play size={18} />
          </div>

          <label className="field-block">
            <span>Judul kuis</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={`Kuis ${ALL_QUIZ_MATERIAL.title}`} />
          </label>

          <div className="field-block">
            <span>Materi quiz</span>
            <div className="material-select-card active material-select-static">
              <strong>{ALL_QUIZ_MATERIAL.title}</strong>
              <span>{MATERIALS.length} materi utama, {totalSubmateri} submateri aktif, {totalQuestions} total soal</span>
            </div>
          </div>

          <label className="field-block">
            <span>Jumlah soal quiz</span>
            <input
              type="number"
              min={1}
              max={Math.max(1, totalQuestions)}
              value={selectedQuestionCount}
              onChange={(event) => setQuestionCount(Math.max(1, Math.min(totalQuestions, Number(event.target.value) || totalQuestions)))}
            />
          </label>

          <label className="field-block">
            <span>Durasi quiz (menit)</span>
            <input
              type="number"
              min={1}
              max={180}
              value={effectiveDuration}
              onChange={(event) => {
                setDurationTouched(true)
                setDurationMinutes(Math.max(1, Number(event.target.value) || recommendedDuration))
              }}
            />
          </label>

          <div className="info-box">
            <Sparkles size={16} />
            <span>Quiz ini pakai semua submateri aktif + semua bank soal IPAS Ekonomi. Kamu pilih <strong>{selectedQuestionCount} soal</strong> dari total {totalQuestions}, dengan durasi rekomendasi <strong>{recommendedDuration} menit</strong>.</span>
          </div>

          {notice && <div className="form-alert error">{notice}</div>}

          <button className="primary-btn" type="submit" disabled={loading}>
            <ArrowRight size={16} />
            {loading ? 'Membuat quiz...' : 'Buat Quiz dan Lanjut ke Host'}
          </button>
        </form>

        <aside className="panel-card quiz-side-card">
          <div className="panel-head">
            <div>
              <div className="panel-kicker">Preview</div>
              <h2>{ALL_QUIZ_MATERIAL.title}</h2>
            </div>
            <Users size={18} />
          </div>

          <div className="quiz-side-preview">
            <div className="preview-badge">{ALL_QUIZ_MATERIAL.eyebrow}</div>
            <p>{ALL_QUIZ_MATERIAL.summary}</p>
            <div className="preview-counts">
              <div>
                <strong>{totalSubmateri}</strong>
                <span>Submateri</span>
              </div>
              <div>
                <strong>{selectedQuestionCount}</strong>
                <span>Soal Dipakai</span>
              </div>
              <div>
                <strong>{effectiveDuration}</strong>
                <span>Menit</span>
              </div>
              <div>
                <strong>{totalQuestions}</strong>
                <span>Soal Tersedia</span>
              </div>
            </div>
          </div>

          <div className="recent-list">
            <div className="recent-list-head">
              <strong>Snapshot quiz aktif</strong>
              <span>{loadingRecent ? 'Memuat...' : activeQuizzes.length}</span>
            </div>

            {activeQuizzes.length === 0 ? (
              <div className="empty-state">Belum ada quiz aktif. Quiz live atau yang menunggu host akan tampil di sini.</div>
            ) : (
              activeQuizzes.slice(0, 4).map((quiz) => (
                <div key={quiz.id} className="recent-item">
                  <div>
                    <strong>{quiz.title}</strong>
                    <span>{quiz.materialTitle} · {quiz.questionCount} soal · {quiz.participantCount} peserta</span>
                  </div>
                  <span className={`status-pill ${quiz.status}`}>{quiz.status}</span>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      <div className="quiz-material-strip">
        {MATERIALS.map((material) => (
          <div
            key={material.id}
            className="quiz-material-chip active"
          >
            <span>{material.title}</span>
            <strong>{materialCounts[material.id] + QUIZ_BANK[material.id].length}</strong>
          </div>
        ))}
      </div>

      <div className="quiz-history-layout">
        <section className="panel-card">
          <div className="panel-head">
            <div>
              <div className="panel-kicker">History realtime</div>
              <h2>Quiz aktif dan menunggu host</h2>
            </div>
            <Radio size={18} />
          </div>

          {activeQuizzes.length === 0 ? (
            <div className="empty-state">Belum ada quiz aktif yang tersimpan.</div>
          ) : (
            <div className="quiz-history-list">
              {activeQuizzes.map((quiz) => (
                <article key={quiz.id} className="quiz-history-card">
                  <div className="quiz-history-head">
                    <div>
                      <strong>{quiz.title}</strong>
                      <span>{quiz.materialTitle}</span>
                    </div>
                    <span className={`status-pill ${quiz.status}`}>{quiz.status}</span>
                  </div>
                  <div className="quiz-history-meta">{getQuizMetaLabel(quiz)}</div>
                  <div className="quiz-history-stats">
                    <div>
                      <strong>{quiz.questionCount}</strong>
                      <span>Soal</span>
                    </div>
                    <div>
                      <strong>{quiz.participantCount}</strong>
                      <span>Peserta</span>
                    </div>
                    <div>
                      <strong>{quiz.durationMinutes}</strong>
                      <span>Menit</span>
                    </div>
                  </div>
                  <div className="quiz-history-foot">
                    <span>{quiz.topParticipant ? `Top: ${quiz.topParticipant.name} (${quiz.topParticipant.score})` : 'Belum ada skor realtime'}</span>
                    <div className="history-actions">
                      <Link href={`/quiz/start/${quiz.id}`} prefetch={false} className="ghost-btn">Host</Link>
                      <Link href={`/quiz/${quiz.id}`} prefetch={false} className="ghost-btn">Join</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="panel-card">
          <div className="panel-head">
            <div>
              <div className="panel-kicker">History tersimpan</div>
              <h2>Quiz yang sudah selesai</h2>
            </div>
            <History size={18} />
          </div>

          {finishedQuizzes.length === 0 ? (
            <div className="empty-state">Belum ada quiz selesai. Setelah live berakhir, datanya tetap tersimpan di sini.</div>
          ) : (
            <div className="quiz-history-list">
              {finishedQuizzes.map((quiz) => (
                <article key={quiz.id} className="quiz-history-card finished">
                  <div className="quiz-history-head">
                    <div>
                      <strong>{quiz.title}</strong>
                      <span>{quiz.materialTitle}</span>
                    </div>
                    <span className={`status-pill ${quiz.status}`}>{quiz.status}</span>
                  </div>
                  <div className="quiz-history-meta">{getQuizMetaLabel(quiz)}</div>
                  <div className="quiz-history-stats">
                    <div>
                      <strong>{quiz.questionCount}</strong>
                      <span>Soal</span>
                    </div>
                    <div>
                      <strong>{quiz.participantCount}</strong>
                      <span>Peserta</span>
                    </div>
                    <div>
                      <strong>{quiz.topParticipant?.score ?? 0}</strong>
                      <span>Top score</span>
                    </div>
                  </div>
                  <div className="quiz-history-foot">
                    <span>{quiz.topParticipant ? `Juara: ${quiz.topParticipant.name}` : `Update terakhir ${formatQuizTimestamp(quiz.updatedAt)}`}</span>
                    <div className="history-actions">
                      <Link href={`/quiz/start/${quiz.id}`} prefetch={false} className="ghost-btn">Lihat host</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
