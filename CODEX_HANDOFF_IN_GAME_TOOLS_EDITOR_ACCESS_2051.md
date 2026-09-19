# Codex handoff — 2051 Tools / Editors access

## Build
`v0.26.09.18.2051_IN_GAME_TOOLS_AND_PROP_EDITOR_ACCESS_PATCH`

## Architecture
This is an additive game-UI extension rather than a rewrite of the 7.3 MB `src/browser-runtime.html`.

`service-worker.js` appends loaders to the canonical prop-library response for:
1. `assets/runtime/aegis-contextual-prop-placement-runtime.js`
2. `assets/runtime/aegis-tools-editor-launcher-runtime.js`

The Tools runtime observes React-mounted game UI and adds a single `Tools / Editors` button to supported native surfaces. It owns only launcher UI; it does not own campaign state.

## Supported surfaces
- Save / Load Game header controls
- Command Settings / Pause
- Expanded standard header `System`
- Minimized standard header
- Tactical mini-header

## Tool navigation
- Prop Editor: `AEGIS_Prop_Editor_CURRENT.html`
- Gallery: `AEGIS_Prop_Runtime_Test_Gallery_CURRENT.html`
- query parameters mark the game-return flow but do not alter campaign state.
- popup failure leaves the game page untouched and presents a popup-blocked message.

## Return flow
Editor/gallery `Return to Project Aegis`:
1. If `window.opener` exists: post `aegis-tool-return`, focus opener, close tool window.
2. Same-origin referrer fallback: browser history back.
3. Final fallback: `./index.html`.

## PWA/offline
Service worker small-shell caching includes CURRENT + versioned editor/gallery files and the launcher runtime. Tool navigations have a dedicated cache-first handler.

## Known limitation
`file://` game launches do not have service-worker execution, so this additive runtime cannot inject an in-game launcher there. A future direct `src/browser-runtime.html` integration would remove that limitation. The editor itself remains file-safe.

## Save format
4 — unchanged.
