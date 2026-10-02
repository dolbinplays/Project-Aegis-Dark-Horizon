# Browser 0042 — Seasonal Event Framework + Halloween Collection Foundation Validation

Build: `v0.26.10.02.0042_SEASONAL_EVENT_FRAMEWORK_HALLOWEEN_COLLECTION_FOUNDATION_PATCH`

Save format: **4**

## Implemented scope

Browser 0042 establishes a reusable seasonal-event authority and the first complete Halloween presentation/collection slice. Halloween activates for the full real-world month of October. The event is deliberately cosmetic-only: no seasonal Top, Bottom, Helmet/Mask, Weapon Skin, matching set, decoration, or flourish changes HP, TU, accuracy, damage, armor, morale, LOS, AI or any other gameplay statistic.

Normal October missions deterministically select only 1–3 initial aliens as seasonal carriers, bounded by mission threat. Each carrier owns one exact recoverable item from the Vampire, Witch, Wolfman, Mummy, Creature from the Black Lagoon, Frankenstein, or Skeleton collection. That exact slot is rendered on the alien persistent 3D model. Successful mission recovery retains the item permanently by assigning it to a living soldier with an empty matching slot, preferring mission participants; if no soldier has an empty slot, the piece is retained as a seasonal spare rather than destroyed.

A soldier with Top + Bottom + Helmet/Mask + Weapon Skin from the same set unlocks a set-specific victory flourish. Halloween weapon skins are presentation-only and alter shot celebration effects: ballistic weapons add holiday confetti, laser weapons add neon spider-web geometry, and plasma weapons add spectral ring effects. Base hallways receive small seasonal dressing and normal tactical maps receive presentation-only, non-blocking pumpkins, webs and bats near buildings.

## Follow-up scope

A dedicated shared Seasonal Locker / collection screen, direct manual piece swapping between soldiers, favorite/lock controls, rare signature variants, richer alien-anatomy fit variants, and optional seasonal audio are retained as follow-up polish. Browser 0042 intentionally establishes the persistent item schema and rendering/event authority first.

## Automated validation

Run:

`node tools/test-seasonal-halloween-0042.cjs`

Acceptance contracts cover October activation, bounded carrier count, exact slot drops, permanent persistence, absence of stat bonuses, alien 3D costume rendering, full-set celebration unlocks, weapon FX, base decorations, mission decorations, both mission-result paths, mission-aftermath recovery, and save format 4.

## Field acceptance

During October, launch several ordinary missions of different threat levels. Confirm only a few aliens visibly carry Halloween pieces, those pieces are on an appropriate body/weapon slot, and the mission report names recovered pieces. Confirm collected pieces remain on soldiers after save/reload and outside October. Complete a matching four-slot set and verify the special victory flourish. Test ballistic, laser and plasma weapon skins and confirm their effects do not alter shot results. Inspect Base hallways and several normal building maps for seasonal dressing, and verify decorations never block movement, LOS, doors, deployment, extraction, or pathfinding.
