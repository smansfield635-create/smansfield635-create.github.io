import { chromium } from 'playwright';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outputDirectory = '.fd05/deployed-wet-sand-output';
await mkdir(outputDirectory, { recursive: true });

const publicRoute = 'https://diamondgatebridge.com/showroom/globe/h-earth/';
const publicRenderer = new URL('./renderer.js', publicRoute).href;
const installedBytes = await readFile('showroom/globe/h-earth/renderer.js');
const installedSha256 = createHash('sha256').update(installedBytes).digest('hex');

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function tracePublicRenderer() {
  const attempts = [];
  const deadline = Date.now() + 300000;

  while (Date.now() < deadline) {
    const url = new URL(publicRenderer);
    url.searchParams.set('fd05WetSandDeployment', String(Date.now()));
    try {
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'cache-control': 'no-cache',
          pragma: 'no-cache',
          'user-agent': 'H-Earth-FD05-Wet-Sand-Deployed-Capture/2.0'
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
        byteLength: bytes.length,
        sha256,
        exactInstalledMatch: response.ok && sha256 === installedSha256,
        cacheControl: response.headers.get('cache-control'),
        age: response.headers.get('age'),
        etag: response.headers.get('etag'),
        lastModified: response.headers.get('last-modified')
      };
      attempts.push(attempt);
      if (attempt.exactInstalledMatch) break;
    } catch (error) {
      attempts.push({
        at: new Date().toISOString(),
        requestedUrl: url.href,
        exactInstalledMatch: false,
        errorName: error?.name ?? 'UnknownError',
        errorMessage: error?.message ?? String(error)
      });
    }
    await sleep(10000);
  }

  return {
    matched: attempts.some((attempt) => attempt.exactInstalledMatch),
    installedRenderer: {
      byteLength: installedBytes.length,
      sha256: installedSha256,
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
    }
  },
  {
    id: 'desktop',
    context: {
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false
    }
  }
];

