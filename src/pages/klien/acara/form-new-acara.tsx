import React, { useState } from 'react';
import { saveKlienAcara } from '../../../lib/api';
import { Check, Calendar, Asterisk, List } from 'lucide-react';

export default function ShareableAcaraForm({ event, onSaved, hideBanner, wizardMode, wizardData, onChangeWizard }: { event?: any, onSaved?: () => void, hideBanner?: boolean, wizardMode?: boolean, wizardData?: any, onChangeWizard?: (data: any) => void }) {
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState(wizardData || {
    segmen: '',
    kegiatan: '',
    deskripsi: '',
    catatan: '',
    durasi: '',
    musik: [],
    status: ''
  });

  const handleChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    if (wizardMode && onChangeWizard) {
      onChangeWizard(newData);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wizardMode) return;

    if (!formData.segmen.trim() || !formData.kegiatan.trim()) {
      alert("Segmen dan Kegiatan wajib diisi.");
      return;
    }
    
    setSaving(true);

    try {
      const currentAcara = (event && event.susunan_acara) ? event.susunan_acara : ((event && event.acara) ? event.acara : []);
      
      const toSave = {
         ...formData,
         durasi: formData.durasi ? parseInt(formData.durasi) : 0
      };

      const newAcaraList = [...currentAcara, toSave];

      if (event?.id_klien) {
        await saveKlienAcara(event.id_klien, newAcaraList);
      }

      setSuccessMsg('Data acara berhasil ditambahkan. Terima kasih!');
      setTimeout(() => {
        if (onSaved) onSaved();
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
      </div>
    );
  }

  const FormContent = (
    <div className="space-y-6">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-stone-800">
         <List className="w-5 h-5 text-[#DCAF43]" /> Tambah Susunan Acara
      </h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2 flex justify-between items-center">
              <span>Segmen <Asterisk className="w-3 h-3 text-red-500 inline" /></span>
              <span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span>
            </label>
            <input type="text" required value={formData.segmen} onChange={e => handleChange('segmen', e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:outline-none focus:ring-0" placeholder="Cth: Pembukaan, Persiapan" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2 flex justify-between items-center">
              <span>Kegiatan <Asterisk className="w-3 h-3 text-red-500 inline" /></span>
              <span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span>
            </label>
            <input type="text" required value={formData.kegiatan} onChange={e => handleChange('kegiatan', e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:outline-none focus:ring-0" placeholder="Cth: Penyambutan Calon Besan" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2 flex justify-between items-center">
              <span>Durasi (Menit)</span>
            </label>
            <input type="number" inputMode="numeric" value={formData.durasi} onChange={e => handleChange('durasi', e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:outline-none focus:ring-0" placeholder="Cth: 15" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2 flex justify-between items-center">
              <span>Deskripsi Singkat (Opsional)</span>
            </label>
            <textarea rows={3} value={formData.deskripsi} onChange={e => handleChange('deskripsi', e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:outline-none focus:ring-0 resize-none" placeholder="Jelaskan detail kegiatan..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2 flex justify-between items-center">
              <span>Catatan Khusus (Opsional)</span>
            </label>
            <textarea rows={2} value={formData.catatan} onChange={e => handleChange('catatan', e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:outline-none focus:ring-0 resize-none" placeholder="Cth: Siapkan HT..." />
          </div>
        </div>

        {!wizardMode && (
          <div className="flex justify-end pt-4">
            <button type="button" onClick={handleSave} disabled={saving} className="px-8 py-3 bg-stone-900 text-white font-bold rounded-xl">{saving ? 'Menyimpan...' : 'Simpan Acara'}</button>
          </div>
        )}
      </div>
    </div>
  );

  if (wizardMode) {
    return FormContent;
  }

  return (
    <div className="w-full pb-20 md:pb-0">
      {!hideBanner && (
        <div className="w-full relative aspect-[4/3] md:aspect-[3/1] overflow-hidden bg-stone-900 flex mb-8">
           <img
              src="/gambar/banner/mobile1.webp"
              alt="Hero Banner"
              className="w-full h-full object-cover"
            />
        </div>
      )}

      <div className="w-full max-w-3xl mx-auto space-y-8 px-4 md:px-0">
        <div className="mb-4 text-center md:text-left">
          <h1 className="text-xl sm:text-3xl font-extrabold text-stone-900 mb-2">Area Acara</h1>
          <p className="text-sm text-stone-500 sm:text-lg px-2 md:px-0">
            Tambahkan rangkaian kegiatan baru ke susunan acara Anda.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6" onKeyDown={(e) => {
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
           {FormContent}
        </form>
      </div>
    </div>
  );
}
