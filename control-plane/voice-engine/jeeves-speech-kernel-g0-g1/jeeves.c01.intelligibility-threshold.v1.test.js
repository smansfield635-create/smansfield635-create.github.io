'use strict';
const assert=require('assert');
const T=require('./jeeves.c01.intelligibility-threshold.v1.js');
const R=require('./jeeves.c01.realization-plan.v1.js');

const pass=T.validateRealization(R.realization());
assert.equal(pass.result,'PASS_INTERNAL_INTELLIGIBILITY_THRESHOLD');
assert(pass.classDiversity.vowel>=6);
assert(pass.classDiversity.fricative>=3);
assert(pass.classDiversity.stop>=3);

const collapsed=R.realization().map(x=>x.type==='WORD_GAP'?x:{...x,features:x.phone==='N'?x.features:{voicing:1,formant1Hz:500,formant2Hz:1500,formant3Hz:2500}});
const fail=T.validateRealization(collapsed);
assert.equal(fail.result,'FAIL_INTERNAL_INTELLIGIBILITY_THRESHOLD');

const noGaps=R.realization().filter(x=>x.type!=='WORD_GAP');
assert.equal(T.validateRealization(noGaps).result,'FAIL_SEQUENCE_LENGTH');

console.log('JEEVES_C01_INTERNAL_INTELLIGIBILITY_THRESHOLD_PASS',JSON.stringify(pass));
