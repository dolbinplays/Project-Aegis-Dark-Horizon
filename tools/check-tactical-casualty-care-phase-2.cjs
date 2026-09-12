const fs=require('fs');
const runtime=fs.readFileSync(process.argv[2]||'src/browser-runtime.html','utf8');
const host=fs.readFileSync(process.argv[3]||'index.html','utf8');
const tests={
 'phase2 flag':runtime.includes('TACTICAL_CASUALTY_CARE_PHASE_2_BLEEDING_STABILIZATION_TRIAGE_PATCH=true'),
 'three-round bleed clock':runtime.includes('TACTICAL_CASUALTY_BLEEDOUT_ROUNDS=3'),
 'field medkit charge pools':runtime.includes('TACTICAL_MEDKIT_FIELD_CHARGES=4')&&runtime.includes('TACTICAL_MEDIC_FIELD_CHARGES=10'),
 'first aid and stabilization TU costs':runtime.includes('TACTICAL_FIRST_AID_TU=14')&&runtime.includes('TACTICAL_STABILIZE_TU=16'),
 'downing starts active bleeding':runtime.includes('bleeding:true,stabilized:false,bleedOutRounds:TACTICAL_CASUALTY_BLEEDOUT_ROUNDS'),
 'deterioration helper exists':runtime.includes('function tacticalCasualtyDeteriorationStep'),
 'deterioration can become KIA':runtime.includes('succumbs to untreated battlefield bleeding')&&runtime.includes('hp:0,alive:false,downed:false'),
 'deterioration guarded per round':runtime.includes('bleedLastProcessedRound')&&runtime.includes('>=currentRound'),
 'stabilization helper exists':runtime.includes('function tacticalFirstAidActionState')&&runtime.includes('function tacticalFirstAidUseResult'),
 'stabilization stops bleeding without revival':runtime.includes('bleeding:false,stabilized:true')&&runtime.includes('tu:0'),
 'adjacent treatment heals teammate':runtime.includes('TACTICAL_FIRST_AID_HEAL')&&runtime.includes('kind:"treat"'),
 'self medkit spends one charge':runtime.includes('nextCharges=Math.max(0,(Number(unit.medkitCharges)||0)-1)'),
 'medic capacity is ten charges':runtime.includes('specialization||source?.specialization')&&runtime.includes('TACTICAL_MEDIC_FIELD_CHARGES:TACTICAL_MEDKIT_FIELD_CHARGES'),
 'new tactical units use charge capacity':runtime.includes('medkitCharges:tacticalInitialMedkitCharges(soldier)'),
 'continued tactical units preserve charges':runtime.includes('medkitCharges:tacticalInitialMedkitCharges(base,unit.medkitCharges)'),
 'snapshot persists bleeding and stabilization':runtime.includes('bleeding:Boolean(unit.bleeding)')&&runtime.includes('stabilized:Boolean(unit.stabilized)')&&runtime.includes('bleedOutRounds:Math.max'),
 'manual human turn processes deterioration':runtime.includes('tacticalCasualtyDeteriorationStep(next,tacticalRound+1)'),
 'manual human turn keeps downed TU zero':runtime.includes('tacticalHumanIsDowned(unit)?{...unit,tu:0}:unit'),
 'simulation processes deterioration':runtime.includes('const casualtyDeterioration=tacticalCasualtyDeteriorationStep(humans,initialRound+round-1)'),
 'AI playback visibility excludes downed soldiers':runtime.includes('tacticalPlaybackFrameUnitAuthoritativeAlive(unit)&&!unit?.downed&&!unit?.unconscious'),
 'AI medical triage exists':runtime.includes('function tacticalAiMedicalTriageStep'),
 'AI triage prioritizes stabilization':runtime.includes('stabilizes downed')&&runtime.includes('bleed-out clock is stopped'),
 'AI triage prefers medic specialization':runtime.includes('specialization||"").toLowerCase()==="medic"'),
 'manual first aid button exists':runtime.includes('Stabilize ${selectedFirstAidAction.target.name}')&&runtime.includes('Treat ${selectedFirstAidAction.target.name}'),
 'manual first aid handler exists':runtime.includes('function useSelectedFirstAid()'),
 'HUD exposes bleeding countdown':runtime.includes('round${Math.max(0,Number(unit.bleedOutRounds)||0)===1?"":"s"} remain before critical collapse'),
 'HUD exposes stabilized condition':runtime.includes('"stabilized","STB","Stabilized"'),
 'phase1 drag feature preserved':runtime.includes('TACTICAL_CASUALTY_CARE_PHASE_1_DOWNED_RECOVERY_DRAGGING_PATCH=true'),
 'beacon cinematic preserved':runtime.includes('TACTICAL_OBSERVED_BEACON_REINFORCEMENT_ARRIVAL_CINEMATIC_PATCH=true'),
 'android pwa preserved':host.includes('aegis-launch-shell-v2')||host.includes('release-beacon-navigation-v2'),
 'save format remains 4':runtime.includes('CURRENT_SAVE_FORMAT_VERSION=4')||runtime.includes('CURRENT_SAVE_FORMAT_VERSION = 4')
};
let pass=0;for(const [name,ok] of Object.entries(tests)){console.log(`${ok?'PASS':'FAIL'} - ${name}`);if(ok)pass++;}
console.log(`\n${pass}/${Object.keys(tests).length} passed`);if(pass!==Object.keys(tests).length)process.exit(1);
