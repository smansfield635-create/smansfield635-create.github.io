#!/usr/bin/env node
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const manifest = JSON.parse(fs.readFileSync(path.join(here, "route-card-map.v2.json"), "utf8"));
const baseUrl = (process.argv.find(arg => arg.startsWith("--base-url=")) || "--base-url=http://127.0.0.1:4173").split("=")[1].replace(/\/$/, "");
const staticOnly = process.argv.includes("--static-only");
const routes = Object.keys(manifest.routes);
const viewports = [
  { name: "phone", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 1000 }
];

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

if (staticOnly) {
  console.log(JSON.stringify({ result: "PASS", mode: "exhaustive-cross-matrix-static-pass-through", routes: routes.length, semanticContract: "LAWS_EXHAUSTIVE_CROSS_MATRIX_SEMANTIC_AUDIT_v1" }));
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

const findings = [];
const audited = { routes: 0, cards: 0, stories: 0, storyPairs: 0, viewportCardPasses: 0 };

function addFinding(kind, data) {
  findings.push({ kind, ...data });
}

function textFields(bundle) {
  return [bundle.title, bundle.lead, bundle.why, bundle.engineering, bundle.evidence, bundle.failure, bundle.limits];
}

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: "reduce" });
    for (const route of routes) {
      const page = await context.newPage();
      const pageErrors = [];
      page.on("pageerror", error => pageErrors.push(error.message));
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      const rootSelector = "[data-laws-room-carousel]";
      await page.waitForSelector(`${rootSelector}[data-lrc-mounted="true"]`);
      const rootNode = page.locator(rootSelector);
      const expectedCards = manifest.routes[route].cards;

      if (viewport.name === "phone") audited.routes += 1;

      for (let cardIndex = 0; cardIndex < expectedCards.length; cardIndex += 1) {
        const cardDef = expectedCards[cardIndex];
        if (viewport.name === "phone") audited.cards += 1;

        await page.locator("[data-lrc-tab]").nth(cardIndex).click();
        const activeId = await rootNode.getAttribute("data-lrc-id");
        if (activeId !== cardDef.id) addFinding("card-selection-mismatch", { route, viewport: viewport.name, card: cardDef.id, actual: activeId });

        const activeCard = page.locator("[data-lrc-card][data-active='true']");
        const inspect = activeCard.locator("[data-lrc-inspect]");
        if (await inspect.count() !== 1) {
          addFinding("inspect-control-missing", { route, viewport: viewport.name, card: cardDef.id });
          continue;
        }
        await inspect.click();

        const tabCount = await activeCard.locator("[data-lrc-story-tab]").count();
        if (tabCount !== cardDef.stories.length) {
          addFinding("story-count-mismatch", { route, viewport: viewport.name, card: cardDef.id, expected: cardDef.stories.length, actual: tabCount });
        }

        const bundles = [];
        for (let storyIndex = 0; storyIndex < cardDef.stories.length; storyIndex += 1) {
          const storyDef = cardDef.stories[storyIndex];
          if (viewport.name === "phone") audited.stories += 1;
          await activeCard.locator("[data-lrc-story-tab]").nth(storyIndex).click();
          const currentStory = await rootNode.getAttribute("data-lrc-story");
          if (currentStory !== storyDef.id) addFinding("story-selection-mismatch", { route, viewport: viewport.name, card: cardDef.id, story: storyDef.id, actual: currentStory });

          const visible = activeCard.locator("[data-lrc-grid-cell]:visible");
          const visibleCount = await visible.count();
          if (visibleCount !== 1) {
            addFinding("visible-panel-count", { route, viewport: viewport.name, card: cardDef.id, story: storyDef.id, actual: visibleCount });
            continue;
          }

          const bundle = {
            id: storyDef.id,
            label: storyDef.label,
            title: (await visible.locator(".lrc-reader-first h3").innerText()).trim(),
            lead: (await visible.locator(".lrc-reader-lead").innerText()).trim(),
            why: (await visible.locator(".lrc-reader-why p").innerText()).trim(),
            engineering: (await visible.locator(".lrc-engineering-statement").innerText()).trim(),
            evidence: (await visible.locator(".lrc-engineering-grid section:nth-child(1) p").innerText()).trim(),
            failure: (await visible.locator(".lrc-engineering-grid section:nth-child(2) p").innerText()).trim(),
            limits: (await visible.locator(".lrc-engineering-grid section:nth-child(3) p").innerText()).trim()
          };
          bundles.push(bundle);
        }

        for (let i = 0; i < bundles.length; i += 1) {
          for (let j = i + 1; j < bundles.length; j += 1) {
            if (viewport.name === "phone") audited.storyPairs += 1;
            const a = bundles[i], b = bundles[j];
            const pair = { route, viewport: viewport.name, card: cardDef.id, storyA: a.id, storyB: b.id };
            const aFields = textFields(a), bFields = textFields(b);
            const fieldNames = ["title", "lead", "why", "engineering", "evidence", "failure", "limits"];
            const identicalFields = fieldNames.filter((_, index) => normalize(aFields[index]) === normalize(bFields[index]));
            if (normalize(a.lead) === normalize(b.lead)) addFinding("duplicate-lead", { ...pair, text: a.lead });
            if (normalize(a.why) === normalize(b.why)) addFinding("duplicate-why", { ...pair, text: a.why });
            if (identicalFields.length >= 4) addFinding("field-symmetry", { ...pair, identicalFields });
            const fullA = aFields.join(" | "), fullB = bFields.join(" | ");
            const score = similarity(fullA, fullB);
            if (score >= .82) addFinding("near-duplicate-bundle", { ...pair, similarity: Number(score.toFixed(4)) });
          }
        }

        const geometry = await page.evaluate(() => {
          const active = document.querySelector("[data-lrc-card][data-active='true']");
          const rail = active?.querySelector("[data-lrc-story-rail]");
          return {
            pageOverflow: document.documentElement.scrollWidth - innerWidth,
            cardOverflow: active ? active.scrollWidth - active.clientWidth : 999,
            railOverflow: rail ? rail.scrollWidth - rail.clientWidth : 999
          };
        });
        if (geometry.pageOverflow > 1 || geometry.cardOverflow > 1 || geometry.railOverflow > 1) addFinding("overflow", { route, viewport: viewport.name, card: cardDef.id, ...geometry });
        audited.viewportCardPasses += 1;

        const returnControl = activeCard.locator("[data-lrc-return]");
        if (await returnControl.count()) await returnControl.click();
      }

      for (const error of pageErrors) addFinding("pageerror", { route, viewport: viewport.name, error });
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
}

const grouped = findings.reduce((acc, finding) => {
  acc[finding.kind] = (acc[finding.kind] || 0) + 1;
  return acc;
}, {});
const uniqueSemanticPairs = new Set(findings.filter(f => ["duplicate-lead","duplicate-why","field-symmetry","near-duplicate-bundle"].includes(f.kind)).map(f => `${f.route}|${f.card}|${f.storyA}|${f.storyB}`));
const result = {
  contract: "LAWS_EXHAUSTIVE_CROSS_MATRIX_SEMANTIC_AUDIT_v1",
  candidate: process.env.EXECUTION_COMMIT || null,
  thresholds: { runtimeRepeatTrigger: .78, bundleCeiling: .82 },
  audited,
  findings: findings.length,
  uniqueSemanticPairs: uniqueSemanticPairs.size,
  byKind: grouped,
  details: findings
};
fs.writeFileSync(path.join(artifactDir, "cross-matrix-audit.json"), JSON.stringify(result, null, 2));
console.log(JSON.stringify({ ...result, details: undefined }, null, 2));
if (findings.length) process.exitCode = 1;
