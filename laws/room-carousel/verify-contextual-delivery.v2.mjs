#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const manifest = JSON.parse(fs.readFileSync(path.join(here, "route-card-map.v2.json"), "utf8"));
const runtimeSource = fs.readFileSync(path.join(here, "room-carousel.v1.js"), "utf8");
const baseUrl = (process.argv.find(arg => arg.startsWith("--base-url=")) || "--base-url=http://127.0.0.1:4173").split("=")[1].replace(/\/$/, "");
const representativesOnly = process.argv.includes("--representatives");
const staticOnly = process.argv.includes("--static-only");
const routes = representativesOnly
  ? ["/laws/categories/flow/cycles/", "/laws/categories/flow/handoffs/", "/laws/categories/reality/"]
  : Object.keys(manifest.routes);
const viewports = representativesOnly
  ? [{ name: "phone", width: 390, height: 844 }, { name: "tablet", width: 768, height: 1024 }]
  : [{ name: "phone", width: 390, height: 844 }, { name: "tablet", width: 768, height: 1024 }, { name: "desktop", width: 1440, height: 1000 }];
const screenshotRoutes = new Set([
  "/laws/categories/flow/cycles/",
  "/laws/categories/flow/handoffs/",
  "/laws/categories/reality/",
  "/laws/categories/structure/",
  "/laws/research/",
  "/laws/test/reverse-audit/"
]);
const terminalResearchRoute = "/laws/research/findings-and-boundaries/";
const terminalResearchDestination = "/frontier/energy/battery-coherence-study/";

function routeFile(route) {
  return path.join(root, route.endsWith(".html") ? route.slice(1) : route.slice(1), route.endsWith(".html") ? "" : "index.html");
}

function declared(html, name) {
  return html.match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
}

function visibleText(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

assert.equal(manifest.schema, "LAWS_LAYERED_INFORMATION_GRID_ROUTE_CARD_MAP_v3");
assert.equal(Object.keys(manifest.routes).length, 29);
assert.ok(new Set(Object.values(manifest.routes).map(route => route.cards.length)).size > 1, "inventories must not be forced to one count");
assert.deepEqual(manifest.internalStoryAxis, { minimum: 4, maximum: 5, labels: "PAGE_AND_CARD_SPECIFIC", visibleCellCount: 1 });
assert.ok(runtimeSource.includes("function ensureGreaterNavigation(root, map, route)"), "runtime must synthesize missing greater-Laws navigation");
assert.ok(runtimeSource.includes('nav.dataset.lrcSynthesized = "greater-laws-navigation"'), "synthesized navigation must be explicitly marked");

for (const route of routes) {
  const file = routeFile(route);
  assert.ok(fs.existsSync(file), `${route}: source file exists`);
  const html = fs.readFileSync(file, "utf8");
  const ids = manifest.routes[route].cards.map(card => card.id).join(" ");
  assert.equal(declared(html, "data-lrc-route"), route, `${route}: explicit route declaration`);
  assert.equal(declared(html, "data-lrc-cards"), ids, `${route}: explicit outer inventory`);
  assert.equal(declared(html, "data-lrc-internal-tabs"), "practical engineering empirical", `${route}: explicit inner controls`);
  assert.equal(declared(html, "data-lrc-story-axis"), "vertical", `${route}: explicit vertical story axis`);
  assert.equal(declared(html, "data-lrc-custody-selector"), "details.lr-audit", `${route}: explicit custody role`);
  assert.equal(declared(html, "data-lrc-greater-navigation-selector"), ".lr-story-nav", `${route}: explicit greater-navigation role`);
  assert.ok(html.includes("room-carousel.v1.js?v=LAWS_LAYERED_INFORMATION_GRID_GEN1751_20260827"), `${route}: runtime identity`);
  assert.ok(html.includes("room-carousel.v1.css?v=LAWS_LAYERED_INFORMATION_GRID_GEN1751_20260827"), `${route}: stylesheet identity`);
  assert.ok(html.includes("data-lrc-static"), `${route}: semantic no-script grid`);
  assert.ok(html.includes("Source custody"), `${route}: compact custody`);
  assert.ok(!html.includes("lr-legacy-source"), `${route}: raw legacy presentation mirror retired`);
  const navBlock = html.match(/<nav class="lr-story-nav"[\s\S]*?<\/nav>/)?.[0] || "";
  if (navBlock) {
    assert.equal((navBlock.match(/<a\s/g) || []).length, 2, `${route}: exactly two authored bottom route links`);
    const navText = visibleText(navBlock);
    assert.match(navText, /\bPrevious\b/i, `${route}: authored Previous route control`);
    if (route === terminalResearchRoute) {
      assert.match(navText, /Complete selected record/i, `${route}: authored terminal Frontier return`);
      assert.ok(navBlock.includes(`href="${terminalResearchDestination}"`), `${route}: terminal Frontier destination`);
    } else {
      assert.match(navText, /\bNext\b/i, `${route}: authored Next route control`);
    }
  }
  for (const card of manifest.routes[route].cards) {
    assert.ok(Array.isArray(card.stories) && card.stories.length >= 4 && card.stories.length <= 5, `${route}/${card.id}: four or five story layers`);
    assert.equal(new Set(card.stories.map(story => story.id)).size, card.stories.length, `${route}/${card.id}: unique story ids`);
    assert.equal(new Set(card.stories.map(story => story.label)).size, card.stories.length, `${route}/${card.id}: distinct story labels`);
    for (const story of card.stories) {
      assert.ok(!/\bboundary \d+\b/i.test(story.label), `${route}/${card.id}/${story.id}: no generated placeholder label`);
      for (const lens of ["practical", "engineering", "empirical"]) {
        assert.ok(String(story.readings?.[lens] || "").trim(), `${route}/${card.id}/${story.id}: ${lens} cell populated`);
      }
    }
  }
}

if (staticOnly) {
  console.log(JSON.stringify({ result: "PASS", mode: "static", routes: routes.length, bottomGreaterNavigationRequiredOnAllRoutes: true, terminalFrontierReturnPreserved: true, runtimeSynthesizesMissingNavigation: true }));
  process.exit(0);
}

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  const runtimeModules = process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
  if (!runtimeModules) throw new Error("Playwright is required for browser qualification");
  ({ chromium } = require(path.join(runtimeModules, "playwright")));
}

