# Codex Handoff — 1522 Live 3D Context Bridge Hotfix

## Baseline

- GitHub `main` baseline: `35b8c05147ac184fcca52f477206a74f92d11332`
- Baseline release: `v0.26.09.18.1358_LIVE_3D_CONTEXTUAL_PROP_PLACEMENT_PREVIEW_DIRECT_COPY`
- Save format remains `4`.

## Root cause

1358 registered `frame.addEventListener('load', () => injectBridge())` only after the iframe markup had already started loading. On fast local launches the embedded 0835 editor could complete before that handler existed. No later path invoked `injectBridge`, so the status stayed `Waiting for 3D editor…` and the road/building Three.js context never attached.

There was also a local-file robustness issue in child `postMessage`: opaque/file origins can expose `location.origin === 'null'`. 1522 sends to the concrete origin when available and otherwise uses `*`; the outer listener still filters by `e.source === frame.contentWindow`.

## 1522 architecture

### Parent watchdog

`startBridgeWatch(reason)` begins immediately at wrapper startup and again on iframe `load`. It polls every 250 ms until `frame.contentWindow.AEGIS_CONTEXT_PREVIEW` exists. It calls `injectBridge()` on each pass and stops once attached.

### Child readiness bootstrap

`injectBridge()` installs one bootstrap script per child document. That bootstrap polls up to 240 × 50 ms for:

- `window.THREE`
- lexical `scene`
- lexical `root`
- lexical `renderer.domElement`
- lexical `camera`
- `buildPreview`
- `active`
- editor `state`

Only then does it install the existing 1358 Three.js context layer. Failure clears both child and document retry guards so parent/manual reconnect can try again.

### Recovery UI

`Reconnect 3D Context` calls `startBridgeWatch('manual')`.

## Auto-reference roadmap item

`preferredContextForRule(rule)` now maps parent placement authority to the initial 3D reference on prop selection:

1. Building-adjacent → `building-adjacent`
2. Roadside with Straight or Any → `straight-road`
3. Roadside with T only/first → `t-intersection`
4. Roadside with Four-way only/remaining → `four-way-intersection`
5. Roadside with no context selected → `straight-road`
6. Free → `free`

`ensureRoadContextDefault()` checks Straight when the author changes a prop from Free/Building to Roadside and no road eligibility is selected yet.

Manual changes to the 3D reference still work and remain until the next prop/placement-mode selection.

## Files changed

- `AEGIS_Prop_Editor_CURRENT.html`
- `AEGIS_Prop_Editor_v0.26.09.18.1522_LIVE_3D_CONTEXT_BRIDGE_STARTUP_AND_AUTO_REFERENCE_HOTFIX.html`

No game runtime, prop library, placement catalog, service worker, or save-schema file is changed.
