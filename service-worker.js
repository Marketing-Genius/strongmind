// service-worker.js
self.addEventListener('install', e => {
  console.log('[ServiceWorker] Installed');
});

self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request));
});
