#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {GRATITUDE_DEVELOPMENT_FRAME} from '../../../characters/gratitude-geography.adapter.mjs';
import {
  VEGETATION_ECOLOGY_AUTHORITY,
  sampleCanonicalVegetationEcology
} from '../../../characters/vegetation-ecology.mjs';
import {
  CANONICAL_VEGETATION_POPULATION_CONTRACT,
  buildCanonicalVegetationPopulation,
  getCanonicalVegetationPopulation
} from '../../../characters/vegetation-population.mjs';

const CONTRACT='control-plane/whole-estate/characters-reconstruction-v1/vegetation-v0-v3-contract.v1.json';
const V0_DISPOSITION='control-plane/whole-estate/characters-reconstruction-v1/vegetation-v0-known-verifier-false-negative.v1.json';
const V1_VERIFIER='control-plane/whole-estate/characters-reconstruction-v1/verify-vegetation-v1.v1.mjs';
const OUTPUT=process.argv.includes('--output')?process.argv[process.argv.indexOf('--output')+1]:null;
const contract=JSON.parse(fs.readFileSync(CONTRACT,'utf8'));
const v0Disposition=JSON.parse(fs.readFileSync(V0_DISPOSITION,'utf8'));
const failures=[];
const checks=[];
const check=(id,pass,detail=null)=>{checks.push({id,pass:Boolean(pass),detail});if(!pass)failures.push(id);};
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const blob=(ref,path)=>git('rev-parse',`${ref}:${path}`);
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');
const stableIdentity=population=>population.instances.map(instance=>({
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
const identityDigest=population=>sha256(JSON.stringify(stableIdentity(population)));

check('CONTRACT_SCHEMA',contract.schema==='MIRRORLAND_VEGETATION_V0_V3_CONTRACT_v1');
check('OPERATION_ID',contract.operationId==='MIRRORLAND_CANONICAL_ECOLOGY_CAMERA_TRUE_VEGETATION_20260905_003');
check('LOCK_GENERATION',contract.lockGeneration===1956);
check('V2_REQUIRED_RESULT',contract.v2.resultRequired==='V2_CANONICAL_POPULATION_PASS_CLOSED');
check('V2_DEVICE_INVARIANT_REQUIRED',contract.v2.populationIdentityDeviceInvariant===true);
check('V2_CAMERA_INVARIANT_REQUIRED',contract.v2.populationIdentityCameraInvariant===true);
check('V0_FORMAL_RECEIPT_REMAINS_FAIL_CLOSED',v0Disposition.formalReceiptResult==='FAIL_CLOSED');
check('V0_FALSE_NEGATIVE_OWNER_DISPOSITION',v0Disposition.forwardConstructionDisposition==='PROCEED_TO_V1_WITH_KNOWN_VERIFIER_FALSE_NEGATIVE');
check('V0_AGGREGATE_RECONCILIATION_REQUIRED',v0Disposition.aggregateClosureRequiresFormalReconciliation===true);

check('POPULATION_CONTRACT_SCHEMA',CANONICAL_VEGETATION_POPULATION_CONTRACT.schema==='MIRRORLAND_CANONICAL_VEGETATION_POPULATION_CONTRACT_v1');
check('POPULATION_CONTRACT_OPERATION',CANONICAL_VEGETATION_POPULATION_CONTRACT.operationId===contract.operationId);
check('POPULATION_CONTRACT_STAGE',CANONICAL_VEGETATION_POPULATION_CONTRACT.stage==='V2_DEVICE_INVARIANT_CANONICAL_POPULATION');
check('POPULATION_FRAME_AUTHORITY',CANONICAL_VEGETATION_POPULATION_CONTRACT.frameId===GRATITUDE_DEVELOPMENT_FRAME.frameId);
check('POPULATION_ECOLOGY_AUTHORITY',CANONICAL_VEGETATION_POPULATION_CONTRACT.ecologyAuthority===VEGETATION_ECOLOGY_AUTHORITY.schema);
check('POPULATION_DEVICE_INVARIANT_DECLARED',CANONICAL_VEGETATION_POPULATION_CONTRACT.populationIdentityDeviceInvariant===true);
check('POPULATION_CAMERA_INVARIANT_DECLARED',CANONICAL_VEGETATION_POPULATION_CONTRACT.populationIdentityCameraInvariant===true);
check('POPULATION_RUNTIME_IDENTITY_INPUTS_EMPTY',CANONICAL_VEGETATION_POPULATION_CONTRACT.runtimeIdentityInputs.length===0);
check('POPULATION_FIXED_TARGET_DISABLED',CANONICAL_VEGETATION_POPULATION_CONTRACT.fixedTargetCount===false);
check('V3_REPRESENTATION_DEFERRED',CANONICAL_VEGETATION_POPULATION_CONTRACT.representationDeferredTo==='V3_CAMERA_TRUE_INSTANCED_LOD');
check('CANONICAL_BUILDER_ZERO_RUNTIME_INPUTS',buildCanonicalVegetationPopulation.length===0,{declaredArity:buildCanonicalVegetationPopulation.length});

const population=buildCanonicalVegetationPopulation();
check('POPULATION_SCHEMA',population.schema==='MIRRORLAND_CANONICAL_VEGETATION_POPULATION_v1');
check('POPULATION_NONEMPTY',population.instanceCount>0,{instanceCount:population.instanceCount});
check('POPULATION_COUNT_MATCH',population.instanceCount===population.instances.length,{instanceCount:population.instanceCount,arrayLength:population.instances.length});
check('POPULATION_DEVICE_INVARIANT_FLAG',population.deviceInvariant===true);
check('POPULATION_CAMERA_INVARIANT_FLAG',population.cameraInvariant===true);
check('POPULATION_REPRESENTATION_UNASSIGNED',population.representationAssigned===false);
check('POPULATION_LOD_UNASSIGNED',population.lodAssigned===false);
check('POPULATION_NO_FIXED_TARGET',population.fixedTargetCount===false);

const ids=new Set();
for(const instance of population.instances){
  check(`INSTANCE_UNIQUE:${instance.id}`,!ids.has(instance.id));
  ids.add(instance.id);
  check(`INSTANCE_NO_LOD:${instance.id}`,!Object.hasOwn(instance,'lod'));
  check(`INSTANCE_NO_DEVICE_CLASS:${instance.id}`,!Object.hasOwn(instance,'deviceClass'));
  check(`INSTANCE_NO_CAMERA_STATE:${instance.id}`,!Object.hasOwn(instance,'cameraState'));
  check(`INSTANCE_NO_VIEWPORT_CLASS:${instance.id}`,!Object.hasOwn(instance,'viewportClass'));
  const ecology=sampleCanonicalVegetationEcology(instance.world.x,instance.world.z);
  check(`INSTANCE_ECOLOGY_VALID:${instance.id}`,ecology?.valid===true);
  if(ecology?.valid===true){
    check(`INSTANCE_FOREST_WEIGHT_CORRESPONDS:${instance.id}`,Math.abs(ecology.biome.forestWeight-instance.forestWeight)<1e-9,{expected:ecology.biome.forestWeight,actual:instance.forestWeight});
    check(`INSTANCE_BIOME_CORRESPONDS:${instance.id}`,ecology.biome.class===instance.biomeClass,{expected:ecology.biome.class,actual:instance.biomeClass});
    check(`INSTANCE_DRAINAGE_LAND:${instance.id}`,instance.drainageClass==='LAND',{actual:instance.drainageClass});
    check(`INSTANCE_ABOVE_SHORELINE_BUFFER:${instance.id}`,instance.shorelineDistance>=CANONICAL_VEGETATION_POPULATION_CONTRACT.grid.minimumShorelineDistance,{shorelineDistance:instance.shorelineDistance});
  }
}

const referenceDigest=identityDigest(population);
const referenceCount=population.instanceCount;
const deviceClasses=['DESKTOP','TABLET','MOBILE'];
const viewportClasses=['1440x900@1','1024x1366@2','390x844@3'];
const cameraStates=contract.v0.referenceCameraMatrix.states;
const reducedMotionStates=[false,true];
let contextCount=0;
for(let d=0;d<deviceClasses.length;d++){
  for(const cameraState of cameraStates){
    for(const reducedMotion of reducedMotionStates){
      const context={deviceClass:deviceClasses[d],viewportClass:viewportClasses[d],cameraState,reducedMotion};
      const contextual=getCanonicalVegetationPopulation(context);
      const digest=identityDigest(contextual);
      contextCount++;
      check(`CONTEXT_COUNT_INVARIANT:${contextCount}`,contextual.instanceCount===referenceCount,{context,referenceCount,actual:contextual.instanceCount});
      check(`CONTEXT_IDENTITY_INVARIANT:${contextCount}`,digest===referenceDigest,{context,referenceDigest,digest});
    }
  }
}
check('REFERENCE_MATRIX_CONTEXT_COUNT',contextCount===60,{contextCount});

const v1VerifierBlobAtCandidate=blob('HEAD',V1_VERIFIER);
check('V1_VERIFIER_PRESERVED',Boolean(v1VerifierBlobAtCandidate),{blob:v1VerifierBlobAtCandidate});
for(const [path,expected] of Object.entries(contract.v0.sourceIdentity)){
  const current=blob('HEAD',path);
  check(`V0_SOURCE_STILL_UNCHANGED:${path}`,current===expected,{expected,current});
}

const pass=failures.length===0;
const receipt={
  schema:'MIRRORLAND_VEGETATION_V2_RECEIPT_v1',
  operationId:contract.operationId,
  exactGoverningHead:contract.exactGoverningHead,
  candidateHead:git('rev-parse','HEAD'),
  currentStage:'V2_DEVICE_INVARIANT_CANONICAL_POPULATION',
  result:pass?'V2_CANONICAL_POPULATION_PASS_CLOSED':'FAIL_CLOSED',
  stageResults:{
    V0:'KNOWN_VERIFIER_FALSE_NEGATIVE_OWNER_DISPOSITION',
    V1:'V1_ECOLOGY_AUTHORITY_PASS_CLOSED',
    V2:pass?'V2_CANONICAL_POPULATION_PASS_CLOSED':'FAIL_CLOSED',
    V3:'PENDING',
    aggregate:'PENDING'
  },
  v0FormalReceiptResult:'FAIL_CLOSED',
  v0FormalReconciliationRequired:true,
  populationCount:referenceCount,
  populationIdentityDigest:referenceDigest,
  invariantContextCount:contextCount,
  checkCount:checks.length,
  passCount:checks.filter(item=>item.pass).length,
  failCount:failures.length,
  failures,
  checks,
  downstreamStageAuthorized:pass?'V3_CAMERA_TRUE_INSTANCED_LOD':null,
  v4PlusAuthorized:false,
  mergeDeploymentPublicationAuthorized:false
};
const text=JSON.stringify(receipt,null,2)+'\n';
if(OUTPUT)fs.writeFileSync(OUTPUT,text);else process.stdout.write(text);
if(!pass)process.exitCode=1;
