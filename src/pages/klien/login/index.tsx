import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { getKlienAkun } from '../../../lib/api';

interface LoginProps {
  username: string;
  onSuccess: (clientId: string, foundUsername?: string) => void;
  expectedClientId?: string;
  isGlobal?: boolean;
}

export default function Login({ username, onSuccess, expectedClientId, isGlobal = false }: LoginProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add('hide-nav-footer');
    return () => {
      document.body.classList.remove('hide-nav-footer');
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isGlobal) {
        // Global login logic: Look up all clients through dynamic API
        const data = await getKlienAkun();
        
        const inputValueLower = inputValue.trim().toLowerCase();
        const found = data.find((client: any) => 
          client.id_klien.toLowerCase() === inputValueLower || client.username.toLowerCase() === inputValueLower
        );
        setTimeout(() => {
          if (found) {
            setError('');
            // Ensure we return the correct clientId
            onSuccess(found.id_klien, found.username);
          } else {
            setError('ID Klien atau Nama Pengguna salah atau tidak ditemukan.');
            setIsLoading(false);
          }
        }, 600);
      } else {
        // Fallback to strict client-specific login
        setTimeout(() => {
          const inputValueLower = inputValue.trim().toLowerCase();
          if (
            (expectedClientId && inputValueLower === expectedClientId.toLowerCase()) || 
            inputValueLower === username.toLowerCase()
          ) {
            setError('');
            // Use expectedClientId if it matches, otherwise whatever logic we have
            onSuccess(expectedClientId || inputValue.trim());
          } else {
            setError('ID Klien / Nama Pengguna salah. Pastikan data yang dimasukkan sesuai.');
            setIsLoading(false);
          }
        }, 600);
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white lg:bg-stone-50 flex flex-col lg:flex-row overflow-hidden">
      {/* Hero Pane - Top on Mobile, Left on Desktop */}
      <div className="w-full flex-1 lg:h-screen lg:w-1/2 bg-stone-100 overflow-hidden relative z-0">
        <img 
          src="/gambar/banner/login.webp" 
          alt="Login Banner" 
          className="w-full h-full object-cover object-top lg:object-center"
        />
      </div>

      {/* Right Pane - Login Form Area */}
      <div className="w-full shrink-0 lg:h-screen lg:flex-none lg:w-1/2 flex flex-col items-center justify-end lg:justify-center px-6 sm:px-12 lg:px-12 xl:px-24 pt-6 pb-6 lg:pt-8 lg:pb-0 relative z-20 bg-white lg:bg-transparent shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.15)] lg:shadow-none rounded-t-[2.5rem] lg:rounded-none overflow-y-auto lg:overflow-y-visible -mt-6 lg:mt-0">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md lg:max-w-full mx-auto bg-white lg:bg-transparent rounded-3xl"
        >

          {/* Header Area */}
          <div className="flex flex-col items-center justify-center gap-3 lg:gap-4 mb-3 lg:mb-3">
            <h2 className="text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight text-center">
              Masuk
            </h2>
          </div>
          
          <p className="text-stone-500 mb-5 lg:mb-8 text-sm leading-relaxed text-center">
            Satu tempat untuk semua detail dan rencana acaramu.
          </p>

          <form id="login-form" onSubmit={handleSubmit} className="space-y-4 lg:space-y-6" onKeyDown={(e) => {
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
            <div>
              <div className="relative group">
                <input
                  id="clientId"
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    // Block spaces, allow alphanumeric, dashes, ampersand, and at-sign
                    const val = e.target.value.replace(/[^a-zA-Z0-9-&@]/g, '');
                    setInputValue(val);
                  }}
                  placeholder="Tulis ID atau Nama Pengguna"
                  disabled={isLoading}
                  className={`w-full px-5 py-4 rounded-xl border-2 ${
                    error 
                      ? 'border-red-200 focus:border-red-500 bg-red-50' 
                      : 'border-stone-100 focus:border-[#DCAF43] bg-stone-50/50 group-hover:border-stone-200'
                  } focus:bg-white focus:outline-none focus:ring-0 transition-all font-medium text-stone-800 placeholder:text-stone-400`}
                />
              </div>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 font-medium"
                >
                  {error}
                </motion.p>
              )}
            </div>

            {/* Button visible on all devices */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 px-6 py-4 bg-[#DCAF43] hover:bg-[#C89B32] text-white rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg shadow-[#DCAF43]/20"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Masuk</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
            
            <div className="flex items-center gap-4 mt-6 mb-4">
              <div className="h-px bg-stone-200 flex-1"></div>
              <button 
                onClick={() => onSuccess("usr-001", "mempelai")} 
                type="button"
                className="text-stone-400 hover:text-stone-600 font-medium text-xs whitespace-nowrap"
              >
                Masuk Mode Demo
              </button>
              <div className="h-px bg-stone-200 flex-1"></div>
            </div>
          </form>

          <div className="mt-2 lg:mt-4 text-center">
            <p className="text-[11px] lg:text-xs text-stone-400 font-medium leading-relaxed mb-4">
              Mengalami kendala login? Silakan{' '}
              <a 
                href={`whatsapp://send?phone=6285797184059&text=${encodeURIComponent("Halo Admin! saya klien Pratama MC mengalami kendala login.\n\nBisa untuk segera di bantu?")}`}
                className="font-bold text-[#DCAF43] hover:text-[#C89B32] transition-colors"
              >
                Hubungi Admin
              </a>
              {' '}atau{' '}
              <Link to="/" className="font-bold text-[#DCAF43] hover:text-[#C89B32] transition-colors">
                Kembali ke Beranda
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
