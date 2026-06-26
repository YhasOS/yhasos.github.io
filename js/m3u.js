function attr(line,name){const m=line.match(new RegExp(name+'="([^"]*)"','i'));return m?m[1].trim():''}
function cleanName(raw){return (raw||'Canal').replace(/^[-\s]+/,'').trim()||'Canal'}
function isAdult(ch){const t=((ch.group||'')+' '+(ch.name||'')).toLowerCase();return /adult|xxx|18\+|porn|porno|for adults|erotic/.test(t)}
function normalizeGroup(g){const x=(g||'Sin categoría').trim();const l=x.toLowerCase();
 if(/favor/.test(l))return x; if(/vod|movie|pelicula|cine/.test(l))return x; if(/sport|deport|dazn|laliga|liga|futbol|football|tennis|formula|f1|motogp/.test(l))return x;
 if(/adult|xxx|18\+|porno/.test(l))return 'Adultos'; return x}
function parseM3U(text){const lines=text.replace(/\r/g,'').split('\n');const channels=[];let meta=null;for(const line0 of lines){const line=line0.trim();if(!line)continue;if(line.startsWith('#EXTINF')){const comma=line.indexOf(',');meta={name:cleanName(comma>=0?line.slice(comma+1):''),logo:attr(line,'tvg-logo'),group:normalizeGroup(attr(line,'group-title')),id:attr(line,'tvg-id')||attr(line,'tvg-name')};}else if(!line.startsWith('#')&&meta){channels.push({...meta,url:line,adult:isAdult(meta),key:btoa(unescape(encodeURIComponent((meta.name+'|'+line).slice(0,300)))).replace(/=/g,'')});meta=null;}}return channels}
function groupsFrom(channels,showAdult=false){const map=new Map();channels.forEach(c=>{if(c.adult&&!showAdult)return;map.set(c.group,(map.get(c.group)||0)+1)});return [...map.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([name,count])=>({name,count}))}
