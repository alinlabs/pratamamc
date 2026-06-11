import React from 'react';
import { motion } from 'motion/react';
import LoadingSpinner from './screen-loading';

export default function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 text-center"
      id="page-loader-root"
    >
      <div id="page-loader-spinner-container" className="mb-4">
        <LoadingSpinner size={56} />
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="text-stone-500 font-medium tracking-wide text-sm animate-pulse"
        id="page-loader-text"
      >
        Memuat Halaman...
      </motion.p>
    </motion.div>
  );
}
