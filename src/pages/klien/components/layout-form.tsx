import React, { useState } from 'react';
import { submitClientData } from './submit-form';
import { X, Save, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface FormLayoutProps {
  title: string;
  onClose: () => void;
  eventData: any;
  formData: any;
  mobileExtraAction?: React.ReactNode;
  children: React.ReactNode;
}

export default function FormLayout({ title, onClose, eventData, formData, mobileExtraAction, children }: FormLayoutProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    setIsSubmitting(true);
    setSaveStatus('idle');

    // Merge previous event data with the new form data payload.
    // If we're updating a specific module, the specific state resides in formData.
    const payload = {
      ...eventData,
      ...formData
    };

    const success = await submitClientData(payload);

    if (success) {
      setSaveStatus('success');
      window.dispatchEvent(new CustomEvent("klien-data-updated", { detail: payload }));
      setTimeout(() => setSaveStatus('idle'), 3000);
      if (onClose) setTimeout(() => onClose(), 1500); 
    } else {
      setSaveStatus('error');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col w-full h-full pb-20 md:pb-0">
      {/* Header Form */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-stone-200 px-4 md:px-6 lg:px-8 py-4 md:py-5 flex items-center justify-between z-10 sticky top-0 mb-2 md:mb-4">
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={onClose}
              className="p-2 md:-ml-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-stone-800 leading-tight">
                {title}
              </h2>
              <p className="text-xs text-stone-500">
                Formulir Data Klien
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
          {mobileExtraAction && (
             <div className="md:hidden">
               {mobileExtraAction}
             </div>
          )}
          
          {saveStatus === 'success' && (
            <div className="hidden md:flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
              <span>Tersimpan</span>
            </div>
          )}
          
          {saveStatus === 'error' && (
             <div className="hidden md:flex flex-row items-center gap-1.5 text-sm font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
               <AlertCircle className="w-4 h-4" />
               <span>Gagal Menyimpan</span>
             </div>
          )}

          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="hidden md:flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all
                     bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50 shadow-sm"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full relative px-4 md:px-6 lg:px-8">
        <div className="w-full pb-20 md:pb-0">
           {children}
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-stone-200 z-50">
         <div className="flex items-center gap-2 max-w-4xl mx-auto">
            {saveStatus === 'error' && (
               <div className="flex shrink-0 items-center justify-center p-3 sm:px-4 text-red-600 bg-red-50 rounded-xl border border-red-200">
                 <AlertCircle className="w-5 h-5 sm:w-5 sm:h-5" />
               </div>
            )}
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className={`flex-grow flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm sm:text-base font-bold transition-all shadow-md text-white
                ${saveStatus === 'success' 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'bg-[#DCAF43] hover:bg-[#c99f35]'}
                disabled:opacity-75 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : saveStatus === 'success' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : null}
              
              {isSubmitting 
                ? 'Menyimpan...' 
                : saveStatus === 'success' 
                  ? 'Tersimpan!' 
                  : 'Simpan Perubahan'}
            </button>
         </div>
      </div>
    </div>
  );
}
