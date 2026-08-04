import fs from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";

const chromePath = process.env.CHROME_PATH;
if (!chromePath) throw new Error("CHROME_PATH_REQUIRED");
const origin = process.env.METHODS_ORIGIN || "http://127.0.0.1:4173";
const outDir = path.resolve(process.env.OUT_DIR || "methods-categorical-spatial-context-equation-embodiment-v1-evidence");
const screenshotDir = path.join(outDir, "screenshots");
await fs.mkdir(screenshotDir, { recursive: true });

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

const inspectionSelectors = Object.freeze({
  FAMILY_TITLE: "[data-inspection-family-title]",
  FAMILY_QUESTION: "[data-inspection-family-question]",
  MODEL_TITLE: "[data-inspection-model-title]",
  MODEL_QUESTION: "[data-inspection-model-question]",
  STATEMENT: "[data-inspection-statement]",
  EQUATION_LABEL: "[data-inspection-equation-label]",
  EQUATION: "[data-inspection-equation]",
  SOURCE_STATE: "[data-inspection-source-state]",
  STATUS: "[data-inspection-status]",
  PRACTICAL: "[data-inspection-practical]",
  ENGINEERING: "[data-inspection-engineering]",
  EVIDENCE: "[data-inspection-evidence]",
  PURPOSE: "[data-inspection-purpose]",
  SYMBOLS: "[data-inspection-symbols]",
  ARCHITECTURE: "[data-inspection-architecture]",
  OPERATION: "[data-inspection-operation]",
  FAILURE_BEHAVIOR: "[data-inspection-failure]",
  EVIDENCE_STANDING: "[data-inspection-evidence-standing]",
  LIMITS: "[data-inspection-limits]"
});

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"]
});

const result = {
  contract: "METHODS_CATEGORICAL_SPATIAL_CONTEXT_AND_EQUATION_EMBODIMENT_OBSERVER_v1",
  baselineHead: "ab636b11e32253ece8e00f05993d980f747fa980",
  observations: [],
  representativeCaptures: [],
  screenshots: [],
  consoleErrors: [],
  pageErrors: [],
  requestFailures: [],
  checks: {},
  exactReturnFields,
  inspectionFields: Object.keys(inspectionSelectors),
  productAcceptanceGranted: false,
  mergeAuthorized: false,
  full1575StateCertificationClaimed: false
};

async function writeJson(name, value) {
  await fs.writeFile(path.join(outDir, name), `${JSON.stringify(value, null, 2)}\n`);
}

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
    const domNodes = Array.from(document.querySelectorAll(".spatial-model-node"));
    const familyPlanes = Array.from(document.querySelectorAll(".spatial-family-plane"));
    const descriptor = app.activeSemanticDescriptor;
    const formDistribution = Object.fromEntries(app.registry.equationFormClasses.map(form => [form, domNodes.filter(node => node.dataset.formClass === form).length]));
    const sourceDistribution = Object.fromEntries(["confirmed", "hold"].map(state => [state, domNodes.filter(node => node.dataset.sourceState === state).length]));
    const heldNodes = domNodes.filter(node => node.dataset.sourceState === "hold");
    const confirmedNodes = domNodes.filter(node => node.dataset.sourceState === "confirmed");

    return {
      native: scene.native,
      cameraMode: app.cameraMode,
      inspectionOpen: app.inspectionOpen,
      camera: scene.camera,
      activeModel: scene.activeDescriptor.modelId,
      activeFamily: scene.activeDescriptor.familyId,
      activeSemantic: {
        familyId: descriptor.FAMILY_ID,
        modelId: descriptor.MODEL_ID,
        title: descriptor.TITLE,
        question: descriptor.QUESTION,
        statement: descriptor.STATEMENT,
        equation: descriptor.EQUATION,
        equationLabel: descriptor.EQUATION_LABEL,
        sourceState: descriptor.SOURCE_STATE,
        status: descriptor.STATUS,
        formClass: descriptor.EQUATION_FORM_CLASS,
        canonicalSourceReference: descriptor.CANONICAL_SOURCE_REFERENCE
      },
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
        lensText: activeElement.querySelector("[data-spatial-model-text]")?.textContent?.trim() || "",
        equation: activeElement.querySelector(".spatial-model-node__equation")?.innerHTML || ""
      },
      corpusProjection: {
        familyPlaneCount: familyPlanes.length,
        familyIds: familyPlanes.map(plane => plane.dataset.familyId),
        modelNodeCount: domNodes.length,
        presentModelNodeCount: domNodes.filter(node => !node.hidden).length,
        equationNodeCount: domNodes.filter(node => node.querySelector(".spatial-model-node__equation")?.textContent?.trim()).length,
        destinationCount: document.querySelectorAll(".spatial-family-destination").length,
        sourceDistribution,
        formDistribution,
        heldEnvironmentalBoundary: heldNodes.every(node => getComputedStyle(node).borderStyle.includes("dashed") && getComputedStyle(node).backgroundImage !== "none"),
        confirmedEnvironmentalBoundary: confirmedNodes.every(node => !getComputedStyle(node).borderStyle.includes("dashed")),
        familyTitlesPresent: familyPlanes.every(plane => plane.querySelector(".spatial-family-plane__header strong")?.textContent?.trim()),
        familyQuestionsPresent: familyPlanes.every(plane => plane.querySelector(".spatial-family-plane__header p")?.textContent?.trim())
      },
      receiptCount: app.receipts.length,
      registry: {
        familyCount: app.registry.familyCount,
        modelCount: app.registry.modelCount,
        lensCount: app.registry.lensCount,
        registryVersion: app.registry.registryVersion,
        semanticRegistryContract: app.registry.semanticRegistryContract
      }
    };
  });
}

