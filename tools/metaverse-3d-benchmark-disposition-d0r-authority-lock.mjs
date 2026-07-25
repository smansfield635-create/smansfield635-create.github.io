import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const contractPath = resolve(here, 'metaverse-3d-benchmark-disposition-d0r-contract.json');

export const EXPECTED = Object.freeze({
  contractId: 'METAVERSE_3D_BENCHMARK_TO_DISPOSITION_COMPILER_FOUR_COMPASS_AUTHORITY_RECONCILIATION_D0R_v2',
  toolId: 'METAVERSE_3D_BENCHMARK_TO_DISPOSITION_COMPILER_v1',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/metaverse-3d-benchmark-disposition-compiler-d0r-002',
  floorCommit: 'f304e19a2d53a98b510ce437d6fa65aad2a8539d',
  compasses: Object.freeze(['MAIN_COMPASS', 'ARCHCOIN_COMPASS', 'SHOWROOM_COMPASS', 'LAWS_COMPASS']),
  dimensions: Object.freeze(['SOURCE_CUSTODY','AUTHORITY_BOUNDARIES','RUNTIME_LOAD','INTERACTION_EXECUTION','VISUAL_REALIZATION','SPATIAL_REALIZATION','RESPONSIVE_BEHAVIOR','PERFORMANCE','ACCESSIBILITY','DEPLOYED_IDENTITY','USER_ACCEPTANCE']),
  dimensionStates: Object.freeze(['PASS','FAIL','BLOCKED','UNRESOLVED','NOT_EXECUTED','NOT_APPLICABLE','SUPERSEDED','WITHHELD']),
  dispositions: Object.freeze(['RETAIN','RECLASSIFY','CORRECT','ISOLATE','SUPERSEDE','REVERT','DEFER_PENDING_EVIDENCE','ADMISSIBLE_FOR_ACCEPTANCE']),
  anchors: Object.freeze(['R0','R1','R2','R3','R4','R5','R6'])
});

const fail = (code, details = null) => {
  const error = new Error(code);
  error.code = code;
  error.details = details;
  throw error;
};

export function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
  }
  return value;
}

export function digest(value) {
  return createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
}

