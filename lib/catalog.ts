export type MaterialId = 'teori' | 'motif' | 'prinsip' | 'contoh'
export type QuizMaterialId = MaterialId | 'all'

export interface MaterialSeed {
  id: MaterialId
  title: string
  eyebrow: string
  summary: string
  accent: string
}

export interface SubmateriSeed {
  slug: string
  title: string
  summary: string
  body: string
  points: string[]
  imageSrc?: string
  imageAlt?: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  answer: number
  explanation: string
}

export const QUIZ_START_DELAY_MS = 3000
export const QUESTION_DURATION_SECONDS = 15
export const DEFAULT_QUIZ_DURATION_MINUTES = 10

export const ALL_QUIZ_MATERIAL = {
  id: 'all' as const,
  title: 'Semua Materi IPAS',
  eyebrow: 'Semua Materi',
  summary: 'Gabungan semua submateri aktif dan bank soal IPAS Ekonomi dalam satu sesi quiz live.',
  accent: 'blue',
}

export const MATERIALS: MaterialSeed[] = [
  {
    id: 'teori',
    title: 'Teori Ekonomi',
    eyebrow: 'Materi 1',
    summary: 'Dasar untuk memahami bagaimana sumber daya terbatas dialokasikan guna memenuhi kebutuhan yang tidak terbatas.',
    accent: 'blue',
  },
  {
    id: 'motif',
    title: 'Motif Ekonomi',
    eyebrow: 'Materi 2',
    summary: 'Alasan yang mendorong seseorang melakukan tindakan ekonomi, dari memenuhi kebutuhan hingga menyiapkan masa depan.',
    accent: 'green',
  },
  {
    id: 'prinsip',
    title: 'Prinsip Ekonomi',
    eyebrow: 'Materi 3',
    summary: 'Pedoman bertindak efisien agar memperoleh hasil terbaik dengan biaya, waktu, dan usaha yang tepat.',
    accent: 'amber',
  },
  {
    id: 'contoh',
    title: 'Contoh Nyata',
    eyebrow: 'Penerapan',
    summary: 'Contoh singkat penerapan teori, motif, dan prinsip ekonomi dalam kehidupan sehari-hari.',
    accent: 'teal',
  },
]

