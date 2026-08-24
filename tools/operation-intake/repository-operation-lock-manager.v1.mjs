#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const LEDGER_PATH = '.github/operation-intake/active-operation-ledger.v1.json';
export const LOCK_REF = 'refs/heads/operation-locks/repository-operation-intake-v1';
export const AUTHORITY_PROVENANCE_SCHEMA = 'REPOSITORY_OPERATION_AUTHORITY_PROVENANCE_v1';
export const AUTHORITY_INVOCATION_SCHEMA = 'REPOSITORY_OPERATION_AUTHORITY_INVOCATION_v1';
export const LEGACY_AUTHORITY_SNAPSHOT_BLOBS = ['f9c84e0a56b3b566f9da8eced8abc9348eb32ef5'];
export const LEGACY_AUTHORITY_CUTOVER_COMMIT = 'b424015070450aaddc86013d72eaeb2a28bb7b04';
const TERMINAL = ['PASS_CLOSED','FAIL_CLOSED','REJECTED_CLOSED','WITHDRAWN','SUPERSEDED','VOIDED','EXPIRED'];
const ACTIVE = new Set(['ADMITTED_LOCKED','EXECUTING','BLOCKED_OPEN']);
const TRUSTED_ASSOCIATIONS = new Set(['OWNER','MEMBER','COLLABORATOR']);
const CANONICAL_MARKER = 'CANONICAL_OPERATION_INTAKE_REQUEST_V1';
const SUCCESSOR_MARKERS = new Set(['REMOTE_OPERATION_SUCCESSOR_REQUEST_V1','REMOTE_OPERATION_SUCCESSOR_COMPILE_AND_EXECUTE_REQUEST_V1']);

export const stable = v => Array.isArray(v) ? v.map(stable) : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map(k => [k, stable(v[k])])) : v;
export const canonical = v => JSON.stringify(stable(v));
export const text = v => JSON.stringify(stable(v), null, 2) + '\n';
export const sha = v => createHash('sha256').update(v, 'utf8').digest('hex');
export const canonScope = s => { if (typeof s !== 'string' || !s.trim()) throw err('INVALID_LOCK_SCOPE','lockScope','lock-request'); return s.trim().toUpperCase(); };
export const scopeHash = s => sha(canonScope(s));
export function err(code, field, source, detail = null) { const e = new Error(`${code}:${field}:source=${source}${detail ? ':' + detail : ''}`); Object.assign(e,{code,field,sourceDocument:source,detail}); return e; }
const str = (v,f,s) => { if (typeof v !== 'string' || !v) throw err('MISSING_OR_INVALID_FIELD',f,s); return v; };
const dig = (v,n,f,s) => { str(v,f,s); if (!new RegExp(`^[0-9a-f]{${n}}$`).test(v)) throw err('MISSING_OR_INVALID_DIGEST',f,s); return v; };
const pos = (v,f,s) => { if (!Number.isInteger(v) || v < 1) throw err('MISSING_OR_INVALID_FIELD',f,s); return v; };

function validateActiveLock(lock, key) {
  const source = 'active-operation-ledger';
  if (!lock || typeof lock !== 'object' || Array.isArray(lock)) throw err('INVALID_ACTIVE_LOCK', key, source);
  if (lock.schema !== 'REPOSITORY_OPERATION_LOCK_v1') throw err('ACTIVE_LOCK_SCHEMA_MISMATCH', `${key}.schema`, source);
  str(lock.operationId, `${key}.operationId`, source);
  const expectedHash = scopeHash(canonScope(lock.lockScope));
  if (key !== expectedHash || lock.scopeHash !== expectedHash) throw err('ACTIVE_LOCK_SCOPE_HASH_MISMATCH', key, source);
  if (!ACTIVE.has(lock.state) || lock.released !== false) throw err('ACTIVE_LOCK_STATE_INVALID', key, source);
  dig(lock.governingHead,40,`${key}.governingHead`,source);
  dig(lock.requestDigest,64,`${key}.requestDigest`,source);
  dig(lock.procedureLocatorDigest,64,`${key}.procedureLocatorDigest`,source);
  pos(lock.lockGeneration,`${key}.lockGeneration`,source);
  if (lock.authorityProvenance !== undefined) verifyAuthorityProvenanceBinding(lock);
}

