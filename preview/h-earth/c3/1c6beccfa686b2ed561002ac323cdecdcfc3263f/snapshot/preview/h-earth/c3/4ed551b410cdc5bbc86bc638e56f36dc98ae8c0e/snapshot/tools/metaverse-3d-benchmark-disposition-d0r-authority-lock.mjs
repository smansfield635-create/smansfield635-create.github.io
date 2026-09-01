import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const contractPath = resolve(here, 'metaverse-3d-benchmark-disposition-d0r-contract.json');

const EXPECTED = Object.freeze({
  contractId: 'METAVERSE_3D_BENCHMARK_TO_DISPOSITION_COMPILER_FOUR_COMPASS_AUTHORITY_RECONCILIATION_D0R_FINAL_v1',
  toolId: 'METAVERSE_3D_BENCHMARK_TO_DISPOSITION_COMPILER_v1',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/metaverse-3d-benchmark-disposition-compiler-d0r-003',
  reconciliationCommit: 'a06f5ff8ab5c687d3c849d6944e4bdcc68490af8',
  compasses: ['MAIN_COMPASS','ARCHCOIN_COMPASS','SHOWROOM_COMPASS','LAWS_COMPASS'],
  anchors: ['R0','R1','R2','R3','R4','R5','R6','R7'],
  dimensions: ['SOURCE_CUSTODY','AUTHORITY_BOUNDARIES','RUNTIME_LOAD','INTERACTION_EXECUTION','VISUAL_REALIZATION','SPATIAL_REALIZATION','RESPONSIVE_BEHAVIOR','PERFORMANCE','ACCESSIBILITY','DEPLOYED_IDENTITY','USER_ACCEPTANCE'],
  states: ['PASS','FAIL','BLOCKED','UNRESOLVED','NOT_EXECUTED','NOT_APPLICABLE','SUPERSEDED','WITHHELD'],
  dispositions: ['RETAIN','RECLASSIFY','CORRECT','ISOLATE','SUPERSEDE','REVERT','DEFER_PENDING_EVIDENCE','ADMISSIBLE_FOR_ACCEPTANCE']
});

const fail = (code, details = null) => {
  const error = new Error(code);
  error.code = code;
  error.details = details;
  throw error;
};

export const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]))
    : value;

export const digest = value => createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');

const exact = (actual, expected, code) => {
  if (!Array.isArray(actual) || actual.length !== expected.length || actual.some((value, index) => value !== expected[index])) {
    fail(code, { actual, expected });
  }
};

const unique = (values, code) => {
  if (new Set(values).size !== values.length) fail(code, values);
};

export async function readD0RContract() {
  return JSON.parse(await readFile(contractPath, 'utf8'));
}

