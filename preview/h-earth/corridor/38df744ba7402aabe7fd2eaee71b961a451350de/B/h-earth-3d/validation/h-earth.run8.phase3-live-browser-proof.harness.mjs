import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const repository = 'smansfield635-create/smansfield635-create.github.io';
const expectedDeploymentHead = process.env.H_EARTH_EXPECTED_DEPLOYMENT_HEAD;
const outputDirectory = process.env.H_EARTH_PHASE3_OUTPUT ??
  '/tmp/h-earth-run8-phase3-live-browser-proof';
const token = process.env.GITHUB_TOKEN;

assert.match(expectedDeploymentHead ?? '', /^[0-9a-f]{40}$/);
assert.ok(token, 'GITHUB_TOKEN is required.');

await fs.mkdir(outputDirectory, { recursive: true });

const apiHeaders = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'h-earth-run8-phase3-live-browser-proof'
};

const apiJson = async (pathname) => {
  const response = await fetch(`https://api.github.com/repos/${repository}${pathname}`, {
    headers: apiHeaders
  });
  if (!response.ok) {
    throw new Error(`GitHub API ${pathname} returned ${response.status}: ${await response.text()}`);
  }
  return response.json();
};

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

let pages;
let latestBuild;
let deployments;
for (let attempt = 0; attempt < 36; attempt += 1) {
  pages = await apiJson('/pages');
  latestBuild = await apiJson('/pages/builds/latest');
  deployments = await apiJson(
    `/deployments?environment=github-pages&sha=${expectedDeploymentHead}&per_page=100`
  );
  if (
    pages?.source?.branch === 'main' &&
    pages?.source?.path === '/' &&
    latestBuild?.commit === expectedDeploymentHead &&
    latestBuild?.status === 'built' &&
    Array.isArray(deployments) &&
    deployments.some((deployment) =>
      deployment.sha === expectedDeploymentHead &&
      deployment.environment === 'github-pages')
  ) {
    break;
  }
  if (attempt === 35) {
    throw new Error(
      `Pages deployment did not reconcile to ${expectedDeploymentHead}: ` +
      JSON.stringify({
        source: pages?.source,
        latestBuildCommit: latestBuild?.commit,
        latestBuildStatus: latestBuild?.status,
        deploymentCount: Array.isArray(deployments) ? deployments.length : null
      })
    );
  }
  await sleep(10000);
}

const normalizeSiteBase = (value) => {
  const url = new URL(value);
  url.protocol = 'https:';
  url.pathname = '/';
  url.search = '';
  url.hash = '';
  return url.href;
};

const customSiteBase = normalizeSiteBase(pages.html_url);
const githubSiteBase = 'https://smansfield635-create.github.io/';
const routePath = 'showroom/globe/h-earth/';
const customRoute = new URL(routePath, customSiteBase).href;
const githubRoute = new URL(routePath, githubSiteBase).href;

const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

const fetchBytes = async (url) => {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      'User-Agent': 'h-earth-run8-phase3-live-browser-proof'
    }
  });
  const bytes = Buffer.from(await response.arrayBuffer());
  return {
    status: response.status,
    finalUrl: response.url,
    bytes,
    sha256: sha256(bytes)
  };
};

const customIndex = await fetchBytes(customRoute);
const githubIndex = await fetchBytes(githubRoute);
assert.equal(customIndex.status, 200);
assert.equal(githubIndex.status, 200);
assert.equal(customIndex.bytes.length, githubIndex.bytes.length);
assert.equal(customIndex.sha256, githubIndex.sha256);

const phase2ReceiptUrl = new URL(
  'h-earth-3d/validation/h-earth.run8.phase2-deployment-reconciliation.receipt.json',
  customSiteBase
).href;
const liveControlUrl = new URL(
  'h-earth-3d/control-plane/run-8/h-earth.run8e.integration-and-live-delivery.js',
  customSiteBase
).href;
const phase2Response = await fetchBytes(phase2ReceiptUrl);
const controlResponse = await fetchBytes(liveControlUrl);
assert.equal(phase2Response.status, 200);
assert.equal(controlResponse.status, 200);
const phase2Receipt = JSON.parse(phase2Response.bytes.toString('utf8'));
const controlText = controlResponse.bytes.toString('utf8');
assert.equal(phase2Receipt.status, 'RUN_8_PHASE_2_DEPLOYMENT_RECONCILIATION_PASS');
assert.equal(phase2Receipt.expectedPromotedMainHead, '0ae82d417dd7868f0546891d4e720abdb294d466');
assert.match(controlText, /deploymentReconciliation:\s*'PASS'/);
assert.match(controlText, /publicHEarthRouteReplacement:\s*'PASS'/);
assert.match(controlText, /deployment:\s*'PASS'/);

