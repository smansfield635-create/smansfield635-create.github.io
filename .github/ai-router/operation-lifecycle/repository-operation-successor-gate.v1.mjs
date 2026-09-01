#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepare } from '../../../tools/operation-intake/repository-operation-intake-gate.v1.mjs';
import {
  LEDGER_PATH,
  buildAuthorityProvenance,
  captureAuthorityInvocationFromEnvironment,
  canonScope,
  ledger,
  scopeHash,
  stable,
  text,
  verifyRemoteAuthorityProvenance
} from '../../../tools/operation-intake/repository-operation-lock-manager.v1.mjs';

export const TRANSITION_SCHEMA='REPOSITORY_OPERATION_SUCCESSOR_TRANSITION_REQUEST_v1';
export const RECEIPT_SCHEMA='REPOSITORY_OPERATION_SUCCESSOR_TRANSITION_RECEIPT_v1';
export const DEFAULT_LOCK_REF='refs/heads/operation-locks/repository-operation-intake-v1';
export const DEFAULT_GOVERNING_REF='refs/heads/main';
export const AUTHORITY_POLICY='FRESH_SUCCESSOR_REQUEST_REQUIRED_NO_IMPLICIT_INHERITANCE';
export const EVIDENCE_POLICY='EXACT_HEAD_REVALIDATION_REQUIRED';
export const DEFAULT_CAS_RETRY_LIMIT=8;
const SUCCESSOR_MARKERS=['REMOTE_OPERATION_SUCCESSOR_REQUEST_V1','REMOTE_OPERATION_SUCCESSOR_COMPILE_AND_EXECUTE_REQUEST_V1'];
const ACTIVE_STATES=new Set(['ADMITTED_LOCKED','EXECUTING','BLOCKED_OPEN']);

function failure(code,field,source,detail=null){const error=new Error(`${code}:${field}:source=${source}${detail?`:${detail}`:''}`);Object.assign(error,{code,field,sourceDocument:source,detail});return error}
function requiredString(value,field,source){if(typeof value!=='string'||value.length===0)throw failure('MISSING_OR_INVALID_FIELD',field,source);return value}
function digest(value,length,field,source){requiredString(value,field,source);if(!new RegExp(`^[0-9a-f]{${length}}$`).test(value))throw failure('MISSING_OR_INVALID_DIGEST',field,source);return value}
function requiredObject(value,field,source){if(!value||typeof value!=='object'||Array.isArray(value))throw failure('MISSING_OR_INVALID_FIELD',field,source);return value}
function requiredArray(value,field,source){if(!Array.isArray(value))throw failure('MISSING_OR_INVALID_FIELD',field,source);return value}
function branchFromRef(ref,field='lockRef'){if(typeof ref!=='string'||!ref.startsWith('refs/heads/'))throw failure('INVALID_BRANCH_REF',field,'successor-transition');return ref.slice('refs/heads/'.length)}
function retryLimit(value){if(!Number.isInteger(value)||value<1||value>32)throw failure('INVALID_CAS_RETRY_LIMIT','casRetryLimit','remote-successor');return value}
const delay=milliseconds=>new Promise(resolve=>setTimeout(resolve,milliseconds));

