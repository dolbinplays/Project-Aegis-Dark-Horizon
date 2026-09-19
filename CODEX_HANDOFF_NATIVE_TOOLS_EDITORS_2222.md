# Codex Handoff — Native Tools / Editors Runtime Payload Patch 2222

Authoritative baseline checked: GitHub `main` commit `4e47c0087df3fe30801b6a21c5bc4aedd8fcc90a`.

## Problem
The 2115 Tools / Editors launcher was implemented as a post-render DOM injector. Field testing in the installed app showed the Save / Load header still contained only Return to Game, Build Health, Hover Help, Enhanced SFX Library, Patch Notes / Version History, and Start New Game. The actual rendered React runtime therefore remained untouched.

## 2222 implementation
`service-worker.js` transforms the launch shell before delivery. It locates `#aegis-runtime-payload`, decodes its UTF-8 Base64 runtime source, inserts a native React button immediately after the authoritative Enhanced SFX Library button, re-encodes the payload, and regenerates source byte count and SHA-256 metadata.

Native marker:
`data-aegis-open-tools-editors="true"`

The button opens:
`./AEGIS_Tools_Editors.html`

Hub destinations:
- `./AEGIS_Prop_Editor_CURRENT.html`
- `./AEGIS_Prop_Runtime_Test_Gallery_CURRENT.html`

The old launcher extension remains a fallback but is no longer the primary authority for the Save / Load button.

## Why this is safer than replacing source/index from a stale local copy
The repository connector exposed the current 7.3 MB runtime for inspection but did not provide a raw local byte export suitable for safely rebuilding the 9.8 MB shell in this session. Rather than overwrite either authoritative file with an older local artifact, 2222 transforms the exact runtime payload already present in the published `index.html` response. No stale game source is introduced.

## Save compatibility
Save format remains **4**. No save schema migration.

## Validation
`tools/test-native-tools-editors-runtime-payload-2222.cjs` exercises payload decode → patch → encode, byte-count regeneration, SHA-256 regeneration, idempotence, fallback launcher retention, hub links, cache generation, and save-format metadata. Result: 19/19 PASS.