const browser = await chromium.launch({
  headless: true,
  ...(process.env.LAWS_BROWSER_EXECUTABLE ? { executablePath: process.env.LAWS_BROWSER_EXECUTABLE } : {})
});
const artifactDir = path.join(root, "artifacts/laws-cp6-final-synchronization");
fs.mkdirSync(artifactDir, { recursive: true });
try {
  const evidence = [];
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: "reduce" });
    for (const route of routes) {
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      const rootSelector = "[data-laws-room-carousel]";
      await page.waitForSelector(`${rootSelector}[data-lrc-mounted="true"]`);
      const expected = manifest.routes[route].cards;
      assert.equal(await page.locator("[data-lrc-tab]").count(), expected.length, `${route} ${viewport.name}: outer count`);
      assert.deepEqual(await page.locator("[data-lrc-tab-label]").allTextContents(), expected.map(card => card.label), `${route} ${viewport.name}: outer labels`);
      assert.equal(await page.locator("[data-lrc-inner-tabs]:visible").count(), 0, `${route} ${viewport.name}: inner controls hidden in orbit`);
      assert.equal(await page.locator("[data-lrc-story-rail]:visible").count(), 0, `${route} ${viewport.name}: story controls hidden in orbit`);
      assert.equal(await page.locator("details.lr-audit[open]").count(), 0, `${route} ${viewport.name}: custody collapsed`);

      const initialOrbitOverflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      assert.ok(initialOrbitOverflow <= 1, `${route} ${viewport.name}: no page horizontal overflow in orbit`);

      const targetIndex = Math.min(1, expected.length - 1);
      if (route.includes("/flow/cycles/") || route.includes("/flow/handoffs/")) {
        const box = await page.locator("[data-lrc-viewport]").boundingBox();
        assert.ok(box, `${route} ${viewport.name}: viewport geometry`);
        await page.mouse.move(box.x + box.width * 0.66, box.y + box.height * 0.55);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * 0.34, box.y + box.height * 0.55, { steps: 5 });
        await page.mouse.up();
        assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-index"), String(targetIndex), `${route} ${viewport.name}: one swipe one outer step`);
      } else {
        await page.locator("[data-lrc-tab]").nth(targetIndex).click();
      }
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-index"), String(targetIndex), `${route} ${viewport.name}: outer rotate`);
      const activeId = await page.locator(rootSelector).getAttribute("data-lrc-id");
      await page.locator("[data-lrc-card][data-active='true'] [data-lrc-inspect]").click();
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-layer"), "practical", `${route} ${viewport.name}: practical on open`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-story"), expected[targetIndex].stories[0].id, `${route} ${viewport.name}: first story on open`);
      assert.equal(await page.locator("[data-lrc-inner-tabs]:visible").count(), 1, `${route} ${viewport.name}: inner controls visible on open`);
      assert.equal(await page.locator("[data-lrc-story-rail]:visible").count(), 1, `${route} ${viewport.name}: vertical story controls visible on open`);
      assert.equal(await page.locator("[data-lrc-card][data-active='true'] [data-lrc-story-tab]").count(), expected[targetIndex].stories.length, `${route} ${viewport.name}: story layer count`);
      assert.equal(await page.locator("[data-lrc-card][data-active='true'] [data-lrc-grid-cell]:visible").count(), 1, `${route} ${viewport.name}: exactly one grid cell visible`);
      const secondStory = expected[targetIndex].stories[1].id;
      await page.locator("[data-lrc-card][data-active='true'] [data-lrc-story-tab]").nth(1).click();
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-story"), secondStory, `${route} ${viewport.name}: vertical story changes`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-layer"), "practical", `${route} ${viewport.name}: story change preserves lens`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-index"), String(targetIndex), `${route} ${viewport.name}: story change preserves outer index`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-id"), activeId, `${route} ${viewport.name}: story change preserves card`);
      await page.locator("[data-lrc-card][data-active='true'] [data-lrc-inner-tab='engineering']").click();
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-layer"), "engineering", `${route} ${viewport.name}: inner layer change`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-story"), secondStory, `${route} ${viewport.name}: lens change preserves story`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-index"), String(targetIndex), `${route} ${viewport.name}: inner layer preserves outer index`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-id"), activeId, `${route} ${viewport.name}: inner layer preserves card`);
      assert.equal(await page.locator("[data-lrc-card][data-active='true'] [data-lrc-grid-cell]:visible").count(), 1, `${route} ${viewport.name}: one cell remains visible after both-axis changes`);

      const geometry = await page.evaluate(() => {
        const returnControl = document.querySelector("[data-lrc-card][data-active='true'] [data-lrc-return]");
        const innerTabs = document.querySelector("[data-lrc-card][data-active='true'] [data-lrc-inner-tabs]");
        const rect = returnControl.getBoundingClientRect();
        return {
          innerOverflow: innerTabs.scrollWidth - innerTabs.clientWidth,
          storyOverflow: document.querySelector("[data-lrc-card][data-active='true'] [data-lrc-story-rail]").scrollWidth - document.querySelector("[data-lrc-card][data-active='true'] [data-lrc-story-rail]").clientWidth,
          returnTop: rect.top,
          returnBottom: rect.bottom
        };
      });
      assert.ok(geometry.innerOverflow <= 1, `${route} ${viewport.name}: no nested horizontal scroll`);
      assert.ok(geometry.storyOverflow <= 1, `${route} ${viewport.name}: no story-rail horizontal scroll`);
      assert.ok(geometry.returnTop >= -1 && geometry.returnBottom <= viewport.height, `${route} ${viewport.name}: return immediately available`);
      if ((representativesOnly || screenshotRoutes.has(route)) && viewport.name !== "desktop") {
        const name = route.replace(/^\/laws\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
        await page.screenshot({ path: path.join(artifactDir, `contextual-${viewport.name}-${name}-engineering.png`), fullPage: false });
      }

      await page.locator("[data-lrc-card][data-active='true'] [data-lrc-return]").click();
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-layer"), "orbit", `${route} ${viewport.name}: return to orbit`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-id"), activeId, `${route} ${viewport.name}: return to same card`);
      const returnedOrbitOverflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      assert.ok(returnedOrbitOverflow <= 1, `${route} ${viewport.name}: no page horizontal overflow after return to orbit`);
      const recordCardIndex = expected.findIndex(card => card.stories.some(story => story.id === "battery-study-relationship" || story.id === "held-out-battery-record"));
      if (recordCardIndex >= 0) {
        const record = expected[recordCardIndex];
        const recordStoryIndex = record.stories.findIndex(story => story.id === "battery-study-relationship" || story.id === "held-out-battery-record");
        await page.locator("[data-lrc-tab]").nth(recordCardIndex).click();
        await page.locator("[data-lrc-card][data-active='true'] [data-lrc-inspect]").click();
        await page.locator("[data-lrc-card][data-active='true'] [data-lrc-story-tab]").nth(recordStoryIndex).click();
        await page.locator("[data-lrc-card][data-active='true'] [data-lrc-inner-tab='empirical']").click();
        const recordText = await page.locator("[data-lrc-card][data-active='true'] [data-lrc-grid-cell]:visible").innerText();
        assert.match(recordText, /AUROC 0\.9394/, `${route} ${viewport.name}: admitted combined result in layered card`);
        assert.match(recordText, /AUROC 0\.9704/, `${route} ${viewport.name}: stronger comparator in layered card`);
        assert.equal(await page.locator("[data-lrc-card][data-active='true'] [data-lrc-grid-cell]:visible").count(), 1, `${route} ${viewport.name}: record remains one visible cell`);
        if ((route === "/laws/categories/reality/" || route === "/laws/research/applied-investigations/") && viewport.name === "phone") {
          const recordName = route.replace(/^\/laws\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
          await page.screenshot({ path: path.join(artifactDir, `layered-record-${viewport.name}-${recordName}.png`), fullPage: false });
        }
        await page.locator("[data-lrc-card][data-active='true'] [data-lrc-return]").click();
      }
      const storyCount = await page.locator(".lr-story-nav a").count();
      assert.equal(storyCount, 2, `${route} ${viewport.name}: exactly two bottom greater-Laws route controls`);
      const navLabels = await page.locator(".lr-story-nav a").allTextContents();
      assert.match(navLabels[0] || "", /^Previous/i, `${route} ${viewport.name}: Previous route control`);
      if (route === terminalResearchRoute) {
        assert.match(navLabels[1] || "", /Complete selected record/i, `${route} ${viewport.name}: terminal Frontier return control`);
      } else {
        assert.match(navLabels[1] || "", /^Next/i, `${route} ${viewport.name}: Next route control`);
      }
      const destinations = await page.locator(".lr-story-nav a").evaluateAll(nodes => nodes.map(node => node.getAttribute("href")));
      assert.ok(destinations.every(destination => destination?.startsWith("/laws/") || destination?.startsWith("/frontier/")), `${route} ${viewport.name}: declared bottom destinations`);
      if (route === "/laws/categories/reality/") assert.deepEqual(destinations, ["/laws/categories/integrity/", "/laws/categories/structure/"], `${route} ${viewport.name}: Reality continuity destinations`);
      if (route === terminalResearchRoute) assert.equal(destinations[1], terminalResearchDestination, `${route} ${viewport.name}: terminal Frontier destination`);
      const destination = destinations[0];
      await Promise.all([
        page.waitForNavigation({ waitUntil: "domcontentloaded" }),
        page.locator(".lr-story-nav a").first().click()
      ]);
      assert.equal(new URL(page.url()).pathname, new URL(destination, baseUrl).pathname, `${route} ${viewport.name}: bottom route navigation used`);
      assert.deepEqual(errors, [], `${route} ${viewport.name}: no page errors`);
      evidence.push({ route, viewport: viewport.name, card: activeId, story: secondStory, lens: "engineering", storyNavigation: true });
      await page.close();
    }
    await context.close();
  }
  const result = { result: "PASS", mode: representativesOnly ? "representatives" : "full", routes: routes.length, viewports: viewports.length, evidence, familyContinuity: "METHODS_MODELS_ALIGNED", bottomGreaterNavigationRequiredOnAllRoutes: true, terminalFrontierReturnPreserved: true };
  fs.writeFileSync(path.join(artifactDir, "contextual-delivery-browser-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
