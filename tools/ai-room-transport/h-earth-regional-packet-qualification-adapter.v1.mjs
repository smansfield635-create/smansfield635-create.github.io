#!/usr/bin/env node
// Gen3181 qualification adapter: read-only, fixed-source, fixed-frozen-asset.
// This adapter does not produce regional packets or change the H-Earth product.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import cp from 'node:child_process';

const OP='H_EARTH_REGIONAL_VERIFIER_READONLY_QUALIFICATION_BINDING_20261108_001';
const FROZEN='c9e20794436378bef65bea4ec3c0a10eec78751e';
const SOURCE='2b3d50ad474091afe49bc38295815ad6a0ffef4a';
const SOURCE_PATH='h-earth-3d/evidence/regional-loading-v1/h-earth-regional-packet-replacement.v1.mjs';
const SOURCE_BLOB='fd80392554b036ddf4c4d6932184b4a604eec763';
const SOURCE_SHA256='bd95bd4f30821c9afc14fb1eb57ae5c735e0d437ae9c8c7f029c29612b070672';
const ASSET_ROOT='showroom/globe/h-earth/render/assets';
const MANIFEST_SHA256='9d452a0906094e6e5ed828753e547ef24269afa173896453637b77832c6c3edf';
const GZIP_SHA256='4a2ff2a135984d67d68d3df7c3212236894c75b66826f256a60130c87b73e800';
const RAW_SHA256='bb5bdea6223aaea0422bac76f73da46d0370e51d81b3fdb280c970c408879a97';
const MAX_GZIP_BYTES=64564514;
const ROOTS=2858738,REGIONS=182,REGION_LIMIT=8000000;
const sha=data=>crypto.createHash('sha256').update(data).digest('hex');
const fatal=(code,detail)=>{const e=new Error(detail||code);e.code=code;throw e;};
const equal=(got,expected,code)=>{if(got!==expected)fatal(code,`${code}:${String(got)} != ${String(expected)}`);};
const args={};for(let i=2;i<process.argv.length;i+=2){const k=process.argv[i],v=process.argv[i+1];if(!k?.startsWith('--')||v===undefined||Object.hasOwn(args,k))fatal('ARGUMENTS_INVALID');args[k]=v;}
const output=args['--output'];
const holder=args['--execution-holder'];
if(!output||!holder||!/^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(holder)||Object.keys(args).length!==2)fatal('ARGUMENTS_INVALID');
const root=process.cwd();
const run=(command,params,{maxBuffer=8*1024*1024,encoding='utf8'}={})=>cp.spawnSync(command,params,{cwd:root,encoding,maxBuffer,env:process.env});
const git=(params,{maxBuffer,encoding}={})=>{const r=run('git',params,{maxBuffer,encoding});if(r.status!==0||r.error)fatal('GIT_COMMAND_FAILED',`${params.join(' ')}:${r.error?.message||r.stderr}`);return r.stdout;};
const clean=()=>String(git(['status','--porcelain=v1','--untracked-files=all'])).trim()==='';
const ensureCommit=rev=>{const r=run('git',['cat-file','-e',`${rev}^{commit}`]);if(r.status===0)return;git(['fetch','--no-tags','origin',rev]);git(['cat-file','-e',`${rev}^{commit}`]);};
const snapshotFile=(rev,rel)=>{const bytes=git(['show',`${rev}:${rel}`],{maxBuffer:85*1024*1024,encoding:null});if(!Buffer.isBuffer(bytes))fatal('BINARY_SNAPSHOT_INVALID');return bytes;};
const checkedSource=()=>{
  const sourceBlob=git(['rev-parse',`HEAD:${SOURCE_PATH}`]).trim();equal(sourceBlob,SOURCE_BLOB,'SOURCE_BLOB_CHANGED');
  const sourceFile=path.join(root,SOURCE_PATH);const sourceBytes=fs.readFileSync(sourceFile);
  equal(sha(sourceBytes),SOURCE_SHA256,'SOURCE_SHA256_CHANGED');
  return sourceFile;
};
const failReceipt=(code,detail)=>({schema:'H_EARTH_REGIONAL_PACKET_QUALIFICATION_RECEIPT_v1',result:'FAIL_CLOSED',operationId:OP,executionHolder:holder,sourceHead:SOURCE,frozenVegetationHead:FROZEN,errorCode:code,detail:detail||null,sourceMutationPerformed:false,productMutationPerformed:false,branchCreated:false,mergePerformed:false,deploymentPerformed:false,releasePerformed:false});
function qualify(){
  if(!clean())fatal('WORKTREE_DIRTY_BEFORE');
  ensureCommit(SOURCE);ensureCommit(FROZEN);
  const sourceFile=checkedSource();
  const staging=fs.mkdtempSync(path.join(os.tmpdir(),'h-earth-regional-packet-qualification-'));
  try{
    const manifest=snapshotFile(FROZEN,`${ASSET_ROOT}/precomputed-grass.v1.json`);
    const gzip=snapshotFile(FROZEN,`${ASSET_ROOT}/precomputed-grass.v1.bin.gz`);
    equal(sha(manifest),MANIFEST_SHA256,'FROZEN_MANIFEST_IDENTITY');
    equal(gzip.length,MAX_GZIP_BYTES,'FROZEN_GZIP_BYTES');
    equal(sha(gzip),GZIP_SHA256,'FROZEN_GZIP_IDENTITY');
    fs.writeFileSync(path.join(staging,'precomputed-grass.v1.json'),manifest);
    fs.writeFileSync(path.join(staging,'precomputed-grass.v1.bin.gz'),gzip);
    const check=run(process.execPath,['--check',sourceFile]);
    if(check.status!==0||check.error)fatal('VERIFIER_SYNTAX_FAILED',check.stderr||check.error?.message);
    const r=run(process.execPath,[sourceFile,staging],{maxBuffer:12*1024*1024});
    if(r.status!==0||r.error){const m=(r.stderr||'').match(/FIRST_FAILED_ASSERTION ([^\r\n]+)/);fatal('FROZEN_REGIONAL_PROOF_FAILED',m?.[1]||r.stderr||r.error?.message||String(r.status));}
    let proof;try{proof=JSON.parse(r.stdout)}catch{fatal('PROOF_STDOUT_NOT_JSON');}
    equal(proof.schema,'H_EARTH_REGIONAL_PACKET_REPLACEMENT_PROOF_v1','PROOF_SCHEMA');
    equal(proof.proof?.result,'REGIONAL_PACKET_SOURCE_PROOF_PASS','PROOF_NOT_PASS');
    equal(proof.proof?.frozenRevision,FROZEN,'PROOF_FROZEN_REVISION');
    equal(proof.proof?.sourceRoots,ROOTS,'PROOF_TOTAL_ROOTS');
    equal(proof.proof?.rootSum,ROOTS,'PROOF_ROOT_SUM');
    equal(proof.proof?.regionCount,REGIONS,'PROOF_REGION_COUNT');
    equal(proof.proof?.sourceRawReconstructedSha256,RAW_SHA256,'PROOF_RAW_SHA256');
    if(proof.proof?.largestRegionalCompressedBytes>REGION_LIMIT)fatal('PROOF_REGION_SIZE_LIMIT');
    if(!Array.isArray(proof.proof?.cameraCoverage)||proof.proof.cameraCoverage.length!==2||proof.proof.cameraCoverage.some(x=>!Number.isInteger(x.actualNearbyRoots)||x.actualNearbyRoots<1))fatal('PROOF_CAMERA_COVERAGE');
    if(!Array.isArray(proof.proof.packetSummaries)||proof.proof.packetSummaries.length!==REGIONS)fatal('PROOF_PACKET_COUNT');
    if(!clean())fatal('WORKTREE_DIRTY_AFTER');
    return {schema:'H_EARTH_REGIONAL_PACKET_QUALIFICATION_RECEIPT_v1',result:'PASS_CLOSED',operationId:OP,executionHolder:holder,sourceHead:SOURCE,verifierPath:SOURCE_PATH,verifierBlob:SOURCE_BLOB,verifierSha256:SOURCE_SHA256,frozenVegetationHead:FROZEN,manifestSha256:MANIFEST_SHA256,originalCompressedSha256:GZIP_SHA256,sourceRawSha256:RAW_SHA256,sourceRootCount:ROOTS,regionCount:REGIONS,regionLimitBytes:REGION_LIMIT,proof:proof.proof,sourceMutationPerformed:false,productMutationPerformed:false,branchCreated:false,mergePerformed:false,deploymentPerformed:false,releasePerformed:false};
  }finally{fs.rmSync(staging,{recursive:true,force:true});}
}
try{fs.writeFileSync(output,JSON.stringify(qualify(),null,2)+'\n');}
catch(e){fs.writeFileSync(output,JSON.stringify(failReceipt(e.code||'UNEXPECTED_FAILURE',e.message),null,2)+'\n');process.exitCode=1;}
