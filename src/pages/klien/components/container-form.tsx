import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AcaraForm from '../../klien/acara/form-acara';
import RingkasanForm from '../../klien/ringkasan/form-ringkasan';
import PengantinForm from '../../klien/pengantin/form-pengantin';
import KeluargaForm from '../../klien/keluarga/form-keluarga';
import VendorForm from '../../klien/vendor/form-vendor';
import CatatanForm from '../../klien/catatan/form-catatan';
import WOForm from '../../klien/wo/form-wo';
import PanitiaForm from '../../klien/panitia/form-panitia';
import PendampingForm from '../../klien/pendamping/form-pendamping';
import TamuForm from '../../klien/tamu/form-tamu';
import GDriveForm from '../../klien/gdrive/form-gdrive';
import UlasanPage from '../../klien/ulasan';

import { getKlienAkun, getKlienVendor, getKlienKeluarga, getKlienCatatan, getKlienAcara } from '../../../lib/api';
import ComboBox from '../../../components/input-combobox';
import ShareableVendorForm from '../../klien/vendor/form-new-vendor';
import ShareablePendampingForm from '../../klien/pendamping/form-new-pendamping';
import ShareableWOForm from '../../klien/wo/form-new-wo';
import ShareablePanitiaForm from '../../klien/panitia/form-new-panitia';
import ShareableKeluargaForm from '../../klien/keluarga/form-new-keluarga';
import ShareableCatatanForm from '../../klien/catatan/form-new-catatan';
import ShareableRingkasanForm from '../../klien/ringkasan/form-new-ringkasan';
import ShareableTamuForm from '../../klien/tamu/form-new-tamu';
import ShareableAcaraForm from '../../klien/acara/form-new-acara';
import ShareableGDriveForm from '../../klien/gdrive/form-new-gdrive';
import LoadingSpinner from '../../../components/screen-loading';

export function FormContainer({ eventData, isFormRoute = false, initialTab }: { eventData: any, isFormRoute?: boolean, initialTab?: string }) {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [initialTab]);

  const handleClose = () => {
    if (eventData?.username) {
      if (initialTab === 'pengantin' || initialTab === 'pendamping' || initialTab === 'tamu') {
        navigate(`/${eventData.username}/keluarga`);
      } else if (initialTab === 'pengisi_acara' || initialTab === 'vendor' || initialTab === 'wo' || initialTab === 'panitia') {
        navigate(`/${eventData.username}/panitia`);
      } else if (initialTab) {
        navigate(`/${eventData.username}/${initialTab}`);
      } else {
        navigate(`/${eventData.username}`);
      }
    } else {
      navigate('/');
    }
  };

  if (!isFormRoute) return null;

  const renderForm = () => {
    switch (initialTab) {
      case 'acara':
        return <AcaraForm eventData={eventData} onClose={handleClose} />;
      case 'keluarga':
        return <KeluargaForm eventData={eventData} onClose={handleClose} initialActiveTab="Keluarga" />;
      case 'pengantin':
        return <PengantinForm eventData={eventData} onClose={handleClose} />;
      case 'panitia':
        return <PanitiaForm eventData={eventData} onClose={handleClose} initialActiveTab="Panitia" />;
      case 'pengisi_acara':
        return <PanitiaForm eventData={eventData} onClose={handleClose} initialActiveTab="Pengisi Acara" />;
      case 'pendamping':
        return <PendampingForm eventData={eventData} onClose={handleClose} />;
      case 'tamu':
        return <TamuForm eventData={eventData} onClose={handleClose} />;
      case 'vendor':
        return <VendorForm eventData={eventData} onClose={handleClose} />;
      case 'wo':
        return <WOForm eventData={eventData} onClose={handleClose} />;
      case 'catatan':
        return <CatatanForm eventData={eventData} onClose={handleClose} />;
      case 'gdrive':
        return <GDriveForm eventData={eventData} onClose={handleClose} />;
      case 'ulasan':
        return <UlasanPage clientId={eventData.id_klien} clientName={eventData.username} />;
      case 'ringkasan':
      default:
        return <RingkasanForm eventData={eventData} onClose={handleClose} />;
    }
  };

  return (
    <div className="w-full relative">
      {renderForm()}
    </div>
  );
}

