import React, { useState, useEffect, useRef } from 'react';
import { 
  CalendarDays, 
  Clock, 
  Plus, 
  Trash2, 
  Download,
  Copy,
  CheckCircle2,
  ChevronDown,
  Calendar as CalendarIcon,
  Check,
  CalendarPlus,
  Wallet,
  Users,
  PieChart,
  GripVertical
} from 'lucide-react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'motion/react';
import { format, addMonths, subMonths, startOfMonth, startOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { jsPDF } from 'jspdf';
import { NavigasiPublic as Navigasi } from '../../../pages/public/components/navigasi-public';
import FooterPublic from '../../../pages/public/components/footer-public';

// Template Data
const templates = {
  weddingSunda: [
    { id: '1', waktu: '00:00', judul: 'Persiapan & Mapag Mempelai Pria', deskripsi: 'Keluarga Mempelai Pria tiba di lokasi. Disambut oleh keluarga Mempelai Wanita dengan tarian mapag.' },
    { id: '2', waktu: '00:00', judul: 'Serah Terima Mempelai', deskripsi: 'Sambutan penyerahan dari perwakilan Mempelai Pria dan penerimaan dari perwakilan Mempelai Wanita.' },
    { id: '3', waktu: '00:00', judul: 'Akad Nikah', deskripsi: 'Pembacaan ayat suci Al-Quran, Khotbah Nikah, Ijab Kabul, Doa, dan Penandatanganan Buku Nikah.' },
    { id: '4', waktu: '00:00', judul: 'Upacara Adat Panggih / Sunda (Mapag Panganten)', deskripsi: 'Nincak endog, huap lingkung, pabetot bakakak.' },
    { id: '5', waktu: '00:00', judul: 'Sungkeman', deskripsi: 'Kedua mempelai memohon doa restu kepada kedua orang tua.' },
    { id: '6', waktu: '00:00', judul: 'Resepsi & Ramah Tamah', deskripsi: 'Pemberian ucapan selamat dari tamu undangan, sesi foto, dan hiburan.' },
    { id: '7', waktu: '00:00', judul: 'Penutupan', deskripsi: 'Acara selesai.' }
  ],
  weddingNasional: [
    { id: '1', waktu: '00:00', judul: 'Persiapan Akad', deskripsi: 'Kedua keluarga berkumpul. Pengecekan berkas oleh penghulu.' },
    { id: '2', waktu: '00:00', judul: 'Akad Nikah', deskripsi: 'Prosesi ijab kabul, pemasangan cincin, dan penyerahan mahar.' },
    { id: '3', waktu: '00:00', judul: 'Sungkeman & Sesi Foto Inti', deskripsi: 'Sungkeman kepada orang tua dilanjutkan foto keluarga inti.' },
    { id: '4', waktu: '00:00', judul: 'Resepsi & Hiburan', deskripsi: 'Mempelai memasuki ruangan, pemotongan kue, ramah tamah tamu, dan hiburan musik.' }
  ],
  tunangan: [
    { id: '1', waktu: '00:00', judul: 'Pembukaan & Penyambutan', deskripsi: 'Keluarga pihak pria tiba dan disambut keluarga wanita.' },
    { id: '2', waktu: '00:00', judul: 'Penyampaian Maksud & Tujuan', deskripsi: 'Juru bicara pihak pria menyampaikan maksud lamaran.' },
    { id: '3', waktu: '00:00', judul: 'Jawaban Lamaran', deskripsi: 'Juru bicara pihak wanita memberikan jawaban atas lamaran.' },
    { id: '4', waktu: '00:00', judul: 'Tukar Cincin', deskripsi: 'Pemasangan cincin sebagai simbol ikatan.' },
    { id: '5', waktu: '00:00', judul: 'Ramah Tamah & Penutup', deskripsi: 'Makan bersama, sesi foto, dan doa penutup.' }
  ],
  kosong: []
};

const predefinedVendors: Record<string, string[]> = {
  'Venue': ['Gedung Serbaguna', 'Hotel Bintang 4', 'Outdoor Garden', 'Villa Resort'],
  'Catering': ['Berkah Catering', 'Puspa Catering', 'Rasa Nusantara', 'Nikmat Catering'],
  'Dekorasi': ['Indah Decor', 'Mewah Decoration', 'Classic Rustic'],
  'MUA & Busana': ['Cantik MUA', 'Ratu Make Up', 'Elegance Attire'],
  'Dokumentasi': ['Nema Film', 'Pratama Cinema', 'Lensa Foto'],
  'MC & Hiburan': ['Pratama MC', 'Gita Music', 'Harmoni Band'],
  'WO / Planner': ['Lancar WO', 'Sukses Planner', 'Sahabat Wedding'],
  'Lainnya': []
};

type RundownItem = {
  id: string;
  waktu: string;
  judul: string;
  deskripsi: string;
};

type BudgetItem = {
  id: string;
  kategori: string;
  nama: string;
  estimated: number;
  actual: number;
};

const vendorCategories = ['Venue', 'Catering', 'Dekorasi', 'MUA & Busana', 'Dokumentasi', 'MC & Hiburan', 'WO / Planner', 'Lainnya'];

const formatTimeInput = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
};

