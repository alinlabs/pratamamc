import React, { useState, useEffect } from 'react';
import { saveKlienAkun } from '../../../lib/api';
import { Check, Calendar, Clock, MapPin, Palette, Languages, Navigation, Asterisk } from 'lucide-react';
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

export default function ShareableRingkasanForm({ event, onSaved, hideBanner }: { event: any, onSaved: () => void, hideBanner?: boolean }) {
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [locating, setLocating] = useState(false);

  const [formData, setFormData] = useState({
    username: event.username || '',
    tanggal: event.tanggal || '',
    waktu: event.waktu || '',
    galeri: event.galeri || '',
    alamat: event.alamat || '',
    link_maps: event.link_maps || '',
    tema: event.tema || '',
    bahasa: Array.isArray(event.bahasa) ? event.bahasa.join(', ') : (event.bahasa || "")
  });

  const [mapCenter, setMapCenter] = useState({ lat: -6.556209, lng: 107.443152 });

  const bahasaArray = formData.bahasa ? formData.bahasa.split(',').map((b: string) => b.trim()) : [];
  const bahasaAkad = bahasaArray[0] || '';
  const bahasaAdat = bahasaArray[1] || '';
  const bahasaResepsi = bahasaArray[2] || '';

  const updateBahasa = (index: number, val: string) => {
    const newBahasa = [...bahasaArray];
    while(newBahasa.length < 3) newBahasa.push('');
    newBahasa[index] = val;
    setFormData((p: any) => ({...p, bahasa: newBahasa.join(', ')}));
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      alert("Nama Event / Username wajib diisi.");
      return;
    }

    setSaving(true);

    try {
      const bahasaArray = formData.bahasa ? formData.bahasa.split(',').map((b: string) => b.trim()).filter(Boolean) : [];
      const updatedData = {
        ...event,
        username: formData.username,
        tanggal: formData.tanggal || "",
        waktu: formData.waktu || "",
        galeri: formData.galeri,
        alamat: formData.alamat,
        link_maps: formData.link_maps,
        tema: formData.tema,
        bahasa: bahasaArray,
      };

      await saveKlienAkun(updatedData);
      setSuccessMsg("Ringkasan acara berhasil diperbarui!");
      setTimeout(() => {
        onSaved();
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat memperbarui ringkasan acara.");
    } finally {
      setSaving(false);
    }
  };

  if (successMsg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <Check className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-stone-800 mb-2 text-center">Berhasil!</h2>
        <p className="text-stone-600 text-center">{successMsg}</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 md:pb-0">
      {/* Full Bleed Banner */}
      {!hideBanner && (
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
      )}

      <div className="w-full max-w-3xl mx-auto space-y-8 px-4 md:px-0">
        <div className="mb-4 text-center md:text-left">
          <h1 className="text-xl sm:text-3xl font-extrabold text-stone-900 mb-2">Area Ringkasan Acara</h1>
          <p className="text-sm text-stone-500 sm:text-lg px-2 md:px-0">
            Perbarui data utama, tema warna, lokasi peta, dan jadwal pelaksanaan acara ({event.username}).
          </p>
        </div>

        <form id="ringkasan-form" onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200" onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
              e.preventDefault();
              const form = e.target.closest('form');
              if (!form) return;
              const focusableElements = Array.from(form.querySelectorAll('input:not([type="hidden"]), select, textarea, button[type="submit"]'));
              const index = focusableElements.indexOf(e.target);
              if (index > -1 && focusableElements[index + 1]) {
                focusableElements[index + 1].focus();
              }
            }
          }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-stone-800">
             <Calendar className="w-5 h-5 text-[#DCAF43]" /> Detail Ringkasan Acara
          </h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-1 flex justify-between items-center"><span>
                  Nama Event / Username <Asterisk className="w-3 h-3 text-red-500" />
                </span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="Contoh: ridwan_anis"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Tema Pernikahan / Warna
                </label>
                <input
                  type="text"
                  name="tema"
                  placeholder="Contoh: Rustic Gold / Putih Suci"
                  value={formData.tema}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Bahasa Prosesi Akad</label>
                <ComboBox 
                  options={BAHASA_OPTIONS}
                  value={bahasaAkad}
                  onChange={(val) => updateBahasa(0, val)}
                  placeholder="Pilih Bahasa Akad"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Bahasa Prosesi Adat</label>
                <ComboBox 
                  options={BAHASA_OPTIONS}
                  value={bahasaAdat}
                  onChange={(val) => updateBahasa(1, val)}
                  placeholder="Pilih Bahasa Adat"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-stone-700 mb-2">Bahasa Prosesi Resepsi</label>
                <ComboBox 
                  options={BAHASA_OPTIONS}
                  value={bahasaResepsi}
                  onChange={(val) => updateBahasa(2, val)}
                  placeholder="Pilih Bahasa Resepsi"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-stone-700 flex items-center gap-1">
                  <span className="hidden sm:flex items-center gap-1"><MapPin className="w-4 h-4 text-stone-400" /> Alamat Venue Acara</span>
                  <span className="sm:hidden flex items-center gap-1"><MapPin className="w-4 h-4 text-stone-400" /> Titik Lokasi</span>
                </label>
                <button
                  type="button"
                  onClick={handleCurrentLocation}
                  disabled={locating}
                  className="text-xs font-bold text-[#DCAF43] flex items-center gap-1 hover:underline focus:outline-none focus:ring-0"
                >
                  <Navigation className="w-3.5 h-3.5 hidden sm:block" />
                  <span className="hidden sm:inline">{locating ? 'Mencari...' : 'Gunakan Lokasi Saat Ini'}</span>
                  <span className="sm:hidden">{locating ? 'Mencari...' : 'Lokasi Saat Ini'}</span>
                </button>
              </div>
              <textarea
                name="alamat"
                rows={1}
                placeholder="Jl. Raya No. 12, Kel. Pasawahan, Purwakarta"
                value={formData.alamat}
                onChange={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                  setFormData((p: any) => ({...p, alamat: e.target.value }));
                }}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all overflow-hidden shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-stone-400" /> Koordinat Maps URL
              </label>
              <input
                type="text"
                name="link_maps"
                placeholder="https://maps.google.com/?q=latitude,longitude"
                value={formData.link_maps}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all shadow-sm mb-4"
              />
              
              <div className="w-full h-64 rounded-2xl overflow-hidden border border-stone-200">
                <MapContainer center={mapCenter} zoom={13} className="w-full h-full">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker
                    position={mapCenter}
                    setPosition={(pos) => {
                      setMapCenter(pos);
                      setFormData(prev => ({
                        ...prev,
                        link_maps: `https://maps.google.com/?q=${pos.lat},${pos.lng}`
                      }));
                    }}
                  />
                </MapContainer>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-8 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Perbarui Ringkasan'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
