BioIPTV v2

1) GitHub Pages:
   - Sube index.html, manifest.webmanifest y sw.js al repositorio o carpeta /iptv/.

2) Cloudflare Worker:
   - Abre tu Worker.
   - Sustituye todo el contenido por worker.js.
   - Pulsa Deploy.

3) En la app:
   - Proxy: https://solitary-sky-5274.yhasos.workers.dev/
   - URL M3U: tu URL privada.
   - Pulsa Cargar.

Mejoras incluidas:
- Categorías por group-title de la lista M3U.
- Filtro Todo / Canales / VOD / Adultos / Favoritos.
- Oculta adultos por defecto.
- Reproductor HLS y MPEGTS con hls.js y mpegts.js.
- Favoritos, buscador, pantalla completa y reintento.
