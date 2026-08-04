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

const result = {
  contract: "METHODS_CATEGORICAL_SPATIAL_STAGE_PERCEPTUAL_COMPOSITION_OBSERVER_v1",
  operation: "METHODS_CATEGORICAL_SPATIAL_STAGE_PERCEPTUAL_COMPOSITION_CORRECTION_v1",
  observations: [],
  screenshots: [],
  consoleErrors: [],
  pageErrors: [],
  requestFailures: [],
  checks: {},
  fatalError: null,
  publicMethodsMutationAuthorized: false,
  mergeAuthorized: false,
  userReviewAuthorized: false,
  full1575StateCertificationClaimed: false
};

async function writeJson(name, value) {
  await fs.writeFile(path.join(outDir, name), `${JSON.stringify(value, null, 2)}\n`);
}

async function settle(page) {
  await page.evaluate(() => globalThis.__METHODS_SPATIAL_APP.whenStable());
  await page.waitForFunction(() => document.documentElement.dataset.perceptualCompositionReady === "true", { timeout: 12000 });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

function overlapRatio(a, b) {
  const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  const overlap = width * height;
  const smaller = Math.max(1, Math.min(a.width * a.height, b.width * b.height));
  return overlap / smaller;
}

async function snapshot(page) {
  await settle(page);
  return page.evaluate(() => {
    const rect = element => {
      const value = element.getBoundingClientRect();
      return { left: value.left, top: value.top, right: value.right, bottom: value.bottom, width: value.width, height: value.height };
    };
    const intersectionRatio = (child, parent) => {
      const width = Math.max(0, Math.min(child.right, parent.right) - Math.max(child.left, parent.left));
      const height = Math.max(0, Math.min(child.bottom, parent.bottom) - Math.max(child.top, parent.top));
      return width * height / Math.max(1, child.width * child.height);
    };
    const stage = document.querySelector("[data-spatial-stage]");
    const hero = document.querySelector("[data-laws-hero]");
    const topbar = document.querySelector("[data-laws-child-topbar]");
    const stageRect = rect(stage);
    const viewportRect = { left: 0, top: 0, right: innerWidth, bottom: innerHeight, width: innerWidth, height: innerHeight };
    const activeNode = document.querySelector(".spatial-model-node[data-active='true']");
    const activeRect = rect(activeNode);
    const planeRects = Array.from(document.querySelectorAll(".spatial-family-plane")).map(plane => ({ familyId: plane.dataset.familyId, ...rect(plane), transform: plane.style.transform, role: plane.dataset.compositionRole }));
    const nodes = Array.from(document.querySelectorAll(".spatial-model-node:not([hidden])"));
    const visibleNodeRects = nodes.map(node => ({ modelId: node.dataset.modelId, familyId: node.dataset.familyId, active: node.dataset.active === "true", formClass: node.dataset.formClass, role: node.dataset.compositionRole, ...rect(node) }));
    const formSignatures = Object.fromEntries(Array.from(document.querySelectorAll(".spatial-model-node")).map(node => {
      const style = getComputedStyle(node, "::before");
      return [node.dataset.formClass, [style.clipPath, style.borderRadius, style.borderLeftWidth, style.borderRightStyle].join("|")];
    }));
    const inspection = document.querySelector("[data-spatial-inspection]");
    const inspectionOpen = globalThis.__METHODS_SPATIAL_APP.inspectionOpen;
    const inspectionPanel = document.querySelector(".spatial-inspection__panel");
    const workbench = document.querySelector(".inspection-workbench");
    const visibleWorkbenchPanels = Array.from(document.querySelectorAll("[data-workbench-panel]")).filter(panel => getComputedStyle(panel).display !== "none");
    return {
      viewport: { width: innerWidth, height: innerHeight },
      cameraMode: globalThis.__METHODS_SPATIAL_APP.cameraMode,
      native: globalThis.__METHODS_SPATIAL_APP.resolvedScene.native,
      shell: {
        topbar: rect(topbar),
        hero: rect(hero),
        stage: stageRect,
        stageViewportIntersection: intersectionRatio(stageRect, viewportRect),
        stageTopRatio: stageRect.top / innerHeight,
        territoryIndexCount: document.querySelectorAll("[data-family-select]").length,
        territoryIndexVisible: rect(document.querySelector("[data-family-territory-index]")).bottom > 0,
        familySelectionStatus: stage.dataset.familySelectionStatus || null,
        corpusCenterOffsetRatio: Number(stage.dataset.corpusCenterOffsetRatio || 1),
        activeModelFullyVisibleFlag: stage.dataset.activeModelFullyVisible === "true"
      },
      active: {
        ...activeRect,
        stageIntersection: intersectionRatio(activeRect, stageRect),
        viewportIntersection: intersectionRatio(activeRect, viewportRect),
        centerOffsetX: Math.abs((activeRect.left + activeRect.width / 2) - (stageRect.left + stageRect.width / 2)) / Math.max(1, stageRect.width),
        centerOffsetY: Math.abs((activeRect.top + activeRect.height / 2) - (stageRect.top + stageRect.height / 2)) / Math.max(1, stageRect.height)
      },
      planes: planeRects,
      visibleNodes: visibleNodeRects,
      objectLanguage: {
        formClassCount: Object.keys(formSignatures).length,
        uniqueSignatureCount: new Set(Object.values(formSignatures)).size,
        signatures: formSignatures
      },
      inspection: {
        open: inspectionOpen,
        panel: inspectionPanel ? rect(inspectionPanel) : null,
        workbench: workbench ? rect(workbench) : null,
        mobilePanel: inspection?.dataset.mobilePanel || null,
        mobileTabCount: document.querySelectorAll("[data-inspection-tab]").length,
        visibleWorkbenchPanelCount: visibleWorkbenchPanels.length,
        visibleWorkbenchPanels: visibleWorkbenchPanels.map(panel => panel.dataset.workbenchPanel),
        instrumentStage: rect(document.querySelector("[data-inspection-form-object]")),
        sourceReferencePresent: Boolean(document.querySelector("[data-inspection-source-reference]")?.textContent?.trim())
      }
    };
  });
}

async function capture(page, name) {
  const file = path.join(screenshotDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  result.screenshots.push(path.relative(outDir, file));
}

async function activateBoundControl(page, selector) {
  await page.evaluate(controlSelector => {
    const control = document.querySelector(controlSelector);
    if (!(control instanceof HTMLButtonElement)) throw new Error(`METHODS_BOUND_CONTROL_MISSING:${controlSelector}`);
    control.click();
  }, selector);
}

async function familyTransitionDiagnostic(page, targetIndex, phase) {
  return page.evaluate((index, receiptPhase) => {
    const current = globalThis.__METHODS_SPATIAL_APP;
    const stage = document.querySelector("[data-spatial-stage]");
    const button = document.querySelector(`[data-family-select][data-family-index="${index}"]`);
    const buttonRect = button?.getBoundingClientRect();
    const centerX = buttonRect ? buttonRect.left + buttonRect.width / 2 : null;
    const centerY = buttonRect ? buttonRect.top + buttonRect.height / 2 : null;
    const hit = centerX === null ? null : document.elementFromPoint(centerX, centerY);
    return {
      phase: receiptPhase,
      targetIndex: index,
      targetFamilyId: button?.dataset.familySelect || null,
      nativeState: current?.nativeState || null,
      resolvedNative: current?.resolvedScene?.native || null,
      familySelectionStatus: stage?.dataset.familySelectionStatus || null,
      targetButton: button ? {
        familyId: button.dataset.familySelect,
        familyIndex: button.dataset.familyIndex,
        ariaCurrent: button.getAttribute("aria-current"),
        disabled: button.disabled,
        rect: buttonRect ? { left: buttonRect.left, top: buttonRect.top, right: buttonRect.right, bottom: buttonRect.bottom, width: buttonRect.width, height: buttonRect.height } : null,
        centerHitTag: hit?.tagName || null,
        centerHitFamilyIndex: hit?.closest?.("[data-family-index]")?.dataset?.familyIndex || null
      } : null,
      territories: Array.from(document.querySelectorAll("[data-family-select]")).map(item => ({
        familyId: item.dataset.familySelect,
        familyIndex: item.dataset.familyIndex,
        ariaCurrent: item.getAttribute("aria-current")
      })),
      recentReceipts: Array.isArray(current?.receipts) ? current.receipts.slice(-8) : []
    };
  }, targetIndex, phase);
}

async function selectFamily(page, targetIndex) {
  const before = await familyTransitionDiagnostic(page, targetIndex, "before-dom-click");
  if (!before.targetFamilyId) throw new Error(`METHODS_FAMILY_TERRITORY_ID_MISSING:${targetIndex}`);
  await activateBoundControl(page, `[data-family-select][data-family-index="${targetIndex}"]`);
  const afterClick = await familyTransitionDiagnostic(page, targetIndex, "after-dom-click");
  try {
    await page.waitForFunction((index, familyId) => {
      const current = globalThis.__METHODS_SPATIAL_APP;
      const button = document.querySelector(`[data-family-select][data-family-index="${index}"]`);
      return current?.nativeState?.z?.familyId === familyId
        && current?.resolvedScene?.native?.familyId === familyId
        && button?.dataset.familySelect === familyId
        && button?.getAttribute("aria-current") === "true"
        && document.querySelector("[data-spatial-stage]")?.dataset.familySelectionStatus === "complete";
    }, { timeout: 12000 }, targetIndex, before.targetFamilyId);
  } catch (error) {
    const timeout = await familyTransitionDiagnostic(page, targetIndex, "timeout");
    const wrapped = new Error(`METHODS_FAMILY_TERRITORY_TRANSITION_FAILED:${before.targetFamilyId}`);
    wrapped.name = "MethodsFamilyTerritoryTransitionError";
    wrapped.stack = `${wrapped.stack}\nCaused by: ${error.stack || error.message}`;
    wrapped.diagnostic = { before, afterClick, timeout };
    throw wrapped;
  }
  await settle(page);
}

async function openPage(browser, label, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  page.on("console", message => {
    if (message.type() === "error") result.consoleErrors.push({ viewport: label, text: message.text() });
  });
  page.on("pageerror", error => result.pageErrors.push({ viewport: label, text: error.message }));
  page.on("requestfailed", request => result.requestFailures.push({ viewport: label, url: request.url(), reason: request.failure()?.errorText || "unknown" }));
  await page.goto(`${origin}/verification/methods-categorical-spatial-context-equation-embodiment-v1/`, { waitUntil: "networkidle0", timeout: 30000 });
  await page.waitForFunction(() => document.documentElement.dataset.methodsSpatialReady === "true" && document.documentElement.dataset.perceptualCompositionReady === "true", { timeout: 24000 });
  return page;
}

async function runDesktop(browser) {
  const page = await openPage(browser, "desktop-1440x1000", { width: 1440, height: 1000, deviceScaleFactor: 1 });
  const overview = await snapshot(page);
  result.observations.push({ viewport: "desktop", state: "overview", snapshot: overview });
  await capture(page, "desktop-overview");

  const familyStates = [];
  for (let index = 0; index < 4; index += 1) {
    await selectFamily(page, index);
    const state = await snapshot(page);
    familyStates.push(state);
    result.observations.push({ viewport: "desktop", state: `family-${index + 1}`, snapshot: state });
    await capture(page, `desktop-family-${String(index + 1).padStart(2, "0")}-${state.native.familyId}`);
  }

  await page.evaluate(() => globalThis.__METHODS_SPATIAL_APP.setCameraMode("browse"));
  const browse = await snapshot(page);
  result.observations.push({ viewport: "desktop", state: "browse", snapshot: browse });
  await capture(page, "desktop-browse");

  await page.evaluate(() => globalThis.__METHODS_SPATIAL_APP.inspect());
  await page.waitForFunction(() => globalThis.__METHODS_SPATIAL_APP.inspectionOpen === true, { timeout: 12000 });
  const inspection = await snapshot(page);
  result.observations.push({ viewport: "desktop", state: "inspection", snapshot: inspection });
  await capture(page, "desktop-inspection");

  await activateBoundControl(page, "[data-local-return]");
  await page.waitForFunction(() => globalThis.__METHODS_SPATIAL_APP.inspectionOpen === false && Boolean(globalThis.__METHODS_SPATIAL_RETURN_RECEIPT), { timeout: 12000 });
  const returned = await snapshot(page);
  const returnReceipt = await page.evaluate(() => globalThis.__METHODS_SPATIAL_RETURN_RECEIPT);
  result.observations.push({ viewport: "desktop", state: "exact-return", snapshot: returned, returnReceipt });
  await page.close();
  return { overview, familyStates, browse, inspection, returned, returnReceipt };
}

async function runPhone(browser) {
  const page = await openPage(browser, "phone-390x844", { width: 390, height: 844, deviceScaleFactor: 1 });
  const overview = await snapshot(page);
  result.observations.push({ viewport: "phone", state: "overview", snapshot: overview });
  await capture(page, "phone-overview");

  await page.evaluate(() => globalThis.__METHODS_SPATIAL_APP.setCameraMode("browse"));
  const browse = await snapshot(page);
  result.observations.push({ viewport: "phone", state: "browse", snapshot: browse });
  await capture(page, "phone-browse");

  await activateBoundControl(page, '[data-lens-select="evidence"]');
  await page.waitForFunction(() => globalThis.__METHODS_SPATIAL_APP.resolvedScene.native.lensId === "evidence", { timeout: 12000 });
  const evidence = await snapshot(page);
  result.observations.push({ viewport: "phone", state: "evidence", snapshot: evidence });
  await capture(page, "phone-evidence");

  await page.evaluate(() => globalThis.__METHODS_SPATIAL_APP.inspect());
  await page.waitForFunction(() => globalThis.__METHODS_SPATIAL_APP.inspectionOpen === true, { timeout: 12000 });
  const inspection = await snapshot(page);
  result.observations.push({ viewport: "phone", state: "inspection", snapshot: inspection });
  await capture(page, "phone-inspection");

  await activateBoundControl(page, '[data-inspection-tab="evidence"]');
  const evidencePanel = await snapshot(page);
  result.observations.push({ viewport: "phone", state: "inspection-evidence-panel", snapshot: evidencePanel });

  await activateBoundControl(page, "[data-local-return]");
  await page.waitForFunction(() => globalThis.__METHODS_SPATIAL_APP.inspectionOpen === false && Boolean(globalThis.__METHODS_SPATIAL_RETURN_RECEIPT), { timeout: 12000 });
  const returned = await snapshot(page);
  const returnReceipt = await page.evaluate(() => globalThis.__METHODS_SPATIAL_RETURN_RECEIPT);
  result.observations.push({ viewport: "phone", state: "exact-return", snapshot: returned, returnReceipt });
  await page.close();
  return { overview, browse, evidence, inspection, evidencePanel, returned, returnReceipt };
}

function exactReturn(receipt) {
  return exactReturnFields.every(field => receipt?.[field] === true);
}

function maxPlaneOverlap(planes) {
  let maximum = 0;
  for (let left = 0; left < planes.length; left += 1) {
    for (let right = left + 1; right < planes.length; right += 1) {
      maximum = Math.max(maximum, overlapRatio(planes[left], planes[right]));
    }
  }
  return maximum;
}

const browser = await puppeteer.launch({ executablePath: chromePath, headless: "new", args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"] });
try {
  const desktop = await runDesktop(browser);
  const phone = await runPhone(browser);

  result.checks = {
    desktopStageInFirstView: desktop.overview.shell.stageTopRatio <= .20 && desktop.overview.shell.stageViewportIntersection >= .72,
    phoneStageInFirstView: phone.overview.shell.stageTopRatio <= .22 && phone.overview.shell.stageViewportIntersection >= .72,
    desktopCorpusCentered: desktop.overview.shell.corpusCenterOffsetRatio <= .08,
    phoneCorpusCentered: phone.overview.shell.corpusCenterOffsetRatio <= .14,
    desktopFourFamilyTerritoriesDistinct: desktop.overview.planes.length === 4 && new Set(desktop.overview.planes.map(plane => plane.transform)).size === 4 && maxPlaneOverlap(desktop.overview.planes) <= .35,
    desktopFourFamilyStatesCaptured: desktop.familyStates.length === 4 && new Set(desktop.familyStates.map(state => state.native.familyId)).size === 4 && desktop.familyStates.every(state => state.shell.familySelectionStatus === "complete"),
    phoneFamilyHorizonVisible: phone.overview.shell.territoryIndexCount === 4 && phone.overview.shell.territoryIndexVisible,
    desktopBrowseActiveFullyVisible: desktop.browse.active.stageIntersection >= .98 && desktop.browse.active.viewportIntersection >= .98 && desktop.browse.shell.activeModelFullyVisibleFlag,
    phoneBrowseActiveFullyVisible: phone.browse.active.stageIntersection >= .97 && phone.browse.active.viewportIntersection >= .97 && phone.browse.active.width >= phone.browse.viewport.width * .68 && phone.browse.shell.activeModelFullyVisibleFlag,
    phoneEvidenceKeepsActiveVisible: phone.evidence.active.stageIntersection >= .97 && phone.evidence.active.viewportIntersection >= .97 && phone.evidence.native.lensId === "evidence",
    equationObjectLanguageMateriallyDistinct: desktop.overview.objectLanguage.formClassCount >= 11 && desktop.overview.objectLanguage.uniqueSignatureCount === desktop.overview.objectLanguage.formClassCount,
    desktopInspectionForegroundWorkbench: desktop.inspection.inspection.open && desktop.inspection.inspection.instrumentStage.height >= 200 && desktop.inspection.inspection.visibleWorkbenchPanelCount === 4 && desktop.inspection.inspection.sourceReferencePresent,
    phoneInspectionFullViewWorkbench: phone.inspection.inspection.open && phone.inspection.inspection.panel.height >= phone.inspection.viewport.height * .98 && phone.inspection.inspection.mobileTabCount === 4 && phone.inspection.inspection.visibleWorkbenchPanelCount === 1,
    phoneInspectionPanelNavigation: phone.evidencePanel.inspection.mobilePanel === "evidence" && phone.evidencePanel.inspection.visibleWorkbenchPanels.includes("evidence"),
    desktopExactReturn: exactReturn(desktop.returnReceipt),
    phoneExactReturn: exactReturn(phone.returnReceipt),
    noConsoleErrors: result.consoleErrors.length === 0,
    noPageErrors: result.pageErrors.length === 0,
    noRequestFailures: result.requestFailures.length === 0
  };
  result.result = Object.values(result.checks).every(Boolean) ? "PASS_LAWS_CHILD_STAGE_OBSERVER_GATE" : "FAIL_LAWS_CHILD_STAGE_OBSERVER_GATE";
  await writeJson("desktop-exact-return-receipt.json", desktop.returnReceipt);
  await writeJson("phone-exact-return-receipt.json", phone.returnReceipt);
} catch (error) {
  result.result = "FAIL_LAWS_CHILD_STAGE_OBSERVER_GATE";
  result.fatalError = {
    name: error.name || "Error",
    message: error.message || String(error),
    stack: error.stack || null,
    diagnostic: error.diagnostic || null
  };
} finally {
  await writeJson("laws-child-stage-observer-result.json", result);
  await browser.close();
}

console.log(JSON.stringify({ contract: result.contract, result: result.result, checks: result.checks, fatalError: result.fatalError, screenshots: result.screenshots, consoleErrors: result.consoleErrors, pageErrors: result.pageErrors, requestFailures: result.requestFailures }, null, 2));
if (result.result !== "PASS_LAWS_CHILD_STAGE_OBSERVER_GATE") process.exitCode = 1;
