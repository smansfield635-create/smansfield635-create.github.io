import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import puppeteer from "puppeteer-core";
import {
  TOOL_ID,
  ORIGIN,
  PROFILES,
  COMPASS_CORPUS,
  AUXILIARY_CONTROLS,
  OUTPUTS,
  validateAuthorityConfig
} from "./four-compass-benchmark.config.mjs";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const digestBytes = buffer => crypto.createHash("sha256").update(buffer).digest("hex");
const digestJson = value => crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");

function launchOptions() {
  return {
    executablePath: process.env.CHROME_PATH || process.env.CHROME_BIN || "/usr/bin/google-chrome",
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--hide-scrollbars"
    ]
  };
}

async function createPage(browser, profileName) {
  const page = await browser.newPage();
  await page.setViewport(PROFILES[profileName]);
  const telemetry = { console: [], pageErrors: [], requestFailures: [], navigations: [] };
  page.on("console", message => telemetry.console.push({ type: message.type(), text: message.text() }));
  page.on("pageerror", error => telemetry.pageErrors.push(String(error?.message || error)));
  page.on("requestfailed", request => telemetry.requestFailures.push({
    url: request.url(),
    error: request.failure()?.errorText || ""
  }));
  page.on("framenavigated", frame => {
    if (frame === page.mainFrame()) telemetry.navigations.push(frame.url());
  });
  return { page, telemetry };
}

async function navigate(page, config) {
  const response = await page.goto(`${ORIGIN}${config.route}`, {
    waitUntil: "domcontentloaded",
    timeout: 30000
  });
  await page.waitForNetworkIdle({ idleTime: 700, timeout: 15000 }).catch(() => {});
  await sleep(1200);
  await page.waitForSelector(config.root, { timeout: 10000 });
  if (config.scene) {
    await page.$eval(config.scene, element => element.scrollIntoView({ block: "center", inline: "center" })).catch(() => {});
    await sleep(1300);
  }
  await page.keyboard.press("Tab").catch(() => {});
  await sleep(900);
  return { status: response?.status() ?? null, finalUrl: page.url() };
}

async function selectorExists(page, selector) {
  return selector ? Boolean(await page.$(selector)) : false;
}

async function selectorRect(page, selector) {
  if (!selector) return null;
  return page.$eval(selector, (element, selectorValue) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    const intersectionWidth = Math.max(0, Math.min(rect.right, innerWidth) - Math.max(rect.left, 0));
    const intersectionHeight = Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0));
    const area = Math.max(0, rect.width) * Math.max(0, rect.height);
    const visibleArea = intersectionWidth * intersectionHeight;
    return {
      selector: selectorValue,
      tag: element.tagName.toLowerCase(),
      text: (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 160),
      rect: {
        x: Number(rect.x.toFixed(2)), y: Number(rect.y.toFixed(2)),
        width: Number(rect.width.toFixed(2)), height: Number(rect.height.toFixed(2)),
        top: Number(rect.top.toFixed(2)), right: Number(rect.right.toFixed(2)),
        bottom: Number(rect.bottom.toFixed(2)), left: Number(rect.left.toFixed(2))
      },
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      pointerEvents: style.pointerEvents,
      zIndex: style.zIndex,
      position: style.position,
      transform: style.transform,
      area: Number(area.toFixed(2)),
      visibleArea: Number(visibleArea.toFixed(2)),
      viewportCoverage: area > 0 ? Number((visibleArea / area).toFixed(4)) : 0,
      rendered: rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0.01,
      intersectsViewport: visibleArea > 0
    };
  }, selector).catch(() => null);
}

async function rootState(page, config) {
  return page.$eval(config.root, (element, stateAttr) => ({
    attrs: Object.fromEntries(Array.from(element.attributes)
      .filter(attribute => attribute.name.startsWith("data-"))
      .map(attribute => [attribute.name, attribute.value])),
    state: element.getAttribute(stateAttr),
    scroll: { x: scrollX, y: scrollY }
  }), config.stateAttr);
}

