import React, { useState } from 'react';
import { FolderOpen } from 'lucide-react';
import FormLayout from '../components/layout-form';

export function GDriveTab({ formData, handleFieldChange }: any) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white border-x-0 sm:border-x border-y sm:border-y sm:rounded-2xl border-stone-200/60 shadow-sm p-5 md:p-8 space-y-6 -mx-4 sm:mx-0">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
          <div className="p-2 bg-[#DCAF43]/10 rounded-xl">
            <FolderOpen className="w-5 h-5 md:w-6 md:h-6 text-[#DCAF43]" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-stone-800">Tautan Google Drive</h3>
            <p className="text-xs text-stone-500 font-medium mt-0.5">Atur tautan folder Workspace (Google Drive) klien.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1.5 flex items-center gap-1">
              URL Google Drive
            </label>
            <input 
              type="text" 
              name="drive_url" 
              value={formData.drive_url || ''} 
              onChange={(e) => handleFieldChange('drive_url', e.target.value)}
              placeholder="https://drive.google.com/drive/folders/..."
              className="w-full px-4 py-3 text-sm border border-stone-200 bg-stone-50/50 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all font-medium shadow-sm"
            />
            <p className="text-[11px] text-stone-400 mt-2">
              Pastikan tautan folder dapat diakses dengan pengaturan "Anyone with the link" (Siapa saja yang memiliki tautan).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GDriveForm({ eventData, onClose }: { eventData: any; onClose: () => void; }) {
  const [formData, setFormData] = useState({
    drive_url: eventData.drive_url || '',
    username: eventData.username,
    id_klien: eventData.id_klien,
  });

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <FormLayout title="Manajemen GDrive" onClose={onClose} eventData={eventData} formData={formData}>
      <GDriveTab formData={formData} handleFieldChange={handleFieldChange} />
    </FormLayout>
  );
}
