import React, { useState, useEffect } from "react";
import { Calendar, ChevronDown, Trash2, GripVertical, PlayCircle, PauseCircle } from "lucide-react";
import ComboBox from "../../../../components/input-combobox";
import { Reorder } from "motion/react";
import { getMusikData } from "../../../../lib/api";

interface Props {
  tanggalAcara: string;
  setTanggalAcara: (val: string) => void;
  waktuAcara: string;
  handleChangeWaktu: (val: string) => void;
  jenisAkad: string;
  setJenisAkad: (val: string) => void;
  acaraList: any[];
  handleRemoveAcara: (id: string) => void;
  handleReorderAcara: (newAcaraList: any[]) => void;
  expandedAcara: { [key: number]: boolean };
  setExpandedAcara: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>;
}

export default function StepWaktuRundown({
  tanggalAcara,
  setTanggalAcara,
  waktuAcara,
  handleChangeWaktu,
  jenisAkad,
  setJenisAkad,
  acaraList,
  handleRemoveAcara,
  handleReorderAcara,
  expandedAcara,
  setExpandedAcara
}: Props) {
  const [musikData, setMusikData] = useState<any[]>([]);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    getMusikData().then(data => setMusikData(data)).catch(console.error);
  }, []);

  const togglePlay = (url: string) => {
    if (playingAudio === url) {
      audioObj?.pause();
      setPlayingAudio(null);
    } else {
      audioObj?.pause();
      const newAudio = new Audio(url);
      newAudio.play().catch(e => {
        console.error("Audio play failed:", e);
        setPlayingAudio(null);
      });
      // Need a way to stop it when done
      newAudio.onended = () => setPlayingAudio(null);
      setAudioObj(newAudio);
      setPlayingAudio(url);
    }
  };

  useEffect(() => {
    return () => {
      audioObj?.pause();
    };
  }, [audioObj]);
  return (
    <div className="space-y-6 pb-48">
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm transition-all duration-200 group px-4 sm:px-6 py-5 sm:py-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex justify-between items-center whitespace-nowrap">
              <span>Tanggal Acara <span className="text-red-500">*</span></span>
            </label>
            <input
              type="date"
              value={tanggalAcara}
              onChange={(e) => setTanggalAcara(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all font-medium shadow-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex justify-between items-center whitespace-nowrap">
              <span>Waktu Acara <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              value={waktuAcara}
              onChange={(e) => handleChangeWaktu(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all font-medium shadow-sm"
              placeholder="08:00"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">Jenis Akad Nikah</label>
            <ComboBox 
              options={[
                { label: 'Disandingkan', value: 'Disandingkan' },
                { label: 'Tidak Disandingkan', value: 'Tidak Disandingkan' }
              ]}
              value={jenisAkad}
              onChange={(val) => setJenisAkad(val)}
              placeholder="Pilih Jenis Akad"
            />
          </div>
        </div>
      </div>

      <hr className="border-stone-100" />
      <div className="pt-2">
        <h3 className="text-sm font-bold text-stone-700 tracking-wide uppercase mb-4">Estimasi Rundown</h3>
        <Reorder.Group 
          axis="y" 
          values={acaraList} 
          onReorder={handleReorderAcara}
          className="grid grid-cols-1 gap-4"
        >
          {acaraList.map((acara, idx) => {
            const isExpanded = expandedAcara[idx] || false;
            return (
              <Reorder.Item 
                key={acara.id} 
                value={acara}
                className="relative bg-white border border-stone-200 shadow-sm rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-default flex flex-col"
              >
                <div className="flex items-center gap-3">
                  <div className="cursor-move p-1 text-stone-300 hover:text-stone-500 transition-colors hidden sm:block">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div 
                      onClick={(e) => {
                        // Only toggle if not clicking on child inputs or buttons
                        const target = e.target as HTMLElement;
                        if (!target.closest('button') && !target.closest('.cursor-move') && !target.closest('a')) {
                          setExpandedAcara(prev => ({ ...prev, [idx]: !prev[idx] }));
                        }
                      }}
                      className="flex items-center justify-between cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="cursor-move p-1 text-stone-300 hover:text-stone-500 transition-colors sm:hidden">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-stone-800 text-sm group-hover:text-[#DCAF43] transition-colors leading-tight line-clamp-2">
                          {acara.kegiatan || `Rundown #${idx+1}`}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <div className="bg-stone-50 px-2 py-1 rounded-md text-stone-600 text-xs font-semibold whitespace-nowrap border border-stone-100">
                          {acara.waktu || '-'}
                        </div>
                        <ChevronDown 
                          className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if(window.confirm('Yakin ingin menghapus rundown ini?')) {
                              handleRemoveAcara(acara.id);
                            }
                          }}
                          className="p-1 hover:bg-red-50 text-stone-400 hover:text-red-500 rounded transition-colors ml-1"
                          title="Hapus rundown"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="pt-3 border-t border-stone-100 space-y-4 animate-in fade-in slide-in-from-top-1 duration-150 relative z-10">
                        <div>
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1 block">Deskripsi</label>
                          <p className="text-xs text-stone-600 leading-relaxed bg-stone-50/50 p-2.5 rounded-lg border border-stone-100">{acara.deskripsi || '-'}</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1 block">Catatan</label>
                          <p className="text-xs text-stone-600 italic leading-relaxed bg-stone-50/50 p-2.5 rounded-lg border border-stone-100">{acara.catatan || '-'}</p>
                        </div>
                        
                        {acara.musik && acara.musik.length > 0 && (
                           <div>
                             <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 block">Rekomendasi Lagu</label>
                             <div className="flex flex-wrap gap-2">
                               {acara.musik.map((m: string, i: number) => {
                                  const dbMusic = musikData.find((dm) => dm.id === m);
                                  const isUrl = m.startsWith('http');
                                  
                                  let label = dbMusic ? dbMusic.judul : (isUrl ? 'Lagu (Link)' : `Lagu ${m}`);
                                  let link = isUrl ? m : (dbMusic ? dbMusic.link : `/musik?search=${m}`);
                                  let directAudio = dbMusic?.link || (isUrl && m.endsWith('.mp3') ? m : null);
                                  
                                  if (m.includes('spotify') || m.includes('youtube') || m.includes('youtu.be')) {
                                      label = 'Lagu Referensi URL';
                                  }

                                  const isPlayingThis = playingAudio === directAudio;
                                  
                                  return (
                                    <div key={i} onPointerDown={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 rounded-full text-xs font-medium shadow-sm transition-all text-stone-600 hover:border-[#DCAF43]">
                                      {directAudio ? (
                                        <button 
                                          type="button"
                                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); togglePlay(directAudio); }}
                                          className={`hover:text-[#DCAF43] ${isPlayingThis ? 'text-[#DCAF43]' : ''}`}
                                        >
                                          {isPlayingThis ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                                        </button>
                                      ) : (
                                        <a href={link} target="_blank" rel="noopener noreferrer" className="hover:text-[#DCAF43]" onClick={(e) => e.stopPropagation()}>
                                          <PlayCircle className="w-4 h-4" />
                                        </a>
                                      )}
                                      <a href={link} target="_blank" rel="noopener noreferrer" className="hover:text-[#DCAF43]" onClick={(e) => e.stopPropagation()}>
                                        <span className={isPlayingThis ? 'text-[#DCAF43]' : ''}>{label}</span>
                                      </a>
                                    </div>
                                  );
                               })}
                             </div>
                           </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      </div>
    </div>
  );
}
