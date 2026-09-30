#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync,execFileSync} from 'node:child_process';

const CONTRACT='control-plane/whole-estate/characters-reconstruction-v1/vegetation-v0-v3-contract.v1.json';
const RECONCILIATION='control-plane/whole-estate/characters-reconstruction-v1/vegetation-v0-v3-reconciliation.v1.json';
const V0_DISPOSITION='control-plane/whole-estate/characters-reconstruction-v1/vegetation-v0-known-verifier-false-negative.v1.json';
const V2_DISPOSITION='control-plane/whole-estate/characters-reconstruction-v1/vegetation-v2-known-instrumental-failure.v1.json';
const V0_VERIFIER='control-plane/whole-estate/characters-reconstruction-v1/verify-vegetation-v0-v3.v1.mjs';
const V1_VERIFIER='control-plane/whole-estate/characters-reconstruction-v1/verify-vegetation-v1.v1.mjs';
const V2_VERIFIER='control-plane/whole-estate/characters-reconstruction-v1/verify-vegetation-v2.v1.mjs';
const V3_VERIFIER='control-plane/whole-estate/characters-reconstruction-v1/verify-vegetation-v3.v1.mjs';
const FOREST='characters/forest-system.mjs';
const OUTPUT=process.argv.includes('--output')?process.argv[process.argv.indexOf('--output')+1]:null;

const contract=JSON.parse(fs.readFileSync(CONTRACT,'utf8'));
const binding=JSON.parse(fs.readFileSync(RECONCILIATION,'utf8'));
const v0Disposition=JSON.parse(fs.readFileSync(V0_DISPOSITION,'utf8'));
const v2Disposition=JSON.parse(fs.readFileSync(V2_DISPOSITION,'utf8'));
const forestSource=fs.readFileSync(FOREST,'utf8');
const v2VerifierSource=fs.readFileSync(V2_VERIFIER,'utf8');
const checks=[];
const failures=[];
const check=(id,pass,detail=null)=>{checks.push({id,pass:Boolean(pass),detail});if(!pass)failures.push(id);};
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const tempRoot=fs.mkdtempSync(path.join(os.tmpdir(),'vegetation-aggregate-'));

function runVerifier(label,verifier){
  const output=path.join(tempRoot,`${label}.json`);
  const run=spawnSync(process.execPath,[verifier,'--output',output],{encoding:'utf8'});
  let receipt=null;
  if(fs.existsSync(output)){
    try{receipt=JSON.parse(fs.readFileSync(output,'utf8'));}
    catch(error){check(`${label}_RECEIPT_PARSE`,false,String(error.message));}
  }
  check(`${label}_RECEIPT_WRITTEN`,Boolean(receipt),{status:run.status,signal:run.signal,stderr:run.stderr?.slice(0,500)||''});
  return {run,receipt};
}

