# Tactical body identity — September 28 Browser 0002

Shares lean/average/stocky appearance scaling between portrait data and classic tactical torso, chest plate and personal emblem placement. Existing full/mid articulated body scaling is preserved. Persistent model signatures now include body scale so appearance changes rebuild the model. No new geometry, draw calls or save fields. Head proportions and classic weapon placement remain independently defined; map position and body height are unchanged.

Automated coverage includes saved appearance normalization/reload, body/armor/emblem transforms, unchanged shared geometry, body-triggered model invalidation, HP/TU signature stability, and actual model construction for all three body types across classic/full/mid/low detail. The fallback renderer uses the same helper; its UI path has not been exercised live.

Field acceptance pending: compare lean/average/stocky soldiers in portraits, classic, full/mid articulated and low detail. Inspect armor and emblem alignment, turning, kneeling and camera switches. Native parity remains outside this slice. Full repository suite not rerun.

Results: all 25 targeted identity tests passed. Runtime packaging, build seam, embedded JavaScript syntax and git diff whitespace checks passed.
