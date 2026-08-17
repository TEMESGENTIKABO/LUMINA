const CACHE_NAME = "aksum-v1";
const OFFLINE_URL = "/en";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for article pages (always try fresh content first, fall back
// to cache only when offline) - this is a reading-continuity feature, not a
// performance cache, so freshness matters more than speed here.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const isArticlePage = /\/(en|am)\/article\//.test(url.pathname);
  const isStaticAsset = url.pathname.startsWith("/images/") || url.pathname.startsWith("/_next/static/");

  if (!isArticlePage && !isStaticAsset) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match(OFFLINE_URL)))
  );
});

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || "AKSUM", {
      body: data.body || "",
      icon: "/images/gerd.svg",
      data: { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
