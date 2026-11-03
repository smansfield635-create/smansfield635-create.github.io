import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createNativeSpatialScene} from './dgb.native-scene-spatial.v1.mjs';
const sphere={center:[0,0,0],radius:0.3};
function draw(name='mesh',pass='OPAQUE',bounds=sphere){return {program:{gpu:{name}},mesh:{gpu:{name},definition:{vertexCount:3}},pass,bounds};}
function base({kind='PERSPECTIVE'}={}){const s=createNativeSpatialScene(),cam=s.createCamera({projection:kind,aspect:1,near:.1,far:50,fovY:Math.PI/2,orthoHeight:10});return {s,cam};}
const near=(a,b,eps=1e-6)=>assert.ok(Math.abs(a-b)<eps, `${a} !~= ${b}`);

test('camera and scene default to right-handed -Z forward, visible draw yields model/view/projection',()=>{
  const {s,cam}=base();const n=s.createNode({position:[0,0,-5]});s.setRenderable(n,draw());const r=s.collect(cam);
  assert.equal(r.visible,1);near(r.commands[0].modelMatrix[14],-5);near(r.viewMatrix[15],1);assert.ok(r.projectionMatrix[11]<0);assert.equal(r.culled,0);
});
test('parent/child translation and rotation compose column-major world matrix',()=>{
  const {s,cam}=base();const root=s.createNode({position:[2,0,0],rotation:[0,Math.SQRT1_2,0,Math.SQRT1_2]});
  const c=s.createNode({parent:root,position:[5,0,0]});s.setRenderable(c,draw());
  const r=s.collect(cam);assert.equal(r.visible,1);near(r.commands[0].modelMatrix[12],2);near(r.commands[0].modelMatrix[14],-5);
});
test('reparent updates world without changing local TRS and rejects ancestor cycle atomically',()=>{
  const {s,cam}=base();const a=s.createNode({position:[1,0,0]}),b=s.createNode({position:[2,0,0]});
  const n=s.createNode({parent:a,position:[0,0,-5]});s.setRenderable(n,draw());
  near(s.collect(cam).commands[0].modelMatrix[12],1);
  s.setParent(n,b);near(s.collect(cam).commands[0].modelMatrix[12],2);
  assert.throws(()=>s.setParent(b,n),/SCENE_CYCLE/);
  near(s.collect(cam).commands[0].modelMatrix[12],2);
  s.setParent(n,null);near(s.collect(cam).commands[0].modelMatrix[12],0);
});
test('different scene nodes and deleted nodes are rejected as foreign',()=>{
 const {s}=base(),t=createNativeSpatialScene(),n=s.createNode(),foreign=t.createNode();
 assert.throws(()=>s.setParent(n,foreign),/NODE_NOT_IN_SCENE/);
 s.removeNode(n);assert.throws(()=>s.setTransform(n,{position:[1,0,0]}),/NODE_NOT_IN_SCENE/);
});
test('finite transform and quaternion checks reject invalid values without changing matrices',()=>{
 const {s,cam}=base(),n=s.createNode({position:[0,0,-5]});s.setRenderable(n,draw());
 assert.throws(()=>s.setTransform(n,{position:[NaN,0,0]}),/POSITION_INVALID/);
 assert.throws(()=>s.setTransform(n,{rotation:[0,0,0,0]}),/QUATERNION_ZERO/);
 assert.throws(()=>s.setTransform(n,{scale:[1,0,1]}),/SCALE_ZERO/);
 near(s.collect(cam).commands[0].modelMatrix[14],-5);
});
test('perspective frustum excludes behind, side, near and far while retaining sphere overlap',()=>{
 const {s,cam}=base();for(const [name,p] of [['inside',[0,0,-5]],['behind',[0,0,4]],['side',[50,0,-5]],['near',[0,0,-.001]],['far',[0,0,-70]]]){let n=s.createNode({position:p});s.setRenderable(n,draw(name,'OPAQUE',name==='near'?{center:[0,0,0],radius:.01}:sphere));}
 const r=s.collect(cam);assert.deepEqual(r.commands.map(x=>x.program.gpu.name),['inside']);assert.equal(r.considered,5);assert.equal(r.culled,4);
});
test('camera local translation, world rotation, and ortho boundaries update visibility',()=>{
 const {s,cam}=base({kind:'ORTHOGRAPHIC'});
 const a=s.createNode({position:[0,0,-10]}),b=s.createNode({position:[10,0,-10]});s.setRenderable(a,draw('a'));s.setRenderable(b,draw('b'));
 assert.deepEqual(s.collect(cam).commands.map(x=>x.program.gpu.name),['a']);
 s.setTransform(cam,{position:[10,0,0]});assert.deepEqual(s.collect(cam).commands.map(x=>x.program.gpu.name),['b']);
 s.setTransform(cam,{position:[0,0,0],rotation:[0,1,0,0]});
 assert.equal(s.collect(cam).visible,0);
});
test('camera rejects invalid near/far/FOV/ortho/aspect atomically',()=>{
 const {s,cam}=base();
 assert.throws(()=>s.setCamera(cam,{near:0}),/CAMERA_RANGE_INVALID/);
 assert.throws(()=>s.setCamera(cam,{far:0.05}),/CAMERA_RANGE_INVALID/);
 assert.throws(()=>s.setCamera(cam,{fovY:Math.PI}),/CAMERA_FOV_INVALID/);
 assert.throws(()=>s.setCamera(cam,{projection:'ORTHOGRAPHIC',orthoHeight:0}),/CAMERA_ORTHO_INVALID/);
 assert.throws(()=>s.setCamera(cam,{aspect:0}),/CAMERA_RANGE_INVALID/);
 assert.equal(s.collect(cam).projectionMatrix[11],-1);
});
test('hidden parents and camera layer masks exclude subtrees',()=>{
 const {s,cam}=base();const root=s.createNode({layers:1}),child=s.createNode({parent:root,position:[0,0,-5],layers:1});s.setRenderable(child,draw());
 assert.equal(s.collect(cam).visible,1);
 s.setVisibility(root,false);assert.equal(s.collect(cam).visible,0);
 s.setVisibility(root,true);s.setCamera(cam,{layers:2});assert.equal(s.collect(cam).visible,0);
 s.setCamera(cam,{layers:1});assert.equal(s.collect(cam).visible,1);
 s.setLayers(root,2);assert.equal(s.collect(cam).visible,0);
});
test('conservative sphere bound includes nonuniformly scaled, sheared child at frustum edge',()=>{
 const {s,cam}=base(),root=s.createNode({scale:[6,1,1],rotation:[0,0,Math.SQRT1_2,Math.SQRT1_2]});
 const n=s.createNode({parent:root,position:[0,0,-8],rotation:[0,0,Math.SQRT1_2,Math.SQRT1_2]});
 s.setRenderable(n,draw('scaled','OPAQUE',{center:[0,0,0],radius:2}));
 assert.equal(s.collect(cam).visible,1);
});
test('depthKey uses view-space center and passes finite nonnegative values for transparent',()=>{
 const {s,cam}=base();s.setTransform(cam,{position:[0,0,3]});
 const n1=s.createNode({position:[0,0,-10]}),n2=s.createNode({position:[0,0,-3]});
 s.setRenderable(n1,draw('far','TRANSPARENT'));s.setRenderable(n2,draw('near','TRANSPARENT'));
 const r=s.collect(cam);assert.deepEqual(r.commands.map(x=>x.depthKey),[13,6]);
});
test('scene traversal retains deterministic parent-child order independent of E2 sorting',()=>{
 const {s,cam}=base(),a=s.createNode({position:[0,0,-5]}),b=s.createNode({position:[0,0,-6]});
 const c=s.createNode({parent:a});s.setRenderable(a,draw('a'));s.setRenderable(b,draw('b'));s.setRenderable(c,draw('c'));
 assert.deepEqual(s.collect(cam).commands.map(x=>x.program.gpu.name),['a','c','b']);
});
test('snapshot matrices are detached and scene transform remains authoritative',()=>{
 const {s,cam}=base(),n=s.createNode({position:[0,0,-5]});s.setRenderable(n,draw());
 const r=s.collect(cam);assert.throws(()=>{r.commands[0].modelMatrix[14]=2},TypeError);
 assert.throws(()=>r.commands.push('x'),TypeError);
 near(s.collect(cam).commands[0].modelMatrix[14],-5);
});
test('submit requires active E2 pipeline and matrix binder, forwards uniforms without drawing itself',()=>{
 const {s,cam}=base(),n=s.createNode({position:[0,0,-4]});let legacyCalled=0,bound=null;
 s.setRenderable(n,{...draw(),beforeDraw:()=>legacyCalled++});
 const packets=[],pipeline={status:()=>({active:true}),submit:q=>packets.push(q)};
 assert.throws(()=>s.submit({status:()=>({active:false}),submit:()=>{}},cam,{bindMatrices:()=>{}}),/E2_ACTIVE_PIPELINE_REQUIRED/);
 assert.throws(()=>s.submit(pipeline,cam),/MATRIX_BINDING_REQUIRED/);
 assert.deepEqual(s.submit(pipeline,cam,{bindMatrices:x=>bound=x}),{submitted:1,considered:1,culled:0});
 assert.equal(packets.length,1);packets[0].beforeDraw({tag:'GL'},{tag:'program'});
 near(bound.modelMatrix[14],-4);assert.ok(bound.modelViewProjection instanceof Float32Array);assert.equal(legacyCalled,1);
});

