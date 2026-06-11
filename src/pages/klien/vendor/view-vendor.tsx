import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, Pencil, Users, Share2, Trash2, Sparkles, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import ContactCard from '../../../components/modal-detail';
import { DEFAULT_CATEGORIES } from './form-vendor';

interface VendorProps {
  vendor: { id?: string; kategori: string; nama: string; contact?: string; whatsapp?: string; instagram?: string; website?: string; facebook?: string; youtube?: string; maps?: string; link?: string; logo?: string; gambar?: string; deskripsi?: string }[];
  timWO?: { id?: string; kategori?: string; peran?: string; nama: string; contact?: string; whatsapp?: string; instagram?: string; website?: string; facebook?: string; youtube?: string; maps?: string; link?: string; logo?: string; gambar?: string; deskripsi?: string }[];
  onEdit?: () => void;
}

const mapSocialMedia = (v: any) => {
  const sm = [];
  if (v.website) sm.push({ platform: 'Website', url: v.website.startsWith('http') ? v.website : `https://${v.website}` });
  if (v.facebook) sm.push({ platform: 'Facebook', url: v.facebook.startsWith('http') ? v.facebook : `https://facebook.com/${v.facebook}` });
  if (v.youtube) sm.push({ platform: 'Youtube', url: v.youtube.startsWith('http') ? v.youtube : `https://youtube.com/@${v.youtube.replace('@', '')}` });
  if (v.tiktok) sm.push({ platform: 'TikTok', url: v.tiktok.startsWith('http') ? v.tiktok : `https://tiktok.com/@${v.tiktok.replace('@', '')}` });
  if (v.peta || v.maps) sm.push({ platform: 'Maps', url: v.peta || v.maps });
  if (v.tautan || v.link) sm.push({ platform: 'Link', url: v.tautan || v.link });
  return sm;
};

