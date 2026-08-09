import assert from 'node:assert/strict';
import {evaluateQualityMeasure} from './quality-measure-gate.v1.mjs';
const good={measureId:'M',numerator:10,denominator:10,windowId:'run-current',acceptance:{operator:'>=',threshold:1},longitudinal:true,history:[{windowId:'run-historical',value:1}]};
assert.equal(evaluateQualityMeasure(good).result,'PASS_CLOSED');
assert.equal(evaluateQualityMeasure({...good,denominator:0}).errorCode,'MEASURE_TERMS_INVALID');
assert.equal(evaluateQualityMeasure({...good,history:[]}).errorCode,'LONGITUDINAL_HISTORY_INSUFFICIENT');
assert.equal(evaluateQualityMeasure({...good,numerator:9}).result,'FAIL_CLOSED');
console.log(JSON.stringify({schema:'L2_QUALITY_MEASURE_SELF_TEST_RECEIPT_v1',result:'PASS_CLOSED',caseCount:4,positiveCaseCount:1,negativeCaseCount:3,negativeCasePassedCount:3},null,2));
