/**
 * /showroom/globe/h-earth/diagnostic/browser-package.js
 * Finalizes completed browser rows into one immutable evidence package and
 * produces bounded, non-authoritative projections from that frozen package.
 */

import {
  canonicalizeRfc8785,
  calculateSha256,
  deepFreeze,
  equivalentUrl
} from './evidence.js';

export const H_EARTH_FD05_BROWSER_PACKAGE_CONTRACT_ID =
  'H_EARTH_FD05_DEPLOYED_RESPONSE_EVIDENCE_PACKET_CONTRACT_v2';

export const H_EARTH_FD05_BROWSER_COMPLETION_RECEIPT_CONTRACT_ID =
  'H_EARTH_FD05_BROWSER_CAPTURE_COMPLETION_RECEIPT_CONTRACT_v1';

export const H_EARTH_FD05_DERIVED_PROJECTION_CONTRACT_ID =
  'H_EARTH_FD05_BROWSER_PACKAGE_DERIVED_PROJECTION_CONTRACT_v1';

const ROW_FIELDS = Object.freeze([
  'captureOrder',
  'repositoryPath',
  'importParents',
  'requestedDeployedUrl',
  'expectedResponseClass',
  'currentState',
  'terminalState',
  'stateHistory',
  'finalResponseUrl',
  'redirected',
  'httpStatus',
  'responseOk',
  'responseType',
  'contentType',
  'payloadShape',
  'browserExposedResponseHeaders',
  'completeWireResponseHeadersObserved',
  'responseByteLength',
  'deployedSha256',
  'boundedResponsePrefix',
  'observedContractCandidates',
  'expectedContractId',
  'exactExpectedContractLiteralObserved',
  'contractCorrespondenceDisposition',
  'serviceWorkerControllerPresent',
  'serviceWorkerControllerScriptUrl',
  'transportResult',
  'bodyCustodyDisposition',
  'capturedBodyEncoding',
  'capturedBodyBase64',
  'driveDigestComparison',
  'repositoryDigestComparison',
  'nativeImportPolicy',
  'nativeImportAuthorized',
  'nativeImportSkipReason',
  'nativeImportRiskFlags',
  'nativeImportExecutionDisposition',
  'nativeImportNotReachedReason',
  'nativeImportResultUnobservableReason',
  'nativeDynamicImportResult',
  'nativeModuleExportNames',
  'nativeImportFreshNetworkRetrievalClaim',
  'nativeImportExactFailedLeafClaim',
  'transportError',
  'bodyCustodyError',
  'nativeImportError',
  'backedDigestAuthority',
  'repositoryDigestAuthority'
]);

const ROW_SUMMARY_FIELDS = Object.freeze([
  'captureOrder',
  'repositoryPath',
  'importParents',
  'requestedDeployedUrl',
  'expectedResponseClass',
  'finalResponseUrl',
  'redirected',
  'httpStatus',
  'responseOk',
  'responseType',
  'contentType',
  'payloadShape',
  'responseByteLength',
  'deployedSha256',
  'expectedContractId',
  'observedContractCandidates',
  'contractCorrespondenceDisposition',
  'serviceWorkerControllerPresent',
  'serviceWorkerControllerScriptUrl',
  'transportResult',
  'bodyCustodyDisposition',
  'driveDigestComparison',
  'repositoryDigestComparison',
  'nativeImportPolicy',
  'nativeImportAuthorized',
  'nativeImportSkipReason',
  'nativeImportRiskFlags',
  'nativeImportExecutionDisposition',
  'nativeDynamicImportResult',
  'nativeModuleExportNames',
  'nativeImportError',
  'terminalState'
]);

const FINDING_RANK = Object.freeze({
  EVIDENCE_PACKAGE_INVALID_OR_INCOMPLETE: 10,
  MISSING_OR_FAILED_DEPLOYED_RESPONSE: 20,
  UNEXPECTED_FINAL_URL_OR_REDIRECT: 30,
  NON_JAVASCRIPT_OR_INCORRECT_RESPONSE_CLASS: 40,
  UNEXPECTED_OR_STALE_CONTRACT: 50,
  DRIVE_TO_DEPLOYMENT_DIGEST_MISMATCH: 60,
  REPOSITORY_TO_DEPLOYMENT_DIGEST_MISMATCH: 70,
  NATIVE_IMPORT_REJECTED: 80
});