async function documentMetrics(page) {
  return page.evaluate(() => {
    const documentElement = document.documentElement;
    const body = document.body;
    const controls = Array.from(document.querySelectorAll("a,button,summary,input,select,textarea,[role='button'],[role='tab']"))
      .map((element, index) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const area = Math.max(0, rect.width) * Math.max(0, rect.height);
        const intersectionWidth = Math.max(0, Math.min(rect.right, innerWidth) - Math.max(rect.left, 0));
        const intersectionHeight = Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0));
        const visibleArea = intersectionWidth * intersectionHeight;
        return {
          index,
          tag: element.tagName.toLowerCase(),
          text: (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 100),
          area,
          visibleArea,
          rendered: area > 0 && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0.01,
          intersectsViewport: visibleArea > 0,
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
        };
      });
    return {
      viewport: { width: innerWidth, height: innerHeight, devicePixelRatio, scrollX, scrollY },
      document: {
        scrollWidth: Math.max(documentElement.scrollWidth, body?.scrollWidth || 0),
        scrollHeight: Math.max(documentElement.scrollHeight, body?.scrollHeight || 0),
        clientWidth: documentElement.clientWidth,
        clientHeight: documentElement.clientHeight
      },
      horizontalOverflowPx: Math.max(0, Math.max(documentElement.scrollWidth, body?.scrollWidth || 0) - innerWidth),
      interactive: {
        total: controls.length,
        rendered: controls.filter(control => control.rendered).length,
        inViewport: controls.filter(control => control.rendered && control.intersectsViewport).length,
        renderedZeroArea: controls.filter(control => control.rendered && control.area === 0).length,
        renderedOutsideViewport: controls.filter(control => control.rendered && !control.intersectsViewport).length
      }
    };
  });
}

function overlap(a, b) {
  if (!a?.rect || !b?.rect || !a.rendered || !b.rendered) return null;
  const left = Math.max(a.rect.left, b.rect.left);
  const right = Math.min(a.rect.right, b.rect.right);
  const top = Math.max(a.rect.top, b.rect.top);
  const bottom = Math.min(a.rect.bottom, b.rect.bottom);
  const area = Math.max(0, right - left) * Math.max(0, bottom - top);
  const minimum = Math.min(a.area || 0, b.area || 0);
  return { area: Number(area.toFixed(2)), ratioOfSmaller: minimum > 0 ? Number((area / minimum).toFixed(4)) : 0 };
}

async function activate(page, selector, profileName) {
  if (!selector || !(await selectorExists(page, selector))) return { selector, result: "TARGET_ABSENT" };
  await page.$eval(selector, element => element.scrollIntoView({ block: "center", inline: "center" }));
  await sleep(300);
  const rect = await selectorRect(page, selector);
  if (!rect?.rendered) return { selector, result: "TARGET_NOT_RENDERED", rect };
  const x = rect.rect.x + rect.rect.width / 2;
  const y = rect.rect.y + rect.rect.height / 2;
  if (profileName === "MOBILE") {
    await page.touchscreen.tap(x, y).catch(() => page.$eval(selector, element => element.click()));
  } else {
    const handle = await page.$(selector);
    await handle.click({ delay: 60 }).catch(() => page.$eval(selector, element => element.click()));
  }
  await sleep(1100);
  return { selector, result: "ACTIVATED", rect };
}

async function gesture(page, selector, profileName) {
  if (!selector || !(await selectorExists(page, selector))) return { selector, result: "GESTURE_SURFACE_ABSENT" };
  await page.$eval(selector, element => element.scrollIntoView({ block: "center", inline: "center" }));
  await sleep(250);
  const rect = await selectorRect(page, selector);
  if (!rect?.rendered || rect.rect.width < 80 || rect.rect.height < 80) return { selector, result: "GESTURE_SURFACE_NOT_RENDERED", rect };
  const distance = Math.min(220, rect.rect.width * 0.42);
  const startX = rect.rect.x + rect.rect.width / 2 - distance / 2;
  const endX = startX + distance;
  const y = rect.rect.y + rect.rect.height / 2;
  const steps = 12;
  if (profileName === "MOBILE") {
    const client = await page.createCDPSession();
    await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: startX, y, radiusX: 8, radiusY: 8, force: 1, id: 1 }] });
    for (let index = 1; index <= steps; index += 1) {
      await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: startX + (endX - startX) * index / steps, y, radiusX: 8, radiusY: 8, force: 1, id: 1 }] });
      await sleep(35);
    }
    await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await client.detach();
  } else {
    await page.mouse.move(startX, y);
    await page.mouse.down();
    for (let index = 1; index <= steps; index += 1) {
      await page.mouse.move(startX + (endX - startX) * index / steps, y);
      await sleep(35);
    }
    await page.mouse.up();
  }
  await sleep(1200);
  return { selector, result: "GESTURE_DISPATCHED", distance };
}

