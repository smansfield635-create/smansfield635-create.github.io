import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

import {
  EXPECTED_PACKET_002_SOURCE_OBJECT_IDS,
  H_EARTH_RENDERER_CORRIDOR_CAPACITY_LAW_CONTRACT_ID,
  evaluateHEarthRendererCorridorBudgets
} from './h-earth-renderer-corridor-capacity-law.mjs';

import {
  H_EARTH_RENDERER_CORRIDOR_COMMON_CONTRACT_ID,
  EXPECTED_ROUTE_STATUS,
  attachDeterministicDigest,
  classifyObservation,
  createStaticRepositoryServer,
  moduleGraphEvaluation,
  observeHEarthRoute,
  pathnameFromUrl,
  repositoryRootFromThisModule,
  writeJson
} from './h-earth-renderer-corridor-common.mjs';

import {
  H_EARTH_RENDERER_CORRIDOR_OBSERVATION_CONTRACT_ID,
  enrichHEarthRouteObservation,
  waitForHEarthTerminalRouteState
} from './h-earth-renderer-corridor-observation.mjs';

export const H_EARTH_RENDERER_CORRIDOR_INTEGRATION_HARNESS_CONTRACT_ID =
  'H_EARTH_RENDERER_CORRIDOR_INTEGRATION_HARNESS_v3';

const PROFILES = Object.freeze([
  Object.freeze({ id: 'SMALL_MOBILE_PORTRAIT_DPR_2', viewport: Object.freeze({ width: 360, height: 800 }), deviceScaleFactor: 2, isMobile: true, hasTouch: true }),
  Object.freeze({ id: 'LARGE_MOBILE_PORTRAIT_DPR_3', viewport: Object.freeze({ width: 430, height: 932 }), deviceScaleFactor: 3, isMobile: true, hasTouch: true }),
  Object.freeze({ id: 'TABLET_PORTRAIT_DPR_2', viewport: Object.freeze({ width: 820, height: 1180 }), deviceScaleFactor: 2, isMobile: true, hasTouch: true }),
  Object.freeze({ id: 'DESKTOP_LANDSCAPE_DPR_1', viewport: Object.freeze({ width: 1440, height: 900 }), deviceScaleFactor: 1, isMobile: false, hasTouch: false }),
  Object.freeze({ id: 'DESKTOP_LANDSCAPE_DPR_2', viewport: Object.freeze({ width: 1920, height: 1080 }), deviceScaleFactor: 2, isMobile: false, hasTouch: false })
]);

