#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { validateBridgeRequest, REPOSITORY, LOCK_REF, IDENTITIES } from './canonical-intake-execution-bridge.v1.mjs';
import { prepare } from '../operation-intake/repository-operation-intake-gate.v1.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const text=p=>fs.readFileSync(path.join(root,p),'utf8');
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const sha=v=>crypto.createHash('sha256').update(typeof v==='string'?v:JSON.stringify(stable(v))).digest('hex');
const clone=v=>JSON.parse(JSON.stringify(v));
const checks=[]; const check=(id,pass,detail=null)=>{checks.push({id,pass:Boolean(pass),detail});if(!pass)throw new Error(id+':'+JSON.stringify(detail));};
const args=Object.fromEntries(process.argv.slice(2).reduce((a,v,i,x)=>i%2===0?[...a,[v.slice(2),x[i+1]]]:a,[]));
try{
 const manifest=read('.github/pre-registration-intake-bridge/construction-manifest.v1.json');
 const contract=read('.github/pre-registration-intake-bridge/bridge-contract.v1.json');
 const fixtures=read('.github/pre-registration-intake-bridge/fixtures.v1.json');
 const workflow=text('.github/workflows/pre-registration-intake-bridge-certification.yml');
 const bridge=text('tools/pre-registration-intake-bridge/canonical-intake-execution-bridge.v1.mjs');
 check('ASSERT_01_FIXED_CANONICAL_GATE_EXECUTION',bridge.includes('spawnSync(process.execPath')&&bridge.includes("IDENTITIES.gate.path"));
 check('ASSERT_02_REPOSITORY_NOT_SUBSTITUTABLE',REPOSITORY==="smansfield635-create/smansfield635-create.github.io"&&bridge.includes('REPOSITORY_SUBSTITUTION_PROHIBITED'));
 check('ASSERT_03_LOCK_REF_NOT_SUBSTITUTABLE',LOCK_REF==="refs/heads/operation-locks/repository-operation-intake-v1"&&!bridge.includes("args['lock-ref']"));
 check('ASSERT_04_BRIDGE_CANNOT_CREATE_BRANCHES',!/(git\/refs|create_branch|update_ref|\bgit branch\b)/i.test(bridge));
 check('ASSERT_05_BRIDGE_CANNOT_UPDATE_ORDINARY_PATHS',!/(method:\s*['\"](?:PUT|POST|PATCH|DELETE)|create_file|update_file|delete_file)/i.test(bridge));
 check('ASSERT_06_BRIDGE_CANNOT_MUTATE_PRS',!/(\/pulls|pull_request|merge_pull_request|update_pull_request)/i.test(bridge));
 check('ASSERT_07_BRIDGE_CANNOT_MERGE',!/(merge_pull_request|git merge|enable_auto_merge)/i.test(bridge));
 check('ASSERT_08_NO_ADMISSION_FABRICATION',bridge.includes('admissionResultRewritten:false')&&!bridge.includes("result:'ADMITTED_AND_LOCKED'"));
 check('ASSERT_09_RECEIPT_BYTES_BOUND',bridge.includes('canonicalReceiptBase64')&&bridge.includes('canonicalReceiptSha256'));
 check('ASSERT_10_MINIMUM_TOKEN_PERMISSIONS',workflow.includes('contents: write')&&!/(issues:\s*write|pull-requests:\s*write|deployments:\s*write|packages:\s*write|id-token:\s*write)/.test(workflow));
 const positive=clone(fixtures.bridgeInputTemplate); validateBridgeRequest(positive); prepare(positive.operationRequest,positive.constructionProcedure); check('ASSERT_11_VALID_INPUT_PREPARES_WITH_CANONICAL_GATE',true);
 let invalidPass=0;
 for(const fixture of fixtures.negativeMutations){let v=clone(fixtures.bridgeInputTemplate);let failed=false;try{
   if(fixture.target==='bridge.repository')v.repository=fixture.value;
   else if(fixture.target==='prohibited_input_key')v[fixture.value]='x';
   else if(fixture.target==='procedure.exactGoverningHead')v.constructionProcedure.exactGoverningHead=fixture.value;
   else if(fixture.target==='procedure.exactAllowedRepositoryPaths')v.constructionProcedure.exactAllowedRepositoryPaths=fixture.value;
   else if(fixture.target==='procedure.exactTestRunnerCommand')v.constructionProcedure.exactTestRunnerCommand=fixture.value;
   else if(fixture.target==='delete_request_field')delete v.operationRequest[fixture.value];
   else if(fixture.target==='bridge.exactGoverningHead')v.exactGoverningHead=fixture.value;
   validateBridgeRequest(v); prepare(v.operationRequest,v.constructionProcedure);
 }catch{failed=true} if(failed)invalidPass++;}
 check('ASSERT_12_INVALID_INPUTS_FAIL_BEFORE_REMOTE_MUTATION',invalidPass===fixtures.negativeMutations.length,{invalidPass,expected:fixtures.negativeMutations.length});
 check('ASSERT_13_GOVERNING_HEAD_FAIL_CLOSED',bridge.includes('GOVERNING_HEAD_MISMATCH')&&bridge.includes('currentMainHead'));
 check('ASSERT_14_CANONICAL_CAS_CONTROLS_CONCURRENCY',contract.compareAndSwapBehavior.includes('CANONICAL_GATE_TO_CANONICAL_LOCK_MANAGER'));
 check('ASSERT_15_REPLAY_NOT_SILENT',bridge.includes('REPLAY_DETECTED_NO_EXECUTION')&&bridge.includes('terminalHistory'));
 check('ASSERT_16_AUDITABLE_NON_ADMISSION_FAILURES',bridge.includes('FAIL_CLOSED_NON_ADMISSION')&&bridge.includes('auditEvents'));
 check('ASSERT_17_SHELL_DISABLED',bridge.includes('shell:false')&&!bridge.includes('shell:true'));
 check('ASSERT_18_EXACT_PATH_SCOPE',manifest.exactChangedPathCount===21&&manifest.exactChangedPaths.length===21);
 check('ASSERT_19_GATE_IDENTITY_BOUND',IDENTITIES.gate.blob==="f0b22e6b9574507632f1ad07647710971a4d63de");
 check('ASSERT_20_NO_PRODUCTION_ACTIVATION',manifest.productionActivation===false&&manifest.mergeAuthorized===false);
 const receipt=stable({schema:'PRE_REGISTRATION_INTAKE_BRIDGE_STATIC_CONFORMANCE_RECEIPT_v1',checkpointId:'CP5_STATIC_CONFORMANCE',result:'ALL_STATIC_AND_FIXTURE_ASSERTIONS_PASS',assertionCount:checks.length,assertionsPassed:checks.filter(x=>x.pass).length,checks,contractDigest:contract.contractDigest,manifestDigest:sha(JSON.stringify(stable(manifest)))});
 fs.mkdirSync(path.dirname(args.output),{recursive:true});fs.writeFileSync(args.output,JSON.stringify(receipt,null,2)+'\n');
}catch(error){const receipt={schema:'PRE_REGISTRATION_INTAKE_BRIDGE_STATIC_CONFORMANCE_RECEIPT_v1',checkpointId:'CP5_STATIC_CONFORMANCE',result:'FAIL_RETURN_TO_CP4_NO_ACTIVATION',error:error.message,checks};if(args.output){fs.mkdirSync(path.dirname(args.output),{recursive:true});fs.writeFileSync(args.output,JSON.stringify(receipt,null,2)+'\n')}process.exitCode=1;}
