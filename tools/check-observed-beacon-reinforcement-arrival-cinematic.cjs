const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const src=fs.readFileSync(path.join(root,'src','browser-runtime.html'),'utf8');
const build='v0.26.09.11.2058_OBSERVED_BEACON_REINFORCEMENT_ARRIVAL_CINEMATIC_PATCH';
const checks=[
 ['build id',src.includes(`const CURRENT_GAME_BUILD="${build}"`)],
 ['feature flag',src.includes('TACTICAL_OBSERVED_BEACON_REINFORCEMENT_ARRIVAL_CINEMATIC_PATCH=true')],
 ['bounded duration',src.includes('TACTICAL_OBSERVED_BEACON_REINFORCEMENT_CINEMATIC_DURATION_MS=2300')],
 ['visible beacon finder',src.includes('function tacticalThreePersistentObservedBeaconForArrivalCinematic')&&src.includes('cover?.alienBeacon===true')&&src.includes('props.visibleByHumans?.(cover.x,cover.y)')],
 ['active beacon only',src.includes('cover.alienBeaconState!=="destroyed"')&&src.includes('cover.alienBeaconState!=="disabled"')],
 ['observed arrival gate',src.includes('unit.reinforcementLandingVisible')&&src.includes('props.visibleByHumans?.(unit.x,unit.y)')],
 ['camera start function',src.includes('function tacticalThreePersistentStartBeaconReinforcementArrivalCinematic')],
 ['camera animate function',src.includes('function tacticalThreePersistentAnimateBeaconReinforcementArrivalCinematic')],
 ['beacon authoritative world anchor',src.includes('runtime.worldFor(beacon.x,beacon.y)')],
 ['arrival authoritative world anchor',src.includes('runtime.worldFor(unit.x,unit.y)')],
 ['arrival centroid framing',src.includes('arrivalCenter')&&src.includes('focus=beaconPoint.clone().lerp(arrivalCenter,.62)')],
 ['dedupe batch ids',src.includes('batchIds')&&src.includes('batchKey')&&src.includes('beaconReinforcementArrivalCinematicSeen.has(batchKey)')],
 ['bounded dedupe memory',src.includes('beaconReinforcementArrivalCinematicSeen.size>96')],
 ['cinematic state allocated',src.includes('beaconReinforcementArrivalCinematicSeen:new Set(),beaconReinforcementArrivalCinematic:null')],
 ['cinematic state released',src.includes('runtime.beaconReinforcementArrivalCinematic=null;clearCollection(runtime.beaconReinforcementArrivalCinematicSeen)')],
 ['cinematic camera owns frame',src.includes('runtime.activeCamera=camera')],
 ['fpv weapon hidden',src.includes('runtime.firstPersonWeaponRoot.visible=false')],
 ['view restored',src.includes('runtime.activeFirstPerson?runtime.firstPersonCamera:runtime.activeThirdPerson?runtime.thirdPersonCamera:runtime.camera')],
 ['boarding precedence',src.includes('aegisBoardingCinematic==="active"')],
 ['beacon destruction precedence',src.includes('runtime.beaconDestructionCinematic')],
 ['critical kill precedence',src.includes('runtime.criticalKillCinematic')],
 ['sync calls cinematic start',src.includes('tacticalThreePersistentStartBeaconReinforcementArrivalCinematic(runtime,props,observedArrivals)')],
 ['animation loop calls cinematic',src.includes('tacticalThreePersistentAnimateBeaconReinforcementArrivalCinematic(runtime,now);tacticalThreePersistentAnimateAlienTransitMaterialization(runtime,now)')],
 ['overlay wording',src.includes('BEACON TRANSIT OBSERVED')&&src.includes('Alien Reinforcements Materializing')],
 ['normal beacon card suppresses fake craft pass',src.includes('craftPass:!beaconArrival||Boolean(landing.replacementBeacon)')],
 ['browser 2015 materialization preserved',src.includes('TACTICAL_ALIEN_BEACON_REINFORCEMENT_MATERIALIZATION_PRESENTATION_PATCH=true')&&src.includes('TACTICAL_ALIEN_BEACON_MATERIALIZATION_DURATION_MS=1350')],
 ['android pwa baseline preserved',src.includes('PWA_ANDROID_COLD_START_RELEASE_BEACON_HOTFIX=true')],
 ['mobile hud baseline preserved',src.includes('MOBILE_TACTICAL_STATUS_HUD_COLLAPSE_EXPAND_PATCH=true')],
 ['building seam baseline preserved',src.includes('PROCEDURAL_BUILDING_EXPLICIT_PERIMETER_SEAM_GEOMETRY_HOTFIX = true')],
 ['save format 4',/const CURRENT_SAVE_FORMAT_VERSION\s*=\s*4/.test(src)],
 ['build health contract installed',src.includes('tacticalObservedBeaconReinforcementArrivalCinematicContractChecks')&&src.includes('AEGIS_POST_DEFERRED_BUILD_HEALTH_RUNNER_BEFORE_OBSERVED_BEACON_ARRIVAL_CINEMATIC')],
 ['presentation start does not mutate units',!src.match(/function tacticalThreePersistentStartBeaconReinforcementArrivalCinematic[\s\S]{0,9000}setUnits/)],
 ['presentation camera does not pathfind',!src.match(/function tacticalThreePersistentAnimateBeaconReinforcementArrivalCinematic[\s\S]{0,7000}pathfind/)],
 ['presentation camera does not damage',!src.match(/function tacticalThreePersistentAnimateBeaconReinforcementArrivalCinematic[\s\S]{0,7000}\bdamage\s*=/)],
];
let pass=0;for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} - ${name}`);if(ok)pass++;}
console.log(`\n${pass}/${checks.length} passed`);if(pass!==checks.length)process.exit(1);