const configurations = [
  {
    id: 'desktop-landscape',
    viewport: { width: 1280, height: 800 },
    isMobile: false,
    hasTouch: false,
    userAgent: null
  },
  {
    id: 'samsung-galaxy-portrait-emulation',
    viewport: { width: 412, height: 915 },
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (Linux; Android 16; SM-S948U) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'samsung-galaxy-landscape-emulation',
    viewport: { width: 915, height: 412 },
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (Linux; Android 16; SM-S948U) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36'
  }
];

const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const configuration of configurations) {
    const context = await browser.newContext({
      viewport: configuration.viewport,
      isMobile: configuration.isMobile,
      hasTouch: configuration.hasTouch,
      deviceScaleFactor: 1,
      userAgent: configuration.userAgent ?? undefined
    });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const requestFailures = [];
    const httpErrors = [];

    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('requestfailed', (request) => {
      requestFailures.push({
        url: request.url(),
        errorText: request.failure()?.errorText ?? 'UNKNOWN_REQUEST_FAILURE'
      });
    });
    page.on('response', (response) => {
      const responseUrl = response.url();
      if (
        response.status() >= 400 &&
        !responseUrl.includes('favicon.ico') &&
        (responseUrl.startsWith(customSiteBase) || responseUrl.startsWith(githubSiteBase))
      ) {
        httpErrors.push({ url: responseUrl, status: response.status() });
      }
    });

    await page.goto(`${customRoute}?run8phase3=${configuration.id}`, {
      waitUntil: 'domcontentloaded',
      timeout: 180000
    });
    await page.waitForFunction(() =>
      window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F?.ready === true &&
      window.H_EARTH_RUN8E_PUBLIC_ROUTE?.ready === true &&
      document.getElementById('h-earth-functional-landscape-route')?.dataset.run8eReady === 'true',
    null, { timeout: 240000 });

    const receipts = [
      await page.evaluate(() => window.H_EARTH_RUN8E_PUBLIC_ROUTE.getBrowserReceipt())
    ];

    for (const waypointId of ['LOWLAND', 'RIDGE']) {
      const before = receipts.at(-1).renderSequence;
      await page.evaluate((waypoint) =>
        window.H_EARTH_FUNCTIONAL_LANDSCAPE_RUN6F.gotoWaypoint(waypoint), waypointId);
      await page.waitForFunction((sequence) =>
        window.H_EARTH_RUN8E_PUBLIC_ROUTE.getBrowserReceipt().renderSequence > sequence,
      before, { timeout: 240000 });
      receipts.push(
        await page.evaluate(() => window.H_EARTH_RUN8E_PUBLIC_ROUTE.getBrowserReceipt())
      );
    }

    assert.equal(receipts.length, 3);
    assert.equal(receipts.every((receipt) => receipt.eligible === true), true);
    assert.equal(receipts.every((receipt) => receipt.admittedPrimitiveCount === 35), true);
    assert.equal(receipts.every((receipt) => receipt.terrainPrimitiveCount === 1), true);
    assert.equal(receipts.every((receipt) => receipt.shorelinePrimitiveCount === 7), true);
    assert.equal(receipts.every((receipt) => receipt.vegetationPrimitiveCount === 27), true);
    assert.equal(receipts.every((receipt) => receipt.cameraReconciledToSuccessorTerrain), true);
    assert.equal(
      receipts.every((receipt) =>
        receipt.sameWorldToCameraTransformForTerrainAndVegetation === true),
      true
    );
    assert.equal(receipts.every((receipt) => receipt.singlePhysicalDepthDomainExecuted), true);
    assert.equal(receipts.every((receipt) => receipt.singleSkyAuthorityMaterialized), true);
    assert.equal(receipts.every((receipt) => receipt.sunDiscIntegrationActive), true);
    assert.equal(receipts.every((receipt) => receipt.alphaClosed), true);
    assert.equal(
      Math.max(...receipts.map((receipt) => receipt.terrainVisiblePixelCount)) > 0,
      true
    );
    assert.equal(
      Math.max(...receipts.map((receipt) => receipt.vegetationVisiblePixelCount)) > 0,
      true
    );
    assert.equal(
      Math.max(...receipts.map((receipt) =>
        receipt.vegetationTerrainDepthInteractionCount)) > 0,
      true
    );
    assert.equal(
      receipts.some((receipt) =>
        receipt.actualTerrainVegetationDepthInteractionExecuted === true),
      true
    );
    assert.equal(Math.max(...receipts.map((receipt) => receipt.skyPixelCount)) > 0, true);
    assert.equal(Math.max(...receipts.map((receipt) => receipt.sunPixelCount)) > 0, true);

    const rootState = await page.evaluate(() => {
      const root = document.getElementById('h-earth-functional-landscape-route');
      const canvas = document.getElementById('h-earth-functional-landscape-canvas');
      const context2d = canvas.getContext('2d');
      const pixels = context2d.getImageData(0, 0, canvas.width, canvas.height).data;
      let opaquePixelCount = 0;
      let transparentPixelCount = 0;
      const sampledColors = new Map();
      const pixelCount = pixels.length / 4;
      const sampleStep = Math.max(1, Math.floor(pixelCount / 12000));
      for (let pixelIndex = 0; pixelIndex < pixelCount; pixelIndex += 1) {
        const offset = pixelIndex * 4;
        if (pixels[offset + 3] === 255) opaquePixelCount += 1;
        else transparentPixelCount += 1;
        if (pixelIndex % sampleStep === 0) {
          const key = `${pixels[offset]},${pixels[offset + 1]},${pixels[offset + 2]}`;
          sampledColors.set(key, (sampledColors.get(key) ?? 0) + 1);
        }
      }
      const sampledPixelCount = [...sampledColors.values()].reduce(
        (sum, count) => sum + count, 0);
      const dominantSampleCount = Math.max(...sampledColors.values());
      const resourcePaths = performance.getEntriesByType('resource')
        .map((entry) => new URL(entry.name).pathname)
        .filter((value, index, values) => values.indexOf(value) === index)
        .sort();
      return {
        finalUrl: `${location.origin}${location.pathname}`,
        title: document.title,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        run8eReady: root.dataset.run8eReady,
        run8eError: root.dataset.run8eError,
        run8ePublicRoute: root.dataset.run8ePublicRoute,
        publicRoute: root.dataset.publicRoute,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        pixelCount,
        opaquePixelCount,
        transparentPixelCount,
        sampledColorCount: sampledColors.size,
        dominantSampleShare: dominantSampleCount / sampledPixelCount,
        status: document.getElementById('route-status')?.textContent ?? '',
        hudFrame: document.getElementById('hud-frame')?.textContent ?? '',
        hudSurface: document.getElementById('hud-surface')?.textContent ?? '',
        hudFormation: document.getElementById('hud-formation')?.textContent ?? '',
        hudPopulation: document.getElementById('hud-population')?.textContent ?? '',
        resourcePaths
      };
    });

    assert.equal(rootState.run8eReady, 'true');
    assert.equal(rootState.run8eError, 'false');
    assert.equal(rootState.run8ePublicRoute, 'true');
    assert.equal(rootState.publicRoute, 'true');
    assert.equal(rootState.opaquePixelCount, rootState.pixelCount);
    assert.equal(rootState.transparentPixelCount, 0);
    assert.equal(rootState.sampledColorCount > 24, true);
    assert.equal(rootState.dominantSampleShare < 0.95, true);
    assert.match(rootState.status, /Run 8E successor environment active/);
    assert.match(rootState.hudFrame, /Run 8E/);
    assert.match(rootState.hudSurface, /Successor terrain/);
    assert.match(rootState.hudFormation, /Continuous highland mountain/);
    assert.match(rootState.hudPopulation, /24 grounded instances/);
    assert.equal(
      rootState.resourcePaths.some((resourcePath) =>
        resourcePath.endsWith('/functional-landscape/environment-integration.js')),
      true
    );
    assert.equal(
      rootState.resourcePaths.some((resourcePath) =>
        resourcePath.endsWith('/render/run8e-successor-environment.js')),
      true
    );
    assert.equal(
      rootState.resourcePaths.some((resourcePath) =>
        resourcePath.endsWith('/h-earth.run8e-successor-environment-transfer.js')),
      true
    );
    assert.deepEqual(consoleErrors, []);
    assert.deepEqual(pageErrors, []);
    assert.deepEqual(requestFailures, []);
    assert.deepEqual(httpErrors, []);

    const screenshot = `${configuration.id}.png`;
    await page.screenshot({
      path: path.join(outputDirectory, screenshot),
      fullPage: true
    });

    results.push({
      configurationId: configuration.id,
      viewport: configuration.viewport,
      isMobile: configuration.isMobile,
      hasTouch: configuration.hasTouch,
      waypointReceiptCount: receipts.length,
      receipts,
      rootState,
      screenshot,
      consoleErrors,
      pageErrors,
      requestFailures,
      httpErrors
    });

    await context.close();
  }
} finally {
  await browser.close();
}

