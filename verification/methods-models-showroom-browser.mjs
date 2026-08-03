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
  refinementCss: fs.readFileSync("laws/research/methods-and-models/showroom-refinement.css", "utf8"),
  refinementJs: fs.readFileSync("laws/research/methods-and-models/showroom-refinement.js", "utf8"),
  manifest: fs.readFileSync("laws/research/methods-and-models/canonical-records-v1.html", "utf8")
};

const sourceAssertions = {
  contract: sourceFiles.html.includes('data-methods-models-contract="METHODS_MODELS_SHOWROOM_DOCK_v2"'),
  archiveBound: sourceFiles.html.includes('data-canonical-archive="METHODS_MODELS_CANONICAL_ARCHIVE_v1_DRAFT"'),
  completenessOpen: sourceFiles.html.includes('data-source-completeness="open"'),
  universalClaimFalse: sourceFiles.html.includes('data-universal-law-proven="false"'),
  productAcceptanceFalse: sourceFiles.html.includes('data-product-acceptance="not-granted"'),
  refinementAssetsLoaded: sourceFiles.html.includes("showroom-refinement.css") && sourceFiles.html.includes("showroom-refinement.js"),
  publicArchiveAdministrationRemoved: !sourceFiles.html.includes("mm-provenance") && !sourceFiles.html.includes("Archive ZIP SHA-256") && !sourceFiles.html.includes("METHODS_MODELS_CANONICAL_ARCHIVE_v1_DRAFT</strong>"),
  publicResearchRoutes: ["Evidence and Sources", "Applied Investigations", "Findings and Boundaries", "Laws Compass"].every(value => sourceFiles.html.includes(value)),
  compactDockDeclared: sourceFiles.html.includes("data-mm-dock") && sourceFiles.html.includes("data-mm-open-showroom") && sourceFiles.html.includes("data-mm-dock-handle"),
  fullscreenContract: sourceFiles.refinementCss.includes('body[data-mm-display="expanded"] .mm-showroom') && sourceFiles.refinementCss.includes("position: fixed"),
  mobileDockContract: sourceFiles.refinementCss.includes("bottom: max(.55rem, env(safe-area-inset-bottom))") && sourceFiles.refinementCss.includes(".mm-dock__handle { display: none; }"),
  semanticMassLedger: sourceFiles.refinementJs.includes('"mass-ledger"') && sourceFiles.refinementJs.includes('layout: "ledger"'),
  semanticCollapsePredicate: sourceFiles.refinementJs.includes('"collapse-qualified"') && sourceFiles.refinementJs.includes('layout: "predicate"'),
  sourceHoldPreserved: sourceFiles.js.includes("ARCHITECTURE PRESERVED · ORIGINAL CONTROLLING SOURCE UNDER RECOVERY"),
  fullEnvelopePreserved: sourceFiles.js.includes("451 = 256 + 192 + 3"),
  canonicalManifestPreserved: ["CP6-CONTENT-058", "CP6-CONTENT-078", "bb032b86a2665a0d53df310d03c787dc8a193da1599761b960166d17f847fe2b"].every(value => sourceFiles.manifest.includes(value)),
  reducedMotion: sourceFiles.refinementCss.includes("prefers-reduced-motion: reduce")
};

const sourceFailures = Object.entries(sourceAssertions).filter(([, pass]) => !pass).map(([id]) => id);
if (sourceFailures.length) throw new Error(`METHODS_MODELS_SOURCE_CONTRACT_FAILED:${sourceFailures.join("|")}`);

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"]
});

const results = [];

async function waitForModel(page, modelId) {
  await page.waitForFunction(id => document.querySelector('.mm-model-card[data-position="active"]')?.dataset.modelId === id, {}, modelId);
}

