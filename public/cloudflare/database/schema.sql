-- schema.sql
-- Tabel akan dibuat hanya jika belum ada (tidak ada penghapusan data).
-- Catatan: Untuk menambah atau menghapus kolom, SQLite memerlukan perintah ALTER TABLE secara terpisah
-- atau menggunakan proses migrasi D1, karena CREATE TABLE IF NOT EXISTS tidak akan mengubah struktur tabel yang sudah ada.

-- 1. Edukasi Table
CREATE TABLE IF NOT EXISTS edukasi (
    id TEXT PRIMARY KEY,
    kategori TEXT NOT NULL, -- 'formal', 'adat', 'resepsi'
    judul TEXT NOT NULL,
    deskripsi TEXT NOT NULL,
    gambar TEXT NOT NULL,
    makna TEXT NOT NULL,
    pelaksanaan TEXT NOT NULL,
    video TEXT
);

-- 2. Paket Harga Table
CREATE TABLE IF NOT EXISTS paket (
    id TEXT PRIMARY KEY,
    nama TEXT UNIQUE NOT NULL,
    harga_normal INTEGER,
    harga_promo INTEGER,
    gambar TEXT, -- Saved as JSON string (array of image paths, e.g., '["/gambar/paket/tunangan.webp"]')
    deskripsi TEXT,
    detail TEXT, -- Saved as JSON string (array of feature strings, e.g., '["feature 1", "feature 2"]')
    populer INTEGER DEFAULT 0 -- 0 for false, 1 for true
);

-- 3. Klien Table (Unified Client Data)
CREATE TABLE IF NOT EXISTS klien (
    id_klien TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    status INTEGER DEFAULT 1,
    tanggal TEXT,
    waktu TEXT,
    alamat TEXT,
    maps TEXT,
    tema TEXT,
    bahasa TEXT,
    
    -- JSON Data fields
    acara TEXT,
    catatan TEXT,
    tamu TEXT,
    metatag TEXT,
    galeri TEXT
);

DROP TABLE IF EXISTS klien_vendor;
CREATE TABLE IF NOT EXISTS klien_vendor (
    id_klien TEXT PRIMARY KEY,
    
    makeup TEXT,
    dekorasi TEXT,
    fotografi TEXT,
    videografi TEXT,
    wcc TEXT,
    mc TEXT,
    musik TEXT,
    catering TEXT,
    venue TEXT,
    wo TEXT,
    busana TEXT,
    henna TEXT,
    hantaran TEXT,
    upacara_adat TEXT,
    
    FOREIGN KEY(id_klien) REFERENCES klien(id_klien) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS klien_pendamping (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_klien TEXT NOT NULL,
    peran TEXT,
    nama TEXT,
    whatsapp TEXT,
    instagram TEXT,
    FOREIGN KEY(id_klien) REFERENCES klien(id_klien) ON DELETE CASCADE
);

DROP TABLE IF EXISTS klien_wo;
CREATE TABLE IF NOT EXISTS klien_wo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_klien TEXT NOT NULL,
    vendor TEXT,
    peran TEXT,
    nama TEXT,
    whatsapp TEXT,
    instagram TEXT,
    FOREIGN KEY(id_klien) REFERENCES klien(id_klien) ON DELETE CASCADE
);

DROP TABLE IF EXISTS klien_pengantin;
CREATE TABLE IF NOT EXISTS klien_pengantin (
    id_klien TEXT PRIMARY KEY,
    nama_lengkap_pria TEXT,
    nama_panggilan_pria TEXT,
    anak_ke_pria TEXT,
    whatsapp_pria TEXT,
    instagram_pria TEXT,
    nama_lengkap_wanita TEXT,
    nama_panggilan_wanita TEXT,
    anak_ke_wanita TEXT,
    whatsapp_wanita TEXT,
    instagram_wanita TEXT,
    FOREIGN KEY(id_klien) REFERENCES klien(id_klien) ON DELETE CASCADE
);

