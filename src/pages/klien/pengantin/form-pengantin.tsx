import React, { useState } from 'react';
import FormLayout from '../components/layout-form';
import { formatPhoneInput, formatSocialInput } from '../../../lib/inputFormatters';

export default function PengantinForm({ eventData, onClose }: { eventData: any, onClose: () => void }) {
  const [formData, setFormData] = useState({
    pengantin: eventData.pengantin ? {
      ...eventData.pengantin,
      nama_panggilan_pria: eventData.pengantin.nama_panggilan_pria || eventData.pengantin.nama_panggilan_pri || '',
      nama_panggilan_wanita: eventData.pengantin.nama_panggilan_wanita || eventData.pengantin.nama_panggilan_wan || '',
      whatsapp_pria: formatPhoneInput(eventData.pengantin.whatsapp_pria || ''),
      instagram_pria: formatSocialInput(eventData.pengantin.instagram_pria || ''),
      whatsapp_wanita: formatPhoneInput(eventData.pengantin.whatsapp_wanita || ''),
      instagram_wanita: formatSocialInput(eventData.pengantin.instagram_wanita || '')
    } : {
      nama_lengkap_pria: '', nama_panggilan_pria: '', anak_ke_pria: '', whatsapp_pria: '', instagram_pria: '',
      nama_lengkap_wanita: '', nama_panggilan_wanita: '', anak_ke_wanita: '', whatsapp_wanita: '', instagram_wanita: ''
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    
    if (name.includes('whatsapp')) {
      value = formatPhoneInput(value);
    } else if (name.includes('instagram')) {
      value = formatSocialInput(value);
    }

    setFormData((prev: any) => ({
      ...prev,
      pengantin: {
        ...prev.pengantin,
        [name]: value
      }
    }));
  };

  return (
    <FormLayout title="Mempelai" onClose={onClose} eventData={eventData} formData={formData}>
      <div className="space-y-5">
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm transition-all duration-200 group px-4 sm:px-6 py-5 sm:py-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="px-3 py-1 bg-[#DCAF43]/10 text-[#DCAF43] rounded-lg font-semibold text-xs border border-[#DCAF43]/20">
                Data Mempelai Pria
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 pt-4 border-t border-stone-100/80 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] sm:text-xs font-semibold text-stone-500 mb-1.5">Nama Lengkap</label>
                <input type="text" name="nama_lengkap_pria" value={formData.pengantin.nama_lengkap_pria || ''} onChange={handleChange} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" />
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-stone-500 mb-1.5">Panggilan</label>
                <input type="text" name="nama_panggilan_pria" value={formData.pengantin.nama_panggilan_pria || ''} onChange={handleChange} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" />
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-stone-500 mb-1.5">Anak Ke</label>
                <input type="number" name="anak_ke_pria" value={formData.pengantin.anak_ke_pria || ''} onChange={handleChange} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-[10px] sm:text-xs font-semibold text-stone-500 mb-1.5">No. WhatsApp</label>
                <input type="text" inputMode="numeric" name="whatsapp_pria" value={formData.pengantin.whatsapp_pria || ''} onChange={handleChange} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-[10px] sm:text-xs font-semibold text-stone-500 mb-1.5">Instagram (Opsional)</label>
                <input type="text" name="instagram_pria" value={formData.pengantin.instagram_pria || ''} onChange={handleChange} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm transition-all duration-200 group px-4 sm:px-6 py-5 sm:py-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="px-3 py-1 bg-[#DCAF43]/10 text-[#DCAF43] rounded-lg font-semibold text-xs border border-[#DCAF43]/20">
                Data Mempelai Wanita
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 pt-4 border-t border-stone-100/80 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] sm:text-xs font-semibold text-stone-500 mb-1.5">Nama Lengkap</label>
                <input type="text" name="nama_lengkap_wanita" value={formData.pengantin.nama_lengkap_wanita || ''} onChange={handleChange} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" />
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-stone-500 mb-1.5">Panggilan</label>
                <input type="text" name="nama_panggilan_wanita" value={formData.pengantin.nama_panggilan_wanita || ''} onChange={handleChange} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" />
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold text-stone-500 mb-1.5">Anak Ke</label>
                <input type="number" name="anak_ke_wanita" value={formData.pengantin.anak_ke_wanita || ''} onChange={handleChange} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-[10px] sm:text-xs font-semibold text-stone-500 mb-1.5">No. WhatsApp</label>
                <input type="text" inputMode="numeric" name="whatsapp_wanita" value={formData.pengantin.whatsapp_wanita || ''} onChange={handleChange} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-[10px] sm:text-xs font-semibold text-stone-500 mb-1.5">Instagram (Opsional)</label>
                <input type="text" name="instagram_wanita" value={formData.pengantin.instagram_wanita || ''} onChange={handleChange} className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormLayout>
  );
}
