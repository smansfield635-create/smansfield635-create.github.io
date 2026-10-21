import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import {buildCavernUnderstoryPlant} from '../../showroom/globe/h-earth/render/geometry-cavern-understory.v1.js';
import {buildCavernUnderstoryPlacement,createCavernThresholdSupport,CAVERN_THRESHOLD_PLACEMENTS,CAVERN_UNDERSTORY_PLACEMENTS} from '../../showroom/globe/h-earth/render/cavern-understory-placement.v1.js';
import {CAVERN_PALM_PLACEMENTS} from '../../showroom/globe/h-earth/render/cavern-palm-placement.v1.js';
import {constructGeologicalRuntimeBridge} from '../../showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js';
import {unprojectPlanetVertex} from '../terrain/h-earth.geological-formation-successor.v1.mjs';
const pkg=JSON.parse(zlib.gunzipSync(fs.readFileSync(new URL('../../showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',import.meta.url)))).canonical;
const model=constructGeologicalRuntimeBridge(pkg),before=model.meshes.map(p=>Buffer.from(p.mesh.positions.buffer).toString('base64'));
const cluster=buildCavernUnderstoryPlacement(model),thresholdSupport=createCavernThresholdSupport(model);
test('all four plant forms are deterministic, attached, and kernel-admitted',()=>{
 for(const kind of ['groundcover','broadleaf','fern','flower']){
  const args={id:'SPECIMEN_'+kind,kind,heading:.41,scale:1.1},a=buildCavernUnderstoryPlant(args);
  assert.deepEqual(a,buildCavernUnderstoryPlant(args));
  assert.ok(a.triangleCount>100&&a.triangleCount<3000);
  for(const c of a.attachments)assert.deepEqual(c.stemTip,c.leafRoot);
  for(const p of a.parts){assert.equal(p.geometry.attributes.colors.length,p.geometry.vertices.length);assert.ok(p.geometry.vertices.every(v=>[v.x,v.y,v.z].every(Number.isFinite)));}
 }
 assert.throws(()=>buildCavernUnderstoryPlant({kind:'unknown'}),/PARAMETERS/);
 assert.throws(()=>buildCavernUnderstoryPlant({kind:'fern',scale:NaN}),/PARAMETERS/);
});
test('original cluster and bilateral threshold stay inside geometry and draw budgets',()=>{
 assert.equal(cluster.receipt.clusterCount,3);assert.equal(cluster.receipt.plantCount,35);
 assert.equal(new Set(cluster.receipt.placements.map(p=>p.kind)).size,4);
 assert.ok(cluster.receipt.triangleCount<=30000);assert.ok(cluster.receipt.gpuByteLength<=2097152);assert.ok(cluster.meshes.length<=3);
 assert.equal(cluster.receipt.perFrameGeneration,false);
 assert.deepEqual(model.meshes.map(p=>Buffer.from(p.mesh.positions.buffer).toString('base64')),before);
});
test('every rendered vertex has real dry terrain or floor support and clears palms',()=>{
 for(const part of cluster.meshes){
  for(let i=0;i<part.mesh.positions.length;i+=3){
   const q=unprojectPlanetVertex(...part.mesh.positions.slice(i,i+3)),ground=q.z<model.site.portalZ?model.sampleOutdoorAt(q.x,q.z):thresholdSupport(q.x,q.z),water=model.sampleWaterAt(q.x,q.z);
   assert.ok(ground&&Number.isFinite(q.y));assert.ok(q.y>=ground.y-.04,'buried foliage');
   assert.ok(!water||water.y<ground.y-.02);
   if(q.z>=model.site.portalZ&&q.y>ground.y+.04)assert.equal(model.formation.rockSolidAt(q.x,q.y,q.z),false,'foliage intersects cave rock');
   assert.ok(!CAVERN_PALM_PLACEMENTS.some(p=>Math.hypot(q.x-p.x,q.z-p.z)<p.radius*1.2+.079));
  }
  assert.ok(part.mesh.indices.every(i=>i<part.mesh.vertexCount));
 }
 for(const c of cluster.contacts){const hit=c.z<model.site.portalZ?model.sampleOutdoorAt(c.x,c.z):thresholdSupport(c.x,c.z);assert.ok(Math.abs(c.rootY-hit.y+.012)<1e-8);}
});
test('missing or submerged terrain prevents construction rather than floating plants',()=>{
 assert.throws(()=>buildCavernUnderstoryPlacement({...model,sampleOutdoorAt:()=>null}),/SUPPORT_MISSING/);
 assert.throws(()=>buildCavernUnderstoryPlacement({...model,sampleWaterAt:()=>({y:100})}),/SUBMERGED/);
});
test('repeated placement produces identical GPU payloads',()=>{
 const second=buildCavernUnderstoryPlacement(model);
 assert.deepEqual(second.receipt,cluster.receipt);
 for(let i=0;i<cluster.meshes.length;i++){assert.deepEqual(second.meshes[i].mesh.positions,cluster.meshes[i].mesh.positions);assert.deepEqual(second.meshes[i].mesh.indices,cluster.meshes[i].mesh.indices);}
});