async function inspectionSnapshot(page) {
  return page.evaluate(selectors => {
    const entries = Object.fromEntries(Object.entries(selectors).map(([field, selector]) => {
      const element = document.querySelector(selector);
      const value = field === "SYMBOLS"
        ? Array.from(element?.querySelectorAll("li") || []).map(item => item.textContent.trim())
        : element?.textContent?.trim() || "";
      return [field, value];
    }));
    const complete = Object.entries(entries).every(([field, value]) => field === "SYMBOLS" ? Array.isArray(value) && value.length > 0 : String(value).length > 0);
    return {
      open: globalThis.__METHODS_SPATIAL_APP.inspectionOpen,
      entries,
      complete,
      sourceState: document.querySelector("[data-spatial-inspection]")?.dataset.sourceState || null,
      formClass: document.querySelector("[data-spatial-inspection]")?.dataset.formClass || null,
      modelId: document.querySelector("[data-spatial-inspection]")?.dataset.modelId || null
    };
  }, inspectionSelectors);
}

async function capture(page, name, options = {}) {
  const file = path.join(screenshotDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: Boolean(options.fullPage) });
  result.screenshots.push(path.relative(outDir, file));
  return path.relative(outDir, file);
}

async function captureCompleteInspection(page, name) {
  await page.evaluate(() => {
    const inspection = document.querySelector("[data-spatial-inspection]");
    const panel = document.querySelector(".spatial-inspection__panel");
    inspection.dataset.captureComplete = "true";
    inspection.style.position = "absolute";
    inspection.style.alignItems = "start";
    panel.style.maxHeight = "none";
    panel.style.overflow = "visible";
  });
  const screenshot = await capture(page, name, { fullPage: true });
  await page.evaluate(() => {
    const inspection = document.querySelector("[data-spatial-inspection]");
    const panel = document.querySelector(".spatial-inspection__panel");
    delete inspection.dataset.captureComplete;
    inspection.removeAttribute("style");
    panel.removeAttribute("style");
  });
  return screenshot;
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

async function captureFamilyRepresentatives(page, label) {
  await page.evaluate(() => globalThis.__METHODS_SPATIAL_APP.setCameraMode("overview"));
  await stableSnapshot(page);
  const captures = [];
  const visited = new Set();
  for (let attempt = 0; attempt < 8 && visited.size < 4; attempt += 1) {
    const snapshot = await stableSnapshot(page);
    if (!visited.has(snapshot.activeFamily)) {
      visited.add(snapshot.activeFamily);
      const file = await capture(page, `${label}-family-${String(visited.size).padStart(2, "0")}-${snapshot.activeFamily}-${snapshot.activeSemantic.formClass.toLowerCase()}`);
      captures.push({ familyId: snapshot.activeFamily, modelId: snapshot.activeModel, equation: snapshot.activeSemantic.equation, formClass: snapshot.activeSemantic.formClass, sourceState: snapshot.activeSemantic.sourceState, screenshot: file });
    }
    if (visited.size < 4) {
      const before = snapshot.activeFamily;
      await page.evaluate(() => globalThis.__METHODS_SPATIAL_APP.moveFamily(1));
      await waitForNativeChange(page, before, "family");
    }
  }
  result.representativeCaptures.push({ viewport: label, captures });
  return captures;
}

async function runViewport(label, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  page.on("console", message => {
    if (message.type() === "error") result.consoleErrors.push({ viewport: label, text: message.text(), location: message.location(), stackTrace: message.stackTrace() });
  });
  page.on("pageerror", error => result.pageErrors.push({ viewport: label, text: error.message, stack: error.stack || null }));
  page.on("requestfailed", request => result.requestFailures.push({ viewport: label, url: request.url(), reason: request.failure()?.errorText || "unknown" }));

  await page.goto(`${origin}/verification/methods-categorical-spatial-context-equation-embodiment-v1/`, { waitUntil: "networkidle0", timeout: 30000 });
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
  const inspection = await inspectionSnapshot(page);
  const completeInspectionScreenshot = await captureCompleteInspection(page, `${label}-06-complete-inspection`);
  result.observations.push({ viewport: label, state: "inspection", snapshot: inspected, inspection, completeInspectionScreenshot });

  await page.evaluate(() => globalThis.__METHODS_SPATIAL_APP.closeInspection());
  await page.waitForFunction(() => globalThis.__METHODS_SPATIAL_APP.inspectionOpen === false && Boolean(globalThis.__METHODS_SPATIAL_RETURN_RECEIPT), { timeout: 12000 });
  const returned = await stableSnapshot(page);
  const returnReceipt = await page.evaluate(() => globalThis.__METHODS_SPATIAL_RETURN_RECEIPT);
  result.observations.push({ viewport: label, state: "exact-return", snapshot: returned, returnReceipt });
  await capture(page, `${label}-07-exact-return`);

  const representatives = await captureFamilyRepresentatives(page, label);
  await page.close();
  return { overview, browse, modelMoved, lensMoved, familyMoved, inspected, inspection, returned, returnReceipt, representatives };
}

try {
  const desktop = await runViewport("desktop-1440x1000", { width: 1440, height: 1000, deviceScaleFactor: 1 });
  const mobile = await runViewport("mobile-390x844", { width: 390, height: 844, deviceScaleFactor: 1 });

  const overviewBrowseDiffer = run => JSON.stringify(run.overview.camera) !== JSON.stringify(run.browse.camera) && run.overview.cameraMode === "overview" && run.browse.cameraMode === "browse";
  const hasSpatialLifecycle = run => run.browse.lifecycleCounts.ACTIVE_MODEL === 1 && run.browse.lifecycleCounts.NEAR_NEIGHBOR >= 2 && run.browse.lifecycleCounts.DISTANT_CORPUS >= 1;
  const activeContained = run => run.overview.activePresentation.visibleRatio >= 0.90 && run.browse.activePresentation.visibleRatio >= 0.95;
  const browseFocusesActive = run => run.browse.activePresentation.area >= run.overview.activePresentation.area * 1.1 && run.browse.activePresentation.centerOffsetX <= 0.24 && run.browse.activePresentation.centerOffsetY <= 0.28;
  const lensIsPerceptible = run => run.modelMoved.native.lensId !== run.lensMoved.native.lensId && run.modelMoved.activePresentation.lensText !== run.lensMoved.activePresentation.lensText && JSON.stringify(run.modelMoved.camera) !== JSON.stringify(run.lensMoved.camera);
  const familyMovesField = run => run.lensMoved.native.familyId !== run.familyMoved.native.familyId && run.lensMoved.activeModel !== run.familyMoved.activeModel && JSON.stringify(run.lensMoved.camera.target) !== JSON.stringify(run.familyMoved.camera.target);
  const exactReturn = run => exactReturnFields.every(field => run.returnReceipt?.[field] === true);
  const corpusComplete = run => run.overview.corpusProjection.familyPlaneCount === 4 && run.overview.corpusProjection.modelNodeCount === 25 && run.overview.corpusProjection.presentModelNodeCount === 25 && run.overview.corpusProjection.equationNodeCount === 25 && run.overview.corpusProjection.destinationCount === 25;
  const sourceExpressionComplete = run => run.overview.corpusProjection.sourceDistribution.confirmed + run.overview.corpusProjection.sourceDistribution.hold === 25 && run.overview.corpusProjection.heldEnvironmentalBoundary && run.overview.corpusProjection.confirmedEnvironmentalBoundary;
  const formMappingsComplete = run => Object.values(run.overview.corpusProjection.formDistribution).reduce((sum, count) => sum + count, 0) === 25;
  const familyRepresentativesComplete = run => new Set(run.representatives.map(item => item.familyId)).size === 4 && new Set(run.representatives.map(item => item.formClass)).size >= 4;

  result.checks = {
    registryOperational: desktop.overview.registry.familyCount === 4 && desktop.overview.registry.modelCount === 25 && desktop.overview.registry.lensCount === 3,
    desktopOverviewCorpusComplete: corpusComplete(desktop),
    mobileOverviewCorpusComplete: corpusComplete(mobile),
    desktopFamilyContextComplete: desktop.overview.corpusProjection.familyTitlesPresent && desktop.overview.corpusProjection.familyQuestionsPresent,
    mobileFamilyContextComplete: mobile.overview.corpusProjection.familyTitlesPresent && mobile.overview.corpusProjection.familyQuestionsPresent,
    desktopEquationFormMappingsComplete: formMappingsComplete(desktop),
    mobileEquationFormMappingsComplete: formMappingsComplete(mobile),
    desktopSourceStateEnvironmentalExpression: sourceExpressionComplete(desktop),
    mobileSourceStateEnvironmentalExpression: sourceExpressionComplete(mobile),
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
    desktopInspectionFieldsComplete: desktop.inspection.complete,
    mobileInspectionFieldsComplete: mobile.inspection.complete,
    desktopRepresentativeFamiliesAndForms: familyRepresentativesComplete(desktop),
    mobileRepresentativeFamiliesAndForms: familyRepresentativesComplete(mobile),
    desktopExactReturn: exactReturn(desktop),
    mobileExactReturn: exactReturn(mobile),
    desktopTransitionReceipts: desktop.returned.receiptCount >= 6,
    mobileTransitionReceipts: mobile.returned.receiptCount >= 6,
    noConsoleErrors: result.consoleErrors.length === 0,
    noPageErrors: result.pageErrors.length === 0,
    noRequestFailures: result.requestFailures.length === 0
  };

  result.result = Object.values(result.checks).every(Boolean) ? "PASS_SEMANTIC_EMBODIMENT_GATE" : "FAIL_SEMANTIC_EMBODIMENT_GATE";

  await writeJson("desktop-state-captures.json", result.observations.filter(entry => entry.viewport.startsWith("desktop")));
  await writeJson("mobile-state-captures.json", result.observations.filter(entry => entry.viewport.startsWith("mobile")));
  await writeJson("desktop-exact-return-receipt.json", desktop.returnReceipt);
  await writeJson("mobile-exact-return-receipt.json", mobile.returnReceipt);
  await writeJson("cross-family-representative-evidence.json", result.representativeCaptures);
} finally {
  await browser.close();
}

await writeJson("observer-result.json", result);
console.log(JSON.stringify({
  contract: result.contract,
  result: result.result,
  checks: result.checks,
  screenshotCount: result.screenshots.length,
  consoleErrors: result.consoleErrors,
  pageErrors: result.pageErrors,
  requestFailures: result.requestFailures
}, null, 2));
if (result.result !== "PASS_SEMANTIC_EMBODIMENT_GATE") process.exitCode = 1;
