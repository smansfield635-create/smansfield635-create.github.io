#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const manifest = JSON.parse(fs.readFileSync(path.join(here, "route-card-map.v2.json"), "utf8"));
const baseUrl = (process.argv.find(arg => arg.startsWith("--base-url=")) || "--base-url=http://127.0.0.1:4173").split("=")[1].replace(/\/$/, "");
const representativesOnly = process.argv.includes("--representatives");
const staticOnly = process.argv.includes("--static-only");
const allRoutes = Object.keys(manifest.routes);
const representatives = [
  "/laws/categories/flow/cycles/",
  "/laws/categories/reality/",
  "/laws/categories/structure/",
  "/laws/categories/integrity/",
  "/laws/research/",
  "/laws/test/reverse-audit/"
].filter(route => manifest.routes[route]);
const routes = representativesOnly ? representatives : allRoutes;
const viewports = representativesOnly
  ? [{ name: "phone", width: 390, height: 844 }, { name: "tablet", width: 768, height: 1024 }]
  : [{ name: "phone", width: 390, height: 844 }, { name: "tablet", width: 768, height: 1024 }, { name: "desktop", width: 1440, height: 1000 }];
const screenshotRoutes = new Set(representatives);

function routeFile(route) {
  return path.join(root, route.slice(1), route.endsWith(".html") ? "" : "index.html");
}

function declared(html, name) {
  return html.match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
}

function gitBlob(relativePath) {
  return execFileSync("git", ["hash-object", relativePath], { cwd: root, encoding: "utf8" }).trim();
}

