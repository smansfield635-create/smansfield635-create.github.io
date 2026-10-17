import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {buildLargeP2BoulderPresentation,identifyLargeP2RockSource,suppressLargeP2SourceRockTriangles} from '../../showroom/globe/h-earth/render/large-p2-boulder-presentation.v1.js';
import {buildHEarthGrassTrialTerrainIndex as terrainIndex,sampleHEarthGrassTrialTerrain as sample,buildHEarthOasisConnectedBasinIndex} from '../../showroom/globe/h-earth/render/grass-lowland-trial.js';
import {H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY as estate,sampleHEarthGen311PlacementStructureDisposition as structureAt} from '../environment/h-earth.gen2514-qualified-placement-authority.js';
const bytes=readFileSync(new URL('../../showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',import.meta.url));
assert.equal(createHash('sha256').update(bytes).digest('hex'),'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a');
const decoded=JSON.parse(gunzipSync(bytes));assert(Array.isArray(decoded.raw.buffers.positions));
const raw=decoded.raw;for(const key of Object.keys(raw.buffers))raw.buffers[key]=key==='indices'?Uint32Array.from(raw.buffers[key]):Float32Array.from(raw.buffers[key]);
raw.clearingAttributes=Float32Array.from(raw.clearingAttributes);
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex'),before=digest(raw),source=identifyLargeP2RockSource(raw),out=buildLargeP2BoulderPresentation(raw);
const bounds={minX:-30,maxX:46,minZ:-216,maxZ:-119},terrain=terrainIndex(raw,bounds),water=terrainIndex(raw,bounds,true),basin=buildHEarthOasisConnectedBasinIndex(raw);
const distanceToSegment=(p,a,b)=>{const dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz)));return Math.hypot(p.x-a.x-t*dx,p.z-a.z-t*dz);};

test('real SHA-verified uploaded world preserves 14 source identities and every small-rock index',()=>{
 assert.equal(out.records.length,14);assert.equal(new Set(out.records.map(r=>r.originalRockId)).size,14);
 assert.deepEqual(out.records.map(r=>r.originalRockId).sort(),source.rocks.map(r=>r.originalRockId).sort());
 assert.equal(out.suppressedTriangleOffsets.length,336);assert.equal(out.protectedSmallTriangleOffsets.length,224);
 const hidden=suppressLargeP2SourceRockTriangles(raw.buffers.indices,out),large=new Set(out.suppressedTriangleOffsets);
 for(let j=0;j<hidden.length;j+=3){if(large.has(j)){assert.equal(hidden[j],hidden[j+1]);assert.equal(hidden[j],hidden[j+2]);}else assert.deepEqual(Array.from(hidden.slice(j,j+3)),Array.from(raw.buffers.indices.slice(j,j+3)));}
 assert.equal(digest(raw),before);
});