function clone(value) {
  if (Array.isArray(value)) {
    return value.map(clone);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).map((key) => [key, clone(value[key])])
    );
  }

  return value;
}

function projectRow(source) {
  const row = {};

  for (const field of ROW_FIELDS) {
    row[field] = clone(source[field]);
  }

  return row;
}

function makeFinding(
  status,
  code,
  authority,
  row = null,
  orders = [],
  references = []
) {
  const affectedCaptureOrders = row
    ? [row.captureOrder]
    : [...new Set(orders)].sort((left, right) => left - right);

  return {
    status,
    code,
    findingScope: row
      ? 'ROW'
      : affectedCaptureOrders.length > 1 && affectedCaptureOrders.length < 19
        ? 'MULTI_ROW'
        : 'PACKAGE',
    captureOrder: row?.captureOrder ?? null,
    repositoryPath: row?.repositoryPath ?? null,
    affectedCaptureOrders,
    authority,
    evidenceReferences: references.map(String)
  };
}

function first(rows, predicate) {
  return rows.find(predicate) ?? null;
}

function authorityFinding(rows) {
  const contract = first(
    rows,
    (row) => row.contractCorrespondenceDisposition === 'MISMATCH'
  );

  if (contract) {
    return makeFinding(
      'FINDING',
      'UNEXPECTED_OR_STALE_CONTRACT',
      'BROWSER_CONTRACT_OBSERVATION',
      contract,
      [],
      [
        `rows[${contract.captureOrder - 1}].expectedContractId`,
        `rows[${contract.captureOrder - 1}].observedContractCandidates`
      ]
    );
  }

  const drive = first(
    rows,
    (row) => row.driveDigestComparison?.result === 'MISMATCH'
  );

  if (drive) {
    return makeFinding(
      'FINDING',
      'DRIVE_TO_DEPLOYMENT_DIGEST_MISMATCH',
      'AUTHORIZED_DRIVE_DIGEST_COMPARISON',
      drive,
      [],
      [`rows[${drive.captureOrder - 1}].driveDigestComparison`]
    );
  }

  const repository = first(
    rows,
    (row) => row.repositoryDigestComparison?.result === 'MISMATCH'
  );

  if (repository) {
    return makeFinding(
      'FINDING',
      'REPOSITORY_TO_DEPLOYMENT_DIGEST_MISMATCH',
      'AUTHORIZED_REPOSITORY_DIGEST_COMPARISON',
      repository,
      [],
      [`rows[${repository.captureOrder - 1}].repositoryDigestComparison`]
    );
  }

  const unresolved = rows.filter(
    (row) =>
      row.contractCorrespondenceDisposition === 'NOT_EVALUATED_UNRESOLVED' ||
      row.driveDigestComparison?.unevaluableReason === 'BODY_CUSTODY_UNRESOLVED' ||
      row.repositoryDigestComparison?.unevaluableReason ===
        'BODY_CUSTODY_UNRESOLVED'
  );

  if (unresolved.length > 0) {
    return makeFinding(
      'UNRESOLVED',
      'AUTHORITY_CONTINUITY_UNRESOLVED',
      'BROWSER_EVIDENCE_PACKAGE',
      unresolved.length === 1 ? unresolved[0] : null,
      unresolved.map((row) => row.captureOrder),
      ['rows[*].bodyCustodyDisposition']
    );
  }

  return makeFinding(
    'PASS',
    'NO_AUTHORITY_CONTINUITY_FINDING',
    'BROWSER_EVIDENCE_PACKAGE',
    null,
    [],
    [
      'rows[*].contractCorrespondenceDisposition',
      'rows[*].driveDigestComparison',
      'rows[*].repositoryDigestComparison'
    ]
  );
}

