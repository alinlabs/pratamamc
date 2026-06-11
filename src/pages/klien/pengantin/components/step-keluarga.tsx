import React from "react";
import { Trash2 } from "lucide-react";
import { formatPhoneInput, formatSocialInput } from "../../../../lib/inputFormatters";

interface Props {
  keluargaList: any[];
  setKeluargaList: (val: any[]) => void;
}

export default function StepKeluarga({ keluargaList, setKeluargaList }: Props) {
  return (
    <div className="space-y-8 pt-4">
      {keluargaList.map((keluarga, idx) => (
        <div key={idx} className="bg-white border border-stone-200 rounded-2xl shadow-sm transition-all duration-200 px-4 sm:px-6 py-5 sm:py-6 pt-7 space-y-4 relative">
          <div className="absolute -top-3 left-5">
            <span className="inline-flex items-center justify-center px-3 py-1.5 bg-[#FDF9F0] border border-[#DCAF43]/30 text-[#DCAF43] rounded-full text-[10px] font-bold tracking-wide uppercase shadow-sm">
              {keluarga.peran || `Keluarga #${idx + 1}`}
            </span>
          </div>
          {!keluarga.disableDelete && (
            <div className="absolute top-3 right-5">
              <button
                type="button"
                onClick={() => {
                  const l = [...keluargaList];
                  l.splice(idx, 1);
                  setKeluargaList(l);
                }}
                className="text-stone-400 hover:text-red-500 transition-all p-1.5 bg-stone-50 hover:bg-red-50 rounded-xl cursor-pointer hover:scale-105 active:scale-95 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            {!keluarga.disableDelete && (
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex justify-between items-center"><span>Peran / Hubungan <span className="text-red-500">*</span></span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
                <select
                  value={keluarga.peran || ''}
                  onChange={(e) => {
                    const l = [...keluargaList];
                    l[idx].peran = e.target.value;
                    setKeluargaList(l);
                  }}
                  className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
                >
                  <option value="">Pilih Hubungan...</option>
                  <option value="Kakak Pengantin">Kakak Pengantin</option>
                  <option value="Adik Pengantin">Adik Pengantin</option>
                  <option value="Paman / Bibi">Paman / Bibi</option>
                  <option value="Eyang / Kakek / Nenek">Eyang / Kakek / Nenek</option>
                  <option value="Keluarga Lainnya">Keluarga Lainnya</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-[10px] sm:text-xs font-semibold text-stone-500 mb-1.5 truncate flex justify-between items-center"><span>Nama Lengkap <span className="text-red-500">*</span></span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
              <input type="text" value={keluarga.nama || ''} onChange={(e) => { const l = [...keluargaList]; l[idx].nama = e.target.value; setKeluargaList(l); }} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" placeholder="Nama..." />
            </div>
            <div>
              <label className="block text-[10px] sm:text-xs font-semibold text-stone-500 mb-1.5 truncate flex justify-between items-center"><span>Nama Panggilan <span className="text-red-500">*</span></span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
              <input type="text" value={keluarga.nama_panggilan || ''} onChange={(e) => { const l = [...keluargaList]; l[idx].nama_panggilan = e.target.value; setKeluargaList(l); }} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-[#fdfaf2]/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" placeholder="Panggilan..." />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">No. WhatsApp</label>
              <input type="tel" value={keluarga.whatsapp || ''} inputMode="numeric" onChange={(e) => { const l = [...keluargaList]; l[idx].whatsapp = formatPhoneInput(e.target.value); setKeluargaList(l); }} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" placeholder="08..." />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">Instagram (Opsional)</label>
              <input type="text" value={keluarga.instagram || ''} onChange={(e) => { const l = [...keluargaList]; l[idx].instagram = formatSocialInput(e.target.value); setKeluargaList(l); }} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" placeholder="@username" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
