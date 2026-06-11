import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Search, 
  Filter, 
  Check, 
  Handshake, 
  BadgeCheck, 
  Instagram, 
  Globe, 
  ArrowRight, 
  Facebook, 
  Youtube, 
  MapPin, 
  Smartphone 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getVendorData } from '../../../lib/api';

interface Vendor {
  id: string;
  nama: string;
  kategori: string;
  logo: string;
  verifikasi: boolean;
  deskripsi: string;
  instagram: string;
  whatsapp?: string;
  website?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  maps?: string;
  peta?: string;
  tautan?: string;
}

interface InfoVendorProps {
  searchQuery: string;
  activeVendorCategory: string;
}

function InfoVendor({ searchQuery, activeVendorCategory }: InfoVendorProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    getVendorData().then((data) => {
      // The API returns either an array of vendors or an array objects { vendors: [...] }
      if (data && typeof data === 'object' && !Array.isArray(data)) {
         setVendors(data.vendors || []);
      } else if (Array.isArray(data)) {
         setVendors(data);
      }
    }).catch(console.error);
  }, []);

  const filteredVendors = vendors.filter(vendor => {
    const matchesCategory = activeVendorCategory === 'All' ? true : vendor.kategori === activeVendorCategory;
    const matchesSearch = vendor.nama.toLowerCase().includes(searchQuery.toLowerCase()) || vendor.kategori.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    if (selectedVendor !== null) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedVendor]);

  const handleSocialClick = (platform: string, link?: string) => {
    if (link && link.trim() !== '' && link !== '-') {
      let url = link;
      if (platform === 'Instagram' && !link.startsWith('http')) {
        url = `https://instagram.com/${link.replace('@', '')}`;
      } else if (platform === 'TikTok' && !link.startsWith('http')) {
        url = `https://tiktok.com/@${link.replace('@', '')}`;
      } else if (platform === 'Youtube' && !link.startsWith('http')) {
        url = `https://youtube.com/@${link.replace('@', '')}`;
      } else if (!link.startsWith('http')) {
        url = `https://${url}`;
      }
      window.open(url, '_blank', 'noreferrer');
    } else {
      setToastMessage(`Vendor tidak menyediakan ${platform}`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 w-full mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
          {filteredVendors.map((vendor, index) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedVendor(vendor)}
              className="bg-white rounded-2xl md:rounded-[2rem] p-4 md:p-6 border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full flex flex-col items-center cursor-pointer group focus:outline-none"
            >
              <div className="flex flex-col items-center my-2 md:my-4 w-full">
                <div className="relative mb-3 md:mb-5">
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-[3px] md:border-4 border-white shadow-md relative z-10 bg-white group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src={vendor.logo} 
                      alt={vendor.nama}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-[-3px] md:inset-[-4px] rounded-full border border-stone-200/60 group-hover:border-[#DCAF43]/40 transition-colors duration-300"></div>

                  {vendor.verifikasi && (
                    <div className="absolute bottom-0 right-0 md:bottom-1 md:right-0 z-20 bg-white rounded-full p-0.5 shadow-sm">
                      <BadgeCheck className="w-5 h-5 md:w-6 md:h-6 fill-blue-500 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="text-center w-full px-0.5 md:px-2">
                  <h3 className="font-bold text-xs md:text-xl text-stone-900 mb-0.5 md:mb-1 group-hover:text-[#DCAF43] transition-colors duration-300 truncate leading-snug">
                    {vendor.nama}
                  </h3>
                  <p className="text-stone-400 text-[9px] md:text-xs font-semibold uppercase tracking-wider truncate">{vendor.kategori}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredVendors.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-stone-100 shadow-sm mt-8">
            <Search className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500 text-lg">Belum ada vendor yang sesuai dengan kriteria ini.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-24 md:bottom-10 left-1/2 z-[200] bg-stone-900 text-white px-6 py-3 rounded-full text-sm shadow-xl font-medium whitespace-nowrap"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {createPortal(
        <AnimatePresence>
          {selectedVendor && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedVendor(null)}
                className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[100] transition-opacity"
              />
              
              <div className="fixed inset-0 z-[101] flex items-end md:items-center justify-center pointer-events-none">
                <motion.div
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '100%', opacity: 0 }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0, bottom: 0.5 }}
                  onDragEnd={(e, info) => {
                    if (info.offset.y > 100 || info.velocity.y > 500) {
                      setSelectedVendor(null);
                    }
                  }}
                  className="pointer-events-auto bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative"
                >
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-stone-300 rounded-full z-30 md:hidden pointer-events-none"></div>

                  <div className="p-6 md:p-8 overflow-y-auto scrollbar-hide pt-10 md:pt-8">
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative mb-5">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md relative z-10 bg-white">
                          <img 
                            src={selectedVendor.logo} 
                            alt={selectedVendor.nama}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="absolute inset-[-4px] rounded-full border-2 border-stone-200"></div>
                        {selectedVendor.verifikasi && (
                          <div className="absolute bottom-0 right-0 z-20 bg-white rounded-full p-0.5 shadow-sm">
                            <BadgeCheck className="w-6 h-6 fill-blue-500 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <h3 className="font-bold text-2xl text-stone-900 mb-1">
                          {selectedVendor.nama}
                        </h3>
                        <p className="text-stone-500 text-xs font-semibold uppercase tracking-wider">{selectedVendor.kategori}</p>
                      </div>
                    </div>

                    <p className="text-stone-600 font-light text-[15px] text-center leading-relaxed mb-8">
                      {selectedVendor.deskripsi}
                    </p>

                    <div className="flex flex-row justify-center gap-3 sm:gap-4 w-full px-4 sm:px-0">
                      <button 
                        onClick={() => handleSocialClick('Maps', selectedVendor.peta || selectedVendor.maps)}
                        className="flex justify-center items-center p-3 sm:p-4 bg-white hover:bg-stone-50 text-stone-700 rounded-2xl transition-colors border border-stone-200 aspect-square flex-1 max-w-[80px]"
                      >
                        <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                      <button 
                        onClick={() => handleSocialClick('Facebook', selectedVendor.facebook)}
                        className="flex justify-center items-center p-3 sm:p-4 bg-white hover:bg-stone-50 text-stone-700 rounded-2xl transition-colors border border-stone-200 aspect-square flex-1 max-w-[80px]"
                      >
                        <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                      <button 
                        onClick={() => handleSocialClick('Instagram', selectedVendor.instagram)}
                        className="flex justify-center items-center p-3 sm:p-4 bg-white hover:bg-stone-50 text-stone-700 rounded-2xl transition-colors border border-stone-200 aspect-square flex-1 max-w-[80px]"
                      >
                        <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                      <button 
                        onClick={() => handleSocialClick('Youtube', selectedVendor.youtube)}
                        className="flex justify-center items-center p-3 sm:p-4 bg-white hover:bg-stone-50 text-stone-700 rounded-2xl transition-colors border border-stone-200 aspect-square flex-1 max-w-[80px]"
                      >
                        <Youtube className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                      <button 
                        onClick={() => handleSocialClick('TikTok', selectedVendor.tiktok)}
                        className="flex justify-center items-center p-3 sm:p-4 bg-white hover:bg-stone-50 text-stone-700 rounded-2xl transition-colors border border-stone-200 aspect-square flex-1 max-w-[80px]"
                        title="TikTok"
                      >
                        <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                      <button 
                        onClick={() => handleSocialClick('Website', selectedVendor.website)}
                        className="flex justify-center items-center p-3 sm:p-4 bg-white hover:bg-stone-50 text-stone-700 rounded-2xl transition-colors border border-stone-200 aspect-square flex-1 max-w-[80px]"
                      >
                        <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
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
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

export default function VendorPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);

  const [categories, setCategories] = useState<string[]>(['All']);
  const [activeVendorCategory, setActiveVendorCategory] = useState<string>('All');
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getVendorData().then((data) => {
      if (data && data.daftarKategori) {
        setCategories(['All', ...data.daftarKategori]);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

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
                <Handshake className="w-3.5 h-3.5" />
                Daftar Vendor
            </div>
            <h1 className="text-3xl md:text-5xl font-sans font-bold text-stone-900 leading-tight mb-4">
              Vendor Wedding Organizer
            </h1>
            <p className="hidden md:block text-stone-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Temukan Vendor terpercaya untuk menyukseskan acara pernikahan dan event Anda di Purwakarta, Subang, Karawang, Bekasi, dan Jakarta.
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
                 placeholder="Cari vendor..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="flex-1 min-w-0 px-2 py-0 bg-transparent focus:outline-none text-sm text-stone-700 placeholder-stone-400 transition-all font-medium h-full"
               />
               
               {searchQuery && (
                 <button 
                   onClick={() => setSearchQuery('')}
                   className="px-2 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                 >
                   <X className="h-5 w-5" />
                 </button>
               )}

                  <div className="relative pr-2 flex items-center" ref={filterRef}>
                    <div className="w-px h-6 bg-stone-200 mx-1"></div>
                    <button
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className={`p-2 ml-1 rounded-lg transition-colors flex items-center gap-1 ${
                        isFilterOpen || activeVendorCategory !== 'All' ? 'bg-[#DCAF43]/10 text-[#DCAF43]' : 'text-stone-400 hover:text-stone-700 hover:bg-stone-50'
                      }`}
                      title="Filter Kategori"
                    >
                      <Filter className="w-5 h-5" />
                    </button>
                    
                    <AnimatePresence>
                      {isFilterOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-3 w-56 md:w-64 bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden z-50 flex flex-col"
                        >
                          <div className="px-3 py-2 border-b border-stone-50 bg-stone-50/50 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Filter Kategori</span>
                          </div>
                          <div className="max-h-64 overflow-y-auto px-1.5 py-1.5 minimal-scrollbar">
                            {categories.map((cat, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setActiveVendorCategory(cat);
                                  setIsFilterOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2.5 text-sm rounded-lg flex items-center justify-between transition-colors mb-0.5 ${
                                  activeVendorCategory === cat
                                    ? 'bg-[#DCAF43]/10 text-[#DCAF43] font-medium'
                                    : 'text-stone-600 hover:bg-stone-50'
                                }`}
                              >
                                <span className="truncate">{cat === 'All' ? 'Semua Kategori' : cat}</span>
                                {activeVendorCategory === cat && <Check className="w-4 h-4 flex-shrink-0" />}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
             </div>
          </div>
        </div>

         <InfoVendor searchQuery={searchQuery} activeVendorCategory={activeVendorCategory} />
      </motion.div>
    </div>
  );
}
