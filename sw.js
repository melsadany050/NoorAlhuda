const C="noor-v3";
const FILES=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png","./icon-maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:"reload"})))));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
 const r=e.request;if(r.method!=="GET")return;
 const u=new URL(r.url);
 if(u.hostname==="api.alquran.cloud")return;
 const same=u.origin===location.origin;
 if(same){ // الشبكة أولًا ثم الكاش عند انقطاع الإنترنت
  e.respondWith(fetch(r,{cache:"no-cache"}).then(x=>{if(x.ok){const cp=x.clone();caches.open(C).then(c=>c.put(r,cp))}return x}).catch(()=>caches.match(r).then(h=>h||caches.match("./index.html"))));
 }else{ // الخطوط: الكاش أولًا
  e.respondWith(caches.match(r).then(h=>h||fetch(r).then(x=>{if(x.ok){const cp=x.clone();caches.open(C).then(c=>c.put(r,cp))}return x})));
 }});
