const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const indexPath = path.join(root, "index.html");
const manifestPath = path.join(root, "src", "manifest.json");
const nativeContentPath = path.join(root, "godot", "data", "content.json");
const nativeMainPath = path.join(root, "godot", "scripts", "main.gd");
const nativeTacticalPath = path.join(root, "godot", "scripts", "tactical_board.gd");
const nativeAudioBusPath = path.join(root, "godot", "default_bus_layout.tres");
const dialogueDirectory = path.join(root, "assets", "audio", "dialogue");
const dialogueManifestPath = path.join(dialogueDirectory, "manifest.js");
const alternateAudioDirectory = path.join(root, "assets", "audio", "alternate");

const html = fs.readFileSync(indexPath, "utf8");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const nativeContent = JSON.parse(fs.readFileSync(nativeContentPath, "utf8"));
const nativeMain = fs.readFileSync(nativeMainPath, "utf8");
const nativeTactical = fs.readFileSync(nativeTacticalPath, "utf8");
const nativeAudioBus = fs.readFileSync(nativeAudioBusPath, "utf8");
const dialogueBox = { window: {} };
vm.runInNewContext(fs.readFileSync(dialogueManifestPath, "utf8"), dialogueBox, { filename: dialogueManifestPath });
const dialogue = dialogueBox.window.PROJECT_AEGIS_RECORDED_DIALOGUE;

function wavTakeEnergy(filePath, take, sampleLimit = 12000) {
  const wav = fs.readFileSync(filePath);
  let cursor = 12;
  let channels = 0;
  let sampleRate = 0;
  let bitsPerSample = 0;
  let dataOffset = 0;
  let dataSize = 0;
  while (cursor + 8 <= wav.length) {
    const chunkId = wav.toString("ascii", cursor, cursor + 4);
    const chunkSize = wav.readUInt32LE(cursor + 4);
    const chunkData = cursor + 8;
    if (chunkId === "fmt " && chunkSize >= 16) {
      channels = wav.readUInt16LE(chunkData + 2);
      sampleRate = wav.readUInt32LE(chunkData + 4);
      bitsPerSample = wav.readUInt16LE(chunkData + 14);
    } else if (chunkId === "data") {
      dataOffset = chunkData;
      dataSize = Math.min(chunkSize, wav.length - chunkData);
      break;
    }
    cursor = chunkData + chunkSize + (chunkSize % 2);
  }
  if (!dataOffset || channels < 1 || sampleRate < 1 || bitsPerSample !== 16) return { rms: 0, peak: 0, samples: 0 };
  const bytesPerFrame = channels * 2;
  const frameLength = Math.floor(dataSize / bytesPerFrame);
  const startFrame = Math.max(0, Math.min(frameLength, Math.floor(Number(take.start || 0) * sampleRate)));
  const endFrame = Math.max(startFrame, Math.min(frameLength, Math.ceil((Number(take.start || 0) + Number(take.duration || 0)) * sampleRate)));
  const stride = Math.max(1, Math.ceil((endFrame - startFrame) / sampleLimit));
  let sumSquares = 0;
  let peak = 0;
  let samples = 0;
  for (let frame = startFrame; frame < endFrame; frame += stride) {
    for (let channel = 0; channel < channels; channel += 1) {
      const sample = Math.abs(wav.readInt16LE(dataOffset + frame * bytesPerFrame + channel * 2) / 32768);
      peak = Math.max(peak, sample);
      sumSquares += sample * sample;
      samples += 1;
    }
  }
  return { rms: samples ? Math.sqrt(sumSquares / samples) : 0, peak, samples };
}

