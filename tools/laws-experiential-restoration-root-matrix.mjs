import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const CONTRACT = "LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_ROOT_MATRIX_v1";
const ROUTE = "/laws/";
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
  route: ROUTE,
  generatedAt: new Date().toISOString(),
  profiles: {},
  keyboard: null,
  reducedMotion: null,
  staticNoJavaScript: {},
  disposition: "IN_PROGRESS"
};

async function writeJson(name, value) {
  await fs.mkdir(EVIDENCE_DIR, { recursive: true });
  await fs.writeFile(path.join(EVIDENCE_DIR, name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function collectErrors(page) {
  const errors = [];
  page.on("pageerror", error => errors.push(`pageerror: ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error" && !message.text().includes("404")) {
      errors.push(`console: ${message.text()}`);
    }
  });
  return errors;
}

async function waitForRuntime(page) {
  await page.waitForFunction(() => {
    const root = document.querySelector("[data-laws-root]");
    return Boolean(globalThis.DGB_LAWS_CONTROLLER && globalThis.DGB_LAWS_EXPERIENCE) &&
      root?.dataset.lawsControllerStatus === "ready";
  }, null, { timeout: 30000 });

  await page.evaluate(() => {
    document.querySelector("[data-laws-compass-primary]")?.scrollIntoView({
      block: "center",
      inline: "nearest",
      behavior: "instant"
    });
    return globalThis.DGB_LAWS_EXPERIENCE?.requestCompassRuntimePreload?.() ?? false;
  });

  await page.waitForFunction(() =>
    document.querySelector("[data-laws-root]")?.dataset.lawsInteractionsStatus === "ready",
    null,
    { timeout: 30000 }
  );
  await page.evaluate(() => scrollTo({ top: 0, left: 0, behavior: "instant" }));
}

function disclosure(page) {
  return page.locator(".laws-first > details[data-laws-first-disclosure]");
}

async function activate(page, locator, input) {
  if (input === "keyboard") {
    await locator.focus();
    assert.equal(await locator.evaluate(node => document.activeElement === node), true,
      "Keyboard focus did not reach the requested control.");
    await locator.press("Enter");
  } else if (input === "touch") {
    await locator.tap();
  } else {
    await locator.click();
  }
}

async function activateDisclosure(page, input) {
  const node = disclosure(page);
  assert.equal(await node.count(), 1, "Expected one rendered F.I.R.S.T. disclosure in the hero.");
  const summary = node.locator(":scope > summary");
  if (await node.evaluate(element => element.open)) {
    await summary.click();
    await page.waitForFunction(() => {
      const element = document.querySelector(".laws-first > details[data-laws-first-disclosure]");
      return Boolean(element && !element.open);
    });
  }
  await activate(page, summary, input);
  await page.waitForFunction(() =>
    Boolean(document.querySelector(".laws-first > details[data-laws-first-disclosure]")?.open)
  );
  await page.waitForTimeout(160);

  const snapshot = await page.evaluate(maxGap => {
    const details = document.querySelector(".laws-first > details[data-laws-first-disclosure]");
    const summary = details?.querySelector(":scope > summary");
    const body = details?.querySelector(":scope > .laws-first__disclosure-body");
    const summaryRect = summary?.getBoundingClientRect();
    const bodyRect = body?.getBoundingClientRect();
    const style = body ? getComputedStyle(body) : null;
    const gap = summaryRect && bodyRect ? bodyRect.top - summaryRect.bottom : null;
    const intersects = Boolean(bodyRect && bodyRect.bottom > 0 && bodyRect.top < innerHeight);
    return {
      open: Boolean(details?.open),
      summaryBottom: summaryRect?.bottom ?? null,
      bodyTop: bodyRect?.top ?? null,
      bodyBottom: bodyRect?.bottom ?? null,
      bodyPosition: style?.position || "",
      gap,
      intersects,
      immediateVisibleConsequence: Boolean(intersects && gap !== null && gap <= maxGap),
      scrollY
    };
  }, MAX_CTA_GAP);

  assert.equal(snapshot.open, true, "F.I.R.S.T. disclosure did not open.");
  assert.equal(snapshot.immediateVisibleConsequence, true,
    `CTA consequence displaced: gap=${snapshot.gap}, intersects=${snapshot.intersects}.`);
  return snapshot;
}

async function returnToConstellation(page) {
  const state = await page.locator("[data-laws-root]").getAttribute("data-laws-controller-state");
  if (state === "CONSTELLATION") return;
  const accepted = await page.evaluate(() =>
    globalThis.DGB_LAWS_CONTROLLER?.requestReturnToConstellation?.({ scrollToScene: false }) ?? false
  );
  assert.equal(accepted, true, `Return to constellation rejected from ${state}.`);
  await page.waitForFunction(() =>
    document.querySelector("[data-laws-root]")?.dataset.lawsControllerState === "CONSTELLATION"
  );
}

async function activateAuthority(page, direction, input) {
  await returnToConstellation(page);
  const control = page.locator(`[data-laws-category][data-direction="${direction}"]`).first();
  assert.equal(await control.count(), 1, `Authority control missing: ${direction}.`);
  await activate(page, control, input);

  await page.waitForFunction(nextDirection => {
    const root = document.querySelector("[data-laws-root]");
    return root?.dataset.lawsControllerState === "CLUSTER_OPEN" &&
      document.documentElement.dataset.lawsExperienceDirection === nextDirection;
  }, direction, { timeout: 15000 });
  await page.waitForTimeout(260);

  const expected = AUTHORITIES[direction];
  const snapshot = await page.evaluate(({ nextDirection, expectedTitle, expectedRoute }) => {
    const root = document.querySelector("[data-laws-root]");
    let frame = null;
    try { frame = globalThis.DGB_LAWS_CONTROLLER?.getFrame?.() || null; } catch (_) { frame = null; }
    const rail = Array.from(document.querySelectorAll(
      "[data-laws-first-rail] [data-laws-experience-indicator]"
    ));
    const activeRail = rail.filter(item => item.dataset.lawsExperienceActive === "true");
    const activeItem = activeRail[0] || null;
    const light = activeItem?.querySelector(".laws-first-rail__light") || null;
    const question = document.querySelector(
      `.laws-first__question-grid [data-laws-experience-question="${nextDirection}"]`
    );
    const html = document.documentElement;
    const body = document.body;
    return {
      direction: html.dataset.lawsExperienceDirection || "",
      controllerState: root?.dataset.lawsControllerState || "",
      rootActiveDirection: root?.dataset.lawsActiveDirection || "",
      rootActiveCategory: root?.dataset.lawsActiveCategory || "",
      orbitFocus: root?.dataset.orbitFocus || "",
      frameDirection: frame?.compass?.selectedDirection || "",
      railCount: rail.length,
      activeRailCount: activeRail.length,
      activeRailDirection: activeItem?.dataset.lawsExperienceIndicator || "",
      activeRailCurrent: activeItem?.getAttribute("aria-current") || "",
      lightBackground: light ? getComputedStyle(light).backgroundColor : "",
      lightShadow: light ? getComputedStyle(light).boxShadow : "",
      questionActive: question?.dataset.lawsExperienceActive || "",
      entryRoute: question?.querySelector("a")?.getAttribute("href") || "",
      expectedRoute,
      speakerTitle: document.querySelector("[data-laws-experience-speaker-title]")?.textContent?.trim() || "",
      expectedTitle,
      speakerBody: document.querySelector("[data-laws-experience-speaker-body]")?.textContent?.trim() || "",
      overflow: Math.max(html.scrollWidth, body.scrollWidth) - html.clientWidth
    };
  }, { nextDirection: direction, expectedTitle: expected.title, expectedRoute: expected.route });

  assert.equal(snapshot.direction, direction, `${direction}: presentation direction mismatch.`);
  assert.equal(snapshot.controllerState, "CLUSTER_OPEN", `${direction}: controller state mismatch.`);
  assert.ok(
    snapshot.frameDirection === direction ||
    snapshot.orbitFocus === direction ||
    snapshot.rootActiveCategory === direction ||
    snapshot.rootActiveDirection === direction,
    `${direction}: celestial/controller state does not correspond.`
  );
  assert.equal(snapshot.railCount, 5, `${direction}: five-light rail incomplete.`);
  assert.equal(snapshot.activeRailCount, 1, `${direction}: exactly one rail light must be active.`);
  assert.equal(snapshot.activeRailDirection, direction, `${direction}: active rail mismatch.`);
  assert.equal(snapshot.activeRailCurrent, "true", `${direction}: rail aria-current mismatch.`);
  assert.equal(snapshot.lightBackground, "rgb(121, 234, 255)", `${direction}: cyan active light missing.`);
  assert.notEqual(snapshot.lightShadow, "none", `${direction}: active light glow missing.`);
  assert.equal(snapshot.questionActive, "true", `${direction}: active question mismatch.`);
  assert.equal(snapshot.entryRoute, expected.route, `${direction}: entry route mismatch.`);
  assert.equal(snapshot.speakerTitle, expected.title, `${direction}: active question title mismatch.`);
  assert.ok(snapshot.speakerBody.length > 30, `${direction}: active explanation missing.`);
  assert.ok(snapshot.overflow <= 2, `${direction}: horizontal overflow ${snapshot.overflow}px.`);
  return snapshot;
}

async function verifyProfile(browser, profile) {
  const context = await browser.newContext({
    viewport: { width: profile.width, height: profile.height },
    isMobile: profile.isMobile,
    hasTouch: profile.hasTouch,
    deviceScaleFactor: 1
  });
  const page = await context.newPage();
  const errors = collectErrors(page);
  await page.goto(`${BASE_URL}${ROUTE}`, { waitUntil: "networkidle" });
  await waitForRuntime(page);
  const cta = await activateDisclosure(page, profile.input);
  const authorities = {};
  for (const direction of Object.keys(AUTHORITIES)) {
    authorities[direction] = await activateAuthority(page, direction, profile.input);
  }
  await page.screenshot({ path: path.join(EVIDENCE_DIR, `${profile.name}-full.png`), fullPage: true });
  assert.deepEqual(errors, [], `${profile.name}: browser errors: ${errors.join(" | ")}`);
  const result = { profile, cta, authorities, errors, disposition: "PASS" };
  await writeJson(`${profile.name}.json`, result);
  await context.close();
  return result;
}

async function verifyKeyboard(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = collectErrors(page);
  await page.goto(`${BASE_URL}${ROUTE}`, { waitUntil: "networkidle" });
  await waitForRuntime(page);
  const cta = await activateDisclosure(page, "keyboard");
  const authorities = {};
  for (const direction of Object.keys(AUTHORITIES)) {
    authorities[direction] = await activateAuthority(page, direction, "keyboard");
  }
  assert.deepEqual(errors, [], `keyboard: browser errors: ${errors.join(" | ")}`);
  const result = { cta, authorities, errors, disposition: "PASS" };
  await writeJson("keyboard.json", result);
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
  const errors = collectErrors(page);
  await page.goto(`${BASE_URL}${ROUTE}`, { waitUntil: "networkidle" });
  await waitForRuntime(page);
  const cta = await activateDisclosure(page, "touch");
  const selection = await activateAuthority(page, "structure", "touch");
  const transition = await page.evaluate(() => {
    const light = document.querySelector(
      '[data-laws-first-rail] [data-laws-experience-active="true"] .laws-first-rail__light'
    );
    return light ? getComputedStyle(light).transitionDuration : "";
  });
  assert.ok(transition === "0s" || transition === "0.001ms",
    `Reduced-motion transition remains active: ${transition}.`);
  assert.deepEqual(errors, [], `reduced-motion: browser errors: ${errors.join(" | ")}`);
  const result = { cta, selection, transition, errors, disposition: "PASS" };
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
  await page.goto(`${BASE_URL}${ROUTE}`, { waitUntil: "load" });
  const cta = await activateDisclosure(page, profile.hasTouch ? "touch" : "pointer");
  const expectedRoutes = Object.fromEntries(
    Object.entries(AUTHORITIES).map(([key, value]) => [key, value.route])
  );
  const snapshot = await page.evaluate(routes => {
    const rail = Array.from(document.querySelectorAll(
      "[data-laws-first-rail] [data-laws-experience-indicator]"
    ));
    const questions = Array.from(document.querySelectorAll(
      ".laws-first__question-grid [data-laws-experience-question]"
    ));
    const html = document.documentElement;
    const body = document.body;
    return {
      railCount: rail.length,
      activeRailCount: rail.filter(item => item.dataset.lawsExperienceActive === "true").length,
      questionCount: questions.length,
      entryRoutes: Object.fromEntries(questions.map(item => [
        item.dataset.lawsExperienceQuestion,
        item.querySelector("a")?.getAttribute("href") || ""
      ])),
      expectedRoutes: routes,
      heroText: document.querySelector(".laws-first")?.textContent?.replace(/\s+/g, " ").trim() || "",
      overflow: Math.max(html.scrollWidth, body.scrollWidth) - html.clientWidth
    };
  }, expectedRoutes);

  assert.equal(snapshot.railCount, 5, `${profile.name}: no-JS rail incomplete.`);
  assert.equal(snapshot.activeRailCount, 0, `${profile.name}: no-JS invented active state.`);
  assert.equal(snapshot.questionCount, 5, `${profile.name}: no-JS question set incomplete.`);
  assert.deepEqual(snapshot.entryRoutes, snapshot.expectedRoutes, `${profile.name}: no-JS routes changed.`);
  assert.ok(snapshot.heroText.includes("Research comes F.I.R.S.T."), `${profile.name}: no-JS hero missing.`);
  assert.ok(snapshot.overflow <= 2, `${profile.name}: no-JS horizontal overflow ${snapshot.overflow}px.`);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, `${profile.name}-no-js-full.png`), fullPage: true });
  const result = { profile, cta, snapshot, disposition: "PASS" };
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
  receipt.keyboard = await verifyKeyboard(browser);
  receipt.reducedMotion = await verifyReducedMotion(browser);
  receipt.staticNoJavaScript.phone = await verifyStatic(browser, PROFILES[0]);
  receipt.staticNoJavaScript.desktop = await verifyStatic(browser, PROFILES[3]);
  receipt.disposition = "PASS";
} finally {
  await browser.close();
}

await writeJson("root-matrix.json", receipt);
console.log(JSON.stringify(receipt, null, 2));
