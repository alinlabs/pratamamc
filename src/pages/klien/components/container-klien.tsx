import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Home,
  Calendar as CalendarIcon,
  Users,
  Heart,
  Store,
  NotebookPen,
  Star,
  FolderOpen,
  Handshake,
  ExternalLink,
  Share2,
  Info,
  Check,
  RefreshCw,
  LogOut,
} from "lucide-react";
import Hero from "./hero-klien";
import SusunanAcara from "../acara";
import Ringkasan from "../ringkasan";
import KeluargaTab from "../keluarga";
import PengantinTab from "../pengantin";
import PendampingTab from "../pendamping";
import TamuTab from "../tamu";
import GDriveTab from "../gdrive";
import DaftarVendor from "../vendor";
import DaftarWO from "../wo";
import DaftarPanitia from "../panitia";
import Catatan from "../catatan";
import ScrollReveal from "../../../components/ScrollReveal";
import { FormContainer } from "./container-form";
import NotFound from "../../../components/error-notfound";
import DataError from "../../../components/error-data";
import ClientSearch from "./searchbar-klien";
import Login from "../login";
import {
  getKlienAkun,
  getKlienKeluarga,
  getKlienAcara,
  getKlienVendor,
  getKlienCatatan,
  getKlienPengantin,
  synchronizeAcaraWithDefaults,
} from "../../../lib/api";

import LoadingSpinner from "../../../components/screen-loading";
import NavigasiKlien from "./navigasi-klien";
import UlasanPage from "../ulasan";
import NewPengantinForm from "../pengantin/form-new-pengantin";
import ShareableVendorForm from "../vendor/form-new-vendor";
import ShareableWOForm from "../wo/form-new-wo";
import ShareablePendampingForm from "../pendamping/form-new-pendamping";
import ShareableTamuForm from "../tamu/form-new-tamu";
import ShareableGDriveForm from "../gdrive/form-new-gdrive";



