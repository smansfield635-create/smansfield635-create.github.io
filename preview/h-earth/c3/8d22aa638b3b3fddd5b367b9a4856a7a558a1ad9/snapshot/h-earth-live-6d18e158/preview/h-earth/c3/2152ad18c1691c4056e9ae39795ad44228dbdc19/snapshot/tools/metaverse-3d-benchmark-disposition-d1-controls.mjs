import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildD1Receipt,
  digest,
  readD1Contract,
  validateD1Contract
} from './metaverse-3d-benchmark-disposition-d1-intake.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const outputRoot = resolve(here, '..', 'artifacts', 'metaverse-3d-benchmark-disposition-d1');

const clone = value => JSON.parse(JSON.stringify(value));

function expectFailure(controlId, contract, expectedCode) {
  try {
    validateD1Contract(contract);
  } catch (error) {
    if (error.code === expectedCode) {
      return { controlId, status: 'PASS', expectedFailureCode: expectedCode };
    }
    throw new Error(`${controlId}:EXPECTED_${expectedCode}:RECEIVED_${error.code || error.message}`);
  }
  throw new Error(`${controlId}:EXPECTED_FAILURE_NOT_OBSERVED`);
}

async function main() {
  const contract = await readD1Contract();
  const controls = [];

  const actual = buildD1Receipt(contract);
  controls.push({
    controlId: 'ACTUAL_THREE_LANE_NATIVE_EVIDENCE_INTAKE',
    status: actual.status,
    receiptSha256: actual.deterministicReceiptSha256
  });

  {
    const candidate = clone(contract);
    candidate.lanes[1].laneId = candidate.lanes[0].laneId;
    controls.push(expectFailure('DUPLICATE_LANE_ID_FAILS_CLOSED', candidate, 'D1_LANE_SET_MISMATCH'));
  }
  {
    const candidate = clone(contract);
    candidate.lanes.pop();
    controls.push(expectFailure('MISSING_LANE_FAILS_CLOSED', candidate, 'D1_LANE_SET_MISMATCH'));
  }
  {
    const candidate = clone(contract);
    candidate.lanes[0].canonicalCompassCount = 5;
    controls.push(expectFailure('FIVE_COMPASS_COUNT_FAILS_CLOSED', candidate, 'D1_COMPASS_COUNT_MISMATCH'));
  }
  {
    const candidate = clone(contract);
    candidate.lanes[0].canonicalCompassIds[0] = 'HOMEPAGE_COMPASS';
    controls.push(expectFailure('HOME_AS_COMPASS_FAILS_CLOSED', candidate, 'D1_COMPASS_IDS_MISMATCH'));
  }
  {
    const candidate = clone(contract);
    candidate.lanes[0].canonicalCompassIds.push('UNIVERSAL_COMPASS_PROTOTYPE_CANDIDATE');
    candidate.lanes[0].canonicalCompassCount = 5;
    controls.push(expectFailure('PROTOTYPE_AS_FIFTH_COMPASS_FAILS_CLOSED', candidate, 'D1_COMPASS_COUNT_MISMATCH'));
  }
  {
    const candidate = clone(contract);
    candidate.lanes[1].internalRuntimeModuleCount = 4;
    controls.push(expectFailure('INTERNAL_MODULE_COUNT_DRIFT_FAILS_CLOSED', candidate, 'D1_INTERNAL_MODULE_COUNT_MISMATCH'));
  }
  {
    const candidate = clone(contract);
    candidate.lanes[1].packagePathCount = 7;
    controls.push(expectFailure('PROTOTYPE_PACKAGE_PATH_COUNT_DRIFT_FAILS_CLOSED', candidate, 'D1_PROTOTYPE_PATH_COUNT_MISMATCH'));
  }
  {
    const candidate = clone(contract);
    candidate.lanes[1].historicalExecution.appliesToCurrentSource = true;
    controls.push(expectFailure('HISTORICAL_ROUTE_PASS_PROJECTION_FAILS_CLOSED', candidate, 'D1_HISTORICAL_EXECUTION_POSTURE_MISMATCH'));
  }
  {
    const candidate = clone(contract);
    candidate.lanes[1].currentExecution.status = 'PASS';
    candidate.lanes[1].currentExecution.browserPassEstablished = true;
    controls.push(expectFailure('UNEXECUTED_CURRENT_PROTOTYPE_PASS_FAILS_CLOSED', candidate, 'D1_CURRENT_PROTOTYPE_EXECUTION_POSTURE_MISMATCH'));
  }
  {
    const candidate = clone(contract);
    candidate.lanes[2].currentAuthority = true;
    controls.push(expectFailure('HISTORICAL_AWARENESS_AS_CURRENT_FAILS_CLOSED', candidate, 'D1_AWARENESS_TEMPORAL_IDENTITY_MISMATCH'));
  }
  {
    const candidate = clone(contract);
    candidate.lanes[2].inspectedRepositoryCommit = candidate.lanes[2].packageOccurrenceCommit;
    controls.push(expectFailure('AWARENESS_COMMIT_CONFLATION_FAILS_CLOSED', candidate, 'D1_AWARENESS_TEMPORAL_IDENTITY_MISMATCH'));
  }
  {
    const candidate = clone(contract);
    candidate.lanes[1].sourceRecords[0][2] = 'research/project-awareness/project-awareness.contract.js';
    controls.push(expectFailure('PROTOTYPE_TO_AWARENESS_LANE_CROSSING_FAILS_CLOSED', candidate, 'D1_PROTOTYPE_LANE_CROSSING'));
  }
  {
    const candidate = clone(contract);
    candidate.lanes[2].sourceRecords[0][2] = 'prototypes/universal-compass/index.html';
    controls.push(expectFailure('AWARENESS_TO_PROTOTYPE_LANE_CROSSING_FAILS_CLOSED', candidate, 'D1_AWARENESS_LANE_CROSSING'));
  }
  {
    const candidate = clone(contract);
    candidate.lanes[0].sourceRecords.pop();
    controls.push(expectFailure('INCOMPLETE_CORPUS_SOURCE_INVENTORY_FAILS_CLOSED', candidate, 'D1_CORPUS_SOURCE_COUNT_MISMATCH'));
  }
  {
    const candidate = clone(contract);
    candidate.lanes[0].artifactRecords.pop();
    controls.push(expectFailure('INCOMPLETE_ARTIFACT_INVENTORY_FAILS_CLOSED', candidate, 'D1_CORPUS_ARTIFACT_COUNT_MISMATCH'));
  }
  {
    const candidate = clone(contract);
    candidate.lanes[1].nativeStatus = 'CURRENT_EXECUTED_PASS';
    controls.push(expectFailure('UNKNOWN_OR_PROMOTED_NATIVE_STATUS_FAILS_CLOSED', candidate, 'D1_PROTOTYPE_TEMPORAL_IDENTITY_MISMATCH'));
  }
  {
    const candidate = clone(contract);
    candidate.claims.evidenceNormalizationPerformed = true;
    controls.push(expectFailure('NORMALIZATION_BOUNDARY_VIOLATION_FAILS_CLOSED', candidate, 'D1_BOUNDARY_CLAIMS_MISMATCH'));
  }
  {
    const candidate = clone(contract);
    candidate.parentD0R.headCommit = '0000000000000000000000000000000000000000';
    controls.push(expectFailure('D0R_PARENT_IDENTITY_DRIFT_FAILS_CLOSED', candidate, 'D1_PARENT_D0R_MISMATCH'));
  }
  {
    const candidate = clone(contract);
    candidate.lanes[1].sourceRecords[2][3] = '0000000000000000000000000000000000000000';
    let result;
    try {
      buildD1Receipt(candidate);
      throw new Error('SOURCE_BLOB_MISMATCH_NOT_OBSERVED');
    } catch (error) {
      if (error.code !== 'D1_SOURCE_BLOB_MISMATCH') throw error;
      result = {
        controlId: 'ACTUAL_SOURCE_BLOB_MISMATCH_FAILS_CLOSED',
        status: 'PASS',
        expectedFailureCode: error.code
      };
    }
    controls.push(result);
  }

  const repeated = buildD1Receipt(contract);
  if (repeated.deterministicReceiptSha256 !== actual.deterministicReceiptSha256) {
    throw new Error('D1_DETERMINISTIC_REPEAT_DIGEST_MISMATCH');
  }
  controls.push({
    controlId: 'DETERMINISTIC_REPEAT_DIGEST',
    status: 'PASS',
    receiptSha256: repeated.deterministicReceiptSha256
  });

  const failed = controls.filter(control => control.status !== 'PASS');
  if (failed.length) throw new Error(`D1_CONTROLS_FAILED:${JSON.stringify(failed)}`);

  const sourceManifest = {
    schema: 'METAVERSE_3D_BENCHMARK_DISPOSITION_D1_SOURCE_MANIFEST_v1',
    checkpoint: 'D1',
    sourceRecordCount: actual.sourceManifest.length,
    sourceManifestSha256: actual.sourceManifestSha256,
    records: actual.sourceManifest
  };
  const evidenceInventory = {
    schema: 'METAVERSE_3D_BENCHMARK_DISPOSITION_D1_NATIVE_EVIDENCE_INVENTORY_v1',
    checkpoint: 'D1',
    nativeEvidenceRecordCount: actual.nativeEvidenceInventory.length,
    nativeEvidenceInventorySha256: actual.nativeEvidenceInventorySha256,
    records: actual.nativeEvidenceInventory
  };

  const body = {
    schema: 'METAVERSE_3D_BENCHMARK_DISPOSITION_D1_CONTROL_RECEIPT_v1',
    checkpoint: 'D1',
    status: 'PASS',
    controlCount: controls.length,
    passedControlCount: controls.length,
    controls,
    intakeReceipt: actual,
    claims: actual.claims
  };
  const aggregate = {
    ...body,
    deterministicReceiptSha256: digest(body)
  };

  await mkdir(outputRoot, { recursive: true });
  await writeFile(resolve(outputRoot, 'source-manifest.json'), `${JSON.stringify(sourceManifest, null, 2)}\n`);
  await writeFile(resolve(outputRoot, 'native-evidence-inventory.json'), `${JSON.stringify(evidenceInventory, null, 2)}\n`);
  await writeFile(resolve(outputRoot, 'intake.receipt.json'), `${JSON.stringify(actual, null, 2)}\n`);
  await writeFile(resolve(outputRoot, 'aggregate.receipt.json'), `${JSON.stringify(aggregate, null, 2)}\n`);

  process.stdout.write(`${JSON.stringify({
    status: 'PASS',
    controlCount: controls.length,
    sourceRecordCount: sourceManifest.sourceRecordCount,
    nativeEvidenceRecordCount: evidenceInventory.nativeEvidenceRecordCount,
    deterministicReceiptSha256: aggregate.deterministicReceiptSha256
  }, null, 2)}\n`);
}

await main();
