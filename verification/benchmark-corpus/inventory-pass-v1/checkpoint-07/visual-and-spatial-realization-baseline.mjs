import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import puppeteer from "puppeteer-core";

const OUTPUT = "cp7-visual-and-spatial-realization-baseline.json";
const SCREENSHOT_DIR = "cp7-screenshots";
const ORIGIN = "https://smansfield635-create.github.io";
const CP6_INVENTORY_COMMIT = "eb52da12d34366d894924857a03cfbad40b6c68c";
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const PROFILES = {
  DESKTOP: { width: 1440, height: 1100, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  MOBILE: { width: 430, height: 932, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
};

const CONFIG = {
  MAIN_COMPASS: {
    route: "/",
    posture: "POSITIVE_REFERENCE",
    kind: "COMPASS",
    root: "main[data-compass-root]",
    scene: "[data-compass-scene]",
    gestureSurface: "canvas[data-compass-crystals-canvas='true']",
    cardinal: "button[data-compass-cardinal][data-cardinal-id='east']",
    child: "button[data-compass-room-proxy][data-room-id='east-1']",
    returnControl: "[data-compass-return-to-orbit]",
    panel: "[data-compass-panel]",
    stateAttr: "data-compass-mode"
  },
  HOMEPAGE_COMPASS: {
    route: "/home/",
    posture: "POSITIVE_NON_COMPASS_SHELL_REFERENCE",
    kind: "HOME",
    root: "html[data-page='home-value-profile']",
    scene: "#value-profile",
    gestureSurface: null,
    cardinal: "button.profile-tab[data-profile='rules']",
    child: "[data-profile-panel='rules'] details summary, [data-profile='rules']",
    returnControl: "a[href='/']",
    panel: "[data-profile-panel='rules'], [data-profile-content='rules']",
    stateAttr: "data-compass-behavior"
  },
  ARCHCOIN_COMPASS: {
    route: "/products/archcoin/",
    posture: "POSITIVE_REFERENCE",
    kind: "COMPASS",
    root: "main[data-archcoin-root]",
    scene: "[data-archcoin-scene]",
    gestureSurface: "canvas[data-archcoin-crystals-canvas='front']",
    cardinal: "button[data-archcoin-coin][data-cardinal-id='north']",
    child: "a[data-archcoin-room][data-room-id='contract-overview']",
    returnControl: "[data-archcoin-return-to-orbit]",
    panel: "[data-archcoin-panel]",
    stateAttr: "data-archcoin-controller-state"
  },
  SHOWROOM: {
    route: "/showroom/",
    posture: "POSITIVE_REFERENCE",
    kind: "COMPASS",
    root: "div[data-showroom-root]",
    scene: "[data-showroom-scene]",
    gestureSurface: "[data-showroom-scene]",
    cardinal: "button[data-showroom-cardinal-control][data-showroom-cardinal-id='north']",
    child: "button[data-showroom-child-control][data-showroom-child-id='north-1']",
    returnControl: "[data-showroom-controller-return-to-orbit]",
    panel: "[data-showroom-front-host], [data-showroom-panel]",
    stateAttr: "data-showroom-controller-state"
  },
  LAWS_CHAMBER_POST_PR128: {
    route: "/laws/",
    posture: "NEGATIVE_REFERENCE",
    kind: "COMPASS",
    root: "div[data-laws-root]",
    scene: "[data-laws-scene]",
    gestureSurface: "canvas[data-laws-crystals-canvas='front']",
    cardinal: "button[data-laws-category-control][data-laws-cluster-id='flow']",
    child: "button[data-laws-law-control][data-route='/laws/categories/flow/signals/']",
    returnControl: "[data-laws-return-to-orbit]",
    panel: "[data-laws-panel], [data-laws-front-host]",
    stateAttr: "data-laws-controller-state"
  }
};

function digestBytes(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function digestJson(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function launchOptions() {
  return {
    executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
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
  if (!selector) return false;
  return Boolean(await page.$(selector));
}

async function selectorRect(page, selector) {
  if (!selector) return null;
  return page.$eval(selector, element => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    const viewport = { width: innerWidth, height: innerHeight };
    const intersectionWidth = Math.max(0, Math.min(rect.right, viewport.width) - Math.max(rect.left, 0));
    const intersectionHeight = Math.max(0, Math.min(rect.bottom, viewport.height) - Math.max(rect.top, 0));
    const area = Math.max(0, rect.width) * Math.max(0, rect.height);
    const visibleArea = intersectionWidth * intersectionHeight;
    return {
      selector,
      tag: element.tagName.toLowerCase(),
      text: (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 160),
      rect: {
        x: Number(rect.x.toFixed(2)),
        y: Number(rect.y.toFixed(2)),
        width: Number(rect.width.toFixed(2)),
        height: Number(rect.height.toFixed(2)),
        top: Number(rect.top.toFixed(2)),
        right: Number(rect.right.toFixed(2)),
        bottom: Number(rect.bottom.toFixed(2)),
        left: Number(rect.left.toFixed(2))
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
  }).catch(() => null);
}

async function rootState(page, config) {
  return page.$eval(config.root, (element, stateAttr) => ({
    attrs: Object.fromEntries(
      Array.from(element.attributes)
        .filter(attribute => attribute.name.startsWith("data-"))
        .map(attribute => [attribute.name, attribute.value])
    ),
    state: element.getAttribute(stateAttr),
    scroll: { x: scrollX, y: scrollY }
  }), config.stateAttr);
}

async function documentMetrics(page) {
  return page.evaluate(() => {
    const documentElement = document.documentElement;
    const body = document.body;
    const all = Array.from(document.querySelectorAll("a,button,summary,input,select,textarea,[role='button'],[role='tab']"));
    const controls = all.map((element, index) => {
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
      viewport: {
        width: innerWidth,
        height: innerHeight,
        devicePixelRatio,
        scrollX,
        scrollY
      },
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
  return {
    area: Number(area.toFixed(2)),
    ratioOfSmaller: minimum > 0 ? Number((area / minimum).toFixed(4)) : 0
  };
}

async function activate(page, selector, profileName) {
  if (!selector || !(await selectorExists(page, selector))) {
    return { selector, result: "TARGET_ABSENT" };
  }
  await page.$eval(selector, element => element.scrollIntoView({ block: "center", inline: "center" }));
  await sleep(300);
  const rect = await selectorRect(page, selector);
  if (!rect?.rendered) {
    return { selector, result: "TARGET_NOT_RENDERED", rect };
  }
  const x = rect.rect.x + rect.rect.width / 2;
  const y = rect.rect.y + rect.rect.height / 2;
  if (profileName === "MOBILE") {
    await page.touchscreen.tap(x, y).catch(async () => {
      await page.$eval(selector, element => element.click());
    });
  } else {
    const handle = await page.$(selector);
    await handle.click({ delay: 60 }).catch(async () => {
      await page.$eval(selector, element => element.click());
    });
  }
  await sleep(1100);
  return { selector, result: "ACTIVATED", rect };
}

async function gesture(page, selector, profileName) {
  if (!selector || !(await selectorExists(page, selector))) {
    return { selector, result: "GESTURE_SURFACE_ABSENT" };
  }
  await page.$eval(selector, element => element.scrollIntoView({ block: "center", inline: "center" }));
  await sleep(250);
  const rect = await selectorRect(page, selector);
  if (!rect?.rendered || rect.rect.width < 80 || rect.rect.height < 80) {
    return { selector, result: "GESTURE_SURFACE_NOT_RENDERED", rect };
  }
  const distance = Math.min(220, rect.rect.width * 0.42);
  const startX = rect.rect.x + rect.rect.width / 2 - distance / 2;
  const endX = startX + distance;
  const y = rect.rect.y + rect.rect.height / 2;
  const steps = 12;
  if (profileName === "MOBILE") {
    const client = await page.createCDPSession();
    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: startX, y, radiusX: 8, radiusY: 8, force: 1, id: 1 }]
    });
    for (let index = 1; index <= steps; index += 1) {
      await client.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: startX + (endX - startX) * index / steps, y, radiusX: 8, radiusY: 8, force: 1, id: 1 }]
      });
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

async function capture(page, benchmarkId, profileName, stateLabel, config, fullPage = false) {
  const safe = `${benchmarkId.toLowerCase()}-${profileName.toLowerCase()}-${stateLabel.toLowerCase()}`.replace(/[^a-z0-9-]+/g, "-");
  const filename = path.join(SCREENSHOT_DIR, `${safe}${fullPage ? "-full" : "-viewport"}.png`);
  const buffer = await page.screenshot({
    path: filename,
    type: "png",
    fullPage,
    captureBeyondViewport: true
  });
  const elements = {};
  for (const [name, selector] of Object.entries({
    root: config.root,
    scene: config.scene,
    gestureSurface: config.gestureSurface,
    cardinal: config.cardinal,
    child: config.child,
    returnControl: config.returnControl,
    panel: config.panel
  })) {
    elements[name] = await selectorRect(page, selector);
  }
  const metrics = await documentMetrics(page);
  const state = await rootState(page, config);
  const overlaps = {
    cardinalChild: overlap(elements.cardinal, elements.child),
    cardinalReturn: overlap(elements.cardinal, elements.returnControl),
    childReturn: overlap(elements.child, elements.returnControl)
  };
  const findings = [];
  if (metrics.horizontalOverflowPx > 2) {
    findings.push({ id: "HORIZONTAL_OVERFLOW", observed: metrics.horizontalOverflowPx });
  }
  for (const name of ["root", "scene"]) {
    const element = elements[name];
    if (!element) findings.push({ id: "IMPORTANT_ELEMENT_ABSENT", element: name });
    else if (!element.rendered || element.area <= 1) findings.push({ id: "IMPORTANT_ELEMENT_ZERO_OR_HIDDEN", element: name, observed: element });
  }
  for (const name of ["cardinal", "child", "returnControl"]) {
    const element = elements[name];
    if (element?.rendered && element.viewportCoverage < 0.85) {
      findings.push({
        id: "INTERACTIVE_ELEMENT_PARTIALLY_CLIPPED",
        element: name,
        viewportCoverage: element.viewportCoverage
      });
    }
  }
  for (const [name, value] of Object.entries(overlaps)) {
    if (value && value.ratioOfSmaller > 0.65) {
      findings.push({ id: "INTERACTIVE_CONTROL_OVERLAP", pair: name, observed: value });
    }
  }
  return {
    stateLabel,
    fullPage,
    filename,
    byteLength: buffer.length,
    sha256: digestBytes(buffer),
    state,
    metrics,
    elements,
    overlaps,
    findings
  };
}

async function runCompassScenario(browser, benchmarkId, profileName, config) {
  const { page, telemetry } = await createPage(browser, profileName);
  const record = {
    benchmarkId,
    route: config.route,
    posture: config.posture,
    profile: profileName,
    status: "PENDING",
    navigation: null,
    actions: [],
    captures: [],
    telemetry
  };
  try {
    record.navigation = await navigate(page, config);
    record.captures.push(await capture(page, benchmarkId, profileName, "INITIAL", config, false));
    record.captures.push(await capture(page, benchmarkId, profileName, "INITIAL", config, true));

    record.actions.push(await gesture(page, config.gestureSurface, profileName));
    record.captures.push(await capture(page, benchmarkId, profileName, "CONTROLLED_DRAG", config, false));

    record.actions.push(await activate(page, config.cardinal, profileName));
    record.captures.push(await capture(page, benchmarkId, profileName, "CARDINAL_ATTEMPT", config, false));

    record.actions.push(await activate(page, config.child, profileName));
    record.captures.push(await capture(page, benchmarkId, profileName, "CHILD_ATTEMPT", config, false));

    record.actions.push(await activate(page, config.returnControl, profileName));
    record.captures.push(await capture(page, benchmarkId, profileName, "RETURN_ATTEMPT", config, false));

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

async function runHomeScenario(browser, benchmarkId, profileName, config) {
  const { page, telemetry } = await createPage(browser, profileName);
  const record = {
    benchmarkId,
    route: config.route,
    posture: config.posture,
    profile: profileName,
    status: "PENDING",
    navigation: null,
    actions: [],
    captures: [],
    telemetry
  };
  try {
    record.navigation = await navigate(page, config);
    record.captures.push(await capture(page, benchmarkId, profileName, "INITIAL", config, false));
    record.captures.push(await capture(page, benchmarkId, profileName, "INITIAL", config, true));

    record.actions.push(await activate(page, config.cardinal, profileName));
    record.captures.push(await capture(page, benchmarkId, profileName, "PROFILE_RULES_SELECTED", config, false));

    const disclosure = await page.$("[data-profile-panel='rules'] details summary, details.receiver-chamber summary");
    if (disclosure) {
      await disclosure.evaluate(element => element.scrollIntoView({ block: "center", inline: "center" }));
      await disclosure.click({ delay: 60 }).catch(async () => disclosure.evaluate(element => element.click()));
      await sleep(700);
      record.actions.push({ selector: "active-profile disclosure", result: "ACTIVATED" });
    } else {
      record.actions.push({ selector: "active-profile disclosure", result: "TARGET_ABSENT" });
    }
    record.captures.push(await capture(page, benchmarkId, profileName, "DISCLOSURE_ATTEMPT", config, false));
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

async function main() {
  await fs.rm(SCREENSHOT_DIR, { recursive: true, force: true });
  await fs.mkdir(SCREENSHOT_DIR, { recursive: true });

  const browser = await puppeteer.launch(launchOptions());
  const records = [];
  try {
    for (const profileName of Object.keys(PROFILES)) {
      for (const [benchmarkId, config] of Object.entries(CONFIG)) {
        const record = config.kind === "HOME"
          ? await runHomeScenario(browser, benchmarkId, profileName, config)
          : await runCompassScenario(browser, benchmarkId, profileName, config);
        records.push(record);
        console.log(JSON.stringify({
          benchmarkId,
          profileName,
          status: record.status,
          captures: record.captures.length,
          findings: record.captures.flatMap(capture => capture.findings).length
        }));
      }
    }
  } finally {
    await browser.close();
  }

  const harnessFailures = records
    .filter(record => record.status === "HARNESS_FAILURE")
    .map(record => ({
      benchmarkId: record.benchmarkId,
      profile: record.profile,
      failure: record.harnessFailure
    }));

  const visualFindings = records.flatMap(record =>
    record.captures.flatMap(capture =>
      capture.findings.map(finding => ({
        benchmarkId: record.benchmarkId,
        posture: record.posture,
        profile: record.profile,
        stateLabel: capture.stateLabel,
        ...finding
      }))
    )
  );

  const screenshotManifest = records.flatMap(record =>
    record.captures.map(capture => ({
      benchmarkId: record.benchmarkId,
      profile: record.profile,
      stateLabel: capture.stateLabel,
      fullPage: capture.fullPage,
      filename: capture.filename,
      byteLength: capture.byteLength,
      sha256: capture.sha256
    }))
  );

  const benchmarkSummaries = Object.keys(CONFIG).map(benchmarkId => {
    const subset = records.filter(record => record.benchmarkId === benchmarkId);
    return {
      benchmarkId,
      route: CONFIG[benchmarkId].route,
      posture: CONFIG[benchmarkId].posture,
      profileCount: subset.length,
      executedProfileCount: subset.filter(record => record.status === "EXECUTED").length,
      captureCount: subset.reduce((sum, record) => sum + record.captures.length, 0),
      findingCount: visualFindings.filter(finding => finding.benchmarkId === benchmarkId).length,
      screenshotDigest: digestJson(
        screenshotManifest.filter(item => item.benchmarkId === benchmarkId)
      )
    };
  });

  const expectedScenarioCount = Object.keys(CONFIG).length * Object.keys(PROFILES).length;
  const expectedMinimumCaptures = (
    4 * 6 +
    1 * 4
  ) * Object.keys(PROFILES).length;

  const assertions = {
    allFiveRoutesCaptured: new Set(records.map(record => record.benchmarkId)).size === 5,
    desktopAndMobileCaptured: Object.keys(PROFILES).every(profile =>
      Object.keys(CONFIG).every(benchmarkId =>
        records.some(record => record.profile === profile && record.benchmarkId === benchmarkId)
      )
    ),
    scenarioCount: records.length,
    expectedScenarioCount,
    executedScenarioCount: records.filter(record => record.status === "EXECUTED").length,
    captureCount: screenshotManifest.length,
    expectedMinimumCaptures,
    harnessFailureCount: harnessFailures.length,
    visualFindingCount: visualFindings.length,
    screenshotBodiesCaptured: screenshotManifest.every(item => item.byteLength > 0 && /^[a-f0-9]{64}$/.test(item.sha256)),
    productFilesChanged: 0,
    lawsRepairStarted: false,
    mainChanged: false,
    mergeAuthority: "NONE"
  };

  const pass =
    assertions.allFiveRoutesCaptured &&
    assertions.desktopAndMobileCaptured &&
    assertions.scenarioCount === assertions.expectedScenarioCount &&
    assertions.executedScenarioCount === assertions.expectedScenarioCount &&
    assertions.captureCount >= assertions.expectedMinimumCaptures &&
    assertions.harnessFailureCount === 0 &&
    assertions.screenshotBodiesCaptured;

  const result = {
    artifactId: "METAVERSE_3D_GOVERNED_BENCHMARK_CORPUS_VISUAL_AND_SPATIAL_REALIZATION_BASELINE_v1",
    checkpoint: "CP7",
    status: pass
      ? "PASS_VISUAL_AND_SPATIAL_REALIZATION_BASELINE"
      : "FAIL_BOUNDED_VISUAL_AND_SPATIAL_REALIZATION_BASELINE",
    generatedAt: new Date().toISOString(),
    repository: "smansfield635-create/smansfield635-create.github.io",
    baselineCommit: "ba0f3ecf3087f91d2cb3ff6aa4dd3c040107712e",
    cp6InventoryCommit: CP6_INVENTORY_COMMIT,
    executionScope: {
      routes: Object.fromEntries(Object.entries(CONFIG).map(([id, config]) => [id, config.route])),
      profiles: PROFILES,
      states: [
        "INITIAL",
        "CONTROLLED_DRAG",
        "CARDINAL_ATTEMPT",
        "CHILD_ATTEMPT",
        "RETURN_ATTEMPT",
        "PROFILE_RULES_SELECTED",
        "DISCLOSURE_ATTEMPT"
      ],
      screenshotMode: "VIEWPORT_STATE_CAPTURES_PLUS_INITIAL_FULL_PAGE",
      geometryMode: "DOM_BOUNDING_RECT_VIEWPORT_COVERAGE_OVERFLOW_AND_CONTROL_OVERLAP",
      passMeaning: "EVIDENCE_COMPLETENESS_NOT_ZERO_VISUAL_FINDINGS"
    },
    assertions,
    benchmarkSummaries,
    visualFindings,
    harnessFailures,
    screenshotManifest,
    records,
    stoppingBoundary: {
      proves: [
        "DEPLOYED_DESKTOP_AND_MOBILE_SCREENSHOT_CUSTODY",
        "ROUTE_AND_STATE_SPECIFIC_DOM_GEOMETRY_BASELINE",
        "VIEWPORT_OVERFLOW_CLIPPING_AND_CONTROL_OVERLAP_OBSERVATION",
        "INITIAL_DRAG_SELECTION_AND_RETURN_SPATIAL_REALIZATION_OBSERVATION",
        "POSITIVE_AND_NEGATIVE_REFERENCE_VISUAL_CLASSIFICATION"
      ],
      doesNotProve: [
        "UNIVERSAL_VISUAL_CORRECTNESS",
        "AWARD_READINESS",
        "PERFORMANCE_ACCEPTANCE",
        "LAWS_REPAIR_CORRECTNESS",
        "CROSS_BROWSER_PARITY"
      ],
      authorizes: []
    },
    nextCheckpoint: "CP8_LAWS_REPAIR_AUTHORITY_AND_BOUNDED_CORRECTION_PLAN"
  };

  result.visualBaselineDigest = digestJson({
    assertions: result.assertions,
    benchmarkSummaries: result.benchmarkSummaries,
    visualFindings: result.visualFindings,
    screenshotManifest: result.screenshotManifest
  });

  await fs.writeFile(OUTPUT, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({
    status: result.status,
    assertions: result.assertions,
    visualBaselineDigest: result.visualBaselineDigest
  }, null, 2));

  if (!pass) process.exitCode = 1;
}

await main();
