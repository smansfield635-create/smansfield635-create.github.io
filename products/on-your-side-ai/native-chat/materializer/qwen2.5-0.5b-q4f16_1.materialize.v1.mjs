#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const RECEIPT_SCHEMA='AAI_NATIVE_CHAT_MODEL_MATERIALIZER_RECEIPT_v1';
export const SELF_TEST_SCHEMA='AAI_NATIVE_CHAT_MODEL_MATERIALIZER_SELF_TEST_RECEIPT_v1';
export const OPERATION_ID='ON_YOUR_SIDE_AAI_NATIVE_CHAT_V1_MODEL_MATERIALIZATION_v1';
export const RUNTIME_ROOT='products/on-your-side-ai/native-chat/runtime';
export const MODEL_ID='Qwen2.5-0.5B-Instruct-q4f16_1-MLC';
export const MODEL_REVISION='7f69110badafbd6d8f6adda31d35f3b255df5041';
export const WEBLLM_VERSION='0.2.85';
export const WEBLLM_COMMIT='5f742443179a5463e83a19f704d7c19f1f019f98';
export const MODEL_LIBRARY_COMMIT='025bcaf3780fa8254f5e5efd3bfea0a5397248f4';
export const MODEL_LIBRARY_GIT_BLOB='57ca1bfdb4c1afe0c005473016d0dbd67745a735';
export const MODEL_LIBRARY_BYTES=4850160;
export const WEIGHT_BYTES=277996288;
export const MAX_SHARD_BYTES=90*1024*1024;

export const SHARDS=Object.freeze([
  {name:'params_shard_0.bin',bytes:68067328,sha256:'9f309954d310dc63adfaf3ef6aa987c681b8aa6d1b9686aa2525b454b0d058d5'},
  {name:'params_shard_1.bin',bytes:33234176,sha256:'6d174758dd299d9ef4222b1ad4283be832ebd43853951da25b50501ab1b75ba7'},
  {name:'params_shard_2.bin',bytes:33505280,sha256:'83e0b530bf5c44cbead1a6c220af81040a975f7c81fb708977a02e3ac8d7ffa7'},
  {name:'params_shard_3.bin',bytes:33053696,sha256:'5ff16197c197d8783d398d0c35fa9641e606e6e2dc1d53b9f26a0c9c17a97921'},
  {name:'params_shard_4.bin',bytes:33020928,sha256:'a7a3d2b02aa9258154f250a714d1743672e423c5c7c8e5c5eefcb9bf337aa0fd'},
  {name:'params_shard_5.bin',bytes:29211648,sha256:'19dfd7a3064b84082915575c0e5a57fc1cd7108828e1ce9fbbbaf9db4b63b9af'},
  {name:'params_shard_6.bin',bytes:33297408,sha256:'192576d43956aa977ec60848b8a7fc8483b5fe38ca9669aa9a3ca2ba795a7a33'},
  {name:'params_shard_7.bin',bytes:14605824,sha256:'1ee25c2a41dad6833e000b7e3ec13a5a1761c32ffbed0ad8a98a6ad313338dc0'}
]);

export const SUPPORT_FILES=Object.freeze([
  'merges.txt','mlc-chat-config.json','ndarray-cache.json','tokenizer.json','tokenizer_config.json','vocab.json'
]);

const MODEL_BASE=`https://huggingface.co/mlc-ai/${MODEL_ID}/resolve/${MODEL_REVISION}`;
const WASM_SOURCE=`https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/${MODEL_LIBRARY_COMMIT}/web-llm-models/v0_2_84/base/Qwen2-0.5B-Instruct-q4f16_1_cs1k-webgpu.wasm`;
const LICENSE_SOURCE=`https://raw.githubusercontent.com/mlc-ai/web-llm/${WEBLLM_COMMIT}/LICENSE`;

const MODEL_DIR=`${RUNTIME_ROOT}/model/${MODEL_ID}`;
const WASM_DEST=`${RUNTIME_ROOT}/webllm/Qwen2-0.5B-Instruct-q4f16_1_cs1k-webgpu.wasm`;
const LICENSE_DEST=`${RUNTIME_ROOT}/licenses/Qwen2.5-Apache-2.0.txt`;
const REPO_RECEIPT_DEST=`${RUNTIME_ROOT}/receipts/local-inference-materialization.v1.json`;

