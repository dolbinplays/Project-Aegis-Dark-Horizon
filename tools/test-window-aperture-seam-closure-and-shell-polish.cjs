const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{test}=require('node:test');
const source=fs.readFileSync(path.join(__dirname,'../src/browser-runtime.html'),'utf8');
function functionSource(name){
  const needle=`function ${name}`,start=source.indexOf(needle);assert.ok(start>=0,`${name} source`);
  const header=source.slice(start,start+1600),bodyMatch=/\)\s*\{/.exec(header);assert.ok(bodyMatch,`${name} opening brace`);
  const brace=start+bodyMatch.index+bodyMatch[0].lastIndexOf('{');let depth=0,quote=null,escape=false,templateDepth=0;
  for(let i=brace;i<source.length;i++){const ch=source[i],next=source[i+1];if(quote){if(escape){escape=false;continue;}if(ch==='\\'){escape=true;continue;}if(quote==='`'&&ch==='$'&&next==='{'){templateDepth+=1;i+=1;continue;}if(quote==='`'&&templateDepth>0){if(ch==='{')templateDepth+=1;else if(ch==='}')templateDepth-=1;continue;}if(ch===quote)quote=null;continue;}if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue;}if(ch==='{')depth+=1;else if(ch==='}'&&--depth===0)return source.slice(start,i+1);}throw new Error(`Unable to extract ${name}`);
}
const ctx=vm.createContext({Math,String,Number,Object,Boolean});
vm.runInContext(functionSource('tacticalThreeBuildingWindowGeometrySpec'),ctx);
const spec=vm.runInContext('tacticalThreeBuildingWindowGeometrySpec({visual:"building-window-brick-ew"})',ctx);
const eps=1e-9;
const lowerHalf=spec.wallBaseHeight*spec.lowerScaleY/2,upperHalf=spec.wallBaseHeight*spec.upperScaleY/2,jambHalf=spec.wallBaseHeight*spec.jambScaleY/2;
const lowerBottom=spec.lowerCenterY-lowerHalf,lowerTop=spec.lowerCenterY+lowerHalf,upperBottom=spec.upperCenterY-upperHalf,upperTop=spec.upperCenterY+upperHalf,jambBottom=spec.jambCenterY-jambHalf,jambTop=spec.jambCenterY+jambHalf;

test('window patch marker is present and save format remains 4',()=>{
  assert.match(source,/TACTICAL_BUILDING_WINDOW_APERTURE_SEAM_CLOSURE_PATCH=true/);
  assert.match(source,/const CURRENT_SAVE_FORMAT_VERSION=4/);
});

test('shared window geometry spans the same full-height shell envelope as a solid wall',()=>{
  assert.ok(Math.abs(lowerBottom-spec.wallBottom)<eps,`lower begins at full wall bottom (${lowerBottom} vs ${spec.wallBottom})`);
  assert.ok(Math.abs(upperTop-spec.wallTop)<eps,`upper ends at full wall top (${upperTop} vs ${spec.wallTop})`);
  assert.ok(lowerTop>jambBottom,'lower wall overlaps jamb bottom instead of leaving a slit');
  assert.ok(jambTop>upperBottom,'jamb top overlaps upper wall instead of leaving a slit');
  assert.ok(spec.wallBottom<0,'full envelope reaches through the local ground seam like solid wall');
  assert.ok(spec.wallTop>1.7,'full envelope reaches the ordinary solid wall roof line');
});

test('glass pane fills the intended aperture without replacing solid wall above or below',()=>{
  const paneBottom=spec.paneCenterY-spec.paneHeight/2,paneTop=spec.paneCenterY+spec.paneHeight/2;
  assert.ok(paneBottom<=spec.apertureBottom+spec.seamOverlap,'pane reaches lower frame overlap');
  assert.ok(paneTop>=spec.apertureTop-spec.seamOverlap,'pane reaches upper frame overlap');
  assert.ok(spec.paneWidth<spec.wallBaseWidth*spec.wallScaleX,'pane remains inside the facade width');
  assert.ok(spec.apertureBottom>spec.wallBottom&&spec.apertureTop<spec.wallTop,'solid wall remains above and below the actual window opening');
});

test('fallback and persistent Three.js paths consume the shared window geometry contract',()=>{
  const fallback=functionSource('TacticalIsoThreeView'),persistent=functionSource('tacticalThreePersistentBuildCovers');
  assert.ok((fallback.match(/tacticalThreeBuildingWindowGeometrySpec/g)||[]).length>=2,'fallback uses shared spec for aperture and connectors');
  assert.ok((persistent.match(/tacticalThreeBuildingWindowGeometrySpec/g)||[]).length>=4,'persistent uses shared spec for aperture/connectors/pane/glow');
  for(const text of [fallback,persistent]){
    assert.match(text,/windowAperture="lower-sealed"/);
    assert.match(text,/windowAperture="upper-sealed"/);
    assert.match(text,/windowAperture="jamb-sealed"/);
  }
});

test('persistent architecture keeps the window roof line aligned with neighboring solid walls',()=>{
  const persistent=functionSource('tacticalThreePersistentBuildCovers');
  assert.match(persistent,/eave\.position\.y=1\.86/);
  assert.doesNotMatch(persistent,/eave\.position\.y=visual\.includes\("window"\)\?1\.26:1\.86/);
  assert.match(persistent,/windowWallConnector="lower-sealed"/);
  assert.match(persistent,/windowWallConnector="upper-sealed"/);
});

test('window seam repair preserves the actual transparent aperture and does not create a full wall across it',()=>{
  const persistent=functionSource('tacticalThreePersistentBuildCovers');
  assert.match(persistent,/if\(!isWindow\)\{const wall=/);
  assert.match(persistent,/pane\.userData\.windowApertureSealed=true/);
  assert.match(persistent,/depthWrite:false,doubleSide:true/);
  assert.match(functionSource('tacticalThreeBuildingWindowGeometrySpec'),/orientationKey=visual\.endsWith\('-ns'\)\?'ns':'ew'/);
});
