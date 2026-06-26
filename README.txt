BioIPTV sencillo

ARCHIVOS:
- index.html, manifest.webmanifest, sw.js, icon.svg: subir a GitHub Pages.
- worker.js: pegar en Cloudflare Worker gratuito para evitar CORS/HTTP.

PASOS MINIMOS:
1) Sube index.html, manifest.webmanifest, sw.js e icon.svg a https://github.com/YhasOS/yhasos.github.io
2) Crea un Worker gratuito en Cloudflare y pega el contenido de worker.js.
3) Copia la URL del Worker, por ejemplo https://bioiptv.xxxxx.workers.dev
4) Abre https://yhasos.github.io/
5) Pega la URL del Worker en Proxy anti-bloqueo y pulsa Guardar proxy.
6) Pega tu URL M3U y pulsa Cargar.

NOTA:
GitHub Pages no puede hacer de proxy. Por eso hace falta el Worker si el proveedor usa HTTP o bloquea CORS.