export function ledger(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) throw err('INVALID_LEDGER_OBJECT','$','ledger');
  if (v.schema !== 'REPOSITORY_ACTIVE_OPERATION_LEDGER_v1') throw err('LEDGER_SCHEMA_MISMATCH','schema','ledger');
  if (!Number.isInteger(v.lockGeneration) || v.lockGeneration < 0) throw err('INVALID_LOCK_GENERATION','lockGeneration','ledger');
  if (!v.activeScopes || typeof v.activeScopes !== 'object' || Array.isArray(v.activeScopes) || !Array.isArray(v.terminalHistory)) throw err('INVALID_LEDGER_SHAPE','$','ledger');
  for (const [key,lock] of Object.entries(v.activeScopes)) {
    validateActiveLock(lock,key);
    if (lock.lockGeneration > v.lockGeneration) throw err('ACTIVE_LOCK_GENERATION_AHEAD_OF_LEDGER',key,'ledger');
  }
  return stable(v);
}

function markerFromBody(body) { return typeof body === 'string' ? body.split(/\r?\n/,1)[0].trim() : ''; }
function parseMarkedJson(body, marker) {
  if (typeof body !== 'string' || !body.startsWith(marker)) throw err('AUTHORITY_EVENT_MARKER_MISMATCH','comment.body','authority-provenance');
  try { return JSON.parse(body.slice(marker.length).trim()); } catch (e) { throw err('AUTHORITY_EVENT_PAYLOAD_INVALID','comment.body','authority-provenance',e.message); }
}

export function captureAuthorityInvocationFromEnvironment({ allowedMarkers = [CANONICAL_MARKER] } = {}) {
  if (process.env.GITHUB_EVENT_NAME !== 'issue_comment') return null;
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath || !fs.existsSync(eventPath)) throw err('AUTHORITY_EVENT_NOT_AUTHENTICATED','GITHUB_EVENT_PATH','environment');
  let event;
  try { event = JSON.parse(fs.readFileSync(eventPath,'utf8')); } catch (e) { throw err('AUTHORITY_EVENT_NOT_AUTHENTICATED','GITHUB_EVENT_PATH','environment',e.message); }
  const body = event?.comment?.body, marker = markerFromBody(body), association = event?.comment?.author_association;
  if (!allowedMarkers.includes(marker)) throw err('AUTHORITY_EVENT_NOT_AUTHENTICATED','comment.body','github-event',marker || 'EMPTY_MARKER');
  if (!TRUSTED_ASSOCIATIONS.has(association)) throw err('AUTHORITY_EVENT_NOT_AUTHENTICATED','comment.author_association','github-event',String(association));
  const repository = event?.repository?.full_name, issueNumber = event?.issue?.number, commentId = event?.comment?.id, authorLogin = event?.comment?.user?.login;
  const workflowRunId = Number(process.env.GITHUB_RUN_ID), workflowRunAttempt = Number(process.env.GITHUB_RUN_ATTEMPT || 1);
  if (typeof repository !== 'string' || !Number.isInteger(issueNumber) || !Number.isInteger(commentId) || typeof authorLogin !== 'string' || !Number.isInteger(workflowRunId) || workflowRunId < 1 || !Number.isInteger(workflowRunAttempt) || workflowRunAttempt < 1) throw err('AUTHORITY_EVENT_NOT_AUTHENTICATED','github-event','environment','MISSING_EVENT_IDENTITY');
  return stable({schema:AUTHORITY_INVOCATION_SCHEMA,eventName:'issue_comment',eventAction:event?.action || 'created',repository,issueNumber,commentId,commentAuthorLogin:authorLogin,commentAuthorAssociation:association,commentBodySha256:sha(body),marker,workflowRunId,workflowRunAttempt,workflowRef:process.env.GITHUB_WORKFLOW_REF || null,workflowSha:process.env.GITHUB_SHA || null});
}

export function authorityIdentity(lock) {
  return stable({operationId:str(lock.operationId,'operationId','authority-identity'),lockScope:canonScope(lock.lockScope),scopeHash:dig(lock.scopeHash,64,'scopeHash','authority-identity'),governingHead:dig(lock.governingHead,40,'governingHead','authority-identity'),requestDigest:dig(lock.requestDigest,64,'requestDigest','authority-identity'),procedureLocatorDigest:dig(lock.procedureLocatorDigest,64,'procedureLocatorDigest','authority-identity'),lockGeneration:pos(lock.lockGeneration,'lockGeneration','authority-identity')});
}

