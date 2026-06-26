export default {
  async fetch(request) {
    const u = new URL(request.url);
    if (u.pathname !== '/proxy') return new Response('BioIPTV proxy activo. Usa /proxy?url=', {status:200});
    const target = u.searchParams.get('url');
    if (!target) return new Response('Falta url', {status:400, headers:cors()});
    let targetUrl;
    try { targetUrl = new URL(target); } catch { return new Response('URL no valida', {status:400, headers:cors()}); }
    if (!['http:', 'https:'].includes(targetUrl.protocol)) return new Response('Protocolo no permitido', {status:400, headers:cors()});
    const range = request.headers.get('range');
    const headers = {'User-Agent':'Mozilla/5.0 BioIPTV','Accept':'*/*'};
    if (range) headers['Range'] = range;
    const upstream = await fetch(targetUrl.toString(), {headers, redirect:'follow'});
    const ct = upstream.headers.get('content-type') || '';
    const isText = ct.includes('mpegurl') || ct.includes('text') || targetUrl.pathname.toLowerCase().endsWith('.m3u') || targetUrl.pathname.toLowerCase().endsWith('.m3u8');
    const outHeaders = cors();
    outHeaders.set('Content-Type', ct || (isText ? 'application/vnd.apple.mpegurl' : 'application/octet-stream'));
    outHeaders.set('Cache-Control','no-store');
    const ar = upstream.headers.get('accept-ranges'); if (ar) outHeaders.set('Accept-Ranges', ar);
    const cr = upstream.headers.get('content-range'); if (cr) outHeaders.set('Content-Range', cr);
    const cl = upstream.headers.get('content-length'); if (cl && !isText) outHeaders.set('Content-Length', cl);
    if (isText) {
      let text = await upstream.text();
      if (targetUrl.pathname.toLowerCase().endsWith('.m3u8') || text.includes('#EXTM3U')) {
        text = rewritePlaylist(text, targetUrl, u.origin);
      }
      return new Response(text, {status: upstream.status, headers: outHeaders});
    }
    return new Response(upstream.body, {status: upstream.status, headers: outHeaders});
  }
}
function cors(){return new Headers({'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,HEAD,OPTIONS','Access-Control-Allow-Headers':'Range,Content-Type','Access-Control-Expose-Headers':'Content-Length,Content-Range,Accept-Ranges'});}
function rewritePlaylist(text, base, origin){
  return text.split('\n').map(line=>{
    const t=line.trim();
    if(!t || t.startsWith('#')) return line;
    try { return origin+'/proxy?url='+encodeURIComponent(new URL(t, base).toString()); } catch { return line; }
  }).join('\n');
}