export function StandaloneFormContainer({ type }: { type: 'vendor' | 'pendamping' | 'wo' | 'panitia' | 'keluarga' | 'catatan' | 'ringkasan' | 'tamu' | 'gdrive' | 'acara' }) {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [eventLoading, setEventLoading] = useState(false);

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);

    // Explicitly set metatag as requested
    const image = "https://pratamamc.my.id/gambar/source/metatag.png";
    const updateMetaTag = (selector: string, attribute: string, value: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(selector.match(/\[([a-z]+)="[^"]+"\]/)?.[1] || 'property', selector.match(/"([^"]+)"/)?.[1] || '');
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    updateMetaTag('meta[property="og:image"]', 'content', image);
    updateMetaTag('meta[property="twitter:image"]', 'content', image);
    
    getKlienAkun().then(data => {
      setClients(data || []);
      setLoading(false);
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedClientId) {
      setEventData(null);
      return;
    }
    
    setEventLoading(true);
    const client = clients.find(c => c.id_klien === selectedClientId || c.username === selectedClientId);
    
    if (client) {
      const fetchPromises = [];
      
      if (type === 'vendor' || type === 'wo') {
        fetchPromises.push(getKlienVendor(client.id_klien));
      } else if (type === 'pendamping' || type === 'panitia' || type === 'keluarga' || type === 'tamu') {
        fetchPromises.push(getKlienKeluarga(client.id_klien));
      } else if (type === 'catatan') {
        fetchPromises.push(getKlienCatatan(client.id_klien));
      } else if (type === 'acara') {
        fetchPromises.push(getKlienAcara(client.id_klien));
      }
      
      Promise.all(fetchPromises)
        .then(results => {
          let updatedEvent = { ...client };
          
          if (type === 'vendor' || type === 'wo') {
            const vendorData = results[0]?.[0] || {};
            updatedEvent.vendor = vendorData.vendor || updatedEvent.vendor || [];
            updatedEvent.wedding_organizer = vendorData.wedding_organizer || updatedEvent.wedding_organizer || [];
            updatedEvent.daftar_vendor = vendorData.daftar_vendor || updatedEvent.daftar_vendor || [];
            updatedEvent.timWO = vendorData.timWO || updatedEvent.timWO || [];
          } else if (type === 'pendamping' || type === 'panitia' || type === 'keluarga' || type === 'tamu') {
            const keluargaData = results[0]?.[0] || {};
            updatedEvent.pendamping = keluargaData.pendamping || updatedEvent.pendamping || [];
            updatedEvent.keluarga_inti = keluargaData.keluarga_inti || updatedEvent.keluarga_inti || [];
            updatedEvent.panitia_keluarga = keluargaData.panitia_keluarga || updatedEvent.panitia_keluarga || [];
            updatedEvent.tamu = keluargaData.tamu || updatedEvent.tamu || [];
            updatedEvent.pengisi_acara = keluargaData.pengisi_acara || updatedEvent.pengisi_acara || [];
          } else if (type === 'catatan') {
            const catatanData = results[0]?.[0] || {};
            updatedEvent.daftar_catatan = Array.isArray(catatanData) ? catatanData : (catatanData.daftar_catatan || []);
          } else if (type === 'acara') {
            const acaraData = results[0]?.[0] || {};
            updatedEvent.susunan_acara = acaraData.susunan_acara || [];
          }
          
          setEventData(updatedEvent);
          setEventLoading(false);
        })
        .catch(e => {
          console.error(e);
          setEventData(client); 
          setEventLoading(false);
        });
    } else {
      setEventLoading(false);
    }
  }, [selectedClientId, clients, type]);

  const handleSaved = () => {
     setSelectedClientId('');
     setEventData(null);
     window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  return (
    <div className="w-full pb-20 md:pb-0 font-sans">
      <div className="w-full relative aspect-[4/3] md:aspect-[3/1] overflow-hidden bg-stone-900 flex mb-8">
        <picture className="w-full h-full flex-shrink-0">
          <source media="(min-width: 768px)" srcSet="/gambar/banner/desktop1.webp" />
          <img
            src="/gambar/banner/mobile1.webp"
            alt="Hero Banner"
            className="w-full h-full object-cover"
          />
        </picture>
      </div>

      <div className="w-full max-w-3xl mx-auto space-y-8 px-4 md:px-0">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
           <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-stone-800">
             Pilih Klien / Acara
           </h2>
           <label className="block text-sm font-semibold text-stone-700 mb-2">
             Pilih ID Klien atau Username untuk melengkapi data {type.toUpperCase()}.
           </label>
           <ComboBox
              options={clients.map(c => ({
                label: `${c.username} ${c.nama_lengkap ? `(${c.nama_lengkap})` : ''}`,
                value: c.id_klien
              }))}
              value={selectedClientId}
              onChange={setSelectedClientId}
              placeholder="Ketik username atau ID klien..."
           />
        </div>

        {eventLoading && (
          <div className="flex justify-center p-8">
            <LoadingSpinner size={32} />
          </div>
        )}
      </div>

      {!eventLoading && eventData && type === 'vendor' && (
        <ShareableVendorForm event={eventData} onSaved={handleSaved} hideBanner={true} />
      )}
      {!eventLoading && eventData && type === 'pendamping' && (
        <ShareablePendampingForm event={eventData} onSaved={handleSaved} hideBanner={true} />
      )}
      {!eventLoading && eventData && type === 'tamu' && (
        <ShareableTamuForm event={eventData} onSaved={handleSaved} hideBanner={true} />
      )}
      {!eventLoading && eventData && type === 'gdrive' && (
        <ShareableGDriveForm event={eventData} onSaved={handleSaved} hideBanner={true} />
      )}
      {!eventLoading && eventData && type === 'wo' && (
        <ShareableWOForm event={eventData} onSaved={handleSaved} hideBanner={true} />
      )}
      {!eventLoading && eventData && type === 'panitia' && (
        <ShareablePanitiaForm event={eventData} onSaved={handleSaved} hideBanner={true} />
      )}
      {!eventLoading && eventData && type === 'keluarga' && (
        <ShareableKeluargaForm event={eventData} onSaved={handleSaved} hideBanner={true} />
      )}
      {!eventLoading && eventData && type === 'acara' && (
        <ShareableAcaraForm event={eventData} onSaved={handleSaved} hideBanner={true} />
      )}
      {!eventLoading && eventData && type === 'catatan' && (
        <ShareableCatatanForm event={eventData} onSaved={handleSaved} hideBanner={true} />
      )}
      {!eventLoading && eventData && type === 'ringkasan' && (
        <ShareableRingkasanForm event={eventData} onSaved={handleSaved} hideBanner={true} />
      )}
    </div>
  );
}
