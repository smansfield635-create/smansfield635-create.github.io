import fs from "node:fs";
import puppeteer from "puppeteer-core";

const ORIGIN = process.env.PRODUCTS_PAGE_ORIGIN || "http://127.0.0.1:4173";
const CHROME_PATH = process.env.CHROME_PATH;
const failures = [];
const observations = [];
const assert = (condition, id, observed = null, profile = "source") => {
  if (!condition) failures.push({ profile, id, observed });
};

const productProfiles = [
  { id: "REFERENCE_MOBILE_430x932", width: 430, height: 932, mobile: true },
  { id: "COMPACT_MOBILE_360x800", width: 360, height: 800, mobile: true },
  { id: "DESKTOP_1280x900", width: 1280, height: 900, mobile: false }
];
const campaignProfiles = [
  { id: "REFERENCE_MOBILE_430x932", width: 430, height: 932, mobile: true },
  { id: "DESKTOP_1280x900", width: 1280, height: 900, mobile: false }
];
const campaigns = [
  ["consider-energy", "/campaigns/consider-the-energy/", "campaigns/consider-the-energy/index.html", "Consider the Community with Consider the Energy"],
  ["secret-of-life", "/campaigns/consider-the-energy/secret-of-life-edition/", "campaigns/consider-the-energy/secret-of-life-edition/index.html", "Secret of Life Edition"],
  ["rob", "/campaigns/rob/", "campaigns/rob/index.html", "Rise Over Bullying"],
  ["wave", "/campaigns/wave/", "campaigns/wave/index.html", "Women Against Violence Everywhere"],
  ["mr-lee", "/campaigns/wave/mr-lee/", "campaigns/wave/mr-lee/index.html", "seventh-degree black belt"],
  ["thai-boxing", "/campaigns/wave/thai-boxing/", "campaigns/wave/thai-boxing/index.html", "Tai-Boxing Class"]
];
const assets = [
  "campaigns/assets/consider-energy-baseline.svg",
  "campaigns/assets/consider-energy-symbolic.svg",
  "campaigns/assets/rob-rise-over-bullying.svg",
  "campaigns/assets/wave-flyer.svg",
  "campaigns/assets/mr-lee-resume.svg",
  "campaigns/assets/tai-boxing-class.svg"
];

const productsHtml = fs.readFileSync("products/index.html", "utf8");
const productsCss = fs.readFileSync("products/index.css", "utf8");
const productsCosmos = fs.readFileSync("products/index.cosmos.js", "utf8");
const campaignCss = fs.readFileSync("campaigns/index.css", "utf8");
const campaignTabs = fs.readFileSync("campaigns/index.tabs.js", "utf8");

assert(productsHtml.includes("data-products-atlas"), "COMPARTMENT_ATLAS_MISSING");
assert((productsHtml.match(/data-products-compartment=/g) || []).length === 4, "COMPARTMENT_COUNT_INVALID");
assert(!/<details class="products-compartment"[^>]*\sopen(?:\s|>)/.test(productsHtml), "SOURCE_INITIAL_COMPARTMENT_OPEN");
assert(productsHtml.includes('<details class="products-index"'), "COLLAPSED_PRODUCT_INDEX_MISSING");
assert((productsHtml.match(/data-products-campaign=/g) || []).length === 1, "COMMUNITY_GATEWAY_COUNT_INVALID");
assert(productsHtml.includes('href="/campaigns/consider-the-energy/" data-products-campaign="consider-the-energy" data-products-campaign-status="active"'), "COMMUNITY_GATEWAY_ROUTE_INVALID");
assert(productsHtml.includes("Consider the Community with Consider the Energy"), "COMMUNITY_GATEWAY_LABEL_INVALID");
assert(!productsHtml.includes('data-products-campaign="rob"') && !productsHtml.includes('data-products-campaign="wave"'), "LEGACY_CAMPAIGN_CARDS_PRESENT");
assert(!/Future campaigns|In development|under construction/i.test(productsHtml), "CAMPAIGN_STATUS_LANGUAGE_INVALID");
assert(productsHtml.includes('class="products-page-cosmos" data-products-cosmic-field'), "PAGE_COSMOS_MOUNT_MISSING");
assert(productsCss.includes(".products-page-cosmos"), "PAGE_COSMOS_STYLE_MISSING");
assert(productsCosmos.includes("fullViewportLayer: true") && productsCosmos.includes("ARCHCOIN_FIBONACCI_PHYLLOTAXIS_FIELD_v1"), "PRODUCTS_COSMOS_CONTRACT_INVALID");
for (const script of ["/products/index.controller.js", "/products/index.cosmos.js", "/products/index.planet.js", "/products/index.compositor.js", "/products/index.crystals.js"]) {
  assert(productsHtml.includes(`src="${script}"`), `PRODUCTS_SCRIPT_REFERENCE_MISSING:${script}`);
}

