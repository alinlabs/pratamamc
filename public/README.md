# Pratama MC - Dokumentasi & Pusat Informasi Aplikasi Premium secara Rinci

Selamat datang di pusat dokumentasi resmi **Pratama MC**, sebuah platform digital inovatif dan modern yang khusus dirancang sebagai asisten pengatur acara pernikahan, portal kolaborasi klien, dan manajemen pertunjukan terpadu untuk Master of Ceremonies (MC) serta kru Wedding Organizer (WO).

Aplikasi ini menggabungkan portal publik berkelas tinggi dengan dashboard interaktif klien offline-first yang sangat responsif, lancar, dan tangguh di lapangan berkat teknologi modern.

---

## 📌 DAFTAR ISI
1. [Gambaran Umum & Tujuan Platform](#-gambaran-umum--tujuan-platform)
2. [Filosofi Desain & Antarmuka](#-filosofi-desain--antarmuka)
3. [Arsitektur Sistem & Spesifikasi Teknologi](#-arsitektur-sistem--spesifikasi-teknologi)
4. [Analisis Fitur secara Detail & Mendalam](#-analisis-fitur-secara-detail--mendalam)
   - [A. Portal Publik (Layanan & Edukasi)](#a-portal-publik-layanan--edukasi)
   - [B. Portal Kolaborasi Klien (Mandiri & Terintegrasi)](#b-portal-kolaborasi-klien-mandiri--terintegrasi)
   - [C. Portal Manajemen Admin](#c-portal-manajemen-admin)
5. [Skema & Struktur Database Terperinci (D1 Cloudflare)](#-skema--struktur-database-terperinci-d1-cloudflare)
6. [Optimalisasi Performa & Fitur Ketangguhan Lapangan](#-optimalisasi-performa--fitur-ketangguhan-lapangan)
7. [Petunjuk Pengoperasian & Alur Kerja Pengguna](#-petunjuk-pengoperasian--alur-kerja-pengguna)

---

## 🌟 GAMBARAN UMUM & TUJUAN PLATFORM

Pernikahan adalah momen sakral sekali seumur hidup yang melibatkan puluhan koordinasi instan antara pengantin, MC, vendor catering, fotografer, dekorasi, hingga asisten WO. Kendala klasik yang sering terjadi di lapangan adalah:
- Koordinasi musik pengiring yang tidak sinkron.
- Perubahan rundown menit-menit terakhir yang tidak tersampaikan ke MC.
- Catatan doa/amanah penting yang hilang atau terselip.
- Hilangnya sinyal internet di dalam gedung pernikahan (*loss of connection*).

**Pratama MC** hadir untuk menyelesaikan seluruh masalah tersebut dengan platform satu atap:
- **Bagi Publik:** Menjadi galeri hidup penayangan portofolio, katalog harga paket, direktori musik interaktif, kalkulator rencana anggaran pernikahan (*Budgeting Calculator*), serta bacaan edukatif seputar persiapan hari-H.
- **Bagi Klien:** Mengisi informasi acara secara berkala (*Self-Service Portal*), seperti profil pengantin, susunan keluarga, panitia, rundown acara (*itinerary*), koordinasi vendor, daftar tamu VIP/VVIP, hingga unggah berkas naskah pidato/catatan khusus ke Google Drive.
- **Bagi Kru & MC:** Mengakses langsung ringkasan rundown siap cetak *(PDF Export)* atau ringkasan digital ramah ponsel yang selalu terbarui kapan saja secara waktu nyata.

---

## 🎨 FILOSOFI DESAIN & ANTARMUKA

Aplikasi ini mengusung estetika **Modern Premium - Classic Luxe**:
- **Pemilihan Tipografi:**
  - Mengandalkan font **Inter** dengan variasi ketebalan (*weight font*) yang di-tuning tinggi untuk menyajikan keterbacaan tingkat maksimal pada layar perangkat seluler di area panggung pernikahan yang redup.
  - Integrasi font **Space Grotesk** untuk aksen heading bergaya modern, dinamis, serta futuristik, dipadu dengan **JetBrains Mono** pada panel metadata atau status guna mendukung nuansa yang presisi dan bersih.
- **Skema Warna:**
  - Latar belakang mengusung warna dasar eksklusif *Off-White* dan abu-abu arang (*Deep Charcoal Gray*), mencegah kelelahan mata (*eye-strain*) serta memberikan nuansa elegan layaknya undangan pernikahan fisik mewah.
  - Ornamen aksen menggunakan warna emas lembut (*Soft Gold*) atau tembaga hangat (*Warm Copper*) guna menggambarkan nilai estetik pernikahan yang megah dan eksklusif.
- **Pergerakan & Transisi (Motion):**
  - Mengandalkan pustaka animasi mutakhir `@motion` untuk transisi halaman yang amat mulus tanpa sentakan visual (*flickering*).
  - Setiap transisi halaman mengandalkan **Lazy-loading Indicator** dengan `PageLoader` yang beranimasi elegan, menciptakan transisi visual organik saat komponen diunduh di latar belakang.
  - Komponen pop-up dan modal tampil dengan animasi skala mikro yang lembut (*micro-interactions*), memperkuat kepuasan saat disentuh oleh pengguna.

---

## 💻 ARSITEKTUR SISTEM & SPESIFIKASI TEKNOLOGI

Aplikasi **Pratama MC** dirancang menggunakan arsitektur modern berkinerja tinggi:

1. **Frontend Core:**
   - **React 19:** Memanfaatkan keandalan *Concurrent Rendering* terbaru serta hook mutakhir untuk pengelolaan state secara optimal.
   - **Vite 6:** Compiler supercepat dengan integrasi ekosistem plugin yang meminimalkan waktu *Cold-start*.
   - **React Router 7:** Mesin perutean (*routing engine*) tangguh untuk menangani struktur URL dinamis (seperti link unik klien, `/mempelai/edit`).
2. **Konektivitas Backend & Penyimpanan (Serverless Hybrid):**
   - **Express Server (Server-Side Proxy):** Menopang runtime Node.js di sisi server guna menangani proxy API, menjaga integritas kunci rahasia (*secret API keys*), dan menyajikan data static fallback.
   - **Cloudflare Worker & SQLite D1 (Cloud Database):** Database relasional SQL di tepi jaringan (*edge location*) dengan tingkat latensi kueri yang sangat rendah di seluruh dunia.
3. **Penyimpanan Lokal & Offline-First (Resilience Technology):**
   - **Stale-While-Revalidate (SWR):** Sistem memuat cache lokal dalam sekejap mata untuk ditampilkan ke MC di tempat acara, sembari secara paralel melakukan pengambilan data terbaru (*background API fetch*) dari server Cloudflare Worker.
   - Jika koneksi di gedung terputus total, aplikasi tetap dapat berjalan secara penuh (*fully collaborative offline*) menggunakan data yang tersimpan aman pada ruang penyimpanan peramban (*LocalStorage*).

---

## 🔍 ANALISIS FITUR SECARA DETAIL & MENDALAM

### A. Portal Publik (Layanan & Edukasi)
Portal utama yang dapat diakses oleh khalayak luas untuk mengenal layanan Pratama MC secara komprehensif:

*   **1. Beranda Publik (Home):**
    *   **Hero Section:** Banner selamat datang berukuran besar dengan visualisasi video atau gambar portofolio premium terbaik.
    *   **Quick Access:** Jalan pintas interaktif ke seluruh layanan krusial.
    *   **Tentang Kami (About):** Biografi karir Pratama MC, sertifikat keahlian, filosofi vokal, dan pencapaian profesional.
    *   **Rekan Kerja (Mitra):** Daftar logo Wedding Organizer dan vendor ternama yang telah bekerja sama secara formal.
    *   **Pertanyaan Umum (FAQ):** Pengklasifikasian tanya-jawab terstruktur menggunakan panel akordeon interaktif.
*   **2. Direktori Musik Pernikahan (Wedding Playlist Directory):**
    *   Pencarian lagu secara real-time berdasarkan kategori momen penting (misalnya: *Kirab Lagu*, *Mingle*, *Penyandingan*, atau *Flashmob*).
    *   Pemutar audio mini terintegrasi langsung di dalam halaman sehingga calon pengantin dapat mendengarkan aransemen musik (*vokal*, *instrumen*, *violin*, atau *orkestra*) sebelum memilih.
    *   *Lagu Unggulan Terbaru:* **Flashmob Remix** – Gabungan unik lagu daerah dan modern (gerong, mojang priangan, domba kuring & kicau mania) versi vokal mewah.
*   **3. Paket & Harga Layanan:**
    *   Tabel komparasi interaktif yang membandingkan berbagai paket (misalnya Paket Akad Saja, Paket Gold Resepsi, hingga Paket Platinum All-Inclusive).
    *   Setiap kartu paket dilengkapi visualisasi benefit, durasi kerja, jumlah pertemuan teknis koordinasi, serta tombol aksi ajakan (*Call to Action*) yang terhubung langsung ke formulir pemesanan.
*   **4. Rencana Anggaran & Jadwal Pernikahan (Wedding Wedding Planner App):**
    *   Kalkulator simulasi pembagian anggaran pernikahan yang dinamis berdasarkan total modal yang dimiliki pasangan pengantin.
    *   Instruksi *Checklist Milestone* bulanan dari 6 bulan sebelum hari-H hingga esok harinya setelah selesai acara.
*   **5. Galeri Portofolio Dinamis:**
    *   Tampilan visualisasi foto beresolusi tinggi hasil dokumentasi acara terdahulu dengan dukungan pop-up lightbox yang mulus.
    *   Filter dinamis berdasarkan tema pernikahan (seperti *Traditional*, *Modern Rustic*, atau *Elegant Ballroom*).
*   **6. Edukasi & Blog Pernikahan:**
    *   Artikel kaya ilmu bagi calon pengantin, mencakup tips kontrol emosi pranikah, panduan memilih busana di panggung, hingga tata cara menyusun susunan tamu kehormatan.
*   **7. Formulir Hubungi Kami (Contact Form):**
    *   Formulir interaktif lengkap dengan input penanggalan dinamis guna mengecek ketersediaan jadwal kosong Pratama MC pada tanggal pilihan klien.
    *   Peta terintegrasi menggunakan peta digital ramah seluler berbasis Leaflet Maps.

---

### B. Portal Kolaborasi Klien (Mandiri & Terintegrasi)
Portal internal khusus klien yang diakses melalui URL unik bertoken aman (contoh: `/[nama-pengantin]`). Klien dapat mengisi data secara mandiri atau dibantu oleh tim penyusun WO:

1.  **Dashboard Utama Klien (Client Hub):**
    *   Menampilkan ringkasan kelengkapan data dalam bentuk bilah persentase progress pengisian (*Progress Bar*).
    *   Menu navigasi bertab yang sangat lancar dengan animasi mikro.
2.  **Modul Pengantin (Profiles):**
    *   Formulir pengisian informasi lengkap pengantin pria dan pengantin wanita (nama lengkap, nama panggilan, sosial media, nama orang tua, masing-masing akun, dan riwayat latar belakang).
3.  **Modul Acara (Itinerary Builder):**
    *   Alat penyusun susunan acara menit-demi-menit di lapangan. Terdiri atas waktu mulai, nama sub-acara, deskripsi aksi, lokasi tepat, penanggung jawab, hingga kelengkapan lagu pengiring.
4.  **Modul Catatan Khusus (Special Vows & Speech Notes):**
    *   Fitur krusial untuk menyimpan catatan krusial yang harus dibacakan dari panggung.
    *   *Contoh default teks siap pakai terintegrasi:*
        - **Teks Izin Nikah:** Naskah haru permohonan izin dari anak perempuan kepada orang tuanya lengkap dengan detail mahar.
        - **Teks Amanah dari Ayah:** Pesan mendalam ikhlas lepasnya anak kandung wanita kepada pria pilihannya.
        - **Doa Penutup Pernikahan:** Untaian doa syahdu penenang jiwa untuk keberkahan rumah tangga sakral.
5.  **Modul Vendor Terkait (Vendor Coordinator):**
    *   Pendataan vendor terpilih (Catering, Decoration, Fotografi, Videografi, Makeup/MUA, dll) lengkap dengan nama kontak penanggung jawab lapangan (*Person in Charge*) sehingga MC dapat memanggil mereka sebelum seremonial tertentu dimulai.
6.  **Modul Keluarga Besar (Family Members):**
    *   Bagan klasifikasi silsilah keluarga inti dari pihak pengantin pria maupun wanita untuk memudahkan penyebutan saat prosesi sungkeman atau foto kenang-kenangan keluarga berlangsung.
7.  **Modul Pendamping & Panitia (Bridal Party & Committee):**
    *   Pengisian daftar Bridesmaids, Groomsmen, saksi penting nikah, serta daftar panitia internal (Ketua panitia, penata kado, pembawa tumpeng, dsb).
8.  **Modul Daftar Tamu VIP & Seating Plan:**
    *   Pengisian manual atau impor massal daftar tamu istimewa beserta catatan kustom tempat duduk prioritas dan sambutan khusus yang perlu diberikan MC secara ekspresif.
9.  **Modul Integrasi Galeri & Google Drive (Digital Asset Bridge):**
    *   Penyimpanan aman dan tautan integrasi ke folder Google Drive bersama guna menaruh foto prawedding (*prewedding gallery*), video bumper, lagu pengiring kustom format MP3, hingga naskah digital berukuran besar.
10. **Modul Ringkasan Rundown Ekspor PDF (The Master Sheet):**
    *   Satu halaman yang merangkum seluruh poin dari tab 1 sampai tab 9.
    *   Desain kertas digital yang dapat diunduh instan sebagai dokumen **PDF** (*High-Quality PDF Report*) dengan menekan satu tombol berkat integrasi pustaka *jsPDF*.

---

### C. Portal Manajemen Admin
Halaman rahasia panel administrasi (`/admin`) yang digunakan secara khusus oleh tim Pratama MC untuk memantau performa bisnis:
- Dasbor agregat statistik: jumlah klien aktif, total pesanan paket terpopuler, dan status pembayaran termin.
- Manajemen pengelolaan portofolio, daftar harga paket, dan pemantauan ulasan ulasan klien yang layak dipajang di beranda utama.

---

## 🗄️ SKEMA & STRUKTUR DATABASE TERPERINCI (D1 CLOUDFLARE)

Berikut adalah struktur kueri SQL dasar dan kolom-kolom relasional yang dikembangkan di dalam **Cloudflare D1** dan di-seed secara utuh dalam folder `public/cloudflare/database/schema.sql` dan `seed-all.sql`:

### 1. Tabel `klien` (Entitas Utama Informasi Pernikahan)
Menampung seluruh data konfigurasi intim klien pengantin. Acara, Catatan, Tamu, dan Metadata disimpan dalam kolom bertipe TEXT dengan format serialisasi data terstruktur JSON guna meminimalkan kueri join yang berlebihan pada jaringan tepi:

```sql
CREATE TABLE IF NOT EXISTS klien (
    id_klien TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    status INTEGER DEFAULT 1,      -- 1: Aktif, 0: Selesai
    tanggal TEXT,                   -- Format: YYYY-MM-DD
    waktu TEXT,                     -- Format: HH:MM
    alamat TEXT,
    maps TEXT,
    tema TEXT,                      -- Gaya visual dekorasi
    bahasa TEXT,                    -- Bahasa pengantar acara (Indonesia, Sunda, Jawa, Inggris dll.)
    
    -- JSON Data fields (Serialized Storage)
    acara TEXT,                     -- Format JSON Array: Susunan Rundown Menit ke Menit
    catatan TEXT,                   -- Format JSON Array: Naskah Izin / Amanah / Doa Penutup
    tamu TEXT,                      -- Format JSON Array: Tamu VIP / VVIP
    metatag TEXT,                   -- URL tautan gambar kartu preview media sosial
    galeri TEXT                     -- URL Google Drive bersama
);
```

### 2. Tabel `musik` (Katalog Audio Pernikahan)
Menyimpan data bank lagu pengiring pernikahan berhak cipta resmi yang bebas digunakan sebagai referensi klien:

```sql
CREATE TABLE IF NOT EXISTS musik (
    id_lagu TEXT PRIMARY KEY,
    judul TEXT NOT NULL,
    artis TEXT NOT NULL,
    kategori TEXT,                  -- Kirab, Mingle, Penyandingan, Flashmob, dll.
    deskripsi TEXT,                 -- Informasi aransemen lagu
    versi TEXT,                     -- Vokal, Instrumen, Violin, Orkestra
    link TEXT                       -- URL file audio jukehost / CDN hosting resmi (.mp3)
);
```

### 3. Tabel Pendukung Relasional Klien
Berbagai data tabel sekunder yang berelasi erat dengan ID unik klien `id_klien` guna mendata komponen penunjang secara granular:
- `klien_pengantin`: Latar belakang pengantin, media sosial, foto, nama bapak dan ibu.
- `klien_vendor`: Nama vendor, kategori peran, kontak WhatsApp PIC.
- `klien_pendamping`: Daftar nama Bridesmaids & Groomsmen.
- `klien_wo`: Kru penanggung jawab lapangan dari pihak Event Organizer.
- `klien_keluarga`: Nama paman, bibi, saudara kandung yang wajib dihormati MC dari panggung dalam sambutannya.
- `klien_panitia`: Panitia logistik dari lingkungan keluarga terdekat.

---

## ⚡ OPTIMALISASI PERFORMA & FITUR KETANGGUHAN LAPANGAN

Untuk memastikan aplikasi tetap berfungsi maksimal tanpa ada kegagalan teknis di panggung acara (*glitch-free show*), sistem menerapkan taktik optimasi berikut:

1.  **Lazy Loading Component (Suspense Mode):**
    *   Setiap rute halaman dipecah menjadi bagian-bagian berkas JavaScript yang lebih kecil (*dynamic imports / chunking code*).
    *   Ketika pengguna berpindah halaman, React akan memuat halaman tersebut sesuai kebutuhan dengan memunculkan komponen `PageLoader` yang beranimasi halus, menjaga konsumsi memori gawai tetap hemat.
2.  **Pre-compiled Bundled Server (`dist/server.cjs`):**
    *   Server NodeJS Express dibundel menggunakan kompilator **esbuild** menghasilkan berkas tunggal yang mengabaikan kueri pencarian file dinamis pada cakram keras, meningkatkan kecepatan respons server hingga 400%.
3.  **Zero External Image Failures (CORS & Referrer Security):**
    *   Semua penayangan gambar luar telah dilengkapi dengan atribut `referrerPolicy="no-referrer"` pada seluruh tag `<img>`. Ini menjaga agar peramban Chrome, Safari, dan Firefox di gawai tim panggung dapat menampilkan foto portofolio prewedding klien dengan sukses tanpa diblok oleh pengaman server penyimpan file eksternal.

---

## 🚀 PETUNJUK PENGOPERASIAN & ALUR KERJA PENGGUNA

### Langkah untuk Calon Klien Baru:
1.  Mengunjungi beranda utama Pratama MC pada tautan web resmi.
2.  Melihat paket harga layanan yang paling cocok dan melakukan pengecekan tanggal ketersediaan jadwal Pratama MC.
3.  Melakukan pendaftaran akun melalui tim admin. Klien akan mendapatkan halaman personal rahasia mereka (misal: `/mempelai`).

### Langkah Kolaborasi Pengisian Rundown (Klien & WO):
1.  Klien masuk menggunakan kata sandi mereka di portal klien `/mempelai/edit`.
2.  Mengisi tab data pengantin, anggota keluarga penting, daftar vendor yang dikontrak, serta susunan acara di tab Itinerary.
3.  Menambahkan naskah pidato emosional sungkeman pada tab Catatan Khusus.
4.  Menyisipkan tautan folder Google Drive berisi materi visual (foto & video bumper) di tab Google Drive.

### Langkah Eksekusi MC di Hari-H Acara:
1.  Di pagi hari sebelum acara dimulai, MC dan tim WO membuka menu`/mempelai`.
2.  Meninjau data yang sudah di-input klien. Data tersebut secara otomatis disimpan di cache gawai milik MC.
3.  Di panggung, MC dapat melihat rundown real-time secara interaktif lewat ponsel pintar, atau memilih mencetak ringkasan acara ke kertas fisik ukuran A4 dengan menekan tombol **"Unduh PDF / Ekspor Rundown"** di tab Ringkasan.

---

*Hak Cipta Terpelihara © 2026 Pratama MC. Mengutamakan Keanggunan, Keandalan, dan Kenyamanan di Panggung Kebahagiaan Anda.*
