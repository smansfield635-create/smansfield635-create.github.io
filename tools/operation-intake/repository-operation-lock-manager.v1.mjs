#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const LEDGER_PATH = '.github/operation-intake/active-operation-ledger.v1.json';
export const LOCK_REF = 'refs/heads/operation-locks/repository-operation-intake-v1';
export const LINEAGE_CHECKPOINT_PATH = '.github/operation-intake/lock-lineage-checkpoint.v1.json';
export const AUTHORITY_PROVENANCE_SCHEMA = 'REPOSITORY_OPERATION_AUTHORITY_PROVENANCE_v1';
export const AUTHORITY_INVOCATION_SCHEMA = 'REPOSITORY_OPERATION_AUTHORITY_INVOCATION_v1';
export const LEGACY_AUTHORITY_SNAPSHOT_BLOBS = ['f9c84e0a56b3b566f9da8eced8abc9348eb32ef5'];
export const LEGACY_AUTHORITY_CUTOVER_COMMIT = 'b424015070450aaddc86013d72eaeb2a28bb7b04';
export const TERMINAL = ['PASS_CLOSED','FAIL_CLOSED','REJECTED_CLOSED','WITHDRAWN','SUPERSEDED','VOIDED','EXPIRED','MUTATION_CLOSED_EVIDENCE_CONTINUES'];
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

export const LEGACY_EXACT_ISSUANCE_RECOVERIES = [stable({
  authorityIdentity: {
    operationId: 'AGENTIC_FRONTIER_CINEMATIC_CAROUSEL_COMPASS_LABEL_PARITY_20260826_v1',
    lockScope: 'AGENTIC_FRONTIER_CINEMATIC_SUCCESSOR_COMPASS_CARDINAL_LABEL_PARITY_2119',
    scopeHash: 'a900d21ae76b8e98c445ffe6e7788a53d0ca42721b555bd65903482ef3655970',
    governingHead: 'f34e0b7d172d37a3facff875d05c0c13edfacf07',
    requestDigest: '2b8bf0b00c8e39b764a617c3eee5e9a0019c3287ba0acdf2dc5b4c9c199dbf91',
    procedureLocatorDigest: '7a92a834563ab7bb9d657e496431e5b603c9c379b8ea980855cf4931a17979c2',
    lockGeneration: 1731
  },
  issueNumber: 2119,
  sourceCommentId: 5420728936,
  receiptCommentId: 5420731064,
  workflowRunId: 32931494268
})];

export const EXACT_GEN1915_HISTORICAL_MATERIALIZATION_RECOVERY = stable({
  commitSha:'82d8b69e63783c7357c242f0b42ebb820138fafd',
  parentSha:'cb473e7c1d1b504038034effd6ca16c9960b681d',
  historicalStateCommitSha:'9cf64161dfc647021ff3f3871d6655ac5400ae12',
  historicalStateTreeSha:'ae5593abe89444061c26e964b30f2e6e1575a005',
  message:'Acquire operation lock 1915: CHARACTERS_TASK19_INTEGRATED_SUCCESSOR_REPAIR_20260901_001',
  ledgerBlobSha:'b70e7560809dcb6648c78bd9355fcea26f1a60a8',
  historicalLedgerBlobSha:'553d4e96cf3b1a76c4fb23cb69768b3e34ae2304'
});
export const EXACT_GEN2021_LEDGER_COUNTER_RECOVERY = stable({
  commitSha:'f529d7aaf2184e82a824c419671f7ee029374fb2',
  parentSha:'35bee492cd50690c0829355b518579f85b6fc80a',
  parentLedgerBlobSha:'61968ce53eb32627fc9a48e2d60f6b63b6c8d8b2',
  resultingLedgerBlobSha:'dc811935842200badd40652cca67609d4d428040',
  scopeHash:'1397301660e51f2f55e5076b4ebc1d84cf3e077f9c9956191dc62ba90fe92eb4',
  operationId:'AUDRALIA_TABLET_IMMERSIVE_STARTUP_STABILITY_20260908_001',
  lockScope:'H_EARTH:AUDRALIA:TABLET_IMMERSIVE_STARTUP_STABILITY:V1',
  governingHead:'3d034773e189d5c8f8fa72bb53457518c1e876de',
  requestDigest:'75f434042d7597a98e5f2c23f02b20416521e3d075e6acf17513c4823c793bb2',
  procedureLocatorDigest:'ccebcdd3201ab797aa123dc46f84fbdcc8f8567d745690b6663653721d9021d1',
  lockGeneration:2021,
  parentLedgerGeneration:2020,
  resultingLedgerGeneration:2020
});

export const EXACT_CORRUPTED_LEDGER_SPAN_RECOVERY = stable({
  anchorCommitSha: 'f5d12ff2795aa91d77ae4aa6436946ed4904307d',
  lastCorruptedCommitSha: '38fade1c33e705497f2984072dece377ad480aa0',
  restorationCommitSha: 'eaec93ba84a747e4710f6c65e49c5163e5f68f4f',
  restorationLedgerBlobSha: '94eeaefbe68201d86989119c15a882fb97c3f3aa',
  restorationMessage: 'Restore complete operation ledger after transport truncation'
});

export const EXACT_POST_1894_LEDGER_MATERIALIZATION_RECOVERIES = [
  stable({corruptCommitSha:'c074a0e0bc1ded191319b5761c924afaf5a6fd7d',corruptLedgerBlobSha:'28f9f1f98ff9856a39f2ab33ab6e3bc9dc82712e',restorationCommitSha:'9f4360feadcf60c908ebb5968091a650f7d87b52',restorationLedgerBlobSha:'29d2900f9504c3e3378e8ae2418aeb6a95273006',restorationMessage:'Repair lock 1908 ledger transport truncation'}),
  stable({corruptCommitSha:'ab35fb81b15b9a27bbc5e5af00cad8aadbabcd8a',corruptLedgerBlobSha:'1f9ce3ba858d1712e5413cf68b3913bdc0141572',restorationCommitSha:'10865af816362992612b2fbd249aa7eff402c563',restorationLedgerBlobSha:'2de9310ebf4b194ed0e80497a4a8db6b1ad86e23',restorationMessage:'Repair lock 1910 ledger transport truncation'}),
  stable({corruptCommitSha:'648458b3452c1e45ab679721752da097f0789036',corruptLedgerBlobSha:'8b88b0c9aa099f2424bbe4e54857802e40dd6782',restorationCommitSha:'55ae6d0613353836ab4494dc2e3f012d4148619f',restorationLedgerBlobSha:'449f58b33670a8f1ac4383d0b7d7b947611ff591',restorationMessage:'Repair terminal closure ledger materialization for generation 1920'}),
  stable({corruptCommitSha:'f0fe17741354b03824d1f185796edc00c32d1459',corruptLedgerBlobSha:'2b6526c081872af9dd676fb9a77747e43802820c',restorationCommitSha:'fe8b97d079f0a42d5f21b71571c7d8c8343259c8',restorationLedgerBlobSha:'20e7bee551fcf4f39070153cd781914d27f3d661',restorationMessage:'Repair operation lock 1924 ledger materialization'})
];

