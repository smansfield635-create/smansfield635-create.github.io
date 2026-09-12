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
const ADMITTED_HEAD = "24c1bca8858499c86262a2534c5a84b54be537f2";
const baseUrl = (process.argv.find(arg => arg.startsWith("--base-url=")) || "--base-url=http://127.0.0.1:4173").split("=")[1].replace(/\/$/, "");
const representativesOnly = process.argv.includes("--representatives");
const staticOnly = process.argv.includes("--static-only");
const allRoutes = Object.keys(manifest.routes);
const representatives = [
  "/laws/categories/flow/cycles/",
  "/laws/categories/reality/",
  "/laws/categories/structure/",
  "/laws/categories/integrity/",
  "/laws/research/evidence-and-sources/",
  "/laws/research/",
  "/laws/test/reverse-audit/"
].filter(route => manifest.routes[route]);
const routes = representativesOnly ? representatives : allRoutes;
const viewports = [
  { name: "phone", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 1000 }
];
const screenshotRoutes = new Set(representatives);
const GEOMETRY_TOLERANCE_PX = 2;

function routeFile(route) {
  return path.join(root, route.slice(1), route.endsWith(".html") ? "" : "index.html");
}
function routeRelativeFile(route) {
  return path.relative(root, routeFile(route)).replaceAll(path.sep, "/");
}
function declared(html, name) {
  return html.match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
}
function gitChanged(paths) {
  const output = execFileSync("git", ["diff", "--name-only", `${ADMITTED_HEAD}...HEAD`, "--", ...paths], { cwd: root, encoding: "utf8" }).trim();
  return output ? output.split(/\r?\n/).filter(Boolean).sort() : [];
}
function normalizeText(value) {
  return String(value || "").toLowerCase()
    .replace(/\b(the|a|an|and|or|to|of|in|on|for|with|as|is|are|be|by|that|this|it|its|from|at|into|than|then|when|where|what|who|how)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);
}
function jaccard(a, b) {
  const left = new Set(normalizeText(a));
  const right = new Set(normalizeText(b));
  if (!left.size && !right.size) return 1;
  const intersection = [...left].filter(token => right.has(token)).length;
  const union = new Set([...left, ...right]).size;
  return union ? intersection / union : 0;
}
function readingFingerprint(story) {
  return [story.label, story.readings?.practical, story.readings?.engineering, story.readings?.empirical].join("\n");
}
function withinTolerance(actual, expected) {
  return Math.abs(actual - expected) <= GEOMETRY_TOLERANCE_PX;
}

assert.equal(manifest.schema, "LAWS_LAYERED_INFORMATION_GRID_ROUTE_CARD_MAP_v3");
assert.equal(allRoutes.length, 29);
assert.deepEqual(gitChanged(["laws/research/methods-and-models/"]), [], "Methods & Models is byte-frozen for Gen1843");
assert.deepEqual(gitChanged(allRoutes.map(routeRelativeFile)), [], "Gen1833 contextual route corpus remains byte-identical");
assert.deepEqual(gitChanged(["laws/room-carousel/route-card-map.v2.json"]), [], "Gen1833 route/card/story corpus remains byte-identical");

const sharedCss = fs.readFileSync(path.join(here, "room-carousel.v1.css"), "utf8");
for (const token of [
  "LAWS_LAYERED_INFORMATION_GRID_GEN1843_METHODS_FROZEN_DIMENSIONAL_GRAMMAR",
  "width:clamp(17rem,30vw,27rem)",
  "height:clamp(24rem,52vh,34rem)",
  "width:min(72vw,27rem)",
  "height:31rem",
  "@media (max-width: 760px)",
  "width:min(82vw,21rem)",
  "height:29rem",
  "@media (max-width: 440px)",
  "width:min(86vw,19.5rem)"
]) assert.ok(sharedCss.includes(token), `shared CSS carries frozen Methods geometry token: ${token}`);
assert.ok(!sharedCss.includes("width:min(55vw,25rem)"), "obsolete 400px tablet family card cap is removed");
assert.ok(!sharedCss.includes("height:25rem !important"), "obsolete square tablet family card height is removed");

