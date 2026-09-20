// Installed only in the explicitly requested building-editor preview runtime.
window.AEGIS_INSTALL_BUILDING_EDITOR=function(a,token){
  const peer=window.parent.parent,send=(type,data={})=>peer.postMessage({aegisBuildingEditor:token,type,...data},'*');
  let layout=null,mission=null,covers=[],units=[],revision=0;
  const root=ReactDOM.createRoot(document.getElementById('root'));
  const all=new Set(Array.from({length:32*32},(_,i)=>`${i%32},${Math.floor(i/32)}`));
  document.body.style.overflow='hidden';
  function draw(){
    root.render(React.createElement('div',{style:{height:'100vh',width:'100vw',background:'#020617'}},React.createElement(a.View,{
      mission,units,covers,visibleRows:Array.from({length:32},(_,y)=>y),startX:6,startY:6,viewSize:20,gridSize:32,
      visibleByHumans:()=>true,explored:all,reachableCells:new Set(),selected:units[0]||null,shotFx:null,movingUnit:null,
      cellClick:(x,y)=>send('cell',{x:x-10,y:y-10}),renderQuality:'performance',fitMap:false,zoomLevel:1,
      cameraFocus:{x:14,y:14,kind:'building-editor',revision},onRendererFailure:reason=>send('error',{message:String(reason)})
    })));
  }
  function load(value){layout=a.api.shape(value);mission={id:`building-editor-${++revision}`,kind:'Town Abduction',region:'Europe',threat:1,tacticalMapTier:'small',buildingLayoutPreview:layout,clock:{month:1,dayOfMonth:1,minute:720}};covers=a.covers(mission).map(c=>({...c,revealed:true}));units=[];draw();return a.api.validate(layout);}
  function baseline(){
    const b={...a.residence,id:'editor-residence',x:10,y:10,shapeFamily:'O',shapeRotation:0};
    b.footprintCells=a.footprint(b);b.doors=a.doors(b);
    const doorKeys=new Set(b.doors.map(p=>`${p.x},${p.y}`));
    const value={schema:'aegis-building-layout-v1',archetype:'residence',name:'Family Residence',width:9,height:8,footprint:b.footprintCells.map(p=>({x:p.x-10,y:p.y-10})),items:a.perimeter(b).map(p=>({x:p.x-10,y:p.y-10,type:doorKeys.has(`${p.x},${p.y}`)?'door':!a.facade(b,p).corner&&(p.x+p.y)%3===0?'window':'wall'}))};
    for(const p of a.furnishings(b)){value.items.push({x:p.x-10,y:p.y-10,type:'prop',visual:p.visual,rotation:p.furnishingRotation||0});if(![10,11].every(y=>a.api.validate(value,{x:10,y}).ok))value.items.pop();}
    return value;
  }
  window.addEventListener('message',event=>{
    const m=event.data;if(event.source!==peer||m?.aegisBuildingEditor!==token)return;
    try{
      let result;
      if(m.type==='load')result={validation:load(m.layout),layout};
      else if(m.type==='baseline'){const value=baseline();result={layout:value,validation:load(value)};}
      else if(m.type==='publish'){result={layout:a.api.publish(m.layout)};}
      else if(m.type==='clear'){a.api.clear();result={};}
      else if(m.type==='walk'){
        const valid=a.api.validate(layout);if(!valid.ok)throw Error('Resolve validation errors before the walking test.');
        if(!units.length){const b=a.plans(mission)[0],d=b.doors[0],keys=new Set(b.footprintCells.map(p=>`${p.x},${p.y}`)),spawn=a.neighbors(d.x,d.y).find(p=>!keys.has(`${p.x},${p.y}`));if(!spawn)throw Error('No exterior approach.');units=[{id:'layout-tester',name:'Layout Tester',team:'human',alive:true,hp:40,maxHp:40,tu:999,maxTu:999,x:spawn.x,y:spawn.y,facing:'N',revealed:true,gridSize:32}];}
        const target={x:m.x+10,y:m.y+10},path=a.path(units[0],target,covers,units,128);
        if(!path)throw Error('The tactical pathfinder cannot reach that cell.');
        a.autoDoors(covers,path,units[0]);units=[{...units[0],...target}];draw();result={message:`Tactical path accepted (${Math.max(0,path.length-1)} steps); crossed doors opened.`,path:path.map(p=>({x:p.x-10,y:p.y-10}))};
      }else if(m.type==='generation'){
        if(!a.api.validate(layout).ok)throw Error('Resolve validation errors before testing mission generation.');
        let testMission,home;
        for(let i=0;i<32&&!home;i++){testMission={id:`building-layout-generation-${i}`,kind:'Town Abduction',region:'Europe',threat:2,tacticalMapTier:'medium',authoredBuildingLayout:a.api.copy(layout)};home=a.plans(testMission).find(b=>b.authoredLayout);}
        if(!home)throw Error('No legal residence site was found in the test missions.');
        const generated=a.generate(testMission),expected=a.api.covers(layout,home);
        const missing=expected.filter(c=>!generated.some(p=>p.buildingId===c.buildingId&&p.x===c.x&&p.y===c.y&&p.visual===c.visual));
        if(missing.length)throw Error(`${missing.length} authored items did not survive battlefield generation.`);
        result={message:`Mission generation passed: all ${expected.length} authored items retained in a ${generated.length}-cover battlefield.`};
      }else if(m.type==='door'){if(!units.length)throw Error('Walk a tester near a door first.');const next=a.toggleDoor({unit:units[0],covers,units,turn:'human'});if(!next.ok)throw Error(next.reason||'No usable adjacent door.');covers=next.covers;units=[next.unit];draw();result={message:`Door ${next.reason}.`};}
      else if(m.type==='roundtrip'){if(!mission)throw Error('Load a layout first.');const saved=JSON.stringify({mission,covers,units});({mission,covers,units}=JSON.parse(saved));draw();result={message:'Fixture serialized and restored: layout, tester, and door states retained.'};}
      else return;
      send('result',{request:m.request,result});
    }catch(e){send('result',{request:m.request,error:e.message});}
  });
  const props=(window.AEGIS_PROP_LIBRARY?.props||[]).filter(p=>p.visualKey?.startsWith('interior-')).map(p=>({visual:p.visualKey,name:p.name||p.label||p.visualKey}));
  send('ready',{layout:baseline(),props});
};
