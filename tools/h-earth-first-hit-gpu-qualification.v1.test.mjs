import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {FIXED,bottomPixel,parseArguments,validateReadback,classifySample,readinessDigest,verifyPng} from './h-earth-first-hit-gpu-qualification.v1.mjs';

test('the frozen H-Earth baseline/candidate and probe identities are exact',()=>{
  for(const sha of [FIXED.probe,FIXED.probeModule,FIXED.published,FIXED.candidate])
    assert.match(sha,/^[0-9a-f]{40}$/);
  assert.notEqual(FIXED.published,FIXED.candidate);
  assert.deepEqual(FIXED.modes,[1,2,3,4,5,6,7]);
  assert.deepEqual(FIXED.viewport,[384,688]);
});

test('Android top-origin selected point maps to WebGL bottom-origin without resampling',()=>{
  assert.deepEqual(bottomPixel(FIXED.ownerPixelTop),[201,350]);
  assert.deepEqual(bottomPixel(FIXED.healthyPixelTop),[192,343]);
  assert.deepEqual(bottomPixel([0,0]),[0,687]);
  assert.deepEqual(bottomPixel([383,687]),[383,0]);
});

test('reject invalid and out-of-range screen pixels',()=>{
  for(const pixel of [[384,337],[201,688],[-1,0],[0,-1],[4.2,5],[2],[2,3,4],null])
    assert.throws(()=>bottomPixel(pixel),/GEN3150_PIXEL_INVALID/);
});

test('qualification CLI accepts exactly the four independent source/output roots',()=>{
  const paths=['--baseline-dir','/tmp/base','--candidate-dir','/tmp/candidate','--probe-dir','/tmp/probe','--output','/tmp/out'];
  const r=parseArguments(paths);
  assert.equal(r['--baseline-dir'],path.resolve('/tmp/base'));
  assert.equal(r['--probe-dir'],path.resolve('/tmp/probe'));
  assert.throws(()=>parseArguments(paths.slice(0,-2)),/ARGUMENT_COUNT/);
  assert.throws(()=>parseArguments([...paths.slice(0,-2),'--extra','/tmp/out']),/ARGUMENT_INVALID/);
  assert.throws(()=>parseArguments([...paths.slice(0,-2),'--output','/tmp/base']),/ARGUMENT_SET/);
});

function sample(overrides={}){
 return {webgl2:true,contextLost:false,glError:0,
   appliedMode:1,rgba:[241,1,49,255],viewport:[384,688],pixelBottom:[201,350],
   assetReady:true,assetSignature:'stable-grove',drawSignature:'stable-geometry',
   camera:{position:{x:124,y:8,z:-394},matrix:Array.from({length:16},(_,i)=>i)},
   frame:{frameSequence:39,navigationSequence:5085,cameraPosition:{x:124,y:8,z:-394}},...overrides};
}

function requested(overrides={}){
 return {state:{sequence:5085,position:{x:124.4127167356344,y:9.082148204768242,z:-394.77901544898066}},
   previousFrame:38,owner:false,...overrides};
}
test('native receipt validator requires measured WebGL2 RGBA8 and matching mode',()=>{
  assert.equal(validateReadback(sample(),1,[384,688],[201,350],1,requested()),true);
  assert.throws(()=>validateReadback(sample(),1,[384,688],[201,350],2,requested()),/MODE_MISMATCH/);
  assert.throws(()=>validateReadback(sample(),2,[384,688],[201,350],2,requested()),/MODE_NOT_APPLIED/);
  assert.throws(()=>validateReadback(sample({appliedMode:3}),1,[384,688],[201,350],1,requested()),/MODE_NOT_APPLIED/);
  assert.throws(()=>validateReadback(sample({rgba:[241,1,49]}),1,[384,688],[201,350],1,requested()),/RGBA8_INVALID/);
  assert.throws(()=>validateReadback(sample({webgl2:false}),1,[384,688],[201,350],1,requested()),/WEBGL_INVALID/);
});

