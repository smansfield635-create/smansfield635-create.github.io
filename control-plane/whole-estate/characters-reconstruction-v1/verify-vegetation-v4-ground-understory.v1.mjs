#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import {
  UNDERSTORY_CLASSES,
  V4_UNDERSTORY_CONTRACT,
  getCanonicalUnderstoryPopulation
} from '../../../characters/vegetation-understory.mjs';
import {getCanonicalVegetationPopulation} from '../../../characters/vegetation-population.mjs';
import {FOREST_SIGHTLINE_EXCLUSIONS} from '../../../characters/forest-system.mjs';

const CONTRACT='control-plane/whole-estate/characters-reconstruction-v1/vegetation-v4-ground-understory-contract.v1.json';
const RECONCILIATION='control-plane/whole-estate/characters-reconstruction-v1/vegetation-v0-v3-reconciliation.v1.json';
const V2_DISPOSITION='control-plane/whole-estate/characters-reconstruction-v1/vegetation-v2-known-instrumental-failure.v1.json';
const UNDERSTORY='characters/vegetation-understory.mjs';
const APP='characters/app.mjs';
const OUTPUT=process.argv.includes('--output')?process.argv[process.argv.indexOf('--output')+1]:null;

const contract=JSON.parse(fs.readFileSync(CONTRACT,'utf8'));
const reconciliation=JSON.parse(fs.readFileSync(RECONCILIATION,'utf8'));
const v2Disposition=JSON.parse(fs.readFileSync(V2_DISPOSITION,'utf8'));
const understorySource=fs.readFileSync(UNDERSTORY,'utf8');
const appSource=fs.readFileSync(APP,'utf8');
const checks=[];
const failures=[];
const check=(id,pass,detail=null)=>{
  const record={id,pass:Boolean(pass)};
  if(detail!==null)record.detail=detail;
  checks.push(record);
  if(!pass)failures.push(id);
};
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const blob=(ref,path)=>git('rev-parse',`${ref}:${path}`);
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');
const mean=values=>values.length?values.reduce((sum,value)=>sum+value,0)/values.length:0;

function stableTreeIdentity(population){
  return population.instances.map(instance=>({
    id:instance.id,
    lattice:instance.lattice,
    world:instance.world,
    forestWeight:instance.forestWeight,
    biomeClass:instance.biomeClass,
    drainageClass:instance.drainageClass,
    materialProfile:instance.materialProfile,
    slope:instance.slope,
    slopeClass:instance.slopeClass,
    shorelineDistance:instance.shorelineDistance,
    geographyAuthority:instance.geographyAuthority,
    sourceContractId:instance.sourceContractId
  }));
}

function stableUnderstoryIdentity(population){
  return population.instances.map(instance=>({
    id:instance.id,
    lattice:instance.lattice,
    type:instance.type,
    world:instance.world,
    yaw:instance.yaw,
    scale:instance.scale,
    density:instance.density,
    forestWeight:instance.forestWeight,
    riverWeight:instance.riverWeight,
    lakeWeight:instance.lakeWeight,
    drainageClass:instance.drainageClass,
    biomeClass:instance.biomeClass,
    materialProfile:instance.materialProfile,
    slopeClass:instance.slopeClass,
    curvatureClass:instance.curvatureClass,
    shorelineDistance:instance.shorelineDistance,
    geographyAuthority:instance.geographyAuthority,
    sourceContractId:instance.sourceContractId
  }));
}

function populationDigest(population){
  return sha256(JSON.stringify(stableUnderstoryIdentity(population)));
}

function outsideSightline(instance){
  return FOREST_SIGHTLINE_EXCLUSIONS.every(item=>Math.hypot(instance.world.x-item.x,instance.world.z-item.z)>=item.radius);
}

function nearestTreeDistance(instance,trees){
  let best=Infinity;
  for(const tree of trees){
    best=Math.min(best,Math.hypot(instance.world.x-tree.world.x,instance.world.z-tree.world.z));
  }
  return best;
}