export const DEFAULT_SUBMATERI: Record<MaterialId, SubmateriSeed[]> = {
  teori: [
    {
      slug: 'pengertian-teori-ekonomi',
      title: 'Pengertian Teori Ekonomi',
      summary: 'Teori ekonomi menjelaskan cara individu, perusahaan, dan pemerintah mengambil keputusan saat sumber daya terbatas.',
      body: 'Teori ekonomi adalah kumpulan prinsip, konsep, dan hukum yang digunakan untuk memahami bagaimana kebutuhan manusia dipenuhi dengan sumber daya yang terbatas.',
      points: [
        'Menjadi dasar ilmu ekonomi modern.',
        'Membahas keputusan individu, perusahaan, dan pemerintah.',
        'Membantu menjelaskan berbagai fenomena ekonomi.',
      ],
    },
    {
      slug: 'ekonomi-mikro',
      title: 'Ekonomi Mikro',
      summary: 'Ekonomi mikro mempelajari perilaku unit ekonomi individual seperti konsumen, rumah tangga, dan perusahaan.',
      body: 'Ekonomi mikro berfokus pada keputusan di tingkat individu serta interaksi pembeli dan penjual dalam pembentukan harga pasar.',
      points: [
        'Mengkaji permintaan dan penawaran.',
        'Membahas perilaku konsumen, produksi, dan biaya.',
        'Menganalisis struktur pasar dan penentuan harga.',
      ],
    },
    {
      slug: 'ekonomi-makro',
      title: 'Ekonomi Makro',
      summary: 'Ekonomi makro mempelajari perekonomian secara keseluruhan.',
      body: 'Kajian ekonomi makro menyoroti variabel besar yang memengaruhi kondisi ekonomi suatu negara dan arah kebijakan nasional.',
      points: [
        'Membahas PDB, inflasi, dan pengangguran.',
        'Menganalisis pertumbuhan ekonomi nasional.',
        'Berkaitan dengan kebijakan fiskal, moneter, dan perdagangan.',
      ],
    },
    {
      slug: 'tokoh-penting-teori-ekonomi',
      title: 'Tokoh Penting Teori Ekonomi',
      summary: 'Adam Smith, John Maynard Keynes, Alfred Marshall, dan Milton Friedman berperan besar dalam perkembangan teori ekonomi.',
      body: 'Tokoh-tokoh ini membantu kita memahami pasar bebas, peran pemerintah, elastisitas, serta pentingnya jumlah uang beredar dalam perekonomian.',
      points: [
        'Adam Smith: pasar bebas dan invisible hand.',
        'John Maynard Keynes: pentingnya peran pemerintah.',
        'Alfred Marshall: permintaan, penawaran, dan elastisitas.',
        'Milton Friedman: monetarisme dan uang beredar.',
      ],
    },
    {
      slug: 'masalah-pokok-ekonomi',
      title: 'Masalah Pokok Ekonomi',
      summary: 'Masalah pokok ekonomi menjawab apa, bagaimana, dan untuk siapa barang serta jasa diproduksi.',
      body: 'Tiga pertanyaan ini menjadi dasar pengambilan keputusan ekonomi karena sumber daya yang tersedia selalu terbatas.',
      points: [
        'Apa yang harus diproduksi?',
        'Bagaimana cara memproduksinya?',
        'Untuk siapa barang dan jasa diproduksi?',
      ],
    },
  ],
  motif: [
    {
      slug: 'pengertian-motif-ekonomi',
      title: 'Pengertian Motif Ekonomi',
      summary: 'Motif ekonomi adalah alasan atau dorongan yang membuat seseorang melakukan kegiatan ekonomi.',
      body: 'Motif ekonomi menjelaskan mengapa orang bekerja, berdagang, menabung, berinvestasi, atau membantu orang lain.',
      points: [
        'Tanpa motif, kegiatan ekonomi tidak berjalan.',
        'Motif memengaruhi tujuan setiap tindakan ekonomi.',
        'Bisa bersifat pribadi maupun sosial.',
      ],
    },
    {
      slug: 'pemenuhan-kebutuhan',
      title: 'Pemenuhan Kebutuhan',
      summary: 'Motif ini mendorong orang memenuhi kebutuhan pokok seperti pangan, sandang, dan papan.',
      body: 'Motif ini paling dasar karena berkaitan dengan kebutuhan hidup sehari-hari, termasuk kesehatan, pendidikan, dan keamanan.',
      points: [
        'Motif paling dasar dalam kehidupan ekonomi.',
        'Berkaitan dengan kebutuhan hidup sehari-hari.',
        'Mencakup pangan, sandang, papan, dan kebutuhan penting lain.',
      ],
    },
    {
      slug: 'memperoleh-keuntungan',
      title: 'Memperoleh Keuntungan',
      summary: 'Motif keuntungan mendorong pelaku ekonomi mencari laba.',
      body: 'Motif ini umum dalam dunia bisnis dan perdagangan karena pelaku ekonomi ingin memperoleh hasil finansial dari kegiatan usahanya.',
      points: [
        'Umum dalam bisnis dan perdagangan.',
        'Mendorong kegiatan produksi, penjualan, dan investasi.',
        'Berorientasi pada laba atau keuntungan finansial.',
      ],
    },
    {
      slug: 'motif-sosial',
      title: 'Motif Sosial',
      summary: 'Motif sosial mendorong tindakan ekonomi untuk membantu orang lain atau masyarakat.',
      body: 'Pada motif ini, tindakan ekonomi dilakukan untuk memberi manfaat kepada orang lain, bukan semata-mata mencari keuntungan pribadi.',
      points: [
        'Bersifat peduli dan altruistik.',
        'Tidak berfokus pada keuntungan pribadi.',
        'Terlihat dalam donasi dan kegiatan sosial.',
      ],
    },
    {
      slug: 'prestise-dan-kekuasaan',
      title: 'Prestise dan Kekuasaan',
      summary: 'Motif ini berkaitan dengan keinginan memperoleh status, pengaruh, atau pengakuan sosial.',
      body: 'Seseorang dapat melakukan kegiatan ekonomi untuk memperkuat citra diri, menunjukkan status, atau memperluas pengaruhnya di masyarakat.',
      points: [
        'Berkaitan dengan citra dan pengakuan sosial.',
        'Sering muncul dalam keputusan konsumsi tertentu.',
        'Mendorong pencarian pengaruh di lingkungan sekitar.',
      ],
    },
    {
      slug: 'keamanan-dan-masa-depan',
      title: 'Keamanan dan Masa Depan',
      summary: 'Motif ini mendorong orang menabung, berinvestasi, atau membeli asuransi.',
      body: 'Motif ini berkaitan dengan upaya menjaga kestabilan finansial dan perlindungan keluarga pada masa depan.',
      points: [
        'Berorientasi jangka panjang.',
        'Bertujuan menjaga keamanan finansial.',
        'Membantu menghadapi risiko masa depan.',
      ],
    },
    {
      slug: 'motif-berdasarkan-pelaku',
      title: 'Motif Berdasarkan Pelaku',
      summary: 'Konsumen, produsen, dan pemerintah memiliki motif ekonomi yang berbeda.',
      body: 'Konsumen fokus pada kebutuhan dan kepuasan, produsen pada laba dan usaha, sedangkan pemerintah pada kesejahteraan dan stabilitas ekonomi.',
      points: [
        'Konsumen: memenuhi kebutuhan dan kepuasan maksimal.',
        'Produsen: keuntungan, omzet, dan keberlangsungan usaha.',
        'Pemerintah: kesejahteraan rakyat dan lapangan kerja.',
      ],
    },
  ],
  prinsip: [
    {
      slug: 'pengertian-prinsip-ekonomi',
      title: 'Pengertian Prinsip Ekonomi',
      summary: 'Prinsip ekonomi adalah pedoman bertindak agar hasil maksimal dicapai dengan pengorbanan minimal.',
      body: 'Prinsip ekonomi menekankan efisiensi dalam penggunaan biaya, waktu, tenaga, dan sumber daya dalam setiap keputusan ekonomi.',
      points: [
        'Lahir karena adanya kelangkaan sumber daya.',
        'Mendorong keputusan yang rasional.',
        'Berlaku dalam berbagai kegiatan ekonomi.',
      ],
    },
    {
      slug: 'rumusan-prinsip-ekonomi',
      title: 'Rumusan Prinsip Ekonomi',
      summary: 'Prinsip ekonomi dirumuskan sebagai hasil sebesar-besarnya dengan pengorbanan tertentu atau hasil tertentu dengan pengorbanan sekecil-kecilnya.',
      body: 'Kedua rumusan tersebut menegaskan bahwa efisiensi adalah kunci utama dalam menentukan pilihan ekonomi.',
      points: [
        'Fokus pada hasil yang optimal.',
        'Pengorbanan dapat berupa biaya, waktu, atau tenaga.',
        'Tujuannya memilih cara yang paling efisien.',
      ],
    },
    {
      slug: 'ciri-orang-yang-menerapkan-prinsip-ekonomi',
      title: 'Ciri Orang yang Menerapkan Prinsip Ekonomi',
      summary: 'Orang yang menerapkan prinsip ekonomi cenderung rasional, hemat, dan mampu menentukan prioritas.',
      body: 'Mereka tidak bertindak impulsif, melainkan membuat perencanaan dan mempertimbangkan manfaat serta pengorbanan sebelum mengambil keputusan.',
      points: [
        'Menyusun skala prioritas kebutuhan.',
        'Memanfaatkan peluang yang ada.',
        'Mempertimbangkan untung-rugi.',
        'Hemat dan tidak boros.',
        'Bertindak rasional.',
      ],
    },
    {
      slug: 'penerapan-prinsip-ekonomi',
      title: 'Penerapan Prinsip Ekonomi',
      summary: 'Prinsip ekonomi diterapkan oleh konsumen, produsen, dan pemerintah.',
      body: 'Konsumen membandingkan harga, produsen menekan biaya produksi, dan pemerintah menyusun anggaran secara efisien serta tepat sasaran.',
      points: [
        'Konsumen: belanja sesuai daftar dan anggaran.',
        'Produsen: kurangi pemborosan dan tingkatkan efisiensi.',
        'Pemerintah: alokasikan anggaran pada program paling berdampak.',
      ],
    },
    {
      slug: 'manfaat-prinsip-ekonomi',
      title: 'Manfaat Prinsip Ekonomi',
      summary: 'Prinsip ekonomi membantu memenuhi kebutuhan secara optimal dan menghindari pemborosan.',
      body: 'Penerapan prinsip ekonomi membuat kegiatan menjadi lebih efisien dan mendukung kesejahteraan yang berkelanjutan.',
      points: [
        'Kebutuhan terpenuhi lebih baik.',
        'Sumber daya tidak terbuang sia-sia.',
        'Tujuan ekonomi tercapai lebih cepat.',
        'Efisiensi meningkat.',
        'Kesejahteraan lebih terjaga.',
      ],
    },
  ],
  contoh: [
    {
      slug: 'harga-turun-pembeli-naik',
      title: 'Harga Turun, Pembeli Naik',
      summary: 'Saat harga barang turun, jumlah pembeli biasanya bertambah.',
      body: 'Ini contoh hukum permintaan dalam kehidupan sehari-hari.',
      points: [
        'Konsep: hukum permintaan.',
        'Harga memengaruhi keputusan pembeli.',
        'Permintaan bisa berubah saat harga berubah.',
      ],
      imageSrc: '/images/contoh/harga-turun-pembeli-naik.jpg',
      imageAlt: 'Placeholder contoh harga turun membuat pembeli bertambah',
    },
    {
      slug: 'buka-toko-untuk-laba',
      title: 'Buka Toko untuk Laba',
      summary: 'Pedagang membuka toko untuk memperoleh keuntungan.',
      body: 'Ini contoh motif memperoleh laba dalam kegiatan usaha.',
      points: [
        'Motif: keuntungan.',
        'Tujuan utama: memperoleh laba.',
        'Umum dalam kegiatan bisnis.',
      ],
      imageSrc: '/images/contoh/buka-toko-untuk-laba.jpg',
      imageAlt: 'Placeholder contoh pedagang membuka toko untuk laba',
    },
    {
      slug: 'donasi-untuk-sesama',
      title: 'Donasi untuk Sesama',
      summary: 'Sebagian penghasilan disumbangkan untuk membantu korban bencana.',
      body: 'Ini contoh motif sosial dalam tindakan ekonomi.',
      points: [
        'Motif: sosial.',
        'Tujuan: membantu orang lain.',
        'Tidak berorientasi laba pribadi.',
      ],
      imageSrc: '/images/contoh/donasi-untuk-sesama.jpg',
      imageAlt: 'Placeholder contoh donasi untuk sesama',
    },
    {
      slug: 'barang-mewah-dan-status',
      title: 'Barang Mewah dan Status',
      summary: 'Seseorang membeli barang mewah untuk menunjukkan status sosial.',
      body: 'Ini contoh motif prestise atau pengakuan sosial.',
      points: [
        'Motif: prestise.',
        'Berkaitan dengan citra diri.',
        'Keputusan ekonomi dipengaruhi status sosial.',
      ],
      imageSrc: '/images/contoh/barang-mewah-status.jpg',
      imageAlt: 'Placeholder contoh barang mewah dan status sosial',
    },
    {
      slug: 'menabung-untuk-masa-depan',
      title: 'Menabung untuk Masa Depan',
      summary: 'Menabung, investasi, atau asuransi dilakukan demi keamanan masa depan.',
      body: 'Ini contoh motif keamanan dalam perencanaan keuangan.',
      points: [
        'Motif: keamanan masa depan.',
        'Berorientasi jangka panjang.',
        'Bertujuan menjaga kestabilan finansial.',
      ],
      imageSrc: '/images/contoh/menabung-untuk-masa-depan.jpg',
      imageAlt: 'Placeholder contoh menabung untuk masa depan',
    },
    {
      slug: 'bandingkan-harga-belanja',
      title: 'Bandingkan Harga Belanja',
      summary: 'Konsumen membandingkan harga sebelum memilih barang.',
      body: 'Ini contoh prinsip ekonomi agar manfaat terbaik diperoleh dengan biaya yang efisien.',
      points: [
        'Prinsip: efisiensi.',
        'Keputusan didasarkan pada perbandingan.',
        'Umum dilakukan konsumen.',
      ],
      imageSrc: '/images/contoh/bandingkan-harga-belanja.jpg',
      imageAlt: 'Placeholder contoh membandingkan harga sebelum membeli',
    },
    {
      slug: 'subsidi-tepat-sasaran',
      title: 'Subsidi Tepat Sasaran',
      summary: 'Pemerintah menyalurkan subsidi kepada pihak yang benar-benar membutuhkan.',
      body: 'Ini contoh prinsip ekonomi pemerintah dalam pengelolaan anggaran.',
      points: [
        'Prinsip: efisiensi anggaran.',
        'Tujuan: dampak terbesar bagi masyarakat.',
        'Menekankan ketepatan sasaran.',
      ],
      imageSrc: '/images/contoh/subsidi-tepat-sasaran.jpg',
      imageAlt: 'Placeholder contoh subsidi tepat sasaran',
    },
  ],
}

