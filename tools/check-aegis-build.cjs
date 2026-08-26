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
  "CONTINUOUS_ISO_GROUND_RENDERING_AND_PERFORMANCE_PATCH",
  "tacticalThreePersistentBuildIsoGround",
  "tacticalThreeCellForWorldPosition",
  "tacticalContinuousIsoGroundBuildHealthResults",
  "Continuous Iso ground uses authoritative Small Medium and Large battlefield dimensions",
  "PROCEDURAL_BUILDING_WALL_CONNECTOR_INTEGRITY_PATCH",
  "tacticalStructuralCoverIndex",
  "tacticalStructuralConnectorOwnerKey",
  "tacticalStructuralWallConnectorIntegrityTest",
  "Generated and loaded building walls retain continuous connectors without closing doors or breaches",
  "TACTICAL_WORLD_CONTINUATION_TERRAIN_SKIRT_AND_HORIZON_SCENERY_PATCH",
  "tacticalThreePersistentBuildWorldContinuation",
  "tacticalWorldContinuationBuildHealthResults",
  "World continuation bounds scale from authoritative Small Medium and Large map dimensions",
  "INTELLIGENCE_GATED_FIELD_BEACON_SHIELD_OBJECTIVE_TEXT_PATCH",
  "tacticalBeaconShieldObjectiveTextIntelligenceGateContractTest",
  "Field Beacon objective text reveals shield doctrine only after observation",
  "TACTICAL_ARTICULATED_SOLDIER_FACING_PIVOT_AND_ORIENTATION_AUTHORITY_PATCH",
  "tacticalArticulatedSoldierFacingAngle",
  "tacticalArticulatedSoldierFacingPivotContractTest",
  "AEGIS articulated tactical facing pivot",
  "Articulated soldier facing remains authoritative across walking and stance-correct aiming poses",
  "TACTICAL_ARTICULATED_SOLDIER_RIGHT_HANDED_PRESENTATION_PATCH",
  "TACTICAL_ARTICULATED_SOLDIER_LOCAL_MIRROR_X",
  "tacticalArticulatedSoldierRightHandedPresentationContractTest",
  "Articulated AEGIS soldiers present the right-wrist weapon chain on their anatomical right side",
  "TACTICAL_ARTICULATED_AIM_POSE_RENDER_LIFECYCLE_PATCH",
  "TACTICAL_ARTICULATED_AIM_POSE_MIN_HOLD_MS",
  "tacticalArticulatedAimPoseHoldMs",
  "tacticalArticulatedAimPoseRenderLifecycleContractTest",
  "Persistent 3D shot invalidation visibly applies and holds stance-correct articulated aiming poses",
  "TACTICAL_ARTICULATED_STANDING_AIM_RIGHTWARD_BARREL_ALIGNMENT_PATCH",
  "TACTICAL_ARTICULATED_STANDING_AIM_RIGHT_YAW_OFFSET",
  "tacticalArticulatedSoldierRuntimeRootRotation",
  "tacticalArticulatedStandingAimRightwardAlignmentContractTest",
  "Standing Aim adds a local 90-degree rightward barrel-alignment yaw without changing tactical facing",
  "TACTICAL_PREVIOUS_NEXT_SOLDIER_CAMERA_RECENTER_PATCH",
  "tacticalPreviousNextSoldierCameraRecenterContractTest",
  "Previous and Next Soldier selection clears Iso pan offset and recenters on the selected unit",
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
  "Captured beacon endpoints generate persistent three-level alien bases with paired elevators and an offline command-core victory gate",
  "Sixteen procedural alien-base seeds keep every defender elevator and command-core approach reachable while layouts vary",
  "Alien-base 3D Iso deck controls focus the persistent camera and announce vertical transitions without changing tactical authority",
  "Crash-site Simulation resolves an empty UFO bay while Hybrid still rejects unresolved snapshots",
  "TACTICAL_EMPTY_CRASHED_UFO_BAY_VICTORY_PATCH",
  "tacticalEmptyCrashedUfoBayVictoryContractTest",
  "Empty crashed-UFO bays no longer block victory after authoritative alien elimination",
  "TACTICAL_SEEDED_SKYRANGER_LANDING_ORIENTATION_VARIETY_PATCH",
  "tacticalSkyrangerPlacementForHeading",
  "tacticalSkyrangerDirectionalStep",
  "tacticalSeededSkyrangerLandingAndOrientationVarietyContractTest",
  "Seeded Skyranger deployments vary edge and heading while preserving legal ramps extraction and multi-craft clearance",
  "GLOBALLY_SEEDED_OPENING_INCIDENT_PAIR_PATCH",
  "OPENING_INCIDENT_REGION_SITES",
  "generateGloballySeededOpeningIncidents",
  "globallySeededOpeningIncidentPairContractTest",
  "Opening incidents span every world region deterministically and always retain a viable one-base Skyranger response site",
  "Medium and large streamed battlefields retain outer-district building walls windows and authored floor alignment",
  "Mission victory dialogue has one mission-scoped owner across playback and terminal commit",
  "Patch-note history mutations remain inside the campaign component that owns the library",
  "Every AEGIS shot uses the firing soldier's current sightline and renders its verified target",
  "Final VIP extraction releases stale Skyranger guards across Manual Hybrid and streamed Simulation handoffs",
  "Every active VIP fire team keeps moving after an earlier team clears the Skyranger",
  "Newly spotted aliens interrupt playback and replan every remaining unplayed AEGIS action",
  "Escort columns make support traffic yield around exterior building corners and count only committed progress",
  "BEACON_LINKED_PROCEDURAL_MULTILEVEL_ALIEN_BASE_ASSAULT_PATCH",
  "ALIEN_BASE_VERTICAL_DECK_FOCUS_PRESENTATION_PATCH",
  "CRASH_SITE_AI_TERMINAL_STALL_RECOVERY_PATCH",
  "TACTICAL_PER_SHOOTER_VISIBILITY_AND_RENDERED_TARGET_SHOT_INVARIANT_PATCH",
  "TACTICAL_POST_EXTRACTION_RESCUE_DUTY_HANDOFF_PATCH",
  "TACTICAL_MULTI_FIRETEAM_VIP_RESCUE_TRAFFIC_PATCH",
  "TACTICAL_NEW_CONTACT_INTERRUPT_REMAINING_ROUND_REPLAN_PATCH",
  "TACTICAL_ESCORT_CORNER_MOBILE_TRAFFIC_YIELD_PATCH",
  "tacticalShotCommitVisibilityState",
  "tacticalShotPresentationFrame",
  "tacticalReleaseCompletedVipEscortState",
  "tacticalAiRescueActorOrder",
  "tacticalExtractionTrafficReservedCellKeys",
  "tacticalAiNewContactInterruptRecord",
  "tacticalEscortMobileTrafficYield",
  "tacticalMissionSource=String(TacticalMission)",
  "GEOSCAPE_GLOBE_TERMINATOR_UFO_VISUAL_PARITY_PATCH",
  "geoscapeUfoMarkerVisualState",
  "geoscapeUfoTravelHeadingDegrees",
  "geoscapeUfoMarkerOrientationState",
  "geoscapeDrawAlienCraftMarker",
  "Globe and Terminator Map share recognizable size- and damage-aware detected UFO markers",
  "GEOSCAPE_UFO_UPRIGHT_ORIENTATION_PATCH",
  "TACTICAL_ALIEN_LAND_VEHICLE_PATHING_INTEGRITY_PATCH",
  "geoscapeUfoUprightOrientationContractTest",
  "tacticalAlienLandVehiclePathingIntegrityContractTest",
  "Detected UFO bodies stay upright while an independent cue preserves travel heading",
  "Aliens route spawn repair and playback around every intact land-vehicle footprint while destroyed vehicles remain passable",
  "TACTICAL_ORPHANED_ESCORT_AND_SKYRANGER_INGRESS_RECOVERY_PATCH",
  "TACTICAL_COVERED_POSITION_REPEAT_FIRE_PATCH",
  "tacticalNormalizeOrphanedEscortState",
  "tacticalVipExtractionIngressYield",
  "tacticalAiCoveredFiringHoldState",
  "tacticalAiCoveredFireActionBudget",
  "Orphaned VIP escorts release immediately and crowded Skyranger ingress yields without overlap",
  "AEGIS soldiers hold useful cover and spend legal TU on bounded repeat fire",
  "const clearVehicles = inside && footprint.every",
  "isHardCoverAt(arrivalCovers",
  "contactReplanHold",
  "actionOrderIds:Array.from(roundActedIds)",
  "postExtractionHandoffUnits",
  "TACTICAL_MEDIUM_LARGE_BUILDING_PERIMETER_RESTORATION_PATCH",
  "tacticalRestoreMissionSizedBuildingCovers",
  "Restoring outer-district building perimeters",
  "tacticalAiShouldContinueUfoBay",
  "tacticalMissionResultHasTerminalOutcome",
  "no mission result was committed",
  "tacticalAlienBaseBattlefield",
  "data-aegis-alien-base-deck-focus-css",
  "data-aegis-alien-base-deck-stack",
  "data-aegis-alien-base-level-transition",
  "aegis-linked-insertion-beacon",
  "alien-base-elevator-pad",
  "alien-field-beacon-command-core",
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
  "Tactical lighting stays bounded while day/night visibility uses the indexed hot path",
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
  "VIP extraction paths never re-enter cleared buildings after outdoor egress",
  "TACTICAL_VIP_EXTRACTION_NO_BUILDING_REENTRY_PATCH",
  "tacticalAiExtractionNoReentryRoute",
  "tacticalBuildingIdsForPath",
  "startsOnCorridor",
  "preventBuildingReentry:true",
  "formationBuildingAllowed",
  "escortHoldSteps",
  "held the extraction corridor",
  "Separated VIPs release after one full no-sight round while original teams recall and extraction guards keep ramps clear",
  "TACTICAL_ESCORT_LOST_CONTACT_AND_EXTRACTION_TRAFFIC_PATCH",
  "tacticalResolveEscortContactRound",
  "tacticalEscortMaintainsContact",
  "escortLostContactRound",
  "escortRecallCivilianId",
  "tacticalEscortExtractionOutsideCells",
  "fireTeamExtractionGuardActive",
  "fireTeamExtractionEscortCleared",
  "another fire team may take over first",
  "Alien Field Beacons adapt with a ballistic-blocking kinetic shield after three destroyed devices",
  "TACTICAL_ADAPTIVE_ALIEN_BEACON_KINETIC_SHIELD_PATCH",
  "tacticalAlienBeaconShieldForCampaign",
  "tacticalUnitCanBreachAlienBeaconShield",
  "beaconStrikeAssigned && fireTeamLeader?.id === human.id",
  "beaconShooterInsideField || tacticalWeaponCanBreachAlienBeaconShield",
  "alien-beacon-kinetic-shield",
  "K-SHIELD",
  "kinetic shield",
  "Alien Field Beacons upgrade to a combined ballistic-and-energy shield after six destroyed devices",
  "TACTICAL_ADAPTIVE_ALIEN_BEACON_COMBINED_SHIELD_PATCH",
  "combinedShieldDestroyedThreshold",
  "tacticalWeaponCanBreachAlienBeaconShield",
  "tacticalAlienBeaconThreeShieldMesh",
  "alien-beacon-combined-shield",
  "K+E SHIELD",
  "beaconNeedsGrenade",
  "Reinforcement arrivals preserve the mission's original beacon and crashed-UFO landmarks",
  "TACTICAL_REINFORCEMENT_LANDMARK_PERSISTENCE_FIX_PATCH",
  "tacticalPreserveReinforcementLandmarks",
  "candidate?.crashedUfo",
  "Confirmed beacon objectives hold eliminate-force victory until neutralization",
  "TACTICAL_CONFIRMED_BEACON_MISSION_COMPLETION_GATE_PATCH",
  "tacticalAlienBeaconObjectiveState",
  "tacticalAiShouldContinueBeacon",
  "tacticalAiBeaconSearchTarget",
  "No available beacon-breach capability",
  "data-aegis-beacon-objective",
  "result.beaconObjective=tacticalBeaconObjective",
  "Alien Field Beacon shields cover seven passable hexes, protect arrivals, and permit close assaults",
  "TACTICAL_ALIEN_BEACON_SEVEN_HEX_SHIELD_PATCH",
  "tacticalAlienBeaconShieldCells",
  "tacticalAlienBeaconShieldShotState",
  "tacticalAlienBeaconCloseAssaultMovePlan",
  "tacticalFireTeamHasExternalAlienBeaconBreach",
  "alienBeaconShieldedAtArrival",
  "data-aegis-beacon-shield-cell",
  "alien-beacon-seven-hex-shield",
  "Mandatory VIP rescue quotas resolve as failures while preserving per-rescue partial credit",
  "TACTICAL_MANDATORY_VIP_RESCUE_QUOTA_RESOLUTION_PATCH",
  "TACTICAL_MANDATORY_VIP_RESCUE_QUOTA_RESOLUTION_CONTRACT",
  "canResolveFailure",
  "terminalAfterHuman.objectiveFailed",
  "terminalAtTurnStart.objectiveFailed",
  "Mission failed - VIP rescue quota missed",
  "Fire-team VIP routes treat formation supports as mobile traffic and enter through valid building openings",
  "TACTICAL_FIRE_TEAM_VIP_BUILDING_INGRESS_FIX_PATCH",
  "TACTICAL_FIRE_TEAM_VIP_BUILDING_INGRESS_CONTRACT",
  "mobileFireTeamIds",
  "routeUnitsForMovement",
  "fireTeamTrafficIgnored",
  "SAVE_LOAD_PATCH_NOTES_VERSION_HISTORY_PATCH",
  "PATCH_NOTES_HISTORY",
  "PatchNotesLibraryScreen",
  "data-aegis-open-patch-notes",
  "data-aegis-patch-notes",
  "data-aegis-selected-patch",
  "TACTICAL_SHOT_RESULT_STACK_AND_TOGGLE_PATCH",
  "TACTICAL_SHOT_RESULT_VISIBLE_MS=10000",
  "TACTICAL_SHOT_RESULT_FADE_MS",
  "tacticalShotResultStackPush",
  "data-aegis-shot-results-stack",
  "data-aegis-shot-result",
  "data-aegis-toggle-shot-results",
  "TACTICAL_AI_SEQUENTIAL_MOVEMENT_PRESENTATION_FIX_PATCH",
  "tacticalPlaybackActionMovementIds",
  "tacticalPlaybackUnitMayAnimate",
  "actionMovementIds",
  "TACTICAL_HYBRID_FIRE_TEAM_COMMAND_PATCH",
  "Hybrid Fire-Team Command",
  "fireTeamCommandPreferredTargetId",
  "tacticalFireTeamCommandShotTarget",
  "supporting soldiers retain standard formation",
  "AI fallback - nearest visible alien",
  "TACTICAL_THREE_ARMOR_MATCHED_HELMETS_PATCH",
  "addTacticalSoldierThreeHelmet",
  "Armor-matched tactical helmet",
  "helmet-${armorHex}",
  "BARRACKS_TRANSFER_BUTTON_AND_CONFIRMATION_PATCH",
  "SoldierTransferControls",
  "data-aegis-soldier-transfer-options",
  "data-aegis-soldier-transfer-confirmation",
  "Confirm Troop Transfer",
  "TACTICAL_HYBRID_LEADER_CONTROL_ROUND_PATCH",
  "GEOSCAPE_COLLAPSIBLE_ACTIVE_UFO_LIST_PATCH",
  "GEOSCAPE_ACTIVE_UFO_INTERCEPTION_MODAL_PATCH",
  "TACTICAL_HYBRID_SUPPORT_FULL_TU_CATCH_UP_PATCH",
  "TACTICAL_HYBRID_ESCORT_PROMPT_MODE_PRESERVATION_PATCH",
  "TACTICAL_HYBRID_OPENING_ESCORT_SUPPORT_FOLLOW_FIX_PATCH",
  "TACTICAL_HYBRID_AGGRESSIVE_FLANKING_AND_SUPPORT_MOVEMENT_FIX_PATCH",
  "tacticalHybridFireTeamLeaders",
  "tacticalHybridMarkPriorityTarget",
  "tacticalHybridPrepareAiRoundUnits",
  "tacticalHybridRefreshPlayerTurnUnits",
  "hybridPlayerControlledLead",
  "endHybridBattleTurn",
  "Hybrid AI: On",
  "Prev Fire Team",
  "Next Fire Team",
  "Run Hybrid AI Turn",
  "data-aegis-hybrid-battle-mode",
  "data-aegis-active-ufo-list-toggle",
  "data-aegis-active-ufo-list-modal",
  "data-aegis-active-ufo-list-scroll",
  "UFO Interception Board",
  "activeUfoListOpen",
  "tacticalHybridSupportCatchUpState",
  "Formation Catch-Up",
  "formation-catch-up",
  "Hybrid supports spend full movement TU when their selected reserve would leave them behind formation",
  "tacticalEscortSupportContinuationMode",
  "restartHybridAiAfterEscortDecision",
  "Hybrid AI remains active; fire-team-leader control will return after this support round",
  "Hybrid escort-contact decisions preserve Hybrid AI leader control",
  "hybridEscortLeaderHold",
  "hybridEscortSupportStays",
  "plan.formationFollow===true",
  "Opening Hybrid escort rounds hold the leader while supports spend their own TU to follow",
  "DEFERRED_BUILD_HEALTH_EXECUTION_PATCH",
  "GEOSCAPE_STABLE_INTERVAL_LIFECYCLE_PATCH",
  "runCriticalBootSmokeTests",
  "AEGIS_FULL_BUILD_HEALTH_RUNNER",
  "AEGIS_DEFERRED_SELF_TEST_RESULTS",
  "runDeferredSelfTests",
  "executeDeferredFullBuildHealth",
  "scheduleDeferredFullBuildHealth",
  "requestIdleCallback",
  "__AEGIS_REFRESH_BUILD_HEALTH",
  "geoscapeAdvanceRef.current=advanceGeoscapeTimeByMinutes",
  "geoscapeAdvanceRef.current(geoscapeTickMinutes)",
  "[geoscapeClockRunning,geoscapeTickMinutes,screen,gameOver]",
  "Full Build Health waits for the diagnostics panel while critical boot smoke stays synchronous",
  "Geoscape clock owns one stable interval across simulation state updates",
  "TACTICAL_THREE_PERSISTENT_RENDERER_PATCH",
  "TACTICAL_THREE_AI_FOG_SHADING_FIX_PATCH",
  "TACTICAL_VISIBILITY_OBSERVER_AND_TERRAIN_CACHE_PATCH",
  "TACTICAL_2D_CELL_RENDER_INDEX_PATCH",
  "TACTICAL_THREE_LIVING_UNIT_POSE_HOTFIX",
  "TACTICAL_VIP_QUOTA_DEATH_FLAG_TERMINAL_FIX",
  "BUILD_HEALTH_AND_RUNTIME_HOTPATH_HARDENING_PATCH",
  "HOVER_HELP_DETAIL_DELAY_AND_TOGGLE_PATCH",
  "TACTICAL_THREE_RENDER_KEY_MEMOIZATION_PATCH",
  "TACTICAL_ALIEN_CRAFT_INTERIOR_HULL_OCCLUSION_PATCH",
  "PRECOMPILED_EMBEDDED_TAILWIND_CSS_PATCH",
  "TAILWIND_CLASS_INTEGRITY_CLEANUP_PATCH",
  "aegis-tailwind-precompiled",
  "tailwindcss v3.4.17",
  "precompiledTailwindAndStyleIntegrityContractTest",
  "ARCHITECTURAL_STABLE_SETTINGS_COMPONENT_BOUNDARIES_PATCH",
  "stableSettingsComponentBoundariesContractTest",
  "RangeSliderStyles.displayName",
  "ReinforcementDifficultyPanel.displayName",
  "IncidentMapLimitPanel.displayName",
  "ARCHITECTURAL_STABLE_CAMPAIGN_LIST_BOUNDARIES_PATCH",
  "stableCampaignListBoundariesContractTest",
  "NotificationStack.displayName",
  "SaveSlotCards.displayName",
  "AutoSaveSlotCards.displayName",
  "CouncilReviewSlidesModal.displayName",
  "ARCHITECTURAL_STABLE_TRANSIENT_OVERLAY_BOUNDARIES_PATCH",
  "stableTransientOverlayBoundariesContractTest",
  "EventSpeedPromptModal.displayName",
  "BackupReminderModal.displayName",
  "SelfTestOverlay.displayName",
  "ARCHITECTURAL_STABLE_CAMPAIGN_CONFIRMATION_BOUNDARIES_PATCH",
  "stableCampaignConfirmationBoundariesContractTest",
  "NewGameConfirmModal.displayName",
  "SurrenderConfirmModal.displayName",
  "EndMonthConfirmModal.displayName",
  "ARCHITECTURAL_STABLE_OPERATIONAL_APPROVAL_BOUNDARIES_PATCH",
  "stableOperationalApprovalBoundariesContractTest",
  "UnderstrengthMissionConfirmModal.displayName",
  "WorkshopFundingConfirmModal.displayName",
  "FacilityBuildConfirmModal.displayName",
  "ARCHITECTURAL_STABLE_MISSION_LAUNCH_CONFIRMATION_BOUNDARY_PATCH",
  "stableMissionLaunchConfirmationBoundaryContractTest",
  "MissionLaunchConfirmModal.displayName",
  "data-aegis-mission-launch-confirmation",
  "ARCHITECTURAL_STABLE_STRATEGIC_INCIDENT_ROUTE_BOUNDARIES_PATCH",
  "stableStrategicIncidentRouteBoundariesContractTest",
  "IncidentListModal.displayName",
  "IncidentDetailsModal.displayName",
  "ActiveAircraftRouteTimelinePanel.displayName",
  "data-aegis-incident-priority-board",
  "data-aegis-incident-details-modal",
  "data-aegis-active-aircraft-route-timeline",
  "TACTICAL_THREE_ISO_NIGHT_VIBRANCE_PATCH",
  "tacticalThreeNightPresentationProfile",
  "tacticalThreePersistentApplyNightPresentation",
  "tacticalThreePersistentApplyIsoNightMaterialLift",
  "tacticalThreeIsoNightVibranceContractTest",
  "aegisIsoNightVibrance",
  "TACTICAL_THREE_ISO_COLOR_CONTROL_PATCH",
  "TACTICAL_THREE_ISO_COLOR_STORAGE_KEY",
  "normalizeTacticalThreeIsoColor",
  "readTacticalThreeIsoColor",
  "writeTacticalThreeIsoColor",
  "TacticalThreeIsoColorControl.displayName",
  "data-aegis-tactical-three-iso-color-control",
  "tacticalThreePersistentApplyIsoColor",
  "tacticalThreeIsoColorControlContractTest",
  "aegisIsoColor",
  "Player-adjustable 3D Iso Color persists across screens and changes only the persistent Iso canvas presentation",
  "start-tactical-three-iso-color",
  "menu-tactical-three-iso-color",
  "tactical-three-iso-color-live",
  "TACTICAL_THREE_ISO_NIGHT_BRIGHTNESS_CONTROL_PATCH",
  "TACTICAL_THREE_ISO_NIGHT_BRIGHTNESS_STORAGE_KEY",
  "normalizeTacticalThreeIsoNightBrightness",
  "readTacticalThreeIsoNightBrightness",
  "writeTacticalThreeIsoNightBrightness",
  "TacticalThreeIsoNightBrightnessControl.displayName",
  "data-aegis-tactical-three-iso-night-brightness-control",
  "tacticalThreeIsoNightBrightnessPresentation",
  "tacticalThreeIsoNightBrightnessControlContractTest",
  "aegisIsoNightBrightness",
  "aegisIsoNightBrightnessMode",
  "aegisIsoNightExposure",
  "aegisIsoNightAmbient",
  "aegisIsoFillIntensity",
  "aegisIsoMaterialLift",
  "aegisIsoLocalLightScale",
  "3D Iso Night Brightness lifts renderer exposure and ambient shadows without changing tactical illumination",
  "start-tactical-three-iso-night-brightness",
  "menu-tactical-three-iso-night-brightness",
  "tactical-three-iso-night-brightness-live",
  "TACTICAL_LIVE_VEHICLE_FOOTPRINT_MOVEMENT_INTEGRITY_PATCH",
  "tacticalLiveLandVehicleFootprintKeySet",
  "tacticalMovementCommitCellState",
  "tacticalThreeCoverWorldAnchor",
  "tacticalLiveVehicleFootprintMovementIntegrityContractTest",
  "Live land-vehicle footprints block every movement commit and align the persistent 3D body with its authoritative cells",
  "TACTICAL_DEFAULT_CIVILIAN_ESCORT_SUPPORT_DOCTRINE_PATCH",
  "TACTICAL_ESCORT_SUPPORT_DOCTRINES",
  "normalizeTacticalEscortSupportDoctrine",
  "tacticalApplyEscortSupportDoctrine",
  "TacticalEscortSupportDoctrineControl",
  "battle-escort-support-doctrine",
  "command-map-escort-support-doctrine",
  "Ask When Contact Is Spotted",
  "Stay With Escort",
  "Engage Spotted Aliens",
  "tacticalDefaultCivilianEscortSupportDoctrineContractTest",
  "Mission escort doctrine supports Ask, Stay, and Engage defaults without changing manual or Hybrid command ownership",
  "TACTICAL_REINFORCEMENT_SOURCE_PRIORITY_AND_UFO_BAY_CLEARANCE_PATCH",
  "TACTICAL_UFO_BAY_CLEARANCE_PHASES",
  "tacticalCrashedUfoBayRecord",
  "tacticalUfoBayClearanceState",
  "tacticalReinforcementSourceObjectiveState",
  "tacticalAiUfoBayInspectionTeamId",
  "tacticalUfoBayInspectionActionState",
  "TacticalReinforcementSourceStatus",
  "data-aegis-reinforcement-source-objective",
  "Inspect UFO Bay",
  "UFO Bay Clear",
  "reinforcement-source-priority",
  "tacticalReinforcementSourcePriorityAndUfoBayClearanceContractTest",
  "Confirmed UFO bays remain objectives while aliens live but total alien elimination clears an empty wreck",
  "TACTICAL_COMMAND_MAP_AUTONOMOUS_SEARCH_RESUME_HOTFIX",
  "tacticalReleaseCompletedCommandMapWaypoint",
  "tacticalCommandMapAutonomousSearchResumeContractTest",
  "the temporary order was released and autonomous search resumed",
  "quiet arrival releases the order back to autonomous search",
  "AEGIS_HOVER_HELP_POINTER_DELAY_MS=3000",
  "data-aegis-hover-help-toggle",
  "aegisHoverHelpDescriptionIsGeneric",
  "const unitsKey=useMemo",
  "const coversKey=useMemo",
  "runtime.unitLightingPresentationKey===presentationKey",
  "saucer-bay-roof-shroud",
  "hullThetaLength",
  "runCombinedFullBuildHealthTests",
  "AEGIS_RENDER_SCOPED_BUILD_HEALTH_RUNNER",
  "AEGIS_POST_DEFERRED_BUILD_HEALTH_RUNNER",
  "loopWakeRef.current",
  "TacticalIsoThreeViewPersistent",
  "data-aegis-persistent-three-tactical",
  "dataset.aegisTacticalRendererId",
  "tacticalThreePersistentInvalidationPlan",
  "tacticalThreePersistentBuildTerrain",
  "tacticalThreePersistentRevealAllGround",
  "aegisFogUnseenCount",
  "tacticalStaticTerrainForCell",
  "tacticalCachedVisibilityContext",
  "tacticalVisibleCellsForObserverCached",
  "tacticalVisibilityCacheContractTest",
  "Tactical visibility reuses cover contexts and unchanged observer sight while 2D terrain stays cached",
  "tacticalIndexUnitsByCell",
  "tacticalIndexActiveCoverByCell",
  "tacticalIndexFloorItemsByCell",
  "tacticalIndexMovementPathByCell",
  "tacticalCellRenderIndexContractTest",
  "tacticalUnitByCell.get(cellKey)",
  "tacticalCoverByCell.get(cellKey)",
  "tacticalFloorItemsByCell.get(cellKey)",
  "tacticalMovementPathByCell.get(cellKey)",
  "2D tactical cells use indexed units cover floor items and movement paths",
  "tacticalThreePersistentUnitRestingRotationZ",
  "tacticalThreePersistentUnitPoseContractTest",
  "node.userData.alive=unit.hp>0",
  "Persistent 3D animation keeps every living faction upright",
  "tacticalVipQuotaDeathFlagTerminalContractTest",
  "civilian.alive === false || Number(civilian.hp) <= 0",
  "civilian.alive !== false && Number(civilian.hp) > 0",
  "Dead VIP flags terminate impossible rescue quotas without an AI search loop",
  "tacticalThreePersistentUpdateUnits",
  "tacticalThreePersistentApplyFacing",
  "runtime.unitNodes",
  "tacticalThreePersistentDisposeRuntime",
  "Three.js tactical renderer preserves scene caches and invalidates only changed layers",
  "Geoscape Active UFOs opens a centered scrollable interception board",
  "tacticalHybridCombatTargetForFireTeam",
  "tacticalFireTeamFormationMovePlan",
  "tacticalHybridAggressiveFlankMovePlan",
  "hybridCombatTarget",
  "hybridFlankMove",
  "Hybrid support soldiers move to enemy-relative left and right flanks with formation fallback",
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
  "TACTICAL_MISSION_VISIBILITY_MUSIC_CROSSFADE_PATCH",
  "ENHANCED_SFX_LIBRARY_AND_PER_SOUND_MIX_PATCH",
  "ENHANCED_SFX_PER_SOUND_DOUBLE_BOOST_PATCH",
  "ENHANCED_SFX_PER_SOUND_MULTIPLIER_PATCH",
  "ENHANCED_SFX_LEVEL_STORAGE_KEY",
  "ENHANCED_SFX_BOOST_STORAGE_KEY",
  "ENHANCED_SFX_LIBRARY",
  "normalizeEnhancedSfxLevels",
  "readEnhancedSfxLevels",
  "writeEnhancedSfxLevels",
  "normalizeEnhancedSfxBoosts",
  "readEnhancedSfxBoosts",
  "writeEnhancedSfxBoosts",
  "enhancedSfxBoostMultiplier",
  "enhancedSfxMixGain",
  "enhancedSfxDestination",
  "previewEnhancedSfx",
  "EnhancedSfxLibraryScreen",
  "data-aegis-open-sfx-library",
  "data-aegis-enhanced-sfx-library",
  "data-aegis-sfx-key",
  "data-aegis-sfx-boost",
  "data-aegis-sfx-boost-multiplier",
  "[1,2,3,4].map",
  "1×, 2×, 3×, and 4× boosts",
  "Reset Mix",
  "Window Shatter",
  "Save / Load Enhanced SFX Library previews every routed sound and persists levels plus individual 1x through 4x multipliers",
  "ALTERNATE_MUSIC_AUDIO_URLS",
  "CONTACT_IN_THE_DARK_MISSION_SEGMENTS",
  "CONTACT_IN_THE_DARK_CROSSFADE_MS",
  "tacticalMissionHasVisibleAliens",
  "setContactInTheDarkSegment",
  "mediaFadingOut",
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
  "All successful tactical mission types animate surviving soldiers after victory",
  "Classic lineup victory dance moves paper dolls without moving soldier cards",
  "Day-night terminator map follows Geoscape clock and preserves operational layers",
  "Recorded command aircraft and soldier dialogue uses segmented cached playback",
  "Recorded computer and aircraft dialogue use distinct transmission effects",
  "Geoscape computer and aircraft dialogue share an ordered queue",
  "Base computer voice uses metallic robotic processing",
  "Soldier dialogue uses radio static bookends and gates strategic aircraft playback",
  "Three.js tactical ground shares exact 2D cell gradients",
  "Three.js tactical hex centers and footprints match the 2D board",
  "Three.js tactical ground uses stable non-overlapping surfaces over one lower terrain bed",
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
const patchHistoryOwnerStart = html.indexOf("function AlienResponseCommand");
const patchHistoryOwnerEnd = html.indexOf("}const AEGIS_RUN_SELF_TESTS_BEFORE_2355_PATCH=runSelfTests;", patchHistoryOwnerStart);
const patchHistoryDeclaration = html.indexOf("const PATCH_NOTES_HISTORY=", patchHistoryOwnerStart);
const patchHistoryLastMutation = html.lastIndexOf("PATCH_NOTES_HISTORY.unshift");
if (patchHistoryOwnerStart < 0 || patchHistoryOwnerEnd < 0 || patchHistoryDeclaration < patchHistoryOwnerStart || patchHistoryDeclaration > patchHistoryOwnerEnd || patchHistoryLastMutation > patchHistoryOwnerEnd) {
  missing.push("all PATCH_NOTES_HISTORY mutations must remain inside AlienResponseCommand lexical scope");
}
const resolveMissionStart = html.indexOf("function resolveMission(");
const resolveMissionEnd = html.indexOf("function tacticalShotColor", resolveMissionStart);
const resolveMissionSource = resolveMissionStart >= 0 ? html.slice(resolveMissionStart, resolveMissionEnd > resolveMissionStart ? resolveMissionEnd : undefined) : "";
if (!resolveMissionSource || resolveMissionSource.includes('label: "Long-range contact"')) {
  missing.push("synthetic long-range contact shots must not bypass per-shooter visibility or renderer authority");
}
if (!html.slice(patchHistoryDeclaration, patchHistoryOwnerEnd).includes('title:"Per-Shooter Visibility + VIP Extraction Handoff"')) {
  missing.push("the current visibility and VIP extraction handoff patch note must remain inside its campaign owner");
}
if (!html.slice(patchHistoryDeclaration, patchHistoryOwnerEnd).includes('title:"Multi-Fire-Team VIP Rescue Traffic"')) {
  missing.push("the current multi-fire-team VIP rescue traffic patch note must remain inside its campaign owner");
}

