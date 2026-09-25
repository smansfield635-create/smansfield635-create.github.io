import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

const [aRoot,bRoot] = process.argv.slice(2);
if(!aRoot||!bRoot) throw new Error('USAGE: node observer-scale-ab.measure.mjs <A_ROOT> <B_ROOT>');
const rel='showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js';
const pkgRel='showroom/globe/h-earth/render/live-render-package.run8e-r2.js';
const gpuRel='showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js';
const previewRel='showroom/globe/h-earth/render/landscape-preview.js';
const imp=async(root,p)=>import(pathToFileURL(root+'/'+p).href+'?ab='+Date.now());
const A=await imp(aRoot,rel), B=await imp(bRoot,rel);
const a=A.constructHEarthRun8BSuccessorTerrainAndMountain(), b=B.constructHEarthRun8BSuccessorTerrainAndMountain();
assert.equal(a.ok,true); assert.equal(b.ok,true);
const geom=x=>x.primitive.geometry;
const spacing=vals=>vals.slice(1).map((v,i)=>v-vals[i]);
const stats=xs=>{const s=[...xs].sort((a,b)=>a-b),q=p=>s[Math.min(s.length-1,Math.floor((s.length-1)*p))];return {min:s[0],median:q(.5),p95:q(.95),max:s.at(-1)}};
const edgeStats=g=>{const e=[];for(let i=0;i<g.indices.length;i+=3){const vs=[g.vertices[g.indices[i]],g.vertices[g.indices[i+1]],g.vertices[g.indices[i+2]]];for(const [u,v] of [[0,1],[1,2],[2,0]])e.push(Math.hypot(vs[u].x-vs[v].x,vs[u].y-vs[v].y,vs[u].z-vs[v].z));}return stats(e)};
const triArea=(p,q,r)=>{const u=[q.x-p.x,q.y-p.y,q.z-p.z],v=[r.x-p.x,r.y-p.y,r.z-p.z];return .5*Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])};
const envelope=(x)=>{const g=geom(x), verts=g.vertices.filter(v=>Math.hypot(v.x,v.z)<=18), tris=[];for(let i=0;i<g.indices.length;i+=3){const vs=[g.vertices[g.indices[i]],g.vertices[g.indices[i+1]],g.vertices[g.indices[i+2]]];if(vs.some(v=>Math.hypot(v.x,v.z)<=18))tris.push(vs);}return {vertexCount:verts.length,triangleCount:tris.length,facetWorldArea:stats(tris.map(t=>triArea(...t)))}};
const summarize=x=>({full:{vertexCount:x.topology.vertexCount,indexCount:x.topology.indexCount,triangleCount:x.topology.triangleCount},xSpacing:stats(spacing(x.topology.xValues)),zSpacing:stats(spacing(x.topology.zValues)),triangleEdges:edgeStats(geom(x)),envelope:envelope(x)});
const parent=new Map(geom(a).vertices.map(v=>[`${v.x}:${v.z}`,v.y]));let parentMaxDelta=0;for(const v of geom(b).vertices){const y=parent.get(`${v.x}:${v.z}`);if(y!==undefined)parentMaxDelta=Math.max(parentMaxDelta,Math.abs(y-v.y));}
const packageMeasure=async(root)=>{
 const P=await imp(root,pkgRel); const G=await imp(root,gpuRel); const L=await imp(root,previewRel);
 const preview=L.previewHEarthFunctionalLandscape();
 assert.equal(preview.ok,true);
 const presented=preview.componentResults?.terrain?.primitive?.geometry; assert.ok(presented);
 const p=P.buildHEarthRun8ER2ImmutableLiveRenderPackage({packageOccurrenceId:'H_EARTH_OBSERVER_SCALE_AB_MEASUREMENT'});
 assert.equal(p.eligible,true); const terrain=p.primitiveSpans.find(s=>s.role==='TERRAIN'); assert.ok(terrain);
 const views=G.createHEarthRun8ER2DCanonicalGPUUploadViews(p);
 let presentedPackage=0,packageGpu=0;
 const construction=root===aRoot?a:b,g=geom(construction);
 assert.equal(presented.vertices.length,g.vertices.length); assert.equal(presented.indices.length,g.indices.length);
 assert.equal(terrain.vertexCount,presented.vertices.length); assert.equal(terrain.indexCount,presented.indices.length);
 for(let i=0;i<terrain.vertexCount;i++){
   const pv=presented.vertices[i],o=(terrain.vertexStart+i)*3;
   const px=p.buffers.positions[o],py=p.buffers.positions[o+1],pz=p.buffers.positions[o+2];
   const gx=views.positions[o],gy=views.positions[o+1],gz=views.positions[o+2];
   presentedPackage=Math.max(presentedPackage,Math.abs(pv.x-px),Math.abs(pv.y-py),Math.abs(pv.z-pz));
   packageGpu=Math.max(packageGpu,Math.abs(px-gx),Math.abs(py-gy),Math.abs(pz-gz));
 }
 return {rawTerrainVertexCount:g.vertices.length,presentedTerrainVertexCount:presented.vertices.length,terrainVertexCount:terrain.vertexCount,terrainIndexCount:terrain.indexCount,terrainTriangleCount:terrain.triangleCount,maxPresentedToPackagePositionDelta:presentedPackage,maxPackageToGpuFloat32PositionDelta:packageGpu,presentationStages:['GEN311_REGIONAL_RELIEF','SINGLE_SPHERICAL_PRESENTATION']};
};
const distances=[0,2,4,6,8,10,12,14,16,18];
const longitudinal=x=>distances.map(d=>{const candidates=geom(x).vertices.filter(v=>Math.abs(v.x)<=1e-9).sort((p,q)=>Math.abs(Math.abs(p.z)-d)-Math.abs(Math.abs(q.z)-d));const v=candidates[0];return {distance:d,nearestVertex:v?{x:v.x,y:v.y,z:v.z,radialDistance:Math.hypot(v.x,v.z)}:null}});
const receipt={receiptType:'H_EARTH_OBSERVER_SCALE_GEOMETRIC_DEFINITION_AB_MEASUREMENT_v1',A:summarize(a),B:summarize(b),sharedEightUnitParentMaximumElevationDelta:parentMaxDelta,longitudinal:{A:longitudinal(a),B:longitudinal(b)},transport:{A:await packageMeasure(aRoot),B:await packageMeasure(bRoot)},projectedFacetSize:'BROWSER_QUALIFICATION_REQUIRED',issues:[]};
receipt.eligible=receipt.A.xSpacing.min===8&&receipt.A.zSpacing.min===8&&receipt.B.xSpacing.min===4&&receipt.B.zSpacing.min===4&&parentMaxDelta===0&&receipt.transport.A.maxPresentedToPackagePositionDelta===0&&receipt.transport.B.maxPresentedToPackagePositionDelta===0;
if(!receipt.eligible)receipt.issues.push('OBSERVER_SCALE_AB_GATE_FAILED');
console.log(JSON.stringify(receipt,null,2));
