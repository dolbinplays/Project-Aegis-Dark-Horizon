# UFO observation memory

Build: v0.26.09.25.0004_UFO_OBSERVATION_MEMORY_PATCH

Each pending version-two UFO delivery retains craftObserved and firstObservedRound. Evidence comes from arrival sight, previously revealed same-source craft covers, or ordinary current LOS from living, conscious, non-extracted humans. Existing version-two craft.revealed is preserved as prior knowledge. Unrelated covers cannot latch observation. Updates are immutable and retained by both Manual and AI callers even when the handoff has not occurred.

Departure records and AI handoff frames carry departureObserved independently of beacon visibility. Current beacon observation remains authoritative for device reveal and the planted-device label. No research unlock, timing change or new save format.

Validation: six new behavioral tests pass, including hidden handoff, late observation, JSON save/normalization, immutable inputs, unrelated-source isolation, invalid observers, older records and actual AI continuation through a remembered sighting into departure. Existing 15 landing/disembarkation/handoff checks pass. Package, build seam, embedded JavaScript syntax and whitespace checks pass. Full regression suite was not rerun for this bounded patch.

Live Manual/Hybrid/PWA acceptance remains pending. This patch prepares observation state for flight animation; it does not add animated approach or departure.
