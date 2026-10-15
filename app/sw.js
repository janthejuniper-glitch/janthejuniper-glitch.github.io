// Service worker de la app del Centro JAN: guarda la app (no tus datos) para que abra al instante y sin conexión.
// Tus datos viven en el móvil (localStorage) y en tu Drive; la API nunca pasa por esta caché.
const VERSION = 'cj-v20';
const APP = ['./', './index.html', './trabajo.js', './manifest.webmanifest', '../icon-192.png', '../icon-512.png', '../apple-touch-icon.png', '../favicon.ico'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(APP)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.hostname.endsWith('google.com') || u.hostname.endsWith('googleusercontent.com')) return; // API: siempre a la red
  // la app: red primero (para recibir actualizaciones), y si no hay red, la copia guardada
  e.respondWith(fetch(e.request).then((r) => {
    if (r.ok && (u.origin === location.origin || u.hostname.endsWith('gstatic.com') || u.hostname.endsWith('googleapis.com'))) {
      const c = r.clone(); caches.open(VERSION).then((k) => k.put(e.request, c));
    }
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('./index.html'))));
});
