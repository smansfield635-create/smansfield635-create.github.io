import { chromium } from 'playwright';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const outDir = '.fd05/native-shoreline-output';
await mkdir(outDir, { recursive: true });

const baseUrl = process.env.H_EARTH_TEST_BASE_URL ??
  'http://127.0.0.1:8765/showroom/globe/h-earth/';

const configurations = [
  {
    id: 'mobile',
    context: {
      viewport: { width: 393, height: 852 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (Linux; Android 16; FD05NativeShoreline) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36'
    }
  },
  {
    id: 'desktop',
    context: {
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 1
    }
  }
];

function summarizeBoxes(boxes) {
  const valid = boxes.filter((box) => box && Number.isFinite(box.x));
  if (!valid.length) return null;
  return {
    count: valid.length,
    minimumX: Math.min(...valid.map((box) => box.x)),
    maximumX: Math.max(...valid.map((box) => box.x + box.width)),
    minimumY: Math.min(...valid.map((box) => box.y)),
    maximumY: Math.max(...valid.map((box) => box.y + box.height)),
    meanCenterY: valid.reduce((sum, box) => sum + box.y + box.height / 2, 0) / valid.length,
    meanWidth: valid.reduce((sum, box) => sum + box.width, 0) / valid.length,
    meanHeight: valid.reduce((sum, box) => sum + box.height, 0) / valid.length
  };
}

const browser = await chromium.launch({ headless: true });
const results = [];

for (const configuration of configurations) {
  const context = await browser.newContext(configuration.context);
  const page = await context.newPage();
  const pageErrors = [];
  const requestFailures = [];
  const consoleErrors = [];

  page.on('pageerror', (error) => {
    pageErrors.push({ name: error.name, message: error.message, stack: error.stack });
  });
  page.on('requestfailed', (request) => {
    requestFailures.push({ url: request.url(), failure: request.failure() });
  });
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  const url = new URL(baseUrl);
  url.searchParams.set('fd05NativeShoreline', `${Date.now()}-${configuration.id}`);
  const startedAt = Date.now();
  const response = await page.goto(url.href, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  await page.waitForFunction(() => {
    const status = document.getElementById('h-earth-3d-status')?.textContent ?? '';
    return (
      status.includes('PUBLIC_STAGE_RENDERER_MOUNTED') ||
      status.includes('PUBLIC_STAGE_SOURCE_PREVIEW_FALLBACK') ||
      Boolean(globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_ENTRY_FAILURE)
    );
  }, { timeout: 120000 });

  await page.waitForTimeout(1800);

  const snapshot = await page.evaluate(() => {
    const mount = document.getElementById('h-earth-3d-renderer-mount');
    const status = document.getElementById('h-earth-3d-status')?.textContent?.trim() ?? null;
    const primitiveSelector = '.h-earth-3d-render-primitive';
    const materialSelector = (material) =>
      `${primitiveSelector}[data-material-reference="${material}"]`;
    const materials = {
      wetSand: [...(mount?.querySelectorAll(materialSelector('H_EARTH_MATERIAL_WET_SAND')) ?? [])],
      foam: [...(mount?.querySelectorAll(materialSelector('H_EARTH_MATERIAL_FOAM')) ?? [])],
      water: [...(mount?.querySelectorAll(materialSelector('H_EARTH_MATERIAL_OPEN_WATER')) ?? [])]
    };
    const elementSummary = (elements) => elements.map((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        primitiveId: element.dataset.primitiveId ?? null,
        materialReference: element.dataset.materialReference ?? null,
        materialIntent: element.dataset.materialIntent ?? null,
        presentationRole: element.dataset.presentationRole ?? null,
        renderLayer: element.dataset.renderLayer ?? null,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        backgroundImage: style.backgroundImage,
        opacity: style.opacity
      };
    });
    const routeReceipt = globalThis.H_EARTH_3D_ROUTE_BOOTSTRAP_RECEIPT ?? null;
    const rendererReceiptSource =
      globalThis.H_EARTH_3D_RENDERER_BOOTSTRAP_RECEIPT ??
      routeReceipt?.rendererBootstrapReceipt ??
      null;
    return {
      status,
      routeReceiptStatus: routeReceipt?.status ?? null,
      rendererReceipt: rendererReceiptSource
        ? {
            status: rendererReceiptSource.status ?? null,
            mounted: rendererReceiptSource.mounted ?? null,
            failureVariant: rendererReceiptSource.failureVariant ?? null
          }
        : null,
      htmlFailure: globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_ENTRY_FAILURE ?? null,
      importReceipt: globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_IMPORT_DIAGNOSTIC_RECEIPT
        ? {
            attemptedBranchCount: globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_IMPORT_DIAGNOSTIC_RECEIPT.attemptedBranchCount,
            successfulBranchCount: globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_IMPORT_DIAGNOSTIC_RECEIPT.successfulBranchCount,
            failedBranchCount: globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_IMPORT_DIAGNOSTIC_RECEIPT.failedBranchCount,
            allRequiredImportsSucceeded: globalThis.H_EARTH_3D_PUBLIC_ROUTE_HTML_IMPORT_DIAGNOSTIC_RECEIPT.allRequiredImportsSucceeded
          }
        : null,
      mount: mount
        ? {
            clientWidth: mount.clientWidth,
            clientHeight: mount.clientHeight,
            rendererStageCount: mount.querySelectorAll('.h-earth-3d-render-stage').length,
            rendererPrimitiveCount: mount.querySelectorAll(primitiveSelector).length,
            sourcePreviewCount: mount.querySelectorAll('[data-h-earth-source-preview-owned="true"]').length,
            semanticLayerCount: mount.querySelectorAll('.h-earth-3d-render-semantic-layer').length,
            interactionBoundaryCount: mount.querySelectorAll('.h-earth-3d-render-interaction-boundary').length
          }
        : null,
      materialElements: {
        wetSand: elementSummary(materials.wetSand),
        foam: elementSummary(materials.foam),
        water: elementSummary(materials.water)
      }
    };
  });

  const materialBoxes = {
    wetSand: summarizeBoxes(snapshot.materialElements.wetSand),
    foam: summarizeBoxes(snapshot.materialElements.foam),
    water: summarizeBoxes(snapshot.materialElements.water)
  };

  const worldStagePath = path.join(outDir, `${configuration.id}-world-stage.png`);
  const rendererMountPath = path.join(outDir, `${configuration.id}-renderer-mount.png`);
  await page.locator('.h-earth-3d-world-stage').screenshot({ path: worldStagePath });
  await page.locator('#h-earth-3d-renderer-mount').screenshot({ path: rendererMountPath });

  const result = {
    configuration: configuration.id,
    navigation: {
      status: response?.status() ?? null,
      ok: response?.ok() ?? false,
      elapsedToTerminalMs: Date.now() - startedAt
    },
    snapshot,
    materialBoxes,
    pageErrors,
    requestFailures,
    consoleErrors,
    screenshots: { worldStagePath, rendererMountPath }
  };

  if (snapshot.status !== 'PUBLIC_STAGE_RENDERER_MOUNTED') {
    throw Object.assign(new Error(`${configuration.id}: route did not reach renderer mount.`), { details: result });
  }
  if (snapshot.routeReceiptStatus !== 'PUBLIC_STAGE_READY') {
    throw Object.assign(new Error(`${configuration.id}: route receipt not ready.`), { details: result });
  }
  const mountedByReceipt = snapshot.rendererReceipt?.mounted === true;
  const mountedByDom =
    snapshot.mount?.rendererStageCount === 1 &&
    snapshot.mount?.rendererPrimitiveCount > 0;
  if (!mountedByReceipt && !mountedByDom) {
    throw Object.assign(new Error(`${configuration.id}: renderer mount evidence missing.`), { details: result });
  }
  if (snapshot.importReceipt?.allRequiredImportsSucceeded !== true) {
    throw Object.assign(new Error(`${configuration.id}: import corridor incomplete.`), { details: result });
  }
  if (snapshot.importReceipt?.attemptedBranchCount !== 5) {
    throw Object.assign(new Error(`${configuration.id}: top-level branch count changed.`), { details: result });
  }
  if (snapshot.mount?.sourcePreviewCount !== 0) {
    throw Object.assign(new Error(`${configuration.id}: source preview remained after takeover.`), { details: result });
  }
  if (snapshot.mount?.semanticLayerCount !== 15 || snapshot.mount?.interactionBoundaryCount !== 1) {
    throw Object.assign(new Error(`${configuration.id}: renderer structure changed.`), { details: result });
  }
  if (!materialBoxes.wetSand || !materialBoxes.foam || !materialBoxes.water) {
    throw Object.assign(new Error(`${configuration.id}: one or more shoreline materials were not materialized.`), { details: result });
  }
  if (pageErrors.length || requestFailures.length || consoleErrors.length) {
    throw Object.assign(new Error(`${configuration.id}: browser errors observed.`), { details: result });
  }

  results.push(result);
  await context.close();
}

await browser.close();

const report = {
  reportId: 'H_EARTH_FD05_MINIMUM_NATIVE_SHORELINE_BROWSER_VALIDATION_001',
  generatedAt: new Date().toISOString(),
  status: 'PASS',
  results,
  claims: {
    nativeWetSand: true,
    nativeFoamContact: true,
    nativeWaterSurface: true,
    fluidSimulation: false,
    beachVisualBaseline: false,
    globalVisualPass: false,
    production: false
  }
};

await writeFile(
  `${outDir}/browser-validation.json`,
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8'
);
console.log(JSON.stringify({
  reportId: report.reportId,
  status: report.status,
  results: results.map((result) => ({
    configuration: result.configuration,
    navigation: result.navigation,
    status: result.snapshot.status,
    mount: result.snapshot.mount,
    materialBoxes: result.materialBoxes,
    pageErrors: result.pageErrors.length,
    requestFailures: result.requestFailures.length,
    consoleErrors: result.consoleErrors.length
  }))
}, null, 2));
