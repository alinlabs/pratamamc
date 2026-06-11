import React, { useState, useEffect } from "react";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatUsername } from "../../../lib/formatUsername";

export default function Hero({ event }: { event: any }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!event?.tanggal || !event?.waktu) return;
    const dateStr = `${event.tanggal}T${event.waktu}`;
    const dateValue = new Date(dateStr);
    if (isNaN(dateValue.getTime())) return;
    const targetDate = dateValue.getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return false;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
      return true;
    };

    calculateTimeLeft();
    const interval = setInterval(() => {
      const shouldContinue = calculateTimeLeft();
      if (!shouldContinue) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [event?.tanggal, event?.waktu]);

  return (
    <div className="bg-stone-900 text-white w-full relative overflow-hidden aspect-[4/3] md:aspect-[3/1] flex flex-col justify-center items-center text-center">
      <div className="absolute inset-0">
        <video
          src="/video/banner.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/40 md:bg-black/20" />
      <div className="max-w-3xl mx-auto relative z-10 w-full flex flex-col items-center mt-6 md:mt-10">
        <div className="mb-0 md:mb-8 w-full flex flex-col items-center">
          {event.pengantin?.nama_lengkap_pria ||
          event.pengantin?.nama_lengkap_wanita ? (
            <div className="flex flex-col items-center w-full">
              <h1
                className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-3 md:mb-8 mt-2 md:mt-4 capitalize px-4"
                style={{ fontFamily: "serif" }}
              >
                {event.pengantin?.nama_panggilan_wanita || "Wanita"} &amp;{" "}
                {event.pengantin?.nama_panggilan_pria || "Pria"}
              </h1>
            </div>
          ) : (
            <h1 className="text-xl sm:text-2xl md:text-5xl font-bold tracking-tight leading-tight mb-3 md:mb-8 px-4">
              {formatUsername(event.username)}
            </h1>
          )}

          {/* Countdown Timer */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {[
              { label: "Hari", value: timeLeft.days },
              { label: "Jam", value: timeLeft.hours },
              { label: "Menit", value: timeLeft.minutes },
              { label: "Detik", value: timeLeft.seconds },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center border border-white/30 rounded-xl w-16 h-16 sm:w-20 sm:h-20 bg-black/20 backdrop-blur-sm"
              >
                <span className="text-xl sm:text-2xl font-bold">
                  {item.value.toString().padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-300">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-row w-full justify-center items-center mt-3 md:mt-2">
          {event.alamat ? (
            <a
              href={event.link_maps || `https://maps.google.com/?q=${encodeURIComponent(event.alamat)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 md:gap-2 hover:text-white transition-colors border border-white/50 rounded-full px-2.5 py-1 md:px-4 md:py-2 bg-black/30 backdrop-blur-sm font-semibold text-[10px] md:text-sm text-white"
            >
              <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0 fill-transparent stroke-2 text-white" />
              <span className="md:hidden">Lokasi Pernikahan</span>
              <span className="hidden md:inline truncate max-w-md">{event.alamat}</span>
            </a>
          ) : (
            <div className="flex items-center justify-center gap-1 md:gap-2 border border-white/50 rounded-full px-2.5 py-1 md:px-4 md:py-2 bg-black/30 backdrop-blur-sm font-semibold text-[10px] md:text-sm text-white">
              <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0 fill-transparent stroke-2 text-white" />
              <span className="md:hidden">Lokasi Belum Ditentukan</span>
              <span className="hidden md:inline">Lokasi Belum Ditentukan</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
