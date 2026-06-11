import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Star, ArrowUpRight, ArrowRight, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getHargaData } from "../../../lib/api";

export default function PromoCard() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [selectedPackage, setSelectedPackage] = useState<boolean>(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'info' | 'fasilitas'>('info');
  const [pkg, setPkg] = useState<any>(null);

  useEffect(() => {
    getHargaData().then((data: any) => {
      let arrayData = Array.isArray(data) ? data : (data?.daftarPaket || data?.data || []);
      
      arrayData = arrayData.map((item: any) => {
        let parsedDetail = item.fitur || [];
        if (Array.isArray(item.detail)) {
          parsedDetail = item.detail;
        } else if (typeof item.detail === 'string') {
          try {
            parsedDetail = JSON.parse(item.detail);
          } catch (e) {
            parsedDetail = item.detail.split(',').map((s: string) => s.trim()).filter(Boolean); // split by comma for fallback
          }
        }
        
        return {
          ...item,
          gambar: Array.isArray(item.gambar) ? item.gambar : (typeof item.gambar === 'string' ? item.gambar.split(',') : []),
          detail: parsedDetail
        };
      });

      const populerItem = arrayData.find((item: any) => item.populer === true || item.populer === 1 || item.populer === 'true');
      if (populerItem) setPkg(populerItem);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0); // Next midnight
      const difference = tomorrow.getTime() - now.getTime();
      
      return {
        days: 0,
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedPackage) {
      document.body.style.overflow = "hidden";
      setImageIndex(0);
      setActiveTab("info");
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedPackage]);

  const formatRupiah = (angka?: number | string) => {
    if (!angka && angka !== 0 && angka !== "0") return "";
    if (typeof angka === 'string' && angka.toLowerCase().includes('rp')) return angka;
    return `Rp ${angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  if (!pkg) return null;

  const harga_normal = pkg.harga_normal || pkg.hargaAsli;
  const harga_promo = pkg.harga_promo || pkg.harga;

  return (
    <div className="mt-10 md:mt-14 max-w-6xl mx-auto px-4 md:px-0">
      {/* Mobile Title: Clean without any card container */}
      <div className="md:hidden flex justify-center mb-6">
        <span className="text-stone-500 text-[11px] font-bold uppercase tracking-[0.2em] text-center block">
          Promo Terbatas
        </span>
      </div>

      <div className="relative pt-6 md:pt-0">
        {/* Mobile Floating Timer: Sits exactly on the boundary like a search bar, overlapping the card's top edge */}
        <div className="md:hidden absolute top-3 -translate-y-1/2 left-1/2 -translate-x-1/2 z-30 w-[80%] max-w-[280px] flex items-center justify-center gap-2 bg-[#DCAF43] border border-[#DCAF43]/40 px-4 py-2.5 rounded-2xl shadow-xl shadow-[#DCAF43]/30">
            <div className="flex flex-col items-center flex-1">
              <span className="text-white text-xl font-sans font-extrabold leading-none">{timeLeft.days.toString().padStart(2, '0')}</span>
              <span className="text-[8px] text-white/80 uppercase mt-1 tracking-widest font-sans font-extrabold">Hari</span>
            </div>
            <span className="text-white pb-3 text-xs font-bold leading-none">:</span>
            <div className="flex flex-col items-center flex-1">
              <span className="text-white text-xl font-sans font-extrabold leading-none">{timeLeft.hours.toString().padStart(2, '0')}</span>
              <span className="text-[8px] text-white/80 uppercase mt-1 tracking-widest font-sans font-extrabold">Jam</span>
            </div>
            <span className="text-white pb-3 text-xs font-bold leading-none">:</span>
            <div className="flex flex-col items-center flex-1">
              <span className="text-white text-xl font-sans font-extrabold leading-none">{timeLeft.minutes.toString().padStart(2, '0')}</span>
              <span className="text-[8px] text-white/80 uppercase mt-1 tracking-widest font-sans font-extrabold">Mnt</span>
            </div>
            <span className="text-white pb-3 text-xs font-bold leading-none">:</span>
            <div className="flex flex-col items-center flex-1">
              <span className="text-white text-xl font-sans font-extrabold leading-none">{timeLeft.seconds.toString().padStart(2, '0')}</span>
              <span className="text-[8px] text-white/80 uppercase mt-1 tracking-widest font-sans font-extrabold">Dtk</span>
            </div>
        </div>

        {/* Desktop Header Layout */}
        <div className="hidden md:flex flex-row items-center justify-between gap-10 mb-8 bg-red-600 border border-red-700/40 rounded-[2rem] py-6 px-12 shadow-lg shadow-red-600/15 w-full relative overflow-hidden z-20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-tr-full pointer-events-none" />
          <span className="text-white text-base font-extrabold uppercase tracking-[0.2em] relative z-10 text-left leading-relaxed">
            Promo Terbatas<br />Berakhir Dalam
          </span>
          <div className="flex items-center gap-4 text-stone-800 font-sans font-bold relative z-20">
              <div className="flex flex-col items-center">
                <span className="bg-white rounded-xl px-4 py-2 shadow-sm border border-stone-200 min-w-[4rem] text-center text-red-600 text-3xl font-extrabold">{timeLeft.days.toString().padStart(2, '0')}</span>
                <span className="text-[10px] text-white/90 uppercase mt-2 tracking-widest font-extrabold">Hari</span>
              </div>
              <span className="text-white pb-6 text-3xl font-light">:</span>
              <div className="flex flex-col items-center">
                <span className="bg-white rounded-xl px-4 py-2 shadow-sm border border-stone-200 min-w-[4rem] text-center text-red-600 text-3xl font-extrabold">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="text-[10px] text-white/90 uppercase mt-2 tracking-widest font-extrabold">Jam</span>
              </div>
              <span className="text-white pb-6 text-3xl font-light">:</span>
              <div className="flex flex-col items-center">
                <span className="bg-white rounded-xl px-4 py-2 shadow-sm border border-stone-200 min-w-[4rem] text-center text-red-600 text-3xl font-extrabold">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="text-[10px] text-white/90 uppercase mt-2 tracking-widest font-extrabold">Mnt</span>
              </div>
              <span className="text-white pb-6 text-3xl font-light">:</span>
              <div className="flex flex-col items-center">
                <span className="bg-white rounded-xl px-4 py-2 shadow-sm border border-red-700/20 min-w-[4rem] text-center text-red-600 text-3xl font-extrabold">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="text-[10px] text-white/90 uppercase mt-2 tracking-widest font-extrabold">Dtk</span>
              </div>
          </div>
        </div>

        {/* Promo Card Layout */}
        <div className="relative z-10 w-full mb-0">
          <motion.div 
            onClick={() => setSelectedPackage(true)}
            className="relative bg-white border border-stone-200 rounded-[2rem] lg:rounded-[2.5rem] shadow-md lg:shadow-xl flex flex-col lg:flex-row items-stretch overflow-hidden group cursor-pointer active:scale-[0.98] md:active:scale-100 transition-all lg:h-[360px]"
          >
            {/* 16:9 aspect ratio image card for Mobile, or left column for Desktop */}
            <div className="flex flex-col relative z-20 w-full border-b border-stone-100 lg:border-b-0 lg:border-r border-stone-100 shrink-0 aspect-video lg:aspect-auto lg:h-full lg:w-[360px] overflow-hidden">
              <img src={pkg.gambar[0]} alt={pkg.nama} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none lg:hidden" />
              
              {/* Mobile Only: Texts with Title, Strikethrough price and actual price are inside the card */}
              <div className="absolute bottom-0 left-0 w-full p-3.5 flex flex-col justify-end pointer-events-none z-10 lg:hidden">
                <h3 className="text-sm sm:text-base font-bold text-white leading-tight mb-1">
                  {pkg.nama}
                </h3>
                {harga_normal && (
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] text-white/80 font-medium whitespace-nowrap">
                      Harga Normal{" "}
                      <span className="relative inline-block ml-0.5">
                        <span className="absolute top-1/2 left-[-5%] w-[110%] h-[1.5px] bg-red-500 transform -translate-y-1/2 -rotate-6 rounded-full"></span>
                        {formatRupiah(harga_normal)}
                      </span>
                    </span>
                  </div>
                )}
                <span className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  {formatRupiah(harga_promo)}
                </span>
              </div>
            </div>

            {/* Desktop Only Layout Text on Side */}
            <div className="hidden lg:flex lg:flex-1 p-8 lg:p-10 flex-col justify-center relative z-10 w-full bg-[#DCAF43]">
              <h3 className="text-3xl lg:text-[2.25rem] font-extrabold text-white leading-tight mb-4">
                {pkg.nama}
              </h3>

              <p className="text-white/90 mb-4 leading-relaxed text-sm lg:text-base">
                {pkg.deskripsi}
              </p>
              <div className="flex flex-col items-start justify-center mt-2">
                {harga_normal && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-sm text-white/80 font-medium">Harga Hanya <span className="relative inline-block ml-0.5 text-white"><span className="absolute top-1/2 left-[-5%] w-[110%] h-[2px] bg-red-500 transform -translate-y-1/2 -rotate-6 rounded-full"></span>{formatRupiah(harga_normal)}</span></span>
                  </div>
                )}
                <div className="inline-flex items-center bg-red-650 bg-red-600 text-white px-5 py-2 rounded-2xl shadow-lg border border-red-700/40">
                  <span className="text-3xl lg:text-4xl font-black tracking-tight">
                    {formatRupiah(harga_promo)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal Detail Portal */}
      {createPortal(
        <AnimatePresence>
          {selectedPackage && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPackage(false)}
                className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[100]"
              />
              
              <div className="fixed inset-0 z-[101] flex items-end md:items-center justify-center pointer-events-none">
                <motion.div
                  initial={{ y: "100%", opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: "100%", opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="pointer-events-auto bg-white rounded-t-[2rem] md:rounded-[2rem] w-full md:max-w-2xl max-h-[85vh] md:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative"
                >
                  <button 
                    onClick={() => setSelectedPackage(false)}
                    className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-white/80 hover:text-white transition-colors bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full z-20"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="flex flex-col relative w-full h-full overflow-hidden">
                    <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                      <div className="relative w-full h-64 md:h-80 bg-stone-100 group shrink-0 overflow-hidden">
                        <div 
                          className="flex overflow-x-auto snap-x snap-mandatory w-full h-full scrollbar-hide"
                          onScroll={(e) => {
                            const scrollLeft = e.currentTarget.scrollLeft;
                            const width = e.currentTarget.clientWidth;
                            const newIndex = Math.round(scrollLeft / width);
                            if (newIndex !== imageIndex) {
                              setImageIndex(newIndex);
                            }
                          }}
                        >
                          {pkg.gambar.map((img: string, idx: number) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`${pkg.nama} ${idx + 1}`}
                              className="w-full h-full object-cover shrink-0 snap-center"
                            />
                          ))}
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                        
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 md:hidden z-20 pointer-events-none">
                          <div className="w-12 h-1.5 bg-white/40 backdrop-blur-sm rounded-full"></div>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end pointer-events-none z-10">
                          <div className="inline-block self-start bg-[#DCAF43] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 shadow-sm">
                            Paling Diminati
                          </div>
                          <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">{pkg.nama}</h3>
                        </div>

                        {pkg.gambar.length > 1 && (
                          <div className="absolute bottom-4 right-6 flex gap-1.5 z-10 pointer-events-none">
                            {pkg.gambar.map((_: any, idx: number) => (
                              <div 
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${imageIndex === idx ? 'bg-white scale-125' : 'bg-white/50'}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex border-b border-stone-100 focus:outline-none focus:ring-0">
                        <button 
                          onClick={() => setActiveTab('info')}
                          className={`flex-1 py-4 text-sm font-bold text-center transition-colors border-b-2 focus:outline-none focus:ring-0 select-none ${activeTab === 'info' ? 'border-[#DCAF43] text-[#DCAF43]' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
                        >
                          Seputar Layanan
                        </button>
                        <button 
                          onClick={() => setActiveTab('fasilitas')}
                          className={`flex-1 py-4 text-sm font-bold text-center transition-colors border-b-2 focus:outline-none focus:ring-0 select-none ${activeTab === 'fasilitas' ? 'border-[#DCAF43] text-[#DCAF43]' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
                        >
                          Fasilitas & Layanan
                        </button>
                      </div>

                      <div className="p-6 md:p-8 focus:outline-none focus:ring-0">
                        {activeTab === 'info' ? (
                          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 focus:outline-none focus:ring-0">
                            <p className="text-stone-500 text-sm md:text-base leading-relaxed mb-6">{pkg.deskripsi}</p>
                            <div className="flex flex-col p-6 rounded-2xl bg-stone-50 border border-stone-100">
                              <span className="text-xs font-bold text-stone-400 mb-2 uppercase tracking-wide">Investasi Anda</span>
                              {harga_normal && (
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className="text-sm md:text-base text-stone-700 font-medium">Harga Hanya <span className="relative inline-block ml-0.5"><span className="absolute top-1/2 left-[-5%] w-[110%] h-[2px] bg-red-500 transform -translate-y-1/2 -rotate-6 rounded-full"></span>{formatRupiah(harga_normal)}</span></span>
                                </div>
                              )}
                              <span className="text-3xl md:text-4xl font-extrabold text-[#DCAF43]">{formatRupiah(harga_promo)}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 bg-stone-50 p-6 rounded-2xl border border-stone-100 focus:outline-none focus:ring-0">
                            <h4 className="font-bold text-stone-900 mb-4 tracking-wide uppercase text-xs md:text-sm">Yang Termasuk di Paket Ini:</h4>
                            <ul className="space-y-4">
                              {(pkg.detail || pkg.fitur || [])?.map((feature: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-stone-700">
                                  <div className="bg-[#DCAF43]/20 p-1 rounded-full shrink-0 flex items-center justify-center mt-0.5">
                                    <Check className="w-3.5 h-3.5 text-[#DCAF43]" />
                                  </div>
                                  <span className="font-medium">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6 md:p-8 pt-4 md:pt-6 border-t border-stone-100 bg-white shrink-0">
                      <a 
                        href="https://wa.me/6285797184059" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full py-4 rounded-xl font-bold text-center text-stone-900 bg-[#DCAF43] active:bg-stone-900 hover:bg-[#c99f36] active:text-white transition-colors duration-300 shadow-md flex justify-center items-center gap-2"
                      >
                        Konsultasi Sekarang
                        <ArrowRight className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

