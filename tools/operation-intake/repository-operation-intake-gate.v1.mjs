#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { acquireLocal, acquireRemote, canonical, ledger, sha, stable, text } from './repository-operation-lock-manager.v1.mjs';

export const REQUEST_SCHEMA='REPOSITORY_OPERATION_REQUEST_v1';
export const PROCEDURE_SCHEMA='REPOSITORY_CONSTRUCTION_PROCEDURE_v1';
export const SOURCE_READBACK_OPERATION_CLASS='SOURCE_READBACK';
export const RUNTIME_OR_AUTHORITY_OPERATION_CLASS='RUNTIME_OR_AUTHORITY';
export const INTAKE_COMPLETENESS_SCHEMA='INTAKE_COMPLETENESS_RECEIPT_v1';
export const FUNCTIONAL_COORDINATION_SCHEMA='FUNCTIONAL_BEARING_COORDINATION_v1';
export const COMPLETE_INTAKE_RESULTS=new Set(['COMPLETE_NO_QUESTIONS_REQUIRED','COMPLETE_AFTER_USER_DISPOSITION']);
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','..');
const FUNCTIONAL_ROUTER_REL='.github/ai-router/functional-routing/compass-functional-router.v1.mjs';
const CONSTITUTION_REL='control-plane/whole-estate/characters-reconstruction-v1/compass-functional-coordinate-constitution.v1.json';
const EXPECTED_FUNCTIONAL_ROUTER_BLOB='ca3a7a8b6099001ff8d350a3f59c4d9e5422dad4';
const EXPECTED_CONSTITUTION_BLOB='49e08bd13e09e70e9363e9c5e18c6f778288cbfe';
const FIELDS=['operationId','projectId','lockScope','exactGoverningHead','subjectIdentity','requestingAuthority','executingRole','independentVerifier','constructionProcedureLocator','requiredInputs','allowedPaths','prohibitedPaths','requiredOutputs','exactTestCommand','workflowPath','artifactPaths','fingerprintDomain','errorPrecedence','stopConditions','terminalDispositions'];
const PFIELDS=['procedureId','operationClass','exactGoverningHead','exactAllowedRepositoryPaths','exactBranchAndCommitSequence','evaluationToolingHeadBindingRule','canonicalInputSchemas','canonicalOutputSchemas','errorCodeAndValidationPrecedence','exactTestRunnerCommand','independentVerifierDefinition','workflowAndArtifactPackagingPaths','bridgeOutputFingerprintDomain','priorAttemptInspectionLimits'];

export function intakeError(code,field,source,detail=null){const e=new Error(`${code}:${field}:source=${source}${detail?':'+detail:''}`);Object.assign(e,{code,field,sourceDocument:source,detail});return e;}
const bad=(c,f,s,d)=>{throw intakeError(c,f,s,d)};
const obj=(v,f,s)=>{if(!v||typeof v!=='object'||Array.isArray(v))bad('MISSING_REQUIRED_REQUEST_FIELD',f,s);return v};
const str=(v,f,s)=>{if(typeof v!=='string'||!v)bad('MISSING_REQUIRED_REQUEST_FIELD',f,s);return v};
const arr=(v,f,s)=>{if(!Array.isArray(v)||!v.length)bad('MISSING_REQUIRED_REQUEST_FIELD',f,s);return v};
const eq=(a,b)=>canonical(a)===canonical(b);
const isSourceReadback=v=>v?.operationClass===SOURCE_READBACK_OPERATION_CLASS;
export const incomplete=e=>stable({schema:'REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1',gateId:'REPOSITORY_OPERATION_INTAKE_AND_SINGLE_FLIGHT_LOCK_v1',result:'INPUT_INCOMPLETE_NOT_STARTED',errorCode:e.code||'UNEXPECTED_INTAKE_ERROR',field:e.field||null,sourceDocument:e.sourceDocument||null,detail:e.detail||null,operationStarted:false,branchCreationAuthorized:false,repositoryWritesAuthorized:false,workflowExecutionAuthorized:false,implementationInferenceAuthorized:false,lock:null});

