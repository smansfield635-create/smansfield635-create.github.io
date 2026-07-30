import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import reconciliation from '../../control-plane/instrument-platform/H_EARTH_SPECIALIZED_GAUGE_AUTHORITY_RECONCILIATION_001.v1.mjs';
import toolRegistry from '../../tools/instrument-platform/tool-registry.mjs';
import sceneRegistry from '../../tools/instrument-platform/permanent-scene-registry.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const RECEIPT_PATH = path.join(HERE, 'h-earth.specialized-gauge-authority-reconciliation.browser.receipt.v1.json');
const EVIDENCE_DIR = path.join(HERE, 'evidence', 'specialized-gauge-authority-reconciliation');
const ORIGIN = process.env.H_EARTH_GAUGE_ORIGIN ?? 'http://127.0.0.1:4185';
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const fileSha256 = (repositoryPath) => sha256(fs.readFileSync(path.join(ROOT, repositoryPath)));
const checks = [];
const failures = [];
const check = (id, passed, detail = null) => {
  const record = { id, passed: Boolean(passed), status: passed ? 'PASS' : 'FAIL', detail };
  checks.push(record);
  if (!passed) failures.push(record);
  return record;
};
const head = git('rev-parse', 'HEAD');
const base = reconciliation.exactBase;
const mergeBase = git('merge-base', base, head);
const changedPaths = git('diff', '--name-only', `${base}..${head}`).split(/\r?\n/).filter(Boolean).sort();
const expectedPaths = [
  '.github/workflows/h-earth-instrument-platform.yml',
  '.github/workflows/h-earth-specialized-gauge-authority-reconciliation.yml',
  'gauges/h-earth/h-earth.current-authority-gauge.v3.mjs',
  'gauges/h-earth/index.html',
  'h-earth-3d/control-plane/instrument-platform/H_EARTH_SPECIALIZED_GAUGE_AUTHORITY_RECONCILIATION_001.v1.mjs',
  'h-earth-3d/tools/instrument-platform/instrument-adapters.mjs',
  'h-earth-3d/tools/instrument-platform/tool-registry.mjs',
  'h-earth-3d/validation/instrument-platform/h-earth.specialized-gauge-authority-reconciliation.browser.mjs',
  'h-earth-3d/validation/instrument-platform/h-earth.specialized-gauge-authority-reconciliation.runner.mjs'
].sort();

check('EXACT_RECONCILIATION_BASE', mergeBase === base, { base, head, mergeBase });
check('EXACT_A5_PATH_SCOPE', JSON.stringify(changedPaths) === JSON.stringify(expectedPaths), { changedPaths, expectedPaths });
check('ALL_A5_PATHS_EXIST', expectedPaths.every((entry) => fs.existsSync(path.join(ROOT, entry))));
check('NO_SHOWROOM_PRODUCT_PATH_MUTATION', changedPaths.every((entry) => !entry.startsWith('showroom/')), { changedPaths });
check('NO_TERRAIN_PATH_MUTATION', changedPaths.every((entry) => !entry.startsWith('h-earth-3d/terrain/')), { changedPaths });
check('NO_ACCEPTED_RENDERER_OR_LIVE_BINDING_MUTATION', changedPaths.every((entry) => !entry.includes('persistent-live-renderer') && !entry.endsWith('/live-gpu-binding.js')), { changedPaths });
check('TOOL_REGISTRY_DIGEST_MATCH', toolRegistry.registryDigest === reconciliation.registryIdentityTransition.candidateToolRegistryDigest, { actual: toolRegistry.registryDigest, expected: reconciliation.registryIdentityTransition.candidateToolRegistryDigest });
check('SCENE_REGISTRY_DIGEST_UNCHANGED', sceneRegistry.registryDigest === reconciliation.registryIdentityTransition.permanentSceneRegistryDigest, { actual: sceneRegistry.registryDigest, expected: reconciliation.registryIdentityTransition.permanentSceneRegistryDigest });

const deterministicRunnerPath = path.join(HERE, 'h-earth.specialized-gauge-authority-reconciliation.runner.mjs');
const deterministicOutput = execFileSync(process.execPath, [deterministicRunnerPath], { cwd: ROOT, encoding: 'utf8' });
const deterministicReceipt = JSON.parse(deterministicOutput);
check('A4_DETERMINISTIC_RUNNER_REGRESSION', deterministicReceipt.status === 'PASS_CLOSED' && deterministicReceipt.assertionCount === 49, deterministicReceipt);

fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist']
});
const consoleErrors = [];
const pageErrors = [];
const httpErrors = [];
const attachEvidenceCapture = (page, pageId) => {
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push({ pageId, text: message.text() });
  });
  page.on('pageerror', (error) => pageErrors.push({ pageId, message: error.message }));
  page.on('response', (response) => {
    if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) {
      httpErrors.push({ pageId, status: response.status(), url: response.url() });
    }
  });
};