export function buildAuthorityProvenance(lock, invocation, origin, lineageAnchorCommitSha = null) {
  if (!invocation) return null;
  const anchor = dig(lineageAnchorCommitSha,40,'lineageAnchorCommitSha','authority-provenance');
  if (invocation.schema !== AUTHORITY_INVOCATION_SCHEMA) throw err('AUTHORITY_EVENT_NOT_AUTHENTICATED','schema','authority-invocation');
  if (!['CANONICAL_INTAKE','CANONICAL_SUCCESSOR'].includes(origin)) throw err('AUTHORITY_PROVENANCE_ORIGIN_INVALID','origin','authority-provenance');
  const core = stable({schema:AUTHORITY_PROVENANCE_SCHEMA,origin,authorityIdentity:authorityIdentity(lock),invocation,lineageAnchorCommitSha:anchor});
  return stable({...core,bindingDigest:sha(canonical(core))});
}

export function verifyAuthorityProvenanceBinding(lock) {
  const p = lock?.authorityProvenance;
  if (!p) throw err('AUTHORITY_PROVENANCE_MISSING','authorityProvenance','authority-provenance');
  if (p.schema !== AUTHORITY_PROVENANCE_SCHEMA || !['CANONICAL_INTAKE','CANONICAL_SUCCESSOR'].includes(p.origin) || !p.invocation || p.invocation.schema !== AUTHORITY_INVOCATION_SCHEMA) throw err('AUTHORITY_PROVENANCE_BINDING_MISMATCH','authorityProvenance','authority-provenance');
  dig(p.lineageAnchorCommitSha,40,'authorityProvenance.lineageAnchorCommitSha','authority-provenance');
  const currentIdentity = authorityIdentity(lock);
  if (canonical(p.authorityIdentity) !== canonical(currentIdentity)) throw err('AUTHORITY_PROVENANCE_BINDING_MISMATCH','authorityIdentity','authority-provenance');
  const core = stable({schema:p.schema,origin:p.origin,authorityIdentity:p.authorityIdentity,invocation:p.invocation,lineageAnchorCommitSha:p.lineageAnchorCommitSha});
  if (p.bindingDigest !== sha(canonical(core))) throw err('AUTHORITY_PROVENANCE_BINDING_MISMATCH','bindingDigest','authority-provenance');
  return stable({result:'AUTHORITY_PROVENANCE_BOUND',origin:p.origin,authorityIdentity:currentIdentity,invocation:p.invocation});
}

export function acquireLocal(raw,r) {
  const l=ledger(raw),operationId=str(r.operationId,'operationId','lock-request'),lockScope=canonScope(r.lockScope),governingHead=dig(r.governingHead,40,'governingHead','lock-request'),requestDigest=dig(r.requestDigest,64,'requestDigest','lock-request'),procedureLocatorDigest=dig(r.procedureLocatorDigest,64,'procedureLocatorDigest','lock-request'),h=scopeHash(lockScope),x=l.activeScopes[h];
  if (x && !x.released && ACTIVE.has(x.state)) return {acquired:false,result:'ACTIVE_SCOPE_ALREADY_LOCKED',errorCode:'ACTIVE_OPERATION_ALREADY_EXISTS',activeOperationId:x.operationId,lockGeneration:x.lockGeneration,scopeHash:h,ledger:l};
  const g=l.lockGeneration+1;
  let lock={schema:'REPOSITORY_OPERATION_LOCK_v1',operationId,lockScope,scopeHash:h,state:'ADMITTED_LOCKED',governingHead,requestDigest,procedureLocatorDigest,lockGeneration:g,released:false};
  const provenance=buildAuthorityProvenance(lock,r.authorityInvocation || null,'CANONICAL_INTAKE',r.authorityLineageAnchorCommitSha || null);
  if (provenance) lock={...lock,authorityProvenance:provenance};
  return {acquired:true,result:'ADMITTED_AND_LOCKED',lock:stable(lock),ledger:stable({...l,lockGeneration:g,activeScopes:{...l.activeScopes,[h]:lock}})};
}

