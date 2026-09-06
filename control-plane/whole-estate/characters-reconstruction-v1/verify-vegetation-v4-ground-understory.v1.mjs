#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {getCanonicalVegetationPopulation} from '../../../characters/vegetation-population.mjs';
import {
  FOREST_SIGHTLINE_EXCLUSIONS,
  GROUND_UNDERSTORY_POLICY,
  buildGroundUnderstoryPopulation
} from '../../../characters/forest-system.mjs';

const CONTRACT='control-plane/whole-estate/characters-reconstruction-v1/vegetation-v4-ground-understory-contract.v1.json';
const OUTPUT=process.argv.includes('--output')?process.argv[process.argv.indexOf('--output')+1]:null;
const MATERIAL=process.argv.includes('--material-evidence')?process.argv[process.argv.indexOf('--material-evidence')+1]:null;
const contract=JSON.parse(fs.readFileSync(CONTRACT,'utf8'));
const failures=[];
const checks=[];
const check=(id,pass,detail=null)=>{checks.push({id,pass:Boolean(pass),detail});if(!pass)failures.push(id);};
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const blob=(ref,path)=>git('rev-parse',`${ref}:${path}`);
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');
const stable=value=>JSON.stringify(value,Object.keys(value).sort());
const identity=population=>population.instances.map(item=>({id:item.id,world:item.world,category:item.category,forestWeight:item.forestWeight,wetness:item.wetness,materialProfile:item.materialProfile,seed:item.seed}));

check('CONTRACT_IDENTITY',contract.operationId==='MIRRORLAND_GROUND_UNDERSTORY_CONTINUITY_20260905_009'&&contract.lockGeneration===1958&&contract.governingHead==='a771681786d0ba2cc751949d761876d917992d8c');
check('FOUNDATION_AGGREGATE_BOUND',contract.foundation.qualifiedHead==='7e45a44a0abd6348892ff54a2109fc0c4248485d'&&contract.foundation.aggregateRun===33999774516&&contract.foundation.aggregateResult==='V0_V3_PASS_CLOSED');
for(const [path,expected] of Object.entries(contract.foundation.files)){
  let actual=null;try{actual=blob('HEAD',path);}catch{}
  check(`FOUNDATION_BLOB:${path}`,actual===expected,{expected,actual});
}

const allowed=new Set([
  ...Object.keys(contract.foundation.files),
  'characters/forest-system.mjs',
  CONTRACT,
  'control-plane/whole-estate/characters-reconstruction-v1/verify-vegetation-v4-ground-understory.v1.mjs',
  '.github/workflows/characters-vegetation-v4-ground-understory-v1.yml'
]);
let changed=[];try{changed=git('diff','--name-only',contract.governingHead,'HEAD').split('\n').filter(Boolean);}catch{}
check('DECLARED_PATHS_ONLY',changed.every(path=>allowed.has(path)),changed.filter(path=>!allowed.has(path)));

const canonical=getCanonicalVegetationPopulation();
check('CANONICAL_TREE_COUNT_PRESERVED',canonical.instanceCount===818,canonical.instanceCount);
check('CANONICAL_TREE_IDENTITY_DEVICE_INVARIANT',canonical.deviceInvariant===true&&canonical.cameraInvariant===true);
check('GROUND_POLICY_STAGE',GROUND_UNDERSTORY_POLICY?.stage==='V4_GROUND_AND_UNDERSTORY_CONTINUITY');
check('NO_DECORATIVE_ECOLOGY_AUTHORITY',GROUND_UNDERSTORY_POLICY?.ecologyAuthority==='sampleCanonicalVegetationEcology'&&GROUND_UNDERSTORY_POLICY?.decorativeIndependentNoiseAuthority===false);
check('NO_V5_PLUS_AUTHORITY',GROUND_UNDERSTORY_POLICY?.v5PlusAuthorized===false);

