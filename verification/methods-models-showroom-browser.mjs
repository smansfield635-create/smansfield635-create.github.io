import fs from "node:fs";
import puppeteer from "puppeteer-core";

const ORIGIN = process.env.METHODS_MODELS_ORIGIN || "http://127.0.0.1:4173";
const CHROME_PATH = process.env.CHROME_PATH;
const EXECUTION_COMMIT = process.env.EXECUTION_COMMIT || "UNKNOWN";
const route = `${ORIGIN}/laws/research/methods-and-models/`;
const receiptPath = "methods-models-showroom-exact-head.json";

if (!CHROME_PATH) throw new Error("CHROME_PATH_REQUIRED");

const source = {
  html: fs.readFileSync("laws/research/methods-and-models/index.html", "utf8"),
  css: fs.readFileSync("laws/research/methods-and-models/carousel.css", "utf8"),
  js: fs.readFileSync("laws/research/methods-and-models/carousel.js", "utf8"),
  data: fs.readFileSync("laws/research/methods-and-models/carousel-data.js", "utf8"),
  manifest: fs.readFileSync("laws/research/methods-and-models/canonical-records-v1.html", "utf8")
};

const sourceAssertions = {
  contract: source.html.includes('data-methods-models-contract="METHODS_MODELS_SINGLE_AXIS_EUCLIDEAN_CAROUSEL_v1"'),
  carouselAssetsLoaded: source.html.includes("carousel.css?v=METHODS_MODELS_SINGLE_AXIS_CAROUSEL_V1") && source.html.includes("carousel.js?v=METHODS_MODELS_SINGLE_AXIS_CAROUSEL_V1") && source.html.includes("carousel-data.js?v=METHODS_MODELS_SINGLE_AXIS_CAROUSEL_DATA_V2_20260822"),
  oneAxisGeometry: source.js.includes("rotateY(") && source.js.includes("translateZ(") && source.css.includes("perspective:") && source.css.includes("transform-style: preserve-3d"),
  directManipulation: ["pointerdown", "pointermove", "pointerup", "pointercancel", "setPointerCapture"].every(token => source.js.includes(token)),
  variableCardinality: source.js.includes("const count = families.length") && source.js.includes("const step = 360 / count"),
  sameObjectInspection: source.js.includes('card.dataset.inspecting = "true"') && source.js.includes('card.dataset.inspecting = "false"') && source.html.includes("No family is replaced by a detached reader"),
  noDetachedDialog: !source.html.includes("<dialog") && !source.js.includes("showModal("),
  noLegacyMultiAxisAssets: !source.html.includes("showroom-euclidean.js") && !source.html.includes("showroom-euclidean.css") && !source.html.includes("data-mm-family-next") && !source.html.includes("data-mm-family-previous"),
  contentStanding: source.html.includes('data-source-completeness="open"') && source.html.includes('data-scientific-validation-claimed="false"') && source.html.includes('data-universal-law-proven="false"') && source.html.includes('data-product-acceptance="not-granted"'),
  canonicalManifestPreserved: ["CP6-CONTENT-058", "CP6-CONTENT-078", "bb032b86a2665a0d53df310d03c787dc8a193da1599761b960166d17f847fe2b"].every(token => source.manifest.includes(token)),
  reducedMotion: source.css.includes("prefers-reduced-motion: reduce")
};

const sourceFailures = Object.entries(sourceAssertions).filter(([, pass]) => !pass).map(([id]) => id);
if (sourceFailures.length) {
  fs.writeFileSync(receiptPath, JSON.stringify({ schema: "METHODS_MODELS_SINGLE_AXIS_CAROUSEL_EXACT_HEAD_RECEIPT_v1", executionCommit: EXECUTION_COMMIT, result: "FAIL_CLOSED", phase: "SOURCE", failures: sourceFailures }, null, 2) + "\n");
  throw new Error(`METHODS_MODELS_SINGLE_AXIS_SOURCE_FAILED:${sourceFailures.join("|")}`);
}

const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const profiles = [];

async function readState(page) {
  return page.evaluate(() => {
    const root = document.querySelector("[data-mm-carousel]");
    const viewport = document.querySelector("[data-mm-viewport]");
    const ring = document.querySelector("[data-mm-ring]");
    const active = document.querySelector('.mm-card[data-active="true"]');
    const close = active?.querySelector("[data-close-inspection]");
    return {
      contract: document.documentElement.dataset.methodsModelsContract,
      family: root?.dataset.family,
      inspecting: root?.dataset.inspecting,
      tabs: document.querySelectorAll(".mm-family-tab").length,
      cards: document.querySelectorAll(".mm-card").length,
      activeCards: document.querySelectorAll('.mm-card[data-active="true"]').length,
      activeFamilyId: active?.dataset.familyId,
      activeFamilyIndex: active?.dataset.familyIndex,
      activeCardInspecting: active?.dataset.inspecting,
      activeTransform: active ? getComputedStyle(active).transform : "",
      ringTransform: ring ? getComputedStyle(ring).transform : "",
      perspective: viewport ? getComputedStyle(viewport).perspective : "none",
      dialogs: document.querySelectorAll("dialog").length,
      closeLabel: close?.getAttribute("aria-label") || close?.textContent?.trim() || "",
      horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
      viewportWidth: innerWidth
    };
  });
}

