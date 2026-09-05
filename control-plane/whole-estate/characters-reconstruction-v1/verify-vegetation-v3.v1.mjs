#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolveStep9Camera,step9Frame} from '../../../characters/step9-regional-geography.mjs';
import {getCanonicalVegetationPopulation} from '../../../characters/vegetation-population.mjs';
import {
  CAMERA_TRUE_VEGETATION_REPRESENTATION_CONTRACT,
  classifyVegetationLod,
  buildVegetationRepresentationFrame
} from '../../../characters/vegetation-representation.mjs';

const CONTRACT='control-plane/whole-estate/characters-reconstruction-v1/vegetation-v0-v3-contract.v1.json';
const V0_DISPOSITION='control-plane/whole-estate/characters-reconstruction-v1/vegetation-v0-known-verifier-false-negative.v1.json';
const V2_DISPOSITION='control-plane/whole-estate/characters-reconstruction-v1/vegetation-v2-known-instrumental-failure.v1.json';
const REPRESENTATION='characters/vegetation-representation.mjs';
const OUTPUT=process.argv.includes('--output')?process.argv[process.argv.indexOf('--output')+1]:null;

const contract=JSON.parse(fs.readFileSync(CONTRACT,'utf8'));
const v0Disposition=JSON.parse(fs.readFileSync(V0_DISPOSITION,'utf8'));
const v2Disposition=JSON.parse(fs.readFileSync(V2_DISPOSITION,'utf8'));
const source=fs.readFileSync(REPRESENTATION,'utf8');
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
const populationDigest=population=>sha256(JSON.stringify(stableIdentity(population)));

check('CONTRACT_SCHEMA',contract.schema==='MIRRORLAND_VEGETATION_V0_V3_CONTRACT_v1');
check('OPERATION_ID',contract.operationId==='MIRRORLAND_CANONICAL_ECOLOGY_CAMERA_TRUE_VEGETATION_20260905_003');
check('LOCK_GENERATION',contract.lockGeneration===1956);
check('V3_REQUIRED_RESULT',contract.v3.resultRequired==='V3_CAMERA_TRUE_REPRESENTATION_PASS_CLOSED');
check('V3_LOD_AUTHORITY',contract.v3.lodAuthority==='CAMERA_DISTANCE_OR_PROJECTED_SCREEN_SIZE');
check('V3_HYSTERESIS_REQUIRED',contract.v3.hysteresisRequired===true);
check('V3_CANOPY_BLOB_BOUNDARY',JSON.stringify(contract.v3.canopyBlobAllowedOnly)===JSON.stringify(['FAR_FIELD','INTERNAL_CROWN_OCCLUSION']));

check('V0_FORMAL_RECEIPT_REMAINS_FAIL_CLOSED',v0Disposition.formalReceiptResult==='FAIL_CLOSED');
check('V0_KNOWN_FALSE_NEGATIVE',v0Disposition.classification==='KNOWN_VERIFIER_FALSE_NEGATIVE');
check('V0_AGGREGATE_RECONCILIATION_REQUIRED',v0Disposition.ownerDisposition?.aggregateClosureRequiresV0FormalReconciliation===true);

check('V2_DISPOSITION_SCHEMA',v2Disposition.schema==='MIRRORLAND_V2_INSTRUMENTAL_VERIFIER_FAILURE_DISPOSITION_v1');
check('V2_FORMAL_RECEIPT_REMAINS_FAIL_CLOSED',v2Disposition.formalReceiptResult==='FAIL_CLOSED');
check('V2_INSTRUMENTAL_CLASSIFICATION',v2Disposition.classification==='KNOWN_INSTRUMENTAL_VERIFIER_FAILURE');
check('V2_FORWARD_CONSTRUCTION_OWNER_DISPOSITION',v2Disposition.ownerDisposition?.forwardConstructionAuthorized==='V3_CAMERA_TRUE_INSTANCED_LOD');
check('V2_PASS_NOT_RELABELED',v2Disposition.ownerDisposition?.v2PassClaimAuthorized===false);
check('V2_AGGREGATE_RECONCILIATION_REQUIRED',v2Disposition.ownerDisposition?.aggregateClosureRequiresV2FormalReconciliation===true);
check('V2_ACCEPTANCE_NOT_RELAXED',v2Disposition.ownerDisposition?.acceptanceCriteriaRelaxed===false);
check('V2_POPULATION_COUNT_EVIDENCE',v2Disposition.observed?.populationCount===818);
check('V2_CONTEXT_MATRIX_EVIDENCE',v2Disposition.observed?.invariantContextCount===60);
check('V2_CHECK_COUNTS',v2Disposition.observed?.checkCount===8336&&v2Disposition.observed?.passCount===8334&&v2Disposition.observed?.failCount===2);
check('V2_FAILURES_EXACT',JSON.stringify(v2Disposition.observed?.failures)===JSON.stringify(['V0_FALSE_NEGATIVE_OWNER_DISPOSITION','V0_AGGREGATE_RECONCILIATION_REQUIRED']));

