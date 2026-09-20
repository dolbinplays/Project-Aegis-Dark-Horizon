# Play Project Aegis on a TV with your phone

## Setup — no computer during play

1. Publish this updated build to your existing HTTPS game website, including
   `AEGIS_TV.html`, `AEGIS_Phone_Controller.html`, and the new files in `assets`.
   The controller works on a static host such as GitHub Pages; it needs no custom server.
2. On Fire TV, open the game website in **Amazon Silk**. Open
   **Tools / Editors → Play on TV**, or navigate directly to `AEGIS_TV.html`.
3. Press **Pair phone** using the Fire TV remote.
4. On your phone, open the controller address shown on the TV. You can also open
   the same game website, then **Tools / Editors → Phone Controller**.
5. Enter the 12-character TV code and tap **Connect to TV**.
6. Use the Fire TV remote to press **Start game on TV** once. Leave
   **Performance graphics** checked for the first hardware test.
7. Use the phone touchpad to move the on-screen cursor; tap to select.

Both devices need compatible WebRTC data-channel support. Use the same Wi-Fi and
keep internet access available for pairing. Guest-network isolation, VPNs, restrictive
networks, or a browser without WebRTC may prevent a direct connection. The UI reports
unsupported browsers and connection failures rather than promising compatibility.

This has been tested between desktop browser sessions, **not on a physical Fire TV
Stick or phone**. Silk support/performance varies by device; the physical-device
acceptance run below remains necessary. Amazon documents Silk for Fire TV:
[Amazon Silk documentation](https://docs.aws.amazon.com/silk/).

## Phone controls

- Slide on the touchpad: move the TV pointer. Tap: select/click.
- Drag: toggle a held mouse button for map dragging; toggle again to release.
- Two fingers or Scroll buttons: scroll panels; over the tactical canvas, the
  game's wheel handler controls zoom.
- Point at a dropdown and tap: choose its option on the phone.
- Point at a text field, open Keyboard & fine movement, enter text, and tap Send text.
- Next field / Enter / Escape / arrow keys forward ordinary game UI input.
- Center pointer resets the cursor to the middle of the TV.

Use the Fire TV remote for browser-owned dialogs, fullscreen, file pickers, and any
audio permission prompt. Remote browser input cannot manufacture trusted browser
gestures. Campaigns remain stored on the TV browser's origin; phone control does
not transfer a campaign from your phone or computer. Use the existing backup/import
workflow if you want to transfer a campaign.

## Connection and privacy

PeerJS 1.5.5 is vendored locally under its MIT license. Its public PeerServer Cloud
arranges the connection; Google STUN assists address discovery. Gameplay remains
on the TV, and control messages use an encrypted WebRTC data channel. No audio,
video, campaign saves, account credentials or screen stream are sent by this feature.
No TURN relay is configured, so this is a direct-connection feature, not a guarantee
of connectivity across arbitrary networks. PeerServer availability is an external
dependency. See [PeerServer Cloud](https://peerjs.com/server/cloud) and
[PeerJS FAQ](https://peerjs.com/client/faq).

The random code contains a separate authentication secret that is not part of the
signaling peer ID. Keep it private. Only one authenticated phone controls a session.
New pairing code revokes the prior session; closing the TV page destroys it.
Disconnects, hidden phone pages and missing heartbeats release held pointer input.
They do not reload the game or automatically pause campaign time.

Pairing requires internet even though the UI assets are cached by the PWA.

## Validation completed

- Browser-to-browser pairing through PeerServer Cloud and direct WebRTC.
- Phone touchpad opened the actual nested React game Save/Load menu.
- Phone scrolling, dropdown selection, and text entry changed the real game UI.
- Automated tests cover code generation, bounded command validation, wrong-secret
  rejection, input gating, single-controller ownership, rate limits, and disconnect/
  heartbeat release.

## Physical-device acceptance

1. Pair your phone with Silk on the exact Fire TV model you use.
2. Check UI readability, scroll behavior, audio activation, and a tactical mission
   in 2D and Performance 3D. Check selecting units/hexes, map dragging and zoom.
3. Put the phone to sleep during a drag: the held input must release. Wake it and
   reconnect if necessary; the TV game must remain open.
4. Complete a mission transition and verify control of the newly created runtime.
5. Verify save/reload on the TV and repeat after a browser restart.

Run `node --test tools/test-tv-phone-controller.cjs` for protocol/session regressions.
