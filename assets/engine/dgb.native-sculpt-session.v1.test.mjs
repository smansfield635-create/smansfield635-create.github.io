import test from 'node:test';
import assert from 'node:assert/strict';
import {createSculptSession,verifySculptGeometry,verifySculptSourceRelative,createSculptSourceHandoff,sculptScreenRay,invertSculptMatrix} from './dgb.native-sculpt-session.v1.mjs';
const fixture=()=>({positions:new Float32Array([-1,-1,0, 0,-1,0, 1,-1,0, -1,0,0, 0,0,0, 1,0,0, -1,1,0, 0,1,0, 1,1,0]),triangles:new Uint16Array([0,1,4,0,4,3, 1,2,5,1,5,4, 3,4,7,3,7,6, 4,5,8,4,8,7]),regions:['skull','skull','nape','skull','skull','nape','shoulder','shoulder','shoulder'],protectedVertices:[0,3,6]});
test('actual ray-to-triangle intersection returns 3D hit and barycentrics',()=>{
  const s=createSculptSession(fixture());const hit=s.pick([0,0,5],[0,0,-1]);assert(hit);assert(Math.abs(hit.position[2])<1e-8);assert(Math.abs(hit.barycentric.reduce((a,b)=>a+b,0)-1)<1e-7);assert.equal(hit.vertexIds.length,3);
});
test('bounded stroke edits intended cheek/skull vertices and protects unrelated structures',()=>{
  const s=createSculptSession(fixture()),before=s.getPositions(),hit=s.pick([0,0,5],[0,0,-1]);const response=s.beginStroke(hit,{radius:1.35,strength:.8,falloff:2,region:'skull'});assert(response.affectedVertexIds.length>0);assert(s.applyStroke({mode:'PULL',amount:.12}));s.endStroke();const after=s.getPositions();
  let changed=0;for(let i=0;i<9;i++){if(after[3*i+2]!==before[3*i+2]){changed++;assert.equal(fixture().regions[i],'skull');assert(!fixture().protectedVertices.includes(i));}else if(fixture().protectedVertices.includes(i))assert.deepEqual([...after.slice(3*i,3*i+3)],[...before.slice(3*i,3*i+3)]);}assert(changed>0);assert.equal(s.state().undoDepth,1);
});
test('undo redo commit entire drag and deterministic JSON roundtrip',()=>{
  const s=createSculptSession(fixture());const initial=s.serialize();const hit=s.pick([0,0,5],[0,0,-1]);s.beginStroke(hit,{radius:1.5,region:'skull'});s.applyStroke({mode:'PULL',amount:.05});s.applyStroke({mode:'PULL',amount:.04});s.endStroke();const changed=s.serialize();assert.notEqual(changed,initial);assert(s.undo());assert.equal(s.serialize(),initial);assert(s.redo());assert.equal(s.serialize(),changed);
  const copy=createSculptSession(fixture());copy.restore(changed);assert.equal(copy.serialize(),changed);assert.equal(copy.state().undoDepth,0);
});
test('rejected invalid edit rollback and malformed saves do not replace valid source',()=>{
  const s=createSculptSession(fixture());const initial=s.serialize();const hit=s.pick([0,0,5],[0,0,-1]);s.beginStroke(hit,{radius:2.5,region:'ALL'});
  assert.throws(()=>s.applyStroke({mode:'MOVE',delta:[NaN,0,0]}),/VEC3/);s.cancelStroke();assert.equal(s.serialize(),initial);
  assert.throws(()=>s.restore('bad'),/JSON/);assert.throws(()=>s.restore(JSON.stringify({...JSON.parse(initial),triangles:[0,1,5]})),/IDENTITY/);assert.equal(s.serialize(),initial);
  assert.throws(()=>verifySculptGeometry(new Float32Array([0,0,0, 1,0,0, 0,0,0]),new Uint16Array([0,1,2])),/DEGENERATE/);
});
test('detect edge nonmanifold and geometric crossing independently of visual render',()=>{
  const f=fixture();const same=new Uint16Array([0,1,4,0,4,3,0,4,7]);assert.throws(()=>verifySculptGeometry(f.positions,same),/NONMANIFOLD|DUPLICATE/);
  const crossing={positions:new Float32Array([-1,-1,0,1,-1,0,0,1,0, 0,-.5,-1,0,-.5,1,0,.5,0]),triangles:new Uint16Array([0,1,2,3,4,5])};assert.throws(()=>verifySculptGeometry(crossing.positions,crossing.triangles),/SELF_INTERSECTION/);
});
test('screen unprojection is finite and deterministic; singular matrices rejected',()=>{
  const identity=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);const a=sculptScreenRay({x:50,y:50,width:100,height:100,viewProjection:identity});assert.deepEqual(a.origin,[0,0,-1]);assert.deepEqual(a.direction,[0,0,1]);assert.throws(()=>invertSculptMatrix(new Float32Array(16)),/SINGULAR/);
});

// M1.6.2: Integrated organic-field and source-relative regression checks.
const plane=()=>({
  positions:new Float32Array([-1,-1,0,0,-1,0,1,-1,0,-1,0,0,0,0,0,1,0,0,-1,1,0,0,1,0,1,1,0]),
  triangles:new Uint16Array([0,1,4,0,4,3,1,2,5,1,5,4,3,4,7,3,7,6,4,5,8,4,8,7]),
  regions:['back','back','back','back','shoulder','back','back','back','back'],
  protectedVertices:[0,1,2,3,5,6,7,8]
});
const hit=s=>s.pick([0,0,3],[0,0,-1]);

