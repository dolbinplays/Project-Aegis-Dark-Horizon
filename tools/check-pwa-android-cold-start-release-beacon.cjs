#!/usr/bin/env node
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const crypto=require('crypto');
const root=path.resolve(__dirname,'..');
const runtime=fs.readFileSync(path.join(root,'src','browser-runtime.html'),'utf8');
const base=fs.readFileSync(path.join(root,'_base_1740_runtime.html'),'utf8');
const host=fs.readFileSync(path.join(root,'index.html'),'utf8');
const worker=fs.readFileSync(path.join(root,'service-worker.js'),'utf8');
const packager=fs.readFileSync(path.join(root,'tools','package-runtime-shell.cjs'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const BUILD='v0.26.09.11.1800_PWA_ANDROID_COLD_START_AND_RELEASE_BEACON_HOTFIX';
const tests=[];
const add=(name,pass,detail='')=>tests.push({name,pass:Boolean(pass),detail});
function fnSource(text,name){
  const needle=`function ${name}(`; const start=text.indexOf(needle); if(start<0)return null;
  const brace=text.indexOf('{',start); if(brace<0)return null; let depth=0,quote=null,esc=false;
  for(let i=brace;i<text.length;i++){
    const c=text[i],n=text[i+1];
    if(quote){if(esc){esc=false;continue;}if(c==='\\'){esc=true;continue;}if(c===quote){quote=null;}continue;}
    if(c==='"'||c==="'"||c==='`'){quote=c;continue;}
    if(c==='/'&&n==='*'){const e=text.indexOf('*/',i+2);if(e<0)return null;i=e+1;continue;}
    if(c==='/'&&n==='/'){const e=text.indexOf('\n',i+2);if(e<0)return text.slice(start);i=e;continue;}
    if(c==='{')depth++; else if(c==='}'){depth--;if(depth===0)return text.slice(start,i+1);}
  }
  return null;
}
function sameFn(name){const a=fnSource(base,name),b=fnSource(runtime,name);return Boolean(a&&b&&a===b);}

add('runtime build synchronized',runtime.includes(`const CURRENT_GAME_BUILD="${BUILD}"`));
add('Android cold-start hotfix flag present',runtime.includes('const PWA_ANDROID_COLD_START_RELEASE_BEACON_HOTFIX=true;'));
add('save format remains 4',runtime.includes('const CURRENT_SAVE_FORMAT_VERSION=4;'));
add('1740 history frozen literal',runtime.includes('build:"v0.26.09.11.1740_MOBILE_TACTICAL_STATUS_HUD_COLLAPSE_EXPAND_PATCH",date:"September 11, 2026",title:"Mobile Tactical Status HUD Collapse / Expand"'));
add('current hotfix history entry present',runtime.includes('build:CURRENT_GAME_BUILD,date:"September 11, 2026",title:"Android PWA Cold-Start + Release Beacon Hotfix"'));
const appSource=fnSource(runtime,'AlienResponseCommand')||'';
add('exactly one mutable current patch history entry',(appSource.match(/PATCH_NOTES_HISTORY\.unshift\(\{build:CURRENT_GAME_BUILD/g)||[]).length===1);
add('host build synchronized',host.includes(`data-aegis-host-build="${BUILD}"`)&&host.includes(`const BUILD='${BUILD}'`));
add('host update strategy is release beacon navigation v2',host.includes('PWA_UPDATE_STRATEGY="release-beacon-navigation-v2"'));
add('blocking startup gate removed',!host.includes('prepareInstalledPwaStartup')&&!host.includes('PWA_UPDATE_ACTIVATION_TIMEOUT_MS'));
add('controller-change auto reload removed',!host.includes('window.location.reload()')&&!host.includes('addEventListener("controllerchange"'));
add('runtime boots before background worker upkeep',host.indexOf('bootRuntime();')>=0&&host.indexOf('bootRuntime();')<host.indexOf('setTimeout(refreshAegisServiceWorkerInBackground,0)'));
add('service worker upkeep remains cache-bypass registered',host.includes('updateViaCache:"none"')&&host.includes('registration.update?.().catch'));
add('host diagnostics report nonblocking strategy',host.includes('blockingStartupGate:false')&&host.includes('automaticControllerReload:false'));
add('worker has stable cross-build launch cache',worker.includes('const AEGIS_LAUNCH_CACHE = "aegis-launch-shell-v2"'));
const smallShellBlock=(worker.match(/const AEGIS_SMALL_SHELL = \[([\s\S]*?)\];/)||[])[1]||'';
add('worker install excludes giant index shell',Boolean(smallShellBlock)&&!smallShellBlock.includes('index.html'));
add('worker probes release metadata with cache buster',worker.includes('release-metadata.json')&&worker.includes('aegis_probe')&&worker.includes('cache: "no-store"'));
add('worker uses build-cache-busted shell fetch',worker.includes('aegis_build')&&worker.includes('fetchPublishedShell'));
add('worker caches shell in parallel with respondWith path',worker.includes('event.waitUntil(cacheLaunchShell(fresh.clone())')&&worker.includes('return fresh;'));
add('normal cached launch returns stable shell',worker.includes('if (cachedLaunch) return cachedLaunch;'));
add('worker preserves offline old-cache fallback',worker.includes('Last-resort offline migration from an older versioned shell cache'));
add('worker install still skip-waits and activation claims',worker.includes('await self.skipWaiting()')&&worker.includes('event.waitUntil(self.clients.claim())'));
add('packager preserves nonblocking host strategy',packager.includes('release-beacon-navigation-v2')&&packager.includes('setTimeout(refreshAegisServiceWorkerInBackground,0)'));
add('service worker caches synchronized',worker.includes(`"aegis-${BUILD}"`)&&worker.includes(`"aegis-runtime-${BUILD}"`));
add('release metadata build synchronized',metadata.build===BUILD&&metadata.save_format===4);
const runtimeBytes=Buffer.from(runtime,'utf8');
add('release runtime byte count matches',metadata.runtime_bytes===runtimeBytes.length);
add('release runtime SHA matches',metadata.runtime_sha256===crypto.createHash('sha256').update(runtimeBytes).digest('hex'));
add('release host SHA matches',metadata.host_sha256===crypto.createHash('sha256').update(Buffer.from(host,'utf8')).digest('hex'));
for(const name of ['tacticalBuildingPlans','tacticalBuildingCovers','makeBattlefield','resolveMission','tacticalMissionTerminalState','tacticalAiMissionResolution']) add(`${name} unchanged from Browser 1740`,sameFn(name));

(async()=>{
  const listeners={};
  const stores=new Map();
  const fetchCalls=[];
  let mode='install';
  let publishedBuild=BUILD;
  let skipWaitingCount=0,claimCount=0;
  const toKey=(key)=>String(key?.url||key);
  const cacheApi=(name)=>({
    put:async(k,v)=>{if(!stores.has(name))stores.set(name,new Map());stores.get(name).set(toKey(k),v.clone?v.clone():v);},
    match:async(k)=>{const v=stores.get(name)?.get(toKey(k));return v?.clone?v.clone():v||null;}
  });
  const cachesApi={
    open:async(name)=>{if(!stores.has(name))stores.set(name,new Map());return cacheApi(name);},
    keys:async()=>[...stores.keys()],
    delete:async(name)=>stores.delete(name),
    match:async(k)=>{for(const name of stores.keys()){const v=await cacheApi(name).match(k);if(v)return v;}return null;}
  };
  const makeResponse=(body,type='text/plain')=>new Response(body,{status:200,headers:{'content-type':type}});
  const fetchMock=async(req,init={})=>{
    const u=String(req?.url||req);
    const cacheMode=init.cache||req?.cache||'default';
    fetchCalls.push({url:u,cache:cacheMode,mode});
    if(mode==='offline') throw new Error('offline');
    if(u.includes('release-metadata.json')) return makeResponse(JSON.stringify({build:publishedBuild}),'application/json');
    if(u.includes('index.html')) return makeResponse(mode==='update'?'new-shell':'fresh-current-shell','text/html');
    return makeResponse('small');
  };
  const context={
    URL,Request,Response,Headers,AbortController,setTimeout,clearTimeout,Date,console,
    self:{registration:{scope:'https://aegis.test/game/'},location:{origin:'https://aegis.test'},clients:{claim:async()=>{claimCount++;}},skipWaiting:async()=>{skipWaitingCount++;},addEventListener:(name,fn)=>{listeners[name]=fn;}},
    caches:cachesApi,
    fetch:fetchMock
  };
  vm.runInNewContext(worker,context,{filename:'service-worker.js'});

  let installPromise;listeners.install({waitUntil:p=>{installPromise=p;}});await installPromise;
  const installFetches=fetchCalls.filter(c=>c.mode==='install');
  add('mock install fetches only four small resources',installFetches.length===4&&installFetches.every(c=>!c.url.includes('index.html')));
  add('mock install uses reload cache mode for small resources',installFetches.every(c=>c.cache==='reload'));
  add('mock install called skipWaiting',skipWaitingCount===1);
  let activatePromise;listeners.activate({waitUntil:p=>{activatePromise=p;}});await activatePromise;
  add('mock activation claimed clients',claimCount===1);

  const launchCache=await cachesApi.open('aegis-launch-shell-v2');
  await launchCache.put('https://aegis.test/game/index.html',makeResponse('cached-current-shell','text/html'));
  const runNav=async()=>{
    let navPromise;const waits=[];
    const request={method:'GET',url:'https://aegis.test/game/index.html',mode:'navigate',headers:new Headers()};
    listeners.fetch({request,respondWith:p=>{navPromise=p;},waitUntil:p=>{waits.push(Promise.resolve(p));}});
    const response=await navPromise;const body=await response.text();await Promise.allSettled(waits);return body;
  };

  mode='same';publishedBuild=BUILD;fetchCalls.length=0;
  const sameBody=await runNav();
  add('no-update cold start returns cached launch shell',sameBody==='cached-current-shell');
  add('no-update cold start performs only tiny release probe',fetchCalls.length===1&&fetchCalls[0].url.includes('release-metadata.json')&&!fetchCalls.some(c=>c.url.includes('index.html')));

  mode='update';publishedBuild='v0.26.09.11.1815_TEST_NEXT_BUILD';fetchCalls.length=0;
  const updateBody=await runNav();
  add('update launch returns newly fetched shell in same navigation',updateBody==='new-shell');
  add('update launch shell request is build-cache-busted',fetchCalls.some(c=>c.url.includes('index.html')&&c.url.includes('aegis_build=v0.26.09.11.1815_TEST_NEXT_BUILD')));
  add('update launch shell bypasses HTTP cache',fetchCalls.some(c=>c.url.includes('index.html')&&c.cache==='no-store'));
  const stableAfter=await launchCache.match('https://aegis.test/game/index.html');
  add('update launch caches replacement shell for next cold start',stableAfter&&await stableAfter.text()==='new-shell');

  mode='offline';publishedBuild=BUILD;fetchCalls.length=0;
  const offlineBody=await runNav();
  add('offline cold start falls back to stable cached shell',offlineBody==='new-shell');

  mode='same';publishedBuild=BUILD;fetchCalls.length=0;
  stores.set('aegis-launch-shell-v2',new Map());
  const firstBody=await runNav();
  add('empty launch cache streams one fresh current shell',firstBody==='fresh-current-shell');
  add('empty launch cache fetches shell only after tiny probe',fetchCalls.length===2&&fetchCalls[0].url.includes('release-metadata.json')&&fetchCalls[1].url.includes('index.html'));

  const passed=tests.filter(t=>t.pass).length;
  for(const t of tests) console.log(`${t.pass?'PASS':'FAIL'} - ${t.name}${t.detail?` - ${t.detail}`:''}`);
  console.log(`\nPassed: ${passed}/${tests.length}`);console.log(`Failed: ${tests.length-passed}`);
  if(passed!==tests.length)process.exit(1);
})().catch(error=>{console.error(error);process.exit(1);});
