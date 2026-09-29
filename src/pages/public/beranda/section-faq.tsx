import React, { useState, useEffect, Fragment } from 'react';
import { HelpCircle, X, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ScrollReveal from '../../../components/ScrollReveal';
import { createPortal } from 'react-dom';

const faqs = [
  {
    q: "Berapa lama durasi maksimal untuk satu acara?",
    a: "Durasi standar adalah 4-6 jam. Namun, saya sangat fleksibel dan dapat menyesuaikan dengan kebutuhan spesifik acara Anda."
  },
  {
    q: "Apakah bisa memandu acara di luar kota?",
    a: "Tentu saja! Saya bersedia untuk memandu acara di luar kota maupun luar negeri dengan penyesuaian biaya akomodasi dan transportasi."
  },
  {
    q: "Apakah menyediakan layanan pembuatan rundown?",
    a: "Ya, saya dapat membantu menyusun rundown acara agar alur kegiatan berjalan lancar dan sesuai dengan durasi yang diinginkan."
  },
  {
    q: "Bagaimana sistem pembayarannya?",
    a: "Pembayaran dilakukan dalam 2 tahap: DP 50% untuk mengunci tanggal, dan pelunasan 50% maksimal H-1 sebelum acara berlangsung."
  },
  {
    q: "Apakah ada sesi konsultasi sebelum hari H?",
    a: "Tentu. Sesi konsultasi/technical meeting (TM) sangat penting. Kita akan membahas detail konsep, pelafalan nama, dan alur acara agar semuanya sempurna."
  },
  {
    q: "Apakah bisa memandu acara formal & non-formal?",
    a: "Ya! Dengan fleksibilitas karakter suara, saya berpengalaman memandu acara formal kenegaraan, pernikahan khidmat, hingga gathering non-formal yang seru."
  }
];

export default function FaqSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSelectedFaq(null); // Reset when closed
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const closePopup = () => setIsOpen(false);

  return (
    <Fragment>
      <section className="pt-8 md:pt-12 pb-16 md:pb-24 relative z-10 bg-stone-50/50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <ScrollReveal>
            <div className="text-center">
              <span className="text-sm md:text-base font-semibold tracking-widest text-[#DCAF43] uppercase mb-3 block">
                Bantuan & Informasi
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-stone-900">Pertanyaan Umum (FAQ)</h2>
              <p className="text-stone-500 text-lg font-light mb-8 max-w-2xl mx-auto">
                Temukan jawaban atas pertanyaan yang sering diajukan terkait layanan Profesional MC.
              </p>
            </div>

            {/* Desktop View: Grid of Questions (3 cards in 1 row) */}
            <div className="hidden md:grid grid-cols-3 gap-6 mt-8">
              {faqs.map((faq, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedFaq(index);
                    setIsOpen(true);
                  }}
                  className="p-6 bg-white border border-stone-200 rounded-2xl text-left hover:border-[#DCAF43]/60 hover:shadow-md transition-all group flex flex-row items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-bold text-stone-800 text-base lg:text-lg leading-snug group-hover:text-[#C09228] transition-colors flex-1">
                    {faq.q}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center shrink-0 group-hover:bg-[#DCAF43] group-hover:text-white transition-colors text-stone-400">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </button>
              ))}
            </div>

            {/* Mobile View: Ask Button */}
            <div className="md:hidden flex justify-center mt-8">
              <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-stone-900 text-white rounded-full font-bold hover:bg-stone-800 transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                Tanyakan Sesuatu
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center pointer-events-none">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closePopup}
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm pointer-events-auto cursor-pointer"
              />

              
              {/* Popup / Bottom Sheet */}
              <motion.div 
                initial={{ y: '100%', opacity: 1 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full md:w-[32rem] bg-white rounded-t-[2rem] md:rounded-[2rem] shadow-2xl pointer-events-auto flex flex-col overflow-hidden max-h-[85vh] md:max-h-[80vh]"
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.2 }}
                onDragEnd={(e, info) => {
                  if (info.offset.y > 100 || info.velocity.y > 500) {
                    closePopup();
                  }
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-stone-100 relative bg-white z-10 shrink-0">
                  {selectedFaq !== null ? (
                    <button 
                      onClick={() => setSelectedFaq(null)}
                      className="p-2 -ml-2 rounded-full hover:bg-stone-100 transition-colors text-stone-600 cursor-pointer md:hidden"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="w-9 h-9 md:hidden" /> // spacer for centering on mobile
                  )}
                  {/* On desktop we won't show back button, so adjust spacer */}
                  <div className="hidden md:block w-9 h-9"></div> 

                  <h3 className="font-bold text-lg text-stone-900 flex-1 text-center md:text-left md:ml-4">
                    {selectedFaq !== null ? "Detail Jawaban" : "FAQ"}
                  </h3>
                  <button 
                    onClick={closePopup}
                    className="p-2 -mr-2 bg-stone-100 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content Area */}
                <div className="overflow-y-auto custom-scrollbar flex-1 relative bg-stone-50/30">
                  <AnimatePresence mode="wait">
                    {selectedFaq === null ? (
                      <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 space-y-2"
                      >
                        {faqs.map((faq, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedFaq(index)}
                            className="w-full text-left p-4 md:p-5 bg-white border border-stone-100 rounded-2xl hover:border-stone-300 hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
                          >
                            <span className="font-medium text-stone-800 pr-4 text-sm md:text-base leading-snug group-hover:text-stone-900">
                              {faq.q}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center shrink-0 group-hover:bg-stone-900 group-hover:text-white transition-colors text-stone-400">
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="p-6 md:p-8"
                      >
                        <h4 className="text-xl md:text-2xl font-sans font-bold text-stone-900 mb-6 leading-tight">
                          {faqs[selectedFaq].q}
                        </h4>
                        <div className="bg-white p-6 rounded-[1.5rem] border border-stone-100 shadow-sm text-stone-600 leading-relaxed text-[15px] md:text-base">
                          {faqs[selectedFaq].a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>, document.body
      )}
    </Fragment>
  );
}
