import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const contractPath = resolve(here, 'metaverse-3d-benchmark-disposition-d2s-t3-contract.json');
const d2Root = resolve(process.env.D2_ARTIFACT_ROOT ?? resolve(here, '..', 'artifacts', 'metaverse-3d-benchmark-disposition-d2-input'));
const t2ReceiptPath = resolve(process.env.T2_RECEIPT_PATH ?? resolve(here, '..', 'artifacts', 'metaverse-3d-benchmark-disposition-d2s-input', 't2.receipt.json'));
const t3ReceiptPath = resolve(process.env.T3_RECEIPT_PATH ?? resolve(here, '..', 'artifacts', 'metaverse-3d-benchmark-disposition-d2s-input', 't3.receipt.json'));
const smokeRoot = resolve(process.env.T3_SMOKE_ARTIFACT_ROOT ?? resolve(here, '..', 'artifacts', 'metaverse-3d-benchmark-disposition-d2s-input', 'smoke'));
const baselineRoot = resolve(process.env.T3_BASELINE_ARTIFACT_ROOT ?? resolve(here, '..', 'artifacts', 'metaverse-3d-benchmark-disposition-d2s-input', 'baseline'));

export const EXPECTED = Object.freeze({
  contractId: 'METAVERSE_3D_BENCHMARK_TO_DISPOSITION_COMPILER_T3_EVIDENCE_DELTA_SUPPLEMENT_D2S_v1',
  toolId: 'METAVERSE_3D_BENCHMARK_TO_DISPOSITION_COMPILER_v1',
  repository: 'smansfield635-create/smansfield635-create.github.io',
  branch: 'agent/metaverse-3d-benchmark-disposition-compiler-d2s-t3-001',
  parentD2: '209eac49c2db4d532bf1110743cba838deb443a4',
  t2Head: 'beb8bf02a45d8c178c52b91244ad9e077853b23c',
  t3Commit: '3f7b8b9e4a2b4b503d4564d11fa75cf09e152abc',
  d2FactCount: 47,
  d2FactDigest: 'c88e3afa3327eefe6aca7fff544cd4ebe922c63ac47d53a2f5c842b1d718ddb4',
  d2RelationCount: 3,
  d2RelationDigest: '3ee791df987a6894b923e5d137f66b86abfcef89b0467b230288b7ab4b6c52e6',
  d2NormalizationDigest: '0387c1bf54b7568ff58d0bddbef8150c61f57bcd153c3da41df4f20981e2c6b3',
  d2AggregateDigest: 'a314560be0afc58f5facd669b5c317994346e75c9a7ed8552b427afc361e5c79',
  constructionDigest: '60dea2b6b433bcee731a1be0d1f933a51fa51808d5b9f07ad4b7c579e6a9e6fe',
  validationDigest: '77550e769de04f4399704e768497284249daa154e0fbd079e423b9db05231bed',
  laneId: 'FOUR_COMPASS_PRODUCTION_BENCHMARK_CORPUS',
  compassIds: ['MAIN_COMPASS', 'ARCHCOIN_COMPASS', 'SHOWROOM_COMPASS', 'LAWS_COMPASS'],
  homeId: 'WEBSITE_HOME_RECEIVER_CONTROL'
});

export const fail = (code, details = 'NONE') => {
  const error = new Error(code);
  error.code = code;
  error.details = details;
  throw error;
};

const nfc = value => value.normalize('NFC');
export const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [nfc(key), stable(value[key])]))
    : typeof value === 'string' ? nfc(value) : value;
