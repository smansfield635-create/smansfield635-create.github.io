import test from 'node:test';
import assert from 'node:assert/strict';
import {createMorphTargetEvaluator} from './dgb.native-character-skinning.v1.mjs';
import {createMorphGpuBridge} from './dgb.native-character-morph-gpu-bridge.v1.mjs';

const base=new Float32Array([0,0,0, 1,0,0, 1,1,0, 0,1,0]);
const evaluator=createMorphTargetEvaluator({basePositions:base,targets:[
  {name:'crown',deltas:new Float32Array([0,0,0,0,0,0,0,0,0.5,0,0,0])},
  {name:'lower',deltas:new Float32Array([0,0,0,0,0,0,0,0,-0.25,0,0,0])}
]});
// Two triangles share master vertices across separate UV-render vertices.
const renderToMaster=new Int32Array([0,1,2,0,2,3]);
const triangles=new Uint16Array([0,1,2,3,4,5]);
function makeDevice({failOn=[],failRollback=false}={}){
  let count=0,lost=false;
  const calls=[],state=new Map(),mesh={};
  const device={updateMeshAttribute(m,name,data){
    assert.equal(m,mesh);
    count++;
    if(lost)throw Error('GRAPHICS_CONTEXT_LOST');
    if(failOn.includes(count)||(failRollback&&count>failOn[0]))throw Error('INJECTED_GPU_FAILURE');
    assert(data instanceof Float32Array);assert.equal(data.length,18);
    assert(data.every(Number.isFinite));
    calls.push(name);state.set(name,new Float32Array(data));
  }};
  return {device,mesh,state,calls,setLost(value){lost=value},get count(){return count}};
}
function build(options={}){
  const d=makeDevice(options);
  const bridge=createMorphGpuBridge({evaluator,device:d.device,mesh:d.mesh,renderToMaster,triangles});
  return {d,bridge};
}

test('M1.3 updates position and normal for the same owned mesh without allocating a replacement',()=>{
  const {d,bridge}=build();
  const a=bridge.update([1,0]);
  assert.equal(a.renderVertices,6);assert.equal(a.masterVertices,4);
  assert.equal(a.frames,1);assert.deepEqual(d.calls,['a_normal','a_position']);
  const s=bridge.snapshot();
  assert.equal(s.positions[8],0.5);assert.equal(s.positions[14],0.5);
  assert.deepEqual(s.positions,d.state.get('a_position'));
  assert.deepEqual(s.normals,d.state.get('a_normal'));
  for(let i=0;i<6;i++)assert.ok(Math.abs(Math.hypot(...s.normals.slice(3*i,3*i+3))-1)<1e-6);
  assert.deepEqual(s.normals.slice(0,3),s.normals.slice(9,12));
  assert.deepEqual(s.normals.slice(6,9),s.normals.slice(12,15));
  const b=bridge.update([-0.5,1]);assert.equal(b.frames,2);
  assert.notDeepEqual(bridge.snapshot().positions,s.positions);
  assert.equal(d.calls.length,4);
});

test('M1.3 prevents caller mutation of retained mapping and emitted buffers',()=>{
  const mapping=new Int32Array(renderToMaster);
  const d=makeDevice();
  const bridge=createMorphGpuBridge({evaluator,device:d.device,mesh:d.mesh,renderToMaster:mapping,triangles});
  mapping[0]=999;
  const p=bridge.preview([1,0]);assert.equal(p.positions[0],0);p.positions[0]=900;
  assert.equal(bridge.update([0,0]).frames,1);
  const snap=bridge.snapshot();snap.positions[0]=999;
  assert.equal(bridge.snapshot().positions[0],0);
});

test('M1.3 rejects invalid mapping, indices, attributes and nonfinite inputs before GPU writes',()=>{
  const {device,mesh,calls}=makeDevice();
  const src={evaluator,device,mesh,renderToMaster,triangles};
  assert.throws(()=>createMorphGpuBridge({...src,renderToMaster:new Int32Array([0,1,99])}),/RENDER_MAPPING_OUT_OF_BOUNDS/);
  assert.throws(()=>createMorphGpuBridge({...src,triangles:new Uint16Array([0,1,99])}),/TRIANGLE_INDEX_OUT_OF_BOUNDS/);
  assert.throws(()=>createMorphGpuBridge({...src,normalAttribute:'a_position'}),/ATTRIBUTE_NAMES_INVALID/);
  const bridge=createMorphGpuBridge(src);
  assert.throws(()=>bridge.update([Infinity,0]),/MORPH_WEIGHT_NONFINITE/);
  assert.deepEqual(calls,[]);assert.equal(bridge.snapshot().frames,0);
});

test('M1.3 second-attribute failure restores old normal and preserves frame count',()=>{
  const {d,bridge}=build({failOn:[2]});const before=bridge.snapshot();
  assert.throws(()=>bridge.update([1,0]),/INJECTED_GPU_FAILURE/);
  assert.equal(bridge.snapshot().frames,0);
  assert.deepEqual(d.state.get('a_normal'),before.normals);
  assert.equal(bridge.update([1,0]).frames,1);
});

test('M1.3 uncertain rollback quarantines bridge, preventing stale-geometry draw',()=>{
  const {bridge}=build({failOn:[2],failRollback:true});
  assert.throws(()=>bridge.update([1,0]),/MORPH_GPU_BRIDGE_ROLLBACK_FAILED/);
  assert.equal(bridge.snapshot().unhealthy,true);
  assert.throws(()=>bridge.update([0,0]),/MORPH_GPU_BRIDGE_UNHEALTHY/);
});

test('M1.3 context-loss update fails without advancement, then resumed device works',()=>{
  const {d,bridge}=build();d.setLost(true);
  assert.throws(()=>bridge.update([0,0]),/GRAPHICS_CONTEXT_LOST/);
  assert.equal(bridge.snapshot().frames,0);
  d.setLost(false);
  assert.equal(bridge.update([0,1]).frames,1);
});
