import fs from "node:fs";
import puppeteer from "puppeteer-core";

const ORIGIN = process.env.PRODUCTS_ARENA_ORIGIN || "http://127.0.0.1:4173";
const CHROME_PATH = process.env.CHROME_PATH;
const failures = [];
const assert = (condition, id, observed = null) => {
  if (!condition) failures.push({ id, observed });
};

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

const page = await browser.newPage();
await page.setViewport({
  width: 430,
  height: 932,
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
  globalThis.DGB_PRODUCTS_CRYSTALS_RECEIPT?.rendererInitialized &&
  globalThis.DGB_PRODUCTS_GLOBE_GUARD_RECEIPT?.protectedTouchCorridor
), { timeout: 45000 });

await page.click("[data-products-primary-entry]");
await page.waitForFunction(() => document.querySelector('[data-page-id="products"]')?.dataset.productsState === "CLUSTER_OPEN");

await page.evaluate(() => {
  document.querySelector("[data-products-center-control]")?.scrollIntoView({
    behavior: "instant",
    block: "center",
    inline: "center"
  });
});
await new Promise(resolve => setTimeout(resolve, 250));

const initial = await page.evaluate(() => {
  const root = document.querySelector('[data-page-id="products"]');
  const center = document.querySelector("[data-products-center-control]");
  const returnControl = document.querySelector("[data-products-return-main-compass]");
  const rect = center.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const top = document.elementFromPoint(x, y);
  return {
    disclosure: root.dataset.productsCenterDisclosure,
    returnHidden: returnControl.hidden,
    returnAriaHidden: returnControl.getAttribute("aria-hidden"),
    centerExpanded: center.getAttribute("aria-expanded"),
    centerRect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
    topElementIsCenter: Boolean(top?.closest?.("[data-products-center-control]")),
    pointInsideViewport:
      x >= 0 && x <= innerWidth && y >= 0 && y <= innerHeight,
    viewport: { width: innerWidth, height: innerHeight },
    point: { x, y }
  };
});

assert(initial.returnHidden === true, "RETURN_MAIN_HIDDEN_BEFORE_GLOBE_TAP", initial);
assert(initial.centerExpanded === "false", "CENTER_COLLAPSED_BEFORE_GLOBE_TAP", initial);
assert(initial.pointInsideViewport === true, "CENTER_TOUCH_POINT_OUTSIDE_VIEWPORT", initial);
assert(initial.topElementIsCenter === true, "CENTER_TOUCH_POINT_NOT_OWNED_BY_GLOBE", initial);

if (failures.length === 0) {
  await page.touchscreen.tap(initial.point.x, initial.point.y);
}
await new Promise(resolve => setTimeout(resolve, 350));

const afterGlobeTap = await page.evaluate(() => {
  const root = document.querySelector('[data-page-id="products"]');
  const center = document.querySelector("[data-products-center-control]");
  const returnControl = document.querySelector("[data-products-return-main-compass]");
  return {
    disclosure: root.dataset.productsCenterDisclosure,
    returnHidden: returnControl.hidden,
    returnAriaHidden: returnControl.getAttribute("aria-hidden"),
    centerExpanded: center.getAttribute("aria-expanded"),
    lastAction: globalThis.DGB_PRODUCTS_CONTROLLER_RECEIPT?.lastAction || ""
  };
});

assert(afterGlobeTap.disclosure === "open", "GLOBE_TAP_DID_NOT_OPEN_DISCLOSURE", afterGlobeTap);
assert(afterGlobeTap.returnHidden === false, "RETURN_MAIN_NOT_VISIBLE_AFTER_GLOBE_TAP", afterGlobeTap);

if (afterGlobeTap.disclosure === "open") {
  await page.evaluate(() => {
    const product = Array.from(document.querySelectorAll("[data-products-product]"))
      .find(element => !element.hidden && getComputedStyle(element).pointerEvents !== "none");
    if (!product) throw new Error("NO_INTERACTIVE_PRODUCT_CONTROL");
    product.click();
  });
  await page.waitForFunction(() => document.querySelector('[data-page-id="products"]')?.dataset.productsState === "PRODUCT_SELECTED");
}

const afterProductTap = await page.evaluate(() => {
  const root = document.querySelector('[data-page-id="products"]');
  const center = document.querySelector("[data-products-center-control]");
  const returnControl = document.querySelector("[data-products-return-main-compass]");
  return {
    state: root.dataset.productsState,
    disclosure: root.dataset.productsCenterDisclosure,
    disclosureSource: root.dataset.productsCenterDisclosureSource,
    returnHidden: returnControl.hidden,
    returnAriaHidden: returnControl.getAttribute("aria-hidden"),
    returnTabIndex: returnControl.tabIndex,
    centerExpanded: center.getAttribute("aria-expanded")
  };
});

if (afterGlobeTap.disclosure === "open") {
  assert(afterProductTap.disclosure === "closed", "PRODUCT_TAP_DID_NOT_CLOSE_DISCLOSURE", afterProductTap);
  assert(afterProductTap.returnHidden === true, "RETURN_MAIN_VISIBLE_AFTER_PRODUCT_TAP", afterProductTap);
  assert(afterProductTap.returnAriaHidden === "true", "RETURN_MAIN_ACCESSIBLE_AFTER_PRODUCT_TAP", afterProductTap);
  assert(afterProductTap.returnTabIndex === -1, "RETURN_MAIN_FOCUSABLE_AFTER_PRODUCT_TAP", afterProductTap);
  assert(afterProductTap.centerExpanded === "false", "CENTER_EXPANDED_AFTER_PRODUCT_TAP", afterProductTap);
}

await page.screenshot({
  path: "products-globe-touch-corridor-reference-mobile.png",
  fullPage: true
});

assert(telemetry.pageErrors.length === 0, "PAGE_ERRORS_PRESENT", telemetry.pageErrors);
assert(telemetry.requestFailures.length === 0, "REQUEST_FAILURES_PRESENT", telemetry.requestFailures);

const receipt = {
  tool: "PRODUCTS_ARENA_CLUSTER_BENCHMARK_v1",
  checkpoint: "PRODUCTS_GLOBE_TOUCH_CORRIDOR_AND_DISCLOSURE_ISOLATION",
  profile: "REFERENCE_MOBILE_430x932",
  initial,
  afterGlobeTap,
  afterProductTap,
  telemetry,
  failures,
  pass: failures.length === 0
};

fs.writeFileSync("products-globe-touch-corridor-v1.json", JSON.stringify(receipt, null, 2));
console.log(JSON.stringify(receipt, null, 2));
await browser.close();
if (failures.length) process.exitCode = 1;
