import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EXPECTED, digest, readInputs, validateContract, validateBaseD2, validateT2T3Receipts, validateArtifacts } from './metaverse-3d-benchmark-disposition-d2s-t3-core.mjs';
import { buildInventories, buildDeltaFacts, buildDeltaRelations } from './metaverse-3d-benchmark-disposition-d2s-t3-facts.mjs';

export async function buildSupplement() {
  const input = await readInputs();
  validateContract(input.contract);
  validateBaseD2(input);
  validateT2T3Receipts(input.contract, input);
  const artifactValidation = await validateArtifacts(input);
  const inventories = buildInventories(input.contract, input);
  const deltaFacts = buildDeltaFacts(input.contract, input, inventories);
  const deltaRelations = buildDeltaRelations(deltaFacts);
  const combinedFacts = [...input.baseManifest.records, ...deltaFacts];
  const combinedRelations = [...input.baseRelations.relations, ...deltaRelations];
  const receiptBody = {
    schema: 'METAVERSE_3D_BENCHMARK_DISPOSITION_D2S_T3_SUPPLEMENT_RECEIPT_v1', checkpoint: 'D2S', status: 'PASS',
    contractId: input.contract.contractId, toolId: input.contract.toolId,
    parentD2: { headCommit: EXPECTED.parentD2, canonicalFactCount: EXPECTED.d2FactCount, factManifestSha256: EXPECTED.d2FactDigest, coexistenceRelationCount: EXPECTED.d2RelationCount, coexistenceIndexSha256: EXPECTED.d2RelationDigest },
    t2InstrumentOccurrence: { headCommit: EXPECTED.t2Head, constructionDigest: EXPECTED.constructionDigest, sourceRecordCount: inventories.sourceRecords.length },
    t3EvidenceOccurrence: { receiptCommit: EXPECTED.t3Commit, validationDigest: EXPECTED.validationDigest, nativeEvidenceRecordCount: inventories.nativeEvidenceRecords.length, verifiedScreenshotCount: artifactValidation.verifiedScreenshotCount },
    parentD2FactCount: input.baseManifest.records.length,
    deltaCanonicalFactCount: deltaFacts.length,
    combinedCanonicalFactCount: combinedFacts.length,
    parentD2FactManifestSha256: EXPECTED.d2FactDigest,
    deltaFactManifestSha256: digest(deltaFacts),
    combinedFactManifestSha256: digest(combinedFacts),
    parentD2RelationCount: input.baseRelations.relations.length,
    deltaCoexistenceRelationCount: deltaRelations.length,
    combinedCoexistenceRelationCount: combinedRelations.length,
    parentD2CoexistenceIndexSha256: EXPECTED.d2RelationDigest,
    deltaCoexistenceIndexSha256: digest(deltaRelations),
    combinedCoexistenceIndexSha256: digest(combinedRelations),
    claims: {
      parentD2FactsPreservedByteExact: JSON.stringify(combinedFacts.slice(0, EXPECTED.d2FactCount)) === JSON.stringify(input.baseManifest.records),
      parentD2RelationsPreservedByteExact: JSON.stringify(combinedRelations.slice(0, EXPECTED.d2RelationCount)) === JSON.stringify(input.baseRelations.relations),
      t3NativeEvidenceDeltaAdmitted: true, t3CanonicalFactDeltaNormalized: true,
      newTopLevelLaneCreated: false, findingsPromotedToDefects: false, toolMergeReadinessEstablished: false,
      dimensionClassificationPerformed: false, evidenceWeightingPerformed: false, dispositionCompilationPerformed: false,
      productFilesChanged: 0, mainChanged: false, mergePerformed: false, userAcceptanceGranted: false
    },
    nextCheckpoint: 'D3_CANONICAL_BENCHMARK_DIMENSION_CLASSIFICATION'
  };
  return {
    input, inventories, deltaFacts, deltaRelations, combinedFacts, combinedRelations,
    receipt: { ...receiptBody, deterministicReceiptSha256: digest(receiptBody) }
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await buildSupplement();
  process.stdout.write(`${JSON.stringify({ status: result.receipt.status, deltaCanonicalFactCount: result.deltaFacts.length, combinedCanonicalFactCount: result.combinedFacts.length, deltaCoexistenceRelationCount: result.deltaRelations.length, deterministicReceiptSha256: result.receipt.deterministicReceiptSha256 }, null, 2)}\n`);
}
