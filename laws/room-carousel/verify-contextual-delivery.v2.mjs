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
const baseUrl = (process.argv.find(arg => arg.startsWith("--base-url=")) || "--base-url=http://127.0.0.1:4173").split("=")[1].replace(/\/$/, "");
const representativesOnly = process.argv.includes("--representatives");
const staticOnly = process.argv.includes("--static-only");
const routes = representativesOnly
  ? ["/laws/research/findings-and-boundaries/", "/laws/categories/flow/cycles/", "/laws/categories/flow/handoffs/", "/laws/categories/reality/"]
  : Object.keys(manifest.routes);
const viewports = representativesOnly
  ? [{ name: "phone", width: 390, height: 844 }, { name: "tablet", width: 768, height: 1024 }, { name: "desktop", width: 1440, height: 1000 }]
  : [{ name: "phone", width: 390, height: 844 }, { name: "tablet", width: 768, height: 1024 }, { name: "desktop", width: 1440, height: 1000 }];
const screenshotRoutes = new Set([
  "/laws/categories/flow/cycles/",
  "/laws/categories/flow/handoffs/",
  "/laws/categories/reality/",
  "/laws/research/findings-and-boundaries/",
  "/laws/categories/structure/",
  "/laws/research/",
  "/laws/test/reverse-audit/"
]);
const greaterNavigationRoutes = new Set();
const semanticRepresentativeCards = new Map([
  ["/laws/research/findings-and-boundaries/", "supported"],
  ["/laws/categories/flow/cycles/", "rhythm"],
  ["/laws/categories/flow/handoffs/", "failure-boundary"],
  ["/laws/categories/reality/", "evidence"]
]);
const wordCount = value => String(value || "").trim().split(/\s+/).filter(Boolean).length;
const normalized = value => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function routeFile(route) {
  return path.join(root, route.endsWith(".html") ? route.slice(1) : route.slice(1), route.endsWith(".html") ? "" : "index.html");
}

function declared(html, name) {
  return html.match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
}

assert.equal(manifest.schema, "LAWS_SEMANTIC_CELL_ENRICHMENT_ROUTE_CARD_MAP_v4");
assert.equal(Object.keys(manifest.routes).length, 29);
assert.ok(new Set(Object.values(manifest.routes).map(route => route.cards.length)).size > 1, "inventories must not be forced to one count");
assert.deepEqual(manifest.internalStoryAxis, { minimum: 4, maximum: 5, labels: "PAGE_AND_CARD_SPECIFIC", visibleCellCount: 1 });

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
  assert.ok(html.includes("room-carousel.v1.js?v=LAWS_SEMANTIC_CELL_ENRICHMENT_GEN1755_20260827"), `${route}: runtime identity`);
  assert.ok(html.includes("room-carousel.v1.css?v=LAWS_SEMANTIC_CELL_ENRICHMENT_GEN1755_20260827"), `${route}: stylesheet identity`);
  assert.ok(html.includes("data-lrc-static"), `${route}: semantic no-script grid`);
  assert.equal((html.match(/data-lrc-shared-premise/g) || []).length, manifest.routes[route].cards.length, `${route}: one static shared premise per card`);
  assert.equal((html.match(/data-lrc-static-delta/g) || []).length, manifest.routes[route].cards.reduce((sum, card) => sum + card.stories.length * 3, 0), `${route}: one static authored delta per cell`);
  assert.ok(html.includes("Source custody"), `${route}: compact custody`);
  assert.ok(!html.includes("lr-legacy-source"), `${route}: raw legacy presentation mirror retired`);
  if (html.includes('class="lr-story-nav"')) greaterNavigationRoutes.add(route);
  for (const card of manifest.routes[route].cards) {
    assert.ok(wordCount(card.sharedPremise) >= 8, `${route}/${card.id}: substantive shared premise`);
    assert.equal(new Set(["practical", "engineering", "empirical"].map(lens => normalized(card.lensFrames?.[lens]))).size, 3, `${route}/${card.id}: distinct lens frames`);
    for (const lens of ["practical", "engineering", "empirical"]) assert.ok(wordCount(card.lensFrames?.[lens]) >= 12, `${route}/${card.id}: substantive ${lens} frame`);
    assert.ok(Array.isArray(card.stories) && card.stories.length >= 4 && card.stories.length <= 5, `${route}/${card.id}: four or five story layers`);
    assert.equal(new Set(card.stories.map(story => story.id)).size, card.stories.length, `${route}/${card.id}: unique story ids`);
    assert.equal(new Set(card.stories.map(story => story.label)).size, card.stories.length, `${route}/${card.id}: distinct story labels`);
    assert.equal(new Set(card.stories.map(story => normalized(story.focus))).size, card.stories.length, `${route}/${card.id}: distinct story focus`);
    const cardDeltas = [];
    for (const story of card.stories) {
      assert.ok(!/\bboundary \d+\b/i.test(story.label), `${route}/${card.id}/${story.id}: no generated placeholder label`);
      assert.ok(wordCount(story.focus) >= 12, `${route}/${card.id}/${story.id}: substantive story focus`);
      for (const lens of ["practical", "engineering", "empirical"]) {
        const delta = String(story.deltas?.[lens] || "").trim();
        assert.ok(wordCount(delta) >= 12, `${route}/${card.id}/${story.id}: ${lens} authored delta substantive`);
        assert.ok(!/^(design|procedural|scope|claim|test|record)\.?$/i.test(delta), `${route}/${card.id}/${story.id}: ${lens} no placeholder delta`);
        assert.ok(!normalized(delta).includes(normalized(card.sharedPremise)), `${route}/${card.id}/${story.id}: ${lens} shared premise not repeated in delta`);
        cardDeltas.push(normalized(delta));
      }
    }
    assert.equal(new Set(cardDeltas).size, cardDeltas.length, `${route}/${card.id}: no exact duplicate authored delta`);
  }
}

