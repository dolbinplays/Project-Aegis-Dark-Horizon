# CODEX HANDOFF — v0.26.09.11.1740_MOBILE_TACTICAL_STATUS_HUD_COLLAPSE_EXPAND_PATCH

Browser 1708 is the baseline. This patch implements the queued **Mobile Tactical Status HUD Collapse / Expand** item without creating a second tactical-status authority.

## Implementation authority
- `TacticalMission` owns `mobileStatusHudCollapsed` for the current battle and resets it when `mission.id` changes. Do not persist this preference into campaign/save data.
- The existing `TacticalUnifiedThreeStatusPanel` accepts `mobileCollapsed` and `onToggleMobileCollapsed`. Only Mobile Adaptive supplies the toggle callback; Standard/Desktop remains pointer-transparent and non-toggle.
- Condensed mode keeps soldier name, rank/weapon, HP, TU, ammo/energy, and `tacticalThreeStatusConditions(...)` chips. It omits the lower AI-plan/fire-team/objective block.
- The same collapse state must survive selected/observed actor changes and 3D Iso/FPV/TPV/reaction-view changes during the battle.
- Keep the status-chip stop-propagation guard so interacting with a chip does not toggle the panel. Keep Enter/Space and `aria-expanded` accessibility semantics.

## Preserve
Do not duplicate soldier/fire-team/objective data into a mobile-only model. Preserve Browser 1708's early PWA update bootstrap/service-worker architecture, Browser 1610 field-accepted procedural-building seam geometry, all tactical/mission authority, and save format 4.

## PWA field gate
Browser 1740 is the first intended post-1708 installed update. With Browser 1708 already installed, publish 1740 and tap the installed app once. The host may internally hand off/reload, but the player should not need a second manual launch.

---