assert(campaignCss.includes(".campaign-tablist") && campaignCss.includes(".campaign-disclosure"), "SHARED_CAMPAIGN_STYLE_AUTHORITY_INCOMPLETE");
assert(campaignTabs.includes("ArrowRight") && campaignTabs.includes("Home") && campaignTabs.includes("End") && campaignTabs.includes("aria-selected"), "ACCESSIBLE_TAB_CONTROLLER_INCOMPLETE");
assert(!campaignTabs.includes("innerHTML"), "TAB_CONTROLLER_UNSAFE_HTML_MUTATION");
for (const asset of assets) {
  assert(fs.existsSync(asset), `CAMPAIGN_ASSET_MISSING:${asset}`);
  if (fs.existsSync(asset)) assert(fs.statSync(asset).size > 1000, `CAMPAIGN_ASSET_EMPTY:${asset}`, fs.statSync(asset).size);
}
for (const [id, route, file, phrase] of campaigns) {
  assert(fs.existsSync(file), `CAMPAIGN_PAGE_MISSING:${file}`);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, "utf8");
  assert(html.includes(`data-route="${route}"`), `CAMPAIGN_ROUTE_INVALID:${id}`);
  assert(html.toLowerCase().includes(phrase.toLowerCase()), `CAMPAIGN_PHRASE_MISSING:${id}`);
  assert(html.includes('href="/campaigns/index.css"') && html.includes('src="/campaigns/index.tabs.js"'), `SHARED_AUTHORITY_REFERENCE_MISSING:${id}`);
  assert((html.match(/role="tab"/g) || []).length === 4, `TAB_COUNT_INVALID:${id}`);
  assert((html.match(/role="tabpanel"/g) || []).length === 4, `PANEL_COUNT_INVALID:${id}`);
  assert((html.match(/aria-hidden="false" data-tab-panel/g) || []).length === 1, `INITIAL_VISIBLE_PANEL_INVALID:${id}`);
  assert((html.match(/aria-hidden="true" data-tab-panel hidden/g) || []).length === 3, `INITIAL_HIDDEN_PANEL_INVALID:${id}`);
  assert(!/<details[^>]*\sopen(?:\s|>)/.test(html), `INITIAL_DISCLOSURE_OPEN:${id}`);
  assert(!/Rise Above Bullying|Secret Life Edition/i.test(html), `CAMPAIGN_IDENTITY_DRIFT:${id}`);
}

