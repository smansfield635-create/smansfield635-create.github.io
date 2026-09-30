import fs from "node:fs";
import crypto from "node:crypto";
import puppeteer from "puppeteer-core";

const ORIGIN = process.env.PRODUCTS_RETURN_ORIGIN || "http://127.0.0.1:4173";
const CHROME_PATH = process.env.CHROME_PATH;
const OUT = process.env.PRODUCTS_RETURN_EVIDENCE_DIR || ".";
const failures = [];

const assert = (condition, id, observed = null, profile = "source") => {
  if (!condition) failures.push({ profile, id, observed });
};

const gitBlobSha = text => {
  const bytes = Buffer.from(text, "utf8");
  return crypto
    .createHash("sha1")
    .update(`blob ${bytes.length}\0`)
    .update(bytes)
    .digest("hex");
};

const controller = fs.readFileSync("products/index.controller.js", "utf8");
const crystals = fs.readFileSync("products/index.crystals.js", "utf8");
const html = fs.readFileSync("products/index.html", "utf8");
const compassCss = fs.readFileSync("products/index.compass.css", "utf8");

const source = {
  controllerBlob: gitBlobSha(controller),
  crystalsBlob: gitBlobSha(crystals),
  htmlBlob: gitBlobSha(html),
  compassCssBlob: gitBlobSha(compassCss),
  productSelectionClosesDisclosure:
    controller.includes('setCenterDisclosure(false);\n\n    const transaction = beginAtomicTransition({\n      state: STATES.PRODUCT_SELECTED'),
  returnToOrbitClosesDisclosure:
    controller.includes('setCenterDisclosure(false);\n\n    const transaction = beginAtomicTransition({\n      state: STATES.CLUSTER_OPEN'),
  centerTerritory:
    crystals.includes('CENTER_CONTROL: "CENTER_CONTROL"'),
  centerCoordinateAuthority:
    crystals.includes("function centerControlAtPoint(clientX, clientY)") &&
    crystals.includes("centerControlAtPoint(event.clientX, event.clientY)"),
  centerControllerBridge:
    crystals.includes("function requestControllerCompassSelection()") &&
    crystals.includes('typeof api.requestCompassSelection === "function"'),
  centerTapArbitration:
    crystals.includes('pointer.gestureScope === "center"') &&
    crystals.includes("GESTURE_TYPES.CENTER_TAP"),
  centerClickSuppression:
    crystals.includes("state.suppressClickUntil = performance.now() + GESTURE.suppressClickMs"),
  returnToOrbitMarkup: html.includes("data-products-return-to-orbit"),
  returnMainMarkup: html.includes("data-products-return-main-compass"),
  noGuardScript: !fs.existsSync("products/index.globe-guard.js"),
  noGuardCss: !fs.existsSync("products/index.globe-guard.css"),
  htmlPreserved: gitBlobSha(html) === "84cc1707500003b824826ec320fcf44826904755",
  compassCssPreserved: gitBlobSha(compassCss) === "a11fd8fd874b008fbb0d0e578b1c90ed732d0050"
};

Object.entries(source).forEach(([id, value]) => {
  if (typeof value === "boolean") assert(value, `SOURCE_${id.toUpperCase()}`, value);
});

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: "new",
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--enable-webgl",
    "--ignore-gpu-blocklist",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader"
  ]
});

const profiles = [
  { id: "reference-mobile", width: 430, height: 932 },
  { id: "compact-mobile", width: 360, height: 800 }
];

const results = [];

