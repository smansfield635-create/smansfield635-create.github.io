'use strict';
const assert=require('assert');
const A3=require('./jeeves.physical-acoustic-consumer.a3.v1.js');
const A4=require('./jeeves.physical-acoustic-consumer.a4.v1.js');
const P=Object.freeze({f0CenterHz:118,f0ExcursionSemitones:2.8,energyScale:.52,energyVariance:.06,attackMs:12,restraint:.90,urgency:.12});
const frames=[['N',95],['AE',135],['V',100],['IH',135],['G',70],['EY',155],['SH',100],['AH',135],['N',110],['R',85],['IH',135],['K',70],['W',85],['AY',155],['ER',155],['Z',100],['AO',135],['R',85],['IY',135],['EH',135],['N',95],['T',70],['EY',155],['SH',100],['AH',135],['N',110]].map(([phoneme,durationMs])=>({phoneme,durationMs}));
const a=A4.render(P,frames),b=A4.render(P,frames),p=A3.render(P,frames);
assert.equal(a.length,71400); assert.equal(a.length,p.length); assert.equal(a.length,b.length);
let delta=0,peak=0,sum=0;for(let i=0;i<a.length;i++){assert.equal(a[i],b[i]);delta+=Math.abs(a[i]-p[i]);peak=Math.max(peak,Math.abs(a[i]));sum+=a[i]*a[i];}
assert(delta/a.length>0.0001);assert(peak>0&&peak<=1);assert(Math.sqrt(sum/a.length)>0.001);
assert.notDeepEqual(A4.nasalProfile('M'),A4.nasalProfile('N'));
assert(A4.fricativeProfile('S').center>A4.fricativeProfile('SH').center);
assert.equal(A4.placeForStop('P'),'labial');assert.equal(A4.placeForStop('T'),'alveolar');assert.equal(A4.placeForStop('K'),'velar');
console.log('JEEVES_PHYSICAL_ACOUSTIC_CONSUMER_A4_v1 PASS',JSON.stringify({samples:a.length,duration:a.length/A4.SR,rms:Math.sqrt(sum/a.length),peak,meanAbsDeltaFromA3:delta/a.length}));
