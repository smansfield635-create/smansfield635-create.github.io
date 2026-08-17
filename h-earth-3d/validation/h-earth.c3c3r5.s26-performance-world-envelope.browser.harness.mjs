#!/usr/bin/env node
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from 'playwright';

const BASELINE_SHA = '2152ad18c1691c4056e9ae39795ad44228dbdc19';
const VIEWPORT = Object.freeze({ width: 390, height: 844 });
const ACTIVE_TRACE_MS = 900;
const SETTLE_MS = 180;
const LONG_FRAME_MS = 20;
const DROPPED_FRAME_MS = 34;
const RECOVERY_BOUND_MS = 96;
const ROUTE = '/showroom/globe/h-earth/?visual=terrain-relief-v2';

function parse(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!['--baseline-root', '--candidate-root', '--candidate-sha', '--output', '--evidence-dir'].includes(key) || value == null) {
      throw new Error(`CLI_INVALID:${key}`);
    }
    out[key.slice(2)] = value;
  }
  for (const key of ['baseline-root', 'candidate-root', 'candidate-sha', 'output', 'evidence-dir']) {
    if (!out[key]) throw new Error(`CLI_REQUIRED:${key}`);
  }
  return out;
}

const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const stable = (value) => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]))
    : value;

function percentile(values, fraction) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * fraction) - 1))];
}

function summarizePacing(intervals) {
  const valid = intervals.filter((value) => Number.isFinite(value) && value >= 0);
  return Object.freeze({
    sampleCount: valid.length,
    medianMs: percentile(valid, 0.5),
    p95Ms: percentile(valid, 0.95),
    maximumMs: valid.length ? Math.max(...valid) : 0,
    longFrameCount: valid.filter((value) => value > LONG_FRAME_MS).length,
    droppedFrameCount: valid.filter((value) => value > DROPPED_FRAME_MS).length
  });
}

function mime(filePath) {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) return 'text/javascript; charset=utf-8';
  if (filePath.endsWith('.json')) return 'application/json; charset=utf-8';
  if (filePath.endsWith('.svg')) return 'image/svg+xml';
  if (filePath.endsWith('.png')) return 'image/png';
  if (filePath.endsWith('.webp')) return 'image/webp';
  return 'application/octet-stream';
}

