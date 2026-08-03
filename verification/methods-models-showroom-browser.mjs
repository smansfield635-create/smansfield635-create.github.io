import fs from "node:fs";
import puppeteer from "puppeteer-core";

const ORIGIN = process.env.METHODS_MODELS_ORIGIN || "http://127.0.0.1:4173";
const CHROME_PATH = process.env.CHROME_PATH;
const EXECUTION_COMMIT = process.env.EXECUTION_COMMIT || "UNKNOWN";
const route = `${ORIGIN}/laws/research/methods-and-models/`;

if (!CHROME_PATH) throw new Error("CHROME_PATH_REQUIRED");

const sourceFiles = {
  html: fs.readFileSync("laws/research/methods-and-models/index.html", "utf8"),
  baseJs: fs.readFileSync("laws/research/methods-and-models/showroom.js", "utf8"),
  refinementJs: fs.readFileSync("laws/research/methods-and-models/showroom-refinement.js", "utf8"),
  euclideanCss: fs.readFileSync("laws/research/methods-and-models/showroom-euclidean.css", "utf8"),
  euclideanJs: fs.readFileSync("laws/research/methods-and-models/showroom-euclidean.js", "utf8"),
  manifest: fs.readFileSync("laws/research/methods-and-models/canonical-records-v1.html", "utf8")
};

const sourceAssertions = {
  contract: sourceFiles.html.includes('data-methods-models-contract="METHODS_MODELS_EUCLIDEAN_SHOWROOM_v3"'),
  euclideanAssetsLoaded: sourceFiles.html.includes("showroom-euclidean.css?v=METHODS_MODELS_EUCLIDEAN_SHOWROOM_V3") && sourceFiles.html.includes("showroom-euclidean.js?v=METHODS_MODELS_EUCLIDEAN_SHOWROOM_V3"),
  xyzCoordinatesDeclared: ["data-mm-coordinate-x", "data-mm-coordinate-y", "data-mm-coordinate-z"].every(token => sourceFiles.html.includes(token)),
  zControlsDeclared: sourceFiles.html.includes("data-mm-family-previous") && sourceFiles.html.includes("data-mm-family-next"),
  stateContract: ["familyIndex", "modelIndex", "lensIndex", "METHODS_MODELS_EUCLIDEAN_STATE_CHANGED"].every(token => sourceFiles.euclideanJs.includes(token)),
  xAxisMechanism: sourceFiles.euclideanJs.includes("mmXPosition") && sourceFiles.euclideanCss.includes('data-mm-x-position="active"'),
  yAxisMechanism: sourceFiles.euclideanJs.includes("mmYPosition") && sourceFiles.euclideanCss.includes('data-mm-y-position="active"'),
  zAxisMechanism: sourceFiles.euclideanJs.includes("mmZPosition") && sourceFiles.euclideanCss.includes('data-mm-z-position="active"'),
  compassMechanismOnly: !/webgl|three\.js|canvas|getContext\(|globe/i.test(sourceFiles.euclideanJs + sourceFiles.euclideanCss),
  css3dMechanism: sourceFiles.euclideanCss.includes("perspective:") && sourceFiles.euclideanCss.includes("transform-style: preserve-3d") && sourceFiles.euclideanCss.includes("translate3d"),
  sourceHoldPreserved: sourceFiles.baseJs.includes("ARCHITECTURE PRESERVED · ORIGINAL CONTROLLING SOURCE UNDER RECOVERY"),
  fullEnvelopePreserved: sourceFiles.baseJs.includes("451 = 256 + 192 + 3"),
  semanticEquationsPreserved: sourceFiles.refinementJs.includes('"mass-ledger"') && sourceFiles.refinementJs.includes('layout: "ledger"') && sourceFiles.refinementJs.includes('"collapse-qualified"'),
  archiveBound: sourceFiles.html.includes('data-canonical-archive="METHODS_MODELS_CANONICAL_ARCHIVE_v1_DRAFT"'),
  completenessOpen: sourceFiles.html.includes('data-source-completeness="open"'),
  validationFalse: sourceFiles.html.includes('data-scientific-validation-claimed="false"') && sourceFiles.html.includes('data-universal-law-proven="false"'),
  productAcceptanceFalse: sourceFiles.html.includes('data-product-acceptance="not-granted"'),
  canonicalManifestPreserved: ["CP6-CONTENT-058", "CP6-CONTENT-078", "bb032b86a2665a0d53df310d03c787dc8a193da1599761b960166d17f847fe2b"].every(token => sourceFiles.manifest.includes(token)),
  reducedMotion: sourceFiles.euclideanCss.includes("prefers-reduced-motion: reduce")
};

const sourceFailures = Object.entries(sourceAssertions).filter(([, pass]) => !pass).map(([id]) => id);
if (sourceFailures.length) throw new Error(`METHODS_MODELS_EUCLIDEAN_SOURCE_FAILED:${sourceFailures.join("|")}`);

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"]
});

