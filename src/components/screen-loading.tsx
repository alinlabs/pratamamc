import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

export default function LoadingSpinner({ className = '', size = 48 }: LoadingSpinnerProps) {
  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`} 
      style={{ width: size, height: size }}
    >
      <div 
        className="absolute inset-0 rounded-full border-[3px] border-stone-200 border-t-[#DCAF43] animate-spin"
      />
      <img 
        src="/gambar/source/logo-favicon.ico" 
        alt="Loading" 
        className="absolute z-10 animate-pulse object-contain"
        style={{ width: size * 0.45, height: size * 0.45 }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/gambar/source/logo-color.png';
        }}
      />
    </div>
  );
}