let directReceipt = null;
let repeatReceipt = null;
let adapterObservation = null;
let adapterExecution = null;
try {
  const gaugePage = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });
  gaugePage.setDefaultTimeout(900000);
  attachEvidenceCapture(gaugePage, 'DIRECT_GAUGE');
  const gaugeUrl = `${ORIGIN}/gauges/h-earth/index.html?head=${encodeURIComponent(head)}`;
  await gaugePage.goto(gaugeUrl, { waitUntil: 'domcontentloaded', timeout: 240000 });
  await gaugePage.waitForFunction(
    () => document.documentElement.dataset.gaugesReceiptDigest && document.documentElement.dataset.currentAuthorityGaugeReceipt !== 'UNRESOLVED',
    null,
    { timeout: 900000 }
  );
  directReceipt = await gaugePage.evaluate(() => window.H_EARTH_CURRENT_AUTHORITY_GAUGE.getReceipt());
  await gaugePage.screenshot({ path: path.join(EVIDENCE_DIR, 'h-earth-current-authority-gauge.png'), fullPage: true });
  repeatReceipt = await gaugePage.evaluate(async ({ sourceHead }) => window.H_EARTH_CURRENT_AUTHORITY_GAUGE.run({ sourceHead }), { sourceHead: head });
  await gaugePage.close();

  const platformPage = await browser.newPage({ viewport: { width: 1920, height: 1400 }, deviceScaleFactor: 1 });
  platformPage.setDefaultTimeout(900000);
  attachEvidenceCapture(platformPage, 'UNIFIED_PLATFORM');
  const platformUrl = `${ORIGIN}/h-earth-3d/tools/instrument-platform/index.html?head=${encodeURIComponent(head)}`;
  await platformPage.goto(platformUrl, { waitUntil: 'domcontentloaded', timeout: 240000 });
  await platformPage.waitForFunction(() => document.documentElement.dataset.instrumentPlatformReady === 'true', null, { timeout: 600000 });
  await platformPage.waitForFunction(() => document.documentElement.dataset.postMergeProofReady === 'true', null, { timeout: 600000 });
  await platformPage.waitForFunction(() => {
    const frame = document.getElementById('instrument-frame');
    try {
      return Boolean(frame?.contentWindow?.H_EARTH_CURRENT_AUTHORITY_GAUGE?.getReceipt?.());
    } catch {
      return false;
    }
  }, null, { timeout: 900000 });
  adapterObservation = await platformPage.evaluate(async () => window.H_EARTH_INSTRUMENT_PLATFORM.activateTool('H_EARTH_GAUGES'));
  adapterExecution = await platformPage.evaluate(async () => window.H_EARTH_INSTRUMENT_PLATFORM.executeActiveTool('RUN_CURRENT_AUTHORITY_AUDIT'));
  await platformPage.screenshot({ path: path.join(EVIDENCE_DIR, 'h-earth-current-authority-gauge-through-unified-platform.png'), fullPage: true });
  await platformPage.close();
} finally {
  await browser.close();
}

const directReadiness = directReceipt?.readiness ?? {};
check('DIRECT_GAUGE_RECEIPT_PRESENT', Boolean(directReceipt), directReceipt);
check('DIRECT_GAUGE_EXACT_EXECUTED_HEAD', directReceipt?.executedSourceHead === head, { actual: directReceipt?.executedSourceHead, expected: head });
check('DIRECT_GAUGE_ELEVEN_RESULTS', directReceipt?.results?.length === 11, { count: directReceipt?.results?.length });
check('DIRECT_GAUGE_REQUIRED_APPLICABLE_COUNT', directReadiness.requiredApplicableChecks === 11, directReadiness);
check('DIRECT_GAUGE_REQUIRED_PASSES', directReadiness.requiredApplicablePasses === 11, directReadiness);
check('DIRECT_GAUGE_REQUIRED_FAILURES_ZERO', directReadiness.requiredApplicableFailures === 0, directReadiness);
check('DIRECT_GAUGE_REQUIRED_UNRESOLVED_ZERO', directReadiness.requiredApplicableUnresolved === 0, directReadiness);
check('DIRECT_GAUGE_READINESS_100', directReadiness.readinessPercent === 100, directReadiness);
check('DIRECT_GAUGE_MERGE_ELIGIBLE', directReadiness.mergeEligible === true, directReadiness);
check('DIRECT_GAUGE_ALL_CURRENT_CHECKS_PASS', directReceipt?.results?.every((result) => result.status === 'PASS') === true, directReceipt?.results);
check('GROUND_VIEW_DERIVED_FROM_CURRENT_AUTHORITY', directReceipt?.derivedAuthorityRecords?.find((record) => record.recordId === 'GROUND_VIEW_STATUS')?.value === 'ACTIVE_PUBLIC_NAVIGABLE_GROUND_VIEW', directReceipt?.derivedAuthorityRecords);
check('MANOR_STATUS_DERIVED_FROM_CURRENT_AUTHORITY', directReceipt?.derivedAuthorityRecords?.find((record) => record.recordId === 'ESTATE_OR_MANOR_STATUS')?.value === 'SITE_ENVELOPE_ACCEPTED_DETAILED_ARCHITECTURE_DEFERRED', directReceipt?.derivedAuthorityRecords);
check('NO_HARDCODED_DERIVED_STATUS', directReceipt?.derivedAuthorityRecords?.every((record) => record.hardcoded === false) === true, directReceipt?.derivedAuthorityRecords);
check('LEGACY_ELEVEN_ROWS_PRESERVED', directReceipt?.legacyDispositions?.length === 11, { count: directReceipt?.legacyDispositions?.length });
check('REPEATED_RECEIPT_DIGEST_IDENTICAL', directReceipt?.receiptDigest === repeatReceipt?.receiptDigest, { first: directReceipt?.receiptDigest, second: repeatReceipt?.receiptDigest });