async function staticServer(root) {
  const resolvedRoot = path.resolve(root);
  const server = http.createServer((req, res) => {
    try {
      const url = new URL(req.url, 'http://127.0.0.1');
      let pathname = decodeURIComponent(url.pathname);
      if (pathname.endsWith('/')) pathname += 'index.html';
      const candidate = path.resolve(resolvedRoot, `.${pathname}`);
      if (!candidate.startsWith(`${resolvedRoot}${path.sep}`) && candidate !== resolvedRoot) {
        res.writeHead(403).end('forbidden');
        return;
      }
      if (!fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) {
        res.writeHead(404).end('not found');
        return;
      }
      res.writeHead(200, { 'content-type': mime(candidate), 'cache-control': 'no-store' });
      fs.createReadStream(candidate).pipe(res);
    } catch (error) {
      res.writeHead(500).end(String(error?.message ?? error));
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  return { server, origin: `http://127.0.0.1:${address.port}` };
}

async function waitReady(page) {
  await page.waitForFunction(() => window.H_EARTH_RUN8E_PUBLIC_ROUTE?.ready === true, null, { timeout: 30_000 });
  await page.waitForFunction(() => {
    const receipt = window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getReceipt?.();
    return receipt?.liveGpu?.counters?.gpuFramebufferPresentationCount >= 1;
  }, null, { timeout: 30_000 });
}

async function runTrace({ browser, origin, label, evidenceDir }) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    screen: VIEWPORT,
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'no-preference'
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto(`${origin}${ROUTE}`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await waitReady(page);

  const before = await page.evaluate(() => ({
    publicReceipt: window.H_EARTH_RUN8E_PUBLIC_ROUTE.getReceipt(),
    diagnostic: window.H_EARTH_RUNTIME_DIAGNOSTICS?.getSnapshot?.() ?? null
  }));

  await page.screenshot({ path: path.join(evidenceDir, `${label}-before.png`), fullPage: false });

  const trace = await page.evaluate(async ({ activeMs, settleMs }) => {
    const canvas = document.getElementById('h-earth-functional-landscape-canvas');
    if (!(canvas instanceof HTMLCanvasElement)) throw new Error('TRACE_CANVAS_MISSING');
    const rect = canvas.getBoundingClientRect();
    const pointerId = 26;
    const startX = rect.left + rect.width * 0.50;
    const startY = rect.top + rect.height * 0.52;
    const movedX = rect.left + rect.width * 0.72;
    const movedY = rect.top + rect.height * 0.40;
    const intervals = [];
    let previous = null;
    let sampling = true;
    const raf = (timestamp) => {
      if (sampling && previous !== null) intervals.push(timestamp - previous);
      previous = timestamp;
      if (sampling) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const dispatch = (type, x, y, buttons) => canvas.dispatchEvent(new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      pointerId,
      pointerType: 'touch',
      isPrimary: true,
      clientX: x,
      clientY: y,
      buttons,
      pressure: buttons ? 0.5 : 0
    }));

    dispatch('pointerdown', startX, startY, 1);
    await new Promise((resolve) => setTimeout(resolve, 32));
    dispatch('pointermove', movedX, movedY, 1);
    await new Promise((resolve) => setTimeout(resolve, activeMs));
    sampling = false;
    dispatch('pointerup', movedX, movedY, 0);
    const releaseAt = performance.now();
    await new Promise((resolve) => setTimeout(resolve, settleMs));
    const settledAt = performance.now();
    return { intervals, releaseAt, settledAt, activeMs, settleMs };
  }, { activeMs: ACTIVE_TRACE_MS, settleMs: SETTLE_MS });

  const after = await page.evaluate(() => ({
    publicReceipt: window.H_EARTH_RUN8E_PUBLIC_ROUTE.getReceipt(),
    diagnostic: window.H_EARTH_RUNTIME_DIAGNOSTICS?.getSnapshot?.() ?? null
  }));
  await page.screenshot({ path: path.join(evidenceDir, `${label}-after.png`), fullPage: false });

  const beforeIntake = before.publicReceipt.intake?.counters ?? {};
  const afterIntake = after.publicReceipt.intake?.counters ?? {};
  const beforeGpu = before.publicReceipt.liveGpu?.counters ?? {};
  const afterGpu = after.publicReceipt.liveGpu?.counters ?? {};
  const interaction = after.publicReceipt.liveGpu?.resources?.c3c3?.interactionPerformance ?? null;
  const resources = after.publicReceipt.liveGpu?.resources ?? null;

  const result = {
    label,
    viewport: VIEWPORT,
    activeTraceMs: ACTIVE_TRACE_MS,
    settleMs: SETTLE_MS,
    pacing: summarizePacing(trace.intervals),
    counters: {
      navigationProposalDelta: (afterIntake.navigationProposalCount ?? 0) - (beforeIntake.navigationProposalCount ?? 0),
      acceptedNavigationProposalDelta: (afterIntake.acceptedNavigationProposalCount ?? 0) - (beforeIntake.acceptedNavigationProposalCount ?? 0),
      oneFingerLookProposalDelta: (afterIntake.oneFingerLookProposalCount ?? 0) - (beforeIntake.oneFingerLookProposalCount ?? 0),
      touchPointerEventDelta: (afterIntake.touchPointerEventCount ?? 0) - (beforeIntake.touchPointerEventCount ?? 0),
      visibleFrameDelta: (afterGpu.gpuFramebufferPresentationCount ?? 0) - (beforeGpu.gpuFramebufferPresentationCount ?? 0)
    },
    interactionPerformance: interaction,
    rendererResources: resources ? {
      contextCreationCount: resources.counters?.contextCreationCount ?? null,
      postInitializationResourceCreationCount: resources.counters?.postInitializationResourceCreationCount ?? null,
      postInitializationBufferUploadCount: resources.counters?.postInitializationBufferUploadCount ?? null,
      c3c3: resources.c3c3 ?? null
    } : null,
    consoleErrors,
    pageErrors,
    diagnostics: after.diagnostic
  };

  await context.close();
  return result;
}

function performancePass(baseline, candidate) {
  const b = baseline.pacing;
  const c = candidate.pacing;
  const metrics = candidate.interactionPerformance;
  const comparative = {
    p95NonRegression: c.p95Ms <= b.p95Ms * 1.05 + 0.5,
    maximumNonRegression: c.maximumMs <= b.maximumMs * 1.10 + 1,
    longFramesNonRegression: c.longFrameCount <= b.longFrameCount,
    droppedFramesNonRegression: c.droppedFrameCount <= b.droppedFrameCount,
    proposalContinuity: candidate.counters.oneFingerLookProposalDelta > 0 && candidate.counters.acceptedNavigationProposalDelta > 0,
    visibleFrameContinuity: candidate.counters.visibleFrameDelta > 0,
    reducedTierObserved: metrics?.activeMotionProposalCount > 0 && metrics?.policy?.interactionRenderScale === 0.70,
    interactionShaderDeclared: metrics?.policy?.interactionShaderMode === 'INTERACTION_SIMPLIFIED_TERRAIN',
    recoveryBoundDeclared: metrics?.policy?.fullQualityRecoveryMs === RECOVERY_BOUND_MS,
    recoveryExecuted: metrics?.recoveryFrameCount > 0,
    fullQualityRestored: metrics?.activeShaderMode === 'FULL_C3C3R5' && metrics?.interactionResolutionScale === 1 && metrics?.fullQualityRecoveryPending === false,
    synchronousTimingRecorded: Number.isFinite(metrics?.maximumSynchronousProposalToPresentMs),
    persistentResourcesStable: candidate.rendererResources?.contextCreationCount === 1 && candidate.rendererResources?.postInitializationResourceCreationCount === 0 && candidate.rendererResources?.postInitializationBufferUploadCount === 0,
    noBrowserErrors: candidate.consoleErrors.length === 0 && candidate.pageErrors.length === 0
  };
  return { pass: Object.values(comparative).every(Boolean), comparative };
}

async function main() {
  const args = parse(process.argv.slice(2));
  if (!/^[0-9a-f]{40}$/.test(args['candidate-sha'])) throw new Error('CANDIDATE_SHA_INVALID');
  fs.mkdirSync(args['evidence-dir'], { recursive: true });
  const baselineServer = await staticServer(args['baseline-root']);
  const candidateServer = await staticServer(args['candidate-root']);
  const browser = await chromium.launch({ headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
  try {
    const baseline = await runTrace({ browser, origin: baselineServer.origin, label: 'baseline', evidenceDir: args['evidence-dir'] });
    const candidate = await runTrace({ browser, origin: candidateServer.origin, label: 'candidate', evidenceDir: args['evidence-dir'] });
    const performance = performancePass(baseline, candidate);
    const receipt = stable({
      schema: 'H_EARTH_C3C3R5_S26_PERFORMANCE_WORLD_ENVELOPE_BROWSER_RECEIPT_v1',
      operationId: 'H_EARTH_C3C3R5_S26_PERFORMANCE_WORLD_ENVELOPE_SUCCESSOR_20260817_001',
      baselineSha: BASELINE_SHA,
      candidateSha: args['candidate-sha'],
      exactComparativeConditions: {
        viewport: VIEWPORT,
        activeTraceMs: ACTIVE_TRACE_MS,
        settleMs: SETTLE_MS,
        pointerType: 'touch',
        activePointerCount: 1,
        route: ROUTE,
        sameBrowserOccurrence: true
      },
      baseline,
      candidate,
      s26MeasurableFluidityPass: performance.pass,
      performanceChecks: performance.comparative,
      result: performance.pass ? 'PASS' : 'REPAIR_REQUIRED',
      boundaries: {
        physicalDeviceAcceptanceCreated: false,
        ownerVisualAcceptanceCreated: false,
        mergeAuthorityCreated: false,
        deploymentAuthorityCreated: false
      }
    });
    const text = `${JSON.stringify(receipt, null, 2)}\n`;
    fs.writeFileSync(args.output, text);
    fs.writeFileSync(path.join(args['evidence-dir'], 'browser-receipt.sha256'), `${sha256(Buffer.from(text))}\n`);
    process.stdout.write(text);
    if (!performance.pass) process.exitCode = 1;
  } finally {
    await browser.close();
    await new Promise((resolve) => baselineServer.server.close(resolve));
    await new Promise((resolve) => candidateServer.server.close(resolve));
  }
}

main().catch((error) => {
  process.stderr.write(`${error.stack ?? error}\n`);
  process.exitCode = 1;
});