const receipt = {
  receiptType: 'H_EARTH_RUN_8_PHASE_3_LIVE_BROWSER_PROOF_RECEIPT',
  eligible: true,
  status: 'RUN_8_PHASE_3_LIVE_BROWSER_PROOF_PASS',
  repository,
  verifiedOn: '2026-07-26',
  expectedDeploymentHead,
  pages: {
    sourceBranch: pages.source.branch,
    sourcePath: pages.source.path,
    siteStatus: pages.status,
    buildType: pages.build_type,
    latestBuildCommit: latestBuild.commit,
    latestBuildStatus: latestBuild.status,
    latestBuildCommitMatchesExpectedHead:
      latestBuild.commit === expectedDeploymentHead,
    matchingGithubPagesDeploymentPresent:
      deployments.some((deployment) =>
        deployment.sha === expectedDeploymentHead &&
        deployment.environment === 'github-pages')
  },
  liveRoutes: {
    customSiteBase,
    customRoute,
    githubSiteBase,
    githubRoute,
    customIndexStatus: customIndex.status,
    githubIndexStatus: githubIndex.status,
    customAndGithubIndexByteIdentity:
      customIndex.bytes.length === githubIndex.bytes.length &&
      customIndex.sha256 === githubIndex.sha256,
    indexByteCount: customIndex.bytes.length,
    indexSha256: customIndex.sha256
  },
  liveAuthority: {
    phase2ReceiptStatus: phase2Receipt.status,
    phase2ReceiptAvailable: phase2Response.status === 200,
    run8ControlAvailable: controlResponse.status === 200,
    deploymentReconciliationRecordedPass:
      /deploymentReconciliation:\s*'PASS'/.test(controlText),
    publicRouteReplacementRecordedPass:
      /publicHEarthRouteReplacement:\s*'PASS'/.test(controlText),
    deploymentRecordedPass:
      /deployment:\s*'PASS'/.test(controlText)
  },
  configurationCount: results.length,
  actualLiveBrowserExecution: true,
  desktopLiveBrowserExecution: 'PASS',
  samsungPortraitBrowserEmulation: 'PASS',
  samsungLandscapeBrowserEmulation: 'PASS',
  successorTerrainAndMountainVisible: true,
  groundedVegetationVisible: true,
  sharedDepthAndOcclusionExecuted: true,
  skyAuthorityVisible: true,
  sunDiscVisibleInAtLeastOneFrame: true,
  alphaClosureEstablished: true,
  consoleAndPageErrorsAbsent: true,
  liveIdentityAndBrowserProof: 'PASS',
  physicalSamsungExecution: 'NOT_EXECUTED',
  run8EPassClosed: false,
  results,
  issues: []
};

