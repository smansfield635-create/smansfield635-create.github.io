'use strict';
const assert=require('node:assert/strict');
const G=require('./jeeves.c01.open-variation-robustness.v1.js');
const x=G.evaluate();
assert.equal(x.cases,13);
assert.equal(x.passed,13,JSON.stringify(x.results,null,2));
assert.equal(x.pass,true);
for(const r of x.results){assert.equal(r.regions,3,r.id);assert.deepEqual(r.words,['Navigation','requires','orientation'],r.id);assert.ok(r.margins.every(v=>v>0),r.id);}
console.log(JSON.stringify(x,null,2));
