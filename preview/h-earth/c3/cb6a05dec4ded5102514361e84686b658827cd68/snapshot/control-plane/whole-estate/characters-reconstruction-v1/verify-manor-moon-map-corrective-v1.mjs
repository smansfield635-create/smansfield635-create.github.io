#!/usr/bin/env node
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';

const here=dirname(fileURLToPath(import.meta.url));
const root=resolve(here,'../../../..');
const read=path=>readFileSync(resolve(root,path),'utf8');
const sha256=text=>createHash('sha256').update(text).digest('hex');
const checks=[];
const check=(name,pass,detail='')=>checks.push({name,pass:Boolean(pass),detail});

const app=read('characters/app.mjs');
const traversal=read('characters/cloud-traversal.mjs');
const manor=read('characters/manor-world-geometry.mjs');
const coast=read('characters/coast-map-stand-ui.mjs');
const originalVerifier=read('control-plane/whole-estate/characters-reconstruction-v1/verify-manor-moon-traversal-composition-v1.mjs');
const hydrology=read('characters/gratitude-geography.adapter.mjs');

check('G4_OPERATION_ID_PRESERVED',app.includes("CHARACTERS_ENVIRONMENT_MANOR_MOON_TRAVERSAL_COMPOSITION_SUCCESSOR_20260911_001"));
check('G4_MANOR_IMPORT_PRESERVED',app.includes("./manor-world-geometry.mjs"));
check('G4_CLOUD_TRAVERSAL_IMPORT_PRESERVED',app.includes("./cloud-traversal.mjs"));
check('PASS_STATIC_BINDING_PRESERVED',manor.includes('audit.passStatic'));
check('DONOR_AUDIT_NOT_BYPASSED',!manor.includes('audit.pass===true')&&!manor.includes('|| true'));
check('LEGACY_RIVER_PRESENTATION_ABSENT',!coast.includes('riverWeight'));
check('CANONICAL_HYDROLOGY_AUTHORITY_STILL_CONSUMED',coast.includes('sampleGratitudeWorld')&&coast.includes('GRATITUDE_GEOGRAPHY_ADAPTER_ID'));
check('HYDROLOGY_SOURCE_PRESENT',hydrology.includes('hydrology'));
check('SPECULATIVE_POINTER_SAFEGUARD_ABSENT',!app.includes("canvas.style.pointerEvents='none'"));
check('ORIGINAL_G4_VERIFIER_PRESENT',originalVerifier.includes('CHARACTERS_MANOR_MOON_TRAVERSAL_COMPOSITION_QUALIFICATION_v1'));
check('CLOUD_TRAVERSAL_STATE_MACHINE_PRESENT',traversal.includes('CLOUD_TRAVEL_STATES'));

let audit=null;
try{
  const module=await import(resolve(root,'assets/manor-blueprint/manor.estate.gothic-detail-phase3.mjs'));
  audit=module.auditPhase3();
  check('ADOPTED_PHASE3_DONOR_AUDIT_TRUE',audit?.passStatic===true,JSON.stringify(audit));
}catch(error){
  check('ADOPTED_PHASE3_DONOR_AUDIT_TRUE',false,String(error?.stack||error));
}

let originalVerifierPass=false;
try{
  execFileSync(process.execPath,[resolve(root,'control-plane/whole-estate/characters-reconstruction-v1/verify-manor-moon-traversal-composition-v1.mjs')],{cwd:root,stdio:'pipe',env:{...process.env,CHARACTERS_G4_SUCCESSOR_REQUALIFICATION:'1'}});
  originalVerifierPass=true;
}catch(error){
  originalVerifierPass=false;
}
check('ORIGINAL_G4_VERIFIER_EXECUTION_PASS',originalVerifierPass);

const failed=checks.filter(item=>!item.pass);
const receipt={
  schema:'CHARACTERS_G4_MANOR_MOON_MAP_CORRECTIVE_RECEIPT_v1',
  operationId:'CHARACTERS_G4_MANOR_MOON_MAP_PRESENTATION_SUCCESSOR_20260911_001',
  result:failed.length?'FAIL_CLOSED':'PASS_CLOSED',
  checks,
  fingerprints:{app:sha256(app),cloudTraversal:sha256(traversal),manorWorldGeometry:sha256(manor),coastMapStandUi:sha256(coast),originalVerifier:sha256(originalVerifier)},
  auditPassStatic:audit?.passStatic===true
};
writeFileSync('/tmp/characters-manor-moon-map-corrective-v1.json',JSON.stringify(receipt,null,2));
console.log(JSON.stringify(receipt,null,2));
if(failed.length)process.exit(1);
