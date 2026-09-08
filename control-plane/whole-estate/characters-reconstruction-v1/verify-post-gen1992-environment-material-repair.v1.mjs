#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const CONTRACT=JSON.parse(fs.readFileSync(path.join(HERE,'post-gen1992-environment-material-repair-contract.v1.json'),'utf8'));
const args={};
for(let i=2;i<process.argv.length;i++){
  const token=process.argv[i];
  if(!token.startsWith('--'))throw new Error(`UNKNOWN_ARGUMENT:${token}`);
  args[token.slice(2)]=process.argv[++i]??null;
}
for(const required of ['baseline-root','candidate-root','v2-receipt','output'])if(!args[required])throw new Error(`ARGUMENT_REQUIRED:${required}`);
const BASE=path.resolve(args['baseline-root']);
const CANDIDATE=path.resolve(args['candidate-root']);
const V2_PATH=path.resolve(args['v2-receipt']);
const OUTPUT=path.resolve(args.output);
const deepEqual=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const sha256=buffer=>crypto.createHash('sha256').update(buffer).digest('hex');
const blobSha=buffer=>crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${buffer.length}\0`),buffer])).digest('hex');
const read=(root,rel)=>fs.readFileSync(path.join(root,rel));
const readText=(root,rel)=>read(root,rel).toString('utf8');
const git=(root,...argv)=>{
  const r=spawnSync('git',['-C',root,...argv],{encoding:'utf8'});
  if(r.error||r.status!==0)throw new Error(`GIT_COMMAND_FAILED:${argv.join(':')}:${r.stderr||r.error?.message||''}`);
  return r.stdout.trim();
};
const importCandidate=rel=>import(`${pathToFileURL(path.join(CANDIDATE,rel)).href}?gen1995=1`);

const EXPECTED={
  schema:'POST_GEN1992_ENVIRONMENT_MATERIAL_REPAIR_CONTRACT_v1',
  operationId:'MIRRORLAND_POST_GEN1992_ENVIRONMENT_MATERIAL_REPAIR_20260907_002',
  lockGeneration:1995,
  governingHead:'8f97bb035dce439cf28ca156b2fcd5bdfc6a1953',
  frozenFailedProductSha:'b193e6758f776b5ff6006c96037ee1a7632ddb64',
  frozenV5BlobSha:'f3b64eb1ffc1c1bc8e908ff96eb6c833b6bc928d',
  canonicalCanopyCount:818,
  toolingHead:'834038c23711c3eed83dc21964027bd515852b51',
  toolingContractBlob:'84014a5a51a50d43e86c9e4f54bb0804d3655af1',
  toolingVerifierBlob:'6a7007cb37d04ea5af3542783342043c5c0a5829',
  toolingWorkflowBlob:'77b5b2e460adb86a123437c6eeb8d36ea8da5ba2',
  metricFamilies:[
    'FRUSTUM_SURFACE_CONTAINMENT_RISK_V2',
    'CANOPY_FIELD_CONTINUITY',
    'ELIGIBLE_GROUND_VISUAL_AREA_OCCUPANCY_V2',
    'HYDROLOGY_RESPONSE_STRENGTH'
  ],
  expectedV2FailedChecks:[
    'ALL_FOUR_KNOWN_FAILURE_FAMILIES_DETECTED',
    'CALIBRATION_CANOPY_CONTINUITY_RISK_DETECTED',
    'CALIBRATION_GROUND_VISUAL_AREA_RISK_DETECTED',
    'CALIBRATION_HYDROLOGY_RESPONSE_RISK_DETECTED',
    'CALIBRATION_SURFACE_CONTAINMENT_RISK_DETECTED'
  ].sort()
};
const expectedChanged=[
  '.github/workflows/characters-post-gen1992-environment-material-repair-v1.yml',
  'characters/app.mjs',
  'characters/vegetation-population.mjs',
  'characters/vegetation-understory.mjs',
  'control-plane/whole-estate/characters-reconstruction-v1/post-gen1992-environment-material-repair-contract.v1.json',
  'control-plane/whole-estate/characters-reconstruction-v1/verify-post-gen1992-environment-material-repair.v1.mjs'
].sort();

const checks=[];
const check=(id,pass,detail={})=>checks.push({id,pass:Boolean(pass),detail});
check('CONTRACT_SCHEMA',CONTRACT.schema===EXPECTED.schema,{observed:CONTRACT.schema});
check('OPERATION_ID',CONTRACT.operationId===EXPECTED.operationId,{observed:CONTRACT.operationId});
check('LOCK_GENERATION',CONTRACT.lockGeneration===EXPECTED.lockGeneration,{observed:CONTRACT.lockGeneration});
check('GOVERNING_HEAD',CONTRACT.governingHead===EXPECTED.governingHead,{observed:CONTRACT.governingHead});
check('FROZEN_FAILED_PRODUCT_SHA',CONTRACT.frozenFailedProductSha===EXPECTED.frozenFailedProductSha,{observed:CONTRACT.frozenFailedProductSha});
check('FROZEN_V5_BLOB_SHA',CONTRACT.frozenV5BlobSha===EXPECTED.frozenV5BlobSha,{observed:CONTRACT.frozenV5BlobSha});
check('CANONICAL_CANOPY_COUNT',CONTRACT.canonicalCanopyCount===EXPECTED.canonicalCanopyCount,{observed:CONTRACT.canonicalCanopyCount});
check('V2_TOOLING_HEAD',CONTRACT.evaluationTooling?.head===EXPECTED.toolingHead,{observed:CONTRACT.evaluationTooling?.head});
check('V2_TOOLING_CONTRACT_BLOB',CONTRACT.evaluationTooling?.contractBlobSha===EXPECTED.toolingContractBlob,{observed:CONTRACT.evaluationTooling?.contractBlobSha});
check('V2_TOOLING_VERIFIER_BLOB',CONTRACT.evaluationTooling?.verifierBlobSha===EXPECTED.toolingVerifierBlob,{observed:CONTRACT.evaluationTooling?.verifierBlobSha});
check('V2_TOOLING_WORKFLOW_BLOB',CONTRACT.evaluationTooling?.workflowBlobSha===EXPECTED.toolingWorkflowBlob,{observed:CONTRACT.evaluationTooling?.workflowBlobSha});
check('V2_DEFINITIONS_IMMUTABLE',CONTRACT.evaluationTooling?.definitionsAndThresholdsImmutable===true);
check('FOUR_METRIC_FAMILIES_FROZEN',deepEqual(CONTRACT.metricFamilies,EXPECTED.metricFamilies),{observed:CONTRACT.metricFamilies});
check('MATERIAL_DISPOSITION_AUTHORITY_FALSE',CONTRACT.acceptanceLaw?.materialDispositionAuthority===false);
check('MATERIAL_DISPOSITION_UNASSIGNED',CONTRACT.acceptanceLaw?.materialDisposition==='UNASSIGNED_PENDING_FRESH_VISUAL_EVIDENCE_AND_READ_ONLY_ADJUDICATION',{observed:CONTRACT.acceptanceLaw?.materialDisposition});

const baselineHead=git(BASE,'rev-parse','HEAD^{commit}');
const candidateHead=git(CANDIDATE,'rev-parse','HEAD^{commit}');
check('BASELINE_EXACT_FROZEN_PRODUCT',baselineHead===EXPECTED.frozenFailedProductSha,{observed:baselineHead});
let ancestor=false;
try{ancestor=spawnSync('git',['-C',CANDIDATE,'merge-base','--is-ancestor',EXPECTED.frozenFailedProductSha,candidateHead]).status===0;}catch{}
check('CANDIDATE_DESCENDS_FROM_FROZEN_PRODUCT',ancestor,{candidateHead});
const changed=git(CANDIDATE,'diff','--name-only',`${EXPECTED.frozenFailedProductSha}...${candidateHead}`).split('\n').filter(Boolean).sort();
check('EXACT_SIX_PATH_SCOPE',deepEqual(changed,expectedChanged),{observed:changed,expected:expectedChanged});
check('BASELINE_WORKTREE_CLEAN',git(BASE,'status','--porcelain')==='');
check('CANDIDATE_WORKTREE_CLEAN',git(CANDIDATE,'status','--porcelain')==='');

const v5Observed=blobSha(read(CANDIDATE,'characters/vegetation-representation.mjs'));
check('V5_BYTE_IDENTITY',v5Observed===EXPECTED.frozenV5BlobSha,{observed:v5Observed});
for(const rel of CONTRACT.protectedPaths||[]){
  const baseBytes=read(BASE,rel),candidateBytes=read(CANDIDATE,rel);
  check(`PROTECTED_PATH_IDENTICAL:${rel}`,Buffer.compare(baseBytes,candidateBytes)===0,{sha256:sha256(candidateBytes)});
}

const surfaceRegex=/const SURFACE_CONTAINMENT=Object\.freeze\(\{padX:compact\?(\d+(?:\.\d+)?):(\d+(?:\.\d+)?),padNearZ:compact\?(\d+(?:\.\d+)?):(\d+(?:\.\d+)?),drop:(\d+(?:\.\d+)?),waterMarginX:compact\?(\d+(?:\.\d+)?):(\d+(?:\.\d+)?),waterFarZ:compact\?(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)\}\)/;
const orbitRegex=/const ORBIT=\{eye:\[([^\]]+)\],look:\[([^\]]+)\]\}/;
const baseApp=readText(BASE,'characters/app.mjs'),candidateApp=readText(CANDIDATE,'characters/app.mjs');
const baseSurface=baseApp.match(surfaceRegex),candidateSurface=candidateApp.match(surfaceRegex);
check('BASELINE_SURFACE_LAW_PARSED',Boolean(baseSurface));
check('CANDIDATE_SURFACE_LAW_PARSED',Boolean(candidateSurface));
const normalizeSurface=source=>source.replace(surfaceRegex,'const SURFACE_CONTAINMENT=__GEN1995_SURFACE_CONTAINMENT__');
check('APP_MUTATION_ONLY_SURFACE_CONTAINMENT_LAW',Boolean(baseSurface&&candidateSurface)&&normalizeSurface(baseApp)===normalizeSurface(candidateApp));
const baseOrbit=baseApp.match(orbitRegex)?.[0]??null,candidateOrbit=candidateApp.match(orbitRegex)?.[0]??null;
check('APP_ORBIT_CAMERA_UNCHANGED',Boolean(baseOrbit)&&baseOrbit===candidateOrbit,{baseline:baseOrbit,candidate:candidateOrbit});

const populationModule=await importCandidate('characters/vegetation-population.mjs');
const understoryModule=await importCandidate('characters/vegetation-understory.mjs');
const population=populationModule.getCanonicalVegetationPopulation();
const understory=understoryModule.getCanonicalUnderstoryPopulation();
check('CANDIDATE_CANOPY_COUNT_818',population.instanceCount===818,{observed:population.instanceCount});
check('CANOPY_FIXED_TARGET_CONTRACT',populationModule.CANONICAL_VEGETATION_POPULATION_CONTRACT?.fixedTargetCount===true&&populationModule.CANONICAL_VEGETATION_POPULATION_CONTRACT?.exactPopulationBudget===818,{contract:populationModule.CANONICAL_VEGETATION_POPULATION_CONTRACT});
check('CANOPY_DEVICE_CAMERA_INVARIANT',populationModule.CANONICAL_VEGETATION_POPULATION_CONTRACT?.populationIdentityDeviceInvariant===true&&populationModule.CANONICAL_VEGETATION_POPULATION_CONTRACT?.populationIdentityCameraInvariant===true);
check('UNDERSTORY_PRESENT',Number.isInteger(understory.instanceCount)&&understory.instanceCount>0,{observed:understory.instanceCount});
check('UNDERSTORY_ECOLOGY_AUTHORITY_PRESERVED',understoryModule.V4_UNDERSTORY_CONTRACT?.ecologySource==='characters/vegetation-ecology.mjs#sampleCanonicalVegetationEcology'&&understoryModule.V4_UNDERSTORY_CONTRACT?.standEdgeSource==='characters/vegetation-edge-ecology.mjs#resolveVegetationEnvironment');
check('UNDERSTORY_DEVICE_CAMERA_INVARIANT',understoryModule.V4_UNDERSTORY_CONTRACT?.populationIdentityDeviceInvariant===true&&understoryModule.V4_UNDERSTORY_CONTRACT?.populationIdentityCameraInvariant===true);

const v2=JSON.parse(fs.readFileSync(V2_PATH,'utf8'));
check('V2_RECEIPT_SCHEMA',v2.schema==='MIRRORLAND_GEN1983_CAMERA_SPACE_ENVIRONMENT_DIAGNOSTICS_V2_RECEIPT_v1',{observed:v2.schema});
check('V2_EVALUATOR_EXPECTED_CALIBRATION_FAIL_CLOSED',v2.result==='FAIL_CLOSED'&&v2.instrumentValid===false,{result:v2.result,instrumentValid:v2.instrumentValid});
check('V2_CALIBRATION_REQUIREMENT_UNCHANGED',v2.calibrationRequirement==='ALL_FOUR_GEN1984_FAILED_DIMENSIONS_RISK_TRUE',{observed:v2.calibrationRequirement});
const failedIds=(v2.checks||[]).filter(x=>x.pass!==true).map(x=>x.id).sort();
check('V2_ONLY_EXPECTED_FIVE_CALIBRATION_CHECKS_FAIL',deepEqual(failedIds,EXPECTED.expectedV2FailedChecks),{observed:failedIds,expected:EXPECTED.expectedV2FailedChecks});
check('V2_FAIL_COUNT_EXACTLY_FIVE',v2.failCount===5,{observed:v2.failCount});
const familyRisk=v2.metrics?.familyRisk||{};
check('V2_FAMILY_RISK_KEYS_EXACT',deepEqual(Object.keys(familyRisk).sort(),[...EXPECTED.metricFamilies].sort()),{observed:Object.keys(familyRisk).sort()});
check('ALL_FOUR_V2_RISK_FAMILIES_CLEAR',EXPECTED.metricFamilies.every(id=>familyRisk[id]===false),{familyRisk});
const stateMetrics=v2.metrics?.stateMetrics||[];
check('V2_REPRESENTATIVE_STATE_COUNT',stateMetrics.length===7,{observed:stateMetrics.length});
check('SURFACE_RISK_CLEAR_ALL_STATES_PROFILES',stateMetrics.every(s=>Object.values(s.frustumSurfaceContainmentV2||{}).every(x=>x.risk===false)));
check('CANOPY_CONTINUITY_RISK_CLEAR_ALL_STATES',stateMetrics.every(s=>s.canopyFieldContinuity?.risk===false));
check('GROUND_VISUAL_AREA_RISK_CLEAR_ALL_STATES',stateMetrics.every(s=>s.eligibleGroundVisualAreaOccupancyV2?.risk===false));
check('HYDROLOGY_RESPONSE_RISK_CLEAR',v2.metrics?.hydrologyResponse?.risk===false,{hydrologyResponse:v2.metrics?.hydrologyResponse});
check('V2_CANOPY_COUNT_818',v2.metrics?.population?.instanceCount===818,{observed:v2.metrics?.population?.instanceCount});
check('V2_V5_IDENTITY',v2.metrics?.population?.v5BlobObserved===EXPECTED.frozenV5BlobSha,{observed:v2.metrics?.population?.v5BlobObserved});
check('V2_NO_MATERIAL_AUTHORITY',v2.materialDispositionAuthority===false&&v2.environmentDispositionAuthority===false);
check('V2_NO_PRODUCT_MUTATION_AUTHORITY',v2.productMutationAuthorized===false&&v2.productMutationDetected===false);

const failed=checks.filter(x=>!x.pass);
const evidence={
  candidateHead,
  baselineHead,
  changedPaths:changed,
  population:{canopyCount:population.instanceCount,understoryCount:understory.instanceCount,v5BlobObserved:v5Observed},
  v2:{metricDigest:v2.metricDigest,familyRisk,failedCheckIds:failedIds,hydrologyResponse:v2.metrics?.hydrologyResponse},
  app:{surfaceContainmentSource:candidateSurface?.[0]??null,orbitSource:candidateOrbit}
};
const receipt={
  schema:'POST_GEN1992_ENVIRONMENT_MATERIAL_REPAIR_VERIFICATION_RECEIPT_v1',
  operationId:CONTRACT.operationId,
  lockGeneration:CONTRACT.lockGeneration,
  governingHead:CONTRACT.governingHead,
  frozenFailedProductSha:CONTRACT.frozenFailedProductSha,
  candidateHead,
  evaluationToolingHead:CONTRACT.evaluationTooling.head,
  result:failed.length?'FAIL_CLOSED':'PASS_CLOSED',
  materialDispositionAuthority:false,
  materialDisposition:'UNASSIGNED_PENDING_FRESH_VISUAL_EVIDENCE_AND_READ_ONLY_ADJUDICATION',
  environmentFloorFreezeAuthority:false,
  mergeAuthority:false,
  deploymentAuthority:false,
  publicationAuthority:false,
  evidenceDigest:sha256(Buffer.from(JSON.stringify(evidence))),
  evidence,
  checkCount:checks.length,
  passCount:checks.length-failed.length,
  failCount:failed.length,
  checks
};
fs.mkdirSync(path.dirname(OUTPUT),{recursive:true});
fs.writeFileSync(OUTPUT,JSON.stringify(receipt,null,2)+'\n');
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
if(failed.length)process.exitCode=1;
