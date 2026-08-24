import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const CONTRACT = "LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_ROOT_MATRIX_v2";
const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:4173";
const EVIDENCE_DIR = path.resolve(
  process.cwd(),
  process.env.EVIDENCE_DIR || "artifacts/laws-experiential-restoration/root-matrix"
);
const HEAD = process.env.EXECUTION_COMMIT || process.env.GITHUB_SHA || "LOCAL";
const MAX_CTA_GAP = 160;

const AUTHORITIES = Object.freeze({
  flow: { title: "What changed?", route: "/laws/categories/flow/" },
  integrity: { title: "What remained intact?", route: "/laws/categories/integrity/" },
  reality: { title: "What does the evidence show?", route: "/laws/categories/reality/" },
  structure: { title: "What conditions shaped the result?", route: "/laws/categories/structure/" },
  test: { title: "What was actually tested?", route: "/laws/test/" }
});

const PROFILES = Object.freeze([
  { name: "phone-portrait", width: 390, height: 844, isMobile: true, hasTouch: true, input: "touch" },
  { name: "tablet-portrait", width: 820, height: 1180, isMobile: true, hasTouch: true, input: "touch" },
  { name: "tablet-landscape", width: 1180, height: 820, isMobile: true, hasTouch: true, input: "touch" },
  { name: "desktop", width: 1440, height: 1000, isMobile: false, hasTouch: false, input: "pointer" }
]);

const receipt = {
  contract: CONTRACT,
  head: HEAD,
  route: "/laws/",
  generatedAt: new Date().toISOString(),
  profiles: {},
  keyboardFiveAuthorityCoverage: null,
  reducedMotion: null,
  staticNoJavaScript: {},
  disposition: "IN_PROGRESS"
};