export function closeLocal(raw,r) {
  const l=ledger(raw),operationId=str(r.operationId,'operationId','closure-request'),lockScope=canonScope(r.lockScope),h=scopeHash(lockScope),g=Number(r.lockGeneration),d=str(r.terminalDisposition,'terminalDisposition','closure-request'),x=l.activeScopes[h];
  if (!TERMINAL.includes(d)) throw err('TERMINAL_DISPOSITION_INVALID','terminalDisposition','closure-request');
  if (!x) throw err('ACTIVE_LOCK_NOT_FOUND','lockScope','ledger');
  if (x.operationId!==operationId) throw err('LOCK_OPERATION_ID_MISMATCH','operationId','closure-request');
  if (x.lockGeneration!==g) throw err('LOCK_GENERATION_MISMATCH','lockGeneration','closure-request');
  const terminal=stable({...x,state:'TERMINAL',terminalDisposition:d,released:true}),activeScopes={...l.activeScopes}; delete activeScopes[h];
  return {closed:true,receipt:{schema:'REPOSITORY_OPERATION_CLOSURE_RECEIPT_v1',operationId,lockScope,scopeHash:h,lockGeneration:g,terminalDisposition:d,terminalHistoryPreserved:true,lockReleased:true},ledger:stable({...l,activeScopes,terminalHistory:[...l.terminalHistory,terminal]})};
}

const branch=r=>{if(typeof r!=='string'||!r.startsWith('refs/heads/'))throw err('INVALID_LOCK_REF','lockRef','remote-lock');return r.slice(11)};
const H=t=>({Accept:'application/vnd.github+json',Authorization:`Bearer ${str(t,'GITHUB_TOKEN','environment')}`,'X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'});
const base=r=>{const v=str(r,'repository','remote-lock');if(!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(v))throw err('INVALID_REPOSITORY','repository','remote-lock');return `https://api.github.com/repos/${v}`};
async function req(u,o,ok=[200]){const z=await fetch(u,o),q=await z.text();let b;try{b=q?JSON.parse(q):null}catch{b={raw:q}}if(!ok.includes(z.status)){const e=new Error(`GITHUB_API_ERROR:${z.status}`);e.status=z.status;e.body=b;throw e}return b}

export async function ensureRef({repository,lockRef=LOCK_REF,baseHead,token}) {
  dig(baseHead,40,'baseHead','remote-lock');const b=branch(lockRef),u=base(repository),r=encodeURIComponent('heads/'+b);
  try{const x=await req(`${u}/git/ref/${r}`,{headers:H(token)});return{result:'LOCK_REF_ALREADY_EXISTS',branch:b,head:x.object.sha}}catch(e){if(e.status!==404)throw e}
  try{const x=await req(`${u}/git/refs`,{method:'POST',headers:H(token),body:JSON.stringify({ref:lockRef,sha:baseHead})},[201]);return{result:'LOCK_REF_CREATED',branch:b,head:x.object.sha}}catch(e){if(e.status!==422)throw e;const x=await req(`${u}/git/ref/${r}`,{headers:H(token)});return{result:'LOCK_REF_ALREADY_EXISTS_AFTER_RACE',branch:b,head:x.object.sha}}
}

