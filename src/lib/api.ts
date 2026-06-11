/**
 * Central Data Routing Layer & Cloudflare SQL API Client
 * This module hooks up the frontend application to the Cloudflare Worker endpoints
 * with high-quality, seamless, auto-recovering fallback to local JSON assets.
 */

import { apiLogger } from "./logger";
import { cleanPhoneNumber } from "./inputFormatters";

export function synchronizeAcaraWithDefaults(acaraList: any[]): any[] {
  if (!Array.isArray(acaraList)) return [];
  return acaraList.map(item => {
    if (!item) return item;
    const activity = (item.kegiatan || "").trim().toLowerCase();
    
    if (activity === "sungkeman") {
      return {
        ...item,
        segmen: "Adat",
        musik: ["msc-002-saxophone"]
      };
    }
    if (
      activity === "huap lingkung" ||
      activity === "betot bakakak" ||
      activity === "nincak endog" ||
      activity === "meleum harupat" ||
      activity === "mepeus kendi"
    ) {
      return {
        ...item,
        segmen: "Adat",
        musik: ["msc-012-vokal"]
      };
    }
    if (activity === "saweran") {
      return {
        ...item,
        segmen: "Adat",
        musik: ["msc-010-vokal", "msc-011-vokal"]
      };
    }
    if (activity === "sesi foto keluarga") {
      return {
        ...item,
        segmen: "Istirahat",
        musik: []
      };
    }
    if (activity === "flashmob" || activity === "flashmob remix") {
      return {
        ...item,
        segmen: item.segmen || "Mingle",
        musik: ["msc-023"]
      };
    }
    
    return item;
  });
}

export const CF_WORKER_URL = "https://web.halo-pratama-mc.workers.dev";

function deepCleanWhatsapp(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => deepCleanWhatsapp(item));
  } else if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      if (key === 'whatsapp' || key.endsWith('_whatsapp') || key === 'phone') {
        newObj[key] = cleanPhoneNumber(obj[key] || '');
      } else {
        newObj[key] = deepCleanWhatsapp(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

// Helper to assemble headers with optional token auth
function getRequestHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Look for any set credentials inside local storage
  const savedToken =
    localStorage.getItem("CF_API_KEY") ||
    localStorage.getItem("ADMIN_PASSWORD") ||
    "";
  if (savedToken) {
    headers["Authorization"] = `Bearer ${savedToken}`;
  }
  return headers;
}

// =======================================================
// SMART CACHING LAYER & TTL SCHEME TO SAVE D1 QUOTA
// =======================================================
const CACHE_PREFIX = "pratama_cache_v3_";
const DEFAULT_TTL_STATIC = 10 * 60 * 1000; // 10 minutes for steady system lists (Harga, Musik, dll.)
const DEFAULT_TTL_CLIENT = 0; // 0 minute for detailed client records, rely directly on database

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

function getFromCache<T>(key: string, ttl: number): T | null {
  if (ttl <= 0) {
    try {
      localStorage.removeItem(CACHE_PREFIX + key);
    } catch (e) {}
    return null;
  }
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const item = JSON.parse(raw) as CacheItem<T>;
    if (Date.now() - item.timestamp < ttl) {
      return item.data;
    }
    localStorage.removeItem(CACHE_PREFIX + key);
  } catch (e) {
    console.warn("[Cache] Gagal membaca:", e);
  }
  return null;
}

function saveToCache<T>(key: string, data: T, ttl: number): void {
  if (ttl <= 0) return;
  try {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
  } catch (e: any) {
    console.warn("[Cache] Gagal menyimpan:", e);
    if (
      e.name === "QuotaExceededError" ||
      e.code === 22 ||
      e?.message?.includes("exceeded the quota")
    ) {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(CACHE_PREFIX)) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
        console.log(
          "[Cache] Otomatis membersihkan cache karena memori penuh (Quota Exceeded).",
        );
        // Coba simpan ulang setelah pembersihan
        localStorage.setItem(
          CACHE_PREFIX + key,
          JSON.stringify({ data, timestamp: Date.now() }),
        );
      } catch (err) {
        console.error("Gagal menyimpan setelah cache dibersihkan:", err);
      }
    }
  }
}

