import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {transformExactRenderer,gitBlobSha,decodeModePixel,combinePixelReceipts,MODE_MAGIC,TARGETS} from './h-earth-first-hit-material-overlay.mjs';

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
 assert.equal(gitBlobSha(value),git);
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

test('combiner requires all seven distinct complete probes',()=>{
 const r=[{mode:1,role:1,primitiveLow:49},{mode:2,primitiveHigh:242,surfaceClass:7},{mode:3,correctedAtlas:2},
 {mode:4,worldCoordinate:12},{mode:5,worldCoordinate:5},{mode:6,worldCoordinate:-465},
 {mode:7,groundcoverBlockEntered:true,groundcoverWeight:0.47}].map(o=>({status:'VALID_PROBED_GEOMETRY',...o}));
 const hit=combinePixelReceipts(r);
 assert.equal(hit.status,'SOURCE_BOUND_GPU_PROBE_COMPLETE_NOT_ANDROID_FIRST_HIT');
 assert.equal(hit.primitiveIndex,62001);
 assert.equal(hit.physicalOwnerImageParity,false);
 assert.equal(combinePixelReceipts(r.slice(1)).status,'PIXEL_FIRST_HIT_UNRESOLVED');
 assert.equal(combinePixelReceipts([...r.slice(0,6),r[5]]).status,'PIXEL_FIRST_HIT_UNRESOLVED');
});

test('pixel decoders reject malformed readbacks and mode values',()=>{
 for(const bad of [[241,2,5],[-1,2,3,255],[244.5,2,3,255]])assert.throws(()=>decodeModePixel(1,bad),/READBACK_INVALID/);
 for(const mode of [0,8,1.25])assert.throws(()=>decodeModePixel(mode,[241,1,2,255]),/READBACK_INVALID/);
 assert.equal(MODE_MAGIC[6],246);
});
