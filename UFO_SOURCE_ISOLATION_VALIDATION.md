# UFO source isolation

Build: v0.26.09.25.0006_UFO_SOURCE_ISOLATION_PATCH

Fixed broad craft replacement and cover retirement that could erase unrelated transports on a later arrival. Registration replaces/removes only matching source IDs; legacy matching uses stable ID or ramp anchor plus heading. Crashed UFOs and player craft never match. Cover retirement requires explicit departure, scopes tagged covers to the source, and uses a coordinate-specific cover prefix only for untagged legacy craft. Landed older transports remain physical obstacles rather than disappearing on an unrelated wave.

Validation: all 28 focused UFO tests pass. Four new tests cover repeated register/update/departure, two source identities at the same location, legacy transport identity, guarded cover retirement, unrelated beacon preservation and real later-wave arrival with existing hull/model preservation. Existing landing, disembarkation, center reservation, observation/save and handoff tests pass. Package, build seam, embedded syntax and whitespace checks pass. Full suite was not rerun.

Live visual acceptance remains pending. This is source-object isolation, not new simultaneous-source scheduling or flight animation. Save format remains 4.
