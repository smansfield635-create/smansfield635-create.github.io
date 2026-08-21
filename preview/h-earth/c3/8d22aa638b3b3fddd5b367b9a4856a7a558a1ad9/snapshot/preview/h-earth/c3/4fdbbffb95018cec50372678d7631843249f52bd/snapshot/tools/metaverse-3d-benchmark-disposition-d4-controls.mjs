import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EXPECTED, assert, digest, loadD3, readJson, unique, writeJson } from './metaverse-3d-benchmark-disposition-d4-core.mjs';
import { buildFactWeights, buildRelationWeights } from './metaverse-3d-benchmark-disposition-d4-weight.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(here, '..');
const d3Root = process.env.D3_ARTIFACT_ROOT ?? resolve(repoRoot, '../artifacts/metaverse-3d-benchmark-disposition-d3-input');
const outRoot = process.env.D4_ARTIFACT_ROOT ?? resolve(repoRoot, '../artifacts/metaverse-3d-benchmark-disposition-d4');
const contractPath = resolve(here, 'metaverse-3d-benchmark-disposition-d4-contract.json');

const bandOrder = EXPECTED.bands;
const strongest = records => {
  for (const band of bandOrder) if (records.some(record => record.strengthBand === band)) return band;
  return 'W0_NON_WEIGHTABLE';
};
const countsFor = records => Object.fromEntries(bandOrder.map(band => [band, records.filter(record => record.strengthBand === band).length]));

const controls = [];
const check = (id, condition) => {
  controls.push({ controlId: id, passed: Boolean(condition) });
  assert(condition, `D4_CONTROL_FAILED:${id}`);
};

const d3 = await loadD3(d3Root);
const contract = await readJson(contractPath);
const facts = await buildFactWeights();
const relations = await buildRelationWeights();

check('D4_01_PARENT_FACT_COUNT', d3.facts.classificationCount === EXPECTED.factCount);
check('D4_02_PARENT_RELATION_COUNT', d3.relations.classificationCount === EXPECTED.relationCount);
check('D4_03_PARENT_DIMENSION_COUNT', d3.dimensions.governedDimensionCount === EXPECTED.dimensionCount);
check('D4_04_FACT_WEIGHT_COUNT', facts.weightRecordCount === EXPECTED.factCount);
check('D4_05_FACT_IDENTITY_UNIQUE', unique(facts.records.map(record => record.canonicalFactId)));
check('D4_06_WEIGHT_IDENTITY_UNIQUE', unique(facts.records.map(record => record.weightId)));
check('D4_07_RELATION_WEIGHT_COUNT', relations.weightRecordCount === EXPECTED.relationCount);
check('D4_08_RELATION_IDENTITY_UNIQUE', unique(relations.records.map(record => record.relationId)));
check('D4_09_RELATION_WEIGHT_IDENTITY_UNIQUE', unique(relations.records.map(record => record.relationWeightId)));
check('D4_10_NO_SCALAR_SCORE', facts.records.every(record => !Object.hasOwn(record, 'score') && !Object.hasOwn(record, 'scalarScore')));
check('D4_11_ALL_VECTORS_COMPLETE', facts.records.every(record => record.precedenceVector.length === 6));
check('D4_12_ALL_BANDS_GOVERNED', facts.records.every(record => EXPECTED.bands.includes(record.strengthBand)));
check('D4_13_DIMENSION_STATE_UNCHANGED', facts.records.every(record => record.dimensionStateChanged === false));
check('D4_14_NO_WINNER_SELECTION', facts.records.every(record => record.winnerSelected === false));
check('D4_15_NO_DISPOSITION', facts.records.every(record => record.disposition === 'NOT_COMPILED'));
check('D4_16_RELATIONS_UNRESOLVED', relations.records.every(record => record.resolutionPerformed === false && record.winnerFactId === 'NONE'));
check('D4_17_PARENT_FACTS_PRESERVED', facts.records.every(record => d3.facts.records.some(parent => parent.canonicalFactId === record.canonicalFactId && parent.classificationId === record.classificationId && parent.dimensionState === record.dimensionState)));
check('D4_18_PARENT_RELATIONS_PRESERVED', relations.records.every(record => d3.relations.records.some(parent => parent.relationId === record.relationId && parent.relationClassificationId === record.relationClassificationId && parent.dimensionState === record.dimensionState)));

