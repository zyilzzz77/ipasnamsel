const fs = require('fs')
const path = require('path')

const placeholders = [
  // teori (5)
  { dir: 'teori', file: 'pengertian-teori-ekonomi.svg', label: 'Teori Ekonomi', icon: '📘' },
  { dir: 'teori', file: 'ekonomi-mikro.svg', label: 'Ekonomi Mikro', icon: '🔬' },
  { dir: 'teori', file: 'ekonomi-makro.svg', label: 'Ekonomi Makro', icon: '🌐' },
  { dir: 'teori', file: 'tokoh-penting.svg', label: 'Tokoh Penting', icon: '👤' },
  { dir: 'teori', file: 'masalah-pokok.svg', label: 'Masalah Pokok', icon: '❓' },
  // motif (7)
  { dir: 'motif', file: 'pengertian-motif.svg', label: 'Motif Ekonomi', icon: '💡' },
  { dir: 'motif', file: 'pemenuhan-kebutuhan.svg', label: 'Kebutuhan', icon: '🛒' },
  { dir: 'motif', file: 'memperoleh-keuntungan.svg', label: 'Keuntungan', icon: '💰' },
  { dir: 'motif', file: 'motif-sosial.svg', label: 'Motif Sosial', icon: '🤝' },
  { dir: 'motif', file: 'prestise-kekuasaan.svg', label: 'Prestise', icon: '⭐' },
  { dir: 'motif', file: 'keamanan-masa-depan.svg', label: 'Masa Depan', icon: '🛡️' },
  { dir: 'motif', file: 'motif-pelaku.svg', label: 'Pelaku Ekonomi', icon: '👥' },
  // prinsip (5)
  { dir: 'prinsip', file: 'pengertian-prinsip.svg', label: 'Prinsip Ekonomi', icon: '⚖️' },
  { dir: 'prinsip', file: 'rumusan-prinsip.svg', label: 'Rumusan', icon: '📝' },
  { dir: 'prinsip', file: 'ciri-penerapan.svg', label: 'Ciri Penerapan', icon: '✅' },
  { dir: 'prinsip', file: 'penerapan-prinsip.svg', label: 'Penerapan', icon: '🎯' },
  { dir: 'prinsip', file: 'manfaat-prinsip.svg', label: 'Manfaat', icon: '🏆' },
]

const colors = {
  teori: { bg1: '#7096d1', bg2: '#BCA4F5', text: '#ffffff' },
  motif: { bg1: '#BCA4F5', bg2: '#7096d1', text: '#ffffff' },
  prinsip: { bg1: '#5a7fbe', bg2: '#BCA4F5', text: '#ffffff' },
}

placeholders.forEach(({ dir, file, label, icon }) => {
  const c = colors[dir]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="260" viewBox="0 0 360 260">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c.bg1}" />
      <stop offset="100%" stop-color="${c.bg2}" />
    </linearGradient>
  </defs>
  <rect width="360" height="260" rx="20" fill="url(#bg)" />
  <text x="180" y="110" text-anchor="middle" font-size="56">${icon}</text>
  <text x="180" y="160" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="18" fill="${c.text}">${label}</text>
  <text x="180" y="185" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="${c.text}" opacity="0.7">Placeholder Image</text>
</svg>`
  const outPath = path.join('public', 'images', dir, file)
  fs.writeFileSync(outPath, svg, 'utf-8')
  console.log(`Created: ${outPath}`)
})

console.log('Done! All placeholders generated.')
