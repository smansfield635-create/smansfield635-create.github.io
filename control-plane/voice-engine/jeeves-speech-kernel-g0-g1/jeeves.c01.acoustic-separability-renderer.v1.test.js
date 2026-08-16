'use strict';
const assert=require('assert');
const PLAN=require('./jeeves.c01.realization-plan.v1.js');
const R=require('./jeeves.c01.acoustic-separability-renderer.v1.js');
const out=R.render();
assert.equal(out.sampleRate,24000);
const gaps=out.segments.filter(s=>s.type==='WORD_GAP');
assert.equal(gaps.length,2);
for(const g of gaps){
  let max=0;for(let i=g.startSample;i<g.endSample;i++)max=Math.max(max,Math.abs(out.audio[i]));
  assert(max===0);
  assert((g.endSample-g.startSample)>=Math.round(.110*R.SR));
}
const phones=out.segments.filter(s=>s.type==='PHONE');
const byClass={};
for(const s of phones){const cls=PLAN.PHONE[s.phone].class;(byClass[cls]??=[]).push({phone:s.phone,v:R.featureVector(out.audio,s.startSample,s.endSample)});}
function pairDist(a,b){return Math.abs(a.rms-b.rms)+Math.abs(a.zcr-b.zcr)+Math.abs(a.hfRatio-b.hfRatio);}
for(const cls of ['vowel','fricative','stop']){
  const arr=byClass[cls];assert(arr&&arr.length>=2);let max=0;for(let i=0;i<arr.length;i++)for(let j=i+1;j<arr.length;j++)max=Math.max(max,pairDist(arr[i].v,arr[j].v));assert(max>.005,cls+'_NOT_SEPARABLE');
}
const vowelMean=byClass.vowel.reduce((s,x)=>s+x.v.zcr,0)/byClass.vowel.length;
const fricMean=byClass.fricative.reduce((s,x)=>s+x.v.zcr,0)/byClass.fricative.length;
const stopMean=byClass.stop.reduce((s,x)=>s+x.v.zcr,0)/byClass.stop.length;
assert(fricMean>vowelMean,'FRICATIVE_CLASS_NOT_DISTINCT');
assert(stopMean!==vowelMean,'STOP_CLASS_NOT_DISTINCT');
console.log('JEEVES_C01_ACOUSTIC_SEPARABILITY_PASS',JSON.stringify({sampleCount:out.audio.length,durationSeconds:out.audio.length/out.sampleRate,wordGaps:gaps.map(g=>(g.endSample-g.startSample)/out.sampleRate),classMeans:{vowelZcr:vowelMean,fricativeZcr:fricMean,stopZcr:stopMean}}));
