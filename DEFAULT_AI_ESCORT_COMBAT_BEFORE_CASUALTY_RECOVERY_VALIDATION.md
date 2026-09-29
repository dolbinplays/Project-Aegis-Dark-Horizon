# Browser 0017 — Default AI Escort + Combat Before Casualty Recovery Validation

Build: `v0.26.09.29.0017_DEFAULT_AI_ESCORT_COMBAT_BEFORE_CASUALTY_RECOVERY_PATCH`

Save format: **4 (unchanged)**

## Authority change

The Default AI tactical stack is now:

1. Bleeding stabilization
2. Active civilian/VIP escort
3. Visible alien
4. Downed AEGIS recovery/extraction
5. Last Known Contact / distress
6. Alien Field Beacon
7. UFO bay
8. Known civilian/VIP
9. Exploration/search

The implementation moves casualty recovery out of the early medical prepass. Only stabilization may reserve an actor before escort/contact authority. Established escorts execute first. Casualty recovery/extraction is evaluated only when no living alien is currently visible and excludes actors still committed to the active escort.

## Focused automated checks

`tools/test-default-ai-priority-reorder.cjs` verifies:

1. priority ranks are exactly 10/20/30/40/50/60/70/80/90 in the approved order;
2. stabilization beats all other simultaneous candidates;
3. active escort beats visible contact and casualty recovery;
4. visible contact beats casualty recovery once escort duty is absent;
5. casualty recovery beats Last Known and reinforcement-source work;
6. resolver phase ordering and HUD numbering match the same hierarchy.

Result: **6/6 passed**.

## Retained regressions

- Browser 0016 TPV / Beacon shield parity / roof occlusion: **8/8 passed**.
- Browser 0015 Beacon round pre-impact hold: **6/6 passed**.
- Browser 0014 VIP/window concealment: **6/6 passed**.
- Browser 0013 impact sequencing: **6/6 passed**.
- Browser 0012 alien forced entry: **6/6 passed**.
- Browser 0011 cooperative planning/equivalence: **5/5 passed**.
- Browser 0010 planning-query/hazard reuse: **6/6 passed**.

The cooperative-planning deterministic equivalence test remains green, confirming the reordered doctrine is identical between synchronous and cooperative streamed execution.

## Manual field gates

1. Put a bleeding casualty, active VIP escort, visible alien, separate downed AEGIS casualty and Last Known Contact in the same mission. Confirm the observed sequence follows the approved stack.
2. Under **Stay With Escort**, confirm escort supports remain with the column during visible contact. Under **Engage Spotted Aliens**, confirm eligible supports break off while the escort-owning leader continues extraction.
3. Confirm a known but unescorted VIP does not outrank a visible alien, casualty recovery, Last Known Contact or known reinforcement source.
4. Confirm casualty recovery/extraction resumes after direct visible contact clears and remains above Last Known Contact.
5. Repeat under full Simulation and Hybrid autonomous support. Player-owned Hybrid/manual commands must remain player-owned.
6. Save/reload an active mission with these states and confirm save format 4 and objective ordering remain stable.

## Remaining behavioral note

A new alien first discovered *during* a lower-priority movement action still relies on the existing new-contact interruption seam for subsequent actions. Installed-game acceptance should specifically observe a casualty-recovery approach that reveals a previously hidden alien and confirm later free actors immediately switch to visible-contact combat.
