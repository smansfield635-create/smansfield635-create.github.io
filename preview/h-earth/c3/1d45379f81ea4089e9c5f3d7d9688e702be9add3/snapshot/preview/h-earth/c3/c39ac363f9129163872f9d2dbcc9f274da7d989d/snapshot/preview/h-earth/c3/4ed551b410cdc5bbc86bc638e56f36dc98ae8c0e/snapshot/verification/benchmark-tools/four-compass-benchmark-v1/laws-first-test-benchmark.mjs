import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import puppeteer from "puppeteer-core";

const ORIGIN = process.env.LAWS_FIRST_ORIGIN || "http://127.0.0.1:4173";
const CHROME_PATH = process.env.CHROME_PATH || process.env.CHROME_BIN || "/usr/bin/google-chrome";
const OUT = "laws-first-test-benchmark-v1.json";
const SHOTS = "laws-first-test-benchmark-v1-screenshots";
const failures = [];
const observations = [];
const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const assert = (condition, id, observed = null, profile = "source") => {
  if (!condition) failures.push({ profile, id, observed });
};
const digest = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const visible = element => {
  if (!element || element.hidden) return false;
  const style = getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0.01 && rect.width > 0 && rect.height > 0;
};

const profiles = [
  { id: "SAMSUNG_REFERENCE_430x932", width: 430, height: 932, mobile: true },
  { id: "DESKTOP_1280x900", width: 1280, height: 900, mobile: false }
];

const source = {
  html: fs.readFileSync("laws/index.html", "utf8"),
  css: fs.readFileSync("laws/index.css", "utf8"),
  interactions: fs.readFileSync("laws/index.interactions.js", "utf8"),
  controller: fs.readFileSync("laws/index.controller.js", "utf8")
};
const sourceCategoryControls = (source.html.match(/<button\b[^>]*\bdata-laws-category-control\b/gi) || []).length;
const sourceLawControls = (source.html.match(/<button\b[^>]*\bdata-laws-law-control\b/gi) || []).length;
assert(source.html.includes('data-laws-method-acronym="FIRST"'), "FIRST_ACRONYM_SOURCE_MISSING");
assert(source.html.includes('data-laws-test-method="cross-cutting-no-fifth-star"'), "TEST_METHOD_SOURCE_MISSING");
assert(source.html.includes('data-laws-primary-star-count="4"'), "PRIMARY_STAR_COUNT_SOURCE_INVALID");
assert(source.html.includes("Every law must pass the Test."), "FIRST_GOVERNING_LINE_MISSING");
assert(sourceCategoryControls === 4, "CATEGORY_CONTROL_COUNT_SOURCE_INVALID", sourceCategoryControls);
assert(sourceLawControls === 16, "LAW_CONTROL_COUNT_SOURCE_INVALID", sourceLawControls);
assert(!/data-(?:direction|laws-cluster-id|laws-law-id)=["']test["']/i.test(source.html), "FIFTH_STAR_OR_LAW_SOURCE_PRESENT");
assert(source.interactions.includes("active-cluster-primary-only"), "PRIMARY_ONLY_LABEL_MODEL_MISSING");
assert(source.interactions.includes("id!==primary"), "PRIMARY_ONLY_VISIBILITY_GATE_MISSING");
assert(source.interactions.includes('lawsProjectedPlacement="star-center-protected-tab"'), "CATEGORY_PROJECTION_PLACEMENT_MISSING");
assert(source.interactions.includes("lawsProjectedCategoryLetter") && source.interactions.includes("lawsProjectedCategoryWord"), "CATEGORY_LABEL_PARTS_MISSING");
assert(source.controller.includes('"Return to Orbit"'), "RETURN_TO_ORBIT_CONTROLLER_IDENTITY_MISSING");
assert(source.css.includes("LAWS_FIRST_TEST_LABEL_AND_SHELL_CONFORMANCE_20260729A"), "FIRST_SHELL_STYLE_MISSING");

fs.rmSync(SHOTS, { recursive: true, force: true });
fs.mkdirSync(SHOTS, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: "new",
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--enable-webgl",
    "--ignore-gpu-blocklist",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader"
  ]
});

