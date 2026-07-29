import fs from "node:fs";
import puppeteer from "puppeteer-core";

const ORIGIN = process.env.PRODUCTS_PAGE_ORIGIN || "http://127.0.0.1:4173";
const CHROME_PATH = process.env.CHROME_PATH;
const profiles = [
  { id: "REFERENCE_MOBILE_430x932", width: 430, height: 932, mobile: true },
  { id: "COMPACT_MOBILE_360x800", width: 360, height: 800, mobile: true },
  { id: "DESKTOP_1280x900", width: 1280, height: 900, mobile: false }
];

const failures = [];
const observations = [];
const assert = (condition, id, observed = null, profile = "source") => {
  if (!condition) failures.push({ profile, id, observed });
};

const html = fs.readFileSync("products/index.html", "utf8");
const narrativeCss = fs.readFileSync("products/index.narrative.css", "utf8");

assert(html.includes('/products/index.narrative.css'), "NARRATIVE_STYLESHEET_NOT_LINKED");
assert(html.includes('class="products-mission"'), "MISSION_SECTION_MISSING");
assert(html.includes('class="products-impact"'), "IMPACT_SECTION_MISSING");
assert(html.includes('class="products-ecosystem"'), "ECOSYSTEM_SECTION_MISSING");
assert(html.includes('class="products-campaigns"'), "CAMPAIGNS_SECTION_MISSING");
assert(html.includes('href="/campaigns/rob/"'), "ROB_CAMPAIGN_ROUTE_MISSING");
assert(html.includes('href="/campaigns/wave/"'), "WAVE_CAMPAIGN_ROUTE_MISSING");
assert(narrativeCss.includes("body::before"), "PAGE_WIDE_SKY_EXTENSION_MISSING");
assert(!html.includes('/products/index.globe-guard.js'), "RETIRED_GLOBE_GUARD_PRESENT");

const frozenScripts = [
  "/products/index.controller.js",
  "/products/index.cosmos.js",
  "/products/index.planet.js",
  "/products/index.compositor.js",
  "/products/index.crystals.js"
];
for (const script of frozenScripts) {
  assert(html.includes(`src="${script}"`), `FROZEN_SCRIPT_REFERENCE_MISSING:${script}`);
}

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

