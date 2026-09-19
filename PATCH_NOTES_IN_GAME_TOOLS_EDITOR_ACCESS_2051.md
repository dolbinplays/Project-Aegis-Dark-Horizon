# Project Aegis — 2051 In-Game Tools / Editors Access Patch

Build: `v0.26.09.18.2051_IN_GAME_TOOLS_AND_PROP_EDITOR_ACCESS_PATCH`
Save format: **4**
Baseline: cumulative over the 1705 unified prop-authoring/runtime pipeline, which itself was built from pushed main `0b39b8a7bcdf6af162eed83a1472ad85b8396212` (1600).

## Player-facing changes

- Adds a native **Tools / Editors** launcher to the running Project Aegis interface through the runtime extension.
- Launcher is inserted into the Save / Load header controls, Command Settings, expanded System panel, minimized command header, and tactical mini-header when those surfaces are mounted.
- Tools / Editors opens a focused modal with:
  - **Open Prop Editor**
  - **Open Runtime Test Gallery**
  - **Close**
- Prop Editor and Runtime Test Gallery open in separate windows/tabs. The launcher never replaces the running campaign page when a popup is blocked.
- Both tools now include **Return to Project Aegis**. When opened from the game, Return focuses the original game window and closes the tool window when allowed. Without an opener, the fallback returns to `index.html`.
- Service-worker install caches the editor/gallery CURRENT redirects, their versioned HTML files, and the launcher runtime so installed/PWA use can open the tools offline after the patch has installed.
- The 1705 canonical prop-authoring → runtime pipeline and contextual placement authority are preserved.

## Campaign safety

- The launcher does not save, load, reset, pause, advance, or otherwise mutate campaign state.
- Save schema remains **4**.
- Live prop publishing still uses the existing canonical prop library / BroadcastChannel path.

## Local-file note

Browsers do not run service workers for `file://` pages. Therefore the additive in-game launcher cannot be injected into a game opened by double-clicking `index.html`. The Prop Editor remains directly usable from `AEGIS_Prop_Editor_CURRENT.html`, and its Return button falls back to `index.html`. GitHub Pages / hosted play and the installed PWA receive the in-game Tools / Editors launcher.
