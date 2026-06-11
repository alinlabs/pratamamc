import React, { useState, useRef, useEffect } from "react";
import {
  Clock,
  List,
  LayoutGrid,
  GitCommit,
  Play,
  Pause,
  Music,
  Timer,
  X,
  Download,
  Pencil,
  Rewind,
  FastForward,
  Share2,
  CheckCircle2,
  Circle,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { jsPDF } from "jspdf";
import { getMusikData, saveKlienAcara } from "../../../lib/api";

interface SusunanAcaraViewProps {
  rundown: any[];
  clientName?: string;
  onEdit?: () => void;
  clientId?: string;
}

export default function SusunanAcaraView({
  rundown: initialRundown,
  clientName = "Klien",
  onEdit,
  clientId,
}: SusunanAcaraViewProps) {
  const [rundown, setRundown] = useState<any[]>(initialRundown);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setRundown(initialRundown);
  }, [initialRundown]);
  const [viewMode, setViewMode] = useState<"timeline" | "list" | "card">(
    "timeline",
  );
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [allMusik, setAllMusik] = useState<any[]>([]);

  useEffect(() => {
    getMusikData().then(setAllMusik).catch(console.error);
  }, []);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedItem]);

  const toggleMusic = (id: string, url: string) => {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      window.dispatchEvent(new Event("pauseGlobalMusic"));
      const newAudio = new Audio(url);
      newAudio.loop = true;

      newAudio.addEventListener("timeupdate", () => {
        setAudioProgress(newAudio.currentTime);
      });
      newAudio.addEventListener("loadedmetadata", () => {
        setAudioDuration(newAudio.duration);
      });

      newAudio.play().catch((e) => console.error("Error playing audio:", e));
      audioRef.current = newAudio;
      setPlayingId(id);
    }
  };

  const skipMusic = (e: React.MouseEvent, seconds: number) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        Math.max(audioRef.current.currentTime + seconds, 0),
        audioRef.current.duration || 0,
      );
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newTime = parseFloat(e.target.value);
    setAudioProgress(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDurationText = (mins: number) => {
    if (mins >= 60) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return m > 0 ? `${h} Jam ${m} Menit` : `${h} Jam`;
    }
    return `${mins} Menit`;
  };

  const getDurationInfo = (currentIndex: number) => {
    let durationMins = 0;
    const currentItem = rundown[currentIndex];

    if (currentItem.durasi) {
      durationMins = parseInt(currentItem.durasi);
    } else {
      const nextItem = rundown[currentIndex + 1];
      if (!nextItem || !currentItem.waktu || !nextItem.waktu) return null;
      const [currH, currM] = currentItem.waktu.split(":").map(Number);
      const [nextH, nextM] = nextItem.waktu.split(":").map(Number);
      durationMins = nextH * 60 + nextM - (currH * 60 + currM);
    }

    if (!durationMins || durationMins <= 0 || isNaN(durationMins)) return null;

    let formattedString = `${durationMins}m`;
    if (durationMins >= 60) {
      const h = Math.floor(durationMins / 60);
      const m = durationMins % 60;
      formattedString = m > 0 ? `${h}j ${m}m` : `${h}j`;
    }

    return {
      duration: durationMins,
      formattedShort: formattedString,
      formattedLong: formatDurationText(durationMins),
    };
  };

  const handleToggleSelesai = async (item: any) => {
    if (!clientId) return;
    setIsSaving(true);
    try {
      const isSelesai = item.status === "Selesai";
      const newStatus = isSelesai ? "" : "Selesai";

      const newRundown = rundown.map((r) =>
        r.id === item.id ||
        (r.kegiatan === item.kegiatan && r.waktu === item.waktu)
          ? { ...r, status: newStatus }
          : r,
      );

      setRundown(newRundown);
      if (
        selectedItem &&
        (selectedItem.id === item.id ||
          (selectedItem.kegiatan === item.kegiatan &&
            selectedItem.waktu === item.waktu))
      ) {
        setSelectedItem({ ...selectedItem, status: newStatus });
      }

      await saveKlienAcara(clientId, newRundown);
    } catch (e) {
      console.error(e);
      setRundown(initialRundown); // revert
    } finally {
      setIsSaving(false);
    }
  };

  const calculateEndTime = (startTime: string, durasiMenit: number) => {
    if (!startTime || !startTime.includes(":")) return "";
    const [hours, minutes] = startTime.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return "";
    const totalMinutes = hours * 60 + minutes + (durasiMenit || 0);
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
  };

  const recalculateTimesForSegment = (arr: any[], segment: string) => {
    const newArr = [...arr];
    const segmentIndices = newArr
      .map((item, idx) => (item.segmen === segment ? idx : -1))
      .filter((i) => i !== -1);

    for (let i = 0; i < segmentIndices.length - 1; i++) {
      const currentItem = newArr[segmentIndices[i]];
      const nextItemIdx = segmentIndices[i + 1];
      if (currentItem.waktu && currentItem.durasi) {
        const calculatedTime = calculateEndTime(
          currentItem.waktu,
          parseInt(currentItem.durasi) || 0,
        );
        newArr[nextItemIdx] = { ...newArr[nextItemIdx], waktu: calculatedTime };
      } else if (!currentItem.waktu) {
        newArr[nextItemIdx] = { ...newArr[nextItemIdx], waktu: "" };
      }
    }
    return newArr;
  };

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!clientId || draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    const draggedItem = rundown[draggedIndex];
    const targetItem = rundown[targetIndex];

    if (
      draggedItem.segmen &&
      targetItem.segmen &&
      draggedItem.segmen !== targetItem.segmen
    ) {
      setDraggedIndex(null);
      return;
    }

    setIsSaving(true);
    try {
      const newRundown = [...rundown];
      newRundown.splice(draggedIndex, 1);
      newRundown.splice(targetIndex, 0, draggedItem);

      const updatedRundown = recalculateTimesForSegment(
        newRundown,
        draggedItem.segmen,
      );
      setRundown(updatedRundown);

      await saveKlienAcara(clientId, updatedRundown);
    } catch (err) {
      console.error(err);
      setRundown(initialRundown); // revert
    } finally {
      setIsSaving(false);
      setDraggedIndex(null);
    }
  };

  const handleDeleteAcara = async (item: any) => {
    if (!clientId) return;
    if (!window.confirm(`Hapus acara "${item.kegiatan || item.judul}"?`))
      return;

    setIsSaving(true);
    try {
      const newRundown = rundown.filter(
        (r) =>
          !(
            r.id === item.id ||
            (r.kegiatan === item.kegiatan && r.waktu === item.waktu)
          ),
      );

      setRundown(newRundown);
      setSelectedItem(null); // close popup/bottom sheet

      await saveKlienAcara(clientId, newRundown);
    } catch (e) {
      console.error(e);
      setRundown(initialRundown); // revert
    } finally {
      setIsSaving(false);
    }
  };

  const toggleViewMode = () => {
    if (viewMode === "timeline") setViewMode("list");
    else if (viewMode === "list") setViewMode("card");
    else setViewMode("timeline");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Theme Colors
    const primaryColor = [28, 25, 23]; // stone-900
    const secondaryColor = [120, 113, 108]; // stone-500
    const accentColor = [245, 245, 244]; // stone-50

    // Header Background
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, "F");

    // Logo Text "PRATAMA MC"
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("PRATAMA MC", 105, 18, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Professional Master of Ceremony", 105, 28, { align: "center" });

    // Document Title
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Rundown Acara", 105, 55, { align: "center" });

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    if (clientName) {
      doc.text(clientName, 105, 63, { align: "center" });
    }

    let yPos = 80;
    const pageHeight = doc.internal.pageSize.getHeight();

    const addFooter = () => {
      doc.setFontSize(9);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setFont("helvetica", "italic");
      doc.text("Generated by Pratama MC Portal", 105, pageHeight - 10, {
        align: "center",
      });
    };

    addFooter();

    let currentSegment: string | null = null;
    rundown.forEach((item, index) => {
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = 30;
        addFooter();
      }

      if (item.segmen && item.segmen !== currentSegment) {
        currentSegment = item.segmen;
        doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.rect(15, yPos - 6, 180, 12, "F");
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(
          `${item.waktu} - ${currentSegment.toUpperCase()}`,
          20,
          yPos + 2,
        );
        yPos += 16;
      }

      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(item.waktu, 20, yPos);

      doc.setFont("helvetica", "bold");
      doc.text(item.kegiatan || item.judul || "", 45, yPos);
      yPos += 6;

      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const splitDescription = doc.splitTextToSize(item.deskripsi || "", 140);
      doc.text(splitDescription, 45, yPos);
      yPos += splitDescription.length * 5 + 8;
    });

    doc.save(`Susunan_Acara_${clientName.replace(/\s+/g, "_")}.pdf`);
  };

  const renderTime = (
    item: any,
    index: number,
    layout: "horizontal" | "vertical" = "horizontal",
  ) => {
    const durationInfo = getDurationInfo(index);

    if (layout === "vertical") {
      return (
        <div className="flex flex-col items-center shrink-0 w-16 pt-1">
          <div className="font-bold text-stone-900">{item.waktu}</div>
          {durationInfo && (
            <div className="flex flex-col items-center mt-1 text-stone-400">
              <div className="text-[10px] font-medium flex items-center gap-0.5 bg-stone-50 px-1 py-0.5 rounded text-stone-500 whitespace-nowrap">
                {durationInfo.formattedShort}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 flex-wrap">
        <div className="font-bold text-stone-900">{item.waktu}</div>
        {durationInfo && (
          <div className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full flex items-center gap-1">
            {durationInfo.formattedLong}
          </div>
        )}
      </div>
    );
  };

  const renderExtras = (item: any) => {
    return (
      <div
        className="mt-2 space-y-1.5 w-full max-w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {item.pengisi && (
          <p className="text-xs text-stone-500 font-semibold">
            Pengisi Acara:{" "}
            <span className="text-stone-700">{item.pengisi}</span>
          </p>
        )}
        {item.catatan && (
          <div
            className="mt-1 pl-2 border-l-2 border-[#DCAF43] text-xs text-stone-500 bg-stone-50/50 py-1 px-2.5 rounded-r-md truncate max-w-full"
            title={item.catatan}
          >
            {item.catatan}
          </div>
        )}
      </div>
    );
  };

  const renderDetailModal = () => {
    const durationInfo = selectedItem
      ? getDurationInfo(rundown.findIndex((i) => i.id === selectedItem.id))
      : null;

    return (
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedItem(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
                mass: 0.8,
              }}
              className="relative bg-white w-full sm:w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden mt-auto sm:mt-0 max-h-[80vh] sm:max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0">
                <h3 className="font-bold text-lg text-stone-900">
                  {selectedItem.segmen || "Detail Acara"}
                </h3>
                <div className="flex items-center gap-2">
                  {clientId && (
                    <button
                      onClick={() => handleDeleteAcara(selectedItem)}
                      disabled={isSaving}
                      className={`p-2 bg-red-50 hover:bg-red-100 rounded-full text-red-500 transition-colors ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
                      title="Hapus Acara"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <h4 className="text-2xl font-bold text-stone-900 mb-1">
                  {selectedItem.kegiatan || selectedItem.judul}
                </h4>
                <div className="text-xs sm:text-sm font-bold text-stone-500 mb-5">
                  Pukul {selectedItem.waktu || "00:00"} (
                  {formatDurationText(
                    Number(selectedItem.durasi) || durationInfo?.duration || 0,
                  )}
                  )
                </div>
                <p className="text-stone-600 mb-6 leading-relaxed text-sm md:text-base">
                  {selectedItem.deskripsi}
                </p>

                {selectedItem.pengisi && (
                  <div className="mt-5 border-t border-stone-100 pt-4">
                    <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1 font-sans">
                      Pengisi Acara
                    </div>
                    <div className="font-semibold text-stone-800 text-sm md:text-base">
                      {selectedItem.pengisi}
                    </div>
                  </div>
                )}

                {selectedItem.catatan && (
                  <div className="mt-5 border-t border-stone-100 pt-4">
                    <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 font-sans">
                      Catatan
                    </div>
                    <ul className="space-y-2">
                      {selectedItem.catatan
                        .split(",")
                        .map((n: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-stone-700 text-sm md:text-base"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DCAF43] mt-2 shrink-0" />
                            <span className="leading-relaxed">{n.trim()}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {(() => {
                  const musicArray = Array.isArray(selectedItem.musik)
                    ? selectedItem.musik.filter(Boolean)
                    : selectedItem.musik
                      ? [selectedItem.musik]
                      : [];

                  if (musicArray.length === 0) return null;

                  return (
                    <div className="mt-5 border-t border-stone-100 pt-4">
                      <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2.5 font-sans">
                        Musik Pengiring ({musicArray.length})
                      </div>
                      <div className="space-y-4">
                        {musicArray.map((musicItem, musicIdx) => {
                          const trackId = `${selectedItem.id || selectedItem.kegiatan || selectedItem.judul}-${musicIdx}`;

                          const matchedSong = allMusik.find((m) => {
                            const songLink =
                              m.versi?.[0]?.tautan || m.tautan || m.link;
                            return (
                              String(m.id) === String(musicItem) ||
                              String(m.id).startsWith(String(musicItem)) ||
                              String(songLink) === String(musicItem)
                            );
                          });
                          const isOurAsset = !!matchedSong;
                          const linkMusik = isOurAsset
                            ? matchedSong.versi?.[0]?.tautan ||
                              matchedSong.tautan ||
                              matchedSong.link
                            : musicItem;
                          const songName = matchedSong
                            ? `${matchedSong.artis} - ${matchedSong.judul}`
                            : musicItem;

                          return (
                            <div
                              key={musicIdx}
                              className="flex flex-col max-w-full pb-3 last:pb-0 border-b border-stone-50 last:border-0"
                            >
                              {typeof musicItem === "string" &&
                              getYoutubeEmbedUrl(musicItem) ? (
                                <div className="space-y-2">
                                  <div className="relative w-full rounded-xl overflow-hidden shadow-sm border border-stone-200 aspect-video max-w-md">
                                    <iframe
                                      src={getYoutubeEmbedUrl(musicItem)!}
                                      title={`YouTube Video - ${musicIdx}`}
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                      className="absolute top-0 left-0 w-full h-full"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center gap-2 max-w-full">
                                    <button
                                      onClick={() =>
                                        toggleMusic(trackId, linkMusik)
                                      }
                                      className="inline-flex items-center gap-2 px-4 py-2 bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-800 rounded-full text-sm font-semibold transition-colors shadow-xs shrink min-w-0 max-w-full"
                                    >
                                      {playingId === trackId ? (
                                        <Pause className="w-4 h-4 shrink-0 text-[#DCAF43]" />
                                      ) : (
                                        <Play className="w-4 h-4 shrink-0 text-stone-400" />
                                      )}
                                      <span className="truncate">
                                        {songName}
                                      </span>
                                    </button>
                                    {playingId === trackId && (
                                      <div className="text-xs font-bold text-stone-500 shrink-0 whitespace-nowrap px-2">
                                        {formatTime(audioProgress)} / -
                                        {formatTime(
                                          audioDuration - audioProgress,
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  {playingId === trackId && (
                                    <div className="flex items-center gap-3 mt-3 max-w-sm">
                                      <button
                                        onClick={(e) => skipMusic(e, -10)}
                                        className="text-stone-400 hover:text-stone-700 transition-colors shrink-0"
                                      >
                                        <Rewind className="w-4 h-4" />
                                      </button>
                                      <div className="relative flex-1 h-2 bg-stone-200 rounded-full flex items-center">
                                        <div
                                          className="absolute left-0 h-full bg-stone-800 rounded-full pointer-events-none"
                                          style={{
                                            width: `${(audioProgress / (audioDuration || 1)) * 100}%`,
                                          }}
                                        ></div>
                                        <input
                                          type="range"
                                          min="0"
                                          max={audioDuration || 100}
                                          value={audioProgress}
                                          onChange={handleProgressChange}
                                          className="w-full opacity-0 cursor-pointer h-full absolute inset-0 m-0 z-10"
                                        />
                                      </div>
                                      <button
                                        onClick={(e) => skipMusic(e, 10)}
                                        className="text-stone-400 hover:text-stone-700 transition-colors shrink-0"
                                      >
                                        <FastForward className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Selesai Button */}
              {clientId && (
                <div className="p-4 border-t border-stone-100 bg-white shrink-0">
                  <button
                    onClick={() => handleToggleSelesai(selectedItem)}
                    disabled={isSaving}
                    className={`w-full py-3 px-4 rounded-xl font-bold flex flex-row items-center justify-center gap-2 transition-colors ${selectedItem.status === "Selesai" ? "bg-stone-100 text-stone-700 hover:bg-stone-200" : "bg-[#DCAF43] text-white hover:bg-[#b88c2f]"} ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {selectedItem.status === "Selesai" ? (
                      <>Tandai Belum Selesai</>
                    ) : (
                      <>Tandai Selesai</>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="py-4">
      <div className="flex flex-row items-center justify-between gap-4 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-stone-800">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
          <span className="hidden sm:inline">Susunan Acara</span>
          <span className="sm:hidden">Acara</span>
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleViewMode}
            className="hidden sm:flex items-center justify-center p-2 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-lg transition-colors border-0"
            title={
              viewMode === "timeline"
                ? "Ubah ke Mode Daftar"
                : viewMode === "list"
                  ? "Ubah ke Mode Grid"
                  : "Ubah ke Mode Lini Masa"
            }
          >
            {viewMode === "timeline" && (
              <GitCommit className="w-5 h-5" strokeWidth={1.5} />
            )}
            {viewMode === "list" && (
              <List className="w-5 h-5" strokeWidth={1.5} />
            )}
            {viewMode === "card" && (
              <LayoutGrid className="w-5 h-5" strokeWidth={1.5} />
            )}
          </button>
          <button
            onClick={downloadPDF}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center justify-center p-2 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-lg transition-colors border-0"
              title="Edit Susunan Acara"
            >
              <Pencil className="w-5 h-5" strokeWidth={1.5} />
            </button>
          )}
          <button
            onClick={async () => {
              try {
                if (navigator.share) {
                  await navigator.share({
                    title: document.title,
                    url: window.location.href,
                  });
                } else {
                  await navigator.clipboard.writeText(window.location.href);
                  alert("Tautan disalin!");
                }
              } catch (e) {
                console.error("Gagal membagikan", e);
              }
            }}
            className="flex items-center justify-center p-2 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-lg transition-colors border-0"
            title="Bagikan Tautan"
          >
            <Share2 className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {!rundown || rundown.length === 0 ? (
        <p className="text-stone-500 italic">
          Belum ada item susunan acara yang ditambahkan.
        </p>
      ) : (
        <>
          {viewMode === "timeline" && (
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-stone-200">
              {(() => {
                let currentSegment: string | null = null;
                let eventIndex = 0;
                const elements: React.ReactNode[] = [];

                rundown.forEach((item, index) => {
                  if (item.segmen && item.segmen !== currentSegment) {
                    currentSegment = item.segmen;
                    let totalDuration = 0;
                    for (let i = index; i < rundown.length; i++) {
                      if (rundown[i].segmen !== currentSegment) break;
                      const dInfo = getDurationInfo(i);
                      if (dInfo) totalDuration += dInfo.duration;
                    }

                    elements.push(
                      <div
                        key={`segment-${index}`}
                        className="relative flex items-center justify-start pl-16 md:pl-0 md:justify-center py-1 z-10 w-full md:py-2"
                      >
                        <div className="bg-[#DCAF43] text-white px-5 sm:px-6 py-2 rounded-full shadow-md text-center flex items-center gap-3">
                          <span className="font-medium uppercase tracking-wider text-sm">
                            {currentSegment}
                          </span>
                          {totalDuration > 0 && (
                            <>
                              <span className="w-1 h-1 bg-white/60 rounded-full"></span>
                              <span className="text-sm font-medium text-white">
                                {formatDurationText(totalDuration)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>,
                    );
                  }

                  const isEven = eventIndex % 2 === 0;
                  eventIndex++;

                  elements.push(
                    <div
                      key={`${item.id || "acara"}-${index}`}
                      draggable={!!clientId}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`relative flex items-center justify-between md:justify-normal group is-active cursor-pointer ${isEven ? "md:flex-row-reverse" : "md:flex-row"} ${draggedIndex === index ? "opacity-50" : ""}`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border border-stone-200 bg-stone-100 text-stone-500 shadow-sm shrink-0 md:order-1 transition-colors group-hover:bg-[#D2A439] group-hover:text-white group-hover:border-[#D2A439] ${isEven ? "md:-translate-x-1/2" : "md:translate-x-1/2"} ${item.status === "Selesai" ? "bg-green-100 text-green-600 border-green-200" : ""}`}
                      >
                        {item.status === "Selesai" ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <div
                        className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl shadow-sm border border-stone-100 transition-all hover:shadow-md hover:border-[#D2A439] ${item.status === "Selesai" ? "opacity-70" : ""}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          {renderTime(item, index, "horizontal")}
                        </div>
                        <div className="font-medium text-lg mb-1 group-hover:text-stone-900">
                          {item.kegiatan || item.judul}
                        </div>
                        <div className="text-stone-500 text-sm line-clamp-1">
                          {item.deskripsi}
                        </div>
                        {renderExtras(item)}
                      </div>
                    </div>,
                  );
                });
                return elements;
              })()}
            </div>
          )}

          {viewMode === "list" && (
            <div className="flex flex-col gap-4">
              {(() => {
                let currentSegment: string | null = null;
                const elements: React.ReactNode[] = [];
                rundown.forEach((item, index) => {
                  if (item.segmen && item.segmen !== currentSegment) {
                    currentSegment = item.segmen;
                    let totalDuration = 0;
                    for (let i = index; i < rundown.length; i++) {
                      if (rundown[i].segmen !== currentSegment) break;
                      const dInfo = getDurationInfo(i);
                      if (dInfo) totalDuration += dInfo.duration;
                    }

                    elements.push(
                      <div
                        key={`segment-${index}`}
                        className="flex items-center gap-4 py-2 mt-4"
                      >
                        {totalDuration > 0 ? (
                          <div className="font-bold text-stone-600 w-24 shrink-0 text-sm whitespace-nowrap text-center">
                            {formatDurationText(totalDuration)}
                          </div>
                        ) : (
                          <div className="w-24 shrink-0"></div>
                        )}
                        <div className="h-px bg-stone-300 flex-grow"></div>
                        <div className="font-bold text-stone-800 uppercase tracking-wider text-sm">
                          {currentSegment}
                        </div>
                        <div className="h-px bg-stone-300 flex-grow"></div>
                      </div>,
                    );
                  }

                  elements.push(
                    <div
                      key={`${item.id || "acara"}-${index}`}
                      draggable={!!clientId}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`flex gap-4 p-4 bg-white rounded-xl border border-stone-100 shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-[#D2A439] group ${item.status === "Selesai" ? "opacity-70 border-green-100 bg-green-50/20" : ""} ${draggedIndex === index ? "opacity-50" : ""}`}
                      onClick={() => setSelectedItem(item)}
                    >
                      {renderTime(item, index, "vertical")}
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          {item.status === "Selesai" && (
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                          )}
                          <div className="font-medium text-lg group-hover:text-stone-900">
                            {item.kegiatan || item.judul}
                          </div>
                        </div>
                        <div className="text-stone-500 text-sm line-clamp-1">
                          {item.deskripsi}
                        </div>
                        {renderExtras(item)}
                      </div>
                    </div>,
                  );
                });
                return elements;
              })()}
            </div>
          )}

          {viewMode === "card" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(() => {
                let currentSegment: string | null = null;
                const elements: React.ReactNode[] = [];
                rundown.forEach((item, index) => {
                  if (item.segmen && item.segmen !== currentSegment) {
                    currentSegment = item.segmen;
                    let totalDuration = 0;
                    for (let i = index; i < rundown.length; i++) {
                      if (rundown[i].segmen !== currentSegment) break;
                      const dInfo = getDurationInfo(i);
                      if (dInfo) totalDuration += dInfo.duration;
                    }

                    elements.push(
                      <div
                        key={`segment-${index}`}
                        className="col-span-1 sm:col-span-2 lg:col-span-3 flex items-center gap-4 py-2 mt-2"
                      >
                        {totalDuration > 0 ? (
                          <div className="font-bold text-stone-600 w-24 shrink-0 text-sm whitespace-nowrap text-center">
                            {formatDurationText(totalDuration)}
                          </div>
                        ) : (
                          <div className="w-24 shrink-0"></div>
                        )}
                        <div className="h-px bg-stone-300 flex-grow"></div>
                        <div className="font-bold text-stone-800 uppercase tracking-wider text-sm">
                          {currentSegment}
                        </div>
                        <div className="h-px bg-stone-300 flex-grow"></div>
                      </div>,
                    );
                  }

                  elements.push(
                    <div
                      key={`${item.id || "acara"}-${index}`}
                      draggable={!!clientId}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`p-4 bg-white rounded-xl border border-stone-100 shadow-sm flex flex-col cursor-pointer transition-all hover:shadow-md hover:border-[#D2A439] group ${item.status === "Selesai" ? "opacity-70 border-green-100 bg-green-50/20" : ""} ${draggedIndex === index ? "opacity-50" : ""}`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="flex items-start gap-2 mb-3">
                        {item.status === "Selesai" ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-1" />
                        ) : (
                          <Clock className="w-4 h-4 text-stone-400 shrink-0 mt-1 transition-colors group-hover:text-[#D2A439]" />
                        )}
                        {renderTime(item, index, "horizontal")}
                      </div>
                      <div className="font-medium text-lg mb-1 group-hover:text-stone-900">
                        {item.kegiatan || item.judul}
                      </div>
                      <div className="text-stone-500 text-sm flex-grow line-clamp-1">
                        {item.deskripsi}
                      </div>
                      {renderExtras(item)}
                    </div>,
                  );
                });
                return elements;
              })()}
            </div>
          )}
        </>
      )}
      {renderDetailModal()}
    </div>
  );
}
