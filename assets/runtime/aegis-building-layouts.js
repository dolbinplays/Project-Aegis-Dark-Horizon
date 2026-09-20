(function(root){
'use strict';
const SCHEMA='aegis-building-layout-v1',KEY='aegis-building-layout-published-v1';
const copy=value=>JSON.parse(JSON.stringify(value));
function create(a){
  function shape(layout){
    if(!layout||layout.schema!==SCHEMA||layout.archetype!=='residence')throw Error('Choose a residence layout in aegis-building-layout-v1 format.');
    if(layout.width!==9||layout.height!==8)throw Error('The foundation patch supports the existing 9 × 8 residence footprint.');
    if(!Array.isArray(layout.footprint)||layout.footprint.length<9||layout.footprint.length>72||!Array.isArray(layout.items)||layout.items.length>144)throw Error('Invalid footprint or item count.');
    const coord=p=>p&&Number.isInteger(p.x)&&Number.isInteger(p.y)&&p.x>=0&&p.y>=0&&p.x<9&&p.y<8;
    if(!layout.footprint.every(coord)||!layout.items.every(coord))throw Error('Cells must be whole numbers inside the footprint bounds.');
    const keys=new Set(layout.footprint.map(p=>`${p.x},${p.y}`));
    if(keys.size!==layout.footprint.length)throw Error('The footprint contains duplicate cells.');
    if(layout.items.some(p=>!keys.has(`${p.x},${p.y}`)||!['wall','window','door','prop'].includes(p.type)))throw Error('Every item must occupy a footprint cell and have a supported type.');
    if(layout.items.some(p=>p.type==='prop'&&(!a.propExists(p.visual)||!Number.isFinite(p.rotation||0))))throw Error('A furnishing is missing from the shared prop library or has an invalid rotation.');
    return {schema:SCHEMA,archetype:'residence',name:String(layout.name||'Family Residence').slice(0,80),width:9,height:8,footprint:layout.footprint.map(({x,y})=>({x,y})),items:layout.items.map(p=>({x:p.x,y:p.y,type:p.type,...(p.type==='prop'?{visual:p.visual,rotation:Number(p.rotation)||0}:{})}))};
  }
  function plan(layout,base){return {...base,label:layout.name,authoredLayout:layout,footprintCells:layout.footprint.map(p=>({x:base.x+p.x,y:base.y+p.y})),doors:layout.items.filter(p=>p.type==='door').map(p=>({x:base.x+p.x,y:base.y+p.y}))};}
  function covers(layout,building){
    return layout.items.map((p,i)=>{
      const cell={x:building.x+p.x,y:building.y+p.y},orientation=a.facade(building,cell).horizontal?'ew':'ns';
      const visual=p.type==='prop'?p.visual:`building-${p.type}-${building.wall}${p.type==='door'?'-closed':''}-${orientation}`;
      const powerControl=p.type==='prop'&&visual==='interior-power-panel';
      const block=powerControl?0.5:p.type==='prop'?a.furnishingBlock(visual):p.type==='window'?0.5:1;
      return {...cell,...a.coverStats(block,visual),id:`${building.id}-authored-${i}`,visual,structural:powerControl?false:p.type!=='prop'||block>0,buildingId:building.id,buildingLabel:building.label,buildingPart:powerControl?'power-control':p.type==='prop'?'furnishing':p.type,authoredBuildingLayout:true,buildingShapeFamily:building.shapeFamily||'O',buildingShapeRotation:Number(building.shapeRotation)||0,...(p.type==='prop'?{furnishingRotation:p.rotation||0,furnishingCover:!powerControl,shelterCoverPriority:block}:{buildingWallMaterial:building.wall}),...(powerControl?{powerControl:true,powerCircuitId:building.id}:{}),...(p.type==='door'?{hp:70,maxHp:70,doorState:'closed',doorLocked:false,doorOrientation:orientation,doorMaterial:building.wall}:{})};
    });
  }
  function validate(input,origin={x:10,y:10}){
    let layout;try{layout=shape(input);}catch(e){return {ok:false,errors:[e.message],warnings:[],reachable:[]};}
    const building=plan(layout,{id:'authored-validation',key:'residence',wall:'brick',...origin,width:9,height:8}),records=covers(layout,building),errors=[],warnings=[];
    const key=p=>`${p.x},${p.y}`,footprint=new Set(building.footprintCells.map(key)),perimeter=a.perimeter(building),byCell=new Map(),blockedCells=new Set();
    for(const c of records){for(const p of a.coverCells(c)){const k=key(p);if(byCell.has(k))errors.push(`Overlapping items at ${p.x-origin.x}, ${p.y-origin.y}.`);byCell.set(k,c);if(a.blocks(c))blockedCells.add(k);if(!footprint.has(k))errors.push('A prop extends outside the building footprint.');}}
    for(const p of perimeter){if(!['wall','window','door'].includes(byCell.get(key(p))?.buildingPart))errors.push(`Exterior seam gap at ${p.x-origin.x}, ${p.y-origin.y}.`);}
    const doors=records.filter(c=>c.buildingPart==='door'),edgeKeys=new Set(perimeter.map(key));
    const exteriorDoors=doors.filter(d=>edgeKeys.has(key(d)));
    if(!exteriorDoors.length)errors.push('Add at least one exterior door.');
    const blocked=p=>blockedCells.has(key(p));
    for(const d of doors){const nearby=a.neighbors(d.x,d.y).filter(p=>footprint.has(key(p))&&!edgeKeys.has(key(p)));if(!nearby.some(p=>!blocked(p)))errors.push(`Door has no clear interior approach at ${d.x-origin.x}, ${d.y-origin.y}.`);if(nearby.some(p=>byCell.has(key(p))))errors.push(`Door swing / approach clearance conflict at ${d.x-origin.x}, ${d.y-origin.y}.`);}
    const reachable=new Set(),queue=exteriorDoors.map(d=>({x:d.x,y:d.y}));
    for(let i=0;i<queue.length;i++){const p=queue[i],k=key(p);if(reachable.has(k)||blocked(p))continue;reachable.add(k);for(const next of a.neighbors(p.x,p.y))if(footprint.has(key(next))&&!reachable.has(key(next))&&!blocked(next))queue.push(next);}
    const unreachable=building.footprintCells.filter(p=>!blocked(p)&&!reachable.has(key(p)));
    if(unreachable.length)errors.push(`${unreachable.length} walkable cells are unreachable from an exterior entrance.`);
    // Cardinal connectivity is the existing building-footprint contract.
    const seen=new Set(),todo=[building.footprintCells[0]];for(let i=0;i<todo.length;i++){const p=todo[i];if(seen.has(key(p)))continue;seen.add(key(p));for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const n={x:p.x+dx,y:p.y+dy};if(footprint.has(key(n))&&!seen.has(key(n)))todo.push(n);}}
    if(seen.size!==footprint.size)errors.push('The footprint must be connected.');
    return {ok:!errors.length,errors:[...new Set(errors)],warnings,reachable:[...reachable].map(k=>{const [x,y]=k.split(',').map(Number);return{x:x-origin.x,y:y-origin.y};})};
  }
  function publish(input){const layout=shape(input);for(const y of [10,11]){const report=validate(layout,{x:10,y});if(!report.ok)throw Error(report.errors.join('\n'));}root.localStorage.setItem(KEY,JSON.stringify(layout));return layout;}
  function read(){try{const value=JSON.parse(root.localStorage.getItem(KEY)||'null');if(!value)return null;const layout=shape(value);return [10,11].every(y=>validate(layout,{x:10,y}).ok)?layout:null;}catch{return null;}}
  return {shape,plan,covers,validate,publish,read,clear:()=>root.localStorage.removeItem(KEY),copy};
}
root.AEGIS_BUILDING_LAYOUTS={create,SCHEMA,KEY};
})(typeof window==='undefined'?globalThis:window);
