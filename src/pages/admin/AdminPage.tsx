import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, ExternalLink, AlertTriangle, Database, Wifi, ShieldCheck, Check } from 'lucide-react';
import { motion } from 'motion/react';
import ScrollReveal from '../../components/ScrollReveal';
import DataError from '../../components/error-data';
import LoadingSpinner from '../../components/screen-loading';
import { getKlienAkun, saveKlienAkun, deleteKlienAkun, CF_WORKER_URL } from '../../lib/api';

export default function AdminPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCloudDatabase, setIsCloudDatabase] = useState(false);
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKeyManager, setShowKeyManager] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem("CF_API_KEY") || localStorage.getItem("ADMIN_PASSWORD") || "";
    if (savedKey) {
      setIsApiKeySet(true);
      setApiKeyInput(savedKey);
    }
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      // Test Cloudflare Worker connectivity first
      let testCloud = false;
      try {
        const testRes = await fetch(`${CF_WORKER_URL}/api/health`, { method: "GET" });
        if (testRes.ok) {
          testCloud = true;
        }
      } catch (e) {
        console.warn("Cloudflare worker offline or unreachable, falling back to local files.");
      }
      setIsCloudDatabase(testCloud);

      const data = await getKlienAkun();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError('Gagal memuat data acara. Periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem("CF_API_KEY", apiKeyInput.trim());
      localStorage.setItem("ADMIN_PASSWORD", apiKeyInput.trim());
      setIsApiKeySet(true);
      alert("Kunci Otentikasi API disimpan! Sistem akan menggunakannya untuk operasi penulisan.");
    } else {
      localStorage.removeItem("CF_API_KEY");
      localStorage.removeItem("ADMIN_PASSWORD");
      setIsApiKeySet(false);
      alert("Kunci Otentikasi dihapus.");
    }
    fetchEvents();
  };

  const handleCreateEvent = async () => {
    const randomId = Math.random().toString(36).substring(2, 9);
    const username = `acara-${randomId}`;
    const newEvent = {
      id_klien: randomId,
      username,
      tanggal: new Date().toISOString().split('T')[0],
      waktu: new Date().toTimeString().split(' ')[0].substring(0, 5),
      alamat: "Lokasi Gedung / Rumah",
      link_maps: "",
      lat: -6.556209,
      lng: 107.443152,
      tema: "Mahogany",
      bahasa: ["Indonesia"]
    };

    if (isCloudDatabase) {
      setLoading(true);
      const res = await saveKlienAkun(newEvent);
      if (res.success) {
        setEvents([newEvent, ...events]);
        alert("Berhasil! Acara baru ditambahkan dan disimpan secara permanen di database Cloud SQL.");
      } else {
        alert(`Gagal menyimpan ke database cloud: ${res.message}. Acara hanya ditambahkan di memori lokal.`);
        setEvents([newEvent, ...events]);
      }
      setLoading(false);
    } else {
      // Simulasi penambahan data secara lokal (hanya di memori browser)
      setEvents([newEvent, ...events]);
      alert("Sistem berjalan dalam Mode Offline/Lokal. Acara ditambahkan sementara di memori browser (perubahan akan hilang saat refresh).");
    }
  };

  const handleDeleteEvent = async (id_klien: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus acara ini secara permanen?")) return;
    
    if (isCloudDatabase) {
      setLoading(true);
      try {
        const res = await deleteKlienAkun(id_klien);
        if (res.success) {
          setEvents(events.filter(e => (e.id_klien || e.id) !== id_klien));
          alert("Berhasil menghapus acara secara permanen dari database Cloud SQL!");
        } else {
          alert(`Gagal menghapus dari database cloud: ${res.message}`);
        }
      } catch (err: any) {
        alert(`Terjadi kesalahan saat menghapus: ${err.message || err}`);
      } finally {
        setLoading(false);
      }
    } else {
      // Simulasi penghapusan data secara lokal
      setEvents(events.filter(e => (e.id_klien || e.id) !== id_klien));
      alert("Sistem berjalan dalam Mode Offline. Acara dihapus sementara di memori browser.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (error) {
    return <DataError message={error} onRetry={fetchEvents} />;
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans p-6 pt-24">
      <ScrollReveal className="max-w-5xl mx-auto">
        
        {/* Connection Status HUD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-xl border flex gap-3 items-center ${
            isCloudDatabase 
              ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
              : "bg-amber-50 border-amber-200 text-amber-800"
          }`}>
            <Database className="w-5 h-5 shrink-0" />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm">Status Database Cloud</h3>
                <span className={`h-2 w-2 rounded-full ${isCloudDatabase ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
              </div>
              <p className="text-xs">
                {isCloudDatabase 
                  ? "Terhubung ke Cloudflare D1 SQL (Live Database Active)." 
                  : "Offline / Tidak terjangkau. Menggunakan fallback lokal (Offline Mode)."}
              </p>
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-4 rounded-xl flex justify-between items-center text-stone-700">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className={`w-5 h-5 ${isApiKeySet ? "text-[#DCAF43]" : "text-stone-400"}`} />
              <div>
                <h3 className="font-bold text-sm">Kunci Otentikasi API</h3>
                <p className="text-xs">
                  {isApiKeySet ? "Kunci aktif dimasukkan." : "Belum diatur (Hanya Baca otomatis)."}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowKeyManager(!showKeyManager)}
              className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-xs rounded-lg font-medium transition-colors"
            >
              {showKeyManager ? "Tutup" : "Kelola"}
            </button>
          </div>
        </div>

        {/* API Authentication Manager */}
        {showKeyManager && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-5 bg-white border border-stone-200 rounded-xl"
          >
            <h3 className="font-bold text-sm text-stone-800 mb-2">Setup Token Otentikasi API</h3>
            <p className="text-xs text-stone-500 mb-3">
              Masukkan kunci API_KEY, AUTH_TOKEN, atau password administrator Anda di bawah ini agar operasi pengulisan (write/save) ke database Cloudflare D1 diperbolehkan:
            </p>
            <div className="flex gap-2">
              <input 
                type="password" 
                placeholder="Token Otentikasi / Password Admin"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="flex-1 px-3 py-1.5 text-sm border border-stone-300 rounded-lg focus:outline-none  "
              />
              <button 
                onClick={handleSaveApiKey}
                className="px-4 py-1.5 bg-stone-900 text-white hover:bg-stone-800 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Simpan
              </button>
            </div>
          </motion.div>
        )}

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Dasbor Admin</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-stone-50/50">
            <h2 className="text-xl font-bold">Daftar Acara</h2>
            <button 
              onClick={handleCreateEvent}
              className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" /> Buat Acara (Cloud SQL)
            </button>
          </div>
          
          <div className="divide-y divide-stone-100">
            {events.length === 0 ? (
              <div className="p-8 text-center text-stone-500">Tidak ada acara ditemukan.</div>
            ) : (
              events.map(event => {
                const id_klien = event.id_klien || event.id;
                return (
                  <div key={id_klien} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 transition-colors">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{event.tema || 'Event'}</h3>
                      <div className="text-sm text-stone-500 flex flex-wrap gap-x-4 gap-y-1">
                        <span>Username: {event.username}</span>
                        <span>Tanggal: {new Date(event.tanggal || event.date).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Link 
                        to={`/${event.username}/edit`} 
                        target="_blank"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-stone-700 rounded-md text-sm font-medium hover:bg-stone-200 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" /> Form Klien
                      </Link>
                      <Link 
                        to={`/${event.username}`} 
                        target="_blank"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" /> Halaman Klien
                      </Link>
                      <button 
                        onClick={() => handleDeleteEvent(id_klien)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="Hapus Acara"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
