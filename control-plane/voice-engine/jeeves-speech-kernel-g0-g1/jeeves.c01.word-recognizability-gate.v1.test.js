'use strict';
const assert=require('assert');
const G=require('./jeeves.c01.word-recognizability-gate.v1.js');
const r=G.evaluate();
assert.equal(r.pass,true);
assert.equal(r.selfZero,true);
assert.equal(r.mismatchPositive,true);
assert.equal(r.uniquePhoneSequences,true);
assert.equal(r.gapsValid,true);
assert.deepEqual(r.wordPhoneCounts,{Navigation:9,requires:7,orientation:10});
for(const [word,row] of Object.entries(r.scores)){
  assert.equal(row[word],0);
  for(const [other,d] of Object.entries(row)) if(other!==word) assert(d>1);
}
console.log('JEEVES_C01_WORD_RECOGNIZABILITY_INTERNAL_PASS',JSON.stringify(r));