export default function DaftarVendorView({ vendor, timWO, onEdit }: VendorProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const activeVendors = useMemo(() => {
    const providedVendors = (vendor || []).filter(v => v);
    const mergedVendors = DEFAULT_CATEGORIES.map(cat => {
      const existing = providedVendors.find(v => v && (v.kategori || '').toLowerCase() === cat.toLowerCase());
      if (existing) {
        return {
          ...existing,
          kategori: cat,
          nama: existing.nama && existing.nama.trim() !== '' ? existing.nama : '-'
        };
      }
      return { kategori: cat, nama: '-' };
    });

    // Add extra custom categories not present in default categories list
    providedVendors.forEach((v: any) => {
      if (v && v.kategori && v.nama && v.nama.trim() !== '') {
        const isDefault = DEFAULT_CATEGORIES.some(cat => cat.toLowerCase() === v.kategori.toLowerCase());
        if (!isDefault) {
          mergedVendors.push(v);
        }
      }
    });

    mergedVendors.sort((a, b) => {
      const aFilled = a.nama !== '-';
      const bFilled = b.nama !== '-';
      if (aFilled && !bFilled) return -1;
      if (!aFilled && bFilled) return 1;
      return 0;
    });

    return mergedVendors;
  }, [vendor]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-1"
    >
      {/* VENDOR PARTNERS SECTION */}
      <div>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-stone-800">
            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-[#DCAF43]" />
            Vendor Tersedia
          </h2>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-600 rounded-full transition-all shadow-sm active:scale-95 hover:scale-105 cursor-pointer"
                title="Edit Vendor"
              >
                <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-stone-500" strokeWidth={2} />
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-600 rounded-full transition-all shadow-sm active:scale-95 hover:scale-105 cursor-pointer"
              title="Toggle Vendor"
            >
              <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-stone-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} strokeWidth={2} />
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {activeVendors.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-6 sm:gap-y-8 sm:grid-cols-3 lg:grid-cols-4 pt-2">
                {activeVendors.map((v, index) => (
                  <ContactCard
                    key={`${v.id || 'vendor'}-${index}`} 
                    nama={v.nama} 
                    peran={v.kategori} 
                    whatsapp={v.whatsapp || v.contact}
                    instagram={v.instagram}
                    socialMedia={mapSocialMedia(v)}
                    imageUrl={v.logo || v.gambar}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-stone-50/50 rounded-2xl border border-dashed border-stone-200 pt-2">
                <Briefcase className="w-8 h-8 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500 text-sm">Tidak ada vendor yang ditemukan.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

interface VendorCardProps {
  key?: React.Key;
  v: any;
  index: number;
  masterVendors: any[];
  activeDropdownIndex: number | null;
  setActiveDropdownIndex: (idx: number | null) => void;
  handleVendorFieldChange: (index: number, field: string, value: any) => void;
  handleRemoveVendor: (index: number) => void;
  handleSelectVendorOption: (index: number, option: any) => void;
  handleCreateNewVendorOption: (index: number, name: string) => void;
  DEFAULT_CATEGORIES: string[];
}

export function VendorCard({
  v,
  index,
  masterVendors,
  activeDropdownIndex,
  setActiveDropdownIndex,
  handleVendorFieldChange,
  handleRemoveVendor,
  handleSelectVendorOption,
  handleCreateNewVendorOption,
  DEFAULT_CATEGORIES
}: VendorCardProps) {
  const isCustomVendor = v.isCustom || !DEFAULT_CATEGORIES.some(cat => cat.toLowerCase() === (v.kategori || '').toLowerCase());
  
  // Custom state for mobile description toggle if not handled in parent
  // If the user hasn't opened it and it's empty, we hide it.
  const [isDescOpenMobile, setIsDescOpenMobile] = useState(!!v.deskripsi && v.deskripsi.trim() !== '');

  return (
    <div className="relative group bg-white border border-stone-200 shadow-sm rounded-2xl p-5 sm:p-6 pt-7">
      {/* Floating Badge */}
      <div className="absolute -top-3 left-5 z-20">
        <span className="inline-flex items-center justify-center px-3 py-1.5 bg-[#FDF9F0] border border-[#DCAF43]/30 text-[#DCAF43] rounded-full text-[10px] font-bold tracking-wide uppercase shadow-sm">
          {v.kategori || `Vendor #${index + 1}`}
        </span>
      </div>

      {isCustomVendor && (
        <button
          type="button"
          onClick={() => handleRemoveVendor(index)}
          className="absolute top-3 right-3 text-stone-400 hover:text-red-500 transition-colors p-1.5 bg-stone-50 hover:bg-red-50 rounded-lg cursor-pointer z-10"
          title="Hapus"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      <div className="space-y-4">
        {/* New Vendor Info Banner */}
        {v.isNewVendor && (
          <div className="text-[11px] bg-amber-50/70 border border-amber-100 text-amber-800 rounded-xl px-3.5 py-2 font-medium flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Vendor baru terdeteksi. Sistem akan otomatis mendaftarkan dan membuat ID baru di database master saat disimpan.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column (Main Info) - stacked vertically */}
          <div className="space-y-4 w-full">
            {isCustomVendor && (
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Kategori / Layanan</label>
                <input
                  type="text"
                  value={v.kategori || ''}
                  onChange={(e) => handleVendorFieldChange(index, 'kategori', e.target.value)}
                  placeholder="Contoh: Catering, Dekorasi, dll."
                  className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
                />
              </div>
            )}

            <div className="relative">
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">Nama Vendor</label>
              <input
                type="text"
                value={v.nama || ''}
                onChange={(e) => handleVendorFieldChange(index, 'nama', e.target.value)}
                onFocus={() => setActiveDropdownIndex(index)}
                onBlur={() => {
                  setTimeout(() => {
                    setActiveDropdownIndex(null);
                  }, 200);
                }}
                placeholder="Nama brand vendor..."
                className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
              />
              {activeDropdownIndex === index && (() => {
                const matchedOptions = masterVendors.filter((mv: any) => {
                  const isSameCategory = (mv.kategori || '').toLowerCase().trim() === (v.kategori || '').toLowerCase().trim();
                  if (!isSameCategory) return false;
                  
                  if (!v.nama) return true;
                  return (mv.nama || '').toLowerCase().includes((v.nama || '').toLowerCase());
                });

                const exactMatchExists = masterVendors.some((mv: any) => 
                  (mv.nama || '').toLowerCase().trim() === (v.nama || '').toLowerCase().trim() &&
                  (mv.kategori || '').toLowerCase().trim() === (v.kategori || '').toLowerCase().trim()
                );

                if (matchedOptions.length === 0 && (!v.nama || v.nama.trim() === '')) return null;

                return (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-stone-200 rounded-xl shadow-lg z-50 max-h-56 overflow-y-auto divide-y divide-stone-100 scrollbar-thin">
                    {matchedOptions.map((option: any) => (
                      <div
                        key={option.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectVendorOption(index, option);
                        }}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-stone-50 cursor-pointer transition-colors flex items-center gap-3"
                      >
                        {option.logo ? (
                          <img
                            src={option.logo}
                            alt={option.nama}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-full border border-stone-200 object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 text-stone-400 font-bold flex items-center justify-center shrink-0 text-xs uppercase">
                            {option.nama ? option.nama.charAt(0) : 'V'}
                          </div>
                        )}
                        <div className="space-y-0.5">
                          <div className="font-semibold text-stone-800">
                            {option.nama}
                          </div>
                          {option.deskripsi && (
                            <div className="text-[11px] text-stone-400 line-clamp-1 font-light">
                              {option.deskripsi}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {v.nama && v.nama.trim() !== '' && !exactMatchExists && (
                      <div
                        key="new-custom-vendor-btn"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleCreateNewVendorOption(index, v.nama);
                        }}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-amber-50/50 bg-amber-50/15 cursor-pointer transition-colors flex items-center justify-between border-t border-stone-105"
                      >
                        <div className="space-y-0.5">
                          <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                            <span>Gunakan &ldquo;{v.nama}&rdquo;</span>
                            <span className="inline-flex items-center gap-0.5 text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-md font-bold border border-amber-150">
                              VENDOR BARU
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-500 font-medium">
                            ID dan data vendor akan dibuat secara otomatis saat disimpan.
                          </div>
                        </div>
                        <Plus className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">Kontak WhatsApp</label>
              <input type="tel" value={v.whatsapp || ''}
                inputMode="numeric" onChange={(e) => handleVendorFieldChange(index, 'whatsapp', e.target.value)}
                placeholder="Nomor ponsel/WA..."
                className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
              />
            </div>

            {/* Desktop Description Field Always Visible. Mobile relies on toggle. */}
            <div className="hidden md:block">
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">Deskripsi Vendor</label>
              <input
                type="text"
                value={v.deskripsi || ''}
                onChange={(e) => handleVendorFieldChange(index, 'deskripsi', e.target.value)}
                placeholder="Rincian layanan, info harga paket, notes..."
                className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
              />
            </div>

            {/* Mobile Expand / Collapse for Description */}
            <div className="md:hidden mt-2 pt-2 border-t border-stone-100/60">
              <button
                type="button"
                onClick={() => setIsDescOpenMobile(!isDescOpenMobile)}
                className="w-full flex items-center justify-between text-xs font-medium text-stone-600 hover:text-stone-800 p-2 rounded-lg hover:bg-stone-50 transition-colors"
              >
                <span>Deskripsi Vendor</span>
                {isDescOpenMobile ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
              </button>
              
               {isDescOpenMobile && (
                  <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
                    <textarea
                      value={v.deskripsi || ''}
                      onChange={(e) => handleVendorFieldChange(index, 'deskripsi', e.target.value)}
                      placeholder="Rincian layanan, info harga paket, notes..."
                      rows={3}
                      className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm resize-none"
                    />
                  </div>
               )}
            </div>
          </div>

          {/* Right Column (Social Media on Desktop - Removed dividing border) */}
          <div className="hidden md:block space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Instagram</label>
                <input
                  type="text"
                  value={v.instagram || ''}
                  onChange={(e) => handleVendorFieldChange(index, 'instagram', e.target.value)}
                  placeholder="@username..."
                  className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">TikTok</label>
                <input
                  type="text"
                  value={v.tiktok || ''}
                  onChange={(e) => handleVendorFieldChange(index, 'tiktok', e.target.value)}
                  placeholder="@username..."
                  className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Facebook</label>
                <input
                  type="text"
                  value={v.facebook || ''}
                  onChange={(e) => handleVendorFieldChange(index, 'facebook', e.target.value)}
                  placeholder="Nama / Tautan profil..."
                  className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">YouTube</label>
                <input
                  type="text"
                  value={v.youtube || ''}
                  onChange={(e) => handleVendorFieldChange(index, 'youtube', e.target.value)}
                  placeholder="Tautan channel..."
                  className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Website</label>
                <input
                  type="text"
                  value={v.website || ''}
                  onChange={(e) => handleVendorFieldChange(index, 'website', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Peta/Maps</label>
                <input
                  type="text"
                  value={v.peta || ''}
                  onChange={(e) => handleVendorFieldChange(index, 'peta', e.target.value)}
                  placeholder="Tautan Google Maps..."
                  className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Collapsible Social Media block (md:hidden) */}
        <div className="md:hidden pt-2 mt-2 border-t border-stone-100/60">
          <button
            type="button"
            onClick={() => handleVendorFieldChange(index, '_isSosmedExpanded', !v._isSosmedExpanded)}
            className="w-full flex items-center justify-between text-xs font-medium text-stone-600 hover:text-stone-800 p-2 rounded-lg hover:bg-stone-50 transition-colors"
          >
            <span>Sosial Media & Tautan</span>
            {v._isSosmedExpanded ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
          </button>
          
          {v._isSosmedExpanded && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 bg-stone-50/50 p-4 rounded-xl border border-stone-100 animate-in slide-in-from-top-2 duration-200">
              <div>
                <label className="block text-[11px] font-semibold text-stone-500 mb-1.5">Instagram</label>
                <input
                  type="text"
                  value={v.instagram || ''}
                  onChange={(e) => handleVendorFieldChange(index, 'instagram', e.target.value)}
                  placeholder="@username..."
                  className="w-full px-3 py-2 text-sm border border-stone-200 bg-white focus:bg-white rounded-lg focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-500 mb-1.5">TikTok</label>
                <input
                  type="text"
                  value={v.tiktok || ''}
                  onChange={(e) => handleVendorFieldChange(index, 'tiktok', e.target.value)}
                  placeholder="@username..."
                  className="w-full px-3 py-2 text-sm border border-stone-200 bg-white focus:bg-white rounded-lg focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-500 mb-1.5">Facebook</label>
                <input
                  type="text"
                  value={v.facebook || ''}
                  onChange={(e) => handleVendorFieldChange(index, 'facebook', e.target.value)}
                  placeholder="Nama / Tautan profil..."
                  className="w-full px-3 py-2 text-sm border border-stone-200 bg-white focus:bg-white rounded-lg focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-500 mb-1.5">YouTube</label>
                <input
                  type="text"
                  value={v.youtube || ''}
                  onChange={(e) => handleVendorFieldChange(index, 'youtube', e.target.value)}
                  placeholder="Tautan channel..."
                  className="w-full px-3 py-2 text-sm border border-stone-200 bg-white focus:bg-white rounded-lg focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-500 mb-1.5">Website</label>
                <input
                  type="text"
                  value={v.website || ''}
                  onChange={(e) => handleVendorFieldChange(index, 'website', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-sm border border-stone-200 bg-white focus:bg-white rounded-lg focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-500 mb-1.5">Peta/Maps</label>
                <input
                  type="text"
                  value={v.peta || ''}
                  onChange={(e) => handleVendorFieldChange(index, 'peta', e.target.value)}
                  placeholder="Tautan Google Maps..."
                  className="w-full px-3 py-2 text-sm border border-stone-200 bg-white focus:bg-white rounded-lg focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Indikator data yang sudah terisi saat tersembunyi */}
          {!v._isSosmedExpanded && ['instagram', 'tiktok', 'facebook', 'youtube', 'website', 'peta'].filter(p => v[p] && v[p].trim() !== '').length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {['instagram', 'tiktok', 'facebook', 'youtube', 'website', 'peta'].map(p => {
                if (v[p] && v[p].trim() !== '') {
                  return (
                    <span key={p} className="text-[9px] px-2 py-1 rounded-md bg-stone-50 border border-stone-200 text-stone-500">
                      {p.charAt(0).toUpperCase() + p.slice(1)} <span className="opacity-50 ml-0.5 max-w-[60px] truncate inline-block align-bottom">{v[p]}</span>
                    </span>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
