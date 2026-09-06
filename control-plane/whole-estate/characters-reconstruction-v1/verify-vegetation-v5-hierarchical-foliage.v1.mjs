#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..');
const CONTRACT_PATH='control-plane/whole-estate/characters-reconstruction-v1/vegetation-v5-hierarchical-foliage-contract.v1.json';
const REPRESENTATION_PATH='characters/vegetation-representation.mjs';
const POPULATION_PATH='characters/vegetation-population.mjs';
const APP_PATH='characters/app.mjs';
const EXPECTED_SCHEMA='MIRRORLAND_V5_HIERARCHICAL_FOLIAGE_CONTRACT_v1';
const RECEIPT_SCHEMA='MIRRORLAND_V5_HIERARCHICAL_FOLIAGE_QUALIFICATION_RECEIPT_v1';

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
const blobAt=(commit,file)=>git('rev-parse',`${commit}:${file}`);
const blobNow=file=>git('hash-object',file);
const fileText=file=>fs.readFileSync(path.join(ROOT,file),'utf8');
const digest=value=>crypto.createHash('sha256').update(value).digest('hex');
const deepEqual=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

const baseReceipt={
  schema:RECEIPT_SCHEMA,
  operationId:contract.operationId??null,
  lockGeneration:contract.lockGeneration??null,
  stage:contract.stage??null,
  targetBoundary:contract.targetBoundary??null,
  governingMain:contract.governingMain??null,
  qualifiedV4Candidate:contract.qualifiedV4Candidate??null,
  v4ReconstitutionCommit:contract.v4ReconstitutionCommit??null,
  checks
};

