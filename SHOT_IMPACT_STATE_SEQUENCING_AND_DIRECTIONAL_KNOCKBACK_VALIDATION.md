# Shot Impact State Sequencing + Directional Knockback

Build: `v0.26.09.29.0013_SHOT_IMPACT_STATE_SEQUENCING_AND_DIRECTIONAL_KNOCKBACK_HOTFIX`

Save format: **4** (unchanged).

## Scope

- Authoritative hit/downed/bleeding state still resolves immediately for AI, medical priority, mission logic and saves.
- When a human/civilian transitions from an active stance to downed/prone/dead in a shot frame, streamed playback captures the pre-impact presentation before applying the resolved frame state.
- The tactical Three.js presentation consumes that temporary snapshot while the projectile travels, while authoritative unit coordinates remain current.
- `showShotEvent(...)` applies the same hold to live/manual shot presentation and releases it after projectile travel plus a bounded impact reaction.
- Hit reaction direction is derived from the shooter/projectile origin toward the impact target. The visual rig moves/leans away from the incoming shot in world space, independent of target facing or camera angle.
- Visual knockback never changes the authoritative tactical hex, occupancy, LOS, TU, pathing or movement state.
- Beacon destruction keeps the established detached pre-impact snapshot and impact-commit cinematic; the hold is now mirrored through a synchronous ref before authoritative wreck covers can flash on the first lethal render.

## Automated validation

`tools/test-shot-impact-state-sequencing.cjs` covers six focused contracts:

1. normalized shot-direction vectors for cardinal/diagonal fire;
2. standing/kneeling-to-downed AI frames request a pre-impact presentation hold;
3. presentation holds preserve medical/stance state while retaining authoritative map coordinates;
4. downed hit reaction timing remains bounded;
5. Beacon presentation hold is synchronously available before authoritative cover rendering;
6. Three.js reaction code consumes shooter-to-target world impulse and no longer derives knockback from target-ID parity.

Final automated results against the release runtime:

- Shot-impact sequencing/directional knockback: **6/6 passed**.
- Browser 0012 alien forced-entry doctrine: **6/6 passed**.
- Browser 0011 cooperative planning/equivalence/cancellation: **5/5 passed**.
- Browser 0010 visibility/hazard/distance planning regressions: **6/6 passed** (the compact release test fixture uses the same minimal building-layout stub used by the prior release overlay when the repository-only layout asset is absent).
- All **5 non-empty embedded runtime JavaScript blocks** pass `node --check`; service-worker syntax also passes.
- Packaged `index.html` embeds the canonical runtime byte-for-byte. Runtime bytes: **7,566,988**; SHA-256: `e6bfe73deceda2c7fb091cfb7f4a28d1b44927a14735078527e6b90f39386a4c`. Host SHA-256: `80151190e1093a7ac6bd8bccc043499a6484392bd7c36d214007f9c073207480`.

## Field acceptance

1. Let standing and kneeling soldiers receive recoverable downing shots in 3D Iso, FPV and TPV. The causative projectile should arrive before the target settles into prone/bleeding.
2. Fire from opposite cardinal and diagonal directions. The visible hit shove/lean should consistently follow the incoming momentum direction (away from the shooter), regardless of camera angle or target facing.
3. Confirm the visual reaction never moves the unit to another tactical hex or changes cover/LOS/pathing.
4. Repeat under Manual, Hybrid, full Simulation AI and reaction fire.
5. Destroy a visible Beacon with direct fire and Frag Grenade where supported. It must remain continuously present through projectile travel, then commit once to the destruction/wreck state at impact without disappear/reappear flicker.
6. Repeat when Beacon destruction is the terminal mission action and confirm victory presentation does not obscure the lethal impact/destruction beat.
7. Save/reload after authoritative impact and confirm no presentation-only hold is serialized or resurrected.
