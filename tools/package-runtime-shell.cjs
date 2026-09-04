const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "src", "browser-runtime.html");
const outputPath = path.join(root, "index.html");
const source = fs.readFileSync(sourcePath, "utf8");
const buildMatch = source.match(/const CURRENT_GAME_BUILD="([^"]+)"/);

if (!buildMatch || buildMatch[1].includes("__AEGIS_BUILD__")) {
  throw new Error("src/browser-runtime.html must contain a finalized CURRENT_GAME_BUILD before packaging.");
}

const build = buildMatch[1];
const requiredLineageMarkers = [
  "TACTICAL_FIRST_CLASS_FIRE_TEAM_BEACON_ASSAULT_ORDERS_PATCH",
  "TACTICAL_FPV_TPV_ALIEN_CIRCULAR_CROSSHAIR_TARGET_MARKERS_PATCH",
  "TACTICAL_SMOOTH_ARTICULATED_HEX_TO_HEX_LOCOMOTION_PATCH",
  "TACTICAL_ARTICULATED_SEGMENT_FACING_AND_FORWARD_WALK_PATCH",
  "TACTICAL_ALIEN_VIP_INFORMATION_SEARCH_AND_SHARED_MEMORY_PATCH",
  "POST_MISSION_RUNTIME_REBOOT_AND_AUDIO_CONTINUITY_PATCH",
  "POST_MISSION_RUNTIME_REBOOT_RELEASE_INTEGRATION_PATCH",
  "POST_MISSION_RUNTIME_RESUME_SINGLE_CHECKPOINT_CONSUMER_HOTFIX",
  "POST_MISSION_RECOVERY_OUTCOME_ANNOUNCEMENT_PATCH",
  "TACTICAL_MISSION_DEFAULT_PRESENTATION_PATCH",
  "TACTICAL_AI_ROUND_CONTEXT_INDEX_AND_CACHE_PATCH",
  "TACTICAL_AI_BEACON_FRAME_STATE_AND_REPLACEMENT_PLAYBACK_HOTFIX",
];
const missingLineage = requiredLineageMarkers.filter((marker) => !source.includes(marker));
if (missingLineage.length) {
  throw new Error(`Refusing to package a stale browser runtime. Missing: ${missingLineage.join(", ")}`);
}

const sourceBytes = Buffer.from(source, "utf8");
const payload = sourceBytes.toString("base64");
const payloadSha256 = crypto.createHash("sha256").update(sourceBytes).digest("hex");

