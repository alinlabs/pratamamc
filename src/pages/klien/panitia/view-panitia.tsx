import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Pencil, Share2, Mic2, ChevronDown } from 'lucide-react';
import ContactCard from '../../../components/modal-detail';

/* ==========================================================================
   PANITIA VIEW (Combined)
   ========================================================================== */
interface PanitiaProps {
  panitia: { id?: string; nama: string; peran: string; contact?: string; whatsapp?: string; instagram?: string; gambar?: string }[];
  onEdit?: () => void;
}

export function PanitiaKeluarga({ panitia, onEdit }: PanitiaProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!panitia || panitia.length === 0) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-1"
    >
      <div className="flex items-center justify-between gap-4 mb-4 sm:mb-6 w-full">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-stone-800">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#DCAF43]" />
          Panitia Acara
        </h2>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-600 rounded-full transition-all shadow-sm active:scale-95 hover:scale-105 cursor-pointer"
              title="Edit Panitia"
            >
              <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-stone-500" strokeWidth={2} />
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-600 rounded-full transition-all shadow-sm active:scale-95 hover:scale-105 cursor-pointer"
            title="Toggle Panitia"
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
            <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-6 sm:gap-y-8 sm:grid-cols-3 lg:grid-cols-4 pt-2">
              {panitia.map((p, index) => (
                <ContactCard
                  key={`${p.id || 'panitia'}-${index}`}
                  nama={p.nama}
                  peran={p.peran}
                  whatsapp={p.whatsapp || p.contact}
                  instagram={p.instagram}
                  imageUrl={p.gambar}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ==========================================================================
   MAIN VIEW
   ========================================================================== */
interface DaftarPanitiaViewProps {
  event: any;
  onEditPanitia?: () => void;
  onEditPengisi?: () => void; // Kept for compatibility but unused
}

export default function DaftarPanitiaView({ event, onEditPanitia }: DaftarPanitiaViewProps) {
  const mergedPanitia = useMemo(() => {
    const list = [...(event.panitia_keluarga || []), ...(event.pengisi_acara || [])];
    return list.sort((a, b) => {
      const aFilled = a.nama && a.nama.trim() !== '';
      const bFilled = b.nama && b.nama.trim() !== '';
      if (aFilled && !bFilled) return -1;
      if (!aFilled && bFilled) return 1;
      return 0;
    });
  }, [event.panitia_keluarga, event.pengisi_acara]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-1"
    >
      <div className="flex flex-col gap-4">
        <PanitiaKeluarga panitia={mergedPanitia} onEdit={onEditPanitia} />
        
        {(!mergedPanitia || mergedPanitia.length === 0) && (
          <div className="py-12 text-center bg-stone-50/50 rounded-2xl border border-dashed border-stone-200">
            <Users className="w-8 h-8 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500 text-sm">Tidak ada daftar panitia / pengisi acara yang ditemukan.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