async function capture(page, authorityId, profileName, stateLabel, config, screenshotRoot, fullPage = false) {
  const safe = `${authorityId.toLowerCase()}-${profileName.toLowerCase()}-${stateLabel.toLowerCase()}`.replace(/[^a-z0-9-]+/g, "-");
  const filename = path.join(screenshotRoot, `${safe}${fullPage ? "-full" : "-viewport"}.png`);
  const buffer = await page.screenshot({ path: filename, type: "png", fullPage, captureBeyondViewport: true });
  const elements = {};
  for (const [name, selector] of Object.entries({
    root: config.root,
    scene: config.scene,
    gestureSurface: config.gestureSurface,
    cardinal: config.cardinal,
    child: config.child,
    returnControl: config.returnControl,
    categoryLabel: config.categoryLabel,
    childLabel: config.childLabel,
    method: config.method,
    panel: config.panel
  })) elements[name] = await selectorRect(page, selector);
  const metrics = await documentMetrics(page);
  const state = await rootState(page, config);
  const overlaps = {
    cardinalChild: overlap(elements.cardinal, elements.child),
    cardinalReturn: overlap(elements.cardinal, elements.returnControl),
    childReturn: overlap(elements.child, elements.returnControl)
  };
  const lawsConformance = config.route === "/laws/" ? await page.evaluate(() => {
    const rendered = element => {
      if (!element || element.hidden) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0.01 && rect.width > 0 && rect.height > 0;
    };
    const categories = Array.from(document.querySelectorAll("[data-laws-projected-category-label]"));
    const laws = Array.from(document.querySelectorAll("[data-laws-projected-law-label]"));
    const returnControl = document.querySelector("[data-laws-return-to-orbit]");
    const root = document.querySelector("[data-laws-root]");
    return {
      firstMethodPresent: Boolean(document.querySelector("[data-laws-first-method]")),
      acronym: document.documentElement.dataset.lawsMethodAcronym || "",
      testMethod: document.documentElement.dataset.lawsTestMethod || "",
      primaryStarCount: Number(document.documentElement.dataset.lawsPrimaryStarCount || 0),
      categoryVisibleCount: categories.filter(rendered).length,
      categoryPrimaryCount: categories.filter(element => rendered(element) && element.dataset.primary === "true").length,
      categoryLetterCount: categories.filter(element => element.querySelector("[data-laws-projected-category-letter]")).length,
      categoryWordCount: categories.filter(element => element.querySelector("[data-laws-projected-category-word]")).length,
      lawVisibleCount: laws.filter(rendered).length,
      lawPrimaryCount: laws.filter(element => rendered(element) && element.dataset.primary === "true").length,
      returnText: (returnControl?.textContent || "").replace(/\s+/g, " ").trim(),
      returnVisible: rendered(returnControl),
      controllerState: root?.dataset.lawsControllerState || ""
    };
  }) : null;
  const findings = [];
  if (metrics.horizontalOverflowPx > 2) findings.push({ id: "HORIZONTAL_OVERFLOW", observed: metrics.horizontalOverflowPx });
  if (lawsConformance) {
    if (!lawsConformance.firstMethodPresent || lawsConformance.acronym !== "FIRST" || lawsConformance.testMethod !== "cross-cutting-no-fifth-star" || lawsConformance.primaryStarCount !== 4) findings.push({ id: "LAWS_FIRST_TEST_METHOD_INVALID", observed: lawsConformance });
    if (["INITIAL", "CONTROLLED_DRAG"].includes(stateLabel) && (lawsConformance.categoryVisibleCount !== 4 || lawsConformance.categoryPrimaryCount !== 1 || lawsConformance.categoryLetterCount !== 4 || lawsConformance.categoryWordCount !== 4)) findings.push({ id: "LAWS_CATEGORY_LABEL_CONFORMANCE_FAILED", observed: lawsConformance });
    if (["CARDINAL_ATTEMPT", "CHILD_ATTEMPT"].includes(stateLabel) && (lawsConformance.lawVisibleCount !== 1 || lawsConformance.lawPrimaryCount !== 1)) findings.push({ id: "LAWS_CLUSTER_SINGLE_LABEL_FAILED", observed: lawsConformance });
    if (stateLabel === "CHILD_ATTEMPT" && (!lawsConformance.returnVisible || lawsConformance.returnText !== "Return to Orbit")) findings.push({ id: "LAWS_RETURN_TO_ORBIT_IDENTITY_FAILED", observed: lawsConformance });
  }
  for (const name of ["root", "scene"]) {
    const element = elements[name];
    if (!element) findings.push({ id: "IMPORTANT_ELEMENT_ABSENT", element: name });
    else if (!element.rendered || element.area <= 1) findings.push({ id: "IMPORTANT_ELEMENT_ZERO_OR_HIDDEN", element: name, observed: element });
  }
  for (const name of ["cardinal", "child", "returnControl"]) {
    const element = elements[name];
    if (element?.rendered && element.viewportCoverage < 0.85) findings.push({ id: "INTERACTIVE_ELEMENT_PARTIALLY_CLIPPED", element: name, viewportCoverage: element.viewportCoverage });
  }
  for (const [name, value] of Object.entries(overlaps)) {
    if (value && value.ratioOfSmaller > 0.65) findings.push({ id: "INTERACTIVE_CONTROL_OVERLAP", pair: name, observed: value });
  }
  return { stateLabel, fullPage, filename, byteLength: buffer.length, sha256: digestBytes(buffer), state, metrics, elements, overlaps, lawsConformance, findings };
}