function classEligibility(instance){
  const wet=Math.max(instance.riverWeight,instance.lakeWeight);
  switch(instance.type){
    case 'GRASS_SEDGE':
      return instance.drainageClass==='LAND'&&instance.shorelineDistance>=6&&instance.slopeClass!=='STEEP_NONCLIMBING';
    case 'LOW_SHRUB':
      return instance.drainageClass==='LAND'&&instance.shorelineDistance>=12&&instance.forestWeight>=.14&&instance.slopeClass!=='STEEP_NONCLIMBING';
    case 'SAPLING_YOUNG_GROWTH':
      return instance.drainageClass==='LAND'&&instance.shorelineDistance>=18&&instance.forestWeight>=.28&&['LEVEL','GENTLE','MODERATE'].includes(instance.slopeClass);
    case 'REED_WET_MARGIN':
      return instance.drainageClass==='LAND'&&instance.shorelineDistance>=2&&wet>=.08&&['LEVEL','GENTLE'].includes(instance.slopeClass);
    case 'DEAD_SPARSE_GROUND':
      return instance.drainageClass==='LAND'&&instance.shorelineDistance>=10&&['STONE_AND_SPARSE_SOIL','COASTAL_SOIL'].includes(instance.materialProfile)&&instance.forestWeight<.36;
    case 'FOREST_FLOOR_CLUSTER':
      return instance.drainageClass==='LAND'&&instance.shorelineDistance>=14&&instance.forestWeight>=.28&&(instance.materialProfile==='FOREST_SOIL'||['WOODLAND','FOREST'].includes(instance.biomeClass));
    default:return false;
  }
}

check('CONTRACT_SCHEMA',contract.schema==='MIRRORLAND_VEGETATION_V4_GROUND_UNDERSTORY_CONTRACT_v1');
check('OPERATION_ID',contract.operationId==='MIRRORLAND_CANONICAL_ECOLOGY_CAMERA_TRUE_VEGETATION_20260905_003');
check('LOCK_GENERATION',contract.lockGeneration===1956);
check('EXACT_PARENT',contract.exactParent==='7e45a44a0abd6348892ff54a2109fc0c4248485d');
check('PREDECESSOR_BOUNDARY',contract.predecessorBoundary==='V0_V3_PASS_CLOSED');
check('TARGET_BOUNDARY',contract.targetBoundary==='GROUND_AND_UNDERSTORY_CONTINUITY_PASS');
check('MERGE_AUTHORITY_FALSE',contract.authorityCreated?.merge===false);
check('DEPLOYMENT_AUTHORITY_FALSE',contract.authorityCreated?.deployment===false);
check('PUBLICATION_AUTHORITY_FALSE',contract.authorityCreated?.publication===false);
check('V5_PLUS_FORBIDDEN',contract.forbiddenScope?.includes('V5_HIERARCHICAL_FOLIAGE')&&contract.forbiddenScope?.includes('V8_FINAL_ACCEPTANCE'));
check('REPAIR_SAME_STAGE_ONLY',contract.failureSemantics?.repairSameStageOnly===true);
check('ALTERNATE_CARRIER_PROHIBITED',contract.failureSemantics?.alternateEquivalentCarrierProhibited===true);

const ancestry=spawnSync('git',['merge-base','--is-ancestor',contract.exactParent,'HEAD']);
check('EXACT_PARENT_IS_ANCESTOR',ancestry.status===0,{status:ancestry.status});
check('V0_V3_RECONCILIATION_SCHEMA',reconciliation.schema==='MIRRORLAND_VEGETATION_V0_V3_RECONCILIATION_BINDING_v1');
check('V0_V3_TARGET',reconciliation.targetBoundary==='V0_V3_PASS_CLOSED');
check('V0_V3_HISTORICAL_RECEIPTS_PRESERVED',reconciliation.reconciliationLaw?.historicalReceiptsRemainImmutable===true);
check('V0_V3_ACCEPTANCE_NOT_RELAXED',reconciliation.reconciliationLaw?.acceptanceCriteriaMayNotBeRelaxed===true);
check('V4_PLUS_WAS_AUTHORIZED',reconciliation.reconciliationLaw?.v4PlusAuthorizedOnlyAfterAggregatePass===true);
check('NO_MERGE_PUBLICATION_AUTHORITY_FROM_RECONCILIATION',reconciliation.reconciliationLaw?.mergeDeploymentPublicationAuthorityCreated===false);

