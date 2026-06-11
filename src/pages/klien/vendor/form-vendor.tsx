import React, { useState, useEffect } from 'react';
import FormLayout from '../components/layout-form';
import { formatPhoneInput, formatSocialInput } from '../../../lib/inputFormatters';
import { Plus, Trash2, Users, Check, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { getVendorData } from '../../../lib/api';
import { VendorCard } from '../../klien/vendor/view-vendor';

export const DEFAULT_CATEGORIES = [
  "Wedding Organizer",
  "Makeup",
  "Henna",
  "Busana",
  "Fotografi",
  "Videografi",
  "Wedding Content Creator",
  "Dekorasi",
  "Musik",
  "Upacara Adat",
  "Catering"
];

export default function VendorForm({ eventData, onClose }: { eventData: any, onClose: () => void }) {
  const [formData, setFormData] = useState(() => {
    // Prepare vendors list
    const rawVendorInput = eventData.vendor || eventData.daftar_vendor || [];
    const rawVendor = rawVendorInput.map((v: any) => {
      if (typeof v === 'string') {
        return { kategori: v, nama: '', whatsapp: '', instagram: '' };
      }
      return v;
    });

    const mergedVendors = [...DEFAULT_CATEGORIES].map(cat => {
      const existing = rawVendor.find((v: any) => v && (v.kategori || '').toLowerCase() === cat.toLowerCase());
      if (existing) {
        return { 
          ...existing, 
          kategori: cat,
          nama: existing.nama || '',
          whatsapp: existing.whatsapp || existing.contact || '',
          instagram: existing.instagram || ''
        };
      }
      return { kategori: cat, nama: '', whatsapp: '', instagram: '' };
    });

    // Add extra custom categories not present in default categories list
    rawVendor.forEach((v: any) => {
      if (v && v.kategori) {
        const isDefault = DEFAULT_CATEGORIES.some(cat => cat.toLowerCase() === v.kategori.toLowerCase());
        if (!isDefault) {
          mergedVendors.push({
            ...v,
            nama: v.nama || '',
            whatsapp: v.whatsapp || v.contact || '',
            instagram: v.instagram || '',
            isCustom: true
          });
        }
      }
    });

    return {
      id_klien: eventData.id_klien,
      vendor: mergedVendors,
    };
  });

  const [masterVendors, setMasterVendors] = useState<any[]>([]);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(null);

  useEffect(() => {
    getVendorData()
      .then(data => {
        if (data && data.vendors) {
          setMasterVendors(data.vendors);
        }
      })
      .catch(err => console.error("Gagal memuat list master vendor:", err));
  }, []);

  const handleSelectVendorOption = (index: number, option: any) => {
    setFormData((prev: any) => {
      const newVendor = [...(prev.vendor || [])];
      newVendor[index] = {
        ...newVendor[index],
        id: option.id,
        nama: option.nama,
        whatsapp: option.whatsapp || option.contact || '',
        instagram: option.instagram || '',
        logo: option.logo || '',
        deskripsi: option.deskripsi || '',
        isNewVendor: false
      };
      return { ...prev, vendor: newVendor };
    });
    setActiveDropdownIndex(null);
  };

  const handleCreateNewVendorOption = (index: number, name: string) => {
    const newId = `vdr-${Math.random().toString(36).substring(2, 9)}`;
    setFormData((prev: any) => {
      const newVendor = [...(prev.vendor || [])];
      newVendor[index] = {
        ...newVendor[index],
        id: newId,
        nama: name,
        whatsapp: '',
        instagram: '',
        isNewVendor: true,
        isCustom: true
      };
      return { ...prev, vendor: newVendor };
    });
    setActiveDropdownIndex(null);
  };

  const handleVendorFieldChange = (index: number, field: string, value: any) => {
    if (field === 'whatsapp') {
      value = formatPhoneInput(value);
    } else if (['instagram', 'tiktok', 'youtube'].includes(field)) {
      value = formatSocialInput(value);
    }

    setFormData((prev: any) => {
      const newVendor = [...(prev.vendor || [])];
      const updatedV = { ...newVendor[index], [field]: value };
      
      if (field === 'nama') {
        const isMaster = masterVendors.some(mv => 
          (mv.nama || '').toLowerCase().trim() === value.toLowerCase().trim() &&
          (mv.kategori || '').toLowerCase().trim() === (updatedV.kategori || '').toLowerCase().trim()
        );
        if (!isMaster) {
          updatedV.id = ''; // clear ID so submitService knows to register a new vendor ID!
          updatedV.isNewVendor = value.trim() !== '';
        } else {
          const matched = masterVendors.find(mv => 
            (mv.nama || '').toLowerCase().trim() === value.toLowerCase().trim() &&
            (mv.kategori || '').toLowerCase().trim() === (updatedV.kategori || '').toLowerCase().trim()
          );
          if (matched) {
            updatedV.id = matched.id;
            updatedV.isNewVendor = false;
            if (!updatedV.whatsapp) updatedV.whatsapp = matched.whatsapp || matched.contact || '';
            if (!updatedV.instagram) updatedV.instagram = matched.instagram || '';
          }
        }
      }
      
      newVendor[index] = updatedV;
      return { ...prev, vendor: newVendor };
    });
  };

  const handleAddVendor = () => {
    setFormData((prev: any) => ({
      ...prev,
      vendor: [...(prev.vendor || []), { kategori: '', nama: '', whatsapp: '', instagram: '', isCustom: true }]
    }));
  };

  const handleRemoveVendor = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      vendor: (prev.vendor || []).filter((_: any, i: number) => i !== index)
    }));
  };

  const mobileExtraAction = (
    <button
      type="button"
      onClick={handleAddVendor}
      className="md:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-800 bg-[#DCAF43]/15 border border-[#DCAF43]/25 hover:bg-[#DCAF43]/25 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
    >
      <Plus className="w-3.5 h-3.5" />
      <span>Tambah</span>
    </button>
  );

  return (
    <FormLayout title="Vendor Partner" onClose={onClose} eventData={eventData} formData={formData} mobileExtraAction={mobileExtraAction}>
      <div className="space-y-6 mb-16 md:mb-0 mt-4 md:mt-2 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 gap-6">
          {(formData.vendor || []).map((v: any, index: number) => (
            <VendorCard
              key={index}
              v={v}
              index={index}
              masterVendors={masterVendors}
              activeDropdownIndex={activeDropdownIndex}
              setActiveDropdownIndex={setActiveDropdownIndex}
              handleVendorFieldChange={handleVendorFieldChange}
              handleRemoveVendor={handleRemoveVendor}
              handleSelectVendorOption={handleSelectVendorOption}
              handleCreateNewVendorOption={handleCreateNewVendorOption}
              DEFAULT_CATEGORIES={DEFAULT_CATEGORIES}
            />
          ))}
        </div>

        <div className="hidden md:flex justify-start mt-4">
          <button
            type="button"
            onClick={handleAddVendor}
            className="flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-stone-800 bg-[#DCAF43]/15 border border-[#DCAF43]/25 hover:bg-[#DCAF43]/25 rounded-xl hover:border-[#DCAF43]/40 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-stone-700" />
            Tambah Vendor
          </button>
        </div>
      </div>
    </FormLayout>
  );
}

