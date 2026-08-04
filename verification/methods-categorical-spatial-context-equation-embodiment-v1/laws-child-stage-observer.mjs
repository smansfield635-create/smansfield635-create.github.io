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
  contract: "LAWS_CHILD_SPATIAL_STAGE_SHELL_OBSERVER_v1",
  observations: [],
  screenshots: [],
  consoleErrors: [],
  pageErrors: [],
  requestFailures: [],
  checks: {},
  mergeAuthorized: false,
  publicMethodsMutationAuthorized: false,
  empiricalValidationClaimed: false,
  userReviewAuthorized: false
};

async function writeJson(name, value) {
  await fs.writeFile(path.join(outDir, name), `${JSON.stringify(value, null, 2)}\n`);
}

async function whenStable(page) {
  await page.evaluate(() => globalThis.__METHODS_SPATIAL_APP.whenStable());
  await page.waitForFunction(() => document.documentElement.dataset.lawsChildStageReady === "true", { timeout: 12000 });
}

async function snapshot(page) {
  await whenStable(page);
  return page.evaluate(() => {
    const app = globalThis.__METHODS_SPATIAL_APP;
    const stage = document.querySelector("[data-spatial-stage]");
    const stageRect = stage.getBoundingClientRect();
    const planes = Array.from(document.querySelectorAll(".spatial-family-plane"));
    const activeFamily = app.resolvedScene.native.familyId;
    const activeFamilyNodes = Array.from(document.querySelectorAll(`.spatial-model-node[data-family-id="${CSS.escape(activeFamily)}"]`));
    const yOffsets = activeFamilyNodes.map(node => Number((/translate3d\([^,]+,\s*([-\d.]+)px/.exec(node.style.transform) || [])[1])).filter(Number.isFinite);
    return {
      native: app.resolvedScene.native,
      cameraMode: app.cameraMode,
      inspectionOpen: app.inspectionOpen,
      shell: {
        lawsChildShell: Boolean(document.querySelector("[data-laws-child-shell]")),
        topbar: Boolean(document.querySelector("[data-laws-child-topbar]")),
        compactHero: Boolean(document.querySelector("[data-laws-hero]")),
        chamber: Boolean(document.querySelector("[data-methods-chamber]")),
        globalOrigin: document.querySelector("[data-global-origin]")?.textContent?.replace(/\s+/g, " ").trim() || "",
        localOrigin: document.querySelector("[data-local-origin]")?.textContent?.replace(/\s+/g, " ").trim() || "",
        localOriginState: document.querySelector("[data-local-origin-state]")?.textContent?.trim() || "",
        globalReturnHref: document.querySelector("[data-global-return]")?.getAttribute("href") || "",
        localReturnText: document.querySelector("[data-local-return]")?.textContent?.trim() || "",
        support: Boolean(document.querySelector("[data-supporting-public-context]")),
        claimBoundary: Boolean(document.querySelector("[data-claim-boundary]")),
        custodyCollapsed: Boolean(document.querySelector("details[data-canonical-custody]:not([open])")),
        stageViewportRatio: stageRect.height / Math.max(1, innerHeight),
        stageWidthRatio: stageRect.width / Math.max(1, innerWidth)
      },
      lensInstrument: {
        count: document.querySelectorAll("[data-lens-select]").length,
        active: Array.from(document.querySelectorAll("[data-lens-select][aria-pressed='true']")).map(button => button.dataset.lensSelect)
      },
      familyRegions: {
        count: planes.length,
        transforms: planes.map(plane => plane.style.transform),
        orders: planes.map(plane => plane.dataset.regionOrder),
        semantics: planes.map(plane => plane.dataset.regionSemantics)
      },
      trajectory: {
        activeFamily,
        yOffsets,
        uniqueYOffsets: new Set(yOffsets.map(value => value.toFixed(2))).size,
        projectedCount: activeFamilyNodes.filter(node => node.dataset.trajectoryProjection === "CURVED_CANONICAL_ARC").length
      },
      inspection: {
        originPath: Array.from(document.querySelectorAll(".inspection-origin span, .inspection-origin strong")).map(item => item.textContent.trim()).filter(Boolean),
        localReturnText: document.querySelector("[data-local-return]")?.textContent?.trim() || ""
      }
    };
  });
}

async function capture(page, name, fullPage = false) {
  const file = path.join(screenshotDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage });
  result.screenshots.push(path.relative(outDir, file));
}

