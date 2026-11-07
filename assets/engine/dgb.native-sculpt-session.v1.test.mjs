import test from 'node:test';
import assert from 'node:assert/strict';
import {createSculptSession,verifySculptGeometry,sculptScreenRay,invertSculptMatrix} from './dgb.native-sculpt-session.v1.mjs';
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
