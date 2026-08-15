'use strict';
const assert=require('assert');
const A2=require('./jeeves.physical-acoustic-consumer.a2.v1.js');
const A3=require('./jeeves.physical-acoustic-consumer.a3.v1.js');
const P=Object.freeze({f0CenterHz:118,f0ExcursionSemitones:2.8,energyScale:.52,energyVariance:.06,attackMs:12,restraint:.90,urgency:.12});
const frames=[['N',95],['AE',135],['V',100],['IH',135],['G',70],['EY',155],['SH',100],['AH',135],['N',110],['R',85],['IH',135],['K',70],['W',85],['AY',155],['ER',155],['Z',100],['AO',135],['R',85],['IY',135],['EH',135],['N',95],['T',70],['EY',155],['SH',100],['AH',135],['N',110]].map(([phoneme,durationMs])=>({phoneme,durationMs}));
const a=A3.render(P,frames),b=A3.render(P,frames),p=A2.render(P,frames);
assert.equal(a.length,p.length);assert.equal(a.length,b.length);
let sum=0,peak=0,d=0;
for(let i=0;i<a.length;i++){assert.equal(a[i],b[i]);sum+=a[i]*a[i];peak=Math.max(peak,Math.abs(a[i]));d+=Math.abs(a[i]-p[i]);}
const rms=Math.sqrt(sum/a.length),mad=d/a.length;
assert.equal(a.length,71400);assert(rms>.005);assert(peak<=1);assert(mad>.0005);
assert(A3.glottalFlow(.25,.6,.18)>0);assert.equal(A3.glottalFlow(.95,.6,.18),0);
console.log('JEEVES_PHYSICAL_ACOUSTIC_CONSUMER_A3_v1 PASS',JSON.stringify({sampleCount:a.length,durationSeconds:a.length/24000,rms,peak,meanAbsDeltaFromA2:mad}));
