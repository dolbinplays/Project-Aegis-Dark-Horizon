const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const BUILD='v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH';
const live=JSON.parse(fs.readFileSync(path.join(root,'assets/data/aegis-prop-library.json'),'utf8'));
const backup=JSON.parse(fs.readFileSync(path.join(root,'assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json'),'utf8'));
const factory=JSON.parse(fs.readFileSync(path.join(root,'assets/data/aegis-prop-factory-originals-1155.json'),'utf8'));
const keys=['tree','lamp-post','stop-sign','vending-machine','newspaper-machine','bus-stop','street-bench','crates','concrete','fence','rock','bush'];
function byKey(lib,k){return lib.props.find(p=>p.visualKey===k)}
const expectedCounts={tree:2,'lamp-post':3,'stop-sign':3,'vending-machine':5,'newspaper-machine':3,'bus-stop':6,'street-bench':4,crates:3,concrete:2,fence:4,rock:1,bush:1};
let n=0;function ok(name,fn){fn();console.log(`ok ${++n} - ${name}`)}
ok('library build and count',()=>{assert.equal(live.libraryVersion,BUILD);assert.equal(live.props.length,57)});
ok('all twelve foundation originals restored',()=>{for(const k of keys){const p=byKey(live,k);assert(p);assert.equal(p.metadata.foundationOriginal,true,k);assert.equal(p.components.length,expectedCounts[k],k)}});
ok('signature geometry matches original editor',()=>{assert.equal(byKey(live,'tree').components[1].primitive,'sphere');assert.equal(byKey(live,'tree').components[1].size.radius,.58);assert.equal(byKey(live,'rock').components[0].primitive,'sphere');assert.equal(byKey(live,'vending-machine').components[2].name,'Product glass');assert.equal(byKey(live,'bus-stop').components[5].rotation[0],-8);assert.equal(byKey(live,'fence').components[2].name,'Top rail')});
ok('factory snapshot is immutable twelve-prop source',()=>{assert.equal(factory.immutable,true);assert.equal(factory.props.length,12);for(const k of keys)assert(byKey(factory,k),k)});
ok('pre-restore 2058 full backup preserved',()=>{assert.equal(backup.props.length,57);assert.equal(backup.libraryVersion,'v0.26.09.17.2058_PROP_RUNTIME_FIDELITY_AND_TEST_GALLERY_PATCH');assert.equal(byKey(backup,'tree').components[1].primitive,'cone')});
ok('runtime JS parses and carries installed-app URL hotfix',()=>{const js=fs.readFileSync(path.join(root,'assets/data/aegis-prop-library.js'),'utf8');new vm.Script(js);assert(js.includes("new URL('../../'+galleryName,libraryScript.src)"));assert(js.includes(BUILD))});
ok('editor JS parses and current redirect targets 2145',()=>{const f=fs.readFileSync(path.join(root,'AEGIS_Prop_Editor_'+BUILD+'.html'),'utf8');const scripts=[...f.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean);for(const s of scripts)new vm.Script(s);const cur=fs.readFileSync(path.join(root,'AEGIS_Prop_Editor_CURRENT.html'),'utf8');assert(cur.includes('AEGIS_Prop_Editor_'+BUILD+'.html'))});
console.log(`1..${n}`);
