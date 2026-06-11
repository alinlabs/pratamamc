import React, { useState } from 'react';
import { Plus, Sparkles, Trash2 } from 'lucide-react';
import { formatPhoneInput, formatSocialInput } from '../../../lib/inputFormatters';
import FormLayout from '../components/layout-form';

export function PendampingTab({ formData, handleArrayChange, handleRemoveArrayItem, handleAddArrayItem }: any) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {formData.pendamping.length === 0 ? (
        <div className="text-center py-10 px-4 bg-white border border-dashed border-stone-200 rounded-2xl">
          <Sparkles className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-stone-700">Belum Ada Pendamping Terdaftar</h4>
          <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1 mb-3">Daftarkan tim pendamping terbaik atau Pagar Ayu/Bagus untuk mempermudah koordinasi panggung.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {formData.pendamping.map((item: any, idx: number) => (
            <div key={idx} className="bg-white border border-stone-200 rounded-2xl shadow-sm transition-all duration-200 group px-4 sm:px-6 py-5 sm:py-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="px-3 py-1 bg-[#DCAF43]/10 text-[#DCAF43] rounded-lg font-semibold text-xs border border-[#DCAF43]/20">
                    {item.peran ? item.peran : `Pendamping #${idx + 1}`}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('pendamping', idx)}
                  className="text-stone-400 hover:text-red-500 transition-all p-1.5 bg-stone-50 hover:bg-red-50 rounded-xl cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                  title="Hapus Pendamping"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-4 pt-4 border-t border-stone-100/80 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-stone-500 mb-1.5">Nama Pendamping</label>
                    <input 
                      type="text" 
                      value={item.nama || ''} 
                      onChange={(e) => handleArrayChange('pendamping', idx, 'nama', e.target.value)}
                      placeholder="Nama lengkap pendamping..."
                      className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1.5">WhatsApp</label>
                    <input type="tel" value={item.whatsapp || ''} 
                      inputMode="numeric" onChange={(e) => handleArrayChange('pendamping', idx, 'whatsapp', e.target.value)}
                      placeholder="628123456789"
                      className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1.5">Instagram Username</label>
                    <input 
                      type="text" 
                      value={item.instagram || ''} 
                      onChange={(e) => handleArrayChange('pendamping', idx, 'instagram', e.target.value)}
                      placeholder="@username"
                      className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" 
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="hidden md:flex flex-wrap gap-2.5 mt-4">
        <button
          type="button"
          onClick={() => handleAddArrayItem('pendamping', { peran: 'Bridesmaid / Pagar Ayu', nama: '', whatsapp: '', instagram: '', isCustom: false })}
          className="flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-stone-800 bg-[#DCAF43]/15 border border-[#DCAF43]/25 hover:bg-[#DCAF43]/25 rounded-xl hover:border-[#DCAF43]/40 transition-all shadow-sm active:scale-95 cursor-pointer ml-1"
        >
          <Plus className="w-4 h-4 text-stone-700" />
          Tambah Bridesmaid
        </button>
        <button
          type="button"
          onClick={() => handleAddArrayItem('pendamping', { peran: 'Groomsman / Pagar Bagus', nama: '', whatsapp: '', instagram: '', isCustom: false })}
          className="flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-stone-800 bg-[#DCAF43]/15 border border-[#DCAF43]/25 hover:bg-[#DCAF43]/25 rounded-xl hover:border-[#DCAF43]/40 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-stone-700" />
          Tambah Groomsman
        </button>
      </div>
    </div>
  );
}

export default function PendampingForm({ eventData, onClose }: { eventData: any; onClose: () => void; }) {
  const [formData, setFormData] = useState({
    pendamping: eventData.pendamping || [],
    id_klien: eventData.id_klien,
  });
  const [showAddMenu, setShowAddMenu] = useState(false);

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

  const mobileExtraAction = (
    <div className="relative md:hidden">
      {showAddMenu && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-stone-200 rounded-2xl shadow-lg p-2 overflow-hidden flex flex-col gap-1 z-[70]">
          <button type="button" onClick={() => { handleAddArrayItem('pendamping', { peran: 'Bridesmaid / Pagar Ayu', nama: '', whatsapp: '', instagram: '', isCustom: false }); setShowAddMenu(false); }} className="w-full px-3 py-2 text-sm text-left font-semibold text-stone-700 hover:bg-stone-50 rounded-xl">Bridesmaid</button>
          <button type="button" onClick={() => { handleAddArrayItem('pendamping', { peran: 'Groomsman / Pagar Bagus', nama: '', whatsapp: '', instagram: '', isCustom: false }); setShowAddMenu(false); }} className="w-full px-3 py-2 text-sm text-left font-semibold text-stone-700 hover:bg-stone-50 rounded-xl">Groomsman</button>
        </div>
      )}
      <button
        type="button"
        onClick={() => setShowAddMenu(!showAddMenu)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-800 bg-[#DCAF43]/15 border border-[#DCAF43]/25 hover:bg-[#DCAF43]/25 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Tambah</span>
      </button>
    </div>
  );

  return (
    <FormLayout title="Pendamping Pengantin" onClose={onClose} eventData={eventData} formData={formData} mobileExtraAction={mobileExtraAction}>
      <PendampingTab 
        formData={formData} 
        handleArrayChange={handleArrayChange} 
        handleRemoveArrayItem={handleRemoveArrayItem} 
        handleAddArrayItem={handleAddArrayItem} 
      />
    </FormLayout>
  );
}