function normalize(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function words(value) {
  return new Set(normalize(value).split(/\s+/).filter(token => token.length > 2));
}

function similarity(a,b) {
  const aa = words(a), bb = words(b);
  if (!aa.size || !bb.size) return 0;
  let shared = 0;
  for (const token of aa) if (bb.has(token)) shared += 1;
  return shared / Math.max(aa.size,bb.size);
}

assert.equal(manifest.schema, "LAWS_LAYERED_INFORMATION_GRID_ROUTE_CARD_MAP_v3");
assert.equal(allRoutes.length, 29);
assert.equal(gitBlob("laws/research/methods-and-models/carousel-progressive.js"), "e9e22bc13f8b98dfbe3ea02a63efd0459a599ead", "Methods progressive JS remains byte-identical");
assert.equal(gitBlob("laws/research/methods-and-models/carousel-progressive.css"), "90e63e37ad67ca96e01650e0ec90c55b2ff3a6c8", "Methods progressive CSS remains byte-identical");
const methodsDiff = execFileSync("git", ["diff", "--name-only", "4aa0ce352cbc28f0cdd38c1288f858b17ae8cb63...HEAD", "--", "laws/research/methods-and-models/"], { cwd: root, encoding: "utf8" }).trim();
assert.equal(methodsDiff, "", "Methods & Models reference tree is untouched during semantic pass");

const runtimeSource = fs.readFileSync(path.join(here, "room-carousel.v1.js"), "utf8");
for (const token of [
  "METHODS_AND_MODELS_PROGRESSIVE_CARD_ARCHITECTURE_BYTE_FROZEN",
  "LAWS_DISTINCT_READING_SEMANTICS_v1",
  "SEMANTIC_RULES",
  "readingRepeated",
  "semanticReading",
  "duplicate-visible-reading",
  "semanticDistinctness:true",
  "Plain-language reading",
  "Why it matters",
  "Engineering detail",
  "Formal / technical reading",
  "Evidence standing",
  "Failure behavior",
  "Limits",
  "data-lrc-summary-stories",
  "methodsReferenceArchitecture:true"
]) assert.ok(runtimeSource.includes(token), `shared runtime includes semantic/reference token: ${token}`);

for (const route of routes) {
  const file = routeFile(route);
  assert.ok(fs.existsSync(file), `${route}: source file exists`);
  const html = fs.readFileSync(file, "utf8");
  const cards = manifest.routes[route].cards;
  assert.equal(declared(html, "data-lrc-route"), route, `${route}: explicit route declaration`);
  assert.equal(declared(html, "data-lrc-cards"), cards.map(card => card.id).join(" "), `${route}: explicit outer inventory`);
  assert.ok(html.includes("data-lrc-static"), `${route}: semantic no-script source remains`);
  assert.ok(!html.includes("lr-legacy-source"), `${route}: raw legacy presentation mirror remains retired`);
  for (const card of cards) {
    assert.ok(Array.isArray(card.stories) && card.stories.length >= 4 && card.stories.length <= 5, `${route}/${card.id}: four or five authored story layers`);
    assert.equal(new Set(card.stories.map(story => story.id)).size, card.stories.length, `${route}/${card.id}: unique story ids`);
    assert.equal(new Set(card.stories.map(story => story.label)).size, card.stories.length, `${route}/${card.id}: distinct story labels`);
    for (const story of card.stories) {
      assert.ok(String(story.label || "").trim(), `${route}/${card.id}/${story.id}: authored reader identity`);
      for (const lens of ["practical", "engineering", "empirical"]) assert.ok(String(story.readings?.[lens] || "").trim(), `${route}/${card.id}/${story.id}: ${lens} source material populated`);
    }
  }
}

if (staticOnly) {
  console.log(JSON.stringify({ result: "PASS", mode: "static-semantic-methods-reference", routes: routes.length, methodsReferenceFrozen: true, semanticContract: "LAWS_DISTINCT_READING_SEMANTICS_v1" }));
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

const browser = await chromium.launch({ headless: true, ...(process.env.LAWS_BROWSER_EXECUTABLE ? { executablePath: process.env.LAWS_BROWSER_EXECUTABLE } : {}) });
const artifactDir = path.join(root, "artifacts/laws-family-final-continuity-editorial-refinement");
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
      const rootNode = page.locator(rootSelector);
      assert.equal(await rootNode.getAttribute("data-lrc-reference-architecture"), "methods-and-models", `${route} ${viewport.name}: Methods reference declared`);
      assert.equal(await rootNode.getAttribute("data-lrc-semantic-contract"), "LAWS_DISTINCT_READING_SEMANTICS_v1", `${route} ${viewport.name}: semantic contract declared`);
      assert.equal(await rootNode.getAttribute("data-lrc-semantic-redesign"), "complete-family-v1", `${route} ${viewport.name}: complete-family semantic redesign active`);
      assert.equal(await rootNode.getAttribute("data-lrc-semantic-failure"), null, `${route} ${viewport.name}: no duplicate visible semantic bundle`);
      assert.equal(await page.locator("[data-lrc-tab]").count(), expected.length, `${route} ${viewport.name}: outer inventory`);
      assert.deepEqual(await page.locator("[data-lrc-tab-label]").allTextContents(), expected.map(card => card.label), `${route} ${viewport.name}: page-specific outer labels preserved`);
      assert.equal(await page.locator("details.lr-audit[open]").count(), 0, `${route} ${viewport.name}: custody collapsed`);

      const semanticAudit = await page.evaluate(() => Array.from(document.querySelectorAll("[data-lrc-card]")).map(card => {
        const panels = Array.from(card.querySelectorAll("[data-lrc-grid-cell]"));
        return {
          id: card.dataset.lrcId,
          failure: card.dataset.lrcSemanticFailure || null,
          bundles: panels.map(panel => ({
            id: panel.dataset.lrcStoryId,
            reauthored: panel.dataset.lrcSemanticReauthored,
            title: panel.querySelector(".lrc-reader-first h3")?.textContent?.trim() || "",
            lead: panel.querySelector(".lrc-reader-lead")?.textContent?.trim() || "",
            why: panel.querySelector(".lrc-reader-why p")?.textContent?.trim() || "",
            engineering: panel.querySelector(".lrc-engineering-statement")?.textContent?.trim() || "",
            evidence: panel.querySelector(".lrc-engineering-grid section:nth-child(1) p")?.textContent?.trim() || "",
            failureText: panel.querySelector(".lrc-engineering-grid section:nth-child(2) p")?.textContent?.trim() || "",
            limits: panel.querySelector(".lrc-engineering-grid section:nth-child(3) p")?.textContent?.trim() || ""
          }))
        };
      }));

      for (const card of semanticAudit) {
        assert.equal(card.failure, null, `${route} ${viewport.name}/${card.id}: semantic runtime did not flag duplication`);
        const visibleBundles = card.bundles.map(item => [item.title,item.lead,item.why,item.engineering,item.evidence,item.failureText,item.limits].join(" | "));
        assert.equal(new Set(visibleBundles.map(normalize)).size, visibleBundles.length, `${route} ${viewport.name}/${card.id}: each story exposes a distinct visible semantic bundle`);
        for (let i = 0; i < visibleBundles.length; i += 1) {
          for (let j = i + 1; j < visibleBundles.length; j += 1) {
            assert.ok(similarity(visibleBundles[i],visibleBundles[j]) < .82, `${route} ${viewport.name}/${card.id}: story ${i + 1} and ${j + 1} are not title-swapped near-duplicates`);
          }
        }
      }

      const targetIndex = Math.min(1, expected.length - 1);
      await page.locator("[data-lrc-tab]").nth(targetIndex).click();
      const activeId = await rootNode.getAttribute("data-lrc-id");
      assert.equal(await page.locator("[data-lrc-card][data-active='true'] [data-lrc-summary-stories] span").count(), Math.min(3, expected[targetIndex].stories.length), `${route} ${viewport.name}: orbit card carries directed story preview`);
      await page.locator("[data-lrc-card][data-active='true'] [data-lrc-inspect]").click();
      assert.equal(await rootNode.getAttribute("data-lrc-story"), expected[targetIndex].stories[0].id, `${route} ${viewport.name}: first authored reading opens`);
      assert.equal(await page.locator("[data-lrc-card][data-active='true'] [data-lrc-story-rail]:visible").count(), 1, `${route} ${viewport.name}: authored reading rail visible`);
      assert.equal(await page.locator("[data-lrc-card][data-active='true'] [data-lrc-story-tab]").count(), expected[targetIndex].stories.length, `${route} ${viewport.name}: page-specific reading inventory`);
      assert.equal(await page.locator("[data-lrc-card][data-active='true'] [data-lrc-grid-cell]:visible").count(), 1, `${route} ${viewport.name}: one selected reading composed`);
      const selected = page.locator("[data-lrc-card][data-active='true'] [data-lrc-grid-cell]:visible");
      assert.equal(await selected.locator(".lrc-reader-first").count(), 1, `${route} ${viewport.name}: plain-language primary reading`);
      assert.equal(await selected.locator(".lrc-reader-why").count(), 1, `${route} ${viewport.name}: why-it-matters hierarchy`);
      assert.equal(await selected.locator(".lrc-engineering-depth").count(), 1, `${route} ${viewport.name}: deeper engineering layer`);
      assert.equal(await selected.locator(".lrc-engineering-grid section").count(), 3, `${route} ${viewport.name}: evidence/failure/limits modules`);
      assert.equal(await selected.locator(".lrc-engineering-depth").getAttribute("open"), null, `${route} ${viewport.name}: progressive disclosure starts reader-first`);
      const firstLead = await selected.locator(".lrc-reader-lead").innerText();
      const firstWhy = await selected.locator(".lrc-reader-why p").innerText();

      const storyIndex = Math.min(1, expected[targetIndex].stories.length - 1);
      await page.locator("[data-lrc-card][data-active='true'] [data-lrc-story-tab]").nth(storyIndex).click();
      assert.equal(await rootNode.getAttribute("data-lrc-story"), expected[targetIndex].stories[storyIndex].id, `${route} ${viewport.name}: authored reading changes`);
      assert.equal(await rootNode.getAttribute("data-lrc-id"), activeId, `${route} ${viewport.name}: reading change preserves same object`);
      const second = page.locator("[data-lrc-card][data-active='true'] [data-lrc-grid-cell]:visible");
      assert.notEqual(normalize(await second.locator(".lrc-reader-lead").innerText()), normalize(firstLead), `${route} ${viewport.name}: switching reading changes the plain-language substance`);
      assert.notEqual(normalize(await second.locator(".lrc-reader-why p").innerText()), normalize(firstWhy), `${route} ${viewport.name}: switching reading changes why-it-matters substance`);
      await second.locator(".lrc-engineering-depth > summary").click();
      assert.equal(await second.locator(".lrc-engineering-depth").getAttribute("open"), "", `${route} ${viewport.name}: engineering detail expands in same object`);
      const depthText = await second.locator(".lrc-engineering-depth").innerText();
      assert.match(depthText, /Evidence standing/i, `${route} ${viewport.name}: evidence standing visible`);
      assert.match(depthText, /Failure behavior/i, `${route} ${viewport.name}: failure behavior visible`);
      assert.match(depthText, /Limits/i, `${route} ${viewport.name}: limits visible`);

      const geometry = await page.evaluate(() => {
        const active = document.querySelector("[data-lrc-card][data-active='true']");
        const rail = active?.querySelector("[data-lrc-story-rail]");
        const ret = active?.querySelector("[data-lrc-return]")?.getBoundingClientRect();
        return {
          pageOverflow: document.documentElement.scrollWidth - innerWidth,
          cardOverflow: active ? active.scrollWidth - active.clientWidth : 999,
          railOverflow: rail ? rail.scrollWidth - rail.clientWidth : 999,
          returnTop: ret?.top ?? -999,
          returnBottom: ret?.bottom ?? 999
        };
      });
      assert.ok(geometry.pageOverflow <= 1, `${route} ${viewport.name}: zero page horizontal overflow`);
      assert.ok(geometry.cardOverflow <= 1, `${route} ${viewport.name}: zero card horizontal overflow`);
      assert.ok(geometry.railOverflow <= 1, `${route} ${viewport.name}: zero reading-rail horizontal overflow`);
      assert.ok(geometry.returnTop >= -1 && geometry.returnBottom <= viewport.height + 1, `${route} ${viewport.name}: Return to Orbit immediately available`);

      if (screenshotRoutes.has(route) && viewport.name !== "desktop") {
        const name = route.replace(/^\/laws\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
        await page.screenshot({ path: path.join(artifactDir, `semantic-${viewport.name}-${name}.png`), fullPage: false });
      }

      await page.locator("[data-lrc-card][data-active='true'] [data-lrc-return]").click();
      assert.equal(await rootNode.getAttribute("data-lrc-layer"), "orbit", `${route} ${viewport.name}: return to orbit`);
      assert.equal(await rootNode.getAttribute("data-lrc-id"), activeId, `${route} ${viewport.name}: return lands on same outer object`);
      assert.deepEqual(errors, [], `${route} ${viewport.name}: zero page errors`);
      evidence.push({ route, viewport: viewport.name, activeId, storyCount: expected[targetIndex].stories.length, referenceArchitecture: "methods-and-models", semanticContract: "LAWS_DISTINCT_READING_SEMANTICS_v1" });
      await page.close();
    }
    await context.close();
  }
  fs.writeFileSync(path.join(artifactDir, "semantic-family-runtime.json"), JSON.stringify({ result: "PASS", routes: routes.length, viewports: viewports.map(v => v.name), semanticContract: "LAWS_DISTINCT_READING_SEMANTICS_v1", evidence }, null, 2) + "\n");
  console.log(JSON.stringify({ result: "PASS", mode: "methods-reference-semantic-runtime", routes: routes.length, viewportCount: viewports.length, checks: evidence.length }));
} finally {
  await browser.close();
}