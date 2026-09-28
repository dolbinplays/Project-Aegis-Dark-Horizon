# VIP hair variety — September 28 Browser 0004

Adds deterministic short, swept, bob, bun and bald VIP hairstyles using the existing natural color palette. Both presentation variants can use every style. Existing VIPs adopt the new identity-derived style on upgrade; save/load, movement, panic and escort changes do not reroll it. Ordinary civilians keep short hair; classic/distant status presentation is unchanged. Save format remains 4.

Hair parts use cached low-poly geometry merged into the existing head assembly. Full/mid models share matching head geometry irrespective of clothing or presentation variant. The hairstyle participates in the appearance signature and head geometry key. Bald styles produce no hair parts. The model retains ten meshes; gait and unarmed authority are untouched.

New regression coverage checks all styles for both presentation variants across 500 identities; stable save/playback identity; distinct finite bounded geometry; full/mid cache reuse; unchanged mesh count; shared geometry surviving individual unit disposal; and runtime ownership for final cleanup. Prior wardrobe, pose, material and soldier-identity tests are included in the targeted run.

Live visual acceptance pending: inspect all five styles in full/mid Iso, TPV and visible FPV teammates, under day/night lighting and while walking, kneeling, boarding and dying. No frame-rate improvement is claimed. Native parity, dresses and security details remain outside this patch. Full repository suite not rerun.

Results: all 36 targeted tests passed. Runtime packaging, build seam, embedded JavaScript syntax and whitespace checks passed.
