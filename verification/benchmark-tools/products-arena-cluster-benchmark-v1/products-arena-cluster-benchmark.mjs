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
    return Boolean(
      root &&
      root.dataset.productsControllerStatus === "available" &&
      root.dataset.productsCrystalsStatus === "available" &&
      root.dataset.productsCosmosStatus === "available" &&
      root.dataset.productsPlanetStatus === "available" &&
      root.dataset.productsCenterControlStatus === "available" &&
      planet?.ready === true &&
      planet?.failed === false &&
      planet?.fallback === false &&
      Number(planet?.renderFrames || 0) > 0
    );
  }, { timeout: 30000 });
}

async function openArena(page) {
  await page.$eval(SELECTORS.primary, element => element.click());
  await page.waitForFunction(() =>
    document.querySelector('[data-page-id="products"]')?.dataset.productsState === "CLUSTER_OPEN",
  { timeout: 10000 });
  await sleep(500);
}

async function gotoProducts(page) {
  const response = await page.goto(`${ORIGIN}/products/`, {
    waitUntil: "domcontentloaded",
    timeout: 30000
  });
  await waitForReady(page);
  return response?.status() ?? null;
}

async function dispatchCenterSequence(page, steps) {
  return page.evaluate(({ selector, steps }) => {
    const control = document.querySelector(selector);
    if (!control) throw new Error("PRODUCTS_CENTER_CONTROL_NOT_FOUND");
    const rect = control.getBoundingClientRect();
    const base = {
      bubbles: true,
      cancelable: true,
      composed: true,
      pointerId: 77,
      pointerType: "touch",
      isPrimary: true,
      button: 0
    };
    for (const step of steps) {
      control.dispatchEvent(new PointerEvent(step.type, {
        ...base,
        clientX: rect.left + rect.width / 2 + (step.dx || 0),
        clientY: rect.top + rect.height / 2 + (step.dy || 0),
        buttons: step.type === "pointerup" || step.type === "pointercancel" ? 0 : 1
      }));
    }
  }, { selector: SELECTORS.centerControl, steps });
}

const tapCenter = page => dispatchCenterSequence(page, [
  { type: "pointerdown" },
  { type: "pointerup" }
]);

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

async function quickFlick(page) {
  const rect = await page.$eval(SELECTORS.scene, element => {
    const value = element.getBoundingClientRect();
    return { left: value.left, top: value.top, width: value.width, height: value.height };
  });
  await page.evaluate(({ selector, rect }) => {
    const scene = document.querySelector(selector);
    const startX = rect.left + rect.width * 0.13;
    const endX = rect.left + rect.width * 0.62;
    const y = rect.top + rect.height * 0.72;
    const send = (type, x, buttons) => scene.dispatchEvent(new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      composed: true,
      pointerId: 91,
      pointerType: "mouse",
      isPrimary: true,
      clientX: x,
      clientY: y,
      button: 0,
      buttons
    }));
    send("pointerdown", startX, 1);
    for (let index = 1; index <= 5; index += 1) {
      send("pointermove", startX + ((endX - startX) * index) / 5, 1);
    }
    send("pointerup", endX, 0);
  }, { selector: SELECTORS.scene, rect });
}