const REQUIRED_RUNTIME_PATHS = new Set([
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

function sortRecords(records) {
  return [...records].sort((left, right) =>
    JSON.stringify(left).localeCompare(JSON.stringify(right))
  );
}

async function runProfile(browser, baseUrl, profile, outputDirectory) {
  const requestUrls = [];
  const requestFailures = [];
  const errorResponses = [];
  const pageErrors = [];
  const consoleErrors = [];

  const context = await browser.newContext({
    viewport: profile.viewport,
    deviceScaleFactor: profile.deviceScaleFactor,
    isMobile: profile.isMobile,
    hasTouch: profile.hasTouch,
    extraHTTPHeaders: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' }
  });
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
  page.on('response', (response) => {
    if (!isRequiredRuntimeUrl(response.url()) || response.status() < 400) return;
    errorResponses.push({
      url: response.url(),
      status: response.status(),
      statusText: response.statusText()
    });
  });
  page.on('pageerror', (error) => pageErrors.push({
    name: error?.name ?? 'Error',
    message: error?.message ?? String(error),
    stack: error?.stack ?? null
  }));
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    consoleErrors.push({ text: message.text(), location: message.location() });
  });

  const routeUrl =
    `${baseUrl}/showroom/globe/h-earth/index.html` +
    `?hEarthRendererCorridorProfile=${encodeURIComponent(profile.id)}`;

  let navigationError = null;
  try {
    await page.goto(routeUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await waitForHEarthTerminalRouteState(page);
  } catch (error) {
    navigationError = {
      name: error?.name ?? 'Error',
      message: error?.message ?? String(error),
      stack: error?.stack ?? null
    };
  }

  const observation = enrichHEarthRouteObservation(
    await observeHEarthRoute(page)
  );
  const moduleGraph = moduleGraphEvaluation(requestUrls);
  const capacityEvaluation = evaluateHEarthRendererCorridorBudgets({
    admittedPrimitiveCount: observation.counts.admittedSourcePrimitives,
    projectedFragmentCount: observation.counts.projectedPlanFragmentCount,
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
    requestFailures: sortRecords(requestFailures),
    errorResponses: sortRecords(errorResponses),
    pageErrors: sortRecords(effectivePageErrors),
    consoleErrors: sortRecords(consoleErrors)
  });

  const receipt = attachDeterministicDigest({
    receiptType: 'H_EARTH_RENDERER_CORRIDOR_INTEGRATION_PROFILE_RECEIPT',
    contractId: H_EARTH_RENDERER_CORRIDOR_INTEGRATION_HARNESS_CONTRACT_ID,
    commonContractId: H_EARTH_RENDERER_CORRIDOR_COMMON_CONTRACT_ID,
    observationContractId: H_EARTH_RENDERER_CORRIDOR_OBSERVATION_CONTRACT_ID,
    capacityLawContractId: H_EARTH_RENDERER_CORRIDOR_CAPACITY_LAW_CONTRACT_ID,
    sourceCommit: process.env.GITHUB_SHA ?? 'LOCAL_UNCOMMITTED_WORKTREE',
    profile,
    route: '/showroom/globe/h-earth/index.html',
    terminalState: observation.terminalState,
    moduleGraph,
    frameIdentity: observation.frameIdentity,
    frameViewport: observation.frameViewport,
    projectionContext: observation.projectionContext,
    measurements: {
      admittedPrimitiveCount: observation.counts.admittedSourcePrimitives,
      projectedPlanFragmentCount: observation.counts.projectedPlanFragmentCount,
      mountedProjectedFragmentNodeCount:
        observation.counts.mountedProjectedFragmentNodeCount,
      semanticContainerCount: observation.counts.semanticContainers,
      interactionNodeCount: observation.counts.interactionNodes,
      finalRendererOwnedDomNodeCount: observation.counts.finalRendererOwnedDomNodes
    },
    counts: observation.counts,
    clippingTotals: observation.clippingTotals,
    construction: {
      succeeded: observation.rendererConstructionSucceeded,
      receipt: observation.constructReceipt
    },
    mount: {
      succeeded: observation.rendererMountSucceeded,
      receipt: observation.mountReceipt
    },
    routeState: {
      status: observation.routeStatus,
      dataset: observation.routeDataset,
      fallbackRestored: observation.fallbackRestored,
      fallbackText: observation.fallbackText
    },
    importState: {
      compositorImportSucceeded: observation.compositorImportSucceeded,
      rendererImportSucceeded: observation.rendererImportSucceeded,
      htmlDiagnostic: observation.htmlImportDiagnosticReceipt,
      routeDiagnostic: observation.moduleImportDiagnosticReceipt,
      requestFailures: sortRecords(requestFailures),
      errorResponses: sortRecords(errorResponses),
      pageErrors: sortRecords(effectivePageErrors),
      consoleErrors: sortRecords(consoleErrors)
    },
    objectIdentity: {
      expected: EXPECTED_PACKET_002_SOURCE_OBJECT_IDS,
      observed: observation.observedObjectIds
    },
    capacityEvaluation,
    classification
  });

  await writeJson(path.join(outputDirectory, `${profile.id}.receipt.json`), receipt);
  await context.close();
  return receipt;
}

async function main() {
  const repositoryRoot = repositoryRootFromThisModule(import.meta.url);
  const outputDirectory = path.join(repositoryRoot, 'artifacts', 'h-earth-renderer-corridor');
  const staticServer = createStaticRepositoryServer({ repositoryRoot });
  const serverAddress = await staticServer.start();
  const browser = await chromium.launch({ headless: true });
  const profileReceipts = [];

  try {
    for (const profile of PROFILES) {
      profileReceipts.push(
        await runProfile(browser, serverAddress.baseUrl, profile, outputDirectory)
      );
    }
  } finally {
    await browser.close();
    await staticServer.stop();
  }

  const passedProfiles = profileReceipts.filter(
    (receipt) => receipt.classification.passed === true
  );
  const aggregateReceipt = attachDeterministicDigest({
    receiptType: 'H_EARTH_RENDERER_CORRIDOR_INTEGRATION_AGGREGATE_RECEIPT',
    contractId: H_EARTH_RENDERER_CORRIDOR_INTEGRATION_HARNESS_CONTRACT_ID,
    sourceCommit: process.env.GITHUB_SHA ?? 'LOCAL_UNCOMMITTED_WORKTREE',
    rule: 'IMPORT_PASS != RENDERER_CONSTRUCTION_PASS != RENDERER_MOUNT_PASS != DEPLOYED_ROUTE_PASS',
    localIntegrationPassEstablished: passedProfiles.length === PROFILES.length,
    deployedRoutePassEstablished: false,
    profileCount: PROFILES.length,
    passedProfileCount: passedProfiles.length,
    failedProfileIds: profileReceipts
      .filter((receipt) => receipt.classification.passed !== true)
      .map((receipt) => receipt.profile.id),
    profileReceipts
  });

  await writeJson(path.join(outputDirectory, 'aggregate.receipt.json'), aggregateReceipt);
  process.stdout.write(`${JSON.stringify({
    status: aggregateReceipt.localIntegrationPassEstablished ? 'PASS' : 'FAIL',
    profileCount: aggregateReceipt.profileCount,
    passedProfileCount: aggregateReceipt.passedProfileCount,
    failedProfileIds: aggregateReceipt.failedProfileIds,
    receipt: 'artifacts/h-earth-renderer-corridor/aggregate.receipt.json'
  }, null, 2)}\n`);

  if (!aggregateReceipt.localIntegrationPassEstablished) process.exitCode = 1;
}

main().catch((error) => {
  console.error('[H-Earth renderer corridor harness fatal error]', error);
  process.exitCode = 1;
});
