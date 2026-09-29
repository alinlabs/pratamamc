import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, FileText, Quote, Pencil, X, Share2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Note = {
  judul: string;
  konten: string;
  tipe?: string;
};

const renderContent = (note: Note) => {
  if (note.tipe === 'point') {
    const points = note.konten.split(',');
    return (
      <ul className="list-disc pl-5 space-y-4 marker:text-stone-700">
        {points.map((point, index) => {
          if (!point.trim()) return null;
          return (
            <li key={index} className="text-stone-700 leading-relaxed text-[15px] sm:text-base pl-2">
              {point.trim()}
            </li>
          );
        })}
      </ul>
    );
  }

  const lines = note.konten.split('\n');
  return (
    <div className="flex flex-col gap-1.5">
      {lines.map((line, index) => {
        if (line.trim().startsWith('-')) {
          const text = line.trim().substring(1).trim();
          return (
            <div key={index} className="flex gap-4 items-start relative pl-1 mb-1">
              <span className="absolute left-1.5 top-2.5 w-1.5 h-1.5 rounded-full bg-stone-700"></span>
              <span className="text-stone-700 leading-relaxed text-[15px] sm:text-base pl-3">{text}</span>
            </div>
          );
        }
        if (line.trim() === '') {
          return <div key={index} className="h-1.5 sm:h-2.5"></div>; // Adds spacing for empty lines
        }
        return (
          <p key={index} className="text-stone-700 leading-relaxed text-[15px] sm:text-base">
            {line}
          </p>
        );
      })}
    </div>
  );
};

const NoteItem: React.FC<{ note: Note }> = ({ note }) => {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <>
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-stone-200 overflow-hidden transition-all duration-300">
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full px-5 py-4 sm:px-6 sm:py-5 flex items-center gap-4 text-left transition-colors hover:bg-[#FAF9F6]"
        >
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors duration-300 bg-stone-100 text-stone-500 group-hover:bg-[#DCAF43]/10 group-hover:text-[#DCAF43]">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold flex-grow pr-2 transition-colors duration-300 text-stone-800 group-hover:text-[#DCAF43]">
            {note.judul}
          </h3>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-end md:justify-center p-0 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full md:max-w-2xl max-h-[80vh] md:max-h-[80vh] bg-white rounded-t-3xl md:rounded-3xl shadow-2xl relative z-10 flex flex-col overflow-hidden mt-auto md:mt-0"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.2 }}
              onDragEnd={(e, info) => {
                if (info.offset.y > 100 || info.velocity.y > 500) {
                  setIsOpen(false);
                }
              }}
            >
              <div className="w-full flex justify-center pt-3 pb-1 md:hidden">
                <div className="w-12 h-1.5 bg-stone-200 rounded-full" />
              </div>
              <div className="px-4 pb-4 pt-1 sm:p-6 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#DCAF43]/10 text-[#DCAF43] flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-stone-800 pr-2">
                    {note.judul}
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-900 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
              
              <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain">
                <div className="bg-[#FAF9F6] rounded-2xl p-5 sm:p-6 lg:p-8 border border-stone-100">
                  {renderContent(note)}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

interface CatatanViewProps {
  notes: string | Note[];
  onEdit?: () => void;
}

export default function CatatanView({ notes, onEdit }: CatatanViewProps) {
  const [displayNotes, setDisplayNotes] = useState<string | Note[]>([]);
  const [isLoadingDefault, setIsLoadingDefault] = useState(false);

  useEffect(() => {
    const fetchDefault = async () => {
      if (!notes || (Array.isArray(notes) && notes.length === 0)) {
        setIsLoadingDefault(true);
        try {
          const res = await fetch('/data/default-catatan.json');
          if (res.ok) {
            const data = await res.json();
            setDisplayNotes(data);
          } else {
            setDisplayNotes([]);
          }
        } catch (e) {
          console.error("Failed to load default catatan", e);
          setDisplayNotes([]);
        } finally {
          setIsLoadingDefault(false);
        }
      } else {
        setDisplayNotes(notes);
      }
    };
    fetchDefault();
  }, [notes]);

  if (isLoadingDefault) {
    return (
      <div className="py-10 flex justify-center">
        <Loader2 className="w-8 h-8 text-[#DCAF43] animate-spin" />
      </div>
    );
  }

  if (!displayNotes || (Array.isArray(displayNotes) && displayNotes.length === 0)) {
    return (
      <div className="py-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-stone-800">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
            Catatan & Naskah
          </h2>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-600 rounded-full transition-all shadow-sm active:scale-95 hover:scale-105 cursor-pointer"
                title="Edit Catatan"
              >
                <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-stone-500" strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-stone-300" strokeWidth={1.5} />
          </div>
          <p className="text-lg leading-relaxed text-stone-500 font-medium">
            Tidak ada catatan khusus yang disediakan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2 sm:py-4 text-left">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-stone-800">
          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
          Catatan & Naskah
        </h2>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-600 rounded-full transition-all shadow-sm active:scale-95 hover:scale-105 cursor-pointer"
              title="Edit Catatan"
            >
              <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-stone-500" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
      
      {typeof displayNotes === 'string' ? (
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#DCAF43]"></div>
          <div className="p-6 md:p-8 relative">
            <Quote className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 text-stone-100 -z-0 rotate-180" strokeWidth={1.5} />
            <div className="relative z-10">
              {renderContent({ judul: '', konten: displayNotes as string, tipe: 'deskripsi' })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:gap-4">
          {displayNotes.map((note, index) => (
            <NoteItem key={index} note={ note } />
          ))}
        </div>
      )}
    </div>
  );
}

