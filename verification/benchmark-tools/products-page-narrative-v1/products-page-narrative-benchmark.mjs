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
const assert = (condition, id, observed = null, profile = "source") => { if (!condition) failures.push({ profile, id, observed }); };

const html = fs.readFileSync("products/index.html", "utf8");
const pageCss = fs.readFileSync("products/index.css", "utf8");
const cosmos = fs.readFileSync("products/index.cosmos.js", "utf8");
assert(!fs.existsSync("products/index.narrative.css"), "REJECTED_NARRATIVE_STYLESHEET_PRESENT");
assert(!html.includes("/products/index.narrative.css"), "REJECTED_NARRATIVE_STYLESHEET_LINKED");
assert(html.includes("data-products-atlas"), "COMPARTMENT_ATLAS_MISSING");
assert((html.match(/data-products-compartment=/g) || []).length === 4, "COMPARTMENT_COUNT_INVALID");
assert(html.includes('<details class="products-index"'), "COLLAPSED_PRODUCT_INDEX_MISSING");
assert(!html.includes('class="products-impact"'), "MONOLITHIC_IMPACT_SECTION_PRESENT");
assert(!html.includes('class="products-ecosystem"'), "MONOLITHIC_ECOSYSTEM_SECTION_PRESENT");
assert(!html.includes('class="products-campaigns"'), "MONOLITHIC_CAMPAIGN_SECTION_PRESENT");
assert(html.includes('href="/campaigns/rob/"') && html.includes('href="/campaigns/wave/"'), "CAMPAIGN_ROUTES_MISSING");
assert(html.includes('class="products-page-cosmos" data-products-cosmic-field'), "PAGE_COSMOS_MOUNT_MISSING");
assert(pageCss.includes(".products-page-cosmos"), "PAGE_COSMOS_STYLE_MISSING");
assert(cosmos.includes("fullViewportLayer: true"), "PAGE_COSMOS_NOT_FULL_VIEWPORT");
assert(cosmos.includes("ARCHCOIN_FIBONACCI_PHYLLOTAXIS_FIELD_v1"), "ARCHCOIN_COSMOS_SOURCE_MODEL_MISSING");
assert(!html.includes("/products/index.globe-guard.js"), "RETIRED_GLOBE_GUARD_PRESENT");
for (const script of ["/products/index.controller.js", "/products/index.cosmos.js", "/products/index.planet.js", "/products/index.compositor.js", "/products/index.crystals.js"]) assert(html.includes(`src="${script}"`), `SCRIPT_REFERENCE_MISSING:${script}`);

