const AEGIS_PWA_CACHE = "aegis-v0.26.09.11.1708_PWA_SINGLE_LAUNCH_UPDATE_HANDOFF_PATCH";
const AEGIS_RUNTIME_CACHE = "aegis-runtime-v0.26.09.11.1708_PWA_SINGLE_LAUNCH_UPDATE_HANDOFF_PATCH";
const AEGIS_SHELL = [
  "./index.html",
  "./manifest.webmanifest",
  "./assets/icons/aegis-192.png",
  "./assets/icons/aegis-512.png"
];

function isCacheableResponse(response) {
  return Boolean(response && response.ok && (response.type === "basic" || response.type === "default"));
}

async function cacheFreshShell(cache) {
  for (const relative of AEGIS_SHELL) {
    const url = new URL(relative, self.registration.scope).href;
    const request = new Request(url, { cache: "reload", credentials: "same-origin" });
    const response = await fetch(request);
    if (!isCacheableResponse(response)) throw new Error(`Unable to cache fresh AEGIS shell resource: ${relative}`);
    await cache.put(url, response.clone());
  }
}

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(AEGIS_PWA_CACHE);
    await cacheFreshShell(cache);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keep = new Set([AEGIS_PWA_CACHE, AEGIS_RUNTIME_CACHE]);
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith("aegis-") && !keep.has(key)).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", event => {
  if (event?.data?.type === "AEGIS_SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.headers.has("range")) return;

  if (request.mode === "navigate") {
    const shellUrl = new URL("./index.html", self.registration.scope);
    const rootUrl = new URL("./", shellUrl);
    // Editors and QA pages must never become the installed game's launch page.
    if (url.pathname !== shellUrl.pathname && url.pathname !== rootUrl.pathname) return;
    event.respondWith((async () => {
      const cache = await caches.open(AEGIS_PWA_CACHE);
      try {
        // Bypass both the service-worker cache and the browser HTTP cache so one app launch can see a newly published shell.
        const fresh = await fetch(request, { cache: "no-store" });
        if (isCacheableResponse(fresh)) {
          await cache.put(shellUrl.href, fresh.clone()).catch(() => {});
        }
        return fresh;
      } catch {
        return (await cache.match(shellUrl.href)) || (await cache.match(request)) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) {
      event.waitUntil(fetch(request, { cache: "no-cache" }).then(async fresh => {
        if (isCacheableResponse(fresh)) (await caches.open(AEGIS_RUNTIME_CACHE)).put(request, fresh.clone()).catch(() => {});
      }).catch(() => {}));
      return cached;
    }
    const fresh = await fetch(request, { cache: "no-cache" });
    if (isCacheableResponse(fresh)) (await caches.open(AEGIS_RUNTIME_CACHE)).put(request, fresh.clone()).catch(() => {});
    return fresh;
  })());
});
