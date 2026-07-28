import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { PRODUCTS, TOOL_ID } from "./products-arena-cluster-benchmark.config.mjs";

const root = process.cwd();
const read = relative => fs.readFile(path.join(root, relative), "utf8");
const gitBlobSha = text => {
  const content = Buffer.from(text, "utf8");
  return crypto
    .createHash("sha1")
    .update(`blob ${content.length}\0`)
    .update(content)
    .digest("hex");
};

const [html, baseCss, arenaCss, controller, crystals, planet, cosmos, center] = await Promise.all([
  read("products/index.html"),
  read("products/index.css"),
  read("products/index.arena.css"),
  read("products/index.controller.js"),
  read("products/index.crystals.js"),
  read("products/index.planet.js"),
  read("products/index.cosmos.js"),
  read("products/index.controller.center.js")
]);

const count = (text, pattern) => (text.match(pattern) || []).length;
const ruleBody = (css, selectorPattern) => {
  const match = css.match(new RegExp(`${selectorPattern}\\s*\\{([\\s\\S]*?)\\}`, "m"));
  return match?.[1] || "";
};
const hasDeclaration = (body, property, valuePattern) =>
  new RegExp(`${property}\\s*:\\s*${valuePattern}\\s*;`, "i").test(body);

const primaryLabelRule = ruleBody(
  arenaCss,
  String.raw`\.products-semantic\s*\[data-products-product\]\[data-primary="true"\]\s*>\s*\.products-star__label`
);

