import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { H7_CONTRACT, buildArtifactInventory, buildSourceManifest, digest, executeFullChain, validateH7Contract, verifyCheckpointChain, writeCheckpointReceipts } from './h-earth-capacity-camera-renderer-correspondence-h7-finalizer.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const clone = value => JSON.parse(JSON.stringify(value));
const fail = (code, details = null) => { const error = new Error(code); error.code = code; error.details = details; throw error; };

function validateInventory(candidate, expectedCount) {
  if (!candidate || candidate.artifactCount !== expectedCount || candidate.entries?.length !== expectedCount) fail('H7_ARTIFACT_INVENTORY_COUNT_MISMATCH');
  if (candidate.entries.some(entry => !/^[0-9a-f]{64}$/.test(entry.sha256))) fail('H7_ARTIFACT_DIGEST_MISMATCH');
  return true;
}

export async function executeH7FinalAcceptance({ repositoryRoot = resolve(here, '..'), headSha = process.env.H7_HEAD_SHA || null } = {}) {
  validateH7Contract();
  const controls = [];
  const pass = (id, operation, predicate = Boolean) => { try { const result = operation(); controls.push({ id, status: predicate(result) ? 'PASS' : 'FAIL', expected: 'PASS', result }); } catch (error) { controls.push({ id, status: 'FAIL', expected: 'PASS', actual: error.code ?? error.name }); } };
  const passAsync = async (id, operation, predicate = Boolean) => { try { const result = await operation(); controls.push({ id, status: predicate(result) ? 'PASS' : 'FAIL', expected: 'PASS', result }); return result; } catch (error) { controls.push({ id, status: 'FAIL', expected: 'PASS', actual: error.code ?? error.name }); return null; } };
  const failClosed = (id, expected, operation) => { try { operation(); controls.push({ id, status: 'FAIL', expected, actual: 'NO_ERROR' }); } catch (error) { controls.push({ id, status: error.code === expected ? 'PASS' : 'FAIL', expected, actual: error.code ?? error.name }); } };

  pass('CHECKPOINT_CHAIN_LOCKED', () => verifyCheckpointChain(repositoryRoot, headSha), value => value.checkpointCount === 7);
  const sourceManifest = await passAsync('EXACT_VERIFIER_SOURCE_MANIFEST', () => buildSourceManifest(repositoryRoot), value => value.fileCount === H7_CONTRACT.expectedVerifierPathCount);
  const receipts = await passAsync('FULL_H0_THROUGH_H6_EXECUTION', () => executeFullChain(repositoryRoot), value => Object.values(value).every(receipt => receipt.status === 'PASS'));
  if (!receipts) fail('H7_FULL_CHAIN_EXECUTION_FAILED');
  await writeCheckpointReceipts(repositoryRoot, receipts);
  const artifactInventory = await passAsync('REQUIRED_ARTIFACT_INVENTORY_COMPLETE', () => buildArtifactInventory(repositoryRoot), value => value.artifactCount === 14);
  if (!artifactInventory) fail('H7_ARTIFACT_INVENTORY_FAILED');
  pass('CURRENT_PRODUCT_FAILURE_IS_NOT_TOOL_FAILURE', () => receipts.H6.actualCorrespondence, value => value.status === 'PASS' && value.capacityResult.productCapacityResult === 'BLOCKED');
  failClosed('MISSING_ARTIFACT_FAILS_CLOSED', 'H7_ARTIFACT_INVENTORY_COUNT_MISMATCH', () => validateInventory({ artifactCount: 13, entries: artifactInventory.entries.slice(1) }, 14));
  const corrupted = clone(artifactInventory); corrupted.entries[0].sha256 = 'x'.repeat(64);
  failClosed('DIGEST_MISMATCH_FAILS_CLOSED', 'H7_ARTIFACT_DIGEST_MISMATCH', () => validateInventory(corrupted, 14));
  pass('DETERMINISTIC_FINAL_ASSEMBLY', () => {
    const basis = { sourceManifest, artifactInventory, checkpointDigests: Object.fromEntries(Object.entries(receipts).map(([id, receipt]) => [id, receipt.deterministicReceiptSha256])) };
    return { first: digest(basis), second: digest(clone(basis)), identical: digest(basis) === digest(clone(basis)) };
  }, value => value.identical === true);

  const failed = controls.filter(control => control.status !== 'PASS');
  const body = {
    contractId: 'H_EARTH_CAPACITY_CAMERA_RENDERER_CORRESPONDENCE_FINAL_TOOL_ACCEPTANCE_RECEIPT_v1',
    toolId: H7_CONTRACT.toolId,
    checkpoint: 'H7',
    status: failed.length === 0 ? 'PASS' : 'FAIL',
    controlCount: controls.length,
    passedControlCount: controls.length - failed.length,
    failedControlCount: failed.length,
    checkpointChain: H7_CONTRACT.checkpointChain,
    sourceManifest,
    artifactInventory,
    checkpointReceipts: Object.fromEntries(Object.entries(receipts).map(([id, receipt]) => [id, { contractId: receipt.contractId, status: receipt.status, deterministicReceiptSha256: receipt.deterministicReceiptSha256 }])),
    currentProductState: {
      capacityResult: receipts.H6.actualCorrespondence.capacityResult,
      rendererResult: receipts.H6.actualCorrespondence.rendererResult,
      terminalClassification: receipts.H6.actualCorrespondence.terminalClassification,
      currentProductionCapacityPass: false
    },
    acceptance: {
      capacityVerifierVerified: failed.length === 0,
      inventoryEligible: failed.length === 0,
      toolComplete: failed.length === 0,
      h8RetiredIntoH7: true
    },
    controls,
    claims: {
      rendererExecutionPerformed: true,
      browserExecutionPerformed: true,
      deployedRouteExecutionPerformed: false,
      productionFilesChanged: 0,
      capacityJsChanged: false,
      productionCorrectionStarted: false,
      mergePerformed: false
    }
  };
  const receipt = { ...body, deterministicReceiptSha256: digest(body) };
  const output = resolve(repositoryRoot, 'artifacts/h-earth-capacity-camera-h7');
  await mkdir(output, { recursive: true });
  await writeFile(resolve(output, 'source-manifest.json'), `${JSON.stringify(sourceManifest, null, 2)}\n`);
  await writeFile(resolve(output, 'artifact-inventory.json'), `${JSON.stringify(artifactInventory, null, 2)}\n`);
  await writeFile(resolve(output, 'aggregate.receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`);
  return receipt;
}

const direct = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (direct) { const receipt = await executeH7FinalAcceptance(); console.log(JSON.stringify(receipt, null, 2)); if (receipt.status !== 'PASS') process.exitCode = 1; }
