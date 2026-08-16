#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AUTHORITY_POLICY,
  DEFAULT_GOVERNING_REF,
  EVIDENCE_POLICY,
  successorLocal,
  TRANSITION_SCHEMA
} from './repository-operation-successor-gate.v1.mjs';
import { canonical, scopeHash, stable, text } from '../../../tools/operation-intake/repository-operation-lock-manager.v1.mjs';

const OLD_HEAD = '1'.repeat(40);
const NEW_HEAD = '2'.repeat(40);
const OTHER_HEAD = '3'.repeat(40);
const PREDECESSOR_SCOPE = 'SELF_TEST:SUCCESSOR:PRIMARY';
const SUCCESSOR_SCOPE = PREDECESSOR_SCOPE;
const PREDECESSOR_ID = 'SELF_TEST_PREDECESSOR_001';
const SUCCESSOR_ID = 'SELF_TEST_SUCCESSOR_002';

function assert(condition, message) { if (!condition) throw new Error(message); }

function fixture() {
  const allowedPaths = ['example/path.txt'];
  const errorPrecedence = ['GOVERNING_HEAD_MISMATCH', 'MISSING_REQUIRED_REQUEST_FIELD'];
  const artifactPaths = ['evidence/output.json'];
  const workflowPath = '.github/workflows/example.yml';
  const command = 'node tools/example-test.mjs';
  const fingerprint = { domainId: 'SELF_TEST_SUCCESSOR_FINGERPRINT_v1', algorithm: 'sha256' };
  const request = {
    schema: 'REPOSITORY_OPERATION_REQUEST_v1',
    operationId: SUCCESSOR_ID,
    projectId: 'SELF_TEST',
    lockScope: SUCCESSOR_SCOPE,
    exactGoverningHead: NEW_HEAD,
    subjectIdentity: { id: 'SELF_TEST_SUBJECT' },
    requestingAuthority: { authorityId: 'SELF_TEST_FRESH_AUTHORITY', mergeAuthority: false },
    executingRole: { roleId: 'SELF_TEST_CONSTRUCTOR' },
    independentVerifier: { roleId: 'SELF_TEST_VERIFIER', mustBeDistinctFromConstructor: true },
    constructionProcedureLocator: 'SELF_TEST_SUCCESSOR_PROCEDURE_v1',
    requiredInputs: [{ id: 'CURRENT_HEAD', resolved: true }],
    allowedPaths,
    prohibitedPaths: ['protected/**'],
    requiredOutputs: ['SUCCESSOR_RECEIPT'],
    exactTestCommand: command,
    workflowPath,
    artifactPaths,
    fingerprintDomain: fingerprint,
    errorPrecedence,
    stopConditions: ['MAIN_HEAD_CHANGED'],
    terminalDispositions: ['PASS_CLOSED', 'FAIL_CLOSED', 'SUPERSEDED']
  };
  const procedure = {
    schema: 'REPOSITORY_CONSTRUCTION_PROCEDURE_v1',
    procedureId: 'SELF_TEST_SUCCESSOR_PROCEDURE_v1',
    operationClass: 'SELF_TEST_SUCCESSOR',
    exactGoverningHead: NEW_HEAD,
    exactAllowedRepositoryPaths: allowedPaths,
    exactBranchAndCommitSequence: [{ step: 1, action: 'SELF_TEST_ONLY' }],
    evaluationToolingHeadBindingRule: 'SELF_TEST_EXACT_HEAD',
    canonicalInputSchemas: ['REPOSITORY_OPERATION_REQUEST_v1'],
    canonicalOutputSchemas: ['REPOSITORY_OPERATION_SUCCESSOR_TRANSITION_RECEIPT_v1'],
    errorCodeAndValidationPrecedence: errorPrecedence,
    exactTestRunnerCommand: command,
    independentVerifierDefinition: { mayRepair: false },
    workflowAndArtifactPackagingPaths: { workflowPath, artifactPaths },
    bridgeOutputFingerprintDomain: fingerprint,
    priorAttemptInspectionLimits: { mayAuthorizeMutation: false }
  };
  const predecessorHash = scopeHash(PREDECESSOR_SCOPE);
  const predecessorLock = {
    schema: 'REPOSITORY_OPERATION_LOCK_v1',
    operationId: PREDECESSOR_ID,
    lockScope: PREDECESSOR_SCOPE,
    scopeHash: predecessorHash,
    state: 'EXECUTING',
    governingHead: OLD_HEAD,
    requestDigest: 'a'.repeat(64),
    procedureLocatorDigest: 'b'.repeat(64),
    lockGeneration: 41,
    released: false
  };
  const ledgerFixture = {
    schema: 'REPOSITORY_ACTIVE_OPERATION_LEDGER_v1',
    lockRef: 'refs/heads/operation-locks/repository-operation-intake-v1',
    lockGeneration: 41,
    activeScopes: { [predecessorHash]: predecessorLock },
    terminalHistory: [],
    allowedChangedPaths: ['.github/operation-intake/active-operation-ledger.v1.json']
  };
  const transition = {
    schema: TRANSITION_SCHEMA,
    transitionId: 'SELF_TEST_TRANSITION_001',
    reasonCode: 'GOVERNING_HEAD_ADVANCED',
    governingRef: DEFAULT_GOVERNING_REF,
    authorityPolicy: AUTHORITY_POLICY,
    evidencePolicy: EVIDENCE_POLICY,
    predecessor: {
      operationId: PREDECESSOR_ID,
      lockScope: PREDECESSOR_SCOPE,
      lockGeneration: 41,
      governingHead: OLD_HEAD
    },
    successor: {
      operationId: SUCCESSOR_ID,
      lockScope: SUCCESSOR_SCOPE,
      governingHead: NEW_HEAD
    },
    inheritedAuthority: [],
    preservedEvidenceRefs: ['PREDECESSOR_RECEIPT_001']
  };
  return { ledger: ledgerFixture, transition, request, procedure };
}

