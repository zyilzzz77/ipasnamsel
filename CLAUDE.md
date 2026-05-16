# CLAUDE.md — Project Context: IPAS Ekonomi

> Dokumen ini berisi konteks lengkap proyek untuk digunakan oleh AI coding assistant (Claude / Antigravity).
> Baca seluruh dokumen ini sebelum membuat perubahan apa pun.

---

## 1. Gambaran Umum Proyek

| Atribut        | Detail |
|----------------|--------|
| **Nama**       | `ipas-ekonomi` |
| **Tujuan**     | Website media digital pembelajaran IPAS (Ilmu Pengetahuan Alam dan Sosial) untuk materi Ekonomi tingkat SMP/SMA |
| **Bahasa**     | Indonesia (`lang="id"`) |
| **Target User**| Siswa SMP/SMA + Guru IPAS |
| **Framework**  | Next.js 16.2.6 (App Router) + TypeScript + React 19 |
| **Styling**    | Vanilla CSS (`globals.css`) — TIDAK menggunakan Tailwind |
| **Icon Library**| `lucide-react` — semua icon dari sini, **tidak boleh pakai emoji** |
| **Font**       | Inter (Google Fonts) |
| **Port Dev**   | `http://localhost:3000` |

---

## 2. Struktur Direktori Lengkap

```
ipas-ekonomi/
│
├── app/                          # Next.js App Router — semua halaman di sini
│   ├── globals.css               # SATU file CSS global, semua styling ada di sini
│   ├── layout.tsx                # Root layout: import CSS, render <Sidebar />, page-shell
│   ├── page.tsx                  # Route: /  → Halaman Beranda
│   ├── teori/
│   │   └── page.tsx              # Route: /teori → Materi Teori Ekonomi
│   ├── motif/
│   │   └── page.tsx              # Route: /motif → Materi Motif Ekonomi
│   ├── prinsip/
│   │   └── page.tsx              # Route: /prinsip → Materi Prinsip Ekonomi
│   ├── contoh/
│   │   └── page.tsx              # Route: /contoh → Contoh Nyata Kehidupan
│   └── quiz/
│       └── page.tsx              # Route: /quiz → Kuis Interaktif (7 soal)
│
├── components/
│   └── Sidebar.tsx               # Hamburger menu + sidebar slide-in (client component)
│
├── public/                       # Static assets (kosong untuk sekarang)
│
├── Dockerfile                    # Multi-stage build: node:20-alpine builder + runner
├── docker-compose.yml            # Deploy VPS: port 3000, restart: unless-stopped
├── .dockerignore                 # Exclude: node_modules, .next, .git, .env
├── next.config.mjs               # output: 'standalone' (wajib untuk Docker)
├── tsconfig.json                 # TypeScript config (strict mode)
├── package.json                  # Dependencies + scripts
└── CLAUDE.md                     # File ini
```

---

## 3. Stack Teknologi & Versi

```json
{
  "next": "16.2.6",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "typescript": "^6.0.3",
  "lucide-react": "^1.14.0",
  "@types/node": "^25.7.0",
  "@types/react": "^19.2.14",
  "@types/react-dom": "^19.2.3"
}
```

**devDependencies:**
- `eslint` ^9
- `eslint-config-next` 16.2.6

---

## 4. Konten Materi Website

Website berisi 3 materi utama IPAS Ekonomi + 1 halaman contoh + 1 kuis.

### 4.1 Teori Ekonomi (`/teori`)
**Topik yang dibahas:**
- Definisi ilmu ekonomi: mempelajari perilaku manusia memilih sumber daya terbatas (*scarcity*) untuk memenuhi kebutuhan tak terbatas
- Tokoh: **Adam Smith** (1776) — *The Wealth of Nations*, konsep pasar bebas & *invisible hand*
- Cabang:
  - **Ekonomi Mikro** — perilaku unit kecil (individu, RT, perusahaan), contoh: penetapan harga
  - **Ekonomi Makro** — perekonomian agregat nasional, contoh: inflasi, pengangguran, kebijakan moneter/fiskal