const dimensionRecords = d3.dimensions.dimensions.map(dimension => {
  const factRecords = facts.records.filter(record => record.primaryDimension === dimension.dimension);
  const relationRecords = relations.records.filter(record => record.primaryDimension === dimension.dimension);
  const supporting = factRecords.filter(record => record.evidenceOrientation === 'SUPPORTING_STATE');
  const contrary = factRecords.filter(record => record.evidenceOrientation === 'CONTRARY_STATE');
  const unresolved = factRecords.filter(record => record.evidenceOrientation === 'UNRESOLVED_STATE');
  const nonWeightable = factRecords.filter(record => record.evidenceOrientation === 'NON_WEIGHTABLE' || record.evidenceOrientation === 'CONTEXT_ONLY');
  const evidenceStrengthPosture =
    dimension.aggregateState === 'NOT_EXECUTED' || dimension.aggregateState === 'WITHHELD'
      ? 'NON_WEIGHTABLE_ABSENCE'
      : dimension.aggregateState === 'UNRESOLVED'
        ? 'UNRESOLVED_WITH_WEIGHTED_EVIDENCE'
        : strongest(factRecords) === 'W4_DIRECT_EXECUTED_EXACT'
          ? 'DIRECT_EXECUTED_EVIDENCE_PRESENT'
          : strongest(factRecords) === 'W3_DIRECT_EXACT'
            ? 'DIRECT_EXACT_EVIDENCE_PRESENT'
            : strongest(factRecords) === 'W2_DETERMINISTIC_DERIVED'
              ? 'DETERMINISTIC_DERIVED_EVIDENCE_PRESENT'
              : 'CONTEXTUAL_OR_NON_WEIGHTABLE';
  return {
    dimension: dimension.dimension,
    aggregateState: dimension.aggregateState,
    aggregateStatePreserved: true,
    absenceStateSynthesized: dimension.absenceStateSynthesized,
    factWeightRecordCount: factRecords.length,
    relationWeightRecordCount: relationRecords.length,
    factBandCounts: countsFor(factRecords),
    relationBandCounts: countsFor(relationRecords),
    strongestApplicableFactBand: strongest(factRecords),
    strongestApplicableRelationBand: strongest(relationRecords),
    strongestSupportingBand: strongest(supporting),
    strongestContraryBand: strongest(contrary),
    strongestUnresolvedBand: strongest(unresolved),
    nonWeightableFactCount: nonWeightable.length,
    supportingAndContraryPreservedSeparately: true,
    evidenceStrengthPosture,
    winnerSelected: false,
    disposition: 'NOT_COMPILED'
  };
});

check('D4_19_DIMENSIONS_COMPLETE', dimensionRecords.length === EXPECTED.dimensionCount && unique(dimensionRecords.map(record => record.dimension)));
check('D4_20_DIMENSION_STATES_PRESERVED', dimensionRecords.every(record => d3.dimensions.dimensions.some(parent => parent.dimension === record.dimension && parent.aggregateState === record.aggregateState)));
check('D4_21_NO_DIMENSION_WINNER', dimensionRecords.every(record => record.winnerSelected === false));
check('D4_22_NO_DIMENSION_DISPOSITION', dimensionRecords.every(record => record.disposition === 'NOT_COMPILED'));
check('D4_23_COUNTS_RECONCILE', dimensionRecords.reduce((sum, record) => sum + record.factWeightRecordCount, 0) === EXPECTED.factCount);
check('D4_24_RELATION_COUNTS_RECONCILE', dimensionRecords.reduce((sum, record) => sum + record.relationWeightRecordCount, 0) === EXPECTED.relationCount);

const dimensionManifest = {
  schema: 'METAVERSE_3D_D4C_DIMENSION_EVIDENCE_STRENGTH_MANIFEST_v1',
  checkpoint: 'D4C_RELATION_AND_DIMENSION_STRENGTH_COMPILATION',
  governedDimensionCount: dimensionRecords.length,
  dimensionStrengthManifestSha256: digest(dimensionRecords),
  dimensions: dimensionRecords
};
await writeJson(resolve(outRoot, 'dimension-evidence-strength-manifest.json'), dimensionManifest);

const bandTotals = countsFor(facts.records);
const d4aBody = {
  schema: 'METAVERSE_3D_D4A_WEIGHTING_RULE_LOCK_RECEIPT_v1',
  checkpoint: 'D4A_EVIDENCE_WEIGHTING_AUTHORITY_AND_RULE_LOCK',
  contractSemanticSha256: digest(contract),
  ordinalBandCount: contract.ordinalEvidenceStrengthBands.length,
  precedenceComponentCount: contract.deterministicPrecedenceVector.componentsInOrder.length,
  scalarScoreAllowed: contract.deterministicPrecedenceVector.scalarScoreAllowed,
  canonicalFactWeightingPerformedAtD4A: false,
  relationWeightingPerformedAtD4A: false,
  dispositionCompilationPerformed: false
};
const d4aReceipt = { ...d4aBody, deterministicReceiptSha256: digest(d4aBody) };
await writeJson(resolve(outRoot, 'd4a-rule-lock.receipt.json'), d4aReceipt);

const d4bBody = {
  schema: 'METAVERSE_3D_D4B_FACT_WEIGHTING_RECEIPT_v1',
  checkpoint: 'D4B_CANONICAL_FACT_WEIGHT_ASSIGNMENT',
  sourceClassificationCount: EXPECTED.factCount,
  weightedFactCount: facts.weightRecordCount,
  factWeightManifestSha256: facts.weightManifestSha256,
  strengthBandTotals: bandTotals,
  missingFactCount: 0,
  duplicateFactCount: 0,
  dimensionStateChangeCount: 0,
  winnerSelectionCount: 0,
  dispositionCompilationCount: 0
};
const d4bReceipt = { ...d4bBody, deterministicReceiptSha256: digest(d4bBody) };
await writeJson(resolve(outRoot, 'd4b-fact-weighting.receipt.json'), d4bReceipt);

