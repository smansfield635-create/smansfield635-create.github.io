#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const ROOT=process.cwd();
const CONTROL='h-earth-3d/control-plane/audralia-open-world-spatial-migration';
const VERIFIER='tools/h-earth-audralia-open-world-spatial-migration/continuity-verifier.v1.mjs';
const WORKFLOW='.github/workflows/h-earth-audralia-open-world-spatial-migration-continuity.yml';
const GOV='f5c4238adee4161cb1f3583cc52ed13eebfffa2b';
const REV10='ad9e72adb97df7ab867af1fe20df2c29de763d28';
const REV10_TREE='d630fed42bcf19a65129afbe97c1134d1d632422';
const EXPECTED_CHECKPOINTS=['OW00','OW01','OW02','OW03','OW04','OW05','OW06','OW07','OW08','OW09','OW10'];
const CONTROL_FILES=['AGENTS.md','authority-and-lineage.v1.json','changed-path-manifest.v1.json','checkpoint-registry.v1.json','construction-procedure.v1.json','continuity-state.v1.json','instrument.locator.v1.json','operation-request.v1.json','schemas.v1.json','spatial-invariants.v1.json','successor-room-recovery.v1.json','verification-contract.v1.json'].map(x=>`${CONTROL}/${x}`);
const FINGERPRINT_PATHS=[...CONTROL_FILES,VERIFIER].sort();
const EXACT_PATHS=[WORKFLOW,...CONTROL_FILES,VERIFIER].sort();
const args=new Set(process.argv.slice(2));
const outputIndex=process.argv.indexOf('--output');
const output=outputIndex>=0?process.argv[outputIndex+1]:null;
const read=p=>fs.readFileSync(path.resolve(ROOT,p),'utf8');
const json=p=>JSON.parse(read(p));
const issues=[];
const req=(ok,code)=>{if(!ok)issues.push(code);};
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');

