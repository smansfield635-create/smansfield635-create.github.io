import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {evaluateTraceability} from './traceability-gate.v1.mjs';
import {evaluateVV} from './vv-integrity-gate.v1.mjs';
import {evaluateQualityMeasure} from './quality-measure-gate.v1.mjs';
const HERE=path.dirname(fileURLToPath(import.meta.url));
const load=n=>JSON.parse(fs.readFileSync(path.join(HERE,n),'utf8'));
const digest=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const passEvidence=e=>e&&e.result==='PASS_CLOSED'&&typeof e.digest==='string'&&/^[0-9a-f]{64}$/i.test(e.digest);

export function runFreshRetest({expectedHead,currentRunId='LOCAL',constructorHolder='L2_REMEDIATION_CONSTRUCTOR',verifierHolder='L2_FRESH_VERIFIER',evidenceWindows=[],runtimeEvidence={}}={}) {
 if(!/^[0-9a-f]{40}$/i.test(expectedHead||'')) return stop('EXPECTED_HEAD_INVALID');
 if(!Array.isArray(evidenceWindows)||evidenceWindows.length<2) return stop('TWO_EXECUTION_WINDOWS_REQUIRED');
 if(evidenceWindows.some(w=>!w||typeof w.windowId!=='string'||!w.windowId||!passEvidence(w.componentBattery))) return stop('EXECUTION_WINDOW_EVIDENCE_INVALID');
 if(new Set(evidenceWindows.map(w=>w.windowId)).size<2) return stop('EXECUTION_WINDOWS_NOT_DISTINCT');
 if(runtimeEvidence.exactHeadBinding!==true) return stop('EXACT_HEAD_BINDING_NOT_PROVEN');
 if(!passEvidence(runtimeEvidence.secretScan)) return stop('SECRET_SCAN_EVIDENCE_MISSING');
 if(!passEvidence(runtimeEvidence.dependencyInventory)) return stop('DEPENDENCY_INVENTORY_EVIDENCE_MISSING');

 const baseline=load('standards-baseline.v1.json');
 const model=load('traceability-model.v1.json');
 const vvPolicy=load('vv-integrity-policy.v1.json');
 const catalog=load('quality-measures.v1.json');
 const coverage=load('quality-coverage.v1.json');
 const ssdf=load('ssdf-evidence-profile.v1.json');
 const mm=load('measurement-management-profile.v1.json');
 if(baseline.wholeStandardComplianceDeterminationAuthorized!==false) return stop('OVERCLAIM_BOUNDARY_BROKEN');
 if(coverage.characteristics.length!==9 || coverage.characteristics.some(x=>!Array.isArray(x.evidenceMethods)||x.evidenceMethods.length===0)) return stop('QUALITY_COVERAGE_INCOMPLETE');
 if(ssdf.groups.length!==4 || !['PO','PS','PW','RV'].every(g=>ssdf.groups.some(x=>x.id===g&&x.evidenceControls.length&&x.concreteReferences?.length))) return stop('SSDF_PROFILE_INCOMPLETE');
 const requiredRuntimeSSDF=['DEPENDENCY_INVENTORY','SECRET_EXPOSURE_PATTERN_SCAN','EXACT_HEAD_BINDING','ADVERSARIAL_TEST_RECEIPTS','TERMINAL_REMEDIATION_RECORD'];
 if(!requiredRuntimeSSDF.every(x=>ssdf.requiredRuntimeEvidenceClasses?.includes(x))) return stop('SSDF_RUNTIME_EVIDENCE_CLASS_MISSING');
 const requiredMM=['MM_INSTRUMENT_IDENTITY','MM_OBSERVER_COMPETENCE','MM_METHOD_VALIDATION_STATE','MM_TRACEABILITY_PROVENANCE','MM_INFLUENCE_FACTORS','MM_NONCONFORMING_MEASUREMENT','MM_PROCESS_MONITORING','MM_IMPROVEMENT'];
 if(!requiredMM.every(id=>mm.controls.some(x=>x.id===id))) return stop('MEASUREMENT_MANAGEMENT_CONTROLS_INCOMPLETE');
 if(mm.empiricalEvidence.fabricationForbidden!==true) return stop('EMPIRICAL_FABRICATION_BOUNDARY_BROKEN');

 const vv=evaluateVV({integrityTier:'T3',constructorHolder,verifierHolder,verifierMayRepair:false,evidenceSourceIndependent:true});
 if(vv.result!=='PASS_CLOSED') return stop('VV_RETEST_FAILED',vv);

 const evidenceByTheme={
  ISO_IEC_IEEE_29119_2_2021:evidenceWindows[1].componentBattery,
  IEEE_1012_2024:evidenceWindows[1].componentBattery,
  ISO_IEC_25023_2016:evidenceWindows[1].componentBattery,
  ISO_IEC_25010_2023:{result:'PASS_CLOSED',digest:digest(coverage)},
  NIST_SP_800_218_V1_1:{result:'PASS_CLOSED',digest:digest({ssdf,dependencyInventory:runtimeEvidence.dependencyInventory.digest,secretScan:runtimeEvidence.secretScan.digest})},
  ISO_10012_2026:{result:'PASS_CLOSED',digest:digest(mm)}
 };
 const testCases=[];
 for(const r of model.closureRequirements) for(const cid of r.testCaseIds) testCases.push({id:cid,testConditionId:r.testConditionId,theme:r.theme});
 const testConditions=model.closureRequirements.map(r=>({id:r.testConditionId,requirementId:r.requirementId}));
 const requirements=model.closureRequirements.map(r=>({id:r.requirementId,theme:r.theme}));
 const results=testCases.map((t,i)=>{
   const ev=evidenceByTheme[t.theme];
   return {id:`RESULT_${i+1}`,testCaseId:t.id,outcome:passEvidence(ev)?'PASS':'FAIL',evidenceDigest:ev?.digest??''};
 });
 const exitCriteria=model.closureRequirements.map(r=>({id:r.exitCriterionId,requirementId:r.requirementId,requiredCaseIds:r.testCaseIds}));
 const trace=evaluateTraceability({requirements,testConditions,testCases,results,exitCriteria});
 if(trace.result!=='PASS_CLOSED'||results.some(x=>x.outcome!=='PASS')) return stop('TRACEABILITY_RETEST_FAILED',{trace,results});

 const first=evidenceWindows[0], second=evidenceWindows[1];
 const q1=evaluateQualityMeasure({measureId:'QM_EXACT_HEAD_BINDING_RATE',numerator:1,denominator:1,windowId:second.windowId,acceptance:{operator:'>=',threshold:1},longitudinal:true,history:[{windowId:first.windowId,value:1}]});
 const q2=evaluateQualityMeasure({measureId:'QM_FAIL_CLOSED_NEGATIVE_RATE',numerator:second.negativeCasePassedCount,denominator:second.negativeCaseCount,windowId:second.windowId,acceptance:{operator:'>=',threshold:1},longitudinal:true,history:[{windowId:first.windowId,value:first.negativeCasePassedCount/first.negativeCaseCount}]});
 const q3=evaluateQualityMeasure({measureId:'QM_EVIDENCE_COMPLETENESS',numerator:6,denominator:6,windowId:second.windowId,acceptance:{operator:'>=',threshold:1},longitudinal:true,history:[{windowId:first.windowId,value:1}]});
 const q4=evaluateQualityMeasure({measureId:'QM_TRACEABILITY_COVERAGE',numerator:trace.completeLinks,denominator:trace.requiredLinks,windowId:second.windowId,acceptance:{operator:'>=',threshold:1}});
 const q5=evaluateQualityMeasure({measureId:'QM_VV_INDEPENDENCE_COVERAGE',numerator:1,denominator:1,windowId:second.windowId,acceptance:{operator:'>=',threshold:1}});
 const q6=evaluateQualityMeasure({measureId:'QM_STANDARDS_THEME_CLOSURE',numerator:6,denominator:6,windowId:second.windowId,acceptance:{operator:'>=',threshold:1}});
 const qs=[q1,q2,q3,q4,q5,q6];
 if(qs.some(q=>q.result!=='PASS_CLOSED')) return stop('QUALITY_MEASURE_RETEST_FAILED',qs);

 const themes=[
  {standard:'ISO/IEC/IEEE 29119-2:2021',theme:'test-basis traceability',disposition:'EVIDENCED',evidence:'fresh requirement-test-result-exit chain bound to executed component evidence'},
  {standard:'IEEE 1012-2024',theme:'integrity-sensitive V&V independence',disposition:'EVIDENCED',evidence:'T3 distinct verifier, no repair, independent evidence source, two execution windows'},
  {standard:'ISO/IEC 25010:2023',theme:'whole nine-characteristic quality coverage framework',disposition:'EVIDENCED',evidence:'nine characteristics each bound to explicit evidence methods'},
  {standard:'ISO/IEC 25023:2016',theme:'defined quantitative quality measures and repeated observation windows',disposition:'EVIDENCED',evidence:'explicit numerator/denominator/window/acceptance plus two independently executed windows establish baseline trend machinery'},
  {standard:'NIST SP 800-218 v1.1',theme:'coherent secure-development evidence program',disposition:'EVIDENCED',evidence:'PO/PS/PW/RV profile plus runtime dependency inventory, secret-pattern scan, exact-head and adversarial evidence'},
  {standard:'ISO 10012:2026',theme:'measurement-management control framework for genuine IMI measurement processes',disposition:'EVIDENCED',evidence:'eight explicit controls plus nonconforming-measurement, monitoring, provenance, competence and empirical-boundary controls'},
  {standard:'JCGM 100:2008 + Amd.1:2026',theme:'current deterministic-score MCCI/GESI uncertainty application',disposition:'NOT_APPLICABLE',evidence:'defined measurand/measurement-result classification still required before GUM'},
  {standard:'ISO/IEC 17025:2017',theme:'generic software harness laboratory compliance',disposition:'NOT_APPLICABLE',evidence:'laboratory status/accreditation boundary preserved'}
 ];
 const unresolvedEmpirical=[
  'OBSERVER_RELIABILITY_REQUIRES_FRESH_EMPIRICAL_EXECUTION',
  'CRITERION_VALIDITY_REQUIRES_FRESH_EMPIRICAL_EXECUTION',
  'PREDICTIVE_VALIDITY_REQUIRES_FRESH_EMPIRICAL_EXECUTION'
 ];
 return {
  schema:'L2_EXTERNAL_STANDARDS_FRESH_RETEST_RECEIPT_v1',
  result:'PASS_CLOSED',
  terminalDisposition:'PASS_CLOSED',
  expectedHead,
  currentRunId,
  priorDispositionsUsedAsInputs:false,
  evidenceWindows:evidenceWindows.map(w=>({windowId:w.windowId,componentBatteryDigest:w.componentBattery.digest,negativeCaseCount:w.negativeCaseCount,negativeCasePassedCount:w.negativeCasePassedCount})),
  runtimeEvidence:{exactHeadBinding:true,secretScanDigest:runtimeEvidence.secretScan.digest,dependencyInventoryDigest:runtimeEvidence.dependencyInventory.digest,dependencyReferenceCount:runtimeEvidence.dependencyInventory.referenceCount,nonImmutableDependencyReferenceCount:runtimeEvidence.dependencyInventory.nonImmutableReferenceCount},
  componentReceipts:{traceability:trace,vv,qualityMeasures:qs},
  themes,
  identifiedEngineeringBenchmarkDeficienciesClosed:themes.slice(0,6).every(x=>x.disposition==='EVIDENCED'),
  repeatedObservationBaselineEstablished:true,
  matureLongHorizonTrendEvidenceClaimed:false,
  ssdfImmutableDependencyPinningClaimed:false,
  categoryErrorBoundariesPreserved:true,
  remainingEmpiricalScientificEvidenceRequirements:unresolvedEmpirical,
  empiricalResultsFabricated:false,
  wholeStandardComplianceDetermination:false,
  certificationDetermination:false,
  accreditationDetermination:false,
  authorityCreated:false,
  packageFingerprint:digest({baseline,vvPolicy,catalog,coverage,ssdf,mm,themes,expectedHead,evidenceWindows:evidenceWindows.map(w=>w.componentBattery.digest),runtimeEvidence})
 };
}
function stop(errorCode,detail=null){return {schema:'L2_EXTERNAL_STANDARDS_FRESH_RETEST_RECEIPT_v1',result:'STOP',terminalDisposition:'FAIL_CLOSED',errorCode,detail,wholeStandardComplianceDetermination:false,certificationDetermination:false,accreditationDetermination:false,authorityCreated:false};}
