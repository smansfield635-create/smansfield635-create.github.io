#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';

const CONTRACT='control-plane/whole-estate/characters-reconstruction-v1/vegetation-v0-v3-contract.v1.json';
const V0_DISPOSITION='control-plane/whole-estate/characters-reconstruction-v1/vegetation-v0-known-verifier-false-negative.v1.json';
const ECOLOGY='characters/vegetation-ecology.mjs';
const UPSTREAM='h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';
const OUTPUT=process.argv.includes('--output') ? process.argv[process.argv.indexOf('--output')+1] : null;

const contract=JSON.parse(fs.readFileSync(CONTRACT,'utf8'));
const disposition=JSON.parse(fs.readFileSync(V0_DISPOSITION,'utf8'));
const source=fs.readFileSync(ECOLOGY,'utf8');
const failures=[];
const checks=[];
const check=(id,pass,detail=null)=>{checks.push({id,pass,detail});if(!pass)failures.push(id);};
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const blob=(ref,file)=>git('rev-parse',`${ref}:${file}`);

check('CONTRACT_SCHEMA',contract.schema==='MIRRORLAND_VEGETATION_V0_V3_CONTRACT_v1');
check('OPERATION_ID',contract.operationId==='MIRRORLAND_CANONICAL_ECOLOGY_CAMERA_TRUE_VEGETATION_20260905_003');
check('LOCK_GENERATION',contract.lockGeneration===1956);
check('V1_REQUIRED_RESULT',contract.v1.resultRequired==='V1_ECOLOGY_AUTHORITY_PASS_CLOSED');
check('V1_AUTHORITY',contract.v1.authority===`${UPSTREAM}#sampleAudraliaGratitudeTerrain`);
check('V1_READ_ONLY',contract.v1.readOnly===true);
check('V1_DUPLICATE_ECOLOGY_EQUATIONS_PROHIBITED',contract.v1.duplicateEcologyEquationsProhibited===true);

check('V0_DISPOSITION_SCHEMA',disposition.schema==='MIRRORLAND_V0_VERIFIER_FALSE_NEGATIVE_DISPOSITION_v1');
check('V0_DISPOSITION_OPERATION',disposition.operationId===contract.operationId);
check('V0_FORMAL_RECEIPT_REMAINS_FAIL_CLOSED',disposition.formalReceiptResult==='FAIL_CLOSED');
check('V0_FALSE_NEGATIVE_CLASSIFICATION',disposition.classification==='KNOWN_VERIFIER_FALSE_NEGATIVE');
check('V0_SINGLE_KNOWN_FAILURE',JSON.stringify(disposition.observed?.failures)===JSON.stringify(['BASELINE_DEVICE_DEPENDENT_GENERATION']));
check('V0_FORWARD_CONSTRUCTION_OWNER_DISPOSITION',disposition.ownerDisposition?.forwardConstructionAuthorized==='V1_CANONICAL_ECOLOGY_EXPOSURE');
check('V0_PASS_NOT_RELABELED',disposition.ownerDisposition?.v0PassClaimAuthorized===false);
check('V0_AGGREGATE_RECONCILIATION_REQUIRED',disposition.ownerDisposition?.aggregateClosureRequiresV0FormalReconciliation===true);
check('ACCEPTANCE_NOT_RELAXED',disposition.ownerDisposition?.acceptanceCriteriaRelaxed===false);

let governingAuthorityBlob=null,currentAuthorityBlob=null;
try{
  governingAuthorityBlob=blob(contract.exactGoverningHead,UPSTREAM);
  currentAuthorityBlob=blob('HEAD',UPSTREAM);
}catch(error){
  check('UPSTREAM_AUTHORITY_PRESENT',false,String(error.message));
}
if(governingAuthorityBlob&&currentAuthorityBlob){
  check('UPSTREAM_AUTHORITY_UNCHANGED',currentAuthorityBlob===governingAuthorityBlob,{governingAuthorityBlob,currentAuthorityBlob});
}

