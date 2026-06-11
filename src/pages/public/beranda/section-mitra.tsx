import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getVendorData } from '../../../lib/api';

interface Partner {
  id: string;
  nama: string;
}

export default function Mitra() {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    getVendorData()
      .then(data => {
        let vendorArray = [];
        if (data && typeof data === 'object' && !Array.isArray(data)) {
           vendorArray = data.vendors || [];
        } else if (Array.isArray(data)) {
           vendorArray = data;
        }

        setPartners(vendorArray.map((v: any) => ({
          id: v.id,
          nama: v.nama
        })));
      })
      .catch(err => console.error("Failed to load vendors for mitra:", err));
  }, []);

  if (partners.length === 0) return null;

  // Duplicate the array to ensure a seamless loop
  const displayPartners = [...partners, ...partners, ...partners];

  return (
    <section className="py-6 md:py-10 bg-stone-50 border-b border-stone-200 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6 mb-6">
        <p className="text-xs md:text-sm font-bold text-stone-400 uppercase tracking-[0.2em] text-center">Dipercaya Oleh</p>
      </div>
      
      {/* Marquee Container */}
      <div className="relative flex overflow-hidden group scrollbar-hide">
        <motion.div
          className="flex whitespace-nowrap gap-16 px-8 items-center group-hover:[animation-play-state:paused]"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20,
          }}
        >
          {displayPartners.map((partner, index) => (
            <div 
              key={`${partner.id}-${index}`} 
              className="flex items-center gap-4 group/item cursor-default"
            >
              <span className="text-xl md:text-4xl font-extrabold text-stone-300/80 uppercase tracking-widest group-hover/item:text-stone-900 transition-colors duration-300">
                {partner.nama}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
