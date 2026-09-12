# CODEX HANDOFF — v0.26.09.11.1708_PWA_SINGLE_LAUNCH_UPDATE_HANDOFF_PATCH

Browser 1610 is the field-accepted gameplay/render baseline. This patch changes only the installed PWA host/bootstrap and service-worker update path.

## Single-launch update authority
- Register `./service-worker.js` during host startup with `updateViaCache: "none"`; do not move registration back to a window-load-only callback.
- On installed standalone/fullscreen launches with an existing controller, `prepareInstalledPwaStartup()` performs the bounded pre-runtime update check.
- Detect `updatefound`, an already-installing/waiting worker, and a controller that changed during the check. Show **Updating AEGIS Command Network** while adoption is pending.
- After controller handoff, perform at most one internal reload guarded by `project-aegis-pwa-update-reload-v1`. Remove update/controller listeners before normal runtime boot so later activation cannot reload gameplay.
- Offline/timeout paths fail open and boot the current embedded runtime. Fresh browser installs/background registration do not force a reload. Preserve the verified post-mission restore overlay if the update attempt times out.

## Service worker
- Install shell resources using fresh requests (`cache: "reload"`).
- Game-shell navigation uses network `cache: "no-store"` before refreshing the versioned offline shell cache.
- Static/runtime refresh requests use `no-cache`.
- Keep navigation restricted to the game root/index; editors/QA pages must not become the offline launch page.
- Keep versioned shell/runtime caches, `skipWaiting()`, `clients.claim()`, and explicit `AEGIS_SKIP_WAITING` message support.

## Preserve
Do not touch Browser 1610 procedural-building seam geometry or campaign/tactical authority. `tacticalBuildingPlans`, `tacticalBuildingCovers`, `makeBattlefield`, `resolveMission`, `tacticalMissionTerminalState`, and `tacticalAiMissionResolution` are byte-for-byte Browser 1610. Save format remains 4. The Mobile Tactical Status HUD Collapse / Expand roadmap item remains queued.

## Transition caveat / field gate
An already-installed Browser 1610 worker may still require its historical second launch once while adopting Browser 1708; the old worker cannot use code it has not yet received. Test the feature by installing 1708, publishing the next build, and launching the installed app once. Verify automatic internal handoff, offline fallback, loop prevention, and no mid-session reload.

---