check('EXACT_UPSTREAM_IMPORT',source.includes("from '../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js'"));
check('UPSTREAM_SAMPLE_EXPORT_CONSUMED',/\bsampleAudraliaGratitudeTerrain\b/.test(source));
check('AUTHORITY_DECLARED_READ_ONLY',/readOnly:true/.test(source));
check('NO_LOCAL_FOREST_WEIGHT_FUNCTION',!/function\s+forestWeight\s*\(/.test(source));
check('NO_LOCAL_GAUSSIAN_ECOLOGY',!/\bgaussian\s*=|function\s+gaussian\s*\(/.test(source));
check('NO_LOCAL_SMOOTHSTEP_ECOLOGY',!/\bsmoothstep\s*=|function\s+smoothstep\s*\(/.test(source));
check('NO_LOCAL_RIVER_WEIGHT_FUNCTION',!/function\s+riverWeight\s*\(/.test(source));
check('NO_LOCAL_LAKE_WEIGHT_FUNCTION',!/function\s+lakeWeight\s*\(/.test(source));

const ecologyModule=await import(pathToFileURL(path.resolve(ECOLOGY)).href);
const upstreamModule=await import(pathToFileURL(path.resolve(UPSTREAM)).href);
check('V1_AUTHORITY_SCHEMA',ecologyModule.VEGETATION_ECOLOGY_AUTHORITY?.schema==='MIRRORLAND_CANONICAL_VEGETATION_ECOLOGY_AUTHORITY_v1');
check('V1_SOURCE_CONTRACT_MATCH',ecologyModule.VEGETATION_ECOLOGY_AUTHORITY?.sourceContractId===upstreamModule.AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID);
check('V1_EXPORT_READ_ONLY',ecologyModule.VEGETATION_ECOLOGY_AUTHORITY?.readOnly===true);
check('V1_EXPORT_NO_DUPLICATE_EQUATIONS',ecologyModule.VEGETATION_ECOLOGY_AUTHORITY?.duplicateEcologyEquations===false);

const envelope=upstreamModule.AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER.resolvedEnvelope;
const width=envelope.xMaximum-envelope.xMinimum;
const depth=envelope.zMaximum-envelope.zMinimum;
const probes=[
  [envelope.xMinimum+width*.25,envelope.zMinimum+depth*.30],
  [envelope.xMinimum+width*.50,envelope.zMinimum+depth*.50],
  [envelope.xMinimum+width*.75,envelope.zMinimum+depth*.70]
];
for(let i=0;i<probes.length;i++){
  const [x,z]=probes[i];
  const upstream=upstreamModule.sampleAudraliaGratitudeTerrain(x,z);
  const exposed=ecologyModule.sampleCanonicalVegetationEcology(x,z);
  check(`PROBE_${i}_UPSTREAM_VALID`,upstream?.valid===true,{x,z,status:upstream?.status});
  check(`PROBE_${i}_EXPOSED_VALID`,exposed?.valid===true,{x,z,status:exposed?.status});
  if(upstream?.valid===true&&exposed?.valid===true){
    check(`PROBE_${i}_FOREST_WEIGHT_EXACT`,exposed.biome?.forestWeight===upstream.biome?.forestWeight,{upstream:upstream.biome?.forestWeight,exposed:exposed.biome?.forestWeight});
    check(`PROBE_${i}_BIOME_CLASS_EXACT`,exposed.biome?.class===upstream.biome?.class,{upstream:upstream.biome?.class,exposed:exposed.biome?.class});
    check(`PROBE_${i}_HYDROLOGY_EXACT`,JSON.stringify(exposed.hydrology)===JSON.stringify(upstream.hydrology));
    check(`PROBE_${i}_MATERIAL_PROFILE_EXACT`,exposed.materialProfile===upstream.materialProfile);
    check(`PROBE_${i}_ELEVATION_EXACT`,exposed.elevation===upstream.elevation);
    check(`PROBE_${i}_SHORELINE_DISTANCE_EXACT`,exposed.shorelineDistance===upstream.shorelineDistance);
  }
}

const pass=failures.length===0;
const receipt={
  schema:'MIRRORLAND_VEGETATION_V1_RECEIPT_v1',
  operationId:contract.operationId,
  exactGoverningHead:contract.exactGoverningHead,
  candidateHead:git('rev-parse','HEAD'),
  currentStage:'V1_CANONICAL_ECOLOGY_EXPOSURE',
  result:pass?'V1_ECOLOGY_AUTHORITY_PASS_CLOSED':'FAIL_CLOSED',
  stageResults:{
    V0:'KNOWN_VERIFIER_FALSE_NEGATIVE_OWNER_DISPOSITION',
    V1:pass?'V1_ECOLOGY_AUTHORITY_PASS_CLOSED':'FAIL_CLOSED',
    V2:'PENDING',
    V3:'PENDING',
    aggregate:'PENDING'
  },
  v0FormalReceiptResult:disposition.formalReceiptResult,
  v0FormalReconciliationRequired:true,
  checkCount:checks.length,
  passCount:checks.filter(x=>x.pass).length,
  failCount:failures.length,
  failures,
  checks,
  downstreamStageAuthorized:pass?'V2_DEVICE_INVARIANT_CANONICAL_POPULATION':null,
  v4PlusAuthorized:false,
  mergeDeploymentPublicationAuthorized:false
};

const text=JSON.stringify(receipt,null,2)+'\n';
if(OUTPUT)fs.writeFileSync(OUTPUT,text);else process.stdout.write(text);
if(!pass)process.exitCode=1;