const lifeHtml = fs.readFileSync("campaigns/consider-the-energy/secret-of-life-edition/index.html", "utf8");
for (const phrase of ["Learn to Live to Love", "Learn to Love to Laugh", "Learn to Live to Listen"]) assert(lifeHtml.includes(phrase), `SECRET_OF_LIFE_PHRASE_MISSING:${phrase}`);
assert(lifeHtml.includes('href="/nine-summits-of-love/"') && lifeHtml.includes('href="/book/"'), "SECRET_OF_LIFE_LINKS_MISSING");
const robHtml = fs.readFileSync("campaigns/rob/index.html", "utf8").toLowerCase();
for (const phrase of ["beyond the playground", "workplace", "supermarket", "cognitive dissonance", "communal accountability", "due process"]) assert(robHtml.includes(phrase), `ROB_CONTEXT_MISSING:${phrase}`);
assert(fs.readFileSync("campaigns/wave/index.html", "utf8").includes("Women Against Violence Everywhere"), "WAVE_EXPANSION_MISSING");
assert(/seventh-degree black belt/i.test(fs.readFileSync("campaigns/wave/mr-lee/index.html", "utf8")), "MR_LEE_CREDENTIAL_MISSING");
const boxingHtml = fs.readFileSync("campaigns/wave/thai-boxing/index.html", "utf8");
assert(boxingHtml.includes("$25") && boxingHtml.includes("$10") && boxingHtml.includes("817-500-8769"), "TAI_BOXING_SOURCE_DETAILS_MISSING");
assert(/current schedule, location, registration process/i.test(boxingHtml), "TAI_BOXING_BOUNDARY_MISSING");

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--enable-webgl", "--ignore-gpu-blocklist", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
});

