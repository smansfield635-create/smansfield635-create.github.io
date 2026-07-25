import fs from "node:fs/promises";
import crypto from "node:crypto";
import puppeteer from "puppeteer-core";

const OUTPUT = "cp6-interaction-execution-baseline-v2.json";
const ORIGIN = "https://smansfield635-create.github.io";
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const PROFILES = {
  DESKTOP: { width: 1440, height: 1100, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  MOBILE: { width: 430, height: 932, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
};

const CONFIG = {
  MAIN_COMPASS: {
    route: "/",
    posture: "POSITIVE_REFERENCE",
    root: "main[data-compass-root]",
    scene: "[data-compass-scene]",
    gestureSurface: "canvas[data-compass-crystals-canvas='true']",
    stateAttr: "data-compass-mode",
    selectedAttr: "data-selected-cardinal",
    selectedValue: "east",
    cardinal: "button[data-compass-cardinal][data-cardinal-id='east']",
    child: "button[data-compass-room-proxy][data-room-id='east-1']",
    childAttr: "data-selected-room",
    childValue: "east-1",
    panelAttr: "data-panel-descended",
    returnControl: "[data-compass-return-to-orbit]",
    orbitRevisionAttr: "data-orbit-revision",
    lens: "button[data-compass-lens-tab='engineering']",
    receiptSurface: "canvas[data-compass-crystals-canvas='true']",
    receiptAttr: "data-compass-crystals-receipt"
  },
  ARCHCOIN_COMPASS: {
    route: "/products/archcoin/",
    posture: "POSITIVE_REFERENCE",
    root: "main[data-archcoin-root]",
    scene: "[data-archcoin-scene]",
    gestureSurface: "canvas[data-archcoin-crystals-canvas='front']",
    stateAttr: "data-archcoin-controller-state",
    selectedAttr: "data-selected-cardinal",
    selectedValue: "north",
    cardinal: "button[data-archcoin-coin][data-cardinal-id='north']",
    child: "a[data-archcoin-room][data-room-id='contract-overview']",
    childAttr: "data-selected-room",
    childValue: "contract-overview",
    panelAttr: "data-panel-descended",
    returnControl: "[data-archcoin-return-to-orbit]",
    orbitRevisionAttr: "data-orbit-revision",
    lens: "button[data-archcoin-lens-tab='engineering']",
    receiptSurface: "main[data-archcoin-root]",
    receiptAttr: "data-archcoin-interactions-receipt"
  },
  SHOWROOM: {
    route: "/showroom/",
    posture: "POSITIVE_REFERENCE",
    root: "div[data-showroom-root]",
    scene: "[data-showroom-scene]",
    gestureSurface: "[data-showroom-scene]",
    stateAttr: "data-showroom-controller-state",
    selectedAttr: "data-showroom-active-cardinal",
    selectedValue: "north",
    cardinal: "button[data-showroom-cardinal-control][data-showroom-cardinal-id='north']",
    child: "button[data-showroom-child-control][data-showroom-child-id='north-1']",
    childAttr: "data-showroom-active-child",
    childValue: "north-1",
    panelAttr: "data-showroom-panel-descended",
    returnControl: "[data-showroom-controller-return-to-orbit]",
    orbitRevisionAttr: "data-showroom-orbit-revision"
  },
  LAWS_CHAMBER_POST_PR128: {
    route: "/laws/",
    posture: "NEGATIVE_REFERENCE",
    root: "div[data-laws-root]",
    scene: "[data-laws-scene]",
    gestureSurface: "canvas[data-laws-crystals-canvas='front']",
    stateAttr: "data-laws-controller-state",
    selectedAttr: "data-laws-active-cluster",
    selectedValue: "flow",
    cardinal: "button[data-laws-category-control][data-laws-cluster-id='flow']",
    child: "button[data-laws-law-control][data-route='/laws/categories/flow/signals/']",
    childAttr: "data-laws-selected-destination-id",
    childValue: "signals",
    routeAttr: "data-laws-selected-route",
    routeValue: "/laws/categories/flow/signals/",
    panelAttr: "data-laws-panel-descended",
    returnControl: "[data-laws-return-to-orbit]",
    orbitRevisionAttr: "data-orbit-revision",
    receiptSurface: "div[data-laws-root]",
    receiptAttr: "data-laws-interactions-receipt"
  }
};

function digest(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function launchOptions() {
  return {
    executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"]
  };
}

async function createPage(browser, profile) {
  const page = await browser.newPage();
  await page.setViewport(PROFILES[profile]);
  const telemetry = { console: [], pageErrors: [], requestFailures: [], navigations: [] };
  page.on("console", message => telemetry.console.push({ type: message.type(), text: message.text() }));
  page.on("pageerror", error => telemetry.pageErrors.push(String(error?.message || error)));
  page.on("requestfailed", request => telemetry.requestFailures.push({ url: request.url(), error: request.failure()?.errorText || "" }));
  page.on("framenavigated", frame => { if (frame === page.mainFrame()) telemetry.navigations.push(frame.url()); });
  return { page, telemetry };
}

async function navigate(page, route, scene = null) {
  const response = await page.goto(`${ORIGIN}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForNetworkIdle({ idleTime: 700, timeout: 15000 }).catch(() => {});
  await sleep(1000);
  if (scene) {
    await page.$eval(scene, element => element.scrollIntoView({ block: "center", inline: "center" })).catch(() => {});
    await sleep(700);
  }
  return { status: response?.status() ?? null, finalUrl: page.url() };
}

async function attr(page, selector, name) {
  return page.$eval(selector, (element, attrName) => element.getAttribute(attrName), name).catch(() => null);
}

async function waitAttr(page, selector, name, expected, timeout = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const value = await attr(page, selector, name);
    if (typeof expected === "function" ? expected(value) : value === expected) return value;
    await sleep(120);
  }
  return attr(page, selector, name);
}

async function state(page, config) {
  const attrs = await page.$eval(config.root, element => Object.fromEntries(Array.from(element.attributes).filter(attribute => attribute.name.startsWith("data-")).map(attribute => [attribute.name, attribute.value])));
  let receipt = null;
  if (config.receiptSurface && config.receiptAttr) {
    const raw = await attr(page, config.receiptSurface, config.receiptAttr);
    if (raw) {
      try { receipt = JSON.parse(raw); } catch { receipt = { parseFailure: true, raw }; }
    }
  }
  return { url: page.url(), attrs, receipt };
}

function addAssertion(record, id, expected, observed, pass, category = "PRODUCT_OBSERVATION") {
  record.assertions.push({ id, expected, observed, pass: Boolean(pass), category });
}

async function selectorInfo(page, selector) {
  return page.$eval(selector, element => {
    const rect = element.getBoundingClientRect();
    return {
      visible: rect.width > 0 && rect.height > 0 && getComputedStyle(element).display !== "none" && getComputedStyle(element).visibility !== "hidden",
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      text: (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 120)
    };
  });
}

async function activate(page, selector, method) {
  await page.waitForSelector(selector, { timeout: 8000 });
  await page.$eval(selector, element => element.scrollIntoView({ block: "center", inline: "center" }));
  await sleep(250);
  const info = await selectorInfo(page, selector);
  let actualMethod = method;
  if (method === "touch" && info.visible) {
    await page.touchscreen.tap(info.rect.x + info.rect.width / 2, info.rect.y + info.rect.height / 2);
  } else if (method === "pointer" && info.visible) {
    const handle = await page.$(selector);
    await handle.click({ delay: 60 });
  } else if (method === "keyboard") {
    const focused = await page.$eval(selector, element => { element.focus(); return document.activeElement === element; });
    if (focused) await page.keyboard.press("Enter");
    else { actualMethod = "semantic-click-fallback"; await page.$eval(selector, element => element.click()); }
  } else {
    actualMethod = "semantic-click-fallback";
    await page.$eval(selector, element => element.click());
  }
  await sleep(900);
  return { selector, requestedMethod: method, actualMethod, info };
}

async function activateByText(page, selector, text, method) {
  const match = await page.$$eval(selector, (elements, expectedText) => {
    const index = elements.findIndex(element => (element.textContent || "").replace(/\s+/g, " ").trim().includes(expectedText));
    return index;
  }, text);
  if (match < 0) throw new Error(`TEXT_TARGET_NOT_FOUND:${selector}:${text}`);
  const handles = await page.$$(selector);
  const handle = handles[match];
  await handle.evaluate(element => element.scrollIntoView({ block: "center", inline: "center" }));
  await sleep(250);
  const info = await handle.evaluate(element => {
    const rect = element.getBoundingClientRect();
    return { visible: rect.width > 0 && rect.height > 0, rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, text: (element.textContent || "").replace(/\s+/g, " ").trim() };
  });
  if (method === "touch" && info.visible) await page.touchscreen.tap(info.rect.x + info.rect.width / 2, info.rect.y + info.rect.height / 2);
  else if (method === "keyboard") { await handle.focus(); await page.keyboard.press("Enter"); }
  else await handle.click({ delay: 60 });
  await sleep(900);
  return { selector, matchedIndex: match, requestedMethod: method, info };
}

async function gesture(page, selector, modality, dx, durationMs) {
  await page.waitForSelector(selector, { timeout: 8000 });
  await page.$eval(selector, element => element.scrollIntoView({ block: "center", inline: "center" }));
  await sleep(300);
  const box = await page.$eval(selector, element => {
    const rect = element.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  });
  if (box.width <= 0 || box.height <= 0) throw new Error(`GESTURE_SURFACE_NOT_VISIBLE:${selector}`);
  const distance = Math.min(Math.abs(dx), Math.max(100, box.width * 0.55));
  const signed = dx < 0 ? -distance : distance;
  const startX = box.x + box.width / 2 - signed / 2;
  const endX = startX + signed;
  const y = box.y + box.height / 2;
  const steps = 10;
  if (modality === "touch") {
    const client = await page.createCDPSession();
    await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: startX, y, radiusX: 8, radiusY: 8, force: 1, id: 1 }] });
    for (let i = 1; i <= steps; i += 1) {
      await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: startX + signed * i / steps, y, radiusX: 8, radiusY: 8, force: 1, id: 1 }] });
      await sleep(Math.max(5, durationMs / steps));
    }
    await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await client.detach();
  } else {
    await page.mouse.move(startX, y);
    await page.mouse.down();
    for (let i = 1; i <= steps; i += 1) {
      await page.mouse.move(startX + signed * i / steps, y);
      await sleep(Math.max(5, durationMs / steps));
    }
    await page.mouse.up();
  }
  await sleep(1200);
  return { selector, modality, distance: signed, durationMs };
}

async function scenario(browser, benchmarkId, scenarioId, profile, execute) {
  const { page, telemetry } = await createPage(browser, profile);
  const record = { benchmarkId, scenarioId, profile, status: "PENDING", actions: [], assertions: [], telemetry };
  try {
    await execute(page, record);
    record.status = "EXECUTED";
  } catch (error) {
    record.status = "HARNESS_FAILURE";
    record.harnessFailure = String(error?.stack || error);
  } finally {
    record.finalUrl = page.url();
    await page.close();
  }
  return record;
}

async function runCompass(browser, benchmarkId, config) {
  const records = [];

  records.push(await scenario(browser, benchmarkId, "SEMANTIC_CARDINAL_CHILD_RETURN", "DESKTOP", async (page, record) => {
    record.navigation = await navigate(page, config.route, config.scene);
    record.before = await state(page, config);
    record.actions.push(await activate(page, config.cardinal, "pointer"));
    const selected = await waitAttr(page, config.root, config.selectedAttr, config.selectedValue);
    record.afterCardinal = await state(page, config);
    addAssertion(record, "CARDINAL_SELECTION_ACCEPTED", config.selectedValue, selected, selected === config.selectedValue);
    addAssertion(record, "CARDINAL_OPENS_CLUSTER", "CLUSTER_OPEN", record.afterCardinal.attrs[config.stateAttr], record.afterCardinal.attrs[config.stateAttr] === "CLUSTER_OPEN");

    record.actions.push(await activate(page, config.child, "keyboard"));
    const child = await waitAttr(page, config.root, config.childAttr, value => value === config.childValue || (config.routeAttr && String(record.afterChild?.attrs?.[config.routeAttr] || "").includes(config.routeValue)));
    record.afterChild = await state(page, config);
    const routeValue = config.routeAttr ? record.afterChild.attrs[config.routeAttr] || "" : "";
    const childAccepted = child === config.childValue || (config.routeValue && routeValue.includes(config.routeValue));
    addAssertion(record, "CHILD_SELECTION_ACCEPTED", config.childValue, { child, route: routeValue }, childAccepted);
    addAssertion(record, "PANEL_DESCENT_RECORDED", "true", record.afterChild.attrs[config.panelAttr], record.afterChild.attrs[config.panelAttr] === "true");

    record.actions.push(await activate(page, config.returnControl, "pointer"));
    await waitAttr(page, config.root, config.panelAttr, "false");
    record.afterReturn = await state(page, config);
    addAssertion(record, "RETURN_TO_ORBIT_CLEARS_PANEL", "false", record.afterReturn.attrs[config.panelAttr], record.afterReturn.attrs[config.panelAttr] === "false");
  }));

  records.push(await scenario(browser, benchmarkId, "CONTROLLED_DRAG", "DESKTOP", async (page, record) => {
    record.navigation = await navigate(page, config.route, config.scene);
    const beforeRevision = Number(await attr(page, config.root, config.orbitRevisionAttr) || 0);
    record.actions.push(await gesture(page, config.gestureSurface, "mouse", 120, 850));
    record.after = await state(page, config);
    const afterRevision = Number(record.after.attrs[config.orbitRevisionAttr] || 0);
    addAssertion(record, "CONTROLLED_DRAG_STAYS_ON_ROUTE", config.route, new URL(page.url()).pathname, new URL(page.url()).pathname === config.route);
    addAssertion(record, "CONTROLLED_DRAG_CONTROLLER_STATE", "CONSTELLATION", record.after.attrs[config.stateAttr], record.after.attrs[config.stateAttr] === "CONSTELLATION");
    addAssertion(record, "ORBIT_REVISION_NONDECREASING", `>=${beforeRevision}`, afterRevision, afterRevision >= beforeRevision);
    if (record.after.receipt) {
      const active = record.after.receipt.status === "available" && record.after.receipt.disposed !== true;
      addAssertion(record, "INTERACTION_RECEIPT_ACTIVE", "available/not-disposed", { status: record.after.receipt.status, initialized: record.after.receipt.initialized, disposed: record.after.receipt.disposed, lastAction: record.after.receipt.lastAction }, active);
    }
  }));

  records.push(await scenario(browser, benchmarkId, "QUICK_RELEASE_SWIPE_RETURN", "DESKTOP", async (page, record) => {
    record.navigation = await navigate(page, config.route, config.scene);
    record.actions.push(await activate(page, config.cardinal, "pointer"));
    await waitAttr(page, config.root, config.selectedAttr, config.selectedValue);
    record.beforeSwipe = await state(page, config);
    record.actions.push(await gesture(page, config.gestureSurface, "mouse", 320, 55));
    record.afterSwipe = await state(page, config);
    addAssertion(record, "QUICK_RELEASE_SWIPE_RETURNS_CONSTELLATION", "CONSTELLATION", record.afterSwipe.attrs[config.stateAttr], record.afterSwipe.attrs[config.stateAttr] === "CONSTELLATION");
    if (record.afterSwipe.receipt) {
      record.receiptObservation = {
        status: record.afterSwipe.receipt.status,
        initialized: record.afterSwipe.receipt.initialized,
        disposed: record.afterSwipe.receipt.disposed,
        lastGestureType: record.afterSwipe.receipt.lastGestureType,
        lastGestureDistance: record.afterSwipe.receipt.lastGestureDistance,
        lastGestureDurationMs: record.afterSwipe.receipt.lastGestureDurationMs,
        lastReleaseVelocityPxPerMs: record.afterSwipe.receipt.lastReleaseVelocityPxPerMs,
        intent: record.afterSwipe.receipt.intent,
        totalDx: record.afterSwipe.receipt.totalDx,
        lastAction: record.afterSwipe.receipt.lastAction,
        lastFailure: record.afterSwipe.receipt.lastFailure
      };
    }
  }));

  records.push(await scenario(browser, benchmarkId, "TOUCH_CARDINAL_AND_SWIPE_RETURN", "MOBILE", async (page, record) => {
    record.navigation = await navigate(page, config.route, config.scene);
    record.actions.push(await activate(page, config.cardinal, "touch"));
    const selected = await waitAttr(page, config.root, config.selectedAttr, config.selectedValue);
    record.afterCardinal = await state(page, config);
    addAssertion(record, "TOUCH_CARDINAL_SELECTION_ACCEPTED", config.selectedValue, selected, selected === config.selectedValue);
    record.actions.push(await gesture(page, config.gestureSurface, "touch", -260, 65));
    record.afterSwipe = await state(page, config);
    addAssertion(record, "TOUCH_RELEASE_SWIPE_RETURNS_CONSTELLATION", "CONSTELLATION", record.afterSwipe.attrs[config.stateAttr], record.afterSwipe.attrs[config.stateAttr] === "CONSTELLATION");
  }));

  if (config.lens) {
    records.push(await scenario(browser, benchmarkId, "LENS_KEYBOARD_ACTIVATION", "DESKTOP", async (page, record) => {
      record.navigation = await navigate(page, config.route);
      record.actions.push(await activate(page, config.lens, "keyboard"));
      const selected = await attr(page, config.lens, "aria-selected");
      addAssertion(record, "LENS_KEYBOARD_ACTIVATION_ACCEPTED", "true", selected, selected === "true");
    }));
  }
  return records;
}

async function runHomepage(browser) {
  const records = [];
  records.push(await scenario(browser, "HOMEPAGE_COMPASS", "RETIRED_COMPASS_AND_PROFILE_CONTROLS", "DESKTOP", async (page, record) => {
    record.navigation = await navigate(page, "/home/");
    const compassBehavior = await attr(page, "html", "data-compass-behavior");
    const orbitMap = await attr(page, "html", "data-orbit-map");
    addAssertion(record, "COMPASS_BEHAVIOR_RETIRED", "retired", compassBehavior, compassBehavior === "retired");
    addAssertion(record, "ORBIT_MAP_RETIRED", "retired", orbitMap, orbitMap === "retired");
    record.actions.push(await activateByText(page, "button.profile-tab", "Read the Laws", "pointer"));
    const selected = await page.$$eval("button.profile-tab", elements => elements.map(element => ({ text: (element.textContent || "").replace(/\s+/g, " ").trim(), selected: element.getAttribute("aria-selected") })));
    addAssertion(record, "PROFILE_TAB_TEXT_TARGET_ACCEPTED", "Read the Laws selected", selected, selected.some(item => item.text.includes("Read the Laws") && item.selected === "true"));
    record.actions.push(await activateByText(page, "summary", "Open the orientation profile", "keyboard"));
    const open = await page.$$eval("summary", elements => elements.some(element => (element.textContent || "").includes("Open the orientation profile") && element.parentElement?.open));
    addAssertion(record, "PROFILE_DISCLOSURE_KEYBOARD_OPEN", true, open, open === true);
  }));

  records.push(await scenario(browser, "HOMEPAGE_COMPASS", "RETURN_TO_MAIN_COMPASS", "DESKTOP", async (page, record) => {
    record.navigation = await navigate(page, "/home/");
    const navigation = page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => null);
    record.actions.push(await activateByText(page, "a.button[href='/']", "RETURN TO COMPASS", "pointer"));
    await navigation;
    await sleep(900);
    const pathname = new URL(page.url()).pathname;
    const rootPresent = Boolean(await page.$("main[data-compass-root]"));
    addAssertion(record, "RETURN_TO_COMPASS_NAVIGATES_ROOT", "/", pathname, pathname === "/");
    addAssertion(record, "RETURN_DESTINATION_HAS_MAIN_COMPASS", true, rootPresent, rootPresent);
  }));

  records.push(await scenario(browser, "HOMEPAGE_COMPASS", "MOBILE_PROFILE_TOUCH", "MOBILE", async (page, record) => {
    record.navigation = await navigate(page, "/home/");
    record.actions.push(await activateByText(page, "button.profile-tab", "See the World", "touch"));
    const selected = await page.$$eval("button.profile-tab", elements => elements.map(element => ({ text: (element.textContent || "").replace(/\s+/g, " ").trim(), selected: element.getAttribute("aria-selected") })));
    addAssertion(record, "MOBILE_PROFILE_TEXT_TARGET_ACCEPTED", "See the World selected", selected, selected.some(item => item.text.includes("See the World") && item.selected === "true"));
  }));
  return records;
}

const browser = await puppeteer.launch(launchOptions());
const scenarios = [];
try {
  scenarios.push(...await runCompass(browser, "MAIN_COMPASS", CONFIG.MAIN_COMPASS));
  scenarios.push(...await runHomepage(browser));
  scenarios.push(...await runCompass(browser, "ARCHCOIN_COMPASS", CONFIG.ARCHCOIN_COMPASS));
  scenarios.push(...await runCompass(browser, "SHOWROOM", CONFIG.SHOWROOM));
  scenarios.push(...await runCompass(browser, "LAWS_CHAMBER_POST_PR128", CONFIG.LAWS_CHAMBER_POST_PR128));
} finally {
  await browser.close();
}

const harnessFailures = scenarios.filter(item => item.status === "HARNESS_FAILURE");
const productFindings = scenarios.flatMap(item => item.assertions.filter(assertion => !assertion.pass && assertion.category === "PRODUCT_OBSERVATION").map(assertion => ({ benchmarkId: item.benchmarkId, scenarioId: item.scenarioId, ...assertion })));
const posture = {
  MAIN_COMPASS: "POSITIVE_REFERENCE",
  HOMEPAGE_COMPASS: "POSITIVE_NON_COMPASS_SHELL_REFERENCE",
  ARCHCOIN_COMPASS: "POSITIVE_REFERENCE",
  SHOWROOM: "POSITIVE_REFERENCE",
  LAWS_CHAMBER_POST_PR128: "NEGATIVE_REFERENCE"
};
const benchmarkSummaries = Object.keys(posture).map(benchmarkId => {
  const group = scenarios.filter(item => item.benchmarkId === benchmarkId);
  const findings = productFindings.filter(item => item.benchmarkId === benchmarkId);
  return {
    benchmarkId,
    referencePosture: posture[benchmarkId],
    scenarioCount: group.length,
    executedScenarioCount: group.filter(item => item.status === "EXECUTED").length,
    harnessFailureCount: group.filter(item => item.status === "HARNESS_FAILURE").length,
    productFindingCount: findings.length,
    observedPosture: findings.length === 0 ? "OBSERVED_INTERACTION_PASS" : posture[benchmarkId] === "NEGATIVE_REFERENCE" ? "BOUNDED_NEGATIVE_REFERENCE_FINDINGS" : "POSITIVE_REFERENCE_FINDINGS_PRESENT"
  };
});

const artifact = {
  artifactId: "METAVERSE_3D_GOVERNED_BENCHMARK_CORPUS_INTERACTION_EXECUTION_BASELINE_v2",
  checkpoint: "CP6",
  status: harnessFailures.length === 0 ? "PASS_INTERACTION_EXECUTION_BASELINE" : "FAIL_INTERACTION_EXECUTION_HARNESS",
  generatedAt: new Date().toISOString(),
  repository: "smansfield635-create/smansfield635-create.github.io",
  baselineCommit: "ba0f3ecf3087f91d2cb3ff6aa4dd3c040107712e",
  cp5InventoryCommit: "9707c18a86055f3f8bf2676b20e20e16bb6bb5be",
  correctionOf: {
    workflowRunId: "30143757536",
    reason: "AUTHORITATIVE_SEMANTIC_TARGETS_TEXT_STABLE_HOMEPAGE_TARGETS_AND_GESTURE_SURFACE_CORRECTION"
  },
  assertions: {
    allFiveRoutesExecuted: benchmarkSummaries.every(summary => summary.executedScenarioCount > 0),
    scenarioCount: scenarios.length,
    executedScenarioCount: scenarios.filter(item => item.status === "EXECUTED").length,
    harnessFailureCount: harnessFailures.length,
    productFindingCount: productFindings.length,
    positiveReferenceFindingCount: productFindings.filter(item => item.benchmarkId !== "LAWS_CHAMBER_POST_PR128").length,
    negativeReferenceFindingCount: productFindings.filter(item => item.benchmarkId === "LAWS_CHAMBER_POST_PR128").length,
    productFilesChanged: 0,
    lawsRepairStarted: false,
    mainChanged: false,
    mergeAuthority: "NONE"
  },
  benchmarkSummaries,
  productFindings,
  harnessFailures: harnessFailures.map(({ benchmarkId, scenarioId, profile, harnessFailure }) => ({ benchmarkId, scenarioId, profile, harnessFailure })),
  scenarios,
  stoppingBoundary: {
    proves: ["DEPLOYED_INPUT_EVENT_DELIVERY", "ROUTE_SPECIFIC_CONTROLLER_STATE_OBSERVATION", "POINTER_KEYBOARD_TOUCH_AND_RELEASE_SWIPE_BASELINE", "POSITIVE_AND_NEGATIVE_REFERENCE_FINDING_CLASSIFICATION"],
    doesNotProve: ["UNIVERSAL_INTERACTION_CORRECTNESS", "VISUAL_CORRECTNESS", "PERFORMANCE_ACCEPTANCE", "LAWS_REPAIR_CORRECTNESS"],
    authorizes: []
  },
  nextCheckpoint: "CP7_VISUAL_AND_SPATIAL_REALIZATION_BASELINE"
};
artifact.interactionBaselineDigest = digest({ benchmarkSummaries, productFindings, scenarios: scenarios.map(({ telemetry, ...rest }) => rest) });
await fs.writeFile(OUTPUT, JSON.stringify(artifact, null, 2));
console.log(`CP6_V2_STATUS=${artifact.status}`);
console.log(`CP6_V2_SCENARIO_COUNT=${scenarios.length}`);
console.log(`CP6_V2_HARNESS_FAILURE_COUNT=${harnessFailures.length}`);
console.log(`CP6_V2_PRODUCT_FINDING_COUNT=${productFindings.length}`);
console.log(`CP6_V2_DIGEST=${artifact.interactionBaselineDigest}`);
if (harnessFailures.length > 0) process.exitCode = 1;