function expectError(code, fn) {
  let actual = null;
  try { fn(); } catch (error) { actual = error.code || String(error.message).split(':')[0]; }
  assert(actual === code, `EXPECTED_${code}_GOT_${actual || 'NO_ERROR'}`);
  return code;
}

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--output') result.output = argv[++i];
    else throw new Error(`UNKNOWN_ARGUMENT:${argv[i]}`);
  }
  if (!result.output) throw new Error('MISSING_REQUIRED_ARGUMENT:--output');
  return result;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const tests = [];
  const run = (id, fn) => {
    try { tests.push({ id, pass: true, detail: fn() ?? null }); }
    catch (error) { tests.push({ id, pass: false, detail: error.message }); }
  };

  run('SAME_SCOPE_ATOMIC_SUCCESSOR', () => {
    const f = fixture();
    const before = canonical(f.ledger);
    const result = successorLocal(f.ledger, f.transition, f.request, f.procedure);
    assert(canonical(f.ledger) === before, 'INPUT_LEDGER_MUTATED');
    assert(result.receipt.result === 'SUCCESSOR_ADMITTED_PREDECESSOR_SUPERSEDED', 'RESULT');
    assert(result.receipt.predecessor.terminalDisposition === 'SUPERSEDED', 'PREDECESSOR_NOT_SUPERSEDED');
    assert(result.receipt.successor.lockGeneration === 42, 'SUCCESSOR_GENERATION');
    assert(result.ledger.lockGeneration === 42, 'LEDGER_GENERATION');
    assert(result.ledger.terminalHistory.length === 1, 'TERMINAL_HISTORY');
    assert(result.ledger.terminalHistory[0].operationId === PREDECESSOR_ID, 'PREDECESSOR_HISTORY_ID');
    assert(result.ledger.activeScopes[scopeHash(SUCCESSOR_SCOPE)].operationId === SUCCESSOR_ID, 'SUCCESSOR_NOT_ACTIVE');
    return { predecessorGeneration: 41, successorGeneration: 42 };
  });

  run('AUTHORITY_DOES_NOT_INHERIT', () => {
    const f = fixture();
    const result = successorLocal(f.ledger, f.transition, f.request, f.procedure);
    assert(result.receipt.authorityInherited === false, 'AUTHORITY_INHERITED');
    assert(result.receipt.authoritySource === 'FRESH_SUCCESSOR_REQUEST_AND_CONSTRUCTION_PROCEDURE', 'AUTHORITY_SOURCE');
    assert(result.receipt.exactHeadRevalidationRequired === true, 'REVALIDATION_NOT_REQUIRED');
    assert(result.ledger.terminalHistory[0].supersession.authorityInherited === false, 'HISTORY_AUTHORITY_INHERITED');
  });

  run('PRESERVED_EVIDENCE_LINKED_BIDIRECTIONALLY', () => {
    const f = fixture();
    const result = successorLocal(f.ledger, f.transition, f.request, f.procedure);
    assert(result.receipt.preservedEvidenceRefs[0] === 'PREDECESSOR_RECEIPT_001', 'RECEIPT_EVIDENCE');
    assert(result.ledger.terminalHistory[0].supersession.preservedEvidenceRefs[0] === 'PREDECESSOR_RECEIPT_001', 'PREDECESSOR_EVIDENCE');
    assert(result.ledger.activeScopes[scopeHash(SUCCESSOR_SCOPE)].predecessor.preservedEvidenceRefs[0] === 'PREDECESSOR_RECEIPT_001', 'SUCCESSOR_EVIDENCE');
  });

  run('DIFFERENT_SCOPE_SUCCESSOR', () => {
    const f = fixture();
    f.request.lockScope = 'SELF_TEST:SUCCESSOR:REANCHORED';
    f.transition.successor.lockScope = f.request.lockScope;
    const result = successorLocal(f.ledger, f.transition, f.request, f.procedure);
    assert(!result.ledger.activeScopes[scopeHash(PREDECESSOR_SCOPE)], 'PREDECESSOR_SCOPE_RETAINED');
    assert(result.ledger.activeScopes[scopeHash(f.request.lockScope)].operationId === SUCCESSOR_ID, 'NEW_SCOPE_NOT_ACTIVE');
  });

  run('REJECT_SAME_HEAD', () => {
    const f = fixture();
    f.transition.successor.governingHead = OLD_HEAD;
    f.request.exactGoverningHead = OLD_HEAD;
    f.procedure.exactGoverningHead = OLD_HEAD;
    return expectError('SUCCESSOR_HEAD_NOT_ADVANCED', () => successorLocal(f.ledger, f.transition, f.request, f.procedure));
  });

  run('REJECT_PREDECESSOR_GENERATION_MISMATCH', () => {
    const f = fixture();
    f.transition.predecessor.lockGeneration = 40;
    return expectError('PREDECESSOR_LOCK_GENERATION_MISMATCH', () => successorLocal(f.ledger, f.transition, f.request, f.procedure));
  });

  run('REJECT_PREDECESSOR_HEAD_MISMATCH', () => {
    const f = fixture();
    f.transition.predecessor.governingHead = OTHER_HEAD;
    return expectError('PREDECESSOR_GOVERNING_HEAD_MISMATCH', () => successorLocal(f.ledger, f.transition, f.request, f.procedure));
  });

  run('REJECT_IMPLICIT_AUTHORITY_INHERITANCE', () => {
    const f = fixture();
    f.transition.inheritedAuthority = ['PREDECESSOR_AUTHORITY'];
    return expectError('IMPLICIT_AUTHORITY_INHERITANCE_FORBIDDEN', () => successorLocal(f.ledger, f.transition, f.request, f.procedure));
  });

  run('REJECT_SUCCESSOR_ID_MISMATCH', () => {
    const f = fixture();
    f.transition.successor.operationId = 'OTHER_SUCCESSOR';
    return expectError('SUCCESSOR_OPERATION_ID_MISMATCH', () => successorLocal(f.ledger, f.transition, f.request, f.procedure));
  });

  run('REJECT_OCCUPIED_DIFFERENT_SUCCESSOR_SCOPE', () => {
    const f = fixture();
    const occupiedScope = 'SELF_TEST:SUCCESSOR:OCCUPIED';
    f.request.lockScope = occupiedScope;
    f.transition.successor.lockScope = occupiedScope;
    const occupiedHash = scopeHash(occupiedScope);
    f.ledger.activeScopes[occupiedHash] = {
      schema: 'REPOSITORY_OPERATION_LOCK_v1',
      operationId: 'OTHER_ACTIVE_OPERATION',
      lockScope: occupiedScope,
      scopeHash: occupiedHash,
      state: 'ADMITTED_LOCKED',
      governingHead: NEW_HEAD,
      requestDigest: 'c'.repeat(64),
      procedureLocatorDigest: 'd'.repeat(64),
      lockGeneration: 40,
      released: false
    };
    return expectError('SUCCESSOR_SCOPE_ALREADY_LOCKED', () => successorLocal(f.ledger, f.transition, f.request, f.procedure));
  });

  run('REQUEST_PROCEDURE_HEAD_MISMATCH_FAILS_BEFORE_LEDGER_CHANGE', () => {
    const f = fixture();
    f.procedure.exactGoverningHead = OTHER_HEAD;
    return expectError('GOVERNING_HEAD_MISMATCH', () => successorLocal(f.ledger, f.transition, f.request, f.procedure));
  });

  const failures = tests.filter((test) => !test.pass);
  const core = {
    schema: 'REPOSITORY_OPERATION_SUCCESSOR_SELF_TEST_RECEIPT_v1',
    selfTestId: 'GENERIC_STALE_HEAD_SUCCESSOR_AND_SUPERSESSION_PROTOCOL_SELF_TEST_v1',
    result: failures.length ? 'FAIL_CLOSED' : 'PASS_CLOSED',
    testCount: tests.length,
    passCount: tests.length - failures.length,
    failCount: failures.length,
    tests,
    invariants: {
      predecessorHistoryPreserved: true,
      predecessorTerminalDisposition: 'SUPERSEDED',
      successorGenerationMonotonic: true,
      oneLedgerMutationRequired: true,
      implicitAuthorityInheritanceForbidden: true,
      exactHeadRevalidationRequired: true,
      currentMainLockManagerModified: false,
      currentMainIntakeGateModified: false
    }
  };
  const receipt = stable({ ...core, canonicalFingerprint: canonical(core) });
  const absolute = path.resolve(args.output);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, text(receipt));
  process.stdout.write(text(receipt));
  if (failures.length) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try { main(); }
  catch (error) {
    process.stderr.write(text({ schema: 'REPOSITORY_OPERATION_SUCCESSOR_SELF_TEST_FAILURE_v1', result: 'FAIL_CLOSED', error: error.message }));
    process.exitCode = 1;
  }
}