try{
  record('CONTRACT_SCHEMA',contract.schema===EXPECTED_SCHEMA,contract.schema);
  record('OPERATION_ID',contract.operationId==='MIRRORLAND_HIERARCHICAL_FOLIAGE_20260906_002',contract.operationId);
  record('LOCK_GENERATION',contract.lockGeneration===1962,contract.lockGeneration);
  record('V6_PLUS_EXCLUDED',contract.v6PlusExcluded===true,contract.v6PlusExcluded);
  record('MERGE_DEPLOY_PUBLICATION_UNAUTHORIZED',contract.mergeDeploymentPublicationAuthorized===false,contract.mergeDeploymentPublicationAuthorized);

  const head=git('rev-parse','HEAD^{commit}');
  baseReceipt.exactHead=head;
  const parent=git('rev-parse',`${contract.v4ReconstitutionCommit}^1`);
  record('V4_RECONSTITUTION_PARENT_IS_GOVERNING_MAIN',parent===contract.governingMain,{expected:contract.governingMain,observed:parent});
  const tree=git('rev-parse',`${contract.v4ReconstitutionCommit}^{tree}`);
  record('V4_RECONSTITUTION_TREE_IS_QUALIFIED_V4_TREE',tree===contract.qualifiedV4Tree,{expected:contract.qualifiedV4Tree,observed:tree});
  const ancestor=spawnSync('git',['merge-base','--is-ancestor',contract.v4ReconstitutionCommit,head],{cwd:ROOT});
  record('HEAD_DESCENDS_FROM_V4_RECONSTITUTION',ancestor.status===0,{status:ancestor.status});

  for(const file of contract.protectedHeadIdentity){
    const expected=blobAt(contract.v4ReconstitutionCommit,file);
    const observed=blobNow(file);
    record(`PROTECTED_IDENTITY:${file}`,observed===expected,{expected,observed});
  }

  const populationModule=await import(`${pathToFileURL(path.join(ROOT,POPULATION_PATH)).href}?head=${head}`);
  const population=populationModule.getCanonicalVegetationPopulation();
  record('CANONICAL_POPULATION_COUNT_818',population.instanceCount===contract.canonicalPopulationCount,{expected:contract.canonicalPopulationCount,observed:population.instanceCount});
  record('CANONICAL_POPULATION_REPRESENTATION_UNASSIGNED',population.representationAssigned===false&&population.lodAssigned===false,{representationAssigned:population.representationAssigned,lodAssigned:population.lodAssigned});
  const ids=population.instances.map(item=>item.id);
  record('CANONICAL_POPULATION_IDS_UNIQUE',new Set(ids).size===ids.length,{count:ids.length,unique:new Set(ids).size});
  const compactPopulation=populationModule.getCanonicalVegetationPopulation({compact:true,viewportClass:'MOBILE'});
  record('COMPACT_CANONICAL_IDENTITY_PRESERVED',deepEqual(compactPopulation.instances.map(item=>item.id),ids),{count:ids.length});

  const representation=await import(`${pathToFileURL(path.join(ROOT,REPRESENTATION_PATH)).href}?head=${head}`);
  const cameraContract=representation.CAMERA_TRUE_VEGETATION_REPRESENTATION_CONTRACT;
  const v5=representation.HIERARCHICAL_FOLIAGE_V5_REPRESENTATION_CONTRACT;
  record('CAMERA_TRUE_CONTRACT_PRESENT',cameraContract?.schema==='MIRRORLAND_CAMERA_TRUE_INSTANCED_VEGETATION_REPRESENTATION_CONTRACT_v1',cameraContract?.schema??null);
  record('CAMERA_DISTANCE_LOD_AUTHORITY_PRESERVED',cameraContract?.lodAuthority==='CAMERA_DISTANCE',cameraContract?.lodAuthority??null);
  record('LOD_HYSTERESIS_PRESERVED',cameraContract?.hysteresisRequired===true&&cameraContract?.hysteresis?.nearMid&&cameraContract?.hysteresis?.midFar,cameraContract?.hysteresis??null);
  record('V5_REPRESENTATION_CONTRACT_PRESENT',v5?.schema==='MIRRORLAND_HIERARCHICAL_FOLIAGE_V5_REPRESENTATION_CONTRACT_v1',v5?.schema??null);
  record('NEAR_LEAF_BUDGET_80_TO_180',v5?.budgets?.nearLeaf?.minimum===80&&v5?.budgets?.nearLeaf?.maximum===180,v5?.budgets?.nearLeaf??null);
  record('MID_CLUSTER_BUDGET_20_TO_50',v5?.budgets?.midCluster?.minimum===20&&v5?.budgets?.midCluster?.maximum===50,v5?.budgets?.midCluster??null);
  record('FAR_INDIVIDUAL_LEAF_BUDGET_ZERO',v5?.budgets?.farLeaf===0,v5?.budgets?.farLeaf??null);
  record('NEAR_EXTERNAL_CANOPY_BLOB_PROHIBITED',cameraContract?.representationClasses?.NEAR_FIELD?.canopyBlobAllowed===false,cameraContract?.representationClasses?.NEAR_FIELD??null);
  record('MID_EXTERNAL_CANOPY_BLOB_PROHIBITED',cameraContract?.representationClasses?.MID_FIELD?.canopyBlobAllowed===false,cameraContract?.representationClasses?.MID_FIELD??null);
  record('FAR_CANOPY_BLOB_ALLOWED',cameraContract?.representationClasses?.FAR_FIELD?.canopyBlobAllowed===true,cameraContract?.representationClasses?.FAR_FIELD??null);
  record('NEAR_MICRO_LEAF_GEOMETRY_DECLARED',v5?.hierarchy?.NEAR_FIELD?.micro?.includes('ACTUAL_REUSABLE_LEAF_MESH_INSTANCED')===true,v5?.hierarchy?.NEAR_FIELD??null);
  record('MID_FOLIAGE_SPRAYS_DECLARED',v5?.hierarchy?.MID_FIELD?.meso?.includes('SIMPLIFIED_CROSSED_FOLIAGE_SPRAY_INSTANCED')===true,v5?.hierarchy?.MID_FIELD??null);
  record('FAR_INDIVIDUAL_LEAVES_DECLARED_ABSENT',v5?.hierarchy?.FAR_FIELD?.individualLeaves===false,v5?.hierarchy?.FAR_FIELD??null);

  record('LOD_NEAR_CLASSIFICATION',representation.classifyVegetationLod(100,null)==='NEAR_FIELD',representation.classifyVegetationLod(100,null));
  record('LOD_MID_CLASSIFICATION',representation.classifyVegetationLod(400,null)==='MID_FIELD',representation.classifyVegetationLod(400,null));
  record('LOD_FAR_CLASSIFICATION',representation.classifyVegetationLod(1000,null)==='FAR_FIELD',representation.classifyVegetationLod(1000,null));
  record('NEAR_BUDGET_FUNCTION_BOUNDED',[80,180].every((bound,index)=>{
    const value=representation.resolveNearLeafBudget(index===0?0:1,false);
    return index===0?value>=80:value<=180;
  }),null);
  record('MID_BUDGET_FUNCTION_BOUNDED',[20,50].every((bound,index)=>{
    const value=representation.resolveMidClusterBudget(index===0?0:1,false);
    return index===0?value>=20:value<=50;
  }),null);

  const frame=representation.buildVegetationRepresentationFrame({camera:{eye:{x:0,y:80,z:0},look:{x:0,y:0,z:0}}});
  record('REPRESENTATION_COUNT_EQUALS_CANONICAL_POPULATION',frame.representationCount===population.instanceCount,{representationCount:frame.representationCount,populationCount:population.instanceCount});
  record('REPRESENTATION_IDS_EQUAL_CANONICAL_IDS',deepEqual(frame.representations.map(item=>item.id),ids),{count:ids.length});
  record('FRAME_LOD_AUTHORITY_CAMERA_DISTANCE',frame.lodAuthority==='CAMERA_DISTANCE',frame.lodAuthority);

  const repSource=fileText(REPRESENTATION_PATH);
  const requiredTokens=[
    'MAJOR_BOUGH_GEOMETRY',
    'MESO_CLUSTER_GEOMETRY',
    'MICRO_LEAF_GEOMETRY',
    'MID_SPRAY_GEOMETRY',
    'FAR_CANOPY_BLOB_GEOMETRY',
    'drawArraysInstanced',
    'resolveNearLeafBudget',
    'resolveMidClusterBudget',
    'buildNearLeafPayload',
    'buildMidSprayPayload'
  ];
  for(const token of requiredTokens)record(`REPRESENTATION_TOKEN:${token}`,repSource.includes(token),token);
  record('V6_SHARED_WIND_ABSENT',!/(SHARED_WIND|uWind|sharedWind)/.test(repSource),null);
  record('V7_FOLIAGE_NIGHT_LIGHTING_ABSENT',!/(FOLIAGE_NIGHT_LIGHTING|foliageNightLighting)/.test(repSource),null);

  const appSource=fileText(APP_PATH);
  record('APP_IMPORTS_CAMERA_TRUE_VEGETATION_RENDERER',appSource.includes("from './vegetation-representation.mjs'")&&appSource.includes('createCameraTrueVegetationRenderer'),null);
  record('APP_LEGACY_FOREST_IMPORT_ABSENT',!appSource.includes("from './forest-system.mjs'")&&!appSource.includes('createForestSystem'),null);
  record('APP_CAMERA_TRUE_DRAW_BOUND',appSource.includes('vegetationRenderer.draw')&&appSource.includes('previousFrame:vegetationFrame'),null);
  record('APP_V6_PLUS_SEMANTICS_ABSENT',!/(SHARED_WIND|foliageNightLighting|V6_SHARED_WIND|V7_FOLIAGE_NIGHT_LIGHTING)/.test(appSource),null);

  const passReceipt={
    ...baseReceipt,
    result:'PASS_CLOSED',
    boundary:'V5_MECHANICAL_PASS_CLOSED',
    protectedIdentityCount:contract.protectedHeadIdentity.length,
    canonicalPopulationCount:population.instanceCount,
    representationCount:frame.representationCount,
    checkCount:checks.length,
    checks,
    receiptDigest:digest(JSON.stringify({head,checks}))
  };
  fs.writeFileSync(outputPath,`${JSON.stringify(passReceipt,null,2)}\n`);
  process.stdout.write(`${JSON.stringify(passReceipt,null,2)}\n`);
}catch(error){
  const failReceipt={
    ...baseReceipt,
    result:'FAIL_CLOSED',
    boundary:'V5_MECHANICAL_FAIL_CLOSED',
    failedAssertion:error.assertion??error.message,
    detail:error.detail??null,
    checkCount:checks.length,
    checks,
    receiptDigest:digest(JSON.stringify({checks,error:error.message}))
  };
  fs.writeFileSync(outputPath,`${JSON.stringify(failReceipt,null,2)}\n`);
  process.stderr.write(`${JSON.stringify(failReceipt,null,2)}\n`);
  process.exitCode=1;
}