const runtimeSource = fs.readFileSync(path.join(here, "room-carousel.v1.js"), "utf8");
for (const token of [
  "METHODS_AND_MODELS_PROGRESSIVE_CARD_ARCHITECTURE_TWO_EXCEPTION_CONTINUITY",
  "Plain-language reading",
  "Why it matters",
  "Engineering detail",
  "Formal / technical reading",
  "Evidence standing",
  "Failure behavior",
  "Limits",
  "data-lrc-summary-stories",
  "data-lrc-inner-tabs",
  "depth-tab-keyboard",
  "methodsReferenceArchitecture:true"
]) assert.ok(runtimeSource.includes(token), `shared runtime includes continuity token: ${token}`);
assert.ok(!/state\.layers\[cardIndex\]\s*=\s*0/.test(runtimeSource.match(/function selectStory[\s\S]*?\n    }/)?.[0] || ""), "story selection does not reset lens state");
assert.ok(!/state\.layers\[state\.index\]\s*=\s*0|state\.stories\[state\.index\]\s*=\s*0/.test(runtimeSource.match(/function openInspection[\s\S]*?\n    }/)?.[0] || ""), "reopening a card does not reset story/lens state");

const exactReadingOwners = new Map();
let storyCount = 0;
let pairCount = 0;
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
    storyCount += card.stories.length;
    for (const story of card.stories) {
      assert.ok(String(story.label || "").trim(), `${route}/${card.id}/${story.id}: authored reader identity`);
      for (const lens of ["practical", "engineering", "empirical"]) assert.ok(String(story.readings?.[lens] || "").trim(), `${route}/${card.id}/${story.id}: ${lens} source material populated`);
      const exact = readingFingerprint(story).replace(/\s+/g, " ").trim();
      const owner = `${route}/${card.id}/${story.id}`;
      assert.ok(!exactReadingOwners.has(exact), `${owner}: exact chapter duplicate of ${exactReadingOwners.get(exact) || "none"}`);
      exactReadingOwners.set(exact, owner);
    }
    for (let i = 0; i < card.stories.length; i += 1) {
      for (let j = i + 1; j < card.stories.length; j += 1) {
        pairCount += 1;
        const similarity = jaccard(readingFingerprint(card.stories[i]), readingFingerprint(card.stories[j]));
        assert.ok(similarity < 0.84, `${route}/${card.id}: semantically over-reused chapters ${card.stories[i].id} vs ${card.stories[j].id} (${similarity.toFixed(3)})`);
      }
    }
  }
}
assert.equal(storyCount, representativesOnly ? storyCount : 551, `chapter inventory remains ${representativesOnly ? "representative" : "551"}`);
assert.equal(pairCount, representativesOnly ? pairCount : 864, `within-card pair inventory remains ${representativesOnly ? "representative" : "864"}`);