for (const obsoleteNeedle of [
  "const[lastShotFeedback,setLastShotFeedback]",
  "shotFeedbackTimerRef",
  "function toggleEnhancedSfxBoost",
  "current[key]!==true",
  "Boost ×2 On",
]) {
  if (html.includes(obsoleteNeedle)) missing.push(`obsolete current-patch implementation remains: ${obsoleteNeedle}`);
}
if (html.includes("useEffect(()=>()=>cancelAiPlaybackTimers(),[])")) {
  missing.push("duplicate tactical playback-only cleanup hooks must remain consolidated");
}
if (html.includes("runSelfTestsWith2225Patch") || html.includes("runSelfTestsWith2315Patch")) {
  missing.push("render-scoped Geoscape diagnostics must not reassign the boot test runner");
}
if (html.includes('return`Click to activate “${clean}”.`') || html.includes('description||"Click to activate this control."')) {
  missing.push("generic hover activation descriptions must remain removed");
}
const alienCraftModelStart = html.indexOf("function addTacticalSkyrangerThreeModel");
const alienCraftModelEnd = html.indexOf("const AEGIS_TACTICAL_DEPLOYMENT_WITH_FIELD_BEACON_FINAL", alienCraftModelStart);
const alienCraftModelSource = alienCraftModelStart >= 0 ? html.slice(alienCraftModelStart, alienCraftModelEnd > alienCraftModelStart ? alienCraftModelEnd : undefined) : "";
if (!alienCraftModelSource || alienCraftModelSource.includes("alienInteriorMaterial.depthTest=false") || alienCraftModelSource.includes("alienInteriorGlow.depthTest=false") || alienCraftModelSource.includes("part.renderOrder=55")) {
  missing.push("alien craft interior meshes must remain depth-tested behind the bounded hull aperture");
}
if (html.includes('data-offline-dependency="tailwindcss"')) {
  missing.push("runtime Tailwind compiler must not return to the playable startup path");
}
const precompiledTailwindMatch = html.match(/<style id="aegis-tailwind-precompiled"[^>]*>([\s\S]*?)<\/style>/);
const precompiledTailwindCss = precompiledTailwindMatch?.[1] || "";
if (precompiledTailwindCss.length < 70000 || !precompiledTailwindCss.includes("tailwindcss v3.4.17") || !precompiledTailwindCss.includes(".lg\\:grid-cols-\\[minmax\\(0\\2c 1fr\\)_320px\\]")) {
  missing.push("embedded precompiled Tailwind inventory must retain base, responsive, state, and arbitrary-value utilities");
}
for (const malformedClass of ["bg-amber-950/350", "bg-cyan-950/300", "bg-slate-900/800", "bg-red-950/350", "bg-yellow-950/45/90", "bg-orange-950/45/90", "bg-sky-950/45/90", "bg-green-950/45/90"]) {
  if (html.includes(malformedClass)) missing.push(`malformed Tailwind opacity utility remains: ${malformedClass}`);
}
const campaignComponentIndex = html.indexOf("function AlienResponseCommand(){");
for (const component of ["RangeSliderStyles", "ReinforcementDifficultyPanel", "IncidentMapLimitPanel"]) {
  const declaration = `const ${component}=React.memo(`;
  const declarationIndex = html.indexOf(declaration);
  if (declarationIndex < 0 || campaignComponentIndex < 0 || declarationIndex > campaignComponentIndex) {
    missing.push(`${component} must remain a memoized module-scope boundary outside AlienResponseCommand`);
  }
  if (html.indexOf(declaration, declarationIndex + declaration.length) >= 0) {
    missing.push(`${component} must have exactly one stable declaration`);
  }
}
for (const component of ["NotificationStack", "SaveSlotCards", "AutoSaveSlotCards", "CouncilReviewSlidesModal"]) {
  const declaration = `const ${component}=React.memo(`;
  const declarationIndex = html.indexOf(declaration);
  if (declarationIndex < 0 || campaignComponentIndex < 0 || declarationIndex > campaignComponentIndex) {
    missing.push(`${component} must remain a memoized module-scope boundary outside AlienResponseCommand`);
  }
  if (html.indexOf(declaration, declarationIndex + declaration.length) >= 0) {
    missing.push(`${component} must have exactly one stable declaration`);
  }
}
for (const component of ["EventSpeedPromptModal", "BackupReminderModal", "SelfTestOverlay"]) {
  const declaration = `const ${component}=React.memo(`;
  const declarationIndex = html.indexOf(declaration);
  if (declarationIndex < 0 || campaignComponentIndex < 0 || declarationIndex > campaignComponentIndex) {
    missing.push(`${component} must remain a memoized module-scope boundary outside AlienResponseCommand`);
  }
  if (html.indexOf(declaration, declarationIndex + declaration.length) >= 0) {
    missing.push(`${component} must have exactly one stable declaration`);
  }
}
for (const component of ["NewGameConfirmModal", "SurrenderConfirmModal", "EndMonthConfirmModal"]) {
  const declaration = `const ${component}=React.memo(`;
  const declarationIndex = html.indexOf(declaration);
  if (declarationIndex < 0 || campaignComponentIndex < 0 || declarationIndex > campaignComponentIndex) {
    missing.push(`${component} must remain a memoized module-scope boundary outside AlienResponseCommand`);
  }
  if (html.indexOf(declaration, declarationIndex + declaration.length) >= 0) {
    missing.push(`${component} must have exactly one stable declaration`);
  }
}
for (const component of ["UnderstrengthMissionConfirmModal", "WorkshopFundingConfirmModal", "FacilityBuildConfirmModal"]) {
  const declaration = `const ${component}=React.memo(`;
  const declarationIndex = html.indexOf(declaration);
  if (declarationIndex < 0 || campaignComponentIndex < 0 || declarationIndex > campaignComponentIndex) {
    missing.push(`${component} must remain a memoized module-scope boundary outside AlienResponseCommand`);
  }
  if (html.indexOf(declaration, declarationIndex + declaration.length) >= 0) {
    missing.push(`${component} must have exactly one stable declaration`);
  }
}
for (const component of ["MissionLaunchConfirmModal"]) {
  const declaration = `const ${component}=React.memo(`;
  const declarationIndex = html.indexOf(declaration);
  if (declarationIndex < 0 || campaignComponentIndex < 0 || declarationIndex > campaignComponentIndex) {
    missing.push(`${component} must remain a memoized module-scope boundary outside AlienResponseCommand`);
  }
  if (html.indexOf(declaration, declarationIndex + declaration.length) >= 0) {
    missing.push(`${component} must have exactly one stable declaration`);
  }
}
for (const component of ["IncidentListModal", "IncidentDetailsModal", "ActiveAircraftRouteTimelinePanel"]) {
  const declaration = `const ${component}=React.memo(`;
  const declarationIndex = html.indexOf(declaration);
  if (declarationIndex < 0 || campaignComponentIndex < 0 || declarationIndex > campaignComponentIndex) {
    missing.push(`${component} must remain a memoized module-scope boundary outside AlienResponseCommand`);
  }
  if (html.indexOf(declaration, declarationIndex + declaration.length) >= 0) {
    missing.push(`${component} must have exactly one stable declaration`);
  }
}
for (const component of ["TacticalThreeIsoColorControl", "TacticalThreeIsoNightBrightnessControl"]) {
  const declaration = `const ${component}=React.memo(`;
  const declarationIndex = html.indexOf(declaration);
  if (declarationIndex < 0 || campaignComponentIndex < 0 || declarationIndex > campaignComponentIndex) {
    missing.push(`${component} must remain a memoized module-scope boundary outside AlienResponseCommand`);
  }
  if (html.indexOf(declaration, declarationIndex + declaration.length) >= 0) {
    missing.push(`${component} must have exactly one stable declaration`);
  }
}
if (!html.includes('React.createElement(IncidentListModal,{entries:incidentPriorityEntries,onClose:closeIncidentPriorityBoard,onSelect:selectIncidentFromPriorityBoard})')) {
  missing.push("incident priority board must receive memoized entries and controller callbacks explicitly");
}
if (!html.includes('React.createElement(IncidentDetailsModal,{presentation:incidentDetailsPresentation,onPlan:planIncidentResponse,onClose:closeIncidentDetails})')) {
  missing.push("incident details must receive a controller-built presentation snapshot and actions explicitly");
}
if (!html.includes('React.createElement(ActiveAircraftRouteTimelinePanel,{interceptorTravel:interceptorTravel,skyrangerTravels:skyrangerTravels})')) {
  missing.push("active aircraft route timeline must receive travel records explicitly");
}
if (!html.includes('night:{exposure:0.62,ambientScale:1.45,keyScale:1.28,rimIntensity:0.3,localLightScale:1.42}') || !html.includes('twilight:{exposure:0.72,ambientScale:1.16,keyScale:1.12,rimIntensity:0.3,localLightScale:1.22}')) {
  missing.push("3D Iso night and twilight vibrance profiles must retain their bounded presentation-only values");
}
if (!html.includes('pointLight.userData.aegisTacticalPresentationBaseIntensity=visualIntensity') || !html.includes('Math.max(4,localLight.radius*1.18)')) {
  missing.push("3D Iso local-light vibrance must scale intensity while preserving the existing PointLight distance");
}
if (!html.includes('const TACTICAL_THREE_ISO_COLOR_MIN=50;') || !html.includes('const TACTICAL_THREE_ISO_COLOR_MAX=200;') || !html.includes('const TACTICAL_THREE_ISO_COLOR_STEP=5;') || !html.includes('const TACTICAL_THREE_ISO_COLOR_DEFAULT=100;')) {
  missing.push("3D Iso Color must retain its 50%-200% range, 5% step, and neutral 100% default");
}
if (!html.includes('if(value===null||value===undefined||value==="")return TACTICAL_THREE_ISO_COLOR_DEFAULT') || !html.includes('canvas.style.filter=tacticalThreeIsoColorFilter(applied,isoView)')) {
  missing.push("3D Iso Color must default missing storage to 100% and use one absolute canvas presentation filter");
}
if (!html.includes('React.createElement(TacticalThreeIsoColorControl,{controlId:"start-tactical-three-iso-color"})') || !html.includes('React.createElement(TacticalThreeIsoColorControl,{controlId:"menu-tactical-three-iso-color"})') || !html.includes('controlId:"tactical-three-iso-color-live"')) {
  missing.push("3D Iso Color controls must remain available on the start screen, Save / Load screen, and live Iso toolbar");
}
if (!html.includes('tacticalThreePersistentApplyIsoColor(runtime,props)') || !html.includes('renderQuality,isoColor,isoNightBrightness,soldierModelStyle,isoGroundMode,fitMap')) {
  missing.push("3D Iso Color must update through the persistent renderer dynamic presentation path");
}
if (!html.includes('const TACTICAL_THREE_ISO_NIGHT_BRIGHTNESS_MIN=50;') || !html.includes('const TACTICAL_THREE_ISO_NIGHT_BRIGHTNESS_MAX=200;') || !html.includes('const TACTICAL_THREE_ISO_NIGHT_BRIGHTNESS_STEP=5;') || !html.includes('const TACTICAL_THREE_ISO_NIGHT_BRIGHTNESS_DEFAULT=100;')) {
  missing.push("3D Iso Night Brightness must retain its 50%-200% range, 5% step, and neutral 100% default");
}
if (!html.includes('if(value===null||value===undefined||value==="")return TACTICAL_THREE_ISO_NIGHT_BRIGHTNESS_DEFAULT') || !html.includes('localStorage.setItem(TACTICAL_THREE_ISO_NIGHT_BRIGHTNESS_STORAGE_KEY,String(normalized))')) {
  missing.push("3D Iso Night Brightness must default missing storage to 100% and persist as a device preference");
}
if (!html.includes('React.createElement(TacticalThreeIsoNightBrightnessControl,{controlId:"start-tactical-three-iso-night-brightness"})') || !html.includes('React.createElement(TacticalThreeIsoNightBrightnessControl,{controlId:"menu-tactical-three-iso-night-brightness"})') || !html.includes('controlId:"tactical-three-iso-night-brightness-live"')) {
  missing.push("3D Iso Night Brightness controls must remain available on the start screen, Save / Load screen, and live Iso toolbar");
}
if (!html.includes('tacticalThreeIsoNightBrightnessPresentation(baseProfile,props.isoNightBrightness,phase,isoView)') || !html.includes('toneMappingExposure=profile.exposure') || !html.includes('runtime.tacticalLighting.ambient*profile.ambientScale') || !html.includes('isoColor,isoNightBrightness,soldierModelStyle,isoGroundMode,fitMap')) {
  missing.push("3D Iso Night Brightness must update only the persistent renderer night presentation path");
}
if (!html.includes('const isoFillLight=new THREE.AmbientLight(0x9fb7d5,0)') || !html.includes('runtime.isoFillLight.intensity=Number(profile.isoFillIntensity)||0')) {
  missing.push("3D Iso Night Brightness must use a persistent zero-at-neutral ambient fill light for readable dark objects");
}
if (!html.includes('cover?.hp>0&&cover.kind==="hard"&&cover.solidVehicleFootprint') || !html.includes('tacticalCoverFootprintCells(cover).forEach(cell=>blocked.add(tacticalKey(cell.x,cell.y)))')) {
  missing.push("live land-vehicle authority must expand every intact hard-cover footprint cell");
}
if (!html.includes('let commitState=tacticalMovementCommitCellState(leader,nextCell,covers,workingUnits,{requireAdjacent:true})') || !html.includes('const commitState=tacticalMovementCommitCellState(human,plan.cell,covers,allUnits(),{requireAdjacent:false})') || !html.includes('const commitState=tacticalMovementCommitCellState(alien,step,covers,allUnits(),{requireAdjacent:true})')) {
  missing.push("manual/escort, human AI, and alien movement must recheck blockers at final commit time");
}
if (!html.includes('const base=tacticalThreeCoverWorldAnchor(runtime.worldFor,c)') || !html.includes('tacticalCoverFootprintCells(c).some(cell=>runtime.visibleSet.has(tacticalKey(cell.x,cell.y)))')) {
  missing.push("persistent 3D land vehicles must center and reveal from their authoritative footprint cells");
}
if (!html.includes('tacticalThreePersistentApplyIsoNightMaterialLift(runtime,profile)') || !html.includes('runtime?.scene?.traverse?.(object=>') || !html.includes('material.userData.aegisIsoNightBaseEmissive=material.emissive.getHex()') || !html.includes('material.emissive.setHex(baseHex)') || !html.includes('aegisIsoLiftedMaterialCount')) {
  missing.push("3D Iso Night Brightness must reversibly lift cached and directly created lit scene materials, then restore their authored emissive state");
}
const isoNightBrightnessSource = html.slice(html.indexOf('function tacticalThreeIsoNightBrightnessPresentation'), html.indexOf('function tacticalThreePersistentApplyNightPresentation'));
if (!isoNightBrightnessSource.includes('localLightScale:profile.localLightScale') || !isoNightBrightnessSource.includes('isoFillIntensity=Math.max(0,ratio-1)') || isoNightBrightnessSource.includes('fogNear') || isoNightBrightnessSource.includes('fogFar') || isoNightBrightnessSource.includes('.distance')) {
  missing.push("3D Iso Night Brightness must preserve local-light scale, fog, and light distance");
}
if (!html.includes('const missionLaunchConfirmation=confirmMissionLaunch?') || !html.includes('React.createElement(MissionLaunchConfirmModal,{...missionLaunchConfirmation,onCancel:cancelMissionLaunch,onProceed:proceedMissionLaunch})')) {
  missing.push("mission launch confirmation must receive its controller-built view snapshot and action callbacks explicitly");
}
if (!html.includes('selectSkyrangerSortieForMission(mission,responseForce,aircraftFleet,bases') || !html.includes('missionLaunchLoadoutSummary(responseForce,previewInventory,normalizedEquipmentTransfers')) {
  missing.push("mission sortie selection and local loadout assembly must remain controller-owned");
}
if (!html.includes('pointermove",event=>{if(!active||event.pointerType==="touch")return;lastPoint={x:event.clientX,y:event.clientY};if(tooltip.style.display!=="none")schedulePlace()')) {
  missing.push("global hover placement must remain animation-frame throttled");
}

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
if (manifest.lastInspectedBuild !== manifest.currentBuild) {
  missing.push("manifest lastInspectedBuild must match currentBuild");
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
if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "confirmed-beacon-mission-completion-gate" && entry?.reason)) {
  missing.push("browser-only confirmed beacon mission completion gate must be recorded as a temporary gameplay parity exception");
}
if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "seven-hex-beacon-shield-close-assault" && entry?.reason)) {
  missing.push("browser-only seven-hex beacon shield close assault must be recorded as a temporary gameplay parity exception");
}
if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "tactical-mission-exit-beacon-objective-scope-fix" && entry?.reason)) {
  missing.push("browser-only tactical mission exit beacon objective scope fix must be recorded as a temporary gameplay parity exception");
}
if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "mandatory-vip-rescue-quota-resolution-and-partial-credit" && entry?.reason)) {
  missing.push("browser-only mandatory VIP rescue quota resolution must be recorded as a temporary gameplay parity exception");
}
if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "fire-team-vip-building-ingress-traffic-aware-routing" && entry?.reason)) {
  missing.push("browser-only fire-team VIP building ingress routing must be recorded as a temporary gameplay parity exception");
}
if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "hybrid-escort-contact-decision-mode-preservation" && entry?.reason)) {
  missing.push("browser-only hybrid escort prompt mode preservation must be recorded as a temporary gameplay parity exception");
}
if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "hybrid-opening-escort-support-independent-follow" && entry?.reason)) {
  missing.push("browser-only hybrid opening escort support follow fix must be recorded as a temporary gameplay parity exception");
}
if (!manifest.gameplayParity?.requiredSystems?.includes("mission-default-civilian-escort-support-doctrine")) {
  missing.push("browser/native parity must require the mission default civilian escort support doctrine");
}
if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "mission-default-civilian-escort-support-doctrine" && entry?.reason)) {
  missing.push("browser-only mission default civilian escort support doctrine must be recorded as a temporary gameplay parity exception");
}
if (!manifest.gameplayParity?.requiredSystems?.includes("reinforcement-source-priority-and-ufo-bay-clearance")) {
  missing.push("browser/native parity must require reinforcement-source priority and UFO-bay clearance");
}
if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "reinforcement-source-priority-and-ufo-bay-clearance" && entry?.reason)) {
  missing.push("browser-only reinforcement-source priority and UFO-bay clearance must be recorded as a temporary gameplay parity exception");
}
if (!manifest.gameplayParity?.requiredSystems?.includes("empty-crashed-ufo-bay-elimination-victory")) {
  missing.push("browser/native parity must require empty crashed-UFO bay elimination victory");
}
if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "empty-crashed-ufo-bay-elimination-victory" && entry?.reason)) {
  missing.push("browser-only empty crashed-UFO bay elimination victory must be recorded as a temporary gameplay parity exception");
}
if (!manifest.gameplayParity?.requiredSystems?.includes("seeded-skyranger-landing-and-orientation-variety")) {
  missing.push("browser/native parity must require seeded Skyranger landing and orientation variety");
}
if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "seeded-skyranger-landing-and-orientation-variety" && entry?.reason)) {
  missing.push("browser-only seeded Skyranger landing and orientation variety must be recorded as a temporary gameplay parity exception");
}
if (!manifest.gameplayParity?.requiredSystems?.includes("globally-seeded-opening-incident-pair")) {
  missing.push("browser/native parity must require the globally seeded opening incident pair");
}
if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "globally-seeded-opening-incident-pair" && entry?.reason)) {
  missing.push("browser-only globally seeded opening incident pair must be recorded as a temporary gameplay parity exception");
}
if (!manifest.gameplayParity?.requiredSystems?.includes("beacon-linked-procedural-multilevel-alien-base-assault")) {
  missing.push("browser/native parity must require beacon-linked procedural multilevel alien-base assaults");
}
if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "beacon-linked-procedural-multilevel-alien-base-assault" && entry?.reason)) {
  missing.push("browser-only beacon-linked procedural multilevel alien-base assaults must be recorded as a temporary gameplay parity exception");
}
if (!manifest.gameplayParity?.requiredSystems?.includes("alien-base-vertical-deck-focus-presentation")) {
  missing.push("browser/native parity must require alien-base vertical deck focus presentation");
}
if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "alien-base-vertical-deck-focus-presentation" && entry?.reason)) {
  missing.push("browser-only alien-base vertical deck focus presentation must be recorded as a temporary gameplay parity exception");
}
if (!manifest.gameplayParity?.requiredSystems?.includes("crash-site-ai-terminal-stall-recovery")) {
  missing.push("browser/native parity must require crash-site AI terminal stall recovery");
}
if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "crash-site-ai-terminal-stall-recovery" && entry?.reason)) {
  missing.push("browser-only crash-site AI terminal stall recovery must be recorded as a temporary gameplay parity exception");
}
if (!manifest.gameplayParity?.requiredSystems?.includes("medium-large-streamed-building-perimeter-restoration")) {
  missing.push("browser/native parity must require medium and large streamed building perimeter restoration");
}
if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "medium-large-streamed-building-perimeter-restoration" && entry?.reason)) {
  missing.push("browser-only medium and large streamed building perimeter restoration must be recorded as a temporary gameplay parity exception");
}
if (!manifest.gameplayParity?.requiredSystems?.includes("single-owner-mission-victory-dialogue")) {
  missing.push("browser/native parity must require single-owner mission victory dialogue");
}
if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "single-owner-mission-victory-dialogue" && entry?.reason)) {
  missing.push("browser-only single-owner mission victory dialogue must be recorded as a temporary gameplay parity exception");
}
if (!manifest.gameplayParity?.requiredSystems?.includes("patch-notes-history-scope-startup-hotfix")) {
  missing.push("browser/native parity must require the patch-notes history scope startup hotfix");
}
if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "patch-notes-history-scope-startup-hotfix" && entry?.reason)) {
  missing.push("browser-only patch-notes history scope startup hotfix must be recorded as a temporary gameplay parity exception");
}
if (!manifest.gameplayParity?.requiredSystems?.includes("articulated-soldier-facing-pivot-and-stance-aim-authority")) {
  missing.push("browser/native parity must require articulated soldier facing-pivot and stance-aim authority");
}
if (!manifest.gameplayParity?.requiredSystems?.includes("right-handed-articulated-soldier-presentation")) {
  missing.push("browser/native parity must require right-handed articulated soldier presentation");
}
if (!manifest.gameplayParity?.requiredSystems?.includes("visible-articulated-aim-pose-render-lifecycle")) {
  missing.push("browser/native parity must require the visible articulated aim-pose render lifecycle");
}
if (!manifest.gameplayParity?.requiredSystems?.includes("standing-aim-rightward-barrel-alignment")) {
  missing.push("browser/native parity must require the standing-aim rightward barrel alignment");
}
if (!manifest.gameplayParity?.requiredSystems?.includes("previous-next-soldier-camera-recenter")) {
  missing.push("browser/native parity must require previous/next soldier camera recentering");
}
if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "articulated-aegis-soldier-presentation" && entry?.reason)) {
  missing.push("browser-only articulated AEGIS soldier presentation must be recorded as a temporary gameplay parity exception");
}
for (const system of [
  "save-load-patch-notes-version-history",
  "tactical-shot-result-stack-and-toggle",
  "enhanced-sfx-per-sound-multipliers",
  "hybrid-escort-contact-decision-mode-preservation",
  "hybrid-opening-escort-support-independent-follow",
  "command-map-autonomous-search-resume",
  "deferred-full-build-health-with-critical-boot-smoke",
  "single-owner-geoscape-clock-interval",
  "persistent-threejs-tactical-renderer-and-layer-invalidation",
  "threejs-full-ai-fog-of-war-shading",
  "observer-level-tactical-visibility-and-static-terrain-cache",
  "indexed-2d-tactical-cell-render-lookups",
  "threejs-explicit-living-unit-pose-state",
  "vip-death-flag-impossible-quota-terminal-resolution",
  "beacon-linked-procedural-multilevel-alien-base-assault",
  "alien-base-vertical-deck-focus-presentation",
  "crash-site-ai-terminal-stall-recovery",
  "medium-large-streamed-building-perimeter-restoration",
  "single-owner-mission-victory-dialogue",
  "patch-notes-history-scope-startup-hotfix",
  "per-shooter-visibility-and-rendered-target-shot-invariant",
  "post-extraction-rescue-duty-handoff",
  "multi-fireteam-vip-rescue-traffic",
  "geoscape-ufo-upright-orientation",
  "alien-land-vehicle-pathing-integrity",
]) {
  if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === system && entry?.reason)) {
    missing.push(`browser-only current-patch system must be recorded as a temporary parity exception: ${system}`);
  }
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
  "adaptive-alien-beacon-kinetic-shield",
  "adaptive-alien-beacon-combined-shield",
  "reinforcement-landmark-persistence",
  "confirmed-beacon-mission-completion-gate",
  "seven-hex-beacon-shield-close-assault",
  "tactical-mission-exit-beacon-objective-scope-fix",
  "mandatory-vip-rescue-quota-resolution-and-partial-credit",
  "fire-team-vip-building-ingress-traffic-aware-routing",
  "save-load-patch-notes-version-history",
  "tactical-shot-result-stack-and-toggle",
  "enhanced-sfx-per-sound-multipliers",
  "hybrid-escort-contact-decision-mode-preservation",
  "hybrid-opening-escort-support-independent-follow",
  "command-map-autonomous-search-resume",
  "persistent-threejs-tactical-renderer-and-layer-invalidation",
  "threejs-full-ai-fog-of-war-shading",
  "observer-level-tactical-visibility-and-static-terrain-cache",
  "indexed-2d-tactical-cell-render-lookups",
  "threejs-explicit-living-unit-pose-state",
  "vip-death-flag-impossible-quota-terminal-resolution",
  "single-owner-mission-victory-dialogue",
  "patch-notes-history-scope-startup-hotfix",
  "per-shooter-visibility-and-rendered-target-shot-invariant",
  "post-extraction-rescue-duty-handoff",
  "multi-fireteam-vip-rescue-traffic",
  "seeded-skyranger-landing-and-orientation-variety",
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
for (const system of ["deferred-full-build-health-with-critical-boot-smoke", "single-owner-geoscape-clock-interval", "persistent-threejs-tactical-renderer-and-layer-invalidation", "threejs-full-ai-fog-of-war-shading", "observer-level-tactical-visibility-and-static-terrain-cache", "indexed-2d-tactical-cell-render-lookups", "threejs-explicit-living-unit-pose-state", "vip-death-flag-impossible-quota-terminal-resolution", "build-health-runtime-hotpath-hardening", "hover-help-persistent-renderer-and-alien-craft-occlusion-refinement", "precompiled-tailwind-and-style-integrity", "stable-settings-component-boundaries", "stable-campaign-list-boundaries", "stable-transient-overlay-boundaries", "stable-campaign-confirmation-boundaries", "stable-operational-approval-boundaries", "stable-mission-launch-confirmation-boundary", "stable-strategic-incident-route-boundaries", "threejs-iso-night-vibrance-presentation", "threejs-iso-color-device-preference", "threejs-iso-night-brightness-device-preference", "command-map-autonomous-search-resume", "live-land-vehicle-footprint-movement-integrity", "single-owner-mission-victory-dialogue", "patch-notes-history-scope-startup-hotfix", "per-shooter-visibility-and-rendered-target-shot-invariant", "post-extraction-rescue-duty-handoff", "multi-fireteam-vip-rescue-traffic", "orphaned-escort-and-skyranger-ingress-recovery", "covered-position-repeat-fire"]) {
  if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === system && entry?.reason)) {
    missing.push(`browser optimization parity exception missing: ${system}`);
  }
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
if (!html.includes("CONTACT_IN_THE_DARK_MISSION_SEGMENTS={search:{start:0,end:36},combat:{start:37,end:60}}") || !html.includes("CONTACT_IN_THE_DARK_CROSSFADE_MS=1400") || !html.includes("return aliensVisible?CONTACT_IN_THE_DARK_MISSION_SEGMENTS.combat:CONTACT_IN_THE_DARK_MISSION_SEGMENTS.search")) {
  missing.push("Contact in the Dark must retain the 0:00-0:36 search loop, 0:37-1:00 combat loop, and 1.4-second crossfade contract");
}
if (!html.includes("tacticalMissionHasVisibleAliens(units,covers,mission)") || !html.includes("hasLineOfSight(observer,unit.x,unit.y,covers,mission)") || !html.includes("onAlienVisibilityChange(tacticalMusicAliensVisible)")) {
  missing.push("mission music state must follow live soldier line of sight instead of permanent alien reveal memory");
}
if (!html.includes("audio.mediaFadingOut=outgoing") || !html.includes("cancelMusicMediaCrossfade(true)") || !html.includes("armContactInTheDarkLoop(incoming,targetKey,true)")) {
  missing.push("mission music visibility changes must crossfade between bounded segment players and clean stale transitions");
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