const observedGauge = adapterObservation?.payload;
const executedGauge = adapterExecution?.result;
check('UNIFIED_PLATFORM_ADAPTER_OBSERVED_GAUGE', adapterObservation?.toolId === 'H_EARTH_GAUGES' && observedGauge?.ready === true, adapterObservation);
check('UNIFIED_PLATFORM_ADAPTER_EXACT_EXECUTED_HEAD', observedGauge?.executedSourceHead === head, { actual: observedGauge?.executedSourceHead, expected: head });
check('UNIFIED_PLATFORM_ADAPTER_READINESS_100', observedGauge?.readiness === 100 && observedGauge?.mergeEligible === true, observedGauge);
check('UNIFIED_PLATFORM_ADAPTER_COUNTS', observedGauge?.counts?.required === 11 && observedGauge?.counts?.pass === 11 && observedGauge?.counts?.fail === 0 && observedGauge?.counts?.unresolved === 0, observedGauge?.counts);
check('UNIFIED_PLATFORM_BOUNDED_ACTION_EXECUTED', adapterExecution?.toolId === 'H_EARTH_GAUGES' && adapterExecution?.action === 'RUN_CURRENT_AUTHORITY_AUDIT', adapterExecution);
check('UNIFIED_PLATFORM_ACTION_RECEIPT_MATCHES_DIRECT', executedGauge?.receiptDigest === directReceipt?.receiptDigest, { direct: directReceipt?.receiptDigest, adapter: executedGauge?.receiptDigest });

check('BROWSER_PAGE_ERRORS_ZERO', pageErrors.length === 0, pageErrors);
check('BROWSER_CONSOLE_ERRORS_ZERO', consoleErrors.length === 0, consoleErrors);
check('BROWSER_HTTP_ERRORS_ZERO', httpErrors.length === 0, httpErrors);

const body = {
  receiptType: 'H_EARTH_SPECIALIZED_GAUGE_AUTHORITY_RECONCILIATION_A5_BROWSER_RECEIPT_v1',
  operationId: reconciliation.operationId,
  checkpointId: 'A5_EXACT_BROWSER_EXECUTION',
  status: failures.length === 0 ? 'PASS_CLOSED' : 'FAIL',
  exactBase: base,
  executedHead: head,
  changedPaths,
  checks,
  failureCount: failures.length,
  failures,
  deterministicKernelReceipt: deterministicReceipt,
  directGauge: {
    receiptDigest: directReceipt?.receiptDigest ?? null,
    readiness: directReadiness,
    results: directReceipt?.results ?? [],
    derivedAuthorityRecords: directReceipt?.derivedAuthorityRecords ?? []
  },
  repeatedGaugeReceiptDigest: repeatReceipt?.receiptDigest ?? null,
  unifiedPlatformAdapter: {
    observation: adapterObservation,
    execution: adapterExecution
  },
  browserEvidence: {
    consoleErrors,
    pageErrors,
    httpErrors,
    screenshots: [
      'h-earth-3d/validation/instrument-platform/evidence/specialized-gauge-authority-reconciliation/h-earth-current-authority-gauge.png',
      'h-earth-3d/validation/instrument-platform/evidence/specialized-gauge-authority-reconciliation/h-earth-current-authority-gauge-through-unified-platform.png'
    ]
  },
  boundaries: {
    repositoryMutationPerformedByGauge: false,
    liveHEarthMutationPerformed: false,
    showroomProductMutationPerformed: false,
    narrativePresentationMutationPerformed: false,
    userDifferentialRequired: false
  },
  stopBoundary: 'STOP_AFTER_EXACT_BROWSER_EXECUTION',
  nextCheckpoint: failures.length === 0 ? 'A6_PRODUCT_NON_MUTATION_AND_SEPARATION_AUDIT' : 'A5_HELD_WITH_BROWSER_BLOCKER'
};
const canonical = JSON.stringify(body);
const receipt = Object.freeze({ ...body, canonicalReceiptSha256: sha256(canonical) });
fs.writeFileSync(RECEIPT_PATH, `${JSON.stringify(receipt, null, 2)}\n`);
process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
if (failures.length > 0) process.exitCode = 1;
