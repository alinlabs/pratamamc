import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Pencil, Share2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import ContactCard from '../../../components/modal-detail';

interface DefaultWORole {
  id: number;
  peran: string;
  deskripsi: string;
  detail: string;
}

interface WOProps {
  timWO: { id?: string; kategori?: string; peran?: string; nama: string; contact?: string; whatsapp?: string; instagram?: string; website?: string; facebook?: string; youtube?: string; maps?: string; link?: string; logo?: string; gambar?: string; deskripsi?: string; detail?: string }[];
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

export default function DaftarWOView({ timWO, onEdit }: WOProps) {
  const [defaultRoles, setDefaultRoles] = useState<DefaultWORole[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    fetch('/data/default-wo.json')
      .then(res => res.json())
      .then(data => setDefaultRoles(data))
      .catch(err => console.error("Gagal memuat default wo roles", err));
  }, []);

  const activeWO = useMemo(() => {
    return (timWO || []).filter(t => t).map(t => {
      if (!t.deskripsi || !t.detail) {
        const found = defaultRoles.find(r => r.peran.toLowerCase() === (t.peran || '').toLowerCase());
        if (found) {
          return {
            ...t,
            deskripsi: t.deskripsi || found.deskripsi,
            detail: t.detail || found.detail
          };
        }
      }
      return t;
    });
  }, [timWO, defaultRoles]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-1"
    >
      <div className="pt-4">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-stone-800">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#DCAF43]" />
            Wedding Organizer
          </h3>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-600 rounded-full transition-all shadow-sm active:scale-95 hover:scale-105 cursor-pointer"
                title="Edit Tim WO"
              >
                <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-stone-500" strokeWidth={2} />
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-600 rounded-full transition-all shadow-sm active:scale-95 hover:scale-105 cursor-pointer"
              title="Toggle WO"
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
            {activeWO.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-6 sm:gap-y-8 sm:grid-cols-3 lg:grid-cols-4 pt-2">
                {activeWO.map((t, index) => (
                  <ContactCard
                    key={`${t.id || 'wo'}-${index}`} 
                    nama={t.nama} 
                    peran={t.kategori || t.peran || 'PIC WO'} 
                    whatsapp={t.whatsapp || t.contact}
                    instagram={t.instagram}
                    socialMedia={mapSocialMedia(t)}
                    imageUrl={t.logo || t.gambar}
                    deskripsi={t.deskripsi}
                    detail={t.detail}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-stone-50/50 rounded-2xl border border-dashed border-stone-200 pt-2">
                <Users className="w-8 h-8 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500 text-sm font-medium">Belum ada tim Wedding Organizer yang ditambahkan.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

interface WOCardProps {
  key?: React.Key;
  wo: any;
  index: number;
  handleWOFieldChange: (index: number, field: string, value: any) => void;
  handleRemoveWO: (index: number) => void;
  DEFAULT_WO_ROLES: any[];
  expandedWO: number[];
  toggleWOExpanded: (index: number) => void;
}

export function WOCard({
  wo,
  index,
  handleWOFieldChange,
  handleRemoveWO,
  DEFAULT_WO_ROLES,
  expandedWO,
  toggleWOExpanded
}: WOCardProps) {
  const isCustomWO = wo.isCustom || !DEFAULT_WO_ROLES.some(role => role.peran.toLowerCase() === (wo.peran || '').toLowerCase());

  return (
    <div className="relative bg-white border border-stone-200 shadow-sm rounded-2xl p-5">
      {isCustomWO && (
        <button
          type="button"
          onClick={() => handleRemoveWO(index)}
          className="absolute top-3 right-3 text-stone-400 hover:text-red-500 transition-colors p-1.5 bg-stone-50 hover:bg-red-50 rounded-lg cursor-pointer z-10"
          title="Hapus"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column (Main Info) */}
        <div className="space-y-4">
          {/* Badge Peran */}
          <div className="flex items-center justify-between">
            {isCustomWO ? (
              <div className="w-full mr-4">
                <label className="block text-[11px] font-semibold text-stone-500 mb-1.5">Peran Custom PIC</label>
                <input
                  type="text"
                  value={wo.peran || ''}
                  onChange={(e) => handleWOFieldChange(index, 'peran', e.target.value)}
                  placeholder="Ketik peran PIC..."
                  className="w-full px-3 py-1.5 text-xs font-bold border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-lg focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
                />
              </div>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#DCAF43]/10 text-[#DCAF43] border border-[#DCAF43]/20 uppercase tracking-wider">
                {wo.peran || 'PIC Role'}
              </span>
            )}
          </div>
          
          {/* Input Nama */}
          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">Nama PIC</label>
            <input
              type="text"
              value={wo.nama || ''}
              onChange={(e) => handleWOFieldChange(index, 'nama', e.target.value)}
              placeholder="Nama personil..."
              className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
            />
          </div>
          
          {/* Input Whatsapp & Instagram */}
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">WhatsApp</label>
              <input type="tel" value={wo.whatsapp || ''}
                inputMode="numeric" onChange={(e) => handleWOFieldChange(index, 'whatsapp', e.target.value)}
                placeholder="0812..."
                className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">Instagram (Opsional)</label>
              <input
                type="text"
                value={wo.instagram || ''}
                onChange={(e) => handleWOFieldChange(index, 'instagram', e.target.value)}
                placeholder="@username..."
                className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Right Column (Always Visible on Desktop) */}
        {(!isCustomWO || (isCustomWO && (wo.deskripsi || wo.detail))) && (
          <div className="hidden md:block space-y-4">
            <h5 className="text-xs font-bold text-[#DCAF43] uppercase tracking-wider">Deskripsi & Detail Tugas</h5>
            
            {(wo.deskripsi || isCustomWO) && (
              <div>
                <span className="font-bold text-[11px] text-stone-500 block mb-1">Deskripsi Singkat:</span>
                <div className="text-xs text-stone-600 bg-stone-50/50 p-2.5 rounded-xl relative">
                  {isCustomWO ? (
                    <textarea 
                      value={wo.deskripsi || ''} 
                      onChange={e => handleWOFieldChange(index, 'deskripsi', e.target.value)} 
                      className="w-full bg-transparent border-none focus:ring-0 focus:outline-none focus:ring-0 resize-none m-0 p-0" 
                      rows={2} 
                      placeholder="Deskripsi PIC..." 
                    />
                  ) : (
                    wo.deskripsi
                  )}
                </div>
              </div>
            )}
            
            {(wo.detail || isCustomWO) && (
              <div>
                <span className="font-bold text-[11px] text-stone-500 block mb-1">Tugas Detail:</span>
                <div className="leading-relaxed bg-stone-50/70 p-2.5 rounded-xl text-xs text-stone-600 font-light">
                  {isCustomWO ? (
                    <textarea 
                      value={wo.detail || ''} 
                      onChange={e => handleWOFieldChange(index, 'detail', e.target.value)} 
                      className="w-full bg-transparent border-none focus:ring-0 focus:outline-none focus:ring-0 resize-none m-0 p-0" 
                      rows={3} 
                      placeholder="Detail tugas..." 
                    />
                  ) : (
                    <div className="whitespace-pre-line">{wo.detail}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Deskripsi & Detail Toggle (Mobile Collapsible) */}
      {(!isCustomWO || (isCustomWO && (wo.deskripsi || wo.detail))) && (
        <div className="md:hidden pt-2 mt-2">
          <button
            type="button"
            onClick={() => toggleWOExpanded(index)}
            className="w-full flex items-center justify-between text-xs font-medium text-stone-600 hover:text-stone-800 p-2 rounded-lg hover:bg-stone-50 transition-colors"
          >
            <span>Deskripsi & Detail Tugas</span>
            {expandedWO.includes(index) ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
          </button>
          
          {expandedWO.includes(index) && (
            <div className="mt-3 space-y-3 animate-in slide-in-from-top-2 duration-200">
              {(wo.deskripsi || isCustomWO) && (
                <div>
                  <span className="font-bold text-[11px] text-stone-500 block mb-1">Deskripsi Singkat:</span>
                  <div className="text-xs text-stone-600 bg-stone-50/50 p-2.5 rounded-xl relative">
                    {isCustomWO ? (
                      <textarea 
                        value={wo.deskripsi || ''} 
                        onChange={e => handleWOFieldChange(index, 'deskripsi', e.target.value)} 
                        className="w-full bg-transparent border-none focus:ring-0 focus:outline-none focus:ring-0 resize-none m-0 p-0" 
                        rows={2} 
                        placeholder="Deskripsi PIC..." 
                      />
                    ) : (
                      wo.deskripsi
                    )}
                  </div>
                </div>
              )}
              
              {(wo.detail || isCustomWO) && (
                <div>
                  <span className="font-bold text-[11px] text-stone-500 block mb-1">Tugas Detail:</span>
                  <div className="leading-relaxed bg-stone-100/50 p-2.5 rounded-xl text-xs text-stone-600 font-light">
                    {isCustomWO ? (
                      <textarea 
                        value={wo.detail || ''} 
                        onChange={e => handleWOFieldChange(index, 'detail', e.target.value)} 
                        className="w-full bg-transparent border-none focus:ring-0 focus:outline-none focus:ring-0 resize-none m-0 p-0" 
                        rows={3} 
                        placeholder="Detail tugas..." 
                      />
                    ) : (
                      <div className="whitespace-pre-line">{wo.detail}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
