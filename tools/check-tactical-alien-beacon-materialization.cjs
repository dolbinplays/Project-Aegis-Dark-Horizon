const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const src=fs.readFileSync(path.join(root,'src','browser-runtime.html'),'utf8');
const build='v0.26.09.11.2058_OBSERVED_BEACON_REINFORCEMENT_ARRIVAL_CINEMATIC_PATCH';
const checks=[
 ['build id',src.includes(`const CURRENT_GAME_BUILD="${build}"`)],
 ['feature flag',src.includes('TACTICAL_ALIEN_BEACON_REINFORCEMENT_MATERIALIZATION_PRESENTATION_PATCH=true')],
 ['normal duration',src.includes('TACTICAL_ALIEN_BEACON_MATERIALIZATION_DURATION_MS=1350')],
 ['performance duration',src.includes('TACTICAL_ALIEN_BEACON_MATERIALIZATION_PERFORMANCE_MS=980')],
 ['observed gate',src.includes('unit?.team!=="alien"||!unit.reinforcementLandingVisible||Number(unit.hp)<=0||!props.visibleByHumans?.(unit.x,unit.y)')],
 ['dedupe map',src.includes('runtime.transitMaterializationEffects?.has(unit.id)||runtime.transitMaterializationHandledIds?.has(unit.id)')],
 ['arrival hex authority',src.includes('point=runtime.worldFor(unit.x,unit.y)')],
 ['3d named effect',src.includes('alien-beacon-materialization-${unit.id}')],
 ['containment rings',src.includes('new THREE.InstancedMesh(runtime.geoCache.ring,ringMaterial,3)')],
 ['energy filaments',src.includes('new THREE.InstancedMesh(geometry.filament,filamentMaterial,6)')],
 ['ghost body',src.includes('wireframe:true')&&src.includes('runtime.geoCache.alienBody')&&src.includes('runtime.geoCache.alienHead')],
 ['particles',src.includes('new THREE.PointsMaterial')&&src.includes('new THREE.Points(particleGeometry,particleMaterial)')],
 ['model hidden at start',src.includes('node.visible=false;node.scale.setScalar(.82)')],
 ['model reveal threshold',src.includes('revealAt:startAt+durationMs*.58')&&src.includes('if(progress<.58)node.visible=false')],
 ['final model restored',src.includes('node.visible=true;node.scale.setScalar(1);node.userData.transitMaterializing=false')],
 ['2d presentation marker',src.includes('data-aegis-beacon-materialization-2d')],
 ['2d pulse',src.includes('animate-ping')&&src.includes('animate-pulse')],
 ['sync after units',src.includes('tacticalThreePersistentSyncAlienTransitMaterialization(runtime,props);')],
 ['animation frame owns effect',src.includes('tacticalThreePersistentAnimateAlienTransitMaterialization(runtime,now)')],
 ['animation loop held open',src.includes('(runtime.transitMaterializationEffects?.size||0)>0')],
 ['transit root allocated',src.includes('transitRoot:new THREE.Group()')],
 ['transit maps allocated',src.includes('transitMaterializationEffects:new Map(),transitMaterializationHandledIds:new Set()')],
 ['transit root disposed',src.includes('[runtime.effectRoot,runtime.transitRoot,runtime.beaconDestructionRoot')],
 ['transit refs released',src.includes('runtime.transitMaterializationEffects,runtime.transitMaterializationHandledIds')&&src.includes('"effectRoot","transitRoot","beaconDestructionRoot"')],
 ['no pathing mutation',!src.match(/function tacticalThreePersistentCreateAlienTransitMaterializationEffect[\s\S]{0,8000}pathfind/)],
 ['no damage mutation',!src.match(/function tacticalThreePersistentCreateAlienTransitMaterializationEffect[\s\S]{0,8000}\bdamage\s*=/)],
 ['no setUnits mutation',!src.match(/function tacticalThreePersistentCreateAlienTransitMaterializationEffect[\s\S]{0,8000}setUnits/)],
 ['save format 4',/const CURRENT_SAVE_FORMAT_VERSION\s*=\s*4/.test(src)],
 ['Browser 2015 materialization history frozen',src.includes('build:"v0.26.09.11.2015_TACTICAL_ALIEN_BEACON_REINFORCEMENT_MATERIALIZATION_PRESENTATION_PATCH",date:"September 11, 2026",title:"Alien Field Beacon Reinforcement Materialization Presentation"')],
 ['current cinematic patch history',src.includes('build:CURRENT_GAME_BUILD,date:"September 11, 2026",title:"Observed Beacon Reinforcement Arrival Cinematic"')],
 ['browser 1800 history preserved',src.includes('build:"v0.26.09.11.1800_PWA_ANDROID_COLD_START_AND_RELEASE_BEACON_HOTFIX"')],
 ['pwa 1800 flag preserved',src.includes('PWA_ANDROID_COLD_START_RELEASE_BEACON_HOTFIX=true')],
 ['mobile hud flag preserved',src.includes('MOBILE_TACTICAL_STATUS_HUD_COLLAPSE_EXPAND_PATCH=true')],
 ['building seam flag preserved',src.includes('PROCEDURAL_BUILDING_EXPLICIT_PERIMETER_SEAM_GEOMETRY_HOTFIX = true')],
 ['horizon fog flag preserved',src.includes('TACTICAL_HORIZON_FOG_INTEGRATED_SOLID_DEPTH_FADE_HOTFIX=true')],
 ['build health contract installed',src.includes('tacticalAlienBeaconReinforcementMaterializationContractChecks')&&src.includes('AEGIS_POST_DEFERRED_BUILD_HEALTH_RUNNER_BEFORE_ALIEN_BEACON_MATERIALIZATION')],
];
let pass=0;for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} - ${name}`);if(ok)pass++;}
console.log(`\n${pass}/${checks.length} passed`);if(pass!==checks.length)process.exit(1);