export const digest = value => createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
const byteDigest = bytes => createHash('sha256').update(bytes).digest('hex');
export const exactArray = (actual, expected, code) => {
  if (!Array.isArray(actual) || actual.length !== expected.length || actual.some((v, i) => v !== expected[i])) fail(code, { actual, expected });
};
export const unique = (values, code) => { if (new Set(values).size !== values.length) fail(code, values); };
export const hasNull = value => value === null || (Array.isArray(value) && value.some(hasNull)) || (value && typeof value === 'object' && Object.values(value).some(hasNull));
const readJson = async path => JSON.parse(await readFile(path, 'utf8'));
const fileIdentity = async path => {
  const bytes = await readFile(path);
  return { byteLength: bytes.length, sha256: byteDigest(bytes) };
};

export async function readInputs() {
  const [contract, baseManifest, baseRelations, baseNormalization, baseAggregate, t2Receipt, t3Receipt,
    compassSmoke, homeSmoke, compassBaseline, homeBaseline] = await Promise.all([
    readJson(contractPath),
    readJson(resolve(d2Root, 'canonical-fact-manifest.json')),
    readJson(resolve(d2Root, 'fact-coexistence-index.json')),
    readJson(resolve(d2Root, 'normalization.receipt.json')),
    readJson(resolve(d2Root, 'aggregate.receipt.json')),
    readJson(t2ReceiptPath),
    readJson(t3ReceiptPath),
    readJson(resolve(smokeRoot, 'four-compass-benchmark-tool-smoke.json')),
    readJson(resolve(smokeRoot, 'website-home-receiver-control-smoke.json')),
    readJson(resolve(baselineRoot, 'four-compass-benchmark-tool-baseline.json')),
    readJson(resolve(baselineRoot, 'website-home-receiver-control-baseline.json'))
  ]);
  return { contract, baseManifest, baseRelations, baseNormalization, baseAggregate, t2Receipt, t3Receipt, compassSmoke, homeSmoke, compassBaseline, homeBaseline };
}

