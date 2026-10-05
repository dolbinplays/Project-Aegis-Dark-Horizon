const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {runtimeContext}=require('./runtime-test-context.cjs');
const root=path.resolve(__dirname,'..');
const library=()=>JSON.parse(fs.readFileSync(path.join(root,'assets/data/aegis-costume-library.json'),'utf8'));
test('service worker evaluates and caches both new offline assets',()=>{
 const handlers={};const c={URL,self:{registration:{scope:'https://example.org/game/'},addEventListener:(key,fn)=>handlers[key]=fn}};vm.createContext(c);
 vm.runInContext(fs.readFileSync(path.join(root,'service-worker.js'),'utf8'),c);
 assert.equal(typeof handlers.fetch,'function');
 assert.equal(vm.runInContext('AEGIS_TOOL_NAV_URLS.has("https://example.org/game/AEGIS_Building_Layout_Editor_CURRENT.html")',c),true);
 for(const asset of ['./AEGIS_Costume_Editor_CURRENT.html','./assets/data/aegis-costume-library.js'])assert.equal(vm.runInContext(`AEGIS_SMALL_SHELL.includes(${JSON.stringify(asset)})`,c),true);
});
test('ordinary drops retain legacy IDs and signatures complete their foundation set',()=>{
 const c=runtimeContext();let standard=0,rare=0;
 for(let i=0;i<500;i++){
  const p=c.seasonalHalloweenPieceForCarrier({id:'test-'+i},0);
  if(p.variantKey){rare++;const loadout=Object.fromEntries(['top','bottom','head','weapon'].map(slot=>[slot,{...p,slot}]));assert.equal(c.seasonalFullSet(loadout).key,p.setKey);}
  else{standard++;assert.equal(p.itemId,`halloween:${p.setKey}:${p.slot}`);}
 }
 assert.ok(standard>0&&rare>0);
});
test('authored palette, label and flourish resolve on existing pieces with safe malformed-data fallback',()=>{
 const c=runtimeContext();c.AEGIS_COSTUME_LIBRARY=library();
 const base=c.AEGIS_COSTUME_LIBRARY.sets.find(row=>row.key==='vampire');Object.assign(base,{label:'Test name',primary:123,flourish:'Test flourish'});
 assert.equal(c.seasonalPieceDisplayLabel({setKey:'vampire',slot:'top'}),'Test name Top');
 assert.equal(c.seasonalSetDefinition('vampire').primary,123);
 const full=Object.fromEntries(['top','bottom','head','weapon'].map(slot=>[slot,{setKey:'vampire',slot}]));assert.equal(c.seasonalFullSet(full).flourish,'Test flourish');
 c.AEGIS_COSTUME_LIBRARY.sets={};c.AEGIS_COSTUME_LIBRARY.variants={};assert.ok(Number.isFinite(c.seasonalSetDefinition({setKey:'vampire',variantKey:'crimson-vampire'}).primary));
});
test('runtime clamps invalid fit data and retains legacy opacity when no override is authored',()=>{
 const c=runtimeContext();const style=c.seasonalCostumeSlotStyle({slots:{top:{position:[Infinity,2,0],scale:[-1,99,NaN],opacity:NaN,emissive:Infinity}}},'top');
 assert.equal(style.position[0],0);assert.equal(style.scale[0],.2);assert.equal(style.scale[1],3);assert.equal(style.scale[2],1);assert.equal(style.opacity,undefined);assert.equal(style.emissive,.16);
 let options;c.tacticalThreePersistentMaterial=(runtime,key,color,value)=>{options=value;return value;};c.seasonalThreeMaterial({},'test',0,.94,style);assert.equal(options.opacity,.94);
});
test('all celebration effects remain finite across frames, including a zero-time start',()=>{
 const c=runtimeContext(),THREE=require('../assets/vendor/three.min.js');let now=0;c.performance.now=()=>now;
 c.tacticalThreePersistentMaterial=(r,key,color,o)=>new THREE.MeshStandardMaterial({color,opacity:o.opacity});
 for(const effect of ['orbit','cape','witchlight','moon','sand','mist','lightning','bones','spectral']){
  c.AEGIS_COSTUME_LIBRARY=library();c.AEGIS_COSTUME_LIBRARY.sets[0].celebration={effect,intensity:.7,speed:1,phases:[{pose:'standing',durationMs:150},{pose:'victory',durationMs:150}]};
  const unit={id:'test',seasonalCosmetics:Object.fromEntries(['top','bottom','head','weapon'].map(slot=>[slot,{setKey:'vampire',slot}]))},node=new THREE.Group();now=0;
  const group=c.seasonalThreeCelebrationFlourish({THREE},node,unit);now=175;group.children[0].onBeforeRender();assert.equal(group.userData.phaseIndex,1,effect);
  for(const time of [300,1500,7000]){now=time;assert.equal(c.seasonalThreeCelebrationFlourish({THREE},node,unit),group);group.traverse(o=>assert.ok([...o.position.toArray(),...o.scale.toArray()].every(Number.isFinite),effect));}
 }
});