async function writeJson(name, value) {
  await fs.mkdir(EVIDENCE_DIR, { recursive: true });
  await fs.writeFile(path.join(EVIDENCE_DIR, name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function browserErrors(page) {
  const errors = [];
  page.on("pageerror", error => errors.push(`pageerror:${error.message}`));
  page.on("console", message => {
    if (message.type() === "error" && !message.text().includes("404")) {
      errors.push(`console:${message.text()}`);
    }
  });
  return errors;
}

function hasActiveCyanSignal(...values) {
  const triplets = values.flatMap(value =>
    Array.from(String(value || "").matchAll(/rgba?\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)/g), match =>
      match.slice(1, 4).map(Number)
    )
  );
  return triplets.some(([red, green, blue]) =>
    blue >= 180 && green >= 170 && green >= red + 45 && blue >= red + 65
  );
}

async function waitForRuntime(page) {
  await page.waitForFunction(() => {
    const root = document.querySelector("[data-laws-root]");
    return Boolean(globalThis.DGB_LAWS_CONTROLLER && globalThis.DGB_LAWS_EXPERIENCE && globalThis.DGBLawsStagedLoader) &&
      root?.dataset.lawsControllerStatus === "available";
  }, null, { timeout: 30000 });
  const preload = await page.evaluate(() =>
    globalThis.DGB_LAWS_EXPERIENCE?.requestCompassRuntimePreload?.() ?? false
  );
  assert.equal(preload, true, "Existing staged runtime preload request was rejected.");
  await page.waitForFunction(() => {
    const root = document.querySelector("[data-laws-root]");
    return Boolean(globalThis.DGB_LAWS_INTERACTIONS) && root?.dataset.lawsInteractionsStatus === "available";
  }, null, { timeout: 30000 });
}

async function activateDisclosure(page, input) {
  const details = page.locator(".laws-first > details[data-laws-first-disclosure]");
  assert.equal(await details.count(), 1, "Expected one rendered F.I.R.S.T. disclosure.");
  const summary = details.locator(":scope > summary");
  if (await details.evaluate(node => node.open)) {
    await summary.click();
    await page.waitForFunction(() =>
      !document.querySelector(".laws-first > details[data-laws-first-disclosure]")?.open
    );
  }
  if (input === "keyboard") {
    await summary.focus();
    await summary.press("Enter");
  } else if (input === "touch") {
    await summary.tap();
  } else {
    await summary.click();
  }
  await page.waitForFunction(() =>
    Boolean(document.querySelector(".laws-first > details[data-laws-first-disclosure]")?.open)
  );
  await page.waitForTimeout(180);
  const state = await page.evaluate(maxGap => {
    const details = document.querySelector(".laws-first > details[data-laws-first-disclosure]");
    const summary = details?.querySelector(":scope > summary");
    const body = details?.querySelector(":scope > .laws-first__disclosure-body");
    const a = summary?.getBoundingClientRect();
    const b = body?.getBoundingClientRect();
    const gap = a && b ? b.top - a.bottom : null;
    const intersects = Boolean(b && b.bottom > 0 && b.top < innerHeight);
    return {
      open: Boolean(details?.open),
      summaryBottom: a?.bottom ?? null,
      bodyTop: b?.top ?? null,
      bodyBottom: b?.bottom ?? null,
      bodyPosition: body ? getComputedStyle(body).position : "",
      gap,
      intersects,
      immediateVisibleConsequence: Boolean(intersects && gap !== null && gap <= maxGap),
      scrollY
    };
  }, MAX_CTA_GAP);
  assert.equal(state.open, true, "F.I.R.S.T. disclosure did not open.");
  assert.equal(state.immediateVisibleConsequence, true,
    `CTA consequence displaced: gap=${state.gap}, intersects=${state.intersects}.`);
  return state;
}

async function centerScene(page) {
  await page.evaluate(() => document.querySelector("[data-laws-scene-field]")?.scrollIntoView({
    block: "center", inline: "nearest", behavior: "instant"
  }));
  await page.waitForTimeout(350);
}

async function returnToConstellation(page) {
  const current = await page.locator("[data-laws-root]").getAttribute("data-laws-controller-state");
  if (current === "CONSTELLATION") return;
  const accepted = await page.evaluate(() =>
    globalThis.DGB_LAWS_CONTROLLER?.requestReturnToConstellation?.({ source: "root-matrix-reset", scrollToScene: false }) ?? false
  );
  assert.equal(accepted, true, `Controller rejected test reset from ${current}.`);
  await page.waitForFunction(() =>
    document.querySelector("[data-laws-root]")?.dataset.lawsControllerState === "CONSTELLATION"
  );
}

async function physicalHit(page) {
  return page.evaluate(() => {
    const root = document.querySelector("[data-laws-root]");
    const direction = root?.dataset.lawsVisibleOuterAuthorityLabelId || "";
    const label = document.querySelector(`[data-laws-projected-category-label="${direction}"]`);
    if (!(label instanceof HTMLElement)) return null;
    const rect = label.getBoundingClientRect();
    for (const [fx, fy] of [[.5,.5],[.35,.5],[.65,.5],[.5,.35],[.5,.65]]) {
      const x = rect.left + rect.width * fx;
      const y = rect.top + rect.height * fy;
      if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) continue;
      const top = document.elementFromPoint(x, y);
      if (top?.closest?.(`[data-laws-projected-category-label="${direction}"]`)) {
        return {
          direction, x, y,
          rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
          topTag: top.tagName,
          topClass: typeof top.className === "string" ? top.className : ""
        };
      }
    }
    return null;
  });
}

async function correspondence(page, direction) {
  const expected = AUTHORITIES[direction];
  const state = await page.evaluate(({ direction, expectedRoute, expectedTitle }) => {
    const root = document.querySelector("[data-laws-root]");
    const semantic = document.querySelector(`[data-laws-category][data-direction="${direction}"]`);
    const rail = Array.from(document.querySelectorAll(
      "[data-laws-first-rail] [data-laws-experience-indicator]"
    ));
    const active = rail.filter(item => item.dataset.lawsExperienceActive === "true");
    const activeItem = active[0] || null;
    const light = activeItem?.querySelector(".laws-first-rail__light") || null;
    const question = document.querySelector(
      `.laws-first__question-grid [data-laws-experience-question="${direction}"]`
    );
    const interaction = globalThis.DGB_LAWS_INTERACTIONS?.getReceipt?.() || null;
    return {
      controllerState: root?.dataset.lawsControllerState || "",
      experienceDirection: document.documentElement.dataset.lawsExperienceDirection || "",
      semanticExpanded: semantic?.getAttribute("aria-expanded") || "",
      railCount: rail.length,
      activeRailCount: active.length,
      activeRailDirection: activeItem?.dataset.lawsExperienceIndicator || "",
      activeRailCurrent: activeItem?.getAttribute("aria-current") || "",
      activeLightBackground: light ? getComputedStyle(light).backgroundColor : "",
      activeLightShadow: light ? getComputedStyle(light).boxShadow : "",
      questionActive: question?.dataset.lawsExperienceActive || "",
      entryRoute: question?.querySelector("a")?.getAttribute("href") || "",
      expectedRoute,
      speakerTitle: document.querySelector("[data-laws-experience-speaker-title]")?.textContent?.trim() || "",
      expectedTitle,
      speakerBody: document.querySelector("[data-laws-experience-speaker-body]")?.textContent?.trim() || "",
      interactionLastAction: interaction?.lastAction || "",
      interactionLastFailure: interaction?.lastFailure || "",
      overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth
    };
  }, { direction, expectedRoute: expected.route, expectedTitle: expected.title });
  assert.equal(state.controllerState, "CLUSTER_OPEN", `${direction}: controller did not open the authority cluster.`);
  assert.equal(state.experienceDirection, direction, `${direction}: experience correspondence mismatch.`);
  assert.equal(state.railCount, 5, `${direction}: five-light rail incomplete.`);
  assert.equal(state.activeRailCount, 1, `${direction}: expected exactly one active light.`);
  assert.equal(state.activeRailDirection, direction, `${direction}: wrong active light.`);
  assert.equal(state.activeRailCurrent, "true", `${direction}: aria-current mismatch.`);
  assert.equal(hasActiveCyanSignal(state.activeLightBackground, state.activeLightShadow), true,
    `${direction}: active rail has no cyan signal (${state.activeLightBackground}; ${state.activeLightShadow}).`);
  assert.notEqual(state.activeLightShadow, "none", `${direction}: active light glow missing.`);
  assert.equal(state.questionActive, "true", `${direction}: active question mismatch.`);
  assert.equal(state.entryRoute, expected.route, `${direction}: entry route mismatch.`);
  assert.equal(state.speakerTitle, expected.title, `${direction}: active question title mismatch.`);
  assert.ok(state.speakerBody.length > 30, `${direction}: active explanation missing.`);
  assert.equal(state.interactionLastFailure, "", `${direction}: protected interaction reported failure.`);
  assert.ok(state.overflow <= 2, `${direction}: horizontal overflow ${state.overflow}px.`);
  return state;
}

async function activateVisiblePhysically(page, input) {
  await returnToConstellation(page);
  await centerScene(page);
  const hit = await physicalHit(page);
  assert.ok(hit, `No owned visible projected-authority hit point for ${input}.`);
  if (input === "touch") await page.touchscreen.tap(hit.x, hit.y);
  else await page.mouse.click(hit.x, hit.y);
  await page.waitForFunction(direction => {
    const root = document.querySelector("[data-laws-root]");
    return root?.dataset.lawsControllerState === "CLUSTER_OPEN" &&
      document.documentElement.dataset.lawsExperienceDirection === direction;
  }, hit.direction, { timeout: 15000 });
  await page.waitForTimeout(300);
  const state = await correspondence(page, hit.direction);
  assert.equal(state.interactionLastAction, "pointer-finalized:TAP:handled",
    `${input}: physical authority tap was not handled by the protected interaction runtime.`);
  return { hit, state };
}

async function activateKeyboardAuthority(page, direction) {
  await returnToConstellation(page);
  const control = page.locator(`[data-laws-category][data-direction="${direction}"]`).first();
  assert.equal(await control.count(), 1, `Keyboard authority control missing: ${direction}.`);
  await control.focus();
  assert.equal(await control.evaluate(node => document.activeElement === node), true,
    `Keyboard focus did not reach ${direction}.`);
  await control.press("Enter");
  await page.waitForFunction(nextDirection => {
    const root = document.querySelector("[data-laws-root]");
    return root?.dataset.lawsControllerState === "CLUSTER_OPEN" &&
      document.documentElement.dataset.lawsExperienceDirection === nextDirection;
  }, direction, { timeout: 15000 });
  await page.waitForTimeout(250);
  return correspondence(page, direction);
}

async function verifyProfile(browser, profile) {
  const context = await browser.newContext({
    viewport: { width: profile.width, height: profile.height },
    isMobile: profile.isMobile,
    hasTouch: profile.hasTouch,
    deviceScaleFactor: 1
  });
  const page = await context.newPage();
  const errors = browserErrors(page);
  await page.goto(`${BASE_URL}/laws/`, { waitUntil: "networkidle" });
  await waitForRuntime(page);
  await page.evaluate(() => scrollTo({ top: 0, left: 0, behavior: "instant" }));
  await page.screenshot({ path: path.join(EVIDENCE_DIR, `${profile.name}-entry.png`) });
  const appliedStudy = await page.evaluate(() => {
    const study = document.querySelector('[data-battery-study="BATTERY_COHERENCE_HELDOUT_STUDY_v1"]');
    const disclosure = study?.closest('[data-laws-applied-study-disclosure="battery-health"]');
    return {
      present: Boolean(study),
      nestedInOptionalDepth: Boolean(disclosure),
      openOnEntry: Boolean(disclosure?.open),
      parentPanel: Boolean(disclosure?.closest('[data-laws-supporting-panel="evidence-applied"]'))
    };
  });
  assert.equal(appliedStudy.present, true, `${profile.name}: applied study missing.`);
  assert.equal(appliedStudy.nestedInOptionalDepth, true, `${profile.name}: battery study dominates the root instead of optional depth.`);
  assert.equal(appliedStudy.openOnEntry, false, `${profile.name}: applied study must be closed on entry.`);
  assert.equal(appliedStudy.parentPanel, true, `${profile.name}: applied study is outside the evidence path.`);
  const cta = await activateDisclosure(page, profile.input);
  const physicalAuthority = await activateVisiblePhysically(page, profile.input);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, `${profile.name}-selected.png`) });
  assert.deepEqual(errors, [], `${profile.name}: browser errors: ${errors.join(" | ")}`);
  const result = { profile, appliedStudy, cta, physicalAuthority, errors, disposition: "PASS" };
  await writeJson(`${profile.name}.json`, result);
  await context.close();
  return result;
}

