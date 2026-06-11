import { AlertCircle } from 'lucide-react';

export default function ErrorData({ message = 'Gagal memuat data.', onRetry }: { message?: string, onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-red-500 bg-red-50 rounded-lg border border-red-100">
      <AlertCircle className="w-12 h-12 mb-4" />
      <p className="text-center font-medium mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
}
