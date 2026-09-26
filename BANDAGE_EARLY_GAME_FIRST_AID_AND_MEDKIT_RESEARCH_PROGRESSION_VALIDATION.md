# Bandage Early-Game First Aid + Medkit Research Progression

Build: `v0.26.09.26.0012_BANDAGE_EARLY_GAME_FIRST_AID_AND_MEDKIT_RESEARCH_PROGRESSION_PATCH`
Save format: 4

## Implemented authority
- Ordinary living soldiers normalize to 4 Bandages; Medics normalize to 10. Counts persist strategically and tactically.
- Bandages are Quartermaster market supplies at 2k buy / 1k sell.
- Stabilizing a bleeding casualty preferentially consumes one Bandage, stops bleeding, and restores 0 HP. A Medkit charge remains a fallback stabilization supply when Bandages are exhausted.
- Routine teammate healing and self-healing remain Medkit-only. AI urgent triage recognizes Bandages; routine AI HP treatment still requires a Medkit charge.
- `Field Medkits` research unlocks Workshop Medkit production and Medical Supplies. Medkits are no longer directly purchasable market stock. Existing Medkits in old saves remain compatible.
- Tactical deployment/snapshots/playback, mission aftermath, KIA recovery and campaign soldier state carry Bandage counts without a save-format change.

## Automated validation
- All five non-empty embedded runtime script blocks pass Node syntax validation.
- Service-worker/host syntax and embedded payload byte/hash checks are release gates.
- Focused source contracts pass **17/17** checks covering 4/10 capacities, market price, Workshop/research gate, Quartermaster restock, Bandage tactical persistence, AI stabilization supply, Medkit-only routine healing, frozen 0011 history, current build identity, launch-cache identity, and save format 4.
- A focused executable helper harness passes: Bandage stabilization consumes one Bandage, leaves Medkit charges untouched, stops bleeding, and heals 0 HP; an exhausted Bandage supply falls back to a Medkit charge; ordinary healing rejects a Bandage-only responder; Medkit healing still restores 10 HP.

## Field acceptance still required
Run a fresh campaign and an upgraded save through Quartermaster, Research, Workshop, Manual tactical play, Hybrid/Simulation triage, mission return and save/reload. No live-browser acceptance is claimed by this validation note.
