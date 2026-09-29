import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Mic, Users, Briefcase, X, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Tentang() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.2);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (selectedService !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedService]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const onMusicPlay = () => {
      if (!isMuted) {
        setIsMuted(true);
      }
    };
    window.addEventListener("musicAudioPlaying", onMusicPlay);
    return () => window.removeEventListener("musicAudioPlaying", onMusicPlay);
  }, [isMuted]);

  useEffect(() => {
    if (!isMuted && volume > 0) {
      window.dispatchEvent(new Event("videoAudioPlaying"));
    }
  }, [isMuted, volume]);

  const services = [
    { 
      judul: 'Pembicara & Narasumber', 
      titleLine1: 'Pembicara &',
      titleLine2: 'Narasumber',
      titleMobile: 'Pembicara Narasumber',
      deskripsi: 'Penyampaian materi yang inspiratif dan interaktif untuk seminar, workshop, dan acara pendidikan.',
      ikon: Mic
    },
    { 
      judul: 'Master Of Ceremony', 
      titleLine1: 'Master Of',
      titleLine2: 'Ceremony',
      titleMobile: 'Master Of Ceremony',
      deskripsi: 'Pemanduan acara yang elegan dan profesional untuk momen istimewa dan kebutuhan spesifik acara Anda.',
      ikon: Users
    },
    { 
      judul: 'Custom Event & Business Presentator', 
      titleLine1: 'Custom Event &',
      titleLine2: 'Business Presentator',
      titleMobile: 'Business Presentator',
      deskripsi: 'Presentasi yang lugas, meyakinkan, dan profesional untuk rapat bisnis atau peluncuran produk.',
      ikon: Briefcase
    }
  ];

  return (
    <section id="about" className="pt-16 md:pt-24 pb-2 md:pb-8 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-20 items-center mb-0 md:mb-16">
          
          {/* Modern Image Container */}
          <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto order-1 md:order-2 aspect-[4/3] md:aspect-square mb-1 md:mb-0">
            <div className="absolute inset-0 bg-stone-100 rounded-3xl transform translate-x-4 translate-y-4 md:translate-x-6 md:translate-y-6"></div>
            <div className="absolute inset-0 rounded-3xl overflow-hidden z-10 shadow-xl border-4 border-white group">
              <video 
                ref={videoRef}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                webkit-playsinline="true"
                className="w-full h-full object-cover object-center"
              >
                <source src="https://github.com/alinlabs/pratamamc-data/raw/main/mc.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent md:hidden pointer-events-none"></div>
              
              <div className="absolute bottom-5 left-5 right-14 md:hidden z-20 flex flex-col justify-end pointer-events-none">
                 <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-[#DCAF43] uppercase mb-1 drop-shadow-md">Mengenal Lebih Dekat</span>
                 <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-[1.15] drop-shadow-md">Suara di Balik Momen Sempurna.</h2>
              </div>

              <div 
                className="absolute bottom-3 right-3 md:bottom-4 md:right-4 z-30 flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full p-2 md:p-2.5 transition-all w-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {!isMuted && (
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setVolume(val);
                      if (val === 0) setIsMuted(true);
                      else setIsMuted(false);
                    }}
                    className="w-16 md:w-20 h-1.5 appearance-none bg-white/30 rounded-full focus:outline-none focus:ring-0 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white cursor-pointer ml-2"
                  />
                )}
                <button 
                  onClick={() => {
                    const newMuted = !isMuted;
                    setIsMuted(newMuted);
                    if (!newMuted && volume === 0) setVolume(0.2);
                  }}
                  className="text-white transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 md:w-5 md:h-5" /> : <Volume2 className="w-4 h-4 md:w-5 md:h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Cards (Between Image and Text) */}
          <div className="order-2 md:hidden grid grid-cols-3 gap-3 w-full mt-4 mb-1">
            {services.map((service, i) => {
              const Icon = service.ikon;
              return (
                <div 
                  key={i} 
                  onClick={() => setSelectedService(i)}
                  className="group p-3 rounded-2xl bg-white border border-stone-100 hover:border-stone-300 transition-all duration-300 flex flex-col items-center text-center cursor-pointer relative"
                >
                  <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center mb-2 transition-colors duration-300 shrink-0">
                    <Icon className="w-5 h-5 text-stone-600 transition-colors duration-300" />
                  </div>
                  <h3 className="text-[11px] sm:text-xs font-bold mb-0 text-stone-900 leading-tight">
                    {service.titleMobile}
                  </h3>
                </div>
              );
            })}
          </div>

          <div className="order-3 md:order-1 flex-1 text-center md:text-left mt-2 md:mt-0">
            <div className="hidden md:block">
              <span className="text-sm md:text-base font-semibold tracking-widest text-[#DCAF43] uppercase mb-3 block">Mengenal Lebih Dekat</span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-stone-900 leading-[1.1]">Suara di Balik Momen Sempurna.</h2>
            </div>
            
            <div className="hidden md:block mb-0 md:mb-8 text-base md:text-lg lg:text-xl text-stone-600 leading-relaxed space-y-4 md:space-y-6">
              <p>
                Dengan pengalaman lebih dari 5 tahun memandu berbagai acara, dari pernikahan intim hingga gala korporat besar, saya memastikan setiap detik berlalu dengan elegan, terstruktur, dan berkesan.
              </p>
              <p className="hidden md:block">
                Bukan sekadar berbicara, tapi membangun atmosfer. Saya meyakini setiap acara memiliki nyawa tersendiri, dan tugas saya adalah memastikan nyawa tersebut hidup, beresonansi dengan seluruh tamu, dan diakhiri dengan tepuk tangan meriah.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = service.ikon;
            return (
              <div 
                key={i} 
                onClick={() => setSelectedService(i)}
                className="group p-6 lg:p-7 rounded-3xl bg-white border border-stone-200/80 hover:border-[#DCAF43]/50 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-stretch text-left cursor-pointer"
              >
                {/* Icon & Title Row */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-stone-50 group-hover:bg-stone-950 flex items-center justify-center transition-all duration-300 shrink-0 shadow-inner border border-stone-100/50">
                    <Icon className="w-7 h-7 text-stone-700 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-stone-900 leading-snug">
                    <span className="block">{service.titleLine1}</span>
                    <span className="block">{service.titleLine2}</span>
                  </h3>
                </div>

                {/* Divider for visual clarity */}
                <div className="h-px bg-stone-100 w-full mb-4 group-hover:bg-[#DCAF43]/20 transition-colors" />

                <p className="text-stone-500 text-[13px] lg:text-sm leading-relaxed">
                  {service.deskripsi}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Bottom Sheet for Service Details */}
      {createPortal(
        <AnimatePresence>
          {selectedService !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 md:hidden bg-white p-6 pb-10 rounded-t-[2rem] z-[101] shadow-2xl"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.2 }}
              onDragEnd={(e, info) => {
                if (info.offset.y > 100 || info.velocity.y > 500) {
                  setSelectedService(null);
                }
              }}
            >
              <div className="flex justify-center mb-6">
                <div className="w-12 h-1.5 bg-stone-200 rounded-full"></div>
              </div>
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-900 bg-stone-50 rounded-full transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center mt-2 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center shrink-0 mb-4">
                  {React.createElement(services[selectedService].ikon, { className: "w-8 h-8 text-stone-900" })}
                </div>
                <h3 className="text-xl font-bold text-stone-900 leading-tight">
                  {services[selectedService].judul}
                </h3>
              </div>

              <p className="text-stone-600 leading-relaxed text-base text-center">
                {services[selectedService].deskripsi}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>, document.body)}
    </section>
  );
}
