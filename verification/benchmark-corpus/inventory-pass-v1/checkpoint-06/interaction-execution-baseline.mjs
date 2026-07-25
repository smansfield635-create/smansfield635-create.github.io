import fs from "node:fs/promises";
import crypto from "node:crypto";
import puppeteer from "puppeteer-core";

const OUTPUT = "cp6-interaction-execution-baseline.json";
const ORIGIN = "https://smansfield635-create.github.io";
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const PROFILES = Object.freeze({
  DESKTOP: Object.freeze({ width: 1440, height: 1100, deviceScaleFactor: 1, isMobile: false, hasTouch: false }),
  MOBILE: Object.freeze({ width: 430, height: 932, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
});

const ROUTES = Object.freeze({
  MAIN_COMPASS: Object.freeze({
    route: "/",
    posture: "POSITIVE_REFERENCE",
    root: "main[data-compass-root]",
    scene: "[data-compass-scene]",
    stateAttr: "data-compass-mode",
    cardinal: "button[data-compass-cardinal][data-cardinal-id='east']",
    selectedCardinalAttr: "data-selected-cardinal",
    selectedCardinalValue: "east",
    room: "button[data-compass-room-proxy][data-room-id='east-1']",
    selectedRoomAttr: "data-selected-room",
    selectedRoomValue: "east-1",
    panelAttr: "data-panel-descended",
    returnControl: "[data-compass-return-to-orbit]",
    lens: "button[data-compass-lens-tab='engineering']",
    orbitRevisionAttr: "data-orbit-revision"
  }),
  HOMEPAGE_COMPASS: Object.freeze({
    route: "/home/",
    posture: "POSITIVE_NON_COMPASS_SHELL_REFERENCE",
    root: "html[data-compass-behavior='retired'][data-orbit-map='retired']"
  }),
  ARCHCOIN_COMPASS: Object.freeze({
    route: "/products/archcoin/",
    posture: "POSITIVE_REFERENCE",
    root: "main[data-archcoin-root]",
    scene: "[data-archcoin-scene]",
    stateAttr: "data-archcoin-controller-state",
    cardinal: "button[data-cardinal-id='north']",
    selectedCardinalAttr: "data-selected-cardinal",
    selectedCardinalValue: "north",
    room: "a[data-archcoin-room][data-room-id='contract-overview']",
    selectedRoomAttr: "data-selected-room",
    selectedRoomValue: "contract-overview",
    panelAttr: "data-panel-descended",
    returnControl: "[data-archcoin-return-to-orbit]",
    lens: "button[data-archcoin-lens-tab='engineering']",
    orbitRevisionAttr: "data-orbit-revision"
  }),
  SHOWROOM: Object.freeze({
    route: "/showroom/",
    posture: "POSITIVE_REFERENCE",
    root: "div[data-showroom-root]",
    scene: "[data-showroom-scene]",
    stateAttr: "data-showroom-controller-state",
    cardinal: "button[data-showroom-projected-cardinal-label='north']",
    selectedCardinalAttr: "data-showroom-active-cardinal",
    selectedCardinalValue: "north",
    room: "button[data-showroom-child-control][data-showroom-child-id='north-1']",
    selectedRoomAttr: "data-showroom-active-child",
    selectedRoomValue: "north-1",
    panelAttr: "data-showroom-panel-descended",
    returnControl: "[data-showroom-controller-return-to-orbit]",
    orbitRevisionAttr: "data-showroom-orbit-revision"
  }),
  LAWS_CHAMBER_POST_PR128: Object.freeze({
    route: "/laws/",
    posture: "NEGATIVE_REFERENCE",
    root: "div[data-laws-root]",
    scene: "[data-laws-scene]",
    stateAttr: "data-laws-controller-state",
    cardinal: "button[data-laws-projected-category-label='flow']",
    selectedCardinalAttr: "data-laws-active-cluster",
    selectedCardinalValue: "flow",
    room: "button[data-laws-law-control][data-route='/laws/categories/flow/signals/']",
    selectedRoomAttr: "data-laws-selected-destination-id",
    selectedRoomValue: "signals",
    selectedRouteAttr: "data-laws-selected-route",
    selectedRouteContains: "/laws/categories/flow/signals/",
    panelAttr: "data-laws-panel-descended",
    returnControl: "[data-laws-return-to-orbit]",
    orbitRevisionAttr: "data-orbit-revision"
  })
});

function launchOptions() {
  return {
    executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--window-size=1440,1100"
    ]
  };
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
  }
  return value;
}

