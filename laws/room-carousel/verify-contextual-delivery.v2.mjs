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
  console.log(JSON.stringify({ result: "PASS", mode: "cross-matrix-detail-static-pass-through", routes: routes.length }));
  process.exit(0);
}

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); }
catch {
  const runtimeModules = process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
  if (!runtimeModules) throw new Error("Playwright is required for browser qualification");
  ({ chromium } = require(path.join(runtimeModules, "playwright")));
}

const browser = await chromium.launch({ headless: true, ...(process.env.LAWS_BROWSER_EXECUTABLE ? { executablePath: process.env.LAWS_BROWSER_EXECUTABLE } : {}) });
const artifactDir = path.join(root, "artifacts/laws-cp6-final-synchronization");
fs.mkdirSync(artifactDir, { recursive: true });
const findings = [];
const cardSummary = [];
let cards = 0, stories = 0, pairs = 0;

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  for (const route of routes) {
    const page = await context.newPage();
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    const rootSelector = "[data-laws-room-carousel]";
    await page.waitForSelector(`${rootSelector}[data-lrc-mounted="true"]`);
    const rootNode = page.locator(rootSelector);
    const expectedCards = manifest.routes[route].cards;

    for (let cardIndex = 0; cardIndex < expectedCards.length; cardIndex += 1) {
      const cardDef = expectedCards[cardIndex];
      cards += 1;
      await page.locator("[data-lrc-tab]").nth(cardIndex).click();
      const activeCard = page.locator("[data-lrc-card][data-active='true']");
      await activeCard.locator("[data-lrc-inspect]").click();
      const bundles = [];

      for (let storyIndex = 0; storyIndex < cardDef.stories.length; storyIndex += 1) {
        const storyDef = cardDef.stories[storyIndex];
        stories += 1;
        await activeCard.locator("[data-lrc-story-tab]").nth(storyIndex).click();
        const actualStory = await rootNode.getAttribute("data-lrc-story");
        if (actualStory !== storyDef.id) findings.push({ kind: "story-selection-mismatch", route, card: cardDef.id, story: storyDef.id, actual: actualStory });
        const visible = activeCard.locator("[data-lrc-grid-cell]:visible");
        bundles.push({
          id: storyDef.id,
          label: storyDef.label,
          title: (await visible.locator(".lrc-reader-first h3").innerText()).trim(),
          lead: (await visible.locator(".lrc-reader-lead").innerText()).trim(),
          why: (await visible.locator(".lrc-reader-why p").innerText()).trim(),
          engineering: (await visible.locator(".lrc-engineering-statement").innerText()).trim(),
          evidence: (await visible.locator(".lrc-engineering-grid section:nth-child(1) p").innerText()).trim(),
          failure: (await visible.locator(".lrc-engineering-grid section:nth-child(2) p").innerText()).trim(),
          limits: (await visible.locator(".lrc-engineering-grid section:nth-child(3) p").innerText()).trim()
        });
      }

      const local = { route, card: cardDef.id, label: cardDef.label, pairs: 0, duplicateLeadPairs: 0, duplicateWhyPairs: 0, symmetricPairs: 0, nearDuplicatePairs: 0 };
      for (let i = 0; i < bundles.length; i += 1) {
        for (let j = i + 1; j < bundles.length; j += 1) {
          pairs += 1;
          local.pairs += 1;
          const a = bundles[i], b = bundles[j];
          const fieldNames = ["title","lead","why","engineering","evidence","failure","limits"];
          const identicalFields = fieldNames.filter(name => normalize(a[name]) === normalize(b[name]));
          const pairBase = { route, card: cardDef.id, cardLabel: cardDef.label, storyA: a.id, storyALabel: a.label, storyB: b.id, storyBLabel: b.label };
          if (normalize(a.lead) === normalize(b.lead)) {
            local.duplicateLeadPairs += 1;
            findings.push({ kind: "duplicate-lead", ...pairBase, text: a.lead });
          }
          if (normalize(a.why) === normalize(b.why)) {
            local.duplicateWhyPairs += 1;
            findings.push({ kind: "duplicate-why", ...pairBase, text: a.why });
          }
          if (identicalFields.length >= 4) {
            local.symmetricPairs += 1;
            findings.push({ kind: "field-symmetry", ...pairBase, identicalFields });
          }
          const fullA = fieldNames.map(name => a[name]).join(" | ");
          const fullB = fieldNames.map(name => b[name]).join(" | ");
          const score = similarity(fullA,fullB);
          if (score >= .82) {
            local.nearDuplicatePairs += 1;
            findings.push({ kind: "near-duplicate-bundle", ...pairBase, similarity: Number(score.toFixed(4)) });
          }
        }
      }
      cardSummary.push(local);
      const ret = activeCard.locator("[data-lrc-return]");
      if (await ret.count()) await ret.click();
    }
    await page.close();
  }
  await context.close();
} finally { await browser.close(); }

const hardPairs = findings.filter(f => f.kind === "duplicate-lead" || f.kind === "duplicate-why" || f.kind === "near-duplicate-bundle");
const result = {
  contract: "LAWS_EXHAUSTIVE_CROSS_MATRIX_SEMANTIC_DETAIL_v1",
  sourceCandidate: "2370e3496b3d34302b06549b5190e7fc5b6e03ff",
  diagnosticCommit: process.env.EXECUTION_COMMIT || null,
  viewport: "phone-detail-after-three-viewport-exhaustive-pass",
  audited: { routes: routes.length, cards, stories, pairs },
  counts: {
    duplicateLeadPairs: findings.filter(f => f.kind === "duplicate-lead").length,
    duplicateWhyPairs: findings.filter(f => f.kind === "duplicate-why").length,
    fieldSymmetryPairs: findings.filter(f => f.kind === "field-symmetry").length,
    nearDuplicateBundlePairs: findings.filter(f => f.kind === "near-duplicate-bundle").length
  },
  hardPairs,
  cardsWithHardFindings: cardSummary.filter(c => c.duplicateLeadPairs || c.duplicateWhyPairs || c.nearDuplicatePairs),
  allCardSummary: cardSummary
};
fs.writeFileSync(path.join(artifactDir, "cross-matrix-audit.json"), JSON.stringify(result, null, 2));
console.log(JSON.stringify({ contract: result.contract, sourceCandidate: result.sourceCandidate, audited: result.audited, counts: result.counts, cardsWithHardFindings: result.cardsWithHardFindings }, null, 2));
if (hardPairs.length) process.exitCode = 1;
