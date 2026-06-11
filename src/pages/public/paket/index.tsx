import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, MicVocal, Star, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getHargaData } from '../../../lib/api';

export default function PaketPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);

  const [paketList, setPaketList] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<number | 'popular' | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'info' | 'fasilitas'>('info');

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
            parsedDetail = item.detail.split(',').map((s: string) => s.trim()).filter(Boolean);
          }
        }
        
        return {
          ...item,
          populer: item.populer === true || item.populer === 1 || item.populer === 'true',
          gambar: Array.isArray(item.gambar) ? item.gambar : (typeof item.gambar === 'string' ? item.gambar.split(',') : []),
          detail: parsedDetail
        };
      });

      setPaketList(arrayData);
    }).catch(console.error);
  }, []);

  const formatRupiah = (angka?: number | string) => {
    if (!angka && angka !== 0 && angka !== "0") return "";
    if (typeof angka === 'string' && angka.toLowerCase().includes('rp')) return angka;
    return `Rp ${angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  useEffect(() => {
    if (selectedPackage !== null) {
      document.body.classList.add('modal-open');
      setImageIndex(0);
      setActiveTab('info');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedPackage]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } }
  };

  const populerItem = paketList.find((item: any) => item.populer);
  const packageList = paketList.map((pkg, idx) => ({ pkg, id: idx }));

  const filteredPackages = packageList.filter(item => 
    item.pkg?.nama?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.pkg?.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isPopularMatch = !searchQuery || 
    populerItem?.nama?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    populerItem?.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase());

  return (
    <div className="pt-16 md:pt-24 pb-16 min-h-screen bg-stone-50 relative overflow-hidden text-stone-900">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#DCAF43]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-stone-200/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <section className="pt-16 md:pt-8 pb-4 md:pb-10 px-0 md:px-6 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#DBB24E]/10 border border-[#DBB24E]/20 rounded-full text-xs font-medium text-[#DBB24E] tracking-wide uppercase mb-6 shadow-sm">
                <MicVocal className="w-3.5 h-3.5" />
                Daftar Paket
            </div>
            <h1 className="text-3xl md:text-5xl font-sans font-bold text-stone-900 leading-tight mb-4">
              Harga Paket Master of Ceremony
            </h1>
            <p className="hidden md:block text-stone-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Temukan harga paket Master of Ceremony (MC) terbaik untuk menyukseskan acara pernikahan dan event Anda di Purwakarta, Subang, Karawang, Bekasi, dan Jakarta.
            </p>
          </motion.div>
        </div>
      </section>

      <motion.div 
        className="max-w-6xl mx-auto px-4 md:px-6 relative z-10 pt-2 md:pt-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        <div className="flex items-center mb-8 md:mb-10 w-full relative z-20">
          <div className="flex-1 min-w-0 flex items-center gap-2 w-full">
             <div className="relative w-full flex bg-white/80 backdrop-blur-sm rounded-[1.25rem] border border-stone-200 shadow-sm overflow-visible z-30 transition-all focus-within:ring-2 focus-within:ring-[#DCAF43]/50 focus-within:border-[#DCAF43] h-[48px] md:h-[52px]">
               
               <div className="pl-4 flex items-center pointer-events-none text-stone-400">
                 <Search className="h-5 w-5" />
               </div>
               
               <input
                 type="text"
                 placeholder="Cari paket..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="flex-1 min-w-0 px-2 py-0 bg-transparent focus:outline-none text-sm text-stone-700 placeholder-stone-400 transition-all font-medium h-full"
               />
               
               {searchQuery && (
                 <button 
                   onClick={() => setSearchQuery('')}
                   className="px-4 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                 >
                   <X className="h-5 w-5" />
                 </button>
               )}
             </div>
          </div>
        </div>

        {/* Popular Package */}
        {populerItem && isPopularMatch && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 w-full mb-8">
            <motion.div 
              onClick={() => setSelectedPackage('popular')}
              className="relative bg-white border border-stone-200 rounded-[2rem] lg:rounded-[2.5rem] shadow-md mb-8 flex flex-col lg:flex-row items-stretch overflow-hidden group cursor-pointer active:scale-[0.98] md:active:scale-100 transition-all lg:h-[360px]"
            >
              <div className="absolute top-4 left-4 lg:top-8 lg:left-8 bg-[#DCAF43] lg:bg-stone-900 text-white px-4 py-1.5 lg:px-6 lg:py-2.5 rounded-full font-bold uppercase tracking-widest text-[10px] lg:text-xs shadow-lg flex items-center gap-1.5 lg:gap-2 z-30 whitespace-nowrap">
                <Star className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white lg:text-[#DCAF43] fill-white lg:fill-[#DCAF43]" /> Paling Diminati
              </div>
              
              <div className="flex flex-col relative z-20 w-full border-b border-stone-100 lg:border-b-0 lg:border-r border-stone-100 shrink-0 aspect-video lg:aspect-auto lg:h-full lg:w-[360px] overflow-hidden">
                <img src={populerItem.gambar[0]} alt={populerItem.nama} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none lg:hidden" />
                
                <div className="absolute bottom-0 left-0 w-full p-3.5 flex flex-col justify-end pointer-events-none z-10 lg:hidden">
                  <h3 className="text-sm sm:text-base font-bold text-white leading-tight mb-1">
                    {populerItem.nama}
                  </h3>
                  {(populerItem.harga_normal || populerItem.hargaAsli) && (
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] text-white/80 font-medium whitespace-nowrap">
                        Harga Normal{" "}
                        <span className="relative inline-block ml-0.5">
                          <span className="absolute top-1/2 left-[-5%] w-[110%] h-[1.5px] bg-red-500 transform -translate-y-1/2 -rotate-6 rounded-full"></span>
                          {formatRupiah(populerItem.harga_normal || populerItem.hargaAsli)}
                        </span>
                      </span>
                    </div>
                  )}
                  <span className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                    {formatRupiah(populerItem.harga_promo || populerItem.harga)}
                  </span>
                </div>
              </div>

              <div className="hidden lg:flex lg:flex-1 p-8 lg:p-10 flex-col justify-center relative z-10 w-full bg-[#DCAF43]">
                <h3 className="text-3xl lg:text-[2.25rem] font-extrabold text-white leading-tight mb-4">
                  {populerItem.nama}
                </h3>
                <p className="text-white/90 mb-4 leading-relaxed text-sm lg:text-base">
                  {populerItem.deskripsi}
                </p>
                <div className="flex flex-col items-start justify-center mt-2">
                  {(populerItem.harga_normal || populerItem.hargaAsli) && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-sm text-white/80 font-medium">Harga Hanya <span className="relative inline-block ml-0.5 text-white"><span className="absolute top-1/2 left-[-5%] w-[110%] h-[2px] bg-red-500 transform -translate-y-1/2 -rotate-6 rounded-full"></span>{formatRupiah(populerItem.harga_normal || populerItem.hargaAsli)}</span></span>
                    </div>
                  )}
                  <div className="inline-flex items-center bg-red-600 text-white px-5 py-2 rounded-2xl shadow-lg border border-red-700/40">
                    <span className="text-3xl lg:text-4xl font-black tracking-tight">
                      {formatRupiah(populerItem.harga_promo || populerItem.harga)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Regular Packages */}
        <div className="flex items-center justify-center mt-12 mb-8 md:mt-16 md:mb-12">
          <div className="h-px bg-stone-200 flex-1 max-w-[60px] md:max-w-[120px]" />
          <span className="px-4 md:px-6 text-sm font-bold text-stone-400 uppercase tracking-[0.2em] text-center">
            Layanan Kami
          </span>
          <div className="h-px bg-stone-200 flex-1 max-w-[60px] md:max-w-[120px]" />
        </div>
        
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 w-full mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 relative z-10">
            {filteredPackages.length > 0 ? filteredPackages.map((item) => (
              <motion.div 
                key={`pkg-${item.id}`} 
                onClick={() => setSelectedPackage(item.id)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "50px" }}
                variants={itemVariants}
                className={`flex flex-col bg-white rounded-[2rem] border border-stone-200 transition-all duration-500 shadow-sm relative overflow-hidden group cursor-pointer active:scale-[0.98] md:active:scale-100 ${item.pkg.populer ? 'hidden md:flex' : ''}`}
              >
                <div className="relative w-full aspect-video overflow-hidden shrink-0">
                  <img src={item.pkg.gambar[0]} alt={item.pkg.nama} className="absolute inset-0 w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3.5 md:p-8 pointer-events-none z-10">
                    <h3 className="text-sm sm:text-base md:text-2xl font-bold text-white leading-tight mb-0.5 md:mb-1">
                      {item.pkg.nama}
                    </h3>
                    <div className="flex flex-col mt-0.5 md:mt-1">
                      {(item.pkg.harga_normal || item.pkg.hargaAsli) && (
                        <div className="flex items-center gap-1.5 mb-0.5 md:mb-1">
                            <span className="text-[10px] md:text-sm text-white/90 font-medium">Harga Hanya <span className="relative inline-block ml-0.5"><span className="absolute top-1/2 left-[-5%] w-[110%] h-[2px] bg-red-500 transform -translate-y-1/2 -rotate-6 rounded-full"></span>{formatRupiah(item.pkg.harga_normal || item.pkg.hargaAsli)}</span></span>
                        </div>
                      )}
                      <span className="text-base sm:text-lg md:text-4xl font-extrabold text-white tracking-tight">
                        {formatRupiah(item.pkg.harga_promo || item.pkg.harga)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border border-stone-100 shadow-sm">
                <Star className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500 text-lg">Tidak ada paket yang sesuai dengan pencarian Anda.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Package Details Modal */}
      {createPortal(
        <AnimatePresence>
          {selectedPackage !== null && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPackage(null)}
                className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[100]"
              />
              
              <div className="fixed inset-0 z-[101] flex items-end md:items-center justify-center pointer-events-none">
                <motion.div
                  initial={{ y: "100%", opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: "100%", opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0, bottom: 0.5 }}
                  onDragEnd={(e, info) => {
                    if (info.offset.y > 100 || info.velocity.y > 500) {
                      setSelectedPackage(null);
                    }
                  }}
                  className="pointer-events-auto bg-white rounded-t-[2rem] md:rounded-[2rem] w-full md:max-w-2xl max-h-[85vh] md:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative"
                >
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/40 rounded-full z-30 md:hidden pointer-events-none"></div>

                  <button 
                    onClick={() => setSelectedPackage(null)}
                    className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-white/80 hover:text-white transition-colors bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full z-20 md:flex hidden"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {(() => {
                    const pkg = selectedPackage === 'popular' ? populerItem : paketList[selectedPackage as number];
                    if (!pkg) return null;
                    return (
                      <div className="flex flex-col relative w-full h-full overflow-hidden">
                        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                        <div className="relative w-full pt-[56.25%] bg-stone-100 group shrink-0 overflow-hidden">
                          <div 
                            className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory w-full h-full scrollbar-hide"
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
                            {(selectedPackage === 'popular' || pkg.populer) && (
                              <div className="inline-block self-start bg-[#DCAF43] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 shadow-sm">
                                Paling Diminati
                              </div>
                            )}
                            <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight drop-shadow-md">{pkg.nama}</h3>
                          </div>

                          {pkg.gambar.length > 1 && (
                            <div className="absolute bottom-4 right-6 flex gap-1.5 z-10 pointer-events-none">
                              {pkg.gambar.map((_: any, idx: number) => (
                                <div 
                                  key={idx}
                                  className={`w-2 h-2 rounded-full transition-all duration-300 ${imageIndex === idx ? 'bg-white scale-125 hover:scale-125' : 'bg-white/50'}`}
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
                                {(pkg.harga_normal || pkg.hargaAsli) && (
                                  <div className="flex items-center gap-1.5 mb-1">
                                     <span className="text-sm md:text-base text-stone-700 font-medium">Harga Hanya <span className="relative inline-block ml-0.5"><span className="absolute top-1/2 left-[-5%] w-[110%] h-[2px] bg-red-500 transform -translate-y-1/2 -rotate-6 rounded-full"></span>{formatRupiah(pkg.harga_normal || pkg.hargaAsli)}</span></span>
                                  </div>
                                )}
                                <span className="text-3xl md:text-4xl font-extrabold text-[#DCAF43]">{formatRupiah(pkg.harga_promo || pkg.harga)}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 bg-stone-50 p-6 rounded-2xl border border-stone-100 focus:outline-none focus:ring-0">
                              <h4 className="font-bold text-stone-900 mb-4 tracking-wide uppercase text-xs md:text-sm">Yang Termasuk di Paket Ini:</h4>
                              <ul className="space-y-4">
                                {(pkg.detail || pkg.fitur || []).map((feature: string, idx: number) => (
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
                    );
                  })()}
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

