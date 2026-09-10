# CODEX HANDOFF — v0.26.09.09.1945_MOBILE_TACTICAL_STATUS_HUD_PATCH

Browser 1712 is field-accepted for the Classic crash-site false-failure regression. This patch returns to the queued Mobile tactical presentation work.

## Change
- The Standard tactical `TacticalUnifiedThreeStatusPanel` was already the authoritative shared 3D Iso / FPV / TPV status box, but the original Mobile decluttering CSS explicitly hid `[data-aegis-unified-three-status-panel]`.
- Browser 1945 overrides that hide only in Mobile · Adaptive and keeps the panel upper-right inside `data-aegis-battle-viewport`.
- Required Mobile core: soldier **name**, **Fire Team Assignment**, **Current Objective / Order**.
- Objective text remains `tacticalFirstPersonCurrentObjectiveOrder(...)`; do not create a second Mobile objective resolver.
- Manual selection and AI observer/acting actor continue to use TacticalMission's existing `tacticalStatusHudUnit` / `fireTeamHudOrder` / `aiTurnHudDecision` flow.
- Portrait/short-height CSS hides or compacts secondary detail first: rank/weapon, vitals, status chips, role detail, formal-leader notes, duplicate player-order coordinate line, and larger AI-plan diagnostics.
- The overlay remains pointer-transparent; it must never own tactical selection or consume a command rail.

## Preserve
Do not regress Browser 1712 Last Known Contact terminal victory, Browser 1628 reinforcement liveness, Browser 1517 offline arrival commit, Browser 1242 final-VIP casualty authority, Mobile Missions/Reports/Memorial, or save format 4. The Classic Lineup victory-dance + civilian/VIP playback roadmap item remains queued.

## Field acceptance
Test portrait phone, short landscape phone, and tablet. In one mission switch manual selected soldiers, player orders, Simulation acting soldiers, FPV, TPV, and Mobile↔Standard. Name/team/order must stay synchronized and Standard styling must not change.