function publicationFinding(rows) {
  const missing = first(
    rows,
    (row) =>
      row.transportResult === 'REJECTED' ||
      row.httpStatus === null ||
      row.httpStatus < 200 ||
      row.httpStatus >= 400
  );

  if (missing) {
    return makeFinding(
      'FINDING',
      'MISSING_OR_FAILED_DEPLOYED_RESPONSE',
      'BROWSER_TRANSPORT',
      missing,
      [],
      [
        `rows[${missing.captureOrder - 1}].transportResult`,
        `rows[${missing.captureOrder - 1}].httpStatus`
      ]
    );
  }

  const redirect = first(
    rows,
    (row) =>
      row.redirected === true ||
      !equivalentUrl(row.finalResponseUrl, row.requestedDeployedUrl)
  );

  if (redirect) {
    return makeFinding(
      'FINDING',
      'UNEXPECTED_FINAL_URL_OR_REDIRECT',
      'BROWSER_TRANSPORT',
      redirect,
      [],
      [
        `rows[${redirect.captureOrder - 1}].requestedDeployedUrl`,
        `rows[${redirect.captureOrder - 1}].finalResponseUrl`,
        `rows[${redirect.captureOrder - 1}].redirected`
      ]
    );
  }

  const wrongClass = first(
    rows,
    (row) =>
      row.bodyCustodyDisposition === 'COMPLETE' &&
      row.payloadShape !== undefined &&
      row.payloadShape !== 'JAVASCRIPT_LIKE_RESPONSE'
  );

  if (wrongClass) {
    return makeFinding(
      'FINDING',
      'NON_JAVASCRIPT_OR_INCORRECT_RESPONSE_CLASS',
      'BROWSER_TRANSPORT',
      wrongClass,
      [],
      [
        `rows[${wrongClass.captureOrder - 1}].contentType`,
        `rows[${wrongClass.captureOrder - 1}].boundedResponsePrefix`
      ]
    );
  }

  const unresolved = rows.filter(
    (row) => row.bodyCustodyDisposition === 'UNRESOLVED_FAILURE'
  );

  if (unresolved.length > 0) {
    return makeFinding(
      'UNRESOLVED',
      'PUBLICATION_CORRESPONDENCE_UNRESOLVED',
      'BROWSER_TRANSPORT',
      unresolved.length === 1 ? unresolved[0] : null,
      unresolved.map((row) => row.captureOrder),
      ['rows[*].bodyCustodyError']
    );
  }

  return makeFinding(
    'PASS',
    'PUBLICATION_CORRESPONDENCE_PASS',
    'BROWSER_TRANSPORT',
    null,
    [],
    [
      'rows[*].transportResult',
      'rows[*].finalResponseUrl',
      'rows[*].contentType'
    ]
  );
}

function executionFinding(rows) {
  const rejected = first(
    rows,
    (row) => row.nativeDynamicImportResult === 'REJECTED'
  );

  if (rejected) {
    return makeFinding(
      'FINDING',
      'NATIVE_IMPORT_REJECTED',
      'BROWSER_NATIVE_IMPORT_OBSERVATION',
      rejected,
      [],
      [`rows[${rejected.captureOrder - 1}].nativeImportError`]
    );
  }

  const unresolved = rows.filter(
    (row) =>
      row.nativeImportExecutionDisposition !== 'ATTEMPTED' ||
      row.nativeDynamicImportResult === null
  );

  if (unresolved.length > 0) {
    return makeFinding(
      'UNRESOLVED',
      'BROWSER_NATIVE_IMPORT_OBSERVATION_UNRESOLVED',
      'BROWSER_NATIVE_IMPORT_OBSERVATION',
      unresolved.length === 1 ? unresolved[0] : null,
      unresolved.map((row) => row.captureOrder),
      ['rows[*].nativeImportExecutionDisposition']
    );
  }

  return makeFinding(
    'PASS',
    'BROWSER_NATIVE_IMPORT_OBSERVATION_PASS',
    'BROWSER_NATIVE_IMPORT_OBSERVATION',
    null,
    [],
    ['rows[*].nativeDynamicImportResult']
  );
}

