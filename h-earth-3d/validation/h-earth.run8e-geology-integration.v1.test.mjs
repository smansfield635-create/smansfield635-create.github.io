import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHEarthFunctionalLandscapeNavigationState,proposeHEarthFunctionalLandscapeNavigation} from '../../showroom/globe/h-earth/functional-landscape/navigation.js';
import {constructGeologicalRuntimeBridge,installGeologicalRuntimeBridge,
  resolveGeologicalRuntimeFootSupport,retireGeologicalBaseIndices,traceGeologicalRuntimeDrainage}
  from '../../showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js';
const home=dirname(fileURLToPath(import.meta.url));
const file=process.env.H_EARTH_EXACT_WORLD_BINARY||join(home,'../../showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz');
let payload;
function canonical(){
 if(!payload){const compressed=readFileSync(file);assert.equal(compressed.length,11736235);
  assert.equal(createHash('sha256').update(compressed).digest('hex'),'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a');
  const decoded=gunzipSync(compressed);assert.equal(decoded.length,51163475);
  payload=JSON.parse(decoded.toString('utf8')).canonical;
  assert.equal(payload.packageIdentity,'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_2F3D0EB2');
 }return payload;
}
let model;
function geology(){return model??=constructGeologicalRuntimeBridge(canonical());}
const part=(role)=>geology().meshes.find(x=>x.role===role)?.mesh;
test('exact Gen2666 compressed source and spherical terrain correspond',()=>{
 const p=canonical();assert.equal(p.buffers.positions.length,330807);
 assert.equal(p.buffers.indices.length,311466);
 assert.equal(geology().formation.minimumRoofCover>0,true);
});
test('upstream real terrain D8 route descends, does not invent freshwater',()=>{
 const route=geology().route;assert(route.path.length>=15);
 assert(route.path.every((v,i)=>i===0||v.height<route.path[i-1].height));
 assert.equal(geology().formation.drainage.waterPresent,false);
});
test('original terrain indices are retired by degeneracy only within declared mask',()=>{
 const c=canonical(),g=geology(),indices=Uint32Array.from(c.buffers.indices),old=indices.slice();
 const revised=retireGeologicalBaseIndices(indices,g.retirement);
 assert.equal(revised.length,indices.length);
 assert.equal(revised.every((v,i)=>i%3===0||!g.retirement.triangleOffsets.includes(i-i%3)||v===revised[i-i%3]),true);
 assert.equal(old.every((v,i)=>indices[i]===v),true);
 assert(g.retirement.triangleCount>=100);
});
test('four real manifold elements are projected to shared spherical world',()=>{
 assert.deepEqual(geology().meshes.map(x=>x.role),['ERODED_TERRAIN','MOUNTAIN_OVERBURDEN','NATURAL_CLIFF_FACE','CAVERN_PHYSICAL_SHELL']);
 for(const {mesh} of geology().meshes){assert(mesh.positions instanceof Float32Array);
 assert(mesh.indices instanceof Uint32Array);assert(mesh.positions.length>0);assert(mesh.indices.length>0);}
});
test('uninstalled physical cave is invisible to normal Gen324 navigation',()=>{
 assert.equal(resolveGeologicalRuntimeFootSupport(80,-261),null);
});
test('active interior uses cave floor/roof, wall collision correctly rejects',()=>{
 installGeologicalRuntimeBridge(geology());
 const inside=resolveGeologicalRuntimeFootSupport(80,-252),solid=resolveGeologicalRuntimeFootSupport(90,-251),coast=resolveGeologicalRuntimeFootSupport(0,-96);
 assert(inside?.eligible);assert(inside.ceilingY>inside.eyeY+0.3);
 assert(solid&&!solid.eligible);assert.equal(coast,null);
});
test('2m replacement terrain has a true aperture and cliff with upper mantle',()=>{
 const p=geology().portal;
 assert(p.retiredReplacementTriangleCount>=32);
 assert.equal(p.rimCorrespondence.sideMaxError,0);
 assert.equal(p.rimCorrespondence.backMaxError,0);
 assert.equal(p.rimCorrespondence.frontCliffBottomOpen,true);
 assert(part('MOUNTAIN_OVERBURDEN').triangleCount>0);
 assert(part('NATURAL_CLIFF_FACE').triangleCount>0);
});
test('runtime renderer/nav source contains actual bridge calls and no Gen2730 arch draw',()=>{
 const r=readFileSync(join(home,'../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js'),'utf8');
 const n=readFileSync(join(home,'../../showroom/globe/h-earth/functional-landscape/navigation.js'),'utf8');
 assert(r.includes('initializeGeologicalRendering();'));
 assert(r.includes('drawGeologicalRendering();'));
 assert(!r.includes('drawRearCavernPilot();'));
 assert(r.includes('retireGeologicalBaseIndices('));
 assert(r.includes('resources.geologicalRuntime.localBounds'));
 assert(n.includes('resolveGeologicalRuntimeFootSupport('));
 assert(n.includes('GEOLOGICAL_UNWALKABLE_STEP_GRADE'));
});

test('real Gen324 locomotion enters roofed cavern through 15 accepted actions',()=>{
  const n=createHEarthFunctionalLandscapeNavigationState({waypointId:'GEOLOGICAL_CAVERN_REAR_APPROACH'});
  assert(n.ok);let state=n.state,entered=false;
  for(let i=0;i<15;i++){const proposal=proposeHEarthFunctionalLandscapeNavigation(state,{action:'MOVE_FORWARD',magnitude:4});
    assert.equal(proposal.ok,true,'MOVE_'+i+':'+proposal.issues);state=proposal.state;
    if(state.geologicalFloorClass==='INTERIOR')entered=true;
  }
  assert(entered);assert(state.position.z>-250);assert(state.geologicalPhysicalSupport);
});
test('original coastal navigation remains original and never reports cave support',()=>{
  const n=createHEarthFunctionalLandscapeNavigationState({waypointId:'COAST'});assert(n.ok);
  assert.equal(n.state.geologicalPhysicalSupport,false);assert.equal(n.state.position.x,0);
});