async function runViewport(browser, label, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  page.on("console", message => {
    if (message.type() === "error") result.consoleErrors.push({ viewport: label, text: message.text() });
  });
  page.on("pageerror", error => result.pageErrors.push({ viewport: label, text: error.message }));
  page.on("requestfailed", request => result.requestFailures.push({ viewport: label, url: request.url(), reason: request.failure()?.errorText || "unknown" }));

  await page.goto(`${origin}/verification/methods-categorical-spatial-context-equation-embodiment-v1/`, { waitUntil: "networkidle0", timeout: 30000 });
  await page.waitForFunction(() => document.documentElement.dataset.methodsSpatialReady === "true" && document.documentElement.dataset.lawsChildStageReady === "true", { timeout: 24000 });

  const overview = await snapshot(page);
  result.observations.push({ viewport: label, state: "laws-child-overview", snapshot: overview });
  await capture(page, `${label}-laws-child-overview`);

  await page.evaluate(() => globalThis.__METHODS_SPATIAL_APP.setCameraMode("browse"));
  const browse = await snapshot(page);
  result.observations.push({ viewport: label, state: "laws-child-browse", snapshot: browse });

  await page.click('[data-lens-select="evidence"]');
  await page.waitForFunction(() => globalThis.__METHODS_SPATIAL_APP.resolvedScene.native.lensId === "evidence", { timeout: 12000 });
  const evidence = await snapshot(page);
  result.observations.push({ viewport: label, state: "laws-child-evidence-lens", snapshot: evidence });
  await capture(page, `${label}-laws-child-evidence-lens`);

  await page.evaluate(() => globalThis.__METHODS_SPATIAL_APP.inspect());
  await page.waitForFunction(() => globalThis.__METHODS_SPATIAL_APP.inspectionOpen === true, { timeout: 12000 });
  const inspection = await snapshot(page);
  result.observations.push({ viewport: label, state: "laws-child-inspection", snapshot: inspection });
  await capture(page, `${label}-laws-child-inspection`, true);

  await page.click("[data-local-return]");
  await page.waitForFunction(() => globalThis.__METHODS_SPATIAL_APP.inspectionOpen === false && Boolean(globalThis.__METHODS_SPATIAL_RETURN_RECEIPT), { timeout: 12000 });
  const returned = await snapshot(page);
  const returnReceipt = await page.evaluate(() => globalThis.__METHODS_SPATIAL_RETURN_RECEIPT);
  result.observations.push({ viewport: label, state: "laws-child-exact-return", snapshot: returned, returnReceipt });

  await page.close();
  return { overview, browse, evidence, inspection, returned, returnReceipt };
}

const browser = await puppeteer.launch({ executablePath: chromePath, headless: "new", args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"] });
try {
  const desktop = await runViewport(browser, "desktop-1440x1000", { width: 1440, height: 1000, deviceScaleFactor: 1 });
  const mobile = await runViewport(browser, "mobile-390x844", { width: 390, height: 844, deviceScaleFactor: 1 });

  const shellComplete = run => {
    const shell = run.overview.shell;
    return shell.lawsChildShell && shell.topbar && shell.compactHero && shell.chamber && /Laws/i.test(shell.globalOrigin) && /Research/i.test(shell.globalOrigin) && /Methods and Models/i.test(shell.globalOrigin) && /Methods equation core/i.test(shell.localOrigin) && shell.globalReturnHref === "/laws/" && shell.localReturnText === "Return to corpus" && shell.support && shell.claimBoundary && shell.custodyCollapsed;
  };
  const stageContinuous = run => run.overview.shell.stageViewportRatio >= .70 && run.overview.shell.stageWidthRatio >= .90;
  const ringComplete = run => run.overview.familyRegions.count === 4 && new Set(run.overview.familyRegions.transforms).size === 4 && new Set(run.overview.familyRegions.orders).size === 4 && run.overview.familyRegions.semantics.every(value => value === "CANONICAL_ORDER_WITHOUT_DIRECTIONAL_AUTHORITY");
  const trajectoryComplete = run => run.overview.trajectory.uniqueYOffsets >= 3 && run.overview.trajectory.projectedCount >= 5;
  const lensComplete = run => run.overview.lensInstrument.count === 3 && run.overview.lensInstrument.active.length === 1 && run.evidence.lensInstrument.active[0] === "evidence" && run.evidence.native.lensId === "evidence";
  const inspectionOriginComplete = run => run.inspection.inspection.originPath.length >= 5 && run.inspection.inspection.originPath[0] === "Research" && run.inspection.inspection.originPath[1] === "Methods and Models" && run.inspection.inspection.localReturnText === "Return to corpus";
  const exactReturn = run => exactReturnFields.every(field => run.returnReceipt?.[field] === true);

  result.checks = {
    desktopLawsChildShellComplete: shellComplete(desktop),
    mobileLawsChildShellComplete: shellComplete(mobile),
    desktopStageContinuity: stageContinuous(desktop),
    mobileStageContinuity: stageContinuous(mobile),
    desktopFourFamilyCanonicalOrderRing: ringComplete(desktop),
    mobileFourFamilyCanonicalOrderRing: ringComplete(mobile),
    desktopCurvedModelTrajectory: trajectoryComplete(desktop),
    mobileCurvedModelTrajectory: trajectoryComplete(mobile),
    desktopLensInstrument: lensComplete(desktop),
    mobileLensInstrument: lensComplete(mobile),
    desktopInspectionOriginAndReturn: inspectionOriginComplete(desktop),
    mobileInspectionOriginAndReturn: inspectionOriginComplete(mobile),
    desktopExactMethodsReturn: exactReturn(desktop),
    mobileExactMethodsReturn: exactReturn(mobile),
    noConsoleErrors: result.consoleErrors.length === 0,
    noPageErrors: result.pageErrors.length === 0,
    noRequestFailures: result.requestFailures.length === 0
  };
  result.result = Object.values(result.checks).every(Boolean) ? "PASS_LAWS_CHILD_STAGE_OBSERVER_GATE" : "FAIL_LAWS_CHILD_STAGE_OBSERVER_GATE";
} finally {
  await browser.close();
}

await writeJson("laws-child-stage-observer-result.json", result);
console.log(JSON.stringify({ contract: result.contract, result: result.result, checks: result.checks, screenshotCount: result.screenshots.length, consoleErrors: result.consoleErrors, pageErrors: result.pageErrors, requestFailures: result.requestFailures }, null, 2));
if (result.result !== "PASS_LAWS_CHILD_STAGE_OBSERVER_GATE") process.exitCode = 1;
