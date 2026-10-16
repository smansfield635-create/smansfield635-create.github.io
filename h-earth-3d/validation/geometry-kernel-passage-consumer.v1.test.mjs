import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {buildHEarthPassageConsumer as build,evaluateHEarthPassageSphereMove as move} from '../../showroom/globe/h-earth/render/geometry-kernel.passage-consumer.v1.js';
const v=(x,y,z)=>({x,y,z});
const profile=[{x:-2,y:-1},{x:2,y:-1},{x:2,y:3},{x:-2,y:3}];
const input=extra=>({primitiveId:'consumer-test',centerline:[v(0,0,0),v(0,0,10)],profile,...extra});
const query=extra=>({from:v(0,1,1),to:v(0,1,9),radius:.5,...extra});
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const sub=(a,b)=>v(a.x-b.x,a.y-b.y,a.z-b.z);
const cross=(a,b)=>v(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x);
const ready=options=>{const c=build(options??input());assert.equal(c.valid,true,JSON.stringify(c));return c;};
function close(a,b,eps=1e-6){assert.ok(Math.abs(a-b)<=eps,`${a} != ${b}`);}

test('existing West admits an immutable closed shell with independently checked convex volume',()=>{
 const c=ready();assert.equal(c.primitive.admitted,true);assert.equal(c.primitive.admissionAuthority,'WEST');
 assert.equal(c.geometry.metadata.topologyAnalysis.outwardClosed,true);
 assert.equal(c.certificate.finiteEndPlanes,true);close(c.certificate.localVolume,160);
 assert.ok(Object.isFrozen(c.geometry.vertices));assert.equal(c.ownsNavigation,false);
});

test('interior moving and stationary spheres receive a complete linear-move certificate',()=>{
 const c=ready();for(const q of [query(),query({from:v(.2,.4,3),to:v(.2,.4,3)}),query({from:v(-1,0,2),to:v(1,2,8),radius:.4})]){
  const r=move(c,q);assert.equal(r.disposition,'CLEARANCE_CERTIFIED');assert.equal(r.clearanceCertified,true);
  assert.ok(r.minimumClearance>r.requiredMargin);
 }
});

test('analytic rectangular clearance agrees over a deterministic endpoint/radius corpus',()=>{
 const c=ready();let certified=0,held=0;
 for(const x of [-2.5,-1.5,0,1.5,2.5])for(const y of [-1.5,0,1,2,3.5])for(const z of [-1,.25,2,8,9.75,11])for(const radius of [.1,.5,1]){
  const from=v(x,y,z),to=v(x*.5,1,5),q={from,to,radius};
  const clearance=Math.min(...[from,to].flatMap(p=>[p.x+2,2-p.x,p.y+1,3-p.y,p.z,10-p.z]))-radius;
  const r=move(c,q);close(r.minimumClearance,clearance,1e-10);
  assert.equal(r.clearanceCertified,clearance>r.requiredMargin);
  r.clearanceCertified?certified++:held++;
 }
 assert.ok(certified>0&&held>0);
});

test('side, corner, floor, ceiling and finite-end exits fail conservatively',()=>{
 const c=ready();for(const to of [v(2,1,5),v(-2,1,5),v(0,-1,5),v(0,3,5),v(2,3,5),v(0,1,0),v(0,1,10),v(0,1,12)]){
  const r=move(c,query({to}));assert.equal(r.valid,true);assert.equal(r.clearanceCertified,false);assert.equal(r.disposition,'HOLD_OBSTRUCTED_OR_AMBIGUOUS');
 }
});

test('tangent, near-tolerance and just-clear sphere positions have explicit margin semantics',()=>{
 const c=ready(),m=c.certificate.margin;
 for(const [offset,expected] of [[0,false],[m*.5,false],[m*2,true]]){
  const p=v(1.5-offset,1,5),r=move(c,{from:p,to:p,radius:.5});assert.equal(r.clearanceCertified,expected);
 }
});

test('a point-like move may fit where a larger sphere does not',()=>{
 const c=ready();const q=query({from:v(1.75,1,2),to:v(1.75,1,8),radius:.1});
 assert.equal(move(c,q).clearanceCertified,true);assert.equal(move(c,{...q,radius:.5}).clearanceCertified,false);
});

test('oblique straight passages preserve the finite-radius proof',()=>{
 const a=v(3,-4,8),b=v(13,6,28),c=ready(input({centerline:[a,b]}));
 const f=c.geometry.vertices.slice(0,4).reduce((s,p)=>v(s.x+p.x/4,s.y+p.y/4,s.z+p.z/4),v(0,0,0));
 const delta=sub(b,a),q={from:v(f.x+delta.x*.2,f.y+delta.y*.2,f.z+delta.z*.2),to:v(f.x+delta.x*.8,f.y+delta.y*.8,f.z+delta.z*.8),radius:.3};
 assert.equal(move(c,q).clearanceCertified,true);
});