function unresolvedFields(rows) {
  const output = [];

  for (const row of rows) {
    const path = `rows[${row.captureOrder - 1}]`;

    if (row.bodyCustodyDisposition === 'UNRESOLVED_FAILURE') {
      output.push({
        field: `${path}.capturedBodyBase64`,
        captureOrder: row.captureOrder,
        repositoryPath: row.repositoryPath,
        reason: row.bodyCustodyError?.message || 'BODY_CUSTODY_UNRESOLVED'
      });
    }

    if (
      row.nativeImportExecutionDisposition ===
      'NOT_REACHED_INSTRUMENT_IMPOSSIBILITY'
    ) {
      output.push({
        field: `${path}.nativeDynamicImportResult`,
        captureOrder: row.captureOrder,
        repositoryPath: row.repositoryPath,
        reason:
          row.nativeImportNotReachedReason || 'NATIVE_IMPORT_NOT_REACHED'
      });
    }

    if (
      row.nativeImportExecutionDisposition ===
      'ATTEMPTED_RESULT_UNOBSERVABLE_INSTRUMENT_FAILURE'
    ) {
      output.push({
        field: `${path}.nativeDynamicImportResult`,
        captureOrder: row.captureOrder,
        repositoryPath: row.repositoryPath,
        reason:
          row.nativeImportResultUnobservableReason ||
          'NATIVE_IMPORT_RESULT_UNOBSERVABLE'
      });
    }
  }

  return output;
}

function aggregate(rows, unresolved) {
  const count = (predicate) => rows.filter(predicate).length;
  const repositoryMatchCount = count(
    (row) => row.repositoryDigestComparison?.result === 'MATCH'
  );
  const repositoryMismatchCount = count(
    (row) => row.repositoryDigestComparison?.result === 'MISMATCH'
  );
  const repositoryUnevaluableCount = count(
    (row) => row.repositoryDigestComparison?.result === 'UNEVALUABLE'
  );
  const driveMatchCount = count(
    (row) => row.driveDigestComparison?.result === 'MATCH'
  );
  const driveMismatchCount = count(
    (row) => row.driveDigestComparison?.result === 'MISMATCH'
  );
  const driveUnevaluableCount = count(
    (row) => row.driveDigestComparison?.result === 'UNEVALUABLE'
  );

  return {
    moduleCount: rows.length,
    transportFulfilledCount: count(
      (row) => row.transportResult === 'FULFILLED'
    ),
    transportRejectedCount: count(
      (row) => row.transportResult === 'REJECTED'
    ),
    httpSuccessCount: count(
      (row) =>
        Number.isInteger(row.httpStatus) &&
        row.httpStatus >= 200 &&
        row.httpStatus < 400
    ),
    completeBodyCustodyCount: count(
      (row) => row.bodyCustodyDisposition === 'COMPLETE'
    ),
    contractMatchCount: count(
      (row) => row.contractCorrespondenceDisposition === 'MATCH'
    ),
    contractMismatchCount: count(
      (row) => row.contractCorrespondenceDisposition === 'MISMATCH'
    ),
    nativeImportAttemptedCount: count(
      (row) => row.nativeImportExecutionDisposition === 'ATTEMPTED'
    ),
    nativeImportFulfilledCount: count(
      (row) => row.nativeDynamicImportResult === 'FULFILLED'
    ),
    nativeImportRejectedCount: count(
      (row) => row.nativeDynamicImportResult === 'REJECTED'
    ),
    terminalPassCount: count(
      (row) => row.terminalState === 'TERMINAL_PASS'
    ),
    terminalFindingCount: count(
      (row) => row.terminalState === 'TERMINAL_FINDING'
    ),
    terminalUnresolvedCount: count(
      (row) => row.terminalState === 'TERMINAL_UNRESOLVED'
    ),
    driveDigestEvaluatedCount: driveMatchCount + driveMismatchCount,
    driveDigestMatchCount: driveMatchCount,
    driveDigestMismatchCount: driveMismatchCount,
    driveDigestUnevaluableCount: driveUnevaluableCount,
    repositoryDigestEvaluatedCount:
      repositoryMatchCount + repositoryMismatchCount,
    repositoryDigestMatchCount: repositoryMatchCount,
    repositoryDigestMismatchCount: repositoryMismatchCount,
    repositoryDigestUnevaluableCount: repositoryUnevaluableCount,
    unresolvedFieldCount: unresolved.length
  };
}

