import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import puppeteer from "puppeteer-core";

const TOOL = "LAWS_COMPASS_SIX_AUTHORITY_BENCHMARK_v1";
const ORIGIN = process.env.LAWS_SIX_ORIGIN || "http://127.0.0.1:4173";
const CHROME_PATH = process.env.CHROME_PATH || process.env.CHROME_BIN || "/usr/bin/google-chrome";
const EXECUTION_COMMIT = process.env.EXECUTION_COMMIT || process.env.GITHUB_SHA || "";
const BASELINE_COMMIT = process.env.BASELINE_COMMIT || "3a6eafcb8c10c61849a452a0c068d34a12117cf5";
const OUT = "laws-six-authority-benchmark-v1.json";
const SHOTS = "laws-six-authority-benchmark-v1-screenshots";
const failures = [];
const observations = [];
const routes = [];
const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const digest = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const assert = (condition, id, observed = null, profile = "source") => {
  if (!condition) failures.push({ profile, id, observed });
};
const visible = element => {
  if (!element || element.hidden) return false;
  const style = getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0.01 && rect.width > 0 && rect.height > 0;
};

const PROFILE = Object.freeze({
  id: "SIX_AUTHORITY_PROFILE",
  topLevelAuthorities: 6,
  lawAuthorities: 4,
  noncardinalAuthorities: 2,
  lawMembers: 16,
  testMembers: 4,
  researchMembers: 4,
  totalChildDestinations: 24,
  projectedAuthorityLabels: 6,
  primaryCandidates: 6
});
const AUTHORITY_IDS = Object.freeze(["flow", "integrity", "reality", "structure", "test", "research"]);
const LAW_DIRECTIONS = new Set(["flow", "integrity", "reality", "structure"]);
const EXPECTED_PRODUCT_PATHS = Object.freeze([
  "laws/index.controller.js",
  "laws/index.crystals.js",
  "laws/index.css",
  "laws/index.html",
  "laws/index.interactions.js"
]);
const PROTECTED_PATHS = new Set([
  "laws/index.compositor.js",
  "laws/index.planet.js",
  "laws/index.cosmos.js",
  "assets/audralia/audralia.planet.js",
  "laws/test/index.html",
  "laws/research/index.html"
]);
const VIEWPORTS = Object.freeze([
  { id: "PHONE_PORTRAIT_430x932", width: 430, height: 932, mobile: true },
  { id: "PHONE_LANDSCAPE_932x430", width: 932, height: 430, mobile: true },
  { id: "TABLET_1024x1366", width: 1024, height: 1366, mobile: true },
  { id: "DESKTOP_1440x1000", width: 1440, height: 1000, mobile: false }
]);
const CANONICAL = Object.freeze({
  flow: [0, 0, 0, 1],
  integrity: [0, 0, -Math.SQRT1_2, Math.SQRT1_2],
  reality: [0, 0, 1, 0],
  structure: [0, 0, Math.SQRT1_2, Math.SQRT1_2],
  test: [0, 0, -0.3826834323650898, 0.9238795325112867],
  research: [0, 0, 0.3826834323650898, 0.9238795325112867]
});

