#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export const REQUEST_SCHEMA='L2_ENFORCEMENT_SHADOW_REQUEST_v1';
export const RECEIPT_SCHEMA='L2_ENFORCEMENT_SHADOW_RECEIPT_v1';
export const POLICY_SCHEMA='L2_REPOSITORY_ENFORCEMENT_POLICY_v1';
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const obj=v=>v&&typeof v==='object'&&!Array.isArray(v);
const boundary={enforcementApplied:false,repositorySettingsMutated:false,branchProtectionMutated:false,rulesetMutated:false,authorityCreated:false,mergeAuthorityCreated:false,repositorySettingsAuthorityCreated:false,branchProtectionAuthorityCreated:false,rulesetActivationAuthorityCreated:false,hEarthAuthorityCreated:false,lawsAuthorityCreated:false};
function fail(code,reasons=[]){return stable({schema:RECEIPT_SCHEMA,result:'FAIL_CLOSED',decision:'DENY',errorCode:code,violations:reasons,...boundary});}
export function evaluateEnforcementShadow(input,policy){
  if(!obj(input)||input.schema!==REQUEST_SCHEMA)return fail('ENFORCEMENT_REQUEST_SCHEMA_INVALID',['REQUEST_SCHEMA_INVALID']);
  if(!obj(policy)||policy.schema!==POLICY_SCHEMA||policy.mode!=='SHADOW_ONLY'||policy.status!=='ACTIVE_SHADOW_ONLY_WHEN_REFERENCED')return fail('ENFORCEMENT_POLICY_INVALID',['POLICY_MUST_BE_ACTIVE_SHADOW_ONLY']);
  if(input.liveActivationRequested===true)return fail('LIVE_ACTIVATION_FORBIDDEN',['SEPARATE_SYNCHRONIZATION_AUTHORITY_REQUIRED']);
  if(input.repository!==policy.targetRepository||input.branch!==policy.targetBranch)return fail('ENFORCEMENT_TARGET_MISMATCH',['REPOSITORY_OR_BRANCH_MISMATCH']);
  if(!obj(input.observedPerimeter))return fail('OBSERVED_PERIMETER_INVALID',['OBSERVED_PERIMETER_REQUIRED']);
  const d=policy.desiredPerimeter,o=input.observedPerimeter,violations=[];
  if(o.branchProtected!==d.branchProtected)violations.push('BRANCH_PROTECTION_MISSING');
  if(o.pullRequestRequired!==d.pullRequestRequired)violations.push('PULL_REQUEST_REQUIREMENT_MISSING');
  if(o.directPushAllowed!==d.directPushAllowed)violations.push('DIRECT_PUSH_NOT_DENIED');
  const observedChecks=new Set(Array.isArray(o.requiredChecks)?o.requiredChecks:[]);for(const check of d.requiredChecks||[])if(!observedChecks.has(check))violations.push(`REQUIRED_CHECK_MISSING:${check}`);
  if(input.exactHeadEvidenceValid!==true)violations.push('EXACT_HEAD_EVIDENCE_INVALID');
  if(input.proposedAction==='MERGE'&&input.explicitMergeAuthority!==true)violations.push('EXPLICIT_MERGE_AUTHORITY_MISSING');
  if(input.bypassRequested===true)violations.push('BYPASS_NOT_AUTHORIZED_BY_SHADOW_POLICY');
  if(!['MERGE','EVALUATE_ONLY'].includes(input.proposedAction))violations.push(`UNKNOWN_OR_FORBIDDEN_ACTION:${input.proposedAction??'NULL'}`);
  return stable({schema:RECEIPT_SCHEMA,result:violations.length?'SHADOW_DENY':'SHADOW_ALLOW',decision:violations.length?'WOULD_DENY':'WOULD_ALLOW',errorCode:null,repository:input.repository,branch:input.branch,proposedAction:input.proposedAction,violations,requiredChecks:[...(d.requiredChecks||[])],observedChecks:[...observedChecks].sort(),liveActivationRequested:false,shadowOnly:true,...boundary});
}
function args(argv){const o={};for(let i=0;i<argv.length;i+=2){if(!argv[i]?.startsWith('--')||argv[i+1]===undefined)throw Error('CLI_ARGUMENT_INVALID');o[argv[i].slice(2)]=argv[i+1];}return o;}
const direct=()=>process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(direct()){try{const a=args(process.argv.slice(2));const input=JSON.parse(fs.readFileSync(a.input,'utf8'));const policy=JSON.parse(fs.readFileSync(a.policy,'utf8'));const r=evaluateEnforcementShadow(input,policy);fs.writeFileSync(a.output,JSON.stringify(r,null,2)+'\n');if(r.result==='FAIL_CLOSED')process.exitCode=3;}catch(error){const r=fail(error.message||'ENFORCEMENT_SHADOW_EXCEPTION',['GATE_EXCEPTION']);const i=process.argv.indexOf('--output');if(i>=0&&process.argv[i+1])fs.writeFileSync(process.argv[i+1],JSON.stringify(r,null,2)+'\n');else process.stderr.write(JSON.stringify(r)+'\n');process.exitCode=1;}}