async function productFacts(page) {
  return page.evaluate(products => {
    const root = document.querySelector('[data-page-id="products"]');
    const de = document.documentElement;
    const body = document.body;
    const labels = [...document.querySelectorAll("[data-products-product]")]
      .map(element => {
        const label = element.querySelector(":scope > .products-star__label");
        const style = label ? getComputedStyle(label) : null;
        const rect = label?.getBoundingClientRect();
        return {
          id: element.dataset.productId,
          primary: element.dataset.primary === "true",
          visible: Boolean(
            style && rect && style.display !== "none" &&
            style.visibility !== "hidden" && Number(style.opacity || 0) > 0.01 &&
            rect.width > 1 && rect.height > 1
          )
        };
      });
    return {
      pathname: location.pathname,
      state: root?.dataset.productsState || "",
      productCount: document.querySelectorAll("[data-products-product]").length,
      cardinalCount: document.querySelectorAll("[data-products-cardinal]").length,
      visibleLabels: labels.filter(record => record.visible),
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

async function presentationFacts(page, profileName) {
  return page.evaluate(profileName => {
    const scene = document.querySelector("[data-products-scene]");
    const planet = document.querySelector("[data-products-planet-mount]");
    const control = document.querySelector("[data-products-center-control]");
    const planetRect = planet?.getBoundingClientRect();
    const controlRect = control?.getBoundingClientRect();
    const ring = control ? getComputedStyle(control, "::after") : null;
    const sizeAuthority = scene ? getComputedStyle(scene).getPropertyValue("--products-center-size").trim() : "";
    return {
      profileName,
      sizeAuthority,
      expectedSizeAuthority: profileName === "PHONE_COMPACT" || profileName === "PHONE_REFERENCE"
        ? "clamp(4.25rem, 18vw, 5.5rem)"
        : "clamp(4.5rem, 9vw, 7rem)",
      planet: planetRect ? { width: planetRect.width, height: planetRect.height } : null,
      control: controlRect ? { width: controlRect.width, height: controlRect.height } : null,
      sharedSize: Boolean(
        planetRect && controlRect &&
        Math.abs(planetRect.width - controlRect.width) <= 1 &&
        Math.abs(planetRect.height - controlRect.height) <= 1
      ),
      oversizedRingAbsent: Boolean(ring && parseFloat(ring.top) >= 0),
      ringTop: ring?.top || "",
      ringOpacity: ring?.opacity || ""
    };
  }, profileName);
}

async function interactionFacts(page) {
  return page.evaluate(() => {
    const root = document.querySelector('[data-page-id="products"]');
    const control = document.querySelector("[data-products-center-control]");
    const option = document.querySelector("[data-products-return-main-compass]");
    return {
      pathname: location.pathname,
      state: root?.dataset.productsState || "",
      disclosure: root?.dataset.productsCenterDisclosure || "",
      expanded: control?.getAttribute("aria-expanded") || "",
      optionHidden: option?.hidden ?? true,
      optionAriaHidden: option?.getAttribute("aria-hidden") || "",
      receipt: globalThis.DGB_PRODUCTS_CENTER_CONTROL_RECEIPT
        ? JSON.parse(JSON.stringify(globalThis.DGB_PRODUCTS_CENTER_CONTROL_RECEIPT))
        : null
    };
  });
}

async function runProfile(browser, profileName) {
  const { page, telemetry } = await createPage(browser, profileName);
  const record = { profile: profileName, status: "PENDING", actions: [], screenshots: [], findings: [], telemetry };
  const fail = (id, observed) => record.findings.push({ id, observed });

  try {
    record.responseStatus = await gotoProducts(page);
    await openArena(page);
    record.screenshots.push(await capture(page, profileName, "arena-open"));

    record.products = await productFacts(page);
    record.presentation = await presentationFacts(page, profileName);

    if (record.products.productCount !== 6) fail("PRODUCT_COUNT", record.products.productCount);
    if (record.products.cardinalCount !== 0) fail("CARDINAL_COUNT", record.products.cardinalCount);
    if (record.products.visibleLabels.length !== 1 || !record.products.visibleLabels[0]?.primary) {
      fail("VISIBLE_PRIMARY_LABEL_COUNT", record.products.visibleLabels);
    }
    if (record.products.horizontalOverflowPx !== 0) fail("HORIZONTAL_OVERFLOW", record.products.horizontalOverflowPx);
    if (record.products.routes.some(route => route.expected !== route.observed)) fail("ALL_SIX_ROUTES", record.products.routes);
    if (!record.presentation.sharedSize) fail("PLANET_AND_CONTROL_SHARED_SIZE", record.presentation);
    if (record.presentation.sizeAuthority !== record.presentation.expectedSizeAuthority) fail("CENTER_SIZE_AUTHORITY", record.presentation);
    if (!record.presentation.oversizedRingAbsent) fail("OVERSIZED_GOLDEN_RING", record.presentation);

    await tapCenter(page);
    await sleep(80);
    const firstTap = await interactionFacts(page);
    record.actions.push({ id: "SINGLE_TAP_DISCLOSE", observed: firstTap });
    if (
      firstTap.pathname !== "/products/" ||
      firstTap.disclosure !== "open" ||
      firstTap.expanded !== "true" ||
      firstTap.optionHidden !== false
    ) fail("SINGLE_TAP_DISCLOSURE", firstTap);

    await sleep(340);
    await tapCenter(page);
    await sleep(80);
    const secondTap = await interactionFacts(page);
    record.actions.push({ id: "SECOND_SINGLE_TAP_CLOSE", observed: secondTap });
    if (
      secondTap.pathname !== "/products/" ||
      secondTap.disclosure !== "closed" ||
      secondTap.expanded !== "false" ||
      secondTap.optionHidden !== true
    ) fail("SECOND_SINGLE_TAP_CLOSE", secondTap);

    await dispatchCenterSequence(page, [
      { type: "pointerdown" },
      { type: "pointermove", dx: 24 },
      { type: "pointerup", dx: 24 }
    ]);
    await sleep(80);
    const movement = await interactionFacts(page);
    record.actions.push({ id: "MOVEMENT_CANCEL", observed: movement });
    if (
      movement.pathname !== "/products/" ||
      movement.disclosure !== "closed" ||
      movement.receipt?.lastAction !== "center-tap-cancelled-for-drag"
    ) fail("MOVEMENT_OVER_10PX_CANCEL", movement);

    await dispatchCenterSequence(page, [
      { type: "pointerdown" },
      { type: "pointercancel" }
    ]);
    await sleep(50);
    const cancelled = await interactionFacts(page);
    record.actions.push({ id: "POINTER_CANCEL", observed: cancelled });
    if (cancelled.receipt?.lastAction !== "center-pointer-cancelled") fail("POINTER_CANCEL", cancelled);

    const beforeDrag = await page.$eval(SELECTORS.root, element => Number(element.dataset.clusterRevision || 0));
    await slowDrag(page);
    await sleep(1000);
    const afterDrag = await page.$eval(SELECTORS.root, element => ({
      revision: Number(element.dataset.clusterRevision || 0),
      phase: element.dataset.clusterPhase || ""
    }));
    record.actions.push({ id: "PRODUCT_DRAG", beforeDrag, afterDrag });
    if (afterDrag.revision <= beforeDrag || afterDrag.phase !== "COMMITTED") fail("PRODUCT_DRAG", { beforeDrag, afterDrag });

    record.selections = [];
    for (const product of PRODUCTS) {
      await page.$eval(`${SELECTORS.products}[data-product-id="${product.id}"]`, element => element.click());
      await page.waitForFunction(id =>
        document.querySelector('[data-page-id="products"]')?.dataset.productsSelectedId === id,
      { timeout: 8000 }, product.id);
      const selection = await page.evaluate((id, route) => {
        const root = document.querySelector('[data-page-id="products"]');
        const enter = document.querySelector('[data-products-enter]');
        return {
          id,
          route,
          selectedId: root?.dataset.productsSelectedId || "",
          selectedRoute: root?.dataset.productsSelectedRoute || "",
          enterHref: enter?.getAttribute("href") || ""
        };
      }, product.id, product.route);
      selection.pass = selection.selectedId === product.id && selection.selectedRoute === product.route && selection.enterHref === product.route;
      record.selections.push(selection);
      if (!selection.pass) fail("PRODUCT_SELECTION_ROUTE", selection);
      await page.$eval(SELECTORS.returnToOrbit, element => element.click());
      await page.waitForFunction(() =>
        document.querySelector('[data-page-id="products"]')?.dataset.productsState === "CLUSTER_OPEN",
      { timeout: 8000 });
    }

    await quickFlick(page);
    await page.waitForFunction(() =>
      document.querySelector('[data-page-id="products"]')?.dataset.productsState === "PRIMARY_ENTRY",
    { timeout: 10000 }).catch(() => {});
    await sleep(300);
    const flick = await interactionFacts(page);
    record.actions.push({ id: "QUICK_FLICK_LOCAL_RETURN", observed: flick });
    if (flick.pathname !== "/products/" || flick.state !== "PRIMARY_ENTRY") fail("QUICK_FLICK_LOCAL_RETURN", flick);

    await openArena(page);
    await tapCenter(page);
    await sleep(80);
    await page.$eval("[data-products-return-main-compass]", element => element.click());
    await page.waitForFunction(() => location.pathname === "/", { timeout: 10000 });
    const explicitPath = new URL(page.url()).pathname;
    record.actions.push({ id: "EXPLICIT_RETURN_ACTION", pathname: explicitPath });
    if (explicitPath !== "/") fail("EXPLICIT_RETURN_ACTION", explicitPath);

    await gotoProducts(page);
    await openArena(page);
    await tapCenter(page);
    await sleep(100);
    await tapCenter(page);
    await page.waitForFunction(() => location.pathname === "/", { timeout: 10000 });
    const doubleTapPath = new URL(page.url()).pathname;
    record.actions.push({ id: "DOUBLE_TAP_RETURN", pathname: doubleTapPath });
    if (doubleTapPath !== "/") fail("DOUBLE_TAP_RETURN", doubleTapPath);

    await gotoProducts(page);
    await openArena(page);
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
  classification: "EXECUTED_PRODUCTS_ARENA_CORRECTIVE_CONTINUITY_CANDIDATE",
  checkpoint: "PRODUCTS_ARENA_CLUSTER_CORRECTIVE_CONTINUITY_CHECKPOINT_3",
  profiles,
  blockingFindings,
  deferableFindings: [],
  environmentalHolds: [],
  pass: blockingFindings.length === 0,
  acceptanceContract: {
    singleTapDisclosure: true,
    secondSingleTapClose: true,
    explicitReturnNavigation: true,
    doubleTapWindowMs: 300,
    movementCancellationPx: 10,
    pointerCancelClearsPendingTap: true,
    quickFlickLocalReturn: true,
    productDragPreserved: true,
    productCount: 6,
    cardinalCount: 0,
    visiblePrimaryLabelCount: 1,
    allSixRoutesPass: true,
    horizontalOverflowMaximum: 0,
    planetAndControlSharedSize: true,
    mobileSizeAuthority: "clamp(4.25rem, 18vw, 5.5rem)",
    desktopSizeAuthority: "clamp(4.5rem, 9vw, 7rem)",
    oversizedGoldenRingAbsent: true,
    touchFootprintMatchesVisiblePlanet: true
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