export function validateIntakeCompleteness(value,source='operation-request'){
  const field='intakeCompletenessReceipt';
  if(!Object.hasOwn(value||{},field))bad('HUMAN_DISPOSITION_COMPLETENESS_MISSING_NOT_STARTED',field,source);
  const c=obj(value[field],field,source);
  if(c.schema!==INTAKE_COMPLETENESS_SCHEMA)bad('COMPLETENESS_RECEIPT_INVALID',`${field}.schema`,source);
  str(c.receiptId,`${field}.receiptId`,source);str(c.receiptDigest,`${field}.receiptDigest`,source);
  if(c.authorityEffect!=='NONE_BY_INTAKE_COMPLETENESS_RECEIPT')bad('HUMAN_DISPOSITION_AUTHORITY_LEAK',`${field}.authorityEffect`,source);
  if(!Array.isArray(c.unresolvedMaterialQuestions))bad('COMPLETENESS_RECEIPT_INVALID',`${field}.unresolvedMaterialQuestions`,source);
  c.unresolvedMaterialQuestions.forEach((x,i)=>str(x,`${field}.unresolvedMaterialQuestions[${i}]`,source));
  if(c.result==='INCOMPLETE_HUMAN_INPUT_REQUIRED')bad('HUMAN_INPUT_REQUIRED_NOT_STARTED',`${field}.result`,source);
  if(c.result==='INCOMPLETE_SCOPE_AMBIGUOUS')bad('SCOPE_AMBIGUITY_REQUIRES_USER_DISPOSITION',`${field}.result`,source);
  if(!COMPLETE_INTAKE_RESULTS.has(c.result))bad('COMPLETENESS_RECEIPT_INVALID',`${field}.result`,source);
  if(c.unresolvedMaterialQuestions.length!==0)bad('MATERIAL_UNKNOWN_UNDECLARED',`${field}.unresolvedMaterialQuestions`,source);
  return stable(c);
}

export function validateRequest(value){
  const s='operation-request',r=obj(value,'$',s);
  if(r.schema!==REQUEST_SCHEMA)bad('MISSING_REQUIRED_REQUEST_FIELD','schema',s);
  for(const f of FIELDS)if(!Object.hasOwn(r,f))bad('MISSING_REQUIRED_REQUEST_FIELD',f,s);
  for(const f of ['operationId','projectId','lockScope','constructionProcedureLocator','exactTestCommand'])str(r[f],f,s);
  if(Object.hasOwn(r,'operationClass'))str(r.operationClass,'operationClass',s);
  if(!/^[0-9a-f]{40}$/.test(r.exactGoverningHead))bad('GOVERNING_HEAD_MISMATCH','exactGoverningHead',s);
  for(const f of ['subjectIdentity','requestingAuthority','executingRole','independentVerifier','fingerprintDomain'])obj(r[f],f,s);
  for(const f of ['requiredInputs','allowedPaths','prohibitedPaths','requiredOutputs','errorPrecedence','stopConditions','terminalDispositions'])arr(r[f],f,s);
  const sourceReadback=isSourceReadback(r);
  if(sourceReadback){if(r.workflowPath!==null)bad('MISSING_REQUIRED_REQUEST_FIELD','workflowPath',s,'SOURCE_READBACK_REQUIRES_NULL');if(!Array.isArray(r.artifactPaths)||r.artifactPaths.length!==0)bad('MISSING_REQUIRED_REQUEST_FIELD','artifactPaths',s,'SOURCE_READBACK_REQUIRES_EMPTY_ARRAY');}
  else{str(r.workflowPath,'workflowPath',s);arr(r.artifactPaths,'artifactPaths',s);}
  r.requiredInputs.forEach((x,i)=>{obj(x,`requiredInputs[${i}]`,s);str(x.id,`requiredInputs[${i}].id`,s);if(x.resolved!==true)bad('MISSING_REQUIRED_REQUEST_FIELD',`requiredInputs[${i}].resolved`,s,x.id);});
  for(const f of ['allowedPaths','prohibitedPaths','requiredOutputs','errorPrecedence','stopConditions','terminalDispositions']){r[f].forEach((x,i)=>str(x,`${f}[${i}]`,s));if(new Set(r[f]).size!==r[f].length)bad('MISSING_REQUIRED_REQUEST_FIELD',f,s,'duplicate');}
  if(!sourceReadback){r.artifactPaths.forEach((x,i)=>str(x,`artifactPaths[${i}]`,s));if(new Set(r.artifactPaths).size!==r.artifactPaths.length)bad('MISSING_REQUIRED_REQUEST_FIELD','artifactPaths',s,'duplicate');}
  return stable(r);
}