**Komponen UI yang digunakan:** `card`, `card-label`, `hero`, `info-box`

### 4.2 Motif Ekonomi (`/motif`)
**6 jenis motif dalam grid card:**
1. Memenuhi Kebutuhan (icon: `ShoppingBag`)
2. Meraih Kemakmuran (icon: `Trophy`)
3. Mendapat Keuntungan (icon: `DollarSign`)
4. Mendapat Kekuasaan (icon: `Star`)
5. Sosial & Kemanusiaan (icon: `Heart`)
6. Ibadah & Nilai (icon: `BookHeart`)

**Klasifikasi:**
- **Motif Intrinsik** — dorongan dari dalam diri (kesadaran pribadi)
- **Motif Ekstrinsik** — dorongan dari luar (lingkungan, sosial, tekanan)

**Komponen UI:** `motif-grid`, `motif-card`, `motif-icon-wrap`, `card`

### 4.3 Prinsip Ekonomi (`/prinsip`)
**Inti prinsip:** *"Dengan pengorbanan sekecil-kecilnya, memperoleh hasil sebesar-besarnya."*

**Penerapan per pelaku (4 item):**
1. Konsumen — beli murah, kualitas terbaik
2. Produsen — efisiensi bahan baku & tenaga kerja
3. Distributor — biaya distribusi minimal
4. Pemerintah — kelola APBN efisien (subsidi tepat sasaran)

**4 Prinsip Gregory Mankiw** (dari *Principles of Economics*):
1. People Face Trade-offs
2. The Cost of Something is What You Give Up (Opportunity Cost)
3. Rational People Think at the Margin
4. People Respond to Incentives

**Komponen UI:** `prinsip-item`, `prinsip-num`, `card`

### 4.4 Contoh Nyata (`/contoh`)
**5 skenario kehidupan nyata di Indonesia:**

| # | Skenario | Konsep Terkait | Icon |
|---|----------|----------------|------|
| 1 | Ojek Online (Gojek/Grab) | Prinsip Ekonomi — efisiensi rute | `Bike` |
| 2 | UMKM Warung Makan | Ekonomi Mikro — perilaku produsen kecil | `Store` |
| 3 | Inflasi & BI Rate (pasca-pandemi 2022) | Ekonomi Makro — kebijakan moneter | `TrendingDown` |
| 4 | Kuliah vs Langsung Kerja | Opportunity Cost (Mankiw prinsip 2) | `GraduationCap` |
| 5 | Donasi & Zakat Digital | Motif sosial & motif ibadah | `Gift` |

**Komponen UI:** `contoh-card`, `contoh-scenario`, `contoh-icon-wrap`, `contoh-insight`

### 4.5 Kuis Interaktif (`/quiz`)
**Spesifikasi:**
- Total: **7 soal** pilihan ganda (A/B/C/D)
- State: `'use client'` — React hooks
- Fitur: progres bar, score badge real-time, feedback per soal, hasil akhir dengan persentase

**State variables:**
```typescript
const [current, setCurrent]     = useState(0)         // index soal aktif
const [score, setScore]         = useState(0)         // jumlah benar
const [selected, setSelected]   = useState<number|null>(null)  // jawaban dipilih
const [done, setDone]           = useState(false)     // tampilkan hasil
const [feedback, setFeedback]   = useState('')        // teks penjelasan
const [isCorrect, setIsCorrect] = useState(false)     // warna feedback
```

**Interface TypeScript:**
```typescript
interface Question {
  q: string      // teks pertanyaan
  opts: string[] // 4 pilihan jawaban
  ans: number    // index jawaban benar (0-based)
  exp: string    // penjelasan setelah menjawab
}
```

