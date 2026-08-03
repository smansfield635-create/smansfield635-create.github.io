import fs from "node:fs";
import puppeteer from "puppeteer-core";

const ORIGIN = process.env.METHODS_MODELS_ORIGIN || "http://127.0.0.1:4173";
const CHROME_PATH = process.env.CHROME_PATH;
const EXECUTION_COMMIT = process.env.EXECUTION_COMMIT || "UNKNOWN";
const route = `${ORIGIN}/laws/research/methods-and-models/`;

if (!CHROME_PATH) throw new Error("CHROME_PATH_REQUIRED");

const sourceFiles = {
  html: fs.readFileSync("laws/research/methods-and-models/index.html", "utf8"),
  css: fs.readFileSync("laws/research/methods-and-models/showroom.css", "utf8"),
  js: fs.readFileSync("laws/research/methods-and-models/showroom.js", "utf8"),
  manifest: fs.readFileSync("laws/research/methods-and-models/canonical-records-v1.html", "utf8")
};

const sourceAssertions = {
  contract: sourceFiles.html.includes('data-methods-models-contract="METHODS_MODELS_DUAL_AXIS_SHOWROOM_v1"'),
  archiveBound: sourceFiles.html.includes('data-canonical-archive="METHODS_MODELS_CANONICAL_ARCHIVE_v1_DRAFT"'),
  completenessOpen: sourceFiles.html.includes('data-source-completeness="open"'),
  universalClaimFalse: sourceFiles.html.includes('data-universal-law-proven="false"'),
  productAcceptanceFalse: sourceFiles.html.includes('data-product-acceptance="not-granted"'),
  fourFamilies: ["Structural Envelope and Collapse", "Pressure, Capacity, and Stability", "Closure and System Flow", "Method, Resolution, and Falsification"].every(value => sourceFiles.js.includes(value)),
  fullEnvelope: sourceFiles.js.includes("451 = 256 + 192 + 3"),
  saturationGate: sourceFiles.js.includes("448 = 256 + 192"),
  membraneSeparated: sourceFiles.js.includes("61 ∉ 451"),
  anchorsSeparated: sourceFiles.js.includes("9 ∉ 451"),
  collapsePredicate: sourceFiles.js.includes("CollapseQualified<sub>d</sub>"),
  pcrKernel: ["Π = G · X", "K = P · R · A · C", "PCR = Π / max(K, ε<sub>K</sub>)", "S<sup>*</sup> + H<sup>*</sup> = 1"].every(value => sourceFiles.js.includes(value)),
  sourceHoldExplicit: sourceFiles.js.includes("ORIGINAL CONTROLLING SOURCE UNDER RECOVERY"),
  noLegacyDumpInPublicHtml: !sourceFiles.html.includes("CP6-CONTENT-059") && !sourceFiles.html.includes("lr-legacy-source"),
  canonicalManifest: ["CP6-CONTENT-058", "CP6-CONTENT-078", "bb032b86a2665a0d53df310d03c787dc8a193da1599761b960166d17f847fe2b"].every(value => sourceFiles.manifest.includes(value)),
  responsiveRules: sourceFiles.css.includes("@media (max-width: 620px)"),
  reducedMotion: sourceFiles.css.includes("prefers-reduced-motion: reduce")
};

const sourceFailures = Object.entries(sourceAssertions).filter(([, pass]) => !pass).map(([id]) => id);
if (sourceFailures.length) throw new Error(`METHODS_MODELS_SOURCE_CONTRACT_FAILED:${sourceFailures.join("|")}`);

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"]
});

const results = [];

