# Placement Migration Notes — 1215

The previous runtime has hardcoded generation behavior for curb lamps, bus stops, benches, intersection controls, road vehicles, vending/newspaper machines, ingress clearance, and hex-edge visual offsets. 1215 deliberately migrates in layers rather than deleting those proven systems in one patch.

1. Legacy procedural generation still chooses the broad scene inventory and produces the initial candidate props.
2. The contextual placement authority then validates/repositions/removes those candidates according to the shared parent placement rule.
3. Required context rejects illegal free fallback. Preferred context keeps the previous candidate if no legal contextual candidate can be found.
4. Existing building ingress protection remains authoritative; contextual candidates cannot occupy protected door/ramp/approach cells.
5. Existing hex-edge placement remains available underneath the contextual pass and for old definitions without new metadata.
6. Resolved placement is stamped on the cover record, making the operation idempotent and preserving orientation across cached/saved mission state.

This staged migration minimizes risk to roads, building generation, navigation, collision, cover, LOS, vehicle footprints, night lighting, and save compatibility while giving the Prop Editor a single shared placement vocabulary.
