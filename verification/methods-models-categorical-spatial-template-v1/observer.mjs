import fs from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";

const chromePath = process.env.CHROME_PATH;
if (!chromePath) throw new Error("CHROME_PATH_REQUIRED");
const origin = process.env.METHODS_ORIGIN || "http://127.0.0.1:4173";
const outDir = path.resolve(process.env.OUT_DIR || "methods-models-categorical-spatial-template-v1-evidence");
const screenshotDir = path.join(outDir, "screenshots");
await fs.mkdir(screenshotDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"]
});

const result = {
  contract: "METHODS_MODELS_CATEGORICAL_SPATIAL_TEMPLATE_OBSERVER_v1",
  observations: [],
  screenshots: [],
  consoleErrors: [],
  pageErrors: [],
  requestFailures: [],
  checks: {},
  productAcceptanceGranted: false
};

async function stableSnapshot(page) {
  await page.evaluate(() => globalThis.__METHODS_SPATIAL_APP.whenStable());
  return page.evaluate(() => {
    const app = globalThis.__METHODS_SPATIAL_APP;
    const scene = app.resolvedScene;
    const stage = document.querySelector("[data-spatial-stage]");
    const activeElement = document.querySelector(".spatial-model-node[data-active='true']");
    const stageRect = stage.getBoundingClientRect();
    const activeRect = activeElement.getBoundingClientRect();
    const intersectionWidth = Math.max(0, Math.min(stageRect.right, activeRect.right) - Math.max(stageRect.left, activeRect.left));
    const intersectionHeight = Math.max(0, Math.min(stageRect.bottom, activeRect.bottom) - Math.max(stageRect.top, activeRect.top));
    const activeArea = Math.max(1, activeRect.width * activeRect.height);
    const activeCenterX = activeRect.left + activeRect.width / 2;
    const activeCenterY = activeRect.top + activeRect.height / 2;
    const stageCenterX = stageRect.left + stageRect.width / 2;
    const stageCenterY = stageRect.top + stageRect.height / 2;
    const visibleNodes = scene.nodes.filter(node => node.visible);

    return {
      native: scene.native,
      cameraMode: app.cameraMode,
      inspectionOpen: app.inspectionOpen,
      camera: scene.camera,
      activeModel: scene.activeDescriptor.modelId,
      activeFamily: scene.activeDescriptor.familyId,
      visibleCluster: scene.visibleCluster,
      lifecycles: Object.fromEntries(visibleNodes.map(node => [node.modelId, node.lifecycle])),
      detailClasses: Object.fromEntries(visibleNodes.map(node => [node.modelId, node.detailClass])),
      lifecycleCounts: Object.fromEntries(["ACTIVE_MODEL", "NEAR_NEIGHBOR", "FAMILY_CONTEXT", "DISTANT_CORPUS"].map(name => [name, visibleNodes.filter(node => node.lifecycle === name).length])),
      activePresentation: {
        visibleRatio: (intersectionWidth * intersectionHeight) / activeArea,
        area: activeArea,
        width: activeRect.width,
        height: activeRect.height,
        centerOffsetX: Math.abs(activeCenterX - stageCenterX) / Math.max(1, stageRect.width),
        centerOffsetY: Math.abs(activeCenterY - stageCenterY) / Math.max(1, stageRect.height),
        top: activeRect.top,
        left: activeRect.left,
        text: activeElement.querySelector("[data-spatial-model-text]")?.textContent?.trim() || ""
      },
      receiptCount: app.receipts.length,
      registry: {
        familyCount: app.registry.familyCount,
        modelCount: app.registry.modelCount,
        lensCount: app.registry.lensCount,
        registryVersion: app.registry.registryVersion
      }
    };
  });
}

