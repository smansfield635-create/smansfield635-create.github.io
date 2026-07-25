import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const contractPath = resolve(here, 'metaverse-3d-benchmark-disposition-d0-contract.json');

export const EXPECTED = Object.freeze({
  contractId: 'METAVERSE_3D_BENCHMARK_TO_DISPOSITION_COMPILER_CURRENT_STATE_AND_AUTHORITY_LOCK_D0_v1',
  toolId: 'METAVERSE_3D_BENCHMARK_TO_DISPOSITION_COMPILER_v1',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  inventorySourceCommit: '8d79aa35cf76fba298a5afc800687072d4caa8cb',
  compilerBranch: 'agent/metaverse-3d-benchmark-disposition-compiler-d0-001',
  benchmarks: Object.freeze(['MAIN_COMPASS','HOMEPAGE_COMPASS','ARCHCOIN_COMPASS','SHOWROOM','LAWS_CHAMBER_POST_PR128']),
  dimensions: Object.freeze(['SOURCE_CUSTODY','AUTHORITY_BOUNDARIES','RUNTIME_LOAD','INTERACTION_EXECUTION','VISUAL_REALIZATION','SPATIAL_REALIZATION','RESPONSIVE_BEHAVIOR','PERFORMANCE','ACCESSIBILITY','DEPLOYED_IDENTITY','USER_ACCEPTANCE']),
  dimensionStates: Object.freeze(['PASS','FAIL','BLOCKED','UNRESOLVED','NOT_EXECUTED','NOT_APPLICABLE','SUPERSEDED','WITHHELD']),
  dispositions: Object.freeze(['RETAIN','RECLASSIFY','CORRECT','ISOLATE','SUPERSEDE','REVERT','DEFER_PENDING_EVIDENCE','ADMISSIBLE_FOR_ACCEPTANCE'])
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

export async function readD0Contract() {
  return JSON.parse(await readFile(contractPath, 'utf8'));
}

function exactArray(actual, expected, code) {
  if (!Array.isArray(actual) || actual.length !== expected.length || actual.some((value, index) => value !== expected[index])) {
    fail(code, { actual, expected });
  }
}

function unique(values, code) {
  if (new Set(values).size !== values.length) fail(code, values);
}

export function validateD0Contract(contract) {
  if (!contract || typeof contract !== 'object') fail('D0_CONTRACT_REQUIRED');
  if (contract.contractId !== EXPECTED.contractId) fail('D0_CONTRACT_ID_MISMATCH');
  if (contract.toolId !== EXPECTED.toolId) fail('D0_TOOL_ID_MISMATCH');
  if (contract.repository !== EXPECTED.repository) fail('D0_REPOSITORY_MISMATCH');
  if (contract.inventorySourceCommit !== EXPECTED.inventorySourceCommit) fail('D0_INVENTORY_SOURCE_COMMIT_MISMATCH');
  if (contract.compilerBranch !== EXPECTED.compilerBranch) fail('D0_COMPILER_BRANCH_MISMATCH');

  const benchmarkIds = contract.governedBenchmarks?.map(record => record.benchmarkId) ?? [];
  unique(benchmarkIds, 'D0_DUPLICATE_BENCHMARK_ID');
  exactArray(benchmarkIds, EXPECTED.benchmarks, 'D0_BENCHMARK_SET_MISMATCH');
  const positiveCount = contract.governedBenchmarks.filter(record => record.referenceRole === 'POSITIVE_REFERENCE').length;
  const negative = contract.governedBenchmarks.filter(record => record.referenceRole === 'NEGATIVE_REFERENCE');
  if (positiveCount !== 4 || negative.length !== 1 || negative[0].benchmarkId !== 'LAWS_CHAMBER_POST_PR128') {
    fail('D0_REFERENCE_ROLE_SET_MISMATCH');
  }

  unique(contract.governedDimensions, 'D0_DUPLICATE_DIMENSION');
  exactArray(contract.governedDimensions, EXPECTED.dimensions, 'D0_DIMENSION_SET_MISMATCH');
  unique(contract.dimensionStates, 'D0_DUPLICATE_DIMENSION_STATE');
  exactArray(contract.dimensionStates, EXPECTED.dimensionStates, 'D0_DIMENSION_STATE_SET_MISMATCH');
  unique(contract.dispositions, 'D0_DUPLICATE_DISPOSITION');
  exactArray(contract.dispositions, EXPECTED.dispositions, 'D0_DISPOSITION_SET_MISMATCH');

  if (contract.authority?.compilerOwnsEvidenceInterpretation !== true) fail('D0_EVIDENCE_INTERPRETATION_AUTHORITY_MISSING');
  if (contract.authority?.compilerOwnsProductAuthority !== false) fail('D0_PRODUCT_AUTHORITY_MUST_BE_FALSE');
  if (contract.authority?.compilerOwnsAcceptanceAuthority !== false) fail('D0_ACCEPTANCE_AUTHORITY_MUST_BE_FALSE');
  const noneAuthorityCodes = {
    productMutationAuthority: 'D0_PRODUCT_MUTATION_AUTHORITY_MUST_BE_NONE',
    mainWriteAuthority: 'D0_MAIN_WRITE_AUTHORITY_MUST_BE_NONE',
    mergeAuthority: 'D0_MERGE_AUTHORITY_MUST_BE_NONE',
    userAcceptanceAuthority: 'D0_USER_ACCEPTANCE_AUTHORITY_MUST_BE_NONE'
  };
  for (const [key, code] of Object.entries(noneAuthorityCodes)) {
    if (contract.authority?.[key] !== 'NONE') fail(code);
  }

  if (contract.authorizedOutputRoot !== 'verification/benchmark-corpus/disposition-compiler-v1/') fail('D0_OUTPUT_ROOT_MISMATCH');
  if (contract.authorizedInputRoots?.length !== 1 || contract.authorizedInputRoots[0] !== 'verification/benchmark-corpus/inventory-pass-v1/') fail('D0_INPUT_ROOT_MISMATCH');
  const authorizedPaths = contract.authorizedCheckpointPaths ?? [];
  unique(authorizedPaths, 'D0_DUPLICATE_AUTHORIZED_PATH');
  if (authorizedPaths.length !== 4 || authorizedPaths.some(path => !(path.startsWith('tools/metaverse-3d-benchmark-disposition-d0-') || path === '.github/workflows/metaverse-3d-benchmark-disposition-d0.yml'))) {
    fail('D0_AUTHORIZED_PATH_ESCAPE', authorizedPaths);
  }

  if (contract.claims?.evidenceNormalizationPerformed !== false || contract.claims?.dimensionClassificationPerformed !== false || contract.claims?.dispositionCompilationPerformed !== false) {
    fail('D0_LATER_CHECKPOINT_CLAIM_PRESENT');
  }
  if (contract.claims?.productFilesChanged !== 0 || contract.claims?.mergePerformed !== false) fail('D0_STOPPING_BOUNDARY_VIOLATED');
  if (contract.nextCheckpoint !== 'D1_NATIVE_EVIDENCE_INTAKE_AND_IDENTITY_VALIDATION') fail('D0_NEXT_CHECKPOINT_MISMATCH');
  return true;
}

export function verifyD0RepositoryCustody(contract, cwd = process.cwd()) {
  execFileSync('git', ['merge-base', '--is-ancestor', contract.inventorySourceCommit, 'HEAD'], { cwd, stdio: 'pipe' });
  const sourceAnchors = contract.sourceAnchors ?? [];
  if (sourceAnchors.length !== 2) fail('D0_SOURCE_ANCHOR_COUNT_MISMATCH');
  for (const record of sourceAnchors) {
    const actual = execFileSync('git', ['hash-object', record.path], { cwd, encoding: 'utf8' }).trim();
    if (actual !== record.gitBlob) fail('D0_SOURCE_ANCHOR_BLOB_MISMATCH', { path: record.path, expected: record.gitBlob, actual });
  }
  return true;
}

export async function buildD0AuthorityReceipt({ verifyRepository = true } = {}) {
  const contract = await readD0Contract();
  validateD0Contract(contract);
  if (verifyRepository) verifyD0RepositoryCustody(contract);
  const body = {
    receiptId: 'METAVERSE_3D_BENCHMARK_TO_DISPOSITION_COMPILER_D0_AUTHORITY_RECEIPT_v1',
    status: 'PASS',
    checkpoint: 'D0',
    contractId: contract.contractId,
    toolId: contract.toolId,
    repository: contract.repository,
    inventorySourceCommit: contract.inventorySourceCommit,
    benchmarkCount: contract.governedBenchmarks.length,
    positiveReferenceCount: contract.governedBenchmarks.filter(record => record.referenceRole === 'POSITIVE_REFERENCE').length,
    negativeReferenceCount: contract.governedBenchmarks.filter(record => record.referenceRole === 'NEGATIVE_REFERENCE').length,
    dimensionCount: contract.governedDimensions.length,
    dimensionStateCount: contract.dimensionStates.length,
    dispositionCount: contract.dispositions.length,
    sourceAnchorCount: contract.sourceAnchors.length,
    authority: contract.authority,
    claims: contract.claims,
    nextCheckpoint: contract.nextCheckpoint
  };
  return Object.freeze({ ...body, deterministicReceiptSha256: digest(body) });
}
