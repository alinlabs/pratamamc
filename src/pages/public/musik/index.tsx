import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Play,
  Pause,
  Search,
  Music,
  Plus,
  Minus,
  Filter,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Mic2,
  Piano,
  Wind,
  ChevronLeft,
  Info,
  Share2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getMusikData } from "../../../lib/api";

interface MusicVersion {
  kategori: string;
  tautan: string;
}

interface MusicItem {
  id: string;
  judul: string;
  artis: string;
  rekomendasi?: string[];
  deskripsi?: string;
  versi: MusicVersion[];
}

interface CurrentPlay {
  item: MusicItem;
  version: MusicVersion;
}

const categoryIcons: Record<string, React.ElementType> = {
  Vokal: Mic2,
  Violin: Music,
  "Violin Rendah": Music,
  "Violin Tinggi": Music,
  Orkestra: Music,
  Piano: Piano,
  Saxophone: Wind,
  Seruling: Wind,
  Suling: Wind,
};

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export default function MusikPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathParts = location.pathname.split("/").filter(Boolean);
  const musikIndex = pathParts.indexOf("musik");
  const musicSlug = pathParts[musikIndex + 1] || null;
  const musicCategory = pathParts[musikIndex + 2] || null;
  const isDownloadRoute = pathParts[musikIndex + 3] === "download";

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [musicList, setMusicList] = useState<MusicItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPlay, setCurrentPlay] = useState<CurrentPlay | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedTrackId, setExpandedTrackId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    getMusikData()
      .then((data) => {
        setMusicList(data as MusicItem[]);
      })
      .catch(console.error);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!currentPlay) return;

    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio(currentPlay.version.tautan);
      audio.loop = true;
      audioRef.current = audio;
    }

    const currentSrc = new URL(audio.src, window.location.href).href;
    const newSrc = new URL(currentPlay.version.tautan, window.location.href)
      .href;

    if (currentSrc !== newSrc) {
      audio.src = currentPlay.version.tautan;
    }

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name !== "NotAllowedError" && err.name !== "AbortError") {
            console.error("Play error:", err);
            setIsPlaying(false);
          }
        });
      }
    } else {
      audio.pause();
    }

    const updateTime = () => setCurrentTime(audio.currentTime || 0);
    const updateDuration = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [currentPlay, isPlaying]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (musicSlug && musicList.length > 0) {
      const track = musicList.find((m) => slugify(m.judul) === musicSlug);
      if (track) {
        setExpandedTrackId(track.id);
        if (musicCategory) {
          const version = track.versi.find(
            (v) => slugify(v.kategori) === musicCategory,
          );
          if (version) {
            if (
              !currentPlay ||
              currentPlay.item.id !== track.id ||
              currentPlay.version.kategori !== version.kategori
            ) {
              setCurrentPlay({ item: track, version });

              if (isDownloadRoute) {
                const link = document.createElement("a");
                link.href = version.tautan;
                link.download = `${track.judul} - ${version.kategori}.mp3`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }
          }
        }
      }
    } else {
      setExpandedTrackId(null);
    }
  }, [location.pathname, musicList]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (delta: number) => {
    setVolume((prev) => Math.min(Math.max(prev + delta, 0), 1));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const prevTrack = () => {
    if (!currentPlay || musicList.length === 0) return;
    const currentIndex = musicList.findIndex(
      (m) => m.id === currentPlay.item.id,
    );
    if (currentIndex === -1) return;

    let prevIndex = currentIndex;
    let prevItem = null;
    let versionToPlay = null;

    for (let i = 0; i < musicList.length; i++) {
      prevIndex = (prevIndex - 1 + musicList.length) % musicList.length;
      const item = musicList[prevIndex];

      const isSunda =
        item.artis.toLowerCase().includes("sunda") ||
        (item.rekomendasi &&
          item.rekomendasi.some((r) => r.toLowerCase() === "sunda"));

      if (!isSunda) {
        const validVersions = item.versi.filter(
          (v) => v.kategori.toLowerCase() !== "vokal",
        );
        if (validVersions.length > 0) {
          prevItem = item;
          const sameCategoryVersion = validVersions.find(
            (v) => v.kategori === currentPlay.version.kategori,
          );
          versionToPlay = sameCategoryVersion || validVersions[0];
          break;
        }
      }
    }

    if (prevItem && versionToPlay) {
      selectTrack(prevItem, versionToPlay);
    }
  };

  const nextTrack = () => {
    if (!currentPlay || musicList.length === 0) return;
    const currentIndex = musicList.findIndex(
      (m) => m.id === currentPlay.item.id,
    );
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    let nextItem = null;
    let versionToPlay = null;

    for (let i = 0; i < musicList.length; i++) {
      nextIndex = (nextIndex + 1) % musicList.length;
      const item = musicList[nextIndex];

      const isSunda =
        item.artis.toLowerCase().includes("sunda") ||
        (item.rekomendasi &&
          item.rekomendasi.some((r) => r.toLowerCase() === "sunda"));

      if (!isSunda) {
        const validVersions = item.versi.filter(
          (v) => v.kategori.toLowerCase() !== "vokal",
        );
        if (validVersions.length > 0) {
          nextItem = item;
          const sameCategoryVersion = validVersions.find(
            (v) => v.kategori === currentPlay.version.kategori,
          );
          versionToPlay = sameCategoryVersion || validVersions[0];
          break;
        }
      }
    }

    if (nextItem && versionToPlay) {
      selectTrack(nextItem, versionToPlay);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const selectTrack = (item: MusicItem, version: MusicVersion) => {
    setCurrentPlay({ item, version });
    setIsPlaying(true);
    navigate(`/musik/${slugify(item.judul)}/${slugify(version.kategori)}`);
  };

  const handleExpandTrack = (trackId: string | null) => {
    if (trackId) {
      const track = musicList.find((m) => m.id === trackId);
      if (track) {
        navigate(`/musik/${slugify(track.judul)}`);
      }
    } else {
      navigate(`/musik`);
    }
  };

  const allCategories = Array.from(
    new Set(musicList.flatMap((m) => m.rekomendasi || [])),
  ).sort();

  const filteredMusic = musicList.filter((m) => {
    const matchesSearch =
      m.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.artis.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = activeCategory
      ? m.rekomendasi?.includes(activeCategory)
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-stone-50 pb-24 md:pb-24 text-stone-900 pt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header Section */}
        <section className="pt-8 md:pt-12 pb-2 md:pb-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#DBB24E]/10 border border-[#DBB24E]/20 rounded-full text-xs font-medium text-[#DBB24E] tracking-wide uppercase mb-3 md:mb-6 shadow-sm">
              <Music className="w-3.5 h-3.5" />
              Galeri Musik
            </div>
            <h1 className="text-3xl md:text-5xl font-sans font-bold mb-0 md:mb-4 text-stone-900 leading-tight">
              Pustaka Musik
            </h1>
            <p className="hidden md:block text-stone-500 text-base md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
              Eksplorasi dan temukan inspirasi lagu untuk setiap momen istimewa
              di acara Anda.
            </p>
          </motion.div>
        </section>

        <div className="bg-transparent mb-12 mt-4 md:mt-0">
          {/* Search & Filter */}
          <div className="px-4 sm:px-0 sm:pb-4 relative z-20">
            <div className="flex gap-3 relative">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Cari lagu atau artis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-5 pr-12 py-3 bg-transparent border border-stone-200 rounded-xl text-sm focus:ring-0 focus:ring-0 focus:border-[#DBB24E] focus:outline-none focus:ring-0 text-stone-900 placeholder:text-stone-400 transition-all hover:border-[#DCAF43]"
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                    showFilters || activeCategory
                      ? "text-[#DBB24E] bg-[#DBB24E]/10"
                      : "text-stone-400 hover:text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Categories */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-4 sm:right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-100 overflow-hidden z-30"
                >
                  <div className="max-h-64 overflow-y-auto custom-scrollbar py-1">
                    <button
                      onClick={() => {
                        setActiveCategory(null);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        activeCategory === null
                          ? "bg-stone-50 text-[#DBB24E] font-medium"
                          : "text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      Semua Kategori
                    </button>
                    {allCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          setShowFilters(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          activeCategory === cat
                            ? "bg-stone-50 text-[#DBB24E] font-medium"
                            : "text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col md:flex-row h-auto">
            {/* Track List */}
            <div className="flex-1 w-full p-0 sm:p-2">
              {filteredMusic.map((track) => {
                const isExpanded = expandedTrackId === track.id;
                return (
                  <div
                    key={track.id}
                    className={`w-full text-left sm:rounded-2xl flex flex-col transition-all border-b sm:border sm:mb-2 overflow-hidden ${
                      currentPlay?.item.id === track.id
                        ? "bg-transparent md:bg-white border-[#DBB24E]/30 shadow-none md:shadow-sm"
                        : "bg-transparent border-stone-200/50 sm:border-transparent hover:bg-stone-100"
                    }`}
                  >
                    {/* Header row */}
                    <div
                      className={`flex items-center justify-between w-full px-4 py-4 cursor-pointer`}
                      onClick={() =>
                        handleExpandTrack(isExpanded ? null : track.id)
                      }
                    >
                      <div className="flex-1 pr-4">
                        <div className="font-semibold text-base mb-1 text-stone-900">
                          {track.judul}
                        </div>
                        <div className="text-sm font-medium text-stone-500">
                          {track.artis}
                        </div>
                      </div>

                      <div
                        className="flex items-center gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex -space-x-2 mr-2 md:mr-0 z-10">
                          {track.versi.map((version, idx) => {
                            const IconComponent =
                              categoryIcons[version.kategori] ||
                              categoryIcons["Vokal"];
                            const isCurrentVersion =
                              currentPlay?.item.id === track.id &&
                              currentPlay?.version.kategori ===
                                version.kategori;
                            return (
                              <div
                                key={idx}
                                className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center relative ${
                                  isCurrentVersion
                                    ? "bg-white text-[#DCAF43] shadow-sm z-10"
                                    : currentPlay?.item.id === track.id
                                      ? "bg-stone-50 text-stone-400"
                                      : "bg-stone-100 text-stone-500"
                                }`}
                                title={version.kategori}
                              >
                                <IconComponent className="w-3.5 h-3.5" />
                              </div>
                            );
                          })}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (currentPlay?.item.id === track.id) {
                              togglePlay();
                            } else if (track.versi && track.versi.length > 0) {
                              // Play the first available version
                              selectTrack(track, track.versi[0]);
                            }
                          }}
                          className={`flex w-10 h-10 rounded-full items-center justify-center transition-colors mr-1 sm:mr-0 ${currentPlay?.item.id === track.id ? "bg-[#DCAF43] hover:bg-[#c9a041] text-white" : "bg-white border border-stone-200 hover:bg-stone-50 text-[#DBB24E]"}`}
                          title={
                            currentPlay?.item.id === track.id && isPlaying
                              ? "Jeda"
                              : "Putar"
                          }
                        >
                          {currentPlay?.item.id === track.id && isPlaying ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </button>

                        <button
                          onClick={() =>
                            handleExpandTrack(isExpanded ? null : track.id)
                          }
                          className={`hidden sm:flex w-10 h-10 rounded-full items-center justify-center transition-colors ${currentPlay?.item.id === track.id ? "bg-stone-50 hover:bg-stone-100 text-stone-600" : "bg-stone-100 hover:bg-stone-200 text-stone-600"}`}
                        >
                          <ChevronLeft
                            className={`w-5 h-5 transition-transform ${isExpanded ? "-rotate-90" : "rotate-180"}`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Expanded State (Dropdown) */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 border-t border-stone-100 pt-4">
                            {track.rekomendasi &&
                              track.rekomendasi.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {track.rekomendasi.map((cat) => (
                                    <span
                                      key={cat}
                                      className="text-xs px-3 py-1.5 rounded-full font-semibold uppercase tracking-wider bg-[#DBB24E]/10 text-[#DBB24E]"
                                    >
                                      {cat}
                                    </span>
                                  ))}
                                </div>
                              )}

                            {track.deskripsi && (
                              <p className="text-sm leading-relaxed mb-6 text-stone-600">
                                {track.deskripsi}
                              </p>
                            )}

                            <div>
                              <h4 className="text-xs font-bold mb-3 uppercase tracking-wide text-stone-500">
                                Versi Audio Tersedia
                              </h4>
                              <div className="grid grid-cols-1 gap-2">
                                {track.versi.map((version, idx) => {
                                  const isSelected =
                                    currentPlay?.item.id === track.id &&
                                    currentPlay?.version.kategori ===
                                      version.kategori;
                                  const IconComponent =
                                    categoryIcons[version.kategori] ||
                                    categoryIcons["Vokal"];

                                  return (
                                    <div
                                      key={idx}
                                      className={`flex flex-col md:flex-row md:items-center justify-between p-2.5 rounded-xl border transition-all ${
                                        isSelected
                                          ? "bg-[#DBB24E]/10 text-[#DCAF43] border-[#DBB24E]/30"
                                          : "bg-white text-stone-900 border-stone-200 hover:border-[#DCAF43] hover:bg-stone-50"
                                      }`}
                                    >
                                      {/* Version Info & Play/Share actions */}
                                      <div className="flex items-center justify-between w-full md:w-auto flex-none">
                                        <div
                                          onClick={() =>
                                            selectTrack(track, version)
                                          }
                                          className="flex items-center gap-3 flex-1 cursor-pointer min-w-0 pr-4"
                                        >
                                          <div
                                            className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${
                                              isSelected
                                                ? "bg-white text-[#DCAF43] shadow-sm"
                                                : "bg-white text-stone-600 border border-stone-200"
                                            }`}
                                          >
                                            <IconComponent className="w-4 h-4" />
                                          </div>
                                          <span className="font-semibold text-sm truncate">
                                            {version.kategori}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 shrink-0">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const shareUrl = `${window.location.origin}/musik/${slugify(track.judul)}/${slugify(version.kategori)}`;
                                              navigator.clipboard.writeText(
                                                shareUrl,
                                              );
                                              alert(
                                                "Link disalin ke clipboard!",
                                              );
                                            }}
                                            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/5 text-stone-500"
                                            title="Bagikan"
                                          >
                                            <Share2 className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            onClick={() =>
                                              isSelected
                                                ? togglePlay()
                                                : selectTrack(track, version)
                                            }
                                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                              isSelected
                                                ? "bg-[#DCAF43] hover:bg-[#c9a041] text-white"
                                                : "bg-white hover:bg-stone-100 border border-stone-200 text-[#DBB24E]"
                                            }`}
                                          >
                                            {isSelected && isPlaying ? (
                                              <Pause className="w-3.5 h-3.5 fill-current" />
                                            ) : (
                                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                            )}
                                          </button>
                                        </div>
                                      </div>

                                      {/* Player Controls (shown when playing) */}
                                      {isSelected && (
                                        <div
                                          className="w-full md:w-auto flex-1 mt-3 md:mt-0 md:ml-6 flex flex-col md:flex-row items-center gap-3 md:gap-6 border-t md:border-t-0 md:border-l border-stone-200/50 pt-3 md:pt-0 md:pl-6"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {/* Playback Controls & Progress */}
                                          <div className="flex-1 w-full flex items-center gap-2 md:gap-4">
                                            <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
                                              <button
                                                onClick={prevTrack}
                                                className="text-stone-400 hover:text-stone-700 transition-colors p-1"
                                              >
                                                <SkipBack className="w-4 h-4 fill-current" />
                                              </button>
                                              <button
                                                onClick={nextTrack}
                                                className="text-stone-400 hover:text-stone-700 transition-colors p-1"
                                              >
                                                <SkipForward className="w-4 h-4 fill-current" />
                                              </button>
                                            </div>

                                            <div className="flex items-center w-full gap-2 text-[10px] md:text-xs font-medium text-stone-500">
                                              <span className="w-7 md:w-8 text-right">
                                                {formatTime(currentTime)}
                                              </span>
                                              <input
                                                type="range"
                                                min="0"
                                                max={duration || 100}
                                                value={currentTime}
                                                onChange={handleSeek}
                                                className="flex-1 h-1.5 md:h-1.5 bg-black/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 md:[&::-webkit-slider-thumb]:w-3 md:[&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#DBB24E] [&::-webkit-slider-thumb]:rounded-full cursor-pointer hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                                              />
                                              <span className="w-7 md:w-8 text-left">
                                                {formatTime(duration)}
                                              </span>
                                            </div>
                                          </div>

                                          {/* Volume */}
                                          <div className="hidden md:flex items-center gap-2 group shrink-0 w-24">
                                            <button
                                              onClick={() =>
                                                setVolume(
                                                  volume === 0 ? 0.5 : 0,
                                                )
                                              }
                                              className="text-stone-400 hover:text-stone-600 transition-colors"
                                            >
                                              {volume === 0 ? (
                                                <VolumeX className="w-4 h-4" />
                                              ) : (
                                                <Volume2 className="w-4 h-4" />
                                              )}
                                            </button>
                                            <input
                                              type="range"
                                              min="0"
                                              max="1"
                                              step="0.01"
                                              value={volume}
                                              onChange={(e) =>
                                                setVolume(
                                                  parseFloat(e.target.value),
                                                )
                                              }
                                              className="w-16 h-1.5 bg-black/10 rounded-full appearance-none opacity-0 group-hover:opacity-100 transition-opacity [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-[#DBB24E] [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              {filteredMusic.length === 0 && (
                <div className="text-center py-16 text-stone-500">
                  <Music className="w-12 h-12 mx-auto mb-4 text-stone-300" />
                  <p className="text-lg font-medium">
                    Tidak ada musik yang ditemukan.
                  </p>
                  <p className="text-sm text-stone-400">
                    Coba kata kunci lain atau ubah filter.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