export default function KlienContainer({
  isFormRoute = false,
}: {
  isFormRoute?: boolean;
}) {
  const { username, tab } = useParams<{ username: string; tab?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isNewClientForm =
    new URLSearchParams(location.search).has("new") &&
    !["vendor", "wo", "pendamping", "tamu", "gdrive"].includes(tab || "");
  const isExternalVendorForm =
    tab === "vendor" && new URLSearchParams(location.search).has("new");
  const isExternalWOForm =
    tab === "wo" && new URLSearchParams(location.search).has("new");
  const isExternalPendampingForm =
    tab === "pendamping" && new URLSearchParams(location.search).has("new");
  const isExternalTamuForm =
    tab === "tamu" && new URLSearchParams(location.search).has("new");
  const isExternalGDriveForm =
    tab === "gdrive" && new URLSearchParams(location.search).has("new");

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expectedClientId, setExpectedClientId] = useState<string>("");

  const validTabs = [
    "ringkasan",
    "pengantin",
    "acara",
    "keluarga",
    "panitia",
    "pendamping",
    "tamu",
    "vendor",
    "catatan",
    "ulasan",
    "gdrive",
    "wo",
  ];
  const activeTab = validTabs.includes(tab || "") ? tab : "ringkasan";

  const setActiveTab = (newTab: string) => {
    navigate(`/${username}/${newTab}`);
  };

  useEffect(() => {
    if (
      !tab &&
      !isFormRoute &&
      username !== "klien" &&
      !isNewClientForm &&
      !isExternalVendorForm &&
      !isExternalWOForm &&
      !isExternalPendampingForm &&
      !isExternalTamuForm &&
      !isExternalGDriveForm
    ) {
      navigate(`/${username}/ringkasan${location.search}`, { replace: true });
    }
  }, [
    username,
    tab,
    navigate,
    isFormRoute,
    isNewClientForm,
    isExternalVendorForm,
    isExternalWOForm,
    isExternalPendampingForm,
    isExternalTamuForm,
    isExternalGDriveForm,
    location.search,
  ]);

  const verifyAuth = (clientId: string, foundUsername?: string) => {
    if (foundUsername && foundUsername !== username) {
      localStorage.setItem(`auth_${foundUsername}`, clientId);
      sessionStorage.setItem(`auth_${foundUsername}`, clientId);
      localStorage.setItem("last_client_username", foundUsername);
      window.dispatchEvent(new Event("auth-success"));
      navigate(`/${foundUsername}/ringkasan`);
      return;
    }

    localStorage.setItem(`auth_${username}`, clientId);
    sessionStorage.setItem(`auth_${username}`, clientId);
    localStorage.setItem("last_client_username", username || "");
    window.dispatchEvent(new Event("auth-success"));
    setIsAuthenticated(true);
    fetchFullEvent(clientId);
  };

  const fetchBasicEvent = async () => {
    setLoading(true);
    setError(null);
    try {
      if (username === "klien") {
        const lastClientUsername = localStorage.getItem("last_client_username");
        if (lastClientUsername && lastClientUsername !== "klien") {
          const savedClientId =
            localStorage.getItem(`auth_${lastClientUsername}`) ||
            sessionStorage.getItem(`auth_${lastClientUsername}`);
          if (savedClientId) {
            navigate(`/${lastClientUsername}/ringkasan`, { replace: true });
            return;
          }
        }
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const data = await getKlienAkun({ username });
      const requestedUsername = username ? decodeURIComponent(username) : null;
      const foundEvent = requestedUsername
        ? data.find((e: any) => e.username === requestedUsername)
        : data[0];

      if (!foundEvent) {
        if (username === "klien") {
          setIsAuthenticated(false);
          setLoading(false);
        } else {
          setError("not_found");
          setLoading(false);
        }
      } else {
        localStorage.setItem("last_client_username", foundEvent.username);
        if (isNewClientForm) {
          const authKey = `auth_${foundEvent.username}`;
          localStorage.setItem(authKey, foundEvent.id_klien);
          sessionStorage.setItem(authKey, foundEvent.id_klien);
        }
        setExpectedClientId(foundEvent.id_klien);
        setEvent(foundEvent);
        setIsAuthenticated(true);
        fetchFullEvent(foundEvent.id_klien, foundEvent);
      }
    } catch (err) {
      console.error("Error fetching basic event:", err);
      setError("Gagal memuat data. Periksa koneksi internet Anda.");
      setLoading(false);
    }
  };

  const fetchFullEvent = async (clientId: string, baseEvent: any = {}) => {
    setLoading(true);
    try {
      const [keluargaList, acaraList, vendorList, catatanList, pengantinList] =
        await Promise.all([
          getKlienKeluarga(clientId).catch(() => []),
          getKlienAcara(clientId).catch(() => []),
          getKlienVendor(clientId).catch(() => []),
          getKlienCatatan(clientId).catch(() => []),
          getKlienPengantin(clientId).catch(() => []),
        ]);

      const k =
        keluargaList.find((d: any) => d.id_klien === clientId) ||
        keluargaList[0] ||
        {};
      const a =
        acaraList.find((d: any) => d.id_klien === clientId) ||
        acaraList[0] ||
        {};
      const v =
        vendorList.find((d: any) => d.id_klien === clientId) ||
        vendorList[0] ||
        {};
      const c =
        catatanList.find((d: any) => d.id_klien === clientId) ||
        catatanList[0] ||
        {};
      const p =
        pengantinList.find((d: any) => d.id_klien === clientId) ||
        pengantinList[0] ||
        {};

      let parsedSusunanAcara: any[] = [];
      if (Array.isArray(acaraList)) {
        if (acaraList.length > 0 && acaraList[0].segmen !== undefined) {
          // If the array itself is the list of events (instead of rows wrapper)
          parsedSusunanAcara = acaraList;
        } else {
          let rawAcara = a.susunan_acara || a.acara || a;
          if (typeof rawAcara === "string") {
            try {
              parsedSusunanAcara = JSON.parse(rawAcara);
            } catch (e) {
              parsedSusunanAcara = [];
            }
          } else if (Array.isArray(rawAcara)) {
            parsedSusunanAcara = rawAcara;
          } else if (
            a &&
            typeof a === "object" &&
            Object.keys(a).length > 0 &&
            (Array.isArray(a.susunan_acara) || Array.isArray(a.acara))
          ) {
            parsedSusunanAcara = a.susunan_acara || a.acara;
          }
        }
      }

      console.log("[KLIEN-ACARA DEBUG]", { acaraList, parsedSusunanAcara });

      const parseJsonSafe = (data: any, fallback: any = []) => {
        if (!data) return fallback;
        if (typeof data === "string") {
          try {
            return JSON.parse(data);
          } catch (e) {
            return fallback;
          }
        }
        return data;
      };

      let finalSusunanAcara = parsedSusunanAcara.length > 0 ? parsedSusunanAcara : parseJsonSafe(baseEvent?.susunan_acara);

      if (!finalSusunanAcara || finalSusunanAcara.length === 0) {
        try {
          const res = await fetch('/data/default-acara.json');
          if (res.ok) {
            finalSusunanAcara = await res.json();
          }
        } catch(e) { 
          console.error("Error fetching default-acara.json", e); 
        }
      }

      finalSusunanAcara = synchronizeAcaraWithDefaults(finalSusunanAcara);

      if (finalSusunanAcara && finalSusunanAcara.length > 0) {
        finalSusunanAcara = finalSusunanAcara.map((item: any) => ({
          ...item,
          id: item.id || (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7))
        }));

        const eventWaktu = baseEvent?.waktu || k?.waktu || "08:00";
        
        const subtractTime = (timeStr: string, durationMin: number) => {
            if(!timeStr || !timeStr.includes(':')) return '';
            let [hours, mins] = timeStr.split(':').map(Number);
            let totalM = (hours * 60) + mins - Math.max(0, durationMin || 0);
            if(totalM < 0) totalM = 24 * 60 + totalM; 
            return `${Math.floor(totalM / 60) % 24}`.padStart(2,'0') + ':' + `${totalM % 60}`.padStart(2,'0');
        };

        const addTime = (timeStr: string, durationMin: number) => {
            if(!timeStr || !timeStr.includes(':')) return '';
            let [hours, mins] = timeStr.split(':').map(Number);
            let totalM = (hours * 60) + mins + Math.max(0, durationMin || 0);
            return `${Math.floor(totalM / 60) % 24}`.padStart(2,'0') + ':' + `${totalM % 60}`.padStart(2,'0');
        };

        let anchorIdx = finalSusunanAcara.findIndex((i: any) => i.segmen === "Akad" && i.kegiatan?.trim()?.toLowerCase() === "ijab kabul");
        if (anchorIdx === -1) {
          anchorIdx = finalSusunanAcara.findIndex((i: any) => i.segmen === "Akad" && i.kegiatan?.trim()?.toLowerCase() === "akad nikah");
        }
        if (anchorIdx === -1) {
          anchorIdx = finalSusunanAcara.findIndex((i: any) => i.segmen === "Akad");
        }
        if (anchorIdx !== -1) {
           finalSusunanAcara[anchorIdx].waktu = eventWaktu;
           // Calculate backwards
           for (let i = anchorIdx - 1; i >= 0; i--) {
              finalSusunanAcara[i].waktu = subtractTime(finalSusunanAcara[i+1].waktu, finalSusunanAcara[i].durasi);
           }
           // Calculate forwards
           for (let i = anchorIdx + 1; i < finalSusunanAcara.length; i++) {
              finalSusunanAcara[i].waktu = addTime(finalSusunanAcara[i-1].waktu, finalSusunanAcara[i-1].durasi);
           }
        } else {
           // If no anchor found, just start from eventWaktu at index 0
           finalSusunanAcara[0].waktu = eventWaktu;
           for (let i = 1; i < finalSusunanAcara.length; i++) {
              finalSusunanAcara[i].waktu = addTime(finalSusunanAcara[i-1].waktu, finalSusunanAcara[i-1].durasi);
           }
        }
      }

      setEvent((prev: any) => ({
        ...prev,
        ...k,
        ...a,
        ...v,
        ...c,
        ...p,
        pengantin: p,
        susunan_acara: finalSusunanAcara,
        vendor: parseJsonSafe(
          v.vendor || prev.vendor || v.daftar_vendor || prev.daftar_vendor,
        ),
        daftar_catatan: parseJsonSafe(c.daftar_catatan || prev.daftar_catatan),
        keluarga_inti: parseJsonSafe(k.keluarga_inti || prev.keluarga_inti),
        panitia_keluarga: parseJsonSafe(k.panitia_keluarga || prev.panitia_keluarga),
        tamu: parseJsonSafe(k.tamu || prev.tamu),
        pendamping: parseJsonSafe(k.pendamping || prev.pendamping),
        pengisi_acara: parseJsonSafe(k.pengisi_acara || prev.pengisi_acara),
        wedding_organizer: parseJsonSafe(v.wedding_organizer || prev.wedding_organizer),
      }));
    } catch (err) {
      console.error("Error fetching full event:", err);
      setError("Gagal memuat detail data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBasicEvent();

    // Pastikan refresh data saat tab browser kembali aktif
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Cache cleared by App.tsx, just refetch
        fetchBasicEvent();
      }
    };

    const handleDataUpdated = (e: any) => {
      if (e.detail) {
        setEvent((prev: any) => ({ ...prev, ...e.detail }));
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("klien-data-updated", handleDataUpdated);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("klien-data-updated", handleDataUpdated);
    };
  }, [username]);

  useEffect(() => {
    if (!username || username === "klien") return;

    // Capitalize first letter
    const formattedName = username.charAt(0).toUpperCase() + username.slice(1);
    const appName = `${formattedName} Wedding`;

    const updateManifest = () => {
      try {
        const manifest = {
          name: appName,
          short_name: appName,
          description: `Area Klien ${formattedName} & Pasangan`,
          theme_color: "#1c1917",
          background_color: "#ffffff",
          display: "standalone",
          start_url: `/${username}/ringkasan`,
          icons: [
            {
              src: "/gambar/source/pwa.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/gambar/source/pwa.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        };

        const blob = new Blob([JSON.stringify(manifest)], {
          type: "application/json",
        });
        const manifestURL = URL.createObjectURL(blob);

        let element = document.querySelector<HTMLLinkElement>(
          'link[rel="manifest"]',
        );
        if (!element) {
          element = document.createElement("link");
          element.rel = "manifest";
          document.head.appendChild(element);
        }
        element.href = manifestURL;
      } catch (e) {
        console.error("Error updating manifest:", e);
      }
    };

    updateManifest();

    return () => {
      let element = document.querySelector('link[rel="manifest"]');
      if (element) {
        element.setAttribute("href", "/manifest.webmanifest");
      }
    };
  }, [username]);

  useEffect(() => {
    if (!username || username === "klien" || !event) return;

    let titleSlug = username;
    if (username.includes("&")) {
      titleSlug = username
        .split("&")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" & ");
    } else {
      titleSlug = username.charAt(0).toUpperCase() + username.slice(1);
    }

    // Check if the event has custom meta tags from server
    const title = event.meta_judul || `Area Klien - ${titleSlug} | Pratama MC`;
    const description =
      event.meta_deskripsi ||
      `Area eksklusif klien untuk ${titleSlug}. Lihat ringkasan acara, panduan, dan daftar vendor.`;
    const isAnyNewForm = new URLSearchParams(window.location.search).has("new");
    const image = isAnyNewForm
      ? `https://pratamamc.my.id/gambar/source/metatag.png`
      : event.metatag ||
        event.meta_gambar ||
        `https://pratamamc.my.id/gambar/source/metatag.png`;

    document.title = title;

    const updateMetaTag = (
      selector: string,
      attribute: string,
      value: string,
    ) => {
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute(attribute, value);
      } else {
        element = document.createElement("meta");
        if (selector.includes("property")) {
          const prop = selector.match(/property="([^"]+)"/)?.[1];
          if (prop) element.setAttribute("property", prop);
        } else {
          const name = selector.match(/name="([^"]+)"/)?.[1];
          if (name) element.setAttribute("name", name);
        }
        element.setAttribute(attribute, value);
        document.head.appendChild(element);
      }
    };

    updateMetaTag('meta[name="title"]', "content", title);
    updateMetaTag('meta[name="description"]', "content", description);
    updateMetaTag('meta[property="og:title"]', "content", title);
    updateMetaTag('meta[property="og:description"]', "content", description);
    updateMetaTag('meta[property="og:image"]', "content", image);
    updateMetaTag('meta[property="og:url"]', "content", window.location.href);
    updateMetaTag('meta[property="twitter:title"]', "content", title);
    updateMetaTag(
      'meta[property="twitter:description"]',
      "content",
      description,
    );
    updateMetaTag('meta[property="twitter:image"]', "content", image);

    return () => {
      document.title = "Pratama MC | Professional Master of Ceremony";
    };
  }, [username, event]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 200);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col min-h-screen relative">
          <div className="h-48 md:h-64 bg-stone-200 animate-pulse w-full"></div>
          <div className="flex-1 -mt-8 relative z-10 px-4 max-w-6xl mx-auto w-full pt-10 animate-pulse">
            <div className="h-8 bg-stone-200 rounded-md w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-32 bg-white rounded-2xl border border-stone-100 w-full shadow-sm"></div>
              <div className="h-32 bg-white rounded-2xl border border-stone-100 w-full shadow-sm"></div>
              <div className="h-32 bg-white rounded-2xl border border-stone-100 w-full shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error === "not_found" || (!event && !error && username !== "klien")) {
    return <NotFound />;
  }

  if (error) {
    return <DataError message={error} onRetry={fetchBasicEvent} />;
  }

  if (!isAuthenticated) {
    return (
      <Login
        username={username || ""}
        expectedClientId={expectedClientId}
        isGlobal={username === "klien"}
        onSuccess={verifyAuth}
      />
    );
  }

  const tabItems = [
    { id: "ringkasan", label: "Ringkasan", icon: Home },
    { id: "acara", label: "Acara", icon: CalendarIcon },
    { id: "keluarga", label: "Keluarga", icon: Users },
    { id: "panitia", label: "Panitia", icon: Handshake },
    { id: "catatan", label: "Catatan", icon: NotebookPen },
    { id: "ulasan", label: "Ulasan", icon: Star },
    { id: "gdrive", label: "GDrive", icon: FolderOpen },
  ];

  let displayActiveTab = activeTab;
  if (activeTab === "wo" || activeTab === "vendor" || activeTab === "pengisi_acara") {
    displayActiveTab = "panitia";
  } else if (activeTab === "pendamping" || activeTab === "tamu" || activeTab === "pengantin") {
    displayActiveTab = "keluarga";
  }

  const renderNavigasi = () => (
    <NavigasiKlien
      clientName={event?.namaKlien || username || "Area Klien"}
      clientUsername={event?.username || username || "klien"}
      clientDriveUrl={event?.drive_url || null}
      activeTab={displayActiveTab}
      tabItems={tabItems}
      onNavigate={(id) => setActiveTab(id)}
      isFormRoute={isFormRoute}
    />
  );

  if (isNewClientForm) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-16 md:pb-12">
        {renderNavigasi()}
        <div className="pt-20">
          <NewPengantinForm event={event} onSaved={() => navigate(`/${username}`)} />
        </div>
      </div>
    );
  }

  if (isExternalVendorForm) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-16 md:pb-12">
        {renderNavigasi()}
        <div className="pt-20">
          <ShareableVendorForm
            event={event}
            onSaved={() => navigate(`/${username}/panitia`)}
          />
        </div>
      </div>
    );
  }

  if (isExternalWOForm) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-16 md:pb-12">
        {renderNavigasi()}
        <div className="pt-20">
          <ShareableWOForm
            event={event}
            onSaved={() => navigate(`/${username}/panitia`)}
          />
        </div>
      </div>
    );
  }

  if (isExternalPendampingForm) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-16 md:pb-12">
        {renderNavigasi()}
        <div className="pt-20">
          <ShareablePendampingForm
            event={event}
            onSaved={() => navigate(`/${username}/keluarga`)}
          />
        </div>
      </div>
    );
  }

  if (isExternalTamuForm) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-16 md:pb-12">
        {renderNavigasi()}
        <div className="pt-20">
          <ShareableTamuForm
            event={event}
            onSaved={() => navigate(`/${username}/keluarga`)}
          />
        </div>
      </div>
    );
  }

  if (isExternalGDriveForm) {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-16 md:pb-12">
        {renderNavigasi()}
        <div className="pt-20">
          <ShareableGDriveForm
            event={event}
            onSaved={() => navigate(`/${username}/gdrive`)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans relative flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 min-h-screen flex flex-col bg-stone-50 overflow-x-hidden relative">
        {renderNavigasi()}
        
        <div className="w-full">
          <Hero event={event} />
          <ClientSearch event={event} username={username || "klien"} />
        </div>

        {/* Content Area */}
        <div
          id="content-area"
          className="container max-w-6xl mx-auto px-4 md:px-6 pb-24 md:pb-24 pt-6 md:pt-8 flex flex-col gap-8 flex-1"
        >
          {/* Selected Content Detail View */}
          <div className="w-full">
            <ScrollReveal>
              {isFormRoute ? (
                <FormContainer
                  eventData={event}
                  isFormRoute={true}
                  initialTab={activeTab}
                />
              ) : (
                <>
                  {activeTab === "ringkasan" && (
                    <Ringkasan
                      event={event}
                      canEdit={
                        event.status === 1 || event.status === true
                      }
                    />
                  )}
                  {activeTab === "acara" && (
                    <SusunanAcara
                      clientId={event.id_klien}
                      rundown={
                        Array.isArray(event.susunan_acara)
                          ? event.susunan_acara
                          : []
                      }
                      clientName={event.username}
                      canEdit={
                        event.status === 1 || event.status === true
                      }
                    />
                  )}
                  {activeTab === "pengantin" && (
                    <PengantinTab
                      event={event}
                      canEdit={
                        event.status === 1 || event.status === true
                      }
                    />
                  )}
                  {activeTab === "keluarga" && (
                    <KeluargaTab
                      event={event}
                      canEdit={
                        event.status === 1 || event.status === true
                      }
                    />
                  )}
                  {activeTab === "panitia" && (
                    <DaftarPanitia
                      clientId={event.id_klien}
                      event={event}
                      canEdit={
                        event.status === 1 || event.status === true
                      }
                    />
                  )}
                  {activeTab === "pendamping" && (
                    <PendampingTab
                      event={event}
                      canEdit={
                        event.status === 1 || event.status === true
                      }
                    />
                  )}
                  {activeTab === "tamu" && (
                    <TamuTab
                      event={event}
                      canEdit={
                        event.status === 1 || event.status === true
                      }
                    />
                  )}
                  {activeTab === "vendor" && (
                    <DaftarVendor
                      clientId={event.id_klien}
                      vendor={
                        Array.isArray(event.vendor)
                          ? event.vendor
                          : Array.isArray(event.daftar_vendor)
                            ? event.daftar_vendor
                            : []
                      }
                      canEdit={
                        event.status === 1 || event.status === true
                      }
                    />
                  )}
                  {activeTab === "wo" && (
                    <DaftarWO
                      clientId={event.id_klien}
                      timWO={
                        Array.isArray(event.wedding_organizer)
                          ? event.wedding_organizer
                          : Array.isArray(event.timWO)
                            ? event.timWO
                            : Array.isArray(event.tim_wo)
                              ? event.tim_wo
                              : []
                      }
                      canEdit={
                        event.status === 1 || event.status === true
                      }
                    />
                  )}
                  {activeTab === "catatan" && (
                    <Catatan
                      notes={
                        Array.isArray(event.daftar_catatan)
                          ? event.daftar_catatan
                          : []
                      }
                      canEdit={
                        event.status === 1 || event.status === true
                      }
                    />
                  )}
                  {activeTab === "ulasan" && (
                    <UlasanPage
                      clientId={event.id_klien}
                      clientName={event.username}
                    />
                  )}
                  {activeTab === "gdrive" && (
                    <GDriveTab event={event} canEdit={event.status === 1 || event.status === true} />
                  )}
                </>
              )}
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
