const fs=require('fs');
const crypto=require('crypto');
const path=require('path');
const root=process.cwd();
const runtimePath=path.join(root,'src','browser-runtime.html');
if(!fs.existsSync(runtimePath)){console.error('Missing src/browser-runtime.html');process.exit(2);}
const src=fs.readFileSync(runtimePath,'utf8');
const BUILD='v0.26.09.10.1223_CLASSIC_LINEUP_VISIBLE_TARGET_AND_OUTCOME_PRESERVING_FAST_PACING_HOTFIX';
const BASE_RESOLVER_HASH='03d42521a34234aeaa36fdf965efa36c696ed90b5fe0c9cbd40e08effbc97964';
function between(a,b){const i=src.indexOf(a);const j=i>=0?src.indexOf(b,i+a.length):-1;return i>=0&&j>i?src.slice(i,j):'';}
function pass(name,ok){console.log(`${ok?'PASS':'FAIL'} - ${name}`);return ok?0:1;}
let failed=0;
failed+=pass('Current build synchronized in runtime',src.includes(`const CURRENT_GAME_BUILD="${BUILD}";`));
failed+=pass('Visible-target hotfix flag enabled',src.includes('const CLASSIC_LINEUP_VISIBLE_TARGET_AND_OUTCOME_PRESERVING_FAST_PACING_HOTFIX=true;'));
failed+=pass('Quiet-action auto compaction enabled',src.includes('const CLASSIC_LINEUP_AUTO_COMPACT_QUIET_ACTIONS=true;'));
const seq=between('function tacticalAiSequentialPlaybackFrames(','function tacticalPlaybackActionMovementIds(');
failed+=pass('Sequential builder upserts missing current-action actors',seq.includes('upsertWorkingUnit')&&seq.includes('finalGroupById'));
failed+=pass('Observable human shot target is forced visible for its shot frame',seq.includes('shotPresentationTarget')&&seq.includes('revealed:true,visible:true,shotPresentationVisible:true'));
failed+=pass('Contact interrupt upserts newly revealed aliens',seq.includes('contactIds.forEach')&&seq.includes('upsertWorkingUnit(id'));
const pacing=between('function classicLineupFrameHasConsequentialPresentation(','function MissionSimulationOverlay(');
failed+=pass('Automatic pacing preserves phase-complete frames',pacing.includes('frame.phaseComplete===true')&&pacing.includes('classicLineupAutoAdvanceTargetIndex'));
failed+=pass('Automatic pacing preserves shots/contact/reinforcement/rescue transitions',pacing.includes('frame.shots')&&pacing.includes('frame.reinforcementLanding')&&pacing.includes('escortId')&&pacing.includes('rescued||civilian.extracted'));
failed+=pass('Timer-driven playback opts into compaction',src.includes('advanceSimPlayback(true)')&&src.includes('classicLineupAdaptivePlaybackDelayMs(simPlayback,simPlaybackSpeed)'));
failed+=pass('Manual Next remains single-frame by default',src.includes('function advanceSimPlayback(autoCompact=false)')&&src.includes('autoCompact===true?classicLineupAutoAdvanceTargetIndex(old):Math.min(old.frames.length-1,old.frameIndex+1)'));
const rStart=src.indexOf('function resolveMission('),rEnd=src.indexOf('\nfunction missionVictoryTrackOrder',rStart);const resolver=src.slice(rStart,rEnd);const resolverHash=crypto.createHash('sha256').update(resolver).digest('hex');
failed+=pass('resolveMission byte hash unchanged from Browser 0810',resolverHash===BASE_RESOLVER_HASH);
failed+=pass('Save format remains 4',src.includes('const CURRENT_SAVE_FORMAT_VERSION=4'));
failed+=pass('Browser 0810 streaming remains enabled',src.includes('const CLASSIC_LINEUP_STREAMED_ROLLING_BATTLE_PLANNING_AND_REINFORCEMENT_UFO_BEAM_PATCH=true;'));
failed+=pass('TACTICAL COMPUTATION remains present',src.includes('TACTICAL COMPUTATION…'));
failed+=pass('Reinforcement UFO beam remains present',src.includes('data-aegis-classic-reinforcement-ufo'));
const finishCount=(src.match(/function finishAiPlayback\(\)\{/g)||[]).length;
failed+=pass('Exactly one finishAiPlayback declaration remains',finishCount===1);
failed+=pass('Current patch history is mutable exactly once',(src.match(/PATCH_NOTES_HISTORY\.unshift\(\{build:CURRENT_GAME_BUILD,date:/g)||[]).length===1);
failed+=pass('Browser 0810 history is frozen literal',src.includes(`{build:"v0.26.09.10.0810_CLASSIC_LINEUP_STREAMED_ROLLING_BATTLE_PLANNING_AND_REINFORCEMENT_UFO_BEAM_PATCH",date:`));
failed+=pass('Patch Build Health contract is registered',src.includes('classicLineupVisibleTargetAndOutcomePreservingFastPacingContractChecks')&&src.includes('AEGIS_POST_DEFERRED_BUILD_HEALTH_RUNNER_BEFORE_CLASSIC_VISIBLE_TARGET_FAST_PACING'));
console.log(`\nFailed: ${failed}`);
process.exit(failed?1:0);
