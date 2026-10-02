(function(root){
 'use strict';
 const HIRE_COST=120;
 const ROLE_NAMES=['Rifleman','Medic','Scout','Heavy','Sniper','Engineer','Assault','Officer'];
 const number=(v,max=10000)=>Math.min(max,Math.max(0,Math.floor(Number(v)||0)));
 const uniqStrings=value=>Array.isArray(value)?[...new Set(value.filter(x=>typeof x==='string'&&x.trim()).map(x=>x.trim()))]:[];
 const choices=(value,legacy='')=>{const raw=Array.isArray(value)?value:(legacy?[legacy]:[]),clean=[];for(const item of raw){const name=String(item||'').trim();if(name&&!clean.includes(name))clean.push(name);if(clean.length>=3)break;}while(clean.length<3)clean.push('');return clean;};
 const inheritBool=value=>value===true||value===false?value:null;
 const medkitPolicy=(value,allowInherit=false)=>{const allowed=allowInherit?['inherit','keep','issue','remove']:['keep','issue','remove'];return allowed.includes(value)?value:(allowInherit?'inherit':'keep');};
 function normalizeOverride(value={}){
  const v=value||{};
  return{weaponChoices:choices(v.weaponChoices,v.weapon),armorChoices:choices(v.armorChoices,v.armor),medkit:medkitPolicy(v.medkit,true),bandages:inheritBool(v.bandages),refillMedkits:inheritBool(v.refillMedkits)};
 }
 function normalizeSquadPolicy(value={}){
  const v=value||{},roleOverrides={};
  for(const role of ROLE_NAMES)roleOverrides[role]=normalizeOverride(v.roleOverrides?.[role]||{});
  return{enabled:v.enabled===true,weaponChoices:choices(v.weaponChoices,v.weapon),armorChoices:choices(v.armorChoices,v.armor),medkit:medkitPolicy(v.medkit,true),bandages:inheritBool(v.bandages),refillMedkits:inheritBool(v.refillMedkits),roleOverrides};
 }
 function normalizeLocks(value={}){
  const out={};if(!value||typeof value!=='object')return out;
  Object.entries(value).forEach(([id,lock])=>{if(typeof id!=='string'||!lock||typeof lock!=='object')return;const next={weapon:lock.weapon===true,armor:lock.armor===true,medkit:lock.medkit===true};if(next.weapon||next.armor||next.medkit)out[id]=next;});return out;
 }
 function normalize(value={}){
  const v=value||{},out={lastRunKey:String(v.lastRunKey||''),log:Array.isArray(v.log)?v.log.slice(0,40):[]};
  for(const role of ['quartermaster','personnel']){
   const p=v[role]||{};
   out[role]={hired:p.hired===true,enabled:p.hired===true&&p.enabled===true,baseId:String(p.baseId||''),squadIds:uniqStrings(p.squadIds),treasuryFloor:number(p.treasuryFloor??500),budget:number(p.budget??240),autoBuy:p.autoBuy===true,weapon:String(p.weapon||''),armor:String(p.armor||''),weaponChoices:choices(p.weaponChoices,p.weapon),armorChoices:choices(p.armorChoices,p.armor),medkit:medkitPolicy(p.medkit),bandages:p.bandages!==false,refillMedkits:p.refillMedkits!==false,includeReserves:p.includeReserves===true,reserves:number(p.reserves,50),stock:p.stock&&typeof p.stock==='object'?Object.fromEntries(Object.entries(p.stock).map(([k,n])=>[k,number(n,100)])):{Bandage:6,'Medical Supplies':6}};
  }
  const qm=out.quartermaster,rawQm=v.quartermaster||{},squadPolicies={};
  if(rawQm.squadPolicies&&typeof rawQm.squadPolicies==='object')Object.entries(rawQm.squadPolicies).forEach(([id,policy])=>{if(typeof id==='string')squadPolicies[id]=normalizeSquadPolicy(policy);});
  qm.squadPolicies=squadPolicies;qm.equipmentLocks=normalizeLocks(rawQm.equipmentLocks);qm.policyVersion=2;
  return out;
 }
 function mergeChoices(base,next){const c=choices(next);return c.some(Boolean)?c:choices(base);}
 function resolvedPolicy(qm={},squadId='',soldier={}){
  let out={weaponChoices:choices(qm.weaponChoices,qm.weapon),armorChoices:choices(qm.armorChoices,qm.armor),medkit:medkitPolicy(qm.medkit),bandages:qm.bandages!==false,refillMedkits:qm.refillMedkits!==false};
  const squad=squadId&&qm.squadPolicies?.[squadId]?.enabled?qm.squadPolicies[squadId]:null;
  if(squad){out={...out,weaponChoices:mergeChoices(out.weaponChoices,squad.weaponChoices),armorChoices:mergeChoices(out.armorChoices,squad.armorChoices),medkit:squad.medkit==='inherit'?out.medkit:squad.medkit,bandages:squad.bandages===null?out.bandages:squad.bandages,refillMedkits:squad.refillMedkits===null?out.refillMedkits:squad.refillMedkits};}
  const role=ROLE_NAMES.includes(String(soldier?.specialization||''))?String(soldier.specialization):'Rifleman';
  const override=squad?.roleOverrides?.[role];
  if(override)out={...out,weaponChoices:mergeChoices(out.weaponChoices,override.weaponChoices),armorChoices:mergeChoices(out.armorChoices,override.armorChoices),medkit:override.medkit==='inherit'?out.medkit:override.medkit,bandages:override.bandages===null?out.bandages:override.bandages,refillMedkits:override.refillMedkits===null?out.refillMedkits:override.refillMedkits};
  return{...out,role};
 }
 function run(data,api){
  const heads=normalize(data.departmentHeads),notes=[],bases=data.bases||[];
  let funds=Math.max(0,Number(data.funds)||0),soldiers=(data.soldiers||[]).map(s=>({...s})),squads=(data.squads||[]).map(s=>({...s,soldierIds:[...(s.soldierIds||[])]})),pending=(data.pendingRecruitments||[]).map(p=>({...p}));
  const inventories=api.normalizeBaseInventories(data.baseInventories,bases,data.gearInventory);
  if(data.activeMission||data.simPlayback||(data.skyrangerTravels||[]).length)return{blocked:true,notes:['Departments wait until all sorties have returned.'],funds,soldiers,squads,pendingRecruitments:pending,baseInventories:inventories,gearInventory:data.gearInventory||{},quartermasterSpent:0,personnelSpent:0};
  const home=(s,b)=>s.status!=='KIA'&&!api.soldierInTransit(s)&&api.soldierStationedAtBase(s,b,bases[0]?.id,bases);
  const managed=(p,b)=>squads.filter(s=>p.squadIds.includes(s.id)&&!s.retired&&api.squadStationingBaseId(s,soldiers,bases,b.id)===b.id);
  let personnelSpent=0,quartermasterSpent=0;
  const staff=heads.personnel,b=bases.find(b=>b.id===staff.baseId);
  if(staff.enabled&&b){
   const teams=managed(staff,b),assigned=new Set(squads.flatMap(s=>s.soldierIds)),pool=soldiers.filter(s=>home(s,b)&&s.status==='Ready'&&!assigned.has(s.id));
   for(const team of teams){team.soldierIds=team.soldierIds.filter(id=>soldiers.some(s=>s.id===id&&s.status!=='KIA'));while(team.soldierIds.length<api.squadCapacity(team,data.skyrangerSquadSize)&&pool.length){const s=pool.shift();team.soldierIds.push(s.id);notes.push(`Personnel: assigned ${s.name} to ${team.name}.`);}}
   const members=new Set(teams.flatMap(t=>t.soldierIds)),available=soldiers.filter(s=>home(s,b)&&(!assigned.has(s.id)||members.has(s.id))).length,wanted=teams.reduce((n,t)=>n+api.squadCapacity(t,data.skyrangerSquadSize),0)+staff.reserves,ordered=pending.filter(p=>p.type==='soldier'&&p.baseId===b.id).length,headCount=Number(heads.quartermaster.hired)+Number(heads.personnel.hired);
   let room=Math.max(0,api.capacity(bases)-api.personnelUsed(soldiers,data.scientists||0,data.engineers||0)-pending.length-headCount),spent=0;
   for(let missing=Math.max(0,wanted-available-ordered);missing>0;missing--){if(room<=0||spent+120>staff.budget||funds-120<staff.treasuryFloor){notes.push('Personnel: remaining recruitment waits for housing, budget or treasury reserve.');break;}pending.push({id:api.uid(),type:'soldier',baseId:b.id,baseName:b.name,daysLeft:3});funds-=120;spent+=120;room--;notes.push(`Personnel: ordered one soldier for ${b.name} ($120k; 3 days).`);}personnelSpent=spent;
  }
  const qm=heads.quartermaster,base=bases.find(b=>b.id===qm.baseId);
  if(qm.enabled&&base){
   let stock=api.localBaseInventoryForBase(inventories,base,bases,data.gearInventory),spent=0;const warnings=new Set();
   const buy=(name,targetCount)=>{const wanted=Math.max(0,number(targetCount,999)),missing=Math.max(0,wanted-(stock[name]||0));if(!missing)return 0;const item=api.supplyCatalogEntry(name),price=api.marketBuyPrice(name);if(!qm.autoBuy||!item?.purchasable||!price||item.requiresTech&&!(data.tech||[]).includes(item.requiresTech)){warnings.add(`${name}: insufficient local stock; buy, transfer or manufacture supplies.`);return 0;}let bought=0;for(let i=0;i<missing;i++){const next={...stock,[name]:(stock[name]||0)+1};if(spent+price>qm.budget||funds-price<qm.treasuryFloor||api.storageStatusForInventory(next,[base]).over){warnings.add(`${name}: purchase waits for storage, budget or treasury reserve.`);break;}stock=next;funds-=price;spent+=price;bought++;}return bought;};
   const teams=managed(qm,base),ids=new Set(teams.flatMap(s=>s.soldierIds)),allAssigned=new Set(squads.flatMap(s=>s.soldierIds)),teamBySoldier=new Map();teams.forEach(team=>(team.soldierIds||[]).forEach(id=>teamBySoldier.set(id,team)));
   const itemUsable=(name,type)=>{const item=api.supplyCatalogEntry(name);return Boolean(name&&item?.type===type&&(!item.requiresTech||(data.tech||[]).includes(item.requiresTech)));};
   const chooseItem=(list,type,current)=>{for(const name of choices(list)){if(!name||!itemUsable(name,type))continue;if(current===name)return name;if(!(stock[name]>0))buy(name,1);if(stock[name]>0)return name;}return current;};
   soldiers=soldiers.map(original=>{
    if(!home(original,base)||!ids.has(original.id)&&!(qm.includeReserves&&!allAssigned.has(original.id)))return original;
    const team=teamBySoldier.get(original.id)||null,policy=resolvedPolicy(qm,team?.id||'',original),locks=qm.equipmentLocks?.[original.id]||{},before={weapon:original.equipment,armor:original.armor,medkit:Boolean(original.medkit),bandages:api.soldierBandageCount(original),charges:api.soldierMedicalCharges(original)};let s=original;
    for(const [field,type,list,lockKey] of [['equipment','weapon',policy.weaponChoices,'weapon'],['armor','armor',policy.armorChoices,'armor']]){if(locks[lockKey])continue;const name=chooseItem(list,type,s[field]);if(!name||s[field]===name)continue;const next={...stock,[name]:Math.max(0,(stock[name]||0)-1)};if(api.isRemovableInventoryItem(s[field]))next[s[field]]=(next[s[field]]||0)+1;if(api.storageStatusForInventory(next,[base]).over){warnings.add(`${s.name}: equipment exchange waits for storage space to return the old item.`);continue;}stock=next;s={...s,[field]:name};}
    if(!locks.medkit&&policy.medkit!=='keep'&&!(data.tech||[]).includes('Field Medkits')&&policy.medkit==='issue')warnings.add(`${s.name}: Medkit issue requires Field Medkits research.`);else if(!locks.medkit&&policy.medkit!=='keep'){if(policy.medkit==='issue'&&!s.medkit&&!(stock['Empty Medkit']>0))buy('Medkit',1);const changed=api.changeSoldierMedkitState(s,stock,policy.medkit==='issue');if(changed.ok&&!api.storageStatusForInventory(changed.inventory,[base]).over){s=changed.soldier;stock=changed.inventory;}}
    if(policy.bandages){buy('Bandage',Math.max(0,api.soldierBandageCapacity(s)-api.soldierBandageCount(s)));const r=api.refillSoldierBandagesState(s,stock);if(r.ok){s=r.soldier;stock=r.inventory;}}
    if(policy.refillMedkits&&s.medkit){buy('Medical Supplies',Math.max(0,api.tacticalFieldMedkitCapacity(s)-api.soldierMedicalCharges(s)));const r=api.refillSoldierMedkitState(s,stock);if(r.ok){s=r.soldier;stock=r.inventory;}}
    const after={weapon:s.equipment,armor:s.armor,medkit:Boolean(s.medkit),bandages:api.soldierBandageCount(s),charges:api.soldierMedicalCharges(s)},changes=[];
    if(before.weapon!==after.weapon)changes.push(`weapon ${before.weapon||'none'} -> ${after.weapon||'none'}`);if(before.armor!==after.armor)changes.push(`armor ${before.armor||'none'} -> ${after.armor||'none'}`);if(before.medkit!==after.medkit)changes.push(after.medkit?'Medkit issued':'Medkit returned');if(before.bandages!==after.bandages)changes.push(`Bandages ${before.bandages} -> ${after.bandages}`);if(before.charges!==after.charges)changes.push(`Medkit charges ${before.charges} -> ${after.charges}`);
    if(changes.length)notes.push(`Quartermaster: ${s.name} [${team?.name||'Reserve'} / ${policy.role}] — ${changes.join('; ')}.`);return s;
   });
   for(const [name,count] of Object.entries(qm.stock||{}))if(count>0)buy(name,count);
   inventories[base.id]=stock;quartermasterSpent=spent;if(spent)notes.push(`Quartermaster: market purchases $${spent}k at ${base.name}.`);notes.push(...[...warnings].map(s=>'Quartermaster: '+s));
  }
  return{funds,soldiers,squads,pendingRecruitments:pending,baseInventories:inventories,gearInventory:api.aggregateBaseInventories(inventories,bases,data.gearInventory),notes,quartermasterSpent,personnelSpent};
 }
 function preview(data,api){const heads=normalize(data.departmentHeads);heads.personnel={...heads.personnel,enabled:false};const result=run({...data,departmentHeads:heads},api);return{blocked:result.blocked===true,spend:Math.max(0,Number(data.funds||0)-Number(result.funds||0)),notes:result.notes||[]};}
 function Panel({heads,bases,squads,soldiers=[],items,onChange,onHire,onRun,onPreview,previewResult}){
  const h=root.React.createElement;
  const box='rounded-xl border border-cyan-500/30 bg-slate-900 p-4';
  const sub='rounded-lg border border-slate-700 bg-slate-950/55 p-3';
  const input='rounded border border-slate-500 bg-slate-950 p-2 text-white w-full';
  const numberField=(label,value,change,max=10000)=>h('label',{className:'block text-sm'},label,h('input',{type:'number',min:0,max,value,className:input,onChange:e=>change(number(e.target.value,max))}));
  const selectField=(label,value,change,options)=>h('label',{className:'block text-sm'},label,h('select',{className:input,value,onChange:e=>change(e.target.value)},options.map(([v,t])=>h('option',{key:v,value:v},t))));
  const checkField=(label,value,change)=>h('label',{className:'flex gap-2 items-center text-sm'},h('input',{type:'checkbox',checked:!!value,onChange:e=>change(e.target.checked)}),label);
  const itemOptions=(type,inherit=false)=>[[ '', inherit?'Inherit':'Keep current' ],...items.filter(i=>i.type===type).map(i=>[i.name,i.name])];
  const choiceEditor=(label,list,change,type,inherit=false)=>h('div',{className:sub},h('div',{className:'mb-2 text-sm font-bold'},label),...['Preferred','Acceptable','Fallback'].map((tier,index)=>selectField(tier,list?.[index]||'',value=>{const next=choices(list);next[index]=value;change(next);},itemOptions(type,inherit))));
  const cards=[];
  for(const role of ['quartermaster','personnel']){
   const p=heads[role],change=patch=>onChange(role,patch),content=[];
   if(!p.hired){content.push(h('button',{key:'hire',className:input,onClick:()=>onHire(role)},'Hire — $120k'));}
   else{
    content.push(checkField('Automation enabled',p.enabled,v=>change({enabled:v})));
    content.push(selectField('Home base',p.baseId,v=>change({baseId:v}),[['','Choose a base'],...bases.map(b=>[b.id,b.name])]));
    content.push(numberField('Treasury reserve ($k)',p.treasuryFloor,v=>change({treasuryFloor:v})));
    content.push(numberField('Maximum spending per review ($k)',p.budget,v=>change({budget:v})));
    content.push(h('fieldset',{key:'managed',className:box},h('legend',null,'Managed squads (local squads only)'),...squads.filter(s=>!s.retired).map(s=>h('label',{key:s.id,className:'flex gap-2'},h('input',{type:'checkbox',checked:p.squadIds.includes(s.id),onChange:e=>change({squadIds:e.target.checked?[...p.squadIds,s.id]:p.squadIds.filter(id=>id!==s.id)})}),s.name))));
    if(role==='personnel'){
     content.push(numberField('Extra unassigned reserve soldiers',p.reserves,v=>change({reserves:v}),50));
     content.push(h('p',{key:'personnel-copy',className:'text-sm'},'Fills selected squads from local Ready soldiers, then recruits for shortages. Wounded soldiers and recruits already ordered count toward strength. Recruiting costs $120k with the usual 3-day arrival.'));
    }else{
     content.push(checkField('Include unassigned reserves',p.includeReserves,v=>change({includeReserves:v})));
     content.push(checkField('Buy shortages from the market',p.autoBuy,v=>change({autoBuy:v})));
     content.push(h('details',{key:'default',open:true,className:sub},h('summary',{className:'cursor-pointer font-bold'},'Default loadout doctrine'),choiceEditor('Weapon preference chain',p.weaponChoices,v=>change({weaponChoices:v,weapon:v[0]||''}),'weapon'),choiceEditor('Armor preference chain',p.armorChoices,v=>change({armorChoices:v,armor:v[0]||''}),'armor'),selectField('Medkit',p.medkit,v=>change({medkit:v}),[['keep','Keep current'],['issue','Issue'],['remove','Return to stores']]),checkField('Refill carried bandages',p.bandages,v=>change({bandages:v})),checkField('Refill carried medkits',p.refillMedkits,v=>change({refillMedkits:v}))));
     const squadChildren=[];
     for(const id of p.squadIds){
      const squad=squads.find(s=>s.id===id);if(!squad)continue;
      const policy=p.squadPolicies?.[id]||normalizeSquadPolicy({});
      const update=patch=>change({squadPolicies:{...p.squadPolicies,[id]:{...policy,...patch}}});
      const inner=[checkField('Use squad-specific doctrine',policy.enabled,v=>update({enabled:v}))];
      if(policy.enabled){
       inner.push(choiceEditor('Squad weapon chain',policy.weaponChoices,v=>update({weaponChoices:v}),'weapon',true));
       inner.push(choiceEditor('Squad armor chain',policy.armorChoices,v=>update({armorChoices:v}),'armor',true));
       inner.push(selectField('Squad Medkit policy',policy.medkit,v=>update({medkit:v}),[['inherit','Inherit default'],['keep','Keep current'],['issue','Issue'],['remove','Return to stores']]));
       inner.push(selectField('Bandage refill',policy.bandages===null?'inherit':policy.bandages?'yes':'no',v=>update({bandages:v==='inherit'?null:v==='yes'}),[['inherit','Inherit default'],['yes','Refill'],['no','Do not refill']]));
       inner.push(selectField('Medkit refill',policy.refillMedkits===null?'inherit':policy.refillMedkits?'yes':'no',v=>update({refillMedkits:v==='inherit'?null:v==='yes'}),[['inherit','Inherit default'],['yes','Refill'],['no','Do not refill']]));
       const roleCards=[];
       for(const roleName of ROLE_NAMES){
        const ov=policy.roleOverrides?.[roleName]||normalizeOverride({});
        const setOv=patch=>update({roleOverrides:{...policy.roleOverrides,[roleName]:{...ov,...patch}}});
        roleCards.push(h('details',{key:roleName,className:'rounded border border-slate-700 p-2'},h('summary',{className:'cursor-pointer text-sm font-semibold'},`${roleName} override`),choiceEditor('Weapon override',ov.weaponChoices,v=>setOv({weaponChoices:v}),'weapon',true),choiceEditor('Armor override',ov.armorChoices,v=>setOv({armorChoices:v}),'armor',true),selectField('Medkit override',ov.medkit,v=>setOv({medkit:v}),[['inherit','Inherit squad/default'],['keep','Keep current'],['issue','Issue'],['remove','Return to stores']])));
       }
       inner.push(h('div',{key:'roles',className:'space-y-1'},...roleCards));
      }
      squadChildren.push(h('details',{key:id,className:'mt-2 rounded-lg border border-cyan-700/40 p-2'},h('summary',{className:'cursor-pointer font-bold'},squad.name),...inner));
     }
     content.push(h('details',{key:'squads',className:sub},h('summary',{className:'cursor-pointer font-bold'},'Per-squad and role loadout doctrines'),...(squadChildren.length?squadChildren:[h('p',{key:'none',className:'text-sm opacity-70'},'Select at least one managed squad to create squad-specific doctrines.')] )));
     const managedIds=new Set(squads.filter(s=>p.squadIds.includes(s.id)).flatMap(s=>s.soldierIds||[]));
     const lockRows=soldiers.filter(s=>managedIds.has(s.id)&&s.status!=='KIA').map(s=>{const lock=p.equipmentLocks?.[s.id]||{};const setLock=(key,value)=>change({equipmentLocks:{...p.equipmentLocks,[s.id]:{...lock,[key]:value}}});return h('div',{key:s.id,className:'mt-2 rounded border border-slate-700 p-2 text-sm'},h('b',null,`${s.name} — ${s.specialization||'Rifleman'}`),h('div',{className:'mt-1 grid gap-1 sm:grid-cols-3'},checkField('Lock weapon',lock.weapon,v=>setLock('weapon',v)),checkField('Lock armor',lock.armor,v=>setLock('armor',v)),checkField('Lock Medkit',lock.medkit,v=>setLock('medkit',v))));});
     content.push(h('details',{key:'locks',className:sub},h('summary',{className:'cursor-pointer font-bold'},'Soldier equipment locks'),...(lockRows.length?lockRows:[h('p',{key:'none',className:'text-sm opacity-70'},'No soldiers are currently assigned to managed squads.')])));
     const reserveRows=items.filter(i=>['weapon','armor','supply','medical'].includes(i.type)||['Bandage','Medical Supplies','Medkit','Empty Medkit'].includes(i.name)).map(item=>h('div',{key:item.name,className:'mt-1'},numberField(item.name,p.stock?.[item.name]||0,v=>change({stock:{...p.stock,[item.name]:v}}),100)));
     content.push(h('details',{key:'stock',className:sub},h('summary',{className:'cursor-pointer font-bold'},'Mission-ready reserve stock targets'),h('p',{className:'mb-2 text-xs opacity-70'},'Targets are checked after soldier resupply. Market-purchasable shortages may be bought when Auto Buy is enabled; Workshop-only shortages are reported but never manufactured automatically.'),...reserveRows));
    }
   }
   cards.push(h('div',{key:role,className:box},h('h3',{className:'text-lg font-bold'},role==='quartermaster'?'Quartermaster Head':'Personnel Head'),h('div',{className:'space-y-3'},...content)));
  }
  const previewBox=previewResult?h('div',{className:box,'data-aegis-quartermaster-preview':true},h('h3',{className:'font-bold'},`Quartermaster preview — projected spend $${previewResult.spend||0}k`),previewResult.blocked?h('p',{className:'text-sm'},'Review is currently blocked while a sortie is away.'):previewResult.notes?.length?previewResult.notes.slice(0,12).map((line,i)=>h('p',{key:i,className:'text-sm'},line)):h('p',{className:'text-sm'},'No changes or purchases would be needed.')):null;
  return h('section',{className:'space-y-4 p-4','data-aegis-department-heads':true},h('h2',{className:'text-xl font-black'},'Department Heads'),h('p',null,'Hire a head for $120k and one personnel berth, then enable their policy. Automatic reviews run once per campaign day, after mission returns and recruit arrivals. All sorties must be home. Budgets apply per review.'),...cards,h('div',{className:'grid gap-2 sm:grid-cols-2'},h('button',{className:input,onClick:onPreview},'Preview Quartermaster review'),h('button',{className:input,onClick:onRun},'Run review now')),previewBox,h('div',{className:box},h('h3',{className:'font-bold'},'Latest department activity'),heads.log.length?heads.log.map((line,i)=>h('p',{key:i,className:'text-sm'},line)):h('p',null,'No reviews yet.')));
 }
 root.AEGIS_DEPARTMENT_HEADS={normalize,run,preview,Panel,HIRE_COST,ROLE_NAMES,resolvedPolicy};
})(typeof window!=='undefined'?window:globalThis);
