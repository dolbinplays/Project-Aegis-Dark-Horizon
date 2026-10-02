# Individual Facility Capacity Upgrades — Browser 0033

Browser 0033 adds optional one-time x2 capacity upgrades to the bounded-capacity base facilities. Each purchase belongs to one exact facility tile; another facility of the same type remains standard until upgraded separately. Save format remains **4**.

## Eligible facilities and costs

- Living Quarters: **12 → 24 personnel berths**, upgrade **$750k**.
- Laboratory: **10 → 20 Scientist positions**, upgrade **$1,125k**.
- Workshop: **10 → 20 Engineer positions**, upgrade **$1,000k**.
- Sickbay: **4 → 8 recovery beds**, upgrade **$950k**.
- Base Stores: **80 → 160 storage units**, upgrade **$700k**. The Access Lift reserve is unchanged.
- V.A.L.A.N.T. Mental Health Center: **4 → 8 total specialist positions**, upgrade **$1,075k**. One specialist remains included per Center; additional positions must still be hired normally.

Training Centers and Rec Rooms remain intentionally unlimited, Hangars remain one-aircraft facilities rather than personnel-capacity facilities, and Alien Containment currently has no numeric capacity authority to double.

## Purchase and persistence authority

Select a built eligible facility tile in Base management and choose **Upgrade Capacity**. A confirmation identifies the exact base, tile, old/new capacity, cost, and post-purchase funds. The upgrade is stored on that exact base tile. Upgraded tiles show an **x2** badge.

Demolishing an upgraded facility removes its upgrade permanently with no refund. Rebuilding a facility in the same tile starts at standard capacity. Old saves without upgrade data normalize naturally to standard facilities. Existing base, personnel, research, workshop, Sickbay, storage, V.A.L.A.N.T., demolition and save authorities are reused rather than introducing parallel capacity systems.

## Verification

- Direct capacity helper fixture: **10/10 checks passed** for individual tile ownership, mixed upgraded/non-upgraded facilities, Quarters, Lab, Workshop, Sickbay, Base Stores and V.A.L.A.N.T. capacity.
- Static integration checks: **10/10 passed** for UI purchase/confirmation wiring, demolition cleanup, rebuild cleanup, save/load base persistence, storage authority and upgrade badge.
- All **5 executable embedded runtime JavaScript blocks** pass `node --check`.
- `service-worker.js` passes `node --check`.
- Embedded host payload is byte-for-byte identical to `src/browser-runtime.html`; byte count and SHA-256 match release metadata.
- Save format remains **4**.

## Manual acceptance

At one base, build two facilities of the same eligible type. Upgrade only one and verify only that facility's capacity contribution doubles. Repeat with Base Stores and verify purchasing/storing stock honors the new limit. Test Lab/Workshop hiring ceilings, Sickbay admissions, V.A.L.A.N.T. specialist hiring, and Living Quarters personnel hiring. Save/reload, demolish an upgraded facility, rebuild it, and confirm the replacement is standard until purchased again.
