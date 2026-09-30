import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import puppeteer from "puppeteer-core";

const TOOL = "LAWS_COMPASS_SIX_AUTHORITY_BENCHMARK_v1";
const RECONCILIATION = "LAWS_COMPASS_CHECKPOINT_5_SINGLE_ACTIVE_LABEL_RECONCILIATION_v1";
const ORIGIN = process.env.LAWS_SIX_ORIGIN || "http://127.0.0.1:4173";
const CHROME_PATH = process.env.CHROME_PATH || process.env.CHROME_BIN || "/usr/bin/google-chrome";
const EXECUTION_COMMIT = process.env.EXECUTION_COMMIT || process.env.GITHUB_SHA || "";
const BASELINE_COMMIT = process.env.BASELINE_COMMIT || "b8eb8783609ea584b9f2e0f132e706e23c211535";
const OUT = "laws-cp5-single-active-label-v1.json";
const SHOTS = "laws-cp5-single-active-label-v1-screenshots";
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
  id: "CP5_SINGLE_ACTIVE_OUTER_LABEL_PROFILE",
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
  "laws/index.interactions.js"
]);
const PROTECTED_PATHS = new Set([
  "laws/index.crystals.js",
  "laws/index.controller.js",
  "laws/index.compositor.js",
  "laws/index.html",
  "laws/index.css",
  "laws/index.planet.js",
  "laws/index.cosmos.js",
  "assets/audralia/audralia.planet.js",
  "laws/test/index.html",
  "laws/research/index.html"
]);

