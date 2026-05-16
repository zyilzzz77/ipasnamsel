'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Copy, Crown, ExternalLink, Medal, Play, QrCode, Trophy, Users } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { formatRemainingTime, sortLeaderboard } from '@/lib/quiz-ranking'

interface QuizParticipant {
  id: string
  name: string
  joinedAt: string
  score: number
  answeredCount: number
  lastAnsweredAt?: string
  finishedAt?: string
}

interface QuizSession {
  id: string
  title: string
  materialTitle: string
  status: 'waiting' | 'countdown' | 'live' | 'finished'
  questionCount: number
  participants: QuizParticipant[]
  durationMinutes: number
  questionDurationSeconds: number
  countdownUntil?: number
  liveAt?: number
  endsAt?: number
  finishedAt?: string
}

interface QuizHostClientProps {
  quizId: string
  baseUrl: string
}

function getStartButtonLabel(status: QuizSession['status'], starting: boolean, participantCount: number): string {
  if (starting) {
    return 'Menyiapkan...'
  }

  if (status === 'countdown') {
    return 'Countdown berjalan'
  }

  if (status === 'live') {
    return 'Quiz sedang berjalan'
  }

  if (status === 'finished') {
    return 'Quiz sudah selesai'
  }

  if (participantCount === 0) {
    return 'Menunggu peserta bergabung...'
  }

  return `Mulai Quiz (${participantCount} peserta)`
}