export function validateContract(contract) {
  if (contract?.contractId !== EXPECTED.contractId || contract?.toolId !== EXPECTED.toolId || contract?.repository !== EXPECTED.repository) fail('D2S_CONTRACT_IDENTITY_MISMATCH');
  if (contract.compilerBranch !== EXPECTED.branch || contract.checkpoint !== 'D2S' || contract.checkpointTitle !== 'T3_NATIVE_EVIDENCE_DELTA_INTAKE_AND_CANONICAL_FACT_NORMALIZATION_SUPPLEMENT') fail('D2S_CHECKPOINT_IDENTITY_MISMATCH');
  if (contract.parentD2?.headCommit !== EXPECTED.parentD2 || contract.parentD2?.status !== 'PASS_CLOSED' || contract.parentD2?.pullRequestState !== 'OPEN_DRAFT_UNMERGED') fail('D2S_PARENT_D2_MISMATCH');
  if (contract.parentD2?.canonicalFactCount !== EXPECTED.d2FactCount || contract.parentD2?.factManifestSha256 !== EXPECTED.d2FactDigest || contract.parentD2?.coexistenceRelationCount !== EXPECTED.d2RelationCount || contract.parentD2?.coexistenceIndexSha256 !== EXPECTED.d2RelationDigest) fail('D2S_PARENT_D2_DIGEST_MISMATCH');
  if (contract.t2InstrumentOccurrence?.headCommit !== EXPECTED.t2Head || contract.t2InstrumentOccurrence?.constructionDigest !== EXPECTED.constructionDigest || contract.t2InstrumentOccurrence?.browserExecutionPerformed !== false) fail('D2S_T2_OCCURRENCE_MISMATCH');
  if (contract.t3EvidenceOccurrence?.parentT2Commit !== EXPECTED.t2Head || contract.t3EvidenceOccurrence?.receiptCommit !== EXPECTED.t3Commit || contract.t3EvidenceOccurrence?.validationDigest !== EXPECTED.validationDigest) fail('D2S_T3_OCCURRENCE_MISMATCH');
  exactArray(contract.lockedAuthority?.canonicalCompassIds, EXPECTED.compassIds, 'D2S_COMPASS_SET_MISMATCH');
  if (contract.lockedAuthority?.topLevelLaneId !== EXPECTED.laneId || contract.lockedAuthority?.auxiliaryControlId !== EXPECTED.homeId || contract.lockedAuthority?.newTopLevelLaneCreated !== false || contract.lockedAuthority?.crossLaneAggregateAllowed !== false || contract.lockedAuthority?.findingsAreAutomaticDefects !== false) fail('D2S_AUTHORITY_BOUNDARY_MISMATCH');
  exactArray(contract.authorizedCheckpointPaths, [
    '.github/workflows/metaverse-3d-benchmark-disposition-d2s-t3.yml',
    'tools/metaverse-3d-benchmark-disposition-d2s-t3-contract.json',
    'tools/metaverse-3d-benchmark-disposition-d2s-t3-core.mjs',
    'tools/metaverse-3d-benchmark-disposition-d2s-t3-facts.mjs',
    'tools/metaverse-3d-benchmark-disposition-d2s-t3-normalize.mjs',
    'tools/metaverse-3d-benchmark-disposition-d2s-t3-controls.mjs'
  ], 'D2S_PATH_SET_MISMATCH');
  const rules = contract.supplementRules ?? {};
  if (rules.preserveParentD2FactRecordsByteExact !== true || rules.preserveParentD2RelationsByteExact !== true || rules.deltaOnlyNormalization !== true || rules.rediscoverPriorD1OrD2Evidence !== false || rules.genericNullAllowed !== false || rules.lossyTransformationAllowed !== false || rules.findingDefectPromotionAllowed !== false || rules.toolMergeReadinessInferenceAllowed !== false || rules.toolInstallationInferenceAllowed !== false || rules.dimensionClassificationAllowed !== false || rules.evidenceWeightingAllowed !== false || rules.dispositionCompilationAllowed !== false) fail('D2S_SUPPLEMENT_RULE_MISMATCH');
  const claims = contract.claims ?? {};
  if (claims.t3NativeEvidenceDeltaAdmitted !== true || claims.t3CanonicalFactDeltaNormalized !== true || claims.parentD2Rewritten !== false || claims.dimensionClassificationPerformed !== false || claims.evidenceWeightingPerformed !== false || claims.dispositionCompilationPerformed !== false || claims.productFilesChanged !== 0 || claims.mainChanged !== false || claims.mergePerformed !== false || claims.userAcceptanceGranted !== false) fail('D2S_CLAIM_BOUNDARY_MISMATCH');
  if (contract.nextCheckpoint !== 'D3_CANONICAL_BENCHMARK_DIMENSION_CLASSIFICATION') fail('D2S_NEXT_CHECKPOINT_MISMATCH');
  return true;
}

export function validateBaseD2(input) {
  const { baseManifest, baseRelations, baseNormalization, baseAggregate } = input;
  if (baseManifest.canonicalFactCount !== EXPECTED.d2FactCount || baseManifest.factManifestSha256 !== EXPECTED.d2FactDigest || digest(baseManifest.records) !== EXPECTED.d2FactDigest) fail('D2S_BASE_FACT_MANIFEST_MISMATCH');
  if (baseRelations.relationCount !== EXPECTED.d2RelationCount || baseRelations.coexistenceIndexSha256 !== EXPECTED.d2RelationDigest || digest(baseRelations.relations) !== EXPECTED.d2RelationDigest) fail('D2S_BASE_RELATION_INDEX_MISMATCH');
  const { deterministicReceiptSha256: normalizationDigest, ...normalizationBody } = baseNormalization;
  if (normalizationDigest !== EXPECTED.d2NormalizationDigest || digest(normalizationBody) !== normalizationDigest || baseNormalization.status !== 'PASS') fail('D2S_BASE_NORMALIZATION_RECEIPT_MISMATCH');
  const { deterministicReceiptSha256: aggregateDigest, ...aggregateBody } = baseAggregate;
  if (aggregateDigest !== EXPECTED.d2AggregateDigest || digest(aggregateBody) !== aggregateDigest || baseAggregate.status !== 'PASS' || baseAggregate.controlCount !== 28) fail('D2S_BASE_AGGREGATE_RECEIPT_MISMATCH');
  return true;
}

