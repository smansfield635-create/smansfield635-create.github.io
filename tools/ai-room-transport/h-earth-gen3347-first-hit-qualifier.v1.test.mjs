import test from 'node:test';
import assert from 'node:assert/strict';
import {FIXED,POSES,toGlPixel,validatePoseReport,retargetHistoricalOverlay,injectHideGrass,instrumentRoute,verifyReceiptRows,parseArgs,objectId} from './h-earth-gen3347-first-hit-qualifier.v1.mjs';

test('published head, historic probe and owner frame remain frozen',()=>{
 assert.equal(FIXED.productHead,'e400920ced2f244344c59daf0015b44c178ea31c');
 assert.equal(FIXED.rendererBlob,'969a5dce59f7a3f15235a677173522d0c9736528');
 assert.equal(FIXED.historicOverlayHead,'ba741660459180de632a03f826800548a40e325f');
 assert.equal(FIXED.frame,'cpu-submit:404:nav:1478');
 assert.equal(FIXED.photographSha256,'3894c43ed6317f6c21e43ce0e8a92c0ea35a5792df8fdc7ab601d66acf56c929');
});
test('exact owner edge pairs and two distinct accepted controls',()=>{
 assert.deepEqual(POSES.map(p=>p.samples.length),[4,1,1]);
 assert.deepEqual(POSES[0].samples.map(p=>toGlPixel(p)),[[360,474],[360,458],[156,197],[156,181]]);
 assert.equal(POSES[1].point.x,-139.40268);
 assert.equal(POSES[2].point.z,-226);
 assert.equal(POSES[0].owner,true);
 assert.equal(POSES[1].owner,false);
});
test('GL origin conversion rejects out-of-bounds pixels',()=>{
 assert.deepEqual(toGlPixel({x:0,yTop:0}),[0,861]);
 assert.deepEqual(toGlPixel({x:601,yTop:861}),[601,0]);
 for(const p of [{x:602,yTop:20},{x:0,yTop:862},{x:-1,yTop:5},{x:1.4,yTop:5}])
  assert.throws(()=>toGlPixel(p),/GEN3347_PIXEL_OUTSIDE_VIEWPORT/);
});
test('owner camera and exact buffer must be source-parity checked',()=>{
 const good={viewport:[602,862],camera:{position:{...FIXED.ownerCamera},matrix:[...FIXED.ownerMatrix]}};
 assert.equal(validatePoseReport(good,true),true);
 assert.throws(()=>validatePoseReport({...good,viewport:[603,862]},true),/GEN3347_FRAMEBUFFER_DIMENSIONS_MISMATCH/);
 assert.throws(()=>validatePoseReport({...good,camera:{...good.camera,position:{...good.camera.position,x:240}}},true),/GEN3347_OWNER_POSE_NOT_REPRODUCED/);
 const v=[...FIXED.ownerMatrix];v[0]+=0.07;
 assert.throws(()=>validatePoseReport({...good,camera:{...good.camera,matrix:v}},true),/GEN3347_OWNER_PROJECTION_MISMATCH/);
});
test('pinned historical probe refuses invented or unpinned object bytes',()=>{
 assert.throws(()=>retargetHistoricalOverlay('untrusted probe','untrusted renderer'),/GEN3347_HISTORICAL_PROBE_BLOB_DRIFT/);
 assert.match(objectId('hello'),/^[0-9a-f]{40}$/);
});
test('renderer source interception permits exactly one hide-grass call',()=>{
 const anchor='resources.singleOwnerVegetation?.draw(packet);';
 assert.match(injectHideGrass('a '+anchor+' b'),/if\(!globalThis\.__gen3347HideGrass\)/);
 assert.throws(()=>injectHideGrass('x'),/GEN3347_SOURCE_ANCHOR_NOT_UNIQUE/);
 assert.throws(()=>injectHideGrass(anchor+anchor),/GEN3347_SOURCE_ANCHOR_NOT_UNIQUE/);
});
test('route hash guard forbids unverified or altered imports',()=>{
 assert.throws(()=>instrumentRoute('const cssWidth=1;'),/GEN3347_CURRENT_ROUTE_BLOB_DRIFT/);
});
test('seven-mode result is required for owner and both controls',()=>{
 assert.throws(()=>verifyReceiptRows([]),/GEN3347_THREE_POSES_REQUIRED/);
 assert.throws(()=>verifyReceiptRows([{samples:[]},{samples:[]},{samples:[]}]),/GEN3347_EDGE_AND_CONTROLS_INCOMPLETE/);
 const rows=[{samples:Array.from({length:4},()=>({modeEvidence:[],compound:null}))},{samples:[{modeEvidence:[],compound:null}]},{samples:[{modeEvidence:[],compound:null}]}];
 assert.throws(()=>verifyReceiptRows(rows),/GEN3347_SEVEN_MODE_EVIDENCE_MISSING/);
});
test('CLI rejects other heads, extra commands and non-absolute output',()=>{
 const ok=['--candidate-head',FIXED.productHead,'--execution-holder','H_EARTH_GEN3347_TEST','--output','/tmp/gen3347.json'];
 assert.equal(parseArgs(ok)['--candidate-head'],FIXED.productHead);
 assert.throws(()=>parseArgs([...ok,'--exec','cat']),/GEN3347_ARGUMENT_SET/);
 assert.throws(()=>parseArgs(['--candidate-head','ba741660459180de632a03f826800548a40e325f',...ok.slice(2)]),/GEN3347_PRODUCT_HEAD_MISMATCH/);
 assert.throws(()=>parseArgs([...ok.slice(0,5),'relative.txt']),/GEN3347_OUTPUT_ABSOLUTE_REQUIRED/);
});
