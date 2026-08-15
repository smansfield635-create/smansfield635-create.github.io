import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright";

const ROOT = process.cwd();
const PACKAGE = "control-plane/whole-estate/tests-l0-l1-compass-integrated-m1-v1";
const REGISTRY_PATH = "control-plane/whole-estate/tests-l0-l1-object-projection-registry-v1/object-projection-registry.v1.json";
const BASE_URL = process.env.M1_COMPASS_BASE_URL || "http://127.0.0.1:4173";
const OUT = process.env.M1_COMPASS_RUNTIME_DIR || "/tmp/m1-compass-integrated-runtime";
const PAGE_URL = `${BASE_URL}/${PACKAGE}/`;
const EXPECTED_OBJECTS = ["METHODS", "ROUTE_OPERATOR_PLATFORM", "PROSPECTIVE_FINAL_REPORT_PORTFOLIO"];
const EXPECTED_RELATIONS = [
  "METHODS__GOVERNS_PROCEDURE_FOR__PROSPECTIVE_FINAL_REPORT_PORTFOLIO",
  "ROUTE_OPERATOR_PLATFORM__EXECUTES__PROSPECTIVE_FINAL_REPORT_PORTFOLIO"
];

let assertions = 0;
const failures = [];
const observations = [];
function check(condition, id, detail = "") {
  assertions += 1;
  if (!condition) failures.push({ id, detail });
}
function observe(id, value) { observations.push({ id, value }); }
function sha256Buffer(buffer) { return crypto.createHash("sha256").update(buffer).digest("hex"); }
function sorted(values) { return [...values].sort(); }
function sameSet(a, b) { return JSON.stringify(sorted(a)) === JSON.stringify(sorted(b)); }
function semanticSnapshot(state) {
  return { objectIds: sorted(state.objectIds || []), relationIds: sorted(state.relationIds || []) };
}
function sameSemanticSnapshot(a, b) {
  return JSON.stringify(semanticSnapshot(a)) === JSON.stringify(semanticSnapshot(b));
}
function git(...args) { return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim(); }
async function waitReady(page) {
  await page.waitForFunction(() => Boolean(window.__M1_COMPASS_INTEGRATED__), null, { timeout: 10000 });
}
async function getState(page) { return page.evaluate(() => window.__M1_COMPASS_INTEGRATED__.getState()); }
async function screenshot(page, name) {
  const target = path.join(OUT, name);
  await page.screenshot({ path: target, fullPage: true });
  return { name, sha256: sha256Buffer(fs.readFileSync(target)) };
}

fs.mkdirSync(OUT, { recursive: true });
const candidateHead = git("rev-parse", "HEAD");
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "no-preference" });
const page = await context.newPage();
const pageErrors = [];
page.on("pageerror", (error) => pageErrors.push(String(error)));

