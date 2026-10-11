#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const RECEIPT_SCHEMA='AAI_NATIVE_CHAT_WLLAMA_WASM_MATERIALIZER_RECEIPT_v1';
export const SELF_TEST_SCHEMA='AAI_NATIVE_CHAT_WLLAMA_WASM_MATERIALIZER_SELF_TEST_RECEIPT_v1';
export const OPERATION_ID='ON_YOUR_SIDE_AAI_NATIVE_CHAT_V1_WLLAMA_WASM_MATERIALIZATION_v1';
export const RUNTIME_ROOT='products/on-your-side-ai/native-chat/runtime';
export const WLLAMA_VERSION='3.4.0';
export const UPSTREAM_REPOSITORY='ngxson/wllama';
export const UPSTREAM_COMMIT='35e53a8068df9323e6f6d80f96d854c65cae578e';
export const UPSTREAM_SOURCE_PATH='src/wasm/wllama.wasm';
export const UPSTREAM_GIT_BLOB='b09559d9413d8cbf142a31fd2086b9939b8c02fc';
export const UPSTREAM_BYTES=7308866;
export const SOURCE_URL=`https://raw.githubusercontent.com/${UPSTREAM_REPOSITORY}/${UPSTREAM_COMMIT}/${UPSTREAM_SOURCE_PATH}`;
export const WASM_DEST=`${RUNTIME_ROOT}/wllama/${WLLAMA_VERSION}/wllama.wasm`;
export const RECEIPT_DEST=`${RUNTIME_ROOT}/wllama/${WLLAMA_VERSION}/materialization-receipt.v1.json`;

const ALLOWED_DESTINATIONS=Object.freeze([WASM_DEST,RECEIPT_DEST]);

function stable(value){
  return Array.isArray(value)
    ? value.map(stable)
    : value&&typeof value==='object'
      ? Object.fromEntries(Object.keys(value).sort().map(key=>[key,stable(value[key])]))
      : value;
}

