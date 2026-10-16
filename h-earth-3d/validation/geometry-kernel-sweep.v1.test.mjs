import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {constructHEarthSweptPassageMesh as sweep, GEOMETRY_KERNEL_SWEEP_V1 as contract} from '../../showroom/globe/h-earth/render/geometry-kernel.sweep.v1.js';
import {admitHEarthPrimitiveRecord, isHEarthAdmittedPrimitiveRecord} from '../../showroom/globe/h-earth/render/geometry-kernel.west.js';
import {buildLawsSpacecraftGeometry} from '../../laws/index.spacecraft.geometry.js';

const v = (x,y,z) => ({x,y,z});
const profile = [{x:-2,y:-1},{x:2,y:-1},{x:2,y:3},{x:-2,y:3}];
const input = extra => ({primitiveId:'sweep-test',centerline:[v(0,0,0),v(0,0,10)],profile,capStart:false,capEnd:false,...extra});
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const dot = (a,b) => a.x*b.x+a.y*b.y+a.z*b.z;
const length = a => Math.hypot(a.x,a.y,a.z);
const minus = (a,b) => v(a.x-b.x,a.y-b.y,a.z-b.z);
const cross = (a,b) => v(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x);
function close(a,b,epsilon=1e-8) {assert.ok(Math.abs(a-b)<=epsilon,`${a} != ${b}`);}
function success(options) {
 const r=sweep(options);assert.equal(r.valid,true,JSON.stringify(r.issues));
 assert.equal(r.admitted,false);assert.equal(r.primitiveRecord.admitted,false);
 return r;
}
function rejected(options,code) {
 const r=sweep(options);assert.equal(r.valid,false);assert.equal(r.primitiveRecord,null);
 if(code) assert.ok(r.issues.some(i=>i.code===code),JSON.stringify(r.issues));
 return r;
}
function topology(r) {return r.geometry.metadata.topologyAnalysis;}
function edgeStats(r) {
 const edges=new Map();const p=r.geometry.indices;
 for(let i=0;i<p.length;i+=3)for(const [a,b] of [[p[i],p[i+1]],[p[i+1],p[i+2]],[p[i+2],p[i]]]) {
  const key=[Math.min(a,b),Math.max(a,b)].join(':');
  const uses=edges.get(key)??[];uses.push([a,b]);edges.set(key,uses);
 }
 return edges;
}

test('analytic asymmetric straight sweep has exact coordinates and dimensions',()=>{
 const r=success(input());assert.equal(r.geometry.vertices.length,8);assert.equal(r.geometry.indices.length/3,8);
 assert.deepEqual(r.geometry.vertices,[...profile.map(p=>v(p.x,p.y,0)),...profile.map(p=>v(p.x,p.y,10))]);
 assert.deepEqual(r.geometry.bounds.minimum,v(-2,-1,0));assert.deepEqual(r.geometry.bounds.maximum,v(2,3,10));
 for(let i=0;i<r.geometry.indices.length;i+=3) {
  const tri=r.geometry.indices.slice(i,i+3).map(j=>r.geometry.vertices[j]);
  const n=cross(minus(tri[1],tri[0]),minus(tri[2],tri[0]));
  const centroid=v(...['x','y','z'].map(k=>tri.reduce((s,p)=>s+p[k],0)/3));
  assert.ok(dot(n,v(centroid.x,centroid.y-1,0))>0);
 }
});

for(const [start,end,expectedLoops] of [[false,false,2],[true,false,1],[false,true,1],[true,true,0]]) {
 test(`cap policy ${start}/${end}: independent edge, winding and Euler checks`,()=>{
  const r=success(input({capStart:start,capEnd:end})),edges=edgeStats(r);
  const boundary=[...edges.values()].filter(e=>e.length===1);
  assert.equal(boundary.length,4*expectedLoops);
  const degree=new Map();for(const [[a,b]] of boundary){degree.set(a,(degree.get(a)??0)+1);degree.set(b,(degree.get(b)??0)+1);}
  assert.ok([...degree.values()].every(d=>d===2));
  for(const e of edges.values()) {assert.ok(e.length<=2);if(e.length===2)assert.deepEqual(e[0],e[1].toReversed());}
  const F=r.geometry.indices.length/3,V=r.geometry.vertices.length,E=edges.size;
  assert.equal(V-E+F,2-expectedLoops);
  assert.equal(topology(r).outwardClosed,start&&end);
  if(start&&end) {
   close(topology(r).shellAnalysis.shellOrientationRecords[0].signedVolume,160);
   const tris=r.geometry.indices;
   for(let i=24;i<tris.length;i+=3) {
    const pts=tris.slice(i,i+3).map(j=>r.geometry.vertices[j]);
    const n=cross(minus(pts[1],pts[0]),minus(pts[2],pts[0]));
    assert.ok(pts[0].z===0?n.z<0:n.z>0);
   }
  }
 });
}

