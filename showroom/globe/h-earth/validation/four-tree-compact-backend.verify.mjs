import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const source = resolve('showroom/globe/h-earth/render/compact-four-tree-foliage.v1.js');
const { FOUR_TREE_COMPACT_CONTRACT: c, validateFourTreeCompactPayload, createFourTreeCompactGpuBuffers } = await import(pathToFileURL(source).href);
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
const outstanding=['INTEGRATED_COLOR_PASS','INTEGRATED_STATIC_SHADOW_PASS','FOUR_FIXED_CAMERA_COMPARISONS','ACTUAL_GPU_ALLOCATION','HISTORICAL_AND_PAIRED_TIMING','EXPERIENCE_ANCHOR','PHONE_TABLET_OWNER_ACCEPTANCE'];
const receipt={schema:'H_EARTH_FOUR_TREE_COMPACT_BACKEND_VERIFICATION_v1',result:'INCOMPLETE_NOT_QUALIFIED',checks,outstanding,qualificationEstablished:false};
const index=process.argv.indexOf('--output');
if(index!==-1&&process.argv[index+1])writeFileSync(process.argv[index+1],JSON.stringify(receipt,null,2)+'\n');
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
if(checks.some(x=>x.result==='FAIL')||outstanding.length)process.exitCode=1;