function validateRows(rows) {
  const issues = [];

  if (!Array.isArray(rows) || rows.length !== 19) {
    return ['PACKAGE_ROW_COUNT_NOT_19'];
  }

  const orders = new Set();

  for (const row of rows) {
    orders.add(row.captureOrder);

    for (const field of ROW_FIELDS) {
      if (!Object.hasOwn(row, field)) {
        issues.push(
          `ROW_REQUIRED_FIELD_MISSING:${row.captureOrder}:${field}`
        );
      }
    }

    if (
      ![
        'TERMINAL_PASS',
        'TERMINAL_FINDING',
        'TERMINAL_UNRESOLVED'
      ].includes(row.terminalState)
    ) {
      issues.push(`ROW_NOT_TERMINAL:${row.captureOrder}`);
    }

    if (!Array.isArray(row.stateHistory) || row.stateHistory.length < 5) {
      issues.push(`ROW_STATE_HISTORY_INCOMPLETE:${row.captureOrder}`);
    }
  }

  for (let order = 1; order <= 19; order += 1) {
    if (!orders.has(order)) {
      issues.push(`PACKAGE_CAPTURE_ORDER_MISSING:${order}`);
    }
  }

  return issues;
}

function selectFirst(validationCandidate, axes) {
  const material = [
    ...(validationCandidate ? [validationCandidate] : []),
    ...axes.filter((item) => item.status === 'FINDING')
  ];

  if (material.length > 0) {
    return material.sort(
      (left, right) =>
        (FINDING_RANK[left.code] ?? 999) -
          (FINDING_RANK[right.code] ?? 999) ||
        (left.captureOrder ?? 999) - (right.captureOrder ?? 999) ||
        left.code.localeCompare(right.code)
    )[0];
  }

  return (
    axes.find((item) => item.status === 'UNRESOLVED') ||
    makeFinding(
      'PASS',
      'NO_MATERIAL_BROWSER_FINDING',
      'BROWSER_FINDING_PRECEDENCE',
      null,
      [],
      [
        'authorityContinuityFinding',
        'publicationCorrespondenceFinding',
        'browserExecutionFinding'
      ]
    )
  );
}

