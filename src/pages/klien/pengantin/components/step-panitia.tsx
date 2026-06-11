import React from "react";
import { formatPhoneInput } from "../../../../lib/inputFormatters";

interface Props {
  panitiaList: any[];
  setPanitiaList: (val: any[]) => void;
}

export default function StepPanitia({ panitiaList, setPanitiaList }: Props) {
  return (
    <div className="pt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-8">
        {panitiaList.map((panitia, idx) => (
          <div key={idx} className="relative bg-white border border-stone-200 shadow-sm rounded-2xl p-5 sm:p-6 pt-7 space-y-4">
            <div className="absolute -top-3 left-5">
              <span className="inline-flex items-center justify-center px-3 py-1.5 bg-[#FDF9F0] border border-[#DCAF43]/30 text-[#DCAF43] rounded-full text-[10px] font-bold tracking-wide uppercase shadow-sm">
                {panitia.peran}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex justify-between items-center">
                  <span>
                    Nama Perwakilan
                    {['Koordinator Keluarga Wanita', 'Koordinator Keluarga Pria', 'PIC Bunga', 'Perwakilan Sambutan Pria', 'Perwakilan Sambutan Wanita', 'Petugas KUA', 'Pembaca Al-Quran'].includes(panitia.peran) && <span className="text-red-500 ml-1">*</span>}
                  </span>
                  {['Koordinator Keluarga Wanita', 'Koordinator Keluarga Pria', 'PIC Bunga', 'Perwakilan Sambutan Pria', 'Perwakilan Sambutan Wanita', 'Petugas KUA', 'Pembaca Al-Quran'].includes(panitia.peran) && (
                    <span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Nama Lengkap..."
                  value={panitia.nama || ''}
                  onChange={(e) => {
                    const l = [...panitiaList];
                    l[idx].nama = e.target.value;
                    setPanitiaList(l);
                  }}
                  className="w-full px-3.5 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex justify-between items-center">
                  <span>
                    WhatsApp / No HP
                    {['Koordinator Keluarga Wanita', 'Koordinator Keluarga Pria'].includes(panitia.peran) && <span className="text-red-500 ml-1">*</span>}
                  </span>
                  {['Koordinator Keluarga Wanita', 'Koordinator Keluarga Pria'].includes(panitia.peran) && (
                    <span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span>
                  )}
                </label>
                <input
                  type="text" inputMode="numeric"
                  placeholder="08..."
                  value={panitia.whatsapp || ''}
                  onChange={(e) => {
                    const l = [...panitiaList];
                    l[idx].whatsapp = formatPhoneInput(e.target.value);
                    setPanitiaList(l);
                  }}
                  className="w-full px-3.5 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
