import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Clock, Briefcase, Star, UsersRound, MessageCircle, User, FolderOpen, X, ExternalLink, Pencil, FileText, Share2, MapPin as MapPinIcon, CheckCircle, Circle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import ContactCard from '../../../components/modal-detail';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToString } from 'react-dom/server';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customMarkerIcon = L.divIcon({
  className: 'bg-transparent border-none',
  html: renderToString(<MapPinIcon className="w-10 h-10 text-red-500" strokeWidth={2} style={{ fill: 'white' }} />),
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

interface RingkasanProps {
  event: any;
  onEdit?: () => void;
}

const InfoCard = ({ icon: Icon, title, value, onClick }: { icon: any; title: string; value: React.ReactNode; onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`flex flex-col items-center justify-start h-full py-2 sm:py-4 group ${onClick ? 'cursor-pointer' : ''}`}
  >
    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border border-stone-200 flex items-center justify-center mb-4 sm:mb-5 shrink-0 overflow-hidden shadow-sm group-hover:shadow-md transition-all group-hover:border-stone-300">
      <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-stone-300 group-hover:text-stone-400 transition-colors" strokeWidth={1.5} />
    </div>
    <div className="text-center flex-1 flex flex-col items-center w-full">
      <h3 className="font-semibold text-stone-700 text-sm sm:text-base leading-snug line-clamp-2 mb-1 px-1">
        {title}
      </h3>
      <span className="text-stone-400 font-normal text-xs sm:text-sm text-center max-w-full leading-tight px-1">
        {value}
      </span>
    </div>
  </div>
);

export default function RingkasanView({ event, onEdit }: RingkasanProps) {
  const [showDrive, setShowDrive] = useState(false);
  const navigate = useNavigate();
  const { username } = useParams();

  const getMapCenter = () => {
    if (event.link_maps) {
      const match = event.link_maps.match(/q=([-.\d]+),([-.\d]+)/);
      if (match) return [parseFloat(match[1]), parseFloat(match[2])] as [number, number];
    }
    return [-6.556209, 107.443152] as [number, number];
  };

  const mapCenter = getMapCenter();

  const handleNavigate = (tab: string) => {
    navigate(`/${username}/${tab}`);
  };

  const getParents = () => {
    const parents = event.keluarga_inti?.filter((k: any) => 
      k.peran.toLowerCase().includes('ibu') || k.peran.toLowerCase().includes('ayah')
    ) || [];
    const names = parents.map((p: any) => p.nama).filter(Boolean).join(', ');
    return names || null;
  };

  const getPengisiAcara = () => {
    const pengisi = event.pengisi_acara?.slice(0, 3) || [];
    const names = pengisi.map((p: any) => p.nama).filter(Boolean).join(', ');
    const more = event.pengisi_acara?.length > 3 ? ` dan ${event.pengisi_acara.length - 3} lainnya` : '';
    return names ? names + more : null;
  };

  const getVendors = () => {
    const vendorList = event.vendor || event.daftar_vendor || [];
    const vendors = vendorList.slice(0, 3);
    const names = vendors.map((v: any) => v.nama).filter(Boolean).join(', ');
    const more = vendorList.length > 3 ? ` dan ${vendorList.length - 3} lainnya` : '';
    return names ? names + more : null;
  };

  const totalTamuVIP = event.tamu?.length || 0;

  const picKeluargaList = event.panitia_keluarga?.filter((p: any) => p.peran.toLowerCase().includes('pic keluarga')) || [];

  const formatWhatsApp = (number: string) => {
    if (!number) return '';
    let formatted = number.replace(/\D/g, '');
    if (formatted.startsWith('0')) {
      formatted = '62' + formatted.substring(1);
    }
    return `https://wa.me/${formatted}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-4 space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-stone-800">
          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
          Ringkasan Acara
        </h2>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-600 rounded-full transition-all shadow-sm active:scale-95 hover:scale-105 cursor-pointer"
              title="Edit Ringkasan"
            >
              <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-stone-500" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-6 sm:gap-y-8 sm:grid-cols-3 lg:grid-cols-4 mt-4">
        <InfoCard 
          icon={Clock} 
          title="Susunan Acara" 
          value={`Total ${event.susunan_acara?.length || 0} sesi acara.`} 
          onClick={() => handleNavigate('acara')}
        />
        <InfoCard 
          icon={Users} 
          title="Keluarga Inti" 
          value={getParents() || "Belum ada data orang tua."} 
          onClick={() => handleNavigate('keluarga')}
        />
        <InfoCard 
          icon={User} 
          title="Tamu Khusus" 
          value={`Total ${totalTamuVIP} Tamu Khusus`} 
        />
        <InfoCard 
          icon={UsersRound} 
          title="Panitia & Lainnya" 
          value={`${event.panitia_keluarga?.length || 0} Panitia Keluarga`} 
          onClick={() => handleNavigate('keluarga')}
        />
        <InfoCard 
          icon={Briefcase} 
          title="Vendor" 
          value={getVendors() || "Belum ada vendor."} 
          onClick={() => handleNavigate('vendor')}
        />
        <InfoCard 
          icon={Users} 
          title="Pendamping" 
          value={`Total ${event.pendamping?.length || 0} Pendamping`} 
          onClick={() => handleNavigate('keluarga')}
        />
        {picKeluargaList.map((pic: any, idx: number) => (
          <ContactCard
            key={idx}
            nama={pic.nama || 'Belum ditentukan'}
            peran={pic.peran}
            whatsapp={pic.contact || pic.whatsapp}
          />
        ))}
      </div>

      {/* Map Lokasi */}
      {event.alamat && (
        <div className="mt-8 bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Map is at the top of the card structure */}
          <div className="w-full aspect-video md:h-80 relative group overflow-hidden z-0 cursor-pointer">
            <MapContainer 
              center={mapCenter} 
              zoom={15} 
              style={{ height: '100%', width: '100%' }} 
              zoomControl={false}
              attributionControl={false}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={mapCenter} icon={customMarkerIcon} />
            </MapContainer>

            {/* Hover Dark Overlay with text 'Rute Lokasi' */}
            <a 
              href={event.link_maps || `https://maps.google.com/?q=${encodeURIComponent(event.alamat || '')}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="absolute inset-0 z-[400] bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center"
            >
              <div className="opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300 bg-white/95 text-stone-900 px-4 py-2.5 rounded-xl shadow-lg font-bold text-sm flex items-center gap-2 border border-stone-100">
                <MapPinIcon className="w-4 h-4 text-red-500 animate-bounce" />
                <span>Rute Lokasi</span>
              </div>
            </a>
          </div>

          {/* White card section below the map with no title, just the address detail */}
          <div className="p-4 sm:p-5 flex items-start gap-3 bg-white border-t border-stone-100">
            <MapPinIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base font-medium text-stone-700 leading-relaxed">
              {event.alamat}
            </p>
          </div>
        </div>
      )}

      {event.drive_url && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => handleNavigate('gdrive')}
            className="group flex flex-col items-center justify-center p-6 bg-white border border-stone-200 rounded-2xl hover:border-stone-300 hover:shadow-sm transition-all sm:flex-row sm:space-x-6 sm:p-8 w-full max-w-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-stone-50 border border-stone-100/80 flex flex-shrink-0 items-center justify-center mb-4 sm:mb-0 group-hover:scale-105 transition-transform shadow-sm">
              <svg viewBox="0 0 1443 1250" className="w-8 h-8">
                <polygon points="481,0 962,0 1443,833 962,833" fill="#FFC107" />
                <polygon points="0,833 481,0 722,417 241,1250" fill="#0F9D58" />
                <polygon points="241,1250 1202,1250 1443,833 481,833" fill="#1A73E8" />
              </svg>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="font-semibold text-stone-800 text-lg mb-1">Grive File</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Akses folder Google Drive khusus untuk dokumen, undangan, dan aset digital.
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Daftar Periksa Section */}
      {event.checklist && event.checklist.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            Daftar Periksa Persiapan
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            {event.checklist.map((item: any, index: number) => (
              <div key={`${item.id || 'periksa'}-${index}`} className="flex items-center gap-4 p-4 border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors">
                {item.done ? (
                  <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                ) : (
                  <Circle className="w-6 h-6 text-stone-300 shrink-0" />
                )}
                <span className={`text-sm sm:text-base ${item.done ? 'text-stone-400 line-through' : 'text-stone-900'}`}>
                  {item.task}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </motion.div>
  );
}
