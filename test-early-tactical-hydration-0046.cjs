const fs=require('fs');
const s=fs.readFileSync('src/browser-runtime.html','utf8');
const start=s.indexOf('const[coversState,setCoversState]=useState(()=>{');
const end=s.indexOf('});const coversRef=',start);
if(start<0||end<0) throw new Error('covers initializer not found');
const init=s.slice(start,end);
const checks={
  'cached cover branch is explicit':init.includes('if(cachedBattleState?.covers)'),
  'cached branch does not require seasonal map helper':!init.slice(0,init.indexOf('if(typeof tacticalPrepareMissionCovers0044')).includes('seasonalHalloweenMapDecorations('),
  'cached branch does not require seasonal deployment helper':!init.slice(0,init.indexOf('if(typeof tacticalPrepareMissionCovers0044')).includes('seasonalHalloweenDeploymentDecorations('),
  'perimeter repair is guarded':init.includes('typeof tacticalRestoreMissingBuildingPerimeterAuthority==="function"'),
  '0044 preparation is guarded':init.includes('typeof tacticalPrepareMissionCovers0044==="function"'),
  'fallback returns saved covers':init.includes('return savedFirst'),
  'save format remains four':s.includes('CURRENT_SAVE_FORMAT_VERSION=4')||s.includes('CURRENT_SAVE_FORMAT_VERSION = 4')
};
let ok=true;for(const [k,v] of Object.entries(checks)){console.log(`${v?'PASS':'FAIL'} ${k}`);if(!v)ok=false;}if(!ok)process.exit(1);
