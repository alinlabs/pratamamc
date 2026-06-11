import React from "react";
import { Plus, Trash2 } from "lucide-react";
import ComboBox from "../../../../components/input-combobox";

interface Props {
  tamuList: any[];
  setTamuList: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function StepTamu({ tamuList, setTamuList }: Props) {
  const handleAddTamu = () => {
    setTamuList((prev: any[]) => [
      ...prev,
      { nama: '', jenis: '', catatan: '' }
    ]);
  };

  const handleRemoveTamu = (index: number) => {
    setTamuList((prev: any[]) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 pt-2 pb-60">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-8">
        {tamuList.map((tamu, idx) => (
          <div key={idx} className="relative bg-white border border-stone-200 shadow-sm rounded-2xl p-5 sm:p-6 pt-7 space-y-4 transition-all duration-200">
            <div className="absolute -top-3 left-5">
              <span className="inline-flex items-center justify-center px-3 py-1.5 bg-[#FDF9F0] border border-[#DCAF43]/30 text-[#DCAF43] rounded-full text-[10px] font-bold tracking-wide shadow-sm">
                Tamu #{idx + 1}
              </span>
            </div>
            <div className="absolute top-3 right-5">
              <button
                type="button"
                onClick={() => handleRemoveTamu(idx)}
                className="text-stone-400 hover:text-red-500 transition-all p-1.5 bg-stone-50 hover:bg-red-50 rounded-xl cursor-pointer hover:scale-105 active:scale-95 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Nama Tamu</label>
                <input
                  type="text"
                  placeholder="Nama Lengkap..."
                  value={tamu.nama || ''}
                  onChange={(e) => {
                    const l = [...tamuList];
                    l[idx].nama = e.target.value;
                    setTamuList(l);
                  }}
                  className="w-full px-3.5 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] transition-all font-medium shadow-sm"
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                 <div>
                    <label className="block text-[10px] sm:text-xs font-semibold text-stone-500 mb-1.5">Jenis</label>
                    <ComboBox
                      options={[
                        { label: 'VIP', value: 'VIP' },
                        { label: 'VVIP', value: 'VVIP' },
                        { label: 'Keluarga', value: 'Keluarga' },
                        { label: 'Rombongan', value: 'Rombongan' },
                        { label: 'Rekan Kerja', value: 'Rekan Kerja' },
                        { label: 'Lainnya', value: 'Lainnya' }
                      ]}
                      value={tamu.jenis || ''}
                      onChange={(val) => {
                        const l = [...tamuList];
                        l[idx].jenis = val;
                        setTamuList(l);
                      }}
                      placeholder="Pilih jenis tamu..."
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] sm:text-xs font-semibold text-stone-500 mb-1.5">Catatan</label>
                    <input
                      type="text"
                      placeholder="Catatan tambahan..."
                      value={tamu.catatan || ''}
                      onChange={(e) => {
                        const l = [...tamuList];
                        l[idx].catatan = e.target.value;
                        setTamuList(l);
                      }}
                      className="w-full px-3.5 py-2.5 text-sm border border-stone-200 bg-stone-50/20 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] transition-all font-medium shadow-sm"
                    />
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-start pt-2">
        <button
          type="button"
          onClick={handleAddTamu}
          className="flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-stone-800 bg-[#DCAF43]/15 border border-[#DCAF43]/25 hover:bg-[#DCAF43]/25 rounded-xl hover:border-[#DCAF43]/40 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-stone-700" />
          Tambah Tamu Khusus
        </button>
      </div>
    </div>
  );
}
