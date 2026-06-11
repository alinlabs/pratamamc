import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, ChevronDown, Calendar as CalendarIcon, Check, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, addMonths, subMonths, startOfMonth, startOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';

interface CustomSelectProps {
  label: string;
  options: string[];
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

  return (
    <div className="space-y-1.5 relative" ref={dropdownRef}>
      <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider ml-1">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white border ${isOpen ? 'border-stone-900 ring-2 ring-stone-900/10' : 'border-stone-200'} rounded-2xl px-4 py-3.5 text-left transition-all duration-300 hover:border-stone-400`}
      >
        <span className={value ? 'text-stone-900 font-medium' : 'text-stone-400'}>
          {value || placeholder || 'Pilih...'}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
          <ChevronDown className="w-5 h-5 text-stone-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
          >
            <div className="p-2 space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${value === opt ? 'bg-[#DCAF43] text-white' : 'hover:bg-stone-100 text-stone-700'}`}
                >
                  <span className="font-medium">{opt}</span>
                  {value === opt && <Check className="w-4 h-4" />}
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
            className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer text-sm font-medium transition-all duration-200
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
    <div className="space-y-1.5 relative" ref={dropdownRef}>
      <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider ml-1">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white border ${isOpen ? 'border-stone-900 ring-2 ring-stone-900/10' : 'border-stone-200'} rounded-2xl px-4 py-3.5 text-left transition-all duration-300 hover:border-stone-400`}
      >
        <div className="flex items-center gap-3">
          <CalendarIcon className={`w-5 h-5 ${value ? 'text-stone-900' : 'text-stone-400'}`} />
          <span className={value ? 'text-stone-900 font-medium' : 'text-stone-400'}>
            {value ? format(new Date(value), 'dd MMMM yyyy', { locale: id }) : 'Pilih Tanggal'}
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
            className="absolute z-50 w-full sm:w-[320px] left-0 mt-2 bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-5"
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
                {format(currentDate, 'MMMM yyyy', { locale: id })}
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
                <div key={day} className="w-10 text-center text-xs font-semibold text-stone-400">{day}</div>
              ))}
            </div>
            
            {renderCalendar()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function KontakPage() {
  const [formData, setFormData] = useState({
    nama: '',
    phone: '',
    event: '',
    tanggal: '',
    message: ''
  });

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.nama || !formData.phone || !formData.event || !formData.tanggal) {
      alert("Mohon lengkapi semua data event.");
      return;
    }
    const text = `Halo, saya ingin berdiskusi tentang acara saya.%0A%0A*Detail Acara:*%0ANama: ${formData.nama}%0ANo. WhatsApp: ${formData.phone}%0AJenis Acara: ${formData.event}%0ATanggal: ${formData.tanggal}%0A%0A*Pesan:*%0A${formData.message}`;
    window.open(`whatsapp://send?phone=6285797184059&text=${text}`, '_blank');
  };

  return (
    <section id="contact" className="pt-20 pb-16 min-h-screen bg-stone-50 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-[100px] opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-stone-200 rounded-full blur-[100px] opacity-60 translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      {/* Header Section */}
      <div className="pt-6 md:pt-12 pb-4 md:pb-6 px-4 md:px-6 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#DBB24E]/10 border border-[#DBB24E]/20 rounded-full text-xs font-medium text-[#DBB24E] tracking-wide uppercase mb-3 md:mb-5 shadow-sm">
              <MessageCircle className="w-3.5 h-3.5" />
              Let's Connect
            </div>
            <h2 className="text-3xl md:text-5xl font-sans font-bold mb-3 md:mb-4 text-stone-900 leading-tight">Mulai Diskusi</h2>
            <p className="hidden md:block text-stone-500 text-lg sm:text-xl font-light mb-4 md:mb-6 max-w-2xl mx-auto leading-relaxed">
              Ceritakan detail acara impian Anda, dan mari ciptakan momen tak terlupakan bersama.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10 pt-4 md:pt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-3xl p-6 md:p-12 rounded-3xl md:rounded-[3rem] shadow-2xl border border-white"
        >
          <div className="mb-8 md:mb-10 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2 md:mb-3">Acara Anda Saja</h3>
            <p className="text-stone-500 text-sm md:text-base leading-relaxed">Isi formulir ini dengan lengkap agar kami dapat memberikan layanan dan konsep terbaik untuk momen Anda.</p>
          </div>
          
          <form className="space-y-5" onSubmit={handleWhatsAppSubmit} onKeyDown={(e) => {
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
            <div className="grid md:grid-cols-2 gap-5 md:gap-6">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-semibold text-stone-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  id="name" 
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full bg-white border border-stone-200 rounded-2xl px-4 py-3.5 text-stone-900 focus:outline-none  focus:ring-0  transition-all font-medium placeholder:text-stone-300 placeholder:font-normal"
                  placeholder="Jhon Doe"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-xs font-semibold text-stone-500 uppercase tracking-wider ml-1">No. WhatsApp</label>
                <input 
                  type="text" 
                  id="phone" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-white border border-stone-200 rounded-2xl px-4 py-3.5 text-stone-900 focus:outline-none  focus:ring-0  transition-all font-medium placeholder:text-stone-300 placeholder:font-normal"
                  placeholder="0812..."
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-5 md:gap-6 z-20 relative">
              <CustomSelect
                label="Jenis Acara"
                value={formData.event}
                onChange={(val) => setFormData({...formData, event: val})}
                options={["Pernikahan", "Corporate Gathering", "Festival / Konser", "Ulang Tahun", "Lainnya"]}
                placeholder="Pilih Acara"
              />
              
              <CustomDatePicker
                label="Tanggal Acara"
                value={formData.tanggal}
                onChange={(val) => setFormData({...formData, tanggal: val})}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="message" className="text-xs font-semibold text-stone-500 uppercase tracking-wider ml-1">Pesan Tambahan</label>
              <textarea 
                id="message" 
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-white border border-stone-200 rounded-2xl px-4 py-3.5 text-stone-900 focus:outline-none  focus:ring-0  transition-all resize-none custom-scrollbar font-medium placeholder:text-stone-300 placeholder:font-normal"
                placeholder="Ceritakan ekspektasi / konsep acara..."
              ></textarea>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-stone-900 text-white font-bold py-4 rounded-2xl hover:bg-stone-800 transition-all mt-6 shadow-lg shadow-stone-900/20 flex justify-center items-center gap-2 group"
            >
              <span>Kirim via WhatsApp</span>
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