function digest(value) {
  return crypto.createHash("sha256").update(JSON.stringify(stable(value))).digest("hex");
}

async function newPage(browser, profileName) {
  const page = await browser.newPage();
  await page.setViewport(PROFILES[profileName]);
  const telemetry = { console: [], pageErrors: [], requestFailures: [], navigations: [] };
  page.on("console", message => telemetry.console.push({ type: message.type(), text: message.text() }));
  page.on("pageerror", error => telemetry.pageErrors.push(String(error?.message || error)));
  page.on("requestfailed", request => telemetry.requestFailures.push({ url: request.url(), error: request.failure()?.errorText || "" }));
  page.on("framenavigated", frame => { if (frame === page.mainFrame()) telemetry.navigations.push(frame.url()); });
  return { page, telemetry };
}

async function settle(page, sceneSelector = null) {
  await page.waitForNetworkIdle({ idleTime: 700, timeout: 15000 }).catch(() => {});
  await sleep(900);
  if (sceneSelector) {
    await page.$eval(sceneSelector, element => element.scrollIntoView({ block: "center", inline: "center" })).catch(() => {});
    await sleep(700);
  }
}

async function navigate(page, route, sceneSelector = null) {
  const response = await page.goto(`${ORIGIN}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await settle(page, sceneSelector);
  return { status: response?.status() ?? null, finalUrl: page.url() };
}

async function snapshot(page, rootSelector) {
  return page.evaluate(selector => {
    const root = document.querySelector(selector);
    const attrs = root
      ? Object.fromEntries(Array.from(root.attributes).filter(attribute => attribute.name.startsWith("data-")).map(attribute => [attribute.name, attribute.value]))
      : null;
    const globals = {};
    for (const key of Object.keys(globalThis).filter(key => /(CONTROLLER|INTERACTIONS).*RECEIPT$/i.test(key)).sort()) {
      try {
        const value = globalThis[key];
        globals[key] = value == null ? value : JSON.parse(JSON.stringify(value));
      } catch {
        globals[key] = "UNSERIALIZABLE";
      }
    }
    return {
      url: location.href,
      rootPresent: Boolean(root),
      attrs,
      activeElement: document.activeElement ? {
        tag: document.activeElement.tagName.toLowerCase(),
        text: (document.activeElement.textContent || "").replace(/\s+/g, " ").trim().slice(0, 120)
      } : null,
      globals
    };
  }, rootSelector);
}

async function attr(page, rootSelector, name) {
  return page.$eval(rootSelector, (element, attrName) => element.getAttribute(attrName), name).catch(() => null);
}

async function waitAttr(page, rootSelector, name, predicate, timeout = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const value = await attr(page, rootSelector, name);
    if (predicate(value)) return value;
    await sleep(120);
  }
  return attr(page, rootSelector, name);
}

async function selectorInfo(page, selector) {
  return page.$eval(selector, element => {
    const rect = element.getBoundingClientRect();
    return {
      tag: element.tagName.toLowerCase(),
      text: (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 120),
      disabled: Boolean(element.disabled || element.getAttribute("aria-disabled") === "true"),
      visible: rect.width > 0 && rect.height > 0 && getComputedStyle(element).display !== "none" && getComputedStyle(element).visibility !== "hidden",
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
    };
  });
}

async function activate(page, selector, requestedMethod = "pointer") {
  await page.waitForSelector(selector, { timeout: 8000 });
  await page.$eval(selector, element => element.scrollIntoView({ block: "center", inline: "center" }));
  await sleep(250);
  const info = await selectorInfo(page, selector);
  let actualMethod = requestedMethod;
  if (requestedMethod === "touch" && info.visible) {
    const x = info.rect.x + info.rect.width / 2;
    const y = info.rect.y + info.rect.height / 2;
    await page.touchscreen.tap(x, y);
  } else if (requestedMethod === "pointer" && info.visible) {
    const handle = await page.$(selector);
    await handle.click({ delay: 70 });
  } else if (requestedMethod === "keyboard") {
    const focused = await page.$eval(selector, element => { element.focus(); return document.activeElement === element; });
    if (focused) await page.keyboard.press("Enter");
    else {
      actualMethod = "semantic-dom-activation-fallback";
      await page.$eval(selector, element => element.click());
    }
  } else {
    actualMethod = "semantic-dom-activation-fallback";
    await page.$eval(selector, element => element.click());
  }
  await sleep(900);
  return { selector, requestedMethod, actualMethod, info };
}

async function activateNth(page, selector, index, requestedMethod = "pointer") {
  const count = await page.$$eval(selector, elements => elements.length);
  if (count <= index) throw new Error(`SELECTOR_INDEX_UNAVAILABLE:${selector}:${index}:${count}`);
  const derived = `${selector}:nth-of-type(${index + 1})`;
  const handles = await page.$$(selector);
  const handle = handles[index];
  await handle.evaluate(element => element.scrollIntoView({ block: "center", inline: "center" }));
  await sleep(250);
  const info = await handle.evaluate(element => {
    const rect = element.getBoundingClientRect();
    return { visible: rect.width > 0 && rect.height > 0, rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, text: (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 120) };
  });
  let actualMethod = requestedMethod;
  if (requestedMethod === "touch" && info.visible) {
    await page.touchscreen.tap(info.rect.x + info.rect.width / 2, info.rect.y + info.rect.height / 2);
  } else if (requestedMethod === "pointer" && info.visible) {
    await handle.click({ delay: 70 });
  } else {
    const focused = await handle.evaluate(element => { element.focus(); return document.activeElement === element; });
    if (focused) await page.keyboard.press("Enter");
    else { actualMethod = "semantic-dom-activation-fallback"; await handle.evaluate(element => element.click()); }
  }
  await sleep(700);
  return { selector: derived, requestedMethod, actualMethod, info };
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
  const distance = Math.min(Math.abs(dx), Math.max(90, box.width * 0.45));
  const signedDistance = dx < 0 ? -distance : distance;
  const startX = box.x + box.width / 2 - signedDistance / 2;
  const endX = startX + signedDistance;
  const y = box.y + box.height / 2;
  const steps = 8;
  if (modality === "touch") {
    const client = await page.createCDPSession();
    await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: startX, y, radiusX: 8, radiusY: 8, force: 1, id: 1 }] });
    for (let index = 1; index <= steps; index += 1) {
      const x = startX + (signedDistance * index / steps);
      await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y, radiusX: 8, radiusY: 8, force: 1, id: 1 }] });
      await sleep(Math.max(8, durationMs / steps));
    }
    await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await client.detach();
  } else {
    await page.mouse.move(startX, y);
    await page.mouse.down();
    for (let index = 1; index <= steps; index += 1) {
      await page.mouse.move(startX + (signedDistance * index / steps), y);
      await sleep(Math.max(8, durationMs / steps));
    }
    await page.mouse.up();
  }
  await sleep(1100);
  return { selector, modality, startX, endX, y, distance: signedDistance, durationMs };
}

function assertion(list, id, expected, observed, pass, severity = "PRODUCT_OBSERVATION") {
  list.push({ id, expected, observed, pass: Boolean(pass), severity });
}

async function withScenario(browser, benchmarkId, scenarioId, profileName, execute) {
  const { page, telemetry } = await newPage(browser, profileName);
  const record = { benchmarkId, scenarioId, profile: profileName, status: "PENDING", actions: [], assertions: [], telemetry };
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

async function compassScenarios(browser, benchmarkId, config) {
  const records = [];

  records.push(await withScenario(browser, benchmarkId, "DESKTOP_CARDINAL_ROOM_RETURN", "DESKTOP", async (page, record) => {
    record.navigation = await navigate(page, config.route, config.scene);
    record.before = await snapshot(page, config.root);
    assertion(record.assertions, "INITIAL_ROOT_PRESENT", true, record.before.rootPresent, record.before.rootPresent, "HARNESS_BOUNDARY");
    record.actions.push(await activate(page, config.cardinal, "pointer"));
    const cardinalValue = await waitAttr(page, config.root, config.selectedCardinalAttr, value => value === config.selectedCardinalValue);
    record.afterCardinal = await snapshot(page, config.root);
    assertion(record.assertions, "CARDINAL_SELECTION_ACCEPTED", config.selectedCardinalValue, cardinalValue, cardinalValue === config.selectedCardinalValue);
    assertion(record.assertions, "CARDINAL_TRANSITIONS_OUT_OF_CONSTELLATION", "NON_CONSTELLATION", record.afterCardinal.attrs?.[config.stateAttr] || null, record.afterCardinal.attrs?.[config.stateAttr] !== "CONSTELLATION");

    record.actions.push(await activate(page, config.room, "keyboard"));
    const roomValue = await waitAttr(page, config.root, config.selectedRoomAttr, value => value === config.selectedRoomValue);
    record.afterRoom = await snapshot(page, config.root);
    const routeValue = config.selectedRouteAttr ? record.afterRoom.attrs?.[config.selectedRouteAttr] || "" : "";
    const roomAccepted = roomValue === config.selectedRoomValue || (config.selectedRouteContains && routeValue.includes(config.selectedRouteContains));
    assertion(record.assertions, "ROOM_OR_LAW_SELECTION_ACCEPTED", config.selectedRoomValue, { selected: roomValue, route: routeValue }, roomAccepted);
    assertion(record.assertions, "PANEL_DESCENT_RECORDED", "true", record.afterRoom.attrs?.[config.panelAttr] || null, record.afterRoom.attrs?.[config.panelAttr] === "true");

    if (record.afterRoom.rootPresent && page.url().includes("diamondgatebridge.com" + config.route)) {
      record.actions.push(await activate(page, config.returnControl, "pointer"));
      await waitAttr(page, config.root, config.panelAttr, value => value === "false");
      record.afterReturn = await snapshot(page, config.root);
      assertion(record.assertions, "RETURN_TO_ORBIT_CLEARS_PANEL_DESCENT", "false", record.afterReturn.attrs?.[config.panelAttr] || null, record.afterReturn.attrs?.[config.panelAttr] === "false");
    } else {
      assertion(record.assertions, "SELECTION_REMAINS_ON_BENCHMARK_ROUTE", config.route, page.url(), false);
    }
  }));

  records.push(await withScenario(browser, benchmarkId, "DESKTOP_CONSTELLATION_CONTROLLED_DRAG", "DESKTOP", async (page, record) => {
    record.navigation = await navigate(page, config.route, config.scene);
    const beforeRevision = Number(await attr(page, config.root, config.orbitRevisionAttr) || 0);
    record.actions.push(await gesture(page, config.scene, "mouse", 105, 720));
    const afterRevision = Number(await attr(page, config.root, config.orbitRevisionAttr) || 0);
    record.after = await snapshot(page, config.root);
    assertion(record.assertions, "CONTROLLED_DRAG_EXECUTED_WITHOUT_NAVIGATION", config.route, new URL(page.url()).pathname, new URL(page.url()).pathname === config.route);
    assertion(record.assertions, "CONTROLLED_DRAG_PRESERVES_CONSTELLATION_STATE", "CONSTELLATION", record.after.attrs?.[config.stateAttr] || null, record.after.attrs?.[config.stateAttr] === "CONSTELLATION");
    assertion(record.assertions, "ORBIT_REVISION_NONDECREASING", `>=${beforeRevision}`, afterRevision, afterRevision >= beforeRevision);
  }));

  records.push(await withScenario(browser, benchmarkId, "DESKTOP_CLUSTER_RELEASE_SWIPE_RETURN", "DESKTOP", async (page, record) => {
    record.navigation = await navigate(page, config.route, config.scene);
    record.actions.push(await activate(page, config.cardinal, "pointer"));
    await waitAttr(page, config.root, config.selectedCardinalAttr, value => value === config.selectedCardinalValue);
    record.beforeSwipe = await snapshot(page, config.root);
    record.actions.push(await gesture(page, config.scene, "mouse", 280, 70));
    record.afterSwipe = await snapshot(page, config.root);
    assertion(record.assertions, "QUICK_RELEASE_SWIPE_EXECUTED", true, true, true, "HARNESS_BOUNDARY");
    assertion(record.assertions, "QUICK_RELEASE_SWIPE_RETURNS_CONSTELLATION", "CONSTELLATION", record.afterSwipe.attrs?.[config.stateAttr] || null, record.afterSwipe.attrs?.[config.stateAttr] === "CONSTELLATION");
  }));

  records.push(await withScenario(browser, benchmarkId, "MOBILE_TOUCH_CARDINAL_AND_SWIPE_RETURN", "MOBILE", async (page, record) => {
    record.navigation = await navigate(page, config.route, config.scene);
    record.actions.push(await activate(page, config.cardinal, "touch"));
    const cardinalValue = await waitAttr(page, config.root, config.selectedCardinalAttr, value => value === config.selectedCardinalValue);
    record.afterCardinal = await snapshot(page, config.root);
    assertion(record.assertions, "TOUCH_CARDINAL_SELECTION_ACCEPTED", config.selectedCardinalValue, cardinalValue, cardinalValue === config.selectedCardinalValue);
    record.actions.push(await gesture(page, config.scene, "touch", -260, 80));
    record.afterSwipe = await snapshot(page, config.root);
    assertion(record.assertions, "TOUCH_RELEASE_SWIPE_RETURNS_CONSTELLATION", "CONSTELLATION", record.afterSwipe.attrs?.[config.stateAttr] || null, record.afterSwipe.attrs?.[config.stateAttr] === "CONSTELLATION");
  }));

  if (config.lens) {
    records.push(await withScenario(browser, benchmarkId, "DESKTOP_LENS_KEYBOARD_ACTIVATION", "DESKTOP", async (page, record) => {
      record.navigation = await navigate(page, config.route, null);
      record.actions.push(await activate(page, config.lens, "keyboard"));
      const selected = await page.$eval(config.lens, element => element.getAttribute("aria-selected"));
      assertion(record.assertions, "LENS_KEYBOARD_ACTIVATION_ACCEPTED", "true", selected, selected === "true");
    }));
  }

  return records;
}

async function homepageScenarios(browser, config) {
  const records = [];
  records.push(await withScenario(browser, "HOMEPAGE_COMPASS", "DESKTOP_PROFILE_TAB_AND_DISCLOSURE", "DESKTOP", async (page, record) => {
    record.navigation = await navigate(page, config.route, null);
    record.before = await snapshot(page, config.root);
    assertion(record.assertions, "COMPASS_BEHAVIOR_RETIRED", "retired", record.before.attrs?.["data-compass-behavior"] || null, record.before.attrs?.["data-compass-behavior"] === "retired");
    assertion(record.assertions, "ORBIT_MAP_RETIRED", "retired", record.before.attrs?.["data-orbit-map"] || null, record.before.attrs?.["data-orbit-map"] === "retired");
    record.actions.push(await activateNth(page, "button.profile-tab", 1, "pointer"));
    const selected = await page.$$eval("button.profile-tab", elements => elements.map(element => element.getAttribute("aria-selected")));
    assertion(record.assertions, "PROFILE_TAB_SELECTION_EXECUTED", "second tab selected", selected, selected[1] === "true");
    record.actions.push(await activate(page, "summary.profile-summary", "keyboard"));
    const open = await page.$eval("summary.profile-summary", element => element.parentElement?.open === true);
    assertion(record.assertions, "PROFILE_DISCLOSURE_KEYBOARD_OPEN", true, open, open === true);
  }));

  records.push(await withScenario(browser, "HOMEPAGE_COMPASS", "DESKTOP_RETURN_TO_COMPASS_NAVIGATION", "DESKTOP", async (page, record) => {
    record.navigation = await navigate(page, config.route, null);
    await page.waitForSelector("a[data-profile-action]", { timeout: 8000 });
    const navigationPromise = page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => null);
    record.actions.push(await activate(page, "a[data-profile-action]", "pointer"));
    await navigationPromise;
    await settle(page, "[data-compass-scene]");
    const pathname = new URL(page.url()).pathname;
    const compassRoot = await page.$("main[data-compass-root]");
    assertion(record.assertions, "RETURN_TO_COMPASS_NAVIGATES_ROOT", "/", pathname, pathname === "/");
    assertion(record.assertions, "RETURN_DESTINATION_HAS_MAIN_COMPASS", true, Boolean(compassRoot), Boolean(compassRoot));
  }));

  records.push(await withScenario(browser, "HOMEPAGE_COMPASS", "MOBILE_PROFILE_TOUCH_SELECTION", "MOBILE", async (page, record) => {
    record.navigation = await navigate(page, config.route, null);
    record.actions.push(await activateNth(page, "button.profile-tab", 2, "touch"));
    const selected = await page.$$eval("button.profile-tab", elements => elements.map(element => element.getAttribute("aria-selected")));
    assertion(record.assertions, "MOBILE_PROFILE_TAB_TOUCH_ACCEPTED", "third tab selected", selected, selected[2] === "true");
  }));
  return records;
}

const browser = await puppeteer.launch(launchOptions());
const scenarios = [];
try {
  scenarios.push(...await compassScenarios(browser, "MAIN_COMPASS", ROUTES.MAIN_COMPASS));
  scenarios.push(...await homepageScenarios(browser, ROUTES.HOMEPAGE_COMPASS));
  scenarios.push(...await compassScenarios(browser, "ARCHCOIN_COMPASS", ROUTES.ARCHCOIN_COMPASS));
  scenarios.push(...await compassScenarios(browser, "SHOWROOM", ROUTES.SHOWROOM));
  scenarios.push(...await compassScenarios(browser, "LAWS_CHAMBER_POST_PR128", ROUTES.LAWS_CHAMBER_POST_PR128));
} finally {
  await browser.close();
}

const harnessFailures = scenarios.filter(scenario => scenario.status === "HARNESS_FAILURE");
const productFindings = scenarios.flatMap(scenario => scenario.assertions.filter(item => !item.pass && item.severity === "PRODUCT_OBSERVATION").map(item => ({ benchmarkId: scenario.benchmarkId, scenarioId: scenario.scenarioId, ...item })));
const positiveBenchmarks = new Set(Object.entries(ROUTES).filter(([, config]) => config.posture.startsWith("POSITIVE")).map(([id]) => id));
const positiveReferenceFindings = productFindings.filter(item => positiveBenchmarks.has(item.benchmarkId));
const negativeReferenceFindings = productFindings.filter(item => item.benchmarkId === "LAWS_CHAMBER_POST_PR128");
const benchmarkSummaries = Object.entries(ROUTES).map(([benchmarkId, config]) => {
  const routeScenarios = scenarios.filter(scenario => scenario.benchmarkId === benchmarkId);
  const findings = productFindings.filter(item => item.benchmarkId === benchmarkId);
  return {
    benchmarkId,
    route: config.route,
    referencePosture: config.posture,
    scenarioCount: routeScenarios.length,
    executedScenarioCount: routeScenarios.filter(scenario => scenario.status === "EXECUTED").length,
    harnessFailureCount: routeScenarios.filter(scenario => scenario.status === "HARNESS_FAILURE").length,
    productFindingCount: findings.length,
    observedPosture: findings.length === 0 ? "OBSERVED_INTERACTION_PASS" : config.posture === "NEGATIVE_REFERENCE" ? "BOUNDED_NEGATIVE_REFERENCE_FINDINGS" : "POSITIVE_REFERENCE_FINDINGS_PRESENT"
  };
});

const status = harnessFailures.length === 0
  ? "PASS_INTERACTION_EXECUTION_BASELINE"
  : "FAIL_INTERACTION_EXECUTION_HARNESS";

const artifact = {
  artifactId: "METAVERSE_3D_GOVERNED_BENCHMARK_CORPUS_INTERACTION_EXECUTION_BASELINE_v1",
  checkpoint: "CP6",
  status,
  generatedAt: new Date().toISOString(),
  repository: "smansfield635-create/smansfield635-create.github.io",
  baselineCommit: "ba0f3ecf3087f91d2cb3ff6aa4dd3c040107712e",
  cp5InventoryCommit: "9707c18a86055f3f8bf2676b20e20e16bb6bb5be",
  executionScope: {
    routes: 5,
    profiles: ["DESKTOP", "MOBILE"],
    inputModalities: ["POINTER_CLICK", "KEYBOARD_ENTER", "MOUSE_DRAG", "MOUSE_RELEASE_SWIPE", "TOUCH_TAP", "TOUCH_RELEASE_SWIPE"],
    navigationMutationAllowed: false,
    productMutationAllowed: false,
    lawsRepairAllowed: false
  },
  assertions: {
    allFiveRoutesExecuted: benchmarkSummaries.length === 5 && benchmarkSummaries.every(summary => summary.executedScenarioCount > 0),
    scenarioCount: scenarios.length,
    executedScenarioCount: scenarios.filter(scenario => scenario.status === "EXECUTED").length,
    harnessFailureCount: harnessFailures.length,
    productFindingCount: productFindings.length,
    positiveReferenceFindingCount: positiveReferenceFindings.length,
    negativeReferenceFindingCount: negativeReferenceFindings.length,
    interactionCorrectnessUniversallyProven: false,
    visualCorrectnessProven: false,
    performanceAcceptanceProven: false,
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
    proves: [
      "DEPLOYED_INPUT_EVENT_DELIVERY",
      "ROUTE_SPECIFIC_CONTROLLER_STATE_OBSERVATION",
      "POINTER_KEYBOARD_AND_TOUCH_EXECUTION_BASELINE",
      "RETURN_CONTROL_AND_RELEASE_SWIPE_OBSERVATION",
      "POSITIVE_AND_NEGATIVE_REFERENCE_INTERACTION_CLASSIFICATION"
    ],
    doesNotProve: [
      "UNIVERSAL_INTERACTION_CORRECTNESS",
      "VISUAL_CORRECTNESS",
      "PERFORMANCE_ACCEPTANCE",
      "LAWS_REPAIR_CORRECTNESS"
    ],
    authorizes: []
  },
  nextCheckpoint: "CP7_VISUAL_AND_SPATIAL_REALIZATION_BASELINE"
};

artifact.interactionBaselineDigest = digest({ benchmarkSummaries, productFindings, scenarios: scenarios.map(({ telemetry, ...scenario }) => scenario) });
await fs.writeFile(OUTPUT, JSON.stringify(artifact, null, 2));
console.log(`CP6_STATUS=${status}`);
console.log(`CP6_SCENARIO_COUNT=${scenarios.length}`);
console.log(`CP6_HARNESS_FAILURE_COUNT=${harnessFailures.length}`);
console.log(`CP6_PRODUCT_FINDING_COUNT=${productFindings.length}`);
console.log(`CP6_POSITIVE_REFERENCE_FINDING_COUNT=${positiveReferenceFindings.length}`);
console.log(`CP6_NEGATIVE_REFERENCE_FINDING_COUNT=${negativeReferenceFindings.length}`);
console.log(`CP6_BASELINE_DIGEST=${artifact.interactionBaselineDigest}`);
if (harnessFailures.length > 0) process.exitCode = 1;