async function verifyProfile(name, viewport, reducedMotion = false) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  if (reducedMotion) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(route, { waitUntil: "networkidle0", timeout: 45000 });
  await page.waitForSelector('[data-mm-carousel] .mm-card[data-active="true"]', { timeout: 15000 });

  const failures = [];
  const initial = await readState(page);
  if (initial.tabs < 1 || initial.cards !== initial.tabs || initial.activeCards !== 1) failures.push("initial_variable_cardinality");
  if (initial.family !== "structure" || initial.activeFamilyId !== "structure") failures.push("initial_family_identity");
  if (initial.perspective === "none" || !initial.activeTransform || initial.activeTransform === "none") failures.push("single_axis_depth_geometry");
  if (initial.dialogs !== 0) failures.push("detached_reader_present");
  if (initial.horizontalOverflow > 2) failures.push("horizontal_overflow");

  await page.click('[data-mm-family-tabs] [data-family-index="1"]');
  await page.waitForFunction(() => document.querySelector("[data-mm-carousel]")?.dataset.family === "pressure");
  const selected = await readState(page);
  if (selected.activeFamilyId !== "pressure" || selected.activeCards !== 1) failures.push("tab_rotation_identity");
  if (selected.ringTransform === initial.ringTransform) failures.push("tab_rotation_no_depth_change");

  const activeSelector = '.mm-card[data-active="true"]';
  await page.click(`${activeSelector} [data-open-inspection]`);
  await page.waitForFunction(() => document.querySelector("[data-mm-carousel]")?.dataset.inspecting === "true");
  const inspection = await readState(page);
  if (inspection.activeFamilyId !== "pressure" || inspection.activeCardInspecting !== "true") failures.push("same_object_inspection_identity");
  if (inspection.dialogs !== 0) failures.push("inspection_detached_dialog");
  if (!/return\s+to\s+orbit/i.test(inspection.closeLabel)) failures.push("return_to_orbit_control_missing");

  await page.click(`${activeSelector} [data-close-inspection]`);
  await page.waitForFunction(() => document.querySelector("[data-mm-carousel]")?.dataset.inspecting === "false");
  const returned = await readState(page);
  if (returned.activeFamilyId !== "pressure" || returned.activeFamilyIndex !== inspection.activeFamilyIndex || returned.activeCardInspecting !== "false") failures.push("return_to_orbit_identity");

  const box = await page.$eval("[data-mm-viewport]", el => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; });
  const beforeDrag = (await readState(page)).ringTransform;
  const sx = box.x + box.width * 0.64;
  const sy = box.y + Math.min(box.height * 0.52, 320);
  await page.mouse.move(sx, sy);
  await page.mouse.down();
  await page.mouse.move(sx - Math.min(170, box.width * 0.24), sy, { steps: 6 });
  const duringDrag = (await readState(page)).ringTransform;
  await page.mouse.up();
  if (duringDrag === beforeDrag) failures.push("continuous_horizontal_drag");

  await page.focus("[data-mm-viewport]");
  const beforeKeyboard = (await readState(page)).activeFamilyId;
  await page.keyboard.press("ArrowRight");
  await page.waitForFunction(prev => document.querySelector('.mm-card[data-active="true"]')?.dataset.familyId !== prev, {}, beforeKeyboard);
  const keyboard = await readState(page);
  if (keyboard.activeFamilyId === beforeKeyboard) failures.push("keyboard_equivalence");

  if (reducedMotion) {
    const reduced = await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (!reduced) failures.push("reduced_motion_media_not_active");
  }
  if (keyboard.horizontalOverflow > 2) failures.push("post_interaction_horizontal_overflow");

  profiles.push({ name, viewport, reducedMotion, failures, initial, selected, inspection, returned, keyboard });
  await page.close();
}

let fatal = null;
try {
  await verifyProfile("desktop", { width: 1440, height: 1000 });
  await verifyProfile("phone", { width: 390, height: 844 });
  await verifyProfile("reduced-motion", { width: 1024, height: 768 }, true);
} catch (error) {
  fatal = String(error?.stack || error);
} finally {
  await browser.close();
}

const profileFailures = profiles.flatMap(profile => profile.failures.map(failure => `${profile.name}:${failure}`));
const failures = [...profileFailures, ...(fatal ? [`fatal:${fatal}`] : [])];
const receipt = {
  schema: "METHODS_MODELS_SINGLE_AXIS_CAROUSEL_EXACT_HEAD_RECEIPT_v1",
  executionCommit: EXECUTION_COMMIT,
  route,
  result: failures.length ? "FAIL_CLOSED" : "PASS_CLOSED",
  sourceAssertions,
  profiles,
  failures
};
fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + "\n");
if (failures.length) throw new Error(`METHODS_MODELS_SINGLE_AXIS_BROWSER_FAILED:${failures.join("|")}`);
console.log(JSON.stringify(receipt));
