import assert from 'node:assert/strict';
import {evaluateVV} from './vv-integrity-gate.v1.mjs';
const good={integrityTier:'T3',constructorHolder:'builder',verifierHolder:'fresh-verifier',verifierMayRepair:false,evidenceSourceIndependent:true};
assert.equal(evaluateVV(good).result,'PASS_CLOSED');
assert.equal(evaluateVV({...good,verifierHolder:'builder'}).errorCode,'VV_INDEPENDENCE_REQUIRED');
assert.equal(evaluateVV({...good,verifierMayRepair:true}).errorCode,'VV_VERIFIER_REPAIR_FORBIDDEN');
assert.equal(evaluateVV({...good,evidenceSourceIndependent:false}).errorCode,'VV_EVIDENCE_INDEPENDENCE_REQUIRED');
console.log(JSON.stringify({schema:'L2_VV_INTEGRITY_SELF_TEST_RECEIPT_v1',result:'PASS_CLOSED',caseCount:4,positiveCaseCount:1,negativeCaseCount:3,negativeCasePassedCount:3},null,2));
