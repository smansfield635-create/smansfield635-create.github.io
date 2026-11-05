import test from 'node:test';
import assert from 'node:assert/strict';
import {createSkeleton} from './dgb.native-character-skeleton.v1.mjs';
import {createSkinnedMesh} from './dgb.native-character-skinning.v1.mjs';
const near=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<=e,`${a} != ${b}`);
const rabbit=()=>createSkeleton([
  {id:'hip',bindPosition:[0,0,0],constraint:{kind:'FREE'}},
  {id:'thigh',parent:'hip',bindPosition:[1,0,0],constraint:{kind:'HINGE',axis:[0,0,1],min:-Math.PI/2,max:Math.PI/2}},
  {id:'paw',parent:'thigh',bindPosition:[1,0,0],constraint:{kind:'HINGE',axis:[0,0,1],min:-Math.PI,max:Math.PI}},
]);
const mesh=(s,vertices=[[1,0,0],[2,0,0]])=>createSkinnedMesh(s,{vertices,influences:[[{joint:'thigh',weight:1}],[{joint:'paw',weight:1}]]});
test('bind pose exactly preserves all undeformed vertices',()=>{
  const s=rabbit(),m=mesh(s),vertices=m.deform(s.samplePose());
  assert.deepEqual(vertices,[[1,0,0],[2,0,0]]);
});
test('posed hinge rotates downstream thigh-influenced point',()=>{
  const s=rabbit(),m=mesh(s),vertices=m.deform(s.samplePose({controls:{thigh:Math.PI/2}}));
  near(vertices[1][0],1);near(vertices[1][1],1);
});
test('root translation shifts all deform output exactly once',()=>{
  const s=rabbit(),m=mesh(s),a=m.deform(s.samplePose()),b=m.deform(s.samplePose({rootTranslation:[-2,3,5]}));
  for(let i=0;i<a.length;i++)for(let k=0;k<3;k++)near(b[i][k]-a[i][k],[-2,3,5][k]);
});
test('two-bone weighted influence computes linear blend',()=>{
  const s=rabbit();
  const m=createSkinnedMesh(s,{vertices:[[3,0,0]],influences:[[{joint:'thigh',weight:0.5},{joint:'paw',weight:0.5}]]});
  const p=m.deform(s.samplePose({controls:{thigh:Math.PI/2,paw:-Math.PI/2}}))[0];
  near(p[0],1.5);near(p[1],1.5);
});
test('bird wing topology uses same world-independent skinning API',()=>{
  const s=createSkeleton([{id:'body'},{id:'wing',parent:'body',bindPosition:[0,0,0],constraint:{kind:'HINGE',axis:[0,0,1],min:-1,max:1}}]);
  const m=createSkinnedMesh(s,{vertices:[[1,0,0]],influences:[[{joint:'wing',weight:1}]]});
  const p=m.deform(s.samplePose({controls:{wing:0.5}}))[0];near(p[0],Math.cos(0.5));near(p[1],Math.sin(0.5));
});
test('deterministic, frozen outputs with defensive bind-vertex copies',()=>{
  const s=rabbit(),input=[[1,0,0],[2,0,0]],m=mesh(s,input);input[0][0]=100;
  const pose=s.samplePose({controls:{thigh:0.2,paw:-0.2}}),a=m.deform(pose),b=m.deform(pose);
  assert.deepEqual(a,b);assert.ok(Object.isFrozen(a));assert.ok(Object.isFrozen(a[0]));
  assert.equal(m.bindVertices[0][0],1);assert.throws(()=>{a[0][0]=0},TypeError);
});
test('reject nonfinite and malformed mesh vertices or missing influences',()=>{
  const s=rabbit();
  assert.throws(()=>createSkinnedMesh(s,{vertices:[[NaN,0,0]],influences:[[{joint:'hip',weight:1}]]}),/VERTEX_INVALID/);
  assert.throws(()=>createSkinnedMesh(s,{vertices:[[0,0]],influences:[[{joint:'hip',weight:1}]]}),/VERTEX_INVALID/);
  assert.throws(()=>createSkinnedMesh(s,{vertices:[[0,0,0]],influences:[]}),/MESH_SCHEMA_INVALID/);
});
test('reject duplicate, unknown, zero, negative and nonnormalized joint influences',()=>{
  const s=rabbit(),v=[[1,0,0]];
  for(const infl of [[{joint:'thigh',weight:0.7},{joint:'thigh',weight:0.3}],[{joint:'missing',weight:1}],[{joint:'hip',weight:0}],[{joint:'hip',weight:-1}]])
    assert.throws(()=>createSkinnedMesh(s,{vertices:v,influences:[infl]}),/INFLUENCE_INVALID/);
  assert.throws(()=>createSkinnedMesh(s,{vertices:v,influences:[[{joint:'hip',weight:0.8}]]}),/WEIGHTS_MUST_SUM_TO_ONE/);
});
test('reject more than four weighted influences',()=>{
  const s=createSkeleton([{id:'a'},{id:'b',parent:'a'},{id:'c',parent:'a'},{id:'d',parent:'a'},{id:'e',parent:'a'}]);
  assert.throws(()=>createSkinnedMesh(s,{vertices:[[0,0,0]],influences:[[...'abcde'].map(joint=>({joint,weight:0.2}))]}),/INFLUENCE_COUNT_INVALID/);
});
test('reject foreign skeleton topology and malformed poses',()=>{
  const s=rabbit(),m=mesh(s);
  const foreign=createSkeleton([{id:'body'},{id:'wing',parent:'body'}]);
  assert.throws(()=>m.deform(foreign.samplePose()),/POSE_SKELETON_MISMATCH/);
  assert.throws(()=>m.deform({joints:[]}),/POSE_SKELETON_MISMATCH/);
});