const expectedBlobs={
  'characters/vegetation-ecology.mjs':'b2b4ebafeee1e24f5eabd7a43c86afc1734ad43c',
  'characters/vegetation-population.mjs':'2fcbe1ef5ba62a0e23a10fac3c9b2bc211e93149',
  'characters/vegetation-representation.mjs':'9fe0a70d86250d004ae1b04b72e1cd6818caaada',
  'characters/forest-system.mjs':'98d0995143400149cb19c48751a38a5402ca019b',
  [CONTRACT]:'ac732ac39162a04bae06513d12f7311ea201db03',
  [UNDERSTORY]:'523ce96878b60ae249d1738bdffb180f161371aa',
  [APP]:'0187f323d4c5eb0d535fa42c47d4d5b5547b457d'
};
for(const [path,expected] of Object.entries(expectedBlobs)){
  const actual=blob('HEAD',path);
  check(`BLOB_IDENTITY:${path}`,actual===expected,{expected,actual});
}

check('RUNTIME_CONTRACT_SCHEMA',V4_UNDERSTORY_CONTRACT.schema==='MIRRORLAND_VEGETATION_V4_UNDERSTORY_RUNTIME_CONTRACT_v1');
check('RUNTIME_OPERATION_ID',V4_UNDERSTORY_CONTRACT.operationId===contract.operationId);
check('RUNTIME_STAGE',V4_UNDERSTORY_CONTRACT.stage==='V4_GROUND_AND_UNDERSTORY_CONTINUITY');
check('RUNTIME_TARGET',V4_UNDERSTORY_CONTRACT.targetBoundary===contract.targetBoundary);
check('NO_GEOGRAPHY_AUTHORITY_CREATED',V4_UNDERSTORY_CONTRACT.geographyAuthorityCreated===false);
check('DEVICE_INVARIANT_CONTRACT',V4_UNDERSTORY_CONTRACT.populationIdentityDeviceInvariant===true);
check('CAMERA_INVARIANT_CONTRACT',V4_UNDERSTORY_CONTRACT.populationIdentityCameraInvariant===true);
check('GRID_COLUMNS',V4_UNDERSTORY_CONTRACT.grid?.columns===120);
check('GRID_ROWS',V4_UNDERSTORY_CONTRACT.grid?.rows===88);
check('GRID_SEED',V4_UNDERSTORY_CONTRACT.grid?.seed===1689746977);
check('COMPACT_PRESENTATION_ONLY',V4_UNDERSTORY_CONTRACT.compactPresentationSampling===.55);
check('V3_CAMERA_CONTEXT_REUSED',V4_UNDERSTORY_CONTRACT.v3CameraContextReused===true);
check('PROHIBITED_IDENTITY_INPUTS',JSON.stringify(V4_UNDERSTORY_CONTRACT.prohibitedIdentityInputs)===JSON.stringify(['DEVICE_CLASS','VIEWPORT_CLASS','CAMERA_STATE','REDUCED_MOTION','LOD']));
check('SIX_UNDERSTORY_CLASSES',JSON.stringify(UNDERSTORY_CLASSES)===JSON.stringify(['GRASS_SEDGE','LOW_SHRUB','SAPLING_YOUNG_GROWTH','REED_WET_MARGIN','DEAD_SPARSE_GROUND','FOREST_FLOOR_CLUSTER']));

const trees=getCanonicalVegetationPopulation();
const treeDigest=sha256(JSON.stringify(stableTreeIdentity(trees)));
check('V2_TREE_COUNT_PRESERVED',trees.instanceCount===818,{actual:trees.instanceCount});
check('V2_TREE_DIGEST_PRESERVED',treeDigest===v2Disposition.observed?.populationIdentityDigest,{expected:v2Disposition.observed?.populationIdentityDigest,actual:treeDigest});

