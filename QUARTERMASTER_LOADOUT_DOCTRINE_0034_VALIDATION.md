# Browser 0034 — Quartermaster Per-Squad + Role Loadout Doctrine

Build: `v0.26.10.01.0034_QUARTERMASTER_PER_SQUAD_ROLE_LOADOUT_DOCTRINE_PATCH`

Save format: **4**

## Scope

Browser 0034 expands the hireable Department Head Quartermaster from one shared loadout template into a layered doctrine while preserving the Browser 0028 default policy as the fallback for existing campaigns.

Policy resolution is deterministic and ordered:

1. Default Quartermaster doctrine.
2. Optional managed-squad doctrine.
3. Optional soldier-specialization override within that squad.
4. Per-soldier weapon / armor / Medkit locks, which prevent automatic replacement of commander-selected equipment.

Weapon and armor doctrine supports three ordered choices: **Preferred → Acceptable → Fallback**. The Quartermaster tries the first legal choice available under existing research, inventory, market, storage, treasury-reserve and per-review-budget rules. A Workshop-only item that is unavailable is reported as a shortage; automation does not manufacture it.

Reserve-stock targets are base-level and run after soldier resupply. The Department screen exposes the broader equipment catalog for stock targets. Existing Bandage and Medical Supplies behavior is retained.

**Preview Quartermaster review** performs the same Quartermaster calculation without committing funds, equipment, inventory or logs. It reports projected spend and the planned/audited actions. A real review clears the preview and records squad/role-aware activity lines.

## Automated verification

`tools/test-quartermaster-loadout-doctrine-0034.cjs` passes **11/11** checks:

- Legacy Browser 0028 single-template policy migrates into the new default preference chain.
- Squad policy overrides the default doctrine only for that squad.
- Specialization override wins over its squad doctrine.
- Acceptable/fallback equipment is selected when a preferred item is unavailable.
- Individual weapon locks preserve hand-selected equipment.
- Reserve-stock targets purchase after resupply.
- Preview reports projected spend without mutating the supplied campaign object.
- Per-review budget bounds automated purchases.
- Resolved policy carries specialization identity for the audit log.
- Sorties block both live reviews and previews.
- The rendered Department panel exposes squad doctrine, equipment locks, reserve targets and spend preview controls.

Runtime verification also checks that Browser 0034 passes soldiers and preview callbacks into the Department panel, shares one strategic API authority between preview and live review, retains normalized locks, and keeps save format 4.

## Manual acceptance

Use a campaign with a hired Quartermaster Head and at least two squads at the same base. Configure a different weapon chain for each squad, then add a Medic specialization override to one squad. Lock one soldier's weapon manually. Run Preview and confirm the projected spend/actions without campaign mutation, then Run review now and confirm only unlocked equipment changes. Remove the preferred item from local stores to verify acceptable/fallback selection. Set a Workshop-only preferred item with no local stock and confirm it is reported but not manufactured. Set reserve-stock targets high enough to exercise Base Stores capacity, including an upgraded x2 Stores facility from Browser 0033. Save/reload and confirm squad doctrines, role overrides and equipment locks persist.
