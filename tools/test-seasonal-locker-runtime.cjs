const test=require('node:test');
const assert=require('node:assert/strict');
const {runtimeContext}=require('./runtime-test-context.cjs');
const piece=(set='vampire',copy='one')=>({itemId:`halloween:${set}:top`,setKey:set,slot:'top',label:`${set} Top`,sourceAlienId:copy});
const soldier=(id,top=null,spares=[])=>({id,name:id,status:'Ready',seasonalCosmetics:{top},seasonalSparePieces:spares});
const plain=value=>JSON.parse(JSON.stringify(value));
const copies=roster=>roster.flatMap(s=>[...Object.values(s.seasonalCosmetics||{}),...(s.seasonalSparePieces||[])]).filter(Boolean).map(p=>p.sourceAlienId).sort();

test('selecting an already equipped costume does not remove another earned copy',()=>{
  const c=runtimeContext(),roster=[soldier('a',piece('vampire','a')),soldier('b',piece('vampire','b'))];
  const result=c.seasonalLockerTransaction(roster,'b','top',piece().itemId);
  assert.deepEqual(copies(result),['a','b']);
  assert.equal(result,roster);
});

test('locker prefers spares, counts all copies and preserves displaced items',()=>{
  const c=runtimeContext(),roster=[soldier('a',piece('vampire','worn')),soldier('b',piece('witch','witch'),[piece('vampire','spare')])];
  const before=JSON.stringify(roster),result=c.seasonalLockerTransaction(roster,'b','top',piece().itemId);
  assert.equal(result[0].seasonalCosmetics.top.sourceAlienId,'worn');
  assert.equal(result[1].seasonalCosmetics.top.sourceAlienId,'spare');
  assert.deepEqual(copies(result),copies(roster));assert.equal(JSON.stringify(roster),before);
  const inventory=c.seasonalLockerInventory(roster).find(p=>p.itemId===piece().itemId);
  assert.equal(inventory.count,2);assert.equal(inventory.spareCount,1);
});

test('equipped transfer and repeated unequip preserve actual copy counts',()=>{
  const c=runtimeContext(),roster=[soldier('a',piece()),soldier('b',piece('witch','two'))];
  const moved=c.seasonalLockerTransaction(roster,'b','top',piece().itemId);
  assert.equal(moved[0].seasonalCosmetics.top,null);
  const removed=c.seasonalLockerTransaction(moved,'b','top',null);
  const again=c.seasonalLockerTransaction(removed,'b','top',null);
  assert.deepEqual(copies(again),copies(roster));assert.equal(again[1].seasonalSparePieces.length,2);
});

test('invalid slot, unavailable item and KIA target leave the collection unchanged',()=>{
  const c=runtimeContext(),roster=[soldier('a',piece()),{...soldier('b'),status:'KIA'}];
  for(const [id,slot,item] of [['b','top',piece().itemId],['a','head',piece().itemId],['a','top','missing']])
    assert.equal(c.seasonalLockerTransaction(roster,id,slot,item),roster);
});

test('empty favorite locks survive save normalization and auto assignment uses another soldier',()=>{
  const c=runtimeContext();
  const roster=[{...soldier('a'),seasonalCosmeticLocks:{top:true}},soldier('b')].map(s=>c.normalizeSoldier(plain({...c.makeSoldier(),...s})));
  const result=c.seasonalAssignDropsToRoster(roster,[piece()],['a'],{id:'mission'});
  assert.equal(result.soldiers[0].seasonalCosmetics.top,null);
  assert.equal(result.soldiers[0].seasonalCosmeticLocks.top,true);
  assert.equal(result.soldiers[1].seasonalCosmetics.top.itemId,piece().itemId);
  const locked=roster.map(s=>({...s,seasonalCosmeticLocks:{top:true}}));
  const stored=c.seasonalAssignDropsToRoster(locked,[piece()],[],{id:'next'});
  assert.equal(stored.soldiers.filter(s=>s.seasonalCosmetics.top).length,0);
  assert.equal(copies(stored.soldiers).length,1);
});

test('panel applies lock and equip changes to latest roster state, preserving queued updates',()=>{
  const c=runtimeContext({React:{useState:value=>[typeof value==='function'?value():value,()=>{}]}});c.React.createElement=(type,props,...children)=>({type,props:props||{},children:children.flat(Infinity)});
  const initial=[soldier('a',null,[piece()])];let update;
  const tree=c.SeasonalLockerPanel({soldiers:initial,onChange:value=>{update=value;}});
  const nodes=node=>node&&typeof node==='object'?[node,...(node.children||[]).flatMap(nodes)]:[];
  const all=nodes(tree),lock=all.find(n=>n.type==='input'&&n.props.type==='checkbox');
  lock.props.onChange({target:{checked:true}});assert.equal(typeof update,'function');
  const latest=[{...initial[0],xp:99},soldier('new-recruit')];
  const locked=update(latest);assert.equal(locked.length,2);assert.equal(locked[0].xp,99);
  const equip=all.find(n=>n.type==='select'&&n.children.some(option=>option?.props?.value===piece().itemId));equip.props.onChange({target:{value:piece().itemId}});
  const equipped=update(locked);assert.equal(equipped.length,2);assert.equal(equipped[0].xp,99);
  assert.equal(equipped[0].seasonalCosmeticLocks.top,true);assert.equal(equipped[0].seasonalCosmetics.top.itemId,piece().itemId);
});
