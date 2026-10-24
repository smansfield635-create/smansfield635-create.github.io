import test from 'node:test';
import assert from 'node:assert/strict';
import {survey,patchAt} from './field-survey.mjs';
test('actual world field reduces axial concentration, broadens transitions, and retains open/covered patches',()=>{
 const a=survey(true),b=survey();
 assert.equal(a.samples,361201);assert.equal(b.samples,a.samples);
 assert.ok(b.axialFraction<a.axialFraction-.02);
 // A rotation alone can shift a preferred direction; also bound peak concentration.
 assert.ok(b.peakOrientationBinFraction<a.peakOrientationBinFraction);
 assert.ok(b.transitionSamples>a.transitionSamples);
 assert.ok(b.almostBare>.06 && b.almostBare<.18);
 assert.ok(b.almostCovered>.18 && b.almostCovered<.4);
 assert.ok(b.meanPatch>.5 && b.meanPatch<.7);
 for(const [x,z] of [[220,-360],[900,-1700],[-1800,-3200]]){
  const vals=[];for(let dx=-100;dx<=100;dx+=10)for(let dz=-100;dz<=100;dz+=10)vals.push(patchAt(x+dx,z+dz));
  assert.ok(vals.some(v=>v<.05));assert.ok(vals.some(v=>v>.8));
 }
});
