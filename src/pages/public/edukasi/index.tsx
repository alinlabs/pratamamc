import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  BookOpen,
  Camera,
  X,
  PlayCircle,
  Search,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ScrollReveal from "../../../components/ScrollReveal";
import { getEdukasiData } from "../../../lib/api";

const CardItem: React.FC<{ item: any; index: number; onClick: () => void }> = ({
  item,
  index,
  onClick,
}) => (
  <ScrollReveal className="h-full" delay={index * 0.1}>
    <div
      onClick={onClick}
      className="relative bg-stone-900 rounded-[1.5rem] cursor-pointer overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 aspect-video"
    >
      <img
        src={item.gambar}
        alt={item.judul}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent"></div>
      <div className="absolute bottom-5 left-5 right-5">
        <h3 className="text-lg sm:text-xl font-bold text-white leading-tight drop-shadow-md line-clamp-2">
          {item.judul}
        </h3>
      </div>
      <div className="absolute top-4 right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
    </div>
  </ScrollReveal>
);

export default function EdukasiPage() {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<
    "deskripsi" | "makna" | "tatacara"
  >("deskripsi");
  const [categoryTab, setCategoryTab] = useState<"formal" | "adat" | "resepsi">(
    "formal",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [formalData, setFormalData] = useState<any[]>([]);
  const [adatData, setAdatData] = useState<any[]>([]);
  const [resepsiData, setResepsiData] = useState<any[]>([]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedItem) {
      document.body.classList.add('modal-open');
      setActiveTab("deskripsi");
      setShowVideo(false);
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedItem]);

  useEffect(() => {
    getEdukasiData().then((data) => {
      if (data.formal) setFormalData(data.formal);
      if (data.adat) setAdatData(data.adat);
      if (data.resepsi) setResepsiData(data.resepsi);
    }).catch(console.error);
  }, []);

  return (
    <div className="pt-20 pb-16 min-h-screen bg-stone-50">
      {/* Header Section */}
      <section className="pt-6 md:pt-12 pb-2 md:pb-4 px-0 md:px-6 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#DBB24E]/10 border border-[#DBB24E]/20 rounded-full text-xs font-medium text-[#DBB24E] tracking-wide uppercase mb-3 md:mb-5 shadow-sm">
              <BookOpen className="w-3.5 h-3.5" />
              Pusat Pengetahuan
            </div>
            <h1 className="text-3xl md:text-4xl font-sans font-bold mb-3 md:mb-4 text-stone-900 leading-tight">
              Edukasi & Tips Persiapan MC Wedding Event
            </h1>
            <p className="hidden md:block text-stone-500 text-lg sm:text-xl font-light mb-4 md:mb-6 max-w-2xl mx-auto leading-relaxed">
              Memahami makna mendalam di balik setiap prosesi pernikahan, adat istiadat, dan momentum berharga. Pratama MC memandu setiap langkah agar resepsi Anda di Purwakarta, Subang, Karawang lebih bermakna.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-0 md:pt-2">
        {/* Search and Tabs */}
        <div className="mb-10 md:mb-12">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between mb-8 md:mb-10 w-full gap-4 relative z-20">
            
            {/* Search Bar */}
            <div className="flex-1 min-w-0 flex items-center justify-start w-full">
               <div className="relative w-full flex bg-white/80 backdrop-blur-sm rounded-[1.25rem] border border-stone-200 shadow-sm overflow-visible z-30 transition-all focus-within:ring-2 focus-within:ring-[#DBB24E]/50 focus-within:border-[#DBB24E] h-[48px] md:h-[52px]">
                 
                 <div className="pl-2 pr-1 flex items-center">
                   <div className="flex items-center pointer-events-none px-2 text-stone-400">
                      <Search className="h-5 w-5" />
                   </div>
                 </div>
                 
                 <input
                   type="text"
                   placeholder="Cari referensi prosesi..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="flex-1 min-w-0 px-2 py-0 bg-transparent focus:outline-none text-sm text-stone-700 placeholder-stone-400 transition-all font-medium h-full"
                 />
                 
                 {/* Clear button */}
                 {searchQuery && (
                   <button 
                     onClick={() => setSearchQuery('')}
                     className="px-2 pr-4 md:pr-4 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                   >
                     <X className="h-5 w-5" />
                   </button>
                 )}
               </div>
            </div>

            {/* Main Tabs */}
            <div className="shrink-0 w-full md:w-auto flex justify-end overflow-x-auto minimal-scrollbar">
              <div className="inline-flex bg-white/60 backdrop-blur-md p-1.5 rounded-[1.25rem] border border-stone-200 shadow-sm w-full md:w-auto">
                <button
                  onClick={() => setCategoryTab("formal")}
                  className={`flex-1 md:flex-none px-4 py-2.5 md:py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                    categoryTab === "formal"
                      ? "bg-[#DCAF43] text-white shadow-md"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Akad
                </button>
                <button
                  onClick={() => setCategoryTab("adat")}
                  className={`flex-1 md:flex-none px-4 py-2.5 md:py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                    categoryTab === "adat"
                      ? "bg-[#DCAF43] text-white shadow-md"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Adat
                </button>
                <button
                  onClick={() => setCategoryTab("resepsi")}
                  className={`flex-1 md:flex-none px-4 py-2.5 md:py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                    categoryTab === "resepsi"
                      ? "bg-[#DCAF43] text-white shadow-md"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Resepsi
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 sm:gap-y-8">
            {categoryTab === "formal" &&
              formalData
                .filter(
                  (item) =>
                    item.judul
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((item, index) => (
                  <CardItem
                    key={item.id}
                    item={item}
                    index={index}
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
            {categoryTab === "adat" &&
              adatData
                .filter(
                  (item) =>
                    item.judul
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((item, index) => (
                  <CardItem
                    key={item.id}
                    item={item}
                    index={index}
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
            {categoryTab === "resepsi" &&
              resepsiData
                .filter(
                  (item) =>
                    item.judul
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((item, index) => (
                  <CardItem
                    key={item.id}
                    item={item}
                    index={index}
                    onClick={() => setSelectedItem(item)}
                  />
                ))}

            {/* Empty State */}
            {((categoryTab === "formal" &&
              formalData.filter(
                (item) =>
                  item.judul
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()),
              ).length === 0) ||
              (categoryTab === "adat" &&
                adatData.filter(
                  (item) =>
                    item.judul
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()),
                ).length === 0) ||
              (categoryTab === "resepsi" &&
                resepsiData.filter(
                  (item) =>
                    item.judul
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()),
                ).length === 0)) && (
              <div className="col-span-1 md:col-span-2 text-center py-16">
                <Search className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <h3 className="text-stone-900 font-semibold mb-2">
                  Tidak ditemukan
                </h3>
                <p className="text-stone-500">
                  Pencarian "{searchQuery}" tidak ditemukan pada kategori ini.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal / Bottom Sheet */}
      {createPortal(
        <AnimatePresence>
          {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm"
              onClick={() => setSelectedItem(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={(e, info) => {
                if (info.offset.y > 100 || info.velocity.y > 500) {
                  setSelectedItem(null);
                }
              }}
              className="relative bg-white rounded-t-[2rem] md:rounded-[2rem] overflow-hidden w-full md:max-w-2xl h-[85vh] md:h-auto md:max-h-[90vh] flex flex-col shadow-2xl z-10"
            >
              {/* Mobile Drag Indicator */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/40 rounded-full z-30 md:hidden pointer-events-none"></div>

              <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide bg-white">
                <div className="relative w-full pt-[56.25%] bg-stone-900 shrink-0 overflow-hidden">
                  {showVideo && selectedItem.video ? (
                    <iframe
                      src={
                        selectedItem.video.includes("youtube.com/watch?v=")
                          ? selectedItem.video.replace("watch?v=", "embed/")
                          : selectedItem.video
                      }
                      title={selectedItem.judul}
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <>
                      <img
                        src={selectedItem.gambar}
                        alt={selectedItem.judul}
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/95 via-stone-900/40 to-transparent pointer-events-none"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 pt-20 pointer-events-none">
                        <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight drop-shadow-md">
                          {selectedItem.judul}
                        </h3>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex border-b border-stone-200 bg-white shrink-0 focus:outline-none focus:ring-0">
                  <button
                    onClick={() => setActiveTab("deskripsi")}
                    className={`flex-1 py-4 text-sm font-semibold transition-colors border-b-2 focus:outline-none focus:ring-0 select-none ${activeTab === "deskripsi" ? "border-[#DBB24E] text-[#DBB24E]" : "border-transparent text-stone-400 hover:text-stone-600"}`}
                  >
                    Deskripsi
                  </button>
                  {selectedItem.makna && (
                    <button
                      onClick={() => setActiveTab("makna")}
                      className={`flex-1 py-4 text-sm font-semibold transition-colors border-b-2 focus:outline-none focus:ring-0 select-none ${activeTab === "makna" ? "border-[#DBB24E] text-[#DBB24E]" : "border-transparent text-stone-400 hover:text-stone-600"}`}
                    >
                      Makna
                    </button>
                  )}
                  {selectedItem.pelaksanaan && (
                    <button
                      onClick={() => setActiveTab("pelaksanaan")}
                      className={`flex-1 py-4 text-sm font-semibold transition-colors border-b-2 focus:outline-none focus:ring-0 select-none ${activeTab === "pelaksanaan" ? "border-[#DBB24E] text-[#DBB24E]" : "border-transparent text-stone-400 hover:text-stone-600"}`}
                    >
                      Pelaksanaan
                    </button>
                  )}
                </div>
                
                <div className="p-6 sm:p-8 bg-stone-50/50 flex-grow focus:outline-none focus:ring-0">
                <div className="prose prose-stone max-w-none">
                  {activeTab === "deskripsi" && (
                    <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed whitespace-pre-wrap">
                      {selectedItem.deskripsi}
                    </p>
                  )}
                  {activeTab === "makna" && (
                    <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed whitespace-pre-wrap">
                      {selectedItem.makna}
                    </p>
                  )}
                  {activeTab === "pelaksanaan" && (
                    <div className="flex flex-col gap-4">
                      {selectedItem.pelaksanaan
                        .split("\n")
                        .map((step: string, idx: number) => {
                          const stepParts = step.match(/^(\d+)\.\s+(.*)$/);
                          const stepNum = stepParts
                            ? stepParts[1]
                            : (idx + 1).toString();
                          const stepText = stepParts ? stepParts[2] : step;
                          return (
                            <div
                              key={idx}
                              className="flex gap-4 p-4 rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="w-8 h-8 rounded-full bg-[#DBB24E]/10 text-[#DBB24E] flex items-center justify-center font-bold text-sm shrink-0">
                                {stepNum}
                              </div>
                              <p className="text-stone-600 text-sm sm:text-base leading-relaxed pt-1 flex-1">
                                {stepText}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
              </div>

              {/* Sticky Bottom Button for Video Reference */}
              {selectedItem.video && !showVideo && (
                <div className="p-4 md:p-6 bg-white border-t border-stone-100 flex-shrink-0">
                  <button
                    onClick={() => setShowVideo(true)}
                    className="w-full bg-[#DCAF43] text-white py-3.5 rounded-full flex items-center justify-center gap-2 font-bold shadow-lg shadow-[#DBB24E]/20 hover:bg-[#c99f3c] transition-colors"
                  >
                    <PlayCircle className="w-5 h-5" /> Tonton Referensi
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>, document.body)}
    </div>
  );
}