test('wrong buffer origin and viewport fail before attribution',()=>{
 assert.throws(()=>validateReadback(sample({pixelBottom:[201,337]}),1,[384,688],[201,350],1,requested()),/VIEWPORT_OR_ORIGIN_MISMATCH/);
 assert.throws(()=>validateReadback(sample({viewport:[688,384]}),1,[384,688],[201,350],1,requested()),/VIEWPORT_OR_ORIGIN_MISMATCH/);
 assert.throws(()=>validateReadback(sample({glError:1282}),1,[384,688],[201,350],1,requested()),/WEBGL_INVALID/);
});

test('incomplete assets and missing camera evidence fail closed',()=>{
 assert.throws(()=>validateReadback(sample({assetReady:false}),1,[384,688],[201,350],1,requested()),/ASSET_NOT_READY/);
 assert.throws(()=>validateReadback(sample({assetSignature:''}),1,[384,688],[201,350],1,requested()),/ASSET_NOT_READY/);
 assert.throws(()=>validateReadback(sample({camera:{matrix:[1,2]}}),1,[384,688],[201,350],1,requested()),/CAMERA_INVALID/);
 assert.throws(()=>validateReadback(sample({frame:{frameSequence:0}}),1,[384,688],[201,350],1,requested()),/FRAME_INVALID/);
});

test('unresolved contributions never manufacture Android or map-wide proof',()=>{
 const unresolved=classifySample({status:'PIXEL_FIRST_HIT_UNRESOLVED'});
 assert.equal(unresolved.result,'MATERIAL_FIRST_HIT_UNRESOLVED');
 assert.equal(unresolved.physicalAndroidParity,false);
 const positive=classifySample({status:'SOURCE_BOUND_MATCHED_PIXEL_MODE_SET_NOT_ANDROID_FIRST_HIT',role:1,primitiveIndex:62001,groundcoverWeight:23/255});
 assert.equal(positive.result,'OPAQUE_SOURCE_BOUND_GPU_MATERIAL_SAMPLE');
 assert.equal(positive.appliedGroundcoverWeight,23/255);
 assert.equal(positive.sourceFirstHitVerified,false);
 assert.equal(positive.physicalAndroidParity,false);
});

