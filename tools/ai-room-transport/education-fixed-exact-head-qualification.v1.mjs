#!/usr/bin/env node
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const args=Object.fromEntries(process.argv.slice(2).reduce((a,v,i,x)=>i%2?a:(a.push([v.replace(/^--/,''),x[i+1]]),a),[]));
const candidate=args['candidate-head'], holder=args['execution-holder'], output=args.output;
if(!/^[0-9a-f]{40}$/.test(candidate||''))throw new Error('CANDIDATE_HEAD_INVALID');
if(!holder||!output)throw new Error('INPUT_INCOMPLETE');
const manifest='.github/live-qualification/manifests/education-product.v1.json';
const verifier='.github/live-qualification/verifiers/education-product.v1.mjs';
const checks=[
 fs.existsSync(manifest),fs.existsSync(verifier),
 candidate===process.env.GITHUB_SHA || spawnSync('git',['cat-file','-e',candidate+'^{commit}']).status===0
];
const receipt={schema:'EDUCATION_FIXED_EXACT_HEAD_QUALIFICATION_ADAPTER_RECEIPT_v1',result:checks.every(Boolean)?'PASS':'FAIL',operationId:'EDUCATION_FIXED_QUALIFICATION_REGISTRATION_20260920_001',executionHolder:holder,candidateHead:candidate,manifest,verifier,checks,sourceMutationPerformed:false,productMutationPerformed:false,branchCreated:false,mergePerformed:false,deploymentPerformed:false,releasePerformed:false,publicationPerformed:false};
fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n');
if(receipt.result!=='PASS')process.exitCode=1;
