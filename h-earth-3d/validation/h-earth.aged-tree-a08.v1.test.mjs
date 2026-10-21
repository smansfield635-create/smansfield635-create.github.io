import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {previewHEarthFunctionalLandscape} from '../../showroom/globe/h-earth/render/landscape-preview.js';
import {buildHEarthLandscapeSector} from '../../showroom/globe/h-earth/render/geometry-landscape-sector.p2.js';
const BASELINE={
  "baseline": "eb0df9a9a0d1a380b089cb59e2dc22c4e55b488e",
  "ecology": "1e02167f6b75232e5fb29dfe55f0fb3482a5bf311a8e7b1a4508d7ab24d543ce",
  "otherTrees": {
    "P2_TREE_A_03": "bbc5de4550205f0a6f1c06280a4f0db67abd2d0670b4dc679db3bcf905fc5fdc",
    "P2_TREE_A_06": "6d7b8ac0cc67d018460fcfffc916915af80e64a22b7324f744176c02a2926a07",
    "P2_TREE_A_11": "d022f58013ae8416f72f78551c8c537acc5af94f8f3a9b0c801948002c468b5e"
  },
  "nonTreePrimitives": "9622087e6f4e3ba958ec6ad26cfa79620b90f3baf871ad2de9ca24bd1a50eefb",
  "nonTreeManifest": "47f2869ce1112030e1426af3d26c614476c16c8bf3b0560f48bb2d063cae6cae",
  "ecologyDiagnostics": "0ff121ecda963994772a6088377be9b5943054151d366526e7ed08a52126e037",
  "baselineTargetTriangles": 4600
};
const hash=o=>createHash('sha256').update(JSON.stringify(o)).digest('hex');
const sourceHashes=()=>Object.fromEntries(['geometry-aged-woodland-tree.v1.js','geometry-landscape-sector.p2.js'].map(name=>[name,createHash('sha256').update(readFileSync(new URL('../../showroom/globe/h-earth/render/'+name,import.meta.url))).digest('hex')]));
const reviewedSourceHashes=sourceHashes();
const terrain=previewHEarthFunctionalLandscape().componentResults.terrain.primitive,terrainHash=hash(terrain);
const started=performance.now(),sector=buildHEarthLandscapeSector({terrainPrimitive:terrain}),generationMs=performance.now()-started;
const trees=sector.manifest.filter(p=>p.kind==='TREE'),target=trees.find(t=>t.id==='P2_TREE_A_08');
function part(t,kind){
 const p=sector.primitives.find(p=>p.primitiveId.endsWith('_'+kind)),prefix=kind==='BARK'?'bark':'canopy',start=t[prefix+'VertexStart'],count=t[prefix+'VertexCount'],indices=[];
 for(let i=0;i<p.geometry.indices.length;i+=3){const f=p.geometry.indices.slice(i,i+3),inside=f.map(v=>v>=start&&v<start+count);assert.ok(inside.every(Boolean)||inside.every(v=>!v),'cross-tree triangle');if(inside.every(Boolean))indices.push(...f.map(v=>v-start));}
 return{vertices:p.geometry.vertices.slice(start,start+count),indices,colors:p.renderMaterial.vertexRgba.slice(start,start+count),clearing:p.renderMaterial.clearingAttributes.slice(start,start+count),normals:p.geometry.normals.slice(start,start+count)};
}
const bark=part(target,'BARK'),canopy=part(target,'CANOPY');
const targetTriangles=(bark.indices.length+canopy.indices.length)/3;
test('only A08 geometry changes; other3 trees and all non-tree outputs stay exact',()=>{
 assert.equal(sector.eligible,true,JSON.stringify(sector.issues));assert.equal(hash(terrain),terrainHash);
 assert.equal(trees.length,4);
 for(const t of trees.filter(t=>t.id!==target.id))assert.equal(hash(['BARK','CANOPY'].map(k=>part(t,k))),BASELINE.otherTrees[t.id],t.id);
 assert.equal(hash(sector.primitives.filter(p=>!['_BARK','_CANOPY'].some(k=>p.primitiveId.endsWith(k)))),BASELINE.nonTreePrimitives);
 assert.equal(hash(sector.manifest.filter(p=>p.kind!=='TREE')),BASELINE.nonTreeManifest);
 assert.equal(hash({grassTrial:sector.diagnostics.grassTrial,connectedCover:sector.diagnostics.connectedCover}),BASELINE.ecologyDiagnostics);
});
test('all4 identities positions and ecological envelopes are retained',()=>{
 const ecology=trees.map(t=>Object.fromEntries(Object.entries(t).filter(([k])=>!k.endsWith('VertexStart')&&!k.endsWith('VertexCount')&&k!=='support'&&k!=='visualTree')));
 assert.equal(hash(ecology),BASELINE.ecology);
});
test('actual tree meshes have finite nondegenerate faces and finite unit normals',()=>{
 for(const p of [bark,canopy]){
  assert.equal(p.colors.length,p.vertices.length);assert.equal(p.clearing.length,p.vertices.length);assert.equal(p.normals.length,p.vertices.length);
  for(const v of [...p.vertices,...p.normals])assert.ok([v.x,v.y,v.z].every(Number.isFinite));
  for(const n of p.normals)assert.ok(Math.abs(Math.hypot(n.x,n.y,n.z)-1)<1e-6);
  const sums=Array.from({length:p.vertices.length},()=>[0,0,0]);
  for(let i=0;i<p.indices.length;i+=3){const ids=p.indices.slice(i,i+3);assert.ok(ids.every(j=>Number.isInteger(j)&&j>=0&&j<p.vertices.length));const [a,b,c]=ids.map(j=>p.vertices[j]),u=[b.x-a.x,b.y-a.y,b.z-a.z],v=[c.x-a.x,c.y-a.y,c.z-a.z],n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];assert.ok(Math.hypot(...n)>1e-10,'degenerate triangle');for(const j of ids)for(let k=0;k<3;k++)sums[j][k]+=n[k];}
  assert.ok(sums.every(n=>Math.hypot(...n)>1e-10),'summed normal cancellation');
 }
});
test('target and sector stay in admitted budgets with existing draw batches',()=>{
 assert.ok(targetTriangles<=9000);assert.ok(sector.diagnostics.triangleCount<=65052);assert.equal(sector.primitives.length,4);
 assert.deepEqual(sector.primitives.map(p=>p.primitiveId),['H_EARTH_LANDSCAPE_P2_BARK','H_EARTH_LANDSCAPE_P2_CANOPY','H_EARTH_LANDSCAPE_P2_ROCK','H_EARTH_LANDSCAPE_P2_GRASS']);
});
// Independent barycentric sampling of the actual Float32 NEAR mesh.
const supportTriangles=[];
for(let i=0;i<terrain.geometry.indices.length;i+=3){const p=terrain.geometry.indices.slice(i,i+3).map(j=>{const v=terrain.geometry.vertices[j];return{x:Math.fround(v.x),y:Math.fround(v.y),z:Math.fround(v.z)};});if(Math.max(...p.map(v=>v.x))<target.x-8||Math.min(...p.map(v=>v.x))>target.x+8||Math.max(...p.map(v=>v.z))<target.z-8||Math.min(...p.map(v=>v.z))>target.z+8)continue;supportTriangles.push({id:i/3,p});}
function groundAt(x,z){for(const {id,p:[a,b,c]} of supportTriangles){const det=(b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x);if(Math.abs(det)<1e-10)continue;const u=((x-a.x)*(c.z-a.z)-(z-a.z)*(c.x-a.x))/det,v=((b.x-a.x)*(z-a.z)-(b.z-a.z)*(x-a.x))/det;if(u>=-1e-7&&v>=-1e-7&&u+v<=1+1e-7)return{y:a.y+u*(b.y-a.y)+v*(c.y-a.y),id};}return null;}
function walkingDistance(p){const z=Math.max(-230,Math.min(-194,p.z));return Math.hypot(p.x+145,p.z-z);}
test('measured crown is broad and tall while low geometry clears the walking corridor',()=>{
 const xs=canopy.vertices.map(v=>v.x),zs=canopy.vertices.map(v=>v.z),ys=[...bark.vertices,...canopy.vertices].map(v=>v.y),width=Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...zs)-Math.min(...zs)),height=Math.max(...ys)-target.y;
 assert.ok(width>=9&&width<=11,`actual crown width${width}`);assert.ok(height>=12&&height<=14,`actual height${height}`);
 for(const p of bark.vertices){const g=groundAt(p.x,p.z);assert.ok(g,'actual terrain support missing');if(p.y-g.y<2.4)assert.ok(walkingDistance(p)>2.3,'low wood intrudes walking corridor');}
 const radial=canopy.vertices.map(v=>Math.hypot(v.x-target.x,v.z-target.z));assert.ok(Math.max(...radial)>4.5);
});
test('generation is deterministic under reversed candidate ordering',()=>{
 const again=buildHEarthLandscapeSector({terrainPrimitive:terrain,reverseGenerationOrder:true,grassCellOrder:'CHUNKED'});
 assert.equal(hash(again),hash(sector));assert.deepEqual(sourceHashes(),reviewedSourceHashes);
});
test('flared base and every extended root edge are supported by emitted terrain',()=>{
 const support=target.support;assert.equal(support.indexSpace,'TREE_LOCAL_BARK_VERTICES');assert.ok(support.contactEdges.length>=30);assert.ok(support.rootRing.length>=8);
 for(const [ia,ib] of support.contactEdges){const a=bark.vertices[ia],b=bark.vertices[ib];assert.ok(a&&b);
  for(let k=0;k<=8;k++){const t=k/8,x=a.x+(b.x-a.x)*t,z=a.z+(b.z-a.z)*t,y=a.y+(b.y-a.y)*t,g=groundAt(x,z);assert.ok(g);assert.ok(g.y-y>=.11999,'unsupported root edge seam');assert.ok(g.y-y<.8,'root excessively buried');}
 }
 for(const w of support.witnesses){const [a,b]=w.edge.map(i=>bark.vertices[i]),x=a.x+(b.x-a.x)*w.t,z=a.z+(b.z-a.z)*w.t,y=a.y+(b.y-a.y)*w.t,g=groundAt(x,z);assert.ok(g);assert.ok(Math.abs(x-w.x)<1e-9&&Math.abs(z-w.z)<1e-9&&Math.abs(y-w.meshY)<1e-9);assert.ok(Math.abs(g.y-w.surfaceY)<1e-7);}
 const radii=support.rootRing.map(i=>{const p=bark.vertices[i];return Math.hypot(p.x-target.x,p.z-target.z);});assert.ok(Math.max(...radii)-Math.min(...radii)>.1,'base remains regular cylinder');assert.ok(Math.min(...radii)>.7);
 for(const root of target.visualTree.roots){const first=bark.vertices[root.crestIndices[0]],last=bark.vertices[root.crestIndices.at(-1)];assert.ok(Math.hypot(first.x-target.x,first.z-target.z)<Math.min(...radii),'root does not meet trunk');assert.ok(Math.hypot(last.x-target.x,last.z-target.z)>1.4,'root has no extended silhouette');const g=groundAt(last.x,last.z);assert.ok(last.y-g.y>=0&&last.y-g.y<.15,'root tip floats');}
});
test('substantial curved forks start low and crown has uneven layered geometry',()=>{
 const v=target.visualTree;assert.ok(v.structure.primaryPaths.length>=4);assert.equal(v.ecologyEnvelopeChanged,false);assert.equal(v.perFrameGeneration,false);
 const heights=[];
 for(const path of v.structure.primaryPaths){const first=path[0],last=path.at(-1),height=first[1]-target.y;assert.ok(height>=3&&height<=4);heights.push(last[1]-target.y);
  const u=last.map((q,i)=>q-first[i]),length=Math.hypot(...u);let deviation=0;
  for(const p of path.slice(1,-1)){const w=p.map((q,i)=>q-first[i]),t=w.reduce((n,q,i)=>n+q*u[i],0)/(length*length);deviation=Math.max(deviation,Math.hypot(...w.map((q,i)=>q-u[i]*t)));}
  assert.ok(deviation>.15,'primary limb is a straight rod');
  const near=bark.vertices.filter(p=>Math.hypot(p.x-first[0],p.y-first[1],p.z-first[2])<.45);assert.ok(near.length>=6,'fork has no substantial rendered cross section');
 }
 assert.ok(Math.max(...heights)-Math.min(...heights)>1.5,'crown tiers are uniform');
 assert.ok(canopy.clearing.every(a=>a[2]===2&&a[0]>=129/256&&a[0]<=255/256),'existing fuller leaf atlas not reused');
});
function triangleRecords(p){const out=[];for(let i=0;i<p.indices.length;i+=3){const vs=p.indices.slice(i,i+3).map(j=>p.vertices[j]),points=vs.map(v=>[v.x,v.y,v.z]);out.push({points,min:[0,1,2].map(k=>Math.min(...points.map(v=>v[k]))),max:[0,1,2].map(k=>Math.max(...points.map(v=>v[k])))});}return out;}
const sub=(a,b)=>a.map((v,i)=>v-b[i]),dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function pierces(a,b,t){const d=sub(b,a),e1=sub(t[1],t[0]),e2=sub(t[2],t[0]),h=cross(d,e2),det=dot(e1,h);if(Math.abs(det)<1e-12)return false;const s=sub(a,t[0]),u=dot(s,h)/det;if(u<1e-5||u>1-1e-5)return false;const q=cross(s,e1),v=dot(d,q)/det;if(v<1e-5||u+v>1-1e-5)return false;const along=dot(e2,q)/det;return along>1e-5&&along<1-1e-5;}
test('enlarged woody limbs do not pierce neighboring tree wood',()=>{
 const actual=triangleRecords(bark);
 for(const tree of trees.filter(t=>t!==target)){const neighbor=triangleRecords(part(tree,'BARK'));for(const a of actual)for(const b of neighbor){
  if([0,1,2].some(k=>a.min[k]>b.max[k]||a.max[k]<b.min[k]))continue;
  assert.ok(![0,1,2].some(k=>pierces(a.points[k],a.points[(k+1)%3],b.points)||pierces(b.points[k],b.points[(k+1)%3],a.points)),`wood pierces ${tree.id}`);
 }}
});
if(process.env.H_EARTH_AGED_REVIEW_OUTPUT){
 const {writeFileSync}=await import('node:fs');
 writeFileSync(process.env.H_EARTH_AGED_REVIEW_OUTPUT,JSON.stringify({status:'METRICS_ONLY_CHECK_TEST_OUTPUT',sourceHashes:reviewedSourceHashes,baseline:{...BASELINE,metrics:{"head": "eb0df9a9a0d1a380b089cb59e2dc22c4e55b488e", "eligible": true, "issues": [], "ms": 13554.174347, "triangles": 60652, "batches": 4, "vertices": 86272, "gpuArrayBytesEstimate": 5990416}},candidate:{generationMs,sectorTriangles:sector.diagnostics.triangleCount,targetTriangles,batches:sector.primitives.length,vertices:sector.primitives.reduce((n,p)=>n+p.geometry.vertices.length,0),gpuArrayBytesEstimate:sector.primitives.reduce((n,p)=>n+p.geometry.vertices.length*61+p.geometry.indices.length*4,0),gpuEstimateDefinition:'61 bytes per vertex (Float32 position3/normal3/color4/material4; Uint8 model/surface/role; Uint16 primitive) plus Uint32 indices; matches gpu-upload-views transport types, estimate excludes textures',visual:target.visualTree,otherTrees:Object.fromEntries(trees.filter(t=>t!==target).map(t=>[t.id,hash(['BARK','CANOPY'].map(k=>part(t,k)))])),minimumSupportBurial:target.support.minimumMeasuredBurial,minimumLowWoodWalkingDistance:Math.min(...bark.vertices.filter(p=>p.y-groundAt(p.x,p.z).y<2.4).map(walkingDistance))},visualApproval:false},null,2));
}
