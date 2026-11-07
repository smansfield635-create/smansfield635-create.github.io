import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {FIXED,bottomPixel,parseArguments,validateReadback,classifySample} from './h-earth-first-hit-gpu-qualification.v1.mjs';

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
   frame:{frameSequence:39},...overrides};
}

test('native receipt validator requires measured WebGL2 RGBA8 and matching mode',()=>{
  assert.equal(validateReadback(sample(),1,[384,688],[201,350],1),true);
  assert.throws(()=>validateReadback(sample(),1,[384,688],[201,350],2),/MODE_MISMATCH/);
  assert.throws(()=>validateReadback(sample(),2,[384,688],[201,350],2),/MODE_NOT_APPLIED/);
  assert.throws(()=>validateReadback(sample({appliedMode:3}),1,[384,688],[201,350],1),/MODE_NOT_APPLIED/);
  assert.throws(()=>validateReadback(sample({rgba:[241,1,49]}),1,[384,688],[201,350],1),/RGBA8_INVALID/);
  assert.throws(()=>validateReadback(sample({webgl2:false}),1,[384,688],[201,350],1),/WEBGL_INVALID/);
});

test('wrong buffer origin and viewport fail before attribution',()=>{
 assert.throws(()=>validateReadback(sample({pixelBottom:[201,337]}),1,[384,688],[201,350],1),/VIEWPORT_OR_ORIGIN_MISMATCH/);
 assert.throws(()=>validateReadback(sample({viewport:[688,384]}),1,[384,688],[201,350],1),/VIEWPORT_OR_ORIGIN_MISMATCH/);
 assert.throws(()=>validateReadback(sample({glError:1282}),1,[384,688],[201,350],1),/WEBGL_INVALID/);
});

test('incomplete assets and missing camera evidence fail closed',()=>{
 assert.throws(()=>validateReadback(sample({assetReady:false}),1,[384,688],[201,350],1),/ASSET_NOT_READY/);
 assert.throws(()=>validateReadback(sample({assetSignature:''}),1,[384,688],[201,350],1),/ASSET_NOT_READY/);
 assert.throws(()=>validateReadback(sample({camera:{matrix:[1,2]}}),1,[384,688],[201,350],1),/CAMERA_INVALID/);
 assert.throws(()=>validateReadback(sample({frame:{frameSequence:0}}),1,[384,688],[201,350],1),/FRAME_INVALID/);
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
