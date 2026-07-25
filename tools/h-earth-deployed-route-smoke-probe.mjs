import path from 'node:path';
import process from 'node:process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium, request } from 'playwright';

import {
  EXPECTED_PACKET_002_SOURCE_OBJECT_IDS,
  H_EARTH_RENDERER_CORRIDOR_CAPACITY_LAW_CONTRACT_ID,
  evaluateHEarthRendererCorridorBudgets
} from './h-earth-renderer-corridor-capacity-law.mjs';

import {
  H_EARTH_RENDERER_CORRIDOR_COMMON_CONTRACT_ID,
  attachDeterministicDigest,
  classifyObservation,
  moduleGraphEvaluation,
  observeHEarthRoute,
  pathnameFromUrl,
  repositoryRootFromThisModule,
  writeJson
} from './h-earth-renderer-corridor-common.mjs';

import {
  H_EARTH_DEPLOYED_ROUTE_PROBE_CONTRACT_ID,
  H_EARTH_DEPLOYED_ROUTE_PROFILES,
  H_EARTH_DEPLOYED_SOURCE_IDENTITY_PATHS,
  auditHEarthDeployedSourceIdentity,
  buildExpectedHEarthDeployedSourceIdentityManifest,
  createHEarthDeployedAttemptUrl
} from './h-earth-deployed-route-probe-contract.mjs';

import {
  H_EARTH_RENDERER_CORRIDOR_OBSERVATION_CONTRACT_ID,
  enrichHEarthRouteObservation,
  waitForHEarthTerminalRouteState
} from './h-earth-renderer-corridor-observation.mjs';

export const H_EARTH_DEPLOYED_ROUTE_SMOKE_PROBE_CONTRACT_ID =
  'H_EARTH_DEPLOYED_ROUTE_RENDERER_MOUNT_AND_SOURCE_IDENTITY_SMOKE_PROBE_v4';

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
const EXPECTED_REPOSITORY_COMMIT = process.env.GITHUB_SHA ?? 'manual';

const REQUIRED_RUNTIME_PATHS = new Set([
  '/showroom/globe/h-earth/',
  ...H_EARTH_DEPLOYED_SOURCE_IDENTITY_PATHS
]);

function isRequiredRuntimeUrl(value) {
  const pathname = pathnameFromUrl(value);
  return pathname ? REQUIRED_RUNTIME_PATHS.has(pathname) : false;
}