async function verifyKeyboard(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = browserErrors(page);
  await page.goto(`${BASE_URL}/laws/`, { waitUntil: "networkidle" });
  await waitForRuntime(page);
  await page.evaluate(() => scrollTo({ top: 0, left: 0, behavior: "instant" }));
  const cta = await activateDisclosure(page, "keyboard");
  const authorities = {};
  for (const direction of Object.keys(AUTHORITIES)) {
    authorities[direction] = await activateKeyboardAuthority(page, direction);
  }
  assert.deepEqual(errors, [], `keyboard: browser errors: ${errors.join(" | ")}`);
  const result = { cta, authorities, authorityCount: Object.keys(authorities).length, errors, disposition: "PASS" };
  await writeJson("keyboard-five-authorities.json", result);
  await context.close();
  return result;
}

async function verifyReducedMotion(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce"
  });
  const page = await context.newPage();
  const errors = browserErrors(page);
  await page.goto(`${BASE_URL}/laws/`, { waitUntil: "networkidle" });
  await waitForRuntime(page);
  await page.evaluate(() => scrollTo({ top: 0, left: 0, behavior: "instant" }));
  const cta = await activateDisclosure(page, "touch");
  const physicalAuthority = await activateVisiblePhysically(page, "touch");
  const transitionDuration = await page.evaluate(() => {
    const light = document.querySelector(
      '[data-laws-first-rail] [data-laws-experience-active="true"] .laws-first-rail__light'
    );
    return light ? getComputedStyle(light).transitionDuration : "";
  });
  assert.ok(["0s", "0.001ms"].includes(transitionDuration),
    `Reduced-motion transition remains active: ${transitionDuration}.`);
  assert.deepEqual(errors, [], `reduced-motion: browser errors: ${errors.join(" | ")}`);
  const result = { cta, physicalAuthority, transitionDuration, errors, disposition: "PASS" };
  await writeJson("reduced-motion.json", result);
  await context.close();
  return result;
}