export const QUIZ_BANK: Record<MaterialId, QuizQuestion[]> = {
  teori: [
    {
      question: 'Teori ekonomi mempelajari cara ...',
      options: ['Mengalokasikan sumber daya terbatas', 'Menghafal nama perusahaan', 'Mencetak uang tanpa aturan', 'Menentukan semua harga secara acak'],
      answer: 0,
      explanation: 'Teori ekonomi membahas bagaimana sumber daya yang terbatas digunakan untuk memenuhi kebutuhan manusia.',
    },
    {
      question: 'Cabang ekonomi yang mempelajari perilaku konsumen dan perusahaan adalah ...',
      options: ['Ekonomi mikro', 'Ekonomi makro', 'Ekonomi regional', 'Ekonomi politik'],
      answer: 0,
      explanation: 'Ekonomi mikro fokus pada unit-unit ekonomi individual seperti konsumen dan perusahaan.',
    },
    {
      question: 'Inflasi, pengangguran, dan PDB dibahas dalam ...',
      options: ['Ekonomi makro', 'Ekonomi mikro', 'Akuntansi', 'Manajemen'],
      answer: 0,
      explanation: 'Ekonomi makro mempelajari perekonomian secara keseluruhan.',
    },
    {
      question: 'Tokoh yang dikenal dengan konsep invisible hand adalah ...',
      options: ['Adam Smith', 'Alfred Marshall', 'Milton Friedman', 'John Maynard Keynes'],
      answer: 0,
      explanation: 'Adam Smith dikenal sebagai tokoh pasar bebas dengan konsep invisible hand.',
    },
    {
      question: 'Masalah pokok ekonomi mencakup pertanyaan ...',
      options: ['Apa, bagaimana, dan untuk siapa diproduksi', 'Kapan libur dan kapan bekerja', 'Siapa guru dan siapa murid', 'Berapa jumlah penduduk dan luas wilayah'],
      answer: 0,
      explanation: 'Masalah pokok ekonomi membahas apa yang diproduksi, bagaimana memproduksi, dan untuk siapa hasilnya.',
    },
  ],
  motif: [
    {
      question: 'Motif ekonomi adalah ...',
      options: ['Alasan melakukan tindakan ekonomi', 'Nama lain dari pasar bebas', 'Cara menghitung laba', 'Jenis alat pembayaran'],
      answer: 0,
      explanation: 'Motif ekonomi adalah alasan atau dorongan yang membuat seseorang melakukan kegiatan ekonomi.',
    },
    {
      question: 'Dorongan untuk memenuhi pangan, sandang, dan papan termasuk motif ...',
      options: ['Pemenuhan kebutuhan', 'Prestise', 'Sosial', 'Kekuasaan'],
      answer: 0,
      explanation: 'Motif pemenuhan kebutuhan berkaitan dengan kebutuhan pokok sehari-hari.',
    },
    {
      question: 'Membuka usaha dengan tujuan memperoleh laba termasuk motif ...',
      options: ['Keuntungan', 'Sosial', 'Keamanan masa depan', 'Kebutuhan pokok'],
      answer: 0,
      explanation: 'Motif memperoleh keuntungan mendorong pelaku ekonomi mencari laba.',
    },
    {
      question: 'Menyumbangkan penghasilan untuk membantu korban bencana termasuk motif ...',
      options: ['Sosial', 'Prestise', 'Keuntungan', 'Kekuasaan'],
      answer: 0,
      explanation: 'Motif sosial mendorong tindakan ekonomi untuk membantu orang lain atau masyarakat.',
    },
    {
      question: 'Membeli barang mewah demi pengakuan sosial termasuk motif ...',
      options: ['Prestise dan kekuasaan', 'Sosial', 'Pemenuhan kebutuhan', 'Ibadah'],
      answer: 0,
      explanation: 'Motif prestise berkaitan dengan status, citra diri, dan pengakuan sosial.',
    },
    {
      question: 'Menabung atau membeli asuransi untuk perlindungan keluarga termasuk motif ...',
      options: ['Keamanan dan masa depan', 'Keuntungan', 'Prestise', 'Sosial'],
      answer: 0,
      explanation: 'Motif keamanan dan masa depan berhubungan dengan kestabilan finansial jangka panjang.',
    },
  ],
  prinsip: [
    {
      question: 'Inti prinsip ekonomi adalah ...',
      options: ['Hasil maksimal dengan pengorbanan minimal', 'Menghabiskan semua sumber daya', 'Menaikkan harga setinggi mungkin', 'Mengutamakan gengsi saat membeli'],
      answer: 0,
      explanation: 'Prinsip ekonomi menekankan hasil terbaik dengan biaya, waktu, dan usaha yang efisien.',
    },
    {
      question: 'Prinsip ekonomi muncul karena adanya ...',
      options: ['Kelangkaan sumber daya', 'Surplus tanpa batas', 'Harga yang selalu sama', 'Produksi tanpa biaya'],
      answer: 0,
      explanation: 'Prinsip ekonomi lahir karena manusia menghadapi sumber daya yang terbatas.',
    },
    {
      question: 'Sikap yang menunjukkan penerapan prinsip ekonomi adalah ...',
      options: ['Membuat skala prioritas', 'Belanja tanpa rencana', 'Mengabaikan biaya', 'Membeli semua barang diskon'],
      answer: 0,
      explanation: 'Orang yang menerapkan prinsip ekonomi cenderung rasional dan menentukan prioritas.',
    },
    {
      question: 'Membandingkan harga sebelum membeli barang termasuk prinsip ekonomi bagi ...',
      options: ['Konsumen', 'Produsen', 'Pemerintah', 'Distributor'],
      answer: 0,
      explanation: 'Membandingkan harga adalah contoh prinsip ekonomi pada konsumen.',
    },
    {
      question: 'Mengurangi pemborosan bahan baku adalah contoh prinsip ekonomi bagi ...',
      options: ['Produsen', 'Konsumen', 'Pemerintah', 'Pekerja lepas'],
      answer: 0,
      explanation: 'Produsen menerapkan prinsip ekonomi dengan menekan biaya dan mengurangi pemborosan.',
    },
    {
      question: 'Menyalurkan subsidi tepat sasaran adalah contoh prinsip ekonomi bagi ...',
      options: ['Pemerintah', 'Konsumen', 'Produsen', 'Distributor'],
      answer: 0,
      explanation: 'Pemerintah menerapkan prinsip ekonomi saat mengelola anggaran secara efisien.',
    },
    {
      question: 'Salah satu manfaat prinsip ekonomi adalah ...',
      options: ['Menghindari pemborosan sumber daya', 'Membuat kebutuhan bertambah tanpa batas', 'Menurunkan semua harga barang', 'Menghapus semua risiko ekonomi'],
      answer: 0,
      explanation: 'Prinsip ekonomi membantu memenuhi kebutuhan secara optimal dan mencegah pemborosan.',
    },
  ],
  contoh: [
    {
      question: 'Saat harga barang turun dan pembeli bertambah, contoh tersebut menunjukkan ...',
      options: ['Hukum permintaan', 'Motif sosial', 'Motif prestise', 'Prinsip pemerintah'],
      answer: 0,
      explanation: 'Harga yang turun dapat meningkatkan jumlah pembelian, ini contoh hukum permintaan.',
    },
    {
      question: 'Pedagang membuka toko untuk memperoleh keuntungan adalah contoh ...',
      options: ['Motif laba', 'Motif sosial', 'Motif ibadah', 'Ekonomi makro'],
      answer: 0,
      explanation: 'Membuka toko untuk memperoleh laba adalah contoh motif keuntungan.',
    },
    {
      question: 'Menyumbangkan penghasilan untuk korban bencana merupakan contoh ...',
      options: ['Motif sosial', 'Motif prestise', 'Motif keuntungan', 'Ekonomi mikro'],
      answer: 0,
      explanation: 'Donasi untuk sesama menunjukkan motif sosial dalam tindakan ekonomi.',
    },
    {
      question: 'Membeli barang mewah untuk menunjukkan status sosial adalah contoh ...',
      options: ['Motif prestise', 'Motif sosial', 'Prinsip produksi', 'Ekonomi makro'],
      answer: 0,
      explanation: 'Status dan pengakuan sosial termasuk motif prestise atau kekuasaan.',
    },
    {
      question: 'Menabung atau membeli asuransi untuk masa depan adalah contoh ...',
      options: ['Motif keamanan dan masa depan', 'Motif sosial', 'Motif laba', 'Hukum permintaan'],
      answer: 0,
      explanation: 'Menabung dan asuransi menunjukkan upaya menjaga keamanan finansial di masa depan.',
    },
    {
      question: 'Membandingkan harga sebelum membeli barang adalah contoh ...',
      options: ['Prinsip ekonomi konsumen', 'Motif prestise', 'Motif sosial', 'Ekonomi makro'],
      answer: 0,
      explanation: 'Membandingkan harga merupakan contoh penerapan prinsip ekonomi oleh konsumen.',
    },
    {
      question: 'Penyaluran subsidi tepat sasaran menunjukkan penerapan prinsip ekonomi oleh ...',
      options: ['Pemerintah', 'Konsumen', 'Produsen', 'Pedagang'],
      answer: 0,
      explanation: 'Pemerintah menerapkan prinsip ekonomi saat anggaran dialokasikan secara efisien dan tepat sasaran.',
    },
  ],
}

export function isMaterialId(value: string): value is MaterialId {
  return MATERIALS.some((material) => material.id === value)
}

export function getRecommendedQuizDurationMinutes(questionCount: number): number {
  const safeQuestionCount = Math.max(1, questionCount)
  return Math.max(DEFAULT_QUIZ_DURATION_MINUTES, Math.ceil((safeQuestionCount * QUESTION_DURATION_SECONDS) / 60) + 2)
}

export function isQuizMaterialId(value: string): value is QuizMaterialId {
  return value === ALL_QUIZ_MATERIAL.id || isMaterialId(value)
}
