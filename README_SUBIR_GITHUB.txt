BIOIPTV PWA - SUBIR A GITHUB PAGES

Repositorio: https://github.com/YhasOS/yhasos.github.io
Web: https://yhasos.github.io/

PASOS:
1. Entra en GitHub y abre el repositorio YhasOS/yhasos.github.io.
2. Pulsa Add file > Upload files.
3. Sube estos archivos directamente en la raíz del repositorio:
   - index.html
   - styles.css
   - app.js
   - manifest.webmanifest
   - sw.js
   - icon.svg
4. Pulsa Commit changes.
5. Espera unos segundos y abre https://yhasos.github.io/

NOTA:
- Si ya tienes una web en ese repositorio, subir este index.html sustituirá la página principal.
- Si no quieres sustituirla, crea una carpeta llamada iptv y sube los archivos dentro. En ese caso la app estará en:
  https://yhasos.github.io/iptv/

IMPORTANTE SOBRE LISTAS M3U:
- Algunas URL M3U no cargan en navegador por bloqueo CORS del proveedor.
- Si ocurre, la app mostrará error aunque la URL sea correcta.
- En Android suele ir mejor con Chrome. En iPhone debe abrirse con Safari para añadirla a pantalla de inicio.
