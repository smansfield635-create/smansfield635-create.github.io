import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import puppeteer from "puppeteer-core";
import { TOOL_ID, ORIGIN, PROFILES, PRODUCTS, SELECTORS, OUTPUTS } from "./products-arena-cluster-benchmark.config.mjs";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const digest = buffer => crypto.createHash("sha256").update(buffer).digest("hex");
const screenshotRoot = path.resolve(OUTPUTS.screenshots);
await fs.mkdir(screenshotRoot, { recursive: true });

const launchOptions = () => ({
  executablePath: process.env.CHROME_PATH || process.env.CHROME_BIN || "/usr/bin/google-chrome",
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--enable-webgl", "--ignore-gpu-blocklist", "--use-gl=swiftshader", "--hide-scrollbars"]
});

async function createPage(browser, profileName) {
  const page = await browser.newPage();
  await page.setViewport(PROFILES[profileName]);
  const telemetry = { console: [], pageErrors: [], requestFailures: [], navigations: [] };
  page.on("console", message => telemetry.console.push({ type: message.type(), text: message.text() }));
  page.on("pageerror", error => telemetry.pageErrors.push(String(error?.message || error)));
  page.on("requestfailed", request => telemetry.requestFailures.push({ url: request.url(), error: request.failure()?.errorText || "" }));
  page.on("framenavigated", frame => { if (frame === page.mainFrame()) telemetry.navigations.push(frame.url()); });
  return { page, telemetry };
}

async function capture(page, profileName, label) {
  const file = path.join(screenshotRoot, `${profileName.toLowerCase()}-${label}.png`);
  const buffer = await page.screenshot({ path: file, type: "png", fullPage: false });
  return { file, bytes: buffer.length, sha256: digest(buffer) };
}