export function validateT2T3Receipts(contract, input) {
  const { t2Receipt, t3Receipt } = input;
  const core = t2Receipt?.constructionDigest?.constructionCore;
  if (!core || core.parentT1Commit !== contract.t2InstrumentOccurrence.parentT1Commit || core.browserExecutionPerformed !== false || core.nextCheckpoint !== 'T3_TOOL_EXECUTION_AND_EVIDENCE_VALIDATION' || t2Receipt.constructionDigest.sha256 !== EXPECTED.constructionDigest || byteDigest(Buffer.from(JSON.stringify(core))) !== EXPECTED.constructionDigest) fail('D2S_T2_CONSTRUCTION_RECEIPT_MISMATCH');
  exactArray(core.compassIds, EXPECTED.compassIds, 'D2S_T2_COMPASS_SET_MISMATCH');
  if (core.auxiliaryControlId !== EXPECTED.homeId || core.sourceRecords?.length !== 5 || core.separateRecords !== true || core.separateSummaries !== true || core.separateFindings !== true || core.separateManifests !== true || core.separateDigests !== true) fail('D2S_T2_SEPARATION_MISMATCH');
  if (t3Receipt?.parentT2Commit !== EXPECTED.t2Head || t3Receipt?.status !== 'PASS_TOOL_EXECUTION_AND_EVIDENCE_VALIDATION' || t3Receipt?.executionTrigger?.headCommit !== EXPECTED.t2Head || t3Receipt?.validationDigest?.sha256 !== EXPECTED.validationDigest || byteDigest(Buffer.from(JSON.stringify(t3Receipt.validationDigest.validationCore))) !== EXPECTED.validationDigest) fail('D2S_T3_VALIDATION_RECEIPT_MISMATCH');
  if (t3Receipt.workflowExecutions?.smoke?.runId !== 30163665632 || t3Receipt.workflowExecutions?.baseline?.runId !== 30163665625 || t3Receipt.workflowExecutions?.smoke?.conclusion !== 'SUCCESS' || t3Receipt.workflowExecutions?.baseline?.conclusion !== 'SUCCESS') fail('D2S_T3_WORKFLOW_EXECUTION_MISMATCH');
  if (t3Receipt.laneSeparationAudit?.status !== 'PASS_EXACT_LANE_SEPARATION' || t3Receipt.laneSeparationAudit?.crossLaneAggregateCreated !== false || t3Receipt.laneSeparationAudit?.retiredActiveIdentitiesObserved?.length !== 0) fail('D2S_T3_LANE_SEPARATION_MISMATCH');
  const authority = t3Receipt.authority ?? {};
  if (authority.toolExecution !== true || authority.toolEvidenceAcceptance !== true || authority.toolInstallation !== false || authority.toolMerge !== false || authority.lawsRepair !== false || authority.productMutation !== false || authority.mainWrite !== false) fail('D2S_T3_AUTHORITY_BOUNDARY_MISMATCH');
  return true;
}

async function verifyManifest(root, manifest) {
  for (const item of manifest) {
    const identity = await fileIdentity(resolve(root, item.filename));
    if (identity.byteLength !== item.byteLength || identity.sha256 !== item.sha256) fail('D2S_SCREENSHOT_IDENTITY_MISMATCH', { item, identity });
  }
  return manifest.length;
}

