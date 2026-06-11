import React, { useRef, useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimoni() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);
  
  const testimonials = [
    {
      id: 1,
      nama: "Sarah & Agung",
      peran: "Klien Pernikahan",
      tanggal: "12 Oktober 2025",
      konten: "Sumpah keren banget! Kak Pratama bener-bener bisa bikin suasana nikahan kita hidup dan nggak garing sama sekali. Rapi banget dari awal sampe akhir, the best pokoknya!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=120&h=120"
    },
    {
      id: 2,
      nama: "Budi Santoso",
      peran: "Event Manager TechCorp",
      tanggal: "5 Agustus 2025",
      konten: "MC-nya asik parah dan gampang banget adaptasi sama audiens. Gala dinner kantor yang biasanya kaku jadi pecah banget. Recommended abis buat acara corporate!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120"
    },
    {
      id: 3,
      nama: "Dina Mariana",
      peran: "Ketua Panitia Festival",
      tanggal: "20 Mei 2025",
      konten: "Energinya nggak ada habisnya! Gila sih, bisa jaga hype ribuan penonton dari sore sampe tengah malem tanpa keliatan capek. Gokil!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120"
    },
    {
      id: 4,
      nama: "Andi & Rani",
      peran: "Klien Pernikahan",
      tanggal: "14 Februari 2025",
      konten: "Awalnya worry banget bakal kaku, eh ternyata MC nya bisa nyairin suasana dengan candaan yang pas banget. Keluarga dua belah pihak nyampur dan enjoy banget sama jalannya acara.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?auto=format&fit=crop&q=80&w=120&h=120"
    },
    {
      id: 5,
      nama: "Clara S.",
      peran: "Marketing Director",
      tanggal: "10 November 2024",
      konten: "Sangat profesional. Membawakan acara product launch kami dengan sangat memukau dan berhasil engaging dengan audiens VIP kami secara sempurna.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120&h=120"
    },
    {
      id: 6,
      nama: "Kevin & Tasya",
      peran: "Klien Pernikahan",
      tanggal: "28 September 2024",
      konten: "Thank you for making our wedding truly memorable! The way you handled the rundown and engaged with our guests was top notch. Highly recommended!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=120&h=120"
    }
  ];

  const scrollToActiveIndex = (index: number) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const itemElement = container.children[index] as HTMLElement;
      if (itemElement) {
        const offsetLeft = itemElement.offsetLeft;
        const targetScroll = isDesktop
          ? offsetLeft
          : offsetLeft - (container.clientWidth - itemElement.clientWidth) / 2;
        container.scrollTo({
          left: Math.max(0, targetScroll),
          behavior: "smooth"
        });
        setActiveIndex(index);
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHovered && !isDragging) {
        if (isDesktop) {
          const nextIndex = activeIndex < 3 ? 3 : 0;
          scrollToActiveIndex(nextIndex);
        } else {
          const nextIndex = (activeIndex + 1) % testimonials.length;
          scrollToActiveIndex(nextIndex);
        }
      }
    }, 7000);
    
    return () => clearInterval(timer);
  }, [activeIndex, isHovered, isDragging, isDesktop]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const containerCenter = container.scrollLeft + container.clientWidth / 2;
      
      let closestIndex = 0;
      let minDistance = Infinity;
      
      for (let i = 0; i < container.children.length; i++) {
        const child = container.children[i] as HTMLElement;
        const childCenter = child.offsetLeft + child.clientWidth / 2;
        const distance = Math.abs(containerCenter - childCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }
      
      if (closestIndex !== activeIndex) {
        setActiveIndex(closestIndex);
      }
    }
  };

  const startDragging = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    if (scrollRef.current) {
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const onDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    if (scrollRef.current) {
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <section id="testimonials" className="pt-2 md:pt-4 pb-8 md:pb-12 bg-white overflow-hidden relative">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16">
          <span className="text-sm md:text-base font-semibold tracking-widest text-[#DCAF43] uppercase mb-3 block">Testimonial</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-stone-900">Apa Kata Mereka</h2>
          <p className="text-stone-500 max-w-2xl mx-auto md:text-lg hidden md:block">Kesan dan pesan dari klien dan mitra yang telah mempercayakan momen spesial mereka.</p>
        </div>
        
        <div 
          className="relative max-w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            stopDragging();
          }}
        >
          <div 
            ref={scrollRef}
            onMouseDown={startDragging}
            onMouseUp={stopDragging}
            onMouseMove={onDrag}
            onScroll={handleScroll}
            className="flex overflow-x-auto hide-scrollbar gap-4 md:gap-6 snap-x snap-mandatory px-4 md:px-0 cursor-grab active:cursor-grabbing pb-6"
          >
            {testimonials.map((t) => (
              <div key={t.id} className="w-[85vw] sm:w-[340px] lg:w-[calc((100%-3rem)/3)] flex-shrink-0 snap-center lg:snap-start transition-opacity">
                <div className="bg-stone-50 p-6 md:p-8 lg:p-6 rounded-3xl border border-stone-100 flex flex-col relative h-full hover:shadow-lg transition-shadow duration-300 pointer-events-none select-none">
                   <div className="flex justify-between items-start mb-4 md:mb-6 lg:mb-4">
                     <div className="flex gap-1">
                       {[...Array(t.rating)].map((_, i) => (
                         <Star key={i} className="w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 fill-[#DCAF43] text-[#DCAF43]" />
                       ))}
                     </div>
                     <span className="text-xs md:text-sm text-stone-400 font-medium">{t.tanggal}</span>
                   </div>
                   <p className="text-stone-600 mb-6 md:mb-8 lg:mb-4 leading-relaxed italic text-base md:text-lg lg:text-sm min-h-[100px] lg:min-h-[80px]">"{t.konten}"</p>
                   <div className="mt-auto pt-4 border-t border-stone-200/60 flex justify-between items-center gap-4">
                     <div className="flex-1">
                       <h4 className="font-bold text-stone-900 text-sm lg:text-base">{t.nama}</h4>
                       <p className="text-xs md:text-sm text-[#DCAF43] mt-0.5">{t.peran}</p>
                     </div>
                     <img 
                       src={t.avatar} 
                       alt={t.nama}
                       referrerPolicy="no-referrer"
                       className="w-10 h-10 md:w-12 md:h-12 lg:w-10 lg:h-10 rounded-full object-cover border border-stone-200 shadow-sm shrink-0 bg-stone-100"
                     />
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Pagination Indicators */}
          <div className="flex justify-center items-center gap-2 mt-4 md:mt-6">
            {isDesktop ? (
              <>
                <button
                  onClick={() => scrollToActiveIndex(0)}
                  className={`h-2 rounded-full transition-all duration-300 ${activeIndex < 3 ? 'w-6 bg-[#DCAF43]' : 'w-2 bg-stone-200 hover:bg-stone-300'}`}
                  aria-label="Go to page 1"
                />
                <button
                  onClick={() => scrollToActiveIndex(3)}
                  className={`h-2 rounded-full transition-all duration-300 ${activeIndex >= 3 ? 'w-6 bg-[#DCAF43]' : 'w-2 bg-stone-200 hover:bg-stone-300'}`}
                  aria-label="Go to page 2"
                />
              </>
            ) : (
              testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToActiveIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${activeIndex === index ? 'w-6 bg-[#DCAF43]' : 'w-2 bg-stone-200 hover:bg-stone-300'}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
