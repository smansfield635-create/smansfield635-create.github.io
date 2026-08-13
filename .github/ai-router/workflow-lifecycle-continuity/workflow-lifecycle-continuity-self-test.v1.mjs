#!/usr/bin/env node
import {verifyAssessment,normalizeSignal,REQUIRED,GAP_ID,INSTRUMENT_STATUS} from './workflow-lifecycle-continuity-verifier.v1.mjs';
const head='27d763cce6029ebb19f6325346d120b95003019d';
const evidence=Object.fromEntries(REQUIRED.map(id=>[id,{status:'PASS',evidence:[`BOUND_${id}`]}]));
const authorityEffects={physicalRetirementAuthorized:false,gapRegistryMutationAuthorized:false,mergeAuthorized:false,productMutationAuthorized:false,workflowMutationAuthorized:false};
const base={schema:'WORKFLOW_LIFECYCLE_RETIREMENT_CONTINUITY_ASSESSMENT_v1',governingHead:head,gapId:GAP_ID,requirements:evidence,signals:[{class:'ZERO_JOB_FAILURE_SIGNAL',executedJobCount:0},{class:'EXPECTED_RETIREMENT_COMPATIBILITY_FAILURE',expectedRetirementMismatch:true},{class:'LIVE_REQUIRED_CONTROL_PLANE_RESULT',requiredSurface:true}],unresolvedConsumerCount:0,authorityEffects};
const cases=[];const check=(name,pass,actual)=>cases.push({name,pass,actual});
check('ratified-status',INSTRUMENT_STATUS==='RATIFIED_ACTIVE_FAIL_CLOSED',INSTRUMENT_STATUS);
check('positive-all-six',verifyAssessment(base).result==='PASS_CLOSED_ELIGIBLE',verifyAssessment(base).result);
const missing=structuredClone(base);delete missing.requirements.POST_MERGE_OBSERVATION_PROOF;check('missing-requirement-fails',verifyAssessment(missing).result==='FAIL_CLOSED',verifyAssessment(missing).result);
check('unknown-consumer-fails',verifyAssessment({...base,unresolvedConsumerCount:1}).result==='FAIL_CLOSED',verifyAssessment({...base,unresolvedConsumerCount:1}).result);
const inflated=structuredClone(base);inflated.authorityEffects.physicalRetirementAuthorized=true;check('authority-inflation-fails',verifyAssessment(inflated).result==='FAIL_CLOSED',verifyAssessment(inflated).result);
check('zero-job-requires-zero',normalizeSignal({class:'ZERO_JOB_FAILURE_SIGNAL',executedJobCount:1}).pass===false,normalizeSignal({class:'ZERO_JOB_FAILURE_SIGNAL',executedJobCount:1}));
check('stale-failure-bound',normalizeSignal({class:'EXPECTED_RETIREMENT_COMPATIBILITY_FAILURE',expectedRetirementMismatch:true}).countsAsLiveControlPlaneRegression===false,normalizeSignal({class:'EXPECTED_RETIREMENT_COMPATIBILITY_FAILURE',expectedRetirementMismatch:true}));
check('live-required-counts',normalizeSignal({class:'LIVE_REQUIRED_CONTROL_PLANE_RESULT',requiredSurface:true}).countsAsLiveControlPlaneRegression===true,normalizeSignal({class:'LIVE_REQUIRED_CONTROL_PLANE_RESULT',requiredSurface:true}));
const failed=cases.filter(x=>!x.pass);const receipt={schema:'WORKFLOW_LIFECYCLE_RETIREMENT_CONTINUITY_SELF_TEST_RECEIPT_v1',instrumentStatus:INSTRUMENT_STATUS,result:failed.length?'FAIL':'PASS_CLOSED',scenarioCount:cases.length,passedCount:cases.length-failed.length,failedCount:failed.length,scenarios:cases};process.stdout.write(JSON.stringify(receipt,null,2)+'\n');if(failed.length)process.exitCode=1;
