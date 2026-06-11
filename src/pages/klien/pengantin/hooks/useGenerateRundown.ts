import { useState, useEffect, useRef } from "react";
import { synchronizeAcaraWithDefaults } from "../../../../lib/api";

export function useGenerateRundown(waktuAcara: string, tanggalAcara: string, event: any, jenisAkad: string) {
  const [acaraList, setAcaraList] = useState<any[]>([]);
  const [expandedAcara, setExpandedAcara] = useState<{ [key: number]: boolean }>({});
  const [baseData, setBaseData] = useState<any[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const processInitialData = (data: any[]) => {
        return data.map((item: any) => ({
          ...item,
          id: item.id || (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7))
        }));
      };

      const existingData = event?.susunan_acara || event?.acara || [];
      if (existingData && existingData.length > 0) {
        setBaseData(processInitialData(synchronizeAcaraWithDefaults(existingData)));
      } else {
        fetch('/data/default-acara.json')
          .then(res => res.json())
          .then(data => {
            setBaseData(processInitialData(synchronizeAcaraWithDefaults(data)));
          })
          .catch(err => console.error(err));
      }
    }
  }, [event]);

  useEffect(() => {
    if (baseData.length > 0) {
      const calculateEndTime = (startTime: string, durasiMenit: number) => {
        if (!startTime || !startTime.includes(":")) return "";
        const [hours, minutes] = startTime.split(":").map(Number);
        if (isNaN(hours) || isNaN(minutes)) return "";
        const totalMinutes = hours * 60 + minutes + durasiMenit;
        const newMinutes = ((totalMinutes % 60) + 60) % 60; 
        let finalHours = Math.floor(totalMinutes / 60);
        if(finalHours < 0) finalHours = (finalHours % 24) + 24;
        return `${(finalHours%24).toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
      };

      let items = [...baseData];

      if (jenisAkad === "Disandingkan") {
        items = items.filter((it: any) => !(it.segmen === "Akad" && it.kegiatan === "Izin Nikah"));
      } else if (jenisAkad === "Tidak Disandingkan") {
        const penyandinganIndex = items.findIndex((it: any) => it.segmen === "Akad" && it.kegiatan === "Penyandingan Pengantin");
        if (penyandinganIndex !== -1) {
          const penyandingan = items.splice(penyandinganIndex, 1)[0];
          const doaIndex = items.findIndex((it: any) => it.segmen === "Akad" && it.kegiatan === "Doa Akad Nikah");
          if (doaIndex !== -1) {
            items.splice(doaIndex + 1, 0, penyandingan);
          } else {
            items.push(penyandingan);
          }
        }
      }

      const hasWaktu = waktuAcara && waktuAcara.length === 5;

      if (hasWaktu) {
        let anchorIndex = items.findIndex((d: any) => d.segmen === 'Akad' && d.kegiatan?.trim()?.toLowerCase() === 'ijab kabul');
        if (anchorIndex === -1) {
          anchorIndex = items.findIndex((d: any) => d.segmen === 'Akad' && d.kegiatan?.trim()?.toLowerCase() === 'akad nikah');
        }
        if (anchorIndex === -1) {
          anchorIndex = items.findIndex((d: any) => d.segmen === 'Akad');
        }
        
        if (anchorIndex !== -1) {
          items[anchorIndex].waktu = waktuAcara;
          
          let currentForward = waktuAcara;
          for(let i = anchorIndex; i < items.length - 1; i++) {
            currentForward = calculateEndTime(currentForward, parseInt(items[i].durasi) || 0);
            items[i+1].waktu = currentForward;
          }
          
          let currentBackward = waktuAcara;
          for(let i = anchorIndex - 1; i >= 0; i--) {
            currentBackward = calculateEndTime(currentBackward, -(parseInt(items[i].durasi) || 0));
            items[i].waktu = currentBackward;
          }
        } else {
          let current = waktuAcara;
          items = items.map((item: any) => {
             const t = current;
             current = calculateEndTime(current, parseInt(item.durasi) || 0);
             return { ...item, waktu: t };
          });
        }
      } else {
        items = items.map((item: any) => ({ ...item, waktu: '' }));
      }
      
      setAcaraList(items.map((it: any) => ({
         id: it.id,
         waktu: it.waktu,
         durasi: parseInt(it.durasi) || 0,
         segmen: it.segmen,
         kegiatan: it.kegiatan,
         deskripsi: it.deskripsi,
         catatan: it.catatan,
         musik: it.musik || [],
         status: it.status || ""
      })));
    } else {
      setAcaraList([]);
    }
  }, [waktuAcara, tanggalAcara, jenisAkad, baseData]);

  const handleRemoveAcara = (idToRemove: string) => {
    setBaseData(prev => prev.filter(it => it.id !== idToRemove));
  };

  const handleReorderAcara = (newAcaraList: any[]) => {
    setBaseData(prev => {
      const orderMap = new Map(newAcaraList.map((item, index) => [item.id, index]));
      return [...prev].sort((a, b) => {
        const orderA = orderMap.get(a.id) ?? prev.indexOf(a);
        const orderB = orderMap.get(b.id) ?? prev.indexOf(b);
        return orderA - orderB;
      });
    });
  };

  return { acaraList, setAcaraList, setBaseData, handleRemoveAcara, handleReorderAcara, expandedAcara, setExpandedAcara };
}
