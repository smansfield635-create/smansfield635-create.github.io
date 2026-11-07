import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {transformExactRenderer,sourceObjectId,decodeModePixel,combinePixelReceipts,MODE_MAGIC,TARGETS} from './h-earth-first-hit-material-overlay.mjs';

const template = `
const FS = \`#version 300 es
precision highp float;
out vec4 outColor;
void main(){
 float terrainRoughnessForLighting=0.72;
 float groundcoverWeight=0.4;
      // H_EARTH_BROAD_GROUNDCOVER_V1_END
 vec3 lit=vec3(0.4);
 float outputAlpha=1.0;
  outColor=vec4(lit,outputAlpha);
}\`;
const resources={geometryProgram:{},vertexArray:{}};
const gl={DEPTH_TEST:1,LEQUAL:2,CULL_FACE:3,FRAGMENT_SHADER:4,
  enable:()=>{},depthFunc:()=>{},disable:()=>{},useProgram:()=>{},bindVertexArray:()=>{},
  getUniformLocation:()=>({}),uniform1i:()=>{}};
let compiledShader='';
function createShader(type,source,label){compiledShader=source;return source;}
function init(){
  gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.disable(gl.CULL_FACE); gl.useProgram(resources.geometryProgram); gl.bindVertexArray(resources.vertexArray);
    resources.geometryFragmentShader = createShader(gl.FRAGMENT_SHADER, FS.replace('#version 300 es','#version 300 es\\nflat in uint vCorrectedAtlas;'), 'GF');
}
init();
`;

function transform(){return transformExactRenderer(template,{allowFixture:true});}

test('source fixture contains one exact compiler and draw anchor',()=>{
 const t=transform();assert.equal(t.productDiskMutation,false);
 assert.ok(t.source.length>template.length);
 assert.match(t.source,/heMaterialFirstHitGeometrySource\(FS.replace/);
 assert.match(t.source,/\)\), 'GF'\);/);
});

