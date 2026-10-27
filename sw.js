const C='cecuri-v11',F=['./','index.html','manifest.webmanifest'],X=['https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js'];
const CDN=/^https:\/\/(cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com)$/;
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F).then(()=>Promise.all(X.map(u=>c.add(new Request(u,{mode:'cors'})).catch(()=>{}))))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{const o=new URL(e.request.url).origin;if(e.request.method!=='GET'||(o!==location.origin&&!CDN.test(o)))return;
e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||(o===location.origin?caches.match('index.html'):Response.error()))))});