export const EXACT_LEDGER_RESTORATION_RECOVERY = stable({
  commitSha: 'eaec93ba84a747e4710f6c65e49c5163e5f68f4f',
  parentSha: '38fade1c33e705497f2984072dece377ad480aa0',
  authorLogin: 'smansfield635-create',
  committerLogin: 'smansfield635-create',
  message: 'Restore complete operation ledger after transport truncation',
  ledgerBlobSha: '94eeaefbe68201d86989119c15a882fb97c3f3aa',
  changedPath: LEDGER_PATH
});

export const EXACT_LOCK_REF_LINEAGE_RECOVERIES = [
  stable({
    commitSha: 'e24fd158777c8df4000d6ae6c36f1ab1073c3222',
    parentSha: 'e26e26ad24c106c51fc4135d58f0aa43cfd5f4f7',
    authorLogin: 'smansfield635-create',
    committerLogin: 'smansfield635-create',
    message: 'Acquire operation lock 1767: AUDRALIA_WORK_EXECUTOR_PORTABLE_BOOTSTRAP_20260827_001',
    ledgerBlobSha: '35cd3351cee5884e707c5f5c3d5074c7d46af868'
  }),
  stable({
    commitSha: '385658998e2582e935decbc490db8c3eae4f065d',
    parentSha: 'e24fd158777c8df4000d6ae6c36f1ab1073c3222',
    authorLogin: 'smansfield635-create',
    committerLogin: 'smansfield635-create',
    message: 'Supersede operation 1767 with successor 1768: AUDRALIA_WORK_EXECUTOR_PORTABLE_BOOTSTRAP_20260827_001_SUCCESSOR_001',
    ledgerBlobSha: '14be590a6c78969d1931306c331928f16e7b44dc'
  }),
  stable({
    commitSha: '6d0dc06efbb9ac5fdbcfe81894842b6e45e1144a',
    parentSha: '9539b9d69642c20fec816ec22fe18015363504a9',
    authorLogin: 'smansfield635-create',
    committerLogin: 'smansfield635-create',
    message: 'Acquire operation lock 1886: RESEARCH_FRONTIER_ACHIEVEMENT_AMPLIFICATION_20260830_002',
    ledgerBlobSha: 'cfa916837ed0ada14b8d1c7915d7a1fcd3777c3f'
  }),
  stable({
    commitSha: '784da5fe9a3580419c7989b0b6b65cf8c92086de',
    parentSha: '6d0dc06efbb9ac5fdbcfe81894842b6e45e1144a',
    authorLogin: 'smansfield635-create',
    committerLogin: 'smansfield635-create',
    message: 'Close operation lock 1886: RESEARCH_FRONTIER_ACHIEVEMENT_AMPLIFICATION_20260830_002 MUTATION_CLOSED_EVIDENCE_CONTINUES',
    ledgerBlobSha: '7e146606047bd7c1de2d8d67d9e3e7d444920fa8'
  }),
  stable({
    commitSha: '2b9b409103da54777f096be45778806886c1d469',
    parentSha: '270c27436bf4b4272aadddb34f8e5fcd731556a0',
    authorLogin: 'smansfield635-create',
    committerLogin: 'smansfield635-create',
    message: 'Acquire operation lock 1889: RESEARCH_FRONTIER_ACHIEVEMENT_AMPLIFICATION_PUBLICATION_VERIFICATION_20260831_003',
    ledgerBlobSha: '5ab1242526ebb432da3c3d271a778e74571101fd'
  }),
  stable({
    commitSha: 'f44775289199ba002ce445369704954a85147bee',
    parentSha: '2b9b409103da54777f096be45778806886c1d469',
    authorLogin: 'smansfield635-create',
    committerLogin: 'smansfield635-create',
    message: 'Close operation lock 1889: RESEARCH_FRONTIER_ACHIEVEMENT_AMPLIFICATION_PUBLICATION_VERIFICATION_20260831_003 MUTATION_CLOSED_EVIDENCE_CONTINUES',
    ledgerBlobSha: 'a305e7bc9f52aa8660d292a029fde0c4cfbaca90'
  }),
  stable({
    commitSha: '4a04654243a288698847825a98fde62456d006c0',
    parentSha: 'f44775289199ba002ce445369704954a85147bee',
    authorLogin: 'smansfield635-create',
    committerLogin: 'smansfield635-create',
    message: 'Acquire operation lock 1890: RESEARCH_FRONTIER_FOUR_CARD_RUNTIME_PUBLICATION_VERIFICATION_20260831_004',
    ledgerBlobSha: '0c86e1c7532f2c92049666721b7c6be51927f852'
  }),
  stable({
    commitSha: '6be527a0aea26ba75e14e6d13b8e22021fa414fd',
    parentSha: 'bf476d15430e8fcb91c4e169b71e4ef53934846b',
    authorLogin: 'smansfield635-create',
    committerLogin: 'smansfield635-create',
    message: 'Close operation lock 1890: RESEARCH_FRONTIER_FOUR_CARD_RUNTIME_PUBLICATION_VERIFICATION_20260831_004 MUTATION_CLOSED_EVIDENCE_CONTINUES',
    ledgerBlobSha: 'b84180ccd008e5dca2c096781dedc98b9f1f0446'
  })
];

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
async function req(u,o,ok=[200],stage='UNSPECIFIED_GITHUB_REQUEST'){const z=await fetch(u,o),q=await z.text();let b;try{b=q?JSON.parse(q):null}catch{b={raw:q}}if(!ok.includes(z.status)){const e=new Error(`GITHUB_API_ERROR:${z.status}:${stage}`);e.status=z.status;e.body=b;e.githubStage=stage;throw e}return b}

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
async function readGitLedgerBlob({repository,token,blobSha,source='resulting-ledger',commitSha=null}){const sha=dig(blobSha,40,'ledgerBlobSha',source);if(process.env.REPOSITORY_OPERATION_LOCAL_GIT_BLOB_READ==='1'){const tempDir=fs.mkdtempSync(path.join(process.env.RUNNER_TEMP||'/tmp','ledger-blob-')),tempPath=path.join(tempDir,'ledger.json'),fd=fs.openSync(tempPath,'w');try{execFileSync('git',['cat-file','blob',sha],{stdio:['ignore',fd,'inherit']});const raw=fs.readFileSync(tempPath,'utf8');if(raw.startsWith('Warning: truncated output')){const type=execFileSync('git',['cat-file','-t',sha],{encoding:'utf8',maxBuffer:1024}).trim(),size=execFileSync('git',['cat-file','-s',sha],{encoding:'utf8',maxBuffer:1024}).trim(),prefix=raw.slice(0,96).replace(/[\r\n]+/g,' ');throw err('LOCAL_GIT_BLOB_OUTPUT_DECORATED','content',source+'-git-object',`commitSha=${commitSha||'UNKNOWN'}:blobSha=${sha}:blobType=${type}:blobSize=${size}:blobPrefix=${JSON.stringify(prefix)}`)}return ledger(JSON.parse(raw))}catch(e){if(e.code)throw e;throw err('LEDGER_JSON_DECODE_FAILURE','content',source+'-git-object',e.message)}finally{fs.closeSync(fd);fs.rmSync(tempDir,{recursive:true,force:true})}}const g=await req(`${base(repository)}/git/blobs/${sha}`,{headers:H(token)},[200],'LEDGER_BLOB_READ');if(g.encoding!=='base64')throw err('LEDGER_BLOB_ENCODING_UNSUPPORTED','encoding',source,String(g.encoding));return decodeContent(g.content,source)}
async function readLegacyAuthoritySnapshot(a){return readGitLedgerBlob({...a,source:'authority-legacy-snapshot'})}
function identityMatches(a,b){return canonical(authorityIdentity(a))===canonical(authorityIdentity(b))}