const template = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Alien Response Command</title>
<style>
html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#020617;color:#e2e8f0;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
#aegis-host-shell{position:fixed;inset:0;background:#020617}
#aegis-runtime{position:absolute;inset:0;width:100%;height:100%;border:0;background:#020617}
#aegis-host-transition{position:absolute;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 38%,rgba(8,47,73,.96),rgba(2,6,23,.995) 58%);opacity:0;pointer-events:none;transition:opacity .34s ease}
#aegis-host-transition.active{opacity:1;pointer-events:auto}
#aegis-host-transition-card{width:min(680px,calc(100vw - 40px));padding:34px 30px;border:1px solid rgba(34,211,238,.48);border-radius:28px;background:rgba(2,6,23,.88);box-shadow:0 0 50px rgba(6,182,212,.16),0 24px 70px rgba(0,0,0,.55);text-align:center}
#aegis-host-kicker{font-size:12px;font-weight:900;letter-spacing:.28em;text-transform:uppercase;color:#67e8f9}
#aegis-host-title{margin-top:10px;font-size:clamp(26px,4vw,42px);font-weight:950;letter-spacing:.02em;color:#f8fafc}
#aegis-host-status{margin-top:14px;font-size:15px;line-height:1.6;color:#cbd5e1}
#aegis-host-bar{height:5px;margin:24px auto 0;max-width:420px;border-radius:999px;background:rgba(30,41,59,.92);overflow:hidden}
#aegis-host-bar>span{display:block;width:36%;height:100%;border-radius:inherit;background:#22d3ee;animation:aegisHostSweep 1.25s ease-in-out infinite alternate}
#aegis-host-detail{margin-top:14px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#64748b}
#aegis-host-recovery-actions{display:none;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:22px}
#aegis-host-recovery-actions.active{display:flex}
#aegis-host-recovery-actions button{border:1px solid rgba(103,232,249,.55);border-radius:14px;padding:10px 15px;background:#083344;color:#ecfeff;font-weight:900;cursor:pointer}
#aegis-host-recovery-actions button.secondary{border-color:#475569;background:#0f172a;color:#cbd5e1}
@keyframes aegisHostSweep{from{transform:translateX(-8%)}to{transform:translateX(185%)}}
@media (prefers-reduced-motion:reduce){#aegis-host-transition{transition:none}#aegis-host-bar>span{animation:none;width:100%}}
</style>
</head>
<body data-aegis-host-build="__BUILD__">
<div id="aegis-host-shell">
  <iframe id="aegis-runtime" title="Alien Response Command game runtime" allow="autoplay; fullscreen"></iframe>
  <div id="aegis-host-transition" aria-live="polite" aria-busy="false">
    <div id="aegis-host-transition-card">
      <div id="aegis-host-kicker">AEGIS COMMAND NETWORK</div>
      <div id="aegis-host-title">MISSION DATA TRANSFER</div>
      <div id="aegis-host-status">Compiling field telemetry and securing the After Action Report...</div>
      <div id="aegis-host-bar"><span></span></div>
      <div id="aegis-host-detail">Verified autosave &bull; tactical memory reset &bull; command continuity</div>
      <div id="aegis-host-recovery-actions">
        <button id="aegis-host-retry-autosave" type="button">Retry Verified Autosave</button>
        <button id="aegis-host-continue-fresh" class="secondary" type="button">Continue to Start Screen</button>
      </div>
    </div>
  </div>
  <audio id="aegis-host-bridge-audio" preload="auto" loop></audio>
</div>
<script id="aegis-runtime-payload" type="application/octet-stream" data-source-bytes="__SOURCE_BYTES__" data-sha256="__PAYLOAD_SHA256__">__PAYLOAD__</script>
<script>
(function(){
  'use strict';
  const BUILD='__BUILD__';
  const RESUME_TOKEN_KEY='project-aegis-post-mission-runtime-resume-v1';
  const AUDIO_CONTINUITY_KEY='project-aegis-audio-continuity-v1';
  const RESUME_TOKEN_TTL_MS=30*60*1000;
  const RESUME_WATCHDOG_MS=30000;
  const hostShell=document.getElementById('aegis-host-shell');
  let runtimeFrame=document.getElementById('aegis-runtime');
  const transition=document.getElementById('aegis-host-transition');
  const transitionTitle=document.getElementById('aegis-host-title');
  const transitionStatus=document.getElementById('aegis-host-status');
  const transitionDetail=document.getElementById('aegis-host-detail');
  const recoveryActions=document.getElementById('aegis-host-recovery-actions');
  const retryButton=document.getElementById('aegis-host-retry-autosave');
  const continueButton=document.getElementById('aegis-host-continue-fresh');
  const bridge=document.getElementById('aegis-host-bridge-audio');
  const payloadNode=document.getElementById('aegis-runtime-payload');
  const expectedSourceBytes=Number(payloadNode.dataset.sourceBytes)||0;
  const metrics={boots:0,reboots:0,resumes:0,resumeFailures:0,resumeTimeouts:0,recoveryRetries:0,lastReboot:null,lastResume:null,lastAudioState:null,bridgePrimed:false,bridgePlayFailures:0,payloadBytes:expectedSourceBytes};
  let rebooting=false;
  let bridgeFadeFrame=0;
  let resumeWatchdog=0;
  let lastVerifiedToken=null;
  let lastAudioState={musicPlaying:false,musicVolume:65,sfxVolume:70,musicSelectionMode:'auto',musicMode:'start',musicSoundtrack:'original'};

  function readAudioContinuity(){try{const value=JSON.parse(sessionStorage.getItem(AUDIO_CONTINUITY_KEY)||'{}');return value&&typeof value==='object'?value:{};}catch{return {};}}
  Object.assign(lastAudioState,readAudioContinuity());
  function bridgeSource(state=lastAudioState){return state.musicSoundtrack==='alternate'?'assets/audio/alternate/after_action.mp3':'assets/audio/aegis_midi_reports.wav';}
  function targetBridgeVolume(state=lastAudioState){return Math.max(0,Math.min(1,Number(state.musicVolume??65)/100));}
  function cancelBridgeFade(){if(bridgeFadeFrame)cancelAnimationFrame(bridgeFadeFrame);bridgeFadeFrame=0;}
  function fadeBridge(target,duration=360){cancelBridgeFade();const start=Number(bridge.volume)||0;const goal=Math.max(0,Math.min(1,Number(target)||0));const begun=performance.now();const tick=now=>{const t=Math.min(1,(now-begun)/Math.max(1,duration));const eased=t*t*(3-2*t);bridge.volume=start+(goal-start)*eased;if(t<1)bridgeFadeFrame=requestAnimationFrame(tick);else bridgeFadeFrame=0;};bridgeFadeFrame=requestAnimationFrame(tick);}
  function ensureBridgePrimed(state=lastAudioState,forceSource=false){if(state.musicPlaying!==true)return false;const desired=bridgeSource(state);const current=(bridge.getAttribute('src')||'').replace(/^\.\//,'');if(forceSource||!current){try{bridge.src=desired;bridge.load();}catch{}}bridge.loop=true;bridge.volume=0;let playResult=null;try{playResult=bridge.play();}catch{metrics.bridgePlayFailures+=1;return false;}if(playResult?.then)playResult.then(()=>{metrics.bridgePrimed=true;}).catch(()=>{metrics.bridgePlayFailures+=1;});else metrics.bridgePrimed=true;return true;}
  function syncAudio(state={},options={}){lastAudioState={...lastAudioState,...state,musicPlaying:state.musicPlaying===true,musicVolume:Math.max(0,Math.min(100,Number(state.musicVolume??lastAudioState.musicVolume??65))),sfxVolume:Math.max(0,Math.min(100,Number(state.sfxVolume??lastAudioState.sfxVolume??70))),musicSoundtrack:state.musicSoundtrack==='alternate'?'alternate':'original'};metrics.lastAudioState={...lastAudioState};try{sessionStorage.setItem(AUDIO_CONTINUITY_KEY,JSON.stringify(lastAudioState));}catch{}if(!lastAudioState.musicPlaying){cancelBridgeFade();bridge.volume=0;try{bridge.pause();}catch{}metrics.bridgePrimed=false;return;}if(options?.prime)ensureBridgePrimed(lastAudioState,!bridge.getAttribute('src'));}
  function showTransition(title,status,detail){transitionTitle.textContent=title||'MISSION DATA TRANSFER';transitionStatus.textContent=status||'Securing campaign state...';transitionDetail.textContent=detail||'Verified autosave \u2022 tactical memory reset \u2022 command continuity';recoveryActions.classList.remove('active');transition.setAttribute('aria-busy','true');transition.classList.add('active');}
  function hideTransition(delay=0){setTimeout(()=>{transition.setAttribute('aria-busy','false');transition.classList.remove('active');recoveryActions.classList.remove('active');},Math.max(0,delay));}
  function clearResumeWatchdog(){if(resumeWatchdog)clearTimeout(resumeWatchdog);resumeWatchdog=0;}
  function armResumeWatchdog(){clearResumeWatchdog();resumeWatchdog=setTimeout(()=>{metrics.resumeTimeouts+=1;runtimeResumeFailed({message:'The replacement runtime did not confirm the After Action Report within 30 seconds.'});},RESUME_WATCHDOG_MS);}
  function validResumeToken(token){const age=Date.now()-Number(token?.createdAt||0);return Boolean(token&&token.kind==='project-aegis-post-mission-runtime-resume'&&token.build===BUILD&&token.autosaveSlot&&token.reportId&&token.checkpointId&&typeof token.success==='boolean'&&age>=0&&age<=RESUME_TOKEN_TTL_MS);}
  function decodeRuntime(){const encoded=(payloadNode.textContent||'').trim();const binary=atob(encoded);const bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);if(expectedSourceBytes&&bytes.byteLength!==expectedSourceBytes)throw new Error('Embedded runtime payload length check failed.');return new TextDecoder().decode(bytes);}
  function createRuntimeFrame(){const frame=document.createElement('iframe');frame.id='aegis-runtime';frame.title='Alien Response Command game runtime';frame.setAttribute('allow','autoplay; fullscreen');hostShell.insertBefore(frame,transition);runtimeFrame=frame;return frame;}
  function bootRuntime(){metrics.boots+=1;if(!runtimeFrame||!runtimeFrame.isConnected)createRuntimeFrame();try{runtimeFrame.srcdoc=decodeRuntime();}catch(error){runtimeResumeFailed({message:error?.message||'The embedded game runtime could not be decoded.'});}}
  function destroyAndBootRuntime(){const retired=runtimeFrame;runtimeFrame=null;if(retired){try{retired.src='about:blank';}catch{}try{retired.remove();}catch{}}setTimeout(()=>{createRuntimeFrame();bootRuntime();armResumeWatchdog();},110);}
  function beginPostMissionTransition(payload={}){if(rebooting)return false;showTransition(payload.success===false?'MISSION DEBRIEF':'MISSION COMPLETE','Receiving field telemetry and applying mission aftermath...','Casualties \u2022 rewards \u2022 recovery \u2022 After Action Report');return true;}
  function cancelPostMissionTransition(info={}){if(rebooting)return;clearResumeWatchdog();transitionTitle.textContent='DEBRIEF CONTINUES';transitionStatus.textContent=String(info.message||'Runtime reset skipped; current campaign remains active.');transitionDetail.textContent='No unverified state was destroyed';if(lastAudioState.musicPlaying)fadeBridge(0,180);hideTransition(900);}
  function requestRuntimeReboot(payload={}){if(rebooting)return false;let token=null;try{token=JSON.parse(sessionStorage.getItem(RESUME_TOKEN_KEY)||'null');}catch{}if(!validResumeToken(token)||token.reportId!==payload.reportId||token.autosaveSlot!==payload.autosaveSlot||token.checkpointId!==payload.checkpointId||token.success!==(payload.success===true))return false;lastVerifiedToken={...token};rebooting=true;metrics.reboots+=1;metrics.lastReboot={...payload,at:Date.now()};showTransition(payload.success===false?'MISSION DEBRIEF':'MISSION COMPLETE','Securing the verified autosave and releasing tactical memory...','After Action Report locked \u2022 rebuilding AEGIS runtime');if(lastAudioState.musicPlaying){if(!metrics.bridgePrimed)ensureBridgePrimed(lastAudioState,false);fadeBridge(targetBridgeVolume(lastAudioState),420);}setTimeout(()=>{transitionStatus.textContent='Tactical runtime released. Reinitializing command systems...';destroyAndBootRuntime();},620);return true;}
  function runtimeReady(){if(rebooting)transitionStatus.textContent='Command systems online. Restoring the verified After Action Report...';}
  function runtimeMusicStarted(){if(lastAudioState.musicPlaying)fadeBridge(0,520);}
  function runtimeResumeComplete(info={}){if(!lastVerifiedToken||info.reportId!==lastVerifiedToken.reportId||info.checkpointId!==lastVerifiedToken.checkpointId||info.success!==lastVerifiedToken.success)return runtimeResumeFailed({message:'The replacement runtime restored a different mission checkpoint or outcome.'});clearResumeWatchdog();metrics.resumes+=1;metrics.lastResume={...info,at:Date.now()};lastVerifiedToken=null;transitionTitle.textContent='AFTER ACTION REPORT READY';transitionStatus.textContent='Campaign restored. Opening the completed mission report...';transitionDetail.textContent='Tactical runtime reset complete \u2022 campaign continuity verified';setTimeout(()=>{hideTransition(0);rebooting=false;},520);return true;}
  function runtimeResumeFailed(info={}){clearResumeWatchdog();metrics.resumeFailures+=1;rebooting=false;transitionTitle.textContent='RECOVERY CHECK REQUIRED';transitionStatus.textContent=String(info.message||'The post-mission autosave could not be restored.');transitionDetail.textContent='The verified autosave remains available. Retry it or continue to the start screen.';recoveryActions.classList.add('active');transition.setAttribute('aria-busy','false');transition.classList.add('active');if(lastAudioState.musicPlaying)fadeBridge(targetBridgeVolume(lastAudioState),220);return false;}
  function retryVerifiedAutosave(){if(!lastVerifiedToken)return;metrics.recoveryRetries+=1;try{sessionStorage.setItem(RESUME_TOKEN_KEY,JSON.stringify(lastVerifiedToken));}catch{}rebooting=true;showTransition('RETRYING MISSION DEBRIEF','Reloading the verified post-mission autosave...','After Action Report \u2022 recovery retry');destroyAndBootRuntime();}
  function continueFreshRuntime(){clearResumeWatchdog();try{sessionStorage.removeItem(RESUME_TOKEN_KEY);}catch{}lastVerifiedToken=null;rebooting=false;if(lastAudioState.musicPlaying)fadeBridge(0,260);hideTransition(0);}
  retryButton.addEventListener('click',retryVerifiedAutosave);
  continueButton.addEventListener('click',continueFreshRuntime);
  window.__AEGIS_HOST_API={runtimeDisposal:'remove-and-recreate-iframe',audioBridge:'persistent-host-audio',recovery:'verified-autosave-retry-or-start-screen',syncAudio,runtimeReady,runtimeMusicStarted,runtimeResumeComplete,runtimeResumeFailed,beginPostMissionTransition,cancelPostMissionTransition,requestRuntimeReboot};
  window.__AEGIS_RUNTIME_REBOOT_REPORT=()=>({build:BUILD,rebooting,metrics:JSON.parse(JSON.stringify(metrics)),audio:{...lastAudioState},bridge:{paused:bridge.paused,volume:bridge.volume,src:bridge.getAttribute('src')||'',primed:metrics.bridgePrimed},recovery:{hasVerifiedToken:Boolean(lastVerifiedToken),watchdogArmed:Boolean(resumeWatchdog),actionsVisible:recoveryActions.classList.contains('active')}});
  try{const pending=JSON.parse(sessionStorage.getItem(RESUME_TOKEN_KEY)||'null');if(validResumeToken(pending)){lastVerifiedToken={...pending};rebooting=true;showTransition('RESTORING MISSION DEBRIEF','Loading the verified post-mission autosave...','After Action Report \u2022 command continuity');if(lastAudioState.musicPlaying){ensureBridgePrimed(lastAudioState,false);fadeBridge(targetBridgeVolume(lastAudioState),180);}armResumeWatchdog();}else if(pending){sessionStorage.removeItem(RESUME_TOKEN_KEY);}}catch{}
  bootRuntime();
})();
</script>
</body>
</html>
`;

const packaged = template
  .replaceAll("__BUILD__", build)
  .replaceAll("__SOURCE_BYTES__", String(sourceBytes.length))
  .replaceAll("__PAYLOAD_SHA256__", payloadSha256)
  .replace("__PAYLOAD__", payload);

fs.writeFileSync(outputPath, packaged, "utf8");
console.log(`Packaged ${path.relative(root, sourcePath)} -> ${path.relative(root, outputPath)} (${sourceBytes.length} source bytes, sha256 ${payloadSha256}).`);