const VIEWPORTS = Object.freeze([
  { id: "PHONE_PORTRAIT_430x932", width: 430, height: 932, mobile: true, inputType: "touch" },
  { id: "PHONE_LANDSCAPE_932x430", width: 932, height: 430, mobile: true, inputType: "touch" },
  { id: "TABLET_1024x1366", width: 1024, height: 1366, mobile: true, inputType: "touch" },
  { id: "DESKTOP_1440x1000", width: 1440, height: 1000, mobile: false, inputType: "mouse" }
]);
const HALF_SQRT_TWO = Math.SQRT1_2;
const CANONICAL = Object.freeze({
  flow: Object.freeze([0, 0, 0, 1]),
  integrity: Object.freeze([0, 0, HALF_SQRT_TWO, HALF_SQRT_TWO]),
  reality: Object.freeze([0, 0, 1, 0]),
  structure: Object.freeze([0, 0, -HALF_SQRT_TWO, HALF_SQRT_TWO]),
  test: Object.freeze([-0.43283662594337136, 0, 0, 0.9014723818520222]),
  research: Object.freeze([0.9014723818520223, 0, 0, 0.4328366259433712])
});
const AUTHORITY_FIELD_FRAGMENTS = Object.freeze([
  "contractId:'LAWS_COMPASS_EXACT_TWO_OBJECT_FIELD_v2'",
  "model:'FOUR_BASELINE_CARDINALS_PLUS_OPPOSED_DEPTH_POLES'",
  "flow:Object.freeze([0,1,0])",
  "integrity:Object.freeze([1,0,0])",
  "reality:Object.freeze([0,-1,0])",
  "structure:Object.freeze([-1,0,0])",
  "test:Object.freeze([0,0,1])",
  "research:Object.freeze([0,0,-1])",
  "lawStarIds:Object.freeze(['flow','integrity','reality','structure'])",
  "celestialSphereIds:Object.freeze(['test','research'])",
  "sharedRigidTransform:true",
  "fixedCenterExcluded:true"
]);
const CONTROLLER_ORIENTATION_FRAGMENTS = Object.freeze([
  'flow:Object.freeze([0,0,0,1])',
  'integrity:Object.freeze([0,0,HALF_SQRT_TWO,HALF_SQRT_TWO])',
  'reality:Object.freeze([0,0,1,0])',
  'structure:Object.freeze([0,0,-HALF_SQRT_TWO,HALF_SQRT_TWO])',
  'test:Object.freeze([-0.43283662594337136,0,0,0.9014723818520222])',
  'research:Object.freeze([0.9014723818520223,0,0,0.4328366259433712])'
]);

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
    reconciliation: RECONCILIATION,
    checkpoint: "LAWS_COMPASS_CHECKPOINT_5_SINGLE_ACTIVE_LABEL_EXECUTED_VERIFICATION_v1",
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
      proves: ["EXACT_HEAD_SOURCE_ASSERTIONS", "COMPLETE_RUNTIME_READINESS", "SIX_AUTHORITY_BROWSER_EXECUTION", "RESPONSIVE_PROFILE_EXECUTION", "TOUCH_AND_MOUSE_INTERACTION_EXECUTION", "ROUTE_AND_CLUSTER_RUNTIME_INSPECTION"],
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
assert(AUTHORITY_FIELD_FRAGMENTS.every(fragment => source.controller.includes(fragment)), "CONTROLLER_AUTHORITY_FIELD_CONTRACT_MISMATCH", AUTHORITY_FIELD_FRAGMENTS.filter(fragment => !source.controller.includes(fragment)));
assert(CONTROLLER_ORIENTATION_FRAGMENTS.every(fragment => source.controller.includes(fragment)), "CONTROLLER_ORIENTATION_AUTHORITY_MISMATCH", CONTROLLER_ORIENTATION_FRAGMENTS.filter(fragment => !source.controller.includes(fragment)));
assert(source.interactions.includes('const D=Object.freeze(["flow","integrity","reality","structure","test","research"])'), "INTERACTIONS_SIX_AUTHORITY_IDENTITY_SET_MISSING");
assert(source.interactions.includes("projectedCategoryLabelsInstalled:S.labels.size===6"), "PROJECTED_SIX_AUTHORITY_LABEL_CONTRACT_MISSING");
assert(source.interactions.includes("singleActiveOuterAuthorityLabel:true"), "SINGLE_ACTIVE_OUTER_AUTHORITY_LABEL_CONTRACT_MISSING");
assert(source.interactions.includes("primary-only-star-center-protected-tab"), "PRIMARY_ONLY_LABEL_PLACEMENT_CONTRACT_MISSING");
assert(source.crystals.includes("horizontalRadius:\n        1.68") && source.crystals.includes("verticalRadius:\n        1.5008") && source.crystals.includes("depthRadius:\n        1.2992") && source.crystals.includes("gatewayBodyScale:\n    0.7666667"), "ACCEPTED_RADIAL_OR_BODY_SCALE_CONTRACT_MISSING");
assert(source.crystals.includes("test") && source.crystals.includes("research"), "RENDERER_TEST_RESEARCH_IDENTITIES_MISSING");
assert((source.html.match(/src="\/laws\/index\.controller\.js/g) || []).length === 1, "SECOND_CONTROLLER_SCRIPT_PRESENT");
assert((source.html.match(/src="\/laws\/index\.compositor\.js/g) || []).length <= 1, "SECOND_COMPOSITOR_SCRIPT_PRESENT");
assert((source.html.match(/src="\/laws\/index\.crystals\.js/g) || []).length <= 1, "SECOND_CRYSTALS_SCRIPT_PRESENT");
assert((source.html.match(/src="\/laws\/index\.interactions\.js/g) || []).length <= 1, "SECOND_INTERACTIONS_SCRIPT_PRESENT");
assert((source.controller.match(/globalThis\.DGB_LAWS_CONTROLLER\s*=/g) || []).length === 1, "SECOND_CONTROLLER_API_PRESENT");
assert(source.html.includes('data-laws-category-count="6"') && source.html.includes('data-laws-law-count="16"') && source.html.includes('data-laws-nonlaw-member-count="8"') && source.html.includes('data-laws-child-route-count="24"'), "HTML_SIX_AUTHORITY_COUNTS_MISSING");
assert(source.css.includes('[data-laws-category][data-laws-gateway="solar"]::before'), "TEST_SOLAR_PRESENTATION_MISSING");
assert(source.css.includes('[data-laws-category][data-laws-gateway="lunar"]::before'), "RESEARCH_LUNAR_PRESENTATION_MISSING");

async function runtimeSnapshot(page) {
  return page.evaluate((authorityIds, visibleSource) => {
    const isVisible = eval(`(${visibleSource})`);
    const root = document.querySelector("[data-laws-root]");
    const field = document.querySelector("[data-laws-scene-field]");
    const frame = globalThis.DGB_LAWS_CONTROLLER?.getFrameState?.() || null;
    const interaction = globalThis.DGB_LAWS_INTERACTIONS_RECEIPT || null;
    const compositor = globalThis.DGB_LAWS_COMPOSITOR_RECEIPT || null;
    const crystals = globalThis.DGB_LAWS_CRYSTALS_RECEIPT || null;
    const projection = Array.isArray(frame?.semanticProjection) ? frame.semanticProjection : [];
    const categoryProjection = projection.filter(record => record?.kind === "category" && authorityIds.includes(record.id));
    const authorityLabels = [...document.querySelectorAll("[data-laws-projected-category-label]")];
    const lawLabels = [...document.querySelectorAll("[data-laws-projected-law-label]")];
    const primaryLabels = authorityLabels.filter(element => element.dataset.primary === "true");
    const rect = field?.getBoundingClientRect?.();
    return {
      controllerInitialized: Boolean(globalThis.DGB_LAWS_CONTROLLER?.getFrameState && frame),
      interactionsInitialized: Boolean(interaction?.initialized),
      compositorAvailable: Boolean(globalThis.DGB_LAWS_COMPOSITOR),
      compositorInitialized: Boolean(compositor?.initialized),
      compositorStatus: compositor?.status || root?.dataset.lawsCompositorStatus || "",
      crystalsAvailable: Boolean(globalThis.DGB_LAWS_CRYSTALS),
      crystalsInitialized: Boolean(crystals?.rendererInitialized),
      crystalsStatus: crystals?.status || root?.dataset.lawsCrystalsStatus || "",
      rearCanvasCreated: Boolean(document.querySelector('canvas[data-laws-compositor-layer="rear"],canvas[data-compass-compositor-layer="rear"]')),
      frontCanvasCreated: Boolean(document.querySelector('canvas[data-laws-compositor-layer="front"],canvas[data-compass-compositor-layer="front"]')),
      canvasCount: document.querySelectorAll("canvas[data-laws-compositor-layer],canvas[data-compass-compositor-layer],canvas[data-laws-crystals-canvas],canvas[data-compass-crystals-canvas]").length,
      semanticProjectionRevision: Number(frame?.semanticProjectionRevision || root?.dataset.semanticProjectionRevision || 0),
      semanticProjectionCount: projection.length,
      semanticProjectionRecords: projection,
      categoryProjectionCount: categoryProjection.length,
      categoryProjectionIds: categoryProjection.map(record => record.id).sort(),
      visibleCategoryProjectionCount: categoryProjection.filter(record => record.visible !== false).length,
      installedLabelCount: authorityLabels.length,
      associatedLabelCount: authorityLabels.filter(element => categoryProjection.some(record => record.id === element.dataset.direction)).length,
      visibleLabelCount: authorityLabels.filter(isVisible).length,
      visiblePrimaryCount: authorityLabels.filter(element => isVisible(element) && element.dataset.primary === "true").length,
      soleVisibleLabelIdentity: authorityLabels.find(element => isVisible(element))?.dataset.direction || "",
      outerAuthorityLabelStates: authorityLabels.map(element => ({
        id: element.dataset.direction || "",
        visible: isVisible(element),
        hidden: Boolean(element.hidden),
        primary: element.dataset.primary === "true",
        tabIndex: Number(element.tabIndex),
        tabindexAttribute: element.getAttribute("tabindex"),
        ariaHidden: element.getAttribute("aria-hidden"),
        pointerEvents: getComputedStyle(element).pointerEvents,
        ariaLabel: element.getAttribute("aria-label") || ""
      })),
      centerCompassReachable: (() => {
        const element = document.querySelector("[data-upstream-compass-control]");
        if (!element || element.dataset.interactionEnabled === "false") return false;
        const box = element.getBoundingClientRect();
        return box.width > 0 && box.height > 0;
      })(),
      controllerPrimaryIdentity: frame?.orbitFocus || root?.dataset.orbitFocus || root?.dataset.lawsSpatialPrimaryId || "",
      projectionPrimaryIdentity: primaryLabels.length === 1 ? primaryLabels[0].dataset.direction || "" : "",
      interactionReceipt: interaction,
      compositorReceipt: compositor,
      crystalsReceipt: crystals,
      renderedFrameCompleted: Boolean(crystals?.rendererInitialized && (Number(crystals?.rearDrawCallsLastFrame || 0) + Number(crystals?.frontDrawCallsLastFrame || 0) > 0) && Number(frame?.semanticProjectionRevision || 0) > 0),
      controllerState: root?.dataset.lawsControllerState || frame?.state || "",
      presentationMode: root?.dataset.lawsPresentationMode || frame?.presentationMode || "",
      activeCluster: root?.dataset.lawsActiveCluster || frame?.activeClusterDirection || frame?.cluster?.direction || "",
      settlementCount: Number(interaction?.settlementCount || 0),
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1Count: document.querySelectorAll("h1").length,
      globeSurfacePresent: Boolean(document.querySelector("[data-upstream-compass-mount]") && document.querySelector("[data-laws-planet-world-pass-participant]")),
      bodyHeight: document.body.getBoundingClientRect().height,
      visibleLawLabelCount: lawLabels.filter(isVisible).length,
      clusterMemberIds: frame?.cluster?.lawIds || [],
      sceneRectangle: rect ? { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height } : null,
      viewport: { width: innerWidth, height: innerHeight, scrollX, scrollY }
    };
  }, AUTHORITY_IDS, visible.toString());
}

function readinessPassed(state) {
  return Boolean(state.controllerInitialized && state.interactionsInitialized && state.compositorAvailable && state.compositorInitialized && state.compositorStatus === "available" && state.crystalsAvailable && state.crystalsInitialized && state.crystalsStatus === "available" && state.rearCanvasCreated && state.frontCanvasCreated && state.semanticProjectionCount >= PROFILE.topLevelAuthorities && state.categoryProjectionCount === PROFILE.topLevelAuthorities && state.visibleCategoryProjectionCount === PROFILE.topLevelAuthorities && state.installedLabelCount === PROFILE.projectedAuthorityLabels && state.associatedLabelCount === PROFILE.projectedAuthorityLabels && state.renderedFrameCompleted);
}

async function waitForRuntimeReadiness(page, profileEvidence, timeout = 45000) {
  await page.waitForFunction(() => Boolean(globalThis.DGB_LAWS_CONTROLLER && globalThis.DGBLawsStagedLoader), { timeout });
  await page.evaluate(async () => {
    await globalThis.DGBLawsStagedLoader.loadOrbitSystems();
    await globalThis.DGBLawsStagedLoader.loadInteractionSystems();
  });
  const started = Date.now();
  let last = null;
  while (Date.now() - started < timeout) {
    last = await runtimeSnapshot(page);
    profileEvidence.readinessSamples.push({
      elapsedMs: Date.now() - started,
      controllerInitialized: last.controllerInitialized,
      interactionsInitialized: last.interactionsInitialized,
      compositorInitialized: last.compositorInitialized,
      compositorStatus: last.compositorStatus,
      crystalsInitialized: last.crystalsInitialized,
      crystalsStatus: last.crystalsStatus,
      rearCanvasCreated: last.rearCanvasCreated,
      frontCanvasCreated: last.frontCanvasCreated,
      semanticProjectionCount: last.semanticProjectionCount,
      categoryProjectionCount: last.categoryProjectionCount,
      visibleCategoryProjectionCount: last.visibleCategoryProjectionCount,
      installedLabelCount: last.installedLabelCount,
      associatedLabelCount: last.associatedLabelCount,
      renderedFrameCompleted: last.renderedFrameCompleted
    });
    if (profileEvidence.readinessSamples.length > 24) profileEvidence.readinessSamples.shift();
    if (readinessPassed(last)) {
      profileEvidence.runtimeReadiness = { pass: true, elapsedMs: Date.now() - started, state: last };
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      return last;
    }
    await sleep(200);
  }
  profileEvidence.runtimeReadiness = { pass: false, elapsedMs: Date.now() - started, state: last };
  const error = new Error("LAWS_SIX_AUTHORITY_RUNTIME_READINESS_TIMEOUT");
  error.readinessState = last;
  throw error;
}

async function inspect(page, stateLabel) {
  return { stateLabel, ...await runtimeSnapshot(page) };
}

async function scrollSceneIntoView(page, timeout = 5000) {
  const target = await page.$eval("[data-laws-scene-field]", element => {
    document.documentElement.style.setProperty("scroll-behavior", "auto", "important");
    if (document.body) document.body.style.setProperty("scroll-behavior", "auto", "important");
    const rect = element.getBoundingClientRect();
    const absoluteTop = scrollY + rect.top;
    const centeredTop = absoluteTop - Math.max(0, (innerHeight - rect.height) / 2);
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const targetY = Math.max(0, Math.min(maxScroll, centeredTop));
    scrollTo({ left: 0, top: targetY, behavior: "instant" });
    return { targetY, absoluteTop, maxScroll };
  });

  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const started = Date.now();
  let latest = null;

  while (Date.now() - started < timeout) {
    latest = await page.$eval("[data-laws-scene-field]", element => {
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
        scrollX,
        scrollY,
        intersectionWidth: Math.max(0, Math.min(innerWidth, rect.right) - Math.max(0, rect.left)),
        intersectionHeight: Math.max(0, Math.min(innerHeight, rect.bottom) - Math.max(0, rect.top))
      };
    });
    if (latest.intersectionWidth >= 80 && latest.intersectionHeight >= 60) break;
    await sleep(32);
  }

  if (!latest || latest.intersectionWidth < 80 || latest.intersectionHeight < 60) {
    const error = new Error("SCENE_SCROLL_POSITIONING_FAILED");
    error.geometry = latest;
    error.target = target;
    throw error;
  }

  return page.$eval("[data-laws-scene-field]", (element, settlement) => {
    const rect = element.getBoundingClientRect();
    const padding = 18;
    const usable = { left: Math.max(padding, rect.left + padding), top: Math.max(padding, rect.top + padding), right: Math.min(innerWidth - padding, rect.right - padding), bottom: Math.min(innerHeight - padding, rect.bottom - padding) };
    const width = usable.right - usable.left;
    const height = usable.bottom - usable.top;
    const start = { x: usable.left + width * 0.24, y: usable.top + height * 0.52 };
    const deltaX = Math.min(Math.max(30, width * 0.09), Math.max(30, width * 0.24));
    const end = { x: Math.min(usable.right - 2, start.x + deltaX), y: Math.min(usable.bottom - 2, start.y + Math.min(12, height * 0.08)) };
    const insideViewport = point => point.x >= 0 && point.x <= innerWidth && point.y >= 0 && point.y <= innerHeight;
    const insideField = point => point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
    return {
      rectangle: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height },
      usable: { ...usable, width, height }, start, end,
      startInsideViewport: insideViewport(start), endInsideViewport: insideViewport(end), startInsideField: insideField(start), endInsideField: insideField(end),
      viewport: { width: innerWidth, height: innerHeight, scrollX, scrollY },
      settlement
    };
  }, { elapsedMs: Date.now() - started, target, finalSample: latest });
}

async function dispatchTouchDrag(page, start, end) {
  const session = await page.createCDPSession();
  try {
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: start.x, y: start.y, radiusX: 2, radiusY: 2, force: 1, id: 1 }] });
    for (let step = 1; step <= 8; step += 1) {
      const amount = step / 8;
      await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: start.x + (end.x - start.x) * amount, y: start.y + (end.y - start.y) * amount, radiusX: 2, radiusY: 2, force: 1, id: 1 }] });
      await sleep(18);
    }
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  } finally {
    await session.detach().catch(() => {});
  }
}
async function dispatchMouseDrag(page, start, end) {
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(end.x, end.y, { steps: 8 });
  await page.mouse.up();
}
async function captureFailureState(page, profileEvidence, failureLabel) {
  if (!page) return;
  try { profileEvidence.finalState = await runtimeSnapshot(page); } catch (error) { profileEvidence.finalStateCaptureError = String(error?.stack || error); }
  const file = `${profileEvidence.profile.toLowerCase()}-${failureLabel}.png`;
  try {
    await page.screenshot({ path: path.join(SHOTS, file), fullPage: true });
    profileEvidence.failureTimeScreenshot = file;
  } catch (error) {
    profileEvidence.failureTimeScreenshotError = String(error?.stack || error);
  }
}

if (failures.length) {
  writeReceipt({ phase: "SOURCE_ASSERTIONS", browserExecuted: false });
  process.exitCode = 1;
} else {
  fs.rmSync(SHOTS, { recursive: true, force: true });
  fs.mkdirSync(SHOTS, { recursive: true });
  let browser = null;
  try {
    browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--enable-webgl", "--ignore-gpu-blocklist", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
    for (const profile of VIEWPORTS) {
      let page = null;
      const telemetry = { pageErrors: [], requestFailures: [], consoleErrors: [], httpErrors: [] };
      const profileEvidence = { profile: profile.id, inputType: profile.inputType, labelStateLedger: [], readinessSamples: [], runtimeReadiness: null, initial: null, orientationCorrespondence: [], dragEvidence: [], testPrimary: null, testCluster: null, researchPrimary: null, researchCluster: null, lawCluster: null, telemetry, failure: null, finalState: null, failureTimeScreenshot: "" };
      try {
        page = await browser.newPage();
        await page.setViewport({ width: profile.width, height: profile.height, deviceScaleFactor: 1, isMobile: profile.mobile, hasTouch: profile.mobile });
        page.on("pageerror", error => telemetry.pageErrors.push(String(error?.message || error)));
        page.on("requestfailed", request => telemetry.requestFailures.push({ url: request.url(), error: request.failure()?.errorText || "" }));
        page.on("response", response => {
          const status = response.status();
          if (status >= 400) telemetry.httpErrors.push({ url: response.url(), status });
        });
        page.on("console", message => { if (message.type() === "error") telemetry.consoleErrors.push(message.text()); });
        const response = await page.goto(`${ORIGIN}/laws/`, { waitUntil: "domcontentloaded", timeout: 45000 });
        await waitForRuntimeReadiness(page, profileEvidence, 45000);

        const setPrimary = async id => {
          const correspondence = await page.evaluate((authorityId, quaternion) => {
            const controller = globalThis.DGB_LAWS_CONTROLLER;
            const inferred = globalThis.DGB_LAWS_INTERACTIONS?.primaryDirectionForQuaternion?.(quaternion) || "";
            if (!controller?.beginOrbitGesture?.()) return { accepted: false, inferred, phase: "begin" };
            if (controller.requestOrbitPreview({ quaternion, primaryId: authorityId }) === false) return { accepted: false, inferred, phase: "preview" };
            return { accepted: controller.requestOrbitCommit() !== false, inferred, phase: "commit" };
          }, id, CANONICAL[id]);
          profileEvidence.orientationCorrespondence.push({ authorityId: id, quaternion: CANONICAL[id], ...correspondence });
          assert(correspondence.inferred === id, "ORIENTATION_PRIMARY_CORRESPONDENCE_INVALID", { id, correspondence }, profile.id);
          assert(correspondence.accepted, "PRIMARY_AUTHORITY_COMMIT_REJECTED", { id, correspondence }, profile.id);
          if (!correspondence.accepted || correspondence.inferred !== id) throw new Error(`PRIMARY_AUTHORITY_SETUP_FAILED:${id}`);
          await page.waitForFunction(authorityId => {
            const root = document.querySelector("[data-laws-root]");
            const frame = globalThis.DGB_LAWS_CONTROLLER?.getFrameState?.();
            return (root?.dataset.lawsSpatialPrimaryId || frame?.orbitFocus || "") === authorityId;
          }, { timeout: 15000 }, id);
          await sleep(180);
          const labelState = await runtimeSnapshot(page);
          const activeLabel = labelState.outerAuthorityLabelStates.find(record => record.id === id);
          const suppressedLabels = labelState.outerAuthorityLabelStates.filter(record => record.id !== id);
          profileEvidence.labelStateLedger.push({ phase: "PRIMARY_TRANSITION", authorityId: id, state: labelState.outerAuthorityLabelStates });
          assert(labelState.visibleLabelCount === 1, "SOLE_VISIBLE_LABEL_COUNT_INVALID", labelState, profile.id);
          assert(labelState.soleVisibleLabelIdentity === id && labelState.controllerPrimaryIdentity === id && labelState.projectionPrimaryIdentity === id, "SOLE_VISIBLE_LABEL_IDENTITY_INVALID", labelState, profile.id);
          assert(Boolean(activeLabel && activeLabel.visible && activeLabel.primary && !activeLabel.hidden && activeLabel.tabIndex >= 0 && activeLabel.ariaHidden !== "true" && activeLabel.pointerEvents !== "none" && activeLabel.ariaLabel), "PRIMARY_LABEL_ACCESSIBILITY_OR_POINTER_STATE_INVALID", activeLabel, profile.id);
          assert(suppressedLabels.length === 5 && suppressedLabels.every(record => !record.visible && record.hidden && record.tabIndex < 0 && record.ariaHidden === "true" && record.pointerEvents === "none" && record.ariaLabel), "NONPRIMARY_LABEL_SUPPRESSION_INVALID", suppressedLabels, profile.id);
        };

        const dragAndSettle = async id => {
          await setPrimary(id);
          const geometry = await scrollSceneIntoView(page);
          const coordinateValid = geometry.usable.width >= 80 && geometry.usable.height >= 60 && geometry.startInsideViewport && geometry.endInsideViewport && geometry.startInsideField && geometry.endInsideField;
          assert(coordinateValid, "DRAG_COORDINATE_ENVELOPE_INVALID", { authorityId: id, geometry }, profile.id);
          if (!coordinateValid) throw new Error(`DRAG_COORDINATE_ENVELOPE_INVALID:${id}`);
          const before = await page.evaluate(() => {
            const receipt = globalThis.DGB_LAWS_INTERACTIONS_RECEIPT || {};
            return { settlementCount: Number(receipt.settlementCount || 0), lastAction: receipt.lastAction || "", primaryIdentity: document.querySelector("[data-laws-root]")?.dataset.lawsSpatialPrimaryId || "" };
          });
          const evidence = { authorityId: id, inputType: profile.inputType, geometry, before, acceptedActivity: null, after: null, timeout: null };
          profileEvidence.dragEvidence.push(evidence);
          await page.evaluate(() => {
            const authorityIds = ["flow", "integrity", "reality", "structure", "test", "research"];
            const root = document.querySelector("[data-laws-root]");
            const monitor = { active: true, samples: [], last: "" };
            const isVisible = element => {
              if (!element || element.hidden) return false;
              const style = getComputedStyle(element);
              const rect = element.getBoundingClientRect();
              return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0.01 && rect.width > 0 && rect.height > 0;
            };
            const sample = () => {
              const primary = root?.dataset.lawsSpatialPrimaryId || "";
              const visibleIds = authorityIds.filter(authorityId => isVisible(document.querySelector(`[data-laws-projected-category-label="${authorityId}"]`)));
              const signature = `${primary}:${visibleIds.join(",")}`;
              if (signature !== monitor.last) { monitor.last = signature; monitor.samples.push({ primary, visibleIds }); }
              if (monitor.active) requestAnimationFrame(sample);
            };
            globalThis.__LAWS_CP5_LABEL_MONITOR = monitor;
            sample();
          });
          if (profile.inputType === "touch") await dispatchTouchDrag(page, geometry.start, geometry.end);
          else await dispatchMouseDrag(page, geometry.start, geometry.end);
          try {
            await page.waitForFunction(previous => {
              const receipt = globalThis.DGB_LAWS_INTERACTIONS_RECEIPT || {};
              return Number(receipt.settlementCount || 0) > previous.settlementCount || String(receipt.lastAction || "") !== previous.lastAction;
            }, { timeout: 5000 }, before);
            evidence.acceptedActivity = await page.evaluate(() => globalThis.DGB_LAWS_INTERACTIONS_RECEIPT || null);
            await page.waitForFunction(value => Number(globalThis.DGB_LAWS_INTERACTIONS_RECEIPT?.settlementCount || 0) > value, { timeout: 15000 }, before.settlementCount);
            evidence.after = await page.evaluate(() => {
              const receipt = globalThis.DGB_LAWS_INTERACTIONS_RECEIPT || {};
              const root = document.querySelector("[data-laws-root]");
              const frame = globalThis.DGB_LAWS_CONTROLLER?.getFrameState?.();
              return { settlementCount: Number(receipt.settlementCount || 0), lastAction: receipt.lastAction || "", resultingPrimaryIdentity: root?.dataset.lawsSpatialPrimaryId || frame?.orbitFocus || "", interactionReceipt: receipt };
            });
            evidence.after.settlementDelta = evidence.after.settlementCount - before.settlementCount;
            evidence.motionLabelLedger = await page.evaluate(() => {
              const monitor = globalThis.__LAWS_CP5_LABEL_MONITOR;
              if (!monitor) return [];
              monitor.active = false;
              return monitor.samples.slice();
            });
            assert(evidence.motionLabelLedger.length > 0, "ORBIT_LABEL_MOTION_LEDGER_EMPTY", evidence, profile.id);
            assert(evidence.motionLabelLedger.every(sample => sample.visibleIds.length === 1 && sample.visibleIds[0] === sample.primary), "ORBIT_LABEL_CONTINUITY_INVALID", evidence.motionLabelLedger, profile.id);
            const settledLabelState = await runtimeSnapshot(page);
            profileEvidence.labelStateLedger.push({ phase: "SETTLEMENT", authorityId: settledLabelState.controllerPrimaryIdentity, state: settledLabelState.outerAuthorityLabelStates });
            assert(settledLabelState.visibleLabelCount === 1 && settledLabelState.soleVisibleLabelIdentity === settledLabelState.controllerPrimaryIdentity, "SETTLED_LABEL_STATE_INVALID", settledLabelState, profile.id);
          } catch (error) {
            await page.evaluate(() => { if (globalThis.__LAWS_CP5_LABEL_MONITOR) globalThis.__LAWS_CP5_LABEL_MONITOR.active = false; }).catch(() => {});
            evidence.timeout = { error: String(error?.stack || error), state: await runtimeSnapshot(page) };
            throw error;
          }
        };

        const openCluster = async id => {
          const accepted = await page.evaluate(authorityId => globalThis.DGB_LAWS_CONTROLLER.requestCategorySelection(authorityId), id);
          assert(accepted !== false, "CLUSTER_SELECTION_REJECTED", id, profile.id);
          if (accepted === false) throw new Error(`CLUSTER_SELECTION_REJECTED:${id}`);
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

        profileEvidence.initial = await inspect(page, "INITIAL_SIX_AUTHORITY_FIELD");
        const initial = profileEvidence.initial;
        assert([200, 304].includes(response?.status()), "LAWS_ROUTE_STATUS_INVALID", response?.status(), profile.id);
        assert(initial.installedLabelCount === 6, "INSTALLED_AUTHORITY_LABEL_COUNT_INVALID", initial, profile.id);
        assert(initial.categoryProjectionCount === 6 && initial.visibleCategoryProjectionCount === 6, "PROJECTED_AUTHORITY_COUNT_INVALID", initial, profile.id);
        assert(initial.visibleLabelCount === 1, "VISIBLE_AUTHORITY_LABEL_COUNT_INVALID", initial, profile.id);
        assert(initial.soleVisibleLabelIdentity === initial.controllerPrimaryIdentity, "INITIAL_SOLE_VISIBLE_LABEL_IDENTITY_INVALID", initial, profile.id);
        assert(initial.outerAuthorityLabelStates.filter(record => !record.visible).length === 5 && initial.outerAuthorityLabelStates.filter(record => !record.visible).every(record => record.hidden && record.tabIndex < 0 && record.ariaHidden === "true" && record.pointerEvents === "none"), "INITIAL_NONPRIMARY_LABEL_SUPPRESSION_INVALID", initial.outerAuthorityLabelStates, profile.id);
        assert(initial.visiblePrimaryCount === 1, "PRIMARY_AUTHORITY_COUNT_INVALID", initial, profile.id);
        assert(initial.controllerPrimaryIdentity === initial.projectionPrimaryIdentity, "PRIMARY_AUTHORITY_IDENTITY_DIVERGENCE", initial, profile.id);
        assert(JSON.stringify(initial.categoryProjectionIds) === JSON.stringify([...AUTHORITY_IDS].sort()), "AUTHORITY_RUNTIME_IDENTITIES_INVALID", initial.categoryProjectionIds, profile.id);
        assert(initial.globeSurfacePresent, "FIXED_CENTER_GLOBE_SURFACE_MISSING", initial, profile.id);
        assert(initial.centerCompassReachable, "CENTER_COMPASS_NOT_REACHABLE", initial, profile.id);
        assert(initial.horizontalOverflow <= 1 && initial.h1Count === 1 && initial.bodyHeight > 0, "INITIAL_LAYOUT_INVALID", initial, profile.id);
        assert(profile.inputType === (profile.mobile ? "touch" : "mouse"), "PROFILE_INPUT_TYPE_INVALID", profile, profile.id);
        await page.screenshot({ path: path.join(SHOTS, `${profile.id.toLowerCase()}-initial-six-authority-field.png`), fullPage: true });

        for (const id of AUTHORITY_IDS) {
          try { await dragAndSettle(id); }
          catch (error) {
            failures.push({ profile: profile.id, id: "DRAG_AND_SETTLEMENT_ABORTED", observed: { authorityId: id, inputType: profile.inputType, error: String(error?.stack || error), dragEvidence: profileEvidence.dragEvidence.at(-1) || null } });
            throw error;
          }
        }
        profileEvidence.settlement = await inspect(page, "SIX_AUTHORITY_DRAG_SETTLEMENT");
        assert(profileEvidence.settlement.settlementCount >= AUTHORITY_IDS.length, "SIX_AUTHORITY_SETTLEMENT_COUNT_INVALID", profileEvidence.settlement, profile.id);

        await setPrimary("test");
        profileEvidence.testPrimary = await inspect(page, "TEST_PRIMARY");
        assert(profileEvidence.testPrimary.controllerPrimaryIdentity === "test" && profileEvidence.testPrimary.visiblePrimaryCount === 1, "TEST_PRIMARY_INVALID", profileEvidence.testPrimary, profile.id);
        await page.screenshot({ path: path.join(SHOTS, `${profile.id.toLowerCase()}-test-primary.png`), fullPage: true });
        await openCluster("test");
        profileEvidence.testCluster = await inspect(page, "TEST_CLUSTER_OPEN");
        assert(profileEvidence.testCluster.clusterMemberIds.length === 4, "TEST_CLUSTER_MEMBER_COUNT_INVALID", profileEvidence.testCluster, profile.id);
        assert(profileEvidence.testCluster.visibleLabelCount === 0, "OUTER_LABEL_VISIBLE_DURING_TEST_CLUSTER", profileEvidence.testCluster, profile.id);
        await page.screenshot({ path: path.join(SHOTS, `${profile.id.toLowerCase()}-test-cluster-open.png`), fullPage: true });

        await returnToConstellation();
        await setPrimary("research");
        profileEvidence.researchPrimary = await inspect(page, "RESEARCH_PRIMARY");
        assert(profileEvidence.researchPrimary.controllerPrimaryIdentity === "research" && profileEvidence.researchPrimary.visiblePrimaryCount === 1, "RESEARCH_PRIMARY_INVALID", profileEvidence.researchPrimary, profile.id);
        await page.screenshot({ path: path.join(SHOTS, `${profile.id.toLowerCase()}-research-primary.png`), fullPage: true });
        await openCluster("research");
        profileEvidence.researchCluster = await inspect(page, "RESEARCH_CLUSTER_OPEN");
        assert(profileEvidence.researchCluster.clusterMemberIds.length === 4, "RESEARCH_CLUSTER_MEMBER_COUNT_INVALID", profileEvidence.researchCluster, profile.id);
        assert(profileEvidence.researchCluster.visibleLabelCount === 0, "OUTER_LABEL_VISIBLE_DURING_RESEARCH_CLUSTER", profileEvidence.researchCluster, profile.id);
        await page.screenshot({ path: path.join(SHOTS, `${profile.id.toLowerCase()}-research-cluster-open.png`), fullPage: true });

        await returnToConstellation();
        await openCluster("flow");
        profileEvidence.lawCluster = await inspect(page, "REPRESENTATIVE_FLOW_LAW_CLUSTER");
        assert(profileEvidence.lawCluster.clusterMemberIds.length === 4, "LAW_CLUSTER_MEMBER_COUNT_INVALID", profileEvidence.lawCluster, profile.id);
        assert(profileEvidence.lawCluster.visibleLabelCount === 0, "OUTER_LABEL_VISIBLE_DURING_LAW_CLUSTER", profileEvidence.lawCluster, profile.id);
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

        const actionableHttpErrors = telemetry.httpErrors.filter(record => {
          try {
            return new URL(record.url).pathname !== "/favicon.ico";
          } catch {
            return true;
          }
        });
        const favicon404Observed = telemetry.httpErrors.some(record => {
          try {
            return record.status === 404 && new URL(record.url).pathname === "/favicon.ico";
          } catch {
            return false;
          }
        });
        const actionableConsoleErrors = telemetry.consoleErrors.filter(message => {
          return !(favicon404Observed && actionableHttpErrors.length === 0 && message.includes("Failed to load resource"));
        });
        const actionableTelemetry = {
          pageErrors: telemetry.pageErrors,
          requestFailures: telemetry.requestFailures,
          consoleErrors: actionableConsoleErrors,
          httpErrors: actionableHttpErrors,
          ignoredFavicon404: favicon404Observed
        };
        assert(actionableTelemetry.pageErrors.length === 0 && actionableTelemetry.requestFailures.length === 0 && actionableTelemetry.consoleErrors.length === 0 && actionableTelemetry.httpErrors.length === 0, "RUNTIME_TELEMETRY_FAILURE", actionableTelemetry, profile.id);
      } catch (error) {
        profileEvidence.failure = String(error?.stack || error);
        if (!failures.some(failure => failure.profile === profile.id && failure.id === "PROFILE_EXECUTION_ABORTED")) failures.push({ profile: profile.id, id: "PROFILE_EXECUTION_ABORTED", observed: profileEvidence.failure });
        await captureFailureState(page, profileEvidence, "failure-time");
      } finally {
        if (page) {
          if (!profileEvidence.finalState) {
            try { profileEvidence.finalState = await runtimeSnapshot(page); } catch (error) { profileEvidence.finalStateCaptureError = String(error?.stack || error); }
          }
          if (!profileEvidence.failureTimeScreenshot) {
            const finalFile = `${profileEvidence.profile.toLowerCase()}-final-state.png`;
            try { await page.screenshot({ path: path.join(SHOTS, finalFile), fullPage: true }); profileEvidence.finalStateScreenshot = finalFile; }
            catch (error) { profileEvidence.finalStateScreenshotError = String(error?.stack || error); }
          }
          await page.close().catch(() => {});
        }
        observations.push(profileEvidence);
      }
    }
    assert(routes.length === PROFILE.totalChildDestinations, "TOTAL_ROUTE_EXECUTION_COUNT_INVALID", routes.length, "browser");
    const receipt = writeReceipt({ phase: "BROWSER_EXECUTION", browserExecuted: true });
    if (!receipt.pass) process.exitCode = 1;
  } catch (error) {
    if (!failures.some(failure => failure.profile === "browser" && failure.id === "BROWSER_EXECUTION_ABORTED")) failures.push({ profile: "browser", id: "BROWSER_EXECUTION_ABORTED", observed: String(error?.stack || error) });
    writeReceipt({ phase: "BROWSER_EXECUTION_ABORTED", browserExecuted: true });
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}