async function captureOne(browser, configuration) {
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
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  const url = new URL(publicRoute);
  url.searchParams.set('fd05WetSandCapture', `${Date.now()}-${configuration.id}`);
  const startedAt = Date.now();
  let navigation = null;
  let terminalReached = false;
  let snapshot = null;
  let exception = null;
  const screenshots = {};

  try {
    const response = await page.goto(url.href, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    navigation = {
      status: response?.status() ?? null,
      ok: response?.ok() ?? false,
      finalUrl: page.url()
    };

    await page.waitForFunction(
      () =>
        document.getElementById('h-earth-3d-status')?.textContent?.trim() ===
        'PUBLIC_STAGE_RENDERER_MOUNTED',
      { timeout: 150000 }
    );
    terminalReached = true;
    await page.waitForTimeout(2000);

    snapshot = await page.evaluate(() => {
      const mount = document.getElementById('h-earth-3d-renderer-mount');
      const stage = mount?.querySelector('.h-earth-3d-render-stage');
      const triangles = [
        ...(mount?.querySelectorAll(
          '[data-material-reference="H_EARTH_MATERIAL_WET_SAND"]' +
          '[data-material-intent="WET_SAND"]' +
          '[data-projected-type="TRIANGLE"]'
        ) ?? [])
      ];
      const styles = triangles.map((triangle) => {
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
        status:
          document.getElementById('h-earth-3d-status')?.textContent?.trim() ?? null,
        fallbackText:
          document.getElementById('h-earth-3d-fallback')?.textContent?.trim() ?? null,
        routeReceiptStatus:
          globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT?.status ?? null,
        rendererBootstrapReceipt:
          globalThis.H_EARTH_3D_RENDERER_BOOTSTRAP_RECEIPT
            ? {
                status:
                  globalThis.H_EARTH_3D_RENDERER_BOOTSTRAP_RECEIPT.status ?? null,
                mounted:
                  globalThis.H_EARTH_3D_RENDERER_BOOTSTRAP_RECEIPT.mounted ?? null,
                failureVariant:
                  globalThis.H_EARTH_3D_RENDERER_BOOTSTRAP_RECEIPT.failureVariant ?? null
              }
            : null,
        mount: mount
          ? {
              clientWidth: mount.clientWidth,
              clientHeight: mount.clientHeight,
              childElementCount: mount.childElementCount,
              sourcePreviewCount:
                mount.querySelectorAll('[data-h-earth-source-preview-owned="true"]').length,
              semanticLayerCount:
                mount.querySelectorAll('.h-earth-3d-render-semantic-layer').length,
              interactionBoundaryCount:
                mount.querySelectorAll('.h-earth-3d-render-interaction-boundary').length,
              primitiveCount:
                mount.querySelectorAll('.h-earth-3d-render-primitive').length,
              wetSandTriangleCount: triangles.length
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
          [...new Set(triangles.map((triangle) => triangle.dataset.primitiveId))],
        uniqueMaterialReferences:
          [...new Set(triangles.map((triangle) => triangle.dataset.materialReference))],
        uniqueMaterialIntents:
          [...new Set(triangles.map((triangle) => triangle.dataset.materialIntent))],
        uniquePresentationRoles:
          [...new Set(triangles.map((triangle) => triangle.dataset.presentationRole))],
        uniqueRenderLayers:
          [...new Set(triangles.map((triangle) => triangle.dataset.renderLayer))],
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

    for (const [label, selector] of [
      ['worldStage', '#h-earth-3d-world-stage'],
      ['rendererMount', '#h-earth-3d-renderer-mount']
    ]) {
      const screenshotPath = path.join(
        outputDirectory,
        `${configuration.id}-deployed-${label}.png`
      );
      await page.locator(selector).screenshot({ path: screenshotPath });
      const bytes = await readFile(screenshotPath);
      screenshots[label] = {
        path: screenshotPath,
        byteLength: bytes.length,
        sha256: createHash('sha256').update(bytes).digest('hex')
      };
    }
  } catch (error) {
    exception = {
      name: error?.name ?? 'UnknownError',
      message: error?.message ?? String(error),
      stack: error?.stack ?? null
    };
    try {
      snapshot = await page.evaluate(() => ({
        status:
          document.getElementById('h-earth-3d-status')?.textContent?.trim() ?? null,
        fallbackText:
          document.getElementById('h-earth-3d-fallback')?.textContent?.trim() ?? null,
        routeFailure:
          globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_ENTRY_FAILURE ?? null
      }));
    } catch {
      snapshot = null;
    }
  }

  await context.close();
  return {
    configuration: configuration.id,
    requestedUrl: url.href,
    elapsedMs: Date.now() - startedAt,
    navigation,
    terminalReached,
    snapshot,
    exception,
    pageErrors,
    requestFailures,
    consoleErrors,
    screenshots
  };
}

const correspondence = await tracePublicRenderer();
const captures = [];
let browser = null;

if (correspondence.matched) {
  try {
    browser = await chromium.launch({ headless: true });
    for (const configuration of configurations) {
      captures.push(await captureOne(browser, configuration));
    }
  } finally {
    await browser?.close();
  }
}

const report = {
  reportId: 'H_EARTH_FD05_DEPLOYED_WET_SAND_VISUAL_BASELINE_CAPTURE_001',
  generatedAt: new Date().toISOString(),
  status: 'DIAGNOSTIC_CAPTURE_COMPLETE',
  repositoryCommit: 'cbde5b50470a528954f634baf8045674c2079cf0',
  repositoryModified: false,
  correspondence,
  captures,
  summary: {
    correspondenceMatched: correspondence.matched,
    captureCount: captures.length,
    terminalCount: captures.filter((capture) => capture.terminalReached).length,
    totalPageErrors:
      captures.reduce((total, capture) => total + capture.pageErrors.length, 0),
    totalRequestFailures:
      captures.reduce((total, capture) => total + capture.requestFailures.length, 0),
    totalConsoleErrors:
      captures.reduce((total, capture) => total + capture.consoleErrors.length, 0)
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
  summary: report.summary
}, null, 2));
