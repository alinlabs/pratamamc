import React, { useState } from 'react';
import { User, Users, Trash2, Plus, ClipboardList, Sparkles, Mic } from 'lucide-react';
import { formatPhoneInput, formatSocialInput } from '../../../lib/inputFormatters';
import FormLayout from '../components/layout-form';

export const DEFAULT_KELUARGA_ROLES = [
  "Ayah Mempelai Pria",
  "Ibu Mempelai Pria",
  "Ayah Mempelai Wanita",
  "Ibu Mempelai Wanita"
];

/* ==========================================
   1. PENGANTIN TAB
   ========================================== */
interface PengantinTabProps {
  formData: any;
  handlePengantinChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PengantinTab({ formData, handlePengantinChange }: PengantinTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
      {/* MEMPELAI PRIA CARD */}
      <div className="bg-white border border-stone-200 shadow-sm rounded-2xl p-5 sm:p-6 space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full -mr-10 -mt-10 pointer-events-none" />
        
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-sky-50 text-sky-600 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900">Data Mempelai Pria</h3>
              <p className="text-[10px] text-stone-400">Informasi lengkap calon pengantin pria.</p>
            </div>
          </div>
          <span className="text-[10px] bg-sky-50 text-sky-700 font-bold px-2 py-0.5 rounded-md border border-sky-100">
            MEMPELAI PRIA
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-stone-500 mb-1.5 "><span>Nama Lengkap</span></label>
            <div className="relative">
              <input 
                type="text" 
                name="nama_lengkap_pria" 
                value={formData.pengantin.nama_lengkap_pria || ''} 
                onChange={handlePengantinChange} 
                placeholder="Contoh: Pratama Aditya, S.T."
                className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-sky-500 focus:outline-none focus:ring-0 text-stone-880 transition-all shadow-sm" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">Nama Panggilan</label>
            <input 
              type="text" 
              name="nama_panggilan_pria" 
              value={formData.pengantin.nama_panggilan_pria || ''} 
              onChange={handlePengantinChange} 
              placeholder="Contoh: Tama"
              className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-sky-500 focus:outline-none focus:ring-0 text-stone-880 transition-all shadow-sm" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">Anak Ke-</label>
            <input 
              type="number" 
              name="anak_ke_pria" 
              value={formData.pengantin.anak_ke_pria || ''} 
              onChange={handlePengantinChange} 
              placeholder="Contoh: Pertama dari 3 Bersaudara"
              className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-sky-500 focus:outline-none focus:ring-0 text-stone-880 transition-all shadow-sm" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">WhatsApp</label>
            <input 
              type="text" inputMode="numeric" 
              name="whatsapp_pria" 
              value={formData.pengantin.whatsapp_pria || ''} 
              onChange={handlePengantinChange} 
              placeholder="628123456789"
              className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-sky-500 focus:outline-none focus:ring-0 text-stone-880 transition-all shadow-sm" 
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">Instagram Username</label>
            <input 
              type="text" 
              name="instagram_pria" 
              value={formData.pengantin.instagram_pria || ''} 
              onChange={handlePengantinChange} 
              placeholder="@username_pria"
              className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-sky-500 focus:outline-none focus:ring-0 text-stone-880 transition-all shadow-sm" 
            />
          </div>
        </div>
      </div>

      {/* MEMPELAI WANITA CARD */}
      <div className="bg-white border border-stone-200 shadow-sm rounded-2xl p-5 sm:p-6 space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-10 -mt-10 pointer-events-none" />
        
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900">Data Mempelai Wanita</h3>
              <p className="text-[10px] text-stone-400">Informasi lengkap calon pengantin wanita.</p>
            </div>
          </div>
          <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-md border border-rose-100">
            MEMPELAI WANITA
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">Nama Lengkap</label>
            <input 
              type="text" 
              name="nama_lengkap_wanita" 
              value={formData.pengantin.nama_lengkap_wanita || ''} 
              onChange={handlePengantinChange} 
              placeholder="Contoh: Sarah Anastasya, S.Ked."
              className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-rose-500 focus:outline-none focus:ring-0 text-stone-880 transition-all shadow-sm" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">Nama Panggilan</label>
            <input 
              type="text" 
              name="nama_panggilan_wanita" 
              value={formData.pengantin.nama_panggilan_wanita || ''} 
              onChange={handlePengantinChange} 
              placeholder="Contoh: Sarah"
              className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-rose-500 focus:outline-none focus:ring-0 text-stone-880 transition-all shadow-sm" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">Anak Ke-</label>
            <input 
              type="number" 
              name="anak_ke_wanita" 
              value={formData.pengantin.anak_ke_wanita || ''} 
              onChange={handlePengantinChange} 
              placeholder="Contoh: Kedua dari 4 Bersaudara"
              className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-rose-500 focus:outline-none focus:ring-0 text-stone-880 transition-all shadow-sm" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">WhatsApp</label>
            <input 
              type="text" inputMode="numeric" 
              name="whatsapp_wanita" 
              value={formData.pengantin.whatsapp_wanita || ''} 
              onChange={handlePengantinChange} 
              placeholder="628123456789"
              className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-rose-500 focus:outline-none focus:ring-0 text-stone-880 transition-all shadow-sm" 
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">Instagram Username</label>
            <input 
              type="text" 
              name="instagram_wanita" 
              value={formData.pengantin.instagram_wanita || ''} 
              onChange={handlePengantinChange} 
              placeholder="@username_wanita"
              className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-rose-500 focus:outline-none focus:ring-0 text-stone-880 transition-all shadow-sm" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   2. KELUARGA TAB
   ========================================== */
interface KeluargaTabProps {
  formData: any;
  handleArrayChange: (arrayName: string, index: number, field: string, value: string) => void;
  handleRemoveArrayItem: (arrayName: string, index: number) => void;
  handleAddArrayItem: (arrayName: string, newItem: any) => void;
}

export function KeluargaTab({ formData, handleArrayChange, handleRemoveArrayItem, handleAddArrayItem }: KeluargaTabProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {formData.keluarga_inti.length === 0 ? (
        <div className="text-center py-10 px-4 bg-white border border-dashed border-stone-200 rounded-2xl">
          <Users className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-stone-700">Belum Ada Anggota Keluarga</h4>
          <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1 mb-3">Tambahkan nama-nama keluarga inti untuk mempermudah koordinasi & sambutan.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {formData.keluarga_inti.map((item: any, idx: number) => (
            <div key={idx} className="bg-white border border-stone-200 rounded-2xl shadow-sm transition-all duration-200 group px-4 sm:px-6 py-5 sm:py-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="px-3 py-1 bg-[#DCAF43]/10 text-[#DCAF43] rounded-lg font-semibold text-xs border border-[#DCAF43]/20">
                    {item.peran ? item.peran : `Keluarga #${idx + 1}`}
                  </div>
                </div>
                {item.isCustom && (
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('keluarga_inti', idx)}
                    className="text-stone-400 hover:text-red-500 transition-all p-1.5 bg-stone-50 hover:bg-red-50 rounded-xl cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                    title="Hapus Keluarga"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 pt-4 border-t border-stone-100/80 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 gap-4">
                  {item.isCustom && (
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-stone-500 mb-1.5">Siapakah / Peran</label>
                      <input 
                        type="text" 
                        value={item.peran || ''} 
                        onChange={(e) => handleArrayChange('keluarga_inti', idx, 'peran', e.target.value)}
                        placeholder="Contoh: Ayah Kandung Pria..."
                        className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" 
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] sm:text-xs font-semibold text-stone-500 mb-1.5 truncate "><span>Nama Lengkap</span></label>
                    <input 
                      type="text" 
                      value={item.nama || ''} 
                      onChange={(e) => handleArrayChange('keluarga_inti', idx, 'nama', e.target.value)}
                      placeholder="Contoh: Sastro Wardoyo"
                      className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-semibold text-stone-500 mb-1.5 truncate">Panggilan dari Pengantin</label>
                    <input 
                      type="text" 
                      value={item.nama_panggilan || ''} 
                      onChange={(e) => handleArrayChange('keluarga_inti', idx, 'nama_panggilan', e.target.value)}
                      placeholder="Contoh: Papah / Mamah / Ibu..."
                      className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" 
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-semibold text-stone-500 mb-1.5">WhatsApp</label>
                    <input type="tel" value={item.whatsapp || ''} 
                      inputMode="numeric" onChange={(e) => handleArrayChange('keluarga_inti', idx, 'whatsapp', e.target.value)}
                      placeholder="628123456789"
                      className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" 
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-semibold text-stone-500 mb-1.5">Instagram Username</label>
                    <input 
                      type="text" 
                      value={item.instagram || ''} 
                      onChange={(e) => handleArrayChange('keluarga_inti', idx, 'instagram', e.target.value)}
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
    </div>
  );
}

/* ==========================================
   3. PANITIA TAB
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
      <div className="flex items-center gap-2.5 pb-2">
        <div className="p-1.5 bg-[#DCAF43]/10 text-[#DCAF43] rounded-lg">
          <ClipboardList className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-stone-850">Panitia / Koordinator Keluarga</h3>
          <p className="text-[11px] text-stone-500 font-medium font-sans">Panitia internal non-vendor (contoh: penerima tamu, doorprize, pengantar pengantin).</p>
        </div>
      </div>

      {formData.panitia_keluarga.length === 0 ? (
        <div className="text-center py-10 px-4 bg-white border border-dashed border-stone-200 rounded-2xl">
          <ClipboardList className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-stone-700">Belum Ada Panitia Keluarga</h4>
          <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1 mb-3">Tentukan daftar PIC atau panitia dari sanak saudara untuk mendukung kelancaran.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {formData.panitia_keluarga.map((item: any, idx: number) => (
            <div key={idx} className="relative bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-[#DCAF43]/30 rounded-2xl p-5 sm:p-6 space-y-4 transition-all group overflow-hidden">
              <div className="flex items-center justify-between pb-3">
                <div className="inline-flex items-center justify-center px-3 py-1.5 bg-[#DCAF43]/10 text-[#DCAF43] rounded-full text-[10px] font-bold tracking-wide uppercase">
                  {item.peran ? item.peran : `Panitia #${idx + 1}`}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('panitia_keluarga', idx)}
                  className="text-stone-400 hover:text-red-500 transition-all p-2 bg-stone-50 hover:bg-red-55 rounded-xl cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                  title="Hapus Panitia"
                >
                  <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {item.isCustom && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1.5">Peran / Tugas</label>
                    <input 
                      type="text" 
                      value={item.peran || ''} 
                      onChange={(e) => handleArrayChange('panitia_keluarga', idx, 'peran', e.target.value)}
                      placeholder="Contoh: PIC Konsumsi / Doorprize..."
                      className="w-full px-3.5 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-850 transition-all font-medium shadow-sm" 
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1.5 "><span>Nama Lengkap</span></label>
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

      <button
        type="button"
        onClick={() => handleAddArrayItem('panitia_keluarga', { peran: '', nama: '', whatsapp: '', instagram: '', isCustom: true })}
        className="hidden md:flex items-center gap-1.5 px-4.5 py-3 text-xs sm:text-sm font-bold text-stone-800 bg-[#DCAF43]/10 border border-[#DCAF43]/20 hover:bg-[#DCAF43]/20 rounded-xl hover:border-[#DCAF43]/35 transition-all shadow-sm active:scale-95 cursor-pointer ml-1"
      >
        <Plus className="w-4 h-4 text-stone-700" />
        Tambah Panitia
      </button>
    </div>
  );
}

/* ==========================================
   4. PENGISI ACARA TAB
   ========================================== */
interface PengisiAcaraTabProps {
  formData: any;
  handleArrayChange: (arrayName: string, index: number, field: string, value: string) => void;
  handleRemoveArrayItem: (arrayName: string, index: number) => void;
  handleAddArrayItem: (arrayName: string, newItem: any) => void;
}

export function PengisiAcaraTab({ formData, handleArrayChange, handleRemoveArrayItem, handleAddArrayItem }: PengisiAcaraTabProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-2.5 pb-2">
        <div className="p-1.5 bg-[#DCAF43]/10 text-[#DCAF43] rounded-lg">
          <Mic className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-stone-850">Roster Pengisi Acara & Penampil</h3>
          <p className="text-[11px] text-stone-500 font-medium">Artis, pengkhotbah, pengisi ceramah, MC utama, penyanyi atau rombongan tari.</p>
        </div>
      </div>

      {formData.pengisi_acara.length === 0 ? (
        <div className="text-center py-10 px-4 bg-white border border-dashed border-stone-200 rounded-2xl">
          <Mic className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-stone-700">Belum Ada Pengisi Acara</h4>
          <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1 mb-3">Daftarkan pengisi acara formal Anda agar terstruktur di dalam rundown acara.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {formData.pengisi_acara.map((item: any, idx: number) => (
            <div key={idx} className="relative bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-[#DCAF43]/30 rounded-2xl p-5 sm:p-6 space-y-4 transition-all group overflow-hidden">
              <div className="flex items-center justify-between pb-3">
                <div className="inline-flex items-center justify-center px-3 py-1.5 bg-[#DCAF43]/10 text-[#DCAF43] rounded-full text-[10px] font-bold tracking-wide uppercase">
                  {item.peran ? item.peran : `Penampil #${idx + 1}`}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('pengisi_acara', idx)}
                  className="text-stone-400 hover:text-red-500 transition-all p-2 bg-stone-50 hover:bg-red-55 rounded-xl cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                  title="Hapus Pengisi Acara"
                >
                  <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {item.isCustom && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1.5">Sektor Peran / Penampilan</label>
                    <input 
                      type="text" 
                      value={item.peran || ''} 
                      onChange={(e) => handleArrayChange('pengisi_acara', idx, 'peran', e.target.value)}
                      placeholder="Contoh: Petugas KUA / Solois Keyboard / MC Utama..."
                      className="w-full px-3.5 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-850 transition-all font-medium shadow-sm" 
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1.5 "><span>Nama Lengkap / Brand</span></label>
                    <input 
                      type="text" 
                      value={item.nama || ''} 
                      onChange={(e) => handleArrayChange('pengisi_acara', idx, 'nama', e.target.value)}
                      placeholder="Nama atau brand talent..."
                      className="w-full px-3.5 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-850 transition-all font-medium shadow-sm" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1.5">WhatsApp</label>
                      <input type="tel" value={item.whatsapp || ''} 
                        inputMode="numeric" onChange={(e) => handleArrayChange('pengisi_acara', idx, 'whatsapp', e.target.value)}
                        placeholder="628123456789"
                        className="w-full px-3.5 py-2.5 text-sm border border-[#DCAF43]/15 rounded-xl hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-850 transition-all shadow-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1.5">Instagram</label>
                      <input 
                        type="text" 
                        value={item.instagram || ''} 
                        onChange={(e) => handleArrayChange('pengisi_acara', idx, 'instagram', e.target.value)}
                        placeholder="@username"
                        className="w-full px-3.5 py-2.5 text-sm border border-stone-100 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-850 transition-all shadow-sm" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => handleAddArrayItem('pengisi_acara', { peran: '', nama: '', whatsapp: '', instagram: '', isCustom: true })}
        className="hidden md:flex items-center gap-1.5 px-4.5 py-3 text-xs sm:text-sm font-bold text-stone-800 bg-[#DCAF43]/10 border border-[#DCAF43]/20 hover:bg-[#DCAF43]/20 rounded-xl hover:border-[#DCAF43]/35 transition-all shadow-sm active:scale-95 cursor-pointer ml-1"
      >
        <Plus className="w-4 h-4 text-stone-700" />
        Tambah Pengisi Acara
      </button>
    </div>
  );
}

/* ==========================================
   5. PENDAMPING TAB
   ========================================== */
interface PendampingTabProps {
  formData: any;
  handleArrayChange: (arrayName: string, index: number, field: string, value: string) => void;
  handleRemoveArrayItem: (arrayName: string, index: number) => void;
  handleAddArrayItem: (arrayName: string, newItem: any) => void;
}

export function PendampingTab({ formData, handleArrayChange, handleRemoveArrayItem, handleAddArrayItem }: PendampingTabProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-2.5 pb-2">
        <div className="p-1.5 bg-[#DCAF43]/10 text-[#DCAF43] rounded-lg">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-stone-850">Pendamping Pelaksana (Bridesmaid & Groomsman)</h3>
          <p className="text-[11px] text-stone-500 font-medium font-sans">Daftar tim pagar ayu / bagus, bridesmaids, groomsmen yang mendampingi perjalanan pengantin.</p>
        </div>
      </div>

      {formData.pendamping.length === 0 ? (
        <div className="text-center py-10 px-4 bg-white border border-dashed border-stone-200 rounded-2xl">
          <Sparkles className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-stone-700">Belum Ada Pendamping Terdaftar</h4>
          <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1 mb-3">Daftarkan tim pendamping terbaik atau Pagar Ayu/Bagus untuk mempermudah koordinasi panggung.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {formData.pendamping.map((item: any, idx: number) => (
            <div key={idx} className="relative bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-[#DCAF43]/30 rounded-2xl p-5 sm:p-6 space-y-4 transition-all group overflow-hidden">
              <div className="flex items-center justify-between pb-3">
                <div className="inline-flex items-center justify-center px-3 py-1.5 bg-[#DCAF43]/10 text-[#DCAF43] rounded-full text-[10px] font-bold tracking-wide uppercase">
                  {item.peran ? item.peran : `Pendamping #${idx + 1}`}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('pendamping', idx)}
                  className="text-stone-400 hover:text-red-500 transition-all p-2 bg-stone-50 hover:bg-red-55 rounded-xl cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                  title="Hapus Pendamping"
                >
                  <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1.5">Nama Pendamping</label>
                    <input 
                      type="text" 
                      value={item.nama || ''} 
                      onChange={(e) => handleArrayChange('pendamping', idx, 'nama', e.target.value)}
                      placeholder="Nama lengkap pendamping..."
                      className="w-full px-3.5 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-850 transition-all font-medium shadow-sm" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1.5 "><span>WhatsApp</span></label>
                      <input type="tel" value={item.whatsapp || ''} 
                        inputMode="numeric" onChange={(e) => handleArrayChange('pendamping', idx, 'whatsapp', e.target.value)}
                        placeholder="628123456789"
                        className="w-full px-3.5 py-2.5 text-sm border border-[#DCAF43]/15 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-850 transition-all shadow-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1.5">Instagram</label>
                      <input 
                        type="text" 
                        value={item.instagram || ''} 
                        onChange={(e) => handleArrayChange('pendamping', idx, 'instagram', e.target.value)}
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

      <div className="hidden md:flex flex-wrap gap-2.5 pt-2">
        <button
          type="button"
          onClick={() => handleAddArrayItem('pendamping', { peran: 'Bridesmaid / Pagar Ayu', nama: '', whatsapp: '', instagram: '', isCustom: false })}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-stone-700 bg-[#DCAF43]/5 border border-[#DCAF43]/15 rounded-xl hover:bg-[#DCAF43]/10 hover:border-[#DCAF43]/25 transition-all shadow-sm active:scale-95 cursor-pointer ml-1"
        >
          <Plus className="w-3.5 h-3.5 text-stone-600" />
          Tambah Bridesmaid
        </button>
        <button
          type="button"
          onClick={() => handleAddArrayItem('pendamping', { peran: 'Groomsman / Pagar Bagus', nama: '', whatsapp: '', instagram: '', isCustom: false })}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-stone-700 bg-[#DCAF43]/5 border border-[#DCAF43]/15 rounded-xl hover:bg-[#DCAF43]/10 hover:border-[#DCAF43]/25 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-stone-600" />
          Tambah Groomsman
        </button>
      </div>
    </div>
  );
}

/* ==========================================
   6. TAMU TAB
   ========================================== */
interface TamuTabProps {
  formData: any;
  handleArrayChange: (arrayName: string, index: number, field: string, value: string) => void;
  handleRemoveArrayItem: (arrayName: string, index: number) => void;
  handleAddArrayItem: (arrayName: string, newItem: any) => void;
}

export function TamuTab({ formData, handleArrayChange, handleAddArrayItem, handleRemoveArrayItem }: TamuTabProps) {
  return (
    <div className="max-w-4xl max-w-full space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-white border-x-0 sm:border-x border-y sm:border-y sm:rounded-2xl border-stone-200/60 shadow-sm p-5 md:p-8 space-y-8 relative overflow-hidden -mx-4 sm:mx-0">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row shadow-sm sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-stone-800 to-stone-500 bg-clip-text text-transparent flex items-center gap-2">
              <Users className="w-6 h-6 text-[#DCAF43]" />
              Daftar Tamu
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1.5 font-medium leading-relaxed">
              Catat nama tamu dan beri catatan khusus kepada mereka.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleAddArrayItem('tamu', { id: Date.now().toString(), nama: '', catatan: '', jenis: 'Umum' })}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#DCAF43] text-white rounded-xl font-bold text-sm hover:bg-[#c99f3c] transition-all shadow-md active:scale-95 shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Tamu</span>
          </button>
        </div>

        {/* Content Section */}
        {(!formData.tamu || formData.tamu.length === 0) ? (
          <div className="text-center py-10 px-4 bg-white border border-dashed border-stone-200 rounded-2xl">
            <Users className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-stone-700">Belum Ada Tamu</h4>
            <p className="text-xs text-stone-500 mt-1">Klik tombol di atas untuk menambah data tamu baru.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {formData.tamu.map((item: any, idx: number) => (
              <div key={idx} className="relative bg-white border border-stone-200/80 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-[#DCAF43]/30 rounded-2xl p-5 sm:p-6 space-y-4 transition-all group overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#DCAF43]/5 rounded-bl-[100px] -z-0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-100/50">
                  <div className="inline-flex items-center justify-center px-3 py-1.5 bg-stone-100 text-stone-600 rounded-full text-xs font-bold font-mono tracking-wider shadow-inner">
                    #{idx + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('tamu', idx)}
                    className="text-stone-400 hover:text-red-500 transition-all p-2 bg-stone-50 hover:bg-red-5 rounded-xl cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 relative z-10 pt-1">
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-stone-500 uppercase mb-1.5 ml-1">Nama Tamu</label>
                    <input 
                      type="text" 
                      value={item.nama || ''} 
                      onChange={(e) => handleArrayChange('tamu', idx, 'nama', e.target.value)}
                      placeholder="Nama lengkap"
                      className="w-full px-4 py-3 text-sm border border-stone-200 bg-stone-50/50 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-850 transition-all font-semibold shadow-[0_2px_4px_-2px_rgba(0,0,0,0.02)]" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-stone-500 uppercase mb-1.5 ml-1">Jenis Tamu</label>
                    <select
                      value={item.jenis || 'Umum'}
                      onChange={(e) => handleArrayChange('tamu', idx, 'jenis', e.target.value)}
                      className="w-full px-4 py-3 text-sm border border-stone-200 bg-stone-50/50 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-850 transition-all font-semibold shadow-[0_2px_4px_-2px_rgba(0,0,0,0.02)]" 
                    >
                      <option value="VVIP">VVIP</option>
                      <option value="VIP">VIP</option>
                      <option value="Penting">Penting</option>
                      <option value="Umum">Umum</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold tracking-wider text-stone-500 uppercase mb-1.5 ml-1">Catatan Khusus</label>
                    <input 
                      type="text" 
                      value={item.catatan || ''} 
                      onChange={(e) => handleArrayChange('tamu', idx, 'catatan', e.target.value)}
                      placeholder="Contoh: Tempat duduk di meja 12"
                      className="w-full px-4 py-3 text-sm border border-stone-200 bg-stone-50/50 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-850 transition-all shadow-[0_2px_4px_-2px_rgba(0,0,0,0.02)]" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================
   MAIN KELUARGA FORM
   ========================================== */
interface KeluargaFormProps {
  eventData: any;
  onClose: () => void;
  initialActiveTab?: string;
}

export default function KeluargaForm({ eventData, onClose }: KeluargaFormProps) {
  const [formData, setFormData] = useState(() => {
    const rawKeluarga = eventData.keluarga_inti || [];
    const mergedKeluarga = DEFAULT_KELUARGA_ROLES.map(role => {
      const existing = rawKeluarga.find((k: any) => k && (k.peran || '').toLowerCase() === role.toLowerCase());
      if (existing) {
        return {
          ...existing,
          peran: role,
          nama: existing.nama || '',
          nama_panggilan: existing.nama_panggilan || '',
          whatsapp: existing.whatsapp || '',
          instagram: existing.instagram || '',
          isCustom: false
        };
      }
      return { peran: role, nama: '', nama_panggilan: '', whatsapp: '', instagram: '', isCustom: false };
    });

    // Add any remaining custom roles
    rawKeluarga.forEach((k: any) => {
      if (k && k.peran) {
        const isDefault = DEFAULT_KELUARGA_ROLES.some(role => role.toLowerCase() === k.peran.toLowerCase());
        if (!isDefault) {
          mergedKeluarga.push({
            ...k,
            nama: k.nama || '',
            nama_panggilan: k.nama_panggilan || '',
            whatsapp: k.whatsapp || '',
            instagram: k.instagram || '',
            isCustom: true
          });
        }
      }
    });

    return {
      keluarga_inti: mergedKeluarga,
      id_klien: eventData.id_klien
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

  const mobileExtraAction = (
    <button
      type="button"
      onClick={() => handleAddArrayItem('keluarga_inti', { 
        id: crypto.randomUUID(), 
        nama: '', 
        peran: 'Anggota Keluarga Lainnya', 
        isCustom: true 
      })}
      className="md:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-800 bg-[#DCAF43]/15 border border-[#DCAF43]/25 hover:bg-[#DCAF43]/25 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
    >
      <Plus className="w-3.5 h-3.5" />
      <span>Tambah</span>
    </button>
  );

  return (
    <FormLayout title="Keluarga Inti" onClose={onClose} eventData={eventData} formData={formData} mobileExtraAction={mobileExtraAction}>
      <div className="space-y-4 mb-16 md:mb-0 mt-4 md:mt-2">
        <KeluargaTab 
          formData={formData} 
          handleArrayChange={handleArrayChange} 
          handleRemoveArrayItem={handleRemoveArrayItem} 
          handleAddArrayItem={handleAddArrayItem} 
        />
        
        <div className="hidden md:flex justify-start mt-4">
          <button
            type="button"
            onClick={() => handleAddArrayItem('keluarga_inti', { 
              id: crypto.randomUUID(), 
              nama: '', 
              peran: 'Anggota Keluarga Lainnya', 
              isCustom: true 
            })}
            className="flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-stone-800 bg-[#DCAF43]/15 border border-[#DCAF43]/25 hover:bg-[#DCAF43]/25 rounded-xl hover:border-[#DCAF43]/40 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-stone-700" />
            Tambah Keluarga
          </button>
        </div>
      </div>
    </FormLayout>
  );
}