export function validateTransition(raw){
  const source='successor-transition',transition=requiredObject(raw,'$',source);
  if(transition.schema!==TRANSITION_SCHEMA)throw failure('SUCCESSOR_TRANSITION_SCHEMA_MISMATCH','schema',source);
  for(const field of ['transitionId','reasonCode','governingRef','authorityPolicy','evidencePolicy','predecessor','successor','inheritedAuthority','preservedEvidenceRefs'])if(!Object.hasOwn(transition,field))throw failure('MISSING_SUCCESSOR_TRANSITION_FIELD',field,source);
  requiredString(transition.transitionId,'transitionId',source);
  if(transition.reasonCode!=='GOVERNING_HEAD_ADVANCED')throw failure('SUCCESSOR_REASON_INVALID','reasonCode',source);
  if(transition.governingRef!==DEFAULT_GOVERNING_REF)throw failure('SUCCESSOR_GOVERNING_REF_INVALID','governingRef',source);
  if(transition.authorityPolicy!==AUTHORITY_POLICY)throw failure('SUCCESSOR_AUTHORITY_POLICY_INVALID','authorityPolicy',source);
  if(transition.evidencePolicy!==EVIDENCE_POLICY)throw failure('SUCCESSOR_EVIDENCE_POLICY_INVALID','evidencePolicy',source);
  const inherited=requiredArray(transition.inheritedAuthority,'inheritedAuthority',source);if(inherited.length!==0)throw failure('IMPLICIT_AUTHORITY_INHERITANCE_FORBIDDEN','inheritedAuthority',source);
  const evidence=requiredArray(transition.preservedEvidenceRefs,'preservedEvidenceRefs',source);for(let i=0;i<evidence.length;i++)requiredString(evidence[i],`preservedEvidenceRefs[${i}]`,source);if(new Set(evidence).size!==evidence.length)throw failure('DUPLICATE_PRESERVED_EVIDENCE_REF','preservedEvidenceRefs',source);
  const predecessor=requiredObject(transition.predecessor,'predecessor',source),successor=requiredObject(transition.successor,'successor',source);
  requiredString(predecessor.operationId,'predecessor.operationId',source);const predecessorScope=canonScope(requiredString(predecessor.lockScope,'predecessor.lockScope',source));
  if(!Number.isInteger(predecessor.lockGeneration)||predecessor.lockGeneration<1)throw failure('SUCCESSOR_PREDECESSOR_GENERATION_INVALID','predecessor.lockGeneration',source);
  digest(predecessor.governingHead,40,'predecessor.governingHead',source);requiredString(successor.operationId,'successor.operationId',source);const successorScope=canonScope(requiredString(successor.lockScope,'successor.lockScope',source));digest(successor.governingHead,40,'successor.governingHead',source);
  if(predecessor.operationId===successor.operationId)throw failure('SUCCESSOR_OPERATION_ID_MUST_CHANGE','successor.operationId',source);
  if(predecessor.governingHead===successor.governingHead)throw failure('SUCCESSOR_HEAD_NOT_ADVANCED','successor.governingHead',source);
  return stable({...transition,predecessor:{...predecessor,lockScope:predecessorScope},successor:{...successor,lockScope:successorScope},preservedEvidenceRefs:[...evidence]});
}