async function verifyLegacyAuthority({repository,token,lock}){
  for(const blobSha of LEGACY_AUTHORITY_SNAPSHOT_BLOBS){
    const frozen=await readLegacyAuthoritySnapshot({repository,token,blobSha}),anchored=frozen.activeScopes?.[lock.scopeHash];
    if(anchored&&identityMatches(anchored,lock))return stable({result:'LEGACY_AUTHORITY_SNAPSHOT_ANCHORED',snapshotBlobSha:blobSha,authorityIdentity:authorityIdentity(lock)});
  }
  const recovery=LEGACY_EXACT_ISSUANCE_RECOVERIES.find(value=>canonical(value.authorityIdentity)===canonical(authorityIdentity(lock)));
  if(!recovery)throw err('AUTHORITY_PROVENANCE_MISSING','authorityProvenance','authority-provenance','NOT_IN_FROZEN_LEGACY_SNAPSHOT');
  const source=await fetchComment(repository,token,recovery.sourceCommentId);
  if(source?.id!==recovery.sourceCommentId||source?.issue_url?.split('/').pop()!==String(recovery.issueNumber)||!TRUSTED_ASSOCIATIONS.has(source?.author_association)||markerFromBody(source?.body)!==CANONICAL_MARKER)throw err('AUTHORITY_EVENT_NOT_AUTHENTICATED','comment','authority-provenance','RECOVERED_SOURCE_COMMENT_MISMATCH');
  verifyCanonicalSourceComment(lock,source.body);
  const receipt=await fetchComment(repository,token,recovery.receiptCommentId);
  if(receipt?.id!==recovery.receiptCommentId||receipt?.issue_url?.split('/').pop()!==String(recovery.issueNumber)||receipt?.user?.login!=='github-actions[bot]'||!botReceiptMatches(lock,[receipt],'CANONICAL_INTAKE',recovery.workflowRunId))throw err('AUTHORITY_WORKFLOW_RECEIPT_NOT_FOUND','issue.comments','authority-provenance','RECOVERED_BOT_RECEIPT_MISMATCH');
  return stable({result:'AUTHENTICATED_CANONICAL_AUTHORITY',origin:'RECOVERED_LEGACY_CANONICAL_INTAKE',authorityIdentity:authorityIdentity(lock),issueNumber:recovery.issueNumber,commentId:recovery.sourceCommentId,receiptCommentId:recovery.receiptCommentId,workflowRunId:recovery.workflowRunId});
}

function canonicalMutationMessage(message){return typeof message==='string'&&(/^Acquire operation lock \d+: .+/.test(message)||/^Supersede operation \d+ with successor \d+: .+/.test(message)||/^Close operation lock \d+: .+ (PASS_CLOSED|FAIL_CLOSED|REJECTED_CLOSED|WITHDRAWN|SUPERSEDED|VOIDED|EXPIRED|MUTATION_CLOSED_EVIDENCE_CONTINUES)$/.test(message))}
async function verifyExactLockRefLineageRecovery({repository,token,summary,recovery}){
  if(summary?.sha!==recovery.commitSha)return false;
  const detail=await req(`${base(repository)}/commits/${recovery.commitSha}`,{headers:H(token)});
  const files=Array.isArray(detail?.files)?detail.files:[],parents=Array.isArray(detail?.parents)?detail.parents:[];
  if(detail?.sha!==recovery.commitSha||detail?.author?.login!==recovery.authorLogin||detail?.committer?.login!==recovery.committerLogin||detail?.commit?.message!==recovery.message||detail?.commit?.verification?.verified!==false||parents.length!==1||parents[0]?.sha!==recovery.parentSha||files.length!==1||files[0]?.filename!==LEDGER_PATH||files[0]?.sha!==recovery.ledgerBlobSha)throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','compare.commits','authority-lineage',recovery.commitSha);
  return true;
}async function verifyExactLedgerRestorationRecovery({repository,token,summary}) {
  const recovery=EXACT_LEDGER_RESTORATION_RECOVERY;
  if(summary?.sha!==recovery.commitSha)return false;
  const detail=await req(`${base(repository)}/commits/${recovery.commitSha}`,{headers:H(token)},[200],'AUTHORITY_LEDGER_RESTORATION_DETAIL');
  const files=Array.isArray(detail?.files)?detail.files:[],parents=Array.isArray(detail?.parents)?detail.parents:[];
  if(parents.length!==1||parents[0]?.sha!==recovery.parentSha||detail?.author?.login!==recovery.authorLogin||detail?.committer?.login!==recovery.committerLogin||detail?.commit?.message!==recovery.message||files.length!==1||files[0]?.filename!==recovery.changedPath||files[0]?.sha!==recovery.ledgerBlobSha)throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','restoration-recovery','authority-lineage','EXACT_RESTORATION_IDENTITY_MISMATCH');
  await readGitLedgerBlob({repository,token,blobSha:recovery.ledgerBlobSha,source:'exact-ledger-restoration-recovery'});
  return true;
}

