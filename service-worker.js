const AEGIS_PWA_CACHE = "aegis-v0.26.09.11.2015_TACTICAL_ALIEN_BEACON_REINFORCEMENT_MATERIALIZATION_PRESENTATION_PATCH";
const AEGIS_RUNTIME_CACHE = "aegis-runtime-v0.26.09.11.2015_TACTICAL_ALIEN_BEACON_REINFORCEMENT_MATERIALIZATION_PRESENTATION_PATCH";
const AEGIS_LAUNCH_CACHE = "aegis-launch-shell-v2";
const AEGIS_BUILD = AEGIS_PWA_CACHE.slice("aegis-".length);
const AEGIS_SHELL_URL = new URL("./index.html", self.registration.scope).href;
const AEGIS_RELEASE_URL = new URL("./release-metadata.json", self.registration.scope).href;
const AEGIS_BOOT_PROBE_TIMEOUT_MS = 1800;
const AEGIS_SMALL_SHELL = [
  "./manifest.webmanifest",
  "./assets/icons/aegis-192.png",
  "./assets/icons/aegis-512.png",
  "./release-metadata.json"
];

function isCacheableResponse(response) {
  return Boolean(response && response.ok && (response.type === "basic" || response.type === "default"));
}

async function cacheFreshSmallShell(cache) {
  for (const relative of AEGIS_SMALL_SHELL) {
    const url = new URL(relative, self.registration.scope).href;
    const request = new Request(url, { cache: "reload", credentials: "same-origin" });
    const response = await fetch(request);
    if (!isCacheableResponse(response)) throw new Error(`Unable to cache fresh AEGIS shell resource: ${relative}`);
    await cache.put(url, response.clone());
  }
}

async function fetchWithTimeout(request, options = {}, timeoutMs = AEGIS_BOOT_PROBE_TIMEOUT_MS) {
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), Math.max(250, Number(timeoutMs) || 0)) : 0;
  try {
    return await fetch(request, controller ? { ...options, signal: controller.signal } : options);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function probePublishedBuild() {
  const url = new URL(AEGIS_RELEASE_URL);
  url.searchParams.set("aegis_probe", `${AEGIS_BUILD}-${Date.now()}`);
  const response = await fetchWithTimeout(new Request(url.href, {
    cache: "no-store",
    credentials: "same-origin"
  }), {}, AEGIS_BOOT_PROBE_TIMEOUT_MS);
  if (!isCacheableResponse(response)) return null;
  const metadata = await response.json().catch(() => null);
  return typeof metadata?.build === "string" && metadata.build ? metadata.build : null;
}

async function fetchPublishedShell(build = AEGIS_BUILD) {
  const url = new URL(AEGIS_SHELL_URL);
  url.searchParams.set("aegis_build", String(build || AEGIS_BUILD));
  return fetch(new Request(url.href, {
    cache: "no-store",
    credentials: "same-origin"
  }));
}

async function cacheLaunchShell(response) {
  if (!isCacheableResponse(response)) return false;
  const cache = await caches.open(AEGIS_LAUNCH_CACHE);
  await cache.put(AEGIS_SHELL_URL, response.clone());
  return true;
}

async function cleanupOldVersionedCaches() {
  const keep = new Set([AEGIS_PWA_CACHE, AEGIS_RUNTIME_CACHE, AEGIS_LAUNCH_CACHE]);
  const keys = await caches.keys();
  await Promise.all(keys.filter(key => (key.startsWith("aegis-") || key.startsWith("aegis-runtime-")) && !keep.has(key)).map(key => caches.delete(key)));
}

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    // Keep install lightweight. index.html is intentionally NOT downloaded here; it is ~9 MB.
    // The navigation path owns the launch shell so an Android cold start never waits for a
    // second giant shell download before a replacement worker can activate.
    const cache = await caches.open(AEGIS_PWA_CACHE);
    await cacheFreshSmallShell(cache);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
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
    const shellUrl = new URL(AEGIS_SHELL_URL);
    const rootUrl = new URL("./", shellUrl);
    // Editors and QA pages must never become the installed game's launch page.
    if (url.pathname !== shellUrl.pathname && url.pathname !== rootUrl.pathname) return;
    event.respondWith((async () => {
      const launchCache = await caches.open(AEGIS_LAUNCH_CACHE);
      const cachedLaunch = await launchCache.match(AEGIS_SHELL_URL);
      let publishedBuild = null;
      try { publishedBuild = await probePublishedBuild(); } catch {}

      // A tiny cache-busted release beacon decides whether the large shell needs refreshing.
      if (publishedBuild && publishedBuild !== AEGIS_BUILD) {
        try {
          const fresh = await fetchPublishedShell(publishedBuild);
          if (isCacheableResponse(fresh)) {
            // Return the new shell immediately. Cache the cloned stream in parallel instead of
            // blocking Android startup on a ~9 MB CacheStorage write.
            event.waitUntil(cacheLaunchShell(fresh.clone()).then(cleanupOldVersionedCaches).catch(() => {}));
            return fresh;
          }
        } catch {}
      }

      // Normal no-update launch: the small beacon completed, so use the stable launch cache.
      if (cachedLaunch) return cachedLaunch;

      // First launch under this architecture (or a repaired cache): stream a fresh shell once.
      try {
        const fresh = await fetchPublishedShell(publishedBuild || AEGIS_BUILD);
        if (isCacheableResponse(fresh)) {
          event.waitUntil(cacheLaunchShell(fresh.clone()).then(cleanupOldVersionedCaches).catch(() => {}));
          return fresh;
        }
      } catch {}

      // Last-resort offline migration from an older versioned shell cache.
      const keys = await caches.keys();
      for (const key of keys.reverse()) {
        if (!key.startsWith("aegis-") || key === AEGIS_RUNTIME_CACHE || key === AEGIS_LAUNCH_CACHE) continue;
        try {
          const fallback = await (await caches.open(key)).match(AEGIS_SHELL_URL);
          if (fallback) return fallback;
        } catch {}
      }
      return Response.error();
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