export function successorLocal(rawLedger,rawTransition,rawRequest,rawProcedure,options={}){
  const prepared=prepare(rawRequest,rawProcedure),transition=validateTransition(rawTransition),request=prepared.request;
  if(transition.successor.operationId!==request.operationId)throw failure('SUCCESSOR_OPERATION_ID_MISMATCH','successor.operationId','transition-and-request');
  if(transition.successor.lockScope!==canonScope(request.lockScope))throw failure('SUCCESSOR_SCOPE_MISMATCH','successor.lockScope','transition-and-request');
  if(transition.successor.governingHead!==request.exactGoverningHead)throw failure('SUCCESSOR_GOVERNING_HEAD_MISMATCH','successor.governingHead','transition-and-request');
  const before=ledger(rawLedger),predecessorHash=scopeHash(transition.predecessor.lockScope),successorHash=scopeHash(transition.successor.lockScope),predecessor=before.activeScopes[predecessorHash];
  if(!predecessor||predecessor.released||!ACTIVE_STATES.has(predecessor.state))throw failure('ACTIVE_PREDECESSOR_NOT_FOUND','predecessor.lockScope','active-operation-ledger');
  if(predecessor.operationId!==transition.predecessor.operationId)throw failure('PREDECESSOR_OPERATION_ID_MISMATCH','predecessor.operationId','active-operation-ledger');
  if(predecessor.lockGeneration!==transition.predecessor.lockGeneration)throw failure('PREDECESSOR_LOCK_GENERATION_MISMATCH','predecessor.lockGeneration','active-operation-ledger');
  if(predecessor.governingHead!==transition.predecessor.governingHead)throw failure('PREDECESSOR_GOVERNING_HEAD_MISMATCH','predecessor.governingHead','active-operation-ledger');
  const existingSuccessorScope=before.activeScopes[successorHash];if(successorHash!==predecessorHash&&existingSuccessorScope&&!existingSuccessorScope.released&&ACTIVE_STATES.has(existingSuccessorScope.state))throw failure('SUCCESSOR_SCOPE_ALREADY_LOCKED','successor.lockScope','active-operation-ledger');
  const successorGeneration=before.lockGeneration+1;
  const terminalPredecessor=stable({...predecessor,state:'TERMINAL',terminalDisposition:'SUPERSEDED',released:true,supersession:{schema:'REPOSITORY_OPERATION_SUPERSESSION_LINK_v1',transitionId:transition.transitionId,reasonCode:transition.reasonCode,successorOperationId:transition.successor.operationId,successorLockScope:transition.successor.lockScope,successorLockGeneration:successorGeneration,successorGoverningHead:transition.successor.governingHead,authorityInherited:false,exactHeadRevalidationRequired:true,preservedEvidenceRefs:transition.preservedEvidenceRefs}});
  let successorLock={schema:'REPOSITORY_OPERATION_LOCK_v1',operationId:request.operationId,lockScope:transition.successor.lockScope,scopeHash:successorHash,state:'ADMITTED_LOCKED',governingHead:request.exactGoverningHead,requestDigest:prepared.requestDigest,procedureLocatorDigest:prepared.procedureLocatorDigest,lockGeneration:successorGeneration,released:false,predecessor:{schema:'REPOSITORY_OPERATION_PREDECESSOR_LINK_v1',transitionId:transition.transitionId,operationId:transition.predecessor.operationId,lockScope:transition.predecessor.lockScope,lockGeneration:transition.predecessor.lockGeneration,governingHead:transition.predecessor.governingHead,terminalDisposition:'SUPERSEDED',authorityInherited:false,exactHeadRevalidationRequired:true,preservedEvidenceRefs:transition.preservedEvidenceRefs}};
  const provenance=buildAuthorityProvenance(successorLock,options.authorityInvocation||null,'CANONICAL_SUCCESSOR',options.authorityLineageAnchorCommitSha||null);if(provenance)successorLock={...successorLock,authorityProvenance:provenance};successorLock=stable(successorLock);
  const activeScopes={...before.activeScopes};delete activeScopes[predecessorHash];activeScopes[successorHash]=successorLock;
  const after=stable({...before,lockGeneration:successorGeneration,activeScopes,terminalHistory:[...before.terminalHistory,terminalPredecessor]});
  const receipt=stable({schema:RECEIPT_SCHEMA,result:'SUCCESSOR_ADMITTED_PREDECESSOR_SUPERSEDED',transitionId:transition.transitionId,reasonCode:transition.reasonCode,governingRef:transition.governingRef,predecessor:{operationId:transition.predecessor.operationId,lockScope:transition.predecessor.lockScope,scopeHash:predecessorHash,lockGeneration:transition.predecessor.lockGeneration,governingHead:transition.predecessor.governingHead,terminalDisposition:'SUPERSEDED',terminalHistoryPreserved:true},successor:{operationId:request.operationId,projectId:request.projectId,lockScope:transition.successor.lockScope,scopeHash:successorHash,lockGeneration:successorGeneration,governingHead:request.exactGoverningHead,requestDigest:prepared.requestDigest,procedureLocatorDigest:prepared.procedureLocatorDigest,state:'ADMITTED_LOCKED',authorityProvenanceBound:!!successorLock.authorityProvenance},authorityPolicy:transition.authorityPolicy,authorityInherited:false,authoritySource:'FRESH_SUCCESSOR_REQUEST_AND_CONSTRUCTION_PROCEDURE',evidencePolicy:transition.evidencePolicy,exactHeadRevalidationRequired:true,preservedEvidenceRefs:transition.preservedEvidenceRefs,operationStarted:true,branchCreationAuthorized:true,repositoryWritesAuthorized:true,workflowExecutionAuthorized:true,implementationInferenceAuthorized:false,ledgerGenerationBefore:before.lockGeneration,ledgerGenerationAfter:successorGeneration,oneLedgerMutationRequired:true});
  return{receipt,ledger:after};
}

