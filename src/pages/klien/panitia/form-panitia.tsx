import React, { useState } from 'react';
import { Users, Trash2, Plus, ClipboardList, Sparkles, Mic } from 'lucide-react';
import { formatPhoneInput, formatSocialInput } from '../../../lib/inputFormatters';
import FormLayout from '../components/layout-form';

export const DEFAULT_PANITIA_ROLES = [
  "Koordinator Keluarga Wanita",
  "Koordinator Keluarga Pria",
  "PIC Bunga",
  "Perwakilan Sambutan Pria",
  "Perwakilan Sambutan Wanita",
  "Petugas KUA",
  "Pembaca Al-Quran",
  "Saksi Pihak Pria",
  "Saksi Pihak Wanita",
  "Pembaca Saritilawah",
  "PIC Konsumsi",
  "PIC Hantaran",
  "PIC Doorprize"
];

/* ==========================================
   PANITIA TAB (Combined)
   ========================================== */
interface PanitiaTabProps {
  formData: any;
  handleArrayChange: (arrayName: string, index: number, field: string, value: string) => void;
  handleRemoveArrayItem: (arrayName: string, index: number) => void;
  handleAddArrayItem: (arrayName: string, newItem: any) => void;
}

export function PanitiaTab({ formData, handleArrayChange, handleRemoveArrayItem, handleAddArrayItem }: PanitiaTabProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {!formData.panitia_keluarga || formData.panitia_keluarga.length === 0 ? (
        <div className="text-center py-10 px-4 bg-white border border-dashed border-stone-200 rounded-2xl">
          <Users className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-stone-700">Belum Ada Kepanitiaan</h4>
          <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1 mb-3">Tentukan daftar panitia atau pengisi acara untuk mendukung kelancaran.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {formData.panitia_keluarga.map((item: any, idx: number) => (
            <div key={idx} className="relative bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-[#DCAF43]/30 rounded-2xl p-5 sm:p-6 space-y-4 transition-all group overflow-hidden">
              <div className="flex items-center justify-between pb-3">
                <div className="inline-flex items-center justify-center px-3 py-1.5 bg-[#DCAF43]/10 text-[#DCAF43] rounded-full text-[10px] font-bold tracking-wide uppercase">
                  {item.peran ? item.peran : `Panitia #${idx + 1}`}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {item.isCustom && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1.5">Peran / Tugas</label>
                    <input 
                      type="text" 
                      value={item.peran || ''} 
                      onChange={(e) => handleArrayChange('panitia_keluarga', idx, 'peran', e.target.value)}
                      placeholder="Contoh: PIC Parkir"
                      className="w-full px-3.5 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-850 transition-all font-medium shadow-sm" 
                    />
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1.5">Nama Lengkap</label>
                    <input 
                      type="text" 
                      value={item.nama || ''} 
                      onChange={(e) => handleArrayChange('panitia_keluarga', idx, 'nama', e.target.value)}
                      placeholder="Contoh: Hermawan"
                      className="w-full px-3.5 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-850 transition-all font-medium shadow-sm" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1.5">WhatsApp</label>
                      <input type="tel" value={item.whatsapp || ''} 
                        inputMode="numeric" onChange={(e) => handleArrayChange('panitia_keluarga', idx, 'whatsapp', e.target.value)}
                        placeholder="628123456789"
                        className="w-full px-3.5 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-850 transition-all shadow-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1.5">Instagram</label>
                      <input 
                        type="text" 
                        value={item.instagram || ''} 
                        onChange={(e) => handleArrayChange('panitia_keluarga', idx, 'instagram', e.target.value)}
                        placeholder="@username"
                        className="w-full px-3.5 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-850 transition-all shadow-sm" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ==========================================
   MAIN PANITIA FORM
   ========================================== */
interface PanitiaFormProps {
  eventData: any;
  onClose: () => void;
  initialActiveTab?: string;
}

export default function PanitiaForm({ eventData, onClose, initialActiveTab = 'Panitia' }: PanitiaFormProps) {
  const [formData, setFormData] = useState(() => {
    // Combine panitia_keluarga and pengisi_acara into a single array for editing
    const rawPanitia = [...(eventData.panitia_keluarga || []), ...(eventData.pengisi_acara || [])];
    const mergedPanitia = DEFAULT_PANITIA_ROLES.map(role => {
      const existing = rawPanitia.find((p: any) => p && (p.peran || '').toLowerCase() === role.toLowerCase());
      if (existing) {
        return {
          ...existing,
          peran: role,
          nama: existing.nama || '',
          whatsapp: existing.whatsapp || '',
          instagram: existing.instagram || '',
          isCustom: false
        };
      }
      return { peran: role, nama: '', whatsapp: '', instagram: '', isCustom: false };
    });

    rawPanitia.forEach((p: any) => {
      if (p && p.peran) {
        const isDefault = DEFAULT_PANITIA_ROLES.some(role => role.toLowerCase() === p.peran.toLowerCase());
        if (!isDefault) {
          mergedPanitia.push({
            ...p,
            nama: p.nama || '',
            whatsapp: p.whatsapp || '',
            instagram: p.instagram || '',
            isCustom: true
          });
        }
      }
    });

    return {
      panitia_keluarga: mergedPanitia,
      pengisi_acara: [], // We keep this empty because all items are now in panitia_keluarga
      id_klien: eventData.id_klien,
    };
  });

  const handleArrayChange = (arrayName: string, index: number, field: string, value: string) => {
    if (field === 'whatsapp') {
      value = formatPhoneInput(value);
    } else if (field === 'instagram') {
      value = formatSocialInput(value);
    }

    setFormData((prev: any) => {
      const newArray = [...(prev[arrayName] || [])];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  };

  const handleAddArrayItem = (arrayName: string, newItem: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] || []), newItem]
    }));
  };

  const handleRemoveArrayItem = (arrayName: string, index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [arrayName]: (prev[arrayName] || []).filter((_: any, i: number) => i !== index)
    }));
  };

  return (
    <FormLayout title="Kepanitiaan" onClose={onClose} eventData={eventData} formData={formData}>
      <div className="space-y-4 mb-16 md:mb-0 mt-4 md:mt-2">
        <PanitiaTab 
          formData={formData} 
          handleArrayChange={handleArrayChange} 
          handleRemoveArrayItem={handleRemoveArrayItem} 
          handleAddArrayItem={handleAddArrayItem} 
        />
      </div>
    </FormLayout>
  );
}