**Penilaian hasil:**
- ≥ 86% → "Luar Biasa!"
- ≥ 57% → "Bagus!"
- < 57% → "Terus Belajar!"

**7 Soal Quiz (ringkasan):**
1. Scarcity / sumber daya terbatas → ans: 1 (Terbatas/langka)
2. Motif pengusaha buka pabrik → ans: 2 (Motif mencari keuntungan)
3. Bunyi prinsip ekonomi → ans: 1 (pengorbanan kecil, hasil besar)
4. Perbedaan makro vs mikro → ans: 2 (perekonomian negara keseluruhan)
5. Opportunity cost kuliah vs kerja → ans: 1 (Opportunity cost)
6. Subsidi BBM — prinsip Mankiw → ans: 2 (People respond to incentives)
7. Ibu belanja 3 pasar → ans: 1 (Prinsip ekonomi konsumen)

---

## 5. Arsitektur Komponen

### 5.1 `components/Sidebar.tsx` — Client Component
```
'use client'
Hooks: useState (open/close), usePathname (active link detection)
Props: none (standalone)
Behavior:
  - hamburger-btn: fixed posisi top:16px left:16px, z-index 200
  - sidebar-overlay: backdrop blur, klik untuk tutup, z-index 300
  - sidebar: slide from left translateX(-100% → 0), z-index 400
  - sidebar-link: Next.js <Link />, active class via usePathname()
  - Menutup otomatis setelah klik link
```

**Navigation items:**
```typescript
const NAV = [
  { href: '/',        icon: Home,      label: 'Beranda' },
  { href: '/teori',   icon: BookOpen,  label: 'Teori Ekonomi' },
  { href: '/motif',   icon: Lightbulb, label: 'Motif Ekonomi' },
  { href: '/prinsip', icon: Scale,     label: 'Prinsip Ekonomi' },
  { href: '/contoh',  icon: Globe,     label: 'Contoh Nyata' },
  { href: '/quiz',    icon: Target,    label: 'Kuis Interaktif' },
]
```

### 5.2 `app/layout.tsx` — Root Layout (Server Component)
- Import `globals.css`
- Export `metadata` (title, description, keywords)
- Render `<Sidebar />` + `<main className="page-shell animate-in">`
- `lang="id"` pada `<html>`

### 5.3 Semua `page.tsx` selain quiz — Server Components
- Export `metadata` per halaman (untuk SEO)
- Data statis didefinisikan sebagai `const` array di atas komponen
- Tidak menggunakan `useState` atau `useEffect`

---

## 6. Design System CSS (`globals.css`)

### CSS Custom Properties (`:root`)
```css
--primary: #2563eb        /* Biru utama */
--primary-dark: #1d4ed8   /* Biru gelap (hover, gradient) */
--primary-light: #60a5fa  /* Biru terang */
--primary-50: #eff6ff     /* Background biru sangat muda */
--primary-100: #dbeafe    /* Border biru */
--success: #059669        /* Hijau (contoh nyata, benar) */
--danger: #dc2626         /* Merah (salah, close button) */
--warning: #d97706        /* Amber (tag tokoh) */
--gray-50 .. gray-900     /* Skala abu-abu */
--shadow-sm, shadow, shadow-lg  /* Box shadows bertingkat */
--radius: 16px            /* Border radius card besar */
--radius-sm: 10px         /* Border radius elemen kecil */
--radius-xs: 6px          /* Border radius tag/badge */
```

