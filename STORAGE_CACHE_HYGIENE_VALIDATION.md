# Storage cache hygiene — September 27 build 0002

Observed C: free space was 1,343,488 bytes; E: free space was 111,310,667,776 bytes. The screenshot alone does not measure site usage, and no live Chrome save/cache database was opened or modified.

Worker asset refresh previously copied precached assets into a second runtime cache while reads could continue using the older precache. Refresh now updates that precache in place, deleting only its redundant runtime entry. Activation also removes current-cache duplicates. Runtime downloads outside the game scope and installer archives are not retained. Optional cache failures return false without consuming the network response. Mandatory initial offline-shell installation still requires sufficient disk space.

No manual saves, autosaves, IndexedDB recovery generations, localStorage or external backups are removed. Existing save persistence requests and E:-folder backup support already exist.

Validation: 3 cache behavior tests and 17 save recovery tests passed. Release/build/syntax checks and mobile PWA tests recorded below. Live installed update acceptance remains pending after disk space is freed.

Final verification: all 10 mobile/PWA regressions passed, along with build seam, embedded JavaScript syntax and git whitespace checks. Total targeted tests: 30 passed.