const desktopPopulation=getCanonicalUnderstoryPopulation({compact:false,camera:{eye:[0,0,0]}});
const compactPopulation=getCanonicalUnderstoryPopulation({compact:true,camera:{eye:[999,999,999]}});
const desktopDigest=populationDigest(desktopPopulation);
const compactDigest=populationDigest(compactPopulation);
check('UNDERSTORY_SCHEMA',desktopPopulation.schema==='MIRRORLAND_VEGETATION_V4_UNDERSTORY_POPULATION_v1');
check('UNDERSTORY_OPERATION',desktopPopulation.operationId===contract.operationId);
check('UNDERSTORY_CANONICAL',desktopPopulation.canonicalPopulation===true);
check('UNDERSTORY_DEVICE_INVARIANT_FLAG',desktopPopulation.deviceInvariant===true);
check('UNDERSTORY_CAMERA_INVARIANT_FLAG',desktopPopulation.cameraInvariant===true);
check('UNDERSTORY_NONEMPTY',desktopPopulation.instanceCount>0,{actual:desktopPopulation.instanceCount});
check('DEVICE_CAMERA_CONTEXT_DIGEST_INVARIANT',desktopDigest===compactDigest,{desktopDigest,compactDigest});

const childScript=`import crypto from 'node:crypto';import {getCanonicalUnderstoryPopulation} from './characters/vegetation-understory.mjs';const p=getCanonicalUnderstoryPopulation();const s=p.instances.map(i=>({id:i.id,lattice:i.lattice,type:i.type,world:i.world,yaw:i.yaw,scale:i.scale,density:i.density,forestWeight:i.forestWeight,riverWeight:i.riverWeight,lakeWeight:i.lakeWeight,drainageClass:i.drainageClass,biomeClass:i.biomeClass,materialProfile:i.materialProfile,slopeClass:i.slopeClass,curvatureClass:i.curvatureClass,shorelineDistance:i.shorelineDistance,geographyAuthority:i.geographyAuthority,sourceContractId:i.sourceContractId}));process.stdout.write(crypto.createHash('sha256').update(JSON.stringify(s)).digest('hex'));`;
const child=spawnSync(process.execPath,['--input-type=module','-e',childScript],{encoding:'utf8',timeout:120000});
check('FRESH_PROCESS_EXECUTION_SUCCEEDED',child.status===0,{status:child.status,stderr:(child.stderr||'').slice(0,500)});
check('FRESH_PROCESS_DIGEST_MATCH',child.status===0&&child.stdout.trim()===desktopDigest,{expected:desktopDigest,actual:child.stdout?.trim()||null});

const ids=new Set();
let duplicateIds=0;
let classEligibilityFailures=0;
let sightlineFailures=0;
let saplingClearanceFailures=0;
for(const instance of desktopPopulation.instances){
  if(ids.has(instance.id))duplicateIds++;
  ids.add(instance.id);
  if(!classEligibility(instance))classEligibilityFailures++;
  if(!outsideSightline(instance))sightlineFailures++;
  if(instance.type==='SAPLING_YOUNG_GROWTH'&&nearestTreeDistance(instance,trees.instances)<5)saplingClearanceFailures++;
}
check('UNIQUE_INSTANCE_IDS',duplicateIds===0,{duplicateIds});
check('ALL_INSTANCES_CLASS_ELIGIBLE',classEligibilityFailures===0,{classEligibilityFailures});
check('LANDMARK_CLEARINGS_PRESERVED',sightlineFailures===0,{sightlineFailures});
check('SAPLING_TREE_CLEARANCE',saplingClearanceFailures===0,{saplingClearanceFailures});

for(const type of UNDERSTORY_CLASSES){
  check(`CLASS_PRESENT:${type}`,(desktopPopulation.classCounts?.[type]||0)>0,{count:desktopPopulation.classCounts?.[type]||0});
}

const byType=Object.fromEntries(UNDERSTORY_CLASSES.map(type=>[type,desktopPopulation.instances.filter(item=>item.type===type)]));
const allWet=desktopPopulation.instances.map(item=>Math.max(item.riverWeight,item.lakeWeight));
const reedWet=byType.REED_WET_MARGIN.map(item=>Math.max(item.riverWeight,item.lakeWeight));
const forestFloorWeights=byType.FOREST_FLOOR_CLUSTER.map(item=>item.forestWeight);
const sparseWeights=byType.DEAD_SPARSE_GROUND.map(item=>item.forestWeight);
const avgAllWet=mean(allWet),avgReedWet=mean(reedWet),avgForestFloor=mean(forestFloorWeights),avgSparse=mean(sparseWeights);
check('HYDROLOGY_DIFFERENTIATION',reedWet.length>0&&avgReedWet>avgAllWet+.05,{avgReedWet,avgAllWet});
check('FOREST_SPARSE_DIFFERENTIATION',forestFloorWeights.length>0&&sparseWeights.length>0&&avgForestFloor>avgSparse+.10,{avgForestFloor,avgSparse});
check('REEDS_NOT_IN_CHANNEL_OR_LAKE',byType.REED_WET_MARGIN.every(item=>item.drainageClass==='LAND'));
check('FOREST_FLOOR_ECOLOGY_BOUND',byType.FOREST_FLOOR_CLUSTER.every(item=>item.materialProfile==='FOREST_SOIL'||['WOODLAND','FOREST'].includes(item.biomeClass)));
check('SPARSE_GROUND_ECOLOGY_BOUND',byType.DEAD_SPARSE_GROUND.every(item=>['STONE_AND_SPARSE_SOIL','COASTAL_SOIL'].includes(item.materialProfile)&&item.forestWeight<.36));

