import React, { useState, useEffect } from 'react';
import { Briefcase, Medal, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getPencapaianData, getPengalamanData } from '../../../lib/api';
import LoadingSpinner from '../../../components/screen-loading';

export default function PortofolioPage() {
  const [activeTab, setActiveTab] = useState<'pengalaman' | 'pencapaian'>('pengalaman');

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
                <Medal className="w-3.5 h-3.5" />
                Gallery & Penghargaan
            </div>
            <h1 className="text-3xl md:text-5xl font-sans font-bold mb-3 md:mb-4 text-stone-900 leading-tight">
              Portofolio MC Wedding & Event
            </h1>
            <p className="hidden md:block text-stone-500 text-lg sm:text-xl font-light mb-4 md:mb-6 max-w-2xl mx-auto leading-relaxed">
              Karya, pencapaian, dan momen tak terlupakan dari berbagai acara pernikahan maupun corporate event yang telah dikelola oleh Pratama MC di kawasan Purwakarta, Subang, Karawang, Bekasi, dan Jakarta.
            </p>
          </motion.div>

          <div className="flex justify-center mt-6 px-4 md:px-0">
            <div className="inline-flex bg-white p-1.5 rounded-[1.25rem] shadow-sm border border-stone-200 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('pengalaman')}
                className={`flex-1 sm:px-8 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
                  activeTab === 'pengalaman' 
                    ? 'bg-[#DCAF43] text-white shadow-md' 
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Pengalaman
                </div>
              </button>
              <button
                onClick={() => setActiveTab('pencapaian')}
                className={`flex-1 sm:px-8 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
                  activeTab === 'pencapaian' 
                    ? 'bg-[#DCAF43] text-white shadow-md' 
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Pencapaian
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <div className="pt-6 md:pt-10">
        <AnimatePresence mode="wait">
          {activeTab === 'pengalaman' ? (
            <motion.div
              key="pengalaman"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <PortofolioGrid />
            </motion.div>
          ) : (
            <motion.div
              key="pencapaian"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <PencapaianGrid />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PortofolioGrid() {
  const [pengalaman, setPengalaman] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPengalamanData()
      .then((data) => {
        const sanitized = data.map((item: any) => ({
          ...item,
          gambar: Array.isArray(item.gambar) ? item.gambar : (typeof item.gambar === 'string' ? item.gambar.split(',') : [])
        }));
        setPengalaman(sanitized);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching pengalaman data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-10"><LoadingSpinner size={40} /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6">
      <div className="flex flex-col gap-8 md:gap-12">
        {pengalaman.map((item, index) => (
          <div key={item.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <h3 className="text-xl md:text-2xl font-bold text-stone-900 leading-tight mb-3">{item.judul}</h3>
                <p className="text-stone-600 text-sm md:text-base leading-relaxed mb-4">
                  {item.deskripsi}
                </p>
                {item.detail && (
                  <div className="text-stone-500 text-sm border-l-2 border-[#DCAF43] pl-4 italic">
                    {item.detail}
                  </div>
                )}
              </div>
              
              <div className="p-4 md:p-6 bg-stone-50 flex gap-2 items-center justify-center">
                 {item.gambar && item.gambar.length > 0 ? (
                    <div className={`grid gap-2 w-full ${item.gambar.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {item.gambar.map((img: string, i: number) => (
                        <img 
                          key={i}
                          src={img.trim()} 
                          alt={`${item.judul} ${i + 1}`} 
                          className="w-full h-48 md:h-64 object-cover rounded-lg shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                 ) : (
                    <div className="w-full h-48 bg-stone-200 rounded-lg animate-pulse flex items-center justify-center text-stone-400">
                      Tidak ada foto
                    </div>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PencapaianGrid() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPencapaianData()
      .then((data) => {
        const sanitized = data.map((item: any) => ({
          ...item,
          gambar: Array.isArray(item.gambar) ? item.gambar : (typeof item.gambar === 'string' ? item.gambar.split(',') : [])
        }));
        setAchievements(sanitized);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching pencapaian data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-10"><LoadingSpinner size={40} /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6">
      <div className="flex flex-col gap-6 md:gap-8">
        {achievements.map((item) => (
          <div key={item.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#DCAF43] transition-all duration-300 text-left flex flex-col md:flex-row">
            
            {item.gambar && item.gambar.length > 0 && (
               <div className="md:w-[40%] p-4 bg-stone-50 border-b md:border-b-0 md:border-r border-stone-100 flex items-center justify-center shrink-0">
                  <div className={`grid gap-2 w-full h-full ${item.gambar.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                     {item.gambar.map((img: string, i: number) => (
                        <img 
                          key={i}
                          src={img.trim()} 
                          alt={`${item.judul} ${i + 1}`} 
                          className="w-full h-40 md:h-full object-cover rounded shadow-sm min-h-[160px]"
                          referrerPolicy="no-referrer"
                        />
                     ))}
                  </div>
               </div>
            )}
            
            <div className="p-5 md:p-6 flex-1 flex flex-col">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-stone-900 leading-tight mb-2">{item.judul}</h3>
                  <div className="inline-flex items-center text-xs font-medium text-[#DBB24E] bg-[#DBB24E]/10 px-2.5 py-0.5 rounded-full">
                    {item.jenis}
                  </div>
                </div>
                <div className="shrink-0 text-sm font-semibold text-stone-400 font-mono bg-stone-100 px-3 py-1 rounded-lg self-start">
                  {item.tahun}
                </div>
              </div>
              <p className="text-stone-600 text-sm md:text-base leading-relaxed mb-4">
                {item.deskripsi}
              </p>
              {item.detail && (
                <div className="mt-auto pt-4 border-t border-stone-100">
                  <p className="text-stone-500 text-xs md:text-sm !leading-relaxed italic border-l-2 border-[#DCAF43]/50 pl-3">
                    {item.detail}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
