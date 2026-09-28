# VIP business dress — September 28 Browser 0005

Adds an identity-derived dress/pantsuit choice for female-presenting VIPs. Existing outfits may change once on upgrading; movement, panic, escorting and save/load do not reroll the choice. Other VIP presentation and ordinary civilian clothing remain unchanged. Save format remains 4.

A coordinated jacket/blouse and pleated skirt silhouette use two flared panels attached to the existing left/right hip joints, replacing upper-leg geometry. Lower-leg skin and shoes remain on the existing knee joints. There is no static skirt over the walking legs, separate animation clock or additional mesh. Full/mid models reuse cached geometry, with outfit-specific leg keys and an outfit-aware appearance signature.

Tests verify both outfit options across 500 identities, reload/playback stability, separate dress/trouser geometry, full/mid sharing, unchanged ten-mesh budget, hip attachment and transformed panel movement, finite calm/frightened/cover-kneeling/death poses and unchanged opposite hip rotation. A test caught correlated parity selection that assigned every female VIP a dress; selection now uses a separate deterministic percentage threshold.

Field acceptance remains pending: inspect the skirt at rest and throughout calm/frightened walking, kneeling, boarding, death and camera rotation in full/mid Iso, TPV and visible FPV teammate views. Automated joint checks do not prove absence of visible panel gaps or clipping. Native parity and security details remain separate work. Full repository suite not rerun.

Results: all 38 targeted identity tests passed. Runtime packaging, build seam, embedded JavaScript syntax and whitespace checks passed.
