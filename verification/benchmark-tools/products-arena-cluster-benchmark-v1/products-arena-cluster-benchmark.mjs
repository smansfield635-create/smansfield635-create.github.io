import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import puppeteer from "puppeteer-core";
import { TOOL_ID, ORIGIN, PROFILES, PRODUCTS, SELECTORS, OUTPUTS } from "./products-arena-cluster-benchmark.config.mjs";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const digest = buffer => crypto.createHash("sha256").update(buffer).digest("hex");
const screenshotRoot = path.resolve(OUTPUTS.screenshots);
await fs.mkdir(screenshotRoot, { recursive: true });

function launchOptions() {
  return {
    executablePath: process.env.CHROME_PATH || process.env.CHROME_BIN || "/usr/bin/google-chrome",
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--use-gl=swiftshader",
      "--hide-scrollbars"
    ]
  };
}

async function createPage(browser, profileName) {
  const profile = PROFILES[profileName];
  const page = await browser.newPage();
  await page.setViewport(profile);
  const telemetry = { console: [], pageErrors: [], requestFailures: [], navigations: [] };
  page.on("console", message => telemetry.console.push({ type: message.type(), text: message.text() }));
  page.on("pageerror", error => telemetry.pageErrors.push(String(error?.message || error)));
  page.on("requestfailed", request => telemetry.requestFailures.push({ url: request.url(), error: request.failure()?.errorText || "" }));
  page.on("framenavigated", frame => { if (frame === page.mainFrame()) telemetry.navigations.push(frame.url()); });
  return { page, telemetry, profile };
}

async function capture(page, profileName, label) {
  const file = path.join(screenshotRoot, `${profileName.toLowerCase()}-${label.toLowerCase()}.png`);
  const buffer = await page.screenshot({ path: file, type: "png", fullPage: false });
  return { file, bytes: buffer.length, sha256: digest(buffer) };
}

async function rootFacts(page) {
  return page.$eval(SELECTORS.root, element => ({
    state: element.dataset.productsState,
    modelClass: element.dataset.productsArenaModelClass || element.dataset.productsModelClass,
    primaryEntryCount: Number(element.dataset.productsPrimaryEntryCount || 0),
    productStarCount: Number(element.dataset.productsProductStarCount || 0),
    cardinalStarCount: Number(element.dataset.productsCardinalStarCount || 0),
    centerPlanetCount: Number(element.dataset.productsCenterPlanetCount || 0),
    centerControlCount: Number(element.dataset.productsCenterControlCount || 0),
    cosmicFieldCount: Number(element.dataset.productsCosmicFieldCount || 0),
    visibleProductLabelCount: Number(element.dataset.productsVisibleProductLabelCount || 0),
    visibleLabelProductId: element.dataset.productsVisibleLabelProductId || "",
    clusterPrimaryProduct: element.dataset.clusterPrimaryProduct || "",
    clusterPreviewPrimaryProduct: element.dataset.clusterPreviewPrimaryProduct || "",
    clusterPhase: element.dataset.clusterPhase || "",
    clusterRevision: Number(element.dataset.clusterRevision || 0),
    selectedId: element.dataset.productsSelectedId || "",
    selectedRoute: element.dataset.productsSelectedRoute || "",
    statuses: {
      controller: element.dataset.productsControllerStatus,
      crystals: element.dataset.productsCrystalsStatus,
      planet: element.dataset.productsPlanetStatus,
      cosmos: element.dataset.productsCosmosStatus,
      center: element.dataset.productsCenterControlStatus
    }
  }));
}

async function documentMetrics(page) {
  return page.evaluate(() => {
    const de = document.documentElement;
    const body = document.body;
    const scene = document.querySelector('[data-products-scene]')?.getBoundingClientRect();
    const planet = document.querySelector('[data-products-planet-mount]')?.getBoundingClientRect();
    const products = Array.from(document.querySelectorAll('[data-products-product]')).map(element => {
      const rect = element.getBoundingClientRect();
      return { id: element.dataset.productId, primary: element.dataset.primary, rect: { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height } };
    });
    function overlap(a, b) {
      if (!a || !b) return 0;
      return Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    }
    return {
      viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
      horizontalOverflowPx: Math.max(0, Math.max(de.scrollWidth, body?.scrollWidth || 0) - innerWidth),
      scene: scene ? { left: scene.left, right: scene.right, top: scene.top, bottom: scene.bottom, width: scene.width, height: scene.height } : null,
      planet: planet ? { left: planet.left, right: planet.right, top: planet.top, bottom: planet.bottom, width: planet.width, height: planet.height } : null,
      maximumPlanetProductOverlap: planet ? Math.max(0, ...products.map(product => overlap(planet, product.rect))) : null,
      products
    };
  });
}

