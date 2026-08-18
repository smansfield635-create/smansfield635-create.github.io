import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildCanonicalFacts,
  buildCoexistenceIndex,
  buildD2Normalization,
  digest,
  readD1Package,
  readD2Contract,
  validateCanonicalFacts,
  validateCoexistenceIndex,
  validateD1Package,
  validateD2Contract
} from './metaverse-3d-benchmark-disposition-d2-normalize.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const outputRoot = process.env.D2_ARTIFACT_ROOT
  ? resolve(process.env.D2_ARTIFACT_ROOT)
  : resolve(here, '..', 'artifacts', 'metaverse-3d-benchmark-disposition-d2');

const clone = value => JSON.parse(JSON.stringify(value));

function expectFailure(controlId, expectedCode, operation) {
  try {
    operation();
  } catch (error) {
    if (error.code === expectedCode) {
      return { controlId, status: 'PASS', expectedFailureCode: expectedCode };
    }
    throw new Error(`${controlId}:EXPECTED_${expectedCode}:RECEIVED_${error.code || error.message}`);
  }
  throw new Error(`${controlId}:EXPECTED_FAILURE_NOT_OBSERVED`);
}

async function main() {
  const contract = await readD2Contract();
  const pkg = await readD1Package();
  const controls = [];

  const actual = buildD2Normalization(contract, pkg);
  controls.push({
    controlId: 'ACTUAL_CANONICAL_EVIDENCE_FACT_NORMALIZATION',
    status: actual.normalizationReceipt.status,
    canonicalFactCount: actual.factManifest.canonicalFactCount,
    relationCount: actual.coexistenceIndex.relationCount,
    receiptSha256: actual.normalizationReceipt.deterministicReceiptSha256
  });

  {
    const candidate = clone(contract);
    candidate.parentD1.headCommit = '0000000000000000000000000000000000000000';
    controls.push(expectFailure('D1_PARENT_IDENTITY_DRIFT_FAILS_CLOSED', 'D2_PARENT_D1_IDENTITY_MISMATCH', () => validateD2Contract(candidate)));
  }
  {
    const candidate = clone(contract);
    candidate.parentD1.artifactSha256 = '0'.repeat(64);
    controls.push(expectFailure('D1_ARTIFACT_CUSTODY_DRIFT_FAILS_CLOSED', 'D2_D1_PACKAGE_CUSTODY_MISMATCH', () => validateD2Contract(candidate)));
  }
  {
    const candidate = clone(contract);
    candidate.lockedInputs.laneIds.pop();
    controls.push(expectFailure('MISSING_EVIDENCE_LANE_FAILS_CLOSED', 'D2_LANE_SET_MISMATCH', () => validateD2Contract(candidate)));
  }
  {
    const candidate = clone(contract);
    candidate.lockedInputs.canonicalCompassIds.push('UNIVERSAL_COMPASS_PROTOTYPE_CANDIDATE');
    controls.push(expectFailure('PROTOTYPE_AS_FIFTH_COMPASS_FAILS_CLOSED', 'D2_COMPASS_SET_MISMATCH', () => validateD2Contract(candidate)));
  }
  {
    const candidate = clone(contract);
    candidate.lockedInputs.canonicalCompassIds[0] = 'WEBSITE_HOME_RECEIVER_CONTROL';
    controls.push(expectFailure('HOME_AS_COMPASS_FAILS_CLOSED', 'D2_COMPASS_SET_MISMATCH', () => validateD2Contract(candidate)));
  }
  {
    const candidate = clone(contract);
    candidate.lockedInputs.currentPrototypeExecutionStatus = 'EXECUTED_PASS';
    controls.push(expectFailure('CURRENT_PROTOTYPE_PASS_PROMOTION_FAILS_CLOSED', 'D2_TEMPORAL_EXECUTION_LOCK_MISMATCH', () => validateD2Contract(candidate)));
  }
  {
    const candidate = clone(contract);
    candidate.lockedInputs.historicalPrototypeExecutionAppliesToCurrent = true;
    controls.push(expectFailure('HISTORICAL_PASS_PROJECTION_FAILS_CLOSED', 'D2_TEMPORAL_EXECUTION_LOCK_MISMATCH', () => validateD2Contract(candidate)));
  }
  {
    const candidate = clone(contract);
    candidate.lockedInputs.awarenessCurrentAuthority = true;
    controls.push(expectFailure('AWARENESS_CURRENT_PROMOTION_FAILS_CLOSED', 'D2_TEMPORAL_EXECUTION_LOCK_MISMATCH', () => validateD2Contract(candidate)));
  }
  {
    const candidate = clone(contract);
    candidate.lockedInputs.awarenessInspectedRepositoryCommit = candidate.lockedInputs.awarenessPackageOccurrenceCommit;
    controls.push(expectFailure('AWARENESS_COMMIT_CONFLATION_FAILS_CLOSED', 'D2_AWARENESS_COMMIT_CONFLATION', () => validateD2Contract(candidate)));
  }
  {
    const candidate = clone(contract);
    candidate.normalizationRules.genericNullAllowed = true;
    controls.push(expectFailure('GENERIC_NULL_SEMANTICS_FAILS_CLOSED', 'D2_NORMALIZATION_RULE_MISMATCH', () => validateD2Contract(candidate)));
  }
  {
    const candidate = clone(contract);
    candidate.normalizationRules.lossyTransformationAllowed = true;
    controls.push(expectFailure('LOSSY_NORMALIZATION_AUTHORITY_FAILS_CLOSED', 'D2_NORMALIZATION_RULE_MISMATCH', () => validateD2Contract(candidate)));
  }
  {
    const candidate = clone(contract);
    candidate.coexistenceRules.winnerSelection = true;
    controls.push(expectFailure('WINNER_SELECTION_AUTHORITY_FAILS_CLOSED', 'D2_COEXISTENCE_RULE_MISMATCH', () => validateD2Contract(candidate)));
  }
  {
    const candidate = clone(contract);
    candidate.claims.dimensionClassificationPerformed = true;
    controls.push(expectFailure('DIMENSION_CLASSIFICATION_BOUNDARY_FAILS_CLOSED', 'D2_BOUNDARY_CLAIMS_MISMATCH', () => validateD2Contract(candidate)));
  }
  {
    const candidate = clone(contract);
    candidate.claims.dispositionCompilationPerformed = true;
    controls.push(expectFailure('DISPOSITION_COMPILATION_BOUNDARY_FAILS_CLOSED', 'D2_BOUNDARY_CLAIMS_MISMATCH', () => validateD2Contract(candidate)));
  }
  {
    const candidate = clone(contract);
    candidate.authorizedCheckpointPaths.push('prototypes/universal-compass/index.js');
    controls.push(expectFailure('PRODUCT_PATH_SCOPE_EXPANSION_FAILS_CLOSED', 'D2_AUTHORIZED_PATH_SET_MISMATCH', () => validateD2Contract(candidate)));
  }
  {
    const candidate = clone(pkg);
    candidate.sourceManifest.records.pop();
    controls.push(expectFailure('INCOMPLETE_D1_SOURCE_PACKAGE_FAILS_CLOSED', 'D2_D1_SOURCE_MANIFEST_MISMATCH', () => validateD1Package(contract, candidate)));
  }
  {
    const candidate = clone(pkg);
    candidate.nativeEvidenceInventory.records.pop();
    controls.push(expectFailure('INCOMPLETE_D1_EVIDENCE_PACKAGE_FAILS_CLOSED', 'D2_D1_NATIVE_EVIDENCE_INVENTORY_MISMATCH', () => validateD1Package(contract, candidate)));
  }
  {
    const candidate = clone(pkg);
    candidate.intakeReceipt.claims.universalCompassCurrentBrowserPassEstablished = true;
    const { deterministicReceiptSha256: ignored, ...body } = candidate.intakeReceipt;
    candidate.intakeReceipt.deterministicReceiptSha256 = digest(body);
    controls.push(expectFailure('D1_CURRENT_PASS_CLAIM_MUTATION_FAILS_CLOSED', 'D2_D1_INTAKE_RECEIPT_MISMATCH', () => validateD1Package(contract, candidate)));
  }

  const facts = buildCanonicalFacts(contract, pkg);
  const relations = buildCoexistenceIndex(contract, facts);

  {
    const candidate = clone(facts);
    candidate[1].canonicalFactId = candidate[0].canonicalFactId;
    controls.push(expectFailure('CANONICAL_FACT_ID_COLLISION_FAILS_CLOSED', 'D2_CANONICAL_FACT_ID_COLLISION', () => validateCanonicalFacts(contract, pkg, candidate)));
  }
  {
    const candidate = clone(facts);
    candidate[0].unit = null;
    controls.push(expectFailure('GENERIC_NULL_FACT_VALUE_FAILS_CLOSED', 'D2_GENERIC_NULL_PROHIBITED', () => validateCanonicalFacts(contract, pkg, candidate)));
  }
  {
    const candidate = clone(facts);
    candidate[0].transformationTrace.lossPosture = 'LOSSY_BUT_DECLARED';
    controls.push(expectFailure('LOSSY_FACT_TRANSFORMATION_FAILS_CLOSED', 'D2_LOSSY_OR_NONREVERSIBLE_TRANSFORMATION', () => validateCanonicalFacts(contract, pkg, candidate)));
  }
  {
    const candidate = clone(facts);
    const current = candidate.find(fact => fact.predicateIdentity === 'CURRENT_SOURCE_EXECUTION_POSTURE');
    current.normalizedValue = 'EXECUTED_PASS';
    current.originalValue = 'EXECUTED_PASS';
    current.executionPosture = 'EXECUTED_PASS';
    controls.push(expectFailure('NORMALIZED_CURRENT_PROTOTYPE_PASS_FAILS_CLOSED', 'D2_CANONICAL_FACT_ID_MISMATCH', () => validateCanonicalFacts(contract, pkg, candidate)));
  }
  {
    const candidate = clone(facts);
    const historical = candidate.find(fact => fact.predicateIdentity === 'HISTORICAL_EXECUTION_APPLIES_TO_CURRENT_SOURCE');
    historical.normalizedValue = true;
    historical.originalValue = true;
    historical.applicabilityPosture = 'APPLICABLE';
    controls.push(expectFailure('NORMALIZED_HISTORICAL_PASS_PROJECTION_FAILS_CLOSED', 'D2_CANONICAL_FACT_ID_MISMATCH', () => validateCanonicalFacts(contract, pkg, candidate)));
  }
  {
    const candidate = clone(facts);
    const awareness = candidate.find(fact => fact.subjectIdentity === 'PROJECT_AWARENESS_V1_HISTORICAL_BASELINE' && fact.predicateIdentity === 'CURRENT_AUTHORITY');
    awareness.normalizedValue = true;
    awareness.originalValue = true;
    awareness.authorityPosture = 'CURRENT_CONTROLLING_INPUT';
    controls.push(expectFailure('NORMALIZED_AWARENESS_PROMOTION_FAILS_CLOSED', 'D2_CANONICAL_FACT_ID_MISMATCH', () => validateCanonicalFacts(contract, pkg, candidate)));
  }
  {
    const candidate = clone(relations);
    candidate[0].winnerFactId = candidate[0].leftFactId;
    candidate[0].resolutionPerformed = true;
    controls.push(expectFailure('RELATION_WINNER_SELECTION_FAILS_CLOSED', 'D2_WINNER_SELECTION_OR_RESOLUTION_PROHIBITED', () => validateCoexistenceIndex(contract, facts, candidate)));
  }
  {
    const candidate = clone(relations);
    candidate.pop();
    controls.push(expectFailure('INCOMPLETE_COEXISTENCE_INDEX_FAILS_CLOSED', 'D2_COEXISTENCE_RELATION_COUNT_MISMATCH', () => validateCoexistenceIndex(contract, facts, candidate)));
  }

  const repeated = buildD2Normalization(contract, pkg);
  if (repeated.factManifest.factManifestSha256 !== actual.factManifest.factManifestSha256 ||
      repeated.coexistenceIndex.coexistenceIndexSha256 !== actual.coexistenceIndex.coexistenceIndexSha256 ||
      repeated.normalizationReceipt.deterministicReceiptSha256 !== actual.normalizationReceipt.deterministicReceiptSha256) {
    throw new Error('D2_DETERMINISTIC_REPEAT_DIGEST_MISMATCH');
  }
  controls.push({
    controlId: 'DETERMINISTIC_REPEAT_BYTE_IDENTITY',
    status: 'PASS',
    factManifestSha256: repeated.factManifest.factManifestSha256,
    coexistenceIndexSha256: repeated.coexistenceIndex.coexistenceIndexSha256,
    receiptSha256: repeated.normalizationReceipt.deterministicReceiptSha256
  });

  const failed = controls.filter(control => control.status !== 'PASS');
  if (failed.length) throw new Error(`D2_CONTROLS_FAILED:${JSON.stringify(failed)}`);

  const aggregateBody = {
    schema: 'METAVERSE_3D_BENCHMARK_DISPOSITION_D2_CONTROL_RECEIPT_v1',
    checkpoint: 'D2',
    status: 'PASS',
    controlCount: controls.length,
    passedControlCount: controls.length,
    controls,
    normalizationReceipt: actual.normalizationReceipt,
    claims: actual.normalizationReceipt.claims
  };
  const aggregate = {
    ...aggregateBody,
    deterministicReceiptSha256: digest(aggregateBody)
  };

  await mkdir(outputRoot, { recursive: true });
  await writeFile(resolve(outputRoot, 'canonical-fact-manifest.json'), `${JSON.stringify(actual.factManifest, null, 2)}\n`);
  await writeFile(resolve(outputRoot, 'fact-coexistence-index.json'), `${JSON.stringify(actual.coexistenceIndex, null, 2)}\n`);
  await writeFile(resolve(outputRoot, 'normalization.receipt.json'), `${JSON.stringify(actual.normalizationReceipt, null, 2)}\n`);
  await writeFile(resolve(outputRoot, 'aggregate.receipt.json'), `${JSON.stringify(aggregate, null, 2)}\n`);

  process.stdout.write(`${JSON.stringify({
    status: 'PASS',
    controlCount: controls.length,
    canonicalFactCount: actual.factManifest.canonicalFactCount,
    coexistenceRelationCount: actual.coexistenceIndex.relationCount,
    factManifestSha256: actual.factManifest.factManifestSha256,
    coexistenceIndexSha256: actual.coexistenceIndex.coexistenceIndexSha256,
    normalizationReceiptSha256: actual.normalizationReceipt.deterministicReceiptSha256,
    aggregateReceiptSha256: aggregate.deterministicReceiptSha256
  }, null, 2)}\n`);
}

await main();