for (const profile of productProfiles) {
  const page = await browser.newPage();
  await page.setViewport({ width: profile.width, height: profile.height, deviceScaleFactor: 1, isMobile: profile.mobile, hasTouch: profile.mobile });
  const telemetry = { pageErrors: [], requestFailures: [] };
  page.on("pageerror", error => telemetry.pageErrors.push(String(error?.message || error)));
  page.on("requestfailed", request => telemetry.requestFailures.push({ url: request.url(), error: request.failure()?.errorText || "" }));
  await page.goto(`${ORIGIN}/products/`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForFunction(() => Boolean(globalThis.DGB_PRODUCTS_CONTROLLER && globalThis.DGB_PRODUCTS_CRYSTALS_RECEIPT?.rendererInitialized && globalThis.DGB_PRODUCTS_COSMOS_RECEIPT?.initialized), { timeout: 45000 });
  const initial = await page.evaluate(() => {
    const root = document.querySelector('[data-page-id="products"]');
    const compartments = [...document.querySelectorAll("[data-products-compartment]")];
    const gateway = document.querySelector("[data-products-campaign]");
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
      gateway: gateway ? { count: document.querySelectorAll("[data-products-campaign]").length, id: gateway.dataset.productsCampaign, status: gateway.dataset.productsCampaignStatus, href: gateway.getAttribute("href"), label: gateway.textContent?.replace(/\s+/g, " ").trim() || "" } : null,
      indexOpen: Boolean(document.querySelector(".products-index")?.open),
      fallbackRouteCount: document.querySelectorAll("[data-products-fallback-link]").length,
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1Count: document.querySelectorAll("h1").length,
      sceneCount: document.querySelectorAll("[data-products-scene]").length,
      productCount: document.querySelectorAll("[data-products-product]").length
    };
  });
  assert(initial.cosmosScope === "page-wide", "PAGE_COSMOS_SCOPE_INVALID", initial, profile.id);
  assert(initial.cosmosMountCount === 1 && initial.cosmosCanvasCount === 2, "PAGE_COSMOS_SURFACE_INVALID", initial, profile.id);
  assert(initial.baseBounds?.width >= profile.width - 2 && initial.baseBounds?.height >= profile.height - 2, "PAGE_COSMOS_COVERAGE_INVALID", initial, profile.id);
  assert(initial.cosmosReceipt?.sourceModel === "ARCHCOIN_FIBONACCI_PHYLLOTAXIS_FIELD_v1", "PAGE_COSMOS_SOURCE_MODEL_INVALID", initial, profile.id);
  assert(initial.compartmentCount === 4 && initial.openCompartments.length === 0, "PRODUCTS_COMPARTMENT_BASELINE_INVALID", initial, profile.id);
  assert(initial.gateway?.count === 1 && initial.gateway.id === "consider-the-energy" && initial.gateway.status === "active" && initial.gateway.href === "/campaigns/consider-the-energy/" && initial.gateway.label.includes("Consider the Community with Consider the Energy"), "COMMUNITY_GATEWAY_RENDER_INVALID", initial, profile.id);
  assert(!initial.indexOpen && initial.fallbackRouteCount === 6, "DIRECT_INDEX_BASELINE_INVALID", initial, profile.id);
  assert(initial.horizontalOverflow <= 1 && initial.h1Count === 1 && initial.sceneCount === 1 && initial.productCount === 6, "PRODUCTS_STRUCTURE_REGRESSION", initial, profile.id);
  await page.click('[data-products-compartment="ecosystem"] summary');
  await page.click('[data-products-compartment="value"] summary');
  const exclusive = await page.evaluate(() => [...document.querySelectorAll("[data-products-compartment]")].filter(item => item.open).map(item => item.dataset.productsCompartment));
  assert(exclusive.length === 1 && exclusive[0] === "value", "COMPARTMENT_EXCLUSIVITY_FAILED", exclusive, profile.id);
  await page.click('[data-products-compartment="value"] summary');
  const retracted = await page.evaluate(() => [...document.querySelectorAll("[data-products-compartment]")].filter(item => item.open).map(item => item.dataset.productsCompartment));
  assert(retracted.length === 0, "COMPARTMENT_RETRACTION_FAILED", retracted, profile.id);
  await page.click(".products-index > summary");
  const index = await page.evaluate(() => ({ open: Boolean(document.querySelector(".products-index")?.open), visible: [...document.querySelectorAll("[data-products-fallback-link]")].filter(link => link.getBoundingClientRect().height > 0).length }));
  assert(index.open && index.visible === 6, "DIRECT_INDEX_DISCLOSURE_FAILED", index, profile.id);
  await page.click("[data-products-primary-entry]");
  await page.waitForFunction(() => document.querySelector('[data-page-id="products"]')?.dataset.productsState === "CLUSTER_OPEN");
  await page.evaluate(() => globalThis.DGB_PRODUCTS_CONTROLLER?.requestProductSelection("archcoin"));
  await page.waitForFunction(() => document.querySelector('[data-page-id="products"]')?.dataset.productsState === "PRODUCT_SELECTED");
  const selected = await page.evaluate(() => ({ state: document.querySelector('[data-page-id="products"]')?.dataset.productsState, id: document.querySelector('[data-page-id="products"]')?.dataset.productsSelectedId, enter: document.querySelector("[data-products-enter]")?.getAttribute("aria-disabled"), orbitHidden: document.querySelector("[data-products-return-to-orbit]")?.hidden, mainHidden: document.querySelector("[data-products-return-main-compass]")?.hidden }));
  assert(selected.state === "PRODUCT_SELECTED" && selected.id === "archcoin" && selected.enter === "false" && selected.orbitHidden === false && selected.mainHidden === true, "PRODUCT_INTERACTION_REGRESSION", selected, profile.id);
  assert(telemetry.pageErrors.length === 0 && telemetry.requestFailures.length === 0, "PRODUCTS_RUNTIME_ERRORS", telemetry, profile.id);
  await page.screenshot({ path: `products-page-narrative-${profile.id.toLowerCase()}.png`, fullPage: true });
  observations.push({ surface: "products", profile: profile.id, initial, exclusive, retracted, index, selected, telemetry });
  await page.close();
}