async function visibleLabels(page) {
  return page.$$eval(SELECTORS.products, elements => elements.filter(element => {
    if (element.dataset.primary !== "true") return false;
    return Array.from(element.children).some(child => {
      const style = getComputedStyle(child);
      const rect = child.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0.01 && rect.width > 0 && rect.height > 0;
    });
  }).map(element => element.dataset.productId));
}

async function waitForReady(page) {
  await page.waitForSelector(SELECTORS.root, { timeout: 15000 });
  await page.waitForFunction(() => {
    const root = document.querySelector('[data-page-id="products"]');
    return root && root.dataset.productsControllerStatus === "available" && root.dataset.productsCrystalsStatus === "available" && root.dataset.productsCosmosStatus === "available" && ["available", "held"].includes(root.dataset.productsPlanetStatus);
  }, { timeout: 30000 });
}

async function slowGesture(page, profile, rect) {
  const startX = rect.left + rect.width * 0.16;
  const endX = rect.left + rect.width * 0.45;
  const y = rect.top + rect.height * 0.68;
  const steps = 16;
  if (profile.hasTouch) {
    const client = await page.createCDPSession();
    await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: startX, y, radiusX: 8, radiusY: 8, force: 1, id: 1 }] });
    for (let i = 1; i <= steps; i += 1) {
      await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: startX + (endX - startX) * i / steps, y, radiusX: 8, radiusY: 8, force: 1, id: 1 }] });
      await sleep(45);
    }
    await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await client.detach();
  } else {
    await page.mouse.move(startX, y);
    await page.mouse.down();
    for (let i = 1; i <= steps; i += 1) {
      await page.mouse.move(startX + (endX - startX) * i / steps, y);
      await sleep(45);
    }
    await page.mouse.up();
  }
}

async function quickFlick(page, profile, rect) {
  const startX = rect.left + rect.width * 0.13;
  const endX = rect.left + rect.width * 0.56;
  const y = rect.top + rect.height * 0.72;
  await page.evaluate(({ selector, startX, endX, y, pointerType }) => {
    const scene = document.querySelector(selector);
    if (!scene) throw new Error("PRODUCTS_SCENE_NOT_FOUND_FOR_FLICK");
    const pointerId = 91;
    const send = (type, x, buttons) => scene.dispatchEvent(new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      composed: true,
      pointerId,
      pointerType,
      isPrimary: true,
      clientX: x,
      clientY: y,
      button: 0,
      buttons
    }));
    send("pointerdown", startX, 1);
    for (let index = 1; index <= 5; index += 1) {
      send("pointermove", startX + (endX - startX) * index / 5, 1);
    }
    send("pointerup", endX, 0);
  }, {
    selector: SELECTORS.scene,
    startX,
    endX,
    y,
    pointerType: profile.hasTouch ? "touch" : "mouse"
  });
}