check('REPRESENTATION_CONTRACT_SCHEMA',CAMERA_TRUE_VEGETATION_REPRESENTATION_CONTRACT.schema==='MIRRORLAND_CAMERA_TRUE_INSTANCED_VEGETATION_REPRESENTATION_CONTRACT_v1');
check('REPRESENTATION_CONTRACT_OPERATION',CAMERA_TRUE_VEGETATION_REPRESENTATION_CONTRACT.operationId===contract.operationId);
check('REPRESENTATION_CONTRACT_STAGE',CAMERA_TRUE_VEGETATION_REPRESENTATION_CONTRACT.stage==='V3_CAMERA_TRUE_INSTANCED_LOD');
check('REPRESENTATION_POPULATION_IMMUTABLE',CAMERA_TRUE_VEGETATION_REPRESENTATION_CONTRACT.canonicalPopulationMutable===false);
check('REPRESENTATION_LOD_AUTHORITY_PERMITTED',['CAMERA_DISTANCE','PROJECTED_SCREEN_SIZE'].includes(CAMERA_TRUE_VEGETATION_REPRESENTATION_CONTRACT.lodAuthority));
check('REPRESENTATION_HYSTERESIS_REQUIRED',CAMERA_TRUE_VEGETATION_REPRESENTATION_CONTRACT.hysteresisRequired===true);
check('REPRESENTATION_CANOPY_BLOB_BOUNDARY',JSON.stringify(CAMERA_TRUE_VEGETATION_REPRESENTATION_CONTRACT.canopyBlobAllowedOnly)===JSON.stringify(contract.v3.canopyBlobAllowedOnly));
check('REPRESENTATION_ONLY',CAMERA_TRUE_VEGETATION_REPRESENTATION_CONTRACT.representationOnly===true);
check('WEBGL2_INSTANCING_PRESENT',source.includes('drawArraysInstanced'));
check('NO_COMPACT_IDENTITY_INPUT',!/\bcompact\b/.test(source));
check('NO_DEVICE_CLASS_IDENTITY_INPUT',!/\bdeviceClass\b/.test(source));
check('NO_VIEWPORT_CLASS_IDENTITY_INPUT',!/\bviewportClass\b/.test(source));
check('NO_REDUCED_MOTION_IDENTITY_INPUT',!/\breducedMotion\b/.test(source));

const population=getCanonicalVegetationPopulation();
const referenceDigest=populationDigest(population);
check('CANONICAL_POPULATION_COUNT',population.instanceCount===818,{actual:population.instanceCount});
check('CANONICAL_POPULATION_DIGEST',referenceDigest===v2Disposition.observed.populationIdentityDigest,{referenceDigest,expected:v2Disposition.observed.populationIdentityDigest});

const {nearMid,midFar}=CAMERA_TRUE_VEGETATION_REPRESENTATION_CONTRACT.hysteresis;
check('HYSTERESIS_NEAR_HOLDS_INSIDE_BAND',classifyVegetationLod(nearMid.enterFar-1,'NEAR_FIELD')==='NEAR_FIELD');
check('HYSTERESIS_NEAR_TO_MID',classifyVegetationLod(nearMid.enterFar+1,'NEAR_FIELD')==='MID_FIELD');
check('HYSTERESIS_MID_HOLDS_ABOVE_NEAR_RETURN',classifyVegetationLod(nearMid.enterNear+1,'MID_FIELD')==='MID_FIELD');
check('HYSTERESIS_MID_TO_NEAR',classifyVegetationLod(nearMid.enterNear-1,'MID_FIELD')==='NEAR_FIELD');
check('HYSTERESIS_MID_TO_FAR',classifyVegetationLod(midFar.enterFar+1,'MID_FIELD')==='FAR_FIELD');
check('HYSTERESIS_FAR_HOLDS_INSIDE_BAND',classifyVegetationLod(midFar.enterNear+1,'FAR_FIELD')==='FAR_FIELD');
check('HYSTERESIS_FAR_TO_MID',classifyVegetationLod(midFar.enterNear-1,'FAR_FIELD')==='MID_FIELD');

const frame=step9Frame().envelope;
const center={
  x:(frame.xMinimum+frame.xMaximum)/2,
  y:frame.seaLevelY??0,
  z:(frame.zMinimum+frame.zMaximum)/2
};
const cameraFor=state=>{
  if(state==='ORBIT')return {eye:{x:center.x,y:center.y+1800,z:center.z+1450},look:center};
  return resolveStep9Camera(state);
};

let previousFrame=null;
let changedAcrossCameraStates=0;
const lodTotals={NEAR_FIELD:0,MID_FIELD:0,FAR_FIELD:0};
let canopyBlobViolations=0;
let matrixCount=0;

