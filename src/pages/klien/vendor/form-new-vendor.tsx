import React, { useState, useEffect } from 'react';
import { getVendorData, saveVendorData, saveKlienVendor } from '../../../lib/api';
import { formatPhoneInput, formatSocialInput } from '../../../lib/inputFormatters';
import { Briefcase, Check, Plus, Search, Asterisk, Navigation, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import ComboBox from '../../../components/input-combobox';
import LoadingSpinner from '../../../components/screen-loading';
import { DEFAULT_CATEGORIES } from './form-vendor';

export default function ShareableVendorForm({ event, onSaved, hideBanner, wizardMode, wizardData, onChangeWizard }: { event?: any, onSaved?: () => void, hideBanner?: boolean, wizardMode?: boolean, wizardData?: any, onChangeWizard?: (data: any) => void }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [masterVendors, setMasterVendors] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [selectedExistingId, setSelectedExistingId] = useState<string>('');
  
  const [locating, setLocating] = useState(false);

  const [openSections, setOpenSections] = useState({
    info: true,
    sosmed: false,
    lokasi: false
  });

  const toggleSection = (section: 'info' | 'sosmed' | 'lokasi') => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const [formData, setFormData] = useState(wizardData || {
    nama: '',
    kategori: '',
    whatsapp: '',
    instagram: '',
    tiktok: '',
    facebook: '',
    youtube: '',
    website: '',
    logo: '',
    deskripsi: '',
    peta: ''
  });

  useEffect(() => {
    // If wizard data changes from parent, sync it
    if (wizardMode && wizardData) {
      setFormData(wizardData);
    }
  }, [wizardData, wizardMode]);

  const updateField = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    if (wizardMode && onChangeWizard) {
       onChangeWizard(newData);
    }
  };

  useEffect(() => {
    if (wizardMode) {
      setLoading(false);
      // Optional: still fetch master vendors if needed for combobox
    }
    getVendorData().then(data => {
      setMasterVendors(data.vendors || []);
      if (data.daftarKategori && data.daftarKategori.length > 0) {
        setCategories(data.daftarKategori);
      }
      setLoading(false);
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, [wizardMode]);

  const handleSelectMaster = (vId: string) => {
    setSelectedExistingId(vId);
    if (!vId) {
      const empty = {
        nama: '',
        kategori: '',
        whatsapp: '',
        instagram: '',
        tiktok: '',
        facebook: '',
        youtube: '',
        website: '',
        logo: '',
        deskripsi: '',
        peta: ''
      };
      setFormData(empty);
      if (wizardMode && onChangeWizard) onChangeWizard(empty);
      return;
    }
    
    const vSelected = masterVendors.find(v => v.id === vId);
    if (vSelected) {
      let petaString = '';
      if (typeof vSelected.peta === 'string') {
        petaString = vSelected.peta;
      } else if (vSelected.peta && typeof vSelected.peta === 'object') {
        const p = vSelected.peta as any;
        if (p.link_maps) {
          petaString = p.link_maps;
        } else if (p.lat && p.lng) {
          petaString = `https://maps.google.com/?q=${p.lat},${p.lng}`;
        } else if (p.detail) {
          petaString = p.detail;
        }
      }

      const newData = {
        nama: vSelected.nama || '',
        kategori: vSelected.kategori || '',
        whatsapp: vSelected.whatsapp || vSelected.contact || '',
        instagram: vSelected.instagram || '',
        tiktok: vSelected.tiktok || '',
        facebook: vSelected.facebook || '',
        youtube: vSelected.youtube || '',
        website: vSelected.website || '',
        logo: vSelected.logo || '',
        deskripsi: vSelected.deskripsi || '',
        peta: petaString
      };
      setFormData(newData);
      if (wizardMode && onChangeWizard) {
        onChangeWizard(newData);
      }
    }
  };

  const handleCurrentLocation = (e: React.MouseEvent) => {
    e.preventDefault();
    setLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mapLink = `https://maps.google.com/?q=${latitude},${longitude}`;
          updateField('peta', mapLink);
          setLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Gagal mendapatkan lokasi. Pastikan izin lokasi diberikan.");
          setLocating(false);
        }
      );
    } else {
      alert("Geolokasi tidak didukung oleh browser ini.");
      setLocating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wizardMode) return;

    if (!formData.nama.trim() || !formData.whatsapp.trim() || !formData.kategori.trim()) {
      alert("Nama, WhatsApp, dan Kategori Layanan wajib diisi.");
      return;
    }
    
    setSaving(true);
    let vendorIdToSave = selectedExistingId;
    const vendorDataToSave = { ...formData };

    try {
      if (!vendorIdToSave) {
        // Create new vendor first
        const result = await saveVendorData(vendorDataToSave);
        if (result.success && result.vendor_id) {
          vendorIdToSave = result.vendor_id;
        } else {
          throw new Error('Gagal menyimpan ke master vendor');
        }
      }

      // Add to client vendors
      let clientVendorArray = event.vendor || event.daftar_vendor || [];
      
      const vendorToAppend = {
        id: vendorIdToSave,
        ...vendorDataToSave
      };
      
      const newVendorList = [...clientVendorArray, vendorToAppend];
      const woList = event.wedding_organizer || [];

      await saveKlienVendor(event.id_klien, { 
        vendor: newVendorList, 
        wedding_organizer: woList 
      });

      setSuccessMsg('Data vendor berhasil disimpan. Terima kasih!');
      setTimeout(() => {
        onSaved();
      }, 2000);

    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size={40} />
      </div>
    );
  }

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
          <h1 className="text-xl sm:text-3xl font-extrabold text-stone-900 mb-2">Area Vendor</h1>
          <p className="text-sm text-stone-500 sm:text-lg px-2 md:px-0">
            Terima kasih telah berpartisipasi dalam momen spesial {event.username}. Silakan lengkapi detail informasi layanan Anda sekaligus untuk menjadi mitra kami.
          </p>
        </div>

        <form id="vendor-form" onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200" onKeyDown={(e) => {
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
            <Briefcase className="w-5 h-5 text-[#DCAF43]" /> Formulir Vendor
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2 flex justify-between items-center"><span>Pilih Vendor yang Sudah Ada (Opsional)</span></label>
              <ComboBox
                options={masterVendors.map(v => ({
                  label: `${v.nama} ${v.kategori ? `(${v.kategori})` : ''}`,
                  value: v.id || ''
                }))}
                value={selectedExistingId}
                onChange={handleSelectMaster}
                placeholder="Cari atau pilih vendor..."
              />
              <p className="text-xs text-stone-500 mt-2">Jika Anda sudah pernah terdaftar, silakan pilih nama Anda dari daftar ini agar data langsung terisi.</p>
            </div>

            {/* Section 1: Informasi Vendor */}
            <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-sm bg-stone-50/10">
              <button
                type="button"
                onClick={() => toggleSection('info')}
                className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100/80 transition-colors border-b border-stone-200 text-stone-850 font-bold text-sm sm:text-base text-left focus:outline-none"
              >
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#DCAF43]/10 text-[#DCAF43] flex items-center justify-center text-xs font-bold">1</span>
                  Informasi Vendor
                </span>
                {openSections.info ? <ChevronUp className="w-5 h-5 text-stone-500" /> : <ChevronDown className="w-5 h-5 text-stone-500" />}
              </button>
              
              {openSections.info && (
                <div className="p-4 sm:p-6 space-y-6 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-2 flex justify-between items-center"><span>Kategori Layanan <Asterisk className="w-3 h-3 text-red-500" /></span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
                      <ComboBox
                        required
                        options={[...new Set([...DEFAULT_CATEGORIES])].map(cat => ({ label: cat, value: cat }))}
                        value={formData.kategori}
                        onChange={(val) => updateField("kategori", val )}
                        placeholder="Ketik atau pilih kategori..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-2 flex justify-between items-center"><span>Nama Vendor <Asterisk className="w-3 h-3 text-red-500" /></span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Sanggar Rias Anggun"
                        value={formData.nama}
                        onChange={(e) => updateField("nama", e.target.value )}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-2 flex justify-between items-center"><span>WhatsApp / Telepon <Asterisk className="w-3 h-3 text-red-500" /></span><span className="text-[10px] text-red-500/50 italic font-normal">Wajib Diisi</span></label>
                      <input
                        type="text" inputMode="numeric"
                        required
                        placeholder="08xxxxxxxxxx"
                        value={formData.whatsapp}
                        onChange={(e) => updateField("whatsapp", formatPhoneInput(e.target.value) )}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all font-mono"
                      />
                      <p className="text-xs text-stone-500 mt-1">Nomor ini diperlukan untuk mempermudah koordinasi sebagai mitra kami.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-2">Link Logo Vendor (Opsional)</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={formData.logo}
                        onChange={(e) => updateField("logo", e.target.value )}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">Deskripsi Layanan (Opsional)</label>
                    <textarea
                      placeholder="Jelaskan secara singkat layanan yang akan Anda berikan..."
                      rows={3}
                      value={formData.deskripsi}
                      onChange={(e) => updateField("deskripsi", e.target.value )}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all resize-none"
                    ></textarea>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Sosial Media */}
            <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-sm bg-stone-50/10">
              <button
                type="button"
                onClick={() => toggleSection('sosmed')}
                className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100/80 transition-colors border-b border-stone-200 text-stone-850 font-bold text-sm sm:text-base text-left focus:outline-none"
              >
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#DCAF43]/10 text-[#DCAF43] flex items-center justify-center text-xs font-bold">2</span>
                  Sosial Media
                </span>
                {openSections.sosmed ? <ChevronUp className="w-5 h-5 text-stone-500" /> : <ChevronDown className="w-5 h-5 text-stone-500" />}
              </button>

              {openSections.sosmed && (
                <div className="p-4 sm:p-6 space-y-6 bg-white font-sans">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-2">Instagram (Opsional)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-sm">@</span>
                        <input
                          type="text"
                          placeholder="username"
                          value={formData.instagram}
                          onChange={(e) => updateField("instagram", formatSocialInput(e.target.value) )}
                          className="w-full pl-9 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-2">TikTok (Opsional)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-sm">@</span>
                        <input
                          type="text"
                          placeholder="username"
                          value={formData.tiktok}
                          onChange={(e) => updateField("tiktok", formatSocialInput(e.target.value) )}
                          className="w-full pl-9 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-2">Facebook (Opsional)</label>
                      <input
                        type="text"
                        placeholder="Nama Akun Facebook"
                        value={formData.facebook}
                        onChange={(e) => updateField("facebook", e.target.value )}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-2">YouTube (Opsional)</label>
                      <input
                        type="text"
                        placeholder="Nama Channel YouTube"
                        value={formData.youtube}
                        onChange={(e) => updateField("youtube", e.target.value )}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">Website (Opsional)</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.website}
                      onChange={(e) => updateField("website", e.target.value )}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all text-blue-600"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Lokasi & Peta */}
            <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-sm bg-stone-50/10">
              <button
                type="button"
                onClick={() => toggleSection('lokasi')}
                className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100/80 transition-colors border-b border-stone-200 text-stone-850 font-bold text-sm sm:text-base text-left focus:outline-none"
              >
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#DCAF43]/10 text-[#DCAF43] flex items-center justify-center text-xs font-bold">3</span>
                  Lokasi & Peta
                </span>
                {openSections.lokasi ? <ChevronUp className="w-5 h-5 text-stone-500" /> : <ChevronDown className="w-5 h-5 text-stone-500" />}
              </button>

              {openSections.lokasi && (
                <div className="p-4 sm:p-6 space-y-6 bg-white font-sans">
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-semibold text-stone-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#DCAF43]" /> Link Google Maps (Opsional)
                      </label>
                      <button 
                        type="button"
                        onClick={handleCurrentLocation}
                        disabled={locating}
                        className="flex items-center gap-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        {locating ? 'Mencari...' : 'Gunakan Lokasi Saat ini'}
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="https://maps.google.com/?q=... atau ketik manual..."
                      value={formData.peta}
                      onChange={(e) => updateField("peta", e.target.value )}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 text-sm transition-all text-blue-600"
                    />
                    <p className="text-xs text-stone-500 mt-2">
                      Menuliskan tautan Google Maps untuk mempermudah koordinasi, atau klik "Gunakan Lokasi Saat ini" untuk mendeteksi koordinat lokasi Anda otomatis.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-stone-100 z-50 md:relative md:border-t-0 md:bg-transparent md:p-0 md:flex md:justify-end md:pt-4 md:mb-8">
          <button
            type="submit"
            form="vendor-form"
            disabled={saving || !formData.nama.trim() || !formData.whatsapp.trim() || !formData.kategori.trim()}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#DCAF43] text-white hover:bg-[#c99f35] rounded-xl font-bold shadow-lg active:scale-95 transition-all text-base md:text-lg w-full md:w-auto disabled:opacity-70 disabled:active:scale-100"
          >
            {saving ? 'Menyimpan...' : 'Simpan Data Vendor'}
          </button>
        </div>
      </div>
    </div>
  );
}
