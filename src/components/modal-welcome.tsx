import React, { useState, useEffect } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import LoadingSpinner from './screen-loading';

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const location = useLocation();
  const isMCRoute = ['/', '/portofolio', '/kontak', '/rencana', '/edukasi'].includes(location.pathname) || location.pathname.startsWith('/musik') || location.pathname.startsWith('/paket');
  const isAdmin = location.pathname.startsWith('/admin');
  const isKlienArea = !isMCRoute && !isAdmin;
  const pathUsername = location.pathname.split('/')[1];

  const imageUrl = isKlienArea ? '/gambar/banner/welcome-klien.webp' : '/gambar/banner/welcome-publik.webp';

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    if (img.complete) {
      setIsImageLoaded(true);
    } else {
      setIsImageLoaded(false);
      img.onload = () => setIsImageLoaded(true);
      img.onerror = () => setIsImageLoaded(true); // Fallback so it doesn't get stuck
    }
  }, [imageUrl]);

  const [clientName, setClientName] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  useEffect(() => {
    if (isKlienArea) {
      import('../lib/api').then(async ({ getKlienAkun, getKlienPengantin }) => {
        try {
          const pathUsername = location.pathname.split('/')[1];
          const akunData = await getKlienAkun({ username: pathUsername });
          const clientMatch = akunData.find((e: any) => e.username === pathUsername) || akunData[0];
          
          if (clientMatch) {
            try {
              const pengantinData = await getKlienPengantin(clientMatch.id_klien);
              const p = pengantinData.find((d: any) => d.id_klien === clientMatch.id_klien) || pengantinData[0];
              const pengantin = p?.pengantin || p;
              
              if (pengantin && pengantin.nama_panggilan_pria && pengantin.nama_panggilan_wanita) {
                setClientName(`${pengantin.nama_panggilan_wanita} & ${pengantin.nama_panggilan_pria}`);
                return;
              }
            } catch (err) {
              console.warn('Failed to load pengantin data for popup:', err);
            }
            
            if (clientMatch.namaKlien) {
              setClientName(clientMatch.namaKlien);
            } else if (clientMatch.username) {
              setClientName(clientMatch.username.replace('&', ' & '));
            }
          }
        } catch (err) {
          console.error('Failed to load akun data for popup:', err);
        }
      });
    }

    // Show popup after a short delay on initial load
    const checkAndShowPopup = () => {
      if (isKlienArea) {
        if (!pathUsername || pathUsername === 'klien') return;
        const authKey = `auth_${pathUsername}`;
        const hasAuth = localStorage.getItem(authKey) || sessionStorage.getItem(authKey);
        if (!hasAuth) return;
        
        const welcomeKey = `welcomeShown_klien_${pathUsername}_v2`;
        if (!sessionStorage.getItem(welcomeKey)) {
          setTimeout(() => {
            setIsOpen(true);
            sessionStorage.setItem(welcomeKey, 'true');
          }, 500);
        }
      } else {
        const welcomeKey = `welcomeShown_mc_v2`;
        
        // Find if user is logged in to any client area
        let hasAnyClientAuth = false;
        try {
          for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i)?.startsWith('auth_')) hasAnyClientAuth = true;
          }
          for (let i = 0; i < sessionStorage.length; i++) {
            if (sessionStorage.key(i)?.startsWith('auth_')) hasAnyClientAuth = true;
          }
        } catch (e) {}

        if (!sessionStorage.getItem(welcomeKey) && !hasAnyClientAuth) {
          setTimeout(() => {
            setIsOpen(true);
            sessionStorage.setItem(welcomeKey, 'true');
          }, 500);
        }
      }
    };

    checkAndShowPopup();

    const handleAuthSuccess = () => {
      checkAndShowPopup();
    };

    window.addEventListener('auth-success', handleAuthSuccess);
    return () => {
      window.removeEventListener('auth-success', handleAuthSuccess);
    };
  }, [isKlienArea, location.pathname, pathUsername]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 sm:p-6 overflow-y-auto scrollbar-hide">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={isImageLoaded ? handleClose : undefined}
          />

          {!isImageLoaded ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-10 flex flex-col items-center justify-center text-white mb-20 md:mb-0"
            >
              <LoadingSpinner size={48} className="mb-4 shadow-xl" />
              <p className="text-sm font-medium animate-pulse tracking-wide drop-shadow-md">Menyiapkan Sambutan...</p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200, mass: 0.8 }}
              className={`relative w-full max-w-lg bg-[#C2973E] border-[#C2973E]/50 text-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-y-auto scrollbar-hide border max-h-[90vh] mt-auto md:mt-0`}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.2 }}
              onDragEnd={(e, info) => {
                if (info.offset.y > 100 || info.velocity.y > 500) {
                  handleClose();
                }
              }}
            >
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/10 hover:bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center transition-colors border border-black/10 text-white md:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>

              {isKlienArea ? (
                <>
                  <div className="relative aspect-[4/3] w-full rounded-t-3xl md:rounded-t-3xl overflow-hidden text-left flex flex-col justify-center p-6 md:p-8">
                    <img 
                      src={imageUrl} 
                      alt="Area Klien" 
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="relative z-10 w-[55%]">
                    <div className="inline-block px-3 py-1 bg-[#C2973E] text-white rounded-full text-[10px] font-bold tracking-widest uppercase mb-1 shadow-md">
                      Selamat Datang
                    </div>
                    <div className="text-[11px] font-medium tracking-wide text-stone-600/90 pl-1 mb-2">
                      Wedding Days
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-none text-stone-800 drop-shadow-sm">
                      {clientName && clientName.includes('&') ? (() => {
                        const parts = clientName.split('&');
                        const name1 = parts[0].trim();
                        const name2 = parts.slice(1).join('&').trim();
                        
                        if (name1.length < name2.length) {
                          return (
                            <>
                              <span>{name1} &amp;</span>
                              <span className="block leading-tight mt-1">{name2}</span>
                            </>
                          );
                        } else {
                          return (
                            <>
                              <span>{name1}</span>
                              <span className="block leading-tight mt-1">&amp; {name2}</span>
                            </>
                          );
                        }
                      })() : (
                        clientName || 'Klien'
                      )}
                    </h2>
                  </div>
                </div>
                <div className="relative px-8 py-6 text-center flex flex-col items-center justify-center">
                  <p className="text-white/95 font-medium text-sm leading-relaxed max-w-sm mx-auto mb-6">
                    Ini adalah area klien eksklusif untuk acara Anda. Di sini Anda dapat melihat ringkasan acara, panduan MC, daftar vendor, dan informasi penting lainnya.
                  </p>
                  {deferredPrompt && (
                    <button 
                      onClick={handleInstallClick}
                      className="flex items-center gap-2 bg-white text-[#C2973E] px-6 py-3 rounded-full font-bold hover:bg-stone-100 transition-colors shadow-xl"
                    >
                      <Download className="w-5 h-5" />
                      Install App Area Klien
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="relative aspect-[4/3] w-full rounded-t-3xl md:rounded-t-3xl overflow-hidden">
                  <img 
                    src="/gambar/banner/welcome-publik.webp" 
                    alt="Pratama MC" 
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="relative px-8 pt-10 pb-8 text-center flex flex-col items-center justify-center">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[11px] font-bold tracking-widest uppercase shadow-sm whitespace-nowrap text-white z-10">
                    Selamat Datang
                  </div>
                  <h2 className="text-3xl font-bold mb-3 tracking-tight drop-shadow-sm">Pratama MC</h2>
                  <p className="text-white/95 text-sm leading-relaxed mb-2 font-medium">
                    Meningkatkan momen Anda dengan keanggunan, profesionalisme, dan interaksi yang menarik. Mari ciptakan acara yang tak terlupakan bersama.
                  </p>
                </div>
              </>
            )}
          </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
