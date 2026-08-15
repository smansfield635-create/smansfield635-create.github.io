import fs from "node:fs";
import puppeteer from "puppeteer-core";

const ORIGIN = process.env.METHODS_MODELS_ORIGIN || "http://127.0.0.1:4173";
const CHROME_PATH = process.env.CHROME_PATH;
const EXECUTION_COMMIT = process.env.EXECUTION_COMMIT || "UNKNOWN";
const receiptPath = "methods-models-showroom-exact-head.json";
if (!CHROME_PATH) throw new Error("CHROME_PATH_REQUIRED");

const source = {
  html: fs.readFileSync("laws/research/methods-and-models/index.html", "utf8"),
  css: fs.readFileSync("laws/research/methods-and-models/carousel.css", "utf8"),
  js: fs.readFileSync("laws/research/methods-and-models/carousel.js", "utf8"),
  data: fs.readFileSync("laws/research/methods-and-models/carousel-data.js", "utf8")
};
const sourceAssertions = {
  contract: source.html.includes('data-methods-models-contract="METHODS_MODELS_SINGLE_AXIS_EUCLIDEAN_CAROUSEL_v1"'),
  oneAxisGeometry: source.js.includes("rotateY(") && source.js.includes("translateZ("),
  directManipulation: ["pointerdown", "pointermove", "pointerup", "pointercancel"].every(t => source.js.includes(t)),
  reducedMotion: source.css.includes("prefers-reduced-motion: reduce")
};

const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });
await page.goto(`${ORIGIN}/laws/research/methods-and-models/`, { waitUntil: "networkidle0", timeout: 45000 });
await page.waitForSelector('[data-mm-carousel] .mm-card[data-active="true"]');
await page.click('[data-mm-family-tabs] [data-family-index="1"]');
await page.waitForFunction(() => document.querySelector("[data-mm-carousel]")?.dataset.family === "pressure");

const activeSelector = '.mm-card[data-active="true"]';
await page.click(`${activeSelector} [data-open-inspection]`);
await page.waitForFunction(() => document.querySelector("[data-mm-carousel]")?.dataset.inspecting === "true");

const beforeReturn = await page.evaluate(() => {
  const root = document.querySelector("[data-mm-carousel]");
  const card = document.querySelector('.mm-card[data-active="true"]');
  const control = card?.querySelector("[data-close-inspection]");
  const r = control?.getBoundingClientRect();
  const x = r ? r.left + r.width / 2 : null;
  const y = r ? r.top + r.height / 2 : null;
  const hit = x != null && y != null ? document.elementFromPoint(x, y) : null;
  return {
    inspecting: root?.dataset.inspecting,
    cardInspecting: card?.dataset.inspecting,
    family: card?.dataset.familyId,
    rect: r ? { left:r.left, top:r.top, right:r.right, bottom:r.bottom, width:r.width, height:r.height } : null,
    center: { x, y },
    viewport: { width: innerWidth, height: innerHeight },
    hitTag: hit?.tagName || null,
    hitClass: String(hit?.className || ""),
    hitText: String(hit?.textContent || "").trim().slice(0,80)
  };
});

await page.click(`${activeSelector} [data-close-inspection]`);
await new Promise(resolve => setTimeout(resolve, 300));
const afterReturn = await page.evaluate(() => {
  const root = document.querySelector("[data-mm-carousel]");
  const card = document.querySelector('.mm-card[data-active="true"]');
  return {
    inspecting: root?.dataset.inspecting,
    cardInspecting: card?.dataset.inspecting,
    family: card?.dataset.familyId,
    activeElement: document.activeElement?.outerHTML?.slice(0,180) || null
  };
});

const receipt = {
  schema: "METHODS_MODELS_RETURN_TO_ORBIT_DIAGNOSTIC_v1",
  executionCommit: EXECUTION_COMMIT,
  sourceAssertions,
  beforeReturn,
  afterReturn,
  result: afterReturn.inspecting === "false" && afterReturn.cardInspecting === "false" ? "PASS_CLOSED" : "FAIL_CLOSED"
};
fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + "\n");
await browser.close();
if (receipt.result !== "PASS_CLOSED") throw new Error(`RETURN_TO_ORBIT_NOT_CLOSED:${JSON.stringify(afterReturn)}`);
console.log(JSON.stringify(receipt));