for (const profile of profiles) {
  const page = await browser.newPage();
  await page.setViewport({
    width: profile.width,
    height: profile.height,
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true
  });

  const telemetry = { console: [], pageErrors: [], requestFailures: [] };
  page.on("console", message => telemetry.console.push({ type: message.type(), text: message.text() }));
  page.on("pageerror", error => telemetry.pageErrors.push(String(error?.message || error)));
  page.on("requestfailed", request => telemetry.requestFailures.push({
    url: request.url(),
    error: request.failure()?.errorText || ""
  }));

  await page.goto(`${ORIGIN}/products/`, { waitUntil: "networkidle0", timeout: 45000 });
  await page.waitForFunction(() => Boolean(
    globalThis.DGB_PRODUCTS_CONTROLLER &&
    globalThis.DGB_PRODUCTS_CRYSTALS_RECEIPT?.rendererInitialized
  ), { timeout: 45000 });

  await page.click("[data-products-primary-entry]");
  await page.waitForFunction(() =>
    document.querySelector('[data-page-id="products"]')?.dataset.productsState === "CLUSTER_OPEN"
  );

  const centerPoint = async () => {
    await page.evaluate(() => {
      document.querySelector("[data-products-center-control]")?.scrollIntoView({
        behavior: "instant",
        block: "center",
        inline: "center"
      });
    });
    await new Promise(resolve => setTimeout(resolve, 180));
    return page.evaluate(() => {
      const center = document.querySelector("[data-products-center-control]");
      const rect = center.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
        topElement: document.elementFromPoint(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2
        )?.outerHTML?.slice(0, 240) || ""
      };
    });
  };

  const initialPoint = await centerPoint();
  await page.touchscreen.tap(initialPoint.x, initialPoint.y);
  await page.waitForFunction(() =>
    document.querySelector('[data-page-id="products"]')?.dataset.productsCenterDisclosure === "open"
  );
  await new Promise(resolve => setTimeout(resolve, 220));

  const afterClusterGlobe = await page.evaluate(() => {
    const root = document.querySelector('[data-page-id="products"]');
    const center = document.querySelector("[data-products-center-control]");
    const returnMain = document.querySelector("[data-products-return-main-compass]");
    const returnOrbit = document.querySelector("[data-products-return-to-orbit]");
    return {
      state: root.dataset.productsState,
      selectedProductId: root.dataset.productsSelectedId,
      disclosure: root.dataset.productsCenterDisclosure,
      centerExpanded: center.getAttribute("aria-expanded"),
      returnMainHidden: returnMain.hidden,
      returnMainAriaHidden: returnMain.getAttribute("aria-hidden"),
      returnMainTabIndex: returnMain.tabIndex,
      returnOrbitHidden: returnOrbit.hidden,
      crystalsGesture: globalThis.DGB_PRODUCTS_CRYSTALS_RECEIPT?.lastGestureType || "",
      controllerAction: globalThis.DGB_PRODUCTS_CONTROLLER_RECEIPT?.lastAction || ""
    };
  });

  assert(afterClusterGlobe.state === "CLUSTER_OPEN", "GLOBE_TAP_PRESERVES_CLUSTER", afterClusterGlobe, profile.id);
  assert(afterClusterGlobe.selectedProductId === "", "GLOBE_TAP_DOES_NOT_SELECT_PRODUCT", afterClusterGlobe, profile.id);
  assert(afterClusterGlobe.disclosure === "open", "GLOBE_TAP_OPENS_DISCLOSURE", afterClusterGlobe, profile.id);
  assert(afterClusterGlobe.returnMainHidden === false, "RETURN_MAIN_VISIBLE_AFTER_GLOBE", afterClusterGlobe, profile.id);
  assert(afterClusterGlobe.returnMainAriaHidden === "false", "RETURN_MAIN_ACCESSIBLE_AFTER_GLOBE", afterClusterGlobe, profile.id);
  assert(afterClusterGlobe.returnMainTabIndex === 0, "RETURN_MAIN_FOCUSABLE_AFTER_GLOBE", afterClusterGlobe, profile.id);
  assert(afterClusterGlobe.returnOrbitHidden === true, "RETURN_ORBIT_REMAINS_CONTEXTUAL_IN_CLUSTER", afterClusterGlobe, profile.id);
  assert(afterClusterGlobe.crystalsGesture === "center-tap", "RENDERER_RECORDS_CENTER_TAP", afterClusterGlobe, profile.id);

  await page.screenshot({
    path: `${OUT}/products-return-disclosure-${profile.id}-cluster.png`,
    fullPage: true
  });

  await page.evaluate(() => {
    document.querySelector('[data-products-product][data-product-id="education"]')?.click();
  });
  await page.waitForFunction(() =>
    document.querySelector('[data-page-id="products"]')?.dataset.productsState === "PRODUCT_SELECTED"
  );
  await new Promise(resolve => setTimeout(resolve, 220));

  const afterProduct = await page.evaluate(() => {
    const root = document.querySelector('[data-page-id="products"]');
    const returnMain = document.querySelector("[data-products-return-main-compass]");
    const returnOrbit = document.querySelector("[data-products-return-to-orbit]");
    return {
      state: root.dataset.productsState,
      selectedProductId: root.dataset.productsSelectedId,
      disclosure: root.dataset.productsCenterDisclosure,
      returnMainHidden: returnMain.hidden,
      returnMainAriaHidden: returnMain.getAttribute("aria-hidden"),
      returnMainTabIndex: returnMain.tabIndex,
      returnOrbitHidden: returnOrbit.hidden,
      returnOrbitAriaHidden: returnOrbit.getAttribute("aria-hidden"),
      returnOrbitTabIndex: returnOrbit.tabIndex
    };
  });

  assert(afterProduct.selectedProductId === "education", "PRODUCT_SELECTION_PRESERVED", afterProduct, profile.id);
  assert(afterProduct.disclosure === "closed", "PRODUCT_SELECTION_CLOSES_DISCLOSURE", afterProduct, profile.id);
  assert(afterProduct.returnMainHidden === true, "RETURN_MAIN_HIDDEN_AFTER_PRODUCT", afterProduct, profile.id);
  assert(afterProduct.returnMainAriaHidden === "true", "RETURN_MAIN_REMOVED_FROM_ACCESSIBILITY_AFTER_PRODUCT", afterProduct, profile.id);
  assert(afterProduct.returnMainTabIndex === -1, "RETURN_MAIN_REMOVED_FROM_FOCUS_AFTER_PRODUCT", afterProduct, profile.id);
  assert(afterProduct.returnOrbitHidden === false, "RETURN_ORBIT_VISIBLE_FOR_PRODUCT", afterProduct, profile.id);
  assert(afterProduct.returnOrbitAriaHidden === "false", "RETURN_ORBIT_ACCESSIBLE_FOR_PRODUCT", afterProduct, profile.id);
  assert(afterProduct.returnOrbitTabIndex === 0, "RETURN_ORBIT_FOCUSABLE_FOR_PRODUCT", afterProduct, profile.id);

  const selectedPoint = await centerPoint();
  await page.touchscreen.tap(selectedPoint.x, selectedPoint.y);
  await page.waitForFunction(() =>
    document.querySelector('[data-page-id="products"]')?.dataset.productsCenterDisclosure === "open"
  );
  await new Promise(resolve => setTimeout(resolve, 220));

  const bothActions = await page.evaluate(() => {
    const root = document.querySelector('[data-page-id="products"]');
    const returnMain = document.querySelector("[data-products-return-main-compass]");
    const returnOrbit = document.querySelector("[data-products-return-to-orbit]");
    return {
      state: root.dataset.productsState,
      selectedProductId: root.dataset.productsSelectedId,
      disclosure: root.dataset.productsCenterDisclosure,
      returnMainHidden: returnMain.hidden,
      returnOrbitHidden: returnOrbit.hidden,
      crystalsGesture: globalThis.DGB_PRODUCTS_CRYSTALS_RECEIPT?.lastGestureType || ""
    };
  });

  assert(bothActions.state === "PRODUCT_SELECTED", "GLOBE_PRESERVES_PRODUCT_PREVIEW", bothActions, profile.id);
  assert(bothActions.selectedProductId === "education", "GLOBE_DOES_NOT_REPLACE_SELECTED_PRODUCT", bothActions, profile.id);
  assert(bothActions.returnMainHidden === false, "RETURN_MAIN_VISIBLE_WITH_PRODUCT_PREVIEW", bothActions, profile.id);
  assert(bothActions.returnOrbitHidden === false, "RETURN_ORBIT_REMAINS_VISIBLE_WITH_GLOBE_DISCLOSURE", bothActions, profile.id);
  assert(bothActions.crystalsGesture === "center-tap", "SECOND_GLOBE_TAP_RECORDED", bothActions, profile.id);

  await page.screenshot({
    path: `${OUT}/products-return-disclosure-${profile.id}-both-actions.png`,
    fullPage: true
  });

  await page.click("[data-products-return-to-orbit]");
  await page.waitForFunction(() =>
    document.querySelector('[data-page-id="products"]')?.dataset.productsState === "CLUSTER_OPEN"
  );
  await new Promise(resolve => setTimeout(resolve, 260));

  const afterReturnOrbit = await page.evaluate(() => {
    const root = document.querySelector('[data-page-id="products"]');
    const returnMain = document.querySelector("[data-products-return-main-compass]");
    const returnOrbit = document.querySelector("[data-products-return-to-orbit]");
    return {
      state: root.dataset.productsState,
      selectedProductId: root.dataset.productsSelectedId,
      disclosure: root.dataset.productsCenterDisclosure,
      returnMainHidden: returnMain.hidden,
      returnOrbitHidden: returnOrbit.hidden,
      controllerAction: globalThis.DGB_PRODUCTS_CONTROLLER_RECEIPT?.lastAction || ""
    };
  });

  assert(afterReturnOrbit.state === "CLUSTER_OPEN", "RETURN_ORBIT_RESTORES_CLUSTER", afterReturnOrbit, profile.id);
  assert(afterReturnOrbit.selectedProductId === "", "RETURN_ORBIT_CLEARS_PRODUCT", afterReturnOrbit, profile.id);
  assert(afterReturnOrbit.disclosure === "closed", "RETURN_ORBIT_CLOSES_DISCLOSURE", afterReturnOrbit, profile.id);
  assert(afterReturnOrbit.returnMainHidden === true, "RETURN_MAIN_HIDDEN_AFTER_RETURN_ORBIT", afterReturnOrbit, profile.id);
  assert(afterReturnOrbit.returnOrbitHidden === true, "RETURN_ORBIT_HIDDEN_AFTER_RESTORATION", afterReturnOrbit, profile.id);

  await page.screenshot({
    path: `${OUT}/products-return-disclosure-${profile.id}-returned-orbit.png`,
    fullPage: true
  });

  const blockingConsole = telemetry.console.filter(entry => entry.type === "error");
  assert(blockingConsole.length === 0, "NO_CONSOLE_ERRORS", blockingConsole, profile.id);
  assert(telemetry.pageErrors.length === 0, "NO_PAGE_ERRORS", telemetry.pageErrors, profile.id);
  assert(telemetry.requestFailures.length === 0, "NO_REQUEST_FAILURES", telemetry.requestFailures, profile.id);

  results.push({
    profile,
    initialPoint,
    afterClusterGlobe,
    afterProduct,
    selectedPoint,
    bothActions,
    afterReturnOrbit,
    telemetry
  });

  await page.close();
}

await browser.close();

const receipt = {
  tool: "PRODUCTS_COMPASS_RETURN_DISCLOSURE_BENCHMARK_v1",
  status: failures.length ? "FAIL" : "PASS",
  source,
  profiles: results,
  failures,
  acceptance: {
    globeFirstTapIsLocalDisclosure: true,
    explicitReturnMainCompassSecondAction: true,
    productSelectionClosesDisclosure: true,
    returnToOrbitPreserved: true,
    returnToOrbitClosesDisclosure: true,
    cssGuardProhibited: true,
    rendererOrCompositorRebuild: false
  }
};

fs.writeFileSync(
  `${OUT}/products-compass-return-disclosure-v1.json`,
  JSON.stringify(receipt, null, 2)
);
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exitCode = 1;
