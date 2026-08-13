#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const MARKER = 'TRUSTED_INTAKE_FIXTURE_V1';
export const ONLY_FIXTURE_ID = 'METHODS_MODELS_FROZEN_CANDIDATE_INTAKE_20260813_V1';
export const FIXTURE_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/methods-models-frozen-candidate-intake.v1.json');
const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const LOCK_REF = 'refs/heads/operation-locks/repository-operation-intake-v1';
const GATE_PATH = 'tools/operation-intake/repository-operation-intake-gate.v1.mjs';
const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(k => [k, stable(value[k])])) : value;
const canonical = value => JSON.stringify(stable(value));
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const fail = (code, detail=null) => { const error = new Error(code); error.code = code; error.detail=detail; throw error; };
const root = () => path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const jsonText = value => JSON.stringify(stable(value), null, 2) + '\n';
const normalizePath = value => String(value ?? '').replaceAll('\\','/').replace(/^\.\/+/, '').replace(/\/+$/, '');
const overlaps = (a,b) => a === b || a.startsWith(`${b}/`) || b.startsWith(`${a}/`);

async function apiJson(url, token) {
  const response = await fetch(url,{headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${token}`,'X-GitHub-Api-Version':'2022-11-28'}});
  const text=await response.text(); let body; try{body=text?JSON.parse(text):null}catch{body={raw:text}};
  if(!response.ok) fail('GITHUB_API_FAILURE',{status:response.status,url,body});
  return body;
}

export function parseMarker(body) {
  const normalized = String(body ?? '').trim().split(/\s+/);
  if (normalized.length !== 2 || normalized[0] !== MARKER) fail('LOW_ENTROPY_MARKER_INVALID');
  if (normalized[1] !== ONLY_FIXTURE_ID) fail('FIXTURE_SELECTOR_NOT_ALLOWED');
  return normalized[1];
}

export function loadFrozenFixture(selector, file = FIXTURE_PATH) {
  if (selector !== ONLY_FIXTURE_ID) fail('FIXTURE_SELECTOR_NOT_ALLOWED');
  const fixture = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (fixture.schema !== 'TRUSTED_CANONICAL_INTAKE_FIXTURE_v1') fail('FIXTURE_SCHEMA_MISMATCH');
  if (fixture.fixtureId !== ONLY_FIXTURE_ID || fixture.issue !== 977) fail('FIXTURE_IDENTITY_MISMATCH');
  if (fixture.repository !== REPOSITORY) fail('FIXTURE_REPOSITORY_MISMATCH');
  if (fixture.exactGoverningHead !== 'e0c69d3f2581b0917dab882f5750a45403a523b9') fail('FIXTURE_GOVERNING_HEAD_MISMATCH');
  if (fixture.operationRequest?.exactGoverningHead !== fixture.exactGoverningHead || fixture.constructionProcedure?.exactGoverningHead !== fixture.exactGoverningHead) fail('FIXTURE_INTERNAL_HEAD_MISMATCH');
  if (!Array.isArray(fixture.operationRequest?.allowedPaths) || fixture.operationRequest.allowedPaths.length !== 10) fail('FIXTURE_ALLOWED_PATH_COUNT_MISMATCH');
  if (canonical(fixture.operationRequest.allowedPaths) !== canonical(fixture.constructionProcedure?.exactAllowedRepositoryPaths)) fail('FIXTURE_SCOPE_MISMATCH');
  if (fixture.operationRequest?.requestingAuthority?.mergeAuthority !== false || fixture.operationRequest?.executingRole?.mayMerge !== false) fail('FIXTURE_MERGE_AUTHORITY_INVALID');
  const surface=fixture.differentialCarryForward?.dependencySurface;
  if(fixture.differentialCarryForward?.enabled!==true || surface?.complete!==true || !Array.isArray(surface.paths) || surface.paths.length<10) fail('DIFFERENTIAL_DEPENDENCY_SURFACE_INCOMPLETE');
  return stable(fixture);
}

export function bridgeRequestFromFixture(fixture) {
  const request = stable({schema:'PRE_REGISTRATION_INTAKE_BRIDGE_REQUEST_v1',requestId:fixture.fixtureId,repository:fixture.repository,exactGoverningHead:fixture.exactGoverningHead,operationRequest:fixture.operationRequest,constructionProcedure:fixture.constructionProcedure,requestNonce:fixture.requestNonce,executionHolder:fixture.executionHolder});
  if (canonical(request.operationRequest) !== canonical(fixture.operationRequest)) fail('OPERATION_REQUEST_REWRITE_DETECTED');
  if (canonical(request.constructionProcedure) !== canonical(fixture.constructionProcedure)) fail('CONSTRUCTION_PROCEDURE_REWRITE_DETECTED');
  return request;
}

export async function assessCarryForward(fixture, token) {
  if(!token) fail('GITHUB_TOKEN_MISSING');
  const current=await apiJson(`https://api.github.com/repos/${REPOSITORY}/branches/main`,token);
  const observedHead=current?.commit?.sha;
  if(!/^[0-9a-f]{40}$/.test(String(observedHead||''))) fail('CURRENT_MAIN_HEAD_INVALID');
  if(observedHead===fixture.exactGoverningHead) return stable({result:'SAME_HEAD',baseHead:fixture.exactGoverningHead,targetHead:observedHead,changedPaths:[],carryForwardAdmissible:true});
  const comparison=await apiJson(`https://api.github.com/repos/${REPOSITORY}/compare/${fixture.exactGoverningHead}...${observedHead}`,token);
  if(comparison?.status!=='ahead') fail('COMPARE_NOT_LINEAR_AHEAD',comparison?.status);
  const files=Array.isArray(comparison.files)?comparison.files:[];
  if(files.length>=300) fail('CHANGED_FILE_SET_INCOMPLETE',files.length);
  const changed=[...new Set(files.flatMap(f=>[f.filename,f.previous_filename].filter(Boolean)).map(normalizePath))].sort();
  const dependencies=fixture.differentialCarryForward.dependencySurface.paths.map(normalizePath);
  const collisions=[];
  for(const changedPath of changed) for(const dependencyPath of dependencies) if(overlaps(changedPath,dependencyPath)) collisions.push({changedPath,dependencyPath});
  if(collisions.length) fail('DIFFERENTIAL_DEPENDENCY_CHANGE_REQUIRES_SUCCESSOR',collisions);
  return stable({result:'PASS_CARRY_FORWARD_ADMISSIBLE',baseHead:fixture.exactGoverningHead,targetHead:observedHead,compareStatus:comparison.status,changedPaths:changed,dependencyPaths:dependencies,collisions:[],carryForwardAdmissible:true,successorRequired:false});
}

function executeCanonicalGate(fixture, outputPath, token) {
  const work=path.join(path.dirname(outputPath),`trusted-intake-${fixture.requestNonce}`);
  fs.mkdirSync(work,{recursive:false});
  const requestFile=path.join(work,'operation-request.json');
  const procedureFile=path.join(work,'construction-procedure.json');
  const canonicalReceiptFile=path.join(work,'canonical-admission-receipt.json');
  fs.writeFileSync(requestFile,jsonText(fixture.operationRequest));
  fs.writeFileSync(procedureFile,jsonText(fixture.constructionProcedure));
  const child=spawnSync(process.execPath,[path.join(root(),GATE_PATH),'--request',requestFile,'--procedure',procedureFile,'--repository',REPOSITORY,'--lock-ref',LOCK_REF,'--output',canonicalReceiptFile],{cwd:root(),env:{...process.env,GITHUB_TOKEN:token},shell:false,encoding:'utf8',timeout:120000});
  if(!fs.existsSync(canonicalReceiptFile)) fail('CANONICAL_RECEIPT_MISSING',{exitCode:child.status});
  const bytes=fs.readFileSync(canonicalReceiptFile); const receipt=JSON.parse(bytes.toString('utf8'));
  if(receipt.schema!=='REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1') fail('CANONICAL_RECEIPT_SCHEMA_MISMATCH');
  return {childStatus:child.status,bytes,receipt};
}

export async function executeTrustedFixture({commentBody, outputPath}) {
  const selector=parseMarker(commentBody); const fixture=loadFrozenFixture(selector); bridgeRequestFromFixture(fixture);
  const operationDigest=sha256(canonical(fixture.operationRequest)); const procedureDigest=sha256(canonical(fixture.constructionProcedure));
  const token=process.env.GITHUB_TOKEN;
  const differentialReceipt=await assessCarryForward(fixture,token);
  const gateResult=executeCanonicalGate(fixture,outputPath,token);
  if(gateResult.receipt.requestDigest!==operationDigest) fail('CANONICAL_GATE_OPERATION_DIGEST_MISMATCH');
  if(gateResult.receipt.procedureLocatorDigest!==procedureDigest) fail('CANONICAL_GATE_PROCEDURE_DIGEST_MISMATCH');
  const receipt=stable({schema:'TRUSTED_CANONICAL_INTAKE_CARRIER_RECEIPT_v1',result:gateResult.receipt.result==='ADMITTED_AND_LOCKED'?'CANONICAL_RECEIPT_PRESERVED':'FAIL_CLOSED',marker:MARKER,fixtureId:fixture.fixtureId,fixtureSha256:sha256(canonical(fixture)),operationRequestSha256:operationDigest,constructionProcedureSha256:procedureDigest,exactProductBase:fixture.exactGoverningHead,currentMainHead:differentialReceipt.targetHead,differentialReceipt,allowedPathCount:10,mergeAuthority:false,admissionSemanticsDuplicated:false,canonicalGateExecuted:true,canonicalGatePath:GATE_PATH,admissionResultRewritten:false,canonicalReceiptSha256:sha256(gateResult.bytes),canonicalReceiptJson:gateResult.receipt,canonicalChildExitCode:gateResult.childStatus});
  fs.mkdirSync(path.dirname(outputPath),{recursive:true}); fs.writeFileSync(outputPath,jsonText(receipt)); return receipt;
}

async function main(){const outputPath=process.env.TRUSTED_INTAKE_OUTPUT||path.join(process.env.RUNNER_TEMP||'/tmp','trusted-intake-carrier-receipt.json');const receipt=await executeTrustedFixture({commentBody:process.env.COMMENT_BODY,outputPath});if(receipt.result!=='CANONICAL_RECEIPT_PRESERVED')process.exitCode=1;}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(error=>{process.stderr.write(JSON.stringify({errorCode:error.code??'UNEXPECTED_FAILURE',detail:error.detail??error.message})+'\n');process.exitCode=1;});