test('source-relative checker rejects inverted triangle that remains nondegenerate',()=>{
  const a=new Float32Array([0,0,0,1,0,0,0,1,0]);
  const b=new Float32Array([0,0,0,1,0,0,0,-1,0]);
  assert.throws(()=>verifySculptSourceRelative(a,b,new Uint16Array([0,1,2])),/SCULPT_SOURCE_NORMAL_GUARD_REJECTED/);
});
test('source-relative checker rejects area changes outside the frozen ratio interval',()=>{
  const a=new Float32Array([0,0,0,1,0,0,0,1,0]);
  const b=new Float32Array([0,0,0,0.1,0,0,0,1,0]);
  assert.throws(()=>verifySculptSourceRelative(a,b,new Uint16Array([0,1,2])),/SCULPT_SOURCE_AREA_GUARD_REJECTED/);
});
test('protected complement is checked at exact Float32 source coordinate',()=>{
  const a=new Float32Array([0,0,0,1,0,0,0,1,0]),b=new Float32Array(a);
  b[0]+=0.001;
  assert.throws(()=>verifySculptSourceRelative(a,b,new Uint16Array([0,1,2]),{protectedVertices:[0]}),/SCULPT_PROTECTED_SOURCE_CHANGED/);
});
test('single native session supports anisotropic inflate, grab, flatten, full undo and redraw inputs',()=>{
  const f=plane(),s=createSculptSession(f),before=s.serialize();
  const options={region:'shoulder',fieldRadii:[1.2,.8,.5],radius:1,strength:1};
  let h=hit(s);assert(h);
  const sel=s.beginStroke(h,options);
  assert.deepEqual(sel.affectedVertexIds,[4]);
  assert(s.applyStroke({mode:'ORGANIC_INFLATE',amount:.04}));s.endStroke();
  let p=s.getPositions();assert(p[14]>.03 && p[14]<.041);
  h=hit(s);s.beginStroke(h,options);
  assert(s.applyStroke({mode:'ORGANIC_GRAB',delta:[.01,0,0]}));s.endStroke();
  p=s.getPositions();assert(p[12]>.009);
  h=hit(s);s.beginStroke(h,options);
  assert(s.applyStroke({mode:'ORGANIC_FLATTEN',amount:.3,planeNormal:[0,0,1],planeOffset:0}));s.endStroke();
  assert(s.getPositions()[14]<.04);
  const final=s.serialize();assert.notEqual(final,before);
  assert(s.verify().sourceRelative.sourceRelativePass);
  assert.equal(s.state().undoDepth,3);
  for(let i=0;i<3;i++)assert(s.undo());
  assert.equal(s.serialize(),before);
  for(let i=0;i<3;i++)assert(s.redo());
  assert.equal(s.serialize(),final);
  const copy=createSculptSession(f);copy.restore(final);assert.equal(copy.serialize(),final);
  for(const id of f.protectedVertices)assert.deepEqual([...s.getPositions().slice(3*id,3*id+3)],[...f.positions.slice(3*id,3*id+3)]);
});
test('unsafe stroke is atomic: no corrupted frame, undo history or exported state',()=>{
  const f=plane();const s=createSculptSession({...f,sourceGuards:{maxAreaRatio:1.0000001}}),before=s.serialize();
  const h=hit(s);s.beginStroke(h,{region:'shoulder',fieldRadii:[1,1,1]});
  assert.throws(()=>s.applyStroke({mode:'ORGANIC_INFLATE',amount:.3}),/SCULPT_SOURCE_AREA_GUARD_REJECTED/);
  assert.equal(s.serialize(),before);
  assert.equal(s.state().undoDepth,0);
  assert.equal(s.state().redoDepth,0);
  assert.equal(s.state().active,false);
  assert.equal(s.state().revision,0);
});
test('invalid organic controls cannot silently mutate a session',()=>{
  const f=plane(),s=createSculptSession(f),before=s.serialize(),h=hit(s);
  assert.throws(()=>s.beginStroke(h,{fieldRadii:[1,-1,1]}),/OUT_OF_BOUNDS/);
  s.beginStroke(h,{region:'shoulder'});
  assert.throws(()=>s.applyStroke({mode:'ORGANIC_FLATTEN',planeNormal:[0,0,0],amount:1}),/INVALID|ZERO_NORMAL|AMOUNT/);
  s.cancelStroke();assert.equal(s.serialize(),before);
});
test('M1.3 +Z-up handoff transforms round-trip and preserves split UV identity',()=>{
  const src=new Float32Array([1,2,3,4,5,6,7,8,9]),indices=new Uint16Array([0,1,2]);
  const seam=new Uint32Array([0,1,1,2]);const uv=new Float32Array([0,0,.4,.1,.6,.2,1,1]);
  const h=createSculptSourceHandoff({positions:src,triangles:indices,renderToMaster:seam,uvs:uv});
  assert.deepEqual([...h.positionsYUp],[1,3,-2,4,6,-5,7,9,-8]);
  assert.deepEqual([...h.fromSculptYUp(h.positionsYUp)],[...src]);
  assert.deepEqual([...h.renderToMaster],[...seam]);assert.deepEqual([...h.uvs],[...uv]);
  assert.equal(h.retopologyBakeAllowed,false);
  assert.throws(()=>h.fromSculptYUp(new Float32Array([0,0,0,1,0,0,1,1,0,0,1,0])),/VERTEX_COUNT_CHANGED/);
});