export function validateD0RContract(contract) {
  if (!contract || typeof contract !== 'object') fail('D0R_CONTRACT_REQUIRED');
  if (contract.contractId !== EXPECTED.contractId) fail('D0R_CONTRACT_ID_MISMATCH');
  if (contract.toolId !== EXPECTED.toolId) fail('D0R_TOOL_ID_MISMATCH');
  if (contract.repository !== EXPECTED.repository) fail('D0R_REPOSITORY_MISMATCH');
  if (contract.compilerBranch !== EXPECTED.branch) fail('D0R_BRANCH_MISMATCH');
  if (contract.reconciliationAuthorityCommit !== EXPECTED.reconciliationCommit) fail('D0R_RECONCILIATION_COMMIT_MISMATCH');

  const compassIds = (contract.governedCompasses ?? []).map(record => record[0]);
  unique(compassIds, 'D0R_DUPLICATE_COMPASS_ID');
  exact(compassIds, EXPECTED.compasses, 'D0R_COMPASS_SET_MISMATCH');
  if (compassIds.includes('HOMEPAGE_COMPASS')) fail('D0R_HOME_MUST_NOT_BE_COMPASS');

  const roles = (contract.governedCompasses ?? []).map(record => record[2]);
  if (roles.filter(role => role.startsWith('POSITIVE_')).length !== 3) fail('D0R_POSITIVE_REFERENCE_COUNT_MISMATCH');
  if (roles.filter(role => role === 'NEGATIVE_INTERACTION_REGRESSION_REFERENCE').length !== 1 || contract.governedCompasses[3][0] !== 'LAWS_COMPASS') fail('D0R_NEGATIVE_REFERENCE_MISMATCH');

  const home = contract.auxiliaryControls?.[0];
  if (!home || contract.auxiliaryControls.length !== 1) fail('D0R_HOME_CONTROL_COUNT_MISMATCH');
  if (home.controlId !== 'WEBSITE_HOME_RECEIVER_CONTROL' || home.legacyInvalidBenchmarkId !== 'HOMEPAGE_COMPASS') fail('D0R_HOME_CONTROL_IDENTITY_MISMATCH');
  if (home.classification !== 'AUXILIARY_NON_COMPASS_CONTROL' || home.compassAuthority !== false) fail('D0R_HOME_CONTROL_CLASSIFICATION_MISMATCH');
  for (const key of ['includedInCompassCounts','includedInCompassDigests','includedInCompassFindings','includedInCompassAcceptance']) {
    if (home[key] !== false) fail(`D0R_HOME_${key.toUpperCase()}_MUST_BE_FALSE`);
  }

  if (contract.legacyIdentityDisposition?.HOMEPAGE_COMPASS?.[0] !== 'RETIRED_INVALID_IDENTITY' || contract.legacyIdentityDisposition?.HOMEPAGE_COMPASS?.[1] !== 'WEBSITE_HOME_RECEIVER_CONTROL') fail('D0R_HOME_LEGACY_DISPOSITION_MISMATCH');
  if (contract.legacyIdentityDisposition?.SHOWROOM?.[1] !== 'SHOWROOM_COMPASS') fail('D0R_SHOWROOM_CANONICAL_ID_MISMATCH');
  if (contract.legacyIdentityDisposition?.LAWS_CHAMBER_POST_PR128?.[1] !== 'LAWS_COMPASS') fail('D0R_LAWS_CANONICAL_ID_MISMATCH');

  const counts = contract.counts ?? {};
  const expectedCounts = {
    observedRoutes: 5,
    canonicalCompasses: 4,
    positiveCompassReferences: 3,
    negativeCompassReferences: 1,
    auxiliaryControls: 1,
    sourceOccurrences: 60,
    interactionScenarios: 18,
    interactionFindings: 12,
    visualCaptures: 48,
    visualFindings: 8
  };
  for (const [key, value] of Object.entries(expectedCounts)) if (counts[key] !== value) fail('D0R_COUNT_MISMATCH', { key, actual: counts[key], expected: value });
  if (counts.observedRoutes === counts.canonicalCompasses) fail('D0R_ROUTE_COMPASS_DISTINCTION_MISSING');

  const audit = contract.integrityAudit ?? {};
  if (audit.checkpoint !== 'R7' || audit.status !== 'PASS_RECONCILIATION_INTEGRITY_AUDIT_NO_RECAPTURE_REQUIRED') fail('D0R_R7_STATUS_MISMATCH');
  if (audit.duplicateActiveEvidenceOccurrenceCount !== 0 || audit.unassignedEvidenceOccurrenceCount !== 0 || audit.allHistoricalEvidenceAssignedExactlyOnce !== true) fail('D0R_R7_PARTITION_AUDIT_MISMATCH');
  if (audit.allRecordedDigestsReproduced !== true || audit.allScreenshotBodiesVerified !== true || audit.recaptureDecision !== 'PASS_NO_RECAPTURE_REQUIRED') fail('D0R_R7_CUSTODY_AUDIT_MISMATCH');

  const anchorIds = (contract.sourceAnchors ?? []).map(record => record[0]);
  unique(anchorIds, 'D0R_DUPLICATE_SOURCE_ANCHOR');
  exact(anchorIds, EXPECTED.anchors, 'D0R_SOURCE_ANCHOR_SET_MISMATCH');

  unique(contract.governedDimensions, 'D0R_DUPLICATE_DIMENSION');
  exact(contract.governedDimensions, EXPECTED.dimensions, 'D0R_DIMENSION_SET_MISMATCH');
  unique(contract.dimensionStates, 'D0R_DUPLICATE_STATE');
  exact(contract.dimensionStates, EXPECTED.states, 'D0R_STATE_SET_MISMATCH');
  unique(contract.dispositions, 'D0R_DUPLICATE_DISPOSITION');
  exact(contract.dispositions, EXPECTED.dispositions, 'D0R_DISPOSITION_SET_MISMATCH');

  if (contract.historicalPolicy?.historicalFiveBenchmarkAggregatesRemainControlling !== false) fail('D0R_FIVE_BENCHMARK_AUTHORITY_MUST_BE_SUPERSEDED');
  if (contract.historicalPolicy?.cp0ThroughCp7ArtifactsPreserved !== true || contract.historicalPolicy?.historicalArtifactsDeleted !== false || contract.historicalPolicy?.historicalCommitsRewritten !== false) fail('D0R_HISTORICAL_PRESERVATION_MISMATCH');

  if (contract.authority?.compilerOwnsEvidenceInterpretation !== true) fail('D0R_INTERPRETATION_AUTHORITY_MISSING');
  if (contract.authority?.compilerOwnsProductAuthority !== false) fail('D0R_PRODUCT_AUTHORITY_MUST_BE_FALSE');
  if (contract.authority?.compilerOwnsAcceptanceAuthority !== false) fail('D0R_ACCEPTANCE_AUTHORITY_MUST_BE_FALSE');
  for (const key of ['productMutationAuthority','mainWriteAuthority','mergeAuthority','userAcceptanceAuthority']) if (contract.authority?.[key] !== 'NONE') fail(`D0R_${key.toUpperCase()}_MUST_BE_NONE`);

  const paths = contract.authorizedCheckpointPaths ?? [];
  unique(paths, 'D0R_DUPLICATE_AUTHORIZED_PATH');
  if (paths.length !== 4 || paths.some(path => !(path.startsWith('tools/metaverse-3d-benchmark-disposition-d0r-') || path === '.github/workflows/metaverse-3d-benchmark-disposition-d0r.yml'))) fail('D0R_AUTHORIZED_PATH_ESCAPE');

  if (contract.claims?.fourCompassAuthorityReconciled !== true || contract.claims?.homeAuxiliaryControlLocked !== true || contract.claims?.r7IntegrityAuditConsumed !== true) fail('D0R_REQUIRED_CLAIMS_MISSING');
  if (contract.claims?.evidenceNormalizationPerformed !== false || contract.claims?.dimensionClassificationPerformed !== false || contract.claims?.dispositionCompilationPerformed !== false) fail('D0R_LATER_CHECKPOINT_CLAIM_PRESENT');
  if (contract.claims?.productFilesChanged !== 0 || contract.claims?.mergePerformed !== false) fail('D0R_STOPPING_BOUNDARY_VIOLATED');
  if (contract.nextCheckpoint !== 'D1_NATIVE_EVIDENCE_INTAKE_AND_IDENTITY_VALIDATION') fail('D0R_NEXT_CHECKPOINT_MISMATCH');
  return true;
}