test('qualification source is product-mutation-free and uses the Gen3147 camera precedent',()=>{
 const source=fs.readFileSync(new URL('./h-earth-first-hit-gpu-qualification.v1.mjs',import.meta.url),'utf8');
 assert.match(source,/comparison\.GEN3142_MATCHED_POSES/);
 assert.match(source,/probe\.transformExactRenderer/);
 assert.match(source,/probe\.decodeModePixel/);
 assert.match(source,/probe\.combinePixelReceipts/);
 assert.match(source,/gl\.readPixels/);
 assert.match(source,/viewport:\{width:384,height:688\}/);
 assert.doesNotMatch(source,/git\s+push|fs\.writeFileSync\(.*FIXED\.renderer/);
});

test('tool refuses to assert a reproduced owner boundary from synthetic camera alone',()=>{
 const source=fs.readFileSync(new URL('./h-earth-first-hit-gpu-qualification.v1.mjs',import.meta.url),'utf8');
 assert.match(source,/ownerBoundaryVisuallyRecognized:false/);
 assert.match(source,/physicalAndroidEquivalenceProven:false/);
 assert.match(source,/mapWideTerrainRepairProven:false/);
 assert.match(source,/SOURCE_BOUND_WEBGL2_MODE_CAPTURED_OWNER_VISUAL_PARITY_UNVERIFIED/);
});


test('submitted frame must advance and match requested navigation and camera',()=>{
 assert.throws(()=>validateReadback(sample({frame:{frameSequence:39,navigationSequence:5086,cameraPosition:{x:124,y:8,z:-394}}}),1,[384,688],[201,350],1,requested()),/SUBMITTED_FRAME_OR_CAMERA_MISMATCH/);
 assert.throws(()=>validateReadback(sample(),1,[384,688],[201,350],1,requested({previousFrame:39})),/SUBMITTED_FRAME_OR_CAMERA_MISMATCH/);
 assert.throws(()=>validateReadback(sample({frame:{frameSequence:39,navigationSequence:5085,cameraPosition:{x:125,y:8,z:-394}}}),1,[384,688],[201,350],1,requested()),/SUBMITTED_FRAME_OR_CAMERA_MISMATCH/);
 assert.throws(()=>validateReadback(sample(),1,[384,688],[201,350],1,null),/REQUESTED_STATE_MISSING/);
});

test('owner camera and projection must match frozen Android frame',()=>{
 const owner={camera:{x:124.41538691662353,y:8.878180721309036,z:-394.78748830810326},
  navigationPosition:{x:124.4127167356344,y:9.082148204768242,z:-394.77901544898066},
  matrix:Array.from({length:16},(_,i)=>i)};
 const base=sample({camera:{position:owner.camera,matrix:owner.matrix},
  frame:{frameSequence:39,navigationSequence:5085,cameraPosition:owner.camera}});
 const expected=requested({owner:true,ownerWitness:owner});
 assert.equal(validateReadback(base,1,[384,688],[201,350],1,expected),true);
 assert.throws(()=>validateReadback(sample(),1,[384,688],[201,350],1,expected),/OWNER_CAMERA_OR_PROJECTION_MISMATCH/);
 assert.throws(()=>validateReadback(sample({camera:{position:owner.camera,matrix:owner.matrix.map(v=>v+1)},
  frame:{frameSequence:39,navigationSequence:5085,cameraPosition:owner.camera}}),1,[384,688],[201,350],1,expected),/OWNER_CAMERA_OR_PROJECTION_MISMATCH/);
});

test('large collection asset readiness JSON uses bounded stable digest',()=>{
 const full=JSON.stringify(Array.from({length:120},(_,i)=>({id:'tree-'+i,state:'READY',ready:true})));
 assert.ok(full.length>256);
 const digest=readinessDigest(full);
 assert.match(digest,/^[a-f0-9]{64}$/);
 assert.equal(digest,readinessDigest(full));
 assert.notEqual(digest,readinessDigest(full+' '));
 assert.throws(()=>readinessDigest(''),/ASSET_SIGNATURE_MISSING/);
});

test('normal-color image requires PNG dimensions matching actual canvas',()=>{
 const png=Buffer.alloc(1100);
 Buffer.from([137,80,78,71,13,10,26,10]).copy(png,0);
 png.write('IHDR',12,'ascii');png.writeUInt32BE(384,16);png.writeUInt32BE(688,20);
 assert.match(verifyPng(png),/^[a-f0-9]{64}$/);
 const wrong=Buffer.from(png);wrong.writeUInt32BE(687,20);
 assert.throws(()=>verifyPng(wrong),/VISUAL_PNG_INVALID/);
 assert.throws(()=>verifyPng(Buffer.alloc(1024)),/VISUAL_PNG_INVALID/);
});

test('runner preserves visual custody and clean source state',()=>{
 const source=fs.readFileSync(new URL('./h-earth-first-hit-gpu-qualification.v1.mjs',import.meta.url),'utf8');
 assert.match(source,/status','--porcelain','--untracked-files=no'/);
 assert.match(source,/toDataURL\('image\/png'\)/);
 assert.match(source,/normalImageSha256:imageDigest/);
 assert.match(source,/ownerBoundaryVisuallyRecognized:false/);
 assert.match(source,/assetSignature:readinessDigest\(raw\.assetSignature\)/);
 assert.match(source,/verifyCheckout\(opts\['--candidate-dir'\],FIXED\.candidate\)/);
 assert.match(source,/previousFrame=raw\.frame\.frameSequence/);
});