async function runProfile(browser, profileName) {
  const { page, telemetry, profile } = await createPage(browser, profileName);
  const record = { profile: profileName, status: "PENDING", actions: [], screenshots: [], findings: [], telemetry };
  try {
    const response = await page.goto(`${ORIGIN}/products/`, { waitUntil: "domcontentloaded", timeout: 30000 });
    record.navigation = { status: response?.status() ?? null, url: page.url() };
    await waitForReady(page);
    await page.$eval(SELECTORS.scene, element => element.scrollIntoView({ block: "center", inline: "center" }));
    await sleep(1000);

    record.initial = await rootFacts(page);
    record.screenshots.push(await capture(page, profileName, "primary-entry"));
    if (record.initial.state !== "PRIMARY_ENTRY") record.findings.push({ id: "INITIAL_STATE_INVALID", observed: record.initial.state });

    await page.$eval(SELECTORS.primary, element => element.click());
    await page.waitForFunction(() => document.querySelector('[data-page-id="products"]')?.dataset.productsState === "CLUSTER_OPEN", { timeout: 10000 });
    await sleep(900);
    record.arenaOpen = await rootFacts(page);
    record.screenshots.push(await capture(page, profileName, "arena-open"));

    const sourceCounts = await page.evaluate(selectors => ({
      primary: document.querySelectorAll(selectors.primary).length,
      products: document.querySelectorAll(selectors.products).length,
      center: document.querySelectorAll(selectors.centerControl).length,
      planet: document.querySelectorAll(selectors.planetVisual).length,
      cosmos: document.querySelectorAll(selectors.cosmos).length,
      cosmosCanvases: document.querySelectorAll(selectors.cosmosCanvases).length,
      centerIsProduct: document.querySelector(selectors.centerControl)?.matches(selectors.products) || false,
      planetIsProduct: document.querySelector(selectors.planetMount)?.matches(selectors.products) || false
    }), SELECTORS);
    record.counts = sourceCounts;
    if (sourceCounts.primary !== 1) record.findings.push({ id: "PRIMARY_ENTRY_COUNT", observed: sourceCounts.primary });
    if (sourceCounts.products !== 6) record.findings.push({ id: "PRODUCT_STAR_COUNT", observed: sourceCounts.products });
    if (sourceCounts.center !== 1) record.findings.push({ id: "CENTER_CONTROL_COUNT", observed: sourceCounts.center });
    if (sourceCounts.planet !== 1) record.findings.push({ id: "CENTER_PLANET_COUNT", observed: sourceCounts.planet });
    if (sourceCounts.cosmos !== 1 || sourceCounts.cosmosCanvases !== 2) record.findings.push({ id: "COSMIC_FIELD_COUNT", observed: sourceCounts });
    if (sourceCounts.centerIsProduct || sourceCounts.planetIsProduct) record.findings.push({ id: "CENTER_REGISTERED_AS_PRODUCT", observed: sourceCounts });

    const sceneRect = await page.$eval(SELECTORS.scene, element => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    });
    const beforeGesture = await rootFacts(page);
    await slowGesture(page, profile, sceneRect);
    await sleep(1300);
    const afterGesture = await rootFacts(page);
    record.actions.push({ id: profile.hasTouch ? "TOUCH_ROTATION" : "POINTER_ROTATION", beforeGesture, afterGesture });
    if (afterGesture.clusterPhase !== "COMMITTED" || afterGesture.clusterRevision <= beforeGesture.clusterRevision) {
      record.findings.push({ id: "RELEASE_SETTLEMENT_FAILED", before: beforeGesture, after: afterGesture });
    }

    const labels = await visibleLabels(page);
    record.visibleLabels = labels;
    if (labels.length !== 1) record.findings.push({ id: "VISIBLE_PRODUCT_LABEL_COUNT", observed: labels });
    const resolver = await page.evaluate(() => ({
      visual: globalThis.DGB_PRODUCTS_CRYSTALS_RECEIPT?.visualPrimaryProductId || "",
      committed: globalThis.DGB_PRODUCTS_CONTROLLER_RECEIPT?.clusterPrimaryProduct || ""
    }));
    record.labelResolver = resolver;
    if (labels[0] !== resolver.visual) record.findings.push({ id: "LABEL_FRONTMOST_MISMATCH", labels, resolver });
    if (afterGesture.clusterPhase === "COMMITTED" && resolver.visual !== resolver.committed) record.findings.push({ id: "SETTLED_LABEL_COMMITTED_MISMATCH", resolver });

    record.selections = [];
    for (const product of PRODUCTS) {
      await page.$eval(`${SELECTORS.products}[data-product-id="${product.id}"]`, element => element.click());
      await page.waitForFunction(id => document.querySelector('[data-page-id="products"]')?.dataset.productsSelectedId === id, { timeout: 8000 }, product.id);
      const selection = await page.evaluate((id, route, enterSelector) => {
        const root = document.querySelector('[data-page-id="products"]');
        const enter = document.querySelector(enterSelector);
        return { id, expectedRoute: route, state: root?.dataset.productsState, selectedId: root?.dataset.productsSelectedId, selectedRoute: root?.dataset.productsSelectedRoute, enterHref: enter?.getAttribute("href") || "", enterAriaDisabled: enter?.getAttribute("aria-disabled") };
      }, product.id, product.route, SELECTORS.enterProduct);
      selection.pass = selection.state === "PRODUCT_SELECTED" && selection.selectedId === product.id && selection.selectedRoute === product.route && selection.enterHref === product.route && selection.enterAriaDisabled === "false";
      record.selections.push(selection);
      if (!selection.pass) record.findings.push({ id: "PRODUCT_SELECTION_ROUTE_MISMATCH", selection });
      await page.$eval(SELECTORS.returnToOrbit, element => element.click());
      await page.waitForFunction(() => document.querySelector('[data-page-id="products"]')?.dataset.productsState === "CLUSTER_OPEN", { timeout: 8000 });
    }

    await page.$eval(SELECTORS.scene, element => element.scrollIntoView({ block: "center", inline: "center" }));
    await sleep(700);
    const flickSceneRect = await page.$eval(SELECTORS.scene, element => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    });
    record.quickFlickDriver = "DETERMINISTIC_POINTER_CONTRACT";
    await quickFlick(page, profile, flickSceneRect);
    await page.waitForFunction(() => document.querySelector('[data-page-id="products"]')?.dataset.productsState === "PRIMARY_ENTRY", { timeout: 10000 }).catch(() => {});
    await sleep(800);
    record.afterFlick = await rootFacts(page);
    record.afterFlickPathname = new URL(page.url()).pathname;
    record.afterFlickRendererReceipt = await page.evaluate(() => globalThis.DGB_PRODUCTS_CRYSTALS_RECEIPT || null);
    if (record.afterFlick.state !== "PRIMARY_ENTRY" || record.afterFlickPathname !== "/products/") {
      record.findings.push({ id: "QUICK_FLICK_LOCAL_RETURN_FAILED", observed: { facts: record.afterFlick, pathname: record.afterFlickPathname } });
    }

    await page.$eval(SELECTORS.primary, element => element.click());
    await page.waitForFunction(() => document.querySelector('[data-page-id="products"]')?.dataset.productsState === "CLUSTER_OPEN", { timeout: 8000 });
    await page.$eval(SELECTORS.centerControl, element => element.click());
    await page.waitForFunction(() => location.pathname === "/", { timeout: 10000 });
    record.centerReturn = { pathname: new URL(page.url()).pathname, receipt: await page.evaluate(() => globalThis.DGB_PRODUCTS_CENTER_CONTROL_RECEIPT || null) };
    if (record.centerReturn.pathname !== "/") record.findings.push({ id: "CENTER_GLOBE_RETURN_FAILED", observed: record.centerReturn });
    record.centerDestinationTelemetry = {
      console: telemetry.console.slice(),
      pageErrors: telemetry.pageErrors.slice(),
      requestFailures: telemetry.requestFailures.slice()
    };
    telemetry.console.length = 0;
    telemetry.pageErrors.length = 0;
    telemetry.requestFailures.length = 0;

    await page.goto(`${ORIGIN}/products/`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await waitForReady(page);
    await page.$eval(SELECTORS.primary, element => element.click());
    await sleep(700);
    record.metrics = await documentMetrics(page);
    if (record.metrics.horizontalOverflowPx > 1) record.findings.push({ id: "HORIZONTAL_OVERFLOW", observed: record.metrics.horizontalOverflowPx });
    if ((record.metrics.maximumPlanetProductOverlap || 0) > 1) record.findings.push({ id: "CENTER_PLANET_STAR_COLLISION", observed: record.metrics.maximumPlanetProductOverlap });
    record.screenshots.push(await capture(page, profileName, "final-arena"));

    const relevantConsoleErrors = telemetry.console.filter(item => item.type === "error");
    if (telemetry.pageErrors.length) record.findings.push({ id: "PAGE_ERRORS", observed: telemetry.pageErrors });
    if (telemetry.requestFailures.length) record.findings.push({ id: "REQUEST_FAILURES", observed: telemetry.requestFailures });
    if (relevantConsoleErrors.length) record.findings.push({ id: "CONSOLE_ERRORS", observed: relevantConsoleErrors });

    record.status = record.findings.length ? "FAIL" : "PASS";
  } catch (error) {
    record.status = "FAIL";
    record.findings.push({ id: "SCENARIO_EXCEPTION", message: String(error?.stack || error) });
  } finally {
    await page.close();
  }
  return record;
}

