import fs from "node:fs/promises";
import path from "node:path";

const CONTRACT = "LAWS_EXPERIENTIAL_RESTORATION_TABLET_CTA_REGRESSION_v1";
const EXPECTED_BASE_SHA = "ef2ffdb1da7911238652f076a6b44326061493ef";
const ROOT_ROUTE = "/laws/";
const VIEWPORT = Object.freeze({ width: 820, height: 1180 });
const MAX_IMMEDIATE_GAP_PX = 160;
const root = process.cwd();
const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4173";
const evidenceDirectory = path.resolve(
  root,
  process.env.EVIDENCE_DIR || "laws-experiential-restoration-cta-evidence"
);

function assert(condition, message, details = null) {
  if (condition) return;
  const error = new Error(message);
  error.details = details;
  throw error;
}

async function writeJson(name, value) {
  await fs.mkdir(evidenceDirectory, { recursive: true });
  await fs.writeFile(
    path.join(evidenceDirectory, name),
    `${JSON.stringify(value, null, 2)}\n`,
    "utf8"
  );
}

function rectToObject(rect) {
  if (!rect) return null;
  return {
    x: rect.x,
    y: rect.y,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    width: rect.width,
    height: rect.height
  };
}

async function inspectProfile(browser, profile) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    isMobile: Boolean(profile.isMobile),
    hasTouch: Boolean(profile.hasTouch)
  });

  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") pageErrors.push(message.text());
  });

  await page.goto(`${baseUrl}${ROOT_ROUTE}`, { waitUntil: "networkidle" });

  const disclosure = page.locator("details[data-laws-first-disclosure]");
  const summary = disclosure.locator(":scope > summary");
  const body = disclosure.locator(":scope > .laws-first__disclosure-body");

  await disclosure.waitFor({ state: "attached" });
  await summary.waitFor({ state: "visible" });
  await body.waitFor({ state: "attached" });

  const before = await page.evaluate(() => {
    const disclosureNode = document.querySelector("details[data-laws-first-disclosure]");
    const summaryNode = disclosureNode?.querySelector(":scope > summary");
    const bodyNode = disclosureNode?.querySelector(":scope > .laws-first__disclosure-body");
    const summaryRect = summaryNode?.getBoundingClientRect();
    const bodyRect = bodyNode?.getBoundingClientRect();

    return {
      open: Boolean(disclosureNode?.open),
      scrollY,
      viewport: { width: innerWidth, height: innerHeight },
      summary: summaryRect ? {
        top: summaryRect.top,
        bottom: summaryRect.bottom,
        height: summaryRect.height
      } : null,
      body: bodyRect ? {
        top: bodyRect.top,
        bottom: bodyRect.bottom,
        height: bodyRect.height
      } : null
    };
  });

  if (before.open) {
    await summary.click();
    await page.waitForFunction(() => {
      const node = document.querySelector("details[data-laws-first-disclosure]");
      return Boolean(node && !node.open);
    });
  }

  const activationScrollY = await page.evaluate(() => scrollY);

  if (profile.input === "touch") {
    await summary.tap();
  } else {
    await summary.click();
  }

  await page.waitForFunction(() => {
    const node = document.querySelector("details[data-laws-first-disclosure]");
    return Boolean(node?.open);
  });
  await page.waitForTimeout(120);

  const after = await page.evaluate(({ maxGap }) => {
    const disclosureNode = document.querySelector("details[data-laws-first-disclosure]");
    const summaryNode = disclosureNode?.querySelector(":scope > summary");
    const bodyNode = disclosureNode?.querySelector(":scope > .laws-first__disclosure-body");
    const summaryRect = summaryNode?.getBoundingClientRect();
    const bodyRect = bodyNode?.getBoundingClientRect();
    const bodyStyle = bodyNode ? getComputedStyle(bodyNode) : null;
    const bodyIntersectsViewport = Boolean(
      bodyRect &&
      bodyRect.bottom > 0 &&
      bodyRect.top < innerHeight
    );
    const gapAfterActivation = summaryRect && bodyRect
      ? bodyRect.top - summaryRect.bottom
      : null;

    return {
      open: Boolean(disclosureNode?.open),
      scrollY,
      viewport: { width: innerWidth, height: innerHeight },
      summary: summaryRect ? {
        top: summaryRect.top,
        bottom: summaryRect.bottom,
        height: summaryRect.height
      } : null,
      body: bodyRect ? {
        top: bodyRect.top,
        bottom: bodyRect.bottom,
        height: bodyRect.height
      } : null,
      bodyDisplay: bodyStyle?.display || "",
      bodyVisibility: bodyStyle?.visibility || "",
      bodyPosition: bodyStyle?.position || "",
      bodyIntersectsViewport,
      gapAfterActivation,
      maxImmediateGap: maxGap,
      immediateVisibleConsequence: Boolean(
        bodyIntersectsViewport &&
        gapAfterActivation !== null &&
        gapAfterActivation <= maxGap
      )
    };
  }, { maxGap: MAX_IMMEDIATE_GAP_PX });

  await page.screenshot({
    path: path.join(evidenceDirectory, `${profile.name}-activation-viewport.png`),
    fullPage: false
  });
  await page.screenshot({
    path: path.join(evidenceDirectory, `${profile.name}-activation-full-page.png`),
    fullPage: true
  });

  const result = {
    contract: CONTRACT,
    expectedBaseSha: EXPECTED_BASE_SHA,
    route: ROOT_ROUTE,
    profile,
    viewport: VIEWPORT,
    action: "ACTIVATE_EXPLORE_THE_FIVE_QUESTIONS",
    expected: "REVEALED_CONTENT_VISIBLE_AT_OR_IMMEDIATELY_AFTER_ACTIVATION_POINT",
    before,
    after,
    activationScrollY,
    pageErrors,
    reproduced: Boolean(
      after.open &&
      !after.immediateVisibleConsequence
    )
  };

  await writeJson(`${profile.name}.json`, result);
  await context.close();
  return result;
}