try {
  await page.goto(PAGE_URL, { waitUntil: "networkidle" });
  await waitReady(page);

  const initial = await getState(page);
  check(initial.registryValidated === true, "REGISTRY_VALIDATED_AT_BOOT");
  check(initial.depth === "L_MINUS_1", "INITIAL_DEPTH_L_MINUS_1", initial.depth);
  check(initial.focus === "METHODS", "INITIAL_FOCUS_METHODS", initial.focus);
  check(sameSet(initial.objectIds, EXPECTED_OBJECTS), "INITIAL_OBJECT_SET_EXACT", JSON.stringify(initial.objectIds));
  check(sameSet(initial.relationIds, EXPECTED_RELATIONS), "INITIAL_RELATION_SET_EXACT", JSON.stringify(initial.relationIds));
  const baselineSemantic = semanticSnapshot(initial);

  const priorContext = await page.evaluate(() => window.__M1_COMPASS_INTEGRATED__.restorePriorContext());
  check(priorContext?.source === "NONPUBLIC_COMPASS_PREVIEW", "C01_ENTRY_CONTEXT_PRESERVED_AS_NAVIGATION_ONLY", JSON.stringify(priorContext));
  check(priorContext?.semanticAuthority === false, "C01_ENTRY_CONTEXT_HAS_NO_SEMANTIC_AUTHORITY");

  await page.click("#open-tests");
  let state = await getState(page);
  check(state.depth === "L0", "C06_DEPTH_TO_L0", state.depth);
  check(await page.locator("#projection-stage").isVisible(), "L0_PROJECTION_STAGE_VISIBLE");
  check(!(await page.locator("#methods-stage").isVisible()), "L1_HIDDEN_AT_L0");
  check((await page.locator(".projection-tab").count()) === 4, "L0_FOUR_PROJECTION_TABS_PRESENT");
  check((await page.locator(".projection-tab:enabled").count()) === 1, "ONLY_METHODS_PROJECTION_ENABLED");
  check((await page.locator(".projection-tab:disabled").count()) === 3, "MODELS_EXPERIMENTS_EVIDENCE_WITHHELD");
  check(sameSemanticSnapshot(initial, state), "L0_DEPTH_TRANSITION_SEMANTIC_INVARIANCE");

  await page.click("#open-methods");
  state = await getState(page);
  check(state.depth === "L1", "C06_DEPTH_TO_L1", state.depth);
  check(await page.locator("#methods-stage").isVisible(), "L1_METHODS_STAGE_VISIBLE");
  check((await page.locator(".information-tab").count()) === 3, "L1_EXACTLY_THREE_INFORMATION_OBJECTS");
  check((await page.locator("#relation-paths path[data-relation-id]").count()) === 2, "L1_EXACTLY_TWO_DECLARED_RELATIONS");
  check((await page.locator("#relation-key-items p").count()) === 2, "RELATION_KEY_EXACTLY_TWO");
  check(sameSemanticSnapshot(initial, state), "L1_DEPTH_TRANSITION_SEMANTIC_INVARIANCE");

  const visibleCards = await page.locator(".information-tab").evaluateAll((nodes) => nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    return {
      id: node.dataset.objectId,
      active: node.dataset.active,
      width: rect.width,
      height: rect.height,
      opacity: Number(getComputedStyle(node).opacity),
      zIndex: Number(getComputedStyle(node).zIndex),
      transform: node.style.transform,
      standing: node.querySelector(".tab-standing")?.textContent || ""
    };
  }));
  check(visibleCards.every((card) => card.width > 0 && card.height > 0 && card.opacity >= 0.5), "C05_NEIGHBORS_RETAINED_AND_VISIBLE", JSON.stringify(visibleCards));
  check(visibleCards.every((card) => card.transform.includes("translate3d")), "C08_RUNTIME_3D_PROJECTION_APPLIED", JSON.stringify(visibleCards));
  const methodsCard = visibleCards.find((card) => card.id === "METHODS");
  const maxZ = Math.max(...visibleCards.map((card) => card.zIndex));
  check(methodsCard?.active === "true" && methodsCard?.zIndex === maxZ, "C04_ACTIVE_OBJECT_DOMINANCE_METHODS", JSON.stringify(visibleCards));
  check(visibleCards.every((card) => !card.standing.includes("[object Object]")), "CURRENT_STANDING_RENDERED_AS_AUTHORITY_TEXT", JSON.stringify(visibleCards.map((card) => card.standing)));

  await page.evaluate(() => window.__M1_COMPASS_INTEGRATED__.setFocus("ROUTE_OPERATOR_PLATFORM"));
  state = await getState(page);
  check(state.focus === "ROUTE_OPERATOR_PLATFORM", "C04_PROGRAMMATIC_FOCUS", JSON.stringify(state));
  check(sameSemanticSnapshot(initial, state), "PROGRAMMATIC_FOCUS_SEMANTIC_INVARIANCE");
  const programmaticReceipt = await page.evaluate(() => window.__M1_COMPASS_LAST_FOCUS__);
  check(programmaticReceipt?.semanticMutation === false, "PROGRAMMATIC_FOCUS_DECLARED_NONSEMANTIC");

  await page.locator('[data-object-id="PROSPECTIVE_FINAL_REPORT_PORTFOLIO"]').click();
  state = await getState(page);
  check(state.focus === "PROSPECTIVE_FINAL_REPORT_PORTFOLIO", "C04_POINTER_FOCUS", JSON.stringify(state));
  check(sameSemanticSnapshot(initial, state), "POINTER_FOCUS_SEMANTIC_INVARIANCE");

  await page.locator('[data-object-id="PROSPECTIVE_FINAL_REPORT_PORTFOLIO"]').press("ArrowLeft");
  state = await getState(page);
  check(state.focus === "ROUTE_OPERATOR_PLATFORM", "C04_KEYBOARD_FOCUS", JSON.stringify(state));
  check(sameSemanticSnapshot(initial, state), "KEYBOARD_FOCUS_SEMANTIC_INVARIANCE");

  const beforeDrag = state.focus;
  const box = await page.locator("#spatial-viewport").boundingBox();
  check(Boolean(box), "C07_DIRECT_MANIPULATION_VIEWPORT_AVAILABLE");
  if (box) {
    await page.mouse.move(box.x + box.width * 0.64, box.y + box.height * 0.55);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.28, box.y + box.height * 0.55, { steps: 9 });
    await page.mouse.up();
  }
  state = await getState(page);
  check(state.focus !== beforeDrag, "C07_DIRECT_MANIPULATION_CHANGES_NAVIGATION_FOCUS", `${beforeDrag}->${state.focus}`);
  check(sameSemanticSnapshot(initial, state), "DIRECT_MANIPULATION_SEMANTIC_INVARIANCE");

  const desktopPerspective = await page.locator("#spatial-viewport").evaluate((node) => node.style.getPropertyValue("--field-perspective"));
  const relationPathsDesktop = await page.locator("#relation-paths path").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("d")));
  check(relationPathsDesktop.every((d) => /^M\s/.test(d || "")), "RELATION_GEOMETRY_PRESENT_DESKTOP", JSON.stringify(relationPathsDesktop));
  const desktopShot = await screenshot(page, "desktop-l1.png");

  await page.setViewportSize({ width: 820, height: 1180 });
  await page.evaluate(() => window.__M1_COMPASS_INTEGRATED__.relayout());
  await page.waitForTimeout(80);
  const tabletState = await getState(page);
  check(sameSemanticSnapshot(initial, tabletState), "TABLET_REFLOW_SEMANTIC_INVARIANCE");
  const tabletPerspective = await page.locator("#spatial-viewport").evaluate((node) => node.style.getPropertyValue("--field-perspective"));
  check(Boolean(tabletPerspective), "TABLET_RESPONSIVE_PERSPECTIVE_PRESENT");
  const tabletShot = await screenshot(page, "tablet-l1.png");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.__M1_COMPASS_INTEGRATED__.relayout());
  await page.waitForTimeout(80);
  const phoneState = await getState(page);
  check(sameSemanticSnapshot(initial, phoneState), "PHONE_REFLOW_SEMANTIC_INVARIANCE");
  const phonePerspective = await page.locator("#spatial-viewport").evaluate((node) => node.style.getPropertyValue("--field-perspective"));
  check(Boolean(phonePerspective), "PHONE_RESPONSIVE_PERSPECTIVE_PRESENT");
  check(desktopPerspective !== phonePerspective, "C08_RESPONSIVE_PROJECTION_CHANGES_NAVIGATION_GEOMETRY", `${desktopPerspective}->${phonePerspective}`);
  const phoneShot = await screenshot(page, "phone-l1.png");

  await page.evaluate(() => window.__M1_COMPASS_INTEGRATED__.setFocus("ROUTE_OPERATOR_PLATFORM"));
  await page.reload({ waitUntil: "networkidle" });
  await waitReady(page);
  state = await getState(page);
  check(state.depth === "L1", "C09_DEPTH_PERSISTS_ACROSS_RELOAD", state.depth);
  check(state.focus === "ROUTE_OPERATOR_PLATFORM", "C09_FOCUS_PERSISTS_ACROSS_RELOAD", state.focus);
  check(sameSemanticSnapshot(initial, state), "C09_CONTINUITY_SEMANTIC_INVARIANCE");

  await page.click("#restore-context");
  state = await getState(page);
  check(state.depth === "L_MINUS_1", "C02_RETURN_RESTORES_L_MINUS_1", state.depth);
  const returnReceipt = await page.evaluate(() => window.__M1_COMPASS_RETURN_RECEIPT__);
  check(returnReceipt?.semanticMutation === false, "C02_RETURN_DECLARED_NONSEMANTIC");
  check(returnReceipt?.restoredPrior?.semanticAuthority === false, "C02_RETURN_CONTEXT_CARRIES_NO_SCIENTIFIC_AUTHORITY");
  check(sameSemanticSnapshot(initial, state), "RETURN_SEMANTIC_INVARIANCE");

  check((await page.locator("a").count()) === 0, "NO_ROUTE_ANCHORS_RUNTIME");
  const enabledLabels = await page.locator("button:enabled").allTextContents();
  check(!enabledLabels.some((label) => /\b(?:inspect|follow|enter)\b/i.test(label)), "L2_L3_L4_INTERACTIVE_SURFACES_ABSENT", JSON.stringify(enabledLabels));
  check(pageErrors.length === 0, "NO_PAGE_ERRORS_NORMAL_RUNTIME", JSON.stringify(pageErrors));

  const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const reduced = await reducedContext.newPage();
  await reduced.goto(PAGE_URL, { waitUntil: "networkidle" });
  await waitReady(reduced);
  await reduced.click("#open-tests");
  await reduced.click("#open-methods");
  const reducedState = await getState(reduced);
  check(sameSemanticSnapshot(initial, reducedState), "REDUCED_MOTION_SEMANTIC_INVARIANCE");
  const reducedTransition = await reduced.locator(".information-tab").first().evaluate((node) => getComputedStyle(node).transitionDuration);
  observe("REDUCED_MOTION_TRANSITION_DURATION", reducedTransition);
  await reducedContext.close();

  const registryPayload = JSON.parse(fs.readFileSync(path.join(ROOT, REGISTRY_PATH), "utf8"));
  const corruptContext = await browser.newContext({ viewport: { width: 820, height: 1000 } });
  const corrupt = await corruptContext.newPage();
  await corrupt.route("**/tests-l0-l1-object-projection-registry-v1/object-projection-registry.v1.json", async (route) => {
    const altered = structuredClone(registryPayload);
    altered.objects = altered.objects.slice(0, 2);
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(altered) });
  });
  await corrupt.goto(PAGE_URL, { waitUntil: "networkidle" });
  await corrupt.waitForTimeout(200);
  check(await corrupt.locator("#global-failure").isVisible(), "CORRUPT_REGISTRY_FAILS_CLOSED");
  check((await corrupt.locator(".information-tab").count()) === 0, "CORRUPT_REGISTRY_RENDERS_ZERO_OBJECTS");
  check((await corrupt.locator("#relation-paths path").count()) === 0, "CORRUPT_REGISTRY_RENDERS_ZERO_RELATIONS");
  check(await corrupt.evaluate(() => typeof window.__M1_COMPASS_INTEGRATED__ === "undefined"), "CORRUPT_REGISTRY_EXPOSES_NO_READY_API");
  await corruptContext.close();

  const missingContext = await browser.newContext({ viewport: { width: 820, height: 1000 } });
  const missing = await missingContext.newPage();
  await missing.route("**/tests-l0-l1-object-projection-registry-v1/object-projection-registry.v1.json", (route) => route.fulfill({ status: 503, body: "withheld" }));
  await missing.goto(PAGE_URL, { waitUntil: "networkidle" });
  await missing.waitForTimeout(200);
  check(await missing.locator("#global-failure").isVisible(), "MISSING_REGISTRY_FAILS_CLOSED");
  check((await missing.locator(".information-tab").count()) === 0, "MISSING_REGISTRY_RENDERS_ZERO_OBJECTS");
  check(await missing.evaluate(() => typeof window.__M1_COMPASS_INTEGRATED__ === "undefined"), "MISSING_REGISTRY_EXPOSES_NO_READY_API");
  await missingContext.close();

  const receipt = {
    schema: "TESTS_L0_L1_COMPASS_INTEGRATED_M1_RUNTIME_RECEIPT_v1",
    result: failures.length ? "FAIL_BOUNDED_COMPASS_INTEGRATED_M1_RUNTIME_REVIEW" : "PASS_BOUNDED_COMPASS_INTEGRATED_M1_RUNTIME_REVIEW",
    candidateHead,
    browser: await browser.version(),
    assertions,
    failures,
    observations,
    fixedSemanticSnapshot: baselineSemantic,
    screenshots: [desktopShot, tabletShot, phoneShot],
    evidenceBoundary: {
      structuralConformancePrerequisite: true,
      runtimeReview: failures.length ? "FAIL" : "PASS_BOUNDED",
      perceptualReview: "NOT_ESTABLISHED_BY_THIS_RECEIPT",
      baselineRegression: "NOT_ESTABLISHED_BY_THIS_RECEIPT",
      exactHeadCertification: "NOT_ESTABLISHED_BY_THIS_RECEIPT",
      publicPromotionFitness: "NOT_ESTABLISHED",
      promotionAuthority: false
    }
  };
  fs.writeFileSync(path.join(OUT, "runtime-receipt.v1.json"), JSON.stringify(receipt, null, 2) + "\n");
  console.log(JSON.stringify({ result: receipt.result, assertions, failures: failures.length, failureDetails: failures, out: OUT }, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await context.close();
  await browser.close();
}