test('explicit scales produce independently computed station dimensions',()=>{
 const r=success(input({centerline:[v(0,0,0),v(0,0,5),v(0,0,10)],scales:[{x:1,y:1},{x:2,y:0.5},{x:0.5,y:2}]}));
 assert.deepEqual(r.geometry.vertices.slice(4,8),profile.map(p=>v(p.x*2,p.y*0.5,5)));
 assert.deepEqual(r.geometry.vertices.slice(8),profile.map(p=>v(p.x*0.5,p.y*2,10)));
});

test('bent and spatial paths retain orthonormal right-handed transported frames',()=>{
 for(const centerline of [[v(0,0,0),v(0,0,10),v(8,0,20)], [v(0,0,0),v(0,0,10),v(5,4,20),v(12,9,27)], [v(0,0,0),v(0,0,10),v(10,0,10)]]) {
  const r=success(input({centerline,capStart:true,capEnd:true}));
  for(const {u,v:t,tangent} of r.sweep.frames) {
   close(length(u),1);close(length(t),1);close(length(tangent),1);
   close(dot(u,t),0);close(dot(u,tangent),0);close(dot(t,tangent),0);
   close(dot(cross(u,t),tangent),1);
  }
  assert.equal(topology(r).outwardClosed,true);
  for(const normal of r.geometry.normals) close(length(normal),1);
 }
});

test('straight sweeps work along all signed world axes with explicit initial up',()=>{
 for(const [end,initialUp] of [[v(0,0,10),v(0,1,0)],[v(0,0,-10),v(0,1,0)],[v(10,0,0),v(0,1,0)],[v(-10,0,0),v(0,1,0)],[v(0,10,0),v(0,0,1)],[v(0,-10,0),v(0,0,1)]]) {
  const r=success(input({centerline:[v(0,0,0),end],initialUp,capStart:true,capEnd:true}));
  close(topology(r).shellAnalysis.shellOrientationRecords[0].signedVolume,160);
 }
});

test('translation preserves geometry differences, normals and topology',()=>{
 const a=success(input({capStart:true,capEnd:true}));const delta=v(132,-46,811);
 const b=success(input({centerline:[delta,v(delta.x,delta.y,delta.z+10)],capStart:true,capEnd:true}));
 assert.deepEqual(a.geometry.vertices,b.geometry.vertices.map(p=>minus(p,delta)));
 assert.deepEqual(a.geometry.normals,b.geometry.normals);assert.deepEqual(a.geometry.indices,b.geometry.indices);
});

test('regular convex profiles across supported sizes produce expected mesh counts',()=>{
 for(const n of [3,5,8,16,32,64]) {
  const polygon=Array.from({length:n},(_,j)=>({x:Math.cos(j*2*Math.PI/n)*2,y:Math.sin(j*2*Math.PI/n)}));
  const r=success(input({profile:polygon,capStart:true,capEnd:true}));
  assert.equal(r.geometry.vertices.length,2*n);assert.equal(r.geometry.indices.length/3,4*n-4);
  assert.equal(topology(r).outwardClosed,true);
 }
});

test('input bytes remain unchanged and repeated construction is identical',()=>{
 const options=input({centerline:[v(0,0,0),v(0,0,10),v(5,2,20)],capEnd:true});
 const before=JSON.stringify(options),a=success(options),b=success(options);
 assert.equal(JSON.stringify(options),before);assert.deepEqual(a,b);
 assert.ok(Object.isFrozen(a));assert.ok(Object.isFrozen(a.geometry.vertices));
});

test('West alone can admit the neutral sweep and construct an admitted primitive',()=>{
 const r=success(input({capStart:true,capEnd:true}));const admitted=admitHEarthPrimitiveRecord(r.primitiveRecord);
 assert.equal(admitted.valid,true,JSON.stringify(admitted.issues));
 assert.ok(isHEarthAdmittedPrimitiveRecord(admitted.primitive));
 assert.equal(r.primitiveRecord.admitted,false);
});

test('contract and output make collision and self-intersection limits explicit',()=>{
 const r=success(input());assert.equal(contract.selfIntersectionCertified,false);
 assert.equal(r.sweep.selfIntersectionCertified,false);assert.equal(r.sweep.collisionCertified,false);
 assert.equal(r.geometry.metadata.selfIntersectionCertified,false);
});

