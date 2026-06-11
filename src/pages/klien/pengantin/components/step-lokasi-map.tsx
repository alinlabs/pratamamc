import React, { useEffect } from "react";
import { Navigation } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import ComboBox from "../../../../components/input-combobox";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function LocationMarker({ position }: { position: L.LatLngExpression | null; }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  useEffect(() => {
    // Timeout to ensure container is fully rendered and sized before invalidating size
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);

  return position === null ? null : <Marker position={position} />;
}

const BAHASA_OPTIONS = [
  { label: 'Indonesia', value: 'Indonesia' },
  { label: 'Inggris', value: 'Inggris' },
  { label: 'Sunda', value: 'Sunda' }
];

interface Props {
  latLng: { lat: number; lng: number };
  handleCurrentLocation: () => void;
  locating: boolean;
  alamatStr: string;
  setAlamatStr: (val: string) => void;
  linkMaps: string;
  setLinkMaps: (val: string) => void;
  tema: string;
  setTema: (val: string) => void;
  bahasaAkad: string;
  setBahasaAkad: (val: string) => void;
  bahasaAdat: string;
  setBahasaAdat: (val: string) => void;
  bahasaResepsi: string;
  setBahasaResepsi: (val: string) => void;
}

export default function StepLokasiMap({
  latLng,
  handleCurrentLocation,
  locating,
  alamatStr,
  setAlamatStr,
  linkMaps,
  setLinkMaps,
  tema,
  setTema,
  bahasaAkad,
  setBahasaAkad,
  bahasaAdat,
  setBahasaAdat,
  bahasaResepsi,
  setBahasaResepsi
}: Props) {
  return (
    <div className="space-y-6">
      {/* Lokasi */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-stone-500 flex justify-between items-center">
              <span className="hidden sm:inline">Titik Lokasi (Geser/Tap Peta)</span>
              <span className="sm:hidden">Titik Lokasi</span>
            </label>
            <button
              onClick={(e) => { e.preventDefault(); handleCurrentLocation(); }}
              disabled={locating}
              className="flex items-center gap-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              <Navigation className="w-3.5 h-3.5 hidden sm:block" />
              <span className="hidden sm:inline">{locating ? "Mencari..." : "Gunakan Lokasi Saat ini"}</span>
              <span className="sm:hidden">{locating ? "Mencari..." : "Lokasi Saat Ini"}</span>
            </button>
          </div>
          <div className="aspect-video md:h-80 w-full rounded-xl overflow-hidden border border-stone-200 z-10 relative">
            <MapContainer
              center={[latLng.lat, latLng.lng]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
              attributionControl={false}
              dragging={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
              touchZoom={false}
              boxZoom={false}
              keyboard={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker position={latLng} />
            </MapContainer>
          </div>
          {latLng.lat && latLng.lng && (
            <p className="text-[10px] sm:text-xs text-stone-400 mt-2 font-mono">
              Titik tersimpan: {latLng.lat.toFixed(6)}, {latLng.lng.toFixed(6)}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex justify-between items-center">
            <span>Detail Alamat / Gedung <span className="text-red-500">*</span></span>
            <span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span>
          </label>
          <textarea
            rows={2}
            value={alamatStr}
            onChange={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
              setAlamatStr(e.target.value);
            }}
            className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm resize-none overflow-hidden"
            placeholder="Cth: Gedung Serbaguna..."
          />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex justify-between items-center">
            <span>Link Google Maps <span className="text-red-500">*</span></span>
            <span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span>
          </label>
          <input
            type="text"
            value={linkMaps}
            onChange={(e) => setLinkMaps(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
            placeholder="https://maps.app.goo.gl/..."
          />
        </div>
      </div>

      <hr className="border-stone-100" />
      
      {/* Tema & Bahasa */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex justify-between items-center">
            <span>Warna Tema Pakaian <span className="text-red-500">*</span></span>
            <span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span>
          </label>
          <input
            type="text"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all shadow-sm"
            placeholder="Cth: Earth Tone"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex justify-between items-center">
              <span>Bahasa Prosesi Akad <span className="text-red-500">*</span></span>
            </label>
            <ComboBox 
              options={BAHASA_OPTIONS}
              value={bahasaAkad}
              onChange={(val) => setBahasaAkad(val)}
              placeholder="Pilih Bahasa Akad"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex justify-between items-center">
              <span>Bahasa Prosesi Adat <span className="text-red-500">*</span></span>
            </label>
            <ComboBox 
              options={BAHASA_OPTIONS}
              value={bahasaAdat}
              onChange={(val) => setBahasaAdat(val)}
              placeholder="Pilih Bahasa Adat"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex justify-between items-center">
              <span>Bahasa Prosesi Resepsi <span className="text-red-500">*</span></span>
            </label>
            <ComboBox 
              options={BAHASA_OPTIONS}
              value={bahasaResepsi}
              onChange={(val) => setBahasaResepsi(val)}
              placeholder="Pilih Bahasa Resepsi"
            />
          </div>
        </div>
      </div>
      {/* Spacer agar combobox terakhir tidak terpotong oleh ujung halaman/sticky bottom */}
      <div className="h-56 w-full pointer-events-none"></div>
    </div>
  );
}