export function invalidateCache(pattern: string): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX) && key.includes(pattern)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => {
      localStorage.removeItem(k);
      console.log(`[Cache Invalidate] Menghapus cache: ${k}`);
    });
  } catch (e) {
    console.error("[Cache] Gagal melakukan invalidasi:", e);
  }
}

/**
 * Intelligent fetch wrapper with dynamic Cloudflare Worker routing and automatic local asset fallback
 */
export async function fetchWithFallback<T>(
  endpoint: string,
  fallbackJsonPath: string | null,
  moduleName?: string,
  ttl: number = DEFAULT_TTL_STATIC,
): Promise<T> {
  const namaModul =
    moduleName || endpoint.split("?")[0].split("/").pop() || "Data";
  const cacheKey = endpoint;

  const cachedData = getFromCache<T>(cacheKey, ttl);

  // Background fetch logic (Stale-While-Revalidate)
  const bgFetch = async () => {
    try {
      const response = await fetch(`${CF_WORKER_URL}${endpoint}`, {
        method: "GET",
        headers: getRequestHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        let isDataEmpty = false;
        if (Array.isArray(data)) isDataEmpty = data.length === 0;
        else if (data && typeof data === "object") {
          if (data.daftarKategori && data.vendors)
            isDataEmpty = data.vendors.length === 0;
        }
        if (!isDataEmpty) saveToCache(cacheKey, data, ttl);
      }
    } catch (e) {
      // Background update failed, silently ignore
    }
  };

  // If cache exists and is fresh enough (within TTL), return it but smartly revalidate if needed
  // We can revalidate in the background heavily because Cloudflare Edge cache will absorb the hit for free.
  if (cachedData !== null) {
    console.log(
      `[Smart Cache] Data ${namaModul} disajikan dari Cache (SWR Aktif)`,
    );
    // Fire silently in background without awaiting
    setTimeout(bgFetch, 100);
    return cachedData;
  }

  try {
    const response = await fetch(`${CF_WORKER_URL}${endpoint}`, {
      method: "GET",
      headers: getRequestHeaders(),
    });

    if (!response.ok) {
      throw new Error(
        `Cloudflare Worker endpoint ${endpoint} status: ${response.status}`,
      );
    }

    const data = await response.json();

    // Auto-fallback if Cloudflare returns empty array or object but we expected content
    let isDataEmpty = false;
    if (Array.isArray(data)) {
      isDataEmpty = data.length === 0;
    } else if (data && typeof data === "object") {
      if (data.daftarKategori && data.vendors) {
        isDataEmpty = data.vendors.length === 0;
      }
    }

    if (isDataEmpty && fallbackJsonPath) {
      console.warn(
        `[Jalur Routing Fallback] D1 "${endpoint}" kosong/belum di-seed. Menggunakan data lokal.`,
      );
      throw new Error(`Data D1 Kosong`);
    }

    apiLogger.addLog(
      "success",
      `${namaModul} Berhasil dimuat dari D1 (${endpoint})`,
    );

    // Commit to cache
    saveToCache(cacheKey, data, ttl);

    return data as T;
  } catch (error) {
    console.warn(
      `[Jalur Routing Fallback] Memuat data online untuk "${endpoint}" gagal.`,
      error,
    );

    // Robust local fallback via fetch
    try {
      if (!fallbackJsonPath) {
        throw new Error(
          `Data online gagal dimuat dan fallback tidak tersedia untuk endpoint ini.`,
        );
      }
      const localRes = await fetch(fallbackJsonPath);
      if (!localRes.ok) {
        throw new Error(
          `Data lokal cadangan pada ${fallbackJsonPath} tidak dapat dimuat.`,
        );
      }
      apiLogger.addLog(
        "fallback",
        `${namaModul} gagal di cloud, fallback dari lokal (${fallbackJsonPath})`,
      );
      const localData = (await localRes.json()) as T;

      // Save local fallback to cache too to prevent high server payload
      saveToCache(cacheKey, localData, ttl);

      return localData;
    } catch (fallbackErr: any) {
      apiLogger.addLog(
        "error",
        `${namaModul} GAGAL dimuat (Cloud D1 & Fallback lokal rusak/tidak ada)`,
      );
      throw fallbackErr;
    }
  }
}

/**
 * Specific hooks for each core module returned from our Worker & SQL database
 */

// 1. Edukasi
export async function getEdukasiData(): Promise<any> {
  return fetchWithFallback<any>(
    "/api/edukasi",
    "/data/edukasi.json",
    "Edukasi",
  );
}

// 2. Paket Harga MC
export async function getHargaData(): Promise<any> {
  return fetchWithFallback<any>(
    "/api/harga",
    "/data/harga.json",
    "Paket Harga",
  );
}

// 4. Musik & Lagu Rekomendasi
export async function getMusikData(): Promise<any[]> {
  const rawData = await fetchWithFallback<any[]>("/api/musik", "/data/musik.json", "Musik");
  return rawData.map(item => {
    const rec = typeof item.rekomendasi === 'string' ? item.rekomendasi.split(',').map((s: string) => s.trim()) : item.rekomendasi;
    const ver = Array.isArray(item.versi) ? item.versi.map((v: any) => ({
      ...v,
      kategori: v.kategori || v.jenis || 'Vokal',
      tautan: v.tautan || v.link
    })) : [];

    return {
      ...item,
      judul: item.judul || item.title || item.nama || 'Tanpa Judul',
      artis: item.artis || item.artist || item.penyanyi || 'Unknown',
      rekomendasi: rec,
      versi: ver
    };
  });
}

export async function saveMusikData(data: any): Promise<{success: boolean, message?: string}> {
  try {
    const response = await fetch(`${CF_WORKER_URL}/api/musik`, {
      method: "POST",
      headers: getRequestHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errPayload = await response.json().catch(() => ({}));
      throw new Error(errPayload.message || `Error ${response.status}`);
    }

    invalidateCache("musik");
    return await response.json();
  } catch (error: any) {
    console.error("Gagal menyimpan musik ke Cloud SQL:", error);
    return { success: false, message: error.message || "Gagal menghubungkan ke database online" };
  }
}

export async function deleteMusikData(id: string): Promise<{success: boolean, message?: string}> {
  try {
    const response = await fetch(`${CF_WORKER_URL}/api/musik?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: getRequestHeaders()
    });

    if (!response.ok) {
      const errPayload = await response.json().catch(() => ({}));
      throw new Error(errPayload.message || `Error ${response.status}`);
    }

    invalidateCache("musik");
    return await response.json();
  } catch (error: any) {
    console.error("Gagal menghapus musik dari Cloud SQL:", error);
    return { success: false, message: error.message || "Gagal menghubungkan ke database online" };
  }
}

// 5. Portofolio Pencapaian
export async function getPencapaianData(): Promise<any[]> {
  return fetchWithFallback<any[]>(
    "/api/pencapaian",
    "/data/pencapaian.json",
    "Pencapaian",
  );
}

// 5b. Portofolio Pengalaman
export async function getPengalamanData(): Promise<any[]> {
  return fetchWithFallback<any[]>(
    "/api/pengalaman",
    "/data/pengalaman.json",
    "Pengalaman",
  );
}

// 6. Vendor Master Directory
export async function getVendorData(): Promise<any> {
  return fetchWithFallback<any>(
    "/api/vendor",
    "/data/vendor.json",
    "Vendor Master",
  );
}

export async function saveVendorData(
  data: any,
): Promise<{ success: boolean; message: string; vendor_id?: string }> {
  try {
    const cleanedData = deepCleanWhatsapp(data);
    const response = await fetch(`${CF_WORKER_URL}/api/vendor`, {
      method: "POST",
      headers: getRequestHeaders(),
      body: JSON.stringify(cleanedData),
    });

    if (!response.ok) {
      const errPayload = await response.json().catch(() => ({}));
      throw new Error(errPayload.message || `Error ${response.status}`);
    }

    // Invalidate master vendor list cache so that the next request gets fresh data
    invalidateCache("vendor");

    return await response.json();
  } catch (error: any) {
    console.error(
      "[CORS/API Error] Gagal menyimpan vendor master ke Cloud SQL:",
      error,
    );
    return {
      success: false,
      message: error.message || "Gagal menghubungkan ke database online",
    };
  }
}

// 7. Klien Akun (List or Single based on ID/Username)
export async function getKlienAkun(
  filters: { id_klien?: string; username?: string } = {},
): Promise<any[]> {
  let query = "";
  if (filters.id_klien)
    query = `?id_klien=${encodeURIComponent(filters.id_klien)}`;
  else if (filters.username)
    query = `?username=${encodeURIComponent(filters.username)}`;

  return fetchWithFallback<any[]>(
    `/api/klien-akun${query}`,
    null,
    `Klien Akun`,
    DEFAULT_TTL_CLIENT,
  );
}

// 8. Klien Acara (Rundown)
export async function getKlienAcara(id_klien: string): Promise<any[]> {
  const data = await fetchWithFallback<any[]>(
    `/api/klien-acara?id_klien=${encodeURIComponent(id_klien)}`,
    null,
    "Acara Klien",
    DEFAULT_TTL_CLIENT,
  );
  return synchronizeAcaraWithDefaults(data);
}

// 9. Klien Keluarga
export async function getKlienKeluarga(id_klien: string): Promise<any[]> {
  return fetchWithFallback<any[]>(
    `/api/klien-keluarga?id_klien=${encodeURIComponent(id_klien)}`,
    null,
    "Keluarga Klien",
    DEFAULT_TTL_CLIENT,
  );
}

// 10. Klien Vendor Detail Table
export async function getKlienVendor(id_klien: string): Promise<any[]> {
  try {
    const rawResult = await fetchWithFallback<any[]>(
      `/api/klien-vendor?id_klien=${encodeURIComponent(id_klien)}`,
      null,
      "Vendor Klien",
      DEFAULT_TTL_CLIENT,
    );

    // Fetch master vendor list to map IDs to full objects
    let masterVendors: any[] = [];
    try {
      const vendorData = await getVendorData();
      masterVendors = vendorData.vendors || [];
    } catch (e) {
      console.warn("Could not load master vendor data for mapping");
    }

    // Map the string IDs back to full vendor objects for the frontend
    return rawResult.map((klien) => {
      const vendorList = klien.vendor || klien.daftar_vendor || [];
      const woList =
        klien.wedding_organizer || klien.timWO || klien.tim_wo || [];

      return {
        ...klien,
        vendor: vendorList.map((id: string | any) => {
          if (typeof id === "string") {
            return (
              masterVendors.find((v) => v.id === id) || {
                id,
                nama: "Unknown Vendor",
              }
            );
          }
          return id;
        }),
        wedding_organizer: woList.map((id: string | any) => {
          if (typeof id === "string") {
            return (
              masterVendors.find((v) => v.id === id) || {
                id,
                nama: "Unknown WO",
              }
            );
          }
          return id;
        }),
      };
    });
  } catch (e) {
    throw e;
  }
}

// 11. Klien Catatan / Amanah
export async function getKlienCatatan(id_klien: string): Promise<any[]> {
  return fetchWithFallback<any[]>(
    `/api/klien-catatan?id_klien=${encodeURIComponent(id_klien)}`,
    null,
    "Catatan Klien",
    DEFAULT_TTL_CLIENT,
  );
}

// 12. Klien Pengantin
export async function getKlienPengantin(id_klien: string): Promise<any[]> {
  return fetchWithFallback<any[]>(
    `/api/klien-pengantin?id_klien=${encodeURIComponent(id_klien)}`,
    null,
    "Pengantin Klien",
    DEFAULT_TTL_CLIENT,
  );
}

/**
 * Write / Persist APIs: Sends updates directly to the D1 SQL database
 */

export async function saveKlienAkun(
  data: any,
): Promise<{ success: boolean; message: string }> {
  try {
    const cleanedData = deepCleanWhatsapp(data);
    const response = await fetch(`${CF_WORKER_URL}/api/klien-akun`, {
      method: "POST",
      headers: getRequestHeaders(),
      body: JSON.stringify(cleanedData),
    });

    if (!response.ok) {
      const errPayload = await response.json().catch(() => ({}));
      throw new Error(errPayload.message || `Error ${response.status}`);
    }

    // Invalidate accounts cache and this specific client cache
    invalidateCache("klien-akun");
    if (data.id_klien) {
      invalidateCache(data.id_klien);
    }

    return await response.json();
  } catch (error: any) {
    console.error(
      "[CORS/API Error] Gagal menyimpan akun klien ke Cloud SQL:",
      error,
    );
    return {
      success: false,
      message: error.message || "Gagal menghubungkan ke database online",
    };
  }
}

export async function saveKlienAcara(
  id_klien: string,
  susunan_acara: any[],
): Promise<{ success: boolean; message: string }> {
  try {
    const synchronized = synchronizeAcaraWithDefaults(susunan_acara);
    const cleanedAcara = synchronized.map(item => {
      return {
        segmen: item.segmen || "",
        kegiatan: item.kegiatan || "",
        deskripsi: item.deskripsi || "",
        catatan: item.catatan || "",
        durasi: isNaN(parseInt(item.durasi)) ? 0 : parseInt(item.durasi),
        musik: Array.isArray(item.musik) ? item.musik : (item.musik ? [item.musik] : []),
        status: item.status || ""
      };
    });

    const response = await fetch(
      `${CF_WORKER_URL}/api/klien-acara?id_klien=${encodeURIComponent(id_klien)}`,
      {
        method: "POST",
        headers: getRequestHeaders(),
        body: JSON.stringify({ susunan_acara: cleanedAcara, acara: cleanedAcara }),
      },
    );

    if (!response.ok) {
      const errPayload = await response.json().catch(() => ({}));
      throw new Error(errPayload.message || `Error ${response.status}`);
    }

    // Invalidate current client's rundown cache
    invalidateCache(id_klien);

    return await response.json();
  } catch (error: any) {
    console.error(
      "[CORS/API Error] Gagal menyimpan rundown klien ke Cloud SQL:",
      error,
    );
    return {
      success: false,
      message: error.message || "Gagal menghubungkan ke database online",
    };
  }
}

export async function saveKlienKeluarga(
  id_klien: string,
  payload: any,
): Promise<{ success: boolean; message: string }> {
  try {
    const cleanedPayload = deepCleanWhatsapp(payload);
    const response = await fetch(
      `${CF_WORKER_URL}/api/klien-keluarga?id_klien=${encodeURIComponent(id_klien)}`,
      {
        method: "POST",
        headers: getRequestHeaders(),
        body: JSON.stringify({ id_klien, ...cleanedPayload }),
      },
    );

    if (!response.ok) {
      const errPayload = await response.json().catch(() => ({}));
      throw new Error(errPayload.message || `Error ${response.status}`);
    }

    // Invalidate client's family cache
    invalidateCache(id_klien);

    return await response.json();
  } catch (error: any) {
    console.error(
      "[CORS/API Error] Gagal menyimpan susunan keluarga ke Cloud SQL:",
      error,
    );
    return {
      success: false,
      message: error.message || "Gagal menghubungkan ke database online",
    };
  }
}

export async function saveKlienVendor(
  id_klien: string,
  payload: any,
): Promise<{ success: boolean; message: string }> {
  try {
    const cleanedPayload = deepCleanWhatsapp(payload);
    
    // Filter out problem categories that can cause SQLITE_ERROR
    const filteredVendor = (cleanedPayload.vendor || []).filter((v: any) => 
      v && v.kategori && v.kategori.toLowerCase() !== 'hantaran'
    );

    const payloadToSave = {
      id_klien,
      vendor: filteredVendor,
      wedding_organizer: cleanedPayload.wedding_organizer || [],
    };

    const response = await fetch(
      `${CF_WORKER_URL}/api/klien-vendor?id_klien=${encodeURIComponent(id_klien)}`,
      {
        method: "POST",
        headers: getRequestHeaders(),
        body: JSON.stringify(payloadToSave),
      },
    );

    if (!response.ok) {
      const errPayload = await response.json().catch(() => ({}));
      throw new Error(errPayload.message || `Error ${response.status}`);
    }

    // Invalidate client's assigned vendors cache
    invalidateCache(id_klien);

    return await response.json();
  } catch (error: any) {
    console.error(
      "[CORS/API Error] Gagal menyimpan data vendor klien ke Cloud SQL:",
      error,
    );
    return {
      success: false,
      message: error.message || "Gagal menghubungkan ke database online",
    };
  }
}

export async function saveKlienPengantin(
  id_klien: string,
  pengantin: any,
): Promise<{ success: boolean; message: string }> {
  try {
    const cleanedPengantin = deepCleanWhatsapp(pengantin);
    const response = await fetch(
      `${CF_WORKER_URL}/api/klien-pengantin?id_klien=${encodeURIComponent(id_klien)}`,
      {
        method: "POST",
        headers: getRequestHeaders(),
        body: JSON.stringify(cleanedPengantin),
      },
    );

    if (!response.ok) {
      const errPayload = await response.json().catch(() => ({}));
      throw new Error(errPayload.message || `Error ${response.status}`);
    }

    // Invalidate client wedding couple cache
    invalidateCache(id_klien);

    return await response.json();
  } catch (error: any) {
    console.error(
      "[CORS/API Error] Gagal menyimpan data pengantin klien ke Cloud SQL:",
      error,
    );
    return {
      success: false,
      message: error.message || "Gagal menghubungkan ke database online",
    };
  }
}

export async function saveKlienCatatan(
  id_klien: string,
  daftar_catatan: any[],
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      `${CF_WORKER_URL}/api/klien-catatan?id_klien=${encodeURIComponent(id_klien)}`,
      {
        method: "POST",
        headers: getRequestHeaders(),
        body: JSON.stringify({ daftar_catatan }),
      },
    );

    if (!response.ok) {
      const errPayload = await response.json().catch(() => ({}));
      throw new Error(errPayload.message || `Error ${response.status}`);
    }

    // Invalidate client notes cache
    invalidateCache(id_klien);

    return await response.json();
  } catch (error: any) {
    console.error(
      "[CORS/API Error] Gagal menyimpan catatan/pesan klien ke Cloud SQL:",
      error,
    );
    return {
      success: false,
      message: error.message || "Gagal menghubungkan ke database online",
    };
  }
}

/**
 * Permanent Delete API: Instantly purge client record from D1 cloud database
 */
export async function deleteKlienAkun(
  id_klien: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      `${CF_WORKER_URL}/api/klien-akun?id_klien=${encodeURIComponent(id_klien)}`,
      {
        method: "DELETE",
        headers: getRequestHeaders(),
      },
    );

    if (!response.ok) {
      const errPayload = await response.json().catch(() => ({}));
      throw new Error(errPayload.message || `Error ${response.status}`);
    }

    // Purge related caches instantly
    invalidateCache("klien-akun");
    invalidateCache(id_klien);

    return await response.json();
  } catch (error: any) {
    console.error(
      "[CORS/API Error] Gagal menghapus akun klien dari Cloud SQL:",
      error,
    );
    return {
      success: false,
      message: error.message || "Gagal menghubungkan ke database online",
    };
  }
}
