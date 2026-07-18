import { chromium } from 'playwright';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outputDirectory = '.fd05/deployed-wet-sand-output';
await mkdir(outputDirectory, { recursive: true });

const publicRoute = 'https://diamondgatebridge.com/showroom/globe/h-earth/';
const publicRenderer = new URL('./renderer.js', publicRoute).href;
const installedRendererBytes = await readFile('showroom/globe/h-earth/renderer.js');
const installedRendererSha256 = createHash('sha256')
  .update(installedRendererBytes)
  .digest('hex');

async function waitForPublicRendererCorrespondence() {
  const attempts = [];
  const deadline = Date.now() + 300000;

  while (Date.now() < deadline) {
    const url = new URL(publicRenderer);
    url.searchParams.set('fd05WetSandDeployment', `${Date.now()}`);
    try {
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'cache-control': 'no-cache',
          pragma: 'no-cache',
          'user-agent': 'H-Earth-FD05-Wet-Sand-Deployed-Capture/1.0'
        },
        signal: AbortSignal.timeout(45000)
      });
      const bytes = Buffer.from(await response.arrayBuffer());
      const sha256 = createHash('sha256').update(bytes).digest('hex');
      const attempt = {
        at: new Date().toISOString(),
        requestedUrl: url.href,
        finalUrl: response.url,
        status: response.status,
        ok: response.ok,
        byteLength: bytes.length,
        sha256,
        exactInstalledMatch:
          response.ok && sha256 === installedRendererSha256,
        cacheControl: response.headers.get('cache-control'),
        age: response.headers.get('age'),
        etag: response.headers.get('etag'),
        lastModified: response.headers.get('last-modified')
      };
      attempts.push(attempt);
      if (attempt.exactInstalledMatch) {
        return {
          matched: true,
          installedRenderer: {
            byteLength: installedRendererBytes.length,
            sha256: installedRendererSha256,
            gitBlobSha: '1902bc1242101b70b8938285bb8cd39e584d698c'
          },
          attempts
        };
      }
    } catch (error) {
      attempts.push({
        at: new Date().toISOString(),
        requestedUrl: url.href,
        errorName: error?.name ?? 'UnknownError',
        errorMessage: error?.message ?? String(error),
        exactInstalledMatch: false
      });
    }
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }

  return {
    matched: false,
    installedRenderer: {
      byteLength: installedRendererBytes.length,
      sha256: installedRendererSha256,
      gitBlobSha: '1902bc1242101b70b8938285bb8cd39e584d698c'
    },
    attempts
  };
}