const profiles = [];

async function waitForEuclidean(page) {
  await page.waitForSelector('html[data-methods-models-euclidean-showroom="active"]', { timeout: 15000 });
  await page.waitForSelector('[data-mm-showroom][data-mm-euclidean-ready="true"]', { timeout: 15000 });
}

async function waitForState(page, expected) {
  await page.waitForFunction(value => {
    const root = document.querySelector("[data-mm-showroom]");
    if (!root) return false;
    return Object.entries(value).every(([key, target]) => root.dataset[key] === String(target));
  }, {}, expected);
}

async function snapshot(page) {
  return page.evaluate(() => {
    const root = document.querySelector("[data-mm-showroom]");
    const activeCard = root.querySelector('.mm-model-card[data-mm-x-position="active"]');
    const previousCard = root.querySelector('.mm-model-card[data-mm-x-position="previous"]');
    const nextCard = root.querySelector('.mm-model-card[data-mm-x-position="next"]');
    const activeFamily = root.querySelector('.mm-family-tab[data-mm-z-position="active"]');
    const activeLens = root.querySelector('.mm-lens-tab[data-mm-y-position="active"]');
    const showroomStyle = getComputedStyle(root);
    const cardRect = activeCard.getBoundingClientRect();
    return {
      contract: document.documentElement.dataset.methodsModelsDisplayContract,
      display: document.body.dataset.mmDisplay,
      ready: root.dataset.mmEuclideanReady,
      x: root.dataset.mmX,
      y: root.dataset.mmY,
      z: root.dataset.mmZ,
      familyId: root.dataset.mmFamily,
      modelId: root.dataset.mmModel,
      familyTabs: root.querySelectorAll(".mm-family-tab").length,
      activeFamilies: root.querySelectorAll('.mm-family-tab[data-mm-z-position="active"]').length,
      modelCards: root.querySelectorAll(".mm-model-card").length,
      activeModels: root.querySelectorAll('.mm-model-card[data-mm-x-position="active"]').length,
      lensTabs: root.querySelectorAll(".mm-lens-tab").length,
      activeLenses: root.querySelectorAll('.mm-lens-tab[data-mm-y-position="active"]').length,
      activeFamilyText: activeFamily?.textContent.trim(),
      activeLensText: activeLens?.textContent.trim(),
      coordinate: root.querySelector("[data-mm-coordinate]")?.textContent.replace(/\s+/g, " ").trim(),
      stagePerspective: getComputedStyle(root.querySelector(".mm-stage")).perspective,
      activeTransform: getComputedStyle(activeCard).transform,
      previousTransform: previousCard ? getComputedStyle(previousCard).transform : "",
      nextTransform: nextCard ? getComputedStyle(nextCard).transform : "",
      familyTransform: getComputedStyle(activeFamily).transform,
      lensTransform: getComputedStyle(activeLens).transform,
      horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
      cardRect: { left: cardRect.left, right: cardRect.right, top: cardRect.top, bottom: cardRect.bottom, width: cardRect.width, height: cardRect.height },
      viewport: { width: innerWidth, height: innerHeight },
      fixedShowroom: showroomStyle.position,
      backgroundColor: showroomStyle.backgroundColor,
      supportInert: document.querySelector(".mm-support")?.inert,
      bodyPosition: getComputedStyle(document.body).position,
      canvasCount: document.querySelectorAll("canvas").length
    };
  });
}