const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--enable-webgl", "--ignore-gpu-blocklist", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const profile of profiles) {
  const page = await browser.newPage();
  await page.setViewport({ width: profile.width, height: profile.height, deviceScaleFactor: 1, isMobile: profile.mobile, hasTouch: profile.mobile });
  const telemetry = { console: [], pageErrors: [], requestFailures: [] };
  page.on("console", message => telemetry.console.push({ type: message.type(), text: message.text() }));
  page.on("pageerror", error => telemetry.pageErrors.push(String(error?.message || error)));
  page.on("requestfailed", request => telemetry.requestFailures.push({ url: request.url(), error: request.failure()?.errorText || "" }));
  await page.goto(`${ORIGIN}/products/`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForFunction(() => Boolean(globalThis.DGB_PRODUCTS_CONTROLLER && globalThis.DGB_PRODUCTS_CRYSTALS_RECEIPT?.rendererInitialized && globalThis.DGB_PRODUCTS_COSMOS_RECEIPT?.initialized), { timeout: 45000 });

  const initial = await page.evaluate(() => {
    const root = document.querySelector('[data-page-id="products"]');
    const compartments = [...document.querySelectorAll("[data-products-compartment]")];
    const index = document.querySelector(".products-index");
    const mount = document.querySelector("[data-products-cosmic-field]");
    const base = mount?.querySelector('[data-products-cosmos-canvas="base"]');
    return {
      cosmosScope: root?.dataset.productsCosmosScope,
      cosmosReceipt: globalThis.DGB_PRODUCTS_COSMOS_RECEIPT,
      cosmosMountCount: document.querySelectorAll("[data-products-cosmic-field]").length,
      cosmosCanvasCount: mount?.querySelectorAll("canvas").length || 0,
      baseBounds: base ? { width: base.getBoundingClientRect().width, height: base.getBoundingClientRect().height } : null,
      compartmentCount: compartments.length,
      openCompartments: compartments.filter(item => item.open).map(item => item.dataset.productsCompartment),
      indexOpen: Boolean(index?.open),
      fallbackRouteCount: document.querySelectorAll("[data-products-fallback-link]").length,
      robHref: document.querySelector('[data-products-future-route="rob-campaign"]')?.getAttribute("href") || "",
      waveHref: document.querySelector('[data-products-future-route="wave-campaign"]')?.getAttribute("href") || "",
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1Count: document.querySelectorAll("h1").length,
      compassSceneCount: document.querySelectorAll("[data-products-scene]").length,
      productControlCount: document.querySelectorAll("[data-products-product]").length
    };
  });
  assert(initial.cosmosScope === "page-wide", "PAGE_COSMOS_SCOPE_INVALID", initial, profile.id);
  assert(initial.cosmosMountCount === 1 && initial.cosmosCanvasCount === 2, "PAGE_COSMOS_SURFACE_INVALID", initial, profile.id);
  assert(initial.baseBounds?.width >= profile.width - 2 && initial.baseBounds?.height >= profile.height - 2, "PAGE_COSMOS_VIEWPORT_COVERAGE_INVALID", initial, profile.id);
  assert(initial.cosmosReceipt?.sourceModel === "ARCHCOIN_FIBONACCI_PHYLLOTAXIS_FIELD_v1", "PAGE_COSMOS_SOURCE_MODEL_INVALID", initial, profile.id);
  assert(initial.cosmosReceipt?.localOrbitalRingsPreserved === true, "LOCAL_ORBITAL_RING_CONTRACT_MISSING", initial, profile.id);
  assert(initial.compartmentCount === 4, "COMPARTMENT_COUNT_CHANGED", initial, profile.id);
  assert(initial.openCompartments.length === 1 && initial.openCompartments[0] === "impact", "INITIAL_COMPARTMENT_STATE_INVALID", initial, profile.id);
  assert(!initial.indexOpen && initial.fallbackRouteCount === 6, "DIRECT_PRODUCT_INDEX_INITIAL_STATE_INVALID", initial, profile.id);
  assert(initial.robHref === "/campaigns/rob/" && initial.waveHref === "/campaigns/wave/", "CAMPAIGN_ROUTE_CHANGED", initial, profile.id);
  assert(initial.horizontalOverflow <= 1 && initial.h1Count === 1 && initial.compassSceneCount === 1 && initial.productControlCount === 6, "PAGE_STRUCTURE_REGRESSION", initial, profile.id);

  await page.click('[data-products-compartment="ecosystem"] summary');
  const compartmentTransition = await page.evaluate(() => [...document.querySelectorAll("[data-products-compartment]")].filter(item => item.open).map(item => item.dataset.productsCompartment));
  assert(compartmentTransition.length === 1 && compartmentTransition[0] === "ecosystem", "MUTUALLY_EXCLUSIVE_COMPARTMENT_BEHAVIOR_FAILED", compartmentTransition, profile.id);
  await page.click(".products-index > summary");
  const indexTransition = await page.evaluate(() => ({ open: document.querySelector(".products-index")?.open, visibleRoutes: [...document.querySelectorAll("[data-products-fallback-link]")].filter(link => link.getBoundingClientRect().height > 0).length }));
  assert(indexTransition.open && indexTransition.visibleRoutes === 6, "COLLAPSED_INDEX_DISCLOSURE_FAILED", indexTransition, profile.id);

  await page.click("[data-products-primary-entry]");
  await page.waitForFunction(() => document.querySelector('[data-page-id="products"]')?.dataset.productsState === "CLUSTER_OPEN");
  const product = await page.evaluate(() => globalThis.DGB_PRODUCTS_CONTROLLER?.requestProductSelection("archcoin") !== false ? "archcoin" : null);
  await page.waitForFunction(() => document.querySelector('[data-page-id="products"]')?.dataset.productsState === "PRODUCT_SELECTED");
  const selected = await page.evaluate(() => ({ state: document.querySelector('[data-page-id="products"]')?.dataset.productsState, id: document.querySelector('[data-page-id="products"]')?.dataset.productsSelectedId, enter: document.querySelector("[data-products-enter]")?.getAttribute("aria-disabled"), orbitHidden: document.querySelector("[data-products-return-to-orbit]")?.hidden, mainHidden: document.querySelector("[data-products-return-main-compass]")?.hidden }));
  assert(product === "archcoin" && selected.state === "PRODUCT_SELECTED" && selected.id === "archcoin" && selected.enter === "false" && selected.orbitHidden === false && selected.mainHidden === true, "PRODUCT_INTERACTION_REGRESSION", selected, profile.id);
  assert(telemetry.pageErrors.length === 0 && telemetry.requestFailures.length === 0, "RUNTIME_ERRORS_PRESENT", telemetry, profile.id);
  await page.screenshot({ path: `products-page-narrative-${profile.id.toLowerCase()}.png`, fullPage: true });
  observations.push({ profile: profile.id, initial, compartmentTransition, indexTransition, selected, telemetry });
  await page.close();
}
await browser.close();
const receipt = { tool: "PRODUCTS_PAGE_NARRATIVE_BENCHMARK_v1", checkpoint: "PRODUCTS_PAGE_COMPARTMENT_AND_PAGE_WIDE_COSMOS_CORRECTION", profiles: profiles.map(profile => profile.id), observations, failures, pass: failures.length === 0 };
fs.writeFileSync("products-page-narrative-benchmark-v1.json", JSON.stringify(receipt, null, 2));
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exitCode = 1;
