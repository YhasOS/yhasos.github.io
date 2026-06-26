export default {
  async fetch(request) {
    const reqUrl = new URL(request.url);
    const target = reqUrl.searchParams.get('url');

    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Expose-Headers': '*'
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    if (!target) {
      return new Response('BioIPTV proxy activo', { headers: { ...cors, 'content-type': 'text/plain; charset=utf-8' } });
    }

    const headers = new Headers(request.headers);
    headers.set('User-Agent', 'Mozilla/5.0');
    headers.delete('host');
    headers.delete('origin');
    headers.delete('referer');

    const upstream = await fetch(target, {
      method: request.method,
      headers,
      redirect: 'follow'
    });

    const outHeaders = new Headers(upstream.headers);
    for (const [k, v] of Object.entries(cors)) outHeaders.set(k, v);
    outHeaders.delete('content-security-policy');
    outHeaders.delete('x-frame-options');

    const lower = target.toLowerCase();
    if (lower.includes('.m3u8')) outHeaders.set('content-type', 'application/vnd.apple.mpegurl');
    else if (lower.includes('.ts') || lower.includes('mpegts')) outHeaders.set('content-type', 'video/mp2t');
    else if (lower.includes('get.php') || lower.includes('type=m3u')) outHeaders.set('content-type', 'text/plain; charset=utf-8');

    return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers: outHeaders });
  }
};