function headers(token){requiredString(token,'GITHUB_TOKEN','environment');return{Accept:'application/vnd.github+json',Authorization:`Bearer ${token}`,'X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'}}
function repositoryBase(repository){requiredString(repository,'repository','remote-successor');if(!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository))throw failure('INVALID_REPOSITORY','repository','remote-successor');return`https://api.github.com/repos/${repository}`}
async function githubRequest(url,options,accepted=[200]){const response=await fetch(url,options),raw=await response.text();let body;try{body=raw?JSON.parse(raw):null}catch{body={raw}}if(!accepted.includes(response.status)){const error=new Error(`GITHUB_API_ERROR:${response.status}`);Object.assign(error,{status:response.status,body});throw error}return body}
async function readRefHead({repository,ref,token}){const base=repositoryBase(repository),branch=branchFromRef(ref,'governingRef'),response=await githubRequest(`${base}/git/ref/${encodeURIComponent(`heads/${branch}`)}`,{headers:headers(token)});return digest(response.object.sha,40,'governingRefHead','remote-successor')}
function decodeLedgerContent(content,source){if(typeof content!=='string'||!content.replace(/\s/g,''))throw failure('LEDGER_CONTENT_UNAVAILABLE','content',source);try{return ledger(JSON.parse(Buffer.from(content.replace(/\s/g,''),'base64').toString('utf8')))}catch(error){if(error.code)throw error;throw failure('LEDGER_JSON_DECODE_FAILURE','content',source,error.message)}}
export async function readLedgerRemote({repository,lockRef=DEFAULT_LOCK_REF,token}){const base=repositoryBase(repository),branch=branchFromRef(lockRef,'lockRef'),ref=await githubRequest(`${base}/git/ref/${encodeURIComponent(`heads/${branch}`)}`,{headers:headers(token)}),branchHead=digest(ref.object.sha,40,'lockRefHead','remote-successor'),encodedPath=LEDGER_PATH.split('/').map(encodeURIComponent).join('/'),file=await githubRequest(`${base}/contents/${encodedPath}?ref=${encodeURIComponent(branchHead)}`,{headers:headers(token)}),blob=digest(file.sha,40,'ledgerBlobSha','remote-successor');if(typeof file.content==='string'&&file.content.replace(/\s/g,''))return{branch,branchHead,blob,ledger:decodeLedgerContent(file.content,'contents-api'),contentTransport:'CONTENTS_INLINE'};const gitBlob=await githubRequest(`${base}/git/blobs/${blob}`,{headers:headers(token)});if(gitBlob.encoding!=='base64')throw failure('LEDGER_BLOB_ENCODING_UNSUPPORTED','encoding','git-blob',String(gitBlob.encoding));return{branch,branchHead,blob,ledger:decodeLedgerContent(gitBlob.content,'git-blob'),contentTransport:'GIT_BLOB_FALLBACK'}}
async function putLedgerRemote({repository,lockRef=DEFAULT_LOCK_REF,token,blob,nextLedger,message}){const base=repositoryBase(repository),branch=branchFromRef(lockRef,'lockRef'),encodedPath=LEDGER_PATH.split('/').map(encodeURIComponent).join('/');try{const result=await githubRequest(`${base}/contents/${encodedPath}`,{method:'PUT',headers:headers(token),body:JSON.stringify({message,content:Buffer.from(text(nextLedger),'utf8').toString('base64'),sha:blob,branch})},[200]);return{ok:true,commit:result.commit.sha,blob:result.content.sha}}catch(error){if([409,422].includes(error.status))return{ok:false,errorCode:'LEDGER_COMPARE_AND_SWAP_CONFLICT',httpStatus:error.status};throw error}}

