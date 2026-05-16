'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, CheckCircle2, Clock3, Crown, Medal, Send, Sparkles, Trophy, Users, XCircle } from 'lucide-react'
import { QUESTION_DURATION_SECONDS } from '@/lib/catalog'
import { setBrowserCookie } from '@/lib/browser-cookies'
import { formatRemainingTime, getParticipantRank, sortLeaderboard } from '@/lib/quiz-ranking'
import { encodeCookieValue, participantCookieName, type ParticipantSessionCookie } from '@/lib/session-cookie'

interface QuizParticipantAnswer {
  questionIndex: number
  choiceIndex: number | null
  isCorrect: boolean
  answeredAt: string
}

interface QuizParticipant {
  id: string
  name: string
  joinedAt: string
  score: number
  answeredCount: number
  answers: QuizParticipantAnswer[]
  lastAnsweredAt?: string
  finishedAt?: string
}

interface QuizQuestion {
  question: string
  options: string[]
  answer: number
  explanation: string
}

interface QuizSession {
  id: string
  title: string
  materialTitle: string
  status: 'waiting' | 'countdown' | 'live' | 'finished'
  questionCount: number
  questions: QuizQuestion[]
  participants: QuizParticipant[]
  durationMinutes: number
  questionDurationSeconds: number
  countdownUntil?: number
  liveAt?: number
  endsAt?: number
  finishedAt?: string
}

interface QuizJoinClientProps {
  quizId: string
  initialParticipant: ParticipantSessionCookie | null
}

interface MemeVariant {
  src: string
  title: string
  caption: string
}

interface FeedbackState {
  tone: 'correct' | 'wrong'
  text: string
  meme: MemeVariant
}

const CORRECT_MEMES: MemeVariant[] = [
  {
    src: '/memes/quiz-correct-1.svg',
    title: 'Jawaban kena',
    caption: 'Poin naik. Rank bisa ikut lompat.',
  },
  {
    src: '/memes/quiz-correct-2.svg',
    title: 'Streak panas',
    caption: 'Gas terus. Momentum lagi bagus.',
  },
]

const WRONG_MEMES: MemeVariant[] = [
  {
    src: '/memes/quiz-wrong-1.svg',
    title: 'Nyaris benar',
    caption: 'Salah tipis. Balas di soal berikut.',
  },
  {
    src: '/memes/quiz-wrong-2.svg',
    title: 'Reset fokus',
    caption: 'Tarik napas. Rank masih bisa dikejar.',
  },
]

const ANSWER_FEEDBACK_DELAY_MS = 2200

function getResultCopy(percentage: number) {
  if (percentage >= 86) {
    return {
      title: 'Luar Biasa!',
      message: 'Kamu menguasai hampir semua soal pada sesi live ini.',
    }
  }

  if (percentage >= 57) {
    return {
      title: 'Bagus!',
      message: 'Dasar materi sudah kuat. Sedikit lagi bisa naik podium.',
    }
  }

  return {
    title: 'Terus Belajar!',
    message: 'Buka lagi materi IPAS, lalu coba sesi berikutnya untuk naik rank.',
  }
}

