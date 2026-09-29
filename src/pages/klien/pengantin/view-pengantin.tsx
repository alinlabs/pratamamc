import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Copy, X, Instagram, Link as LinkIcon, User, Hash, Heart, Pencil, ChevronDown } from 'lucide-react';

interface PengantinCardProps {
  data: {
    nama: string;
    panggilan: string;
    peran: string;
    anak_ke?: string;
    whatsapp?: string;
    instagram?: string;
    imageUrl?: string;
  }
}

const formatWhatsApp = (phone: string) => {
  let cleaned = phone.replace(/[\s-]/g, '');
  if (cleaned.startsWith('08')) {
    cleaned = '628' + cleaned.slice(2);
  } else if (cleaned.startsWith('+62')) {
    cleaned = '62' + cleaned.slice(3);
  }
  return `https://wa.me/${cleaned}`;
};

const formatInstagram = (handle: string) => {
  let cleaned = handle.trim();
  if (cleaned.startsWith('@')) {
    cleaned = cleaned.slice(1);
  }
  return `https://instagram.com/${cleaned}`;
};

export function PengantinCard({ data }: PengantinCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [waCopied, setWaCopied] = useState(false);
  const [igCopied, setIgCopied] = useState(false);
  const [waLinkCopied, setWaLinkCopied] = useState(false);
  const [igLinkCopied, setIgLinkCopied] = useState(false);

  const handleCopyText = (e: React.MouseEvent, text: string, type: 'whatsapp' | 'instagram') => {
    e.stopPropagation();
    if (text) {
      navigator.clipboard.writeText(text);
      if (type === 'whatsapp') {
        setWaCopied(true);
        setTimeout(() => setWaCopied(false), 2000);
      } else {
        setIgCopied(true);
        setTimeout(() => setIgCopied(false), 2000);
      }
    }
  };

  const handleCopyLink = (e: React.MouseEvent, text: string, type: 'whatsapp' | 'instagram') => {
    e.stopPropagation();
    if (text) {
      const link = type === 'whatsapp' ? formatWhatsApp(text) : formatInstagram(text);
      navigator.clipboard.writeText(link);
      if (type === 'whatsapp') {
        setWaLinkCopied(true);
        setTimeout(() => setWaLinkCopied(false), 2000);
      } else {
        setIgLinkCopied(true);
        setTimeout(() => setIgLinkCopied(false), 2000);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const { nama, panggilan, peran, anak_ke, whatsapp, instagram, imageUrl } = data;

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="flex flex-col items-center justify-start h-full group cursor-pointer py-2 sm:py-4"
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border border-stone-200 flex items-center justify-center mb-4 sm:mb-5 shrink-0 overflow-hidden shadow-sm group-hover:shadow-md transition-all group-hover:border-stone-300">
          {imageUrl ? (
            <img 
              src={ imageUrl } 
              alt={nama || peran} 
              loading="lazy"
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <User className="w-8 h-8 sm:w-10 sm:h-10 text-stone-300 group-hover:text-stone-400 transition-colors" />
          )}
        </div>
        
        <div className="text-center flex-1 flex flex-col items-center w-full">
          <h3 className="font-semibold text-stone-700 text-sm sm:text-base leading-snug line-clamp-2 mb-1 px-1">
            {nama || panggilan || <span className="text-stone-400 italic font-normal text-xs sm:text-sm">Belum diisi</span>}
          </h3>
          <span className="text-stone-400 font-normal text-xs sm:text-sm text-center max-w-full leading-tight line-clamp-2 px-1">
            { peran }
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[100]"
            />
            
            <motion.div
              initial={{ opacity: 0, y: "100%", scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: "100%", scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl p-6 shadow-xl z-[101] max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.2 }}
              onDragEnd={(e, info) => {
                if (info.offset.y > 100 || info.velocity.y > 500) {
                  setIsOpen(false);
                }
              }}
            >
              <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto mb-6 md:hidden"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white border border-stone-200 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                    {imageUrl ? (
                      <img 
                        src={ imageUrl } 
                        alt={nama || peran} 
                        loading="lazy"
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <User className="w-7 h-7 text-stone-300" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-700">{nama || 'Nama Belum Diisi'}</h3>
                    <p className="text-stone-400 font-normal text-sm mt-1">{ peran }</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 -mr-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors hidden md:block"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                
                {/* Info Utama */}
                <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4 space-y-3 shadow-inner">
                  <div className="flex items-center gap-3 text-sm text-stone-700">
                    <User className="w-4 h-4 text-stone-400" />
                    <span className="font-medium min-w-24">Panggilan:</span>
                    <span>{panggilan || '-'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-stone-700">
                    <Hash className="w-4 h-4 text-blue-400" />
                    <span className="font-medium min-w-24">Anak Ke:</span>
                    <span>{anak_ke || '-'}</span>
                  </div>
                </div>

                <div 
                  onClick={() => whatsapp && window.open(formatWhatsApp(whatsapp), '_blank')}
                  className={`flex items-center justify-between p-4 bg-white border border-stone-200 rounded-2xl shadow-sm ${whatsapp ? 'cursor-pointer hover:border-green-300 hover:shadow-md transition-all' : 'opacity-70'}`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-green-50 text-green-600">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className={`font-medium truncate leading-tight ${whatsapp ? 'text-stone-800' : 'text-stone-400 italic'}`}>
                        {whatsapp || 'Kontak belum diisi'}
                      </p>
                      <p className="text-xs text-stone-400 font-light mt-0.5">Hubungi WhatsApp</p>
                    </div>
                  </div>
                  {whatsapp && (
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
                      <button 
                        onClick={(e) => handleCopyText(e, whatsapp, 'whatsapp')}
                        className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-50 rounded-xl transition-all"
                        title="Salin Nomor"
                      >
                        {waCopied ? <span className="text-[10px] sm:text-xs font-medium text-green-600">Tersalin</span> : <Copy className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={(e) => handleCopyLink(e, whatsapp, 'whatsapp')}
                        className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-50 rounded-xl transition-all"
                        title="Salin Link"
                      >
                        {waLinkCopied ? <span className="text-[10px] sm:text-xs font-medium text-green-600">Ter-link</span> : <LinkIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </div>

                <div 
                  onClick={() => instagram && window.open(formatInstagram(instagram), '_blank')}
                  className={`flex items-center justify-between p-4 bg-white border border-stone-200 rounded-2xl shadow-sm ${instagram ? 'cursor-pointer hover:border-pink-300 hover:shadow-md transition-all' : 'opacity-70'}`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-pink-50 text-pink-600">
                      <Instagram className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className={`font-medium truncate leading-tight ${instagram ? 'text-stone-800' : 'text-stone-400 italic'}`}>
                        {instagram || 'Instagram belum diisi'}
                      </p>
                      <p className="text-xs text-stone-400 font-light mt-0.5">Lihat Instagram</p>
                    </div>
                  </div>
                  {instagram && (
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
                      <button 
                        onClick={(e) => handleCopyText(e, instagram, 'instagram')}
                        className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-50 rounded-xl transition-all"
                        title="Salin Username"
                      >
                        {igCopied ? <span className="text-[10px] sm:text-xs font-medium text-stone-700">Tersalin</span> : <Copy className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={(e) => handleCopyLink(e, instagram, 'instagram')}
                        className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-50 rounded-xl transition-all"
                        title="Salin Link"
                      >
                        {igLinkCopied ? <span className="text-[10px] sm:text-xs font-medium text-stone-700">Ter-link</span> : <LinkIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

interface PengantinViewProps {
  event: any;
  onEdit?: () => void;
}

export default function PengantinView({ event, onEdit }: PengantinViewProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const p = event.pengantin || {};

  const cpp = {
    nama: p.nama_lengkap_pria,
    panggilan: p.nama_panggilan_pria || p.nama_panggilan_pri,
    peran: 'Mempelai Pria',
    anak_ke: p.anak_ke_pria,
    whatsapp: p.whatsapp_pria,
    instagram: p.instagram_pria,
  };

  const cpw = {
    nama: p.nama_lengkap_wanita,
    panggilan: p.nama_panggilan_wanita || p.nama_panggilan_wan,
    peran: 'Mempelai Wanita',
    anak_ke: p.anak_ke_wanita,
    whatsapp: p.whatsapp_wanita,
    instagram: p.instagram_wanita,
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-1"
    >
      <div>
        <div className="flex items-center justify-between gap-4 mb-6 w-full">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500" />
            Mempelai
          </h2>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-600 rounded-full transition-all shadow-sm active:scale-95 hover:scale-105 cursor-pointer"
                title="Edit Data Pengantin"
              >
                <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-stone-500" strokeWidth={2} />
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-600 rounded-full transition-all shadow-sm active:scale-95 hover:scale-105 cursor-pointer"
              title="Toggle Mempelai"
            >
              <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-stone-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} strokeWidth={2} />
            </button>
          </div>
        </div>
        
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
                <PengantinCard data={cpw} />
                <PengantinCard data={cpp} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
