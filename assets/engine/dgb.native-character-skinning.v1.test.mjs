import test from 'node:test';
import assert from 'node:assert/strict';
import {createSkeleton} from './dgb.native-character-skeleton.v1.mjs';
import {createSkinnedMesh, createMorphTargetEvaluator} from './dgb.native-character-skinning.v1.mjs';
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

// M1.2 tests exercise the actual engine evaluator, not any A4-A rabbit assets.
test('M1.2 signed additive target evaluation returns copied GPU-ready Float32 positions', () => {
  const base = new Float32Array([0,0,0, 1,0,0]);
  const left = new Float32Array([1,0,0, 0,2,0]);
  const up = new Float32Array([0,2,0, 0,0,4]);
  const e = createMorphTargetEvaluator({basePositions:base,targets:[
    {name:'left',deltas:left},{name:'up',deltas:up}
  ]});
  base[0]=100;left[0]=200;up[1]=300;
  const weights=new Float32Array([0.5,-0.25]);
  const out=e.evaluate(weights);
  assert.ok(out instanceof Float32Array);
  assert.deepEqual([...out],[0.5,-0.5,0, 1,1,-1]);
  assert.deepEqual([...e.evaluate()], [0,0,0,1,0,0]);
  assert.deepEqual(e.targetNames,['left','up']);
  weights[0]=999;out[0]=555;
  assert.equal(e.evaluate([0.5,-0.25])[0],0.5);
  assert.equal(e.vertexCount,2);assert.equal(e.targetCount,2);
  assert.ok(Object.isFrozen(e.targetNames));
});

test('M1.2 bind-space morph runs before skeleton joint transformation', () => {
  const s=rabbit();
  const m=createSkinnedMesh(s,{vertices:[[2,0,0]],influences:[[{joint:'thigh',weight:1}]],
    morphTargets:[{name:'lift',deltas:new Float32Array([0,1,0])}]});
  const posed=s.samplePose({controls:{thigh:Math.PI/2}});
  const result=m.deform(posed,[1])[0];
  near(result[0],0,1e-6);near(result[1],1,1e-6);near(result[2],0,1e-6);
  assert.deepEqual(m.morphTargetNames,['lift']);
  const noMorph=m.deform(posed)[0];near(noMorph[0],1,1e-6);near(noMorph[1],1,1e-6);
  assert.deepEqual(m.bindVertices[0],[2,0,0]);
});

test('M1.2 rejects malformed targets, duplicates, wrong lengths, nonfinite values and unintended morph weights',()=>{
  const base=new Float32Array([1,0,0]);
  const valid={name:'left',deltas:new Float32Array([1,0,0])};
  const make = options => createMorphTargetEvaluator({basePositions:base,targets:options});
  assert.throws(()=>createMorphTargetEvaluator({basePositions:[1,0,0],targets:[valid]}),/MORPH_BASE/);
  assert.throws(()=>createMorphTargetEvaluator({basePositions:new Float32Array([NaN,0,0]),targets:[valid]}),/MORPH_BASE/);
  assert.throws(()=>make([]),/MORPH_TARGET_COUNT/);
  assert.throws(()=>make([valid,valid]),/MORPH_TARGET_NAME/);
  assert.throws(()=>make([{name:'X',deltas:new Float32Array([1,2])}]),/MORPH_TARGET_DELTAS/);
  assert.throws(()=>make([{name:'X',deltas:new Float32Array([1,NaN,0])}]),/MORPH_TARGET_DELTAS/);
  const e=make([valid]);
  assert.throws(()=>e.evaluate([0,1]),/MORPH_WEIGHTS_LENGTH/);
  assert.throws(()=>e.evaluate('1'),/MORPH_WEIGHTS_TYPE/);
  assert.throws(()=>e.evaluate([NaN]),/MORPH_WEIGHT_NONFINITE/);
  assert.throws(()=>e.evaluate([1e100]),/MORPH_RESULT_NONFINITE/);
  const s=rabbit(),staticMesh=mesh(s);
  assert.throws(()=>staticMesh.deform(s.samplePose(),[1]),/MORPH_TARGETS_NOT_CONFIGURED/);
});

test('M1.2 deterministic 64-frame synthetic complete/compact corpus retains a quantified 16-target ceiling',()=>{
  // A synthetic fixed-topology bank (not the actual archived A4-A rabbit).
  // 63 basis deltas generate 64 poses: base plus each full one-hot target.
  const coords=3*5;const base=Float32Array.from({length:coords},(_,i)=>i/8);
  const targets=Array.from({length:63},(_,j)=>({name:'t'+j,
    deltas:Float32Array.from({length:coords},(_,i)=>Math.sin((i+1)*(j+1)*0.11)*0.08/(1+j/20))}));
  const exact=createMorphTargetEvaluator({basePositions:base,targets});
  assert.equal(exact.targetCount,63);
  const bank=[new Float32Array(base)];
  for(let i=0;i<63;i++){
    const oneHot=Float32Array.from({length:63},(_,k)=>k===i?1:0);
    const positions=exact.evaluate(oneHot);
    for(let k=0;k<coords;k++) near(positions[k],base[k]+targets[i].deltas[k],2e-7);
    bank.push(positions);
  }
  assert.equal(bank.length,64);
  // A different synthetic 16-target model is deliberately imperfect.
  const reduced=createMorphTargetEvaluator({basePositions:base,targets:targets.slice(0,16)});
  let errorBase=0,errorCompact=0,count=0;
  for(let p=0;p<64;p++){
    const compactWeights=Float32Array.from({length:16},(_,i)=>i===p-1?1:0);
    const candidate=reduced.evaluate(compactWeights);
    for(let k=0;k<coords;k++){
      errorBase+=(bank[p][k]-base[k])**2;
      errorCompact+=(bank[p][k]-candidate[k])**2;
      count++;
    }
  }
  const rmseBase=Math.sqrt(errorBase/count),rmse16=Math.sqrt(errorCompact/count);
  assert.ok(rmse16>0 && rmse16<rmseBase, 'synthetic compact should improve on no targets but retain residual');
  assert.ok(Number.isFinite(rmse16));
});

test('M1.2 deterministic finite outputs and bounded target capacity reject oversized allocation',()=>{
  const base=new Float32Array([1,2,3]);
  const make=()=>createMorphTargetEvaluator({basePositions:base,targets:[{name:'x',deltas:new Float32Array([0.1,0.2,0.3])}]});
  const e=make();
  assert.deepEqual([...e.evaluate([-0.2])],[...e.evaluate([-0.2])]);
  assert.throws(()=>createMorphTargetEvaluator({basePositions:base,targets:Array.from({length:129},(_,i)=>({name:'m'+i,deltas:new Float32Array([0,0,0])}))}),/MORPH_TARGET_COUNT/);
});