export default function QuizJoinLiveClient({ quizId, initialParticipant }: QuizJoinClientProps) {
  const [quiz, setQuiz] = useState<QuizSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [joinName, setJoinName] = useState(initialParticipant?.name ?? '')
  const [participant, setParticipant] = useState<ParticipantSessionCookie | null>(initialParticipant)
  const [joining, setJoining] = useState(false)
  const [submittingAnswer, setSubmittingAnswer] = useState(false)
  const [notice, setNotice] = useState('')
  const [tick, setTick] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [questionLocked, setQuestionLocked] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)
  const [finished, setFinished] = useState(false)
  const [joinCountdown, setJoinCountdown] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_DURATION_SECONDS)
  const autoAdvanceRef = useRef<number | null>(null)
  const autoSyncRef = useRef<string | null>(null)

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

  const syncParticipant = useCallback(async (record: ParticipantSessionCookie) => {
    const response = await fetch(`/api/quiz/${quizId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: record.name,
        participantId: record.id,
      }),
    })

    const payload = await response.json() as { quiz?: QuizSession; participant?: QuizParticipant; error?: string }

    if (!response.ok || !payload.quiz) {
      throw new Error(payload.error ?? 'Gagal menyambungkan peserta.')
    }

    setQuiz(payload.quiz)

    const joinedParticipant = payload.participant ?? payload.quiz.participants.find((item) => item.id === record.id)
    if (joinedParticipant) {
      const nextParticipant = { id: joinedParticipant.id, name: joinedParticipant.name }
      setParticipant(nextParticipant)
      setJoinName(nextParticipant.name)
      setBrowserCookie(participantCookieName(quizId), encodeCookieValue(nextParticipant))
    }
  }, [quizId])

  useEffect(() => {
    if (!quiz || !participant) {
      return
    }

    const alreadyJoined = quiz.participants.some((item) => item.id === participant.id)
    if (alreadyJoined || autoSyncRef.current === participant.id) {
      return
    }

    autoSyncRef.current = participant.id
    void syncParticipant(participant).catch(() => {
      autoSyncRef.current = null
      setNotice('Gagal menyambungkan peserta, mencoba lagi...')
    })
  }, [participant, quiz, syncParticipant])

  const leaderboard = useMemo(() => (quiz ? sortLeaderboard(quiz.participants) : []), [quiz])
  const currentParticipant = useMemo(
    () => (participant && quiz ? quiz.participants.find((item) => item.id === participant.id) : undefined),
    [participant, quiz],
  )
  const currentRank = useMemo(
    () => getParticipantRank(quiz?.participants ?? [], participant?.id),
    [participant, quiz],
  )
  const questionDuration = quiz?.questionDurationSeconds ?? QUESTION_DURATION_SECONDS
  const countdownRemaining = quiz?.status === 'countdown' && quiz.countdownUntil
    ? Math.max(0, Math.ceil((quiz.countdownUntil - tick) / 1000))
    : 0
  const totalRemaining = quiz?.endsAt
    ? Math.max(0, Math.ceil((quiz.endsAt - tick) / 1000))
    : 0
  const readyToPlay = Boolean(participant && quiz?.status === 'live')
  const question = readyToPlay && quiz ? quiz.questions[currentIndex] : undefined
  const score = currentParticipant?.score ?? 0
  const answeredCount = currentParticipant?.answeredCount ?? 0
  const percentage = quiz && quiz.questions.length > 0 ? Math.round((score / quiz.questions.length) * 100) : 0
  const resultCopy = getResultCopy(percentage)
  const podium = [leaderboard[1], leaderboard[0], leaderboard[2]]
  const showResults = Boolean(
    participant
    && quiz
    && (
      finished
      || (quiz.status === 'finished' && !feedback)
      || (currentParticipant && currentParticipant.answeredCount >= quiz.questions.length && !feedback)
    ),
  )

  useEffect(() => {
    if (!readyToPlay || !currentParticipant) {
      return
    }

    if (!questionLocked && currentParticipant.answeredCount < (quiz?.questions.length ?? 0) && currentParticipant.answeredCount !== currentIndex) {
      const syncFrame = window.requestAnimationFrame(() => {
        setCurrentIndex(currentParticipant.answeredCount)
        setSelectedIndex(null)
        setFeedback(null)
        setSecondsLeft(questionDuration)
      })

      return () => {
        window.cancelAnimationFrame(syncFrame)
      }
    }
  }, [currentIndex, currentParticipant, questionDuration, questionLocked, quiz?.questions.length, readyToPlay])

  useEffect(() => {
    if (!readyToPlay || questionLocked) {
      return
    }

    const resetFrame = window.requestAnimationFrame(() => {
      setSecondsLeft(questionDuration)
    })

    return () => {
      window.cancelAnimationFrame(resetFrame)
    }
  }, [currentIndex, questionDuration, questionLocked, readyToPlay])

  const resolveQuestion = useCallback(async (choice: number | null) => {
    if (!question || questionLocked || !participant || !quiz) {
      return
    }

    if (autoAdvanceRef.current) {
      window.clearTimeout(autoAdvanceRef.current)
    }

    setQuestionLocked(true)
    setSubmittingAnswer(true)
    setSelectedIndex(choice)
    setNotice('')

    const isCorrect = choice === question.answer
    const memePool = isCorrect ? CORRECT_MEMES : WRONG_MEMES
    const meme = memePool[currentIndex % memePool.length]

    try {
      const response = await fetch(`/api/quiz/${quizId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId: participant.id,
          questionIndex: currentIndex,
          choiceIndex: choice,
        }),
      })

      const payload = await response.json() as { quiz?: QuizSession; participant?: QuizParticipant; error?: string }

      if (!response.ok || !payload.quiz) {
        throw new Error(payload.error ?? 'Gagal menyimpan jawaban.')
      }

      const nextQuiz = payload.quiz
      const nextParticipant = payload.participant ?? nextQuiz.participants.find((item) => item.id === participant.id)
      setQuiz(nextQuiz)
      setFeedback({
        tone: isCorrect ? 'correct' : 'wrong',
        text: isCorrect
          ? `Benar. ${question.explanation}`
          : `Salah. Jawaban benar: ${question.options[question.answer]}. ${question.explanation}`,
        meme,
      })

      autoAdvanceRef.current = window.setTimeout(() => {
        const nextAnsweredCount = nextParticipant?.answeredCount ?? currentIndex + 1

        if (nextQuiz.status === 'finished' || nextAnsweredCount >= nextQuiz.questions.length) {
          setSubmittingAnswer(false)
          setFinished(true)
          return
        }

        setCurrentIndex(nextAnsweredCount)
        setSelectedIndex(null)
        setQuestionLocked(false)
        setFeedback(null)
        setSubmittingAnswer(false)
        setSecondsLeft(nextQuiz.questionDurationSeconds ?? questionDuration)
      }, ANSWER_FEEDBACK_DELAY_MS)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Gagal menyimpan jawaban.')
      setQuestionLocked(false)
      setSubmittingAnswer(false)
      setSelectedIndex(null)
      setSecondsLeft(questionDuration)
    }
  }, [currentIndex, participant, question, questionDuration, questionLocked, quiz, quizId])

  useEffect(() => {
    if (!readyToPlay || questionLocked || finished || !question) {
      return
    }

    if (secondsLeft <= 0) {
      const resolveTimeout = window.setTimeout(() => {
        void resolveQuestion(null)
      }, 0)

      return () => {
        window.clearTimeout(resolveTimeout)
      }
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => current - 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [finished, question, questionLocked, readyToPlay, resolveQuestion, secondsLeft])

  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) {
        window.clearTimeout(autoAdvanceRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (joinCountdown <= 0) return
    const timer = window.setTimeout(() => setJoinCountdown((c) => c - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [joinCountdown])

  async function handleJoin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setJoining(true)
    setNotice('')

    try {
      const response = await fetch(`/api/quiz/${quizId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: joinName }),
      })

      const payload = await response.json() as { quiz?: QuizSession; participant?: QuizParticipant; error?: string }

      if (!response.ok || !payload.quiz) {
        throw new Error(payload.error ?? 'Gagal join quiz.')
      }

      const joinedParticipant = payload.participant ?? payload.quiz.participants[payload.quiz.participants.length - 1]
      if (joinedParticipant) {
        const record = { id: joinedParticipant.id, name: joinedParticipant.name }
        setParticipant(record)
        setBrowserCookie(participantCookieName(quizId), encodeCookieValue(record))
      }

      setQuiz(payload.quiz)

      if (payload.quiz.status === 'live' || payload.quiz.status === 'countdown') {
        setJoinCountdown(3)
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Gagal join quiz.')
    } finally {
      setJoining(false)
    }
  }

  if (loading) {
    return <div className="loading-state">Memuat halaman join...</div>
  }

  if (!quiz) {
    return <div className="empty-state">{notice || 'Kuis tidak ditemukan.'}</div>
  }

  if (showResults) {
    return (
      <div className="result-box live-result-box">
        <div className="hero-eyebrow">
          <Trophy size={12} />
          Hasil akhir
        </div>
        <div className="score-ring">
          <div className="score-pct">{percentage}%</div>
        </div>
        <h2>{resultCopy.title}</h2>
        <p>{resultCopy.message}</p>

        <div className="score-detail">
          <div className="score-stat"><div className="val">{score}</div><div className="lbl">Benar</div></div>
          <div className="score-stat"><div className="val">{quiz.questions.length - score}</div><div className="lbl">Salah</div></div>
          <div className="score-stat"><div className="val">{currentRank ?? '-'}</div><div className="lbl">Rank</div></div>
        </div>

        {currentParticipant && (
          <div className="current-rank-banner compact">
            <span>Peringkat akhir kamu</span>
            <strong>#{currentRank ?? '-'}</strong>
            <small>{currentParticipant.answeredCount}/{quiz.questions.length} soal · {currentParticipant.score} poin</small>
          </div>
        )}

        {leaderboard.length > 0 && (
          <div className="podium-grid">
            {podium.map((podiumParticipant, index) => {
              if (!podiumParticipant) {
                return null
              }

              const rank = index === 1 ? 1 : index === 0 ? 2 : 3
              const Icon = rank === 1 ? Crown : rank === 2 ? Trophy : Medal

              return (
                <div key={podiumParticipant.id} className={`podium-card rank-${rank}`}>
                  <div className="podium-badge">
                    <Icon size={16} />
                    Juara {rank}
                  </div>
                  <strong>{podiumParticipant.name}</strong>
                  <span>{podiumParticipant.score} poin · {podiumParticipant.answeredCount}/{quiz.questionCount} soal</span>
                </div>
              )
            })}
          </div>
        )}

        <div className="leaderboard-list result-leaderboard">
          {leaderboard.map((entry, index) => (
            <div key={entry.id} className={`participant-row leaderboard-row top-${Math.min(index + 1, 4)}${entry.id === participant?.id ? ' is-self' : ''}`}>
              <div className="participant-avatar">{index + 1}</div>
              <div>
                <strong>{entry.name}</strong>
                <span>{entry.answeredCount}/{quiz.questionCount} soal · {entry.score} poin</span>
              </div>
              <div className="leaderboard-score">
                <span>#{index + 1}</span>
                <small>{entry.finishedAt ? 'finish' : 'live'}</small>
              </div>
            </div>
          ))}
        </div>

        <Link href={`/quiz/start/${quizId}`} prefetch={false} className="primary-btn">
          <ArrowRight size={16} />
          Buka host quiz
        </Link>
      </div>
    )
  }

  if (joinCountdown > 0) {
    return (
      <div className="join-countdown-stage">
        <div className="join-countdown-number" key={joinCountdown}>{joinCountdown}</div>
        <p>Bersiap masuk quiz...</p>
      </div>
    )
  }

  if (!participant) {
    return (
      <div className="quiz-join-shell">
        <div className="hero quiz-join-hero">
          <div className="hero-eyebrow">
            <Sparkles size={12} />
            Join quiz
          </div>
          <h1>{quiz.title}</h1>
          <div className="divider" />
          <p>{quiz.materialTitle} · {quiz.questionCount} soal · {quiz.participants.length} user sudah join</p>
        </div>

        <div className="join-grid">
          <form className="panel-card join-form-card" onSubmit={handleJoin}>
            <div className="panel-head">
              <div>
                <div className="panel-kicker">Masuk lobby</div>
                <h2>Masukkan nama kamu</h2>
              </div>
              <Users size={18} />
            </div>

            <label className="field-block">
              <span>Nama peserta</span>
              <input value={joinName} onChange={(event) => setJoinName(event.target.value)} placeholder="Nama kamu" />
            </label>

            {notice && <div className="form-alert error">{notice}</div>}

            <button className="primary-btn" type="submit" disabled={joining}>
              <Send size={16} />
              {joining ? 'Memproses...' : 'Gabung Quiz'}
            </button>
          </form>

          <aside className="panel-card lobby-card">
            <div className="panel-head">
              <div>
                <div className="panel-kicker">Peserta yang sudah join</div>
                <h2>{quiz.participants.length} user</h2>
              </div>
              <Users size={18} />
            </div>

            <div className="participant-list">
              {quiz.participants.length === 0 ? (
                <div className="empty-state">Belum ada user yang join.</div>
              ) : (
                quiz.participants.map((item, index) => (
                  <div key={item.id} className="participant-row">
                    <div className="participant-avatar">{item.name.slice(0, 1).toUpperCase()}</div>
                    <div>
                      <strong>{item.name}</strong>
                      <span>Peserta #{index + 1}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="info-box">
              <Clock3 size={16} />
              <span>Setelah host menekan mulai, kamu masuk ke quiz live dengan ranking real-time, timer, dan meme feedback tiap jawaban.</span>
            </div>
          </aside>
        </div>
      </div>
    )
  }

  if (!readyToPlay) {
    return (
      <div>
        <div className="hero quiz-play-hero">
          <div className="hero-eyebrow">
            <Users size={12} />
            Lobby aktif
          </div>
          <h1>{quiz.title}</h1>
          <div className="divider" />
          <p>{quiz.materialTitle} · {quiz.participants.length} user sudah join · menunggu host memulai quiz</p>
        </div>

        {quiz.status === 'countdown' && countdownRemaining > 0 && (
          <div className="countdown-stage">
            <div className="countdown-ring">
              <span>Quiz mulai dalam</span>
              <strong>{formatRemainingTime(countdownRemaining)}</strong>
            </div>
          </div>
        )}

        <div className="join-grid">
          <section className="panel-card lobby-card">
            <div className="panel-head">
              <div>
                <div className="panel-kicker">Peserta di lobby</div>
                <h2>{quiz.participants.length} user</h2>
              </div>
              <Users size={18} />
            </div>

            <div className="participant-list">
              {leaderboard.map((item, index) => (
                <div key={item.id} className={`participant-row${item.id === participant.id ? ' is-self' : ''}`}>
                  <div className="participant-avatar">{item.name.slice(0, 1).toUpperCase()}</div>
                  <div>
                    <strong>{item.name}</strong>
                    <span>Posisi lobby #{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="panel-card join-form-card">
            <div className="panel-head">
              <div>
                <div className="panel-kicker">Status</div>
                <h2>{quiz.status === 'countdown' ? 'Countdown berjalan' : 'Menunggu host'}</h2>
              </div>
              <Clock3 size={18} />
            </div>

            <div className="current-rank-banner compact">
              <span>Kamu login sebagai</span>
              <strong>{participant.name}</strong>
              <small>{quiz.questionCount} soal · {quiz.durationMinutes} menit total</small>
            </div>

            <div className="info-box">
              <Clock3 size={16} />
              <span>Begitu host menekan mulai, halaman ini otomatis masuk ke soal live. Kamu juga langsung lihat rank kamu secara real-time.</span>
            </div>
          </aside>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="hero quiz-play-hero">
        <div className="hero-eyebrow">
          <Clock3 size={12} />
          Live quiz
        </div>
        <h1>{quiz.title}</h1>
        <div className="divider" />
        <p>{quiz.materialTitle} · {quiz.questions.length} soal · {quiz.participants.length} peserta aktif</p>
      </div>

      <div className="live-summary-bar">
        <div className="quiz-score-chip">Skor: {score}</div>
        <div className="quiz-timer-chip">
          <Clock3 size={14} />
          Sisa quiz {formatRemainingTime(totalRemaining)}
        </div>
        <div className="quiz-rank-chip">Rank #{currentRank ?? '-'}</div>
      </div>

      <div className="quiz-stage-grid">
        <section className="quiz-stage">
          <div className="quiz-stage-head">
            <div className="quiz-score-chip">Soal {currentIndex + 1}/{quiz.questions.length}</div>
            <div className="quiz-timer-chip">
              <Clock3 size={14} />
              {secondsLeft}s
            </div>
          </div>

          <div className="quiz-progress">
            <div className="quiz-progress-bar" style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }} />
          </div>

          {feedback && (
            <>
              <div className={`feedback ${feedback.tone}`}>
                {feedback.tone === 'correct' ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                <span>{feedback.text}</span>
              </div>
              <div className={`meme-card ${feedback.tone}`}>
                <div className="meme-card-media">
                  <Image src={feedback.meme.src} alt={feedback.meme.title} width={320} height={200} />
                </div>
                <div className="meme-card-copy">
                  <strong>{feedback.meme.title}</strong>
                  <span>{feedback.meme.caption}</span>
                </div>
              </div>
            </>
          )}

          {notice && <div className="form-alert info">{notice}</div>}

          {question && (
            <div className="question-box live-question-box">
              <div className="question-meta">
                <span>{quiz.materialTitle}</span>
                <span>{answeredCount} jawaban tersimpan</span>
              </div>
              <h3>{question.question}</h3>

              <div className="options">
                {question.options.map((option, index) => {
                  let className = 'option-btn'
                  if (questionLocked) {
                    if (index === question.answer) {
                      className += ' correct'
                    } else if (index === selectedIndex) {
                      className += ' wrong'
                    }
                  }

                  return (
                    <button
                      key={`${question.question}-${option}`}
                      type="button"
                      className={className}
                      onClick={() => void resolveQuestion(index)}
                      disabled={questionLocked || submittingAnswer}
                    >
                      <span className="opt-letter">{String.fromCharCode(65 + index)}</span>
                      {option}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </section>

        <aside className="panel-card live-ranking-card">
          <div className="panel-head">
            <div>
              <div className="panel-kicker">Rank realtime</div>
              <h2>Peringkat kamu</h2>
            </div>
            <Trophy size={18} />
          </div>

          <div className="current-rank-banner">
            <span>{participant.name}</span>
            <strong>#{currentRank ?? '-'}</strong>
            <small>{score} poin · {answeredCount}/{quiz.questionCount} soal</small>
          </div>

          <div className="join-summary-grid">
            <div className="join-stat">
              <strong>{leaderboard.length}</strong>
              <span>Peserta</span>
            </div>
            <div className="join-stat">
              <strong>{leaderboard[0]?.score ?? 0}</strong>
              <span>Skor atas</span>
            </div>
            <div className="join-stat">
              <strong>{formatRemainingTime(totalRemaining)}</strong>
              <span>Sisa waktu</span>
            </div>
            <div className="join-stat">
              <strong>{quiz.questionDurationSeconds}s</strong>
              <span>Per soal</span>
            </div>
          </div>

          <div className="leaderboard-list">
            {leaderboard.map((entry, index) => (
              <div key={entry.id} className={`participant-row leaderboard-row top-${Math.min(index + 1, 4)}${entry.id === participant.id ? ' is-self' : ''}`}>
                <div className="participant-avatar">{index + 1}</div>
                <div>
                  <strong>{entry.name}</strong>
                  <span>{entry.answeredCount}/{quiz.questionCount} soal · {entry.score} poin</span>
                </div>
                <div className="leaderboard-score">
                  <span>#{index + 1}</span>
                  <small>{entry.finishedAt ? 'finish' : 'live'}</small>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