const required = [
  manifest.currentBuild,
  `const CURRENT_GAME_VERSION=currentGameVersionFromBuild()`,
  "ARCHITECTURE_MODULE_PLAN",
  "Modular source layout and engine-port prep contract is present",
  "Workshop production preserves destination base and equipment logistics summaries",
  "Base transfer logistics charge fees and cancel back to origin",
  "Base transfer Logistics Center lists payloads and supports bulk equipment quantities",
  "Base-local loadout buttons only advertise selected-base stock",
  "Mission confirmation explains local loadout and launch base",
  "Aircraft ferry staging checks open hangars and refuel legs",
  "New-base placement previews separated Interceptor and Skyranger ferry lanes",
  "Interceptor UFO tracking recognizes ferry-staged reach",
  "Loaded saves preserve interceptor eligibility and active travel",
  "Attached save supports reserved-home and multi-hop interceptor ferry routes",
  "Returning interceptors release departed staging hangars without losing home reservations",
  "Ready aircraft can ferry home or rebase through clock-tracked routes",
  "Aircraft relocation reserves destination hangars across save resume",
  "Aircraft relocation queue preserves reservations and unavailable status",
  "Alien incident duration advances by combat rounds instead of a full day",
  "Aircraft ferry range and home return preserve direct staged and repeat-attack routes",
  "Staged aircraft routes display origin ferry legs",
  "Staged interceptor route timeline and return decision are restored",
  "Staged Skyranger route timeline includes ferry refuel incident and return legs",
  "Staged aircraft route labels and day-night globe lighting are readable",
  "Skyranger ferry staging extends incident response range",
  "First-base selection previews opening incidents and starting reach",
  "Solid Geoscape globe uses opaque detailed landmasses and remains draggable",
  "Three.js tactical readability overlay summarizes selected unit cover weapon and turn",
  "Three.js tactical incident battle polish preserves terrain LOS movement and ammo readability",
  "Procedural tactical biomes generate wilderness streams city roads farms and small towns",
  "Tactical building archetypes share passable interiors across 2D and Three.js maps",
  "Continuous tactical walls open traversable breaches for every unit type",
  "Tactical enclosures and street props remain gameplay-only terrain",
  "Three.js tactical performance mode caps expensive rendering and idles on demand",
  "Three.js tactical instanced ground preserves picking gapless hexes and 2D recovery",
  "Tactical lighting is removed from gameplay and render hot paths",
  "Tactical civilians rescue actions and breach feedback share 2D and 3D state",
  "Tactical rescue extraction state and mission-intent rewards stay distinct from casualties",
  "Mandatory civilian objectives continue through a bounded secure rescue phase",
  "AI mandatory rescue phase searches escorts and extracts before resolution",
  "Tracked VIP pings direct every free AI soldier until contact before area sweeps resume",
  "Incident transports deploy one Skyranger and one ramp formation per response squad",
  "Small medium and large tactical profiles scale civilians while keeping rendered views bounded",
  "Tactical perimeter guards and Three.js VIP beacons preserve bounded movement and rescue guidance",
  "VIP contact priority pauses for squad-wide alien contact and resumes when clear",
  "All-located VIP rescue assigns distinct perimeter guards while escorts continue extraction",
  "Escorted VIPs stay visible through fog and manual cameras prioritize the selected soldier",
  "Building probability scales by wilderness farm town city and tactical map size",
  "AI escorts leave buildings through doors or breached walls and carry full civilian columns into the Skyranger",
  "AI routes through doors to enter buildings and locks adjacent VIP contact without circling",
  "2D Fit Map reserves a visible perimeter around every battlefield size",
  "Three.js Fit Map keeps every battlefield corner inside the live camera frustum",
  "Skyranger ramp civilian escorts follow bounded paths and recover from panic",
  "Escort chains reserve single-file cells and panic favors broken sightlines",
  "Reload and fire-mode changes are authoritative for the next tactical action",
  "Selected escorts report bounded formation state and ramp distance",
  "AI tactical handoff preserves the live battlefield and prioritizes spotted civilians",
  "AI tactical map playback follows squad movement rescue and combat action",
  "AI tactical map camera centers every active actor and retains focus between actions",
  "AI commanders unlock experienced doctrine and bounded formation roles",
  "Fire-mode reaction shots use Reaction stat ammo and reserved TU",
  "Alien AI hunts humans through bounded cover while AI playback preserves fog",
  "Classic battlescape console exposes real map inventory stance reserve done and dust-off controls",
  "Tactical deployment exposes functional right and left hand slots",
  "Adjacent soldiers transfer hand and belt items while floor state preserves elevation",
  "Frag Grenade preparation spends four TU and enters explicit targeting",
  "Frag Grenade blast is seven-hex bounded and opens traversable rubble",
  "AI command can return the live battle to player control",
  "AI rescue routing rotates soldiers and rejects two-cell loops",
  "AI command assigns non-escorts to squad contacts while existing escorts evacuate",
  "Fresh simulated encounters refresh every living soldier's TU after round one",
  "Paired squad wipeouts allocate distinct sequential C and D replacements",
  "Non-escort soldiers converge on wounded or downed squad distress calls, then search the firing direction",
  "Civilian escorts minimize known alien firing exposure before extraction",
  "AI playback presents visible soldiers and aliens one actor at a time",
  "Classic lineup tracers connect exact firing and target units",
  "Classic lethal targets remain alive through movement, hidden fire, and firing frames",
  "Pre-contact civilian claims pause when squad-wide alien contact demands combat",
  "Non-escort soldiers converge on last-known alien contacts instead of claiming civilians",
  "Skyranger landing footprint stays separated from buildings",
  "Manual tactical state survives command-section navigation",
  "Compact base selection recruitment warnings and squad-home recovery preserve base ownership",
  "AI tactical soldier voices are queued and audio-unlocked",
  "Dedicated voice bus has independent volume and mute gain",
  "Recorded voice takes use bounded energy normalization with a silence floor",
  "Dialogue music ducking and clean processed speech preserve intelligibility",
  "Direct-file recorded voice fallback avoids blocked local fetches",
  "Voice preferences normalize and persist independently from SFX",
  "Audio settings expose voice toggle slider and user-gesture playback test",
  "AI tactical playback emits bounded context-aware soldier dialogue",
  "ALTERNATE_SOUNDTRACK_AND_TACTICAL_AUDIO_DIRECTION_PATCH",
  "ALTERNATE_MUSIC_AUDIO_URLS",
  "Dark Horizon Alternate",
  "Enhanced Tactical SFX",
  "Resuming search for the VIP",
  "footstep-human",
  "occasional-human-move",
  "Three.js Skyranger renders one cohesive craft with attached extraction ramp",
  "Geoscape range and ferry controls share one operational overlay section",
  "UFO alert speed selection retains the active command screen",
  "Port tactical visibility and turns use indexed bounded passes",
  "Three.js isometric tactical framing preserves vertical proportions",
  "All tactical battle views animate surviving soldiers after victory",
  "Classic lineup victory dance moves paper dolls without moving soldier cards",
  "Day-night terminator map follows Geoscape clock and preserves operational layers",
  "Recorded command aircraft and soldier dialogue uses segmented cached playback",
  "Recorded computer and aircraft dialogue use distinct transmission effects",
  "Geoscape computer and aircraft dialogue share an ordered queue",
  "Base computer voice uses metallic robotic processing",
  "Soldier dialogue uses radio static bookends and gates strategic aircraft playback",
  "Three.js tactical ground shares exact 2D cell gradients",
  "Three.js tactical hex centers and footprints match the 2D board",
  "Three.js tactical seam underlay closes raster junctions",
  "Base facility construction uses a compact dropdown with the complete catalog",
  "Fit Map frames complete Small Medium and Large grids in 2D and isometric views",
  "Out-of-combat soldiers approach and contact their nearest unescorted VIP",
  "Legacy tactical saves retain one delayed reinforcement dropship with complete validated troop placement",
  "Easy reinforcement mode retains the original 5 to 15 round post-wipe missed check-in cadence",
  "Legacy reinforcement craft still renders as a purple flying saucer with a rear deployment ramp",
  "Cross-squad responders advance directly to reported contacts before switching to cover and engagement",
  "Medkit issue and return conserve local Base Inventory",
  "Tactical Medkit use spends 12 TU heals 12 HP and consumes one charge",
  "Manual tactical final HP drives bounded wounded recovery",
  "Browser and native medical gameplay share an explicit parity contract",
  "paired-browser-godot",
  "aircraftOccupiesHangarSlot",
  "changeSoldierMedkitState",
  "tacticalMedkitUseResult",
  "applyTacticalMedicalGrowth",
  "recoverUnusedKiaMedkits",
  "Use Medkit - 12 TU",
  "PROJECT_AEGIS_RECORDED_DIALOGUE",
  "playRecordedDialogue",
  "recordedDialogueFxProfile",
  "recordedDialogueStaticBookends",
  "recordedDialogueShouldQueue",
  "voiceVolumeToGain",
  "recordedDialogueTakeEnergy",
  "recordedDialogueMakeupGain",
  "dialogueMusicDuckFactor",
  "DIALOGUE_MUSIC_DUCK_FACTOR",
  "recordedDialogueNeedsMediaFallback",
  "directFileDialogueVolume",
  "playRecordedDialogueMediaFallback",
  "dialogueMediaPlayers",
  "VOICE_SETTINGS_STORAGE_KEY",
  "data-aegis-voice-control",
  "testVoicePlayback",
  "tacticalAiFrameDialogueCue",
  "tacticalAiCommanderForUnits",
  "tacticalAiDoctrineForCommander",
  "tacticalAiMovePlan",
  "tacticalReactionShotResult",
  "tacticalReserveTuForMode",
  "tacticalGrenadePrimeResult",
  "tacticalGrenadeThrowResult",
  "tacticalGrenadeBlastCells",
  "tacticalAiRoundRobinUnits",
  "tacticalAiRefreshHumanTurnUnits",
  "tacticalAiMarkDistress",
  "tacticalAiDistressTarget",
  "rebuildSquadsAfterMission",
  "tacticalAiRescueRoute",
  "tacticalAiExtractionEgress",
  "tacticalAiBuildingExitRoute",
  "tacticalAiDirectExtractionRoute",
  "tacticalAiExtractionRoute",
  "tacticalAiObservedAliens",
  "tacticalAiPersonallyObservedAliens",
  "tacticalAiDirectContactPlan",
  "tacticalAiDirectReportedContactResponseTest",
  "tacticalAiThreatAwareReachablePlan",
  "tacticalAiFallbackPatrolPlan",
  "tacticalAiSequentialPlaybackFrames",
  "tacticalVipTrackerPings",
  "TACTICAL_MAP_PROFILES",
  "tacticalTransportCountForMission",
  "tacticalGridSizeForMission",
  "trackerPulses",
  "data-aegis-vip-tracker-three",
  "updateTrackerIndicators",
  "isTacticalMapEdge",
  "gridSize:deployment.gridSize||TACTICAL_GRID_SIZE",
  "const gridSize=tacticalGridSizeFrom(shooter,target)",
  "const gridSize = tacticalGridSizeFrom(placement, rampCells)",
  "tacticalAiSecureSearchAssignments",
  "tacticalAiSoldierEngagedWithAliens",
  "tacticalAiRescueGuardAssignments",
  "tacticalUnitVisibleOnMap",
  "tacticalIncidentCameraCenter",
  "tacticalBuildingDensityForMission",
  "tacticalPreContactCivilianClaims",
  "tacticalUpdateAlienContactMemory",
  "tacticalFindSkyrangerPlacement",
  "tacticalActiveActorCameraContractTest",
  "tacticalFitMap2dMetrics",
  "tacticalNearestVipEscortContractTest",
  "tacticalAlienReinforcementTurn",
  "tacticalAlienMissedCheckinContractTest",
  "tacticalAlienSaucerRenderContractTest",
  "tacticalOptionalRound",
  "tacticalAlienDropshipPlacement",
  "alien-reinforcement-dropship-group",
  "TACTICAL_LIVE_STATE_CACHE",
  "resolutionCompleted",
  "shotEndpoints",
  "has no assigned Skyranger",
  "squadBaseId||missionContext?.soldierBaseId||missionContext?.originalBaseId||missionContext?.launchBaseId",
  "takeBackAiCommand",
  "cancelAiPlaybackTimers",
  "Hands / Targeting",
  "connectRecordedDialogueVoiceFx",
  "enqueueRecordedDialogue",
  "dialogueSoldierTail",
  "metallicDelay",
  "tacticalBiome.sky",
  "TACTICAL_THREE_MAX_GROUND_PALETTES",
  "tacticalThreeGroundPalette",
  "tacticalCivilianObjectiveProgress",
  "tacticalAiShouldContinueRescue",
  "tacticalAiMissionResolution",
  "deferredGeoscapeSpeed",
  "tacticalCellVisual",
  "tacticalThreeWorldForCell",
  "tacticalCreateThreeHexGeometry",
  "groundPaletteBatches",
  "tacticalThreeHexGeometrySpec",
  "tacticalConnectedStructuralWalls",
  "bridgeScaleY",
  "recordedDialogueStyleForSoldier",
  "data-aegis-recorded-dialogue=\"segmented-takes\"",
  "runSelfTests"
];