let groundA=null,groundB=null;
try{groundA=buildGroundUnderstoryPopulation();groundB=buildGroundUnderstoryPopulation();}catch(error){check('GROUND_POPULATION_CONSTRUCTS',false,error.message);}
if(groundA&&groundB){
  check('GROUND_POPULATION_SCHEMA',groundA.schema==='MIRRORLAND_CANONICAL_GROUND_UNDERSTORY_POPULATION_v1');
  check('GROUND_POPULATION_NONEMPTY',groundA.instanceCount>0,groundA.instanceCount);
  check('GROUND_POPULATION_DEVICE_INVARIANT',groundA.deviceInvariant===true&&groundA.cameraInvariant===true);
  const digestA=sha256(JSON.stringify(identity(groundA))),digestB=sha256(JSON.stringify(identity(groundB)));
  check('GROUND_POPULATION_REPRODUCIBLE',digestA===digestB,{digestA,digestB});
  const ids=groundA.instances.map(item=>item.id);
  check('GROUND_INSTANCE_IDS_UNIQUE',new Set(ids).size===ids.length);
  const counts=Object.fromEntries(contract.groundPopulation.categories.map(category=>[category,groundA.instances.filter(item=>item.category===category).length]));
  for(const category of contract.groundPopulation.categories)check(`CATEGORY_PRESENT:${category}`,counts[category]>0,counts[category]);
  const reeds=groundA.instances.filter(item=>item.category==='REED');
  check('WET_MARGIN_REEDS_BOUND_TO_HYDROLOGY',reeds.length>0&&reeds.every(item=>item.wetness>=contract.groundPopulation.wetMarginMinimumWeight),reeds.length);
  const floor=groundA.instances.filter(item=>item.category==='FOREST_FLOOR');
  check('FOREST_FLOOR_BOUND_TO_FOREST_WEIGHT',floor.length>0&&floor.every(item=>item.forestWeight>=contract.groundPopulation.forestFloorMinimumWeight),floor.length);
  check('WATER_INTERIOR_EXCLUDED',groundA.instances.every(item=>item.drainageClass==='LAND'));
  check('LANDMARK_CLEARINGS_PRESERVED',groundA.instances.every(item=>FOREST_SIGHTLINE_EXCLUSIONS.every(ex=>Math.hypot(item.world.x-ex.x,item.world.z-ex.z)>=ex.radius)),FOREST_SIGHTLINE_EXCLUSIONS.length);
  check('CANONICAL_TREE_POPULATION_REFERENCE_PRESERVED',groundA.canonicalTreePopulationCount===canonical.instanceCount,groundA.canonicalTreePopulationCount);
}

let materialEvidence=null;
if(MATERIAL&&fs.existsSync(MATERIAL)){
  try{materialEvidence=JSON.parse(fs.readFileSync(MATERIAL,'utf8'));}catch{}
}
const materialPass=Boolean(materialEvidence&&materialEvidence.schema==='MIRRORLAND_V4_MATERIAL_WIDE_SHOT_EVIDENCE_v1'&&materialEvidence.result==='PASS_CLOSED'&&materialEvidence.candidateHead===git('rev-parse','HEAD')&&Array.isArray(materialEvidence.wideShots)&&materialEvidence.wideShots.length>=5&&['SHORELINE','WETLAND','WOODLAND','FOREST','SPARSE_SOIL'].every(surface=>materialEvidence.surfaces?.includes(surface))&&materialEvidence.landmarkClearingsOpen===true&&materialEvidence.uniformCarpetRejected===true);
check('MATERIAL_WIDE_SHOT_EVIDENCE',materialPass,materialEvidence?materialEvidence.result:'NOT_PROVIDED');

const mechanicalFailures=failures.filter(id=>id!=='MATERIAL_WIDE_SHOT_EVIDENCE');
const result=mechanicalFailures.length?'FAIL_CLOSED':materialPass?'GROUND_AND_UNDERSTORY_CONTINUITY_PASS':'V4_MECHANICAL_PASS_MATERIAL_PENDING';
const receipt={
  schema:'MIRRORLAND_VEGETATION_V4_GROUND_UNDERSTORY_RECEIPT_v1',
  result,
  operationId:contract.operationId,
  lockGeneration:contract.lockGeneration,
  candidateHead:git('rev-parse','HEAD'),
  foundationHead:contract.foundation.qualifiedHead,
  canonicalPopulationCount:canonical.instanceCount,
  groundPopulationCount:groundA?.instanceCount??0,
  groundPopulationDigest:groundA?sha256(JSON.stringify(identity(groundA))):null,
  checkCount:checks.length,
  passCount:checks.filter(item=>item.pass).length,
  mechanicalFailCount:mechanicalFailures.length,
  materialEvidenceRequired:true,
  materialEvidenceProvided:Boolean(materialEvidence),
  materialEvidencePass:materialPass,
  mergeDeploymentPublicationAuthorized:false,
  v5PlusAuthorized:false,
  checks,
  failures
};
const text=`${JSON.stringify(receipt,null,2)}\n`;
if(OUTPUT)fs.writeFileSync(OUTPUT,text);else process.stdout.write(text);
if(mechanicalFailures.length)process.exitCode=1;