async function verifyStatic(browser, profile) {
  const context = await browser.newContext({
    viewport: { width: profile.width, height: profile.height },
    isMobile: profile.isMobile,
    hasTouch: profile.hasTouch,
    javaScriptEnabled: false
  });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/laws/`, { waitUntil: "load" });
  const cta = await activateDisclosure(page, profile.hasTouch ? "touch" : "pointer");
  const expectedRoutes = Object.fromEntries(Object.entries(AUTHORITIES).map(([id, value]) => [id, value.route]));
  const state = await page.evaluate(routes => {
    const rail = Array.from(document.querySelectorAll(
      "[data-laws-first-rail] [data-laws-experience-indicator]"
    ));
    const questions = Array.from(document.querySelectorAll(
      ".laws-first__question-grid [data-laws-experience-question]"
    ));
    return {
      railCount: rail.length,
      activeRailCount: rail.filter(item => item.dataset.lawsExperienceActive === "true").length,
      questionCount: questions.length,
      routes: Object.fromEntries(questions.map(item => [
        item.dataset.lawsExperienceQuestion,
        item.querySelector("a")?.getAttribute("href") || ""
      ])),
      expectedRoutes: routes,
      heroText: document.querySelector(".laws-first")?.textContent?.replace(/\s+/g, " ").trim() || "",
      overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth
    };
  }, expectedRoutes);
  assert.equal(state.railCount, 5, `${profile.name}: static rail incomplete.`);
  assert.equal(state.activeRailCount, 0, `${profile.name}: static mode invented an active authority.`);
  assert.equal(state.questionCount, 5, `${profile.name}: static question set incomplete.`);
  assert.deepEqual(state.routes, state.expectedRoutes, `${profile.name}: static entry routes changed.`);
  assert.ok(state.heroText.includes("Research comes F.I.R.S.T."), `${profile.name}: static hero missing.`);
  assert.ok(state.overflow <= 2, `${profile.name}: static overflow ${state.overflow}px.`);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, `${profile.name}-no-js-full.png`), fullPage: true });
  const result = { profile, cta, state, disposition: "PASS" };
  await writeJson(`${profile.name}-no-js.json`, result);
  await context.close();
  return result;
}

await fs.mkdir(EVIDENCE_DIR, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const profile of PROFILES) {
    receipt.profiles[profile.name] = await verifyProfile(browser, profile);
  }
  receipt.keyboardFiveAuthorityCoverage = await verifyKeyboard(browser);
  receipt.reducedMotion = await verifyReducedMotion(browser);
  receipt.staticNoJavaScript.phone = await verifyStatic(browser, PROFILES[0]);
  receipt.staticNoJavaScript.desktop = await verifyStatic(browser, PROFILES[3]);
  receipt.disposition = "PASS";
} finally {
  await browser.close();
  await writeJson("root-matrix.json", receipt);
}

console.log(JSON.stringify(receipt, null, 2));