async function main() {
  const { chromium } = await import("playwright");
  await fs.mkdir(evidenceDirectory, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  const profiles = [
    {
      name: "tablet-portrait-pointer",
      input: "pointer",
      isMobile: false,
      hasTouch: false
    },
    {
      name: "tablet-portrait-touch",
      input: "touch",
      isMobile: true,
      hasTouch: true
    }
  ];

  const results = {};

  try {
    for (const profile of profiles) {
      results[profile.name] = await inspectProfile(browser, profile);
    }
  } finally {
    await browser.close();
  }

  const summary = {
    contract: CONTRACT,
    expectedBaseSha: EXPECTED_BASE_SHA,
    route: ROOT_ROUTE,
    viewport: VIEWPORT,
    inputs: profiles.map(profile => profile.input),
    expected: "REVEALED_CONTENT_VISIBLE_AT_OR_IMMEDIATELY_AFTER_ACTIVATION_POINT",
    currentResult: "DISCLOSURE_STATE_CHANGES_BUT_VISIBLE_CONTENT_IS_DISPLACED",
    results,
    reproducedForAllInputs: Object.values(results).every(result => result.reproduced),
    repairAcceptance: Object.values(results).every(
      result => result.after.immediateVisibleConsequence && result.pageErrors.length === 0
    )
  };

  await writeJson("summary.json", summary);
  console.log(JSON.stringify(summary, null, 2));

  assert(
    summary.repairAcceptance,
    "Tablet CTA regression reproduced: the disclosure opens, but its content is not visible at or immediately after the activation point.",
    summary
  );
}

main().catch(async error => {
  const failure = {
    contract: CONTRACT,
    result: "FAIL_EXPECTED_BEFORE_REPAIR",
    message: error.message,
    details: error.details || null,
    stack: error.stack || ""
  };

  try {
    await writeJson("failure.json", failure);
  } catch (_) {
    // Preserve the original failure when evidence writing is unavailable.
  }

  console.error(JSON.stringify(failure, null, 2));
  process.exitCode = 1;
});
