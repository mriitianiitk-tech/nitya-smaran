// Nitya Smaran Service Worker — Network-First for HTML, Stale-While-Revalidate for Assets
const CACHE_NAME = "nitya-smaran-v4";

const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png"
];

// Install: Cache core assets and immediately activate
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate: Immediately purge ALL older caches and claim clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-First for HTML/Navigation, Cache-First for versioned assets
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // 1. API calls: Always pure Network, fallback to nothing
  if (request.url.includes("/api/")) {
    event.respondWith(
      fetch(request).catch(() => new Response(JSON.stringify({ error: "offline" }), {
        headers: { "Content-Type": "application/json" }
      }))
    );
    return;
  }

  // 2. HTML Navigation / Main Document: ALWAYS Network-First
  // This guarantees fresh deploys are seen immediately on refresh
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(request).then((res) => res || caches.match("/")))
    );
    return;
  }

  // 3. Static Assets: Network-first with cache fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && request.method === "GET") {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return networkResponse;
      })
      .catch(() => caches.match(request))
  );
});
