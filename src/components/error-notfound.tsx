import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-stone-900 mb-4">404</h1>
      <p className="text-xl text-stone-600 mb-8">Halaman tidak ditemukan.</p>
      <button 
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-[#DBB24E] text-white rounded-lg hover:bg-yellow-600 transition-colors"
      >
        Kembali ke Beranda
      </button>
    </div>
  );
}
