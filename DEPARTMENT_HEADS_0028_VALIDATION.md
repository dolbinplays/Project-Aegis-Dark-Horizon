# Department Heads foundation — Browser 0028

Open **Departments**, hire a head, choose their home base and managed squads, configure the policy, then enable automation. Each head costs $120k and occupies one personnel berth. Automatic reviews run on a new campaign day, mission-report change after return, or recruit arrival. All sorties must be home. **Run review now** explicitly permits another review and its spending budget. Both roles share the campaign treasury; Personnel reviews first, and Quartermaster respects the remaining funds and its own reserve.

Quartermaster manages weapon, armor, medkit ownership, bandages and medical charges through existing inventory helpers. Replaced equipment returns to local stores. Purchases use market prices, research requirements, storage limits and purchasability. Workshop-only items remain manual. Grenades, flares and ammunition retain existing mission provisioning rules. A single template applies to the selected local squads, optionally including unassigned reserves.

Personnel fills selected squads from unassigned local Ready soldiers, then orders shortages and the requested reserve using the normal $120k/three-day recruitment queue. It counts existing pending soldier orders and wounded personnel toward strength, and includes pending staff and hired heads in personnel-capacity checks. Existing memberships are preserved, except dead or missing members are cleared from managed squads. It does not transfer personnel between bases.

## Verification

- Eight behavior tests with the actual runtime helpers: default/migrated policy, duplicate-recruit prevention, treasury/budget/housing limits, medical stock accounting, research/storage restrictions, deployed-campaign exclusion, equipment exchange and manufactured-item restrictions, and disabled policies.
- Three existing AI stream/startup tests pass, including hook-order verification through start, save menu and new-game setup.
- Fresh headless Edge: loaded a test campaign, hired both heads, configured Personnel, automatically filled a six-soldier squad, ordered exactly two reserves, reran without duplicate orders, and saved both policies and the recruitment queue. Two hiring fees plus two recruitment fees left $4,520k from $5,000k. No page errors. Test context was separate from player browser data.
- Inspected the Departments page at a 390-pixel viewport; content remains in the normal scrollable campaign layout.
- Existing save format remains 4; missing department data normalizes to unhired/disabled. New runtime module is included in the offline service-worker asset list.

Installed-game deployment and a live mission-return field test remain manual acceptance checks. Per-squad loadout templates, more department roles and one head per base remain future work.