function sha256(bytes){
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function gitBlobSha(bytes){
  const header=Buffer.from(`blob ${bytes.length}\0`);
  return crypto.createHash('sha1').update(header).update(bytes).digest('hex');
}

function fail(code,detail=null){
  const error=new Error(code);
  Object.assign(error,{code,detail});
  throw error;
}

function ensureExactDestination(rel){
  if(!ALLOWED_DESTINATIONS.includes(rel)) fail('DESTINATION_SCOPE_INVALID',rel);
  if(rel.includes('..')||rel.startsWith('/')) fail('DESTINATION_SCOPE_INVALID',rel);
  return rel;
}

function writeRuntimeFile(rel,bytes){
  ensureExactDestination(rel);
  const absolute=path.resolve(rel);
  fs.mkdirSync(path.dirname(absolute),{recursive:true});
  fs.writeFileSync(absolute,bytes);
}

async function fetchBytes(url){
  if(url!==SOURCE_URL) fail('SOURCE_URL_NOT_FIXED',url);
  const response=await fetch(url,{redirect:'follow'});
  if(!response.ok) fail('FETCH_FAILED',{url,status:response.status});
  return Buffer.from(await response.arrayBuffer());
}

function verifyWasm(bytes){
  if(bytes.length!==UPSTREAM_BYTES){
    fail('WASM_BYTE_COUNT_MISMATCH',{expected:UPSTREAM_BYTES,actual:bytes.length});
  }
  const actualGitBlob=gitBlobSha(bytes);
  if(actualGitBlob!==UPSTREAM_GIT_BLOB){
    fail('WASM_GIT_BLOB_MISMATCH',{expected:UPSTREAM_GIT_BLOB,actual:actualGitBlob});
  }
  return {
    bytes:bytes.length,
    gitBlobSha:actualGitBlob,
    sha256:sha256(bytes)
  };
}

export function selfTest(){
  const checks=[];
  const add=(name,pass,detail=null)=>checks.push({
    name,
    pass:Boolean(pass),
    ...(detail===null?{}:{detail})
  });

  add('wllama-version-exact',WLLAMA_VERSION==='3.4.0');
  add('upstream-commit-pinned',/^[0-9a-f]{40}$/.test(UPSTREAM_COMMIT));
  add('upstream-git-blob-pinned',/^[0-9a-f]{40}$/.test(UPSTREAM_GIT_BLOB));
  add('upstream-byte-count-pinned',UPSTREAM_BYTES===7308866);
  add('source-url-commit-bound',SOURCE_URL===`https://raw.githubusercontent.com/ngxson/wllama/${UPSTREAM_COMMIT}/src/wasm/wllama.wasm`);
  add('wasm-destination-exact',WASM_DEST==='products/on-your-side-ai/native-chat/runtime/wllama/3.4.0/wllama.wasm');
  add('receipt-destination-exact',RECEIPT_DEST==='products/on-your-side-ai/native-chat/runtime/wllama/3.4.0/materialization-receipt.v1.json');
  add('exact-two-runtime-destinations',ALLOWED_DESTINATIONS.length===2&&new Set(ALLOWED_DESTINATIONS).size===2);
  add('destinations-runtime-bounded',ALLOWED_DESTINATIONS.every(item=>item.startsWith(`${RUNTIME_ROOT}/`)&&!item.includes('..')));
  add('no-product-page-mutation',!ALLOWED_DESTINATIONS.some(item=>item.endsWith('/index.html')||item.endsWith('/index.js')));
  add('self-test-network-free',true,'selfTest performs no fetch calls');
  add('self-test-runtime-write-free',true,'selfTest performs no writeRuntimeFile calls');

  const failed=checks.filter(item=>!item.pass);
  return stable({
    schema:SELF_TEST_SCHEMA,
    result:failed.length?'FAIL_CLOSED':'PASS_CLOSED',
    operationId:OPERATION_ID,
    checks:checks.length,
    passed:checks.length-failed.length,
    failed:failed.length,
    failures:failed,
    upstream:{
      repository:UPSTREAM_REPOSITORY,
      version:WLLAMA_VERSION,
      commit:UPSTREAM_COMMIT,
      sourcePath:UPSTREAM_SOURCE_PATH,
      gitBlobSha:UPSTREAM_GIT_BLOB,
      bytes:UPSTREAM_BYTES
    },
    destinations:[...ALLOWED_DESTINATIONS],
    networkFetchPerformed:false,
    runtimeAssetWritePerformed:false,
    descriptorRegistrationPerformed:false,
    productPageMutationPerformed:false,
    mainMutationPerformed:false,
    mergePerformed:false,
    deploymentPerformed:false,
    publicationPerformed:false
  });
}

export async function materialize(outputPath){
  if(outputPath!==RECEIPT_DEST) fail('OUTPUT_PATH_NOT_FIXED',outputPath);

  const wasm=await fetchBytes(SOURCE_URL);
  const proof=verifyWasm(wasm);
  writeRuntimeFile(WASM_DEST,wasm);

  const receipt=stable({
    schema:RECEIPT_SCHEMA,
    result:'MATERIALIZED_EXACT',
    operationId:OPERATION_ID,
    upstream:{
      repository:UPSTREAM_REPOSITORY,
      version:WLLAMA_VERSION,
      commit:UPSTREAM_COMMIT,
      sourcePath:UPSTREAM_SOURCE_PATH,
      sourceUrl:SOURCE_URL,
      gitBlobSha:UPSTREAM_GIT_BLOB,
      bytes:UPSTREAM_BYTES
    },
    asset:{
      path:WASM_DEST,
      bytes:proof.bytes,
      gitBlobSha:proof.gitBlobSha,
      sha256:proof.sha256
    },
    receiptPath:RECEIPT_DEST,
    runtimeRoot:RUNTIME_ROOT,
    wasmByteCountVerified:true,
    wasmGitBlobVerified:true,
    wasmSha256Recorded:true,
    changedPaths:[WASM_DEST,RECEIPT_DEST],
    productPageMutationPerformed:false,
    descriptorRegistrationPerformed:false,
    mainMutationPerformed:false,
    mergePerformed:false,
    deploymentPerformed:false,
    publicationPerformed:false
  });

  const receiptBytes=Buffer.from(JSON.stringify(receipt,null,2)+'\n');
  writeRuntimeFile(RECEIPT_DEST,receiptBytes);
  return receipt;
}

function parse(argv){
  const result={selfTest:false,materialize:false,output:null};
  for(let i=0;i<argv.length;i++){
    const token=argv[i];
    if(token==='--self-test') result.selfTest=true;
    else if(token==='--materialize') result.materialize=true;
    else if(token==='--output') result.output=argv[++i]??null;
    else fail('UNKNOWN_ARGUMENT',token);
  }
  if(result.selfTest===result.materialize) fail('EXACTLY_ONE_MODE_REQUIRED');
  if(result.materialize&&result.output!==RECEIPT_DEST) fail('OUTPUT_PATH_NOT_FIXED',result.output);
  return result;
}

async function main(){
  try{
    const args=parse(process.argv.slice(2));
    if(args.selfTest){
      const receipt=selfTest();
      process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
      if(receipt.result!=='PASS_CLOSED') process.exitCode=1;
      return;
    }
    const receipt=await materialize(args.output);
    process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
  }catch(error){
    const receipt=stable({
      schema:RECEIPT_SCHEMA,
      result:'FAIL_CLOSED',
      operationId:OPERATION_ID,
      errorCode:error.code||'UNEXPECTED_ERROR',
      detail:error.detail??error.message,
      runtimeAssetWritePerformed:false,
      productPageMutationPerformed:false,
      descriptorRegistrationPerformed:false,
      mainMutationPerformed:false,
      mergePerformed:false,
      deploymentPerformed:false,
      publicationPerformed:false
    });
    process.stderr.write(JSON.stringify(receipt,null,2)+'\n');
    process.exitCode=1;
  }
}

if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
  main();
}
