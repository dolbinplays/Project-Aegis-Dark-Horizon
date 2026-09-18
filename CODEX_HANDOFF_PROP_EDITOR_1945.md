# AEGIS Prop Editor 1945 — Legacy Model Fidelity Migration

Browser runtime remains `v0.26.09.17.1320_PROP_EDITOR_RUNTIME_LIBRARY_INTEGRATION_PATCH`; save format remains **4**. This patch changes the editor and canonical shared prop data, not the browser runtime.

## Purpose
1740 could inventory legacy props but could not edit them. 1945 begins the actual migration: common hard-coded Three.js scenery is reproduced in `assets/data/aegis-prop-library.js` using the same primitive dimensions, local transforms, and material values used by the existing renderer. The editor therefore works on game-derived model data rather than parallel approximations.

## Migrated fidelity set
Game-derived shared definitions now cover the original common set with legacy fidelity for Tree (generic baseline), Lamp Post, Stop Sign, Vending Machine, Newspaper Machine, Bus Stop, Street Bench, Crates, Concrete Barrier, Fence, and Bush (generic baseline).

Newly promoted from legacy-only runtime visuals into the shared editable library:
- `traffic-light`
- `playground`
- `hay`

The canonical library therefore grows from 12 to 15 editable entries.

## Deliberate boundaries
- Tree/Bush: the generic legacy geometry is migrated, but biome/id-driven regional scale/color variation is not yet represented by the shared schema.
- Rock: stays a shared approximation because the legacy model uses `THREE.DodecahedronGeometry`, unsupported by the current shared primitive schema.
- Civic Statue/Water Fountain: remain legacy because the renderer applies per-cover `landmarkScale`; migrating them before shared root-scale support would regress multi-hex landmark sizing.
- Vehicles, building walls/windows/doors, interior furnishing families, and other special/system models remain in the migration queue.

## Editor UI
Shared prop rows now indicate game-derived provenance. A Game Model Source card shows migration fidelity/limitations for the active prop. 1740 inventory scanning and filtering remain intact.

## Install requirement
Install both editor HTML files and the updated `assets/data/aegis-prop-library.js` / `.json`. Browser 1320 already prefers matching shared definitions before legacy fallback, so no runtime-code patch is required for these migrated keys.
