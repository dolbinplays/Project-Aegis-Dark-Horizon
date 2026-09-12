const fs=require('fs'),vm=require('vm'),path=require('path');
const src=fs.readFileSync(path.join(__dirname,'..','src','browser-runtime.html'),'utf8');
function extract(name){const start=src.indexOf('function '+name+'(');if(start<0)throw new Error('missing '+name);const paren=src.indexOf('(',start);let pd=0,q=null,esc=false,brace=-1;for(let i=paren;i<src.length;i++){const c=src[i];if(q){if(esc){esc=false;continue}if(c==='\\'){esc=true;continue}if(c===q)q=null;continue}if(c==='"'||c==="'"||c==='`'){q=c;continue}if(c==='(')pd++;else if(c===')'){pd--;if(pd===0){brace=src.indexOf('{',i);break}}}if(brace<0)throw new Error('body missing '+name);let d=0;q=null;esc=false;for(let i=brace;i<src.length;i++){const c=src[i];if(q){if(esc){esc=false;continue}if(c==='\\'){esc=true;continue}if(c===q)q=null;continue}if(c==='"'||c==="'"||c==='`'){q=c;continue}if(c==='{')d++;else if(c==='}'){d--;if(d===0)return src.slice(start,i+1)}}throw new Error('unterminated '+name)}
class Vector3{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z}set(x,y,z){this.x=x;this.y=y;this.z=z;return this}clone(){return new Vector3(this.x,this.y,this.z)}add(v){this.x+=v.x;this.y+=v.y;this.z+=v.z;return this}multiplyScalar(v){this.x*=v;this.y*=v;this.z*=v;return this}lerp(v,a){this.x+=(v.x-this.x)*a;this.y+=(v.y-this.y)*a;this.z+=(v.z-this.z)*a;return this}sub(v){this.x-=v.x;this.y-=v.y;this.z-=v.z;return this}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}normalize(){const l=Math.sqrt(this.lengthSq())||1;return this.multiplyScalar(1/l)}addScaledVector(v,s){this.x+=v.x*s;this.y+=v.y*s;this.z+=v.z*s;return this}copy(v){this.x=v.x;this.y=v.y;this.z=v.z;return this}}
let now=1000;
const context={TACTICAL_OBSERVED_BEACON_REINFORCEMENT_ARRIVAL_CINEMATIC_PATCH:true,TACTICAL_OBSERVED_BEACON_REINFORCEMENT_CINEMATIC_DURATION_MS:2300,TACTICAL_ALIEN_BEACON_MATERIALIZATION_DURATION_MS:1350,TACTICAL_ALIEN_BEACON_MATERIALIZATION_PERFORMANCE_MS:980,clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),performance:{now:()=>now},Math,THREE:{Vector3},console};
vm.createContext(context);
for(const n of ['tacticalAlienBeaconMaterializationDurationMs','tacticalThreePersistentObservedBeaconForArrivalCinematic','tacticalThreePersistentStartBeaconReinforcementArrivalCinematic','tacticalThreePersistentAnimateBeaconReinforcementArrivalCinematic'])vm.runInContext(extract(n),context);
function camera(name){return{name,position:new Vector3(),look:null,updates:0,lookAt(v){this.look=v.clone?v.clone():v},updateMatrixWorld(){this.updates++}}}
const iso=camera('iso'),fpv=camera('fpv'),tpv=camera('tpv'),cinematic=camera('cinematic');
const runtime={THREE:context.THREE,cinematicCamera:cinematic,camera:iso,firstPersonCamera:fpv,thirdPersonCamera:tpv,activeCamera:iso,activeFirstPerson:false,activeThirdPerson:false,firstPersonState:null,firstPersonWeaponRoot:{visible:true},renderer:{domElement:{dataset:{}}},worldFor:(x,y)=>({x:x*2,z:y*2}),beaconReinforcementArrivalCinematicSeen:new Set(),beaconReinforcementArrivalCinematic:null,beaconDestructionCinematic:null,criticalKillCinematic:null};
const beacon={id:'b1',alienBeacon:true,alienBeaconState:'active',hp:50,x:10,y:10};
const arrivals=[{id:'a1',team:'alien',hp:20,x:11,y:10,reinforcementLandingVisible:true,reinforcementWave:2},{id:'a2',team:'alien',hp:20,x:10,y:11,reinforcementLandingVisible:true,reinforcementWave:2}];
let props={covers:[beacon],units:arrivals,visibleByHumans:(x,y)=>!(x===10&&y===10),renderQuality:'auto'};
if(context.tacticalThreePersistentStartBeaconReinforcementArrivalCinematic(runtime,props,arrivals)!==null)throw new Error('cinematic leaked when beacon itself hidden');
props={...props,visibleByHumans:()=>true};
const state=context.tacticalThreePersistentStartBeaconReinforcementArrivalCinematic(runtime,props,arrivals);if(!state||runtime.renderer.domElement.dataset.aegisBeaconReinforcementArrivalCinematic!=='active')throw new Error('observed cinematic did not start');
if(state.arrivalIds.length!==2||state.wave!==2)throw new Error('batch authority not retained');
const duplicate=context.tacticalThreePersistentStartBeaconReinforcementArrivalCinematic(runtime,props,arrivals);if(duplicate!==null)throw new Error('active batch duplicated');
now=1500;if(!context.tacticalThreePersistentAnimateBeaconReinforcementArrivalCinematic(runtime,now)||runtime.activeCamera!==cinematic||runtime.firstPersonWeaponRoot.visible!==false||!cinematic.look)throw new Error('cinematic camera did not own active frame');
// Restore TPV state on completion.
runtime.activeThirdPerson=true;now=state.endAt+1;context.tacticalThreePersistentAnimateBeaconReinforcementArrivalCinematic(runtime,now);if(runtime.activeCamera!==tpv||runtime.beaconReinforcementArrivalCinematic!==null)throw new Error('view restoration failed');
// Same batch stays deduped after completion.
if(context.tacticalThreePersistentStartBeaconReinforcementArrivalCinematic(runtime,props,arrivals)!==null)throw new Error('completed batch replayed');
// A new later batch is allowed.
const later=[{id:'a3',team:'alien',hp:20,x:9,y:10,reinforcementLandingVisible:true,reinforcementWave:2}];now+=100;if(!context.tacticalThreePersistentStartBeaconReinforcementArrivalCinematic(runtime,props,later))throw new Error('new batch was incorrectly suppressed');
console.log('PASS - hidden Beacon suppresses arrival cinematic');
console.log('PASS - visible Beacon starts one authoritative batch cinematic');
console.log('PASS - cinematic camera frames arrival and hides FPV weapon presentation');
console.log('PASS - prior 3D view is restored after the shot');
console.log('PASS - completed batch is deduplicated while later overflow batch may play');
