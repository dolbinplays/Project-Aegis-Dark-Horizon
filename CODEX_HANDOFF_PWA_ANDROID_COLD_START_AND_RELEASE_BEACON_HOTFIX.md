# CODEX HANDOFF — v0.26.09.11.1800_PWA_ANDROID_COLD_START_AND_RELEASE_BEACON_HOTFIX

Browser 1740 is the gameplay/UI baseline. This hotfix supersedes Browser 1708's installed-PWA blocking startup handshake after Android field testing showed the app could require two manual launches even when no update had just occurred.

## Launch/update authority
- Do **not** restore `prepareInstalledPwaStartup()`, startup controller-change listeners, or automatic `window.location.reload()` on service-worker takeover. The runtime must boot immediately.
- `registerAegisServiceWorker()` remains `updateViaCache: "none"`, but registration/update runs only in background after `bootRuntime()`.
- `service-worker.js` owns launch freshness with `release-metadata.json`: use a short bounded cache-busted probe before choosing the launch shell.
- Keep stable cache `aegis-launch-shell-v2` across worker generations. When the beacon build matches, return that cached shell without downloading `index.html`.
- When the beacon reports a different build, request `index.html` with an `aegis_build` query and `cache: "no-store"`; return the network response immediately and put a clone in the stable cache via `event.waitUntil(...)`. Never wait for a ~9 MB CacheStorage write before responding to navigation.
- Worker install must remain lightweight and must **not** include `index.html` in `AEGIS_SMALL_SHELL`. Preserve offline fallback to the stable shell / previous versioned shell.

## Preserve
Browser 1740 Mobile Tactical Status HUD collapse/expand, Browser 1610 field-accepted building seams, post-mission runtime/audio continuity, campaign/tactical authority, and save format 4. The 1708 PWA lineage flag/history remains for provenance but its blocking architecture is superseded.

## Field gate
1. Current/no-update Android installed app cold-starts on the first manual launch repeatedly.
2. Browser 1800 → next published build loads the new build from one manual launch.
3. Offline launch after an online 1800 launch uses the stable cached shell.

