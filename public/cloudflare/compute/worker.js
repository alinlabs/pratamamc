/**
 * Cloudflare Worker for halo-pratama-mc (Cloudflare D1 SQL Integration)
 * Endpoint: https://web.halo-pratama-mc.workers.dev/
 * Bindings: env.d1_database
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS, PUT, DELETE, PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key, X-Requested-With",
  "Access-Control-Expose-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight options requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
        status: 204,
      });
    }

    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    try {
      if (!env.d1_database) {
        throw new Error("D1 database binding 'd1_database' is missing or not configured.");
      }

      // ==========================================
      // AUTHENTICATION MIDDLEWARE
      // ==========================================
      // If a secret is configured in Cloudflare (API_KEY, AUTH_TOKEN, or ADMIN_PASSWORD)
      // we enforce token validation.
      // - Write operations (POST, PUT, DELETE, PATCH) ALWAYS require validation.
      // - Read operations (GET) are public by default unless env.SECURE_READS = "true".
      const secretToken = env.API_KEY || env.AUTH_TOKEN || env.ADMIN_PASSWORD;
      const isWriteOp = ["POST", "PUT", "DELETE", "PATCH"].includes(method);
      const isSecureRead = env.SECURE_READS === "true";

      if (secretToken && (isWriteOp || isSecureRead)) {
        const authHeader = request.headers.get("Authorization");
        const queryToken = url.searchParams.get("token") || url.searchParams.get("key") || url.searchParams.get("apiKey");
        
        let providedToken = "";
        if (authHeader) {
          const match = authHeader.match(/^(?:Bearer|ApiKey)\s+(.+)$/i);
          providedToken = match ? match[1].trim() : authHeader.trim();
        } else if (queryToken) {
          providedToken = queryToken.trim();
        }

        if (!providedToken || providedToken !== secretToken) {
          return jsonResponse({
            error: true,
            message: "Unauthorized: Invalid or missing API credential.",
            code: "UNAUTHORIZED"
          }, { status: 401 });
        }
      }

      // Route: GET /
      if (pathname === "/" || pathname === "/api/health") {
        try {
          const { results } = await env.d1_database.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
          const tableNames = results.map(row => row.name);
          
          if (pathname === "/") {
            const html = `
            <!DOCTYPE html>
            <html lang="id">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Status Database - Halo Pratama MC</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; color: #111827; margin: 0; padding: 2rem; display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; }
                .container { background-color: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); padding: 2rem; max-width: 600px; width: 100%; }
                h1 { margin-top: 0; color: #DBB24E; font-size: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }
                .status-badge { background-color: #10B981; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 500; margin-bottom: 1rem; display: inline-block; }
                .info-group { margin-bottom: 1.5rem; }
                .info-label { font-size: 0.875rem; color: #6B7280; margin-bottom: 0.25rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
                .info-value { font-size: 1rem; color: #111827; }
                .table-list { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.5rem; }
                .table-item { background-color: #f3f4f6; padding: 0.75rem; border-radius: 6px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.875rem; border: 1px solid #e5e7eb; display: flex; align-items: center; }
                .table-item::before { content: "📊"; margin-right: 0.5rem; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="status-badge">● Sistem Aktif</div>
                <h1>Layanan D1 SQL - Halo Pratama MC</h1>
                <p style="color: #4B5563; margin-bottom: 2rem;">Layanan berhasil berjalan dan terhubung dengan baik ke sistem Cloudflare.</p>
                
                <div class="info-group">
                  <div class="info-label">Koneksi Database</div>
                  <div class="info-value">✅ Terhubung dengan Cloudflare D1 <strong>(d1_database)</strong></div>
                </div>
                
                <div class="info-group">
                  <div class="info-label">Total Tabel Tersedia</div>
                  <div class="info-value"><strong>${tableNames.length}</strong> tabel terdeteksi</div>
                </div>
                
                <div class="info-group">
                  <div class="info-label">Daftar Tabel Terhubung</div>
                  <ul class="table-list">
                    ${tableNames.length > 0 ? tableNames.map(name => `<li class="table-item">${name}</li>`).join('') : '<li class="table-item" style="color: #EF4444">Tidak ada tabel ditemukan</li>'}
                  </ul>
                </div>
              </div>
            </body>
            </html>
            `;
            return new Response(html, { headers: { "Content-Type": "text/html;charset=UTF-8", ...corsHeaders } });
          }

          // Return JSON for /api/health
          return jsonResponse({ 
            status: "ok", 
            pesan: "Layanan D1 SQL Halo Pratama MC aktif dan berjalan dengan baik.",
            database: "Terhubung dengan Cloudflare D1 (d1_database)",
            total_tabel: tableNames.length,
            daftar_tabel: tableNames
          });
        } catch (e) {
          if (pathname === "/") {
            return new Response(`<h1 style="color:red">Error: ${e.message}</h1>`, { headers: { "Content-Type": "text/html;charset=UTF-8", ...corsHeaders } });
          }
          return jsonResponse({ 
            status: "warning", 
            pesan: "Layanan aktif, tetapi gagal membaca struktur database D1.",
            error: e.message
          });
        }
      }

      // ==========================================
      // ROUTE: EDUKASI
      // ==========================================
      if (pathname === "/api/edukasi" && method === "GET") {
        const { results } = await env.d1_database.prepare("SELECT * FROM edukasi").all();
        
        // Group by kategori to match the original JSON structure: formal, adat, resepsi
        const grouped = {
          formal: results.filter(item => item.kategori === "formal"),
          adat: results.filter(item => item.kategori === "adat"),
          resepsi: results.filter(item => item.kategori === "resepsi"),
        };
        return jsonResponse(grouped, { headers: { "Cache-Control": "public, max-age=300" } });
      }

      // ==========================================
      // ROUTE: HARGA / PAKET
      // ==========================================
      if (pathname === "/api/harga" && method === "GET") {
        const { results } = await env.d1_database.prepare("SELECT * FROM paket ORDER BY id ASC").all();
        
        // Parse JSON fields (detail & gambar) stored inside SQLite text
        const processedPaket = results.map(item => ({
          ...item,
          populer: item.populer === 1 || item.populer === 'true' || item.populer === true || item.populer === '1',
          gambar: item.gambar ? (typeof item.gambar === 'string' ? item.gambar.split(',') : item.gambar) : [],
          detail: safeParseJSON(item.detail, []),
          harga_normal: item.harga_normal,
          harga_promo: item.harga_promo
        }));

        return jsonResponse(processedPaket, { headers: { "Cache-Control": "public, max-age=300" } });
      }

      // ==========================================
      // ROUTE: KLIEN AKUN
      // ==========================================
      if (pathname === "/api/klien-akun") {
        if (method === "GET") {
          const id_klien = url.searchParams.get("id_klien");
          const slug = url.searchParams.get("slug") || url.searchParams.get("username");

          let query = "SELECT id_klien, username, tanggal, waktu, alamat, maps, tema, bahasa, status, metatag, galeri FROM klien";
          const args = [];

          if (id_klien) {
            query += " WHERE id_klien = ?";
            args.push(id_klien);
          } else if (slug) {
            // treat slug as username
            query += " WHERE username = ?";
            args.push(slug);
          }

          const { results } = await env.d1_database.prepare(query).bind(...args).all();
          // map username back to slug for frontend compatibility
          const mappedResults = results.map(r => ({...r, slug: r.username, link_maps: r.maps}));
          return jsonResponse(mappedResults);
        }

        if (method === "POST" || method === "PUT") {
          const data = await request.json();
          const { id_klien, slug, username, tanggal, waktu, alamat, maps, link_maps, tema, bahasa, galeri } = data;
          const userSlug = username || slug;

          if (!id_klien || !userSlug) {
            return errorResponse("Fields id_klien and slug/username are required", 400);
          }

          const insertMaps = maps !== undefined ? maps : (link_maps || '');
          const insertTema = typeof tema === 'string' ? tema : (tema ? JSON.stringify(tema) : '');
          const insertBahasa = typeof bahasa === 'string' ? bahasa : (Array.isArray(bahasa) ? bahasa.join(', ') : '');
          const insertGaleri = typeof galeri === 'string' ? galeri : (galeri ? JSON.stringify(galeri) : '');

          await env.d1_database.prepare(
            `INSERT INTO klien (id_klien, username, tanggal, waktu, alamat, maps, tema, bahasa, galeri)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(id_klien) DO UPDATE SET
               username = excluded.username,
               tanggal = excluded.tanggal,
               waktu = excluded.waktu,
               alamat = excluded.alamat,
               maps = excluded.maps,
               tema = excluded.tema,
               bahasa = excluded.bahasa,
               galeri = excluded.galeri`
          ).bind(id_klien, userSlug, tanggal || '', waktu || '', alamat || '', insertMaps, insertTema, insertBahasa, insertGaleri).run();

          return jsonResponse({ success: true, message: "Klien account saved successfully" });
        }

        if (method === "DELETE") {
          const id_klien = url.searchParams.get("id_klien");
          if (!id_klien) {
            return errorResponse("Field id_klien is required", 400);
          }
          
          await env.d1_database.batch([
            env.d1_database.prepare("DELETE FROM klien_vendor WHERE id_klien = ?").bind(id_klien),
            env.d1_database.prepare("DELETE FROM klien_pendamping WHERE id_klien = ?").bind(id_klien),
            env.d1_database.prepare("DELETE FROM klien_wo WHERE id_klien = ?").bind(id_klien),
            env.d1_database.prepare("DELETE FROM klien_pengantin WHERE id_klien = ?").bind(id_klien),
            env.d1_database.prepare("DELETE FROM klien_keluarga WHERE id_klien = ?").bind(id_klien),
            env.d1_database.prepare("DELETE FROM klien_panitia WHERE id_klien = ?").bind(id_klien),
            env.d1_database.prepare("DELETE FROM klien WHERE id_klien = ?").bind(id_klien)
          ]);
          
          return jsonResponse({ success: true, message: "Klien account and related records deleted successfully" });
        }
      }

      // ==========================================
      // ROUTE: KLIEN ACARA (SUSUNAN ACARA / RUNDOWN)
      // ==========================================
      if (pathname === "/api/klien-acara") {
        const id_klien = url.searchParams.get("id_klien") || "1";

        if (method === "GET") {
          const { results } = await env.d1_database
            .prepare("SELECT acara FROM klien WHERE id_klien = ?")
            .bind(id_klien)
            .all();

          if (results.length > 0 && results[0].acara) {
            return jsonResponse([{ id_klien, susunan_acara: safeParseJSON(results[0].acara, []) }]);
          }
          return jsonResponse([]);
        }

        if (method === "POST" || method === "PUT") {
          const { susunan_acara } = await request.json();
          
          // Force strip id and waktu fields server-side before saving to database
          const cleanedAcara = (susunan_acara || []).map(item => {
            const { id, waktu, ...rest } = item;
            return {
              ...rest,
              durasi: isNaN(parseInt(rest.durasi)) ? 0 : parseInt(rest.durasi)
            };
          });
          
          const jsonStr = JSON.stringify(cleanedAcara);

          await env.d1_database.prepare(
            `UPDATE klien SET acara = ? WHERE id_klien = ?`
          ).bind(jsonStr, id_klien).run();

          return jsonResponse({ success: true, message: "Susunan acara saved successfully" });
        }
      }

      // ==========================================
      // ROUTE: KLIEN CATATAN (TEXT MESSAGES / AMANAH)
      // ==========================================
      if (pathname === "/api/klien-catatan") {
        const id_klien = url.searchParams.get("id_klien") || "1";

        if (method === "GET") {
          const { results } = await env.d1_database
            .prepare("SELECT catatan FROM klien WHERE id_klien = ?")
            .bind(id_klien)
            .all();

          if (results.length > 0 && results[0].catatan) {
            return jsonResponse([{ id_klien, daftar_catatan: safeParseJSON(results[0].catatan, []) }]);
          }
          return jsonResponse([]);
        }

        if (method === "POST" || method === "PUT") {
          const { daftar_catatan } = await request.json();
          const jsonStr = JSON.stringify(daftar_catatan || []);

          await env.d1_database.prepare(
            `UPDATE klien SET catatan = ? WHERE id_klien = ?`
          ).bind(jsonStr, id_klien).run();

          return jsonResponse({ success: true, message: "Catatan saved successfully" });
        }
      }

      // ==========================================
      // ROUTE: KLIEN PENGANTIN
      // ==========================================
      if (pathname === "/api/klien-pengantin") {
        const id_klien = url.searchParams.get("id_klien") || "1";

        if (method === "GET") {
          const { results } = await env.d1_database
            .prepare("SELECT * FROM klien_pengantin WHERE id_klien = ?")
            .bind(id_klien)
            .all();

          if (results.length > 0) {
             return jsonResponse([ { id_klien, pengantin: results[0] } ]);
          }
           return jsonResponse([]);
        }

        if (method === "POST" || method === "PUT") {
          const body = await request.json();
          const p = body.pengantin || body;
          
          await env.d1_database.prepare(
            `INSERT INTO klien_pengantin (id_klien, nama_lengkap_pria, nama_panggilan_pria, anak_ke_pria, whatsapp_pria, instagram_pria, nama_lengkap_wanita, nama_panggilan_wanita, anak_ke_wanita, whatsapp_wanita, instagram_wanita)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(id_klien) DO UPDATE SET
               nama_lengkap_pria = excluded.nama_lengkap_pria,
               nama_panggilan_pria = excluded.nama_panggilan_pria,
               anak_ke_pria = excluded.anak_ke_pria,
               whatsapp_pria = excluded.whatsapp_pria,
               instagram_pria = excluded.instagram_pria,
               nama_lengkap_wanita = excluded.nama_lengkap_wanita,
               nama_panggilan_wanita = excluded.nama_panggilan_wanita,
               anak_ke_wanita = excluded.anak_ke_wanita,
               whatsapp_wanita = excluded.whatsapp_wanita,
               instagram_wanita = excluded.instagram_wanita`
          ).bind(
             id_klien, p.nama_lengkap_pria || '', p.nama_panggilan_pria || '', p.anak_ke_pria || '', p.whatsapp_pria || '', p.instagram_pria || '',
             p.nama_lengkap_wanita || '', p.nama_panggilan_wanita || '', p.anak_ke_wanita || '', p.whatsapp_wanita || '', p.instagram_wanita || ''
          ).run();

          return jsonResponse({ success: true, message: "Klien pengantin saved successfully" });
        }
      }

      // ==========================================
      // ROUTE: KLIEN KELUARGA (FAMILY / INTIMATES / VIPs)
      // ==========================================
      if (pathname === "/api/klien-keluarga") {
        const id_klien = url.searchParams.get("id_klien") || "1";

        if (method === "GET") {
          const [klienRes, keluargaRes, panitiaRes, pendampingRes] = await env.d1_database.batch([
             env.d1_database.prepare("SELECT tamu FROM klien WHERE id_klien = ?").bind(id_klien),
             env.d1_database.prepare("SELECT * FROM klien_keluarga WHERE id_klien = ?").bind(id_klien),
             env.d1_database.prepare("SELECT * FROM klien_panitia WHERE id_klien = ?").bind(id_klien),
             env.d1_database.prepare("SELECT * FROM klien_pendamping WHERE id_klien = ?").bind(id_klien)
          ]);

          let item = { tamu: '[]' };
          if (klienRes.results.length > 0) {
            item = klienRes.results[0];
          }
          
          let keluargaData = [];
          if (keluargaRes.results.length > 0) {
             const row = keluargaRes.results[0];
             const addIfPresent = (peran, prefix) => {
                 if (row[`nama_${prefix}`]) {
                     keluargaData.push({
                         peran: peran,
                         nama: row[`nama_${prefix}`] || '',
                         nama_panggilan: row[`panggilan_${prefix}`] || '',
                         whatsapp: row[`whatsapp_${prefix}`] || '',
                         instagram: row[`instagram_${prefix}`] || '',
                         isCustom: false
                     });
                 }
             };
             
             addIfPresent('Ayah Mempelai Pria', 'ayah_pria');
             addIfPresent('Ibu Mempelai Pria', 'ibu_pria');
             addIfPresent('Ayah Mempelai Wanita', 'ayah_wanita');
             addIfPresent('Ibu Mempelai Wanita', 'ibu_wanita');
          }

          let pengisiAcaraData = [];
          let panitiaData = [];

          if (panitiaRes.results.length > 0) {
             const row = panitiaRes.results[0];
             const addIfPresent = (peran, prefix, isPanitia = false) => {
                 if (row[`${prefix}_nama`]) {
                     const item = {
                         peran: peran,
                         nama: row[`${prefix}_nama`] || '',
                         whatsapp: row[`${prefix}_whatsapp`] || '',
                         instagram: '',
                         isCustom: false
                     };
                     if (isPanitia) {
                         panitiaData.push({...item, kategori: 'panitia_keluarga'});
                     } else {
                         pengisiAcaraData.push({...item, kategori: 'pengisi_acara'});
                     }
                 }
             };
             
             addIfPresent('Koordinator Keluarga Wanita', 'koordinator_keluarga_wanita', true);
             addIfPresent('Koordinator Keluarga Pria', 'koordinator_keluarga_pria', true);
             addIfPresent('PIC Bunga', 'pic_bunga', true);
             addIfPresent('PIC Konsumsi', 'pic_konsumsi', true);
             addIfPresent('PIC Hantaran', 'pic_hantaran', true);
             addIfPresent('PIC Doorprize', 'pic_doorprize', true);

             addIfPresent('Perwakilan Sambutan Pria', 'perwakilan_sambutan_pria');
             addIfPresent('Perwakilan Sambutan Wanita', 'perwakilan_sambutan_wanita');
             addIfPresent('Petugas KUA', 'petugas_kua');
             addIfPresent('Saksi Pihak Pria', 'saksi_pihak_pria');
             addIfPresent('Saksi Pihak Wanita', 'saksi_pihak_wanita');
             addIfPresent('Pembaca Al-Quran', 'pembaca_alquran');
             addIfPresent('Pembaca Saritilawah', 'pembaca_saritilawah');
          }

          const pendampingData = pendampingRes.results.map(row => ({
             peran: row.peran,
             nama: row.nama,
             whatsapp: row.whatsapp,
             instagram: row.instagram
          }));

          return jsonResponse([{
            id_klien,
            keluarga_inti: keluargaData,
            pendamping: pendampingData,
            pengisi_acara: pengisiAcaraData,
            panitia_keluarga: panitiaData,
            tamu: safeParseJSON(item.tamu, [])
          }]);
        }

        if (method === "POST" || method === "PUT") {
          const data = await request.json();
          const { keluarga_inti = [], pengisi_acara = [], panitia_keluarga = [], pendamping = [] } = data;
          
          const batchStmts = [];
          batchStmts.push(env.d1_database.prepare(`DELETE FROM klien_keluarga WHERE id_klien = ?`).bind(id_klien));
          batchStmts.push(env.d1_database.prepare(`DELETE FROM klien_panitia WHERE id_klien = ?`).bind(id_klien));
          batchStmts.push(env.d1_database.prepare(`DELETE FROM klien_pendamping WHERE id_klien = ?`).bind(id_klien));

          let flatKeluarga = {
              nama_ayah_pria: '', panggilan_ayah_pria: '', whatsapp_ayah_pria: '',
              nama_ibu_pria: '', panggilan_ibu_pria: '', whatsapp_ibu_pria: '',
              nama_ayah_wanita: '', panggilan_ayah_wanita: '', whatsapp_ayah_wanita: '',
              nama_ibu_wanita: '', panggilan_ibu_wanita: '', whatsapp_ibu_wanita: ''
          };
          
          for (const item of keluarga_inti) {
             if (item.peran === "Ayah Mempelai Pria" || item.peran === "Ayah Pria") {
                 flatKeluarga.nama_ayah_pria = item.nama;
                 flatKeluarga.panggilan_ayah_pria = item.nama_panggilan;
                 flatKeluarga.whatsapp_ayah_pria = item.whatsapp;
             } else if (item.peran === "Ibu Mempelai Pria" || item.peran === "Ibu Pria") {
                 flatKeluarga.nama_ibu_pria = item.nama;
                 flatKeluarga.panggilan_ibu_pria = item.nama_panggilan;
                 flatKeluarga.whatsapp_ibu_pria = item.whatsapp;
             } else if (item.peran === "Ayah Mempelai Wanita" || item.peran === "Ayah Wanita") {
                 flatKeluarga.nama_ayah_wanita = item.nama;
                 flatKeluarga.panggilan_ayah_wanita = item.nama_panggilan;
                 flatKeluarga.whatsapp_ayah_wanita = item.whatsapp;
             } else if (item.peran === "Ibu Mempelai Wanita" || item.peran === "Ibu Wanita") {
                 flatKeluarga.nama_ibu_wanita = item.nama;
                 flatKeluarga.panggilan_ibu_wanita = item.nama_panggilan;
                 flatKeluarga.whatsapp_ibu_wanita = item.whatsapp;
             }
          }
          
          batchStmts.push(env.d1_database.prepare(
            `INSERT INTO klien_keluarga (
                id_klien,
                nama_ayah_pria, panggilan_ayah_pria, whatsapp_ayah_pria,
                nama_ibu_pria, panggilan_ibu_pria, whatsapp_ibu_pria,
                nama_ayah_wanita, panggilan_ayah_wanita, whatsapp_ayah_wanita,
                nama_ibu_wanita, panggilan_ibu_wanita, whatsapp_ibu_wanita
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id_klien) DO UPDATE SET
                nama_ayah_pria = excluded.nama_ayah_pria,
                panggilan_ayah_pria = excluded.panggilan_ayah_pria,
                whatsapp_ayah_pria = excluded.whatsapp_ayah_pria,
                nama_ibu_pria = excluded.nama_ibu_pria,
                panggilan_ibu_pria = excluded.panggilan_ibu_pria,
                whatsapp_ibu_pria = excluded.whatsapp_ibu_pria,
                nama_ayah_wanita = excluded.nama_ayah_wanita,
                panggilan_ayah_wanita = excluded.panggilan_ayah_wanita,
                whatsapp_ayah_wanita = excluded.whatsapp_ayah_wanita,
                nama_ibu_wanita = excluded.nama_ibu_wanita,
                panggilan_ibu_wanita = excluded.panggilan_ibu_wanita,
                whatsapp_ibu_wanita = excluded.whatsapp_ibu_wanita`
          ).bind(
             id_klien,
             flatKeluarga.nama_ayah_pria, flatKeluarga.panggilan_ayah_pria, flatKeluarga.whatsapp_ayah_pria,
             flatKeluarga.nama_ibu_pria, flatKeluarga.panggilan_ibu_pria, flatKeluarga.whatsapp_ibu_pria,
             flatKeluarga.nama_ayah_wanita, flatKeluarga.panggilan_ayah_wanita, flatKeluarga.whatsapp_ayah_wanita,
             flatKeluarga.nama_ibu_wanita, flatKeluarga.panggilan_ibu_wanita, flatKeluarga.whatsapp_ibu_wanita
          ));

          const mergedPengisi = [
             ...pengisi_acara.map(p => ({ ...p, kategori: 'pengisi_acara' })),
             ...panitia_keluarga.map(p => ({ ...p, kategori: 'panitia_keluarga' }))
          ];

          let flatPanitia = {
              koordinator_keluarga_wanita_nama: '', koordinator_keluarga_wanita_whatsapp: '',
              koordinator_keluarga_pria_nama: '', koordinator_keluarga_pria_whatsapp: '',
              pic_bunga_nama: '', pic_bunga_whatsapp: '',
              pic_konsumsi_nama: '', pic_konsumsi_whatsapp: '',
              pic_hantaran_nama: '', pic_hantaran_whatsapp: '',
              pic_doorprize_nama: '', pic_doorprize_whatsapp: '',
              perwakilan_sambutan_pria_nama: '', perwakilan_sambutan_pria_whatsapp: '',
              perwakilan_sambutan_wanita_nama: '', perwakilan_sambutan_wanita_whatsapp: '',
              petugas_kua_nama: '', petugas_kua_whatsapp: '',
              saksi_pihak_pria_nama: '', saksi_pihak_pria_whatsapp: '',
              saksi_pihak_wanita_nama: '', saksi_pihak_wanita_whatsapp: '',
              pembaca_alquran_nama: '', pembaca_alquran_whatsapp: '',
              pembaca_saritilawah_nama: '', pembaca_saritilawah_whatsapp: ''
          };

          for (const item of mergedPengisi) {
              const lowerPeran = (item.peran || '').toLowerCase();
              if (lowerPeran === 'koordinator keluarga wanita') {
                  flatPanitia.koordinator_keluarga_wanita_nama = item.nama; flatPanitia.koordinator_keluarga_wanita_whatsapp = item.whatsapp;
              } else if (lowerPeran === 'koordinator keluarga pria') {
                  flatPanitia.koordinator_keluarga_pria_nama = item.nama; flatPanitia.koordinator_keluarga_pria_whatsapp = item.whatsapp;
              } else if (lowerPeran === 'pic bunga' || lowerPeran === 'bunga') {
                  flatPanitia.pic_bunga_nama = item.nama; flatPanitia.pic_bunga_whatsapp = item.whatsapp;
              } else if (lowerPeran === 'pic konsumsi' || lowerPeran === 'konsumsi') {
                  flatPanitia.pic_konsumsi_nama = item.nama; flatPanitia.pic_konsumsi_whatsapp = item.whatsapp;
              } else if (lowerPeran === 'pic hantaran' || lowerPeran === 'hantaran') {
                  flatPanitia.pic_hantaran_nama = item.nama; flatPanitia.pic_hantaran_whatsapp = item.whatsapp;
              } else if (lowerPeran === 'pic doorprize' || lowerPeran === 'doorprize') {
                  flatPanitia.pic_doorprize_nama = item.nama; flatPanitia.pic_doorprize_whatsapp = item.whatsapp;
              } else if (lowerPeran === 'perwakilan sambutan pria' || lowerPeran === 'sambutan pria') {
                  flatPanitia.perwakilan_sambutan_pria_nama = item.nama; flatPanitia.perwakilan_sambutan_pria_whatsapp = item.whatsapp;
              } else if (lowerPeran === 'perwakilan sambutan wanita' || lowerPeran === 'sambutan wanita') {
                  flatPanitia.perwakilan_sambutan_wanita_nama = item.nama; flatPanitia.perwakilan_sambutan_wanita_whatsapp = item.whatsapp;
              } else if (lowerPeran === 'petugas kua' || lowerPeran === 'kua') {
                  flatPanitia.petugas_kua_nama = item.nama; flatPanitia.petugas_kua_whatsapp = item.whatsapp;
              } else if (lowerPeran === 'saksi pihak pria' || lowerPeran === 'saksi pria' || lowerPeran === 'saksi mempelai pria') {
                  flatPanitia.saksi_pihak_pria_nama = item.nama; flatPanitia.saksi_pihak_pria_whatsapp = item.whatsapp;
              } else if (lowerPeran === 'saksi pihak wanita' || lowerPeran === 'saksi wanita' || lowerPeran === 'saksi mempelai wanita') {
                  flatPanitia.saksi_pihak_wanita_nama = item.nama; flatPanitia.saksi_pihak_wanita_whatsapp = item.whatsapp;
              } else if (lowerPeran === 'pembaca al-quran' || lowerPeran === 'qori' || lowerPeran === 'pembaca alquran' || lowerPeran === 'pembaca quran') {
                  flatPanitia.pembaca_alquran_nama = item.nama; flatPanitia.pembaca_alquran_whatsapp = item.whatsapp;
              } else if (lowerPeran === 'pembaca saritilawah' || lowerPeran === 'saritilawah') {
                  flatPanitia.pembaca_saritilawah_nama = item.nama; flatPanitia.pembaca_saritilawah_whatsapp = item.whatsapp;
              }
          }

          batchStmts.push(env.d1_database.prepare(
            `INSERT INTO klien_panitia (
                id_klien,
                koordinator_keluarga_wanita_nama, koordinator_keluarga_wanita_whatsapp,
                koordinator_keluarga_pria_nama, koordinator_keluarga_pria_whatsapp,
                pic_bunga_nama, pic_bunga_whatsapp,
                pic_konsumsi_nama, pic_konsumsi_whatsapp,
                pic_hantaran_nama, pic_hantaran_whatsapp,
                pic_doorprize_nama, pic_doorprize_whatsapp,
                perwakilan_sambutan_pria_nama, perwakilan_sambutan_pria_whatsapp,
                perwakilan_sambutan_wanita_nama, perwakilan_sambutan_wanita_whatsapp,
                petugas_kua_nama, petugas_kua_whatsapp,
                saksi_pihak_pria_nama, saksi_pihak_pria_whatsapp,
                saksi_pihak_wanita_nama, saksi_pihak_wanita_whatsapp,
                pembaca_alquran_nama, pembaca_alquran_whatsapp,
                pembaca_saritilawah_nama, pembaca_saritilawah_whatsapp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id_klien) DO UPDATE SET
                koordinator_keluarga_wanita_nama = excluded.koordinator_keluarga_wanita_nama,
                koordinator_keluarga_wanita_whatsapp = excluded.koordinator_keluarga_wanita_whatsapp,
                koordinator_keluarga_pria_nama = excluded.koordinator_keluarga_pria_nama,
                koordinator_keluarga_pria_whatsapp = excluded.koordinator_keluarga_pria_whatsapp,
                pic_bunga_nama = excluded.pic_bunga_nama,
                pic_bunga_whatsapp = excluded.pic_bunga_whatsapp,
                pic_konsumsi_nama = excluded.pic_konsumsi_nama,
                pic_konsumsi_whatsapp = excluded.pic_konsumsi_whatsapp,
                pic_hantaran_nama = excluded.pic_hantaran_nama,
                pic_hantaran_whatsapp = excluded.pic_hantaran_whatsapp,
                pic_doorprize_nama = excluded.pic_doorprize_nama,
                pic_doorprize_whatsapp = excluded.pic_doorprize_whatsapp,
                perwakilan_sambutan_pria_nama = excluded.perwakilan_sambutan_pria_nama,
                perwakilan_sambutan_pria_whatsapp = excluded.perwakilan_sambutan_pria_whatsapp,
                perwakilan_sambutan_wanita_nama = excluded.perwakilan_sambutan_wanita_nama,
                perwakilan_sambutan_wanita_whatsapp = excluded.perwakilan_sambutan_wanita_whatsapp,
                petugas_kua_nama = excluded.petugas_kua_nama,
                petugas_kua_whatsapp = excluded.petugas_kua_whatsapp,
                saksi_pihak_pria_nama = excluded.saksi_pihak_pria_nama,
                saksi_pihak_pria_whatsapp = excluded.saksi_pihak_pria_whatsapp,
                saksi_pihak_wanita_nama = excluded.saksi_pihak_wanita_nama,
                saksi_pihak_wanita_whatsapp = excluded.saksi_pihak_wanita_whatsapp,
                pembaca_alquran_nama = excluded.pembaca_alquran_nama,
                pembaca_alquran_whatsapp = excluded.pembaca_alquran_whatsapp,
                pembaca_saritilawah_nama = excluded.pembaca_saritilawah_nama,
                pembaca_saritilawah_whatsapp = excluded.pembaca_saritilawah_whatsapp`
          ).bind(
             id_klien,
             flatPanitia.koordinator_keluarga_wanita_nama, flatPanitia.koordinator_keluarga_wanita_whatsapp,
             flatPanitia.koordinator_keluarga_pria_nama, flatPanitia.koordinator_keluarga_pria_whatsapp,
             flatPanitia.pic_bunga_nama, flatPanitia.pic_bunga_whatsapp,
             flatPanitia.pic_konsumsi_nama, flatPanitia.pic_konsumsi_whatsapp,
             flatPanitia.pic_hantaran_nama, flatPanitia.pic_hantaran_whatsapp,
             flatPanitia.pic_doorprize_nama, flatPanitia.pic_doorprize_whatsapp,
             flatPanitia.perwakilan_sambutan_pria_nama, flatPanitia.perwakilan_sambutan_pria_whatsapp,
             flatPanitia.perwakilan_sambutan_wanita_nama, flatPanitia.perwakilan_sambutan_wanita_whatsapp,
             flatPanitia.petugas_kua_nama, flatPanitia.petugas_kua_whatsapp,
             flatPanitia.saksi_pihak_pria_nama, flatPanitia.saksi_pihak_pria_whatsapp,
             flatPanitia.saksi_pihak_wanita_nama, flatPanitia.saksi_pihak_wanita_whatsapp,
             flatPanitia.pembaca_alquran_nama, flatPanitia.pembaca_alquran_whatsapp,
             flatPanitia.pembaca_saritilawah_nama, flatPanitia.pembaca_saritilawah_whatsapp
          ));

          for (const item of pendamping) {
             batchStmts.push(env.d1_database.prepare(
               `INSERT INTO klien_pendamping (id_klien, peran, nama, whatsapp, instagram) VALUES (?, ?, ?, ?, ?)`
             ).bind(id_klien, item.peran || '', item.nama || '', item.whatsapp || '', item.instagram || ''));
          }
          
          batchStmts.push(
            env.d1_database.prepare(
              `UPDATE klien SET tamu = ? WHERE id_klien = ?`
            ).bind(
              JSON.stringify(data.tamu || []),
              id_klien
            )
          );

          await env.d1_database.batch(batchStmts);

          return jsonResponse({ success: true, message: "Klien keluarga saved successfully" });
        }
      }

      // ==========================================
      // ROUTE: KLIEN VENDOR
      // ==========================================
      if (pathname === "/api/klien-vendor") {
        const id_klien = url.searchParams.get("id_klien") || "1";

        if (method === "GET") {
          const { results } = await env.d1_database
            .prepare(`SELECT * FROM klien_vendor WHERE id_klien = ?`)
            .bind(id_klien)
            .all();

          let row = results.length > 0 ? results[0] : null;

          const categories = [
            "makeup", "dekorasi", "fotografi", "videografi", "wcc",
            "mc", "musik", "catering", "venue", "wo", "busana", "henna",
            "hantaran", "upacara_adat"
          ];
          
          let vendorIds = [];
          if (row) {
            for (const cat of categories) {
               const key = cat;
               if (row[key]) vendorIds.push(row[key]);
            }
          }
          
          let vendorDataMap = {};
          if (vendorIds.length > 0) {
             const placeholders = vendorIds.map(() => '?').join(',');
             const { results: vInfos } = await env.d1_database
                .prepare(`SELECT * FROM vendor WHERE id IN (${placeholders})`)
                .bind(...vendorIds)
                .all();
             for (const vInfo of (vInfos || [])) {
                 vendorDataMap[vInfo.id] = vInfo;
             }
          }

          let vendorArray = [];
          if (row) {
            for (const cat of categories) {
               const key = cat;
               if (row[key]) {
                  const vId = row[key];
                  const vInfo = vendorDataMap[vId] || {};
                  
                  let extra = {};
                  if (cat === "wcc") {
                     extra = { kategori: "Wedding Content Creator" };
                  } else if (cat === "mc") {
                     extra = { kategori: "MC" };
                  } else if (cat === "upacara_adat") {
                     extra = { kategori: "Upacara Adat" };
                  } else if (cat === "wo") {
                     extra = { kategori: "Wedding Organizer" };
                  } else {
                     extra = { kategori: cat.charAt(0).toUpperCase() + cat.slice(1) };
                  }

                  const v = {
                     id: vId,
                     ...extra,
                     nama: vInfo.nama || "",
                     whatsapp: vInfo.whatsapp || "",
                     instagram: vInfo.instagram || "",
                     logo: vInfo.logo || "",
                     deskripsi: vInfo.deskripsi || ""
                  };
                  
                  vendorArray.push(v);
               }
            }
          }

          
          // Also fetch WO team from klien_wo
          const { results: woTeamResults } = await env.d1_database
            .prepare(`SELECT * FROM klien_wo WHERE id_klien = ?`)
            .bind(id_klien)
            .all();
            
          let finalWoTeam = woTeamResults.map(w => ({
              id: w.id,
              vendor: w.vendor,
              peran: w.peran,
              nama: w.nama,
              whatsapp: w.whatsapp,
              instagram: w.instagram
          }));

          return jsonResponse([{
            id_klien,
            vendor: vendorArray,
            wedding_organizer: finalWoTeam
          }]);
        }

        if (method === "POST" || method === "PUT") {
          const data = await request.json();
          const vendors = data.vendor || [];
          const woTeam = data.wedding_organizer || [];

          const allVendors = [...vendors];
          
          const flatRow = {
              id_klien: id_klien,
              makeup: null,
              dekorasi: null,
              fotografi: null,
              videografi: null,
              wcc: null,
              mc: null,
              musik: null,
              catering: null,
              venue: null,
              wo: null,
              busana: null,
              henna: null,
              hantaran: null,
              upacara_adat: null
          };
          
          const catMap = {
              "makeup": "makeup",
              "dekorasi": "dekorasi",
              "fotografi": "fotografi",
              "videografi": "videografi",
              "wcc": "wcc",
              "wedding content creator": "wcc",
              "mc": "mc",
              "musik": "musik",
              "catering": "catering",
              "venue / gedung": "venue",
              "venue": "venue",
              "wedding organizer": "wo",
              "wo": "wo",
              "busana": "busana",
              "henna": "henna",
              "hantaran": "hantaran",
              "upacara adat": "upacara_adat",
              "upacara_adat": "upacara_adat"
          };

          for (const v of allVendors) {
              const catKey = (v.kategori || "").toLowerCase();
              const mappedTarget = Object.keys(catMap).find(k => catKey.includes(k)) ? catMap[Object.keys(catMap).find(k => catKey.includes(k))] : null;
              if (mappedTarget && v.id) {
                 flatRow[mappedTarget] = v.id;
              }
          }

          const batchStmts = [];
          
          batchStmts.push(env.d1_database.prepare(`DELETE FROM klien_vendor WHERE id_klien = ?`).bind(id_klien));
          batchStmts.push(env.d1_database.prepare(`
              INSERT INTO klien_vendor (
                  id_klien,
                  makeup,
                  dekorasi,
                  fotografi,
                  videografi,
                  wcc,
                  mc,
                  musik,
                  catering,
                  venue,
                  wo,
                  busana,
                  henna,
                  hantaran,
                  upacara_adat
              ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
          `).bind(
              flatRow.id_klien,
              flatRow.makeup,
              flatRow.dekorasi,
              flatRow.fotografi,
              flatRow.videografi,
              flatRow.wcc,
              flatRow.mc,
              flatRow.musik,
              flatRow.catering,
              flatRow.venue,
              flatRow.wo,
              flatRow.busana,
              flatRow.henna,
              flatRow.hantaran,
              flatRow.upacara_adat
          ));

          batchStmts.push(env.d1_database.prepare(`DELETE FROM klien_wo WHERE id_klien = ?`).bind(id_klien));
          for (const item of woTeam) {
             batchStmts.push(env.d1_database.prepare(
               `INSERT INTO klien_wo (id_klien, vendor, peran, nama, whatsapp, instagram) VALUES (?, ?, ?, ?, ?, ?)`
             ).bind(id_klien, item.vendor || flatRow.wo || '', item.peran || '', item.nama || '', item.whatsapp || '', item.instagram || ''));
          }

          await env.d1_database.batch(batchStmts);

          return jsonResponse({ success: true, message: "Klien vendor and WO team saved successfully" });
        }
      }

      // ==========================================
      // ROUTE: MUSIK
      // ==========================================
      if (pathname === "/api/musik") {
        if (method === "GET") {
          const { results } = await env.d1_database.prepare("SELECT * FROM musik").all();
          const grouped = new Map();
          for (const item of results) {
            const key = `${item.judul}|${item.artis}`;
            if (!grouped.has(key)) {
              grouped.set(key, {
                id: item.id,
                judul: item.judul,
                artis: item.artis,
                rekomendasi: safeParseJSON(item.rekomendasi, []),
                deskripsi: item.deskripsi,
                versi: []
              });
            }
            if (item.versi && item.link) {
              grouped.get(key).versi.push({
                kategori: item.versi,
                tautan: item.link
              });
            }
          }
          return jsonResponse(Array.from(grouped.values()), { headers: { "Cache-Control": "public, max-age=300" } });
        }

        if (method === "POST" || method === "PUT") {
          const body = await request.json();
          const id = body.id || `msc-${Math.random().toString(36).substring(2, 9)}`;
          const { judul, artis, rekomendasi, deskripsi, versi, link } = body;

          await env.d1_database.prepare(
            `INSERT INTO musik (id, judul, artis, rekomendasi, deskripsi, versi, link)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET
               judul = excluded.judul,
               artis = excluded.artis,
               rekomendasi = excluded.rekomendasi,
               deskripsi = excluded.deskripsi,
               versi = excluded.versi,
               link = excluded.link`
          ).bind(
             id, 
             judul || '', 
             artis || '', 
             JSON.stringify(rekomendasi || []), 
             deskripsi || '', 
             versi || '', 
             link || ''
          ).run();

          return jsonResponse({ success: true, message: "Musik saved successfully", musik_id: id });
        }

        if (method === "DELETE") {
          const id = url.searchParams.get("id");
          if (!id) {
            return errorResponse("Field id is required", 400);
          }
          await env.d1_database.prepare("DELETE FROM musik WHERE id = ?").bind(id).run();
          return jsonResponse({ success: true, message: "Musik deleted successfully" });
        }
      }

      // ==========================================
      // ROUTE: PENCAPAIAN
      // ==========================================
      if (pathname === "/api/pencapaian" && method === "GET") {
        const { results } = await env.d1_database.prepare("SELECT * FROM pencapaian ORDER BY id ASC").all();
        const formatted = results.map((row) => ({
          ...row,
          gambar: row.gambar ? row.gambar.split(',') : []
        }));
        return jsonResponse(formatted, { headers: { "Cache-Control": "public, max-age=300" } });
      }

      // ==========================================
      // ROUTE: PENGALAMAN
      // ==========================================
      if (pathname === "/api/pengalaman" && method === "GET") {
        const { results } = await env.d1_database.prepare("SELECT * FROM pengalaman ORDER BY id ASC").all();
        const formatted = results.map((row) => ({
          ...row,
          gambar: row.gambar ? row.gambar.split(',') : []
        }));
        return jsonResponse(formatted, { headers: { "Cache-Control": "public, max-age=300" } });
      }

      // ==========================================
      // ROUTE: VENDOR (MASTER PLATFORM VENDORS)
      // ==========================================
      if (pathname === "/api/vendor") {
        if (method === "GET") {
          const categoriesResult = await env.d1_database.prepare("SELECT DISTINCT kategori FROM vendor WHERE kategori IS NOT NULL").all();
          const vendorsResult = await env.d1_database.prepare("SELECT * FROM vendor").all();

          const processedVendors = vendorsResult.results.map(v => ({
            ...v,
            terverifikasi: v.terverifikasi === 1,
          }));

          const categories = categoriesResult.results.map(c => c.kategori);

          return jsonResponse({
            daftarKategori: categories,
            vendors: processedVendors,
          }, { headers: { "Cache-Control": "public, max-age=300" } });
        }
        
        if (method === "POST" || method === "PUT") {
          const body = await request.json();
          // generate a new id if not provided
          const id = body.id || `vdr-${Math.random().toString(36).substring(2, 9)}`;
          const { nama, kategori, logo, deskripsi, whatsapp, tiktok, instagram, facebook, youtube, website, peta } = body;
          
          await env.d1_database.prepare(
            `INSERT INTO vendor (id, nama, kategori, logo, deskripsi, whatsapp, tiktok, instagram, facebook, youtube, website, peta, verifikasi)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET
               nama = excluded.nama,
               kategori = excluded.kategori,
               logo = excluded.logo,
               deskripsi = excluded.deskripsi,
               whatsapp = excluded.whatsapp,
               tiktok = excluded.tiktok,
               instagram = excluded.instagram,
               facebook = excluded.facebook,
               youtube = excluded.youtube,
               website = excluded.website,
               peta = excluded.peta`
          ).bind(id, nama || '', kategori || '', logo || '', deskripsi || '', whatsapp || '', tiktok || '', instagram || '', facebook || '', youtube || '', website || '', peta || '', false).run();

          return jsonResponse({ success: true, message: "Vendor saved successfully", vendor_id: id });
        }

        if (method === "DELETE") {
          const id = url.searchParams.get("id");
          if (!id) {
            return errorResponse("Field id is required", 400);
          }
          await env.d1_database.prepare("DELETE FROM vendor WHERE id = ?").bind(id).run();
          return jsonResponse({ success: true, message: "Vendor deleted successfully" });
        }
      }

      // /api/testimoni - Reviews/Testimonials API
      if (pathname === "/api/testimoni") {
        if (method === "GET") {
          const { results } = await env.d1_database
            .prepare("SELECT * FROM testimoni ORDER BY tanggal DESC")
            .all();
          return jsonResponse(results || [], { headers: { "Cache-Control": "public, max-age=120" } });
        }

        if (method === "POST" || method === "PUT") {
          const body = await request.json();
          const id = body.id || `testi-${Math.random().toString(36).substring(2, 9)}`;
          const { id_klien, nama_klien, rating, pesan, tampilkan } = body;
          
          await env.d1_database.prepare(
            `INSERT INTO testimoni (id, id_klien, nama_klien, rating, pesan, tampilkan)
             VALUES (?, ?, ?, ?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET
               rating = excluded.rating,
               pesan = excluded.pesan,
               tampilkan = excluded.tampilkan`
          ).bind(id, id_klien || '', nama_klien || 'Klien', rating || 5, pesan || '', tampilkan !== undefined ? tampilkan : false).run();

          return jsonResponse({ success: true, message: "Testimoni saved successfully", testimoni_id: id });
        }

        if (method === "DELETE") {
          const id = url.searchParams.get("id");
          if (!id) {
            return errorResponse("Field id is required", 400);
          }
          await env.d1_database.prepare("DELETE FROM testimoni WHERE id = ?").bind(id).run();
          return jsonResponse({ success: true, message: "Testimoni deleted successfully" });
        }
      }

      // Standard 404 Route Not Found
      return errorResponse("Endpoint not found", 404);

    } catch (err) {
      return jsonResponse({
        error: true,
        message: err.message,
        stack: err.stack,
      }, { status: 500 });
    }
  }
};

// ==========================================
// MAPPING HELPER FUNCTIONS
// ==========================================

function toMemberObj(row) {
  return {
    id: row.anggota_id,
    peran: row.peran_atau_judul,
    nama: row.nama,
    whatsapp: row.whatsapp,
    instagram: row.instagram
  };
}

function toTamuObj(row) {
  return {
    id: row.anggota_id,
    judul: row.peran_atau_judul,
    nama: row.nama,
    whatsapp: row.whatsapp,
    instagram: row.instagram
  };
}

function toVendorObj(row) {
  return {
    id: row.vendor_id,
    nama: row.nama,
    kategori: row.kategori,
    logo: row.logo,
    terverifikasi: row.terverifikasi === 1,
    deskripsi: row.deskripsi,
    instagram: row.instagram,
    whatsapp: row.whatsapp,
    website: row.website,
    facebook: row.facebook,
    youtube: row.youtube,
    peta: row.peta,
    tautan: row.tautan
  };
}

// ==========================================
// RESPONSE & PARSER UTILITIES
// ==========================================

function jsonResponse(data, init = {}, isGet = false) {
  const headers = {
    "Content-Type": "application/json;charset=UTF-8",
    "Cache-Control": isGet ? "public, max-age=15, s-maxage=60, stale-while-revalidate=120" : "no-store",
    ...corsHeaders,
    ...(init.headers || {}),
  };
  return new Response(JSON.stringify(data, null, 2), {
    status: 200,
    ...init,
    headers,
  });
}

function errorResponse(message, status = 400) {
  return jsonResponse({ error: true, message }, { status }, false);
}

function safeParseJSON(str, fallback = []) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    if (typeof str === 'string') {
      return str.split(',').map(s => s.trim()).filter(Boolean);
    }
    return fallback;
  }
}
