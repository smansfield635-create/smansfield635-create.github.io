import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import puppeteer from "puppeteer-core";
import {
  TOOL_ID,
  ORIGIN,
  PROFILES,
  PRODUCTS,
  SELECTORS,
  OUTPUTS
} from "./products-arena-cluster-benchmark.config.mjs";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const digest = buffer => crypto.createHash("sha256").update(buffer).digest("hex");
const screenshotRoot = path.resolve(OUTPUTS.screenshots);
await fs.mkdir(screenshotRoot, { recursive: true });

function launchOptions() {
  return {
    executablePath:
      process.env.CHROME_PATH ||
      process.env.CHROME_BIN ||
      "/usr/bin/google-chrome",
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
  page.on("requestfailed", request => telemetry.requestFailures.push({
    url: request.url(),
    error: request.failure()?.errorText || ""
  }));
  page.on("framenavigated", frame => {
    if (frame === page.mainFrame()) telemetry.navigations.push(frame.url());
  });
  return { page, profile, telemetry };
}

async function capture(page, profileName, label) {
  const file = path.join(screenshotRoot, `${profileName.toLowerCase()}-${label}.png`);
  const buffer = await page.screenshot({ path: file, type: "png", fullPage: false });
  return { file, bytes: buffer.length, sha256: digest(buffer) };
}

async function waitForReady(page) {
  await page.waitForSelector(SELECTORS.root, { timeout: 15000 });
  await page.waitForFunction(() => {
    const root = document.querySelector('[data-page-id="products"]');
    const planet = globalThis.DGB_PRODUCTS_CENTER_PLANET_RECEIPT;
    const controller = globalThis.DGB_PRODUCTS_CONTROLLER_RECEIPT;
    const centerControl = document.querySelector("[data-products-center-control]");
    const nestedPlanet = centerControl?.querySelector("[data-products-planet-mount]");
    return Boolean(
      root &&
      root.dataset.productsControllerStatus === "available" &&
      root.dataset.productsCrystalsStatus === "available" &&
      root.dataset.productsCosmosStatus === "available" &&
      root.dataset.productsPlanetStatus === "available" &&
      controller?.status === "available" &&
      planet?.ready === true &&
      planet?.failed === false &&
      planet?.fallback === false &&
      Number(planet?.renderFrames || 0) > 0 &&
      centerControl &&
      nestedPlanet
    );
  }, { timeout: 30000 });
}

async function gotoProducts(page) {
  const response = await page.goto(`${ORIGIN}/products/`, {
    waitUntil: "domcontentloaded",
    timeout: 30000
  });
  await waitForReady(page);
  return response?.status() ?? null;
}

async function openCluster(page) {
  await page.$eval(SELECTORS.primary, element => element.click());
  await page.waitForFunction(() =>
    document.querySelector('[data-page-id="products"]')?.dataset.productsState === "CLUSTER_OPEN",
  { timeout: 10000 });
  await page.waitForFunction(() => {
    const control = document.querySelector("[data-products-center-control]");
    return Boolean(control && !control.hidden && !control.disabled);
  }, { timeout: 10000 });
  await sleep(350);
}

function rectRecord(rect) {
  return rect ? {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2
  } : null;
}

async function presentationFacts(page) {
  return page.evaluate(() => {
    const root = document.querySelector('[data-page-id="products"]');
    const scene = document.querySelector("[data-products-scene]");
    const control = document.querySelector("[data-products-center-control]");
    const planet = control?.querySelector("[data-products-planet-mount]");
    const canvas = planet?.querySelector("[data-products-planet-canvas]");
    const option = document.querySelector("[data-products-return-main-compass]");
    const controlRect = control?.getBoundingClientRect();
    const planetRect = planet?.getBoundingClientRect();
    const canvasRect = canvas?.getBoundingClientRect();
    const sceneRect = scene?.getBoundingClientRect();
    const style = control ? getComputedStyle(control) : null;
    const focusStyle = control ? getComputedStyle(control) : null;
    const convert = value => value ? {
      left: value.left,
      top: value.top,
      width: value.width,
      height: value.height,
      centerX: value.left + value.width / 2,
      centerY: value.top + value.height / 2
    } : null;
    return {
      state: root?.dataset.productsState || "",
      disclosure: root?.dataset.productsCenterDisclosure || "",
      centerControlCount: document.querySelectorAll("[data-products-center-control]").length,
      nestedPlanetMountCount: document.querySelectorAll("[data-products-center-control] [data-products-planet-mount]").length,
      accessibleName: control?.getAttribute("aria-label") || "",
      role: control?.dataset.productsCenterRole || "",
      expanded: control?.getAttribute("aria-expanded") || "",
      hidden: control?.hidden ?? true,
      disabled: control?.disabled ?? true,
      optionHidden: option?.hidden ?? true,
      optionAriaHidden: option?.getAttribute("aria-hidden") || "",
      control: convert(controlRect),
      planet: convert(planetRect),
      canvas: convert(canvasRect),
      scene: convert(sceneRect),
      cursor: style?.cursor || "",
      touchAction: style?.touchAction || "",
      filter: focusStyle?.filter || "",
      controllerReceipt: globalThis.DGB_PRODUCTS_CONTROLLER_RECEIPT
        ? JSON.parse(JSON.stringify(globalThis.DGB_PRODUCTS_CONTROLLER_RECEIPT))
        : null,
      planetReceipt: globalThis.DGB_PRODUCTS_CENTER_PLANET_RECEIPT
        ? JSON.parse(JSON.stringify(globalThis.DGB_PRODUCTS_CENTER_PLANET_RECEIPT))
        : null
    };
  });
}

async function productFacts(page) {
  return page.evaluate(products => {
    const root = document.querySelector('[data-page-id="products"]');
    const de = document.documentElement;
    const body = document.body;
    const labels = [...document.querySelectorAll("[data-products-product]")]
      .map(element => {
        const style = getComputedStyle(element, "::after");
        const rect = element.getBoundingClientRect();
        return {
          id: element.dataset.productId,
          primary: element.dataset.primary === "true",
          selected: element.dataset.selected === "true",
          visible: !element.hidden && rect.width > 1 && rect.height > 1,
          projectedLabelOpacity: Number(style.opacity || 0)
        };
      });
    return {
      state: root?.dataset.productsState || "",
      productCount: document.querySelectorAll("[data-products-product]").length,
      cardinalCount: document.querySelectorAll("[data-products-cardinal]").length,
      visibleLabels: labels.filter(record => record.visible),
      projectedPrimaryLabels: labels.filter(record => record.primary && record.projectedLabelOpacity > 0.01),
      horizontalOverflowPx: Math.max(
        0,
        Math.max(de.scrollWidth, body?.scrollWidth || 0) - innerWidth
      ),
      routes: products.map(product => {
        const element = document.querySelector(`[data-products-product][data-product-id="${product.id}"]`);
        return { id: product.id, expected: product.route, observed: element?.dataset.route || "" };
      })
    };
  }, PRODUCTS);
}

async function slowDrag(page) {
  const rect = await page.$eval(SELECTORS.scene, element => {
    const value = element.getBoundingClientRect();
    return { left: value.left, top: value.top, width: value.width, height: value.height };
  });
  const startX = rect.left + rect.width * 0.18;
  const endX = rect.left + rect.width * 0.52;
  const y = rect.top + rect.height * 0.72;
  await page.mouse.move(startX, y);
  await page.mouse.down();
  for (let index = 1; index <= 16; index += 1) {
    await page.mouse.move(startX + ((endX - startX) * index) / 16, y);
    await sleep(35);
  }
  await page.mouse.up();
}

async function runProfile(browser, profileName) {
  const { page, telemetry } = await createPage(browser, profileName);
  const record = { profile: profileName, status: "PENDING", actions: [], screenshots: [], findings: [], telemetry };
  const fail = (id, observed) => record.findings.push({ id, observed });

  try {
    record.responseStatus = await gotoProducts(page);
    await openCluster(page);
    record.screenshots.push(await capture(page, profileName, "cluster-open"));

    record.products = await productFacts(page);
    record.presentationInitial = await presentationFacts(page);

    if (record.products.productCount !== 6) fail("PRODUCT_COUNT", record.products.productCount);
    if (record.products.cardinalCount !== 0) fail("CARDINAL_COUNT", record.products.cardinalCount);
    if (record.products.horizontalOverflowPx !== 0) fail("HORIZONTAL_OVERFLOW", record.products.horizontalOverflowPx);
    if (record.products.routes.some(route => route.expected !== route.observed)) fail("ALL_SIX_ROUTES", record.products.routes);
    if (record.presentationInitial.centerControlCount !== 1) fail("CENTER_CONTROL_COUNT", record.presentationInitial);
    if (record.presentationInitial.nestedPlanetMountCount !== 1) fail("NESTED_PLANET_MOUNT", record.presentationInitial);
    if (record.presentationInitial.accessibleName !== "Open Main Compass return options") fail("CENTER_ACCESSIBLE_NAME", record.presentationInitial);
    if (record.presentationInitial.role !== "MAIN_COMPASS_RETURN_DISCLOSURE") fail("CENTER_ROLE", record.presentationInitial);
    if (record.presentationInitial.hidden || record.presentationInitial.disabled) fail("CENTER_AVAILABLE", record.presentationInitial);
    if (!record.presentationInitial.control || !record.presentationInitial.planet || !record.presentationInitial.canvas) fail("CENTER_RENDERED_BOUNDS", record.presentationInitial);
    if (
      record.presentationInitial.control && record.presentationInitial.planet &&
      (Math.abs(record.presentationInitial.control.width - record.presentationInitial.planet.width) > 1 ||
       Math.abs(record.presentationInitial.control.height - record.presentationInitial.planet.height) > 1)
    ) fail("PLANET_AND_CONTROL_SHARED_SIZE", record.presentationInitial);

    await page.$eval(SELECTORS.centerControl, element => element.click());
    await page.waitForFunction(() => {
      const root = document.querySelector('[data-page-id="products"]');
      const control = document.querySelector("[data-products-center-control]");
      const option = document.querySelector("[data-products-return-main-compass]");
      return root?.dataset.productsCenterDisclosure === "open" &&
        control?.getAttribute("aria-expanded") === "true" &&
        option && !option.hidden;
    }, { timeout: 8000 });
    record.presentationDisclosed = await presentationFacts(page);
    record.actions.push({ id: "CENTER_GLOBE_DISCLOSE", observed: record.presentationDisclosed });
    record.screenshots.push(await capture(page, profileName, "center-disclosed"));

    if (record.presentationDisclosed.expanded !== "true") fail("CENTER_DISCLOSURE_EXPANDED", record.presentationDisclosed);
    if (record.presentationDisclosed.optionHidden) fail("CENTER_RETURN_OPTION_VISIBLE", record.presentationDisclosed);

    await gotoProducts(page);
    await openCluster(page);
    const beforeDrag = await page.$eval(SELECTORS.root, element => Number(element.dataset.clusterRevision || 0));
    await slowDrag(page);
    await sleep(1000);
    const afterDrag = await page.$eval(SELECTORS.root, element => ({
      revision: Number(element.dataset.clusterRevision || 0),
      phase: element.dataset.clusterPhase || "",
      disclosure: element.dataset.productsCenterDisclosure || ""
    }));
    record.actions.push({ id: "PRODUCT_DRAG", beforeDrag, afterDrag });
    if (afterDrag.revision <= beforeDrag || afterDrag.phase !== "COMMITTED") fail("PRODUCT_DRAG", { beforeDrag, afterDrag });
    if (afterDrag.disclosure === "open") fail("DRAG_MUST_NOT_ACTIVATE_CENTER", afterDrag);

    record.selections = [];
    for (const product of PRODUCTS) {
      await page.$eval(`${SELECTORS.products}[data-product-id="${product.id}"]`, element => element.click());
      await page.waitForFunction(id =>
        document.querySelector('[data-page-id="products"]')?.dataset.productsSelectedId === id,
      { timeout: 8000 }, product.id);
      const selection = await page.evaluate((id, route) => {
        const root = document.querySelector('[data-page-id="products"]');
        const enter = document.querySelector('[data-products-enter]');
        const preview = document.querySelector('[data-products-preview-title]');
        return {
          id,
          route,
          selectedId: root?.dataset.productsSelectedId || "",
          selectedRoute: root?.dataset.productsSelectedRoute || "",
          enterHref: enter?.getAttribute("href") || "",
          previewTitle: preview?.textContent?.trim() || ""
        };
      }, product.id, product.route);
      selection.pass = selection.selectedId === product.id &&
        selection.selectedRoute === product.route &&
        selection.enterHref === product.route &&
        selection.previewTitle.length > 0;
      record.selections.push(selection);
      if (!selection.pass) fail("PRODUCT_SELECTION_ROUTE", selection);
      await page.$eval(SELECTORS.returnToOrbit, element => element.click());
      await page.waitForFunction(() =>
        document.querySelector('[data-page-id="products"]')?.dataset.productsState === "CLUSTER_OPEN",
      { timeout: 8000 });
    }

    await page.$eval(SELECTORS.centerControl, element => element.click());
    await page.waitForFunction(() =>
      document.querySelector("[data-products-return-main-compass]")?.hidden === false,
    { timeout: 8000 });
    await page.$eval("[data-products-return-main-compass]", element => element.click());
    await page.waitForFunction(() => location.pathname === "/", { timeout: 10000 });
    const explicitPath = new URL(page.url()).pathname;
    record.actions.push({ id: "EXPLICIT_RETURN_ACTION", pathname: explicitPath });
    if (explicitPath !== "/") fail("EXPLICIT_RETURN_ACTION", explicitPath);

    telemetry.console.length = 0;
    telemetry.pageErrors.length = 0;
    telemetry.requestFailures.length = 0;
    await gotoProducts(page);
    await openCluster(page);
    record.screenshots.push(await capture(page, profileName, "final-candidate"));

    const relevantConsoleErrors = telemetry.console.filter(item => item.type === "error");
    if (telemetry.pageErrors.length) fail("PAGE_ERRORS", telemetry.pageErrors);
    if (telemetry.requestFailures.length) fail("REQUEST_FAILURES", telemetry.requestFailures);
    if (relevantConsoleErrors.length) fail("CONSOLE_ERRORS", relevantConsoleErrors);

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
  for (const profileName of Object.keys(PROFILES)) {
    profiles.push(await runProfile(browser, profileName));
  }
} finally {
  await browser.close();
}

const blockingFindings = profiles.flatMap(profile =>
  profile.findings.map(finding => ({ profile: profile.profile, ...finding }))
);

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
  acceptanceContract: {
    oneCenterControl: true,
    renderedGlobeInsideControl: true,
    centerAccessibleName: "Open Main Compass return options",
    singleTapDisclosure: true,
    explicitReturnNavigation: true,
    dragDoesNotActivateCenter: true,
    productDragPreserved: true,
    productSelectionPreserved: true,
    productCount: 6,
    cardinalCount: 0,
    allSixRoutesPass: true,
    horizontalOverflowMaximum: 0,
    planetAndControlSharedSize: true,
    archcoinAffordanceModel: true
  },
  claimBoundary: {
    physicalSamsungAcceptance: false,
    productionDeployment: false,
    mergeAuthorization: false,
    visualAcceptance: false
  }
};

await fs.writeFile(OUTPUTS.receipt, JSON.stringify(receipt, null, 2));
console.log(JSON.stringify({
  tool: TOOL_ID,
  pass: receipt.pass,
  profiles: profiles.map(profile => ({
    profile: profile.profile,
    status: profile.status,
    findings: profile.findings.length
  })),
  blockingFindings: blockingFindings.length
}, null, 2));

if (!receipt.pass) process.exitCode = 1;