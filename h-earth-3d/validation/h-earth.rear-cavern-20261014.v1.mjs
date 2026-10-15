/** H_EARTH_REAR_CAVERN_GEN2730_SOURCE_GEOMETRY_INDEPENDENT_CHECK_v1
 * Narrow non-visual candidate test: does not verify an enterable cave, real water,
 * owner appearance or actual Android GPU pixels.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const get=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const rendererPath='showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
const renderer=get(rendererPath),marker='H_EARTH_REAR_CAVERN_BOUNDED_PILOT_GEN2730';
const occurrences=(text,needle)=>text.split(needle).length-1;
assert.equal(occurrences(renderer,marker),1,'BOUND_SOURCE_MARKER');
assert.equal(occurrences(renderer,'function buildRearCavernPilotGeometry()'),1);
assert.equal(occurrences(renderer,'function initializeRearCavernPilot()'),1);
assert.equal(occurrences(renderer,'function drawRearCavernPilot()'),1);
assert.equal(occurrences(renderer,'    initializeRearCavernPilot();'),1);
assert.equal(occurrences(renderer,'    drawRearCavernPilot();'),1);
const start=renderer.indexOf('  function buildRearCavernPilotGeometry(){');
const end=renderer.indexOf('  function initializeRearCavernPilot(){');
assert(start>0&&end>start);
const functionSource=renderer.slice(start,end);
const sample=(x,z)=>({valid:Number.isFinite(x)&&Number.isFinite(z),elevation:13.73+0.36*(z+268)+0.025*(x-40)});
const project=({x,y,z})=>({x:x*(1+y/420000),y:y-(x*x+z*z)/(2*420000),z:z*(1+y/420000)});
const make=new Function('regionToHEarthPlanetPoint','sampleHEarthRun8BSuccessorTerrainField',functionSource+';return buildRearCavernPilotGeometry();');
const g=make(project,sample);
assert.equal(g.portal.x,40);assert.equal(g.portal.z,-268);assert.equal(g.portal.facing,'REAR_NEGATIVE_Z');
assert.equal(g.portal.enterable,false);assert.equal(g.canonicalWorldMutated,false);
assert.equal(g.triangleCount,84);assert.equal(g.vertexCount,252);
assert.equal(g.positions.length,g.vertexCount*3);
assert.equal(g.normals.length,g.vertexCount*3);
assert.equal(g.colors.length,g.vertexCount*4);
assert.equal(g.indices.length,g.triangleCount*3);
assert(g.positions.every(Number.isFinite));assert(g.normals.every(Number.isFinite));assert(g.colors.every(Number.isFinite));
assert(g.indices.every((v,i)=>v===i));
const minX=Math.min(...Array.from(g.positions).filter((_,i)=>i%3===0));
const maxX=Math.max(...Array.from(g.positions).filter((_,i)=>i%3===0));
const minZ=Math.min(...Array.from(g.positions).filter((_,i)=>i%3===2));
const maxZ=Math.max(...Array.from(g.positions).filter((_,i)=>i%3===2));
assert(minX>=35&&maxX<=45,'HORIZONTAL_MOUTH_BOUNDED');
assert(minZ>-272&&maxZ< -267,'CAVERN_REAR_FACE_BOUND');
assert(g.colors.some((x,i)=>i%4===0&&x<0.012),'DARK_INTERIOR_PRESENT');
assert(renderer.includes('state.gpuByteLength>32768'));
assert(renderer.includes('gl.drawElements(gl.TRIANGLES,state.geometry.indices.length'));
const rev='rev=gen2730-rear-cavern-pilot-v1';
const chain=[
 'showroom/globe/h-earth/index.html',
 'showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.receipt.js',
 'showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js',
 'showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js',
 '.github/ai-router/publication-surfaces/h-earth.json'
];
for(const file of chain)assert.equal(occurrences(get(file),rev),1,'CACHE_CHAIN:'+file);
const manifest=JSON.parse(get('showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.manifest.json'));
assert.equal(manifest.binary.sha256,'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a');
const result={schema:'H_EARTH_REAR_CAVERN_GEN2730_SOURCE_GEOMETRY_CHECK_v1',result:'PASS_SOURCE_AND_SYNTHETIC_GEOMETRY_ONLY',portal:g.portal,vertexCount:g.vertexCount,triangleCount:g.triangleCount,gpuCeilingBytes:32768,cacheChainFileCount:chain.length,canonicalWorldManifestDigest:manifest.binary.sha256,measuredMeshPixels:false,androidAcceptance:false,ownerVisualAcceptance:false,renderedCavernBuiltOnPublishedWebsite:false};
console.log(JSON.stringify(result,null,2));
