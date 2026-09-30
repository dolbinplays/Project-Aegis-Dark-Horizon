# Browser 0024 — Active combat beacon priority

The AI previously suppressed beacon assault when live alien contact existed, then chose an alien shot before considering the beacon. A shared immediate-attack comparison now runs before movement and again before firing in the common simulation/Hybrid planner. A selected beacon holds the soldier in place to attack; ordinary alien cover-fire selection cannot replace that choice before the shot is reassessed.

Eligible beacons must be active, revealed, known reinforcement sources and personally visible through the existing LOS/night/smoke rules. A usable ranged shot or a safe, affordable grenade is required. Beacons and aliens share a distance-based target tier, with aliens winning ties and point-blank alien threats taking precedence. Explicit beacon orders may prefer a legal beacon over a more distant alien; other explicit orders and civilian rescue duties are preserved. Transient Hybrid formation orders permit autonomous beacon attacks unless the player supplied a preferred target. Existing urgent-care handling remains ahead of this selection.

Unknown shields may receive a probing shot; observed blocking prevents repeated ineffective fire. Grenades use the existing blast safety and TU checks. The attack executes through the existing beacon damage, observation, playback, destruction and transit-cancellation paths. No new saved state is introduced; each decision uses the current beacon identity, position and knowledge. Existing beacon approach and endgame behavior remain available when an immediate combat attack is not selected.

## Verification

- Five focused tests include actual one-round simulation and Hybrid runs that shoot a beacon while an alien remains alive, target-distance/urgent-danger choices, unknown or hidden beacon rejection, costs, explicit orders/rescue commitments, and observed shields with safe grenade alternatives and source replacement.
- Ten existing observed-shield tests and seven reserve-TU/beacon-completion tests pass: **22 checks total**.
- Runtime packaging, build seam and whitespace checks pass. Save format remains 4.
- Installed-game field acceptance remains: mixed squads fighting near a reinforcement beacon in daylight/night, with casualties/escorts and player-assigned Hybrid targets. This patch changes target selection, not UI or shot-animation geometry.
