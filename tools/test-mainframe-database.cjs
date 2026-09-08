const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {test} = require('node:test');
const source = fs.readFileSync(path.join(__dirname, '../src/browser-runtime.html'), 'utf8');
const start = source.indexOf('function mainframeDatabaseIndex(');
const end = source.indexOf('function MainframeDatabaseScreen(', start);
assert.ok(start >= 0 && end > start);
const catalog = {
  'Laser Carbine': {manufactured:true, requiresTech:'Laser Weapons', desc:'Laser equipment record'},
  'Recovered Cell': {alienRecovered:true, desc:'Recovered alien equipment record'},
  'Ballistic Rifle': {desc:'Ordinary starting weapon'},
};
const context = vm.createContext({
  RESEARCH_TREE: {'Laser Weapons':{desc:'Unlocks laser equipment'}, 'Alien Alloys':{desc:'Unresearched armor secrets'}},
  ALIEN_DATABASE_INTEL: {Scout:'Autopsy-only Scout tactics', Wraith:'Autopsy-only Wraith tactics'},
  alienAutopsyTopic: name=>name+' Autopsy',
  supplyItemNames: inventory=>[...new Set([...Object.keys(catalog),...Object.keys(inventory)])],
  supplyCatalogEntry: name=>catalog[name],
  alienFieldBeaconKnowledgeConfirmed: value=>value==='confirmed',
});
vm.runInContext(source.slice(start,end),context);
const index = props=>JSON.parse(JSON.stringify(context.mainframeDatabaseIndex(props)));

test('An empty campaign exposes no species, research, equipment, or beacon files',()=>{
  const records=index({});assert.deepEqual(records.species,[]);assert.deepEqual(records.files,[]);
});
test('Identification provides the species image record while autopsy intelligence stays locked',()=>{
  const records=index({identifiedAliens:['Scout','Wraith'],tech:['Wraith Autopsy']});
  assert.equal(records.species.length,2);
  assert.equal(records.species[0].alien,'Scout');
  assert.equal(records.species[0].unlocked,false);
  assert.match(records.species[0].note,/pending$/);
  assert.ok(!JSON.stringify(records).includes('Autopsy-only Scout tactics'));
  assert.equal(records.species[1].description,'Autopsy-only Wraith tactics');
  assert.match(records.species[1].note,/complete$/);
});
test('Completed technology unlocks its file and manufactured equipment without revealing future research',()=>{
  const records=index({tech:['Laser Weapons']});
  assert.deepEqual(records.files.map(x=>x.id),['research:Laser Weapons','equipment:Laser Carbine']);
  assert.ok(!JSON.stringify(records).includes('Unresearched armor secrets'));
  assert.deepEqual(records.completedResearch,[['Laser Weapons',{desc:'Unlocks laser equipment'}]]);
});
test('Alien recovered equipment follows stock or research gates; ordinary stock is not an unlocked file',()=>{
  assert.deepEqual(index({gearInventory:{'Recovered Cell':1,'Ballistic Rifle':10,'Unknown item':1}}).unlockedEquipment,['Recovered Cell']);
  assert.deepEqual(index({gearInventory:{'Recovered Cell':0}}).unlockedEquipment,[]);
  for(const topic of ['Alien Weapon Fragments','Alien Power Cells'])assert.deepEqual(index({tech:[topic]}).unlockedEquipment,['Recovered Cell']);
  assert.deepEqual(index({gearInventory:{'Laser Carbine':1}}).unlockedEquipment,[]);
});
test('The field beacon file requires confirmed observation and does not disclose defensive adaptations',()=>{
  for(const value of ['unknown','suspected',null,undefined])assert.equal(index({alienFieldBeaconKnowledge:value}).files.length,0);
  const [record]=index({alienFieldBeaconKnowledge:'confirmed'}).files;
  assert.equal(record.id,'observation:alien-field-beacon');
  assert.match(record.description,/defensive adaptations, and other functions remain unknown/);
});
test('Browsing builds detached records without mutating campaign collections',()=>{
  const props=Object.freeze({identifiedAliens:Object.freeze(['Scout']),tech:Object.freeze(['Laser Weapons']),gearInventory:Object.freeze({'Recovered Cell':1}),alienFieldBeaconKnowledge:'confirmed'});
  const before=JSON.stringify(props),records=context.mainframeDatabaseIndex(props);
  records.species[0].label='Changed display';records.files.pop();
  assert.equal(JSON.stringify(props),before);
  assert.equal(index(props).species[0].label,'Scout');
});