test('invalid structure, unknown options, nonfinite values and sparse arrays reject',()=>{
 for(const options of [null,[],input({extra:true}),input({capStart:undefined}),input({centerline:[v(0,0,NaN),v(0,0,10)]}),input({profile:[{x:Infinity,y:0},...profile.slice(1)]}),input({centerline:[,v(0,0,10)]}),input({profile:[, ...profile.slice(1)]})]) rejected(options);
});

test('nonpositive, mismatched, nonfinite and sparse scales reject',()=>{
 for(const scales of [[{x:0,y:1},{x:1,y:1}],[{x:-1,y:1},{x:1,y:1}],[{x:1,y:1}],[{x:Infinity,y:1},{x:1,y:1}],[,{x:1,y:1}]]) rejected(input({scales}),'SWEEP_SCALE_INVALID');
});

test('clockwise, concave, collinear, repeated and self-crossing profiles reject',()=>{
 for(const p of [profile.toReversed(),[{x:0,y:0},{x:2,y:0},{x:0.5,y:0.5},{x:0,y:2}], [{x:0,y:0},{x:1,y:0},{x:2,y:0}], [profile[0],profile[0],...profile.slice(1)], [profile[0],profile[2],profile[1],profile[3]]]) rejected(input({profile:p}),'SWEEP_PROFILE_INVALID');
});

test('repeated stations, closed paths, reversals and excessive turns reject',()=>{
 rejected(input({centerline:[v(0,0,0),v(0,0,0),v(0,0,10)]}),'SWEEP_SEGMENT_DEGENERATE');
 rejected(input({centerline:[v(0,0,0),v(0,0,10),v(0,0,0)]}),'SWEEP_CLOSED_PATH_UNSUPPORTED');
 rejected(input({centerline:[v(0,0,0),v(0,0,10),v(0,0,2)]}),'SWEEP_TURN_UNSUPPORTED');
 rejected(input({centerline:[v(0,0,0),v(0,0,10),v(1,0,1)]}),'SWEEP_TURN_UNSUPPORTED');
});

test('ambiguous frames and malformed tolerance contexts reject deterministically',()=>{
 for(const initialUp of [v(0,0,0),v(0,0,1),v(0,0,-1)]) rejected(input({initialUp}),'SWEEP_FRAME_AMBIGUOUS');
 for(const toleranceContext of [null,{},1]) {
  const options=input({toleranceContext});const a=rejected(options,'SWEEP_TOLERANCE_INVALID');assert.deepEqual(a,sweep(options));
 }
});

test('resource ceilings reject before generating oversized geometry',()=>{
 rejected(input({centerline:Array.from({length:257},(_,i)=>v(0,0,i))}),'SWEEP_INPUT_INVALID');
 rejected(input({profile:Array.from({length:65},(_,i)=>({x:Math.cos(i),y:Math.sin(i)}))}),'SWEEP_INPUT_INVALID');
});

test('tiny collapsed sections cannot escape as valid geometry',()=>{
 rejected(input({scales:[{x:1e-20,y:1e-20},{x:1e-20,y:1e-20}]}));
});

test('a tight bend with a wide section rejects locally folded side faces',()=>{
 rejected(input({centerline:[v(0,0,0),v(0,0,1),v(1,0,1)]}),'SWEEP_LOCAL_FOLD');
});

test('caller-owned tolerance context remains mutable and independent of result',()=>{
 const toleranceContext=structuredClone(success(input()).sweep.toleranceContext);
 const unrelated={nested:true};toleranceContext.unrelated=unrelated;
 const before=JSON.stringify(toleranceContext);
 const r=success(input({toleranceContext}));
 assert.equal(JSON.stringify(toleranceContext),before);assert.equal(Object.isFrozen(toleranceContext),false);
 assert.equal(Object.isFrozen(unrelated),false);assert.notEqual(r.sweep.toleranceContext,toleranceContext);
 toleranceContext.positionTolerance=123;toleranceContext.newValue=1;
 assert.notEqual(r.sweep.toleranceContext.positionTolerance,123);
 assert.equal(r.sweep.toleranceContext.unrelated,undefined);
});

test('existing Laws consumer output and protected dependency bytes match baseline',()=>{
 const baseline=JSON.parse(fs.readFileSync(new URL('../evidence/geometry-kernel-sweep-v1/baseline.json',import.meta.url)));
 assert.equal(digest(buildLawsSpacecraftGeometry()),baseline.laws.outputSha256);
 for(const file of baseline.protectedSources) {
  assert.equal(createHash('sha256').update(fs.readFileSync(file.path)).digest('hex'),file.sha256,file.path);
  assert.equal(execFileSync('git',['hash-object',file.path],{encoding:'utf8'}).trim(),file.gitBlob,file.path);
 }
});