export default function QuizHostClient({ quizId, baseUrl }: QuizHostClientProps) {
  const [quiz, setQuiz] = useState<QuizSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)
  const [tick, setTick] = useState(0)
  const [notice, setNotice] = useState('')

  const inviteUrl = new URL(`/quiz/${quizId}`, baseUrl).toString()

  useEffect(() => {
    let cancelled = false

    async function loadQuiz() {
      try {
        const response = await fetch(`/api/quiz/${quizId}`, { cache: 'no-store' })
        const payload = await response.json() as { quiz?: QuizSession; error?: string }

        if (!response.ok || !payload.quiz) {
          throw new Error(payload.error ?? 'Kuis tidak ditemukan.')
        }

        if (!cancelled) {
          setQuiz(payload.quiz)
        }
      } catch (error) {
        if (!cancelled) {
          setNotice(error instanceof Error ? error.message : 'Kuis tidak ditemukan.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadQuiz()

    const interval = window.setInterval(() => {
      void loadQuiz()
      setTick(Date.now())
    }, 2000)

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [quizId])

  useEffect(() => {
    const timer = window.setInterval(() => setTick(Date.now()), 250)
    return () => window.clearInterval(timer)
  }, [])

  const countdownRemaining = quiz?.status === 'countdown' && quiz.countdownUntil
    ? Math.max(0, Math.ceil((quiz.countdownUntil - tick) / 1000))
    : 0
  const endsRemaining = quiz?.endsAt
    ? Math.max(0, Math.ceil((quiz.endsAt - tick) / 1000))
    : 0
  const leaderboard = quiz ? sortLeaderboard(quiz.participants) : []
  const statusLabel = quiz?.status === 'waiting'
    ? 'Menunggu peserta'
    : quiz?.status === 'countdown'
      ? 'Countdown aktif'
      : quiz?.status === 'live'
        ? 'Sedang berjalan'
        : 'Selesai'
  const finishedCount = leaderboard.filter((participant) => participant.finishedAt).length
  const podium = [leaderboard[1], leaderboard[0], leaderboard[2]]

  async function handleCopyLink() {
    await navigator.clipboard.writeText(inviteUrl)
    setNotice('Link berhasil disalin.')
  }

  async function handleStart() {
    setStarting(true)
    setNotice('')

    try {
      const response = await fetch(`/api/quiz/${quizId}/start`, { method: 'POST' })
      const payload = await response.json() as { quiz?: QuizSession; error?: string }

      if (!response.ok || !payload.quiz) {
        throw new Error(payload.error ?? 'Gagal memulai quiz.')
      }

      setQuiz(payload.quiz)
      setNotice('Countdown sudah dimulai.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Gagal memulai quiz.')
    } finally {
      setStarting(false)
    }
  }

  if (loading) {
    return <div className="loading-state">Memuat host quiz...</div>
  }

  if (!quiz) {
    return <div className="empty-state">{notice || 'Kuis tidak ditemukan.'}</div>
  }

  return (
    <div>
      <div className="hero quiz-host-hero">
        <div>
          <div className="hero-eyebrow">
            <QrCode size={12} />
            /quiz/start/{quizId}
          </div>
          <h1>{quiz.title}</h1>
          <div className="divider" />
          <p>{quiz.materialTitle} · {quiz.questionCount} soal · {quiz.durationMinutes} menit · {quiz.questionDurationSeconds} detik per soal · {statusLabel}</p>
        </div>

        <div className={`status-pill ${quiz.status}`}>{statusLabel}</div>
      </div>

      {notice && <div className="form-alert info">{notice}</div>}

      <div className="host-grid">
        <section className="panel-card host-share-card">
          <div className="panel-head">
            <div>
              <div className="panel-kicker">Share link</div>
              <h2>QR code dan link join</h2>
            </div>
            <Copy size={18} />
          </div>

          <div className="qr-code-card">
            <div className="qr-code-frame">
              <QRCodeSVG value={inviteUrl} size={192} level="M" includeMargin />
            </div>
            <strong>Scan pakai HP</strong>
            <span>QR ini langsung membuka link quiz: {inviteUrl}</span>
          </div>

          <div className="countdown-box">
            <span>{quiz.status === 'finished' ? 'Quiz selesai' : 'Berakhir otomatis dalam'}</span>
            <strong>{quiz.status === 'finished' ? '0:00' : formatRemainingTime(endsRemaining)}</strong>
          </div>

          <div className="share-link-box">
            <code>{inviteUrl}</code>
            <button type="button" className="ghost-btn" onClick={() => void handleCopyLink()}>
              <Copy size={15} />
              Salin link
            </button>
          </div>

          <div className="host-actions">
            <button type="button" className="primary-btn" onClick={() => void handleStart()} disabled={starting || quiz.status !== 'waiting' || quiz.participants.length === 0}>
              <Play size={16} />
              {getStartButtonLabel(quiz.status, starting, quiz.participants.length)}
            </button>
            <Link href={`/quiz/${quizId}`} prefetch={false} className="ghost-btn link-btn">
              <ExternalLink size={15} />
              Buka participant page
            </Link>
          </div>
        </section>

        <aside className="panel-card host-side-card">
          <div className="panel-head">
            <div>
              <div className="panel-kicker">Live ranking</div>
              <h2>{quiz.status === 'finished' ? 'Peringkat final' : 'Papan skor'}</h2>
            </div>
            <Users size={18} />
          </div>

          <div className="join-summary-grid">
            <div className="join-stat">
              <strong>{leaderboard.length}</strong>
              <span>Peserta</span>
            </div>
            <div className="join-stat">
              <strong>{leaderboard[0]?.score ?? 0}</strong>
              <span>Skor tertinggi</span>
            </div>
            <div className="join-stat">
              <strong>{finishedCount}</strong>
              <span>Selesai</span>
            </div>
            <div className="join-stat">
              <strong>{quiz.questionCount}</strong>
              <span>Total soal</span>
            </div>
          </div>

          {quiz.status === 'countdown' && (
            <div className="countdown-box">
              <span>Quiz mulai dalam</span>
              <strong>{formatRemainingTime(countdownRemaining)}</strong>
            </div>
          )}

          {quiz.status === 'finished' && leaderboard.length > 0 && (
            <div className="podium-grid">
              {podium.map((participant, index) => {
                if (!participant) {
                  return null
                }

                const rank = index === 1 ? 1 : index === 0 ? 2 : 3
                const Icon = rank === 1 ? Crown : rank === 2 ? Trophy : Medal

                return (
                  <div key={participant.id} className={`podium-card rank-${rank}`}>
                    <div className="podium-badge">
                      <Icon size={16} />
                      Juara {rank}
                    </div>
                    <strong>{participant.name}</strong>
                    <span>{participant.score} poin · {participant.answeredCount}/{quiz.questionCount} soal</span>
                  </div>
                )
              })}
            </div>
          )}

          <div className="leaderboard-list">
            {leaderboard.length === 0 ? (
              <div className="empty-state">Belum ada skor peserta.</div>
            ) : (
              leaderboard.map((participant, index) => (
                <div key={participant.id} className={`participant-row leaderboard-row top-${Math.min(index + 1, 4)}`}>
                  <div className="participant-avatar">{index + 1}</div>
                  <div>
                    <strong>{participant.name}</strong>
                    <span>{participant.answeredCount}/{quiz.questionCount} soal · {participant.score} poin</span>
                  </div>
                  <div className="leaderboard-score">
                    <span>#{index + 1}</span>
                    <small>{participant.finishedAt ? 'finish' : 'live'}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