try{
  check('CONTRACT_SCHEMA',contract.schema==='MIRRORLAND_VEGETATION_V0_V3_CONTRACT_v1');
  check('OPERATION_ID',contract.operationId==='MIRRORLAND_CANONICAL_ECOLOGY_CAMERA_TRUE_VEGETATION_20260905_003');
  check('LOCK_GENERATION',contract.lockGeneration===1956);
  check('TARGET_BOUNDARY',contract.targetBoundary==='V0_V3_PASS_CLOSED');
  check('BINDING_SCHEMA',binding.schema==='MIRRORLAND_VEGETATION_V0_V3_RECONCILIATION_BINDING_v1');
  check('BINDING_OPERATION',binding.operationId===contract.operationId);
  check('BINDING_LOCK',binding.lockGeneration===contract.lockGeneration);
  check('BINDING_GOVERNING_HEAD',binding.exactGoverningHead===contract.exactGoverningHead);
  check('BINDING_TARGET',binding.targetBoundary===contract.targetBoundary);
  check('HISTORICAL_RECEIPTS_IMMUTABLE',binding.reconciliationLaw?.historicalReceiptsRemainImmutable===true);
  check('EXACT_FAILURE_PLUS_UNDERLYING_PROOF_REQUIRED',binding.reconciliationLaw?.instrumentalFailuresMayBeReconciledOnlyByExactFailureMatchAndIndependentUnderlyingProof===true);
  check('ACCEPTANCE_CRITERIA_NOT_RELAXED',binding.reconciliationLaw?.acceptanceCriteriaMayNotBeRelaxed===true&&contract.failureSemantics?.acceptanceCriteriaMayNotBeRelaxed===true);
  check('V4_GATE_PRESERVED',binding.reconciliationLaw?.v4PlusAuthorizedOnlyAfterAggregatePass===true&&contract.failureSemantics?.v4PlusBlockedUntilAggregatePass===true);
  check('NO_MERGE_DEPLOY_PUBLICATION_AUTHORITY',binding.reconciliationLaw?.mergeDeploymentPublicationAuthorityCreated===false);

  check('V0_DISPOSITION_SCHEMA',v0Disposition.schema==='MIRRORLAND_V0_VERIFIER_FALSE_NEGATIVE_DISPOSITION_v1');
  check('V0_HISTORICAL_RESULT_PRESERVED',v0Disposition.formalReceiptResult==='FAIL_CLOSED'&&binding.historicalEvidence?.V0?.formalResult==='FAIL_CLOSED');
  check('V0_CLASSIFICATION',v0Disposition.classification==='KNOWN_VERIFIER_FALSE_NEGATIVE'&&binding.historicalEvidence?.V0?.classification==='KNOWN_VERIFIER_FALSE_NEGATIVE');
  check('V0_RECONCILIATION_REQUIRED',v0Disposition.ownerDisposition?.aggregateClosureRequiresV0FormalReconciliation===true);
  check('V0_PASS_WAS_NOT_RELABELED',v0Disposition.ownerDisposition?.v0PassClaimAuthorized===false);
  check('V0_ACCEPTANCE_NOT_RELAXED',v0Disposition.ownerDisposition?.acceptanceCriteriaRelaxed===false);

  check('V2_DISPOSITION_SCHEMA',v2Disposition.schema==='MIRRORLAND_V2_INSTRUMENTAL_VERIFIER_FAILURE_DISPOSITION_v1');
  check('V2_HISTORICAL_RESULT_PRESERVED',v2Disposition.formalReceiptResult==='FAIL_CLOSED'&&binding.historicalEvidence?.V2?.formalResult==='FAIL_CLOSED');
  check('V2_CLASSIFICATION',v2Disposition.classification==='KNOWN_INSTRUMENTAL_VERIFIER_FAILURE'&&binding.historicalEvidence?.V2?.classification==='KNOWN_INSTRUMENTAL_VERIFIER_FAILURE');
  check('V2_RECONCILIATION_REQUIRED',v2Disposition.ownerDisposition?.aggregateClosureRequiresV2FormalReconciliation===true);
  check('V2_PASS_WAS_NOT_RELABELED',v2Disposition.ownerDisposition?.v2PassClaimAuthorized===false);
  check('V2_ACCEPTANCE_NOT_RELAXED',v2Disposition.ownerDisposition?.acceptanceCriteriaRelaxed===false&&v2Disposition.basis?.acceptanceCriteriaRelaxed===false);

  const v0a=runVerifier('V0_RUN_A',V0_VERIFIER);
  const v0b=runVerifier('V0_RUN_B',V0_VERIFIER);
  const expectedV0Failures=['BASELINE_DEVICE_DEPENDENT_GENERATION'];
  for(const [label,result] of [['V0_A',v0a],['V0_B',v0b]]){
    const receipt=result.receipt;
    check(`${label}_EXPECTED_NONZERO_STATUS`,result.run.status!==0,{status:result.run.status});
    check(`${label}_FORMAL_FAIL_PRESERVED`,receipt?.result==='FAIL_CLOSED');
    check(`${label}_EXACT_SINGLE_FAILURE`,JSON.stringify(receipt?.failures)===JSON.stringify(expectedV0Failures),receipt?.failures);
    check(`${label}_CHECK_COUNTS`,receipt?.checkCount===47&&receipt?.passCount===46&&receipt?.failCount===1,{checkCount:receipt?.checkCount,passCount:receipt?.passCount,failCount:receipt?.failCount});
  }
  check('V0_REPRODUCIBILITY_DIGEST_MATCH',Boolean(v0a.receipt?.baselineDigest)&&v0a.receipt?.baselineDigest===v0b.receipt?.baselineDigest,{a:v0a.receipt?.baselineDigest,b:v0b.receipt?.baselineDigest});
  check('V0_REPRODUCIBILITY_KEY_MATCH',Boolean(v0a.receipt?.reproducibilityKey)&&v0a.receipt?.reproducibilityKey===v0b.receipt?.reproducibilityKey);
  check('V0_HISTORICAL_COUNTS_MATCH_DISPOSITION',v0a.receipt?.checkCount===v0Disposition.observed?.checkCount&&v0a.receipt?.passCount===v0Disposition.observed?.passCount&&v0a.receipt?.failCount===v0Disposition.observed?.failCount);
  check('V0_HISTORICAL_FAILURE_MATCH_DISPOSITION',JSON.stringify(v0a.receipt?.failures)===JSON.stringify(v0Disposition.observed?.failures));
  check('V0_DESKTOP_TARGET_SEMANTIC_PROOF',/desktop:Object\.freeze\(\{target:420\b/.test(forestSource));
  check('V0_MOBILE_TARGET_SEMANTIC_PROOF',/mobile:Object\.freeze\(\{target:190\b/.test(forestSource));
  const directTernary=/target\s*=\s*compact\s*\?\s*FOREST_BUDGETS\.mobile\.target\s*:\s*FOREST_BUDGETS\.desktop\.target/.test(forestSource);
  const bracketTernary=/target\s*=\s*FOREST_BUDGETS\[compact\s*\?\s*['\"]mobile['\"]\s*:\s*['\"]desktop['\"]\]\.target/.test(forestSource);
  check('V0_DEVICE_DEPENDENT_GENERATION_SEMANTIC_PROOF',directTernary||bracketTernary,{directTernary,bracketTernary});
  const v0Reconciled=Boolean(v0a.receipt&&v0b.receipt)&&
    JSON.stringify(v0a.receipt.failures)===JSON.stringify(expectedV0Failures)&&
    JSON.stringify(v0b.receipt.failures)===JSON.stringify(expectedV0Failures)&&
    v0a.receipt.baselineDigest===v0b.receipt.baselineDigest&&
    (directTernary||bracketTernary)&&
    v0Disposition.ownerDisposition?.aggregateClosureRequiresV0FormalReconciliation===true;
  check('V0_RECONCILED_TO_REQUIRED_RESULT',v0Reconciled,{requiredResult:contract.v0.resultRequired});

  const v1=runVerifier('V1',V1_VERIFIER);
  check('V1_ZERO_STATUS',v1.run.status===0,{status:v1.run.status});
  check('V1_REQUIRED_RESULT',v1.receipt?.result===contract.v1.resultRequired,{actual:v1.receipt?.result,required:contract.v1.resultRequired});
  check('V1_NO_FAILURES',v1.receipt?.failCount===0&&Array.isArray(v1.receipt?.failures)&&v1.receipt.failures.length===0);

  const v2=runVerifier('V2',V2_VERIFIER);
  const expectedV2Failures=['V0_FALSE_NEGATIVE_OWNER_DISPOSITION','V0_AGGREGATE_RECONCILIATION_REQUIRED'];
  check('V2_EXPECTED_NONZERO_STATUS',v2.run.status!==0,{status:v2.run.status});
  check('V2_FORMAL_FAIL_PRESERVED',v2.receipt?.result==='FAIL_CLOSED');
  check('V2_EXACT_INSTRUMENTAL_FAILURES',JSON.stringify(v2.receipt?.failures)===JSON.stringify(expectedV2Failures),v2.receipt?.failures);
  check('V2_CHECK_COUNTS_MATCH_DISPOSITION',v2.receipt?.checkCount===v2Disposition.observed?.checkCount&&v2.receipt?.passCount===v2Disposition.observed?.passCount&&v2.receipt?.failCount===v2Disposition.observed?.failCount,{receipt:{checkCount:v2.receipt?.checkCount,passCount:v2.receipt?.passCount,failCount:v2.receipt?.failCount},disposition:v2Disposition.observed});
  check('V2_POPULATION_COUNT_MATCH',v2.receipt?.populationCount===818&&v2.receipt?.populationCount===v2Disposition.observed?.populationCount,{actual:v2.receipt?.populationCount});
  check('V2_POPULATION_DIGEST_MATCH',v2.receipt?.populationIdentityDigest===v2Disposition.observed?.populationIdentityDigest,{actual:v2.receipt?.populationIdentityDigest,expected:v2Disposition.observed?.populationIdentityDigest});
  check('V2_CONTEXT_MATRIX_MATCH',v2.receipt?.invariantContextCount===60&&v2.receipt?.invariantContextCount===v2Disposition.observed?.invariantContextCount,{actual:v2.receipt?.invariantContextCount});
  check('V2_STALE_FIELD_PATH_ONE_PRESENT',v2VerifierSource.includes("v0Disposition.forwardConstructionDisposition==='PROCEED_TO_V1_WITH_KNOWN_VERIFIER_FALSE_NEGATIVE'"));
  check('V2_STALE_FIELD_PATH_TWO_PRESENT',v2VerifierSource.includes('v0Disposition.aggregateClosureRequiresFormalReconciliation===true'));
  check('V2_CANONICAL_FORWARD_FIELD_PROOF',v0Disposition.ownerDisposition?.forwardConstructionAuthorized==='V1_CANONICAL_ECOLOGY_EXPOSURE');
  check('V2_CANONICAL_RECONCILIATION_FIELD_PROOF',v0Disposition.ownerDisposition?.aggregateClosureRequiresV0FormalReconciliation===true);
  const v2Reconciled=Boolean(v2.receipt)&&
    JSON.stringify(v2.receipt.failures)===JSON.stringify(expectedV2Failures)&&
    v2.receipt.populationCount===818&&
    v2.receipt.invariantContextCount===60&&
    v2.receipt.populationIdentityDigest===v2Disposition.observed?.populationIdentityDigest&&
    v0Disposition.ownerDisposition?.forwardConstructionAuthorized==='V1_CANONICAL_ECOLOGY_EXPOSURE'&&
    v0Disposition.ownerDisposition?.aggregateClosureRequiresV0FormalReconciliation===true;
  check('V2_RECONCILED_TO_REQUIRED_RESULT',v2Reconciled,{requiredResult:contract.v2.resultRequired});

  const v3=runVerifier('V3',V3_VERIFIER);
  check('V3_ZERO_STATUS',v3.run.status===0,{status:v3.run.status});
  check('V3_REQUIRED_RESULT',v3.receipt?.result===contract.v3.resultRequired,{actual:v3.receipt?.result,required:contract.v3.resultRequired});
  check('V3_NO_FAILURES',v3.receipt?.failCount===0&&Array.isArray(v3.receipt?.failures)&&v3.receipt.failures.length===0);
  check('V3_CANONICAL_POPULATION_COUNT',v3.receipt?.canonicalPopulationCount===818,{actual:v3.receipt?.canonicalPopulationCount});
  check('V3_POPULATION_DIGEST_CONTINUITY',v3.receipt?.canonicalPopulationIdentityDigest===v2Disposition.observed?.populationIdentityDigest);
  check('V3_CAMERA_MATRIX',v3.receipt?.cameraMatrixCount===10,{actual:v3.receipt?.cameraMatrixCount});
  check('V3_CAMERA_TRUE_LOD_EXERCISED',(v3.receipt?.cameraDrivenLodChangeCount??0)>0,{actual:v3.receipt?.cameraDrivenLodChangeCount});

  const stageEntitlements={
    V0:v0Reconciled?contract.v0.resultRequired:'FAIL_CLOSED',
    V1:v1.receipt?.result===contract.v1.resultRequired?contract.v1.resultRequired:'FAIL_CLOSED',
    V2:v2Reconciled?contract.v2.resultRequired:'FAIL_CLOSED',
    V3:v3.receipt?.result===contract.v3.resultRequired?contract.v3.resultRequired:'FAIL_CLOSED'
  };
  const allStagesPass=stageEntitlements.V0===contract.v0.resultRequired&&stageEntitlements.V1===contract.v1.resultRequired&&stageEntitlements.V2===contract.v2.resultRequired&&stageEntitlements.V3===contract.v3.resultRequired;
  check('ALL_STAGE_ENTITLEMENTS_REESTABLISHED',allStagesPass,stageEntitlements);

  const pass=failures.length===0&&allStagesPass;
  const receipt={
    schema:'MIRRORLAND_VEGETATION_V0_V3_RECONCILIATION_RECEIPT_v1',
    operationId:contract.operationId,
    exactGoverningHead:contract.exactGoverningHead,
    candidateHead:git('rev-parse','HEAD'),
    currentStage:'V0_V3_AGGREGATE_RECONCILIATION',
    result:pass?contract.targetBoundary:'FAIL_CLOSED',
    historicalFormalReceipts:{
      V0:'FAIL_CLOSED',
      V1:binding.historicalEvidence.V1.formalResult,
      V2:'FAIL_CLOSED',
      V3:binding.historicalEvidence.V3.formalResult
    },
    reconciledStageResults:stageEntitlements,
    instrumentalDispositions:{
      V0:v0Disposition.classification,
      V2:v2Disposition.classification
    },
    historicalReceiptsPreserved:true,
    acceptanceCriteriaRelaxed:false,
    canonicalPopulationCount:v3.receipt?.canonicalPopulationCount??null,
    canonicalPopulationIdentityDigest:v3.receipt?.canonicalPopulationIdentityDigest??null,
    cameraMatrixCount:v3.receipt?.cameraMatrixCount??null,
    checkCount:checks.length,
    passCount:checks.filter(item=>item.pass).length,
    failCount:failures.length,
    failures,
    checks,
    aggregateBoundaryClosed:pass,
    v4PlusAuthorized:pass,
    mergeDeploymentPublicationAuthorized:false
  };
  const text=JSON.stringify(receipt,null,2)+'\n';
  if(OUTPUT)fs.writeFileSync(OUTPUT,text);else process.stdout.write(text);
  if(!pass)process.exitCode=1;
}finally{
  fs.rmSync(tempRoot,{recursive:true,force:true});
}