export function validateProcedure(value){
  const s='construction-procedure',p=obj(value,'$',s);
  if(p.schema!==PROCEDURE_SCHEMA)bad('CONSTRUCTION_PROCEDURE_INVALID','schema',s);
  for(const f of PFIELDS)if(!Object.hasOwn(p,f))bad('CONSTRUCTION_PROCEDURE_INVALID',f,s);
  for(const f of ['procedureId','operationClass','evaluationToolingHeadBindingRule','exactTestRunnerCommand'])str(p[f],f,s);
  if(!/^[0-9a-f]{40}$/.test(p.exactGoverningHead))bad('CONSTRUCTION_PROCEDURE_INVALID','exactGoverningHead',s);
  for(const f of ['exactAllowedRepositoryPaths','exactBranchAndCommitSequence','canonicalInputSchemas','canonicalOutputSchemas','errorCodeAndValidationPrecedence'])arr(p[f],f,s);
  for(const f of ['independentVerifierDefinition','workflowAndArtifactPackagingPaths','bridgeOutputFingerprintDomain','priorAttemptInspectionLimits'])obj(p[f],f,s);
  const w=p.workflowAndArtifactPackagingPaths;
  if(isSourceReadback(p)){if(w.workflowPath!==null)bad('CONSTRUCTION_PROCEDURE_INVALID','workflowAndArtifactPackagingPaths.workflowPath',s,'SOURCE_READBACK_REQUIRES_NULL');if(!Array.isArray(w.artifactPaths)||w.artifactPaths.length!==0)bad('CONSTRUCTION_PROCEDURE_INVALID','workflowAndArtifactPackagingPaths.artifactPaths',s,'SOURCE_READBACK_REQUIRES_EMPTY_ARRAY');}
  else{str(w.workflowPath,'workflowAndArtifactPackagingPaths.workflowPath',s);arr(w.artifactPaths,'workflowAndArtifactPackagingPaths.artifactPaths',s);w.artifactPaths.forEach((x,i)=>str(x,`workflowAndArtifactPackagingPaths.artifactPaths[${i}]`,s));}
  return stable(p);
}

function gitBlob(rel,expected,field,source){
  const ref=spawnSync('git',['rev-parse',`HEAD:${rel}`],{cwd:ROOT,encoding:'utf8'});
  if(ref.status!==0)bad('CONSTITUTION_MISSING_OR_CHANGED',field,source,`GIT_OBJECT_UNAVAILABLE:${rel}`);
  const blob=ref.stdout.trim();
  if(blob!==expected)bad('CONSTITUTION_MISSING_OR_CHANGED',field,source,`GIT_BLOB_MISMATCH:${rel}:${blob}`);
  const cat=spawnSync('git',['cat-file','blob',blob],{cwd:ROOT,encoding:null,maxBuffer:4*1024*1024});
  if(cat.status!==0)bad('CONSTITUTION_MISSING_OR_CHANGED',field,source,`GIT_BLOB_READ_FAILED:${rel}`);
  return cat.stdout;
}

function runFunctionalRouter(packet,field,source){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'functional-bearing-intake-'));
  const routerPath=path.join(dir,FUNCTIONAL_ROUTER_REL),constitutionPath=path.join(dir,CONSTITUTION_REL),input=path.join(dir,'packet.json');
  try{
    const routerBytes=gitBlob(FUNCTIONAL_ROUTER_REL,EXPECTED_FUNCTIONAL_ROUTER_BLOB,field,source);
    const constitutionBytes=gitBlob(CONSTITUTION_REL,EXPECTED_CONSTITUTION_BLOB,field,source);
    fs.mkdirSync(path.dirname(routerPath),{recursive:true});fs.mkdirSync(path.dirname(constitutionPath),{recursive:true});
    fs.writeFileSync(routerPath,routerBytes);fs.writeFileSync(constitutionPath,constitutionBytes);fs.writeFileSync(input,`${JSON.stringify(packet)}\n`);
    const r=spawnSync(process.execPath,[routerPath,'--input',input],{cwd:dir,encoding:'utf8'});
    let receipt;
    try{receipt=JSON.parse(r.stdout||'{}')}catch{bad('FUNCTIONAL_COORDINATION_SCHEMA_INVALID',field,source,'FUNCTIONAL_ROUTER_RECEIPT_INVALID')}
    if(r.status!==0){const code=receipt.errorCode==='SCHEMA_INVALID'?'FUNCTIONAL_COORDINATION_SCHEMA_INVALID':(receipt.errorCode||'FUNCTIONAL_COORDINATION_SCHEMA_INVALID');bad(code,receipt.field?`${field}.${receipt.field}`:field,source,receipt.detail||null);}
    return receipt;
  }finally{fs.rmSync(dir,{recursive:true,force:true});}
}