function openingTags(html) {
  return html.match(/<button\b[^>]*>/gi) || [];
}
function attributes(tag) {
  const record = Object.create(null);
  for (const match of tag.matchAll(/\b([a-zA-Z0-9:_-]+)(?:\s*=\s*"([^"]*)")?/g)) {
    record[match[1].toLowerCase()] = match[2] ?? true;
  }
  return record;
}
function has(record, name) {
  return Object.prototype.hasOwnProperty.call(record, name);
}
function writeReceipt(extra = {}) {
  fs.mkdirSync(SHOTS, { recursive: true });
  const screenshotManifest = fs.readdirSync(SHOTS).sort().map(file => {
    const filePath = path.join(SHOTS, file);
    return { file, bytes: fs.statSync(filePath).size, sha256: digest(filePath) };
  });
  const receipt = {
    tool: TOOL,
    checkpoint: "LAWS_COMPASS_CHECKPOINT_3_EXECUTED_VERIFICATION_v1",
    profile: PROFILE,
    execution: {
      repository: process.env.GITHUB_REPOSITORY || "smansfield635-create/smansfield635-create.github.io",
      branch: process.env.EXECUTION_BRANCH || process.env.GITHUB_REF_NAME || "",
      commit: EXECUTION_COMMIT,
      baseline: BASELINE_COMMIT,
      workflowRunId: process.env.GITHUB_RUN_ID || ""
    },
    observations,
    routeChecks: routes,
    screenshotManifest,
    failures,
    pass: failures.length === 0,
    productSourceMutatedByBenchmark: false,
    fourAuthorityBenchmarkModified: false,
    merged: false,
    deployed: false,
    physicalSamsungAcceptance: "NOT_YET",
    stoppingBoundary: {
      proves: ["EXACT_HEAD_SOURCE_ASSERTIONS", "SIX_AUTHORITY_BROWSER_EXECUTION", "RESPONSIVE_PROFILE_EXECUTION", "ROUTE_AND_CLUSTER_RUNTIME_INSPECTION"],
      doesNotProve: ["PHYSICAL_SAMSUNG_ACCEPTANCE", "PRODUCTION_DEPLOYMENT", "USER_ACCEPTANCE", "SCIENTIFIC_VALIDATION"]
    },
    ...extra
  };
  fs.writeFileSync(OUT, `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(JSON.stringify({ pass: receipt.pass, failures, observations: observations.length, screenshots: screenshotManifest.length }, null, 2));
  return receipt;
}

const source = {
  html: fs.readFileSync("laws/index.html", "utf8"),
  css: fs.readFileSync("laws/index.css", "utf8"),
  controller: fs.readFileSync("laws/index.controller.js", "utf8"),
  crystals: fs.readFileSync("laws/index.crystals.js", "utf8"),
  interactions: fs.readFileSync("laws/index.interactions.js", "utf8")
};
const tags = openingTags(source.html).map(tag => ({ tag, attrs: attributes(tag) }));
const topLevel = tags.filter(({ attrs }) => has(attrs, "data-laws-category"));
const lawAuthorities = topLevel.filter(({ attrs }) => has(attrs, "data-laws-category-control") && LAW_DIRECTIONS.has(String(attrs["data-direction"] || "")));
const noncardinalAuthorities = topLevel.filter(({ attrs }) => has(attrs, "data-laws-gateway"));
const childMembers = tags.filter(({ attrs }) => !has(attrs, "data-laws-category") && has(attrs, "data-direction") && has(attrs, "data-route"));
const lawMembers = childMembers.filter(({ attrs }) => has(attrs, "data-laws-law") && LAW_DIRECTIONS.has(String(attrs["data-direction"] || "")));
const testMembers = childMembers.filter(({ attrs }) => attrs["data-direction"] === "test");
const researchMembers = childMembers.filter(({ attrs }) => attrs["data-direction"] === "research");
const childRoutes = childMembers.map(({ attrs }) => String(attrs["data-route"] || "")).filter(Boolean);

let allChangedPaths = [];
try {
  allChangedPaths = execFileSync("git", ["diff", "--name-only", BASELINE_COMMIT, EXECUTION_COMMIT || "HEAD"], { encoding: "utf8" })
    .split(/\r?\n/).map(value => value.trim()).filter(Boolean).sort();
} catch (error) {
  assert(false, "CHANGED_PATH_COMPARISON_FAILED", String(error?.message || error));
}
const productChangedPaths = allChangedPaths.filter(file => file.startsWith("laws/") || file === "assets/audralia/audralia.planet.js");
assert(JSON.stringify(productChangedPaths) === JSON.stringify([...EXPECTED_PRODUCT_PATHS].sort()), "PRODUCT_CHANGED_PATH_SET_INVALID", { expected: [...EXPECTED_PRODUCT_PATHS].sort(), observed: productChangedPaths });
assert(!allChangedPaths.some(file => PROTECTED_PATHS.has(file)), "PROTECTED_PATH_CHANGED", allChangedPaths.filter(file => PROTECTED_PATHS.has(file)));
assert(topLevel.length === PROFILE.topLevelAuthorities, "TOP_LEVEL_AUTHORITY_COUNT_INVALID", topLevel.length);
assert(lawAuthorities.length === PROFILE.lawAuthorities, "LAW_AUTHORITY_COUNT_INVALID", lawAuthorities.length);
assert(noncardinalAuthorities.length === PROFILE.noncardinalAuthorities, "NONCARDINAL_AUTHORITY_COUNT_INVALID", noncardinalAuthorities.length);
assert(lawMembers.length === PROFILE.lawMembers, "LAW_MEMBER_COUNT_INVALID", lawMembers.length);
assert(testMembers.length === PROFILE.testMembers, "TEST_MEMBER_COUNT_INVALID", testMembers.length);
assert(researchMembers.length === PROFILE.researchMembers, "RESEARCH_MEMBER_COUNT_INVALID", researchMembers.length);
assert(childMembers.length === PROFILE.totalChildDestinations, "TOTAL_CHILD_DESTINATION_COUNT_INVALID", childMembers.length);
assert(new Set(childRoutes).size === PROFILE.totalChildDestinations, "DESTINATION_ROUTE_UNIQUENESS_INVALID", childRoutes);
assert(testMembers.every(({ attrs }) => !has(attrs, "data-laws-law") && !has(attrs, "data-laws-law-control")), "TEST_MEMBERS_INCORRECTLY_CLASSIFIED_AS_LAWS", testMembers.map(({ attrs }) => attrs["data-law-id"] || attrs["data-destination-id"]));
assert(researchMembers.every(({ attrs }) => !has(attrs, "data-laws-law") && !has(attrs, "data-laws-law-control")), "RESEARCH_MEMBERS_INCORRECTLY_CLASSIFIED_AS_LAWS", researchMembers.map(({ attrs }) => attrs["data-law-id"] || attrs["data-destination-id"]));
assert(AUTHORITY_IDS.every(id => topLevel.some(({ attrs }) => attrs["data-direction"] === id)), "SIX_AUTHORITY_IDENTITIES_INCOMPLETE", topLevel.map(({ attrs }) => attrs["data-direction"]));
assert(source.controller.includes('const DIRECTIONS = Object.freeze([\n    "flow",\n    "integrity",\n    "reality",\n    "structure",\n    "test",\n    "research"'), "CONTROLLER_SIX_AUTHORITY_IDENTITY_SET_MISSING");
assert(source.interactions.includes('const D=Object.freeze(["flow","integrity","reality","structure","test","research"])'), "INTERACTIONS_SIX_AUTHORITY_IDENTITY_SET_MISSING");
assert(source.interactions.includes("projectedCategoryLabelsInstalled:S.labels.size===6"), "PROJECTED_SIX_AUTHORITY_LABEL_CONTRACT_MISSING");
assert(source.crystals.includes("test") && source.crystals.includes("research"), "RENDERER_TEST_RESEARCH_IDENTITIES_MISSING");
assert((source.html.match(/src="\/laws\/index\.controller\.js/g) || []).length === 1, "SECOND_CONTROLLER_SCRIPT_PRESENT");
assert((source.html.match(/src="\/laws\/index\.compositor\.js/g) || []).length <= 1, "SECOND_COMPOSITOR_SCRIPT_PRESENT");
assert((source.html.match(/src="\/laws\/index\.crystals\.js/g) || []).length <= 1, "SECOND_CRYSTALS_SCRIPT_PRESENT");
assert((source.html.match(/src="\/laws\/index\.interactions\.js/g) || []).length <= 1, "SECOND_INTERACTIONS_SCRIPT_PRESENT");
assert((source.controller.match(/globalThis\.DGB_LAWS_CONTROLLER\s*=/g) || []).length === 1, "SECOND_CONTROLLER_API_PRESENT");
assert(
  source.html.includes('data-laws-category-count="6"') &&
  source.html.includes('data-laws-law-count="16"') &&
  source.html.includes('data-laws-nonlaw-member-count="8"') &&
  source.html.includes('data-laws-child-route-count="24"'),
  "HTML_SIX_AUTHORITY_COUNTS_MISSING"
);
assert(source.css.includes('[data-laws-category][data-laws-gateway="solar"]::before'), "TEST_SOLAR_PRESENTATION_MISSING");
assert(source.css.includes('[data-laws-category][data-laws-gateway="lunar"]::before'), "RESEARCH_LUNAR_PRESENTATION_MISSING");

if (failures.length) {
  writeReceipt({ phase: "SOURCE_ASSERTIONS", browserExecuted: false });
  process.exitCode = 1;
} else {
  fs.rmSync(SHOTS, { recursive: true, force: true });
  fs.mkdirSync(SHOTS, { recursive: true });
  let browser = null;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--enable-webgl", "--ignore-gpu-blocklist", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
    });

    for (const profile of VIEWPORTS) {
      let page = null;
      try {
        page = await browser.newPage();
        await page.setViewport({ width: profile.width, height: profile.height, deviceScaleFactor: 1, isMobile: profile.mobile, hasTouch: profile.mobile });
      const telemetry = { pageErrors: [], requestFailures: [], consoleErrors: [] };
      page.on("pageerror", error => telemetry.pageErrors.push(String(error?.message || error)));
      page.on("requestfailed", request => telemetry.requestFailures.push({ url: request.url(), error: request.failure()?.errorText || "" }));
      page.on("console", message => { if (message.type() === "error") telemetry.consoleErrors.push(message.text()); });

      const response = await page.goto(`${ORIGIN}/laws/`, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForFunction(expected => Boolean(
        document.querySelector("[data-laws-root]") &&
        globalThis.DGB_LAWS_CONTROLLER &&
        globalThis.DGB_LAWS_INTERACTIONS_RECEIPT?.initialized &&
        document.querySelectorAll("[data-laws-category]").length === expected &&
        document.querySelectorAll("[data-laws-projected-category-label]").length === expected
      ), { timeout: 45000 }, PROFILE.topLevelAuthorities);
      await sleep(500);

      const inspect = stateLabel => page.evaluate((label, visibleSource) => {
        const isVisible = eval(`(${visibleSource})`);
        const root = document.querySelector("[data-laws-root]");
        const authorityLabels = [...document.querySelectorAll("[data-laws-projected-category-label]")];
        const lawLabels = [...document.querySelectorAll("[data-laws-projected-law-label]")];
        const frame = globalThis.DGB_LAWS_CONTROLLER?.getFrameState?.() || null;
        const interaction = globalThis.DGB_LAWS_INTERACTIONS_RECEIPT || null;
        return {
          stateLabel: label,
          controllerState: root?.dataset.lawsControllerState || "",
          presentationMode: root?.dataset.lawsPresentationMode || "",
          activeCluster: root?.dataset.lawsActiveCluster || root?.dataset.activeClusterDirection || frame?.activeClusterDirection || "",
          spatialPrimaryId: root?.dataset.lawsSpatialPrimaryId || frame?.spatialPrimaryId || frame?.orbitFocus || "",
          authorityControlCount: document.querySelectorAll("[data-laws-category]").length,
          authorityLabelCount: authorityLabels.length,
          authorityVisibleCount: authorityLabels.filter(isVisible).length,
          authorityPrimaryCount: authorityLabels.filter(element => isVisible(element) && element.dataset.primary === "true").length,
          authorityIds: authorityLabels.map(element => element.dataset.direction || "").sort(),
          visibleLawLabelCount: lawLabels.filter(isVisible).length,
          clusterMemberIds: frame?.cluster?.lawIds || [],
          settlementCount: Number(interaction?.settlementCount || 0),
          horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          canvasCount: document.querySelectorAll("canvas[data-laws-compositor-layer],canvas[data-laws-crystals-canvas]").length,
          h1Count: document.querySelectorAll("h1").length,
          globeSurfacePresent: Boolean(document.querySelector("[data-upstream-compass-mount]") && document.querySelector("[data-laws-planet-world-pass-participant]")),
          bodyHeight: document.body.getBoundingClientRect().height
        };
      }, stateLabel, visible.toString());

      const setPrimary = async id => {
        const accepted = await page.evaluate((authorityId, quaternion) => {
          const controller = globalThis.DGB_LAWS_CONTROLLER;
          if (!controller?.beginOrbitGesture?.()) return false;
          if (controller.requestOrbitPreview({ quaternion, primaryId: authorityId }) === false) return false;
          return controller.requestOrbitCommit() !== false;
        }, id, CANONICAL[id]);
        assert(accepted, "PRIMARY_AUTHORITY_COMMIT_REJECTED", id, profile.id);
        await page.waitForFunction(authorityId => document.querySelector("[data-laws-root]")?.dataset.lawsSpatialPrimaryId === authorityId, { timeout: 15000 }, id);
        await sleep(180);
      };

      const dragAndSettle = async id => {
        await setPrimary(id);
        const before = await page.evaluate(() => Number(globalThis.DGB_LAWS_INTERACTIONS_RECEIPT?.settlementCount || 0));
        const box = await page.$eval("[data-laws-scene-field]", element => {
          const rect = element.getBoundingClientRect();
          return { x: rect.left + rect.width * 0.18, y: rect.top + rect.height * 0.54, width: rect.width };
        });
        await page.mouse.move(box.x, box.y);
        await page.mouse.down();
        await page.mouse.move(box.x + Math.max(28, box.width * 0.07), box.y + 12, { steps: 8 });
        await page.mouse.up();
        await page.waitForFunction(value => Number(globalThis.DGB_LAWS_INTERACTIONS_RECEIPT?.settlementCount || 0) > value, { timeout: 15000 }, before);
      };

      const openCluster = async id => {
        const accepted = await page.evaluate(authorityId => globalThis.DGB_LAWS_CONTROLLER.requestCategorySelection(authorityId), id);
        assert(accepted !== false, "CLUSTER_SELECTION_REJECTED", id, profile.id);
        await page.waitForFunction(authorityId => {
          const root = document.querySelector("[data-laws-root]");
          const frame = globalThis.DGB_LAWS_CONTROLLER?.getFrameState?.();
          return root?.dataset.lawsControllerState === "CLUSTER_OPEN" && (root?.dataset.lawsActiveCluster === authorityId || frame?.activeClusterDirection === authorityId || frame?.cluster?.direction === authorityId);
        }, { timeout: 15000 }, id);
        await sleep(180);
      };

      const returnToConstellation = async () => {
        await page.evaluate(() => globalThis.DGB_LAWS_CONTROLLER.requestReturnToConstellation());
        await page.waitForFunction(() => document.querySelector("[data-laws-root]")?.dataset.lawsControllerState === "CONSTELLATION", { timeout: 15000 });
        await sleep(180);
      };

      const initial = await inspect("INITIAL_SIX_AUTHORITY_FIELD");
      assert([200, 304].includes(response?.status()), "LAWS_ROUTE_STATUS_INVALID", response?.status(), profile.id);
      assert(initial.authorityControlCount === 6 && initial.authorityLabelCount === 6 && initial.authorityVisibleCount === 6, "SIX_AUTHORITY_RUNTIME_COUNT_INVALID", initial, profile.id);
      assert(initial.authorityPrimaryCount === 1, "PRIMARY_AUTHORITY_COUNT_INVALID", initial, profile.id);
      assert(JSON.stringify(initial.authorityIds) === JSON.stringify([...AUTHORITY_IDS].sort()), "AUTHORITY_RUNTIME_IDENTITIES_INVALID", initial.authorityIds, profile.id);
      assert(initial.globeSurfacePresent, "FIXED_CENTER_GLOBE_SURFACE_MISSING", initial, profile.id);
      assert(initial.horizontalOverflow <= 1 && initial.h1Count === 1 && initial.bodyHeight > 0, "INITIAL_LAYOUT_INVALID", initial, profile.id);
      await page.screenshot({ path: path.join(SHOTS, `${profile.id.toLowerCase()}-initial-six-authority-field.png`), fullPage: true });

      for (const id of AUTHORITY_IDS) {
        try {
          await dragAndSettle(id);
        } catch (error) {
          failures.push({
            profile: profile.id,
            id: "DRAG_AND_SETTLEMENT_ABORTED",
            observed: { authorityId: id, error: String(error?.stack || error) }
          });
          throw error;
        }
      }
      const settlement = await inspect("SIX_AUTHORITY_DRAG_SETTLEMENT");
      assert(settlement.settlementCount >= AUTHORITY_IDS.length, "SIX_AUTHORITY_SETTLEMENT_COUNT_INVALID", settlement, profile.id);

      await setPrimary("test");
      const testPrimary = await inspect("TEST_PRIMARY");
      assert(testPrimary.spatialPrimaryId === "test" && testPrimary.authorityPrimaryCount === 1, "TEST_PRIMARY_INVALID", testPrimary, profile.id);
      await page.screenshot({ path: path.join(SHOTS, `${profile.id.toLowerCase()}-test-primary.png`), fullPage: true });
      await openCluster("test");
      const testCluster = await inspect("TEST_CLUSTER_OPEN");
      assert(testCluster.clusterMemberIds.length === 4, "TEST_CLUSTER_MEMBER_COUNT_INVALID", testCluster, profile.id);
      await page.screenshot({ path: path.join(SHOTS, `${profile.id.toLowerCase()}-test-cluster-open.png`), fullPage: true });

      await returnToConstellation();
      await setPrimary("research");
      const researchPrimary = await inspect("RESEARCH_PRIMARY");
      assert(researchPrimary.spatialPrimaryId === "research" && researchPrimary.authorityPrimaryCount === 1, "RESEARCH_PRIMARY_INVALID", researchPrimary, profile.id);
      await page.screenshot({ path: path.join(SHOTS, `${profile.id.toLowerCase()}-research-primary.png`), fullPage: true });
      await openCluster("research");
      const researchCluster = await inspect("RESEARCH_CLUSTER_OPEN");
      assert(researchCluster.clusterMemberIds.length === 4, "RESEARCH_CLUSTER_MEMBER_COUNT_INVALID", researchCluster, profile.id);
      await page.screenshot({ path: path.join(SHOTS, `${profile.id.toLowerCase()}-research-cluster-open.png`), fullPage: true });

      await returnToConstellation();
      await openCluster("flow");
      const lawCluster = await inspect("REPRESENTATIVE_FLOW_LAW_CLUSTER");
      assert(lawCluster.clusterMemberIds.length === 4, "LAW_CLUSTER_MEMBER_COUNT_INVALID", lawCluster, profile.id);
      await page.screenshot({ path: path.join(SHOTS, `${profile.id.toLowerCase()}-representative-law-cluster.png`), fullPage: true });

      if (routes.length === 0) {
        for (const route of childRoutes) {
          const result = await page.evaluate(async routeValue => {
            const url = new URL(routeValue, location.origin);
            const anchor = url.hash ? decodeURIComponent(url.hash.slice(1)) : "";
            url.hash = "";
            const response = await fetch(url.href, { cache: "no-store" });
            const text = await response.text();
            const documentCopy = new DOMParser().parseFromString(text, "text/html");
            return { route: routeValue, status: response.status, anchor, anchorExists: !anchor || Boolean(documentCopy.getElementById(anchor)) };
          }, route);
          routes.push(result);
          assert([200, 304].includes(result.status), "DESTINATION_ROUTE_HTTP_INVALID", result, profile.id);
          assert(result.anchorExists, "DESTINATION_ROUTE_ANCHOR_MISSING", result, profile.id);
        }
      }

      assert(telemetry.pageErrors.length === 0 && telemetry.requestFailures.length === 0, "RUNTIME_TELEMETRY_FAILURE", telemetry, profile.id);
      observations.push({ profile: profile.id, initial, settlement, testPrimary, testCluster, researchPrimary, researchCluster, lawCluster, telemetry });
      } finally {
        if (page) {
          await page.close().catch(() => {});
        }
      }
    }

    const receipt = writeReceipt({ phase: "BROWSER_EXECUTION", browserExecuted: true });
    if (!receipt.pass) process.exitCode = 1;
  } catch (error) {
    failures.push({
      profile: "browser",
      id: "BROWSER_EXECUTION_ABORTED",
      observed: String(error?.stack || error)
    });
    writeReceipt({
      phase: "BROWSER_EXECUTION_ABORTED",
      browserExecuted: true
    });
    process.exitCode = 1;
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
