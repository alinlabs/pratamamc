-- Gabungan Semua Schema dan Seed SQL

-- =========================================
-- schema.sql
-- =========================================
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

CREATE TABLE IF NOT EXISTS klien_panitia (
    id_klien TEXT PRIMARY KEY,
    pembaca_quran_nama TEXT,
    pembaca_quran_whatsapp TEXT,
    petugas_kua_nama TEXT,
    petugas_kua_whatsapp TEXT,
    sambutan_pria_nama TEXT,
    sambutan_pria_whatsapp TEXT,
    sambutan_wanita_nama TEXT,
    sambutan_wanita_whatsapp TEXT,
    saksi_pria_nama TEXT,
    saksi_pria_whatsapp TEXT,
    saksi_wanita_nama TEXT,
    saksi_wanita_whatsapp TEXT,
    pic_konsumsi_nama TEXT,
    pic_konsumsi_whatsapp TEXT,
    pic_bunga_nama TEXT,
    pic_bunga_whatsapp TEXT,
    pic_doorprize_nama TEXT,
    pic_doorprize_whatsapp TEXT,
    FOREIGN KEY(id_klien) REFERENCES klien(id_klien) ON DELETE CASCADE
);

-- 4. Musik Table
CREATE TABLE IF NOT EXISTS musik (
    id TEXT PRIMARY KEY,
    judul TEXT NOT NULL,
    artis TEXT,
    rekomendasi TEXT, -- Saved as JSON string (array of strings, e.g. '["Kirab", "Mingle"]')
    deskripsi TEXT,
    versi TEXT -- Saved as JSON string (array of version objects, e.g. '[{"jenis": "Saxophone", "tautan": "..."}]')
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
    versi TEXT,
    link TEXT
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


-- =========================================
-- seed-edukasi.sql
-- =========================================
-- seed-edukasi.sql
INSERT OR REPLACE INTO edukasi (id, kategori, judul, deskripsi, gambar, makna, pelaksanaan, video) VALUES 
('edu-akd-01', 'formal', 'Sambutan Penyerahan & Penerimaan Pengantin', 'Prosesi dialogis pembuka yang mengawali seluruh rangkaian pernikahan. Pihak keluarga calon pengantin pria secara resmi mengutarakan niat baik kedatangan mereka, yaitu untuk menyerahkan putra tercintanya beserta seluruh tanggung jawab lahir batin kepada keluarga wanita. Hal ini kemudian disambut hangat oleh perwakilan keluarga wanita yang menyatakan penerimaan secara tulus, mengesampingkan segala keraguan, dan menyatukan komitmen untuk saling mengikat tali persaudaraan antar dua keluarga besar yang berbeda latar belakang.', '/gambar/edukasi/akad-sambutan.webp', 'Bukan sekadar formalitas, prosesi ini adalah simbolisasi penyerahan tongkat estafet pembinaan kehidupan. Pihak pria memercayakan putranya untuk dibimbing, sedangkan pihak wanita memberikan pintu terbuka yang melambangkan kebesaran hati keluarga dalam menyambut menantu sebagai anak kandung sendiri. Ini memperkokoh pondasi psikologis kedua keluarga sebelum ijab kabul diikrarkan.', '1. Rombongan keluarga pria tiba dan dipersilakan menempati posisi berhadapan dengan keluarga wanita.
2. Juru bicara atau utusan khusus keluarga pria berdiri, memaparkan secara formal maksud dan tujuan agung kedatangan rombongan, memohon izin, serta menyerahkan calon pengantin pria seutuhnya.
3. Juru bicara keluarga wanita membalas dengan pidato penerimaan yang berisi rasa syukur, kesiapan menerima sang pria, serta doa kebaikan untuk acara selanjutnya.
4. Acara ditutup dengan jabat tangan simbolis antara kedua belah pihak sebagai bentuk kesepakatan batin, disusul mengarahkan pengantin ke meja akad.', NULL),

('edu-akd-02', 'formal', 'Pembacaan Ayat Suci Al-Quran', 'Lantunan kalam Ilahi yang dipilih secara khusus (biasanya merujuk pada ayat-ayat pernikahan seperti Ar-Rum ayat 21) sebagai landasan spiritual sebelum memasuki inti acara. Pembacaan ini dilakukan oleh qori atau qoriah dengan tartil, membawa suasana sakral dan hening ke dalam ruangan.', '/gambar/edukasi/akad-baca-quran.webp', 'Sebagai manifestasi ketundukan kepada Sang Pencipta, memohon curahan rahmat, keberkahan, keberlimpahan rezeki, serta ketenangan batin. Ayat yang dilantunkan bertindak sebagai pengingat fundamental bahwa pernikahan adalah ibadah terpanjang yang sangat diagungkan dalam agama.', '1. Pembawa acara mempersilakan qori/qoriah untuk melantunkan ayat suci Al-Quran dan sari tilawah.
2. Calon pengantin, orang tua, wali, dan seluruh hadirin menundukkan pandangan, mendengarkan secara khusyuk dan hening.
3. Ditutup dengan pemaknaan dari sari tilawah yang merefleksikan keagungan ibadah pernikahan.', NULL),

('edu-akd-03', 'formal', 'Amanah Nikah dari Ayah/Wali', 'Momen puncak emosional di mana seorang figur ayah atau wali nikah memberikan wejangan terakhir, mutiara nasihat, dan amanat kehidupan rumah tangga tepat sebelum melangsungkan ijab kabul. Pesan ini seringkali disampaikan dengan suara bergetar karena mengandung memori pengasuhan sejak kecil hingga melepaskan sang anak membangun keluarga baru.', '/gambar/edukasi/akad-amanah.webp', 'Sebagai bentuk pelepasan tanggung jawab moral secara formal dan penyerahan tongkat kepemimpinan. Ayah menyalurkan doa restu, membekali calon suami istri dengan pandangan hidup, ketangguhan mental, serta mengingatkan pentingnya memegang teguh komitmen saat badai rumah tangga menerpa.', '1. Ayah atau wali duduk berhadapan dengan calon pengantin (terutama pengantin pria).
2. Dengan suasana hati yang hening, ayah menatap wajah sang anak dan calon menantu, lalu menyampaikan wejangan kehidupan secara lisan.
3. Pesan diakhiri dengan ikrar penyerahan tanggung jawab perwalian, yang diaminkan oleh saksi dan hadirin yang biasanya ikut merasakan keharuan.', NULL),

('edu-akd-04', 'formal', 'Izin Nikah & Penerimaan', 'Ritual sakral permohonan restu di mana calon pengantin wanita/pria secara langsung memohon ampun atas segala khilaf selama masa pengasuhan, lalu memohon izin untuk dinikahkan dengan pilihan hatinya. Orang tua kemudian merespons dengan memberikan kerelaan penuh, memaafkan segala kesalahan putrinya, dan merestuinya melangkah ke pelaminan.', '/gambar/edukasi/akad-izin-nikah.webp', 'Sebagai wujud bakti tanpa pamrih seorang anak, bentuk kerendahan hati untuk tidak melangkahi ridho orang tua. Ridho Allah SWT bergantung pada ridho orang tua, sehingga restu ini adalah kunci pembuka pintu surga dan kelancaran kehidupan rumah tangga yang akan diarungi.', '1. Calon pengantin wanita (seringkali sudah disandingkan atau masih di ruang tunggu) dengan suara lirih sambil menangis membacakan teks permohonan izin nikah kepada ayah dan ibundanya.
2. Calon pengantin mencium tangan kedua orang tuanya sebagai tanda bakti terdalam.
3. Ayah membaca jawaban atas permohonan tersebut, menyatakan pemberian maaf lahir batin, keikhlasan merestui, serta kesiapan untuk segera menikahkan putrinya dengan calon suami.', NULL),

('edu-akd-05', 'formal', 'Khutbah Nikah', 'Pemaparan syariat dan filosofi pernikahan yang dibawakan oleh penghulu dari KUA atau pemuka agama (ulama). Khutbah ini memuat poin-poin krusial terkait hukum, hak dan kewajiban pasangan suami istri, hingga tata cara menyelesaikan konflik rumah tangga berdasarkan pedoman agama.', '/gambar/edukasi/akad-khutbah-nikah.webp', 'Sebagai bekal ilmu aplikatif dan komprehensif bagi kedua mempelai sebelum sah menjadi suami istri. Khutbah menjadi rem pengingat bahwa pernikahan ditujukan untuk menggapai keluarga yang sakinah (tenang), mawaddah (cinta), dan rahmah (kasih sayang).', '1. Sebelum lafadz ijab kabul dibacakan, penghulu meminta waktu sejenak untuk memaparkan khutbah.
2. Penghulu membacakan rukun dan syarat nikah, dilanjutkan dengan nasihat teknis seputar berumah tangga.
3. Mempelai pria yang tengah menggenggam tangan wali mendengarkan dengan penuh konsentrasi dan afirmasi.', NULL),

('edu-akd-06', 'formal', 'Akad Nikah / Pemberkatan', 'Inilah titik transisi antara hukum haram menjadi halal, janji terberat yang menggetarkan tiang arasy. Ijab (penyerahan dari wali) dan Kabul (penerimaan dari pengantin pria) diikrarkan dengan tegas, lugas, dan sekali napas di hadapan sang pencipta, saksi, dan pemuka agama. Segera setelah saksi meneriakkan kata "Sah!", status keduanya secara legal dan agama berubah menjadi suami istri.', '/gambar/edukasi/akad-ijab-kabul.webp', 'Momentum perjanjian berat (Mitsaqan Ghalidza) yang mengharuskan sang putra mengambil alih seluruh dosa, nafkah, nasib, dan perlindungan atas sang wanita dari pundak ayahnya. Merupakan pengesahan agung yang menyatukan dua insan di mata manusia dan Tuhan.', '1. Penghulu mengecek kembali segala kelengkapan administrasi dan mahar.
2. Wali nikah menggenggam erat tangan kanan pengantin pria (bisa dengan variasi meletakkan jempol saling bertemu).
3. Wali mengucapkan kalimat Ijab (berisi nama mempelai, perwalian, dan besaran mahar).
4. Tanpa jeda, pengantin pria merespons dengan mantap kalimat Kabul.
5. Saksi mengonfirmasi dengan kata "Sah", ditutup dengan doa keberkahan, pembacaan sighat taklik, dan penyerahan mahar serta buku nikah.', NULL),

('edu-adt-01', 'adat', 'Simbolis Seserahan', 'Prosesi pembuka di balik layar atau di panggung akad di mana ibu dari mempelai pria menyerahkan sekotak hantaran (bisa berupa perhiasan, pakaian, atau barang pecah belah) kepada ibu dari mempelai wanita. Hantaran ini merupakan manifestasi dari sanggulung (bekal fisik).', '/gambar/edukasi/adat-seserahan.webp', 'Sebagai penanda kemapanan finansial dan tanda cinta kasih secara material. Seserahan melambangkan kemampuan dan kesiapan calon suami untuk menafkahi istrinya, serta sebagai "tanda mata" pengikat tali persaudaraan antar dua keluarga besar.', '1. Ibu mempelai pria mewakili keluarga membawa satu kotak seserahan utama (seperti seperangkat perhiasan atau alat sholat).
2. Diserahkan dengan penuh kelembutan kepada ibu mempelai wanita sambil tersenyum.
3. Keduanya berfoto mengabadikan momen simbolis ini sebelum hantaran-hantaran lainnya diletakkan ke meja sangjit/seserahan secara estafet.', NULL),

('edu-adt-02', 'adat', 'Siraman', 'Ritual penyucian diri yang sangat mendalam dan penuh filosofi. Calon pengantin mengenakan ronce melati dan kain batik khusus, kemudian dimandikan menggunakan air yang telah dicampur dengan tujuh macam bunga wangi (Kembang Setaman). Biasanya dilakukan sehari sebelum acara akad nikah berlangsung.', '/gambar/edukasi/adat-siraman.webp', 'Siraman berasal dari kata "Siram" yang berarti mandi. Maknanya bukan sekedar membersihkan tubuh fisik, melainkan membersihkan jiwa, mengikis sifat egois, dan menggugurkan sisa-sisa dosa masa lampau. Tujuannya adalah agar pada hari H raga berbau harum dan jiwa putih bersih dari segala aura magis yang negatif.', '1. Calon pengantin memohon doa restu (sungkem) kepada orang tuanya.
2. Pengantin diarahkan duduk di kursi yang telah dihias sedemikian rupa.
3. Sebanyak tujuh atau sembilan orang sesepuh (yang telah memiliki kehidupan rumah tangga harmonis) secara bergantian menyiramkan air suci ke ubun-ubun, pundak, hingga kaki calon pengantin.
4. Diakhiri dengan penyiraman air wudhu oleh ayahanda sebagai bentuk penutupan penyucian.', 'https://www.youtube.com/watch?v=M7FIvfx5J10'),

('edu-adt-03', 'adat', 'Pengalungan Bunga', 'Sebagai gerbang pertama pada hari H upacara pernikahan, kedatangan rombongan mempelai pria dicegat dengan rasa hormat. Ibu dan ayah mempelai wanita menghampiri, lalu ibu mertua mengalungkan sebuah lingkaran bunga melati (ronce) yang segar dan harum di leher calon menantunya.', '/gambar/edukasi/adat-pengalungan-bunga.webp', 'Ronce melati melambangkan keharuman, ketulusan, dan kemurnian. Pengalungan ini adalah bahasa non-verbal dari ibu mertua yang mengisyaratkan bahwa beliau telah sepenuhnya melepaskan sang pria dari identitas lamanya, menariknya masuk ke dalam pelukan identitas keluarga yang baru sepenuh hati.', '1. Mempelai pria dan keluarga berdiri di depan lokasi acara (pintu masuk).
2. Perwakilan tuan rumah datang menjemput, orang tua mempelai wanita maju ke depan.
3. Ibu mempelai wanita mengambil ronce melati di nampan, membentangkannya, lalu mengalungkannya ke leher sang menantu dengan senyuman.
4. Ayah mempelai wanita lalu menggandeng atau merangkul menantunya menuju meja Ijab Kabul.', 'https://www.youtube.com/watch?v=M7FIvfx5J10'),

('edu-adt-04', 'adat', 'Mapag Panganten', 'Prosesi kolosal penyambutan raja dan ratu sehari dalam budaya Sunda. Diarak dengan kemegahan seni teatrikal yang dipimpin oleh tokoh rekaan bernuansa jenaka namun mistis, "Ki Lengser" dan "Ambu". Prosesi ini sangat kaya warna, meriah oleh iringan alat musik tradisional (Gamelan Degung), serta aksi lemah gemulai penari payung.', '/gambar/edukasi/adat-mapag-panganten.webp', 'Prosesi ini merajut harmoni antara nilai penghormatan tinggi kepada pengantin dengan pelestarian budaya lokal. Ki Lengser adalah representasi dari sesepuh atau utusan raja yang turun gunung untuk memberikan restu, mendampingi, serta mengiringi jalan hidup baru kedua mempelai penuh dengan gelak tawa dan wejangan tersembunyi.', '1. Kedua mempelai bersiap di pintu masuk venue sesaat sebelum resepsi dimulai.
2. Gamelan degung bertalu-talu membunyikan nada renggong manis.
3. Lengser maju menari komedi, berinteraksi dengan penonton, lalu menjemput mempelai.
4. Penari merak dan pemegang payung emas memayungi mempelai, menuntun langkah demi langkah dalam irama tarian Sunda yang meditatif menuju takhta pelaminan.', 'https://www.youtube.com/watch?v=M7FIvfx5J10'),

('edu-adt-05', 'adat', 'Sungkeman', 'Sebuah prosesi krusial yang bisa memecah tangis satu ruangan. Kedua pengantin yang baru sah menikah akan secara bergantian merendahkan tubuhnya, bersujud (bersimpuh) di pangkuan kedua orang tua dan mertuanya, sambil memegang lutut dan mencium tangan mereka.', '/gambar/edukasi/adat-sungkeman.webp', 'Merupakan titik lebur keangkuhan manusia. Merepresentasikan bakti tertinggi anak kepada sang penciptanya (melalui orang tua). Permohonan maaf yang dituturkan menjadi sarana untuk melunturkan amarah terpendam atau sisa kekecewaan, memastikan rute perjalanan rumah tangga bersih dari segala "kualat" sekaligus meraup doa mustajab.', '1. Kursi orang tua dan mertua disusun saling berhadapan di depan pelaminan.
2. Mempelai pria bersimpuh di haribaan ayah/ibunya, sedangkan wanita di orang tua pria (atau sebaliknya).
3. Sang anak menundukkan kepala sangat dalam, mengucapkan permohonan maaf dan terima kasih dengan nada berbisik.
4. Orang tua membalas dengan memeluk leher sang anak, mengusap punggung dan kepalanya sambil menitikkan air mata serta membacakan doa.', 'https://www.youtube.com/watch?v=M7FIvfx5J10'),

('edu-adt-06', 'adat', 'Saweran', 'Sesi interaktif dan penuh energi di mana pengantin akan dipayungi, lalu pemandu adat akan menyanyikan "Kidung Sawer" yang penuh pepatah. Di saat bersamaan, potongan uang logam, beras kuning, kunyit beriris tipis, hingga permen, ditaburkan berkali-kali kepada tamu penonton.', '/gambar/edukasi/adat-saweran.webp', 'Beras perlambang sandang pangan dan kemakmuran tiada henti. Uang logam mencerminkan kelimpahan kekayaan finansial. Permen memberi nuansa harmonis dan manisnya kehidupan, sementara kunyit menolak bala. Semuanya ditaburkan agar pengantin senantiasa teringat untuk dermawan kepada sesama tatkala mendulang sukses nantinya.', '1. Sepasang pengantin didudukkan berhimpitan di bawah naungan satu payung kebesaran yang dipegang oleh kerabat.
2. Penyanyi adat melantunkan tembang pantun/kidung berisi filsafat membangun rumah tangga yang kukuh.
3. Orang tua mengambil taburan dari bokor kuningan, lalu melempar-lemparkannya dari atas kepala pengantin ke kerumunan tamu.
4. Terjadi keriuhan gembira ketika tamu anak-anak maupun dewasa berebut mendapat permen dan koin.', 'https://www.youtube.com/watch?v=M7FIvfx5J10'),

('edu-adt-07', 'adat', 'Huap Lingkung', 'Rangkaian prosesi makanan yang berisi filosofi mendalam. Orang tua akan menyuapi kedua pengantin untuk terakhir kalinya, lalu pengantin saling menyuapkan sepiring nasi berisi lauk ayam utuh (bakakak) dan saling memperebutkan ayam tersebut. Yang mendapatkan puing lebih besar, itu yang diyakini membawa rejeki lebih besar, namun pada akhirnya tetap akan dibelah dua untuk pasangannya.', '/gambar/edukasi/adat-huap-lingkung.webp', 'Huap Lingkung (suapan terakhir) bermakna pemutusan tali tanggung jawab orang tua secara resmi dalam memberi makan sang anak. Sedang acara tarik bakakak ayam adalah simulasi manajemen rumah tangga: bahwa sebesar apa pun penghasilan ego yang didapat oleh suami atau istri, semuanya harus disinergikan, saling berbagi, dan dinikmati bersama secara adil dan merata.', '1. Ibunda dan ayahanda memegang sekepal kecil nasi tumpeng kuning, menyuapkannya ke mulut anak dan menantunya bergantian.
2. Pengantin saling menyendokkan nasi kuning ke mulut satu sama lain.
3. Panitia meletakkan ayam panggang utuh (bakakak) di atas meja. MC menghitung aba-aba mundur "3, 2, 1!", lalu masing-masing pengantin menarik paha/sayap ayam secara berlawanan arah hingga ayam tersebut terkoyak.
4. Potongan ayam yang besar kemudian digigit bersama-sama.', 'https://www.youtube.com/watch?v=M7FIvfx5J10'),

('edu-adt-08', 'adat', 'Meleum Harupat', 'Dalam ritual ini, mempelai pria menyalakan tujuh batang lidi daun aren (harupat) ke atas lilin hingga apinya berkobar. Kemudian, lidi yang sedang terbakar dicelupkan ke dalam mangkuk perunggu (bokor) berisi air yang dipegang erat oleh istrinya hingga api tersebut berdesis padam dengan asap mengepul. Setelah padam, lidi tersebut dipatahkan dan dibuang ke tanah.', '/gambar/edukasi/adat-meleum-harupat.webp', 'Tujuh lidi menyimbolkan tujuh hari dalam seminggu, sementara api yang menyala melambangkan tempramen, amarah, ego dan kobaran nafsu maskulin yang panas pada pria. Air yang dipegang istri merepresentasikan kelembutan, keteduhan dan kesabaran seorang ibu rumah tangga. Pematahan lidi bermakna bahwa seluruh bara amarah sang suami harus mampu diredam oleh kesejukan dari sang istri agar kehidupan hancur lebur dapat dihindarkan.', '1. MC memberikan penjelasan maknawi sambil memberikan tujuh lidi (harupat) ke tangan mempelai pria.
2. Mempelai pria membakar ujung lidi pada lentera hingga menyala dengan cukup besar.
3. Mempelai wanita mendekatkan kendi berisikan kembang dan air di bawah api tersebut.
4. Mempelai pria merendam api ke dalam air secara perlahan hingga padam berdesis.
5. Mempelai pria mematahkan seluruh lidi tersebut dengan kedua tangannya dengan kekuatan penuh lalu membuangnya ke wadah buangan.', NULL),

('edu-adt-09', 'adat', 'Mepeus Kendi', 'Segera sesudah ashab dan masalah rumah tangga diredakan melalui simbol harupat, kendi yang menyimpan air tersebut memiliki sisa tugas akhir. Kendi tanah liat itu kemudian dilemparkan secara kuat hingga pecah berantakan berkeping-keping di atas lantai oleh ibunda mempelai wanita (atau oleh kedua mempelai secara bersama-sama).', '/gambar/edukasi/adat-mepeus-kendi.webp', 'Kendi merepresentasikan wadah masa lalu (masa lajang). Memecahkan kendi artinya mendobrak garis batas kelajangan. Pecahnya kendi diakhiri dengan tumpahnya air, yang menyimbolkan air kehidupan akan mengalir deras sehingga memancarkan rezeki keberkahan pada benih-benih harapan yang akan tumbuh di kehidupan mereka. Ini juga sebagai doa agar pasangan tersebut kelak memecahkan kebuntuan hidup.', '1. Ibunda pengantin wanita mengambil kendi air sisa meleum harupat (atau disediakan kendi terpisah khusus).
2. Dengan kesepakatan pandangan dan aba-aba pemandu, ibu/pengantin melepaskan pegangannya atau melempar sedikt keras kendi ke ubin beralaskan alas karpet/papan hingga terdengar bunyi pecah berdenting.
3. Sorak hadirin mengiringi pecahnya kendi yang menandai berakhirnya ego masing-masing.', NULL),

('edu-adt-10', 'adat', 'Nincak Endog', 'Mempelai pria tanpa beralas kaki diminta berdiri di atas sebuah papan kecil yang disediakan satu butir telur mentah utuh. Ia kemudian mendesakkan telapak kakinya hingga telur tersebut remuk. Setelah kakinya bersimbah kuning telur, sang istri yang sudah duduk bersimpuh dan menyiapkan air bunga bergegas membasuh, mencuci, dan mengeringkan kaki suaminya tersebut dengan handuk bersih hingga tak tersisa kotoran sedikit pun.', '/gambar/edukasi/adat-nincak-endog.webp', 'Prosesi ini mengandung pesan kepatuhan dan manajemen rumah tangga yang kuat. Pecahnya telur adalah wujud kemampuan dan tanggung jawab penuh pria sebagai kepala keluarga untuk "memecahkan" keperawanan istri dan memberikan keturunan yang diharap-harapkan. Sedangkan membasuh kaki merepresentasikan rasa taat, bakti, kesetiaan, dan dedikasi penuh sang istri demi meringankan kepenatan sang nahkoda (suami) yang berjuang keras menafkahi keluarga tercinta.', '1. Panitia menyeiapkan nampan beralas khusus, meletakkan telur mentah.
2. Mempelai pria mengarahkan telapak kakinya yang polos menginjak telur perlahan hingga terdengar retak dan isi telur berhamburan ke tapak kaki.
3. Mempelai wanita membungkuk mengambil gayung perak, menyiram kaki suaminya dengan air kembang perlahan.
4. Mempelai wanita mengusap-usap membersihkan tapak kaki laki-laki itu, dilanjutkan melapnya dengan selembar handuk kecil.', NULL),

('edu-rsp-01', 'resepsi', 'Pengantaran & Temu Pengantin', 'Prosesi psikologis yang mendebarkan di mana sang pengantin wanita—yang selama ijab kabul disembunyikan di ruang rias agar tidak bersentuhan pandangan—akhirnya dituntun keluar setelah mahar diserahkan dan kata sah dideklarasikan. Sang suami akan berjalan menuju selasar ruangan, menanti di titik temu, kemudian keduanya perlahan mendekat dan bertatapan untuk pertama kalinya dengan status yang sudah sah.', '/gambar/edukasi/akad-temu-pengantin.webp', 'Momen ini menghancurkan tembok batas kesendirian. Inilah kilas pandang yang secara nyata mengubah seluruh hidup dua anak manusia. Temu ini menebalkan romansa pertemuan dua pihak, dari sekadar ikatan legal-spiritual (saat ucapan ijab) menuju ikatan visual-emosional di depan umum (ketika saling menetapkan pandangan mata dari kejauhan hingga menjadi dekat).', '1. MC memberikan jeda sesudah penandatanganan buku nikah.
2. Diiringi alunan musik pelan (seperti instrumental piano, kecapi, atau seruling), pengantin wanita dituntun perlahan oleh saudari atau pendampingnya.
3. Pengantin pria berdiri tegap di tengah lorong red carpet memandang keajaiban di depannya.
4. Ketika keduanya bertemu, suami memberikan ciuman kening, lalu menggandeng istrinya erat menuju kursi singgasana pelaminan.', 'https://www.youtube.com/watch?v=M7FIvfx5J10'),

('edu-rsp-02', 'resepsi', 'Kirab Pengantin', 'Parade seremonial paling elegan dan bertabur kemewahan dari seluruh tahapan acara. Setelah jeda rias, pengantin berganti pakaian resepsi. Mereka berjalan memasuki ballroom agung bagaikan pasangan pangeran dan putri mahkota. Mereka dikawal barisan panjang para pendamping (bridesmaid, groomsmen, tim pedang pora militer jika dari kalangan aparat, atau cucuk lampah tarian tradisional) membelah ribuan mata yang menatap kagum.', '/gambar/edukasi/resepsi-kirab.webp', 'Kirab merupakan bentuk pengumuman publik (Walimah) yang sah secara defacto bahwa sepasang anak muda ini telah sah memisahkan diri dari ketergantungan orang tua dan memulai sebuah "kerajaan" atau rumah tangganya sendiri. Taburan senyum dan megahnya lagu di sepanjang karpet merah merepresentasikan langkah awal menuju masa depan yang agung, berwibawa, penuh kepercayaan diri, dan kebanggaan dari seluruh saksi yang hadir.', '1. Sebelum kirab dimulai, master of ceremony (MC) memusatkan atensi seluruh audiens, meredupkan lampu ruangan, lalu menghidupkan sirine/musik perkenalan megah.
2. Pintu ballroom menjeblak terbuka. Barisan perintis jalan berjalan paling depan.
3. Kedua mempelai melangkah amat pelan dengan koreografi, senyuman menawan ke sisi kanan dan kiri menyapa sekilas para tamu VIP yang berdiri bertepuk tangan.
4. Orang tua beserta rombongan keluarga besar mengekor tepat satu hingga tiga meter di belakang punggung pengantin menyusuri lorong menuju lantai pelaminan megah.', 'https://www.youtube.com/watch?v=M7FIvfx5J10'),

('edu-rsp-03', 'resepsi', 'Wedding Cutting Cake', 'Momen resepsi modern yang menampilkan sebuah kue pengantin berlapis tinggi (tier cake) dengan dekorasi rumit dan cantik. Dengan menggunakan pedang atau pisau berhiaskan pita mawar, kedua pengantin bergandengan tangan menancapkan pisau dan memotong satu bagian kue kecil hingga ke tumpuan paling dasar. Kadang acara ini ditutup bersulang gelas minuman (wedding toast) dengan menautkan lengan (cross-arm).', '/gambar/edukasi/resepsi-wedding-cake.webp', 'Tingkatan kue pengantin menggambarkan anak tangga perjalanan kehidupan yang semakin ke atas semakin kecil, artinya puncak kebahagiaan hanya bisa diraih melalui tantangan mendaki yang solid. Kerja sama tangan memotong kue dari hulu ke hilir adalah manifesto kekompakan saling menyokong rintangan. Saling menyuapi irisan kue tersebut menceritakan ikrar untuk selalu menyajikan pemikiran/perbuatan "manis" yang menyenangkan kepada satu sama lain seumur hidup.', '1. Lantunan lagu romantis pengiring dinaikkan volumenya. MC mengundang seluruh tamu fokus menatap letak sentral kue pernikahan pada pinggir panggung.
2. Pengantin berjalan ke stan kue, pengantin saling bertatapan dan menyeringai.
3. Pasangan menumpukkan tangan kanannya saling tumpuk memegang gagang pegangan pisau hias. Mereka menghitung mundur bersama dan mengiris kue ke arah bawah dengan perlahan.
4. Keduanya mengambil piring tatakan kecil dan menyuapi secuil kue ke pasangan secara bergantian dan meriah.', 'https://www.youtube.com/watch?v=M7FIvfx5J10'),

('edu-rsp-04', 'resepsi', 'Mingle / Sapa Tamu', 'Sesi interaksi cair dan intim di paruh akhir waktu resepsi. Pengantin yang umumnya terkungkung statis berdiri di pelaminan menyalami ribuan orang dalam banjar teratur, lantas melepaskan kekakuannya dan inisiatif beranjak turun membaur, berkeliling dari meja jamuan makan ke meja lainnya dengan membawa prop (seperti gelas minuman, keranjang sovenir).', '/gambar/edukasi/resepsi-tamu-sapa.webp', 'Mingle meleburkan dimensi jarak batas strata sosial dan kesakralan formal antara raja sehari dengan rakyatnya (undangan). Turunnya pengantin membuktikan rendah hatinya kualitas manusia mereka. Percakapan ini membangun jembatan personal, momen nostalgia berfoto lebih santai dengan pose aneh/lucu bersama sahabat, hingga menghantarkan rasa syukur tak terhingga secara face-to-face ke setiap grup tamu prioritas.', '1. Di sela-sela kepadatan salaman berkurang atau jamuan makan besar telah dirasa dinikmati, MC merilis restu agar pengantin turun panggung.
2. Pengantin ditemani 1-2 staf WO menuju stand food stall tamu kolega bisnis ayah/ibu untuk bersapa obrolan pendek sambil berfoto tanpa antrean kaku.
3. Mereka bergeser menghampiri area sirkel sahabat kuliah, berpelukan renyah, melakukan video reel selfie instan, bersenda gurau bebas, lalu lanjut menyapu lantai ballroom tamu lain.', 'https://www.youtube.com/watch?v=M7FIvfx5J10'),

('edu-rsp-05', 'resepsi', 'Kecupan Pernikahan (Wedding Kiss)', 'Momen epik dan sinematik yang menjadi lambang pamungkas puncak afeksi antara sepasang kekasih modern. Diposisikan di penghujung acara sebelum bubar atau saat first dance, suami mencondongkan tubuh perlahan meraih tengkuk, lalu mendaratkan kecupan intim nan dalam kepada kening atau bibir pengantin wanita secara lembut selama beberapa detik dengan latar estetis yang magis.', '/gambar/edukasi/resepsi-wedding-kiss.webp', 'Kecupan ini menyerukan pesan kepemilikan emosional mutlak yang membanggakan (to seal the deal). Ini memecahkan tensi puluhan tahun asuhan mandiri tanpa disentuh yang kini mencair dalam validasi hakiki sebuah ikatan yang utuh tak ada jarak. Ini mendemonstrasikan letupan keindahan cinta, rasa aman batiniah sang wanita atas sandaran pria kokoh, yang disambut tepuk tangan riuh merayakan "kemenangan".', '1. Pada timing yang disiapkan, MC menahan atensi ruangan, "Ladies and gentleman, let''s secure the love!". Set efek mesin dry-ice mengeluarkan kabut awan rendah di lantai, lampu spot down light menyorot mereka berdua dalam remang-remang romantis.
2. Mempelai pria merangkul pinggang wanita agar mendekat, kemudian mengecup bibir/kening dengan keanggunan durasi lama.
3. Tiba-tiba shower bunga/confetti blast meledak perlahan dari sisi panggung seiring bidik kamera (shutter count) juru foto menangkap potret masterpiece pernikahan terbaik seumur hidup mereka.', NULL),

('edu-rsp-06', 'resepsi', 'Tarian Pernikahan (Wedding Dance)', 'Ritme sinkronisasi raga dan jiwa perdana dari dua insan dengan latar belakang sorot lampu lembut. Diiringi genre lagu yang amat berbekas dalam kenangan histori cinta mereka—entah itu balad melankolis, waltz berayun lambat, hingga rumba bergairah—pasangan ini berdansa memutar, berdekapan, berangkul sambil bertukar dialog tatap mata rahasia satu sama lain, mengisolasi semua kerumitan dunia di luar lingkaran tarian.', '/gambar/edukasi/resepsi-wedding-dance.webp', 'Kunci dari rumah tangga adalah tarian menyeimbangkan pijakan dari gesekan miskomunikasi. Ketika tubuh suami mampu merengkuh harmoni menuntun langkah dan istri merespon putaran dengan rasa aman, ini mendikte kemampuan kohesi kerja sama rumah tangga menghadapi fluktuasi kehidupan. Ini menunjukkan sinkronisitas sempurna dari chemistry cinta kasih mereka kepada peradaban manusia yang menyaksikan (dunia luar).', '1. MC mendudukkan seluruh hadirin di sekeliling lantai dansa bercahaya (led dance floor).
2. "The First Dance as Husband and Wife" diutarakan lewat mikrofon, alunan nada lambat naik daun perlahan.
3. Pengantin berjalan ke center-stage, tangan pria mantap memanggul lingkar pinggang wanitanya, lalu berdansa lembut, melayang dan mengangkat wanitanya berputar melintasi asap. 
4. Sorak kagum penonton menjadi latarnya tanpa memutus konsentrasi sakral keduanya.', NULL),

('edu-rsp-07', 'resepsi', 'Flashmob', 'Pertunjukan meledak ruah energi tak terduga sebagai suntikan adrenalin pelepas tawa meriah bagi penutup hari yang melelahkan. Biasanya bermula tenang bak ada sabotase audio dari sang DJ yang mengganti lagu menjadi hentakan beat ceria (seperti musik K-Pop, RnB, dsb). Kemudian barisan grup pertemanan atau bridesmaid hingga pengantin pria/wanita menyelinap masuk menarikan koreo yang sudah dilatih berhari-hari sebelum resepsi.', '/gambar/edukasi/resepsi-flashmob.webp', 'Bentuk pelepasan depresi yang dirasa pada berminggu-minggu tegangan persiapan acara (wedding jitters). Flashmob mentransformasi resepsi yang tadinya khidmat, formal, kaku bagai simfoni piano menjadi karnaval pesta festival berjiwa muda yang menguras tenaga tapi membahayakan kegembiraan murni yang meluap tak bisa dibendung dari sang punya hajat. Ini melambangkan kebahagiaan sejati nan enerjik untuk disebarluaskan pada hari jadi mereka.', '1. Lampu tiba-tiba disetel kerlap-kerlip atau musik seakan ngadat (prank palsu) sebelum dentum drop bass kencang dihantam dari speaker array.
2. Di saat tamu heran, satu demi satu penari bayangan melompat masuk gelanggang (bisa jadi pengantin sendiri sebagai inisiator dengan melempar jas).
3. Seluruh tamu bersorak ketika formasi tarian barisan depan, belakang mulai selaras mempraktikkan gerakan TikTok / koreografi modern yang jenaka sekaligus lincah memancing tawa pecah tiada henti.', NULL),

('edu-rsp-08', 'resepsi', 'Lempar Bunga Handbouquet', 'Tradisi puncak mitologi resepsi barat yang diadopsi manis dalam semua sirkel milenial. Pengantin berdiri saling merapat membawa buket utama. Di belakang posisi mereka (sejauh kurang lebih 3-5 meter) berjajar serombongan teman/kerabat tamu baik pria maupun wanita dengan status single lajang (belum menikah) yang berteriak-teriak semangat menanti lemparan melekung bagai operan bola dari sang ratu yang dilempar tanpa bisa ia lihat.', '/gambar/edukasi/resepsi-lempar-bunga.webp', 'Kegiatan interaktif bergelimang canda tawa ini diyakini menyalurkan vibrasi magis (aura menular) dari keberuntungan nasib pengantin yang usai menemukan jodohnya pada hari tersebut ke nasib sang calon lajang penangkap bunga. Dalam balutan senda gurau, bunga yang melayang mewakili sepucuk doa kuat agar orang yang paling gesit menggegam bunga itu diberikan rute yang dipermudah dan dilancarkan untuk melangkah segera meminang ke altar pernikahan. Transfer of luck yang menghibur namun syahdu.', '1. Sebelum dilempar, MC menggubah permainan semacam menggiring seluruh muda-mudi berkumpul berdesakan di karpet menanti lemparan.
2. Pengantin memunggungi kumpulan target di area terjauh panggung bawah, mereka bisa berpegangan lalu mengayun buket tersebut berpura-pura melempar di hitungan kesatu (prank kecil dari sang MC).
3. Pada hitungan ketiga final, dengan seluruh sewa tebaran tangan, bunga dicampakkan tinggi ke atas udara membelah ruangan.
4. Tamu lajang berebut dengan gaduh, kadang ada yang melompat, demi menangkap riam melati berbalut pita sutra tersebut diselingi ketawa membahana.', NULL);


-- =========================================
-- seed-harga.sql
-- =========================================
-- seed-harga.sql
INSERT OR REPLACE INTO paket (id, nama, harga_normal, harga_promo, gambar, deskripsi, detail, populer) VALUES 
('pkt-001', 'Tunangan / Lamaran', 1199000, 999000, '/gambar/paket/tunangan.webp', 'Momen lamaran yang hangat dan intim, dipandu oleh MC berpengalaman untuk memastikan setiap prosesi berjalan teratur, penuh makna, dan menyatukan kedua belah pihak keluarga dengan suasana yang cair.', 'Konsultasi rundown acara dan konsep (1x pertemuan), MC memandu acara Inti & Ramah Tamah (Max. 4 Jam), Tim support 1 orang untuk memastikan kelancaran acara, Penyusunan naskah MC personal, hangat, dan interaktif, Pengaturan sesi foto keluarga yang tertib dan efisien, Koordinasi langsung dengan pihak keluarga dan vendor', false),
('pkt-002', 'Wedding Akad / Resepsi Saja', 1499000, 1199000, '/gambar/paket/akad.webp', 'Layanan MC eksklusif yang difokuskan pada salah satu sesi acara (akad saja atau resepsi saja). Sangat direkomendasikan bagi pasangan yang ingin durasi yang efektif namun tetap meninggalkan kesan mendalam dan momen yang tak terlupakan.', 'Konsultasi rundown acara (1x pertemuan), MC memandu acara inti (Max. 3 Jam), Penyusunan naskah MC detail dan terstruktur, Pengarahan acara dan koordinasi dengan vendor terkait pada hari H, Ice breaking ringan untuk membangun suasana (Opsional)', false),
('pkt-003', 'Wedding Akad Dan Resepsi', 2199000, 1799000, '/gambar/paket/akad-resepsi.webp', 'Pilihan favorit pasangan untuk memandu kelancaran akad suci hingga meriahnya resepsi pernikahan. Dengan pengalaman yang kami miliki, setiap momen dari ijab kabul hingga salam penutup resepsi akan dipandu dengan elegan, meriah, dan tak terlupakan.', 'Konsultasi rundown acara dan konsep secara intensif (Maks 2x pertemuan), MC Akad & Resepsi (Max. 8 Jam), Tim support 1 orang untuk kelancaran lapangan, Penyusunan naskah MC standar & interaktif dengan sentuhan personal, Pengaturan sesi foto keluarga dan tamu VVIP yang rapi dan cepat, Briefing keluarga inti dan panitia sebelum acara dimulai, Koordinasi menyeluruh dengan WO dan seluruh vendor pada hari H', true),
('pkt-004', 'Wedding Lengkap (WCC & LO)', 2799000, 2299000, '/gambar/paket/akad-resepsi-wcc.webp', 'Paket all-in-one super lengkap untuk ketenangan pikiran penuh di hari bahagia Anda. Kami mengurus semuanya dari tim pendamping persiapan hingga konten kreator profesional yang mengabadikan sudut-sudut emosional hari Anda.', 'Konsultasi rundown acara dan konsep (Unlimited), MC Akad & Resepsi (Tanpa batas waktu maksimal), Wedding Content Creator khusus mengabadikan momen di balik layar, LO Pengantin (1 orang) khusus mendampingi pengantin full day, Ice breaking & games interaktif (Disesuaikan dengan konsep acara), Teks naskah sangat personal (Love Story, Sumpah Janji, dll.), Pembuatan script dan video teaser dokumentasi MC, Full koordinasi tim H-30 hingga selesainya acara', false),
('pkt-005', 'MC Bisnis / Presentation', 1799000, 1499000, '/gambar/paket/bisnis.webp', 'MC formal dan profesional untuk acara bisnis, seminar, konferensi, atau presentasi produk. Menjaga kredibilitas perusahaan dengan penyampaian yang terstruktur dan elegan.', 'Konsultasi materi, rundown, dan profil audiens (Maks 2x pertemuan), MC memandu sesi bisnis/seminar (Max. 5 Jam), Moderasi sesi Q&A atau diskusi panel, Penyusunan naskah MC formal dan profesional, Penguasaan materi dasar produk/perusahaan, Koordinasi dengan narasumber dan panitia', false),
('pkt-006', 'MC Event (Concert, dll)', 2399000, 1999000, '/gambar/paket/event.webp', 'Layanan MC profesional untuk event skala besar seperti konser musik, festival, atau acara hiburan lainnya. Menghidupkan suasana dan menjaga antusiasme audiens dari awal hingga akhir acara.', 'Konsultasi konsep acara dan rundown (Maks 2x pertemuan), MC memandu event (Max. 6 Jam), Ice breaking dan interaksi aktif dengan audiens, Penyusunan script MC yang energik dan sesuai tema, Koordinasi stage management dan pengisi acara, Tim support 1 orang', false);


-- =========================================
-- seed-musik.sql
-- =========================================
-- seed-musik.sql
INSERT OR REPLACE INTO musik (id, judul, artis, rekomendasi, deskripsi, versi, link) VALUES 
('msc-001-vokal', 'Anugerah Terindah', 'Admesh', 'Kirab', 'Lagu romantis yang sangat cocok untuk mengiringi momen kirab pengantin, menciptakan suasana yang hangat dan penuh cinta.', 'Vokal', 'https://audio.jukehost.co.uk/3IEQQG6llxdqKeppqD7DZlC132A9zY7V.mp3'),
('msc-001-saxophone', 'Anugerah Terindah', 'Admesh', 'Kirab', 'Lagu romantis yang sangat cocok untuk mengiringi momen kirab pengantin, menciptakan suasana yang hangat dan penuh cinta.', 'Saxophone', 'https://audio.jukehost.co.uk/KXJ6bN4ePOBmsxqVmuzJ3QfmR0PelJlf.mp3'),

('msc-002-saxophone', 'Al-I''tiraf', 'Abu Nawas', 'Sungkeman, Pengajian', 'Lantunan syair Abu Nawas yang sangat menyentuh hati. Sangat cocok digunakan untuk momen sungkeman karena maknanya yang mendalam tentang pengakuan dosa dan permohonan ampun, menambah kekhusyukan dan penghayatan saat memohon doa restu kepada orang tua.', 'Saxophone', 'https://audio.jukehost.co.uk/ElNe2POASeeUTGStwMG9uNVXMlivKe26.mp3'),

('msc-004-vokal', 'Sampai Jadi Debu', 'Banda Neira', 'Penyandingan', 'Pengantin wanita keluar dari rumah atau ruang persiapan dengan didampingi oleh orang tua atau perwakilan keluarga, lalu berjalan perlahan menuju tempat akad untuk menghampiri pengantin pria sebagai simbol penyerahan dan awal pertemuan sebelum prosesi pernikahan dimulai.', 'Vokal', 'https://audio.jukehost.co.uk/hw76qpYZfKdTPH1Ha72Cyykn1SPD44Yl.mp3'),
('msc-004-piano', 'Sampai Jadi Debu', 'Banda Neira', 'Penyandingan', 'Pengantin wanita keluar dari rumah atau ruang persiapan dengan didampingi oleh orang tua atau perwakilan keluarga, lalu berjalan perlahan menuju tempat akad untuk menghampiri pengantin pria sebagai simbol penyerahan dan awal pertemuan sebelum prosesi pernikahan dimulai.', 'Piano', 'https://audio.jukehost.co.uk/PuJ2ShCaVz9BMkngtUy2X2ouBwGdg4fl.mp3'),
('msc-004-saxophone', 'Sampai Jadi Debu', 'Banda Neira', 'Penyandingan', 'Pengantin wanita keluar dari rumah atau ruang persiapan dengan didampingi oleh orang tua atau perwakilan keluarga, lalu berjalan perlahan menuju tempat akad untuk menghampiri pengantin pria sebagai simbol penyerahan dan awal pertemuan sebelum prosesi pernikahan dimulai.', 'Saxophone', 'https://audio.jukehost.co.uk/EwudXf1sKcOdxQQsaNnvfhMugGxeiPxF.mp3'),

('msc-005-vokal', 'Beautiful In White', 'Westlife', 'Kirab, Mingle', 'Lagu klasik pernikahan yang indah, sangat cocok untuk mengiringi momen kirab pengantin dan saat berbaur dengan para tamu undangan (mingle).', 'Vokal', 'https://audio.jukehost.co.uk/Qr3vSC8JFTNSy0FU5ePxiDFkvVGnLTPv.mp3'),
('msc-005-piano', 'Beautiful In White', 'Westlife', 'Kirab, Mingle', 'Lagu klasik pernikahan yang indah, sangat cocok untuk mengiringi momen kirab pengantin dan saat berbaur dengan para tamu undangan (mingle).', 'Piano', 'https://audio.jukehost.co.uk/ghfoyQUGumjlqfKcqm5yVCyRLlqmUXcE.mp3'),
('msc-005-violin', 'Beautiful In White', 'Westlife', 'Kirab, Mingle', 'Lagu klasik pernikahan yang indah, sangat cocok untuk mengiringi momen kirab pengantin dan saat berbaur dengan para tamu undangan (mingle).', 'Violin', 'https://audio.jukehost.co.uk/QCva2KpYPyUE4kZFtCWRN2JF2WcRMsHe.mp3'),
('msc-005-saxophone', 'Beautiful In White', 'Westlife', 'Kirab, Mingle', 'Lagu klasik pernikahan yang indah, sangat cocok untuk mengiringi momen kirab pengantin dan saat berbaur dengan para tamu undangan (mingle).', 'Saxophone', 'https://audio.jukehost.co.uk/8myDBfiX9sZjYGHp8IjDCSgzFiZiKmpI.mp3'),

('msc-006-violin', 'Blue', 'Yung Kai', 'Mingle', 'Lagu dengan nuansa santai dan romantis, pas untuk menemani momen mingle bersama para tamu undangan.', 'Violin', 'https://audio.jukehost.co.uk/nitzVv28xdtYpGTk1vitEItO62y9zCDa.mp3'),

('msc-007-vokal', 'Perfect', 'Ed Sheeran', 'Kirab, Mingle', 'Lagu romantis yang sangat populer, cocok untuk mengiringi momen kirab pengantin dan saat berbaur dengan para tamu undangan (mingle).', 'Vokal', 'https://audio.jukehost.co.uk/lyEliGrbIWt4iVMzPaTNQkapTK9mMBGh.mp3'),
('msc-007-piano', 'Perfect', 'Ed Sheeran', 'Kirab, Mingle', 'Lagu romantis yang sangat populer, cocok untuk mengiringi momen kirab pengantin dan saat berbaur dengan para tamu undangan (mingle).', 'Piano', 'https://audio.jukehost.co.uk/AMkVrGitZ7PpZHQtDw2gooj1LPwFgZPo.mp3'),
('msc-007-violin', 'Perfect', 'Ed Sheeran', 'Kirab, Mingle', 'Lagu romantis yang sangat populer, cocok untuk mengiringi momen kirab pengantin dan saat berbaur dengan para tamu undangan (mingle).', 'Violin', 'https://audio.jukehost.co.uk/mCiiCl5916Io0iufYrof4HrgKlPfjQdj.mp3'),
('msc-007-saxophone', 'Perfect', 'Ed Sheeran', 'Kirab, Mingle', 'Lagu romantis yang sangat populer, cocok untuk mengiringi momen kirab pengantin dan saat berbaur dengan para tamu undangan (mingle).', 'Saxophone', 'https://audio.jukehost.co.uk/esGdCwYh7iXwZrHbCEjmL5PY4VVe08sD.mp3'),

('msc-008-saxophone', 'Nothing''s Gonna Change My Love For You', 'George Benson', 'Mingle, Kirab', 'Lagu romantis klasik yang sangat cocok untuk mengiringi momen mingle (berbaur dengan tamu) dan kirab pengantin, menciptakan suasana yang hangat dan penuh cinta.', 'Saxophone', 'https://audio.jukehost.co.uk/sZAcQQaXr0ret20OFJsjBwfP1CeMWqfv.mp3'),

('msc-009-violin', 'Until I Found You', 'Stephen Sanchez', 'Penyandingan, Mingle, Kirab', 'Lagu dengan nuansa romantis yang manis, pas untuk mengiringi momen penyandingan, mingle bersama tamu undangan, maupun saat prosesi kirab pengantin.', 'Violin', 'https://audio.jukehost.co.uk/2kvDiqVaoldNtPG1qrUE2P3yoGV9EIPH.mp3'),

('msc-010-vokal', 'Kawih Saweran 1', 'Sunda', 'Sunda, Saweran', 'Lantunan tradisional Sunda yang khusus digunakan untuk mengiringi prosesi adat saweran, memberikan nuansa sakral dan penuh makna.', 'Vokal', 'https://audio.jukehost.co.uk/yNT9SLEO47fI6PbNgB4OzRwAyRwyofUx.mp3'),

('msc-011-vokal', 'Kawih Saweran 2', 'Sunda', 'Sunda, Saweran', 'Lantunan tradisional Sunda yang khusus digunakan untuk mengiringi prosesi adat saweran, memberikan nuansa sakral dan penuh makna.', 'Vokal', 'https://audio.jukehost.co.uk/htm8DqAtknZFmtsCzPKCv7TyVLi899lo.mp3'),

('msc-012-vokal', 'Sabilulungan Instrumen', 'Sunda', 'Sunda, Prosesi Adat', 'Instrumen tradisional Sunda yang mengalun syahdu, sangat tepat untuk mengiringi berbagai rangkaian prosesi adat pernikahan Sunda.', 'Vokal', 'https://audio.jukehost.co.uk/BF7iKNiQm12sKCoLNVrojz7QKAhs445J.mp3'),

('msc-013-vokal', 'Sancang Sulin', 'Sunda', 'Sunda, Prosesi Adat', 'Instrumen tradisional Sunda yang mengalun syahdu, sangat tepat untuk mengiringi berbagai rangkaian prosesi adat pernikahan Sunda.', 'Vokal', 'https://audio.jukehost.co.uk/7LJzqdI6i6mCTind9RRe2o6PwMhJQ81G.mp3'),

('msc-014-vokal', 'Ayun Ambing Instrument', 'Sunda', 'Sunda, Prosesi Adat', 'Instrumen tradisional Sunda yang mengalun syahdu, sangat tepat untuk mengiringi berbagai rangkaian prosesi adat pernikahan Sunda.', 'Vokal', 'https://audio.jukehost.co.uk/a4zb1q9k4C3Dd0rU8iM4tZTzVSzwqlgv'),

('msc-015-vokal', 'Can''t Help Falling In Love', 'Elvis Presley', 'Mingle, Kirab', 'Lagu romantis klasik yang sangat populer, cocok untuk mengiringi momen kirab pengantin dan saat berbaur dengan para tamu undangan (mingle).', 'Vokal', 'https://audio.jukehost.co.uk/t923ggQAhXz4XS6AKKB8cUtMstVTrrpH.mp3'),
('msc-015-piano', 'Can''t Help Falling In Love', 'Elvis Presley', 'Mingle, Kirab', 'Lagu romantis klasik yang sangat populer, cocok untuk mengiringi momen kirab pengantin dan saat berbaur dengan para tamu undangan (mingle).', 'Piano', 'https://audio.jukehost.co.uk/tmp38Z3AFl2867wkdkHeike5w2r94PhA.mp3'),
('msc-015-violin', 'Can''t Help Falling In Love', 'Elvis Presley', 'Mingle, Kirab', 'Lagu romantis klasik yang sangat populer, cocok untuk mengiringi momen kirab pengantin dan saat berbaur dengan para tamu undangan (mingle).', 'Violin', 'https://audio.jukehost.co.uk/SZ0bm2timryLvqMqDezdp38KNRECk61Q.mp3'),
('msc-015-saxophone', 'Can''t Help Falling In Love', 'Elvis Presley', 'Mingle, Kirab', 'Lagu romantis klasik yang sangat populer, cocok untuk mengiringi momen kirab pengantin dan saat berbaur dengan para tamu undangan (mingle).', 'Saxophone', 'https://audio.jukehost.co.uk/5AZgSg47IcubW0GScu8NEQMumznZzl9D.mp3'),

('msc-016-vokal', 'Janji Suci', 'Yovie & Nuno', 'Mingle, Kirab, Penyandingan', 'Lagu populer yang menceritakan tentang janji setia, cocok untuk momen penyandingan, kirab pengantin, dan saat berbaur dengan para tamu (mingle).', 'Vokal', 'https://audio.jukehost.co.uk/4SOivu20BRd4Yr0G22YfjFmtImeAOFWL.mp3'),
('msc-016-piano', 'Janji Suci', 'Yovie & Nuno', 'Mingle, Kirab, Penyandingan', 'Lagu populer yang menceritakan tentang janji setia, cocok untuk momen penyandingan, kirab pengantin, dan saat berbaur dengan para tamu (mingle).', 'Piano', 'https://audio.jukehost.co.uk/ytvhKlnreNTI68j3QYYrb3kgZErC6jlc.mp3'),
('msc-016-violin', 'Janji Suci', 'Yovie & Nuno', 'Mingle, Kirab, Penyandingan', 'Lagu populer yang menceritakan tentang janji setia, cocok untuk momen penyandingan, kirab pengantin, dan saat berbaur dengan para tamu (mingle).', 'Violin', 'https://audio.jukehost.co.uk/owX3iVheYEFMmPYTB6sgVzf96n7jWLRO.mp3'),
('msc-016-saxophone', 'Janji Suci', 'Yovie & Nuno', 'Mingle, Kirab, Penyandingan', 'Lagu populer yang menceritakan tentang janji setia, cocok untuk momen penyandingan, kirab pengantin, dan saat berbaur dengan para tamu (mingle).', 'Saxophone', 'https://audio.jukehost.co.uk/UoZIhEFZ32z1WkqbBaURhS3FqwR4GVZF.mp3'),

('msc-017-vokal', 'DJ Maumere X Fa Mi Re', 'Unknown', 'Mingle, Flashmob', 'Lagu dengan irama yang ceria dan asyik untuk berjoget, sangat cocok untuk momen flashmob atau saat mingle yang santai dan menyenangkan.', 'Vokal', 'https://audio.jukehost.co.uk/DoivQJtYByS1lqm6jPPO77RuA0hbCkZF.mp3'),

('msc-018-vokal', 'DJ Tia Monika x Clbk x Wutwut x Lampu kaka', 'Unknown', 'Mingle, Flashmob', 'Lagu dengan irama yang ceria dan asyik untuk berjoget, sangat cocok untuk momen flashmob atau saat mingle yang santai dan menyenangkan.', 'Vokal', 'https://audio.jukehost.co.uk/QnKva0myKm4vsI0ebmrR0M5QRWmHVGIO.mp3'),

('msc-019-vokal', 'DJ Tor monitor ketua x Tabola bale x Ngapain repot', 'Unknown', 'Mingle, Flashmob', 'Lagu dengan irama yang ceria dan asyik untuk berjoget, sangat cocok untuk momen flashmob atau saat mingle yang santai dan menyenangkan.', 'Vokal', 'https://audio.jukehost.co.uk/eaF1ggxfYjkDPF6yOWZCbs0b9EbNGHa1.mp3'),

('msc-020-vokal', 'Cinta Sejati', 'Bunga Citra Lestari', 'Kirab, Mingle, Penyandingan', 'Lagu romantis yang mendalam tentang cinta sejati, sangat cocok untuk mengiringi berbagai momen sakral dan romantis dalam pernikahan.', 'Vokal', 'https://audio.jukehost.co.uk/HEcXu0NXROmBGnRMPeO5nrkPCqgd1Gh5.mp3'),
('msc-020-violin', 'Cinta Sejati', 'Bunga Citra Lestari', 'Kirab, Mingle, Penyandingan', 'Lagu romantis yang mendalam tentang cinta sejati, sangat cocok untuk mengiringi berbagai momen sakral dan romantis dalam pernikahan.', 'Violin', 'https://audio.jukehost.co.uk/KqWRCUH3x6kJs9kfeCividijOJyvrLAp.mp3'),
('msc-020-saxophone', 'Cinta Sejati', 'Bunga Citra Lestari', 'Kirab, Mingle, Penyandingan', 'Lagu romantis yang mendalam tentang cinta sejati, sangat cocok untuk mengiringi berbagai momen sakral dan romantis dalam pernikahan.', 'Saxophone', 'https://audio.jukehost.co.uk/ZkAFyaXCqjwLPHQTRNxFKTO6h8J5Fgoh.mp3'),

('msc-021-vokal', 'Ketika Cinta Bertasbih', 'Melly Goeslaw', 'Kirab, Mingle, Penyandingan', 'Lagu bernuansa religius yang indah, cocok untuk pernikahan dengan konsep islami, mengiringi momen kirab atau penyandingan.', 'Vokal', 'https://audio.jukehost.co.uk/ayWl5HL5qjD1KSS9yBnqnT11rF9wgluX.mp3'),
('msc-021-violin', 'Ketika Cinta Bertasbih', 'Melly Goeslaw', 'Kirab, Mingle, Penyandingan', 'Lagu bernuansa religius yang indah, cocok untuk pernikahan dengan konsep islami, mengiringi momen kirab atau penyandingan.', 'Violin', 'https://audio.jukehost.co.uk/qgJfXN4oMfok6dmHEebHdB6qr4sdAj47.mp3'),
('msc-021-saxophone', 'Ketika Cinta Bertasbih', 'Melly Goeslaw', 'Kirab, Mingle, Penyandingan', 'Lagu bernuansa religius yang indah, cocok untuk pernikahan dengan konsep islami, mengiringi momen kirab atau penyandingan.', 'Saxophone', 'https://audio.jukehost.co.uk/nRkQaREsTsQe10R6nSNrRTclAopUxxu2.mp3'),

('msc-022-vokal', 'Ayat Ayat Cinta', 'Rossa', 'Kirab, Mingle, Penyandingan', 'Lagu romantis bernuansa islami yang sangat populer, pas untuk mengiringi momen-momen penuh haru dan bahagia di hari pernikahan.', 'Vokal', 'https://audio.jukehost.co.uk/IabolzcDilHvAkW9GukZK0cHjSe3fQ1U.mp3'),
('msc-022-orkestra', 'Ayat Ayat Cinta', 'Rossa', 'Kirab, Mingle, Penyandingan', 'Lagu romantis bernuansa islami yang sangat populer, pas untuk mengiringi momen-momen penuh haru dan bahagia di hari pernikahan.', 'Orkestra', 'https://audio.jukehost.co.uk/zxzB5xxs4SMv2zaceTT8T6xqDkboHTIJ.mp3'),
('msc-022-violin', 'Ayat Ayat Cinta', 'Rossa', 'Kirab, Mingle, Penyandingan', 'Lagu romantis bernuansa islami yang sangat populer, pas untuk mengiringi momen-momen penuh haru dan bahagia di hari pernikahan.', 'Violin', 'https://audio.jukehost.co.uk/whJidWnCfu6xJX5qq3yAifMwfDQ1Bdu4.mp3'),
('msc-023', 'Flashmob Remix', 'Remix', 'Mingle, Flashmob', 'Gabungan lagu gerong, mojang priangan, domba kuring & kicau mania', 'Vokal', 'https://audio.jukehost.co.uk/019eb4d7-abbf-70af-96b4-cc9ae06b860e');

-- =========================================
-- seed-pencapaian.sql
-- =========================================
-- seed-pencapaian.sql
INSERT OR REPLACE INTO pencapaian (id, judul, tahun, jenis, deskripsi, gambar, detail) VALUES 
('acv-001', 'Top 10 Master Of Ceremony Jawa Barat', '2024', 'Penghargaan', 'Meraih posisi 10 besar MC terbaik tingkat provinsi Jawa Barat dalam ajang bergengsi tahunan.', '/gambar/pencapaian/1a.jpg,/gambar/pencapaian/1b.jpg', 'Acara ini diikuti oleh lebih dari 500 MC profesional dari seluruh Jawa Barat dan dinilai oleh juri ternama.'),
('acv-002', '1st Winner Lomba Master of Ceremony STIE Gici', '2023', 'Kompetisi', 'Juara pertama kompetisi pembawa acara kampus tingkat nasional yang diselenggarakan oleh STIE Gici.', '/gambar/pencapaian/2.jpg', 'Menyisihkan 150 peserta dari berbagai perguruan tinggi di Indonesia.'),
('acv-003', 'Best Public Speaker Event Organizer Camp', '2022', 'Penghargaan', 'Diakui sebagai pembicara terfavorit dalam pelatihan dan sertifikasi event organizer tingkat regional.', '/gambar/pencapaian/3.jpg', 'Meraih voting tertinggi dari seluruh peserta dan mentor pelatihan.'),
('acv-004', 'Moderator Seminar Keorganisasian Indonesia', '2023', 'Moderator', 'Menjadi moderator Seminar Keorganisasian Indonesia di Purwakarta yang mempertemukan dan mengundang seluruh elemen organisasi mahasiswa.', '/gambar/pencapaian/4.jpg', 'Diselenggarakan secara nasional dengan ratusan perwakilan dari perguruan tinggi.'),
('acv-005', 'Moderator Seminar Kementerian Keuangan', '2023', 'Moderator', 'Menjadi moderator dalam Seminar Kementerian Keuangan yang bertempat di Purwakarta bersama KPKNL (Kantor Pelayanan Kekayaan Negara dan Lelang) serta Direktorat Jenderal Pajak.', '/gambar/pencapaian/5.jpg', 'Menjadi penjembatan dialog interaktif antara peserta dan pejabat kementerian.'),
('acv-006', 'Presentator Bisnis New Brand PT Perdana Jatiputra', '2024', 'Presentasi Bisnis', 'Dipercaya sebagai presentator bisnis untuk peluncuran New Brand dari PT Perdana Jatiputra.', '/gambar/pencapaian/6.jpg', 'Acara dihadiri oleh direksi, mitra bisnis, dan ratusan investor potensial.');


-- =========================================
-- seed-pengalaman.sql
-- =========================================
-- seed-pengalaman.sql
INSERT OR REPLACE INTO pengalaman (id, judul, gambar, deskripsi, detail) VALUES 
('exp-001', 'Host & MC Wedding - Lebih dari 150+ Event', '/gambar/pengalaman/wed1.jpg,/gambar/pengalaman/wed2.jpg', 'Memandu lebih dari 150 resepsi pernikahan baik berkonsep tradisional, nasional, maupun internasional.', 'Menjadi ujung tombak suasana pada momen spesial, memandu interaksi, hiburan, hingga acara formal agar berjalan lancar.'),
('exp-002', 'Corporate Gathering PT KAI', '/gambar/pengalaman/corp1.jpg,/gambar/pengalaman/corp2.jpg', 'Memandu acara corporate gathering PT Kereta Api Indonesia (Persero) yang dihadiri jajaran direksi dan ratusan pegawai.', 'Membangun antusiasme peserta, memandu games interaktif, dan mengatur rundown skala besar dengan presisi.'),
('exp-003', 'Festival Musik dan Budaya Jawa Barat', '/gambar/pengalaman/fest1.jpg', 'Menjadi MC utama dalam festival musik dan kebudayaan bergengsi tingkat provinsi di lapangan terbuka dengan ribuan penonton.', 'Berhasil mempertahankan energi crowd (penonton) selama acara berlangsung, memastikan band-band lokal maupun nasional tampil sesuai jadwal.');


-- =========================================
-- seed-vendor.sql
-- =========================================
-- seed-vendor.sql
-- Insert Vendors
INSERT OR REPLACE INTO vendor (id, nama, kategori, logo, deskripsi, whatsapp, tiktok, instagram, facebook, youtube, website, peta, verifikasi) VALUES 
('vdr-0001', 'Kencana Visuals', 'Fotografi', 'https://placehold.co/200x200/D4A73C/FFF?text=K', 'Menangkap setiap momen bahagia Anda dengan sentuhan estetik dan pewarnaan cinematic yang hangat.', '6281234567890', '-', 'kencanavisuals', 'https://facebook.com/kencanavisuals', 'kencanavisuals', 'https://kencanavisuals.com', 'https://maps.google.com/?q=Kencana+Visuals', true),

('vdr-0002', 'Aura Beauty MUA', 'Makeup', 'https://placehold.co/200x200/D9AB40/FFFFFF?text=A', 'Riasan flawless dan tahan lama untuk hari spesial, memancarkan kecantikan alami setiap pengantin.', '6282345678901', 'aurabeautytiktok', 'aurabeauty.mua', '-', '-', 'https://aurabeautymua.com', '-', true),

('vdr-0003', 'Nusantara Dekor', 'Dekorasi', 'https://placehold.co/200x200/D9AB40/FFFFFF?text=N', 'Mewujudkan konsep pernikahan impian dengan dekorasi elegan, dari tradisional hingga modern rustic.', '6283456789012', 'nusantaradekortiktok', 'nusantaradekor', 'https://facebook.com/nusantaradekor', '-', 'https://nusantaradekor.id', 'https://maps.google.com/?q=Nusantara+Dekor', true),

('vdr-0004', 'Rasa Cipta Catering', 'Catering', 'https://placehold.co/200x200/D9AB40/FFFFFF?text=R', 'Menyajikan hidangan premium dengan cita rasa autentik yang memanjakan lidah para tamu undangan Anda.', '6284567890123', '-', 'rasacipta.catering', '-', 'rasaciptacatering', 'https://rasaciptacatering.com', 'https://maps.google.com/?q=Rasa+Cipta+Catering', true),

('vdr-0005', 'Harmoni Akustik', 'Musik', 'https://placehold.co/200x200/D9AB40/FFFFFF?text=H', 'Alunan musik syahdu dan romantis untuk menemani setiap prosesi suci dan resepsi pernikahan Anda.', '6285678901234', '-', 'harmoni.akustik', 'https://facebook.com/harmoniakustik', 'harmoniakustik', 'https://harmoniakustik.net', '-', true),

('vdr-0006', 'Mahligai Organizer', 'Wedding Organizer', 'https://placehold.co/200x200/D9AB40/FFFFFF?text=M', 'Tim profesional yang siap membantu merencanakan, mengatur, dan mengeksekusi pernikahan sempurna Anda tanpa stres.', '6286789012345', 'mahligaiwo.tiktok', 'mahligai.wo', '-', '-', 'https://mahligaiorganizer.id', 'https://maps.google.com/?q=Mahligai+Organizer', true),

('vdr-0007', 'Lensa Kita', 'Videografi', 'https://placehold.co/200x200/D9AB40/FFFFFF?text=L', 'Berfokus pada candid momen yang tulus, memastikan setiap tawa dan air mata bahagia terekam abadi.', '6287890123456', '-', 'lensakita.id', 'https://facebook.com/lensakita.id', 'lensakita', 'https://lensakita.com', 'https://maps.google.com/?q=Lensa+Kita', true),

('vdr-0008', 'Flawless By Riri', 'Makeup', 'https://placehold.co/200x200/D9AB40/FFFFFF?text=F', 'MUA profesional bersertifikat, spesialis riasan tradisional pakem maupun tren modern glam.', '6288901234567', '-', 'flawlessbyriri', '-', '-', 'https://flawlessbyriri.id', '-', true),

('vdr-0009', 'Trendset Wedding', 'Wedding Content Creator', 'https://placehold.co/200x200/D9AB40/FFFFFF?text=T', 'Mengabadikan setiap momen behind-the-scene pernikahanmu secara real-time untuk kebutuhan sosial media (TikTok/Reels).', '6289012345678', 'trendsetweddingtiktok', 'trendsetwedding.cc', '-', 'trendsetwedding', 'https://trendsetwedding.com', '-', true);


-- =========================================
-- seed-testimoni.sql
-- =========================================
-- seed-testimoni.sql
-- Seed some examples
INSERT OR REPLACE INTO testimoni (id, id_klien, nama_klien, rating, pesan, tampilkan) VALUES 
('testi-001', 'usr-001', 'Mempelai Pria & Wanita Pertama', 5, 'Layanan sangat memuaskan, tim Pratama MC the best!', true),
('testi-002', 'usr-002', 'Nabilla & Alfi', 5, 'Acara berjalan sangat lancar, terima kasih atas bantuan WO dan seluruh vendor yang terlibat.', true);


-- =========================================
-- seed-klien.sql
-- =========================================
DELETE FROM klien;
DELETE FROM klien_pendamping;
DELETE FROM klien_pengantin;
DELETE FROM klien_keluarga;
DELETE FROM klien_panitia;
DELETE FROM klien_vendor;

INSERT INTO klien (id_klien, username, status, tanggal, waktu, alamat, maps, tema, bahasa, acara, catatan, tamu, metatag, galeri) VALUES
('usr-001', 'mempelai', 1, '2026-10-10', '08:00', 'Gedung Pernikahan Jaya, Jakarta', 'https://maps.google.com', 'Classic White', 'Indonesia, Inggris', '[{"id":"1", "nama":"Akad Nikah", "waktu":"08:00", "deskripsi":"Prosesi Akad"}, {"id":"2", "nama":"Resepsi", "waktu":"11:00", "deskripsi":"Acara resepsi"}]', '[{"judul":"Teks Izin Nikah (Mempelai Wanita kepada Orang Tua)","konten":"Bismillahirrohmanirrohim...\n\nBapak dan Ibu yang saya cintai dan hormati,\n\nPada hari yang berbahagia ini, saya memohon maaf atas segala kesalahan dan kekhilafan yang pernah saya lakukan selama ini, baik yang disengaja maupun yang tidak disengaja.\n\nSaya memohon doa restu Bapak dan Ibu, mohon kiranya Bapak dan Ibu berkenan menikahkan saya dengan pria pilihan saya, (Sebutkan Nama Mempelai Pria), dengan mas kawin (Sebutkan Mas Kawin) dibayar tunai/ngutang.\n\nSemoga pernikahan kami senantiasa mendapat ridho dan barokah dari Allah SWT, serta kami dapat membangun keluarga yang sakinah, mawaddah, dan warahmah. Amin Ya Rabbal ''Alamin.","tipe":"deskripsi"},{"judul":"Teks Amanah dari Ayah (Untuk Mempelai Pria/Anak Perempuan)","konten":"Bismillah...\n\nAnakku tersayang, hari ini adalah hari yang bersejarah bagimu dan keluarga besar kita. Ayah dan Ibu ridho dan ikhlas melepasmu untuk mengarungi bahtera rumah tangga bersama suami pilihanmu.\n\nPesan Ayah, jadilah istri yang sholehah, berbaktilah kepada suamimu, serta selalu sabar dan bersyukur dalam menghadapi segala keadaan. Jaga nama baik dirimu, keluargamu, dan mertuamu.\n\nDoa Ayah dan Ibu akan senantiasa menyertaimu. Semoga rumah tanggamu kelak sakinah, mawaddah, dan warahmah, dilimpahkan rezeki yang berkah, dan dikaruniai keturunan yang sholeh dan sholehah. Amin.","tipe":"deskripsi"},{"judul":"Doa Penutup Acara Pernikahan","konten":"Ya Allah, Ya Tuhan kami, berkatilah pernikahan ini dengan limpahan rahmat dan kasih sayang-Mu.\n\nJadikanlah keluarga ini keluarga yang Engkau cintai, penuh dengan kedamaian, ketentraman, dan kebahagiaan.\nJauhkanlah keluarga ini dari segala mara bahaya, fitnah, dan cobaan yang memberatkan.\n\nKaruniakanlah kepada mereka keturunan yang mengikut jejak para Nabi dan Rasul, serta berikan keselamatan dan keberkahan di dunia dan akhirat. Amin Ya Rabbal ''Alamin.","tipe":"deskripsi"}]', '[{"id":"1", "nama":"Budi", "jenis":"VIP", "catatan":"Selamat menempuh hidup baru"}, {"id":"2", "nama":"Andi", "jenis":"VVIP", "catatan":"Duduk di meja depan"}]', 'https://pratamamc.my.id/gambar/source/metatag.png', 'https://drive.google.com/drive/folders/1w5S_E_L-bJb18k8V1f5mU5-mK6Cq8j-p?usp=sharing');





-- =========================================
-- seed-klien-pengantin.sql
-- =========================================
DELETE FROM klien_pengantin;

INSERT INTO klien_pengantin (id_klien, nama_lengkap_pria, nama_panggilan_pria, anak_ke_pria, whatsapp_pria, instagram_pria, nama_lengkap_wanita, nama_panggilan_wanita, anak_ke_wanita, whatsapp_wanita, instagram_wanita) VALUES
('usr-001', 'Reza Pratama', 'Reza', '1', '081234567800', '@reza_p', 'Nabila Maharani', 'Nabila', '2', '081234567801', '@nabila_m');


-- =========================================
-- seed-klien-keluarga.sql
-- =========================================
DELETE FROM klien_keluarga;

INSERT INTO klien_keluarga (
    id_klien, 
    nama_ayah_pria, panggilan_ayah_pria, whatsapp_ayah_pria,
    nama_ibu_pria, panggilan_ibu_pria, whatsapp_ibu_pria,
    nama_ayah_wanita, panggilan_ayah_wanita, whatsapp_ayah_wanita,
    nama_ibu_wanita, panggilan_ibu_wanita, whatsapp_ibu_wanita
) VALUES (
    'usr-001', 
    'Budiman Pratama', 'Bapak Budi', '081234567802',
    'Siti Aminah', 'Ibu Siti', '081234567803',
    'Suroso Maharani', 'Bapak Suro', '081234567804',
    'Darmi Lestari', 'Ibu Darmi', '081234567805'
);


-- =========================================
-- seed-klien-panitia.sql
-- =========================================
DELETE FROM klien_panitia;

INSERT INTO klien_panitia (
    id_klien,
    koordinator_keluarga_wanita_nama, koordinator_keluarga_wanita_whatsapp,
    koordinator_keluarga_pria_nama, koordinator_keluarga_pria_whatsapp,
    pic_bunga_nama, pic_bunga_whatsapp,
    pic_konsumsi_nama, pic_konsumsi_whatsapp,
    pic_hantaran_nama, pic_hantaran_whatsapp,
    pic_doorprize_nama, pic_doorprize_whatsapp,
    perwakilan_sambutan_pria_nama, perwakilan_sambutan_pria_whatsapp,
    perwakilan_sambutan_wanita_nama, perwakilan_sambutan_wanita_whatsapp,
    petugas_kua_nama, petugas_kua_whatsapp,
    saksi_pihak_pria_nama, saksi_pihak_pria_whatsapp,
    saksi_pihak_wanita_nama, saksi_pihak_wanita_whatsapp,
    pembaca_alquran_nama, pembaca_alquran_whatsapp,
    pembaca_saritilawah_nama, pembaca_saritilawah_whatsapp
) VALUES (
    'usr-001',
    'Tante Anna', '081234567820',
    'Om Budi', '081234567821',
    'Dina', '081234567817',
    'Cici', '081234567816',
    'Fika', '081234567819',
    'Eko', '081234567818',
    'Haji Syafik', '081234567812',
    'Haji Udin', '081234567813',
    'Bapak Penghulu', '081234567811',
    'Dodi', '081234567814',
    'Anton', '081234567815',
    'Ahmad', '081234567810',
    'Budi', '081234567822'
);



-- =========================================
-- seed-klien-pendamping.sql
-- =========================================
DELETE FROM klien_pendamping;

INSERT INTO klien_pendamping (id_klien, peran, nama, whatsapp, instagram) VALUES
('usr-001', 'Bridesmaid / Pagar Ayu', 'Anya', '081234567820', '@anya'),
('usr-001', 'Groomsman / Pagar Bagus', 'Budi', '081234567821', '@budi');


-- =========================================
-- seed-klien-wo.sql
-- =========================================
-- seed-klien-wo.sql
DELETE FROM klien_wo;

INSERT INTO klien_wo (id_klien, vendor, peran, nama, whatsapp, instagram) VALUES
('usr-001', 'vdr-0013', 'Project Officer', 'Budi', '628123456780', 'budipo'),
('usr-001', 'vdr-0013', 'Stage Manager', 'Siti', '628123456781', 'sitism');


-- =========================================
-- seed-klien-vendor.sql
-- =========================================
DELETE FROM klien_vendor;

INSERT INTO klien_vendor (
    id_klien,
    makeup,
    dekorasi,
    fotografi,
    videografi,
    wcc,
    mc,
    musik,
    catering,
    venue,
    wo,
    busana,
    henna,
    upacara_adat
) VALUES (
    'usr-001',
    'vdr-0001',
    'vdr-0002',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'vdr-0006',
    NULL,
    NULL,
    NULL
);


