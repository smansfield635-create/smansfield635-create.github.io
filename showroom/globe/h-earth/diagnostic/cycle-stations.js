/** FD_05 pure read-only station adjudications F1-F55. */
import {
  calculateSha256,
  canonicalizeRfc8785,
  deepFreeze,
  digestCanonicalObject,
  isRecord
} from './evidence.js?v=fd05-nine-cycle-20260718a';
import {
  validateHEarthFd05Package
} from './browser-package.js?v=fd05-nine-cycle-20260718a';
import {
  verifyHEarthFd05EngineeringDispositionReceipt,
  verifyHEarthFd05RepositoryOccurrenceReceipt
} from './cycle-input-contracts.js?v=fd05-lane-a-hardening-20260718a';

export const H_EARTH_FD05_CYCLE_CONTRACT_ID =
  'H_EARTH_FD05_DIAGNOSIS_AND_CORRECTION_NINE_CYCLE_CONTRACT_v1';
export const H_EARTH_FD05_CYCLE_PACKET_CONTRACT_ID =
  'H_EARTH_FD05_DIAGNOSIS_AND_CORRECTION_CYCLE_PACKET_CONTRACT_v1';

export const H_EARTH_FD05_CYCLE_INPUT_KEYS = deepFreeze({
  BROWSER_PACKAGE: 'browserPackage',
  ENGINEERING_RECEIPT: 'engineeringReceipt',
  REPOSITORY_OCCURRENCE: 'repositoryOccurrenceEvidence',
  DRIVE_OCCURRENCE: 'selectedDriveOccurrenceEvidence',
  CORRECTION_AUTHORITY_RECEIPT: 'correctionAuthorityReceipt',
  REPLACEMENT_PLAN: 'replacementPlanEvidence',
  REPLACEMENT_EXECUTION_RECEIPT: 'replacementExecutionReceipt',
  POST_CORRECTION_VALIDATION: 'postCorrectionValidationReceipt'
});

const STATIONS = [
  ['F1', 'AUTHORITY_CUSTODY_INTAKE'],
  ['F3', 'DEPLOYED_BODY_SOURCE_VERIFICATION'],
  ['F5', 'OCCURRENCE_CORRESPONDENCE'],
  ['F8', 'BROWSER_EVIDENCE_TRUTH'],
  ['F13', 'ENGINEERING_PARSE_PROBE'],
  ['F21', 'CAUSAL_PROPAGATION_INTERPRETATION'],
  ['F34', 'CORRECTION_AUTHORITY_HANDOFF'],
  ['F55', 'RESTITUTION_AND_REPLACEMENT_PLAN'],
  ['F89', 'TERMINAL_DIAGNOSTIC_SYNTHESIS']
];

export const H_EARTH_FD05_CYCLE_STATION_REGISTRY = deepFreeze(
  STATIONS.map((definition, index) => ({
    position: index + 1,
    fibonacci: definition[0],
    stationId: definition[1]
  }))
);

const EAST = '/showroom/globe/h-earth/render/geometry-kernel.east.js';
const EXPECTED_REJECTIONS = [1, 4, 9, 13, 14, 15, 16, 17, 18, 19];
const HEX = /^[a-f0-9]{64}$/;

const clone = (value) =>
  Array.isArray(value)
    ? value.map(clone)
    : isRecord(value)
      ? Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, clone(nested)]))
      : value;

const without = (value, key) => {
  const copy = clone(value);
  delete copy[key];
  return copy;
};

const normalizeDigest = (value) =>
  typeof value === 'string' && HEX.test(value.toLowerCase())
    ? value.toLowerCase()
    : null;

const canonicalEqual = (left, right) => {
  try {
    return canonicalizeRfc8785(left) === canonicalizeRfc8785(right);
  } catch {
    return false;
  }
};

