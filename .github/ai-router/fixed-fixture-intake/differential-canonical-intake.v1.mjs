#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const LOCK_REF = 'refs/heads/operation-locks/repository-operation-intake-v1';
const GATE = Object.freeze({path:'tools/operation-intake/repository-operation-intake-gate.v1.mjs', blob:'f0b22e6b9574507632f1ad07647710971a4d63de'});
const LOCK_MANAGER = Object.freeze({path:'tools/operation-intake/repository-operation-lock-manager.v1.mjs', blob:'bb2c01247db69e1ab9c87fc7ad91ba1336ed10eb'});
const COMMON_DEPENDENCIES = Object.freeze([
  '.github/ai-router/router.v1.json',
  'tools/repository-ai-entry-router.mjs',
  '.github/workflows/repository-ai-entry-router-validation.yml'
]);
const FIXTURES = Object.freeze({
  P1_PROJECT_CONTINUATION_PUBLIC_TOPOLOGY_RETIREMENT_V1: Object.freeze({pathCount:9}),
  P2_PAGE_EXCELLENCE_PUBLIC_CONSUMER_CUT_A_V1: Object.freeze({pathCount:5})
});

const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])])) : value;
const canonical = value => JSON.stringify(stable(value));
const jsonText = value => JSON.stringify(stable(value), null, 2) + '\n';
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const normalize = value => String(value ?? '').replaceAll('\\','/').replace(/^\.\/+/, '').replace(/\/+$/, '');
const overlaps = (a,b) => a === b || a.startsWith(`${b}/`) || b.startsWith(`${a}/`);
const fail = (code, detail=null) => { const error = new Error(code); error.code=code; error.detail=detail; throw error; };
const run = (command,args,options={}) => spawnSync(command,args,{encoding:'utf8',shell:false,...options});

function parseArgs(argv) {
  if (argv.length === 1 && argv[0] === '--self-test') return {selfTest:true};
  const out = {};
  for (let i=0;i<argv.length;i+=2) {
    const key=argv[i], value=argv[i+1];
    if (!['--selection','--bridge-root','--output'].includes(key) || value === undefined) fail('CLI_ARGUMENTS_NOT_CLOSED', key);
    out[key.slice(2)] = value;
  }
  if (Object.keys(out).length !== 3 || !out.selection || !out['bridge-root'] || !out.output) fail('CLI_ARGUMENTS_INCOMPLETE');
  return out;
}

function readJson(file) { return JSON.parse(fs.readFileSync(path.resolve(file),'utf8')); }
function writeJson(file,value) { fs.mkdirSync(path.dirname(path.resolve(file)),{recursive:true}); fs.writeFileSync(path.resolve(file),jsonText(value)); }

function validateSelection(selection) {
  if (selection?.schema !== 'FIXED_FIXTURE_INTAKE_SELECTION_RECEIPT_v1' || selection?.result !== 'FIXTURE_SELECTED_FAIL_CLOSED') fail('SELECTION_RECEIPT_INVALID');
  const config = FIXTURES[selection.fixtureId];
  if (!config || selection.action !== 'ADMIT') fail('FIXTURE_IDENTITY_INVALID', selection.fixtureId);
  if (selection.arbitraryPayloadAccepted !== false || selection.authorityCreated !== false || selection.repositoryMutationPerformed !== false) fail('SELECTION_AUTHORITY_WIDENING');
  const bridge = selection.bridgeRequest;
  if (bridge?.schema !== 'PRE_REGISTRATION_INTAKE_BRIDGE_REQUEST_v1' || bridge.repository !== REPOSITORY) fail('BRIDGE_REQUEST_INVALID');
  if (selection.exactGoverningHead !== bridge.exactGoverningHead || bridge.operationRequest?.exactGoverningHead !== bridge.exactGoverningHead || bridge.constructionProcedure?.exactGoverningHead !== bridge.exactGoverningHead) fail('FROZEN_HEAD_BINDING_MISMATCH');
  const allowed=bridge.operationRequest?.allowedPaths;
  const procedureAllowed=bridge.constructionProcedure?.exactAllowedRepositoryPaths;
  if (!Array.isArray(allowed) || allowed.length !== config.pathCount || canonical(allowed) !== canonical(procedureAllowed)) fail('EXACT_PATH_SCOPE_MISMATCH',{fixtureId:selection.fixtureId,expectedPathCount:config.pathCount});
  const deps=[...new Set([...allowed,...COMMON_DEPENDENCIES].map(normalize))].sort();
  return {selection:stable(selection),bridge:stable(bridge),dependencies:deps,config};
}