test('copied interior winding and normals face into the passage',()=>{
 const c=ready(),{positions:p,normals:n,indices}=c.renderBuffers;
 assert.ok(p instanceof Float32Array&&n instanceof Float32Array&&indices instanceof Uint16Array);
 assert.equal(p.length,c.geometry.vertices.length*3);assert.equal(indices.length,c.geometry.indices.length);
 const center=v(0,1,5);
 for(let i=0;i<indices.length;i+=3){
  const points=Array.from(indices.slice(i,i+3),j=>v(p[j*3],p[j*3+1],p[j*3+2]));
  const face=cross(sub(points[1],points[0]),sub(points[2],points[0]));
  const centroid=v(...['x','y','z'].map(k=>points.reduce((s,p)=>s+p[k]/3,0)));
  assert.ok(dot(face,sub(center,centroid))>0);
  for(const j of indices.slice(i,i+3))assert.ok(dot(face,v(n[j*3],n[j*3+1],n[j*3+2]))>0);
 }
});

test('GPU buffer mutation cannot alter immutable geometry or query results',()=>{
 const c=ready(),before=move(c,query()),vertices=JSON.stringify(c.geometry.vertices);
 c.renderBuffers.positions.fill(NaN);c.renderBuffers.normals.fill(999);c.renderBuffers.indices.fill(0);
 assert.deepEqual(move(c,query()),before);assert.equal(JSON.stringify(c.geometry.vertices),vertices);
 assert.ok(ready().renderBuffers.positions.every(Number.isFinite));
});

test('forged, cloned and unrelated objects cannot present a clearance certificate',()=>{
 const c=ready();for(const fake of [{},null,{...c},structuredClone(c)]){
  const r=move(fake,query());assert.equal(r.disposition,'HOLD_UNTRUSTED_CONSUMER');assert.equal(r.clearanceCertified,false);
 }
});

test('bends, extra stations, changing scales and uncontrolled options hold as unsupported',()=>{
 for(const options of [input({centerline:[v(0,0,0),v(0,0,5),v(1,0,10)]}),input({scales:[{x:1,y:1},{x:2,y:1}]}),input({roll:1}),input({capEnd:false})]){
  assert.equal(build(options).disposition,'HOLD_UNSUPPORTED_GEOMETRY');
 }
});

test('malformed geometry is distinct from unsupported geometry and blocked movement',()=>{
 for(const options of [null,[],input({centerline:[v(0,0,0)]}),input({centerline:[v(0,0,0),v(0,0,Infinity)]}),input({scales:[{x:0,y:1},{x:0,y:1}]})])assert.equal(build(options).disposition,'HOLD_INVALID_INPUT');
 assert.equal(build(input({profile:profile.toReversed()})).disposition,'HOLD_INVALID_GEOMETRY');
});

test('invalid query data and unsupported capsule/rotation requests cannot certify',()=>{
 const c=ready();for(const q of [null,[],query({radius:0}),query({radius:-1}),query({radius:NaN}),query({from:v(NaN,1,1)})]){
  assert.equal(move(c,q).disposition,'HOLD_INVALID_QUERY');
 }
 for(const q of [query({halfLength:1}),query({axis:v(0,1,0)}),query({rotation:Math.PI})])assert.equal(move(c,q).disposition,'HOLD_UNSUPPORTED_QUERY');
});

test('translation keeps local render buffers and safe decisions stable',()=>{
 const c=ready();const origin=v(100000,-400000,200000);const d=ready(input({centerline:[origin,v(origin.x,origin.y,origin.z+10)]}));
 assert.deepEqual(d.renderBuffers.positions,c.renderBuffers.positions);assert.deepEqual(d.renderBuffers.normals,c.renderBuffers.normals);
 const shift=p=>v(p.x+origin.x,p.y+origin.y,p.z+origin.z);
 const q=query();assert.equal(move(d,{...q,from:shift(q.from),to:shift(q.to)}).clearanceCertified,true);
 close(d.certificate.localVolume,c.certificate.localVolume);
});

test('extreme numerical scales do not silently receive a clearance certificate',()=>{
 const huge=build(input({centerline:[v(1e16,1e16,1e16),v(1e16,1e16,1e16+100)]}));assert.equal(huge.valid,false);
 const tiny=build(input({profile:profile.map(p=>({x:p.x*1e-15,y:p.y*1e-15}))}));assert.equal(tiny.valid,false);
 const c=ready(),overflow=move(c,query({from:v(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE)}));
 assert.equal(overflow.clearanceCertified,false);
});

test('building and querying preserve caller-owned mutable records',()=>{
 const options=input(),before=JSON.stringify(options),c=ready(options),q=query(),qb=JSON.stringify(q);
 move(c,q);assert.equal(JSON.stringify(options),before);assert.equal(JSON.stringify(q),qb);
 assert.equal(Object.isFrozen(options.centerline[0]),false);assert.equal(Object.isFrozen(options.profile[0]),false);assert.equal(Object.isFrozen(q.from),false);
});

test('qualified sweep source bytes remain frozen',()=>{
 const source=fs.readFileSync(new URL('../../showroom/globe/h-earth/render/geometry-kernel.sweep.v1.js',import.meta.url));
 assert.equal(createHash('sha256').update(source).digest('hex'),'fc4e100a1b687942f4feef4e32f95e81dfdf445a6550f275b064597ef60c791b');
});
