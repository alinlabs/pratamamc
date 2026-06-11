import React, { useState } from 'react';
import { saveKlienCatatan } from '../../../lib/api';
import { Check, Clipboard, Asterisk } from 'lucide-react';

export default function ShareableCatatanForm({ event, onSaved, hideBanner }: { event: any, onSaved: () => void, hideBanner?: boolean }) {
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    judul: '',
    konten: '',
    tipe: 'deskripsi',
    isCustom: true
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul.trim() || !formData.konten.trim()) {
      alert("Judul dan Isi Catatan wajib diisi.");
      return;
    }
    
    setSaving(true);

    try {
      const currentCatatan = event.daftar_catatan || [];
      const newCatatanList = [...currentCatatan, formData];

      await saveKlienCatatan(event.id_klien, newCatatanList);

      setSuccessMsg(`Catatan "${formData.judul}" berhasil disimpan. Terima kasih!`);
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
          <h1 className="text-xl sm:text-3xl font-extrabold text-stone-900 mb-2">Area Catatan Tambahan</h1>
          <p className="text-sm text-stone-500 sm:text-lg px-2 md:px-0">
            Kirimkan informasi pendukung, catatan koordinasi, atau instruksi khusus untuk mendukung acara ({event.username}).
          </p>
        </div>

        <form id="catatan-form" onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200" onKeyDown={(e) => {
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
             <Clipboard className="w-5 h-5 text-[#DCAF43]" /> Formulir Catatan
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-1 flex justify-between items-center"><span>
                Judul Catatan <Asterisk className="w-3 h-3 text-red-500" />
              </span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
              <input
                type="text"
                required
                placeholder="Contoh: Teknis Pengantaran Mas Kawin / Parkir VIP"
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-1 flex justify-between items-center"><span>
                Isi Detail Catatan <Asterisk className="w-3 h-3 text-red-500" />
              </span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
              <textarea
                required
                rows={5}
                placeholder="Tuliskan catatan teknis selengkapnya di sini..."
                value={formData.konten}
                onChange={(e) => setFormData({ ...formData, konten: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all resize-none shadow-sm"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-8 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan Catatan'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
