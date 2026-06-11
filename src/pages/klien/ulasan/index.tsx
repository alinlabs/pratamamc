import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Star, Send, Share2 } from 'lucide-react';

interface UlasanProps {
  clientId: string;
  clientName: string;
}

export default function Ulasan({ clientId, clientName }: UlasanProps) {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [ulasan, setUlasan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch logic or any existing ulasan could go here

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ulasan.trim()) return;

    setSubmitting(true);
    try {
      // In CF Workers/D1 we would do a POST request
      const payload = {
        id_klien: clientId,
        nama_klien: clientName,
        rating,
        pesan: ulasan
      };
      
      const response = await fetch('/api/testimoni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error('Gagal mengirim ulasan');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat mengirim ulasan. Silahkan coba lagi nanti.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-stone-200 text-center max-w-2xl mx-auto my-8"
      >
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-3">Terima Kasih!</h2>
        <p className="text-stone-600 mb-8">
          Ulasan Anda sangat berarti bagi kami. Kami senang bisa menjadi bagian dari hari spesial Anda.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 max-w-3xl mx-auto my-6"
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-stone-800">
          <Star className="w-5 h-5 sm:w-6 sm:h-6 text-[#DCAF43]" />
          Ulasan
        </h2>
        <button
          onClick={async () => {
            try {
              if (navigator.share) {
                await navigator.share({ title: document.title, url: window.location.href });
              } else {
                await navigator.clipboard.writeText(window.location.href);
                alert("Tautan disalin!");
              }
            } catch(e) { console.error("Gagal membagikan", e); }
          }}
          className="flex items-center justify-center p-2 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-lg transition-colors border-0"
          title="Bagikan Tautan"
        >
          <Share2 className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>
      <div className="text-center mb-8">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 mb-2">Bagaimana Pengalaman Anda?</h2>
        <p className="text-stone-500 text-sm">
          Bagikan pendapat dan kesan Anda terhadap layanan kami untuk membantu kami terus berkembang.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" onKeyDown={(e) => {
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
        <div className="flex flex-col items-center gap-3">
          <label className="text-sm font-medium text-stone-700">Penilaian Anda</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform hover:scale-110"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Star 
                  className={`w-8 h-8 sm:w-10 sm:h-10 ${
                    star <= (hoveredRating || rating) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-stone-300'
                  } transition-colors`} 
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-500 mb-2 text-left">Pesan & Kesan</label>
          <textarea
            required
            value={ulasan}
            onChange={(e) => setUlasan(e.target.value)}
            placeholder="Ceritakan pengalaman luar biasa Anda bersama tim kami..."
            className="w-full px-4 py-3 min-h-[160px] text-base border border-stone-200 bg-stone-50/30 hover:bg-white focus:bg-white rounded-xl focus:ring-0 focus:ring-0 focus:border-[#DCAF43] focus:outline-none focus:ring-0 text-stone-800 transition-all resize-y shadow-sm"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !ulasan.trim()}
          className="w-full py-3.5 sm:py-4 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          {submitting ? 'Mengirim...' : (
            <>
              <Send className="w-4 h-4 text-stone-300" />
              Kirim Ulasan
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
