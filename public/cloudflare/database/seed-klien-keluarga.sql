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
