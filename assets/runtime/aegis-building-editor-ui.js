(()=>{'use strict';
const $=id=>document.getElementById(id),token=crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random(),pending=new Map();
let peer=null,layout=null,selected=null,duplicate=null,undo=[],redo=[],serial=0,timer=0,revision=0,path=[];
const clone=x=>JSON.parse(JSON.stringify(x)),draftKey='aegis-building-layout-draft-v1';
const status=message=>$('status').textContent=message;
function request(type,data={}){return new Promise((resolve,reject)=>{if(!peer)return reject(Error('The preview is not ready.'));const id=++serial;const timeout=setTimeout(()=>{pending.delete(id);reject(Error('Preview did not respond. Reload the editor to reconnect.'));},30000);pending.set(id,{resolve,reject,timeout});peer.postMessage({aegisBuildingEditor:token,type,request:id,...data},'*');});}
async function act(fn){try{await fn();}catch(e){status(e.message);}}
function snapshot(){undo.push(clone(layout));if(undo.length>100)undo.shift();redo=[];}
function render(){
 $('grid').replaceChildren();const footprint=new Set(layout.footprint.map(p=>`${p.x},${p.y}`));
 for(let y=0;y<8;y++)for(let x=0;x<9;x++){const item=layout.items.find(p=>p.x===x&&p.y===y),b=document.createElement('button');b.type='button';b.textContent=item?({wall:'▰',window:'▥',door:'D',prop:'●'}[item.type]):'·';b.className=!footprint.has(`${x},${y}`)?'outside':item?.type||'';if(selected?.x===x&&selected?.y===y)b.classList.add('selected');if(path.some(p=>p.x===x&&p.y===y))b.classList.add('path');b.title=`${x}, ${y}: ${item?.visual||item?.type||'floor'}`;b.setAttribute('aria-label',b.title);b.onclick=()=>act(()=>cell(x,y));$('grid').append(b);}
 const item=selected&&layout.items.find(p=>p.x===selected.x&&p.y===selected.y);$('selection').textContent=selected?`Cell ${selected.x}, ${selected.y} · ${item?.visual||item?.type||'clear floor'}`:'Select a cell to inspect or edit.';
 $('name').value=layout.name;$('undo').disabled=!undo.length;$('redo').disabled=!redo.length;$('rotate').disabled=item?.type!=='prop';$('delete').disabled=!item;$('duplicate').disabled=!item;
}
function validation(report){$('validation').className=report.ok?'':'bad';$('validation').replaceChildren();const title=document.createElement('strong');title.textContent=report.ok?'Ready: entrances and walking lanes are clear.':'Resolve before publishing:';$('validation').append(title);for(const message of report.errors){const row=document.createElement('div');row.textContent=message;$('validation').append(row);}$('publish').disabled=!report.ok;}
async function sync(){clearTimeout(timer);timer=0;const current=revision;$('publish').disabled=true;const result=await request('load',{layout});if(current===revision)validation(result.validation);}
function changed(){revision++;path=[];render();$('publish').disabled=true;try{localStorage.setItem(draftKey,JSON.stringify(layout));}catch{status('Draft storage is unavailable. Export JSON to keep your work.');}clearTimeout(timer);timer=setTimeout(()=>act(sync),150);}
async function cell(x,y){if(!layout.footprint.some(p=>p.x===x&&p.y===y))return;selected={x,y};const brush=$('brush').value;
 if(brush==='walk'){if(timer)await sync();const r=await request('walk',{x,y});path=r.path;status(r.message);render();return;}
 if(brush==='select'&&!duplicate){render();return;}snapshot();layout.items=layout.items.filter(p=>p.x!==x||p.y!==y);
 if(duplicate){layout.items.push({...duplicate,x,y});duplicate=null;}
 else if(brush!=='erase')layout.items.push({x,y,type:brush,...(brush==='prop'?{visual:$('prop').value,rotation:0}:{})});changed();
}
window.addEventListener('message',event=>{const m=event.data;if(m?.aegisBuildingEditor!==token)return;if(peer&&event.source!==peer)return;
 if(m.type==='ready'){peer=event.source;layout=m.layout;for(const p of m.props){const o=document.createElement('option');o.value=p.visual;o.textContent=p.name;$('prop').append(o);}act(async()=>{let saved=null;try{saved=JSON.parse(localStorage.getItem(draftKey)||'null');}catch{}let result;try{result=await request('load',{layout:saved||m.layout});}catch{result=await request('load',{layout:m.layout});}layout=result.layout;render();validation(result.validation);for(const id of ['name','baseline','unpublish','export','import','door','roundtrip','generation'])$(id).disabled=false;status('Preview ready. Choose a brush to begin.');});}
 else if(m.type==='result'){const p=pending.get(m.request);if(!p)return;pending.delete(m.request);clearTimeout(p.timeout);m.error?p.reject(Error(m.error)):p.resolve(m.result);}
 else if(m.type==='cell'&&layout)act(()=>cell(m.x,m.y));else if(m.type==='error')status(m.message);
});
$('baseline').onclick=()=>act(async()=>{const r=await request('baseline');snapshot();layout=r.layout;selected=null;changed();});
$('name').onchange=()=>{snapshot();layout.name=$('name').value;changed();};
$('undo').onclick=()=>{redo.push(clone(layout));layout=undo.pop();changed();};$('redo').onclick=()=>{undo.push(clone(layout));layout=redo.pop();changed();};
$('delete').onclick=()=>{snapshot();layout.items=layout.items.filter(p=>p.x!==selected.x||p.y!==selected.y);changed();};
$('rotate').onclick=()=>{snapshot();const p=layout.items.find(p=>p.x===selected.x&&p.y===selected.y);p.rotation=((p.rotation||0)+Math.PI/2)%(Math.PI*2);changed();};
$('duplicate').onclick=()=>{duplicate=clone(layout.items.find(p=>p.x===selected.x&&p.y===selected.y));$('brush').value='select';status('Click a destination cell for the duplicate.');};
$('publish').onclick=()=>act(async()=>{await request('publish',{layout});status('Published. Newly generated residences on this browser/origin will use this layout.');});
$('unpublish').onclick=()=>act(async()=>{await request('clear');status('New battles will use procedural residences again.');});
$('door').onclick=()=>act(async()=>status((await request('door')).message));$('roundtrip').onclick=()=>act(async()=>status((await request('roundtrip')).message));
$('export').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(layout,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='aegis-building-layout.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('import').onclick=()=>$('file').click();$('file').onchange=()=>act(async()=>{const file=$('file').files[0];if(!file)return;if(file.size>100000)throw Error('Layout files must be smaller than 100 KB.');const value=JSON.parse(await file.text());const imported=await request('load',{layout:value});snapshot();layout=imported.layout;selected=null;changed();$('file').value='';});
$('generation').onclick=()=>act(async()=>{if(timer)await sync();status((await request('generation')).message);});
$('preview').src='./index.html?aegisBuildingEditor='+encodeURIComponent(token);
setTimeout(()=>{if(!peer)status('Preview is still loading. If it cannot start from a local file, open the editor through the same local web server as the game.');},30000);
})();