function changedPaths(baseHead,currentHead,cwd=process.cwd()) {
  if (!/^[0-9a-f]{40}$/.test(baseHead) || !/^[0-9a-f]{40}$/.test(currentHead)) fail('HEAD_IDENTITY_INVALID');
  const ancestry=run('git',['merge-base','--is-ancestor',baseHead,currentHead],{cwd});
  if (ancestry.status !== 0) fail('COMPARE_NOT_LINEAR_AHEAD',{baseHead,currentHead});
  if (baseHead === currentHead) return [];
  const diff=run('git',['diff','--name-only','--find-renames',`${baseHead}..${currentHead}`],{cwd});
  if (diff.status !== 0) fail('GIT_DIFF_FAILED',diff.stderr);
  return [...new Set(diff.stdout.split(/\r?\n/).filter(Boolean).map(normalize))].sort();
}

function assessCarryForward(baseHead,currentHead,dependencies,cwd=process.cwd()) {
  const changed=changedPaths(baseHead,currentHead,cwd);
  const collisions=[];
  for (const changedPath of changed) for (const dependencyPath of dependencies) if (overlaps(changedPath,dependencyPath)) collisions.push({changedPath,dependencyPath});
  if (collisions.length) fail('DIFFERENTIAL_DEPENDENCY_CHANGE_REQUIRES_SUCCESSOR',{baseHead,currentHead,collisions});
  return stable({schema:'FIXED_FIXTURE_DIFFERENTIAL_CARRY_FORWARD_RECEIPT_v1',result:baseHead===currentHead?'SAME_HEAD':'PASS_CARRY_FORWARD_ADMISSIBLE',baseHead,currentHead,changedPaths:changed,dependencyPaths:dependencies,collisions:[],carryForwardAdmissible:true,successorRequired:false});
}

function verifyCandidateTooling(candidateRoot) {
  for (const identity of [GATE,LOCK_MANAGER]) {
    const absolute=path.join(candidateRoot,identity.path);
    if (!fs.existsSync(absolute)) fail('BOUND_TOOLING_MISSING',identity.path);
    const probe=run('git',['hash-object',identity.path],{cwd:candidateRoot});
    if (probe.status !== 0 || probe.stdout.trim() !== identity.blob) fail('BOUND_TOOLING_BLOB_MISMATCH',{path:identity.path,expected:identity.blob,actual:probe.stdout.trim()});
  }
}

function executeCanonicalGate(bridge,candidateRoot,outputPath) {
  const token=process.env.GITHUB_TOKEN;
  if (!token) fail('GITHUB_TOKEN_MISSING');
  const work=path.join(path.dirname(path.resolve(outputPath)),`differential-${bridge.requestNonce}`);
  fs.mkdirSync(work,{recursive:false});
  const requestFile=path.join(work,'operation-request.json');
  const procedureFile=path.join(work,'construction-procedure.json');
  const receiptFile=path.join(work,'canonical-admission-receipt.json');
  fs.writeFileSync(requestFile,jsonText(bridge.operationRequest));
  fs.writeFileSync(procedureFile,jsonText(bridge.constructionProcedure));
  const child=run(process.execPath,[path.join(candidateRoot,GATE.path),'--request',requestFile,'--procedure',procedureFile,'--repository',REPOSITORY,'--lock-ref',LOCK_REF,'--output',receiptFile],{cwd:candidateRoot,env:{...process.env,GITHUB_TOKEN:token},timeout:120000});
  if (!fs.existsSync(receiptFile)) fail('CANONICAL_RECEIPT_MISSING',{exitCode:child.status,stderr:child.stderr});
  const bytes=fs.readFileSync(receiptFile);
  const receipt=JSON.parse(bytes.toString('utf8'));
  if (receipt.schema !== 'REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1') fail('CANONICAL_RECEIPT_SCHEMA_MISMATCH');
  const requestDigest=sha256(canonical(bridge.operationRequest));
  const procedureDigest=sha256(canonical(bridge.constructionProcedure));
  if (receipt.requestDigest && receipt.requestDigest !== requestDigest) fail('CANONICAL_GATE_OPERATION_DIGEST_MISMATCH');
  if (receipt.procedureLocatorDigest && receipt.procedureLocatorDigest !== procedureDigest) fail('CANONICAL_GATE_PROCEDURE_DIGEST_MISMATCH');
  return {receipt,bytes,childStatus:child.status,requestDigest,procedureDigest};
}

function failureReceipt(error,base={}) {
  return stable({schema:'FIXED_FIXTURE_DIFFERENTIAL_CANONICAL_INTAKE_RECEIPT_v1',result:'FAIL_CLOSED',fixtureId:base.fixtureId??null,errorCode:error.code ?? 'UNEXPECTED_FAILURE',detail:error.detail ?? error.message,canonicalGateExecuted:false,admissionResultRewritten:false,authorityCreated:false,repositoryMutationPerformed:false,...base});
}

