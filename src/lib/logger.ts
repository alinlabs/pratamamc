// src/lib/logger.ts
export type LogEntry = {
  id: string;
  tipe: 'success' | 'fallback' | 'error';
  pesan: string;
  waktu: Date;
};

type Subscriber = (log: LogEntry) => void;

class Logger {
  private logs: LogEntry[] = [];
  private subscribers: Subscriber[] = [];

  addLog(tipe: 'success' | 'fallback' | 'error', pesan: string) {
    const log: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      tipe,
      pesan,
      waktu: new Date(),
    };
    this.logs.push(log);
    // Maksimal simpan 50 log terakhir
    if (this.logs.length > 50) this.logs.shift();
    this.notifySubscribers(log);
    
    // Tampilkan di konsol browser
    if (tipe === 'success') {
      console.log(`[API SUCCESS] ${pesan}`);
    } else if (tipe === 'fallback') {
      console.warn(`[API FALLBACK] ${pesan}`);
    } else {
      console.error(`[API ERROR] ${pesan}`);
    }
  }

  subscribe(callback: Subscriber) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  getLogs() {
    return this.logs;
  }

  private notifySubscribers(log: LogEntry) {
    this.subscribers.forEach(sub => sub(log));
  }
}

export const apiLogger = new Logger();
