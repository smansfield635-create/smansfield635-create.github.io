#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileSuccessorPacket, COMPILER_RECEIPT_SCHEMA } from './successor-packet-compiler.v1.mjs';

const OLD = '1111111111111111111111111111111111111111';
const NEW = '2222222222222222222222222222222222222222';

function fixture() {
  return {
    schema: 'REPOSITORY_OPERATION_SUCCESSOR_PACKET_COMPILE_REQUEST_v1',
    repository: 'smansfield635-create/smansfield635-create.github.io',
    predecessor: {
      operationId: 'OP_OLD',
      lockScope: 'LAWS:PAGE:RUNTIME:V1',
      lockGeneration: 1168,
      governingHead: OLD,
      operationRequest: {
        schema: 'REPOSITORY_OPERATION_REQUEST_v1',
        operationId: 'OP_OLD',
        projectId: 'LAWS',
        lockScope: 'LAWS:PAGE:RUNTIME:V1',
        exactGoverningHead: OLD,
        subjectIdentity: { authorityInherited: false, requiredStartingHead: OLD, frozenSubjectHead: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        requestingAuthority: { source: 'USER', authorityInherited: false, repositoryWritesAuthorized: false },
        executingRole: { role: 'VERIFIER' },
        independentVerifier: { role: 'FRESH' },
        constructionProcedureLocator: 'INLINE:OLD_PROC',
        requiredInputs: [{ id: 'CURRENT_MAIN' }],
        allowedPaths: ['laws/x/index.html'],
        prohibitedPaths: ['.github/'],
        requiredOutputs: ['RUNTIME_RECEIPT'],
        exactTestCommand: 'PAGE_EXCELLENCE_RUNTIME_FROM_CANONICAL_OPERATION_V1',
        workflowPath: '.github/workflows/bounded-exact-head-execution-carrier-v1.yml',
        artifactPaths: ['/tmp/execution-receipt.json'],
        fingerprintDomain: { governingHead: OLD, subjectHead: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
        errorPrecedence: ['GOVERNING_HEAD_MISMATCH'],
        stopConditions: ['STOP_ON_MAIN_DRIFT'],
        terminalDispositions: ['PASS_CLOSED', 'FAIL_CLOSED', 'SUPERSEDED'],
        evaluationToolingHeadBindingRule: `TOOLCHAIN_${OLD.toUpperCase()};SUBJECT_AAAAAAAA`
      },
      constructionProcedure: {
        schema: 'REPOSITORY_CONSTRUCTION_PROCEDURE_v1',
        procedureId: 'OLD_PROC',
        operationClass: 'READ_ONLY_RUNTIME',
        exactGoverningHead: OLD,
        exactAllowedRepositoryPaths: ['laws/x/index.html'],
        exactBranchAndCommitSequence: [{ step: 1, action: 'RUNTIME' }],
        evaluationToolingHeadBindingRule: `TOOLCHAIN_${OLD.toUpperCase()}`,
        canonicalInputSchemas: ['REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1'],
        canonicalOutputSchemas: ['RUNTIME_RECEIPT'],
        errorCodeAndValidationPrecedence: ['GOVERNING_HEAD_MISMATCH'],
        exactTestRunnerCommand: 'PAGE_EXCELLENCE_RUNTIME_FROM_CANONICAL_OPERATION_V1',
        independentVerifierDefinition: { mayRepair: false },
        workflowAndArtifactPackagingPaths: { workflowPath: '.github/workflows/bounded-exact-head-execution-carrier-v1.yml', artifactPaths: ['/tmp/execution-receipt.json'] },
        bridgeOutputFingerprintDomain: { governingHead: OLD },
        priorAttemptInspectionLimits: { authorityInherited: false }
      }
    },
    successor: {
      operationId: 'OP_NEW',
      procedureId: 'NEW_PROC',
      exactGoverningHead: NEW,
      transitionId: 'TRANSITION_001',
      preservedEvidenceRefs: ['FROZEN_SUBJECT:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'],
      rebinds: [
        { document: 'operationRequest', pointer: '/exactGoverningHead', mode: 'REPLACE_VALUE_IF_EQUALS', from: OLD, to: NEW },
        { document: 'operationRequest', pointer: '/subjectIdentity/requiredStartingHead', mode: 'REPLACE_VALUE_IF_EQUALS', from: OLD, to: NEW },
        { document: 'operationRequest', pointer: '/fingerprintDomain/governingHead', mode: 'REPLACE_VALUE_IF_EQUALS', from: OLD, to: NEW },
        { document: 'operationRequest', pointer: '/evaluationToolingHeadBindingRule', mode: 'REPLACE_SUBSTRING_EXACTLY_ONCE', from: OLD.toUpperCase(), to: NEW.toUpperCase() },
        { document: 'constructionProcedure', pointer: '/exactGoverningHead', mode: 'REPLACE_VALUE_IF_EQUALS', from: OLD, to: NEW },
        { document: 'constructionProcedure', pointer: '/evaluationToolingHeadBindingRule', mode: 'REPLACE_SUBSTRING_EXACTLY_ONCE', from: OLD.toUpperCase(), to: NEW.toUpperCase() },
        { document: 'constructionProcedure', pointer: '/bridgeOutputFingerprintDomain/governingHead', mode: 'REPLACE_VALUE_IF_EQUALS', from: OLD, to: NEW }
      ]
    }
  };
}

function expectThrow(name, mutate, code) {
  const input = fixture();
  mutate(input);
  try {
    compileSuccessorPacket(input);
    throw new Error(`${name}:EXPECTED_THROW`);
  } catch (error) {
    if (error.message === `${name}:EXPECTED_THROW`) throw error;
    if (error.code !== code) throw new Error(`${name}:WRONG_ERROR:${error.code}:${error.message}`);
  }
}

function run() {
  const tests = [];
  const pass = (name, fn) => { fn(); tests.push({ name, result: 'PASS' }); };

  pass('VALID_EXPLICIT_REBIND_COMPILES', () => {
    const out = compileSuccessorPacket(fixture());
    if (out.compilerReceipt.schema !== COMPILER_RECEIPT_SCHEMA || out.compilerReceipt.result !== 'PASS_CLOSED') throw new Error('RECEIPT_NONPASS');
    if (out.operationRequest.operationId !== 'OP_NEW') throw new Error('FRESH_OPERATION_ID_MISSING');
    if (out.constructionProcedure.procedureId !== 'NEW_PROC') throw new Error('FRESH_PROCEDURE_ID_MISSING');
    if (out.operationRequest.exactGoverningHead !== NEW || out.constructionProcedure.exactGoverningHead !== NEW) throw new Error('HEAD_NOT_REBOUND');
    if (out.operationRequest.subjectIdentity.frozenSubjectHead !== 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa') throw new Error('FROZEN_EVIDENCE_MUTATED');
    if (out.transition.inheritedAuthority.length !== 0 || out.compilerReceipt.authorityInherited !== false) throw new Error('AUTHORITY_INHERITED');
    if (out.transition.successor.lockScope !== 'LAWS:PAGE:RUNTIME:V1') throw new Error('SCOPE_CHANGED');
  });

  pass('MISSING_EXPLICIT_REBIND_FAILS', () => expectThrow('missing', (i) => { i.successor.rebinds = i.successor.rebinds.filter((r) => r.pointer !== '/subjectIdentity/requiredStartingHead'); }, 'UNDECLARED_PREDECESSOR_HEAD_BINDING_REMAINS'));
  pass('LOCK_SCOPE_REBIND_FORBIDDEN', () => expectThrow('scope', (i) => { i.successor.rebinds.push({ document: 'operationRequest', pointer: '/lockScope', mode: 'REPLACE_SUBSTRING_EXACTLY_ONCE', from: OLD, to: NEW }); }, 'REBIND_AUTHORITY_OR_SCOPE_FIELD_FORBIDDEN'));
  pass('FRESH_OPERATION_ID_REQUIRED', () => expectThrow('id', (i) => { i.successor.operationId = 'OP_OLD'; }, 'SUCCESSOR_OPERATION_ID_MUST_CHANGE'));
  pass('AUTHORITY_INHERITANCE_REJECTED', () => expectThrow('authority', (i) => { i.predecessor.operationRequest.requestingAuthority.authorityInherited = true; }, 'AUTHORITY_INHERITANCE_FORBIDDEN'));
  pass('ARBITRARY_SUBSTRING_REBIND_REJECTED', () => expectThrow('substring', (i) => { const r = i.successor.rebinds.find((x) => x.mode === 'REPLACE_SUBSTRING_EXACTLY_ONCE'); r.from = 'TOOLCHAIN'; r.to = 'OTHER'; }, 'REBIND_SUBSTRING_MUST_BE_EXACT_GOVERNING_HEAD_REPLACEMENT'));
  pass('FROZEN_SUBJECT_IS_NOT_RELABELLED', () => {
    const out = compileSuccessorPacket(fixture());
    if (out.operationRequest.subjectIdentity.frozenSubjectHead === NEW) throw new Error('EVIDENCE_RELABELLED');
    if (out.compilerReceipt.predecessorEvidenceRelabeledAsSuccessorEvidence !== false) throw new Error('RECEIPT_EVIDENCE_POLICY_WRONG');
  });

  return {
    schema: 'REPOSITORY_OPERATION_SUCCESSOR_PACKET_COMPILER_SELF_TEST_RECEIPT_v1',
    result: 'PASS_CLOSED',
    testCount: tests.length,
    passCount: tests.length,
    failCount: 0,
    tests
  };
}

function args(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--output') out.output = argv[++i];
  }
  return out;
}

function main() {
  const receipt = run();
  const { output } = args(process.argv.slice(2));
  if (output) {
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, `${JSON.stringify(receipt, null, 2)}\n`);
  } else {
    process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
