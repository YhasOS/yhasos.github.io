export default {
  async fetch(request) {
    const reqUrl = new URL(request.url);
    const target = reqUrl.searchParams.get('url');
    if (request.method === 'OPTIONS') return cors('', 204);
    if (!target) return cors('BioIPTV Worker v7 activo');
    try {
      const tu = new URL(target);
      const h = new Headers();
      h.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36');
      h.set('Accept', '*/*');
      h.set('Origin', tu.origin);
      h.set('Referer', tu.origin + '/');
      const range = request.headers.get('Range');
      if (range) h.set('Range', range);
      const upstream = await fetch(target, { method: request.method === 'HEAD' ? 'HEAD' : 'GET', headers: h, redirect: 'follow' });
      const headers = new Headers(upstream.headers);
      headers.set('Access-Control-Allow-Origin','*');
      headers.set('Access-Control-Allow-Methods','GET,HEAD,OPTIONS');
      headers.set('Access-Control-Allow-Headers','*');
      headers.set('Access-Control-Expose-Headers','Content-Length,Content-Range,Accept-Ranges,Content-Type');
      headers.set('Cross-Origin-Resource-Policy','cross-origin');
      headers.delete('content-security-policy');
      headers.delete('x-frame-options');
      return new Response(upstream.body, {status: upstream.status, statusText: upstream.statusText, headers});
    } catch(e) { return cors('Worker error: '+e.message, 502); }
  }
}
function cors(body,status=200){return new Response(body,{status,headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,HEAD,OPTIONS','Access-Control-Allow-Headers':'*','Content-Type':'text/plain;charset=utf-8'}})}
