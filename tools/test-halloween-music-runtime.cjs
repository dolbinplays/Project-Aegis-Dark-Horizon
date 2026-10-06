const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {runtimeContext}=require('./runtime-test-context.cjs');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'src/browser-runtime.html'),'utf8');
function fixture(){
 const c=runtimeContext(),created=[];
 Object.assign(c,{audioRef:{current:{mediaMode:'missions',mediaSoundtrack:'original',mediaSegmentKey:'search',halloweenLastTrackByMode:{}}},musicVolume:25,musicSoundtrack:'original',tacticalAliensVisible:false,masterMutedRef:{current:false},setInterval:()=>1,clearInterval(){},dialogueMusicDuckFactor:()=>1,aegisNotifyHostMusicStarted(){},stopMidiTrack(){},scheduleMusicLoop(){},notifyFailure(){}});
 class Media{constructor(src){this.src=src;this.currentSrc=src;this.paused=false;this.readyState=1;this.currentTime=0;created.push(this);}play(){return Promise.resolve();}pause(){this.paused=true;}addEventListener(){}removeEventListener(){}load(){}}
 c.Audio=Media;
 const first=source.indexOf('function getMusicAudioCandidates('),last=source.indexOf('function playTone(',first);
 vm.runInContext(source.slice(first,last),c);
 return{c,created};
}
test('seasonal banks resolve real external assets, October overlay and normal fallback',()=>{
 const {c}=fixture();c.__AEGIS_SEASONAL_DATE_OVERRIDE='2026-10-15T12:00:00Z';
 const catalog=vm.runInContext('Object.values(HALLOWEEN_MUSIC_AUDIO_URLS).flat().concat(HALLOWEEN_MISSION_VICTORY_TRACKS.map(t=>t.url))',c);
 assert.equal(catalog.length,38);assert.equal(new Set(catalog).size,38);for(const asset of catalog)assert.ok(fs.statSync(path.join(root,asset)).size>1000,asset);
 for(const mode of vm.runInContext('Object.keys(HALLOWEEN_MUSIC_AUDIO_URLS)',c)){
  const urls=c.getMusicAudioCandidates(mode,'original');assert.ok(urls[0].includes('/halloween/'));c.audioRef.current.halloweenLastTrackByMode[mode]=urls[0];assert.notEqual(c.getMusicAudioCandidates(mode,'original')[0],urls[0]);
 }
 c.__AEGIS_SEASONAL_DATE_OVERRIDE='2026-11-15T12:00:00Z';assert.ok(c.getMusicAudioCandidates('missions','original').every(url=>!url.includes('/halloween/')));
});
test('Halloween mission crossfade preserves Original selection and reuses the chosen take',async()=>{
 const {c,created}=fixture();c.__AEGIS_SEASONAL_DATE_OVERRIDE='2026-10-15T12:00:00Z';
 c.playMusicAudio('missions','original');await Promise.resolve();const original=c.audioRef.current.media;
 c.setContactInTheDarkSegment(true);const incoming=c.audioRef.current.media;assert.equal(incoming.src,original.src);assert.equal(c.audioRef.current.mediaSoundtrack,'original');
 c.tacticalAliensVisible=true;const count=created.length;c.playMusicAudio('missions','original');assert.equal(created.length,count);assert.equal(c.audioRef.current.media,incoming);
});
test('failed Halloween crossfade restores source and selected soundtrack',async()=>{
 const {c}=fixture();c.__AEGIS_SEASONAL_DATE_OVERRIDE='2026-10-15T12:00:00Z';c.playMusicAudio('missions','original');await Promise.resolve();const original=c.audioRef.current.media,Base=c.Audio;
 c.Audio=class extends Base{play(){return Promise.reject(new Error('decode failed'));}};
 c.setContactInTheDarkSegment(true);await Promise.resolve();await Promise.resolve();assert.equal(c.audioRef.current.media,original);assert.equal(c.audioRef.current.mediaSoundtrack,'original');assert.equal(c.audioRef.current.mediaSegmentKey,'search');
});
test('late playback completion cannot replace newer no-repeat history',async()=>{
 const {c}=fixture();c.__AEGIS_SEASONAL_DATE_OVERRIDE='2026-10-15T12:00:00Z';let resolveOld;const Base=c.Audio;c.Audio=class extends Base{play(){return new Promise(resolve=>{resolveOld=resolve;});}};
 c.playMusicAudio('base','original');c.audioRef.current.media={src:'newer'};c.audioRef.current.halloweenLastTrackByMode.base='newer';resolveOld();await Promise.resolve();assert.equal(c.audioRef.current.halloweenLastTrackByMode.base,'newer');
});
