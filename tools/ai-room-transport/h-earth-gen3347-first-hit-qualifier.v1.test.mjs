import test from 'node:test';
import assert from 'node:assert/strict';
import {FIXED,POSES,toGlPixel,validatePoseReport,retargetHistoricalOverlay,extendStageOverlay,injectHideGrass,instrumentRoute,verifyReceiptRows,parseArgs,objectId,startupFailureEvidence} from './h-earth-gen3347-first-hit-qualifier.v1.mjs';

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

test('Gen3375 extends only exact historical first-hit source, not generic shaders',()=>{
 assert.throws(()=>extendStageOverlay('fabricated or incomplete first-hit overlay'),/GEN3347_SOURCE_ANCHOR_NOT_UNIQUE/);
});
test('Gen3375 enforces class-4 same-location scalars and translucent exclusion',()=>{
 const location=[[260.3633478294,-237.0192416266],[255.6132753491,-236.7067368582],[210.6438391699,-240.4567940795]];
 const modes=()=>Array.from({length:7},(_,i)=>({mode:i+1}));
 const stages=()=>Array.from({length:4},(_,i)=>({mode:i+8,status:'SOURCE_BOUND_GPU_SCALAR',values:[.25,.75]}));
 const good=(x,z)=>({modeEvidence:modes(),materialModes:stages(),compound:{status:'SOURCE_BOUND_MATCHED_PIXEL_MODE_SET_NOT_ANDROID_FIRST_HIT',role:1,primitiveIndex:0,surfaceClass:4,x,z}});
 const owner=location.map(([x,z])=>good(x,z));
 owner.push({modeEvidence:modes(),materialModes:Array.from({length:4},(_,i)=>({mode:i+8,status:'TRANSLUCENT_NOT_TERRAIN'})),compound:{status:'PIXEL_FIRST_HIT_UNRESOLVED'}});
 const rows=[{samples:owner},{samples:[good(-139.424,-183.674)]},{samples:[good(-141,-220)]}];
 assert.equal(verifyReceiptRows(rows),true);
 const wrongClass=structuredClone(rows);wrongClass[0].samples[0].compound.surfaceClass=6;
 assert.throws(()=>verifyReceiptRows(wrongClass),/GEN3375_CLASS4_TERRAIN_FIRST_HIT_MISMATCH/);
 const wrongPosition=structuredClone(rows);wrongPosition[0].samples[1].compound.z=-320;
 assert.throws(()=>verifyReceiptRows(wrongPosition),/GEN3375_ORIGINAL_REGION_WORLD_HIT_DRIFT/);
 const fakeOpaque=structuredClone(rows);fakeOpaque[0].samples[3].materialModes[0].status='SOURCE_BOUND_GPU_SCALAR';
 assert.throws(()=>verifyReceiptRows(fakeOpaque),/GEN3375_TRANSLUCENT_SAMPLE_MISATTRIBUTED/);
 const missingStage=structuredClone(rows);missingStage[1].samples[0].materialModes.pop();
 assert.throws(()=>verifyReceiptRows(missingStage),/GEN3375_FOUR_SCALAR_MODES_REQUIRED/);
 const invalidScalar=structuredClone(rows);invalidScalar[2].samples[0].materialModes[0].values=[1.5,-1];
 assert.throws(()=>verifyReceiptRows(invalidScalar),/GEN3375_MATERIAL_SCALAR_READBACK_INVALID/);
});


test('Gen3380 startup evidence preserves original route exception with bounded, URL-redacted failure metadata',()=>{
 const evidence=startupFailureEvidence(
  {run8eError:true,routeStatusText:'WebGL shader compile failed: original route error',loaderMode:'failed'},
  {pageErrors:['TypeError: startup failed https://diamondgatebridge.com/a.js?token=secret'],
   consoleErrors:Array.from({length:11},(_,i)=>'console error '+i),
   failedResources:[{path:'/showroom/globe/h-earth/asset.js?key=secret',status:404,errorText:'HTTP_ERROR'},
    {path:'https://bad.invalid/private?key=secret',status:403,errorText:'DENIED'}]}
 );
 assert.equal(evidence.schema,'H_EARTH_GEN3380_PUBLIC_ROUTE_STARTUP_FAILURE_EVIDENCE_v1');
 assert.equal(evidence.routeReportedFailure,true);
 assert.match(evidence.routeStatusText,/original route error/);
 assert.equal(evidence.pageErrors.length,1);
 assert.equal(evidence.consoleErrors.length,8);
 assert.equal(evidence.failedResources[0].path,'/showroom/globe/h-earth/asset.js');
 assert.equal(evidence.failedResources[0].status,404);
 assert.equal(evidence.failedResources[1].path,'[UNKNOWN_RESOURCE]');
 assert.equal(evidence.productMutationPerformed,false);
 assert.equal(evidence.diagnosticOnly,true);
 assert.doesNotMatch(JSON.stringify(evidence),/token=secret|key=secret/);
});
test('Gen3380 empty startup evidence fails no material or physical parity gate open',()=>{
 const evidence=startupFailureEvidence({run8eError:false,routeStatusText:''});
 assert.equal(evidence.routeReportedFailure,false);
 assert.deepEqual(evidence.pageErrors,[]);
 assert.deepEqual(evidence.consoleErrors,[]);
 assert.deepEqual(evidence.failedResources,[]);
 assert.equal(evidence.productMutationPerformed,false);
});