export function validateHEarthFd05Package(packageObject) {
  const required = [
    'packetId',
    'contractId',
    'captureTimestamp',
    'diagnosticContractId',
    'pageUrl',
    'manifestId',
    'manifestDigest',
    'moduleCount',
    'rows',
    'aggregateCounts',
    'authorityContinuityFinding',
    'publicationCorrespondenceFinding',
    'browserExecutionFinding',
    'firstMaterialFinding',
    'unresolvedFields',
    'claimCeiling',
    'sourceModificationAuthorityStatus',
    'finalCompletionReceipt',
    'packageDigest'
  ];

  const issues = required
    .filter((field) => !Object.hasOwn(packageObject, field))
    .map((field) => `PACKAGE_REQUIRED_FIELD_MISSING:${field}`);

  issues.push(...validateRows(packageObject.rows));

  const digest = packageObject.packageDigest;

  if (
    digest &&
    (digest.algorithm !== 'SHA-256' ||
      digest.canonicalization !== 'RFC8785' ||
      digest.encoding !== 'LOWERCASE_HEXADECIMAL' ||
      !/^[a-f0-9]{64}$/.test(digest.value || ''))
  ) {
    issues.push('PACKAGE_DIGEST_OBJECT_INVALID');
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

async function digestText(text, cryptoObject, TextEncoderImpl) {
  const bytes = new TextEncoderImpl().encode(text);
  return calculateSha256(bytes.buffer, cryptoObject);
}

function assertFinalPackage(packageObject) {
  const validation = validateHEarthFd05Package(packageObject);

  if (!validation.valid) {
    throw new Error(
      `DERIVED_PROJECTION_PARENT_INVALID:${validation.issues.join('|')}`
    );
  }

  if (!packageObject.packageDigest?.value) {
    throw new Error('DERIVED_PROJECTION_PARENT_DIGEST_UNAVAILABLE');
  }
}

function projectionBase(packageObject, projectionType) {
  assertFinalPackage(packageObject);

  return {
    projectionType,
    projectionContractId: H_EARTH_FD05_DERIVED_PROJECTION_CONTRACT_ID,
    projectionAuthority: 'DERIVED_FROM_FINAL_FROZEN_BROWSER_PACKAGE',
    replacesCanonicalPackage: false,
    packetId: packageObject.packetId,
    packageDigest: {
      algorithm: packageObject.packageDigest.algorithm,
      canonicalization: packageObject.packageDigest.canonicalization,
      valueEncoding: packageObject.packageDigest.encoding,
      value: packageObject.packageDigest.value
    },
    manifestId: packageObject.manifestId,
    manifestDigest: packageObject.manifestDigest
  };
}

function findingAffectsRow(finding, captureOrder) {
  return (
    finding?.captureOrder === captureOrder ||
    finding?.affectedCaptureOrders?.includes(captureOrder) === true
  );
}

function rowFindings(packageObject, captureOrder) {
  return [
    packageObject.authorityContinuityFinding,
    packageObject.publicationCorrespondenceFinding,
    packageObject.browserExecutionFinding,
    packageObject.firstMaterialFinding
  ]
    .filter((finding) => findingAffectsRow(finding, captureOrder))
    .map(clone);
}

function findPackageRow(packageObject, captureOrder) {
  const row = packageObject.rows.find(
    (candidate) => candidate.captureOrder === captureOrder
  );

  if (!row) {
    throw new Error(`PACKAGE_ROW_NOT_FOUND:${captureOrder}`);
  }

  return row;
}

export function buildPackageDigestProjection(packageObject) {
  return deepFreeze({
    ...projectionBase(packageObject, 'PACKAGE_DIGEST'),
    sourceModificationAuthorityStatus:
      packageObject.sourceModificationAuthorityStatus,
    productionClaimAuthority:
      packageObject.finalCompletionReceipt.productionClaimAuthority
  });
}

export function buildOperatorSummary(packageObject) {
  const counts = packageObject.aggregateCounts;
  const summaryText = [
    `${counts.transportFulfilledCount} transport fulfilled`,
    `${counts.contractMatchCount} contract matches`,
    `${counts.driveDigestMismatchCount} Drive mismatches`,
    `${counts.repositoryDigestMatchCount} repository matches`,
    `${counts.repositoryDigestUnevaluableCount} repository comparisons unevaluable`,
    `${counts.nativeImportFulfilledCount} native imports fulfilled`,
    `${counts.nativeImportRejectedCount} native imports rejected`,
    `first material finding: ${packageObject.firstMaterialFinding.code}`,
    `engineering handoff: ${packageObject.finalCompletionReceipt.engineeringHandoffStatus}`,
    `source correction: ${packageObject.claimCeiling.sourceCorrectionAuthority}`
  ].join('\n');

  return deepFreeze({
    ...projectionBase(packageObject, 'OPERATOR_SUMMARY'),
    counts: clone(counts),
    firstMaterialFinding: clone(packageObject.firstMaterialFinding),
    engineeringHandoffStatus:
      packageObject.finalCompletionReceipt.engineeringHandoffStatus,
    claimCeiling: clone(packageObject.claimCeiling),
    summaryText
  });
}

export function buildCompletionReceiptProjection(packageObject) {
  return deepFreeze({
    ...projectionBase(packageObject, 'BROWSER_CAPTURE_COMPLETION_RECEIPT'),
    completionReceipt: clone(packageObject.finalCompletionReceipt)
  });
}

export function buildFindingsReportProjection(packageObject) {
  const counts = packageObject.aggregateCounts;

  return deepFreeze({
    ...projectionBase(packageObject, 'BROWSER_FINDINGS_REPORT'),
    authorityContinuityFinding: clone(
      packageObject.authorityContinuityFinding
    ),
    publicationCorrespondenceFinding: clone(
      packageObject.publicationCorrespondenceFinding
    ),
    browserExecutionFinding: clone(packageObject.browserExecutionFinding),
    firstMaterialFinding: clone(packageObject.firstMaterialFinding),
    evaluatedCounts: {
      transportResponsesFulfilled: counts.transportFulfilledCount,
      expectedContractLiteralsMatching: counts.contractMatchCount,
      driveComparisonsEvaluated: counts.driveDigestEvaluatedCount,
      driveComparisonsMatching: counts.driveDigestMatchCount,
      driveComparisonsMismatching: counts.driveDigestMismatchCount,
      driveComparisonsUnevaluable: counts.driveDigestUnevaluableCount,
      repositoryComparisonsEvaluated: counts.repositoryDigestEvaluatedCount,
      repositoryComparisonsMatching: counts.repositoryDigestMatchCount,
      repositoryComparisonsMismatching:
        counts.repositoryDigestMismatchCount,
      repositoryComparisonsUnevaluable:
        counts.repositoryDigestUnevaluableCount,
      nativeImportsFulfilled: counts.nativeImportFulfilledCount,
      nativeImportsRejected: counts.nativeImportRejectedCount,
      terminalRows:
        counts.terminalPassCount +
        counts.terminalFindingCount +
        counts.terminalUnresolvedCount,
      unresolvedRequiredFields: counts.unresolvedFieldCount
    },
    engineeringHandoffStatus:
      packageObject.finalCompletionReceipt.engineeringHandoffStatus,
    claimCeiling: clone(packageObject.claimCeiling)
  });
}

export function buildRowSummaryProjection(packageObject, captureOrder) {
  const row = findPackageRow(packageObject, captureOrder);
  const rowSummary = {};

  for (const field of ROW_SUMMARY_FIELDS) {
    rowSummary[field] = clone(row[field]);
  }

  rowSummary.stateHistoryEntryCount = row.stateHistory.length;
  rowSummary.completeBodyIncluded = false;
  rowSummary.capturedBodyBase64CharacterCount =
    row.capturedBodyBase64?.length ?? 0;

  return deepFreeze({
    ...projectionBase(packageObject, 'ROW_SUMMARY'),
    captureOrder,
    row: rowSummary,
    rowFindings: rowFindings(packageObject, captureOrder)
  });
}

export function buildCompleteRowProjection(packageObject, captureOrder) {
  const row = findPackageRow(packageObject, captureOrder);

  return deepFreeze({
    ...projectionBase(packageObject, 'COMPLETE_ROW_EVIDENCE'),
    captureOrder,
    row: clone(row),
    rowFindings: rowFindings(packageObject, captureOrder)
  });
}

export async function buildHEarthFd05BrowserPackage({
  manifest,
  diagnosticContractId,
  pageUrl,
  captureResult,
  packetId,
  cryptoObject = globalThis.crypto,
  TextEncoderImpl = globalThis.TextEncoder,
  captureTimestamp = new Date().toISOString()
}) {
  if (typeof TextEncoderImpl !== 'function') {
    throw new Error('TEXT_ENCODER_UNAVAILABLE');
  }

  const rows = captureResult.rows.map(projectRow);
  const unresolved = unresolvedFields(rows);
  const aggregateCounts = aggregate(rows, unresolved);
  const authorityContinuityFinding = authorityFinding(rows);
  const publicationCorrespondenceFinding = publicationFinding(
    captureResult.rows
  );
  const browserExecutionFinding = executionFinding(rows);
  const preDigestIssues = validateRows(rows);
  const preDigestValid =
    preDigestIssues.length === 0 && unresolved.length === 0;
  const validationIssues = [
    ...preDigestIssues,
    ...(unresolved.length > 0
      ? ['UNRESOLVED_REQUIRED_EVIDENCE_PRESENT']
      : [])
  ];
  const validationCandidate = preDigestValid
    ? null
    : makeFinding(
        'FINDING',
        'EVIDENCE_PACKAGE_INVALID_OR_INCOMPLETE',
        'BROWSER_PACKAGE_VALIDATION',
        null,
        rows.map((row) => row.captureOrder),
        validationIssues
      );
  const firstMaterialFinding = selectFirst(validationCandidate, [
    authorityContinuityFinding,
    publicationCorrespondenceFinding,
    browserExecutionFinding
  ]);
  const engineeringHandoffStatus = preDigestValid
    ? 'ENGINEERING_HANDOFF_AUTHORIZED'
    : 'NO_VALID_ENGINEERING_DISPOSITION';
  const claimCeiling = {
    currentGitHubOccurrenceIdentity: 'ESTABLISHED_19_OF_19',
    repositorySha256: 'ESTABLISHED_10_OF_19_UNEVALUATED_9_OF_19',
    driveToRepositoryExactByteCorrespondence: 'MISMATCH_19_OF_19',
    deployedResponseCorrespondence:
      publicationCorrespondenceFinding.status === 'PASS'
        ? 'BROWSER_CAPTURE_PASS'
        : 'BROWSER_CAPTURE_FINDING_OR_UNRESOLVED',
    exactFailedDeployedOccurrence: 'NOT_ESTABLISHED_BY_BROWSER_PACKAGE',
    browserCapture: 'PERFORMED',
    engineeringParserLinkerReview: 'NOT_PERFORMED',
    sourceCorrectionAuthority: 'WITHHELD',
    productionValidation: 'NOT_ESTABLISHED',
    visualPass: 'NOT_ESTABLISHED'
  };
  const finalCompletionReceipt = {
    receiptId: `${packetId}_COMPLETION_RECEIPT`,
    contractId: H_EARTH_FD05_BROWSER_COMPLETION_RECEIPT_CONTRACT_ID,
    status: 'COMPLETE',
    captureStartedAt: captureResult.runStartedAt,
    captureCompletedAt: captureResult.runCompletedAt,
    packetId,
    manifestId: manifest.manifestId,
    manifestDigest: manifest.manifestDigest,
    moduleCount: rows.length,
    terminalRowCount: rows.filter((row) => row.terminalState).length,
    unresolvedFieldCount: unresolved.length,
    preDigestEvidenceValidityAssessment: preDigestValid
      ? 'VALID'
      : 'INVALID',
    engineeringHandoffStatus,
    sourceModificationAuthorityStatus: 'WITHHELD',
    productionClaimAuthority: 'NONE'
  };
  const body = {
    packetId,
    contractId: H_EARTH_FD05_BROWSER_PACKAGE_CONTRACT_ID,
    captureTimestamp,
    diagnosticContractId,
    pageUrl,
    manifestId: manifest.manifestId,
    manifestDigest: manifest.manifestDigest,
    moduleCount: rows.length,
    rows,
    aggregateCounts,
    authorityContinuityFinding,
    publicationCorrespondenceFinding,
    browserExecutionFinding,
    firstMaterialFinding,
    unresolvedFields: unresolved,
    claimCeiling,
    sourceModificationAuthorityStatus: 'WITHHELD',
    finalCompletionReceipt
  };

  const structural = validateHEarthFd05Package({
    ...body,
    packageDigest: null
  });

  if (!structural.valid) {
    throw new Error(
      `PRE_DIGEST_PACKAGE_STRUCTURAL_FAILURE:${structural.issues.join('|')}`
    );
  }

  const value = await digestText(
    canonicalizeRfc8785(body),
    cryptoObject,
    TextEncoderImpl
  );
  const packageObject = {
    ...body,
    packageDigest: {
      algorithm: 'SHA-256',
      canonicalization: 'RFC8785',
      encoding: 'LOWERCASE_HEXADECIMAL',
      value
    }
  };
  const finalValidation = validateHEarthFd05Package(packageObject);

  if (!finalValidation.valid) {
    throw new Error(
      `FINAL_PACKAGE_VALIDATION_FAILURE:${finalValidation.issues.join('|')}`
    );
  }

  const readback = await digestText(
    canonicalizeRfc8785(body),
    cryptoObject,
    TextEncoderImpl
  );

  if (readback !== value) {
    throw new Error('FINAL_PACKAGE_DIGEST_READBACK_MISMATCH');
  }

  return deepFreeze(packageObject);
}
