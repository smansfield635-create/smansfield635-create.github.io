import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  H_EARTH_RECEIPT_CUSTODY_MODES,
  verifyHEarthRendererCorridorReceiptCustody
} from './h-earth-renderer-corridor-receipt-custody.mjs';

const DIGEST = 'a'.repeat(64);
const PROFILE_IDS = Object.freeze([
  'SMALL_MOBILE_PORTRAIT_DPR_2',
  'LARGE_MOBILE_PORTRAIT_DPR_3',
  'TABLET_PORTRAIT_DPR_2',
  'DESKTOP_LANDSCAPE_DPR_1',
  'DESKTOP_LANDSCAPE_DPR_2'
]);

function writeJson(root, relativePath, value) {
  const absolutePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function createIntegrationFixture(root) {
  const directory = 'artifacts/h-earth-renderer-corridor';
  writeJson(root, `${directory}/aggregate.receipt.json`, {
    profileCount: PROFILE_IDS.length,
    profileReceipts: PROFILE_IDS.map((profileId) => ({ profileId })),
    deterministicReceiptSha256: DIGEST
  });
  for (const profileId of PROFILE_IDS) {
    writeJson(root, `${directory}/${profileId}.receipt.json`, {
      profileId,
      deterministicReceiptSha256: DIGEST
    });
  }
}

function createDeployedFixture(root) {
  const directory = 'artifacts/h-earth-deployed-route-smoke';
  writeJson(root, `${directory}/attempt-1.receipt.json`, {
    attemptNumber: 1,
    deterministicReceiptSha256: DIGEST
  });
  writeJson(root, `${directory}/aggregate.receipt.json`, {
    attemptCount: 1,
    attempts: [{ attemptNumber: 1 }],
    deterministicReceiptSha256: DIGEST
  });
}

const root = fs.mkdtempSync(
  path.join(os.tmpdir(), 'h-earth-receipt-custody-fixture-')
);

try {
  createIntegrationFixture(root);
  const integrationPresent = verifyHEarthRendererCorridorReceiptCustody({
    mode: H_EARTH_RECEIPT_CUSTODY_MODES.INTEGRATION,
    repositoryRoot: root
  });
  assert.equal(integrationPresent.eligible, true);
  assert.equal(integrationPresent.requiredReceiptCount, 6);
  assert.equal(integrationPresent.completeReceiptCount, 6);

  fs.rmSync(
    path.join(
      root,
      'artifacts/h-earth-renderer-corridor/TABLET_PORTRAIT_DPR_2.receipt.json'
    )
  );
  const integrationMissing = verifyHEarthRendererCorridorReceiptCustody({
    mode: H_EARTH_RECEIPT_CUSTODY_MODES.INTEGRATION,
    repositoryRoot: root
  });
  assert.equal(integrationMissing.eligible, false);
  assert.equal(integrationMissing.completeReceiptCount, 5);

  fs.rmSync(path.join(root, 'artifacts'), { recursive: true, force: true });
  createDeployedFixture(root);
  const deployedPresent = verifyHEarthRendererCorridorReceiptCustody({
    mode: H_EARTH_RECEIPT_CUSTODY_MODES.DEPLOYED,
    repositoryRoot: root
  });
  assert.equal(deployedPresent.eligible, true);
  assert.equal(deployedPresent.attemptReceiptCount, 1);

  fs.rmSync(
    path.join(
      root,
      'artifacts/h-earth-deployed-route-smoke/attempt-1.receipt.json'
    )
  );
  const deployedMissing = verifyHEarthRendererCorridorReceiptCustody({
    mode: H_EARTH_RECEIPT_CUSTODY_MODES.DEPLOYED,
    repositoryRoot: root
  });
  assert.equal(deployedMissing.eligible, false);
  assert.equal(deployedMissing.attemptReceiptCount, 0);

  process.stdout.write(`${JSON.stringify({
    status: 'PASS',
    contract: 'H_EARTH_RENDERER_CORRIDOR_RECEIPT_CUSTODY_FIXTURE_v1',
    integrationPresentPasses: true,
    integrationMissingFailsClosed: true,
    deployedPresentPasses: true,
    deployedMissingFailsClosed: true
  }, null, 2)}\n`);
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
