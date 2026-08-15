'use strict';
const assert=require('assert');
const G=require('./jeeves.physical-acoustic-consumer.a5.calibration-gate.v1.js');
const profile={
  characterId:'jeeves',
  acousticIdentity:{register:'LOW_MID_MALE'},
  creativeDirection:{target:'ORIGINAL_DIAMOND_GATE_IDENTITY'},
  referenceAudio:{status:'UNBOUND'}
};
let r=G.evaluateCalibrationAdmission(profile,{referenceAudio:profile.referenceAudio});
assert.equal(r.result,'FAIL_REFERENCE_REQUIRED');
assert.equal(r.lawfulProfileOnlyUse,true);
assert(r.missingMeasuredParameters.includes('vowelFormants'));
assert(r.missingMeasuredParameters.includes('glottalOpenQuotient'));
const bound={status:'BOUND_AUTHORIZED_ORIGINAL',sha256:'a'.repeat(64),provenanceId:'JEEVES_REF_001',transcript:'Navigation requires orientation.'};
r=G.evaluateCalibrationAdmission(profile,{referenceAudio:bound});
assert.equal(r.result,'FAIL_MEASUREMENTS_REQUIRED');
const measured=Object.fromEntries(G.REQUIRED_MEASURED.map(k=>[k,{measured:true}]));
r=G.evaluateCalibrationAdmission(profile,{referenceAudio:bound,measuredParameters:measured});
assert.equal(r.result,'PASS_CALIBRATION_ADMISSIBLE');
assert.equal(G.isBoundOriginal({...bound,sha256:'not-a-hash'}),false);
assert.equal(G.evaluateCalibrationAdmission({...profile,characterId:'other'},{}).result,'FAIL_PROFILE_INVALID');
console.log('JEEVES_PHYSICAL_ACOUSTIC_CONSUMER_A5_CALIBRATION_GATE_v1 PASS');
