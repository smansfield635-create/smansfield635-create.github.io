import assert from 'node:assert/strict';
import {evaluateTraceability} from './traceability-gate.v1.mjs';
const full={
 requirements:[{id:'R1'}],
 testConditions:[{id:'C1',requirementId:'R1'}],
 testCases:[{id:'T1',testConditionId:'C1'}],
 results:[{id:'O1',testCaseId:'T1',outcome:'PASS',evidenceDigest:'a'.repeat(64)}],
 exitCriteria:[{id:'E1',requirementId:'R1',requiredCaseIds:['T1']}]
};
assert.equal(evaluateTraceability(full).result,'PASS_CLOSED');
assert.equal(evaluateTraceability({...full,results:[]}).errorCode,'TEST_CASE_WITHOUT_RESULT');
assert.equal(evaluateTraceability({...full,testCases:[{id:'T1',testConditionId:'MISSING'}]}).errorCode,'ORPHAN_TEST_CASE');
console.log(JSON.stringify({schema:'L2_TRACEABILITY_SELF_TEST_RECEIPT_v1',result:'PASS_CLOSED',caseCount:3,positiveCaseCount:1,negativeCaseCount:2,negativeCasePassedCount:2},null,2));
