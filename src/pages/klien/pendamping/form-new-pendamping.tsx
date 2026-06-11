import React, { useState } from 'react';
import { saveKlienKeluarga } from '../../../lib/api';
import { formatPhoneInput, formatSocialInput } from '../../../lib/inputFormatters';
import { Check, Users, Asterisk } from 'lucide-react';
import ComboBox from '../../../components/input-combobox';

export default function ShareablePendampingForm({ event, onSaved, hideBanner }: { event: any, onSaved: () => void, hideBanner?: boolean }) {
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    peran: '',
    nama: '',
    whatsapp: '',
    instagram: '',
    isCustom: false
  });

  const PERAN_OPTIONS = [
    'Bridesmaid / Pagar Ayu',
    'Groomsman / Pagar Bagus'
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.whatsapp.trim()) {
      alert("Nama dan WhatsApp wajib diisi.");
      return;
    }
    
    setSaving(true);

    try {
      const currentKeluargaInti = event.keluarga_inti || [];
      const currentPanitia = event.panitia_keluarga || [];
      const currentTamu = event.tamu || [];
      const currentPengisiAcara = event.pengisi_acara || [];
      
      const pendampingList = event.pendamping || [];
      const newPendampingList = [...pendampingList, formData];

      await saveKlienKeluarga(event.id_klien, { 
        keluarga_inti: currentKeluargaInti,
        panitia_keluarga: currentPanitia,
        tamu: currentTamu,
        pengisi_acara: currentPengisiAcara,
        pendamping: newPendampingList
      });

      setSuccessMsg(`Data pendamping (${formData.peran}) berhasil disimpan. Terima kasih!`);
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
          <h1 className="text-xl sm:text-3xl font-extrabold text-stone-900 mb-2">Area Pendamping</h1>
          <p className="text-sm text-stone-500 sm:text-lg px-2 md:px-0">
            Terima kasih telah bersedia menjadi bagian dari tim pendamping pengantin ({event.username}). Silakan lengkapi data diri Anda.
          </p>
        </div>

        <form id="pendamping-form" onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200" onKeyDown={(e) => {
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
             <Users className="w-5 h-5 text-[#DCAF43]" /> Formulir Pendamping
          </h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-1 flex justify-between items-center"><span>
                  Sebagai <Asterisk className="w-3 h-3 text-red-500" />
                </span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
                <ComboBox
                  required
                  options={PERAN_OPTIONS.map(p => ({ label: p, value: p }))}
                  value={formData.peran}
                  onChange={(val) => setFormData({ ...formData, peran: val })}
                  placeholder="Ketik atau pilih peran..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-1 flex justify-between items-center"><span>
                  Nama Lengkap <Asterisk className="w-3 h-3 text-red-500" />
                </span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-pink-500 focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2 flex justify-between items-center"><span>WhatsApp / Telepon <Asterisk className="w-3 h-3 text-red-500" /></span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
                <input
                  type="text" inputMode="numeric"
                  required
                  placeholder="08xxxxxxxxxx"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: formatPhoneInput(e.target.value) })}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-pink-500 focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all font-mono"
                />
                <p className="text-xs text-stone-500 mt-1">Nomor ini diperlukan untuk mempermudah koordinasi panggung / acara di lapangan nantinya.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Instagram (Opsional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-sm">@</span>
                  <input
                    type="text"
                    placeholder="username"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: formatSocialInput(e.target.value) })}
                    className="w-full pl-9 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-pink-500 focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-stone-100 z-50 md:relative md:border-t-0 md:bg-transparent md:p-0 md:flex md:justify-end md:pt-4 md:mb-8">
          <button
            type="submit"
            form="pendamping-form"
            disabled={saving || !formData.nama.trim() || !formData.whatsapp.trim() || !formData.peran.trim()}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#DCAF43] text-white hover:bg-[#c99f35] rounded-xl font-bold shadow-lg active:scale-95 transition-all text-base md:text-lg w-full md:w-auto disabled:opacity-70 disabled:active:scale-100"
          >
            {saving ? 'Menyimpan...' : 'Simpan Data'}
          </button>
        </div>
      </div>
    </div>
  );
}