const decodeContent=(content,source)=>{if(typeof content!=='string'||!content.replace(/\s/g,''))throw err('LEDGER_CONTENT_UNAVAILABLE','content',source);try{return ledger(JSON.parse(Buffer.from(content.replace(/\s/g,''),'base64').toString()))}catch(e){if(e.code)throw e;throw err('LEDGER_JSON_DECODE_FAILURE','content',source,e.message)}};
async function readRemote({repository,lockRef=LOCK_REF,token}) {
  const b=branch(lockRef),u=base(repository),p=LEDGER_PATH.split('/').map(encodeURIComponent).join('/'),r=await req(`${u}/git/ref/${encodeURIComponent('heads/'+b)}`,{headers:H(token)}),head=dig(r.object.sha,40,'lockRefHead','remote-lock'),f=await req(`${u}/contents/${p}?ref=${encodeURIComponent(head)}`,{headers:H(token)}),blob=dig(f.sha,40,'ledgerBlobSha','remote-lock');
  if(typeof f.content==='string'&&f.content.replace(/\s/g,''))return{blob,head,ledger:decodeContent(f.content,'contents-api'),contentTransport:'CONTENTS_INLINE'};
  const g=await req(`${u}/git/blobs/${blob}`,{headers:H(token)});if(g.encoding!=='base64')throw err('LEDGER_BLOB_ENCODING_UNSUPPORTED','encoding','git-blob',String(g.encoding));return{blob,head,ledger:decodeContent(g.content,'git-blob'),contentTransport:'GIT_BLOB_FALLBACK'};
}
async function put({repository,lockRef=LOCK_REF,token,blob,next,message}) {
  const b=branch(lockRef),u=base(repository),p=LEDGER_PATH.split('/').map(encodeURIComponent).join('/');
  try{const x=await req(`${u}/contents/${p}`,{method:'PUT',headers:H(token),body:JSON.stringify({message,content:Buffer.from(text(next)).toString('base64'),sha:blob,branch:b})},[200]);return{ok:true,commit:x.commit.sha,blob:x.content.sha}}catch(e){if([409,422].includes(e.status))return{ok:false,errorCode:'LEDGER_COMPARE_AND_SWAP_CONFLICT',httpStatus:e.status};throw e}
}
async function readLedgerBlob({repository,token,blobSha}){const g=await req(`${base(repository)}/git/blobs/${dig(blobSha,40,'legacySnapshotBlob','authority-provenance')}`,{headers:H(token)});if(g.encoding!=='base64')throw err('AUTHORITY_LEGACY_SNAPSHOT_ENCODING_UNSUPPORTED','encoding','authority-provenance',String(g.encoding));return decodeContent(g.content,'authority-legacy-snapshot')}
function identityMatches(a,b){return canonical(authorityIdentity(a))===canonical(authorityIdentity(b))}
async function verifyLegacyAuthority({repository,token,lock}){for(const blobSha of LEGACY_AUTHORITY_SNAPSHOT_BLOBS){const frozen=await readLedgerBlob({repository,token,blobSha}),anchored=frozen.activeScopes?.[lock.scopeHash];if(anchored&&identityMatches(anchored,lock))return stable({result:'LEGACY_AUTHORITY_SNAPSHOT_ANCHORED',snapshotBlobSha:blobSha,authorityIdentity:authorityIdentity(lock)})}throw err('AUTHORITY_PROVENANCE_MISSING','authorityProvenance','authority-provenance','NOT_IN_FROZEN_LEGACY_SNAPSHOT')}

function canonicalMutationMessage(message){return typeof message==='string'&&(/^Acquire operation lock \d+: .+/.test(message)||/^Supersede operation \d+ with successor \d+: .+/.test(message)||/^Close operation lock \d+: .+ (PASS_CLOSED|FAIL_CLOSED|REJECTED_CLOSED|WITHDRAWN|SUPERSEDED|VOIDED|EXPIRED)$/.test(message))}
export async function verifyCanonicalLockRefLineage({repository,token,branchHead,anchorCommitSha=LEGACY_AUTHORITY_CUTOVER_COMMIT}) {
  const head=dig(branchHead,40,'branchHead','authority-lineage'),anchor=dig(anchorCommitSha,40,'anchorCommitSha','authority-lineage');
  if(head===anchor)return stable({result:'CANONICAL_LOCK_REF_LINEAGE_VERIFIED',anchorCommitSha:anchor,branchHead:head,commitCount:0});
  const u=base(repository);let page=1,total=null,seen=[];
  while(page<=64){const c=await req(`${u}/compare/${anchor}...${head}?per_page=100&page=${page}`,{headers:H(token)});if(!['ahead','identical'].includes(c?.status))throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','compare.status','authority-lineage',String(c?.status));if(page===1){total=Number(c?.total_commits);if(!Number.isInteger(total)||total<0)throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','compare.total_commits','authority-lineage');const files=Array.isArray(c?.files)?c.files:[];if(files.some(f=>f?.filename!==LEDGER_PATH))throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','compare.files','authority-lineage','NON_LEDGER_PATH_MUTATION')}const commits=Array.isArray(c?.commits)?c.commits:[];seen.push(...commits);if(seen.length>=total||commits.length<100)break;page++}
  if(seen.length!==total)throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','compare.commits','authority-lineage',`expected=${total}:observed=${seen.length}`);
  for(const c of seen)if(c?.author?.login!=='github-actions[bot]'||c?.commit?.verification?.verified!==true||!canonicalMutationMessage(c?.commit?.message))throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','compare.commits','authority-lineage',String(c?.sha||'UNKNOWN_COMMIT'));
  return stable({result:'CANONICAL_LOCK_REF_LINEAGE_VERIFIED',anchorCommitSha:anchor,branchHead:head,commitCount:seen.length});
}

