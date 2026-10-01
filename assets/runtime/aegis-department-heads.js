(function(root){
 'use strict';
 const HIRE_COST=120;
 const number=(v,max=10000)=>Math.min(max,Math.max(0,Math.floor(Number(v)||0)));
 function normalize(value={}){
  const v=value||{},out={lastRunKey:String(v.lastRunKey||''),log:Array.isArray(v.log)?v.log.slice(0,30):[]};
  for(const role of ['quartermaster','personnel']){
   const p=v[role]||{};
   out[role]={hired:p.hired===true,enabled:p.hired===true&&p.enabled===true,baseId:String(p.baseId||''),squadIds:Array.isArray(p.squadIds)?[...new Set(p.squadIds.filter(x=>typeof x==='string'))]:[],treasuryFloor:number(p.treasuryFloor??500),budget:number(p.budget??240),autoBuy:p.autoBuy===true,weapon:String(p.weapon||''),armor:String(p.armor||''),medkit:['keep','issue','remove'].includes(p.medkit)?p.medkit:'keep',bandages:p.bandages!==false,refillMedkits:p.refillMedkits!==false,includeReserves:p.includeReserves===true,reserves:number(p.reserves,50),stock:p.stock&&typeof p.stock==='object'?Object.fromEntries(Object.entries(p.stock).map(([k,n])=>[k,number(n,100)])): {Bandage:6,'Medical Supplies':6}};
  }
  return out;
 }
 function run(data,api){
  const heads=normalize(data.departmentHeads),notes=[],bases=data.bases||[];
  let funds=Math.max(0,Number(data.funds)||0),soldiers=(data.soldiers||[]).map(s=>({...s})),squads=(data.squads||[]).map(s=>({...s,soldierIds:[...(s.soldierIds||[])]})),pending=(data.pendingRecruitments||[]).map(p=>({...p}));
  const inventories=api.normalizeBaseInventories(data.baseInventories,bases,data.gearInventory);
  if(data.activeMission||data.simPlayback||(data.skyrangerTravels||[]).length)return{blocked:true,notes:['Departments wait until all sorties have returned.']};
  const home=(s,b)=>s.status!=='KIA'&&!api.soldierInTransit(s)&&api.soldierStationedAtBase(s,b,bases[0]?.id,bases);
  const managed=(p,b)=>squads.filter(s=>p.squadIds.includes(s.id)&&!s.retired&&api.squadStationingBaseId(s,soldiers,bases,b.id)===b.id);
  const staff=heads.personnel,b=bases.find(b=>b.id===staff.baseId);
  if(staff.enabled&&b){
   const teams=managed(staff,b),assigned=new Set(squads.flatMap(s=>s.soldierIds)),pool=soldiers.filter(s=>home(s,b)&&s.status==='Ready'&&!assigned.has(s.id));
   for(const team of teams){
    team.soldierIds=team.soldierIds.filter(id=>soldiers.some(s=>s.id===id&&s.status!=='KIA'));
    while(team.soldierIds.length<api.squadCapacity(team,data.skyrangerSquadSize)&&pool.length){const s=pool.shift();team.soldierIds.push(s.id);notes.push(`Personnel: assigned ${s.name} to ${team.name}.`);}
   }
   const members=new Set(teams.flatMap(t=>t.soldierIds));
   const available=soldiers.filter(s=>home(s,b)&&(!assigned.has(s.id)||members.has(s.id))).length;
   const wanted=teams.reduce((n,t)=>n+api.squadCapacity(t,data.skyrangerSquadSize),0)+staff.reserves;
   const ordered=pending.filter(p=>p.type==='soldier'&&p.baseId===b.id).length;
   const headCount=Number(heads.quartermaster.hired)+Number(heads.personnel.hired);
   let room=Math.max(0,api.capacity(bases)-api.personnelUsed(soldiers,data.scientists||0,data.engineers||0)-pending.length-headCount),spent=0;
   for(let missing=Math.max(0,wanted-available-ordered);missing>0;missing--){
    if(room<=0||spent+120>staff.budget||funds-120<staff.treasuryFloor){notes.push('Personnel: remaining recruitment waits for housing, budget or treasury reserve.');break;}
    pending.push({id:api.uid(),type:'soldier',baseId:b.id,baseName:b.name,daysLeft:3});funds-=120;spent+=120;room--;notes.push(`Personnel: ordered one soldier for ${b.name} ($120k; 3 days).`);
   }
  }
  const qm=heads.quartermaster,base=bases.find(b=>b.id===qm.baseId);
  if(qm.enabled&&base){
   let stock=api.localBaseInventoryForBase(inventories,base,bases,data.gearInventory),spent=0;
   const warnings=new Set();
   const buy=(name,count)=>{
    const missing=Math.max(0,count-(stock[name]||0));if(!missing)return;
    const item=api.supplyCatalogEntry(name),price=api.marketBuyPrice(name);
    if(!qm.autoBuy||!item?.purchasable||!price||item.requiresTech&&!(data.tech||[]).includes(item.requiresTech)){warnings.add(`${name}: insufficient local stock; buy, transfer or manufacture supplies.`);return;}
    for(let i=0;i<missing;i++){
     const next={...stock,[name]:(stock[name]||0)+1};
     if(spent+price>qm.budget||funds-price<qm.treasuryFloor||api.storageStatusForInventory(next,[base]).over){warnings.add(`${name}: purchase waits for storage, budget or treasury reserve.`);break;}
     stock=next;funds-=price;spent+=price;
    }
   };
   const ids=new Set(managed(qm,base).flatMap(s=>s.soldierIds)),allAssigned=new Set(squads.flatMap(s=>s.soldierIds));
   soldiers=soldiers.map(original=>{
    if(!home(original,base)||!ids.has(original.id)&&!(qm.includeReserves&&!allAssigned.has(original.id)))return original;
    let s=original;
    for(const [field,type,name] of [['equipment','weapon',qm.weapon],['armor','armor',qm.armor]]){
     if(!name||s[field]===name)continue;
     const item=api.supplyCatalogEntry(name);
     if(item?.type!==type||item.requiresTech&&!(data.tech||[]).includes(item.requiresTech)){warnings.add(`${name}: unavailable or research required.`);continue;}
     buy(name,1);if(!(stock[name]>0))continue;
     const next={...stock,[name]:stock[name]-1};if(api.isRemovableInventoryItem(s[field]))next[s[field]]=(next[s[field]]||0)+1;
     if(api.storageStatusForInventory(next,[base]).over){warnings.add('Equipment exchange waits for space to return the old item.');continue;}
     stock=next;s={...s,[field]:name};
    }
    if(qm.medkit!=='keep'&&!(data.tech||[]).includes('Field Medkits')&&qm.medkit==='issue')warnings.add('Medkit issue requires Field Medkits research.');
    else if(qm.medkit!=='keep'){
     if(qm.medkit==='issue'&&!s.medkit&&!(stock['Empty Medkit']>0))buy('Medkit',1);
     const changed=api.changeSoldierMedkitState(s,stock,qm.medkit==='issue');
     if(changed.ok&&!api.storageStatusForInventory(changed.inventory,[base]).over){s=changed.soldier;stock=changed.inventory;}
    }
    if(qm.bandages){buy('Bandage',Math.max(0,api.soldierBandageCapacity(s)-api.soldierBandageCount(s)));const r=api.refillSoldierBandagesState(s,stock);if(r.ok){s=r.soldier;stock=r.inventory;}}
    if(qm.refillMedkits&&s.medkit){buy('Medical Supplies',Math.max(0,api.tacticalFieldMedkitCapacity(s)-api.soldierMedicalCharges(s)));const r=api.refillSoldierMedkitState(s,stock);if(r.ok){s=r.soldier;stock=r.inventory;}}
    if(JSON.stringify(s)!==JSON.stringify(original))notes.push(`Quartermaster: equipped/resupplied ${s.name}.`);
    return s;
   });
   for(const [name,count] of Object.entries(qm.stock))buy(name,count);
   inventories[base.id]=stock;if(spent)notes.push(`Quartermaster: market purchases $${spent}k at ${base.name}.`);notes.push(...[...warnings].map(s=>'Quartermaster: '+s));
  }
  return{funds,soldiers,squads,pendingRecruitments:pending,baseInventories:inventories,gearInventory:api.aggregateBaseInventories(inventories,bases,data.gearInventory),notes};
 }
 function Panel({heads,bases,squads,items,onChange,onHire,onRun}){
  const h=root.React.createElement,box='rounded-xl border border-cyan-500/30 bg-slate-900 p-4',input='rounded border border-slate-500 bg-slate-950 p-2 text-white w-full';
  const numberField=(label,value,change,max=10000)=>h('label',{className:'block text-sm'},label,h('input',{type:'number',min:0,max,value,className:input,onChange:e=>change(number(e.target.value,max))}));
  return h('section',{className:'space-y-4 p-4','data-aegis-department-heads':true},h('h2',{className:'text-xl font-black'},'Department Heads'),
   h('p',null,'Hire a head for $120k and one personnel berth, then enable their policy. Automatic reviews run once per campaign day, after mission returns and recruit arrivals. All sorties must be home. Budgets below apply per review; Run review now can spend another budget.'),
   ...['quartermaster','personnel'].map(role=>{const p=heads[role],change=patch=>onChange(role,patch),check=(label,key)=>h('label',{className:'flex gap-2 items-center'},h('input',{type:'checkbox',checked:!!p[key],onChange:e=>change({[key]:e.target.checked})}),label);
    const select=(label,key,options)=>h('label',{className:'block text-sm'},label,h('select',{className:input,value:p[key],onChange:e=>change({[key]:e.target.value})},options.map(([value,text])=>h('option',{key:value,value},text))));
    return h('div',{key:role,className:box},h('h3',{className:'text-lg font-bold'},role==='quartermaster'?'Quartermaster Head':'Personnel Head'),!p.hired?h('button',{className:input,onClick:()=>onHire(role)},'Hire — $120k'):h('div',{className:'space-y-3'},check('Automation enabled','enabled'),select('Home base','baseId',[['','Choose a base'],...bases.map(b=>[b.id,b.name])]),numberField('Treasury reserve ($k)',p.treasuryFloor,v=>change({treasuryFloor:v})),numberField('Maximum spending per review ($k)',p.budget,v=>change({budget:v})),h('fieldset',{className:box},h('legend',null,'Managed squads (local squads only)'),squads.filter(s=>!s.retired).map(s=>h('label',{key:s.id,className:'flex gap-2'},h('input',{type:'checkbox',checked:p.squadIds.includes(s.id),onChange:e=>change({squadIds:e.target.checked?[...p.squadIds,s.id]:p.squadIds.filter(id=>id!==s.id)})}),s.name))),role==='personnel'?h('div',null,numberField('Extra unassigned reserve soldiers',p.reserves,v=>change({reserves:v}),50),h('p',{className:'text-sm'},'Fills selected squads from local Ready soldiers, then recruits for shortages. Wounded soldiers and recruits already ordered count toward strength. Recruiting costs $120k with the usual 3-day arrival.')):h('div',{className:'space-y-3'},check('Include unassigned reserves','includeReserves'),select('Weapon','weapon',[['','Keep current'],...items.filter(i=>i.type==='weapon').map(i=>[i.name,i.name])]),select('Armor','armor',[['','Keep current'],...items.filter(i=>i.type==='armor').map(i=>[i.name,i.name])]),select('Medkit','medkit',[['keep','Keep current'],['issue','Issue'],['remove','Return to stores']]),check('Refill carried bandages','bandages'),check('Refill carried medkits','refillMedkits'),check('Buy shortages from the market','autoBuy'),h('p',{className:'text-sm'},'Advanced equipment still requires Workshop production. Ammunition, grenades and flares retain existing mission rules.'),h('fieldset',{className:box},h('legend',null,'Spare stock to retain after resupply'),['Bandage','Medical Supplies',p.weapon,p.armor].filter(Boolean).map(name=>h('div',{key:name},numberField(name,p.stock[name]||0,v=>change({stock:{...p.stock,[name]:v}}),100)))))));
   }),h('button',{className:input,onClick:onRun},'Run review now'),h('div',{className:box},h('h3',{className:'font-bold'},'Latest department activity'),heads.log.length?heads.log.map((line,i)=>h('p',{key:i,className:'text-sm'},line)):h('p',null,'No reviews yet.')));
 }
 root.AEGIS_DEPARTMENT_HEADS={normalize,run,Panel,HIRE_COST};
})(typeof window!=='undefined'?window:globalThis);