export async function validateArtifacts(input) {
  const { compassSmoke, homeSmoke, compassBaseline, homeBaseline, t3Receipt } = input;
  const receiptExpectations = [
    [resolve(smokeRoot, 'four-compass-benchmark-tool-smoke.json'), '34733f90bd0088456a0cccc55aa9e25ffba71b975bdd2dd2eda0b23f625bcad9'],
    [resolve(smokeRoot, 'website-home-receiver-control-smoke.json'), '19d4dce11cb659edaefbe19e7f9052ca01ffca24edf7ae76ab6db158029910b0'],
    [resolve(baselineRoot, 'four-compass-benchmark-tool-baseline.json'), '3e18d119da1c6d98593721969c44ed8c0a50aa28dac59d12cdc3e170631d93dd'],
    [resolve(baselineRoot, 'website-home-receiver-control-baseline.json'), '8b777b034abb280782424ec1d5b59f7d5cb639451bbc629e304d25b06ba6373d']
  ];
  for (const [path, expected] of receiptExpectations) if ((await fileIdentity(path)).sha256 !== expected) fail('D2S_T3_ARTIFACT_RECEIPT_BYTE_MISMATCH', path);
  if (compassSmoke.executionCommit !== EXPECTED.t2Head || homeSmoke.executionCommit !== EXPECTED.t2Head || compassBaseline.execution?.commit !== EXPECTED.t2Head || homeBaseline.execution?.commit !== EXPECTED.t2Head) fail('D2S_EXECUTION_HEAD_MISMATCH');
  if (compassSmoke.lane !== 'FOUR_COMPASS_CORPUS' || homeSmoke.lane !== 'AUXILIARY_CONTROL' || compassBaseline.lane !== 'FOUR_COMPASS_CORPUS' || homeBaseline.lane !== 'AUXILIARY_CONTROL') fail('D2S_ARTIFACT_LANE_MISMATCH');
  if (compassSmoke.status !== 'PASS_TOOL_SMOKE' || homeSmoke.status !== 'PASS_TOOL_SMOKE' || compassBaseline.status !== 'PASS_BOUNDED_LANE_BASELINE' || homeBaseline.status !== 'PASS_BOUNDED_LANE_BASELINE') fail('D2S_ARTIFACT_STATUS_MISMATCH');
  if (compassSmoke.assertions.authorityCount !== 4 || compassSmoke.assertions.executedCount !== 4 || compassSmoke.screenshotManifest.length !== 4 || homeSmoke.assertions.authorityCount !== 1 || homeSmoke.assertions.executedCount !== 1 || homeSmoke.screenshotManifest.length !== 1) fail('D2S_SMOKE_COUNT_MISMATCH');
  if (compassBaseline.assertions.scenarioCount !== 8 || compassBaseline.assertions.captureCount !== 48 || compassBaseline.assertions.harnessFailureCount !== 0 || compassBaseline.assertions.findingCount !== 8 || homeBaseline.assertions.scenarioCount !== 2 || homeBaseline.assertions.captureCount !== 8 || homeBaseline.assertions.harnessFailureCount !== 0 || homeBaseline.assertions.findingCount !== 22) fail('D2S_BASELINE_COUNT_MISMATCH');
  if (compassBaseline.findings.some(f => f.authorityId === EXPECTED.homeId) || homeBaseline.findings.some(f => EXPECTED.compassIds.includes(f.authorityId))) fail('D2S_FINDING_LANE_CROSSING');
  if (compassSmoke.assertions.crossLaneAggregateCreated !== false || homeSmoke.assertions.crossLaneAggregateCreated !== false || t3Receipt.laneSeparationAudit.crossLaneAggregateCreated !== false) fail('D2S_CROSS_LANE_AGGREGATE_DETECTED');
  const verified = (await verifyManifest(smokeRoot, compassSmoke.screenshotManifest)) + (await verifyManifest(smokeRoot, homeSmoke.screenshotManifest)) + (await verifyManifest(baselineRoot, compassBaseline.screenshotManifest)) + (await verifyManifest(baselineRoot, homeBaseline.screenshotManifest));
  if (verified !== 61) fail('D2S_SCREENSHOT_TOTAL_MISMATCH', verified);
  return { verifiedScreenshotCount: verified };
}
