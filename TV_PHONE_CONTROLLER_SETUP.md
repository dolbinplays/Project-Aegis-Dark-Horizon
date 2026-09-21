# Play Project Aegis on a TV with your phone

## Setup — no computer during play

1. Publish this updated build to your existing HTTPS game website, including
   `AEGIS_TV.html`, `AEGIS_Phone_Controller.html`, and the new files in `assets`.
   The controller works on a static host such as GitHub Pages; it needs no custom server.
2. On Fire TV, open the game website in **Amazon Silk**. Open
   **Tools / Editors → Play on TV**, or navigate directly to `AEGIS_TV.html`.
3. Press **Pair phone** using the Fire TV remote.
4. On your phone, scan the TV's QR code with the phone camera and open its link.
   The controller fills in the code and connects automatically.
5. Alternatively, open the controller address shown on the TV (or **Tools / Editors
   → Phone Controller**), enter the 12-character TV code and tap **Connect to TV**.
6. Use the Fire TV remote to press **Start game on TV** once. Leave
   **TV Lite (recommended)** checked for the first hardware test. This choice is
   locked for the session; reload the TV page to choose a different profile.
7. Use the phone touchpad to move the on-screen cursor; tap to select.

Both devices need compatible WebRTC data-channel support. Use the same Wi-Fi and
keep internet access available for pairing. Guest-network isolation, VPNs, restrictive
networks, or a browser without WebRTC may prevent a direct connection. The UI reports
unsupported browsers and connection failures rather than promising compatibility.

After installing the QR pairing/resilience patch, reload **both** TV and phone
pages. Controller protocol 2 rejects old controller versions. New pairing code
invalidates the old session and replaces the QR after the new ID is registered.
Scanning an old screenshot will not bypass that change.

The QR is generated locally with the vendored MIT-licensed
[qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator). No remote QR
image service receives the secret. The link carries the code in its fragment,
which is not part of the controller HTTP request; the phone removes that fragment
from history after reading it. Keep the QR private just like the typed code.
The game does not request camera permission: use the phone's normal camera app,
or use manual entry. QR display needs a hosted HTTP(S) controller address.

Developer validation used desktop browser sessions. A user hardware report describes
slow gameplay, unusable FPV/TPV, and menu-related disconnects on a Fire TV Stick
whose model is not yet known. Physical-device acceptance remains incomplete.
Amazon documents Silk for Fire TV:
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

A missing TV heartbeat now pauses new controller actions without destroying the
pairing. Controls resume when the TV replies; an actual channel closure still
requires reconnection. This addresses the previous six-second timeout that could
disconnect a phone during a slow menu render. It does not fix the underlying stall.

Controller protocol 2 also requires a short-lived input lease issued by the TV.
Clicks queued for more than 2.5 seconds are discarded rather than executed against
a later screen. Device clocks need not be synchronized. Releases bypass the lease
so a held pointer can always be released. Old heartbeat replies and congested send
queues cannot reactivate normal input. A pairing-server error alone no longer
destroys an otherwise healthy direct connection.

TV Lite starts each tactical view mount in 2D, including returning from menus.
You can select 3D, but FPV/TPV are explicitly experimental. The TV profile caps
game WebGL drawing buffers at 1280 × 720 and targets at most 30 FPS, disables
antialiasing and backdrop blur, and reduces tactical model and globe detail.
It does not change campaign simulation timing or desktop graphics preferences.
These are ceilings, not a promise that the device can reach 30 FPS.
Opening the TV pairing overlay or hiding the TV page suspends TV Lite drawing;
only the latest pending frame is drawn on return. Campaign time is not paused.

Patch history initializes once per app mount instead of rebuilding the history
and extending the self-test runner on every update. In TV Lite, history displays
12 entries per page and the sound library displays one group per page. Build
Health runs its full checks only when requested; those checks can still block
the TV temporarily. Ordinary menus no longer incur that startup suite.

## Performance diagnostics

Use the TV remote's **Diagnostics** button in the TV overlay. It reports the
current screen, busiest WebGL renderer's measured FPS, renderer count, event-loop
delay, and long-task count/duration when Silk supports the Long Tasks API. Zero
FPS is normal in 2D and idle scenes. The action near the longest stall is a clue,
not proof that the action caused it. The phone reports round-trip TV response
latency, which includes both network delay and TV processing delays.

Reports reset when the disposable game runtime is replaced. No performance data
is uploaded. Memory usage is not estimated because browser APIs cannot reliably
report the Fire Stick's total available memory.

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
   in default 2D and optional TV Lite 3D. Check selecting units/hexes, map dragging
   and zoom. Record the Fire Stick model, busiest-view FPS, worst stall, and menu.
3. Put the phone to sleep during a drag: the held input must release. Wake it and
   reconnect if necessary; the TV game must remain open.
4. Complete a mission transition and verify control of the newly created runtime.
5. Verify save/reload on the TV and repeat after a browser restart.
6. Complete a full mission with diagnostics visible. Open Save/Load, patch notes,
   the sound library, and other campaign menus repeatedly; confirm pagination,
   recovery after stalls, and stable renderer counts after closing 3D views.
7. Scan the QR from the TV with a real phone camera. Confirm automatic connection,
   then choose New pairing code and verify the old screenshot no longer connects.
   Repeat with manual code entry and after reloading both pages.

This patch has automated coverage for render limits, frame scheduling/disposal,
pagination, one-time history initialization, and controller recovery. Live browser
automation was unavailable during this patch; hardware acceptance is still pending.

Run `node --test tools/test-tv-phone-controller.cjs` for protocol/session regressions.
Run `node --test tools/test-tv-lite.cjs` for the TV presentation regressions.
