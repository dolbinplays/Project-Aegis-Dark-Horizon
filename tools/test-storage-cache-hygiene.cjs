const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function setup(){
 const stores=new Map(),flags={quota:false};
 const key=r=>typeof r==='string'?r:r.url;
 const caches={async open(name){if(!stores.has(name))stores.set(name,new Map());const data=stores.get(name);return{async match(r){return data.get(key(r));},async put(r,v){if(flags.quota)throw Error('QuotaExceededError');data.set(key(r),v);},async delete(r){return data.delete(key(r));},async keys(){return [...data.keys()].map(url=>({url}));}};},async keys(){return [...stores.keys()];},async delete(name){return stores.delete(name);}};
 const c=vm.createContext({URL,Request,Response,Headers,TextEncoder,TextDecoder,caches,self:{registration:{scope:'https://example.test/game/'},location:{origin:'https://example.test'},addEventListener(){}},console});
 vm.runInContext(fs.readFileSync('service-worker.js','utf8'),c);
 return{c,caches,stores,flags,shell:vm.runInContext('AEGIS_PWA_CACHE',c),runtime:vm.runInContext('AEGIS_RUNTIME_CACHE',c)};
}
test('refreshing a precached asset updates one copy and removes its runtime duplicate',async()=>{
 const {c,caches,shell,runtime}=setup(),url='https://example.test/game/assets/a.js';
 await(await caches.open(shell)).put(url,new Response('old'));await(await caches.open(runtime)).put(url,new Response('duplicate'));
 assert.equal(await c.cacheRuntimeAsset(url,new Response('new')),true);
 assert.equal(await(await(await caches.open(shell)).match(url)).text(),'new');
 assert.equal(await(await caches.open(runtime)).match(url),undefined);
});
test('duplicate cleanup preserves unique runtime files and unrelated caches',async()=>{
 const {c,caches,shell,runtime}=setup(),url='https://example.test/game/a.js';
 await(await caches.open(shell)).put(url,new Response('a'));await(await caches.open(runtime)).put(url,new Response('a'));
 await(await caches.open(runtime)).put(url+'?variant=1',new Response('variant'));
 await(await caches.open('unrelated')).put(url,new Response('other'));
 await c.removeDuplicateRuntimeAssets();
 assert.equal((await(await caches.open(runtime)).keys()).length,1);
 assert.ok(await(await caches.open('unrelated')).match(url));
});
test('quota failures leave fetched responses usable and archives/out-of-scope assets uncached',async()=>{
 const {c,flags,stores}=setup(),response=new Response('download');flags.quota=true;
 assert.equal(await c.cacheRuntimeAsset('https://example.test/game/a.js',response),false);
 assert.equal(await response.text(),'download');
 flags.quota=false;
 for(const url of ['https://example.test/game/build.zip','https://example.test/other/a.js','https://other.test/game/a.js'])
 assert.equal(await c.cacheRuntimeAsset(url,new Response('data')),false);
 for(const data of stores.values())assert.equal(data.size,0);
});
