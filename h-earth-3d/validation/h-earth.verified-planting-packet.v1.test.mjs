import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {gunzipSync} from 'node:zlib';
import {createHash,webcrypto} from 'node:crypto';
const sourceDir=process.env.H_EARTH_PLANTING_SOURCE_DIR||path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../showroom/globe/h-earth/render');
const read=name=>fs.readFileSync(path.join(sourceDir,name),'utf8');
const src=read('live-render-package.run8e-r2.js'),canon=read('live-render-package.run8e-r2.canonical.js'),grass=read('woodland-fine-grass.v1.js');
const packet=read('verified-planting-packet.v1.js');
const trees=JSON.parse(packet.match(/H_EARTH_VERIFIED_PLANTING_TREES = Object.freeze\((\[.*\])\.map\(Object.freeze\)\)/)[1]);
const identity=JSON.parse(packet.match(/H_EARTH_VERIFIED_PLANTING_PACKET = Object.freeze\((\{.*\})\);/)[1]);
const world=fs.readFileSync(process.env.H_EARTH_EXACT_WORLD_BINARY||path.join(sourceDir,'assets/h-earth-canonical-base-world.v1.json.gz'));
assert.equal(createHash('sha256').update(world).digest('hex'),'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a');
const value=JSON.parse(gunzipSync(world)),base=value.raw;
for(const pkg of [value.raw,value.canonical]){Object.values(pkg.buffers).forEach(Object.freeze);Object.freeze(pkg.buffers);Object.freeze(pkg.primitiveSpans);Object.freeze(pkg.drawRanges);}
// Execute exact adapter/evaluator bodies without regenerating the world or census.
const prelude=src.slice(src.indexOf('function createHashWriter()'),src.indexOf('export function buildHEarthRun8ER2ImmutableLiveRenderPackage'));
const evaluate=src.slice(src.indexOf('function* evaluatePackageChecks('),src.indexOf('export async function adoptHEarthRun8ER2DeferredLiveRenderPackage')).replaceAll('export ','');
const adapter=src.slice(src.indexOf('export function applyHEarthVerifiedPlantingPackage('),src.indexOf('let cachedDeferredPackage = null;')).replaceAll('export ','');
const context={H_EARTH_VERIFIED_PLANTING_TREES:trees,H_EARTH_VERIFIED_PLANTING_PACKET:identity,H_EARTH_RUN_8E_R2_CONTRACT_ID:base.contractId,H_EARTH_RUN_8E_PACKET_002_TRANSFER_CONTRACT_ID:base.sourceAuthorities.packet002TransferContractId,H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID:base.sourceAuthorities.run8CMaterialContractId,H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID:base.sourceAuthorities.atmosphereContractId,H_EARTH_RUN_8E_R2_HISTORICAL_OCCURRENCE_ID:'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_OCCURRENCE_001',finite:Number.isFinite,freezeArray:x=>Object.freeze(Array.from(x)),freezeRecord:Object.freeze};
const apply=Function(...Object.keys(context),prelude+evaluate+adapter+'\nreturn applyHEarthVerifiedPlantingPackage;')(...Object.values(context));
const integrated=apply(base),canonical=apply(base,{canonicalBase:value.canonical});

