import fs from 'node:fs';
import path from 'node:path';
import { firefox } from 'playwright';

const args = process.argv.slice(2);
const valueOf = (flag, fallback = null) => {
  const index = args.indexOf(flag);
  return index >= 0 && index + 1 < args.length ? args[index + 1] : fallback;
};

const BASE_URL = valueOf('--base-url', process.env.LAWS_RUNTIME_BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
const ROLE = valueOf('--role', process.env.LAWS_RUNTIME_ROLE || 'builder');
const OUTPUT = valueOf('--output', process.env.LAWS_RUNTIME_OUTPUT || `/tmp/laws-firefox-spacecraft-receipt-${ROLE}.json`);
const SUBJECT_HEAD = valueOf('--subject-head', process.env.LAWS_SUBJECT_HEAD || '');
const DIAGNOSTIC_HEAD = process.env.GITHUB_SHA || 'LOCAL';
const VIEWPORT = Object.freeze({ width: 390, height: 844 });
const EXPECTED = Object.freeze({
  status: 'held',
  webGlAvailable: false,
  lastAction: 'spacecraft-background-initialization-failed',
  lastError: 'LAWS_SPACECRAFT_WEBGL_UNAVAILABLE'
});

const writeReceipt = receipt => {
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(JSON.stringify(receipt, null, 2));
};

const normalizeReceipt = receipt => receipt ? {
  status: String(receipt.status ?? ''),
  webGlAvailable: Boolean(receipt.webGlAvailable),
  lastAction: String(receipt.lastAction ?? ''),
  lastError: String(receipt.lastError ?? '')
} : null;

const matchesExpected = observed => Boolean(observed) &&
  observed.status === EXPECTED.status &&
  observed.webGlAvailable === EXPECTED.webGlAvailable &&
  observed.lastAction === EXPECTED.lastAction &&
  observed.lastError === EXPECTED.lastError;

async function main() {
  if (!/^[0-9a-f]{40}$/i.test(SUBJECT_HEAD)) {
    throw new Error(`INVALID_SUBJECT_HEAD:${SUBJECT_HEAD || 'EMPTY'}`);
  }

  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();
  const browserErrors = [];

  page.on('pageerror', error => browserErrors.push(`pageerror:${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:')) {
      browserErrors.push(`console:${message.text()}`);
    }
  });

  let observed = null;
  let captureError = '';

  try {
    const response = await page.goto(`${BASE_URL}/laws/?story=1`, {
      waitUntil: 'domcontentloaded',
      timeout: 45000
    });
    if (!response || response.status() !== 200) {
      throw new Error(`LAWS_ENTRY_HTTP:${response?.status() ?? 'NO_RESPONSE'}`);
    }

    await page.waitForFunction(() => {
      const receipt = globalThis.DGB_LAWS_SPACECRAFT_RECEIPT;
      return Boolean(receipt) && receipt.status !== 'pending' && Boolean(receipt.lastAction || receipt.lastError);
    }, null, { timeout: 15000 });

    observed = normalizeReceipt(await page.evaluate(() => globalThis.DGB_LAWS_SPACECRAFT_RECEIPT || null));
  } catch (error) {
    captureError = error?.stack || String(error);
    try {
      observed = normalizeReceipt(await page.evaluate(() => globalThis.DGB_LAWS_SPACECRAFT_RECEIPT || null));
    } catch {
      // Preserve the primary capture failure; browser teardown follows below.
    }
  } finally {
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }

  const outcome = captureError
    ? 'CAPTURE_FAILURE'
    : matchesExpected(observed)
      ? 'MATCH'
      : 'FALSIFIED';

  const receipt = {
    contract: 'LAWS_FIREFOX_SPACECRAFT_RECEIPT_OBSERVABILITY_v1',
    subjectHead: SUBJECT_HEAD,
    diagnosticHead: DIAGNOSTIC_HEAD,
    role: ROLE,
    browser: 'firefox',
    profile: 'phone',
    viewport: VIEWPORT,
    expected: EXPECTED,
    observed,
    outcome,
    browserErrors,
    captureError
  };

  writeReceipt(receipt);

  if (outcome === 'CAPTURE_FAILURE') {
    throw new Error(`SPACECRAFT_RECEIPT_CAPTURE_FAILURE:${captureError}`);
  }
  if (outcome === 'FALSIFIED') {
    throw new Error(`SPACECRAFT_RECEIPT_CAUSAL_CANDIDATE_FALSIFIED:${JSON.stringify(observed)}`);
  }
}

main().catch(error => {
  console.error(error?.stack || String(error));
  process.exit(1);
});
