import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {classifyP9NativeSubstrateGate} from '../../showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js';
const hit=(sand,shore)=>({rawSandCoverage:sand,interpolatedExposedContactDistance:shore});
const original=(sand,shore)=>sand<0||sand>.12||shore<=2.0;

test('P10 exact split preserves all old sand/shore OR outcomes at threshold edges',()=>{
 for(const sand of [-.1,0,.000001,.12,.1200001,.5,1])
 for(const shore of [-1,0,.75,2,2.000001,12,Infinity]){
  const r=classifyP9NativeSubstrateGate(hit(sand,shore));
  assert.equal(r.blocked,original(sand,shore));
  assert.equal(r.overlap,sand>.12&&shore<=2);
  assert.equal(r.stage, sand<0?'sandInvalid':sand>.12?'renderedSandCoverage':shore<=2?'shoreProximity':null);
 }
});
test('P10 original OR remains identical on 4096 deterministic quantized contacts',()=>{
 for(let i=0;i<4096;i++){
  const sand=((i*73)%211-11)/150,shore=((i*193)%263-33)/10;
  assert.equal(classifyP9NativeSubstrateGate(hit(sand,shore)).blocked,original(sand,shore));
 }
});
test('P10 distinguishes invalid negative sand from true sand coverage and proximity',()=>{
 assert.deepEqual(classifyP9NativeSubstrateGate(hit(-.1,20)).stage,'sandInvalid');
 assert.deepEqual(classifyP9NativeSubstrateGate(hit(.13,20)).stage,'renderedSandCoverage');
 assert.deepEqual(classifyP9NativeSubstrateGate(hit(.1,1.5)).stage,'shoreProximity');
 assert.deepEqual(classifyP9NativeSubstrateGate(hit(.1,2.01)).stage,null);
 assert.equal(classifyP9NativeSubstrateGate(hit(.98,.2)).overlap,true);
});
test('P10 preserves prior shoreline, water, geo and source planting rules unchanged',()=>{
 const owner=readFileSync('showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js','utf8');
 for(const s of [
  "if(beach.rawSandCoverage<0||beach.rawSandCoverage>.12)",
  "beach.rawSandCoverage>P8_SEDGE_MATERIAL.sandMinExclusive",
  "hit.y<=water.y+P9_UPLAND_MATERIAL.minimumWaterClearance",
  "if(geology.sampleWaterAt(x,z))",
  "if(geology.isPlannedWaterFootprint?.(x,z))",
  "if(!visibleSurface.admitGround(x,z,hit))",
  "planP9NativeUplandMats({installedTiles:tiles",
  "p8SandTiles:p8Sedge.tiles",
  "P9_UPLAND_ALLOCATION.maximumPackedBytes",
  "p9UplandLeavesPerRoot:5"
 ]) assert.ok(owner.includes(s),'P10 protected source missing: '+s);
});
test('P10 material audit records only sampled Run8C class, native water, exact first-failure population',()=>{
 const owner=readFileSync('showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js','utf8');
 for(const s of [
  "originalCombinedReference:61703",
  "materialSampleModulus:16",
  "sampleHEarthRun8CSuccessorSurfaceMaterial(local.x,local.z)",
  "visibleSurface.water.sample(x,z)",
  "geology.sampleWaterAt(x,z)",
  "geology.isPlannedWaterFootprint?.(x,z)",
  "sampledPotentialDrySandNotPlantingEntitlement",
  "sampledEightMeterBins:",
  "p9StageCounts.sandInvalid+p9StageCounts.renderedSandCoverage+p9StageCounts.shoreProximity",
  "p10SubstrateAudit:p10SubstrateReceipt()",
  "SOURCE",
 ]) if(s!=='SOURCE') assert.ok(owner.includes(s),'missing P10 native audit: '+s);
 assert.ok(!owner.includes("p9MarkStage('sandOrShore'"));
});
test('P10 page binds only exact diagnostic owner and preserves all prior draw vertex counts',()=>{
 const owner=readFileSync('showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js','utf8');
 const page=readFileSync('showroom/globe/h-earth/index.html','utf8');
 assert.ok(page.includes('vegetation-single-owner.prototype.v1.js?rev=sha-704ceef5dcc7'));
 assert.equal(owner.split('gl.drawArraysInstanced(gl.TRIANGLES,0,6,range.count)').length-1,4);
 assert.equal(owner.split('gl.drawArraysInstanced(gl.TRIANGLES,0,24,range.count)').length-1,4);
 assert.equal(owner.split('gl.drawArraysInstanced(gl.TRIANGLES,0,30,range.count)').length-1,2);
 assert.ok(owner.includes('rootAllocationUnchanged:true'));
 assert.ok(owner.includes('originalSandShoreOrPredicateUnchanged:true'));
});