const browser = await puppeteer.launch(launchOptions());
const profiles = [];
try {
  for (const profileName of Object.keys(PROFILES)) profiles.push(await runProfile(browser, profileName));
} finally {
  await browser.close();
}

const blockingFindings = profiles.flatMap(profile => profile.findings.map(finding => ({ profile: profile.profile, ...finding })));
const receipt = {
  tool: TOOL_ID,
  origin: ORIGIN,
  generatedAt: new Date().toISOString(),
  classification: "EXECUTED_ARENA_CLUSTER_BENCHMARK",
  profiles,
  blockingFindings,
  deferableFindings: [],
  environmentalHolds: [],
  pass: blockingFindings.length === 0,
  claimBoundary: {
    canonicalEstateStandard: false,
    allBrowserCompatibility: false,
    allDeviceCompatibility: false,
    humanFactorsValidation: false,
    deploymentSuccess: false,
    publicAcceptance: false,
    commercialReadiness: false
  }
};

await fs.writeFile(OUTPUTS.receipt, JSON.stringify(receipt, null, 2));
console.log(JSON.stringify({ tool: TOOL_ID, pass: receipt.pass, profiles: profiles.map(profile => ({ profile: profile.profile, status: profile.status, findings: profile.findings.length })), blockingFindings: blockingFindings.length }, null, 2));
if (!receipt.pass) process.exitCode = 1;