const d4cBody = {
  schema: 'METAVERSE_3D_D4C_RELATION_AND_DIMENSION_STRENGTH_RECEIPT_v1',
  checkpoint: 'D4C_RELATION_AND_DIMENSION_STRENGTH_COMPILATION',
  weightedRelationCount: relations.weightRecordCount,
  relationWeightManifestSha256: relations.relationWeightManifestSha256,
  governedDimensionCount: dimensionRecords.length,
  dimensionStrengthManifestSha256: dimensionManifest.dimensionStrengthManifestSha256,
  relationResolutionCount: 0,
  winnerSelectionCount: 0,
  dispositionCompilationCount: 0
};
const d4cReceipt = { ...d4cBody, deterministicReceiptSha256: digest(d4cBody) };
await writeJson(resolve(outRoot, 'd4c-relation-and-dimension-strength.receipt.json'), d4cReceipt);

const auditBody = {
  schema: 'METAVERSE_3D_D4D_COMBINED_WEIGHTING_AUDIT_v1',
  checkpoint: 'D4D_COMBINED_WEIGHTING_AUDIT_AND_CLOSURE',
  parentD3Head: EXPECTED.parentD3Head,
  sourceFactCount: EXPECTED.factCount,
  weightedFactCount: facts.weightRecordCount,
  sourceRelationCount: EXPECTED.relationCount,
  weightedRelationCount: relations.weightRecordCount,
  governedDimensionCount: dimensionRecords.length,
  missingFactCount: 0,
  duplicateFactCount: 0,
  inventedFactCount: 0,
  missingRelationCount: 0,
  duplicateRelationCount: 0,
  inventedRelationCount: 0,
  scalarScoreCount: 0,
  dimensionStateChangeCount: 0,
  contradictionResolutionCount: 0,
  winnerSelectionCount: 0,
  dispositionCompilationCount: 0,
  productFilesChanged: 0,
  hEarthFilesChanged: 0,
  mainChanged: false,
  mergePerformed: false,
  userAcceptanceGranted: false,
  factWeightManifestSha256: facts.weightManifestSha256,
  relationWeightManifestSha256: relations.relationWeightManifestSha256,
  dimensionStrengthManifestSha256: dimensionManifest.dimensionStrengthManifestSha256,
  controlCount: controls.length,
  passedControlCount: controls.filter(control => control.passed).length,
  failedControlCount: controls.filter(control => !control.passed).length
};
const audit = { ...auditBody, deterministicReceiptSha256: digest(auditBody) };
await writeJson(resolve(outRoot, 'd4d-combined-weighting-audit.json'), audit);

const aggregateBody = {
  schema: 'METAVERSE_3D_D4_AGGREGATE_RECEIPT_v1',
  checkpoint: 'D4_CANONICAL_EVIDENCE_WEIGHTING',
  status: 'PASS_CLOSED',
  parentD3Head: EXPECTED.parentD3Head,
  weightedFactCount: facts.weightRecordCount,
  weightedRelationCount: relations.weightRecordCount,
  governedDimensionCount: dimensionRecords.length,
  d4aReceiptSha256: d4aReceipt.deterministicReceiptSha256,
  factWeightManifestSha256: facts.weightManifestSha256,
  d4bReceiptSha256: d4bReceipt.deterministicReceiptSha256,
  relationWeightManifestSha256: relations.relationWeightManifestSha256,
  dimensionStrengthManifestSha256: dimensionManifest.dimensionStrengthManifestSha256,
  d4cReceiptSha256: d4cReceipt.deterministicReceiptSha256,
  d4dAuditSha256: audit.deterministicReceiptSha256,
  evidenceWeightingPerformed: true,
  dimensionStatesChanged: false,
  winnerSelectionPerformed: false,
  contradictionResolutionPerformed: false,
  dispositionCompilationPerformed: false,
  productFilesChanged: 0,
  hEarthFilesChanged: 0,
  mainChanged: false,
  mergePerformed: false,
  userAcceptanceGranted: false,
  nextCheckpoint: 'D5_DISPOSITION_COMPILATION_AND_COMPILER_CLOSURE'
};
const aggregate = { ...aggregateBody, deterministicReceiptSha256: digest(aggregateBody) };
await writeJson(resolve(outRoot, 'd4.aggregate.receipt.json'), aggregate);

console.log(JSON.stringify({
  status: aggregate.status,
  factWeights: facts.weightRecordCount,
  relationWeights: relations.weightRecordCount,
  dimensions: dimensionRecords.length,
  factWeightSha256: facts.weightManifestSha256,
  relationWeightSha256: relations.relationWeightManifestSha256,
  dimensionStrengthSha256: dimensionManifest.dimensionStrengthManifestSha256,
  aggregateReceiptSha256: aggregate.deterministicReceiptSha256,
  controls: `${audit.passedControlCount}/${audit.controlCount}`
}));
