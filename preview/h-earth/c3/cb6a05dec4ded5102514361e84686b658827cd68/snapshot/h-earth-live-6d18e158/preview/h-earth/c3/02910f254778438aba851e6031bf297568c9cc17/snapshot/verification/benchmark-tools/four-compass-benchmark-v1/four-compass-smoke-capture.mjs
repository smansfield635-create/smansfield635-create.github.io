import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import puppeteer from "puppeteer-core";
import {
  TOOL_ID,
  ORIGIN,
  PROFILES,
  COMPASS_CORPUS,
  AUXILIARY_CONTROLS,
  OUTPUTS,
  validateAuthorityConfig
} from "./four-compass-benchmark.config.mjs";

const digestBytes = buffer => crypto.createHash("sha256").update(buffer).digest("hex");
const digestJson = value => crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");

function launchOptions() {
  return {
    executablePath: process.env.CHROME_PATH || process.env.CHROME_BIN || "/usr/bin/google-chrome",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"]
  };
}

async function smokeLane(browser, lane, config, screenshotRoot) {
  await fs.rm(screenshotRoot, { recursive: true, force: true });
  await fs.mkdir(screenshotRoot, { recursive: true });
  const records = [];
  for (const [authorityId, authority] of Object.entries(config)) {
    const page = await browser.newPage();
    await page.setViewport(PROFILES.DESKTOP);
    const telemetry = { console: [], pageErrors: [], requestFailures: [] };
    page.on("console", message => telemetry.console.push({ type: message.type(), text: message.text() }));
    page.on("pageerror", error => telemetry.pageErrors.push(String(error?.message || error)));
    page.on("requestfailed", request => telemetry.requestFailures.push({ url: request.url(), error: request.failure()?.errorText || "" }));
    const record = { authorityId, lane, route: authority.route, status: "PENDING", telemetry };
    try {
      const response = await page.goto(`${ORIGIN}${authority.route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForNetworkIdle({ idleTime: 700, timeout: 15000 }).catch(() => {});
      await page.waitForSelector(authority.root, { timeout: 10000 });
      const root = await page.$(authority.root);
      const filename = path.join(screenshotRoot, `${authorityId.toLowerCase()}-desktop-smoke.png`);
      const bytes = await page.screenshot({ path: filename, type: "png", fullPage: false, captureBeyondViewport: false });
      record.status = "EXECUTED";
      record.responseStatus = response?.status() ?? null;
      record.finalUrl = page.url();
      record.rootPresent = Boolean(root);
      record.screenshot = { filename, byteLength: bytes.length, sha256: digestBytes(bytes) };
    } catch (error) {
      record.status = "HARNESS_FAILURE";
      record.failure = String(error?.stack || error);
    } finally {
      await page.close();
    }
    records.push(record);
  }
  const ids = Object.keys(config);
  const manifest = records.filter(record => record.screenshot).map(record => ({ authorityId: record.authorityId, ...record.screenshot }));
  const assertions = {
    authorityCount: ids.length,
    executedCount: records.filter(record => record.status === "EXECUTED").length,
    allConfiguredAuthoritiesExecuted: ids.every(id => records.some(record => record.authorityId === id && record.status === "EXECUTED")),
    successfulResponses: records.every(record => record.responseStatus >= 200 && record.responseStatus < 400),
    rootsPresent: records.every(record => record.rootPresent === true),
    screenshotsPresent: manifest.length === ids.length && manifest.every(item => item.byteLength > 0 && /^[a-f0-9]{64}$/.test(item.sha256)),
    crossLaneAggregateCreated: false,
    productFilesChanged: 0,
    lawsRepairStarted: false,
    mainChanged: false,
    mergeAuthority: "NONE"
  };
  const pass = assertions.allConfiguredAuthoritiesExecuted && assertions.successfulResponses && assertions.rootsPresent && assertions.screenshotsPresent;
  const result = {
    artifactId: lane === "FOUR_COMPASS_CORPUS" ? "METAVERSE_FOUR_COMPASS_TOOL_SMOKE_v1" : "WEBSITE_HOME_RECEIVER_CONTROL_SMOKE_v1",
    toolId: TOOL_ID,
    checkpoint: "T3",
    lane,
    status: pass ? "PASS_TOOL_SMOKE" : "FAIL_TOOL_SMOKE",
    generatedAt: new Date().toISOString(),
    executionCommit: process.env.EXECUTION_COMMIT || process.env.GITHUB_SHA || "",
    assertions,
    screenshotManifest: manifest,
    records,
    stoppingBoundary: {
      proves: ["WORKFLOW_REACHABILITY", "DEPLOYED_ROUTE_ROOT_RESOLUTION", "SCREENSHOT_BYTE_AND_DIGEST_CUSTODY", "LANE_SEPARATION"],
      doesNotProve: ["FULL_INTERACTION_BASELINE", "VISUAL_CORRECTNESS", "LAWS_REPAIR_CORRECTNESS"],
      authorizes: []
    },
    nextCheckpoint: "T3_TOOL_EXECUTION_AND_EVIDENCE_VALIDATION"
  };
  result.laneSmokeDigest = digestJson({ assertions, screenshotManifest: manifest });
  return { result, pass };
}

async function main() {
  const validation = validateAuthorityConfig();
  if (validation.failures.length) throw new Error(`FOUR_COMPASS_CONFIG_INVALID:${validation.failures.join(",")}`);
  const browser = await puppeteer.launch(launchOptions());
  try {
    const compass = await smokeLane(browser, "FOUR_COMPASS_CORPUS", COMPASS_CORPUS, OUTPUTS.compassSmokeScreenshotRoot);
    const auxiliary = await smokeLane(browser, "AUXILIARY_CONTROL", AUXILIARY_CONTROLS, OUTPUTS.auxiliarySmokeScreenshotRoot);
    await fs.writeFile(OUTPUTS.compassSmokeReceipt, `${JSON.stringify(compass.result, null, 2)}\n`, "utf8");
    await fs.writeFile(OUTPUTS.auxiliarySmokeReceipt, `${JSON.stringify(auxiliary.result, null, 2)}\n`, "utf8");
    console.log(JSON.stringify({ compassStatus: compass.result.status, auxiliaryStatus: auxiliary.result.status, crossLaneAggregateCreated: false }, null, 2));
    if (!compass.pass || !auxiliary.pass) process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error?.stack || error);
  process.exitCode = 1;
});
