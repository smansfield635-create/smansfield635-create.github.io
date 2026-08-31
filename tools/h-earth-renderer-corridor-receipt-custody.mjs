import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

export const H_EARTH_RENDERER_CORRIDOR_RECEIPT_CUSTODY_CONTRACT_ID =
  'H_EARTH_RENDERER_CORRIDOR_RECEIPT_CUSTODY_v1';

export const H_EARTH_RECEIPT_CUSTODY_MODES = Object.freeze({
  INTEGRATION: 'integration',
  DEPLOYED: 'deployed'
});

const INTEGRATION_PROFILE_IDS = Object.freeze([
  'SMALL_MOBILE_PORTRAIT_DPR_2',
  'LARGE_MOBILE_PORTRAIT_DPR_3',
  'TABLET_PORTRAIT_DPR_2',
  'DESKTOP_LANDSCAPE_DPR_1',
  'DESKTOP_LANDSCAPE_DPR_2'
]);

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, stableValue(value[key])])
    );
  }
  return value;
}

function attachDigest(receipt) {
  const canonical = JSON.stringify(stableValue(receipt));
  return Object.freeze({
    ...receipt,
    deterministicReceiptSha256: crypto
      .createHash('sha256')
      .update(canonical)
      .digest('hex')
  });
}

function readJsonFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(text);
}

function describeFile(repositoryRoot, relativePath) {
  const absolutePath = path.join(repositoryRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    return Object.freeze({
      relativePath,
      present: false,
      regularFile: false,
      validJson: false,
      receiptDigestPresent: false,
      error: 'MISSING_FILE'
    });
  }

  const stat = fs.statSync(absolutePath);
  if (!stat.isFile()) {
    return Object.freeze({
      relativePath,
      present: true,
      regularFile: false,
      validJson: false,
      receiptDigestPresent: false,
      error: 'NOT_A_REGULAR_FILE'
    });
  }

  try {
    const parsed = readJsonFile(absolutePath);
    return Object.freeze({
      relativePath,
      present: true,
      regularFile: true,
      validJson: true,
      receiptDigestPresent:
        typeof parsed?.deterministicReceiptSha256 === 'string' &&
        /^[a-f0-9]{64}$/.test(parsed.deterministicReceiptSha256),
      error: null
    });
  } catch (error) {
    return Object.freeze({
      relativePath,
      present: true,
      regularFile: true,
      validJson: false,
      receiptDigestPresent: false,
      error: error?.message ?? String(error)
    });
  }
}

function verifyIntegrationCustody(repositoryRoot) {
  const directory = 'artifacts/h-earth-renderer-corridor';
  const requiredPaths = [
    `${directory}/aggregate.receipt.json`,
    ...INTEGRATION_PROFILE_IDS.map(
      (profileId) => `${directory}/${profileId}.receipt.json`
    )
  ];
  const files = requiredPaths.map((relativePath) =>
    describeFile(repositoryRoot, relativePath)
  );
  const aggregatePath = path.join(
    repositoryRoot,
    directory,
    'aggregate.receipt.json'
  );
  let aggregateProfileCount = null;
  let aggregateProfileReceiptCount = null;
  if (fs.existsSync(aggregatePath)) {
    try {
      const aggregate = readJsonFile(aggregatePath);
      aggregateProfileCount = aggregate?.profileCount ?? null;
      aggregateProfileReceiptCount = Array.isArray(aggregate?.profileReceipts)
        ? aggregate.profileReceipts.length
        : null;
    } catch (_error) {
      // File-level diagnostics already record malformed JSON.
    }
  }

  const completeFiles = files.every(
    (file) =>
      file.present &&
      file.regularFile &&
      file.validJson &&
      file.receiptDigestPresent
  );
  const aggregateConsistent =
    aggregateProfileCount === INTEGRATION_PROFILE_IDS.length &&
    aggregateProfileReceiptCount === INTEGRATION_PROFILE_IDS.length;

  return Object.freeze({
    mode: H_EARTH_RECEIPT_CUSTODY_MODES.INTEGRATION,
    requiredReceiptCount: requiredPaths.length,
    completeReceiptCount: files.filter(
      (file) =>
        file.present &&
        file.regularFile &&
        file.validJson &&
        file.receiptDigestPresent
    ).length,
    aggregateProfileCount,
    aggregateProfileReceiptCount,
    aggregateConsistent,
    files,
    eligible: completeFiles && aggregateConsistent
  });
}

