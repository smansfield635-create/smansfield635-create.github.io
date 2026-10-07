#!/usr/bin/env node
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {spawnSync} from 'node:child_process';
const pairs=process.argv.slice(2),args={};for(let i=0;i<pairs.length;i+=2)args[pairs[i].replace(/^--/,'')]=pairs[i+1];
const candidate=args['candidate-head'],holder=args['execution-holder'],output=args.output,expected='4f0f4012041d25cc380531d3dc1b1a7ef9a6f16b';
if(candidate!==expected)throw new Error('CANDIDATE_HEAD_MISMATCH');if(!holder||!output)throw new Error('INPUT_INCOMPLETE');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'build-matrix-v2-qualification-'));let stdout='',stderr='',code=1,clean=false;
try{
 let r=spawnSync('git',['init',root],{encoding:'utf8'});if(r.status)throw new Error('GIT_INIT_FAILED');
 for(const a of [['-C',root,'remote','add','origin','https://github.com/smansfield635-create/smansfield635-create.github.io.git'],['-C',root,'fetch','--no-tags','--depth=1','origin',candidate],['-C',root,'checkout','--detach','FETCH_HEAD']]){r=spawnSync('git',a,{encoding:'utf8',maxBuffer:16*1024*1024});if(r.status)throw new Error('CANDIDATE_MATERIALIZATION_FAILED:'+r.stderr);}
 const head=spawnSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).stdout.trim();if(head!==candidate)throw new Error('MATERIALIZED_HEAD_MISMATCH');
 const testPath='tools/build-companion-matrix.test.mjs';if(!fs.existsSync(path.join(root,testPath)))throw new Error('TEST_PATH_MISSING');
 const test=spawnSync(process.execPath,[testPath],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});code=test.status??1;stdout=test.stdout||'';stderr=test.stderr||'';
 clean=spawnSync('git',['-C',root,'status','--porcelain'],{encoding:'utf8'}).stdout.trim()==='';
 const receipt={schema:'BUILD_MATRIX_V2_FIXED_EXACT_HEAD_QUALIFICATION_ADAPTER_RECEIPT_v1',result:code===0&&clean&&stdout.includes('BUILD_COMPANION_MATRIX_V2_PASS')?'PASS':'FAIL',operationId:'BUILD_MATRIX_V2_FIXED_QUALIFICATION_REGISTRATION_20261006_001',executionHolder:holder,candidateHead:candidate,testPath,testExitCode:code,stdout,stderr,candidateCleanAfter:clean,sourceMutationPerformed:false,productMutationPerformed:false,branchCreated:false,mergePerformed:false,deploymentPerformed:false,releasePerformed:false,publicationPerformed:false};
 fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n');if(receipt.result!=='PASS')process.exitCode=1;
}catch(e){fs.writeFileSync(output,JSON.stringify({schema:'BUILD_MATRIX_V2_FIXED_EXACT_HEAD_QUALIFICATION_ADAPTER_RECEIPT_v1',result:'FAIL',operationId:'BUILD_MATRIX_V2_FIXED_QUALIFICATION_REGISTRATION_20261006_001',executionHolder:holder,candidateHead:candidate,testPath:'tools/build-companion-matrix.test.mjs',testExitCode:code,stdout,stderr:(stderr+'\n'+e.message).trim(),candidateCleanAfter:clean,sourceMutationPerformed:false,productMutationPerformed:false,branchCreated:false,mergePerformed:false,deploymentPerformed:false,releasePerformed:false,publicationPerformed:false},null,2)+'\n');process.exitCode=1;}