async function verifyProfile(profile, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.goto(route, { waitUntil: "networkidle0", timeout: 45000 });
  await waitForEuclidean(page);

  const failures = [];
  const initial = await snapshot(page);
  if (initial.contract !== "METHODS_MODELS_EUCLIDEAN_SHOWROOM_v3") failures.push("display_contract");
  if (initial.display !== "expanded" || initial.ready !== "true") failures.push("initial_state");
  if (initial.familyTabs !== 4 || initial.activeFamilies !== 1) failures.push("z_family_state");
  if (initial.modelCards < 6 || initial.activeModels !== 1) failures.push("x_model_state");
  if (initial.lensTabs !== 3 || initial.activeLenses !== 1) failures.push("y_lens_state");
  if (initial.x !== "0" || initial.y !== "0" || initial.z !== "0") failures.push("initial_coordinates");
  if (!initial.coordinate.includes("X 01/06") || !initial.coordinate.includes("Y PRACTICAL") || !initial.coordinate.includes("Z STRUCTURAL")) failures.push("coordinate_hud");
  if (initial.stagePerspective === "none") failures.push("stage_perspective");
  if (!initial.activeTransform || initial.activeTransform === "none" || !initial.familyTransform || initial.familyTransform === "none" || !initial.lensTransform || initial.lensTransform === "none") failures.push("euclidean_transforms");
  if (!initial.previousTransform || initial.previousTransform === "none" || !initial.nextTransform || initial.nextTransform === "none") failures.push("neighbor_depth_context");
  if (initial.fixedShowroom !== "fixed" || initial.backgroundColor === "rgba(0, 0, 0, 0)") failures.push("showroom_containment");
  if (!initial.supportInert || initial.bodyPosition !== "fixed") failures.push("background_lock");
  if (initial.horizontalOverflow > 2) failures.push("horizontal_overflow");
  if (initial.canvasCount !== 0) failures.push("compass_or_globe_surface_present");
  if (initial.cardRect.left < -1 || initial.cardRect.right > initial.viewport.width + 1) failures.push("active_card_horizontal_containment");

  await page.click("[data-mm-next]");
  await waitForState(page, { mmX: "1" });
  const xState = await snapshot(page);
  if (xState.modelId !== "gate-448" || !xState.coordinate.includes("X 02/06")) failures.push("x_rotation");

  await page.focus("[data-mm-model-deck]");
  await page.keyboard.press("ArrowDown");
  await waitForState(page, { mmY: "1" });
  const yState = await snapshot(page);
  if (yState.activeLensText !== "Engineering" || !yState.coordinate.includes("Y ENGINEERING")) failures.push("y_rotation");

  await page.click("[data-mm-family-next]");
  await waitForState(page, { mmZ: "1", mmX: "0" });
  const zState = await snapshot(page);
  if (zState.familyId !== "pressure" || zState.modelId !== "pressure-field" || !zState.coordinate.includes("Z PRESSURE / CAPACITY") || !zState.coordinate.includes("X 01/07")) failures.push("z_rotation");

  const inspectHit = await page.evaluate(() => {
    const control = document.querySelector('.mm-model-card[data-mm-x-position="active"] [data-mm-inspect]');
    const rect = control?.getBoundingClientRect();
    const hit = rect ? document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2) : null;
    const card = control?.closest(".mm-model-card");
    return {
      controlExists: Boolean(control),
      disabled: Boolean(control?.disabled),
      cardInert: Boolean(card?.inert),
      cardAriaHidden: card?.getAttribute("aria-hidden"),
      rect: rect ? { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height } : null,
      hitTag: hit?.tagName || "",
      hitClass: hit?.className || "",
      hitIsControl: hit === control || Boolean(hit?.closest?.("[data-mm-inspect]") === control)
    };
  });
  console.log("METHODS_MODELS_INSPECT_HIT", JSON.stringify({ profile, inspectHit }));
  await page.click('.mm-model-card[data-mm-x-position="active"] [data-mm-inspect]');
  try {
    await page.waitForSelector("dialog[open]", { timeout: 3500 });
  } catch {
    throw new Error(`METHODS_MODELS_INSPECT_POINTER_FAILED:${profile}:${JSON.stringify(inspectHit)}`);
  }
  const inspection = await page.evaluate(() => ({
    title: document.querySelector("[data-mm-dialog-title]")?.textContent,
    sections: document.querySelectorAll(".mm-dialog__section").length,
    canvasCount: document.querySelectorAll("dialog canvas").length,
    htmlState: document.documentElement.dataset.methodsModelsInspection
  }));
  if (inspection.title !== "Pressure Field" || inspection.sections !== 7 || inspection.canvasCount !== 0 || inspection.htmlState !== "open") failures.push("inspection_continuity");
  await page.click("[data-mm-dialog-close]");
  await page.waitForFunction(() => !document.querySelector("dialog")?.open);

  await page.click("[data-mm-collapse-showroom]");
  await page.waitForFunction(() => document.body.dataset.mmDisplay === "collapsed");
  const collapsed = await page.evaluate(() => {
    const dock = document.querySelector("[data-mm-dock]");
    const rect = dock.getBoundingClientRect();
    return {
      hidden: dock.hidden,
      coordinate: document.querySelector("[data-mm-dock-coordinate]")?.textContent,
      model: dock.dataset.mmModel,
      handleDisplay: getComputedStyle(document.querySelector("[data-mm-dock-handle]")).display,
      supportInert: document.querySelector(".mm-support")?.inert,
      bodyPosition: getComputedStyle(document.body).position,
      rect: { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom }
    };
  });
  if (collapsed.hidden || collapsed.model !== "pressure-field" || !collapsed.coordinate.includes("Y ENGINEERING") || !collapsed.coordinate.includes("Z PRESSURE / CAPACITY")) failures.push("dock_coordinate_continuity");
  if (collapsed.supportInert || collapsed.bodyPosition === "fixed") failures.push("collapsed_page_release");
  if (collapsed.rect.left < -1 || collapsed.rect.right > viewport.width + 1 || collapsed.rect.bottom > viewport.height + 1) failures.push("dock_containment");
  if (profile === "MOBILE" && collapsed.handleDisplay !== "none") failures.push("mobile_drag_handle");
  if (profile !== "MOBILE" && collapsed.handleDisplay === "none") failures.push("desktop_tablet_drag_handle");

  if (profile === "DESKTOP") {
    const handle = await page.$("[data-mm-dock-handle]");
    const box = await handle.boundingBox();
    const before = await page.$eval("[data-mm-dock]", node => {
      const rect = node.getBoundingClientRect();
      return { left: rect.left, top: rect.top };
    });
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(Math.max(30, box.x - 110), Math.max(90, box.y - 80), { steps: 8 });
    await page.mouse.up();
    const after = await page.$eval("[data-mm-dock]", node => {
      const rect = node.getBoundingClientRect();
      return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
    });
    if (Math.abs(after.left - before.left) < 18 && Math.abs(after.top - before.top) < 18) failures.push("dock_drag");
    if (after.left < 7 || after.top < 7 || after.right > viewport.width + 1 || after.bottom > viewport.height + 1) failures.push("dock_drag_bounds");
  }

  await page.click("[data-mm-open-showroom]");
  await page.waitForFunction(() => document.body.dataset.mmDisplay === "expanded");
  await waitForState(page, { mmY: "1", mmZ: "1", mmX: "0" });
  const reopened = await snapshot(page);
  if (reopened.familyId !== "pressure" || reopened.modelId !== "pressure-field" || reopened.activeLensText !== "Engineering") failures.push("reopen_xyz_continuity");

  profiles.push({ profile, viewport, initial, xState, yState, zState, inspection, collapsed, reopened, failures });
  await page.close();
}

try {
  await verifyProfile("DESKTOP", { width: 1440, height: 1000, deviceScaleFactor: 1 });
  await verifyProfile("TABLET_PORTRAIT", { width: 800, height: 1280, deviceScaleFactor: 1.5, isMobile: true, hasTouch: true });
  await verifyProfile("MOBILE", { width: 430, height: 932, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
} finally {
  await browser.close();
}

const failures = profiles.flatMap(profile => profile.failures.map(id => `${profile.profile}:${id}`));
const receipt = {
  contract: "METHODS_MODELS_EUCLIDEAN_SHOWROOM_EXACT_HEAD_BROWSER_v3",
  execution: { commit: EXECUTION_COMMIT, origin: ORIGIN },
  sourceAssertions,
  profiles,
  status: failures.length ? "FAIL" : "PASS_EXACT_HEAD_CANDIDATE",
  failures
};
fs.writeFileSync("methods-models-showroom-exact-head.json", JSON.stringify(receipt, null, 2));
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) throw new Error(`METHODS_MODELS_EUCLIDEAN_BROWSER_FAILED:${failures.join("|")}`);
