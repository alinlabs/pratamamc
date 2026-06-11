import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface ArrayFormSectionProps {
  label?: string;
  arrayName: string;
  data: any[];
  fields: { nama: string; label: string; tipe?: string; options?: string[] }[];
  titleField?: string;
  addOptions?: { label: string; value: any }[];
  onChange: (arrayName: string, index: number, field: string, value: string) => void;
  onAdd: (arrayName: string, value: any) => void;
  onRemove: (arrayName: string, index: number) => void;
}

export default function ArrayFormSection({
  arrayName,
  data,
  fields,
  titleField,
  addOptions,
  onChange,
  onAdd,
  onRemove
}: ArrayFormSectionProps) {
  const [allMusik, setAllMusik] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (fields.some(f => f.tipe === 'comboboxMusik')) {
      import('../../../lib/api').then(({ getMusikData }) => {
        getMusikData().then(setAllMusik).catch(console.error);
      });
    }
  }, [fields]);
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-6 sm:space-y-8">
        {(data || []).map((item: any, index: number) => (
          <div key={index} className="relative group bg-white border border-stone-200 shadow-sm rounded-xl p-4 sm:p-6 mb-4">
            {addOptions && (
              <button
                type="button"
                onClick={() => onRemove(arrayName, index)}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 text-stone-400 hover:text-red-500 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 bg-stone-50 hover:bg-red-50 rounded-lg cursor-pointer"
                title="Hapus"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            {titleField && !item.isCustom && item[titleField] && arrayName !== 'daftar_catatan' && (
              <h3 className="text-base sm:text-lg font-bold text-stone-800 mb-4 sm:mb-5 pb-2 border-b border-stone-100">{item[titleField]}</h3>
            )}
 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {fields.map((field) => {
                return (
                  <div key={field.nama} className={field.tipe === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className="block text-xs sm:text-sm font-medium text-stone-500 mb-1.5 sm:mb-2">{field.label}</label>
                    {field.tipe === 'textarea' ? (
                      <textarea
                        value={item[field.nama] || ''}
                        onChange={(e) => onChange(arrayName, index, field.nama, e.target.value)}
                        className="w-full px-4 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-stone-200 bg-stone-50/30 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 placeholder-stone-400/80 transition-all resize-none shadow-sm"
                        rows={2.5}
                      />
                    ) : field.tipe === 'select' ? (
                      <select
                        value={item[field.nama] || ''}
                        onChange={(e) => onChange(arrayName, index, field.nama, e.target.value)}
                        className="w-full px-4 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-stone-200 bg-stone-50/30 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 placeholder-stone-400/80 transition-all shadow-sm"
                      >
                        <option value="" disabled>Pilih {field.label}</option>
                        {(field.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : field.tipe === 'time' ? (
                      <input
                        type="time"
                        value={item[field.nama] || ''}
                        onChange={(e) => onChange(arrayName, index, field.nama, e.target.value)}
                        className="w-full px-4 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-stone-200 bg-stone-50/30 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 placeholder-stone-400/80 transition-all shadow-sm"
                      />
                    ) : field.tipe === 'comboboxMusik' ? (
                      <>
                        <input
                          type="text"
                          list="musik-list"
                          value={item[field.nama] || ''}
                          onChange={(e) => {
                            onChange(arrayName, index, field.nama, e.target.value);
                            // Auto-fill music URL if matches
                            const match = allMusik.find(m => m.judul === e.target.value);
                            if (match) {
                              const tautan = match.versi?.[0]?.tautan || match.tautan || match.link;
                              if (tautan) onChange(arrayName, index, 'tautan_musik', tautan);
                            }
                          }}
                          className="w-full px-4 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-stone-200 bg-stone-50/30 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 placeholder-stone-400/80 transition-all shadow-sm"
                        />
                        <datalist id="musik-list">
                          {allMusik.map((m, i) => <option key={`${m.judul}-${i}`} value={m.judul} />)}
                        </datalist>
                      </>
                    ) : field.tipe === 'audioPreview' ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item[field.nama] || ''}
                          onChange={(e) => onChange(arrayName, index, field.nama, e.target.value)}
                          placeholder="Masukkan link/URL audio jukehost..."
                          className="w-full px-4 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-stone-200 bg-stone-50/30 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 placeholder-stone-400/80 transition-all shadow-sm"
                        />
                        {item[field.nama] && (
                          <div className="shrink-0">
                            <audio src={item[field.nama]} controls className="h-10 w-32 sm:w-48 focus:outline-none focus:ring-0" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={item[field.nama] || ''}
                        onChange={(e) => onChange(arrayName, index, field.nama, e.target.value)}
                        className="w-full px-4 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-stone-200 bg-stone-50/30 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 placeholder-stone-400/80 transition-all shadow-sm"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
 
        {addOptions && (
          <div className="flex flex-wrap gap-2 sm:gap-3 pt-2 sm:pt-4 border-t border-stone-100 mt-6">
            {addOptions.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onAdd(arrayName, opt.value)}
                className="flex items-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200/80 rounded-xl hover:border-stone-300 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-stone-550" />
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