function base64Bytes(value, atobImpl) {
  const binary = atobImpl(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function repositoryOccurrence(input) {
  if (!isRecord(input)) return null;
  const occurrence = input.repositoryOccurrence ?? input.occurrence ?? input;
  return {
    repositoryCommit: occurrence.repositoryCommit ?? input.repositoryCommit,
    repositoryPath: occurrence.repositoryPath ?? input.repositoryPath,
    blobSha:
      occurrence.blobSha ??
      occurrence.repositoryBlobSha ??
      occurrence.gitBlobSha ??
      input.blobSha ??
      input.gitBlobSha,
    sha256: normalizeDigest(
      occurrence.sha256 ??
      occurrence.repositorySha256 ??
      occurrence.digest?.value ??
      input.sha256 ??
      input.repositorySha256
    )
  };
}

function driveOccurrence(input) {
  if (!isRecord(input)) return null;
  const occurrence = input.driveOccurrence ?? input.occurrence ?? input;
  return {
    repositoryPath: occurrence.repositoryPath ?? input.repositoryPath,
    documentId: occurrence.documentId ?? input.documentId,
    revisionId: occurrence.revisionId ?? input.revisionId,
    sha256: normalizeDigest(
      occurrence.sha256 ??
      occurrence.driveSha256 ??
      occurrence.digest?.value ??
      input.sha256
    )
  };
}

function replacementPlan(input) {
  if (!isRecord(input)) return null;
  return {
    targetRepositoryPath: input.targetRepositoryPath ?? input.repositoryPath,
    completeFileReplacement:
      input.completeFileReplacement === true ||
      input.replacementMode === 'FULL_FILE_REPLACEMENT',
    currentBlobSha: input.currentBlobSha ?? input.repositoryBlobSha,
    candidateDriveRevisionId: input.candidateDriveRevisionId ?? input.driveRevisionId,
    candidateSha256: normalizeDigest(input.candidateSha256 ?? input.replacementSha256),
    deltaDigest: normalizeDigest(
      input.deltaSha256 ?? input.delta?.sha256 ?? input.fullFileDelta?.digest?.value
    ),
    rollbackBound: input.rollbackBound === true || Boolean(input.rollbackPlan),
    rerunRequirementsBound:
      input.rerunRequirementsBound === true || Array.isArray(input.rerunRequirements)
  };
}

const output = (status, result, evidence = {}, absence = []) =>
  deepFreeze({
    status,
    result,
    evidence: clone(evidence),
    absence: clone(absence),
    direction: status === 'PASS' ? 'ADVANCE' : 'HOLD',
    recommendedOwner: 'FD_05_DIAGNOSTIC_AUTHORITY'
  });

async function f1(context) {
  const browserPackage = context.inputs.browserPackage;
  const artifactReference = context.request.inputArtifactReferences.find(
    (reference) => reference.inputKey === 'browserPackage'
  );
  if (!browserPackage) {
    return output('HELD', 'HELD_BROWSER_PACKAGE_MISSING', {}, ['BROWSER_PACKAGE_MISSING']);
  }
  const structuralValidation = validateHEarthFd05Package(browserPackage);
  const computedPackageDigest = (
    await digestCanonicalObject(
      without(browserPackage, 'packageDigest'),
      context.cryptoObject,
      context.TextEncoderImpl
    )
  ).digest;
  const digestMatches =
    computedPackageDigest === browserPackage.packageDigest?.value &&
    browserPackage.packageDigest?.value === artifactReference?.artifactDigest?.value;
  const identityMatches =
    browserPackage.manifestId === context.manifest.manifestId &&
    browserPackage.manifestDigest === context.manifest.manifestDigest;
  const valid = structuralValidation.valid && digestMatches && identityMatches;
  return output(
    valid ? 'PASS' : 'CONFLICT',
    valid
      ? 'AUTHORITY_CUSTODY_ADMITTED'
      : digestMatches
        ? 'INPUT_ARTIFACT_IDENTITY_CONFLICT'
        : 'INPUT_ARTIFACT_DIGEST_CONFLICT',
    {
      packetId: browserPackage.packetId,
      packageDigest: browserPackage.packageDigest,
      computedPackageDigest,
      structuralValidation,
      identityMatches,
      digestMatches
    },
    valid ? [] : ['BROWSER_PACKAGE_CUSTODY_INVALID']
  );
}

async function f3(context) {
  if (context.priorReceipts[0].status !== 'PASS') {
    return output('HELD', 'HELD_DEPLOYED_BODY_VERIFICATION_NOT_REACHED');
  }
  let byteLengthMatchCount = 0;
  let digestMatchCount = 0;
  for (const row of context.inputs.browserPackage.rows) {
    const bytes = base64Bytes(row.capturedBodyBase64, context.atobImpl);
    const digest = await calculateSha256(bytes.buffer, context.cryptoObject);
    byteLengthMatchCount += bytes.length === row.responseByteLength;
    digestMatchCount += digest === row.deployedSha256;
  }
  const valid = byteLengthMatchCount === 19 && digestMatchCount === 19;
  return output(
    valid ? 'PASS' : 'FAIL',
    valid
      ? 'DEPLOYED_BODY_SOURCE_VERIFICATION_PASS'
      : 'DEPLOYED_BODY_SOURCE_VERIFICATION_FAILED',
    {
      verifiedRowCount: 19,
      byteLengthMatchCount,
      digestMatchCount
    },
    valid ? [] : ['BODY_VERIFICATION_FAILURE']
  );
}

async function f5(context) {
  const rows = context.inputs.browserPackage.rows;
  const count = (key) => ({
    matching: rows.filter((row) => row[key]?.result === 'MATCH').length,
    mismatching: rows.filter((row) => row[key]?.result === 'MISMATCH').length,
    unevaluable: rows.filter((row) => row[key]?.result === 'UNEVALUABLE').length
  });
  const driveCounts = count('driveDigestComparison');
  const repositoryCounts = count('repositoryDigestComparison');
  const input = context.inputs.repositoryOccurrenceEvidence;
  const east = rows[12];

  if (!input) {
    return output(
      'HELD',
      'HELD_REPOSITORY_DIGEST_UNESTABLISHED',
      {
        driveCounts: {
          evaluated: driveCounts.matching + driveCounts.mismatching,
          matching: driveCounts.matching,
          mismatching: driveCounts.mismatching,
          unevaluable: driveCounts.unevaluable
        },
        repositoryCounts: {
          evaluated: repositoryCounts.matching + repositoryCounts.mismatching,
          matching: repositoryCounts.matching,
          mismatching: repositoryCounts.mismatching,
          unevaluable: repositoryCounts.unevaluable
        },
        causalRepositoryOccurrence: null,
        causalDeployedSha256: east.deployedSha256,
        unevaluablePreserved: true
      },
      ['PINNED_REPOSITORY_EAST_SHA256_NOT_ESTABLISHED']
    );
  }

  const verification = await verifyHEarthFd05RepositoryOccurrenceReceipt({
    receipt: input,
    browserPackage: context.inputs.browserPackage,
    cryptoObject: context.cryptoObject,
    TextEncoderImpl: context.TextEncoderImpl,
    atobImpl: context.atobImpl
  });
  const occurrence = repositoryOccurrence(input);
  const status = verification.valid && verification.comparisonMatches ? 'PASS' : 'CONFLICT';
  const result =
    status === 'PASS'
      ? 'OCCURRENCE_CORRESPONDENCE_ESTABLISHED'
      : verification.identityConflict
        ? 'INPUT_ARTIFACT_IDENTITY_CONFLICT'
        : 'INPUT_ARTIFACT_DIGEST_CONFLICT';
  return output(status, result, {
    driveCounts: {
      evaluated: driveCounts.matching + driveCounts.mismatching,
      matching: driveCounts.matching,
      mismatching: driveCounts.mismatching,
      unevaluable: driveCounts.unevaluable
    },
    repositoryCounts: {
      evaluated: repositoryCounts.matching + repositoryCounts.mismatching,
      matching: repositoryCounts.matching,
      mismatching: repositoryCounts.mismatching,
      unevaluable: repositoryCounts.unevaluable
    },
    causalRepositoryOccurrence: occurrence,
    causalDeployedSha256: east.deployedSha256,
    receiptVerification: verification,
    unevaluablePreserved: true
  });
}

async function f8(context) {
  const browserPackage = context.inputs.browserPackage;
  const valid =
    browserPackage.finalCompletionReceipt?.status === 'COMPLETE' &&
    browserPackage.rows.every((row) => row.terminalState);
  return output(
    valid ? 'PASS' : 'FAIL',
    valid ? 'BROWSER_EVIDENCE_TRUTH_ADMITTED' : 'BROWSER_EVIDENCE_TRUTH_INVALID',
    {
      packetId: browserPackage.packetId,
      aggregateCounts: clone(browserPackage.aggregateCounts),
      firstMaterialFinding: clone(browserPackage.firstMaterialFinding),
      unresolvedFields: clone(browserPackage.unresolvedFields),
      completionReceipt: clone(browserPackage.finalCompletionReceipt)
    },
    valid ? [] : ['BROWSER_EVIDENCE_INVALID']
  );
}

async function f13(context) {
  const receipt = context.inputs.engineeringReceipt;
  if (!receipt) {
    return output(
      'HELD',
      'HELD_ENGINEERING_RECEIPT_MISSING',
      {},
      ['FORMAL_ENGINEERING_DISPOSITION_RECEIPT_MISSING']
    );
  }
  const verification = await verifyHEarthFd05EngineeringDispositionReceipt({
    receipt,
    browserPackage: context.inputs.browserPackage,
    manifest: context.manifest,
    cryptoObject: context.cryptoObject,
    TextEncoderImpl: context.TextEncoderImpl
  });
  const status = verification.valid ? 'PASS' : 'CONFLICT';
  const result = verification.valid
    ? 'ENGINEERING_PARSE_RECEIPT_ADMITTED'
    : verification.identityConflict
      ? 'INPUT_ARTIFACT_IDENTITY_CONFLICT'
      : 'ENGINEERING_RECEIPT_CONFLICT';
  return output(
    status,
    result,
    {
      parser: verification.parser,
      syntaxPassCount: verification.syntaxPassCount,
      syntaxFailureCount: verification.syntaxFailureCount,
      failure: verification.failure,
      receiptVerification: verification
    },
    verification.valid ? [] : ['ENGINEERING_RECEIPT_INVALID']
  );
}

function propagation(manifest) {
  const byPath = new Map(manifest.rows.map((row) => [row.repositoryPath, row]));
  const seen = new Set([EAST]);
  const queue = [EAST];
  while (queue.length) {
    for (const parent of byPath.get(queue.shift())?.importParents || []) {
      if (byPath.has(parent.parentPath) && !seen.has(parent.parentPath)) {
        seen.add(parent.parentPath);
        queue.push(parent.parentPath);
      }
    }
  }
  return manifest.rows
    .filter((row) => seen.has(row.repositoryPath))
    .map((row) => row.captureOrder)
    .sort((left, right) => left - right);
}

async function f21(context) {
  const engineeringReceipt = context.priorReceipts[4];
  if (engineeringReceipt.status !== 'PASS') {
    return output('HELD', 'HELD_CAUSAL_INTERPRETATION_PENDING_ENGINEERING_RECEIPT');
  }
  const graph = propagation(context.manifest);
  const observed = context.inputs.browserPackage.rows
    .filter((row) => row.nativeDynamicImportResult === 'REJECTED')
    .map((row) => row.captureOrder)
    .sort((left, right) => left - right);
  const valid =
    canonicalEqual(graph, observed) && canonicalEqual(graph, EXPECTED_REJECTIONS);
  return output(
    valid ? 'PASS' : 'CONFLICT',
    valid
      ? 'EAST_PARSER_DEFECT_AND_PROPAGATION_ESTABLISHED'
      : 'CAUSAL_PROPAGATION_EVIDENCE_CONFLICT',
    {
      causalCaptureOrder: 13,
      causalRepositoryPath: EAST,
      parserFailure: clone(engineeringReceipt.evidence.failure),
      graphDerivedAffectedOrders: graph,
      observedNativeImportRejectedOrders: observed,
      expectedNativeImportRejectedOrders: EXPECTED_REJECTIONS,
      propagationMatches: valid,
      laterRuntimeDefectExclusionClaim: false
    },
    valid ? [] : ['PROPAGATION_CONFLICT']
  );
}

async function f34(context) {
  const valid = [2, 4, 5].every(
    (index) => context.priorReceipts[index].status === 'PASS'
  );
  return output(
    valid ? 'PASS' : 'HELD',
    valid
      ? 'CORRECTION_AUTHORITY_REQUEST_READY'
      : 'HELD_CORRECTION_AUTHORITY_REQUEST_NOT_READY',
    {
      boundedRequest: valid
        ? {
            targetRepositoryPath: EAST,
            deliveryLaw: 'COMPLETE_FULL_FILE_REPLACEMENT',
            sourceCorrectionAuthorityGranted: false,
            productionClaimAuthority: 'NONE'
          }
        : null
    },
    valid ? [] : ['PREREQUISITES_INCOMPLETE']
  );
}

async function f55(context) {
  const repository = repositoryOccurrence(context.inputs.repositoryOccurrenceEvidence);
  const drive = driveOccurrence(context.inputs.selectedDriveOccurrenceEvidence);
  const plan = replacementPlan(context.inputs.replacementPlanEvidence);
  const row = context.manifest.rows[12];
  const issues = [];
  if (context.priorReceipts[6].status !== 'PASS') {
    issues.push('CORRECTION_AUTHORITY_REQUEST_NOT_READY');
  }
  if (
    !repository ||
    repository.repositoryCommit !== context.manifest.repositoryCommit ||
    repository.repositoryPath !== EAST ||
    !repository.blobSha ||
    !repository.sha256
  ) {
    issues.push('PINNED_REPOSITORY_EAST_OCCURRENCE_NOT_BOUND');
  }
  if (
    !drive ||
    drive.repositoryPath !== EAST ||
    drive.documentId !== row.backedDigest.documentId ||
    !drive.revisionId ||
    drive.sha256 !== row.backedDigest.expectedDigest
  ) {
    issues.push('SELECTED_DRIVE_EAST_OCCURRENCE_NOT_BOUND');
  }
  if (
    !plan ||
    plan.targetRepositoryPath !== EAST ||
    !plan.completeFileReplacement ||
    plan.currentBlobSha !== repository?.blobSha ||
    plan.candidateDriveRevisionId !== drive?.revisionId ||
    plan.candidateSha256 !== drive?.sha256 ||
    !plan.deltaDigest ||
    !plan.rollbackBound ||
    !plan.rerunRequirementsBound
  ) {
    issues.push('COMPLETE_FULL_FILE_REPLACEMENT_PLAN_NOT_BOUND');
  }
  return output(
    issues.length ? 'HELD' : 'PASS',
    issues.length
      ? 'HELD_REPLACEMENT_OCCURRENCE_NOT_BOUND'
      : 'RESTITUTION_AND_REPLACEMENT_PLAN_BOUND',
    {
      repositoryOccurrence: repository,
      selectedDriveOccurrence: drive,
      replacementPlan: plan,
      issues
    },
    issues
  );
}

const RUNNERS = [f1, f3, f5, f8, f13, f21, f34, f55];

export async function runHEarthFd05Station(position, context) {
  const runner = RUNNERS[position - 1];
  if (!runner) throw new Error(`UNKNOWN_PRE_RAIL_STATION:${position}`);
  return runner(context);
}
