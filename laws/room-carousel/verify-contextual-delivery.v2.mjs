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
  ? ["/laws/categories/flow/cycles/", "/laws/categories/flow/handoffs/"]
  : Object.keys(manifest.routes);
const viewports = representativesOnly
  ? [{ name: "phone", width: 390, height: 844 }, { name: "tablet", width: 768, height: 1024 }]
  : [{ name: "phone", width: 390, height: 844 }, { name: "tablet", width: 768, height: 1024 }, { name: "desktop", width: 1440, height: 1000 }];

function routeFile(route) {
  return path.join(root, route.endsWith(".html") ? route.slice(1) : route.slice(1), route.endsWith(".html") ? "" : "index.html");
}

function declared(html, name) {
  return html.match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
}

assert.equal(manifest.schema, "LAWS_CONTEXTUAL_DELIVERY_ROUTE_CARD_MAP_v2");
assert.equal(Object.keys(manifest.routes).length, 29);
assert.ok(new Set(Object.values(manifest.routes).map(route => route.cards.length)).size > 1, "inventories must not be forced to one count");

for (const route of routes) {
  const file = routeFile(route);
  assert.ok(fs.existsSync(file), `${route}: source file exists`);
  const html = fs.readFileSync(file, "utf8");
  const ids = manifest.routes[route].cards.map(card => card.id).join(" ");
  assert.equal(declared(html, "data-lrc-route"), route, `${route}: explicit route declaration`);
  assert.equal(declared(html, "data-lrc-cards"), ids, `${route}: explicit outer inventory`);
  assert.equal(declared(html, "data-lrc-internal-tabs"), "practical engineering empirical", `${route}: explicit inner controls`);
  assert.equal(declared(html, "data-lrc-custody-selector"), "details.lr-audit", `${route}: explicit custody role`);
  assert.equal(declared(html, "data-lrc-greater-navigation-selector"), ".lr-story-nav", `${route}: explicit greater-navigation role`);
  assert.ok(html.includes("room-carousel.v1.js?v=LAWS_CONTEXTUAL_DELIVERY_GEN1750_20260827"), `${route}: runtime identity`);
  assert.ok(html.includes("room-carousel.v1.css?v=LAWS_CONTEXTUAL_DELIVERY_GEN1750_20260827"), `${route}: stylesheet identity`);
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

const browser = await chromium.launch({ headless: true });
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
      assert.equal(await page.locator("details.lr-audit[open]").count(), 0, `${route} ${viewport.name}: custody collapsed`);

      const targetIndex = Math.min(1, expected.length - 1);
      await page.locator("[data-lrc-tab]").nth(targetIndex).click();
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-index"), String(targetIndex), `${route} ${viewport.name}: outer rotate`);
      const activeId = await page.locator(rootSelector).getAttribute("data-lrc-id");
      await page.locator("[data-lrc-card][data-active='true'] [data-lrc-inspect]").click();
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-layer"), "practical", `${route} ${viewport.name}: practical on open`);
      assert.equal(await page.locator("[data-lrc-inner-tabs]:visible").count(), 1, `${route} ${viewport.name}: inner controls visible on open`);
      await page.locator("[data-lrc-card][data-active='true'] [data-lrc-inner-tab='engineering']").click();
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-layer"), "engineering", `${route} ${viewport.name}: inner layer change`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-index"), String(targetIndex), `${route} ${viewport.name}: inner layer preserves outer index`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-id"), activeId, `${route} ${viewport.name}: inner layer preserves card`);

      const geometry = await page.evaluate(() => {
        const returnControl = document.querySelector("[data-lrc-card][data-active='true'] [data-lrc-return]");
        const innerTabs = document.querySelector("[data-lrc-card][data-active='true'] [data-lrc-inner-tabs]");
        const rect = returnControl.getBoundingClientRect();
        return {
          viewportOverflow: document.documentElement.scrollWidth - innerWidth,
          innerOverflow: innerTabs.scrollWidth - innerTabs.clientWidth,
          returnTop: rect.top,
          returnBottom: rect.bottom
        };
      });
      assert.ok(geometry.viewportOverflow <= 1, `${route} ${viewport.name}: no page horizontal overflow`);
      assert.ok(geometry.innerOverflow <= 1, `${route} ${viewport.name}: no nested horizontal scroll`);
      assert.ok(geometry.returnTop >= -1 && geometry.returnBottom <= viewport.height, `${route} ${viewport.name}: return immediately available`);
      if (representativesOnly) {
        const name = route.includes("cycles") ? "cycles" : "handoffs";
        await page.screenshot({ path: path.join(artifactDir, `contextual-${viewport.name}-${name}-engineering.png`), fullPage: false });
      }

      await page.locator("[data-lrc-card][data-active='true'] [data-lrc-return]").click();
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-layer"), "orbit", `${route} ${viewport.name}: return to orbit`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-id"), activeId, `${route} ${viewport.name}: return to same card`);
      const storyLinks = page.locator(":scope > .lr-story-nav a").filter({ visible: true });
      const storyCount = await page.locator(".lr-story-nav a").count();
      if (storyCount) {
        const destination = await page.locator(".lr-story-nav a").first().getAttribute("href");
        assert.ok(destination?.startsWith("/laws/"), `${route} ${viewport.name}: bottom route navigation`);
      }
      assert.deepEqual(errors, [], `${route} ${viewport.name}: no page errors`);
      evidence.push({ route, viewport: viewport.name, card: activeId, layer: "engineering", storyNavigation: storyCount > 0 });
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