export function validateFunctionalCoordination(request,procedure){
  const source='functional-bearing-routing',field='functionalCoordination';
  if(!Object.hasOwn(request||{},field))bad('FUNCTIONAL_COORDINATION_REQUIRED',field,source);
  const fc=obj(request[field],field,source);
  if(fc.schema!==FUNCTIONAL_COORDINATION_SCHEMA)bad('FUNCTIONAL_COORDINATION_SCHEMA_INVALID',`${field}.schema`,source);
  if(fc.authorityEffect!=='NONE')bad('AUTHORITY_EFFECT_NONZERO',`${field}.authorityEffect`,source);
  if(!Array.isArray(fc.primitiveRequirements))bad('FUNCTIONAL_COORDINATION_SCHEMA_INVALID',`${field}.primitiveRequirements`,source);
  const packet={schema:'FUNCTIONAL_BEARING_WORK_PACKET_v1',packetId:`INTAKE:${request.operationId}`,parentOperationId:request.operationId,applicabilityClass:fc.applicabilityClass,functionalBearing:fc.functionalBearing,R:request.subjectIdentity,L:{operationClass:procedure.operationClass},D:{projectId:request.projectId},A:request.requestingAuthority,objective:request.operationId,requiredOutput:request.requiredOutputs[0],evidenceRefs:request.requiredInputs.map(x=>x.id),unresolvedConditions:[],prohibitedAuthority:request.prohibitedPaths,handoff:{predecessorPacketId:null,successorRelation:'CANONICAL_INTAKE'},primitiveRequirements:fc.primitiveRequirements};
  const receipt=runFunctionalRouter(packet,field,source);
  if(receipt.authorityEffect!=='NONE')bad('AUTHORITY_EFFECT_NONZERO',field,source);
  if(!eq(receipt.A,request.requestingAuthority))bad('AUTHORITY_EFFECT_NONZERO',`${field}.A`,source);
  return stable({...fc,validationReceipt:receipt});
}

export function prepare(r0,p0){
  const r=validateRequest(r0),p=validateProcedure(p0),requestSourceReadback=isSourceReadback(r),procedureSourceReadback=isSourceReadback(p);
  if(requestSourceReadback!==procedureSourceReadback)bad('OPERATION_CLASS_MISMATCH','operationClass','request-and-procedure');
  if(requestSourceReadback&&r.operationClass!==p.operationClass)bad('OPERATION_CLASS_MISMATCH','operationClass','request-and-procedure');
  if(p.operationClass===RUNTIME_OR_AUTHORITY_OPERATION_CLASS){validateIntakeCompleteness(r,'operation-request');validateFunctionalCoordination(r,p);}
  if(r.exactGoverningHead!==p.exactGoverningHead)bad('GOVERNING_HEAD_MISMATCH','exactGoverningHead','request-and-procedure');
  if(!eq(r.allowedPaths,p.exactAllowedRepositoryPaths))bad('SCOPE_MISMATCH','allowedPaths','request-and-procedure');
  for(const x of r.prohibitedPaths)if(r.allowedPaths.includes(x))bad('PROHIBITED_PATH_REQUESTED','prohibitedPaths','operation-request',x);
  if(r.exactTestCommand!==p.exactTestRunnerCommand)bad('TEST_COMMAND_MISMATCH','exactTestCommand','request-and-procedure');
  const w=p.workflowAndArtifactPackagingPaths;
  if(r.workflowPath!==w.workflowPath||!eq(r.artifactPaths,w.artifactPaths))bad('WORKFLOW_PATH_MISMATCH','workflowPath','request-and-procedure');
  if(!eq(r.fingerprintDomain,p.bridgeOutputFingerprintDomain))bad('FINGERPRINT_DOMAIN_MISMATCH','fingerprintDomain','request-and-procedure');
  if(!eq(r.errorPrecedence,p.errorCodeAndValidationPrecedence))bad('CONSTRUCTION_PROCEDURE_INVALID','errorPrecedence','request-and-procedure');
  return{request:r,procedure:p,requestDigest:sha(canonical(r)),procedureLocatorDigest:sha(canonical(p))};
}

