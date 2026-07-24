import path from 'node:path';
import process from 'node:process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

import {
  EXPECTED_PACKET_002_SOURCE_OBJECT_IDS,
  H_EARTH_RENDERER_CORRIDOR_CAPACITY_LAW_CONTRACT_ID,
  evaluateHEarthRendererCorridorBudgets
} from '../h-earth-3d/integration/h-earth.renderer-corridor-capacity-law.mjs';

import {
  EXPECTED_ROUTE_STATUS,
  H_EARTH_RENDERER_CORRIDOR_COMMON_CONTRACT_ID,
  attachDeterministicDigest,
  classifyObservation,
  moduleGraphEvaluation,
  observeHEarthRoute,
  pathnameFromUrl,
  repositoryRootFromThisModule,
  writeJson
} from './h-earth-renderer-corridor-common.mjs';

export const H_EARTH_DEPLOYED_ROUTE_SMOKE_PROBE_CONTRACT_ID =
  'H_EARTH_DEPLOYED_ROUTE_RENDERER_MOUNT_SMOKE_PROBE_v1';

const TARGET_URL =
  process.env.H_EARTH_DEPLOYED_URL ??
  'https://diamondgatebridge.com/showroom/globe/h-earth/';

const MAX_ATTEMPTS = Number.parseInt(
  process.env.H_EARTH_DEPLOYED_MAX_ATTEMPTS ?? '6',
  10
);

const RETRY_DELAY_MS = Number.parseInt(
  process.env.H_EARTH_DEPLOYED_RETRY_DELAY_MS ?? '20000',
  10
);

const PROFILE = Object.freeze({
  id: 'DEPLOYED_DESKTOP_LANDSCAPE_DPR_1',
  viewport: Object.freeze({ width: 1440, height: 900 }),
  deviceScaleFactor: 1,
  isMobile: false,
  hasTouch: false
});

const REQUIRED_RUNTIME_PATHS = new Set([
  '/showroom/globe/h-earth/',
  '/showroom/globe/h-earth/index.html',
  '/showroom/globe/h-earth/index.js',
  '/showroom/globe/h-earth/compositor.js',
  '/showroom/globe/h-earth/renderer.js',
  '/showroom/globe/h-earth/capacity.js',
  '/showroom/globe/h-earth/admitted-geometry-frame.js',
  '/showroom/globe/h-earth/render/shoreline-preview.js',
  '/showroom/globe/h-earth/render/geometry-kernel.js',
  '/h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js'
]);

function isRequiredRuntimeUrl(value) {
  const pathname = pathnameFromUrl(value);
  return pathname ? REQUIRED_RUNTIME_PATHS.has(pathname) : false;
}

function createAttemptUrl(attemptNumber) {
  const target = new URL(TARGET_URL);
  target.searchParams.set(
    'hEarthDeployedSmoke',
    `${process.env.GITHUB_SHA ?? 'manual'}-${attemptNumber}`
  );
  return target.href;
}

async function runAttempt(browser, attemptNumber) {
  const requestUrls = [];
  const requestFailures = [];
  const errorResponses = [];
  const pageErrors = [];
  const consoleErrors = [];
  const responseHeaders = {};

  const context = await browser.newContext({
    viewport: PROFILE.viewport,
    deviceScaleFactor: PROFILE.deviceScaleFactor,
    isMobile: PROFILE.isMobile,
    hasTouch: PROFILE.hasTouch,
    storageState: undefined,
    extraHTTPHeaders: {
      'Cache-Control': 'no-cache, no-store, max-age=0',
      Pragma: 'no-cache'
    }
  });
  await context.clearCookies();

  const page = await context.newPage();

  page.on('request', (request) => requestUrls.push(request.url()));

  page.on('requestfailed', (request) => {
    if (!isRequiredRuntimeUrl(request.url())) return;
    requestFailures.push({
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType(),
      errorText: request.failure()?.errorText ?? null
    });
  });

  page.on('response', async (response) => {
    if (!isRequiredRuntimeUrl(response.url())) return;
    if (response.status() >= 400) {
      errorResponses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    }

    if (response.request().resourceType() === 'document') {
      Object.assign(responseHeaders, await response.allHeaders());
    }
  });

  page.on('pageerror', (error) => {
    pageErrors.push({
      name: error?.name ?? 'Error',
      message: error?.message ?? String(error),
      stack: error?.stack ?? null
    });
  });

  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    consoleErrors.push({
      text: message.text(),
      location: message.location()
    });
  });

  const attemptUrl = createAttemptUrl(attemptNumber);
  let navigationError = null;
  try {
    await page.goto(attemptUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 60_000
    });

    await page.waitForFunction(
      ({ expectedStatus }) => {
        const status = document
          .getElementById('h-earth-3d-status')
          ?.textContent
          ?.trim();
        return (
          status === expectedStatus ||
          Boolean(globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_ENTRY_FAILURE)
        );
      },
      { expectedStatus: EXPECTED_ROUTE_STATUS },
      { timeout: 90_000 }
    );

    await page.waitForFunction(
      () =>
        Boolean(globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_ENTRY_RECEIPT) ||
        Boolean(globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_ENTRY_FAILURE),
      null,
      { timeout: 30_000 }
    );
  } catch (error) {
    navigationError = {
      name: error?.name ?? 'Error',
      message: error?.message ?? String(error),
      stack: error?.stack ?? null
    };
  }

  const observation = await observeHEarthRoute(page);
  const moduleGraph = moduleGraphEvaluation(requestUrls);
  const capacityEvaluation = evaluateHEarthRendererCorridorBudgets({
    admittedPrimitiveCount: observation.counts.admittedSourcePrimitives,
    projectedFragmentCount: observation.counts.projectedFragmentDomNodes,
    semanticContainerCount: observation.counts.semanticContainers,
    interactionNodeCount: observation.counts.interactionNodes,
    finalRendererOwnedDomNodeCount: observation.counts.finalRendererOwnedDomNodes,
    requireExactProductionPacket002: true
  });

  const effectivePageErrors = navigationError
    ? [...pageErrors, navigationError]
    : pageErrors;

  const classification = classifyObservation({
    observation,
    moduleGraph,
    capacityEvaluation,
    expectedObjectIds: EXPECTED_PACKET_002_SOURCE_OBJECT_IDS,
    requestFailures,
    errorResponses,
    pageErrors: effectivePageErrors,
    consoleErrors
  });

  const receipt = attachDeterministicDigest({
    receiptType: 'H_EARTH_DEPLOYED_ROUTE_SMOKE_ATTEMPT_RECEIPT',
    contractId: H_EARTH_DEPLOYED_ROUTE_SMOKE_PROBE_CONTRACT_ID,
    commonContractId: H_EARTH_RENDERER_CORRIDOR_COMMON_CONTRACT_ID,
    capacityLawContractId: H_EARTH_RENDERER_CORRIDOR_CAPACITY_LAW_CONTRACT_ID,
    expectedRepositoryCommit: process.env.GITHUB_SHA ?? null,
    attemptNumber,
    targetUrl: TARGET_URL,
    auditedUrl: attemptUrl,
    profile: PROFILE,
    responseHeaders,
    moduleGraph,
    frameIdentity: observation.frameIdentity,
    frameViewport: observation.frameViewport,
    projectionContext: observation.projectionContext,
    counts: observation.counts,
    clippingTotals: observation.clippingTotals,
    routeState: {
      status: observation.routeStatus,
      dataset: observation.routeDataset,
      fallbackRestored: observation.fallbackRestored
    },
    objectIdentity: {
      expected: EXPECTED_PACKET_002_SOURCE_OBJECT_IDS,
      observed: observation.observedObjectIds
    },
    capacityEvaluation,
    requestFailures,
    errorResponses,
    pageErrors: effectivePageErrors,
    consoleErrors,
    classification,
    deployedRoutePassEstablished: classification.passed === true
  });

  await context.close();
  return receipt;
}

