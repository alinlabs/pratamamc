import React, { useState } from 'react';
import { saveKlienAkun } from '../../../lib/api';
import { Check, FolderOpen, Asterisk } from 'lucide-react';

export default function ShareableGDriveForm({ event, onSaved, hideBanner }: { event: any, onSaved: () => void, hideBanner?: boolean }) {
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    drive_url: event.drive_url || '',
    id_klien: event.id_klien,
    username: event.username
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.drive_url.trim()) {
      alert("Tautan Google Drive wajib diisi.");
      return;
    }
    
    setSaving(true);

    try {
      await saveKlienAkun({
        ...event,
        drive_url: formData.drive_url
      });

      setSuccessMsg(`Tautan Google Drive berhasil diperbarui. Terima kasih!`);
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
          <h1 className="text-xl sm:text-3xl font-extrabold text-stone-900 mb-2">Workspace Folder (Google Drive)</h1>
          <p className="text-sm text-stone-500 sm:text-lg px-2 md:px-0">
            Atur tautan Google Drive untuk membagikan file kebutuhan acara Anda (seperti foto prewedding, video, lagu pengiring, dll).
          </p>
        </div>

        <form id="gdrive-form" onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200" onKeyDown={(e) => {
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
             <FolderOpen className="w-5 h-5 text-[#DCAF43]" /> Pengaturan Tautan Google Drive
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-1 flex justify-between items-center"><span>
                URL Google Drive <Asterisk className="w-3 h-3 text-red-500" />
              </span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
              <input
                type="text"
                required
                placeholder="https://drive.google.com/drive/folders/..."
                value={formData.drive_url}
                onChange={(e) => setFormData({ ...formData, drive_url: e.target.value })}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all font-medium"
              />
              <p className="text-xs text-stone-400 mt-2">
                Pastikan pengaturan folder Drive tersebut adalah "Anyone with the link can view/organize" agar tim pengembang dapat mengakses dan mengunduh berkas.
              </p>
            </div>
          </div>
        </form>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-stone-100 z-50 md:relative md:border-t-0 md:bg-transparent md:p-0 md:flex md:justify-end md:pt-4 md:mb-8">
          <button
            type="submit"
            form="gdrive-form"
            disabled={saving || !formData.drive_url.trim()}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#DCAF43] text-white hover:bg-[#c99f35] rounded-xl font-bold shadow-lg active:scale-95 transition-all text-base md:text-lg w-full md:w-auto disabled:opacity-70 disabled:active:scale-100 cursor-pointer"
          >
            {saving ? 'Menyimpan...' : 'Simpan Tautan'}
          </button>
        </div>
      </div>
    </div>
  );
}