async function runCompassScenario(browser, authorityId, profileName, config) {
  const { page, telemetry } = await createPage(browser, profileName);
  const record = { authorityId, lane: "FOUR_COMPASS_CORPUS", route: config.route, posture: config.posture, profile: profileName, status: "PENDING", navigation: null, actions: [], captures: [], telemetry };
  try {
    record.navigation = await navigate(page, config);
    record.captures.push(await capture(page, authorityId, profileName, "INITIAL", config, OUTPUTS.compassScreenshotRoot, false));
    record.captures.push(await capture(page, authorityId, profileName, "INITIAL", config, OUTPUTS.compassScreenshotRoot, true));
    record.actions.push(await gesture(page, config.gestureSurface, profileName));
    record.captures.push(await capture(page, authorityId, profileName, "CONTROLLED_DRAG", config, OUTPUTS.compassScreenshotRoot));
    record.actions.push(await activate(page, config.cardinal, profileName));
    record.captures.push(await capture(page, authorityId, profileName, "CARDINAL_ATTEMPT", config, OUTPUTS.compassScreenshotRoot));
    record.actions.push(await activate(page, config.child, profileName));
    record.captures.push(await capture(page, authorityId, profileName, "CHILD_ATTEMPT", config, OUTPUTS.compassScreenshotRoot));
    record.actions.push(await activate(page, config.returnControl, profileName));
    record.captures.push(await capture(page, authorityId, profileName, "RETURN_ATTEMPT", config, OUTPUTS.compassScreenshotRoot));
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

async function runAuxiliaryScenario(browser, authorityId, profileName, config) {
  const { page, telemetry } = await createPage(browser, profileName);
  const record = { authorityId, lane: "AUXILIARY_CONTROL", route: config.route, posture: config.posture, compassAuthority: false, profile: profileName, status: "PENDING", navigation: null, actions: [], captures: [], telemetry };
  try {
    record.navigation = await navigate(page, config);
    record.captures.push(await capture(page, authorityId, profileName, "INITIAL", config, OUTPUTS.auxiliaryScreenshotRoot, false));
    record.captures.push(await capture(page, authorityId, profileName, "INITIAL", config, OUTPUTS.auxiliaryScreenshotRoot, true));
    record.actions.push(await activate(page, config.cardinal, profileName));
    record.captures.push(await capture(page, authorityId, profileName, "PROFILE_RULES_SELECTED", config, OUTPUTS.auxiliaryScreenshotRoot));
    const disclosure = await page.$(config.disclosure);
    if (disclosure) {
      await disclosure.evaluate(element => element.scrollIntoView({ block: "center", inline: "center" }));
      await disclosure.click({ delay: 60 }).catch(() => disclosure.evaluate(element => element.click()));
      await sleep(700);
      record.actions.push({ selector: config.disclosure, result: "ACTIVATED" });
    } else record.actions.push({ selector: config.disclosure, result: "TARGET_ABSENT" });
    record.captures.push(await capture(page, authorityId, profileName, "DISCLOSURE_ATTEMPT", config, OUTPUTS.auxiliaryScreenshotRoot));
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

function buildLaneEvidence({ artifactId, checkpoint, lane, config, records, expectedMemberCount, expectedCapturesPerScenario, prohibitedIds }) {
  const ids = Object.keys(config);
  const failures = records.filter(record => record.status === "HARNESS_FAILURE").map(record => ({ authorityId: record.authorityId, profile: record.profile, failure: record.harnessFailure }));
  const findings = records.flatMap(record => record.captures.flatMap(item => item.findings.map(finding => ({ authorityId: record.authorityId, posture: record.posture, profile: record.profile, stateLabel: item.stateLabel, ...finding }))));
  const screenshotManifest = records.flatMap(record => record.captures.map(item => ({ authorityId: record.authorityId, profile: record.profile, stateLabel: item.stateLabel, fullPage: item.fullPage, filename: item.filename, byteLength: item.byteLength, sha256: item.sha256 })));
  const summaries = ids.map(authorityId => {
    const subset = records.filter(record => record.authorityId === authorityId);
    const authorityManifest = screenshotManifest.filter(item => item.authorityId === authorityId);
    return {
      authorityId,
      lane,
      route: config[authorityId].route,
      posture: config[authorityId].posture,
      profileCount: subset.length,
      executedProfileCount: subset.filter(record => record.status === "EXECUTED").length,
      captureCount: subset.reduce((sum, record) => sum + record.captures.length, 0),
      findingCount: findings.filter(finding => finding.authorityId === authorityId).length,
      screenshotDigest: digestJson(authorityManifest)
    };
  });
  const expectedScenarioCount = expectedMemberCount * Object.keys(PROFILES).length;
  const expectedCaptureCount = expectedScenarioCount * expectedCapturesPerScenario;
  const allObservedIds = new Set([
    ...records.map(record => record.authorityId),
    ...summaries.map(summary => summary.authorityId),
    ...findings.map(finding => finding.authorityId),
    ...screenshotManifest.map(item => item.authorityId)
  ]);
  const assertions = {
    memberCountExact: ids.length === expectedMemberCount,
    configuredMembersCaptured: ids.every(authorityId => records.some(record => record.authorityId === authorityId)),
    desktopAndMobileCaptured: Object.keys(PROFILES).every(profile => ids.every(authorityId => records.some(record => record.profile === profile && record.authorityId === authorityId))),
    scenarioCount: records.length,
    expectedScenarioCount,
    executedScenarioCount: records.filter(record => record.status === "EXECUTED").length,
    captureCount: screenshotManifest.length,
    expectedCaptureCount,
    harnessFailureCount: failures.length,
    findingCount: findings.length,
    screenshotBodiesCaptured: screenshotManifest.every(item => item.byteLength > 0 && /^[a-f0-9]{64}$/.test(item.sha256)),
    prohibitedAuthoritiesExcluded: prohibitedIds.every(id => !allObservedIds.has(id)),
    productFilesChanged: 0,
    lawsRepairStarted: false,
    mainChanged: false,
    mergeAuthority: "NONE"
  };
  const pass = assertions.memberCountExact && assertions.configuredMembersCaptured && assertions.desktopAndMobileCaptured && assertions.scenarioCount === expectedScenarioCount && assertions.executedScenarioCount === expectedScenarioCount && assertions.captureCount === expectedCaptureCount && assertions.harnessFailureCount === 0 && assertions.screenshotBodiesCaptured && assertions.prohibitedAuthoritiesExcluded;
  const result = {
    artifactId,
    toolId: TOOL_ID,
    checkpoint,
    lane,
    status: pass ? "PASS_BOUNDED_LANE_BASELINE" : "FAIL_BOUNDED_LANE_BASELINE",
    generatedAt: new Date().toISOString(),
    repository: process.env.GITHUB_REPOSITORY || "smansfield635-create/smansfield635-create.github.io",
    execution: {
      branch: process.env.EXECUTION_BRANCH || process.env.GITHUB_REF_NAME || "",
      commit: process.env.EXECUTION_COMMIT || process.env.GITHUB_SHA || "",
      workflowRunId: process.env.GITHUB_RUN_ID || "",
      workflowRunAttempt: process.env.GITHUB_RUN_ATTEMPT || ""
    },
    executionScope: {
      routes: Object.fromEntries(Object.entries(config).map(([id, entry]) => [id, entry.route])),
      profiles: PROFILES,
      passMeaning: "EVIDENCE_COMPLETENESS_NOT_ZERO_FINDINGS"
    },
    assertions,
    summaries,
    findings,
    harnessFailures: failures,
    screenshotManifest,
    records,
    stoppingBoundary: {
      proves: ["DEPLOYED_BROWSER_EVIDENCE_CUSTODY", "LANE_SPECIFIC_SUMMARIES_FINDINGS_MANIFEST_AND_DIGEST", "NO_CROSS_LANE_AGGREGATION"],
      doesNotProve: ["UNIVERSAL_VISUAL_CORRECTNESS", "PRODUCT_ROOT_CAUSE", "LAWS_REPAIR_CORRECTNESS", "CROSS_BROWSER_PARITY"],
      authorizes: []
    },
    nextCheckpoint: "T3_TOOL_EXECUTION_AND_EVIDENCE_VALIDATION"
  };
  result.laneBaselineDigest = digestJson({ assertions, summaries, findings, screenshotManifest });
  return { result, pass };
}

async function main() {
  const configValidation = validateAuthorityConfig();
  if (configValidation.failures.length) throw new Error(`FOUR_COMPASS_CONFIG_INVALID:${configValidation.failures.join(",")}`);
  for (const directory of [OUTPUTS.compassScreenshotRoot, OUTPUTS.auxiliaryScreenshotRoot]) {
    await fs.rm(directory, { recursive: true, force: true });
    await fs.mkdir(directory, { recursive: true });
  }
  const browser = await puppeteer.launch(launchOptions());
  const compassRecords = [];
  const auxiliaryRecords = [];
  try {
    for (const profileName of Object.keys(PROFILES)) {
      for (const [authorityId, config] of Object.entries(COMPASS_CORPUS)) {
        const record = await runCompassScenario(browser, authorityId, profileName, config);
        compassRecords.push(record);
        console.log(JSON.stringify({ lane: "FOUR_COMPASS_CORPUS", authorityId, profileName, status: record.status, captures: record.captures.length }));
      }
    }
    for (const profileName of Object.keys(PROFILES)) {
      for (const [authorityId, config] of Object.entries(AUXILIARY_CONTROLS)) {
        const record = await runAuxiliaryScenario(browser, authorityId, profileName, config);
        auxiliaryRecords.push(record);
        console.log(JSON.stringify({ lane: "AUXILIARY_CONTROL", authorityId, profileName, status: record.status, captures: record.captures.length }));
      }
    }
  } finally {
    await browser.close();
  }
  const compass = buildLaneEvidence({
    artifactId: "METAVERSE_FOUR_COMPASS_BROWSER_BASELINE_v1",
    checkpoint: "T3",
    lane: "FOUR_COMPASS_CORPUS",
    config: COMPASS_CORPUS,
    records: compassRecords,
    expectedMemberCount: 4,
    expectedCapturesPerScenario: 6,
    prohibitedIds: Object.keys(AUXILIARY_CONTROLS)
  });
  const auxiliary = buildLaneEvidence({
    artifactId: "WEBSITE_HOME_RECEIVER_AUXILIARY_CONTROL_BASELINE_v1",
    checkpoint: "T3",
    lane: "AUXILIARY_CONTROL",
    config: AUXILIARY_CONTROLS,
    records: auxiliaryRecords,
    expectedMemberCount: 1,
    expectedCapturesPerScenario: 4,
    prohibitedIds: Object.keys(COMPASS_CORPUS)
  });
  await fs.writeFile(OUTPUTS.compassReceipt, `${JSON.stringify(compass.result, null, 2)}\n`, "utf8");
  await fs.writeFile(OUTPUTS.auxiliaryReceipt, `${JSON.stringify(auxiliary.result, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({
    compassStatus: compass.result.status,
    compassDigest: compass.result.laneBaselineDigest,
    auxiliaryStatus: auxiliary.result.status,
    auxiliaryDigest: auxiliary.result.laneBaselineDigest,
    crossLaneAggregateCreated: false
  }, null, 2));
  if (!compass.pass || !auxiliary.pass) process.exitCode = 1;
}

main().catch(error => {
  console.error(error?.stack || error);
  process.exitCode = 1;
});
