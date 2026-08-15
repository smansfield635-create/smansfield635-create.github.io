'use strict';
const assert=require('assert');
const A1=require('./jeeves.physical-acoustic-consumer.a0a1.v1.js');
const A2=require('./jeeves.physical-acoustic-consumer.a2.v1.js');

const P=Object.freeze({f0CenterHz:118,f0ExcursionSemitones:2.8,energyScale:0.52,energyVariance:0.06,attackMs:12,restraint:0.90,urgency:0.12});
const frames=[
  ['N',95],['AE',135],['V',100],['IH',135],['G',70],['EY',155],['SH',100],['AH',135],['N',110],
  ['R',85],['IH',135],['K',70],['W',85],['AY',155],['ER',155],['Z',100],
  ['AO',135],['R',85],['IY',135],['EH',135],['N',95],['T',70],['EY',155],['SH',100],['AH',135],['N',110]
].map(([phoneme,durationMs])=>({phoneme,durationMs}));

for(const t of [0,0.1,0.24,0.5,0.72,0.9,1]){
  const w=A2.gestureWeights(t);
  assert(w.prev>=0&&w.prev<=0.42);
  assert(w.next>=0&&w.next<=0.42);
  assert.equal(w.current,1);
}
const left=A2.articulatoryTargets('AE','IH','G',0.01),mid=A2.articulatoryTargets('AE','IH','G',0.5),right=A2.articulatoryTargets('AE','IH','G',0.99);
assert.notDeepEqual(left.formants,mid.formants);
assert.notDeepEqual(right.formants,mid.formants);

const a=A2.render(P,frames),b=A2.render(P,frames),old=A1.render(P,frames);
assert.equal(a.length,b.length);
assert.equal(a.length,old.length);
for(let i=0;i<a.length;i++) assert.equal(a[i],b[i]);
let delta=0,peak=0,sum=0;
for(let i=0;i<a.length;i++){
  delta+=Math.abs(a[i]-old[i]);
  peak=Math.max(peak,Math.abs(a[i]));
  sum+=a[i]*a[i];
}
const metrics={sampleRate:A2.SR,sampleCount:a.length,durationSeconds:a.length/A2.SR,rms:Math.sqrt(sum/a.length),meanAbsDeltaFromA1:delta/a.length,peak};
assert(metrics.meanAbsDeltaFromA1>1e-5);
assert(metrics.peak<=1);
console.log('JEEVES_PHYSICAL_ACOUSTIC_CONSUMER_A2_v1 PASS',JSON.stringify(metrics));
