// Waktu Solat & Wirid — simpan fail app untuk kegunaan luar talian.
const CACHE = 'wsw-v1.2.0';
const FAIL = ['./', './index.html', './manifest.json', './ikon-192.png', './ikon-512.png', './ikon-180.png', '../derma-qr.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FAIL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});
// Rangkaian dahulu (versi baharu terus dimuat), cache jika luar talian.
// Data waktu solat (api.waktusolat.app) tidak dicache di sini — app menyimpannya sendiri.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const sendiri = new URL(e.request.url).origin === location.origin;
  if (!sendiri) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const salin = r.clone(); caches.open(CACHE).then(c => c.put(e.request, salin)); }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});
