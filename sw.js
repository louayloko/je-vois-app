/* Je vois · service worker : l'appli marche sans réseau une fois ouverte une première fois */
const CACHE = "je-vois-2026-10-16";
const FICHIERS = ["./", "./index.html", "./manifest.webmanifest", "./icone-192.png", "./icone-512.png", "./a-propos.html"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if(e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if(url.origin !== location.origin){ return; } // polices, suivi : réseau seulement
  e.respondWith(
    fetch(e.request).then(rep => { const copie = rep.clone(); caches.open(CACHE).then(c => c.put(e.request, copie)); return rep; })
      .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
  );
});