for(const p of FINGERPRINT_PATHS)req(fs.existsSync(path.resolve(ROOT,p)),`REQUIRED_FILE_MISSING:${p}`);
if(issues.length===0){
  const locator=json(`${CONTROL}/instrument.locator.v1.json`);
  const lineage=json(`${CONTROL}/authority-and-lineage.v1.json`);
  const inv=json(`${CONTROL}/spatial-invariants.v1.json`);
  const reg=json(`${CONTROL}/checkpoint-registry.v1.json`);
  const state=json(`${CONTROL}/continuity-state.v1.json`);
  const recovery=json(`${CONTROL}/successor-room-recovery.v1.json`);
  const contract=json(`${CONTROL}/verification-contract.v1.json`);
  const manifest=json(`${CONTROL}/changed-path-manifest.v1.json`);
  const op=json(`${CONTROL}/operation-request.v1.json`);
  const proc=json(`${CONTROL}/construction-procedure.v1.json`);
  req(locator.governingHeadAtConstruction===GOV,'GOVERNING_HEAD_MISMATCH');
  req(lineage.construction?.governingHead===GOV,'LINEAGE_GOVERNING_HEAD_MISMATCH');
  req(op.exactGoverningHead===GOV&&proc.exactGoverningHead===GOV,'OPERATION_GOVERNING_HEAD_MISMATCH');
  req(locator.sourceRevision10?.commit===REV10&&locator.sourceRevision10?.tree===REV10_TREE,'REVISION_10_SOURCE_IDENTITY_MISMATCH');
  req(lineage.sourceRevision10?.commit===REV10&&lineage.sourceRevision10?.tree===REV10_TREE,'LINEAGE_REVISION_10_IDENTITY_MISMATCH');
  req(lineage.routerPrerequisite?.mergeCommit===GOV,'ROUTER_MERGE_IDENTITY_MISMATCH');
  req(inv.hierarchy?.audralia==='PLANET_WORLD_IDENTITY'&&inv.hierarchy?.hEarth==='PLAYER_EXPERIENCE_ON_AUDRALIA_NOT_SEPARATE_PLANET','WORLD_HIERARCHY_INVALID');
  req(inv.hierarchy?.continentCount===9&&inv.hierarchy?.resolvedContinent==='GRATITUDE','CONTINENT_IDENTITY_INVALID');
  req(inv.hierarchy?.nineSummitsRelationship==='INTERNAL_TO_GRATITUDE_NOT_ONE_SUMMIT_PER_CONTINENT','NINE_SUMMITS_CONTINENT_CONFLATION');
  const law=new Map((inv.laws??[]).map(x=>[x.id,x.required]));
  for(const id of ['AUTHORING_REGION_NOT_WORLD_BOUNDARY','CURRENT_TRAVERSAL_BOUNDARY_NOT_PERMANENT_WORLD_BOUNDARY','GRATITUDE_SCALE_COMPRESSION_PROHIBITED','GRATITUDE_HARBOR_MUST_BIND_TO_TRUE_CONTINENTAL_COAST','MOUNTAINS_AND_WATERSHEDS_MUST_CONTINUE_INLAND_BEYOND_CURRENT_DETAIL_FOOTPRINT','FINAL_CONTINENT_MORPHOLOGY_MUST_BE_ORGANIC_COMPOUND_NOT_RADIAL_BLOB','STARTING_POINT_TRAVERSAL_RANGE_EXPANSION_REQUIRED'])req(law.get(id)===true,`OPEN_WORLD_INVARIANT_MISSING:${id}`);
  req(Array.isArray(inv.coordinateHierarchy)&&inv.coordinateHierarchy.join('>')==='AUDRALIA_GLOBAL_COORDINATES>GRATITUDE_CONTINENT_COORDINATES>GRATITUDE_ENTRY_REGION_COORDINATES>CURRENT_LOCAL_GRATITUDE_COORDINATES','COORDINATE_HIERARCHY_INVALID');
  const ids=(reg.checkpoints??[]).map(x=>x.id);
  req(JSON.stringify(ids)===JSON.stringify(EXPECTED_CHECKPOINTS),'CHECKPOINT_SEQUENCE_INVALID');
  for(let i=0;i<reg.checkpoints.length;i++){
    const c=reg.checkpoints[i];
    if(i===0)req((c.prerequisites??[]).length===0,'OW00_PREREQUISITE_INVALID');
    else req(JSON.stringify(c.prerequisites)==JSON.stringify([EXPECTED_CHECKPOINTS[i-1]]),`CHECKPOINT_PREREQUISITE_INVALID:${c.id}`);
    req(c.successor===(EXPECTED_CHECKPOINTS[i+1]??null),`CHECKPOINT_SUCCESSOR_INVALID:${c.id}`);
    if(c.changesLiveExperience)req(c.requiresUserDifferential===true,`LIVE_CHECKPOINT_USER_DIFFERENTIAL_MISSING:${c.id}`);
  }
  req(ids.includes(state.currentCheckpoint?.id),'RECOVERY_POINTER_INVALID:CURRENT_CHECKPOINT');
  req(state.roomPrivateStateAuthoritative===false&&recovery.roomPrivateStateAuthoritative===false,'ROOM_PRIVATE_STATE_DECLARED_AUTHORITATIVE');
  req(state.requiredFutureOutcome?.startingPointTraversalRangeExpansion==='REQUIRED','TRAVERSAL_EXPANSION_REQUIREMENT_MISSING');
  req(locator.productMutationAuthority===false&&locator.liveIntegrationAuthority===false&&inv.productMutationAuthorized===false&&inv.liveTraversalMutationAuthorized===false,'PRODUCT_AUTHORITY_LEAK');
  req(recovery.implementationAuthorityInherited===false,'INHERITED_IMPLEMENTATION_AUTHORITY_LEAK');
  req(contract.freshVerificationRequired===true&&contract.repairAllowedInFreshVerifier===false,'FRESH_VERIFICATION_CONTRACT_INVALID');
  const m=[...(manifest.exactPaths??[])].sort(),o=[...(op.allowedPaths??[])].sort(),p=[...(proc.exactAllowedRepositoryPaths??[])].sort();
  req(manifest.exactPathCount===14&&JSON.stringify(m)===JSON.stringify(EXACT_PATHS),'PATH_BOUNDARY_MISMATCH:MANIFEST');
  req(JSON.stringify(o)===JSON.stringify(EXACT_PATHS)&&JSON.stringify(p)===JSON.stringify(EXACT_PATHS),'PATH_BOUNDARY_MISMATCH:OPERATION');
}
let framing=Buffer.alloc(0);
if(issues.length===0){
  const parts=[];
  for(const p of FINGERPRINT_PATHS){parts.push(Buffer.from(p+'\0'));parts.push(fs.readFileSync(path.resolve(ROOT,p)));parts.push(Buffer.from('\0'));}
  framing=Buffer.concat(parts);
}
const receipt=stable({schema:'H_EARTH_AUDRALIA_OPEN_WORLD_CONTINUITY_VERIFICATION_RECEIPT_v1',result:issues.length?'FAIL_CLOSED':'PASS',instrumentId:'H_EARTH_AUDRALIA_OPEN_WORLD_SPATIAL_MIGRATION_CONTINUITY_INSTRUMENT_v1',governingHead:GOV,sourceRevision10Head:REV10,sourceRevision10Tree:REV10_TREE,exactDeclaredPathCount:14,fingerprintPathCount:FINGERPRINT_PATHS.length,workflowPresent:fs.existsSync(path.resolve(ROOT,WORKFLOW)),packageFingerprint:issues.length?null:sha(framing),roomPrivateStateAuthoritative:false,productMutationAuthorized:false,startingPointTraversalRangeExpansion:'REQUIRED',issues});
const bytes=JSON.stringify(receipt,null,2)+'\n';
if(output){fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});fs.writeFileSync(path.resolve(output),bytes);}else process.stdout.write(bytes);
if(issues.length)process.exitCode=1;
