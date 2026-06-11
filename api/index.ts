import express from "express";
import path from "path";
import fs from "fs";

const app = express();

app.get("*", async (req, res) => {
  const url = req.originalUrl;
  const pathname = url.split('?')[0];
  const isClientArea = !['/', '/portofolio', '/harga', '/kontak', '/buat-jadwal', '/admin'].includes(pathname) && 
                        !pathname.startsWith('/musik') && 
                        !pathname.startsWith('/api') &&
                        !pathname.startsWith('/assets') &&
                        !pathname.startsWith('/data') &&
                        !pathname.startsWith('/gambar');

  try {
    const distPath = path.join(process.cwd(), "dist");
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
        const apiUrl = `https://web.halo-pratama-mc.workers.dev/api/klien-akun?slug=${encodeURIComponent(clientSlug)}`;
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
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' & ');
        
      const title = metaTitle || `Area Klien - ${titleSlug} | Pratama MC`;
      const description = metaDesc || `Area eksklusif klien untuk ${titleSlug}. Lihat ringkasan acara, panduan, dan daftar vendor.`;
      const image = metaImg || `https://pratamamc.my.id/gambar/source/metatag.png`;
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
  } catch (e) {
    if (url.startsWith("/api") || url.startsWith("/assets")) {
       res.status(404).send("Not found");
    } else {
       res.status(500).send("Error reading index.html from dist folder.");
    }
  }
});

export default app;
