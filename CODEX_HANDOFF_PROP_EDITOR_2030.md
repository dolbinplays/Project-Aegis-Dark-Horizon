# AEGIS Prop Editor 2030 — Full Editable Scenery Prop Migration (Direct Overlay)

Build identifier: `v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH`  
Save format: **4**

This distribution is a direct-copy overlay rather than a local patch script. It preserves the pushed 1945 shared models and expands the canonical library to 57 editable definitions.

The game already loads `assets/data/aegis-prop-library.js`. The 2030 copy of that file includes a deferred runtime bridge that activates after the existing Browser 1320 runtime declares its renderer functions. The bridge adds shared-definition family matching, `DodecahedronGeometry`, civic-landmark root scaling, and shared road-vehicle rendering while preserving existing multi-hex footprint, road rotation, and headlight authority. This avoids replacing the multi-megabyte `index.html` and `src/browser-runtime.html` just to install the scenery migration.

New shared/editable coverage includes exact rock geometry, brush/crop families, wreck, civic statue, water fountain, `interior-power-panel`, sedan/van/utility/bus models, and the current procedural interior furnishing catalog. The 1945 Tree, Lamp Post, Traffic Light, Stop Sign, Vending Machine, Newspaper Machine, Bus Stop, Playground, Street Bench, Crates, Concrete, Fence, Hay, Rock/Bush migration lineage remains preserved.

Interactive building doors, structural building walls/windows, Skyranger/UFO geometry, alien beacons, tactical hazards, and other stateful mission structures remain on their dedicated renderers by design rather than being flattened into static props.

The new editor reads the same canonical library and supports live transform sliders, natural orbit dragging, Dodecahedron components, metadata matching/scaling rules, material editing, collision metadata, draft storage, JSON import/export, and runtime-library JS export.
