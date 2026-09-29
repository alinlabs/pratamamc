import React, { useState, useEffect } from "react";
import FormLayout from "../components/layout-form";
import {
  Plus,
  Trash2,
  Clock,
  Music,
  AlertCircle,
  Sparkles,
  RefreshCw,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const SEGMENTS = [
  "Persiapan",
  "Pembukaan",
  "Akad",
  "Adat",
  "Istirahat",
  "Resepsi",
];

const DURASI_OPTIONS = [5, 10, 20, 30, 45, 60, 90, 120];

function MusikCombobox({
  value,
  allMusik,
  onChange,
}: {
  value: string;
  allMusik: any[];
  onChange: (val: string) => void;
}) {
  const isInternalMusic = String(value).startsWith('msc-');
  const baseValueId = isInternalMusic ? String(value).split('-').slice(0, 2).join('-') : String(value);
  const matchedSong = allMusik.find((m) => {
      const mBaseId = String(m.id).startsWith('msc-') ? String(m.id).split('-').slice(0, 2).join('-') : String(m.id);
      return String(m.id) === String(value) || (isInternalMusic && mBaseId === baseValueId) || String(m.id).startsWith(String(value));
  });
  const [inputValue, setInputValue] = React.useState(
    matchedSong ? `${matchedSong.artis} - ${matchedSong.judul}` : value || "",
  );
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const isInternalMusic = String(value).startsWith('msc-');
    const baseValId = isInternalMusic ? String(value).split('-').slice(0, 2).join('-') : String(value);
    const matched = allMusik.find((m) => {
        const mBase = String(m.id).startsWith('msc-') ? String(m.id).split('-').slice(0, 2).join('-') : String(m.id);
        return String(m.id) === String(value) || (isInternalMusic && mBase === baseValId) || String(m.id).startsWith(String(value));
    });
    if (!isOpen) {
      setInputValue(
        matched ? `${matched.artis} - ${matched.judul}` : value || "",
      );
    }
  }, [value, allMusik, isOpen]);

  const filteredMusik = allMusik
    .filter((m) => {
      if (!inputValue) return true;
      const matchStr = inputValue.toLowerCase().trim();
      return (
        (m.judul || "").toLowerCase().includes(matchStr) ||
        (m.artis || "").toLowerCase().includes(matchStr)
      );
    })
    .slice(0, 8);

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange(e.target.value);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder="Ketik judul, artis, atau paste link YouTube..."
        className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
      />
      {isOpen && filteredMusik.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-stone-200 rounded-xl shadow-lg z-50 max-h-56 overflow-y-auto divide-y divide-stone-100 scrollbar-thin">
          {filteredMusik.map((option, idx) => (
            <div
              key={option.id || idx}
              onMouseDown={(e) => {
                e.preventDefault();
                setInputValue(`${option.artis} - ${option.judul}`);
                onChange(String(option.id));
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left hover:bg-stone-50 cursor-pointer transition-colors"
            >
              <div className="font-semibold text-stone-800 text-sm">
                {option.judul}
              </div>
              <div className="text-[11px] text-stone-400 font-medium">
                {option.artis}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AcaraForm({
  eventData,
  onClose,
}: {
  eventData: any;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    susunan_acara: Array.isArray(eventData.susunan_acara)
      ? eventData.susunan_acara.map((item: any) => ({
          ...item,
          id: item.id || (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7))
        }))
      : [],
  });

  useEffect(() => {
    if (
      Array.isArray(eventData.susunan_acara) &&
      eventData.susunan_acara.length > 0
    ) {
      setFormData((prev: any) => ({
        ...prev,
        susunan_acara: eventData.susunan_acara.map((item: any) => ({
          ...item,
          id: item.id || (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7))
        })),
      }));
    }
  }, [eventData.susunan_acara]);

  const [activeSegment, setActiveSegment] = useState("Persiapan");
  const [allMusik, setAllMusik] = useState<any[]>([]);
  const [activeDurasiDropdownIndex, setActiveDurasiDropdownIndex] = useState<
    number | null
  >(null);
  const [draggedDisplayIndex, setDraggedDisplayIndex] = useState<number | null>(
    null,
  );
  const [expandedFields, setExpandedFields] = useState<
    Record<number, { deskripsi?: boolean; catatan?: boolean; musik?: boolean }>
  >({});
  const [collapsedCards, setCollapsedCards] = useState<Record<number, boolean>>(
    {},
  );

  const toggleField = (
    index: number,
    field: "deskripsi" | "catatan" | "musik",
  ) => {
    setExpandedFields((prev) => ({
      ...prev,
      [index]: {
        ...(prev[index] || {}),
        [field]: true,
      },
    }));
  };

  const removeField = (
    index: number,
    field: "deskripsi" | "catatan" | "musik",
  ) => {
    setExpandedFields((prev) => ({
      ...prev,
      [index]: {
        ...(prev[index] || {}),
        [field]: false,
      },
    }));

    if (field === "deskripsi") {
      handleSusunanFieldChange(index, "deskripsi", "");
    } else if (field === "catatan") {
      handleSusunanFieldChange(index, "catatan", "");
    } else if (field === "musik") {
      setFormData((prev: any) => {
        const newArray = [...(prev.susunan_acara || [])];
        const item = newArray[index];
        newArray[index] = {
          ...item,
          nama_musik: "",
          jenis_musik: "",
          tautan_musik: "",
          musik: [],
        };
        return { ...prev, susunan_acara: newArray };
      });
    }
  };

  useEffect(() => {
    import("../../../lib/api")
      .then(({ getMusikData }) => {
        getMusikData().then(setAllMusik).catch(console.error);
      })
      .catch(console.error);
  }, []);

  const handleSusunanFieldChange = (
    originalIndex: number,
    field: string,
    value: any,
  ) => {
    setFormData((prev: any) => {
      const newArray = [...(prev.susunan_acara || [])];
      newArray[originalIndex] = { ...newArray[originalIndex], [field]: value };
      return { ...prev, susunan_acara: newArray };
    });
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

  const isMatch = (item: any) =>
    (item.segmen || "").toLowerCase().trim() ===
    activeSegment.toLowerCase().trim();

  const recalculateTimesForSegment = (arr: any[]) => {
    const list = arr
      .map((item, idx) => ({ item, idx }))
      .filter((x) => isMatch(x.item));
    if (list.length === 0) return arr;

    for (let i = 0; i < list.length - 1; i++) {
      const currentItem = arr[list[i].idx];
      const nextItemIdx = list[i + 1].idx;
      if (currentItem.waktu && currentItem.durasi) {
        const calculatedTime = calculateEndTime(
          currentItem.waktu,
          parseInt(currentItem.durasi) || 0,
        );
        arr[nextItemIdx] = { ...arr[nextItemIdx], waktu: calculatedTime };
      } else if (!currentItem.waktu) {
        arr[nextItemIdx] = { ...arr[nextItemIdx], waktu: "" };
      }
    }
    return arr;
  };

  const handleDurasiChange = (originalIndex: number, newDurasi: string) => {
    setFormData((prev) => {
      const newArr = [...(prev.susunan_acara || [])];
      newArr[originalIndex] = { ...newArr[originalIndex], durasi: newDurasi };
      return { ...prev, susunan_acara: recalculateTimesForSegment(newArr) };
    });
  };

  const handleRemoveSusunanItem = (originalIndex: number) => {
    setFormData((prev: any) => {
      const newArr = (prev.susunan_acara || []).filter(
        (_: any, i: number) => i !== originalIndex,
      );
      return { ...prev, susunan_acara: recalculateTimesForSegment(newArr) };
    });
  };

  const handleAddSusunanItem = () => {
    const newItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
      waktu: "",
      durasi: "",
      segmen: activeSegment,
      kegiatan: "",
      judul: "",
      deskripsi: "",
      catatan: "",
      jenis_musik: "",
      nama_musik: "",
      tautan_musik: "",
      isCustom: true,
    };
    setFormData((prev: any) => {
      const newArr = [...(prev.susunan_acara || []), newItem];
      return { ...prev, susunan_acara: recalculateTimesForSegment(newArr) };
    });
  };

  const handleDragStart = (e: React.DragEvent, displayIndex: number) => {
    setDraggedDisplayIndex(displayIndex);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetDisplayIndex: number) => {
    e.preventDefault();
    if (
      draggedDisplayIndex === null ||
      draggedDisplayIndex === targetDisplayIndex
    ) {
      setDraggedDisplayIndex(null);
      return;
    }

    setFormData((prev) => {
      const newArr = [...(prev.susunan_acara || [])];
      const filtered = newArr
        .map((item, idx) => ({ item, idx }))
        .filter((x) => isMatch(x.item));

      const draggedItem = filtered[draggedDisplayIndex];
      filtered.splice(draggedDisplayIndex, 1);
      filtered.splice(targetDisplayIndex, 0, draggedItem);

      const segmentIndices = newArr
        .map((item, idx) => (isMatch(item) ? idx : -1))
        .filter((idx) => idx !== -1);

      filtered.forEach((f, i) => {
        newArr[segmentIndices[i]] = f.item;
      });

      return { ...prev, susunan_acara: recalculateTimesForSegment(newArr) };
    });
    setDraggedDisplayIndex(null);
  };

  const mobileExtraAction = (
    <button
      type="button"
      onClick={handleAddSusunanItem}
      className="w-11 h-11 rounded-xl bg-[#D2A439]/10 border border-[#D2A439]/25 flex items-center justify-center text-stone-500 hover:text-[#D2A439] active:scale-95 transition-all shrink-0 focus:outline-none focus:ring-0 cursor-pointer shadow-sm"
    >
      <Plus className="w-5 h-5 stroke-[2.5]" />
    </button>
  );

  const filteredAcara = formData.susunan_acara
    .map((item: any, idx: number) => ({ item, originalIndex: idx }))
    .filter((x: any) => isMatch(x.item));

  const cleanedFormData = {
    ...formData,
    susunan_acara: formData.susunan_acara.map((item: any) => {
      const { waktu, ...rest } = item;
      return rest;
    }),
  };

  return (
    <FormLayout
      title="Susunan Acara"
      onClose={onClose}
      eventData={eventData}
      formData={cleanedFormData}
      mobileExtraAction={mobileExtraAction}
    >
      <div className="space-y-4 mb-16 md:mb-0 mt-4 md:mt-2">
        {/* STRIP TAB SEGMENT (MODERN SCROLLABLE TAB BAR FOR RESPONSIVE/MOBILE FEEL) */}
        <div className="bg-stone-50/90 backdrop-blur-md z-10 -mx-4 px-4 py-2 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {SEGMENTS.map((seg) => {
            const isActive =
              activeSegment.toLowerCase().trim() === seg.toLowerCase().trim();
            const count = formData.susunan_acara.filter((item: any) => {
              const itemSeg = item.segmen || "";
              return itemSeg.toLowerCase().trim() === seg.toLowerCase().trim();
            }).length;

            return (
              <button
                key={seg}
                type="button"
                onClick={() => setActiveSegment(seg)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#D2A439] text-white font-bold shadow-sm shadow-[#D2A439]/15"
                    : "bg-white hover:bg-stone-50 text-stone-500 border border-stone-200/85 hover:text-stone-700"
                }`}
              >
                <span>{seg}</span>
                {count > 0 && (
                  <span
                    className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-white text-[#D2A439]"
                        : "bg-stone-100 text-stone-500 border border-stone-200"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* CONTAINER UNTUK DAFTAR SUSUNAN ACARA */}
        <div className="space-y-4">
          {filteredAcara.length === 0 ? (
            <div className="text-center py-10 px-4 bg-white border border-dashed border-stone-200 rounded-2xl">
              <h4 className="text-sm font-bold text-stone-700 mb-1">
                Belum Ada Kegiatan
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                Segmen <strong>{activeSegment}</strong> saat ini masih kosong.
                Klik tombol di bawah untuk menambah sekuens kegiatan baru.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredAcara.map(({ item, originalIndex }, displayIndex) => {
                const hasDeskripsi = !!item.deskripsi;
                const hasCatatan = !!item.catatan;
                const hasMusik = Array.isArray(item.musik)
                  ? item.musik.length > 0 && item.musik.some((m) => !!m)
                  : !!item.musik;

                const isDeskripsiOpen =
                  hasDeskripsi || expandedFields[originalIndex]?.deskripsi;
                const isCatatanOpen =
                  hasCatatan || expandedFields[originalIndex]?.catatan;
                const isMusikOpen =
                  hasMusik || expandedFields[originalIndex]?.musik;

                const isCollapsed = !!collapsedCards[originalIndex];

                const uniqueKey = item.id || `item-${originalIndex}`;

                return (
                  <div
                    key={uniqueKey}
                    draggable
                    onDragStart={(e) => handleDragStart(e, displayIndex)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, displayIndex)}
                    className={`bg-white border border-stone-200 rounded-2xl shadow-sm transition-all duration-200 group px-4 sm:px-6 ${
                      isCollapsed ? "py-4 sm:py-5" : "py-5 sm:py-6 space-y-4"
                    } ${draggedDisplayIndex === displayIndex ? "opacity-50" : ""}`}
                  >
                    {/* Styled Card Header in Ringkasan style */}
                    <div
                      className="flex items-center justify-between cursor-pointer select-none"
                      onClick={() => {
                        setCollapsedCards((prev) => ({
                          ...prev,
                          [originalIndex]: !prev[originalIndex],
                        }));
                      }}
                    >
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <div
                          className="cursor-grab active:cursor-grabbing text-stone-300 hover:text-stone-500 px-1 -ml-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <GripVertical className="w-5 h-5" />
                        </div>
                        <div className="px-3 py-1 bg-[#DCAF43]/10 text-[#DCAF43] rounded-lg font-semibold text-xs border border-[#DCAF43]/20">
                          {item.kegiatan || item.judul || "Kegiatan Baru"}
                        </div>
                      </div>

                      <div
                        className="flex items-center gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveSusunanItem(originalIndex)}
                          className="text-stone-400 hover:text-red-500 transition-all p-1.5 bg-stone-50 hover:bg-red-50 rounded-xl cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                          title="Hapus Kegiatan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Dropdown Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setCollapsedCards((prev) => ({
                              ...prev,
                              [originalIndex]: !prev[originalIndex],
                            }));
                          }}
                          className="text-stone-400 hover:text-stone-600 transition-all p-1.5 bg-stone-50 hover:bg-stone-100 rounded-xl cursor-pointer"
                          title={
                            isCollapsed
                              ? "Tampilkan Detail"
                              : "Sembunyikan Detail"
                          }
                        >
                          {isCollapsed ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronUp className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {!isCollapsed && (
                      <div className="flex flex-col gap-4 pt-4 border-t border-stone-100/80 animate-in fade-in duration-200">
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Durasi */}
                          <div className="relative w-full md:w-1/4">
                            <label className="block text-xs font-semibold text-stone-500 mb-1.5 "><span>Durasi (Menit)</span></label>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={item.durasi || ""}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "");
                                handleDurasiChange(originalIndex, val);
                              }}
                              onFocus={() =>
                                setActiveDurasiDropdownIndex(originalIndex)
                              }
                              onBlur={() =>
                                setTimeout(
                                  () => setActiveDurasiDropdownIndex(null),
                                  200,
                                )
                              }
                              placeholder="Mnt."
                              className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
                            />
                            {activeDurasiDropdownIndex === originalIndex && (
                              <div className="absolute left-0 right-0 mt-1 bg-white border border-stone-200 rounded-xl shadow-lg z-50 max-h-56 overflow-y-auto divide-y divide-stone-100 scrollbar-thin">
                                {DURASI_OPTIONS.map((opt) => (
                                  <div
                                    key={opt}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      handleDurasiChange(
                                        originalIndex,
                                        opt.toString(),
                                      );
                                      setActiveDurasiDropdownIndex(null);
                                    }}
                                    className="w-full px-4 py-2 text-left hover:bg-stone-50 cursor-pointer transition-colors text-sm text-stone-800 font-medium"
                                  >
                                    {opt} Menit
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Kegiatan */}
                          <div className="w-full md:w-3/4">
                            <label className="block text-xs font-semibold text-stone-500 mb-1.5">
                              Kegiatan
                            </label>
                            <textarea
                              ref={(el) => {
                                if (el) {
                                  el.style.height = "auto";
                                  el.style.height = `${el.scrollHeight}px`;
                                }
                              }}
                              value={item.kegiatan || item.judul || ""}
                              onChange={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height = `${e.target.scrollHeight}px`;
                                handleSusunanFieldChange(
                                  originalIndex,
                                  "kegiatan",
                                  e.target.value,
                                );
                              }}
                              placeholder="Contoh: MC Mengudara..."
                              className="w-full px-4 py-2 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm resize-none overflow-hidden"
                              rows={1}
                            />
                          </div>
                        </div>

                        {/* Deskripsi */}
                        {isDeskripsiOpen && (
                          <div className="w-full">
                            <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex items-center justify-between">
                              <span>Deskripsi</span>
                              <button
                                type="button"
                                onClick={() =>
                                  removeField(originalIndex, "deskripsi")
                                }
                                className="text-stone-400 hover:text-red-500 transition-colors"
                              >
                                Hapus Deskripsi
                              </button>
                            </label><textarea
                              ref={(el) => {
                                if (el) {
                                  el.style.height = "auto";
                                  el.style.height = `${el.scrollHeight}px`;
                                }
                              }}
                              value={item.deskripsi || ""}
                              onChange={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height = `${e.target.scrollHeight}px`;
                                handleSusunanFieldChange(
                                  originalIndex,
                                  "deskripsi",
                                  e.target.value,
                                );
                              }}
                              placeholder="Uraikan detail jalannya acara, pengaturan panggung, atau pengisi suara..."
                              className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all resize-none overflow-hidden shadow-sm"
                              rows={1}
                            />
                          </div>
                        )}

                        {/* Catatan */}
                        {isCatatanOpen && (
                          <div className="w-full">
                            <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex items-center justify-between">
                              <span>Catatan</span>
                              <button
                                type="button"
                                onClick={() =>
                                  removeField(originalIndex, "catatan")
                                }
                                className="text-stone-400 hover:text-red-500 transition-colors"
                              >
                                Hapus Catatan
                              </button>
                            </label>
                            <textarea
                              ref={(el) => {
                                if (el) {
                                  el.style.height = "auto";
                                  el.style.height = `${el.scrollHeight}px`;
                                }
                              }}
                              value={item.catatan || ""}
                              onChange={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height = `${e.target.scrollHeight}px`;
                                handleSusunanFieldChange(
                                  originalIndex,
                                  "catatan",
                                  e.target.value,
                                );
                              }}
                              placeholder="Instruksi tambahan untuk tim pengiring, catering, atau photografer..."
                              className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all resize-none overflow-hidden shadow-sm"
                              rows={1}
                            />
                          </div>
                        )}

                        {/* Musik */}
                        {isMusikOpen &&
                          (() => {
                            const musicList = Array.isArray(item.musik)
                              ? item.musik.length > 0
                                ? item.musik
                                : [""]
                              : item.musik
                                ? [item.musik]
                                : [""];

                            return (
                              <div className="w-full space-y-4">
                                <div className="flex items-center justify-between">
                                  <span className="block text-xs font-semibold text-stone-500">
                                    Musik Pengiring
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeField(originalIndex, "musik")
                                    }
                                    className="text-[11px] font-semibold text-stone-400 hover:text-red-500 transition-colors"
                                  >
                                    Hapus Musik
                                  </button>
                                </div>

                                <div className="space-y-4">
                                  {musicList.map((musicValue, musicIdx) => {
                                    return (
                                      <div key={musicIdx} className="space-y-1">
                                        <div className="flex items-center gap-2">
                                          <div className="flex-1">
                                            <MusikCombobox
                                              value={musicValue}
                                              allMusik={allMusik}
                                              onChange={(val) => {
                                                const newMusicList = [
                                                  ...musicList,
                                                ];
                                                newMusicList[musicIdx] = val;
                                                handleSusunanFieldChange(
                                                  originalIndex,
                                                  "musik",
                                                  newMusicList,
                                                );
                                              }}
                                            />
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const newMusicList =
                                                musicList.filter(
                                                  (_, idx) => idx !== musicIdx,
                                                );
                                              handleSusunanFieldChange(
                                                originalIndex,
                                                "musik",
                                                newMusicList,
                                              );
                                            }}
                                            className="p-3 text-stone-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                                            title="Hapus track ini"
                                          >
                                            <Trash2 className="w-5 h-5" />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const newMusicList = [...musicList, ""];
                                    handleSusunanFieldChange(
                                      originalIndex,
                                      "musik",
                                      newMusicList,
                                    );
                                  }}
                                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#D2A439] hover:text-[#b88c2f] transition-all py-2 px-3.5 bg-[#DCAF43]/10 hover:bg-[#DCAF43]/15 rounded-xl border border-[#DCAF43]/20 cursor-pointer"
                                >
                                  <Plus className="w-4 h-4" />
                                  Tambah Musik Pengiring Lain
                                </button>
                              </div>
                            );
                          })()}

                        {/* Toggle Buttons if hidden */}
                        {(!isDeskripsiOpen ||
                          !isCatatanOpen ||
                          !isMusikOpen) && (
                          <div className="flex flex-row flex-wrap items-center gap-2 mt-2 w-full">
                            {!isDeskripsiOpen && (
                              <button
                                type="button"
                                onClick={() =>
                                  toggleField(originalIndex, "deskripsi")
                                }
                                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-stone-500 hover:text-stone-700 bg-stone-50/80 hover:bg-stone-100/80 px-3 py-1.5 rounded-full border border-stone-200 transition-all shadow-sm cursor-pointer"
                              >
                                <Plus className="w-3 h-3 text-stone-400" />
                                <span className="md:hidden">Deskripsi</span>
                                <span className="hidden md:inline">
                                  Tambah Deskripsi
                                </span>
                              </button>
                            )}
                            {!isCatatanOpen && (
                              <button
                                type="button"
                                onClick={() =>
                                  toggleField(originalIndex, "catatan")
                                }
                                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-stone-500 hover:text-stone-700 bg-stone-50/80 hover:bg-stone-100/80 px-3 py-1.5 rounded-full border border-stone-200 transition-all shadow-sm cursor-pointer"
                              >
                                <Plus className="w-3 h-3 text-stone-400" />
                                <span className="md:hidden">Catatan</span>
                                <span className="hidden md:inline">
                                  Tambah Catatan
                                </span>
                              </button>
                            )}
                            {!isMusikOpen && (
                              <button
                                type="button"
                                onClick={() =>
                                  toggleField(originalIndex, "musik")
                                }
                                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-stone-500 hover:text-stone-700 bg-stone-50/80 hover:bg-stone-100/80 px-3 py-1.5 rounded-full border border-stone-200 transition-all shadow-sm cursor-pointer"
                              >
                                <Music className="w-3 h-3 text-stone-400" />
                                <span className="md:hidden">Musik</span>
                                <span className="hidden md:inline">
                                  Tambah Musik
                                </span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ADD BUTTON UNDER COMPONENT */}
          <div className="hidden md:flex justify-start mt-4">
            <button
              type="button"
              onClick={handleAddSusunanItem}
              className="flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-stone-800 bg-[#DCAF43]/15 border border-[#DCAF43]/25 hover:bg-[#DCAF43]/25 rounded-xl hover:border-[#DCAF43]/40 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-stone-700" />
              Tambah Kegiatan ({activeSegment})
            </button>
          </div>
        </div>
      </div>
    </FormLayout>
  );
}
