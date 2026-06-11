import React, { useState, useEffect } from 'react';
import FormLayout from '../components/layout-form';
import { FolderOpen, MapPin, Palette, Languages, Calendar, User, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ComboBox from '../../../components/input-combobox';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }: { position: L.LatLngExpression | null, setPosition: (pos: any) => void }) {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position} />
  );
}

export default function RingkasanForm({ eventData, onClose }: { eventData: any, onClose: () => void }) {
  const [locating, setLocating] = useState(false);
  const [formData, setFormData] = useState({
    username: eventData.username || '',
    tanggal: eventData.tanggal || '',
    waktu: eventData.waktu || '',
    galeri: eventData.galeri || '',
    alamat: eventData.alamat || '',
    link_maps: eventData.link_maps || '',
    tema: eventData.tema || '',
    bahasa: Array.isArray(eventData.bahasa) ? eventData.bahasa : (eventData.bahasa ? [eventData.bahasa] : [])
  });

  const [mapCenter, setMapCenter] = useState({ lat: -6.556209, lng: 107.443152 });

  const bahasaArray = Array.isArray(formData.bahasa) ? formData.bahasa : [];
  const bahasaAkad = bahasaArray[0] || '';
  const bahasaAdat = bahasaArray[1] || '';
  const bahasaResepsi = bahasaArray[2] || '';

  const updateBahasa = (index: number, val: string) => {
    const newBahasa = [...bahasaArray];
    while(newBahasa.length < 3) newBahasa.push('');
    newBahasa[index] = val;
    setFormData((p: any) => ({...p, bahasa: newBahasa}));
  };

  const BAHASA_OPTIONS = [
    { label: 'Indonesia', value: 'Indonesia' },
    { label: 'Inggris', value: 'Inggris' },
    { label: 'Sunda', value: 'Sunda' }
  ];

  useEffect(() => {
    if (formData.link_maps) {
        const match = formData.link_maps.match(/q=([-.\d]+),([-.\d]+)/);
        if (match) {
            setMapCenter({ lat: parseFloat(match[1]), lng: parseFloat(match[2]) });
        }
    }
  }, [formData.link_maps]);

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
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          setMapCenter({ lat: latitude, lng: longitude });
          setFormData((prev: any) => ({
            ...prev,
            alamat: data.display_name || prev.alamat || '',
            link_maps: `https://maps.google.com/?q=${latitude},${longitude}`
          }));
        } catch (error) {
          console.error("Error mendapatkan alamat:", error);
          setMapCenter({ lat: latitude, lng: longitude });
          setFormData((prev: any) => ({
            ...prev,
            link_maps: `https://maps.google.com/?q=${latitude},${longitude}`
          }));
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'waktu') {
      let val = value.replace(/[^\d]/g, '');
      if (val.length > 4) val = val.substring(0, 4);
      
      let formatted = val;
      if (val.length >= 3) {
        formatted = val.substring(0, 2) + ':' + val.substring(2);
      }
      
      setFormData((prev: any) => ({
        ...prev,
        [name]: formatted
      }));
      return;
    }

    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <FormLayout title="Informasi Umum Acara" onClose={onClose} eventData={eventData} formData={formData}>
      <div className="space-y-6 mb-16 md:mb-0">
        
        {/* CARD 1: IDENTITAS & TANGGAL ACARA */}
        <div id="general-identity-card" className="bg-white border border-stone-200 shadow-sm rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
            <div className="p-1.5 bg-[#DCAF43]/10 text-[#DCAF43] rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-850">Identitas & Tanggal Acara</h3>
              <p className="text-[11px] text-stone-500">Tanggal penyelenggaraan acara.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex items-center gap-1">
                Username Akun Klien
              </label>
              <input 
                id="input-username"
                type="text" 
                name="username" 
                value={formData.username || ''} 
                onChange={handleChange}
                placeholder="Username (tanpa spasi dan karakter unik)"
                className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex justify-between items-center whitespace-nowrap">
                <span>Tanggal Acara <span className="text-red-500">*</span></span>
              </label>
              <input 
                id="input-tanggal"
                type="date" 
                name="tanggal" 
                value={formData.tanggal || ''} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex justify-between items-center whitespace-nowrap">
                <span>Waktu Acara <span className="text-red-500">*</span></span>
              </label>
              <input 
                id="input-waktu"
                type="text" 
                name="waktu" 
                inputMode="numeric"
                maxLength={5}
                placeholder="00:00"
                value={formData.waktu || ''} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
        


        {/* CARD 3: LOKASI ACARA */}
        <div id="general-location-card" className="bg-white border border-stone-200 shadow-sm rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
            <div className="p-1.5 bg-[#DCAF43]/10 text-[#DCAF43] rounded-lg">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-850">Lokasi & Alamat Acara</h3>
              <p className="text-[11px] text-stone-500">Detail alamat fisik dan koordinat navigasi venue.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-stone-500">
                  <span className="hidden sm:inline">Titik Lokasi (Geser/Tap Peta)</span>
                  <span className="sm:hidden">Titik Lokasi</span>
                </label>
                <button 
                  onClick={(e) => { e.preventDefault(); handleCurrentLocation(); }}
                  disabled={locating}
                  className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Navigation className="w-3 h-3 sm:w-3.5 sm:h-3.5 hidden sm:block" />
                  <span className="hidden sm:inline">{locating ? 'Mencari...' : 'Gunakan Lokasi Saat ini'}</span>
                  <span className="sm:hidden">{locating ? 'Mencari...' : 'Lokasi Saat Ini'}</span>
                </button>
              </div>
              <div className="aspect-video md:h-80 w-full rounded-xl overflow-hidden border border-stone-200 z-10 relative">
                <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker 
                    position={mapCenter} 
                    setPosition={(pos) => {
                      setMapCenter(pos);
                      setFormData((p: any) => ({...p, link_maps: `https://maps.google.com/?q=${pos.lat},${pos.lng}`}));
                    }} 
                  />
                </MapContainer>
              </div>
              {mapCenter.lat && mapCenter.lng && (
                <p className="text-xs text-stone-400 mt-2">
                  Titik tersimpan: {mapCenter.lat.toFixed(6)}, {mapCenter.lng.toFixed(6)}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" /> Detail Alamat Lokasi
              </label>
              <textarea 
                id="input-detail-alamat"
                name="location" 
                value={formData.alamat || ''} 
                onChange={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                  setFormData((p: any) => ({...p, alamat: e.target.value }));
                }} 
                placeholder="Tulis alamat lengkap venue, gedung/ruangan, RT/RW, Kecamatan, Kota..."
                rows={1} 
                className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all overflow-hidden shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" /> URL Google Maps (Opsional)
              </label>
              <input 
                id="input-link-maps"
                type="text" 
                name="locationUrl" 
                value={formData.link_maps || ''} 
                onChange={(e) => setFormData((p: any) => ({...p, link_maps: e.target.value }))} 
                placeholder="https://maps.app.goo.gl/..."
                className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* CARD 4: TEMA & BAHASA */}
        <div id="general-theme-card" className="bg-white border border-stone-200 shadow-sm rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
            <div className="p-1.5 bg-[#DCAF43]/10 text-[#DCAF43] rounded-lg">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-850">Tema Pakaian & Bahasa</h3>
              <p className="text-[11px] text-stone-500">Konsep estetika dan bahasa pengantar formal yang digunakan.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">Tema Pakaian / Warna</label>
              <input 
                id="input-warna-tema"
                type="text" 
                name="tema" 
                value={formData.tema || ''} 
                onChange={(e) => setFormData((p: any) => ({...p, tema: e.target.value }))} 
                placeholder="Contoh: Earth Tone, Sage Green, Putih Kebaya..."
                className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">Bahasa Prosesi Akad</label>
              <ComboBox 
                options={BAHASA_OPTIONS}
                value={bahasaAkad}
                onChange={(val) => updateBahasa(0, val)}
                placeholder="Pilih Bahasa Akad"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">Bahasa Prosesi Adat</label>
              <ComboBox 
                options={BAHASA_OPTIONS}
                value={bahasaAdat}
                onChange={(val) => updateBahasa(1, val)}
                placeholder="Pilih Bahasa Adat"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">Bahasa Prosesi Resepsi</label>
              <ComboBox 
                options={BAHASA_OPTIONS}
                value={bahasaResepsi}
                onChange={(val) => updateBahasa(2, val)}
                placeholder="Pilih Bahasa Resepsi"
              />
            </div>
          </div>
        </div>

      </div>
    </FormLayout>
  );
}
