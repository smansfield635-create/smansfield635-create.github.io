import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";

const origin = process.env.PRODUCTS_ORIGIN || "http://127.0.0.1:4173";
const executablePath = process.env.CHROME_PATH;
assert.ok(executablePath, "CHROME_PATH_REQUIRED");

const browser = await puppeteer.launch({
  executablePath,
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

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  const errors = [];
  page.on("pageerror", error => errors.push(String(error?.message || error)));

  const response = await page.goto(`${origin}/products/`, { waitUntil: "networkidle0", timeout: 30000 });
  assert.equal(response?.status(), 200, "PRODUCTS_ROUTE_NOT_200");

  await page.waitForSelector("[data-products-primary-entry]", { visible: true });
  await page.click("[data-products-primary-entry]");
  await page.waitForFunction(() => document.querySelector('[data-page-id="products"]')?.dataset.productsState === "CLUSTER_OPEN");

  const initial = await page.evaluate(() => {
    const root = document.querySelector('[data-page-id="products"]');
    const control = document.querySelector('[data-products-center-control]');
    const option = document.querySelector('[data-products-return-main-compass]');
    return {
      url: location.pathname,
      state: root?.dataset.productsState || "",
      controlHidden: control?.hidden ?? true,
      controlDisabled: control?.disabled ?? true,
      expanded: control?.getAttribute("aria-expanded"),
      optionHidden: option?.hidden ?? true,
      optionHref: option?.getAttribute("href") || "",
      controllerCenterSymbol: "DGB_PRODUCTS_CONTROLLER_CENTER" in globalThis,
      centerReceiptSymbol: "DGB_PRODUCTS_CENTER_CONTROL_RECEIPT" in globalThis
    };
  });

  assert.equal(initial.url, "/products/");
  assert.equal(initial.state, "CLUSTER_OPEN");
  assert.equal(initial.controlHidden, false);
  assert.equal(initial.controlDisabled, false);
  assert.equal(initial.expanded, "false");
  assert.equal(initial.optionHidden, true);
  assert.equal(initial.optionHref, "/");
  assert.equal(initial.controllerCenterSymbol, false);
  assert.equal(initial.centerReceiptSymbol, false);

  await page.click("[data-products-center-control]");
  const disclosed = await page.evaluate(() => {
    const root = document.querySelector('[data-page-id="products"]');
    const control = document.querySelector('[data-products-center-control]');
    const option = document.querySelector('[data-products-return-main-compass]');
    return {
      url: location.pathname,
      disclosure: root?.dataset.productsCenterDisclosure || "",
      expanded: control?.getAttribute("aria-expanded"),
      optionHidden: option?.hidden ?? true,
      optionAriaHidden: option?.getAttribute("aria-hidden"),
      optionTabIndex: option?.tabIndex
    };
  });

  assert.equal(disclosed.url, "/products/");
  assert.equal(disclosed.disclosure, "open");
  assert.equal(disclosed.expanded, "true");
  assert.equal(disclosed.optionHidden, false);
  assert.equal(disclosed.optionAriaHidden, "false");
  assert.equal(disclosed.optionTabIndex, 0);

  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 30000 }),
    page.click("[data-products-return-main-compass]")
  ]);
  assert.equal(new URL(page.url()).pathname, "/");

  const doubleTapPage = await browser.newPage();
  await doubleTapPage.setViewport({ width: 430, height: 932, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  await doubleTapPage.goto(`${origin}/products/`, { waitUntil: "networkidle0", timeout: 30000 });
  await doubleTapPage.click("[data-products-primary-entry]");
  await doubleTapPage.waitForFunction(() => document.querySelector('[data-page-id="products"]')?.dataset.productsState === "CLUSTER_OPEN");
  const box = await (await doubleTapPage.$("[data-products-center-control]"))?.boundingBox();
  assert.ok(box, "CENTER_CONTROL_BOX_MISSING");
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await doubleTapPage.touchscreen.tap(x, y);
  await new Promise(resolve => setTimeout(resolve, 80));
  await Promise.all([
    doubleTapPage.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 30000 }),
    doubleTapPage.touchscreen.tap(x, y)
  ]);
  assert.equal(new URL(doubleTapPage.url()).pathname, "/");

  assert.deepEqual(errors, [], `PAGE_ERRORS:${JSON.stringify(errors)}`);
  console.log(JSON.stringify({ status: "PASS", initial, disclosed, explicitReturn: true, doubleTapReturn: true }, null, 2));
} finally {
  await browser.close();
}