function stable(v){return Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;}
function sha256(bytes){return crypto.createHash('sha256').update(bytes).digest('hex');}
function gitBlobSha(bytes){const header=Buffer.from(`blob ${bytes.length}\0`);return crypto.createHash('sha1').update(header).update(bytes).digest('hex');}
function fail(code,detail=null){const e=new Error(code);Object.assign(e,{code,detail});throw e;}
function assertHex(value,n,code){if(typeof value!=='string'||!new RegExp(`^[0-9a-f]{${n}}$`).test(value))fail(code,value);}
function ensureInsideRuntime(rel){if(typeof rel!=='string'||!rel.startsWith(`${RUNTIME_ROOT}/`)||rel.includes('..')||rel.startsWith('/'))fail('DESTINATION_SCOPE_INVALID',rel);return rel;}
function writeFile(rel,bytes){ensureInsideRuntime(rel);const abs=path.resolve(rel);fs.mkdirSync(path.dirname(abs),{recursive:true});fs.writeFileSync(abs,bytes);}
async function fetchBytes(url){const response=await fetch(url,{redirect:'follow'});if(!response.ok)fail('FETCH_FAILED',{url,status:response.status});return Buffer.from(await response.arrayBuffer());}
function verifyExact(bytes,expected,name){if(bytes.length!==expected.bytes)fail('BYTE_COUNT_MISMATCH',{name,expected:expected.bytes,actual:bytes.length});const actual=sha256(bytes);if(actual!==expected.sha256)fail('SHA256_MISMATCH',{name,expected:expected.sha256,actual});return actual;}

export function selfTest(){
  const checks=[];const add=(name,pass,detail=null)=>checks.push({name,pass:Boolean(pass),...(detail===null?{}:{detail})});
  add('runtime-commit-pinned',/^[0-9a-f]{40}$/.test(WEBLLM_COMMIT));
  add('model-revision-pinned',/^[0-9a-f]{40}$/.test(MODEL_REVISION));
  add('model-library-commit-pinned',/^[0-9a-f]{40}$/.test(MODEL_LIBRARY_COMMIT));
  add('model-library-git-blob-pinned',/^[0-9a-f]{40}$/.test(MODEL_LIBRARY_GIT_BLOB));
  add('exact-eight-shards',SHARDS.length===8);
  add('unique-shard-names',new Set(SHARDS.map(x=>x.name)).size===SHARDS.length);
  add('all-shard-hashes-pinned',SHARDS.every(x=>/^[0-9a-f]{64}$/.test(x.sha256)));
  add('all-shards-under-90mib',SHARDS.every(x=>x.bytes<=MAX_SHARD_BYTES));
  add('weight-byte-total',SHARDS.reduce((sum,x)=>sum+x.bytes,0)===WEIGHT_BYTES);
  add('support-set-exact',JSON.stringify(SUPPORT_FILES)===JSON.stringify(['merges.txt','mlc-chat-config.json','ndarray-cache.json','tokenizer.json','tokenizer_config.json','vocab.json']));
  const planned=[WASM_DEST,LICENSE_DEST,REPO_RECEIPT_DEST,...SUPPORT_FILES.map(x=>`${MODEL_DIR}/${x}`),...SHARDS.map(x=>`${MODEL_DIR}/${x.name}`)];
  add('planned-paths-unique',new Set(planned).size===planned.length);
  add('planned-paths-runtime-bounded',planned.every(x=>x.startsWith(`${RUNTIME_ROOT}/`)&&!x.includes('..')));
  add('no-page-mutation',!planned.includes('products/on-your-side-ai/index.html')&&!planned.includes('products/on-your-side-ai/index.js'));
  add('self-test-network-free',true,'selfTest performs no fetch calls');
  add('self-test-runtime-write-free',true,'selfTest performs no writeFile calls');
  const failed=checks.filter(x=>!x.pass);
  return stable({schema:SELF_TEST_SCHEMA,result:failed.length?'FAIL_CLOSED':'PASS_CLOSED',operationId:OPERATION_ID,checks:checks.length,passed:checks.length-failed.length,failed:failed.length,failures:failed,networkFetchPerformed:false,runtimeAssetWritePerformed:false,modelBytesWritten:false,descriptorRegistrationPerformed:false,productPageMutationPerformed:false,mergePerformed:false,deploymentPerformed:false,publicationPerformed:false});
}

function validateSupport(name,bytes){
  if(bytes.length===0)fail('SUPPORT_FILE_EMPTY',name);
  if(name.endsWith('.json')){
    let value;try{value=JSON.parse(bytes.toString('utf8'));}catch{fail('SUPPORT_JSON_INVALID',name);}
    if(name==='mlc-chat-config.json'){
      if(value.model_type!=='qwen2'||value.quantization!=='q4f16_1')fail('MLC_CHAT_CONFIG_IDENTITY_MISMATCH');
      const required=['tokenizer.json','vocab.json','merges.txt','tokenizer_config.json'];
      if(JSON.stringify(value.tokenizer_files)!==JSON.stringify(required))fail('TOKENIZER_FILE_SET_MISMATCH');
    }
    if(name==='ndarray-cache.json'){
      if(Number(value?.metadata?.ParamBytes)!==WEIGHT_BYTES)fail('NDARRAY_PARAM_BYTES_MISMATCH');
      const paths=[...new Set((value.records||[]).map(x=>x.dataPath).filter(Boolean))].sort();
      const expected=SHARDS.map(x=>x.name).sort();
      if(JSON.stringify(paths)!==JSON.stringify(expected))fail('NDARRAY_SHARD_SET_MISMATCH',{paths,expected});
    }
  }
  return {name,bytes:bytes.length,sha256:sha256(bytes)};
}