DROP TABLE IF EXISTS klien_keluarga;
CREATE TABLE IF NOT EXISTS klien_keluarga (
    id_klien TEXT PRIMARY KEY,
    
    nama_ayah_pria TEXT,
    panggilan_ayah_pria TEXT,
    whatsapp_ayah_pria TEXT,
    
    nama_ibu_pria TEXT,
    panggilan_ibu_pria TEXT,
    whatsapp_ibu_pria TEXT,
    
    nama_ayah_wanita TEXT,
    panggilan_ayah_wanita TEXT,
    whatsapp_ayah_wanita TEXT,
    
    nama_ibu_wanita TEXT,
    panggilan_ibu_wanita TEXT,
    whatsapp_ibu_wanita TEXT,
    
    FOREIGN KEY(id_klien) REFERENCES klien(id_klien) ON DELETE CASCADE
);

DROP TABLE IF EXISTS klien_panitia;
CREATE TABLE IF NOT EXISTS klien_panitia (
    id_klien TEXT PRIMARY KEY,
    koordinator_keluarga_wanita_nama TEXT,
    koordinator_keluarga_wanita_whatsapp TEXT,
    koordinator_keluarga_pria_nama TEXT,
    koordinator_keluarga_pria_whatsapp TEXT,
    pic_bunga_nama TEXT,
    pic_bunga_whatsapp TEXT,
    pic_konsumsi_nama TEXT,
    pic_konsumsi_whatsapp TEXT,
    pic_hantaran_nama TEXT,
    pic_hantaran_whatsapp TEXT,
    pic_doorprize_nama TEXT,
    pic_doorprize_whatsapp TEXT,
    perwakilan_sambutan_pria_nama TEXT,
    perwakilan_sambutan_pria_whatsapp TEXT,
    perwakilan_sambutan_wanita_nama TEXT,
    perwakilan_sambutan_wanita_whatsapp TEXT,
    petugas_kua_nama TEXT,
    petugas_kua_whatsapp TEXT,
    saksi_pihak_pria_nama TEXT,
    saksi_pihak_pria_whatsapp TEXT,
    saksi_pihak_wanita_nama TEXT,
    saksi_pihak_wanita_whatsapp TEXT,
    pembaca_alquran_nama TEXT,
    pembaca_alquran_whatsapp TEXT,
    pembaca_saritilawah_nama TEXT,
    pembaca_saritilawah_whatsapp TEXT,

    FOREIGN KEY(id_klien) REFERENCES klien(id_klien) ON DELETE CASCADE
);

-- 4. Musik Table
DROP TABLE IF EXISTS musik;
CREATE TABLE IF NOT EXISTS musik (
    id TEXT PRIMARY KEY,
    judul TEXT NOT NULL,
    artis TEXT,
    rekomendasi TEXT, -- Saved as JSON string (array of strings, e.g. '["Kirab", "Mingle"]')
    deskripsi TEXT,
    versi TEXT,
    link TEXT
);

-- 10. Pencapaian Table
CREATE TABLE IF NOT EXISTS pencapaian (
    id TEXT PRIMARY KEY,
    judul TEXT NOT NULL,
    tahun TEXT,
    jenis TEXT,
    deskripsi TEXT,
    gambar TEXT,
    detail TEXT
);

-- 11. Pengalaman Table
CREATE TABLE IF NOT EXISTS pengalaman (
    id TEXT PRIMARY KEY,
    judul TEXT NOT NULL,
    gambar TEXT,
    deskripsi TEXT,
    detail TEXT
);

-- 11. Vendor Master Table
CREATE TABLE IF NOT EXISTS vendor (
    id TEXT PRIMARY KEY,
    nama TEXT NOT NULL,
    kategori TEXT,
    logo TEXT,
    deskripsi TEXT,
    whatsapp TEXT,
    tiktok TEXT,
    instagram TEXT,
    facebook TEXT,
    youtube TEXT,
    website TEXT,
    peta TEXT,
    verifikasi BOOLEAN DEFAULT true
);

-- 12. Testimoni Table
CREATE TABLE IF NOT EXISTS testimoni (
    id TEXT PRIMARY KEY,
    id_klien TEXT NOT NULL,
    nama_klien TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5,
    pesan TEXT NOT NULL,
    tanggal DATETIME DEFAULT CURRENT_TIMESTAMP,
    tampilkan BOOLEAN DEFAULT false
);