async function fetchComment(repository,token,commentId){return req(`${base(repository)}/issues/comments/${commentId}`,{headers:H(token)})}
async function fetchIssueComments(repository,token,issueNumber,maxPages=6){const all=[];for(let page=1;page<=maxPages;page++){const values=await req(`${base(repository)}/issues/${issueNumber}/comments?per_page=100&page=${page}`,{headers:H(token)});if(!Array.isArray(values))throw err('AUTHORITY_EVENT_NOT_AUTHENTICATED','issue.comments','authority-provenance');all.push(...values);if(values.length<100)break}return all}
function verifyCanonicalSourceComment(lock,body){const envelope=parseMarkedJson(body,CANONICAL_MARKER),request=envelope?.operationRequest,procedure=envelope?.constructionProcedure;if(!request||!procedure)throw err('AUTHORITY_EVENT_NOT_AUTHENTICATED','canonical-envelope','authority-provenance');const expected=authorityIdentity(lock);if(request.operationId!==expected.operationId||canonScope(request.lockScope)!==expected.lockScope||request.exactGoverningHead!==expected.governingHead)throw err('AUTHORITY_EVENT_NOT_AUTHENTICATED','operationRequest','authority-provenance','ROW_IDENTITY_MISMATCH');if(sha(canonical(request))!==expected.requestDigest||sha(canonical(procedure))!==expected.procedureLocatorDigest)throw err('AUTHORITY_EVENT_NOT_AUTHENTICATED','operationRequest','authority-provenance','REQUEST_OR_PROCEDURE_DIGEST_MISMATCH')}
function parseSuccessorReceiptComment(body){if(typeof body!=='string'||!body.startsWith('REMOTE_OPERATION_SUCCESSOR_RECEIPT_V1'))return null;const match=body.match(/```json\s*([\s\S]*?)\s*```/);if(!match)return null;try{return JSON.parse(match[1])}catch{return null}}
function botReceiptMatches(lock,comments,origin,runId){if(origin==='CANONICAL_INTAKE'){const op=`operationId = ${lock.operationId}`,gen=`lockGeneration = ${lock.lockGeneration}`,run=`workflowRun = ${runId}`;return comments.some(c=>c?.user?.login==='github-actions[bot]'&&typeof c.body==='string'&&c.body.includes('CANONICAL_OPERATION_INTAKE_RETURN_V1')&&c.body.includes('canonicalResult = ADMITTED_AND_LOCKED')&&c.body.includes(op)&&c.body.includes(gen)&&c.body.includes(run))}return comments.some(c=>{if(c?.user?.login!=='github-actions[bot]')return false;const r=parseSuccessorReceiptComment(c.body);if(!r||r.result!=='SUCCESSOR_ADMITTED_PREDECESSOR_SUPERSEDED')return false;const s=r.successor||{};return s.operationId===lock.operationId&&canonScope(s.lockScope)===canonScope(lock.lockScope)&&s.lockGeneration===lock.lockGeneration&&s.governingHead===lock.governingHead&&s.requestDigest===lock.requestDigest&&s.procedureLocatorDigest===lock.procedureLocatorDigest})}

