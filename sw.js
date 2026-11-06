// Cache separat pentru fiecare folder (la github.io mai multe aplicații împart același domeniu)
const P='cecuri@'+self.registration.scope+'#',C=P+'v21';
const F=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/apple-touch-icon.png'];
const X=['https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js','https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js'];
const CDN=/^https:\/\/(cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com)$/;
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F).then(()=>Promise.all(X.map(u=>c.add(new Request(u,{mode:'cors'})).catch(()=>{}))))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith(P)&&x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
// Rețeaua întâi (ai mereu versiunea nouă); dacă e offline sau prea lentă (4 s) se folosește copia salvată
self.addEventListener('fetch',e=>{const q=e.request,o=new URL(q.url).origin,same=o===location.origin;
 if(q.method!=='GET'||(!same&&!CDN.test(o)))return;
 const net=fetch(q).then(r=>{if(r.ok||r.type==='opaque'){const c=r.clone();caches.open(C).then(x=>x.put(q,c))}return r});
 const cached=async()=>{const c=await caches.open(C);return(await c.match(q,{ignoreSearch:true}))||(same&&q.mode==='navigate'&&await c.match('index.html'))||Response.error()};
 e.respondWith(same?Promise.race([net,new Promise((_,no)=>setTimeout(no,4000))]).catch(cached):net.catch(cached))});