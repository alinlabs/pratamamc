import React, { useState, useEffect } from "react";
import { Music, Play, Square, AlertCircle, SkipBack, SkipForward, X, Repeat } from "lucide-react";
import { getMusikData } from "../../../lib/api";

interface MusikTabProps {
  event: any;
}

export default function MusikTab({ event }: MusikTabProps) {
  const [musikData, setMusikData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchMusik = async () => {
      try {
        const data = await getMusikData();
        setMusikData(data);
      } catch (error) {
        console.error("Gagal memuat master data musik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMusik();
  }, []);

  const getMatchedSongDetails = (musicItem: string) => {
    const isInternalMusic = String(musicItem).startsWith('msc-');
    const baseMusicId = isInternalMusic ? String(musicItem).split('-').slice(0, 2).join('-') : musicItem;
    
    const matchedSong = musikData.find((m) => {
      const songLink = m.versi?.[0]?.tautan || m.tautan || m.link;
      const mBaseId = String(m.id).startsWith('msc-') ? String(m.id).split('-').slice(0, 2).join('-') : String(m.id);

      return (
        String(m.id) === String(musicItem) ||
        (isInternalMusic && mBaseId === baseMusicId) ||
        String(m.id).startsWith(String(musicItem)) ||
        String(songLink) === String(musicItem)
      );
    });

    if (matchedSong) {
      const variantMatches = String(musicItem).split('-');
      const requestedVariant = variantMatches.length > 2 ? variantMatches[2].toLowerCase() : '';
      
      let specificTautan = null;
      if (requestedVariant && matchedSong.versi) {
        const vMatch = matchedSong.versi.find((v: any) => v.kategori?.toLowerCase() === requestedVariant);
        if (vMatch && vMatch.tautan) {
          specificTautan = vMatch.tautan;
        }
      }
      
      return {
        songName: `${matchedSong.artis} - ${matchedSong.judul}`,
        linkMusik: specificTautan || matchedSong.versi?.[0]?.tautan || matchedSong.tautan || matchedSong.link,
      };
    }
    return {
      songName: musicItem,
      linkMusik: musicItem,
    };
  };

    const getYoutubeId = (url: string) => {
      if (!url) return null;
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
    };

    const YoutubeTitle = ({ url, fallback }: { url: string, fallback: string }) => {
      const [title, setTitle] = useState<string>('');

      useEffect(() => {
        let isMounted = true;
        const fetchTitle = async () => {
          try {
            const response = await fetch(`https://noembed.com/embed?dataType=json&url=${encodeURIComponent(url)}`);
            const data = await response.json();
            if (isMounted && data && data.title) {
              setTitle(data.title);
            }
          } catch (error) {
            console.error('Failed to fetch YouTube title:', error);
          }
        };
        fetchTitle();
        return () => { isMounted = false; };
      }, [url]);

      return <>{title || fallback || 'Video YouTube'}</>;
    };

  const CustomAudioPlayer = ({ src }: { src: string }) => {
    const audioRef = React.useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoop, setIsLoop] = useState(false);

    useEffect(() => {
      if (audioRef.current && isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }, [src]);

    const togglePlay = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    const toggleLoop = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsLoop(!isLoop);
    };

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };

    const seekBackward = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (audioRef.current) {
        audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
      }
    };

    const seekForward = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (audioRef.current) {
        audioRef.current.currentTime = Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + 10);
      }
    };

    const formatTime = (time: number) => {
      if (isNaN(time)) return "0:00";
      const mins = Math.floor(time / 60);
      const secs = Math.floor(time % 60);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleProgressScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      const newTime = Number(e.target.value);
      if (audioRef.current) {
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    };

    return (
      <div className="flex flex-col w-full" onClick={(e) => e.stopPropagation()}>
        <audio
          ref={audioRef}
          src={src}
          loop={isLoop}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => { if (!isLoop) setIsPlaying(false); }}
        />
        
        <div className="flex items-center gap-2 sm:gap-4 w-full">
          <button 
            onClick={togglePlay}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-[#DCAF43] text-stone-900 rounded-full flex items-center justify-center hover:bg-[#c29631] transition-colors shrink-0 shadow-sm"
          >
            {isPlaying ? (
              <Square className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
            ) : (
              <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-1" fill="currentColor" />
            )}
          </button>

          <button 
            onClick={seekBackward}
            className="p-1.5 text-stone-400 hover:text-stone-800 transition-colors shrink-0 ml-1 sm:ml-0"
            title="Mundur 10 detik"
          >
            <SkipBack className="w-5 h-5" fill="currentColor" />
          </button>
          
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between sm:gap-3 min-w-0">
             {/* Durasi berjalan dan total di atas bar pada mode mobile */}
             <div className="flex justify-between w-full sm:hidden mb-1 px-0.5">
               <span className="text-[10px] text-stone-500 font-mono">{formatTime(currentTime)}</span>
               <span className="text-[10px] text-stone-500 font-mono">{formatTime(duration)}</span>
             </div>

             <span className="hidden sm:inline text-xs text-stone-500 font-mono w-10 text-right shrink-0">{formatTime(currentTime)}</span>
             
             <div className="relative w-full h-1.5 bg-stone-200 rounded-lg flex items-center shrink-0">
               <div 
                 className="absolute left-0 top-0 h-full bg-[#DCAF43] rounded-lg pointer-events-none" 
                 style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
               ></div>
               <input
                 type="range"
                 min="0"
                 max={duration || 100}
                 value={currentTime}
                 onChange={handleProgressScrub}
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 m-0"
                 onClick={(e) => e.stopPropagation()}
               />
               <div 
                 className="absolute w-3 h-3 bg-[#DCAF43] rounded-full pointer-events-none transform -translate-x-1/2"
                 style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
               ></div>
             </div>

             <span className="hidden sm:inline text-xs text-stone-500 font-mono w-10 shrink-0">{formatTime(duration)}</span>
          </div>

          <button 
            onClick={seekForward}
            className="p-1.5 text-stone-400 hover:text-stone-800 transition-colors shrink-0"
            title="Maju 10 detik"
          >
            <SkipForward className="w-5 h-5" fill="currentColor" />
          </button>

          <button 
            onClick={toggleLoop}
            className={`p-1.5 transition-colors shrink-0 ${isLoop ? 'text-[#DCAF43]' : 'text-stone-400 hover:text-stone-800'}`}
            title={isLoop ? "Batalkan Ulangi (Loop: Aktif)" : "Ulangi Musik (Loop: Nonaktif)"}
          >
            <Repeat className={`w-5 h-5 ${isLoop ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin w-8 h-8 rounded-full border-4 border-stone-200 border-t-[#DCAF43]"></div>
      </div>
    );
  }

  const susunanAcara = Array.isArray(event.susunan_acara) ? event.susunan_acara : [];

  // Flatten and group the music items from rundown to prevent duplicates
  const groupedMusicMap = new Map<string, { Segment: string, KegiatanList: string[], MusicItem: string, Detail: any }>();
  
  susunanAcara.forEach((item: any) => {
    if (item.musik) {
      const musicArray = Array.isArray(item.musik) ? item.musik.filter(Boolean) : [item.musik].filter(Boolean);
      musicArray.forEach((m: string) => {
        const detail = getMatchedSongDetails(String(m));
        const key = detail.linkMusik || String(m);
        const kegiatanName = item.kegiatan || "-";
        
        const existing = groupedMusicMap.get(key);
        if (existing) {
          if (!existing.KegiatanList.includes(kegiatanName)) {
            existing.KegiatanList.push(kegiatanName);
          }
        } else {
          groupedMusicMap.set(key, {
            Segment: item.segmen || "-",
            KegiatanList: [kegiatanName],
            MusicItem: String(m),
            Detail: detail
          });
        }
      });
    }
  });

  const allUsedMusic = Array.from(groupedMusicMap.values()).map(music => ({
    Segment: music.Segment,
    Kegiatan: music.KegiatanList.join(", "),
    MusicItem: music.MusicItem,
    Detail: music.Detail
  }));

  return (
    <div className={`bg-white rounded-3xl shadow-sm border border-stone-100 p-6 md:p-8 ${activeIndex !== null ? 'pb-32 sm:pb-8' : ''}`}>
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-[#DCAF43]/10 rounded-2xl text-[#DCAF43]">
          <Music className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-800">
            Daftar Musik
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Daftar lagu yang digunakan dalam setiap sesi acara
          </p>
        </div>
      </div>

      {allUsedMusic.length === 0 ? (
        <div className="py-12 bg-stone-50 rounded-2xl border border-stone-100 border-dashed flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <Music className="w-8 h-8 text-stone-300" />
          </div>
          <h3 className="text-lg font-semibold text-stone-800 mb-1">
            Belum Ada Musik
          </h3>
          <p className="text-sm text-stone-500 max-w-sm">
            Tidak ada musik yang dipilih untuk rangkaian acara ini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {allUsedMusic.map((item, idx) => {
            const isActive = activeIndex === idx;

            return (
              <div 
                key={idx}
                onClick={() => setActiveIndex(isActive ? null : idx)}
                className={`group flex flex-col p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                  isActive 
                    ? "border-[#DCAF43] bg-[#DCAF43]/5" 
                    : "border-stone-100 bg-white hover:border-[#DCAF43]/30 hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                      isActive 
                        ? "bg-[#DCAF43]/10 border-[#DCAF43]/20" 
                        : "bg-stone-50 border-stone-100 group-hover:bg-[#DCAF43]/5"
                    }`}>
                      {isActive ? (
                        <Square className="w-5 h-5 text-[#DCAF43]" fill="currentColor" />
                      ) : (
                        <Play className="w-5 h-5 text-stone-400 group-hover:text-[#DCAF43] ml-0.5" fill="currentColor" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-bold text-stone-800 leading-snug">
                        {item.Detail.songName === item.MusicItem && getYoutubeId(item.MusicItem) ? (
                          <YoutubeTitle url={item.MusicItem} fallback={item.Detail.songName || 'Judul Musik'} />
                        ) : (
                          item.Detail.songName !== item.MusicItem ? item.Detail.songName : item.MusicItem
                        )}
                      </h4>
                      <p className="text-xs text-stone-500 font-normal mt-1.5 leading-relaxed">
                        Sesi Acara: {item.Kegiatan}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeIndex !== null && (
        <div className="fixed bottom-0 inset-x-0 z-[60] bg-white shadow-[0_-8px_30px_rgb(0,0,0,0.12)] border-t border-stone-200 overflow-hidden pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-0">
          {(() => {
            const item = allUsedMusic[activeIndex];
            const isValidUrl = item.Detail.linkMusik && item.Detail.linkMusik.startsWith("http");
            const youtubeId = isValidUrl ? getYoutubeId(item.Detail.linkMusik) : null;
            return (
              <div className="flex flex-col sm:flex-row items-center sm:items-stretch justify-between mx-auto w-full max-w-7xl">
                <div className="flex items-start sm:items-center justify-between p-4 w-full sm:w-1/2 min-w-0">
                  <div className="flex flex-col flex-1 min-w-0 mr-4">
                    <h4 className="text-sm font-bold text-stone-800 leading-snug break-words">
                      {item.Detail.songName === item.MusicItem && youtubeId ? (
                        <YoutubeTitle url={item.MusicItem} fallback={item.Detail.songName || 'Judul Musik'} />
                      ) : (
                        item.Detail.songName !== item.MusicItem ? item.Detail.songName : item.MusicItem
                      )}
                    </h4>
                    <p className="text-xs text-stone-500 font-normal leading-relaxed mt-1 break-words">
                      Sesi Acara: {item.Kegiatan}
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveIndex(null)}
                    className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-full transition-colors sm:hidden shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-4 pt-2 sm:pt-4 w-full sm:w-1/2 flex items-center justify-end sm:gap-6">
                  <div className={`w-full relative ${youtubeId ? 'rounded-xl overflow-hidden bg-black aspect-video sm:h-[80px] sm:w-[142px] shrink-0 group' : 'sm:flex-1'}`}>
                    {youtubeId ? (
                      <div className="absolute inset-0 overflow-hidden bg-black rounded-xl">
                        <div className="absolute w-[200%] h-[200%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-50 origin-center">
                          <iframe 
                            className="w-full h-full pointer-events-auto"
                            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&playsinline=1&controls=1&rel=0&modestbranding=1&fs=0&disablekb=1&showinfo=0&iv_load_policy=3&enablejsapi=1`} 
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    ) : isValidUrl ? (
                      <CustomAudioPlayer src={item.Detail.linkMusik} />
                    ) : (
                      <div className="w-full h-[80px] flex justify-center py-4 bg-stone-50 text-stone-400 rounded-xl border border-stone-100">
                         <div className="flex flex-col items-center gap-1">
                           <AlertCircle className="w-4 h-4" />
                           <span className="text-[10px] font-medium">Tautan tidak tersedia</span>
                         </div>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => setActiveIndex(null)}
                    className="hidden sm:flex p-2 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-full transition-colors shrink-0 ml-4"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