### Class Utama & Fungsinya
| Class | Digunakan di | Fungsi |
|-------|-------------|--------|
| `.page-shell` | `layout.tsx` | Container utama, max-width 920px, padding kiri 80px untuk hamburger |
| `.animate-in` | `layout.tsx` | Animasi slideUp masuk halaman |
| `.hero` | Semua page | Section judul atas |
| `.hero-eyebrow` | Semua page | Badge label kecil di atas judul |
| `.divider` | Semua page | Garis biru pendek dekorasi |
| `.card` | teori, prinsip | Card dengan border-left biru, hover geser kanan |
| `.card-label` | Dalam card | Tag badge warna (blue/green/red/amber) |
| `.card-num` | Dalam card | Nomor besar transparan background |
| `.motif-grid` | motif | CSS Grid auto-fill, minmax 175px |
| `.motif-card` | motif | Card grid dengan icon wrap di tengah |
| `.motif-icon-wrap` | motif | Container icon bulat 46x46px |
| `.prinsip-item` | prinsip | Flex row dengan nomor bulat di kiri |
| `.prinsip-num` | prinsip | Badge nomor gradient biru |
| `.contoh-card` | contoh | Card dengan border hijau, insight bar |
| `.contoh-insight` | contoh | Bar hijau kiri, teks penjelasan konsep |
| `.info-box` | teori, motif | Box biru info dengan icon + teks |
| `.stats-bar` | beranda | Grid 3 kolom statistik |
| `.home-grid` | beranda | Grid 2 kolom card navigasi |
| `.quiz-*` | quiz | Progress bar, counter, question box |
| `.option-btn` | quiz | Tombol pilihan A/B/C/D |
| `.feedback` | quiz | Box feedback benar/salah |
| `.result-box` | quiz | Halaman hasil akhir kuis |

### Aturan Styling Wajib
- **TIDAK boleh ada inline style** kecuali untuk nilai dinamis (width progress bar, dll)
- **TIDAK boleh pakai Tailwind** — semua class di `globals.css`
- **TIDAK boleh pakai emoji** — gunakan `lucide-react` icon
- Tambah class baru ke `globals.css`, bukan inline
- Semua animasi pakai `transition` atau `@keyframes` yang sudah ada

---

## 7. Routing & Navigasi

```
/           → app/page.tsx          (Beranda — stats, grid menu)
/teori      → app/teori/page.tsx    (Teori Ekonomi)
/motif      → app/motif/page.tsx    (Motif Ekonomi)
/prinsip    → app/prinsip/page.tsx  (Prinsip Ekonomi)
/contoh     → app/contoh/page.tsx   (Contoh Nyata)
/quiz       → app/quiz/page.tsx     (Kuis Interaktif)
```

- Navigasi via `Sidebar.tsx` menggunakan Next.js `<Link />` 
- Active state via `usePathname()` hook
- Menambah halaman baru: buat folder baru di `app/`, tambah ke array `NAV` di `Sidebar.tsx`

---

## 8. Docker & Deployment

### Dockerfile (Multi-Stage)
```
Stage 1 (builder): node:20-alpine
  - npm ci (clean install)
  - npm run build → .next/standalone

Stage 2 (runner): node:20-alpine
  - Non-root user: nextjs (uid 1001)
  - Copy .next/standalone + .next/static + public
  - CMD: node server.js
  - PORT: 3000, HOSTNAME: 0.0.0.0
```

### docker-compose.yml
```yaml
port: 3000:3000
restart: unless-stopped
healthcheck: wget http://localhost:3000 (interval 30s)
```

### next.config.mjs — WAJIB untuk Docker
```js
output: 'standalone'  // ← JANGAN dihapus, ini syarat Docker berjalan
```

### Perintah Deploy ke VPS
```bash
# Upload folder ipas-ekonomi ke VPS
scp -r ipas-ekonomi/ user@vps-ip:/var/www/

# Di VPS
cd /var/www/ipas-ekonomi
docker compose up -d --build

# Cek status
docker compose ps
docker compose logs -f
```

---

## 9. Konvensi Kode

### TypeScript
- **Strict mode aktif** — semua props harus ditype
- Interface untuk data array (contoh: `interface Question {}`)
- `type` untuk union types, `interface` untuk object shapes
- Server components = tidak ada `'use client'`, boleh `async`
- Client components = wajib `'use client'` di baris pertama

