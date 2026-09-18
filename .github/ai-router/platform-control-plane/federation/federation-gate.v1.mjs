#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REQUEST_SCHEMA = 'L2_FEDERATION_VERIFICATION_REQUEST_v1';
export const RECEIPT_SCHEMA = 'L2_FEDERATION_VERIFICATION_RECEIPT_v1';
export const REGISTRY_SCHEMA = 'L2_FEDERATED_REPOSITORY_REGISTRY_v1';
const SHA40=/^[0-9a-f]{40}$/;
const SHA256=/^[0-9a-f]{64}$/;
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const obj=v=>v&&typeof v==='object'&&!Array.isArray(v);
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(stable(v),null,2)+'\n');
const boundary={authorityCreated:false,authorityInherited:false,externalRepositoryWriteAuthorityCreated:false,mergeAuthorityCreated:false,repositorySettingsAuthorityCreated:false,rulesetActivationAuthorityCreated:false,hEarthAuthorityCreated:false,lawsAuthorityCreated:false,productAuthorityCreated:false,scientificClaimAuthorityCreated:false};
function fail(input,errorCode,reasons=[]){return stable({schema:RECEIPT_SCHEMA,result:'FAIL_CLOSED',decision:'DENY',errorCode,reasons,operation:input?.operation??null,sourceRepositoryId:input?.sourceRepository?.repositoryId??null,targetRepositoryId:input?.targetRepository?.repositoryId??null,...boundary});}
function find(registry,id){return registry.repositories.find(r=>r.repositoryId===id);}
function identityMatches(expected,presented){return obj(presented)&&expected.numericId===presented.numericId&&expected.fullName===presented.fullName;}
export function evaluateFederation(input,registry){
  if(!obj(input)||input.schema!==REQUEST_SCHEMA)return fail(input,'FEDERATION_REQUEST_SCHEMA_INVALID',['REQUEST_SCHEMA_INVALID']);
  if(!obj(registry)||registry.schema!==REGISTRY_SCHEMA||registry.status!=='ACTIVE_FAIL_CLOSED_WHEN_REFERENCED'||!Array.isArray(registry.repositories))return fail(input,'FEDERATION_REGISTRY_INVALID',['REGISTRY_INVALID']);
  if(input.authorityTransferRequested===true)return fail(input,'AUTHORITY_TRANSFER_FORBIDDEN',['FEDERATION_MAY_NOT_TRANSFER_AUTHORITY']);
  if(input.externalWriteRequested===true)return fail(input,'EXTERNAL_REPOSITORY_WRITE_FORBIDDEN',['FEDERATION_IS_READ_ONLY']);
  const source=find(registry,input.sourceRepository?.repositoryId);
  const target=find(registry,input.targetRepository?.repositoryId);
  if(!source)return fail(input,'SOURCE_REPOSITORY_UNKNOWN',['SOURCE_NOT_REGISTERED']);
  if(!target)return fail(input,'TARGET_REPOSITORY_UNKNOWN',['TARGET_NOT_REGISTERED']);
  if(!identityMatches(source,input.sourceRepository))return fail(input,'SOURCE_REPOSITORY_IDENTITY_MISMATCH',['NUMERIC_ID_OR_FULL_NAME_MISMATCH']);
  if(!identityMatches(target,input.targetRepository))return fail(input,'TARGET_REPOSITORY_IDENTITY_MISMATCH',['NUMERIC_ID_OR_FULL_NAME_MISMATCH']);
  if(!SHA40.test(input.sourceHead??''))return fail(input,'SOURCE_HEAD_INVALID',['SOURCE_HEAD_MUST_BE_40_HEX']);
  if(input.evidence?.algorithm!=='sha256'||!SHA256.test(input.evidence?.digest??''))return fail(input,'EVIDENCE_DIGEST_INVALID',['SHA256_DIGEST_REQUIRED']);
  const operation=input.operation;
  if(!source.allowedOperations?.includes(operation)||!target.allowedOperations?.includes(operation))return fail(input,'FEDERATION_OPERATION_NOT_ALLOWED',[`OPERATION_NOT_REGISTERED:${operation??'NULL'}`]);
  if(source.externalWritesAllowed!==false||target.externalWritesAllowed!==false)return fail(input,'FEDERATION_REGISTRY_WRITE_BOUNDARY_INVALID',['EXTERNAL_WRITES_MUST_BE_FALSE']);
  return stable({schema:RECEIPT_SCHEMA,result:'PASS_CLOSED',decision:'ALLOW_READ_ONLY',errorCode:null,operation,sourceRepositoryId:source.repositoryId,targetRepositoryId:target.repositoryId,sourceFullName:source.fullName,targetFullName:target.fullName,sourceHead:input.sourceHead,evidenceDigest:input.evidence.digest,evidenceAlgorithm:'sha256',federationMode:target.federationMode,evidenceMayPropagate:true,authorityMayPropagate:false,externalMutationPerformed:false,...boundary});
}
function args(argv){const o={};for(let i=0;i<argv.length;i+=2){if(!argv[i]?.startsWith('--')||argv[i+1]===undefined)throw Error('CLI_ARGUMENT_INVALID');o[argv[i].slice(2)]=argv[i+1];}return o;}
const direct=()=>process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(direct()){
  try{const a=args(process.argv.slice(2));const input=JSON.parse(fs.readFileSync(a.input,'utf8'));const registry=JSON.parse(fs.readFileSync(a.registry,'utf8'));const receipt=evaluateFederation(input,registry);write(a.output,receipt);if(receipt.result!=='PASS_CLOSED')process.exitCode=3;}
  catch(error){const receipt=fail({},error.message||'FEDERATION_GATE_EXCEPTION',['GATE_EXCEPTION']);const i=process.argv.indexOf('--output');if(i>=0&&process.argv[i+1])write(process.argv[i+1],receipt);else process.stderr.write(JSON.stringify(receipt)+'\n');process.exitCode=1;}
}
