# Engine Port Contract

Project Aegis is still HTML-first, but future patches should avoid coupling every new system directly to React rendering.

## Godot 4 Readiness

Future engine migration will be easier if systems follow these boundaries:

- Data definitions should be serializable as JSON or simple tables.
- Simulation helpers should accept plain state objects and return plain results.
- UI panels should read from normalized state instead of owning core rules.
- Save migrations should remain explicit and versioned.
- Assets should be referenced through stable manifest keys, not scattered string literals.

## First Extraction Targets

Safest early extraction candidates:

- Version/build metadata and architecture manifest.
- Equipment, facility, radar, aircraft, and UFO constants.
- Pure helper tests from Build Health.
- Mission recovery/local inventory helpers.
- Geoscape range/radar calculations.

Avoid extracting these until a build step exists:

- The React app mount.
- Large panel render trees.
- Tactical mission render flow.
- Save/load UI.

## Verification Contract

Every source-layout patch must keep:

- `index.html` playable through localhost.
- Start screen load working.
- Start New Game -> first base confirmation -> main Geoscape working.
- Build Health passing.
- Current save format compatibility intact unless the patch explicitly migrates saves.
