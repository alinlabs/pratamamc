import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  MapPin,
  Heart,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Copy,
  Share2,
  ExternalLink
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { formatPhoneInput, formatSocialInput } from "../../../lib/inputFormatters";
import {
  saveKlienAkun,
  saveKlienPengantin,
  saveKlienKeluarga,
  saveKlienAcara,
  saveKlienVendor,
} from "../../../lib/api";

import { useGenerateRundown } from "./hooks/useGenerateRundown";
import { DEFAULT_CATEGORIES } from "../../klien/vendor/form-vendor";
import StepDataMempelai from "./components/step-data-mempelai";
import StepKeluarga from "./components/step-keluarga";
import StepLokasiMap from "./components/step-lokasi-map";
import StepWaktuRundown from "./components/step-waktu-rundown";
import StepPanitia from "./components/step-panitia";
import StepVendor from "./components/step-vendor";
import StepTamu from "./components/step-tamu";

const STEPS = [
  { id: 1, label: 'Pengantin', icon: Heart },
  { id: 2, label: 'Keluarga', icon: Heart },
  { id: 3, label: 'Lokasi', icon: MapPin },
  { id: 4, label: 'Waktu', icon: Calendar },
  { id: 5, label: 'Panitia', icon: Users },
  { id: 6, label: 'Vendor', icon: Sparkles },
  { id: 7, label: 'Tamu VIP', icon: Users },
];

