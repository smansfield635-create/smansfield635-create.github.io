import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildD0AuthorityReceipt, digest, readD0Contract, validateD0Contract } from './metaverse-3d-benchmark-disposition-d0-authority-lock.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const clone = value => JSON.parse(JSON.stringify(value));

async function expectedFailure(name, code, mutate) {
  const candidate = clone(await readD0Contract());
  mutate(candidate);
  try {
    validateD0Contract(candidate);
    return { name, status: 'FAIL', expectedCode: code, receivedCode: null };
  } catch (error) {
    return { name, status: error.code === code ? 'PASS' : 'FAIL', expectedCode: code, receivedCode: error.code ?? error.message };
  }
}

export async function executeD0Controls({ verifyRepository = true, writeReceipt = true } = {}) {
  const actual = await buildD0AuthorityReceipt({ verifyRepository });
  const repeat = await buildD0AuthorityReceipt({ verifyRepository });
  const controls = [
    { name: 'ACTUAL_CONTRACT_AND_SOURCE_ANCHOR_LOCK', status: actual.status === 'PASS' ? 'PASS' : 'FAIL' },
    await expectedFailure('PRODUCT_AUTHORITY_ESCALATION', 'D0_PRODUCT_AUTHORITY_MUST_BE_FALSE', candidate => { candidate.authority.compilerOwnsProductAuthority = true; }),
    await expectedFailure('MERGE_AUTHORITY_ESCALATION', 'D0_MERGE_AUTHORITY_MUST_BE_NONE', candidate => { candidate.authority.mergeAuthority = 'GRANTED'; }),
    await expectedFailure('DUPLICATE_BENCHMARK_ID', 'D0_DUPLICATE_BENCHMARK_ID', candidate => { candidate.governedBenchmarks[4].benchmarkId = candidate.governedBenchmarks[0].benchmarkId; }),
    await expectedFailure('DUPLICATE_DIMENSION', 'D0_DUPLICATE_DIMENSION', candidate => { candidate.governedDimensions[10] = candidate.governedDimensions[0]; }),
    await expectedFailure('UNKNOWN_DIMENSION_STATE', 'D0_DIMENSION_STATE_SET_MISMATCH', candidate => { candidate.dimensionStates[0] = 'MAYBE'; }),
    await expectedFailure('UNKNOWN_DISPOSITION', 'D0_DISPOSITION_SET_MISMATCH', candidate => { candidate.dispositions[0] = 'DELETE'; }),
    await expectedFailure('AUTHORIZED_PATH_ESCAPE', 'D0_AUTHORIZED_PATH_ESCAPE', candidate => { candidate.authorizedCheckpointPaths[0] = 'products/archcoin/index.js'; }),
    await expectedFailure('NEGATIVE_REFERENCE_NORMALIZATION', 'D0_REFERENCE_ROLE_SET_MISMATCH', candidate => { candidate.governedBenchmarks[4].referenceRole = 'POSITIVE_REFERENCE'; }),
    { name: 'DETERMINISTIC_REPEAT_DIGEST', status: actual.deterministicReceiptSha256 === repeat.deterministicReceiptSha256 ? 'PASS' : 'FAIL' }
  ];
  const failed = controls.filter(control => control.status !== 'PASS');
  const body = {
    receiptId: 'METAVERSE_3D_BENCHMARK_TO_DISPOSITION_COMPILER_D0_CONTROL_RECEIPT_v1',
    status: failed.length === 0 ? 'PASS' : 'FAIL',
    checkpoint: 'D0',
    controlCount: controls.length,
    passedControlCount: controls.length - failed.length,
    failedControlCount: failed.length,
    controls,
    authorityReceipt: actual,
    claims: {
      compilerAuthorityLocked: failed.length === 0,
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
    const output = resolve(here, '../artifacts/metaverse-3d-benchmark-disposition-d0/aggregate.receipt.json');
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, JSON.stringify(receipt, null, 2) + '\n');
  }
  if (failed.length) {
    const error = new Error('D0_CONTROLS_FAILED');
    error.receipt = receipt;
    throw error;
  }
  return receipt;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const receipt = await executeD0Controls();
  console.log(JSON.stringify(receipt, null, 2));
}