export function verifyD0RRepositoryCustody(contract, cwd = process.cwd()) {
  execFileSync('git', ['merge-base', '--is-ancestor', contract.reconciliationAuthorityCommit, 'HEAD'], { cwd, stdio: 'pipe' });
  for (const [checkpoint, path, expectedBlob] of contract.sourceAnchors) {
    const actualBlob = execFileSync('git', ['hash-object', path], { cwd, encoding: 'utf8' }).trim();
    if (actualBlob !== expectedBlob) fail('D0R_SOURCE_ANCHOR_BLOB_MISMATCH', { checkpoint, path, expectedBlob, actualBlob });
  }
  return true;
}

export async function buildD0RAuthorityReceipt({ verifyRepository = true } = {}) {
  const contract = await readD0RContract();
  validateD0RContract(contract);
  if (verifyRepository) verifyD0RRepositoryCustody(contract);
  const body = {
    receiptId: 'METAVERSE_3D_BENCHMARK_TO_DISPOSITION_COMPILER_D0R_AUTHORITY_RECEIPT_FINAL_v1',
    status: 'PASS',
    checkpoint: 'D0R',
    contractId: contract.contractId,
    reconciliationAuthorityCommit: contract.reconciliationAuthorityCommit,
    sourceAnchorCount: contract.sourceAnchors.length,
    governedCompassIds: contract.governedCompasses.map(record => record[0]),
    auxiliaryControlIds: contract.auxiliaryControls.map(record => record.controlId),
    counts: contract.counts,
    integrityAudit: contract.integrityAudit,
    historicalPolicy: contract.historicalPolicy,
    authority: contract.authority,
    claims: contract.claims,
    nextCheckpoint: contract.nextCheckpoint
  };
  return Object.freeze({ ...body, deterministicReceiptSha256: digest(body) });
}
