import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Copy, X, Phone, Instagram, Globe, Facebook, Youtube, MapPin, User, ExternalLink, Link as LinkIcon, Smartphone } from 'lucide-react';

interface ContactCardProps {
  key?: React.Key;
  nama: string;
  peran: string;
  nama_panggilan?: string;
  whatsapp?: string;
  instagram?: string;
  socialMedia?: { platform: string; url: string }[];
  imageUrl?: string;
  deskripsi?: string;
  detail?: string;
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

const getSocialIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('instagram')) return <Instagram className="w-5 h-5 text-pink-600" />;
  if (p.includes('facebook')) return <Facebook className="w-5 h-5 text-blue-600" />;
  if (p.includes('youtube')) return <Youtube className="w-5 h-5 text-red-600" />;
  if (p.includes('tiktok')) return <Smartphone className="w-5 h-5 text-stone-800" />;
  if (p.includes('map') || p.includes('lokasi')) return <MapPin className="w-5 h-5 text-stone-600" />;
  if (p.includes('web')) return <Globe className="w-5 h-5 text-stone-600" />;
  return <Globe className="w-5 h-5 text-stone-600" />;
};

export default function ContactCard({ nama: name, peran: role, nama_panggilan, whatsapp, instagram, socialMedia, imageUrl, deskripsi, detail }: ContactCardProps) {
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

  const handleCardClick = () => {
    setIsOpen(true);
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

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="flex flex-col items-center justify-start h-full group cursor-pointer py-2 sm:py-4"
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border border-stone-200 flex items-center justify-center mb-4 sm:mb-5 shrink-0 overflow-hidden shadow-sm group-hover:shadow-md transition-all group-hover:border-stone-300">
          {imageUrl ? (
            <img 
              src={ imageUrl } 
              alt={name || role} 
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
            {name || <span className="text-stone-400 italic font-normal text-xs sm:text-sm">Belum diisi</span>}
          </h3>
          <span className="text-stone-400 font-normal text-xs sm:text-sm text-center max-w-full leading-tight line-clamp-2 px-1">
            { role }
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
              className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl p-6 shadow-xl z-[101]"
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
                        alt={name || role} 
                        loading="lazy"
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <User className="w-7 h-7 text-stone-300" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-700">{name || role}</h3>
                    <p className="text-stone-400 font-normal text-sm mt-1">{ role }</p>
                    {nama_panggilan && (
                      <p className="text-[#DCAF43] font-medium text-sm mt-1">Dipanggil: "{nama_panggilan}"</p>
                    )}
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
                {(deskripsi || detail) && (
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 mb-4">
                    {deskripsi && (
                      <div className="mb-3">
                        <span className="font-bold text-[11px] text-stone-500 block mb-1">Deskripsi Singkat:</span>
                        <p className="text-xs text-stone-600 leading-relaxed">{deskripsi}</p>
                      </div>
                    )}
                    {detail && (
                      <div>
                        <span className="font-bold text-[11px] text-stone-500 block mb-1">Tugas Detail:</span>
                        <p className="text-xs text-stone-600 font-light leading-relaxed whitespace-pre-line">{detail}</p>
                      </div>
                    )}
                  </div>
                )}
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
                      <p className="text-xs text-stone-400 font-light mt-0.5">Hubungi Kontak</p>
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
                        {instagram || 'Username belum diisi'}
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

                {socialMedia && socialMedia.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {socialMedia.map((sm, idx) => (
                      <a
                        key={idx}
                        href={sm.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full p-3 border border-stone-200 text-stone-700 text-sm rounded-xl font-medium hover:bg-stone-50 transition-colors"
                      >
                        {getSocialIcon(sm.platform)}
                        {sm.platform}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
