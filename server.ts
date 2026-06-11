import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Serve static paths explicitly for Vite if needed? Wait, Vite middleware handles all in dev.
  // In production, express.static handles it.

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    app.get("*", async (req, res) => {
      try {
        const url = req.originalUrl;
        
        // Let Vite transform the HTML
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);

        // Inject custom meta tags if not root, portofolio, harga, kontak, admin, etc.
        const pathname = url.split('?')[0];
        const isClientArea = !['/', '/portofolio', '/harga', '/kontak', '/buat-jadwal', '/admin'].includes(pathname) && 
                             !pathname.startsWith('/musik') && 
                             !pathname.startsWith('/api') &&
                             !pathname.startsWith('/assets') &&
                             !pathname.startsWith('/data') &&
                             !pathname.startsWith('/gambar');

        if (isClientArea) {
          let clientSlug = pathname.split('/')[1] || "Klien";
          if (clientSlug === 'form' && pathname.split('/').length > 2) {
            clientSlug = pathname.split('/')[2];
          }
          let clientId = clientSlug;
          
          let metaTitle = "";
          let metaDesc = "";
          let metaImg = "";

          try {
            // Fetch dynamically from Cloudflare worker API
            const apiUrl = `https://web.halo-pratama-mc.workers.dev/api/klien-akun?username=${encodeURIComponent(clientSlug)}`;
            const response = await fetch(apiUrl);
            if (response.ok) {
              const clients = await response.json();
              if (clients && clients.length > 0) {
                const clientData = clients[0];
                metaTitle = clientData.meta_judul || clientData.metaTitle || "";
                metaDesc = clientData.meta_deskripsi || clientData.metaDescription || "";
                metaImg = clientData.metatag || clientData.meta_gambar || clientData.metaImage || "";
              }
            }
          } catch (e) {
            console.error("Error fetching client data for tags", e);
          }

          const titleSlug = clientSlug
            .split('&')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' & ');
            
          const title = metaTitle || `Area Klien - ${titleSlug} | Pratama MC`;
          const description = metaDesc || `Area eksklusif klien untuk ${titleSlug}. Lihat ringkasan acara, panduan, dan daftar vendor.`;
          const image = metaImg ? (metaImg.startsWith('http') ? metaImg : `https://pratamamc.my.id${metaImg.startsWith('/') ? metaImg : '/' + metaImg}`) : `https://pratamamc.my.id/gambar/source/metatag.png`;
          const currentUrl = `https://pratamamc.my.id${url}`;

          template = template.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
          template = template.replace(/<meta name="title" content=".*?" \/>/, `<meta name="title" content="${title}" />`);
          template = template.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${description}" />`);
          
          template = template.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`);
          template = template.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${description}" />`);
          template = template.replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${image}" />`);
          template = template.replace(/<meta property="og:url".*?\/>/, ''); // Remove if exists
          template = template.replace(/(<meta property="og:type".*?\/>)/, `$1\n    <meta property="og:url" content="${currentUrl}" />`);
          
          template = template.replace(/<meta property="twitter:title" content=".*?" \/>/, `<meta property="twitter:title" content="${title}" />`);
          template = template.replace(/<meta property="twitter:description" content=".*?" \/>/, `<meta property="twitter:description" content="${description}" />`);
          template = template.replace(/<meta property="twitter:image" content=".*?" \/>/, `<meta property="twitter:image" content="${image}" />`);
        }

        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        // @ts-ignore
        vite.ssrFixStacktrace(e);
        console.log(e.stack);
        res.status(500).end(e.stack);
      }
    });

  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static files explicitly for assets
    app.use(express.static(distPath, { index: false }));

    app.get("*", async (req, res) => {
      const url = req.originalUrl;
      const pathname = url.split('?')[0];
      const isClientArea = !['/', '/portofolio', '/harga', '/kontak', '/buat-jadwal', '/admin'].includes(pathname) && 
                            !pathname.startsWith('/musik') && 
                            !pathname.startsWith('/api') &&
                            !pathname.startsWith('/assets') &&
                            !pathname.startsWith('/data') &&
                            !pathname.startsWith('/gambar');

      let template = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");

      if (isClientArea) {
        let clientSlug = pathname.split('/')[1] || "Klien";
        if (clientSlug === 'form' && pathname.split('/').length > 2) {
          clientSlug = pathname.split('/')[2];
        }
        
        let metaTitle = "";
        let metaDesc = "";
        let metaImg = "";

        try {
          const apiUrl = `https://web.halo-pratama-mc.workers.dev/api/klien-akun?username=${encodeURIComponent(clientSlug)}`;
          // Note: for production SSR, fetch needs to be awaited, so making the route handler async
          // Wait, express allows async route handlers
          const response = await fetch(apiUrl);
          if (response.ok) {
            const clients = await response.json();
            if (clients && clients.length > 0) {
              const clientData = clients[0];
              metaTitle = clientData.meta_judul || clientData.metaTitle || "";
              metaDesc = clientData.meta_deskripsi || clientData.metaDescription || "";
              metaImg = clientData.metatag || clientData.meta_gambar || clientData.metaImage || "";
            }
          }
        } catch (e) {
          console.error("Error fetching client data for tags", e);
        }

        const titleSlug = clientSlug
          .split('&')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' & ');
          
        const title = metaTitle || `Area Klien - ${titleSlug} | Pratama MC`;
        const description = metaDesc || `Area eksklusif klien untuk ${titleSlug}. Lihat ringkasan acara, panduan, dan daftar vendor.`;
        const image = metaImg ? (metaImg.startsWith('http') ? metaImg : `https://pratamamc.my.id${metaImg.startsWith('/') ? metaImg : '/' + metaImg}`) : `https://pratamamc.my.id/gambar/source/metatag.png`;
        const currentUrl = `https://pratamamc.my.id${url}`;

        template = template.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
        template = template.replace(/<meta name="title" content=".*?" \/>/, `<meta name="title" content="${title}" />`);
        template = template.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${description}" />`);
        
        template = template.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`);
        template = template.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${description}" />`);
        template = template.replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${image}" />`);
        template = template.replace(/<meta property="og:url".*?\/>/, ''); // Remove if exists
        template = template.replace(/(<meta property="og:type".*?\/>)/, `$1\n    <meta property="og:url" content="${currentUrl}" />`);
        
        template = template.replace(/<meta property="twitter:title" content=".*?" \/>/, `<meta property="twitter:title" content="${title}" />`);
        template = template.replace(/<meta property="twitter:description" content=".*?" \/>/, `<meta property="twitter:description" content="${description}" />`);
        template = template.replace(/<meta property="twitter:image" content=".*?" \/>/, `<meta property="twitter:image" content="${image}" />`);
      }

      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
