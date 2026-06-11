import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Heart, Music, Home, Image as ImageIcon, CalendarDays, Tag, MessageCircle, Medal, Users, X, Download, Sparkles, Package, BookOpen, Info, Briefcase, Settings, CalendarPlus, Calendar, Handshake, NotebookPen, LogOut, Share2, Star, FolderOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- SIDEBAR COMPONENT ---
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { nama: string; path: string; state?: any; ikon?: any }[];
  clientName?: string;
  clientUsername?: string;
  isKlienArea?: boolean;
  clientDriveUrl?: string | null;
  onShareClick?: () => void;
}

export function Sidebar({ isOpen, onClose, navLinks, clientName = "Area Klien", clientUsername = "klien", isKlienArea = false, clientDriveUrl = null, onShareClick }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const [activeHash, setActiveHash] = useState(location.hash || '#home');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [sidebarDropdown, setSidebarDropdown] = useState<'Keluarga' | 'Panitia' | null>(null);

  useEffect(() => {
    if (isHome) {
      setActiveHash(location.hash || '#home');
    }
  }, [location.hash, isHome]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('sidebar-open');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('sidebar-open');
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('sidebar-open');
    };
  }, [isOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    onClose();
    if (isHome && path.startsWith('/#')) {
      const hash = path.substring(1);
      e.preventDefault();
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', hash);
        setActiveHash(hash);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200, mass: 0.8 }}
            className="fixed top-0 right-0 bottom-0 w-[220px] sm:w-[260px] bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-stone-100">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <img src="/gambar/source/logo-color.png" alt="Pratama MC Logo" className="w-8 h-8 object-contain flex-shrink-0" loading="lazy" />
                <div className="flex flex-col justify-center min-w-0">
                  <span className="text-xl font-bold tracking-tight leading-none text-stone-900 mt-1">Pratama</span>
                  {isKlienArea && (
                    <span className="text-[9px] font-light tracking-widest text-stone-500 truncate block mt-0.5" title={clientName}>
                      { clientName }
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col py-2 overflow-y-auto scrollbar-hide flex-grow">
              {!isKlienArea && (
                <Link 
                  to={`/${clientUsername}`} 
                  onClick={onClose}
                  className="mx-4 my-2 px-4 py-3 min-h-[64px] flex items-center gap-3 font-bold transition-all bg-gradient-to-br from-[#DCAF43] to-[#C09228] text-white rounded-xl shadow-lg hover:scale-[1.02] relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/20 to-transparent rounded-bl-full pointer-events-none" />
                  <Heart className="w-5 h-5 text-white flex-shrink-0 fill-white shadow-sm" fill="currentColor" />
                  <div className="flex flex-col relative z-10 overflow-hidden w-full">
                    <span className="text-[14px] leading-tight font-extrabold mb-0.5">Wedding</span>
                    <span className="text-[10px] font-semibold opacity-90 tracking-widest text-white/90 truncate">
                      { clientName }
                    </span>
                  </div>
                </Link>
              )}

              {isKlienArea && (
                <button
                  onClick={() => {
                    if (onShareClick) {
                      onShareClick();
                      onClose();
                    } else {
                      const url = `${window.location.origin}/${clientUsername}`;
                      if (navigator.share) {
                        navigator.share({ title: `Halaman Klien: ${clientName}`, url });
                      } else {
                        navigator.clipboard.writeText(url);
                        alert('Link telah disalin ke clipboard!');
                      }
                    }
                  }}
                  className="mx-4 my-2 px-4 py-3 min-h-[64px] flex items-center gap-3 font-bold transition-all bg-gradient-to-br from-[#DCAF43] to-[#C09228] text-white rounded-xl shadow-lg hover:scale-[1.02] relative overflow-hidden group text-left"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/20 to-transparent rounded-bl-full pointer-events-none" />
                  <Share2 className="w-5 h-5 text-white flex-shrink-0 shadow-sm" />
                  <div className="flex flex-col relative z-10 overflow-hidden w-full text-left">
                    <span className="text-[14px] leading-tight font-extrabold mb-0.5">Bagikan</span>
                    <span className="text-[10px] font-semibold opacity-90 tracking-widest text-white/90 truncate">
                      Informasi Wedding
                    </span>
                  </div>
                </button>
              )}

              {navLinks.map((link) => {
                let LinkIcon = link.ikon || Sparkles;
                if (!link.ikon) {
                  if (link.path === '/') LinkIcon = Home;
                  if (link.path === '/portofolio') LinkIcon = ImageIcon;
                  if (link.path === '/paket') LinkIcon = Package;
                  if (link.path.includes('/edukasi')) LinkIcon = BookOpen;
                  if (link.path === '/kontak') LinkIcon = MessageCircle;
                  if (link.path === '/rencana') LinkIcon = CalendarPlus;
                  if (link.path.includes('/musik')) LinkIcon = Music;
                  if (link.nama === 'Ringkasan') LinkIcon = Home;
                  if (link.nama === 'Susunan Acara' || link.nama === 'Acara') LinkIcon = Calendar;
                  if (link.nama === 'Keluarga') LinkIcon = Heart;
                  if (link.nama === 'Daftar Vendor' || link.nama === 'Vendor') LinkIcon = Handshake;
                  if (link.nama === 'Catatan') LinkIcon = NotebookPen;
                  if (link.nama === 'Ulasan') LinkIcon = Star;
                  if (link.nama === 'GDrive') LinkIcon = FolderOpen;
                }
                
                return (
                  <React.Fragment key={link.nama}>
                    {isKlienArea && (link.nama === 'Keluarga' || link.nama === 'Panitia') ? (
                      <div className="flex flex-col">
                        <button 
                          onClick={() => {
                            if (sidebarDropdown === link.nama) setSidebarDropdown(null);
                            else setSidebarDropdown(link.nama as 'Keluarga' | 'Panitia');
                          }}
                          className="px-5 py-3.5 flex items-center justify-between font-medium transition-colors text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                        >
                          <div className="flex items-center gap-3.5">
                            <LinkIcon className="w-5 h-5 text-stone-400" />
                            {link.nama}
                          </div>
                          <motion.div
                            animate={{ rotate: sidebarDropdown === link.nama ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </motion.div>
                        </button>
                        
                        <AnimatePresence>
                          {sidebarDropdown === link.nama && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden bg-stone-50/50 flex flex-col relative py-2"
                            >
                              <div className="absolute left-[31px] top-4 bottom-5 w-px bg-stone-300"></div>
                              
                              {link.nama === 'Keluarga' && (
                                <>
                                  <Link to={`${link.path}#pengantin`} onClick={(e) => handleLinkClick(e, `${link.path}#pengantin`)} className="relative px-5 py-2.5 pl-[52px] text-sm font-medium text-stone-600 hover:text-[#DCAF43] transition-colors flex items-center group">
                                    <div className="absolute left-[28.5px] w-1.5 h-1.5 rounded-full bg-stone-300 ring-[4px] ring-stone-50 group-hover:bg-[#DCAF43] transition-colors z-10"></div>
                                    Pengantin
                                  </Link>
                                  <Link to={`${link.path}#keluarga-inti`} onClick={(e) => handleLinkClick(e, `${link.path}#keluarga-inti`)} className="relative px-5 py-2.5 pl-[52px] text-sm font-medium text-stone-600 hover:text-[#DCAF43] transition-colors flex items-center group">
                                    <div className="absolute left-[28.5px] w-1.5 h-1.5 rounded-full bg-stone-300 ring-[4px] ring-stone-50 group-hover:bg-[#DCAF43] transition-colors z-10"></div>
                                    Keluarga Inti
                                  </Link>
                                  <Link to={`${link.path}#pendamping`} onClick={(e) => handleLinkClick(e, `${link.path}#pendamping`)} className="relative px-5 py-2.5 pl-[52px] text-sm font-medium text-stone-600 hover:text-[#DCAF43] transition-colors flex items-center group">
                                    <div className="absolute left-[28.5px] w-1.5 h-1.5 rounded-full bg-stone-300 ring-[4px] ring-stone-50 group-hover:bg-[#DCAF43] transition-colors z-10"></div>
                                    Pendamping
                                  </Link>
                                  <Link to={`${link.path}#tamu-khusus`} onClick={(e) => handleLinkClick(e, `${link.path}#tamu-khusus`)} className="relative px-5 py-2.5 pl-[52px] text-sm font-medium text-stone-600 hover:text-[#DCAF43] transition-colors flex items-center group">
                                    <div className="absolute left-[28.5px] w-1.5 h-1.5 rounded-full bg-stone-300 ring-[4px] ring-stone-50 group-hover:bg-[#DCAF43] transition-colors z-10"></div>
                                    Tamu Khusus
                                  </Link>
                                </>
                              )}
                              {link.nama === 'Panitia' && (
                                <>
                                  <Link to={`${link.path}#panitia-acara`} onClick={(e) => handleLinkClick(e, `${link.path}#panitia-acara`)} className="relative px-5 py-2.5 pl-[52px] text-sm font-medium text-stone-600 hover:text-[#DCAF43] transition-colors flex items-center group">
                                    <div className="absolute left-[28.5px] w-1.5 h-1.5 rounded-full bg-stone-300 ring-[4px] ring-stone-50 group-hover:bg-[#DCAF43] transition-colors z-10"></div>
                                    Panitia Acara
                                  </Link>
                                  <Link to={`${link.path}#vendor`} onClick={(e) => handleLinkClick(e, `${link.path}#vendor`)} className="relative px-5 py-2.5 pl-[52px] text-sm font-medium text-stone-600 hover:text-[#DCAF43] transition-colors flex items-center group">
                                    <div className="absolute left-[28.5px] w-1.5 h-1.5 rounded-full bg-stone-300 ring-[4px] ring-stone-50 group-hover:bg-[#DCAF43] transition-colors z-10"></div>
                                    Vendor
                                  </Link>
                                  <Link to={`${link.path}#tim-wo`} onClick={(e) => handleLinkClick(e, `${link.path}#tim-wo`)} className="relative px-5 py-2.5 pl-[52px] text-sm font-medium text-stone-600 hover:text-[#DCAF43] transition-colors flex items-center group">
                                    <div className="absolute left-[28.5px] w-1.5 h-1.5 rounded-full bg-stone-300 ring-[4px] ring-stone-50 group-hover:bg-[#DCAF43] transition-colors z-10"></div>
                                    Tim Wo
                                  </Link>
                                </>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link 
                        to={link.path} 
                        state={link.state}
                        onClick={(e) => handleLinkClick(e, link.path)}
                        className="px-5 py-3.5 flex items-center gap-3.5 font-medium transition-colors text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                      >
                        {link.nama === 'GDrive' ? (
                          <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" alt="Google Drive" className="w-5 h-5 object-contain opacity-80" />
                        ) : (
                          <LinkIcon className="w-5 h-5 text-stone-400" />
                        )}
                        {link.nama}
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            
            <div className="mt-auto p-6 flex flex-col gap-4 sticky bottom-0 bg-white border-t border-stone-100">
              {isKlienArea && (
                <button 
                  onClick={() => {
                    localStorage.removeItem(`auth_${clientUsername}`);
                    sessionStorage.removeItem(`auth_${clientUsername}`);
                    sessionStorage.removeItem(`welcomeShown_klien_${clientUsername}_v2`);
                    sessionStorage.removeItem('welcomeShown_mc_v2');
                    onClose();
                    navigate('/');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 rounded-xl font-medium hover:bg-red-50 transition-colors"
                >
                  Logout
                  <LogOut className="w-4 h-4" />
                </button>
              )}
              {deferredPrompt && (
                <button 
                  onClick={handleInstallClick}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-stone-600 rounded-xl font-medium hover:bg-stone-50 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Install Apps
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// --- NAVIGASI COMPONENT ---
export function NavigasiPublic() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const currentPath = location.pathname;
    const prevPath = prevPathRef.current;

    const getBasePath = (path: string) => {
      const parts = path.split("/").filter(Boolean);
      const musikIdx = parts.indexOf("musik");
      return musikIdx !== -1 ? "/" + parts.slice(0, musikIdx).join("/") : path;
    };

    const isOnlyMusicChange = getBasePath(currentPath) === getBasePath(prevPath);
    const isPaketTabChange = prevPath.startsWith("/paket") && currentPath.startsWith("/paket");

    prevPathRef.current = currentPath;

    if ((isOnlyMusicChange && currentPath !== prevPath) || (isPaketTabChange && currentPath !== prevPath)) {
      return;
    }

    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    setIsMobileMenuOpen(false);
    if (isHome) {
      e.preventDefault();
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", hash);
      }
    }
  };

  const alwaysDarkNav =
    ["/portofolio", "/kontak", "/rencana", "/edukasi", "/vendor"].includes(location.pathname) ||
    location.pathname.startsWith("/musik") ||
    location.pathname.startsWith("/paket");
  const showNavBg = isScrolled || alwaysDarkNav;

  const forceDarkText = showNavBg || isHome;
  const textColorClass = forceDarkText ? "text-stone-900" : "text-white";
  const linkHoverClass = forceDarkText ? "hover:text-stone-500" : "hover:text-stone-300";
  const logoPath = forceDarkText ? "/gambar/source/logo-color.png" : "/gambar/source/logo-white.png";

  const navLinks = [
    { nama: "Beranda", path: "/" },
    { nama: "Portofolio", path: "/portofolio" },
    { nama: "Paket MC", path: "/paket" },
    { nama: "Vendor", path: "/vendor" },
    { nama: "Edukasi", path: "/edukasi" },
    { nama: "Musik", path: "/musik" },
    { nama: "Kontak", path: "/kontak" },
    { nama: "Rencana", path: "/rencana" },
  ];

  const desktopNavLinks = [
    { nama: "Beranda", path: "/" },
    { nama: "Portofolio", path: "/portofolio" },
    { nama: "Paket MC", path: "/paket" },
    { nama: "Vendor", path: "/vendor" },
    { nama: "Edukasi", path: "/edukasi" },
    { nama: "Musik", path: "/musik" },
    { nama: "Kontak", path: "/kontak" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showNavBg
            ? "bg-white/90 backdrop-blur-md border-b border-stone-200 py-0 shadow-sm"
            : "bg-transparent border-transparent pt-2 pb-2 md:py-2 -mt-2 md:mt-0"
        } ${textColorClass}`}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex h-20 items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-1.5 shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={logoPath} alt="Pratama MC Logo" className="w-8 h-8 object-contain" loading="lazy" />
            <div className="flex flex-col justify-center mt-1.5">
              <span className="text-xl font-bold tracking-tight leading-none translate-y-0.5">Pratama</span>
              <span className="text-[9px] font-light tracking-widest opacity-80 uppercase">Master Of Ceremony</span>
            </div>
          </Link>

          <div className="hidden md:flex flex-1 items-center justify-end gap-3 lg:gap-4 text-[13px] font-medium mt-1.5 ml-4 xl:ml-8 mr-4">
            {desktopNavLinks.map((link) => {
              const isHashLink = link.path.startsWith("/#");
              const hash = isHashLink ? link.path.substring(1) : "";
              return (
                <Link
                  key={link.nama}
                  to={link.path}
                  onClick={(e) => (isHashLink ? handleLinkClick(e, hash) : setIsMobileMenuOpen(false))}
                  className={`transition-colors whitespace-nowrap ${linkHoverClass}`}
                >
                  {link.nama}
                </Link>
              );
            })}
            <Link to="/rencana" className={`transition-colors whitespace-nowrap ${linkHoverClass}`}>
              Rencana
            </Link>
          </div>

          <div className="hidden md:flex items-center mt-1.5 shrink-0">
            <Link
              to="/klien"
              className={`flex items-center gap-1.5 pr-4 transition-colors text-[13px] font-medium ${
                showNavBg || isHome ? "text-stone-500 hover:text-stone-900" : "text-stone-300 hover:text-white"
              }`}
            >
              <Heart className="w-4 h-4" />
              Area Klien
            </Link>
          </div>

          <div className="flex items-center gap-1 md:hidden -mr-2 mt-1.5">
            <Link to="/musik" className="p-2 text-inherit" title="Music Player">
              <Music className="w-5 h-5" />
            </Link>
            <button className="p-2" onClick={() => setIsMobileMenuOpen(true)} title="Menu">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navLinks={navLinks}
        clientName="Area Klien"
        clientUsername="klien"
        isKlienArea={false}
      />
    </>
  );
}

// --- BOTTOM NAV COMPONENT ---
export function BottomNavPublic() {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { nama: "Beranda", path: "/", ikon: Home },
    { nama: "Paket", path: "/paket", ikon: Tag },
    {
      nama: "Rencana",
      path: "/rencana",
      ikon: CalendarDays,
      isCenter: true,
    },
    { nama: "Karya", path: "/portofolio", ikon: Medal },
    { nama: "Klien", path: "/klien", ikon: Users },
  ];

  return (
    <div className="bottom-nav md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-200/60 pb-safe">
      <div className="flex items-center justify-around h-[68px] px-2 relative">
        {navItems.map((item) => {
          const Icon = item.ikon;
          const isActive =
            item.path === "/" ? path === "/" : path.startsWith(item.path);

          if (item.isCenter) {
            return (
              <div
                key={item.nama}
                className="relative flex-1 h-full flex flex-col items-center justify-start"
              >
                <Link
                  to={item.path}
                  className="absolute -top-6 flex flex-col items-center justify-center group focus:outline-none focus:ring-0"
                >
                  <div className="absolute inset-0 bg-[#DCAF43] rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative flex items-center justify-center w-[58px] h-[58px] bg-gradient-to-br from-[#DCAF43] to-[#C09228] text-white rounded-full shadow-lg border border-[#DCAF43]/20 transform transition-transform duration-300 group-active:scale-95 group-hover:-translate-y-1">
                    <Icon className="w-6 h-6" />
                  </div>
                </Link>
                <span
                  className={`absolute bottom-2.5 text-[10px] transition-colors ${isActive ? "font-semibold text-[#C09228]" : "font-medium text-stone-500"}`}
                >
                  {item.nama}
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.nama}
              to={item.path}
              className={`relative flex-1 flex flex-col items-center justify-center h-full space-y-1.5 transition-colors focus:outline-none focus:ring-0 ${
                isActive
                  ? "text-[#C09228]"
                  : "text-stone-400 hover:text-[#C09228]"
              }`}
            >
              <div className="relative flex flex-col items-center justify-center h-full pt-1 pb-1">
                <Icon
                  className={`w-[22px] h-[22px] transition-transform duration-300 ${isActive ? "scale-110" : ""}`}
                  strokeWidth={isActive ? 2.2 : 2}
                />
                <span
                  className={`text-[10px] leading-none mt-1.5 transition-all duration-300 ${isActive ? "font-semibold text-[#C09228]" : "font-medium text-stone-500"}`}
                >
                  {item.nama}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="bottomNavDot"
                    className="absolute -bottom-1 w-[5px] h-[5px] bg-[#C09228] rounded-full shadow-sm"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