interface CustomSelectProps {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="space-y-1.5 relative w-full" ref={dropdownRef}>
      {label && <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider ml-1">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white border ${isOpen ? 'border-stone-900 ring-2 ring-stone-900/10' : 'border-stone-200'} rounded-2xl px-4 py-3.5 text-left transition-all duration-300 hover:border-stone-400`}
      >
        <span className={selectedOption ? 'text-stone-900 font-medium line-clamp-1' : 'text-stone-400'}>
          {selectedOption ? selectedOption.label : (placeholder || 'Pilih...')}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
          <ChevronDown className="w-5 h-5 text-stone-400 flex-shrink-0" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
          >
            <div className="p-2 space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${value === opt.value ? 'bg-[#DCAF43] text-white' : 'hover:bg-stone-100 text-stone-700'}`}
                >
                  <span className="font-medium text-sm md:text-base line-clamp-1">{opt.label}</span>
                  {value === opt.value && <Check className="w-4 h-4 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CustomDatePicker: React.FC<{ label: string; value: string; onChange: (val: string) => void }> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(value ? new Date(value) : new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        
        days.push(
          <div
            key={day.toString()}
            className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full cursor-pointer text-sm font-medium transition-all duration-200
              ${!isSameMonth(day, monthStart) ? 'text-stone-300' : 
                value && isSameDay(day, new Date(value)) ? 'bg-[#DCAF43] text-white shadow-md' : 'text-stone-700 hover:bg-stone-100'
              }
            `}
            onClick={() => {
              onChange(format(cloneDay, 'yyyy-MM-dd'));
              setIsOpen(false);
            }}
          >
            {formattedDate}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="flex justify-between w-full mt-2" key={i}>{days}</div>);
      days = [];
    }
    return rows;
  };

  return (
    <div className="space-y-1.5 relative w-full" ref={dropdownRef}>
      <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider ml-1">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white border ${isOpen ? 'border-stone-900 ring-2 ring-stone-900/10' : 'border-stone-200'} rounded-2xl px-4 py-3.5 text-left transition-all duration-300 hover:border-stone-400`}
      >
        <div className="flex items-center gap-3">
          <CalendarIcon className={`w-5 h-5 ${value ? 'text-stone-900' : 'text-stone-400'}`} />
          <span className={value ? 'text-stone-900 font-medium' : 'text-stone-400'}>
            {value ? format(new Date(value), 'dd MMMM yyyy', { locale: localeId }) : 'Pilih Tanggal'}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 w-[280px] sm:w-[320px] left-0 mt-2 bg-white/95 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-5"
            style={{ boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
          >
            <div className="flex justify-between items-center mb-4">
              <button 
                type="button"
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <ChevronDown className="w-5 h-5 rotate-90 text-stone-600" />
              </button>
              <h4 className="font-bold text-stone-900">
                {format(currentDate, 'MMMM yyyy', { locale: localeId })}
              </h4>
              <button 
                type="button"
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <ChevronDown className="w-5 h-5 -rotate-90 text-stone-600" />
              </button>
            </div>
            
            <div className="flex justify-between mb-2">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                <div key={day} className="w-9 sm:w-10 text-center text-xs font-semibold text-stone-400">{day}</div>
              ))}
            </div>
            
