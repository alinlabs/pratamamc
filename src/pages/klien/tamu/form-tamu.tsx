import React, { useState } from 'react';
import { Plus, Users, Trash2 } from 'lucide-react';
import FormLayout from '../components/layout-form';

export function TamuTab({ formData, handleArrayChange, handleAddArrayItem, handleRemoveArrayItem }: any) {
  return (
    <div className="max-w-4xl max-w-full space-y-4 pt-4 md:pt-0 pb-16 md:pb-0">
        
        {(!formData.tamu || formData.tamu.length === 0) ? (
          <div className="text-center py-10 px-4 bg-white border border-dashed border-stone-200 rounded-2xl">
            <Users className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-stone-700">Belum Ada Tamu</h4>
            <p className="text-xs text-stone-500 mt-1">Klik tombol di atas untuk menambah data tamu baru.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {formData.tamu.map((item: any, idx: number) => (
              <div key={idx} className="bg-white border border-stone-200 rounded-2xl shadow-sm transition-all duration-200 group px-4 sm:px-6 py-5 sm:py-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <div className="px-3 py-1 bg-[#DCAF43]/10 text-[#DCAF43] rounded-lg font-semibold text-xs border border-[#DCAF43]/20">
                      Tamu #{idx + 1}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('tamu', idx)}
                    className="text-stone-400 hover:text-red-500 transition-all p-1.5 bg-stone-50 hover:bg-red-50 rounded-xl cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                    title="Hapus Tamu"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-4 pt-4 border-t border-stone-100/80 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1.5">Nama Tamu</label>
                      <input 
                        type="text" 
                        value={item.nama || ''} 
                        onChange={(e) => handleArrayChange('tamu', idx, 'nama', e.target.value)}
                        placeholder="Nama lengkap"
                        className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1.5">Jenis Tamu</label>
                      <select
                        value={item.jenis || 'Umum'}
                        onChange={(e) => handleArrayChange('tamu', idx, 'jenis', e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" 
                      >
                        <option value="VVIP">VVIP</option>
                        <option value="VIP">VIP</option>
                        <option value="Penting">Penting</option>
                        <option value="Umum">Umum</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-stone-500 mb-1.5">Catatan Khusus</label>
                      <input 
                        type="text" 
                        value={item.catatan || ''} 
                        onChange={(e) => handleArrayChange('tamu', idx, 'catatan', e.target.value)}
                        placeholder="Contoh: Tempat duduk di meja 12"
                        className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="hidden md:flex justify-start mt-4">
          <button
            type="button"
            onClick={() => handleAddArrayItem('tamu', { id: Date.now().toString(), nama: '', catatan: '', jenis: 'Umum' })}
            className="flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-stone-800 bg-[#DCAF43]/15 border border-[#DCAF43]/25 hover:bg-[#DCAF43]/25 rounded-xl hover:border-[#DCAF43]/40 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-stone-700" />
            Tambah Tamu
          </button>
        </div>
    </div>
  );
}

export default function TamuForm({ eventData, onClose }: { eventData: any; onClose: () => void; }) {
  const [formData, setFormData] = useState({
    tamu: eventData.tamu || [],
    id_klien: eventData.id_klien,
  });

  const handleArrayChange = (arrayName: string, index: number, field: string, value: string) => {
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
    <button
      type="button"
      onClick={() => handleAddArrayItem('tamu', { id: Date.now().toString(), nama: '', catatan: '', jenis: 'Umum' })}
      className="md:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-800 bg-[#DCAF43]/15 border border-[#DCAF43]/25 hover:bg-[#DCAF43]/25 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
    >
      <Plus className="w-3.5 h-3.5" />
      <span>Tambah</span>
    </button>
  );

  return (
    <FormLayout title="Manajemen Tamu Khusus" onClose={onClose} eventData={eventData} formData={formData} mobileExtraAction={mobileExtraAction}>
      <TamuTab 
        formData={formData} 
        handleArrayChange={handleArrayChange} 
        handleRemoveArrayItem={handleRemoveArrayItem} 
        handleAddArrayItem={handleAddArrayItem} 
      />
    </FormLayout>
  );
}