function selfTest() {
  const checks=[]; const ok=(id,value)=>{if(!value)throw new Error(`CHECK_FAILED:${id}`);checks.push(id);};
  ok('POS_001_OVERLAP_EQUAL',overlaps('a/b','a/b'));
  ok('POS_002_OVERLAP_PARENT',overlaps('a','a/b'));
  ok('POS_003_DISJOINT',!overlaps('a/b','c/d'));
  ok('POS_004_P1_REGISTERED',FIXTURES.P1_PROJECT_CONTINUATION_PUBLIC_TOPOLOGY_RETIREMENT_V1.pathCount===9);
  ok('POS_005_P2_REGISTERED',FIXTURES.P2_PAGE_EXCELLENCE_PUBLIC_CONSUMER_CUT_A_V1.pathCount===5);
  const dependencies=['.github/workflows/methods-page-mandatory-excellence-blind-baseline-validation.yml','.github/ai-router/router.v1.json'];
  const changed=['.github/ai-router/fixed-fixture-intake/self-test.v1.mjs','.github/ai-router/fixed-fixture-intake/p2-page-excellence-consumer-cut.v1.json'];
  const collisions=[]; for(const c of changed)for(const d of dependencies)if(overlaps(c,d))collisions.push([c,d]);
  ok('POS_006_TRANSPORT_REPAIR_DISJOINT_FROM_P2_SUBJECT',collisions.length===0);
  const bad=[]; for(const c of ['.github/workflows/methods-page-mandatory-excellence-blind-baseline-validation.yml'])for(const d of dependencies)if(overlaps(c,d))bad.push([c,d]);
  ok('NEG_001_P2_SUBJECT_CHANGE_COLLIDES',bad.length===1);
  ok('POS_007_EXTERNAL_SURFACE_CLOSED',COMMON_DEPENDENCIES.length===3);
  ok('POS_008_CANONICAL_GATE_IDENTITY_UNCHANGED',GATE.blob==='f0b22e6b9574507632f1ad07647710971a4d63de');
  ok('POS_009_BLOB_FALLBACK_LOCK_MANAGER_BOUND',LOCK_MANAGER.blob==='bb2c01247db69e1ab9c87fc7ad91ba1336ed10eb');
  return stable({schema:'FIXED_FIXTURE_DIFFERENTIAL_CANONICAL_INTAKE_SELF_TEST_v1',result:'PASS_CLOSED',checkCount:checks.length,checks,supportedFixtureIds:Object.keys(FIXTURES).sort(),canonicalGateModified:false,admissionSemanticsDuplicated:false});
}

async function main() {
  const args=parseArgs(process.argv.slice(2));
  if (args.selfTest) { process.stdout.write(jsonText(selfTest())); return; }
  let base={};
  try {
    const validated=validateSelection(readJson(args.selection));
    base={fixtureId:validated.selection.fixtureId};
    const candidateRoot=process.cwd();
    const currentHead=run('git',['rev-parse','HEAD^{commit}'],{cwd:candidateRoot});
    if (currentHead.status !== 0) fail('CURRENT_HEAD_UNAVAILABLE');
    const observed=currentHead.stdout.trim();
    const differential=assessCarryForward(validated.bridge.exactGoverningHead,observed,validated.dependencies,candidateRoot);
    base={...base,exactOperationBase:validated.bridge.exactGoverningHead,currentMainHead:observed,differentialReceipt:differential,dependencyPathCount:validated.dependencies.length};
    verifyCandidateTooling(candidateRoot);
    const gate=executeCanonicalGate(validated.bridge,candidateRoot,args.output);
    const result=gate.receipt.result==='ADMITTED_AND_LOCKED'?'CANONICAL_RECEIPT_PRESERVED':'FAIL_CLOSED';
    const receipt=stable({schema:'FIXED_FIXTURE_DIFFERENTIAL_CANONICAL_INTAKE_RECEIPT_v1',result,fixtureId:validated.selection.fixtureId,exactOperationBase:validated.bridge.exactGoverningHead,currentMainHead:observed,differentialReceipt:differential,dependencyPathCount:validated.dependencies.length,canonicalGateExecuted:true,canonicalGatePath:GATE.path,canonicalGateBlob:GATE.blob,lockManagerBlob:LOCK_MANAGER.blob,requestDigest:gate.requestDigest,procedureLocatorDigest:gate.procedureDigest,canonicalReceiptSha256:sha256(gate.bytes),canonicalReceiptJson:gate.receipt,canonicalChildExitCode:gate.childStatus,admissionResultRewritten:false,authorityCreated:false,repositoryMutationPerformed:false});
    writeJson(args.output,receipt);
    if (result !== 'CANONICAL_RECEIPT_PRESERVED') process.exitCode=1;
  } catch (error) {
    writeJson(args.output,failureReceipt(error,base));
    process.exitCode=1;
  }
}

const invoked=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(invoked)main().catch(error=>{process.stderr.write(jsonText({schema:'FIXED_FIXTURE_DIFFERENTIAL_PROCESS_FAILURE_v1',errorCode:error.code??'UNEXPECTED_FAILURE',detail:error.detail??error.message}));process.exitCode=1;});