if (staticOnly) {
  console.log(JSON.stringify({ result: "PASS", mode: "static-gen1843-dimensional-continuity", routes: routes.length, storyCount, pairCount, methodsFrozen: true, gen1833CorpusPreserved: true }));
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
const artifactDir = path.join(root, "artifacts/laws-cp6-final-synchronization/gen1843-dimensional-continuity");
fs.mkdirSync(artifactDir, { recursive: true });

try {
  const evidence = [];
  const methodsReference = {};
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: "reduce" });

    const methodsPage = await context.newPage();
    await methodsPage.goto(`${baseUrl}/laws/research/methods-and-models/`, { waitUntil: "networkidle" });
    await methodsPage.waitForSelector('.mm-card[data-active="true"]');
    const methodsRect = await methodsPage.locator('.mm-card[data-active="true"]').boundingBox();
    assert.ok(methodsRect, `Methods ${viewport.name}: active reference card measurable`);
    methodsReference[viewport.name] = { width: methodsRect.width, height: methodsRect.height };
    await methodsPage.close();

    for (const route of routes) {
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      const rootSelector = "[data-laws-room-carousel]";
      await page.waitForSelector(`${rootSelector}[data-lrc-mounted="true"]`);
      const expected = manifest.routes[route].cards;
      const targetIndex = Math.min(1, expected.length - 1);
      const activeCard = "[data-lrc-card][data-active='true']";

      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-reference-architecture"), "methods-and-models", `${route} ${viewport.name}: Methods reference declared`);
      assert.equal(await page.locator("[data-lrc-tab]").count(), expected.length, `${route} ${viewport.name}: outer inventory`);
      assert.deepEqual(await page.locator("[data-lrc-tab-label]").allTextContents(), expected.map(card => card.label), `${route} ${viewport.name}: page-specific outer labels preserved`);
      assert.equal(await page.locator("details.lr-audit[open]").count(), 0, `${route} ${viewport.name}: custody collapsed`);

      await page.locator("[data-lrc-tab]").nth(targetIndex).click();
      const activeId = await page.locator(rootSelector).getAttribute("data-lrc-id");
      const orbitRect = await page.locator(activeCard).boundingBox();
      assert.ok(orbitRect, `${route} ${viewport.name}: active orbit card measurable`);
      const reference = methodsReference[viewport.name];
      assert.ok(withinTolerance(orbitRect.width, reference.width), `${route} ${viewport.name}: card width ${orbitRect.width.toFixed(2)} matches frozen Methods ${reference.width.toFixed(2)} ±${GEOMETRY_TOLERANCE_PX}px`);
      assert.ok(withinTolerance(orbitRect.height, reference.height), `${route} ${viewport.name}: card height ${orbitRect.height.toFixed(2)} matches frozen Methods ${reference.height.toFixed(2)} ±${GEOMETRY_TOLERANCE_PX}px`);
      assert.equal(await page.locator(`${activeCard} [data-lrc-summary-stories] span`).count(), Math.min(3, expected[targetIndex].stories.length), `${route} ${viewport.name}: orbit card carries directed story preview`);

      if (screenshotRoutes.has(route)) {
        const name = route.replace(/^\/laws\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
        await page.screenshot({ path: path.join(artifactDir, `orbit-${viewport.name}-${name}.png`), fullPage: false });
      }

      await page.locator(`${activeCard} [data-lrc-inspect]`).click();
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-story"), expected[targetIndex].stories[0].id, `${route} ${viewport.name}: stored first story opens initially`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-layer"), "practical", `${route} ${viewport.name}: stored practical lens opens initially`);
      assert.equal(await page.locator(`${activeCard} [data-lrc-inner-tabs]:visible`).count(), 1, `${route} ${viewport.name}: internal lens rail is visibly inside opened card`);
      assert.equal(await page.locator(`${activeCard} [data-lrc-inner-tab]`).count(), 3, `${route} ${viewport.name}: three independent internal lenses`);
      assert.deepEqual(await page.locator(`${activeCard} [data-lrc-inner-tab]`).allTextContents(), ["Reading", "Engineering", "Evidence"], `${route} ${viewport.name}: internal lens labels`);
      assert.equal(await page.locator(`${activeCard} [data-lrc-story-rail]:visible`).count(), 1, `${route} ${viewport.name}: authored story rail visible`);
      assert.equal(await page.locator(`${activeCard} [data-lrc-story-tab]`).count(), expected[targetIndex].stories.length, `${route} ${viewport.name}: story inventory preserved`);

      const storyIndex = Math.min(1, expected[targetIndex].stories.length - 1);
      await page.locator(`${activeCard} [data-lrc-story-tab]`).nth(storyIndex).click();
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-story"), expected[targetIndex].stories[storyIndex].id, `${route} ${viewport.name}: story changes independently`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-layer"), "practical", `${route} ${viewport.name}: story change preserves practical lens`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-id"), activeId, `${route} ${viewport.name}: story change preserves outer card`);

      await page.locator(`${activeCard} [data-lrc-inner-tab]`).nth(1).click();
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-layer"), "engineering", `${route} ${viewport.name}: Engineering lens selected`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-story"), expected[targetIndex].stories[storyIndex].id, `${route} ${viewport.name}: lens change preserves story`);
      let selected = page.locator(`${activeCard} [data-lrc-grid-cell]:visible`);
      assert.equal(await selected.locator(".lrc-engineering-depth").getAttribute("open"), "", `${route} ${viewport.name}: Engineering lens opens technical layer`);
      assert.equal(await selected.locator(".lrc-engineering-identity:visible").count(), 1, `${route} ${viewport.name}: formal technical reading visible`);

      const engineeringTab = page.locator(`${activeCard} [data-lrc-inner-tab]`).nth(1);
      await engineeringTab.focus();
      await engineeringTab.press("ArrowRight");
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-layer"), "empirical", `${route} ${viewport.name}: lens keyboard navigation reaches Evidence`);
      selected = page.locator(`${activeCard} [data-lrc-grid-cell]:visible`);
      const evidenceText = await selected.locator(".lrc-engineering-grid").innerText();
      assert.match(evidenceText, /Evidence standing/i, `${route} ${viewport.name}: Evidence standing visible`);
      assert.match(evidenceText, /Failure behavior/i, `${route} ${viewport.name}: Failure behavior visible`);
      assert.match(evidenceText, /Limits/i, `${route} ${viewport.name}: Limits visible`);

      const nextStoryIndex = Math.min(storyIndex + 1, expected[targetIndex].stories.length - 1);
      await page.locator(`${activeCard} [data-lrc-story-tab]`).nth(nextStoryIndex).click();
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-story"), expected[targetIndex].stories[nextStoryIndex].id, `${route} ${viewport.name}: second story change applies`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-layer"), "empirical", `${route} ${viewport.name}: story change preserves Evidence lens independently`);

      const geometry = await page.evaluate(() => {
        const active = document.querySelector("[data-lrc-card][data-active='true']");
        const rail = active?.querySelector("[data-lrc-story-rail]");
        const lenses = active?.querySelector("[data-lrc-inner-tabs]");
        const ret = active?.querySelector("[data-lrc-return]")?.getBoundingClientRect();
        return {
          pageOverflow: document.documentElement.scrollWidth - innerWidth,
          cardOverflow: active ? active.scrollWidth - active.clientWidth : 999,
          railOverflow: rail ? rail.scrollWidth - rail.clientWidth : 999,
          lensOverflow: lenses ? lenses.scrollWidth - lenses.clientWidth : 999,
          returnTop: ret?.top ?? -999,
          returnBottom: ret?.bottom ?? 999
        };
      });
      assert.ok(geometry.pageOverflow <= 1, `${route} ${viewport.name}: zero page horizontal overflow`);
      assert.ok(geometry.cardOverflow <= 1, `${route} ${viewport.name}: zero card horizontal overflow`);
      assert.ok(geometry.railOverflow <= 1, `${route} ${viewport.name}: zero story-rail horizontal overflow`);
      assert.ok(geometry.lensOverflow <= 1, `${route} ${viewport.name}: zero lens-rail horizontal overflow`);
      assert.ok(geometry.returnTop >= -1 && geometry.returnBottom <= viewport.height + 1, `${route} ${viewport.name}: Return to Orbit immediately available`);

      await page.locator(`${activeCard} [data-lrc-return]`).click();
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-layer"), "orbit", `${route} ${viewport.name}: return to orbit`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-id"), activeId, `${route} ${viewport.name}: return lands on same outer card`);
      await page.locator(`${activeCard} [data-lrc-inspect]`).click();
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-story"), expected[targetIndex].stories[nextStoryIndex].id, `${route} ${viewport.name}: reopen restores same story`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-lrc-layer"), "empirical", `${route} ${viewport.name}: reopen restores same lens`);
      await page.locator(`${activeCard} [data-lrc-return]`).click();
      assert.deepEqual(errors, [], `${route} ${viewport.name}: zero page errors`);
      evidence.push({ route, viewport: viewport.name, activeId, orbitWidth: orbitRect.width, orbitHeight: orbitRect.height, methodsWidth: reference.width, methodsHeight: reference.height, restoredStory: expected[targetIndex].stories[nextStoryIndex].id, restoredLens: "empirical", storyCount: expected[targetIndex].stories.length });
      await page.close();
    }
    await context.close();
  }
  const receipt = { result: "PASS", mode: representativesOnly ? "representative-gen1843-dimensional-continuity" : "full-gen1843-dimensional-continuity", routes: routes.length, viewports: viewports.map(v => v.name), storyCount, pairCount, gen1833CorpusPreserved: true, methodsFrozen: true, geometryTolerancePx: GEOMETRY_TOLERANCE_PX, methodsReference, evidence };
  fs.writeFileSync(path.join(artifactDir, representativesOnly ? "representative-dimensional-continuity-runtime.json" : "full-dimensional-continuity-runtime.json"), JSON.stringify(receipt, null, 2) + "\n");
  console.log(JSON.stringify({ result: "PASS", mode: receipt.mode, routes: routes.length, viewportCount: viewports.length, storyCount, pairCount, checks: evidence.length, methodsFrozen: true, geometryTolerancePx: GEOMETRY_TOLERANCE_PX }));
} finally {
  await browser.close();
}
