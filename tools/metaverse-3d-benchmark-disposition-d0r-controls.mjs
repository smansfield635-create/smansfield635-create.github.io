import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildD0RAuthorityReceipt, digest, readD0RContract, validateD0RContract } from './metaverse-3d-benchmark-disposition-d0r-authority-lock.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const clone = value => JSON.parse(JSON.stringify(value));

async function expectedFailure(name, expectedCode, mutate) {
  const candidate = clone(await readD0RContract());
  mutate(candidate);
  try {
    validateD0RContract(candidate);
    return { name, status: 'FAIL', expectedCode, receivedCode: null };
  } catch (error) {
    return {
      name,
      status: error.code === expectedCode ? 'PASS' : 'FAIL',
      expectedCode,
      receivedCode: error.code ?? error.message
    };
  }
}

export async function executeD0RControls({ verifyRepository = true, writeReceipt = true } = {}) {
  const actual = await buildD0RAuthorityReceipt({ verifyRepository });
  const repeat = await buildD0RAuthorityReceipt({ verifyRepository });
  const controls = [
    { name: 'ACTUAL_R0_THROUGH_R6_FOUR_COMPASS_AUTHORITY_LOCK', status: actual.status === 'PASS' ? 'PASS' : 'FAIL' },
    await expectedFailure('PRODUCT_AUTHORITY_ESCALATION', 'D0R_PRODUCT_AUTHORITY_MUST_BE_FALSE', candidate => { candidate.authority.compilerOwnsProductAuthority = true; }),
    await expectedFailure('MERGE_AUTHORITY_ESCALATION', 'D0R_MERGEAUTHORITY_MUST_BE_NONE', candidate => { candidate.authority.mergeAuthority = 'GRANTED'; }),
    await expectedFailure('DUPLICATE_COMPASS_ID', 'D0R_DUPLICATE_COMPASS_ID', candidate => { candidate.governedCompasses[3].benchmarkId = candidate.governedCompasses[0].benchmarkId; }),
    await expectedFailure('HOME_REINTRODUCED_AS_COMPASS', 'D0R_COMPASS_SET_MISMATCH', candidate => { candidate.governedCompasses[1].benchmarkId = 'HOMEPAGE_COMPASS'; }),
    await expectedFailure('FIVE_COMPASS_COUNT_REINTRODUCED', 'D0R_COMPASS_COUNT_MISMATCH', candidate => { candidate.canonicalCompassCount = 5; }),
    await expectedFailure('LAWS_NEGATIVE_REFERENCE_NORMALIZED', 'D0R_REFERENCE_ROLE_SET_MISMATCH', candidate => { candidate.governedCompasses[3].referenceRole = 'POSITIVE_REFERENCE'; }),
    await expectedFailure('HOME_COMPASS_AUTHORITY_GRANTED', 'D0R_HOME_CONTROL_CLASSIFICATION_MISMATCH', candidate => { candidate.auxiliaryControls[0].compassAuthority = true; }),
    await expectedFailure('HOME_INCLUDED_IN_COMPASS_COUNTS', 'D0R_HOME_INCLUDEDINCOMPASSCOUNTS_MUST_BE_FALSE', candidate => { candidate.auxiliaryControls[0].includedInCompassCounts = true; }),
    await expectedFailure('HOME_INCLUDED_IN_COMPASS_DIGESTS', 'D0R_HOME_INCLUDEDINCOMPASSDIGESTS_MUST_BE_FALSE', candidate => { candidate.auxiliaryControls[0].includedInCompassDigests = true; }),
    await expectedFailure('HOME_INCLUDED_IN_COMPASS_FINDINGS', 'D0R_HOME_INCLUDEDINCOMPASSFINDINGS_MUST_BE_FALSE', candidate => { candidate.auxiliaryControls[0].includedInCompassFindings = true; }),
    await expectedFailure('HOME_INCLUDED_IN_COMPASS_ACCEPTANCE', 'D0R_HOME_INCLUDEDINCOMPASSACCEPTANCE_MUST_BE_FALSE', candidate => { candidate.auxiliaryControls[0].includedInCompassAcceptance = true; }),
    await expectedFailure('SHOWROOM_LEGACY_ID_LEFT_CONTROLLING', 'D0R_SHOWROOM_CANONICAL_ID_MISMATCH', candidate => { candidate.legacyIdentityDisposition.SHOWROOM.replacement = 'SHOWROOM'; }),
    await expectedFailure('LAWS_LEGACY_ID_LEFT_CONTROLLING', 'D0R_LAWS_CANONICAL_ID_MISMATCH', candidate => { candidate.legacyIdentityDisposition.LAWS_CHAMBER_POST_PR128.replacement = 'LAWS_CHAMBER_POST_PR128'; }),
    await expectedFailure('R5_INTERACTION_REPROJECTION_DRIFT', 'D0R_R5_REPROJECTION_MISMATCH', candidate => { candidate.reprojectedEvidence.interaction.scenarioCount = 21; }),
    await expectedFailure('R6_VISUAL_REPROJECTION_DRIFT', 'D0R_R6_REPROJECTION_MISMATCH', candidate => { candidate.reprojectedEvidence.visualSpatial.captureCount = 56; }),
    await expectedFailure('FIVE_BENCHMARK_AUTHORITY_REACTIVATED', 'D0R_FIVE_BENCHMARK_AUTHORITY_MUST_BE_SUPERSEDED', candidate => { candidate.historicalPolicy.historicalFiveBenchmarkAggregatesRemainControlling = true; }),
    await expectedFailure('AUTHORIZED_PATH_ESCAPE', 'D0R_AUTHORIZED_PATH_ESCAPE', candidate => { candidate.authorizedCheckpointPaths[0] = 'products/archcoin/index.js'; }),
    { name: 'DETERMINISTIC_REPEAT_DIGEST', status: actual.deterministicReceiptSha256 === repeat.deterministicReceiptSha256 ? 'PASS' : 'FAIL' }
  ];

  const failed = controls.filter(control => control.status !== 'PASS');
  const body = {
    receiptId: 'METAVERSE_3D_BENCHMARK_TO_DISPOSITION_COMPILER_D0R_CONTROL_RECEIPT_v2',
    status: failed.length === 0 ? 'PASS' : 'FAIL',
    checkpoint: 'D0R',
    controlCount: controls.length,
    passedControlCount: controls.length - failed.length,
    failedControlCount: failed.length,
    controls,
    authorityReceipt: actual,
    claims: {
      fourCompassAuthorityLocked: failed.length === 0,
      homeAuxiliaryControlLocked: failed.length === 0,
      r5Consumed: failed.length === 0,
      r6Consumed: failed.length === 0,
      priorD0ExecutionPreserved: true,
      priorD0AuthoritySuperseded: true,
      evidenceNormalizationPerformed: false,
      dimensionClassificationPerformed: false,
      dispositionCompilationPerformed: false,
      productFilesChanged: 0,
      d1Started: false,
      mergePerformed: false
    }
  };
  const receipt = { ...body, deterministicReceiptSha256: digest(body) };

  if (writeReceipt) {
    const output = resolve(here, '../artifacts/metaverse-3d-benchmark-disposition-d0r/aggregate.receipt.json');
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, JSON.stringify(receipt, null, 2) + '\n');
  }

  if (failed.length) {
    const error = new Error('D0R_CONTROLS_FAILED');
    error.receipt = receipt;
    throw error;
  }
  return receipt;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const receipt = await executeD0RControls();
  console.log(JSON.stringify(receipt, null, 2));
}