test('injected diagnostic affects only compiled geometry shader, not authored FS',()=>{
 const t=transform();const context={globalThis:{__hEarthFirstHitMaterialMode:0},Number};
 const out=vm.runInNewContext(t.source+"\n({compiledShader,FS})",context);
 assert.doesNotMatch(out.FS,/uMaterialProbeMode/);
 assert.match(out.compiledShader,/uniform int uMaterialProbeMode;/);
 assert.match(out.compiledShader,/vCorrectedAtlas/);
 assert.match(out.compiledShader,/hEarthProbeGCWeight/);
 assert.match(out.compiledShader,/outColor=vec4\(241\.0/);
 assert.ok(!out.compiledShader.includes('\\n'));
});

test('uniform mode fails closed on out of range values',()=>{
 const t=transform();for(const bad of [-1,8,2.1,'3']){
 assert.throws(()=>vm.runInNewContext(t.source,{globalThis:{__hEarthFirstHitMaterialMode:bad},Number}),/FIRST_HIT_PROBE_MODE_INVALID/);
 }
});

test('source identity must be exact even when content has correct anchors',()=>{
 assert.throws(()=>transformExactRenderer(template),/FIRST_HIT_RENDERER_BLOB_MISMATCH/);
 assert.throws(()=>transformExactRenderer(template,{target:'invalid'}),/INPUT_OR_TARGET_INVALID/);
 assert.ok(/^[0-9a-f]{40}$/.test(TARGETS.published.rendererBlob));
});

test('reject missing and duplicate compiler anchors',()=>{
 assert.throws(()=>transformExactRenderer(template.replace('resources.geometryFragmentShader','somethingElse'),{allowFixture:true}),/SOURCE_ANCHOR_NOT_UNIQUE/);
 assert.throws(()=>transformExactRenderer(template+'\n'+template,{allowFixture:true}),/SOURCE_ANCHOR_NOT_UNIQUE/);
});

test('blob identity matches git hash-object for sample byte content',()=>{
 const value='H-Earth\nsource';
 const git=execFileSync('git',['hash-object','--stdin'],{input:value,encoding:'utf8'}).trim();
 assert.equal(sourceObjectId(value),git);
});

test('decoders return measured primitive role, class, atlas, weight and position',()=>{
 const low=decodeModePixel(1,[241,1,49,255]);
 const high=decodeModePixel(2,[242,242,7,255]);
 assert.equal(low.role,1);assert.equal(low.primitiveLow,49);
 assert.equal(high.primitiveHigh,242);assert.equal(high.surfaceClass,7);
 assert.equal(decodeModePixel(3,[243,2,255,255]).correctedAtlas,2);
 assert.equal(decodeModePixel(7,[247,129,255,255]).groundcoverBlockEntered,true);
 assert.ok(Math.abs(decodeModePixel(4,[244,0,128,255]).worldCoordinate)<0.03);
});

test('missing geometry marker never invents a hit',()=>{
 const x=decodeModePixel(1,[17,1,2,255]);assert.equal(x.status,'UNATTRIBUTED_PIXEL_NOT_FROM_PROBED_GEOMETRY');
 assert.equal(combinePixelReceipts([]).status,'PIXEL_FIRST_HIT_UNRESOLVED');
});

const pixels=[null,
  new Uint8Array([241,1,49,255]),new Uint8Array([242,242,7,255]),
  new Uint8Array([243,2,255,255]),new Uint8Array([244,0,128,255]),
  new Uint8Array([245,0,128,255]),new Uint8Array([246,0,128,255]),
  new Uint8Array([247,129,255,255])];
const capture = (mode,overrides={})=>({
  target:'published',sourceHead:TARGETS.published.head,
  rendererObjectId:TARGETS.published.rendererBlob,
  instrumentedSha256:'a'.repeat(64),webgl2:true,
  readbackClass:'WEBGL2_READPIXELS_RGBA8',appliedMode:mode,
  poseId:'same-fixed-owner-pose',assetSignature:'same-resident-assets',
  drawSignature:'main-scene-draw-call-identity',
  cameraPosition:[124.4,8.9,-394.8],
  viewProjectionMatrix:Array.from({length:16},(_,i)=>i===0||i===5||i===10||i===15?1:0),
  viewport:[384,688],pixel:[201,350],webglErrors:[],...overrides
});
const received=(overrides={})=>Array.from({length:7},(_,i)=>{
  const mode=i+1;
  return decodeModePixel(mode,pixels[mode],capture(mode,overrides));
});

test('seven actual typed-array decode results combine with exact same captured provenance',()=>{
  const r=received(),hit=combinePixelReceipts(r);
  assert.deepEqual(r.map(x=>x.mode),[1,2,3,4,5,6,7]);
  assert.equal(hit.status,'SOURCE_BOUND_MATCHED_PIXEL_MODE_SET_NOT_ANDROID_FIRST_HIT');
  assert.equal(hit.role,1);assert.equal(hit.primitiveIndex,62001);
  assert.equal(hit.groundcoverBlockEntered,true);
  assert.equal(hit.physicalOwnerImageParity,false);
  assert.equal(hit.firstHitGeometryVerified,false);
  assert.ok(Object.isFrozen(r[0]));assert.ok(Object.isFrozen(r[0].rgba));
});

test('without claimed provenance seven decoded bytes do not support attribution',()=>{
  const r=Array.from({length:7},(_,i)=>decodeModePixel(i+1,pixels[i+1]));
  assert.equal(combinePixelReceipts(r).status,'PIXEL_FIRST_HIT_UNRESOLVED');
});

test('complete mode set required, including noncanonical seven-ID permutations',()=>{
  const r=received();
  assert.equal(combinePixelReceipts(r.slice(1)).status,'PIXEL_FIRST_HIT_UNRESOLVED');
  assert.equal(combinePixelReceipts([...r.slice(0,6),r[5]]).status,'PIXEL_FIRST_HIT_UNRESOLVED');
  assert.equal(combinePixelReceipts(r.map((x,i)=>({...x,mode:i}))).status,'PIXEL_FIRST_HIT_UNRESOLVED');
  assert.equal(combinePixelReceipts(r.slice().reverse()).status,'SOURCE_BOUND_MATCHED_PIXEL_MODE_SET_NOT_ANDROID_FIRST_HIT');
});

test('tampered material fields and bit-flags cannot become a valid compound receipt',()=>{
  const r=received();
  assert.equal(combinePixelReceipts(r.map((x,i)=>i===0?{...x,role:231}:x)).status,'PIXEL_FIRST_HIT_UNRESOLVED');
  assert.equal(combinePixelReceipts(r.map((x,i)=>i===1?{...x,primitiveHigh:249}:x)).status,'PIXEL_FIRST_HIT_UNRESOLVED');
  assert.equal(decodeModePixel(3,[243,2,254,255]).status,'PIXEL_INVALID_GROUNDCOVER_FLAG');
  assert.equal(decodeModePixel(7,[247,129,254,255]).status,'PIXEL_INVALID_GROUNDCOVER_FLAG');
  assert.equal(decodeModePixel(3,[243,3,255,255]).status,'PIXEL_CORRECTED_ATLAS_INVALID');
});

test('reject source, instrument, pose, asset, pixel, draw, viewport and camera drift',()=>{
  const r=received();
  const changes=[
    {sourceHead:TARGETS.candidate.head},{instrumentedSha256:'b'.repeat(64)},
    {poseId:'different'}, {assetSignature:'different'}, {drawSignature:'different'},
    {pixel:[202,350]},{viewport:[385,688]},{cameraPosition:[120,8.9,-394.8]},
    {viewProjectionMatrix:Array.from({length:16},()=>1)}
  ];
  for(const change of changes){
    const mutant=decodeModePixel(7,pixels[7],capture(7,change));
    assert.equal(combinePixelReceipts([...r.slice(0,6),mutant]).status,'PIXEL_FIRST_HIT_UNRESOLVED');
  }
});

test('malformed capture or invalid applied diagnostic mode never grants correspondence',()=>{
  const invalid=[
    {appliedMode:2},{readbackClass:'WEBGL2_SCREENSHOT'},{webgl2:false},
    {webglErrors:['INVALID_ENUM']},{viewport:[0,688]},{pixel:[384,350]},
    {instrumentedSha256:'wrong'},{rendererObjectId:TARGETS.candidate.rendererBlob},
    {viewProjectionMatrix:[0]}, {assetSignature:''}
  ];
  for(const change of invalid){
    const r=decodeModePixel(1,pixels[1],capture(1,change));
    assert.equal(r.provenance,null);
    assert.equal(combinePixelReceipts([r,...received().slice(1)]).status,'PIXEL_FIRST_HIT_UNRESOLVED');
  }
});

test('GPU coordinates outside precision range are explicit failures, not clipped positions',()=>{
  for(const mode of [4,5,6]){
    assert.equal(decodeModePixel(mode,[248,mode,0,255]).status,'PIXEL_COORDINATE_OUT_OF_RANGE');
    assert.equal(decodeModePixel(mode,[248,mode+1,0,255]).status,'UNATTRIBUTED_PIXEL_NOT_FROM_PROBED_GEOMETRY');
    assert.equal(decodeModePixel(mode,[240+mode,0,0,255]).status,'PIXEL_COORDINATE_RANGE_AMBIGUOUS');
    assert.equal(decodeModePixel(mode,[240+mode,255,255,255]).status,'PIXEL_COORDINATE_RANGE_AMBIGUOUS');
  }
  const t=transform();assert.match(t.source,/coord > -1024\.0 && coord < 1024\.0/);
});

test('groundcover entry and weight modes must agree',()=>{
  const r=received();
  const noEntry=decodeModePixel(7,[247,0,0,255],capture(7));
  assert.equal(combinePixelReceipts([...r.slice(0,6),noEntry]).status,'PIXEL_FIRST_HIT_UNRESOLVED');
  const nonzero=decodeModePixel(7,[247,129,0,255],capture(7));
  assert.equal(combinePixelReceipts([...r.slice(0,6),nonzero]).status,'PIXEL_FIRST_HIT_UNRESOLVED');
});

test('pixel decoders reject malformed readbacks and mode values',()=>{
 for(const bad of [[241,2,5],[-1,2,3,255],[244.5,2,3,255]])assert.throws(()=>decodeModePixel(1,bad),/READBACK_INVALID/);
 for(const mode of [0,8,1.25])assert.throws(()=>decodeModePixel(mode,[241,1,2,255]),/READBACK_INVALID/);
 assert.equal(MODE_MAGIC[6],246);
});