### Penamaan
- Komponen: `PascalCase` → `Sidebar.tsx`, `QuizPage`
- Konstanta data: `UPPER_SNAKE_CASE` → `QUESTIONS`, `NAV`, `MOTIFS`
- CSS classes: `kebab-case` → `.motif-card`, `.btn-next`
- File: `kebab-case` untuk folder, `PascalCase` untuk komponen

### Pattern Data
Data statis selalu didefinisikan sebagai `const` array di luar fungsi komponen:
```typescript
const ITEMS: ItemType[] = [
  { title: '...', desc: '...', icon: IconName },
]

export default function Page() {
  return ITEMS.map(({ title, desc, icon: Icon }) => ...)
}
```

### Import Order (konvensi)
```typescript
// 1. Next.js
import type { Metadata } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
// 2. React
import { useState } from 'react'
// 3. Icon library
import { BookOpen, Scale } from 'lucide-react'
// 4. Local components
import Sidebar from '@/components/Sidebar'
// 5. CSS (hanya di layout)
import './globals.css'
```

---

## 10. Cara Menambah Fitur

### Menambah Halaman Materi Baru
1. Buat folder: `app/nama-materi/page.tsx`
2. Export `metadata` dan default component
3. Tambah ke `NAV` array di `components/Sidebar.tsx`
4. Tambah ke `MENU` array di `app/page.tsx` (grid beranda)

### Menambah Soal Kuis
Edit array `QUESTIONS` di `app/quiz/page.tsx`:
```typescript
{
  q: 'Pertanyaan baru...',
  opts: ['Opsi A', 'Opsi B', 'Opsi C', 'Opsi D'],
  ans: 0,  // index 0-based dari jawaban benar
  exp: 'Penjelasan setelah menjawab...',
}
```
Update teks "7 soal" di `quiz/page.tsx` dan `app/page.tsx` (stat).

### Menambah CSS Class Baru
Selalu tambah di `app/globals.css` — TIDAK inline style:
```css
/* ── Nama Section ── */
.nama-class {
  /* properties */
}
.nama-class:hover { /* hover state */ }
```

### Menambah Icon
Selalu import dari `lucide-react`:
```typescript
import { NamaIcon } from 'lucide-react'
// Penggunaan: <NamaIcon size={20} strokeWidth={2} />
```

---

## 11. Perintah NPM

```bash
npm run dev      # Development server (localhost:3000)
npm run build    # Production build (wajib sebelum Docker)
npm run start    # Jalankan production build lokal
npm run lint     # ESLint check
```

---

## 12. Hal yang TIDAK Boleh Dilakukan

| Larangan | Alasan |
|----------|--------|
| Menggunakan Tailwind CSS | Proyek menggunakan Vanilla CSS |
| Menggunakan emoji di UI | Semua icon dari `lucide-react` |
| Inline style untuk hal statis | Harus di `globals.css` |
| Menghapus `output: 'standalone'` | Mematikan Docker deployment |
| Menambah database/backend | Proyek ini pure frontend static |
| Mengubah port default 3000 | Docker compose sudah terkonfigurasi 3000:3000 |
| Membuat file CSS terpisah | Satu file `globals.css` saja |
| Menggunakan `pages/` router | Proyek ini App Router |

---

## 13. Known Issues & Catatan

- **Warning turbopack root**: Muncul karena ada `package-lock.json` di direktori parent (`C:\Users\USER\`). Ini warning saja, tidak mempengaruhi fungsi.
- **layout.js masih ada?**: Jika file `app/layout.js` masih muncul di editor, itu cache VS Code. File sudah dihapus, yang aktif adalah `app/layout.tsx`.
- **Hot Reload**: Saat development, perubahan `globals.css` langsung terrefleksi tanpa restart.
- **`'use client'` di quiz**: Karena menggunakan `useState`, `app/quiz/page.tsx` adalah satu-satunya page yang Client Component. Semua page lain adalah Server Component.