export async function verifyRemoteAuthorityProvenance({repository,token,lock,branchHead}) {
  validateActiveLock(lock,lock.scopeHash);
  const anchor=lock.authorityProvenance?.lineageAnchorCommitSha||LEGACY_AUTHORITY_CUTOVER_COMMIT,lineage=await verifyCanonicalLockRefLineage({repository,token,branchHead,anchorCommitSha:anchor});
  if(!lock.authorityProvenance){const legacy=await verifyLegacyAuthority({repository,token,lock});return stable({...legacy,lineage})}
  const bound=verifyAuthorityProvenanceBinding(lock),p=lock.authorityProvenance,inv=p.invocation;
  if(inv.repository!==repository||inv.eventName!=='issue_comment'||!TRUSTED_ASSOCIATIONS.has(inv.commentAuthorAssociation))throw err('AUTHORITY_EVENT_NOT_AUTHENTICATED','invocation','authority-provenance');
  const comment=await fetchComment(repository,token,inv.commentId);
  if(comment?.id!==inv.commentId||comment?.issue_url?.split('/').pop()!==String(inv.issueNumber)||comment?.user?.login!==inv.commentAuthorLogin||comment?.author_association!==inv.commentAuthorAssociation||sha(comment?.body||'')!==inv.commentBodySha256||markerFromBody(comment?.body)!==inv.marker)throw err('AUTHORITY_EVENT_NOT_AUTHENTICATED','comment','authority-provenance','SOURCE_COMMENT_MISMATCH');
  if(p.origin==='CANONICAL_INTAKE'){if(inv.marker!==CANONICAL_MARKER)throw err('AUTHORITY_EVENT_NOT_AUTHENTICATED','marker','authority-provenance');verifyCanonicalSourceComment(lock,comment.body)}else{if(!SUCCESSOR_MARKERS.has(inv.marker))throw err('AUTHORITY_EVENT_NOT_AUTHENTICATED','marker','authority-provenance');for(const value of [lock.operationId,lock.lockScope,lock.governingHead])if(!comment.body.includes(value))throw err('AUTHORITY_EVENT_NOT_AUTHENTICATED','comment.body','authority-provenance','SUCCESSOR_ROW_NOT_BOUND_TO_SOURCE')}
  const comments=await fetchIssueComments(repository,token,inv.issueNumber);if(!botReceiptMatches(lock,comments,p.origin,inv.workflowRunId))throw err('AUTHORITY_WORKFLOW_RECEIPT_NOT_FOUND','issue.comments','authority-provenance');
  return stable({result:'AUTHENTICATED_CANONICAL_AUTHORITY',origin:p.origin,authorityIdentity:bound.authorityIdentity,issueNumber:inv.issueNumber,commentId:inv.commentId,workflowRunId:inv.workflowRunId,lineage});
}

export async function acquireRemote(a) {
  const o=await readRemote(a),authorityInvocation=captureAuthorityInvocationFromEnvironment({allowedMarkers:[CANONICAL_MARKER]}),x=acquireLocal(o.ledger,{...a,authorityInvocation,authorityLineageAnchorCommitSha:o.head});
  if(!x.acquired)return stable({schema:'REPOSITORY_OPERATION_REMOTE_LOCK_RECEIPT_v1',result:x.result,errorCode:x.errorCode,operationId:a.operationId,lockScope:canonScope(a.lockScope),scopeHash:x.scopeHash,activeOperationId:x.activeOperationId,lockGeneration:x.lockGeneration,observedLedgerBlobSha:o.blob,observedBranchHead:o.head,contentTransport:o.contentTransport,lockAcquired:false});
  if(a.readyFile){fs.mkdirSync(path.dirname(path.resolve(a.readyFile)),{recursive:true});fs.writeFileSync(path.resolve(a.readyFile),text({operationId:a.operationId,observedLedgerBlobSha:o.blob,observedBranchHead:o.head,lockGeneration:x.lock.lockGeneration}))}
  if(a.barrierFile){const deadline=Date.now()+Number(a.barrierTimeoutMs||30000);while(!fs.existsSync(path.resolve(a.barrierFile))){if(Date.now()>deadline)throw err('CAS_BARRIER_TIMEOUT','barrierFile','remote-lock');await new Promise(r=>setTimeout(r,50))}}
  if(a.preWriteDelayMs)await new Promise(r=>setTimeout(r,a.preWriteDelayMs));
  const u=await put({...a,blob:o.blob,next:x.ledger,message:`Acquire operation lock ${x.lock.lockGeneration}: ${a.operationId}`});
  return stable(u.ok?{schema:'REPOSITORY_OPERATION_REMOTE_LOCK_RECEIPT_v1',result:'ADMITTED_AND_LOCKED',operationId:a.operationId,lockScope:x.lock.lockScope,scopeHash:x.lock.scopeHash,lockGeneration:x.lock.lockGeneration,authorityProvenanceBound:!!x.lock.authorityProvenance,observedLedgerBlobSha:o.blob,observedBranchHead:o.head,committedLedgerBlobSha:u.blob,acquisitionCommitSha:u.commit,contentTransport:o.contentTransport,lockAcquired:true}:{schema:'REPOSITORY_OPERATION_REMOTE_LOCK_RECEIPT_v1',result:'LOCK_NOT_ACQUIRED',errorCode:u.errorCode,httpStatus:u.httpStatus,operationId:a.operationId,lockScope:x.lock.lockScope,scopeHash:x.lock.scopeHash,lockGeneration:x.lock.lockGeneration,observedLedgerBlobSha:o.blob,observedBranchHead:o.head,contentTransport:o.contentTransport,lockAcquired:false});
}

