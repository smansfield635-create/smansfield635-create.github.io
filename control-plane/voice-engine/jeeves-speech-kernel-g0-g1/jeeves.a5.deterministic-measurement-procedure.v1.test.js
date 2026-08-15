'use strict';
const assert=require('assert');
const M=require('./jeeves.a5.deterministic-measurement-procedure.v1.js');

const current={
  spectralTilt:{value:-16.02229,unit:'dB_per_decade',status:'PROXY'},
  jitterStatistics:{localProxy:0.04251248,status:'PROXY'},
  shimmerStatistics:{localProxy:0.13832423,status:'PROXY'}
};
const r=M.evaluateMeasurementAuthority(current);
assert.equal(r.result,'FAIL_AUTHORITATIVE_MEASUREMENTS_REQUIRED');
assert.deepEqual(r.proxy.sort(),['jitterStatistics','shimmerStatistics','spectralTilt'].sort());
assert(r.unresolved.includes('vowelFormants'));
assert(r.unresolved.includes('spectralTilt'));
const next=M.determineNextEvidence(r);
assert(next.includes('SUSTAINED_VOWEL_SET'));
assert(next.includes('SUSTAINED_NASAL_SET'));
assert(next.includes('SUSTAINED_VOICED_VOWEL'));
assert(next.includes('ASPIRATION_CONTEXT_SET'));

const full=Object.fromEntries(M.REQUIRED.map((k)=>[k,{status:'AUTHORITATIVE',value:1}]));
assert.equal(M.evaluateMeasurementAuthority(full).result,'PASS_AUTHORITATIVE_MEASUREMENTS');
assert.equal(M.determineNextEvidence(M.evaluateMeasurementAuthority(full)),'NONE');
console.log('JEEVES_A5_DETERMINISTIC_MEASUREMENT_PROCEDURE_v1 PASS');