export async function successorRemote({repository,lockRef=DEFAULT_LOCK_REF,token,transition,request,procedure,casRetryLimit=DEFAULT_CAS_RETRY_LIMIT,authorityVerifier=verifyRemoteAuthorityProvenance,authorityInvocation=undefined}){
  const validatedTransition=validateTransition(transition),prepared=prepare(request,procedure),maxAttempts=retryLimit(casRetryLimit);
  if(validatedTransition.successor.governingHead!==prepared.request.exactGoverningHead)throw failure('SUCCESSOR_GOVERNING_HEAD_MISMATCH','successor.governingHead','transition-and-request');
  const invocation=authorityInvocation===undefined?captureAuthorityInvocationFromEnvironment({allowedMarkers:SUCCESSOR_MARKERS}):authorityInvocation;
  let lastConflict=null;
  for(let attempt=1;attempt<=maxAttempts;attempt++){
    const liveGoverningHead=await readRefHead({repository,ref:validatedTransition.governingRef,token});
    if(liveGoverningHead!==prepared.request.exactGoverningHead)throw failure('LIVE_GOVERNING_HEAD_MISMATCH','exactGoverningHead','remote-successor',`expected=${prepared.request.exactGoverningHead}:observed=${liveGoverningHead}`);
    const observed=await readLedgerRemote({repository,lockRef,token}),preflight=successorLocal(observed.ledger,validatedTransition,prepared.request,prepared.procedure),predecessor=observed.ledger.activeScopes[preflight.receipt.predecessor.scopeHash];
    const authorityVerification=await authorityVerifier({repository,token,lock:predecessor,branchHead:observed.branchHead});
    const local=successorLocal(observed.ledger,validatedTransition,prepared.request,prepared.procedure,{authorityInvocation:invocation,authorityLineageAnchorCommitSha:observed.branchHead});
    const committed=await putLedgerRemote({repository,lockRef,token,blob:observed.blob,nextLedger:local.ledger,message:`Supersede operation ${local.receipt.predecessor.lockGeneration} with successor ${local.receipt.successor.lockGeneration}: ${local.receipt.successor.operationId}`});
    if(committed.ok)return stable({...local.receipt,authorityVerification,liveGoverningHead,observedLedgerBlobSha:observed.blob,observedLockRefHead:observed.branchHead,committedLedgerBlobSha:committed.blob,transitionCommitSha:committed.commit,contentTransport:observed.contentTransport,ledgerCompareAndSwapCommitted:true,casAttempt:attempt,casRetryLimit:maxAttempts});
    lastConflict=stable({errorCode:committed.errorCode,httpStatus:committed.httpStatus,observedLedgerBlobSha:observed.blob,observedLockRefHead:observed.branchHead,contentTransport:observed.contentTransport,liveGoverningHead,predecessor:local.receipt.predecessor,successor:local.receipt.successor});
    if(committed.errorCode!=='LEDGER_COMPARE_AND_SWAP_CONFLICT'||attempt===maxAttempts)break;await delay(attempt*125);
  }
  return stable({schema:RECEIPT_SCHEMA,result:'SUCCESSOR_NOT_ADMITTED',errorCode:lastConflict?.errorCode||'SUCCESSOR_REMOTE_COMMIT_FAILED',httpStatus:lastConflict?.httpStatus||null,transitionId:validatedTransition.transitionId,predecessor:lastConflict?.predecessor||null,successor:lastConflict?.successor||null,observedLedgerBlobSha:lastConflict?.observedLedgerBlobSha||null,observedLockRefHead:lastConflict?.observedLockRefHead||null,contentTransport:lastConflict?.contentTransport||null,liveGoverningHead:lastConflict?.liveGoverningHead||null,authorityInherited:false,exactHeadRevalidationRequired:true,repositoryWritesAuthorized:false,ledgerCompareAndSwapCommitted:false,casAttempts:maxAttempts,casRetryLimit:maxAttempts});
}

function parseArgs(argv){const parsed={};for(let index=0;index<argv.length;index++){const token=argv[index];if(!token.startsWith('--'))throw failure('UNKNOWN_ARGUMENT',token,'cli');parsed[token.slice(2)]=argv[++index]??null}return parsed}
function readJson(file,field){if(!file)throw failure('MISSING_CLI_ARGUMENT',field,'cli');try{return JSON.parse(fs.readFileSync(path.resolve(file),'utf8'))}catch(error){throw failure('INVALID_JSON_INPUT',field,'filesystem',error.message)}}
function writeJson(file,value){if(!file)return process.stdout.write(text(value));const absolute=path.resolve(file);fs.mkdirSync(path.dirname(absolute),{recursive:true});fs.writeFileSync(absolute,text(value))}
async function main(){const args=parseArgs(process.argv.slice(2)),transition=readJson(args.transition,'transition'),request=readJson(args.request,'request'),procedure=readJson(args.procedure,'procedure'),receipt=await successorRemote({repository:args.repository,lockRef:args['lock-ref']||DEFAULT_LOCK_REF,token:process.env.GITHUB_TOKEN,transition,request,procedure,casRetryLimit:args['cas-retry-limit']?Number(args['cas-retry-limit']):DEFAULT_CAS_RETRY_LIMIT});writeJson(args.output,receipt);if(receipt.result!=='SUCCESSOR_ADMITTED_PREDECESSOR_SUPERSEDED')process.exitCode=4}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1]))main().catch(error=>{const receipt=stable({schema:RECEIPT_SCHEMA,result:'SUCCESSOR_NOT_ADMITTED',errorCode:error.code||'UNEXPECTED_SUCCESSOR_GATE_ERROR',field:error.field||null,sourceDocument:error.sourceDocument||null,detail:error.detail||null,error:error.message,authorityInherited:false,exactHeadRevalidationRequired:true,operationStarted:false,branchCreationAuthorized:false,repositoryWritesAuthorized:false,workflowExecutionAuthorized:false,implementationInferenceAuthorized:false});try{writeJson(parseArgs(process.argv.slice(2)).output,receipt)}catch{process.stderr.write(text(receipt))}process.exitCode=1});