test('adapter adds exact saved four tree IDs/spans and preserves original buffers',()=>{
 assert.equal(integrated.landscapeFloorFootprints.length,8);
 assert.deepEqual(integrated.landscapeFloorFootprints.slice(0,4),base.landscapeFloorFootprints);
 assert.equal(integrated.primitiveCount,base.primitiveCount+8);
 assert.equal(integrated.primitiveSpans.filter(s=>s.primitiveId.startsWith('H_EARTH_LANDSCAPE_P2_')||s.plantingTreeId).reduce((n,s)=>n+s.triangleCount,0),79052);
 assert(identity.counts.total<=600000&&identity.counts.ravine<=150000&&identity.counts.total*16<=9600000);
 for(const [name,old] of Object.entries(base.buffers))assert.deepEqual(integrated.buffers[name].slice(0,old.length),old,name);
 for(const tree of trees){
  const spans=integrated.primitiveSpans.filter(s=>s.plantingTreeId===tree.id);assert.equal(spans.length,2);assert(spans.every(s=>s.templateTreeId===tree.templateId));
  const floor=integrated.landscapeFloorFootprints.find(t=>t.id===tree.id),cover=integrated.landscapeCoverFootprints.find(t=>t.id===tree.id);
  assert.equal(floor.x,tree.x);assert.equal(floor.z,tree.z);assert.equal(floor.grassExclusionRadius,2.108);assert.equal(cover.radius+.10,2.108);
 }
 assert.equal(apply(integrated),integrated,'adapter must be idempotent');
 console.log(JSON.stringify({check:'TREE_ADAPTER',trees:8,addedSpans:8,addedTriangles:integrated.triangleCount-base.triangleCount}));
});
test('generated canonicalization and precomputed adapter agree on all numeric buffers',()=>{
 const float=new Set(['positions','normals','baseColorsLinear','materialParameters']);
 for(const [name,values] of Object.entries(integrated.buffers)){
  const expected=float.has(name)?values.map(v=>{const n=Math.round(v*16777216)/16777216;return Object.is(n,-0)?0:n;}):values;
  assert.deepEqual(canonical.buffers[name],expected,name);
  assert.deepEqual(canonical.buffers[name].slice(0,value.canonical.buffers[name].length),value.canonical.buffers[name],name+' preserved prefix');
 }
 assert.equal(canonical.revision,2);
});
test('actual hydration body invokes the same adapter and keeps packet verification',async()=>{
 let body=canon.slice(canon.indexOf('async function hydratePrecomputedBaseWorld()'),canon.indexOf('// GEN2666_HYDRATION_END')).replaceAll('import.meta.url',JSON.stringify('file:///fixture/live-render-package.run8e-r2.canonical.js'));
 const hydrate=Function('applyHEarthVerifiedPlantingPackage','fetch','crypto',body+';return hydratePrecomputedBaseWorld;')(apply,async()=>new Response(world),webcrypto);
 const hydrated=await hydrate();assert.equal(hydrated.raw.contentDigest,integrated.contentDigest);assert.equal(hydrated.canonical.contentDigest,canonical.contentDigest);
 assert(src.includes('return applyHEarthVerifiedPlantingPackage(packageRecord);'),'generated path must use adapter');
});
test('selected-cell atlas keeps woodland texels and shared explicit clearances',()=>{
 const cells=read('verified-planting-cells.v1.js').replaceAll('export ','');
 const fn=grass.slice(grass.indexOf('export function applyVerifiedPlantingHabitat('),grass.indexOf('/** Presentation-only woodland grass.')).replaceAll('export ','');
 const atlas=Function(cells+fn+';return applyVerifiedPlantingHabitat;')();
 const size=192,pixels=new Uint8Array(size*size*2);for(let i=0;i<pixels.length;i++)pixels[i]=i%251;
 const field={size,width:size*2,height:size,pixels,woodland:{sample:()=>0},ravine:{},receipt:{ravine:{}}},next=atlas(field);
 for(let z=0;z<size;z++)assert.deepEqual(next.pixels.slice(z*size*2,z*size*2+size),pixels.slice(z*size*2,z*size*2+size));
 assert.equal(next.receipt.verifiedPlantingCells,12577);assert.deepEqual(next.ravine.bounds,[-290,-562,79,-242]);
 assert(grass.includes('planWoodlandHabitatCandidates(habitat.woodland??habitat)'));assert(grass.includes('saved=await decodeVerifiedPlantingRoots()'));
 assert(grass.includes('VERIFIED_PLANTING_ROOT_REJECTED'));assert(grass.includes('VERIFIED_PLANTING_TERRAIN_CONTACT_CHANGED'));assert(grass.includes('VERIFIED_PLANTING_POPULATION_MISMATCH'));
 assert(grass.includes('t.grassExclusionRadius??t.radius+.03'));
 const renderer=read('persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js');assert(renderer.includes('t.grassExclusionRadius??t.radius+1.5'));assert(renderer.includes('applyVerifiedPlantingHabitat(await buildWoodlandHabitatField('));
});
