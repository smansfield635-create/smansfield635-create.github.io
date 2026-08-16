'use strict';
const assert=require('assert');
const D=require('./jeeves.c01.waveform-only-decoder.v2.js');
const r=D.evaluate();
assert.equal(r.pass,true);
assert.equal(r.correctPhones,26);
assert.equal(r.totalPhones,26);
assert.equal(r.phoneAccuracy,1);
assert.deepEqual(r.decodedWords,[
  'N-AE-V-IH-G-EY-SH-AH-N',
  'R-IH-K-W-AY-ER-Z',
  'AO-R-IY-EH-N-T-EY-SH-AH-N'
]);
console.log('JEEVES_C01_WAVEFORM_ONLY_DECODER_V2_PASS',JSON.stringify(r));
