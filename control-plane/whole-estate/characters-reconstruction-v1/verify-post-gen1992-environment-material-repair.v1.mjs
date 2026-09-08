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
for(const required of ['product-root','v2-receipt','output'])if(!args[required])throw new Error(`ARGUMENT_REQUIRED:${required}`);
const ROOT=path.resolve(args['product-root']);
const V2_PATH=path.resolve(args['v2-receipt']);
const OUTPUT=path.resolve(args.output);
const deepEqual=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const read=rel=>fs.readFileSync(path.join(ROOT,rel));
const text=rel=>read(rel).toString('utf8');
const blobSha=b=>crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`),b])).digest('hex');
const git=(...argv)=>{
  const r=spawnSync('git',['-C',ROOT,...argv],{encoding:'utf8'});
  if(r.error||r.status!==0)throw new Error(`GIT_COMMAND_FAILED:${argv.join(':')}:${r.stderr||r.error?.message||''}`);
  return r.stdout.trim();
};
const importProduct=rel=>import(`${pathToFileURL(path.join(ROOT,rel)).href}?gen2001=1`);

const EXPECTED={
  schema:'POST_GEN2000_ECOLOGICAL_RELATION_REPAIR_CONTRACT_v1',
  operationId:'MIRRORLAND_POST_GEN2000_ECOLOGICAL_RELATION_REPAIR_20260908_001',
  lockGeneration:2001,
  governingHead:'8f97bb035dce439cf28ca156b2fcd5bdfc6a1953',
  productSubject:'6363182d880fc3e0d0fb0da7791aa9e641969e0a',
  admissionRun:34235055866,
  routerRun:34234358384,
  psalmAckComment:5586184683,
  diagnosticComment:5579294638,
  closureComment:5579313491,
  protectedAppBlob:'cb7e01ad703ae52b756a4603176bfe6d3b4f5e8a',
  frozenV5Blob:'f3b64eb1ffc1c1bc8e908ff96eb6c833b6bc928d',
  canopyCount:818,
  toolingHead:'834038c23711c3eed83dc21964027bd515852b51',
  toolingContractBlob:'84014a5a51a50d43e86c9e4f54bb0804d3655af1',
  toolingVerifierBlob:'6a7007cb37d04ea5af3542783342043c5c0a5829',
  toolingWorkflowBlob:'77b5b2e460adb86a123437c6eeb8d36ea8da5ba2',
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
check('PRODUCT_SUBJECT_BOUND',CONTRACT.productSubject===EXPECTED.productSubject,{observed:CONTRACT.productSubject});
check('PSALM_ACK_BOUND',CONTRACT.psalmAckCommentId===EXPECTED.psalmAckComment,{observed:CONTRACT.psalmAckCommentId});
check('GEN2000_DIAGNOSTIC_BOUND',CONTRACT.gen2000Diagnostic?.evidenceCommentId===EXPECTED.diagnosticComment&&CONTRACT.gen2000Diagnostic?.terminalClosureCommentId===EXPECTED.closureComment&&CONTRACT.gen2000Diagnostic?.lockReleased===true,{observed:CONTRACT.gen2000Diagnostic});
check('CANONICAL_ADMISSION_BOUND',CONTRACT.canonicalAdmission?.result==='ADMITTED_AND_LOCKED'&&CONTRACT.canonicalAdmission?.workflowRunId===EXPECTED.admissionRun,{observed:CONTRACT.canonicalAdmission});
check('ROUTER_BOUND',CONTRACT.routerReturn?.result==='PASS'&&CONTRACT.routerReturn?.workflowRunId===EXPECTED.routerRun&&CONTRACT.routerReturn?.pathCount===5,{observed:CONTRACT.routerReturn});
check('V2_TOOLING_BOUND',CONTRACT.evaluationTooling?.head===EXPECTED.toolingHead&&CONTRACT.evaluationTooling?.contractBlobSha===EXPECTED.toolingContractBlob&&CONTRACT.evaluationTooling?.verifierBlobSha===EXPECTED.toolingVerifierBlob&&CONTRACT.evaluationTooling?.workflowBlobSha===EXPECTED.toolingWorkflowBlob);
check('V2_DEFINITIONS_IMMUTABLE',CONTRACT.evaluationTooling?.definitionsConstantsThresholdsBinsWeightsSamplingCamerasStatesImmutable===true);
check('MATERIAL_AUTHORITY_FALSE',CONTRACT.acceptanceLaw?.materialDispositionAuthority===false&&CONTRACT.acceptanceLaw?.materialDisposition==='UNASSIGNED_PENDING_FRESH_VISUAL_EVIDENCE_AND_READ_ONLY_ADJUDICATION');
check('HARD_OPENING_LAW',CONTRACT.canopyRepairLaw?.hardOpeningCanopyAllowed===false);
check('LOW_WETNESS_LAW',CONTRACT.hydrologyRepairLaw?.lowWetnessEcologyMustRemainRepresented===true);

const candidateHead=git('rev-parse','HEAD^{commit}');
const mergeBase=git('merge-base',EXPECTED.productSubject,candidateHead);
check('EXACT_PRODUCT_SUBJECT_ANCESTRY',mergeBase===EXPECTED.productSubject,{mergeBase,candidateHead});
const changed=git('diff','--name-only',`${EXPECTED.productSubject}...${candidateHead}`).split('\n').filter(Boolean).sort();
check('EXACT_FIVE_PATH_SCOPE',deepEqual(changed,expectedChanged),{observed:changed,expected:expectedChanged});
check('CANDIDATE_WORKTREE_CLEAN',git('status','--porcelain')==='');
check('PROTECTED_APP_BYTE_IDENTITY',blobSha(read('characters/app.mjs'))===EXPECTED.protectedAppBlob,{observed:blobSha(read('characters/app.mjs'))});
check('FROZEN_V5_BYTE_IDENTITY',blobSha(read('characters/vegetation-representation.mjs'))===EXPECTED.frozenV5Blob,{observed:blobSha(read('characters/vegetation-representation.mjs'))});

const populationSource=text('characters/vegetation-population.mjs');
const understorySource=text('characters/vegetation-understory.mjs');
const forbidden=[
  'WIDE_COAST','OPEN_TERRAIN','WOODLAND_EDGE','FOREST_INTERIOR_INDEPENDENT','MIRROR_MANOR_APPROACH','SHORELINE_WETLAND_TRANSITION','WIDE_RETURN',
  'compactMobile','V2_RESULT_LOCATION','riskHighMinusLowBelow','lowMax:.24','midMax:.52','5579294638','GEN2000_POST_GEN1998_CANOPY_HYDROLOGY_RELATION_DIAGNOSTIC'
];
check('CANOPY_NO_WITNESS_V2_OR_DIAGNOSTIC_TARGETING',forbidden.every(x=>!populationSource.includes(x)),{forbidden});
check('UNDERSTORY_NO_WITNESS_V2_OR_DIAGNOSTIC_TARGETING',forbidden.every(x=>!understorySource.includes(x)),{forbidden});
check('CANOPY_NO_DESTINATION_CAMERA_OR_APP_CONTROL',!populationSource.includes('destination-registry')&&!populationSource.includes("from './app")&&!populationSource.includes('gen1983-camera-space'));
check('UNDERSTORY_NO_DESTINATION_CAMERA_OR_APP_CONTROL',!understorySource.includes('destination-registry')&&!understorySource.includes("from './app")&&!understorySource.includes('gen1983-camera-space'));
check('CANOPY_HARD_OPENING_REJECTION_PRESENT',populationSource.includes("environment.spatialZone==='OPENING'")&&populationSource.includes('environment.canopyDensity<=0'));
check('UNDERSTORY_USES_CANONICAL_WETNESS_AUTHORITY',understorySource.includes('sampleGratitudeWorld')&&understorySource.includes('shorelineContribution'));
check('LOW_WETNESS_PARTICIPATION_PRESERVED',understorySource.includes('wetParticipationFloor:.10'));
check('HIGH_WETNESS_SHORELINE_LT2_STRUCTURAL_EXCLUSION_REMOVED',!understorySource.includes('shore<2')&&!understorySource.includes('shorelineDistance<2'));

const populationModule=await importProduct('characters/vegetation-population.mjs');
const understoryModule=await importProduct('characters/vegetation-understory.mjs');
const population=populationModule.getCanonicalVegetationPopulation();
const understory=understoryModule.getCanonicalUnderstoryPopulation();
check('CANDIDATE_CANOPY_COUNT_818',population.instanceCount===EXPECTED.canopyCount,{observed:population.instanceCount});
check('CANOPY_FIXED_TARGET_CONTRACT',populationModule.CANONICAL_VEGETATION_POPULATION_CONTRACT?.fixedTargetCount===true&&populationModule.CANONICAL_VEGETATION_POPULATION_CONTRACT?.exactPopulationBudget===EXPECTED.canopyCount);
check('CANOPY_DEVICE_CAMERA_INVARIANT',populationModule.CANONICAL_VEGETATION_POPULATION_CONTRACT?.populationIdentityDeviceInvariant===true&&populationModule.CANONICAL_VEGETATION_POPULATION_CONTRACT?.populationIdentityCameraInvariant===true);
check('UNDERSTORY_PRESENT',Number.isInteger(understory.instanceCount)&&understory.instanceCount>0,{observed:understory.instanceCount});
check('UNDERSTORY_DEVICE_CAMERA_INVARIANT',understoryModule.V4_UNDERSTORY_CONTRACT?.populationIdentityDeviceInvariant===true&&understoryModule.V4_UNDERSTORY_CONTRACT?.populationIdentityCameraInvariant===true);

const v2=JSON.parse(fs.readFileSync(V2_PATH,'utf8'));
check('V2_RECEIPT_SCHEMA',v2.schema==='MIRRORLAND_GEN1983_CAMERA_SPACE_ENVIRONMENT_DIAGNOSTICS_V2_RECEIPT_v1',{observed:v2.schema});
check('V2_CALIBRATION_SEMANTICS_PRESERVED',v2.result==='FAIL_CLOSED'&&v2.instrumentValid===false,{result:v2.result,instrumentValid:v2.instrumentValid});
const failedIds=(v2.checks||[]).filter(x=>x.pass!==true).map(x=>x.id).sort();
check('V2_ONLY_EXPECTED_FIVE_CALIBRATION_CHECKS_FAIL',deepEqual(failedIds,EXPECTED.expectedV2FailedChecks),{observed:failedIds});
check('V2_FAIL_COUNT_EXACTLY_FIVE',v2.failCount===5,{observed:v2.failCount});
const familyRisk=v2.metrics?.familyRisk||{};
check('ALL_FOUR_V2_RISK_FAMILIES_CLEAR',
  familyRisk.FRUSTUM_SURFACE_CONTAINMENT_RISK_V2===false&&
  familyRisk.CANOPY_FIELD_CONTINUITY===false&&
  familyRisk.ELIGIBLE_GROUND_VISUAL_AREA_OCCUPANCY_V2===false&&
  familyRisk.HYDROLOGY_RESPONSE_STRENGTH===false,{familyRisk});
const stateMetrics=v2.metrics?.stateMetrics||[];
check('SEVEN_REPRESENTATIVE_STATES',stateMetrics.length===7,{observed:stateMetrics.length});
check('SURFACE_REMAINS_CLEAR',stateMetrics.every(s=>Object.values(s.frustumSurfaceContainmentV2||{}).every(x=>x.risk===false)));
check('GROUND_REMAINS_CLEAR',stateMetrics.every(s=>s.eligibleGroundVisualAreaOccupancyV2?.risk===false));
check('CANOPY_CLEAR_ALL_STATES',stateMetrics.every(s=>s.canopyFieldContinuity?.risk===false),{canopy:stateMetrics.map(s=>({state:s.state,...s.canopyFieldContinuity}))});
const hydro=v2.metrics?.hydrologyResponse||{};
check('HYDROLOGY_CLEAR',hydro.risk===false,{hydro});
check('HYDROLOGY_ORDERING_MEETS_FROZEN_DELTA',(hydro.highMinusLow??-Infinity)>=0.18,{observed:hydro.highMinusLow});
check('HYDROLOGY_HIGH_SAMPLE_COUNT',(hydro.bins?.high?.sampleCount??0)>=6,{observed:hydro.bins?.high?.sampleCount});
check('V2_CANOPY_COUNT_818',v2.metrics?.population?.instanceCount===EXPECTED.canopyCount,{observed:v2.metrics?.population?.instanceCount});
check('V2_V5_IDENTITY',v2.metrics?.population?.v5BlobObserved===EXPECTED.frozenV5Blob,{observed:v2.metrics?.population?.v5BlobObserved});
check('V2_NO_MATERIAL_OR_PRODUCT_AUTHORITY',v2.materialDispositionAuthority===false&&v2.environmentDispositionAuthority===false&&v2.productMutationAuthorized===false&&v2.productMutationDetected===false);

const failed=checks.filter(x=>!x.pass);
const receipt={
  schema:'POST_GEN2000_ECOLOGICAL_RELATION_REPAIR_VERIFICATION_RECEIPT_v1',
  operationId:CONTRACT.operationId,
  lockGeneration:CONTRACT.lockGeneration,
  governingHead:CONTRACT.governingHead,
  productSubject:CONTRACT.productSubject,
  candidateHead,
  evaluationToolingHead:CONTRACT.evaluationTooling.head,
  result:failed.length?'FAIL_CLOSED':'PASS_CLOSED',
  productMechanicalState:failed.length?'NON_CLEAR':'ALL_FOUR_V2_RISK_FAMILIES_CLEAR',
  materialDispositionAuthority:false,
  materialDisposition:'UNASSIGNED_PENDING_FRESH_VISUAL_EVIDENCE_AND_READ_ONLY_ADJUDICATION',
  environmentFloorFreezeAuthority:false,
  mergeAuthority:false,
  deploymentAuthority:false,
  publicationAuthority:false,
  evidence:{changedPaths:changed,population:{canopyCount:population.instanceCount,understoryCount:understory.instanceCount},v2:{metricDigest:v2.metricDigest,familyRisk,failedCheckIds:failedIds,hydrologyResponse:hydro}},
  checkCount:checks.length,
  passCount:checks.length-failed.length,
  failCount:failed.length,
  checks
};
fs.mkdirSync(path.dirname(OUTPUT),{recursive:true});
fs.writeFileSync(OUTPUT,JSON.stringify(receipt,null,2)+'\n');
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
if(failed.length)process.exitCode=1;
