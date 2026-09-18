# AEGIS 0835 Generated Damage-State Catalog

All 57 current shared props now have editable **Damaged** and **Destroyed** starting models. These are intentionally starting points for visual review in the Prop Editor and Runtime Test Gallery; they are not locked.

## Generation profiles
- **Organic / vegetation:** tree, bush, brush, crop, hay, interior hay bale — wilting, flattening, broken trunk / dispersed material.
- **Roadside poles/signals:** lamp post, traffic light, stop sign — bending, detached heads/signs, fallen poles.
- **Structural street props:** bus stop, playground, street bench, fence, crates — skewed members, broken supports, collapsed pieces.
- **Stone / civic:** rock, concrete barrier, civic statue, water fountain — fractures, split pieces, rubble, detached statue parts, broken fountain elements.
- **Machines/electrical:** vending machine, newspaper machine, interior power panel, wreck — denting, darkened panels, tipping/collapse, scattered face pieces.
- **Vehicles:** sedan, van, utility pickup, bus — dented/collapsed body geometry, displaced wheels/glass, lower wreck profile, damage-state light anchors.
- **Interior furnishings:** all shared desks, counters, chairs, shelves, cabinets, tables, soft furniture, beds, lockers, racks, refrigerator, radio console, etc. — category-aware leaning, broken supports, tipped cabinets, scattered shelves, and flattened/collapsed states.

## Review status
Each generated model carries `generatedDamageProfile.reviewStatus = "generated-unreviewed"`. The editor labels these targets as **Damaged · generated** and **Destroyed · generated** so they are easy to find and fine-tune.
