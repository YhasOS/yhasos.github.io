export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = url.searchParams.get('url');
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': '*'
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (!target) return new Response('BioIPTV Worker activo', { headers: { ...cors, 'Content-Type': 'text/plain; charset=utf-8' } });
    try {
      const range = request.headers.get('Range');
      const headers = { 'User-Agent': 'Mozilla/5.0', 'Accept': '*/*' };
      if (range) headers.Range = range;
      const upstream = await fetch(target, { headers, redirect: 'follow' });
      const outHeaders = new Headers(upstream.headers);
      Object.entries(cors).forEach(([k,v]) => outHeaders.set(k,v));
      outHeaders.set('Cache-Control', 'no-store');
      return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers: outHeaders });
    } catch (e) {
      return new Response('Error proxy: ' + e.message, { status: 502, headers: { ...cors, 'Content-Type': 'text/plain; charset=utf-8' } });
    }
  }
};
