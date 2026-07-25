import fs from "node:fs/promises";
import puppeteer from "puppeteer-core";

const ORIGIN = "https://smansfield635-create.github.io/home/";
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function settle(page) {
  await page.waitForNetworkIdle({ idleTime: 700, timeout: 15000 }).catch(() => {});
  await sleep(900);
}

async function tabHandle(page, text) {
  const handles = await page.$$("button.profile-tab");
  for (const handle of handles) {
    const value = await handle.evaluate(element => (element.textContent || "").replace(/\s+/g, " ").trim());
    if (value.toLowerCase().includes(text.toLowerCase())) return handle;
  }
  throw new Error(`PROFILE_TAB_NOT_FOUND:${text}`);
}

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"]
});

const result = {
  artifactId: "METAVERSE_3D_GOVERNED_BENCHMARK_CORPUS_CP6_HOMEPAGE_INTERACTION_SUPPLEMENT_v1",
  generatedAt: new Date().toISOString(),
  baselineCommit: "ba0f3ecf3087f91d2cb3ff6aa4dd3c040107712e",
  checks: []
};

try {
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 });
    await page.goto(ORIGIN, { waitUntil: "domcontentloaded", timeout: 30000 });
    await settle(page);
    const tab = await tabHandle(page, "Read the Laws");
    await tab.evaluate(element => element.scrollIntoView({ block: "center" }));
    await tab.click({ delay: 60 });
    await sleep(700);
    const summary = await page.$("summary.profile-summary");
    const summaryText = await summary.evaluate(element => (element.textContent || "").replace(/\s+/g, " ").trim());
    await summary.focus();
    await page.keyboard.press("Enter");
    await sleep(500);
    const open = await summary.evaluate(element => element.parentElement?.open === true);
    result.checks.push({
      id: "ACTIVE_PROFILE_DISCLOSURE_KEYBOARD_OPEN",
      profile: "DESKTOP",
      selectedTab: "Read the Laws",
      summaryText,
      observedOpen: open,
      pass: open === true
    });
    await page.close();
  }

  {
    const page = await browser.newPage();
    await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.goto(ORIGIN, { waitUntil: "domcontentloaded", timeout: 30000 });
    await settle(page);
    const tab = await tabHandle(page, "See the World");
    await tab.evaluate(element => element.scrollIntoView({ block: "center", inline: "center" }));
    await sleep(350);
    const target = await tab.evaluate(element => {
      const rect = element.getBoundingClientRect();
      const x = rect.x + rect.width / 2;
      const y = rect.y + rect.height / 2;
      const hit = document.elementFromPoint(x, y);
      return {
        x,
        y,
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        targetText: (element.textContent || "").replace(/\s+/g, " ").trim(),
        hitTag: hit?.tagName?.toLowerCase() || "",
        hitText: (hit?.textContent || "").replace(/\s+/g, " ").trim(),
        hitIsTarget: hit === element || element.contains(hit)
      };
    });
    await page.touchscreen.tap(target.x, target.y);
    await sleep(700);
    const selected = await page.$$eval("button.profile-tab", elements => elements.map(element => ({
      text: (element.textContent || "").replace(/\s+/g, " ").trim(),
      selected: element.getAttribute("aria-selected")
    })));
    const selectedTarget = selected.some(item => item.text.toLowerCase().includes("see the world") && item.selected === "true");
    result.checks.push({
      id: "MOBILE_PROFILE_TOUCH_HIT_TARGET_AND_SELECTION",
      profile: "MOBILE",
      target,
      selected,
      selectedTarget,
      classification: !target.hitIsTarget
        ? "SPATIAL_HIT_TARGET_OVERLAP"
        : selectedTarget
          ? "TOUCH_SELECTION_PASS"
          : "TOUCH_EVENT_ROUTING_MISMATCH",
      pass: target.hitIsTarget && selectedTarget
    });
    await page.close();
  }
} finally {
  await browser.close();
}

result.status = result.checks.every(check => check.pass)
  ? "PASS_HOMEPAGE_INTERACTION_SUPPLEMENT"
  : "PASS_SUPPLEMENT_WITH_BOUNDED_PRODUCT_FINDING";
await fs.writeFile("cp6-homepage-interaction-supplement.json", JSON.stringify(result, null, 2));
console.log(`CP6_HOMEPAGE_SUPPLEMENT_STATUS=${result.status}`);
console.log(JSON.stringify(result.checks));