async function gotoProducts(page) {
  const response = await page.goto(`${ORIGIN}/products/`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForSelector(SELECTORS.root, { timeout: 15000 });
  await page.waitForFunction(() => {
    const root = document.querySelector('[data-page-id="products"]');
    const planet = globalThis.DGB_PRODUCTS_CENTER_PLANET_RECEIPT;
    const controller = globalThis.DGB_PRODUCTS_CONTROLLER_RECEIPT;
    const center = document.querySelector("[data-products-center-control]");
    return Boolean(root?.dataset.productsControllerStatus === "available" && root?.dataset.productsCrystalsStatus === "available" && root?.dataset.productsCosmosStatus === "available" && root?.dataset.productsPlanetStatus === "available" && controller?.status === "available" && planet?.ready === true && planet?.failed === false && Number(planet?.renderFrames || 0) > 0 && center?.querySelector("[data-products-planet-mount]"));
  }, { timeout: 30000 });
  return response?.status() ?? null;
}

async function openCluster(page) {
  await page.$eval(SELECTORS.primary, element => element.click());
  await page.waitForFunction(() => document.querySelector('[data-page-id="products"]')?.dataset.productsState === "CLUSTER_OPEN", { timeout: 10000 });
  await page.waitForFunction(() => {
    const control = document.querySelector("[data-products-center-control]");
    return Boolean(control && !control.hidden && !control.disabled);
  }, { timeout: 10000 });
  await sleep(300);
}

async function scrollSceneIntoGestureView(page) {
  await page.$eval(SELECTORS.scene, element => element.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" }));
  await sleep(150);
}

async function slowDrag(page) {
  await scrollSceneIntoGestureView(page);
  const rect = await page.$eval(SELECTORS.scene, element => {
    const value = element.getBoundingClientRect();
    return { left: value.left, top: value.top, width: value.width, height: value.height, viewportHeight: innerHeight };
  });
  const startX = rect.left + rect.width * 0.18;
  const endX = rect.left + rect.width * 0.52;
  const y = Math.min(rect.viewportHeight - 24, Math.max(24, rect.top + rect.height * 0.62));
  await page.mouse.move(startX, y);
  await page.mouse.down();
  for (let index = 1; index <= 16; index += 1) {
    await page.mouse.move(startX + ((endX - startX) * index) / 16, y);
    await sleep(35);
  }
  await page.mouse.up();
}

async function facts(page) {
  return page.evaluate(products => {
    const root = document.querySelector('[data-page-id="products"]');
    const center = document.querySelector("[data-products-center-control]");
    const planet = center?.querySelector("[data-products-planet-mount]");
    const canvas = planet?.querySelector("[data-products-planet-canvas]");
    const option = document.querySelector("[data-products-return-main-compass]");
    const rect = value => value ? { width: value.width, height: value.height, centerX: value.left + value.width / 2, centerY: value.top + value.height / 2 } : null;
    const cr = center?.getBoundingClientRect();
    const pr = planet?.getBoundingClientRect();
    return {
      state: root?.dataset.productsState || "",
      disclosure: root?.dataset.productsCenterDisclosure || "",
      productCount: document.querySelectorAll("[data-products-product]").length,
      cardinalCount: document.querySelectorAll("[data-products-cardinal]").length,
      centerControlCount: document.querySelectorAll("[data-products-center-control]").length,
      nestedPlanetMountCount: document.querySelectorAll("[data-products-center-control] [data-products-planet-mount]").length,
      accessibleName: center?.getAttribute("aria-label") || "",
      role: center?.dataset.productsCenterRole || "",
      expanded: center?.getAttribute("aria-expanded") || "",
      optionHidden: option?.hidden ?? true,
      center: rect(cr),
      planet: rect(pr),
      canvasPresent: Boolean(canvas),
      horizontalOverflowPx: Math.max(0, Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0) - innerWidth),
      routes: products.map(product => ({ id: product.id, expected: product.route, observed: document.querySelector(`[data-products-product][data-product-id="${product.id}"]`)?.dataset.route || "" }))
    };
  }, PRODUCTS);
}

async function runProfile(browser, profileName) {
  const { page, telemetry } = await createPage(browser, profileName);
  const record = { profile: profileName, status: "PENDING", actions: [], screenshots: [], findings: [], telemetry };
  const fail = (id, observed) => record.findings.push({ id, observed });
  try {
    record.responseStatus = await gotoProducts(page);
    await openCluster(page);
    await scrollSceneIntoGestureView(page);
    record.screenshots.push(await capture(page, profileName, "cluster-open"));
    record.initial = await facts(page);
    if (record.initial.productCount !== 6) fail("PRODUCT_COUNT", record.initial);
    if (record.initial.cardinalCount !== 0) fail("CARDINAL_COUNT", record.initial);
    if (record.initial.horizontalOverflowPx !== 0) fail("HORIZONTAL_OVERFLOW", record.initial);
    if (record.initial.routes.some(route => route.expected !== route.observed)) fail("ALL_SIX_ROUTES", record.initial.routes);
    if (record.initial.centerControlCount !== 1 || record.initial.nestedPlanetMountCount !== 1 || !record.initial.canvasPresent) fail("CENTER_RENDERED_AUTHORITY", record.initial);
    if (record.initial.accessibleName !== "Open Main Compass return options" || record.initial.role !== "MAIN_COMPASS_RETURN_DISCLOSURE") fail("CENTER_SEMANTICS", record.initial);
    if (record.initial.center && record.initial.planet && (Math.abs(record.initial.center.width - record.initial.planet.width) > 1 || Math.abs(record.initial.center.height - record.initial.planet.height) > 1)) fail("PLANET_AND_CONTROL_SHARED_SIZE", record.initial);

    await page.$eval(SELECTORS.centerControl, element => element.click());
    await page.waitForFunction(() => document.querySelector('[data-page-id="products"]')?.dataset.productsCenterDisclosure === "open" && document.querySelector("[data-products-return-main-compass]")?.hidden === false, { timeout: 8000 });
    record.disclosed = await facts(page);
    record.screenshots.push(await capture(page, profileName, "center-disclosed"));
    if (record.disclosed.expanded !== "true" || record.disclosed.optionHidden) fail("CENTER_DISCLOSURE", record.disclosed);

    await gotoProducts(page);
    await openCluster(page);
    const beforeDrag = await page.$eval(SELECTORS.root, element => Number(element.dataset.clusterRevision || 0));
    await slowDrag(page);
    await sleep(900);
    const afterDrag = await page.$eval(SELECTORS.root, element => ({ revision: Number(element.dataset.clusterRevision || 0), phase: element.dataset.clusterPhase || "", disclosure: element.dataset.productsCenterDisclosure || "" }));
    record.actions.push({ id: "PRODUCT_DRAG", beforeDrag, afterDrag });
    if (afterDrag.revision <= beforeDrag || afterDrag.phase !== "COMMITTED") fail("PRODUCT_DRAG", { beforeDrag, afterDrag });
    if (afterDrag.disclosure === "open") fail("DRAG_MUST_NOT_ACTIVATE_CENTER", afterDrag);

    record.selections = [];
    for (const product of PRODUCTS) {
      await page.$eval(`${SELECTORS.products}[data-product-id="${product.id}"]`, element => element.click());
      await page.waitForFunction(id => document.querySelector('[data-page-id="products"]')?.dataset.productsSelectedId === id, { timeout: 8000 }, product.id);
      const selection = await page.evaluate((id, route) => ({
        id,
        route,
        selectedId: document.querySelector('[data-page-id="products"]')?.dataset.productsSelectedId || "",
        selectedRoute: document.querySelector('[data-page-id="products"]')?.dataset.productsSelectedRoute || "",
        enterHref: document.querySelector('[data-products-enter]')?.getAttribute("href") || "",
        previewTitle: document.querySelector('[data-products-preview-title]')?.textContent?.trim() || ""
      }), product.id, product.route);
      selection.pass = selection.selectedId === product.id && selection.selectedRoute === product.route && selection.enterHref === product.route && selection.previewTitle.length > 0;
      record.selections.push(selection);
      if (!selection.pass) fail("PRODUCT_SELECTION_ROUTE", selection);
      await page.$eval(SELECTORS.returnToOrbit, element => element.click());
      await page.waitForFunction(() => document.querySelector('[data-page-id="products"]')?.dataset.productsState === "CLUSTER_OPEN", { timeout: 8000 });
    }

    await page.$eval(SELECTORS.centerControl, element => element.click());
    await page.waitForFunction(() => document.querySelector("[data-products-return-main-compass]")?.hidden === false, { timeout: 8000 });
    await page.$eval("[data-products-return-main-compass]", element => element.click());
    await page.waitForFunction(() => location.pathname === "/", { timeout: 10000 });
    if (new URL(page.url()).pathname !== "/") fail("EXPLICIT_RETURN_ACTION", page.url());

    telemetry.console.length = 0;
    telemetry.pageErrors.length = 0;
    telemetry.requestFailures.length = 0;
    await gotoProducts(page);
    await openCluster(page);
    await scrollSceneIntoGestureView(page);
    record.screenshots.push(await capture(page, profileName, "final-candidate"));
    const consoleErrors = telemetry.console.filter(item => item.type === "error");
    if (telemetry.pageErrors.length) fail("PAGE_ERRORS", telemetry.pageErrors);
    if (telemetry.requestFailures.length) fail("REQUEST_FAILURES", telemetry.requestFailures);
    if (consoleErrors.length) fail("CONSOLE_ERRORS", consoleErrors);
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
try { for (const profileName of Object.keys(PROFILES)) profiles.push(await runProfile(browser, profileName)); }
finally { await browser.close(); }
const blockingFindings = profiles.flatMap(profile => profile.findings.map(finding => ({ profile: profile.profile, ...finding })));
const receipt = {
  tool: TOOL_ID,
  origin: ORIGIN,
  generatedAt: new Date().toISOString(),
  classification: "EXECUTED_PRODUCTS_ARCHCOIN_GLOBE_ALIGNMENT_CANDIDATE",
  checkpoint: "PRODUCTS_ARENA_CLUSTER_ACCEPTED_COMPASS_CONTINUITY_CHECKPOINT_4",
  profiles,
  blockingFindings,
  deferableFindings: [],
  environmentalHolds: [],
  pass: blockingFindings.length === 0,
  acceptanceContract: { oneCenterControl: true, renderedGlobeInsideControl: true, centerAccessibleName: "Open Main Compass return options", singleTapDisclosure: true, explicitReturnNavigation: true, dragDoesNotActivateCenter: true, productDragPreserved: true, productSelectionPreserved: true, productCount: 6, cardinalCount: 0, allSixRoutesPass: true, horizontalOverflowMaximum: 0, planetAndControlSharedSize: true, archcoinAffordanceModel: true },
  claimBoundary: { physicalSamsungAcceptance: false, productionDeployment: false, mergeAuthorization: false, visualAcceptance: false }
};
await fs.writeFile(OUTPUTS.receipt, JSON.stringify(receipt, null, 2));
console.log(JSON.stringify({ tool: TOOL_ID, pass: receipt.pass, profiles: profiles.map(profile => ({ profile: profile.profile, status: profile.status, findings: profile.findings.length })), blockingFindings: blockingFindings.length }, null, 2));
if (!receipt.pass) process.exitCode = 1;