async function verifyProfile(profile, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.goto(route, { waitUntil: "networkidle0", timeout: 45000 });
  await page.waitForSelector('html[data-methods-models-showroom="active"]', { timeout: 15000 });

  const initial = await page.evaluate(() => {
    const showroom = document.querySelector("[data-mm-showroom]");
    const active = document.querySelector('.mm-model-card[data-position="active"]');
    const rect = showroom.getBoundingClientRect();
    return {
      familyTabs: document.querySelectorAll(".mm-family-tab").length,
      activeCards: document.querySelectorAll('.mm-model-card[data-position="active"]').length,
      activeModel: active?.dataset.modelId || "",
      family: document.body.dataset.mmFamily || "",
      showroomTop: rect.top + scrollY,
      showroomWidth: rect.width,
      viewportWidth: innerWidth,
      horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
      legacyRecords: document.querySelectorAll("[data-content-id]").length,
      contract: document.documentElement.dataset.methodsModelsContract || document.documentElement.getAttribute("data-methods-models-contract"),
      completeness: document.documentElement.getAttribute("data-source-completeness"),
      acceptance: document.documentElement.getAttribute("data-product-acceptance")
    };
  });

  const failures = [];
  if (initial.familyTabs !== 4) failures.push("family_tab_count");
  if (initial.activeCards !== 1) failures.push("single_active_model");
  if (initial.activeModel !== "envelope-451") failures.push("initial_model");
  if (initial.family !== "structure") failures.push("initial_family");
  if (initial.showroomTop > viewport.height * 1.2) failures.push("showroom_not_primary");
  if (initial.showroomWidth > initial.viewportWidth + 2) failures.push("showroom_width");
  if (initial.horizontalOverflow > 2) failures.push("horizontal_overflow");
  if (initial.legacyRecords !== 0) failures.push("legacy_dump_visible");
  if (initial.completeness !== "open") failures.push("completeness_state");
  if (initial.acceptance !== "not-granted") failures.push("acceptance_state");

  await page.click('.mm-family-tab[data-family-index="1"]');
  await page.waitForFunction(() => document.body.dataset.mmFamily === "pressure");
  await page.click("[data-mm-next]");
  await page.click("[data-mm-next]");
  await page.waitForFunction(() => document.querySelector('.mm-model-card[data-position="active"]')?.dataset.modelId === "pcr");

  const pressureState = await page.evaluate(() => ({
    model: document.querySelector('.mm-model-card[data-position="active"]')?.dataset.modelId,
    equation: document.querySelector('.mm-model-card[data-position="active"] .mm-equation')?.textContent,
    hash: location.hash
  }));
  if (pressureState.model !== "pcr" || !pressureState.equation?.includes("PCR")) failures.push("pressure_navigation");

  await page.click('[data-mm-lens-tab="evidence"]');
  const evidenceText = await page.$eval("[data-mm-lens-panel]", node => node.textContent.trim());
  if (!evidenceText.includes("source-confirmed")) failures.push("evidence_lens");

  await page.click('.mm-model-card[data-position="active"] [data-mm-inspect]');
  await page.waitForSelector("dialog[open]");
  const dialogState = await page.evaluate(() => ({
    open: document.querySelector("dialog")?.open,
    title: document.querySelector("[data-mm-dialog-title]")?.textContent,
    sections: document.querySelectorAll(".mm-dialog__section").length
  }));
  if (!dialogState.open || dialogState.title !== "Pressure-to-Capacity Ratio" || dialogState.sections !== 7) failures.push("focused_inspection");
  await page.click("[data-mm-dialog-close]");
  await page.waitForFunction(() => !document.querySelector("dialog")?.open);
  const restoredModel = await page.$eval('.mm-model-card[data-position="active"]', node => node.dataset.modelId);
  if (restoredModel !== "pcr") failures.push("return_continuity");

  await page.click('.mm-family-tab[data-family-index="0"]');
  await page.click("[data-mm-next]");
  const holdState = await page.evaluate(() => ({
    model: document.querySelector('.mm-model-card[data-position="active"]')?.dataset.modelId,
    status: document.querySelector('.mm-model-card[data-position="active"] .mm-model-card__status')?.textContent
  }));
  if (holdState.model !== "gate-448" || !holdState.status?.toLowerCase().includes("source hold")) failures.push("source_hold_visibility");

  await page.focus('.mm-family-tab[data-family-index="0"]');
  await page.keyboard.press("ArrowRight");
  const keyboardFamily = await page.evaluate(() => document.body.dataset.mmFamily);
  if (keyboardFamily !== "pressure") failures.push("family_keyboard");

  results.push({ profile, viewport, initial, pressureState, dialogState, holdState, failures });
  await page.close();
}

try {
  await verifyProfile("DESKTOP", { width: 1440, height: 1000, deviceScaleFactor: 1 });
  await verifyProfile("MOBILE", { width: 430, height: 932, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
} finally {
  await browser.close();
}

const failures = results.flatMap(result => result.failures.map(id => `${result.profile}:${id}`));
const receipt = {
  contract: "METHODS_MODELS_DUAL_AXIS_SHOWROOM_EXACT_HEAD_BROWSER_v1",
  execution: { commit: EXECUTION_COMMIT, origin: ORIGIN },
  sourceAssertions,
  profiles: results,
  status: failures.length ? "FAIL" : "PASS_EXACT_HEAD_CANDIDATE",
  failures
};
fs.writeFileSync("methods-models-showroom-exact-head.json", JSON.stringify(receipt, null, 2));
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) throw new Error(`METHODS_MODELS_BROWSER_FAILED:${failures.join("|")}`);
