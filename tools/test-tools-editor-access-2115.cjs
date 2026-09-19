const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const launcher=fs.readFileSync(path.join(root,'assets/runtime/aegis-tools-editor-launcher-runtime.js'),'utf8');
const sw=fs.readFileSync(path.join(root,'service-worker.js'),'utf8');
const meta=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const checks=[
 ['2115 launcher build',launcher.includes('2115_IN_GAME_TOOLS_EDITOR_RENDERED_RUNTIME_HOTFIX')],
 ['Save Load install',launcher.includes("'Save / Load Game'")&&launcher.includes('installSaveMenu')],
 ['Command Settings install',launcher.includes("'Command Settings'")&&launcher.includes('installPauseMenu')],
 ['Expanded System install',launcher.includes('installExpandedSystem')],
 ['Minimized header install',launcher.includes('installMinimizedHeader')],
 ['Tactical mini install',launcher.includes('installTacticalMini')],
 ['iframe scanning',launcher.includes('scanFrames')&&launcher.includes('frame.contentDocument')],
 ['iframe load observer',launcher.includes("frame.addEventListener('load',attach)")],
 ['per-document mutation observer',launcher.includes('observedDocuments')&&launcher.includes('new MutationObserver')],
 ['separate window editor',launcher.includes("host.open(toolUrl(path,doc),windowName)")],
 ['return message',launcher.includes("aegis-tool-return")],
 ['service worker injects launcher into shell',sw.includes('transformLaunchShell')&&sw.includes('data-aegis-tools-editor-runtime')],
 ['new launch cache key',sw.includes('aegis-launch-shell-v3-tools-editor-hotfix')],
 ['prop library bootstrap retained',sw.includes('transformedPropLibraryResponse')&&sw.includes('AEGIS_TOOLS_EDITOR_RUNTIME_URL')],
 ['release metadata 2115',meta.build.includes('2115_IN_GAME_TOOLS_EDITOR_RENDERED_RUNTIME_HOTFIX')],
 ['save format 4',meta.save_format===4]
];
let fail=0;for(const [name,pass] of checks){console.log(`${pass?'PASS':'FAIL'} ${name}`);if(!pass)fail++;}console.log(`\n${checks.length-fail}/${checks.length} PASS`);process.exitCode=fail?1:0;