async function verifyExactPost1894MaterializationRecovery({repository,token,summary}){
  const r=EXACT_POST_1894_LEDGER_MATERIALIZATION_RECOVERIES.find(value=>value.corruptCommitSha===summary?.sha||value.restorationCommitSha===summary?.sha);if(!r)return false;
  const corrupt=await req(`${base(repository)}/commits/${r.corruptCommitSha}`,{headers:H(token)},[200],'AUTHORITY_POST1894_CORRUPT_DETAIL'),cf=Array.isArray(corrupt?.files)?corrupt.files:[];
  if(cf.length!==1||cf[0]?.filename!==LEDGER_PATH||cf[0]?.sha!==r.corruptLedgerBlobSha)throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','post1894-materialization','authority-lineage','CORRUPT_IDENTITY_MISMATCH');
  const restoration=await req(`${base(repository)}/commits/${r.restorationCommitSha}`,{headers:H(token)},[200],'AUTHORITY_POST1894_RESTORATION_DETAIL'),rf=Array.isArray(restoration?.files)?restoration.files:[],parents=Array.isArray(restoration?.parents)?restoration.parents:[];
  if(parents.length!==1||parents[0]?.sha!==r.corruptCommitSha||restoration?.author?.login!=='smansfield635-create'||restoration?.committer?.login!=='smansfield635-create'||restoration?.commit?.message!==r.restorationMessage||rf.length!==1||rf[0]?.filename!==LEDGER_PATH||rf[0]?.sha!==r.restorationLedgerBlobSha)throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','post1894-materialization','authority-lineage','RESTORATION_IDENTITY_MISMATCH');
  await readGitLedgerBlob({repository,token,blobSha:r.restorationLedgerBlobSha,source:'exact-post1894-restoration',commitSha:r.restorationCommitSha});return true;
}