export async function closeRemote(a) {
  const o=await readRemote(a),h=scopeHash(a.lockScope),active=o.ledger.activeScopes[h];if(!active)throw err('ACTIVE_LOCK_NOT_FOUND','lockScope','ledger');
  const verifier=a.authorityVerifier||verifyRemoteAuthorityProvenance,authorityVerification=await verifier({repository:a.repository,token:a.token,lock:active,branchHead:o.head}),x=closeLocal(o.ledger,a),u=await put({...a,blob:o.blob,next:x.ledger,message:`Close operation lock ${a.lockGeneration}: ${a.operationId} ${a.terminalDisposition}`});
  return stable(u.ok?{...x.receipt,schema:'REPOSITORY_OPERATION_REMOTE_CLOSURE_RECEIPT_v1',result:'TERMINAL_CLOSURE_COMMITTED',authorityVerification,observedLedgerBlobSha:o.blob,observedBranchHead:o.head,committedLedgerBlobSha:u.blob,closureCommitSha:u.commit,contentTransport:o.contentTransport}:{schema:'REPOSITORY_OPERATION_REMOTE_CLOSURE_RECEIPT_v1',result:'LOCK_NOT_CLOSED',errorCode:u.errorCode,httpStatus:u.httpStatus,operationId:a.operationId,lockScope:canonScope(a.lockScope),lockGeneration:Number(a.lockGeneration),contentTransport:o.contentTransport,lockReleased:false});
}

const args=v=>{const a={};for(let i=0;i<v.length;i++){if(!v[i].startsWith('--'))throw err('UNKNOWN_ARGUMENT',v[i],'cli');a[v[i].slice(2)]=v[++i]??null}return a};
const write=(p,v)=>{if(!p)return process.stdout.write(text(v));fs.mkdirSync(path.dirname(path.resolve(p)),{recursive:true});fs.writeFileSync(path.resolve(p),text(v))};
async function main(){const a=args(process.argv.slice(2)),token=process.env.GITHUB_TOKEN;let r;if(a.action==='ensure-ref')r=await ensureRef({repository:a.repository,lockRef:a['lock-ref'],baseHead:a['base-head'],token});else if(a.action==='acquire')r=await acquireRemote({repository:a.repository,lockRef:a['lock-ref'],token,operationId:a['operation-id'],lockScope:a['lock-scope'],governingHead:a['governing-head'],requestDigest:a['request-digest'],procedureLocatorDigest:a['procedure-digest'],preWriteDelayMs:Number(a['pre-write-delay-ms']||0),readyFile:a['ready-file'],barrierFile:a['barrier-file'],barrierTimeoutMs:Number(a['barrier-timeout-ms']||30000)});else if(a.action==='close')r=await closeRemote({repository:a.repository,lockRef:a['lock-ref'],token,operationId:a['operation-id'],lockScope:a['lock-scope'],lockGeneration:Number(a['lock-generation']),terminalDisposition:a['terminal-disposition']});else throw err('MISSING_OR_INVALID_ACTION','action','cli');write(a.output,r);if(r.result==='ACTIVE_SCOPE_ALREADY_LOCKED')process.exitCode=3;if(['LOCK_NOT_ACQUIRED','LOCK_NOT_CLOSED'].includes(r.result))process.exitCode=4}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1]))main().catch(e=>{const f={schema:'REPOSITORY_OPERATION_LOCK_MANAGER_FAILURE_v1',result:'FAIL_CLOSED',errorCode:e.code||'UNEXPECTED_LOCK_MANAGER_ERROR',field:e.field||null,sourceDocument:e.sourceDocument||null,error:e.message,lockAcquired:false,lockReleased:false};try{write(args(process.argv.slice(2)).output,f)}catch{process.stderr.write(text(f))}process.exitCode=1});