async function main() {
  if (!Number.isSafeInteger(MAX_ATTEMPTS) || MAX_ATTEMPTS < 1) {
    throw new Error('H_EARTH_DEPLOYED_MAX_ATTEMPTS must be a positive integer.');
  }
  if (!Number.isSafeInteger(RETRY_DELAY_MS) || RETRY_DELAY_MS < 0) {
    throw new Error('H_EARTH_DEPLOYED_RETRY_DELAY_MS must be a non-negative integer.');
  }

  const repositoryRoot = repositoryRootFromThisModule(import.meta.url);
  const outputDirectory = path.join(
    repositoryRoot,
    'artifacts',
    'h-earth-deployed-route-smoke'
  );

  const browser = await chromium.launch({ headless: true });
  const attempts = [];

  try {
    for (let attemptNumber = 1; attemptNumber <= MAX_ATTEMPTS; attemptNumber += 1) {
      const receipt = await runAttempt(browser, attemptNumber);
      attempts.push(receipt);
      await writeJson(
        path.join(outputDirectory, `attempt-${attemptNumber}.receipt.json`),
        receipt
      );

      if (receipt.deployedRoutePassEstablished) break;
      if (attemptNumber < MAX_ATTEMPTS && RETRY_DELAY_MS > 0) {
        await delay(RETRY_DELAY_MS);
      }
    }
  } finally {
    await browser.close();
  }

  const successfulAttempt = attempts.find(
    (attempt) => attempt.deployedRoutePassEstablished === true
  ) ?? null;

  const aggregateReceipt = attachDeterministicDigest({
    receiptType: 'H_EARTH_DEPLOYED_ROUTE_SMOKE_AGGREGATE_RECEIPT',
    contractId: H_EARTH_DEPLOYED_ROUTE_SMOKE_PROBE_CONTRACT_ID,
    expectedRepositoryCommit: process.env.GITHUB_SHA ?? null,
    targetUrl: TARGET_URL,
    freshBrowserProfilePerAttempt: true,
    cacheBypassRequested: true,
    attemptCount: attempts.length,
    successfulAttemptNumber: successfulAttempt?.attemptNumber ?? null,
    deployedRoutePassEstablished: successfulAttempt !== null,
    attempts
  });

  await writeJson(
    path.join(outputDirectory, 'aggregate.receipt.json'),
    aggregateReceipt
  );

  process.stdout.write(
    `${JSON.stringify({
      status: aggregateReceipt.deployedRoutePassEstablished ? 'PASS' : 'FAIL',
      targetUrl: TARGET_URL,
      attemptCount: aggregateReceipt.attemptCount,
      successfulAttemptNumber: aggregateReceipt.successfulAttemptNumber,
      receipt: 'artifacts/h-earth-deployed-route-smoke/aggregate.receipt.json'
    }, null, 2)}\n`
  );

  if (!aggregateReceipt.deployedRoutePassEstablished) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('[H-Earth deployed route smoke probe fatal error]', error);
  process.exitCode = 1;
});