const exactArray = (actual, expected, code) => {
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
  if (contract.compilerBranch !== EXPECTED.branch) fail('D0R_COMPILER_BRANCH_MISMATCH');
  if (contract.reconciliationAuthorityFloorCommit !== EXPECTED.floorCommit) fail('D0R_RECONCILIATION_FLOOR_MISMATCH');

  const compassIds = contract.governedCompasses?.map(record => record.benchmarkId) ?? [];
  unique(compassIds, 'D0R_DUPLICATE_COMPASS_ID');
  exactArray(compassIds, EXPECTED.compasses, 'D0R_COMPASS_SET_MISMATCH');
  if (compassIds.includes('HOMEPAGE_COMPASS')) fail('D0R_HOME_MUST_NOT_BE_COMPASS');
  if (contract.canonicalCompassCount !== 4 || contract.governedCompasses.length !== 4) fail('D0R_COMPASS_COUNT_MISMATCH');
  const positive = contract.governedCompasses.filter(record => record.referenceRole.startsWith('POSITIVE_'));
  const negative = contract.governedCompasses.filter(record => record.referenceRole === 'NEGATIVE_INTERACTION_REGRESSION_REFERENCE');
  if (positive.length !== 3 || negative.length !== 1 || negative[0].benchmarkId !== 'LAWS_COMPASS') fail('D0R_REFERENCE_ROLE_SET_MISMATCH');

  const controls = contract.auxiliaryControls ?? [];
  if (controls.length !== 1 || contract.auxiliaryControlCount !== 1) fail('D0R_AUXILIARY_CONTROL_COUNT_MISMATCH');
  const home = controls[0];
  if (home.controlId !== 'WEBSITE_HOME_RECEIVER_CONTROL' || home.legacyInvalidBenchmarkId !== 'HOMEPAGE_COMPASS') fail('D0R_HOME_CONTROL_IDENTITY_MISMATCH');
  if (home.classification !== 'AUXILIARY_NON_COMPASS_CONTROL' || home.compassAuthority !== false) fail('D0R_HOME_CONTROL_CLASSIFICATION_MISMATCH');
  for (const key of ['includedInCompassCounts','includedInCompassDigests','includedInCompassFindings','includedInCompassAcceptance']) {
    if (home[key] !== false) fail(`D0R_HOME_${key.toUpperCase()}_MUST_BE_FALSE`);
  }
  if (contract.observedRouteCount !== 5 || contract.observedRouteCount === contract.canonicalCompassCount) fail('D0R_ROUTE_COMPASS_COUNT_DISTINCTION_MISSING');

  const legacy = contract.legacyIdentityDisposition ?? {};
  if (legacy.HOMEPAGE_COMPASS?.disposition !== 'RETIRED_INVALID_IDENTITY' || legacy.HOMEPAGE_COMPASS?.replacement !== 'WEBSITE_HOME_RECEIVER_CONTROL') fail('D0R_HOME_LEGACY_DISPOSITION_MISMATCH');
  if (legacy.SHOWROOM?.replacement !== 'SHOWROOM_COMPASS') fail('D0R_SHOWROOM_CANONICAL_ID_MISMATCH');
  if (legacy.LAWS_CHAMBER_POST_PR128?.replacement !== 'LAWS_COMPASS') fail('D0R_LAWS_CANONICAL_ID_MISMATCH');

  if (contract.positiveCompassReferenceCount !== 3 || contract.negativeCompassReferenceCount !== 1) fail('D0R_DECLARED_REFERENCE_COUNTS_MISMATCH');
  const evidence = contract.reprojectedEvidence ?? {};
  if (evidence.sourceRuntime?.checkpoint !== 'R3' || evidence.sourceRuntime?.status !== 'PASS') fail('D0R_R3_REPROJECTION_MISSING');
  if (evidence.homeAuxiliary?.checkpoint !== 'R4' || evidence.homeAuxiliary?.status !== 'PASS') fail('D0R_R4_REPOSITIONING_MISSING');
  if (evidence.interaction?.checkpoint !== 'R5' || evidence.interaction?.status !== 'PASS' || evidence.interaction?.scenarioCount !== 18 || evidence.interaction?.findingCount !== 12) fail('D0R_R5_REPROJECTION_MISMATCH');
  if (evidence.visualSpatial?.checkpoint !== 'R6' || evidence.visualSpatial?.status !== 'PASS' || evidence.visualSpatial?.captureCount !== 48 || evidence.visualSpatial?.findingCount !== 8) fail('D0R_R6_REPROJECTION_MISMATCH');

  unique(contract.governedDimensions, 'D0R_DUPLICATE_DIMENSION');
  exactArray(contract.governedDimensions, EXPECTED.dimensions, 'D0R_DIMENSION_SET_MISMATCH');
  unique(contract.dimensionStates, 'D0R_DUPLICATE_DIMENSION_STATE');
  exactArray(contract.dimensionStates, EXPECTED.dimensionStates, 'D0R_DIMENSION_STATE_SET_MISMATCH');
  unique(contract.dispositions, 'D0R_DUPLICATE_DISPOSITION');
  exactArray(contract.dispositions, EXPECTED.dispositions, 'D0R_DISPOSITION_SET_MISMATCH');

  const anchorIds = (contract.sourceAnchors ?? []).map(record => record[0]);
  unique(anchorIds, 'D0R_DUPLICATE_SOURCE_ANCHOR');
  exactArray(anchorIds, EXPECTED.anchors, 'D0R_SOURCE_ANCHOR_SET_MISMATCH');

  if (contract.historicalPolicy?.historicalFiveBenchmarkAggregatesRemainControlling !== false) fail('D0R_FIVE_BENCHMARK_AUTHORITY_MUST_BE_SUPERSEDED');
  if (contract.historicalPolicy?.cp0ThroughCp7ArtifactsPreserved !== true || contract.historicalPolicy?.historicalArtifactsDeleted !== false || contract.historicalPolicy?.historicalCommitsRewritten !== false) fail('D0R_HISTORICAL_PRESERVATION_MISMATCH');

  if (contract.authority?.compilerOwnsEvidenceInterpretation !== true) fail('D0R_EVIDENCE_INTERPRETATION_AUTHORITY_MISSING');
  if (contract.authority?.compilerOwnsProductAuthority !== false) fail('D0R_PRODUCT_AUTHORITY_MUST_BE_FALSE');
  if (contract.authority?.compilerOwnsAcceptanceAuthority !== false) fail('D0R_ACCEPTANCE_AUTHORITY_MUST_BE_FALSE');
  for (const key of ['productMutationAuthority','mainWriteAuthority','mergeAuthority','userAcceptanceAuthority']) {
    if (contract.authority?.[key] !== 'NONE') fail(`D0R_${key.toUpperCase()}_MUST_BE_NONE`);
  }

  const paths = contract.authorizedCheckpointPaths ?? [];
  unique(paths, 'D0R_DUPLICATE_AUTHORIZED_PATH');
  if (paths.length !== 4 || paths.some(path => !(path.startsWith('tools/metaverse-3d-benchmark-disposition-d0r-') || path === '.github/workflows/metaverse-3d-benchmark-disposition-d0r.yml'))) fail('D0R_AUTHORIZED_PATH_ESCAPE', paths);

  if (contract.claims?.fourCompassAuthorityReconciled !== true || contract.claims?.homeAuxiliaryControlLocked !== true || contract.claims?.r5InteractionReprojectionConsumed !== true || contract.claims?.r6VisualSpatialReprojectionConsumed !== true) fail('D0R_REQUIRED_CLAIMS_MISSING');
  if (contract.claims?.evidenceNormalizationPerformed !== false || contract.claims?.dimensionClassificationPerformed !== false || contract.claims?.dispositionCompilationPerformed !== false) fail('D0R_LATER_CHECKPOINT_CLAIM_PRESENT');
  if (contract.claims?.productFilesChanged !== 0 || contract.claims?.mergePerformed !== false) fail('D0R_STOPPING_BOUNDARY_VIOLATED');
  if (contract.nextCheckpoint !== 'D1_NATIVE_EVIDENCE_INTAKE_AND_IDENTITY_VALIDATION') fail('D0R_NEXT_CHECKPOINT_MISMATCH');
  return true;
}

