import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart, Share2, Link as LinkIcon, QrCode, Maximize, X, ExternalLink, LogOut, Menu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { QRCodeCanvas } from "qrcode.react";
import { Sidebar } from "../../public/components/navigasi-public";

interface NavigasiKlienProps {
  clientName: string;
  clientUsername: string;
  clientDriveUrl?: string | null;
  activeTab: string;
  tabItems: any[];
  onNavigate: (tabId: string) => void;
  isFormRoute?: boolean;
}

export default function NavigasiKlien({
  clientName,
  clientUsername,
  clientDriveUrl,
  activeTab,
  tabItems,
  onNavigate,
  isFormRoute = false,
}: NavigasiKlienProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bottomNavDropdown, setBottomNavDropdown] = useState<'keluarga' | 'panitia' | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".bottom-nav-dropdown-container")) {
        setBottomNavDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleSubNavClick = (tabId: string, hash: string) => {
    setBottomNavDropdown(null);
    onNavigate(tabId);
    navigate(`/${clientUsername}/${tabId}`);
    setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 200);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".share-menu-container") && showShareMenu) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showShareMenu]);

  const isFormUrlRoute = location.pathname.endsWith("/edit");
  const isNewParam = new URLSearchParams(location.search).has("new");
  const isStandaloneNew = location.pathname === "/new";

  const currentTabMatch = location.pathname.match(/^\/[^/]+\/([^/]+)/);
  const currentTab = currentTabMatch ? currentTabMatch[1] : null;

  const currentUsernameMatch = location.pathname.match(/^\/([^/]+)/);
  const currentUsername = currentUsernameMatch ? decodeURIComponent(currentUsernameMatch[1]) : null;

  const isMainClientNew =
    isNewParam &&
    !["vendor", "wo", "pendamping"].includes(currentTab || "") &&
    !["vendor", "wo", "pendamping"].includes(currentUsername || "") &&
    !isStandaloneNew;

  const isNewClientForm = isNewParam || isStandaloneNew;

  const handleShareLink = () => {
    try {
      if (navigator.share) {
        navigator.share({ title: document.title, url: window.location.href });
      } else {
        copyToClipboard(window.location.href);
      }
    } catch (e) {}
    setShowShareMenu(false);
  };

  const handleShareQR = () => {
    try {
      const canvas = document.getElementById("qr-canvas-hidden") as HTMLCanvasElement;
      if (canvas) {
        const dataUrl = canvas.toDataURL("image/png");
        fetch(dataUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], "pratama_mc_qr.png", { type: "image/png" });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              navigator.share({
                title: document.title,
                text: "Silakan pindai barcode ini untuk akses pengisian form",
                url: window.location.href,
                files: [file],
              }).catch(() => {});
            } else {
              const a = document.createElement("a");
              a.href = dataUrl;
              a.download = "pratama_mc_qr.png";
              a.click();
              if (navigator.share) {
                navigator.share({
                  title: document.title,
                  text: "Silakan pindai barcode ini untuk akses pengisian form",
                  url: window.location.href,
                });
              }
            }
          });
      }
    } catch (e) {}
    setShowShareMenu(false);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("Link disalin!");
    setShowShareMenu(false);
  };

  const forceDarkText = isScrolled || isNewClientForm;
  const textColorClass = forceDarkText ? "text-stone-900" : "text-white";
  const logoPath = forceDarkText ? "/gambar/source/logo-color.png" : "/gambar/source/logo-white.png";

  const sidebarNavLinks = tabItems.map((item) => ({
    nama: item.label,
    path: `/${clientUsername}/${item.id}`,
    ikon: item.icon,
  }));

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md border-b border-stone-200 py-0 shadow-sm"
            : "bg-transparent border-transparent pt-0.5 pb-2 md:py-2"
        } ${textColorClass}`}
      >
        <div className={`max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between gap-6 transition-all duration-300 ${
          isScrolled ? "h-20" : "h-14 md:h-20"
        }`}>
          <Link to="/" className="flex items-center gap-1.5 shrink-0">
            <img src={logoPath} alt="Pratama MC Logo" className="w-8 h-8 object-contain" loading="lazy" />
            <div className="flex flex-col justify-center mt-1.5">
              <span className="text-xl font-bold tracking-tight leading-none translate-y-0.5">Pratama</span>
              <span className="text-[9px] font-light tracking-widest opacity-80">{clientName}</span>
            </div>
          </Link>

          {isNewClientForm && (
            <div className="relative share-menu-container flex-shrink-0">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className={`p-2 rounded-full backdrop-blur-sm transition-all focus:outline-none flex items-center justify-center ${
                  forceDarkText ? "bg-stone-100 hover:bg-stone-200 text-stone-700" : "bg-white/10 hover:bg-white/20 text-white"
                }`}
                title="Bagikan formulir"
              >
                <Share2 className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-12 right-0 w-max min-w-[240px] bg-white rounded-xl shadow-xl border border-stone-100 p-2 z-50 origin-top-right"
                  >
                    <div className="text-xs font-semibold text-stone-400 px-3 py-2 uppercase tracking-widest pl-1">Bagikan Halaman Ini</div>
                    <button onClick={handleShareLink} className="w-full text-left px-3 py-2.5 hover:bg-stone-50 rounded-lg text-sm text-stone-700 font-medium flex items-center gap-2 transition-colors">
                      <LinkIcon className="w-4 h-4 text-stone-500" />
                      Bagikan Link
                    </button>
                    <button onClick={handleShareQR} className="w-full text-left px-3 py-2.5 hover:bg-stone-50 rounded-lg text-sm text-stone-700 font-medium flex items-center gap-2 transition-colors">
                      <QrCode className="w-4 h-4 text-stone-500" />
                      Bagikan QR saja
                    </button>
                    <button
                      onClick={() => {
                        setShowQRModal(true);
                        setShowShareMenu(false);
                      }}
                      className="w-full text-left px-3 py-2.5 hover:bg-stone-50 rounded-lg text-sm text-stone-700 font-medium flex items-center gap-2 transition-colors"
                    >
                      <Maximize className="w-4 h-4 text-stone-500" />
                      Tampilkan QR
                    </button>

                    {isMainClientNew && (
                      <>
                        <div className="h-px w-full bg-stone-100 my-1"></div>
                        <div className="text-xs font-semibold text-stone-400 px-2 py-2 uppercase tracking-widest mt-1">Form Lainnya</div>
                        {[
                          { path: "vendor", label: "Form Vendor" },
                          { path: "wo", label: "Form Wedding Organizer" },
                          { path: "pendamping", label: "Form Pendamping" },
                        ].map((form) => (
                          <div key={form.path} className="flex items-center justify-between hover:bg-stone-50 rounded-lg transition-colors group">
                            <button
                              onClick={() => {
                                const url = new URL(window.location.href);
                                copyToClipboard(`${url.origin}${url.pathname.replace(/\/$/, "")}/${form.path}?new`);
                              }}
                              className="flex-1 text-left px-2 py-2.5 text-sm text-stone-700 font-medium focus:outline-none focus:ring-0"
                            >
                              {form.label}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowShareMenu(false);
                                navigate(`${location.pathname.replace(/\/$/, "")}/${form.path}?new`);
                              }}
                              className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-200 transition-colors rounded-md ml-2 mr-1"
                              title={`Buka ${form.label}`}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {!isFormRoute && (
            <div className="hidden md:flex flex-1 items-center justify-end mt-1.5 shrink-0 gap-6 ml-auto">
              <div className="flex items-center gap-6 mr-2">
                {tabItems.map((tabItem) => (
                  <button
                    key={tabItem.id}
                    onClick={() => {
                      onNavigate(tabItem.id);
                      navigate(`/${clientUsername}/${tabItem.id}`);
                    }}
                    className={`text-sm tracking-wide font-medium transition-all cursor-pointer ${
                      activeTab === tabItem.id 
                        ? (forceDarkText ? 'text-stone-900 font-bold' : 'text-white font-bold')
                        : (forceDarkText ? 'text-stone-500 hover:text-stone-800 hover:scale-105' : 'text-white/70 hover:text-white hover:scale-105')
                    }`}
                  >
                    {tabItem.label}
                  </button>
                ))}
              </div>

              <div className={`w-px h-5 mx-2 bg-stone-300 ${forceDarkText ? 'bg-stone-200' : 'bg-white/20'}`} />

              <button
                onClick={() => {
                  localStorage.removeItem(`auth_${clientUsername}`);
                  sessionStorage.removeItem(`auth_${clientUsername}`);
                  sessionStorage.removeItem(`welcomeShown_klien_${clientUsername}_v2`);
                  sessionStorage.removeItem("welcomeShown_mc_v2");
                  navigate("/");
                }}
                className={`text-[13px] transition-colors font-semibold flex items-center gap-1.5 cursor-pointer hover:scale-105 ${
                  isScrolled ? "text-red-500 hover:text-red-600" : "text-white/90 hover:text-white"
                }`}
              >
                Logout
                <LogOut className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          )}

          {!isFormRoute && (
            <div className="flex items-center gap-2 md:hidden -mr-2 mt-1.5 bg-inherit rounded-lg px-2">
              <button 
                className="p-2 text-inherit" 
                onClick={() => setIsMobileMenuOpen(true)} 
                title="Menu Navigasi"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </nav>

      <div style={{ display: "none" }}>
        <QRCodeCanvas
          id="qr-canvas-hidden"
          value={window.location.href}
          size={500}
          level={"H"}
          imageSettings={{
            src: "/gambar/source/logo-color.png",
            x: undefined,
            y: undefined,
            height: 100,
            width: 100,
            excavate: true,
          }}
        />
      </div>

      <AnimatePresence>
        {showQRModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col justify-end md:justify-center p-0 md:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowQRModal(false);
            }}
          >
            <motion.div
              initial={{ y: "100%", scale: 1 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: "100%", scale: 1 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="bg-white p-6 md:p-8 pt-8 md:pt-8 pb-10 md:pb-8 rounded-t-[2rem] md:rounded-3xl shadow-2xl flex flex-col items-center w-full md:max-w-sm md:mx-auto relative md:!y-0 md:!scale-95 md:animate-[none]"
            >
              <div className="w-12 h-1.5 bg-stone-200 rounded-full md:hidden absolute top-3 left-1/2 -translate-x-1/2"></div>
              <button
                onClick={() => setShowQRModal(false)}
                className="absolute top-4 md:top-4 right-4 p-2 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-stone-800 mb-2 mt-2">Pindai QR Form</h3>
              <p className="text-sm text-stone-500 mb-6 md:mb-8 text-center leading-relaxed px-2">
                Gunakan perangkat lain atau kamera HP untuk memindai QR ini supaya form langsung terbuka di perangkat tersebut.
              </p>
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-100 flex items-center justify-center mb-2" style={{ width: 260, height: 260 }}>
                <QRCodeCanvas
                  id="qr-canvas-modal"
                  value={window.location.href}
                  size={230}
                  level={"H"}
                  imageSettings={{
                    src: "/gambar/source/logo-color.png",
                    height: 46,
                    width: 46,
                    excavate: true,
                  }}
                />
              </div>
              <div className="mt-8 flex gap-3 w-full max-w-[260px] md:max-w-full">
                <button
                  onClick={handleShareLink}
                  className="flex-1 py-3.5 md:py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <LinkIcon className="w-4 h-4" /> Link
                </button>
                <button
                  onClick={handleShareQR}
                  className="flex-1 py-3.5 md:py-3 bg-[#DCAF43] hover:bg-[#c99f35] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-[#DCAF43]/20"
                >
                  <QrCode className="w-4 h-4" /> Share
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isFormRoute && (
        <div className="md:hidden bottom-nav-dropdown-container fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-30 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-start sm:justify-center items-center px-1 py-1 overflow-x-auto custom-scrollbar min-w-max w-full gap-1 relative z-30 bg-white">
            {tabItems.filter(t => ['ringkasan', 'acara', 'keluarga', 'panitia', 'catatan'].includes(t.id)).map((tabItem) => (
              <button
                key={tabItem.id}
                type="button"
                onClick={() => {
                  setBottomNavDropdown(null);
                  onNavigate(tabItem.id);
                  navigate(`/${clientUsername}/${tabItem.id}`);
                }}
                className={`flex flex-col items-center justify-center w-[20%] h-14 transition-colors ${
                  activeTab === tabItem.id ? "text-[#DCAF43]" : "text-stone-400"
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-all ${activeTab === tabItem.id ? "bg-[#DCAF43]/15 text-[#DCAF43]" : "text-stone-400"}`}>
                  <tabItem.icon className="w-5 h-5 mx-auto" strokeWidth={activeTab === tabItem.id ? 2.5 : 2} />
                </div>
                <span
                  className={`text-[10px] mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center ${
                    activeTab === tabItem.id ? "font-semibold text-[#DCAF43]" : "font-normal text-stone-500"
                  }`}
                >
                  {tabItem.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navLinks={sidebarNavLinks}
        clientName={clientName}
        clientUsername={clientUsername}
        isKlienArea={true}
        clientDriveUrl={clientDriveUrl || undefined}
        onShareClick={() => setShowQRModal(true)}
      />
    </>
  );
}
