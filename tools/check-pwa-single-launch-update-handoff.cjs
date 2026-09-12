#!/usr/bin/env node
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const crypto=require('crypto');
const root=path.resolve(__dirname,'..');
const runtime=fs.readFileSync(path.join(root,'src','browser-runtime.html'),'utf8');
const base=fs.readFileSync(path.join(root,'_base_1610_runtime.html'),'utf8');
const host=fs.readFileSync(path.join(root,'index.html'),'utf8');
const worker=fs.readFileSync(path.join(root,'service-worker.js'),'utf8');
const packager=fs.readFileSync(path.join(root,'tools','package-runtime-shell.cjs'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const BUILD='v0.26.09.11.1708_PWA_SINGLE_LAUNCH_UPDATE_HANDOFF_PATCH';
const tests=[];
const add=(name,pass,detail='')=>tests.push({name,pass:Boolean(pass),detail});
function fnSource(text,name){
  const needle=`function ${name}(`; const start=text.indexOf(needle); if(start<0)return null;
  const brace=text.indexOf('{',start); if(brace<0)return null; let depth=0,quote=null,esc=false,templateDepth=0;
  for(let i=brace;i<text.length;i++){
    const c=text[i],n=text[i+1];
    if(quote){ if(esc){esc=false;continue;} if(c==='\\'){esc=true;continue;} if(c===quote){quote=null;continue;} continue; }
    if(c==='"'||c==="'"||c==='`'){quote=c;continue;}
    if(c==='/'&&n==='*'){const e=text.indexOf('*/',i+2); if(e<0)return null;i=e+1;continue;}
    if(c==='/'&&n==='/'){const e=text.indexOf('\n',i+2);if(e<0)return text.slice(start);i=e;continue;}
    if(c==='{')depth++; else if(c==='}'){depth--; if(depth===0)return text.slice(start,i+1);}
  }
  return null;
}
function sameFn(name){const a=fnSource(base,name),b=fnSource(runtime,name);return Boolean(a&&b&&a===b);}
add('runtime build synchronized',runtime.includes(`const CURRENT_GAME_BUILD="${BUILD}"`));
add('PWA patch flag present',runtime.includes('const PWA_SINGLE_LAUNCH_UPDATE_HANDOFF_PATCH=true;'));
add('save format remains 4',runtime.includes('const CURRENT_SAVE_FORMAT_VERSION=4;'));
add('1610 history frozen',runtime.includes('build:"v0.26.09.11.1610_PROCEDURAL_BUILDING_EXPLICIT_PERIMETER_SEAM_GEOMETRY_HOTFIX",date:"September 11, 2026",title:"Procedural Building Explicit Perimeter Seam Geometry Hotfix"'));
add('current PWA history entry present',runtime.includes('build:CURRENT_GAME_BUILD,date:"September 11, 2026",title:"Installed PWA Single-Launch Update Handoff"'));
const appSource=fnSource(runtime,'AlienResponseCommand')||'';
add('exactly one mutable current patch history entry',((appSource.match(/PATCH_NOTES_HISTORY\.unshift\(\{build:CURRENT_GAME_BUILD/g)||[]).length===1));
add('host build synchronized',host.includes(`data-aegis-host-build="${BUILD}"`)&&host.includes(`const BUILD='${BUILD}'`));
add('early registration bypasses service-worker script cache',host.includes('updateViaCache:"none"'));
add('old load-event registration removed',!host.includes('window.addEventListener("load",registerAegisServiceWorker'));
add('startup gate runs before runtime boot',host.indexOf('prepareInstalledPwaStartup')<host.lastIndexOf('bootRuntime();})();'));
add('installed/controller gate present',host.includes('const installedAtLaunch=pwaInstalled();const controllerAtLaunch=navigator.serviceWorker?.controller||null;const hadController=Boolean(controllerAtLaunch)'));
add('controllerchange handoff present',host.includes('addEventListener("controllerchange",onControllerChange)')&&host.includes('removeEventListener("controllerchange",onControllerChange)'));
add('controller race is detected even if updatefound was missed',host.includes('navigator.serviceWorker.controller!==controllerAtLaunch'));
add('post-mission restore overlay survives update timeout',host.includes("if(rebooting)showTransition('RESTORING MISSION DEBRIEF'"));
add('bounded update timeouts present',host.includes('PWA_UPDATE_CHECK_TIMEOUT_MS=2600')&&host.includes('PWA_UPDATE_ACTIVATION_TIMEOUT_MS=12000'));
add('one-reload session guard present',host.includes('PWA_UPDATE_RELOAD_GUARD_KEY')&&host.includes('pwaReloadGuardMatches()')&&host.includes('markPwaReloadGuard()'));
add('update transition copy present',host.includes('UPDATING AEGIS COMMAND NETWORK')&&host.includes('no second app launch required'));
add('late controller listener removed before normal play',host.includes('navigator.serviceWorker.removeEventListener("controllerchange",onControllerChange)'));
add('fresh browser install avoids forced reload',host.includes('if(!installedAtLaunch||!hadController)'));
add('offline registration fallback boots current shell',host.includes('if(!registration){pwaState.updatePhase="fallback"')&&host.includes('if(update?.reloading)return;bootRuntime();'));
add('host exposes PWA update diagnostics',host.includes('window.__AEGIS_PWA_UPDATE_REPORT'));
add('worker shell install bypasses HTTP cache',worker.includes('new Request(url, { cache: "reload", credentials: "same-origin" })'));
add('worker navigation bypasses HTTP cache',worker.includes('fetch(request, { cache: "no-store" })'));
add('worker static refresh avoids stale HTTP cache',worker.includes('fetch(request, { cache: "no-cache" })'));
add('worker supports explicit skip waiting message',worker.includes('event?.data?.type === "AEGIS_SKIP_WAITING"'));
add('worker still claims clients',worker.includes('await self.clients.claim()'));
add('packager preserves early update bootstrap',packager.includes('prepareInstalledPwaStartup')&&packager.includes('updateViaCache:"none"'));
add('packager preserves no second-launch copy',packager.includes('no second app launch required'));
add('service worker caches synchronized',worker.includes(`"aegis-${BUILD}"`)&&worker.includes(`"aegis-runtime-${BUILD}"`));
add('release metadata build synchronized',metadata.build===BUILD&&metadata.save_format===4);
const runtimeBytes=Buffer.from(runtime,'utf8');
add('release runtime byte count matches',metadata.runtime_bytes===runtimeBytes.length);
add('release runtime SHA matches',metadata.runtime_sha256===crypto.createHash('sha256').update(runtimeBytes).digest('hex'));
add('release host SHA matches',metadata.host_sha256===crypto.createHash('sha256').update(Buffer.from(host,'utf8')).digest('hex'));
for(const name of ['tacticalBuildingPlans','tacticalBuildingCovers','makeBattlefield','resolveMission','tacticalMissionTerminalState','tacticalAiMissionResolution']) add(`${name} unchanged from Browser 1610`,sameFn(name));

// Execute the service worker in a small mocked worker realm and verify the important request-cache modes.
(async()=>{
  const listeners={}; const fetchCalls=[]; const puts=[]; let skipWaitingCount=0,claimCount=0;
  const cache={put:async(k,v)=>{puts.push(String(k?.url||k));},match:async()=>null};
  const context={
    URL,Request,Response,console,
    self:{registration:{scope:'https://aegis.test/game/'},location:{origin:'https://aegis.test'},clients:{claim:async()=>{claimCount++;}},skipWaiting:async()=>{skipWaitingCount++;},addEventListener:(name,fn)=>{listeners[name]=fn;}},
    caches:{open:async()=>cache,keys:async()=>['aegis-old'],delete:async()=>true,match:async()=>null},
    fetch:async(req,init={})=>{fetchCalls.push({url:String(req?.url||req),cache:init.cache||req?.cache||'default'});return new Response('ok',{status:200,headers:{'content-type':'text/plain'}});}
  };
  vm.runInNewContext(worker,context,{filename:'service-worker.js'});
  let installPromise;listeners.install({waitUntil:p=>{installPromise=p;}});await installPromise;
  add('mock install fetched every shell item with reload cache mode',fetchCalls.slice(0,4).length===4&&fetchCalls.slice(0,4).every(call=>call.cache==='reload'));
  add('mock install cached four shell resources',puts.length===4);
  add('mock install called skipWaiting',skipWaitingCount>=1);
  let navPromise;listeners.fetch({request:{method:'GET',url:'https://aegis.test/game/index.html',mode:'navigate',headers:new Headers()},respondWith:p=>{navPromise=p;},waitUntil:()=>{}});await navPromise;
  add('mock navigation used no-store network request',fetchCalls.some(call=>call.url.includes('index.html')&&call.cache==='no-store'));
  let activatePromise;listeners.activate({waitUntil:p=>{activatePromise=p;}});await activatePromise;
  add('mock activation claimed clients',claimCount===1);
  const before=skipWaitingCount;listeners.message({data:{type:'AEGIS_SKIP_WAITING'}});await Promise.resolve();
  add('mock skip-waiting message invokes skipWaiting',skipWaitingCount===before+1);
  const passed=tests.filter(t=>t.pass).length;
  for(const t of tests) console.log(`${t.pass?'PASS':'FAIL'} - ${t.name}${t.detail?` - ${t.detail}`:''}`);
  console.log(`\nPassed: ${passed}/${tests.length}`);console.log(`Failed: ${tests.length-passed}`);
  if(passed!==tests.length)process.exit(1);
})().catch(error=>{console.error(error);process.exit(1);});