export function admitLocal(r,p,l){
  try{const q=prepare(r,p),x=acquireLocal(ledger(l),{operationId:q.request.operationId,lockScope:q.request.lockScope,governingHead:q.request.exactGoverningHead,requestDigest:q.requestDigest,procedureLocatorDigest:q.procedureLocatorDigest});if(!x.acquired)return{receipt:stable({schema:'REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1',gateId:'REPOSITORY_OPERATION_INTAKE_AND_SINGLE_FLIGHT_LOCK_v1',result:'ACTIVE_SCOPE_ALREADY_LOCKED',errorCode:'ACTIVE_OPERATION_ALREADY_EXISTS',field:'lockScope',sourceDocument:'active-operation-ledger',operationStarted:false,branchCreationAuthorized:false,repositoryWritesAuthorized:false,workflowExecutionAuthorized:false,implementationInferenceAuthorized:false,lock:null}),ledger:x.ledger};return{receipt:stable({schema:'REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1',gateId:'REPOSITORY_OPERATION_INTAKE_AND_SINGLE_FLIGHT_LOCK_v1',result:'ADMITTED_AND_LOCKED',errorCode:null,field:null,sourceDocument:null,operationId:q.request.operationId,projectId:q.request.projectId,requestDigest:q.requestDigest,procedureLocatorDigest:q.procedureLocatorDigest,operationStarted:true,branchCreationAuthorized:true,repositoryWritesAuthorized:true,workflowExecutionAuthorized:true,implementationInferenceAuthorized:false,lock:x.lock}),ledger:x.ledger};}catch(e){return{receipt:incomplete(e),ledger:ledger(l)}}
}

const args=v=>{const a={};for(let i=0;i<v.length;i++){if(!v[i].startsWith('--'))bad('UNKNOWN_ARGUMENT',v[i],'cli');a[v[i].slice(2)]=v[++i]??null;}return a};
const read=(p,k)=>{try{return JSON.parse(fs.readFileSync(path.resolve(p),'utf8'))}catch(e){bad(k==='request'?'MISSING_REQUIRED_REQUEST_FIELD':'CONSTRUCTION_PROCEDURE_NOT_FOUND',k,'filesystem',e.message)}};
const write=(p,v)=>{if(!p)return process.stdout.write(text(v));fs.mkdirSync(path.dirname(path.resolve(p)),{recursive:true});fs.writeFileSync(path.resolve(p),text(v));};
async function main(){const a=args(process.argv.slice(2));let q;try{q=prepare(read(a.request,'request'),read(a.procedure,'procedure'))}catch(e){write(a.output,incomplete(e));process.exitCode=1;return;}const x=await acquireRemote({repository:a.repository,lockRef:a['lock-ref'],token:process.env.GITHUB_TOKEN,operationId:q.request.operationId,lockScope:q.request.lockScope,governingHead:q.request.exactGoverningHead,requestDigest:q.requestDigest,procedureLocatorDigest:q.procedureLocatorDigest});let r;if(x.result==='ADMITTED_AND_LOCKED')r={schema:'REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1',gateId:'REPOSITORY_OPERATION_INTAKE_AND_SINGLE_FLIGHT_LOCK_v1',result:'ADMITTED_AND_LOCKED',errorCode:null,field:null,sourceDocument:null,operationId:q.request.operationId,projectId:q.request.projectId,requestDigest:q.requestDigest,procedureLocatorDigest:q.procedureLocatorDigest,operationStarted:true,branchCreationAuthorized:true,repositoryWritesAuthorized:true,workflowExecutionAuthorized:true,implementationInferenceAuthorized:false,lock:x};else{r={schema:'REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1',gateId:'REPOSITORY_OPERATION_INTAKE_AND_SINGLE_FLIGHT_LOCK_v1',result:x.result==='ACTIVE_SCOPE_ALREADY_LOCKED'?x.result:'INPUT_INCOMPLETE_NOT_STARTED',errorCode:x.errorCode||'LOCK_NOT_ACQUIRED',field:'lockScope',sourceDocument:'remote-lock-manager',operationStarted:false,branchCreationAuthorized:false,repositoryWritesAuthorized:false,workflowExecutionAuthorized:false,implementationInferenceAuthorized:false,lock:x};process.exitCode=x.result==='ACTIVE_SCOPE_ALREADY_LOCKED'?3:4;}write(a.output,stable(r));}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1]))main().catch(e=>{const r=incomplete(e);try{write(args(process.argv.slice(2)).output,r)}catch{process.stderr.write(text(r))}process.exitCode=1;});
