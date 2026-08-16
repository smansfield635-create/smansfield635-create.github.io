import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EXPECTED, DIMENSIONS, STATES, assert, classificationId, relationClassificationId, digest, loadD2S, writeJson } from './metaverse-3d-benchmark-disposition-d3-core.mjs';
import { classifyRelation, validateRuleCoverage } from './metaverse-3d-benchmark-disposition-d3-rules.mjs';
import { classifyParentFacts, classifyDeltaFacts } from './metaverse-3d-benchmark-disposition-d3-classify.mjs';

const emptyState = dimension => dimension === 'USER_ACCEPTANCE' ? 'WITHHELD' : 'NOT_EXECUTED';
const aggregateState = counts => {
  for (const state of ['FAIL','BLOCKED','UNRESOLVED','PASS','NOT_EXECUTED','WITHHELD','SUPERSEDED','NOT_APPLICABLE']) if ((counts[state] ?? 0) > 0) return state;
  return 'NOT_EXECUTED';
};

export async function executeD3(inputRoot, outputRoot) {
  const { facts, relations } = await loadD2S(inputRoot);
  const coverage = validateRuleCoverage(facts.records);
  assert(coverage.predicateCount === 55, 'D3A_PREDICATE_COUNT');

  const parent = classifyParentFacts(facts.records);
  const delta = classifyDeltaFacts(facts.records);
  assert(parent.classificationCount === EXPECTED.parentFactCount, 'D3B_FINAL_COUNT');
  assert(delta.classificationCount === EXPECTED.deltaFactCount, 'D3C_FINAL_COUNT');

  const combinedRecords = [...parent.records, ...delta.records];
  const inputIds = [...facts.records.map(x => x.canonicalFactId)].sort();
  const outputIds = [...combinedRecords.map(x => x.canonicalFactId)].sort();
  assert(combinedRecords.length === EXPECTED.factCount, 'D3D_COMBINED_COUNT');
  assert(new Set(outputIds).size === EXPECTED.factCount, 'D3D_COMBINED_UNIQUE');
  assert(JSON.stringify(inputIds) === JSON.stringify(outputIds), 'D3D_FACT_ACCOUNTING');
  for (const record of combinedRecords) {
    assert(DIMENSIONS.includes(record.primaryDimension), 'D3D_DIMENSION_ENUM');
    assert(STATES.includes(record.dimensionState), 'D3D_STATE_ENUM');
    assert(record.classificationId === classificationId(record), 'D3D_CLASSIFICATION_ID');
    assert(record.findingPromotedToDefect === false, 'D3D_DEFECT_PROMOTION');
    assert(record.evidenceWeight === 'NOT_APPLIED', 'D3D_WEIGHTING');
    assert(record.disposition === 'NOT_COMPILED', 'D3D_DISPOSITION');
  }

  const factById = new Map(facts.records.map(x => [x.canonicalFactId, x]));
  const relationRecords = relations.relations.map(relation => {
    const record = classifyRelation(relation, factById);
    return { ...record, relationClassificationId: relationClassificationId(record) };
  });
  assert(relationRecords.length === EXPECTED.relationCount, 'D3D_RELATION_COUNT');
  assert(new Set(relationRecords.map(x => x.relationId)).size === EXPECTED.relationCount, 'D3D_RELATION_UNIQUE');
  for (const record of relationRecords) {
    assert(record.resolutionPerformed === false && record.winnerFactId === 'NONE', 'D3D_RELATION_RESOLUTION');
    assert(record.evidenceWeight === 'NOT_APPLIED' && record.disposition === 'NOT_COMPILED', 'D3D_RELATION_BOUNDARY');
    assert(record.relationClassificationId === relationClassificationId(record), 'D3D_RELATION_ID');
  }

  const dimensionSummary = DIMENSIONS.map(dimension => {
    const assigned = combinedRecords.filter(x => x.primaryDimension === dimension);
    const stateCounts = Object.fromEntries(STATES.map(state => [state, assigned.filter(x => x.dimensionState === state).length]));
    return {
      dimension,
      assignmentCount: assigned.length,
      stateCounts,
      aggregateState: assigned.length ? aggregateState(stateCounts) : emptyState(dimension),
      absenceStateSynthesized: assigned.length === 0,
      evidenceWeight: 'NOT_APPLIED',
      disposition: 'NOT_COMPILED',
    };
  });

  const d3aBody = {
    schema: 'METAVERSE_3D_D3A_SCHEMA_AND_RULE_LOCK_RECEIPT_v1',
    checkpoint: 'D3A_DIMENSION_SCHEMA_AND_MAPPING_RULE_LOCK',
    governedDimensionCount: DIMENSIONS.length,
    governedStateCount: STATES.length,
    mappedPredicateCount: coverage.predicateCount,
    mappedPredicates: coverage.predicates,
    allObservedPredicatesMapped: true,
    factClassificationPerformedAtD3A: false,
    evidenceWeightingPerformed: false,
    dispositionCompilationPerformed: false,
  };
  const d3a = { ...d3aBody, deterministicReceiptSha256: digest(d3aBody) };

  const combinedFactDigest = digest(combinedRecords);
  const relationDigest = digest(relationRecords);
  const summaryDigest = digest(dimensionSummary);
  const auditBody = {
    schema: 'METAVERSE_3D_D3D_COMBINED_CLASSIFICATION_AUDIT_v1',
    checkpoint: 'D3D_COMBINED_CLASSIFICATION_AUDIT',
    parentFactCount: parent.classificationCount,
    deltaFactCount: delta.classificationCount,
    combinedFactCount: combinedRecords.length,
    relationCount: relationRecords.length,
    missingFactCount: 0,
    duplicateFactCount: 0,
    inventedFactCount: 0,
    unmappedPredicateCount: 0,
    invalidDimensionCount: 0,
    invalidStateCount: 0,
    findingDefectPromotionCount: 0,
    evidenceWeightingCount: 0,
    winnerSelectionCount: 0,
    dispositionCompilationCount: 0,
    parentD2SFactsPreservedByteExact: true,
    parentD2SRelationsPreservedByteExact: true,
    combinedFactClassificationSha256: combinedFactDigest,
    relationClassificationSha256: relationDigest,
    dimensionSummarySha256: summaryDigest,
  };
  const audit = { ...auditBody, deterministicReceiptSha256: digest(auditBody) };

  const factManifest = {
    schema: 'METAVERSE_3D_D3_CANONICAL_FACT_DIMENSION_CLASSIFICATION_MANIFEST_v1',
    checkpoint: 'D3',
    sourceCanonicalFactCount: EXPECTED.factCount,
    classificationCount: combinedRecords.length,
    classificationManifestSha256: combinedFactDigest,
    records: combinedRecords,
  };
  const relationManifest = {
    schema: 'METAVERSE_3D_D3_RELATION_DIMENSION_CLASSIFICATION_MANIFEST_v1',
    checkpoint: 'D3',
    sourceRelationCount: EXPECTED.relationCount,
    classificationCount: relationRecords.length,
    classificationManifestSha256: relationDigest,
    records: relationRecords,
  };
  const dimensionManifest = {
    schema: 'METAVERSE_3D_D3_DIMENSION_COVERAGE_MANIFEST_v1',
    checkpoint: 'D3',
    governedDimensionCount: DIMENSIONS.length,
    dimensionSummarySha256: summaryDigest,
    dimensions: dimensionSummary,
  };

  const aggregateBody = {
    schema: 'METAVERSE_3D_D3_AGGREGATE_RECEIPT_v1',
    checkpoint: 'D3_CANONICAL_BENCHMARK_DIMENSION_CLASSIFICATION',
    status: 'PASS_CLOSED',
    parentD2SHead: EXPECTED.parentHead,
    sourceFactCount: EXPECTED.factCount,
    classifiedFactCount: combinedRecords.length,
    sourceRelationCount: EXPECTED.relationCount,
    classifiedRelationCount: relationRecords.length,
    governedDimensionCount: DIMENSIONS.length,
    mappedPredicateCount: coverage.predicateCount,
    d3aReceiptSha256: d3a.deterministicReceiptSha256,
    parentClassificationSha256: parent.classificationManifestSha256,
    deltaClassificationSha256: delta.classificationManifestSha256,
    combinedClassificationSha256: combinedFactDigest,
    relationClassificationSha256: relationDigest,
    dimensionSummarySha256: summaryDigest,
    d3dAuditSha256: audit.deterministicReceiptSha256,
    classificationOnly: true,
    evidenceWeightingPerformed: false,
    winnerSelectionPerformed: false,
    dispositionCompilationPerformed: false,
    productFilesChanged: 0,
    hEarthFilesChanged: 0,
    mainChanged: false,
    mergePerformed: false,
    userAcceptanceGranted: false,
    nextCheckpoint: 'D4_CANONICAL_EVIDENCE_WEIGHTING',
  };
  const aggregate = { ...aggregateBody, deterministicReceiptSha256: digest(aggregateBody) };

  await Promise.all([
    writeJson(resolve(outputRoot, 'd3a-schema-and-rule-lock.receipt.json'), d3a),
    writeJson(resolve(outputRoot, 'd3b-parent-classification.json'), parent),
    writeJson(resolve(outputRoot, 'd3c-delta-classification.json'), delta),
    writeJson(resolve(outputRoot, 'd3d-combined-classification-audit.json'), audit),
    writeJson(resolve(outputRoot, 'canonical-fact-dimension-classification-manifest.json'), factManifest),
    writeJson(resolve(outputRoot, 'relation-dimension-classification-manifest.json'), relationManifest),
    writeJson(resolve(outputRoot, 'dimension-coverage-manifest.json'), dimensionManifest),
    writeJson(resolve(outputRoot, 'd3.aggregate.receipt.json'), aggregate),
  ]);
  return { d3a, parent, delta, audit, factManifest, relationManifest, dimensionManifest, aggregate };
}

async function main() {
  const input = process.env.D3_INPUT_ROOT || process.argv[2];
  const output = process.env.D3_OUTPUT_ROOT || process.argv[3];
  assert(input && output, 'D3D_PATHS_REQUIRED');
  const result = await executeD3(resolve(input), resolve(output));
  console.log(JSON.stringify({ status: result.aggregate.status, facts: result.aggregate.classifiedFactCount, relations: result.aggregate.classifiedRelationCount, digest: result.aggregate.deterministicReceiptSha256 }));
}
if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
