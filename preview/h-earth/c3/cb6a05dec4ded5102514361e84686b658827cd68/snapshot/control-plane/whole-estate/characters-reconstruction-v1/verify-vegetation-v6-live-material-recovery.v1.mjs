#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const CONTRACT_PATH='control-plane/whole-estate/characters-reconstruction-v1/vegetation-v6-live-material-recovery-contract.v1.json';
const REPRESENTATION_PATH='characters/vegetation-representation.mjs';
const UNDERSTORY_PATH='characters/vegetation-understory.mjs';
const POPULATION_PATH='characters/vegetation-population.mjs';
const APP_PATH='characters/app.mjs';
const EXPECTED_SCHEMA='MIRRORLAND_V6_LIVE_VEGETATION_MATERIAL_RECOVERY_CONTRACT_v1';
const RECEIPT_SCHEMA='MIRRORLAND_V6_LIVE_VEGETATION_MATERIAL_RECOVERY_RECEIPT_v1';

const args=process.argv.slice(2);
let output=null;
for(let i=0;i<args.length;i+=2){
  if(args[i]!=='--output'||!args[i+1])throw new Error('CLI_ARGUMENTS_INVALID');
  output=args[i+1];
}
if(!output)throw new Error('OUTPUT_REQUIRED');
const outputPath=path.resolve(process.cwd(),output);
const contract=JSON.parse(fs.readFileSync(path.join(ROOT,CONTRACT_PATH),'utf8'));
const checks=[];
const record=(id,pass,detail=null)=>{
  checks.push({id,result:pass?'PASS':'FAIL',detail});
  if(!pass){const error=new Error(id);error.assertion=id;error.detail=detail;throw error;}
};
const git=(...gitArgs)=>execFileSync('git',gitArgs,{cwd:ROOT,encoding:'utf8'}).trim();
const blobAt=(commit,file)=>git('rev-parse',commit+':'+file);
const blobNow=file=>git('hash-object',file);
const fileText=file=>fs.readFileSync(path.join(ROOT,file),'utf8');
const digest=value=>crypto.createHash('sha256').update(value).digest('hex');
const deepEqual=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const allowed=new Set([
  'characters/app.mjs',
  'characters/vegetation-representation.mjs',
  'characters/vegetation-understory.mjs',
  'control-plane/whole-estate/characters-reconstruction-v1/vegetation-v6-live-material-recovery-contract.v1.json',
  'control-plane/whole-estate/characters-reconstruction-v1/verify-vegetation-v6-live-material-recovery.v1.mjs',
  '.github/workflows/characters-vegetation-v6-live-material-recovery-v1.yml'
]);

const baseReceipt={
  schema:RECEIPT_SCHEMA,
  operationId:contract.operationId??null,
  lockGeneration:contract.lockGeneration??null,
  stage:contract.stage??null,
  targetBoundary:contract.targetBoundary??null,
  governingMain:contract.governingMain??null,
  visualDisposition:'NOT_ASSIGNED_BY_MECHANICAL_VERIFIER',
  checks
};