async function capture(page, name) {
  const file = path.join(screenshotDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  result.screenshots.push(path.relative(outDir, file));
}

async function waitForNativeChange(page, before, key) {
  await page.waitForFunction((prior, property) => {
    const scene = globalThis.__METHODS_SPATIAL_APP?.resolvedScene;
    if (!scene) return false;
    const current = property === "model" ? scene.native.modelId : property === "family" ? scene.native.familyId : scene.native.lensId;
    return current && current !== prior;
  }, { timeout: 12000 }, before, key);
  return stableSnapshot(page);
}

async function runViewport(label, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  page.on("console", message => {
    if (message.type() === "error") {
      result.consoleErrors.push({
        viewport: label,
        text: message.text(),
        location: message.location(),
        stackTrace: message.stackTrace()
      });
    }
  });
  page.on("pageerror", error => result.pageErrors.push({ viewport: label, text: error.message, stack: error.stack || null }));
  page.on("requestfailed", request => result.requestFailures.push({ viewport: label, url: request.url(), reason: request.failure()?.errorText || "unknown" }));

  await page.goto(`${origin}/verification/methods-models-categorical-spatial-template-v1/`, { waitUntil: "networkidle0", timeout: 30000 });
  await page.waitForFunction(() => document.documentElement.dataset.methodsSpatialReady === "true", { timeout: 20000 });
  const overview = await stableSnapshot(page);
  result.observations.push({ viewport: label, state: "overview", snapshot: overview });
  await capture(page, `${label}-01-overview`);

  await page.evaluate(() => globalThis.__METHODS_SPATIAL_APP.setCameraMode("browse"));
  const browse = await stableSnapshot(page);
  result.observations.push({ viewport: label, state: "browse", snapshot: browse });
  await capture(page, `${label}-02-browse`);

  const beforeModel = browse.native.modelId;
  await page.evaluate(() => globalThis.__METHODS_SPATIAL_APP.moveModel(1));
  const modelMoved = await waitForNativeChange(page, beforeModel, "model");
  result.observations.push({ viewport: label, state: "model-transition", snapshot: modelMoved });
  await capture(page, `${label}-03-model-transition`);

  const beforeLens = modelMoved.native.lensId;
  await page.evaluate(() => globalThis.__METHODS_SPATIAL_APP.moveLens(1));
  const lensMoved = await waitForNativeChange(page, beforeLens, "lens");
  result.observations.push({ viewport: label, state: "lens-transition", snapshot: lensMoved });
  await capture(page, `${label}-04-lens-transition`);

  const beforeFamily = lensMoved.native.familyId;
  await page.evaluate(() => globalThis.__METHODS_SPATIAL_APP.moveFamily(1));
  const familyMoved = await waitForNativeChange(page, beforeFamily, "family");
  result.observations.push({ viewport: label, state: "family-transition", snapshot: familyMoved });
  await capture(page, `${label}-05-family-transition`);

  await page.evaluate(() => globalThis.__METHODS_SPATIAL_APP.inspect());
  await page.waitForFunction(() => globalThis.__METHODS_SPATIAL_APP.inspectionOpen === true, { timeout: 12000 });
  const inspected = await stableSnapshot(page);
  result.observations.push({ viewport: label, state: "inspection", snapshot: inspected });
  await capture(page, `${label}-06-inspection`);

  await page.evaluate(() => globalThis.__METHODS_SPATIAL_APP.closeInspection());
  await page.waitForFunction(() => globalThis.__METHODS_SPATIAL_APP.inspectionOpen === false && Boolean(globalThis.__METHODS_SPATIAL_RETURN_RECEIPT), { timeout: 12000 });
  const returned = await stableSnapshot(page);
  const returnReceipt = await page.evaluate(() => globalThis.__METHODS_SPATIAL_RETURN_RECEIPT);
  result.observations.push({ viewport: label, state: "exact-return", snapshot: returned, returnReceipt });
  await capture(page, `${label}-07-exact-return`);

  await page.close();
  return { overview, browse, modelMoved, lensMoved, familyMoved, returned, returnReceipt };
}

try {
  const desktop = await runViewport("desktop-1440x1000", { width: 1440, height: 1000, deviceScaleFactor: 1 });
  const mobile = await runViewport("mobile-390x844", { width: 390, height: 844, deviceScaleFactor: 1 });

  const overviewBrowseDiffer = snapshot => JSON.stringify(snapshot.overview.camera) !== JSON.stringify(snapshot.browse.camera) && snapshot.overview.cameraMode === "overview" && snapshot.browse.cameraMode === "browse";
  const hasSpatialLifecycle = snapshot => snapshot.browse.lifecycleCounts.ACTIVE_MODEL === 1 && snapshot.browse.lifecycleCounts.NEAR_NEIGHBOR >= 2 && snapshot.browse.lifecycleCounts.DISTANT_CORPUS >= 1;
  const activeContained = snapshot => snapshot.overview.activePresentation.visibleRatio >= 0.95 && snapshot.browse.activePresentation.visibleRatio >= 0.98;
  const browseFocusesActive = snapshot => snapshot.browse.activePresentation.area >= snapshot.overview.activePresentation.area * 1.2 && snapshot.browse.activePresentation.centerOffsetX <= 0.2 && snapshot.browse.activePresentation.centerOffsetY <= 0.25;
  const lensIsPerceptible = snapshot => snapshot.modelMoved.native.lensId !== snapshot.lensMoved.native.lensId && snapshot.modelMoved.activePresentation.text !== snapshot.lensMoved.activePresentation.text && JSON.stringify(snapshot.modelMoved.camera) !== JSON.stringify(snapshot.lensMoved.camera) && Math.abs(snapshot.modelMoved.activePresentation.top - snapshot.lensMoved.activePresentation.top) >= 8;
  const familyMovesField = snapshot => snapshot.lensMoved.native.familyId !== snapshot.familyMoved.native.familyId && snapshot.lensMoved.activeModel !== snapshot.familyMoved.activeModel && JSON.stringify(snapshot.lensMoved.camera.target) !== JSON.stringify(snapshot.familyMoved.camera.target);
  const exactReturnFields = Object.freeze([
    "exactNativeReturn",
    "exactCameraRoleReturn",
    "exactCameraPresetReturn",
    "exactCameraTargetReturn",
    "exactCenteredTargetReturn",
    "exactVisibleClusterReturn",
    "exactDetailClassesReturn",
    "exactScrollPositionReturn",
    "exactFocusTargetReturn",
    "exactInputModeReturn",
    "exactViewportClassReturn",
    "exactViewportDimensionsReturn"
  ]);
  const exactReturn = run => exactReturnFields.every(field => run.returnReceipt?.[field] === true);

  result.checks = {
    registryOperational: desktop.overview.registry.familyCount === 4 && desktop.overview.registry.modelCount === 25 && desktop.overview.registry.lensCount === 3,
    desktopOverviewBrowseDistinct: overviewBrowseDiffer(desktop),
    mobileOverviewBrowseDistinct: overviewBrowseDiffer(mobile),
    desktopActiveExhibitContained: activeContained(desktop),
    mobileActiveExhibitContained: activeContained(mobile),
    desktopBrowseFocusesActive: browseFocusesActive(desktop),
    mobileBrowseFocusesActive: browseFocusesActive(mobile),
    desktopSpatialLifecycleVisible: hasSpatialLifecycle(desktop),
    mobileSpatialLifecycleVisible: hasSpatialLifecycle(mobile),
    desktopLensTransitionPerceptible: lensIsPerceptible(desktop),
    mobileLensTransitionPerceptible: lensIsPerceptible(mobile),
    desktopFamilyTransitionSpatial: familyMovesField(desktop),
    mobileFamilyTransitionSpatial: familyMovesField(mobile),
    desktopExactReturn: exactReturn(desktop),
    mobileExactReturn: exactReturn(mobile),
    desktopTransitionReceipts: desktop.returned.receiptCount >= 6,
    mobileTransitionReceipts: mobile.returned.receiptCount >= 6,
    noConsoleErrors: result.consoleErrors.length === 0,
    noPageErrors: result.pageErrors.length === 0,
    noRequestFailures: result.requestFailures.length === 0
  };
  result.exactReturnFields = exactReturnFields;
  result.result = Object.values(result.checks).every(Boolean) ? "PASS_OPERATIONAL_VERTICAL_SLICE" : "FAIL_OPERATIONAL_VERTICAL_SLICE";
} finally {
  await browser.close();
}

await fs.writeFile(path.join(outDir, "observer-result.json"), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify({
  contract: result.contract,
  result: result.result,
  checks: result.checks,
  exactReturnFields: result.exactReturnFields,
  screenshotCount: result.screenshots.length,
  consoleErrors: result.consoleErrors,
  pageErrors: result.pageErrors,
  requestFailures: result.requestFailures
}, null, 2));
if (result.result !== "PASS_OPERATIONAL_VERTICAL_SLICE") process.exitCode = 1;
