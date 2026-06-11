import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Share2, ExternalLink, Pencil, FolderOpen } from 'lucide-react';
import LoadingSpinner from '../../../components/screen-loading';

export default function GDriveView({ url, onEdit }: { url?: string; onEdit?: () => void }) {
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Tautan disalin!");
      }
    } catch(e) { console.error("Gagal membagikan", e); }
  };

  const getEmbedUrl = (rawUrl: string, mode: 'grid' | 'list'): string => {
    if (!rawUrl) return "";
    try {
      const trimmedUrl = rawUrl.trim();

      // 1. Folders pattern
      const folderMatch = trimmedUrl.match(/folders\/([a-zA-Z0-9-_]+)/);
      if (folderMatch && folderMatch[1]) {
        return `https://drive.google.com/embeddedfolderview?id=${folderMatch[1]}#${mode}`;
      }

      // 2. Open / edit / view query pattern with id parameter
      const urlObj = new URL(trimmedUrl);
      const idParam = urlObj.searchParams.get("id");
      if (idParam && trimmedUrl.includes("drive.google.com")) {
        return `https://drive.google.com/embeddedfolderview?id=${idParam}#${mode}`;
      }

      // 3. Document or file sharing pattern
      const fileMatch = trimmedUrl.match(/file\/d\/([a-zA-Z0-9-_]+)/);
      if (fileMatch && fileMatch[1]) {
        return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
      }

      // 4. Docs, Sheets, Slides, Forms pattern
      const docsMatch = trimmedUrl.match(/(document|spreadsheets|presentation|forms)\/d\/([a-zA-Z0-9-_]+)/);
      if (docsMatch && docsMatch[1] && docsMatch[2]) {
        return `https://docs.google.com/${docsMatch[1]}/d/${docsMatch[2]}/preview`;
      }
    } catch (e) {
      console.error("Gagal mendeteksi embed URL, memakai URL asli:", e);
    }
    return rawUrl;
  };

  const embedUrl = getEmbedUrl(url || "", viewMode);
  const isFolder = url && (url.includes("folders/") || url.includes("embeddedfolderview") || url.includes("u/0/folders"));

  if (!url) {
    return (
      <div className="py-2 sm:py-4 text-left">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-stone-800">
            <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[#DCAF43]" />
            G-Drive & Berkas
          </h2>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center justify-center p-2 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-lg transition-colors border-0"
                title="Edit URL G-Drive"
              >
                <Pencil className="w-5 h-5" strokeWidth={1.5} />
              </button>
            )}
            <button
              onClick={handleShare}
              className="flex items-center justify-center p-2 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-lg transition-colors border-0"
              title="Bagikan Tautan"
            >
              <Share2 className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-12 text-center bg-stone-50/50 rounded-2xl border border-dashed border-stone-200"
        >
          <FolderOpen className="w-8 h-8 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-500 text-sm mb-4">Google Drive belum dikonfigurasi.</p>
          {onEdit && (
              <button
                onClick={onEdit}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#DCAF43] text-white rounded-xl font-bold text-sm hover:bg-[#c99f3c] transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <FolderOpen className="w-4 h-4" />
                Atur Google Drive
              </button>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-2 sm:py-4 text-left">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-stone-800">
          <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[#DCAF43]" />
          G-Drive & Berkas
        </h2>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center justify-center p-2 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-lg transition-colors border-0"
              title="Edit URL G-Drive"
            >
              <Pencil className="w-5 h-5" strokeWidth={1.5} />
            </button>
          )}
          <button
            onClick={handleShare}
            className="flex items-center justify-center p-2 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-lg transition-colors border-0"
            title="Bagikan Tautan"
          >
            <Share2 className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 md:space-y-8"
      >
      <div className="flex flex-col gap-4">
        <div className="bg-[#a57a17]/5 border-l-4 border-[#a57a17] p-4 sm:p-5 rounded-r-xl">
          <p className="text-[#a57a17] font-semibold text-sm sm:text-base mb-1">
            Panduan Akses Media & Folder
          </p>
          <div className="text-[#a57a17]/90 text-[13px] leading-relaxed space-y-1">
            <p>💡 Tips: Masuk ke Akun Google Anda untuk melihat, mengunduh, atau mengunggah berkas secara langsung.</p>
            <p>🔗 Jika folder tidak termuat lengkap, silakan ketul tombol <strong>Buka Folder Asli</strong> di sudut kanan atas.</p>
          </div>
        </div>

        <div className="w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-stone-200/60 bg-white flex flex-col min-h-[75vh] md:min-h-[85vh] relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-stone-100 bg-stone-50/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-stone-150 bg-white shadow-xs">
                <svg viewBox="0 0 1443 1250" className="w-5 h-5">
                  <polygon points="481,0 962,0 1443,833 962,833" fill="#FFC107" />
                  <polygon points="0,833 481,0 722,417 241,1250" fill="#0F9D58" />
                  <polygon
                    points="241,1250 1202,1250 1443,833 481,833"
                    fill="#1A73E8"
                  />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base sm:text-lg font-bold text-stone-800">
                    Workspace Drive
                  </h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                    Terbuka
                  </span>
                </div>
                <p className="text-[11px] text-stone-500">Google Drive Integration Pro</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-1.5">
              {isFolder && (
                <div className="inline-flex bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs text-stone-600 mr-1">
                  <button
                    onClick={() => {
                      setViewMode('grid');
                      setIframeKey((prev) => prev + 1);
                    }}
                    className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                      viewMode === 'grid' 
                        ? 'bg-white text-stone-900 shadow-xs' 
                        : 'hover:text-stone-900'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('list');
                      setIframeKey((prev) => prev + 1);
                    }}
                    className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                      viewMode === 'list' 
                        ? 'bg-white text-stone-900 shadow-xs' 
                        : 'hover:text-stone-900'
                    }`}
                  >
                    Datar
                  </button>
                </div>
              )}
              
              <button
                onClick={() => {
                  setIframeLoading(true);
                  setIframeKey((prev) => prev + 1);
                }}
                className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl transition-all border border-stone-200 cursor-pointer shadow-sm"
                title="Muat Ulang"
              >
                <RefreshCw className={`w-4 h-4 ${iframeLoading ? 'animate-spin' : ''}`} />
              </button>
              
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:px-3.5 sm:py-2 bg-[#DCAF43] hover:bg-[#c99f35] text-white rounded-xl transition-all shadow-sm text-xs font-semibold flex items-center gap-1.5 cursor-pointer border-0"
                title="Buka Folder Asli di Tab Baru"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Buka Folder Asli</span>
              </a>
            </div>
          </div>

          {/* Iframe Viewport */}
          <div className="flex-1 w-full bg-stone-50 relative min-h-[60vh] md:min-h-[70vh] flex flex-col justify-stretch z-10">
            {iframeLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white gap-4 p-6 text-center">
                <LoadingSpinner size={48} className="mb-2" />
                <p className="text-stone-600 font-medium text-sm">Menghubungkan ke Drive...</p>
                <span className="text-xs text-stone-400">Harap tunggu sejenak</span>
              </div>
            )}
            <iframe
              key={iframeKey}
              src={embedUrl}
              className="flex-1 w-full h-full min-h-[60vh] md:min-h-[70vh] border-0 focus:outline-none focus:ring-0"
              allow="autoplay; clipboard-write; encrypted-media"
              onLoad={() => setIframeLoading(false)}
            />
          </div>
        </div>
      </div>
    </motion.div>
    </div>
  );
}