export default function NewPengantinForm({
  event,
  onSaved,
}: {
  event?: any;
  onSaved?: () => void;
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const draft = !event ? JSON.parse(localStorage.getItem("klien_form_draft") || "{}") : {};
  const [currentStep, setCurrentStep] = useState(draft.currentStep || 1);
  const [tanggalAcara, setTanggalAcara] = useState(
    event?.tanggal ? event.tanggal : (draft.tanggalAcara || "")
  );
  const [waktuAcara, setWaktuAcara] = useState(
    event?.waktu ? event.waktu : (draft.waktuAcara || "")
  );
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedUsername, setSavedUsername] = useState("");
  const [copied, setCopied] = useState(false);

  const shareUrl = savedUsername ? `${window.location.origin}/${savedUsername}` : "";
  
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Area Klien Pratama MC",
          text: "Berikut adalah tautan dan akses QRCode untuk dashboard acara kita:",
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      handleCopy();
    }
  };

  const [jenisAkad, setJenisAkad] = useState(draft.jenisAkad || "Disandingkan");

  const { acaraList, handleRemoveAcara, handleReorderAcara, expandedAcara, setExpandedAcara } = useGenerateRundown(waktuAcara, tanggalAcara, event, jenisAkad);

  // Data Dasar
  const [alamatStr, setAlamatStr] = useState(event?.alamat || draft.alamatStr || "");
  const [linkMaps, setLinkMaps] = useState(event?.link_maps || draft.linkMaps || "");
  const [latLng, setLatLng] = useState(draft.latLng || { lat: -6.556209, lng: 107.443152 });

  React.useEffect(() => {
    if (!event && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(res => res.json())
            .then(data => {
              setLatLng({ lat: latitude, lng: longitude });
              if(data.display_name && !alamatStr) setAlamatStr(data.display_name);
              if(!linkMaps) setLinkMaps(`https://maps.google.com/?q=${latitude},${longitude}`);
            })
            .catch(() => {
              setLatLng({ lat: latitude, lng: longitude });
            });
        },
        (error) => {
          console.warn("Auto geolocation failed:", error);
        }
      );
    }
  }, [event]);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung oleh browser Anda");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          setLatLng({ lat: latitude, lng: longitude });
          if(data.display_name) setAlamatStr(data.display_name);
          setLinkMaps(`https://maps.google.com/?q=${latitude},${longitude}`);
        } catch (error) {
          console.error("Error mendapatkan alamat:", error);
          setLatLng({ lat: latitude, lng: longitude });
          setLinkMaps(`https://maps.google.com/?q=${latitude},${longitude}`);
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        console.error("Error geolocation:", error);
        alert("Gagal mendapatkan lokasi saat ini");
        setLocating(false);
      }
    );
  };

  const [tema, setTema] = useState(
    event?.tema || draft.tema || ""
  );

  const bahasaArray = Array.isArray(event?.bahasa) ? event.bahasa : (event?.bahasa ? event.bahasa.split(',').map((b: string) => b.trim()) : []);
  const [bahasaAkad, setBahasaAkad] = useState(bahasaArray[0] || draft.bahasaAkad || "");
  const [bahasaAdat, setBahasaAdat] = useState(bahasaArray[1] || draft.bahasaAdat || "");
  const [bahasaResepsi, setBahasaResepsi] = useState(bahasaArray[2] || draft.bahasaResepsi || "");

  const DEFAULT_PANITIA = [
    { peran: 'Koordinator Keluarga Wanita', nama: '', whatsapp: '' },
    { peran: 'Koordinator Keluarga Pria', nama: '', whatsapp: '' },
    { peran: 'PIC Bunga', nama: '', whatsapp: '' },
    { peran: 'Perwakilan Sambutan Pria', nama: '', whatsapp: '' },
    { peran: 'Perwakilan Sambutan Wanita', nama: '', whatsapp: '' },
    { peran: 'Petugas KUA', nama: '', whatsapp: '' },
    { peran: 'Pembaca Al-Quran', nama: '', whatsapp: '' },
    { peran: 'Saksi Pihak Pria', nama: '', whatsapp: '' },
    { peran: 'Saksi Pihak Wanita', nama: '', whatsapp: '' },
    { peran: 'Pembaca Saritilawah', nama: '', whatsapp: '' },
    { peran: 'PIC Konsumsi', nama: '', whatsapp: '' },
    { peran: 'PIC Hantaran', nama: '', whatsapp: '' },
    { peran: 'PIC Doorprize', nama: '', whatsapp: '' }
  ];

  const [panitiaList, setPanitiaList] = useState<any[]>(() => {
    const existing = event?.keluarga?.panitia_keluarga || draft.panitiaList || [];
    return DEFAULT_PANITIA.map(defaultP => {
       const exist = existing.find((p: any) => p.peran === defaultP.peran);
       return exist ? { ...defaultP, ...exist } : { ...defaultP };
    });
  });

  const [vendorList, setVendorList] = useState<any[]>(() => {
    const existing = event?.vendor || draft.vendorList || [];
    return DEFAULT_CATEGORIES.map((cat: string) => {
       const exist = existing.find((v: any) => v.kategori && v.kategori.toLowerCase() === cat.toLowerCase());
       return exist ? { ...exist, kategori: cat } : { kategori: cat, nama: '', whatsapp: '', instagram: '' };
    });
  });

  const [tamuList, setTamuList] = useState<any[]>(
    event?.tamu || draft.tamuList || [{ nama: '', jenis: '', catatan: '' }]
  );

  // Pengantin
  const p = event?.pengantin || draft.pria || {};
  const pw = event?.pengantin || draft.wanita || {};

  const [pria, setPria] = useState({
    nama_lengkap: p.nama_lengkap_pria || p.nama_lengkap || "",
    nama_panggilan: p.nama_panggilan_pria || p.nama_panggilan || "",
    anak_ke: p.anak_ke_pria || p.anak_ke || "",
    whatsapp: formatPhoneInput(p.whatsapp_pria || p.whatsapp || ""),
    instagram: formatSocialInput(p.instagram_pria || p.instagram || ""),
  });

  const [wanita, setWanita] = useState({
    nama_lengkap: pw.nama_lengkap_wanita || pw.nama_lengkap || "",
    nama_panggilan: pw.nama_panggilan_wanita || pw.nama_panggilan || "",
    anak_ke: pw.anak_ke_wanita || pw.anak_ke || "",
    whatsapp: formatPhoneInput(pw.whatsapp_wanita || pw.whatsapp || ""),
    instagram: formatSocialInput(pw.instagram_wanita || pw.instagram || ""),
  });

  const [keluargaList, setKeluargaList] = useState<any[]>(
    event?.keluarga?.keluarga_inti || draft.keluargaList || [
      { peran: "Ayah Mempelai Wanita", nama: "", nama_panggilan: "", whatsapp: "", instagram: "", disableDelete: true },
      { peran: "Ibu Mempelai Wanita", nama: "", nama_panggilan: "", whatsapp: "", instagram: "", disableDelete: true },
      { peran: "Ayah Mempelai Pria", nama: "", nama_panggilan: "", whatsapp: "", instagram: "", disableDelete: true },
      { peran: "Ibu Mempelai Pria", nama: "", nama_panggilan: "", whatsapp: "", instagram: "", disableDelete: true },
    ]
  );

  React.useEffect(() => {
    if (!event) {
      localStorage.setItem("klien_form_draft", JSON.stringify({
        currentStep,
        tanggalAcara,
        waktuAcara,
        jenisAkad,
        alamatStr,
        linkMaps,
        latLng,
        tema,
        bahasaAkad,
        bahasaAdat,
        bahasaResepsi,
        pria,
        wanita,
        keluargaList,
        panitiaList,
        vendorList,
        tamuList
      }));
    }
  }, [
    currentStep, tanggalAcara, waktuAcara, jenisAkad, alamatStr, linkMaps, latLng,
    tema, bahasaAkad, bahasaAdat, bahasaResepsi, pria, wanita, keluargaList,
    panitiaList, vendorList, tamuList, event
  ]);

  const cleanWhatsApp = (phone: string) => {
    let numeric = phone.replace(/\D/g, "");
    if (numeric.startsWith("0")) {
      numeric = "62" + numeric.substring(1);
    } else if (numeric.startsWith("8")) {
      numeric = "62" + numeric;
    }
    return numeric ? "+" + numeric : "";
  };

  const ayahWanita = keluargaList.find((k) => k.peran === "Ayah Mempelai Wanita");
  const ibuWanita = keluargaList.find((k) => k.peran === "Ibu Mempelai Wanita");
  const ayahPria = keluargaList.find((k) => k.peran === "Ayah Mempelai Pria");
  const ibuPria = keluargaList.find((k) => k.peran === "Ibu Mempelai Pria");

  const koorWanita = panitiaList.find((p) => p.peran === 'Koordinator Keluarga Wanita');
  const koorPria = panitiaList.find((p) => p.peran === 'Koordinator Keluarga Pria');
  const picBunga = panitiaList.find((p) => p.peran === 'PIC Bunga');
  const sambutanPria = panitiaList.find((p) => p.peran === 'Perwakilan Sambutan Pria');
  const sambutanWanita = panitiaList.find((p) => p.peran === 'Perwakilan Sambutan Wanita');
  const petugasKua = panitiaList.find((p) => p.peran === 'Petugas KUA');
  const pembacaQuran = panitiaList.find((p) => p.peran === 'Pembaca Al-Quran');

  const [showValidationModal, setShowValidationModal] = useState(false);
  const [missingFields, setMissingFields] = useState<{label: string, step: number}[]>([]);

  const getMissingFields = () => {
    const missing: {label: string, step: number}[] = [];
    if (!event) {
      if (!tanggalAcara.trim()) missing.push({label: "Tanggal Acara", step: 4});
      if (!waktuAcara.trim()) missing.push({label: "Waktu Acara", step: 4});
    }
    if (!alamatStr?.trim()) missing.push({label: "Alamat Lokasi", step: 3});
    if (!linkMaps?.trim()) missing.push({label: "Link Maps", step: 3});
    if (!tema) missing.push({label: "Warna Tema Pakaian", step: 3});
    if (!bahasaAkad) missing.push({label: "Bahasa Prosesi Akad", step: 3});
    if (!bahasaAdat) missing.push({label: "Bahasa Prosesi Adat", step: 3});
    if (!bahasaResepsi) missing.push({label: "Bahasa Prosesi Resepsi", step: 3});
    
    if (!pria?.nama_lengkap?.trim()) missing.push({label: "Nama Lengkap Pria", step: 1});
    if (!pria?.nama_panggilan?.trim()) missing.push({label: "Nama Panggilan Pria", step: 1});
    if (pria?.anak_ke?.toString().trim() === "") missing.push({label: "Anak ke- (Pria)", step: 1});
    if (!pria?.whatsapp?.trim()) missing.push({label: "WhatsApp Pria", step: 1});
    
    if (!wanita?.nama_lengkap?.trim()) missing.push({label: "Nama Lengkap Wanita", step: 1});
    if (!wanita?.nama_panggilan?.trim()) missing.push({label: "Nama Panggilan Wanita", step: 1});
    if (wanita?.anak_ke?.toString().trim() === "") missing.push({label: "Anak ke- (Wanita)", step: 1});
    if (!wanita?.whatsapp?.trim()) missing.push({label: "WhatsApp Wanita", step: 1});
    
    keluargaList.forEach((k) => {
      if (!k.nama?.trim() || !k.nama_panggilan?.trim()) {
        missing.push({label: `Keluarga Inti: ${k.peran} (Nama & Panggilan)`, step: 2});
      }
    });

    if (!koorWanita?.nama?.trim() || !koorWanita?.whatsapp?.trim()) missing.push({label: "Koordinator Kel. Wanita (Nama & WA)", step: 5});
    if (!koorPria?.nama?.trim() || !koorPria?.whatsapp?.trim()) missing.push({label: "Koordinator Kel. Pria (Nama & WA)", step: 5});
    if (!picBunga?.nama?.trim()) missing.push({label: "PIC Bunga (Nama)", step: 5});
    if (!sambutanPria?.nama?.trim()) missing.push({label: "Perwakilan Sambutan Pria (Nama)", step: 5});
    if (!sambutanWanita?.nama?.trim()) missing.push({label: "Perwakilan Sambutan Wanita (Nama)", step: 5});
    if (!petugasKua?.nama?.trim()) missing.push({label: "Petugas KUA (Nama)", step: 5});
    if (!pembacaQuran?.nama?.trim()) missing.push({label: "Pembaca Al-Quran (Nama)", step: 5});

    return missing;
  };

  const generateIdKlien = async () => {
    try {
      const { getKlienAkun } = await import("../../../lib/api");
      const clients = await getKlienAkun();
      if (!clients || clients.length === 0) return "CL-001";

      const numericalIds = clients
        .map((c: any) => {
          if (!c.id_klien) return 0;
          const match = c.id_klien.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        })
        .filter((id: number) => !isNaN(id));

      const maxId = numericalIds.length > 0 ? Math.max(...numericalIds) : 0;
      return `CL-${String(maxId + 1).padStart(3, "0")}`;
    } catch (e) {
      console.error(e);
      return `CL-${Math.random().toString().substring(2, 6)}`;
    }
  };

  const handleChangeWaktu = (val: string) => {
    let clean = val.replace(/[^\d]/g, '');
    if (clean.length > 4) clean = clean.substring(0, 4);
    
    let formatted = clean;
    if (clean.length >= 3) {
      formatted = clean.substring(0, 2) + ':' + clean.substring(2);
    }
    setWaktuAcara(formatted);
  };

  const handleSave = async () => {
    const missing = getMissingFields();
    if (missing.length > 0) {
      setMissingFields(missing);
      setShowValidationModal(true);
      return;
    }
    setLoading(true);
    try {
      let finalId = event?.id_klien;
      let finalUsername = event?.username;
      
      if (!event) {
        finalId = await generateIdKlien();
        const generatedUsername = (
          wanita.nama_panggilan +
          "&" +
          pria.nama_panggilan
        )
          .toLowerCase()
          .replace(/[^a-z0-9&]/g, ""); 
        finalUsername = generatedUsername.length > 0 ? generatedUsername : finalId.toLowerCase();
      }

      const pengantinPayload = {
        ...(event?.pengantin || {}),
        nama_lengkap_wanita: wanita.nama_lengkap,
        nama_panggilan_wanita: wanita.nama_panggilan,
        anak_ke_wanita: wanita.anak_ke,
        whatsapp_wanita: cleanWhatsApp(wanita.whatsapp),
        instagram_wanita: wanita.instagram,
        nama_lengkap_pria: pria.nama_lengkap,
        nama_panggilan_pria: pria.nama_panggilan,
        anak_ke_pria: pria.anak_ke,
        whatsapp_pria: cleanWhatsApp(pria.whatsapp),
        instagram_pria: pria.instagram,
      };

      const finalTanggal = !event ? tanggalAcara : event.tanggal;
      const finalWaktu = !event ? waktuAcara : event.waktu;
      const finalBahasa = [bahasaAkad, bahasaAdat, bahasaResepsi];

      await saveKlienAkun({
        id_klien: finalId,
        username: finalUsername,
        tanggal: finalTanggal,
        waktu: finalWaktu,
        alamat: alamatStr,
        link_maps: linkMaps,
        tema: tema,
        bahasa: finalBahasa,
        galeri: event?.galeri || [],
        status: event ? event.status : 1,
      });

      await saveKlienPengantin(finalId, pengantinPayload);

      const keluargaPayload = {
        keluarga_inti: keluargaList.filter((k) => k.nama.trim() !== ""),
        panitia_keluarga: panitiaList.map(p => ({ ...p, id: p.id || Math.random().toString(36).substr(2, 9) })),
        tamu: tamuList.filter((t) => t.nama.trim() !== ""),
        pengisi_acara: event?.pengisi_acara || [],
        pendamping: event?.pendamping || []
      };
      await saveKlienKeluarga(finalId, keluargaPayload);

      const cleanAcaraList = acaraList.map(({ id, waktu, ...rest }) => rest);
      await saveKlienAcara(finalId, cleanAcaraList);
      await saveKlienVendor(finalId, { vendor: vendorList, wedding_organizer: typeof event?.wedding_organizer === 'undefined' ? [] : event.wedding_organizer });

      window.dispatchEvent(
        new CustomEvent("klien-data-updated", {
            detail: {
              alamat: alamatStr,
              link_maps: linkMaps,
              tema: tema,
              bahasa: finalBahasa,
              pengantin: pengantinPayload,
              keluarga: keluargaPayload,
            },
        }),
      );

      if (!event) {
        localStorage.setItem(`auth_${finalUsername}`, finalId);
        sessionStorage.setItem(`auth_${finalUsername}`, finalId);
        localStorage.setItem("last_client_username", finalUsername);
        
        setSavedUsername(finalUsername);
        setShowSuccessModal(true);
      } else {
        alert("Data awal berhasil disimpan!");
        if (onSaved) onSaved();
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full pb-20 md:pb-0" onKeyDown={(e) => {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const container = e.currentTarget;
        const focusableElements = Array.from(container.querySelectorAll('input:not([type="hidden"]), select, textarea, button[type="submit"], button[type="button"].next-btn, button[type="button"].save-btn'));
        const index = focusableElements.indexOf(e.target);
        if (index > -1 && focusableElements[index + 1]) {
          focusableElements[index + 1].focus();
        }
      }
    }}>
      {/* Full Bleed Banner */}
      <div className="w-full relative aspect-[16/9] md:aspect-[3/1] overflow-hidden bg-stone-900 flex mb-8">
        <picture className="w-full h-full flex-shrink-0">
          <source
            media="(min-width: 768px)"
            srcSet="/gambar/banner/desktop1.webp"
          />
          <img
            src="/gambar/banner-form-new-mobile.webp"
            alt="Hero Banner"
            className="w-full h-full object-cover"
          />
        </picture>
      </div>

      <div className="w-full max-w-3xl mx-auto space-y-8 px-4 md:px-0">
        <div className="mb-4 text-center md:text-left animate-in fade-in slide-in-from-right-4 duration-500">
          <h1 className="text-xl sm:text-3xl font-extrabold text-stone-900 mb-2">
            Selamat Datang di Area Klien
          </h1>
          <p className="text-sm text-stone-500 sm:text-lg px-2 md:px-0">
            Terima kasih telah mempercayakan momen spesial Anda bersama kami.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center relative z-0 mb-8 pt-4 overflow-x-auto scrollbar-hide sm:px-0 px-2 lg:px-4 w-full">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentStep >= step.id;
            const hasNext = idx < STEPS.length - 1;
            const nextIsActive = currentStep >= step.id + 1;
            
            return (
              <React.Fragment key={step.id}>
                <div 
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex flex-col items-center gap-2 cursor-pointer shrink-0 transition-opacity ${isActive ? 'opacity-100' : 'opacity-50 hover:opacity-80'} w-14 sm:w-20`}
                >
                  <div className={`z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 bg-white transition-all duration-300 ${isActive ? 'border-[#DCAF43] text-[#DCAF43] shadow-sm' : 'border-stone-200 text-stone-400'}`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className={`text-[10px] sm:text-xs text-center ${isActive ? 'text-stone-600 font-medium' : 'text-stone-400 font-normal'}`}>
                    {step.label}
                  </span>
                </div>
                {hasNext && (
                  <div className="flex-1 h-0.5 -mt-6 sm:-mt-7 z-0 min-w-[24px]">
                     <div className={`h-full w-full transition-all duration-300 ${nextIsActive ? 'bg-[#DCAF43]' : 'bg-stone-200'}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* STEP 1: Pengantin */}
        <div className={`${currentStep !== 1 ? "hidden" : "animate-in fade-in slide-in-from-right-4 duration-500"}`}>
          <StepDataMempelai wanita={wanita} setWanita={setWanita} pria={pria} setPria={setPria} />
        </div>

        {/* STEP 2: Keluarga Inti */}
        <div className={`${currentStep !== 2 ? "hidden" : "animate-in fade-in slide-in-from-right-4 duration-500"}`}>
          <StepKeluarga keluargaList={keluargaList} setKeluargaList={setKeluargaList} />
        </div>

        {/* STEP 3: Lokasi & Tema */}
        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <StepLokasiMap 
              latLng={latLng} 
              handleCurrentLocation={handleCurrentLocation} 
              locating={locating} 
              alamatStr={alamatStr} 
              setAlamatStr={setAlamatStr} 
              linkMaps={linkMaps} 
              setLinkMaps={setLinkMaps}
              tema={tema}
              setTema={setTema}
              bahasaAkad={bahasaAkad}
              setBahasaAkad={setBahasaAkad}
              bahasaAdat={bahasaAdat}
              setBahasaAdat={setBahasaAdat}
              bahasaResepsi={bahasaResepsi}
              setBahasaResepsi={setBahasaResepsi}
            />
          </div>
        )}

        {/* STEP 4: Acara */}
        <div className={`${currentStep !== 4 ? "hidden" : "animate-in fade-in slide-in-from-right-4 duration-500"}`}>
          <StepWaktuRundown 
            tanggalAcara={tanggalAcara}
            setTanggalAcara={setTanggalAcara}
            waktuAcara={waktuAcara}
            handleChangeWaktu={handleChangeWaktu}
            jenisAkad={jenisAkad}
            setJenisAkad={setJenisAkad}
            acaraList={acaraList}
            handleRemoveAcara={handleRemoveAcara}
            handleReorderAcara={handleReorderAcara}
            expandedAcara={expandedAcara}
            setExpandedAcara={setExpandedAcara}
          />
        </div>

        {/* STEP 5: Panitia */}
        <div className={`${currentStep !== 5 ? "hidden" : "animate-in fade-in slide-in-from-right-4 duration-500"}`}>
          <StepPanitia panitiaList={panitiaList} setPanitiaList={setPanitiaList} />
        </div>

        {/* STEP 6: Vendor */}
        <div className={`${currentStep !== 6 ? "hidden" : "animate-in fade-in slide-in-from-right-4 duration-500"}`}>
          <StepVendor vendorList={vendorList} setVendorList={setVendorList} />
        </div>

        {/* STEP 7: Tamu Khusus */}
        <div className={`${currentStep !== 7 ? "hidden" : "animate-in fade-in slide-in-from-right-4 duration-500"}`}>
          <StepTamu tamuList={tamuList} setTamuList={setTamuList} />
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-stone-200 z-50 flex items-center justify-between md:relative md:border-t-0 md:bg-transparent md:p-0 md:justify-end md:pt-4 md:mb-8 gap-4 bg-white md:bg-transparent shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] md:shadow-none">
          {/* Prev Button */}
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setCurrentStep((prev) => prev - 1);
            }}
            className={`px-4 py-3.5 border border-stone-200 text-stone-600 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors hover:bg-stone-50 active:bg-stone-100 ${currentStep > 1 ? "flex flex-1 md:flex-none" : "hidden"}`}
          >
            <ChevronLeft className="w-5 h-5" /> Kembali
          </button>

          {/* Next Button */}
          {currentStep < 7 && (
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setCurrentStep((prev) => prev + 1);
              }}
              className={`flex flex-1 md:flex-none md:w-40 items-center justify-center gap-2 px-8 py-3.5 bg-[#DCAF43] text-white rounded-xl font-bold transition-transform hover:bg-[#c99f35] active:scale-95 ${currentStep === 1 ? "w-full md:w-auto" : ""}`}
            >
              Lanjut <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className={`flex items-center justify-center gap-2 px-8 py-3.5 bg-[#DCAF43] text-white hover:bg-[#c99f35] rounded-xl font-bold shadow-lg active:scale-95 transition-all text-base md:text-lg flex-1 md:flex-none disabled:opacity-50 disabled:bg-stone-300 disabled:shadow-none disabled:active:scale-100 ${currentStep < 7 ? "hidden" : "flex"}`}
          >
            {loading ? "Menyimpan..." : "Selesai"}
          </button>
        </div>
      </div>

      {/* Validation Modal / Bottom Sheet */}
      <AnimatePresence>
        {showValidationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-sm sm:max-w-md overflow-hidden shadow-2xl pb-safe sm:pb-0 flex flex-col max-h-[85vh]"
            >
              <div className="p-6 pb-4 border-b border-stone-100 flex-shrink-0 flex flex-col items-center">
                <div className="w-12 h-1.5 bg-stone-200 rounded-full mb-6 sm:hidden"></div>
                <h3 className="text-xl font-bold text-stone-800 text-center">Data Belum Lengkap</h3>
                <p className="text-stone-500 text-sm text-center mt-2">
                  Mohon lengkapi {missingFields.length} data wajib berikut sebelum menyimpan:
                </p>
              </div>
              
              <div className="p-6 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                <ul className="space-y-3">
                  {missingFields.map((field, idx) => (
                    <li 
                      key={idx} 
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setCurrentStep(field.step);
                        setShowValidationModal(false);
                      }}
                      className="flex items-center justify-between gap-3 bg-stone-50 border border-stone-100 text-stone-700 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer hover:bg-stone-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold text-red-600">
                          {idx + 1}
                        </span>
                        {field.label}
                      </div>
                      <ExternalLink className="w-4 h-4 opacity-40 shrink-0 text-stone-400" />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 pt-4 border-t border-stone-100 flex-shrink-0">
                <button
                  onClick={() => setShowValidationModal(false)}
                  className="w-full bg-stone-900 text-white py-3.5 px-4 rounded-xl font-bold shadow-lg hover:bg-stone-800 active:scale-95 transition-all text-sm"
                >
                  Tutup & Perbaiki
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl pb-safe sm:pb-0"
            >
              <div className="p-6 pb-8 text-center flex flex-col items-center">
                <div className="w-12 h-1.5 bg-stone-200 rounded-full mb-6 sm:hidden"></div>
                <div className="w-16 h-16 bg-green-100/50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                
                <h3 className="text-2xl font-black text-stone-800 mb-2">Selamat!</h3>
                <p className="text-stone-500 text-sm mb-6 px-4">
                  Data acara dan pengantin berhasil disimpan. Area Klien Anda sudah siap.
                </p>

                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 mb-6 inline-flex justify-center flex-col items-center shadow-sm w-full">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">Scan QR untuk Bagikan</span>
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-stone-100">
                    <QRCodeCanvas
                      value={shareUrl}
                      size={160}
                      level={"Q"}
                      imageSettings={{
                        src: "/gambar/source/logo-favicon.ico",
                        excavate: true,
                        width: 40,
                        height: 40,
                      }}
                    />
                  </div>
                  
                  <div className="w-full relative mt-6 flex items-center gap-2 bg-white border border-stone-200 rounded-xl p-2 pl-4">
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs text-stone-600 truncate text-left">{shareUrl}</p>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-stone-100 hover:bg-stone-200 transition-colors text-stone-600"
                    >
                      {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    {navigator.share && (
                      <button
                        onClick={handleShare}
                        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-stone-100 hover:bg-stone-200 transition-colors text-stone-600"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/${savedUsername}`)}
                  className="w-full bg-[#DCAF43] text-white py-3.5 px-4 rounded-xl font-bold shadow-lg shadow-[#DCAF43]/20 hover:bg-[#c99f35] active:scale-95 transition-all text-sm"
                >
                  Masuk ke Dashboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
