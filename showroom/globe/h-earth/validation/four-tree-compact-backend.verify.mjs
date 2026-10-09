import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const source = resolve('showroom/globe/h-earth/render/compact-four-tree-foliage.v1.js');
const { FOUR_TREE_COMPACT_CONTRACT: c, validateFourTreeCompactPayload, createFourTreeCompactGpuBuffers, validateFourTreeCompactDrawBudget, createFourTreeCompactDrawView } = await import(pathToFileURL(source).href);
const checks = [];
function check(name, fn) {
  try { fn(); checks.push({name, result:'PASS'}); }
  catch (e) { checks.push({name, result:'FAIL', error:String(e)}); }
}
check('FOUR_TARGET_IDENTITIES',()=>assert.deepEqual(c.targets,['P2_TREE_A_03','P2_TREE_A_06','P2_TREE_A_08','P2_TREE_A_11']));
check('PACKED_BYTE_ACCOUNTING',()=>assert.equal(c.leafCount*c.compactRecordBytes,c.compactBufferBytes));
check('SIDECAR_BYTE_ACCOUNTING',()=>assert.equal(c.leafCount*c.sidecarRecordBytes,c.sidecarBufferBytes));
check('PAYLOAD_VALIDATION',()=>assert.equal(validateFourTreeCompactPayload({compactRecords:new Uint8Array(172032),contactSidecar:new Uint8Array(229376)}).totalBytes,401408));
check('GPU_BUFFER_ALLOCATION_AND_CLEANUP',()=>{
  const calls={created:[],uploaded:[],deleted:[],bound:[]};
  const gl={ARRAY_BUFFER:34962,STATIC_DRAW:35044,
    createBuffer(){const b={id:calls.created.length};calls.created.push(b);return b;},
    bindBuffer(target,buffer){calls.bound.push([target,buffer]);},
    bufferData(target,bytes,usage){calls.uploaded.push([target,bytes.byteLength,usage]);},
    deleteBuffer(buffer){calls.deleted.push(buffer);}};
  const gpu=createFourTreeCompactGpuBuffers(gl,{compactRecords:new Uint8Array(172032),contactSidecar:new Uint8Array(229376)});
  assert.deepEqual(calls.uploaded.map(x=>x[1]),[172032,229376]);
  assert.equal(gpu.accounting.actualUploadedBytes,401408);
  assert.equal(gpu.accounting.bufferCount,2);
  gpu.dispose();gpu.dispose();assert.equal(calls.deleted.length,2);
});
check('GPU_ALLOCATION_FAILURE_ROLLBACK',()=>{
  let created=0,deleted=0;
  const gl={ARRAY_BUFFER:34962,STATIC_DRAW:35044,
    createBuffer(){created++;return {created};},bindBuffer(){},
    bufferData(){if(created===2)throw Error('SIMULATED_UPLOAD_FAILURE');},
    deleteBuffer(){deleted++;}};
  assert.throws(()=>createFourTreeCompactGpuBuffers(gl,{compactRecords:new Uint8Array(172032),contactSidecar:new Uint8Array(229376)}),/SIMULATED_UPLOAD_FAILURE/);
  assert.equal(deleted,2);
});
check('DRAW_BUDGET_LIMITS',()=>{
 const valid={addedGpuBytes:401408,addedMainDraws:4,addedShadowDraws:4,addedPrograms:2,addedBuffers:3,addedVertexArrays:1,addedTextures:0,addedFramebuffers:0};
 assert.equal(validateFourTreeCompactDrawBudget(valid).eligible,true);
 const limits={addedGpuBytes:c.maxAddedGpuBytes,addedMainDraws:c.maxAddedMainDraws,addedShadowDraws:c.maxAddedShadowDraws,addedPrograms:c.maxAddedPrograms,addedBuffers:c.maxAddedBuffers,addedVertexArrays:c.maxAddedVertexArrays,addedTextures:c.maxAddedTextures,addedFramebuffers:c.maxAddedFramebuffers};
 for(const key of Object.keys(valid))assert.throws(()=>validateFourTreeCompactDrawBudget({...valid,[key]:limits[key]+1}),/FOUR_TREE_COMPACT_RESOURCE_BUDGET/);
});
check('DRAW_VIEW_ALLOCATION_AND_CLEANUP',()=>{
 let next=0;const deleted=[];const uploads=[];
 const gl={ELEMENT_ARRAY_BUFFER:34963,STATIC_DRAW:35044,UNSIGNED_SHORT:5123,UNSIGNED_INT:5125,
 createVertexArray(){return {id:++next};},createBuffer(){return {id:++next};},bindVertexArray(){},bindBuffer(){},
 bufferData(target,data){uploads.push([target,data.byteLength]);},enableVertexAttribArray(){},vertexAttribIPointer(){},vertexAttribDivisor(){},deleteBuffer(x){deleted.push(['buffer',x.id]);},deleteVertexArray(x){deleted.push(['vao',x.id]);}};
 const compactBuffer={id:100},sidecarBuffer={id:101},attributes=[],divisors=[];
 gl.ARRAY_BUFFER=34962;gl.UNSIGNED_INT=5125;
 gl.enableVertexAttribArray=location=>attributes.push(['enable',location]);
 gl.vertexAttribIPointer=(...args)=>attributes.push(['pointer',...args]);
 gl.vertexAttribDivisor=(...args)=>divisors.push(args);
 const view=createFourTreeCompactDrawView(gl,{compactBuffer,contactSidecarBuffer:sidecarBuffer,indexData:new Uint32Array([0,1,2,2,1,3]),program:{}});
 assert.deepEqual(attributes,[['enable',10],['pointer',10,4,gl.UNSIGNED_INT,24,0],['enable',11],['pointer',11,2,gl.UNSIGNED_INT,24,16],['enable',12],['pointer',12,4,gl.UNSIGNED_INT,32,0],['enable',13],['pointer',13,4,gl.UNSIGNED_INT,32,16]]);
 assert.deepEqual(divisors,[[10,1],[11,1],[12,1],[13,1]]);
 assert.equal(view.indexCount,6);assert.equal(view.allocatedIndexBytes,24);
 assert.deepEqual(uploads,[[gl.ELEMENT_ARRAY_BUFFER,24]]);
 view.dispose();view.dispose();assert.equal(deleted.length,2);
});
check('INVALID_QUAD_REJECTED_BEFORE_GPU_ALLOCATION',()=>{
 let allocations=0;
 const gl={createVertexArray(){allocations++;return {};}};
 assert.throws(()=>createFourTreeCompactDrawView(gl,{compactBuffer:{},contactSidecarBuffer:{},indexData:new Uint16Array([0,1,2]),program:{}}),/QUAD_INDEX_CONTRACT/);
 assert.equal(allocations,0);
});
check('DEGENERATE_QUAD_REJECTED_BEFORE_GPU_ALLOCATION',()=>{
 let allocations=0;
 const gl={createVertexArray(){allocations++;return {};}};
 for(const indices of [[0,1,1,2,1,3],[0,1,2,0,1,2]]) {
   assert.throws(()=>createFourTreeCompactDrawView(gl,{compactBuffer:{},contactSidecarBuffer:{},
     indexData:new Uint32Array(indices),program:{}}),/QUAD_TOPOLOGY/);
 }
 assert.equal(allocations,0);
});
check('INSTANCED_DRAW',()=>{
 const draws=[];
 const gl={ELEMENT_ARRAY_BUFFER:34963,ARRAY_BUFFER:34962,STATIC_DRAW:35044,UNSIGNED_INT:5125,TRIANGLES:4,
 createVertexArray:()=>({}),createBuffer:()=>({}),bindVertexArray:()=>{},bindBuffer:()=>{},
 bufferData:()=>{},enableVertexAttribArray:()=>{},vertexAttribIPointer:()=>{},vertexAttribDivisor:()=>{},
 useProgram:()=>{},drawElementsInstanced:(...args)=>draws.push(args),deleteBuffer:()=>{},deleteVertexArray:()=>{}};
 const view=createFourTreeCompactDrawView(gl,{compactBuffer:{},contactSidecarBuffer:{},
 indexData:new Uint32Array([0,1,2,2,1,3]),program:{}});
 assert.equal(view.draw(7168).submittedTriangles,14336);
 assert.deepEqual(draws,[[4,6,5125,0,7168]]);
 assert.throws(()=>view.draw(7169),/INSTANCE_COUNT/);
 view.dispose();
 assert.throws(()=>view.draw(),/VIEW_DISPOSED/);
});
const outstanding=['INTEGRATED_COLOR_PASS','INTEGRATED_STATIC_SHADOW_PASS','FOUR_FIXED_CAMERA_COMPARISONS','ACTUAL_GPU_ALLOCATION','HISTORICAL_AND_PAIRED_TIMING','EXPERIENCE_ANCHOR','PHONE_TABLET_OWNER_ACCEPTANCE'];
const receipt={schema:'H_EARTH_FOUR_TREE_COMPACT_BACKEND_VERIFICATION_v1',result:'INCOMPLETE_NOT_QUALIFIED',checks,outstanding,qualificationEstablished:false};
const index=process.argv.indexOf('--output');
if(index!==-1&&process.argv[index+1])writeFileSync(process.argv[index+1],JSON.stringify(receipt,null,2)+'\n');
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
if(checks.some(x=>x.result==='FAIL')||outstanding.length)process.exitCode=1;
