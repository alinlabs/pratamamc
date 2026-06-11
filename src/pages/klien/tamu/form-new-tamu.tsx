import React, { useState } from 'react';
import { saveKlienKeluarga } from '../../../lib/api';
import { Check, Users, Asterisk } from 'lucide-react';

export default function ShareableTamuForm({ event, onSaved, hideBanner }: { event: any, onSaved: () => void, hideBanner?: boolean }) {
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    id: Date.now().toString(),
    nama: '',
    jenis: 'Umum',
    catatan: ''
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim()) {
      alert("Nama wajib diisi.");
      return;
    }
    
    setSaving(true);

    try {
      const currentKeluargaInti = event.keluarga_inti || [];
      const currentPanitia = event.panitia_keluarga || [];
      const currentPendamping = event.pendamping || [];
      const currentPengisiAcara = event.pengisi_acara || [];
      
      const tamuList = event.tamu || [];
      const newTamuList = [...tamuList, formData];

      await saveKlienKeluarga(event.id_klien, { 
        keluarga_inti: currentKeluargaInti,
        panitia_keluarga: currentPanitia,
        tamu: newTamuList,
        pengisi_acara: currentPengisiAcara,
        pendamping: currentPendamping
      });

      setSuccessMsg(`Terima kasih! Data Anda (${formData.nama}) telah berhasil didaftarkan sebagai tamu.`);
      setTimeout(() => {
        onSaved();
      }, 2000);

    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  if (successMsg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <Check className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-stone-800 mb-2 text-center">Berhasil!</h2>
        <p className="text-stone-600 text-center">{successMsg}</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 md:pb-0">
      {/* Full Bleed Banner */}
      {!hideBanner && (
        <div className="w-full relative aspect-[4/3] md:aspect-[3/1] overflow-hidden bg-stone-900 flex mb-8">
          <picture className="w-full h-full flex-shrink-0">
            <source media="(min-width: 768px)" srcSet="/gambar/banner/desktop1.webp" />
            <img
              src="/gambar/banner/mobile1.webp"
              alt="Hero Banner"
              className="w-full h-full object-cover"
            />
          </picture>
        </div>
      )}

      <div className="w-full max-w-3xl mx-auto space-y-8 px-4 md:px-0">
        <div className="mb-4 text-center md:text-left">
          <h1 className="text-xl sm:text-3xl font-extrabold text-stone-900 mb-2">Konfirmasi Kehadiran Tamu</h1>
          <p className="text-sm text-stone-500 sm:text-lg px-2 md:px-0">
            Silakan masukkan nama Anda untuk terdaftar dalam daftar tamu khusus acara pernikahan ({event.username}).
          </p>
        </div>

        <form id="tamu-form" onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200" onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
              e.preventDefault();
              const form = e.target.closest('form');
              if (!form) return;
              const focusableElements = Array.from(form.querySelectorAll('input:not([type="hidden"]), select, textarea, button[type="submit"]'));
              const index = focusableElements.indexOf(e.target);
              if (index > -1 && focusableElements[index + 1]) {
                focusableElements[index + 1].focus();
              }
            }
          }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-stone-800">
             <Users className="w-5 h-5 text-[#DCAF43]" /> Formulir Pendaftaran Tamu
          </h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-1 flex justify-between items-center"><span>
                  Nama Lengkap <Asterisk className="w-3 h-3 text-red-500" />
                </span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rian Hidayat"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-1 flex justify-between items-center"><span>
                  Kategori Tamu <Asterisk className="w-3 h-3 text-red-500" />
                </span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
                <select
                  value={formData.jenis}
                  onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all font-medium"
                >
                  <option value="Umum">Umum</option>
                  <option value="Penting">Penting</option>
                  <option value="VIP">VIP</option>
                  <option value="VVIP">VVIP</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                Catatan Khusus (Opsional)
              </label>
              <textarea
                placeholder="Contoh: Rombongan keluarga 5 orang, atau ucapan selamat..."
                value={formData.catatan}
                onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all font-medium resize-none"
              />
            </div>
          </div>
        </form>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-stone-100 z-50 md:relative md:border-t-0 md:bg-transparent md:p-0 md:flex md:justify-end md:pt-4 md:mb-8">
          <button
            type="submit"
            form="tamu-form"
            disabled={saving || !formData.nama.trim()}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#DCAF43] text-white hover:bg-[#c99f35] rounded-xl font-bold shadow-lg active:scale-95 transition-all text-base md:text-lg w-full md:w-auto disabled:opacity-70 disabled:active:scale-100 cursor-pointer"
          >
            {saving ? 'Menyimpan...' : 'Kirim Kehadiran'}
          </button>
        </div>
      </div>
    </div>
  );
}