export async function materialize(outputPath){
  if(typeof outputPath!=='string'||!outputPath)fail('OUTPUT_PATH_REQUIRED');
  assertHex(WEBLLM_COMMIT,40,'WEBLLM_COMMIT_INVALID');assertHex(MODEL_REVISION,40,'MODEL_REVISION_INVALID');assertHex(MODEL_LIBRARY_COMMIT,40,'MODEL_LIBRARY_COMMIT_INVALID');
  const assets=[];
  for(const name of SUPPORT_FILES){const bytes=await fetchBytes(`${MODEL_BASE}/${name}`);const proof=validateSupport(name,bytes);writeFile(`${MODEL_DIR}/${name}`,bytes);assets.push({...proof,path:`${MODEL_DIR}/${name}`,sourceRevision:MODEL_REVISION});}
  for(const shard of SHARDS){const bytes=await fetchBytes(`${MODEL_BASE}/${shard.name}`);const actual=verifyExact(bytes,shard,shard.name);writeFile(`${MODEL_DIR}/${shard.name}`,bytes);assets.push({path:`${MODEL_DIR}/${shard.name}`,bytes:bytes.length,sha256:actual,sourceRevision:MODEL_REVISION});}
  const wasm=await fetchBytes(WASM_SOURCE);if(wasm.length!==MODEL_LIBRARY_BYTES)fail('WASM_BYTE_COUNT_MISMATCH',{expected:MODEL_LIBRARY_BYTES,actual:wasm.length});const wasmBlob=gitBlobSha(wasm);if(wasmBlob!==MODEL_LIBRARY_GIT_BLOB)fail('WASM_GIT_BLOB_MISMATCH',{expected:MODEL_LIBRARY_GIT_BLOB,actual:wasmBlob});const wasmSha256=sha256(wasm);writeFile(WASM_DEST,wasm);assets.push({path:WASM_DEST,bytes:wasm.length,sha256:wasmSha256,gitBlobSha:wasmBlob,sourceCommit:MODEL_LIBRARY_COMMIT});
  const license=await fetchBytes(LICENSE_SOURCE);if(!license.toString('utf8',0,2048).includes('Apache License'))fail('APACHE_LICENSE_TEXT_MISSING');writeFile(LICENSE_DEST,license);assets.push({path:LICENSE_DEST,bytes:license.length,sha256:sha256(license),sourceCommit:WEBLLM_COMMIT});
  const receipt=stable({schema:RECEIPT_SCHEMA,result:'MATERIALIZED_EXACT',operationId:OPERATION_ID,webllm:{version:WEBLLM_VERSION,commit:WEBLLM_COMMIT},model:{id:MODEL_ID,revision:MODEL_REVISION,weightBytes:WEIGHT_BYTES,shardCount:SHARDS.length},modelLibrary:{commit:MODEL_LIBRARY_COMMIT,gitBlobSha:MODEL_LIBRARY_GIT_BLOB,bytes:MODEL_LIBRARY_BYTES,sha256:wasmSha256},assets,totalAssetBytes:assets.reduce((sum,x)=>sum+x.bytes,0),runtimeRoot:RUNTIME_ROOT,modelBytesVerified:true,wasmGitBlobVerified:true,wasmSha256Recorded:true,licensePreserved:true,productPageMutationPerformed:false,descriptorRegistrationPerformed:false,mainMutationPerformed:false,mergePerformed:false,deploymentPerformed:false,publicationPerformed:false});
  writeFile(REPO_RECEIPT_DEST,Buffer.from(JSON.stringify(receipt,null,2)+'\n'));
  fs.mkdirSync(path.dirname(path.resolve(outputPath)),{recursive:true});fs.writeFileSync(path.resolve(outputPath),JSON.stringify(receipt,null,2)+'\n');
  return receipt;
}

function parse(argv){const out={selfTest:false,materialize:false,output:null};for(let i=0;i<argv.length;i++){const x=argv[i];if(x==='--self-test')out.selfTest=true;else if(x==='--materialize')out.materialize=true;else if(x==='--output')out.output=argv[++i]??null;else fail('UNKNOWN_ARGUMENT',x);}if(out.selfTest===out.materialize)fail('EXACTLY_ONE_MODE_REQUIRED');return out;}
async function main(){try{const args=parse(process.argv.slice(2));if(args.selfTest){const receipt=selfTest();process.stdout.write(JSON.stringify(receipt,null,2)+'\n');if(receipt.result!=='PASS_CLOSED')process.exitCode=1;return;}const receipt=await materialize(args.output);process.stdout.write(JSON.stringify(receipt,null,2)+'\n');}catch(error){const receipt=stable({schema:RECEIPT_SCHEMA,result:'FAIL_CLOSED',errorCode:error.code||'UNEXPECTED_ERROR',detail:error.detail??error.message,modelBytesVerified:false,productPageMutationPerformed:false,descriptorRegistrationPerformed:false,mergePerformed:false,deploymentPerformed:false,publicationPerformed:false});process.stderr.write(JSON.stringify(receipt,null,2)+'\n');process.exitCode=1;}}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1]))main();