            {renderCalendar()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface RundownItemCardProps {
  item: RundownItem;
  onItemChange: (id: string, field: keyof RundownItem, value: string) => void;
  onRemove: (id: string) => void;
}

const RundownItemCard: React.FC<RundownItemCardProps> = ({ item, onItemChange, onRemove }) => {
  const controls = useDragControls();

  return (
    <Reorder.Item 
      value={item}
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      dragListener={false}
      dragControls={controls}
      className="group flex flex-col md:flex-row gap-4 p-5 md:p-6 border border-stone-200/60 rounded-3xl hover:border-transparent hover:shadow-xl hover:shadow-stone-200/40 transition-all bg-white relative"
    >
      {/* Drag Handle */}
      <div 
        className="absolute left-2 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing text-stone-300 hover:text-stone-500 transition-colors md:-ml-2"
        onPointerDown={(e) => controls.start(e)}
        style={{ touchAction: 'none' }}
      >
        <GripVertical className="w-5 h-5 hidden md:block" />
      </div>
      <div 
        className="flex items-center justify-center cursor-grab active:cursor-grabbing text-stone-300 hover:text-stone-500 transition-colors md:hidden bg-stone-50 rounded-full w-10 h-10 mx-auto -mt-2 mb-2 border border-stone-100"
        onPointerDown={(e) => controls.start(e)}
        style={{ touchAction: 'none' }}
      >
        <GripVertical className="w-5 h-5" />
      </div>

      {/* Time Section */}
      <div className="w-full md:w-28 flex-shrink-0 bg-stone-50/50 p-3 md:p-4 rounded-2xl border border-stone-100 md:ml-4">
        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2 flex items-center gap-2">
           Waktu
        </label>
        <div className="flex items-center">
          <input 
            type="text" 
            value={item.waktu}
            onChange={(e) => {
              const raw = e.target.value;
              const sanitized = raw.replace(/[^0-9:]/g, '');
              onItemChange(item.id, 'waktu', sanitized);
            }}
            placeholder="00:00"
            maxLength={5}
            className="w-full text-sm font-semibold text-stone-700 bg-transparent focus:outline-none py-1 text-left"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="mb-2">
          <input 
            type="text" 
            value={item.judul}
            onChange={(e) => onItemChange(item.id, 'judul', e.target.value)}
            placeholder="Judul Kegiataan"
            className="w-full font-bold text-lg text-stone-900 bg-transparent focus:outline-none placeholder:text-stone-300"
          />
        </div>
        
        <textarea 
          value={item.deskripsi}
          onChange={(e) => onItemChange(item.id, 'deskripsi', e.target.value)}
          placeholder="Tambahkan detail, petugas, atau instruksi khusus..."
          rows={2}
          className="w-full text-sm font-medium text-stone-500 bg-transparent focus:outline-none resize-none overflow-hidden placeholder:text-stone-300 placeholder:font-normal custom-scrollbar"
        />
      </div>

      {/* Actions (Delete) */}
      <div className="absolute right-3 top-3 md:relative md:right-auto md:top-auto flex md:flex-col justify-start gap-1">
        <button 
          onClick={() => onRemove(item.id)}
          className="p-2.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
          title="Hapus"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

    </Reorder.Item>
  );
};

export default function Rencana() {
  const [activeTab, setActiveTab] = useState<'jadwal' | 'budget'>('jadwal');
  
  // Jadwal State
  const [items, setItems] = useState<RundownItem[]>(templates.weddingSunda);
  const [eventName, setEventName] = useState('Pernikahan Impian');
  const [eventDate, setEventDate] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('weddingSunda');
  const [copied, setCopied] = useState(false);

  // Budget State
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: '1', kategori: 'Venue', nama: 'Sewa Gedung', estimated: 15000000, actual: 0 },
    { id: '2', kategori: 'Catering', nama: 'Konsumsi 500 Pax', estimated: 30000000, actual: 0 }
  ]);
  const [targetBudget, setTargetBudget] = useState(50000000);

  // Jadwal Handlers
  const handleTemplateChange = (val: string) => {
    const templateKey = val as keyof typeof templates;
    setSelectedTemplate(templateKey);
    setItems([...templates[templateKey]]);
  };

