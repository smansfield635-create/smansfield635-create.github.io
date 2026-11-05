import test from 'node:test';
import assert from 'node:assert/strict';
import {E10_BROWSER_LAB_ID,E10_FRAME_LIMIT,E10_DEFAULT_SAMPLES,createDiagnosticFourLegFixture,
 createDiagnosticMeshDefinition,createE10DiagnosticFrameBank,createLabE3E4Binding,
 createE10DiagnosticBrowserLab} from './dgb.native-character-browser-lab.v1.mjs';

const identity=()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
test('actual adopted E10 six-module chain yields bounded moving, finite, indexed diagnostic geometry',()=>{
 const rig=createDiagnosticFourLegFixture(),g=createDiagnosticMeshDefinition(rig.skeleton);
 assert.equal(rig.gait.legCount,4);
 assert.equal(g.vertexCount,240);
 assert.equal(g.indices.length,360);
 assert.ok(g.indices.every(i=>i>=0&&i<g.vertexCount));
 const bank=createE10DiagnosticFrameBank();
 assert.equal(bank.labId,E10_BROWSER_LAB_ID);
 assert.equal(bank.frames.length,E10_DEFAULT_SAMPLES.length);
 assert.equal(bank.triangleCount,120);
 assert.ok(bank.frames.every(f=>f.positions.length===g.vertexCount*3&&f.normals.length===f.positions.length&&
   f.positions.every(Number.isFinite)&&f.normals.every(Number.isFinite)));
 assert.ok(bank.frames[0].positions.some((x,i)=>Math.abs(x-bank.frames[5].positions[i])>1e-4));
 assert.deepEqual(bank.frames[0].phases,['SWING','STANCE','SWING','STANCE']);
 assert.ok(Object.isFrozen(bank.frames[0].positions));
});
test('fixed bank rejects invalid time order, unbounded bank size and phase boundaries',()=>{
 assert.throws(()=>createE10DiagnosticFrameBank([]),/LAB_SAMPLES_INVALID/);
 assert.throws(()=>createE10DiagnosticFrameBank([.1,.1]),/LAB_SAMPLES_INVALID/);
 assert.throws(()=>createE10DiagnosticFrameBank(Array.from({length:E10_FRAME_LIMIT+1},(_,i)=>i/30)),/LAB_SAMPLES_INVALID/);
 assert.throws(()=>createE10DiagnosticFrameBank([.1,1]),/LAB_SAMPLES_INVALID/);
 assert.throws(()=>createE10DiagnosticFrameBank([.1,.35]),/CONTACT_PHASE_BOUNDARY_DISCONTINUITY/);
});
function mockBridge(){
 const log=[],program={gpu:{handle:1}},node={};
 let renderable=null;let used=0;
 const scene={setRenderable(_node,x){assert.equal(_node,node);renderable=x;log.push('select');}};
 const library={makeDrawBinding(_material,args){
    assert.equal(args.modelViewProjection.length,16);used++;
    return {program,beforeDraw(){log.push('E4-before');},afterDraw(){log.push('E4-after');}};
 }};
 const mesh={gpu:{}},bridge=createLabE3E4Binding(scene,node,library,{},mesh);
 return {bridge,log,program,get renderable(){return renderable;},get used(){return used;}};
}
test('E3 matrix callback feeds E4 cached owned program in exact before/after sequence',()=>{
 const f=mockBridge(),gl={};
 assert.equal(f.renderable.program,f.program);
 assert.throws(()=>f.renderable.beforeDraw(gl,f.program.gpu),/LAB_E3_MATRICES_MISSING/);
 f.bridge.bindMatrices({gl,programHandle:f.program.gpu,modelMatrix:identity(),modelViewProjection:identity()});
 assert.equal(f.bridge.status().matrixQueued,true);
 f.renderable.beforeDraw(gl,f.program.gpu);
 f.renderable.afterDraw(gl,f.program.gpu);
 assert.equal(f.used,2);
 assert.deepEqual(f.log,['select','E4-before','E4-after']);
 assert.deepEqual(f.bridge.status(),{bindCount:1,drawCount:1,cleanupCount:1,matrixQueued:false,bindingActive:false});
});
test('E3/E4 stale program, unconsumed matrix and foreign mesh fail closed',()=>{
 const f=mockBridge(),gl={};
 assert.throws(()=>f.bridge.bindMatrices({gl,programHandle:{},modelMatrix:identity(),modelViewProjection:identity()}),/LAB_E3_PROGRAM_CONTEXT_MISMATCH/);
 assert.throws(()=>f.bridge.selectMesh({}),/LAB_E1_MESH_REQUIRED/);
 assert.throws(()=>f.bridge.bindMatrices({gl,programHandle:f.program.gpu,modelMatrix:[1],modelViewProjection:identity()}),/LAB_E3_MATRIX_INVALID/);
 f.bridge.bindMatrices({gl,programHandle:f.program.gpu,modelMatrix:identity(),modelViewProjection:identity()});
 assert.throws(()=>f.bridge.bindMatrices({gl,programHandle:f.program.gpu,modelMatrix:identity(),modelViewProjection:identity()}),/LAB_E3_MATRICES_NOT_CONSUMED/);
 f.renderable.beforeDraw(gl,f.program.gpu);
 f.renderable.afterDraw(gl,f.program.gpu);
});
test('browser entry validates canvas/backend before attempting WebGL; mock is not visual acceptance',()=>{
 assert.throws(()=>createE10DiagnosticBrowserLab(null),/LAB_CANVAS_REQUIRED/);
 assert.throws(()=>createE10DiagnosticBrowserLab({getContext(){}},{backend:'WEBGPU'}),/LAB_BACKEND_INVALID/);
});
