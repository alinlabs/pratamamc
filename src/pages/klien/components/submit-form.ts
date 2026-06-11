import { 
  saveKlienAkun, saveKlienKeluarga, saveKlienAcara, saveKlienVendor, saveKlienCatatan, saveKlienPengantin,
  getVendorData, saveVendorData
} from '../../../lib/api';

export const submitClientData = async (updatedData: any) => {
  try {
    const id_klien = updatedData.id_klien;
    
    // Automatic vendor identification, ID generation & registration
    if (updatedData.vendor) {
      try {
        const masterData = await getVendorData().catch(() => ({ vendors: [] }));
        const masterVendors = masterData?.vendors || [];
        const newVendorsToRegister: any[] = [];

        updatedData.vendor = updatedData.vendor.map((v: any) => {
          if (!v || !v.nama) return v;

          // Try to match with an existing master vendor by name & category (case-insensitive)
          const matched = masterVendors.find((mv: any) => 
            (mv.nama || '').toLowerCase().trim() === (v.nama || '').toLowerCase().trim() &&
            (mv.kategori || '').toLowerCase().trim() === (v.kategori || '').toLowerCase().trim()
          );

          if (matched) {
            return {
              ...v,
              id: matched.id,
              logo: matched.logo || v.logo || '',
              deskripsi: matched.deskripsi || v.deskripsi || ''
            };
          } else {
            // It's a brand new vendor! Generate a new master vendor ID
            const newId = v.id && v.id.startsWith('vdr-') && v.id !== 'vdr-0000' && !v.id.includes('custom')
              ? v.id 
              : `vdr-${Math.random().toString(36).substring(2, 9)}`;

            const newV = {
              ...v,
              id: newId
            };

            // Register this vendor to the SQL database of vendors (master table)
            const initialLetter = v.nama ? v.nama.trim().charAt(0).toUpperCase() : 'V';
            newVendorsToRegister.push({
              id: newId,
              nama: v.nama,
              kategori: v.kategori,
              logo: v.logo || `https://placehold.co/200x200/D9AB40/FFFFFF?text=${encodeURIComponent(initialLetter)}`,
              deskripsi: v.deskripsi || `Vendor ${v.kategori || 'Pernikahan'} Rekanan Baru`,
              whatsapp: v.whatsapp || '',
              tiktok: v.tiktok || '',
              instagram: v.instagram || '',
              facebook: v.facebook || '',
              youtube: v.youtube || '',
              website: v.website || '',
              peta: v.peta || '',
              verifikasi: false // set to false initially for client-submitted vendors
            });

            return newV;
          }
        });

        if (newVendorsToRegister.length > 0) {
          await Promise.all(
            newVendorsToRegister.map(vendorPayload => saveVendorData(vendorPayload))
          );
          console.log(`Success auto-registering ${newVendorsToRegister.length} new vendors to Cloud SQL master.`);
        }
      } catch (err) {
        console.error("Non-blocking error during vendor matching / registration:", err);
      }
    }
    
    // Attempt to save to SQL Backend if id_klien is available
    if (id_klien) {
      const dbPromises = [
        saveKlienAkun(updatedData),
        saveKlienKeluarga(id_klien, {
          keluarga_inti: updatedData.keluarga_inti || [],
          panitia_keluarga: updatedData.panitia_keluarga || [],
          tamu: updatedData.tamu || [],
          pendamping: updatedData.pendamping || [],
          pengisi_acara: updatedData.pengisi_acara || []
        }),
        saveKlienAcara(id_klien, updatedData.susunan_acara || []),
        saveKlienVendor(id_klien, {
          vendor: updatedData.vendor || updatedData.daftar_vendor || [],
          wedding_organizer: updatedData.wedding_organizer || updatedData.timWO || updatedData.tim_wo || []
        }),
        saveKlienCatatan(id_klien, updatedData.daftar_catatan || [])
      ];

      if (updatedData.pengantin) {
        dbPromises.push(saveKlienPengantin(id_klien, updatedData.pengantin));
      }

      await Promise.all(dbPromises).catch(e => console.error("Non-critical sync error: ", e));
    }

    return true;
  } catch (error) {
    console.error('Failed to process submission:', error);
    return false;
  }
};
