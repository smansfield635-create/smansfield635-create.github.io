import fs from "node:fs/promises";
import crypto from "node:crypto";
import path from "node:path";
import puppeteer from "puppeteer-core";

const ORIGIN = "https://smansfield635-create.github.io";
const ROUTE = "/";
const OUTPUT_DIR = "cp7-2-smoke-output";
const SCREENSHOT_FILE = path.join(OUTPUT_DIR, "main-compass-desktop-smoke.png");
const RECEIPT_FILE = path.join(OUTPUT_DIR, "cp7-2-smoke-receipt.json");
const VIEWPORT = Object.freeze({
  width: 1440,
  height: 1100,
  deviceScaleFactor: 1,
  isMobile: false,
  hasTouch: false
});

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

async function main() {
  await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const telemetry = {
    console: [],
    pageErrors: [],
    requestFailures: []
  };

  const executablePath =
    process.env.CHROME_PATH ||
    process.env.CHROME_BIN ||
    "/usr/bin/google-chrome";

  const browser = await puppeteer.launch({
    executablePath,
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu"
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);

    page.on("console", message => {
      telemetry.console.push({
        type: message.type(),
        text: message.text()
      });
    });

    page.on("pageerror", error => {
      telemetry.pageErrors.push(String(error?.message || error));
    });

    page.on("requestfailed", request => {
      telemetry.requestFailures.push({
        url: request.url(),
        error: request.failure()?.errorText || ""
      });
    });

    const response = await page.goto(`${ORIGIN}${ROUTE}`, {
      waitUntil: "domcontentloaded",
      timeout: 30000
    });

    await page.waitForNetworkIdle({
      idleTime: 700,
      timeout: 15000
    }).catch(() => {});

    await page.waitForSelector("main[data-compass-root]", {
      timeout: 10000
    });

    const targetSelector = "[data-compass-scene]";
    const targetExists = Boolean(await page.$(targetSelector));

    if (targetExists) {
      await page.$eval(targetSelector, element => {
        element.scrollIntoView({
          block: "center",
          inline: "center"
        });
      });
      await new Promise(resolve => setTimeout(resolve, 1200));
    }

    const rootState = await page.$eval("main[data-compass-root]", element => ({
      tagName: element.tagName,
      id: element.id,
      classes: Array.from(element.classList),
      data: Object.fromEntries(
        Array.from(element.attributes)
          .filter(attribute => attribute.name.startsWith("data-"))
          .map(attribute => [attribute.name, attribute.value])
      )
    }));

    const targetRect = targetExists
      ? await page.$eval(targetSelector, element => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            display: style.display,
            visibility: style.visibility,
            opacity: style.opacity
          };
        })
      : null;

    await page.screenshot({
      path: SCREENSHOT_FILE,
      type: "png",
      fullPage: false,
      captureBeyondViewport: false
    });

    const screenshotBytes = await fs.readFile(SCREENSHOT_FILE);
    const receipt = {
      artifactId: "METAVERSE_BENCHMARK_CP7_2_WORKFLOW_BIRTH_SMOKE_CAPTURE_v1",
      checkpoint: "CP7-2",
      status: "PASS_WORKFLOW_BIRTH_AND_TRIGGER_SMOKE_CAPTURE",
      repository: process.env.GITHUB_REPOSITORY || "smansfield635-create/smansfield635-create.github.io",
      executionCommit: process.env.GITHUB_SHA || "",
      workflowRunId: process.env.GITHUB_RUN_ID || "",
      workflowRunAttempt: process.env.GITHUB_RUN_ATTEMPT || "",
      generatedAt: new Date().toISOString(),
      origin: ORIGIN,
      route: ROUTE,
      responseStatus: response?.status() ?? null,
      finalUrl: page.url(),
      title: await page.title(),
      viewport: VIEWPORT,
      browserVersion: await browser.version(),
      executablePath,
      targetSelector,
      targetExists,
      targetRect,
      rootState,
      screenshot: {
        path: SCREENSHOT_FILE,
        byteLength: screenshotBytes.byteLength,
        sha256: sha256(screenshotBytes)
      },
      telemetry,
      assertions: {
        responseIsSuccessful: Boolean(response && response.status() >= 200 && response.status() < 400),
        compassRootPresent: Boolean(rootState),
        screenshotCreated: screenshotBytes.byteLength > 0,
        smokeTargetResolved: targetExists,
        pageErrorsAbsent: telemetry.pageErrors.length === 0
      },
      stoppingBoundary: {
        proves: [
          "HARNESS_FILE_EXISTS",
          "WORKFLOW_EXECUTION_REACHABLE",
          "DEPLOYED_BROWSER_NAVIGATION",
          "SINGLE_SCREENSHOT_CAPTURE",
          "SCREENSHOT_BYTE_AND_DIGEST_CUSTODY"
        ],
        doesNotProve: [
          "FULL_CAPTURE_MATRIX_COMPLETENESS",
          "VISUAL_CORRECTNESS",
          "SPATIAL_REALIZATION_CORRECTNESS",
          "LAWS_REPAIR_CORRECTNESS"
        ],
        authorizes: []
      },
      nextCheckpoint: "CP7-3_MAIN_COMPASS_VISUAL_CAPTURE"
    };

    await fs.writeFile(RECEIPT_FILE, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");

    const failures = Object.entries(receipt.assertions)
      .filter(([, pass]) => !pass)
      .map(([id]) => id);

    if (failures.length > 0) {
      throw new Error(`CP7_2_SMOKE_ASSERTIONS_FAILED:${failures.join(",")}`);
    }

    process.stdout.write(`${JSON.stringify({
      status: receipt.status,
      screenshot: receipt.screenshot,
      responseStatus: receipt.responseStatus,
      finalUrl: receipt.finalUrl
    })}\n`);
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error?.stack || error);
  process.exitCode = 1;
});