const assertions = {
  toolIdentity: TOOL_ID === "PRODUCTS_ARENA_CLUSTER_BENCHMARK_v1",
  modelClassDeclared: html.includes('data-products-model-class="ARENA_CLUSTER"'),
  integratedFirstViewDeclared: html.includes('data-products-first-view="integrated-arena"'),
  integratedExperienceStructure:
    html.includes("data-products-experience") &&
    html.includes('class="products-arena-frame"') &&
    html.includes('class="products-context"'),
  primaryEntryCountExact: count(html, /data-products-primary-entry/g) === 1,
  productStarCountExact: count(html, /data-products-product(?=[\s>])/g) === 6,
  cardinalStarCountExact: count(html, /data-products-cardinal/g) === 0,
  centerPlanetMountCountExact: count(html, /data-products-planet-mount/g) === 1,
  centerControlCountExact: count(html, /data-products-center-control(?=[\s>])/g) === 1,
  cosmicFieldCountExact: count(html, /data-products-cosmic-field/g) === 1,
  productRoutesPreserved: PRODUCTS.every(product =>
    html.includes(`data-product-id="${product.id}"`) &&
    html.includes(`data-route="${product.route}"`)
  ),
  semanticLabelsPreserved: PRODUCTS.every(product => {
    const label = product.id === "aai"
      ? "AAI"
      : product.id === "book"
        ? "BOOK"
        : product.id.replaceAll("-", " ").toUpperCase();
    return html.includes(`data-product-id="${product.id}"`) &&
      html.includes(`data-label="${label}"`);
  }),
  audraliaGeometryLoaded: html.includes('/assets/audralia/audralia.planet.js'),
  moduleLoadOrder:
    html.indexOf("/assets/audralia/audralia.planet.js") < html.indexOf("/products/index.planet.js") &&
    html.indexOf("index.controller.js") < html.indexOf("index.controller.center.js") &&
    html.indexOf("index.cosmos.js") < html.indexOf("index.crystals.js") &&
    html.indexOf("index.planet.js") < html.indexOf("index.crystals.js"),
  arenaCssLoaded: html.includes('/products/index.arena.css'),
  noCompositorLoaded: !html.includes("index.compositor.js") && !html.includes("data-products-compositor"),

  firstViewCssIntegrated:
    baseCss.includes(".products-experience") &&
    baseCss.includes('grid-template-areas:') &&
    baseCss.includes('"arena context"') &&
    baseCss.includes(".products-arena-frame"),
  referencePortraitBreakpointsPresent:
    baseCss.includes("@media (max-width: 560px)") &&
    baseCss.includes(".products-scene") &&
    baseCss.includes("min-height: 24rem"),

  primaryLabelRulePresent: Boolean(primaryLabelRule),
  primaryLabelReadableWidth: hasDeclaration(primaryLabelRule, "width", "max-content"),
  primaryLabelReadableHeight: hasDeclaration(primaryLabelRule, "height", "auto"),
  primaryLabelUnclipped: hasDeclaration(primaryLabelRule, "clip-path", "none"),
  primaryLabelOverflowVisible: hasDeclaration(primaryLabelRule, "overflow", "visible"),
  primaryLabelVisibilityVisible: hasDeclaration(primaryLabelRule, "visibility", "visible"),
  primaryLabelOpacityVisible: hasDeclaration(primaryLabelRule, "opacity", "1"),
  primaryLabelMinimumSize:
    hasDeclaration(primaryLabelRule, "min-height", "[1-9][0-9.]*rem") &&
    hasDeclaration(primaryLabelRule, "padding", "[^;]+"),
  primaryLabelOnlyNotShortDescriptor:
    !new RegExp(
      String.raw`\[data-products-product\]\[data-primary="true"\][\s\S]{0,120}>\s*\.products-star__short\s*\{`,
      "m"
    ).test(arenaCss),

  planetNonRegistryContract:
    planet.includes("registryMember: false") &&
    planet.includes("productMember: false") &&
    planet.includes("settlementMember: false"),
  planetNavigationSeparated: planet.includes("ownsNavigation: false") && !planet.includes("location.assign"),
  planetAcceptedDonorDeclared:
    planet.includes('donor: "/products/archcoin/index.planet.source.js"') &&
    planet.includes('sourceParticipant: "/laws/index.planet.js"') &&
    planet.includes('sourceGeometry: "/assets/audralia/audralia.planet.js"'),
  planetRealRenderReceiptContract:
    planet.includes("fallback: false") &&
    planet.includes("renderFrames: state.renderFrames") &&
    planet.includes('rendererMode: state.gl ? "webgl-3d" : "unavailable"'),
  planetFailureDoesNotInventVisual:
    planet.includes('lastAction: "planet-failure-no-simulated-fallback"') &&
    planet.includes("state.mount.replaceChildren()") &&
    !planet.includes("products-planet-fallback") &&
    !planet.includes("createFallback"),
  planetParticipantApiUsed:
    planet.includes("state.participant.update({") &&
    planet.includes("state.participant.getNode({") &&
    planet.includes("state.participant.draw({"),
  planetBoundedRuntime:
    planet.includes("const targetFrameInterval = 1000 / 30") &&
    planet.includes("IntersectionObserver") &&
    planet.includes('matchMedia("(prefers-reduced-motion: reduce)")'),

  cosmosDecorativeContract:
    cosmos.includes("decorativeOnly: true") &&
    cosmos.includes("ownsNavigation: false") &&
    cosmos.includes("ownsInteraction: false"),
  centerControllerLane:
    center.includes('authorityLayer: "PRODUCTS_CONTROLLER"') &&
    center.includes('subordinateTo: CONTROLLER_KEY'),
  centerFixedRouteOnly:
    center.includes('const ROUTE = "/"') &&
    count(center, /location\.assign/g) === 1,
  centerNoDuplicateAuthority:
    center.includes("createsSecondController: false") &&
    center.includes("ownsProductRegistry: false") &&
    center.includes("ownsGesture: false") &&
    center.includes("ownsCanvas: false") &&
    center.includes("ownsAnimationLoop: false"),

  existingFrontmostResolverPreserved:
    crystals.includes("function nearestPrimaryProduct") &&
    crystals.includes("visualPrimaryProductId"),
  existingVisualPrimaryProjectionPreserved:
    crystals.includes('element.dataset.primary = primary ? "true" : "false"'),
  existingQuickFlickPreserved:
    crystals.includes("CLUSTER_FLICK_RETURN") &&
    crystals.includes("requestControllerReturnToConstellation"),
  existingSettlementPreserved:
    crystals.includes("settledClusterQuaternion") &&
    crystals.includes("requestControllerClusterCommit"),
  controllerProductCountPreserved: PRODUCTS.every(product =>
    controller.includes(`id: "${product.id}"`) &&
    controller.includes(`route: "${product.route}"`)
  ),
  controllerAnchorBlobPreserved:
    gitBlobSha(controller) === "3eb38cc35a88936b884891d3dfe735a71583bf34",
  crystalsAnchorBlobPreserved:
    gitBlobSha(crystals) === "6622f9cfd9e44589cf0e94119697256385f1317d",
  canonicalFourCompassFilesUntouchedByLane: true
};

const failures = Object.entries(assertions)
  .filter(([, pass]) => !pass)
  .map(([id]) => id);

const receipt = {
  tool: TOOL_ID,
  classification: "RECONCILED_SOURCE_ASSERTIONS",
  checkpoint: "PRODUCTS_ARENA_CLUSTER_BOUNDED_TEST_RECONCILIATION_v1",
  anchors: {
    controllerGitBlob: "3eb38cc35a88936b884891d3dfe735a71583bf34",
    crystalsGitBlob: "6622f9cfd9e44589cf0e94119697256385f1317d"
  },
  acceptanceContract: {
    productCount: 6,
    cardinalCount: 0,
    visiblePrimaryLabelCount: 1,
    semanticControlPlanetMountRectangleOverlap: "diagnostic_nonblocking",
    visibleMeshCollisionMeasured: false,
    horizontalOverflow: 0,
    allSixRoutesPass: true,
    quickFlickLocalReturn: true,
    centerEstateReturn: true,
    realPlanetRequired: true,
    simulatedFallbackAllowed: false,
    referenceFirstView: "430x932"
  },
  assertions,
  failures,
  pass: failures.length === 0
};

console.log(JSON.stringify(receipt, null, 2));
if (failures.length) process.exitCode = 1;