for (const profile of profiles) {
  const page = await browser.newPage();
  await page.setViewport({
    width: profile.width,
    height: profile.height,
    deviceScaleFactor: 1,
    isMobile: profile.mobile,
    hasTouch: profile.mobile
  });
  const telemetry = { pageErrors: [], requestFailures: [], consoleErrors: [] };
  page.on("pageerror", error => telemetry.pageErrors.push(String(error?.message || error)));
  page.on("requestfailed", request => telemetry.requestFailures.push({ url: request.url(), error: request.failure()?.errorText || "" }));
  page.on("console", message => { if (message.type() === "error") telemetry.consoleErrors.push(message.text()); });

  const response = await page.goto(`${ORIGIN}/laws/`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForFunction(() => Boolean(
    document.querySelector("[data-laws-root]") &&
    globalThis.DGB_LAWS_CONTROLLER &&
    document.querySelectorAll("[data-laws-category-control]").length === 4 &&
    document.querySelectorAll("[data-laws-projected-category-label]").length === 4
  ), { timeout: 45000 });
  await sleep(800);

  const inspect = async stateLabel => page.evaluate((label, visibleSource) => {
    const isVisible = eval(`(${visibleSource})`);
    const root = document.querySelector("[data-laws-root]");
    const categoryLabels = [...document.querySelectorAll("[data-laws-projected-category-label]")];
    const lawLabels = [...document.querySelectorAll("[data-laws-projected-law-label]")];
    const returnControl = document.querySelector("[data-laws-return-to-orbit]");
    const categoryProjection = categoryLabels.map(element => ({
      id: element.dataset.direction || "",
      placement: element.dataset.lawsProjectedPlacement || "",
      left: Number.parseFloat(element.style.left),
      top: Number.parseFloat(element.style.top),
      depthLayer: element.dataset.depthLayer || "",
      primary: element.dataset.primary === "true",
      visible: isVisible(element)
    }));
    return {
      stateLabel: label,
      controllerState: root?.dataset.lawsControllerState || "",
      presentationMode: root?.dataset.lawsPresentationMode || "",
      controllerAvailable: Boolean(globalThis.DGB_LAWS_CONTROLLER),
      acronym: document.documentElement.dataset.lawsMethodAcronym || "",
      testMethod: document.documentElement.dataset.lawsTestMethod || "",
      primaryStarCount: Number(document.documentElement.dataset.lawsPrimaryStarCount || 0),
      categoryControlCount: document.querySelectorAll("[data-laws-category-control]").length,
      lawControlCount: document.querySelectorAll("[data-laws-law-control]").length,
      categoryVisibleCount: categoryLabels.filter(isVisible).length,
      categoryPrimaryCount: categoryLabels.filter(element => isVisible(element) && element.dataset.primary === "true").length,
      categoryLetterCount: categoryLabels.filter(element => element.querySelector("[data-laws-projected-category-letter]")).length,
      categoryWordCount: categoryLabels.filter(element => element.querySelector("[data-laws-projected-category-word]")).length,
      categoryProjection,
      lawVisibleCount: lawLabels.filter(isVisible).length,
      lawPrimaryCount: lawLabels.filter(element => isVisible(element) && element.dataset.primary === "true").length,
      visibleLawLabels: lawLabels.filter(isVisible).map(element => element.textContent.trim()),
      firstMethodPresent: Boolean(document.querySelector("[data-laws-first-method]")),
      firstMethodText: document.querySelector("[data-laws-first-method]")?.textContent.replace(/\s+/g, " ").trim() || "",
      returnVisible: isVisible(returnControl),
      returnText: returnControl?.textContent.replace(/\s+/g, " ").trim() || "",
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1Count: document.querySelectorAll("h1").length
    };
  }, stateLabel, visible.toString());

  const waitForSingleLawLabel = () => page.waitForFunction(visibleSource => {
    const isVisible = eval(`(${visibleSource})`);
    const labels = [...document.querySelectorAll("[data-laws-projected-law-label]")];
    return labels.filter(isVisible).length === 1 && labels.filter(element => isVisible(element) && element.dataset.primary === "true").length === 1;
  }, { timeout: 15000 }, visible.toString());

  const initial = await inspect("INITIAL");
  assert([200, 304].includes(response?.status()), "LAWS_ROUTE_STATUS_INVALID", response?.status(), profile.id);
  assert(initial.controllerAvailable, "LAWS_CONTROLLER_RUNTIME_MISSING", initial, profile.id);
  assert(initial.acronym === "FIRST" && initial.testMethod === "cross-cutting-no-fifth-star" && initial.primaryStarCount === 4, "FIRST_TEST_RUNTIME_INVALID", initial, profile.id);
  assert(initial.categoryControlCount === 4 && initial.lawControlCount === 16, "LAW_GEOMETRY_MEMBERSHIP_DRIFT", initial, profile.id);
  assert(initial.categoryVisibleCount === 4 && initial.categoryPrimaryCount === 1 && initial.categoryLetterCount === 4 && initial.categoryWordCount === 4, "CATEGORY_LABEL_RUNTIME_INVALID", initial, profile.id);
  assert(initial.categoryProjection.every(item => item.placement === "star-center-protected-tab" && Number.isFinite(item.left) && Number.isFinite(item.top)), "CATEGORY_LABEL_PROJECTION_AUTHORITY_INVALID", initial.categoryProjection, profile.id);
  assert(initial.lawVisibleCount === 0, "LAW_LABEL_VISIBLE_IN_CONSTELLATION", initial, profile.id);
  assert(initial.firstMethodPresent && initial.firstMethodText.includes("Every law must pass the Test") && initial.firstMethodText.includes("not a fifth law"), "FIRST_METHOD_PANEL_INVALID", initial.firstMethodText, profile.id);
  assert(initial.horizontalOverflow <= 1 && initial.h1Count === 1, "INITIAL_LAYOUT_REGRESSION", initial, profile.id);
  await page.screenshot({ path: path.join(SHOTS, `${profile.id.toLowerCase()}-initial.png`), fullPage: true });

  await page.evaluate(() => globalThis.DGB_LAWS_CONTROLLER.requestCategorySelection("flow"));
  await page.waitForFunction(() => document.querySelector("[data-laws-root]")?.dataset.lawsControllerState === "CLUSTER_OPEN", { timeout: 15000 });
  await waitForSingleLawLabel();
  await sleep(150);
  const cluster = await inspect("CLUSTER_OPEN");
  assert(cluster.categoryVisibleCount === 0, "CATEGORY_LABEL_VISIBLE_IN_CLUSTER", cluster, profile.id);
  assert(cluster.lawVisibleCount === 1 && cluster.lawPrimaryCount === 1, "CLUSTER_VISIBLE_LABEL_COUNT_INVALID", cluster, profile.id);
  assert(cluster.horizontalOverflow <= 1, "CLUSTER_LAYOUT_OVERFLOW", cluster, profile.id);
  await page.screenshot({ path: path.join(SHOTS, `${profile.id.toLowerCase()}-cluster.png`), fullPage: true });

  const selectedId = await page.evaluate(() => {
    const root = document.querySelector("[data-laws-root]");
    const id = root?.dataset.lawsSpatialPrimaryId || "";
    globalThis.DGB_LAWS_CONTROLLER.requestLawSelection(id);
    return id;
  });
  await page.waitForFunction(() => document.querySelector("[data-laws-root]")?.dataset.lawsControllerState === "LAW_SELECTED", { timeout: 15000 });
  await waitForSingleLawLabel();
  await sleep(150);
  const selected = await inspect("LAW_SELECTED");
  assert(Boolean(selectedId), "PRIMARY_LAW_ID_MISSING", selectedId, profile.id);
  assert(selected.lawVisibleCount === 1 && selected.lawPrimaryCount === 1, "SELECTED_LAW_LABEL_COUNT_INVALID", selected, profile.id);
  assert(selected.returnVisible && selected.returnText === "Return to Orbit", "RETURN_TO_ORBIT_RUNTIME_INVALID", selected, profile.id);
  assert(selected.horizontalOverflow <= 1, "SELECTED_LAYOUT_OVERFLOW", selected, profile.id);
  await page.screenshot({ path: path.join(SHOTS, `${profile.id.toLowerCase()}-selected.png`), fullPage: true });

  await page.click("[data-laws-return-to-orbit]");
  await page.waitForFunction(() => document.querySelector("[data-laws-root]")?.dataset.lawsControllerState === "CLUSTER_OPEN", { timeout: 15000 });
  await waitForSingleLawLabel();
  await sleep(150);
  const returned = await inspect("RETURNED_TO_ORBIT");
  assert(returned.lawVisibleCount === 1 && returned.lawPrimaryCount === 1, "RETURNED_CLUSTER_LABEL_COUNT_INVALID", returned, profile.id);
  assert(!returned.returnVisible, "RETURN_CONTROL_REMAINS_VISIBLE_AFTER_RETURN", returned, profile.id);
  assert(telemetry.pageErrors.length === 0 && telemetry.requestFailures.length === 0, "RUNTIME_TELEMETRY_FAILURE", telemetry, profile.id);

  observations.push({ profile: profile.id, initial, cluster, selectedId, selected, returned, telemetry });
  await page.close();
}

await browser.close();
const screenshotManifest = fs.readdirSync(SHOTS).sort().map(file => {
  const filePath = path.join(SHOTS, file);
  return { file, bytes: fs.statSync(filePath).size, sha256: digest(filePath) };
});
const receipt = {
  tool: "LAWS_COMPASS_FIRST_TEST_BENCHMARK_v1",
  checkpoint: "LAWS_FIRST_TEST_LABEL_AND_SHELL_CONFORMANCE_20260729A",
  execution: {
    repository: process.env.GITHUB_REPOSITORY || "smansfield635-create/smansfield635-create.github.io",
    branch: process.env.EXECUTION_BRANCH || process.env.GITHUB_REF_NAME || "",
    commit: process.env.EXECUTION_COMMIT || process.env.GITHUB_SHA || "",
    workflowRunId: process.env.GITHUB_RUN_ID || ""
  },
  invariant: {
    primaryStars: 4,
    fifthStar: false,
    first: { F: "Flow", I: "Integrity", R: "Reality", S: "Structure", T: "Test" },
    testRole: "cross-cutting-no-fifth-star",
    constellationVisibleLabelCount: 4,
    clusterVisibleLabelCount: 1
  },
  observations,
  screenshotManifest,
  failures,
  pass: failures.length === 0,
  stoppingBoundary: {
    proves: ["EXACT_HEAD_BROWSER_EXECUTION", "FIRST_TEST_SEMANTICS_PRESENT", "CATEGORY_LABEL_PROJECTION_AUTHORITY", "SINGLE_CLUSTER_LABEL", "RETURN_TO_ORBIT_IDENTITY"],
    doesNotProve: ["PHYSICAL_SAMSUNG_ACCEPTANCE", "UNIVERSAL_VISUAL_CORRECTNESS", "SCIENTIFIC_VALIDATION"]
  }
};
fs.writeFileSync(OUT, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify({ pass: receipt.pass, failures: failures.length, observations: observations.length, screenshots: screenshotManifest.length }, null, 2));
if (failures.length) process.exitCode = 1;