try{
  record('CONTRACT_SCHEMA',contract.schema===EXPECTED_SCHEMA,contract.schema);
  record('OPERATION_ID',contract.operationId==='MIRRORLAND_V6_LIVE_VEGETATION_MATERIAL_RECOVERY_20260908_001',contract.operationId);
  record('LOCK_GENERATION',contract.lockGeneration===2018,contract.lockGeneration);
  record('CANONICAL_POPULATION_DECLARED_818',contract.canonicalPopulationCount===818,contract.canonicalPopulationCount);
  record('MERGE_DEPLOY_PUBLICATION_UNAUTHORIZED',contract.mergeDeploymentPublicationAuthorized===false,contract.mergeDeploymentPublicationAuthorized);

  const head=git('rev-parse','HEAD^{commit}');
  baseReceipt.exactHead=head;
  const ancestor=spawnSync('git',['merge-base','--is-ancestor',contract.governingMain,head],{cwd:ROOT});
  record('HEAD_DESCENDS_FROM_EXACT_GOVERNING_MAIN',ancestor.status===0,{status:ancestor.status,governingMain:contract.governingMain,head});
  const changed=git('diff','--name-only',contract.governingMain+'...'+head).split('\n').filter(Boolean);
  const outside=changed.filter(file=>!allowed.has(file));
  record('EXACT_ALLOWED_PATH_SCOPE',outside.length===0,{changed,outside});

  for(const protectedFile of contract.protectedHeadIdentity){
    const expected=protectedFile.blob==='UNCHANGED_FROM_GOVERNING_MAIN'?blobAt(contract.governingMain,protectedFile.path):protectedFile.blob;
    const observed=blobNow(protectedFile.path);
    record('PROTECTED_IDENTITY:'+protectedFile.path,observed===expected,{expected,observed});
  }

  const populationModule=await import(pathToFileURL(path.join(ROOT,POPULATION_PATH)).href+'?v6='+head);
  const population=populationModule.getCanonicalVegetationPopulation();
  const ids=population.instances.map(item=>item.id);
  record('CANONICAL_POPULATION_COUNT_818',population.instanceCount===818,{observed:population.instanceCount});
  record('CANONICAL_POPULATION_IDS_UNIQUE',new Set(ids).size===818,{count:ids.length,unique:new Set(ids).size});
  const compactPopulation=populationModule.getCanonicalVegetationPopulation({compact:true,viewportClass:'MOBILE'});
  record('DEVICE_CANONICAL_IDENTITY_PRESERVED',deepEqual(ids,compactPopulation.instances.map(item=>item.id)),{count:ids.length});

  const representation=await import(pathToFileURL(path.join(ROOT,REPRESENTATION_PATH)).href+'?v6='+head);
  const frame=representation.buildVegetationRepresentationFrame({camera:{eye:{x:0,y:365,z:590},look:{x:70,y:24,z:-660}}});
  record('REPRESENTATION_COUNT_EQUALS_818',frame.representationCount===818,{observed:frame.representationCount});
  record('REPRESENTATION_IDS_EQUAL_CANONICAL_IDS',deepEqual(frame.representations.map(item=>item.id),ids),{count:ids.length});
  record('CAMERA_TRUE_LOD_PRESERVED',frame.lodAuthority==='CAMERA_DISTANCE',frame.lodAuthority);
  const v6=representation.LIVE_MATERIAL_V6_REPRESENTATION_CONTRACT;
  record('V6_REPRESENTATION_CONTRACT_PRESENT',v6?.schema==='MIRRORLAND_LIVE_MATERIAL_V6_REPRESENTATION_CONTRACT_v1',v6?.schema??null);
  record('V6_FOLIAGE_NIGHT_LIGHTING_ENABLED',v6?.foliageNightLighting===true,v6?.foliageNightLighting??null);
  record('V6_TWO_LAYER_FAR_CANOPY',v6?.farCanopyLayerCount===2,v6?.farCanopyLayerCount??null);
  record('V6_COMPACT_NEAR_BUDGET',representation.resolveNearLeafBudget(1,true)===155,representation.resolveNearLeafBudget(1,true));
  record('V6_COMPACT_MID_BUDGET',representation.resolveMidClusterBudget(1,true)===44,representation.resolveMidClusterBudget(1,true));

  const understoryModule=await import(pathToFileURL(path.join(ROOT,UNDERSTORY_PATH)).href+'?v6='+head);
  const underPopulation=understoryModule.getCanonicalUnderstoryPopulation();
  const underCompact=understoryModule.V6_UNDERSTORY_PRESENTATION_CONTRACT;
  record('UNDERSTORY_CANONICAL_POPULATION_DEVICE_INVARIANT',underPopulation.deviceInvariant===true&&underPopulation.cameraInvariant===true,{deviceInvariant:underPopulation.deviceInvariant,cameraInvariant:underPopulation.cameraInvariant});
  record('V6_COMPACT_UNDERSTORY_RATIO_AT_LEAST_0_90',underCompact?.compactPresentationSampling>=.9,underCompact?.compactPresentationSampling??null);
  record('V6_UNDERSTORY_NIGHT_LIGHTING_ENABLED',underCompact?.nightLighting===true,underCompact?.nightLighting??null);

  const repSource=fileText(REPRESENTATION_PATH);
  for(const token of ['uEye','uMoonDirection','uLunarIntensity','uHorizonHaze','dFdx','dFdy','vWorld','uMaterialProfile','buildFarCanopyLayerPayload']){
    record('REPRESENTATION_MATERIAL_TOKEN:'+token,repSource.includes(token),token);
  }
  record('SINGLE_TINT_FRAGMENT_OUTPUT_REMOVED',!repSource.includes('void main(){outColor=vec4(uTint,1.0);}'),null);
  record('V5_HISTORICAL_CONTRACT_RETAINED',repSource.includes('HIERARCHICAL_FOLIAGE_V5_REPRESENTATION_CONTRACT'),null);

  const underSource=fileText(UNDERSTORY_PATH);
  for(const token of ['V6_UNDERSTORY_PRESENTATION_CONTRACT','uMoonDirection','uLunarIntensity','uHorizonHaze','dFdx','dFdy']){
    record('UNDERSTORY_MATERIAL_TOKEN:'+token,underSource.includes(token),token);
  }

  const appSource=fileText(APP_PATH);
  record('APP_VEGETATION_RENDERER_BOUND',appSource.includes('vegetationRenderer.draw')&&appSource.includes('previousFrame:vegetationFrame'),null);
  record('APP_V6_LIGHTING_BOUND',appSource.includes('const vegetationLighting=nightUniforms(worldState)')&&appSource.includes('lighting:vegetationLighting'),null);
  record('APP_UNDERSTORY_LIGHTING_BOUND',appSource.includes('understory.draw({vp,eye:camera.eye,lighting:vegetationLighting'),null);
  record('EXCLUDED_COAST_MAP_MODULE_NOT_IMPORTED',!appSource.includes("from './coast-map.mjs'"),null);

  const passReceipt={
    ...baseReceipt,
    result:'MECHANICAL_PASS',
    boundary:'V6_EXACT_HEAD_MECHANICAL_PASS_VISUAL_REVIEW_REQUIRED',
    canonicalPopulationCount:population.instanceCount,
    understoryPopulationCount:underPopulation.instanceCount,
    representationCount:frame.representationCount,
    checkCount:checks.length,
    changedPaths:changed,
    checks,
    receiptDigest:digest(JSON.stringify({head,checks}))
  };
  fs.writeFileSync(outputPath,JSON.stringify(passReceipt,null,2)+'\n');
  process.stdout.write(JSON.stringify(passReceipt,null,2)+'\n');
}catch(error){
  const failReceipt={
    ...baseReceipt,
    result:'MECHANICAL_FAIL_CLOSED',
    boundary:'V6_EXACT_HEAD_MECHANICAL_FAIL_CLOSED',
    failedAssertion:error.assertion??error.message,
    detail:error.detail??null,
    checkCount:checks.length,
    checks,
    receiptDigest:digest(JSON.stringify({checks,error:error.message}))
  };
  fs.writeFileSync(outputPath,JSON.stringify(failReceipt,null,2)+'\n');
  process.stderr.write(JSON.stringify(failReceipt,null,2)+'\n');
  process.exitCode=1;
}
