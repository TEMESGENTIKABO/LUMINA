const VERSION = "v2";
const PAGES = `aksum-pages-${VERSION}`;
const IMAGES = `aksum-img-${VERSION}`;
const STATIC = `aksum-static-${VERSION}`;
const OFFLINE_URL = "/offline.html";
const SKIP = /^\/(api|admin)(\/|$)|^\/(en|am)\/(account|sign-in|sign-up|membership|onboarding|reset-password|forgot-password)(\/|$)/;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC).then((c) => c.addAll([OFFLINE_URL])).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("aksum-") && ![PAGES, IMAGES, STATIC].includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function trim(name, max) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  if (keys.length > max) await Promise.all(keys.slice(0, keys.length - max).map((k) => cache.delete(k)));
}
const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // Pages: fresh news first (4s limit), then your last saved copy, then the offline page.
  if (req.mode === "navigate") {
    if (SKIP.test(url.pathname)) return;
    event.respondWith((async () => {
      try {
        const res = await Promise.race([fetch(req), timeout(4000)]);
        if (res.ok) {
          const copy = res.clone();
          caches.open(PAGES).then((c) => c.put(req, copy)).then(() => trim(PAGES, 60));
        }
        return res;
      } catch {
        return (await caches.match(req)) || (await caches.match(OFFLINE_URL));
      }
    })());
    return;
  }

  // Built files never change: serve from cache first.
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/fonts/")) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(STATIC).then((c) => c.put(req, copy));
        return res;
      }))
    );
    return;
  }

  // Images: show the saved copy instantly, refresh it quietly in the background.
  if (url.pathname.startsWith("/_next/image") || url.pathname.startsWith("/images/")) {
    event.respondWith(caches.open(IMAGES).then(async (cache) => {
      const hit = await cache.match(req);
      const net = fetch(req).then((res) => {
        if (res.ok) { cache.put(req, res.clone()); trim(IMAGES, 150); }
        return res;
      }).catch(() => hit);
      return hit || net;
    }));
  }
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