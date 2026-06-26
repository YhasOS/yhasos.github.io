const Store={
  get(k,def=null){try{return JSON.parse(localStorage.getItem(k))??def}catch{return def}},
  set(k,v){localStorage.setItem(k,JSON.stringify(v))},
  del(k){localStorage.removeItem(k)},
  keys:{m3u:'bioiptv3_m3u',proxy:'bioiptv3_proxy',fav:'bioiptv3_fav',recent:'bioiptv3_recent',last:'bioiptv3_last',adult:'bioiptv3_adult'}
};
