import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(DIRECTORY, '../../..');
const ARTIFACT_RECEIPT_PATH = path.join(
  REPOSITORY_ROOT,
  'artifacts/h-earth-step-2-transition-decision-audit-receipt.json'
);
const COMMITTED_RECEIPT_PATH = path.join(
  DIRECTORY,
  'h-earth.step-2.transition-decision.audit-receipt.json'
);
const DETERMINISTIC_EVALUATION_TIME = '2026-07-24T03:20:00Z';

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(DIRECTORY, fileName), 'utf8'));
}

function canonicalize(value) {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(',')}]`;
  }
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function digestObject(value, excludedTopLevelKey = null) {
  const clone = structuredClone(value);
  if (excludedTopLevelKey !== null) delete clone[excludedTopLevelKey];
  return sha256(Buffer.from(canonicalize(clone)));
}

function gitBlobSha(bytes) {
  return crypto
    .createHash('sha1')
    .update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes]))
    .digest('hex');
}

function repositoryFilePath(repositoryPath) {
  return path.join(REPOSITORY_ROOT, repositoryPath.slice(1));
}

function readRepositoryBytes(repositoryPath) {
  return fs.readFileSync(repositoryFilePath(repositoryPath));
}

function pointerParts(pointer) {
  return pointer
    .slice(1)
    .split('/')
    .map((part) => part.replaceAll('~1', '/').replaceAll('~0', '~'));
}

function setPointer(target, pointer, value) {
  const parts = pointerParts(pointer);
  let cursor = target;
  for (let index = 0; index < parts.length - 1; index += 1) {
    if (!(parts[index] in cursor)) throw new Error(`MISSING_POINTER:${pointer}`);
    cursor = cursor[parts[index]];
  }
  cursor[parts.at(-1)] = structuredClone(value);
}

function replaceExactlyOnce(text, from, to) {
  const count = text.split(from).length - 1;
  if (count !== 1) throw new Error(`REPLACEMENT_COUNT:${count}:${from}`);
  return text.replace(from, to);
}

function applyAuthorizedOperation(operation, context) {
  const beforeBytes = readRepositoryBytes(operation.path);
  const beforeGitBlobSha = gitBlobSha(beforeBytes);

  if (
    operation.beforeGitBlobSha &&
    beforeGitBlobSha !== operation.beforeGitBlobSha
  ) {
    throw new Error(
      `BEFORE_BLOB:${operation.operationId}:${beforeGitBlobSha}`
    );
  }

  let afterBytes;

  if (operation.operationType === 'REPLACE_WITH_EXISTING_REPOSITORY_BLOB') {
    afterBytes = readRepositoryBytes(operation.sourcePath);
    if (gitBlobSha(afterBytes) !== operation.sourceGitBlobSha) {
      throw new Error(`SOURCE_BLOB:${operation.operationId}`);
    }
  } else if (
    operation.operationType === 'DETERMINISTIC_JSON_POINTER_PATCH'
  ) {
    const output = JSON.parse(beforeBytes.toString('utf8'));
    const deferredDigestPatches = [];

    for (const patch of operation.patches) {
      if (patch.derive === 'RECOMPUTED_DECISION_DIGEST_AFTER_PATCHES') {
        deferredDigestPatches.push(patch);
        continue;
      }

      let value;
      if (Object.hasOwn(patch, 'value')) {
        value = patch.value;
      } else if (patch.derive === 'SUCCESSOR_SOURCE_BYTE_COUNT') {
        value = context.successorBytes.length;
      } else if (patch.derive === 'SUCCESSOR_SOURCE_SHA256') {
        value = context.successorSha256;
      } else {
        throw new Error(`DERIVE:${patch.derive}`);
      }
      setPointer(output, patch.pointer, value);
    }

    for (const patch of deferredDigestPatches) {
      setPointer(output, patch.pointer, digestObject(output, 'decisionDigest'));
    }

    afterBytes = Buffer.from(`${JSON.stringify(output, null, 2)}\n`);
  } else if (
    operation.operationType === 'EXACT_TEXT_REPLACEMENT_SEQUENCE'
  ) {
    let output = beforeBytes.toString('utf8');
    for (const replacement of operation.replacements) {
      let replacementText;
      if (Object.hasOwn(replacement, 'to')) {
        replacementText = replacement.to;
      } else if (
        replacement.toDerived === 'SUCCESSOR_SOURCE_BYTE_COUNT_LINE'
      ) {
        replacementText = `  candidateByteCount: ${context.successorBytes.length},`;
      } else if (
        replacement.toDerived === 'SUCCESSOR_SOURCE_SHA256_LITERAL_LINE'
      ) {
        replacementText = `    '${context.successorSha256}',`;
      } else {
        throw new Error(`DERIVE_TEXT:${replacement.toDerived}`);
      }
      output = replaceExactlyOnce(output, replacement.from, replacementText);
    }
    afterBytes = Buffer.from(output);
  } else {
    throw new Error(`TYPE:${operation.operationType}`);
  }

  return {
    operationId: operation.operationId,
    path: operation.path,
    operationType: operation.operationType,
    beforeGitBlobSha,
    afterGitBlobSha: gitBlobSha(afterBytes),
    afterByteCount: afterBytes.length,
    afterContentSha256: sha256(afterBytes)
  };
}

function validateDecision(decision, references) {
  const failureCodes = [];
  const fail = (code, condition) => {
    if (!condition && !failureCodes.includes(code)) failureCodes.push(code);
  };

  fail('MALFORMED_DECISION', decision && typeof decision === 'object');
  if (!decision || typeof decision !== 'object') return failureCodes;

  fail(
    'MALFORMED_DECISION',
    typeof decision.decisionId === 'string' && decision.decisionId.length > 0
  );
  fail(
    'MISSING_ACTOR_BINDING',
    ['approver', 'decisionIssuer', 'authorizedExecutor', 'auditor'].every(
      (key) =>
        typeof decision.actorBindings?.[key]?.actorId === 'string' &&
        decision.actorBindings[key].actorId.length > 0
    )
  );
  fail(
    'WRONG_PARENT_BINDING',
    decision.parentBinding?.baseCommit === references.baseCommit &&
      decision.parentBinding?.policyId === references.parentPolicyId &&
      decision.parentBinding?.noUnrelatedInterveningChanges === true
  );
  fail(
    'WRONG_SUCCESSOR',
    decision.successorBinding?.successorId === references.successorId &&
      decision.successorBinding?.sourceGitBlobSha ===
        references.successorGitBlobSha &&
      decision.successorBinding?.instanceContentDigest ===
        references.successorContentDigest
  );
  fail(
    'WRONG_CHANGESET_DIGEST',
    decision.changesetBinding?.authorizedChangesetDigest ===
        references.authorizedChangesetDigest &&
      canonicalize(decision.changesetBinding?.authorizedPaths ?? []) ===
        canonicalize(references.authorizedPaths)
  );

  const issuedAt = Date.parse(decision.issuedAt);
  const expiresAt = Date.parse(decision.expiresAt);
  const evaluatedAt = Date.parse(DETERMINISTIC_EVALUATION_TIME);
  fail(
    'EXPIRED_DECISION',
    Number.isFinite(issuedAt) &&
      Number.isFinite(expiresAt) &&
      issuedAt <= evaluatedAt &&
      expiresAt > evaluatedAt &&
      expiresAt > issuedAt
  );
  fail('REVOKED_DECISION', decision.revocation?.revoked === false);
  fail(
    'ALREADY_CONSUMED_DECISION',
    decision.replayProtection?.consumed === false &&
      decision.replayProtection?.maximumUseCount === 1 &&
      decision.replayProtection?.remainingUseCount === 1
  );
  fail(
    'MALFORMED_DECISION',
    typeof decision.replayProtection?.decisionNonce === 'string' &&
      decision.replayProtection.decisionNonce.length >= 16 &&
      decision.status === 'APPROVED_UNCONSUMED'
  );

  return failureCodes;
}

function changedPathsFromBase(baseCommit) {
  const output = execFileSync(
    'git',
    ['diff', '--name-only', `${baseCommit}...HEAD`, '--'],
    { cwd: REPOSITORY_ROOT, encoding: 'utf8' }
  );
  return output
    .split(/\r?\n/)
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => `/${value}`)
    .sort((left, right) => left.localeCompare(right));
}

const currentState = readJson('h-earth.step-2.current-state.manifest.json');
const successorTarget = readJson('h-earth.step-2.successor-target.manifest.json');
const changeset = readJson('h-earth.step-2.authorized-changeset.manifest.json');
const decision = readJson('h-earth.step-2.transition-decision.json');
const fixtureSuite = readJson(
  'h-earth.step-2.transition-decision.fixtures.json'
);

const checks = [];
const failures = [];
function check(name, condition, details = null) {
  const pass = Boolean(condition);
  checks.push({ name, pass, details });
  if (!pass) failures.push(name);
}

check(
  'CURRENT_STATE_MANIFEST_DIGEST',
  digestObject(currentState, 'manifestDigest') === currentState.manifestDigest
);
check(
  'SUCCESSOR_TARGET_MANIFEST_DIGEST',
  digestObject(successorTarget, 'manifestDigest') === successorTarget.manifestDigest
);
check(
  'CHANGESET_MANIFEST_DIGEST',
  digestObject(changeset, 'authorizedChangesetDigest') ===
    changeset.authorizedChangesetDigest
);
check(
  'DECISION_DIGEST',
  digestObject(decision, 'decisionDigest') === decision.decisionDigest
);
check(
  'FIXTURE_SUITE_DIGEST',
  digestObject(fixtureSuite, 'suiteDigest') === fixtureSuite.suiteDigest
);

let baseCommitExists = false;
let headDescendsFromBase = false;
try {
  execFileSync(
    'git',
    ['cat-file', '-e', `${currentState.expectedBaseCommit}^{commit}`],
    { cwd: REPOSITORY_ROOT, stdio: 'ignore' }
  );
  baseCommitExists = true;
  execFileSync(
    'git',
    ['merge-base', '--is-ancestor', currentState.expectedBaseCommit, 'HEAD'],
    { cwd: REPOSITORY_ROOT, stdio: 'ignore' }
  );
  headDescendsFromBase = true;
} catch {
  // Recorded by checks below.
}
check('BASE_COMMIT_EXISTS', baseCommitExists);
check('HEAD_DESCENDS_FROM_BASE', headDescendsFromBase);

const allowedAdmissionPaths = [
  ...changeset.expectedParentPolicy.allowedAdmissionPaths
].sort((left, right) => left.localeCompare(right));
const requiredAdmissionPaths = [
  '/h-earth-3d/control-plane/step-2/h-earth.step-2.current-state.manifest.json',
  '/h-earth-3d/control-plane/step-2/h-earth.step-2.successor-target.manifest.json',
  '/h-earth-3d/control-plane/step-2/h-earth.step-2.authorized-changeset.manifest.json',
  '/h-earth-3d/control-plane/step-2/h-earth.step-2.transition-decision.json',
  '/h-earth-3d/control-plane/step-2/h-earth.step-2.transition-decision.fixtures.json',
  '/h-earth-3d/control-plane/step-2/h-earth.step-2.transition-decision.validator.mjs',
  '/.github/workflows/h-earth-step-2-decision-accountability-audit.yml'
].sort((left, right) => left.localeCompare(right));
let changedAdmissionPaths = [];
try {
  changedAdmissionPaths = changedPathsFromBase(currentState.expectedBaseCommit);
} catch (error) {
  check('STEP_2_ADMISSION_DIFF_RESOLVES', false, error.message);
}
if (!checks.some((entry) => entry.name === 'STEP_2_ADMISSION_DIFF_RESOLVES')) {
  check('STEP_2_ADMISSION_DIFF_RESOLVES', true);
}
check(
  'STEP_2_ADMISSION_PATHS_ALLOWED',
  changedAdmissionPaths.every((repositoryPath) =>
    allowedAdmissionPaths.includes(repositoryPath)
  ),
  {
    changedPathCount: changedAdmissionPaths.length,
    unauthorizedPaths: changedAdmissionPaths.filter(
      (repositoryPath) => !allowedAdmissionPaths.includes(repositoryPath)
    )
  }
);
check(
  'STEP_2_REQUIRED_PACKAGE_PATHS_PRESENT',
  requiredAdmissionPaths.every((repositoryPath) =>
    changedAdmissionPaths.includes(repositoryPath)
  )
);
check(
  'STEP_2_ALLOWED_ADMISSION_PATHS_UNIQUE',
  new Set(allowedAdmissionPaths).size === allowedAdmissionPaths.length
);

const lockedOccurrences = [
  currentState.currentSelectionChain.bootstrap,
  currentState.currentSelectionChain.stableRegistrySource,
  currentState.currentSelectionChain.consumerFacade,
  currentState.currentSelectionChain.validatorIdentity,
  currentState.currentSelectionChain.validatorLoader,
  currentState.currentSelectionChain.postMergeOverlay,
  {
    path: currentState.candidateSuccessorEvidence.candidatePath,
    gitBlobSha: currentState.candidateSuccessorEvidence.candidateGitBlobSha
  },
  {
    path: currentState.candidateSuccessorEvidence.identityPath,
    gitBlobSha: currentState.candidateSuccessorEvidence.identityGitBlobSha
  },
  {
    path: currentState.candidateSuccessorEvidence.amendmentPath,
    gitBlobSha: currentState.candidateSuccessorEvidence.amendmentGitBlobSha
  }
];

for (const occurrence of lockedOccurrences) {
  const actualGitBlobSha = gitBlobSha(readRepositoryBytes(occurrence.path));
  check(
    `CURRENT_BLOB:${occurrence.path}`,
    actualGitBlobSha === occurrence.gitBlobSha,
    { expected: occurrence.gitBlobSha, actual: actualGitBlobSha }
  );
}

const successorModule = await import(
  `${pathToFileURL(repositoryFilePath(successorTarget.selectedSuccessor.sourcePath)).href}?v=${successorTarget.manifestDigest}`
);
check(
  'SUCCESSOR_IDENTITY',
  successorModule.identity?.successorId ===
    successorTarget.selectedSuccessor.successorId
);
check(
  'SUCCESSOR_VERSION',
  successorModule.identity?.registryVersion ===
    successorTarget.selectedSuccessor.registryVersion
);
check(
  'SUCCESSOR_INSTANCE_DIGEST',
  successorModule.identity?.contentDigest ===
    successorTarget.selectedSuccessor.sourceInstanceContentDigest
);
check(
  'SUCCESSOR_SOURCE_STILL_NONACTIVE',
  successorModule.identity?.activeRegistryChanged === false
);
check(
  'SUCCESSOR_SOURCE_STILL_NONCANONICAL',
  successorModule.identity?.canonical === false
);

const authorizedOperationPaths = changeset.authorizedOperations.map(
  (operation) => operation.path
);
check(
  'AUTHORIZED_PATH_COUNT',
  authorizedOperationPaths.length === changeset.authorizedPathCount
);
check(
  'AUTHORIZED_PATHS_UNIQUE',
  new Set(authorizedOperationPaths).size === authorizedOperationPaths.length
);
check(
  'AUTHORIZED_PATHS_EXACT',
  canonicalize(authorizedOperationPaths) === canonicalize(changeset.authorizedPaths)
);

const successorBytes = readRepositoryBytes(
  successorTarget.selectedSuccessor.sourcePath
);
const operationContext = {
  successorBytes,
  successorSha256: sha256(successorBytes)
};
const resolvedOperations = [];
for (const operation of changeset.authorizedOperations) {
  try {
    resolvedOperations.push(
      applyAuthorizedOperation(operation, operationContext)
    );
    check(`OPERATION_RESOLVES:${operation.operationId}`, true);
  } catch (error) {
    check(
      `OPERATION_RESOLVES:${operation.operationId}`,
      false,
      error.message
    );
  }
}
check(
  'PROMOTED_BLOB_EQUALS_SUCCESSOR',
  resolvedOperations.find(
    (operation) => operation.operationId === 'OP_01_PROMOTE_SUCCESSOR_BYTES'
  )?.afterGitBlobSha === successorTarget.selectedSuccessor.sourceGitBlobSha
);

const decisionReferences = {
  baseCommit: currentState.expectedBaseCommit,
  parentPolicyId: changeset.expectedParentPolicy.policyId,
  successorId: successorTarget.selectedSuccessor.successorId,
  successorGitBlobSha: successorTarget.selectedSuccessor.sourceGitBlobSha,
  successorContentDigest:
    successorTarget.selectedSuccessor.sourceInstanceContentDigest,
  authorizedChangesetDigest: changeset.authorizedChangesetDigest,
  authorizedPaths: changeset.authorizedPaths
};
const decisionFailureCodes = validateDecision(decision, decisionReferences);
check('DECISION_VALID', decisionFailureCodes.length === 0, decisionFailureCodes);

const fixtureResults = [];
for (const fixture of fixtureSuite.fixtures) {
  const fixtureDecision = structuredClone(decision);
  for (const mutation of fixture.mutations) {
    setPointer(fixtureDecision, mutation.pointer, mutation.value);
  }
  fixtureDecision.decisionDigest = digestObject(
    fixtureDecision,
    'decisionDigest'
  );

  const failureCodes = validateDecision(fixtureDecision, decisionReferences);
  const actualValid = failureCodes.length === 0;
  const pass =
    actualValid === fixture.expectedValid &&
    (fixture.expectedFailureCode === null ||
      failureCodes.includes(fixture.expectedFailureCode));

  fixtureResults.push({
    fixtureId: fixture.fixtureId,
    class: fixture.class,
    pass,
    expectedValid: fixture.expectedValid,
    actualValid,
    expectedFailureCode: fixture.expectedFailureCode,
    failureCodes
  });
  check(`FIXTURE:${fixture.fixtureId}`, pass, failureCodes);
}

check(
  'FIXTURE_COUNT',
  fixtureResults.length === fixtureSuite.expectedCounts.total
);
check(
  'ALL_VALID_FIXTURES_PASS',
  fixtureResults
    .filter((fixture) => fixture.expectedValid)
    .every((fixture) => fixture.pass)
);
check(
  'ALL_INVALID_FIXTURES_FAIL',
  fixtureResults
    .filter((fixture) => !fixture.expectedValid)
    .every((fixture) => fixture.pass)
);

const receiptCore = {
  receiptId: 'H_EARTH_STEP_2_TRANSITION_DECISION_AUDIT_RECEIPT_v1',
  receiptVersion: 1,
  repository: currentState.repository,
  evaluatedAtDeterministicCheckpoint: DETERMINISTIC_EVALUATION_TIME,
  evaluatedBaseCommit: currentState.expectedBaseCommit,
  currentStateManifestDigest: currentState.manifestDigest,
  successorTargetManifestDigest: successorTarget.manifestDigest,
  authorizedChangesetDigest: changeset.authorizedChangesetDigest,
  decisionId: decision.decisionId,
  decisionDigest: decision.decisionDigest,
  fixtureSuiteDigest: fixtureSuite.suiteDigest,
  resolvedOperations,
  fixtureResults,
  checks,
  result: failures.length === 0 ? 'PASS' : 'FAIL',
  passedCheckCount: checks.filter((entry) => entry.pass).length,
  failedCheckCount: failures.length,
  failures,
  checkpointState: {
    step2_1CurrentStateLock: failures.some(
      (failure) =>
        failure.startsWith('CURRENT_BLOB') ||
        failure.includes('BASE_COMMIT') ||
        failure.includes('HEAD_DESCENDS')
    )
      ? 'FAIL'
      : 'PASS',
    step2_2SuccessorIdentityLock: failures.some((failure) =>
      failure.startsWith('SUCCESSOR_')
    )
      ? 'FAIL'
      : 'PASS',
    step2_3ExactChangesetLock: failures.some(
      (failure) =>
        failure.startsWith('AUTHORIZED_') ||
        failure.startsWith('OPERATION_') ||
        failure === 'PROMOTED_BLOB_EQUALS_SUCCESSOR'
    )
      ? 'FAIL'
      : 'PASS',
    step2_4OneTimeDecision: failures.includes('DECISION_VALID')
      ? 'FAIL'
      : 'PASS',
    step2_5DecisionValidation: failures.some(
      (failure) =>
        failure.startsWith('FIXTURE') ||
        failure.startsWith('ALL_') ||
        failure.startsWith('STEP_2_ADMISSION_') ||
        failure.startsWith('STEP_2_REQUIRED_')
    )
      ? 'FAIL'
      : 'PASS'
  },
  boundaries: {
    repositoryActivationPerformed: false,
    bootstrapReplacementPerformed: false,
    stableRegistrySourceReplaced: false,
    canonicalizationExecuted: false,
    transitionExecutionPerformed: false,
    step3ExecutorCreated: false
  }
};

const receipt = {
  ...receiptCore,
  receiptDigest: digestObject(receiptCore)
};

fs.mkdirSync(path.dirname(ARTIFACT_RECEIPT_PATH), { recursive: true });
fs.writeFileSync(
  ARTIFACT_RECEIPT_PATH,
  `${JSON.stringify(receipt, null, 2)}\n`,
  'utf8'
);

if (fs.existsSync(COMMITTED_RECEIPT_PATH)) {
  const committedReceipt = JSON.parse(
    fs.readFileSync(COMMITTED_RECEIPT_PATH, 'utf8')
  );
  if (canonicalize(committedReceipt) !== canonicalize(receipt)) {
    console.error('COMMITTED_RECEIPT_MISMATCH');
    process.exitCode = 1;
  }
}

process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
if (failures.length > 0) process.exitCode = 1;