test('E3 forwards scoped afterDraw to the E2 command without changing matrix callbacks',()=>{
 const {s,cam}=base(),n=s.createNode({position:[0,0,-5]}),calls=[],submitted=[];
 const spec=draw();
 assert.throws(()=>s.setRenderable(n,{...spec,afterDraw:5}),/AFTER_DRAW_INVALID/);
 s.setRenderable(n,{...spec,beforeDraw:()=>calls.push('before'),afterDraw:()=>calls.push('after')});
 const pipeline={status:()=>({active:true}),submit:cmd=>submitted.push(cmd)};
 assert.equal(s.submit(pipeline,cam,{bindMatrices:()=>calls.push('matrix')}).submitted,1);
 assert.equal(submitted.length,1);
 submitted[0].beforeDraw({},{});submitted[0].afterDraw({},{});
 assert.deepEqual(calls,['matrix','before','after']);
});

test('remove subtree, camera visibility and dispose fail closed',()=>{
 const {s,cam}=base(),root=s.createNode({position:[0,0,-5]}),child=s.createNode({parent:root});s.setRenderable(child,draw());
 assert.equal(s.collect(cam).visible,1);s.removeNode(root);assert.equal(s.collect(cam).visible,0);
 s.setVisibility(cam,false);assert.throws(()=>s.collect(cam),/CAMERA_NOT_VISIBLE/);
 s.dispose();assert.throws(()=>s.createNode(),/SCENE_DISPOSED/);
});