const missing = required.filter((needle) => !html.includes(needle));

if (manifest.playableArtifact !== "index.html") {
  missing.push("manifest playableArtifact must remain index.html");
}

if (manifest.preserveSingleFileArtifact !== true) {
  missing.push("manifest preserveSingleFileArtifact must be true");
}

if (manifest.gameplayParity?.policy !== "paired-browser-godot") {
  missing.push("manifest gameplayParity policy must require paired browser/Godot gameplay patches");
}

if (manifest.gameplayParity?.browserBuild !== manifest.currentBuild) {
  missing.push("manifest gameplayParity browserBuild must match currentBuild");
}

if (manifest.gameplayParity?.nativeBuild !== manifest.nativePrototype?.build || nativeContent.build !== manifest.nativePrototype?.build) {
  missing.push("manifest and Godot content native build labels must match");
}
if (!nativeMain.includes(manifest.nativePrototype?.build || "")) {
  missing.push("Godot main scene build label must match the manifest native build");
}
for (const nativeNeedle of [
  "func reclaim_ai_command",
  "func _ai_rescue_plan",
  "func _ai_extraction_plan",
  "func _ai_building_egress_plan",
  "func _ai_direct_extraction_plan",
  "func _ai_threat_reachable",
  "func _ai_patrol_plan",
  "func skyranger_clear_of_buildings",
  "func _known_alien_contact_cells",
  "func _assign_precontact_civilian_claim",
  "func _record_tactical_distress",
  "func _ai_distress_target",
  "func _active_vip_tracker_targets",
  "func _ai_secure_search_assignments",
  "func _soldier_engaged_with_alien",
  "func _ai_rescue_guard_assignments",
  "func _building_density_profile",
  "func _refresh_explored_cells",
  "func _draw_tracker_pings",
  "Tracked VIP pings direct every free AI soldier until contact before area sweeps resume",
  "Each deployed squad forms at its own matching Skyranger rescue ramp",
  "Small Medium and Large tactical maps scale terrain and civilian capacity",
  "AI escorts use doors or breaches and continue through the ramp until the full civilian column extracts",
  "AI routes through real doors and assigns each free soldier to the nearest unescorted VIP",
  "One living alien commander can call a delayed dropship into a building- and Skyranger-clear footprint",
  "A wiped alien force draws one investigation dropship 5 to 15 rounds after its dead commander misses check-in",
  "Alien reinforcement craft renders as a purple flying saucer with a rear deployment ramp",
  "Cross-squad responders advance directly to reports before switching to cover and engagement",
  "Tactical neighbors paths and generated units remain inside the playable perimeter",
  "func _configure_map_profile",
  "func fit_entire_map",
  "func transfer_selected_inventory_item",
  "func drop_selected_inventory_item",
  "func pickup_selected_floor_item",
  "Base facility construction uses one compact dropdown catalog",
  "func _build_skyranger_placements",
  "Non-escort soldiers answer wounded and downed squad distress calls then search the firing direction",
  "ai_last_acted_ids",
  "voice_queue",
  "func _play_next_voice",
  "voice_player",
  "func _show_audio_settings",
  "func _set_voice_enabled",
  "func _set_voice_volume",
  "func _set_voice_music_duck",
  "func _closest_unescorted_vip",
  "func _personally_visible_alien_contacts",
  "func _ai_direct_contact_plan",
  "func _try_call_alien_reinforcements",
  "func _try_missed_checkin_reinforcements",
  "alien_missed_checkin_turn",
  "func _ellipse_points",
  "func _find_alien_dropship_placement",
  "alien_reinforcement_called",
]) {
  if (!nativeMain.includes(nativeNeedle) && !nativeTactical.includes(nativeNeedle)) {
    missing.push(`native tactical recovery seam missing: ${nativeNeedle}`);
  }
}
if (!nativeAudioBus.includes('bus/3/name = &"Voices"') || !nativeAudioBus.includes('bus/3/send = &"Master"')) {
  missing.push("native Voices bus must route independently to Master");
}

