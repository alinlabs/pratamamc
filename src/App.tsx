/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import { AnimatePresence } from 'motion/react';
import { invalidateCache } from './lib/api';
import { NavigasiPublic, BottomNavPublic } from './pages/public/components/navigasi-public';
import FooterPublic from './pages/public/components/footer-public';
import WelcomePopup from './components/modal-welcome';
import NotFound from './components/error-notfound';
import NetworkError from './components/error-network';
import SplashScreen from './components/screen-splash';
import PageLoader from './components/page-loader';

// Lazy loaded page components
const MCContainer = lazy(() => import('./pages/public/beranda'));
const KlienContainer = lazy(() => import('./pages/klien/components/container-klien'));
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));
const MusikPage = lazy(() => import('./pages/public/musik'));
const StandaloneFormContainer = lazy(() => 
  import('./pages/klien/components/container-form').then(m => ({ default: m.StandaloneFormContainer }))
);
const NewPengantinForm = lazy(() => import('./pages/klien/pengantin/form-new-pengantin'));
const Rencana = lazy(() => import('./pages/public/rencana'));
const PortofolioPage = lazy(() => import('./pages/public/portofolio'));
const PaketPage = lazy(() => import('./pages/public/paket'));
const VendorPage = lazy(() => import('./pages/public/vendor'));
const KontakPage = lazy(() => import('./pages/public/kontak'));
const EdukasiPage = lazy(() => import('./pages/public/edukasi'));

function KlienRouteProxy({ isFormRoute = false }: { isFormRoute?: boolean }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <KlienContainer isFormRoute={isFormRoute} />
    </Suspense>
  );
}

function AppContent() {

  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isKlienAreaByState = location.state?.fromClient === true;

  const isMCRoute = ['/', '/portofolio', '/kontak', '/rencana', '/edukasi', '/klien'].includes(location.pathname) || location.pathname.startsWith('/musik') || location.pathname.startsWith('/paket') || location.pathname.startsWith('/vendor');
  
  const isKlienRoute = !isMCRoute && !isAdmin;

  useEffect(() => {
    const clearCacheEvent = () => invalidateCache("");
    // Clear cache upon unload
    window.addEventListener('beforeunload', clearCacheEvent);
    
    // Clear cache upon reactivating window
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        invalidateCache("");
      } else {
        invalidateCache("");
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('beforeunload', clearCacheEvent);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <NetworkError />
      {!isAdmin && <WelcomePopup />}
      {(!isAdmin && !isKlienRoute) && <NavigasiPublic />}
      <main className={`flex-grow ${!isAdmin && isMCRoute && !isKlienAreaByState ? 'pb-24' : 'pb-0'} md:pb-0`}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<MCContainer />} />
            <Route path="/musik/*" element={<MusikPage />} />
            <Route path="/portofolio" element={<PortofolioPage />} />
            <Route path="/paket" element={<PaketPage />} />
            <Route path="/vendor" element={<VendorPage />} />
            <Route path="/kontak" element={<KontakPage />} />
            <Route path="/rencana" element={<Rencana />} />
            <Route path="/edukasi" element={<EdukasiPage />} />
            <Route path="/new" element={<NewPengantinForm />} />
            <Route path="/share/acara" element={<StandaloneFormContainer type="acara" />} />
            <Route path="/share/vendor" element={<StandaloneFormContainer type="vendor" />} />
            <Route path="/share/pendamping" element={<StandaloneFormContainer type="pendamping" />} />
            <Route path="/share/wo" element={<StandaloneFormContainer type="wo" />} />
            <Route path="/share/panitia" element={<StandaloneFormContainer type="panitia" />} />
            <Route path="/share/keluarga" element={<StandaloneFormContainer type="keluarga" />} />
            <Route path="/share/tamu" element={<StandaloneFormContainer type="tamu" />} />
            <Route path="/share/gdrive" element={<StandaloneFormContainer type="gdrive" />} />
            <Route path="/share/catatan" element={<StandaloneFormContainer type="catatan" />} />
            <Route path="/share/ringkasan" element={<StandaloneFormContainer type="ringkasan" />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/:username/edit" element={<KlienRouteProxy isFormRoute={true} />} />
            <Route path="/:username/:tab/edit" element={<KlienRouteProxy isFormRoute={true} />} />
            <Route path="/:username" element={<KlienRouteProxy />} />
            <Route path="/:username/:tab" element={<KlienRouteProxy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {(!isAdmin && !isKlienRoute) && <FooterPublic />}
      {(!isAdmin && isMCRoute && !isKlienAreaByState && !isKlienRoute) && <BottomNavPublic />}
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('splashShown');
  });

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('splashShown', 'true');
  };

  return (
    <Router>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>
      <AppContent />
    </Router>
  );
}