  const handleAddItem = () => {
    const newItem: RundownItem = { id: Date.now().toString(), waktu: '00:00', judul: 'Acara Baru', deskripsi: '' };
    setItems([...items, newItem]);
  };

  const handleItemChange = (id: string, field: keyof RundownItem, value: string) => {
    if (field === 'waktu') {
      // Hanya menerima angka, ambil maks 4 digit
      const digits = value.replace(/\D/g, '').slice(0, 4);
      let formattedValue = digits;
      if (digits.length > 2) {
        formattedValue = `${digits.slice(0, 2)}:${digits.slice(2)}`;
      }

      const index = items.findIndex(item => item.id === id);
      if (index !== -1) {
        const prevValue = items[index].waktu;
        const newItems = [...items];
        newItems[index] = { ...newItems[index], waktu: formattedValue };
        
        // Propagate when fully formatted (e.g., "08:00")
        if (formattedValue.length === 5) {
          const valueToMatch = prevValue;
          for (let j = index + 1; j < newItems.length; j++) {
            const val = newItems[j].waktu || '';
            if (val === '' || val === valueToMatch) {
              newItems[j] = { ...newItems[j], waktu: formattedValue };
            } else {
              break; // Stop propagating if we hit a customized time
            }
          }
        }
        setItems(newItems);
        return;
      }
    }
    
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Budget Handlers
  const handleAddBudget = () => {
    setBudgetItems([...budgetItems, { id: Date.now().toString(), kategori: 'Lainnya', nama: 'Item Baru', estimated: 0, actual: 0 }]);
  };

  const handleBudgetChange = (id: string, field: keyof BudgetItem, value: string | number) => {
    setBudgetItems(budgetItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const copyToClipboard = () => {
    let text = `Jadwal Acara: ${eventName}\n`;
    if (eventDate) text += `Tanggal: ${eventDate}\n\n`;
    
    items.forEach(item => {
      text += `[${item.waktu}] ${item.judul}\n`;
      if (item.deskripsi) text += `${item.deskripsi}\n`;
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  const parseCurrencyInput = (val: string) => {
    return Number(val.replace(/[^0-9]/g, ''));
  };

  const totalEstimated = budgetItems.reduce((acc, curr) => acc + curr.estimated, 0);
  const totalActual = budgetItems.reduce((acc, curr) => acc + curr.actual, 0);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-16 pt-20 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-[100px] opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-stone-200 rounded-full blur-[100px] opacity-60 translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      {/* Header Section */}
      <section className="pt-6 md:pt-12 pb-2 md:pb-4 px-0 md:px-6 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#DBB24E]/10 border border-[#DBB24E]/20 rounded-full text-xs font-medium text-[#DBB24E] tracking-wide uppercase mb-3 md:mb-5 shadow-sm">
                <CalendarPlus className="w-3.5 h-3.5" />
                Wedding Planner Tools
            </div>
            <h1 className="text-3xl md:text-5xl font-sans font-bold mb-3 md:mb-4 text-stone-900 leading-tight">
              Persiapan Acara & Wedding Organizer
            </h1>
            <p className="hidden md:block text-stone-500 text-lg sm:text-xl font-light mb-4 md:mb-6 max-w-2xl mx-auto leading-relaxed">
              Kalkulator budget, susunan jadwal, dan pemilihan vendor Master of Ceremony (MC) terbaik untuk menyempurnakan rencana Wedding Event impian Anda di Purwakarta, Bekasi, dan Jakarta.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10 pt-0 md:pt-2">
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white border border-stone-200 p-1.5 rounded-[1.25rem] inline-flex md:gap-2 shadow-sm">
            <button
              onClick={() => setActiveTab('jadwal')}
              className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'jadwal' ? 'bg-[#DCAF43] text-white shadow-md' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'}`}
            >
              <CalendarDays className="w-4 h-4 hidden sm:block" />
              Susunan Acara
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'budget' ? 'bg-[#DCAF43] text-white shadow-md' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'}`}
            >
              <Wallet className="w-4 h-4 hidden sm:block" />
              Rencana Budget
            </button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={activeTab}
          transition={{ duration: 0.4 }}
          className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl shadow-stone-200/50 rounded-[2.5rem] overflow-visible mb-8 relative pb-2 md:pb-6"
        >
          {activeTab === 'jadwal' && (
            <>
              {/* Header Controls */}
              <div className="p-6 md:p-8 border-b border-stone-100 flex flex-col md:flex-row gap-6 justify-between items-start">
                <div className="flex-1 w-full space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider ml-1">Nama Acara</label>
                    <input 
                      type="text" 
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      placeholder="Contoh: Pernikahan Impian"
                      className="w-full text-xl md:text-2xl font-bold bg-transparent border-b-2 border-stone-200  focus:outline-none pb-2 transition-colors placeholder:text-stone-300"
                    />
                  </div>
                  
                  <div className="w-full sm:w-2/3 md:w-3/4">
                    <CustomDatePicker
                      label="Tanggal Acara"
                      value={eventDate}
                      onChange={(val) => setEventDate(val)}
                    />
                  </div>
                </div>

                <div className="w-full md:w-[320px]">
                  <CustomSelect
                    label="Mulai Dengan Template"
                    value={selectedTemplate}
                    onChange={handleTemplateChange}
                    options={[
                      { value: 'weddingSunda', label: 'Pernikahan Adat Sunda' },
                      { value: 'weddingNasional', label: 'Pernikahan Nasional' },
                      { value: 'tunangan', label: 'Pertunangan / Lamaran' },
                      { value: 'kosong', label: 'Mulai Dari Kosong' }
                    ]}
                  />
                </div>
              </div>

              {/* Rundown List */}
              <div className="p-4 md:p-8 print:p-0">
                <div className="max-w-3xl mx-auto">
                  <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-4 md:space-y-5 print:space-y-4">
                    <AnimatePresence>
                      {items.map((item) => (
                        <RundownItemCard 
                          key={item.id}
                          item={item}
                          onItemChange={handleItemChange}
                          onRemove={(id) => setItems(items.filter(i => i.id !== id))}
                        />
                      ))}
                    </AnimatePresence>
                  </Reorder.Group>

                  {items.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-center py-20 px-6 border-2 border-dashed border-stone-200/80 rounded-[2.5rem] bg-stone-50/30"
                    >
                      <CalendarDays className="w-10 h-10 text-stone-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-stone-900 mb-2">Belum Ada Kegiatan</h3>
                      <p className="text-stone-500 text-sm">Mulai tambahkan kegiatan acara Anda.</p>
                    </motion.div>
                  )}

                  <motion.button 
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddItem}
                    className="w-full py-6 mt-6 border-2 border-dashed border-stone-200 hover:border-stone-800 rounded-[2rem] text-stone-500 font-bold hover:text-stone-900 bg-stone-50/50 hover:bg-stone-50 transition-all flex items-center justify-center gap-3"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Tambah Kegiatan Baru</span>
                  </motion.button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'budget' && (
            <div className="p-4 md:p-8 space-y-6">
              
              {/* Budget Summary Tracker */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-stone-50 rounded-3xl p-6 border border-stone-100 flex flex-col justify-center">
                  <p className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2">Target Budget</p>
                  <input
                    type="text"
                    value={formatCurrency(targetBudget)}
                    onChange={(e) => setTargetBudget(parseCurrencyInput(e.target.value))}
                    className="text-2xl md:text-3xl font-bold text-stone-900 bg-transparent border-none focus:outline-none p-0"
                  />
                </div>
                <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100 flex flex-col justify-center">
                  <p className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-2">Estimasi Pengeluaran</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-orange-700">{formatCurrency(totalEstimated)}</h3>
                </div>
                <div className="bg-green-50 rounded-3xl p-6 border border-green-100 flex flex-col justify-center">
                  <p className="text-sm font-semibold text-green-700 uppercase tracking-wider mb-2">Aktual Pengeluaran</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-green-800">{formatCurrency(totalActual)}</h3>
                </div>
              </div>

              {/* Status Bar */}
              <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden mb-8 relative">
                 <div className={`h-full absolute left-0 top-0 transition-all ${totalEstimated > targetBudget ? 'bg-red-500' : 'bg-[#DBB24E]'}`} style={{ width: `${Math.min((totalEstimated / targetBudget) * 100, 100)}%` }} />
              </div>

              <div className="hidden md:flex gap-4 px-6 text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                 <div className="w-48">Kategori</div>
                 <div className="flex-1">Nama Item / Vendor</div>
                 <div className="w-48">Estimasi</div>
                 <div className="w-48">Aktual</div>
                 <div className="w-10"></div>
              </div>

              <AnimatePresence>
                {budgetItems.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col md:flex-row gap-4 p-4 mb-4 border border-stone-200/60 rounded-3xl bg-white hover:border-stone-300 transition-all items-start md:items-center relative group"
                  >
                     <div className="w-full md:w-48 relative">
                       <label className="text-xs text-stone-500 md:hidden mb-1 block">Kategori</label>
                       <CustomSelect
                         label=""
                         value={item.kategori}
                         onChange={(val) => handleBudgetChange(item.id, 'kategori', val)}
                         options={vendorCategories.map(c => ({ value: c, label: c }))}
                       />
                     </div>
                     <div className="w-full flex-1">
                       <label className="text-xs text-stone-500 md:hidden mb-1 block">Nama Item / Vendor</label>
                       <input
                         type="text"
                         list={`vendors-${item.id}`}
                         value={item.nama}
                         onChange={(e) => handleBudgetChange(item.id, 'nama', e.target.value)}
                         className="w-full px-4 py-3 bg-stone-50 border border-transparent rounded-2xl focus:bg-white  font-medium text-stone-900 transition-all"
                         placeholder="Pilih atau ketik nama vendor..."
                       />
                       <datalist id={`vendors-${item.id}`}>
                         {predefinedVendors[item.kategori]?.map(vendor => (
                           <option key={vendor} value={vendor} />
                         ))}
                       </datalist>
                     </div>
                     <div className="w-full md:w-48">
                       <label className="text-xs text-stone-500 md:hidden mb-1 block">Estimasi (Rp)</label>
                       <input
                         type="text"
                         value={formatCurrency(item.estimated).replace('Rp', '').trim()}
                         onChange={(e) => handleBudgetChange(item.id, 'estimated', parseCurrencyInput(e.target.value))}
                         className="w-full px-4 py-3 bg-white border border-stone-200 rounded-2xl focus:border-[#DBB24E] font-bold text-stone-900 transition-all text-left md:text-right"
                       />
                     </div>
                     <div className="w-full md:w-48">
                       <label className="text-xs text-green-600 md:hidden mb-1 block">Aktual (Rp)</label>
                       <input
                         type="text"
                         value={formatCurrency(item.actual).replace('Rp', '').trim()}
                         onChange={(e) => handleBudgetChange(item.id, 'actual', parseCurrencyInput(e.target.value))}
                         className="w-full px-4 py-3 bg-green-50/50 border border-green-200 rounded-2xl focus:border-green-500 font-bold text-green-800 transition-all text-left md:text-right"
                       />
                     </div>
                     <button onClick={() => setBudgetItems(budgetItems.filter(i => i.id !== item.id))} className="absolute top-2 right-2 md:relative md:top-auto md:right-auto p-2 text-stone-300 hover:text-red-500 transition-colors">
                        <Trash2 className="w-5 h-5" />
                     </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <button onClick={handleAddBudget} className="w-full py-5 border-2 border-dashed border-stone-200 rounded-3xl text-stone-500 font-bold hover:text-stone-900 hover:border-stone-800 hover:bg-stone-50 transition-all flex justify-center items-center gap-2">
                <Plus className="w-5 h-5" /> Tambah Item Budget
              </button>
            </div>
          )}

        </motion.div>

        {/* Global Actions - only visible in jadwal for now or generic if we want */}
        {activeTab === 'jadwal' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button 
              onClick={copyToClipboard}
              className="flex-1 py-4 px-6 bg-stone-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/20 active:scale-95"
            >
              {copied ? 'Tersalin!' : 'Salin Teks Jadwal'}
            </button>
            
            <a
              href={`https://wa.me/6285797184059?text=${encodeURIComponent(`Halo Pratama MC, saya ingin berkonsultasi mengenai persiapan acara saya.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-4 px-6 bg-white border border-stone-200 text-stone-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-50 transition-all active:scale-95"
            >
              Konsultasi MC via WA
            </a>
          </motion.div>
        )}

      </div>
    </div>
  );
}