if (manifest.gameplayParity?.saveFormat !== manifest.saveFormat || nativeContent.save_format !== manifest.saveFormat) {
  missing.push("browser/native gameplay parity must preserve the shared save format");
}
if (!manifest.gameplayParity?.requiredSystems?.includes("wounded-downed-squad-distress-response")) {
  missing.push("browser/native gameplay parity must require wounded and downed squad distress response");
}
if (!manifest.gameplayParity?.requiredSystems?.includes("tracked-vip-pings-and-post-combat-rescue-search-sectors")) {
  missing.push("browser/native gameplay parity must require tracked VIP pings and post-combat rescue search sectors");
}
if (!manifest.gameplayParity?.requiredSystems?.includes("tracked-vip-precontact-ai-guidance")) {
  missing.push("browser/native gameplay parity must require tracked VIP pre-contact AI guidance");
}
for (const system of [
  "multi-skyranger-exact-squad-ramp-deployment",
  "tactical-small-medium-large-map-profiles",
  "tactical-playable-perimeter-edge-guards",
  "visible-vip-tracker-pulses-in-2d-and-3d",
  "unengaged-vip-contact-priority",
  "escorted-vip-fog-visibility",
  "post-contact-rescue-perimeter-guards",
  "selected-soldier-camera-focus",
  "biome-and-map-tier-building-density",
  "tactical-adjacent-inventory-transfers-floor-elevation",
  "compact-base-facility-dropdown",
  "tracked-vip-all-free-soldier-guidance",
  "squad-wide-combat-rescue-handoff",
  "door-aware-building-ingress",
  "immediate-adjacent-vip-contact-lock",
  "tactical-fit-map-all-tiers",
  "active-actor-tactical-camera-handoff",
  "fit-map-perimeter-framing",
  "nearest-unescorted-vip-contact-routing",
  "single-use-alien-commander-reinforcement-call",
  "building-and-skyranger-clear-alien-dropship-placement",
  "alien-commander-missed-checkin-investigation-reinforcement",
  "purple-alien-flying-saucer-rendering",
  "cross-squad-direct-reported-contact-response",
]) {
  if (!manifest.gameplayParity?.requiredSystems?.includes(system)) {
    missing.push(`browser/native tactical map parity system missing: ${system}`);
  }
}

