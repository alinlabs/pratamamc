import React from 'react';

export default function FooterPublic() {
  return (
    <footer className="w-full py-12 px-6 border-t border-stone-200 bg-stone-50 text-center mt-auto pb-28 md:pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-xl font-bold tracking-tight mb-4 text-stone-900">Pratama MC</div>
        <p className="hidden md:block text-stone-500 text-sm mb-4 leading-relaxed">
          Pratama MC adalah Master of Ceremony (MC) & Wedding Organizer profesional yang siap menyukseskan setiap acara Anda. Spesialis MC Wedding, MC Event, Pembawa Acara, dan WO.
        </p>
        <p className="hidden md:block text-stone-500 text-sm mb-8 leading-relaxed">
          Melayani wilayah Purwakarta, Subang, Karawang, Bekasi, Jakarta, dan sekitarnya.
        </p>
        <p className="text-stone-400 text-xs mt-4 md:mt-0">© {new Date().getFullYear()} Alvareza Hilka Pratama. Hak cipta dilindungi undang-undang.</p>
      </div>
    </footer>
  );
}