check('WEBGL2_INSTANCING_PRESENT',understorySource.includes('drawArraysInstanced'));
check('CANONICAL_ECOLOGY_IMPORT_PRESENT',understorySource.includes("sampleCanonicalVegetationEcology"));
check('CANONICAL_TREE_IMPORT_PRESENT',understorySource.includes("getCanonicalVegetationPopulation"));
check('SIGHTLINE_IMPORT_PRESENT',understorySource.includes("FOREST_SIGHTLINE_EXCLUSIONS"));
check('NO_V5_WIND_IMPLEMENTATION',!/\buWind\b|gust|windField|leafFlutter/i.test(understorySource));
check('NO_V7_LUNAR_IMPLEMENTATION',!/lunarIntensity|moonDiffuse|backscatter|transmission/i.test(understorySource));

check('APP_IMPORTS_UNDERSTORY',appSource.includes("import {createUnderstoryRenderer} from './vegetation-understory.mjs';"));
check('APP_CREATES_ONE_UNDERSTORY_RENDERER',(appSource.match(/createUnderstoryRenderer\(gl,\{compact\}\)/g)||[]).length===1);
check('APP_DRAWS_UNDERSTORY_ONCE',(appSource.match(/understory\.draw\(\{vp,eye:camera\.eye\}\)/g)||[]).length===1);
check('LEGACY_FOREST_STILL_PRESENT',appSource.includes('const forest=createForestSystem(gl,{compact});')&&appSource.includes('forest.draw(vp,reducedMotion?0:now*.001);'));
check('CLOUD_RUNTIME_UNCHANGED_PRESENT',appSource.includes("cloudSystem.draw({vp,time:reducedMotion?0:now*.001,state:document.documentElement.dataset.cloudTravel||'ORBIT'});"));

const result=failures.length===0?'V4_MECHANICAL_PASS_CLOSED':'FAIL_CLOSED';
const receipt={
  schema:'MIRRORLAND_VEGETATION_V4_MECHANICAL_QUALIFICATION_RECEIPT_v1',
  operationId:contract.operationId,
  stage:'V4_GROUND_AND_UNDERSTORY_CONTINUITY',
  candidateHead:git('rev-parse','HEAD'),
  exactV4Parent:contract.exactParent,
  predecessorBoundary:contract.predecessorBoundary,
  targetBoundary:contract.targetBoundary,
  result,
  mechanicalBoundaryClosed:result==='V4_MECHANICAL_PASS_CLOSED',
  materialBoundaryClosed:false,
  finalV4ClaimAuthorized:false,
  v5Authorized:false,
  mergeDeploymentPublicationAuthorized:false,
  deterministicIdentityDigest:desktopDigest,
  canonicalTreeIdentityDigest:treeDigest,
  canonicalTreeCount:trees.instanceCount,
  canonicalUnderstoryCount:desktopPopulation.instanceCount,
  classCounts:desktopPopulation.classCounts,
  differentiation:{avgAllWet,avgReedWet,avgForestFloor,avgSparse},
  checkCount:checks.length,
  passCount:checks.filter(item=>item.pass).length,
  failCount:failures.length,
  failures,
  checks
};

if(OUTPUT)fs.writeFileSync(OUTPUT,`${JSON.stringify(receipt,null,2)}\n`);
else process.stdout.write(`${JSON.stringify(receipt,null,2)}\n`);
if(failures.length)process.exitCode=1;