export function verifyD0RRepositoryCustody(contract, cwd = process.cwd()) {
  execFileSync('git', ['merge-base', '--is-ancestor', contract.reconciliationAuthorityFloorCommit, 'HEAD'], { cwd, stdio: 'pipe' });
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
    receiptId: 'METAVERSE_3D_BENCHMARK_TO_DISPOSITION_COMPILER_D0R_AUTHORITY_RECEIPT_v2',
    status: 'PASS',
    checkpoint: 'D0R',
    contractId: contract.contractId,
    toolId: contract.toolId,
    repository: contract.repository,
    compilerBranch: contract.compilerBranch,
    sourceAnchorCount: contract.sourceAnchors.length,
    observedRouteCount: contract.observedRouteCount,
    canonicalCompassCount: contract.canonicalCompassCount,
    positiveCompassReferenceCount: contract.positiveCompassReferenceCount,
    negativeCompassReferenceCount: contract.negativeCompassReferenceCount,
    auxiliaryControlCount: contract.auxiliaryControlCount,
    governedCompassIds: contract.governedCompasses.map(record => record.benchmarkId),
    auxiliaryControlIds: contract.auxiliaryControls.map(record => record.controlId),
    reprojectedEvidence: contract.reprojectedEvidence,
    historicalPolicy: contract.historicalPolicy,
    authority: contract.authority,
    claims: contract.claims,
    nextCheckpoint: contract.nextCheckpoint
  };
  return Object.freeze({ ...body, deterministicReceiptSha256: digest(body) });
}
