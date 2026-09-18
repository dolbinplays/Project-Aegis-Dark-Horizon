const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const BUILD='v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH';
const live=JSON.parse(fs.readFileSync(path.join(root,'assets/data/aegis-prop-library.json'),'utf8'));
const backup=JSON.parse(fs.readFileSync(path.join(root,'assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json'),'utf8'));
const original1155=JSON.parse(fs.readFileSync(path.join(root,'assets/data/aegis-prop-factory-originals-1155.json'),'utf8'));
const factory2145=JSON.parse(fs.readFileSync(path.join(root,'assets/data/aegis-prop-factory-library-2145.json'),'utf8'));
const keys=['tree','lamp-post','stop-sign','vending-machine','newspaper-machine','bus-stop','street-bench','crates','concrete','fence','rock','bush'];
function byKey(lib,k){return lib.props.find(p=>p.visualKey===k)}
function visualSig(p){return JSON.stringify({components:p.components,rootTransform:p.rootTransform,collision:p.collision})}
let n=0;function ok(name,fn){fn();console.log(`ok ${++n} - ${name}`)}
ok('library build and count',()=>{assert.equal(live.libraryVersion,BUILD);assert.equal(live.props.length,57)});
ok('all twelve foundation originals remain restored',()=>{for(const k of keys){const p=byKey(live,k),o=byKey(original1155,k);assert(p,k);assert(o,k);assert.equal(p.metadata.foundationOriginal,true,k);assert.equal(visualSig(p),visualSig(o),k)}});
ok('full 2145 factory snapshot matches live model shapes at patch baseline',()=>{for(const p of live.props){const f=byKey(factory2145,p.metadata.factoryVisualKey||p.visualKey);assert(f,p.visualKey);assert.equal(visualSig(p),visualSig(f),p.visualKey)}});
ok('pre-restore 2058 backup preserved',()=>{assert.equal(backup.props.length,57);assert.equal(backup.libraryVersion,'v0.26.09.17.2058_PROP_RUNTIME_FIDELITY_AND_TEST_GALLERY_PATCH');assert.equal(byKey(backup,'tree').components[1].primitive,'cone')});
ok('runtime JS parses and carries live + installed-app fixes',()=>{const js=fs.readFileSync(path.join(root,'assets/data/aegis-prop-library.js'),'utf8');new vm.Script(js);assert(js.includes("aegis-prop-live-library-v1"));assert(js.includes("new URL('../../'+galleryName,libraryScript.src)"));assert(js.includes(BUILD))});
console.log(`1..${n}`);