async function verifyProfile(profile, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.goto(route, { waitUntil: "networkidle0", timeout: 45000 });
  await page.waitForSelector('html[data-methods-models-showroom="active"]', { timeout: 15000 });
  await page.waitForSelector('html[data-methods-models-display-contract="METHODS_MODELS_SHOWROOM_DOCK_v2"]', { timeout: 15000 });

  const initial = await page.evaluate(() => {
    const showroom = document.querySelector("[data-mm-showroom]");
    const topbar = document.querySelector("[data-mm-topbar]");
    const dock = document.querySelector("[data-mm-dock]");
    const support = document.querySelector(".mm-support");
    const rect = showroom.getBoundingClientRect();
    const topbarRect = topbar.getBoundingClientRect();
    const style = getComputedStyle(showroom);
    return {
      display: document.body.dataset.mmDisplay,
      contract: document.documentElement.dataset.methodsModelsDisplayContract,
      familyTabs: document.querySelectorAll(".mm-family-tab").length,
      activeCards: document.querySelectorAll('.mm-model-card[data-position="active"]').length,
      activeModel: document.querySelector('.mm-model-card[data-position="active"]')?.dataset.modelId,
      position: style.position,
      backgroundColor: style.backgroundColor,
      showroomTop: rect.top,
      showroomBottom: rect.bottom,
      topbarBottom: topbarRect.bottom,
      viewportHeight: innerHeight,
      horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
      dockHidden: dock.hidden,
      supportInert: support.inert,
      bodyFixed: getComputedStyle(document.body).position,
      publicProvenance: document.querySelectorAll(".mm-provenance").length,
      publicRoutes: document.querySelectorAll(".mm-public-routes a").length
    };
  });

  const failures = [];
  if (initial.display !== "expanded") failures.push("initial_expanded_state");
  if (initial.contract !== "METHODS_MODELS_SHOWROOM_DOCK_v2") failures.push("display_contract");
  if (initial.familyTabs !== 4) failures.push("family_tab_count");
  if (initial.activeCards !== 1 || initial.activeModel !== "envelope-451") failures.push("single_initial_model");
  if (initial.position !== "fixed") failures.push("showroom_not_fixed");
  if (Math.abs(initial.showroomTop - initial.topbarBottom) > 3) failures.push("showroom_top_alignment");
  if (Math.abs(initial.showroomBottom - initial.viewportHeight) > 3) failures.push("showroom_bottom_alignment");
  if (!initial.backgroundColor || initial.backgroundColor === "rgba(0, 0, 0, 0)") failures.push("opaque_showroom_background");
  if (!initial.dockHidden) failures.push("dock_visible_while_expanded");
  if (!initial.supportInert) failures.push("background_not_inert");
  if (initial.bodyFixed !== "fixed") failures.push("page_not_scroll_locked");
  if (initial.horizontalOverflow > 2) failures.push("horizontal_overflow");
  if (initial.publicProvenance !== 0) failures.push("public_provenance_present");
  if (initial.publicRoutes !== 4) failures.push("public_route_count");

  await page.click('.mm-family-tab[data-family-index="2"]');
  await waitForModel(page, "mass-ledger");
  const ledger = await page.evaluate(() => {
    const equation = document.querySelector('.mm-model-card[data-position="active"] .mm-equation');
    const lhs = equation.querySelector(".mm-eq-lhs")?.getBoundingClientRect();
    const rhs = equation.querySelector(".mm-eq-rhs")?.getBoundingClientRect();
    return {
      layout: equation.dataset.mmEquationLayout,
      scrollWidth: equation.scrollWidth,
      clientWidth: equation.clientWidth,
      termCount: equation.querySelectorAll(".mm-eq-term").length,
      lhsTop: lhs?.top,
      rhsTop: rhs?.top,
      text: equation.textContent.replace(/\s+/g, " ").trim()
    };
  });
  if (ledger.layout !== "ledger") failures.push("mass_ledger_semantic_layout");
  if (ledger.scrollWidth > ledger.clientWidth + 2) failures.push("mass_ledger_overflow");
  if (ledger.termCount < 6) failures.push("mass_ledger_term_grouping");
  if (!ledger.text.includes("M") || !ledger.text.includes("ΔM")) failures.push("mass_ledger_content");

  await page.click("[data-mm-collapse-showroom]");
  await page.waitForFunction(() => document.body.dataset.mmDisplay === "collapsed");
  const collapsed = await page.evaluate(() => {
    const dock = document.querySelector("[data-mm-dock]");
    const showroom = document.querySelector("[data-mm-showroom]");
    const support = document.querySelector(".mm-support");
    const dockStyle = getComputedStyle(dock);
    const handleStyle = getComputedStyle(document.querySelector("[data-mm-dock-handle]"));
    const rect = dock.getBoundingClientRect();
    return {
      dockHidden: dock.hidden,
      dockDisplay: dockStyle.display,
      dockRect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height },
      dockModel: dock.dataset.mmModel,
      dockTitle: document.querySelector("[data-mm-dock-title]")?.textContent,
      handleDisplay: handleStyle.display,
      showroomHidden: showroom.getAttribute("aria-hidden"),
      supportInert: support.inert,
      bodyPosition: getComputedStyle(document.body).position,
      publicRouteCount: document.querySelectorAll(".mm-public-routes a").length
    };
  });
  if (collapsed.dockHidden || collapsed.dockDisplay === "none") failures.push("dock_not_visible");
  if (collapsed.dockModel !== "mass-ledger") failures.push("dock_model_continuity");
  if (collapsed.dockTitle !== "Industrial Closure Equation") failures.push("dock_title");
  if (collapsed.showroomHidden !== "true") failures.push("showroom_not_hidden");
  if (collapsed.supportInert) failures.push("support_remains_inert");
  if (collapsed.bodyPosition === "fixed") failures.push("page_still_locked");
  if (collapsed.publicRouteCount !== 4) failures.push("collapsed_public_routes");
  if (collapsed.dockRect.left < -1 || collapsed.dockRect.right > viewport.width + 1 || collapsed.dockRect.bottom > viewport.height + 1) failures.push("dock_outside_viewport");

  await page.click("[data-mm-dock-next]");
  await waitForModel(page, "residual-u");
  await page.waitForFunction(() => document.querySelector("[data-mm-dock]")?.dataset.mmModel === "residual-u");
  const dockAfterMove = await page.$eval("[data-mm-dock-title]", node => node.textContent);
  if (dockAfterMove !== "Unaccounted Residual") failures.push("dock_navigation");

  if (profile === "DESKTOP") {
    const beforeDrag = await page.$eval("[data-mm-dock]", node => {
      const rect = node.getBoundingClientRect();
      return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    });
    const handle = await page.$("[data-mm-dock-handle]");
    const box = await handle.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(Math.max(24, box.x - 120), Math.max(90, box.y - 90), { steps: 8 });
    await page.mouse.up();
    const afterDrag = await page.$eval("[data-mm-dock]", node => {
      const rect = node.getBoundingClientRect();
      return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
    });
    if (Math.abs(afterDrag.left - beforeDrag.left) < 20 && Math.abs(afterDrag.top - beforeDrag.top) < 20) failures.push("dock_drag");
    if (afterDrag.left < 7 || afterDrag.top < 7 || afterDrag.right > window.innerWidth + 1 || afterDrag.bottom > window.innerHeight + 1) failures.push("dock_drag_bounds");
  } else if (collapsed.handleDisplay !== "none") {
    failures.push("mobile_drag_handle_visible");
  }

  await page.click("[data-mm-open-showroom]");
  await page.waitForFunction(() => document.body.dataset.mmDisplay === "expanded");
  await waitForModel(page, "residual-u");
  const reopened = await page.evaluate(() => ({
    dockHidden: document.querySelector("[data-mm-dock]").hidden,
    model: document.querySelector('.mm-model-card[data-position="active"]')?.dataset.modelId,
    layout: document.querySelector('.mm-model-card[data-position="active"] .mm-equation')?.dataset.mmEquationLayout,
    backgroundInert: document.querySelector(".mm-support")?.inert
  }));
  if (!reopened.dockHidden || reopened.model !== "residual-u" || reopened.layout !== "residual" || !reopened.backgroundInert) failures.push("reopen_continuity");

  await page.click('.mm-model-card[data-position="active"] [data-mm-inspect]');
  await page.waitForSelector("dialog[open]");
  const dialog = await page.evaluate(() => ({
    title: document.querySelector("[data-mm-dialog-title]")?.textContent,
    layout: document.querySelector("[data-mm-dialog-equation] .mm-equation")?.dataset.mmEquationLayout,
    sections: document.querySelectorAll(".mm-dialog__section").length
  }));
  if (dialog.title !== "Unaccounted Residual" || dialog.layout !== "residual" || dialog.sections !== 7) failures.push("dialog_refinement");
  await page.click("[data-mm-dialog-close]");
  await page.waitForFunction(() => !document.querySelector("dialog")?.open);

  results.push({ profile, viewport, initial, ledger, collapsed, dockAfterMove, reopened, dialog, failures });
  await page.close();
}

try {
  await verifyProfile("DESKTOP", { width: 1440, height: 1000, deviceScaleFactor: 1 });
  await verifyProfile("TABLET_PORTRAIT", { width: 800, height: 1280, deviceScaleFactor: 1.5, isMobile: true, hasTouch: true });
  await verifyProfile("MOBILE", { width: 430, height: 932, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
} finally {
  await browser.close();
}

const failures = results.flatMap(result => result.failures.map(id => `${result.profile}:${id}`));
const receipt = {
  contract: "METHODS_MODELS_SHOWROOM_DOCK_EXACT_HEAD_BROWSER_v2",
  execution: { commit: EXECUTION_COMMIT, origin: ORIGIN },
  sourceAssertions,
  profiles: results,
  status: failures.length ? "FAIL" : "PASS_EXACT_HEAD_CANDIDATE",
  failures
};
fs.writeFileSync("methods-models-showroom-exact-head.json", JSON.stringify(receipt, null, 2));
console.log(JSON.stringify(receipt, null, 2));
if (failures.length) throw new Error(`METHODS_MODELS_BROWSER_FAILED:${failures.join("|")}`);