if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "multi-base-aircraft-ferry-routing" && entry?.reason)) {
  missing.push("browser-only multi-base ferry routing must be recorded as a temporary gameplay parity exception");
}
if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "multi-base-recruitment-and-recovery-ownership" && entry?.reason)) {
  missing.push("browser-only multi-base recruitment and recovery ownership must be recorded as a temporary gameplay parity exception");
}

const nativeMedkit = nativeContent.field_items?.find((item) => item.id === "Medkit");
if (nativeMedkit?.heal !== 12 || nativeMedkit?.tu_cost !== 12) {
  missing.push("native Medkit must preserve the paired 12 HP / 12 TU contract");
}
const nativeGrenade = nativeContent.field_items?.find((item) => item.id === "Frag Grenade");
if (nativeGrenade?.prime_tu !== 4 || nativeGrenade?.throw_tu !== 12 || nativeGrenade?.range !== 6 || nativeGrenade?.damage !== 28 || nativeGrenade?.edge_damage !== 16) {
  missing.push("native Frag Grenade must preserve the paired prime throw range and damage contract");
}

for (const system of [
  "base-local-medkit-issue-return",
  "tactical-self-treatment-12hp-12tu",
  "one-charge-consumption",
  "final-hp-wounded-recovery",
  "victory-recovery-defeat-loss",
  "rank-experience-commander-doctrine",
  "commander-centered-formation-roles",
  "bounded-cover-aware-movement",
  "fire-mode-tu-reservation",
  "reaction-fire-during-alien-movement",
  "civilian-escort-reaction-reservation",
  "alien-human-priority-cover-advance",
  "ai-command-live-fog-of-war",
  "classic-map-inventory-stance-reserve-done-dustoff-controls",
  "tactical-right-left-hand-slots",
  "explicit-fire-grenade-targeting",
  "standard-frag-prime-throw-tu",
  "bounded-seven-hex-blast-breach",
  "tactical-ai-command-reclaim",
  "round-robin-ai-soldier-scheduling",
  "bounded-rescue-route-anti-loop",
  "full-squad-ai-turn-utilization",
  "combat-priority-squad-contact-response",
  "threat-aware-civilian-extraction-routing",
  "sequential-visible-ai-action-playback",
  "classic-lineup-source-target-tracers",
  "compact-base-selection-and-squad-home-recovery",
  "queued-tactical-voice-recovery",
  "dedicated-voice-bus-controls",
  "voice-take-normalization-music-ducking",
  "tracked-vip-pings-and-post-combat-rescue-search-sectors",
  "tracked-vip-precontact-ai-guidance",
  "multi-skyranger-exact-squad-ramp-deployment",
  "tactical-small-medium-large-map-profiles",
  "tactical-playable-perimeter-edge-guards",
  "visible-vip-tracker-pulses-in-2d-and-3d",
]) {
  if (!manifest.gameplayParity?.requiredSystems?.includes(system)) {
    missing.push(`gameplay parity system missing: ${system}`);
  }
}