for (const [id, route] of campaigns) {
  for (const profile of campaignProfiles) {
    const page = await browser.newPage();
    await page.setViewport({ width: profile.width, height: profile.height, deviceScaleFactor: 1, isMobile: profile.mobile, hasTouch: profile.mobile });
    const telemetry = { pageErrors: [], requestFailures: [] };
    page.on("pageerror", error => telemetry.pageErrors.push(String(error?.message || error)));
    page.on("requestfailed", request => telemetry.requestFailures.push({ url: request.url(), error: request.failure()?.errorText || "" }));
    await page.goto(`${ORIGIN}${route}`, { waitUntil: "networkidle0", timeout: 45000 });
    await page.waitForFunction(() => document.documentElement.dataset.campaignTabsStatus === "ready", { timeout: 15000 });
    const initial = await page.evaluate(() => {
      const tabs = [...document.querySelectorAll('[role="tab"]')];
      const panels = [...document.querySelectorAll('[role="tabpanel"]')];
      const hero = document.querySelector(".campaign-hero__media img");
      return {
        route: document.documentElement.dataset.route,
        h1Count: document.querySelectorAll("h1").length,
        tabCount: tabs.length,
        panelCount: panels.length,
        selected: tabs.filter(tab => tab.getAttribute("aria-selected") === "true").map(tab => tab.id),
        visible: panels.filter(panel => !panel.hidden && panel.getAttribute("aria-hidden") === "false").map(panel => panel.id),
        openDetails: document.querySelectorAll("details[open]").length,
        hero: hero ? { complete: hero.complete, width: hero.naturalWidth, height: hero.naturalHeight } : null,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        receipt: globalThis.DGB_CAMPAIGN_TABS_RECEIPT
      };
    });
    assert(initial.route === route && initial.h1Count === 1, "CAMPAIGN_RUNTIME_ROUTE_INVALID", initial, `${id}:${profile.id}`);
    assert(initial.tabCount === 4 && initial.panelCount === 4 && initial.selected.length === 1 && initial.visible.length === 1, "CAMPAIGN_INITIAL_TAB_STATE_INVALID", initial, `${id}:${profile.id}`);
    assert(initial.openDetails === 0, "CAMPAIGN_DISCLOSURE_BASELINE_INVALID", initial, `${id}:${profile.id}`);
    assert(initial.hero?.complete && initial.hero.width > 0 && initial.hero.height > 0, "CAMPAIGN_HERO_IMAGE_FAILED", initial, `${id}:${profile.id}`);
    assert(initial.overflow <= 1, "CAMPAIGN_HORIZONTAL_OVERFLOW", initial, `${id}:${profile.id}`);
    await page.click('[role="tab"]:nth-of-type(2)');
    const clicked = await page.evaluate(() => ({ selected: document.querySelector('[role="tab"][aria-selected="true"]')?.id || "", visible: [...document.querySelectorAll('[role="tabpanel"]')].filter(panel => !panel.hidden && panel.getAttribute("aria-hidden") === "false").map(panel => panel.id) }));
    assert(clicked.selected.endsWith("tab-2") && clicked.visible.length === 1 && clicked.visible[0].endsWith("panel-2"), "CAMPAIGN_TAB_CLICK_FAILED", clicked, `${id}:${profile.id}`);
    await page.focus('[role="tab"][aria-selected="true"]');
    await page.keyboard.press("End");
    const keyboard = await page.evaluate(() => ({ selected: document.querySelector('[role="tab"][aria-selected="true"]')?.id || "", visible: [...document.querySelectorAll('[role="tabpanel"]')].filter(panel => !panel.hidden && panel.getAttribute("aria-hidden") === "false").map(panel => panel.id) }));
    assert(keyboard.selected.endsWith("tab-4") && keyboard.visible.length === 1 && keyboard.visible[0].endsWith("panel-4"), "CAMPAIGN_TAB_KEYBOARD_FAILED", keyboard, `${id}:${profile.id}`);
    assert(telemetry.pageErrors.length === 0 && telemetry.requestFailures.length === 0, "CAMPAIGN_RUNTIME_ERRORS", telemetry, `${id}:${profile.id}`);
    if (profile.mobile) await page.screenshot({ path: `campaign-${id}-${profile.id.toLowerCase()}.png`, fullPage: true });
    observations.push({ surface: id, profile: profile.id, initial, clicked, keyboard, telemetry });
    await page.close();
  }
}

await browser.close();
const receipt = {
  tool: "PRODUCTS_PAGE_NARRATIVE_BENCHMARK_v1",
  checkpoint: "CONSIDER_ENERGY_COMMUNITY_CAMPAIGN_FAMILY",
  campaignRoutes: campaigns.map(([, route]) => route),
  observations,
  failures,
  pass: failures.length === 0
};
fs.writeFileSync("products-page-narrative-benchmark-v1.json", JSON.stringify(receipt, null, 2));
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exitCode = 1;
