const fs=require('fs'),vm=require('vm');
const path=require('path');const src=fs.readFileSync(path.join(__dirname,'..','src','browser-runtime.html'),'utf8');
function extract(name){const start=src.indexOf('function '+name+'(');if(start<0)throw new Error('missing '+name);const paren=src.indexOf('(',start);let pd=0,q=null,esc=false,brace=-1;for(let i=paren;i<src.length;i++){const c=src[i];if(q){if(esc){esc=false;continue}if(c==='\\'){esc=true;continue}if(c===q)q=null;continue}if(c==='"'||c==="'"||c==='`'){q=c;continue}if(c==='(')pd++;else if(c===')'){pd--;if(pd===0){brace=src.indexOf('{',i);break}}}if(brace<0)throw new Error('body missing '+name);let d=0;q=null;esc=false;for(let i=brace;i<src.length;i++){const c=src[i];if(q){if(esc){esc=false;continue}if(c==='\\'){esc=true;continue}if(c===q)q=null;continue}if(c==='"'||c==="'"||c==='`'){q=c;continue}if(c==='{')d++;else if(c==='}'){d--;if(d===0)return src.slice(start,i+1)}}}
const vec=()=>({x:0,y:0,z:0,set(x,y,z){this.x=x;this.y=y;this.z=z;},setScalar(v){this.x=this.y=this.z=v;}});
class Group{constructor(){this.children=[];this.position=vec();this.rotation=vec();this.userData={};this.name='';}add(x){this.children.push(x)}remove(x){this.children=this.children.filter(y=>y!==x)}}
class Object3D{constructor(){this.position=vec();this.rotation=vec();this.scale=vec();this.matrix={};}updateMatrix(){this.matrix={p:{...this.position},r:{...this.rotation},s:{...this.scale}}}}
class Matrix4{copy(x){Object.assign(this,x);return this}}
class MeshBasicMaterial{constructor(o){Object.assign(this,o)}}
class PointsMaterial extends MeshBasicMaterial{}
class InstancedMesh{constructor(g,m,n){this.geometry=g;this.material=m;this.count=n;this.instanceMatrix={needsUpdate:false};this.m=[];}setMatrixAt(i,m){this.m[i]=m}}
class Mesh{constructor(g,m){this.geometry=g;this.material=m;this.position=vec();this.scale=vec();this.rotation=vec();}}
class BufferGeometry{constructor(){this.attributes={}}setAttribute(k,v){this.attributes[k]=v}}
class BufferAttribute{constructor(a,n){this.array=a;this.itemSize=n}}
class Points extends Mesh{}
class BoxGeometry{constructor(...a){this.args=a}}
let now=1000;
const context={TACTICAL_ALIEN_BEACON_REINFORCEMENT_MATERIALIZATION_PRESENTATION_PATCH:true,TACTICAL_ALIEN_BEACON_MATERIALIZATION_DURATION_MS:1350,TACTICAL_ALIEN_BEACON_MATERIALIZATION_PERFORMANCE_MS:980,clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),tacticalAiStableHash:s=>12345,performance:{now:()=>now},Float32Array,Math,THREE:{Group,Object3D,Matrix4,MeshBasicMaterial,PointsMaterial,InstancedMesh,Mesh,BufferGeometry,BufferAttribute,Points,BoxGeometry,AdditiveBlending:'add'},console};
vm.createContext(context);
for(const n of ['tacticalAlienBeaconMaterializationDurationMs','tacticalThreePersistentEnsureTransitGeometry','tacticalThreePersistentCreateAlienTransitMaterializationEffect','tacticalThreePersistentSyncAlienTransitMaterialization','tacticalThreePersistentAnimateAlienTransitMaterialization'])vm.runInContext(extract(n),context);
const root=new Group(),node={visible:true,scale:vec(),userData:{}};node.scale.setScalar(1);
const runtime={THREE:context.THREE,transitRoot:root,transitMaterializationEffects:new Map(),transitMaterializationHandledIds:new Set(),sharedGeometries:new Set(),sharedMaterials:new Set(),geoCache:{ring:{},alienBody:{},alienHead:{}},unitNodes:new Map([['a1',node]]),worldFor:(x,y)=>({x:x*2,z:y*3}),renderer:{domElement:{dataset:{}}}};
const unit={id:'a1',team:'alien',reinforcementLandingVisible:true,hp:20,x:4,y:5};
const hidden=context.tacticalThreePersistentCreateAlienTransitMaterializationEffect(runtime,unit,{visibleByHumans:()=>false,renderQuality:'auto'});
if(hidden!==null)throw new Error('hidden arrival leaked effect');
const fx=context.tacticalThreePersistentCreateAlienTransitMaterializationEffect(runtime,unit,{visibleByHumans:()=>true,renderQuality:'auto'});
if(!fx||root.children.length!==1||node.visible!==false||fx.group.position.x!==8||fx.group.position.z!==15)throw new Error('visible creation failed');
const duplicate=context.tacticalThreePersistentCreateAlienTransitMaterializationEffect(runtime,unit,{visibleByHumans:()=>true});if(duplicate!==fx||root.children.length!==1)throw new Error('dedupe failed');
now=1000+1350*.7;context.tacticalThreePersistentAnimateAlienTransitMaterialization(runtime,now);if(!node.visible||node.scale.x<=.82||node.scale.x>=1)throw new Error('resolve stage failed');
now=2400;context.tacticalThreePersistentAnimateAlienTransitMaterialization(runtime,now);if(runtime.transitMaterializationEffects.size!==0||root.children.length!==0||!node.visible||node.scale.x!==1||node.userData.transitMaterializing!==false)throw new Error('cleanup/final restore failed');
console.log('PASS - hidden arrival creates no effect');console.log('PASS - observed arrival materializes at authoritative world hex');console.log('PASS - duplicate identity does not create duplicate effect');console.log('PASS - model resolves during final phase');console.log('PASS - completed effect cleans up and restores model');
