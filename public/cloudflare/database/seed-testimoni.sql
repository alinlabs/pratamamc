-- seed-testimoni.sql
-- Seed some examples
INSERT OR REPLACE INTO testimoni (id, id_klien, nama_klien, rating, pesan, tampilkan) VALUES 
('testi-001', 'usr-001', 'Mempelai Pria & Wanita Pertama', 5, 'Layanan sangat memuaskan, tim Pratama MC the best!', true),
('testi-002', 'usr-002', 'Nabilla & Alfi', 5, 'Acara berjalan sangat lancar, terima kasih atas bantuan WO dan seluruh vendor yang terlibat.', true);
