'use strict';
const assert=require('assert');
const A=require('./jeeves.physical-acoustic-consumer.a0a1.v1.js');
const P=Object.freeze({f0CenterHz:118,f0ExcursionSemitones:2.8,energyScale:0.52,energyVariance:0.06,attackMs:12,restraint:0.90,urgency:0.12});
const frames=[
  ['N',95],['AE',135],['V',100],['IH',135],['G',70],['EY',155],['SH',100],['AH',135],['N',110],
  ['R',85],['IH',135],['K',70],['W',85],['AY',155],['ER',155],['Z',100],
  ['AO',135],['R',85],['IY',135],['EH',135],['N',95],['T',70],['EY',155],['SH',100],['AH',135],['N',110]
].map(([phoneme,durationMs])=>({phoneme,durationMs}));
const a=A.render(P,frames), b=A.render(P,frames);
assert.equal(a.length,b.length);
for(let i=0;i<a.length;i++) assert.equal(a[i],b[i]);
const m=A.metrics(a);
assert(m.durationSeconds>2.5 && m.durationSeconds<4.5);
assert(m.rms>0.01);
assert(m.peak>m.rms && m.peak<=1);
assert(m.zeroCrossingRate>0.01);
const edge=A.interpolateTargets('AE','IH','G',0.05), mid=A.interpolateTargets('AE','IH','G',0.5);
assert.notDeepEqual(edge,mid);
assert.throws(()=>A.render({},frames),/PERFORMANCE_STATE_f0CenterHz_INVALID/);
assert.throws(()=>A.render(P,[]),/PHONEME_FRAMES_REQUIRED/);
console.log('JEEVES_PHYSICAL_ACOUSTIC_CONSUMER_A0_A1_v1 PASS', JSON.stringify(m));
