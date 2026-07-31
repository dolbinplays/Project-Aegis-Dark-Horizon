Alien Response Command / Project Aegis
Patch: v0.26.07.31.0145_DIRECT_FILE_RECORDED_VOICE_PLAYBACK_FALLBACK_INDEX_ONLY_PATCH
Native: v0.26.07.31.GODOT.0015_VOICE_AUDIBILITY_NORMALIZATION_AND_MUSIC_DUCKING_VERTICAL_SLICE

Purpose:
- Restore recorded voices when index.html is opened directly through file://.
- Use bounded native media playback for direct-file launches, where browsers block WAV fetches.
- Preserve the ordered voice queue, volume/mute controls, segmented takes, and music ducking.
- Keep the normalized Web Audio computer/radio effects path unchanged on localhost and hosted builds.

Validation performed:
- Static browser parsing passed all 8 script assets.
- Build seam checker passed, including real PCM energy checks for all Test Voices takes.
- Browser Build Health passed 293/293 through localhost.
- Godot tests passed 108/108; native Build Health passed 82/82.
- Localhost start screen, Geoscape, six-soldier tactical launch, movement highlight, and three End Turn cycles passed without a runtime error overlay.

Manual gate:
- Open index.html directly, press Test Voices, and confirm all three categories are audible while music dips and restores.
- Confirm natural base, aircraft, and tactical events remain ordered and audible.
