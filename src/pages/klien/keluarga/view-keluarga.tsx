import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Users, Pencil, User, Share2, Mic2, ChevronDown } from 'lucide-react';
import ContactCard from '../../../components/modal-detail';

/* ==========================================================================
   1. KELUARGA INTI VIEW
   ========================================================================== */
interface KeluargaIntiProps {
  keluarga: { id?: string; peran: string; nama: string; nama_panggilan?: string; gambar?: string; whatsapp?: string; instagram?: string; contact?: string }[];
  pengantin?: any;
  onEdit?: () => void;
  onEditPengantin?: () => void;
}

export function KeluargaInti({ keluarga, pengantin, onEdit, onEditPengantin }: KeluargaIntiProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const isRoleAyahCPW = (peran: string) => peran.toLowerCase().includes('ayah cpw') || peran.toLowerCase().includes('ayah pengantin wanita') || peran.toLowerCase().includes('ayah mempelai wanita');
  const isRoleIbuCPW = (peran: string) => peran.toLowerCase().includes('ibu cpw') || peran.toLowerCase().includes('ibu pengantin wanita') || peran.toLowerCase().includes('ibu mempelai wanita');
  const isRoleAyahCPP = (peran: string) => peran.toLowerCase().includes('ayah cpp') || peran.toLowerCase().includes('ayah pengantin pria') || peran.toLowerCase().includes('ayah mempelai pria');
  const isRoleIbuCPP = (peran: string) => peran.toLowerCase().includes('ibu cpp') || peran.toLowerCase().includes('ibu pengantin pria') || peran.toLowerCase().includes('ibu mempelai pria');

  const ayahCpw = keluarga?.find(k => isRoleAyahCPW(k.peran));
  const ibuCpw = keluarga?.find(k => isRoleIbuCPW(k.peran));

  const ayahCpp = keluarga?.find(k => isRoleAyahCPP(k.peran));
  const ibuCpp = keluarga?.find(k => isRoleIbuCPP(k.peran));

  const isRoleCPW = (peran: string) => {
    const r = peran.toLowerCase();
    return (r.includes('pengantin wanita') || r.includes('cpw') || r.includes('mempelai wanita')) && !r.includes('ayah') && !r.includes('ibu');
  };
  const isRoleCPP = (peran: string) => {
    const r = peran.toLowerCase();
    return (r.includes('pengantin pria') || r.includes('cpp') || r.includes('mempelai pria')) && !r.includes('ayah') && !r.includes('ibu');
  };

  const coreMembers = [ayahCpw, ibuCpw, ayahCpp, ibuCpp].filter(Boolean);
  const otherMembers = keluarga?.filter(k => 
    !coreMembers.includes(k) && !isRoleCPW(k.peran) && !isRoleCPP(k.peran)
  ) || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-1"
    >
      <div>
        <div className="flex items-center justify-between gap-4 mb-6 w-full">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-stone-850">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#DCAF43]" />
            Keluarga Inti
          </h2>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-600 rounded-full transition-all shadow-sm active:scale-95 hover:scale-105 cursor-pointer"
                title="Edit Keluarga Inti"
              >
                <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-stone-500" strokeWidth={2} />
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-600 rounded-full transition-all shadow-sm active:scale-95 hover:scale-105 cursor-pointer"
              title="Toggle Keluarga Inti"
            >
              <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-stone-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} strokeWidth={2} />
            </button>
          </div>
        </div>
        
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden space-y-8"
            >
              <div className="space-y-8 pt-2">
                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-4 gap-6">
                  {ayahCpw ? (
                    <ContactCard key={ayahCpw.id || 'ayah-cpw'} nama={ayahCpw.nama} peran={ayahCpw.peran} nama_panggilan={ayahCpw.nama_panggilan} whatsapp={ayahCpw.whatsapp || ayahCpw.contact} instagram={ayahCpw.instagram} imageUrl={ayahCpw.gambar} />
                  ) : (
                    <ContactCard nama="" peran="Ayah Mempelai Wanita" />
                  )}
                  
                  {ibuCpw ? (
                    <ContactCard key={ibuCpw.id || 'ibu-cpw'} nama={ibuCpw.nama} peran={ibuCpw.peran} nama_panggilan={ibuCpw.nama_panggilan} whatsapp={ibuCpw.whatsapp || ibuCpw.contact} instagram={ibuCpw.instagram} imageUrl={ibuCpw.gambar} />
                  ) : (
                    <ContactCard nama="" peran="Ibu Mempelai Wanita" />
                  )}
                  
                  {ayahCpp ? (
                    <ContactCard key={ayahCpp.id || 'ayah-cpp'} nama={ayahCpp.nama} peran={ayahCpp.peran} nama_panggilan={ayahCpp.nama_panggilan} whatsapp={ayahCpp.whatsapp || ayahCpp.contact} instagram={ayahCpp.instagram} imageUrl={ayahCpp.gambar} />
                  ) : (
                    <ContactCard nama="" peran="Ayah Mempelai Pria" />
                  )}
                  
                  {ibuCpp ? (
                    <ContactCard key={ibuCpp.id || 'ibu-cpp'} nama={ibuCpp.nama} peran={ibuCpp.peran} nama_panggilan={ibuCpp.nama_panggilan} whatsapp={ibuCpp.whatsapp || ibuCpp.contact} instagram={ibuCpp.instagram} imageUrl={ibuCpp.gambar} />
                  ) : (
                    <ContactCard nama="" peran="Ibu Mempelai Pria" />
                  )}
                </div>

                {/* Mobile View */}
                <div className="md:hidden grid grid-cols-2 gap-x-3 gap-y-5">
                  <div className="flex flex-col gap-y-5">
                    {ayahCpw ? (
                      <ContactCard key={ayahCpw.id || 'ayah-cpw'} nama={ayahCpw.nama} peran={ayahCpw.peran} nama_panggilan={ayahCpw.nama_panggilan} whatsapp={ayahCpw.whatsapp || ayahCpw.contact} instagram={ayahCpw.instagram} imageUrl={ayahCpw.gambar} />
                    ) : (
                      <ContactCard nama="" peran="Ayah Mempelai Wanita" />
                    )}
                    
                    {ibuCpw ? (
                      <ContactCard key={ibuCpw.id || 'ibu-cpw'} nama={ibuCpw.nama} peran={ibuCpw.peran} nama_panggilan={ibuCpw.nama_panggilan} whatsapp={ibuCpw.whatsapp || ibuCpw.contact} instagram={ibuCpw.instagram} imageUrl={ibuCpw.gambar} />
                    ) : (
                      <ContactCard nama="" peran="Ibu Mempelai Wanita" />
                    )}
                  </div>

                  <div className="flex flex-col gap-y-5">
                    {ayahCpp ? (
                      <ContactCard key={ayahCpp.id || 'ayah-cpp'} nama={ayahCpp.nama} peran={ayahCpp.peran} nama_panggilan={ayahCpp.nama_panggilan} whatsapp={ayahCpp.whatsapp || ayahCpp.contact} instagram={ayahCpp.instagram} imageUrl={ayahCpp.gambar} />
                    ) : (
                      <ContactCard nama="" peran="Ayah Mempelai Pria" />
                    )}
                    
                    {ibuCpp ? (
                      <ContactCard key={ibuCpp.id || 'ibu-cpp'} nama={ibuCpp.nama} peran={ibuCpp.peran} nama_panggilan={ibuCpp.nama_panggilan} whatsapp={ibuCpp.whatsapp || ibuCpp.contact} instagram={ibuCpp.instagram} imageUrl={ibuCpp.gambar} />
                    ) : (
                      <ContactCard nama="" peran="Ibu Mempelai Pria" />
                    )}
                  </div>
                </div>

                {/* Other Members */}
                {otherMembers.length > 0 && (
                  <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-6 sm:gap-y-8 sm:grid-cols-3 lg:grid-cols-4 pt-8 border-t border-stone-200">
                    {otherMembers.map((k, index) => (
                      <ContactCard
                        key={`${k.id || 'keluarga'}-${index}`}
                        nama={k.nama}
                        peran={k.peran}
                        nama_panggilan={k.nama_panggilan}
                        whatsapp={k.whatsapp || k.contact}
                        instagram={k.instagram}
                        imageUrl={k.gambar}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   MAIN KELUARGA VIEW COMBINED WRAPPER
   ========================================================================== */
interface KeluargaViewProps {
  event: any;
  onEdit?: () => void;
}

export default function KeluargaView({ event, onEdit }: KeluargaViewProps) {
  const navigate = useNavigate();
  const { username } = useParams();

  const handleEditPengantin = onEdit ? () => navigate(`/${username}/pengantin/edit`) : undefined;

  return (
    <div className="flex flex-col gap-12">
      <KeluargaInti 
        keluarga={event.keluarga_inti} 
        pengantin={event.pengantin || event} 
        onEdit={onEdit} 
        onEditPengantin={handleEditPengantin} 
      />
    </div>
  );
}
