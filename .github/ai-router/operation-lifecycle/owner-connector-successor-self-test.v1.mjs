#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { canonical, sha, stable } from '../../../tools/operation-intake/repository-operation-lock-manager.v1.mjs';
import {
  MARKER,
  OWNER_LOGIN,
  PROVENANCE_SCHEMA,
  TRANSPORT_ID,
  buildIndependentSuccessorProvenance,
  validateOwnerSuccessorSource
} from './owner-connector-canonical-successor.v1.mjs';

let passed = 0;
function pass() { passed += 1; }
function expectCode(fn, code) {
  let caught = null;
  try { fn(); } catch (e) { caught = e; }
  assert.ok(caught, `expected ${code}`);
  assert.equal(caught.code, code);
  pass();
}

const envelope = {
  schema: 'REMOTE_OPERATION_SUCCESSOR_INVOCATION_REQUEST_v1',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  transition: { schema: 'REPOSITORY_OPERATION_SUCCESSOR_TRANSITION_REQUEST_v1' },
  operationRequest: { schema: 'REPOSITORY_OPERATION_REQUEST_v1' },
  constructionProcedure: { schema: 'REPOSITORY_CONSTRUCTION_PROCEDURE_v1' }
};
const body = `${MARKER}\n${JSON.stringify(envelope)}`;
const source = {
  id: 42,
  issueNumber: 7,
  body,
  user: { login: OWNER_LOGIN },
  author_association: 'OWNER'
};
const parsed = validateOwnerSuccessorSource(source);
assert.equal(parsed.login, OWNER_LOGIN);
assert.equal(parsed.association, 'OWNER');
assert.equal(parsed.envelope.schema, envelope.schema);
pass();
expectCode(() => validateOwnerSuccessorSource({ ...source, user: { login: 'someone-else' } }), 'SOURCE_COMMENT_NOT_OWNER');
expectCode(() => validateOwnerSuccessorSource({ ...source, author_association: 'COLLABORATOR' }), 'SOURCE_COMMENT_NOT_OWNER');
expectCode(() => validateOwnerSuccessorSource({ ...source, body: `WRONG_MARKER\n${JSON.stringify(envelope)}` }), 'SOURCE_MARKER_MISMATCH');
expectCode(() => validateOwnerSuccessorSource({ ...source, body: `${MARKER}\n{` }), 'SOURCE_ENVELOPE_INVALID');
expectCode(() => validateOwnerSuccessorSource({ ...source, body: `${MARKER}\n${JSON.stringify({ ...envelope, schema: 'WRONG' })}` }), 'SOURCE_ENVELOPE_SCHEMA_MISMATCH');
expectCode(() => validateOwnerSuccessorSource({ ...source, body: `${MARKER}\n${JSON.stringify({ ...envelope, repository: 'other/repo' })}` }), 'SOURCE_REPOSITORY_MISMATCH');

const successorLock = {
  schema: 'REPOSITORY_OPERATION_LOCK_v1',
  operationId: 'SUCCESSOR_OP',
  lockScope: 'TEST:SCOPE',
  scopeHash: sha('TEST:SCOPE'),
  state: 'ADMITTED_LOCKED',
  governingHead: 'b'.repeat(40),
  requestDigest: 'c'.repeat(64),
  procedureLocatorDigest: 'd'.repeat(64),
  lockGeneration: 12,
  released: false
};
const transition = {
  transitionId: 'T1',
  predecessor: {
    operationId: 'PREDECESSOR_OP',
    lockScope: 'TEST:SCOPE',
    lockGeneration: 11,
    governingHead: 'a'.repeat(40)
  }
};
const provenance = buildIndependentSuccessorProvenance({
  source: parsed,
  successorLock,
  transition,
  observedLedgerBlobSha: 'e'.repeat(40),
  observedLockRefHead: 'f'.repeat(40)
});
assert.equal(provenance.schema, PROVENANCE_SCHEMA);
assert.equal(provenance.transportId, TRANSPORT_ID);
assert.equal(provenance.source.marker, MARKER);
assert.equal(provenance.transitionIdentity.predecessor.lockGeneration, 11);
assert.equal(provenance.transitionIdentity.successor.lockGeneration, 12);
const core = stable({
  schema: provenance.schema,
  transportId: provenance.transportId,
  source: provenance.source,
  transitionIdentity: provenance.transitionIdentity,
  authorityIdentity: provenance.authorityIdentity,
  compareAndSwap: provenance.compareAndSwap
});
assert.equal(provenance.bindingDigest, sha(canonical(core)));
pass();
expectCode(() => buildIndependentSuccessorProvenance({ source: parsed, successorLock, transition, observedLedgerBlobSha: 'bad', observedLockRefHead: 'f'.repeat(40) }), 'INVALID_DIGEST');
expectCode(() => buildIndependentSuccessorProvenance({ source: parsed, successorLock, transition, observedLedgerBlobSha: 'e'.repeat(40), observedLockRefHead: 'bad' }), 'INVALID_DIGEST');

const plannerSource = fs.readFileSync(new URL('./owner-connector-canonical-successor.v1.mjs', import.meta.url), 'utf8');
assert.match(plannerSource, /successorLocal\(baseLedger, transition, request, procedure\)/);
assert.doesNotMatch(plannerSource, /putLedgerRemote|githubRequest|method:\s*['"]PUT['"]/);
assert.match(plannerSource, /finalReceiptRequiresCommitRereadAndLineageVerification:\s*true/);
pass();
const lineageSource = fs.readFileSync(new URL('../../../tools/operation-intake/repository-operation-lock-lineage.v2.mjs', import.meta.url), 'utf8');
assert.match(lineageSource, /Supersede operation/);
pass();

console.log(JSON.stringify({
  schema: 'OWNER_CONNECTOR_SUCCESSOR_SELF_TEST_RECEIPT_v1',
  result: 'PASS_CLOSED',
  passed,
  ownerSourceAuthentication: true,
  exactCasBinding: true,
  canonicalSuccessorLocalDelegation: true,
  plannerPerformsRepositoryWrite: false,
  planIsReceipt: false,
  authorityInherited: false
}, null, 2));
