import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import FormLayout from '../components/layout-form';
import ArrayFormSection from '../components/helper-form';

export default function CatatanForm({ eventData, onClose }: { eventData: any, onClose: () => void }) {
  const [formData, setFormData] = useState({
    daftar_catatan: Array.isArray(eventData.daftar_catatan) && eventData.daftar_catatan.length > 0 ? eventData.daftar_catatan : [],
  });

  useEffect(() => {
    if (!eventData.daftar_catatan || (Array.isArray(eventData.daftar_catatan) && eventData.daftar_catatan.length === 0)) {
      const fetchDefault = async () => {
        try {
          const res = await fetch('/data/default-catatan.json');
          if (res.ok) {
            const data = await res.json();
            setFormData(prev => {
              if (prev.daftar_catatan.length === 0) {
                return { ...prev, daftar_catatan: data };
              }
              return prev;
            });
          }
        } catch (error) {
          console.error("Error fetching default catatan:", error);
        }
      };
      
      fetchDefault();
    }
  }, [eventData.daftar_catatan]);

  const handleArrayChange = (arrayName: string, index: number, field: string, value: string) => {
    setFormData((prev: any) => {
      const newArray = [...(prev[arrayName] || [])];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  };

  const handleAddArrayItem = (arrayName: string, newItem: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] || []), newItem]
    }));
  };

  const handleRemoveArrayItem = (arrayName: string, index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [arrayName]: (prev[arrayName] || []).filter((_: any, i: number) => i !== index)
    }));
  };

  const mobileExtraAction = (
    <button 
      type="button" 
      onClick={() => handleAddArrayItem('daftar_catatan', { judul: '', konten: '', tipe: 'deskripsi', isCustom: true })} 
      className="w-11 h-11 rounded-xl bg-[#D2A439]/10 border border-[#D2A439]/25 flex items-center justify-center text-stone-500 hover:text-[#D2A439] active:scale-95 transition-all focus:outline-none focus:ring-0 cursor-pointer shadow-sm"
    >
      <Plus className="w-5 h-5 stroke-[2.5]" />
    </button>
  );

  return (
    <FormLayout title="Catatan Tambahan" onClose={onClose} eventData={eventData} formData={formData} mobileExtraAction={mobileExtraAction}>
      <ArrayFormSection
        arrayName="daftar_catatan"
        data={formData.daftar_catatan}
        fields={[
          { nama: 'judul', label: 'Judul Catatan' },
          { nama: 'konten', label: 'Isi Catatan', tipe: 'textarea' }
        ]}
        titleField="judul"
        addOptions={[
          { label: 'Tambah Catatan', value: { judul: '', konten: '', tipe: 'deskripsi', isCustom: true } }
        ]}
        onChange={handleArrayChange}
        onAdd={handleAddArrayItem}
        onRemove={handleRemoveArrayItem}
      />
    </FormLayout>
  );
}
