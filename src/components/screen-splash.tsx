import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 7000;
    const interval = 50;
    const step = (100 * interval) / duration;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    const timeout = setTimeout(() => {
      onComplete();
    }, duration + 500);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col bg-stone-900 overflow-hidden"
    >
      <div className="flex-grow w-full h-full relative">
        <picture>
          <source media="(min-width: 768px)" srcSet="/gambar/source/splash-desktop.webp" />
          <img 
            src="/gambar/source/splash-mobile.webp" 
            alt="Splash Screen" 
            className="w-full h-full object-cover object-center absolute inset-0"
          />
        </picture>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-stone-900/50">
        <motion.div 
          className="h-full bg-[#D4A73C]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
}
