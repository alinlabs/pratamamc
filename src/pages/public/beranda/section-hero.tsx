import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Image as ImageIcon,
  Tag,
  MessageCircle,
  CalendarPlus,
  ChevronRight,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  X,
  Mic,
  Users,
  Briefcase,
  HelpCircle,
  Music,
  Star,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import QuickAccess from "./section-quickaccess";
import PromoCard from "./section-promo";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const searchData = [
    {
      judul: "Pembicara & Narasumber",
      tautan: "/#about",
      ikon: Mic,
      tipe: "Layanan",
    },
    {
      judul: "Master of Ceremony",
      tautan: "/#about",
      ikon: Users,
      tipe: "Layanan",
    },
    {
      judul: "Business Presentator",
      tautan: "/#about",
      ikon: Briefcase,
      tipe: "Layanan",
    },
    {
      judul: "Portofolio",
      tautan: "/portofolio",
      ikon: ImageIcon,
      tipe: "Halaman",
    },
    { judul: "Harga & Paket", tautan: "/harga", ikon: Tag, tipe: "Halaman" },
    { judul: "Kontak", tautan: "/kontak", ikon: MessageCircle, tipe: "Halaman" },
    {
      judul: "Rencana",
      tautan: "/rencana",
      ikon: CalendarPlus,
      tipe: "Fitur",
    },
    { judul: "Testimoni", tautan: "/#testimoni", ikon: Star, tipe: "Bagian" },
    {
      judul: "Tanya Jawab (FAQ)",
      tautan: "/#faq",
      ikon: HelpCircle,
      tipe: "Bagian",
    },
    { judul: "Cari Musik", tautan: "/musik", ikon: Music, tipe: "Fitur" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSearch = searchData.filter(
    (item) =>
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tipe.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSearchSelect = (item: (typeof searchData)[0]) => {
    setShowSearchDropdown(false);
    setSearchQuery("");
    if (item.tautan.startsWith("/#")) {
      navigate("/");
      setTimeout(() => {
        const id = item.tautan.replace("/#", "");
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 100);
    } else {
      navigate(item.tautan);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const images = [
    {
      desktop: "/gambar/banner/desktop1.webp",
      mobile: "/gambar/banner/mobile1.webp",
    },
    {
      desktop: "/gambar/banner/desktop2.webp",
      mobile: "/gambar/banner/mobile2.webp",
    },
    {
      desktop: "/gambar/banner/desktop3.webp",
      mobile: "/gambar/banner/mobile3.webp",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section id="home" className="pt-0 pb-0 bg-stone-50 min-h-screen">
      <h1 className="sr-only">Pratama MC - Professional Master of Ceremony & Wedding Organizer di Purwakarta, Subang, Karawang, Bekasi, dan Jakarta</h1>
      {/* Full Bleed Banner */}
      <div className="relative w-full aspect-[4/3] md:aspect-[3/1] overflow-hidden bg-stone-900 flex">
        <motion.div
          className="flex w-full h-full"
          animate={{ x: `-${currentIdx * 100}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {images.map((img, idx) => (
            <picture key={idx} className="w-full h-full flex-shrink-0">
              <source media="(min-width: 768px)" srcSet={img.desktop} />
              <img
                src={img.mobile}
                alt={`Hero Banner ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </picture>
          ))}
        </motion.div>
        {/* Gradasi dihapus sesuai permintaan */}
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Floating Search Bar */}
        <div
          className="relative -mt-8 mx-auto max-w-4xl px-4 z-30"
          ref={searchRef}
        >
          <div className="bg-white rounded-full shadow-xl flex items-center p-2 border border-stone-100">
            <div className="pl-4 pr-3 text-stone-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Cari layanan, portofolio, atau informasi..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="flex-1 bg-transparent border-none focus:outline-none text-stone-700 py-3 pr-4 text-sm md:text-base placeholder:text-stone-400"
            />
          </div>

          <AnimatePresence>
            {showSearchDropdown && searchQuery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-4 right-4 md:left-0 md:right-0 mt-3 bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden z-30 p-2"
              >
                <div className="max-h-64 overflow-y-auto">
                  {filteredSearch.length > 0 ? (
                    filteredSearch.map((item, idx) => {
                      const ItemIcon = item.ikon;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSearchSelect(item)}
                          className="w-full text-left flex items-center gap-4 p-4 hover:bg-stone-50 rounded-2xl transition-colors group cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-full bg-stone-100 flex flex-shrink-0 items-center justify-center group-hover:bg-[#DCAF43]/10 transition-colors">
                            <ItemIcon className="w-5 h-5 text-stone-500 group-hover:text-[#DCAF43] transition-colors" />
                          </div>
                          <div>
                            <h4 className="font-bold text-stone-900 text-sm md:text-base">
                              {item.judul}
                            </h4>
                            <p className="text-xs text-stone-500">
                              {item.tipe}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="py-8 text-center text-stone-500">
                      <Search className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                      <p className="text-sm">
                        Tidak ditemukan hasil untuk "{searchQuery}"
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Akses Cepat */}
        <QuickAccess />

        {/* Promo Card below quick access */}
        <PromoCard />
      </div>

      {/* Mobile Bottom Sheet for Promo (Removed, now handled by PopularPackage) */}
    </section>
  );
}