test('all rocks occupy mountain-backed submerged beds and cross the actual waterline',()=>{
 assert.equal(basin.wetCellCount,1638);assert.equal(out.receipt.waterGeometryChanged,false);
 const exposures=[];
 for(const r of out.records){
  const p=r.presentationCenter,w=r.bankWitness;assert.equal(w.waterPrimitive,'FAR_OCEAN_CONTINUATION');assert.deepEqual(w.connectedSeed,{x:-6,z:-164});
  assert(basin.wetCells.some(q=>q.x===w.nearestWetCell.x&&q.z===w.nearestWetCell.z));
  assert(p.z<=-172,'Beach-facing basin left clear');
  const t=sample(terrain,p.x,p.z),v=sample(water,p.x,p.z);assert(t&&v);assert(t.y<v.y-.05);
  assert(Math.abs(t.y-p.y)<1e-6);assert(Math.abs(w.centerSubmerged.depth-(v.y-t.y))<1e-6);
  const uphill=sample(terrain,w.uphillSource.x,w.uphillSource.z);assert(uphill);
  assert(Math.abs(uphill.y-w.uphillSource.terrainY)<1e-6);
  assert(w.uphillSource.z<p.z-4,'Source relief faces inland mountain');
  assert(uphill.y-t.y>=3);assert(Math.abs(Math.hypot(w.uphillSource.x-p.x,w.uphillSource.z-p.z)-12)<1e-5);
  assert.equal(w.submergedPerimeter.length,12);
  for(const q of [...r.terrainContactWitnesses,...w.submergedPerimeter]){
   const bed=sample(terrain,q.x,q.z),waterline=sample(water,q.x,q.z);assert(bed&&waterline);
   assert(bed.y<waterline.y-.05,'Submerged bed footprint required');
   assert(Math.abs(bed.y-q.terrainY)<1e-6);
   if('meshY'in q){assert(q.meshY<bed.y);assert(q.meshY<waterline.y);assert(q.burial>0&&q.burial<.181);}
  }
  const start=r.vertexStart,end=start+r.vertexCount;let above=0,below=0;
  for(let i=start;i<end;i++){const x=out.positions[i*3],y=out.positions[i*3+1],z=out.positions[i*3+2],waterline=sample(water,x,z);assert(waterline);if(y>waterline.y)above++;else below++;}
  assert(above>0&&below>0,'Stone must intersect water surface');
  const top=out.positions[(end-1)*3+1];assert(top>v.y+.5);exposures.push(top-v.y);
  assert(Math.hypot(p.x-r.sourceCenter.x,p.z-r.sourceCenter.z)>10);
 }
 assert(Math.max(...exposures)-Math.min(...exposures)>.25,'Visible exposures must vary');
});

test('source geometry census, pair separation, tree/estate holds, and foot route remain respected',()=>{
 for(const [i,r] of out.records.entries()){
  const p=r.presentationCenter,a=r.authoredCenter,structure=structureAt(a.x,a.z);assert.equal(structure.hardExclusions.length,0);assert.equal(structure.planningHolds.length,0);
  for(const box of [estate.manorCore,estate.gardens,estate.outbuildingProposal,estate.acceptedEnvelope])assert(Math.hypot(a.x-Math.max(box.minX,Math.min(box.maxX,a.x)),a.z-Math.max(box.minZ,Math.min(box.maxZ,a.z)))>=r.radius+1);
  for(let k=1;k<estate.footRoute.length;k++)assert(distanceToSegment(a,estate.footRoute[k-1],estate.footRoute[k])>=estate.footRouteRadius+r.radius+1);
  for(const q of raw.landscapeCoverFootprints??[])assert(Math.hypot(p.x-q.x,p.z-q.z)>=q.radius+r.radius+.6);
  for(const q of raw.landscapeFloorFootprints??[])assert(Math.hypot(p.x-q.x,p.z-q.z)>=q.trunkRadius+r.radius+1);
  for(const q of out.records.slice(i+1))assert(Math.hypot(p.x-q.presentationCenter.x,p.z-q.presentationCenter.z)>=r.radius+q.radius+.35-1e-6);
  assert.equal(r.vertexCount,62);assert.equal(r.indexCount/3,120);
 }
 assert.equal(out.positions.length/3,868);assert.equal(out.indices.length/3,1680);
 // Same complete per-vertex allocation as renderer initializeLargeP2Boulders:
 const gpuBytes=out.positions.byteLength+out.normals.byteLength+out.baseColorsLinear.byteLength+out.indices.byteLength+(out.positions.length/3)*(16+1+1+2+1+4+4);assert.equal(gpuBytes,80052);assert(gpuBytes<=92000);
 for(let j=0;j<out.indices.length;j+=3){const [a,b,c]=Array.from(out.indices.slice(j,j+3),i=>Array.from(out.positions.slice(i*3,i*3+3))),u=b.map((v,k)=>v-a[k]),v=c.map((q,k)=>q-a[k]),area=Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]);assert(area>1e-9);}
 assert(Array.from(out.normals).every(Number.isFinite));assert.equal(digest(raw),before);
});

test('bank placement is deterministic across repeated construction',()=>{const second=buildLargeP2BoulderPresentation(raw);assert.deepEqual(second.records,out.records);assert.deepEqual(second.positions,out.positions);assert.deepEqual(second.baseColorsLinear,out.baseColorsLinear);assert.equal(digest(raw),before);});
