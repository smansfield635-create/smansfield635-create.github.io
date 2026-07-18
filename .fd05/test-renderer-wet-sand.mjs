import { chromium } from 'playwright';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';

const outputDirectory = '.fd05/renderer-wet-sand-output';
await mkdir(outputDirectory, { recursive: true });

const configurations = [
  {
    id: 'mobile',
    context: {
      viewport: { width: 393, height: 852 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
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

const browser = await chromium.launch({ headless: true });
const results = [];

for (const configuration of configurations) {
  const context = await browser.newContext(configuration.context);
  const page = await context.newPage();
  const pageErrors = [];
  const requestFailures = [];

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

  await page.goto(
    `http://127.0.0.1:8000/showroom/globe/h-earth/?fd05RendererWetSand=${Date.now()}-${configuration.id}`,
    { waitUntil: 'domcontentloaded', timeout: 60000 }
  );

  await page.waitForFunction(
    () =>
      document.getElementById('h-earth-3d-status')?.textContent?.trim() ===
      'PUBLIC_STAGE_RENDERER_MOUNTED',
    { timeout: 120000 }
  );

  await page.waitForTimeout(1000);

  const snapshot = await page.evaluate(() => {
    const mount = document.getElementById('h-earth-3d-renderer-mount');
    const stage = mount?.querySelector('.h-earth-3d-render-stage');
    const triangles = [
      ...(mount?.querySelectorAll(
        '[data-material-reference="H_EARTH_MATERIAL_WET_SAND"]' +
        '[data-material-intent="WET_SAND"]' +
        '[data-projected-type="TRIANGLE"]'
      ) ?? [])
    ];

    const styleRecords = triangles.map((triangle) => {
      const computed = getComputedStyle(triangle);
      return {
        backgroundImage: computed.backgroundImage,
        backgroundSize: computed.backgroundSize,
        backgroundPosition: computed.backgroundPosition,
        backgroundRepeat: computed.backgroundRepeat,
        boxShadow: computed.boxShadow,
        filter: computed.filter,
        mixBlendMode: computed.mixBlendMode,
        opacity: computed.opacity,
        presentationModel: triangle.dataset.wetSandPresentationModel ?? null
      };
    });

    return {
      routeStatus:
        document.getElementById('h-earth-3d-status')?.textContent?.trim() ?? null,
      sourcePreviewCount:
        mount?.querySelectorAll('[data-h-earth-source-preview-owned="true"]').length ?? -1,
      semanticLayerCount:
        mount?.querySelectorAll('.h-earth-3d-render-semantic-layer').length ?? -1,
      interactionBoundaryCount:
        mount?.querySelectorAll('.h-earth-3d-render-interaction-boundary').length ?? -1,
      primitiveCount:
        mount?.querySelectorAll('.h-earth-3d-render-primitive').length ?? -1,
      triangleCount: triangles.length,
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
        [...new Set(styleRecords.map((record) => record.presentationModel))],
      uniqueBackgroundImages:
        [...new Set(styleRecords.map((record) => record.backgroundImage))],
      uniqueBackgroundSizes:
        [...new Set(styleRecords.map((record) => record.backgroundSize))],
      uniqueBackgroundPositions:
        [...new Set(styleRecords.map((record) => record.backgroundPosition))],
      uniqueBackgroundRepeats:
        [...new Set(styleRecords.map((record) => record.backgroundRepeat))],
      uniqueFilters:
        [...new Set(styleRecords.map((record) => record.filter))],
      uniqueBlendModes:
        [...new Set(styleRecords.map((record) => record.mixBlendMode))],
      uniqueOpacities:
        [...new Set(styleRecords.map((record) => record.opacity))],
      stageRect: stage
        ? {
            width: stage.getBoundingClientRect().width,
            height: stage.getBoundingClientRect().height
          }
        : null,
      firstTriangleStyle: styleRecords[0] ?? null
    };
  });

  const expectedBackgroundImageFragments = [
    'rgba(205, 226, 223, 0.34)',
    'rgb(145, 124, 93)',
    'rgb(68, 75, 69)'
  ];

  const gates = {
    routeMounted:
      snapshot.routeStatus === 'PUBLIC_STAGE_RENDERER_MOUNTED',
    triangleCount:
      snapshot.triangleCount === configuration.expectedTriangleCount,
    oneAdmittedPrimitive:
      snapshot.uniquePrimitiveIds.length === 1,
    semanticIdentity:
      JSON.stringify(snapshot.uniqueMaterialReferences) ===
        JSON.stringify(['H_EARTH_MATERIAL_WET_SAND']) &&
      JSON.stringify(snapshot.uniqueMaterialIntents) ===
        JSON.stringify(['WET_SAND']) &&
      JSON.stringify(snapshot.uniquePresentationRoles) ===
        JSON.stringify(['PRIMARY_ADMITTED_WET_SAND_SURFACE']) &&
      JSON.stringify(snapshot.uniqueRenderLayers) ===
        JSON.stringify(['GROUND']),
    presentationModel:
      JSON.stringify(snapshot.uniquePresentationModels) ===
        JSON.stringify(['BALANCED_STAGE_ALIGNED_v1']),
    continuousBackground:
      snapshot.uniqueBackgroundImages.length === 1 &&
      expectedBackgroundImageFragments.every((fragment) =>
        snapshot.uniqueBackgroundImages[0]?.includes(fragment)
      ) &&
      snapshot.uniqueBackgroundSizes.length === 1 &&
      snapshot.uniqueBackgroundPositions.length > 1 &&
      snapshot.uniqueBackgroundRepeats.every(
        (value) => value.includes('no-repeat')
      ),
    restrainedSurfaceResponse:
      JSON.stringify(snapshot.uniqueBlendModes) ===
        JSON.stringify(['normal']) &&
      JSON.stringify(snapshot.uniqueOpacities) ===
        JSON.stringify(['0.99']) &&
      snapshot.uniqueFilters.length === 1 &&
      snapshot.uniqueFilters[0]?.includes('saturate(1.1)') &&
      snapshot.uniqueFilters[0]?.includes('brightness(1.08)') &&
      snapshot.uniqueFilters[0]?.includes('contrast(0.94)'),
    rendererStructure:
      snapshot.semanticLayerCount === 15 &&
      snapshot.interactionBoundaryCount === 1 &&
      snapshot.primitiveCount === configuration.expectedTriangleCount,
    previewTakenOver:
      snapshot.sourcePreviewCount === 0,
    browserErrors:
      pageErrors.length === 0 && requestFailures.length === 0
  };

  const screenshotPath = path.join(
    outputDirectory,
    `${configuration.id}-balanced-installed.png`
  );
  await page.locator('#h-earth-3d-world-stage').screenshot({
    path: screenshotPath
  });
  const screenshotBytes = await readFile(screenshotPath);

  const result = {
    configuration: configuration.id,
    expectedTriangleCount: configuration.expectedTriangleCount,
    snapshot,
    gates,
    passed: Object.values(gates).every(Boolean),
    pageErrors,
    requestFailures,
    screenshot: {
      path: screenshotPath,
      byteLength: screenshotBytes.length,
      sha256: createHash('sha256').update(screenshotBytes).digest('hex')
    }
  };

  if (!result.passed) {
    console.error(JSON.stringify(result, null, 2));
    throw new Error(`${configuration.id}: installed wet-sand renderer gates failed`);
  }

  results.push(result);
  await context.close();
}

await browser.close();

const report = {
  reportId: 'H_EARTH_FD05_RENDERER_WET_SAND_PREMERGE_BROWSER_VALIDATION_001',
  generatedAt: new Date().toISOString(),
  status: 'PASS',
  repositoryModifiedByTest: false,
  results,
  aggregate: {
    allPassed: results.every((result) => result.passed),
    mobileTriangleCount: results.find((result) => result.configuration === 'mobile')?.snapshot.triangleCount,
    desktopTriangleCount: results.find((result) => result.configuration === 'desktop')?.snapshot.triangleCount,
    totalPageErrors: results.reduce((total, result) => total + result.pageErrors.length, 0),
    totalRequestFailures: results.reduce((total, result) => total + result.requestFailures.length, 0)
  }
};

await writeFile(
  path.join(outputDirectory, 'browser-validation.json'),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8'
);

console.log(JSON.stringify({
  reportId: report.reportId,
  status: report.status,
  aggregate: report.aggregate
}, null, 2));

await rm('node_modules', {
  recursive: true,
  force: true
});
