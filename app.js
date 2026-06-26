const $ = (id) => document.getElementById(id);
const urlInput = $('m3uUrl');
const loadBtn = $('loadBtn');
const channelsEl = $('channels');
const video = $('video');
const nowTitle = $('nowTitle');
const search = $('search');
const count = $('count');
const fullscreenBtn = $('fullscreenBtn');
const installBtn = $('installBtn');
let allChannels = [];
let hls;
let deferredPrompt;

urlInput.value = localStorage.getItem('bioiptv_url') || '';

function parseM3U(text){
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const channels = [];
  let meta = null;
  for(const line of lines){
    if(line.startsWith('#EXTINF')){
      const name = (line.split(',').pop() || 'Canal').trim();
      const logo = (line.match(/tvg-logo="([^"]*)"/) || [])[1] || '';
      const group = (line.match(/group-title="([^"]*)"/) || [])[1] || '';
      meta = { name, logo, group };
    } else if(!line.startsWith('#') && meta){
      channels.push({ ...meta, url: line });
      meta = null;
    }
  }
  return channels;
}

function playChannel(ch){
  localStorage.setItem('bioiptv_last', ch.url);
  nowTitle.textContent = ch.name;
  if(hls){ hls.destroy(); hls = null; }
  if(ch.url.includes('.m3u8') && window.Hls && Hls.isSupported()){
    hls = new Hls();
    hls.loadSource(ch.url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(()=>{}));
  } else {
    video.src = ch.url;
    video.play().catch(()=>{});
  }
  renderChannels(search.value);
}

function renderChannels(filter=''){
  const q = filter.toLowerCase().trim();
  const list = allChannels.filter(c => c.name.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
  count.textContent = `${list.length} canal${list.length === 1 ? '' : 'es'}`;
  channelsEl.innerHTML = '';
  if(!list.length){
    channelsEl.innerHTML = '<div class="empty">No hay canales cargados.</div>';
    return;
  }
  const last = localStorage.getItem('bioiptv_last');
  for(const ch of list){
    const btn = document.createElement('button');
    btn.className = 'channel' + (ch.url === last ? ' active' : '');
    const img = ch.logo ? `<img src="${ch.logo}" alt="">` : `<img src="icon.svg" alt="">`;
    btn.innerHTML = `${img}<div><span>${escapeHtml(ch.name)}</span><small>${escapeHtml(ch.group || 'Canal')}</small></div>`;
    btn.onclick = () => playChannel(ch);
    channelsEl.appendChild(btn);
  }
}

function escapeHtml(s){
  return s.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

async function loadList(){
  const url = urlInput.value.trim();
  if(!url){ alert('Pega primero la URL M3U.'); return; }
  localStorage.setItem('bioiptv_url', url);
  loadBtn.disabled = true; loadBtn.textContent = 'Cargando...';
  try{
    const res = await fetch(url, { cache: 'no-store' });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    allChannels = parseM3U(text);
    localStorage.setItem('bioiptv_channels', JSON.stringify(allChannels));
    renderChannels();
    const last = localStorage.getItem('bioiptv_last');
    const first = allChannels.find(c => c.url === last) || allChannels[0];
    if(first) playChannel(first);
  } catch(e){
    alert('No se pudo cargar la lista. Puede ser por URL incorrecta o por bloqueo CORS del proveedor.');
    console.error(e);
  } finally {
    loadBtn.disabled = false; loadBtn.textContent = 'Cargar';
  }
}

loadBtn.onclick = loadList;
search.oninput = () => renderChannels(search.value);
fullscreenBtn.onclick = () => video.requestFullscreen?.();

try { allChannels = JSON.parse(localStorage.getItem('bioiptv_channels') || '[]'); } catch {}
renderChannels();

if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js').catch(()=>{}); }
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; installBtn.hidden = false; });
installBtn.onclick = async () => { if(deferredPrompt){ deferredPrompt.prompt(); deferredPrompt = null; installBtn.hidden = true; } };
