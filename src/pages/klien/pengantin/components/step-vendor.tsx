import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { formatPhoneInput, formatSocialInput } from "../../../../lib/inputFormatters";
import { getVendorData } from "../../../../lib/api";
import { VendorCard } from "../../../../pages/klien/vendor/view-vendor";
import { DEFAULT_CATEGORIES } from "../../../../pages/klien/vendor/form-vendor";

interface Props {
  vendorList: any[];
  setVendorList: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function StepVendor({ vendorList, setVendorList }: Props) {
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
    setVendorList((prev: any[]) => {
      const newVendor = [...prev];
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
      return newVendor;
    });
    setActiveDropdownIndex(null);
  };

  const handleCreateNewVendorOption = (index: number, name: string) => {
    const newId = `vdr-${Math.random().toString(36).substring(2, 9)}`;
    setVendorList((prev: any[]) => {
      const newVendor = [...prev];
      newVendor[index] = {
        ...newVendor[index],
        id: newId,
        nama: name,
        whatsapp: '',
        instagram: '',
        isNewVendor: true,
        isCustom: true
      };
      return newVendor;
    });
    setActiveDropdownIndex(null);
  };

  const handleVendorFieldChange = (index: number, field: string, value: any) => {
    if (field === 'whatsapp') {
      value = formatPhoneInput(value);
    } else if (['instagram', 'tiktok', 'youtube'].includes(field)) {
      value = formatSocialInput(value);
    }

    setVendorList((prev: any[]) => {
      const newVendor = [...prev];
      const updatedV = { ...newVendor[index], [field]: value };
      
      if (field === 'nama') {
        const isMaster = masterVendors.some(mv => 
          (mv.nama || '').toLowerCase().trim() === value.toLowerCase().trim() &&
          (mv.kategori || '').toLowerCase().trim() === (updatedV.kategori || '').toLowerCase().trim()
        );
        if (!isMaster) {
          updatedV.id = ''; 
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
            if (!updatedV.deskripsi) updatedV.deskripsi = matched.deskripsi || '';
            if (!updatedV.tiktok) updatedV.tiktok = matched.tiktok || '';
            if (!updatedV.facebook) updatedV.facebook = matched.facebook || '';
            if (!updatedV.youtube) updatedV.youtube = matched.youtube || '';
            if (!updatedV.website) updatedV.website = matched.website || '';
            if (!updatedV.peta) updatedV.peta = matched.peta || '';
          }
        }
      }
      
      newVendor[index] = updatedV;
      return newVendor;
    });
  };

  const handleAddVendor = () => {
    setVendorList((prev: any[]) => [
      ...prev,
      { kategori: '', nama: '', whatsapp: '', instagram: '', isCustom: true }
    ]);
  };

  const handleRemoveVendor = (index: number) => {
    setVendorList((prev: any[]) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="grid grid-cols-1 gap-6">
        {vendorList.map((v, idx) => (
          <VendorCard
            key={idx}
            v={v}
            index={idx}
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

      <div className="flex justify-start">
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
  );
}
