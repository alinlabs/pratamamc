import React from "react";
import { Link } from "react-router-dom";
import { Handshake, Calculator, BookOpen, MessageCircle } from "lucide-react";

export default function QuickAccess() {
  const quickAccess: { nama: string; ikon: React.ComponentType<any>; path: string; color: string; external?: boolean; }[] = [
    {
      nama: "Vendor\nTerpercaya",
      ikon: Handshake,
      path: "/vendor",
      color: "bg-stone-900/5 text-stone-900",
    },
    {
      nama: "Budget\nNikah",
      ikon: Calculator,
      path: "/rencana",
      color: "bg-stone-900/5 text-stone-900",
    },
    {
      nama: "Edukasi\nNikah",
      ikon: BookOpen,
      path: "/edukasi",
      color: "bg-stone-900/5 text-stone-900",
    },
    {
      nama: "Hubungi\nKami",
      ikon: MessageCircle,
      path: "/kontak",
      color: "bg-stone-900/5 text-stone-900",
    },
  ];

  return (
    <div className="mt-6 md:mt-12 max-w-4xl md:max-w-[950px] mx-auto px-4 md:px-0">
      <div className="grid grid-cols-4 gap-3 md:gap-8 lg:gap-12">
        {quickAccess.map((item, index) => {
          const Icon = item.ikon;

          if (item.external) {
            return (
              <a
                key={index}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center group"
              >
                <div className="w-full md:max-w-[110px] aspect-square bg-white rounded-2xl md:rounded-2xl shadow-sm border border-stone-100 group-hover:shadow-md group-hover:border-stone-200 flex items-center justify-center p-3 md:p-4 transition-all relative overflow-hidden mb-2 md:mb-2 md:mt-1 mx-auto">
                  <div className="absolute inset-0 bg-[#DCAF43]/0 group-hover:bg-[#DCAF43]/[0.02] transition-colors" />
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-stone-400 group-hover:text-[#DCAF43] group-hover:scale-110 transition-all duration-300" />
                </div>
                <span className="text-[10px] md:text-sm font-semibold text-stone-500 group-hover:text-[#C09228] text-center leading-tight tracking-tight px-1 transition-colors duration-300">
                  <span className="md:hidden whitespace-pre-line">{item.nama}</span>
                  <span className="hidden md:inline whitespace-nowrap">{item.nama.replace('\n', ' ')}</span>
                </span>
              </a>
            );
          }

          return (
            <Link
              key={index}
              to={item.path}
              className="flex flex-col items-center group"
            >
              <div className="w-full md:max-w-[110px] aspect-square bg-white rounded-2xl md:rounded-2xl shadow-sm border border-stone-100 group-hover:shadow-md group-hover:border-stone-200 flex items-center justify-center p-3 md:p-4 transition-all relative overflow-hidden mb-2 md:mb-2 md:mt-1 mx-auto">
                <div className="absolute inset-0 bg-[#DCAF43]/0 group-hover:bg-[#DCAF43]/[0.02] transition-colors" />
                <Icon className="w-7 h-7 md:w-8 md:h-8 text-stone-400 group-hover:text-[#DCAF43] group-hover:scale-110 transition-all duration-300" />
              </div>
              <span className="text-[10px] md:text-sm font-semibold text-stone-500 group-hover:text-[#C09228] text-center leading-tight tracking-tight px-1 transition-colors duration-300">
                <span className="md:hidden whitespace-pre-line">{item.nama}</span>
                <span className="hidden md:inline whitespace-nowrap">{item.nama.replace('\n', ' ')}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