async function verifyExactGen1915LedgerRecovery({repository,token,summary}) {
  const r=EXACT_GEN1915_HISTORICAL_MATERIALIZATION_RECOVERY;if(summary?.sha!==r.commitSha)return false;
  if(process.env.REPOSITORY_OPERATION_LOCAL_GIT_LINEAGE!=='1')return false;
  const parent=execFileSync('git',['rev-parse',r.commitSha+'^'],{encoding:'utf8'}).trim();
  if(parent!==r.parentSha)throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','gen1915.parent','authority-lineage',parent);
  const historicalTree=execFileSync('git',['rev-parse',r.historicalStateCommitSha+'^{tree}'],{encoding:'utf8'}).trim();
  if(historicalTree!==r.historicalStateTreeSha)throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','gen1915.historical-tree','authority-lineage',historicalTree);
  const materializedTree=execFileSync('git',['rev-parse',r.commitSha+'^{tree}'],{encoding:'utf8'}).trim();
  const historicalLedger=execFileSync('git',['rev-parse',r.historicalStateCommitSha+':'+LEDGER_PATH],{encoding:'utf8'}).trim();
  if(historicalLedger!==r.historicalLedgerBlobSha)throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','gen1915.historical-ledger','authority-lineage',historicalLedger);
  let nonLedger=0;
  try { execFileSync('git',['diff','--quiet',r.historicalStateCommitSha,r.commitSha,'--','.',':(exclude)'+LEDGER_PATH],{stdio:'ignore'}); }
  catch (e) { nonLedger=Number.isInteger(e?.status)?e.status:-1; }
  if(nonLedger===1)throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','gen1915.materialization','authority-lineage',`tree=${materializedTree}:nonLedgerStatus=1`);
  if(nonLedger!==0)throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','gen1915.materialization-execution','authority-lineage',`tree=${materializedTree}:nonLedgerStatus=${nonLedger}`);
  const blob=execFileSync('git',['rev-parse',r.commitSha+':'+LEDGER_PATH],{encoding:'utf8'}).trim();
  const msg=execFileSync('git',['show','-s','--format=%B',r.commitSha],{encoding:'utf8'}).trimEnd();
  if(blob!==r.ledgerBlobSha||blob===historicalLedger||msg!==r.message)throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','gen1915.identity','authority-lineage',`blob=${blob}`);
  await readGitLedgerBlob({repository,token,blobSha:r.ledgerBlobSha,source:'exact-gen1915-historical-materialization-recovery'});
  return true;
}
export function verifyExactGen2021HistoricalState({commitSha,parentSha,parentLedgerBlobSha,resultingLedgerBlobSha,parentLedger,resultingLedger}) {
  const r=EXACT_GEN2021_LEDGER_COUNTER_RECOVERY;
  const fail=detail=>{throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','gen2021-ledger-counter','authority-lineage',detail)};
  if(commitSha!==r.commitSha)fail('COMMIT_SHA_MISMATCH');
  if(parentSha!==r.parentSha)fail('PARENT_SHA_MISMATCH');
  if(parentLedgerBlobSha!==r.parentLedgerBlobSha)fail('PARENT_LEDGER_BLOB_MISMATCH');
  if(resultingLedgerBlobSha!==r.resultingLedgerBlobSha)fail('RESULTING_LEDGER_BLOB_MISMATCH');
  if(!parentLedger||parentLedger.lockGeneration!==r.parentLedgerGeneration)fail('PARENT_LEDGER_GENERATION_MISMATCH');
  if(parentLedger.activeScopes?.[r.scopeHash]!==undefined)fail('PARENT_ROW_UNEXPECTEDLY_PRESENT');
  if(!resultingLedger||resultingLedger.lockGeneration!==r.resultingLedgerGeneration)fail('RESULTING_LEDGER_GENERATION_MISMATCH');
  const row=resultingLedger.activeScopes?.[r.scopeHash];
  if(!row)fail('RESULTING_ROW_MISSING');
  if(row.scopeHash!==r.scopeHash)fail('SCOPE_HASH_MISMATCH');
  if(row.operationId!==r.operationId)fail('OPERATION_ID_MISMATCH');
  if(row.lockScope!==r.lockScope)fail('LOCK_SCOPE_MISMATCH');
  if(row.lockGeneration!==r.lockGeneration)fail('ROW_GENERATION_MISMATCH');
  if(row.governingHead!==r.governingHead)fail('GOVERNING_HEAD_MISMATCH');
  if(row.requestDigest!==r.requestDigest)fail('REQUEST_DIGEST_MISMATCH');
  if(row.procedureLocatorDigest!==r.procedureLocatorDigest)fail('PROCEDURE_LOCATOR_DIGEST_MISMATCH');
  if(row.independentAuthorityProvenance?.compareAndSwap?.observedLockRefHead!==r.parentSha)fail('CAS_PARENT_COMMIT_MISMATCH');
  if(row.independentAuthorityProvenance?.compareAndSwap?.observedLedgerBlobSha!==r.parentLedgerBlobSha)fail('CAS_PARENT_BLOB_MISMATCH');
  if(row.independentAuthorityProvenance?.authorityIdentity?.scopeHash!==r.scopeHash||row.independentAuthorityProvenance?.authorityIdentity?.operationId!==r.operationId||row.independentAuthorityProvenance?.authorityIdentity?.lockGeneration!==r.lockGeneration)fail('PROVENANCE_AUTHORITY_IDENTITY_MISMATCH');
  return stable({result:'EXACT_GEN2021_LEDGER_COUNTER_RECOVERED',commitSha:r.commitSha,parentSha:r.parentSha,parentLedgerBlobSha:r.parentLedgerBlobSha,resultingLedgerBlobSha:r.resultingLedgerBlobSha,scopeHash:r.scopeHash,operationId:r.operationId,lockGeneration:r.lockGeneration});
}

function historicalLedgerDiagnostic({source,objectSha,transport,encoding,rawBytes,decodedBytes}) {
  const bounded=bytes=>bytes.subarray(0,64).toString('hex');
  return stable({source,objectSha,transport,encoding,rawByteLength:rawBytes.length,rawSha256:createHash('sha256').update(rawBytes).digest('hex'),rawFirst64Hex:bounded(rawBytes),decodedByteLength:decodedBytes.length,decodedSha256:createHash('sha256').update(decodedBytes).digest('hex'),decodedFirst64Hex:bounded(decodedBytes)});
}
async function readRawHistoricalLedger({repository,token,blobSha,source}) {
  const objectSha=dig(blobSha,40,'ledgerBlobSha',source);
  if(process.env.REPOSITORY_OPERATION_LOCAL_GIT_BLOB_READ==='1'){
    const rawBytes=execFileSync('git',['cat-file','blob',objectSha],{maxBuffer:64*1024*1024});
    const diagnostic=historicalLedgerDiagnostic({source,objectSha,transport:'LOCAL_GIT_CAT_FILE',encoding:'raw',rawBytes,decodedBytes:rawBytes});
    try{return JSON.parse(rawBytes.toString('utf8'))}
    catch(e){throw err('LEDGER_JSON_DECODE_FAILURE','content',source,JSON.stringify({...diagnostic,parseError:e.message}))}
  }
  const g=await req(`${base(repository)}/git/blobs/${objectSha}`,{headers:H(token)},[200],'GEN2021_HISTORICAL_LEDGER_BLOB_READ');
  const rawBytes=Buffer.from(String(g.content||''),'utf8');
  if(g.encoding!=='base64')throw err('LEDGER_BLOB_ENCODING_UNSUPPORTED','encoding',source,JSON.stringify(historicalLedgerDiagnostic({source,objectSha,transport:'GITHUB_GIT_BLOB_API',encoding:String(g.encoding),rawBytes,decodedBytes:Buffer.alloc(0)})));
  const decodedBytes=Buffer.from(String(g.content||'').replace(/\s/g,''),'base64');
  const diagnostic=historicalLedgerDiagnostic({source,objectSha,transport:'GITHUB_GIT_BLOB_API',encoding:g.encoding,rawBytes,decodedBytes});
  try{return JSON.parse(decodedBytes.toString('utf8'))}
  catch(e){throw err('LEDGER_JSON_DECODE_FAILURE','content',source,JSON.stringify({...diagnostic,parseError:e.message}))}
}

async function verifyExactGen2021LedgerCounterRecovery({repository,token,summary}) {
  const r=EXACT_GEN2021_LEDGER_COUNTER_RECOVERY;
  if(summary?.sha!==r.commitSha)return false;
  let parentSha,resultingBlob;
  if(process.env.REPOSITORY_OPERATION_LOCAL_GIT_LINEAGE==='1'){
    parentSha=execFileSync('git',['rev-parse',r.commitSha+'^'],{encoding:'utf8'}).trim();
    resultingBlob=execFileSync('git',['rev-parse',r.commitSha+':'+LEDGER_PATH],{encoding:'utf8'}).trim();
    const message=execFileSync('git',['show','-s','--format=%B',r.commitSha],{encoding:'utf8'}).trimEnd();
    if(message!==`Acquire operation lock 2021: ${r.operationId}`)throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','gen2021-ledger-counter','authority-lineage','MESSAGE_MISMATCH');
  }else{
    const detail=await req(`${base(repository)}/commits/${r.commitSha}`,{headers:H(token)},[200],'AUTHORITY_GEN2021_COUNTER_DETAIL');
    const files=Array.isArray(detail?.files)?detail.files:[],parents=Array.isArray(detail?.parents)?detail.parents:[];
    if(detail?.sha!==r.commitSha||detail?.author?.login!=='smansfield635-create'||detail?.committer?.login!=='smansfield635-create'||detail?.commit?.message!==`Acquire operation lock 2021: ${r.operationId}`||parents.length!==1||files.length!==1||files[0]?.filename!==LEDGER_PATH)throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','gen2021-ledger-counter','authority-lineage','COMMIT_IDENTITY_MISMATCH');
    parentSha=parents[0]?.sha; resultingBlob=files[0]?.sha;
  }
  const parentLedger=await readRawHistoricalLedger({repository,token,blobSha:r.parentLedgerBlobSha,source:'exact-gen2021-parent-ledger'});
  const resultingLedger=await readRawHistoricalLedger({repository,token,blobSha:r.resultingLedgerBlobSha,source:'exact-gen2021-resulting-ledger'});
  verifyExactGen2021HistoricalState({commitSha:r.commitSha,parentSha,parentLedgerBlobSha:r.parentLedgerBlobSha,resultingLedgerBlobSha:resultingBlob,parentLedger,resultingLedger});
  return true;
}

async function verifyExactCorruptedLedgerSpanRecovery({repository,token,anchor,seen,checkpointVerification}) {
  const r=EXACT_CORRUPTED_LEDGER_SPAN_RECOVERY;
  if(!checkpointVerification||anchor!==r.anchorCommitSha)return null;
  const restorationIndex=seen.findIndex(value=>value?.sha===r.restorationCommitSha);
  if(restorationIndex<0)return null;
  const span=seen.slice(0,restorationIndex+1);
  if(span.at(-2)?.sha!==r.lastCorruptedCommitSha)throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','corruption-span','authority-lineage','RESTORATION_PARENT_POSITION_MISMATCH');
  for(const summary of span){const detail=await req(`${base(repository)}/commits/${summary.sha}`,{headers:H(token)},[200],'AUTHORITY_CORRUPTION_SPAN_DETAIL'),files=Array.isArray(detail?.files)?detail.files:[];if(files.length!==1||files[0]?.filename!==LEDGER_PATH)throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','corruption-span','authority-lineage',`NON_LEDGER_MUTATION:${summary.sha}`)}
  const restoration=await req(`${base(repository)}/commits/${r.restorationCommitSha}`,{headers:H(token)},[200],'AUTHORITY_CORRUPTION_RESTORATION_DETAIL'),files=Array.isArray(restoration?.files)?restoration.files:[],parents=Array.isArray(restoration?.parents)?restoration.parents:[];
  if(parents.length!==1||parents[0]?.sha!==r.lastCorruptedCommitSha||restoration?.author?.login!=='smansfield635-create'||restoration?.committer?.login!=='smansfield635-create'||restoration?.commit?.message!==r.restorationMessage||files.length!==1||files[0]?.filename!==LEDGER_PATH||files[0]?.sha!==r.restorationLedgerBlobSha)throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','corruption-span','authority-lineage','RESTORATION_IDENTITY_MISMATCH');
  await readGitLedgerBlob({repository,token,blobSha:r.restorationLedgerBlobSha,source:'exact-corruption-span-restoration'});
  return stable({result:'EXACT_CORRUPTED_LEDGER_SPAN_RECOVERED',anchorCommitSha:anchor,restorationCommitSha:r.restorationCommitSha,recoveredCommitCount:span.length,nextIndex:restorationIndex+1});
}

export async function verifyCanonicalLockRefLineage({repository,token,branchHead,anchorCommitSha=LEGACY_AUTHORITY_CUTOVER_COMMIT,lineageCheckpoint=null}) {
  const head=dig(branchHead,40,'branchHead','authority-lineage');
  let anchor=dig(anchorCommitSha,40,'anchorCommitSha','authority-lineage'),checkpointVerification=null;
  if(lineageCheckpoint){
    const {verifyLineageCheckpoint}=await import('./repository-operation-lock-lineage.v2.mjs');
    checkpointVerification=verifyLineageCheckpoint(lineageCheckpoint);
    anchor=dig(checkpointVerification.checkpointCommitSha,40,'checkpointCommitSha','authority-lineage');
  }
  if(head===anchor)return stable({result:'CANONICAL_LOCK_REF_LINEAGE_VERIFIED',anchorCommitSha:anchor,branchHead:head,commitCount:0});
  const u=base(repository);let page=1,total=null,seen=[];
  if(process.env.REPOSITORY_OPERATION_LOCAL_GIT_LINEAGE==='1'){
    try{execFileSync('git',['merge-base','--is-ancestor',anchor,head],{stdio:'ignore'});}catch{throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','local-git.ancestry','authority-lineage',`${anchor}..${head}`)}
    const shas=execFileSync('git',['rev-list','--reverse',`${anchor}..${head}`],{encoding:'utf8',maxBuffer:16*1024*1024}).trim().split(/\s+/).filter(Boolean);
    total=shas.length;
    for(const commitSha of shas){
      const message=execFileSync('git',['show','-s','--format=%B',commitSha],{encoding:'utf8',maxBuffer:1024*1024}).trimEnd();
      const parent=execFileSync('git',['rev-parse',`${commitSha}^`],{encoding:'utf8',maxBuffer:1024}).trim();
      let ledgerChanged=false,nonLedgerChanged=false;
      try{execFileSync('git',['diff','--quiet',parent,commitSha,'--',LEDGER_PATH],{stdio:'ignore'});}catch(error){if(error?.status===1)ledgerChanged=true;else throw error;}
      try{execFileSync('git',['diff','--quiet',parent,commitSha,'--',`.:(exclude)${LEDGER_PATH}`],{stdio:'ignore'});}catch(error){if(error?.status===1)nonLedgerChanged=true;else throw error;}
      if(!ledgerChanged||nonLedgerChanged)throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','local-git.paths','authority-lineage',commitSha);
      const author=execFileSync('git',['show','-s','--format=%an <%ae>',commitSha],{encoding:'utf8'}).trim();
      seen.push({sha:commitSha,commit:{message,verification:{verified:false}},author:{login:author.includes('github-actions[bot]')?'github-actions[bot]':author.includes('smansfield635-create')?'smansfield635-create':null},committer:{login:author.includes('smansfield635-create')?'smansfield635-create':null},localGit:true});
    }
  }else while(page<=64){const c=await req(`${u}/compare/${anchor}...${head}?per_page=100&page=${page}`,{headers:H(token)},[200],'AUTHORITY_LINEAGE_COMPARE');if(!['ahead','identical'].includes(c?.status))throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','compare.status','authority-lineage',String(c?.status));if(page===1){total=Number(c?.total_commits);if(!Number.isInteger(total)||total<0)throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','compare.total_commits','authority-lineage');const files=Array.isArray(c?.files)?c.files:[];if(files.some(f=>f?.filename!==LEDGER_PATH))throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','compare.files','authority-lineage','NON_LEDGER_PATH_MUTATION')}const commits=Array.isArray(c?.commits)?c.commits:[];seen.push(...commits);if(seen.length>=total||commits.length<100)break;page++}
  if(seen.length!==total)throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','compare.commits','authority-lineage',`expected=${total}:observed=${seen.length}`);
  const spanRecovery=await verifyExactCorruptedLedgerSpanRecovery({repository,token,anchor,seen,checkpointVerification});
  const verificationSet=spanRecovery?seen.slice(spanRecovery.nextIndex):seen;
  for(const c of verificationSet){
    if(await verifyExactGen2021LedgerCounterRecovery({repository,token,summary:c}))continue;
    if(await verifyExactGen1915LedgerRecovery({repository,token,summary:c}))continue;
    if(await verifyExactLedgerRestorationRecovery({repository,token,summary:c}))continue;
    if(await verifyExactPost1894MaterializationRecovery({repository,token,summary:c}))continue;
    if(c?.localGit&&c?.author?.login==='github-actions[bot]'&&canonicalMutationMessage(c?.commit?.message))continue;
    if(c?.author?.login==='github-actions[bot]'&&c?.commit?.verification?.verified===true&&canonicalMutationMessage(c?.commit?.message))continue;
    const recovery=EXACT_LOCK_REF_LINEAGE_RECOVERIES.find(value=>value.commitSha===c?.sha);
    if(recovery&&await verifyExactLockRefLineageRecovery({repository,token,summary:c,recovery}))continue;
    if(c?.author?.login==='smansfield635-create'&&c?.committer?.login==='smansfield635-create'){
      const detail=await req(`${u}/commits/${c.sha}`,{headers:H(token)},[200],'AUTHORITY_OWNER_COMMIT_DETAIL'),files=Array.isArray(detail?.files)?detail.files:[];
      if(files.length!==1||files[0]?.filename!==LEDGER_PATH||!/^[0-9a-f]{40}$/.test(files[0]?.sha||''))throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','compare.commits','authority-lineage',String(c?.sha||'UNKNOWN_COMMIT'));
      const resultingLedger=await readGitLedgerBlob({repository,token,blobSha:files[0].sha,source:'checkpoint-exclusive-resulting-ledger',commitSha:c.sha});
      try{
        const {verifyCanonicalLedgerCommitV2}=await import('./repository-operation-lock-lineage.v2.mjs');
        verifyCanonicalLedgerCommitV2({commit:detail,changedPaths:files.map(file=>file.filename),resultingLedger,checkpointVerification});
        continue;
      }catch(error){
        throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','compare.commits','authority-lineage',`${c.sha}:${error?.code||error?.message||'OWNER_CERTIFICATION_FAILED'}`);
      }
    }
    throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','compare.commits','authority-lineage',String(c?.sha||'UNKNOWN_COMMIT'));
  }
  return stable({result:'CANONICAL_LOCK_REF_LINEAGE_VERIFIED',anchorCommitSha:anchor,branchHead:head,commitCount:seen.length,checkpointVerification,spanRecovery});
}

async function fetchComment(repository,token,commentId){return req(`${base(repository)}/issues/comments/${commentId}`,{headers:H(token)},[200],'AUTHORITY_SOURCE_COMMENT')}
async function fetchIssueComments(repository,token,issueNumber){const all=[];for(let page=1;;page++){const values=await req(`${base(repository)}/issues/${issueNumber}/comments?per_page=100&page=${page}`,{headers:H(token)},[200],'AUTHORITY_ISSUE_COMMENTS');if(!Array.isArray(values))throw err('AUTHORITY_EVENT_NOT_AUTHENTICATED','issue.comments','authority-provenance');all.push(...values);if(values.length<100)break}return all}
function verifyCanonicalSourceComment(lock,body){const envelope=parseMarkedJson(body,CANONICAL_MARKER),request=envelope?.operationRequest,procedure=envelope?.constructionProcedure;if(!request||!procedure)throw err('AUTHORITY_EVENT_NOT_AUTHENTICATED','canonical-envelope','authority-provenance');const expected=authorityIdentity(lock);if(request.operationId!==expected.operationId||canonScope(request.lockScope)!==expected.lockScope||request.exactGoverningHead!==expected.governingHead)throw err('AUTHORITY_EVENT_NOT_AUTHENTICATED','operationRequest','authority-provenance','ROW_IDENTITY_MISMATCH');if(sha(canonical(request))!==expected.requestDigest||sha(canonical(procedure))!==expected.procedureLocatorDigest)throw err('AUTHORITY_EVENT_NOT_AUTHENTICATED','operationRequest','authority-provenance','REQUEST_OR_PROCEDURE_DIGEST_MISMATCH')}
function parseSuccessorReceiptComment(body){if(typeof body!=='string'||!body.startsWith('REMOTE_OPERATION_SUCCESSOR_RECEIPT_V1'))return null;const match=body.match(/```json\s*([\s\S]*?)\s*```/);if(!match)return null;try{return JSON.parse(match[1])}catch{return null}}
function botReceiptMatches(lock,comments,origin,runId){if(origin==='CANONICAL_INTAKE'){const op=`operationId = ${lock.operationId}`,gen=`lockGeneration = ${lock.lockGeneration}`,run=`workflowRun = ${runId}`;return comments.some(c=>c?.user?.login==='github-actions[bot]'&&typeof c.body==='string'&&c.body.includes('CANONICAL_OPERATION_INTAKE_RETURN_V1')&&c.body.includes('canonicalResult = ADMITTED_AND_LOCKED')&&c.body.includes(op)&&c.body.includes(gen)&&c.body.includes(run))}return comments.some(c=>{if(c?.user?.login!=='github-actions[bot]')return false;const r=parseSuccessorReceiptComment(c.body);if(!r||r.result!=='SUCCESSOR_ADMITTED_PREDECESSOR_SUPERSEDED')return false;const s=r.successor||{};return s.operationId===lock.operationId&&canonScope(s.lockScope)===canonScope(lock.lockScope)&&s.lockGeneration===lock.lockGeneration&&s.governingHead===lock.governingHead&&s.requestDigest===lock.requestDigest&&s.procedureLocatorDigest===lock.procedureLocatorDigest})}

export async function verifyRemoteAuthorityProvenance({repository,token,lock,branchHead,lineageCheckpoint=null}) {
  validateActiveLock(lock,lock.scopeHash);
  const anchor=lineageCheckpoint?.status==='ACTIVE_VERIFIED' ? lineageCheckpoint.checkpoint?.checkpointCommitSha : (lock.authorityProvenance?.lineageAnchorCommitSha||LEGACY_AUTHORITY_CUTOVER_COMMIT),lineage=await verifyCanonicalLockRefLineage({repository,token,branchHead,anchorCommitSha:anchor,...(lineageCheckpoint?{lineageCheckpoint}:{})});
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

async function readCanonicalLineageCheckpoint({repository,token}) {
  const checkpointFile=await req(`${base(repository)}/contents/${LINEAGE_CHECKPOINT_PATH}?ref=main`,{headers:H(token)},[200],'AUTHORITY_LINEAGE_CHECKPOINT_READ');
  if(typeof checkpointFile?.content!=='string')throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','lineageCheckpoint.content','authority-lineage','CANONICAL_CHECKPOINT_CONTENT_MISSING');
  try { return JSON.parse(Buffer.from(checkpointFile.content,'base64').toString('utf8')); } catch(e) { throw err('AUTHORITY_LEDGER_LINEAGE_UNTRUSTED','lineageCheckpoint','authority-lineage',e.message); }
}

export async function closeRemote(a) {
  const o=await readRemote(a),h=scopeHash(a.lockScope),active=o.ledger.activeScopes[h];if(!active)throw err('ACTIVE_LOCK_NOT_FOUND','lockScope','ledger');
  const checkpointProvider=a.lineageCheckpointProvider||readCanonicalLineageCheckpoint;
  const lineageCheckpoint=await checkpointProvider({repository:a.repository,token:a.token});
  const x=closeLocal(o.ledger,a),verifier=a.authorityVerifier||verifyRemoteAuthorityProvenance,authorityVerification=await verifier({repository:a.repository,token:a.token,lock:active,branchHead:o.head,lineageCheckpoint}),u=await put({...a,blob:o.blob,next:x.ledger,message:`Close operation lock ${a.lockGeneration}: ${a.operationId} ${a.terminalDisposition}`});
  return stable(u.ok?{...x.receipt,schema:'REPOSITORY_OPERATION_REMOTE_CLOSURE_RECEIPT_v1',result:'TERMINAL_CLOSURE_COMMITTED',authorityVerification,observedLedgerBlobSha:o.blob,observedBranchHead:o.head,committedLedgerBlobSha:u.blob,closureCommitSha:u.commit,contentTransport:o.contentTransport}:{schema:'REPOSITORY_OPERATION_REMOTE_CLOSURE_RECEIPT_v1',result:'LOCK_NOT_CLOSED',errorCode:u.errorCode,httpStatus:u.httpStatus,operationId:a.operationId,lockScope:canonScope(a.lockScope),lockGeneration:Number(a.lockGeneration),contentTransport:o.contentTransport,lockReleased:false});
}

const args=v=>{const a={};for(let i=0;i<v.length;i++){if(!v[i].startsWith('--'))throw err('UNKNOWN_ARGUMENT',v[i],'cli');a[v[i].slice(2)]=v[++i]??null}return a};
const write=(p,v)=>{if(!p)return process.stdout.write(text(v));fs.mkdirSync(path.dirname(path.resolve(p)),{recursive:true});fs.writeFileSync(path.resolve(p),text(v))};
async function main(){const a=args(process.argv.slice(2)),token=process.env.GITHUB_TOKEN;let r;if(a.action==='ensure-ref')r=await ensureRef({repository:a.repository,lockRef:a['lock-ref'],baseHead:a['base-head'],token});else if(a.action==='acquire')r=await acquireRemote({repository:a.repository,lockRef:a['lock-ref'],token,operationId:a['operation-id'],lockScope:a['lock-scope'],governingHead:a['governing-head'],requestDigest:a['request-digest'],procedureLocatorDigest:a['procedure-digest'],preWriteDelayMs:Number(a['pre-write-delay-ms']||0),readyFile:a['ready-file'],barrierFile:a['barrier-file'],barrierTimeoutMs:Number(a['barrier-timeout-ms']||30000)});else if(a.action==='close')r=await closeRemote({repository:a.repository,lockRef:a['lock-ref'],token,operationId:a['operation-id'],lockScope:a['lock-scope'],lockGeneration:Number(a['lock-generation']),terminalDisposition:a['terminal-disposition']});else throw err('MISSING_OR_INVALID_ACTION','action','cli');write(a.output,r);if(r.result==='ACTIVE_SCOPE_ALREADY_LOCKED')process.exitCode=3;if(['LOCK_NOT_ACQUIRED','LOCK_NOT_CLOSED'].includes(r.result))process.exitCode=4}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1]))main().catch(e=>{const f={schema:'REPOSITORY_OPERATION_LOCK_MANAGER_FAILURE_v1',result:'FAIL_CLOSED',errorCode:e.code||'UNEXPECTED_LOCK_MANAGER_ERROR',field:e.field||null,sourceDocument:e.sourceDocument||null,error:e.message,lockAcquired:false,lockReleased:false};try{write(args(process.argv.slice(2)).output,f)}catch{process.stderr.write(text(f))}process.exitCode=1});
