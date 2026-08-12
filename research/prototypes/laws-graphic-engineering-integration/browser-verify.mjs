import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4173";
const evidenceDir = path.resolve(process.env.EVIDENCE_DIR || "browser-evidence-laws-integration");
fs.mkdirSync(evidenceDir, { recursive: true });

const viewports = [
  { id: "phone", width: 390, height: 844 },
  { id: "tablet", width: 820, height: 1180 },
  { id: "desktop", width: 1440, height: 1000 }
];

const browser = await chromium.launch({ headless: true });
const report = {
  program: "LAWS_CHAMBER_GRAPHIC_ENGINEERING_INTEGRATION",
  slice: "SLICE_01_RESEARCH_COMES_FIRST_RELATIONSHIP",
  result: "PASS",
  generatedAt: new Date().toISOString(),
  viewports: [],
  lab: null,
  failures: []
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    const consoleErrors = [];
    const pageErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto(`${baseUrl}/research/prototypes/laws-compass-page-delivery/`, { waitUntil: "networkidle", timeout: 60000 });
    await page.locator('html[data-program-ready="true"]').waitFor({ timeout: 30000 });
    await page.locator('iframe[data-accepted-compass-ready="true"]').waitFor({ timeout: 30000 });

    const compassFrame = page.frames().find((candidate) => {
      try { return new URL(candidate.url()).pathname === "/laws/"; } catch { return false; }
    });
    assert(compassFrame, `${viewport.id}: accepted Compass frame not found.`);
    await compassFrame.locator(".laws-compass-primary").waitFor({ state: "visible", timeout: 20000 });

    const compassState = await compassFrame.evaluate(() => ({
      topbarDisplay: getComputedStyle(document.querySelector(".laws-topbar")).display,
      compassVisible: Boolean(document.querySelector(".laws-compass-primary")?.getBoundingClientRect().height),
      protectedScripts: [
        "/laws/index.compositor.js",
        "/laws/index.controller.js",
        "/laws/index.crystals.js",
        "/laws/index.interactions.js",
        "/laws/index.planet.js"
      ].every((needle) => [...document.scripts].some((script) => script.src.includes(needle)))
    }));
    assert(compassState.topbarDisplay === "none", `${viewport.id}: duplicate top route area was not cropped in prototype frame.`);
    assert(compassState.compassVisible, `${viewport.id}: Compass surface is not visible.`);
    assert(compassState.protectedScripts, `${viewport.id}: accepted Compass protected scripts were not present.`);

    const labelCount = await page.locator("[data-relationship-id]").count();
    assert(labelCount === 6, `${viewport.id}: expected 6 semantic relationship controls, received ${labelCount}.`);
    assert(await page.locator("[data-lens-control]").count() === 3, `${viewport.id}: lens controls incomplete.`);
    assert(await page.locator("[data-motion-control]").count() === 3, `${viewport.id}: motion controls incomplete.`);

    await page.locator('[data-lens-control="engineering"]').click();
    await page.locator('[data-compass-prototype-root][data-lens="engineering"]').waitFor();
    await page.locator('[data-lens-control="empirical"]').click();
    await page.locator('[data-compass-prototype-root][data-lens="empirical"]').waitFor();
    assert((await page.locator("[data-lens-title]").textContent()).includes("Evidence status"), `${viewport.id}: empirical lens did not resolve.`);

    await page.locator('[data-motion-control="static"]').click();
    await page.locator('[data-compass-prototype-root][data-motion="static"]').waitFor();
    assert(await page.locator("[data-first-research-static] svg").isVisible(), `${viewport.id}: static equivalent is not visible.`);
    assert(!(await page.locator("[data-first-research-canvas]").isVisible()), `${viewport.id}: canvas remained visible in static mode.`);

    await page.locator('[data-motion-control="reduced"]').click();
    await page.locator('[data-compass-prototype-root][data-motion="reduced"]').waitFor();
    await page.locator('[data-motion-control="full"]').click();
    await page.locator('[data-compass-prototype-root][data-motion="full"]').waitFor();

    const metrics = await page.evaluate(() => {
      const root = document.documentElement;
      const frame = document.querySelector("[data-compass-frame]").getBoundingClientRect();
      const scene = document.querySelector("[data-first-research-root]").getBoundingClientRect();
      return {
        horizontalOverflow: Math.max(0, root.scrollWidth - root.clientWidth),
        frame: { top: frame.top, bottom: frame.bottom, width: frame.width, height: frame.height },
        scene: { top: scene.top, bottom: scene.bottom, width: scene.width, height: scene.height },
        receipt: globalThis.__DGB_LAWS_COMPASS_SLICE_RECEIPT__
      };
    });
    assert(metrics.horizontalOverflow === 0, `${viewport.id}: horizontal overflow ${metrics.horizontalOverflow}px.`);
    assert(metrics.receipt?.protectedCompassRuntimeMutation === false, `${viewport.id}: protected runtime boundary missing.`);
    assert(metrics.receipt?.routeMutation === false, `${viewport.id}: route boundary missing.`);
    assert(metrics.receipt?.claimUpgrade === false, `${viewport.id}: claim boundary missing.`);
    assert(consoleErrors.length === 0, `${viewport.id}: console errors: ${consoleErrors.join(" | ")}`);
    assert(pageErrors.length === 0, `${viewport.id}: page errors: ${pageErrors.join(" | ")}`);

    await page.screenshot({ path: path.join(evidenceDir, `compass-slice-${viewport.id}.png`), fullPage: true });
    report.viewports.push({ ...viewport, labelCount, consoleErrors, pageErrors, compassState, metrics });
    await page.close();
  }

  const labPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const labErrors = [];
  labPage.on("pageerror", (error) => labErrors.push(error.message));
  await labPage.goto(`${baseUrl}/research/prototypes/laws-geometric-grammar-lab/slice-01-first-research.html`, { waitUntil: "networkidle", timeout: 60000 });
  await labPage.locator('html[data-program-ready="true"]').waitFor({ timeout: 30000 });
  const receiptText = await labPage.locator("[data-receipt]").textContent();
  assert(receiptText.includes("DGB_LAWS_FIRST_RESEARCH_WEBGL2_SHARED_v1") || receiptText.includes("STATIC_EQUIVALENT_ONLY"), "Laboratory did not consume shared renderer contract.");
  assert(await labPage.locator("[data-relationship-id]").count() === 6, "Laboratory semantic controls incomplete.");
  assert(labErrors.length === 0, `Laboratory page errors: ${labErrors.join(" | ")}`);
  await labPage.screenshot({ path: path.join(evidenceDir, "laboratory-slice-desktop.png"), fullPage: true });
  report.lab = { result: "PASS", sharedRendererReceiptPresent: true, pageErrors: labErrors };
  await labPage.close();
} catch (error) {
  report.result = "FAIL";
  report.failures.push(error.stack || error.message);
  process.exitCode = 1;
} finally {
  await browser.close();
  fs.writeFileSync(path.join(evidenceDir, "browser-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}