assert.equal(receipt.configurationCount, 3);
assert.equal(receipt.pages.latestBuildCommitMatchesExpectedHead, true);
assert.equal(receipt.pages.matchingGithubPagesDeploymentPresent, true);
assert.equal(receipt.liveRoutes.customAndGithubIndexByteIdentity, true);
assert.equal(receipt.liveAuthority.deploymentReconciliationRecordedPass, true);
assert.equal(receipt.liveAuthority.publicRouteReplacementRecordedPass, true);
assert.equal(receipt.liveAuthority.deploymentRecordedPass, true);
assert.equal(receipt.results.every((result) => result.consoleErrors.length === 0), true);
assert.equal(receipt.results.every((result) => result.pageErrors.length === 0), true);
assert.equal(receipt.results.every((result) => result.requestFailures.length === 0), true);
assert.equal(receipt.results.every((result) => result.httpErrors.length === 0), true);

const candidateText = `${JSON.stringify(receipt, null, 2)}\n`;
const outputReceipt = path.join(
  outputDirectory,
  'h-earth.run8.phase3-live-browser-proof.receipt.json'
);
await fs.writeFile(outputReceipt, candidateText, 'utf8');

const durableReceipt =
  'h-earth-3d/validation/h-earth.run8.phase3-live-browser-proof.receipt.json';
try {
  const durableText = await fs.readFile(durableReceipt, 'utf8');
  assert.equal(durableText, candidateText, 'Durable Phase 3 receipt differs from live execution.');
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}

console.log(candidateText);
