import React from "react";
import { formatPhoneInput, formatSocialInput } from "../../../../lib/inputFormatters";

interface Props {
  wanita: any;
  setWanita: (val: any) => void;
  pria: any;
  setPria: (val: any) => void;
}

export default function StepDataMempelai({ wanita, setWanita, pria, setPria }: Props) {
  return (
    <div className="space-y-8 pt-4">
      {/* CPW */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm transition-all duration-200 px-4 sm:px-6 py-5 sm:py-6 pt-7 space-y-4 relative">
        <div className="absolute -top-3 left-5">
          <span className="inline-flex items-center justify-center px-3 py-1.5 bg-[#FDF9F0] border border-[#DCAF43]/30 text-[#DCAF43] rounded-full text-[10px] font-bold tracking-wide uppercase shadow-sm">
            Data Mempelai Wanita
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex justify-between items-center"><span>Nama Lengkap <span className="text-red-500">*</span></span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
            <input type="text" value={wanita.nama_lengkap} onChange={(e) => setWanita({ ...wanita, nama_lengkap: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" placeholder="Contoh: Sarah Anastasya" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex justify-between items-center"><span>Panggilan <span className="text-red-500">*</span></span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
            <input type="text" value={wanita.nama_panggilan} onChange={(e) => setWanita({ ...wanita, nama_panggilan: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" placeholder="Contoh: Sarah" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex justify-between items-center"><span>Anak Ke <span className="text-red-500">*</span></span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
            <input type="number" value={wanita.anak_ke} onChange={(e) => setWanita({ ...wanita, anak_ke: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" placeholder="Contoh: Pertama" />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex justify-between items-center"><span>No. WhatsApp <span className="text-red-500">*</span></span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
            <input type="text" inputMode="numeric" value={wanita.whatsapp} onChange={(e) => setWanita({ ...wanita, whatsapp: formatPhoneInput(e.target.value) })} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" placeholder="08..." />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex justify-between items-center"><span>Instagram (Opsional)</span></label>
            <input type="text" value={wanita.instagram} onChange={(e) => setWanita({ ...wanita, instagram: formatSocialInput(e.target.value) })} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" placeholder="@username" />
          </div>
        </div>
      </div>

      {/* CPP */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm transition-all duration-200 px-4 sm:px-6 py-5 sm:py-6 pt-7 space-y-4 relative">
        <div className="absolute -top-3 left-5">
          <span className="inline-flex items-center justify-center px-3 py-1.5 bg-[#FDF9F0] border border-[#DCAF43]/30 text-[#DCAF43] rounded-full text-[10px] font-bold tracking-wide uppercase shadow-sm">
            Data Mempelai Pria
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex justify-between items-center"><span>Nama Lengkap <span className="text-red-500">*</span></span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
            <input type="text" value={pria.nama_lengkap} onChange={(e) => setPria({ ...pria, nama_lengkap: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" placeholder="Contoh: Tama Aditya" />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-stone-500 mb-1.5 flex justify-between items-center"><span>Panggilan <span className="text-red-500">*</span></span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
            <input type="text" value={pria.nama_panggilan} onChange={(e) => setPria({ ...pria, nama_panggilan: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" placeholder="Contoh: Tama" />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-stone-500 mb-1.5 flex justify-between items-center"><span>Anak Ke <span className="text-red-500">*</span></span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
            <input type="number" value={pria.anak_ke} onChange={(e) => setPria({ ...pria, anak_ke: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" placeholder="Contoh: Pertama" />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex justify-between items-center"><span>No. WhatsApp <span className="text-red-500">*</span></span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
            <input type="text" inputMode="numeric" value={pria.whatsapp} onChange={(e) => setPria({ ...pria, whatsapp: formatPhoneInput(e.target.value) })} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" placeholder="08..." />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">Instagram (Opsional)</label>
            <input type="text" value={pria.instagram} onChange={(e) => setPria({ ...pria, instagram: formatSocialInput(e.target.value) })} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" placeholder="@username" />
          </div>
        </div>
      </div>
    </div>
  );
}
