'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FilePlus2,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react'
import { MATERIALS, type MaterialId } from '@/lib/catalog'

interface MaterialView {
  id: MaterialId
  title: string
  eyebrow: string
  summary: string
  accent: string
  submateri: Array<{ id: string; title: string; summary: string; body: string; points: string[] }>
}

interface QuizSummary {
  id: string
  title: string
  materialTitle: string
  status: 'waiting' | 'countdown' | 'live' | 'finished'
  questionCount: number
  participantCount: number
}

export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState('')
  const [materials, setMaterials] = useState<MaterialView[]>([])
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [form, setForm] = useState({
    materialId: 'teori' as MaterialId,
    title: '',
    summary: '',
    body: '',
    points: '',
  })

  async function refreshDashboard() {
    setDataLoading(true)
    try {
      const [materialsResponse, quizzesResponse] = await Promise.all([
        fetch('/api/materi', { cache: 'no-store' }),
        fetch('/api/quiz', { cache: 'no-store' }),
      ])

      const materialsData = await materialsResponse.json() as { materials?: MaterialView[]; error?: string }
      const quizzesData = await quizzesResponse.json() as { quizzes?: QuizSummary[]; error?: string }

      if (!materialsResponse.ok) {
        throw new Error(materialsData.error ?? 'Gagal memuat materi.')
      }

      if (!quizzesResponse.ok) {
        throw new Error(quizzesData.error ?? 'Gagal memuat quiz.')
      }

      setMaterials(materialsData.materials ?? [])
      setQuizzes(quizzesData.quizzes ?? [])
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Gagal memuat dashboard.')
    } finally {
      setDataLoading(false)
    }
  }

  useEffect(() => {
    const refreshTimeout = window.setTimeout(() => {
      void refreshDashboard()
    }, 0)

    return () => {
      window.clearTimeout(refreshTimeout)
    }
  }, [])

  async function handleAddSubmateri(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setNotice('')

    try {
      const response = await fetch('/api/materi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialId: form.materialId,
          title: form.title,
          summary: form.summary,
          body: form.body,
          points: form.points,
        }),
      })

      const payload = await response.json() as { error?: string }

      if (!response.ok) {
        throw new Error(payload.error ?? 'Gagal menyimpan submateri.')
      }

      setNotice('Submateri baru berhasil ditambahkan.')
      setForm((current) => ({
        ...current,
        title: '',
        summary: '',
        body: '',
        points: '',
      }))
      await refreshDashboard()
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Gagal menyimpan submateri.')
    } finally {
      setLoading(false)
    }
  }

  const totalSubmateri = materials.reduce((count, material) => count + material.submateri.length, 0)

  return (
    <div>
      <div className="hero admin-hero">
        <div>
          <div className="hero-eyebrow">
            <ShieldCheck size={12} />
            Dashboard Konten
          </div>
          <h1>Kelola submateri dan ikuti perkembangan kuis</h1>
          <div className="divider" />
          <p>Tambah submateri baru di bawah ini. Perubahan langsung muncul di halaman materi dan bisa dipakai saat membuat kuis.</p>
        </div>

        <div className="admin-header-actions">
          <button type="button" className="ghost-btn" onClick={() => void refreshDashboard()} disabled={dataLoading}>
            <Sparkles size={16} />
            {dataLoading ? 'Menyegarkan...' : 'Muat ulang data'}
          </button>
        </div>
      </div>

      <div className="stats-bar admin-stats">
        <div className="stat-item">
          <div className="stat-val">{materials.length}</div>
          <div className="stat-lbl">Materi</div>
        </div>
        <div className="stat-item">
          <div className="stat-val">{totalSubmateri}</div>
          <div className="stat-lbl">Submateri</div>
        </div>
        <div className="stat-item">
          <div className="stat-val">{quizzes.length}</div>
          <div className="stat-lbl">Quiz</div>
        </div>
      </div>

      {notice && (
        <div className={`form-alert ${notice.toLowerCase().includes('berhasil') ? 'success' : 'info'}`}>
          {notice}
        </div>
      )}

      <div className="admin-grid">
        <section className="panel-card">
          <div className="panel-head">
            <div>
              <div className="panel-kicker">Tambah Submateri</div>
              <h2>Input konten baru</h2>
            </div>
            <FilePlus2 size={18} />
          </div>

          <form className="admin-form" onSubmit={handleAddSubmateri}>
            <label>
              <span>Materi</span>
              <select value={form.materialId} onChange={(event) => setForm((current) => ({ ...current, materialId: event.target.value as MaterialId }))}>
                {MATERIALS.map((material) => (
                  <option key={material.id} value={material.id}>{material.title}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Judul submateri</span>
              <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Contoh: Harga dan Permintaan" />
            </label>

            <label>
              <span>Ringkasan</span>
              <textarea value={form.summary} onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))} placeholder="Ringkasan singkat submateri" rows={3} />
            </label>

            <label>
              <span>Isi submateri</span>
              <textarea value={form.body} onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))} placeholder="Isi utama submateri" rows={5} />
            </label>

            <label>
              <span>Poin penting</span>
              <textarea value={form.points} onChange={(event) => setForm((current) => ({ ...current, points: event.target.value }))} placeholder="Satu poin per baris" rows={4} />
            </label>

            <button className="primary-btn" type="submit" disabled={loading}>
              <PlusCircle size={16} />
              {loading ? 'Menyimpan...' : 'Tambah Submateri'}
            </button>
          </form>
        </section>

        <section className="panel-card">
          <div className="panel-head">
            <div>
              <div className="panel-kicker">Ringkasan Materi</div>
              <h2>Submateri aktif</h2>
            </div>
            <BookOpen size={18} />
          </div>

          <div className="admin-material-stack">
            {dataLoading && materials.length === 0 ? (
              <div className="loading-state">Memuat daftar materi...</div>
            ) : (
              materials.map((material) => (
                <article key={material.id} className="admin-material-card">
                  <div className="admin-material-top">
                    <div>
                      <h3>{material.title}</h3>
                      <p>{material.summary}</p>
                    </div>
                    <div className="admin-count">{material.submateri.length}</div>
                  </div>
                  <div className="admin-sub-list">
                    {material.submateri.slice(0, 4).map((submateri) => (
                      <div key={submateri.id} className="admin-sub-item">
                        <CheckCircle2 size={14} />
                        <span>{submateri.title}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={`/materi/${material.id}`} prefetch={false} className="admin-link">
                    Buka materi
                    <ArrowRight size={15} />
                  </Link>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="panel-card quiz-summary-card">
        <div className="panel-head">
          <div>
            <div className="panel-kicker">Kuis Terkini</div>
            <h2>Quiz yang sudah dibuat</h2>
          </div>
          <Users size={18} />
        </div>

        <div className="quiz-summary-list">
          {dataLoading && quizzes.length === 0 ? (
            <div className="loading-state">Memuat daftar quiz...</div>
          ) : quizzes.length === 0 ? (
            <div className="empty-state">Belum ada kuis. Buat kuis baru dari halaman /quiz.</div>
          ) : (
            quizzes.map((quiz) => (
              <div key={quiz.id} className="quiz-summary-item">
                <div>
                  <strong>{quiz.title}</strong>
                  <span>{quiz.materialTitle} · {quiz.questionCount} soal</span>
                </div>
                <div className="quiz-summary-meta">
                  <span className={`status-pill ${quiz.status}`}>{quiz.status}</span>
                  <span>{quiz.participantCount} join</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="admin-footer-actions">
          <Link href="/quiz" prefetch={false} className="primary-btn secondary">
            <Target size={16} />
            Buka pembuat kuis
          </Link>
        </div>
      </section>
    </div>
  )
}
