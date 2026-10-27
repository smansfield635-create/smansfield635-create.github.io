import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=process.env.SEAM_REPO_ROOT??path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const helper=process.env.SEAM_HELPER??path.join(root,'showroom/globe/h-earth/render/terrain-seam-normal.v1.js');
const {createTerrainSeamPresentation}=await import(helper);
const {createHEarthRun8ER2DCanonicalGPUUploadViews,getHEarthSignedCoastDistanceMeters}=await import(path.join(root,'showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js'));
const bytes=fs.readFileSync(path.join(root,'showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz'));
assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a');
const freeze=value=>{if(value&&typeof value==='object'){for(const item of Object.values(value))freeze(item);Object.freeze(value);}return value;};
const pkg=freeze(JSON.parse(zlib.gunzipSync(bytes)).canonical),views=createHEarthRun8ER2DCanonicalGPUUploadViews(pkg,{enableWoodlandClearing:true});
const source=fs.readFileSync(path.join(root,'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js'),'utf8');
const contactSource=source.slice(source.indexOf('function* createExposedWaterContactFieldSteps('),source.indexOf('\n\nasync function yieldToBrowserPaint'));
const it=Function(contactSource+'; return createExposedWaterContactFieldSteps;')()(views,pkg.primitiveSpans);let stage;do{stage=it.next();}while(!stage.done);
const contactDistances=stage.value.packageDistances,coastDistances=new Float32Array(views.positions.length/3);
for(const s of pkg.primitiveSpans.filter(s=>s.role==='TERRAIN'||s.primitiveId==='H_EARTH_WORLD_MANIFOLD:FAR_LAND_CONTINUATION'))for(let i=s.vertexStart;i<s.vertexStart+s.vertexCount;i++){
 const[x,y,z]=views.positions.slice(i*3,i*3+3),h=Math.hypot(x,z),k=h>Number.EPSILON?Math.atan2(h,y+420000)*420000/h:0;coastDistances[i]=getHEarthSignedCoastDistanceMeters(x*k,z*k);
}
const input={...views,coastDistances,contactDistances,primitiveSpans:pkg.primitiveSpans};
const hash=a=>crypto.createHash('sha256').update(Buffer.from(a.buffer,a.byteOffset,a.byteLength)).digest('hex');
const original=Object.fromEntries(Object.entries(input).filter(([,a])=>ArrayBuffer.isView(a)).map(([k,a])=>[k,hash(a)]));
const output=createTerrainSeamPresentation(input);
const near=pkg.primitiveSpans.find(s=>s.role==='TERRAIN'),far=pkg.primitiveSpans.find(s=>s.primitiveId==='H_EARTH_WORLD_MANIFOLD:FAR_LAND_CONTINUATION');
function boundary(span){const hits=new Map();for(let k=span.indexStart;k<span.indexStart+span.indexCount;k+=3){const ids=views.indices.slice(k,k+3);for(let j=0;j<3;j++){const edge=[ids[j],ids[(j+1)%3]].sort((a,b)=>a-b),key=edge.join(',');hits.set(key,{edge,count:(hits.get(key)?.count??0)+1});}}return [...hits.values()].filter(x=>x.count===1).map(x=>x.edge);}
const nearEdges=boundary(near),farEdges=boundary(far),point=i=>Array.from(views.positions.slice(i*3,i*3+3));
// Independent oracle: project onto the authored near boundary and sample its
// unchanged upload attributes; test several points along every matching edge.
function oracle(p){let best=null;for(const [a,b] of nearEdges){const pa=point(a),pb=point(b),d=pb.map((x,j)=>x-pa[j]),den=d.reduce((s,x)=>s+x*x,0),t=Math.max(0,Math.min(1,p.reduce((s,x,j)=>s+(x-pa[j])*d[j],0)/den)),residual=Math.hypot(...p.map((x,j)=>x-pa[j]-t*d[j]));if(!best||residual<best.residual)best={a,b,t,residual};}return best;}
const matched=new Set();let maxNormalError=0,maxContactError=0,maxCoastError=0,edgeCount=0;
for(const id of new Set(farEdges.flat())){const p=point(id),o=oracle(p),tolerance=Math.max(1e-6,2*Math.max(...p.map(Math.abs))*2**-23);if(o.residual<=tolerance)matched.add(id);}
for(const [a,b] of farEdges){if(!matched.has(a)||!matched.has(b))continue;edgeCount++;for(const t of [0,.125,.25,.5,.75,.875,1]){
 const p=point(a).map((x,j)=>x*(1-t)+point(b)[j]*t),o=oracle(p);
 for(let j=0;j<3;j++){const target=views.normals[o.a*3+j]*(1-o.t)+views.normals[o.b*3+j]*o.t,actual=-(output.normals[a*3+j]*(1-t)+output.normals[b*3+j]*t);maxNormalError=Math.max(maxNormalError,Math.abs(target-actual));}
 for(const [name,record] of [['contactDistances','contact'],['coastDistances','coast']]){const target=input[name][o.a]*(1-o.t)+input[name][o.b]*o.t,actual=output[name][a]*(1-t)+output[name][b]*t,error=Math.abs(target-actual);if(record==='contact')maxContactError=Math.max(maxContactError,error);else maxCoastError=Math.max(maxCoastError,error);}
}}
test('actual shared near/far boundary agrees at vertices and edge interiors',()=>{assert.equal(matched.size,349);assert.equal(edgeCount,348);assert.ok(maxNormalError<1e-6,`${maxNormalError}`);assert.ok(maxContactError<1e-4,`${maxContactError}`);assert.ok(maxCoastError<1e-3,`${maxCoastError}`);});
test('canonical arrays and all nonseam attributes remain byte-identical',()=>{for(const[k,digest]of Object.entries(original))assert.equal(hash(input[k]),digest,k);for(let i=0;i<views.positions.length/3;i++)if(!matched.has(i)){for(let j=0;j<3;j++)assert.equal(output.normals[i*3+j],views.normals[i*3+j]);assert.equal(output.contactDistances[i],contactDistances[i]);assert.equal(output.coastDistances[i],coastDistances[i]);}});
test('no additional GPU storage and finite, inward far normals',()=>{for(const k of ['normals','coastDistances','contactDistances'])assert.equal(output[k].byteLength,input[k].byteLength);for(const i of matched){const n=output.normals.slice(i*3,i*3+3);assert.ok(n.every(Number.isFinite)&&Math.hypot(...n)>.1&&n[1]<0);}assert.equal(output.receipt.matchedVertices,349);});
test('missing primitive identity fails before producing a candidate',()=>{assert.throws(()=>createTerrainSeamPresentation({...input,primitiveSpans:[]}));});
console.log(JSON.stringify({schema:'H_EARTH_TERRAIN_SEAM_NUMERICAL_QUALIFICATION_v1',matchedVertices:matched.size,matchedEdges:edgeCount,maxNormalComponentError:maxNormalError,maxContactDistanceErrorMeters:maxContactError,maxCoastDistanceErrorMeters:maxCoastError,sourceAssetSha256:hash(new Uint8Array(bytes)),gpuRenderVerified:false,ownerVisualAcceptance:false}));