async function runProfile(browser, attemptNumber, profile) {
  const requestUrls = [];
  const requestFailures = [];
  const errorResponses = [];
  const pageErrors = [];
  const consoleErrors = [];
  const responseHeaders = {};

  const context = await browser.newContext({
    viewport: profile.viewport,
    deviceScaleFactor: profile.deviceScaleFactor,
    isMobile: profile.isMobile,
    hasTouch: profile.hasTouch,
    storageState: undefined,
    extraHTTPHeaders: {
      'Cache-Control': 'no-cache, no-store, max-age=0',
      Pragma: 'no-cache'
    }
  });
  await context.clearCookies();
  const page = await context.newPage();

  page.on('request', (pageRequest) => requestUrls.push(pageRequest.url()));
  page.on('requestfailed', (pageRequest) => {
    if (!isRequiredRuntimeUrl(pageRequest.url())) return;
    requestFailures.push({
      url: pageRequest.url(),
      method: pageRequest.method(),
      resourceType: pageRequest.resourceType(),
      errorText: pageRequest.failure()?.errorText ?? null
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
  page.on('pageerror', (error) => pageErrors.push({
    name: error?.name ?? 'Error',
    message: error?.message ?? String(error),
    stack: error?.stack ?? null
  }));
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    consoleErrors.push({ text: message.text(), location: message.location() });
  });

  const auditedUrl = createHEarthDeployedAttemptUrl({
    targetUrl: TARGET_URL,
    expectedRepositoryCommit: EXPECTED_REPOSITORY_COMMIT,
    attemptNumber,
    profileId: profile.id
  });
  let navigationError = null;
  try {
    await page.goto(auditedUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
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
    requestFailures,
    errorResponses,
    pageErrors: effectivePageErrors,
    consoleErrors
  });

  const receipt = attachDeterministicDigest({
    receiptType: 'H_EARTH_DEPLOYED_ROUTE_SMOKE_PROFILE_RECEIPT',
    contractId: H_EARTH_DEPLOYED_ROUTE_SMOKE_PROBE_CONTRACT_ID,
    commonContractId: H_EARTH_RENDERER_CORRIDOR_COMMON_CONTRACT_ID,
    observationContractId: H_EARTH_RENDERER_CORRIDOR_OBSERVATION_CONTRACT_ID,
    capacityLawContractId: H_EARTH_RENDERER_CORRIDOR_CAPACITY_LAW_CONTRACT_ID,
    deployedProbeContractId: H_EARTH_DEPLOYED_ROUTE_PROBE_CONTRACT_ID,
    expectedRepositoryCommit: EXPECTED_REPOSITORY_COMMIT,
    attemptNumber,
    targetUrl: TARGET_URL,
    auditedUrl,
    profile,
    responseHeaders,
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
    routeState: {
      status: observation.routeStatus,
      dataset: observation.routeDataset,
      fallbackRestored: observation.fallbackRestored
    },
    objectIdentity: {
      expected: EXPECTED_PACKET_002_SOURCE_OBJECT_IDS,
      observed: observation.observedObjectIds,
      preMountObserved: observation.preMountObservedObjectIds,
      preservationState: observation.objectIdentity?.preservationState ?? null
    },
    capacityEvaluation,
    requestFailures,
    errorResponses,
    pageErrors: effectivePageErrors,
    consoleErrors,
    classification,
    profileRoutePassEstablished: classification.passed === true
  });

  await context.close();
  return receipt;
}

async function runSourceIdentityAudit(attemptNumber, expectedManifest) {
  const requestContext = await request.newContext({
    extraHTTPHeaders: {
      'Cache-Control': 'no-cache, no-store, max-age=0',
      Pragma: 'no-cache'
    }
  });
  try {
    return await auditHEarthDeployedSourceIdentity({
      targetUrl: TARGET_URL,
      expectedManifest,
      cacheToken: `${EXPECTED_REPOSITORY_COMMIT}-${attemptNumber}`,
      async fetchSource({ auditedUrl }) {
        const response = await requestContext.get(auditedUrl, {
          failOnStatusCode: false,
          timeout: 60_000
        });
        return {
          status: response.status(),
          headers: response.headers(),
          body: await response.body()
        };
      }
    });
  } finally {
    await requestContext.dispose();
  }
}

async function runAttempt(browser, attemptNumber, expectedSourceManifest) {
  const profileReceipts = [];
  for (const profile of H_EARTH_DEPLOYED_ROUTE_PROFILES) {
    profileReceipts.push(await runProfile(browser, attemptNumber, profile));
  }
  const sourceIdentity = await runSourceIdentityAudit(
    attemptNumber,
    expectedSourceManifest
  );
  const passedProfiles = profileReceipts.filter(
    (receipt) => receipt.profileRoutePassEstablished === true
  );
  const deployedRoutePassEstablished =
    passedProfiles.length === H_EARTH_DEPLOYED_ROUTE_PROFILES.length &&
    sourceIdentity.sourceIdentityEstablished === true;

  return attachDeterministicDigest({
    receiptType: 'H_EARTH_DEPLOYED_ROUTE_SMOKE_ATTEMPT_RECEIPT',
    contractId: H_EARTH_DEPLOYED_ROUTE_SMOKE_PROBE_CONTRACT_ID,
    deployedProbeContractId: H_EARTH_DEPLOYED_ROUTE_PROBE_CONTRACT_ID,
    expectedRepositoryCommit: EXPECTED_REPOSITORY_COMMIT,
    attemptNumber,
    targetUrl: TARGET_URL,
    profileCount: H_EARTH_DEPLOYED_ROUTE_PROFILES.length,
    passedProfileCount: passedProfiles.length,
    failedProfileIds: profileReceipts
      .filter((receipt) => receipt.profileRoutePassEstablished !== true)
      .map((receipt) => receipt.profile.id),
    profileReceipts,
    sourceIdentity,
    sourceIdentityRequired: true,
    deployedRoutePassEstablished
  });
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
  const expectedSourceManifest =
    buildExpectedHEarthDeployedSourceIdentityManifest({ repositoryRoot });
  const browser = await chromium.launch({ headless: true });
  const attempts = [];

  try {
    for (let attemptNumber = 1; attemptNumber <= MAX_ATTEMPTS; attemptNumber += 1) {
      const receipt = await runAttempt(
        browser,
        attemptNumber,
        expectedSourceManifest
      );
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
    deployedProbeContractId: H_EARTH_DEPLOYED_ROUTE_PROBE_CONTRACT_ID,
    expectedRepositoryCommit: EXPECTED_REPOSITORY_COMMIT,
    targetUrl: TARGET_URL,
    freshBrowserContextPerProfileAndAttempt: true,
    cacheBypassRequested: true,
    sourceIdentityRequired: true,
    requiredProfileCount: H_EARTH_DEPLOYED_ROUTE_PROFILES.length,
    requiredProfileIds: H_EARTH_DEPLOYED_ROUTE_PROFILES.map(
      (profile) => profile.id
    ),
    sourceIdentityPathCount: expectedSourceManifest.sourceCount,
    attemptCount: attempts.length,
    successfulAttemptNumber: successfulAttempt?.attemptNumber ?? null,
    deployedRoutePassEstablished: successfulAttempt !== null,
    attempts
  });

  await writeJson(
    path.join(outputDirectory, 'aggregate.receipt.json'),
    aggregateReceipt
  );
  process.stdout.write(`${JSON.stringify({
    status: aggregateReceipt.deployedRoutePassEstablished ? 'PASS' : 'FAIL',
    targetUrl: TARGET_URL,
    requiredProfileCount: aggregateReceipt.requiredProfileCount,
    sourceIdentityRequired: aggregateReceipt.sourceIdentityRequired,
    sourceIdentityPathCount: aggregateReceipt.sourceIdentityPathCount,
    attemptCount: aggregateReceipt.attemptCount,
    successfulAttemptNumber: aggregateReceipt.successfulAttemptNumber,
    receipt: 'artifacts/h-earth-deployed-route-smoke/aggregate.receipt.json'
  }, null, 2)}\n`);

  if (!aggregateReceipt.deployedRoutePassEstablished) process.exitCode = 1;
}

main().catch((error) => {
  console.error('[H-Earth deployed route smoke probe fatal error]', error);
  process.exitCode = 1;
});
