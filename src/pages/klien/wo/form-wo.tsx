import React, { useState, useEffect } from 'react';
import FormLayout from '../components/layout-form';
import { formatPhoneInput, formatSocialInput } from '../../../lib/inputFormatters';
import { Plus, Trash2, Users } from 'lucide-react';
import ComboBox from '../../../components/input-combobox';

export default function WOForm({ eventData, onClose }: { eventData: any, onClose: () => void }) {
  const [woRoles, setWoRoles] = useState<any[]>([]);

  useEffect(() => {
    fetch('/data/default-wo.json')
      .then(res => res.json())
      .then(data => setWoRoles(data))
      .catch(err => console.error("Gagal memuat profil WO bawaan", err));
  }, []);
  const [formData, setFormData] = useState(() => {
    // Prepare wedding organizers list
    const rawWO = eventData.wedding_organizer || eventData.timWO || eventData.tim_wo || [];
    
    return {
      id_klien: eventData.id_klien,
      wedding_organizer: rawWO.map((w: any) => ({
        ...w,
        isCustom: true // Mark all as custom so they can be edited freely, or don't set it and let them be editable depending on WOCard
      })),
    };
  });

  const handleWOChange = (index: number, field: string, value: string) => {
    let newVal = value;
    if (field === 'whatsapp') newVal = formatPhoneInput(value);
    if (field === 'instagram') newVal = formatSocialInput(value);

    const newWO = [...formData.wedding_organizer];
    newWO[index] = { ...newWO[index], [field]: newVal };
    setFormData({ ...formData, wedding_organizer: newWO });
  };

  const handleWORoleChange = (index: number, val: string) => {
    const newWO = [...formData.wedding_organizer];
    newWO[index] = { ...newWO[index], peran: val };
    
    // Auto-fill deskripsi dan detail jika peran dikenali
    const matchedRole = woRoles.find(r => r.peran.toLowerCase() === val.toLowerCase());
    if (matchedRole) {
      newWO[index].deskripsi = matchedRole.deskripsi;
      newWO[index].detail = matchedRole.detail;
    }
    
    setFormData({ ...formData, wedding_organizer: newWO });
  };

  const handleAddWOItem = () => {
    setFormData({ ...formData, wedding_organizer: [...formData.wedding_organizer, { peran: '', nama: '', whatsapp: '', instagram: '', isCustom: true }] });
  };

  const handleRemoveWOItem = (idx: number) => {
    const newWO = [...formData.wedding_organizer];
    newWO.splice(idx, 1);
    setFormData({ ...formData, wedding_organizer: newWO });
  };

  const mobileExtraAction = (
    <button
      type="button"
      onClick={handleAddWOItem}
      className="md:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-800 bg-[#DCAF43]/15 border border-[#DCAF43]/25 hover:bg-[#DCAF43]/25 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
    >
      <Plus className="w-3.5 h-3.5" />
      <span>Tambah</span>
    </button>
  );

  return (
    <FormLayout title="Wedding Organizer" onClose={onClose} eventData={eventData} formData={formData} mobileExtraAction={mobileExtraAction}>
      <div className="space-y-4 animate-in fade-in duration-300 mt-4 md:mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {formData.wedding_organizer.map((item: any, idx: number) => (
            <div key={idx} className="bg-white border text-sm border-stone-200 shadow-sm rounded-2xl flex flex-col sm:flex-row relative group hover:border-[#DCAF43]/50 hover:shadow-md transition-all duration-300">
              <div className="absolute top-1/2 left-4 -translate-y-1/2 w-8 h-8 bg-stone-50 text-stone-400 font-bold font-mono rounded-full flex items-center justify-center text-xs border border-stone-200 z-10 hidden sm:flex">
                {idx + 1}
              </div>
              
              <div className="flex items-center justify-between sm:hidden px-4 py-3 border-b border-stone-100 bg-stone-50/50 rounded-t-2xl">
                <div className="w-6 h-6 bg-stone-200 text-stone-600 font-bold font-mono rounded-full flex items-center justify-center text-[10px]">
                  {idx + 1}
                </div>
                {item.isCustom && (
                  <button
                    type="button"
                    onClick={() => handleRemoveWOItem(idx)}
                    className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex-1 p-4 sm:p-5 sm:pl-16 space-y-4 relative">
                {item.isCustom && (
                  <button
                    type="button"
                    onClick={() => handleRemoveWOItem(idx)}
                    className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors hidden sm:block opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex justify-between items-center"><span>
                    Tugas / Peran <span className="text-red-500 ml-0.5">*</span>
                  </span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
                  <ComboBox
                    options={woRoles.map(r => ({ label: r.peran, value: r.peran }))}
                    value={item.peran || ''}
                    onChange={(val) => handleWORoleChange(idx, val)}
                    placeholder="Pilih atau ketik peran..."
                  />
                  {(item.deskripsi || item.detail) && (
                    <div className="mt-2 text-xs text-stone-500 bg-stone-50/50 p-2 rounded-lg border border-stone-100">
                      <strong>Deskripsi Role:</strong> {item.deskripsi}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1.5">Nama Petugas / PIC</label>
                  <input 
                    type="text" 
                    value={item.nama || ''} 
                    onChange={(e) => handleWOChange(idx, 'nama', e.target.value)} 
                    placeholder={`Nama Petugas ${item.peran}`}
                    className="w-full px-3 py-2 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 transition-all shadow-sm" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pb-1">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-400 mb-1">WhatsApp</label>
                    <input type="tel" value={item.whatsapp || ''} 
                      inputMode="numeric" onChange={(e) => handleWOChange(idx, 'whatsapp', e.target.value)} 
                      placeholder="6281..."
                      className="w-full px-3 py-2 border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 transition-all shadow-sm text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-400 mb-1">Instagram</label>
                    <input 
                      type="text" 
                      value={item.instagram || ''} 
                      onChange={(e) => handleWOChange(idx, 'instagram', e.target.value)} 
                      placeholder="@username"
                      className="w-full px-3 py-2 border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 transition-all shadow-sm text-sm" 
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:flex justify-start mt-4">
          <button
            type="button"
            onClick={handleAddWOItem}
            className="flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-stone-800 bg-[#DCAF43]/15 border border-[#DCAF43]/25 hover:bg-[#DCAF43]/25 rounded-xl hover:border-[#DCAF43]/40 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-stone-700" />
            Tambah Tim WO
          </button>
        </div>
      </div>
    </FormLayout>
  );
}
