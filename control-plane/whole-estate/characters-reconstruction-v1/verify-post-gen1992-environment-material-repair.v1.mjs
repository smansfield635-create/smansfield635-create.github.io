#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const CONTRACT=JSON.parse(fs.readFileSync(path.join(HERE,'post-gen1992-environment-material-repair-contract.v1.json'),'utf8'));
const args={};
for(let i=2;i<process.argv.length;i++){const t=process.argv[i];if(!t.startsWith('--'))throw new Error(`UNKNOWN_ARGUMENT:${t}`);args[t.slice(2)]=process.argv[++i]??null;}
for(const k of ['product-root','v2-receipt','output'])if(!args[k])throw new Error(`ARGUMENT_REQUIRED:${k}`);
const ROOT=path.resolve(args['product-root']);
const V2_PATH=path.resolve(args['v2-receipt']);
const OUTPUT=path.resolve(args.output);
const read=rel=>fs.readFileSync(path.join(ROOT,rel));
const text=rel=>read(rel).toString('utf8');
const blobSha=b=>crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`),b])).digest('hex');
const deepEqual=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const git=(...argv)=>{const r=spawnSync('git',['-C',ROOT,...argv],{encoding:'utf8'});if(r.error||r.status!==0)throw new Error(`GIT_COMMAND_FAILED:${argv.join(':')}:${r.stderr||r.error?.message||''}`);return r.stdout.trim();};
const importProduct=rel=>import(`${pathToFileURL(path.join(ROOT,rel)).href}?gen2003=1`);

const EXPECTED={
 schema:'POST_GEN2002_CANOPY_BRIDGE_CHAIN_REPAIR_CONTRACT_v1',
 operationId:'MIRRORLAND_POST_GEN2002_CANOPY_BRIDGE_CHAIN_REPAIR_20260908_001',
 generation:2003,
 governingHead:'8f97bb035dce439cf28ca156b2fcd5bdfc6a1953',
 foundation:'fc466a0d08adbaeb9672d4618f670105cf1af87c',
 failedGen2002:'3a5dd83b936c7041257e73a3ebe30c306a7516f5',
 admissionRun:34240513254,
 routerRun:34239938930,
 psalm:5586934312,
 evidence:5586872302,
 closure:5586908215,
 appBlob:'cb7e01ad703ae52b756a4603176bfe6d3b4f5e8a',
 understoryBlob:'e410e6f771cdfad7b921ba28c3a5e97df14dd37b',
 v5Blob:'f3b64eb1ffc1c1bc8e908ff96eb6c833b6bc928d',
 canopyCount:818,
 toolingHead:'834038c23711c3eed83dc21964027bd515852b51',
 expectedV2Failed:['ALL_FOUR_KNOWN_FAILURE_FAMILIES_DETECTED','CALIBRATION_CANOPY_CONTINUITY_RISK_DETECTED','CALIBRATION_GROUND_VISUAL_AREA_RISK_DETECTED','CALIBRATION_HYDROLOGY_RESPONSE_RISK_DETECTED','CALIBRATION_SURFACE_CONTAINMENT_RISK_DETECTED'].sort()
};
const expectedChanged=['.github/workflows/characters-post-gen1992-environment-material-repair-v1.yml','characters/vegetation-population.mjs','control-plane/whole-estate/characters-reconstruction-v1/post-gen1992-environment-material-repair-contract.v1.json','control-plane/whole-estate/characters-reconstruction-v1/verify-post-gen1992-environment-material-repair.v1.mjs'].sort();
const checks=[];const check=(id,pass,detail={})=>checks.push({id,pass:Boolean(pass),detail});

check('CONTRACT_SCHEMA',CONTRACT.schema===EXPECTED.schema,{observed:CONTRACT.schema});
check('OPERATION_ID',CONTRACT.operationId===EXPECTED.operationId,{observed:CONTRACT.operationId});
check('LOCK_GENERATION',CONTRACT.lockGeneration===EXPECTED.generation,{observed:CONTRACT.lockGeneration});
check('GOVERNING_HEAD',CONTRACT.governingHead===EXPECTED.governingHead,{observed:CONTRACT.governingHead});
check('FOUNDATION_BOUND',CONTRACT.partialSuccessFoundation===EXPECTED.foundation,{observed:CONTRACT.partialSuccessFoundation});
check('FAILED_GEN2002_BOUND',CONTRACT.failedGen2002Candidate===EXPECTED.failedGen2002&&CONTRACT.gen2002NegativeEvidence?.candidateHead===EXPECTED.failedGen2002&&CONTRACT.gen2002NegativeEvidence?.evidenceCommentId===EXPECTED.evidence&&CONTRACT.gen2002NegativeEvidence?.terminalClosureCommentId===EXPECTED.closure&&CONTRACT.gen2002NegativeEvidence?.lockReleased===true&&CONTRACT.gen2002NegativeEvidence?.terminalHistoryPreserved===true);
check('PSALM_BOUND',CONTRACT.psalmAckCommentId===EXPECTED.psalm);
check('ADMISSION_BOUND',CONTRACT.canonicalAdmission?.result==='ADMITTED_AND_LOCKED'&&CONTRACT.canonicalAdmission?.workflowRunId===EXPECTED.admissionRun);
check('ROUTER_BOUND',CONTRACT.routerReturn?.result==='PASS'&&CONTRACT.routerReturn?.workflowRunId===EXPECTED.routerRun&&CONTRACT.routerReturn?.pathCount===4);
check('V2_TOOLING_BOUND',CONTRACT.evaluationTooling?.head===EXPECTED.toolingHead&&CONTRACT.evaluationTooling?.definitionsConstantsThresholdsBinsWeightsSamplingCamerasStatesImmutable===true);
check('UNDERSTORY_PROTECTED_BY_CONTRACT',CONTRACT.preservationLaw?.understoryMutationAllowed===false&&CONTRACT.preservationLaw?.understoryBlobMustEqual===EXPECTED.understoryBlob);
check('HYDROLOGY_PROTECTED_BY_CONTRACT',CONTRACT.preservationLaw?.hydrologyResponseRiskMustRemainFalse===true&&CONTRACT.preservationLaw?.hydrologyHighMinusLowAtLeast===0.18);
check('HARD_OPENING_LAW',CONTRACT.canopyRepairLaw?.hardOpeningCanopyAllowed===false);
check('FAILED_GEN2002_STRATEGY_PROHIBITED',CONTRACT.canopyRepairLaw?.failedGen2002CoverageGapScorerMayBeRepeated===false);
check('MATERIAL_AUTHORITY_FALSE',CONTRACT.acceptanceLaw?.materialDispositionAuthority===false);

const candidateHead=git('rev-parse','HEAD^{commit}');
const mergeBase=git('merge-base',EXPECTED.foundation,candidateHead);
check('EXACT_GEN2001_FOUNDATION_ANCESTRY',mergeBase===EXPECTED.foundation,{mergeBase,candidateHead});
const changed=git('diff','--name-only',`${EXPECTED.foundation}...${candidateHead}`).split('\n').filter(Boolean).sort();
check('EXACT_FOUR_PATH_SCOPE',deepEqual(changed,expectedChanged),{observed:changed,expected:expectedChanged});
check('CANDIDATE_WORKTREE_CLEAN',git('status','--porcelain')==='');
check('PROTECTED_APP_BYTE_IDENTITY',blobSha(read('characters/app.mjs'))===EXPECTED.appBlob,{observed:blobSha(read('characters/app.mjs'))});
check('FROZEN_GEN2001_UNDERSTORY_BYTE_IDENTITY',blobSha(read('characters/vegetation-understory.mjs'))===EXPECTED.understoryBlob,{observed:blobSha(read('characters/vegetation-understory.mjs'))});
check('FROZEN_V5_BYTE_IDENTITY',blobSha(read('characters/vegetation-representation.mjs'))===EXPECTED.v5Blob,{observed:blobSha(read('characters/vegetation-representation.mjs'))});

const populationSource=text('characters/vegetation-population.mjs');
const forbidden=['WIDE_COAST','OPEN_TERRAIN','WOODLAND_EDGE','FOREST_INTERIOR_INDEPENDENT','MIRROR_MANOR_APPROACH','SHORELINE_WETLAND_TRANSITION','WIDE_RETURN','compactMobile','V2_RESULT_LOCATION','riskMaxEmptyCorridorCellsAbove','riskLargestComponentRatioBelow','riskOccupiedCellRatioBelow','5579294638','GEN2000_POST_GEN1998_CANOPY_HYDROLOGY_RELATION_DIAGNOSTIC','5586872302','3a5dd83b936c7041257e73a3ebe30c306a7516f5'];
check('CANOPY_NO_WITNESS_DIAGNOSTIC_OR_FAILED_RESULT_TARGETING',forbidden.every(x=>!populationSource.includes(x)),{forbidden});
check('CANOPY_NO_DESTINATION_CAMERA_OR_APP_CONTROL',!populationSource.includes('destination-registry')&&!populationSource.includes("from './app")&&!populationSource.includes('gen1983-camera-space'));
check('CANOPY_HARD_OPENING_REJECTION_PRESENT',populationSource.includes("environment.spatialZone==='OPENING'")&&populationSource.includes('environment.canopyDensity<=0'));
check('GENERIC_STAND_BACKBONE_PRESENT',populationSource.includes('buildStandAnchors')&&populationSource.includes('buildStandBackbone'));
check('GENERIC_SHORTEST_ELIGIBLE_PATH_PRESENT',populationSource.includes('shortestEligiblePath')&&populationSource.includes('candidateNeighbors'));
check('GENERIC_BRIDGE_CHAIN_REFINEMENT_PRESENT',populationSource.includes('refineBridgeChains')&&populationSource.includes('bridgeChainIds'));
check('FAILED_GEN2002_GAP_SCORER_ABSENT',!populationSource.includes('coverageGapScore')&&!populationSource.includes('refineCoverageTopology'));

const populationModule=await importProduct('characters/vegetation-population.mjs');
const understoryModule=await importProduct('characters/vegetation-understory.mjs');
const population=populationModule.getCanonicalVegetationPopulation();
const understory=understoryModule.getCanonicalUnderstoryPopulation();
check('CANDIDATE_CANOPY_COUNT_818',population.instanceCount===EXPECTED.canopyCount,{observed:population.instanceCount});
check('CANOPY_FIXED_TARGET_CONTRACT',populationModule.CANONICAL_VEGETATION_POPULATION_CONTRACT?.fixedTargetCount===true&&populationModule.CANONICAL_VEGETATION_POPULATION_CONTRACT?.exactPopulationBudget===EXPECTED.canopyCount);
check('CANOPY_DEVICE_CAMERA_INVARIANT',populationModule.CANONICAL_VEGETATION_POPULATION_CONTRACT?.populationIdentityDeviceInvariant===true&&populationModule.CANONICAL_VEGETATION_POPULATION_CONTRACT?.populationIdentityCameraInvariant===true);
check('BRIDGE_CHAIN_CONTRACT_ACTIVE',populationModule.CANONICAL_VEGETATION_POPULATION_CONTRACT?.deterministicStandBackbone===true&&populationModule.CANONICAL_VEGETATION_POPULATION_CONTRACT?.deterministicEligiblePathBridgeChains===true);
check('BRIDGE_CHAIN_DIAGNOSTICS_PRESENT',(population.diagnostics?.bridgeChainBackboneEdgeCount??0)>0&&(population.diagnostics?.bridgeChainPathCount??0)>0&&(population.diagnostics?.bridgeChainAddedCount??0)>0,{diagnostics:{edgeCount:population.diagnostics?.bridgeChainBackboneEdgeCount,pathCount:population.diagnostics?.bridgeChainPathCount,addedCount:population.diagnostics?.bridgeChainAddedCount}});
check('UNDERSTORY_PRESENT',understory.instanceCount>0,{observed:understory.instanceCount});

const v2=JSON.parse(fs.readFileSync(V2_PATH,'utf8'));
check('V2_RECEIPT_SCHEMA',v2.schema==='MIRRORLAND_GEN1983_CAMERA_SPACE_ENVIRONMENT_DIAGNOSTICS_V2_RECEIPT_v1',{observed:v2.schema});
check('V2_CALIBRATION_SEMANTICS_PRESERVED',v2.result==='FAIL_CLOSED'&&v2.instrumentValid===false,{result:v2.result,instrumentValid:v2.instrumentValid});
const failedIds=(v2.checks||[]).filter(x=>x.pass!==true).map(x=>x.id).sort();
check('V2_ONLY_EXPECTED_FIVE_CALIBRATION_CHECKS_FAIL',deepEqual(failedIds,EXPECTED.expectedV2Failed),{observed:failedIds});
check('V2_FAIL_COUNT_EXACTLY_FIVE',v2.failCount===5,{observed:v2.failCount});
const familyRisk=v2.metrics?.familyRisk||{};
check('ALL_FOUR_V2_RISK_FAMILIES_CLEAR',familyRisk.FRUSTUM_SURFACE_CONTAINMENT_RISK_V2===false&&familyRisk.CANOPY_FIELD_CONTINUITY===false&&familyRisk.ELIGIBLE_GROUND_VISUAL_AREA_OCCUPANCY_V2===false&&familyRisk.HYDROLOGY_RESPONSE_STRENGTH===false,{familyRisk});
const states=v2.metrics?.stateMetrics||[];
check('SEVEN_REPRESENTATIVE_STATES',states.length===7,{observed:states.length});
check('SURFACE_REMAINS_CLEAR',states.every(s=>Object.values(s.frustumSurfaceContainmentV2||{}).every(x=>x.risk===false)));
check('GROUND_REMAINS_CLEAR',states.every(s=>s.eligibleGroundVisualAreaOccupancyV2?.risk===false));
check('CANOPY_CLEAR_ALL_STATES',states.every(s=>s.canopyFieldContinuity?.risk===false),{canopy:states.map(s=>({state:s.state,...s.canopyFieldContinuity}))});
const hydro=v2.metrics?.hydrologyResponse||{};
check('HYDROLOGY_REMAINS_CLEAR',hydro.risk===false,{hydro});
check('HYDROLOGY_ORDERING_PRESERVED',(hydro.highMinusLow??-Infinity)>=0.18,{observed:hydro.highMinusLow});
check('V2_CANOPY_COUNT_818',v2.metrics?.population?.instanceCount===818,{observed:v2.metrics?.population?.instanceCount});
check('V2_V5_IDENTITY',v2.metrics?.population?.v5BlobObserved===EXPECTED.v5Blob,{observed:v2.metrics?.population?.v5BlobObserved});
check('V2_NO_MATERIAL_OR_PRODUCT_AUTHORITY',v2.materialDispositionAuthority===false&&v2.environmentDispositionAuthority===false&&v2.productMutationAuthorized===false&&v2.productMutationDetected===false);

const failed=checks.filter(x=>!x.pass);
const receipt={schema:'POST_GEN2002_CANOPY_BRIDGE_CHAIN_REPAIR_VERIFICATION_RECEIPT_v1',operationId:CONTRACT.operationId,lockGeneration:CONTRACT.lockGeneration,governingHead:CONTRACT.governingHead,partialSuccessFoundation:CONTRACT.partialSuccessFoundation,failedGen2002Candidate:CONTRACT.failedGen2002Candidate,candidateHead,evaluationToolingHead:CONTRACT.evaluationTooling.head,result:failed.length?'FAIL_CLOSED':'PASS_CLOSED',productMechanicalState:failed.length?'NON_CLEAR':'ALL_FOUR_V2_RISK_FAMILIES_CLEAR',materialDispositionAuthority:false,materialDisposition:'UNASSIGNED_PENDING_FRESH_VISUAL_EVIDENCE_AND_READ_ONLY_ADJUDICATION',environmentFloorFreezeAuthority:false,mergeAuthority:false,deploymentAuthority:false,publicationAuthority:false,evidence:{changedPaths:changed,population:{canopyCount:population.instanceCount,understoryCount:understory.instanceCount,understoryBlob:blobSha(read('characters/vegetation-understory.mjs')),bridgeChainBackboneEdgeCount:population.diagnostics?.bridgeChainBackboneEdgeCount,bridgeChainPathCount:population.diagnostics?.bridgeChainPathCount,bridgeChainAddedCount:population.diagnostics?.bridgeChainAddedCount},v2:{metricDigest:v2.metricDigest,familyRisk,failedCheckIds:failedIds,hydrologyResponse:hydro,canopy:states.map(s=>({state:s.state,...s.canopyFieldContinuity}))}},checkCount:checks.length,passCount:checks.length-failed.length,failCount:failed.length,checks};
fs.mkdirSync(path.dirname(OUTPUT),{recursive:true});
fs.writeFileSync(OUTPUT,JSON.stringify(receipt,null,2)+'\n');
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
if(failed.length)process.exitCode=1;
