const CACHE_NAME = 'medicore-v2.0.0';

// Archivos del app shell (se sirven offline siempre)
const APP_SHELL = [
  './',
  './index.html',
  './booking.html',
  './supabase-client.js',
  './manifest.json',
  './logodc.jpeg',
  './icon-512.png',
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap',
];

// URLs de Supabase y CDNs externos — NO cachear, siempre red
const NETWORK_ONLY = [
  'supabase.co',
  'supabase.com',
  'cdn.jsdelivr.net',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Supabase y CDNs externos: siempre red (nunca cachear)
  if (NETWORK_ONLY.some(domain => url.includes(domain))) {
    e.respondWith(fetch(e.request).catch(() => new Response('', { status: 503 })));
    return;
  }

  // Estrategia: Cache primero, luego red (offline-first para el app shell)
  e.respondWith(
    caches.match(e.request).then(cached => {
      const networkFetch = fetch(e.request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => cached || caches.match('./index.html'));

      return cached || networkFetch;
    })
  );
});
