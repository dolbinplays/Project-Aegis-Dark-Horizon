const AEGIS_PWA_CACHE = "aegis-v0.26.09.07.1258_MOBILE_GEOSCAPE_TERMINATOR_AUDIO_TIME_RESUME_HOTFIX";
const AEGIS_RUNTIME_CACHE = "aegis-runtime-v0.26.09.07.1258_MOBILE_GEOSCAPE_TERMINATOR_AUDIO_TIME_RESUME_HOTFIX";
const AEGIS_SHELL = [
  "./index.html",
  "./manifest.webmanifest",
  "./assets/icons/aegis-192.png",
  "./assets/icons/aegis-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(AEGIS_PWA_CACHE).then(cache => cache.addAll(AEGIS_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keep = new Set([AEGIS_PWA_CACHE, AEGIS_RUNTIME_CACHE]);
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith("aegis-") && !keep.has(key)).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

function isCacheableResponse(response) {
  return Boolean(response && response.ok && (response.type === "basic" || response.type === "default"));
}

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.headers.has("range")) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        if (isCacheableResponse(fresh)) {
          const cache = await caches.open(AEGIS_PWA_CACHE);
          cache.put("./index.html", fresh.clone()).catch(() => {});
        }
        return fresh;
      } catch {
        return (await caches.match("./index.html")) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) {
      event.waitUntil(fetch(request).then(async fresh => {
        if (isCacheableResponse(fresh)) (await caches.open(AEGIS_RUNTIME_CACHE)).put(request, fresh.clone()).catch(() => {});
      }).catch(() => {}));
      return cached;
    }
    const fresh = await fetch(request);
    if (isCacheableResponse(fresh)) (await caches.open(AEGIS_RUNTIME_CACHE)).put(request, fresh.clone()).catch(() => {});
    return fresh;
  })());
});
