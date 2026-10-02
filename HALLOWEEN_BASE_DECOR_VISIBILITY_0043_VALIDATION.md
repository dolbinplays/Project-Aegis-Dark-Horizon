# Browser 0043 — Halloween Base Decoration Visibility Hotfix Validation

Build: `v0.26.10.02.0043_HALLOWEEN_BASE_DECOR_VISIBILITY_HOTFIX`

Save format: **4**

## Root cause

Browser 0042 placed its Base Halloween treatment inside `baseHallwayGridStyle()`. In the actual Base screen, facility and hangar tiles fill almost every grid cell and leave only the narrow gap/padding regions showing the hallway background. The seasonal radial-gradient shapes therefore existed but were almost completely covered at normal zoom.

## Fix

- Preserve the October hallway tint and add a stronger low-opacity orange/purple gutter treatment.
- Render deterministic foreground Halloween decorations inside visible facility/hangar tile presentation: jack-o'-lanterns, cobwebs, bats and ghosts.
- Scale hangar decorations slightly larger for normal Base-view readability.
- Keep the layer `pointer-events:none`, `aria-hidden`, and presentation-only so it cannot alter facility selection, Build mode, hover behavior, Live Activity, x2 capacity badges, Base Defense routing, adjacency, construction, or simulation authority.
- Halloween remains active for the full month of October; permanent 0042 seasonal collectibles remain available after the event.

## Automated validation

Run `node tools/test-halloween-base-decor-0043.cjs`. The focused fixture checks current build identity, foreground insertion in the actual Base grid, all four recognizable Halloween symbols, pointer transparency, the Base stacking context, stronger hallway-gap tint, retention of Browser 0042 seasonal systems, and save format 4.

The inherited Browser 0038–0042 regression suites are also run after the patch.

## Field acceptance

1. During October, open the ordinary Base screen at the same zoom used in the reported screenshot. Recognizable seasonal decorations should be visible immediately.
2. Confirm pumpkins/webs/bats/ghosts appear at facility/corridor edges and are not limited to barely visible 8-pixel hallway gaps.
3. Click decorated facility tiles, use Build mode, hover tiles, inspect upgraded-facility badges, and observe Live Activity markers. Decorations must never intercept interaction.
4. Repeat with multiple bases and after save/load.
5. Outside October, confirm the Base foreground decoration layer disappears while previously collected costume pieces persist.