for (const profile of profiles) {
  const page = await browser.newPage();
  await page.setViewport({
    width: profile.width,
    height: profile.height,
    deviceScaleFactor: 1,
    isMobile: profile.mobile,
    hasTouch: profile.mobile
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
    globalThis.DGB_PRODUCTS_COSMOS_RECEIPT?.initialized
  ), { timeout: 45000 });

  const initial = await page.evaluate(() => {
    const root = document.querySelector('[data-page-id="products"]');
    const mission = document.querySelector(".products-mission");
    const impact = document.querySelector(".products-impact");
    const ecosystem = document.querySelector(".products-ecosystem");
    const campaigns = document.querySelector(".products-campaigns");
    const rob = document.querySelector('[data-products-future-route="rob-campaign"]');
    const wave = document.querySelector('[data-products-future-route="wave-campaign"]');
    const bodyBefore = getComputedStyle(document.body, "::before");
    return {
      state: root?.dataset.productsState,
      missionVisible: Boolean(mission && mission.getBoundingClientRect().height > 0),
      impactVisible: Boolean(impact && impact.getBoundingClientRect().height > 0),
      ecosystemVisible: Boolean(ecosystem && ecosystem.getBoundingClientRect().height > 0),
      campaignsVisible: Boolean(campaigns && campaigns.getBoundingClientRect().height > 0),
      robHref: rob?.getAttribute("href") || "",
      waveHref: wave?.getAttribute("href") || "",
      bodySkyOpacity: bodyBefore.opacity,
      bodySkyBackgroundImage: bodyBefore.backgroundImage,
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1Count: document.querySelectorAll("h1").length,
      compassSceneCount: document.querySelectorAll("[data-products-scene]").length,
      productControlCount: document.querySelectorAll("[data-products-product]").length
    };
  });

  assert(initial.missionVisible, "MISSION_NOT_RENDERED", initial, profile.id);
  assert(initial.impactVisible, "IMPACT_NOT_RENDERED", initial, profile.id);
  assert(initial.ecosystemVisible, "ECOSYSTEM_NOT_RENDERED", initial, profile.id);
  assert(initial.campaignsVisible, "CAMPAIGNS_NOT_RENDERED", initial, profile.id);
  assert(initial.robHref === "/campaigns/rob/", "ROB_ROUTE_CHANGED", initial, profile.id);
  assert(initial.waveHref === "/campaigns/wave/", "WAVE_ROUTE_CHANGED", initial, profile.id);
  assert(initial.horizontalOverflow <= 1, "HORIZONTAL_OVERFLOW", initial, profile.id);
  assert(initial.h1Count === 1, "DOCUMENT_HEADING_AUTHORITY_INVALID", initial, profile.id);
  assert(initial.compassSceneCount === 1, "COMPASS_SCENE_COUNT_CHANGED", initial, profile.id);
  assert(initial.productControlCount === 6, "PRODUCT_CONTROL_COUNT_CHANGED", initial, profile.id);
  assert(initial.bodySkyBackgroundImage !== "none", "PAGE_WIDE_SKY_NOT_RENDERED", initial, profile.id);

  await page.click("[data-products-primary-entry]");
  await page.waitForFunction(() => document.querySelector('[data-page-id="products"]')?.dataset.productsState === "CLUSTER_OPEN");

  const product = await page.evaluate(() => {
    const api = globalThis.DGB_PRODUCTS_CONTROLLER;
    if (!api || typeof api.requestProductSelection !== "function") return null;
    const accepted = api.requestProductSelection("archcoin") !== false;
    return accepted ? "archcoin" : null;
  });

  assert(Boolean(product), "CONTROLLER_PRODUCT_TRANSACTION_UNAVAILABLE", null, profile.id);
  await page.waitForFunction(() => document.querySelector('[data-page-id="products"]')?.dataset.productsState === "PRODUCT_SELECTED");

  const afterSelection = await page.evaluate(() => ({
    state: document.querySelector('[data-page-id="products"]')?.dataset.productsState,
    selectedId: document.querySelector('[data-page-id="products"]')?.dataset.productsSelectedId,
    enterEnabled: document.querySelector("[data-products-enter]")?.getAttribute("aria-disabled") === "false",
    returnOrbitVisible: !document.querySelector("[data-products-return-to-orbit]")?.hidden,
    returnMainHidden: document.querySelector("[data-products-return-main-compass]")?.hidden
  }));

  assert(afterSelection.state === "PRODUCT_SELECTED", "PRODUCT_SELECTION_STATE_REGRESSION", afterSelection, profile.id);
  assert(afterSelection.selectedId === "archcoin", "PRODUCT_SELECTION_ID_MISSING", afterSelection, profile.id);
  assert(afterSelection.enterEnabled, "ENTER_PRODUCT_NOT_ENABLED", afterSelection, profile.id);
  assert(afterSelection.returnOrbitVisible, "RETURN_TO_ORBIT_NOT_AVAILABLE", afterSelection, profile.id);
  assert(afterSelection.returnMainHidden, "MAIN_COMPASS_DISCLOSURE_OPENED_BY_PRODUCT", afterSelection, profile.id);
  assert(telemetry.pageErrors.length === 0, "PAGE_ERRORS_PRESENT", telemetry.pageErrors, profile.id);
  assert(telemetry.requestFailures.length === 0, "REQUEST_FAILURES_PRESENT", telemetry.requestFailures, profile.id);

  await page.screenshot({
    path: `products-page-narrative-${profile.id.toLowerCase()}.png`,
    fullPage: true
  });

  observations.push({ profile: profile.id, initial, product, afterSelection, telemetry });
  await page.close();
}

await browser.close();

const receipt = {
  tool: "PRODUCTS_PAGE_NARRATIVE_BENCHMARK_v1",
  checkpoint: "PRODUCTS_PAGE_NARRATIVE_ECOSYSTEM_AND_CAMPAIGN_REFINEMENT",
  profiles: profiles.map(profile => profile.id),
  observations,
  failures,
  pass: failures.length === 0
};

fs.writeFileSync("products-page-narrative-benchmark-v1.json", JSON.stringify(receipt, null, 2));
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exitCode = 1;
