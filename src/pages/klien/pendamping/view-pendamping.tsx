import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Pencil, Share2, ChevronDown } from 'lucide-react';
import ContactCard from '../../../components/modal-detail';

interface GroomsmenBridesmaidsProps {
  groomsmenBridesmaids: { id?: string; peran: string; nama: string; gambar?: string; whatsapp?: string; instagram?: string; contact?: string }[];
}

export function GroomsmenBridesmaids({ groomsmenBridesmaids }: GroomsmenBridesmaidsProps) {
  if (!groomsmenBridesmaids || groomsmenBridesmaids.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-6 sm:gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {groomsmenBridesmaids.map((k, index) => (
        <ContactCard
          key={`${k.id || 'pendamping'}-${index}`}
          nama={k.nama}
          peran={k.peran}
          whatsapp={k.whatsapp || k.contact}
          instagram={k.instagram}
          imageUrl={k.gambar}
        />
      ))}
    </div>
  );
}

export default function PendampingView({ event, onEdit }: { event: any, onEdit?: () => void }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const pendamping = event.pendamping || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-1"
    >
      <div>
        <div className="flex items-center justify-between gap-4 mb-4 sm:mb-6 w-full">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-stone-800">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#DCAF43]" />
            Pendamping
          </h2>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-600 rounded-full transition-all shadow-sm active:scale-95 hover:scale-105 cursor-pointer"
                title="Edit Pendamping"
              >
                <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-stone-500" strokeWidth={2} />
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-600 rounded-full transition-all shadow-sm active:scale-95 hover:scale-105 cursor-pointer"
              title="Toggle Pendamping"
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
              <div className="flex flex-col gap-4 pt-2">
                <GroomsmenBridesmaids groomsmenBridesmaids={pendamping} />
                
                {!pendamping.length && (
                  <div className="py-12 text-center bg-stone-50/50 rounded-2xl border border-dashed border-stone-200">
                    <Users className="w-8 h-8 text-stone-300 mx-auto mb-3" />
                    <p className="text-stone-500 text-sm">Tidak ada daftar pendamping pengantin ditemukan.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