if (staticOnly) {
  console.log(JSON.stringify({ result: "PASS", mode: "static", routes: routes.length }));
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

      const representativeCardId = semanticRepresentativeCards.get(route);
      const representativeIndex = representativeCardId ? expected.findIndex(card => card.id === representativeCardId) : -1;
      const targetIndex = representativeIndex >= 0 ? representativeIndex : Math.min(1, expected.length - 1);
      if (route.includes("/flow/cycles/") || route.includes("/flow/handoffs/")) {
        const box = await page.locator("[data-lrc-viewport]").boundingBox();
        assert.ok(box, `${route} ${viewport.name}: viewport geometry`);
        await page.mouse.move(box.x + box.width * 0.66, box.y + box.height * 0.55);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * 0.34, box.y + box.height * 0.55, { steps: 5 });
        await page.mouse.up();
        const swipedIndex = Math.min(1, expected.length - 1);
        assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-index"), String(swipedIndex), `${route} ${viewport.name}: one swipe one outer step`);
        if (targetIndex !== swipedIndex) await page.locator("[data-lrc-tab]").nth(targetIndex).click();
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
      assert.equal(await page.locator("[data-lrc-card][data-active='true'] [data-lrc-shared-premise]:visible").count(), 1, `${route} ${viewport.name}: shared premise rendered once`);
      assert.equal(await page.locator("[data-lrc-card][data-active='true'] [data-lrc-story-focus]:visible").count(), 1, `${route} ${viewport.name}: one visible story focus`);
      assert.equal(await page.locator("[data-lrc-card][data-active='true'] [data-lrc-lens-frame]:visible").count(), 1, `${route} ${viewport.name}: one visible lens frame`);
      assert.equal(await page.locator("[data-lrc-card][data-active='true'] [data-lrc-selection-delta]:visible").count(), 1, `${route} ${viewport.name}: one visible authored delta`);
      assert.equal((await page.locator("[data-lrc-card][data-active='true'] [data-lrc-selection-delta]:visible > strong").textContent()).trim(), "What this selection adds", `${route} ${viewport.name}: delta is explicitly labelled`);

      const visibleText = async selector => normalized(await page.locator(`[data-lrc-card][data-active='true'] ${selector}:visible > p`).innerText());
      const visibleDeltaColor = () => page.locator("[data-lrc-card][data-active='true'] [data-lrc-selection-delta]:visible").evaluate(node => getComputedStyle(node).borderLeftColor);
      const initialShared = await visibleText("[data-lrc-shared-premise]");
      const initialFocus = await visibleText("[data-lrc-story-focus]");
      const practicalFrame = await visibleText("[data-lrc-lens-frame]");
      const initialDelta = await visibleText("[data-lrc-selection-delta]");
      const practicalColor = await visibleDeltaColor();
      const secondStory = expected[targetIndex].stories[1].id;
      await page.locator("[data-lrc-card][data-active='true'] [data-lrc-story-tab]").nth(1).click();
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-story"), secondStory, `${route} ${viewport.name}: vertical story changes`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-layer"), "practical", `${route} ${viewport.name}: story change preserves lens`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-index"), String(targetIndex), `${route} ${viewport.name}: story change preserves outer index`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-id"), activeId, `${route} ${viewport.name}: story change preserves card`);
      const secondShared = await visibleText("[data-lrc-shared-premise]");
      const secondFocus = await visibleText("[data-lrc-story-focus]");
      const secondPracticalFrame = await visibleText("[data-lrc-lens-frame]");
      const secondPracticalDelta = await visibleText("[data-lrc-selection-delta]");
      assert.equal(secondShared, initialShared, `${route} ${viewport.name}: story change preserves one shared premise`);
      assert.notEqual(secondFocus, initialFocus, `${route} ${viewport.name}: story change changes authored focus`);
      assert.equal(secondPracticalFrame, practicalFrame, `${route} ${viewport.name}: story change preserves selected lens frame`);
      assert.notEqual(secondPracticalDelta, initialDelta, `${route} ${viewport.name}: story change changes authored delta`);
      await page.locator("[data-lrc-card][data-active='true'] [data-lrc-inner-tab='engineering']").click();
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-layer"), "engineering", `${route} ${viewport.name}: inner layer change`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-story"), secondStory, `${route} ${viewport.name}: lens change preserves story`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-index"), String(targetIndex), `${route} ${viewport.name}: inner layer preserves outer index`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-id"), activeId, `${route} ${viewport.name}: inner layer preserves card`);
      assert.equal(await page.locator("[data-lrc-card][data-active='true'] [data-lrc-grid-cell]:visible").count(), 1, `${route} ${viewport.name}: one cell remains visible after both-axis changes`);
      const engineeringShared = await visibleText("[data-lrc-shared-premise]");
      const engineeringFocus = await visibleText("[data-lrc-story-focus]");
      const engineeringFrame = await visibleText("[data-lrc-lens-frame]");
      const engineeringDelta = await visibleText("[data-lrc-selection-delta]");
      const engineeringColor = await visibleDeltaColor();
      assert.equal(engineeringShared, initialShared, `${route} ${viewport.name}: lens change preserves shared premise`);
      assert.equal(engineeringFocus, secondFocus, `${route} ${viewport.name}: lens change preserves selected story focus`);
      assert.notEqual(engineeringFrame, practicalFrame, `${route} ${viewport.name}: engineering changes the lens frame`);
      assert.notEqual(engineeringDelta, secondPracticalDelta, `${route} ${viewport.name}: engineering changes the authored delta`);
      await page.locator("[data-lrc-card][data-active='true'] [data-lrc-inner-tab='empirical']").click();
      const empiricalFrame = await visibleText("[data-lrc-lens-frame]");
      const empiricalDelta = await visibleText("[data-lrc-selection-delta]");
      const empiricalColor = await visibleDeltaColor();
      assert.notEqual(empiricalFrame, engineeringFrame, `${route} ${viewport.name}: empirical changes the lens frame`);
      assert.notEqual(empiricalDelta, engineeringDelta, `${route} ${viewport.name}: empirical changes the authored delta`);
      assert.equal(new Set([practicalColor, engineeringColor, empiricalColor]).size, 3, `${route} ${viewport.name}: each lens has a distinct delta color`);
      assert.equal((await page.locator("[data-lrc-card][data-active='true'] [data-lrc-lens-frame]:visible > strong").textContent()).trim(), "Empirical lens frame", `${route} ${viewport.name}: color difference is paired with a lens label`);
      await page.locator("[data-lrc-card][data-active='true'] [data-lrc-inner-tab='engineering']").click();

      const geometry = await page.evaluate(() => {
        const returnControl = document.querySelector("[data-lrc-card][data-active='true'] [data-lrc-return]");
        const innerTabs = document.querySelector("[data-lrc-card][data-active='true'] [data-lrc-inner-tabs]");
        const rect = returnControl.getBoundingClientRect();
        return {
          viewportOverflow: document.documentElement.scrollWidth - innerWidth,
          innerOverflow: innerTabs.scrollWidth - innerTabs.clientWidth,
          storyOverflow: document.querySelector("[data-lrc-card][data-active='true'] [data-lrc-story-rail]").scrollWidth - document.querySelector("[data-lrc-card][data-active='true'] [data-lrc-story-rail]").clientWidth,
          returnTop: rect.top,
          returnBottom: rect.bottom
        };
      });
      assert.ok(geometry.viewportOverflow <= 1, `${route} ${viewport.name}: no page horizontal overflow`);
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
      const expectedStoryCount = greaterNavigationRoutes.has(route) ? 2 : 0;
      assert.equal(storyCount, expectedStoryCount, `${route} ${viewport.name}: declared greater-navigation count`);
      const destinations = await page.locator(".lr-story-nav a").evaluateAll(nodes => nodes.map(node => node.getAttribute("href")));
      assert.ok(destinations.every(destination => destination?.startsWith("/laws/") || destination?.startsWith("/frontier/")), `${route} ${viewport.name}: declared bottom destinations`);
      if (route === "/laws/categories/reality/") assert.deepEqual(destinations, ["/laws/categories/integrity/", "/laws/categories/structure/"], `${route} ${viewport.name}: Reality continuity destinations`);
      if (destinations.length) {
        const destination = destinations[0];
        await Promise.all([
          page.waitForNavigation({ waitUntil: "domcontentloaded" }),
          page.locator(".lr-story-nav a").first().click()
        ]);
        assert.equal(new URL(page.url()).pathname, new URL(destination, baseUrl).pathname, `${route} ${viewport.name}: bottom route navigation used`);
      }
      assert.deepEqual(errors, [], `${route} ${viewport.name}: no page errors`);
      evidence.push({ route, viewport: viewport.name, card: activeId, story: secondStory, lens: "engineering", storyNavigation: destinations.length > 0 });
      await page.close();
    }
    await context.close();
  }
  const result = { result: "PASS", mode: representativesOnly ? "representatives" : "full", routes: routes.length, viewports: viewports.length, evidence };
  fs.writeFileSync(path.join(artifactDir, "contextual-delivery-browser-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