if (!nativeContent.soldiers?.every((soldier) => Number.isFinite(soldier.reactions))) {
  missing.push("native soldiers must expose Reaction stats for tactical interruption fire");
}

if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "complete-classic-battlescape-command-set" && entry?.reason)) {
  missing.push("remaining classic battlescape command depth must be recorded as a temporary gameplay parity exception");
}

const dialogueWavFiles = fs.readdirSync(dialogueDirectory).filter((name) => name.toLowerCase().endsWith(".wav"));
const dialogueVariants = Object.values(dialogue?.events || {}).flatMap((event) => Object.values(event.variants || {}));
const alternateSoundtrackFiles = [
  "dark_horizon_overture.mp3", "command_directive.mp3", "global_vigil.mp3", "fort_aegis.mp3",
  "quartermaster_ledger.mp3", "mainframe_archive.mp3", "barracks_after_midnight.mp3", "unknown_specimen.mp3",
  "assembly_line_zero.mp3", "fireteam_covenant.mp3", "recovery_ward.mp3", "contact_in_the_dark.mp3",
  "after_action.mp3", "names_on_the_wall.mp3", "command_suspended.mp3",
];
for (const filename of alternateSoundtrackFiles) {
  const audioPath = path.join(alternateAudioDirectory, filename);
  if (!fs.existsSync(audioPath) || fs.statSync(audioPath).size < 100000) missing.push(`alternate soundtrack asset missing or too small: ${filename}`);
}
if (new Set(alternateSoundtrackFiles).size !== 15 || alternateSoundtrackFiles.some((filename) => !html.includes(`assets/audio/alternate/${filename}`))) {
  missing.push("alternate soundtrack must map one distinct generated file to all 15 existing music contexts");
}
if (dialogue?.recordingCount !== 105 || dialogueWavFiles.length !== 105 || dialogueVariants.length !== 105) {
  missing.push("recorded dialogue manifest must cover all 105 WAV recordings");
}
if ((dialogue?.takeCount || 0) < 300) {
  missing.push("recorded dialogue manifest must expose at least 300 segmented takes");
}
for (const variant of dialogueVariants) {
  const sourcePath = path.join(dialogueDirectory, variant.source || "");
  if (!variant.source || !fs.existsSync(sourcePath)) missing.push(`dialogue source missing: ${variant.source || "unknown"}`);
  if (!Array.isArray(variant.takes) || !variant.takes.length || variant.takes.some((take) => take.start < 0 || take.duration <= 0 || take.start + take.duration > variant.sourceDuration + 0.01)) {
    missing.push(`dialogue take bounds invalid: ${variant.source || "unknown"}`);
  }
}
for (const eventKey of ["mission_successful", "ufo_contact_detected", "lifting_off", "ramp_going_down", "copy", "moving", "reloading", "target_down", "im_hit"]) {
  if (!dialogue?.events?.[eventKey]) missing.push(`required recorded dialogue event missing: ${eventKey}`);
}
for (const style of ["steady_professional", "aggressive_hotshot", "grim", "nervous_but_determined"]) {
  if (!dialogue?.events?.moving?.variants?.[style]) missing.push(`movement dialogue style missing: ${style}`);
}
for (const [eventKey, style] of [["commander_action_required", "neutral"], ["skyranger_ready", "neutral"], ["copy", "steady_professional"]]) {
  const event = dialogue?.events?.[eventKey];
  const variant = event?.variants?.[style] || event?.variants?.neutral || event?.variants?.steady_professional || Object.values(event?.variants || {})[0];
  const sourcePath = path.join(dialogueDirectory, variant?.source || "");
  if (!variant?.takes?.length || !fs.existsSync(sourcePath)) continue;
  for (const take of variant.takes) {
    const energy = wavTakeEnergy(sourcePath, take);
    if (energy.samples > 12000 * 2 || energy.rms < 0.003 || energy.peak < 0.018) {
      missing.push(`voice test take below audibility floor: ${eventKey} at ${take.start}s`);
    }
  }
}

if (missing.length) {
  console.error("Project Aegis build seam check failed:");
  missing.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}

console.log(`Project Aegis build seam check passed for ${manifest.currentBuild}`);
