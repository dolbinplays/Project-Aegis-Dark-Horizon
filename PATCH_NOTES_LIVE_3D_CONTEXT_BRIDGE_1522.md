# Project Aegis — 1522 Live 3D Context Bridge Startup & Auto-Reference Hotfix

**Build:** `v0.26.09.18.1522_LIVE_3D_CONTEXT_BRIDGE_STARTUP_AND_AUTO_REFERENCE_HOTFIX`

**Authoritative baseline:** GitHub `main` commit `35b8c05147ac184fcca52f477206a74f92d11332` (`v0.26.09.18.1358_LIVE_3D_CONTEXTUAL_PROP_PLACEMENT_PREVIEW_DIRECT_COPY`).

**Save format:** 4 — unchanged.

## Fixed: live 3D road/building context could remain stuck on “Waiting for 3D editor…”

The 1358 wrapper installed its Three.js bridge only from the embedded editor iframe's `load` event. A fast local launch could finish that load before the outer wrapper attached the listener, leaving the geometry editor usable but never installing the contextual road/building layer.

1522 now uses three complementary startup paths:

- an immediate parent-side bridge watchdog that starts even if the iframe already loaded;
- an iframe `load` listener that restarts the watchdog after navigation/reload;
- an injected child-side readiness poll that waits until the real Three.js `scene`, `root`, `renderer`, `camera`, and editor functions actually exist before installing the bridge.

The bridge continues retrying rather than silently staying in a permanent waiting state. Failed bootstraps clear their retry guards so a later attempt can recover.

For local/opaque origins, child-to-parent messaging now falls back to `*` when `location.origin` is `null`, while the parent still accepts messages only from the known geometry iframe.

A new **Reconnect 3D Context** button manually restarts the same safe watchdog.

## Roadmap item rolled in: automatic context selection

Selecting a prop now chooses a sensible live 3D reference from its parent placement rule:

- `Roadside` → Straight road when legal or when `Any road context` is legal;
- if Straight is not legal, T-intersection is preferred when legal;
- otherwise Four-way intersection is used when legal;
- `Building-Adjacent` → Building-adjacent reference;
- `Free Placement` → Free context.

Changing Placement Mode also updates the reference. If a newly Roadside prop/rule has no legal road context checked yet, Straight road is enabled as the safe authoring default.

The automatic selection is an authoring convenience only. The user can still manually change **3D reference** afterward to inspect the prop in another context.

## Preserved from 1358

- Live Three.js road, T-intersection, four-way intersection, and building reference geometry.
- Protected entrance/approach visualization.
- PROP FORWARD / SPAWN FACING helper.
- Mirrored spawn preview.
- Ground-plane drag placement.
- Parent-level placement authority and inheritance to damage states/variants.
- Bidirectional prop selection between placement controls and the 0835 geometry editor.
- Geometry, collision, damage models, variants, lighting anchors, revision history, Last Known Good, and 2145 factory recovery remain owned by the embedded authoritative editor.

## Scope

This hotfix changes only the Prop Editor wrapper/current redirect. Tactical runtime placement behavior from 1215 and the game runtime are not modified by this hotfix.