const configurations = [
  {
    id: 'mobile',
    context: {
      viewport: { width: 393, height: 852 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      userAgent:
        'Mozilla/5.0 (Linux; Android 16; FD05WetSandCapture) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36'
    },
    expectedTriangleCount: 80
  },
  {
    id: 'desktop',
    context: {
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false
    },
    expectedTriangleCount: 154
  }
];

async function captureConfiguration(browser, configuration) {
  const context = await browser.newContext(configuration.context);
  const page = await context.newPage();
  const pageErrors = [];
  const requestFailures = [];
  const consoleErrors = [];

  page.on('pageerror', (error) => {
    pageErrors.push({ name: error.name, message: error.message });
  });
  page.on('requestfailed', (request) => {
    requestFailures.push({
      url: request.url(),
      resourceType: request.resourceType(),
      failure: request.failure()
    });
  });
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  const url = new URL(publicRoute);
  url.searchParams.set('fd05WetSandCapture', `${Date.now()}-${configuration.id}`);
  const startedAt = Date.now();
  const response = await page.goto(url.href, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  await page.waitForFunction(
    () =>
      document.getElementById('h-earth-3d-status')?.textContent?.trim() ===
      'PUBLIC_STAGE_RENDERER_MOUNTED',
    { timeout: 150000 }
  );
  await page.waitForTimeout(2000);

  const snapshot = await page.evaluate(() => {
    const status = document.getElementById('h-earth-3d-status');
    const mount = document.getElementById('h-earth-3d-renderer-mount');
    const stage = mount?.querySelector('.h-earth-3d-render-stage');
    const wetSandTriangles = [
      ...(mount?.querySelectorAll(
        '[data-material-reference="H_EARTH_MATERIAL_WET_SAND"]' +
        '[data-material-intent="WET_SAND"]' +
        '[data-projected-type="TRIANGLE"]'
      ) ?? [])
    ];
    const styles = wetSandTriangles.map((triangle) => {
      const computed = getComputedStyle(triangle);
      return {
        presentationModel: triangle.dataset.wetSandPresentationModel ?? null,
        backgroundImage: computed.backgroundImage,
        backgroundSize: computed.backgroundSize,
        backgroundPosition: computed.backgroundPosition,
        backgroundRepeat: computed.backgroundRepeat,
        filter: computed.filter,
        mixBlendMode: computed.mixBlendMode,
        opacity: computed.opacity
      };
    });

    return {
      status: status?.textContent?.trim() ?? null,
      routeReceiptStatus:
        globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT?.status ?? null,
      rendererReceiptStatus:
        globalThis.H_EARTH_3D_RENDERER_BOOTSTRAP_RECEIPT?.status ?? null,
      rendererMounted:
        globalThis.H_EARTH_3D_RENDERER_BOOTSTRAP_RECEIPT?.mounted ?? null,
      mount: mount
        ? {
            clientWidth: mount.clientWidth,
            clientHeight: mount.clientHeight,
            sourcePreviewCount:
              mount.querySelectorAll('[data-h-earth-source-preview-owned="true"]').length,
            semanticLayerCount:
              mount.querySelectorAll('.h-earth-3d-render-semantic-layer').length,
            interactionBoundaryCount:
              mount.querySelectorAll('.h-earth-3d-render-interaction-boundary').length,
            primitiveCount:
              mount.querySelectorAll('.h-earth-3d-render-primitive').length,
            triangleCount: wetSandTriangles.length
          }
        : null,
      stage: stage
        ? {
            rendererContractId: stage.dataset.rendererContractId ?? null,
            compositorContractId: stage.dataset.compositorContractId ?? null,
            admittedFrameContractId: stage.dataset.admittedFrameContractId ?? null,
            rect: {
              width: stage.getBoundingClientRect().width,
              height: stage.getBoundingClientRect().height
            }
          }
        : null,
      uniquePrimitiveIds:
        [...new Set(wetSandTriangles.map((triangle) => triangle.dataset.primitiveId))],
      uniqueMaterialReferences:
        [...new Set(wetSandTriangles.map((triangle) => triangle.dataset.materialReference))],
      uniqueMaterialIntents:
        [...new Set(wetSandTriangles.map((triangle) => triangle.dataset.materialIntent))],
      uniquePresentationRoles:
        [...new Set(wetSandTriangles.map((triangle) => triangle.dataset.presentationRole))],
      uniqueRenderLayers:
        [...new Set(wetSandTriangles.map((triangle) => triangle.dataset.renderLayer))],
      uniquePresentationModels:
        [...new Set(styles.map((style) => style.presentationModel))],
      uniqueBackgroundImages:
        [...new Set(styles.map((style) => style.backgroundImage))],
      uniqueBackgroundSizes:
        [...new Set(styles.map((style) => style.backgroundSize))],
      uniqueBackgroundPositions:
        [...new Set(styles.map((style) => style.backgroundPosition))],
      uniqueBackgroundRepeats:
        [...new Set(styles.map((style) => style.backgroundRepeat))],
      uniqueFilters:
        [...new Set(styles.map((style) => style.filter))],
      uniqueBlendModes:
        [...new Set(styles.map((style) => style.mixBlendMode))],
      uniqueOpacities:
        [...new Set(styles.map((style) => style.opacity))]
    };
  });

  const gates = {
    navigation:
      response?.ok() === true,
    terminalStatus:
      snapshot.status === 'PUBLIC_STAGE_RENDERER_MOUNTED' &&
      snapshot.routeReceiptStatus === 'PUBLIC_STAGE_READY' &&
      snapshot.rendererMounted === true,
    exactTriangleCount:
      snapshot.mount?.triangleCount === configuration.expectedTriangleCount &&
      snapshot.mount?.primitiveCount === configuration.expectedTriangleCount,
    rendererStructure:
      snapshot.mount?.semanticLayerCount === 15 &&
      snapshot.mount?.interactionBoundaryCount === 1,
    previewTakenOver:
      snapshot.mount?.sourcePreviewCount === 0,
    semanticIdentity:
      snapshot.uniquePrimitiveIds.length === 1 &&
      JSON.stringify(snapshot.uniqueMaterialReferences) ===
        JSON.stringify(['H_EARTH_MATERIAL_WET_SAND']) &&
      JSON.stringify(snapshot.uniqueMaterialIntents) ===
        JSON.stringify(['WET_SAND']) &&
      JSON.stringify(snapshot.uniquePresentationRoles) ===
        JSON.stringify(['PRIMARY_ADMITTED_WET_SAND_SURFACE']) &&
      JSON.stringify(snapshot.uniqueRenderLayers) ===
        JSON.stringify(['GROUND']),
    selectedPresentation:
      JSON.stringify(snapshot.uniquePresentationModels) ===
        JSON.stringify(['BALANCED_STAGE_ALIGNED_v1']) &&
      snapshot.uniqueBackgroundImages.length === 1 &&
      snapshot.uniqueBackgroundImages[0]?.includes('rgba(205, 226, 223, 0.34)') &&
      snapshot.uniqueBackgroundImages[0]?.includes('rgb(145, 124, 93)') &&
      snapshot.uniqueBackgroundSizes.length === 1 &&
      snapshot.uniqueBackgroundPositions.length > 1 &&
      snapshot.uniqueBackgroundRepeats.every((value) => value.includes('no-repeat')) &&
      JSON.stringify(snapshot.uniqueBlendModes) === JSON.stringify(['normal']) &&
      JSON.stringify(snapshot.uniqueOpacities) === JSON.stringify(['0.99']),
    browserErrors:
      pageErrors.length === 0 &&
      requestFailures.length === 0 &&
      consoleErrors.length === 0
  };

  const worldStagePath = path.join(
    outputDirectory,
    `${configuration.id}-deployed-world-stage.png`
  );
  const rendererMountPath = path.join(
    outputDirectory,
    `${configuration.id}-deployed-renderer-mount.png`
  );
  await page.locator('#h-earth-3d-world-stage').screenshot({ path: worldStagePath });
  await page.locator('#h-earth-3d-renderer-mount').screenshot({ path: rendererMountPath });

  const worldBytes = await readFile(worldStagePath);
  const rendererBytes = await readFile(rendererMountPath);
  const result = {
    configuration: configuration.id,
    requestedUrl: url.href,
    finalUrl: page.url(),
    navigationStatus: response?.status() ?? null,
    elapsedToTerminalMs: Date.now() - startedAt,
    expectedTriangleCount: configuration.expectedTriangleCount,
    snapshot,
    gates,
    passed: Object.values(gates).every(Boolean),
    pageErrors,
    requestFailures,
    consoleErrors,
    screenshots: {
      worldStage: {
        path: worldStagePath,
        byteLength: worldBytes.length,
        sha256: createHash('sha256').update(worldBytes).digest('hex')
      },
      rendererMount: {
        path: rendererMountPath,
        byteLength: rendererBytes.length,
        sha256: createHash('sha256').update(rendererBytes).digest('hex')
      }
    }
  };

  await context.close();
  return result;
}

const correspondence = await waitForPublicRendererCorrespondence();
if (!correspondence.matched) {
  throw new Error('Public renderer did not reach exact merged-byte correspondence within five minutes.');
}

const browser = await chromium.launch({ headless: true });
const captures = [];
for (const configuration of configurations) {
  captures.push(await captureConfiguration(browser, configuration));
}
await browser.close();

const report = {
  reportId: 'H_EARTH_FD05_DEPLOYED_WET_SAND_VISUAL_BASELINE_CAPTURE_001',
  generatedAt: new Date().toISOString(),
  status: captures.every((capture) => capture.passed)
    ? 'DEPLOYED_CAPTURE_PASS'
    : 'DEPLOYED_CAPTURE_FAILED',
  repositoryCommit: 'cbde5b50470a528954f634baf8045674c2079cf0',
  repositoryModified: false,
  correspondence,
  captures,
  aggregate: {
    allPassed: captures.every((capture) => capture.passed),
    mobileTriangleCount:
      captures.find((capture) => capture.configuration === 'mobile')?.snapshot.mount?.triangleCount ?? null,
    desktopTriangleCount:
      captures.find((capture) => capture.configuration === 'desktop')?.snapshot.mount?.triangleCount ?? null,
    totalPageErrors: captures.reduce((total, capture) => total + capture.pageErrors.length, 0),
    totalRequestFailures: captures.reduce((total, capture) => total + capture.requestFailures.length, 0),
    totalConsoleErrors: captures.reduce((total, capture) => total + capture.consoleErrors.length, 0)
  }
};

await writeFile(
  path.join(outputDirectory, 'deployed-capture-report.json'),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8'
);

console.log(JSON.stringify({
  reportId: report.reportId,
  status: report.status,
  aggregate: report.aggregate,
  correspondenceMatched: report.correspondence.matched
}, null, 2));

if (!report.aggregate.allPassed) {
  throw new Error('One or more deployed wet-sand capture gates failed.');
}