for(const state of contract.v0.referenceCameraMatrix.states){
  const camera=cameraFor(state);
  const current=buildVegetationRepresentationFrame({camera,previousFrame});
  matrixCount++;
  check(`FRAME_SCHEMA:${state}`,current.schema==='MIRRORLAND_CAMERA_TRUE_INSTANCED_VEGETATION_REPRESENTATION_FRAME_v1');
  check(`FRAME_COUNT:${state}`,current.representationCount===population.instanceCount,{expected:population.instanceCount,actual:current.representationCount});
  check(`FRAME_CANONICAL_COUNT:${state}`,current.canonicalPopulationCount===population.instanceCount);
  check(`FRAME_LOD_AUTHORITY:${state}`,current.lodAuthority===CAMERA_TRUE_VEGETATION_REPRESENTATION_CONTRACT.lodAuthority);
  check(`FRAME_HYSTERESIS:${state}`,current.hysteresisApplied===true);

  const currentById=new Map(current.representations.map(item=>[item.id,item]));
  for(const instance of population.instances){
    const rep=currentById.get(instance.id);
    check(`REPRESENTATION_PRESENT:${state}:${instance.id}`,Boolean(rep));
    if(!rep)continue;
    check(`CANONICAL_WORLD_PRESERVED:${state}:${instance.id}`,rep.canonicalWorld===instance.world);
    check(`LOD_VALID:${state}:${instance.id}`,['NEAR_FIELD','MID_FIELD','FAR_FIELD'].includes(rep.lod));
    lodTotals[rep.lod]++;
    if(rep.usesCanopyBlob&&!['FAR_FIELD','INTERNAL_CROWN_OCCLUSION'].includes(rep.lod)&&rep.occlusionRole!=='INTERNAL_CROWN_OCCLUSION'){
      canopyBlobViolations++;
    }
  }

  if(previousFrame){
    const prior=new Map(previousFrame.representations.map(item=>[item.id,item.lod]));
    for(const rep of current.representations){
      if(prior.get(rep.id)!==rep.lod)changedAcrossCameraStates++;
    }
  }
  previousFrame=current;
}
check('CAMERA_MATRIX_COUNT',matrixCount===10,{matrixCount});
check('CAMERA_TRUE_LOD_CHANGES',changedAcrossCameraStates>0,{changedAcrossCameraStates});
check('NEAR_FIELD_EXERCISED',lodTotals.NEAR_FIELD>0,lodTotals);
check('MID_FIELD_EXERCISED',lodTotals.MID_FIELD>0,lodTotals);
check('FAR_FIELD_EXERCISED',lodTotals.FAR_FIELD>0,lodTotals);
check('CANOPY_BLOB_BOUNDARY_RESPECTED',canopyBlobViolations===0,{canopyBlobViolations});

for(const [path,expected] of Object.entries(contract.v0.sourceIdentity)){
  const current=blob('HEAD',path);
  check(`V0_SOURCE_BASELINE_PRESERVED:${path}`,current===expected,{expected,current});
}

const pass=failures.length===0;
const receipt={
  schema:'MIRRORLAND_VEGETATION_V3_RECEIPT_v1',
  operationId:contract.operationId,
  exactGoverningHead:contract.exactGoverningHead,
  candidateHead:git('rev-parse','HEAD'),
  currentStage:'V3_CAMERA_TRUE_INSTANCED_LOD',
  result:pass?'V3_CAMERA_TRUE_REPRESENTATION_PASS_CLOSED':'FAIL_CLOSED',
  stageResults:{
    V0:'KNOWN_VERIFIER_FALSE_NEGATIVE_OWNER_DISPOSITION',
    V1:'V1_ECOLOGY_AUTHORITY_PASS_CLOSED',
    V2:'KNOWN_INSTRUMENTAL_VERIFIER_FAILURE_OWNER_DISPOSITION',
    V3:pass?'V3_CAMERA_TRUE_REPRESENTATION_PASS_CLOSED':'FAIL_CLOSED',
    aggregate:'PENDING_FORMAL_RECONCILIATION'
  },
  v0FormalReceiptResult:'FAIL_CLOSED',
  v0FormalReconciliationRequired:true,
  v2FormalReceiptResult:'FAIL_CLOSED',
  v2FormalReconciliationRequired:true,
  canonicalPopulationCount:population.instanceCount,
  canonicalPopulationIdentityDigest:referenceDigest,
  cameraMatrixCount:matrixCount,
  cameraDrivenLodChangeCount:changedAcrossCameraStates,
  lodTotals,
  checkCount:checks.length,
  passCount:checks.filter(item=>item.pass).length,
  failCount:failures.length,
  failures,
  checks,
  aggregateReconciliationAuthorized:pass,
  v4PlusAuthorized:false,
  mergeDeploymentPublicationAuthorized:false
};
const text=JSON.stringify(receipt,null,2)+'\n';
if(OUTPUT)fs.writeFileSync(OUTPUT,text);else process.stdout.write(text);
if(!pass)process.exitCode=1;