const BASELINE_ORIGINAL=[
 ['broadleaf',34.55,-265.8,1.05,.3],['broadleaf',33.45,-267.0,.86,2.1],
 ['fern',35.45,-267.2,1.05,.7],['fern',32.7,-268.0,.8,2.8],
 ['flower',34.45,-268.15,1.25,.25],['flower',35.5,-268.6,1.05,1.7],
 ['flower',33.25,-269.0,.95,3.4],
 ['groundcover',33.1,-265.8,.68,.5],['groundcover',32.6,-266.8,.72,1.4],
 ['groundcover',34.8,-267.7,.8,2.2],['groundcover',36.3,-267.9,.68,.9],
 ['groundcover',35.95,-269.1,.75,2.9],['groundcover',34.8,-269.5,.7,4.2],
 ['groundcover',33.8,-269.8,.65,1.2],['groundcover',32.7,-269.6,.55,2.6],
 ['groundcover',32.0,-268.6,.5,3.2],['groundcover',34.0,-268.1,.65,5.4]
];
const BASELINE_THRESHOLD=[
 ['broadleaf',37.9,-262.0,1.15,.25],['broadleaf',42.1,-262.0,1.15,3.0],
 ['broadleaf',38.1,-260.6,1.20,.8],['broadleaf',41.9,-260.6,1.20,3.7],
 ['broadleaf',38.3,-259.35,1.10,1.3],['broadleaf',41.7,-259.3,1.10,4.2],
 ['fern',38.9,-261.6,1.05,.5],['fern',41.1,-261.4,1.05,3.4],
 ['fern',38.8,-259.0,.80,1.1],['fern',41.15,-258.95,.80,4.1],
 ['flower',38.4,-262.2,1.40,.3],['flower',41.6,-262.2,1.30,3.2],
 ['flower',39.5,-260.7,1.35,1.2],['flower',40.6,-260.4,1.20,4.0],
 ['flower',39.3,-259.1,1.15,.7],['flower',40.6,-258.9,1.10,3.5],
 ['groundcover',39.25,-260.1,.8,.9],['groundcover',40.9,-259.8,.8,3.6]
];
// Literal fixtures captured from accepted114431897704; no git dependency at test runtime.
test('all35 roots ids kinds and original17 scale/heading are conserved',()=>{
 const expected=[...BASELINE_ORIGINAL.map(([kind,x,z,scale,heading],i)=>({id:'CAVERN_UNDERSTORY_'+i,kind,x,z,scale,heading})),...BASELINE_THRESHOLD.map(([kind,x,z],i)=>({id:'CAVERN_THRESHOLD_'+i,kind,x,z}))];
 assert.equal(cluster.receipt.placements.length,expected.length);
 for(const [i,e] of expected.entries())for(const [key,value] of Object.entries(e))assert.equal(cluster.receipt.placements[i][key],value,`${e.id}:${key}`);
});
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
test('bloom morphology topology and colors remain rigidly identical to accepted baseline',()=>{
 const flower=buildCavernUnderstoryPlant({id:'SPECIMEN_flower',kind:'flower',heading:.41,scale:1.1}),g=flower.parts.find(p=>p.part==='FLOWERS').geometry;
 assert.equal(g.vertices.length,82);assert.equal(g.indices.length/3,100);
 assert.equal(hash(g.indices),'94f0eee7641f03c9465fcd72b4b2242b3f6996eb60352607c180802a50912692');
 assert.equal(hash(g.attributes.colors),'a97f478b6315b061a36f29d2fa4122135010d2299fff5fe29f8d97772a0ce22d');
 const distances=[];for(let i=0;i<g.vertices.length;i++)for(let j=0;j<i;j++){const a=g.vertices[i],b=g.vertices[j];distances.push(Math.round(Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)*1e6));}
 assert.equal(hash(distances),'b7bbb4df4b0e7f4fa2af42234f5ce83c20bba6f521c451b8124c047981b3417f');
});
test('every projected triangle has a finite nonzero normal',()=>{
 for(const part of cluster.meshes){const {positions:p,indices}=part.mesh,sums=new Float64Array(p.length);assert.ok(p.every(Number.isFinite));
  for(let i=0;i<indices.length;i+=3){const [a,b,c]=Array.from(indices.slice(i,i+3),j=>Array.from(p.slice(j*3,j*3+3))),u=b.map((v,k)=>v-a[k]),v=c.map((v,k)=>v-a[k]);
   const normal=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],length=Math.hypot(...normal);
   assert.ok(Number.isFinite(length)&&length>1e-10,`${part.part} triangle${i/3} degenerates after projection`);
   for(const j of indices.slice(i,i+3))for(let k=0;k<3;k++)sums[j*3+k]+=normal[k];
  }
  for(let i=0;i<sums.length;i+=3)assert.ok(Number.isFinite(Math.hypot(...sums.slice(i,i+3)))&&Math.hypot(...sums.slice(i,i+3))>1e-10,'accumulated vertex normal cancels');
 }
});
test('threshold is planted on both sides and through the central walking line',()=>{
 const roots=cluster.receipt.placements.slice(17);
 assert.equal(roots.length,18);assert.ok(roots.filter(p=>p.x<40).length>=8);assert.ok(roots.filter(p=>p.x>40).length>=8);
 assert.ok(roots.some(p=>p.kind==='flower'&&Math.abs(p.x-40)<.6));
 assert.ok(roots.some(p=>p.z>-260));assert.ok(roots.some(p=>p.z<-260));
 assert.equal(cluster.receipt.navigationModified,false);assert.equal(cluster.receipt.walkThroughBrush,true);
});
test('floor-only support crosses the seam and rejects unavailable floor',()=>{
 const sample=createCavernThresholdSupport(model);
 for(const x of [38.5,39.5,40.5,41.5])for(const z of [-260.05,-259.95,-259.5,-259])assert.ok(Number.isFinite(sample(x,z)?.y),x+','+z);
 const noFloor={...model,meshes:model.meshes.filter(p=>p.role!=='CAVERN_PHYSICAL_SHELL')};
 assert.equal(createCavernThresholdSupport(noFloor)(40,-259),null);
 assert.throws(()=>buildCavernUnderstoryPlacement(noFloor),/SUPPORT_MISSING/);
});
test('flowers face the exterior with varied tilt and rigid heads after terrain placement',()=>{
 const offsets={STEMS:0,FOLIAGE:0},tilts=new Set();
 for(const d of [...CAVERN_UNDERSTORY_PLACEMENTS,...CAVERN_THRESHOLD_PLACEMENTS]){
  const plant=buildCavernUnderstoryPlant(d);
  if(d.kind==='flower'){
   const b=plant.bloom;assert.ok(b&&b.normal.every(Number.isFinite));
   assert.ok(b.normal[2]<-.6,'bloom faces away from approaching viewer');assert.ok(b.normal[1]>0);
   assert.ok(Math.abs(Math.hypot(...b.normal)-1)<1e-10);tilts.add(b.tiltRadians.toFixed(5));
  }
  for(const part of plant.parts){const key=part.leaflets?'FOLIAGE':'STEMS',merged=cluster.meshes.find(p=>p.part===key),g=part.geometry;
   if(Number.isInteger(part.rigidBloomStart)){const start=part.rigidBloomStart,a=g.vertices[start],at=(j)=>unprojectPlanetVertex(...merged.mesh.positions.slice((offsets[key]+j)*3,(offsets[key]+j)*3+3)),wa=at(start);
    for(let j=start+1;j<g.vertices.length;j++){const b=g.vertices[j],wb=at(j),local=Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z),placed=Math.hypot(wa.x-wb.x,wa.y-wb.y,wa.z-wb.z);assert.ok(Math.abs(local-placed)<.004,`${d.id} head sheared by terrain`);}
   }
   offsets[key]+=g.vertices.length;
  }
 }
 assert.ok(tilts.size>=3,'all flowers share identical tilt');
});
test('leaf detail is curved raised geometry with attached roots and tonal veins',()=>{
 for(const kind of ['broadleaf','fern','groundcover','flower']){
  const plant=buildCavernUnderstoryPlant({id:'DETAIL_'+kind,kind}),g=plant.parts.find(p=>p.part==='LEAVES').geometry;
  assert.ok(plant.leafDetails.length>0);
  for(const d of plant.leafDetails){
   assert.ok(d.rows>=3&&d.columns>=3);assert.ok(d.veinRows.length>=1);
   const root=g.vertices[d.vertexStart],tip=g.vertices[d.vertexStart+1],edge=g.vertices[d.vertexStart+2],u=[tip.x-root.x,tip.y-root.y,tip.z-root.z],v=[edge.x-root.x,edge.y-root.y,edge.z-root.z],n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],norm=Math.hypot(...n);
   let curvature=0,ribRelief=0,veinRelief=0;
   for(const p of g.vertices.slice(d.vertexStart,d.vertexStart+d.vertexCount))curvature=Math.max(curvature,Math.abs((p.x-root.x)*n[0]+(p.y-root.y)*n[1]+(p.z-root.z)*n[2])/norm);
   for(let row=0;row<d.rows;row++){const start=d.vertexStart+2+row*d.columns,a=g.vertices[start],b=g.vertices[start+d.columns-1],mid=g.vertices[start+(d.columns-1)/2];ribRelief=Math.max(ribRelief,Math.abs(mid.y-(a.y+b.y)/2));
    if(d.columns===5&&d.veinRows.includes(row+1)){const quarter=g.vertices[start+1];veinRelief=Math.max(veinRelief,Math.abs(quarter.y-(a.y+mid.y)/2));}
   }
   assert.ok(curvature>.001,'leaf remains planar');assert.ok(ribRelief>.0001,'no geometric midrib');
   if(d.columns===5)assert.ok(veinRelief>.0001,'no branch vein relief');
   assert.ok(new Set(g.attributes.colors.slice(d.vertexStart,d.vertexStart+d.vertexCount).map(c=>JSON.stringify(c))).size>4);
   assert.ok(plant.attachments.some(a=>Math.hypot(root.x-a.leafRoot[0],root.y-a.leafRoot[1],root.z-a.leafRoot[2])<1e-10),'detail root disconnected');
  }
 }
});
test('outer threshold broadleaves do not pierce neighboring flower heads',()=>{
 const offsets={STEMS:0,FOLIAGE:0},selected=new Map();
 for(const d of [...CAVERN_UNDERSTORY_PLACEMENTS,...CAVERN_THRESHOLD_PLACEMENTS])for(const part of buildCavernUnderstoryPlant(d).parts){
  const key=part.leaflets?'FOLIAGE':'STEMS',g=part.geometry,merged=cluster.meshes.find(p=>p.part===key);
  if((['CAVERN_THRESHOLD_0','CAVERN_THRESHOLD_1'].includes(d.id)&&part.part==='LEAVES')||(['CAVERN_THRESHOLD_10','CAVERN_THRESHOLD_11'].includes(d.id)&&part.part==='FLOWERS')){
   const vs=g.vertices.map((_,j)=>{const q=unprojectPlanetVertex(...merged.mesh.positions.slice((offsets[key]+j)*3,(offsets[key]+j)*3+3));return[q.x,q.y,q.z];}),triangles=[];
   for(let i=0;i<g.indices.length;i+=3){const p=g.indices.slice(i,i+3).map(j=>vs[j]);triangles.push({p,min:[0,1,2].map(k=>Math.min(...p.map(v=>v[k]))),max:[0,1,2].map(k=>Math.max(...p.map(v=>v[k])))});}selected.set(d.id,triangles);
  }
  offsets[key]+=g.vertices.length;
 }
 const sub=(a,b)=>a.map((v,i)=>v-b[i]),dot=(a,b)=>a.reduce((sum,v,i)=>sum+v*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const pierces=(a,b,t)=>{const direction=sub(b,a),e1=sub(t[1],t[0]),e2=sub(t[2],t[0]),h=cross(direction,e2),det=dot(e1,h);if(Math.abs(det)<1e-12)return false;
  const s=sub(a,t[0]),u=dot(s,h)/det;if(u<1e-5||u>1-1e-5)return false;
  const q=cross(s,e1),v=dot(direction,q)/det;if(v<1e-5||u+v>1-1e-5)return false;
  const along=dot(e2,q)/det;return along>1e-5&&along<1-1e-5;
 };
 for(const [leaf,flower] of [[0,10],[1,11]])for(const a of selected.get('CAVERN_THRESHOLD_'+leaf))for(const b of selected.get('CAVERN_THRESHOLD_'+flower)){
  if([0,1,2].some(k=>a.min[k]>b.max[k]||a.max[k]<b.min[k]))continue;
  assert.ok(![0,1,2].some(k=>pierces(a.p[k],a.p[(k+1)%3],b.p)||pierces(b.p[k],b.p[(k+1)%3],a.p)),`threshold${leaf} leaf pierces flower${flower}`);
 }
});