function verifyDeployedCustody(repositoryRoot) {
  const directory = 'artifacts/h-earth-deployed-route-smoke';
  const aggregateRelativePath = `${directory}/aggregate.receipt.json`;
  const aggregateFile = describeFile(repositoryRoot, aggregateRelativePath);
  const absoluteDirectory = path.join(repositoryRoot, directory);
  const attemptRelativePaths = fs.existsSync(absoluteDirectory)
    ? fs
        .readdirSync(absoluteDirectory)
        .filter((name) => /^attempt-\d+\.receipt\.json$/.test(name))
        .sort((left, right) => left.localeCompare(right, 'en'))
        .map((name) => `${directory}/${name}`)
    : [];
  const attemptFiles = attemptRelativePaths.map((relativePath) =>
    describeFile(repositoryRoot, relativePath)
  );

  let aggregateAttemptCount = null;
  let aggregateEmbeddedAttemptCount = null;
  const aggregatePath = path.join(repositoryRoot, aggregateRelativePath);
  if (fs.existsSync(aggregatePath)) {
    try {
      const aggregate = readJsonFile(aggregatePath);
      aggregateAttemptCount = aggregate?.attemptCount ?? null;
      aggregateEmbeddedAttemptCount = Array.isArray(aggregate?.attempts)
        ? aggregate.attempts.length
        : null;
    } catch (_error) {
      // File-level diagnostics already record malformed JSON.
    }
  }

  const attemptsComplete =
    attemptFiles.length >= 1 &&
    attemptFiles.every(
      (file) =>
        file.present &&
        file.regularFile &&
        file.validJson &&
        file.receiptDigestPresent
    );
  const aggregateConsistent =
    Number.isSafeInteger(aggregateAttemptCount) &&
    aggregateAttemptCount >= 1 &&
    aggregateAttemptCount === attemptFiles.length &&
    aggregateEmbeddedAttemptCount === attemptFiles.length;
  const aggregateComplete =
    aggregateFile.present &&
    aggregateFile.regularFile &&
    aggregateFile.validJson &&
    aggregateFile.receiptDigestPresent;

  return Object.freeze({
    mode: H_EARTH_RECEIPT_CUSTODY_MODES.DEPLOYED,
    requiredAggregateReceiptCount: 1,
    attemptReceiptCount: attemptFiles.length,
    aggregateAttemptCount,
    aggregateEmbeddedAttemptCount,
    aggregateConsistent,
    files: Object.freeze([aggregateFile, ...attemptFiles]),
    eligible: aggregateComplete && attemptsComplete && aggregateConsistent
  });
}

export function verifyHEarthRendererCorridorReceiptCustody({
  mode,
  repositoryRoot = process.cwd()
} = {}) {
  if (!Object.values(H_EARTH_RECEIPT_CUSTODY_MODES).includes(mode)) {
    throw new TypeError(`Unsupported receipt-custody mode: ${String(mode)}`);
  }
  const normalizedRoot = path.resolve(repositoryRoot);
  const verification = mode === H_EARTH_RECEIPT_CUSTODY_MODES.INTEGRATION
    ? verifyIntegrationCustody(normalizedRoot)
    : verifyDeployedCustody(normalizedRoot);

  return attachDigest({
    receiptType: 'H_EARTH_RENDERER_CORRIDOR_RECEIPT_CUSTODY_RECEIPT',
    contractId: H_EARTH_RENDERER_CORRIDOR_RECEIPT_CUSTODY_CONTRACT_ID,
    repositoryRoot: normalizedRoot,
    ...verification
  });
}

function writeCustodyReceipt(repositoryRoot, mode, receipt) {
  const directory = mode === H_EARTH_RECEIPT_CUSTODY_MODES.INTEGRATION
    ? 'artifacts/h-earth-renderer-corridor'
    : 'artifacts/h-earth-deployed-route-smoke';
  const outputPath = path.join(
    repositoryRoot,
    directory,
    'receipt-custody.receipt.json'
  );
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
  return outputPath;
}

async function main() {
  const mode = process.argv[2];
  const repositoryRoot = path.resolve(process.argv[3] ?? process.cwd());
  const receipt = verifyHEarthRendererCorridorReceiptCustody({
    mode,
    repositoryRoot
  });
  const outputPath = writeCustodyReceipt(repositoryRoot, mode, receipt);

  process.stdout.write(`${JSON.stringify({
    status: receipt.eligible ? 'PASS' : 'FAIL',
    mode: receipt.mode,
    eligible: receipt.eligible,
    receipt: path.relative(repositoryRoot, outputPath),
    deterministicReceiptSha256: receipt.deterministicReceiptSha256
  }, null, 2)}\n`);

  if (!receipt.eligible) process.exitCode = 1;
}

const invokedPath = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href
  : null;
if (invokedPath === import.meta.url) {
  main().catch((error) => {
    console.error('[H-Earth receipt custody fatal error]', error);
    process.exitCode = 1;
  });
}
