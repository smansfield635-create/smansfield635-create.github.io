import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { digest, readInputs, validateBaseD2, validateContract, validateT2T3Receipts } from './metaverse-3d-benchmark-disposition-d2s-t3-core.mjs';
import { validateDeltaFacts } from './metaverse-3d-benchmark-disposition-d2s-t3-facts.mjs';
import { buildSupplement } from './metaverse-3d-benchmark-disposition-d2s-t3-normalize.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const outputRoot = resolve(process.env.D2S_ARTIFACT_ROOT ?? resolve(here, '..', 'artifacts', 'metaverse-3d-benchmark-disposition-d2s-t3'));
const clone = value => JSON.parse(JSON.stringify(value));

function expectFailure(controlId, fn, expectedCode) {
  try { fn(); } catch (error) {
    if (error.code === expectedCode) return { controlId, status: 'PASS', expectedFailureCode: expectedCode };
    throw new Error(`${controlId}:EXPECTED_${expectedCode}:RECEIVED_${error.code || error.message}`);
  }
  throw new Error(`${controlId}:EXPECTED_FAILURE_NOT_OBSERVED`);
}

async function main() {
  const actual = await buildSupplement();
  const controls = [{ controlId: 'ACTUAL_T3_DELTA_INTAKE_AND_NORMALIZATION', status: 'PASS', deltaFactCount: actual.deltaFacts.length, combinedFactCount: actual.combinedFacts.length, relationCount: actual.deltaRelations.length, receiptSha256: actual.receipt.deterministicReceiptSha256 }];
  const original = await readInputs();

  {
    const c = clone(original.contract); c.parentD2.headCommit = '0'.repeat(40);
    controls.push(expectFailure('PARENT_D2_DRIFT_FAILS_CLOSED', () => validateContract(c), 'D2S_PARENT_D2_MISMATCH'));
  }
  {
    const c = clone(original.contract); c.parentD2.factManifestSha256 = '0'.repeat(64);
    controls.push(expectFailure('PARENT_D2_DIGEST_DRIFT_FAILS_CLOSED', () => validateContract(c), 'D2S_PARENT_D2_DIGEST_MISMATCH'));
  }
  {
    const c = clone(original.contract); c.t2InstrumentOccurrence.headCommit = '0'.repeat(40);
    controls.push(expectFailure('T2_HEAD_DRIFT_FAILS_CLOSED', () => validateContract(c), 'D2S_T2_OCCURRENCE_MISMATCH'));
  }
  {
    const c = clone(original.contract); c.t3EvidenceOccurrence.receiptCommit = '0'.repeat(40);
    controls.push(expectFailure('T3_RECEIPT_COMMIT_DRIFT_FAILS_CLOSED', () => validateContract(c), 'D2S_T3_OCCURRENCE_MISMATCH'));
  }
  {
    const c = clone(original.contract); c.lockedAuthority.canonicalCompassIds.push('UNIVERSAL_COMPASS_PROTOTYPE_CANDIDATE');
    controls.push(expectFailure('FIFTH_COMPASS_REINTRODUCTION_FAILS_CLOSED', () => validateContract(c), 'D2S_COMPASS_SET_MISMATCH'));
  }
  {
    const c = clone(original.contract); c.lockedAuthority.newTopLevelLaneCreated = true;
    controls.push(expectFailure('NEW_TOP_LEVEL_LANE_FAILS_CLOSED', () => validateContract(c), 'D2S_AUTHORITY_BOUNDARY_MISMATCH'));
  }
  {
    const c = clone(original.contract); c.lockedAuthority.findingsAreAutomaticDefects = true;
    controls.push(expectFailure('FINDING_DEFECT_PROMOTION_CONTRACT_FAILS_CLOSED', () => validateContract(c), 'D2S_AUTHORITY_BOUNDARY_MISMATCH'));
  }
  {
    const c = clone(original.contract); c.supplementRules.toolMergeReadinessInferenceAllowed = true;
    controls.push(expectFailure('MERGE_READINESS_INFERENCE_FAILS_CLOSED', () => validateContract(c), 'D2S_SUPPLEMENT_RULE_MISMATCH'));
  }
  {
    const c = clone(original.contract); c.supplementRules.dimensionClassificationAllowed = true;
    controls.push(expectFailure('PREMATURE_D3_CLASSIFICATION_FAILS_CLOSED', () => validateContract(c), 'D2S_SUPPLEMENT_RULE_MISMATCH'));
  }
  {
    const i = clone(original); i.baseManifest.records.pop();
    controls.push(expectFailure('BASE_D2_FACT_REMOVAL_FAILS_CLOSED', () => validateBaseD2(i), 'D2S_BASE_FACT_MANIFEST_MISMATCH'));
  }
  {
    const i = clone(original); i.baseRelations.relations.pop();
    controls.push(expectFailure('BASE_D2_RELATION_REMOVAL_FAILS_CLOSED', () => validateBaseD2(i), 'D2S_BASE_RELATION_INDEX_MISMATCH'));
  }
  {
    const i = clone(original); i.t2Receipt.constructionDigest.constructionCore.browserExecutionPerformed = true;
    controls.push(expectFailure('T2_STATIC_POSTURE_PROMOTION_FAILS_CLOSED', () => validateT2T3Receipts(i.contract, i), 'D2S_T2_CONSTRUCTION_RECEIPT_MISMATCH'));
  }
  {
    const i = clone(original); i.t3Receipt.workflowExecutions.smoke.conclusion = 'FAILURE';
    controls.push(expectFailure('T3_WORKFLOW_FAILURE_FAILS_CLOSED', () => validateT2T3Receipts(i.contract, i), 'D2S_T3_WORKFLOW_EXECUTION_MISMATCH'));
  }
  {
    const i = clone(original); i.t3Receipt.laneSeparationAudit.crossLaneAggregateCreated = true;
    controls.push(expectFailure('CROSS_LANE_AGGREGATE_FAILS_CLOSED', () => validateT2T3Receipts(i.contract, i), 'D2S_T3_LANE_SEPARATION_MISMATCH'));
  }
  {
    const i = clone(original); i.t3Receipt.authority.toolMerge = true;
    controls.push(expectFailure('TOOL_MERGE_AUTHORITY_PROMOTION_FAILS_CLOSED', () => validateT2T3Receipts(i.contract, i), 'D2S_T3_AUTHORITY_BOUNDARY_MISMATCH'));
  }
  {
    const facts = clone(actual.deltaFacts); facts.find(f => f.predicateIdentity === 'PRODUCT_DEFECT_CLASSIFICATION').normalizedValue = 'DEFECT_ESTABLISHED';
    controls.push(expectFailure('OBSERVATION_TO_DEFECT_PROMOTION_FAILS_CLOSED', () => validateDeltaFacts(facts, actual.inventories), 'D2S_LOSSY_TRANSFORMATION'));
  }
  {
    const facts = clone(actual.deltaFacts); facts.find(f => f.predicateIdentity === 'TOOL_MERGE_READINESS_ESTABLISHED').normalizedValue = true;
    controls.push(expectFailure('MERGE_READINESS_FACT_PROMOTION_FAILS_CLOSED', () => validateDeltaFacts(facts, actual.inventories), 'D2S_LOSSY_TRANSFORMATION'));
  }
  {
    const facts = clone(actual.deltaFacts); facts[0].laneId = 'H_EARTH_ENVIRONMENT';
    controls.push(expectFailure('CROSS_PROJECT_LANE_CREATION_FAILS_CLOSED', () => validateDeltaFacts(facts, actual.inventories), 'D2S_NEW_TOP_LEVEL_LANE_PROHIBITED'));
  }
  {
    const facts = clone(actual.deltaFacts); facts[0].originalValue = null;
    controls.push(expectFailure('GENERIC_NULL_FAILS_CLOSED', () => validateDeltaFacts(facts, actual.inventories), 'D2S_GENERIC_NULL_PROHIBITED'));
  }
  if (actual.receipt.claims.parentD2FactsPreservedByteExact !== true || actual.receipt.claims.parentD2RelationsPreservedByteExact !== true) throw new Error('D2S_PARENT_BYTES_NOT_PRESERVED');
  controls.push({ controlId: 'PARENT_D2_FACTS_AND_RELATIONS_BYTE_EXACT', status: 'PASS' });
  if (actual.receipt.t3EvidenceOccurrence.verifiedScreenshotCount !== 61) throw new Error('D2S_SCREENSHOT_CUSTODY_MISMATCH');
  controls.push({ controlId: 'ALL_61_SCREENSHOT_IDENTITIES_VERIFIED', status: 'PASS' });
  const repeated = await buildSupplement();
  if (digest(repeated.deltaFacts) !== digest(actual.deltaFacts) || repeated.receipt.deterministicReceiptSha256 !== actual.receipt.deterministicReceiptSha256) throw new Error('D2S_DETERMINISTIC_REPEAT_MISMATCH');
  controls.push({ controlId: 'DETERMINISTIC_REPEAT_DIGEST', status: 'PASS', receiptSha256: repeated.receipt.deterministicReceiptSha256 });
  if (controls.some(c => c.status !== 'PASS')) throw new Error('D2S_CONTROL_FAILURE');

  const sourceInventory = { schema: 'METAVERSE_3D_BENCHMARK_DISPOSITION_D2S_SOURCE_DELTA_INVENTORY_v1', checkpoint: 'D2S', sourceRecordCount: actual.inventories.sourceRecords.length, sourceInventorySha256: digest(actual.inventories.sourceRecords), records: actual.inventories.sourceRecords };
  const evidenceInventory = { schema: 'METAVERSE_3D_BENCHMARK_DISPOSITION_D2S_NATIVE_EVIDENCE_DELTA_INVENTORY_v1', checkpoint: 'D2S', nativeEvidenceRecordCount: actual.inventories.nativeEvidenceRecords.length, nativeEvidenceInventorySha256: digest(actual.inventories.nativeEvidenceRecords), records: actual.inventories.nativeEvidenceRecords };
  const deltaManifest = { schema: 'METAVERSE_3D_BENCHMARK_DISPOSITION_D2S_CANONICAL_FACT_DELTA_MANIFEST_v1', checkpoint: 'D2S', canonicalFactCount: actual.deltaFacts.length, factManifestSha256: digest(actual.deltaFacts), records: actual.deltaFacts };
  const combinedManifest = { schema: 'METAVERSE_3D_BENCHMARK_DISPOSITION_D2S_COMBINED_CANONICAL_FACT_MANIFEST_v1', checkpoint: 'D2S', parentD2CanonicalFactCount: 47, deltaCanonicalFactCount: actual.deltaFacts.length, combinedCanonicalFactCount: actual.combinedFacts.length, combinedFactManifestSha256: digest(actual.combinedFacts), records: actual.combinedFacts };
  const combinedRelations = { schema: 'METAVERSE_3D_BENCHMARK_DISPOSITION_D2S_COMBINED_FACT_COEXISTENCE_INDEX_v1', checkpoint: 'D2S', parentD2RelationCount: 3, deltaRelationCount: actual.deltaRelations.length, combinedRelationCount: actual.combinedRelations.length, combinedCoexistenceIndexSha256: digest(actual.combinedRelations), relations: actual.combinedRelations };
  const body = { schema: 'METAVERSE_3D_BENCHMARK_DISPOSITION_D2S_CONTROL_RECEIPT_v1', checkpoint: 'D2S', status: 'PASS', controlCount: controls.length, passedControlCount: controls.length, controls, supplementReceipt: actual.receipt, claims: actual.receipt.claims };
  const aggregate = { ...body, deterministicReceiptSha256: digest(body) };

  await mkdir(outputRoot, { recursive: true });
  const write = (name, value) => writeFile(resolve(outputRoot, name), `${JSON.stringify(value, null, 2)}\n`);
  await Promise.all([
    write('source-delta-inventory.json', sourceInventory), write('native-evidence-delta-inventory.json', evidenceInventory),
    write('canonical-fact-delta-manifest.json', deltaManifest), write('combined-canonical-fact-manifest.json', combinedManifest),
    write('combined-fact-coexistence-index.json', combinedRelations), write('supplement.receipt.json', actual.receipt),
    write('aggregate.receipt.json', aggregate)
  ]);
  process.stdout.write(`${JSON.stringify({ status: 'PASS', controlCount: controls.length, sourceDeltaRecordCount: sourceInventory.sourceRecordCount, nativeEvidenceDeltaRecordCount: evidenceInventory.nativeEvidenceRecordCount, deltaCanonicalFactCount: deltaManifest.canonicalFactCount, combinedCanonicalFactCount: combinedManifest.combinedCanonicalFactCount, deltaRelationCount: actual.deltaRelations.length, deterministicReceiptSha256: aggregate.deterministicReceiptSha256 }, null, 2)}\n`);
}

await main();
