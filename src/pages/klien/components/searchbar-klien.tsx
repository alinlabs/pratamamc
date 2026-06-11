import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Calendar, Clock, Users, Building, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface ClientSearchProps {
  event: any;
  username: string;
}

export default function ClientSearch({ event, username }: ClientSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Click outside handler
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const foundResults: any[] = [];

    // Search in Ringkasan
    if (
      event.username?.toLowerCase().includes(lowerQuery) ||
      event.alamat?.toLowerCase().includes(lowerQuery) ||
      event.judul?.toLowerCase().includes(lowerQuery) ||
      (event.tema_bahasa?.warna_tema_pakaian)?.toLowerCase().includes(lowerQuery)
    ) {
      foundResults.push({ tab: 'ringkasan', label: 'Ringkasan Acara', icon: <FileText className="w-4 h-4" />, text: 'Kecocokan dalam info utama acara' });
    }

    // Search in Susunan Acara
    if (event.susunan_acara) {
      const matchRundown = event.susunan_acara.find((r: any) => 
        r.judul?.toLowerCase().includes(lowerQuery) || 
        r.deskripsi?.toLowerCase().includes(lowerQuery) ||
        r.waktu?.toLowerCase().includes(lowerQuery)
      );
      if (matchRundown) {
        foundResults.push({ tab: 'acara', label: 'Susunan Acara', icon: <Clock className="w-4 h-4" />, text: `Kecocokan: ${matchRundown.judul}` });
      }
    }

    // Search in Keluarga Inti
    if (event.keluarga_inti) {
      const match = event.keluarga_inti.find((k: any) => k.nama?.toLowerCase().includes(lowerQuery) || k.peran?.toLowerCase().includes(lowerQuery));
      if (match) {
        foundResults.push({ tab: 'keluarga', label: 'Keluarga Inti', icon: <Users className="w-4 h-4" />, text: `Kecocokan: ${match.nama} (${match.peran})` });
      }
    }

    // Search in Panitia Keluarga
    if (event.panitia_keluarga) {
      const match = event.panitia_keluarga.find((p: any) => p.nama?.toLowerCase().includes(lowerQuery) || p.duty?.toLowerCase().includes(lowerQuery) || p.section?.toLowerCase().includes(lowerQuery));
      if (match) {
        foundResults.push({ tab: 'panitia', label: 'Panitia Keluarga', icon: <Users className="w-4 h-4" />, text: `Kecocokan: ${match.nama} (${match.section})` });
      }
    }

    // Search in Tamu Khusus
    const allTamu = event.tamu || [];
    const matchTamu = allTamu.find((t: any) => t.nama?.toLowerCase().includes(lowerQuery) || t.catatan?.toLowerCase().includes(lowerQuery));
    if (matchTamu) {
      foundResults.push({ tab: 'panitia', label: 'Tamu Khusus', icon: <Users className="w-4 h-4" />, text: `Kecocokan: ${matchTamu.nama}` });
    }

    // Search in Vendor
    const vendorList = event.vendor || event.daftar_vendor;
    if (vendorList) {
      const match = vendorList.find((v: any) => v.nama?.toLowerCase().includes(lowerQuery) || v.kategori?.toLowerCase().includes(lowerQuery));
      if (match) {
        foundResults.push({ tab: 'vendor', label: 'Daftar Vendor', icon: <Building className="w-4 h-4" />, text: `Kecocokan: ${match.nama} (${match.kategori})` });
      }
    }

    // Search in WO
    const woList = event.wedding_organizer || event.timWO || event.tim_wo;
    if (woList) {
      const match = woList.find((w: any) => w.nama?.toLowerCase().includes(lowerQuery) || w.peran?.toLowerCase().includes(lowerQuery));
      if (match) {
        foundResults.push({ tab: 'wo', label: 'Daftar WO', icon: <Building className="w-4 h-4" />, text: `Kecocokan: ${match.nama} (${match.peran})` });
      }
    }

    // Search in Catatan
    if (event.daftar_catatan) {
      const match = event.daftar_catatan.find((n: any) => n.text?.toLowerCase().includes(lowerQuery));
      if (match) {
        foundResults.push({ tab: 'catatan', label: 'Catatan Khusus', icon: <FileText className="w-4 h-4" />, text: 'Kecocokan ditemukan dalam catatan' });
      }
    }

    // Remove duplicates based on tab priority to avoid clutter
    const uniqueResults = [];
    const seenTabs = new Set();
    for (const res of foundResults) {
      if (!seenTabs.has(res.tab)) {
        seenTabs.add(res.tab);
        uniqueResults.push(res);
      }
    }

    setResults(uniqueResults);
  }, [query, event]);

  const handleResultClick = (tab: string) => {
    navigate(`/${username}/${tab}`);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative z-40 -mt-6 mx-4 md:container md:mx-auto md:px-6 md:max-w-6xl mb-2 md:mb-4" ref={containerRef}>
      <div className="relative">
        <div className={`flex items-center bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl overflow-hidden transition-all duration-300 border ${isOpen ? 'border-stone-300 ring-4 ring-stone-900/5' : 'border-transparent'}`}>
          <div className="pl-4 pr-2 py-3 text-stone-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Cari info acara, vendor, panitia..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="w-full py-4 pr-4 bg-transparent focus:outline-none focus:ring-0 text-stone-700 placeholder-stone-400 text-[15px]"
          />
        </div>

        <AnimatePresence>
          {isOpen && query.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, pointerEvents: 'none' }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl border border-stone-200/60 rounded-2xl shadow-xl overflow-hidden z-50"
            >
              <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
                {results.length > 0 ? (
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Hasil Pencarian
                    </div>
                    {results.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => handleResultClick(result.tab)}
                        className="w-full flex items-start gap-4 px-4 py-3 hover:bg-stone-50 active:bg-stone-100 transition-colors border-l-2 border-transparent hover:border-stone-800 text-left"
                      >
                        <div className="p-2 bg-stone-100 rounded-xl text-stone-600 flex-shrink-0">
                          {result.ikon}
                        </div>
                        <div>
                          <div className="font-semibold text-stone-900 text-sm">{result.label}</div>
                          <div className="text-xs text-stone-500 mt-0.5 line-clamp-1">{result.text}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 px-6 text-center">
                    <Search className="w-8 h-8 text-stone-300 mx-auto mb-3" />
                    <p className="text-stone-500 text-sm">Tidak ada hasil yang ditemukan untuk <span className="font-medium text-stone-800">"{query}"</span></p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
